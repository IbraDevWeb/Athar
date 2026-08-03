# Bibliothèque RAG d’Athar Pro

Cette première version ajoute un moteur de recherche hybride français/arabe, une base SQLite locale, un collecteur prudent pour les pages publiques de Kutub et une interface intégrée à Athar Pro.

## Démarrage

Sous Windows, double-cliquez sur :

```text
start-athar-rag.bat
```

Le script crée automatiquement un environnement Python, installe les deux dépendances du collecteur et ouvre Athar sur :

```text
http://127.0.0.1:8000/?v=34
```

Le serveur sert à la fois l’application et les routes API :

```text
GET /api/rag/status
GET /api/rag/search?q=...
GET /api/rag/ask?q=...
POST /api/rag/ask
```

## Synchronisation Kutub

Le fichier `sync-kutub.bat` importe au maximum 25 pages de chaque ouvrage activé dans `rag/books.json`. Les exécutions suivantes reprennent le travail sans retélécharger les pages déjà présentes.

Le collecteur :

- vérifie `robots.txt` avant toute page ;
- utilise un user-agent identifiable ;
- attend au minimum 1,25 seconde entre deux requêtes ;
- respecte `Retry-After` en cas de code 429 ;
- s’arrête immédiatement sur 401, 403, CAPTCHA ou protection anti-bot ;
- ne se connecte à aucun compte ;
- ne contourne aucune restriction ;
- conserve l’URL source et la date de collecte pour chaque passage.

Pour identifier l’opérateur du bot :

```powershell
$env:ATHAR_BOT_CONTACT="votre-adresse@example.com"
.\sync-kutub.bat
```

## Corpus de démonstration

Avant la première synchronisation, `rag/seed.json` fournit uniquement :

- les métadonnées de cinq ouvrages ;
- de courts titres ou résumés publics ;
- des liens directs vers les pages sources.

L’interface indique explicitement que ce corpus est un index de démonstration. Il ne doit pas servir à attribuer une position juridique détaillée à un auteur.

## Recherche hybride

La recherche combine :

- SQLite FTS5 lorsqu’il est disponible ;
- recherche de secours avec SQLite classique ;
- normalisation des accents français ;
- suppression des voyelles et variantes graphiques arabes ;
- expansions bilingues pour des termes fréquents : ablution, voyage, regroupement, intention, tafsīr, etc. ;
- filtres par madhhab et discipline.

## Réponse RAG

Par défaut, le serveur produit une synthèse extractive : il assemble les passages les mieux classés et les cite sans compléter avec des connaissances extérieures.

Une synthèse locale avec Ollama peut être activée :

```powershell
$env:ATHAR_OLLAMA_MODEL="qwen2.5:7b"
$env:ATHAR_OLLAMA_URL="http://127.0.0.1:11434"
.\start-athar-rag.bat
```

Le prompt interdit au modèle :

- d’inventer une référence ;
- d’utiliser une information absente des passages ;
- de masquer les divergences ;
- de présenter une traduction IA comme une traduction savante relue.

## Données locales

La base est créée dans :

```text
rag/data/athar_rag.sqlite
```

Les snapshots HTML ne sont pas conservés par défaut. L’option `--snapshots` du collecteur permet de les enregistrer localement pour auditer le parseur.

## Limites de cette version

- Le HTML de Kutub peut évoluer et nécessiter une adaptation du parseur.
- Les traductions initiales de Kutub peuvent contenir des erreurs.
- La pertinence sémantique repose encore principalement sur la recherche lexicale enrichie.
- L’import massif de milliers d’ouvrages n’est pas activé par défaut.
- Le système ne remplace pas la consultation des ouvrages, d’un enseignant ou d’un spécialiste qualifié.
