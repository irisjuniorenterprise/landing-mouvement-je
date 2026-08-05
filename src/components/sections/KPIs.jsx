import { useTranslations } from 'next-intl';
import { Icons } from '@/components/icons/Icons';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import styles from './KPIs.module.css';

export default function KPIs() {
  const t = useTranslations('kpis');

  const worldStats = [
    { icon: Icons.Globe, value: 44, suffix: '', label: t('worldCountries') },
    { icon: Icons.Briefcase, value: 1790, suffix: '+', label: t('worldJE') },
    { icon: Icons.Users, value: 65000, suffix: '+', label: t('worldMembers') },
    { icon: Icons.FileCheck, value: 19000, suffix: '+', label: t('worldProjects') },
    { icon: Icons.Coin, value: 16, suffix: ' M€', label: t('worldRevenue') },
  ];

  const tunisiaStats = [
    { icon: Icons.MapPin, value: 10, suffix: '', label: t('totalRegions') },
    { icon: Icons.Briefcase, value: 30, suffix: '', label: t('totalJE') },
    { icon: Icons.Users, value: 1700, suffix: '+', label: t('totalMembers') },
    { icon: Icons.ServicePro, value: 60, suffix: '+', label: t('totalServices') },
    { icon: Icons.GraduationCap, value: 550, suffix: '', label: t('totalTrainings') },
    { icon: Icons.FileCheck, value: 180, suffix: '+', label: t('totalProjects') },
    { icon: Icons.WalletMoney, value: 500000, suffix: ' TND', label: t('totalRevenue') },
  ];

  return (
    <div className={styles.kpisShadowWrap}>
      <section id="kpis" className="section-padding section-animate section-dark">
        <div className="container">
          <h2 className="section-title">{t('title')}</h2>
          <p className="section-subtitle">{t('subtitle')}</p>

          <h3 className={styles.blockTitle}>{t('worldTitle')}</h3>
          <div className={`${styles.grid} stagger-grid`}>
            {worldStats.map(({ icon: Icon, value, suffix, label }, index) => (
              <div key={label} className={styles.stat}>
                <div className={styles.iconWrap}>
                  <Icon size={22} />
                </div>
                <AnimatedCounter
                  value={value}
                  suffix={suffix}
                  duration={1400 + index * 150}
                  className={styles.value}
                />
                <div className={styles.label}>{label}</div>
              </div>
            ))}
          </div>

          <h3 className={styles.blockTitle}>{t('tunisiaTitle')}</h3>
          <div className={`${styles.grid} stagger-grid`}>
            {tunisiaStats.map(({ icon: Icon, value, suffix, label }, index) => (
              <div key={label} className={styles.stat}>
                <div className={styles.iconWrap}>
                  <Icon size={22} />
                </div>
                <AnimatedCounter
                  value={value}
                  suffix={suffix}
                  duration={1400 + index * 150}
                  className={styles.value}
                />
                <div className={styles.label}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}