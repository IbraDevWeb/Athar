from __future__ import annotations

"""Small deterministic tests for V6.3-D assignment, review, qrels and evaluation."""

import csv
import json
import tempfile
from pathlib import Path

from v63d_assign import assign
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


def row(case_id: str, chunk_id: str, candidate: str) -> dict[str, str]:
    return {
        "case_id": case_id,
        "question": f"question {case_id}",
        "candidate_code": candidate,
        "chunk_id": chunk_id,
        "book_id": f"book-{case_id}",
        "title": f"Livre {case_id}",
        "author": "Auteur",
        "madhhab": "",
        "discipline": "fiqh",
        "page": "1",
        "chapter": "c",
        "text_ar": "نص",
        "text_fr": "",
        "source_url": "",
        "relevance_grade": "",
        "reviewer": "",
        "notes": "",
    }


def main() -> int:
    with tempfile.TemporaryDirectory() as td:
        root = Path(td)
        pool = root / "pool.csv"
        base_rows = [
            row("q1", "a", "P01"),
            row("q1", "b", "P02"),
            row("q2", "c", "P01"),
            row("q2", "d", "P02"),
            row("q2", "e", "P03"),
            row("q3", "f", "P01"),
        ]
        write_csv(pool, base_rows)

        assignment = assign(
            pool_path=pool,
            output_dir=root / "batches",
            batches=2,
            calibration_cases=1,
        )
        assert assignment["pool"] == {"cases": 3, "rows": 6}
        assert sum(item["rows"] for item in assignment["batches"]) == 6
        assert assignment["calibration"]["cases"] == 1
        # Complete cases must stay intact in exactly one primary batch.
        batch_cases: list[set[str]] = []
        for item in assignment["batches"]:
            batch_rows, _ = load_pool(root / "batches" / item["file"])
            batch_cases.append({x["case_id"] for x in batch_rows})
        assert batch_cases[0].isdisjoint(batch_cases[1])
        assert batch_cases[0] | batch_cases[1] == {"q1", "q2", "q3"}

        # Exercise the review/qrels/evaluation path on one complete case.
        single_pool = root / "single-pool.csv"
        write_csv(single_pool, base_rows[:2])
        rows, fields = load_pool(single_pool)
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
            pool_path=single_pool,
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
