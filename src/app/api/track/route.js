import { NextResponse } from 'next/server';
import KPIMetricsService from '@/lib/services/KPIMetricsService';

const EVENT_COLLECTION_MAP = {
  pageview: 'kpi_visitors',
  form_started: 'kpi_form_started',
  map_interaction: 'kpi_map_interacted',
};
const VISITOR_ID_REGEX = /^[a-zA-Z0-9-_]{8,64}$/;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const { event, visitorId } = body || {};
  const collectionName = EVENT_COLLECTION_MAP[event];

  if (!collectionName || !VISITOR_ID_REGEX.test(visitorId || '')) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  try {
    const period = KPIMetricsService.currentPeriod();
    await KPIMetricsService.recordUniqueEntry(period, collectionName, visitorId);
    return NextResponse.json({ success: true });
  } catch (error) {
    // Best-effort, comme le reste du tracking du projet : ne doit
    // jamais dégrader l'expérience visiteur.
    console.warn('[track] échec écriture Firestore:', error.message);
    return NextResponse.json({ success: true });
  }
}