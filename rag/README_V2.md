# Bibliothèque Savante V2

La Bibliothèque Savante V2 est la couche **citation-first** d’Athar Pro. Elle devient l’entrée principale de l’encyclopédie, aux côtés de la Bibliothèque des Compagnons.

## Promesse

La V2 applique trois règles :

1. retrouver les passages les plus pertinents dans le corpus réellement indexé ;
2. relier chaque affirmation affichée à un ou plusieurs identifiants de sources ;
3. refuser une conclusion lorsque les textes disponibles sont insuffisants.

Elle ne présente pas une notice de catalogue comme une preuve juridique et ne masque pas le statut d’une traduction automatique.

## Démarrage

Sous Windows :

```text
start-athar-rag.bat
```

Puis ouvrir :

```text
http://127.0.0.1:8000/?v=34
```

La Bibliothèque Savante V2 apparaît tout en haut de la navigation. Le moteur V1 reste accessible comme espace technique dans `Étude & Coran → Moteur RAG classique`.

## Routes API V2

```text
GET  /api/rag/v2/status
GET  /api/rag/v2/evaluation
GET  /api/rag/v2/corpus
GET  /api/rag/v2/search?q=...
GET  /api/rag/v2/ask?q=...
POST /api/rag/v2/ask
```

Exemple de corps POST :

```json
{
  "query": "Peut-on regrouper dhuhr et asr pendant le voyage ?",
  "madhhab": "Mālikite",
  "discipline": "Fiqh",
  "limit": 12
}
```

## Structure d’une réponse

Une réponse V2 contient :

- l’analyse de la question ;
- le niveau de couverture du corpus ;
- les affirmations ou extraits ;
- les conditions repérées ;
- les divergences ou nuances ;
- les limites ;
- les sources classées ;
- un audit des identifiants de citation.

Chaque affirmation doit posséder au moins un `source_id` valide. Les preuves sont identifiées par `S1`, `S2`, etc.

## Niveaux de couverture

```text
sufficient    plusieurs passages substantiels, idéalement plusieurs ouvrages
partial       passages utiles mais couverture trop limitée pour conclure fermement
insufficient  aucun texte substantiel suffisant ; Athar refuse de compléter
```

Le score de couverture décrit le corpus disponible, pas la certitude religieuse absolue d’un avis.

## Corpus actuel et objectif

L’interface affiche les données réelles de SQLite :

- ouvrages enregistrés ;
- pages distinctes ;
- passages indexés ;
- passages substantiels ;
- notices de catalogue ;
- statuts de traduction.

L’objectif V2 est de structurer **25 ouvrages prioritaires**, avec volumes, chapitres, pages, édition et statut de vérification. L’application n’affiche jamais cet objectif comme déjà atteint.

## Synchronisation

```text
sync-kutub.bat
```

Chaque lancement traite le prochain lot prudent de 25 pages maximum par ouvrage activé. Le collecteur conserve désormais :

- la hiérarchie de titres détectée ;
- le volume lorsqu’il est identifiable ;
- la page imprimée lorsqu’elle est identifiable ;
- la page source ;
- la présence de l’arabe et du français ;
- le statut `imported_unreviewed` ;
- le type de source bibliographique.

Les contrôles de `robots.txt`, les délais, `Retry-After` et les arrêts sur protections anti-bot restent obligatoires.

## Synthèse locale facultative

Sans modèle, la V2 produit une présentation extractive citation-first. Avec Ollama :

```powershell
$env:ATHAR_OLLAMA_MODEL="qwen2.5:7b"
.\start-athar-rag.bat
```

Le modèle doit retourner un JSON structuré. Les affirmations dépourvues d’identifiants de sources valides sont supprimées.

## Évaluation

`rag/evaluation_v2.json` contient les premières questions de contrôle. L’objectif est de passer progressivement de 24 à 200 cas, avec pour chaque question :

- discipline ;
- madhhab ;
- sujets attendus ;
- expressions arabes attendues.

La CI crée une base temporaire, ajoute un passage mālikite substantiel et vérifie :

- l’analyse de la question ;
- la production d’affirmations citées ;
- la validité de tous les `source_ids` ;
- le refus d’une couverture solide pour un sujet absent ;
- les métriques du corpus ;
- le banc d’évaluation.

## Limite importante

La V2 est désormais un véritable produit citation-first, mais le corpus complet reste un chantier éditorial. La pertinence repose actuellement sur FTS5, les expansions bilingues et un reranking local. PostgreSQL/pgvector et les embeddings multilingues ne sont pas encore requis pour faire fonctionner cette version locale ; ils pourront remplacer la couche de récupération lorsque le corpus justifiera cette migration.
