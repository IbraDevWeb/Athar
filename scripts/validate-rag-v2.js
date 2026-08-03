#!/usr/bin/env node

const fs = require('fs');

const read = path => fs.readFileSync(path, 'utf8');
const fail = message => {
    console.error(`Scholar RAG V2 validation failed: ${message}`);
    process.exit(1);
};
const need = (source, token, label) => {
    if (!source.includes(token)) fail(`${label} is missing: ${token}`);
};

const evaluation = JSON.parse(read('rag/evaluation_v2.json'));
if (evaluation.version !== '2.0') fail('Evaluation version must be 2.0.');
if (!Array.isArray(evaluation.cases) || evaluation.cases.length < 24) fail('At least 24 initial evaluation cases are required.');
const evaluationIds = new Set();
for (const item of evaluation.cases) {
    if (!item.id || evaluationIds.has(item.id)) fail(`Invalid or duplicate evaluation id: ${item.id}`);
    evaluationIds.add(item.id);
    if (!String(item.question || '').trim() || !String(item.discipline || '').trim()) fail(`${item.id} is incomplete.`);
    if (!Array.isArray(item.expected_terms_ar) || item.expected_terms_ar.length < 1) fail(`${item.id} needs Arabic retrieval terms.`);
}

const engine = read('rag/v2.py');
[
    'analyze_question', 'retrieve_evidence', 'answer_question_v2', 'corpus_status_v2',
    'evaluation_status_v2', '_coverage', '_extractive_structure', '_ollama_structure',
    'all_claims_cited', 'valid_source_ids', 'has_substantive_text',
    'Notice uniquement', 'Sources insuffisantes', 'citation_first_extractive',
    'Aucun texte substantiel n’est encore indexé'
].forEach(token => need(engine, token, 'RAG V2 engine'));
if (/openai|anthropic|gemini|api\.openai/i.test(engine)) fail('The V2 engine must not require a remote commercial model.');

const server = read('rag/server.py');
[
    '/api/rag/v2/status', '/api/rag/v2/evaluation', '/api/rag/v2/corpus',
    '/api/rag/v2/search', '/api/rag/v2/ask', 'answer_question_v2',
    'corpus_status_v2', 'evaluation_status_v2', 'AtharRAG/2.1',
    'SERVER_MARKER = "athar-rag-v2"', 'LOCAL_ORIGIN_PATTERN', 'def do_OPTIONS',
    'Access-Control-Allow-Origin', 'Access-Control-Allow-Methods', 'X-Athar-RAG'
].forEach(token => need(server, token, 'RAG server'));

const component = read('js/components/ScholarLibraryV2View.js');
[
    'sv2-query-panel', 'sv2-confidence', 'sv2-answer-layout', 'sv2-claim',
    'sv2-evidence', 'sv2-corpus-space', 'sv2-quality-space',
    '/api/rag/v2/status', '/api/rag/v2/evaluation', '/api/rag/v2/ask',
    'Aucune affirmation sans source', 'sourcesForClaim', 'selectSource',
    'citationAudit', 'Bibliothèque des Compagnons', 'openCompanions',
    'athar-scholar-v2-active', 'onBeforeUnmount', '@click="ask"'
].forEach(token => need(component, token, 'ScholarLibraryV2View'));
if (/v-html|innerHTML|<iframe|new\s+Audio|WebGL|THREE\./i.test(component)) fail('Unsafe or heavy frontend behavior detected.');

const apiBridge = read('js/components/RagApiBridge.js');
[
    "const FIRST_PORT = 8000", "const LAST_PORT = 8010", "'/api/rag/v2/status'",
    "payload?.server === 'athar-rag-v2'", 'candidateOrigins', 'window.fetch = async function atharFetch',
    "response.status !== 404 && response.status !== 405", 'athar_rag_api_origin_v1'
].forEach(token => need(apiBridge, token, 'RAG API bridge'));

const bootstrap = read('js/components/ScholarV2Bootstrap.js');
[
    "setView('rag_v2')", 'data-athar-scholar-v2-nav', 'Pièce maîtresse',
    "'scholar-library-v2-view': window.ScholarLibraryV2View",
    "viewMode === 'rag_v2'", 'patchDomTemplate', 'patchHomeView', 'findHomeRoute',
    'collectTemplateScopes', 'findAcrossScopes', "querySelectorAll?.('template')", 'template.content',
    "scope.querySelector?.('home-view')", 'expressionTargetsHome',
    'Bibliothèque des Compagnons', 'Une affirmation religieuse doit pouvoir être ouverte',
    "homeRoute.setAttribute('v-else-if'", 'data-athar-scholar-v2-route',
    'const originalMount = app.mount.bind(app)', 'app.mount = (target, ...mountArgs)',
    'patchDomTemplate(target)', 'window.Vue.createApp'
].forEach(token => need(bootstrap, token, 'Scholar V2 bootstrap'));
const featurePosition = bootstrap.indexOf('sv2-home-pillar');
const companionsPosition = bootstrap.indexOf('Bibliothèque des Compagnons');
if (featurePosition < 0 || companionsPosition < featurePosition) fail('The V2 home feature or companions link is missing.');
const routeLookupPosition = bootstrap.indexOf('const homeRoute = findHomeRoute(host);');
const navInjectionPosition = bootstrap.lastIndexOf('injectNavigation(host);');
if (routeLookupPosition < 0 || navInjectionPosition < routeLookupPosition) {
    fail('Navigation must only be injected after the V2 route has been resolved.');
}
const scopeCollectionPosition = bootstrap.indexOf('const collectTemplateScopes');
const homeLookupPosition = bootstrap.indexOf('const findHomeRoute');
if (scopeCollectionPosition < 0 || homeLookupPosition < scopeCollectionPosition) {
    fail('Template fragments must be collected before resolving the home route.');
}
const appCreationPosition = bootstrap.indexOf('const app = originalCreateApp.call');
const mountPatchPosition = bootstrap.indexOf('app.mount = (target, ...mountArgs)');
if (appCreationPosition < 0 || mountPatchPosition < appCreationPosition) {
    fail('The DOM template must be patched immediately before Vue mount.');
}

const indexHtml = read('index.html');
if (!/<template\s+v-else>/i.test(indexHtml)) fail('index.html no longer contains the root template fragment handled by the V2 bootstrap.');
if (!/<home-view\b/i.test(indexHtml)) fail('index.html no longer contains the HomeView component used as a stable mount anchor.');
if (!/v-if="viewMode\s*===\s*'home'"/i.test(indexHtml)) fail('The initial home route is missing from index.html.');

const css = read('css/scholar-library-v2.css');
[
    '.sv2-shell', '.sv2-query-panel', '.sv2-confidence', '.sv2-answer-layout',
    '.sv2-evidence', '.sv2-corpus-grid', '.sv2-quality-space',
    'html.athar-scholar-v2-active .athar-mobile-dock',
    'html.athar-app-fullscreen .sv2-shell', '@media (max-width: 680px)',
    '@media (max-width: 430px)', 'prefers-reduced-motion', 'touch-action: manipulation'
].forEach(token => need(css, token, 'Scholar V2 CSS'));
if ((css.match(/{/g) || []).length !== (css.match(/}/g) || []).length) fail('Unbalanced Scholar V2 CSS braces.');

const integrationCss = read('css/scholar-v2-integration.css');
[
    '.sv2-nav-entry', '.sv2-nav-entry.is-active', '.sv2-home-pillar',
    '.sv2-home-grid', '.sv2-home-actions', '.sv2-home-proof',
    '@media (max-width: 640px)', 'touch-action: manipulation'
].forEach(token => need(integrationCss, token, 'Scholar V2 integration CSS'));
if ((integrationCss.match(/{/g) || []).length !== (integrationCss.match(/}/g) || []).length) fail('Unbalanced integration CSS braces.');

const config = read('js/config.js');
[
    "const SCHOLAR_V2_BOOTSTRAP_VERSION = 'rag-v2-mount-2'",
    "const RAG_API_BRIDGE_VERSION = 'rag-api-discovery-1'",
    'const writeEarlyScript = (src, id, version = APP_VERSION)',
    "writeEarlyScript('js/components/RagApiBridge.js', 'athar-rag-api-bridge', RAG_API_BRIDGE_VERSION)",
    "writeEarlyScript('js/components/ScholarLibraryV2View.js'",
    "writeEarlyScript('js/components/ScholarV2Bootstrap.js', 'athar-scholar-v2-bootstrap', SCHOLAR_V2_BOOTSTRAP_VERSION)",
    "writeEarlyScript('js/components/AstronomyBootstrap.js'",
    'css/scholar-library-v2.css?v=${APP_VERSION}',
    'css/scholar-v2-integration.css?v=${APP_VERSION}',
    'Bibliothèque savante et encyclopédie islamique'
].forEach(token => need(config, token, 'config.js'));
if (config.indexOf('RagApiBridge.js') > config.indexOf('ScholarLibraryV2View.js')) fail('The RAG API bridge must load before the V2 component.');
if (config.indexOf('ScholarV2Bootstrap.js') > config.indexOf('AstronomyBootstrap.js')) fail('Scholar V2 must patch the root before the Tool extensions bootstrap.');

const worker = read('service-worker.js');
[
    './js/components/RagApiBridge.js?v=rag-api-discovery-1',
    './js/components/ScholarLibraryV2View.js?v=athar-pro-v34',
    './js/components/ScholarV2Bootstrap.js?v=athar-pro-v34',
    './js/components/ScholarV2Bootstrap.js?v=rag-v2-mount-2',
    './css/scholar-library-v2.css?v=athar-pro-v34',
    './css/scholar-v2-integration.css?v=athar-pro-v34',
    './rag/evaluation_v2.json?v=athar-pro-v34'
].forEach(token => need(worker, token, 'service worker'));

const extensions = read('extensions_data.js');
need(extensions, 'Moteur RAG classique', 'V1 metadata distinction');

console.log(`Scholar RAG V2 validated: ${evaluation.cases.length} evaluation questions, citation-first engine, cross-port API bridge, local CORS and cached hotfix.`);
