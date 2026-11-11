# Audit de la frise chronologique Athar — première passe de fiabilisation

**Date de travail :** 11 novembre 2026.

## 1. Nature du problème découvert

Le composant `js/components/TimelineView.js` affectait artificiellement des années à des étiquettes telles que « Enfance », « Jeunesse », « Mecque », « Conversion » ou « Débuts ». Les heuristiques calculaient aussi des années à partir du minimum ou du maximum d'autres événements de la biographie, puis convertissaient le résultat en date grégorienne. Ces équivalences avaient l'apparence de dates historiques alors qu'elles ne provenaient d'aucun texte source.

Exemple visible : **Oumâma bint Abî al-‘Âs, événement « Enfance »**. Le fait que le Prophète ﷺ ait porté Oumâma durant la prière est rapporté par **Abou Qatâda dans [Sahîh al-Bukhârî 516](https://sunnah.com/bukhari:516)** et [An-Nasâ’î 827](https://sunnah.com/nasai:827). **Ce texte ne donne pas l'année de l'épisode.** L'affichage « ≈ 612 » ne repose donc pas sur ce hadith et doit disparaître.

## 2. Correctifs appliqués

- **Aucune date inventée** à partir du texte, d'une ville, d'un âge, d'un autre événement ou d'une simple étiquette.
- **Année indiquée dans la notice** : conservée, sans prétendre qu'Athar l'a vérifiée dans les chroniques.
- **Datations alternatives dans une même période** : conserver les deux valeurs et signaler la divergence ; le tri numérique n'est qu'un point de rangement.
- **Datations alternatives traversant plusieurs périodes** : conserver la phrase originelle dans « Date à préciser », au lieu d'imposer une période.
- **Période explicite sans année** : placer dans la période, avec la mention « Période identifiée », sans créer d'année.
- **Autre repère** : accessible dans « Date à préciser », sans date grégorienne synthétique.
- **Sources nominatives** : l'épisode d'Oumâma porte directement un lien vers Al-Bukhârî 516, assorti d'une réserve de datation.
- **Frontière 11 H** : les récits de *Ridda*, de Saqîfa et du califat d'Abou Bakr relèvent du début du califat, pas de la période de gouvernement prophétique. La séparation automatique est désormais 1–10 H / 11–40 H, sous réserve de nouvelles sources sur les événements de transition.
- **Badr** : le libellé strict « Badr » peut correspondre à 2 H, avec un [repère historique](https://www.islam.museum/en/event/battle-of-badr/). Cela **n'authentifie pas la présence du personnage** à cette bataille.

## 3. Couverture automatique

Répartition après le placement de l’an 11 H dans le début du califat (mise à confirmer par la nouvelle validation CI) :

| Type de repère | Nombre | Ce que cela signifie |
|---|---:|---|
| Année indiquée ou événement-repère explicite | 204 | Repère placé, **sans preuve indépendante ajoutée à chaque occurrence** |
| Datations multiples | 9 | Variantes affichées ; aucune version choisie arbitrairement |
| Périodes seules | 26 | Période déterminée, année absente |
| Dates non renseignées | 114 | Ne sont plus projetées artificiellement sur la frise |
| **Total** | **353** | Tous les événements conservés |

Ces nombres ne doivent jamais être présentés comme « 204 dates historiquement vérifiées ». Le corpus biographique d'Athar conserve ses propres lacunes documentaires.

## 4. Garde-fous

Le test `scripts/validate-chronology-data.js` parcourt les événements et vérifie que :
- « Enfance », « Mecque », « Jeunesse », « 70 ans », « Hégire », « 46 ans après » n'induisent aucune année.
- Les datations comme « 3 ou 4 H » et « 11 H (12 H également rapporté) » restent distinguées au sein de leur période ; une variante qui traverse la frontière 40/41 H est rangée hors des périodes faute de choix documenté.
- Oumâma ne figure plus dans « Avant l'Hégire » par inférence, et cite [Al-Bukhârî 516](https://sunnah.com/bukhari:516).
- Le passage 10 H → 11 H est traité comme une transition de période.
- Les 353 événements restent accessibles, sans suppression.

Un test navigateur vise en outre la fiche d'Oumâma depuis la frise, son rattachement à « Date à préciser » et la visibilité de sa source.

## 5. Suites de l'audit historique (différentes des corrections techniques)

1. Comparer **chaque année effectivement indiquée dans une notice** avec le passage biographique et les chroniques ; enregistrer les variantes et les avis des historiens. Il reste des dates déclarées à recouper.
2. Examiner les repères « Date à préciser » pour déterminer si une **période** peut être justifiée par une source supplémentaire, sans combler les années par hypothèse.
3. Ajouter progressivement des sources par événement et une classification « attribué à tel auteur », sur le modèle des hadiths déjà présents dans Athar.

**Doctrine :** Athar est une encyclopédie des récits rapportés, pas un organisme qui authentifie indépendamment les traditions. La rigueur chronologique consiste d'abord à distinguer date, hypothèse, variante et absence d'information.
