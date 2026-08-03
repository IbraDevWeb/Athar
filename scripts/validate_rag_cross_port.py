from __future__ import annotations

import json
import socket
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = "http://127.0.0.1:8000"


def free_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.bind(("127.0.0.1", 0))
        return int(sock.getsockname()[1])


def request_json(url: str, *, method: str = "GET", payload: dict | None = None) -> tuple[dict, object]:
    data = None if payload is None else json.dumps(payload).encode("utf-8")
    headers = {"Origin": ORIGIN, "Accept": "application/json"}
    if data is not None:
        headers["Content-Type"] = "application/json"
    request = urllib.request.Request(url, data=data, headers=headers, method=method)
    with urllib.request.urlopen(request, timeout=5) as response:
        return json.loads(response.read().decode("utf-8")), response.headers


def main() -> int:
    port = free_port()
    with tempfile.TemporaryDirectory(prefix="athar-rag-cross-port-") as temp_dir:
        database = Path(temp_dir) / "rag.sqlite"
        process = subprocess.Popen(
            [
                sys.executable,
                str(ROOT / "rag" / "server.py"),
                "--host",
                "127.0.0.1",
                "--port",
                str(port),
                "--db",
                str(database),
            ],
            cwd=ROOT,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )

        try:
            status_url = f"http://127.0.0.1:{port}/api/rag/v2/status"
            deadline = time.monotonic() + 20
            status_payload = None
            status_headers = None
            while time.monotonic() < deadline:
                if process.poll() is not None:
                    raise AssertionError(f"Le serveur RAG s’est arrêté avec le code {process.returncode}.")
                try:
                    status_payload, status_headers = request_json(status_url)
                    break
                except (OSError, urllib.error.URLError):
                    time.sleep(0.25)

            if not status_payload or status_payload.get("server") != "athar-rag-v2":
                raise AssertionError("Le statut RAG ne contient pas le marqueur serveur attendu.")
            if status_headers.get("Access-Control-Allow-Origin") != ORIGIN:
                raise AssertionError("Le GET de santé n’autorise pas l’origine locale appelante.")
            if status_headers.get("X-Athar-RAG") != "v2":
                raise AssertionError("L’en-tête d’identité X-Athar-RAG est absent.")

            options = urllib.request.Request(
                f"http://127.0.0.1:{port}/api/rag/v2/ask",
                method="OPTIONS",
                headers={
                    "Origin": ORIGIN,
                    "Access-Control-Request-Method": "POST",
                    "Access-Control-Request-Headers": "content-type",
                },
            )
            with urllib.request.urlopen(options, timeout=5) as response:
                if response.status != 204:
                    raise AssertionError(f"Le preflight CORS doit répondre 204, reçu {response.status}.")
                if response.headers.get("Access-Control-Allow-Origin") != ORIGIN:
                    raise AssertionError("Le preflight n’autorise pas l’origine locale.")
                if "POST" not in str(response.headers.get("Access-Control-Allow-Methods") or ""):
                    raise AssertionError("Le preflight n’autorise pas POST.")
                if "Content-Type" not in str(response.headers.get("Access-Control-Allow-Headers") or ""):
                    raise AssertionError("Le preflight n’autorise pas Content-Type.")

            answer, answer_headers = request_json(
                f"http://127.0.0.1:{port}/api/rag/v2/ask",
                method="POST",
                payload={"query": "Dans quels cas le tayammum remplace-t-il les ablutions ?", "madhhab": "Mālikite"},
            )
            if not answer.get("ok") or answer.get("server") != "athar-rag-v2":
                raise AssertionError("La requête POST inter-port n’a pas produit une réponse RAG valide.")
            if answer_headers.get("Access-Control-Allow-Origin") != ORIGIN:
                raise AssertionError("La réponse POST n’autorise pas l’origine locale.")

            print(
                "RAG cross-port runtime validated: server marker, local CORS GET, OPTIONS preflight and POST answer succeeded."
            )
            return 0
        finally:
            if process.poll() is None:
                process.terminate()
                try:
                    process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    process.kill()
                    process.wait(timeout=5)


if __name__ == "__main__":
    raise SystemExit(main())
