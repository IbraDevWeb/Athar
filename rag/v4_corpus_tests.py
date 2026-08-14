from __future__ import annotations

import argparse
import sqlite3
import sys
from pathlib import Path
from typing import Any

from v4_engine import corpus_status, normalize_text, search


CASES: list[dict[str, Any]] = [
    {
        "question": "Que dit Sahih al-Bukhari sur les intentions ?",
        "title_contains": "sahih al bukhari",
        "author_contains": "bukhari",
        "concepts": {"intention"},
    },
    {
        "question": "Que dit Sahih Muslim sur la purification ?",
        "title_contains": "sahih muslim",
        "author_contains": "muslim",
        "concepts": {"purification"},
    },
    {
        "question": "Que rapporte le Muwatta de Malik sur la prière ?",
        "title_contains": "muwatta",
        "author_contains": "malik",
        "concepts": {"prayer"},
    },
    {
        "question": "Que dit Bidayat al-Mujtahid sur le jeûne du voyageur ?",
        "title_contains": "bidayat al mujtahid",
        "author_contains": "ibn rushd",
        "concepts": {"fasting", "travel"},
    },
    {
        "question": "Que dit le Tafsir al-Tabari sur la sourate al-Fatiha ?",
        "author_contains": "tabari",
        "discipline_contains": "tafsir",
        "concepts": {"fatiha"},
    },
    {
        "question": "Que dit le Tafsir Ibn Kathir sur Ayat al-Kursi ?",
        "author_contains": "ibn kathir",
        "discipline_contains": "tafsir",
        "concepts": {"ayat_al_kursi"},
    },
    {
        "question": "Que rapporte Sunan al-Tirmidhi sur la prière du witr ?",
        "title_contains": "sunan al tirmidhi",
        "author_contains": "tirmidhi",
        "concepts": {"prayer", "witr"},
    },
    {
        "question": "Que trouve-t-on dans la Sira d'Ibn Hisham concernant la bataille de Badr ?",
        "author_contains": "ibn hisham",
        "discipline_contains": "sira",
        "concepts": {"badr"},
    },
]


def connect_read_only(path: Path) -> sqlite3.Connection:
    resolved = path.resolve().as_posix()
    connection = sqlite3.connect(f"file:{resolved}?mode=ro", uri=True, timeout=60)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA query_only=ON")
    connection.execute("PRAGMA temp_store=MEMORY")
    return connection


def contains(value: str, expected: str) -> bool:
    return normalize_text(expected) in normalize_text(value)


def fail(message: str) -> None:
    print(f"FAIL: {message}", file=sys.stderr)
    raise AssertionError(message)


def run_case(connection: sqlite3.Connection, case: dict[str, Any]) -> None:
    question = case["question"]
    result = search(connection, question, limit=8)
    analysis = result["analysis"]
    routed = analysis.get("routed_book")
    if not routed:
        fail(f"aucun livre détecté pour: {question}")

    book_row = connection.execute(
        "SELECT id,title,author,discipline FROM books WHERE id=?",
        (routed["id"],),
    ).fetchone()
    if not book_row:
        fail(f"livre routé absent: {routed}")

    if case.get("title_contains") and not contains(book_row["title"], case["title_contains"]):
        fail(f"mauvais titre pour {question}: {book_row['title']}")
    if case.get("author_contains") and not contains(book_row["author"], case["author_contains"]):
        fail(f"mauvais auteur pour {question}: {book_row['author']}")
    if case.get("discipline_contains") and not contains(book_row["discipline"], case["discipline_contains"]):
        fail(f"mauvaise discipline pour {question}: {book_row['discipline']}")

    expected_concepts = set(case.get("concepts") or set())
    detected_concepts = set(analysis.get("concepts") or [])
    if not expected_concepts.issubset(detected_concepts):
        fail(f"concepts manquants pour {question}: attendu={expected_concepts} détecté={detected_concepts}")

    sources = result["sources"]
    if not sources:
        fail(f"aucun passage retrouvé dans le bon livre pour: {question}; analyse={analysis}")
    if any(source["book_id"] != routed["id"] for source in sources):
        fail(f"un passage d'un autre livre a traversé le filtre pour: {question}")

    top = sources[0]
    top_concepts = set(top.get("matched_concepts") or [])
    if expected_concepts and not expected_concepts.intersection(top_concepts):
        fail(f"le meilleur passage ne correspond pas au sujet pour: {question}; top={top}")

    print(
        f"PASS: {question}\n"
        f"      -> {book_row['title']} — {book_row['author']}\n"
        f"      -> {len(sources)} source(s), top={top['relevance']}%, concepts={top_concepts}, page={top.get('page')}"
    )


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--db", type=Path, required=True)
    args = parser.parse_args()

    with connect_read_only(args.db) as connection:
        status = corpus_status(connection)
        print(f"Corpus: {status}")
        if status["books"] < 55:
            fail(f"corpus incomplet: {status['books']} livres")
        if status["chunks"] < 240_000:
            fail(f"corpus incomplet: {status['chunks']} passages")
        if not status["fts_ready"]:
            fail("index FTS absent")

        for case in CASES:
            run_case(connection, case)

        general = search(connection, "Peut-on regrouper les prières en voyage ?", limit=8)
        if general["analysis"]["routed_book"] is not None:
            fail("une question générale a été routée vers un livre sans raison")
        if not general["sources"]:
            fail("la recherche générale prière + voyage ne retourne aucun passage")
        if not {"prayer", "travel"}.issubset(set(general["analysis"]["concepts"])):
            fail(f"analyse générale incorrecte: {general['analysis']}")
        print(f"PASS: recherche générale -> {len(general['sources'])} sources")

    print("RAG V4 REAL CORPUS: ALL TESTS PASSED")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
