import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';
import { Icons } from '@/components/icons/Icons';
import styles from './Hero.module.css';

export default function Hero() {
  const t = useTranslations('hero');

  return (
    <section className={`${styles.hero} section-animate`}>
      <div className={`container ${styles.inner}`}>
        <span className={styles.eyebrow}>
          <span className={styles.eyebrowDot} aria-hidden="true" />
          {t('eyebrow')}
        </span>
        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.subtitle}>{t('subtitle')}</p>
        <div className={styles.actions}>
          <Button href="#apply" variant="primary">
            {t('ctaJoin')}
            <Icons.ArrowRight size={18} />
          </Button>
          <Button href="#map" variant="secondary">
            <Icons.Map size={18} />
            {t('ctaMap')}
          </Button>
        </div>
      </div>
    </section>
  );
}