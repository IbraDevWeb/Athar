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
- Connectivité : 32.
- `expansion_add` : 256.
- `expansion_search` : 1024.
- Clés ANN : entiers globaux reliés par SQLite à `chunk_id`, `book_id`, shard, discipline et madhhab.

Fichiers produits :

- `athar-v63c-global.usearch`
- `athar-v63c-global.meta.sqlite`
- `athar-v63c-global.ann.json`

Le manifeste contient les SHA-256 de l'index et du sidecar ainsi que le SHA du corpus V3 afin d'empêcher un mélange entre deux releases. Le runtime recharge explicitement `expansion_search` depuis ce manifeste afin que la profondeur de recherche utilisée après sérialisation soit reproductible.

## Benchmark

Le workflow V6.3-C mesure deux choses distinctes :

1. Régression applicative V6.1 -> V6.3-C sur les 200 cas V6.1/V6.1 Gold.
2. Qualité technique de l'ANN en comparant ses Top-K à une recherche dense exacte sur un sous-ensemble fixe de requêtes.

Le workflow échoue si :

- une métrique de qualité surveillée régresse ;
- le Recall ANN moyen contre la recherche dense exacte descend sous 95 %.

### Tuning documenté

Le premier index réel utilisait `connectivity=16`, `expansion_add=128`, `expansion_search=128`. Il a conservé 100/100 sur le benchmark applicatif et n'a introduit aucune régression, mais son Recall@10 ANN contre la recherche dense exacte n'était que de 78 %. Cette configuration a donc été refusée, sans abaisser le seuil de 95 %.

La configuration renforcée `32 / 256 / 1024` a ensuite passé le même gate avec succès :

- Recall@10 ANN moyen contre recherche dense exacte : **98,67 %** sur 30 requêtes ;
- Recall@10 minimum observé : **90 %** ;
- Top-1 identique à la recherche dense exacte : **100 %** ;
- latence ANN seule : moyenne **7,224 ms**, p95 **11,627 ms** ;
- benchmark applicatif V6.3-C : **100/100**, sans régression ;
- latence end-to-end moyenne V6.1 : **490,39 ms** ;
- latence end-to-end moyenne V6.3-C : **510,36 ms**.

Le gate a donc accepté la couche ANN technique sans diminuer son seuil de qualité.

## Human Gold pooled

Après le benchmark, un pool aveugle mélange :

- Top candidats V6.1 ;
- Top candidats ANN V6.3-C.

Les doublons sont supprimés puis l'ordre est mélangé de manière déterministe. Le reviewer ne voit ni l'origine moteur, ni le rang, ni le score. L'audit d'origine est exporté dans un artifact séparé qui ne doit pas être montré aux reviewers avant la fin de l'annotation.

Le pool final contient **3 689 lignes de review**, dont **1 795 candidats ANN-only** dans les Top-10 poolés. Ces candidats ne sont pas considérés pertinents par défaut : leur utilité doit être déterminée par annotation humaine aveugle.

Le benchmark large a observé au moins un candidat ANN-only sur 191/200 cas et 7 059 couples question/passage ANN-only avec une fenêtre ANN de 40. Ces chiffres mesurent la nouveauté documentaire candidate, pas la pertinence académique.

Le benchmark et le gate qualité sont séparés : le pool Human Gold est donc produit même si une future configuration ANN est ensuite refusée par le seuil technique.

## Workflows

- `.github/workflows/rag-v63c-build-ann.yml` : construit et valide l'index global.
- `.github/workflows/rag-v63c-benchmark.yml` : benchmark V6.1/V6.3-C, Recall ANN exact, pool Human Gold puis gate de qualité.

## Statut production

La couche ANN V6.3-C est **techniquement acceptée en shadow mode**, mais elle n'est pas encore promue en production. Aucun changement de `render.yaml`, de `rag/requirements.txt` ou du serveur public n'est effectué tant que les qrels humains poolés ne montrent pas un bénéfice sémantique réel par rapport à V6.1.
