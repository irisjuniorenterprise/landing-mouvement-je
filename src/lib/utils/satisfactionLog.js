import fs from 'fs';
import path from 'path';

/**
 * Journal local (best-effort) des soumissions du formulaire de satisfaction
 * UX/UI (KPI 4).
 *
 * IMPORTANT — limite connue : sur Vercel (fonctions serverless), le système
 * de fichiers est en lecture seule et non persistant entre invocations. Ce
 * fichier ne sera donc PAS mis à jour de façon fiable en production ; il ne
 * sert qu'en développement local (pour inspecter rapidement les résultats
 * sans avoir besoin d'une boîte mail). Le canal fiable en production est
 * l'email envoyé via lib/utils/email.js#sendSatisfactionEmail.
 *
 * Si le volume d'avis grandit et qu'un vrai historique/dashboard est
 * nécessaire en production, remplacer ce module par une base persistante
 * (Vercel Postgres, Vercel KV, etc.) plutôt que d'écrire sur le disque.
 */
const LOG_PATH = path.join(process.cwd(), 'lib', 'data', 'satisfaction-log.json');

function isWritableEnvironment() {
  // process.env.VERCEL est défini automatiquement sur les déploiements Vercel.
  return !process.env.VERCEL;
}

export function appendSatisfactionEntry(entry) {
  if (!isWritableEnvironment()) return { persisted: false, reason: 'read_only_fs' };

  try {
    let entries = [];
    if (fs.existsSync(LOG_PATH)) {
      const raw = fs.readFileSync(LOG_PATH, 'utf-8');
      entries = raw.trim() ? JSON.parse(raw) : [];
    }

    entries.push({ ...entry, submittedAt: new Date().toISOString() });
    fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true });
    fs.writeFileSync(LOG_PATH, JSON.stringify(entries, null, 2), 'utf-8');
    return { persisted: true };
  } catch (error) {
    // Best-effort : une erreur d'écriture ne doit jamais faire échouer la
    // soumission (l'email reste le canal de vérité).
    console.warn('[satisfaction] Écriture du journal local impossible:', error.message);
    return { persisted: false, reason: 'write_failed' };
  }
}