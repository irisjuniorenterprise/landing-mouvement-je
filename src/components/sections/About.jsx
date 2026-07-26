import { useTranslations } from 'next-intl';
import { Icons } from '@/components/icons/Icons';
import styles from './About.module.css';

const VALUE_ICONS = [Icons.Engagement, Icons.Professionalism, Icons.Shield, Icons.Users];
const DOMAIN_ICONS = [
  Icons.GraduationCap,
  Icons.Briefcase,
  Icons.Innovation,
  Icons.Handshake,
  Icons.Globe,
];

/**
 * Présente l'identité de la CTJE : mission, vision, valeurs, fonctionnement
 * du modèle Junior Entreprise et domaines d'activité de la confédération.
 */
export default function About() {
  const t = useTranslations('about');
  const values = t.raw('values');
  const domains = t.raw('domains');

  return (
    <section id="about" className="section-padding section-animate">
      <div className="container">
        <h2 className="section-title">{t('title')}</h2>
        <p className="section-subtitle">{t('subtitle')}</p>

        <div className={`${styles.mvGrid} stagger-grid`}>
          <div className={styles.mvCard}>
            <div className={styles.mvIcon}>
              <Icons.Target size={22} />
            </div>
            <h3 className={styles.mvTitle}>{t('missionTitle')}</h3>
            <p className={styles.mvText}>{t('mission')}</p>
          </div>

          <div className={styles.mvCard}>
            <div className={styles.mvIcon}>
              <Icons.Eye size={22} />
            </div>
            <h3 className={styles.mvTitle}>{t('visionTitle')}</h3>
            <p className={styles.mvText}>{t('vision')}</p>
          </div>
        </div>

        <h3 className={styles.subheading}>{t('valuesTitle')}</h3>
        <div className={`${styles.valuesGrid} stagger-grid`}>
          {values.map((value, index) => {
            const Icon = VALUE_ICONS[index] || Icons.Check;
            return (
              <div key={value} className={styles.valueCard}>
                <Icon size={20} />
                <span>{value}</span>
              </div>
            );
          })}
        </div>

        <div className={`${styles.howBlock} fade-in-item`}>
          <h3 className={styles.subheading}>{t('howTitle')}</h3>
          <p className={styles.howText}>{t('how')}</p>
        </div>

        <h3 className={styles.subheading}>{t('domainsTitle')}</h3>
        <ul className={`${styles.domainsGrid} stagger-grid`}>
          {domains.map((domain, index) => {
            const Icon = DOMAIN_ICONS[index] || Icons.Check;
            return (
              <li key={domain} className={styles.domainCard}>
                <Icon size={20} />
                <span>{domain}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
