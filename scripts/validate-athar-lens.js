#!/usr/bin/env node

const fs = require('fs');
const vm = require('vm');
const read = path => fs.readFileSync(path, 'utf8');
const fail = message => { console.error(`Athar Lens validation failed: ${message}`); process.exit(1); };
const need = (source, token, label) => { if (!source.includes(token)) fail(`${label} is missing: ${token}`); };

const lens = read('js/components/AtharLens.js');
[
    'Athar Lens', 'Ctrl K', 'buildIndex', 'runSearch', 'buildJourney', 'relatedItems',
    'prepareDeepLink', 'athar:navigate', 'athar_lens_v1', 'athar_lens_target',
    "view: 'library'", "view: 'hadiths'", "view: 'roots'", "view: 'isnad'",
    "view: 'history_nights'", "view: 'scriptorium'", "view: 'astronomy'",
    "view: 'transmission'", "view: 'glossary'", 'escapeHtml', 'localStorage.setItem',
    'data-action="open-selected"', 'data-action="journey"', 'data-action="select-related"'
].forEach(token => need(lens, token, 'AtharLens.js'));
if (/\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource|<iframe|<canvas|THREE\.|getContext\s*\(/i.test(lens)) {
    fail('Athar Lens must remain a local lightweight index.');
}
if (!lens.includes('escapeHtml(item.title)') || !lens.includes('escapeHtml(item.excerpt')) {
    fail('Dynamic Lens content must be escaped.');
}

const storage = new Map();
const makeStorage = () => ({ getItem: key => storage.get(key) || null, setItem: (key, value) => storage.set(key, String(value)), removeItem: key => storage.delete(key) });
const context = {
    console,
    CHAPTERS_DATA: [{ id: 1, name: 'Figure de la miséricorde', arabicName: 'الرحمة', subtitle: 'Biographie', intro: 'Miséricorde et patience.', tags: ['Miséricorde'], narratives: [], timeline: [] }],
    STORED_HADITHS: [{ id: 'h1', title: 'La miséricorde', hadeeth: 'Les miséricordieux.', hadeeth_ar: 'الراحمون', grade: 'Authentique', attribution: 'Hadith', explanation: 'Miséricorde.', hints: [] }],
    SILSILA_DATA: { nodes: [{ id: 9, label: 'Transmetteur médinois', arabicName: 'راو', role: 'Transmetteur', city: 'Médine', bio: 'Miséricorde.', group: 'hadith', keywords: ['miséricorde'], contributions: [] }] },
    GLOSSARY_DATA: { miséricorde: { origin: 'Lexique', def: 'Bienveillance.' } },
    EXTENSIONS_DATA: {
        roots: { title: 'L’Arbre des Racines', desc: 'Explorer les racines.', type: 'interactive' },
        rag_library: { title: 'Bibliothèque Savante', desc: 'Recherche RAG bilingue.', type: 'interactive' }
    },
    localStorage: makeStorage(), sessionStorage: makeStorage(),
    CustomEvent: function CustomEvent(type, options) { this.type = type; this.detail = options?.detail; },
    CSS: { escape: value => String(value).replace(/[^a-zA-Z0-9_-]/g, '_') },
    document: { readyState: 'loading', addEventListener() {} },
    window: {
        ROOT_TREE_DATA: { roots: [{ id: 'rahma', root: 'ر ح م', title: 'Miséricorde', transliteration: 'r-ḥ-m', category: 'revelation', core: 'Douceur.', nuance: 'Famille.', memory: 'Protection.', derivatives: [{ word: 'رحمة', transliteration: 'raḥma', label: 'miséricorde', note: 'Nom.' }], verses: [{ reference: '1:1', arabic: 'الرحمن الرحيم', translation: 'Le Miséricordieux.' }] }] },
        GOLDEN_CHAIN_DATA: { chains: [{ id: 'chain', title: 'Chaîne de la miséricorde', arabic: 'سلسلة', region: 'Médine', badge: 'Isnād', summary: 'Route.', collection: 'Collection', reference: '1', sample: { theme: 'Miséricorde', arabic: 'الرحمة', french: 'Miséricorde' }, scholarlyNote: 'Note', linkLabels: [] }] },
        HISTORY_NIGHTS_DATA: { stories: [{ id: 'story', title: 'Une nuit', arabic: 'ليلة', period: 'Ier siècle', location: 'Médine', theme: 'Miséricorde', duration: '5 min', summary: 'Récit.', chapters: [] }] },
        SCRIPTORIUM_DATA: { folios: [{ id: 'folio', title: 'Folio', arabic: 'مخطوط', period: 'Ancien', region: 'Médine', summary: 'Folio.', script: 'naskh', support: 'papier', format: 'folio', observations: [], insight: 'Transmission', source: {} }] },
        ANCIENT_SKY_DATA: { objects: [{ id: 'star', name: 'Étoile', arabic: 'نجم', transliteration: 'najm', type: 'Étoile', summary: 'Repère.', category: 'navigation', story: 'Mémoire', memory: 'Repère' }] },
        addEventListener() {}, dispatchEvent() {}
    }
};
vm.createContext(context);
vm.runInContext(lens, context, { filename: 'AtharLens.js' });
if (!context.window.AtharLens) fail('Athar Lens API was not exposed.');
context.window.AtharLens.rebuild();
const results = context.window.AtharLens.search('miséricorde');
if (results.length < 5) fail(`Cross-module search returned only ${results.length} results.`);
if (!context.window.AtharLens.search('رحم').some(item => item.type === 'root')) fail('Arabic root search failed.');
if (!context.window.AtharLens.search('bibliothèque').some(item => item.uid === 'tool:rag_library')) fail('The RAG library is missing from Lens tools.');

const bridge = read('js/components/AtharLensBridge.js');
['athar.lens.navigation.patched', 'athar:navigate', 'exposed.openChapter', 'exposed.openHadith', 'exposed.setView', 'window.Vue.onMounted', 'window.Vue.onUnmounted'].forEach(token => need(bridge, token, 'AtharLensBridge.js'));
const css = read('css/athar-lens.css');
['.alens-root', '.alens-launcher', '.alens-panel', '.alens-layout', 'html.athar-lens-open', 'pointer-events: none', 'pointer-events: auto', '@media (max-width: 700px)', 'env(safe-area-inset-bottom)', 'touch-action: manipulation'].forEach(token => need(css, token, 'Athar Lens CSS'));
if ((css.match(/{/g) || []).length !== (css.match(/}/g) || []).length) fail('Athar Lens CSS braces are unbalanced.');

const config = read('js/config.js');
["const APP_VERSION = 'athar-pro-v34'", "writeEarlyScript('js/components/AtharLensBridge.js'", "writeEarlyScript('js/components/AtharLens.js'", 'css/athar-lens.css?v=${APP_VERSION}', "writeEarlyScript('js/components/AstronomyBootstrap.js'"].forEach(token => need(config, token, 'config.js'));
if (config.indexOf('AtharLensBridge.js') > config.indexOf('AstronomyBootstrap.js')) fail('Lens bridge must load before ToolView bootstrap.');
const worker = read('service-worker.js');
["const CACHE_VERSION = 'athar-pro-v34'", './js/components/AtharLensBridge.js?v=athar-pro-v34', './js/components/AtharLens.js?v=athar-pro-v34', './css/athar-lens.css?v=athar-pro-v34'].forEach(token => need(worker, token, 'service worker'));
console.log(`Athar Lens validated: ${results.length} results, RAG tool indexing, Arabic search and cache v34.`);
