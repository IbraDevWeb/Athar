# Athar Research V6.3-D — Human Gold aveugle

## But

V6.3-D décide si la recherche sémantique globale V6.3-C apporte réellement de meilleures preuves que V6.1.

Cette phase n'utilise pas un LLM comme juge. Les passages sont annotés humainement sans montrer :

- le moteur qui a trouvé le passage ;
- le rang du passage ;
- le score lexical ou vectoriel ;
- la catégorie du benchmark ;
- le fait qu'une question ait été conçue comme cas négatif.

Le fichier privé d'audit conserve ces informations uniquement pour l'analyse après annotation.

## Grades

- `0` : non pertinent / ne répond pas à la question ;
- `1` : pertinent mais partiel ou contextuel ;
- `2` : directement pertinent et exploitable comme preuve documentaire.

Le grade évalue le **passage par rapport à la question**, pas le prestige de l'ouvrage ni la validité d'une conclusion religieuse complète.

## 1. Récupérer le pack reviewer

Le workflow `.github/workflows/rag-v63d-review-pack.yml` produit :

- artifact public : `athar-human-gold-v63d-pooled-review` ;
- artifact privé : `athar-human-gold-v63d-origin-audit-private`.

Le reviewer ne doit utiliser que l'artifact public.

Place le CSV public dans :

```text
rag/data/human-gold-v63d-pool.csv
```

## 2. Lancer l'interface de review sous Windows / VS Code

Depuis la racine du projet Athar :

```powershell
python rag\v63d_review_app.py --pool rag\data\human-gold-v63d-pool.csv --reviewer avishka
```

Le navigateur s'ouvre sur :

```text
http://127.0.0.1:8765/
```

Chaque passage affiche la question, les métadonnées bibliographiques, le texte arabe/français et trois boutons `0 / 1 / 2`.

Raccourcis clavier : `0`, `1`, `2`.

La progression est écrite après chaque clic dans :

```text
rag/data/v63d-review.sqlite
rag/data/v63d-annotations.csv
```

Tu peux fermer le serveur avec `Ctrl+C` et reprendre plus tard avec exactement la même commande.

## 3. Plusieurs reviewers

Pour un second reviewer, utilise une base et une sortie distinctes :

```powershell
python rag\v63d_review_app.py `
  --pool rag\data\human-gold-v63d-pool.csv `
  --reviewer reviewer-2 `
  --db rag\data\v63d-review-2.sqlite `
  --output rag\data\v63d-annotations-2.csv
```

V6.3-D accepte un seul jugement par passage, mais calcule aussi l'accord inter-reviewers dès que certains passages ont été doublement annotés.

## 4. Construire les qrels humains

Avec un seul reviewer :

```powershell
python rag\v63d_qrels.py `
  --pool rag\data\human-gold-v63d-pool.csv `
  --annotations rag\data\v63d-annotations.csv `
  --output-qrels rag\data\human-qrels-v63d.json
```

Avec plusieurs reviewers, répète `--annotations` :

```powershell
python rag\v63d_qrels.py `
  --pool rag\data\human-gold-v63d-pool.csv `
  --annotations rag\data\v63d-annotations.csv `
  --annotations rag\data\v63d-annotations-2.csv `
  --output-qrels rag\data\human-qrels-v63d.json
```

Le script :

- exige que tout le pool soit annoté au moins une fois ;
- calcule l'accord exact et le kappa de Cohen pour les passages doublement annotés ;
- refuse automatiquement les désaccords non résolus ;
- produit `rag/data/v63d-disagreements.csv` lorsqu'une adjudication est nécessaire.

Après adjudication :

```powershell
python rag\v63d_qrels.py `
  --pool rag\data\human-gold-v63d-pool.csv `
  --annotations rag\data\v63d-annotations.csv `
  --annotations rag\data\v63d-annotations-2.csv `
  --adjudication rag\data\v63d-disagreements.csv `
  --output-qrels rag\data\human-qrels-v63d.json
```

## 5. Benchmark humain final

Une fois `rag/data/human-qrels-v63d.json` ajouté au dépôt, le workflow `.github/workflows/rag-v63d-human-eval.yml` se déclenche.

Il récupère l'audit privé du pack V6.3-D puis compare sur les mêmes jugements :

- V6.1 lexical ;
- ANN global seul ;
- V6.3-C fusion V6.1 + ANN.

Métriques :

- NDCG@10 ;
- Recall@10 ;
- Recall@10 des passages grade 2 ;
- Precision@10 ;
- MRR ;
- nombre de questions gagnées / perdues / ex æquo ;
- différence V6.3-C vs V6.1 avec intervalle de confiance bootstrap à 95 %.

## Règle de promotion

V6.3-C ne doit pas être promue uniquement parce que son ANN a 98,67 % de Recall technique contre la recherche dense exacte.

La promotion vers le serveur public doit attendre les qrels humains et démontrer que la fusion améliore réellement la pertinence documentaire sans dégrader l'abstention, les filtres madhhab, le routage et les citations canoniques.
