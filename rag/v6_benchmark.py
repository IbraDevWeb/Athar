from __future__ import annotations

import argparse
import json
import math
import os
import sqlite3
import statistics
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable

# Benchmark baseline must be reproducible. Query Intelligence can be enabled
# explicitly, but the default benchmark measures deterministic retrieval.
os.environ.setdefault("ATHAR_QUERY_LLM_ENABLED", "0")

from v5_engine import normalize_text
from v5_lowmem import ask as ask_monolithic
from v5_sharded import ShardedCorpusRuntime

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DATASET = ROOT / "rag" / "benchmark_v6.json"
DEFAULT_MANIFEST = ROOT / "rag" / "corpus_release_v3.json"
DEFAULT_SHARD_DIR = ROOT / "rag" / "data" / "shards"


def open_readonly(path: Path) -> sqlite3.Connection:
    resolved = path.resolve().as_posix()
    connection = sqlite3.connect(
        f"file:{resolved}?mode=ro&immutable=1",
        uri=True,
        timeout=30,
    )
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA query_only=ON")
    connection.execute("PRAGMA temp_store=FILE")
    connection.execute("PRAGMA cache_size=-8192")
    return connection


def load_dataset(path: Path) -> dict[str, Any]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    cases = payload.get("cases")
    if not isinstance(cases, list) or not cases:
        raise RuntimeError("Le benchmark doit contenir au moins un cas.")
    ids: set[str] = set()
    for case in cases:
        if not isinstance(case, dict):
            raise RuntimeError("Chaque cas du benchmark doit être un objet JSON.")
        case_id = str(case.get("id") or "").strip()
        question = str(case.get("question") or "").strip()
        if not case_id or not question:
            raise RuntimeError("Chaque cas doit fournir id et question.")
        if case_id in ids:
            raise RuntimeError(f"Identifiant de benchmark dupliqué: {case_id}")
        ids.add(case_id)
    return payload


def _source_text(source: dict[str, Any]) -> str:
    return " ".join(
        str(source.get(field) or "")
        for field in ("title", "title_ar", "author", "chapter", "text_ar", "text_fr")
    )


def _matches(text: str, term: str) -> bool:
    haystack = normalize_text(text)
    needle = normalize_text(term)
    return bool(needle and needle in haystack)


def _group_hits(sources: list[dict[str, Any]], groups: list[list[str]]) -> tuple[list[bool], list[int | None]]:
    hits: list[bool] = []
    first_ranks: list[int | None] = []
    for raw_group in groups:
        group = [str(term) for term in raw_group if str(term).strip()]
        found_rank: int | None = None
        for rank, source in enumerate(sources, 1):
            text = _source_text(source)
            if any(_matches(text, term) for term in group):
                found_rank = rank
                break
        hits.append(found_rank is not None)
        first_ranks.append(found_rank)
    return hits, first_ranks


def _first_relevant_rank(sources: list[dict[str, Any]], groups: list[list[str]]) -> int | None:
    if not groups:
        return 1 if sources else None
    required = max(1, math.ceil(len(groups) / 2))
    for rank, source in enumerate(sources, 1):
        text = _source_text(source)
        matched = 0
        for group in groups:
            if any(_matches(text, str(term)) for term in group):
                matched += 1
        if matched >= required:
            return rank
    return None


def _concept_recall(analysis: dict[str, Any], expected: list[str]) -> tuple[float, list[str]]:
    if not expected:
        return 1.0, []
    observed_raw = analysis.get("technical_concepts") or analysis.get("concepts") or []
    observed = {normalize_text(str(item)).replace(" ", "_") for item in observed_raw}
    missing = [
        item
        for item in expected
        if normalize_text(item).replace(" ", "_") not in observed
    ]
    return (len(expected) - len(missing)) / len(expected), missing


def _route_match(analysis: dict[str, Any], expected: str) -> tuple[bool, str]:
    routed = analysis.get("routed_book") or {}
    label = " ".join(
        str(routed.get(field) or "")
        for field in ("title", "author", "id")
    )
    return _matches(label, expected), label.strip()


def _citation_integrity(payload: dict[str, Any]) -> tuple[bool, list[str]]:
    errors: list[str] = []
    sources = list(payload.get("sources") or [])
    citation_ids = [str(source.get("citation_id") or "") for source in sources]
    valid_ids = {item for item in citation_ids if item}
    if len(valid_ids) != len(citation_ids):
        errors.append("source citation_ids missing or duplicated")
    expected_ids = [f"S{index}" for index in range(1, len(sources) + 1)]
    if citation_ids != expected_ids:
        errors.append("source citation_ids are not contiguous S1..Sn")
    answer = payload.get("answer") or {}
    claims = list(answer.get("claims") or [])
    for claim in claims:
        source_ids = [str(item) for item in (claim.get("source_ids") or []) if str(item)]
        if not source_ids:
            errors.append(f"claim {claim.get('id') or '?'} has no source_id")
            continue
        unknown = sorted(set(source_ids) - valid_ids)
        if unknown:
            errors.append(f"claim {claim.get('id') or '?'} references unknown {unknown}")
    return not errors, errors


def _provenance_rate(sources: list[dict[str, Any]]) -> float:
    if not sources:
        return 1.0
    present = sum(1 for source in sources if str(source.get("source_url") or "").strip())
    return present / len(sources)


def percentile(values: list[float], p: float) -> float:
    if not values:
        return 0.0
    ordered = sorted(values)
    if len(ordered) == 1:
        return ordered[0]
    position = (len(ordered) - 1) * p
    lower = math.floor(position)
    upper = math.ceil(position)
    if lower == upper:
        return ordered[lower]
    fraction = position - lower
    return ordered[lower] * (1 - fraction) + ordered[upper] * fraction


def evaluate_case(
    case: dict[str, Any],
    ask_fn: Callable[..., dict[str, Any]],
    *,
    limit: int,
) -> dict[str, Any]:
    started = time.perf_counter()
    error = ""
    try:
        payload = ask_fn(
            str(case["question"]),
            limit=limit,
            madhhab=str(case.get("madhhab") or ""),
            discipline=str(case.get("discipline") or ""),
        )
    except Exception as exc:
        payload = {"sources": [], "analysis": {}, "answer": {}}
        error = f"{type(exc).__name__}: {exc}"
    elapsed_ms = (time.perf_counter() - started) * 1000.0

    sources = list(payload.get("sources") or [])
    analysis = dict(payload.get("analysis") or {})
    groups = [
        [str(term) for term in group]
        for group in (case.get("expected_term_groups") or [])
        if isinstance(group, list) and group
    ]
    group_hits, group_ranks = _group_hits(sources, groups)
    group_recall = sum(group_hits) / len(group_hits) if group_hits else 1.0
    first_rank = _first_relevant_rank(sources, groups)
    reciprocal_rank = 1.0 / first_rank if first_rank else 0.0

    expected_concepts = [str(item) for item in (case.get("expected_concepts") or [])]
    concept_recall, missing_concepts = _concept_recall(analysis, expected_concepts)

    route_expected = str(case.get("expected_route_contains") or "").strip()
    route_ok, routed_label = (True, "")
    if route_expected:
        route_ok, routed_label = _route_match(analysis, route_expected)

    citation_ok, citation_errors = _citation_integrity(payload)
    provenance_rate = _provenance_rate(sources)
    expect_no_evidence = bool(case.get("expect_no_evidence"))
    evidence_ok = (not sources) if expect_no_evidence else bool(sources)

    return {
        "id": case["id"],
        "category": case.get("category") or "other",
        "question": case["question"],
        "soft": bool(case.get("soft")),
        "error": error,
        "latency_ms": round(elapsed_ms, 2),
        "source_count": len(sources),
        "evidence_ok": evidence_ok,
        "expect_no_evidence": expect_no_evidence,
        "group_recall": round(group_recall, 4),
        "group_hits": group_hits,
        "group_first_ranks": group_ranks,
        "first_relevant_rank": first_rank,
        "reciprocal_rank": round(reciprocal_rank, 4),
        "concept_recall": round(concept_recall, 4),
        "missing_concepts": missing_concepts,
        "route_expected": route_expected,
        "route_ok": route_ok,
        "routed_label": routed_label,
        "citation_integrity": citation_ok,
        "citation_errors": citation_errors,
        "provenance_rate": round(provenance_rate, 4),
        "retrieval_mode": analysis.get("retrieval_mode"),
        "storage_mode": analysis.get("storage_mode"),
        "candidate_count": int(analysis.get("candidate_count") or 0),
        "semantic_embeddings": bool(analysis.get("semantic_embeddings")),
    }


def aggregate(results: list[dict[str, Any]]) -> dict[str, Any]:
    hard = [item for item in results if not item["soft"]]
    positives = [item for item in hard if not item["expect_no_evidence"]]
    negatives = [item for item in hard if item["expect_no_evidence"]]
    term_cases = [item for item in positives if item["group_hits"]]
    concept_cases = [item for item in positives if item.get("_has_expected_concepts")]
    route_cases = [item for item in positives if item["route_expected"]]

    evidence_rate = (
        sum(1 for item in positives if item["source_count"] > 0) / len(positives)
        if positives else 1.0
    )
    abstention_rate = (
        sum(1 for item in negatives if item["source_count"] == 0) / len(negatives)
        if negatives else 1.0
    )
    group_recall = statistics.fmean(item["group_recall"] for item in term_cases) if term_cases else 1.0
    mrr = statistics.fmean(item["reciprocal_rank"] for item in term_cases) if term_cases else 1.0
    route_accuracy = (
        sum(1 for item in route_cases if item["route_ok"]) / len(route_cases)
        if route_cases else 1.0
    )
    concept_recall = statistics.fmean(item["concept_recall"] for item in concept_cases) if concept_cases else 1.0
    citation_integrity = sum(1 for item in hard if item["citation_integrity"]) / len(hard) if hard else 1.0
    provenance_rate = statistics.fmean(item["provenance_rate"] for item in positives) if positives else 1.0
    error_rate = sum(1 for item in hard if item["error"]) / len(hard) if hard else 0.0

    latencies = [float(item["latency_ms"]) for item in hard if not item["error"]]
    composite = 100.0 * (
        0.28 * group_recall
        + 0.18 * mrr
        + 0.14 * route_accuracy
        + 0.12 * concept_recall
        + 0.10 * citation_integrity
        + 0.08 * evidence_rate
        + 0.05 * provenance_rate
        + 0.05 * abstention_rate
    )
    composite *= max(0.0, 1.0 - error_rate)

    return {
        "cases": len(results),
        "hard_cases": len(hard),
        "soft_cases": len(results) - len(hard),
        "positive_cases": len(positives),
        "negative_cases": len(negatives),
        "evidence_rate": round(evidence_rate, 4),
        "abstention_rate": round(abstention_rate, 4),
        "evidence_group_recall_at_k": round(group_recall, 4),
        "evidence_mrr": round(mrr, 4),
        "route_accuracy": round(route_accuracy, 4),
        "concept_recall": round(concept_recall, 4),
        "citation_integrity_rate": round(citation_integrity, 4),
        "provenance_rate": round(provenance_rate, 4),
        "error_rate": round(error_rate, 4),
        "latency_ms": {
            "mean": round(statistics.fmean(latencies), 2) if latencies else 0.0,
            "p50": round(percentile(latencies, 0.50), 2),
            "p95": round(percentile(latencies, 0.95), 2),
            "max": round(max(latencies), 2) if latencies else 0.0,
        },
        "composite_score_100": round(composite, 2),
    }


def markdown_report(report: dict[str, Any]) -> str:
    metrics = report["metrics"]
    lines = [
        "# Athar Research — Benchmark V6",
        "",
        f"- Généré : `{report['generated_at']}`",
        f"- Dataset : `{report['dataset_version']}`",
        f"- Runtime : `{report['runtime']}`",
        f"- Limite : top `{report['limit']}` passages",
        f"- Score composite : **{metrics['composite_score_100']} / 100**",
        "",
        "## Métriques",
        "",
        "| Métrique | Valeur |",
        "|---|---:|",
        f"| Evidence rate | {metrics['evidence_rate']:.1%} |",
        f"| Abstention rate (cas négatifs) | {metrics['abstention_rate']:.1%} |",
        f"| Evidence-group recall@K (proxy lexical) | {metrics['evidence_group_recall_at_k']:.1%} |",
        f"| Evidence MRR (proxy lexical) | {metrics['evidence_mrr']:.3f} |",
        f"| Routage ouvrage | {metrics['route_accuracy']:.1%} |",
        f"| Rappel des concepts | {metrics['concept_recall']:.1%} |",
        f"| Intégrité des citations | {metrics['citation_integrity_rate']:.1%} |",
        f"| Provenance URL | {metrics['provenance_rate']:.1%} |",
        f"| Erreurs runtime | {metrics['error_rate']:.1%} |",
        f"| Latence p50 | {metrics['latency_ms']['p50']:.0f} ms |",
        f"| Latence p95 | {metrics['latency_ms']['p95']:.0f} ms |",
        "",
        "## Cas à examiner",
        "",
        "| Cas | Sources | Recall groupes | RR | Route | Citations | Latence |",
        "|---|---:|---:|---:|---:|---:|---:|",
    ]
    flagged = [
        item for item in report["results"]
        if item["error"]
        or not item["evidence_ok"]
        or item["group_recall"] < 1.0
        or not item["route_ok"]
        or not item["citation_integrity"]
    ]
    for item in flagged[:40]:
        lines.append(
            f"| `{item['id']}` | {item['source_count']} | {item['group_recall']:.0%} | "
            f"{item['reciprocal_rank']:.2f} | {'✓' if item['route_ok'] else '✗'} | "
            f"{'✓' if item['citation_integrity'] else '✗'} | {item['latency_ms']:.0f} ms |"
        )
    if not flagged:
        lines.append("| Aucun cas signalé | — | — | — | — | — | — |")
    lines.extend([
        "",
        "## Interprétation",
        "",
        "Le `evidence-group recall@K` et le MRR sont des **proxies lexicaux** : ils vérifient que les concepts/termes "
        "attendus apparaissent dans les passages remontés. Ils ne doivent pas être présentés comme un Recall@K "
        "académique tant que chaque question n'a pas de `chunk_id` gold annoté manuellement.",
        "",
        "Le score composite sert à comparer deux versions d'Athar sur **le même dataset et le même corpus**. "
        "Il ne mesure ni la vérité d'un avis religieux ni la fiabilité absolue d'une fatwa.",
        "",
    ])
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description="Benchmark reproductible Athar Research V6.")
    parser.add_argument("--dataset", type=Path, default=DEFAULT_DATASET)
    parser.add_argument("--db", type=Path, default=None, help="Base SQLite monolithique.")
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST)
    parser.add_argument("--shard-dir", type=Path, default=DEFAULT_SHARD_DIR)
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument("--output-json", type=Path, default=None)
    parser.add_argument("--output-md", type=Path, default=None)
    parser.add_argument("--fail-under", type=float, default=None, help="Seuil de score composite sur 100.")
    parser.add_argument("--require-citation-integrity", action="store_true")
    parser.add_argument("--enable-query-llm", action="store_true")
    args = parser.parse_args()

    if args.enable_query_llm:
        os.environ["ATHAR_QUERY_LLM_ENABLED"] = "1"
    else:
        os.environ["ATHAR_QUERY_LLM_ENABLED"] = "0"

    dataset_path = args.dataset if args.dataset.is_absolute() else (ROOT / args.dataset)
    dataset = load_dataset(dataset_path)
    limit = args.limit or int(dataset.get("default_limit") or 10)
    limit = max(1, min(limit, 20))

    connection: sqlite3.Connection | None = None
    if args.db is not None:
        db_path = args.db if args.db.is_absolute() else ROOT / args.db
        connection = open_readonly(db_path)

        def ask_fn(query: str, **kwargs: Any) -> dict[str, Any]:
            assert connection is not None
            return ask_monolithic(connection, query, **kwargs)

        runtime_name = f"monolithic:{db_path.name}"
    else:
        manifest = args.manifest if args.manifest.is_absolute() else ROOT / args.manifest
        shard_dir = args.shard_dir if args.shard_dir.is_absolute() else ROOT / args.shard_dir
        runtime = ShardedCorpusRuntime(manifest, shard_dir)
        runtime.validate()
        ask_fn = runtime.ask
        runtime_name = f"sharded:{len(runtime.shard_paths)}"

    results: list[dict[str, Any]] = []
    try:
        for index, case in enumerate(dataset["cases"], 1):
            result = evaluate_case(case, ask_fn, limit=limit)
            result["_has_expected_concepts"] = bool(case.get("expected_concepts"))
            results.append(result)
            print(
                f"[{index:02d}/{len(dataset['cases']):02d}] {result['id']}: "
                f"sources={result['source_count']} recall={result['group_recall']:.0%} "
                f"rr={result['reciprocal_rank']:.2f} route={'ok' if result['route_ok'] else 'fail'} "
                f"citations={'ok' if result['citation_integrity'] else 'fail'} "
                f"{result['latency_ms']:.0f}ms"
            )
    finally:
        if connection is not None:
            connection.close()

    # Internal helper is not part of the persisted report.
    metrics = aggregate(results)
    for item in results:
        item.pop("_has_expected_concepts", None)

    report = {
        "version": "6.0",
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "dataset": str(dataset_path),
        "dataset_version": str(dataset.get("version") or ""),
        "dataset_notice": str(dataset.get("notice") or ""),
        "runtime": runtime_name,
        "query_llm_enabled": args.enable_query_llm,
        "limit": limit,
        "metrics": metrics,
        "results": results,
    }
    print(json.dumps(metrics, ensure_ascii=False, indent=2))

    if args.output_json:
        output_json = args.output_json if args.output_json.is_absolute() else ROOT / args.output_json
        output_json.parent.mkdir(parents=True, exist_ok=True)
        output_json.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    if args.output_md:
        output_md = args.output_md if args.output_md.is_absolute() else ROOT / args.output_md
        output_md.parent.mkdir(parents=True, exist_ok=True)
        output_md.write_text(markdown_report(report) + "\n", encoding="utf-8")

    failures: list[str] = []
    if args.require_citation_integrity and metrics["citation_integrity_rate"] < 1.0:
        failures.append(
            f"citation_integrity_rate={metrics['citation_integrity_rate']:.4f} < 1.0"
        )
    if args.fail_under is not None and metrics["composite_score_100"] < args.fail_under:
        failures.append(
            f"composite_score={metrics['composite_score_100']:.2f} < {args.fail_under:.2f}"
        )
    if metrics["error_rate"] > 0:
        failures.append(f"error_rate={metrics['error_rate']:.4f} > 0")

    if failures:
        print("BENCHMARK FAILED:", "; ".join(failures))
        return 1
    print("ATHAR RESEARCH BENCHMARK V6: COMPLETE")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
