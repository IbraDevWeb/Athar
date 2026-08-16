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

Le workflow `.github/workflows/rag-v63d-review-pack.yml` produit trois artifacts :

- `athar-human-gold-v63d-pooled-review` : pool complet public ;
- `athar-human-gold-v63d-review-batches` : lots équilibrés publics ;
- `athar-human-gold-v63d-origin-audit-private` : audit privé à ne pas montrer aux reviewers.

Le reviewer ne doit utiliser que les artifacts publics.

Le pool validé contient **200 questions et 3 689 passages**. La génération de lots répartit les 200 questions en **8 lots primaires de 25 questions**, sans couper une question entre deux lots. Sur le pool courant, chaque lot contient entre **459 et 463 passages**.

Un fichier `v63d-review-calibration-double.csv` contient **20 questions / 355 passages** sélectionnés de façon déterministe. Il est optionnel et sert à une seconde annotation indépendante afin de mesurer l'accord inter-reviewers.

## 2. Lancer l'interface de review sous Windows / VS Code

Décompresse l'artifact `athar-human-gold-v63d-review-batches` dans `rag/data/v63d-review-batches/`.

Le moyen le plus simple pour commencer le lot 1 est :

```powershell
.\rag\start_v63d_review.ps1 -Batch 1 -Reviewer avishka
```

Le script choisit automatiquement :

- `rag/data/v63d-review-batches/v63d-review-batch-01.csv` ;
- `rag/data/v63d-review-01.sqlite` pour la reprise ;
- `rag/data/v63d-annotations-01.csv` pour l'export.

Pour le lot suivant :

```powershell
.\rag\start_v63d_review.ps1 -Batch 2 -Reviewer avishka
```

La commande Python complète reste disponible si besoin :

```powershell
python rag\v63d_review_app.py `
  --pool rag\data\v63d-review-batches\v63d-review-batch-01.csv `
  --reviewer avishka `
  --db rag\data\v63d-review-01.sqlite `
  --output rag\data\v63d-annotations-01.csv
```

Le navigateur s'ouvre sur `http://127.0.0.1:8765/`.

Chaque passage affiche la question, les métadonnées bibliographiques, le texte arabe/français et trois boutons `0 / 1 / 2`. Les mêmes chiffres servent de raccourcis clavier.

La progression est écrite après chaque clic. Tu peux fermer le serveur avec `Ctrl+C` et reprendre plus tard avec exactement la même commande.

## 3. Répartir le travail entre plusieurs reviewers

Chaque lot primaire est indépendant. On peut donc confier par exemple :

- reviewer A : lots 01 à 04 ;
- reviewer B : lots 05 à 08.

Pour mesurer l'accord inter-reviewers, un second reviewer peut aussi annoter le lot de calibration :

```powershell
python rag\v63d_review_app.py `
  --pool rag\data\v63d-review-batches\v63d-review-calibration-double.csv `
  --reviewer reviewer-2 `
  --db rag\data\v63d-review-calibration.sqlite `
  --output rag\data\v63d-annotations-calibration.csv
```

Le découpage est déterministe et préserve l'aveuglement : aucune origine moteur, rang, score, catégorie ou indication de cas négatif n'est ajoutée aux lots.

## 4. Construire les qrels humains

`v63d_qrels.py` accepte plusieurs fichiers d'annotations. Il n'est donc pas nécessaire de concaténer manuellement les huit CSV : répète simplement `--annotations` pour tous les lots terminés.

```powershell
python rag\v63d_qrels.py `
  --pool rag\data\human-gold-v63d-pool.csv `
  --annotations rag\data\v63d-annotations-01.csv `
  --annotations rag\data\v63d-annotations-02.csv `
  --annotations rag\data\v63d-annotations-03.csv `
  --annotations rag\data\v63d-annotations-04.csv `
  --annotations rag\data\v63d-annotations-05.csv `
  --annotations rag\data\v63d-annotations-06.csv `
  --annotations rag\data\v63d-annotations-07.csv `
  --annotations rag\data\v63d-annotations-08.csv `
  --annotations rag\data\v63d-annotations-calibration.csv `
  --output-qrels rag\data\human-qrels-v63d.json
```

Le script :

- exige que tout le pool primaire soit annoté au moins une fois ;
- accepte les jugements supplémentaires du lot de calibration ;
- calcule l'accord exact et le kappa de Cohen pour les passages doublement annotés ;
- refuse automatiquement les désaccords non résolus ;
- produit `rag/data/v63d-disagreements.csv` lorsqu'une adjudication est nécessaire.

Après adjudication, relance avec `--adjudication rag/data/v63d-disagreements.csv`.

## 5. Benchmark humain final

Une fois `rag/data/human-qrels-v63d.json` ajouté au dépôt, le workflow `.github/workflows/rag-v63d-human-eval.yml` se déclenche.

Il récupère l'audit privé du pack V6.3-D puis compare sur les mêmes jugements :

- V6.1 lexical ;
- ANN global seul ;
- V6.3-C fusion V6.1 + ANN.

Les métriques de classement sont calculées **uniquement sur les questions pour lesquelles le review humain a trouvé au moins un passage pertinent** :

- NDCG@10 ;
- Recall@10 ;
- Recall@10 des passages grade 2 ;
- Precision@10 ;
- MRR ;
- nombre de questions gagnées / perdues / ex æquo ;
- différence V6.3-C vs V6.1 avec intervalle de confiance bootstrap à 95 %.

Les questions sans passage pertinent dans le pool sont analysées séparément. Les cas négatifs conçus dans le benchmark ne sont révélés qu'après la fin du review ; lorsqu'ils sont confirmés par les jugements humains, le benchmark mesure séparément le taux d'abstention de V6.1 et de V6.3-C fused. Cela évite de confondre qualité de ranking et qualité d'abstention.

## Règle de promotion

V6.3-C ne doit pas être promue uniquement parce que son ANN a 98,67 % de Recall technique contre la recherche dense exacte.

La promotion vers le serveur public doit attendre les qrels humains et démontrer que la fusion améliore réellement la pertinence documentaire sans dégrader l'abstention, les filtres madhhab, le routage et les citations canoniques.
