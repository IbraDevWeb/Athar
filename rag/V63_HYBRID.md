# Athar Research V6.3 — Hybrid Semantic Retrieval

## Statut

**Expérimental / shadow only.** La V6.3 ne remplace pas la V6.1 en production.

La première étape, **V6.3-A**, ajoute un signal sémantique multilingue uniquement après le retrieval V6.1. Le moteur stable continue donc à décider quels passages sont admissibles.

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

Le modèle n'est **pas** ajouté à `rag/requirements.txt` et n'est donc pas chargé par le service Render actuel. Les dépendances expérimentales sont isolées dans `rag/requirements-v63.txt`.

## Garde-fous

V6.3-A n'a pas le droit de :

- fabriquer une source absente du corpus ;
- réintroduire un passage rejeté par le filtre madhhab ;
- contourner l'abstention V6.1 ;
- modifier le livre routé par le catalogue ;
- modifier le texte original ou l'URL de provenance ;
- générer une réponse avec les embeddings.

Le top-1 lexical est conservé pendant V6.3-A. Les embeddings réordonnent uniquement la suite des candidats admis.

## Pourquoi commencer par un reranking et non un index vectoriel global

Le corpus courant contient plus d'un demi-million de passages. Construire immédiatement des embeddings pour tout le corpus ajouterait un coût important de génération, stockage, mémoire et recherche ANN avant même de savoir si le signal sémantique apporte une amélioration utile sur les textes classiques arabes/français d'Athar.

V6.3-A répond d'abord à une question plus simple : **un embedding multilingue améliore-t-il l'ordre des passages déjà récupérés sans casser les garanties V6.1 ?**

## Benchmark

`rag/v63_benchmark.py` exécute côte à côte :

1. V6.1 sharded ;
2. V6.3-A hybride ;

sur exactement le même dataset V6.1 de 200 cas et les 50 gold chunks existants.

Le workflow `.github/workflows/rag-v63-hybrid.yml` échoue automatiquement si V6.3-A régresse sur une métrique de qualité surveillée : evidence, abstention, recall lexical, MRR, concepts, routage, citations, provenance, gold chunks, gold books ou pureté madhhab.

## Étape V6.3-B

Si V6.3-A est stable, la suite sera un **index vectoriel global ANN**, construit hors du chemin Render de production :

```text
V6.1 candidates  -----+
                      +--> fusion --> reranking --> garde-fous --> citations
ANN semantic candidates+
```

La V6.3-B devra être comparée sur le Human Gold V6.2. Sans qrels humains indépendants, une amélioration de rappel sémantique global ne pourra pas être présentée comme un gain académique démontré.
