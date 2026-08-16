from __future__ import annotations

import argparse
import json
import os
import sqlite3
import statistics
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import numpy as np

os.environ.setdefault("ATHAR_QUERY_LLM_ENABLED", "0")

import v61_benchmark as v61
import v63_benchmark as v63
from v5_sharded import ShardedCorpusRuntime
from v63_hybrid import DEFAULT_MODEL
from v63_semantic_release import build_release
from v63c_ann_index import GlobalAnnIndex
from v63c_shadow import AnnFusionConfig, AnnShadowRuntime

ROOT = Path(__file__).resolve().parents[1]


def rooted(path: Path) -> Path:
    return path if path.is_absolute() else ROOT / path


def _mean(values: list[float]) -> float:
    return round(statistics.fmean(values), 6) if values else 0.0


def _percentile(values: list[float], q: float) -> float:
    if not values:
        return 0.0
    ordered = sorted(values)
    pos = (len(ordered) - 1) * q
    lo, hi = int(pos), min(int(pos) + 1, len(ordered) - 1)
    frac = pos - lo
    return ordered[lo] * (1 - frac) + ordered[hi] * frac


def _evaluate_shadow(case: dict[str, Any], runtime: AnnShadowRuntime, limit: int) -> dict[str, Any]:
    started = time.perf_counter()
    try:
        payload = runtime.ask(
            str(case["question"]), limit=limit,
            madhhab=str(case.get("madhhab") or ""),
            discipline=str(case.get("discipline") or ""),
        )
        error = ""
    except Exception as exc:
        payload = {"sources": [], "analysis": {}, "answer": {}}
        error = f"{type(exc).__name__}: {exc}"
    latency = (time.perf_counter() - started) * 1000.0
    row = v61.evaluate(case, lambda _query, **_kwargs: payload, limit)
    row["latency_ms"] = round(latency, 2)
    if error:
        row["error"] = error
    analysis = dict(payload.get("analysis") or {})
    row["ann_query_ms"] = float(analysis.get("ann_query_ms") or 0.0)
    row["ann_candidate_count"] = int(analysis.get("ann_candidate_count") or 0)
    row["ann_only_candidate_count"] = int(analysis.get("ann_only_candidate_count") or 0)
    row["ann_promotion_allowed"] = bool(analysis.get("ann_promotion_allowed"))
    row["shadow_ann_ids"] = [str(x.get("id") or "") for x in payload.get("shadow_ann_sources") or []]
    row["shadow_ann_only_ids"] = [str(x.get("id") or "") for x in payload.get("shadow_ann_only_sources") or []]
    return row


def _chunk_ids_for_rows(meta_path: Path, rows: list[int]) -> dict[int, str]:
    if not rows:
        return {}
    conn = sqlite3.connect(f"file:{meta_path.resolve().as_posix()}?mode=ro", uri=True)
    conn.row_factory = sqlite3.Row
    try:
        result: dict[int, str] = {}
        for start in range(0, len(rows), 400):
            batch = rows[start:start + 400]
            marks = ",".join("?" for _ in batch)
            found = conn.execute(
                f"SELECT row_index, chunk_id FROM semantic_rows WHERE row_index IN ({marks})", batch
            ).fetchall()
            for row in found:
                result[int(row["row_index"])] = str(row["chunk_id"])
        return result
    finally:
        conn.close()


def exact_global_topk(semantic_dir: Path, release: dict[str, Any], query_vector: np.ndarray, top_k: int) -> list[tuple[str, float]]:
    q = np.asarray(query_vector, dtype=np.float32)
    q = q / max(float(np.linalg.norm(q)), 1e-12)
    best: list[tuple[str, float]] = []
    for shard in release["shards"]:
        vectors = np.load(semantic_dir / str(shard["vectors_file"]), mmap_mode="r")
        local_best: list[tuple[int, float]] = []
        block_size = 8192
        for start in range(0, int(vectors.shape[0]), block_size):
            end = min(start + block_size, int(vectors.shape[0]))
            block = np.asarray(vectors[start:end], dtype=np.float32)
            scores = block @ q
            k = min(top_k, len(scores))
            indexes = np.argpartition(scores, -k)[-k:]
            local_best.extend((start + int(i), float(scores[int(i)])) for i in indexes)
            local_best = sorted(local_best, key=lambda item: item[1], reverse=True)[:top_k]
        row_to_chunk = _chunk_ids_for_rows(
            semantic_dir / str(shard["metadata_file"]), [row for row, _ in local_best]
        )
        for row_index, score in local_best:
            chunk_id = row_to_chunk.get(row_index)
            if chunk_id:
                best.append((chunk_id, score))
        best = sorted(best, key=lambda item: item[1], reverse=True)[:top_k]
    return best


def ann_recall(runtime: AnnShadowRuntime, semantic_dir: Path, release: dict[str, Any], cases: list[dict[str, Any]], count: int, top_k: int) -> dict[str, Any]:
    rows: list[dict[str, Any]] = []
    for case in [x for x in cases if not bool(x.get("expect_no_evidence"))][:count]:
        qvec = runtime._embed_query(str(case["question"]))
        started = time.perf_counter()
        ann = runtime.ann.search(qvec, top_k=top_k)
        ann_ms = (time.perf_counter() - started) * 1000.0
        exact = exact_global_topk(semantic_dir, release, qvec, top_k)
        ann_ids = [str(row["chunk_id"]) for row in ann]
        exact_ids = [chunk_id for chunk_id, _ in exact]
        recall = len(set(ann_ids) & set(exact_ids)) / max(1, len(exact_ids))
        top1 = bool(exact_ids and ann_ids and exact_ids[0] == ann_ids[0])
        rows.append({
            "case_id": str(case["id"]), "recall_at_k": round(recall, 4),
            "top1_exact": top1, "ann_ms": round(ann_ms, 3),
            "ann_ids": ann_ids, "exact_ids": exact_ids,
        })
        print(f"[ANN exact] {case['id']} recall@{top_k}={recall:.0%} ann={ann_ms:.2f}ms")
    values = [float(row["recall_at_k"]) for row in rows]
    latencies = [float(row["ann_ms"]) for row in rows]
    return {
        "cases": len(rows), "top_k": top_k,
        "mean_recall_at_k": _mean(values),
        "min_recall_at_k": min(values) if values else 0.0,
        "top1_accuracy": _mean([1.0 if row["top1_exact"] else 0.0 for row in rows]),
        "ann_latency_ms": {
            "mean": round(_mean(latencies), 3),
            "p50": round(_percentile(latencies, 0.5), 3),
            "p95": round(_percentile(latencies, 0.95), 3),
            "max": round(max(latencies), 3) if latencies else 0.0,
        },
        "results": rows,
    }


def markdown(report: dict[str, Any]) -> str:
    b = report["baseline_metrics"]
    c = report["v63c_metrics"]
    ar = report["ann_exact_recall"]
    shadow = report["shadow"]
    return "\n".join([
        "# Athar Research — V6.3-C Global ANN Shadow Benchmark", "",
        f"- Corpus : **{report['ann_vectors']:,} passages**",
        f"- ANN : `{report['ann_library']} {report['ann_library_version']}` · cosine · f16",
        f"- Dataset régression : **{report['cases']} cas**",
        f"- Régressions qualité : **{len(report['regressions'])}**", "",
        "## Qualité fusionnée", "",
        "| Mesure | V6.1 | V6.3-C shadow/fusion |", "|---|---:|---:|",
        f"| Score composite | {b['composite_score_100']:.1f} | {c['composite_score_100']:.1f} |",
        f"| Evidence | {b['evidence_rate']:.1%} | {c['evidence_rate']:.1%} |",
        f"| Abstention | {b['abstention_rate']:.1%} | {c['abstention_rate']:.1%} |",
        f"| Gold chunk Recall@K | {b['gold_chunk_recall_at_k']:.1%} | {c['gold_chunk_recall_at_k']:.1%} |",
        f"| Pureté madhhab | {b['madhhab_purity_at_k']:.1%} | {c['madhhab_purity_at_k']:.1%} |",
        f"| Citations | {b['citation_integrity_rate']:.1%} | {c['citation_integrity_rate']:.1%} |", "",
        "## ANN vs recherche dense exacte", "",
        f"- Cas exacts : **{ar['cases']}**",
        f"- Recall@{ar['top_k']} moyen : **{ar['mean_recall_at_k']:.1%}**",
        f"- Recall@{ar['top_k']} minimum : **{ar['min_recall_at_k']:.1%}**",
        f"- Top-1 identique : **{ar['top1_accuracy']:.1%}**",
        f"- Recherche ANN seule : moyenne **{ar['ann_latency_ms']['mean']:.2f} ms**, p95 **{ar['ann_latency_ms']['p95']:.2f} ms**", "",
        "## Valeur du shadow mode", "",
        f"- Cas avec au moins un nouveau passage ANN : **{shadow['cases_with_ann_only']} / {report['cases']}**",
        f"- Nouveaux couples question/passage ANN : **{shadow['ann_only_pairs']}**",
        f"- Cas d'abstention ayant des candidats ANN observables mais non promus : **{shadow['abstained_with_shadow_candidates']}**",
        "",
        "V6.3-C ne renverse jamais une abstention V6.1 dans ce mode. Les passages ANN-only servent au benchmark et au futur pool Human Gold avant toute promotion en production.", "",
    ])


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--dataset", type=Path, required=True)
    p.add_argument("--manifest", type=Path, required=True)
    p.add_argument("--shard-dir", type=Path, required=True)
    p.add_argument("--semantic-index-dir", type=Path, required=True)
    p.add_argument("--ann-manifest", type=Path, required=True)
    p.add_argument("--candidate-limit", type=int, default=20)
    p.add_argument("--ann-limit", type=int, default=40)
    p.add_argument("--ann-oversample", type=int, default=160)
    p.add_argument("--ann-recall-cases", type=int, default=30)
    p.add_argument("--ann-recall-k", type=int, default=10)
    p.add_argument("--min-ann-recall", type=float, default=0.95)
    p.add_argument("--output-json", type=Path)
    p.add_argument("--output-md", type=Path)
    p.add_argument("--fail-on-regression", action="store_true")
    args = p.parse_args()

    dataset = v61.load_dataset(rooted(args.dataset))
    manifest_path = rooted(args.manifest)
    shard_dir = rooted(args.shard_dir)
    semantic_dir = rooted(args.semantic_index_dir)
    ann_manifest = rooted(args.ann_manifest)
    semantic_release = build_release(manifest_path, semantic_dir)
    base = ShardedCorpusRuntime(manifest_path, shard_dir)
    base.validate()
    ann = GlobalAnnIndex(ann_manifest)
    runtime = AnnShadowRuntime(
        base, ann, model_name=DEFAULT_MODEL,
        config=AnnFusionConfig(
            lexical_limit=max(1, min(int(args.candidate_limit), 20)),
            ann_limit=max(1, int(args.ann_limit)),
            ann_oversample=max(int(args.ann_limit), int(args.ann_oversample)),
        ),
    )
    runtime.validate()
    list(runtime.model.query_embed(["warmup Athar global ANN"]))
    limit = max(1, min(int(dataset.get("default_limit") or 10), 20))

    try:
        baseline_results = []
        shadow_results = []
        for index, case in enumerate(dataset["cases"], 1):
            baseline = v61.evaluate(case, base.ask, limit)
            baseline_results.append(baseline)
            shadow = _evaluate_shadow(case, runtime, limit)
            shadow_results.append(shadow)
            print(
                f"[{index:03d}/{len(dataset['cases']):03d}] {case['id']} "
                f"base={baseline['source_count']} c={shadow['source_count']} "
                f"ann_only={shadow['ann_only_candidate_count']} latency={shadow['latency_ms']:.1f}ms"
            )

        baseline_metrics = v61.aggregate(baseline_results)
        v63c_metrics = v61.aggregate(shadow_results)
        regressions = v63.regressions(baseline_metrics, v63c_metrics)
        comparison = v63.compare_results(baseline_results, shadow_results)
        exact = ann_recall(
            runtime, semantic_dir, semantic_release, list(dataset["cases"]),
            max(1, int(args.ann_recall_cases)), max(1, int(args.ann_recall_k)),
        )
        cases_with_ann_only = sum(row["ann_only_candidate_count"] > 0 for row in shadow_results)
        ann_only_pairs = sum(row["ann_only_candidate_count"] for row in shadow_results)
        abstained_shadow = sum(
            (not row["ann_promotion_allowed"]) and bool(row["shadow_ann_ids"])
            for row in shadow_results
        )
        report = {
            "version": "6.3-C-shadow",
            "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
            "cases": len(dataset["cases"]),
            "ann_library": "usearch",
            "ann_library_version": str(ann.manifest.get("usearch_version") or ""),
            "ann_vectors": int(ann.manifest.get("vectors") or 0),
            "ann_manifest": ann.manifest,
            "baseline_metrics": baseline_metrics,
            "v63c_metrics": v63c_metrics,
            "baseline_vs_v63c": comparison,
            "ann_exact_recall": exact,
            "shadow": {
                "cases_with_ann_only": cases_with_ann_only,
                "ann_only_pairs": ann_only_pairs,
                "abstained_with_shadow_candidates": abstained_shadow,
            },
            "regressions": regressions,
            "baseline_results": baseline_results,
            "v63c_results": shadow_results,
        }
        print(json.dumps({
            "baseline": baseline_metrics,
            "v63c": v63c_metrics,
            "ann_exact_recall": {k: v for k, v in exact.items() if k != "results"},
            "shadow": report["shadow"], "regressions": regressions,
        }, ensure_ascii=False, indent=2))

        if args.output_json:
            path = rooted(args.output_json); path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        if args.output_md:
            path = rooted(args.output_md); path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(markdown(report), encoding="utf-8")

        failures: list[str] = []
        if args.fail_on_regression:
            failures.extend(regressions)
            if float(exact["mean_recall_at_k"]) < float(args.min_ann_recall):
                failures.append(
                    f"ANN Recall@{exact['top_k']} {exact['mean_recall_at_k']:.3f} < {args.min_ann_recall:.3f}"
                )
            if failures:
                print("V6.3-C refusée:")
                for failure in failures:
                    print(f"- {failure}")
                return 2
        return 0
    finally:
        ann.close()


if __name__ == "__main__":
    raise SystemExit(main())
