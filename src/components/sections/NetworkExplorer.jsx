import { useTranslations } from 'next-intl';
import Map from '@/components/map/Map';
import styles from './NetworkExplorer.module.css';

export default function NetworkExplorer() {
  const t = useTranslations('map');

  return (
    <section id="map" className={`section-padding ${styles.mapSection}`}>
      <div className="container">
        <h2 className="section-title">{t('title')}</h2>
        <p className="section-subtitle">{t('subtitle')}</p>

        <Map />

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
            <span>{t('hint')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}