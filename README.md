# Athar Pro

Athar Pro est une application web statique consacrée aux biographies, aux hadiths référencés et à différents outils d'étude de l'histoire islamique.

## Principes éditoriaux

- Une source affichée est une référence principale, pas une certification globale de chaque détail.
- Les variantes historiques doivent être signalées avec des formulations prudentes.
- Le degré d'un hadith concerne la transmission indiquée et ne s'étend pas automatiquement aux commentaires.
- Les contenus doivent pouvoir être corrigés à partir d'une référence précise.

La méthodologie complète est disponible dans [`methodologie.html`](./methodologie.html).

## Lancer le projet

Le projet peut être servi avec n'importe quel serveur HTTP statique :

```bash
python -m http.server 8000
```

Ouvrir ensuite `http://localhost:8000`.

## Architecture

- `index.html` : structure principale et chargement des modules.
- `js/components/` : vues Vue 3.
- `*_data.js` : jeux de données éditoriaux.
- `css/style.css` : styles complémentaires.
- `service-worker.js` : cache hors ligne des ressources du même domaine.

## Contribution

Une correction éditoriale doit inclure :

1. le passage concerné ;
2. la correction proposée ;
3. la référence exacte ;
4. le niveau de certitude ou la divergence éventuelle.
