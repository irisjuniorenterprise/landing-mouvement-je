'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import jeData from '@/lib/data/je.json';
import jcData from '@/lib/data/jc.json';

const DEFAULT_CENTER = [34.5, 9.8];
const BREAKPOINT = 800;

function MapReadyBridge({ onReady }) {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    const initialTimer = setTimeout(() => map.invalidateSize(), 250);
    const resizeObserver = new ResizeObserver(() => map.invalidateSize());
    resizeObserver.observe(container);
    const revealTimer = setTimeout(() => onReady?.(), 120);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(revealTimer);
      resizeObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  return null;
}

/**
 * Détermine le niveau de zoom par défaut selon la largeur d'écran (5 en
 * dessous de 800px, 6 au-dessus).
 */
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

/**
 * Pilote le "zoom sur la région" : cadre la vue sur les limites du
 * gouvernorat sélectionné. Revient à la vue par défaut si aucune région
 * n'est sélectionnée.
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

const MARKER_COLORS = { JE: '#C8102E', JC: '#F59E0B' };
const markerIconCache = {};

const getMarkerIcon = (type) => {
  if (markerIconCache[type]) return markerIconCache[type];
  const color = MARKER_COLORS[type] || '#6B7280';
  const icon = L.divIcon({
    className: 'custom-marker-icon',
    html: `<div style="width:22px;height:22px;background:${color};border:3px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 3px 8px rgba(0,0,0,0.35);"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 22],
    popupAnchor: [0, -22],
  });
  markerIconCache[type] = icon;
  return icon;
};

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
    fetch('/geojson/tunisia.geojson', { cache: 'no-store' })
      .then((r) => r.json())
      .then(setGeoData)
      .catch(() => setGeoData(null));

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

  const coveredRegions = useMemo(
    () => new Set(allPoints.map((p) => normalizeRegionName(p.region))),
    [allPoints]
  );

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
      mouseover: (e) => e.target.setStyle({
        fillColor: isCovered ? REGION_RED : REGION_NEUTRAL,
        fillOpacity: REGION_OPACITY_HOVER,
      }),
      mouseout: (e) => e.target.setStyle(styleFeature(feature)),
      click: () => onRegionSelect && onRegionSelect(name),
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
      attributionControl={false}
      className="w-full h-full"
    >
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
            click: () => onMarkerSelect && onMarkerSelect({ type: p.type, id: p.id }),
          }}
        />
      ))}
    </MapContainer>
  );
}