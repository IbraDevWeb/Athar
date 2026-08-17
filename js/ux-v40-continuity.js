// Athar V40.2 — reading continuity and passage-to-Research bridge.
(() => {
  'use strict';

  const VERSION = 'athar-v40-continuity-1';
  const RECENTS_KEY = 'athar_v402_recent_reads';
  const MAX_RECENTS = 8;
  let observer = null;
  let queued = false;

  const escapeHTML = value => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const readRecents = () => {
    try {
      const value = JSON.parse(localStorage.getItem(RECENTS_KEY) || '[]');
      return Array.isArray(value) ? value.filter(item => item?.book_id && item?.title).slice(0, MAX_RECENTS) : [];
    } catch (_) { return []; }
  };

  const writeRecents = items => {
    try { localStorage.setItem(RECENTS_KEY, JSON.stringify(items.slice(0, MAX_RECENTS))); }
    catch (_) {}
  };

  const hashState = () => {
    const params = new URLSearchParams(location.hash.replace(/^#/, ''));
    return {
      book_id: params.get('book') || '',
      page: params.get('page') || '',
      offset: params.get('offset') || ''
    };
  };

  function activeReaderState() {
    const reader = document.getElementById('readerView');
    if (!reader || reader.hidden) return null;
    const hash = hashState();
    if (!hash.book_id) return null;
    const title = document.getElementById('readerTitle')?.textContent?.trim()
      || document.getElementById('readerCompactTitle')?.textContent?.trim()
      || '';
    if (!title || title === 'Ouvrage') return null;
    const author = document.getElementById('readerAuthor')?.textContent?.trim()
      || document.getElementById('bookrailAuthor')?.textContent?.trim()
      || '';
    const page = document.getElementById('readerPageInput')?.value?.trim() || hash.page || '';
    const meta = document.getElementById('readerCompactMeta')?.textContent?.trim() || '';
    return {
      book_id: hash.book_id,
      title,
      author,
      page,
      offset: hash.offset,
      meta,
      href: location.pathname.split('/').pop() + location.search + location.hash,
      updated_at: new Date().toISOString()
    };
  }

  function rememberCurrentRead() {
    const current = activeReaderState();
    if (!current) return false;
    const recents = readRecents();
    const previous = recents.find(item => item.book_id === current.book_id) || {};
    const samePosition = previous.book_id === current.book_id
      && String(previous.page || '') === String(current.page || '')
      && String(previous.offset || '') === String(current.offset || '');
    if (samePosition && previous.title === current.title && previous.author === current.author) return true;
    const next = [{ ...previous, ...current }, ...recents.filter(item => item.book_id !== current.book_id)];
    writeRecents(next);
    return true;
  }

  const recentHref = item => {
    const url = new URL('research-library.html', location.href);
    const params = new URLSearchParams();
    params.set('book', item.book_id);
    if (item.page) params.set('page', item.page);
    if (item.offset) params.set('offset', item.offset);
    url.hash = params.toString();
    return url.href;
  };

  const relativeTime = value => {
    const stamp = new Date(value || 0).getTime();
    if (!stamp) return 'Lecture récente';
    const minutes = Math.max(0, Math.round((Date.now() - stamp) / 60000));
    if (minutes < 2) return 'À l’instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `Il y a ${hours} h`;
    const days = Math.round(hours / 24);
    return `Il y a ${days} j`;
  };

  function renderRecentShelf() {
    const library = document.getElementById('libraryView');
    if (!library || library.hidden) return false;
    const shell = library.querySelector('.library-shell');
    const hero = shell?.querySelector('.library-hero');
    if (!shell || !hero) return false;

    const recents = readRecents();
    let section = document.getElementById('ar402RecentReads');
    if (!recents.length) {
      section?.remove();
      return false;
    }

    const visibleRecents = recents.slice(0, 4);
    const signature = JSON.stringify(visibleRecents.map(item => [item.book_id, item.page || '', item.offset || '', item.updated_at || '']));
    if (section?.dataset.ar402Signature === signature) return true;

    if (!section) {
      section = document.createElement('section');
      section.id = 'ar402RecentReads';
      section.className = 'ar402-recents';
      section.setAttribute('aria-label', 'Reprendre une lecture');
      hero.insertAdjacentElement('afterend', section);
    }

    section.innerHTML = `
      <header class="ar402-recents-head">
        <div><span>Continuité</span><h2>Reprendre une lecture</h2></div>
        <button type="button" data-ar402-clear-recents>Effacer</button>
      </header>
      <div class="ar402-recents-track">
        ${visibleRecents.map((item, index) => `
          <a class="ar402-recent-card" href="${escapeHTML(recentHref(item))}" data-ar402-recent-book="${escapeHTML(item.book_id)}">
            <span class="ar402-recent-index">${String(index + 1).padStart(2, '0')}</span>
            <span class="ar402-recent-copy">
              <small>${escapeHTML(relativeTime(item.updated_at))}${item.page ? ` · page ${escapeHTML(item.page)}` : ''}</small>
              <strong>${escapeHTML(item.title)}</strong>
              <em>${escapeHTML(item.author || item.meta || 'Corpus Athar')}</em>
            </span>
            <span class="ar402-recent-action">Reprendre →</span>
          </a>`).join('')}
      </div>`;
    section.dataset.ar402Signature = signature;
    return true;
  }

  function resumeRecent(link) {
    const bookId = link?.dataset.ar402RecentBook || '';
    const item = readRecents().find(entry => entry.book_id === bookId);
    if (!item) return false;
    if (window.AtharResearchLibrary?.openBook) {
      window.AtharResearchLibrary.openBook(item.book_id, {
        page: Number(item.page || 0) || null,
        offset: Number(item.offset || 0) || 0
      });
      return true;
    }
    location.href = recentHref(item);
    return true;
  }

  const cleanExcerpt = value => String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 170);

  function passageContext(passage) {
    const title = document.getElementById('readerTitle')?.textContent?.trim() || 'cet ouvrage';
    const pageBlock = passage.closest('.reader-page-block');
    const page = pageBlock?.dataset.page || document.getElementById('readerPageInput')?.value?.trim() || '';
    const ar = passage.querySelector('.reader-arabic')?.textContent || '';
    const fr = passage.querySelector('.reader-french')?.textContent || '';
    const excerpt = cleanExcerpt(fr || ar);
    const pagePart = page ? ` à la page ${page}` : '';
    const excerptPart = excerpt ? `, au sujet du passage « ${excerpt}${(fr || ar).trim().length > excerpt.length ? '…' : ''} »` : '';
    return `Dans l’ouvrage « ${title} »${pagePart}${excerptPart}, `;
  }

  function addPassageResearchActions() {
    const reader = document.getElementById('readerView');
    if (!reader || reader.hidden) return false;
    let changed = false;
    reader.querySelectorAll('.reader-passage').forEach(passage => {
      if (passage.querySelector('[data-ar402-research-passage]')) return;
      const reference = passage.querySelector('.reader-reference');
      if (!reference) return;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'ar402-ask-passage';
      button.dataset.ar402ResearchPassage = 'true';
      button.innerHTML = '<span aria-hidden="true">⌕</span><span>Interroger ce passage</span>';
      button.setAttribute('aria-label', 'Interroger ce passage dans Athar Research');
      reference.appendChild(button);
      changed = true;
    });
    return changed;
  }

  function askPassage(button) {
    const passage = button.closest('.reader-passage');
    if (!passage) return;
    const draft = passageContext(passage);
    if (window.AtharV40?.goToResearch) {
      window.AtharV40.goToResearch(draft);
      return;
    }
    try {
      sessionStorage.setItem('athar_v40_open_research', '1');
      sessionStorage.setItem('athar_v40_research_draft', draft);
    } catch (_) {}
    location.href = new URL('index.html', location.href).href;
  }

  function addLibraryRecentNav() {
    const nav = document.querySelector('.library-nav');
    if (!nav || nav.querySelector('[data-ar402-recents-link]')) return false;
    const link = document.createElement('a');
    link.href = '#ar402RecentReads';
    link.dataset.ar402RecentsLink = 'true';
    link.textContent = 'Reprendre';
    link.addEventListener('click', event => {
      const section = document.getElementById('ar402RecentReads');
      if (!section) return;
      event.preventDefault();
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    nav.appendChild(link);
    return true;
  }

  function enhance() {
    queued = false;
    document.documentElement.dataset.atharV40Continuity = VERSION;
    if (!document.body.classList.contains('athar-v40-library')) return;
    renderRecentShelf();
    addLibraryRecentNav();
    const reader = document.getElementById('readerView');
    if (reader && !reader.hidden) {
      rememberCurrentRead();
      addPassageResearchActions();
    }
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(enhance);
  }

  const nodeContainsPassage = node => node instanceof Element
    && (node.matches('.reader-passage, .reader-page-block') || Boolean(node.querySelector('.reader-passage')));

  const mutationNeedsEnhance = record => record.type === 'childList'
    && [...record.addedNodes].some(nodeContainsPassage);

  document.addEventListener('click', event => {
    const ask = event.target.closest('[data-ar402-research-passage]');
    if (ask) {
      event.preventDefault();
      askPassage(ask);
      return;
    }
    const recent = event.target.closest('[data-ar402-recent-book]');
    if (recent) {
      event.preventDefault();
      resumeRecent(recent);
      return;
    }
    const clear = event.target.closest('[data-ar402-clear-recents]');
    if (clear) {
      writeRecents([]);
      renderRecentShelf();
      return;
    }
    if (event.target.closest('#closeReader')) {
      rememberCurrentRead();
      window.setTimeout(() => {
        renderRecentShelf();
        schedule();
      }, 0);
    }
  }, true);

  window.addEventListener('hashchange', () => setTimeout(() => { rememberCurrentRead(); schedule(); }, 0));
  window.addEventListener('beforeunload', () => {
    rememberCurrentRead();
    observer?.disconnect();
  }, { once: true });

  function start() {
    enhance();
    observer = new MutationObserver(records => {
      if (records.some(mutationNeedsEnhance)) schedule();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.AtharV40Continuity = Object.freeze({
      version: VERSION,
      readRecents,
      rememberCurrentRead,
      renderRecentShelf,
      resumeRecent,
      passageContext
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
