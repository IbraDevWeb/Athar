# Audit de couverture du corpus Athar

> Rapport généré automatiquement à partir des manifestes OpenITI réellement routés vers les shards de production.

## Vue d’ensemble

- **200 ouvrages OpenITI** audités.
- **202 ouvrages** et **493749 passages** annoncés par le manifeste de production.
- **6 shards** en production.
- **2 ouvrage(s) complémentaire(s)** hors OpenITI exclus du calcul des écoles juridiques.

## Disciplines

| Discipline normalisée | Ouvrages | Part |
|---|---|---|
| Hadith | 47 | 23.5 % |
| Fiqh | 42 | 21.0 % |
| Tafsīr | 35 | 17.5 % |
| Sīra et histoire | 34 | 17.0 % |
| ʿAqīda | 31 | 15.5 % |
| Uṣūl et qawāʿid | 10 | 5.0 % |
| Autres | 1 | 0.5 % |

## Écoles juridiques

Les chiffres ci-dessous utilisent uniquement les métadonnées explicitement présentes dans les manifestes. Un champ vide reste **non renseigné** : l’audit n’invente pas le madhhab d’un auteur.

| École / statut | Ouvrages de fiqh associés |
|---|---|
| Mālikite | 19 |
| Ḥanafite | 1 |
| Shāfiʿite | 4 |
| Ḥanbalite | 4 |
| Non renseigné (fiqh) | 26 |

Écoles sous la médiane connue actuelle : **Ḥanafite**.

## Auteurs les plus représentés

| Auteur | Ouvrages | Part du corpus |
|---|---|---|
| Suyuti | 8 | 4.0 % |
| Ibn ʿAbd al-Barr | 5 | 2.5 % |
| Dhahabi | 5 | 2.5 % |
| Abu al-Walid al-Baji | 4 | 2.0 % |
| Ibn al-Qayyim | 3 | 1.5 % |
| Ibn Kathīr | 3 | 1.5 % |
| Ibn Taymiyya | 3 | 1.5 % |
| Ibn Casakir | 3 | 1.5 % |
| Ibn Hajar Casqalani | 3 | 1.5 % |
| Maqrizi | 3 | 1.5 % |
| Ibn Cabd Wahhab | 3 | 1.5 % |
| Al-Qarāfī | 2 | 1.0 % |
| Ibn Rushd al-Jadd | 2 | 1.0 % |
| Ibn Taymiyyah | 2 | 1.0 % |
| Al-Shatibi | 2 | 1.0 % |

Seuil de concentration automatique : **8 ouvrages**. Les auteurs au-dessus de ce seuil sont signalés pour revue, pas automatiquement considérés comme indésirables.

## Qualité des métadonnées

- Madhhab renseigné : **55 / 200 (27.5 %)**.
- Madhhab non renseigné : **145**.
- Classification issue d’un indice automatique : **136**.
- Discipline absente : **0**.

## Grille d’ouvrages de référence

La grille éditoriale contient **57 références** : **34 présentes**, **23 absentes**, soit **59.65 %** de couverture de cette grille.

### Références P1 absentes

- **Mukhtaṣar al-Qudūrī** — Fiqh — Ḥanafite
- **Al-Mabsūṭ** — Fiqh — Ḥanafite
- **Al-Hidāyah** — Fiqh — Ḥanafite
- **Al-Muhadhdhab** — Fiqh — Shāfiʿite
- **Al-Kāfī d’Ibn Qudāmah** — Fiqh — Ḥanbalite
- **Al-Muqniʿ** — Fiqh — Ḥanbalite
- **Al-Inṣāf** — Fiqh — Ḥanbalite
- **Musnad Aḥmad** — Hadith — Transversal
- **Al-Jāmiʿ li-Aḥkām al-Qurʾān** — Tafsīr — Mālikite
- **Al-Mustaṣfā** — Uṣūl al-fiqh — Shāfiʿite
- **Al-Iḥkām fī Uṣūl al-Aḥkām** — Uṣūl al-fiqh — Shāfiʿite
- **Al-Ṭabaqāt al-Kubrā** — Sīra et histoire — Transversal
- **Tārīkh al-Ṭabarī** — Sīra et histoire — Transversal

## Priorités proposées pour le prochain lot

1. Rechercher en priorité les références P1 absentes dans le catalogue OpenITI avant toute promotion générique. — 13 référence(s) P1 manquante(s)
2. Rééquilibrer le fiqh vers les écoles sous la médiane actuelle, à qualité documentaire comparable. — Ḥanafite
3. Enrichir les métadonnées de madhhab des ouvrages déjà présents avant d'utiliser le compteur d'école comme vérité exhaustive. — 145 ouvrage(s) concerné(s)

## Méthode et limites

- Les disciplines sont normalisées à partir des métadonnées Athar/OpenITI ; les catégories mixtes sont ramenées à une catégorie principale pour mesurer la couverture globale.
- Les écoles juridiques ne sont jamais déduites automatiquement de la biographie d’un auteur : seules les métadonnées explicites sont comptées.
- La grille d’ouvrages de référence est un outil de planification éditoriale. Elle ne prétend pas définir un canon religieux ni classer l’autorité des œuvres.
- Une œuvre est considérée présente lorsqu’un marqueur bibliographique explicite de la grille correspond à son identifiant, son titre ou son URI OpenITI.
