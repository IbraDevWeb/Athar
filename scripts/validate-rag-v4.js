#!/usr/bin/env node

const fs = require('fs');
const read = path => fs.readFileSync(path, 'utf8');
const fail = message => { console.error(`Athar Research V5 validation failed: ${message}`); process.exit(1); };
const need = (source, token, label) => { if (!source.includes(token)) fail(`${label} is missing: ${token}`); };
const reject = (source, pattern, label) => { if (pattern.test(source)) fail(`${label} contains forbidden legacy behavior: ${pattern}`); };

const engine = read('rag/v5_engine.py');
[
    'def detect_book(', 'def detect_concepts(', 'def build_query_plan(', 'def search(', 'def ask(',
    'STOPWORDS', 'CONCEPTS', 'routed_book', 'matched_concepts', 'matched_terms',
    'recitation_aloud', 'Aucun passage suffisamment pertinent', 'pertinence documentaire'
].forEach(token => need(engine, token, 'rag/v5_engine.py'));
reject(engine, /from\s+v2\s+import|from\s+retrieval_v3\s+import|openai|anthropic|gemini/i, 'rag/v5_engine.py');

const lowmem = read('rag/v5_lowmem.py');
[
    'MAX_FULL_CANDIDATES = 72', '_bounded_fetch_fts_candidates', '_engine._fetch_fts_candidates', 'search = _engine.search'
].forEach(token => need(lowmem, token, 'rag/v5_lowmem.py'));

const queryIntelligence = read('rag/v5_query_intelligence.py');
[
    'gemini-3.1-flash-lite', 'GEMINI_API_KEY', 'responseMimeType', 'responseSchema',
    'technical Arabic expressions', 'never state a ruling'
].forEach(token => need(queryIntelligence, token, 'rag/v5_query_intelligence.py'));

const scholarTranslation = read('rag/v5_scholar_translation.py');
[
    'Traduction assistée par IA — non vérifiée', 'faithful', 'literal', 'study',
    'GEMINI_API_KEY', 'responseMimeType', 'responseSchema', 'MAX_SOURCE_CHARS = 8_000',
    'technical words from their scholarly context', 'do not turn القصر in prayer context into a palace',
    'never replaces the indexed Arabic', 'ScholarTranslationError', 'translate_passage'
].forEach(token => need(scholarTranslation, token, 'rag/v5_scholar_translation.py'));
reject(scholarTranslation, /MyMemory|translated\.net|mymemory/i, 'rag/v5_scholar_translation.py');

const server = read('rag/v5_server.py');
[
    'ENGINE_MARKER = "rag-v5-hybrid-multilingual"', 'engine_version', 'runtime_profile',
    '/api/rag/v5/status', '/api/rag/v5/books', '/api/rag/v5/search', '/api/rag/v5/ask', '/api/rag/v5/translate',
    'load_translation_source', 'translation_gate', 'ScholarTranslationError',
    'mode=ro&immutable=1', 'PRAGMA query_only=ON', 'PRAGMA cache_size=-8192', 'PRAGMA mmap_size=0',
    'Access-Control-Allow-Origin', 'ATHAR_CORS_ORIGINS', 'status": "ready"',
    'ATHAR_CORPUS_MODE', 'ShardedCorpusRuntime', 'storage_mode'
].forEach(token => need(server, token, 'rag/v5_server.py'));
reject(server, /localFallback|seed\.json/i, 'rag/v5_server.py');

const sharded = read('rag/v5_sharded.py');
[
    'class ShardedCorpusRuntime', 'book_to_shard', 'def shard_for_book(', 'def book_connection(',
    'def search(', 'shards_queried', 'storage_mode', 'mode=ro&immutable=1', 'PRAGMA query_only=ON'
].forEach(token => need(sharded, token, 'rag/v5_sharded.py'));
reject(sharded, /INSERT\s+INTO|UPDATE\s+books|DELETE\s+FROM/i, 'rag/v5_sharded.py');

const library = read('rag/v5_library.py');
[
    'def list_library_books(', 'def get_book(', 'def get_toc(', 'def search_book(', 'def read_book(',
    'MAX_READ_LIMIT = 12', 'MAX_TOC_ITEMS = 360', 'MAX_SEARCH_LIMIT = 16',
    'indexed_pages', 'indexed_sections', 'french_passages', 'next_offset', 'previous_offset', 'next_page', 'previous_page'
].forEach(token => need(library, token, 'rag/v5_library.py'));
reject(library, /INSERT\s+INTO|UPDATE\s+books|DELETE\s+FROM/i, 'rag/v5_library.py');

const libraryServer = read('rag/v5_library_server.py');
[
    '/api/rag/v5/library-books', '/api/rag/v5/book', '/api/rag/v5/read', '/api/rag/v5/toc', '/api/rag/v5/book-search',
    'class Handler(BaseHandler)', 'library_gate', 'translation_gate', 'library_books_payload', 'open_connection(self.db_path)',
    'AtharRAG/5.6-library-scholar-translation', 'configure_server_corpus', 'book_connection(book_id)'
].forEach(token => need(libraryServer, token, 'rag/v5_library_server.py'));
reject(libraryServer, /INSERT\s+INTO|UPDATE\s+books|DELETE\s+FROM/i, 'rag/v5_library_server.py');

const cache = read('rag/cache_hosted_corpus.py');
[
    'def cache_sharded_release(', 'def _cache_entry(', '--manifest', '--output-dir', 'storage_mode'
].forEach(token => need(cache, token, 'rag/cache_hosted_corpus.py'));

const builder = read('rag/build_sharded_corpus.py');
[
    'def build_sharded_corpus(', 'athar_catalog.sqlite', 'book_stats', 'shard_stats',
    'sync_books(', 'sharded_build.json', 'storage_mode', 'book_to_shard'
].forEach(token => need(builder, token, 'rag/build_sharded_corpus.py'));

const view = read('js/components/ScholarLibraryV4View.js');
[
    "name: 'AtharResearchView'", '/api/rag/v5/status', '/api/rag/v5/books', '/api/rag/v5/ask', '/api/rag/v5/translate',
    "payload?.engine !== 'rag-v5-hybrid-multilingual'", 'REQUEST_TIMEOUT_MS = 120000',
    'Athar Research', 'Questions naturelles', 'Les ouvrages indexés', 'Historique local',
    'Pertinence documentaire ≠ certitude religieuse', 'routed_book', 'matched_concepts',
    'Traduction IA à la demande', 'Fidèle', 'Littérale', 'Étude', 'Traduction assistée par IA', 'Non vérifiée',
    'source_id: source.id', 'book_id: source.book_id', 'selectedTranslation'
].forEach(token => need(view, token, 'ScholarLibraryV4View.js / Athar Research'));
reject(view, /\/api\/rag\/v2\/|localFallback|embedded_fallback|rag\/seed\.json|Moteur V4 connecté|MyMemory/i, 'Athar Research frontend');

const bootstrap = read('js/components/ScholarV4Bootstrap.js');
[
    "setView('rag_v5')", "viewMode === 'rag_v5'", "'scholar-library-v4-view': window.ScholarLibraryV4View",
    'data-athar-research-v5-nav', 'data-athar-library-reader-nav', 'research-library.html',
    'patchDomTemplate', 'patchHomeView', 'Athar Research · Bibliothèque Savante',
    'athar-research-translation-styles', 'css/athar-research-translation.css?v=athar-translation-ui-1'
].forEach(token => need(bootstrap, token, 'ScholarV4Bootstrap.js'));
reject(bootstrap, /Bibliothèque Savante · V4|data-athar-scholar-v4-nav/i, 'ScholarV4Bootstrap.js');

const libraryPage = read('research-library.html');
[
    'Bibliothèque Athar', 'Lecture savante', 'reader-appbar', 'reader-bookrail', 'reader-navrail',
    'Sommaire indexé', 'Rechercher dans ce livre', 'data-reader-mode="arabic"', 'data-reader-mode="bilingual"',
    'css/research-library-v2.css?v=athar-reader-v2', 'js/research-library-v2.js?v=athar-reader-v2'
].forEach(token => need(libraryPage, token, 'research-library.html'));
reject(libraryPage, /MyMemory|translate_arabic|\/api\/rag\/v5\/translate/i, 'research-library.html');

const libraryScript = read('js/research-library-v2.js');
[
    '/api/rag/v5/library-books', '/api/rag/v5/book', '/api/rag/v5/read', '/api/rag/v5/toc', '/api/rag/v5/book-search',
    'setReaderMode', 'loadPage', 'loadContinuous', 'searchInsideBook', 'copyCurrentReference',
    'kutub_ai_unreviewed', 'IA non vérifiée', 'athar-reader-font-step'
].forEach(token => need(libraryScript, token, 'js/research-library-v2.js'));
reject(libraryScript, /MyMemory|\/api\/rag\/v5\/translate|translate_arabic/i, 'js/research-library-v2.js');

const libraryStyle = read('css/research-library-v2.css');
[
    '.reader-layout', '.reader-bookrail', '.reader-navrail', '.reader-paper', '.reader-arabic', '.reader-french',
    '.reader-tabs', '.toc-item', '.book-search-hit', 'body.reader-focus', '@media (max-width: 700px)'
].forEach(token => need(libraryStyle, token, 'css/research-library-v2.css'));

const style = read('css/athar-research-v5.css');
[
    '.ar5-shell', '.ar5-frame', '.ar5-rail', '.ar5-composer', '.ar5-result-layout', '.ar5-evidence',
    '.ar5-books-grid', '.ar5-history-list', '.ar5-method-grid', '.ar5-nav-entry', '.ar5-home-pillar'
].forEach(token => need(style, token, 'css/athar-research-v5.css'));

const translationStyle = read('css/athar-research-translation.css');
[
    '.ar5-translation-tool', '.ar5-translation-modes', '.ar5-translate-button', '.ar5-ai-translation',
    '.ar5-translation-terms', '.ar5-translation-uncertainties', '.ar5-translation-notice', '@media (max-width: 767px)'
].forEach(token => need(translationStyle, token, 'css/athar-research-translation.css'));

const render = read('render.yaml');
[
    'python rag/v5_library_server.py --host 0.0.0.0 --api-only',
    'python rag/cache_hosted_corpus.py --manifest rag/corpus_release_v3.json --output-dir rag/data/shards',
    'ATHAR_CORPUS_MODE', 'value: sharded', 'ATHAR_SHARD_DIR', 'rag/data/shards',
    'ATHAR_CORPUS_MANIFEST', 'rag/corpus_release_v3.json', 'healthCheckPath: /healthz'
].forEach(token => need(render, token, 'render.yaml'));
reject(render, /ATHAR_DB_PATH|athar_hosted\.sqlite\.gz/, 'render.yaml');

const config = read('js/config.js');
[
    "const APP_VERSION = 'athar-pro-v36'",
    "const RESEARCH_UI_VERSION = 'athar-research-v5-ui-1'",
    "writeEarlyScript('js/components/ScholarLibraryV4View.js'",
    "writeEarlyScript('js/components/ScholarV4Bootstrap.js'",
    "css/athar-research-v5.css?v=${RESEARCH_UI_VERSION}"
].forEach(token => need(config, token, 'js/config.js'));
reject(config, /ScholarLibraryV2View\.js|ScholarV2Bootstrap\.js|RagApiBridge\.js|scholar-library-v2\.css|scholar-v2-integration\.css/i, 'js/config.js');

const worker = read('service-worker.js');
need(worker, "const CACHE_VERSION = 'athar-pro-v36'", 'service-worker.js');
need(worker, './css/athar-research-v5.css?v=athar-research-v5-ui-1', 'service-worker.js');
need(worker, './js/components/ScholarLibraryV4View.js?v=athar-research-v5-ui-1', 'service-worker.js');
need(worker, './research-library.html', 'service-worker.js');
need(worker, './css/research-library-v2.css?v=athar-reader-v2', 'service-worker.js');
need(worker, './js/research-library-v2.js?v=athar-reader-v2', 'service-worker.js');
reject(worker, /ScholarLibraryV2View\.js|ScholarV2Bootstrap\.js|RagApiBridge\.js/i, 'service-worker.js');

const remote = read('rag/remote.json');
need(remote, '"api_version": 5', 'rag/remote.json');
need(remote, '"engine": "rag-v5-hybrid-multilingual"', 'rag/remote.json');

const liveWorkflow = read('.github/workflows/rag-v5-live.yml');
[
    'athar-rag-ibradevweb.onrender.com/healthz', "payload.get('engine') == 'rag-v5-hybrid-multilingual'",
    'prier à voix haute', 'PUBLIC RAG V5 NATURAL FRENCH RETRIEVAL: PASS'
].forEach(token => need(liveWorkflow, token, 'RAG V5 live workflow'));

const libraryLiveWorkflow = read('.github/workflows/rag-v5-library-live.yml');
[
    "Path('rag/corpus_release_v3.json')", "release.get('storage_mode') != 'sharded'",
    "health.get('storage_mode') != 'sharded'", "status.get('storage_mode') != 'sharded'",
    "rag.get('storage_mode') != 'sharded'", 'PUBLIC ATHAR SHARDED V3: PASS'
].forEach(token => need(libraryLiveWorkflow, token, 'RAG V5 sharded library live workflow'));

const lowmemWorkflow = read('.github/workflows/rag-v5-lowmem.yml');
[
    'Download published V3 shards', 'ATHAR_CORPUS_MODE=sharded', 'ATHAR_SHARD_DIR=rag/data/v5_lowmem_shards',
    'Verify natural-language query and bounded per-shard candidates', 'candidate_count <= 72 * shard_count',
    'Athar V5 sharded RSS', 'Check process memory'
].forEach(token => need(lowmemWorkflow, token, 'RAG V5 low-memory workflow'));

console.log('Athar Research V5 static contract valid — sharded Render deployment, professional reader, queryable corpus, low-memory runtime and contextual LLM translation aid.');
