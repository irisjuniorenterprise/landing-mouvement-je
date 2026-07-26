# Landing Page — Mouvement des Juniors Entreprises (CTJE)

Landing page publique, bilingue (FR/EN) et responsive, développée pour la
Confédération Tunisienne des Juniors Entreprises (CTJE) — Pôle Expansion et
Intégration. Elle centralise la présentation du réseau JE/JC, une carte
interactive de la Tunisie, les indicateurs clés du mouvement et un
formulaire de candidature envoyé par email.

## Stack technique

| Composant | Techno |
|---|---|
| Framework | Next.js 16 (App Router) |
| Langage | JavaScript (JSX) |
| Styling | Tailwind CSS 4 + CSS Modules |
| Animations | GSAP (ScrollTrigger) |
| Carte | React-Leaflet |
| i18n | next-intl (FR/EN) |
| Données | Fichiers JSON statiques (`lib/data`) |
| Email | Nodemailer (route API `/api/candidature`) |
| Tests | Jest (unitaire / intégration) + Playwright (e2e) |

## Démarrage

```bash
npm install
cp .env.example .env.local   # configuration SMTP optionnelle, voir plus bas
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000). Les routes localisées
sont accessibles via `/` (français, langue par défaut) et `/en` (anglais).

## Scripts disponibles

```bash
npm run dev        # serveur de développement
npm run build      # build de production
npm run start      # lancer le build de production
npm run lint       # ESLint
npm run test       # tests unitaires et d'intégration (Jest)
npm run test:watch # Jest en mode watch
npm run test:e2e   # tests end-to-end (Playwright, nécessite un build)
```

## Configuration de l'envoi d'email

La route `POST /api/candidature` envoie chaque candidature par email via
Nodemailer. Sans configuration SMTP (`.env.local` absent ou incomplet),
l'application utilise un transport `jsonTransport` : le formulaire fonctionne
normalement mais aucun email n'est réellement envoyé — pratique en local et
en CI. Voir `.env.example` pour les variables `SMTP_HOST`, `SMTP_PORT`,
`SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` et `CANDIDATURE_RECIPIENT`.

## Gestion des données JE / JC

Les Juniors Entreprises et Junior Créations sont gérées via deux fichiers
JSON statiques, sans base de données ni panneau d'administration (hors
périmètre du projet) :

- `lib/data/je.json`
- `lib/data/jc.json`

Voir `docs/guide-utilisateur.md` pour le détail des champs et la marche à
suivre pour ajouter ou modifier une entrée.

## Structure du projet

```
app/[locale]/        Pages et layout (App Router, routes FR/EN)
app/api/candidature/  Route API d'envoi de candidature
components/           Composants React (layout, sections, ui, map, forms)
lib/entities/          Classes métier (JuniorEntreprise, JuniorCreation)
lib/factories/         Fabrique de conversion JSON -> entités
lib/repositories/      Accès aux données JE/JC
lib/services/          Logique métier (calcul des KPIs)
lib/utils/             Validation du formulaire, envoi d'email
messages/              Traductions FR/EN (next-intl)
__tests__/             Tests unitaires et d'intégration (Jest)
e2e/                   Tests end-to-end (Playwright)
```

## Tests

```bash
npm run test       # JuniorEntreprise, KPIService, validation, route API
npm run test:e2e   # parcours utilisateur (navigation, i18n, formulaire)
```

## Licence

MIT — voir `LICENSE`.
