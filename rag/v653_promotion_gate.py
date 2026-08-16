from __future__ import annotations

"""Evidence-preserving promotion gate for the low-memory sharded ANN.

A sharded HNSW is a different approximate graph from the accepted monolithic
HNSW, so byte-for-byte rank identity is not a meaningful quality requirement.
Promotion remains strict on what matters to users and to the Human-Gold winner:
- identical final Top-1 evidence;
- every accepted V6.3-C Top-5 passage must remain in the candidate Top-10;
- at least 80% Top-10 overlap per positive case;
- unchanged V6.1 abstention, routing, madhhab purity and canonical citations.
The separate dense-exact benchmark remains mandatory and requires >=95% ANN
Recall@10 with zero V6.1/V6.3-C technical regressions.
"""

import argparse
import json
import time
from pathlib import Path
from statistics import mean
from typing import Any

from v5_engine import normalize_text
from v5_sharded import ShardedCorpusRuntime
from v61_benchmark import load_dataset
from v64_production import V64ProductionRuntime
from v651_remote_fusion import RemoteSemanticClient, V651RemoteFusionRuntime

ROOT = Path(__file__).resolve().parents[1]


def rooted(path: Path) -> Path:
    return path if path.is_absolute() else ROOT / path


def strict(value: str) -> bool:
    return normalize_text(value) not in {"", "all", "tous", "toutes", "auto", "automatique"}


def run(
    *,
    dataset_path: Path,
    manifest_path: Path,
    shard_dir: Path,
    accepted_ann_manifest: Path,
    semantic_url: str,
    semantic_token: str,
    output_json: Path,
) -> dict[str, Any]:
    dataset = load_dataset(dataset_path)
    base = ShardedCorpusRuntime(manifest_path, shard_dir)
    base.validate()
    accepted = V64ProductionRuntime(
        base,
        configured_engine="v63c",
        ann_manifest=accepted_ann_manifest,
        fail_open=False,
        debug_ann=False,
    )
    accepted.validate()
    accepted.warmup()
    client = RemoteSemanticClient(semantic_url, token=semantic_token, connect_timeout=2.0, read_timeout=30.0)
    candidate = V651RemoteFusionRuntime(base, client, fail_open=False)
    candidate.validate(require_remote=True)

    failures: list[str] = []
    rows: list[dict[str, Any]] = []
    overlaps: list[float] = []
    top1_matches = 0
    top5_preserved = 0
    negative_cases = 0
    routed_cases = 0
    madhhab_cases = 0
    accepted_ms: list[float] = []
    candidate_ms: list[float] = []

    try:
        cases = list(dataset.get("cases") or [])
        for index, case in enumerate(cases, 1):
            case_id = str(case.get("id") or f"case-{index}")
            query = str(case.get("question") or "")
            madhhab = str(case.get("madhhab") or "")
            discipline = str(case.get("discipline") or "")
            kwargs = {"madhhab": madhhab, "discipline": discipline}

            started = time.perf_counter()
            left = accepted.search(query, limit=10, **kwargs)
            accepted_elapsed = (time.perf_counter() - started) * 1000.0
            accepted_ms.append(accepted_elapsed)
            started = time.perf_counter()
            right = candidate.search(query, limit=10, **kwargs)
            candidate_elapsed = (time.perf_counter() - started) * 1000.0
            candidate_ms.append(candidate_elapsed)

            left_sources = list(left.get("sources") or [])
            right_sources = list(right.get("sources") or [])
            left_ids = [str(item.get("id") or "") for item in left_sources]
            right_ids = [str(item.get("id") or "") for item in right_sources]
            case_failures: list[str] = []
            expected_negative = bool(case.get("expect_no_evidence"))
            analysis = dict(right.get("analysis") or {})

            if len(right_sources) > 10:
                case_failures.append("candidate_limit_exceeded")
            if analysis.get("semantic_remote_fallback") is True:
                case_failures.append("unexpected_remote_fallback")
            if analysis.get("engine") != candidate.ENGINE:
                case_failures.append("wrong_candidate_engine")

            if expected_negative:
                negative_cases += 1
                if left_sources or right_sources:
                    case_failures.append("abstention_changed")
                if analysis.get("semantic_remote_called") is not False:
                    case_failures.append("semantic_called_on_v61_abstention")
                overlap = 1.0
                top1_equal = True
                preserves_top5 = True
            else:
                top1_equal = bool(left_ids and right_ids and left_ids[0] == right_ids[0])
                if top1_equal:
                    top1_matches += 1
                else:
                    case_failures.append("top1_changed")
                wanted_top5 = [item for item in left_ids[:5] if item]
                preserves_top5 = all(item in set(right_ids[:10]) for item in wanted_top5)
                if preserves_top5:
                    top5_preserved += 1
                else:
                    case_failures.append("accepted_top5_not_preserved")
                left_set = set(left_ids[:10])
                right_set = set(right_ids[:10])
                denom = max(1, len(left_set | right_set))
                overlap = len(left_set & right_set) / denom
                overlaps.append(overlap)
                if overlap < 0.80:
                    case_failures.append("top10_overlap_below_80pct")

            left_route = (left.get("analysis") or {}).get("routed_book") or {}
            right_route = analysis.get("routed_book") or {}
            if isinstance(left_route, dict) and str(left_route.get("id") or ""):
                routed_cases += 1
                if not isinstance(right_route, dict) or str(right_route.get("id") or "") != str(left_route.get("id") or ""):
                    case_failures.append("route_changed")

            if strict(madhhab):
                madhhab_cases += 1
                wanted = normalize_text(madhhab)
                for source in right_sources:
                    actual = normalize_text(source.get("madhhab") or "")
                    if not actual or wanted not in actual:
                        case_failures.append("madhhab_leak")
                        break

            for rank, source in enumerate(right_sources, 1):
                if str(source.get("citation_id") or "") != f"S{rank}":
                    case_failures.append("citation_sequence_invalid")
                    break
                if not str(source.get("id") or "") or not str(source.get("book_id") or "") or not str(source.get("title") or ""):
                    case_failures.append("canonical_metadata_missing")
                    break

            failures.extend(f"{case_id}: {reason}" for reason in case_failures)
            rows.append({
                "case_id": case_id,
                "accepted_ids": left_ids,
                "candidate_ids": right_ids,
                "top1_equal": top1_equal,
                "accepted_top5_preserved": preserves_top5,
                "top10_jaccard": round(overlap, 4),
                "failures": case_failures,
            })
            print(
                f"[{index:03d}/{len(cases):03d}] {case_id} top1={top1_equal} "
                f"top5={preserves_top5} overlap={overlap:.2%} failures={case_failures}",
                flush=True,
            )

        # Prove fail-open is exactly V6.1 at the caller's requested limit.
        positive = next(case for case in cases if not bool(case.get("expect_no_evidence")))
        query = str(positive["question"])
        kwargs = {"madhhab": str(positive.get("madhhab") or ""), "discipline": str(positive.get("discipline") or "")}
        expected = base.search(query, limit=8, **kwargs)
        dead = RemoteSemanticClient("http://127.0.0.1:1", connect_timeout=0.2, read_timeout=0.5)
        fallback = V651RemoteFusionRuntime(base, dead, fail_open=True)
        try:
            got = fallback.search(query, limit=8, **kwargs)
        finally:
            fallback.close()
        expected_ids = [str(x.get("id") or "") for x in expected.get("sources") or []]
        got_ids = [str(x.get("id") or "") for x in got.get("sources") or []]
        if got_ids != expected_ids:
            failures.append("fail_open: output differs from V6.1")
        if len(got_ids) > 8:
            failures.append("fail_open: requested limit exceeded")
        if (got.get("analysis") or {}).get("semantic_remote_fallback") is not True:
            failures.append("fail_open: fallback marker missing")
    finally:
        candidate.close()
        accepted.close_ann()

    positive_cases = len(rows) - negative_cases
    report = {
        "version": "6.5.3-evidence-preserving-promotion-gate-1",
        "cases": len(rows),
        "positive_cases": positive_cases,
        "negative_cases": negative_cases,
        "top1_match_rate": top1_matches / max(1, positive_cases),
        "accepted_top5_preservation_rate": top5_preserved / max(1, positive_cases),
        "mean_top10_jaccard": mean(overlaps) if overlaps else 1.0,
        "min_top10_jaccard": min(overlaps) if overlaps else 1.0,
        "routed_cases": routed_cases,
        "madhhab_cases": madhhab_cases,
        "accepted_latency_mean_ms": mean(accepted_ms) if accepted_ms else 0.0,
        "candidate_latency_mean_ms": mean(candidate_ms) if candidate_ms else 0.0,
        "failure_count": len(failures),
        "failures": failures,
        "per_case": rows,
    }
    output_json.parent.mkdir(parents=True, exist_ok=True)
    output_json.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({k:v for k,v in report.items() if k != "per_case"}, ensure_ascii=False, indent=2))
    if failures:
        raise RuntimeError(f"V6.5.3 promotion refusée: {len(failures)} échec(s). Premier: {failures[0]}")
    return report


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--dataset", type=Path, required=True)
    p.add_argument("--manifest", type=Path, required=True)
    p.add_argument("--shard-dir", type=Path, required=True)
    p.add_argument("--accepted-ann-manifest", type=Path, required=True)
    p.add_argument("--semantic-url", required=True)
    p.add_argument("--semantic-token", default="")
    p.add_argument("--output-json", type=Path, required=True)
    args = p.parse_args()
    run(
        dataset_path=rooted(args.dataset), manifest_path=rooted(args.manifest), shard_dir=rooted(args.shard_dir),
        accepted_ann_manifest=rooted(args.accepted_ann_manifest), semantic_url=args.semantic_url,
        semantic_token=args.semantic_token, output_json=rooted(args.output_json),
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
