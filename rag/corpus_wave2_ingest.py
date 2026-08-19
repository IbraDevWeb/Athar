from __future__ import annotations

import argparse
import json
from collections import Counter
from pathlib import Path
from typing import Any

from corpus_priority_ingest import clean, load_json, parse_priority_candidates, priority_book, target_matches
from openiti_catalog import fetch_metadata

ROOT = Path(__file__).resolve().parents[1]
RAG = ROOT / "rag"
INDEX = RAG / "corpus_wave2_targets.json"
BASE_TARGETS = RAG / "corpus_priority_targets.json"
POLICY = RAG / "corpus_policy.json"
PRIORITY_MANIFEST = RAG / "openiti_books_priority.json"
REPORT = RAG / "corpus_wave2_report.json"

SOURCE_MANIFESTS = (
    "openiti_books.json",
    "openiti_books_extra.json",
    "openiti_books_extra_40.json",
    "openiti_books_auto.json",
    "openiti_books_priority.json",
    "openiti_books_tafsir.json",
)


def load_wave2(index_path: Path = INDEX) -> tuple[dict[str, Any], list[dict[str, Any]]]:
    index = load_json(index_path)
    files = index.get("files") or []
    rows: list[dict[str, Any]] = []
    for name in files:
        payload = load_json(index_path.parent / str(name))
        expected = int(payload.get("target_count") or 0)
        targets = [row for row in payload.get("targets") or [] if isinstance(row, dict)]
        if expected != len(targets):
            raise RuntimeError(f"{name}: target_count={expected}, lignes={len(targets)}")
        rows.extend(targets)
    if len(rows) != int(index.get("target_count") or 0):
        raise RuntimeError("Le total P3 ne correspond pas à l'index Wave 2.")
    ids = [clean(row.get("id")) for row in rows]
    if not all(ids) or len(ids) != len(set(ids)):
        raise RuntimeError("Identifiants P3 manquants ou dupliqués.")
    for row in rows:
        if clean(row.get("priority")).upper() != "P3" or row.get("required") is not False:
            raise RuntimeError(f"Cible P3 invalide: {row.get('id')}")
        if not clean(row.get("source_type")) or not clean(row.get("author_target_id")):
            raise RuntimeError(f"Métadonnées Wave 2 incomplètes: {row.get('id')}")
        direct = bool(row.get("work_markers"))
        paired = bool(row.get("author_markers")) and bool(row.get("title_markers"))
        if not (direct or paired):
            raise RuntimeError(f"Preuve bibliographique insuffisante: {row.get('id')}")
    return index, rows


def configured_books(*, drop_old_p3: bool = True) -> list[dict[str, Any]]:
    books: list[dict[str, Any]] = []
    for name in SOURCE_MANIFESTS:
        path = RAG / name
        if not path.exists():
            continue
        payload = load_json(path, {"books": []})
        for row in payload.get("books") or []:
            if not isinstance(row, dict) or not row.get("enabled", True):
                continue
            priority = clean((row.get("metadata") or {}).get("priority")) if isinstance(row.get("metadata"), dict) else ""
            if drop_old_p3 and name == "openiti_books_priority.json" and priority.upper() == "P3":
                continue
            books.append(row)
    return books


def existing_target(target: dict[str, Any], books: list[dict[str, Any]]) -> dict[str, Any] | None:
    for book in books:
        metadata = book.get("metadata") if isinstance(book.get("metadata"), dict) else {}
        if target_matches(
            target,
            clean(book.get("work_uri")),
            clean(book.get("openiti_uri")),
            title=clean(book.get("title")),
            title_ar=clean(book.get("title_ar")),
            author=clean(book.get("author")),
            author_ar=clean(metadata.get("author_ar")),
        ):
            return book
    return None


def build_wave2(
    metadata_text: str,
    *,
    index_path: Path = INDEX,
    policy: dict[str, Any] | None = None,
    existing: list[dict[str, Any]] | None = None,
    priority_manifest: dict[str, Any] | None = None,
) -> tuple[dict[str, Any], dict[str, Any], dict[str, Any]]:
    index, targets = load_wave2(index_path)
    policy = policy or load_json(POLICY)
    promotion = policy.get("promotion") or {}
    curation = policy.get("curation") or {}
    grouped = parse_priority_candidates(
        metadata_text,
        targets,
        excluded_source_markers=[str(item) for item in promotion.get("excluded_source_markers") or []],
        require_primary=bool(promotion.get("require_primary", True)),
        require_cleaned=bool(promotion.get("require_cleaned", True)),
        exclude_uncorrected_ocr=bool(promotion.get("exclude_uncorrected_ocr", True)),
        max_chars=int(curation.get("priority_max_source_chars_per_book") or 0),
    )
    existing = configured_books() if existing is None else existing
    selected: list[dict[str, Any]] = []
    present: list[dict[str, Any]] = []
    missing: list[dict[str, Any]] = []
    release = clean(index.get("release_commit"))

    for target in targets:
        found = existing_target(target, existing)
        if found:
            present.append({
                "id": target["id"], "title": target["title"], "madhhab": target["madhhab"],
                "source_type": target["source_type"], "book_id": clean(found.get("book_id")),
                "openiti_uri": clean(found.get("openiti_uri")),
            })
            continue
        candidates = grouped.get(str(target["id"])) or []
        if not candidates:
            missing.append({
                "id": target["id"], "title": target["title"], "madhhab": target["madhhab"],
                "source_type": target["source_type"],
                "reason": "aucune version OpenITI primaire/nettoyée admissible trouvée",
            })
            continue
        book = priority_book(target, candidates[0], release)
        book["metadata"] = {
            **(book.get("metadata") or {}),
            "priority": "P3",
            "corpus_wave": "wave2",
            "source_type": clean(target.get("source_type")),
            "author_target_id": clean(target.get("author_target_id")),
        }
        selected.append(book)

    base = priority_manifest if priority_manifest is not None else load_json(PRIORITY_MANIFEST, {"books": []})
    base_books = []
    for book in base.get("books") or []:
        if not isinstance(book, dict):
            continue
        meta = book.get("metadata") if isinstance(book.get("metadata"), dict) else {}
        if clean(meta.get("priority")).upper() != "P3":
            base_books.append(book)
    combined = base_books + selected
    ids = [clean(row.get("book_id")) for row in combined]
    uris = [clean(row.get("openiti_uri")) for row in combined]
    if not all(ids) or len(ids) != len(set(ids)) or not all(uris) or len(uris) != len(set(uris)):
        raise RuntimeError("La fusion P1/P2/P3 produirait un doublon de livre ou d'URI.")

    out_manifest = {
        **base,
        "version": "2.1",
        "notice": (
            "P1 obligatoire, P2 extension savante équilibrée, P3 Wave 2 appliquée. "
            "Les P3 ne sont ajoutés que si OpenITI fournit une version arabe primaire/nettoyée résolue sans ambiguïté."
        ),
        "books": combined,
    }
    resolved = present + [
        {"id": (b.get("metadata") or {}).get("reference_id"), "title": b["title"], "madhhab": b["madhhab"],
         "source_type": (b.get("metadata") or {}).get("source_type"), "book_id": b["book_id"], "openiti_uri": b["openiti_uri"]}
        for b in selected
    ]
    by_school = Counter(str(row.get("madhhab")) for row in resolved)
    new_by_school = Counter(str(row.get("madhhab")) for row in selected)
    types = Counter(str(row.get("source_type")) for row in resolved)
    report = {
        "pipeline": "athar-wave2-p3-v1",
        "targets": len(targets),
        "resolved_targets": len(resolved),
        "already_present": present,
        "new_books": len(selected),
        "selected": [
            {"book_id": b["book_id"], "reference_id": (b.get("metadata") or {}).get("reference_id"),
             "title": b["title"], "madhhab": b["madhhab"], "source_type": (b.get("metadata") or {}).get("source_type"),
             "openiti_uri": b["openiti_uri"], "source_char_length": int((b.get("metadata") or {}).get("source_char_length") or 0)}
            for b in selected
        ],
        "missing": missing,
        "resolved_by_madhhab": dict(sorted(by_school.items())),
        "new_books_by_madhhab": dict(sorted(new_by_school.items())),
        "resolved_source_types": dict(sorted(types.items())),
    }
    base_targets = load_json(BASE_TARGETS, {"targets": []})
    merged_targets = {
        **base_targets,
        "version": 3,
        "notice": "Cibles P1/P2 et P3 Wave 2 réunies uniquement pour la curation bibliographique.",
        "targets": [row for row in base_targets.get("targets") or [] if isinstance(row, dict)] + targets,
    }
    return out_manifest, report, merged_targets


def main() -> int:
    parser = argparse.ArgumentParser(description="Résout et fusionne la Vague 2 P3 du corpus savant Athar.")
    parser.add_argument("--metadata", type=Path)
    parser.add_argument("--index", type=Path, default=INDEX)
    parser.add_argument("--manifest", type=Path, default=PRIORITY_MANIFEST)
    parser.add_argument("--report", type=Path, default=REPORT)
    parser.add_argument("--combined-targets", type=Path)
    args = parser.parse_args()
    metadata = args.metadata.read_text(encoding="utf-8-sig") if args.metadata else fetch_metadata()
    manifest, report, merged_targets = build_wave2(metadata, index_path=args.index)
    args.manifest.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    args.report.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    if args.combined_targets:
        args.combined_targets.write_text(json.dumps(merged_targets, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
