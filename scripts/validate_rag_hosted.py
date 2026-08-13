from __future__ import annotations

import json
import sys
import tempfile
import threading
import urllib.error
import urllib.request
from http.server import ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAG = ROOT / "rag"
if str(RAG) not in sys.path:
    sys.path.insert(0, str(RAG))

from core import ensure_database  # noqa: E402
from server import AtharRagHandler, SERVER_MARKER, bootstrap_corpus  # noqa: E402


def fail(message: str) -> None:
    raise AssertionError(message)


def request_json(url: str, *, origin: str = "") -> tuple[int, dict[str, object], dict[str, str]]:
    request = urllib.request.Request(url, headers={"Accept": "application/json"})
    if origin:
        request.add_header("Origin", origin)
    try:
        with urllib.request.urlopen(request, timeout=5) as response:
            payload = json.loads(response.read().decode("utf-8"))
            headers = {key.lower(): value for key, value in response.headers.items()}
            return response.status, payload, headers
    except urllib.error.HTTPError as error:
        raw = error.read().decode("utf-8")
        payload = json.loads(raw) if raw else {}
        headers = {key.lower(): value for key, value in error.headers.items()}
        return error.code, payload, headers


def main() -> int:
    render = (ROOT / "render.yaml").read_text(encoding="utf-8")
    openiti_command = "python rag/ingest_openiti.py --best-effort --max-books 22"
    for token in [
        "name: athar-rag-ibradevweb",
        "runtime: python",
        "plan: free",
        "python rag/prepare_hosted_db.py",
        openiti_command,
        "python rag/server.py --host 0.0.0.0 --api-only",
        "healthCheckPath: /healthz",
        "ATHAR_CORS_ORIGINS",
    ]:
        if token not in render:
            fail(f"render.yaml incomplet : {token}")
    prepare_position = render.index("python rag/prepare_hosted_db.py")
    openiti_position = render.index(openiti_command)
    server_position = render.index("python rag/server.py --host 0.0.0.0 --api-only")
    if not prepare_position < openiti_position < server_position:
        fail("Render doit préparer la base, charger OpenITI puis démarrer l'API")

    remote = json.loads((RAG / "remote.json").read_text(encoding="utf-8"))
    if remote.get("origin") != "https://athar-rag-ibradevweb.onrender.com":
        fail("rag/remote.json ne cible pas le service Render prévu")

    with tempfile.TemporaryDirectory() as directory:
        db_path = Path(directory) / "hosted.sqlite"
        with ensure_database(db_path) as connection:
            bootstrap_corpus(connection)

        server = ThreadingHTTPServer(("127.0.0.1", 0), AtharRagHandler)
        server.db_path = db_path
        server.api_only = True
        server.allowed_origins = {"https://ibradevweb.github.io"}
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        try:
            origin = "https://ibradevweb.github.io"
            base = f"http://127.0.0.1:{server.server_port}"
            status, health, headers = request_json(f"{base}/healthz", origin=origin)
            if status != 200 or health.get("ok") is not True or health.get("server") != SERVER_MARKER:
                fail(f"healthz invalide : {status} {health}")
            if headers.get("access-control-allow-origin") != origin:
                fail("CORS GitHub Pages absent sur /healthz")
            status, payload, headers = request_json(f"{base}/api/rag/v2/status", origin=origin)
            if status != 200 or payload.get("ok") is not True or payload.get("deployment") != "hosted":
                fail(f"status V2 invalide : {status} {payload}")
            if headers.get("access-control-allow-origin") != origin:
                fail("CORS GitHub Pages absent sur l'API")
            status, _, headers = request_json(f"{base}/api/rag/v2/status", origin="https://example.com")
            if status != 200 or "access-control-allow-origin" in headers:
                fail("gestion CORS d'une origine non autorisée invalide")
            status, payload, _ = request_json(f"{base}/README.md", origin=origin)
            if status != 404 or payload.get("ok") is not False:
                fail("le mode API-only expose encore les fichiers du dépôt")
        finally:
            server.shutdown()
            server.server_close()
            thread.join(timeout=5)

    print("Hosted RAG validated: twenty-two-book OpenITI startup, GitHub Pages CORS and API-only mode are operational.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
