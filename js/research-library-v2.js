(() => {
  'use strict';

  const API = 'https://athar-rag-ibradevweb.onrender.com';
  const REQUEST_TIMEOUT_MS = 90000;
  const ARABIC_RE = /[\u0600-\u06FF]/;
  const ARABIC_DIACRITICS_RE = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g;

  const $ = id => document.getElementById(id);
  const state = {
    books: [],
    activeBook: null,
    toc: [],
    tocMeta: null,
    payload: null,
    mode: 'arabic',
    fontStep: 0,
    readToken: 0,
    searchToken: 0,
    focus: false
  };

  const escapeHTML = value => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const normalize = value => String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(ARABIC_DIACRITICS_RE, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

  const number = value => new Intl.NumberFormat('fr-FR').format(Number(value || 0));
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const isArabic = value => ARABIC_RE.test(String(value || ''));
  const firstText = (...values) => values.map(value => String(value || '').trim()).find(Boolean) || '';

  function safeUrl(value) {
    try {
      const url = new URL(String(value || ''));
      return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
    } catch (_) {
      return '';
    }
  }

  async function api(path, params = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    const url = new URL(API + path);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value));
    });
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
        cache: 'no-store'
      });
      let payload = null;
      try { payload = await response.json(); } catch (_) { payload = {}; }
      if (!response.ok || payload?.error) throw new Error(payload?.error || `Erreur HTTP ${response.status}`);
      if (payload?.engine) {
        const engineVersion = Number(payload?.engine_version || 0);
        const engineName = String(payload.engine || '');
        if (engineVersion < 5 || !/^(?:rag|athar)-v/i.test(engineName)) {
          throw new Error('Le serveur Athar Research compatible n’est pas disponible.');
        }
      }
      return payload;
    } catch (error) {
      if (error?.name === 'AbortError') throw new Error('Le serveur a mis trop de temps à répondre.');
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  let toastTimer = null;
  function toast(message, error = false) {
    const host = $('toast');
    if (!host) return;
    host.textContent = message;
    host.classList.toggle('is-error', error);
    host.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => host.classList.remove('is-visible'), 3200);
  }

  function setLibraryReady(ready, text) {
    $('libraryStatus')?.classList.toggle('is-ready', ready);
    if ($('libraryStatusText')) $('libraryStatusText').textContent = text;
  }

  function renderCatalogStats() {
    const books = state.books;
    const passages = books.reduce((sum, book) => sum + Number(book.chunks || 0), 0);
    const arabic = books.reduce((sum, book) => sum + Number(book.arabic_passages || 0), 0);
    const french = books.reduce((sum, book) => sum + Number(book.french_passages || 0), 0);
    $('statBooks').textContent = number(books.length);
    $('statPassages').textContent = number(passages);
    $('statArabic').textContent = arabic ? number(arabic) : 'AR';
    $('statFrench').textContent = french ? number(french) : 'FR';
  }

  function populateSelect(select, values, defaultLabel) {
    if (!select) return;
    select.innerHTML = `<option value="">${escapeHTML(defaultLabel)}</option>` + values
      .map(value => `<option value="${escapeHTML(value)}">${escapeHTML(value)}</option>`)
      .join('');
  }

  function bookSearchBlob(book) {
    return normalize([book.title, book.title_ar, book.author, book.discipline, book.madhhab].filter(Boolean).join(' '));
  }

  function filteredBooks() {
    const query = normalize($('catalogQuery')?.value || '');
    const discipline = $('disciplineFilter')?.value || '';
    const madhhab = $('madhhabFilter')?.value || '';
    const language = $('languageFilter')?.value || '';
    const sort = $('sortBooks')?.value || 'title';

    const books = state.books.filter(book => {
      if (query && !bookSearchBlob(book).includes(query)) return false;
      if (discipline && book.discipline !== discipline) return false;
      if (madhhab && book.madhhab !== madhhab) return false;
      if (language === 'fr' && !Number(book.french_passages || 0)) return false;
      if (language === 'ar' && !Number(book.arabic_passages || 0)) return false;
      return true;
    });

    books.sort((a, b) => {
      if (sort === 'author') return String(a.author || '').localeCompare(String(b.author || ''), 'fr', { sensitivity: 'base' });
      if (sort === 'size') return Number(b.chunks || 0) - Number(a.chunks || 0) || String(a.title || '').localeCompare(String(b.title || ''), 'fr');
      return String(a.title || '').localeCompare(String(b.title || ''), 'fr', { sensitivity: 'base' });
    });
    return books;
  }

  function bookTag(value, extra = '') {
    if (!value) return '';
    return `<span class="book-tag ${extra}">${escapeHTML(value)}</span>`;
  }

  function renderCatalog() {
    const host = $('catalogGrid');
    if (!host) return;
    const books = filteredBooks();
    $('catalogCount').textContent = `${number(books.length)} ouvrage${books.length > 1 ? 's' : ''} affiché${books.length > 1 ? 's' : ''}`;
    if (!books.length) {
      host.innerHTML = '<div class="catalog-empty"><strong>Aucun ouvrage ne correspond à ces filtres.</strong><br>Modifiez la recherche ou réinitialisez le catalogue.</div>';
      return;
    }
    host.innerHTML = books.map(book => {
      const fr = Number(book.french_passages || 0);
      const indexedPages = Number(book.indexed_pages || 0);
      const titleAr = firstText(book.title_ar, 'كتاب');
      return `
        <article class="book-card" tabindex="0" role="button" data-book-id="${escapeHTML(book.id)}" aria-label="Ouvrir ${escapeHTML(book.title || 'cet ouvrage')}">
          <div class="book-card-top">
            <span class="book-spine" aria-hidden="true">أ</span>
            <div>
              <h3>${escapeHTML(book.title || 'Ouvrage sans titre')}</h3>
              <p class="book-card-author">${escapeHTML(book.author || 'Auteur non renseigné')}</p>
            </div>
          </div>
          <div class="book-card-ar" lang="ar">${escapeHTML(titleAr)}</div>
          <div class="book-tags">
            ${bookTag(book.discipline)}
            ${bookTag(book.madhhab)}
            ${fr ? bookTag('Français indexé', 'is-fr') : ''}
          </div>
          <div class="book-card-footer">
            <span>${number(book.chunks)} passages</span>
            <span>${indexedPages ? `${number(indexedPages)} pages` : 'pagination partielle'}</span>
            <span>Lire →</span>
          </div>
        </article>`;
    }).join('');
  }

  async function loadCatalogue() {
    setLibraryReady(false, 'Connexion au corpus…');
    try {
      const payload = await api('/api/rag/v5/library-books');
      state.books = Array.isArray(payload.books) ? payload.books : [];
      const disciplines = [...new Set(state.books.map(book => book.discipline).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'fr'));
      const madhhabs = [...new Set(state.books.map(book => book.madhhab).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'fr'));
      populateSelect($('disciplineFilter'), disciplines, 'Toutes les disciplines');
      populateSelect($('madhhabFilter'), madhhabs, 'Tous les madhāhib');
      renderCatalogStats();
      renderCatalog();
      setLibraryReady(true, `${number(state.books.length)} ouvrages connectés`);
      await openFromHash();
    } catch (error) {
      setLibraryReady(false, 'Corpus indisponible');
      $('catalogGrid').innerHTML = `<div class="catalog-empty"><strong>Impossible de charger la bibliothèque.</strong><br>${escapeHTML(error.message)}</div>`;
    }
  }

  function metadataValue(book, ...keys) {
    for (const key of keys) {
      const value = book?.metadata?.[key];
      if (value !== undefined && value !== null && String(value).trim()) return String(value).trim();
    }
    return '';
  }

  function metaRow(label, value) {
    if (!value) return '';
    return `<div><dt>${escapeHTML(label)}</dt><dd>${escapeHTML(value)}</dd></div>`;
  }

  function applyBookDetails(book) {
    state.activeBook = book;
    const title = book.title || 'Ouvrage';
    const titleAr = book.title_ar || 'كتاب';
    const author = book.author || 'Auteur non renseigné';
    const sourceName = metadataValue(book, 'source', 'source_name', 'edition') || 'Corpus Athar';
    const edition = metadataValue(book, 'edition', 'publisher', 'publication') || '';

    $('readerCompactTitle').textContent = title;
    $('readerCompactMeta').textContent = [author, book.discipline].filter(Boolean).join(' · ') || 'Athar Library';
    $('readerTitle').textContent = title;
    $('readerArabicTitle').textContent = book.title_ar || '';
    $('readerAuthor').textContent = author;
    $('bookrailTitle').textContent = title;
    $('bookrailAuthor').textContent = author;
    $('bookrailCover').textContent = titleAr.length > 26 ? `${titleAr.slice(0, 24)}…` : titleAr;

    const description = String(book.description || '').trim();
    $('readerDescription').textContent = description;
    $('readerDescription').hidden = !description;

    $('bookrailBadges').innerHTML = [
      book.discipline ? `<span class="book-tag">${escapeHTML(book.discipline)}</span>` : '',
      book.madhhab ? `<span class="book-tag">${escapeHTML(book.madhhab)}</span>` : '',
      book.has_french ? '<span class="book-tag is-fr">Français indexé</span>' : ''
    ].join('');

    $('bookrailMeta').innerHTML = [
      metaRow('Source', sourceName),
      metaRow('Édition', edition),
      metaRow('Pages indexées', book.indexed_pages ? number(book.indexed_pages) : '—'),
      metaRow('Sections', book.indexed_sections ? number(book.indexed_sections) : '—'),
      metaRow('Passages', number(book.chunks)),
      metaRow('Plage de pages', book.first_page && book.last_page ? `${book.first_page}–${book.last_page}` : '')
    ].join('');

    $('readerFacts').innerHTML = [book.discipline, book.madhhab, book.indexed_pages ? `${number(book.indexed_pages)} pages indexées` : '', book.indexed_sections ? `${number(book.indexed_sections)} sections` : '']
      .filter(Boolean)
      .map(value => `<span class="reader-fact">${escapeHTML(value)}</span>`)
      .join('');

    const chunks = Math.max(1, Number(book.chunks || 0));
    const arPct = clamp(Math.round(Number(book.arabic_passages || 0) / chunks * 100), 0, 100);
    const frPct = clamp(Math.round(Number(book.french_passages || 0) / chunks * 100), 0, 100);
    $('arabicMeter').style.width = `${arPct}%`;
    $('frenchMeter').style.width = `${frPct}%`;
    $('arabicMeterText').textContent = `${arPct}%`;
    $('frenchMeterText').textContent = `${frPct}%`;

    const sourceUrl = safeUrl(book.source_url);
    const sourceLink = $('bookSourceLink');
    sourceLink.hidden = !sourceUrl;
    if (sourceUrl) sourceLink.href = sourceUrl;

    $('readerPageInput').max = book.last_page || book.pages || '';
    document.querySelectorAll('[data-reader-mode="bilingual"], [data-reader-mode="french"]').forEach(button => {
      button.disabled = !book.has_french;
      button.title = book.has_french ? '' : 'Aucun texte français n’est indexé pour cet ouvrage.';
    });

    const savedMode = localStorage.getItem('athar-reader-mode') || 'arabic';
    setReaderMode(book.has_french ? savedMode : 'arabic', false);
  }

  function loadingPaper(message = 'Ouverture de l’ouvrage…') {
    $('readerPaper').innerHTML = `<div class="reader-loading"><div class="reader-loading-spinner"></div>${escapeHTML(message)}</div>`;
  }

  function setReaderMode(mode, persist = true) {
    if (!['arabic', 'bilingual', 'french'].includes(mode)) mode = 'arabic';
    if ((mode === 'bilingual' || mode === 'french') && !state.activeBook?.has_french) mode = 'arabic';
    state.mode = mode;
    $('readerCenter').dataset.mode = mode;
    document.querySelectorAll('[data-reader-mode]').forEach(button => button.classList.toggle('is-active', button.dataset.readerMode === mode));
    if (persist) localStorage.setItem('athar-reader-mode', mode);
    if (state.payload) renderPaper(state.payload);
  }

  function applyFontStep(step) {
    state.fontStep = clamp(Number(step || 0), -3, 4);
    document.documentElement.style.setProperty('--reader-ar-size', `${30 + state.fontStep * 2}px`);
    document.documentElement.style.setProperty('--reader-fr-size', `${16 + state.fontStep}px`);
    localStorage.setItem('athar-reader-font-step', String(state.fontStep));
  }

  function translationLabel(status) {
    const raw = String(status || '').toLowerCase();
    if (raw.includes('kutub_ai_unreviewed')) return { label: 'Français · Kutub · IA non vérifiée', warning: true };
    if (raw.includes('human_verified') || raw.includes('published_translation') || raw.includes('verified')) return { label: 'Traduction française vérifiée', warning: false };
    if (raw.includes('reviewed')) return { label: 'Traduction française relue', warning: false };
    return { label: 'Traduction française indexée', warning: false };
  }

  function sourceReference(passage) {
    const source = safeUrl(passage.source_url);
    const pieces = [];
    if (passage.page) pieces.push(`page ${escapeHTML(passage.page)}`);
    if (passage.sequence) pieces.push(`passage ${escapeHTML(passage.sequence)}`);
    const sourceHtml = source ? `<a href="${escapeHTML(source)}" target="_blank" rel="noopener noreferrer">Ouvrir la source</a>` : '<span>Source indexée</span>';
    return `<div class="reader-reference">${pieces.map(item => `<span>${item}</span>`).join('<span>·</span>')}<span>·</span>${sourceHtml}<span class="reader-sequence">Athar Library</span></div>`;
  }

  function chapterHeading(chapter) {
    if (!chapter) return '';
    return `<h2 class="reader-chapter-heading ${isArabic(chapter) ? 'is-arabic' : ''}" ${isArabic(chapter) ? 'lang="ar"' : ''}>${escapeHTML(chapter)}</h2>`;
  }

  function renderPassage(passage) {
    const ar = String(passage.text_ar || '').trim();
    const fr = String(passage.text_fr || '').trim();
    const status = translationLabel(passage.translation_status);
    const french = fr
      ? `<div class="reader-french"><div class="reader-translation-head ${status.warning ? 'translation-warning' : ''}">${escapeHTML(status.label)}</div>${escapeHTML(fr)}</div>`
      : (state.mode === 'french' ? '<div class="reader-empty-language">Aucune traduction française n’est indexée pour ce passage. Revenez au mode arabe ou bilingue pour consulter le texte source.</div>' : '');
    return `<section class="reader-passage" data-passage-id="${escapeHTML(passage.id)}">
      ${ar ? `<div class="reader-arabic" lang="ar">${escapeHTML(ar)}</div>` : ''}
      ${french}
      ${sourceReference(passage)}
    </section>`;
  }

  function renderPaper(payload) {
    const passages = Array.isArray(payload?.passages) ? payload.passages : [];
    if (!passages.length) {
      $('readerPaper').innerHTML = '<div class="reader-loading">Aucun passage n’est disponible à cet emplacement.</div>';
      updateReaderNavigation(payload);
      return;
    }

    const groups = [];
    let current = null;
    passages.forEach(passage => {
      const key = passage.page ?? 'none';
      if (!current || current.key !== key) {
        current = { key, page: passage.page, passages: [] };
        groups.push(current);
      }
      current.passages.push(passage);
    });

    const body = groups.map(group => {
      let lastChapter = null;
      const passagesHtml = group.passages.map(passage => {
        const chapter = String(passage.chapter || '').trim();
        const heading = chapter && chapter !== lastChapter ? chapterHeading(chapter) : '';
        if (chapter) lastChapter = chapter;
        return `${heading}${renderPassage(passage)}`;
      }).join('');
      return `<section class="reader-page-block" data-page="${escapeHTML(group.page ?? '')}">
        <div class="reader-page-number">${group.page ? `PAGE ${escapeHTML(group.page)}` : 'PASSAGES NON PAGINÉS'}</div>
        ${passagesHtml}
      </section>`;
    }).join('');

    const modeLabel = state.mode === 'bilingual' ? 'Arabe + français' : state.mode === 'french' ? 'Français indexé' : 'Texte arabe original';
    $('readerPaper').innerHTML = `<div class="reader-paper-header"><span>${escapeHTML(modeLabel)}</span><span>${payload.page ? `Page ${escapeHTML(payload.page)}` : 'Lecture continue'}</span></div>${body}`;
    updateReaderNavigation(payload);
    renderToc();
  }

  function updateReaderNavigation(payload) {
    if (!payload) return;
    const pageMode = payload.page !== null && payload.page !== undefined;
    const hasPrev = pageMode ? (payload.previous_offset !== null || payload.previous_page !== null) : payload.previous_offset !== null;
    const hasNext = pageMode ? (payload.next_offset !== null || payload.next_page !== null) : payload.next_offset !== null;
    ['readerPrev', 'readerPrevBottom'].forEach(id => { $(id).disabled = !hasPrev; });
    ['readerNext', 'readerNextBottom'].forEach(id => { $(id).disabled = !hasNext; });

    if (pageMode) {
      const start = Number(payload.offset || 0) + 1;
      const end = Number(payload.offset || 0) + (payload.passages?.length || 0);
      const suffix = payload.total > (payload.passages?.length || 0) ? ` · ${start}–${end}/${payload.total}` : '';
      $('readerPosition').textContent = `Page ${payload.page}${suffix}`;
      $('readerBottomLabel').textContent = `Page ${payload.page}${suffix}`;
      $('readerPageInput').value = payload.page;
    } else {
      const start = Number(payload.offset || 0) + 1;
      const end = Number(payload.offset || 0) + (payload.passages?.length || 0);
      $('readerPosition').textContent = `${number(start)}–${number(end)}`;
      $('readerBottomLabel').textContent = `Passages ${number(start)} à ${number(end)} sur ${number(payload.total)}`;
      $('readerPageInput').value = '';
    }
    updateHash();
  }

  async function loadReading(params) {
    if (!state.activeBook) return;
    const token = ++state.readToken;
    loadingPaper(params.page ? `Ouverture de la page ${params.page}…` : 'Chargement de la lecture continue…');
    try {
      const payload = await api('/api/rag/v5/read', {
        book_id: state.activeBook.id,
        page: params.page,
        offset: params.offset || 0,
        limit: 12
      });
      if (token !== state.readToken) return;
      state.payload = payload;
      renderPaper(payload);
      $('readerPaper').scrollIntoView({ block: 'start', behavior: 'smooth' });
    } catch (error) {
      if (token !== state.readToken) return;
      $('readerPaper').innerHTML = `<div class="reader-empty-language"><strong>Lecture impossible.</strong><br>${escapeHTML(error.message)}</div>`;
      toast(error.message, true);
    }
  }

  const loadPage = (page, offset = 0) => loadReading({ page: Number(page), offset: Number(offset || 0) });
  const loadContinuous = (offset = 0) => loadReading({ page: null, offset: Number(offset || 0) });

  function goPrevious() {
    const payload = state.payload;
    if (!payload) return;
    if (payload.page !== null && payload.page !== undefined) {
      if (payload.previous_offset !== null) return loadPage(payload.page, payload.previous_offset);
      if (payload.previous_page !== null) return loadPage(payload.previous_page, 0);
      return;
    }
    if (payload.previous_offset !== null) loadContinuous(payload.previous_offset);
  }

  function goNext() {
    const payload = state.payload;
    if (!payload) return;
    if (payload.page !== null && payload.page !== undefined) {
      if (payload.next_offset !== null) return loadPage(payload.page, payload.next_offset);
      if (payload.next_page !== null) return loadPage(payload.next_page, 0);
      return;
    }
    if (payload.next_offset !== null) loadContinuous(payload.next_offset);
  }

  function renderToc() {
    const host = $('tocList');
    if (!host) return;
    const query = normalize($('tocQuery')?.value || '');
    const currentPage = Number(state.payload?.page || 0);
    const currentChapter = String(state.payload?.passages?.[0]?.chapter || '').trim();
    const items = state.toc.filter(item => !query || normalize(item.chapter).includes(query));
    if (!items.length) {
      host.innerHTML = '<div class="toc-empty">Aucune section ne correspond à ce filtre. La navigation par numéro de page reste disponible dans la barre de lecture.</div>';
      return;
    }
    host.innerHTML = items.map(item => {
      const current = currentChapter ? item.chapter === currentChapter : (currentPage && Number(item.first_page || 0) === currentPage);
      return `<button class="toc-item ${current ? 'is-current' : ''}" type="button" data-toc-page="${escapeHTML(item.first_page || '')}">
        <span class="toc-index">${escapeHTML(item.sequence)}</span>
        <span class="toc-label">${escapeHTML(item.chapter)}</span>
        <span class="toc-page">${item.first_page ? `p. ${escapeHTML(item.first_page)}` : '—'}</span>
      </button>`;
    }).join('');
  }

  function selectReaderTab(name) {
    document.querySelectorAll('[data-reader-tab]').forEach(button => button.classList.toggle('is-active', button.dataset.readerTab === name));
    document.querySelectorAll('[data-reader-panel]').forEach(panel => { panel.hidden = panel.dataset.readerPanel !== name; });
  }

  function preview(value, query, max = 240) {
    const text = String(value || '').replace(/\s+/g, ' ').trim();
    if (!text) return '';
    const folded = normalize(text);
    const needle = normalize(query).split(' ')[0] || '';
    const position = needle ? folded.indexOf(needle) : -1;
    const start = position > 70 ? Math.max(0, position - 70) : 0;
    const slice = text.slice(start, start + max);
    return `${start ? '…' : ''}${slice}${start + max < text.length ? '…' : ''}`;
  }

  async function searchInsideBook(query) {
    if (!state.activeBook) return;
    const cleaned = String(query || '').trim();
    if (!cleaned) return;
    const token = ++state.searchToken;
    const host = $('bookSearchResults');
    host.innerHTML = '<div class="toc-empty">Recherche dans l’ouvrage…</div>';
    try {
      const payload = await api('/api/rag/v5/book-search', { book_id: state.activeBook.id, q: cleaned, limit: 12 });
      if (token !== state.searchToken) return;
      const hits = Array.isArray(payload.hits) ? payload.hits : [];
      if (!hits.length) {
        host.innerHTML = '<div class="toc-empty">Aucun passage correspondant n’a été trouvé dans cet ouvrage.</div>';
        return;
      }
      const arabicQuery = isArabic(cleaned);
      host.innerHTML = hits.map(hit => {
        const primary = arabicQuery ? firstText(hit.text_ar, hit.text_fr) : firstText(hit.text_fr, hit.text_ar);
        const arabic = isArabic(primary);
        return `<article class="book-search-hit" tabindex="0" role="button" data-hit-page="${escapeHTML(hit.page || '')}">
          <div class="book-search-hit-head"><strong>${hit.page ? `Page ${escapeHTML(hit.page)}` : 'Passage'}</strong><span>${escapeHTML(hit.chapter || 'Section non titrée')}</span></div>
          <p class="${arabic ? 'ar' : ''}" ${arabic ? 'lang="ar"' : ''}>${escapeHTML(preview(primary, cleaned))}</p>
        </article>`;
      }).join('');
    } catch (error) {
      if (token !== state.searchToken) return;
      host.innerHTML = `<div class="toc-empty">${escapeHTML(error.message)}</div>`;
    }
  }

  function updateHash() {
    if (!state.activeBook) return;
    const params = new URLSearchParams();
    params.set('book', state.activeBook.id);
    if (state.payload?.page) params.set('page', state.payload.page);
    if (state.payload?.offset) params.set('offset', state.payload.offset);
    history.replaceState({}, '', `${location.pathname}${location.search}#${params.toString()}`);
  }

  function hashParams() {
    return new URLSearchParams(location.hash.replace(/^#/, ''));
  }

  async function openFromHash() {
    const params = hashParams();
    const bookId = params.get('book');
    if (!bookId || !state.books.some(book => book.id === bookId)) return;
    await openBook(bookId, {
      page: Number(params.get('page') || 0) || null,
      offset: Number(params.get('offset') || 0) || 0
    });
  }

  async function openBook(bookId, options = {}) {
    $('libraryView').hidden = true;
    $('readerView').hidden = false;
    document.body.classList.remove('reader-focus', 'reader-nav-open');
    state.focus = false;
    state.payload = null;
    state.toc = [];
    state.tocMeta = null;
    window.scrollTo(0, 0);
    loadingPaper();
    $('tocList').innerHTML = '<div class="toc-empty">Chargement du sommaire…</div>';
    $('bookSearchResults').innerHTML = '';
    selectReaderTab('toc');

    try {
      const [bookPayload, tocPayload] = await Promise.all([
        api('/api/rag/v5/book', { id: bookId }),
        api('/api/rag/v5/toc', { book_id: bookId, limit: 360 }).catch(error => ({ toc: { items: [], total: 0, truncated: false, error: error.message } }))
      ]);
      const book = bookPayload.book;
      if (!book?.id) throw new Error('Les métadonnées de cet ouvrage sont incomplètes.');
      applyBookDetails(book);
      state.tocMeta = tocPayload.toc || { items: [], total: 0, truncated: false };
      state.toc = Array.isArray(state.tocMeta.items) ? state.tocMeta.items : [];
      $('tocTruncated').hidden = !state.tocMeta.truncated;
      renderToc();

      if (options.page) await loadPage(options.page, options.offset || 0);
      else if (book.first_page) await loadPage(book.first_page, 0);
      else await loadContinuous(options.offset || 0);
    } catch (error) {
      toast(error.message, true);
      closeReader(false);
    }
  }

  function closeReader(updateUrl = true) {
    state.activeBook = null;
    state.payload = null;
    state.toc = [];
    state.readToken++;
    $('readerView').hidden = true;
    $('libraryView').hidden = false;
    document.body.classList.remove('reader-focus', 'reader-nav-open');
    if (updateUrl) history.replaceState({}, '', `${location.pathname}${location.search}`);
    window.scrollTo(0, 0);
  }

  function copyText(text) {
    if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
    return Promise.resolve();
  }

  async function copyCurrentReference() {
    if (!state.activeBook) return;
    const page = state.payload?.page ? `, p. ${state.payload.page}` : '';
    const source = safeUrl(state.activeBook.source_url);
    const reference = `${state.activeBook.title}${state.activeBook.author ? ` — ${state.activeBook.author}` : ''}${page}${source ? ` — ${source}` : ''}`;
    try {
      await copyText(reference);
      toast('Référence copiée.');
    } catch (_) {
      toast('Impossible de copier la référence.', true);
    }
  }

  function toggleFocus() {
    state.focus = !state.focus;
    document.body.classList.toggle('reader-focus', state.focus);
    toast(state.focus ? 'Mode lecture sans distraction activé.' : 'Panneaux de navigation restaurés.');
  }

  function bindEvents() {
    ['catalogQuery', 'disciplineFilter', 'madhhabFilter', 'languageFilter', 'sortBooks'].forEach(id => {
      $(id)?.addEventListener(id.includes('Filter') || id === 'sortBooks' ? 'change' : 'input', renderCatalog);
    });

    $('resetFilters')?.addEventListener('click', () => {
      $('catalogQuery').value = '';
      $('heroBookQuery').value = '';
      $('disciplineFilter').value = '';
      $('madhhabFilter').value = '';
      $('languageFilter').value = '';
      $('sortBooks').value = 'title';
      renderCatalog();
    });

    $('heroBookSearch')?.addEventListener('submit', event => {
      event.preventDefault();
      $('catalogQuery').value = $('heroBookQuery').value;
      renderCatalog();
      $('catalogue').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    $('catalogGrid')?.addEventListener('click', event => {
      const card = event.target.closest('[data-book-id]');
      if (card) openBook(card.dataset.bookId);
    });
    $('catalogGrid')?.addEventListener('keydown', event => {
      const card = event.target.closest('[data-book-id]');
      if (card && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        openBook(card.dataset.bookId);
      }
    });

    $('closeReader')?.addEventListener('click', () => closeReader());
    ['readerPrev', 'readerPrevBottom'].forEach(id => $(id)?.addEventListener('click', goPrevious));
    ['readerNext', 'readerNextBottom'].forEach(id => $(id)?.addEventListener('click', goNext));

    $('readerPageForm')?.addEventListener('submit', event => {
      event.preventDefault();
      const page = Number($('readerPageInput').value || 0);
      if (!page) return toast('Indiquez un numéro de page valide.', true);
      loadPage(page, 0);
    });

    document.querySelectorAll('[data-reader-mode]').forEach(button => button.addEventListener('click', () => setReaderMode(button.dataset.readerMode)));
    $('fontDown')?.addEventListener('click', () => applyFontStep(state.fontStep - 1));
    $('fontUp')?.addEventListener('click', () => applyFontStep(state.fontStep + 1));
    $('fontReset')?.addEventListener('click', () => applyFontStep(0));

    document.querySelectorAll('[data-reader-tab]').forEach(button => button.addEventListener('click', () => selectReaderTab(button.dataset.readerTab)));
    $('tocQuery')?.addEventListener('input', renderToc);
    $('tocList')?.addEventListener('click', event => {
      const item = event.target.closest('[data-toc-page]');
      if (!item) return;
      const page = Number(item.dataset.tocPage || 0);
      if (!page) return toast('Cette section n’a pas de page indexée.', true);
      document.body.classList.remove('reader-nav-open');
      loadPage(page, 0);
    });

    $('bookSearchForm')?.addEventListener('submit', event => {
      event.preventDefault();
      searchInsideBook($('bookSearchQuery').value);
    });
    $('bookSearchResults')?.addEventListener('click', event => {
      const hit = event.target.closest('[data-hit-page]');
      if (!hit) return;
      const page = Number(hit.dataset.hitPage || 0);
      if (!page) return toast('Ce résultat ne possède pas de page indexée.', true);
      document.body.classList.remove('reader-nav-open');
      loadPage(page, 0);
    });
    $('bookSearchResults')?.addEventListener('keydown', event => {
      const hit = event.target.closest('[data-hit-page]');
      if (hit && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        hit.click();
      }
    });

    $('continuousReading')?.addEventListener('click', () => {
      document.body.classList.remove('reader-nav-open');
      loadContinuous(0);
    });
    $('copyReference')?.addEventListener('click', copyCurrentReference);
    $('focusMode')?.addEventListener('click', toggleFocus);
    $('mobileNavigatorToggle')?.addEventListener('click', () => document.body.classList.toggle('reader-nav-open'));

    document.addEventListener('keydown', event => {
      if ($('readerView').hidden) return;
      const tag = document.activeElement?.tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;
      if (event.key === 'Escape') {
        if (document.body.classList.contains('reader-nav-open')) document.body.classList.remove('reader-nav-open');
        else closeReader();
      } else if (event.key === 'ArrowLeft') goPrevious();
      else if (event.key === 'ArrowRight') goNext();
    });

    window.addEventListener('popstate', () => {
      if (!location.hash && !$('readerView').hidden) closeReader(false);
    });
  }

  function init() {
    state.fontStep = clamp(Number(localStorage.getItem('athar-reader-font-step') || 0), -3, 4);
    applyFontStep(state.fontStep);
    bindEvents();
    loadCatalogue();
  }

  window.AtharResearchLibrary = Object.freeze({ openBook, closeReader, loadPage, loadContinuous, searchInsideBook, setReaderMode });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
