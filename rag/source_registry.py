from __future__ import annotations

import json
import re
import sqlite3
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any

from core import utc_now

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_REGISTRY = ROOT / "rag" / "sources.json"
SOURCE_ID = re.compile(r"^[a-z0-9][a-z0-9_-]{1,47}$")
ALLOWED_KINDS = {"web_catalog", "local_files", "json", "jsonl", "manual", "archive", "pdf"}


@dataclass(frozen=True)
class SourceConfig:
    id: str
    label: str
    kind: str
    enabled: bool
    base_url: str = ""
    rights_status: str = "unknown"
    citation_policy: str = "exact_source_url"
    description: str = ""
    metadata: dict[str, Any] | None = None

    def public_dict(self) -> dict[str, Any]:
        payload = asdict(self)
        payload["metadata"] = dict(self.metadata or {})
        return payload


def _source_from_payload(payload: dict[str, Any]) -> SourceConfig:
    source_id = str(payload.get("id") or "").strip().lower()
    if not SOURCE_ID.fullmatch(source_id):
        raise ValueError(f"Identifiant de source invalide : {source_id!r}")
    label = str(payload.get("label") or "").strip()
    if not label:
        raise ValueError(f"La source {source_id!r} doit avoir un libellé.")
    kind = str(payload.get("kind") or "manual").strip().lower()
    if kind not in ALLOWED_KINDS:
        raise ValueError(f"Type de source non pris en charge pour {source_id!r} : {kind!r}")
    metadata = payload.get("metadata")
    if metadata is not None and not isinstance(metadata, dict):
        raise ValueError(f"metadata doit être un objet pour la source {source_id!r}.")
    return SourceConfig(
        id=source_id,
        label=label,
        kind=kind,
        enabled=bool(payload.get("enabled", False)),
        base_url=str(payload.get("base_url") or "").strip(),
        rights_status=str(payload.get("rights_status") or "unknown").strip(),
        citation_policy=str(payload.get("citation_policy") or "exact_source_url").strip(),
        description=str(payload.get("description") or "").strip(),
        metadata=metadata or {},
    )


def load_source_registry(path: Path | str = DEFAULT_REGISTRY) -> list[SourceConfig]:
    registry_path = Path(path)
    payload = json.loads(registry_path.read_text(encoding="utf-8"))
    raw_sources = payload.get("sources") if isinstance(payload, dict) else None
    if not isinstance(raw_sources, list):
        raise ValueError("Le registre doit contenir une liste 'sources'.")
    sources = [_source_from_payload(item) for item in raw_sources if isinstance(item, dict)]
    ids = [source.id for source in sources]
    if len(ids) != len(set(ids)):
        raise ValueError("Le registre contient des identifiants de source dupliqués.")
    return sources


def get_source(source_id: str, path: Path | str = DEFAULT_REGISTRY) -> SourceConfig:
    wanted = source_id.strip().lower()
    for source in load_source_registry(path):
        if source.id == wanted:
            return source
    raise KeyError(f"Source inconnue : {source_id}")


def initialize_source_registry(connection: sqlite3.Connection) -> None:
    connection.executescript(
        """
        CREATE TABLE IF NOT EXISTS source_catalog (
            id TEXT PRIMARY KEY,
            label TEXT NOT NULL,
            source_kind TEXT NOT NULL,
            base_url TEXT,
            enabled INTEGER NOT NULL DEFAULT 0,
            rights_status TEXT NOT NULL DEFAULT 'unknown',
            citation_policy TEXT NOT NULL DEFAULT 'exact_source_url',
            description TEXT,
            metadata_json TEXT NOT NULL DEFAULT '{}',
            updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS source_documents (
            id TEXT PRIMARY KEY,
            source_id TEXT NOT NULL REFERENCES source_catalog(id) ON DELETE CASCADE,
            external_id TEXT NOT NULL,
            book_id TEXT,
            title TEXT NOT NULL,
            source_url TEXT,
            content_hash TEXT NOT NULL,
            status TEXT NOT NULL,
            passages INTEGER NOT NULL DEFAULT 0,
            imported_at TEXT NOT NULL,
            metadata_json TEXT NOT NULL DEFAULT '{}',
            UNIQUE(source_id, external_id)
        );

        CREATE INDEX IF NOT EXISTS idx_source_documents_source ON source_documents(source_id);
        CREATE INDEX IF NOT EXISTS idx_source_documents_hash ON source_documents(source_id, content_hash);

        CREATE TABLE IF NOT EXISTS source_runs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source_id TEXT NOT NULL REFERENCES source_catalog(id) ON DELETE CASCADE,
            started_at TEXT NOT NULL,
            finished_at TEXT,
            status TEXT NOT NULL,
            attempted_documents INTEGER NOT NULL DEFAULT 0,
            imported_documents INTEGER NOT NULL DEFAULT 0,
            imported_passages INTEGER NOT NULL DEFAULT 0,
            duplicate_documents INTEGER NOT NULL DEFAULT 0,
            failed_documents INTEGER NOT NULL DEFAULT 0,
            message TEXT,
            metadata_json TEXT NOT NULL DEFAULT '{}'
        );

        CREATE INDEX IF NOT EXISTS idx_source_runs_source ON source_runs(source_id, id DESC);
        """
    )
    connection.commit()


def sync_source_registry(
    connection: sqlite3.Connection,
    registry_path: Path | str = DEFAULT_REGISTRY,
) -> list[SourceConfig]:
    initialize_source_registry(connection)
    sources = load_source_registry(registry_path)
    now = utc_now()
    for source in sources:
        connection.execute(
            """
            INSERT INTO source_catalog (
                id, label, source_kind, base_url, enabled, rights_status,
                citation_policy, description, metadata_json, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                label=excluded.label,
                source_kind=excluded.source_kind,
                base_url=excluded.base_url,
                enabled=excluded.enabled,
                rights_status=excluded.rights_status,
                citation_policy=excluded.citation_policy,
                description=excluded.description,
                metadata_json=excluded.metadata_json,
                updated_at=excluded.updated_at
            """,
            (
                source.id,
                source.label,
                source.kind,
                source.base_url,
                int(source.enabled),
                source.rights_status,
                source.citation_policy,
                source.description,
                json.dumps(source.metadata or {}, ensure_ascii=False),
                now,
            ),
        )
    connection.commit()
    return sources


def _json_object(value: Any) -> dict[str, Any]:
    if not value:
        return {}
    try:
        parsed = json.loads(value) if isinstance(value, str) else value
    except (TypeError, ValueError):
        return {}
    return parsed if isinstance(parsed, dict) else {}


def registry_status(
    connection: sqlite3.Connection,
    registry_path: Path | str = DEFAULT_REGISTRY,
) -> dict[str, Any]:
    configured = sync_source_registry(connection, registry_path)
    rows = connection.execute(
        """
        SELECT c.*,
               COUNT(d.id) AS documents,
               COALESCE(SUM(d.passages), 0) AS passages,
               MAX(d.imported_at) AS last_imported_at,
               (SELECT status FROM source_runs r WHERE r.source_id=c.id ORDER BY r.id DESC LIMIT 1) AS last_run_status,
               (SELECT finished_at FROM source_runs r WHERE r.source_id=c.id ORDER BY r.id DESC LIMIT 1) AS last_run_at
        FROM source_catalog c
        LEFT JOIN source_documents d ON d.source_id=c.id AND d.status='imported'
        GROUP BY c.id
        ORDER BY c.enabled DESC, c.label COLLATE NOCASE
        """
    ).fetchall()

    items: list[dict[str, Any]] = []
    for row in rows:
        item = dict(row)
        item["enabled"] = bool(item["enabled"])
        item["metadata"] = _json_object(item.pop("metadata_json", "{}"))
        items.append(item)

    kutub_legacy = connection.execute(
        """
        SELECT COUNT(DISTINCT b.id) AS documents, COUNT(c.id) AS passages
        FROM books b LEFT JOIN chunks c ON c.book_id=b.id
        WHERE LOWER(COALESCE(b.source_url, '')) LIKE '%kutub.io%'
        """
    ).fetchone()
    for item in items:
        if item["id"] == "kutub" and kutub_legacy:
            item["documents"] = max(int(item["documents"] or 0), int(kutub_legacy["documents"] or 0))
            item["passages"] = max(int(item["passages"] or 0), int(kutub_legacy["passages"] or 0))

    return {
        "configured_sources": len(configured),
        "enabled_sources": sum(1 for source in configured if source.enabled),
        "documents": sum(int(item["documents"] or 0) for item in items),
        "passages": sum(int(item["passages"] or 0) for item in items),
        "sources": items,
    }
