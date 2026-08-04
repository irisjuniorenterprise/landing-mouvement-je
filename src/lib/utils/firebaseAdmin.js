import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

/**
 * Client Firestore (Admin SDK) partagé, utilisé pour le calcul/stockage
 * en temps réel des KPIs du dashboard interne (voir app/dashboard).
 * Le SDK Admin a tous les droits et ignore les règles de sécurité
 * Firestore : il ne doit JAMAIS être importé dans un composant client
 * ('use client'), uniquement dans du code serveur (routes API, services).
 */
function ensureFirebaseApp() {
  if (getApps().length > 0) return;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Firebase non configuré : FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL et FIREBASE_PRIVATE_KEY sont requis. Voir env.example.'
    );
  }

  initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

export function getDb() {
  ensureFirebaseApp();
  return getFirestore();
}