import { useTranslations } from 'next-intl';
import styles from './History.module.css';

export default function History() {
  const t = useTranslations('history');
  const items = t.raw('items');

  return (
    <section id="history" className="section-padding section-animate section-tint">
      <div className="container">
        <h2 className="section-title">{t('title')}</h2>
        <p className="section-subtitle">{t('subtitle')}</p>

        <ol className={`${styles.timeline} stagger-grid`}>
          {items.map((item) => (
            <li key={item.year} className={styles.item}>
              <span className={styles.year}>{item.year}</span>
              <span className={styles.markerCol} aria-hidden="true">
                <span className={styles.dot} />
                <span className={styles.line} />
              </span>
              <p className={styles.text}>{item.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}