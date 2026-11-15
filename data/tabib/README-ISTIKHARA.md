# Tabib al-Qulûb — fiche n° 8 : l’istikhâra

## Évolution

La fiche n° 8 existait auparavant sous le nom « Indécision (Istikhara) », avec une invocation abrégée. Cette version **améliore la fiche existante plutôt que de créer un doublon**. Le corpus compte toujours **50 fiches** ; les 49 autres sont inchangées.

La fiche contient désormais :
- le texte complet de l'invocation, en arabe, selon la formulation du hadith de Jâbir où l'on mentionne « l'issue de mon affaire » ;
- une phonétique de lecture indicative et une **traduction du sens rédigée pour Athar**, sans prétention à une traduction savante certifiée ;
- le lien exact vers le hadith et vers le verset 3:159 utilisé pour la consultation et la confiance en Allah ;
- cinq étapes pratiques, cinq questions sur les idées reçues, cinq notions de lexique et quatre sources consultables.

## Sources vérifiées

1. [Sahîh al-Bukhârî 1166 — Jâbir ibn ‘Abd Allâh](https://sunnah.com/bukhari:1166) : deux rak‘ât autres que l'obligatoire, invocation de demande du meilleur choix et mention de la décision concernée. Le même récit est également référencé dans [Sahîh al-Bukhârî 6382](https://sunnah.com/bukhari:6382).
2. [Coran 3:159](https://www.quran.is/french/3) : consultation, décision, puis confiance en Allah.
3. [Dar al-Iftâ d’Égypte, « Al-Istikharah », 15 janvier 2024](https://www.dar-alifta.org/fr/fatwa/details/744/al-istikharah) : méthode et portée de la prière.
4. [Dar al-Iftâ d’Égypte, « Prière d’Al-Istikhara », 23 mars 2015](https://dar-alifta.org/fr/fatwa/details/8292/priere-d%E2%80%99al-istikhara) : pas de réponse corporelle ou de signe imposé.

## Prudence éditoriale

La fiche ne présente **ni le rêve**, ni une couleur, ni un incident isolé comme une réponse automatique. Elle rappelle la nécessité de prendre des renseignements, de consulter des personnes fiables, de prier et de prendre une décision avec discernement.

Le texte arabe est donné sans la chaîne complète des transmetteurs, le hadith source étant lié depuis la fiche. Les variantes de formulation sont signalées dans la note de traduction. La phonétique ne peut pas remplacer la récitation de l'arabe.

## Vérification

`scripts/validate-tabib-istikhara.js` contrôle la présence de l'invocation complète, des liens, du contenu éducatif, des nouvelles sections de lecture et du numéro de fiche. Il vérifie aussi l’empreinte FNV-1a (`bf68eb6f`) du fichier de données après retrait de la seule fiche n° 8, empreinte issue de la version précédente : les 49 autres fiches ne sont donc pas affectées. Le test navigateur vérifie la lecture de la fiche depuis Tabib.
