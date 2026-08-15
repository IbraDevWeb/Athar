from __future__ import annotations

import argparse
import json
from collections import Counter
from pathlib import Path
from typing import Any

from ingest_openiti import load_industrialized_manifest

ROOT = Path(__file__).resolve().parents[1]
RAG_DIR = ROOT / "rag"
POLICY_PATH = RAG_DIR / "corpus_policy.json"
TAFSIR_PATH = RAG_DIR / "openiti_books_tafsir.json"
DEFAULT_OUTPUT = RAG_DIR / "corpus_shards.json"


def load_json(path: Path) -> dict[str, Any]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(payload, dict):
        raise RuntimeError(f"{path.name} doit contenir un objet JSON.")
    return payload


def load_shardable_manifest() -> dict[str, Any]:
    """Return every OpenITI book that must be routed to a production shard.

    The historical ingestion pipeline keeps the dedicated tafsir batch separate
    from the industrial queue. Sharded production cannot leave those books
    outside the routing table, so they are appended deterministically after the
    industrial manifest. Existing assignments therefore remain stable.
    """
    manifest = load_industrialized_manifest()
    books = [book for book in manifest.get("books") or [] if isinstance(book, dict)]
    if TAFSIR_PATH.exists():
        tafsir = load_json(TAFSIR_PATH)
        extra = tafsir.get("books") or []
        if not isinstance(extra, list):
            raise RuntimeError("openiti_books_tafsir.json doit contenir une liste books.")
        books.extend(book for book in extra if isinstance(book, dict))

    ids = [str(book.get("book_id") or "").strip() for book in books]
    uris = [str(book.get("openiti_uri") or "").strip() for book in books]
    if not all(ids) or len(ids) != len(set(ids)):
        raise RuntimeError("Identifiants OpenITI shardables manquants ou dupliqués.")
    if not all(uris) or len(uris) != len(set(uris)):
        raise RuntimeError("URI OpenITI shardables manquants ou dupliqués.")
    manifest["books"] = books
    manifest["shardable_supplement"] = str(TAFSIR_PATH.relative_to(ROOT)) if TAFSIR_PATH.exists() else ""
    return manifest


def _source_chars(book: dict[str, Any]) -> int:
    metadata = book.get("metadata") if isinstance(book.get("metadata"), dict) else {}
    try:
        return max(0, int((metadata or {}).get("source_char_length") or 0))
    except (TypeError, ValueError):
        return 0


def _subject(book: dict[str, Any]) -> str:
    metadata = book.get("metadata") if isinstance(book.get("metadata"), dict) else {}
    hinted = str((metadata or {}).get("classification_subject") or "").strip().lower()
    if hinted:
        return hinted
    discipline = str(book.get("discipline") or "").strip().lower()
    for key, markers in {
        "fiqh": ("fiqh", "jurisprud"),
        "hadith": ("hadith", "ḥadī"),
        "tafsir": ("tafs", "exég", "exeg"),
        "usul": ("uṣūl", "usul", "qawā", "qawa"),
        "aqida": ("aqī", "aqid", "ʿaq"),
        "sira": ("sīra", "sira", "histoire", "biograph"),
    }.items():
        if any(marker in discipline for marker in markers):
            return key
    return "other"


def _clean_books(books: list[dict[str, Any]]) -> list[dict[str, Any]]:
    enabled = [book for book in books if isinstance(book, dict) and book.get("enabled", True)]
    ids = [str(book.get("book_id") or "").strip() for book in enabled]
    if not all(ids):
        raise RuntimeError("Le registre de shards exige un book_id pour chaque ouvrage actif.")
    if len(ids) != len(set(ids)):
        raise RuntimeError("Le registre de shards refuse les book_id dupliqués.")
    return enabled


def plan_shards(
    books: list[dict[str, Any]],
    *,
    max_books_per_shard: int,
    max_source_chars_per_shard: int,
) -> list[dict[str, Any]]:
    """Build deterministic append-friendly shards from manifest order.

    Existing assignments stay stable as long as the manifest is append-only. A
    single source larger than the character budget is accepted in its own shard
    and flagged instead of being silently split across bibliographic identity.
    """
    max_books = max(1, int(max_books_per_shard))
    max_chars = max(0, int(max_source_chars_per_shard))
    rows = _clean_books(books)
    shards: list[dict[str, Any]] = []
    current: list[dict[str, Any]] = []
    current_chars = 0

    def flush() -> None:
        nonlocal current, current_chars
        if not current:
            return
        index = len(shards) + 1
        subjects = Counter(_subject(book) for book in current)
        book_rows = [
            {
                "book_id": str(book["book_id"]),
                "title": str(book.get("title") or ""),
                "title_ar": str(book.get("title_ar") or ""),
                "author": str(book.get("author") or ""),
                "discipline": str(book.get("discipline") or ""),
                "source_chars": _source_chars(book),
            }
            for book in current
        ]
        shards.append(
            {
                "id": f"openiti-{index:03d}",
                "book_count": len(book_rows),
                "source_chars": current_chars,
                "oversize_source": bool(max_chars and any(row["source_chars"] > max_chars for row in book_rows)),
                "subjects": dict(sorted(subjects.items())),
                "books": book_rows,
            }
        )
        current = []
        current_chars = 0

    for book in rows:
        chars = _source_chars(book)
        exceeds_count = len(current) >= max_books
        exceeds_chars = bool(current and max_chars and current_chars + chars > max_chars)
        if exceeds_count or exceeds_chars:
            flush()
        current.append(book)
        current_chars += chars
        if max_chars and chars > max_chars:
            flush()
    flush()
    return shards


def build_registry(
    manifest: dict[str, Any],
    policy: dict[str, Any],
) -> dict[str, Any]:
    books = _clean_books([book for book in manifest.get("books") or [] if isinstance(book, dict)])
    sharding = policy.get("sharding") if isinstance(policy.get("sharding"), dict) else {}
    hosted = policy.get("hosted") if isinstance(policy.get("hosted"), dict) else {}
    max_books = int((sharding or {}).get("max_books_per_shard") or 40)
    max_chars = int((sharding or {}).get("max_source_chars_per_shard") or 40_000_000)
    shards = plan_shards(
        books,
        max_books_per_shard=max_books,
        max_source_chars_per_shard=max_chars,
    )
    mapping: dict[str, str] = {}
    for shard in shards:
        for book in shard["books"]:
            mapping[str(book["book_id"])] = str(shard["id"])
    hosted_target = int(
        (hosted or {}).get("expected_openiti_books_after_tafsir")
        or (hosted or {}).get("target_openiti_books")
        or 0
    )
    return {
        "version": 2,
        "strategy": "append-friendly-manifest-order-v1",
        "source": "Athar OpenITI industrial + dedicated manifests",
        "release_ref": str(manifest.get("release_commit") or ""),
        "total_books": len(books),
        "total_shards": len(shards),
        "hosted_target_openiti_books": hosted_target,
        "future_target_books": int((sharding or {}).get("future_target_books") or 500),
        "limits": {
            "max_books_per_shard": max_books,
            "max_source_chars_per_shard": max_chars,
        },
        "shards": shards,
        "book_to_shard": mapping,
    }


def generate(output: Path = DEFAULT_OUTPUT) -> dict[str, Any]:
    manifest = load_shardable_manifest()
    policy = load_json(POLICY_PATH)
    registry = build_registry(manifest, policy)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(registry, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return registry


def main() -> int:
    parser = argparse.ArgumentParser(description="Planifie les shards OpenITI du corpus Athar.")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()
    output = args.output if args.output.is_absolute() else ROOT / args.output
    registry = generate(output)
    print(
        json.dumps(
            {
                "output": str(output),
                "books": registry["total_books"],
                "shards": registry["total_shards"],
                "future_target_books": registry["future_target_books"],
            },
            ensure_ascii=False,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
