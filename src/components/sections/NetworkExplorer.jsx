'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Map from '@/components/map/Map';
import NetworkEntityPanel from '@/components/sections/NetworkEntityPanel';
import JERepository from '@/lib/repositories/JERepository';
import JCRepository from '@/lib/repositories/JCRepository';
import { Icons } from '@/components/icons/Icons';
import { TUNISIA_GOVERNORATES } from '@/lib/data/regions';
import { trackOnce } from '@/lib/utils/analytics';
import { useToast } from '@/components/ui/toast/ToastProvider';
import styles from './NetworkExplorer.module.css';

const entityKey = (type, id) => `${type}:${id}`;

/**
 * Orchestre l'exploration du réseau. Trois filtres coexistent et sont
 * liés entre eux :
 *  - Région : fait zoomer la carte sur le gouvernorat et restreint la
 *    carte + le filtre "Junior" aux Juniors de cette région.
 *  - Catégorie (JE / JC) : restreint également la carte et le filtre
 *    "Junior" à la catégorie choisie.
 *  - Junior (JE ou JC précise) : centre/zoome la carte sur cette Junior
 *    et affiche sa fiche dans le panneau de détails.
 *
 * Le panneau de détails (NetworkEntityPanel) affiche en direct la
 * Junior survolée sur la carte, et disparaît (retombe sur l'état
 * précédent) dès qu'on cesse de la survoler. Un clic l'affiche de façon
 * permanente ("épinglée"), jusqu'à ce qu'une autre Junior soit survolée
 * ou cliquée. Sur desktop le panneau s'affiche à droite de la carte ;
 * sur tablette/mobile (pas de survol), il prend la forme d'une fiche
 * qui glisse depuis le bas de l'écran.
 */
export default function NetworkExplorer() {
  const t = useTranslations('map');
  const { showToast } = useToast();

  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedType, setSelectedType] = useState(null); // 'JE' | 'JC' | null
  const [hoveredEntity, setHoveredEntity] = useState(null); // { type, id } | null
  const [lockedEntity, setLockedEntity] = useState(null); // { type, id } | null
  const [focusEntity, setFocusEntity] = useState(null); // { type, id } | null — pilote le zoom carte

  const allEntities = useMemo(() => {
    const list = [...JERepository.getAll(), ...JCRepository.getAll()];
    return list.sort((a, b) => a.nom.localeCompare(b.nom));
  }, []);

  const filteredEntities = useMemo(
    () =>
      allEntities.filter(
        (e) => e.matchesRegion(selectedRegion) && (!selectedType || e.type === selectedType)
      ),
    [allEntities, selectedRegion, selectedType]
  );

  // Si la région ou la catégorie change et que la Junior actuellement
  // sélectionnée dans le filtre — ou affichée dans le panneau —
  // n'existe plus dans la nouvelle liste, on la désélectionne
  // (ajustement pendant le rendu plutôt qu'un effet, cf. règle React
  // "adjusting state when a prop changes" — évite un rendu en cascade).
  // Ça évite aussi que le panneau continue d'afficher une Junior dont
  // le marker vient de disparaître de la carte suite au changement de
  // filtre.
  const [prevFilterKey, setPrevFilterKey] = useState(`${selectedRegion}|${selectedType}`);
  const currentFilterKey = `${selectedRegion}|${selectedType}`;
  if (currentFilterKey !== prevFilterKey) {
    setPrevFilterKey(currentFilterKey);
    const stillVisible = (key) => key && filteredEntities.some((e) => e.type === key.type && e.id === key.id);
    if (focusEntity && !stillVisible(focusEntity)) setFocusEntity(null);
    if (lockedEntity && !stillVisible(lockedEntity)) setLockedEntity(null);
    if (hoveredEntity && !stillVisible(hoveredEntity)) setHoveredEntity(null);
  }

  const resolveEntity = (key) => (key ? allEntities.find((e) => e.type === key.type && e.id === key.id) : null);
  const displayedEntity = resolveEntity(hoveredEntity) || resolveEntity(lockedEntity);

  // Astuce d'utilisation de la carte : affichée une seule fois par
  // chargement de page, et seulement quand la section Map devient
  // réellement visible à l'écran — pas dès le montage du composant,
  // qui a lieu bien avant que l'utilisateur n'ait scrollé jusqu'ici.
  const sectionRef = useRef(null);
  const hintShownRef = useRef(false);
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl || hintShownRef.current) return;

    // Repli pour les très anciens navigateurs sans IntersectionObserver :
    // on garde l'ancien comportement plutôt que de ne jamais afficher
    // l'astuce.
    if (typeof IntersectionObserver === 'undefined') {
      hintShownRef.current = true;
      const timer = setTimeout(() => {
        showToast({ type: 'info', message: t('toastHint'), duration: 7000 });
      }, 1400);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hintShownRef.current) return;
        hintShownRef.current = true;
        showToast({ type: 'info', message: t('toastHint'), duration: 7000 });
        observer.disconnect();
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionEl);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Prévient l'utilisateur quand la combinaison région + catégorie
  // choisie ne compte aucune Junior, plutôt que de le laisser face à
  // une carte vide sans explication.
  useEffect(() => {
    if (!selectedRegion && !selectedType) return;
    const hasAny = allEntities.some(
      (e) => e.matchesRegion(selectedRegion) && (!selectedType || e.type === selectedType)
    );
    if (!hasAny) {
      showToast({
        type: 'warning',
        message: selectedRegion
          ? t('toastEmptyRegion', { region: selectedRegion })
          : t('toastEmptyType'),
        duration: 6000,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRegion, selectedType]);

  const handleRegionSelect = (region) => {
    setSelectedRegion((current) => (current === region ? null : region));
  };

  const handleRegionSelectChange = (e) => {
    trackOnce('map_interaction', { trigger: 'region_select_dropdown' });
    setSelectedRegion(e.target.value || null);
  };

  const handleTypeSelectChange = (e) => {
    trackOnce('map_interaction', { trigger: 'type_select_dropdown' });
    setSelectedType(e.target.value || null);
  };

  const handleEntitySelectChange = (e) => {
    const [type, idRaw] = e.target.value ? e.target.value.split(':') : [null, null];
    if (!type) {
      setFocusEntity(null);
      return;
    }
    const key = { type, id: Number(idRaw) };
    trackOnce('map_interaction', { trigger: 'entity_select_dropdown' });
    setFocusEntity(key);
    setLockedEntity(key);
  };

  const handlePanelClose = () => {
    setLockedEntity(null);
    setHoveredEntity(null);
  };

  return (
    <section id="map" ref={sectionRef} className={`section-padding section-animate section-alt ${styles.mapSection}`}>
      <div className="container">
        <h2 className="section-title">{t('title')}</h2>
        <p className="section-subtitle">{t('subtitle')}</p>

        <div className={styles.filters}>
          {/* Sélecteur de région — même design (label fixe + micro-label
              flottant) que le champ "Région" du formulaire de candidature,
              pour une cohérence visuelle sur tout le site. */}
          <div className={styles.field}>
            <label className={styles.fixedLabel} htmlFor="network-region-select">
              {t('selectLabel')}
            </label>
            <div className={styles.inputWrapper}>
              <Icons.MapPin size={18} className={styles.inputIcon} />
              <select
                id="network-region-select"
                className={`${styles.select} ${selectedRegion ? styles.hasValue : ''}`}
                value={selectedRegion || ''}
                onChange={handleRegionSelectChange}
              >
                <option value="">{t('selectPlaceholder')}</option>
                {TUNISIA_GOVERNORATES.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              <Icons.ChevronDown size={18} className={`${styles.inputIcon} ${styles.selectChevron}`} />
              <span className={`${styles.floatingLabel} ${styles.floatingLabelSelect}`} aria-hidden="true">
                {t('selectLabel')}
              </span>
            </div>
          </div>

          {/* Sélecteur de catégorie (JE ou JC) — restreint, comme la
              région, la carte et le filtre "Junior" ci-après. */}
          <div className={styles.field}>
            <label className={styles.fixedLabel} htmlFor="network-type-select">
              {t('typeSelectLabel')}
            </label>
            <div className={styles.inputWrapper}>
              <Icons.FlexibleSliders size={18} className={styles.inputIcon} />
              <select
                id="network-type-select"
                className={`${styles.select} ${selectedType ? styles.hasValue : ''}`}
                value={selectedType || ''}
                onChange={handleTypeSelectChange}
              >
                <option value="">{t('typeSelectPlaceholder')}</option>
                <option value="JE">{t('legendJE')}</option>
                <option value="JC">{t('legendJC')}</option>
              </select>
              <Icons.ChevronDown size={18} className={`${styles.inputIcon} ${styles.selectChevron}`} />
              <span className={`${styles.floatingLabel} ${styles.floatingLabelSelect}`} aria-hidden="true">
                {t('typeSelectLabel')}
              </span>
            </div>
          </div>

          {/* Sélecteur de Junior (JE ou JC) — limité aux Juniors de la
              région et/ou catégorie déjà sélectionnées, le cas échéant.
              Choisir une entrée centre/zoome la carte sur cette Junior
              et affiche sa fiche. */}
          <div className={styles.field}>
            <label className={styles.fixedLabel} htmlFor="network-entity-select">
              {t('entitySelectLabel')}
            </label>
            <div className={styles.inputWrapper}>
              <Icons.Search size={18} className={styles.inputIcon} />
              <select
                id="network-entity-select"
                className={`${styles.select} ${focusEntity ? styles.hasValue : ''}`}
                value={focusEntity ? entityKey(focusEntity.type, focusEntity.id) : ''}
                onChange={handleEntitySelectChange}
                disabled={filteredEntities.length === 0}
              >
                <option value="">
                  {filteredEntities.length === 0 ? t('entitySelectEmpty') : t('entitySelectPlaceholder')}
                </option>
                {filteredEntities.map((entity) => (
                  <option key={entityKey(entity.type, entity.id)} value={entityKey(entity.type, entity.id)}>
                    {entity.nom}
                  </option>
                ))}
              </select>
              <Icons.ChevronDown size={18} className={`${styles.inputIcon} ${styles.selectChevron}`} />
              <span className={`${styles.floatingLabel} ${styles.floatingLabelSelect}`} aria-hidden="true">
                {t('entitySelectLabel')}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.explorerRow}>
          <div className={styles.mapColumn}>
            <Map
              onRegionSelect={handleRegionSelect}
              selectedRegion={selectedRegion}
              selectedType={selectedType}
              onMarkerSelect={(key) => setLockedEntity(key)}
              onMarkerHover={setHoveredEntity}
              onMarkerLeave={() => setHoveredEntity(null)}
              activeEntity={hoveredEntity || lockedEntity}
              focusEntity={focusEntity}
            />
          </div>

          <NetworkEntityPanel entity={displayedEntity} onClose={handlePanelClose} />
        </div>

        <div className={styles.legendBar}>
          <span className={`${styles.legendItem}`}>
            <span className={`${styles.dot} ${styles.dotJE}`} />
            {t('legendJE')}
          </span>
          <span className={styles.legendItem}>
            <span className={`${styles.dot} ${styles.dotJC}`} />
            {t('legendJC')}
          </span>
          <span className={styles.legendItem}>
            <span className={`${styles.dot} ${styles.dotInactive}`} />
            {t('legendInactive')}
          </span>
          <div className={styles.filterNotice}>
            {selectedRegion || selectedType ? (
              <>
                <span>
                  {selectedRegion && selectedType
                    ? t('filteredByBoth', { region: selectedRegion, type: t(selectedType === 'JE' ? 'legendJE' : 'legendJC') })
                    : selectedRegion
                    ? t('filteredBy', { region: selectedRegion })
                    : t('filteredByType', { type: t(selectedType === 'JE' ? 'legendJE' : 'legendJC') })}
                </span>
                <button
                type="button"
                className={styles.resetBtn}
                onClick={() => {
                  setSelectedRegion(null);
                  setSelectedType(null);
                  setFocusEntity(null);
                  setLockedEntity(null);
                  setHoveredEntity(null);
                }}
              >
                {t('resetFilter')}
              </button>
              </>
            ) : (
              <span>{t('hint')}</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}