import { FieldValue } from 'firebase-admin/firestore';
import { getDb } from '@/lib/utils/firebaseAdmin';

/**
 * Service métier responsable du calcul des 4 KPIs "Impact" (cahier des
 * charges, section 3.3) à partir des données stockées dans Firestore.
 *
 * Modèle de données Firestore :
 *  - kpi_visitors/{period}/entries/{visitorId}        → 1 doc par visiteur unique (KPI 3)
 *  - kpi_form_started/{period}/entries/{visitorId}     → 1 doc par visiteur ayant commencé le formulaire (KPI 1, dénominateur)
 *  - kpi_map_interacted/{period}/entries/{visitorId}   → 1 doc par visiteur ayant interagi avec la carte (KPI 2, numérateur)
 *  - kpi_counters/{period}                              → { formSubmitted, satisfactionSum, satisfactionCount }
 *  - kpi_meta/periods                                   → { periods: [...] } (index des mois connus)
 */
const SATISFACTION_MAX_SCORE = 5;

export const KPI_TARGETS = {
  formCompletionRate: 70,
  mapInteractionRate: 40,
  monthlyUniqueVisitors: { min: 45, max: 50 },
  satisfactionRate: 75,
};

function currentPeriod(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

function safeRate(numerator, denominator) {
  if (!denominator) return 0;
  return Math.round((numerator / denominator) * 1000) / 10;
}

async function countEntries(period, collectionName) {
  const db = getDb();
  const snap = await db
    .collection(collectionName)
    .doc(period)
    .collection('entries')
    .count()
    .get();
  return snap.data().count;
}

class KPIMetricsService {
  static currentPeriod = currentPeriod;

  static async recordUniqueEntry(period, collectionName, visitorId) {
    const db = getDb();
    await db
      .collection(collectionName)
      .doc(period)
      .collection('entries')
      .doc(visitorId)
      .set({ recordedAt: FieldValue.serverTimestamp() }, { merge: true });
    await KPIMetricsService.registerPeriod(period);
  }

  static async incrementCounter(period, fields) {
    const db = getDb();
    await db.collection('kpi_counters').doc(period).set(fields, { merge: true });
    await KPIMetricsService.registerPeriod(period);
  }

  static async registerPeriod(period) {
    const db = getDb();
    await db
      .collection('kpi_meta')
      .doc('periods')
      .set({ periods: FieldValue.arrayUnion(period) }, { merge: true });
  }

  static async listPeriods() {
    const db = getDb();
    const snap = await db.collection('kpi_meta').doc('periods').get();
    const periods = snap.exists ? snap.data().periods || [] : [];
    return periods.sort().reverse();
  }

  static async computeForPeriod(period) {
    const db = getDb();

    const [uniqueVisitors, formStartedVisitors, mapInteractedVisitors, counterSnap] =
      await Promise.all([
        countEntries(period, 'kpi_visitors'),
        countEntries(period, 'kpi_form_started'),
        countEntries(period, 'kpi_map_interacted'),
        db.collection('kpi_counters').doc(period).get(),
      ]);

    const counters = counterSnap.exists ? counterSnap.data() : {};
    const formSubmitted = Number(counters.formSubmitted) || 0;
    const satisfactionSum = Number(counters.satisfactionSum) || 0;
    const satisfactionCount = Number(counters.satisfactionCount) || 0;

    const formCompletionRate = safeRate(formSubmitted, formStartedVisitors);
    const mapInteractionRate = safeRate(mapInteractedVisitors, uniqueVisitors);
    const satisfactionRate =
      satisfactionCount > 0
        ? Math.round((satisfactionSum / (satisfactionCount * SATISFACTION_MAX_SCORE)) * 1000) / 10
        : 0;

    return {
      period,
      kpi1_formCompletion: {
        label: 'Taux de complétion du formulaire',
        value: formCompletionRate,
        unit: '%',
        targetLabel: '> 70%',
        status: formCompletionRate >= KPI_TARGETS.formCompletionRate ? 'ok' : 'warning',
        raw: { formSubmitted, formStartedVisitors },
      },
      kpi2_mapInteraction: {
        label: "Taux d'interaction avec la carte",
        value: mapInteractionRate,
        unit: '%',
        targetLabel: '> 40%',
        status: mapInteractionRate >= KPI_TARGETS.mapInteractionRate ? 'ok' : 'warning',
        raw: { mapInteractedVisitors, uniqueVisitors },
      },
      kpi3_traffic: {
        label: 'Volume de trafic mensuel (visiteurs uniques)',
        value: uniqueVisitors,
        unit: 'visiteurs',
        targetLabel: '45 à 50 visiteurs (1er mois)',
        status: uniqueVisitors >= KPI_TARGETS.monthlyUniqueVisitors.min ? 'ok' : 'warning',
        raw: { uniqueVisitors },
      },
      kpi4_satisfaction: {
        label: 'Taux de satisfaction UX/UI',
        value: satisfactionRate,
        unit: '%',
        targetLabel: '≥ 75%',
        status: satisfactionRate >= KPI_TARGETS.satisfactionRate ? 'ok' : 'warning',
        raw: { satisfactionSum, satisfactionCount },
      },
    };
  }
}

export default KPIMetricsService;