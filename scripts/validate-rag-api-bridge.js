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
    "const RUNTIME_PATH = 'rag/runtime.json'",
    "const STORAGE_KEY = 'athar_rag_api_origin_v2'",
    'const readRuntimeOrigin = async () =>',
    "payload?.server !== 'athar-rag-v2'",
    'ports.push(8765)',
    'window.fetch = async function atharFetch',
    'unavailableResponse',
    'athar-rag-api-connected',
    'athar-rag-api-unavailable'
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
    if (url.startsWith('http://127.0.0.1:8000/rag/runtime.json')) {
        return jsonResponse(200, {
            ok: true,
            server: 'athar-rag-v2',
            origin: 'http://127.0.0.1:8765',
            port: 8765
        });
    }
    if (url.startsWith('http://127.0.0.1:8765/api/rag/v2/status')) {
        return jsonResponse(200, { ok: true, server: 'athar-rag-v2', api_version: 2 });
    }
    if (url === 'http://127.0.0.1:8765/api/rag/v2/ask') {
        return jsonResponse(200, { ok: true, server: 'athar-rag-v2', answer: { summary: 'ok' } });
    }
    return jsonResponse(404, { ok: false });
};

class FakeResponse {
    constructor(body, options = {}) {
        this.body = body;
        this.status = options.status || 200;
        this.ok = this.status >= 200 && this.status < 300;
        this.headers = options.headers || {};
    }
    async json() { return JSON.parse(this.body); }
}

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
    Response: FakeResponse,
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
    if (bridge.getBase() !== 'http://127.0.0.1:8765') {
        fail(`unexpected discovered origin: ${bridge.getBase()}`);
    }
    if (stored.get('athar_rag_api_origin_v2') !== 'http://127.0.0.1:8765') {
        fail('the runtime origin was not cached');
    }
    if (!calls.some(call => call.url.startsWith('http://127.0.0.1:8000/rag/runtime.json'))) {
        fail('the runtime manifest was not consulted');
    }
    if (!calls.some(call => call.url === 'http://127.0.0.1:8765/api/rag/v2/ask' && call.method === 'POST')) {
        fail('the POST request was not redirected to the runtime RAG port');
    }

    const before = calls.length;
    await context.window.fetch('/css/style.css');
    if (calls.length !== before + 1 || calls.at(-1).url !== '/css/style.css') {
        fail('non-RAG requests must pass through untouched');
    }

    console.log('RAG API bridge validated: runtime manifest read, persistent server detected, POST rewritten and origin cached.');
})().catch(error => fail(error.stack || error.message));
