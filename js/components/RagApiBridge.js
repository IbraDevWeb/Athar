// Athar Pro — pont local entre l'interface statique et le serveur RAG V2.
(() => {
    if (!window.fetch || window.AtharRagApiBridge) return;

    const nativeFetch = window.fetch.bind(window);
    const API_PREFIX = '/api/rag/';
    const HEALTH_PATH = '/api/rag/v2/status';
    const STORAGE_KEY = 'athar_rag_api_origin_v1';
    const LOCAL_HOSTS = new Set(['127.0.0.1', 'localhost', '::1', '[::1]']);
    const FIRST_PORT = 8000;
    const LAST_PORT = 8010;

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

    const addCandidate = (list, seen, origin) => {
        if (!origin || seen.has(origin)) return;
        seen.add(origin);
        list.push(origin.replace(/\/$/, ''));
    };

    const candidateOrigins = () => {
        const list = [];
        const seen = new Set();
        const cached = storage.get();
        addCandidate(list, seen, cached);

        const location = window.location;
        if (!location) return list;
        addCandidate(list, seen, location.origin);
        if (!isLocalPage()) return list;

        const params = new URLSearchParams(location.search || '');
        const requestedPort = Number(params.get('ragPort'));
        const hosts = [location.hostname, '127.0.0.1', 'localhost']
            .filter((host, index, values) => host && values.indexOf(host) === index);
        const ports = [];
        if (Number.isInteger(requestedPort) && requestedPort > 0 && requestedPort < 65536) ports.push(requestedPort);
        const currentPort = Number(location.port);
        if (Number.isInteger(currentPort) && currentPort > 0) ports.push(currentPort);
        for (let port = FIRST_PORT; port <= LAST_PORT; port += 1) ports.push(port);

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
            const response = await nativeFetch(`${origin}${HEALTH_PATH}?probe=1`, {
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

    const announce = origin => {
        if (typeof window.dispatchEvent !== 'function' || typeof CustomEvent !== 'function') return;
        window.dispatchEvent(new CustomEvent('athar-rag-api-connected', { detail: { origin } }));
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
            for (const origin of candidateOrigins()) {
                if (origin === excludedOrigin) continue;
                if (await probe(origin)) {
                    activeOrigin = origin;
                    storage.set(origin);
                    announce(origin);
                    return origin;
                }
            }
            activeOrigin = '';
            storage.set('');
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

    window.fetch = async function atharFetch(input, init) {
        const url = toUrl(input);
        if (!url || !url.pathname.startsWith(API_PREFIX) || !isLocalPage()) {
            return nativeFetch(input, init);
        }

        let origin = await discover(false);
        if (!origin) return nativeFetch(input, init);

        try {
            let response = await nativeFetch(rewriteInput(input, origin), init);
            if (response.status !== 404 && response.status !== 405) return response;

            reset();
            const replacement = await discover(true, origin);
            if (!replacement) return response;
            response = await nativeFetch(rewriteInput(input, replacement), init);
            return response;
        } catch (error) {
            reset();
            const replacement = await discover(true, origin);
            if (!replacement) throw error;
            return nativeFetch(rewriteInput(input, replacement), init);
        }
    };

    window.AtharRagApiBridge = {
        discover,
        reset,
        getBase: () => activeOrigin,
        candidateOrigins,
        nativeFetch
    };

    window.setTimeout?.(() => discover(false).catch(() => {}), 0);
})();
