from __future__ import annotations

import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAG = ROOT / "rag"


def load(name: str) -> dict:
    return json.loads((RAG / name).read_text(encoding="utf-8"))


def main() -> None:
    registry = load("madhhab_scholar_targets.json")
    targets = load("corpus_priority_targets.json")
    benchmark = load("topic_plurality_benchmark.json")

    schools = registry.get("schools") or []
    assert len(schools) == 4
    expected = {"Ḥanafite", "Mālikite", "Shāfiʿite", "Ḥanbalite"}
    assert {school["madhhab"] for school in schools} == expected

    scholar_ids: list[str] = []
    for school in schools:
        scholars = school.get("scholars") or []
        assert school.get("target_count") == 25
        assert len(scholars) == 25
        assert all(row.get("name") for row in scholars)
        scholar_ids.extend(str(row["id"]) for row in scholars)
    assert len(scholar_ids) == 100
    assert len(scholar_ids) == len(set(scholar_ids))

    rows = [row for row in targets.get("targets") or [] if isinstance(row, dict)]
    p1 = [row for row in rows if row.get("priority") == "P1"]
    p2 = [row for row in rows if row.get("priority") == "P2"]
    assert len(p1) == 13
    assert len(p2) >= 40
    counts = Counter(row.get("madhhab") for row in p2)
    for madhhab in expected:
        assert counts[madhhab] >= 10, (madhhab, counts[madhhab])
    for row in p2:
        assert row.get("required") is False
        direct = bool(row.get("work_markers"))
        paired = bool(row.get("author_markers")) and bool(row.get("title_markers"))
        assert direct or paired, row["id"]

    topics = {row["id"]: row for row in benchmark.get("topics") or []}
    assert "mawlid" in topics
    assert len(topics) >= 10
    mawlid = topics["mawlid"]
    assert mawlid.get("queries_fr") and mawlid.get("queries_ar")
    assert "المولد" in " ".join(mawlid.get("lexical_hints_ar") or [])
    goals = mawlid.get("goals") or {}
    assert int(goals.get("min_unique_authors_when_available") or 0) >= 5
    assert int(goals.get("min_madhhabs_when_available") or 0) >= 3

    print(
        "Madhhab corpus expansion contract: OK — "
        f"100 scholar targets, {len(p2)} optional P2 works, {len(topics)} plurality topics."
    )


if __name__ == "__main__":
    main()
