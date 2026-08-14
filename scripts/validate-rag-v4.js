#!/usr/bin/env node

const fs = require('fs');
const read = path => fs.readFileSync(path, 'utf8');
const fail = message => { console.error(`RAG V4 validation failed: ${message}`); process.exit(1); };
const need = (source, token, label) => { if (!source.includes(token)) fail(`${label} is missing: ${token}`); };
const reject = (source, pattern, label) => { if (pattern.test(source)) fail(`${label} contains forbidden legacy behavior: ${pattern}`); };

const engine = read('rag/v4_engine.py');
[
    'def detect_book(', 'def detect_concepts(', 'def build_fts_query(', 'def search(', 'def ask(',
    'STOPWORDS', 'CONCEPTS', 'read_only', 'routed_book', 'matched_concepts', 'matched_terms',
    'Aucun passage suffisamment pertinent', 'pertinence documentaire'
].forEach(token => need(engine, token, 'rag/v4_engine.py'));
reject(engine, /from\s+v2\s+import|from\s+retrieval_v3\s+import|openai|anthropic|gemini/i, 'rag/v4_engine.py');

const server = read('rag/v4_server.py');
[
    'SERVER_MARKER = "athar-rag-v4"', 'api_version', '/api/rag/v4/status', '/api/rag/v4/books',
    '/api/rag/v4/search', '/api/rag/v4/ask', 'mode=ro', 'PRAGMA query_only=ON',
    'ThreadingHTTPServer', 'Access-Control-Allow-Origin', 'ATHAR_CORS_ORIGINS'
].forEach(token => need(server, token, 'rag/v4_server.py'));
reject(server, /import\s+v2|import\s+retrieval_v3|localFallback|seed\.json/i, 'rag/v4_server.py');

const view = read('js/components/ScholarLibraryV4View.js');
[
    '/api/rag/v4/status', '/api/rag/v4/books', '/api/rag/v4/ask',
    "healthPayload?.server !== 'athar-rag-v4'", 'REQUEST_TIMEOUT_MS = 120000',
    'Aucune réponse de secours', 'pertinence documentaire', 'Ouvrage ciblé', 'routed_book'
].forEach(token => need(view, token, 'ScholarLibraryV4View.js'));
reject(view, /\/api\/rag\/v2\/|localFallback|embedded_fallback|rag\/seed\.json/i, 'ScholarLibraryV4View.js');

const bootstrap = read('js/components/ScholarV4Bootstrap.js');
[
    "setView('rag_v4')", "viewMode === 'rag_v4'", "'scholar-library-v4-view': window.ScholarLibraryV4View",
    'data-athar-scholar-v4-nav', 'patchDomTemplate', 'patchHomeView', 'Bibliothèque Savante · V4'
].forEach(token => need(bootstrap, token, 'ScholarV4Bootstrap.js'));

const migration = read('js/components/ScholarV2Bootstrap.js');
[
    'ScholarLibraryV4View.js', 'ScholarV4Bootstrap.js', 'rag-v4-ui-1',
    'window.AtharRagApiBridge?.nativeFetch', 'window.fetch = window.AtharRagApiBridge.nativeFetch'
].forEach(token => need(migration, token, 'ScholarV2Bootstrap.js migration shim'));
reject(migration, /setView\(['"]rag_v2['"]\)|viewMode\s*===\s*['"]rag_v2['"]/i, 'ScholarV2Bootstrap.js migration shim');

const render = read('render.yaml');
[
    'python rag/v4_server.py --host 0.0.0.0 --api-only',
    'python rag/cache_hosted_corpus.py --output rag/data/athar_hosted.sqlite.gz',
    'ATHAR_DB_PATH', 'rag/data/athar_hosted.sqlite.gz', 'healthCheckPath: /healthz'
].forEach(token => need(render, token, 'render.yaml'));
reject(render, /startCommand:\s*python rag\/(?:server|server_v3|strict_server)\.py/i, 'render.yaml');

const config = read('js/config.js');
need(config, "const APP_VERSION = 'athar-pro-v35'", 'js/config.js');
need(config, "writeEarlyScript('js/components/ScholarV2Bootstrap.js'", 'js/config.js compatibility loader');
const worker = read('service-worker.js');
need(worker, "const CACHE_VERSION = 'athar-pro-v35'", 'service-worker.js');

const unitTests = read('rag/v4_unit_tests.py');
[
    'Que dit Sahih al-Bukhari sur les intentions ?',
    'Que dit Sahih Muslim sur la purification ?',
    'Que rapporte le Muwatta de Malik sur la prière ?',
    'Que dit Bidayat al-Mujtahid sur le jeûne du voyageur ?',
    'Que dit le Tafsir al-Tabari sur la sourate al-Fatiha ?',
    'Que dit le Tafsir Ibn Kathir sur Ayat al-Kursi ?',
    'Que rapporte Sunan al-Tirmidhi sur la prière du witr ?',
    "Que trouve-t-on dans la Sira d'Ibn Hisham concernant la bataille de Badr ?",
    'test_no_unrelated_fallback'
].forEach(token => need(unitTests, token, 'rag/v4_unit_tests.py'));

const corpusTests = read('rag/v4_corpus_tests.py');
[
    "status['books'] < 55", "status['chunks'] < 240_000", "status['fts_ready']",
    'RAG V4 REAL CORPUS: ALL TESTS PASSED'
].forEach(token => need(corpusTests, token, 'rag/v4_corpus_tests.py'));

const liveWorkflow = read('.github/workflows/rag-v4-live.yml');
[
    'athar-rag-ibradevweb.onrender.com/healthz', "payload.get('server') == 'athar-rag-v4'",
    '/api/rag/v4/status', '/api/rag/v4/search', 'LIVE RAG V4: ALL TESTS PASSED'
].forEach(token => need(liveWorkflow, token, 'RAG V4 live workflow'));

console.log('RAG V4 static contract valid — read-only corpus, book-aware retrieval, explicit failure, V4 frontend and live verification gate.');
