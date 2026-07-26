'use client';

import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import JERepository from '@/lib/repositories/JERepository';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import { Icons } from '@/components/icons/Icons';
import cardStyles from '@/components/ui/Card.module.css';
import styles from './JECards.module.css';

/**
 * Grille des fiches synthétiques de Juniors Entreprises, filtrable par
 * région (pilotée par la carte via NetworkExplorer). Chaque fiche ouvre
 * une modale détaillée listant l'ensemble des prestations et le contact.
 */
export default function JECards({ region }) {
  const t = useTranslations('je');
  const locale = useLocale();
  const [selected, setSelected] = useState(null);

  const allJE = useMemo(() => JERepository.getAll(), []);
  const filtered = useMemo(
    () => allJE.filter((je) => je.matchesRegion(region)),
    [allJE, region]
  );

  return (
    <section id="je" className="section-padding bg-surface section-animate">
      <div className="container">
        <h2 className="section-title">{t('title')}</h2>
        <p className="section-subtitle">{t('subtitle')}</p>

        {filtered.length === 0 ? (
          <p className={styles.empty}>{t('empty')}</p>
        ) : (
          <div className={`${styles.grid} stagger-grid`}>
            {filtered.map((je) => (
              <Card
                key={je.id}
                badge={je.region}
                title={je.nom}
                meta={`${t('since')} ${je.dateCreation}`}
                tags={je.getShortPrestations(locale)}
                footer={
                  <>
                    <a href={`mailto:${je.email}`} className={styles.contactLink}>
                      <Icons.Mail size={16} />
                      {t('contact')}
                    </a>
                    <button
                      type="button"
                      className={cardStyles.linkButton}
                      onClick={() => setSelected(je)}
                    >
                      {t('viewMore')}
                    </button>
                  </>
                }
              />
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.nom} closeLabel={t('modal.close')}>
        {selected && (
          <>
            <h3 className="text-xl font-bold text-secondary mb-1">{selected.nom}</h3>
            <p className={styles.modalMeta}>
              <Icons.MapPin size={14} /> {selected.region}
              <span aria-hidden="true">·</span>
              <Icons.Calendar size={14} /> {t('since')} {selected.dateCreation}
            </p>

            <h4 className={styles.modalSectionTitle}>{t('modal.servicesTitle')}</h4>
            <div className={styles.modalTags}>
              {selected.getPrestations(locale).map((p) => (
                <span key={p} className={styles.modalTag}>{p}</span>
              ))}
            </div>

            <h4 className={styles.modalSectionTitle}>{t('modal.contactTitle')}</h4>
            <a href={`mailto:${selected.email}`} className={styles.modalContact}>
              <Icons.Mail size={18} />
              {selected.email}
            </a>
          </>
        )}
      </Modal>
    </section>
  );
}