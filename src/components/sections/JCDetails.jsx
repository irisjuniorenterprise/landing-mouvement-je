'use client';

import { useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import JCRepository from '@/lib/repositories/JCRepository';
import Card from '@/components/ui/Card';
import { Icons } from '@/components/icons/Icons';
import styles from './JCDetails.module.css';

/**
 * Grille des Junior Créations (JC), initiatives en cours de structuration.
 * Filtrable par région comme les JE, mais sans modale : ces fiches sont
 * volontairement plus légères (pas encore de prestations formalisées).
 */
export default function JCDetails({ region }) {
  const t = useTranslations('jc');
  const locale = useLocale();

  const allJC = useMemo(() => JCRepository.getAll(), []);
  const filtered = useMemo(
    () => allJC.filter((jc) => jc.matchesRegion(region)),
    [allJC, region]
  );

  return (
    <section id="jc" className="section-padding">
      <div className="container">
        <h2 className="section-title">{t('title')}</h2>
        <p className="section-subtitle">{t('subtitle')}</p>

        {filtered.length === 0 ? (
          <p className={styles.empty}>{t('empty')}</p>
        ) : (
          <div className={styles.grid}>
            {filtered.map((jc) => (
              <Card key={jc.id} badge={jc.region} title={jc.nom}>
                <p className={styles.establishment}>
                  <Icons.Building size={15} /> {jc.etablissement}
                </p>
                <p className={styles.description}>{jc.getDescription(locale)}</p>
                <a href={`mailto:${jc.email}`} className={styles.contactLink}>
                  <Icons.Mail size={16} />
                  {jc.email}
                </a>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}