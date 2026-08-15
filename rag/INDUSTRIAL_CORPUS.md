# Athar — Corpus industriel

## Objectif

Athar ne doit plus dépendre d'un unique fichier SQLite toujours plus gros. Le palier actuel sert de transition vers une bibliothèque de plusieurs centaines puis milliers d'ouvrages.

## Palier 100

Le noyau hébergé reste temporairement un SQLite unique, borné à 3 Gio :

- 95 ouvrages OpenITI dans le noyau industriel ;
- 5 tafsirs dédiés ;
- 100 ouvrages OpenITI attendus avant publication ;
- aucune publication si le manifeste automatique n'est pas explicitement approuvé ;
- aucune publication si le budget de taille est dépassé.

Ce palier donne immédiatement davantage de contenu au RAG et au lecteur sans changer le contrat public actuel.

## Registre de shards

`corpus_shards.py` produit `corpus_shards.json` à partir du manifeste OpenITI actif. Le registre :

- attribue chaque `book_id` à un shard déterministe ;
- conserve l'ordre du manifeste afin que l'ajout en fin de file ne déplace pas les ouvrages existants ;
- limite le nombre d'ouvrages et le volume source estimé par shard ;
- conserve titre, titre arabe, auteur, discipline et estimation de taille ;
- expose un mapping `book_to_shard` pour le futur routeur de lecture/recherche.

Un ouvrage exceptionnellement plus gros que le budget n'est jamais découpé silencieusement entre deux identités bibliographiques : il occupe son propre shard et est marqué `oversize_source`.

## Croissance après 100

Le SQLite monolithique ne doit plus être agrandi après le palier 100. La suite du pipeline devra publier des assets de corpus par shard et router :

1. catalogue global léger ;
2. lecture directe d'un ouvrage vers son shard ;
3. recherche RAG vers les shards pertinents ;
4. cache borné des shards côté serveur ;
5. provenance et statut linguistique conservés passage par passage.

Le paramètre `future_target_books` est fixé à 500 comme prochain objectif architectural, sans prétendre que 500 ouvrages sont déjà publiés.

## Sources

OpenITI reste la source automatisable principale pour le texte arabe. Kutub reste configuré avec `respect_robots` : aucune restriction technique de leur site n'est contournée. Les traductions françaises ne sont jamais fabriquées par le pipeline de corpus.
