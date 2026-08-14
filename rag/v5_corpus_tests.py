from __future__ import annotations

import argparse
import sqlite3
from pathlib import Path

from v5_engine import corpus_status, normalize_text, search


def open_db(path: Path) -> sqlite3.Connection:
    db = sqlite3.connect(f"file:{path.resolve().as_posix()}?mode=ro", uri=True, timeout=30)
    db.row_factory = sqlite3.Row
    db.execute("PRAGMA query_only=ON")
    return db


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--db", type=Path, required=True)
    args = parser.parse_args()

    with open_db(args.db) as db:
        status = corpus_status(db)
        print("STATUS", status)
        assert status["books"] >= 55, status
        assert status["chunks"] >= 240000, status
        assert status["fts_ready"] is True, status

        loud = search(db, "prier à voix haute", limit=8)
        print("LOUD ANALYSIS", loud["analysis"])
        for source in loud["sources"][:8]:
            print("LOUD", source["title"], source["page"], source["relevance"], source["matched_concepts"], source["chapter"])
        assert loud["sources"], loud["analysis"]
        assert "prayer" in loud["analysis"]["concepts"], loud["analysis"]
        assert "recitation_aloud" in loud["analysis"]["concepts"], loud["analysis"]
        assert any("recitation_aloud" in source["matched_concepts"] for source in loud["sources"]), loud["sources"]

        variants = [
            "dans quelles prières récite-t-on à voix haute ?",
            "est-ce qu'on prie à voix basse au dhuhr ?",
            "peut-on regrouper les prières en voyage ?",
            "comment faire le wudu ?",
            "que disent les ouvrages sur le qunut ?",
        ]
        for query in variants:
            result = search(db, query, limit=5)
            print("QUERY", query)
            print("ANALYSIS", result["analysis"])
            print("TOP", [(s["title"], s["page"], s["relevance"], s["matched_concepts"]) for s in result["sources"][:3]])
            assert result["sources"], (query, result["analysis"])

        cases = [
            ("Que dit Sahih al-Bukhari sur les intentions ?", "bukhari"),
            ("Que dit Sahih Muslim sur la purification ?", "muslim"),
            ("Que dit le Tafsir al-Tabari sur la sourate al-Fatiha ?", "tabari"),
            ("Que dit le Tafsir Ibn Kathir sur Ayat al-Kursi ?", "ibn kathir"),
            ("Que rapporte Sunan al-Tirmidhi sur la prière du witr ?", "tirmidhi"),
            ("Que trouve-t-on dans la Sira d'Ibn Hisham concernant la bataille de Badr ?", "ibn hisham"),
        ]
        for question, expected in cases:
            result = search(db, question, limit=5)
            routed = result["analysis"]["routed_book"]
            assert routed, (question, result["analysis"])
            label = normalize_text(f"{routed.get('title','')} {routed.get('author','')}")
            assert normalize_text(expected) in label, (question, routed)
            assert result["sources"], (question, result["analysis"])
            assert all(source["book_id"] == routed["id"] for source in result["sources"]), (question, result["sources"])
            print("ROUTED PASS", question, "=>", routed["title"])

    print("RAG V5 REAL CORPUS TESTS: PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
