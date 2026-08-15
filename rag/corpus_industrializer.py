from __future__ import annotations

import argparse
import hashlib
import json
from collections import defaultdict
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
RAG_DIR = ROOT / "rag"
POLICY_PATH = RAG_DIR / "corpus_policy.json"
AUTO_MANIFEST = RAG_DIR / "openiti_books_auto.json"
GROWTH_REPORT = RAG_DIR / "corpus_growth_report.json"
SUBJECT_ORDER = ("fiqh", "hadith", "tafsir", "usul", "aqida", "sira")


def load_json(path: Path, default: dict[str, Any] | None = None) -> dict[str, Any]:
    if not path.exists():
        return dict(default or {})
    payload = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(payload, dict):
        raise RuntimeError(f"{path.name} doit contenir un objet JSON.")
    return payload


def identity_manifests() -> list[Path]:
    return [path for path in sorted(RAG_DIR.glob("openiti_books*.json")) if path.name != AUTO_MANIFEST.name]


def configured_manifests() -> list[Path]:
    return [path for path in identity_manifests() if "tafsir" not in path.stem]


def configured_book_count() -> int:
    count = 0
    for path in configured_manifests():
        count += sum(1 for item in load_json(path).get("books") or [] if isinstance(item, dict) and item.get("enabled", True))
    return count


def existing_identity(auto_payload: dict[str, Any] | None = None) -> tuple[set[str], set[str], set[str]]:
    work_uris: set[str] = set()
    version_uris: set[str] = set()
    book_ids: set[str] = set()
    payloads = [load_json(path) for path in identity_manifests()]
    if auto_payload is None:
        auto_payload = load_json(AUTO_MANIFEST, {"books": []})
    payloads.append(auto_payload)
    for payload in payloads:
        for book in payload.get("books") or []:
            if not isinstance(book, dict):
                continue
            book_id = str(book.get("book_id") or "").strip()
            version_uri = str(book.get("openiti_uri") or "").strip()
            work_uri = str(book.get("work_uri") or "").strip()
            if not work_uri and version_uri:
                parts = version_uri.split(".")
                if len(parts) >= 2:
                    work_uri = ".".join(parts[:2])
            if book_id:
                book_ids.add(book_id)
            if version_uri:
                version_uris.add(version_uri)
            if work_uri:
                work_uris.add(work_uri)
    return work_uris, version_uris, book_ids


def stable_book_id(version_uri: str) -> str:
    digest = hashlib.sha1(version_uri.encode("utf-8")).hexdigest()[:16]
    return f"openiti-auto-{digest}"


def manifest_book(candidate: dict[str, Any], release_ref: str) -> dict[str, Any]:
    flags = [str(flag) for flag in candidate.get("quality_flags") or []]
    classification_status = str(candidate.get("classification_status") or "automatic_metadata_hint")
    return {
        "book_id": stable_book_id(str(candidate["version_uri"])),
        "kutub_id": None,
        "title": str(candidate.get("title") or candidate["work_uri"]),
        "title_ar": str(candidate.get("title_ar") or ""),
        "author": str(candidate.get("author") or ""),
        "discipline": str(candidate.get("discipline") or ""),
        "madhhab": "",
        "openiti_uri": str(candidate["version_uri"]),
        "work_uri": str(candidate["work_uri"]),
        "path": str(candidate["path"]),
        "quality_status": ",".join(flags) if flags else "OPENITI_RELEASE",
        "known_issues": "",
        "enabled": True,
        "metadata": {
            "source": "OpenITI",
            "source_release": release_ref,
            "catalogue_selection": "athar-corpus-industrializer-v2",
            "classification_status": classification_status,
            "classification_subject": str(candidate.get("subject") or ""),
            "classification_reason": str(candidate.get("classification_reason") or ""),
            "source_char_length": int(candidate.get("char_length") or 0),
            "source_token_length": int(candidate.get("token_length") or 0),
            "source_id": str(candidate.get("source_id") or ""),
            "date_ah": str(candidate.get("date_ah") or ""),
        },
    }


def _rank(candidate: dict[str, Any]) -> tuple[int, int, str]:
    flags = set(candidate.get("quality_flags") or [])
    quality = 100 * ("PRIMARY_VERSION" in flags) + 60 * ("CLEANED_VERSION" in flags) + 20 * ("NO_MAJOR_ISSUES" in flags)
    chars = min(int(candidate.get("char_length") or 0), 2_500_000)
    return quality + int(candidate.get("subject_score") or 0), chars, str(candidate.get("version_uri") or "")


def _auto_haystack(book: dict[str, Any]) -> str:
    metadata = book.get("metadata") if isinstance(book.get("metadata"), dict) else {}
    values = [
        book.get("title"),
        book.get("title_ar"),
        book.get("author"),
        book.get("openiti_uri"),
        book.get("work_uri"),
        book.get("path"),
        (metadata or {}).get("source_id"),
        (metadata or {}).get("classification_subject"),
    ]
    return " ".join(str(value or "") for value in values).casefold()


def _matches_work_marker(work_uri: str, marker: str) -> bool:
    value = str(marker or "").strip()
    if not value:
        return False
    work = str(work_uri or "").strip()
    if value.casefold() in work.casefold():
        return True
    compact_marker = "".join(character for character in value.casefold() if character.isalnum())
    compact_work = "".join(character for character in work.casefold() if character.isalnum())
    return bool(compact_marker and compact_marker in compact_work)


def discipline_override(book: dict[str, Any], promotion: dict[str, Any]) -> tuple[dict[str, Any], dict[str, str] | None]:
    """Apply an exact reviewed discipline correction without inventing madhhab metadata."""
    overrides = promotion.get("discipline_overrides") or {}
    if not isinstance(overrides, dict):
        return dict(book), None
    work_uri = str(book.get("work_uri") or "")
    for marker, raw_override in overrides.items():
        if not _matches_work_marker(work_uri, str(marker)) or not isinstance(raw_override, dict):
            continue
        subject = str(raw_override.get("subject") or "").strip()
        discipline = str(raw_override.get("discipline") or "").strip()
        if subject not in SUBJECT_ORDER or not discipline:
            continue
        normalized = dict(book)
        before = str(normalized.get("discipline") or "")
        normalized["subject"] = subject
        normalized["discipline"] = discipline
        normalized["classification_status"] = "reviewed_policy_override"
        normalized["classification_reason"] = str(raw_override.get("reason") or "").strip()
        metadata = dict(normalized.get("metadata") or {}) if isinstance(normalized.get("metadata"), dict) else {}
        if metadata or "metadata" in normalized:
            metadata["classification_subject"] = subject
            metadata["classification_status"] = "reviewed_policy_override"
            metadata["classification_reason"] = str(raw_override.get("reason") or "").strip()
            normalized["metadata"] = metadata
        return normalized, {
            "book_id": str(normalized.get("book_id") or ""),
            "work_uri": work_uri,
            "from": before,
            "to": discipline,
            "subject": subject,
            "reason": str(raw_override.get("reason") or "").strip(),
        }
    return dict(book), None


def existing_auto_rejection(book: dict[str, Any], promotion: dict[str, Any]) -> str:
    """Re-evaluate staged books when policy becomes stricter before approval."""
    haystack = _auto_haystack(book)
    for marker in promotion.get("excluded_source_markers") or []:
        value = str(marker or "").strip()
        if value and value.casefold() in haystack:
            return f"excluded_source:{value}"
    for marker in promotion.get("excluded_work_markers") or []:
        value = str(marker or "").strip()
        if value and value.casefold() in haystack:
            return f"excluded_work:{value}"
        if _matches_work_marker(str(book.get("work_uri") or ""), value):
            return f"excluded_work:{value}"
    return ""


def prune_existing_auto_books(
    books: list[dict[str, Any]],
    promotion: dict[str, Any],
) -> tuple[list[dict[str, Any]], list[dict[str, str]]]:
    kept: list[dict[str, Any]] = []
    removed: list[dict[str, str]] = []
    for book in books:
        normalized, _ = discipline_override(book, promotion)
        reason = existing_auto_rejection(normalized, promotion)
        if not reason:
            kept.append(normalized)
            continue
        removed.append(
            {
                "book_id": str(normalized.get("book_id") or ""),
                "title": str(normalized.get("title") or ""),
                "openiti_uri": str(normalized.get("openiti_uri") or ""),
                "reason": reason,
            }
        )
    return kept, removed


def select_batch(
    catalog: dict[str, Any],
    auto_payload: dict[str, Any],
    *,
    batch_size: int,
    char_budget: int,
    max_auto_books: int,
) -> list[dict[str, Any]]:
    work_uris, version_uris, _ = existing_identity(auto_payload)
    current_auto = [item for item in auto_payload.get("books") or [] if isinstance(item, dict)]
    remaining_slots = max(0, max_auto_books - len(current_auto))
    wanted = max(0, min(batch_size, remaining_slots))
    if wanted <= 0:
        return []

    groups: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for candidate in catalog.get("candidates") or []:
        if not isinstance(candidate, dict):
            continue
        version_uri = str(candidate.get("version_uri") or "")
        work_uri = str(candidate.get("work_uri") or "")
        if not version_uri or not work_uri or version_uri in version_uris or work_uri in work_uris:
            continue
        subject = str(candidate.get("subject") or "")
        if subject not in SUBJECT_ORDER:
            continue
        groups[subject].append(candidate)
    for subject in groups:
        groups[subject].sort(key=_rank, reverse=True)

    selected: list[dict[str, Any]] = []
    used_chars = 0
    cursors = {subject: 0 for subject in SUBJECT_ORDER}
    while len(selected) < wanted:
        progressed = False
        for subject in SUBJECT_ORDER:
            rows = groups.get(subject) or []
            index = cursors[subject]
            while index < len(rows):
                candidate = rows[index]
                index += 1
                cursors[subject] = index
                chars = int(candidate.get("char_length") or 0)
                if char_budget > 0 and used_chars + chars > char_budget:
                    continue
                selected.append(candidate)
                used_chars += chars
                progressed = True
                break
            if len(selected) >= wanted:
                break
        if not progressed:
            break
    return selected


def promote(
    catalog_path: Path,
    manifest_path: Path,
    report_path: Path,
    *,
    batch_size: int | None = None,
    dry_run: bool = False,
) -> dict[str, Any]:
    catalog = load_json(catalog_path)
    policy = load_json(POLICY_PATH)
    promotion = policy.get("promotion") or {}
    hosted = policy.get("hosted") or {}
    requested_input = int(batch_size if batch_size is not None else promotion.get("default_batch_size") or 8)
    requested_input = max(1, min(requested_input, int(promotion.get("max_batch_size") or 20)))
    char_budget = int(promotion.get("max_source_chars_per_batch") or 0)
    max_auto_books = int(promotion.get("max_auto_books") or 80)
    auto_payload = load_json(
        manifest_path,
        {
            "version": "2.0",
            "source": "OpenITI automatic promotion queue",
            "release_commit": str(catalog.get("release_ref") or ""),
            "books": [],
        },
    )
    raw_books = [item for item in auto_payload.get("books") or [] if isinstance(item, dict)]
    books, pruned = prune_existing_auto_books(raw_books, promotion)
    staged_overrides: list[dict[str, str]] = []
    for before, after in zip(raw_books, books):
        if str(before.get("book_id") or "") != str(after.get("book_id") or ""):
            continue
        if str(before.get("discipline") or "") != str(after.get("discipline") or ""):
            _, detail = discipline_override(before, promotion)
            if detail:
                staged_overrides.append(detail)

    base_books = configured_book_count()
    hosted_target = int(hosted.get("target_openiti_books") or 0)
    target_slots = max(0, hosted_target - base_books - len(books)) if hosted_target else requested_input
    requested = min(requested_input, target_slots)
    selected = select_batch(
        catalog,
        {**auto_payload, "books": books},
        batch_size=requested,
        char_budget=char_budget,
        max_auto_books=max_auto_books,
    )
    normalized_selected: list[dict[str, Any]] = []
    selected_overrides: list[dict[str, str]] = []
    for item in selected:
        normalized, detail = discipline_override(item, promotion)
        normalized_selected.append(normalized)
        if detail:
            selected_overrides.append(detail)
    promoted = [manifest_book(item, str(catalog.get("release_ref") or "")) for item in normalized_selected]
    next_payload = {
        "version": "2.0",
        "source": "OpenITI automatic promotion queue",
        "source_repository": "https://github.com/OpenITI/RELEASE",
        "release_commit": str(catalog.get("release_ref") or ""),
        "notice": "Sélection automatique limitée aux références savantes identifiées par les métadonnées OpenITI. Discipline = indice automatique ou correction documentaire explicitement revue ; madhhab laissé vide sans donnée explicite.",
        "books": [*books, *promoted],
    }
    report = {
        "pipeline": "athar-corpus-industrializer-v2",
        "source": "OpenITI/RELEASE",
        "release_ref": str(catalog.get("release_ref") or ""),
        "catalog_candidate_works": int(catalog.get("candidate_works") or 0),
        "configured_base_books": base_books,
        "hosted_target_openiti_books": hosted_target,
        "requested_batch": requested_input,
        "target_limited_batch": requested,
        "promoted_books": len(promoted),
        "promoted_source_chars": sum(int(item.get("char_length") or 0) for item in normalized_selected),
        "auto_manifest_books_before": len(raw_books),
        "auto_manifest_books_pruned": len(pruned),
        "auto_manifest_books_after": len(books) + len(promoted),
        "discipline_overrides_applied": [*staged_overrides, *selected_overrides],
        "pruned": pruned,
        "selected": [
            {
                "book_id": book["book_id"],
                "title": book["title"],
                "title_ar": book["title_ar"],
                "author": book["author"],
                "discipline": book["discipline"],
                "openiti_uri": book["openiti_uri"],
                "source_char_length": int((book.get("metadata") or {}).get("source_char_length") or 0),
            }
            for book in promoted
        ],
        "dry_run": bool(dry_run),
    }
    if not dry_run:
        manifest_path.parent.mkdir(parents=True, exist_ok=True)
        manifest_path.write_text(json.dumps(next_payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return report


def main() -> int:
    parser = argparse.ArgumentParser(description="Sélectionne le prochain lot OpenITI à intégrer dans Athar.")
    parser.add_argument("--catalog", type=Path, required=True)
    parser.add_argument("--manifest", type=Path, default=AUTO_MANIFEST)
    parser.add_argument("--report", type=Path, default=GROWTH_REPORT)
    parser.add_argument("--batch-size", type=int, default=None)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    report = promote(args.catalog, args.manifest, args.report, batch_size=args.batch_size, dry_run=args.dry_run)
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
