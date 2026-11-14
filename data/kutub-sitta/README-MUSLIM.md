# Sahîh Muslim — 50 premières narrations de l’Introduction

## Délimitation essentielle

`muslim.json` présente **les narrations 1 à 50 de l’Introduction (المقدمة)**, dans l’ordre de la numérotation *dans cette section* de Sunnah.com. Il ne s’agit **pas** des 50 premières narrations du Livre de la foi (`كتاب الإيمان`), qui commence à la référence **Sahih Muslim 8a**, ni de 50 hadiths prophétiques individuellement authentifiés.

L’Introduction de l’imam Muslim inclut des avertissements sur l’authenticité et des paroles de savants/transmetteurs. Sunnah.com précise que cette introduction ne relève pas intégralement des critères de sélection des hadiths du corpus principal : https://sunnah.com/muslim/introduction

## Textes et provenance

- **Arabe** : corpus historique du dépôt `AhmedBaset/hadith-json`, `db/by_chapter/the_9_books/muslim/introduction.json` (50 entrées initiales), issu de Sunnah.com : https://github.com/AhmedBaset/hadith-json
- **Français** : édition numérique `fra-muslim`, section `0`, de `fawazahmed0/hadith-api` (version `1`), avec des références éditoriales parfois décalées : https://github.com/fawazahmed0/hadith-api
- Pour les narrations **36, 39, 46 et 49**, la correspondance d’un texte français fiable de la même variante n’a pas pu être assurée ; une **traduction de travail française**, réalisée à partir de la version anglaise disponible dans `AhmedBaset/hadith-json`, est signalée dans les fiches.
- **Référence consultable** : chaque `source_url` renvoie à la liste complète `https://sunnah.com/muslim/introduction`, car le numéro global et le numéro interne de narration diffèrent parfois. Le numéro et le texte sont conservés dans les données Athar ; aucune URL individuelle incertaine n’est fabriquée.
- Les empreintes SHA des fichiers de données numériques sont consignées dans `sourceRecords`, ainsi que la relation de concordance `frenchEditionIndex` pour les entrées concernées.

**Réserve d'édition :** les textes français et leurs correspondances ne sont **pas** certifiés ni relus par un spécialiste du hadith. L’identité du traducteur de `fra-muslim` n’est pas établie avec certitude. Le dépôt `AhmedBaset/hadith-json` ne présente pas de licence explicite ; son rôle comme source numérique est mentionné, sans présumer de droits sur des traductions modernes. Vérifier les droits et la fidélité avant toute redistribution éditoriale.

## Affichage dans Athar

- 50 narrations dans le recueil `muslim`, chapitre unique `introduction` et `bookNumber: 0`.
- Titres de lecture (`readingTitle`) **éditoriaux**, et jamais attribués à Muslim ni aux narrateurs.
- Fiches bilingues avec texte arabe, français, navigation, favoris, notes, source externe et mention de prudence.
- Aucune classification individuelle `sahîh` n’est inférée automatiquement des contenus de l’Introduction.
- Le corpus historique des 50 hadiths de Bukhârî et le corpus thématique préexistant sont inchangés.
