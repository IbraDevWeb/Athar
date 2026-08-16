from __future__ import annotations

"""Deterministically split a blind V6.3-D review pool into balanced case batches.

A question/case is never split across primary batches. This keeps all candidate
passages for one question together while balancing total row counts. An optional
calibration pack duplicates a deterministic subset of complete cases for a
second independent reviewer; engine/private benchmark metadata remain absent.
"""

import argparse
import csv
import hashlib
import json
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def read_csv(path: Path) -> tuple[list[dict[str, str]], list[str]]:
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        fields = list(reader.fieldnames or [])
        rows = [dict(row) for row in reader]
    if not rows or "case_id" not in fields or "chunk_id" not in fields:
        raise RuntimeError("Pool reviewer invalide.")
    forbidden = {
        "category",
        "expect_no_evidence",
        "retrieval_origin",
        "lexical_rank",
        "semantic_rank",
        "ann_rank",
        "ann_similarity",
        "ann_distance",
        "rrf_score",
    }
    leaked = sorted(set(fields) & forbidden)
    if leaked:
        raise RuntimeError(f"Le pool n'est pas aveugle: {leaked}")
    return rows, fields


def stable_key(value: str) -> str:
    return hashlib.sha256(f"athar-v63d-batch\0{value}".encode("utf-8")).hexdigest()


def write_csv(path: Path, fields: list[str], rows: list[dict[str, str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def assign(
    *,
    pool_path: Path,
    output_dir: Path,
    batches: int = 8,
    calibration_cases: int = 20,
) -> dict[str, Any]:
    rows, fields = read_csv(pool_path)
    batches = max(1, int(batches))
    grouped: dict[str, list[dict[str, str]]] = defaultdict(list)
    for row in rows:
        case_id = str(row.get("case_id") or "").strip()
        if not case_id:
            raise RuntimeError("case_id manquant dans le pool.")
        grouped[case_id].append(row)

    # Largest-first greedy bin packing with a deterministic SHA tie-breaker.
    cases = sorted(grouped, key=lambda cid: (-len(grouped[cid]), stable_key(cid)))
    bins: list[list[str]] = [[] for _ in range(batches)]
    loads = [0 for _ in range(batches)]
    for case_id in cases:
        target = min(range(batches), key=lambda i: (loads[i], i))
        bins[target].append(case_id)
        loads[target] += len(grouped[case_id])

    output_dir.mkdir(parents=True, exist_ok=True)
    batch_summary: list[dict[str, Any]] = []
    all_primary_keys: set[tuple[str, str]] = set()
    for idx, case_ids in enumerate(bins, 1):
        batch_rows: list[dict[str, str]] = []
        for case_id in sorted(case_ids, key=stable_key):
            batch_rows.extend(grouped[case_id])
        filename = f"v63d-review-batch-{idx:02d}.csv"
        write_csv(output_dir / filename, fields, batch_rows)
        keys = {
            (str(row.get("case_id") or ""), str(row.get("chunk_id") or ""))
            for row in batch_rows
        }
        overlap = all_primary_keys & keys
        if overlap:
            raise RuntimeError(f"Chevauchement primaire inattendu dans {filename}")
        all_primary_keys |= keys
        batch_summary.append(
            {
                "batch": idx,
                "file": filename,
                "cases": len(case_ids),
                "rows": len(batch_rows),
            }
        )

    expected = {
        (str(row.get("case_id") or ""), str(row.get("chunk_id") or "")) for row in rows
    }
    if all_primary_keys != expected:
        raise RuntimeError("Les lots primaires ne couvrent pas exactement le pool.")

    calibration_cases = max(0, min(int(calibration_cases), len(grouped)))
    calibration_ids = sorted(grouped, key=stable_key)[:calibration_cases]
    calibration_rows: list[dict[str, str]] = []
    for case_id in calibration_ids:
        calibration_rows.extend(grouped[case_id])
    calibration_file = "v63d-review-calibration-double.csv"
    write_csv(output_dir / calibration_file, fields, calibration_rows)

    manifest = {
        "version": "6.3-d-review-assignment-1",
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "source_pool": pool_path.name,
        "policy": {
            "primary_case_split": False,
            "primary_overlap": False,
            "balancing": "largest-case-first greedy by row count; deterministic SHA256 tie-break",
            "calibration_selection": "deterministic SHA256 case sample",
            "calibration_is_optional_second_review": True,
            "reviewer_blindness_preserved": True,
        },
        "pool": {"cases": len(grouped), "rows": len(rows)},
        "batches": batch_summary,
        "calibration": {
            "file": calibration_file,
            "cases": len(calibration_ids),
            "rows": len(calibration_rows),
        },
        "load": {
            "min_rows": min(loads) if loads else 0,
            "max_rows": max(loads) if loads else 0,
            "spread_rows": (max(loads) - min(loads)) if loads else 0,
        },
    }
    (output_dir / "v63d-review-assignment.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    return manifest


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--pool", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--batches", type=int, default=8)
    parser.add_argument("--calibration-cases", type=int, default=20)
    args = parser.parse_args()
    manifest = assign(
        pool_path=args.pool,
        output_dir=args.output_dir,
        batches=args.batches,
        calibration_cases=args.calibration_cases,
    )
    print(json.dumps(manifest, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
