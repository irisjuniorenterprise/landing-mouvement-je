'use client';

/**
 * Identifiant visiteur anonyme (UUID), stocké dans un cookie, utilisé
 * uniquement pour compter des visiteurs UNIQUES côté dashboard interne
 * (KPI 2 et KPI 3). Aucune donnée personnelle.
 */
const COOKIE_NAME = 'ctje_vid';
const COOKIE_MAX_AGE_DAYS = 365;

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `v-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getOrCreateVisitorId() {
  if (typeof document === 'undefined') return null;

  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]+)`));
  if (match) return decodeURIComponent(match[1]);

  const id = generateId();
  const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${COOKIE_NAME}=${id}; path=/; max-age=${maxAge}; samesite=lax`;
  return id;
}