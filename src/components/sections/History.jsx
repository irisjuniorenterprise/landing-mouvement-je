import { useTranslations } from 'next-intl';
import styles from './History.module.css';

/**
 * Frise chronologique du mouvement JE, de 1967 (création de la première JE
 * à l'ESSEC Paris) à 2022 (certification ISO 9001 de la CTJE).
 * Layout en ligne (année | pastille+ligne | texte) pour que l'année reste
 * toujours visible à gauche de la timeline, y compris sur mobile.
 * Les entrées viennent de messages/{locale}.json ('history.items'), un
 * tableau d'objets { year, text } lu via t.raw() (next-intl).
 */
export default function History() {
  const t = useTranslations('history');
  const items = t.raw('items');

  return (
    <section id="history" className="section-padding section-animate">
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