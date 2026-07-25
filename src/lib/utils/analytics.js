'use client';

/**
 * Petites fonctions de tracking d'évènements produit. Stub sans
 * dépendance externe pour l'instant : logue en dev, ne fait rien en
 * production. L'API (trackOnce/trackEvent) est stable, un vrai fournisseur
 * d'analytics pourra être branché ici sans toucher aux appelants.
 */
const firedOnce = new Set();

export function trackOnce(eventName, data) {
  if (firedOnce.has(eventName)) return;
  firedOnce.add(eventName);
  trackEvent(eventName, data);
}

export function trackEvent(eventName, data) {
  if (process.env.NODE_ENV !== 'production') {
    console.debug(`[analytics] ${eventName}`, data || {});
  }
}