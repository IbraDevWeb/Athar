# Usûl al-Fiqh — restauration du parcours complet

## Périmètre

La rubrique **Usûl al-Fiqh** est publiée comme **huitième section principale** de l'application Athar. Le parcours existait historiquement dans le dépôt mais ne figurait plus dans le paquet public. La réactivation ne nécessite aucune réécriture du corpus original.

- Source des cours : `ussul_data.js`, restauré **sans modifier son contenu**.
- Empreinte Git blob du fichier historique : `cc94c05ffc6a576fc77a510ff9d5af8878031a16`, vérifiée par `scripts/validate-usul-public.js`.
- **7 leçons** avec leurs introductions, sections de cours, éventuels encadrés `deepDive` et liens vidéo, tous conservés.
- Les identifiants numériques du fichier historique ne sont pas tous uniques. Le composant utilise donc une clé de leçon basée sur sa position, son identifiant et son titre afin de conserver les progrès sans confondre deux leçons. La donnée d'origine n'est pas modifiée.
- La progression existante utilise toujours `localStorage.athar_ussul_v2`.

## Lexique intégré

Le parcours conserve les mots `{notion}` présents directement dans le texte de ses leçons.

Le nouveau panneau **Lexique** parcourt les textes de toutes les sections et des approfondissements. Pour chaque terme, il affiche :

1. Le terme tel qu'il apparaît dans les cours.
2. La définition de `GLOSSARY_DATA` si elle existe (et seulement dans ce cas).
3. Un extrait de la phrase présente dans le cours, clairement présenté comme **contexte**, non comme définition nouvelle.
4. Un lien direct vers la leçon et la partie dans lesquelles la notion apparaît.

La recherche s'effectue dans les notions, leurs définitions disponibles, leurs contextes et les titres des leçons. Les résultats sont affichés progressivement pour conserver une interface sobre.

## Interface

Le lecteur de la version précédente (`js/components/UssulView.js`) est conservé et enrichi. Le style de `css/ussul-pro.css` a été reconstruit dans une palette neutre, sans habillages décoratifs superflus : cartes légères, texte lisible, barre de progression discrète, sommaire du cours, thèmes clair/sombre, mode téléphone et lecteur YouTube flottant au clic.

## Précautions éditoriales

Les explications, références et interprétations contenues dans ce corpus proviennent des anciens supports d'Athar. **Leur présence n'atteste pas une vérification religieuse indépendante dans cette modification.** Aucune assertion n'a été ajoutée au cours original ni remplacée par une synthèse générée.

## Rubrique Croyance

Le module non terminé « Apprentissage de la croyance » est **retiré de l'accueil, des menus, des vues publiées et du précache du service worker**. Ses fichiers sources restent dans le dépôt GitHub : cette mesure masque l'interface, mais ne les rend pas privés si le dépôt est public.

## Contrôles

`scripts/validate-usul-public.js` et `scripts/validate-public-navigation.js` vérifient l'intégrité des textes originaux, la présence du lexique, l'activation de la huitième rubrique et l'absence de Croyance dans le paquet public. Les tests navigateur couvrent aussi la recherche et le lecteur Usûl.
