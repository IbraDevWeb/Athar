// Athar Pro — branchement racine de la Bibliothèque Savante V2
(() => {
    if (!window.Vue || typeof window.Vue.createApp !== 'function') return;

    const PATCH_FLAG = Symbol.for('athar.scholar.v2.root.patched');
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
            patchDomTemplate();
            rootComponent[PATCH_FLAG] = true;
        }
        return originalCreateApp.call(this, rootComponent, ...args);
    };

    window.AtharScholarV2 = { patchDomTemplate };
})();
