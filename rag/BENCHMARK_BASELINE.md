# Baseline Athar Research V6

Baseline déterministe exécutée le **16 août 2026** sur le corpus sharded de production déclaré par `rag/corpus_release_v3.json`.

- Commit benchmark : `743b9a490801737538f9b1f53ff6614e8f9e6bd3`
- GitHub Actions run : `31939950903`
- Dataset : V6.0, 30 cas (28 hard, 2 soft)
- Runtime : 11 shards
- Top K : 10
- Gemini Query Intelligence : désactivé

## Résultats

| Métrique | Baseline |
|---|---:|
| Score composite documentaire | **93,67 / 100** |
| Evidence rate | **100 %** |
| Abstention sur cas négatifs | **66,7 %** |
| Evidence-group recall@10 (proxy lexical) | **100 %** |
| Evidence MRR (proxy lexical) | **1,000** |
| Routage explicite d'ouvrage | **66,7 %** |
| Rappel des concepts | **100 %** |
| Intégrité des citations | **100 %** |
| Provenance URL | **100 %** |
| Erreurs runtime | **0 %** |
| Latence moyenne | **362,65 ms** |
| Latence p50 | **389,61 ms** |
| Latence p95 | **605,63 ms** |
| Latence max | **781,37 ms** |

## Anomalies révélées

Trois cas sont à examiner :

1. `route-tabari-fatiha` : les bons termes de preuve sont retrouvés, mais le routage d'ouvrage exposé n'identifie pas al-Ṭabarī.
2. `route-ibn-kathir-kursi` : les bons termes de preuve sont retrouvés, mais le routage d'ouvrage exposé n'identifie pas Ibn Kathīr.
3. `negative-fabricated-book` : une requête portant sur un faux ouvrage et des moteurs électriques retourne encore un passage ; le moteur doit mieux s'abstenir lorsque seul un terme générique ou un nom d'auteur correspond.

Les deux ouvrages de tafsīr attendus sont bien présents dans la curation du corpus ; ces deux échecs ne sont donc pas justifiés par une absence documentaire.

## Interprétation

Le score **93,67 / 100 n'est pas un score de vérité religieuse**. Il s'agit uniquement d'une baseline technique permettant de comparer le retrieval, le routage, l'abstention, la provenance et les citations sur le même corpus et le même dataset.

Le recall@10 actuel reste un proxy lexical. Un Recall@K académique exigera des `gold_chunk_ids` annotés manuellement pour chaque question.
