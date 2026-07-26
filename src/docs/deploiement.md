# Guide de déploiement

Ce document décrit comment déployer la landing page CTJE en production.
Le projet est un site **Next.js 16 (App Router)** standard, déployable sur
Vercel (recommandé, éditeur de Next.js) ou sur tout hébergeur Node.js.

## 1. Option recommandée : Vercel

1. Connecter le dépôt Git (GitHub/GitLab) à un nouveau projet Vercel.
2. Vercel détecte automatiquement Next.js — aucune configuration de build
   n'est requise (`npm run build` par défaut).
3. Renseigner les variables d'environnement dans **Project Settings →
   Environment Variables** (voir section 3 ci-dessous).
4. Déployer. Chaque push sur `main` déclenche un déploiement de production ;
   chaque Pull Request génère un déploiement de prévisualisation.

## 2. Option alternative : serveur Node.js autogéré

```bash
npm ci
npm run build
npm run start   # démarre le serveur Next.js en production sur le port 3000
```

Utiliser un gestionnaire de process (ex. `pm2`) pour garder le serveur actif :

```bash
npm install -g pm2
pm2 start "npm run start" --name landing-mouvement-je
pm2 save
```

Placer un reverse proxy (Nginx, Caddy) devant le port 3000 pour gérer le
TLS/HTTPS et le nom de domaine.

## 3. Variables d'environnement requises en production

| Variable | Description | Obligatoire |
|---|---|---|
| `SMTP_HOST` | Hôte du serveur SMTP | Recommandé (sinon aucun email n'est réellement envoyé) |
| `SMTP_PORT` | Port SMTP (587 ou 465) | Recommandé |
| `SMTP_USER` | Identifiant SMTP | Recommandé |
| `SMTP_PASS` | Mot de passe / clé d'application SMTP | Recommandé |
| `SMTP_FROM` | Adresse d'expédition affichée | Optionnel (valeur par défaut fournie) |
| `CANDIDATURE_RECIPIENT` | Destinataire des candidatures | Optionnel (par défaut `integration.jet.tn@gmail.com`) |

⚠️ Sans ces variables, l'application démarre et fonctionne normalement, mais
la route `/api/candidature` n'envoie aucun email réel (transport
`jsonTransport`) — à éviter en production.

## 4. Fichier GeoJSON requis

Le contour GeoJSON de la Tunisie (`public/geojson/tunisia.geojson`) doit être
présent dans le build déployé pour que la carte s'affiche. S'il est exclu du
dépôt Git, l'ajouter manuellement à l'étape de build (script CI, ou copie
manuelle dans `public/geojson/` avant `npm run build`).

## 5. Checklist avant mise en production

- [ ] `npm run build` passe sans erreur
- [ ] `npm run test` et `npm run test:e2e` passent
- [ ] Variables SMTP configurées et testées (envoi d'un email de test)
- [ ] `public/geojson/tunisia.geojson` présent
- [ ] `public/images/logo.png` et `public/images/LOGO_JE_Tunisia_White.png` présents
- [ ] Domaine et certificat TLS/HTTPS configurés
- [ ] Test manuel du formulaire de candidature en production (email bien reçu)