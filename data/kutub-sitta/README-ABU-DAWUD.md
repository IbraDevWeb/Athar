# Sunan Abî Dâwûd — références 1 à 50

## Périmètre et numérotation

Le fichier `data/kutub-sitta/abu-dawud.json` contient **les 50 premières références usuelles de Sunan Abî Dâwûd**, numérotées **1 à 50**, telles qu’identifiées sur [Sunnah.com](https://sunnah.com/abudawud/1).

- Toutes les références du lot appartiennent au **Livre 1 : La Purification / كتاب الطهارة**.
- La numérotation globale et la référence interne du livre sont identiques pour ces 50 entrées : `1–50`.
- Les textes arabes conservent les chaînes de transmission et les précisions des versions numériques importées.
- Les intitulés visibles sur les cartes sont **des titres de lecture éditoriaux** créés pour la navigation : **ils ne sont pas présentés comme des intitulés officiels de chapitres ou de l’imam Abû Dâwûd**.

Exemples de vérification : [Sunan Abî Dâwûd 1](https://sunnah.com/abudawud:1) et [Sunan Abî Dâwûd 50](https://sunnah.com/abudawud:50).

## Provenance numérique

- **Arabe :** [hadith-api, édition ara-abudawud, section 1](https://github.com/fawazahmed0/hadith-api/blob/1/editions/ara-abudawud/sections/1.json) ; version Git `1`, empreinte source `1a6bd887593dce51fd73814a258c02ae844dcc43`.
- **Français :** [hadith-api, édition fra-abudawud, section 1](https://github.com/fawazahmed0/hadith-api/blob/1/editions/fra-abudawud/sections/1.json) ; version Git `1`, empreinte source `34d340f5bbe85cb0b454ef0ae708ae71537037fc`.
- **Numérotation :** [Sunnah.com, Livre de la purification](https://sunnah.com/abudawud/1).
- Chaque entrée inclut un lien individuel au numéro de Sunnah.com, un lien vers le texte arabe source et un lien vers la version française source.

**Réserve sur les traductions :** l’identité du traducteur français n’est pas renseignée dans les métadonnées consultées. Ces versions numériques n’ont pas été révisées par un spécialiste pour Athar. Elles ne constituent pas une édition française certifiée.

## Authenticité et divergences

**Sunan Abî Dâwûd n’est pas intégralement un recueil de hadiths jugés sahîh.** Certaines transmissions sont jugées faibles ou contestées.

Le champ `grades` conserve les appréciations présentes dans la donnée source, sous la forme de couples `scholar` et `assessment`. Les avis peuvent diverger pour une même référence. Le lecteur les affiche **avec le nom de l’auteur de l’appréciation**, sans prétendre résoudre les divergences et sans attribuer un jugement universel au hadith.

Exemples dans ce lot : la source numérique fournit `Daif` pour le n° 3 et `Shadh` pour le n° 5 sous certains noms. Une vérification savante reste nécessaire en cas de divergence ; la donnée source n’est pas en elle-même une authentification nouvelle.

## Intégration dans Athar

La première tranche utilise le même catalogue immersif que Sahîh al-Bukhârî et Sahîh Muslim : recherche, pagination, favoris, lecteur arabe/français, liens individuels vers Sunnah.com et notes personnelles sauvegardées localement.

Les 50 références d’al-Bukhârî, les 50 de Muslim et le corpus existant de 50 hadiths thématiques restent inchangés. Les trois autres recueils (at-Tirmidhî, an-Nasâ’î et Ibn Mâjah) restent annoncés comme en préparation.

## Tests

`scripts/validate-kutub-sitta.js` vérifie la continuité 1–50, les correspondances du livre 1, les deux textes présents, les liens individuels, la provenance et les appréciations attribuées. Le test navigateur `scripts/ux_public_release_browser_test.mjs` vérifie l’accès au catalogue et aux fiches n° 1 et n° 50.
