from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

import requests

from core import content_hash, upsert_book, upsert_chunk, utc_now

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "rag" / "openiti_books.json"
HEADER_END = "#META#Header#End#"
PAGE_RE = re.compile(r"PageV(?P<volume>\d{2,3})P(?P<page>\d{3,5})(?P<side>[AB])?")
HEADING_RE = re.compile(r"^###\s+\|+\s*(.*)$")
SPACE_RE = re.compile(r"\s+")


def load_manifest() -> dict[str, Any]:
    return json.loads(MANIFEST.read_text(encoding="utf-8"))


def urls(manifest: dict[str, Any], book: dict[str, Any]) -> tuple[str, str]:
    commit = manifest["release_commit"]
    path = book["path"]
    raw = f"https://raw.githubusercontent.com/OpenITI/RELEASE/{commit}/{path}"
    page = f"https://github.com/OpenITI/RELEASE/blob/{commit}/{path}"
    return raw, page


def clean(value: str) -> str:
    value = re.sub(r"\bms\d+\b", " ", value, flags=re.I)
    value = value.replace(" %~% ", " — ").replace(" | ", " ")
    return SPACE_RE.sub(" ", value).strip()


def pieces(segment: str, inherited: str) -> tuple[list[tuple[str, str]], str]:
    heading = inherited
    result: list[tuple[str, str]] = []
    buffer: list[str] = []

    def flush() -> None:
        text = clean(" ".join(buffer))
        buffer.clear()
        if text:
            result.append((heading, text))

    for raw in segment.splitlines():
        line = raw.strip()
        if not line or line.startswith("#META#") or line == "######OpenITI#":
            continue
        match = HEADING_RE.match(line)
        if match:
            flush()
            heading = clean(match.group(1))[:500]
            continue
        if line.startswith("### "):
            flush()
            heading = clean(re.sub(r"^###\s+[^ ]*\s*", "", line))[:500]
            continue
        if line.startswith("~~"):
            line = line[2:].lstrip()
        elif line.startswith("# "):
            line = line[2:].lstrip()
        buffer.append(line)
    flush()
    return result, heading


def split_text(text: str, size: int = 1800, overlap: int = 220) -> list[str]:
    if len(text) <= size:
        return [text]
    out: list[str] = []
    start = 0
    while start < len(text):
        end = min(len(text), start + size)
        if end < len(text):
            cut = max(text.rfind(mark, start + size // 2, end) for mark in (". ", "؟ ", "؛ ", "! "))
            if cut > start:
                end = cut + 1
        out.append(text[start:end].strip())
        if end >= len(text):
            break
        start = max(start + 1, end - overlap)
    return [item for item in out if item]


def parse(text: str) -> list[dict[str, Any]]:
    body = text.split(HEADER_END, 1)[-1].replace("\r\n", "\n")
    markers = list(PAGE_RE.finditer(body))
    rows: list[dict[str, Any]] = []
    cursor = 0
    heading = ""
    seq = 0

    def append_segment(segment: str, volume: int | None, page: int | None, marker: str) -> None:
        nonlocal heading, seq
        parts, heading = pieces(segment, heading)
        for chapter, value in parts:
            for chunk in split_text(value):
                seq += 1
                rows.append({"seq": seq, "volume": volume, "page": page, "marker": marker, "chapter": chapter, "text": chunk})

    for marker in markers:
        append_segment(body[cursor:marker.start()], int(marker.group("volume")), int(marker.group("page")), marker.group(0))
        cursor = marker.end()
    if body[cursor:].strip():
        append_segment(body[cursor:], None, None, "")
    return rows


def fetch_text(raw_url: str) -> str:
    response = requests.get(raw_url, timeout=(10, 120), headers={"User-Agent": "AtharResearch/1.0"})
    response.raise_for_status()
    if len(response.content) > 32 * 1024 * 1024:
        raise RuntimeError("Fichier OpenITI supérieur à 32 MiB.")
    text = response.content.decode("utf-8-sig")
    if "######OpenITI#" not in text[:200]:
        raise RuntimeError("Signature OpenITI absente.")
    return text


def ingest_book(connection: Any, manifest: dict[str, Any], book: dict[str, Any], text: str) -> dict[str, int]:
    raw_url, source_url = urls(manifest, book)
    if not connection.execute("SELECT 1 FROM books WHERE id=?", (book["book_id"],)).fetchone():
        upsert_book(connection, {**book, "id": book["book_id"], "source_url": source_url, "metadata": {"source": "OpenITI", "license": manifest["license"]}})
    rows = parse(text)
    for row in rows:
        digest = content_hash(book["openiti_uri"], row["volume"], row["page"], row["seq"], row["text"])
        upsert_chunk(connection, {
            "id": f"openiti-{digest[:24]}", "book_id": book["book_id"], "page": row["page"],
            "chapter": row["chapter"], "text_ar": row["text"], "text_fr": "",
            "translation_status": "openiti_arabic_source", "source_url": source_url,
            "content_hash": digest, "scraped_at": utc_now(),
            "metadata": {"source": "OpenITI", "openiti_uri": book["openiti_uri"], "release_commit": manifest["release_commit"],
                         "license": manifest["license"], "license_url": manifest["license_url"], "volume": row["volume"],
                         "printed_page": row["page"], "page_marker": row["marker"], "quality_status": book.get("quality_status", ""),
                         "known_issues": book.get("known_issues", ""), "raw_source_url": raw_url}
        })
    connection.commit()
    pages = len({(row["volume"], row["page"]) for row in rows if row["page"] is not None})
    return {"chunks": len(rows), "pages": pages}
