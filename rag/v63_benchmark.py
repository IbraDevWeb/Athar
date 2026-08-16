from __future__ import annotations

import argparse
import json
import os
import statistics
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

os.environ.setdefault("ATHAR_QUERY_LLM_ENABLED", "0")

import v61_benchmark as v61
from v5_sharded import ShardedCorpusRuntime
from v63_hybrid import DEFAULT_MODEL, FusionConfig, HybridSemanticRuntime

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_MANIFEST = ROOT / "rag" / "corpus_release_v3.json"
DEFAULT_SHARD_DIR = ROOT / "rag" / "data" / "shards"

QUALITY_HIGHER_IS_BETTER = (
    "composite_score_100",
    "evidence_rate",
    "abstention_rate",
    "evidence_group_recall_at_k",
    "evidence_mrr",
    "route_accuracy",
    "concept_recall",
    "citation_integrity_rate",
    "provenance_rate",
    "gold_chunk_recall_at_k",
    "gold_chunk_mrr",
    "gold_book_hit_at_k",
    "gold_book_mrr",
    "madhhab_purity_at_k",
)


def _metric(metrics: dict[str, Any], key: str) -> float | None:
    value = metrics.get(key)
    return float(value) if isinstance(value, (int, float)) else None


def _delta(before: float | None, after: float | None) -> float | None:
    if before is None or after is None:
        return None
    return round(after - before, 6)


def _mean(values: list[float]) -> float | None:
    return round(statistics.fmean(values), 4) if values else None


def compare_results(
    baseline_results: list[dict[str, Any]],
    hybrid_results: list[dict[str, Any]],
) -> dict[str, Any]:
    by_id = {str(row["id"]): row for row in baseline_results}
    changes = 0
    top1_changes = 0
    overlaps: list[float] = []
    gold_improved = 0
    gold_degraded = 0
    cases: list[dict[str, Any]] = []

    for hybrid in hybrid_results:
        base = by_id[str(hybrid["id"])]
        before = list(base.get("source_ids") or [])
        after = list(hybrid.get("source_ids") or [])
        changed = before != after
        if changed:
            changes += 1
        if before and after and before[0] != after[0]:
            top1_changes += 1
        union = set(before) | set(after)
        overlap = 1.0 if not union else len(set(before) & set(after)) / len(union)
        overlaps.append(overlap)

        brank = base.get("gold_chunk_first_rank")
        hrank = hybrid.get("gold_chunk_first_rank")
        if isinstance(brank, int) and isinstance(hrank, int):
            if hrank < brank:
                gold_improved += 1
            elif hrank > brank:
                gold_degraded += 1

        if changed:
            cases.append(
                {
                    "id": hybrid["id"],
                    "category": hybrid.get("category"),
                    "baseline_top5": before[:5],
                    "hybrid_top5": after[:5],
                    "baseline_gold_rank": brank,
                    "hybrid_gold_rank": hrank,
                }
            )

    return {
        "ranking_changed_cases": changes,
        "ranking_changed_rate": round(changes / max(len(hybrid_results), 1), 4),
        "top1_changed_cases": top1_changes,
        "mean_jaccard_at_k": _mean(overlaps),
        "gold_rank_improved_cases": gold_improved,
        "gold_rank_degraded_cases": gold_degraded,
        "changed_cases": cases,
    }


def regressions(baseline: dict[str, Any], hybrid: dict[str, Any], tolerance: float = 1e-9) -> list[str]:
    failures: list[str] = []
    for key in QUALITY_HIGHER_IS_BETTER:
        before = _metric(baseline, key)
        after = _metric(hybrid, key)
        if before is None or after is None:
            continue
        if after + tolerance < before:
            failures.append(f"{key}: {before} -> {after}")
    before_errors = _metric(baseline, "runtime_error_rate")
    after_errors = _metric(hybrid, "runtime_error_rate")
    if before_errors is not None and after_errors is not None and after_errors > before_errors + tolerance:
        failures.append(f"runtime_error_rate: {before_errors} -> {after_errors}")
    return failures


def markdown(report: dict[str, Any]) -> str:
    b = report["baseline_metrics"]
    h = report["hybrid_metrics"]
    c = report["comparison"]
    keys = [
        ("Score composite", "composite_score_100", False),
        ("Evidence rate", "evidence_rate", True),
        ("Abstention", "abstention_rate", True),
        ("Recall lexical@10", "evidence_group_recall_at_k", True),
        ("MRR lexical", "evidence_mrr", False),
        ("Concepts", "concept_recall", True),
        ("Gold chunk Recall@10", "gold_chunk_recall_at_k", True),
        ("Gold chunk MRR", "gold_chunk_mrr", False),
        ("Gold book Hit@10", "gold_book_hit_at_k", True),
        ("Pureté madhhab@10", "madhhab_purity_at_k", True),
        ("Citations", "citation_integrity_rate", True),
        ("Provenance", "provenance_rate", True),
    ]

    def fmt(value: Any, pct: bool) -> str:
        if not isinstance(value, (int, float)):
            return "—"
        return f"{float(value):.1%}" if pct else f"{float(value):.4g}"

    lines = [
        "# Athar Research — V6.3-A Hybrid Semantic Benchmark",
        "",
        f"- Dataset : **{report['cases']} cas**",
        f"- Embeddings : `{report['semantic_model']}`",
        "- Stage : reranking sémantique des candidats V6.1 uniquement",
        f"- Régressions qualité : **{len(report['regressions'])}**",
        "",
        "| Métrique | V6.1 | V6.3-A | Delta |",
        "|---|---:|---:|---:|",
    ]
    for label, key, pct in keys:
        bv = b.get(key)
        hv = h.get(key)
        delta = _delta(_metric(b, key), _metric(h, key))
        lines.append(f"| {label} | {fmt(bv, pct)} | {fmt(hv, pct)} | {'—' if delta is None else f'{delta:+.4f}'} |")

    lines += [
        "",
        "## Comportement du reranking",
        "",
        f"- Classement modifié : **{c['ranking_changed_cases']} / {report['cases']}** ({c['ranking_changed_rate']:.1%})",
        f"- Top 1 modifié : **{c['top1_changed_cases']}**",
        f"- Jaccard moyen des listes : **{c['mean_jaccard_at_k']:.3f}**",
        f"- Gold chunks améliorés en rang : **{c['gold_rank_improved_cases']}**",
        f"- Gold chunks dégradés en rang : **{c['gold_rank_degraded_cases']}**",
        "",
        "## Régressions",
        "",
    ]
    if report["regressions"]:
        lines.extend(f"- `{item}`" for item in report["regressions"])
    else:
        lines.append("Aucune régression sur les métriques de qualité surveillées.")
    lines += [
        "",
        "Cette V6.3-A ne mesure pas encore le gain de rappel d'un index vectoriel global : les embeddings ne voient que les candidats déjà admis par V6.1.",
        "Le Human Gold V6.2 reste nécessaire pour départager scientifiquement les moteurs lorsque la V6.3-B ajoutera une vraie récupération ANN.",
        "",
    ]
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dataset", type=Path, required=True)
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST)
    parser.add_argument("--shard-dir", type=Path, default=DEFAULT_SHARD_DIR)
    parser.add_argument("--model", default=DEFAULT_MODEL)
    parser.add_argument("--candidate-limit", type=int, default=20)
    parser.add_argument("--output-json", type=Path)
    parser.add_argument("--output-md", type=Path)
    parser.add_argument("--fail-on-regression", action="store_true")
    args = parser.parse_args()

    dataset_path = args.dataset if args.dataset.is_absolute() else ROOT / args.dataset
    manifest = args.manifest if args.manifest.is_absolute() else ROOT / args.manifest
    shard_dir = args.shard_dir if args.shard_dir.is_absolute() else ROOT / args.shard_dir
    dataset = v61.load_dataset(dataset_path)
    limit = max(1, min(int(dataset.get("default_limit") or 10), 20))

    base = ShardedCorpusRuntime(manifest, shard_dir)
    base.validate()
    hybrid = HybridSemanticRuntime(
        base,
        model_name=str(args.model),
        config=FusionConfig(candidate_limit=max(limit, min(int(args.candidate_limit), 20))),
    )
    hybrid.validate()

    baseline_results: list[dict[str, Any]] = []
    hybrid_results: list[dict[str, Any]] = []
    total = len(dataset["cases"])

    print("=== V6.1 baseline ===")
    for i, case in enumerate(dataset["cases"], 1):
        row = v61.evaluate(case, base.ask, limit)
        row["_has_expected_concepts"] = bool(case.get("expected_concepts"))
        baseline_results.append(row)
        print(f"[B {i:03d}/{total:03d}] {row['id']} sources={row['source_count']}")

    print("=== V6.3-A hybrid ===")
    for i, case in enumerate(dataset["cases"], 1):
        row = v61.evaluate(case, hybrid.ask, limit)
        row["_has_expected_concepts"] = bool(case.get("expected_concepts"))
        hybrid_results.append(row)
        print(f"[H {i:03d}/{total:03d}] {row['id']} sources={row['source_count']}")

    baseline_metrics = v61.aggregate(baseline_results)
    hybrid_metrics = v61.aggregate(hybrid_results)
    for row in baseline_results + hybrid_results:
        row.pop("_has_expected_concepts", None)

    reg = regressions(baseline_metrics, hybrid_metrics)
    comparison = compare_results(baseline_results, hybrid_results)
    report = {
        "version": "6.3-A",
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "dataset_version": str(dataset.get("version") or ""),
        "cases": total,
        "semantic_model": str(args.model),
        "fusion": {
            "method": "weighted_rrf",
            "candidate_limit": hybrid.config.candidate_limit,
            "rrf_k": hybrid.config.rrf_k,
            "lexical_weight": hybrid.config.lexical_weight,
            "semantic_weight": hybrid.config.semantic_weight,
            "anchor_lexical_top1": hybrid.config.anchor_lexical_top1,
        },
        "baseline_metrics": baseline_metrics,
        "hybrid_metrics": hybrid_metrics,
        "comparison": comparison,
        "regressions": reg,
        "baseline_results": baseline_results,
        "hybrid_results": hybrid_results,
    }

    print(json.dumps({
        "baseline": baseline_metrics,
        "hybrid": hybrid_metrics,
        "comparison": {k: v for k, v in comparison.items() if k != "changed_cases"},
        "regressions": reg,
    }, ensure_ascii=False, indent=2))

    if args.output_json:
        out = args.output_json if args.output_json.is_absolute() else ROOT / args.output_json
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    if args.output_md:
        out = args.output_md if args.output_md.is_absolute() else ROOT / args.output_md
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(markdown(report), encoding="utf-8")

    if args.fail_on_regression and reg:
        print("V6.3-A refusée: régression détectée.")
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
