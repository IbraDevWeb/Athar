# Athar Pro

Athar est une application web **pédagogique et non commerciale**, publiée comme site statique sur GitHub Pages.

## Sept rubriques publiques

- Bibliothèque : biographies, récits et références documentaires ;
- Frise Chrono : événements historiques ;
- Lexique : vocabulaire et définitions ;
- Hadiths : textes, références et lecture ;
- Tabib Al-Qulub : rappels spirituels ;
- Al-Adhkar : invocations ;
- Tasbih : compteur avec sauvegarde locale.

Le projet public n'utilise plus de RAG, d'index vectoriel, d'API d'intelligence artificielle ou de serveur Render.
Les modules pédagogiques encore en préparation peuvent rester dans le dépôt mais ne sont pas téléchargés par l'interface publique.

## Démarrage local

```bash
python -m http.server 8000
```

Ouvrir `http://localhost:8000`. Les données des sept rubriques sont des fichiers locaux `*_data.js`.
Les préférences et le compteur Tasbih sont conservés dans le navigateur de l'utilisateur.

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
