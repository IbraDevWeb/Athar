# Fiqh malikite · Prototype 01

**État :** une seule fiche publique. Les chapitres juridiques suivants ne sont pas encore rédigés. La rubrique ne doit pas être présentée comme un traité complet ni comme un service de fatwa.

## Livre de référence

- **Titre :** مواهب الجليل في شرح مختصر خليل — *Mawâhib al-Jalîl fî Sharh Mukhtasar Khalîl*.
- **Auteur du commentaire :** Shams al-Dîn Muhammad ibn Muhammad al-Hattâb al-Ru‘aynî (mort en **954 H / 1547**).
- **Texte commenté :** *Mukhtasar* de Khalîl ibn Ishâq, ouvrage condensé de fiqh malikite. Il ne faut pas attribuer le texte original de Khalîl à al-Hattâb.
- **Édition documentée sur Usul :** Dâr al-Fikr, 3e édition, 1412 H, Beyrouth. Cette indication décrit la notice numérique consultée, sans prétendre identifier toutes les éditions.
- **Source fournie par le lecteur :** https://usul.ai/ar/t/mawahib-al-jalil-fi-sharh-mukhtasar-khalil
- **Lecture indépendante de la préface :** https://islamweb.net/ar/library/content/19/1/%D9%85%D9%82%D8%AF%D9%85%D8%A9-%D8%A7%D9%84%D9%83%D8%AA%D8%A7%D8%A8

## Contenu de la fiche

Fichier `fiqh_maliki_data.js` — 1 leçon, composée de :
1. Pourquoi l’auteur accorde de l’importance au fiqh.
2. Distinction entre Khalîl, auteur du Mukhtasar, et al-Hattâb, commentateur.
3. Nécessité du commentaire d’un ouvrage condensé et rôle des commentaires antérieurs.
4. Méthode progressive d’étude sur Athar, **clairement distinguée du texte original**.

La fiche contient aussi un **court extrait arabe de la préface**, une **explication de son sens** (pas une traduction littérale), **6 termes de lexique**, **3 questions de compréhension**, ainsi que deux liens vers les pages de source.

La formule citée dans le prototype, « إلَّا أَنَّهُ لِفَرْطِ الْإِيجَازِ كَادَ يُعَدُّ مِنْ جُمْلَةِ الْأَلْغَازِ », appartient à la préface d’al-Hattâb et s’applique à la difficulté de lecture d’un texte extrêmement condensé.

**Critère de fidélité :** l’utilisateur peut identifier ce qui est un passage arabe vérifié, ce qui est une synthèse pédagogique française, ce qui est un terme expliqué par Athar et ce qui relève de la conception de l’application.

## Limites éditoriales

- La fiche **n’enseigne pas encore de règles de purification, prière ou autres jugements concrets** : les textes de ces chapitres devront être vérifiés et contextualisés avant ajout.
- Le « Livre de la purification » est mentionné comme **suite envisageable**, et non comme leçon disponible. Ce chapitre est bien présent dans le sommaire vérifié d’Usul.
- Les quiz et les définitions du glossaire sont **rédigés par Athar**, non attribués à l’auteur.
- Le marquage « fiche lue » est facultatif ; seule sa valeur booléenne est stockée dans le navigateur sous `athar_fiqh_maliki_intro_01_done`.
- L’application reste **purement statique**, sans nouvelle API, paiement, authentification ou mécanisme de suivi distant.
- La section « Apprentissage de la croyance » reste masquée.

## Vérifications

`scripts/validate-fiqh-maliki.js` contrôle l'intégrité structurelle et la provenance de cette première leçon, les scripts et l'activation dans la navigation des 9 rubriques. `scripts/ux_public_release_browser_test.mjs` vérifie la lecture de la fiche, les six termes, le quiz, les liens, la sauvegarde de progression et les dimensions sur mobile.

**Consultation des sources : 15 novembre 2026.** Les données de la notice ont été rapprochées de la préface de l’auteur et de la table des matières.
