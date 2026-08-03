#!/usr/bin/env node

const fs = require('fs');

const read = path => fs.readFileSync(path, 'utf8');
const fail = message => {
    console.error(`RAG launcher validation failed: ${message}`);
    process.exit(1);
};
const need = (source, token, label) => {
    if (!source.includes(token)) fail(`${label} is missing: ${token}`);
};

const batch = read('start-athar-rag.bat');
[
    'where py >nul 2>nul',
    'py -3 rag\\launcher.py %*',
    'python rag\\launcher.py %*',
    'Le serveur fonctionne maintenant en arriere-plan',
    'stop-athar-rag.bat',
    'exit /b 0'
].forEach(token => need(batch, token, 'start-athar-rag.bat'));
if (/python\s+-m\s+http\.server/i.test(batch)) fail('The batch launcher must never start a static-only server.');
if (/pip\s+install/i.test(batch)) fail('The server launcher must not install scraper dependencies.');

const launcher = read('rag/launcher.py');
[
    'RUNTIME_FILE = ROOT / "rag" / "runtime.json"',
    'LOG_FILE = ROOT / "rag" / "server.log"',
    'STARTER_CORPUS = ROOT / "rag" / "starter_corpus.json"',
    'from core import DEFAULT_DB, ensure_database, import_seed',
    'def ensure_starter_corpus',
    'import_seed(connection, STARTER_CORPUS)',
    'ensure_starter_corpus()',
    'def test_rag_api',
    '/api/rag/v2/status',
    'def port_is_free',
    'def choose_port',
    'def write_runtime',
    'def detached_process_kwargs',
    'def start_server',
    'wait_until_ready(process, port)',
    'write_runtime(port, int(process.pid))',
    'start_new_session',
    'DETACHED_PROCESS',
    'default=8765',
    'open_athar(port, no_browser)',
    'Le serveur reste actif après la fermeture de cette fenêtre',
    'stop-athar-rag.bat'
].forEach(token => need(launcher, token, 'rag/launcher.py'));
if (/pip["']?\s*,?\s*["']install|requirements\.txt/i.test(launcher)) {
    fail('Starting the RAG server must not depend on pip or scraper requirements.');
}

const starterPosition = launcher.indexOf('ensure_starter_corpus()');
const portPosition = launcher.indexOf('port, existing = choose_port(preferred_port)', starterPosition);
if (starterPosition < 0 || portPosition < starterPosition) {
    fail('The starter corpus must migrate before an existing server is reused.');
}

const healthPosition = launcher.indexOf('wait_until_ready(process, port)');
const runtimePosition = launcher.indexOf('write_runtime(port, int(process.pid))', healthPosition);
const browserPosition = launcher.indexOf('open_athar(port, no_browser)', runtimePosition);
if (healthPosition < 0 || runtimePosition < healthPosition || browserPosition < runtimePosition) {
    fail('Health check and runtime manifest must complete before opening the browser.');
}

const stopBatch = read('stop-athar-rag.bat');
['rag\\stop_server.py', 'pause', 'exit /b %ATHAR_EXIT%'].forEach(token => need(stopBatch, token, 'stop-athar-rag.bat'));
const stopScript = read('rag/stop_server.py');
['RUNTIME_FILE', 'def api_alive', 'def stop_pid', 'taskkill', 'os.killpg', 'RUNTIME_FILE.unlink'].forEach(token => need(stopScript, token, 'rag/stop_server.py'));

const starter = JSON.parse(read('rag/starter_corpus.json'));
if (!Array.isArray(starter.books) || starter.books.length < 6) fail('The starter corpus needs at least six books.');
if (!Array.isArray(starter.chunks) || starter.chunks.length < 9) fail('The starter corpus needs at least nine passages.');

const ignore = read('.gitignore');
['rag/runtime.json', 'rag/runtime.json.tmp', 'rag/server.log'].forEach(token => need(ignore, token, '.gitignore'));

console.log('RAG launcher validated: automatic starter migration, no network dependency, detached server, runtime manifest and explicit stop command.');
