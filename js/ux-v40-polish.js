// Athar V40.2 — semantic labels, runtime truth and final Research/Library polish.
(() => {
  'use strict';

  const VERSION = 'athar-v40-polish-1';
  const RUNTIME_TRUTH_VERSION = 'athar-v40-runtime-truth-1';
  let observer = null;
  let queued = false;

  const setText = (node, value) => {
    if (node && node.textContent !== value) node.textContent = value;
  };

  const connectedRuntimeLabel = shell => {
    const label = shell?.querySelector('.ar5-runtime strong')?.textContent?.trim() || '';
    return /^RAG V\d+(?:\.\d+){0,2}$/i.test(label) ? label : 'RAG';
  };

  function polishResearch() {
    const shell = document.querySelector('.ar5-shell');
    if (!shell) return false;

    document.documentElement.dataset.atharV40Polish = VERSION;
    document.documentElement.dataset.atharV40RuntimeTruth = RUNTIME_TRUTH_VERSION;

    // Remove stale user-facing V5 wording without touching internal route identifiers.
    document.querySelectorAll('.ar5-nav-version').forEach(node => setText(node, 'V6'));
    document.querySelectorAll('[data-athar-research-v5-nav] .ar5-nav-copy small').forEach(node => setText(node, 'Recherche hybride'));

    const intro = shell.querySelector('.ar5-rail-intro');
    if (intro) {
      setText(intro.querySelector('span'), 'Workspace documentaire');
      setText(intro.querySelector('p'), 'Recherche, synthèse sourcée et accès direct aux ouvrages du corpus.');
    }

    // Never claim a minor backend release that the connected runtime has not exposed.
    // ScholarLibraryV4View derives this label from the live API engine_version.
    const runtimeLabel = connectedRuntimeLabel(shell);
    document.querySelectorAll('.ar5-home-side dl > div').forEach(row => {
      const key = row.querySelector('dt')?.textContent?.trim().toLowerCase();
      const value = row.querySelector('dd');
      if (key === 'moteur') {
        setText(value, runtimeLabel);
        if (value) value.dataset.atharRuntimeSource = runtimeLabel === 'RAG' ? 'pending' : 'connected';
      }
      if (key === 'accès') setText(value, 'Recherche · synthèse · lecture');
    });

    const methodRows = shell.querySelectorAll('.ar5-method-tech > div');
    methodRows.forEach(row => {
      const key = row.querySelector('span')?.textContent?.trim().toLowerCase();
      if (key === 'mode') setText(row.querySelector('strong'), 'Preuves + synthèse sourcée');
    });

    return true;
  }

  function polishLibrary() {
    if (!document.body.classList.contains('athar-v40-library')) return false;
    document.documentElement.dataset.atharV40Polish = VERSION;

    const research = document.getElementById('openResearch');
    if (research) {
      research.setAttribute('aria-label', 'Interroger la page actuelle dans Athar Research');
      const label = research.querySelector('span');
      setText(label, 'Interroger cette page');
    }

    document.querySelectorAll('[data-athar-v40-tool-card]').forEach(card => {
      setText(card.querySelector('strong'), 'Interroger cette page avec Athar Research');
      setText(card.querySelector('p'), 'Continuer dans Research avec le titre de l’ouvrage et la page actuelle déjà renseignés.');
      setText(card.querySelector('button span'), 'Continuer dans Research');
    });

    const navResearch = [...document.querySelectorAll('.library-nav a')]
      .find(link => /athar research/i.test(link.textContent || ''));
    if (navResearch) navResearch.title = 'Ouvrir le workspace de recherche savante';

    return true;
  }

  function run() {
    queued = false;
    polishResearch();
    polishLibrary();
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(run);
  }

  function start() {
    run();
    observer = new MutationObserver(records => {
      if (records.some(record =>
        (record.type === 'childList' && record.addedNodes.length)
        || record.type === 'characterData'
      )) schedule();
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  window.addEventListener('beforeunload', () => observer?.disconnect(), { once: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();

  window.AtharV40Polish = Object.freeze({ version: VERSION, runtimeTruthVersion: RUNTIME_TRUTH_VERSION, polishResearch, polishLibrary });
})();
