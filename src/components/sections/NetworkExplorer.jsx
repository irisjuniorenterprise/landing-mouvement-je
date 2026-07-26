'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Map from '@/components/map/Map';
import NetworkEntityModal from '@/components/sections/NetworkEntityModal';
import { Icons } from '@/components/icons/Icons';
import { TUNISIA_GOVERNORATES } from '@/lib/data/regions';
import { trackOnce } from '@/lib/utils/analytics';
import styles from './NetworkExplorer.module.css';

/**
 * Orchestre l'exploration du réseau : la carte interactive pilote un état
 * de région sélectionnée (déclenché soit par clic sur un gouvernorat, soit
 * via le <select>, au design identique à celui du formulaire de
 * candidature), qui fait zoomer la carte sur la région choisie — la valeur
 * par défaut ("Toutes les régions") affiche la Tunisie entière. Le clic
 * sur un marker JE/JC ouvre sa fiche en modale (aperçu puis détail
 * complet) au lieu d'afficher des sections pleine page sur la landing
 * page.
 */
export default function NetworkExplorer() {
  const t = useTranslations('map');
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selection, setSelection] = useState(null); // { type: 'JE'|'JC', id } | null

  const handleRegionSelect = (region) => {
    setSelectedRegion((current) => (current === region ? null : region));
  };

  const handleSelectChange = (e) => {
    trackOnce('map_interaction', { trigger: 'region_select_dropdown' });
    setSelectedRegion(e.target.value || null);
  };

  return (
    <>
      <section id="map" className={`section-padding section-animate ${styles.mapSection}`}>
        <div className="container">
          <h2 className="section-title">{t('title')}</h2>
          <p className="section-subtitle">{t('subtitle')}</p>

          {/* Sélecteur de région — même design (label fixe + micro-label
              flottant) que le champ "Région" du formulaire de candidature,
              pour une cohérence visuelle sur tout le site. */}
          <div className={styles.field}>
            <label className={styles.fixedLabel} htmlFor="network-region-select">
              {t('selectLabel')}
            </label>
            <div className={styles.inputWrapper}>
              <Icons.MapPin size={18} className={styles.inputIcon} />
              <select
                id="network-region-select"
                className={`${styles.select} ${selectedRegion ? styles.hasValue : ''}`}
                value={selectedRegion || ''}
                onChange={handleSelectChange}
              >
                <option value="">{t('selectPlaceholder')}</option>
                {TUNISIA_GOVERNORATES.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              <Icons.ChevronDown size={18} className={`${styles.inputIcon} ${styles.selectChevron}`} />
              <span className={`${styles.floatingLabel} ${styles.floatingLabelSelect}`} aria-hidden="true">
                {t('selectLabel')}
              </span>
            </div>
          </div>

          <Map
            onRegionSelect={handleRegionSelect}
            selectedRegion={selectedRegion}
            onMarkerSelect={setSelection}
          />

          <div className={styles.legendBar}>
            <span className={`${styles.legendItem}`}>
              <span className={`${styles.dot} ${styles.dotJE}`} />
              {t('legendJE')}
            </span>
            <span className={styles.legendItem}>
              <span className={`${styles.dot} ${styles.dotJC}`} />
              {t('legendJC')}
            </span>
            <span className={styles.legendItem}>
              <span className={`${styles.dot} ${styles.dotInactive}`} />
              {t('legendInactive')}
            </span>
            <div className={styles.filterNotice}>
              {selectedRegion ? (
                <>
                  <span>{t('filteredBy', { region: selectedRegion })}</span>
                  <button type="button" className={styles.resetBtn} onClick={() => setSelectedRegion(null)}>
                    {t('resetFilter')}
                  </button>
                </>
              ) : (
                <span>{t('hint')}</span>
              )}
            </div>
          </div>
        </div>
      </section>

      <NetworkEntityModal selection={selection} onClose={() => setSelection(null)} />
    </>
  );
}