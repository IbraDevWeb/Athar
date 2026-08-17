// Athar UX v39 — couche ergonomique non intrusive.
// Ne modifie pas l'état Vue : elle coordonne uniquement le chrome, le grand écran et la cohérence visuelle.
(() => {
  'use strict';

  const VERSION = 'athar-ux-v39-safe-2';
  const ROOT_CLASS = 'athar-ux-v39';
  const PERSIST_KEY = 'athar_immersive_intent_v39';
  const LOCAL_CLASS = 'athar-newtool-local-fullscreen';
  let observer = null;
  let bootTimer = null;

  const root = document.documentElement;
  root.classList.add(ROOT_CLASS);
  root.dataset.atharUxVersion = VERSION;

  const readIntent = () => {
    try { return localStorage.getItem(PERSIST_KEY) === '1'; }
    catch (_) { return false; }
  };

  const writeIntent = enabled => {
    try { localStorage.setItem(PERSIST_KEY, enabled ? '1' : '0'); }
    catch (_) {}
    root.dataset.atharImmersiveIntent = enabled ? 'true' : 'false';
  };

  const globalActive = () => Boolean(window.AtharFullscreen?.isActive?.());
  const localActive = () => Boolean(
    window.AtharNewToolsFullscreen?.isActive?.()
    || document.fullscreenElement
    || root.classList.contains(LOCAL_CLASS)
  );
  const anyActive = () => globalActive() || localActive();

  const elementVisible = element => {
    if (!element || element.hidden) return false;
    const hiddenAncestor = element.parentElement?.closest?.('[hidden]');
    if (hiddenAncestor) return false;
    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
    return element.getClientRects().length > 0;
  };

  const fullscreenPriority = button => {
    const kind = button.dataset.atharNewtoolFullscreen || '';
    if (kind === 'reader') return 30;
    if (kind === 'research') return 20;
    if (kind === 'library') return 10;
    return 0;
  };

  const eligibleLocalControl = button => {
    if (!button) return false;
    if (button.hidden && !button.dataset.atharUxHidden) return false;
    if (button.parentElement?.closest?.('[hidden]')) return false;
    if (button.dataset.atharUxHidden) return true;
    return elementVisible(button);
  };

  const setUxHidden = (button, reason = '') => {
    if (!button) return;
    const currentReason = button.dataset.atharUxHidden || '';
    if (reason) {
      if (currentReason !== reason) button.dataset.atharUxHidden = reason;
      if (!button.hidden) button.hidden = true;
      return;
    }
    if (!currentReason) return;
    button.removeAttribute('data-athar-ux-hidden');
    if (button.hidden) button.hidden = false;
  };

  function syncResearchChrome() {
    const researchVisible = Boolean(document.querySelector('[data-athar-research-v5-route] .ar5-shell'));
    if (!researchVisible) return;
    const badge = document.querySelector('#athar-immersive-current span');
    if (badge && badge.textContent !== 'Athar Research') badge.textContent = 'Athar Research';
  }

  function syncFullscreenControls() {
    const globalButton = document.getElementById('athar-fullscreen-toggle');
    const locals = [...document.querySelectorAll('[data-athar-newtool-fullscreen]')];

    // En mode immersif, ou lorsque le contrôleur global est réellement visible,
    // il reste l'unique autorité. Surtout, on ne ré-affiche plus les boutons locaux
    // avant de les remasquer : cette ancienne séquence créait une boucle MutationObserver
    // au montage d'Athar Research.
    if (globalActive() || elementVisible(globalButton)) {
      locals.forEach(button => setUxHidden(button, 'global-controller'));
      syncResearchChrome();
      return;
    }

    const candidates = locals
      .filter(eligibleLocalControl)
      .sort((a, b) => fullscreenPriority(b) - fullscreenPriority(a));
    const winner = candidates[0] || null;

    locals.forEach(button => {
      if (button === winner) setUxHidden(button, '');
      else if (candidates.includes(button)) setUxHidden(button, 'duplicate');
      else if (button.dataset.atharUxHidden) setUxHidden(button, '');
    });
    syncResearchChrome();
  }

  function applyPersistentMode() {
    root.dataset.atharImmersiveIntent = readIntent() ? 'true' : 'false';
    if (!readIntent() || anyActive()) {
      syncFullscreenControls();
      return;
    }

    if (window.AtharFullscreen?.enter) {
      // Sans geste utilisateur, l'API native peut refuser le fullscreen :
      // GlobalFullscreen bascule alors automatiquement vers son mode immersif CSS.
      Promise.resolve(window.AtharFullscreen.enter()).finally(syncFullscreenControls);
      return;
    }

    // Pages documentaires autonomes (Bibliothèque / lecteur).
    if (document.querySelector('.library-view, .reader-view, .ar5-shell')) {
      root.classList.add(LOCAL_CLASS);
      syncFullscreenControls();
    }
  }

  function controlFromEvent(event) {
    return event.target?.closest?.('#athar-fullscreen-toggle, #athar-fullscreen-exit, [data-athar-newtool-fullscreen]') || null;
  }

  document.addEventListener('click', event => {
    const control = controlFromEvent(event);
    if (!control) return;
    if (control.id === 'athar-fullscreen-exit') {
      writeIntent(false);
      return;
    }
    writeIntent(!anyActive());
  }, true);

  document.addEventListener('keydown', event => {
    const key = String(event.key || '').toLowerCase();
    if (key === 'f' && event.ctrlKey && event.shiftKey) writeIntent(!anyActive());
    if (event.key === 'Escape' && anyActive()) writeIntent(false);
  }, true);

  document.addEventListener('fullscreenchange', () => {
    // Le navigateur quitte automatiquement le fullscreen natif lors d'une navigation.
    // On ne supprime donc pas l'intention ici : seul un geste explicite de sortie le fait.
    setTimeout(syncFullscreenControls, 30);
  });

  window.addEventListener('storage', event => {
    if (event.key !== PERSIST_KEY) return;
    if (!readIntent()) {
      root.classList.remove(LOCAL_CLASS);
      if (window.AtharFullscreen?.isActive?.()) window.AtharFullscreen.exit?.();
    } else applyPersistentMode();
  });

  const start = () => {
    syncFullscreenControls();
    applyPersistentMode();
    observer = new MutationObserver(() => syncFullscreenControls());
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['hidden', 'class']
    });

    // Les contrôleurs existants sont injectés après le montage de Vue.
    let attempts = 0;
    const settle = () => {
      syncFullscreenControls();
      if (readIntent()) applyPersistentMode();
      attempts += 1;
      if (attempts < 12) bootTimer = setTimeout(settle, 150);
    };
    bootTimer = setTimeout(settle, 80);
  };

  window.addEventListener('beforeunload', () => {
    clearTimeout(bootTimer);
    observer?.disconnect();
  }, { once: true });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();

  window.AtharUX = {
    version: VERSION,
    immersiveIntent: readIntent,
    setImmersiveIntent: writeIntent,
    syncFullscreenControls,
    applyPersistentMode
  };
})();