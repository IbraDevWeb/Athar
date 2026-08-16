# Baseline Athar Research V6.1

Benchmark déterministe étendu exécuté le **16 août 2026** sur le corpus sharded de production.

- Dataset : **200 cas**
- Runtime : **11 shards**
- Top K : **10**
- Gemini Query Intelligence : **désactivé** pour garder une baseline déterministe
- Gold chunks : **50 cas relus sémantiquement** (`assistant_semantic_review`)
- Gold books : **20 cas de routage bibliographique exact**
- Run corrigé : `31941869907`
- Commit du run corrigé : `6de273b975ce0e9a41fbbf2fbca4291eec4374d5`

## Comparatif

| Métrique | Baseline initiale | Après correctifs |
|---|---:|---:|
| Score composite technique | **95,57 / 100** | **100 / 100** |
| Evidence rate | 97,89 % | **100 %** |
| Abstention sur cas négatifs | 90 % | **100 %** |
| Recall lexical@10 | 94,74 % | **100 %** |
| MRR lexical | 0,9075 | **1,000** |
| Routage textuel d'ouvrage | 100 % | **100 %** |
| Rappel des concepts | 94,80 % | **100 %** |
| Intégrité des citations | 100 % | **100 %** |
| Provenance URL | 100 % | **100 %** |
| Erreurs runtime | 0 % | **0 %** |
| Gold chunk Recall@10 | 100 % | **100 %** (50 cas) |
| Gold chunk MRR | 1,000 | **1,000** |
| Gold book Hit@10 | 90 % | **100 %** (20 cas) |
| Gold book MRR | 0,900 | **1,000** |
| Pureté madhhab@10 | 70 % | **100 %** (10 cas) |
| Latence moyenne | 527,63 ms | **481,14 ms** |
| Latence p50 | 492,70 ms | **497,44 ms** |
| Latence p95 | 1 515,38 ms | **700,33 ms** |
| Latence max | 1 732,14 ms | **1 797,91 ms** |

## Répartition finale

| Catégorie | Cas | Cas signalés après correctifs |
|---|---:|---:|
| Concepts français | 123 | **0** |
| Arabe | 20 | **0** |
| FR / translittération | 17 | **0** |
| Routage d'ouvrages | 20 | **0** |
| Filtres madhhab | 10 | **0** |
| Abstention difficile | 10 | **0** |

## Correctifs appliqués

### 1. Compréhension déterministe de l'arabe

Athar enrichit maintenant la détection conceptuelle à partir du vocabulaire arabe déjà curaté dans l'ontologie de retrieval. La ponctuation Unicode arabe, notamment `؟`, est traitée comme une frontière lexicale avant la détection. Les cas `ar-fatiha`, `ar-qunut`, `ar-sujud`, `ar-ghusl` et `ar-marriage` passent désormais.

### 2. Synonymes et formulations naturelles

Les formulations révélées par le benchmark ont été ajoutées à la compréhension déterministe, notamment `Fatihat al-Kitab`, `takbirat`, `salam qui termine la salat`, `intérêt usuraire`, `verset du Trône`, `établissement de la prière`, `temps de la salat`, `horaires des prières` et `jam des salat`. Les sous-concepts qui impliquent nécessairement le contexte de la prière peuvent également déclarer ce contexte parent sans génération IA.

### 3. Routage exact de Sunan al-Nasāʾī

Les alias explicites de **Sunan al-Nasāʾī** sont liés au livre curaté `openiti-sunan-nasai`. Le moteur ne confond plus le livre demandé avec un autre ouvrage du même auteur. Le Gold book Hit@10 passe de 90 % à 100 %.

### 4. Filtrage strict du madhhab

Lorsqu'une école est explicitement demandée, le runtime sharded conserve uniquement les sources dont la métadonnée de madhhab correspond effectivement au filtre. Les métadonnées vides ou incompatibles ne sont plus seulement pénalisées : elles sont écartées du résultat filtré. La pureté madhhab@10 passe de 70 % à 100 % sur les dix cas dédiés.

### 5. Abstention renforcée avec ouvrage réel

Une requête qui cite un vrai ouvrage mais ajoute plusieurs termes de sujet non reconnus doit désormais présenter au moins deux correspondances brutes distinctes dans le même passage. Le cas `Sahih al-Bukhari + protocole Ethernet 100 gigabits` est donc refusé au lieu de produire une preuve accidentelle, tout en conservant les recherches courtes légitimes dans un ouvrage ciblé.

### 6. Tests de non-régression

`rag/v61_reliability_tests.py` couvre les synonymes, les requêtes arabes, le routage al-Nasāʾī, le filtrage madhhab et l'abstention renforcée. Ces tests sont exécutés avant le benchmark complet dans GitHub Actions.

## Gold chunks

Les 50 `gold_chunk_ids` continuent d'obtenir **100 % de Recall@10 et un MRR de 1,000** après les correctifs. Aucun gain sur les nouveaux cas n'a donc été obtenu au prix d'une régression sur ce noyau validé.

Ils ne constituent toujours **pas** un gold set académique indépendant ou exhaustif : le validateur est `assistant_semantic_review` et les candidats initiaux provenaient du retriever Athar. Une validation externe par des lecteurs humains compétents et l'annotation de plusieurs passages pertinents par question restent nécessaires avant de présenter ces chiffres comme une évaluation académique indépendante.

## Interprétation

Le score **100 / 100** signifie uniquement que la version testée satisfait tous les critères du dataset V6.1 actuel sur le corpus courant. Il ne s'agit ni d'un pourcentage de vérité religieuse, ni d'une garantie qu'une réponse est juridiquement ou théologiquement correcte. Toute évolution du corpus ou du moteur doit continuer à être évaluée sur ce benchmark et, à terme, sur un gold set humain indépendant plus large.
