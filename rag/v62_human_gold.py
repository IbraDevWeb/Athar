from __future__ import annotations

"""Blind human-gold preparation and import utilities for Athar Research V6.2.

The goal is to separate *retrieval development* from *relevance judgement*.
Reviewers receive questions and candidate passages without the engine rank,
relevance score, matched concepts or benchmark verdict. Their annotations are
then imported into an explicit qrels file used by the V6.2 evaluation harness.
"""

import argparse
import csv
import hashlib
import json
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from v5_sharded import ShardedCorpusRuntime
from v61_benchmark import load_dataset

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_MANIFEST = ROOT / "rag" / "corpus_release_v3.json"
DEFAULT_SHARD_DIR = ROOT / "rag" / "data" / "shards"

REVIEW_FIELDS = [
    "case_id",
    "category",
    "question",
    "expect_no_evidence",
    "candidate_code",
    "chunk_id",
    "book_id",
    "title",
    "author",
    "madhhab",
    "discipline",
    "page",
    "chapter",
    "text_ar",
    "text_fr",
    "source_url",
    "relevance_grade",
    "reviewer",
    "notes",
]


def _rooted(path: Path) -> Path:
    return path if path.is_absolute() else ROOT / path


def _clean(value: Any) -> str:
    return " ".join(str(value or "").split())


def _trim(value: Any, limit: int = 1800) -> str:
    text = _clean(value)
    return text if len(text) <= limit else text[:limit].rstrip() + "…"


def _blind_key(case_id: str, chunk_id: str) -> str:
    return hashlib.sha256(f"athar-v62\0{case_id}\0{chunk_id}".encode("utf-8")).hexdigest()


def _candidate_rows(case: dict[str, Any], sources: list[dict[str, Any]]) -> list[dict[str, Any]]:
    case_id = str(case["id"])
    shuffled = sorted(
        [dict(source) for source in sources],
        key=lambda source: _blind_key(case_id, str(source.get("id") or "")),
    )
    rows: list[dict[str, Any]] = []
    for index, source in enumerate(shuffled, 1):
        rows.append(
            {
                "case_id": case_id,
                "category": str(case.get("category") or "other"),
                "question": str(case.get("question") or ""),
                "expect_no_evidence": "1" if bool(case.get("expect_no_evidence")) else "0",
                "candidate_code": f"P{index:02d}",
                "chunk_id": str(source.get("id") or ""),
                "book_id": str(source.get("book_id") or ""),
                "title": str(source.get("title") or ""),
                "author": str(source.get("author") or ""),
                "madhhab": str(source.get("madhhab") or ""),
                "discipline": str(source.get("discipline") or ""),
                "page": "" if source.get("page") is None else str(source.get("page")),
                "chapter": _trim(source.get("chapter"), 400),
                "text_ar": _trim(source.get("text_ar"), 1800),
                "text_fr": _trim(source.get("text_fr"), 1800),
                "source_url": str(source.get("source_url") or ""),
                "relevance_grade": "",
                "reviewer": "",
                "notes": "",
            }
        )
    return rows


def prepare_review_pack(
    *,
    dataset_path: Path,
    manifest_path: Path,
    shard_dir: Path,
    output_csv: Path,
    output_json: Path,
    limit: int,
    max_cases: int,
    include_negative: bool,
) -> dict[str, Any]:
    dataset = load_dataset(dataset_path)
    runtime = ShardedCorpusRuntime(manifest_path, shard_dir)
    runtime.validate()

    cases = list(dataset["cases"])
    if not include_negative:
        cases = [case for case in cases if not bool(case.get("expect_no_evidence"))]
    if max_cases > 0:
        cases = cases[:max_cases]

    rows: list[dict[str, Any]] = []
    case_summaries: list[dict[str, Any]] = []
    for index, case in enumerate(cases, 1):
        result = runtime.search(
            str(case["question"]),
            limit=limit,
            madhhab=str(case.get("madhhab") or ""),
            discipline=str(case.get("discipline") or ""),
        )
        sources = list(result.get("sources") or [])
        rows.extend(_candidate_rows(case, sources))
        case_summaries.append(
            {
                "case_id": str(case["id"]),
                "category": str(case.get("category") or "other"),
                "candidate_count": len(sources),
                "expect_no_evidence": bool(case.get("expect_no_evidence")),
            }
        )
        print(f"[{index:03d}/{len(cases):03d}] {case['id']} candidates={len(sources)}")

    output_csv.parent.mkdir(parents=True, exist_ok=True)
    with output_csv.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=REVIEW_FIELDS, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)

    payload = {
        "version": "6.2-human-review-pack-1",
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "dataset_version": str(dataset.get("version") or ""),
        "blind_policy": {
            "rank_hidden": True,
            "retrieval_score_hidden": True,
            "matched_terms_hidden": True,
            "candidate_order": "stable_sha256_shuffle",
        },
        "grading": {
            "0": "non pertinent / ne répond pas à la question",
            "1": "pertinent mais partiel ou contextuel",
            "2": "directement pertinent et exploitable comme preuve",
        },
        "cases": case_summaries,
        "rows": rows,
    }
    output_json.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return payload


def _parse_bool(value: Any) -> bool:
    return str(value or "").strip().lower() in {"1", "true", "yes", "oui"}


def _read_review_csv(path: Path) -> list[dict[str, str]]:
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        return [dict(row) for row in csv.DictReader(handle)]


def import_annotations(input_csv: Path, output_qrels: Path) -> dict[str, Any]:
    rows = _read_review_csv(input_csv)
    if not rows:
        raise RuntimeError("Le fichier d'annotation est vide.")

    grouped: dict[str, list[dict[str, Any]]] = defaultdict(list)
    errors: list[str] = []
    for line_no, row in enumerate(rows, 2):
        case_id = _clean(row.get("case_id"))
        chunk_id = _clean(row.get("chunk_id"))
        grade_raw = _clean(row.get("relevance_grade"))
        reviewer = _clean(row.get("reviewer"))
        if not case_id or not chunk_id:
            errors.append(f"ligne {line_no}: case_id/chunk_id manquant")
            continue
        if grade_raw not in {"0", "1", "2"}:
            errors.append(f"ligne {line_no}: relevance_grade doit valoir 0, 1 ou 2")
            continue
        if not reviewer:
            errors.append(f"ligne {line_no}: reviewer obligatoire")
            continue
        grouped[case_id].append(
            {
                "chunk_id": chunk_id,
                "grade": int(grade_raw),
                "reviewer": reviewer,
                "notes": _clean(row.get("notes")),
                "candidate_code": _clean(row.get("candidate_code")),
                "expect_no_evidence": _parse_bool(row.get("expect_no_evidence")),
            }
        )

    if errors:
        preview = "\n".join(errors[:30])
        suffix = "" if len(errors) <= 30 else f"\n… {len(errors) - 30} autre(s) erreur(s)"
        raise RuntimeError(f"Annotations invalides:\n{preview}{suffix}")

    cases: list[dict[str, Any]] = []
    for case_id, annotations in sorted(grouped.items()):
        seen: set[str] = set()
        unique: list[dict[str, Any]] = []
        reviewers: set[str] = set()
        for item in annotations:
            chunk_id = item["chunk_id"]
            if chunk_id in seen:
                raise RuntimeError(f"{case_id}: chunk dupliqué dans les annotations: {chunk_id}")
            seen.add(chunk_id)
            reviewers.add(item["reviewer"])
            unique.append(item)
        negative = all(bool(item["expect_no_evidence"]) for item in unique)
        relevant = [item for item in unique if int(item["grade"]) > 0]
        if not negative and not relevant:
            raise RuntimeError(f"{case_id}: aucun passage pertinent annoté (grade 1 ou 2).")
        if negative and relevant:
            raise RuntimeError(f"{case_id}: cas négatif mais au moins un passage est annoté pertinent.")
        cases.append(
            {
                "case_id": case_id,
                "expect_no_evidence": negative,
                "reviewers": sorted(reviewers),
                "judgements": [
                    {
                        "chunk_id": item["chunk_id"],
                        "grade": item["grade"],
                        "reviewer": item["reviewer"],
                        "notes": item["notes"],
                    }
                    for item in unique
                ],
            }
        )

    payload = {
        "version": "6.2-human-qrels-1",
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "policy": {
            "relevance_grades": [0, 1, 2],
            "relevant_threshold": 1,
            "independent_of_engine_rank": True,
        },
        "cases": cases,
    }
    output_qrels.parent.mkdir(parents=True, exist_ok=True)
    output_qrels.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return payload


def validate_qrels(path: Path) -> dict[str, Any]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(payload, dict) or not isinstance(payload.get("cases"), list):
        raise RuntimeError("Qrels V6.2 invalide: `cases` doit être une liste.")
    ids: set[str] = set()
    for case in payload["cases"]:
        if not isinstance(case, dict):
            raise RuntimeError("Qrels V6.2 invalide: cas non objet.")
        case_id = _clean(case.get("case_id"))
        if not case_id or case_id in ids:
            raise RuntimeError(f"Qrels V6.2 invalide: case_id absent ou dupliqué: {case_id!r}")
        ids.add(case_id)
        judgements = case.get("judgements")
        if not isinstance(judgements, list) or not judgements:
            raise RuntimeError(f"{case_id}: aucun jugement.")
        seen_chunks: set[str] = set()
        positive = 0
        for judgement in judgements:
            chunk_id = _clean(judgement.get("chunk_id")) if isinstance(judgement, dict) else ""
            grade = judgement.get("grade") if isinstance(judgement, dict) else None
            reviewer = _clean(judgement.get("reviewer")) if isinstance(judgement, dict) else ""
            if not chunk_id or chunk_id in seen_chunks:
                raise RuntimeError(f"{case_id}: chunk absent ou dupliqué: {chunk_id!r}")
            if grade not in {0, 1, 2}:
                raise RuntimeError(f"{case_id}/{chunk_id}: grade invalide: {grade!r}")
            if not reviewer:
                raise RuntimeError(f"{case_id}/{chunk_id}: reviewer obligatoire.")
            seen_chunks.add(chunk_id)
            positive += int(grade > 0)
        negative = bool(case.get("expect_no_evidence"))
        if negative and positive:
            raise RuntimeError(f"{case_id}: cas négatif avec jugement pertinent.")
        if not negative and positive == 0:
            raise RuntimeError(f"{case_id}: cas positif sans jugement pertinent.")
    return payload


def main() -> int:
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="command", required=True)

    prepare = sub.add_parser("prepare", help="Générer un pack aveugle de passages à annoter.")
    prepare.add_argument("--dataset", type=Path, required=True)
    prepare.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST)
    prepare.add_argument("--shard-dir", type=Path, default=DEFAULT_SHARD_DIR)
    prepare.add_argument("--output-csv", type=Path, required=True)
    prepare.add_argument("--output-json", type=Path, required=True)
    prepare.add_argument("--limit", type=int, default=10)
    prepare.add_argument("--max-cases", type=int, default=0)
    prepare.add_argument("--include-negative", action="store_true")

    imp = sub.add_parser("import", help="Importer un CSV humain annoté vers des qrels versionnés.")
    imp.add_argument("--input-csv", type=Path, required=True)
    imp.add_argument("--output-qrels", type=Path, required=True)

    validate = sub.add_parser("validate", help="Valider un fichier qrels V6.2.")
    validate.add_argument("--qrels", type=Path, required=True)

    args = parser.parse_args()
    if args.command == "prepare":
        payload = prepare_review_pack(
            dataset_path=_rooted(args.dataset),
            manifest_path=_rooted(args.manifest),
            shard_dir=_rooted(args.shard_dir),
            output_csv=_rooted(args.output_csv),
            output_json=_rooted(args.output_json),
            limit=max(1, min(int(args.limit), 20)),
            max_cases=max(0, int(args.max_cases)),
            include_negative=bool(args.include_negative),
        )
        print(json.dumps({"cases": len(payload["cases"]), "rows": len(payload["rows"])}, ensure_ascii=False))
        return 0
    if args.command == "import":
        payload = import_annotations(_rooted(args.input_csv), _rooted(args.output_qrels))
        print(json.dumps({"cases": len(payload["cases"])}, ensure_ascii=False))
        return 0
    payload = validate_qrels(_rooted(args.qrels))
    print(json.dumps({"cases": len(payload["cases"]), "status": "valid"}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
