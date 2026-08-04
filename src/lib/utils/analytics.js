'use client';

import { track } from '@vercel/analytics';
import { getOrCreateVisitorId } from '@/lib/utils/visitorId';

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
 *
 * En parallèle, ces mêmes évènements sont aussi envoyés vers /api/track
 * (voir pingBackend) pour alimenter notre dashboard interne (/dashboard),
 * qui applique les formules KPI exactes du cahier des charges.
 */

const firedOnce = new Set();

// Correspondance entre les noms d'évènements Vercel Analytics existants
// et les évènements attendus par /api/track.
const BACKEND_EVENT_MAP = {
  candidature_form_started: 'form_started',
  map_interaction: 'map_interaction',
};

/** Envoie l'évènement une seule fois par chargement de page. */
export function trackOnce(eventName, data) {
  if (firedOnce.has(eventName)) return;
  firedOnce.add(eventName);
  trackEvent(eventName, data);

  const backendEvent = BACKEND_EVENT_MAP[eventName];
  if (backendEvent) {
    pingBackend(backendEvent, getOrCreateVisitorId());
  }
}

/** Envoie l'évènement à chaque appel, sans déduplication. */
export function trackEvent(eventName, data) {
  try {
    track(eventName, data);
  } catch (error) {
    console.warn(`[analytics] échec de l'envoi de l'évènement "${eventName}":`, error);
  }
}

/**
 * Envoie un évènement au backend interne (Firestore) pour alimenter le
 * dashboard KPIs de l'équipe (/dashboard).
 */
export function pingBackend(event, visitorId) {
  if (!visitorId) return;
  try {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, visitorId }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* no-op : ne doit jamais casser l'UX */
  }
}