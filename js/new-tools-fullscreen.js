// Athar — bouton grand écran explicite pour Athar Research et la Bibliothèque savante.
(() => {
  'use strict';

  const LOCAL_CLASS = 'athar-newtool-local-fullscreen';
  const SHORTCUT = 'Ctrl + Maj + F';
  let localFallback = false;
  let observer = null;

  const expandSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3"/></svg>';
  const collapseSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3v3a2 2 0 0 1-2 2H3M16 3v3a2 2 0 0 0 2 2h3M8 21v-3a2 2 0 0 0-2-2H3M16 21v-3a2 2 0 0 1 2-2h3"/></svg>';

  const hasGlobalController = () => Boolean(window.AtharFullscreen && typeof window.AtharFullscreen.toggle === 'function');
  const isActive = () => hasGlobalController()
    ? Boolean(window.AtharFullscreen.isActive?.())
    : Boolean(document.fullscreenElement || localFallback || document.documentElement.classList.contains(LOCAL_CLASS));

  function renderButtons() {
    const active = isActive();
    const state = String(active);
    document.querySelectorAll('[data-athar-newtool-fullscreen]').forEach(button => {
      if (button.dataset.fullscreenActive === state) return;
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

  async function localExit() {
    localFallback = false;
    document.documentElement.classList.remove(LOCAL_CLASS);
    if (document.fullscreenElement && document.exitFullscreen) {
      try { await document.exitFullscreen(); } catch (_) {}
    }
    renderButtons();
  }

  async function localEnter() {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen({ navigationUI: 'hide' });
        localFallback = false;
      } else {
        localFallback = true;
        document.documentElement.classList.add(LOCAL_CLASS);
      }
    } catch (_) {
      localFallback = true;
      document.documentElement.classList.add(LOCAL_CLASS);
    }
    renderButtons();
  }

  function toggle() {
    if (hasGlobalController()) {
      window.AtharFullscreen.toggle();
      setTimeout(renderButtons, 80);
      return;
    }
    if (isActive()) localExit();
    else localEnter();
  }

  function makeButton(kind) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.atharNewtoolFullscreen = kind;
    button.dataset.fullscreenShortcut = SHORTCUT;
    button.setAttribute('aria-pressed', 'false');
    if (kind === 'research') button.className = 'ar5-ghost athar-newtool-fullscreen';
    else button.className = kind === 'reader'
      ? 'athar-btn athar-btn-ghost athar-newtool-fullscreen'
      : 'athar-btn athar-btn-soft athar-newtool-fullscreen';
    button.innerHTML = `<span data-fullscreen-icon class="athar-newtool-fullscreen-icon">${expandSvg}</span><span data-fullscreen-label>Grand écran</span>`;
    button.addEventListener('click', toggle);
    return button;
  }

  function injectResearch() {
    const host = document.querySelector('.ar5-top-actions');
    if (!host || host.querySelector('[data-athar-newtool-fullscreen="research"]')) return false;
    host.insertBefore(makeButton('research'), host.firstChild);
    return true;
  }

  function injectLibrary() {
    let changed = false;
    const topbar = document.querySelector('.library-topbar-actions');
    if (topbar && !topbar.querySelector('[data-athar-newtool-fullscreen="library"]')) {
      const status = document.getElementById('libraryStatus');
      const button = makeButton('library');
      if (status?.nextSibling) topbar.insertBefore(button, status.nextSibling);
      else topbar.appendChild(button);
      changed = true;
    }

    const reader = document.querySelector('.reader-appbar-right');
    if (reader && !reader.querySelector('[data-athar-newtool-fullscreen="reader"]')) {
      reader.insertBefore(makeButton('reader'), reader.firstChild);
      changed = true;
    }
    return changed;
  }

  function inject() {
    const researchChanged = injectResearch();
    const libraryChanged = injectLibrary();
    if (researchChanged || libraryChanged) renderButtons();
  }

  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
      localFallback = false;
      document.documentElement.classList.remove(LOCAL_CLASS);
    }
    document.querySelectorAll('[data-athar-newtool-fullscreen]').forEach(button => delete button.dataset.fullscreenActive);
    renderButtons();
  });

  document.addEventListener('keydown', event => {
    if (hasGlobalController()) return;
    if (event.key.toLowerCase() === 'f' && event.ctrlKey && event.shiftKey) {
      event.preventDefault();
      toggle();
    }
    if (event.key === 'Escape' && localFallback) localExit();
  });

  function start() {
    inject();
    renderButtons();
    observer = new MutationObserver(inject);
    observer.observe(document.body, { childList: true, subtree: true });
    const htmlObserver = new MutationObserver(() => {
      document.querySelectorAll('[data-athar-newtool-fullscreen]').forEach(button => delete button.dataset.fullscreenActive);
      renderButtons();
    });
    htmlObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    window.addEventListener('beforeunload', () => {
      observer?.disconnect();
      htmlObserver.disconnect();
    }, { once: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();

  window.AtharNewToolsFullscreen = { toggle, isActive, shortcut: SHORTCUT };
})();
