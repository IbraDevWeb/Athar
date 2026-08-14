// Athar Pro — pont léger entre l'interface statique et le serveur RAG V2.
(() => {
    if (!window.fetch || window.AtharRagApiBridge) return;

    const nativeFetch = window.fetch.bind(window);
    const API_PREFIX = '/api/rag/';
    const RUNTIME_PATH = 'rag/runtime.json';
    const REMOTE_CONFIG_PATH = 'rag/remote.json';
    const STORAGE_KEY = 'athar_rag_api_origin_v2';
    const LOCAL_HOSTS = new Set(['127.0.0.1', 'localhost', '::1', '[::1]']);
    const FIRST_RUNTIME_PORT = 8765;
    const LAST_RUNTIME_PORT = 8785;
    const PROBE_BATCH_SIZE = 8;
    const REMOTE_REQUEST_TIMEOUT_MS = 120000;
    let activeOrigin = '';
    let discoveryPromise = null;

    const isLocalPage = () => LOCAL_HOSTS.has(String(window.location?.hostname || '').toLowerCase());
    const validOrigin = value => {
        try {
            const url = new URL(String(value || ''));
            if (url.protocol === 'https:' && !url.username && !url.password) return url.origin;
            if (url.protocol === 'http:' && LOCAL_HOSTS.has(url.hostname.toLowerCase()) && /^\d{1,5}$/.test(url.port)) return url.origin;
        } catch (_) {}
        return '';
    };
    const storage = {
        get() { try { return validOrigin(window.sessionStorage?.getItem(STORAGE_KEY)); } catch (_) { return ''; } },
        set(value) { try { value ? window.sessionStorage?.setItem(STORAGE_KEY, value) : window.sessionStorage?.removeItem(STORAGE_KEY); } catch (_) {} }
    };
    const readRuntimeOrigin = async () => {
        if (!isLocalPage()) return '';
        try {
            const url = new URL(RUNTIME_PATH, window.location.href);
            url.searchParams.set('t', Date.now());
            const response = await nativeFetch(url.href, { cache: 'no-store', headers: { Accept: 'application/json' } });
            if (!response.ok) return '';
            const payload = await response.json();
            if (payload?.server !== 'athar-rag-v2') return '';
            return validOrigin(payload.origin || `http://127.0.0.1:${payload.port}`);
        } catch (_) { return ''; }
    };
    const readRemoteOrigin = async () => {
        try {
            const url = new URL(REMOTE_CONFIG_PATH, window.location.href);
            url.searchParams.set('t', Date.now());
            const response = await nativeFetch(url.href, { cache: 'no-store', headers: { Accept: 'application/json' } });
            if (!response.ok) return '';
            const payload = await response.json();
            if (payload?.enabled === false) return '';
            return validOrigin(payload?.origin);
        } catch (_) { return ''; }
    };
    const candidateOrigins = () => storage.get() ? [storage.get()] : [];
    const probeCandidates = async origins => origins.find(Boolean) || '';
    const probeHosted = async origin => Boolean(origin);
    const remember = (origin, source) => {
        activeOrigin = origin;
        storage.set(origin);
        window.dispatchEvent?.(new CustomEvent('athar-rag-api-connected', { detail: { origin, source } }));
        return origin;
    };
    const reset = () => { activeOrigin = ''; discoveryPromise = null; storage.set(''); };
    const discover = async (force = false) => {
        if (!force && activeOrigin) return activeOrigin;
        if (!force && discoveryPromise) return discoveryPromise;
        discoveryPromise = (async () => {
            if (isLocalPage()) {
                const runtimeOrigin = await readRuntimeOrigin();
                if (runtimeOrigin) return remember(runtimeOrigin, 'runtime');
                const cached = storage.get();
                if (cached) return remember(cached, 'cache');
            }
            const remoteOrigin = await readRemoteOrigin();
            if (remoteOrigin) return remember(remoteOrigin, 'hosted');
            window.dispatchEvent?.(new CustomEvent('athar-rag-api-unavailable', { detail: { reason: 'hosted-server-unreachable' } }));
            return '';
        })();
        try { return await discoveryPromise; }
        finally { discoveryPromise = null; }
    };
    const toUrl = input => {
        try { return new URL(typeof input === 'string' ? input : input.url, window.location.href); }
        catch (_) { return null; }
    };
    const unavailableResponse = () => new Response(JSON.stringify({ ok: false, error: 'Le backend RAG hébergé n’est pas disponible pour le moment.' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Athar-RAG-Bridge': 'unavailable' }
    });
    const hostedFetch = async (target, init) => {
        const controller = new AbortController();
        const timeout = window.setTimeout?.(() => controller.abort(), REMOTE_REQUEST_TIMEOUT_MS);
        const forwardedInit = init && typeof init === 'object'
            ? { ...init, signal: controller.signal }
            : { signal: controller.signal };
        try {
            return await nativeFetch(target, forwardedInit);
        } finally {
            if (timeout != null) window.clearTimeout?.(timeout);
        }
    };

    window.fetch = async function atharFetch(input, init) {
        const url = toUrl(input);
        if (!url || !url.pathname.startsWith(API_PREFIX)) return nativeFetch(input, init);
        const origin = await discover(false);
        if (!origin) return unavailableResponse();
        const target = `${origin}${url.pathname}${url.search}${url.hash}`;
        try { return await hostedFetch(target, init); }
        catch (_) { return unavailableResponse(); }
    };

    window.AtharRagApiBridge = {
        discover,
        reset,
        getBase: () => activeOrigin,
        candidateOrigins,
        readRuntimeOrigin,
        readRemoteOrigin,
        probeCandidates,
        probeHosted,
        nativeFetch,
        FIRST_RUNTIME_PORT,
        LAST_RUNTIME_PORT,
        PROBE_BATCH_SIZE,
        REMOTE_REQUEST_TIMEOUT_MS
    };
    window.setTimeout?.(() => discover(false).catch(() => {}), 0);
})();
