# Athar Pro

Athar est une application web **pédagogique et non commerciale**, publiée comme site statique sur GitHub Pages.

## Neuf rubriques publiques

- Bibliothèque : biographies, récits et références documentaires ;
- Frise Chrono : événements historiques ;
- Lexique : vocabulaire et définitions ;
- Hadiths : textes, références et lecture ;
- Tabib Al-Qulub : rappels spirituels ;
- Al-Adhkar : invocations ;
- Tasbih : compteur avec sauvegarde locale ;
- **Usûl al-Fiqh :** sept leçons intégrales, vidéos associées, approfondissements, recherche et lexique fondé sur les textes d’origine. Voir [la note de restauration](./data/ussul/README.md).
- **Fiqh malikite :** première fiche consacrée à la préface de *Mawâhib al-Jalîl fî Sharh Mukhtasar Khalîl* (al-Hattâb), avec arabe, explications, lexique et quiz. Voir [les sources et limites du pilote](./data/fiqh-maliki/README.md).

## Kutub as-Sitta : premières tranches disponibles

- **Sahîh al-Bukhârî :** 50 premiers hadiths.
- **Sahîh Muslim :** 50 premières références, de l'Introduction au Livre de la foi.
- **Sunan Abî Dâwûd :** 50 premières références du Livre de la purification, avec les différentes appréciations d'authenticité attribuées à leurs auteurs. Voir [provenance et précautions éditoriales](./data/kutub-sitta/README-ABU-DAWUD.md).

Les trois autres recueils restent en préparation. Les textes français des collections importées sont issus d'éditions numériques dont le traducteur n'est pas toujours identifié ; ils ne remplacent pas une édition critique ni une validation savante.

Le projet public n'utilise plus de RAG, d'index vectoriel, d'API d'intelligence artificielle ou de serveur Render.
Les modules pédagogiques encore en préparation peuvent rester dans le dépôt mais ne sont pas téléchargés par l'interface publique.

**Apprentissage de la croyance** a été masqué de l’accueil, des menus et du chargement public. Ses fichiers de travail restent dans le dépôt pour une éventuelle reprise, mais la rubrique n’est pas accessible par la navigation de l’application.

## Démarrage local

```bash
python -m http.server 8000
```

Ouvrir `http://localhost:8000`. Les données des huit rubriques sont des fichiers locaux `*_data.js`.
Les préférences, la progression des leçons d’Usûl, l’état « fiche lue » de l’introduction au Fiqh malikite et le compteur Tasbih sont conservés dans le navigateur de l'utilisateur.

## Principes éditoriaux

- Une référence principale ne certifie pas tous les récits d'une notice.
- Présenter les variantes et les réserves des sources.
- Ne jamais inventer de références ni de traductions.
- La référence exacte doit accompagner la correction d'un passage.
- Aucun PDF d'Islam Patrimoine n'est hébergé : les fiches renvoient vers les pages officielles.

Voir [la méthodologie](./methodologie.html).

## Fichiers et contrôles essentiels

- `index.html` et `js/config.js` : interface et chargement restreint au public ;
- `js/components/` : composants Vue 3 ;
- `biography_sources_data.js` : provenance bibliographique ;
- `service-worker.js` : cache public versionné ;
- `.github/workflows/validate-static.yml` : contrôles du dépôt ;
- `.github/workflows/athar-public-live.yml` : tests navigateur local et publié.

Pour évoluer : audit sans modification, changement minimal sur une branche, vérification des sources et tests avant/après fusion.
