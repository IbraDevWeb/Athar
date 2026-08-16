from __future__ import annotations

"""Small deterministic tests for V6.3-D review, qrels and human evaluation."""

import csv
import json
import tempfile
from pathlib import Path

from v63d_human_benchmark import evaluate
from v63d_qrels import merge
from v63d_review_app import ReviewStore, load_pool


FIELDS = [
    "case_id", "question", "candidate_code", "chunk_id", "book_id", "title",
    "author", "madhhab", "discipline", "page", "chapter", "text_ar", "text_fr",
    "source_url", "relevance_grade", "reviewer", "notes",
]


def write_csv(path: Path, rows: list[dict[str, str]]) -> None:
    with path.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=FIELDS)
        writer.writeheader()
        writer.writerows(rows)


def main() -> int:
    with tempfile.TemporaryDirectory() as td:
        root = Path(td)
        pool = root / "pool.csv"
        base_rows = [
            {
                "case_id": "q1", "question": "question", "candidate_code": "P01",
                "chunk_id": "a", "book_id": "b1", "title": "Livre A", "author": "Auteur",
                "madhhab": "", "discipline": "fiqh", "page": "1", "chapter": "c",
                "text_ar": "نص", "text_fr": "", "source_url": "",
                "relevance_grade": "", "reviewer": "", "notes": "",
            },
            {
                "case_id": "q1", "question": "question", "candidate_code": "P02",
                "chunk_id": "b", "book_id": "b2", "title": "Livre B", "author": "Auteur",
                "madhhab": "", "discipline": "fiqh", "page": "2", "chapter": "c",
                "text_ar": "نص", "text_fr": "", "source_url": "",
                "relevance_grade": "", "reviewer": "", "notes": "",
            },
        ]
        write_csv(pool, base_rows)
        rows, fields = load_pool(pool)
        db = root / "review.sqlite"
        annotations = root / "annotations.csv"
        store = ReviewStore(rows, fields, reviewer="reviewer-a", db_path=db, output_csv=annotations)
        store.save("q1", "a", 2, "direct")
        store.save("q1", "b", 0, "")
        assert store.progress() == (2, 2)
        store.close()

        qrels = root / "qrels.json"
        disagreements = root / "disagreements.csv"
        payload = merge(
            pool_path=pool,
            annotation_paths=[annotations],
            adjudication_path=None,
            output_qrels=qrels,
            disagreements_path=disagreements,
        )
        assert payload["coverage"]["judged_rows"] == 2
        assert payload["coverage"]["single_review_rows"] == 2

        audit = root / "audit.json"
        audit.write_text(
            json.dumps(
                {
                    "version": "test",
                    "cases": [
                        {
                            "case_id": "q1",
                            "systems": {
                                "v61": ["b", "a"],
                                "v63c-ann": ["a", "b"],
                                "v63c-fused": ["a", "b"],
                            },
                        }
                    ],
                },
                ensure_ascii=False,
            ),
            encoding="utf-8",
        )
        report = evaluate(qrels, audit, root / "report.json", root / "report.md")
        assert report["systems"]["v63c-fused"]["ndcg_at_10"] > report["systems"]["v61"]["ndcg_at_10"]
        assert report["comparison"]["v63c_fused_vs_v61"]["case_wins"] == 1
    print("V6.3-D tests: OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
