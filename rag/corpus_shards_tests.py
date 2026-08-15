from __future__ import annotations

import unittest

from corpus_shards import build_registry, plan_shards


def book(index: int, *, chars: int = 100, discipline: str = "Fiqh") -> dict[str, object]:
    return {
        "book_id": f"book-{index}",
        "title": f"Livre {index}",
        "title_ar": f"كتاب {index}",
        "author": "Auteur",
        "discipline": discipline,
        "enabled": True,
        "metadata": {
            "source_char_length": chars,
            "classification_subject": discipline.lower(),
        },
    }


class CorpusShardTests(unittest.TestCase):
    def test_count_limit_creates_deterministic_shards(self) -> None:
        rows = [book(index) for index in range(1, 6)]
        shards = plan_shards(rows, max_books_per_shard=2, max_source_chars_per_shard=10_000)
        self.assertEqual([item["id"] for item in shards], ["openiti-001", "openiti-002", "openiti-003"])
        self.assertEqual([[row["book_id"] for row in item["books"]] for item in shards], [["book-1", "book-2"], ["book-3", "book-4"], ["book-5"]])

    def test_character_budget_is_respected_between_books(self) -> None:
        rows = [book(1, chars=600), book(2, chars=600), book(3, chars=200)]
        shards = plan_shards(rows, max_books_per_shard=10, max_source_chars_per_shard=1_000)
        self.assertEqual(len(shards), 2)
        self.assertEqual(shards[0]["source_chars"], 600)
        self.assertEqual(shards[1]["source_chars"], 800)

    def test_single_oversized_book_is_flagged_not_split(self) -> None:
        shards = plan_shards([book(1, chars=2_000)], max_books_per_shard=10, max_source_chars_per_shard=1_000)
        self.assertEqual(len(shards), 1)
        self.assertTrue(shards[0]["oversize_source"])
        self.assertEqual(shards[0]["book_count"], 1)

    def test_append_only_growth_keeps_existing_assignments(self) -> None:
        initial = [book(index) for index in range(1, 5)]
        grown = [*initial, book(5), book(6)]
        first = plan_shards(initial, max_books_per_shard=2, max_source_chars_per_shard=10_000)
        second = plan_shards(grown, max_books_per_shard=2, max_source_chars_per_shard=10_000)
        first_mapping = {row["book_id"]: shard["id"] for shard in first for row in shard["books"]}
        second_mapping = {row["book_id"]: shard["id"] for shard in second for row in shard["books"]}
        self.assertEqual(first_mapping, {key: second_mapping[key] for key in first_mapping})

    def test_registry_exposes_book_routing_and_future_target(self) -> None:
        manifest = {"release_commit": "abc123", "books": [book(1), book(2, discipline="Hadith")]}
        policy = {
            "hosted": {"target_openiti_books": 95},
            "sharding": {
                "max_books_per_shard": 1,
                "max_source_chars_per_shard": 1_000,
                "future_target_books": 500,
            },
        }
        registry = build_registry(manifest, policy)
        self.assertEqual(registry["total_books"], 2)
        self.assertEqual(registry["total_shards"], 2)
        self.assertEqual(registry["hosted_target_openiti_books"], 95)
        self.assertEqual(registry["future_target_books"], 500)
        self.assertEqual(registry["book_to_shard"]["book-1"], "openiti-001")
        self.assertEqual(registry["book_to_shard"]["book-2"], "openiti-002")

    def test_duplicate_book_ids_are_rejected(self) -> None:
        with self.assertRaises(RuntimeError):
            plan_shards([book(1), book(1)], max_books_per_shard=10, max_source_chars_per_shard=10_000)


if __name__ == "__main__":
    unittest.main()
