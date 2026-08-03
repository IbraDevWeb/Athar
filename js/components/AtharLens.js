// Athar Pro — Athar Lens, moteur transversal de connaissance.
(() => {
    if (window.AtharLens) return;

    const STORAGE_KEY = 'athar_lens_v1';
    const MAX_RESULTS = 18;
    const typeMeta = {
        biography: { label: 'Biographie', icon: '◉', color: '#8d6c3f' },
        hadith: { label: 'Hadith', icon: '❝', color: '#6e5d91' },
        root: { label: 'Racine arabe', icon: 'ج', color: '#2d7b65' },
        chain: { label: 'Isnād', icon: '⛓', color: '#b38b3d' },
        history: { label: 'Récit historique', icon: '☾', color: '#596e9a' },
        scholar: { label: 'Transmission', icon: '◎', color: '#8d5f55' },
        glossary: { label: 'Notion', icon: 'A', color: '#637068' },
        manuscript: { label: 'Manuscrit', icon: '✒', color: '#9b7046' },
        astronomy: { label: 'Ciel ancien', icon: '✦', color: '#587b9e' },
        tool: { label: 'Outil Athar', icon: '◇', color: '#6f6758' }
    };

    const starters = [
        { query: 'miséricorde', title: 'Comprendre la miséricorde', subtitle: 'Racine, hadith, figures et pratiques' },
        { query: 'Médine', title: 'Explorer Médine', subtitle: 'Savants, transmission et moments historiques' },
        { query: 'intention', title: 'Suivre l’intention', subtitle: 'Du hadith à l’éthique de l’action' },
        { query: 'patience', title: 'Étudier la patience', subtitle: 'Vocabulaire, récits et enseignements' }
    ];

    const stopWords = new Set([
        'avec','dans','pour','sans','sous','chez','entre','mais','dont','elle','elles','nous','vous','leur','leurs',
        'cette','celui','ceux','tout','tous','toute','toutes','plus','moins','ainsi','comme','vers','apres','avant',
        'par','une','des','les','aux','est','sont','son','ses','sur','qui','que','quoi','du','de','la','le','un','et',
        'allah','prophete','muhammad','islam','musulman','musulmans','avait','fait','faire','ete','etre','lors'
    ]);

    const state = {
        open: false,
        mode: 'search',
        query: '',
        results: [],
        selectedUid: null,
        activeIndex: 0,
        journey: [],
        recent: [],
        index: []
    };

    let root;
    let input;
    let resultsNode;
    let detailNode;
    let statusNode;

    const normalize = (value) => String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
        .replace(/[ʿʾ‘’'`´]/g, '')
        .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();

    const escapeHtml = (value) => String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

    const truncate = (value, max = 190) => {
        const text = String(value || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        return text.length > max ? `${text.slice(0, max - 1).trim()}…` : text;
    };

    const tokenise = (value) => [...new Set(normalize(value).split(' ').filter(token => token.length > 2 && !stopWords.has(token)))];

    function readState() {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            state.recent = Array.isArray(saved.recent) ? saved.recent.slice(0, 6) : [];
        } catch (_) {
            state.recent = [];
        }
    }

    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ recent: state.recent.slice(0, 6) }));
        } catch (_) {}
    }

    function addItem(item) {
        if (!item?.uid || !item?.title || !item?.route?.view) return;
        const tags = Array.isArray(item.tags) ? item.tags.filter(Boolean).map(String) : [];
        const body = [item.title, item.arabic, item.subtitle, item.excerpt, ...tags, item.body].filter(Boolean).join(' ');
        state.index.push({
            ...item,
            tags,
            excerpt: truncate(item.excerpt || item.body || ''),
            searchText: normalize(body),
            titleText: normalize(item.title),
            subtitleText: normalize(item.subtitle),
            tokens: tokenise(body)
        });
    }

    function buildIndex() {
        state.index = [];

        const chapters = typeof CHAPTERS_DATA !== 'undefined' && Array.isArray(CHAPTERS_DATA) ? CHAPTERS_DATA : [];
        chapters.forEach(chapter => addItem({
            uid: `biography:${chapter.id}`,
            type: 'biography',
            title: chapter.name,
            arabic: chapter.arabicName,
            subtitle: chapter.subtitle,
            excerpt: chapter.intro,
            tags: chapter.tags,
            body: [chapter.genealogy, chapter.heroQuote, ...(chapter.narratives || []).flatMap(item => [item.title, item.content]), ...(chapter.timeline || []).map(item => item.desc)].join(' '),
            route: { view: 'library', chapterId: chapter.id }
        }));

        const hadiths = typeof STORED_HADITHS !== 'undefined' && Array.isArray(STORED_HADITHS) ? STORED_HADITHS : [];
        hadiths.forEach(hadith => addItem({
            uid: `hadith:${hadith.id}`,
            type: 'hadith',
            title: hadith.title,
            arabic: hadith.hadeeth_ar,
            subtitle: `${hadith.grade || 'Hadith'} · ${hadith.attribution || ''}`,
            excerpt: hadith.explanation || hadith.hadeeth,
            tags: [hadith.grade, hadith.attribution, ...(hadith.hints || [])].filter(Boolean),
            body: [hadith.hadeeth, hadith.hadeeth_ar, hadith.explanation, ...(hadith.hints || [])].join(' '),
            route: { view: 'hadiths', hadithId: hadith.id }
        }));

        const roots = window.ROOT_TREE_DATA?.roots || [];
        roots.forEach(item => addItem({
            uid: `root:${item.id}`,
            type: 'root',
            title: `${item.root} — ${item.title}`,
            arabic: item.root,
            subtitle: item.transliteration,
            excerpt: item.core,
            tags: [item.category, item.nuance, ...item.derivatives.flatMap(word => [word.word, word.transliteration, word.label])],
            body: [item.memory, ...item.derivatives.map(word => word.note), ...item.verses.flatMap(verse => [verse.reference, verse.arabic, verse.translation])].join(' '),
            route: { view: 'roots', rootId: item.id }
        }));

        const chains = window.GOLDEN_CHAIN_DATA?.chains || [];
        chains.forEach(item => addItem({
            uid: `chain:${item.id}`,
            type: 'chain',
            title: item.title,
            arabic: item.arabic,
            subtitle: `${item.region} · ${item.badge}`,
            excerpt: item.summary,
            tags: [item.collection, item.reference, item.sample?.theme],
            body: [item.scholarlyNote, item.sample?.arabic, item.sample?.french, ...(item.linkLabels || [])].join(' '),
            route: { view: 'isnad', chainId: item.id }
        }));

        const stories = window.HISTORY_NIGHTS_DATA?.stories || [];
        stories.forEach(item => addItem({
            uid: `history:${item.id}`,
            type: 'history',
            title: item.title,
            arabic: item.arabic,
            subtitle: `${item.period} · ${item.location}`,
            excerpt: item.summary || item.opening,
            tags: [item.theme, item.duration, item.openingSource],
            body: (item.chapters || []).flatMap(chapter => [chapter.title, chapter.kicker, chapter.reflection, ...(chapter.body || [])]).join(' '),
            route: { view: 'history_nights', storyId: item.id }
        }));

        const folios = window.SCRIPTORIUM_DATA?.folios || [];
        folios.forEach(item => addItem({
            uid: `manuscript:${item.id}`,
            type: 'manuscript',
            title: item.title,
            arabic: item.arabic,
            subtitle: `${item.period} · ${item.region}`,
            excerpt: item.summary,
            tags: [item.script, item.support, item.format, ...(item.observations || [])],
            body: [item.insight, item.source?.institution, item.source?.note].join(' '),
            route: { view: 'scriptorium', folioId: item.id }
        }));

        const skyObjects = window.ANCIENT_SKY_DATA?.objects || [];
        skyObjects.forEach(item => addItem({
            uid: `astronomy:${item.id}`,
            type: 'astronomy',
            title: item.name,
            arabic: item.arabic,
            subtitle: `${item.transliteration || ''} · ${item.type || 'Repère céleste'}`,
            excerpt: item.summary || item.description,
            tags: [item.category, item.latin, item.source],
            body: [item.story, item.memory, item.references].join(' '),
            route: { view: 'astronomy', objectId: item.id }
        }));

        const silsila = typeof SILSILA_DATA !== 'undefined' && Array.isArray(SILSILA_DATA?.nodes) ? SILSILA_DATA.nodes : [];
        silsila.forEach(item => addItem({
            uid: `scholar:${item.id}`,
            type: 'scholar',
            title: item.label,
            arabic: item.arabicName,
            subtitle: `${item.role || 'Savant'} · ${item.city || item.region || ''}`,
            excerpt: item.bio,
            tags: [item.group, item.dates, ...(item.keywords || []), ...(item.contributions || [])],
            body: [item.legacy, ...(item.works || []), ...(item.sources || [])].join(' '),
            route: { view: 'transmission', scholarId: item.id }
        }));

        const glossary = typeof GLOSSARY_DATA !== 'undefined' && GLOSSARY_DATA && typeof GLOSSARY_DATA === 'object' ? GLOSSARY_DATA : {};
        Object.entries(glossary).forEach(([term, item]) => addItem({
            uid: `glossary:${term}`,
            type: 'glossary',
            title: term,
            subtitle: item.origin || 'Glossaire Athar',
            excerpt: item.def,
            tags: [item.origin],
            body: item.def,
            route: { view: 'glossary', query: term }
        }));

        const extensions = typeof EXTENSIONS_DATA !== 'undefined' && EXTENSIONS_DATA && typeof EXTENSIONS_DATA === 'object' ? EXTENSIONS_DATA : {};
        Object.entries(extensions).forEach(([view, item]) => addItem({
            uid: `tool:${view}`,
            type: 'tool',
            title: item.title,
            subtitle: 'Section Athar Pro',
            excerpt: item.desc,
            tags: [item.type],
            body: item.desc,
            route: { view }
        }));
    }

    function scoreItem(item, query) {
        const clean = normalize(query);
        if (!clean) return 0;
        const terms = clean.split(' ').filter(Boolean);
        let score = 0;
        if (item.titleText === clean) score += 180;
        else if (item.titleText.startsWith(clean)) score += 110;
        else if (item.titleText.includes(clean)) score += 72;
        if (item.subtitleText.includes(clean)) score += 32;
        if (item.searchText.includes(clean)) score += 24;

        let matched = 0;
        for (const term of terms) {
            if (item.titleText.includes(term)) { score += 36; matched += 1; }
            else if (item.subtitleText.includes(term)) { score += 20; matched += 1; }
            else if (item.searchText.includes(term)) { score += 8; matched += 1; }
        }
        if (!matched) return 0;
        score += (matched / terms.length) * 30;
        if (item.type === 'root' && /[\u0600-\u06ff]/.test(query)) score += 18;
        return score;
    }

    function runSearch(query, limit = MAX_RESULTS) {
        return state.index
            .map(item => ({ item, score: scoreItem(item, query) }))
            .filter(entry => entry.score > 0)
            .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title, 'fr'))
            .slice(0, limit)
            .map(entry => ({ ...entry.item, score: Math.round(entry.score) }));
    }

    function selectedItem() {
        const pool = state.mode === 'journey' ? state.journey : state.results;
        return pool.find(item => item.uid === state.selectedUid) || pool[0] || null;
    }

    function relatedItems(item) {
        if (!item) return [];
        const sourceTokens = new Set(item.tokens);
        return state.index
            .filter(candidate => candidate.uid !== item.uid)
            .map(candidate => {
                const common = candidate.tokens.filter(token => sourceTokens.has(token));
                let score = common.length * 9;
                if (candidate.type !== item.type) score += 8;
                if (candidate.searchText.includes(item.titleText)) score += 16;
                return { item: candidate, score, common };
            })
            .filter(entry => entry.score >= 14)
            .sort((a, b) => b.score - a.score)
            .filter((entry, index, array) => array.findIndex(other => other.item.type === entry.item.type) === index)
            .slice(0, 4)
            .map(entry => ({ ...entry.item, connection: entry.common.slice(0, 3).join(' · ') }));
    }

    function journeyReason(item, index) {
        const reasons = {
            root: 'Commence par la langue : la racine donne la direction du sens.',
            glossary: 'Clarifie la notion avant d’entrer dans les textes.',
            hadith: 'Observe comment l’enseignement est formulé dans la Sunna.',
            biography: 'Découvre comment cette notion a été vécue par une figure historique.',
            scholar: 'Replace le savoir dans une relation maître–élève.',
            chain: 'Suis le trajet concret par lequel un récit a circulé.',
            history: 'Inscris la notion dans une scène et une décision historiques.',
            manuscript: 'Vois comment le savoir a été fixé et transmis par l’écrit.',
            astronomy: 'Élargis la lecture aux repères scientifiques et culturels.',
            tool: 'Poursuis l’exploration dans l’outil spécialisé d’Athar.'
        };
        return reasons[item.type] || `Étape ${index + 1} du parcours.`;
    }

    function buildJourney() {
        if (!state.query.trim()) return;
        const candidates = runSearch(state.query, 80);
        const preferred = ['root','glossary','hadith','biography','scholar','chain','history','manuscript','astronomy','tool'];
        const selected = [];
        for (const type of preferred) {
            const match = candidates.find(item => item.type === type && !selected.some(existing => existing.uid === item.uid));
            if (match) selected.push(match);
            if (selected.length === 6) break;
        }
        if (selected.length < 4) {
            candidates.forEach(item => {
                if (selected.length < 6 && !selected.some(existing => existing.uid === item.uid)) selected.push(item);
            });
        }
        state.journey = selected.map((item, index) => ({ ...item, journeyReason: journeyReason(item, index) }));
        state.mode = 'journey';
        state.selectedUid = state.journey[0]?.uid || null;
        state.activeIndex = 0;
        render();
    }

    function rememberQuery(query) {
        const clean = String(query || '').trim();
        if (clean.length < 2) return;
        state.recent = [clean, ...state.recent.filter(item => normalize(item) !== normalize(clean))].slice(0, 6);
        saveState();
    }

    function prepareDeepLink(route) {
        try {
            if (route.rootId) {
                const current = JSON.parse(localStorage.getItem('athar_root_tree_v1') || '{}');
                localStorage.setItem('athar_root_tree_v1', JSON.stringify({ ...current, selectedRootId: route.rootId }));
            }
            if (route.chainId) {
                const current = JSON.parse(localStorage.getItem('athar_golden_chain_v1') || '{}');
                localStorage.setItem('athar_golden_chain_v1', JSON.stringify({ ...current, selectedChainId: route.chainId }));
            }
            if (route.folioId) {
                const current = JSON.parse(localStorage.getItem('athar_scriptorium_v1') || '{}');
                localStorage.setItem('athar_scriptorium_v1', JSON.stringify({ ...current, selectedId: route.folioId }));
            }
            if (route.storyId) {
                const current = JSON.parse(localStorage.getItem('athar_history_nights_v1') || '{}');
                localStorage.setItem('athar_history_nights_v1', JSON.stringify({ ...current, storyId: route.storyId, chapterIndex: 0 }));
            }
            sessionStorage.setItem('athar_lens_target', JSON.stringify(route));
        } catch (_) {}
    }

    function navigate(item) {
        if (!item?.route) return;
        rememberQuery(state.query || item.title);
        prepareDeepLink(item.route);
        close();
        window.dispatchEvent(new CustomEvent('athar:navigate', { detail: item.route }));
    }

    function itemCard(item, index, journey = false) {
        const meta = typeMeta[item.type] || typeMeta.tool;
        return `
            <button type="button" class="alens-result ${state.selectedUid === item.uid ? 'is-selected' : ''}" data-action="select" data-uid="${escapeHtml(item.uid)}" data-index="${index}" style="--alens-accent:${meta.color}">
                <span class="alens-result-icon" aria-hidden="true">${meta.icon}</span>
                <span class="alens-result-copy">
                    <span class="alens-result-type">${journey ? `Étape ${index + 1} · ` : ''}${escapeHtml(meta.label)}</span>
                    <strong>${escapeHtml(item.title)}</strong>
                    <small>${escapeHtml(item.subtitle || '')}</small>
                    ${journey ? `<em>${escapeHtml(item.journeyReason)}</em>` : ''}
                </span>
                <span class="alens-result-arrow" aria-hidden="true">›</span>
            </button>`;
    }

    function renderEmpty() {
        const recent = state.recent.length ? `
            <div class="alens-recent">
                <div class="alens-section-label">Recherches récentes</div>
                <div class="alens-chip-row">${state.recent.map(query => `<button type="button" data-action="starter" data-query="${escapeHtml(query)}">${escapeHtml(query)}</button>`).join('')}</div>
            </div>` : '';
        return `
            <div class="alens-empty">
                <div class="alens-section-label">Points de départ</div>
                <div class="alens-starter-grid">
                    ${starters.map((item, index) => `
                        <button type="button" class="alens-starter" data-action="starter" data-query="${escapeHtml(item.query)}">
                            <span>0${index + 1}</span>
                            <strong>${escapeHtml(item.title)}</strong>
                            <small>${escapeHtml(item.subtitle)}</small>
                        </button>`).join('')}
                </div>
                ${recent}
            </div>`;
    }

    function renderResults() {
        if (!resultsNode) return;
        if (!state.query.trim()) {
            resultsNode.innerHTML = renderEmpty();
            return;
        }
        const pool = state.mode === 'journey' ? state.journey : state.results;
        if (!pool.length) {
            resultsNode.innerHTML = `
                <div class="alens-no-result">
                    <span>∅</span>
                    <strong>Aucune connexion claire</strong>
                    <p>Essaie un nom, une ville, une notion ou une racine arabe.</p>
                </div>`;
            return;
        }
        resultsNode.innerHTML = `
            <div class="alens-results-head">
                <div>
                    <span>${state.mode === 'journey' ? 'Parcours généré' : `${pool.length} résultats principaux`}</span>
                    <strong>${escapeHtml(state.query)}</strong>
                </div>
                ${state.mode === 'search' ? `<button type="button" data-action="journey">Créer un parcours <span>✦</span></button>` : `<button type="button" data-action="back-search">Retour aux résultats</button>`}
            </div>
            <div class="alens-results-list ${state.mode === 'journey' ? 'is-journey' : ''}">
                ${pool.map((item, index) => itemCard(item, index, state.mode === 'journey')).join('')}
            </div>`;
    }

    function renderDetail() {
        if (!detailNode) return;
        const item = selectedItem();
        if (!item) {
            detailNode.innerHTML = `
                <div class="alens-detail-placeholder">
                    <div class="alens-orbit"><span></span><span></span><b>أ</b></div>
                    <p>Recherche un thème pour révéler ses connexions dans Athar Pro.</p>
                </div>`;
            return;
        }
        const meta = typeMeta[item.type] || typeMeta.tool;
        const related = relatedItems(item);
        detailNode.innerHTML = `
            <article class="alens-detail" style="--alens-accent:${meta.color}">
                <div class="alens-detail-top">
                    <span class="alens-detail-icon">${meta.icon}</span>
                    <div><small>${escapeHtml(meta.label)}</small><strong>${escapeHtml(item.title)}</strong></div>
                </div>
                ${item.arabic ? `<p class="alens-detail-arabic" lang="ar" dir="rtl">${escapeHtml(item.arabic)}</p>` : ''}
                <p class="alens-detail-subtitle">${escapeHtml(item.subtitle || '')}</p>
                <p class="alens-detail-excerpt">${escapeHtml(item.excerpt || 'Ouvre cette ressource pour poursuivre l’exploration.')}</p>
                ${item.tags.length ? `<div class="alens-tags">${item.tags.slice(0, 5).map(tag => `<span>${escapeHtml(truncate(tag, 34))}</span>`).join('')}</div>` : ''}
                <button type="button" class="alens-open" data-action="open-selected">Ouvrir dans Athar <span>↗</span></button>
                <div class="alens-connections">
                    <div class="alens-section-label">Connexions suggérées</div>
                    ${related.length ? related.map(connection => {
                        const relationMeta = typeMeta[connection.type] || typeMeta.tool;
                        return `<button type="button" data-action="select-related" data-uid="${escapeHtml(connection.uid)}"><span style="--alens-related:${relationMeta.color}">${relationMeta.icon}</span><div><strong>${escapeHtml(connection.title)}</strong><small>${escapeHtml(connection.connection || relationMeta.label)}</small></div></button>`;
                    }).join('') : '<p class="alens-connections-empty">Cette ressource est déjà un bon point de départ autonome.</p>'}
                </div>
            </article>`;
    }

    function renderStatus() {
        if (!statusNode) return;
        const countByType = new Set(state.index.map(item => item.type)).size;
        statusNode.textContent = `${state.index.length} ressources · ${countByType} univers · données locales`;
    }

    function render() {
        renderResults();
        renderDetail();
        renderStatus();
    }

    function setQuery(value) {
        state.query = String(value || '');
        state.mode = 'search';
        state.results = runSearch(state.query);
        state.selectedUid = state.results[0]?.uid || null;
        state.activeIndex = 0;
        render();
    }

    function selectByUid(uid) {
        const item = state.index.find(candidate => candidate.uid === uid);
        if (!item) return;
        state.selectedUid = uid;
        const pool = state.mode === 'journey' ? state.journey : state.results;
        state.activeIndex = Math.max(0, pool.findIndex(candidate => candidate.uid === uid));
        renderDetail();
        root?.querySelectorAll('.alens-result').forEach(node => node.classList.toggle('is-selected', node.dataset.uid === uid));
    }

    function open(initialQuery = '') {
        if (!root) return;
        state.open = true;
        root.classList.add('is-open');
        document.documentElement.classList.add('athar-lens-open');
        root.setAttribute('aria-hidden', 'false');
        if (initialQuery) {
            input.value = initialQuery;
            setQuery(initialQuery);
        }
        setTimeout(() => input?.focus(), 30);
    }

    function close() {
        if (!root) return;
        state.open = false;
        root.classList.remove('is-open');
        document.documentElement.classList.remove('athar-lens-open');
        root.setAttribute('aria-hidden', 'true');
    }

    function moveSelection(delta) {
        const pool = state.mode === 'journey' ? state.journey : state.results;
        if (!pool.length) return;
        state.activeIndex = (state.activeIndex + delta + pool.length) % pool.length;
        selectByUid(pool[state.activeIndex].uid);
        root.querySelector(`[data-uid="${CSS.escape(pool[state.activeIndex].uid)}"]`)?.scrollIntoView({ block: 'nearest' });
    }

    function mount() {
        readState();
        buildIndex();
        root = document.createElement('div');
        root.id = 'athar-lens';
        root.className = 'alens-root';
        root.setAttribute('aria-hidden', 'true');
        root.innerHTML = `
            <button type="button" class="alens-launcher" data-action="open" aria-label="Ouvrir Athar Lens">
                <span class="alens-launcher-mark">✦</span>
                <span class="alens-launcher-copy"><strong>Athar Lens</strong><small>Explorer tout le savoir</small></span>
                <kbd>Ctrl K</kbd>
            </button>
            <div class="alens-backdrop" data-action="close"></div>
            <section class="alens-panel" role="dialog" aria-modal="true" aria-label="Athar Lens">
                <header class="alens-header">
                    <div class="alens-brand"><span>✦</span><div><strong>Athar Lens</strong><small>Le savoir relié</small></div></div>
                    <button type="button" class="alens-close" data-action="close" aria-label="Fermer">×</button>
                </header>
                <div class="alens-searchbar">
                    <span aria-hidden="true">⌕</span>
                    <input type="search" autocomplete="off" spellcheck="false" placeholder="Une notion, un savant, une ville, un hadith…" aria-label="Rechercher dans Athar Pro">
                    <kbd>ESC</kbd>
                </div>
                <div class="alens-layout">
                    <div class="alens-results" aria-live="polite"></div>
                    <aside class="alens-detail-pane"></aside>
                </div>
                <footer class="alens-footer">
                    <span class="alens-status"></span>
                    <span><kbd>↑↓</kbd> naviguer <kbd>Entrée</kbd> ouvrir</span>
                </footer>
            </section>`;
        document.body.appendChild(root);

        input = root.querySelector('.alens-searchbar input');
        resultsNode = root.querySelector('.alens-results');
        detailNode = root.querySelector('.alens-detail-pane');
        statusNode = root.querySelector('.alens-status');

        input.addEventListener('input', event => setQuery(event.target.value));
        root.addEventListener('click', event => {
            const actionNode = event.target.closest('[data-action]');
            if (!actionNode) return;
            const action = actionNode.dataset.action;
            if (action === 'open') open();
            if (action === 'close') close();
            if (action === 'starter') {
                const query = actionNode.dataset.query || '';
                input.value = query;
                setQuery(query);
                input.focus();
            }
            if (action === 'select' || action === 'select-related') selectByUid(actionNode.dataset.uid);
            if (action === 'open-selected') navigate(selectedItem());
            if (action === 'journey') buildJourney();
            if (action === 'back-search') {
                state.mode = 'search';
                state.selectedUid = state.results[0]?.uid || null;
                state.activeIndex = 0;
                render();
            }
        });

        document.addEventListener('keydown', event => {
            const shortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k';
            if (shortcut) {
                event.preventDefault();
                state.open ? close() : open();
                return;
            }
            if (!state.open) return;
            if (event.key === 'Escape') { event.preventDefault(); close(); }
            if (event.key === 'ArrowDown') { event.preventDefault(); moveSelection(1); }
            if (event.key === 'ArrowUp') { event.preventDefault(); moveSelection(-1); }
            if (event.key === 'Enter' && document.activeElement === input && selectedItem()) {
                event.preventDefault();
                navigate(selectedItem());
            }
        });

        render();
    }

    window.AtharLens = { open, close, rebuild: buildIndex, search: runSearch };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
    else mount();
})();
