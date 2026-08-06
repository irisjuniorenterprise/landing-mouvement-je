import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';
import { Icons } from '@/components/icons/Icons';
import styles from './Hero.module.css';

export default function Hero() {
  const t = useTranslations('hero');

  return (
    // Le wrapper porte l'ombre externe (haut + bas) qui adoucit la
    // transition avec les sections voisines : elle doit être posée sur
    // un élément SANS overflow:hidden, sans quoi elle serait rognée par
    // le overflow:hidden du Hero (nécessaire, lui, pour contenir l'effet
    // "aurora"). Le wrapper est positionné pour peindre au-dessus des
    // sections adjacentes (non positionnées) et laisser l'ombre déborder
    // visuellement sur leurs bords.
    <div className={styles.heroShadowWrap}>
      <section className={`${styles.hero} section-animate`}>
        <div className={styles.heroImageWrapper} aria-hidden="true">
          <Image
            src="/images/hero-img.jpg"
            alt=""
            fill
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
            quality={35}
            className={styles.heroImage}
          />
        </div>
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
    </div>
  );
}