'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const DEFAULT_CENTER = [34.5, 9.8];
const DEFAULT_ZOOM = 6;

// Recalcule la taille de la carte une fois montée, pour éviter les tuiles
// mal positionnées si le conteneur change de taille juste après l'init.
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

const styleFeature = () => ({
  fillColor: '#D1D5DB',
  fillOpacity: 0.12,
  color: '#FFFFFF',
  weight: 1.5,
});

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
    </MapContainer>
  );
}