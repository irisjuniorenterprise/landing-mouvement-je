import { NextResponse } from 'next/server';
import { validateCandidature } from '@/lib/utils/validation';
import { sendCandidatureEmail } from '@/lib/utils/email';

// Limite basique de payload pour éviter les abus (le formulaire est public).
const MAX_FIELD_LENGTH = 5000;

function sanitize(value) {
  return typeof value === 'string' ? value.trim().slice(0, MAX_FIELD_LENGTH) : '';
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'invalid_json' }, { status: 400 });
  }

  const data = {
    name: sanitize(body.name),
    email: sanitize(body.email),
    region: sanitize(body.region),
    establishment: sanitize(body.establishment),
    motivation: sanitize(body.motivation),
    acceptTerms: Boolean(body.acceptTerms),
    // Honeypot anti-spam : champ invisible côté UI, doit rester vide.
    website: sanitize(body.website),
  };

  if (data.website) {
    // Bot détecté : on répond succès pour ne pas l'informer, sans rien envoyer.
    return NextResponse.json({ success: true });
  }

  const { isValid, errors } = validateCandidature(data);
  if (!isValid) {
    return NextResponse.json({ success: false, errors }, { status: 422 });
  }

  try {
    await sendCandidatureEmail(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[candidature] Échec envoi email:', error);
    return NextResponse.json({ success: false, error: 'email_failed' }, { status: 502 });
  }
}