'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { validateCandidature } from '@/lib/utils/validation';
import { trackOnce, trackEvent } from '@/lib/utils/analytics';
import { TUNISIA_GOVERNORATES } from '@/lib/data/regions';
import { Icons } from '@/components/icons/Icons';
import styles from './CandidatureForm.module.css';

const INITIAL_STATE = {
  name: '',
  email: '',
  region: '',
  establishment: '',
  motivation: '',
  acceptTerms: false,
  website: '', // honeypot anti-spam, doit rester vide
};

const STATUS = { IDLE: 'idle', SUBMITTING: 'submitting', SUCCESS: 'success', ERROR: 'error' };

// Champs textuels autorisés dans le brouillon. `acceptTerms` (consentement,
// doit rester un acte volontaire à chaque visite) et `website` (honeypot)
// sont volontairement exclus de la sauvegarde.
const DRAFT_FIELDS = ['name', 'email', 'region', 'establishment', 'motivation'];
const DRAFT_KEY = 'ctje_candidature_draft';

/**
 * Persiste un brouillon dans sessionStorage (jamais localStorage : les
 * données restent le temps de l'onglet, pas indéfiniment sur l'appareil —
 * compromis vie privée / confort pour un formulaire qui contient des
 * données personnelles). Se vide automatiquement après un envoi réussi.
 */
function readDraft() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeDraft(values) {
  if (typeof window === 'undefined') return;
  try {
    const draft = DRAFT_FIELDS.reduce((acc, field) => {
      acc[field] = values[field];
      return acc;
    }, {});
    const hasContent = Object.values(draft).some((v) => v && v.trim?.());
    if (hasContent) {
      window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } else {
      window.sessionStorage.removeItem(DRAFT_KEY);
    }
  } catch {
    // Stockage indisponible (navigation privée stricte, quota...) : on
    // dégrade silencieusement, le formulaire reste fonctionnel sans brouillon.
  }
}

function clearDraft() {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    /* no-op */
  }
}

export default function CandidatureForm() {
  const t = useTranslations('form');
  const [values, setValues] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(STATUS.IDLE);
  const [draftRestored, setDraftRestored] = useState(false);
  const writeTimerRef = useRef(null);

  // Restauration du brouillon au montage (une seule fois).
  useEffect(() => {
    // readDraft() renvoie toujours null côté serveur (garde `typeof window`),
    // donc ce setState doit rester dans un effet : le faire au rendu (ex. via
    // un initialiseur useState) créerait un mismatch d'hydratation dès qu'un
    // visiteur a un brouillon en session.
    const draft = readDraft();
    if (draft) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValues((prev) => ({ ...prev, ...draft }));
      setDraftRestored(true);
    }
  }, []);

  // Sauvegarde différée (300ms) à chaque changement, pour éviter d'écrire
  // dans sessionStorage à chaque frappe.
  useEffect(() => {
    if (writeTimerRef.current) clearTimeout(writeTimerRef.current);
    writeTimerRef.current = setTimeout(() => writeDraft(values), 300);
    return () => clearTimeout(writeTimerRef.current);
  }, [values]);

  const handleChange = (field) => (e) => {
    // KPI 1 (Taux de complétion) : marque le début de saisie, une seule
    // fois par visite, dès la première interaction avec un champ réel
    // (le honeypot n'est volontairement pas inclus ici).
    if (field !== 'website') trackOnce('candidature_form_started');
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleCheckboxChange = (field) => (e) => {
    trackOnce('candidature_form_started');
    setValues((prev) => ({ ...prev, [field]: e.target.checked }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleDismissDraftNotice = () => setDraftRestored(false);

  const handleClearDraft = () => {
    clearDraft();
    setValues(INITIAL_STATE);
    setErrors({});
    setDraftRestored(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValid, errors: validationErrors } = validateCandidature(values);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setStatus(STATUS.SUBMITTING);
    setErrors({});

    try {
      const response = await fetch('/api/candidature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data.errors) setErrors(data.errors);
        setStatus(STATUS.ERROR);
        return;
      }

      setStatus(STATUS.SUCCESS);
      setValues(INITIAL_STATE);
      clearDraft();
      // KPI 1 (Taux de complétion) : numérateur. Ratio calculé côté
      // client (dashboard Vercel) = form_submitted / form_started.
      trackEvent('candidature_form_submitted');
    } catch {
      setStatus(STATUS.ERROR);
    }
  };

  const fieldError = (field) => errors[field] && t(`errors.${errors[field]}`);

  // Rendu du consentement RGPD/CGU : on n'utilise volontairement PAS
  // t.rich() ici. Sur cette stack (next-intl@4.13.2 + Next.js 16.2.10 +
  // React 19.2.4), t.rich() lève INVALID_MESSAGE ("Incorrect locale
  // information provided (undefined)") de façon systématique et
  // reproductible, MÊME quand useLocale() renvoie une locale valide
  // ('fr'/'en') — donc le souci vient de la résolution interne de la
  // locale par t.rich() lui-même (probable incompatibilité de lib), pas
  // du contexte next-intl côté app. t.raw() n'a pas besoin de construire
  // de formateur ICU/Intl et n'est donc pas affecté : on récupère le
  // texte brut et on remplace nous-mêmes les balises <terms>/<privacy>.
  const renderAcceptTerms = () => {
    const raw = t.raw('acceptTerms');
    const parts = raw.split(/(<terms>.*?<\/terms>|<privacy>.*?<\/privacy>)/g);
    return parts.map((part, i) => {
      const termsMatch = part.match(/^<terms>(.*?)<\/terms>$/);
      if (termsMatch) {
        return (
          <Link key={i} href="/mentions-legales" target="_blank" rel="noopener noreferrer" className={styles.consentLink}>
            {termsMatch[1]}
            <span className="sr-only"> {t('newTabWarning')}</span>
          </Link>
        );
      }
      const privacyMatch = part.match(/^<privacy>(.*?)<\/privacy>$/);
      if (privacyMatch) {
        return (
          <Link key={i} href="/politique-confidentialite" target="_blank" rel="noopener noreferrer" className={styles.consentLink}>
            {privacyMatch[1]}
            <span className="sr-only"> {t('newTabWarning')}</span>
          </Link>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <section id="apply" className="section-padding bg-surface section-animate">
      <div className="container">
        <h2 className="section-title">{t('title')}</h2>
        <p className="section-subtitle">{t('subtitle')}</p>

        {draftRestored && (
          <div className={styles.draftNotice} role="status">
            <Icons.PenDraw size={16} />
            <span>{t('draftRestored')}</span>
            <button type="button" className={styles.draftClearBtn} onClick={handleClearDraft}>
              {t('draftClear')}
            </button>
            <button
              type="button"
              className={styles.draftDismissBtn}
              onClick={handleDismissDraftNotice}
              aria-label={t('draftDismiss')}
            >
              <Icons.X size={14} />
            </button>
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {/* GROUPE 1 : Informations personnelles */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>
              <Icons.PenDraw size={30} />
              {t('personalInfoTitle')}
            </legend>

            <div className={styles.grid}>
              {/* NOM */}
              <div className={styles.field}>
                <label className={styles.fixedLabel} htmlFor="cf-name">
                  {t('name')} <span className={styles.required}>*</span>
                </label>
                <div className={styles.inputWrapper}>
                  <Icons.User size={18} className={styles.inputIcon} />
                  <input
                    id="cf-name"
                    type="text"
                    className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                    placeholder=" "
                    value={values.name}
                    onChange={handleChange('name')}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'cf-name-error' : undefined}
                  />
                  <span className={styles.floatingLabel} aria-hidden="true">
                    {t('namePlaceholder')}
                  </span>
                </div>
                {fieldError('name') && (
                  <span id="cf-name-error" className={styles.errorText}>
                    <Icons.AlertCircle size={14} /> {fieldError('name')}
                  </span>
                )}
              </div>

              {/* EMAIL */}
              <div className={styles.field}>
                <label className={styles.fixedLabel} htmlFor="cf-email">
                  {t('email')} <span className={styles.required}>*</span>
                </label>
                <div className={styles.inputWrapper}>
                  <Icons.Mail size={18} className={styles.inputIcon} />
                  <input
                    id="cf-email"
                    type="email"
                    className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                    placeholder=" "
                    value={values.email}
                    onChange={handleChange('email')}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'cf-email-error' : undefined}
                  />
                  <span className={styles.floatingLabel} aria-hidden="true">
                    {t('emailPlaceholder')}
                  </span>
                </div>
                {fieldError('email') && (
                  <span id="cf-email-error" className={styles.errorText}>
                    <Icons.AlertCircle size={14} /> {fieldError('email')}
                  </span>
                )}
              </div>

              {/* RÉGION */}
              <div className={styles.field}>
                <label className={styles.fixedLabel} htmlFor="cf-region">
                  {t('region')} <span className={styles.required}>*</span>
                </label>
                <div className={styles.inputWrapper}>
                  <Icons.MapPin size={18} className={styles.inputIcon} />
                  <select
                    id="cf-region"
                    className={`${styles.select} ${values.region ? styles.hasValue : ''} ${
                      errors.region ? styles.inputError : ''
                    }`}
                    value={values.region}
                    onChange={handleChange('region')}
                    aria-invalid={Boolean(errors.region)}
                  >
                    <option value="">{t('regionPlaceholder')}</option>
                    {TUNISIA_GOVERNORATES.map((gov) => (
                      <option key={gov} value={gov}>
                        {gov}
                      </option>
                    ))}
                  </select>
                  <Icons.ChevronDown size={18} className={`${styles.inputIcon} ${styles.selectChevron}`} />
                  <span className={`${styles.floatingLabel} ${styles.floatingLabelSelect}`} aria-hidden="true">
                    {t('region')}
                  </span>
                </div>
                {fieldError('region') && (
                  <span className={styles.errorText}>
                    <Icons.AlertCircle size={14} /> {fieldError('region')}
                  </span>
                )}
              </div>

              {/* ÉTABLISSEMENT */}
              <div className={styles.field}>
                <label className={styles.fixedLabel} htmlFor="cf-establishment">
                  {t('establishment')} <span className={styles.required}>*</span>
                </label>
                <div className={styles.inputWrapper}>
                  <Icons.Building size={18} className={styles.inputIcon} />
                  <input
                    id="cf-establishment"
                    type="text"
                    className={`${styles.input} ${errors.establishment ? styles.inputError : ''}`}
                    placeholder=" "
                    value={values.establishment}
                    onChange={handleChange('establishment')}
                    aria-invalid={Boolean(errors.establishment)}
                  />
                  <span className={styles.floatingLabel} aria-hidden="true">
                    {t('establishmentPlaceholder')}
                  </span>
                </div>
                {fieldError('establishment') && (
                  <span className={styles.errorText}>
                    <Icons.AlertCircle size={14} /> {fieldError('establishment')}
                  </span>
                )}
              </div>
            </div>
          </fieldset>

          {/* GROUPE 2 : Motivation */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>
              <Icons.Heart size={18} />
              {t('motivationTitle')}
            </legend>

            <div className={styles.field}>
              <label className={styles.fixedLabel} htmlFor="cf-motivation">
                {t('motivation')} <span className={styles.required}>*</span>
              </label>
              <div className={`${styles.inputWrapper} ${styles.textareaWrapper}`}>
                <Icons.Edit size={18} className={styles.inputIcon} />
                <textarea
                  id="cf-motivation"
                  className={`${styles.textarea} ${errors.motivation ? styles.inputError : ''}`}
                  placeholder=" "
                  value={values.motivation}
                  onChange={handleChange('motivation')}
                  aria-invalid={Boolean(errors.motivation)}
                />
                <span className={styles.floatingLabel} aria-hidden="true">
                  {t('motivationPlaceholder')}
                </span>
              </div>
              {fieldError('motivation') && (
                <span className={styles.errorText}>
                  <Icons.AlertCircle size={14} /> {fieldError('motivation')}
                </span>
              )}
            </div>

            {/* Honeypot anti-spam : champ masqué, invisible et ignoré par les humains */}
            <div className={styles.honeypot} aria-hidden="true">
              <label htmlFor="cf-website">Website</label>
              <input
                id="cf-website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={values.website}
                onChange={handleChange('website')}
              />
            </div>
          </fieldset>

          {/* GROUPE 3 : Consentement légal */}
          <div className={`${styles.consentBox} ${errors.acceptTerms ? styles.consentBoxError : ''}`}>
            <Icons.LawScale size={20} className={styles.consentIcon} />
            <div className={styles.consentContent}>
              <label className={styles.consentLabel} htmlFor="cf-accept-terms">
                <span className={styles.checkboxWrapper}>
                  <input
                    id="cf-accept-terms"
                    type="checkbox"
                    className={styles.checkboxInput}
                    checked={Boolean(values.acceptTerms)}
                    onChange={handleCheckboxChange('acceptTerms')}
                    aria-invalid={Boolean(errors.acceptTerms)}
                    aria-describedby={errors.acceptTerms ? 'cf-accept-terms-error' : undefined}
                  />
                  <span className={styles.checkboxBox} aria-hidden="true">
                    <Icons.Check size={13} className={styles.checkboxMark} />
                  </span>
                </span>
                <span className={styles.consentText}>
                  {renderAcceptTerms()}
                  <span className={styles.required}> *</span>
                </span>
              </label>
              {fieldError('acceptTerms') && (
                <span id="cf-accept-terms-error" className={styles.errorText}>
                  <Icons.AlertCircle size={14} /> {fieldError('acceptTerms')}
                </span>
              )}
            </div>
          </div>

          <div className={styles.submitRow}>
            {status === STATUS.SUCCESS && (
              <div className={`${styles.statusMessage} ${styles.statusSuccess}`} role="status">
                <Icons.Check size={16} /> {t('success')}
              </div>
            )}
            {status === STATUS.ERROR && (
              <div className={`${styles.statusMessage} ${styles.statusError}`} role="alert">
                <Icons.AlertCircle size={16} /> {t('error')}
              </div>
            )}
            <button type="submit" className={`btn-primary ${styles.submitButton}`} disabled={status === STATUS.SUBMITTING}>
              {status === STATUS.SUBMITTING ? (
                <>
                  <span className={styles.spinner}></span> {t('submitting')}
                </>
              ) : (
                <>
                  <Icons.Send size={16} /> {t('submit')}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}