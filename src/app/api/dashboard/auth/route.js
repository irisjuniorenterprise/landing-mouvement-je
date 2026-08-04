import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { getDb } from '@/lib/utils/firebaseAdmin';
import { DASHBOARD_COOKIE_NAME } from '@/lib/utils/dashboardAuth';

const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8h

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  if (!process.env.DASHBOARD_PASSWORD) {
    return NextResponse.json({ success: false, error: 'not_configured' }, { status: 500 });
  }

  if (body.password !== process.env.DASHBOARD_PASSWORD) {
    return NextResponse.json({ success: false, error: 'invalid_password' }, { status: 401 });
  }

  const token = randomUUID();

  try {
    const db = getDb();
    await db
      .collection('dashboard_sessions')
      .doc(token)
      .set({ expiresAt: Date.now() + SESSION_TTL_MS });
  } catch {
    return NextResponse.json({ success: false, error: 'firestore_unavailable' }, { status: 502 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(DASHBOARD_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_MS / 1000,
  });
  return response;
}

export async function DELETE(request) {
  const token = request.cookies.get(DASHBOARD_COOKIE_NAME)?.value;

  if (token) {
    try {
      const db = getDb();
      await db.collection('dashboard_sessions').doc(token).delete();
    } catch {
      /* no-op */
    }
  }

  const response = NextResponse.json({ success: true });
  response.cookies.delete(DASHBOARD_COOKIE_NAME);
  return response;
}