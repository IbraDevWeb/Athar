# Sahîh al-Bukhârî — import initial n° 1 à 50

## Périmètre

Ce fichier importe les **50 premiers hadiths de la numérotation usuelle** de Sahîh al-Bukhârî, et non les 50 hadiths thématiques du catalogue Athar.

- **1 à 7** : Livre 1, commencement de la Révélation (كتاب بدء الوحي).
- **8 à 50** : Livre 2, la Foi (كتاب الإيمان).
- **51 et suivants** : non encore importés.
- Les cinq autres recueils des Kutub as-Sitta restent vides.

## Origine des textes

Le fichier `bukhari.json` reprend les textes arabes et les versions françaises publiés par **fawazahmed0/hadith-api, version 1**, sans leur inventer de résumé, de titre doctrinal, d'explication, ni de chaîne isolée.

- Arabe : `editions/ara-bukhari/sections/1.json` et `sections/2.json`.
- Français : `editions/fra-bukhari/sections/1.json` et `sections/2.json`.
- Repository : https://github.com/fawazahmed0/hadith-api
- Numéros et liens individuels : https://sunnah.com/bukhari
- Métadonnées de provenance et SHA des fichiers sources dans `sourceRecords`.

**Réserve éditoriale :** le dépôt d'origine est diffusé sous Unlicense, mais l'identité du traducteur français et les droits spécifiques de la version française ne sont pas établis avec certitude. Les intitulés sont donc volontairement neutres et cette première importation ne prétend pas constituer une édition critique vérifiée. La concordance des numéros et la présence des textes ont été contrôlées automatiquement, **pas** chaque choix de traduction par un spécialiste.

Le lecteur donne accès aux textes dans les deux langues, puis à leur provenance dans le volet secondaire « Sources, transmission et précisions ».

## Structure et futures tranches

`data/kutub-sitta/bukhari.json` respecte `schemaVersion:1` et contient :
- `chapters` : deux livres, avec leurs bornes ;
- `sourceRecords` : notice de provenance arabe, française et numérotation ;
- `hadiths` : identifiant unique `Sahih al-Bukhari <n>`, numéro global, numéro dans le livre, texte arabe intégral, français, lien par hadith.

Pour la suite, préserver **une entrée par numéro global** et distinguer les livres des chapitres internes. Les variantes éditoriales ou commentaires ne doivent pas être fabriqués à partir de l'intitulé d'un hadith.
