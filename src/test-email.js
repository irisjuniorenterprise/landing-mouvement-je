// Script de diagnostic SMTP — à lancer avec : node test-email.js
// (à la racine du projet, là où se trouve .env.local)
//
// Objectif : isoler le problème d'envoi d'email en dehors de Next.js,
// pour voir l'erreur SMTP exacte sans passer par le formulaire du site.

require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

async function main() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, CANDIDATURE_RECIPIENT } = process.env;

  console.log('--- Variables chargées ---');
  console.log('SMTP_HOST:', SMTP_HOST);
  console.log('SMTP_PORT:', SMTP_PORT);
  console.log('SMTP_USER:', SMTP_USER);
  console.log('SMTP_PASS:', SMTP_PASS ? `(${SMTP_PASS.length} caractères)` : '(vide !)');
  console.log('CANDIDATURE_RECIPIENT:', CANDIDATURE_RECIPIENT);
  console.log('---------------------------');

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.error('❌ Une variable SMTP est manquante. Vérifiez que .env.local est bien à la racine du projet.');
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  try {
    // Vérifie la connexion + l'authentification SMTP avant tout envoi.
    await transporter.verify();
    console.log('✅ Connexion et authentification SMTP réussies.');
  } catch (err) {
    console.error('❌ Échec de connexion/authentification SMTP :');
    console.error(err);
    process.exit(1);
  }

  try {
    const info = await transporter.sendMail({
      from: SMTP_FROM || `"Test" <${SMTP_USER}>`,
      to: CANDIDATURE_RECIPIENT || SMTP_USER,
      subject: 'Test SMTP — Mouvement JE',
      html: '<p>Ceci est un email de test envoyé depuis test-email.js.</p>',
    });
    console.log('✅ Email envoyé avec succès. messageId :', info.messageId);
  } catch (err) {
    console.error('❌ Échec de l\'envoi de l\'email :');
    console.error(err);
    process.exit(1);
  }
}

main();
