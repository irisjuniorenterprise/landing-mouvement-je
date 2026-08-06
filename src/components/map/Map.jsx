'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';
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
  
  const [shouldMount, setShouldMount] = useState(false);
  const wrapperRef = useRef(null);

  const handleReady = useCallback(() => setIsReady(true), []);

  const t = useTranslations('map');

  useEffect(() => {
    if (shouldMount) return;
    const el = wrapperRef.current;
    if (!el) return;

    // Repli pour les très anciens navigateurs sans IntersectionObserver :
    // on monte directement la carte plutôt que de la garder invisible
    // pour toujours.
    if (typeof IntersectionObserver === 'undefined') {
      setShouldMount(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldMount(true);
          observer.disconnect();
        }
      },
     
      { rootMargin: '600px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldMount]);

  return (
    <div
      ref={wrapperRef}
      className={`${styles.mapWrapper} ${isReady ? styles.mapReady : ''}`}
      role="region"
      aria-label={t('a11yDescription')}
    >
      {shouldMount ? (
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
      ) : (
        <div className={styles.mapSkeleton} aria-hidden="true">
          <div className={styles.mapSkeletonPulse} />
        </div>
      )}

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