from __future__ import annotations

import os
import threading
from pathlib import Path

from relevance import install

install()

import server  # noqa: E402

FALLBACK_DB = Path(os.getenv("ATHAR_DB_PATH") or "/tmp/athar_rag.sqlite")
FULL_DB = FALLBACK_DB.with_name(f"{FALLBACK_DB.stem}.full{FALLBACK_DB.suffix}")
ACTIVE_DB_ENV = "ATHAR_ACTIVE_DB_PATH"
os.environ[ACTIVE_DB_ENV] = str(FALLBACK_DB)


def _active_db_path(handler: object) -> Path:
    active = str(os.getenv(ACTIVE_DB_ENV) or "").strip()
    if active:
        return Path(active)
    return Path(getattr(getattr(handler, "server", object()), "db_path", FALLBACK_DB))


server.AtharRagHandler.db_path = property(_active_db_path)


def _load_full_corpus() -> None:
    try:
        from install_hosted_corpus import install as install_corpus

        status = install_corpus(FULL_DB, fallback_starter=False)
        os.environ[ACTIVE_DB_ENV] = str(FULL_DB)
        validated = status.get("validated", {}) if isinstance(status, dict) else {}
        print(
            "[Corpus] base complète activée : "
            f"{validated.get('books', '?')} livre(s), "
            f"{validated.get('openiti_books', '?')} OpenITI, "
            f"{validated.get('chunks', '?')} passage(s).",
            flush=True,
        )
    except Exception as error:
        print(
            f"[Corpus] chargement complet différé en échec : {error}. "
            "Le serveur reste disponible avec le corpus de secours.",
            flush=True,
        )


if os.getenv("ATHAR_PREBUILT_CORPUS", "").strip().lower() in {"1", "true", "yes", "on"}:
    threading.Thread(target=_load_full_corpus, name="athar-corpus-loader", daemon=True).start()


if __name__ == "__main__":
    raise SystemExit(server.main())
