# Guide de contribution

Ce projet suit un workflow Git professionnel adapté à une équipe étudiante
travaillant en Scrum sur des User Stories (US).

## Workflow Git

1. Créer une branche depuis `main` : `feature/US-XX-titre-court`
   (ex. `feature/US-04-carte-interactive`).
2. Committer avec des messages sémantiques :
   - `feat: ajoute la carte interactive Leaflet`
   - `fix: corrige le filtrage par région`
   - `docs: met à jour le guide utilisateur`
   - `test: ajoute les tests du KPIService`
   - `style: ajuste les espacements de la section Hero`
3. Ouvrir une Pull Request vers `main` en utilisant le template fourni
   (`.github/pull_request_template.md`).
4. Au moins une revue de code avant fusion (code review par un binôme).
5. Fusionner en `squash and merge` pour garder un historique lisible.

## Conventions de code

- Composants React en **PascalCase** (`JECards.jsx`), styles associés en
  `NomDuComposant.module.css`.
- Un composant = un fichier ; éviter les fichiers de plus de ~200 lignes en
  extrayant des sous-composants si nécessaire.
- Toujours passer par les entités (`lib/entities`) et repositories
  (`lib/repositories`) pour manipuler les données JE/JC — ne jamais importer
  les fichiers JSON directement dans un composant.
- Toute chaîne de caractères visible par l'utilisateur doit passer par
  `next-intl` (`useTranslations`) et être déclinée en `messages/fr.json` et
  `messages/en.json`.

## Tests

- Toute nouvelle logique métier (entité, service, validation) doit être
  accompagnée d'un test unitaire dans `__tests__/unit`.
- Toute nouvelle route API doit être accompagnée d'un test d'intégration
  dans `__tests__/integration`.
- Les parcours utilisateurs critiques (navigation, changement de langue,
  soumission du formulaire) sont couverts par des tests Playwright dans
  `e2e/`.

## Avant de proposer une PR

```bash
npm run lint
npm run test
```