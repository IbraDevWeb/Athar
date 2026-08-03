from __future__ import annotations

import importlib.util
import json
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("athar_rag_launcher", ROOT / "rag" / "launcher.py")
if SPEC is None or SPEC.loader is None:
    raise RuntimeError("Impossible de charger rag/launcher.py")
launcher = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(launcher)


class QuietHandler(BaseHTTPRequestHandler):
    def log_message(self, *_args: object) -> None:
        return


class StaticOnlyHandler(QuietHandler):
    def do_GET(self) -> None:
        self.send_response(404)
        self.end_headers()


class RagHealthHandler(QuietHandler):
    def do_GET(self) -> None:
        if self.path == "/api/rag/v2/status":
            body = json.dumps({"ok": True, "books": 1}).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        self.send_response(404)
        self.end_headers()


def start_server(handler: type[BaseHTTPRequestHandler]) -> tuple[ThreadingHTTPServer, threading.Thread]:
    server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return server, thread


def stop_server(server: ThreadingHTTPServer, thread: threading.Thread) -> None:
    server.shutdown()
    server.server_close()
    thread.join(timeout=3)


def main() -> int:
    static_server, static_thread = start_server(StaticOnlyHandler)
    rag_server, rag_thread = start_server(RagHealthHandler)

    try:
        static_port = int(static_server.server_address[1])
        rag_port = int(rag_server.server_address[1])

        if launcher.test_rag_api(static_port):
            raise AssertionError("Un serveur statique ne doit jamais être reconnu comme serveur RAG.")
        if not launcher.test_rag_api(rag_port):
            raise AssertionError("Le serveur de santé RAG doit être détecté.")

        selected, existing = launcher.choose_port(rag_port, span=0)
        if selected != rag_port or not existing:
            raise AssertionError("Un serveur RAG existant doit être réutilisé.")

        selected, existing = launcher.choose_port(static_port, span=20)
        if selected == static_port or existing:
            raise AssertionError("Un port occupé par un serveur statique doit être évité.")
        if not launcher.port_is_free(selected):
            raise AssertionError("Le port de remplacement doit être libre.")

        url = launcher.open_athar(rag_port, no_browser=True)
        if f":{rag_port}/" not in url or "server=rag-v2" not in url:
            raise AssertionError("L’URL finale doit utiliser le port RAG validé.")

        print(
            "RAG launcher runtime validated: static server rejected, existing RAG reused, "
            "free fallback port selected and browser URL protected."
        )
        return 0
    finally:
        stop_server(static_server, static_thread)
        stop_server(rag_server, rag_thread)


if __name__ == "__main__":
    raise SystemExit(main())
