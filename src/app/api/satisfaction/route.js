import { NextResponse } from 'next/server';
import { validateSatisfaction } from '@/lib/utils/validation';
import { sendSatisfactionEmail } from '@/lib/utils/email';
import { appendSatisfactionEntry } from '@/lib/utils/satisfactionLog';
import KPIMetricsService from '@/lib/services/KPIMetricsService';
import { FieldValue } from 'firebase-admin/firestore';

const MAX_COMMENT_LENGTH = 1000;

function sanitizeComment(value) {
  return typeof value === 'string' ? value.trim().slice(0, MAX_COMMENT_LENGTH) : '';
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'invalid_json' }, { status: 400 });
  }

  const data = {
    rating: body.rating,
    comment: sanitizeComment(body.comment),
    page: typeof body.page === 'string' ? body.page.slice(0, 200) : '',
    // Honeypot anti-spam, comme pour le formulaire de candidature.
    website: typeof body.website === 'string' ? body.website.trim() : '',
  };

  if (data.website) {
    return NextResponse.json({ success: true });
  }

  const { isValid, errors } = validateSatisfaction(data);
  if (!isValid) {
    return NextResponse.json({ success: false, errors }, { status: 422 });
  }

  // Journal local best-effort (dev only) : ne doit jamais bloquer la
  // réponse même en cas d'échec (voir lib/utils/satisfactionLog.js).
  appendSatisfactionEntry({ rating: data.rating, comment: data.comment, page: data.page });

  // KPI 4 (Taux de satisfaction UX/UI) — stockage temps réel dans Firestore.
  // Best-effort, comme le journal local.
  recordSatisfactionKPI(data.rating).catch((error) => {
    console.warn('[satisfaction] échec écriture KPI Firestore:', error.message);
  });

  try {
    await sendSatisfactionEmail(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[satisfaction] Échec envoi email:', error);
    return NextResponse.json({ success: false, error: 'email_failed' }, { status: 502 });
  }
}

async function recordSatisfactionKPI(rating) {
  const period = KPIMetricsService.currentPeriod();
  await KPIMetricsService.incrementCounter(period, {
    satisfactionSum: FieldValue.increment(Number(rating)),
    satisfactionCount: FieldValue.increment(1),
  });
}