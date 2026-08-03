from __future__ import annotations

import sys

from ingest_kutub import main


if __name__ == "__main__":
    # Compatibilité avec les anciens lanceurs : sans sous-commande, le pipeline
    # exécute automatiquement `sync` avec un lot de 25 pages.
    raise SystemExit(main())
