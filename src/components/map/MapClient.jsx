'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import jeData from '@/lib/data/je.json';
import jcData from '@/lib/data/jc.json';
import { trackOnce } from '@/lib/utils/analytics';

const DEFAULT_CENTER = [34.5, 9.8];
const BREAKPOINT = 800;

/**
 * Garantit un calcul de taille/position correct de la carte, y compris
 * quand son conteneur apparaît via une animation (fade/translate) du
 * parent : sans ce filet de sécurité, Leaflet peut figer sa grille de
 * tuiles sur des dimensions incorrectes si le layout bouge juste après
 * l'initialisation, produisant des tuiles grises/décalées au premier
 * chargement tant qu'on n'interagit pas avec la carte (drag/zoom).
 */
function MapReadyBridge({ onReady }) {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();

    // Un premier recalcul juste après le montage (laisse le temps au
    // navigateur de finaliser le layout de la section environnante).
    const initialTimer = setTimeout(() => map.invalidateSize(), 250);

    // Recalcule à chaque changement de taille du conteneur (fin de
    // transition d'entrée, redimensionnement de fenêtre, orientation...).
    const resizeObserver = new ResizeObserver(() => map.invalidateSize());
    resizeObserver.observe(container);

    // Signale au composant parent que la carte est prête à être révélée
    // (tuiles de base chargées) : on peut alors afficher le fondu.
    const handleFirstTilesLoaded = () => onReady?.();
    map.whenReady(() => {
      // whenReady garantit que le pane/les tuiles sont attachés au DOM ;
      // un léger délai supplémentaire absorbe le temps de premier rendu
      // des tuiles réseau avant de déclencher le fondu visuel.
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

/**
 * Détermine le niveau de zoom par défaut selon la largeur d'écran (5 en
 * dessous de 800px, 6 au-dessus), et le met à jour dynamiquement si la
 * fenêtre franchit ce seuil.
 */
function useResponsiveZoom() {
  const [zoom, setZoom] = useState(() => {
    if (typeof window === 'undefined') return 6;
    return window.innerWidth < BREAKPOINT ? 5 : 6;
  });

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${BREAKPOINT - 1}px)`);
    const handleChange = (e) => setZoom(e.matches ? 5 : 6);

    handleChange(mql); // valeur initiale (au cas où le SSR/CSR diffère)
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  return zoom;
}

/**
 * Pilote le "zoom sur la région" : que la région soit choisie en cliquant
 * sur le contour dans la carte OU via le <select> externe (formulaire),
 * ce composant cadre la vue sur les limites du gouvernorat correspondant.
 * Quand aucune région n'est sélectionnée, revient à la vue par défaut
 * (centre Tunisie + zoom responsive).
 */
function RegionFocus({ geoData, selectedRegion, defaultZoom }) {
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
    map.setView(DEFAULT_CENTER, defaultZoom);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRegion, geoData, map, defaultZoom]);

  return null;
}

// Couleurs alignées sur la légende
const MARKER_COLORS = {
  JE: '#C8102E',
  JC: '#F59E0B',
};

const markerIconCache = {};

const getMarkerIcon = (type) => {
  if (markerIconCache[type]) return markerIconCache[type];

  const color = MARKER_COLORS[type] || '#6B7280';
  const icon = L.divIcon({
    className: 'custom-marker-icon',
    html: `<div style="
      width: 22px;
      height: 22px;
      background: ${color};
      border: 3px solid #ffffff;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 3px 8px rgba(0,0,0,0.35);
    "></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 22],
    popupAnchor: [0, -22],
  });

  markerIconCache[type] = icon;
  return icon;
};

// Normalise une chaîne (accents/espaces) pour fiabiliser la comparaison
// entre le nom de région du GeoJSON (`gouv_fr`) et celui des données
// JE/JC (`region`), au cas où l'une des deux sources contiendrait des
// espaces superflus ou une forme Unicode différente des accents.
const normalizeRegionName = (value = '') => value.normalize('NFC').trim();

export default function MapClient({ onRegionSelect, selectedRegion, onMarkerSelect, onReady }) {
  const [geoData, setGeoData] = useState(null);
  const readyCalledRef = useRef(false);
  const zoom = useResponsiveZoom();

  const notifyReady = () => {
    if (readyCalledRef.current) return;
    readyCalledRef.current = true;
    onReady?.();
  };

  useEffect(() => {
    // cache: 'no-store' évite qu'un navigateur (ou le cache HTTP du dev
    // server) ne continue de servir une ancienne version du GeoJSON après
    // sa mise à jour côté fichier statique.
    fetch('/geojson/tunisia.geojson', { cache: 'no-store' })
      .then((r) => r.json())
      .then(setGeoData)
      .catch(() => setGeoData(null));

    // Filet de sécurité : si le signal "ready" tarde (réseau lent,
    // tuiles indisponibles...), la carte reste visible malgré tout au
    // bout d'un délai raisonnable plutôt que de rester invisible.
    const fallbackTimer = setTimeout(notifyReady, 2000);
    return () => clearTimeout(fallbackTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allPoints = useMemo(
    () => [
      ...jeData.map((p) => ({ ...p, type: 'JE' })),
      ...jcData.map((p) => ({ ...p, type: 'JC' })),
    ],
    []
  );

  // Régions couvertes par au moins une JE ou JC (§5.3 du cahier des
  // charges : "les régions contenant des Juniors Entreprises seront mises
  // en évidence... colorées en rouge"). Les autres régions restent
  // neutres : elles demeurent cliquables/filtrables, mais ne doivent pas
  // laisser croire qu'une Junior y est implantée.
  const coveredRegions = useMemo(
    () => new Set(allPoints.map((p) => normalizeRegionName(p.region))),
    [allPoints]
  );

  // Rouge institutionnel (#C8102E, charte graphique CTJE) réservé aux
  // régions couvertes ; gris neutre pour les autres. Dans les deux cas,
  // l'opacité augmente pour distinguer "région cliquable" (subtile) →
  // "survolée" → "sélectionnée" (persiste même après que la souris quitte
  // la région), sans jamais couvrir la carte d'une couleur pleine.
  const REGION_RED = '#C8102E';
  const REGION_NEUTRAL = '#D1D5DB';
  const REGION_OPACITY_DEFAULT = 0.12;
  const REGION_OPACITY_HOVER = 0.45;
  const REGION_OPACITY_SELECTED = 0.55;

  const styleFeature = (feature) => {
    const name = feature?.properties?.gouv_fr || '';
    const normalizedName = normalizeRegionName(name);
    const isCovered = coveredRegions.has(normalizedName);
    const isSelected = selectedRegion && normalizedName === normalizeRegionName(selectedRegion);
    return {
      fillColor: isCovered ? REGION_RED : REGION_NEUTRAL,
      fillOpacity: isSelected ? REGION_OPACITY_SELECTED : REGION_OPACITY_DEFAULT,
      color: '#FFFFFF',
      weight: 1.5,
    };
  };

  const onEachFeature = (feature, layer) => {
    const name = feature.properties?.gouv_fr || '';
    const isCovered = coveredRegions.has(normalizeRegionName(name));
    layer.bindTooltip(name, { direction: 'center', className: 'font-sans text-xs' });
    layer.on({
      mouseover: (e) => {
        e.target.setStyle({
          fillColor: isCovered ? REGION_RED : REGION_NEUTRAL,
          fillOpacity: REGION_OPACITY_HOVER,
        });
        // KPI 2 (Taux d'interaction avec la carte) : une seule fois par
        // visite, dès le premier survol/clic sur la carte.
        trackOnce('map_interaction', { trigger: 'region_hover' });
      },
      mouseout: (e) => e.target.setStyle(styleFeature(feature)),
      click: () => {
        trackOnce('map_interaction', { trigger: 'region_click' });
        onRegionSelect && onRegionSelect(name);
      },
    });
  };

  const points = selectedRegion
    ? allPoints.filter((p) => normalizeRegionName(p.region) === normalizeRegionName(selectedRegion))
    : allPoints;

  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={zoom}
      scrollWheelZoom={false}
      attributionControl={false} // ← désactive l'attribution par défaut
      className="w-full h-full"
    >
      {/* Tuiles OpenStreetMap France → noms en français */}
      <TileLayer
        url="https://tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.fr/">OpenStreetMap France</a>'
      />
      <MapReadyBridge onReady={notifyReady} />
      <RegionFocus geoData={geoData} selectedRegion={selectedRegion} defaultZoom={zoom} />
      {geoData?.features?.length > 0 && (
        <GeoJSON
          key={`tunisia-regions-${selectedRegion || 'all'}`}
          data={geoData}
          style={styleFeature}
          onEachFeature={onEachFeature}
        />
      )}
      {points.map((p) => (
        <Marker
          key={`${p.type}-${p.id}`}
          position={[p.lat, p.lng]}
          icon={getMarkerIcon(p.type)}
          eventHandlers={{
            click: () => {
              trackOnce('map_interaction', { trigger: 'marker_click' });
              onMarkerSelect && onMarkerSelect({ type: p.type, id: p.id });
            },
          }}
        />
      ))}
    </MapContainer>
  );
}