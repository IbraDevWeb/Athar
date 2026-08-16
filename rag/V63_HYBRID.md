# Athar Research V6.3 — Hybrid Semantic Retrieval

## Statut

**Expérimental / shadow only.** La V6.3 ne remplace pas la V6.1 en production et ne modifie ni `render.yaml` ni `rag/requirements.txt`.

La V6.3 est divisée en étapes mesurables :

- **V6.3-A** : reranking sémantique des candidats V6.1, embeddings des passages calculés à la requête ;
- **V6.3-B** : mêmes garde-fous et même fusion, mais embeddings des passages pré-calculés par shard ;
- une récupération sémantique globale/ANN ne sera ajoutée qu'après validation de ce socle et comparaison sur le Human Gold V6.2.

## Architecture V6.3-A

```text
Question
   |
   v
V6.1 lexical + concepts + routage
   |
   +-- abstention
   +-- filtre madhhab strict
   +-- discipline / ouvrage
   |
   v
Top 20 candidats autorisés
   |
   +-------------------+
   |                   |
   v                   v
rang lexical       embeddings multilingues
   |                   |
   |              rang sémantique
   |                   |
   +---------+---------+
             |
             v
       RRF 1:1 (k=60)
             |
      top-1 lexical ancré
             |
             v
        Top K final
             |
             v
 citations originales inchangées
```

## Modèle expérimental

`sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2`, exécuté via FastEmbed/ONNX.

FastEmbed est épinglé à `0.8.0` dans `rag/requirements-v63.txt`. Le runner signale que cette version utilise le comportement de pooling actuellement déclaré pour ce modèle ; l'épinglage évite de changer silencieusement de comportement entre deux benchmarks.

Le modèle n'est **pas** ajouté à `rag/requirements.txt` et n'est donc pas chargé par le service Render actuel.

## Garde-fous

V6.3 n'a pas le droit de :

- fabriquer une source absente du corpus ;
- réintroduire un passage rejeté par le filtre madhhab ;
- contourner l'abstention V6.1 ;
- modifier le livre routé par le catalogue ;
- modifier le texte original ou l'URL de provenance ;
- générer une réponse avec les embeddings.

Le top-1 lexical reste ancré. Les embeddings réordonnent uniquement la suite des candidats admis.

## Résultat V6.3-A

Workflow : `Athar RAG V6.3 hybrid semantic benchmark`

Run validé : `31943645189`.

Sur les 200 cas V6.1 :

| Mesure | V6.1 | V6.3-A |
|---|---:|---:|
| Score composite | 100 / 100 | **100 / 100** |
| Evidence | 100 % | **100 %** |
| Abstention | 100 % | **100 %** |
| Recall lexical@10 | 100 % | **100 %** |
| MRR lexical | 1,000 | **1,000** |
| Gold chunk Recall@10 | 100 % | **100 %** |
| Gold chunk MRR | 1,000 | **1,000** |
| Gold book Hit@10 | 100 % | **100 %** |
| Pureté madhhab@10 | 100 % | **100 %** |
| Citations | 100 % | **100 %** |
| Provenance | 100 % | **100 %** |

Le reranking a réellement modifié **190 classements sur 200 (95 %)**, sans modifier le top-1 et sans améliorer/dégrader le rang des 50 gold chunks existants.

Le coût de V6.3-A est cependant trop élevé pour justifier une activation production telle quelle :

- V6.1 : moyenne **471,56 ms**, p95 **694,53 ms** ;
- V6.3-A : moyenne **1 191,72 ms**, p95 **1 451,03 ms**.

La cause évitable est l'encodage répété des passages candidats à chaque question.

## V6.3-B — embeddings pré-calculés

`rag/v63_semantic_index.py` construit un index immuable à côté de chaque SQLite de corpus :

```text
athar_openiti-00N.sqlite
        |
        v
passages triés par chunk_id
        |
        v
embeddings normalisés
        |
        +--> openiti-00N.vectors.f16.npy
        +--> openiti-00N.meta.sqlite
        +--> openiti-00N.semantic.json
```

Le fichier NumPy est mémoire-mappable et stocké en `float16`. Le sidecar SQLite associe chaque `chunk_id` à sa position et conserve `book_id`, discipline et madhhab. Le SQLite du corpus n'est jamais modifié.

Avec **574 461 passages × 384 dimensions × 2 octets**, la matrice vectorielle complète représente environ **441 186 048 octets (420,75 MiB)**, hors sidecars et petits en-têtes.

Le builder est :

- batché ;
- reprenable avec `--resume` ;
- lié au SHA-256 exact du shard source ;
- lié au nom du modèle ;
- validé sur la dimension, les valeurs finies, le nombre de lignes et les SHA des fichiers finaux.

`SemanticIndexCollection` charge les index paresseusement et permet au reranker de récupérer directement les vecteurs des candidats. Quand tous les candidats sont présents, **seule la question est encodée à la requête** ; aucun `passage_embed` n'est exécuté.

## Smoke test V6.3-B réel

Workflow : `Athar RAG V6.3-B precomputed semantic smoke`.

Premier run validé : `31944116606`.

Le test utilise le vrai shard production `openiti-002` et indexe les 512 premiers passages :

- **512 / 512** passages ;
- dimension : **384** ;
- dtype : **float16** ;
- matrice : **393 344 octets** ;
- équivalent float32 brut : **786 432 octets** ;
- sidecar SQLite : **147 456 octets** ;
- validation SHA source + vecteurs + sidecar : réussie.

Le même workflow exécute aussi les tests de lookup, recherche dense exacte, reprise, routage vers le bon shard et interdiction de réencoder les passages lorsque le cache est complet.

## Construction complète

`.github/workflows/rag-v63-build-semantic-index.yml` prépare une construction parallèle des **11 shards**. Chaque job :

1. télécharge un seul shard V3 et vérifie son SHA ;
2. calcule tous ses embeddings ;
3. produit la matrice float16 + sidecar + manifeste ;
4. refuse un index partiel ;
5. publie son artifact.

Le job final rassemble les 11 artifacts et `rag/v63_semantic_release.py` refuse la release si un shard manque, si son nombre de passages diffère ou si son SHA source n'est pas exactement celui de `rag/corpus_release_v3.json`.

## Suite après la V6.3-B

Une fois la release sémantique complète construite, le benchmark suivant devra comparer :

1. V6.1 lexical ;
2. V6.3-A online ;
3. V6.3-B pré-calculée ;

sur les mêmes 200 cas, avec les mêmes classements attendus et une mesure séparée de latence. V6.3-B doit produire le même ordre sémantique que V6.3-A à l'erreur float16 près, tout en supprimant l'encodage des passages au moment de la requête.

La récupération sémantique **globale** (ANN) viendra ensuite. Elle devra être évaluée sur un pool aveugle V6.2 contenant des candidats des deux moteurs. Sans qrels humains indépendants, une hausse de rappel global ne sera pas présentée comme un gain académique démontré.
