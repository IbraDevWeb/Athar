from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
import urllib.parse
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
BLOCKED_MARKERS = (
    "captcha",
    "cloudflare ray id",
    "verify you are human",
    "access denied",
    "attention required",
)


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
    title = (soup.find("h1").get_text(" ", strip=True) if soup.find("h1") else fallback.get("title", ""))
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
    return {
        **fallback,
        "title": title or fallback.get("title", ""),
        "title_ar": arabic_title or fallback.get("title_ar", ""),
        "pages": pages or fallback.get("pages"),
        "description": description,
        "scraped_at": utc_now(),
        "metadata": {"parser": "kutub-html-v1"},
    }


def paragraph_language(text: str) -> str:
    letters = [char for char in text if char.isalpha()]
    if not letters:
        return "other"
    arabic = sum(1 for char in letters if ARABIC_CHAR.match(char))
    return "ar" if arabic / len(letters) >= 0.45 else "fr"


def extract_page_content(html: str) -> tuple[str, list[str], list[str]]:
    soup = BeautifulSoup(html, "html.parser")
    main = find_main(soup)
    for element in main.select("script, style, nav, footer, header, button, form, noscript, svg, aside"):
        element.decompose()

    headings = [heading.get_text(" ", strip=True) for heading in main.select("h1, h2, h3")]
    chapter = next((heading for heading in headings[1:] if len(heading) < 220), headings[0] if headings else "")

    raw_paragraphs = []
    for element in main.select("p, blockquote, li, [dir='rtl']"):
        text = re.sub(r"\s+", " ", element.get_text(" ", strip=True)).strip()
        if len(text) >= 45 and text not in raw_paragraphs:
            raw_paragraphs.append(text)

    if not raw_paragraphs:
        raw_paragraphs = [
            re.sub(r"\s+", " ", line).strip()
            for line in visible_text(main).splitlines()
            if len(line.strip()) >= 45
        ]

    arabic = [text for text in raw_paragraphs if paragraph_language(text) == "ar"]
    french = [text for text in raw_paragraphs if paragraph_language(text) == "fr"]
    return chapter, arabic, french


def chunk_paragraphs(paragraphs: list[str], target_words: int = 520, overlap_words: int = 70) -> list[str]:
    chunks: list[str] = []
    current: list[str] = []
    current_count = 0
    for paragraph in paragraphs:
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


def pair_chunks(arabic: list[str], french: list[str]) -> list[tuple[str, str]]:
    ar_chunks = chunk_paragraphs(arabic)
    fr_chunks = chunk_paragraphs(french)
    size = max(len(ar_chunks), len(fr_chunks), 1)
    return [
        (
            ar_chunks[index] if index < len(ar_chunks) else "",
            fr_chunks[index] if index < len(fr_chunks) else "",
        )
        for index in range(size)
        if (index < len(ar_chunks) and ar_chunks[index]) or (index < len(fr_chunks) and fr_chunks[index])
    ]


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
            exists = connection.execute(
                "SELECT 1 FROM chunks WHERE book_id = ? AND page = ? LIMIT 1",
                (metadata["id"], page),
            ).fetchone()
            if exists:
                continue

        page_url = f"{BASE_URL}/fr/book/{kutub_id}/{page}"
        page_response = client.get(page_url)
        if snapshots:
            save_snapshot(kutub_id, page, page_response.text)
        chapter, arabic, french = extract_page_content(page_response.text)
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
                    "metadata": {"kutub_id": kutub_id, "chunk_index": index},
                },
            )
            imported_chunks += 1
        connection.commit()
        imported_pages += 1
        print(f"[{metadata['title']}] page {page}/{total} — {len(pairs)} passage(s)")
    return imported_pages, imported_chunks


def main() -> int:
    parser = argparse.ArgumentParser(description="Synchronise des pages publiques Kutub dans la base RAG locale d'Athar.")
    parser.add_argument("--book", action="append", type=int, help="Identifiant Kutub à synchroniser. Répétable.")
    parser.add_argument("--max-pages", type=int, default=25, help="Nombre maximal de pages par livre pour cette exécution.")
    parser.add_argument("--delay", type=float, default=DEFAULT_DELAY, help="Délai minimal entre deux requêtes.")
    parser.add_argument("--db", type=Path, default=DEFAULT_DB)
    parser.add_argument("--no-skip-existing", action="store_true", help="Retélécharge aussi les pages déjà présentes.")
    parser.add_argument("--snapshots", action="store_true", help="Conserve les HTML bruts pour audit du parseur.")
    args = parser.parse_args()

    contact = os.getenv("ATHAR_BOT_CONTACT", "operator-contact-not-configured")
    user_agent = f"AtharResearchBot/1.0 (+{contact}; public pages; respectful rate limit)"
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
    print(f"Synchronisation terminée : {pages} page(s), {chunks} passage(s) ajouté(s) ou mis à jour.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
