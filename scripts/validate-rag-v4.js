#!/usr/bin/env node

const fs = require('fs');
const read = path => fs.readFileSync(path, 'utf8');
const fail = message => { console.error(`Athar Research validation failed: ${message}`); process.exit(1); };
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

const scholarSynthesis = read('rag/v5_scholar_synthesis.py');
[
    'Grounded LLM synthesis for Athar Research', 'MAX_SYNTHESIS_SOURCES = 10', 'MAX_CONTEXT_CHARS = 36_000',
    'Use ONLY the supplied passages', 'Do not use general knowledge', 'Every position MUST cite one or more supplied source IDs',
    'do not issue a new fatwa', 'ScholarSynthesisError', 'select_synthesis_sources', 'synthesize_from_sources',
    'responseMimeType', 'responseSchema', 'GEMINI_API_KEY', 'source_ids', 'position_status'
].forEach(token => need(scholarSynthesis, token, 'rag/v5_scholar_synthesis.py'));
reject(scholarSynthesis, /MyMemory|translated\.net|mymemory|web\.run|requests\.get/i, 'rag/v5_scholar_synthesis.py');

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
    '/api/rag/v5/synthesize', 'class Handler(BaseHandler)', 'library_gate', 'translation_gate', 'synthesis_gate',
    'library_books_payload', 'open_connection(self.db_path)', 'AtharRAG/5.7-library-grounded-synthesis',
    'configure_server_corpus', 'book_connection(book_id)', '_retrieve_for_synthesis', 'select_synthesis_sources',
    'synthesize_from_sources(query, synthesis_sources)', 'The client cannot inject sources', 'llm_grounded_synthesis'
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
    'const validateEngine = payload =>', 'engineVersion < 5', 'REQUEST_TIMEOUT_MS = 120000',
    'Athar Research', 'Questions naturelles', 'Les ouvrages indexés', 'Historique local',
    'Pertinence documentaire ≠ certitude religieuse', 'routed_book', 'matched_concepts',
    'Traduction IA à la demande', 'Fidèle', 'Littérale', 'Étude', 'Traduction assistée par IA', 'Non vérifiée',
    'source_id: source.id', 'book_id: source.book_id', 'selectedTranslation'
].forEach(token => need(view, token, 'ScholarLibraryV4View.js / Athar Research'));
reject(view, /\/api\/rag\/v2\/|localFallback|embedded_fallback|rag\/seed\.json|Moteur V4 connecté|MyMemory/i, 'Athar Research frontend');

const synthesisBridge = read('js/components/ScholarSynthesisBridge.js');
[
    '/api/rag/v5/synthesize', "answerMode.value === 'synthesis'", 'runSynthesis', 'runQuestion',
    'Synthèse IA', 'Passages uniquement', 'Positions retrouvées', 'Convergences', 'Divergences',
    'selectSynthesisSource', 'synthesis_source_ids', 'Recherche des passages dans le corpus',
    'The endpoint performs retrieval first, then synthesizes only its own RAG results.'
].forEach(token => need(synthesisBridge, token, 'ScholarSynthesisBridge.js'));
reject(synthesisBridge, /sources\s*:\s*(base\.|payload|\[)|text_ar\s*:/i, 'ScholarSynthesisBridge.js');

const bootstrap = read('js/components/ScholarV4Bootstrap.js');
[
    "setView('rag_v5')", "viewMode === 'rag_v5'", "'scholar-library-v4-view': window.ScholarLibraryV4View",
    'data-athar-research-v5-nav', 'data-athar-library-reader-nav', 'research-library.html',
    'patchDomTemplate', 'patchHomeView', 'Athar Research · Bibliothèque Savante',
    'athar-research-translation-styles', 'css/athar-research-translation.css?v=athar-translation-ui-1',
    'athar-new-tools-fullscreen-styles', 'css/new-tools-fullscreen.css?v=athar-pro-v37',
    'athar-new-tools-fullscreen-script', 'js/new-tools-fullscreen.js?v=athar-pro-v37'
].forEach(token => need(bootstrap, token, 'ScholarV4Bootstrap.js'));
reject(bootstrap, /Bibliothèque Savante · V4|data-athar-scholar-v4-nav/i, 'ScholarV4Bootstrap.js');

const libraryPage = read('research-library.html');
[
    'Bibliothèque Athar', 'Lecture savante', 'reader-appbar', 'reader-bookrail', 'reader-navrail',
    'Sommaire indexé', 'Rechercher dans ce livre', 'data-reader-mode="arabic"', 'data-reader-mode="bilingual"',
    'css/research-library-v2.css?v=athar-reader-v3', 'js/research-library-v2.js?v=athar-reader-v3',
    'css/research-library-ai-tools.css?v=athar-reader-ai-2', 'js/research-library-ai-tools.js?v=athar-reader-ai-2',
    'css/new-tools-fullscreen.css?v=athar-pro-v37', 'js/new-tools-fullscreen.js?v=athar-pro-v37',
    'Les traductions IA demandées dans le lecteur restent séparées et non vérifiées.'
].forEach(token => need(libraryPage, token, 'research-library.html'));
reject(libraryPage, /MyMemory|translate_arabic/i, 'research-library.html');

const libraryScript = read('js/research-library-v2.js');
[
    '/api/rag/v5/library-books', '/api/rag/v5/book', '/api/rag/v5/read', '/api/rag/v5/toc', '/api/rag/v5/book-search',
    'setReaderMode', 'loadPage', 'loadContinuous', 'searchInsideBook', 'copyCurrentReference',
    'kutub_ai_unreviewed', 'IA non vérifiée', 'athar-reader-font-step'
].forEach(token => need(libraryScript, token, 'js/research-library-v2.js'));
reject(libraryScript, /MyMemory|\/api\/rag\/v5\/translate|translate_arabic/i, 'js/research-library-v2.js');

const readerAi = read('js/research-library-ai-tools.js');
[
    '/api/rag/v5/translate', '/api/rag/v5/read', 'source_id: sourceId', 'book_id: bookId',
    "{ value: 'faithful', label: 'Fidèle' }", "{ value: 'literal', label: 'Littérale' }", "{ value: 'study', label: 'Étude' }",
    'CONCURRENCY = 2', 'readAllPagePassages', 'translateIndexedPassage', 'translatePage', 'translatePassage',
    'Traduire ce passage', 'Traduire la page', 'Traduction assistée par IA', 'Non vérifiée',
    'localStorage.getItem(\'athar-reader-ai-mode\')'
].forEach(token => need(readerAi, token, 'js/research-library-ai-tools.js'));
reject(readerAi, /MyMemory|translated\.net|mymemory|text_ar\s*:/i, 'js/research-library-ai-tools.js');

const libraryStyle = read('css/research-library-v2.css');
[
    '.reader-layout', '.reader-bookrail', '.reader-navrail', '.reader-paper', '.reader-arabic', '.reader-french',
    '.reader-tabs', '.toc-item', '.book-search-hit', 'body.reader-focus', '@media (max-width: 700px)'
].forEach(token => need(libraryStyle, token, 'css/research-library-v2.css'));

const readerAiStyle = read('css/research-library-ai-tools.css');
[
    '.reader-ai-toolbar', '.reader-ai-page-button', '.reader-ai-passage-button', '.reader-ai-translation',
    '.reader-ai-terms', '.reader-ai-uncertainties', '.reader-center[data-mode="french"]', '@media (max-width: 760px)'
].forEach(token => need(readerAiStyle, token, 'css/research-library-ai-tools.css'));

const newToolsFullscreen = read('js/new-tools-fullscreen.js');
[
    'requestFullscreen', 'exitFullscreen', 'fullscreenchange', 'AtharFullscreen.toggle',
    '.ar5-top-actions', '.library-topbar-actions', '.reader-appbar-right',
    'data-athar-newtool-fullscreen', 'Grand écran', 'Ctrl', 'window.AtharNewToolsFullscreen'
].forEach(token => need(newToolsFullscreen, token, 'js/new-tools-fullscreen.js'));

const newToolsFullscreenStyle = read('css/new-tools-fullscreen.css');
[
    '.athar-newtool-fullscreen', '.ar5-top-actions .athar-newtool-fullscreen',
    '.library-topbar-actions .athar-newtool-fullscreen', 'athar-newtool-local-fullscreen'
].forEach(token => need(newToolsFullscreenStyle, token, 'css/new-tools-fullscreen.css'));

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

const synthesisStyle = read('css/athar-research-synthesis.css');
[
    '.ar5-answer-modes', '.ar5-synthesis', '.ar5-position-card', '.ar5-position-citations',
    '.ar5-synthesis-compare', '.ar5-synthesis-limits', '.ar5-synthesis-fallback', '@media (max-width: 760px)'
].forEach(token => need(synthesisStyle, token, 'css/athar-research-synthesis.css'));

const render = read('render.yaml');
[
    'python rag/v653_library_server.py --host 0.0.0.0 --api-only',
    'python rag/cache_hosted_corpus.py --manifest rag/corpus_release_v3.json --output-dir rag/data/shards',
    'ATHAR_CORPUS_MODE', 'value: sharded', 'ATHAR_SHARD_DIR', 'rag/data/shards',
    'ATHAR_CORPUS_MANIFEST', 'rag/corpus_release_v3.json', 'healthCheckPath: /healthz'
].forEach(token => need(render, token, 'render.yaml'));
reject(render, /ATHAR_DB_PATH|athar_hosted\.sqlite\.gz/, 'render.yaml');

const config = read('js/config.js');
[
    "const APP_VERSION = 'athar-pro-v36'",
    "const RESEARCH_UI_VERSION = 'athar-research-v6-ui-1'",
    "writeEarlyScript('js/components/ScholarLibraryV4View.js'",
    "writeEarlyScript('js/components/ScholarSynthesisBridge.js'",
    "writeEarlyScript('js/components/ScholarV4Bootstrap.js'",
    "css/athar-research-v5.css?v=${RESEARCH_UI_VERSION}",
    'css/athar-research-synthesis.css?v=athar-research-synthesis-1'
].forEach(token => need(config, token, 'js/config.js'));
reject(config, /ScholarLibraryV2View\.js|ScholarV2Bootstrap\.js|RagApiBridge\.js|scholar-library-v2\.css|scholar-v2-integration\.css/i, 'js/config.js');

const worker = read('service-worker.js');
need(worker, "const CACHE_VERSION = 'athar-pro-v36'", 'service-worker.js');
need(worker, './css/athar-research-v5.css?v=athar-research-v6-ui-1', 'service-worker.js');
need(worker, './css/athar-research-synthesis.css?v=athar-research-synthesis-1', 'service-worker.js');
need(worker, './js/components/ScholarLibraryV4View.js?v=athar-research-v6-ui-1', 'service-worker.js');
need(worker, './js/components/ScholarSynthesisBridge.js?v=athar-research-v6-ui-1', 'service-worker.js');
need(worker, './research-library.html', 'service-worker.js');
need(worker, './css/research-library-v2.css?v=athar-reader-v3', 'service-worker.js');
need(worker, './js/research-library-v2.js?v=athar-reader-v3', 'service-worker.js');
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

console.log('Athar Research static contract valid — V6-compatible frontend, grounded AI synthesis, cited positions, reader translation and sharded deployment.');
