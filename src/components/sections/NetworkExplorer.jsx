'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import Map from '@/components/map/Map';
import { Icons } from '@/components/icons/Icons';
import { TUNISIA_GOVERNORATES } from '@/lib/data/regions';
import jeData from '@/lib/data/je.json';
import jcData from '@/lib/data/jc.json';
import styles from './NetworkExplorer.module.css';

const normalizeRegionName = (value = '') => value.normalize('NFC').trim();

export default function NetworkExplorer() {
  const t = useTranslations('map');
  const [selectedRegion, setSelectedRegion] = useState(null);

  const handleRegionSelect = (region) => {
    setSelectedRegion((current) => (current === region ? null : region));
  };

  const handleSelectChange = (e) => {
    setSelectedRegion(e.target.value || null);
  };

  // Compte les entités (JE + JC) présentes dans la région sélectionnée,
  // pour afficher le message "Aucune JE" quand ce nombre est nul.
  const matchCount = useMemo(() => {
    if (!selectedRegion) return null;
    const target = normalizeRegionName(selectedRegion);
    const all = [...jeData, ...jcData];
    return all.filter((p) => normalizeRegionName(p.region) === target).length;
  }, [selectedRegion]);

  return (
    <section id="map" className={`section-padding section-animate ${styles.mapSection}`}>
      <div className="container">
        <h2 className="section-title">{t('title')}</h2>
        <p className="section-subtitle">{t('subtitle')}</p>

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
          </div>
        </div>

        <Map
          onRegionSelect={handleRegionSelect}
          selectedRegion={selectedRegion}
        />

        {selectedRegion && matchCount === 0 && (
          <p className={styles.noResults} role="status">
            {t('noResults')}
          </p>
        )}

        <div className={styles.legendBar}>
          <span className={styles.legendItem}>
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
  );
}