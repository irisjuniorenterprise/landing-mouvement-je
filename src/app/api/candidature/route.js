import { NextResponse } from 'next/server';
import { validateCandidature } from '@/lib/utils/validation';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, errors: { name: 'required' } }, { status: 400 });
  }

  // Honeypot anti-spam : si rempli, on répond succès sans rien faire
  // (ne pas donner d'indice à un bot que son envoi a été détecté).
  if (body.website) {
    return NextResponse.json({ success: true });
  }

  const { isValid, errors } = validateCandidature(body);
  if (!isValid) {
    return NextResponse.json({ success: false, errors }, { status: 400 });
  }

  // TODO (US-18) : envoi effectif de l'email à integration.jet.tn@gmail.com
  console.log('[candidature] Nouvelle candidature reçue (email non encore branché) :', {
    name: body.name,
    email: body.email,
    region: body.region,
    establishment: body.establishment,
  });

  return NextResponse.json({ success: true });
}