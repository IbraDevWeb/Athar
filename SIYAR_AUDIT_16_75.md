# Audit Siyar — Fascicules 16 à 75

**Périmètre :** Six fascicules français transmis par le propriétaire du projet : 16–33 (35 pages PDF), 34 (22 p.), 35–37 (37 p.), 38–54 (55 p.), 55–56 (51 p.), 57–75 (86 p.). Ouvrage : Shams ad-Dîn adh-Dhahabî, *Siyar A‘lâm an-Nubalâ’*, traduction française « Les Grandes Figures de l’Islam » diffusée par Islam Patrimoine.

## Résultat réel et limites

- Correspondance vérifiée entre **60 intitulés de notices (16 à 75)** du recueil et les **60 fiches Athar portant ces numéros**.
- Les pages de départ des notices sont enregistrées dans `biography_sources_data.js` ; chaque entrée de type `identity` est **un repérage bibliographique**, **pas une validation de toute la biographie**.
- **18 autres repères ciblés** consignent des citations, variantes ou réserves importantes pour 15 notices du lot.
- La fiche Athar **11** désigne **Oubayda ibn Al-Harith**, exactement la personne de la notice Siyar **45** et de la fiche Athar **45**. Une référence commune est ajoutée ; ce **doublon de présentation** est conservé pour le moment afin de ne pas briser les liens ou les favoris.
- La fiche Athar **12** (« Abd-Allah ibn Jahche ») ne correspond pas au n° 12 de la traduction Siyar ; elle reste **sans référence ciblée** dans ces fascicules.
- Les personnes aux noms proches sont distinguées : Athar **29** = Abd-Allah ibn Al-Harith ibn Nawfal et Athar **47** = Abd-Allah ibn Al-Harith ibn Abdelmoutalib ; Athar **30** et **65** sont également deux personnes différentes.
- Le registre couvre après cette opération **74 notices sur les 104 présentes** dans le jeu de données, avec **125 repères** (46 antérieurs, 61 nouveaux repères d'identité, 18 références ciblées supplémentaires). Cela **ne signifie pas que 74 notices sont authentifiées**.

## Corrections éditoriales ciblées

| Athar | Passage consulté | Correction justifiée |
|---|---|---|
| 26 — Al-Barâ ibn Mâlik | 16–33, PDF p. 21, imprimée p. 20 | Le récit lui attribue **99 duels**, pas exactement 100. |
| 27 — Nawfal ibn Al-Hârith | 16–33, PDF p. 24, imprimée p. 23 | Deux dates de décès rapportées : **20 ou 25 H**. |
| 35 — ‘Aqîl ibn Abî Tâlib | 35–37, PDF p. 3 et 4 | Les paroles après la mort d’Abou Jahl étaient **attribuées à la mauvaise personne** ; l'histoire de l’aiguille ne précise pas ici Hounayn. |
| 49 — Abâne ibn Sa‘îd | 38–54, PDF p. 40–41 | Les trois frères meurent selon le récit au **Shâm**, sans certitude qu’ils moururent tous à **Ajnâdayn**. |
| 51 — Al-‘Alâ al-Hadramî | 38–54, PDF p. 43 et 46 | Traversée à **pied / par un gué** selon une voie, **à cheval** selon une autre ; miracles présentés comme **récits transmis**, non faits indépendamment certifiés. |
| 55 — Sa‘d ibn ‘Oubâda | 55–56, PDF p. 12–15 | Les motifs du refus d’allégeance ne se réduisent pas à la « fierté tribale » ; décès au Hauran daté différemment, **14 ou 16 H**, récits sur les djinns **non tenus pour causalité certaine**. |
| 56 — Sa‘d ibn Mou‘âdh | 55–56, PDF p. 46 | L’explication de l’étreinte de la tombe par des éclaboussures d’urine est accompagnée d’une **chaîne discontinue**. |
| 60 — ‘Oukâsha ibn Mihsân | 57–75, PDF p. 19 | Décès **11 H**, datation préférée par Dhahabî, mais **12 H** aussi rapporté ; le nom de l'épée « Al-Awn » n'est pas dans ce passage. |
| 70 — Zaynab | 57–75, PDF p. 64 | Décès en **8 H**, sans cause de décès précisée dans ce passage. |
| 72 — Abou Zayd | 57–75, PDF p. 66–67 | Ibn Sa‘d le nomme **Thâbit ibn Zayd** ; Aous/Mou‘âdh sont également cités ; l'identification « Sa‘d ibn ‘Oubayd » n'est pas celle de cette notice. |

Des réserves additionnelles figurent dans le registre : Abou Al-Haytham (22), Abou Doujâna (39), Mou‘âdh (41), ‘Abd-Allah ibn Al-Hârith (29), Abou Al-‘Ass (69), ‘Abbâd ibn Bishr (73).

## Méthode et sources

- **Traduction française transmise** : les pages indiquées sont des pages du fascicule PDF, avec page imprimée = page PDF − 1 ; le repérage s'appuie sur les titres et passages lus dans les six PDF.
- **Accès public sans hébergement des PDF** : [Table des matières de Siyar.fr](https://siyar.fr/livre/table-des-matieres), tome 1. Chaque fiche renvoie à sa page dans le tome 1. [Islam Patrimoine](https://islam-patrimoine.org/) est lié comme diffuseur.
- **Niveaux distincts** : notice repérée, passage localisé, variantes de récits, transmission faible/discontinue. La présence du récit chez Dhahabî n'atteste pas mécaniquement son authenticité.
- **Aucune vérification exhaustive des isnâds ni des hadiths**. Les résumés, citations, questionnaires et toutes les chronologies des 60 fiches ne sont pas garantis. Les items marqués `identity` doivent être lus comme **index**, jamais comme contrôle scientifique exhaustif.
- **Architecture** : aucun RAG, nouveau service ou PDF ajouté. Les textes et les références restent des fichiers JavaScript statiques ; données personnelles et compteur Tasbih sont préservés.

## À faire ensuite

1. **Audit par passages** des récits et des dates restants, par groupes de cinq à dix biographies au maximum ; marquer les mentions non corroborées.
2. **Résoudre le doublon 11 / 45** après examen des favoris, identifiants de navigation et liens profonds ; ne pas renuméroter arbitrairement.
3. **Contrôler les hadiths et citations** séparément des narrations historiques, avec leur source exacte et une qualification appropriée.
4. Vérifier les fiches 76–100 avec les fascicules correspondants ; maintenir l'état non vérifié sans source.
5. Pour toute future modification : branche, validation JavaScript, test des sources et lecteurs, test navigateur mobile, puis contrôle GitHub Pages après fusion.
