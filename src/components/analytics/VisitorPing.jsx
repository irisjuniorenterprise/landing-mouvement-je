'use client';

import { useEffect } from 'react';
import { getOrCreateVisitorId } from '@/lib/utils/visitorId';
import { pingBackend } from '@/lib/utils/analytics';

/**
 * Enregistre une visite auprès du backend interne (Firestore), pour
 * alimenter le dashboard KPIs (KPI 3 — trafic). Ne rend rien à l'écran.
 */
export default function VisitorPing() {
  useEffect(() => {
    const visitorId = getOrCreateVisitorId();
    if (visitorId) pingBackend('pageview', visitorId);
  }, []);

  return null;
}