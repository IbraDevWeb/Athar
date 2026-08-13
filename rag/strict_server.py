from __future__ import annotations

import os
from pathlib import Path

from relevance import install

install()

if os.getenv("ATHAR_PREBUILT_CORPUS", "").strip().lower() in {"1", "true", "yes", "on"}:
    from install_hosted_corpus import install as install_corpus

    install_corpus(
        Path(os.getenv("ATHAR_DB_PATH") or "/tmp/athar_rag.sqlite"),
        fallback_starter=True,
    )

import server  # noqa: E402


if __name__ == "__main__":
    raise SystemExit(server.main())
