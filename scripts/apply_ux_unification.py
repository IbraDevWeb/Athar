from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read(path):
    return (ROOT / path).read_text(encoding='utf-8')


def write(path, text):
    target = ROOT / path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(text, encoding='utf-8')


def replace(path, old, new, *, required=True):
    text = read(path)
    if old not in text:
        if required:
            raise SystemExit(f'Missing expected token in {path}: {old[:160]!r}')
        return False
    write(path, text.replace(old, new))
    return True


# 1) Global immersive state: persistent across document navigation.
global_path = 'js/components/GlobalFullscreen.js'
replace(
    global_path,
    "    const STORAGE_KEY = 'athar_immersive_last_view';\n    const SETTINGS_KEY = 'athar_settings';",
    "    const STORAGE_KEY = 'athar_immersive_last_view';\n    const PERSIST_KEY = 'athar_immersive_enabled';\n    const SETTINGS_KEY = 'athar_settings';"
)
replace(global_path, "    let fallbackActive = false;", "    let fallbackActive = localStorage.getItem(PERSIST_KEY) === '1';")
replace(
    global_path,
    "    const refreshIcons = () => setTimeout(() => window.lucide?.createIcons(), 20);\n    const isActive = () => Boolean(document.fullscreenElement) || fallbackActive;",
    "    const refreshIcons = () => setTimeout(() => window.lucide?.createIcons(), 20);\n    const isPersisted = () => localStorage.getItem(PERSIST_KEY) === '1';\n    const isActive = () => Boolean(document.fullscreenElement) || fallbackActive || isPersisted();"
)
replace(
    global_path,
    "        const sidebar = frame?.querySelector(':scope > aside');\n        header?.classList.add('athar-global-header');\n        frame?.classList.add('athar-global-mainframe');\n        sidebar?.classList.add('athar-global-sidebar');",
    "        const sidebar = frame?.querySelector(':scope > aside');\n        const content = frame?.querySelector(':scope > main');\n        header?.classList.add('athar-global-header');\n        frame?.classList.add('athar-global-mainframe');\n        sidebar?.classList.add('athar-global-sidebar');\n        content?.classList.add('athar-global-content');"
)
replace(
    global_path,
    "    const exit = async () => {\n        fallbackActive = false;\n        closeDrawer();",
    "    const exit = async () => {\n        localStorage.removeItem(PERSIST_KEY);\n        fallbackActive = false;\n        closeDrawer();"
)
replace(
    global_path,
    "    const enter = async () => {\n        markLayout();\n        syncCurrentFromApp();\n        renderThemeState();\n        try {\n            if (document.documentElement.requestFullscreen) {\n                await document.documentElement.requestFullscreen({ navigationUI: 'hide' });\n                fallbackActive = false;\n            } else {\n                fallbackActive = true;\n            }\n        } catch (_) {\n            fallbackActive = true;\n        }\n        renderState();\n    };",
    "    const enter = async () => {\n        localStorage.setItem(PERSIST_KEY, '1');\n        fallbackActive = true;\n        markLayout();\n        syncCurrentFromApp();\n        renderThemeState();\n        renderState();\n        try {\n            if (document.documentElement.requestFullscreen && !document.fullscreenElement) {\n                await document.documentElement.requestFullscreen({ navigationUI: 'hide' });\n            }\n        } catch (_) {\n            // Native fullscreen requires a user gesture and cannot survive a document navigation.\n            // The persisted Athar immersive layout remains active as the reliable fallback.\n        }\n        fallbackActive = true;\n        renderState();\n    };"
)
replace(
    global_path,
    "    document.addEventListener('fullscreenchange', () => {\n        if (!document.fullscreenElement) fallbackActive = false;\n        renderState();\n    });",
    "    document.addEventListener('fullscreenchange', () => {\n        if (!document.fullscreenElement) fallbackActive = isPersisted();\n        renderState();\n    });"
)
replace(
    global_path,
    "    window.addEventListener('athar:theme-changed', renderThemeState);\n    window.addEventListener('storage', event => {\n        if (event.key === SETTINGS_KEY) renderThemeState();\n    });",
    "    window.addEventListener('athar:theme-changed', renderThemeState);\n    window.addEventListener('athar:view-changed', event => {\n        const view = event.detail?.view;\n        if (view) setCurrentView(view);\n        setTimeout(() => { markLayout(); renderState(); }, 0);\n    });\n    window.addEventListener('storage', event => {\n        if (event.key === SETTINGS_KEY) renderThemeState();\n        if (event.key === PERSIST_KEY) {\n            fallbackActive = event.newValue === '1';\n            renderState();\n        }\n    });"
)
replace(
    global_path,
    "        if (SAFE_MODE) {\n            document.documentElement.classList.remove(ROOT_CLASS, 'athar-immersive-menu-open');\n            return;\n        }",
    "        if (SAFE_MODE) {\n            localStorage.removeItem(PERSIST_KEY);\n            fallbackActive = false;\n            document.documentElement.classList.remove(ROOT_CLASS, 'athar-immersive-menu-open');\n            return;\n        }\n        fallbackActive = isPersisted();"
)
replace(
    global_path,
    "    window.AtharFullscreen = { toggle, enter, exit, isActive, openMenu: openDrawer, navigate, toggleTheme };",
    "    window.AtharFullscreen = { toggle, enter, exit, isActive, openMenu: openDrawer, navigate, toggleTheme, persistenceKey: PERSIST_KEY };"
)

# 2) Standalone fullscreen bridge: exactly one button, shared state, no duplicate when global controller exists.
write('js/new-tools-fullscreen.js', r'''// Athar — commande de grand écran partagée par Research et la Bibliothèque savante.
(() => {
  'use strict';

  const LOCAL_CLASS = 'athar-newtool-local-fullscreen';
  const PERSIST_KEY = 'athar_immersive_enabled';
  const SHORTCUT = 'Ctrl + Maj + F';
  let localFallback = localStorage.getItem(PERSIST_KEY) === '1';
  let observer = null;
  let htmlObserver = null;

  const expandSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3"/></svg>';
  const collapseSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3v3a2 2 0 0 1-2 2H3M16 3v3a2 2 0 0 0 2 2h3M8 21v-3a2 2 0 0 0-2-2H3M16 21v-3a2 2 0 0 1 2-2h3"/></svg>';

  const hasGlobalController = () => Boolean(window.AtharFullscreen && typeof window.AtharFullscreen.toggle === 'function');
  const isPersisted = () => localStorage.getItem(PERSIST_KEY) === '1';
  const isActive = () => hasGlobalController()
    ? Boolean(window.AtharFullscreen.isActive?.())
    : Boolean(document.fullscreenElement || localFallback || isPersisted());

  function applyLocalClass() {
    document.documentElement.classList.toggle(LOCAL_CLASS, !hasGlobalController() && (localFallback || isPersisted()));
  }

  function renderButtons() {
    const active = isActive();
    const state = String(active);
    document.querySelectorAll('[data-athar-newtool-fullscreen]').forEach(button => {
      button.dataset.fullscreenActive = state;
      button.setAttribute('aria-pressed', state);
      button.setAttribute('aria-label', active ? 'Quitter le grand écran' : 'Passer en grand écran');
      button.title = active ? `Quitter le grand écran · ${SHORTCUT}` : `Grand écran · ${SHORTCUT}`;
      const label = button.querySelector('[data-fullscreen-label]');
      const icon = button.querySelector('[data-fullscreen-icon]');
      if (label) label.textContent = active ? 'Quitter' : 'Grand écran';
      if (icon) icon.innerHTML = active ? collapseSvg : expandSvg;
    });
  }

  function removeLocalButtons() {
    document.querySelectorAll('[data-athar-newtool-fullscreen]').forEach(node => node.remove());
  }

  async function localExit() {
    localStorage.removeItem(PERSIST_KEY);
    localFallback = false;
    document.documentElement.classList.remove(LOCAL_CLASS);
    if (document.fullscreenElement && document.exitFullscreen) {
      try { await document.exitFullscreen(); } catch (_) {}
    }
    renderButtons();
  }

  async function localEnter() {
    localStorage.setItem(PERSIST_KEY, '1');
    localFallback = true;
    applyLocalClass();
    renderButtons();
    try {
      if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
        await document.documentElement.requestFullscreen({ navigationUI: 'hide' });
      }
    } catch (_) {
      // Keep the persistent CSS immersive layout if native fullscreen is unavailable.
    }
    localFallback = true;
    applyLocalClass();
    renderButtons();
  }

  function toggle() {
    if (hasGlobalController()) {
      window.AtharFullscreen.toggle();
      setTimeout(sync, 80);
      return;
    }
    if (isActive()) localExit();
    else localEnter();
  }

  function makeButton() {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.atharNewtoolFullscreen = 'shared';
    button.dataset.fullscreenShortcut = SHORTCUT;
    button.setAttribute('aria-pressed', 'false');
    button.innerHTML = `<span data-fullscreen-icon class="athar-newtool-fullscreen-icon">${expandSvg}</span><span data-fullscreen-label>Grand écran</span>`;
    button.addEventListener('click', toggle);
    return button;
  }

  function targetContext() {
    const readerView = document.getElementById('readerView');
    if (readerView && !readerView.hidden) {
      return { kind: 'reader', host: document.querySelector('.reader-appbar-right') };
    }
    const libraryHost = document.querySelector('.library-topbar-actions');
    if (libraryHost) return { kind: 'library', host: libraryHost };
    const researchHost = document.querySelector('.ar5-top-actions');
    if (researchHost) return { kind: 'research', host: researchHost };
    return null;
  }

  function desiredClass(kind) {
    if (kind === 'research') return 'ar5-ghost athar-newtool-fullscreen';
    if (kind === 'reader') return 'athar-btn athar-btn-ghost athar-newtool-fullscreen';
    return 'athar-btn athar-btn-soft athar-newtool-fullscreen';
  }

  function ensureSingleButton() {
    if (hasGlobalController()) {
      removeLocalButtons();
      document.documentElement.classList.remove(LOCAL_CLASS);
      return false;
    }

    const target = targetContext();
    if (!target?.host) return false;
    const buttons = [...document.querySelectorAll('[data-athar-newtool-fullscreen]')];
    const button = buttons.shift() || makeButton();
    buttons.forEach(node => node.remove());

    const nextClass = desiredClass(target.kind);
    if (button.className !== nextClass) button.className = nextClass;
    button.dataset.fullscreenContext = target.kind;

    if (button.parentElement !== target.host) {
      if (target.kind === 'library') {
        const status = document.getElementById('libraryStatus');
        if (status?.parentElement === target.host) status.insertAdjacentElement('afterend', button);
        else target.host.insertBefore(button, target.host.firstChild);
      } else {
        target.host.insertBefore(button, target.host.firstChild);
      }
    }
    return true;
  }

  function sync() {
    localFallback = isPersisted();
    applyLocalClass();
    ensureSingleButton();
    renderButtons();
  }

  document.addEventListener('fullscreenchange', () => {
    localFallback = isPersisted();
    applyLocalClass();
    renderButtons();
  });

  document.addEventListener('keydown', event => {
    if (hasGlobalController()) return;
    if (event.key.toLowerCase() === 'f' && event.ctrlKey && event.shiftKey) {
      event.preventDefault();
      toggle();
    }
    if (event.key === 'Escape' && localFallback && !document.fullscreenElement) localExit();
  });

  window.addEventListener('storage', event => {
    if (event.key !== PERSIST_KEY) return;
    localFallback = event.newValue === '1';
    sync();
  });

  function start() {
    sync();
    observer = new MutationObserver(sync);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
    htmlObserver = new MutationObserver(renderButtons);
    htmlObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    window.addEventListener('beforeunload', () => {
      observer?.disconnect();
      htmlObserver?.disconnect();
    }, { once: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();

  window.AtharNewToolsFullscreen = { toggle, isActive, shortcut: SHORTCUT, persistenceKey: PERSIST_KEY };
})();
''')

# 3) App navigation: reset the actual scroll container, broadcast route changes, support Research deep link.
app_path = 'js/app.js'
replace(
    app_path,
    "        // --- ÉTATS RÉACTIFS ---\n        const viewMode = ref('home');",
    "        // --- ÉTATS RÉACTIFS ---\n        const requestedView = new URLSearchParams(window.location.search).get('view');\n        const viewMode = ref(requestedView === 'rag_v5' ? 'rag_v5' : 'home');"
)
replace(
    app_path,
    "        const setView = (mode) => {\n            viewMode.value = mode;\n            if (!['glossary', 'library', 'hadiths'].includes(mode)) headerSearchQuery.value = '';\n            mobileMenuOpen.value = false;\n            window.scrollTo(0, 0);\n            refreshIcons();\n        };",
    "        const setView = (mode) => {\n            viewMode.value = mode;\n            if (!['glossary', 'library', 'hadiths'].includes(mode)) headerSearchQuery.value = '';\n            mobileMenuOpen.value = false;\n            const url = new URL(window.location.href);\n            if (mode === 'rag_v5') url.searchParams.set('view', 'rag_v5');\n            else if (url.searchParams.get('view') === 'rag_v5') url.searchParams.delete('view');\n            history.replaceState(history.state, '', `${url.pathname}${url.search}${url.hash}`);\n            window.scrollTo(0, 0);\n            requestAnimationFrame(() => {\n                const content = document.querySelector('.athar-global-mainframe > main');\n                if (content) content.scrollTop = 0;\n            });\n            window.dispatchEvent(new CustomEvent('athar:view-changed', { detail: { view: mode } }));\n            refreshIcons();\n        };"
)

# 4) Research bootstrap: current labels and common fullscreen asset version.
bootstrap = 'js/components/ScholarV4Bootstrap.js'
replace(bootstrap, '// Athar Research V5 — branchement racine autonome', '// Athar Research V6 — branchement racine autonome')
replace(bootstrap, 'athar-pro-v37', 'athar-pro-v38')
replace(bootstrap, '<span class="ar5-nav-version">V5</span>', '<span class="ar5-nav-version">V6</span>')
replace(bootstrap, '<div><dt>Moteur</dt><dd>RAG V5</dd></div>', '<div><dt>Moteur</dt><dd>RAG V6 hybride</dd></div>')

# 5) Standalone reader: shared UX layer, one fullscreen action, distinct focus action, direct Research route.
page = 'research-library.html'
replace(page, '<meta name="theme-color" content="#9d5147">', '<meta name="theme-color" content="#b58b45">')
replace(page, 'css/new-tools-fullscreen.css?v=athar-pro-v37', 'css/new-tools-fullscreen.css?v=athar-pro-v38')
replace(page, 'js/new-tools-fullscreen.js?v=athar-pro-v37', 'js/new-tools-fullscreen.js?v=athar-pro-v38')
replace(page, '<link rel="stylesheet" href="css/new-tools-fullscreen.css?v=athar-pro-v38">', '<link rel="stylesheet" href="css/new-tools-fullscreen.css?v=athar-pro-v38">\n  <link rel="stylesheet" href="css/ux-consistency.css?v=athar-pro-v38">')
replace(page, '<a href="index.html">Athar Research</a>', '<a href="index.html?view=rag_v5">Athar Research</a>')
replace(page, '<a id="openResearch" class="athar-btn athar-btn-soft reader-wide-only" href="index.html">Athar Research</a>', '<a id="openResearch" class="athar-btn athar-btn-soft reader-wide-only" href="index.html?view=rag_v5">Athar Research</a>')
replace(page, 'title="Mode lecture sans distraction" aria-label="Mode lecture sans distraction"', 'title="Masquer les panneaux du lecteur" aria-label="Mode lecture sans distraction"')
replace(page, '<svg class="athar-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3"/></svg>\n        </button>\n        <a id="openResearch"', '<svg class="athar-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4zM9 5v14M15 5v14"/></svg>\n        </button>\n        <a id="openResearch"')

# 6) Shared visual language (only shell/documentary surfaces; specialized immersive tools keep their own art direction).
write('css/ux-consistency.css', r'''/* Athar Pro — cohérence ergonomique transversale v38 */
:root {
  --athar-ux-canvas: #f9f7f2;
  --athar-ux-surface: #fffdf8;
  --athar-ux-surface-strong: #ffffff;
  --athar-ux-ink: #172033;
  --athar-ux-muted: #697386;
  --athar-ux-line: rgba(23, 32, 51, .11);
  --athar-ux-line-strong: rgba(23, 32, 51, .18);
  --athar-ux-gold: #b58b45;
  --athar-ux-gold-soft: #f3ead9;
  --athar-ux-topbar: 68px;
  --athar-ux-radius-sm: 12px;
  --athar-ux-radius-md: 18px;
  --athar-ux-radius-lg: 26px;
  --athar-ux-shadow: 0 18px 60px rgba(30, 25, 16, .07);
}

html.dark {
  --athar-ux-canvas: #070707;
  --athar-ux-surface: #11110f;
  --athar-ux-surface-strong: #171714;
  --athar-ux-ink: #f4f0e7;
  --athar-ux-muted: #a7a39b;
  --athar-ux-line: rgba(255,255,255,.10);
  --athar-ux-line-strong: rgba(230,200,138,.22);
  --athar-ux-gold-soft: rgba(181,139,69,.14);
  --athar-ux-shadow: 0 20px 64px rgba(0,0,0,.30);
}

/* Global shell: predictable top bar and scroll behavior between Vue views. */
.athar-global-header { min-height: var(--athar-ux-topbar); }
.athar-global-content { scrollbar-gutter: stable; overscroll-behavior: contain; }

/* One keyboard language throughout the product. */
:is(button, a, input, select, textarea, [tabindex]):focus-visible {
  outline: 3px solid color-mix(in srgb, var(--athar-ux-gold) 28%, transparent);
  outline-offset: 2px;
}

/* Research and direct Library share the same documentary chrome. */
.ar5-topbar,
.library-topbar,
.reader-appbar {
  height: var(--athar-ux-topbar);
  min-height: var(--athar-ux-topbar);
  border-bottom-color: var(--athar-ux-line);
  box-shadow: 0 1px 0 rgba(255,255,255,.45);
}

.library-view,
.reader-view {
  --athar-bg: var(--athar-ux-canvas);
  --athar-paper: var(--athar-ux-surface);
  --athar-paper-strong: var(--athar-ux-surface-strong);
  --athar-ink: var(--athar-ux-ink);
  --athar-muted: var(--athar-ux-muted);
  --athar-line: var(--athar-ux-line);
  --athar-brand: var(--athar-ux-gold);
  --athar-brand-dark: #8f6a31;
  --athar-brand-soft: var(--athar-ux-gold-soft);
}

.library-view { background: var(--athar-ux-canvas); }
.library-topbar,
.reader-appbar { background: color-mix(in srgb, var(--athar-ux-surface-strong) 94%, transparent); backdrop-filter: blur(18px); }
.library-brand-mark { background: #1d1b16; color: #f6ead3; border-radius: 11px; }
.library-nav a { border-radius: 10px; }
.library-nav a:hover { background: var(--athar-ux-gold-soft); }
.library-shell { padding-top: 38px; }
.library-hero { border-radius: var(--athar-ux-radius-lg); }
.catalog-sidebar,
.book-card,
.reader-paper { border-color: var(--athar-ux-line); box-shadow: none; }
.book-card { border-radius: var(--athar-ux-radius-md); }
.catalog-sidebar { border-radius: var(--athar-ux-radius-md); }
.reader-paper { border-radius: var(--athar-ux-radius-md); }

.ar5-shell {
  --ar5-bg-local: var(--athar-ux-canvas);
  --ar5-surface-local: var(--athar-ux-surface-strong);
  --ar5-soft-local: color-mix(in srgb, var(--athar-ux-surface) 86%, var(--athar-ux-canvas));
  --ar5-ink-local: var(--athar-ux-ink);
  --ar5-muted-local: var(--athar-ux-muted);
  --ar5-line-local: var(--athar-ux-line);
  --ar5-line-strong: var(--athar-ux-line-strong);
}
.ar5-topbar { background: color-mix(in srgb, var(--athar-ux-surface-strong) 94%, transparent); }
.ar5-composer,
.ar5-source-card,
.ar5-evidence,
.ar5-method-card,
.ar5-book-card { border-radius: var(--athar-ux-radius-md); }

/* Fullscreen semantics: one local control only. Global controller wins in SPA mode. */
html.athar-app-fullscreen [data-athar-newtool-fullscreen] { display: none !important; }
.athar-newtool-fullscreen { min-height: 40px; gap: 7px; border-radius: 11px !important; }
html.athar-newtool-local-fullscreen body { background: var(--athar-ux-canvas); }
html.athar-newtool-local-fullscreen .library-view,
html.athar-newtool-local-fullscreen .reader-view { min-height: 100vh; }

/* Reader focus is intentionally different from fullscreen: it only removes side panels. */
#focusMode { position: relative; }
#focusMode::after {
  content: 'Lecture';
  position: absolute;
  right: 100%;
  margin-right: 8px;
  opacity: 0;
  pointer-events: none;
  padding: 5px 7px;
  border-radius: 7px;
  background: #172033;
  color: #fff;
  font-size: 9px;
  font-weight: 800;
  transition: opacity .15s ease;
}
#focusMode:hover::after { opacity: 1; }

@media (max-width: 900px) {
  :root { --athar-ux-topbar: 60px; }
  .library-nav { display: none; }
  .library-shell { width: min(100% - 28px, 1480px); padding-top: 22px; }
  #focusMode::after { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .athar-newtool-fullscreen,
  .library-nav a,
  #focusMode::after { transition: none !important; }
}
''')

# 7) Compact fullscreen CSS behavior.
fullscreen_css = 'css/new-tools-fullscreen.css'
replace(fullscreen_css, '/* Grand écran explicite pour Athar Research et la Bibliothèque savante */', '/* Commande de grand écran unique pour Athar Research et la Bibliothèque savante */')

# 8) Global app cache/version and UX stylesheet loading.
config = 'js/config.js'
replace(config, "const APP_VERSION = 'athar-pro-v36';", "const APP_VERSION = 'athar-pro-v38';")
replace(
    config,
    "    ensureStylesheet('css/athar-research-synthesis.css?v=athar-research-synthesis-1', 'athar-research-synthesis-styles');",
    "    ensureStylesheet('css/athar-research-synthesis.css?v=athar-research-synthesis-1', 'athar-research-synthesis-styles');\n    ensureStylesheet(`css/ux-consistency.css?v=${APP_VERSION}`, 'athar-ux-consistency');"
)

worker = 'service-worker.js'
worker_text = read(worker).replace('athar-pro-v36', 'athar-pro-v38')
if "'./css/ux-consistency.css?v=athar-pro-v38'" not in worker_text:
    worker_text = worker_text.replace(
        "    './css/research-library-v2.css?v=athar-reader-v3',",
        "    './css/research-library-v2.css?v=athar-reader-v3',\n    './css/ux-consistency.css?v=athar-pro-v38',\n    './css/new-tools-fullscreen.css?v=athar-pro-v38',"
    )
if "'./js/new-tools-fullscreen.js?v=athar-pro-v38'" not in worker_text:
    worker_text = worker_text.replace(
        "    './js/research-library-v2.js?v=athar-reader-v3',",
        "    './js/research-library-v2.js?v=athar-reader-v3',\n    './js/research-library-ai-tools.js?v=athar-reader-ai-2',\n    './js/new-tools-fullscreen.js?v=athar-pro-v38',"
    )
write(worker, worker_text)

# 9) Update static contract expectations to the unified UX release.
validator = 'scripts/validate-rag-v4.js'
text = read(validator).replace('athar-pro-v36', 'athar-pro-v38').replace('athar-pro-v37', 'athar-pro-v38')
text = text.replace(
    "    'css/new-tools-fullscreen.css?v=athar-pro-v38', 'js/new-tools-fullscreen.js?v=athar-pro-v38',\n    'Les traductions IA demandées dans le lecteur restent séparées et non vérifiées.'",
    "    'css/new-tools-fullscreen.css?v=athar-pro-v38', 'js/new-tools-fullscreen.js?v=athar-pro-v38',\n    'css/ux-consistency.css?v=athar-pro-v38',\n    'Les traductions IA demandées dans le lecteur restent séparées et non vérifiées.'"
)
text = text.replace(
    "    'css/athar-research-synthesis.css?v=athar-research-synthesis-1'\n].forEach(token => need(config, token, 'js/config.js'));",
    "    'css/athar-research-synthesis.css?v=athar-research-synthesis-1',\n    'css/ux-consistency.css?v=${APP_VERSION}'\n].forEach(token => need(config, token, 'js/config.js'));"
)
text = text.replace(
    "need(worker, './js/research-library-v2.js?v=athar-reader-v3', 'service-worker.js');",
    "need(worker, './js/research-library-v2.js?v=athar-reader-v3', 'service-worker.js');\nneed(worker, './css/ux-consistency.css?v=athar-pro-v38', 'service-worker.js');\nneed(worker, './js/new-tools-fullscreen.js?v=athar-pro-v38', 'service-worker.js');"
)
write(validator, text)

# 10) Dedicated UX regression validator.
write('scripts/validate-ux-consistency.js', r'''const fs = require('node:fs');
const vm = require('node:vm');

const read = path => fs.readFileSync(path, 'utf8');
const files = {
  global: 'js/components/GlobalFullscreen.js',
  local: 'js/new-tools-fullscreen.js',
  app: 'js/app.js',
  bootstrap: 'js/components/ScholarV4Bootstrap.js',
  page: 'research-library.html',
  css: 'css/ux-consistency.css',
  config: 'js/config.js',
  worker: 'service-worker.js'
};
for (const path of Object.values(files)) if (!fs.existsSync(path)) throw new Error(`UX resource missing: ${path}`);

const global = read(files.global);
const local = read(files.local);
const app = read(files.app);
const bootstrap = read(files.bootstrap);
const page = read(files.page);
const css = read(files.css);
const config = read(files.config);
const worker = read(files.worker);
new vm.Script(global, { filename: files.global });
new vm.Script(local, { filename: files.local });
new vm.Script(app, { filename: files.app });

for (const token of ["const PERSIST_KEY = 'athar_immersive_enabled'", 'isPersisted', "localStorage.setItem(PERSIST_KEY, '1')", "localStorage.removeItem(PERSIST_KEY)", "window.addEventListener('athar:view-changed'", 'athar-global-content']) {
  if (!global.includes(token)) throw new Error(`Persistent immersive contract missing: ${token}`);
}
for (const token of ["const PERSIST_KEY = 'athar_immersive_enabled'", "data.atharNewtoolFullscreen = 'shared'", 'ensureSingleButton', 'removeLocalButtons', 'targetContext', "attributeFilter: ['hidden']"]) {
  if (!local.includes(token)) throw new Error(`Shared standalone fullscreen contract missing: ${token}`);
}
if (local.includes("data.atharNewtoolFullscreen = 'library'") || local.includes("data.atharNewtoolFullscreen = 'reader'")) {
  throw new Error('Standalone reader must not create separate library/reader fullscreen buttons.');
}
for (const token of ["requestedView === 'rag_v5'", "CustomEvent('athar:view-changed'", ".athar-global-mainframe > main", 'history.replaceState']) {
  if (!app.includes(token)) throw new Error(`Navigation continuity missing: ${token}`);
}
for (const token of ['athar-pro-v38', '<span class="ar5-nav-version">V6</span>', 'RAG V6 hybride']) {
  if (!bootstrap.includes(token)) throw new Error(`Research chrome not updated: ${token}`);
}
for (const token of ['css/ux-consistency.css?v=athar-pro-v38', 'css/new-tools-fullscreen.css?v=athar-pro-v38', 'js/new-tools-fullscreen.js?v=athar-pro-v38', 'index.html?view=rag_v5', 'Masquer les panneaux du lecteur']) {
  if (!page.includes(token)) throw new Error(`Standalone library UX contract missing: ${token}`);
}
for (const token of ['--athar-ux-topbar: 68px', '.athar-global-content', '.ar5-topbar,', '.library-topbar,', '.reader-appbar', 'html.athar-app-fullscreen [data-athar-newtool-fullscreen]', '#focusMode::after', '@media (max-width: 900px)']) {
  if (!css.includes(token)) throw new Error(`Shared UX CSS missing: ${token}`);
}
if (!config.includes("const APP_VERSION = 'athar-pro-v38'")) throw new Error('App cache version was not bumped to v38.');
if (!config.includes("css/ux-consistency.css?v=${APP_VERSION}")) throw new Error('Shared UX CSS is not loaded by config.js.');
if (!worker.includes("const CACHE_VERSION = 'athar-pro-v38'")) throw new Error('Service worker cache version was not bumped to v38.');
for (const asset of ['css/ux-consistency.css?v=athar-pro-v38', 'css/new-tools-fullscreen.css?v=athar-pro-v38', 'js/new-tools-fullscreen.js?v=athar-pro-v38']) {
  if (!worker.includes(asset)) throw new Error(`UX asset missing from cache: ${asset}`);
}
console.log('Athar UX v38 valid — one fullscreen control, persistent immersive state, route continuity and shared documentary chrome.');
''')

print('Athar UX unification patch prepared successfully.')
