from __future__ import annotations

import argparse
import csv
import io
import json
from collections import Counter
from pathlib import Path
from typing import Any

from corpus_priority_ingest import target_matches

ROOT = Path(__file__).resolve().parents[1]
RAG_DIR = ROOT / "rag"
RULES_PATH = RAG_DIR / "corpus_curation_rules.json"
TARGETS_PATH = RAG_DIR / "corpus_priority_targets.json"
DEFAULT_OUTPUT = RAG_DIR / "corpus_book_curation.json"
DEFAULT_REPORT = RAG_DIR / "corpus_curation_report.json"
DEFAULT_MARKDOWN = RAG_DIR / "CORPUS_CURATION.md"
PARSER_VERSION = "athar-openiti-reader-v2"


def load_json(path: Path, default: dict[str, Any] | None = None) -> dict[str, Any]:
    if not path.exists():
        return dict(default or {})
    payload = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(payload, dict):
        raise RuntimeError(f"{path.name} doit contenir un objet JSON.")
    return payload


def clean(value: Any) -> str:
    return " ".join(str(value or "").replace("\u00a0", " ").split()).strip()


def first_variant(value: Any) -> str:
    return clean(str(value or "").split("::", 1)[0])


def _raw_books() -> list[dict[str, Any]]:
    paths = [
        RAG_DIR / "openiti_books.json",
        RAG_DIR / "openiti_books_extra.json",
        RAG_DIR / "openiti_books_extra_40.json",
        RAG_DIR / "openiti_books_auto.json",
        RAG_DIR / "openiti_books_priority.json",
        RAG_DIR / "openiti_books_tafsir.json",
    ]
    books: list[dict[str, Any]] = []
    for path in paths:
        if not path.exists():
            continue
        payload = load_json(path)
        rows = payload.get("books") or []
        if not isinstance(rows, list):
            raise RuntimeError(f"{path.name} doit contenir une liste books.")
        for book in rows:
            if isinstance(book, dict) and book.get("enabled", True):
                item = dict(book)
                item["_manifest"] = path.name
                books.append(item)
    ids = [clean(book.get("book_id")) for book in books]
    uris = [clean(book.get("openiti_uri")) for book in books]
    if not all(ids) or len(ids) != len(set(ids)):
        raise RuntimeError("Identifiants OpenITI manquants ou dupliqués pendant la curation.")
    if not all(uris) or len(uris) != len(set(uris)):
        raise RuntimeError("URI OpenITI manquantes ou dupliquées pendant la curation.")
    return books


def metadata_indexes(metadata_text: str) -> tuple[dict[str, dict[str, str]], dict[str, list[dict[str, str]]]]:
    reader = csv.DictReader(io.StringIO(metadata_text), delimiter="\t")
    by_version: dict[str, dict[str, str]] = {}
    by_work: dict[str, list[dict[str, str]]] = {}
    for raw in reader:
        row = {str(key): clean(value) for key, value in raw.items() if key is not None}
        version_uri = row.get("version_uri", "")
        work_uri = row.get("book", "")
        if version_uri:
            by_version[version_uri] = row
        if work_uri:
            by_work.setdefault(work_uri, []).append(row)
    return by_version, by_work


def choose_metadata(
    book: dict[str, Any],
    by_version: dict[str, dict[str, str]],
    by_work: dict[str, list[dict[str, str]]],
) -> dict[str, str] | None:
    version_uri = clean(book.get("openiti_uri"))
    if version_uri in by_version:
        return by_version[version_uri]
    work_uri = clean(book.get("work_uri"))
    if not work_uri and version_uri:
        parts = version_uri.split(".")
        if len(parts) >= 2:
            work_uri = ".".join(parts[:2])
    rows = by_work.get(work_uri) or []
    if not rows:
        return None
    configured_path = clean(book.get("path"))
    rows = sorted(
        rows,
        key=lambda row: (
            configured_path and clean(row.get("local_path")) == configured_path,
            clean(row.get("status")).lower() == "pri",
            "CLEANED_VERSION" in clean(row.get("tags")).upper(),
            int(clean(row.get("char_length")) or 0) if clean(row.get("char_length")).isdigit() else 0,
            clean(row.get("version_uri")),
        ),
        reverse=True,
    )
    return rows[0]


def canonical(value: str, aliases: dict[str, Any]) -> str:
    clean_value = clean(value)
    if not clean_value:
        return ""
    direct = aliases.get(clean_value)
    if direct:
        return clean(direct)
    folded = clean_value.casefold()
    for source, target in aliases.items():
        if clean(source).casefold() == folded:
            return clean(target)
    return clean_value


def _reviewed_target(
    book: dict[str, Any],
    source: dict[str, str] | None,
    targets: list[dict[str, Any]],
) -> dict[str, Any] | None:
    """Return one unambiguous reviewed priority target for this exact work."""
    source = source or {}
    matches: list[dict[str, Any]] = []
    for target in targets:
        if not isinstance(target, dict) or not clean(target.get("madhhab")):
            continue
        if target_matches(
            target,
            clean(book.get("work_uri")) or clean(source.get("book")),
            clean(book.get("openiti_uri")) or clean(source.get("version_uri")),
            title=clean(book.get("title")) or first_variant(source.get("title_lat")),
            title_ar=clean(book.get("title_ar")) or first_variant(source.get("title_ar")),
            author=clean(book.get("author")) or first_variant(source.get("author_lat")),
            author_ar=first_variant(source.get("author_ar")),
        ):
            matches.append(target)
    if len(matches) == 1:
        return matches[0]
    if len(matches) > 1:
        identities = {(clean(row.get("madhhab")), clean(row.get("author")), clean(row.get("title"))) for row in matches}
        if len(identities) == 1:
            return matches[0]
    return None


def build_curation(
    metadata_text: str,
    *,
    books: list[dict[str, Any]] | None = None,
    rules: dict[str, Any] | None = None,
    targets_payload: dict[str, Any] | None = None,
) -> tuple[dict[str, Any], dict[str, Any], str]:
    books = books if books is not None else _raw_books()
    rules = rules or load_json(RULES_PATH)
    targets_payload = targets_payload if targets_payload is not None else load_json(TARGETS_PATH, {"targets": []})
    priority_targets = [
        row for row in targets_payload.get("targets") or []
        if isinstance(row, dict) and row.get("enabled", True)
    ]

    by_version, by_work = metadata_indexes(metadata_text)
    author_aliases = rules.get("author_aliases") if isinstance(rules.get("author_aliases"), dict) else {}
    discipline_aliases = rules.get("discipline_aliases") if isinstance(rules.get("discipline_aliases"), dict) else {}
    title_overrides = rules.get("title_overrides") if isinstance(rules.get("title_overrides"), dict) else {}

    curated: dict[str, Any] = {}
    stats = Counter()
    unresolved_madhhab: list[dict[str, str]] = []
    manifest_counts = Counter()

    for book in books:
        book_id = clean(book.get("book_id"))
        manifest_counts[clean(book.get("_manifest")) or "unknown"] += 1
        source = choose_metadata(book, by_version, by_work)
        metadata = book.get("metadata") if isinstance(book.get("metadata"), dict) else {}
        title_override = title_overrides.get(book_id) if isinstance(title_overrides.get(book_id), dict) else {}
        reviewed = _reviewed_target(book, source, priority_targets)

        title = clean(title_override.get("title")) or clean(book.get("title")) or (first_variant(source.get("title_lat")) if source else "")
        title_ar = clean(title_override.get("title_ar")) or clean(book.get("title_ar")) or (first_variant(source.get("title_ar")) if source else "")
        author_source = clean(book.get("author")) or (first_variant(source.get("author_lat")) if source else "") or (first_variant(source.get("author_ar")) if source else "")
        author = canonical(author_source, author_aliases)

        manifest_discipline = clean(book.get("discipline"))
        reviewed_discipline = clean((reviewed or {}).get("discipline"))
        discipline = canonical(manifest_discipline or reviewed_discipline, discipline_aliases)

        manifest_madhhab = clean(book.get("madhhab"))
        reviewed_madhhab = clean((reviewed or {}).get("madhhab"))
        madhhab = manifest_madhhab or reviewed_madhhab
        madhhab_status = (
            "explicit_manifest"
            if manifest_madhhab
            else "reviewed_priority_target"
            if reviewed_madhhab
            else "unresolved"
        )

        if title:
            stats["title"] += 1
        if title_ar:
            stats["title_ar"] += 1
        if author:
            stats["author"] += 1
        if discipline:
            stats["discipline"] += 1
        if madhhab:
            stats["madhhab"] += 1
        else:
            unresolved_madhhab.append({
                "book_id": book_id,
                "title": title,
                "author": author,
                "discipline": discipline,
                "reason": "aucune affiliation juridique explicitement documentée dans le manifeste ou la grille de priorités revue",
            })
        if madhhab_status == "reviewed_priority_target":
            stats["madhhab_from_priority_target"] += 1
        if source:
            stats["source_metadata_matched"] += 1
        else:
            stats["source_metadata_unmatched"] += 1

        classification_status = clean(metadata.get("classification_status"))
        if reviewed:
            classification_status = "reviewed_priority_target"
        elif not classification_status:
            classification_status = "reviewed_manifest" if book.get("_manifest") != "openiti_books_auto.json" else "automatic_metadata_hint"

        record = {
            "book_id": book_id,
            "title": title,
            "title_ar": title_ar,
            "author": author,
            "discipline": discipline,
            "madhhab": madhhab,
            "metadata": {
                "author_ar": first_variant(source.get("author_ar")) if source else clean(metadata.get("author_ar")),
                "date_ah": clean(source.get("date")) if source else clean(metadata.get("date_ah")),
                "source_id": clean(source.get("id")) if source else clean(metadata.get("source_id")),
                "source_char_length": (
                    int(clean(source.get("char_length")) or 0)
                    if source and clean(source.get("char_length")).isdigit()
                    else int(metadata.get("source_char_length") or 0)
                ),
                "source_token_length": (
                    int(clean(source.get("tok_length")) or 0)
                    if source and clean(source.get("tok_length")).isdigit()
                    else int(metadata.get("source_token_length") or 0)
                ),
                "source_tags": clean(source.get("tags")) if source else "",
                "curation": {
                    "phase": "quality-first-v1",
                    "bibliography_status": "openiti_metadata_matched" if source else "manifest_only",
                    "identity_status": "source_backed",
                    "discipline_status": classification_status,
                    "madhhab_status": madhhab_status,
                    "madhhab_reference_id": clean((reviewed or {}).get("id")),
                    "reader_structure_status": "structured_parser_v2",
                    "text_cleanup_version": PARSER_VERSION,
                    "source_manifest": clean(book.get("_manifest")),
                },
            },
        }
        curated[book_id] = record

    total = len(books)
    report = {
        "pipeline": "athar-corpus-curator-v2",
        "phase": "quality-first-v1",
        "parser_version": PARSER_VERSION,
        "books_reviewed": total,
        "manifest_counts": dict(sorted(manifest_counts.items())),
        "coverage": {
            "title": stats["title"],
            "title_ar": stats["title_ar"],
            "author": stats["author"],
            "discipline": stats["discipline"],
            "madhhab": stats["madhhab"],
            "madhhab_from_priority_target": stats["madhhab_from_priority_target"],
            "madhhab_unresolved": len(unresolved_madhhab),
            "source_metadata_matched": stats["source_metadata_matched"],
            "source_metadata_unmatched": stats["source_metadata_unmatched"],
        },
        "unresolved_madhhab": unresolved_madhhab,
        "principles": [
            "Aucune école juridique n'est déduite automatiquement du seul nom d'un auteur.",
            "Une école peut être renseignée depuis une cible éditoriale revue uniquement si l'ouvrage correspond sans ambiguïté par marqueur OpenITI ou paire auteur+titre.",
            "Les champs non documentés restent explicitement non résolus.",
            "Les marqueurs techniques sont nettoyés pour la lecture sans supprimer les nombres sémantiques du texte.",
        ],
    }
    overlay = {
        "version": 2,
        "phase": "quality-first-v1",
        "parser_version": PARSER_VERSION,
        "books_reviewed": total,
        "books": curated,
    }

    lines = [
        "# Curation du corpus Athar",
        "",
        "> Rapport généré à partir des manifestes Athar, de la grille de priorités revue et des métadonnées officielles OpenITI.",
        "",
        "## État",
        "",
        f"- **{total} ouvrages OpenITI** passés dans la chaîne de curation.",
        f"- Titre renseigné : **{stats['title']} / {total}**.",
        f"- Titre arabe renseigné : **{stats['title_ar']} / {total}**.",
        f"- Auteur renseigné : **{stats['author']} / {total}**.",
        f"- Discipline renseignée : **{stats['discipline']} / {total}**.",
        f"- Métadonnées OpenITI appariées : **{stats['source_metadata_matched']} / {total}**.",
        f"- Madhhab explicitement renseigné : **{stats['madhhab']} / {total}**.",
        f"- Dont madhhab restauré par cible auteur+titre revue : **{stats['madhhab_from_priority_target']}**.",
        f"- Madhhab restant non résolu : **{len(unresolved_madhhab)}**.",
        "",
        "## Principes de qualité",
        "",
        "- Athar n'invente pas un madhhab à partir du seul nom de l'auteur.",
        "- Une attribution issue de la grille savante exige un ouvrage identifié sans ambiguïté.",
        "- La lecture utilise le parseur structuré `athar-openiti-reader-v2`.",
        "- Les marqueurs OpenITI, balises HTML résiduelles et repères éditoriaux explicitement identifiés sont retirés de l'affichage.",
        "- Les nombres ayant un sens dans la source (hadith, verset, date, quantité, numéro cité dans le texte) sont conservés.",
        "",
        "## Madhhab à documenter",
        "",
    ]
    if unresolved_madhhab:
        lines.extend(
            f"- `{item['book_id']}` — **{item['title'] or 'Sans titre'}** — {item['author'] or 'auteur non renseigné'} — {item['discipline'] or 'discipline non renseignée'}"
            for item in unresolved_madhhab
        )
    else:
        lines.append("- Aucun.")
    lines.append("")
    return overlay, report, "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description="Produit l'overlay de curation bibliographique du corpus Athar.")
    parser.add_argument("--metadata", type=Path, required=True)
    parser.add_argument("--rules", type=Path, default=RULES_PATH)
    parser.add_argument("--targets", type=Path, default=TARGETS_PATH)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--report", type=Path, default=DEFAULT_REPORT)
    parser.add_argument("--markdown", type=Path, default=DEFAULT_MARKDOWN)
    args = parser.parse_args()

    metadata_text = args.metadata.read_text(encoding="utf-8-sig")
    overlay, report, markdown = build_curation(
        metadata_text,
        rules=load_json(args.rules),
        targets_payload=load_json(args.targets, {"targets": []}),
    )
    args.output.write_text(json.dumps(overlay, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    args.report.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    args.markdown.write_text(markdown + "\n", encoding="utf-8")
    print(json.dumps(report["coverage"], ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
