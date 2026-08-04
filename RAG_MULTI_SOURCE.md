# Architecture multi-source de la Bibliothèque Athar

Cette couche généralise le pipeline Kutub sans prétendre que les autres catalogues sont déjà collectés. Elle fournit un registre explicite, un importeur universel et une provenance stable pour chaque passage.

## Ce qui est maintenant disponible

- registre versionné dans `rag/sources.json` ;
- sources actives ou préparées sans les confondre ;
- import de fichiers JSON, JSONL, TXT et Markdown ;
- découpage déterministe en passages ;
- déduplication au niveau du document ;
- identifiants stables par source et document ;
- métadonnées académiques : édition, version, volume, livre, chapitre, hadith, pages ;
- historique des imports par source ;
- API `/api/rag/v2/sources` ;
- objet `citation` structuré ajouté aux sources retournées par le moteur V2.

## Importer un dossier local

```powershell
.\.venv-rag\Scripts\python.exe rag\ingest_source.py ingest `
  --source local `
  --input .\mes-documents
```

État du registre :

```powershell
.\.venv-rag\Scripts\python.exe rag\ingest_source.py status
```

## Format JSONL conseillé

Une ligne correspond à un document :

```json
{"id":"muwatta-yahya-8-31","title":"Al-Muwaṭṭaʾ","author":"Mālik ibn Anas","discipline":"Hadith","madhhab":"Mālikite","edition":"Dār al-Gharb","version":"Riwayat Yaḥyā","volume":1,"source_url":"https://exemple.org/document","primary_source":true,"passages":[{"chapter":"Kitāb al-Ṣalāt","book_number":8,"chapter_number":31,"hadith_number":45,"printed_page":287,"text_ar":"النص العربي","text_fr":"Traduction contrôlée","verification_status":"human_verified"}]}
```

Les champs inconnus peuvent être omis. Athar ne les invente pas : ils restent absents de la citation.

## Sources préparées mais désactivées

Shamela, Waqfeya et Internet Archive apparaissent dans le registre avec `enabled: false`. Cela signifie uniquement que l'architecture est prête à recevoir leurs adaptateurs. Aucun contournement d'accès, aucune extraction PDF automatique et aucune hypothèse de licence ne sont activés.

## Prochaine étape recommandée

Construire un adaptateur à la fois, avec un jeu de tests et un échantillon juridiquement vérifié :

1. import de PDF possédés ou librement diffusables ;
2. extraction des pages imprimées et de la table des matières ;
3. résolution des éditions et variantes ;
4. indexation hybride lexicale + vectorielle ;
5. interface de validation humaine des citations.
