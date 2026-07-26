/**
 * Règles de validation du formulaire de candidature, partagées entre le
 * client (retour immédiat à l'utilisateur) et le serveur (route API), afin
 * d'éviter toute divergence de comportement entre les deux couches.
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateCandidature(data = {}) {
  const errors = {};

  if (!data.name || !data.name.trim()) errors.name = 'required';
  if (!data.email || !data.email.trim()) {
    errors.email = 'required';
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.email = 'invalidEmail';
  }
  if (!data.region || !data.region.trim()) errors.region = 'required';
  if (!data.establishment || !data.establishment.trim()) errors.establishment = 'required';
  if (!data.motivation || !data.motivation.trim()) {
    errors.motivation = 'required';
  } else if (data.motivation.trim().length < 10) {
    errors.motivation = 'tooShort';
  }
  if (!data.acceptTerms) errors.acceptTerms = 'requiredCheckbox';

  return { isValid: Object.keys(errors).length === 0, errors };
}

/**
 * Règles de validation du formulaire de satisfaction UX/UI (KPI 4 — voir
 * section "Impact" du cahier des charges).
 * La note est un score sur 5, saisi par quarts d'étoile (0.25, 0.5, ... 5).
 * Le commentaire est optionnel.
 */
export function validateSatisfaction(data = {}) {
  const errors = {};
  const rating = Number(data.rating);

  if (data.rating === undefined || data.rating === null || data.rating === '') {
    errors.rating = 'required';
  } else if (Number.isNaN(rating) || rating < 0.25 || rating > 5) {
    errors.rating = 'invalidRating';
  } else if (Math.round(rating * 4) !== rating * 4) {
    // Doit être un multiple de 0.25 (quart d'étoile).
    errors.rating = 'invalidRating';
  }

  if (data.comment && data.comment.length > 1000) {
    errors.comment = 'tooLong';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}