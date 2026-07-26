'use client';

import { track } from '@vercel/analytics';

/**
 * Évènements personnalisés Vercel Analytics utilisés pour calculer les
 * KPIs "taux" du cahier des charges (section Impact) :
 *
 *  - KPI 1 (Taux de complétion du formulaire) =
 *      count('candidature_form_submitted') / count('candidature_form_started') × 100
 *  - KPI 2 (Taux d'interaction avec la carte) =
 *      count('map_interaction') / total des visiteurs uniques (pageviews) × 100
 *
 * Ces comptages sont visibles côté client uniquement dans le dashboard
 * Vercel (vercel.com/<projet>/analytics/events) — jamais côté visiteur.
 */

// Un Set en mémoire (par chargement de page) pour dédupliquer les
// évènements "a interagi au moins une fois" : sans ça, un simple survol
// de carte enverrait des dizaines d'évènements et fausserait le taux.
const firedOnce = new Set();

/** Envoie l'évènement une seule fois par chargement de page. */
export function trackOnce(eventName, data) {
  if (firedOnce.has(eventName)) return;
  firedOnce.add(eventName);
  trackEvent(eventName, data);
}

/** Envoie l'évènement à chaque appel, sans déduplication. */
export function trackEvent(eventName, data) {
  try {
    track(eventName, data);
  } catch (error) {
    // Ne doit jamais casser l'UX (ex. bloqueur de pub qui coupe l'endpoint
    // d'analytics) : on se contente de logger en dev.
    console.warn(`[analytics] échec de l'envoi de l'évènement "${eventName}":`, error);
  }
}