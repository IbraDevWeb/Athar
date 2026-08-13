#!/usr/bin/env node

const fs = require('fs');
const vm = require('vm');

const read = path => fs.readFileSync(path, 'utf8');
const fail = message => {
    console.error(`RAG Library validation failed: ${message}`);
    process.exit(1);
};
const need = (source, token, label) => {
    if (!source.includes(token)) fail(`${label} is missing: ${token}`);
};

const seed = JSON.parse(read('rag/seed.json'));
if (!seed.meta?.notice || !seed.meta?.source_policy) fail('Seed methodology is incomplete.');
if (!Array.isArray(seed.books) || seed.books.length !== 5) fail('Exactly five launch books are required in the embedded demo seed.');
if (!Array.isArray(seed.chunks) || seed.chunks.length < 10) fail('The demonstration corpus is too small.');
const bookIds = new Set(seed.books.map(book => book.id));
for (const book of seed.books) {
    for (const field of ['id', 'kutub_id', 'title', 'title_ar', 'author', 'discipline', 'madhhab', 'description', 'source_url']) {
        if (!String(book[field] ?? '').trim()) fail(`${book.id || 'book'} is missing ${field}.`);
    }
    if (!/^https:\/\/kutub\.io\/fr\/book\/\d+$/.test(book.source_url)) fail(`${book.id} has an invalid source URL.`);
}
for (const chunk of seed.chunks) {
    for (const field of ['id', 'book_id', 'chapter', 'translation_status', 'source_url']) {
        if (!String(chunk[field] ?? '').trim()) fail(`${chunk.id || 'chunk'} is missing ${field}.`);
    }
    if (!bookIds.has(chunk.book_id)) fail(`${chunk.id} points to an unknown book.`);
    if (!String(chunk.text_fr || chunk.text_ar || '').trim()) fail(`${chunk.id} has no searchable text.`);
    if (!/^https:\/\/kutub\.io\/fr\/book\/\d+(?:\/\d+)?$/.test(chunk.source_url)) fail(`${chunk.id} has an invalid citation URL.`);
}

const component = read('js/components/ScholarLibraryView.js');
[
    'sl9-query-card', 'sl9-answer-layout', 'sl9-results-panel', 'sl9-inspector',
    'sl9-book-grid', 'sl9-method-flow', 'athar-scholar-library-active',
    '/api/rag/status', '/api/rag/ask', 'rag/seed.json?v=athar-pro-v34',
    'localSearch', 'localAnswer', 'expandTerms', 'translation_status',
    '@click="ask"', '@click="selectResult(item)"', '@click="copyCitation(selectedResult)"',
    'target="_blank"', 'onBeforeUnmount'
].forEach(token => need(component, token, 'ScholarLibraryView'));
if (/v-html|innerHTML|<iframe|new\s+Audio|WebGL|THREE\./i.test(component)) fail('Unsafe or heavy frontend runtime detected.');

const css = read('css/scholar-library.css');
[
    '.sl9-shell', '.sl9-query-card', '.sl9-answer-layout', '.sl9-result', '.sl9-inspector',
    '.sl9-book-grid', '.sl9-method-flow', 'html.athar-scholar-library-active .athar-mobile-dock',
    'html.athar-app-fullscreen .sl9-shell', '@media (max-width: 680px)', '@media (max-width: 430px)',
    'prefers-reduced-motion', 'touch-action: manipulation', 'env(safe-area-inset-bottom)'
].forEach(token => need(css, token, 'Scholar Library CSS'));
if ((css.match(/{/g) || []).length !== (css.match(/}/g) || []).length) fail('Unbalanced Scholar Library CSS braces.');

const core = read('rag/core.py');
[
    'CREATE VIRTUAL TABLE IF NOT EXISTS chunks_fts', 'normalize_arabic', 'expand_query',
    'search_chunks', 'extractive_answer', 'ollama_answer', 'answer_question',
    'ATHAR_OLLAMA_MODEL', 'source_url', 'translation_status'
].forEach(token => need(core, token, 'RAG core'));

const scraper = read('rag/scrape_kutub.py');
[
    'urllib.robotparser', 'parser.can_fetch', 'DEFAULT_DELAY = 1.25', 'Retry-After',
    'response.status_code in {401, 403}', 'Protection anti-bot détectée',
    'ATHAR_BOT_CONTACT', '--max-pages', '--no-skip-existing', 'source_url', 'content_hash'
].forEach(token => need(scraper, token, 'Kutub scraper'));
if (/selenium|playwright/i.test(scraper)) fail('Browser automation must not be introduced into the respectful Kutub crawler.');

const compatibility = read('rag/sync_kutub_batch.py');
['from ingest_kutub import main', "sys.argv.insert(1, 'sync')"].forEach(token => need(compatibility, token, 'Batch compatibility wrapper'));
const pipeline = read('rag/ingest_kutub.py');
[
    '--batch-size', 'default=25', 'next_page(', 'retry_errors', 'ingest_book',
    'is_page_duplicate', 'chunk_exists_by_hash', 'ATHAR_BOT_CONTACT', 'finish_run('
].forEach(token => need(pipeline, token, 'Durable batch synchronizer'));

const server = read('rag/server.py');
['/api/rag/status', '/api/rag/search', '/api/rag/ask', 'ThreadingHTTPServer', 'directory=str(ROOT)', 'no-store'].forEach(token => need(server, token, 'RAG server'));

const manifest = JSON.parse(read('rag/books.json'));
if (!['2.0', '3.0'].includes(String(manifest.version)) || Number(manifest.target_books) < 25) {
    fail('The bibliographic manifest must expose the growth target.');
}
if (!Array.isArray(manifest.books)) fail('The bibliographic manifest has no books list.');
const enabledBooks = manifest.books.filter(book => book.enabled === true);
if (enabledBooks.length < 16) fail(`At least 16 Kutub books must be enabled, got ${enabledBooks.length}.`);
if (enabledBooks.length > Number(manifest.target_books)) fail('The enabled catalogue exceeds its declared target.');
const kutubIds = enabledBooks.map(book => Number(book.kutub_id));
if (kutubIds.some(id => !Number.isInteger(id) || id <= 0) || new Set(kutubIds).size !== kutubIds.length) {
    fail('Enabled Kutub ids must be positive and unique.');
}
for (const book of enabledBooks) {
    if (book.source_url !== `https://kutub.io/fr/book/${book.kutub_id}`) fail(`${book.title} has a non-canonical Kutub URL.`);
    if (!book.metadata?.source_type || !book.metadata?.verification_status) fail(`${book.title} has incomplete metadata.`);
}

const growthWorkflow = read('.github/workflows/grow-kutub-corpus.yml');
[
    'workflow_dispatch:', 'schedule:', 'contents: write',
    'python rag/ingest_kutub.py sync', '--delay 1.75',
    'python rag/export_kutub_corpus.py', 'git push origin HEAD:main',
    'if (( BATCH > 5 )); then BATCH=5; fi'
].forEach(token => need(growthWorkflow, token, 'Kutub growth workflow'));

const bridge = read('js/components/AstronomyBootstrap.js');
[
    "'scholar-library-view': window.ScholarLibraryView",
    "currentTool === 'rag_library'",
    "currentTool === 'isnad'",
    'PATCH_FLAG'
].forEach(token => need(bridge, token, 'Tool extensions bootstrap'));

const toolView = read('js/components/ToolView.js');
const anchor = `<scholar-atlas-module v-if="currentTool === 'scholars_map'" :settings="settings"></scholar-atlas-module>\n    <div v-else`;
need(toolView, anchor, 'ToolView integration anchor');
const sandbox = {
    console,
    window: {
        AncientSkyView: {}, HistoryNightsView: {}, ScriptoriumView: {}, RootTreeView: {},
        GoldenChainView: {}, ScholarLibraryView: {}, Vue: { createApp: root => root }
    }
};
vm.createContext(sandbox);
vm.runInContext(bridge, sandbox, { filename: 'AstronomyBootstrap.js' });
const fake = { components: {}, template: anchor };
sandbox.window.Vue.createApp({ components: { 'tool-view': fake } });
if (!fake.components['scholar-library-view']) fail('ScholarLibraryView was not registered in ToolView.');
if (!fake.template.includes(`currentTool === 'rag_library'`)) fail('The RAG route was not inserted in ToolView.');

const config = read('js/config.js');
[
    "const APP_VERSION = 'athar-pro-v34'",
    "writeEarlyScript('js/components/ScholarLibraryView.js'",
    'css/scholar-library.css?v=${APP_VERSION}'
].forEach(token => need(config, token, 'config.js'));

const worker = read('service-worker.js');
[
    "const CACHE_VERSION = 'athar-pro-v34'",
    './js/components/ScholarLibraryView.js?v=athar-pro-v34',
    './rag/seed.json?v=athar-pro-v34',
    './css/scholar-library.css?v=athar-pro-v34'
].forEach(token => need(worker, token, 'service worker'));

const extensions = read('extensions_data.js');
need(extensions, 'Moteur RAG classique', 'V1 metadata distinction');
const windowsLauncher = read('start-athar-rag.bat');
need(windowsLauncher, 'rag\\launcher.py', 'Windows launcher');
need(windowsLauncher, 'py -3', 'Windows Python launcher');
const pythonLauncher = read('rag/launcher.py');
need(pythonLauncher, 'SERVER_SCRIPT = ROOT / "rag" / "server.py"', 'Python launcher server target');
need(pythonLauncher, '/api/rag/v2/status', 'Python launcher health check');
need(read('sync-kutub.bat'), 'python rag\\ingest_kutub.py sync --batch-size 25', 'Windows sync launcher');

console.log(`RAG Library validated: ${seed.books.length} demo books, ${seed.chunks.length} demo chunks and ${enabledBooks.length} enabled Kutub growth books.`);
