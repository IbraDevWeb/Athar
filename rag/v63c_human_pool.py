from __future__ import annotations

"""Build a genuinely blind pooled review pack from V6.1 and V6.3-C.

Reviewer-facing files deliberately hide:
- engine origin, rank and score;
- benchmark category;
- the expected-negative flag.

A separate private audit keeps those fields plus the exact rankings needed for
post-hoc system evaluation. Do not share the audit with reviewers before the
annotation campaign is frozen.
"""

import argparse
import csv
import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

os.environ.setdefault("ATHAR_QUERY_LLM_ENABLED", "0")

from v5_sharded import ShardedCorpusRuntime
from v61_benchmark import load_dataset
from v62_human_gold import _candidate_rows
from v63_hybrid import DEFAULT_MODEL
from v63c_ann_index import GlobalAnnIndex
from v63c_shadow import AnnFusionConfig, AnnShadowRuntime

ROOT = Path(__file__).resolve().parents[1]

PUBLIC_REVIEW_FIELDS = [
    "case_id",
    "question",
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


def rooted(path: Path) -> Path:
    return path if path.is_absolute() else ROOT / path


def _ranked_ids(sources: list[dict[str, Any]]) -> list[str]:
    return [str(source.get("id") or "") for source in sources if str(source.get("id") or "")]


def _public_row(row: dict[str, Any]) -> dict[str, Any]:
    return {field: row.get(field, "") for field in PUBLIC_REVIEW_FIELDS}


def prepare_pool(
    *,
    dataset_path: Path,
    manifest_path: Path,
    shard_dir: Path,
    ann_manifest: Path,
    output_csv: Path,
    output_json: Path,
    audit_json: Path,
    lexical_limit: int = 10,
    ann_limit: int = 10,
    max_cases: int = 0,
) -> dict[str, Any]:
    dataset = load_dataset(dataset_path)
    base = ShardedCorpusRuntime(manifest_path, shard_dir)
    base.validate()
    ann = GlobalAnnIndex(ann_manifest)
    runtime = AnnShadowRuntime(
        base,
        ann,
        model_name=DEFAULT_MODEL,
        config=AnnFusionConfig(
            lexical_limit=max(1, min(int(lexical_limit), 20)),
            ann_limit=max(1, int(ann_limit)),
            ann_oversample=max(80, int(ann_limit) * 8),
        ),
    )
    runtime.validate()
    list(runtime.model.query_embed(["warmup Athar pooled blind review"]))

    cases = list(dataset["cases"])
    if max_cases > 0:
        cases = cases[:max_cases]

    rows: list[dict[str, Any]] = []
    summaries: list[dict[str, Any]] = []
    audit_cases: list[dict[str, Any]] = []

    try:
        for index, case in enumerate(cases, 1):
            kwargs = {
                "madhhab": str(case.get("madhhab") or ""),
                "discipline": str(case.get("discipline") or ""),
            }
            lexical = list(
                base.search(str(case["question"]), limit=lexical_limit, **kwargs).get("sources") or []
            )
            shadow = runtime.search(str(case["question"]), limit=lexical_limit, **kwargs)
            semantic = list(shadow.get("shadow_ann_sources") or [])[:ann_limit]
            fused = list(shadow.get("sources") or [])[:lexical_limit]

            pooled: dict[str, dict[str, Any]] = {}
            for source_list in (lexical, semantic):
                for source in source_list:
                    chunk_id = str(source.get("id") or "")
                    if chunk_id:
                        pooled.setdefault(chunk_id, dict(source))

            candidates = list(pooled.values())
            private_rows = _candidate_rows(case, candidates)
            public_rows = [_public_row(row) for row in private_rows]
            rows.extend(public_rows)

            lexical_ids = set(_ranked_ids(lexical))
            ann_ids = set(_ranked_ids(semantic))
            code_by_chunk = {
                str(row.get("chunk_id") or ""): str(row.get("candidate_code") or "")
                for row in public_rows
            }

            summaries.append(
                {
                    "case_id": str(case["id"]),
                    "candidate_count": len(candidates),
                }
            )
            audit_cases.append(
                {
                    "case_id": str(case["id"]),
                    "category": str(case.get("category") or "other"),
                    "expect_no_evidence": bool(case.get("expect_no_evidence")),
                    "candidate_codes": code_by_chunk,
                    "systems": {
                        "v61": _ranked_ids(lexical),
                        "v63c-ann": _ranked_ids(semantic),
                        "v63c-fused": _ranked_ids(fused),
                    },
                    "counts": {
                        "pool": len(candidates),
                        "v61": len(lexical_ids),
                        "v63c-ann": len(ann_ids),
                        "v63c-ann-only": len(ann_ids - lexical_ids),
                        "v63c-fused": len(fused),
                    },
                }
            )
            print(
                f"[{index:03d}/{len(cases):03d}] {case['id']} "
                f"pool={len(candidates)} ann-only={len(ann_ids - lexical_ids)} fused={len(fused)}"
            )
    finally:
        ann.close()

    output_csv.parent.mkdir(parents=True, exist_ok=True)
    with output_csv.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=PUBLIC_REVIEW_FIELDS, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)

    payload = {
        "version": "6.3-d-pooled-human-review-2",
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "dataset_version": str(dataset.get("version") or ""),
        "pool_policy": {
            "systems_pooled": ["V6.1 lexical", "V6.3-C global ANN"],
            "fused_ranking_kept_private_for_evaluation": True,
            "per_candidate_origin_hidden": True,
            "engine_rank_hidden": True,
            "engine_score_hidden": True,
            "benchmark_category_hidden": True,
            "negative_case_flag_hidden": True,
            "candidate_order": "stable_sha256_shuffle",
        },
        "grading": {
            "0": "non pertinent / ne répond pas à la question",
            "1": "pertinent mais partiel ou contextuel",
            "2": "directement pertinent et exploitable comme preuve",
        },
        "cases": summaries,
        "rows": rows,
    }
    output_json.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    audit = {
        "version": "6.3-d-pool-origin-audit-2",
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "warning": "Ne pas fournir ce fichier aux reviewers avant la fin des annotations.",
        "systems": ["v61", "v63c-ann", "v63c-fused"],
        "cases": audit_cases,
    }
    audit_json.write_text(
        json.dumps(audit, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    return payload


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--dataset", type=Path, required=True)
    p.add_argument("--manifest", type=Path, required=True)
    p.add_argument("--shard-dir", type=Path, required=True)
    p.add_argument("--ann-manifest", type=Path, required=True)
    p.add_argument("--output-csv", type=Path, required=True)
    p.add_argument("--output-json", type=Path, required=True)
    p.add_argument("--audit-json", type=Path, required=True)
    p.add_argument("--lexical-limit", type=int, default=10)
    p.add_argument("--ann-limit", type=int, default=10)
    p.add_argument("--max-cases", type=int, default=0)
    args = p.parse_args()
    payload = prepare_pool(
        dataset_path=rooted(args.dataset),
        manifest_path=rooted(args.manifest),
        shard_dir=rooted(args.shard_dir),
        ann_manifest=rooted(args.ann_manifest),
        output_csv=rooted(args.output_csv),
        output_json=rooted(args.output_json),
        audit_json=rooted(args.audit_json),
        lexical_limit=args.lexical_limit,
        ann_limit=args.ann_limit,
        max_cases=args.max_cases,
    )
    print(
        json.dumps(
            {"cases": len(payload["cases"]), "rows": len(payload["rows"])},
            ensure_ascii=False,
            indent=2,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
