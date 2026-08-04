'use client';

import styles from './Skeleton.module.css';

/**
 * Squelette de chargement générique — s'affiche pendant que le chunk
 * JS d'un composant chargé dynamiquement (formulaires, sections lourdes)
 * est encore en train de télécharger. Particulièrement visible sur
 * connexion faible (3G, réseau instable), ce qui évite un "trou" vide
 * dans la page pendant le chargement.
 *
 * Respecte prefers-reduced-motion (pas de shimmer animé si demandé).
 */
export function SkeletonBlock({ height = '1rem', width = '100%', radius = '8px', className = '' }) {
  return (
    <div
      className={`${styles.block} ${className}`}
      style={{ height, width, borderRadius: radius }}
      aria-hidden="true"
    />
  );
}

export function FormSkeleton({ fields = 4, title = true }) {
  return (
    <div className={styles.formSkeleton} role="status" aria-label="Chargement du formulaire">
      {title && <SkeletonBlock height="1.75rem" width="40%" className={styles.mb} />}
      <SkeletonBlock height="1rem" width="65%" className={styles.mb} />
      <div className={styles.grid}>
        {Array.from({ length: fields }).map((_, i) => (
          <SkeletonBlock key={i} height="3rem" radius="10px" />
        ))}
      </div>
      <SkeletonBlock height="3rem" width="180px" radius="9999px" className={styles.mt} />
    </div>
  );
}