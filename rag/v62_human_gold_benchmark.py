from __future__ import annotations

"""Evaluate Athar retrieval against human relevance judgements (qrels)."""

import argparse
import json
import math
import statistics
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from v5_sharded import ShardedCorpusRuntime
from v61_benchmark import load_dataset
from v62_human_gold import validate_qrels

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_MANIFEST = ROOT / "rag" / "corpus_release_v3.json"
DEFAULT_SHARD_DIR = ROOT / "rag" / "data" / "shards"


def rooted(path: Path) -> Path:
    return path if path.is_absolute() else ROOT / path


def mean(values: list[float]) -> float | None:
    return round(statistics.fmean(values), 4) if values else None


def dcg(grades: list[int]) -> float:
    return sum((2**grade - 1) / math.log2(rank + 1) for rank, grade in enumerate(grades, 1))


def ndcg_at_k(retrieved_ids: list[str], qrels: dict[str, int], k: int) -> float:
    observed = [int(qrels.get(chunk_id, 0)) for chunk_id in retrieved_ids[:k]]
    ideal = sorted((int(grade) for grade in qrels.values()), reverse=True)[:k]
    denominator = dcg(ideal)
    if denominator <= 0:
        return 1.0 if not any(observed) else 0.0
    return dcg(observed) / denominator


def reciprocal_rank(retrieved_ids: list[str], relevant: set[str]) -> float:
    for rank, chunk_id in enumerate(retrieved_ids, 1):
        if chunk_id in relevant:
            return 1.0 / rank
    return 0.0


def recall_at_k(retrieved_ids: list[str], relevant: set[str], k: int) -> float:
    if not relevant:
        return 1.0
    return sum(chunk_id in relevant for chunk_id in retrieved_ids[:k]) / len(relevant)


def markdown(report: dict[str, Any]) -> str:
    metrics = report["metrics"]
    pct = lambda value: "—" if value is None else f"{value:.1%}"
    lines = [
        "# Athar Research — Human Gold V6.2", "",
        f"- Cas annotés : **{metrics['cases']}**",
        f"- Cas positifs : **{metrics['positive_cases']}**",
        f"- Cas négatifs : **{metrics['negative_cases']}**",
        f"- Recall@5 : **{pct(metrics['recall_at_5'])}**",
        f"- Recall@10 : **{pct(metrics['recall_at_10'])}**",
        f"- MRR : **{metrics['mrr']:.3f}**",
        f"- nDCG@10 : **{metrics['ndcg_at_10']:.3f}**",
        f"- Abstention négative : **{pct(metrics['negative_abstention'])}**", "",
        "| Cas | R@5 | R@10 | MRR | nDCG@10 | Sources |",
        "|---|---:|---:|---:|---:|---:|",
    ]
    for row in report["results"]:
        lines.append(
            f"| `{row['case_id']}` | {row['recall_at_5']:.0%} | {row['recall_at_10']:.0%} | "
            f"{row['mrr']:.3f} | {row['ndcg_at_10']:.3f} | {row['source_count']} |"
        )
    lines += [
        "",
        "Ces métriques mesurent le retrieval contre les jugements humains fournis. Elles ne constituent pas un score de vérité religieuse.",
        "",
    ]
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dataset", type=Path, required=True)
    parser.add_argument("--qrels", type=Path, required=True)
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST)
    parser.add_argument("--shard-dir", type=Path, default=DEFAULT_SHARD_DIR)
    parser.add_argument("--limit", type=int, default=10)
    parser.add_argument("--output-json", type=Path)
    parser.add_argument("--output-md", type=Path)
    args = parser.parse_args()

    dataset = load_dataset(rooted(args.dataset))
    qrels_payload = validate_qrels(rooted(args.qrels))
    dataset_by_id = {str(case["id"]): case for case in dataset["cases"]}
    runtime = ShardedCorpusRuntime(rooted(args.manifest), rooted(args.shard_dir))
    runtime.validate()
    limit = max(10, min(int(args.limit), 20))

    results: list[dict[str, Any]] = []
    for index, qcase in enumerate(qrels_payload["cases"], 1):
        case_id = str(qcase["case_id"])
        case = dataset_by_id.get(case_id)
        if case is None:
            raise RuntimeError(f"Qrels référence un cas absent du dataset: {case_id}")
        judgements = {str(j["chunk_id"]): int(j["grade"]) for j in qcase["judgements"]}
        relevant = {chunk_id for chunk_id, grade in judgements.items() if grade > 0}
        start = time.perf_counter()
        payload = runtime.search(
            str(case["question"]),
            limit=limit,
            madhhab=str(case.get("madhhab") or ""),
            discipline=str(case.get("discipline") or ""),
        )
        latency_ms = (time.perf_counter() - start) * 1000
        source_ids = [str(source.get("id") or "") for source in payload.get("sources") or []]
        negative = bool(qcase.get("expect_no_evidence"))
        row = {
            "case_id": case_id,
            "question": str(case["question"]),
            "negative": negative,
            "source_count": len(source_ids),
            "source_ids": source_ids,
            "relevant_count": len(relevant),
            "recall_at_5": round(recall_at_k(source_ids, relevant, 5), 4) if not negative else 1.0,
            "recall_at_10": round(recall_at_k(source_ids, relevant, 10), 4) if not negative else 1.0,
            "mrr": round(reciprocal_rank(source_ids, relevant), 4) if not negative else (1.0 if not source_ids else 0.0),
            "ndcg_at_10": round(ndcg_at_k(source_ids, judgements, 10), 4) if not negative else (1.0 if not source_ids else 0.0),
            "abstained": not bool(source_ids),
            "latency_ms": round(latency_ms, 2),
        }
        results.append(row)
        print(
            f"[{index:03d}/{len(qrels_payload['cases']):03d}] {case_id} "
            f"R10={row['recall_at_10']:.0%} MRR={row['mrr']:.3f} nDCG={row['ndcg_at_10']:.3f}"
        )

    positives = [row for row in results if not row["negative"]]
    negatives = [row for row in results if row["negative"]]
    metrics = {
        "cases": len(results),
        "positive_cases": len(positives),
        "negative_cases": len(negatives),
        "recall_at_5": mean([row["recall_at_5"] for row in positives]),
        "recall_at_10": mean([row["recall_at_10"] for row in positives]),
        "mrr": mean([row["mrr"] for row in positives]) or 0.0,
        "ndcg_at_10": mean([row["ndcg_at_10"] for row in positives]) or 0.0,
        "negative_abstention": mean([1.0 if row["abstained"] else 0.0 for row in negatives]),
        "latency_ms_mean": mean([row["latency_ms"] for row in results]),
    }
    report = {
        "version": "6.2-human-gold-1",
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "dataset_version": str(dataset.get("version") or ""),
        "qrels_version": str(qrels_payload.get("version") or ""),
        "metrics": metrics,
        "results": results,
    }
    print(json.dumps(metrics, ensure_ascii=False, indent=2))
    if args.output_json:
        path = rooted(args.output_json)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    if args.output_md:
        path = rooted(args.output_md)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(markdown(report), encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
