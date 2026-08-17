(() => {
  'use strict';

  const API = 'https://athar-rag-ibradevweb.onrender.com';
  const REQUEST_TIMEOUT_MS = 60000;
  const READ_TIMEOUT_MS = 90000;
  const MAX_PAGE_PASSAGES = 120;
  const CONCURRENCY = 2;
  const MODES = [
    { value: 'faithful', label: 'Fidèle' },
    { value: 'literal', label: 'Littérale' },
    { value: 'study', label: 'Étude' }
  ];

  const translations = new Map();
  const inFlight = new Map();
  let mode = localStorage.getItem('athar-reader-ai-mode') || 'faithful';
  let pageBusy = false;
  let observer = null;

  const $ = id => document.getElementById(id);
  const escapeHTML = value => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const currentHash = () => new URLSearchParams(location.hash.replace(/^#/, ''));
  const currentBookId = () => currentHash().get('book') || '';
  const currentPage = () => {
    const fromDom = [...document.querySelectorAll('#readerPaper .reader-page-block[data-page]')]
      .map(node => Number(node.dataset.page || 0))
      .find(Boolean);
    return fromDom || Number(currentHash().get('page') || 0) || 0;
  };
  const cacheKey = (bookId, sourceId, selectedMode = mode) => `${bookId}:${sourceId}:${selectedMode}`;

  function toast(message, error = false) {
    const host = $('toast');
    if (!host) return;
    host.textContent = message;
    host.classList.toggle('is-error', error);
    host.classList.add('is-visible');
    clearTimeout(host.__atharAiTimer);
    host.__atharAiTimer = setTimeout(() => host.classList.remove('is-visible'), 4200);
  }

  async function request(path, options = {}, timeoutMs = REQUEST_TIMEOUT_MS) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(API + path, {
        cache: 'no-store',
        signal: controller.signal,
        ...options,
        headers: {
          Accept: 'application/json',
          ...(options.body ? { 'Content-Type': 'application/json; charset=utf-8' } : {}),
          ...(options.headers || {})
        }
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload?.error) throw new Error(payload?.error || `Erreur HTTP ${response.status}`);
      if (payload?.engine) {
        const engineVersion = Number(payload?.engine_version || 0);
        const engineName = String(payload.engine || '');
        if (engineVersion < 5 || !/^(?:rag|athar)-v/i.test(engineName)) {
          throw new Error('Le moteur Athar Research compatible n’est pas disponible.');
        }
      }
      return payload;
    } catch (error) {
      if (error?.name === 'AbortError') throw new Error('Le traducteur a mis trop de temps à répondre.');
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  async function translateIndexedPassage(bookId, sourceId, selectedMode = mode) {
    const key = cacheKey(bookId, sourceId, selectedMode);
    if (translations.has(key)) return translations.get(key);
    if (inFlight.has(key)) return inFlight.get(key);

    const promise = request('/api/rag/v5/translate', {
      method: 'POST',
      body: JSON.stringify({ book_id: bookId, source_id: sourceId, mode: selectedMode })
    }).then(payload => {
      const translation = payload?.translation;
      if (!translation?.text_fr) throw new Error('Aucune traduction exploitable n’a été reçue.');
      translations.set(key, translation);
      return translation;
    }).finally(() => inFlight.delete(key));

    inFlight.set(key, promise);
    return promise;
  }

  async function readAllPagePassages(bookId, page) {
    const passages = [];
    let offset = 0;
    let guard = 0;
    while (guard++ < 20) {
      const params = new URLSearchParams({
        book_id: bookId,
        page: String(page),
        offset: String(offset),
        limit: '12'
      });
      const payload = await request(`/api/rag/v5/read?${params.toString()}`, {}, READ_TIMEOUT_MS);
      const batch = Array.isArray(payload?.passages) ? payload.passages : [];
      batch.forEach(passage => {
        if (passage?.id && String(passage.text_ar || '').trim()) passages.push(passage);
      });
      if (passages.length > MAX_PAGE_PASSAGES) {
        throw new Error('Cette page contient trop de passages pour une traduction en une seule action.');
      }
      if (payload?.next_offset === null || payload?.next_offset === undefined) break;
      const next = Number(payload.next_offset);
      if (!Number.isFinite(next) || next <= offset) break;
      offset = next;
    }
    return passages;
  }

  function modeLabel(selectedMode = mode) {
    return MODES.find(item => item.value === selectedMode)?.label || 'Fidèle';
  }

  function termsMarkup(terms) {
    if (!Array.isArray(terms) || !terms.length) return '';
    return `<div class="reader-ai-terms">
      <strong>Termes techniques</strong>
      <dl>${terms.map(term => `<div>
        <dt><span lang="ar" dir="rtl">${escapeHTML(term.arabic || '')}</span><small>${escapeHTML(term.transliteration || '')}</small></dt>
        <dd>${escapeHTML(term.explanation || '')}</dd>
      </div>`).join('')}</dl>
    </div>`;
  }

  function uncertaintyMarkup(items) {
    if (!Array.isArray(items) || !items.length) return '';
    return `<div class="reader-ai-uncertainties">
      <strong>Points à vérifier</strong>
      <ul>${items.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul>
    </div>`;
  }

  function translationMarkup(translation) {
    return `<article class="reader-ai-translation" data-ai-mode="${escapeHTML(translation.mode || mode)}">
      <header>
        <div><span>Traduction assistée par IA</span><strong>${escapeHTML(translation.mode_label || modeLabel(translation.mode))}</strong></div>
        <b>Non vérifiée</b>
      </header>
      <p class="reader-ai-text">${escapeHTML(translation.text_fr || '')}</p>
      ${termsMarkup(translation.terms)}
      ${uncertaintyMarkup(translation.uncertainties)}
      ${translation.source_truncated ? '<p class="reader-ai-warning">Le passage source était exceptionnellement long : la traduction a été limitée par le serveur. Consultez l’arabe original pour la suite.</p>' : ''}
      <footer>
        <span>${escapeHTML(translation.provider === 'google-gemini' ? 'Gemini' : (translation.provider || 'IA'))} · ${escapeHTML(translation.model || '')}</span>
        <button type="button" data-ai-copy>Copier</button>
      </footer>
    </article>`;
  }

  function passageButtonMarkup(sourceId) {
    return `<div class="reader-ai-passage-actions">
      <button type="button" class="reader-ai-passage-button" data-ai-translate-passage="${escapeHTML(sourceId)}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 8 6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6"/></svg>
        <span>Traduire ce passage · ${escapeHTML(modeLabel())}</span>
      </button>
    </div>`;
  }

  function renderCachedTranslation(passage) {
    const sourceId = passage.dataset.passageId || '';
    const bookId = currentBookId();
    const existing = passage.querySelector('.reader-ai-translation');
    if (!sourceId || !bookId) {
      existing?.remove();
      return;
    }
    const translation = translations.get(cacheKey(bookId, sourceId));
    if (!translation) {
      existing?.remove();
      return;
    }
    const renderedMode = String(translation.mode || mode);
    if (existing?.dataset.aiMode === renderedMode) return;
    existing?.remove();
    const actions = passage.querySelector('.reader-ai-passage-actions');
    if (actions) actions.insertAdjacentHTML('afterend', translationMarkup(translation));
  }

  function decoratePassages() {
    document.querySelectorAll('#readerPaper .reader-passage[data-passage-id]').forEach(passage => {
      const sourceId = passage.dataset.passageId || '';
      const arabic = passage.querySelector('.reader-arabic');
      if (!sourceId || !arabic) return;
      let actions = passage.querySelector('.reader-ai-passage-actions');
      if (!actions) {
        arabic.insertAdjacentHTML('afterend', passageButtonMarkup(sourceId));
        actions = passage.querySelector('.reader-ai-passage-actions');
      }
      const button = actions?.querySelector('[data-ai-translate-passage]');
      if (button && !button.disabled) {
        const cached = translations.has(cacheKey(currentBookId(), sourceId));
        const wanted = cached
          ? `Traduction ${modeLabel()} disponible`
          : `Traduire ce passage · ${modeLabel()}`;
        const label = button.querySelector('span');
        if (label && label.textContent !== wanted) label.textContent = wanted;
      }
      renderCachedTranslation(passage);
    });
    updatePageButton();
  }

  function findPassage(sourceId) {
    return [...document.querySelectorAll('#readerPaper .reader-passage[data-passage-id]')]
      .find(node => node.dataset.passageId === sourceId) || null;
  }

  function setPassageLoading(sourceId, loading) {
    const passage = findPassage(sourceId);
    const button = passage?.querySelector('[data-ai-translate-passage]');
    if (!button) return;
    button.disabled = loading;
    button.classList.toggle('is-loading', loading);
    const label = button.querySelector('span');
    const wanted = loading ? 'Traduction en cours…' : `Traduire ce passage · ${modeLabel()}`;
    if (label && label.textContent !== wanted) label.textContent = wanted;
  }

  async function translatePassage(sourceId) {
    const bookId = currentBookId();
    if (!bookId || !sourceId) return toast('Impossible d’identifier ce passage dans le corpus.', true);
    setPassageLoading(sourceId, true);
    try {
      await translateIndexedPassage(bookId, sourceId, mode);
      const passage = findPassage(sourceId);
      if (passage) renderCachedTranslation(passage);
      toast(`Passage traduit en mode ${modeLabel()}.`);
    } catch (error) {
      toast(error.message || 'Traduction indisponible.', true);
    } finally {
      setPassageLoading(sourceId, false);
      decoratePassages();
    }
  }

  function updatePageButton(progress = '') {
    const button = $('readerTranslatePage');
    if (!button) return;
    const page = currentPage();
    const hasArabic = Boolean(document.querySelector('#readerPaper .reader-passage .reader-arabic'));
    button.disabled = pageBusy || !page || !hasArabic;
    const label = button.querySelector('span');
    if (!label) return;
    const wanted = pageBusy && progress
      ? progress
      : (page ? `Traduire la page ${page}` : 'Traduire la page');
    if (label.textContent !== wanted) label.textContent = wanted;
  }

  async function translatePage() {
    if (pageBusy) return;
    const bookId = currentBookId();
    const page = currentPage();
    if (!bookId || !page) return toast('Ouvrez une page paginée avant de lancer sa traduction.', true);

    pageBusy = true;
    updatePageButton('Préparation de la page…');
    try {
      const passages = await readAllPagePassages(bookId, page);
      if (!passages.length) throw new Error('Aucun texte arabe n’est indexé sur cette page.');

      let cursor = 0;
      let done = 0;
      const failures = [];
      const worker = async () => {
        while (cursor < passages.length) {
          const passage = passages[cursor++];
          try {
            await translateIndexedPassage(bookId, passage.id, mode);
            const visible = findPassage(passage.id);
            if (visible) renderCachedTranslation(visible);
          } catch (error) {
            failures.push({ id: passage.id, error });
          } finally {
            done += 1;
            updatePageButton(`Traduction ${done}/${passages.length}…`);
          }
        }
      };
      await Promise.all(Array.from({ length: Math.min(CONCURRENCY, passages.length) }, () => worker()));
      decoratePassages();

      if (failures.length) {
        toast(`${passages.length - failures.length}/${passages.length} passages traduits. Certains passages n’ont pas pu être traduits.`, true);
      } else {
        toast(`Page ${page} traduite en mode ${modeLabel()} (${passages.length} passage${passages.length > 1 ? 's' : ''}).`);
      }
    } catch (error) {
      toast(error.message || 'La page n’a pas pu être traduite.', true);
    } finally {
      pageBusy = false;
      updatePageButton();
    }
  }

  async function copyTranslation(button) {
    const card = button.closest('.reader-ai-translation');
    const text = card?.querySelector('.reader-ai-text')?.textContent?.trim();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      toast('Traduction copiée.');
    } catch (_) {
      toast('Impossible de copier la traduction.', true);
    }
  }

  function updateMode(nextMode) {
    if (!MODES.some(item => item.value === nextMode)) return;
    mode = nextMode;
    localStorage.setItem('athar-reader-ai-mode', mode);
    document.querySelectorAll('.reader-ai-translation').forEach(node => node.remove());
    decoratePassages();
  }

  function injectToolbar() {
    const toolbar = document.querySelector('.reader-toolbar');
    if (!toolbar || $('readerAiToolbar')) return false;
    const host = document.createElement('div');
    host.id = 'readerAiToolbar';
    host.className = 'reader-ai-toolbar';
    host.innerHTML = `
      <label class="reader-ai-mode-select">
        <span>Traduction IA</span>
        <select id="readerAiMode" aria-label="Mode de traduction IA">
          ${MODES.map(item => `<option value="${item.value}" ${item.value === mode ? 'selected' : ''}>${item.label}</option>`).join('')}
        </select>
      </label>
      <button id="readerTranslatePage" class="reader-ai-page-button" type="button">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h10v16H4zM14 7h6v13h-6M7 8h4M7 12h4M7 16h4"/></svg>
        <span>Traduire la page</span>
      </button>`;
    const pageForm = $('readerPageForm');
    if (pageForm) toolbar.insertBefore(host, pageForm);
    else toolbar.appendChild(host);
    $('readerAiMode')?.addEventListener('change', event => updateMode(event.target.value));
    $('readerTranslatePage')?.addEventListener('click', translatePage);
    updatePageButton();
    return true;
  }

  function bindPaperEvents() {
    const paper = $('readerPaper');
    if (!paper || paper.dataset.aiToolsBound === 'true') return;
    paper.dataset.aiToolsBound = 'true';
    paper.addEventListener('click', event => {
      const passageButton = event.target.closest('[data-ai-translate-passage]');
      if (passageButton) {
        event.preventDefault();
        translatePassage(passageButton.dataset.aiTranslatePassage);
        return;
      }
      const copyButton = event.target.closest('[data-ai-copy]');
      if (copyButton) {
        event.preventDefault();
        copyTranslation(copyButton);
      }
    });
  }

  function startObserver() {
    const paper = $('readerPaper');
    if (!paper || observer) return;
    observer = new MutationObserver(() => {
      if ($('readerView')?.hidden) return;
      window.requestAnimationFrame(decoratePassages);
    });
    observer.observe(paper, { childList: true, subtree: true });
  }

  function init() {
    if (!MODES.some(item => item.value === mode)) mode = 'faithful';
    injectToolbar();
    bindPaperEvents();
    startObserver();
    decoratePassages();
    window.addEventListener('hashchange', () => setTimeout(decoratePassages, 60));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
