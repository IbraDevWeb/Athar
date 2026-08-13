// Athar Pro — pont entre l'interface statique et le serveur RAG V2 local ou hébergé.
(() => {
    if (!window.fetch || window.AtharRagApiBridge) return;
    const nativeFetch = window.fetch.bind(window);
    const API_PREFIX = '/api/rag/';
    const HEALTH_PATH = '/api/rag/v2/status';
    const RUNTIME_PATH = 'rag/runtime.json';
    const REMOTE_CONFIG_PATH = 'rag/remote.json';
    const STORAGE_KEY = 'athar_rag_api_origin_v2';
    const LOCAL_HOSTS = new Set(['127.0.0.1', 'localhost', '::1', '[::1]']);
    const FIRST_LEGACY_PORT = 8000;
    const LAST_LEGACY_PORT = 8020;
    const FIRST_RUNTIME_PORT = 8765;
    const LAST_RUNTIME_PORT = 8785;
    const PROBE_BATCH_SIZE = 8;
    const HOSTED_PROBE_ATTEMPTS = 24;
    const HOSTED_PROBE_TIMEOUT = 7000;
    const HOSTED_PROBE_DELAY = 3500;
    let activeOrigin = '';
    let discoveryPromise = null;

    const storage = {
        get() { try { return window.sessionStorage?.getItem(STORAGE_KEY) || ''; } catch (_) { return ''; } },
        set(value) { try { if (value) window.sessionStorage?.setItem(STORAGE_KEY, value); else window.sessionStorage?.removeItem(STORAGE_KEY); } catch (_) {} }
    };
    const isLocalPage = () => LOCAL_HOSTS.has(String(window.location?.hostname || '').toLowerCase());
    const toUrl = input => {
        try {
            if (typeof input === 'string' || input instanceof URL) return new URL(String(input), window.location.href);
            if (input && typeof input.url === 'string') return new URL(input.url, window.location.href);
        } catch (_) { return null; }
        return null;
    };
    const validLocalOrigin = value => {
        try {
            const url = new URL(String(value || ''));
            return url.protocol === 'http:' && LOCAL_HOSTS.has(url.hostname.toLowerCase()) && /^\d{1,5}$/.test(url.port) ? url.origin : '';
        } catch (_) { return ''; }
    };
    const validApiOrigin = value => {
        const local = validLocalOrigin(value);
        if (local) return local;
        try {
            const url = new URL(String(value || ''));
            return url.protocol === 'https:' && !url.username && !url.password ? url.origin : '';
        } catch (_) { return ''; }
    };
    const addCandidate = (list, seen, origin) => { const valid = validApiOrigin(origin); if (valid && !seen.has(valid)) { seen.add(valid); list.push(valid); } };

    const readRuntimeOrigin = async () => {
        if (!isLocalPage()) return '';
        try {
            const runtimeUrl = new URL(RUNTIME_PATH, window.location.href);
            runtimeUrl.searchParams.set('t', String(Date.now()));
            const response = await nativeFetch(runtimeUrl.href, { method: 'GET', cache: 'no-store', headers: { Accept: 'application/json' } });
            if (!response.ok) return '';
            const payload = await response.json();
            if (payload?.ok !== true || payload?.server !== 'athar-rag-v2') return '';
            return validLocalOrigin(payload.origin || `http://127.0.0.1:${payload.port}`);
        } catch (_) { return ''; }
    };
    const readRemoteOrigin = async () => {
        try {
            const remoteUrl = new URL(REMOTE_CONFIG_PATH, window.location.href);
            remoteUrl.searchParams.set('t', String(Date.now()));
            const response = await nativeFetch(remoteUrl.href, { method: 'GET', cache: 'no-store', headers: { Accept: 'application/json' } });
            if (!response.ok) return '';
            const payload = await response.json();
            if (payload?.enabled === false) return '';
            return validApiOrigin(payload?.origin || '');
        } catch (_) { return ''; }
    };
    const candidateOrigins = () => {
        const list = [], seen = new Set();
        addCandidate(list, seen, storage.get());
        const location = window.location;
        if (!location || !isLocalPage()) return list;
        addCandidate(list, seen, location.origin);
        const params = new URLSearchParams(location.search || '');
        const requestedPorts = [params.get('ragPort'), params.get('rag_port'), params.get('port')].map(Number).filter(port => Number.isInteger(port) && port > 0 && port < 65536);
        const hosts = [location.hostname, '127.0.0.1', 'localhost'].filter((host, index, values) => host && values.indexOf(host) === index);
        const ports = [...requestedPorts];
        const currentPort = Number(location.port);
        if (Number.isInteger(currentPort) && currentPort > 0) ports.push(currentPort);
        ports.push(FIRST_RUNTIME_PORT);
        for (let port = FIRST_LEGACY_PORT; port <= LAST_LEGACY_PORT; port += 1) ports.push(port);
        for (let port = FIRST_RUNTIME_PORT; port <= LAST_RUNTIME_PORT; port += 1) ports.push(port);
        for (const port of [...new Set(ports)]) for (const host of hosts) addCandidate(list, seen, `http://${host}:${port}`);
        return list;
    };
    const probe = async (origin, timeoutMs = 900) => {
        const controller = typeof AbortController === 'function' ? new AbortController() : null;
        const timeout = window.setTimeout?.(() => controller?.abort(), timeoutMs);
        try {
            const response = await nativeFetch(`${origin}${HEALTH_PATH}?probe=1&t=${Date.now()}`, { method: 'GET', cache: 'no-store', headers: { Accept: 'application/json' }, signal: controller?.signal });
            if (!response.ok) return false;
            const payload = await response.json();
            return payload?.ok === true && payload?.server === 'athar-rag-v2';
        } catch (_) { return false; } finally { if (timeout) window.clearTimeout?.(timeout); }
    };
    const probeCandidates = async origins => {
        for (let index = 0; index < origins.length; index += PROBE_BATCH_SIZE) {
            const batch = origins.slice(index, index + PROBE_BATCH_SIZE);
            const results = await Promise.all(batch.map(async origin => ({ origin, ok: await probe(origin) })));
            const match = results.find(result => result.ok);
            if (match) return match.origin;
        }
        return '';
    };
    const sleep = delay => new Promise(resolve => window.setTimeout?.(resolve, delay));
    const probeHosted = async origin => {
        if (!origin) return false;
        for (let attempt = 1; attempt <= HOSTED_PROBE_ATTEMPTS; attempt += 1) {
            if (await probe(origin, HOSTED_PROBE_TIMEOUT)) return true;
            if (attempt < HOSTED_PROBE_ATTEMPTS) await sleep(HOSTED_PROBE_DELAY);
        }
        return false;
    };
    const announce = (eventName, detail = {}) => { if (typeof window.dispatchEvent === 'function' && typeof CustomEvent === 'function') window.dispatchEvent(new CustomEvent(eventName, { detail })); };
    const remember = (origin, source) => { activeOrigin = origin; storage.set(origin); announce('athar-rag-api-connected', { origin, source }); return origin; };
    const reset = () => { activeOrigin = ''; discoveryPromise = null; storage.set(''); };
    const discover = async (force = false, excludedOrigin = '') => {
        if (!force && activeOrigin) return activeOrigin;
        if (!force && discoveryPromise) return discoveryPromise;
        discoveryPromise = (async () => {
            if (isLocalPage()) {
                const runtimeOrigin = await readRuntimeOrigin();
                if (runtimeOrigin && runtimeOrigin !== excludedOrigin && await probe(runtimeOrigin)) return remember(runtimeOrigin, 'runtime');
                const discovered = await probeCandidates(candidateOrigins().filter(origin => origin !== excludedOrigin && origin !== runtimeOrigin));
                if (discovered) return remember(discovered, 'scan');
            }
            const remoteOrigin = await readRemoteOrigin();
            if (remoteOrigin && remoteOrigin !== excludedOrigin && await probeHosted(remoteOrigin)) return remember(remoteOrigin, 'hosted');
            activeOrigin = ''; storage.set(''); announce('athar-rag-api-unavailable', { reason: remoteOrigin ? 'hosted-server-unreachable' : 'remote-not-configured' }); return '';
        })();
        try { return await discoveryPromise; } finally { discoveryPromise = null; }
    };
    const rewriteInput = (input, origin) => {
        const url = toUrl(input); if (!url) return input;
        const target = `${origin}${url.pathname}${url.search}${url.hash}`;
        if (typeof Request === 'function' && input instanceof Request) return new Request(target, input);
        return target;
    };
    const usableInitAfterDiscovery = init => {
        if (!init || !init.signal?.aborted) return init;
        const copy = { ...init }; delete copy.signal; return copy;
    };
    const unavailableResponse = () => new Response(JSON.stringify({ ok: false, error: isLocalPage() ? 'Le serveur RAG n’est pas disponible. Lancez start-athar-rag.bat ou vérifiez le backend hébergé.' : 'Le backend RAG hébergé n’est pas disponible pour le moment.' }), { status: 503, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Athar-RAG-Bridge': 'unavailable' } });

    window.fetch = async function atharFetch(input, init) {
        const url = toUrl(input);
        if (!url || !url.pathname.startsWith(API_PREFIX)) return nativeFetch(input, init);
        let origin = await discover(false);
        if (!origin) return unavailableResponse();
        try {
            let response = await nativeFetch(rewriteInput(input, origin), usableInitAfterDiscovery(init));
            if (response.status !== 404 && response.status !== 405) return response;
            reset();
            const replacement = await discover(true, origin);
            if (!replacement) return unavailableResponse();
            return nativeFetch(rewriteInput(input, replacement), usableInitAfterDiscovery(init));
        } catch (_) {
            reset();
            const replacement = await discover(true, origin);
            if (!replacement) return unavailableResponse();
            return nativeFetch(rewriteInput(input, replacement), usableInitAfterDiscovery(init));
        }
    };
    window.AtharRagApiBridge = { discover, reset, getBase: () => activeOrigin, candidateOrigins, readRuntimeOrigin, readRemoteOrigin, probeCandidates, nativeFetch };
    window.setTimeout?.(() => discover(false).catch(() => {}), 0);
})();
