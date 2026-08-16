# Athar Research V6.3-C — Global ANN Shadow

## Objectif

V6.3-C transforme les 574 461 embeddings V6.3-B en un vrai index de recherche sémantique globale. La couche ANN reste expérimentale et n'est pas branchée à Render.

## Architecture

```text
Question
  -> embedding de requête
  -> V6.1 lexical (autorité pour routage + abstention)
  -> ANN global USearch/HNSW sur 574 461 passages
  -> filtres livre / madhhab / discipline
  -> hydratation depuis les shards SQLite immuables
  -> fusion RRF lorsque V6.1 a déjà admis des preuves
  -> shadow_ann_sources même en cas d'abstention, sans promotion
```

## Garde-fous

- L'ANN ne modifie jamais le corpus SQLite ni les embeddings V6.3-B.
- Un hit ANN ne peut pas renverser une abstention V6.1 en shadow mode.
- Le routage explicite d'un ouvrage reste déterministe.
- Un madhhab demandé reste filtré sur les métadonnées explicites.
- Les citations sont hydratées depuis les chunks canoniques du corpus, pas fabriquées par l'index vectoriel.
- Render et `rag/requirements.txt` restent inchangés.

## Index ANN

- Bibliothèque : USearch `2.26.0`.
- Structure : HNSW.
- Métrique : cosine.
- Stockage des vecteurs ANN : `f16`.
- Connectivité : 16.
- `expansion_add` : 128.
- `expansion_search` : 128.
- Clés ANN : entiers globaux reliés par SQLite à `chunk_id`, `book_id`, shard, discipline et madhhab.

Fichiers produits :

- `athar-v63c-global.usearch`
- `athar-v63c-global.meta.sqlite`
- `athar-v63c-global.ann.json`

Le manifeste contient les SHA-256 de l'index et du sidecar ainsi que le SHA du corpus V3 afin d'empêcher un mélange entre deux releases.

## Benchmark

Le workflow V6.3-C mesure deux choses distinctes :

1. Régression applicative V6.1 -> V6.3-C sur les 200 cas V6.1/V6.1 Gold.
2. Qualité technique de l'ANN en comparant ses Top-K à une recherche dense exacte sur un sous-ensemble fixe de requêtes.

Le workflow échoue si :

- une métrique de qualité surveillée régresse ;
- le Recall ANN moyen contre la recherche dense exacte descend sous 95 %.

## Human Gold pooled

Après le benchmark, un pool aveugle mélange :

- Top candidats V6.1 ;
- Top candidats ANN V6.3-C.

Les doublons sont supprimés puis l'ordre est mélangé de manière déterministe. Le reviewer ne voit ni l'origine moteur, ni le rang, ni le score. L'audit d'origine est exporté dans un artifact séparé qui ne doit pas être montré aux reviewers avant la fin de l'annotation.

## Workflows

- `.github/workflows/rag-v63c-build-ann.yml` : construit et valide l'index global.
- `.github/workflows/rag-v63c-benchmark.yml` : benchmark V6.1/V6.3-C, Recall ANN exact et pool Human Gold.

## Statut production

V6.3-C reste en shadow mode. Aucun changement de `render.yaml`, de `rag/requirements.txt` ou du serveur public n'est effectué tant que le benchmark et les qrels humains poolés ne justifient pas une promotion.
