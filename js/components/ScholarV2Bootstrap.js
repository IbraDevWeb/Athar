// Athar Pro — branchement racine de la Bibliothèque Savante V2
(() => {
    if (!window.Vue || typeof window.Vue.createApp !== 'function') return;

    const PATCH_FLAG = Symbol.for('athar.scholar.v2.root.patched');
    const HOME_PATCH_FLAG = Symbol.for('athar.scholar.v2.home.patched');
    const originalCreateApp = window.Vue.createApp;

    const navMarkup = `
        <button
            type="button"
            data-athar-scholar-v2-nav
            @click="setView('rag_v2'); mobileMenuOpen=false"
            :class="['sv2-nav-entry w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition-all duration-200', viewMode === 'rag_v2' ? 'is-active' : '']"
        >
            <span class="sv2-nav-mark"><i data-lucide="book-open-check" class="w-4 h-4"></i></span>
            <span class="sv2-nav-copy"><small>Pièce maîtresse</small><strong>Bibliothèque Savante</strong></span>
            <span class="sv2-nav-v2">V2</span>
        </button>
    `;

    const homeFeatureMarkup = `
        <section class="sv2-home-pillar" aria-label="Les deux bibliothèques principales d’Athar">
            <div class="sv2-home-grid">
                <div class="sv2-home-main">
                    <div>
                        <span class="sv2-home-badge"><i data-lucide="sparkles"></i>Nouvelle pièce maîtresse · V2</span>
                        <h2>Interroger les ouvrages, <span>vérifier chaque réponse.</span></h2>
                        <p>La Bibliothèque Savante analyse la question, retrouve les passages arabes et français, sépare les divergences et relie chaque affirmation à sa preuve exacte.</p>
                    </div>
                    <div class="sv2-home-actions">
                        <button type="button" @click="setView('rag_v2')">Poser une question <i data-lucide="arrow-right"></i></button>
                        <button type="button" @click="setView('library')"><i data-lucide="users-round"></i> Bibliothèque des Compagnons</button>
                    </div>
                </div>
                <aside class="sv2-home-proof">
                    <div class="sv2-home-proof-head"><span>Principe citation-first</span><b><i data-lucide="shield-check"></i></b></div>
                    <blockquote>« Une affirmation religieuse doit pouvoir être ouverte, relue et vérifiée dans son passage source. »</blockquote>
                    <dl>
                        <div><dt>Réponse</dt><dd>Structurée</dd></div>
                        <div><dt>Preuves</dt><dd>Traçables</dd></div>
                        <div><dt>Corpus insuffisant</dt><dd>Refus explicite</dd></div>
                    </dl>
                </aside>
            </div>
            <div class="sv2-home-pillars-note"><i></i>Athar s’organise autour de deux piliers : les ouvrages classiques et l’héritage des Compagnons.</div>
        </section>
    `;

    const patchHomeView = (rootComponent) => {
        const homeView = rootComponent?.components?.['home-view'];
        if (!homeView || homeView[HOME_PATCH_FLAG] || typeof homeView.template !== 'string') return;
        const anchor = '<div class="ap-home-wrap max-w-[1180px] mx-auto">';
        if (!homeView.template.includes(anchor)) {
            console.warn('[Athar V2] Le point d’intégration de l’accueil est introuvable.');
            return;
        }
        homeView.template = homeView.template.replace(anchor, `${anchor}${homeFeatureMarkup}`);
        homeView[HOME_PATCH_FLAG] = true;
    };

    const patchDomTemplate = () => {
        const host = document.getElementById('app');
        if (!host || host.dataset.atharScholarV2Patched === 'true') return false;

        const homeButtons = [...host.querySelectorAll('button')].filter(button => {
            const click = button.getAttribute('@click') || '';
            return click.includes("setView('home')");
        });
        homeButtons.forEach(button => {
            if (!button.parentElement?.querySelector(':scope > [data-athar-scholar-v2-nav]')) {
                button.insertAdjacentHTML('beforebegin', navMarkup);
            }
        });

        const homeView = [...host.querySelectorAll('[v-if]')].find(element => {
            return element.getAttribute('v-if') === "viewMode === 'home'";
        });
        if (!homeView) {
            console.warn('[Athar V2] Le point d’intégration principal est introuvable.');
            return false;
        }

        homeView.removeAttribute('v-if');
        homeView.setAttribute('v-else-if', "viewMode === 'home'");
        homeView.insertAdjacentHTML(
            'beforebegin',
            `<div v-if="viewMode === 'rag_v2'" class="h-full" key="rag-v2">
                <scholar-library-v2-view :settings="settings" :set-view="setView"></scholar-library-v2-view>
            </div>`
        );

        host.dataset.atharScholarV2Patched = 'true';
        return true;
    };

    window.Vue.createApp = function createAtharAppWithScholarV2(rootComponent, ...args) {
        if (rootComponent && !rootComponent[PATCH_FLAG] && window.ScholarLibraryV2View) {
            rootComponent.components = {
                ...(rootComponent.components || {}),
                'scholar-library-v2-view': window.ScholarLibraryV2View
            };
            patchHomeView(rootComponent);
            patchDomTemplate();
            rootComponent[PATCH_FLAG] = true;
        }
        return originalCreateApp.call(this, rootComponent, ...args);
    };

    window.AtharScholarV2 = { patchDomTemplate, patchHomeView };
})();
