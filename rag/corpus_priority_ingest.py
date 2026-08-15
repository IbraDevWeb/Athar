from __future__ import annotations

import argparse
import csv
import io
import json
import re
from pathlib import Path
from typing import Any

from openiti_catalog import fetch_metadata, quality_flags

ROOT = Path(__file__).resolve().parents[1]
RAG_DIR = ROOT / "rag"
TARGETS_PATH = RAG_DIR / "corpus_priority_targets.json"
POLICY_PATH = RAG_DIR / "corpus_policy.json"
DEFAULT_MANIFEST = RAG_DIR / "openiti_books_priority.json"
DEFAULT_REPORT = RAG_DIR / "corpus_priority_report.json"
ARA_VERSION_RE = re.compile(r"-ara\d+$", re.I)


def load_json(path: Path, default: dict[str, Any] | None = None) -> dict[str, Any]:
    if not path.exists():
        return dict(default or {})
    payload = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(payload, dict):
        raise RuntimeError(f"{path.name} doit contenir un objet JSON.")
    return payload


def clean(value: Any) -> str:
    return " ".join(str(value or "").replace("\u00a0", " ").split()).strip()


def as_bool(value: Any) -> bool:
    return clean(value).lower() in {"1", "true", "yes", "y"}


def as_int(value: Any) -> int:
    try:
        return max(0, int(clean(value) or 0))
    except ValueError:
        return 0


def first_variant(value: Any) -> str:
    return clean(str(value or "").split("::", 1)[0])


def target_matches(target: dict[str, Any], work_uri: str, version_uri: str) -> bool:
    haystack = f"{work_uri} {version_uri}".casefold()
    markers = [clean(item).casefold() for item in target.get("work_markers") or [] if clean(item)]
    return any(marker in haystack for marker in markers)


def source_blocked(row: dict[str, Any], markers: list[str]) -> str:
    haystack = " ".join(
        clean(row.get(key))
        for key in ("version_uri", "local_path", "id", "subcorpus")
    ).casefold()
    for marker in markers:
        if clean(marker).casefold() in haystack:
            return marker
    return ""


def candidate_rank(row: dict[str, Any]) -> tuple[int, int, str]:
    flags = set(quality_flags(clean(row.get("tags"))))
    score = (
        1000 * ("PRIMARY_VERSION" in flags)
        + 600 * ("CLEANED_VERSION" in flags)
        + 200 * ("NO_MAJOR_ISSUES" in flags)
        + 40 * ("PAGINATION" in flags)
    )
    chars = min(as_int(row.get("char_length")), 50_000_000)
    return score, chars, clean(row.get("version_uri"))


def parse_priority_candidates(
    metadata_text: str,
    targets: list[dict[str, Any]],
    *,
    excluded_source_markers: list[str],
    require_primary: bool = True,
    require_cleaned: bool = True,
    exclude_uncorrected_ocr: bool = True,
    max_chars: int = 0,
) -> dict[str, list[dict[str, Any]]]:
    reader = csv.DictReader(io.StringIO(metadata_text), delimiter="\t")
    fields = set(reader.fieldnames or [])
    required = {"version_uri", "language", "uncorrected_OCR", "status", "char_length", "local_path", "tags", "book"}
    missing = sorted(required - fields)
    if missing:
        raise RuntimeError("Colonnes OpenITI manquantes: " + ", ".join(missing))

    grouped: dict[str, list[dict[str, Any]]] = {str(target["id"]): [] for target in targets}
    for raw in reader:
        version_uri = clean(raw.get("version_uri"))
        work_uri = clean(raw.get("book"))
        if clean(raw.get("language")) != "ara" or not ARA_VERSION_RE.search(version_uri):
            continue
        if exclude_uncorrected_ocr and as_bool(raw.get("uncorrected_OCR")):
            continue
        if require_primary and clean(raw.get("status")).lower() != "pri":
            continue
        tags = clean(raw.get("tags"))
        flags = quality_flags(tags)
        if require_cleaned and "CLEANED_VERSION" not in flags:
            continue
        if source_blocked(raw, excluded_source_markers):
            continue
        char_length = as_int(raw.get("char_length"))
        if max_chars and char_length > max_chars:
            continue
        if not clean(raw.get("local_path")) or not work_uri:
            continue

        normalized = {
            "version_uri": version_uri,
            "work_uri": work_uri,
            "path": clean(raw.get("local_path")),
            "title": first_variant(raw.get("title_lat")) or work_uri.rsplit(".", 1)[-1],
            "title_ar": first_variant(raw.get("title_ar")),
            "author": first_variant(raw.get("author_lat")) or first_variant(raw.get("author_ar")),
            "author_ar": first_variant(raw.get("author_ar")),
            "date_ah": clean(raw.get("date")),
            "source_id": clean(raw.get("id")),
            "tags": tags,
            "quality_flags": flags,
            "char_length": char_length,
            "token_length": as_int(raw.get("tok_length")),
        }
        for target in targets:
            if target_matches(target, work_uri, version_uri):
                grouped[str(target["id"])].append(normalized)
    for rows in grouped.values():
        rows.sort(key=candidate_rank, reverse=True)
    return grouped


def _existing_books() -> list[dict[str, Any]]:
    paths = [
        RAG_DIR / "openiti_books.json",
        RAG_DIR / "openiti_books_extra.json",
        RAG_DIR / "openiti_books_extra_40.json",
        RAG_DIR / "openiti_books_auto.json",
        RAG_DIR / "openiti_books_tafsir.json",
    ]
    books: list[dict[str, Any]] = []
    for path in paths:
        payload = load_json(path, {"books": []})
        rows = payload.get("books") or []
        if isinstance(rows, list):
            books.extend(item for item in rows if isinstance(item, dict) and item.get("enabled", True))
    return books


def _existing_target(target: dict[str, Any], books: list[dict[str, Any]]) -> dict[str, Any] | None:
    for book in books:
        if target_matches(
            target,
            clean(book.get("work_uri")),
            clean(book.get("openiti_uri")),
        ):
            return book
    return None


def priority_book(target: dict[str, Any], candidate: dict[str, Any], release_ref: str) -> dict[str, Any]:
    flags = [str(flag) for flag in candidate.get("quality_flags") or []]
    target_id = clean(target["id"]).replace("_", "-")
    return {
        "book_id": f"openiti-priority-{target_id}",
        "kutub_id": None,
        "title": clean(target.get("title")) or clean(candidate.get("title")),
        "title_ar": clean(target.get("title_ar")) or clean(candidate.get("title_ar")),
        "author": clean(target.get("author")) or clean(candidate.get("author")),
        "discipline": clean(target.get("discipline")),
        "madhhab": clean(target.get("madhhab")),
        "openiti_uri": clean(candidate["version_uri"]),
        "work_uri": clean(candidate["work_uri"]),
        "path": clean(candidate["path"]),
        "quality_status": ",".join(flags) if flags else "OPENITI_RELEASE",
        "known_issues": "",
        "enabled": True,
        "metadata": {
            "source": "OpenITI",
            "source_release": release_ref,
            "catalogue_selection": "athar-priority-curation-v1",
            "classification_status": "reviewed_reference_checklist",
            "classification_subject": clean(target.get("subject")),
            "priority": clean(target.get("priority")) or "P1",
            "reference_id": clean(target.get("id")),
            "source_char_length": int(candidate.get("char_length") or 0),
            "source_token_length": int(candidate.get("token_length") or 0),
            "source_id": clean(candidate.get("source_id")),
            "date_ah": clean(candidate.get("date_ah")),
            "author_ar": clean(candidate.get("author_ar")),
            "curation_status": "priority_reviewed",
        },
    }


def build_priority_manifest(
    metadata_text: str,
    *,
    targets_payload: dict[str, Any] | None = None,
    policy: dict[str, Any] | None = None,
    existing_books: list[dict[str, Any]] | None = None,
    require_all: bool = True,
) -> tuple[dict[str, Any], dict[str, Any]]:
    targets_payload = targets_payload or load_json(TARGETS_PATH)
    policy = policy or load_json(POLICY_PATH)
    targets = [
        item for item in targets_payload.get("targets") or []
        if isinstance(item, dict) and str(item.get("priority") or "P1") == "P1"
    ]
    if not targets:
        raise RuntimeError("Aucune priorité P1 n'est configurée.")
    curation = policy.get("curation") or {}
    promotion = policy.get("promotion") or {}
    max_chars = int(curation.get("priority_max_source_chars_per_book") or 0)
    grouped = parse_priority_candidates(
        metadata_text,
        targets,
        excluded_source_markers=[str(item) for item in promotion.get("excluded_source_markers") or []],
        require_primary=bool(promotion.get("require_primary", True)),
        require_cleaned=bool(promotion.get("require_cleaned", True)),
        exclude_uncorrected_ocr=bool(promotion.get("exclude_uncorrected_ocr", True)),
        max_chars=max_chars,
    )

    configured = existing_books if existing_books is not None else _existing_books()
    release_ref = str(targets_payload.get("release_commit") or "")
    if not release_ref:
        from openiti_catalog import source_config
        release_ref = str(source_config().get("release_ref") or "")

    selected: list[dict[str, Any]] = []
    already_present: list[dict[str, str]] = []
    missing: list[dict[str, str]] = []
    for target in targets:
        target_id = str(target["id"])
        present = _existing_target(target, configured)
        if present:
            already_present.append({
                "id": target_id,
                "title": clean(target.get("title")),
                "book_id": clean(present.get("book_id")),
                "openiti_uri": clean(present.get("openiti_uri")),
            })
            continue
        candidates = grouped.get(target_id) or []
        if not candidates:
            missing.append({
                "id": target_id,
                "title": clean(target.get("title")),
                "reason": "aucune version OpenITI primaire/nettoyée admissible trouvée",
            })
            continue
        selected.append(priority_book(target, candidates[0], release_ref))

    manifest = {
        "version": "1.0",
        "source": "OpenITI priority curation",
        "source_repository": "https://github.com/OpenITI/RELEASE",
        "release_commit": release_ref,
        "notice": (
            "Ouvrages P1 explicitement sélectionnés depuis la grille éditoriale Athar. "
            "Le madhhab et la discipline proviennent de cette grille revue ; le texte provient d'une version OpenITI primaire/nettoyée."
        ),
        "books": selected,
    }
    report = {
        "pipeline": "athar-priority-curation-v1",
        "targets": len(targets),
        "already_present": already_present,
        "selected": [
            {
                "book_id": book["book_id"],
                "title": book["title"],
                "madhhab": book["madhhab"],
                "discipline": book["discipline"],
                "openiti_uri": book["openiti_uri"],
                "work_uri": book["work_uri"],
                "source_char_length": int((book.get("metadata") or {}).get("source_char_length") or 0),
            }
            for book in selected
        ],
        "missing": missing,
        "resolved": len(already_present) + len(selected),
    }
    if require_all and missing:
        names = ", ".join(item["title"] for item in missing)
        raise RuntimeError(f"Priorités P1 non résolues dans OpenITI: {names}")
    return manifest, report


def main() -> int:
    parser = argparse.ArgumentParser(description="Résout et prépare les priorités P1 Athar depuis les métadonnées OpenITI.")
    parser.add_argument("--metadata", type=Path, help="TSV OpenITI local. Sans ce paramètre, le TSV officiel est téléchargé.")
    parser.add_argument("--targets", type=Path, default=TARGETS_PATH)
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST)
    parser.add_argument("--report", type=Path, default=DEFAULT_REPORT)
    parser.add_argument("--allow-missing", action="store_true")
    args = parser.parse_args()

    metadata_text = args.metadata.read_text(encoding="utf-8-sig") if args.metadata else fetch_metadata()
    targets_payload = load_json(args.targets)
    manifest, report = build_priority_manifest(
        metadata_text,
        targets_payload=targets_payload,
        require_all=not args.allow_missing,
    )
    args.manifest.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    args.report.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
