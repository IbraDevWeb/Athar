#!/usr/bin/env node

const fs = require('fs');
const vm = require('vm');

const bridgeSource = fs.readFileSync('js/components/RagApiBridge.js', 'utf8');
const fail = message => {
    console.error(`RAG API bridge validation failed: ${message}`);
    process.exit(1);
};
const need = token => {
    if (!bridgeSource.includes(token)) fail(`missing token: ${token}`);
};

[
    "const FIRST_PORT = 8000",
    "const LAST_PORT = 8010",
    "'/api/rag/v2/status'",
    "payload?.server === 'athar-rag-v2'",
    "window.fetch = async function atharFetch",
    "response.status !== 404 && response.status !== 405",
    "athar-rag-api-connected",
    "ragPort"
].forEach(need);

const calls = [];
const stored = new Map();
const jsonResponse = (status, payload) => ({
    ok: status >= 200 && status < 300,
    status,
    async json() { return payload; }
});

const nativeFetch = async (input, init = {}) => {
    const url = String(input);
    calls.push({ url, method: init.method || 'GET' });
    if (url.startsWith('http://127.0.0.1:8000/api/rag/v2/status')) {
        return jsonResponse(404, { ok: false });
    }
    if (url.startsWith('http://localhost:8000/api/rag/v2/status')) {
        return jsonResponse(404, { ok: false });
    }
    if (url.startsWith('http://127.0.0.1:8001/api/rag/v2/status')) {
        return jsonResponse(200, { ok: true, server: 'athar-rag-v2', api_version: 2 });
    }
    if (url === 'http://127.0.0.1:8001/api/rag/v2/ask') {
        return jsonResponse(200, { ok: true, server: 'athar-rag-v2', answer: { summary: 'ok' } });
    }
    return jsonResponse(404, { ok: false });
};

const windowObject = {
    fetch: nativeFetch,
    location: {
        origin: 'http://127.0.0.1:8000',
        href: 'http://127.0.0.1:8000/?v=34',
        hostname: '127.0.0.1',
        port: '8000',
        protocol: 'http:',
        search: '?v=34'
    },
    sessionStorage: {
        getItem(key) { return stored.get(key) || null; },
        setItem(key, value) { stored.set(key, String(value)); },
        removeItem(key) { stored.delete(key); }
    },
    setTimeout,
    clearTimeout,
    dispatchEvent() {}
};

const context = {
    window: windowObject,
    URL,
    URLSearchParams,
    AbortController,
    Request,
    CustomEvent: class CustomEvent {
        constructor(type, options) {
            this.type = type;
            this.detail = options?.detail;
        }
    },
    console,
    setTimeout,
    clearTimeout
};
vm.createContext(context);
vm.runInContext(bridgeSource, context, { filename: 'RagApiBridge.js' });

(async () => {
    const response = await context.window.fetch('/api/rag/v2/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'voyage' })
    });
    if (!response.ok) fail('the rewritten API request did not succeed');

    const bridge = context.window.AtharRagApiBridge;
    if (!bridge) fail('AtharRagApiBridge was not exposed');
    if (bridge.getBase() !== 'http://127.0.0.1:8001') {
        fail(`unexpected discovered origin: ${bridge.getBase()}`);
    }
    if (stored.get('athar_rag_api_origin_v1') !== 'http://127.0.0.1:8001') {
        fail('the discovered origin was not cached');
    }
    if (!calls.some(call => call.url === 'http://127.0.0.1:8001/api/rag/v2/ask' && call.method === 'POST')) {
        fail('the POST request was not redirected to the discovered RAG port');
    }

    const before = calls.length;
    await context.window.fetch('/css/style.css');
    if (calls.length !== before + 1 || calls.at(-1).url !== '/css/style.css') {
        fail('non-RAG requests must pass through untouched');
    }

    console.log('RAG API bridge validated: static port rejected, RAG port discovered, POST rewritten and origin cached.');
})().catch(error => fail(error.stack || error.message));
