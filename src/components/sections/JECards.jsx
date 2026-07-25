'use client';

import { useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import JERepository from '@/lib/repositories/JERepository';
import Card from '@/components/ui/Card';
import { Icons } from '@/components/icons/Icons';
import styles from './JECards.module.css';

export default function JECards({ region }) {
  const t = useTranslations('je');
  const locale = useLocale();

  const allJE = useMemo(() => JERepository.getAll(), []);
  const filtered = useMemo(
    () => allJE.filter((je) => je.matchesRegion(region)),
    [allJE, region]
  );

  return (
    <section id="je" className="section-padding bg-surface">
      <div className="container">
        <h2 className="section-title">{t('title')}</h2>
        <p className="section-subtitle">{t('subtitle')}</p>

        {filtered.length === 0 ? (
          <p className={styles.empty}>{t('empty')}</p>
        ) : (
          <div className={styles.grid}>
            {filtered.map((je) => (
              <Card
                key={je.id}
                badge={je.region}
                title={je.nom}
                meta={`${t('since')} ${je.dateCreation}`}
                tags={je.getShortPrestations(locale)}
                footer={
                  <a href={`mailto:${je.email}`} className={styles.contactLink}>
                    <Icons.Mail size={16} />
                    {t('contact')}
                  </a>
                }
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}