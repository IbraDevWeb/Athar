# Kutub as-Sitta — préparation de la compilation

La rubrique **Hadiths → Kutub as-Sitta** contient six recueils consultables. **Sahîh al-Bukhârî** possède 50 premiers hadiths et **Sahîh Muslim** les références 1–50 (Introduction puis Livre de la foi) ; les quatre autres recueils sont encore vides. Le corpus Athar existant (`hadiths_data.js`) reste séparé et ne doit pas être attribué automatiquement à un des six recueils sur la simple base d'un nom d'auteur.

## Arborescence

- `js/kutub-sitta-registry.js` : identifiants stables, titres en français et arabe, noms des compilateurs et chemins des fichiers.
- `data/kutub-sitta/bukhari.json`
- `data/kutub-sitta/muslim.json`
- `data/kutub-sitta/abu-dawud.json`
- `data/kutub-sitta/tirmidhi.json`
- `data/kutub-sitta/nasai.json`
- `data/kutub-sitta/ibn-majah.json`

Chaque fichier est chargé **à l'ouverture du recueil**. Les six fichiers sont précachés par le service worker pour permettre leur consultation hors connexion, y compris les deux premières tranches. **Quand le volume grandira, retirer ces gros fichiers du précache initial et migrer vers des fichiers par chapitre** pour éviter une installation PWA trop lourde.

## Schéma JSON v1

```json
{
  "schemaVersion": 1,
  "collectionId": "bukhari",
  "sourceRecords": [],
  "chapters": [],
  "hadiths": []
}
```

Lors de la première importation, garder les clés et ajouter des éléments **vérifiés**. Champs envisagés :

**Chapitre** : `id` (stable dans ce recueil), `titleFr`, `titleAr`, `order` (position), `sourceRecordId` (facultatif si le découpage vient d'une édition distincte).

**Hadith ou narration d'introduction** : `id` (globalement unique, p. ex. `bukhari:<numéro d'édition>`), `chapterId`, `number` (numéro tel qu'affiché par la source), `title` (titre de navigation), `hadeeth` (français si autorisé), `hadeeth_ar`, `attribution`, `grade` (libellé **tel que cité**, sans invention), `explanation` (facultatif), `hints` (facultatif), `source_url` (URL exacte du hadith, en HTTPS), `sourceRecordId`. Ces champs sont compatibles avec le lecteur actuel ; des champs supplémentaires peuvent être ajoutés au schéma lorsqu'ils deviennent nécessaires.

**Provenance (dans `sourceRecords`)** : `id`, `site`, `url`, `edition`, `numberingSystem`, `retrievedAt`, `rights` ou `license`, `translator` le cas échéant. Un hadith doit pouvoir être retracé à la source et à la numérotation utilisée.

## Précautions pour la compilation

1. Répertorier les éditions, systèmes de numérotation et chapitres des sites sources avant d'importer les textes. Les numérotations d'un même recueil ne sont pas toujours interchangeables.
2. Vérifier **avant toute copie** les conditions d'utilisation des traductions, annotations et extractions automatisées. Un texte original ancien et une traduction récente ne suivent pas nécessairement le même régime de droits. Ne pas lancer de scraping sans validation.
3. Ne pas présenter les quatre autres recueils comme intégralement authentiques. Conserver les degrés, les avis d'auteurs et les variantes quand ils sont disponibles, dans le volet de sources du lecteur.
4. Ne pas confondre `id` interne, référence d'édition, ordre d'affichage, chapitre et texte distinct. Pour dédoublonner, conserver les relations entre versions plutôt que supprimer arbitrairement des transmissions.
5. Garder les notices de compilateurs et les informations bibliographiques vérifiables ; ne pas transformer les traductions ou commentaires en paroles attribuées directement au Prophète ﷺ.
6. Mettre à jour le cache PWA et les validateurs lors de l'ajout des futurs lots.

**Périmètre actuel :** deux recueils initialement alimentés (50 hadiths al-Bukhârî ; 50 textes de Sahîh Muslim, références usuelles 1–50), quatre encore vides. Le corpus thématique actuel reste inchangé. Voir `README-BUKHARI.md` et `README-MUSLIM.md` pour les particularités de numérotation, de provenance et d’édition.

## Références pour identifier les six recueils

- Bibliographie des six livres : [Islam Museum](https://www.islam.museum/en/concept/kutub-al-sitta/)
- Vue d'ensemble institutionnelle : [Diyanet, *Hadith* (classification des sources)](https://dijital.diyanet.gov.tr/File/Download?id=5025&path=5025_1.pdf)

La liste retenue est l'usage contemporain répandu comprenant les Sunan d'Ibn Mâjah ; certaines classifications historiques emploient à sa place le *Muwatta’* de Mâlik. Cette nuance ne modifie pas les six espaces préparés ici.
