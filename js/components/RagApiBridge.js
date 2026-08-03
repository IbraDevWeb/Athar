// Athar Pro — pont local entre l'interface statique et le serveur RAG V2.
(() => {
    if (!window.fetch || window.AtharRagApiBridge) return;

    const nativeFetch = window.fetch.bind(window);
    const API_PREFIX = '/api/rag/';
    const HEALTH_PATH = '/api/rag/v2/status';
    const RUNTIME_PATH = 'rag/runtime.json';
    const STORAGE_KEY = 'athar_rag_api_origin_v2';
    const LOCAL_HOSTS = new Set(['127.0.0.1', 'localhost', '::1', '[::1]']);
    const FIRST_LEGACY_PORT = 8000;
    const LAST_LEGACY_PORT = 8020;
    const FIRST_RUNTIME_PORT = 8765;
    const LAST_RUNTIME_PORT = 8785;
    const PROBE_BATCH_SIZE = 8;

    let activeOrigin = '';
    let discoveryPromise = null;

    const storage = {
        get() {
            try {
                return window.sessionStorage?.getItem(STORAGE_KEY) || '';
            } catch (_) {
                return '';
            }
        },
        set(value) {
            try {
                if (value) window.sessionStorage?.setItem(STORAGE_KEY, value);
                else window.sessionStorage?.removeItem(STORAGE_KEY);
            } catch (_) {
                // Le stockage peut être indisponible en navigation privée stricte.
            }
        }
    };

    const isLocalPage = () => LOCAL_HOSTS.has(String(window.location?.hostname || '').toLowerCase());

    const toUrl = input => {
        try {
            if (typeof input === 'string' || input instanceof URL) {
                return new URL(String(input), window.location.href);
            }
            if (input && typeof input.url === 'string') {
                return new URL(input.url, window.location.href);
            }
        } catch (_) {
            return null;
        }
        return null;
    };

    const validLocalOrigin = value => {
        try {
            const url = new URL(String(value || ''));
            return url.protocol === 'http:' && LOCAL_HOSTS.has(url.hostname.toLowerCase()) && /^\d{1,5}$/.test(url.port)
                ? url.origin
                : '';
        } catch (_) {
            return '';
        }
    };

    const addCandidate = (list, seen, origin) => {
        const valid = validLocalOrigin(origin);
        if (!valid || seen.has(valid)) return;
        seen.add(valid);
        list.push(valid);
    };

    const readRuntimeOrigin = async () => {
        if (!isLocalPage()) return '';
        try {
            const runtimeUrl = new URL(RUNTIME_PATH, window.location.href);
            runtimeUrl.searchParams.set('t', String(Date.now()));
            const response = await nativeFetch(runtimeUrl.href, {
                method: 'GET',
                cache: 'no-store',
                headers: { Accept: 'application/json' }
            });
            if (!response.ok) return '';
            const payload = await response.json();
            if (payload?.ok !== true || payload?.server !== 'athar-rag-v2') return '';
            return validLocalOrigin(payload.origin || `http://127.0.0.1:${payload.port}`);
        } catch (_) {
            return '';
        }
    };

    const candidateOrigins = () => {
        const list = [];
        const seen = new Set();
        addCandidate(list, seen, storage.get());

        const location = window.location;
        if (!location) return list;
        addCandidate(list, seen, location.origin);
        if (!isLocalPage()) return list;

        const params = new URLSearchParams(location.search || '');
        const requestedPorts = [params.get('ragPort'), params.get('rag_port'), params.get('port')]
            .map(Number)
            .filter(port => Number.isInteger(port) && port > 0 && port < 65536);
        const hosts = [location.hostname, '127.0.0.1', 'localhost']
            .filter((host, index, values) => host && values.indexOf(host) === index);
        const ports = [...requestedPorts];
        const currentPort = Number(location.port);
        if (Number.isInteger(currentPort) && currentPort > 0) ports.push(currentPort);
        ports.push(FIRST_RUNTIME_PORT);
        for (let port = FIRST_LEGACY_PORT; port <= LAST_LEGACY_PORT; port += 1) ports.push(port);
        for (let port = FIRST_RUNTIME_PORT; port <= LAST_RUNTIME_PORT; port += 1) ports.push(port);

        for (const port of [...new Set(ports)]) {
            for (const host of hosts) {
                addCandidate(list, seen, `http://${host}:${port}`);
            }
        }
        return list;
    };

    const probe = async origin => {
        const controller = typeof AbortController === 'function' ? new AbortController() : null;
        const timeout = window.setTimeout?.(() => controller?.abort(), 900);
        try {
            const response = await nativeFetch(`${origin}${HEALTH_PATH}?probe=1&t=${Date.now()}`, {
                method: 'GET',
                cache: 'no-store',
                headers: { Accept: 'application/json' },
                signal: controller?.signal
            });
            if (!response.ok) return false;
            const payload = await response.json();
            return payload?.ok === true && payload?.server === 'athar-rag-v2';
        } catch (_) {
            return false;
        } finally {
            if (timeout) window.clearTimeout?.(timeout);
        }
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

    const announce = (eventName, detail = {}) => {
        if (typeof window.dispatchEvent !== 'function' || typeof CustomEvent !== 'function') return;
        window.dispatchEvent(new CustomEvent(eventName, { detail }));
    };

    const reset = () => {
        activeOrigin = '';
        discoveryPromise = null;
        storage.set('');
    };

    const discover = async (force = false, excludedOrigin = '') => {
        if (!isLocalPage()) return window.location?.origin || '';
        if (!force && activeOrigin) return activeOrigin;
        if (!force && discoveryPromise) return discoveryPromise;

        discoveryPromise = (async () => {
            const runtimeOrigin = await readRuntimeOrigin();
            if (runtimeOrigin && runtimeOrigin !== excludedOrigin && await probe(runtimeOrigin)) {
                activeOrigin = runtimeOrigin;
                storage.set(runtimeOrigin);
                announce('athar-rag-api-connected', { origin: runtimeOrigin, source: 'runtime' });
                return runtimeOrigin;
            }

            const candidates = candidateOrigins().filter(origin => origin !== excludedOrigin && origin !== runtimeOrigin);
            const discovered = await probeCandidates(candidates);
            if (discovered) {
                activeOrigin = discovered;
                storage.set(discovered);
                announce('athar-rag-api-connected', { origin: discovered, source: 'scan' });
                return discovered;
            }

            activeOrigin = '';
            storage.set('');
            announce('athar-rag-api-unavailable', { reason: 'no-local-server' });
            return '';
        })();

        try {
            return await discoveryPromise;
        } finally {
            discoveryPromise = null;
        }
    };

    const rewriteInput = (input, origin) => {
        const url = toUrl(input);
        if (!url) return input;
        const target = `${origin}${url.pathname}${url.search}${url.hash}`;
        if (typeof Request === 'function' && input instanceof Request) {
            return new Request(target, input);
        }
        return target;
    };

    const unavailableResponse = () => new Response(JSON.stringify({
        ok: false,
        error: 'Le serveur RAG local n’est pas démarré. Lancez start-athar-rag.bat.'
    }), {
        status: 503,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'no-store',
            'X-Athar-RAG-Bridge': 'unavailable'
        }
    });

    window.fetch = async function atharFetch(input, init) {
        const url = toUrl(input);
        if (!url || !url.pathname.startsWith(API_PREFIX) || !isLocalPage()) {
            return nativeFetch(input, init);
        }

        let origin = await discover(false);
        if (!origin) return unavailableResponse();

        try {
            let response = await nativeFetch(rewriteInput(input, origin), init);
            if (response.status !== 404 && response.status !== 405) return response;

            reset();
            const replacement = await discover(true, origin);
            if (!replacement) return unavailableResponse();
            response = await nativeFetch(rewriteInput(input, replacement), init);
            return response;
        } catch (error) {
            reset();
            const replacement = await discover(true, origin);
            if (!replacement) return unavailableResponse();
            return nativeFetch(rewriteInput(input, replacement), init);
        }
    };

    window.AtharRagApiBridge = {
        discover,
        reset,
        getBase: () => activeOrigin,
        candidateOrigins,
        readRuntimeOrigin,
        probeCandidates,
        nativeFetch
    };

    window.setTimeout?.(() => discover(false).catch(() => {}), 0);
})();
