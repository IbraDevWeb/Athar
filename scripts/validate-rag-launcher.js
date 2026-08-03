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
    'powershell.exe -NoProfile -ExecutionPolicy Bypass',
    'start-athar-rag.ps1',
    'if not "%ATHAR_EXIT%"=="0"',
    'exit /b %ATHAR_EXIT%'
].forEach(token => need(batch, token, 'start-athar-rag.bat'));
if (/python\s+-m\s+http\.server/i.test(batch)) fail('The batch launcher must never start a static-only server.');
if (/start\s+""\s+"http:/i.test(batch)) fail('The browser must not open before the RAG health check.');

const powershell = read('start-athar-rag.ps1');
[
    'function Test-RagApi',
    '/api/rag/v2/status',
    'function Test-PortOccupied',
    '$PreferredPort..($PreferredPort + 10)',
    'Le port $candidate est occupé par un autre serveur',
    "'rag\\server.py'",
    'Start-Process @startParameters',
    'for ($attempt = 0; $attempt -lt 60; $attempt++)',
    'if (Test-RagApi -Port $selectedPort)',
    'Start-Process $url',
    'Wait-Process -Id $serverProcess.Id',
    'Stop-Process -Id $serverProcess.Id'
].forEach(token => need(powershell, token, 'start-athar-rag.ps1'));

const healthPosition = powershell.indexOf('if (Test-RagApi -Port $selectedPort)');
const browserPosition = powershell.lastIndexOf('Start-Process $url');
if (healthPosition < 0 || browserPosition < healthPosition) {
    fail('The browser must only open after the RAG API has answered successfully.');
}

if (/Invoke-RestMethod\s+\\/m.test(powershell) || /Start-Process\s+\\/m.test(powershell)) {
    fail('Invalid shell-style line continuation found in the PowerShell launcher.');
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
