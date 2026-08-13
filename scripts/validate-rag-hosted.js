#!/usr/bin/env node

const fs = require('fs');
const vm = require('vm');

const bridgeSource = fs.readFileSync('js/components/RagApiBridge.js', 'utf8');
const remoteConfig = JSON.parse(fs.readFileSync('rag/remote.json', 'utf8'));
const fail = message => {
    console.error(`Hosted RAG validation failed: ${message}`);
    process.exit(1);
};

for (const token of [
    "const REMOTE_CONFIG_PATH = 'rag/remote.json'",
    'const readRemoteOrigin = async () =>',
    'const probeHosted = async origin =>',
    "return remember(remoteOrigin, 'hosted')",
    'hosted-server-unreachable'
]) {
    if (!bridgeSource.includes(token)) fail(`bridge token missing: ${token}`);
}

if (!remoteConfig.enabled) fail('rag/remote.json must enable the hosted backend');
if (!/^https:\/\//.test(String(remoteConfig.origin || ''))) fail('hosted origin must use HTTPS');

const calls = [];
const stored = new Map();
const hostedOrigin = remoteConfig.origin.replace(/\/$/, '');

const jsonResponse = (status, payload) => ({
    ok: status >= 200 && status < 300,
    status,
    async json() { return payload; }
});

const nativeFetch = async (input, init = {}) => {
    const url = String(input);
    calls.push({ url, method: init.method || 'GET' });
    if (url.startsWith('https://ibradevweb.github.io/Athar/rag/remote.json')) {
        return jsonResponse(200, remoteConfig);
    }
    if (url.startsWith(`${hostedOrigin}/api/rag/v2/status`)) {
        return jsonResponse(200, { ok: true, server: 'athar-rag-v2', api_version: 2, deployment: 'hosted' });
    }
    if (url === `${hostedOrigin}/api/rag/v2/ask`) {
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
        origin: 'https://ibradevweb.github.io',
        href: 'https://ibradevweb.github.io/Athar/?v=34',
        hostname: 'ibradevweb.github.io',
        port: '',
        protocol: 'https:',
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
        body: JSON.stringify({ query: 'tayammum' })
    });
    if (!response.ok) fail('hosted request did not succeed');

    const bridge = context.window.AtharRagApiBridge;
    if (!bridge) fail('AtharRagApiBridge was not exposed');
    if (bridge.getBase() !== hostedOrigin) fail(`unexpected hosted origin: ${bridge.getBase()}`);
    if (stored.get('athar_rag_api_origin_v2') !== hostedOrigin) fail('hosted origin was not cached');
    if (!calls.some(call => call.url.startsWith('https://ibradevweb.github.io/Athar/rag/remote.json'))) {
        fail('remote configuration was not loaded from GitHub Pages');
    }
    if (!calls.some(call => call.url === `${hostedOrigin}/api/rag/v2/ask` && call.method === 'POST')) {
        fail('API request was not rewritten to the hosted backend');
    }

    console.log(`Hosted RAG bridge validated: GitHub Pages -> ${hostedOrigin}.`);
})().catch(error => fail(error.stack || error.message));
