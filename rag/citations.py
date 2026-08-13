from __future__ import annotations

import re
from typing import Any

SPACE = re.compile(r"\s+")


def _clean(value: Any) -> str:
    return SPACE.sub(" ", str(value or "")).strip()


def _first(*values: Any) -> Any:
    for value in values:
        if value not in (None, "", [], {}):
            return value
    return None


def build_citation(item: dict[str, Any]) -> dict[str, Any]:
    metadata = item.get("metadata") if isinstance(item.get("metadata"), dict) else {}
    title = _clean(_first(item.get("title"), metadata.get("title"), "Ouvrage non renseigné"))
    author = _clean(_first(item.get("author"), metadata.get("author")))
    chapter = _clean(_first(item.get("chapter"), metadata.get("chapter"), metadata.get("chapter_title")))
    edition = _clean(_first(item.get("edition"), metadata.get("edition")))
    version = _clean(_first(metadata.get("version"), metadata.get("riwaya"), metadata.get("recension")))
    volume = _first(item.get("volume"), metadata.get("volume"), metadata.get("tome"))
    page_start = _first(metadata.get("printed_page"), metadata.get("page_start"), item.get("page"))
    page_end = _first(item.get("page_end"), metadata.get("page_end"), page_start)
    book_number = _first(metadata.get("book_number"), metadata.get("kitab_number"))
    chapter_number = _first(metadata.get("chapter_number"), metadata.get("bab_number"))
    hadith_number = _first(metadata.get("hadith_number"), metadata.get("report_number"))
    source_id = _clean(_first(metadata.get("source_id"), metadata.get("provider"), "unknown"))
    external_id = _clean(_first(metadata.get("external_id"), metadata.get("document_id"), item.get("book_id")))
    source_url = _clean(_first(item.get("source_url"), metadata.get("source_url")))

    parts = [title]
    if author:
        parts.append(author)
    if book_number:
        parts.append(f"livre {book_number}")
    if chapter_number:
        parts.append(f"chapitre {chapter_number}")
    elif chapter:
        parts.append(chapter)
    if hadith_number:
        parts.append(f"hadith {hadith_number}")
    if version:
        parts.append(version)
    if volume:
        parts.append(f"vol. {volume}")
    if page_start:
        page_label = str(page_start)
        if page_end not in (None, "", page_start):
            page_label += f"–{page_end}"
        parts.append(f"p. {page_label}")
    if edition:
        parts.append(edition)

    citation_key_parts = [source_id, external_id, str(volume or ""), str(page_start or ""), str(hadith_number or "")]
    citation_key = ":".join(part.replace(":", "-") for part in citation_key_parts if part)

    return {
        "key": citation_key or _clean(item.get("id")),
        "label": ", ".join(part for part in parts if part),
        "title": title,
        "author": author,
        "book_number": book_number,
        "chapter": chapter,
        "chapter_number": chapter_number,
        "hadith_number": hadith_number,
        "version": version,
        "edition": edition,
        "volume": volume,
        "page_start": page_start,
        "page_end": page_end,
        "source_id": source_id,
        "external_id": external_id,
        "source_url": source_url,
        "text_ar": item.get("text_ar") or "",
        "text_fr": item.get("text_fr") or "",
        "translation_status": item.get("translation_status") or "unknown",
        "verification_status": item.get("verification_status") or metadata.get("verification_status") or "unknown",
    }


def attach_citations(items: list[dict[str, Any]] | None) -> list[dict[str, Any]]:
    if not items:
        return []
    for item in items:
        item["citation"] = build_citation(item)
    return items
