# Baseline Athar Research V6

Benchmark déterministe exécuté le **16 août 2026** sur le corpus sharded de production déclaré par `rag/corpus_release_v3.json`.

- Dataset : V6.0, 30 cas (28 hard, 2 soft)
- Runtime : 11 shards
- Top K : 10
- Gemini Query Intelligence : désactivé

## Comparatif

| Métrique | Baseline initiale | Après correctifs |
|---|---:|---:|
| Score composite documentaire | **93,67 / 100** | **100 / 100** |
| Evidence rate | 100 % | **100 %** |
| Abstention sur cas négatifs | 66,7 % | **100 %** |
| Evidence-group recall@10 (proxy lexical) | 100 % | **100 %** |
| Evidence MRR (proxy lexical) | 1,000 | **1,000** |
| Routage explicite d'ouvrage | 66,7 % | **100 %** |
| Rappel des concepts | 100 % | **100 %** |
| Intégrité des citations | 100 % | **100 %** |
| Provenance URL | 100 % | **100 %** |
| Erreurs runtime | 0 % | **0 %** |
| Latence moyenne | 362,65 ms | **359,52 ms** |
| Latence p50 | 389,61 ms | **387,67 ms** |
| Latence p95 | 605,63 ms | **607,76 ms** |
| Latence max | 781,37 ms | **772,82 ms** |

## Runs

### Baseline initiale

- Commit benchmark : `743b9a490801737538f9b1f53ff6614e8f9e6bd3`
- GitHub Actions run : `31939950903`
- Score : **93,67 / 100**

### Après correctifs

- Correctif moteur : `bb07dcff736b0cee02cff534d3e962dc4abe0f97`
- Commit de validation / workflow : `c909c840255095e4f075536423cf7337e7bbf941`
- GitHub Actions run : `31940338752`
- Score : **100 / 100**
- Cas signalés : **0**

## Correctifs appliqués

1. **Routage canonique des tafsīr** : les requêtes explicites vers al-Ṭabarī et Ibn Kathīr sont résolues au niveau du catalogue global vers les IDs curatés `openiti-tabari-tafsir` et `openiti-ibn-kathir-tafsir`.
2. **Cohérence du routage sharded** : lorsqu'un ouvrage est routé globalement, son titre canonique est injecté dans la requête interne du shard afin que le moteur local cible le même ouvrage.
3. **Suppression du faux routage exposé** : un routage décidé seulement dans un shard partiel n'est plus présenté comme un routage global.
4. **Garde d'abstention raw-only** : lorsqu'aucun concept ni ouvrage explicite n'est identifié, une requête multi-termes doit désormais avoir au moins deux termes bruts distincts dans le même passage pour être retenue comme preuve.
5. **CI benchmark** : les modifications de `v5_engine.py`, `v5_lowmem.py` et `v5_sharded.py` déclenchent maintenant automatiquement le benchmark V6.

Les trois anomalies initiales (`route-tabari-fatiha`, `route-ibn-kathir-kursi`, `negative-fabricated-book`) ne sont plus signalées dans le run `31940338752`.

## Interprétation

Le score **100 / 100 n'est pas un score de vérité religieuse ni de fiabilité absolue**. Il signifie uniquement que la version testée satisfait tous les critères du dataset V6 actuel sur le corpus courant : retrieval lexical attendu, routage, abstention, concepts, citations, provenance et absence d'erreur runtime.

Le recall@10 actuel reste un **proxy lexical**. Un Recall@K académique exigera des `gold_chunk_ids` annotés manuellement pour chaque question, idéalement avec une validation humaine des passages jugés réellement pertinents.
