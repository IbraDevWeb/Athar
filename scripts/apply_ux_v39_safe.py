from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VERSION = "athar-ux-v39-safe-2"
APP_VERSION = "athar-pro-v39-safe-2"
PREVIOUS_VERSION = "athar-ux-v39-safe-1"
PREVIOUS_APP_VERSION = "athar-pro-v39-safe-1"


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def write(path: str, value: str) -> None:
    (ROOT / path).write_text(value, encoding="utf-8")


def replace_required(text: str, old: str, new: str, label: str) -> str:
    if new in text:
        return text
    if old not in text:
        raise RuntimeError(f"Token introuvable pour {label}: {old!r}")
    return text.replace(old, new, 1)


def migrate_versions(text: str) -> str:
    return text.replace(PREVIOUS_APP_VERSION, APP_VERSION).replace(PREVIOUS_VERSION, VERSION)


def patch_config() -> None:
    path = "js/config.js"
    text = migrate_versions(read(path))
    text = replace_required(
        text,
        "const APP_VERSION = 'athar-pro-v36';",
        f"const APP_VERSION = '{APP_VERSION}';",
        "version applicative",
    )

    style_line = f"    ensureStylesheet('css/ux-v39-safe.css?v={VERSION}', 'athar-ux-v39-safe');"
    if style_line not in text:
        anchor = "    ensureStylesheet(`css/interaction-stability.css?v=${APP_VERSION}`, 'athar-interaction-stability');"
        if anchor not in text:
            raise RuntimeError("Ancre CSS UX introuvable dans js/config.js")
        text = text.replace(anchor, anchor + "\n" + style_line, 1)

    script_line = f"    ensureScript('js/ux-v39-safe.js?v={VERSION}', 'athar-ux-v39-safe-bridge');"
    if script_line not in text:
        anchor = "    ensureScript(`js/components/GlobalFullscreen.js?v=${APP_VERSION}`, 'athar-global-fullscreen');"
        if anchor not in text:
            raise RuntimeError("Ancre JS UX introuvable dans js/config.js")
        text = text.replace(anchor, anchor + "\n" + script_line, 1)

    write(path, text)


def patch_library() -> None:
    path = "research-library.html"
    text = migrate_versions(read(path))

    css_line = f'  <link rel="stylesheet" href="css/ux-v39-safe.css?v={VERSION}">'
    if css_line not in text:
        anchor = '  <link rel="stylesheet" href="css/new-tools-fullscreen.css?v=athar-pro-v37">'
        if anchor not in text:
            raise RuntimeError("Ancre CSS Bibliothèque introuvable")
        text = text.replace(anchor, anchor + "\n" + css_line, 1)

    js_line = f'  <script src="js/ux-v39-safe.js?v={VERSION}" defer></script>'
    if js_line not in text:
        anchor = '  <script src="js/new-tools-fullscreen.js?v=athar-pro-v37" defer></script>'
        if anchor not in text:
            raise RuntimeError("Ancre JS Bibliothèque introuvable")
        text = text.replace(anchor, anchor + "\n" + js_line, 1)

    write(path, text)


def patch_service_worker() -> None:
    path = "service-worker.js"
    text = migrate_versions(read(path))
    text = text.replace("athar-pro-v36", APP_VERSION)

    css_entry = f"    './css/ux-v39-safe.css?v={VERSION}',"
    if css_entry not in text:
        anchor = f"    './css/interaction-stability.css?v={APP_VERSION}',"
        if anchor not in text:
            raise RuntimeError("Ancre CSS service worker introuvable")
        text = text.replace(anchor, anchor + "\n" + css_entry, 1)

    js_entry = f"    './js/ux-v39-safe.js?v={VERSION}',"
    if js_entry not in text:
        anchor = f"    './js/components/GlobalFullscreen.js?v={APP_VERSION}',"
        if anchor not in text:
            raise RuntimeError("Ancre JS service worker introuvable")
        text = text.replace(anchor, anchor + "\n" + js_entry, 1)

    write(path, text)


def validate() -> None:
    config = read("js/config.js")
    library = read("research-library.html")
    worker = read("service-worker.js")

    checks = {
        "config version": f"const APP_VERSION = '{APP_VERSION}';" in config,
        "config css": f"css/ux-v39-safe.css?v={VERSION}" in config,
        "config js": f"js/ux-v39-safe.js?v={VERSION}" in config,
        "library css": f"css/ux-v39-safe.css?v={VERSION}" in library,
        "library js": f"js/ux-v39-safe.js?v={VERSION}" in library,
        "worker cache": f"const CACHE_VERSION = '{APP_VERSION}';" in worker,
        "worker css": f"css/ux-v39-safe.css?v={VERSION}" in worker,
        "worker js": f"js/ux-v39-safe.js?v={VERSION}" in worker,
        "old ux removed": PREVIOUS_VERSION not in config + library + worker,
        "old app removed": PREVIOUS_APP_VERSION not in config + worker,
    }
    failed = [name for name, ok in checks.items() if not ok]
    if failed:
        raise RuntimeError("Validation UX v39 échouée: " + ", ".join(failed))


if __name__ == "__main__":
    patch_config()
    patch_library()
    patch_service_worker()
    validate()
    print("Athar UX v39 safe patch v2 applied.")