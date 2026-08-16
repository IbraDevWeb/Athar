from __future__ import annotations

"""Build a blind pooled review pack from V6.1 and V6.3-C ANN candidates.

Per-candidate engine origin, rank, lexical score and ANN score are deliberately
omitted from the reviewer files. A separate audit JSON is produced for later
analysis and should not be shown to reviewers before annotation is complete.
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
from v62_human_gold import REVIEW_FIELDS, _candidate_rows
from v63_hybrid import DEFAULT_MODEL
from v63c_ann_index import GlobalAnnIndex
from v63c_shadow import AnnFusionConfig, AnnShadowRuntime

ROOT = Path(__file__).resolve().parents[1]


def rooted(path: Path) -> Path:
    return path if path.is_absolute() else ROOT / path


def prepare_pool(
    *, dataset_path: Path, manifest_path: Path, shard_dir: Path, ann_manifest: Path,
    output_csv: Path, output_json: Path, audit_json: Path,
    lexical_limit: int = 10, ann_limit: int = 10, max_cases: int = 0,
) -> dict[str, Any]:
    dataset = load_dataset(dataset_path)
    base = ShardedCorpusRuntime(manifest_path, shard_dir)
    base.validate()
    ann = GlobalAnnIndex(ann_manifest)
    runtime = AnnShadowRuntime(
        base, ann, model_name=DEFAULT_MODEL,
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
            lexical = list(base.search(str(case["question"]), limit=lexical_limit, **kwargs).get("sources") or [])
            shadow = runtime.search(str(case["question"]), limit=lexical_limit, **kwargs)
            semantic = list(shadow.get("shadow_ann_sources") or [])[:ann_limit]

            pooled: dict[str, dict[str, Any]] = {}
            origin: dict[str, list[str]] = {}
            for label, source_list in (("v61", lexical), ("v63c-ann", semantic)):
                for source in source_list:
                    chunk_id = str(source.get("id") or "")
                    if not chunk_id:
                        continue
                    pooled.setdefault(chunk_id, dict(source))
                    origin.setdefault(chunk_id, []).append(label)
            candidates = list(pooled.values())
            case_rows = _candidate_rows(case, candidates)
            rows.extend(case_rows)
            lexical_ids = {str(x.get("id") or "") for x in lexical}
            ann_ids = {str(x.get("id") or "") for x in semantic}
            summaries.append({
                "case_id": str(case["id"]),
                "category": str(case.get("category") or "other"),
                "expect_no_evidence": bool(case.get("expect_no_evidence")),
                "candidate_count": len(candidates),
                "lexical_count": len(lexical_ids),
                "ann_count": len(ann_ids),
                "ann_only_count": len(ann_ids - lexical_ids),
            })
            audit_cases.append({
                "case_id": str(case["id"]),
                "origins": {chunk_id: sorted(set(labels)) for chunk_id, labels in origin.items()},
            })
            print(f"[{index:03d}/{len(cases):03d}] {case['id']} pool={len(candidates)} ann-only={len(ann_ids - lexical_ids)}")
    finally:
        ann.close()

    output_csv.parent.mkdir(parents=True, exist_ok=True)
    with output_csv.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=REVIEW_FIELDS, extrasaction="ignore")
        writer.writeheader(); writer.writerows(rows)

    payload = {
        "version": "6.3-c-pooled-human-review-1",
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "dataset_version": str(dataset.get("version") or ""),
        "pool_policy": {
            "systems": ["V6.1 lexical", "V6.3-C global ANN"],
            "per_candidate_origin_hidden": True,
            "engine_rank_hidden": True,
            "engine_score_hidden": True,
            "candidate_order": "stable_sha256_shuffle",
            "negative_cases_included": True,
        },
        "grading": {
            "0": "non pertinent / ne répond pas à la question",
            "1": "pertinent mais partiel ou contextuel",
            "2": "directement pertinent et exploitable comme preuve",
        },
        "cases": summaries,
        "rows": rows,
    }
    output_json.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    audit = {
        "version": "6.3-c-pool-origin-audit-1",
        "warning": "Ne pas fournir ce fichier aux reviewers avant la fin des annotations.",
        "cases": audit_cases,
    }
    audit_json.write_text(json.dumps(audit, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
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
        dataset_path=rooted(args.dataset), manifest_path=rooted(args.manifest),
        shard_dir=rooted(args.shard_dir), ann_manifest=rooted(args.ann_manifest),
        output_csv=rooted(args.output_csv), output_json=rooted(args.output_json),
        audit_json=rooted(args.audit_json), lexical_limit=args.lexical_limit,
        ann_limit=args.ann_limit, max_cases=args.max_cases,
    )
    print(json.dumps({
        "cases": len(payload["cases"]), "rows": len(payload["rows"]),
        "ann_only_rows": sum(int(case["ann_only_count"]) for case in payload["cases"]),
    }, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
