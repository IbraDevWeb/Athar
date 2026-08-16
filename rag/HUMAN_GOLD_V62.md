# Athar Research V6.2 — Gold set humain aveugle

La baseline V6.1 atteint 100/100 sur son dataset actuel. Cette réussite est utile pour la non-régression, mais elle ne suffit pas à démontrer qu'un nouveau retriever (embeddings, hybride lexical+sémantique, etc.) est réellement meilleur. La V6.2 introduit donc une évaluation séparée fondée sur des jugements humains explicites.

## Principe

1. Générer un pack de revue à partir des 200 questions V6.1 et du corpus sharded de production.
2. Mélanger l'ordre des passages de manière stable et masquer le rang, les scores, les concepts détectés et les verdicts du moteur.
3. Faire noter chaque passage par un relecteur humain :
   - `0` : non pertinent ;
   - `1` : pertinent mais partiel/contextuel ;
   - `2` : directement pertinent et exploitable comme preuve.
4. Importer le CSV annoté dans un fichier `qrels` versionné.
5. Comparer tous les futurs moteurs contre exactement les mêmes qrels avec Recall@5, Recall@10, MRR et nDCG@10.

## Générer le pack de revue

```powershell
python rag\benchmark_v61_dataset.py --output rag\data\benchmark-v61.json
python rag\v62_human_gold.py prepare `
  --dataset rag\data\benchmark-v61.json `
  --manifest rag\corpus_release_v3.json `
  --shard-dir rag\data\shards `
  --output-csv rag\data\human-gold-v62-review.csv `
  --output-json rag\data\human-gold-v62-review.json `
  --limit 10 `
  --include-negative
```

Le CSV est encodé en UTF-8 avec BOM afin d'être lisible dans Excel tout en conservant correctement l'arabe.

## Importer une revue terminée

Chaque ligne doit contenir :

- `relevance_grade` : `0`, `1` ou `2` ;
- `reviewer` : identifiant du relecteur ;
- `notes` : facultatif.

Puis :

```powershell
python rag\v62_human_gold.py import `
  --input-csv rag\data\human-gold-v62-review.csv `
  --output-qrels rag\human_gold_v62_qrels.json
```

Validation seule :

```powershell
python rag\v62_human_gold.py validate --qrels rag\human_gold_v62_qrels.json
```

## Mesurer un moteur contre le gold set humain

```powershell
python rag\v62_human_gold_benchmark.py `
  --dataset rag\data\benchmark-v61.json `
  --qrels rag\human_gold_v62_qrels.json `
  --manifest rag\corpus_release_v3.json `
  --shard-dir rag\data\shards `
  --output-json rag\data\human-gold-v62-report.json `
  --output-md rag\data\HUMAN_GOLD_V62_REPORT.md
```

## Métriques

- **Recall@5 / Recall@10** : proportion des passages jugés pertinents retrouvés dans les 5/10 premiers résultats.
- **MRR** : rang du premier passage pertinent.
- **nDCG@10** : tient compte du rang et distingue les grades `1` et `2`.
- **Abstention négative** : capacité à ne rien renvoyer sur les cas explicitement hors corpus.

## Règle pour les embeddings

Un retriever sémantique ne doit pas remplacer la V6.1 sur la seule base d'une impression qualitative. Il doit au minimum :

- ne pas dégrader l'intégrité des citations, la provenance, le routage et la pureté madhhab ;
- maintenir la baseline V6.1 de non-régression ;
- améliorer ou maintenir Recall@10/MRR/nDCG@10 sur le gold set humain V6.2 ;
- rester compatible avec les contraintes mémoire de l'hébergement.

Le gold set humain évalue le retrieval. Il ne constitue pas un pourcentage de vérité religieuse ni une validation juridique/théologique des réponses.
