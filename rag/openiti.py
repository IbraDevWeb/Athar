from __future__ import annotations

import html
import json
import re
import sqlite3
from pathlib import Path
from typing import Any
from urllib.parse import quote

import requests

from core import content_hash, normalize_text, upsert_book, utc_now

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "rag" / "openiti_books.json"
EXTRA_MANIFESTS = [ROOT / "rag" / "openiti_books_extra.json", ROOT / "rag" / "openiti_books_extra_40.json"]
HEADER_END = "#META#Header#End#"
PAGE_RE = re.compile(r"PageV(?P<volume>\d{2,3})P(?P<page>\d{3,5})(?P<side>[AB])?")
HEADING_RE = re.compile(r"^###\s+(?P<pipes>\|+)\s*(?P<title>.*)$")
SPACE_RE = re.compile(r"\s+")
HTML_TAG_RE = re.compile(r"<[^>\n]{1,300}>")
BRACKETED_PAGE_RE = re.compile(r"\[\s*(?:ص|صفحة|page)\s*[:：]?\s*[\d٠-٩]+\s*\]", re.I)
CONTROL_PAGE_RE = re.compile(r"\bPageV\d{2,3}P\d{3,5}[AB]?\b")
ZERO_WIDTH_RE = re.compile(r"[\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]")
REPEATED_SIGNS_RE = re.compile(r"(?:\s*[|¦]{2,}\s*|\s*={3,}\s*|\s*_{3,}\s*)")
QUALITY_FLAGS = ("PRIMARY_VERSION", "CLEANED_VERSION", "NO_MAJOR_ISSUES", "PAGINATION", "HTML_TAGS")
READER_PARSER_VERSION = "athar-openiti-reader-v2"
MAX_RAW_BYTES = 96 * 1024 * 1024
_RESOLVED_URLS: dict[str, dict[str, str]] = {}


def load_manifest() -> dict[str, Any]:
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    merged = [book for book in manifest.get("books", []) if isinstance(book, dict)]
    for extra_path in EXTRA_MANIFESTS:
        if not extra_path.exists():
            continue
        extra = json.loads(extra_path.read_text(encoding="utf-8"))
        extra_books = extra.get("books", []) if isinstance(extra, dict) else []
        if not isinstance(extra_books, list):
            raise RuntimeError(f"Le manifeste {extra_path.name} doit contenir une liste books.")
        merged.extend(book for book in extra_books if isinstance(book, dict))
    ids = [str(book.get("book_id") or "") for book in merged]
    uris = [str(book.get("openiti_uri") or "") for book in merged]
    if not all(ids) or len(ids) != len(set(ids)):
        raise RuntimeError("Identifiants book_id OpenITI manquants ou dupliqués.")
    if not all(uris) or len(uris) != len(set(uris)):
        raise RuntimeError("URI OpenITI manquantes ou dupliquées.")
    manifest["books"] = merged
    return manifest


def urls(manifest: dict[str, Any], book: dict[str, Any]) -> tuple[str, str]:
    commit = manifest["release_commit"]
    path = book["path"]
    return (
        f"https://raw.githubusercontent.com/OpenITI/RELEASE/{commit}/{path}",
        f"https://github.com/OpenITI/RELEASE/blob/{commit}/{path}",
    )


def clean(value: str) -> str:
    """Conservative OpenITI cleanup suitable for indexing and reading.

    Structural/editorial noise is removed, while ordinary numbers are kept:
    hadith numbers, verse references, dates, quantities, etc. are source data.
    """
    value = html.unescape(value or "")
    value = ZERO_WIDTH_RE.sub("", value)
    value = CONTROL_PAGE_RE.sub(" ", value)
    value = HTML_TAG_RE.sub(" ", value)
    value = BRACKETED_PAGE_RE.sub(" ", value)
    value = re.sub(r"\bms\d+\b", " ", value, flags=re.I)
    value = value.replace(" %~% ", " — ").replace("%~%", " — ")
    value = value.replace("~~", " ")
    value = REPEATED_SIGNS_RE.sub(" ", value)
    value = value.replace(" | ", " ")
    return SPACE_RE.sub(" ", value).strip()


def _heading(line: str) -> tuple[int, str] | None:
    match = HEADING_RE.match(line)
    if match:
        return min(6, max(1, len(match.group("pipes")))), clean(match.group("title"))[:500]
    if line.startswith("### "):
        title = clean(re.sub(r"^###\s+[^ ]*\s*", "", line))[:500]
        return (1, title) if title else None
    return None


def pieces(
    segment: str,
    inherited: tuple[str, ...] | str = (),
) -> tuple[list[dict[str, Any]], tuple[str, ...]]:
    if isinstance(inherited, str):
        section_path: list[str] = [inherited] if inherited else []
    else:
        section_path = [str(item) for item in inherited if str(item).strip()]
    result: list[dict[str, Any]] = []
    buffer: list[str] = []

    def flush() -> None:
        text = clean(" ".join(buffer))
        buffer.clear()
        if text:
            result.append(
                {
                    "chapter": section_path[-1] if section_path else "",
                    "section_title": section_path[-1] if section_path else "",
                    "section_level": len(section_path) if section_path else 0,
                    "section_path": list(section_path),
                    "text": text,
                }
            )

    for raw in segment.splitlines():
        line = raw.strip()
        if not line or line.startswith("#META#") or line == "######OpenITI#":
            continue
        heading = _heading(line)
        if heading:
            flush()
            level, title = heading
            if title:
                if level <= len(section_path):
                    section_path = section_path[: level - 1]
                while len(section_path) < level - 1:
                    section_path.append("")
                section_path.append(title)
                section_path = [item for item in section_path if item]
            continue
        if line.startswith("~~"):
            line = line[2:].lstrip()
        elif line.startswith("# "):
            line = line[2:].lstrip()
        line = clean(line)
        if line:
            buffer.append(line)
    flush()
    return result, tuple(section_path)


def split_text(text: str, size: int = 1800, overlap: int = 0) -> list[str]:
    """Split source text without duplicating prose in the reader.

    `overlap` remains accepted for compatibility but is intentionally ignored:
    repeated overlap made the digital-book reader display the same words twice.
    """
    del overlap
    text = clean(text)
    if len(text) <= size:
        return [text] if text else []
    out: list[str] = []
    start = 0
    while start < len(text):
        end = min(len(text), start + size)
        if end < len(text):
            candidates = [text.rfind(mark, start + size // 2, end) for mark in (". ", "؟ ", "؛ ", "! ", "\n")]
            cut = max(candidates)
            if cut > start:
                end = cut + 1
        chunk = text[start:end].strip()
        if chunk:
            out.append(chunk)
        if end >= len(text):
            break
        start = end
        while start < len(text) and text[start].isspace():
            start += 1
    return out


def parse(text: str) -> list[dict[str, Any]]:
    body = text.split(HEADER_END, 1)[-1].replace("\r\n", "\n")
    markers = list(PAGE_RE.finditer(body))
    rows: list[dict[str, Any]] = []
    cursor = 0
    section_path: tuple[str, ...] = ()
    seq = 0

    def append_segment(segment: str, volume: int | None, page: int | None, marker: str) -> None:
        nonlocal section_path, seq
        parts, section_path = pieces(segment, section_path)
        for part in parts:
            for chunk in split_text(str(part["text"])):
                seq += 1
                rows.append(
                    {
                        "seq": seq,
                        "volume": volume,
                        "page": page,
                        "marker": marker,
                        "chapter": part["chapter"],
                        "section_title": part["section_title"],
                        "section_level": part["section_level"],
                        "section_path": list(part["section_path"]),
                        "text": chunk,
                    }
                )

    for marker in markers:
        append_segment(
            body[cursor:marker.start()],
            int(marker.group("volume")),
            int(marker.group("page")),
            marker.group(0),
        )
        cursor = marker.end()
    if body[cursor:].strip():
        append_segment(body[cursor:], None, None, "")
    return rows


def _candidate_uri(name: str) -> str:
    return name[:-10] if name.endswith(".completed") else name


def _quality(metadata_text: str) -> tuple[list[str], str, int]:
    upper = metadata_text.upper()
    flags = [flag for flag in QUALITY_FLAGS if flag in upper]
    if "CLEAN OPERATION" in upper and "CLEANED_VERSION" not in flags:
        flags.append("CLEANED_VERSION")
    match = re.search(r"^90#VERS#ISSUES###:\s*(.*)$", metadata_text, flags=re.MULTILINE)
    issues = clean(match.group(1)) if match else ""
    if issues.lower().startswith("formalized issues"):
        issues = ""
    score = 500 * ("PRIMARY_VERSION" in flags) + 300 * ("CLEANED_VERSION" in flags) + 100 * ("NO_MAJOR_ISSUES" in flags)
    score -= 5 * ("PAGINATION" in flags) + 10 * ("HTML_TAGS" in flags)
    if "UNCORRECTED_OCR" in upper:
        score -= 500
    if "INCOMPLETE" in upper:
        score -= 300
    return flags, issues, score


def select_version_candidate(entries: list[dict[str, Any]], metadata_by_name: dict[str, str]) -> tuple[dict[str, Any], list[str], str]:
    candidates = [
        item for item in entries
        if item.get("type") == "file"
        and re.search(r"-ara\d+(?:\.completed)?$", str(item.get("name") or ""), re.I)
        and not str(item.get("name") or "").endswith(".yml")
    ]
    if not candidates:
        raise RuntimeError("Aucun texte alternatif OpenITI n'est disponible pour cet ouvrage.")
    ranked: list[tuple[float, dict[str, Any], list[str], str]] = []
    for item in candidates:
        name = str(item.get("name") or "")
        yml_name = f"{_candidate_uri(name)}.yml"
        flags, issues, score = _quality(metadata_by_name.get(yml_name, ""))
        score += min(max(0, int(item.get("size") or 0)) / 1_000_000, 25.0)
        ranked.append((float(score), item, flags, issues))
    ranked.sort(key=lambda row: row[0], reverse=True)
    _, selected, flags, issues = ranked[0]
    return selected, flags, issues


def _split_openiti_raw_url(raw_url: str) -> tuple[str, str]:
    marker = "/OpenITI/RELEASE/"
    if marker not in raw_url:
        raise RuntimeError("URL OpenITI non reconnue.")
    remainder = raw_url.split(marker, 1)[1]
    commit, path = remainder.split("/", 1)
    return commit, path


def resolve_raw_url(raw_url: str) -> dict[str, str]:
    commit, configured_path = _split_openiti_raw_url(raw_url)
    directory = configured_path.rsplit("/", 1)[0]
    api_url = "https://api.github.com/repos/OpenITI/RELEASE/contents/" + quote(directory, safe="/") + "?ref=" + quote(commit, safe="")
    response = requests.get(api_url, timeout=(10, 60), headers={"Accept": "application/vnd.github+json", "User-Agent": "AtharResearch/2.0"})
    response.raise_for_status()
    payload = response.json()
    if not isinstance(payload, list):
        raise RuntimeError("Réponse OpenITI inattendue lors de la recherche d'une version disponible.")
    entries = [item for item in payload if isinstance(item, dict)]
    yml_entries = {str(item.get("name") or ""): item for item in entries if str(item.get("name") or "").endswith(".yml")}
    metadata: dict[str, str] = {}
    for item in entries:
        name = str(item.get("name") or "")
        if item.get("type") != "file" or not re.search(r"-ara\d+(?:\.completed)?$", name, re.I) or name.endswith(".yml"):
            continue
        yml_name = f"{_candidate_uri(name)}.yml"
        yml_url = str((yml_entries.get(yml_name) or {}).get("download_url") or "")
        if not yml_url:
            continue
        try:
            meta = requests.get(yml_url, timeout=(10, 30), headers={"User-Agent": "AtharResearch/2.0"})
            meta.raise_for_status()
            metadata[yml_name] = meta.text
        except requests.RequestException:
            metadata[yml_name] = ""
    selected, flags, issues = select_version_candidate(entries, metadata)
    resolved_raw = str(selected.get("download_url") or "")
    resolved_path = str(selected.get("path") or "")
    if not resolved_raw or not resolved_path:
        raise RuntimeError("La version alternative OpenITI n'a pas d'URL exploitable.")
    resolved_page = f"https://github.com/OpenITI/RELEASE/blob/{commit}/{resolved_path}"
    return {
        "raw_url": resolved_raw,
        "source_url": resolved_page,
        "openiti_uri": _candidate_uri(str(selected.get("name") or "")),
        "quality_status": ",".join(flags) if flags else "OPENITI_RELEASE_AVAILABLE",
        "known_issues": issues,
        "configured_path": configured_path,
    }


def _fetch_exact(raw_url: str) -> str:
    response = requests.get(raw_url, timeout=(10, 180), headers={"User-Agent": "AtharResearch/2.0"})
    response.raise_for_status()
    if len(response.content) > MAX_RAW_BYTES:
        raise RuntimeError(f"Fichier OpenITI supérieur à {MAX_RAW_BYTES // (1024 * 1024)} MiB.")
    text = response.content.decode("utf-8-sig")
    if "######OpenITI#" not in text[:200]:
        raise RuntimeError("Signature OpenITI absente.")
    return text


def fetch_text(raw_url: str) -> str:
    try:
        return _fetch_exact(raw_url)
    except requests.HTTPError as error:
        status = error.response.status_code if error.response is not None else 0
        if status != 404:
            raise
    resolved = resolve_raw_url(raw_url)
    _RESOLVED_URLS[raw_url] = resolved
    return _fetch_exact(resolved["raw_url"])


def ingest_book(connection: Any, manifest: dict[str, Any], book: dict[str, Any], text: str) -> dict[str, int]:
    configured_raw, configured_source = urls(manifest, book)
    resolution = _RESOLVED_URLS.get(configured_raw)
    raw_url = resolution["raw_url"] if resolution else configured_raw
    source_url = resolution["source_url"] if resolution else configured_source
    actual_uri = resolution["openiti_uri"] if resolution else str(book["openiti_uri"])
    quality_status = resolution["quality_status"] if resolution else str(book.get("quality_status", ""))
    known_issues = resolution["known_issues"] if resolution else str(book.get("known_issues", ""))
    resolution_status = "automatic_fallback" if resolution else "configured"
    configured_metadata = book.get("metadata") if isinstance(book.get("metadata"), dict) else {}
    upsert_book(
        connection,
        {
            **book,
            "id": book["book_id"],
            "source_url": source_url,
            "metadata": {
                **configured_metadata,
                "source": "OpenITI",
                "license": manifest["license"],
                "source_resolution": resolution_status,
                "openiti_uri_used": actual_uri,
                "configured_openiti_uri": book.get("openiti_uri", ""),
                "reader_parser_version": READER_PARSER_VERSION,
            },
        },
    )
    rows = parse(text)
    now = utc_now()
    title, title_ar, author = str(book.get("title") or ""), str(book.get("title_ar") or ""), str(book.get("author") or "")
    chunk_rows: list[tuple[Any, ...]] = []
    fts_rows: list[tuple[Any, ...]] = []
    for row in rows:
        digest = content_hash(actual_uri, row["volume"], row["page"], row["seq"], row["text"])
        chunk_id = f"openiti-{digest[:24]}"
        meta = {
            "source": "OpenITI",
            "openiti_uri": actual_uri,
            "configured_openiti_uri": book.get("openiti_uri", ""),
            "source_resolution": resolution_status,
            "release_commit": manifest["release_commit"],
            "license": manifest["license"],
            "license_url": manifest["license_url"],
            "volume": row["volume"],
            "printed_page": row["page"],
            "page_marker": row["marker"],
            "quality_status": quality_status,
            "known_issues": known_issues,
            "raw_source_url": raw_url,
            "reader_parser_version": READER_PARSER_VERSION,
            "section_title": row["section_title"],
            "section_level": row["section_level"],
            "section_path": row["section_path"],
            "cleanup_applied": True,
            "numbers_preserved": True,
        }
        chunk_rows.append((chunk_id, book["book_id"], row["page"], row["chapter"], row["text"], "", "openiti_arabic_source", source_url, digest, now, json.dumps(meta, ensure_ascii=False)))
        normalized = normalize_text(" ".join(filter(None, [title, title_ar, author, row["chapter"], row["text"]])))
        fts_rows.append((chunk_id, title, title_ar, author, row["chapter"], row["text"], "", normalized))
    old_ids = connection.execute("SELECT id FROM chunks WHERE book_id=?", (book["book_id"],)).fetchall()
    if old_ids:
        try:
            connection.executemany("DELETE FROM chunks_fts WHERE chunk_id=?", [(str(item[0]),) for item in old_ids])
        except sqlite3.OperationalError:
            pass
        connection.execute("DELETE FROM chunks WHERE book_id=?", (book["book_id"],))
    if chunk_rows:
        connection.executemany("INSERT INTO chunks (id, book_id, page, chapter, text_ar, text_fr, translation_status, source_url, content_hash, scraped_at, metadata_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", chunk_rows)
        try:
            connection.executemany("INSERT INTO chunks_fts VALUES (?, ?, ?, ?, ?, ?, ?, ?)", fts_rows)
        except sqlite3.OperationalError:
            pass
    connection.commit()
    pages = len({(row["volume"], row["page"]) for row in rows if row["page"] is not None})
    return {"chunks": len(rows), "pages": pages}
