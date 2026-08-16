from __future__ import annotations

"""Local browser UI for blind Athar V6.3-D relevance review.

No external dependency is required. Judgements are persisted to SQLite after
every click and an annotated CSV is regenerated continuously, so the session can
be interrupted and resumed safely.
"""

import argparse
import csv
import html
import json
import sqlite3
import threading
import urllib.parse
import webbrowser
from datetime import datetime, timezone
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any

REQUIRED_FIELDS = {
    "case_id",
    "question",
    "candidate_code",
    "chunk_id",
    "title",
    "author",
    "madhhab",
    "discipline",
    "page",
    "chapter",
    "text_ar",
    "text_fr",
    "source_url",
    "relevance_grade",
    "reviewer",
    "notes",
}


def load_pool(path: Path) -> tuple[list[dict[str, str]], list[str]]:
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        fields = list(reader.fieldnames or [])
        missing = sorted(REQUIRED_FIELDS - set(fields))
        if missing:
            raise RuntimeError(f"Pack de review invalide, colonnes manquantes: {', '.join(missing)}")
        rows = [dict(row) for row in reader]
    if not rows:
        raise RuntimeError("Le pack de review est vide.")
    seen: set[tuple[str, str]] = set()
    for row in rows:
        key = (row["case_id"].strip(), row["chunk_id"].strip())
        if not all(key) or key in seen:
            raise RuntimeError(f"case_id/chunk_id absent ou dupliqué: {key!r}")
        seen.add(key)
    return rows, fields


class ReviewStore:
    def __init__(
        self,
        pool_rows: list[dict[str, str]],
        fields: list[str],
        *,
        reviewer: str,
        db_path: Path,
        output_csv: Path,
    ) -> None:
        self.pool_rows = pool_rows
        self.fields = fields
        self.reviewer = reviewer.strip()
        if not self.reviewer:
            raise ValueError("reviewer est obligatoire")
        self.db_path = db_path
        self.output_csv = output_csv
        self.lock = threading.Lock()
        db_path.parent.mkdir(parents=True, exist_ok=True)
        self.conn = sqlite3.connect(db_path, check_same_thread=False)
        self.conn.execute(
            """
            CREATE TABLE IF NOT EXISTS judgements(
                reviewer TEXT NOT NULL,
                case_id TEXT NOT NULL,
                chunk_id TEXT NOT NULL,
                grade INTEGER NOT NULL CHECK(grade IN (0,1,2)),
                notes TEXT NOT NULL DEFAULT '',
                updated_at TEXT NOT NULL,
                PRIMARY KEY(reviewer, case_id, chunk_id)
            )
            """
        )
        self.conn.commit()
        self.index = {
            (row["case_id"].strip(), row["chunk_id"].strip()): idx
            for idx, row in enumerate(pool_rows)
        }
        self.export_csv()

    def close(self) -> None:
        with self.lock:
            self.conn.close()

    def progress(self) -> tuple[int, int]:
        with self.lock:
            done = int(
                self.conn.execute(
                    "SELECT COUNT(*) FROM judgements WHERE reviewer=?", (self.reviewer,)
                ).fetchone()[0]
            )
        return done, len(self.pool_rows)

    def judged_keys(self) -> set[tuple[str, str]]:
        with self.lock:
            rows = self.conn.execute(
                "SELECT case_id, chunk_id FROM judgements WHERE reviewer=?", (self.reviewer,)
            ).fetchall()
        return {(str(case_id), str(chunk_id)) for case_id, chunk_id in rows}

    def next_row(self) -> dict[str, str] | None:
        judged = self.judged_keys()
        for row in self.pool_rows:
            key = (row["case_id"].strip(), row["chunk_id"].strip())
            if key not in judged:
                return row
        return None

    def save(self, case_id: str, chunk_id: str, grade: int, notes: str) -> None:
        key = (case_id.strip(), chunk_id.strip())
        if key not in self.index:
            raise KeyError("Candidat inconnu")
        if grade not in {0, 1, 2}:
            raise ValueError("grade invalide")
        now = datetime.now(timezone.utc).isoformat(timespec="seconds")
        with self.lock:
            self.conn.execute(
                """
                INSERT INTO judgements(reviewer, case_id, chunk_id, grade, notes, updated_at)
                VALUES(?,?,?,?,?,?)
                ON CONFLICT(reviewer, case_id, chunk_id)
                DO UPDATE SET grade=excluded.grade, notes=excluded.notes, updated_at=excluded.updated_at
                """,
                (self.reviewer, key[0], key[1], int(grade), notes.strip(), now),
            )
            self.conn.commit()
        self.export_csv()

    def export_csv(self) -> None:
        with self.lock:
            judgements = {
                (str(r[0]), str(r[1])): (int(r[2]), str(r[3]))
                for r in self.conn.execute(
                    "SELECT case_id, chunk_id, grade, notes FROM judgements WHERE reviewer=?",
                    (self.reviewer,),
                ).fetchall()
            }
        self.output_csv.parent.mkdir(parents=True, exist_ok=True)
        fields = list(self.fields)
        for needed in ("relevance_grade", "reviewer", "notes"):
            if needed not in fields:
                fields.append(needed)
        with self.output_csv.open("w", encoding="utf-8-sig", newline="") as handle:
            writer = csv.DictWriter(handle, fieldnames=fields, extrasaction="ignore")
            writer.writeheader()
            for source in self.pool_rows:
                row = dict(source)
                key = (row["case_id"].strip(), row["chunk_id"].strip())
                judgement = judgements.get(key)
                if judgement:
                    row["relevance_grade"] = str(judgement[0])
                    row["reviewer"] = self.reviewer
                    row["notes"] = judgement[1]
                else:
                    row["relevance_grade"] = ""
                    row["reviewer"] = ""
                    row["notes"] = ""
                writer.writerow(row)


def esc(value: Any) -> str:
    return html.escape(str(value or ""), quote=True)


def render_page(store: ReviewStore, message: str = "") -> str:
    row = store.next_row()
    done, total = store.progress()
    pct = (100.0 * done / total) if total else 100.0
    if row is None:
        body = f"""
        <main class="card">
          <h1>Review V6.3-D terminée</h1>
          <p>{done}/{total} passages annotés.</p>
          <p>CSV exporté : <code>{esc(store.output_csv)}</code></p>
        </main>
        """
    else:
        source = row.get("source_url", "").strip()
        source_html = (
            f'<a href="{esc(source)}" target="_blank" rel="noreferrer">Ouvrir la source</a>'
            if source
            else ""
        )
        body = f"""
        <main class="card">
          <div class="progress"><div style="width:{pct:.2f}%"></div></div>
          <div class="meta top">{done}/{total} · reviewer {esc(store.reviewer)} · {esc(row["candidate_code"])}</div>
          <h1>{esc(row["question"])}</h1>
          <div class="book">
            <strong>{esc(row.get("title"))}</strong>
            <span>{esc(row.get("author"))}</span>
            <span>{esc(row.get("madhhab"))}</span>
            <span>{esc(row.get("discipline"))}</span>
            <span>p. {esc(row.get("page"))}</span>
          </div>
          <div class="chapter">{esc(row.get("chapter"))}</div>
          <section class="arabic" dir="rtl">{esc(row.get("text_ar"))}</section>
          <section class="french">{esc(row.get("text_fr"))}</section>
          <div class="source">{source_html}</div>
          <form method="post" action="/grade">
            <input type="hidden" name="case_id" value="{esc(row["case_id"])}">
            <input type="hidden" name="chunk_id" value="{esc(row["chunk_id"])}">
            <label>Notes facultatives</label>
            <textarea name="notes" rows="3"></textarea>
            <div class="buttons">
              <button class="g0" name="grade" value="0">0 · Non pertinent</button>
              <button class="g1" name="grade" value="1">1 · Pertinent / partiel</button>
              <button class="g2" name="grade" value="2">2 · Preuve directe</button>
            </div>
          </form>
          <p class="hint">Raccourcis clavier : 0, 1 ou 2. L’origine moteur, le rang et les cas négatifs restent cachés.</p>
        </main>
        """
    flash = f'<div class="flash">{esc(message)}</div>' if message else ""
    return f"""<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Athar V6.3-D Review</title>
<style>
body{{font-family:system-ui,-apple-system,Segoe UI,sans-serif;background:#f5f5f3;margin:0;color:#171717}}
.card{{max-width:1050px;margin:32px auto;background:#fff;padding:28px;border-radius:18px;box-shadow:0 6px 24px #0001}}
h1{{font-size:24px;line-height:1.35;margin:20px 0}}
.progress{{height:8px;background:#e5e5e5;border-radius:99px;overflow:hidden}} .progress div{{height:100%;background:#111}}
.meta,.book{{display:flex;gap:12px;flex-wrap:wrap;color:#666;font-size:14px}} .top{{margin-top:10px}}
.chapter{{margin:18px 0 8px;font-weight:600}}
.arabic,.french{{padding:18px;border:1px solid #e4e4e4;border-radius:12px;margin:12px 0;white-space:pre-wrap;line-height:1.8}}
.arabic{{font-size:22px}} .french{{font-size:16px}}
textarea{{width:100%;box-sizing:border-box;margin:8px 0 14px;padding:10px}}
.buttons{{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}} button{{padding:15px;border:0;border-radius:10px;font-weight:700;cursor:pointer}}
.g0{{background:#eee}} .g1{{background:#dcecff}} .g2{{background:#dff5e4}}
.hint,.source{{color:#666;font-size:13px;margin-top:14px}} .flash{{max-width:1050px;margin:20px auto 0}}
code{{word-break:break-all}}
@media(max-width:700px){{.card{{margin:0;border-radius:0;padding:18px}}.buttons{{grid-template-columns:1fr}}}}
</style>
</head>
<body>
{flash}
{body}
<script>
document.addEventListener('keydown', function(e) {{
  if (e.target && ['TEXTAREA','INPUT'].includes(e.target.tagName)) return;
  if (['0','1','2'].includes(e.key)) {{
    const b=document.querySelector('button[value="'+e.key+'"]');
    if (b) b.click();
  }}
}});
</script>
</body>
</html>"""


def make_handler(store: ReviewStore):
    class Handler(BaseHTTPRequestHandler):
        def do_GET(self) -> None:
            parsed = urllib.parse.urlparse(self.path)
            if parsed.path not in {"/", "/health"}:
                self.send_error(HTTPStatus.NOT_FOUND)
                return
            if parsed.path == "/health":
                data = json.dumps({"status": "ok", "progress": store.progress()}).encode()
                self.send_response(HTTPStatus.OK)
                self.send_header("Content-Type", "application/json")
                self.send_header("Content-Length", str(len(data)))
                self.end_headers()
                self.wfile.write(data)
                return
            data = render_page(store).encode("utf-8")
            self.send_response(HTTPStatus.OK)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)

        def do_POST(self) -> None:
            if self.path != "/grade":
                self.send_error(HTTPStatus.NOT_FOUND)
                return
            length = int(self.headers.get("Content-Length", "0"))
            form = urllib.parse.parse_qs(self.rfile.read(length).decode("utf-8"))
            try:
                store.save(
                    form.get("case_id", [""])[0],
                    form.get("chunk_id", [""])[0],
                    int(form.get("grade", ["-1"])[0]),
                    form.get("notes", [""])[0],
                )
                self.send_response(HTTPStatus.SEE_OTHER)
                self.send_header("Location", "/")
                self.end_headers()
            except Exception as exc:
                data = render_page(store, f"Erreur: {exc}").encode("utf-8")
                self.send_response(HTTPStatus.BAD_REQUEST)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(data)))
                self.end_headers()
                self.wfile.write(data)

        def log_message(self, fmt: str, *args: Any) -> None:
            return

    return Handler


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--pool", type=Path, required=True)
    parser.add_argument("--reviewer", required=True)
    parser.add_argument("--db", type=Path, default=Path("rag/data/v63d-review.sqlite"))
    parser.add_argument("--output", type=Path, default=Path("rag/data/v63d-annotations.csv"))
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8765)
    parser.add_argument("--no-browser", action="store_true")
    args = parser.parse_args()

    rows, fields = load_pool(args.pool)
    store = ReviewStore(
        rows,
        fields,
        reviewer=args.reviewer,
        db_path=args.db,
        output_csv=args.output,
    )
    server = ThreadingHTTPServer((args.host, args.port), make_handler(store))
    url = f"http://{args.host}:{args.port}/"
    print(f"Athar V6.3-D review: {url}")
    print(f"Annotations: {args.output}")
    print("Ctrl+C pour arrêter; la progression est sauvegardée après chaque jugement.")
    if not args.no_browser:
        webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
        store.export_csv()
        store.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
