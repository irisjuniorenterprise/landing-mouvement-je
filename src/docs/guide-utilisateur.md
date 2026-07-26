# Guide utilisateur — Gestion des données JE / JC

Ce guide s'adresse au Pôle Expansion et Intégration de la CTJE et explique
comment mettre à jour le contenu de la landing page **sans compétences
techniques en développement**, en modifiant simplement deux fichiers de
données.

## 1. Emplacement des données

| Fichier | Contenu |
|---|---|
| `lib/data/je.json` | Liste des Juniors Entreprises actives |
| `lib/data/jc.json` | Liste des Junior Créations en cours de structuration |

Ces fichiers sont au format JSON : chaque Junior Entreprise ou Junior
Création est un objet entre accolades `{ ... }`, séparé des autres par une
virgule, l'ensemble étant entouré de crochets `[ ... ]`.

## 2. Ajouter une Junior Entreprise

Ouvrir `lib/data/je.json` et ajouter un nouvel objet à la liste, par exemple :

```json
{
  "id": 8,
  "nom": "Nom de la nouvelle JE",
  "region": "Monastir",
  "etablissement": "Nom de l'établissement",
  "prestations": ["Prestation 1", "Prestation 2", "Prestation 3"],
  "email": "contact@nouvellejeje.tn",
  "dateCreation": "2020",
  "lat": 35.7643,
  "lng": 10.8113
}
```

**Points d'attention :**

- `id` doit être unique (ne pas réutiliser un identifiant existant).
- `region` doit correspondre au nom du gouvernorat tel qu'il apparaît dans
  la carte (ex. `Sfax`, `Tunis`, `Sousse`...).
- `lat` / `lng` sont les coordonnées GPS de la JE, utilisées pour placer le
  marqueur sur la carte. On peut les obtenir facilement via
  [Google Maps](https://www.google.com/maps) : clic droit sur le lieu →
  copier les coordonnées.
- `prestations` est une liste de chaînes de texte ; seules les deux
  premières apparaissent sur la fiche synthétique, la liste complète
  s'affiche dans la fenêtre de détail ("Voir plus").
- Ne pas oublier la virgule entre deux objets de la liste.

## 3. Ajouter une Junior Création

Même principe dans `lib/data/jc.json` :

```json
{
  "id": 4,
  "nom": "Junior Création [Établissement]",
  "region": "Kairouan",
  "etablissement": "Nom de l'établissement",
  "email": "contact@jc.tn",
  "description": "Courte description du projet et de son état d'avancement.",
  "lat": 35.6781,
  "lng": 10.0963
}
```

## 4. Modifier ou supprimer une entrée

- **Modifier** : éditer directement les valeurs de l'objet correspondant.
- **Supprimer** : retirer l'objet entier (y compris ses accolades) ainsi que
  la virgule qui le sépare des objets voisins.

## 5. Vérifier la validité du fichier

Une erreur de syntaxe JSON (virgule manquante, guillemet oublié) empêche la
page de s'afficher correctement. Avant de déployer, on peut valider le
fichier sur un outil comme [jsonlint.com](https://jsonlint.com), ou lancer
localement :

```bash
npm run build
```

Si le fichier JSON est invalide, la commande affichera une erreur précise
avec le numéro de ligne concerné.

## 6. Régions couvertes par la carte

La carte met en évidence les gouvernorats où le mouvement est présent,
déduits automatiquement de la valeur `region` des entrées JE. Ajouter une JE
dans une nouvelle région suffit à faire apparaître cette région comme
active sur la carte, sans autre configuration.

## 7. Candidatures reçues

Les candidatures soumises via le formulaire ne sont **pas stockées** dans
ces fichiers JSON : elles sont envoyées directement par email à l'adresse
configurée (par défaut `integration.jet.tn@gmail.com`, voir `.env.example`).
C'est au Pôle Expansion de créer manuellement les entrées JE/JC
correspondantes une fois une candidature validée.
