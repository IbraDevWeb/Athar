// Athar — commande de grand écran partagée par Research et la Bibliothèque savante.
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
