/**
 * @jest-environment node
 *
 * Test d'intégration de la route API /api/candidature.
 * Environnement "node" requis : les API Web Request/Response utilisées par
 * Next.js ne sont pas disponibles sous jsdom. On force par ailleurs le
 * transport nodemailer en mode "jsonTransport" (aucune variable SMTP_*
 * définie) afin de valider le flux complet sans envoyer de véritable email.
 */
import { POST } from '@/app/api/candidature/route';

function buildRequest(body) {
  return new Request('http://localhost/api/candidature', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

const validPayload = {
  name: 'Amira Ben Salah',
  email: 'amira@example.com',
  region: 'Sfax',
  establishment: 'ENIS',
  motivation: 'Je souhaite rejoindre le mouvement JE pour développer mes compétences.',
  acceptTerms: true,
};

describe('POST /api/candidature', () => {
  it('returns success for a valid payload', async () => {
    const response = await POST(buildRequest(validPayload));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('returns 422 with field errors for an invalid payload', async () => {
    const response = await POST(buildRequest({ ...validPayload, email: 'bad-email' }));
    const data = await response.json();

    expect(response.status).toBe(422);
    expect(data.success).toBe(false);
    expect(data.errors.email).toBe('invalidEmail');
  });

  it('silently succeeds without sending an email when the honeypot is filled', async () => {
    const response = await POST(buildRequest({ ...validPayload, website: 'http://spam.example' }));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('returns 400 for malformed JSON', async () => {
    const request = new Request('http://localhost/api/candidature', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{not valid json',
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
