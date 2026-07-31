'use client';

import { useLocale, useTranslations } from 'next-intl';
import EntityLogo from '@/components/ui/EntityLogo';
import { Icons } from '@/components/icons/Icons';
import styles from './NetworkEntityPanel.module.css';

/**
 * Contenu détaillé d'une JE/JC — factorisé pour être identique dans le
 * panneau desktop et la fiche mobile (seul le conteneur change).
 */
function EntityDetails({ entity, locale, tMap, tJE, tJC, tCommon }) {
  const isJE = entity.type === 'JE';
  const categoryLabel = isJE ? tMap('legendJE') : tMap('legendJC');

  return (
    <>
      {/* Bloc du haut : identité de la Junior — reste ancré en haut du panneau. */}
      <div className={styles.topBlock}>
        <div className={styles.header}>
          <EntityLogo name={entity.nom} logo={entity.logo} size={52} />
          <div>
            <span className={`${styles.badge} ${isJE ? styles.badgeJE : styles.badgeJC}`}>
              {categoryLabel}
            </span>
            <h3 className={styles.title}>{entity.nom}</h3>
          </div>
        </div>

        <p className={styles.meta}>
          <Icons.MapPin size={14} /> {entity.region}
          {isJE && (
            <>
              <span aria-hidden="true">·</span>
              <Icons.Calendar size={14} /> {tJE('since')} {entity.dateCreation}
            </>
          )}
        </p>
      </div>

      {/* Bloc du milieu : contenu propre à la JE/JC — flotte entre les deux
          autres blocs (voir .desktopPanel { justify-content: space-between }),
          ce qui comble le vide en bas quand ce contenu est court. */}
      <div className={styles.middleBlock}>
        {isJE ? (
          <>
            <h4 className={styles.sectionTitle}>{tJE('modal.servicesTitle')}</h4>
            <div className={styles.tags}>
              {entity.getPrestations(locale).map((p) => (
                <span key={p} className={styles.tag}>{p}</span>
              ))}
            </div>

            {entity.hasSocialLinks && (
              <div className={styles.socialRow}>
                {entity.reseauxSociaux.facebook && (
                  <a href={entity.reseauxSociaux.facebook} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label={`Facebook ${tCommon('opensNewTab')}`}>
                    <Icons.Facebook size={16} />
                  </a>
                )}
                {entity.reseauxSociaux.instagram && (
                  <a href={entity.reseauxSociaux.instagram} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label={`Instagram ${tCommon('opensNewTab')}`}>
                    <Icons.Instagram size={16} />
                  </a>
                )}
                {entity.reseauxSociaux.linkedin && (
                  <a href={entity.reseauxSociaux.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label={`LinkedIn ${tCommon('opensNewTab')}`}>
                    <Icons.Linkedin size={16} />
                  </a>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <h4 className={styles.sectionTitle}>{tJC('establishment')}</h4>
            <p className={styles.establishment}>
              <Icons.Building size={15} /> {entity.etablissement}
            </p>
            <p className={styles.description}>{entity.getDescription(locale)}</p>
          </>
        )}
      </div>

      {/* Bloc du bas : contact — reste ancré en bas du panneau. */}
      <a href={`mailto:${entity.email}`} className={styles.contact}>
        <Icons.Mail size={16} />
        {entity.email}
      </a>
    </>
  );
}

/**
 * Remplace l'ancienne modale : la fiche JE/JC s'affiche désormais sans
 * jamais bloquer la carte ni le reste de la page.
 *  - Desktop (≥ 960px) : panneau fixe à droite de la carte. Le survol
 *    d'un marker y affiche ses données en direct ; un clic "épingle"
 *    la dernière Junior consultée, qui reste affichée jusqu'à ce qu'on
 *    survole ou clique une autre Junior.
 *  - Tablette/mobile (< 960px, pas de survol) : un panneau qui glisse
 *    depuis le bas ("bottom sheet") au clic sur un marker, refermable
 *    (bouton, ou tap sur le fond), et qui laisse la carte visible et
 *    manipulable au-dessus.
 */
export default function NetworkEntityPanel({ entity, onClose }) {
  const locale = useLocale();
  const tMap = useTranslations('map');
  const tJE = useTranslations('je');
  const tJC = useTranslations('jc');
  const tCommon = useTranslations('common');

  return (
    <>
      {/* --- Desktop : panneau latéral, toujours présent --- */}
      <aside className={styles.desktopPanel} aria-label={tMap('detailsPanelLabel')}>
        {entity ? (
          <EntityDetails entity={entity} locale={locale} tMap={tMap} tJE={tJE} tJC={tJC} tCommon={tCommon} />
        ) : (
          <div className={styles.placeholder}>
            <span className={styles.placeholderIconWrap} aria-hidden="true">
              <span className={styles.placeholderPing} />
              <Icons.MapPin size={24} className={styles.placeholderIcon} />
            </span>
            <p className={styles.placeholderTitle}>{tMap('panelPlaceholderTitle')}</p>
            <p className={styles.placeholderText}>{tMap('panelPlaceholder')}</p>
          </div>
        )}
      </aside>

      {/* --- Mobile/tablette : bottom sheet, uniquement visible avec une entité --- */}
      {entity && (
        <>
          <button
            type="button"
            className={styles.sheetBackdrop}
            aria-label={tJE('modal.close')}
            onClick={onClose}
          />
          <div className={styles.sheet} role="dialog" aria-label={entity.nom}>
            <div className={styles.sheetHandle} aria-hidden="true" />
            <button type="button" className={styles.sheetClose} onClick={onClose} aria-label={tJE('modal.close')}>
              <Icons.X size={18} />
            </button>
            <div className={styles.sheetContent}>
              <EntityDetails entity={entity} locale={locale} tMap={tMap} tJE={tJE} tJC={tJC} tCommon={tCommon} />
            </div>
          </div>
        </>
      )}
    </>
  );
}