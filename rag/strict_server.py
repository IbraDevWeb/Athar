from __future__ import annotations

import os
import sys
from pathlib import Path

from relevance import install as install_relevance

install_relevance()

import server  # noqa: E402

TRUTHY = {"1", "true", "yes", "on"}
DB_PATH = Path(os.getenv("ATHAR_DB_PATH") or "/tmp/athar_rag.sqlite")


def env_flag(name: str, default: bool = False) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in TRUTHY


def prepare_full_corpus() -> dict[str, object] | None:
    if not env_flag("ATHAR_PREBUILT_CORPUS", False):
        return None
    from install_hosted_corpus import install as install_corpus
    os.environ["ATHAR_CORPUS_READY"] = "0"
    status = install_corpus(DB_PATH, fallback_starter=False)
    validated = status.get("validated", {}) if isinstance(status, dict) else {}
    release = status.get("release", {}) if isinstance(status, dict) else {}
    books = int(validated.get("books") or 0)
    chunks = int(validated.get("chunks") or 0)
    openiti_books = int(validated.get("openiti_books") or 0)
    minimum = int(release.get("min_openiti_books") or 0) if isinstance(release, dict) else 0
    if chunks <= 0 or (minimum and openiti_books < minimum):
        raise RuntimeError(
            "Le corpus complet n'a pas satisfait les garde-fous après installation: "
            f"{books} livre(s), {openiti_books} OpenITI, {chunks} passage(s), minimum {minimum}."
        )
    os.environ["ATHAR_CORPUS_READY"] = "1"
    os.environ["ATHAR_CORPUS_RELEASE_TAG"] = str(release.get("tag") or "")
    os.environ["ATHAR_CORPUS_OPENITI_BOOKS"] = str(openiti_books)
    os.environ["ATHAR_CORPUS_BOOKS"] = str(books)
    os.environ["ATHAR_CORPUS_CHUNKS"] = str(chunks)
    print(
        "[Corpus] base complète prête avant ouverture du serveur: "
        f"{books} livre(s), {openiti_books} OpenITI, {chunks} passage(s), "
        f"release {release.get('tag', '?')}.",
        flush=True,
    )
    return status


def main() -> int:
    try:
        prepare_full_corpus()
    except Exception as error:
        os.environ["ATHAR_CORPUS_READY"] = "0"
        print(f"[Corpus] impossible d'activer le corpus complet: {error}", file=sys.stderr, flush=True)
        return 2
    return server.main()


if __name__ == "__main__":
    raise SystemExit(main())
