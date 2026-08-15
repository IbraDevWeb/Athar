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

const server = read('rag/v5_server.py');
[
    'ENGINE_MARKER = "rag-v5-hybrid-multilingual"', 'engine_version', 'runtime_profile',
    '/api/rag/v5/status', '/api/rag/v5/books', '/api/rag/v5/search', '/api/rag/v5/ask',
    'mode=ro&immutable=1', 'PRAGMA query_only=ON', 'PRAGMA cache_size=-8192', 'PRAGMA mmap_size=0',
    'Access-Control-Allow-Origin', 'ATHAR_CORS_ORIGINS', 'status": "ready"'
].forEach(token => need(server, token, 'rag/v5_server.py'));
reject(server, /localFallback|seed\.json/i, 'rag/v5_server.py');

const library = read('rag/v5_library.py');
[
    'def get_book(', 'def read_book(', 'MAX_READ_LIMIT = 12', 'indexed_pages', 'french_passages',
    'ORDER BY', 'next_offset', 'previous_offset'
].forEach(token => need(library, token, 'rag/v5_library.py'));

const libraryServer = read('rag/v5_library_server.py');
[
    '/api/rag/v5/book', '/api/rag/v5/read', 'class Handler(BaseHandler)', 'library_gate',
    'open_connection(self.db_path)', 'AtharRAG/5.3-library-lowmem'
].forEach(token => need(libraryServer, token, 'rag/v5_library_server.py'));
reject(libraryServer, /INSERT\s+INTO|UPDATE\s+books|DELETE\s+FROM/i, 'rag/v5_library_server.py');

const view = read('js/components/ScholarLibraryV4View.js');
[
    "name: 'AtharResearchView'", '/api/rag/v5/status', '/api/rag/v5/books', '/api/rag/v5/ask',
    "payload?.engine !== 'rag-v5-hybrid-multilingual'", 'REQUEST_TIMEOUT_MS = 120000',
    'Athar Research', 'Questions naturelles', 'Les ouvrages indexés', 'Historique local',
    'Pertinence documentaire ≠ certitude religieuse', 'routed_book', 'matched_concepts'
].forEach(token => need(view, token, 'ScholarLibraryV4View.js / Athar Research'));
reject(view, /\/api\/rag\/v2\/|localFallback|embedded_fallback|rag\/seed\.json|Moteur V4 connecté/i, 'Athar Research frontend');

const bootstrap = read('js/components/ScholarV4Bootstrap.js');
[
    "setView('rag_v5')", "viewMode === 'rag_v5'", "'scholar-library-v4-view': window.ScholarLibraryV4View",
    'data-athar-research-v5-nav', 'data-athar-library-reader-nav', 'research-library.html',
    'patchDomTemplate', 'patchHomeView', 'Athar Research · Bibliothèque Savante'
].forEach(token => need(bootstrap, token, 'ScholarV4Bootstrap.js'));
reject(bootstrap, /Bibliothèque Savante · V4|data-athar-scholar-v4-nav/i, 'ScholarV4Bootstrap.js');

const libraryPage = read('research-library.html');
[
    'Bibliothèque Athar', '/api/rag/v5/status', '/api/rag/v5/books', '/api/rag/v5/search',
    '/api/rag/v5/book', '/api/rag/v5/read', 'Le texte français n’est affiché que lorsqu’il existe réellement dans la base',
    'french_passages', 'translation_status'
].forEach(token => need(libraryPage, token, 'research-library.html'));
reject(libraryPage, /MyMemory|translate_arabic|\/api\/rag\/v5\/translate/i, 'research-library.html');

const style = read('css/athar-research-v5.css');
[
    '.ar5-shell', '.ar5-frame', '.ar5-rail', '.ar5-composer', '.ar5-result-layout', '.ar5-evidence',
    '.ar5-books-grid', '.ar5-history-list', '.ar5-method-grid', '.ar5-nav-entry', '.ar5-home-pillar'
].forEach(token => need(style, token, 'css/athar-research-v5.css'));

const render = read('render.yaml');
[
    'python rag/v5_library_server.py --host 0.0.0.0 --api-only',
    'python rag/cache_hosted_corpus.py --output rag/data/athar_hosted.sqlite.gz',
    'ATHAR_DB_PATH', 'rag/data/athar_hosted.sqlite.gz', 'healthCheckPath: /healthz'
].forEach(token => need(render, token, 'render.yaml'));

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
reject(worker, /ScholarLibraryV2View\.js|ScholarV2Bootstrap\.js|RagApiBridge\.js/i, 'service-worker.js');

const remote = read('rag/remote.json');
need(remote, '"api_version": 5', 'rag/remote.json');
need(remote, '"engine": "rag-v5-hybrid-multilingual"', 'rag/remote.json');

const liveWorkflow = read('.github/workflows/rag-v5-live.yml');
[
    'athar-rag-ibradevweb.onrender.com/healthz', "payload.get('engine') == 'rag-v5-hybrid-multilingual'",
    'prier à voix haute', 'PUBLIC RAG V5 NATURAL FRENCH RETRIEVAL: PASS'
].forEach(token => need(liveWorkflow, token, 'RAG V5 live workflow'));

const lowmemWorkflow = read('.github/workflows/rag-v5-lowmem.yml');
[
    'Hammer lightweight health check', 'Verify natural-language query and bounded candidates', 'Check process memory'
].forEach(token => need(lowmemWorkflow, token, 'RAG V5 low-memory workflow'));

console.log('Athar Research V5 static contract valid — queryable corpus, direct bounded reading, low-memory runtime and explicit source-first behavior.');
