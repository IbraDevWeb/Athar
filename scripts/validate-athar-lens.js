#!/usr/bin/env node

const fs = require('fs');
const vm = require('vm');

const read = path => fs.readFileSync(path, 'utf8');
const fail = message => {
    console.error(`Athar Lens validation failed: ${message}`);
    process.exit(1);
};
const need = (source, token, label) => {
    if (!source.includes(token)) fail(`${label} is missing: ${token}`);
};

const lens = read('js/components/AtharLens.js');
[
    'Athar Lens', 'Ctrl K', 'buildIndex', 'runSearch', 'buildJourney', 'relatedItems',
    'prepareDeepLink', 'athar:navigate', 'athar_lens_v1', 'athar_lens_target',
    "view: 'library'", "view: 'hadiths'", "view: 'roots'", "view: 'isnad'",
    "view: 'history_nights'", "view: 'scriptorium'", "view: 'astronomy'",
    "view: 'transmission'", "view: 'glossary'", 'event.ctrlKey || event.metaKey',
    'event.key === \'ArrowDown\'', 'event.key === \'ArrowUp\'',
    'escapeHtml', 'localStorage.setItem', 'sessionStorage.setItem',
    'data-action="open-selected"', 'data-action="journey"', 'data-action="select-related"'
].forEach(token => need(lens, token, 'AtharLens.js'));

if (/\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource|<iframe|<canvas|THREE\.|getContext\s*\(/i.test(lens)) {
    fail('Athar Lens must remain a local, lightweight index without remote runtimes.');
}
if (!lens.includes('escapeHtml(item.title)') || !lens.includes('escapeHtml(item.excerpt')) {
    fail('Dynamic result content must be escaped before HTML rendering.');
}

const storage = new Map();
const makeStorage = () => ({
    getItem: key => storage.get(key) || null,
    setItem: (key, value) => storage.set(key, String(value)),
    removeItem: key => storage.delete(key)
});

const context = {
    console,
    CHAPTERS_DATA: [{
        id: 1,
        name: 'Figure de la miséricorde',
        arabicName: 'الرحمة',
        subtitle: 'Biographie',
        intro: 'Une vie marquée par la miséricorde et la patience.',
        tags: ['Miséricorde'],
        narratives: [],
        timeline: []
    }],
    STORED_HADITHS: [{
        id: 'h1',
        title: 'La miséricorde envers les créatures',
        hadeeth: 'Les miséricordieux reçoivent la miséricorde.',
        hadeeth_ar: 'الراحمون يرحمهم الرحمن',
        grade: 'Authentique',
        attribution: 'Hadith',
        explanation: 'Un enseignement sur la miséricorde.',
        hints: []
    }],
    SILSILA_DATA: { nodes: [{
        id: 9,
        label: 'Un transmetteur médinois',
        arabicName: 'راو مدني',
        role: 'Transmetteur',
        city: 'Médine',
        bio: 'Il transmet un savoir sur la miséricorde.',
        group: 'hadith',
        keywords: ['miséricorde'],
        contributions: []
    }] },
    GLOSSARY_DATA: { miséricorde: { origin: 'Lexique', def: 'Bienveillance et compassion.' } },
    EXTENSIONS_DATA: { roots: { title: 'L’Arbre des Racines', desc: 'Explorer les racines.', type: 'interactive' } },
    localStorage: makeStorage(),
    sessionStorage: makeStorage(),
    CustomEvent: function CustomEvent(type, options) { this.type = type; this.detail = options?.detail; },
    CSS: { escape: value => String(value).replace(/[^a-zA-Z0-9_-]/g, '_') },
    document: { readyState: 'loading', addEventListener() {} },
    window: {
        ROOT_TREE_DATA: {
            roots: [{
                id: 'rahma', root: 'ر ح م', title: 'Miséricorde', transliteration: 'r-ḥ-m', category: 'revelation',
                core: 'La douceur et la miséricorde.', nuance: 'Une famille sémantique riche.', memory: 'Pense à la protection.',
                derivatives: [{ word: 'رحمة', transliteration: 'raḥma', label: 'miséricorde', note: 'Nom central.' }],
                verses: [{ reference: '1:1', arabic: 'الرحمن الرحيم', translation: 'Le Tout Miséricordieux.' }]
            }]
        },
        GOLDEN_CHAIN_DATA: {
            chains: [{ id: 'chain', title: 'Chaîne de la miséricorde', arabic: 'سلسلة الرحمة', region: 'Médine', badge: 'Isnād',
                summary: 'Une route de transmission.', collection: 'Collection', reference: '1', sample: { theme: 'Miséricorde', arabic: 'الرحمة', french: 'Miséricorde' }, scholarlyNote: 'Note', linkLabels: [] }]
        },
        HISTORY_NIGHTS_DATA: { stories: [{ id: 'story', title: 'Une nuit de miséricorde', arabic: 'ليلة الرحمة', period: 'Ier siècle', location: 'Médine', theme: 'Miséricorde', duration: '5 min', summary: 'Un récit.', chapters: [] }] },
        SCRIPTORIUM_DATA: { folios: [{ id: 'folio', title: 'Folio de la compassion', arabic: 'مخطوط', period: 'Ancien', region: 'Médine', summary: 'Un folio.', script: 'naskh', support: 'papier', format: 'folio', observations: [], insight: 'Transmission écrite', source: {} }] },
        ANCIENT_SKY_DATA: { objects: [{ id: 'star', name: 'Étoile de Médine', arabic: 'نجم', transliteration: 'najm', type: 'Étoile', summary: 'Un repère.', category: 'navigation', story: 'Mémoire', memory: 'Repère' }] },
        addEventListener() {},
        dispatchEvent() {}
    }
};
vm.createContext(context);
vm.runInContext(lens, context, { filename: 'AtharLens.js' });
if (!context.window.AtharLens) fail('Athar Lens API was not exposed.');
context.window.AtharLens.rebuild();
const mercyResults = context.window.AtharLens.search('miséricorde');
if (mercyResults.length < 5) fail(`The cross-module index returned only ${mercyResults.length} results for a shared concept.`);
const mercyTypes = new Set(mercyResults.map(item => item.type));
for (const type of ['biography', 'hadith', 'root', 'scholar', 'glossary']) {
    if (!mercyTypes.has(type)) fail(`The search index did not expose the ${type} universe.`);
}
const arabicResults = context.window.AtharLens.search('رحم');
if (!arabicResults.some(item => item.type === 'root')) fail('Arabic root search did not find the root universe.');

const bridge = read('js/components/AtharLensBridge.js');
[
    'athar.lens.navigation.patched', 'athar:navigate', 'detail.chapterId', 'detail.hadithId',
    'exposed.openChapter', 'exposed.openHadith', 'exposed.setView',
    'window.Vue.onMounted', 'window.Vue.onUnmounted', 'headerSearchQuery.value'
].forEach(token => need(bridge, token, 'AtharLensBridge.js'));

const css = read('css/athar-lens.css');
[
    '.alens-root', '.alens-launcher', '.alens-backdrop', '.alens-panel', '.alens-searchbar',
    '.alens-layout', '.alens-results', '.alens-detail-pane', '.alens-result', '.alens-open',
    '.alens-results-list.is-journey', 'html.athar-lens-open',
    '.alens-root.is-open .alens-panel', 'pointer-events: none', 'pointer-events: auto',
    '@media (max-width: 700px)', '@media (max-width: 430px)',
    'env(safe-area-inset-bottom)', 'prefers-reduced-motion', 'touch-action: manipulation'
].forEach(token => need(css, token, 'Athar Lens CSS'));
if ((css.match(/{/g) || []).length !== (css.match(/}/g) || []).length) fail('Athar Lens CSS braces are unbalanced.');

const config = read('js/config.js');
[
    "const APP_VERSION = 'athar-pro-v33'",
    "writeEarlyScript('js/components/AtharLensBridge.js'",
    "writeEarlyScript('js/components/AtharLens.js'",
    'css/athar-lens.css?v=${APP_VERSION}',
    "writeEarlyScript('js/components/AstronomyBootstrap.js'"
].forEach(token => need(config, token, 'config.js'));
if (config.indexOf('AtharLensBridge.js') > config.indexOf('AstronomyBootstrap.js')) {
    fail('Athar Lens navigation bridge must load before the ToolView bootstrap.');
}

const worker = read('service-worker.js');
[
    "const CACHE_VERSION = 'athar-pro-v33'",
    './js/components/AtharLensBridge.js?v=athar-pro-v33',
    './js/components/AtharLens.js?v=athar-pro-v33',
    './css/athar-lens.css?v=athar-pro-v33'
].forEach(token => need(worker, token, 'service worker'));

console.log(`Athar Lens validated: ${mercyResults.length} cross-module results, Arabic search, navigation bridge, responsive overlay and cache v33.`);
