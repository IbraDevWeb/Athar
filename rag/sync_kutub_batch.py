from __future__ import annotations

import sys

from ingest_kutub import main


if __name__ == "__main__":
    # Compatibilité avec les anciens lanceurs :
    # `sync_kutub_batch.py --batch-size 25` devient `ingest_kutub.py sync ...`.
    if len(sys.argv) == 1 or sys.argv[1] not in {'sync', 'status'}:
        sys.argv.insert(1, 'sync')
    raise SystemExit(main())
