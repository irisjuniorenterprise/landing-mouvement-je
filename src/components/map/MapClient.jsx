'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, GeoJSON, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import jeData from '@/lib/data/je.json';
import jcData from '@/lib/data/jc.json';
import { trackOnce } from '@/lib/utils/analytics';

const DEFAULT_CENTER = [34.5, 9.8];
const BREAKPOINT = 800;
// Fond neutre affiché autour/derrière la silhouette de la Tunisie, en
// l'absence de tout fond de carte du monde (voir MapContainer plus bas).
const MAP_BACKGROUND = '#e5e5e6';

function MapReadyBridge({ onReady }) {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    const initialTimer = setTimeout(() => map.invalidateSize(), 250);
    const resizeObserver = new ResizeObserver(() => map.invalidateSize());
    resizeObserver.observe(container);

    const handleFirstTilesLoaded = () => onReady?.();
    map.whenReady(() => {
      const revealTimer = setTimeout(handleFirstTilesLoaded, 120);
      return () => clearTimeout(revealTimer);
    });

    return () => {
      clearTimeout(initialTimer);
      resizeObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  return null;
}

function useResponsiveZoom() {
  const [zoom, setZoom] = useState(() => {
    if (typeof window === 'undefined') return 6;
    return window.innerWidth < BREAKPOINT ? 5 : 6;
  });

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${BREAKPOINT - 1}px)`);
    const handleChange = (e) => setZoom(e.matches ? 5 : 6);

    handleChange(mql);
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  return zoom;
}

// Sans fond de carte du monde, le cadrage doit rester proche de la Tunisie
// pour éviter qu'un dézoom excessif ne laisse un immense vide autour d'une
// toute petite silhouette. On verrouille donc la vue sur l'emprise réelle
// du GeoJSON (déjà limité à la Tunisie).
//
// IMPORTANT : le zoom minimum ne doit jamais dépasser le zoom responsive
// voulu (`defaultZoom` : 5 sur mobile, 6 sur desktop). Sinon, sur un petit
// écran, `map.getBoundsZoom` peut renvoyer un zoom plus fort que 5 pour
// que toute la Tunisie tienne dans le conteneur, et écraser silencieusement
// le zoom réduit qu'on souhaite sur mobile (voir Map.jsx / useResponsiveZoom).
function TunisiaBoundsController({ tunisiaBounds, defaultZoom }) {
  const map = useMap();
  const fittedRef = useRef(false);

  useEffect(() => {
    if (!tunisiaBounds?.isValid()) return;

    const padded = tunisiaBounds.pad(0.1);
    map.setMaxBounds(padded);

    const applyZoomConstraints = () => {
      const boundsZoom = map.getBoundsZoom(tunisiaBounds);
      // Plafonné par defaultZoom : jamais plus haut que le zoom
      // responsive voulu, seulement plus bas si le GeoJSON tient déjà
      // largement dans le conteneur à ce zoom.
      const effectiveMinZoom = Math.min(boundsZoom, defaultZoom);
      map.setMinZoom(effectiveMinZoom);

      if (!fittedRef.current) {
        // Premier cadrage : on centre sur la Tunisie au zoom responsive
        // souhaité plutôt que de laisser fitBounds choisir un zoom plus
        // fort pour "coller" exactement aux contours.
        map.setView(tunisiaBounds.getCenter(), defaultZoom);
        fittedRef.current = true;
      } else if (map.getZoom() < effectiveMinZoom) {
        map.setZoom(effectiveMinZoom);
      }
    };

    const timer = setTimeout(applyZoomConstraints, 300);
    const container = map.getContainer();
    const resizeObserver = new ResizeObserver(applyZoomConstraints);
    resizeObserver.observe(container);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tunisiaBounds, defaultZoom, map]);

  return null;
}

function RegionFocus({ geoData, selectedRegion, defaultZoom, tunisiaBounds }) {
  const map = useMap();

  useEffect(() => {
    if (selectedRegion && geoData?.features?.length) {
      const target = selectedRegion.normalize('NFC').trim();
      const feature = geoData.features.find(
        (f) => (f.properties?.gouv_fr || '').normalize('NFC').trim() === target
      );
      if (feature) {
        const bounds = L.geoJSON(feature).getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [24, 24] });
          return;
        }
      }
    }
    if (tunisiaBounds?.isValid()) {
      // Retour à la vue d'ensemble : on respecte le zoom responsive plutôt
      // que de laisser fitBounds recalculer un zoom potentiellement plus
      // fort (même logique que TunisiaBoundsController).
      map.setView(tunisiaBounds.getCenter(), defaultZoom);
    } else {
      map.setView(DEFAULT_CENTER, defaultZoom);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRegion, geoData, map, defaultZoom, tunisiaBounds]);

  return null;
}

function EntityFocus({ focusEntity, points, defaultZoom }) {
  const map = useMap();

  useEffect(() => {
    if (!focusEntity) return;
    const target = points.find((p) => p.type === focusEntity.type && p.id === focusEntity.id);
    if (!target) return;
    map.flyTo([target.lat, target.lng], Math.max(defaultZoom, 11), { duration: 0.8 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusEntity, map]);

  return null;
}

const MARKER_COLORS = {
  JE: '#C8102E',
  JC: '#F59E0B',
};

const markerIconCache = {};

const getMarkerIcon = (type, isActive) => {
  const cacheKey = `${type}-${isActive ? 'active' : 'default'}`;
  if (markerIconCache[cacheKey]) return markerIconCache[cacheKey];

  const color = MARKER_COLORS[type] || '#6B7280';
  const size = isActive ? 28 : 22;
  const icon = L.divIcon({
    className: 'custom-marker-icon',
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border: 3px solid #ffffff;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 3px 8px rgba(0,0,0,${isActive ? 0.5 : 0.35});
      ${isActive ? `outline: 2px solid ${color}; outline-offset: 2px;` : ''}
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });

  markerIconCache[cacheKey] = icon;
  return icon;
};

const normalizeRegionName = (value = '') => value.normalize('NFC').trim();

export default function MapClient({
  onRegionSelect,
  selectedRegion,
  selectedType,
  onMarkerSelect,
  onMarkerHover,
  onMarkerLeave,
  activeEntity,
  focusEntity,
  onReady,
}) {
  const [geoData, setGeoData] = useState(null);
  const readyCalledRef = useRef(false);
  const zoom = useResponsiveZoom();

  const notifyReady = () => {
    if (readyCalledRef.current) return;
    readyCalledRef.current = true;
    onReady?.();
  };

  useEffect(() => {
    fetch('/geojson/tunisia.geojson', { cache: 'no-store' })
      .then((r) => r.json())
      .then(setGeoData)
      .catch(() => setGeoData(null));

    const fallbackTimer = setTimeout(notifyReady, 2000);
    return () => clearTimeout(fallbackTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tunisiaBounds = useMemo(() => {
    if (!geoData?.features?.length) return null;
    const bounds = L.geoJSON(geoData).getBounds();
    return bounds.isValid() ? bounds : null;
  }, [geoData]);

  const allPoints = useMemo(
    () => [
      ...jeData.map((p) => ({ ...p, type: 'JE' })),
      ...jcData.map((p) => ({ ...p, type: 'JC' })),
    ],
    []
  );

  const coveredRegions = useMemo(
    () => new Set(allPoints.map((p) => normalizeRegionName(p.region))),
    [allPoints]
  );

  const REGION_RED = '#C8102E';
  const REGION_NEUTRAL = '#6B7280';
  const REGION_OPACITY_DEFAULT = 0.22;
  const REGION_OPACITY_HOVER = 0.5;
  const REGION_OPACITY_SELECTED = 0.6;
  // Sur fond de tuiles OSM, des frontières blanches tranchaient bien. Sur
  // fond neutre clair (MAP_BACKGROUND), il faut une teinte foncée pour que
  // les lignes de frontières restent nettement visibles.
  const REGION_BORDER = '#FFFFFF';

  const styleFeature = (feature) => {
    const name = feature?.properties?.gouv_fr || '';
    const normalizedName = normalizeRegionName(name);
    const isCovered = coveredRegions.has(normalizedName);
    const isSelected = selectedRegion && normalizedName === normalizeRegionName(selectedRegion);
    return {
      fillColor: isCovered ? REGION_RED : REGION_NEUTRAL,
      fillOpacity: isSelected ? REGION_OPACITY_SELECTED : REGION_OPACITY_DEFAULT,
      color: REGION_BORDER,
      weight: 1.5,
    };
  };

  const onEachFeature = (feature, layer) => {
    const name = feature.properties?.gouv_fr || '';
    const isCovered = coveredRegions.has(normalizeRegionName(name));
    layer.bindTooltip(name, { direction: 'center', className: 'font-sans text-xs' });

    const el = layer.getElement?.();
    if (el) {
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.setAttribute('aria-label', `${name}${isCovered ? '' : ' — non couverte'}`);
      el.addEventListener('keydown', (evt) => {
        if (evt.key === 'Enter' || evt.key === ' ') {
          evt.preventDefault();
          trackOnce('map_interaction', { trigger: 'region_click' });
          onRegionSelect && onRegionSelect(name);
        }
      });
    }

    layer.on({
      mouseover: (e) => {
        e.target.setStyle({
          fillColor: isCovered ? REGION_RED : REGION_NEUTRAL,
          fillOpacity: REGION_OPACITY_HOVER,
        });
        trackOnce('map_interaction', { trigger: 'region_hover' });
      },
      mouseout: (e) => e.target.setStyle(styleFeature(feature)),
      click: () => {
        trackOnce('map_interaction', { trigger: 'region_click' });
        onRegionSelect && onRegionSelect(name);
      },
    });
  };

  const points = allPoints.filter(
    (p) =>
      (!selectedRegion || normalizeRegionName(p.region) === normalizeRegionName(selectedRegion)) &&
      (!selectedType || p.type === selectedType)
  );

  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={zoom}
      scrollWheelZoom={false}
      attributionControl={false}
      maxBoundsViscosity={1.0}
      style={{ background: MAP_BACKGROUND }}
      className="w-full h-full"
    >
      <MapReadyBridge onReady={notifyReady} />
      <TunisiaBoundsController tunisiaBounds={tunisiaBounds} defaultZoom={zoom} />
      <RegionFocus
        geoData={geoData}
        selectedRegion={selectedRegion}
        defaultZoom={zoom}
        tunisiaBounds={tunisiaBounds}
      />
      <EntityFocus focusEntity={focusEntity} points={allPoints} defaultZoom={zoom} />
      {geoData?.features?.length > 0 && (
        <GeoJSON
          key={`tunisia-regions-${selectedRegion || 'all'}`}
          data={geoData}
          style={styleFeature}
          onEachFeature={onEachFeature}
        />
      )}
      {points.map((p) => {
        const isActive = activeEntity && activeEntity.type === p.type && activeEntity.id === p.id;
        const entityLabel = `${p.type === 'JE' ? 'Junior Entreprise' : 'Junior Création'}${p.nom ? ` — ${p.nom}` : ''}`;

        return (
          <Marker
            key={`${p.type}-${p.id}`}
            position={[p.lat, p.lng]}
            icon={getMarkerIcon(p.type, isActive)}
            eventHandlers={{
              add: (e) => {
                const el = e.target.getElement();
                if (!el) return;
                el.setAttribute('tabindex', '0');
                el.setAttribute('role', 'button');
                el.setAttribute('aria-label', entityLabel);

                const handleKeyDown = (evt) => {
                  if (evt.key === 'Enter' || evt.key === ' ') {
                    evt.preventDefault();
                    trackOnce('map_interaction', { trigger: 'marker_click' });
                    onMarkerSelect && onMarkerSelect({ type: p.type, id: p.id });
                  }
                };
                const handleFocus = () => onMarkerHover && onMarkerHover({ type: p.type, id: p.id });
                const handleBlur = () => onMarkerLeave && onMarkerLeave();

                el.addEventListener('keydown', handleKeyDown);
                el.addEventListener('focus', handleFocus);
                el.addEventListener('blur', handleBlur);
                el._a11yCleanup = () => {
                  el.removeEventListener('keydown', handleKeyDown);
                  el.removeEventListener('focus', handleFocus);
                  el.removeEventListener('blur', handleBlur);
                };
              },
              remove: (e) => {
                const el = e.target.getElement();
                el?._a11yCleanup?.();
              },
              click: () => {
                trackOnce('map_interaction', { trigger: 'marker_click' });
                onMarkerSelect && onMarkerSelect({ type: p.type, id: p.id });
              },
              mouseover: () => {
                trackOnce('map_interaction', { trigger: 'marker_hover' });
                onMarkerHover && onMarkerHover({ type: p.type, id: p.id });
              },
              mouseout: () => onMarkerLeave && onMarkerLeave(),
            }}
          />
        );
      })}
    </MapContainer>
  );
}