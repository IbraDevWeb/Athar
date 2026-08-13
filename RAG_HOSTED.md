# Backend RAG hébergé

Athar peut désormais utiliser la Bibliothèque Savante depuis GitHub Pages sans lancer Python sur le poste du visiteur.

## Architecture

```text
GitHub Pages
https://ibradevweb.github.io/Athar/
        |
        | HTTPS / CORS
        v
Backend RAG
https://athar-rag-ibradevweb.onrender.com
        |
        v
SQLite + corpus Athar
```

Le frontend continue aussi de fonctionner en local. Sur `localhost`, `RagApiBridge.js` cherche d'abord le serveur lancé par `rag/launcher.py`. Sur une page publique, il lit `rag/remote.json` puis redirige uniquement les appels `/api/rag/...` vers le backend HTTPS configuré.

## Déployer sur Render

Le fichier `render.yaml` décrit le service `athar-rag-ibradevweb`.

1. Fusionner la branche contenant cette architecture dans `main`.
2. Dans Render, créer un nouveau **Blueprint** depuis le dépôt `IbraDevWeb/Athar`.
3. Render détecte `render.yaml` et crée le web service Python.
4. Vérifier que l'URL publique attribuée est `https://athar-rag-ibradevweb.onrender.com`.
5. Si Render attribue un autre sous-domaine, modifier uniquement `origin` dans `rag/remote.json`.
6. Attendre que `/healthz` soit vert puis tester `/api/rag/v2/status`.
7. Recharger GitHub Pages. Aucun serveur Python local n'est alors nécessaire.

## Sécurité

Le mode `--api-only` empêche le serveur public de servir `README.md`, la base SQLite, le code Python ou les autres fichiers du dépôt. Seules les routes API RAG et `/healthz` sont exposées.

Les requêtes cross-origin sont autorisées pour `https://ibradevweb.github.io` et pour les origines supplémentaires déclarées dans `ATHAR_CORS_ORIGINS`. Les origines locales restent autorisées pour le développement.

## Variables d'environnement

- `PORT` : port fourni par l'hébergeur.
- `ATHAR_HOST` : hôte d'écoute, optionnel.
- `ATHAR_API_ONLY=1` : active le mode API publique.
- `ATHAR_CORS_ORIGINS` : liste d'origines HTTPS séparées par des virgules.
- `ATHAR_DB_PATH` : emplacement de la base SQLite.

## Corpus au démarrage

À chaque démarrage, le serveur initialise la base si nécessaire puis réimporte de façon idempotente `rag/starter_corpus.json`. Un redéploiement ne fait donc pas disparaître le corpus de démonstration livré avec le dépôt.

## Limite du plan Render gratuit

Le `render.yaml` utilise volontairement `plan: free` pour permettre de tester l'architecture sans engager automatiquement de coût. Sur ce plan, la base SQLite placée dans `/tmp` n'est pas un stockage durable pour les futures ingestions massives.

Quand Athar commencera à héberger les centaines ou milliers de livres de la vraie bibliothèque, il faudra déplacer le corpus vers un stockage persistant adapté (disque persistant ou base dédiée) et ne plus considérer le SQLite éphémère comme la source maîtresse.
