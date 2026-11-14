# Sahîh Muslim — références 1 à 50

## Périmètre et numérotation

Le recueil `data/kutub-sitta/muslim.json` couvre **les 50 premières références usuelles**, telles qu'identifiées par Sunnah.com :

- **1 à 7** : `Introduction / المقدمة`, correspondant aux narrations internes **1, 2, 3, 4, 6, 14 et 15** sur Sunnah.com. L’Introduction contient aussi des propos de savants et transmetteurs qui ne sont pas tous considérés comme hadiths authentifiés.
- **8 à 50** : `Livre de la foi / كتاب الإيمان`. Pour chaque numéro avec plusieurs versions ou chaînes (`8 a`, `8 b`, etc.), **seule la première variante** est importée. Les variantes restantes n'ont pas été ajoutées dans cette tranche.

La numérotation interne de l'API (`hadithnumber`, p. ex. `93` pour `8.01`) est conservée dans `editionHadithnumber` et `editionArabicNumber`, distincts du numéro de référence de Sunnah.com.

## Provenance des textes

- Introduction 1–7, arabe : [AhmedBaset/hadith-json](https://github.com/AhmedBaset/hadith-json/blob/main/db/by_chapter/the_9_books/muslim/introduction.json).
- Introduction 1–7, français : [hadith-api, édition fra-muslim, section 0](https://github.com/fawazahmed0/hadith-api/blob/1/editions/fra-muslim/sections/0.json).
- Livre de la foi, arabe : [hadith-api, ara-muslim, section 1](https://github.com/fawazahmed0/hadith-api/blob/1/editions/ara-muslim/sections/1.json).
- Livre de la foi, français : [hadith-api, fra-muslim, section 1](https://github.com/fawazahmed0/hadith-api/blob/1/editions/fra-muslim/sections/1.json).
- Vérification de la numérotation et références individuelles : [Sunnah.com / Muslim](https://sunnah.com/muslim), par exemple `https://sunnah.com/muslim:1`, `https://sunnah.com/muslim:8`, `https://sunnah.com/muslim:50`.

**Réserve éditoriale :** l'identité du traducteur français n'est pas établie et les textes n'ont pas fait l'objet d'une révision par un spécialiste. La présence dans l'Introduction ne permet pas d'attribuer automatiquement à toutes ses narrations le statut de hadith sahîh. Les titres de lecture Athar sont éditoriaux et distincts du texte transmis ; pour la Foi, ils restent volontairement neutres afin d'éviter de fausses attributions.

## Présentation dans Athar

Chaque notice comprend le texte arabe, la traduction française numérique, la référence du livre, un lien individuel vers Sunnah.com, et les avertissements de traduction. L'affichage reprend le catalogue et le lecteur bilingue immersif d'al-Bukhârî, avec recherche, favoris et notes personnelles.

Les corpus des 50 hadiths al-Bukhârî et des 50 hadiths thématiques déjà présents restent inchangés.
