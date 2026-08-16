# Baseline Athar Research V6.1

Benchmark déterministe étendu exécuté le **16 août 2026** sur le corpus sharded de production.

- GitHub Actions run final : `31941093969`
- Commit du run : `79ee67858ff56ce398629ecd7316323e822d2369`
- Dataset : **200 cas**
- Runtime : **11 shards**
- Top K : **10**
- Gemini Query Intelligence : **désactivé** pour garder une baseline déterministe
- Gold chunks : **50 cas relus sémantiquement** (`assistant_semantic_review`)
- Gold books : **20 cas de routage bibliographique exact**

## Résultats

| Métrique | V6.1 |
|---|---:|
| Score composite technique | **95,57 / 100** |
| Evidence rate | **97,89 %** |
| Abstention sur cas négatifs | **90 %** |
| Recall lexical@10 | **94,74 %** |
| MRR lexical | **0,9075** |
| Routage textuel d'ouvrage | **100 %** |
| Rappel des concepts | **94,80 %** |
| Intégrité des citations | **100 %** |
| Provenance URL | **100 %** |
| Erreurs runtime | **0 %** |
| Gold chunk Recall@10 | **100 %** (50 cas) |
| Gold chunk MRR | **1,000** (50 cas) |
| Gold book Hit@10 | **90 %** (20 cas) |
| Gold book MRR | **0,900** |
| Pureté madhhab@10 | **70 %** (10 cas) |
| Latence moyenne | **527,63 ms** |
| Latence p50 | **492,70 ms** |
| Latence p95 | **1 515,38 ms** |
| Latence max | **1 732,14 ms** |

## Répartition du dataset

| Catégorie | Cas | Cas signalés |
|---|---:|---:|
| Concepts français | 123 | 5 |
| Arabe | 20 | 5 |
| FR / translittération | 17 | 0 |
| Routage d'ouvrages | 20 | 2 |
| Filtres madhhab | 10 | 8 |
| Abstention difficile | 10 | 1 |

## Défauts révélés

### 1. Compréhension déterministe de l'arabe insuffisante

Cinq formulations arabes (`ar-fatiha`, `ar-qunut`, `ar-sujud`, `ar-ghusl`, `ar-marriage`) remontent des passages sans les preuves lexicales attendues. Le moteur déterministe ne dispose pas encore de déclencheurs conceptuels arabes comparables aux déclencheurs français/translittérés.

### 2. Synonymes français/translittérés manquants

Cinq formulations françaises ne sont pas correctement comprises :

- `Fatihat al-Kitab`
- `takbirat`
- `salam qui termine la salat`
- `intérêt usuraire`
- `verset du Trône`

Ces formulations sont valides mais absentes ou insuffisamment couvertes dans l'ontologie déterministe.

### 3. Routage al-Nasāʾī ambigu

Les deux requêtes demandant explicitement **Sunan al-Nasāʾī** sont routées vers un autre ouvrage de l'auteur (`Kitāb Faḍā'il al-ṣaḥāba`). Le routage textuel paraît correct car le nom `Nasai` est présent, mais le nouveau `gold_book_ids` révèle que l'ouvrage exact est faux.

### 4. Filtre madhhab trop souple

La pureté moyenne des dix premiers résultats n'est que de **70 %** sur les dix cas filtrés par école. Huit cas sur dix contiennent au moins une source dont la métadonnée de madhhab ne correspond pas à l'école demandée. Le moteur applique actuellement surtout une pénalité de score plutôt qu'une contrainte stricte.

### 5. Abstention encore contournable avec un ouvrage réel

La requête `Sahih al-Bukhari + protocole Ethernet 100 gigabits` retourne encore des passages de Bukhārī. Le routage vers un vrai ouvrage permet à un terme brut accidentel (par exemple un nombre) de produire des faux positifs alors que le sujet demandé est hors corpus.

## Gold chunks

Les 50 `gold_chunk_ids` de cette baseline ont été ajoutés après lecture sémantique des extraits du premier run V6.1. Ils servent à détecter une régression future du retrieval exact.

Ils ne constituent **pas** encore un gold set académique indépendant ou exhaustif : le validateur est `assistant_semantic_review` et les candidats initiaux provenaient du retriever actuel. Une validation externe par un lecteur humain compétent et l'annotation de plusieurs passages pertinents par question seront nécessaires avant de présenter ces chiffres comme une évaluation académique.

## Interprétation

Le score **95,57 / 100** est un score technique sur ce dataset, pas un pourcentage de vérité religieuse. La V6.1 est volontairement plus difficile que la baseline V6 de 30 cas et doit désormais être privilégiée pour les comparaisons de retrieval, routage, abstention et filtrage par madhhab.
