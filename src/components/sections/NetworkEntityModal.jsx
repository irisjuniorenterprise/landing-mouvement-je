'use client';

import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import JERepository from '@/lib/repositories/JERepository';
import JCRepository from '@/lib/repositories/JCRepository';
import Modal from '@/components/ui/Modal';
import { Icons } from '@/components/icons/Icons';
import styles from './NetworkEntityModal.module.css';

/**
 * Pilote l'affichage des fiches JE/JC depuis un clic sur un marker de la
 * carte (remplace l'ancien affichage en sections pleine page) :
 *  1. Une modale d'aperçu légère s'ouvre d'abord : nom, catégorie
 *     (JE/JC), région, et un bouton "Voir la fiche".
 *  2. Ce bouton bascule vers une seconde modale contenant la fiche
 *     complète : prestations + contact pour une JE, établissement +
 *     description + contact pour une JC.
 *
 * `selection` = { type: 'JE' | 'JC', id } ou null (fermé).
 */
export default function NetworkEntityModal({ selection, onClose }) {
  const tMap = useTranslations('map');
  const tJE = useTranslations('je');
  const tJC = useTranslations('jc');
  const locale = useLocale();
  const [showDetail, setShowDetail] = useState(false);
  // Repart toujours sur l'aperçu quand on sélectionne un nouvel élément.
  // Ajustement pendant le rendu (plutôt qu'un useEffect) pour éviter un
  // rendu en cascade inutile : https://react.dev/learn/you-might-not-need-an-effect
  const [prevSelection, setPrevSelection] = useState(selection);
  if (selection !== prevSelection) {
    setPrevSelection(selection);
    setShowDetail(false);
  }

  const allJE = useMemo(() => JERepository.getAll(), []);
  const allJC = useMemo(() => JCRepository.getAll(), []);

  const entity = useMemo(() => {
    if (!selection) return null;
    const source = selection.type === 'JE' ? allJE : allJC;
    return source.find((item) => item.id === selection.id) || null;
  }, [selection, allJE, allJC]);

  const handleClose = () => {
    setShowDetail(false);
    onClose();
  };

  if (!entity) return null;

  const isJE = entity.type === 'JE';
  const categoryLabel = isJE ? tMap('legendJE') : tMap('legendJC');

  return (
    <>
      {/* --- Aperçu --- */}
      <Modal
        isOpen={!showDetail}
        onClose={handleClose}
        title={entity.nom}
        closeLabel={tJE('modal.close')}
      >
        <span className={`${styles.badge} ${isJE ? styles.badgeJE : styles.badgeJC}`}>
          {categoryLabel}
        </span>
        <h3 className={styles.previewTitle}>{entity.nom}</h3>
        <p className={styles.previewMeta}>
          <Icons.MapPin size={14} /> {entity.region}
        </p>
        <button type="button" className={styles.detailButton} onClick={() => setShowDetail(true)}>
          {tMap('viewSheet')}
          <Icons.ArrowRight size={16} />
        </button>
      </Modal>

      {/* --- Fiche complète --- */}
      <Modal
        isOpen={showDetail}
        onClose={handleClose}
        title={entity.nom}
        closeLabel={tJE('modal.close')}
      >
        <span className={`${styles.badge} ${isJE ? styles.badgeJE : styles.badgeJC}`}>
          {categoryLabel}
        </span>
        <h3 className={styles.previewTitle}>{entity.nom}</h3>
        <p className={styles.previewMeta}>
          <Icons.MapPin size={14} /> {entity.region}
          {isJE && (
            <>
              <span aria-hidden="true">·</span>
              <Icons.Calendar size={14} /> {tJE('since')} {entity.dateCreation}
            </>
          )}
        </p>

        {isJE ? (
          <>
            <h4 className={styles.sectionTitle}>{tJE('modal.servicesTitle')}</h4>
            <div className={styles.tags}>
              {entity.getPrestations(locale).map((p) => (
                <span key={p} className={styles.tag}>{p}</span>
              ))}
            </div>

            <h4 className={styles.sectionTitle}>{tJE('modal.contactTitle')}</h4>
            <a href={`mailto:${entity.email}`} className={styles.contact}>
              <Icons.Mail size={18} />
              {entity.email}
            </a>

            {entity.hasSocialLinks && (
              <>
                <h4 className={styles.sectionTitle}>{tJE('modal.socialTitle')}</h4>
                <div className={styles.socialRow}>
                  {entity.reseauxSociaux.facebook && (
                    <a
                      href={entity.reseauxSociaux.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                      aria-label="Facebook"
                    >
                      <Icons.Facebook size={18} />
                    </a>
                  )}
                  {entity.reseauxSociaux.instagram && (
                    <a
                      href={entity.reseauxSociaux.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                      aria-label="Instagram"
                    >
                      <Icons.Instagram size={18} />
                    </a>
                  )}
                  {entity.reseauxSociaux.linkedin && (
                    <a
                      href={entity.reseauxSociaux.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                      aria-label="LinkedIn"
                    >
                      <Icons.Linkedin size={18} />
                    </a>
                  )}
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <h4 className={styles.sectionTitle}>{tJC('establishment')}</h4>
            <p className={styles.establishment}>
              <Icons.Building size={15} /> {entity.etablissement}
            </p>

            <p className={styles.description}>{entity.getDescription(locale)}</p>

            <h4 className={styles.sectionTitle}>{tJE('modal.contactTitle')}</h4>
            <a href={`mailto:${entity.email}`} className={styles.contact}>
              <Icons.Mail size={18} />
              {entity.email}
            </a>
          </>
        )}
      </Modal>
    </>
  );
}