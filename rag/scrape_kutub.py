from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
import urllib.robotparser
from pathlib import Path
from typing import Any

import requests
from bs4 import BeautifulSoup

from core import DEFAULT_DB, connect, content_hash, initialize_database, upsert_book, upsert_chunk, utc_now

ROOT = Path(__file__).resolve().parents[1]
BOOKS_PATH = ROOT / "rag" / "books.json"
SNAPSHOT_DIR = ROOT / "rag" / "data" / "snapshots"
BASE_URL = "https://kutub.io"
DEFAULT_DELAY = 1.25

ARABIC_CHAR = re.compile(r"[\u0600-\u06FF]")
PAGE_COUNT = re.compile(r"([\d\s,.]+)\s+pages?", re.IGNORECASE)
VOLUME_HINT = re.compile(r"(?:tome|volume|vol\.?|الجزء)\s*([0-9٠-٩]+)", re.IGNORECASE)
PRINTED_PAGE_HINT = re.compile(r"(?:page|p\.?|صفحة)\s*([0-9٠-٩]+)", re.IGNORECASE)
SPACE = re.compile(r"\s+")
BLOCKED_MARKERS = (
    "captcha",
    "cloudflare ray id",
    "verify you are human",
    "access denied",
    "attention required",
)
CONTENT_SELECTORS = "p, blockquote, li, [dir='rtl'], [dir='ltr']"
NESTED_CONTENT_SELECTORS = "p, blockquote, li"


def load_books(path: Path = BOOKS_PATH) -> list[dict[str, Any]]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    return [book for book in payload.get("books", []) if book.get("enabled", True)]


def parse_retry_after(value: str | None) -> float:
    try:
        return max(1.0, min(float(value or 0), 120.0))
    except ValueError:
        return 15.0


def robots_policy(user_agent: str) -> urllib.robotparser.RobotFileParser:
    parser = urllib.robotparser.RobotFileParser()
    parser.set_url(f"{BASE_URL}/robots.txt")
    try:
        parser.read()
    except Exception as error:
        raise RuntimeError(f"Impossible de vérifier robots.txt : {error}") from error
    if not parser.can_fetch(user_agent, f"{BASE_URL}/fr/book/1"):
        raise RuntimeError("robots.txt interdit l’exploration des pages de livres pour ce user-agent.")
    return parser


class KutubClient:
    def __init__(self, delay: float, user_agent: str, timeout: float = 30.0) -> None:
        self.delay = max(delay, 0.8)
        self.timeout = timeout
        self.user_agent = user_agent
        self.session = requests.Session()
        self.session.headers.update(
            {
                "User-Agent": user_agent,
                "Accept-Language": "fr-FR,fr;q=0.9,ar;q=0.7,en;q=0.5",
                "Accept": "text/html,application/xhtml+xml",
            }
        )
        self.robots = robots_policy(user_agent)
        self.last_request = 0.0

    def get(self, url: str, retries: int = 3) -> requests.Response:
        if not self.robots.can_fetch(self.user_agent, url):
            raise RuntimeError(f"robots.txt interdit cette URL : {url}")
        elapsed = time.monotonic() - self.last_request
        if elapsed < self.delay:
            time.sleep(self.delay - elapsed)

        for attempt in range(retries + 1):
            response = self.session.get(url, timeout=self.timeout, allow_redirects=True)
            self.last_request = time.monotonic()
            lowered = response.text[:10000].lower()
            if response.status_code in {401, 403}:
                raise RuntimeError(f"Accès refusé ({response.status_code}) sur {url}. Le crawl est arrêté.")
            if any(marker in lowered for marker in BLOCKED_MARKERS):
                raise RuntimeError(f"Protection anti-bot détectée sur {url}. Aucun contournement ne sera tenté.")
            if response.status_code == 429:
                if attempt >= retries:
                    raise RuntimeError(f"Limite de requêtes atteinte sur {url}.")
                time.sleep(parse_retry_after(response.headers.get("Retry-After")))
                continue
            if 500 <= response.status_code < 600 and attempt < retries:
                time.sleep(2 ** attempt)
                continue
            response.raise_for_status()
            return response
        raise RuntimeError(f"Échec de récupération : {url}")


def _clean_text(value: Any) -> str:
    return SPACE.sub(" ", str(value or "")).strip()


def visible_text(node: Any) -> str:
    if node is None:
        return ""
    for element in node.select("script, style, nav, footer, header, button, form, noscript, svg"):
        element.decompose()
    return "\n".join(line.strip() for line in node.get_text("\n").splitlines() if line.strip())


def find_main(soup: BeautifulSoup) -> Any:
    candidates = [
        soup.select_one("main"),
        soup.select_one("article"),
        soup.select_one("[role='main']"),
        soup.select_one("#__next"),
        soup.body,
    ]
    return max((node for node in candidates if node is not None), key=lambda node: len(node.get_text(" ")), default=soup)


def parse_book_page(html: str, fallback: dict[str, Any]) -> dict[str, Any]:
    soup = BeautifulSoup(html, "html.parser")
    main = find_main(soup)
    text = visible_text(main)
    title = soup.find("h1").get_text(" ", strip=True) if soup.find("h1") else fallback.get("title", "")
    lines = [line for line in text.splitlines() if line]
    arabic_title = next((line for line in lines if ARABIC_CHAR.search(line) and len(line) < 180), fallback.get("title_ar", ""))
    page_match = PAGE_COUNT.search(text)
    pages = None
    if page_match:
        digits = re.sub(r"\D", "", page_match.group(1))
        pages = int(digits) if digits else None
    description = fallback.get("description", "")
    about_index = next((index for index, line in enumerate(lines) if line.lower() in {"à propos", "about"}), -1)
    if about_index >= 0:
        description = " ".join(lines[about_index + 1 : about_index + 4])[:900] or description
    inherited_metadata = fallback.get("metadata") if isinstance(fallback.get("metadata"), dict) else {}
    return {
        **fallback,
        "title": title or fallback.get("title", ""),
        "title_ar": arabic_title or fallback.get("title_ar", ""),
        "pages": pages or fallback.get("pages"),
        "description": description,
        "scraped_at": utc_now(),
        "metadata": {
            **inherited_metadata,
            "parser": "kutub-html-v3",
            "catalogue_structure_checked": False,
            "source_language": "ar/fr",
            "translation_source": "kutub.io",
            "translation_kind": "kutub_ai_or_community_unreviewed",
        },
    }


def paragraph_language(text: str) -> str:
    letters = [char for char in text if char.isalpha()]
    if not letters:
        return "other"
    arabic = sum(1 for char in letters if ARABIC_CHAR.match(char))
    return "ar" if arabic / len(letters) >= 0.45 else "fr"


def _link_heavy(element: Any, text: str) -> bool:
    links = element.find_all("a")
    if not links:
        return False
    linked = _clean_text(" ".join(link.get_text(" ", strip=True) for link in links))
    return bool(text) and len(linked) / max(len(text), 1) >= 0.7


def extract_ordered_language_blocks(main: Any) -> list[tuple[str, str]]:
    """Return visible Arabic/French blocks in DOM order, excluding interface chrome."""
    for element in main.select("script, style, nav, footer, header, button, form, noscript, svg, aside"):
        element.decompose()

    blocks: list[tuple[str, str]] = []
    seen: set[str] = set()
    for element in main.select(CONTENT_SELECTORS):
        if element.name not in {"p", "blockquote", "li"} and element.select_one(NESTED_CONTENT_SELECTORS):
            continue
        text = _clean_text(element.get_text(" ", strip=True))
        if len(text) < 45 or text in seen or _link_heavy(element, text):
            continue
        language = paragraph_language(text)
        if language not in {"ar", "fr"}:
            continue
        seen.add(text)
        blocks.append((language, text))

    if blocks:
        return blocks

    for line in visible_text(main).splitlines():
        text = _clean_text(line)
        if len(text) < 45 or text in seen:
            continue
        language = paragraph_language(text)
        if language in {"ar", "fr"}:
            seen.add(text)
            blocks.append((language, text))
    return blocks


def _merge_language_runs(blocks: list[tuple[str, str]]) -> list[tuple[str, str]]:
    runs: list[tuple[str, str]] = []
    for language, text in blocks:
        if runs and runs[-1][0] == language:
            previous_language, previous_text = runs[-1]
            runs[-1] = (previous_language, f"{previous_text}\n\n{text}")
        else:
            runs.append((language, text))
    return runs


def align_bilingual_blocks(blocks: list[tuple[str, str]]) -> list[tuple[str, str]]:
    """Pair adjacent French/Arabic runs without inventing a translation.

    Kutub pages can render a whole translation before the Arabic original, or
    alternate translated/original paragraphs. Grouping adjacent runs preserves
    that page-level context better than independently chunking both languages.
    """
    runs = _merge_language_runs(blocks)
    pairs: list[tuple[str, str]] = []
    index = 0
    while index < len(runs):
        language, text = runs[index]
        if index + 1 < len(runs) and runs[index + 1][0] != language:
            _, next_text = runs[index + 1]
            text_ar = text if language == "ar" else next_text
            text_fr = text if language == "fr" else next_text
            pairs.append((text_ar, text_fr))
            index += 2
            continue
        pairs.append((text if language == "ar" else "", text if language == "fr" else ""))
        index += 1
    return pairs


def extract_page_content(html: str) -> tuple[str, list[str], list[str], dict[str, Any]]:
    soup = BeautifulSoup(html, "html.parser")
    main = find_main(soup)

    headings = [_clean_text(heading.get_text(" ", strip=True)) for heading in main.select("h1, h2, h3")]
    headings = [heading for heading in headings if heading]
    chapter = next((heading for heading in headings[1:] if len(heading) < 220), headings[0] if headings else "")

    blocks = extract_ordered_language_blocks(main)
    aligned = align_bilingual_blocks(blocks)
    arabic = [text_ar for text_ar, _ in aligned]
    french = [text_fr for _, text_fr in aligned]

    page_text = " ".join(headings + [text for _, text in blocks[:8]])
    volume_match = VOLUME_HINT.search(page_text)
    printed_match = PRINTED_PAGE_HINT.search(page_text)
    structure = {
        "headings": headings[:8],
        "volume": volume_match.group(1) if volume_match else None,
        "printed_page": printed_match.group(1) if printed_match else None,
        "chapter_detected": bool(chapter),
        "ordered_blocks": len(blocks),
        "bilingual_groups": sum(1 for text_ar, text_fr in aligned if text_ar and text_fr),
        "french_groups": sum(1 for _, text_fr in aligned if text_fr),
        "arabic_groups": sum(1 for text_ar, _ in aligned if text_ar),
        "translation_source": "kutub.io",
    }
    return chapter, arabic, french, structure


def chunk_paragraphs(paragraphs: list[str], target_words: int = 520, overlap_words: int = 70) -> list[str]:
    chunks: list[str] = []
    current: list[str] = []
    current_count = 0
    for paragraph in paragraphs:
        paragraph = paragraph.strip()
        if not paragraph:
            continue
        words = paragraph.split()
        if current and current_count + len(words) > target_words:
            chunks.append("\n\n".join(current))
            tail_words = " ".join(" ".join(current).split()[-overlap_words:])
            current = [tail_words] if tail_words else []
            current_count = len(tail_words.split())
        current.append(paragraph)
        current_count += len(words)
    if current:
        chunks.append("\n\n".join(current))
    return [chunk for chunk in chunks if len(chunk.split()) >= 20]


def _chunk_group(text: str) -> list[str]:
    clean = text.strip()
    if not clean:
        return []
    paragraphs = [part.strip() for part in clean.split("\n\n") if part.strip()]
    chunks = chunk_paragraphs(paragraphs)
    return chunks or [clean]


def pair_chunks(arabic: list[str], french: list[str]) -> list[tuple[str, str]]:
    """Chunk already-aligned language groups while keeping French beside its source."""
    pairs: list[tuple[str, str]] = []
    group_count = max(len(arabic), len(french))
    for group_index in range(group_count):
        text_ar = arabic[group_index] if group_index < len(arabic) else ""
        text_fr = french[group_index] if group_index < len(french) else ""
        ar_chunks = _chunk_group(text_ar)
        fr_chunks = _chunk_group(text_fr)
        chunk_count = max(len(ar_chunks), len(fr_chunks), 1)
        for chunk_index in range(chunk_count):
            ar_chunk = ar_chunks[chunk_index] if chunk_index < len(ar_chunks) else ""
            fr_chunk = fr_chunks[chunk_index] if chunk_index < len(fr_chunks) else ""
            if ar_chunk or fr_chunk:
                pairs.append((ar_chunk, fr_chunk))
    return pairs


def save_snapshot(book_id: int, page: int | str, html: str) -> None:
    folder = SNAPSHOT_DIR / str(book_id)
    folder.mkdir(parents=True, exist_ok=True)
    (folder / f"{page}.html").write_text(html, encoding="utf-8")


def crawl_book(
    client: KutubClient,
    connection: Any,
    book: dict[str, Any],
    max_pages: int | None,
    skip_existing: bool,
    snapshots: bool,
) -> tuple[int, int]:
    kutub_id = int(book["kutub_id"])
    source_url = book.get("source_url") or f"{BASE_URL}/fr/book/{kutub_id}"
    response = client.get(source_url)
    if snapshots:
        save_snapshot(kutub_id, "book", response.text)
    metadata = parse_book_page(response.text, {**book, "id": f"kutub-{kutub_id}", "source_url": source_url})
    upsert_book(connection, metadata)
    connection.commit()

    available = int(metadata.get("pages") or book.get("pages") or max_pages or 0)
    requested = int(max_pages or book.get("max_pages") or available)
    total = min(available, requested) if available else requested
    if total <= 0:
        raise RuntimeError(f"Nombre de pages introuvable pour {metadata['title']}; utilisez --max-pages.")

    imported_pages = 0
    imported_chunks = 0
    for page in range(1, total + 1):
        if skip_existing:
            # A page already carrying French does not need to be fetched again.
            # Arabic-only pages remain eligible so a later Kutub translation can enrich them.
            exists = connection.execute(
                """
                SELECT 1 FROM chunks
                WHERE book_id=? AND page=?
                  AND LENGTH(TRIM(COALESCE(text_fr, ''))) > 0
                LIMIT 1
                """,
                (metadata["id"], page),
            ).fetchone()
            if exists:
                continue

        page_url = f"{BASE_URL}/fr/book/{kutub_id}/{page}"
        page_response = client.get(page_url)
        if snapshots:
            save_snapshot(kutub_id, page, page_response.text)
        chapter, arabic, french, structure = extract_page_content(page_response.text)
        pairs = pair_chunks(arabic, french)
        if not pairs:
            print(f"[avertissement] Aucun passage exploitable : {page_url}", file=sys.stderr)
            continue

        for index, (text_ar, text_fr) in enumerate(pairs, start=1):
            chunk_id = f"kutub-{kutub_id}-{page}-{index}"
            upsert_chunk(
                connection,
                {
                    "id": chunk_id,
                    "book_id": metadata["id"],
                    "page": page,
                    "chapter": chapter,
                    "text_ar": text_ar,
                    "text_fr": text_fr,
                    "translation_status": "kutub_ai_unreviewed" if text_fr else "arabic_original",
                    "source_url": page_url,
                    "content_hash": content_hash(text_ar, text_fr),
                    "scraped_at": utc_now(),
                    "metadata": {
                        "kutub_id": kutub_id,
                        "chunk_index": index,
                        "volume": structure.get("volume"),
                        "printed_page": structure.get("printed_page"),
                        "page_end": page,
                        "headings": structure.get("headings", []),
                        "chapter_detected": structure.get("chapter_detected", False),
                        "verification_status": "imported_unreviewed",
                        "arabic_present": bool(text_ar),
                        "french_present": bool(text_fr),
                        "translation_source": "kutub.io" if text_fr else None,
                        "translation_kind": "kutub_ai_or_community_unreviewed" if text_fr else None,
                        "source_type": metadata.get("metadata", {}).get("source_type", "classical_reference"),
                    },
                },
            )
            imported_chunks += 1
        connection.commit()
        imported_pages += 1
        french_chunks = sum(1 for _, text_fr in pairs if text_fr)
        print(
            f"[{metadata['title']}] page {page}/{total} — "
            f"{len(pairs)} passage(s), {french_chunks} avec français Kutub"
        )
    return imported_pages, imported_chunks


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Synchronise les pages publiques Kutub (arabe + français publié par Kutub) dans la base RAG locale d'Athar."
    )
    parser.add_argument("--book", action="append", type=int, help="Identifiant Kutub à synchroniser. Répétable.")
    parser.add_argument("--max-pages", type=int, default=25, help="Nombre maximal de pages par livre pour cette exécution.")
    parser.add_argument("--delay", type=float, default=DEFAULT_DELAY, help="Délai minimal entre deux requêtes.")
    parser.add_argument("--db", type=Path, default=DEFAULT_DB)
    parser.add_argument("--no-skip-existing", action="store_true", help="Retélécharge aussi les pages ayant déjà du français.")
    parser.add_argument("--snapshots", action="store_true", help="Conserve les HTML bruts pour audit du parseur.")
    args = parser.parse_args()

    contact = os.getenv("ATHAR_BOT_CONTACT", "operator-contact-not-configured")
    user_agent = f"AtharResearchBot/3.1 (+{contact}; public pages; respectful rate limit)"
    client = KutubClient(args.delay, user_agent)
    books = load_books()
    if args.book:
        selected = set(args.book)
        books = [book for book in books if int(book["kutub_id"]) in selected]
    if not books:
        print("Aucun livre sélectionné.", file=sys.stderr)
        return 2

    connection = connect(args.db)
    initialize_database(connection)
    pages = chunks = 0
    try:
        for book in books:
            imported_pages, imported_chunks = crawl_book(
                client,
                connection,
                book,
                max_pages=args.max_pages,
                skip_existing=not args.no_skip_existing,
                snapshots=args.snapshots,
            )
            pages += imported_pages
            chunks += imported_chunks
    finally:
        connection.close()

    print(f"Synchronisation Kutub terminée : {pages} page(s), {chunks} passage(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
