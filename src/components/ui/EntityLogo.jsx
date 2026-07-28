'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './EntityLogo.module.css';

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

/**
 * Logo d'une JE/JC, avec repli automatique sur des initiales stylisées
 * si `logo` est vide OU si le fichier échoue à charger (404, chemin pas
 * encore renseigné...). Garantit qu'aucune Junior ne s'affiche jamais
 * avec une icône cassée, y compris avant l'ajout des vrais fichiers
 * logo dans /public/images/logos/.
 */
export default function EntityLogo({ name, logo, size = 48, className = '' }) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(logo) && !failed;

  return (
    <span
      className={`${styles.logo} ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {showImage ? (
        <Image
          src={logo}
          alt=""
          width={size}
          height={size}
          className={styles.image}
          onError={() => setFailed(true)}
        />
      ) : (
        <span className={styles.initials} style={{ fontSize: size * 0.38 }}>
          {getInitials(name) || '?'}
        </span>
      )}
    </span>
  );
}