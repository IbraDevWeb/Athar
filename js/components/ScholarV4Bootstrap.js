// Athar Research V5 — branchement racine autonome
(() => {
    const RAG_RESILIENCE_VERSION = 'athar-rag-fetch-resilience-1';
    const RAG_ORIGIN = 'https://athar-rag-ibradevweb.onrender.com';
    const RETRYABLE_PATHS = new Set([
        '/healthz',
        '/api/rag/v4/status',
        '/api/rag/v5/status',
        '/api/rag/v4/books',
        '/api/rag/v5/books'
    ]);
    const RETRYABLE_STATUSES = new Set([408, 425, 429, 500, 502, 503, 504]);
    const DEFAULT_RETRY_DELAYS_MS = [500, 1000, 2000, 4000, 6000, 8000, 10000, 12000, 14000];

    const installRagFetchResilience = () => {
        if (window.AtharRagFetchResilience?.installed) return window.AtharRagFetchResilience;
        if (typeof window.fetch !== 'function') return null;

        const nativeFetch = window.fetch.bind(window);
        const abortError = () => {
            try { return new DOMException('The operation was aborted.', 'AbortError'); }
            catch (_) { const error = new Error('The operation was aborted.'); error.name = 'AbortError'; return error; }
        };
        const requestUrl = input => {
            try {
                const raw = typeof input === 'string' || input instanceof URL ? input : input?.url;
                return new URL(String(raw || ''), window.location?.href || 'https://ibradevweb.github.io/Athar/');
            } catch (_) { return null; }
        };
        const requestMethod = (input, options = {}) => String(options?.method || input?.method || 'GET').toUpperCase();
        const requestSignal = (input, options = {}) => options?.signal || input?.signal || null;
        const shouldRetryRequest = (input, options = {}) => {
            const url = requestUrl(input);
            return Boolean(url && url.origin === RAG_ORIGIN && requestMethod(input, options) === 'GET' && RETRYABLE_PATHS.has(url.pathname));
        };
        const isNetworkFailure = error => error?.name === 'TypeError'
            || /failed to fetch|networkerror|network request failed|load failed/i.test(String(error?.message || ''));
        const retryDelays = () => {
            const override = window.__ATHAR_RAG_RETRY_DELAYS_MS__;
            return Array.isArray(override)
                ? override.map(value => Math.max(0, Number(value) || 0)).slice(0, 20)
                : DEFAULT_RETRY_DELAYS_MS;
        };
        const wait = (ms, signal) => new Promise((resolve, reject) => {
            if (signal?.aborted) { reject(abortError()); return; }
            let settled = false;
            const finish = callback => value => {
                if (settled) return;
                settled = true;
                if (signal) signal.removeEventListener('abort', onAbort);
                callback(value);
            };
            const onResolve = finish(resolve);
            const onReject = finish(reject);
            const timer = window.setTimeout(() => onResolve(), ms);
            const onAbort = () => {
                window.clearTimeout(timer);
                onReject(abortError());
            };
            if (signal) signal.addEventListener('abort', onAbort, { once: true });
        });

        const resilientFetch = async (input, options = {}) => {
            if (!shouldRetryRequest(input, options)) return nativeFetch(input, options);

            const signal = requestSignal(input, options);
            const delays = retryDelays();
            let lastError = null;
            let lastResponse = null;

            for (let attempt = 0; attempt <= delays.length; attempt += 1) {
                if (signal?.aborted) throw abortError();
                try {
                    const response = await nativeFetch(input, options);
                    if (!RETRYABLE_STATUSES.has(Number(response?.status || 0))) return response;
                    lastResponse = response;
                    lastError = null;
                } catch (error) {
                    if (signal?.aborted || error?.name === 'AbortError') throw error;
                    if (!isNetworkFailure(error)) throw error;
                    lastError = error;
                    lastResponse = null;
                }

                if (attempt >= delays.length) break;
                try {
                    window.dispatchEvent?.(new CustomEvent('athar:rag-retry', {
                        detail: { attempt: attempt + 1, delay_ms: delays[attempt], path: requestUrl(input)?.pathname || '' }
                    }));
                } catch (_) {}
                await wait(delays[attempt], signal);
            }

            if (lastResponse) return lastResponse;
            throw lastError || new TypeError('Failed to fetch');
        };

        window.fetch = resilientFetch;
        window.AtharRagFetchResilience = Object.freeze({
            installed: true,
            version: RAG_RESILIENCE_VERSION,
            origin: RAG_ORIGIN,
            retryablePaths: [...RETRYABLE_PATHS],
            shouldRetryRequest,
            nativeFetch
        });
        return window.AtharRagFetchResilience;
    };

    installRagFetchResilience();

    if (!window.Vue || typeof window.Vue.createApp !== 'function') return;

    const PATCH_FLAG = Symbol.for('athar.research.v5.root.patched');
    const HOME_PATCH_FLAG = Symbol.for('athar.research.v5.home.patched');
    const originalCreateApp = window.Vue.createApp;

    const ensureTranslationStyles = () => {
        if (document.getElementById('athar-research-translation-styles')) return;
        const link = document.createElement('link');
        link.id = 'athar-research-translation-styles';
        link.rel = 'stylesheet';
        link.href = 'css/athar-research-translation.css?v=athar-translation-ui-1';
        document.head.appendChild(link);
    };

    const ensureNewToolFullscreen = () => {
        if (!document.getElementById('athar-new-tools-fullscreen-styles')) {
            const link = document.createElement('link');
            link.id = 'athar-new-tools-fullscreen-styles';
            link.rel = 'stylesheet';
            link.href = 'css/new-tools-fullscreen.css?v=athar-pro-v37';
            document.head.appendChild(link);
        }
        if (!document.getElementById('athar-new-tools-fullscreen-script')) {
            const script = document.createElement('script');
            script.id = 'athar-new-tools-fullscreen-script';
            script.src = 'js/new-tools-fullscreen.js?v=athar-pro-v37';
            script.defer = true;
            document.head.appendChild(script);
        }
    };

    ensureTranslationStyles();
    ensureNewToolFullscreen();

    const navMarkup = `
        <div data-athar-research-v5-nav-group class="space-y-1">
            <button
                type="button"
                data-athar-research-v5-nav
                @click="setView('rag_v5'); mobileMenuOpen=false"
                :class="['ar5-nav-entry w-full text-left px-3 py-3 rounded-xl flex items-center gap-3 transition-all duration-200', (viewMode === 'rag_v5' || viewMode === 'rag_v4') ? 'is-active' : '']"
            >
                <span class="ar5-nav-mark"><i data-lucide="scan-search"></i></span>
                <span class="ar5-nav-copy"><small>Moteur documentaire</small><strong>Athar Research</strong></span>
                <span class="ar5-nav-version">V5</span>
            </button>
            <button
                type="button"
                data-athar-library-reader-nav
                onclick="window.location.href='research-library.html'"
                class="ar5-nav-entry w-full text-left px-3 py-3 rounded-xl flex items-center gap-3 transition-all duration-200"
            >
                <span class="ar5-nav-mark"><i data-lucide="library-big"></i></span>
                <span class="ar5-nav-copy"><small>Lecture directe</small><strong>Bibliothèque intégrale</strong></span>
                <span class="ar5-nav-version">LIRE</span>
            </button>
        </div>
    `;

    const homeFeatureMarkup = `
        <section class="ar5-home-pillar" aria-label="Athar Research">
            <div class="ar5-home-pillar-inner">
                <div class="ar5-home-copy">
                    <div>
                        <span class="ar5-home-label"><i data-lucide="scan-search"></i>Athar Research · Bibliothèque Savante</span>
                        <h2>Interroger les ouvrages,<br><em>ou les lire directement.</em></h2>
                        <p>Un espace documentaire séparé de l’encyclopédie classique : recherche multilingue, ciblage d’ouvrage, lecture directe du corpus et passages traçables vers leurs sources.</p>
                    </div>
                    <div class="ar5-home-actions">
                        <button type="button" @click="setView('rag_v5')">Interroger Athar Research <i data-lucide="arrow-up-right"></i></button>
                        <button type="button" onclick="window.location.href='research-library.html'"><i data-lucide="library-big"></i> Parcourir les ouvrages</button>
                        <button type="button" @click="setView('library')"><i data-lucide="users-round"></i> Bibliothèque des Compagnons</button>
                    </div>
                </div>
                <aside class="ar5-home-side">
                    <span>Architecture actuelle</span>
                    <strong>Preuves avant conclusion</strong>
                    <dl>
                        <div><dt>Moteur</dt><dd>RAG V5</dd></div>
                        <div><dt>Corpus</dt><dd>Ouvrages indexés</dd></div>
                        <div><dt>Accès</dt><dd>Recherche + lecture</dd></div>
                    </dl>
                </aside>
            </div>
        </section>
    `;

    const collectTemplateScopes = root => {
        if (!root) return [];
        const scopes = [root];
        const seen = new Set(scopes);
        const visit = scope => {
            const templates = [...(scope.querySelectorAll?.('template') || [])];
            templates.forEach(template => {
                const fragment = template.content;
                if (!fragment || seen.has(fragment)) return;
                seen.add(fragment);
                scopes.push(fragment);
                visit(fragment);
            });
        };
        visit(root);
        return scopes;
    };

    const findAcrossScopes = (host, selector) => {
        for (const scope of collectTemplateScopes(host)) {
            const match = scope.querySelector?.(selector);
            if (match) return match;
        }
        return null;
    };

    const expressionTargetsHome = expression => {
        const compact = String(expression || '').replace(/\s+/g, '');
        return compact.includes("viewMode==='home'") || compact.includes('viewMode==="home"');
    };

    const findHomeRoute = host => {
        for (const scope of collectTemplateScopes(host)) {
            const candidates = [...(scope.querySelectorAll?.('[v-if], [v-else-if]') || [])];
            const match = candidates.find(element => {
                const expression = element.getAttribute('v-if') || element.getAttribute('v-else-if') || '';
                return expressionTargetsHome(expression) || Boolean(element.querySelector?.('home-view'));
            });
            if (match) return match;
        }
        return null;
    };

    const injectNavigation = host => {
        for (const scope of collectTemplateScopes(host)) {
            const homeButtons = [...(scope.querySelectorAll?.('button') || [])].filter(button => {
                const click = button.getAttribute('@click') || '';
                return click.includes("setView('home')");
            });
            homeButtons.forEach(button => {
                const previous = button.previousElementSibling;
                if (!previous?.matches?.('[data-athar-research-v5-nav-group]')) button.insertAdjacentHTML('beforebegin', navMarkup);
            });
        }
    };

    const patchHomeView = rootComponent => {
        const homeView = rootComponent?.components?.['home-view'];
        if (!homeView || homeView[HOME_PATCH_FLAG] || typeof homeView.template !== 'string') return;
        const anchor = '<div class="ap-home-wrap max-w-[1180px] mx-auto">';
        if (homeView.template.includes(anchor)) homeView.template = homeView.template.replace(anchor, `${anchor}${homeFeatureMarkup}`);
        homeView[HOME_PATCH_FLAG] = true;
    };

    const patchDomTemplate = target => {
        const host = typeof target === 'string' ? document.querySelector(target) : (target || document.getElementById('app'));
        if (!host) return false;
        if (host.dataset.atharResearchV5Patched === 'true') return true;

        const oldRoute = findAcrossScopes(host, '[data-athar-scholar-v4-route]');
        if (oldRoute) oldRoute.remove();

        let route = findAcrossScopes(host, '[data-athar-research-v5-route]');
        if (!route) {
            const homeRoute = findHomeRoute(host);
            if (!homeRoute) return false;
            homeRoute.removeAttribute('v-if');
            homeRoute.setAttribute('v-else-if', "viewMode === 'home'");
            homeRoute.insertAdjacentHTML(
                'beforebegin',
                `<div v-if="viewMode === 'rag_v5' || viewMode === 'rag_v4'" class="h-full" key="rag-v5" data-athar-research-v5-route>
                    <scholar-library-v4-view :settings="settings" :set-view="setView"></scholar-library-v4-view>
                </div>`
            );
            route = homeRoute.previousElementSibling;
        }
        if (!route?.querySelector?.('scholar-library-v4-view')) return false;
        injectNavigation(host);
        host.dataset.atharResearchV5Patched = 'true';
        return true;
    };

    window.Vue.createApp = function createAtharAppWithResearchV5(rootComponent, ...args) {
        if (rootComponent && !rootComponent[PATCH_FLAG] && window.ScholarLibraryV4View) {
            rootComponent.components = {
                ...(rootComponent.components || {}),
                'scholar-library-v4-view': window.ScholarLibraryV4View
            };
            patchHomeView(rootComponent);
            rootComponent[PATCH_FLAG] = true;
        }
        const app = originalCreateApp.call(this, rootComponent, ...args);
        if (!app || typeof app.mount !== 'function') return app;
        const originalMount = app.mount.bind(app);
        app.mount = (target, ...mountArgs) => {
            if (!patchDomTemplate(target)) console.error('[Athar Research V5] La route n’a pas pu être injectée.');
            return originalMount(target, ...mountArgs);
        };
        return app;
    };

    window.AtharResearchV5 = { patchDomTemplate, patchHomeView, findHomeRoute, collectTemplateScopes, findAcrossScopes };
})();
