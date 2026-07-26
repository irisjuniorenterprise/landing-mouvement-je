# Landing Page — Mouvement des Juniors Entreprises (CTJE)

Landing page publique, bilingue (FR/EN) et responsive, développée pour la
Confédération Tunisienne des Juniors Entreprises (CTJE) — Pôle Expansion et
Intégration. Elle centralise la présentation du réseau JE/JC, une carte
interactive de la Tunisie, les indicateurs clés du mouvement et un
formulaire de candidature envoyé par email.

## Sommaire

- [Stack technique](#stack-technique)
- [Prérequis](#prérequis)
- [Installation & démarrage](#installation--démarrage)
- [Structure du projet](#structure-du-projet)
- [Scripts disponibles](#scripts-disponibles)
- [Configuration de l'envoi d'email](#configuration-de-lenvoi-demail)
- [Gestion des données JE / JC](#gestion-des-données-je--jc)
- [Tests](#tests)
- [Documentation complémentaire](#documentation-complémentaire)
- [Licence](#licence)

## Stack technique

| Composant   | Techno                                  |
|-------------|------------------------------------------|
| Framework   | Next.js 16 (App Router, Turbopack)       |
| Langage     | JavaScript (JSX)                         |
| Styling     | Tailwind CSS 4 + CSS Modules              |
| Animations  | GSAP (ScrollTrigger)                     |
| Carte       | React-Leaflet + GeoJSON Tunisie          |
| i18n        | next-intl (FR/EN)                        |
| Données     | Fichiers JSON statiques (`lib/data`)     |
| Email       | Nodemailer (route API `/api/candidature`)|
| Tests       | Jest (unitaire / intégration) + Playwright (e2e) |

## Prérequis

- Node.js ≥ 18.18
- npm ≥ 10

## Installation & démarrage

```bash
git clone <url-du-depot>
cd landing-mouvement-je
npm install
cp .env.example .env.local   # configuration SMTP optionnelle, voir plus bas
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000). Les routes localisées
sont accessibles via `/` (français, langue par défaut) et `/en` (anglais).

> 📁 **Fichier requis mais non versionné** : place le contour GeoJSON de la
> Tunisie à `public/geojson/tunisia.geojson` pour que la carte s'affiche
> (fichier volontairement exclu du dépôt, voir `.gitignore` ou instructions
> internes de l'équipe).

## Structure du projet

```
app/[locale]/            Pages et layout (App Router, routes FR/EN)
app/api/candidature/     Route API d'envoi de candidature
components/forms/        Formulaire de candidature
components/icons/        Bibliothèque d'icônes SVG internes
components/layout/       Header, Footer
components/map/          Carte interactive (React-Leaflet)
components/sections/     Sections de la page (Hero, KPIs, NetworkExplorer, JECards, JCDetails)
components/ui/           Composants réutilisables (Card, Modal, Button, Breadcrumb...)
lib/config/              Configuration partagée (breakpoints)
lib/data/                Données JSON statiques JE/JC + régions
lib/entities/            Classes métier (JuniorEntreprise, JuniorCreation)
lib/factories/           Fabrique de conversion JSON -> entités
lib/repositories/        Accès aux données JE/JC
lib/services/            Logique métier (calcul des KPIs)
lib/utils/               Validation du formulaire, envoi d'email, analytics
i18n/                    Configuration next-intl (locales, résolution des messages)
messages/                Traductions FR/EN (next-intl)
public/images/           Logos et visuels
public/geojson/          Contour GeoJSON de la Tunisie (à fournir localement)
tests/unit/              Tests unitaires (entités, services, validation)
tests/integration/       Tests d'intégration (route API)
e2e/                      Tests end-to-end (Playwright)
docs/                     Documentation utilisateur et guide de déploiement
```

## Scripts disponibles

```bash
npm run dev        # serveur de développement (Turbopack)
npm run build      # build de production
npm run start      # lancer le build de production
npm run lint       # ESLint
npm run test       # tests unitaires et d'intégration (Jest)
npm run test:watch # Jest en mode watch
npm run test:e2e   # tests end-to-end (Playwright, nécessite un build)
```

## Configuration de l'envoi d'email

La route `POST /api/candidature` envoie chaque candidature par email via
Nodemailer.

Sans configuration SMTP (`.env.local` absent ou incomplet), l'application
utilise un transport `jsonTransport` : le formulaire fonctionne normalement
mais aucun email n'est réellement envoyé — pratique en local et en CI.

Voir `.env.example` pour les variables :

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `CANDIDATURE_RECIPIENT` (par défaut `integration.jet.tn@gmail.com`)

## Gestion des données JE / JC

Les Juniors Entreprises et Junior Créations sont gérées via deux fichiers
JSON statiques, sans base de données ni panneau d'administration (hors
périmètre du projet actuel) :

- `lib/data/je.json`
- `lib/data/jc.json`
- `lib/data/regions.js` — liste des 24 gouvernorats (formulaire + filtre carte)

Voir [`docs/guide-utilisateur.md`](docs/guide-utilisateur.md) pour le détail
des champs et la marche à suivre pour ajouter ou modifier une entrée.

## Tests

```bash
npm run test       # JuniorEntreprise, KPIService, validation, route API
npm run test:e2e   # parcours utilisateur (navigation, i18n, carte, formulaire)
```

Voir le rapport de recette de l'US-22 pour l'historique des bugs corrigés.

## Documentation complémentaire

- [`CONTRIBUTING.md`](CONTRIBUTING.md) — workflow Git, conventions de commit, conventions de code
- [`docs/guide-utilisateur.md`](docs/guide-utilisateur.md) — gestion des données JE/JC pour un profil non-développeur
- [`docs/deploiement.md`](docs/deploiement.md) — guide de déploiement

## Licence

MIT — voir `LICENSE`.