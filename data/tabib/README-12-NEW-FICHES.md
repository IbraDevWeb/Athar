# Tabib al-Qulûb — douze nouvelles fiches (51–62)

Les 12 nouvelles fiches se trouvent dans `tabib_new_fiches_data.js`, **séparé** de `tabib_data.js` pour préserver le corpus historique de 50 fiches et sa fiche Istikhâra n° 8. Le catalogue public réunit désormais ces deux tableaux et affiche 62 fiches. Les tags sont compatibles avec les catégories existantes et avec la recherche.

| N° | Titre | Référence coranique | Parole prophétique |
|---|---|---|---|
| 51 | Quand l’exaucement semble tarder | [2:186](https://quran.com/2/186) | [Muslim 2735c](https://sunnah.com/muslim:2735c) |
| 52 | Le khushû‘ : retrouver la présence dans la prière | [23:2](https://quran.com/23/2) | [Muslim 482](https://sunnah.com/muslim:482) |
| 53 | Entre crainte et espérance | [39:53](https://quran.com/39/53) | [Muslim 2755](https://sunnah.com/muslim:2755) |
| 54 | Le tawakkul sans passivité | [65:3](https://quran.com/65/3) | [Tirmidhî 2344](https://sunnah.com/tirmidhi:2344) |
| 55 | L’istiqâma : avancer avec constance | [41:30](https://quran.com/41/30) | [Muslim 38](https://sunnah.com/muslim:38) |
| 56 | La pudeur du cœur : al-hayâ’ | [24:30](https://quran.com/24/30) | [Bukhârî 24](https://sunnah.com/bukhari:24) |
| 57 | La muhâsaba : faire le bilan de son âme | [59:18](https://quran.com/59/18) | [Bukhârî 6416](https://sunnah.com/bukhari:6416) |
| 58 | Un entourage qui rapproche d’Allah | [25:28](https://quran.com/25/28) | [Bukhârî 5534](https://sunnah.com/bukhari:5534) |
| 59 | L’adab du désaccord | [16:125](https://quran.com/16/125) | [Muslim 2564a](https://sunnah.com/muslim:2564a) |
| 60 | L’ikhlâs dans les actes ordinaires | [98:5](https://quran.com/98/5) | [Bukhârî 1](https://sunnah.com/bukhari:1) |
| 61 | Une épreuve ne signifie pas toujours une punition | [2:155](https://quran.com/2/155) | [Bukhârî 5641](https://sunnah.com/bukhari:5641) |
| 62 | La douceur qui transforme les relations | [3:159](https://quran.com/3/159) | [Muslim 2594a](https://sunnah.com/muslim:2594a) |

## Principes de rédaction

- **Textes arabes** : de courts extraits coraniques et prophétiques correspondant aux références exactes indiquées. Lire les passages entiers grâce aux liens directs.
- **Français** : traductions **du sens** et synthèses pédagogiques rédigées pour Athar ; elles ne constituent pas une édition savante de référence.
- **Phonétique** : indicative, surtout pour aider à reconnaître les termes ; l'arabe fait foi.
- **Interprétation** : les explications et conseils pratiques sont des développements éditoriaux distincts des citations religieuses. Les exercices proposés ne sont **pas** présentés comme une pratique prophétique prescrite.
- **Nuances** : la fiche sur les épreuves évite d'imputer à Allah une intention déterminée pour chaque événement ; celle sur l'invocation ne garantit pas une réponse dans un délai précis ; celle sur le tawakkul rappelle la recherche des moyens.
- **Hadith de l'oiseau** : `Jâmi‘ at-Tirmidhî 2344` est qualifié de « hasan » dans l'appréciation Darussalam affichée par Sunnah.com ; at-Tirmidhî le qualifie de « hasan sahih » dans le commentaire du recueil. Les deux appréciations sont indiquées.

Chaque fiche comprend quatre gestes pratiques, trois réponses à des questions fréquentes, trois notions de lexique et deux liens de sources. Les 50 fiches initiales restent sans changement de texte. Les composants existants affichent automatiquement les champs `learning` lorsqu'ils existent.

## Contrôles

`scripts/validate-tabib-twelve.js` valide l'empreinte Git blob **inchangée** de `tabib_data.js`, les 12 nouvelles entrées et leurs références, le nombre final de 62 fiches, l'ordre de chargement et le cache PWA. Les tests navigateur vérifient l'ouverture des fiches 51 et 62 et le retour à la bibliothèque de fiches.

Sources consultées et vérifiées le **15 novembre 2026** : [Quran.com](https://quran.com) et [Sunnah.com](https://sunnah.com).
