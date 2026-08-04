import { cookies } from 'next/headers';
import { getDb } from '@/lib/utils/firebaseAdmin';

export const DASHBOARD_COOKIE_NAME = 'ctje_dash_session';

/** Vérifie si la requête courante porte une session dashboard valide. */
export async function isDashboardAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(DASHBOARD_COOKIE_NAME)?.value;
  if (!token) return false;

  try {
    const db = getDb();
    const snap = await db.collection('dashboard_sessions').doc(token).get();
    if (!snap.exists) return false;

    const { expiresAt } = snap.data();
    if (!expiresAt || Date.now() > expiresAt) {
      snap.ref.delete().catch(() => {});
      return false;
    }
    return true;
  } catch {
    return false;
  }
}