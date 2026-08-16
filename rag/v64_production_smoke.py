from __future__ import annotations

"""Run the promoted disk-view V6.3-C adapter against the fixed 200-case suite."""

import argparse
import json
import os
import time
from pathlib import Path
from statistics import mean
from typing import Any

os.environ.setdefault("ATHAR_QUERY_LLM_ENABLED", "0")

from v5_engine import normalize_text
from v5_sharded import ShardedCorpusRuntime
from v61_benchmark import load_dataset
from v64_production import V64ProductionRuntime

ROOT = Path(__file__).resolve().parents[1]


def rooted(path: Path) -> Path:
    return path if path.is_absolute() else ROOT / path


def pct(values: list[float], q: float) -> float:
    if not values:
        return 0.0
    ordered = sorted(values)
    idx = min(len(ordered) - 1, max(0, int(round((len(ordered) - 1) * q))))
    return float(ordered[idx])


def strict(value: str) -> bool:
    return normalize_text(value) not in {"", "all", "tous", "toutes", "auto", "automatique"}


def run(
    dataset_path: Path,
    manifest_path: Path,
    shard_dir: Path,
    ann_manifest: Path,
    output_json: Path,
    output_md: Path,
) -> dict[str, Any]:
    dataset = load_dataset(dataset_path)
    base = ShardedCorpusRuntime(manifest_path, shard_dir)
    base.validate()
    prod = V64ProductionRuntime(
        base,
        configured_engine="v63c",
        ann_manifest=ann_manifest,
        fail_open=False,
        debug_ann=False,
    )
    prod.validate()
    runtime = prod._ensure_runtime()
    if runtime is None:
        raise RuntimeError("V6.3-C production n'a pas pu être initialisée.")
    list(runtime.model.query_embed(["Athar V6.4 production smoke warmup"]))

    latencies: list[float] = []
    failures: list[str] = []
    changed_top1 = 0
    changed_rankings = 0
    positive_cases = 0
    negative_cases = 0
    routed_cases = 0
    madhhab_cases = 0
    per_case: list[dict[str, Any]] = []

    try:
        for idx, case in enumerate(dataset.get("cases") or [], 1):
            case_id = str(case.get("id") or f"case-{idx}")
            query = str(case.get("question") or "")
            madhhab = str(case.get("madhhab") or "")
            discipline = str(case.get("discipline") or "")
            kwargs = {"madhhab": madhhab, "discipline": discipline}
            base_result = base.search(query, limit=10, **kwargs)
            started = time.perf_counter()
            result = prod.search(query, limit=10, **kwargs)
            elapsed = (time.perf_counter() - started) * 1000.0
            latencies.append(elapsed)

            base_sources = list(base_result.get("sources") or [])
            sources = list(result.get("sources") or [])
            analysis = dict(result.get("analysis") or {})
            base_ids = [str(x.get("id") or "") for x in base_sources]
            ids = [str(x.get("id") or "") for x in sources]
            expected_negative = bool(case.get("expect_no_evidence"))

            case_failures: list[str] = []
            if analysis.get("retrieval_engine_active") != prod.ENGINE:
                case_failures.append("engine_not_v63c")
            if analysis.get("retrieval_fallback") is not False:
                case_failures.append("unexpected_fallback")
            if analysis.get("ann_shadow_mode") is not False:
                case_failures.append("shadow_mode_not_disabled")
            if "shadow_ann_sources" in result or "shadow_ann_only_sources" in result:
                case_failures.append("shadow_payload_leak")

            if expected_negative:
                negative_cases += 1
                if sources:
                    case_failures.append("negative_case_promoted_evidence")
            else:
                positive_cases += 1
                if base_sources and not sources:
                    case_failures.append("lost_v61_evidence")

            base_routed = (base_result.get("analysis") or {}).get("routed_book") or {}
            routed = analysis.get("routed_book") or {}
            if isinstance(base_routed, dict) and str(base_routed.get("id") or ""):
                routed_cases += 1
                if not isinstance(routed, dict) or str(routed.get("id") or "") != str(base_routed.get("id") or ""):
                    case_failures.append("book_route_changed")

            if strict(madhhab):
                madhhab_cases += 1
                wanted = normalize_text(madhhab)
                for source in sources:
                    actual = normalize_text(source.get("madhhab") or "")
                    if not actual or wanted not in actual:
                        case_failures.append("madhhab_filter_leak")
                        break

            seen: set[str] = set()
            for rank, source in enumerate(sources, 1):
                chunk_id = str(source.get("id") or "")
                if not chunk_id or chunk_id in seen:
                    case_failures.append("invalid_or_duplicate_chunk")
                    break
                seen.add(chunk_id)
                if str(source.get("citation_id") or "") != f"S{rank}":
                    case_failures.append("citation_sequence_invalid")
                    break
                if not str(source.get("book_id") or "") or not str(source.get("title") or ""):
                    case_failures.append("canonical_metadata_missing")
                    break

            if base_ids[:1] != ids[:1]:
                changed_top1 += 1
            if base_ids != ids:
                changed_rankings += 1
            if case_failures:
                failures.extend(f"{case_id}: {item}" for item in case_failures)
            per_case.append(
                {
                    "case_id": case_id,
                    "latency_ms": round(elapsed, 3),
                    "base_count": len(base_sources),
                    "v64_count": len(sources),
                    "ranking_changed": base_ids != ids,
                    "top1_changed": base_ids[:1] != ids[:1],
                    "failures": case_failures,
                }
            )
            print(f"[{idx:03d}/{len(dataset.get('cases') or []):03d}] {case_id} {elapsed:.1f}ms failures={len(case_failures)}")
    finally:
        prod.close_ann()

    report = {
        "version": "6.4-production-smoke-1",
        "cases": len(per_case),
        "positive_cases": positive_cases,
        "negative_cases": negative_cases,
        "routed_cases": routed_cases,
        "madhhab_cases": madhhab_cases,
        "failures": failures,
        "failure_count": len(failures),
        "rankings_changed": changed_rankings,
        "top1_changed": changed_top1,
        "latency_ms": {
            "mean": round(mean(latencies), 3) if latencies else 0.0,
            "p50": round(pct(latencies, 0.50), 3),
            "p95": round(pct(latencies, 0.95), 3),
            "max": round(max(latencies), 3) if latencies else 0.0,
        },
        "per_case": per_case,
    }
    output_json.parent.mkdir(parents=True, exist_ok=True)
    output_json.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    lines = [
        "# Athar V6.4 production smoke",
        "",
        f"- Cas : **{report['cases']}**",
        f"- Échecs : **{report['failure_count']}**",
        f"- Rankings modifiés vs V6.1 : **{changed_rankings}**",
        f"- Top-1 modifiés : **{changed_top1}**",
        f"- Latence moyenne : **{report['latency_ms']['mean']:.2f} ms**",
        f"- Latence p95 : **{report['latency_ms']['p95']:.2f} ms**",
        "",
        "Le smoke vérifie le contrat de production (fallback, abstention, routage, madhhab et citations), pas le verdict humain déjà établi séparément.",
    ]
    output_md.write_text("\n".join(lines) + "\n", encoding="utf-8")
    if failures:
        raise RuntimeError(f"V6.4 production smoke refusé: {len(failures)} échec(s). Premier: {failures[0]}")
    return report


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dataset", type=Path, required=True)
    parser.add_argument("--manifest", type=Path, required=True)
    parser.add_argument("--shard-dir", type=Path, required=True)
    parser.add_argument("--ann-manifest", type=Path, required=True)
    parser.add_argument("--output-json", type=Path, required=True)
    parser.add_argument("--output-md", type=Path, required=True)
    args = parser.parse_args()
    run(
        rooted(args.dataset), rooted(args.manifest), rooted(args.shard_dir),
        rooted(args.ann_manifest), rooted(args.output_json), rooted(args.output_md),
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
