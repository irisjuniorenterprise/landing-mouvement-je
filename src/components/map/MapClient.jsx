'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import jeData from '@/lib/data/je.json';
import jcData from '@/lib/data/jc.json';

const DEFAULT_CENTER = [34.5, 9.8];
const DEFAULT_ZOOM = 6;

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

export default function MapClient({ onReady }) {
  const [geoData, setGeoData] = useState(null);
  const readyCalledRef = useRef(false);

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

  const styleFeature = (feature) => {
    const name = feature?.properties?.gouv_fr || '';
    const isCovered = coveredRegions.has(normalizeRegionName(name));
    return {
      fillColor: isCovered ? '#C8102E' : '#D1D5DB',
      fillOpacity: 0.12,
      color: '#FFFFFF',
      weight: 1.5,
    };
  };

  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      scrollWheelZoom={false}
      attributionControl={false}
      className="w-full h-full"
    >
      <TileLayer
        url="https://tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.fr/">OpenStreetMap France</a>'
      />
      <MapReadyBridge onReady={notifyReady} />
      {geoData?.features?.length > 0 && (
        <GeoJSON data={geoData} style={styleFeature} />
      )}
      {allPoints.map((p) => (
        <Marker key={`${p.type}-${p.id}`} position={[p.lat, p.lng]} icon={getMarkerIcon(p.type)} />
      ))}
    </MapContainer>
  );
}