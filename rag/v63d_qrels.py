from __future__ import annotations

"""Merge blind human annotations into V6.3-D qrels with disagreement control."""

import argparse
import csv
import json
import math
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

KEY = tuple[str, str]


def clean(value: Any) -> str:
    return " ".join(str(value or "").split())


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        return [dict(row) for row in csv.DictReader(handle)]


def load_pool(path: Path) -> dict[KEY, dict[str, str]]:
    rows = read_csv(path)
    pool: dict[KEY, dict[str, str]] = {}
    for line, row in enumerate(rows, 2):
        key = (clean(row.get("case_id")), clean(row.get("chunk_id")))
        if not all(key) or key in pool:
            raise RuntimeError(f"{path}:{line}: clé absente ou dupliquée {key!r}")
        pool[key] = row
    if not pool:
        raise RuntimeError("Pool vide.")
    return pool


def load_judgements(paths: list[Path], pool: dict[KEY, dict[str, str]]) -> dict[KEY, list[dict[str, Any]]]:
    grouped: dict[KEY, list[dict[str, Any]]] = defaultdict(list)
    seen_reviewer_key: set[tuple[str, str, str]] = set()
    for path in paths:
        for line, row in enumerate(read_csv(path), 2):
            grade_raw = clean(row.get("relevance_grade"))
            if not grade_raw:
                continue
            if grade_raw not in {"0", "1", "2"}:
                raise RuntimeError(f"{path}:{line}: grade invalide {grade_raw!r}")
            case_id = clean(row.get("case_id"))
            chunk_id = clean(row.get("chunk_id"))
            reviewer = clean(row.get("reviewer"))
            key = (case_id, chunk_id)
            if key not in pool:
                raise RuntimeError(f"{path}:{line}: candidat hors pool {key!r}")
            if not reviewer:
                raise RuntimeError(f"{path}:{line}: reviewer obligatoire")
            unique = (reviewer, case_id, chunk_id)
            if unique in seen_reviewer_key:
                raise RuntimeError(f"{path}:{line}: jugement dupliqué {unique!r}")
            seen_reviewer_key.add(unique)
            grouped[key].append(
                {
                    "grade": int(grade_raw),
                    "reviewer": reviewer,
                    "notes": clean(row.get("notes")),
                }
            )
    return grouped


def load_adjudication(path: Path | None, pool: dict[KEY, dict[str, str]]) -> dict[KEY, dict[str, Any]]:
    if path is None:
        return {}
    result: dict[KEY, dict[str, Any]] = {}
    for line, row in enumerate(read_csv(path), 2):
        grade_raw = clean(row.get("relevance_grade"))
        if not grade_raw:
            continue
        if grade_raw not in {"0", "1", "2"}:
            raise RuntimeError(f"{path}:{line}: grade d'adjudication invalide")
        key = (clean(row.get("case_id")), clean(row.get("chunk_id")))
        if key not in pool:
            raise RuntimeError(f"{path}:{line}: adjudication hors pool {key!r}")
        if key in result:
            raise RuntimeError(f"{path}:{line}: adjudication dupliquée {key!r}")
        reviewer = clean(row.get("reviewer")) or "adjudicator"
        result[key] = {
            "grade": int(grade_raw),
            "reviewer": reviewer,
            "notes": clean(row.get("notes")),
        }
    return result


def cohen_kappa(grouped: dict[KEY, list[dict[str, Any]]]) -> dict[str, Any]:
    pairs: list[tuple[int, int]] = []
    for items in grouped.values():
        if len(items) == 2:
            pairs.append((int(items[0]["grade"]), int(items[1]["grade"])))
    if not pairs:
        return {"double_coded": 0, "exact_agreement": None, "cohen_kappa": None}
    exact = sum(a == b for a, b in pairs) / len(pairs)
    a_counts = Counter(a for a, _ in pairs)
    b_counts = Counter(b for _, b in pairs)
    pe = sum((a_counts[g] / len(pairs)) * (b_counts[g] / len(pairs)) for g in (0, 1, 2))
    kappa = None if math.isclose(1.0 - pe, 0.0) else (exact - pe) / (1.0 - pe)
    return {
        "double_coded": len(pairs),
        "exact_agreement": round(exact, 6),
        "cohen_kappa": None if kappa is None else round(kappa, 6),
    }


def write_disagreements(
    path: Path,
    disagreements: list[tuple[KEY, list[dict[str, Any]]]],
    pool: dict[KEY, dict[str, str]],
) -> None:
    fields = [
        "case_id",
        "question",
        "candidate_code",
        "chunk_id",
        "title",
        "author",
        "text_ar",
        "text_fr",
        "reviewer_grades",
        "relevance_grade",
        "reviewer",
        "notes",
    ]
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        for key, items in disagreements:
            base = pool[key]
            writer.writerow(
                {
                    "case_id": key[0],
                    "question": base.get("question", ""),
                    "candidate_code": base.get("candidate_code", ""),
                    "chunk_id": key[1],
                    "title": base.get("title", ""),
                    "author": base.get("author", ""),
                    "text_ar": base.get("text_ar", ""),
                    "text_fr": base.get("text_fr", ""),
                    "reviewer_grades": " | ".join(
                        f"{item['reviewer']}={item['grade']}" for item in items
                    ),
                    "relevance_grade": "",
                    "reviewer": "",
                    "notes": "",
                }
            )


def merge(
    *,
    pool_path: Path,
    annotation_paths: list[Path],
    adjudication_path: Path | None,
    output_qrels: Path,
    disagreements_path: Path,
) -> dict[str, Any]:
    pool = load_pool(pool_path)
    grouped = load_judgements(annotation_paths, pool)
    missing = [key for key in pool if key not in grouped]
    if missing:
        preview = ", ".join(f"{c}/{d}" for c, d in missing[:8])
        raise RuntimeError(
            f"Annotation incomplète: {len(missing)} candidat(s) sans jugement. Exemples: {preview}"
        )

    adjudication = load_adjudication(adjudication_path, pool)
    disagreements: list[tuple[KEY, list[dict[str, Any]]]] = []
    resolved: dict[KEY, dict[str, Any]] = {}
    for key, items in grouped.items():
        grades = {int(item["grade"]) for item in items}
        if len(grades) == 1:
            resolved[key] = {
                "grade": int(items[0]["grade"]),
                "reviewers": sorted({str(item["reviewer"]) for item in items}),
                "resolution": "consensus" if len(items) > 1 else "single-review",
                "notes": [str(item["notes"]) for item in items if str(item["notes"])],
            }
            continue
        if key in adjudication:
            item = adjudication[key]
            resolved[key] = {
                "grade": int(item["grade"]),
                "reviewers": sorted({str(x["reviewer"]) for x in items}),
                "resolution": "adjudicated",
                "adjudicator": str(item["reviewer"]),
                "notes": [str(item["notes"])] if str(item["notes"]) else [],
            }
        else:
            disagreements.append((key, items))

    write_disagreements(disagreements_path, disagreements, pool)
    if disagreements:
        raise RuntimeError(
            f"{len(disagreements)} désaccord(s) non résolu(s). "
            f"Complète {disagreements_path} puis relance avec --adjudication."
        )

    by_case: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for (case_id, chunk_id), item in resolved.items():
        by_case[case_id].append({"chunk_id": chunk_id, **item})

    payload = {
        "version": "6.3-d-human-qrels-1",
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "policy": {
            "grades": {"0": "not-relevant", "1": "relevant-context", "2": "direct-evidence"},
            "relevant_threshold": 1,
            "engine_origin_hidden_during_review": True,
            "negative_case_flag_hidden_during_review": True,
            "category_hidden_during_review": True,
            "disagreements_require_adjudication": True,
        },
        "coverage": {
            "pool_rows": len(pool),
            "judged_rows": len(resolved),
            "single_review_rows": sum(x["resolution"] == "single-review" for x in resolved.values()),
            "consensus_rows": sum(x["resolution"] == "consensus" for x in resolved.values()),
            "adjudicated_rows": sum(x["resolution"] == "adjudicated" for x in resolved.values()),
        },
        "agreement": cohen_kappa(grouped),
        "cases": [
            {
                "case_id": case_id,
                "judgements": sorted(items, key=lambda x: x["chunk_id"]),
            }
            for case_id, items in sorted(by_case.items())
        ],
    }
    output_qrels.parent.mkdir(parents=True, exist_ok=True)
    output_qrels.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    return payload


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--pool", type=Path, required=True)
    parser.add_argument("--annotations", type=Path, action="append", required=True)
    parser.add_argument("--adjudication", type=Path)
    parser.add_argument("--output-qrels", type=Path, required=True)
    parser.add_argument("--disagreements", type=Path, default=Path("rag/data/v63d-disagreements.csv"))
    args = parser.parse_args()
    payload = merge(
        pool_path=args.pool,
        annotation_paths=list(args.annotations),
        adjudication_path=args.adjudication,
        output_qrels=args.output_qrels,
        disagreements_path=args.disagreements,
    )
    print(
        json.dumps(
            {"coverage": payload["coverage"], "agreement": payload["agreement"]},
            ensure_ascii=False,
            indent=2,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
