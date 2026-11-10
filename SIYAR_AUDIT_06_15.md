# Audit documentaire Siyar — biographies Athar 6 à 15

Date : 10 novembre 2026. Sources principales : trois fascicules français transmis par le propriétaire du projet, issus de la traduction **Les Grandes Figures de l’Islam**, d’après *Siyar A‘lâm an-Nubalâ’* de Shams ad-Dîn adh-Dhahabî, diffusée par Islam Patrimoine.

**Règles.** Les numéros de page du fichier PDF diffèrent des pages imprimées : « PDF p. N » correspond à « fascicule imprimé p. N-1 ». L'édition en ligne sur [Siyar.fr](https://siyar.fr/livre/table-des-matieres) possède sa propre pagination. Les liens directs mènent vers la section de lecture, jamais vers un PDF recopié. Localiser un passage ne constitue pas une authentification de la transmission.

## Couverture du nouveau lot

| ID Athar | Notice | Fascicule reçu | Repères localisés | État |
|---:|---|---|---:|---|
| 6 | Saïd ibn Zayd | 06 | 5 | Source repérée avec variantes |
| 7 | Mouss’ab ibn Oumayr | 07–14 | 4 | Source repérée avec une qualification |
| 8 | Abou Salama | 07–14 | 4 | Deux datations de décès |
| 9 | Outhman ibn Mazh’oune | 07–14 | 5 | Deux réserves de chaîne |
| 10 | Qoudama ibn Mazh’oune | 07–14 | 2 | Formulation interprétative supprimée |
| 11 | Oubayda ibn Al-Harith | — | 0 | **Non vérifié dans ce lot** |
| 12 | Abd-Allah ibn Jahche | — | 0 | **Non vérifié dans ce lot** |
| 13 | Abou Houdhayfa | 07–14 | 3 | Détail non sourcé supprimé |
| 14 | Salim le protégé d’Abou Houdhayfa | 07–14 | 4 | Transmission successorale qualifiée |
| 15 | Hamza ibn Abdelmoutalib | 15 | 5 | Variantes et récits distingués |

Le fascicule **07–14** nomme en réalité **11. Abd-Allah ibn Mazh’oune** et **12. As-Saïb ibn Outhman**, alors que les notices Athar 11 et 12 sont consacrées à d'autres personnes. Les deux biographies actuelles ne sont ni déclarées vérifiées ni remplacées automatiquement ; l'édition intégrale de Siyar.fr place **Oubayda ibn Al-Harith au n° 45** ([lecture directe](https://siyar.fr/livre/1/256)).

## Principales corrections éditoriales

- **Saïd (6) :** pas de « neuvième homme » inventé ; récit du mont Hirâ et variantes du décès (51 ou 52 H), PDF 06 p. 28 et 30.
- **Mouss’ab (7) :** la source dit premier émigré accueilli selon Al-Barâ’, pas explicitement premier ambassadeur, fascicule 07–14 p. 6 ; l'idhkhir et le linceul court figurent p. 7.
- **Abou Salama (8) :** le texte annonce 3 H puis évoque 4 H après Qatane, p. 16 et 19. Ne pas éliminer une des deux traditions.
- **Outhman ibn Mazh’oune (9) :** abstinence du vin avant l'islam qualifiée de récit non authentique, p. 22 ; pierre sur la sépulture avec transmission moursal, p. 20.
- **Qoudama (10) :** recours au verset 5:93 et sanction par ‘Oumar, p. 31 ; commentaire non appuyé retiré.
- **Abou Houdhayfa (13) :** appel au duel contre son père signalé p. 35, sans intervention de l'autorité prophétique dans ce passage.
- **Salim (14) :** succession évoquée via un rapporteur discuté et expressément soumise à réserve, p. 43–44 ; 200 dirhams remis à sa mère en héritage, p. 42.
- **Hamza (15) :** récits du linceul et de la mutilation distingués, p. 10 et 15 ; jugement explicite de faiblesse pour une version du hadith « prince des martyrs », p. 3 ; variantes concernant les prières funéraires, p. 17.

## Périmètre et limites

Les 32 repères ajoutés ont été vérifiés **dans les trois fascicules transmis**, sans examen systématique des autres versions arabes ni évaluation indépendante des isnâds. Aucun document n'est hébergé, le RAG reste absent. Les autres récits, chronologies, hadiths et questionnaires des notices concernées **ne sont pas certifiés par cet audit partiel**.

### Méthode pour le lot suivant

1. Faire correspondre **la personne**, pas seulement le numéro du chapitre, au titre exact du fascicule.
2. Vérifier l'événement ou le récit dans le texte original ; relever page imprimée, page PDF et lien Siyar.fr.
3. Chercher dans la même page et les pages voisines les mentions *moursal*, *gharîb*, *munkar*, *faible*, *discontinu* ou les divergences de datation.
4. Corriger la formulation affichée si nécessaire, sans surinterpréter.
5. Inscrire uniquement les repères localisés dans `biography_sources_data.js`.
6. Exécuter `node scripts/validate-biography-sources.js`, puis les tests navigateur de lecture, avant toute fusion.
