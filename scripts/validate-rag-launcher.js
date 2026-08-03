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
    'if not "%ATHAR_EXIT%"=="0"',
    'exit /b %ATHAR_EXIT%'
].forEach(token => need(batch, token, 'start-athar-rag.bat'));
if (/python\s+-m\s+http\.server/i.test(batch)) fail('The batch launcher must never start a static-only server.');
if (/start\s+""\s+"http:/i.test(batch)) fail('The browser must not open before the RAG health check.');
if (/powershell/i.test(batch)) fail('The launcher must no longer depend on a PowerShell bootstrap.');

const launcher = read('rag/launcher.py');
[
    'def test_rag_api',
    '/api/rag/v2/status',
    'def port_is_free',
    'def choose_port',
    'range(preferred, preferred + span + 1)',
    'Le port {port} est occupé par un autre serveur',
    'def ensure_environment',
    'def wait_until_ready',
    'def stop_process',
    'subprocess.Popen',
    'wait_until_ready(process, port)',
    'open_athar(port, no_browser)',
    'return process.wait()',
    'webbrowser.open',
    'rag-v2'
].forEach(token => need(launcher, token, 'rag/launcher.py'));

const healthPosition = launcher.indexOf('wait_until_ready(process, port)');
const browserPosition = launcher.indexOf('open_athar(port, no_browser)', healthPosition);
if (healthPosition < 0 || browserPosition < healthPosition) {
    fail('The browser must only open after the RAG API has answered successfully.');
}

const server = read('rag/server.py');
[
    'class AtharRagHandler',
    'def do_GET',
    'def do_POST',
    '"/api/rag/v2/status"',
    '"/api/rag/v2/evaluation"',
    '"/api/rag/v2/ask"',
    'ThreadingHTTPServer'
].forEach(token => need(server, token, 'rag/server.py'));

console.log('RAG launcher validated: port detection, API health check, delayed browser opening and server lifecycle are protected.');
