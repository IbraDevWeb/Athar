// Athar V40 — interaction bridge between Athar Research and the scholarly library.
(() => {
  'use strict';

  const VERSION = 'athar-v40-research-library-1';
  const OPEN_RESEARCH_KEY = 'athar_v40_open_research';
  const RESEARCH_DRAFT_KEY = 'athar_v40_research_draft';
  const ROOT = document.documentElement;
  let observer = null;
  let queued = false;
  let routeTimer = null;

  const icons = {
    library: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg>',
    research: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/><path d="M8 11h6M11 8v6"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg>'
  };

  const storage = {
    get(key) { try { return sessionStorage.getItem(key) || ''; } catch (_) { return ''; } },
    set(key, value) { try { sessionStorage.setItem(key, String(value)); } catch (_) {} },
    remove(key) { try { sessionStorage.removeItem(key); } catch (_) {} }
  };

  const researchUrl = () => new URL('index.html', window.location.href).href;
  const libraryUrl = (bookId = '', page = '') => {
    const url = new URL('research-library.html', window.location.href);
    if (!bookId) return url.href;
    const params = new URLSearchParams();
    params.set('book', bookId);
    if (page) params.set('page', page);
    url.hash = params.toString();
    return url.href;
  };

  function goToResearch(draft = '') {
    storage.set(OPEN_RESEARCH_KEY, '1');
    if (draft) storage.set(RESEARCH_DRAFT_KEY, draft);
    else storage.remove(RESEARCH_DRAFT_KEY);
    window.location.href = researchUrl();
  }

  function currentReaderDraft() {
    const title = document.getElementById('readerCompactTitle')?.textContent?.trim()
      || document.getElementById('readerTitle')?.textContent?.trim()
      || 'cet ouvrage';
    const page = document.getElementById('readerPageInput')?.value?.trim();
    const pagePart = page ? ` à la page ${page}` : '';
    return `Dans l’ouvrage « ${title} »${pagePart}, `;
  }

  function applyResearchDraft() {
    const draft = storage.get(RESEARCH_DRAFT_KEY);
    if (!draft) return false;
    const textarea = document.querySelector('.ar5-composer textarea');
    if (!textarea) return false;
    textarea.value = draft;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.focus({ preventScroll: true });
    try { textarea.setSelectionRange(textarea.value.length, textarea.value.length); } catch (_) {}
    storage.remove(RESEARCH_DRAFT_KEY);
    return true;
  }

  function addResearchLibraryAction(shell) {
    const actions = shell.querySelector('.ar5-top-actions');
    if (!actions || actions.querySelector('[data-athar-v40-library-link]')) return;
    const link = document.createElement('a');
    link.className = 'ar40-library-link';
    link.href = 'research-library.html';
    link.dataset.atharV40LibraryLink = 'true';
    link.innerHTML = `${icons.library}<span>Bibliothèque</span>`;
    link.setAttribute('aria-label', 'Ouvrir la Bibliothèque savante');
    actions.prepend(link);
  }

  function addComposerHint(shell) {
    const filters = shell.querySelector('.ar5-filters');
    if (!filters || shell.querySelector('.ar40-composer-hint')) return;
    const hint = document.createElement('div');
    hint.className = 'ar40-composer-hint';
    hint.innerHTML = '<kbd>/</kbd><span>Focus recherche</span><span>·</span><kbd>Ctrl ↵</kbd><span>Lancer</span><span>·</span><span>Les résultats restent reliés au texte source.</span>';
    filters.insertAdjacentElement('afterend', hint);
  }

  function prepareResearchBookCards(shell) {
    shell.querySelectorAll('.ar5-book-card[data-book-id]').forEach(card => {
      if (card.dataset.atharV40Ready === 'true') return;
      card.dataset.atharV40Ready = 'true';
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      const title = card.querySelector('h3')?.textContent?.trim() || 'cet ouvrage';
      card.setAttribute('aria-label', `Lire ${title} dans la Bibliothèque Athar`);
    });
  }

  function addEvidenceLibraryAction(shell) {
    const actions = shell.querySelector('.ar5-evidence-actions');
    if (!actions) return;
    const active = shell.querySelector('.ar5-source-card.active[data-book-id]')
      || shell.querySelector('.ar5-source-card[data-book-id]');
    const existing = actions.querySelector('[data-athar-v40-open-book]');
    if (!active?.dataset.bookId) {
      existing?.remove();
      return;
    }
    const href = libraryUrl(active.dataset.bookId, active.dataset.bookPage || '');
    if (existing) {
      existing.href = href;
      return;
    }
    const link = document.createElement('a');
    link.className = 'ar40-open-book';
    link.dataset.atharV40OpenBook = 'true';
    link.href = href;
    link.innerHTML = `${icons.library}<span>Lire dans la Bibliothèque</span>`;
    actions.prepend(link);
  }

  function enhanceResearch() {
    const shell = document.querySelector('.ar5-shell');
    if (!shell) return false;
    ROOT.classList.add('athar-v40');
    ROOT.dataset.atharV40 = VERSION;
    shell.dataset.atharV40 = 'research';
    addResearchLibraryAction(shell);
    addComposerHint(shell);
    prepareResearchBookCards(shell);
    addEvidenceLibraryAction(shell);
    applyResearchDraft();
    return true;
  }

  function markResearchLinks() {
    const navLinks = [...document.querySelectorAll('.library-nav a')];
    navLinks.forEach(link => {
      if (/athar research/i.test(link.textContent || '')) link.dataset.atharV40Research = 'true';
    });
    const appbar = document.getElementById('openResearch');
    if (appbar) {
      appbar.classList.add('ar40-reader-research');
      appbar.dataset.atharV40Research = 'reader';
      appbar.innerHTML = `${icons.research}<span>Interroger cet ouvrage</span>`;
    }
    document.querySelectorAll('.reader-tool-card a[href="index.html"]').forEach(link => {
      if (/research/i.test(link.textContent || '')) link.dataset.atharV40Research = 'reader';
    });
  }

  function injectReaderResearchAction() {
    const tools = document.querySelector('.reader-tool-list');
    if (!tools || tools.querySelector('[data-athar-v40-tool-card]')) return;
    const card = document.createElement('article');
    card.className = 'reader-tool-card';
    card.dataset.atharV40ToolCard = 'true';
    card.innerHTML = `
      <strong>Interroger cet ouvrage avec Athar Research</strong>
      <p>Préremplir une question avec le titre et la page en cours, puis retrouver les passages et la synthèse sourcée dans Research.</p>
      <button class="athar-btn athar-btn-dark" type="button" data-athar-v40-research="reader">${icons.research}<span>Continuer dans Research</span></button>`;
    tools.prepend(card);
  }

  function enhanceLibrary() {
    if (!document.querySelector('.library-view, .reader-view')) return false;
    ROOT.classList.add('athar-v40');
    ROOT.dataset.atharV40 = VERSION;
    document.body.classList.add('athar-v40-library');
    document.body.dataset.atharV40 = 'library';
    markResearchLinks();
    injectReaderResearchAction();
    return true;
  }

  function openPendingResearchRoute() {
    if (storage.get(OPEN_RESEARCH_KEY) !== '1') return;
    let attempts = 0;
    clearInterval(routeTimer);
    routeTimer = window.setInterval(() => {
      attempts += 1;
      const shell = document.querySelector('.ar5-shell');
      if (shell) {
        storage.remove(OPEN_RESEARCH_KEY);
        enhanceResearch();
        applyResearchDraft();
        clearInterval(routeTimer);
        routeTimer = null;
        return;
      }
      const nav = document.querySelector('[data-athar-research-v5-nav]');
      if (nav) nav.click();
      if (attempts >= 80) {
        clearInterval(routeTimer);
        routeTimer = null;
      }
    }, 100);
  }

  function scheduleEnhance() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      enhanceResearch();
      enhanceLibrary();
    });
  }

  document.addEventListener('click', event => {
    const researchLink = event.target.closest('[data-athar-v40-research]');
    if (researchLink) {
      event.preventDefault();
      const withBook = researchLink.dataset.atharV40Research === 'reader';
      goToResearch(withBook ? currentReaderDraft() : '');
      return;
    }

    const researchBook = event.target.closest('.ar5-book-card[data-book-id]');
    if (researchBook && !event.target.closest('a, button, input, select, textarea')) {
      event.preventDefault();
      window.location.href = libraryUrl(researchBook.dataset.bookId);
      return;
    }

    if (event.target.closest('.ar5-source-card')) {
      window.setTimeout(() => enhanceResearch(), 0);
    }
  }, true);

  document.addEventListener('keydown', event => {
    const activeTag = document.activeElement?.tagName;
    const editing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeTag) || document.activeElement?.isContentEditable;

    if (!editing && event.key === '/' && document.querySelector('.ar5-shell')) {
      const textarea = document.querySelector('.ar5-composer textarea');
      if (textarea) {
        event.preventDefault();
        textarea.focus();
      }
      return;
    }

    const researchBook = event.target.closest?.('.ar5-book-card[data-book-id]');
    if (researchBook && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      window.location.href = libraryUrl(researchBook.dataset.bookId);
      return;
    }

    if (!editing && event.key === '/' && document.body.classList.contains('athar-v40-library') && !document.getElementById('libraryView')?.hidden) {
      const input = document.getElementById('catalogQuery');
      if (input) {
        event.preventDefault();
        input.focus();
      }
    }
  });

  window.addEventListener('hashchange', () => window.setTimeout(scheduleEnhance, 0));
  window.addEventListener('beforeunload', () => {
    observer?.disconnect();
    if (routeTimer) clearInterval(routeTimer);
  }, { once: true });

  function start() {
    scheduleEnhance();
    openPendingResearchRoute();
    observer = new MutationObserver(records => {
      if (records.some(record => record.type === 'childList' && (record.addedNodes.length || record.removedNodes.length))) scheduleEnhance();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.AtharV40 = Object.freeze({
      version: VERSION,
      goToResearch,
      libraryUrl,
      enhanceResearch,
      enhanceLibrary
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
