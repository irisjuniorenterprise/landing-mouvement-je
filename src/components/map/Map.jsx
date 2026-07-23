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

export default function Map() {
  const [isReady, setIsReady] = useState(false);
  const handleReady = useCallback(() => setIsReady(true), []);
  const t = useTranslations('map');

  return (
    <div
      className={`${styles.mapWrapper} ${isReady ? styles.mapReady : ''}`}
      role="region"
      aria-label="Carte interactive des Juniors Entreprises et Junior Créations en Tunisie."
    >
      <MapClient onReady={handleReady} />

      <div className={styles.attribution}>
        {t('legalText').concat(' ')}
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">
          {t('legalLink')}
        </a>
      </div>
    </div>
  );
}