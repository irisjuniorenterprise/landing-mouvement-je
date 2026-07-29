'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { validateSatisfaction } from '@/lib/utils/validation';
import StarRating from '@/components/ui/StarRating';
import { Icons } from '@/components/icons/Icons';
import styles from './SatisfactionForm.module.css';

const INITIAL_STATE = { rating: 0, comment: '', website: '' };
const STATUS = { IDLE: 'idle', SUBMITTING: 'submitting', SUCCESS: 'success', ERROR: 'error' };

/**
 * Formulaire de satisfaction UX/UI affiché aux visiteurs (KPI 4 — Axe 4
 * "Performance technique et UX" du cahier des charges).
 * Ce que voit l'utilisateur : uniquement ce formulaire, aucune donnée
 * agrégée. Les résultats (moyenne, historique) sont envoyés par email au
 * client — voir lib/utils/email.js#sendSatisfactionEmail — et ne sont
 * jamais exposés côté public.
 */
export default function SatisfactionForm() {
  const t = useTranslations('satisfaction');
  const pathname = usePathname();
  const [values, setValues] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(STATUS.IDLE);
  const [hoverRating, setHoverRating] = useState(null);

  const previewRating = hoverRating ?? values.rating;
  const captionKey = previewRating > 0 ? Math.ceil(previewRating) : null;
  const isFullRating = previewRating === 5;

  const handleRatingChange = (rating) => {
    setValues((prev) => ({ ...prev, rating }));
    if (errors.rating) setErrors((prev) => ({ ...prev, rating: undefined }));
  };

  const handleCommentChange = (e) => {
    setValues((prev) => ({ ...prev, comment: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValid, errors: validationErrors } = validateSatisfaction(values);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setStatus(STATUS.SUBMITTING);
    setErrors({});

    try {
      const response = await fetch('/api/satisfaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, page: pathname }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data.errors) setErrors(data.errors);
        setStatus(STATUS.ERROR);
        return;
      }

      setStatus(STATUS.SUCCESS);
      setValues(INITIAL_STATE);
    } catch {
      setStatus(STATUS.ERROR);
    }
  };

  const fieldError = (field) => errors[field] && t(`errors.${errors[field]}`);

  if (status === STATUS.SUCCESS) {
    return (
      <section id="satisfaction" className="section-padding bg-surface section-animate">
        <div className="container">
          <div className={styles.thankYou} role="status">
            <Icons.Check size={28} className={styles.thankYouIcon} />
            <p>{t('success')}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="satisfaction" className="section-padding bg-surface section-animate">
      <div className="container">
        <h2 className="section-title">{t('title')}</h2>
        <p className="section-subtitle">{t('subtitle')}</p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={`${styles.ratingField} ${isFullRating ? styles.ratingFieldFull : ''}`}>
            <span className={styles.ratingLabel}>{t('ratingLabel')}</span>

            <StarRating
              value={values.rating}
              onChange={handleRatingChange}
              onHoverChange={setHoverRating}
              label={t('ratingLabel')}
            />

            <span className={styles.ratingCaptionSlot}>
              {captionKey && (
                <span
                  key={captionKey}
                  className={`${styles.ratingCaption} ${isFullRating ? styles.ratingCaptionFull : ''}`}
                >
                  {isFullRating && <span aria-hidden="true">✨</span>}
                  {t(`ratingCaptions.${captionKey}`)}
                  {isFullRating && <span aria-hidden="true">✨</span>}
                </span>
              )}
            </span>

            {values.rating > 0 && (
              <span className={styles.ratingValue}>{values.rating} / 5</span>
            )}
            {fieldError('rating') && (
              <span className={styles.errorText}>
                <Icons.AlertCircle size={14} /> {fieldError('rating')}
              </span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.fixedLabel} htmlFor="sf-comment">
              {t('commentLabel')}
            </label>
            <textarea
              id="sf-comment"
              className={styles.textarea}
              placeholder={t('commentPlaceholder')}
              value={values.comment}
              onChange={handleCommentChange}
              maxLength={1000}
            />
          </div>

          {/* Honeypot anti-spam */}
          <div className={styles.honeypot} aria-hidden="true">
            <label htmlFor="sf-website">Website</label>
            <input
              id="sf-website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={values.website}
              onChange={(e) => setValues((prev) => ({ ...prev, website: e.target.value }))}
            />
          </div>

          <div className={styles.submitRow}>
            {status === STATUS.ERROR && (
              <div className={styles.statusError} role="alert">
                <Icons.AlertCircle size={16} /> {t('error')}
              </div>
            )}
            <button type="submit" className="btn-primary" disabled={status === STATUS.SUBMITTING}>
              {status === STATUS.SUBMITTING ? t('submitting') : <><Icons.Send size={16} /> {t('submit')}</>}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}