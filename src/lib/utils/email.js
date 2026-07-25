import nodemailer from 'nodemailer';

const DEFAULT_RECIPIENT = 'integration.jet.tn@gmail.com';

// ---------------------------------------------------------------------------
// Charte graphique des emails (personnalisable ici)
// ---------------------------------------------------------------------------
const THEME = {
  fontBody: "Arial, Helvetica, 'Open Sans', Verdana, sans-serif",
  fontAccent: "Georgia, 'Times New Roman', serif",
  colorText: '#1A1A1A',
  colorTitle: '#C8102E',
  colorLink: '#0563C1',
  colorMuted: '#6B7280',
  colorBg: '#FFFFFF',
};

/**
 * Construit le transporteur SMTP à partir des variables d'environnement.
 * En l'absence de configuration SMTP (environnement de développement ou
 * de recette sans identifiants), on retombe sur le transport "jsonTransport"
 * qui n'envoie rien réellement mais permet de valider le flux de bout en
 * bout et de logger le contenu du message.
 */
function createTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }

  // Fallback sûr pour le développement local : n'envoie aucun email réel.
  return nodemailer.createTransport({ jsonTransport: true });
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

/**
 * Enveloppe commune (header/footer) qui applique la charte graphique :
 * fond blanc, police sans-serif pour le corps, accent serif pour l'entête,
 * interligne aéré, largeur fixe adaptée aux clients email.
 */
function wrapEmail({ title, bodyHtml }) {
  return `
  <!DOCTYPE html>
  <html lang="fr">
    <body style="margin:0; padding:0; background-color:#F3F4F6; font-family:${THEME.fontBody};">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F3F4F6; padding:32px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:${THEME.colorBg}; border-radius:8px; overflow:hidden; max-width:600px; width:100%;">

              

              <!-- Corps -->
              <tr>
                <td style="padding:8px 32px 28px 32px; font-family:${THEME.fontBody}; font-size:15px; line-height:1.6; color:${THEME.colorText};">
                  <h2 style="margin:8px 0 20px 0; font-size:18px; font-weight:bold; text-transform:uppercase; color:${THEME.colorTitle}; letter-spacing:0.3px;">
                    ${escapeHtml(title)}
                  </h2>
                  ${bodyHtml}
                </td>
              </tr>

              <!-- Pied de page -->
              <tr>
                <td style="padding:16px 32px 28px 32px; border-top:1px solid #EEEEEE;">
                  <p style="margin:0; font-family:${THEME.fontBody}; font-size:12px; color:${THEME.colorMuted}; line-height:1.6;">
                    Mouvement JE — CTJE · Notification automatique, merci de ne pas répondre directement à cet email
                    sans vérifier l'adresse de contact fournie ci-dessus.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
}

/** Sous-titre gras souligné, couleur standard (conforme à la charte). */
function subtitle(text) {
  return `<p style="margin:20px 0 8px 0; font-weight:bold; text-decoration:underline; color:${THEME.colorText};">${escapeHtml(text)}</p>`;
}

/** Liste à puces basique (cercles pleins), sans retrait excessif. */
function bulletList(items) {
  const lis = items
    .filter(Boolean)
    .map(({ label, value }) => `<li style="margin:4px 0;"><strong>${escapeHtml(label)} :</strong> ${value}</li>`)
    .join('');
  return `<ul style="margin:0 0 4px 0; padding-left:20px; list-style-type:disc;">${lis}</ul>`;
}

function buildHtmlBody({ name, email, region, establishment, motivation }) {
  const infoList = bulletList([
    { label: 'Nom', value: escapeHtml(name) },
    { label: 'Email', value: `<a href="mailto:${escapeHtml(email)}" style="color:${THEME.colorLink}; text-decoration:underline;">${escapeHtml(email)}</a>` },
    { label: 'Région', value: escapeHtml(region) },
    { label: 'Établissement', value: escapeHtml(establishment) },
  ]);

  const body = `
    ${subtitle('Informations du candidat :')}
    ${infoList}
    ${subtitle('Motivation :')}
    <p style="margin:0; white-space:pre-wrap;">${escapeHtml(motivation)}</p>
  `;

  return wrapEmail({
    title: 'Nouvelle candidature - Mouvement JE',
    bodyHtml: body,
  });
}

/**
 * Envoie l'email de candidature au Pôle Expansion de la CTJE.
 * @returns {Promise<{ success: boolean, messageId?: string }>}
 */
export async function sendCandidatureEmail(data) {
  const transporter = createTransporter();
  const recipient = process.env.CANDIDATURE_RECIPIENT || DEFAULT_RECIPIENT;

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || '"Mouvement JE" <no-reply@ctje.tn>',
    to: recipient,
    replyTo: data.email,
    subject: `[Candidature JE/JC] – ${data.name} – ${data.region}`,
    html: buildHtmlBody(data),
  });

  return { success: true, messageId: info.messageId };
}