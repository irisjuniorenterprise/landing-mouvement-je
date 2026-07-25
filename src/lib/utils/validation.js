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