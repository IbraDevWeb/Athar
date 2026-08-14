// Athar — branchement racine de la Bibliothèque Savante V4
(() => {
    if (!window.Vue || typeof window.Vue.createApp !== 'function') return;

    const PATCH_FLAG = Symbol.for('athar.scholar.v4.root.patched');
    const HOME_PATCH_FLAG = Symbol.for('athar.scholar.v4.home.patched');
    const originalCreateApp = window.Vue.createApp;

    const navMarkup = `
        <button
            type="button"
            data-athar-scholar-v4-nav
            @click="setView('rag_v4'); mobileMenuOpen=false"
            :class="['sv2-nav-entry w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition-all duration-200', viewMode === 'rag_v4' ? 'is-active' : '']"
        >
            <span class="sv2-nav-mark"><i data-lucide="book-open-check" class="w-4 h-4"></i></span>
            <span class="sv2-nav-copy"><small>Pièce maîtresse</small><strong>Bibliothèque Savante</strong></span>
            <span class="sv2-nav-v2">V4</span>
        </button>
    `;

    const homeFeatureMarkup = `
        <section class="sv2-home-pillar" aria-label="Bibliothèque Savante Athar">
            <div class="sv2-home-grid">
                <div class="sv2-home-main">
                    <div>
                        <span class="sv2-home-badge"><i data-lucide="book-open-check"></i>Bibliothèque Savante · V4</span>
                        <h2>Retrouver les textes, <span>ouvrir les preuves.</span></h2>
                        <p>La nouvelle bibliothèque interroge directement le corpus hébergé, détecte l’ouvrage demandé et affiche les passages pertinents sans faux résultat de secours.</p>
                    </div>
                    <div class="sv2-home-actions">
                        <button type="button" @click="setView('rag_v4')">Interroger la bibliothèque <i data-lucide="arrow-right"></i></button>
                        <button type="button" @click="setView('library')"><i data-lucide="users-round"></i> Bibliothèque des Compagnons</button>
                    </div>
                </div>
                <aside class="sv2-home-proof">
                    <div class="sv2-home-proof-head"><span>Principe evidence-first</span><b><i data-lucide="shield-check"></i></b></div>
                    <blockquote>« Si le passage n’est pas retrouvé dans les ouvrages, Athar n’affiche pas une preuve de remplacement. »</blockquote>
                    <dl>
                        <div><dt>Corpus</dt><dd>Réel</dd></div>
                        <div><dt>Recherche</dt><dd>Traçable</dd></div>
                        <div><dt>Échec</dt><dd>Explicite</dd></div>
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
                if (!previous?.matches?.('[data-athar-scholar-v4-nav]')) button.insertAdjacentHTML('beforebegin', navMarkup);
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
        if (host.dataset.atharScholarV4Patched === 'true') return true;

        let route = findAcrossScopes(host, '[data-athar-scholar-v4-route]');
        if (!route) {
            const homeRoute = findHomeRoute(host);
            if (!homeRoute) return false;
            homeRoute.removeAttribute('v-if');
            homeRoute.setAttribute('v-else-if', "viewMode === 'home'");
            homeRoute.insertAdjacentHTML(
                'beforebegin',
                `<div v-if="viewMode === 'rag_v4'" class="h-full" key="rag-v4" data-athar-scholar-v4-route>
                    <scholar-library-v4-view :settings="settings" :set-view="setView"></scholar-library-v4-view>
                </div>`
            );
            route = homeRoute.previousElementSibling;
        }
        if (!route?.querySelector?.('scholar-library-v4-view')) return false;
        injectNavigation(host);
        host.dataset.atharScholarV4Patched = 'true';
        return true;
    };

    window.Vue.createApp = function createAtharAppWithScholarV4(rootComponent, ...args) {
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
            if (!patchDomTemplate(target)) console.error('[Athar V4] La route de la Bibliothèque Savante n’a pas pu être injectée.');
            return originalMount(target, ...mountArgs);
        };
        return app;
    };

    window.AtharScholarV4 = { patchDomTemplate, patchHomeView, findHomeRoute, collectTemplateScopes, findAcrossScopes };
})();
