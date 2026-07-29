'use client';

import { useState, useId } from 'react';
import styles from './StarRating.module.css';

const STAR_COUNT = 5;

/**
 * Étoile unique dont le remplissage (0 à 1) est piloté par une valeur
 * décimale, pour représenter des quarts d'étoile (0.25 / 0.5 / 0.75 / 1).
 */
function Star({ fill }) {
  const clampedFill = Math.max(0, Math.min(1, fill));
  const gradientId = useId();

  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gradientId}>
          <stop offset={`${clampedFill * 100}%`} stopColor="currentColor" />
          <stop offset={`${clampedFill * 100}%`} stopColor="transparent" />
        </linearGradient>
      </defs>
      {/* Contour toujours visible (étoile vide) */}
      <path
        d="M12 2.5l2.9 6.06 6.6.77-4.87 4.6 1.28 6.57L12 17.35l-5.91 3.15 1.28-6.57-4.87-4.6 6.6-.77z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        className={styles.starOutline}
      />
      {/* Remplissage proportionnel via le gradient */}
      <path
        d="M12 2.5l2.9 6.06 6.6.77-4.87 4.6 1.28 6.57L12 17.35l-5.91 3.15 1.28-6.57-4.87-4.6 6.6-.77z"
        fill={`url(#${gradientId})`}
      />
    </svg>
  );
}

/**
 * Notation par étoiles avec granularité au quart (0.25), pilotable au
 * clavier et à la souris/tactile. `value` et `onChange` portent un nombre
 * entre 0 et 5 (multiple de 0.25).
 *
 * UX : chaque étoile reprend le même "ping" (anneau qui pulse) que le
 * badge placeholder du panneau réseau (voir NetworkEntityPanel), pour une
 * cohérence visuelle avec le reste du site. Lorsque la note atteint le
 * maximum, le groupe déclenche un effet de célébration (halo, rebond,
 * étincelles) pour récompenser visuellement la note maximale.
 */
export default function StarRating({
  value = 0,
  onChange,
  onHoverChange,
  max = STAR_COUNT,
  label,
  disabled = false,
}) {
  const [hoverValue, setHoverValue] = useState(null);
  const groupId = useId();
  const displayValue = hoverValue !== null ? hoverValue : value;
  const isFullRating = !disabled && displayValue === max;

  const computeValueFromPointer = (index, e, target) => {
    const rect = target.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const quarterWithinStar = Math.ceil(Math.min(Math.max(ratio, 0.001), 1) * 4) / 4;
    return Math.min(max, index + quarterWithinStar);
  };

  const handleMove = (index) => (e) => {
    if (disabled) return;
    const next = computeValueFromPointer(index, e, e.currentTarget);
    setHoverValue(next);
    onHoverChange?.(next);
  };

  const handleClick = (index) => (e) => {
    if (disabled) return;
    onChange?.(computeValueFromPointer(index, e, e.currentTarget));
  };

  const handleLeave = () => {
    setHoverValue(null);
    onHoverChange?.(null);
  };

  const handleKeyDown = (e) => {
    if (disabled) return;
    const step = 0.25;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      onChange?.(Math.min(max, Math.round((value + step) * 4) / 4));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      onChange?.(Math.max(0.25, Math.round((value - step) * 4) / 4));
    } else if (e.key === 'Home') {
      e.preventDefault();
      onChange?.(0.25);
    } else if (e.key === 'End') {
      e.preventDefault();
      onChange?.(max);
    }
  };

  return (
    <div
      className={`${styles.group} ${disabled ? styles.disabled : ''} ${isFullRating ? styles.fullRating : ''}`}
      role="slider"
      aria-label={label}
      aria-valuemin={0.25}
      aria-valuemax={max}
      aria-valuenow={value || undefined}
      aria-valuetext={value ? `${value} / ${max}` : undefined}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={handleKeyDown}
      onMouseLeave={handleLeave}
    >
      {Array.from({ length: max }, (_, index) => {
        const fill = displayValue - index;
        return (
          <span
            key={`${groupId}-${index}`}
            className={styles.starWrapper}
            onMouseMove={handleMove(index)}
            onClick={handleClick(index)}
          >
            <Star fill={fill} />
          </span>
        );
      })}

      {isFullRating && (
        <span className={styles.sparkles} aria-hidden="true">
          {Array.from({ length: 6 }, (_, i) => (
            <span
              key={i}
              className={styles.sparkle}
              style={{ '--i': i, left: `${8 + i * 16}%` }}
            />
          ))}
        </span>
      )}
    </div>
  );
}