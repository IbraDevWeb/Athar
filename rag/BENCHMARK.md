# Benchmark Athar Research V6

Ce benchmark mesure la qualité **documentaire** du moteur de recherche Athar Research sur un corpus fixe.

Il ne mesure pas la vérité d'un avis religieux et ne doit pas être présenté comme un score de fiabilité d'une fatwa.

## Pourquoi ce benchmark

Avant d'ajouter des embeddings ou de changer le reranking, il faut pouvoir répondre à une question simple :

> la nouvelle version retrouve-t-elle réellement de meilleures preuves que la version précédente ?

Le benchmark fournit une baseline reproductible pour répondre à cette question.

## Jeu de test

`rag/benchmark_v6.json` contient actuellement 30 questions couvrant :

- fiqh et actes de culte ;
- recherche français/arabe ;
- translittération ;
- routage vers des ouvrages explicitement demandés ;
- filtres de madhhab ;
- cas négatifs où Athar devrait s'abstenir.

Les cas marqués `soft` sont mesurés mais ne participent pas au score composite initial.

## Métriques

- **Evidence rate** : proportion de questions positives pour lesquelles au moins un passage est retrouvé.
- **Abstention rate** : proportion de questions négatives pour lesquelles aucun passage n'est fabriqué.
- **Evidence-group recall@K** : proportion des groupes de termes attendus retrouvés dans les K premiers passages.
- **Evidence MRR** : rang réciproque du premier passage couvrant au moins la moitié des groupes attendus.
- **Route accuracy** : précision du routage quand l'utilisateur demande explicitement un ouvrage.
- **Concept recall** : concepts déterministes attendus détectés par le moteur.
- **Citation integrity** : toutes les affirmations `C*` référencent uniquement des identifiants `S*` réellement présents.
- **Provenance rate** : proportion des résultats disposant d'une URL source.
- **Latence p50/p95** : temps d'une requête complète `ask()`.

## Limite méthodologique importante

Le `evidence-group recall@K` est un **proxy lexical**.

Un vrai Recall@K académique demande une annotation humaine de passages gold :

```text
question
  -> chunk_id pertinent 1
  -> chunk_id pertinent 2
  -> chunk_id pertinent 3
```

Tant que cette annotation n'existe pas, le benchmark vérifie que les notions attendues se trouvent dans les passages remontés, mais il ne prétend pas connaître tous les passages pertinents du corpus.

La prochaine étape du benchmark sera donc de remplacer progressivement les groupes de termes par des `gold_chunk_ids` validés manuellement.

## Exécution locale sur le corpus sharded

Après mise en cache du corpus publié :

```powershell
python rag\cache_hosted_corpus.py --manifest rag\corpus_release_v3.json --output-dir rag\data\benchmark-shards

python rag\v6_benchmark.py `
  --manifest rag\corpus_release_v3.json `
  --shard-dir rag\data\benchmark-shards `
  --output-json rag\data\benchmark-report.json `
  --output-md rag\data\BENCHMARK_REPORT.md `
  --require-citation-integrity
```

Par défaut, Gemini Query Intelligence est désactivé afin de conserver un résultat déterministe et comparable.

Pour mesurer séparément l'apport de Gemini :

```powershell
python rag\v6_benchmark.py `
  --manifest rag\corpus_release_v3.json `
  --shard-dir rag\data\benchmark-shards `
  --enable-query-llm
```

Cette seconde exécution ne doit pas remplacer la baseline déterministe.

## Comparaison future des moteurs

Quand le retrieval sémantique sera ajouté, on conservera exactement le même dataset :

```text
V5 lexical + concepts
        vs
V6 lexical + embeddings
        vs
V6 hybride + reranker
```

Une amélioration ne sera retenue que si les métriques progressent sans dégrader l'intégrité des citations.

## CI

`.github/workflows/rag-v6-benchmark.yml` exécute le benchmark sur le release sharded déclaré par `rag/corpus_release_v3.json`.

Le workflow :

1. télécharge et vérifie les shards publiés ;
2. désactive Gemini pour la baseline ;
3. exécute les 30 cas ;
4. exige 100 % d'intégrité des citations et 0 erreur runtime ;
5. publie les rapports JSON et Markdown comme artifacts.

Le score composite n'est volontairement pas bloquant tant qu'une première baseline réelle n'a pas été enregistrée. Après cette baseline, un seuil de non-régression pourra être fixé.
