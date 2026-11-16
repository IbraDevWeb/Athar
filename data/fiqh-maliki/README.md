# Fiqh malikite · Parcours 01–02

**État au 16 novembre 2026 : deux fiches disponibles.** Cette rubrique demeure un support d'étude progressive du fiqh malikite à partir de passages repérés dans **Mawâhib al-Jalîl fî Sharh Mukhtasar Khalîl**. Elle ne prétend pas être un traité complet et ne délivre pas de fatwas.

## Livre de référence et méthode

- **Titre arabe :** مواهب الجليل في شرح مختصر خليل
- **Commentateur :** Shams al-Dîn Muhammad ibn Muhammad al-Hattâb al-Ru‘aynî (mort en 954 H / 1547).
- **Texte commenté :** *Mukhtasar* de Khalîl ibn Ishâq. Les formules précédées du symbole « ص » dans le commentaire renvoient au texte de Khalîl ; les développements d'al-Hattâb sont distincts.
- **Notice bibliographique Usul :** Dâr al-Fikr, 3e éd., 1412 H, Beyrouth. Cela documente cette édition numérique, pas toutes les éditions.
- **Source primaire commune :** https://usul.ai/ar/t/mawahib-al-jalil-fi-sharh-mukhtasar-khalil
- **Recoupement de la préface :** https://islamweb.net/ar/library/content/19/1/%D9%85%D9%82%D8%AF%D9%85%D8%A9-%D8%A7%D9%84%D9%83%D8%AA%D8%A7%D8%A8
- **Recoupement de la fiche 02 :** https://www.islamweb.net/ar/library/content/19/84/%D8%A8%D8%A7%D8%A8-%D9%8A%D8%B1%D9%81%D8%B9-%D8%A7%D9%84%D8%AD%D8%AF%D8%AB-%D9%88%D8%AD%D9%83%D9%85-%D8%A7%D9%84%D8%AE%D8%A8%D8%AB (tome 1, page 44).

## Fiche 01 — Découvrir Mawâhib al-Jalîl

Intégralité de la fiche pilote maintenue (voir PR #172) :

1. Place du fiqh dans la préface.
2. Distinction entre Khalîl (auteur du Mukhtasar) et al-Hattâb (commentateur).
3. Nécessité d'un commentaire d'un texte juridique condensé.
4. Méthode de lecture progressive propre à Athar.

Extrait : « إلَّا أَنَّهُ لِفَرْطِ الْإِيجَازِ كَادَ يُعَدُّ مِنْ جُمْلَةِ الْأَلْغَازِ » : extrait vérifié de la préface d'al-Hattâb. Six termes, trois questions.

## Fiche 02 — Kitâb al-Tahâra : les fondements de la purification

**Périmètre exact :** début du « باب يرفع الحدث وحكم الخبث » du Livre de la purification. Le commentaire consulté explique les sens de *tahâra* et la formulation initiale du Mukhtasar sur l'eau dite *mutlaq*.

1. **Début du chapitre :** formulation du Mukhtasar et rôle du commentaire.
2. **Tahâra :** sens linguistique (propreté) et deux emplois juridiques présentés par al-Hattâb.
3. **Hadath et khabath :** différencier l'état rituel de la souillure.
4. **Mâ’ mutlaq :** comprendre l'eau portant le simple nom « eau », sans qualification nécessaire.

**Citation courte en arabe (texte de Khalîl, reproduit dans le commentaire) :**

> بالمطلق وهو ما صدق عليه اسم ماء بلا قيد

Le sens est expliqué en français, sans attribuer la formulation de Khalîl à al-Hattâb et sans prétendre fournir une traduction exhaustive. Le vocabulaire et le quiz de la fiche sont écrits pour Athar : six notions, trois questions à choix multiples avec explications. La fiche ne tranche pas les cas d'eaux mélangées, transformées ou contaminées, qui requièrent la lecture des développements suivants.

**Limite importante :** ce début de chapitre contient aussi des discussions juridiques techniques ; elles ne sont pas reproduites ici hors contexte. La fiche 03 envisagée traitera de la suite de la section sur l'eau après une vérification éditoriale indépendante.

## Intégration technique

- Données : `fiqh_maliki_data.js` (objets `intro` et `purification`).
- Affichage : `js/components/MalikiFiqhView.js`, navigation accessible entre deux fiches.
- Interface et mode sombre : `css/fiqh-maliki.css`.
- Chaque fiche a un **lexique**, un **quiz** et un bouton **« marquer comme lue »** distincts ; les réponses au quiz sont réinitialisées à chaque changement de fiche.
- Le suivi de lecture reste facultatif et strictement local, sans connexion : clés `athar_fiqh_maliki_intro_01_done` (préexistante) et `athar_fiqh_maliki_tahara_02_done` (nouvelle).
- Versions de ressources PWA mises à jour (v83) afin de distribuer les nouveaux JS/CSS via le service worker.
- Aucune modification des autres rubriques publiques, du contenu d'Usûl al-Fiqh ou des fiches Tabib.

## Contrôles prévus

- `node scripts/validate-fiqh-maliki.js` : structures, sources, attribution de la citation, nombre de fiches, intégration.
- `node scripts/ux_public_release_browser_test.mjs` : navigation, citations, recherche du lexique, deux quiz, suivi indépendant, retour fiche 01.
- Vérifier manuellement le rendu mobile et le fonctionnement hors ligne après un rechargement de la PWA.

**Sources consultées le 16 novembre 2026.** L'information éditoriale française est une synthèse pédagogique explicitement distinguée des citations arabes.
