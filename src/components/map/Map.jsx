'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import styles from './Map.module.css';

const MapClient = dynamic(() => import('./MapClient'), {
  ssr: false,
  loading: () => (
    <div className={styles.mapSkeleton} aria-hidden="true">
      <div className={styles.mapSkeletonPulse} />
    </div>
  ),
});

/**
 * Le fondu d'apparition de la carte est volontairement découplé du
 * système générique GSAP/ScrollTrigger (.fade-in-item) : ce dernier
 * anime `opacity` ET `transform` sur l'élément, or Leaflet calcule la
 * taille/position de ses tuiles au moment précis de son initialisation.
 * Si ce calcul a lieu pendant qu'un `transform` est en cours de
 * transition sur son propre conteneur, on obtient au premier chargement
 * des tuiles décalées/grisées tant qu'on n'interagit pas avec la carte.
 * Ici, on ne fait varier que l'opacité (jamais de transform), et
 * uniquement une fois la carte réellement prête (tuiles + GeoJSON
 * chargés), ce qui garantit un rendu correct dès la première image.
 */
export default function Map({
  onRegionSelect,
  selectedRegion,
  selectedType,
  onMarkerSelect,
  onMarkerHover,
  onMarkerLeave,
  activeEntity,
  focusEntity,
}) {
  const [isReady, setIsReady] = useState(false);

  const handleReady = useCallback(() => setIsReady(true), []);

  const t = useTranslations('map');

  return (
    <div
      className={`${styles.mapWrapper} ${isReady ? styles.mapReady : ''}`}
      role="region"
      aria-label="Carte interactive des Juniors Entreprises et Junior Créations en Tunisie. Utilisez le sélecteur de région et la liste ci-dessous pour une navigation au clavier."
    >
      <MapClient
        onRegionSelect={onRegionSelect}
        selectedRegion={selectedRegion}
        selectedType={selectedType}
        onMarkerSelect={onMarkerSelect}
        onMarkerHover={onMarkerHover}
        onMarkerLeave={onMarkerLeave}
        activeEntity={activeEntity}
        focusEntity={focusEntity}
        onReady={handleReady}
      />

      {/* Attribution légale personnalisée */}
      <div className={styles.attribution}>
        {t('legalText').concat(' ')}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('legalLink')}
        </a>
      </div>
    </div>
  );
}