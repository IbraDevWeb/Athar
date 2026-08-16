from __future__ import annotations

import argparse
import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable

os.environ.setdefault("ATHAR_QUERY_LLM_ENABLED", "0")

import v61_benchmark as v61
import v63_benchmark as v63
from v5_sharded import ShardedCorpusRuntime
from v63_hybrid import DEFAULT_MODEL, FusionConfig, HybridSemanticRuntime
from v63_semantic_index import SemanticIndexCollection

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_MANIFEST = ROOT / "rag" / "corpus_release_v3.json"
DEFAULT_SHARD_DIR = ROOT / "rag" / "data" / "shards"


def _resolve(path: Path) -> Path:
    return path if path.is_absolute() else ROOT / path


def _latency(metrics: dict[str, Any], key: str) -> float:
    latency = metrics.get("latency_ms") or {}
    value = latency.get(key)
    return float(value) if isinstance(value, (int, float)) else 0.0


def _evaluate_all(
    dataset: dict[str, Any],
    ask_fn: Callable[..., dict[str, Any]],
    limit: int,
    label: str,
) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    total = len(dataset["cases"])
    for index, case in enumerate(dataset["cases"], 1):
        row = v61.evaluate(case, ask_fn, limit)
        row["_has_expected_concepts"] = bool(case.get("expected_concepts"))
        rows.append(row)
        print(f"[{label} {index:03d}/{total:03d}] {row['id']} sources={row['source_count']} latency={row['latency_ms']:.1f}ms")
    return rows


def _aggregate(rows: list[dict[str, Any]]) -> dict[str, Any]:
    metrics = v61.aggregate(rows)
    for row in rows:
        row.pop("_has_expected_concepts", None)
    return metrics


def _quality_regressions(base: dict[str, Any], candidate: dict[str, Any]) -> list[str]:
    return v63.regressions(base, candidate)


def _fmt_ms(value: float) -> str:
    return f"{value:.1f} ms"


def markdown(report: dict[str, Any]) -> str:
    base = report["baseline_metrics"]
    online = report["online_metrics"]
    pre = report["precomputed_metrics"]
    ab = report["online_vs_precomputed"]
    speed = report["latency_speedup"]

    lines = [
        "# Athar Research — V6.3-B Precomputed Semantic Benchmark",
        "",
        f"- Dataset : **{report['cases']} cas**",
        f"- Modèle : `{report['semantic_model']}`",
        f"- Index sémantique : **{report['semantic_index_shards']} shards**",
        f"- Couverture embeddings pré-calculés : **{report['precomputed_coverage_rate']:.1%}**",
        f"- Régressions qualité V6.1 → V6.3-B : **{len(report['regressions'])}**",
        "",
        "## Qualité",
        "",
        "| Métrique | V6.1 | V6.3-A online | V6.3-B pré-calculée |",
        "|---|---:|---:|---:|",
    ]
    quality = [
        ("Score composite", "composite_score_100", False),
        ("Evidence", "evidence_rate", True),
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

    for label, key, pct in quality:
        lines.append(f"| {label} | {fmt(base.get(key), pct)} | {fmt(online.get(key), pct)} | {fmt(pre.get(key), pct)} |")

    lines += [
        "",
        "## Latence",
        "",
        "| Mesure | V6.1 | V6.3-A online | V6.3-B pré-calculée |",
        "|---|---:|---:|---:|",
        f"| Moyenne | {_fmt_ms(_latency(base, 'mean'))} | {_fmt_ms(_latency(online, 'mean'))} | {_fmt_ms(_latency(pre, 'mean'))} |",
        f"| p50 | {_fmt_ms(_latency(base, 'p50'))} | {_fmt_ms(_latency(online, 'p50'))} | {_fmt_ms(_latency(pre, 'p50'))} |",
        f"| p95 | {_fmt_ms(_latency(base, 'p95'))} | {_fmt_ms(_latency(online, 'p95'))} | {_fmt_ms(_latency(pre, 'p95'))} |",
        f"| max | {_fmt_ms(_latency(base, 'max'))} | {_fmt_ms(_latency(online, 'max'))} | {_fmt_ms(_latency(pre, 'max'))} |",
        "",
        f"Accélération moyenne V6.3-A → V6.3-B : **{speed['mean_x']:.2f}×**.",
        f"Réduction de latence moyenne du stade sémantique : **{speed['mean_reduction_pct']:.1%}**.",
        "",
        "## Fidélité V6.3-A → V6.3-B",
        "",
        f"- Classements différents : **{ab['ranking_changed_cases']} / {report['cases']}**",
        f"- Top-1 différents : **{ab['top1_changed_cases']}**",
        f"- Gold chunks améliorés : **{ab['gold_rank_improved_cases']}**",
        f"- Gold chunks dégradés : **{ab['gold_rank_degraded_cases']}**",
        f"- Jaccard moyen @K : **{ab['mean_jaccard_at_k']:.4f}**",
        "",
        "## Garde-fous",
        "",
    ]
    if report["regressions"]:
        lines.extend(f"- Régression: `{item}`" for item in report["regressions"])
    else:
        lines.append("Aucune régression sur les métriques de qualité surveillées.")
    if report["precomputed_coverage_misses"]:
        lines.append(f"- Couverture incomplète sur {len(report['precomputed_coverage_misses'])} requête(s).")
    else:
        lines.append("Tous les passages candidats éligibles ont utilisé leurs embeddings pré-calculés.")
    lines += [
        "",
        "La V6.3-B reste un reranking des candidats admis par V6.1. Ce benchmark ne démontre pas encore un gain de rappel global ; celui-ci sera mesuré séparément avec la future récupération ANN et le Human Gold V6.2.",
        "",
    ]
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dataset", type=Path, required=True)
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST)
    parser.add_argument("--shard-dir", type=Path, default=DEFAULT_SHARD_DIR)
    parser.add_argument("--semantic-index-dir", type=Path, required=True)
    parser.add_argument("--model", default=DEFAULT_MODEL)
    parser.add_argument("--candidate-limit", type=int, default=20)
    parser.add_argument("--output-json", type=Path)
    parser.add_argument("--output-md", type=Path)
    parser.add_argument("--fail-on-regression", action="store_true")
    args = parser.parse_args()

    dataset = v61.load_dataset(_resolve(args.dataset))
    manifest_path = _resolve(args.manifest)
    shard_dir = _resolve(args.shard_dir)
    index_dir = _resolve(args.semantic_index_dir)
    corpus_manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    book_to_shard = {str(k): str(v) for k, v in (corpus_manifest.get("book_to_shard") or {}).items()}
    expected_shards = [str(row.get("id") or "") for row in corpus_manifest.get("shards") or []]
    if not expected_shards:
        raise RuntimeError("Le manifeste corpus ne déclare aucun shard.")
    missing_manifests = [shard for shard in expected_shards if not (index_dir / f"{shard}.semantic.json").exists()]
    if missing_manifests:
        raise RuntimeError(f"Index sémantique incomplet: {missing_manifests}")

    limit = max(1, min(int(dataset.get("default_limit") or 10), 20))
    config = FusionConfig(candidate_limit=max(limit, min(int(args.candidate_limit), 20)))
    base = ShardedCorpusRuntime(manifest_path, shard_dir)
    base.validate()
    store = SemanticIndexCollection(index_dir, book_to_shard)
    online = HybridSemanticRuntime(base, model_name=str(args.model), config=config)
    precomputed = HybridSemanticRuntime(base, model_name=str(args.model), config=config, embedding_store=store)
    online.validate()
    precomputed.validate()

    # One shared, warmed model makes the A/B latency comparison measure passage
    # encoding versus lookup, instead of counting model download/initialization.
    model = online.model
    list(model.query_embed(["warmup Athar semantic benchmark"]))
    online._model = model
    precomputed._model = model

    coverage_checks = 0
    coverage_misses: list[str] = []

    def precomputed_ask(query: str, **kwargs: Any) -> dict[str, Any]:
        nonlocal coverage_checks
        payload = precomputed.ask(query, **kwargs)
        sources = list(payload.get("sources") or [])
        analysis = dict(payload.get("analysis") or {})
        if len(sources) > 1:
            coverage_checks += 1
            if analysis.get("semantic_vector_source") != "precomputed":
                coverage_misses.append(query)
        return payload

    try:
        print("=== V6.1 baseline ===")
        baseline_results = _evaluate_all(dataset, base.ask, limit, "B")
        print("=== V6.3-A online ===")
        online_results = _evaluate_all(dataset, online.ask, limit, "A")
        print("=== V6.3-B precomputed ===")
        precomputed_results = _evaluate_all(dataset, precomputed_ask, limit, "P")

        baseline_metrics = _aggregate(baseline_results)
        online_metrics = _aggregate(online_results)
        precomputed_metrics = _aggregate(precomputed_results)
        regressions = _quality_regressions(baseline_metrics, precomputed_metrics)
        online_vs_precomputed = v63.compare_results(online_results, precomputed_results)
        baseline_vs_precomputed = v63.compare_results(baseline_results, precomputed_results)

        online_mean = _latency(online_metrics, "mean")
        pre_mean = _latency(precomputed_metrics, "mean")
        speedup = (online_mean / pre_mean) if pre_mean > 0 else 0.0
        reduction = ((online_mean - pre_mean) / online_mean) if online_mean > 0 else 0.0
        coverage_rate = 1.0 if coverage_checks == 0 else (coverage_checks - len(coverage_misses)) / coverage_checks

        report = {
            "version": "6.3-B",
            "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
            "dataset_version": str(dataset.get("version") or ""),
            "cases": len(dataset["cases"]),
            "semantic_model": str(args.model),
            "semantic_index_shards": len(expected_shards),
            "precomputed_coverage_checks": coverage_checks,
            "precomputed_coverage_rate": round(coverage_rate, 6),
            "precomputed_coverage_misses": coverage_misses,
            "baseline_metrics": baseline_metrics,
            "online_metrics": online_metrics,
            "precomputed_metrics": precomputed_metrics,
            "baseline_vs_precomputed": baseline_vs_precomputed,
            "online_vs_precomputed": online_vs_precomputed,
            "latency_speedup": {
                "mean_x": round(speedup, 4),
                "mean_reduction_pct": round(reduction, 6),
            },
            "regressions": regressions,
            "baseline_results": baseline_results,
            "online_results": online_results,
            "precomputed_results": precomputed_results,
        }

        print(json.dumps({
            "baseline": baseline_metrics,
            "online": online_metrics,
            "precomputed": precomputed_metrics,
            "coverage_rate": report["precomputed_coverage_rate"],
            "online_vs_precomputed": {k: v for k, v in online_vs_precomputed.items() if k != "changed_cases"},
            "latency_speedup": report["latency_speedup"],
            "regressions": regressions,
        }, ensure_ascii=False, indent=2))

        if args.output_json:
            output = _resolve(args.output_json)
            output.parent.mkdir(parents=True, exist_ok=True)
            output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        if args.output_md:
            output = _resolve(args.output_md)
            output.parent.mkdir(parents=True, exist_ok=True)
            output.write_text(markdown(report), encoding="utf-8")

        if args.fail_on_regression:
            failures = list(regressions)
            if coverage_misses:
                failures.append(f"precomputed coverage misses: {len(coverage_misses)}")
            if online_vs_precomputed.get("gold_rank_degraded_cases", 0):
                failures.append(
                    f"gold rank degraded A->B: {online_vs_precomputed['gold_rank_degraded_cases']}"
                )
            if failures:
                print("V6.3-B refusée:")
                for item in failures:
                    print(f"- {item}")
                return 2
        return 0
    finally:
        store.close()


if __name__ == "__main__":
    raise SystemExit(main())
