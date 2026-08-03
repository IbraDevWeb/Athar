// Athar Pro — pont de navigation contrôlé pour Athar Lens.
(() => {
    if (!window.Vue || typeof window.Vue.createApp !== 'function') return;

    const PATCH_FLAG = Symbol.for('athar.lens.navigation.patched');
    const ROOT_FLAG = Symbol.for('athar.lens.root.patched');
    if (window.Vue.createApp[PATCH_FLAG]) return;

    const originalCreateApp = window.Vue.createApp;

    const readList = value => {
        if (Array.isArray(value)) return value;
        if (Array.isArray(value?.value)) return value.value;
        return [];
    };

    const routeFromUid = uid => {
        const separator = String(uid || '').indexOf(':');
        if (separator < 1) return null;
        const type = uid.slice(0, separator);
        const id = uid.slice(separator + 1);
        const routes = {
            biography: { view: 'library', chapterId: /^\d+$/.test(id) ? Number(id) : id },
            hadith: { view: 'hadiths', hadithId: id },
            root: { view: 'roots', rootId: id },
            chain: { view: 'isnad', chainId: id },
            history: { view: 'history_nights', storyId: id },
            manuscript: { view: 'scriptorium', folioId: id },
            astronomy: { view: 'astronomy', objectId: id },
            scholar: { view: 'transmission', scholarId: /^\d+$/.test(id) ? Number(id) : id },
            glossary: { view: 'glossary', query: id },
            tool: { view: id }
        };
        return routes[type] || null;
    };

    const mergeStorage = (key, patch) => {
        try {
            const current = JSON.parse(localStorage.getItem(key) || '{}');
            localStorage.setItem(key, JSON.stringify({ ...current, ...patch }));
        } catch (_) {}
    };

    const prepareRoute = route => {
        if (route.rootId) mergeStorage('athar_root_tree_v1', { selectedRootId: route.rootId });
        if (route.chainId) mergeStorage('athar_golden_chain_v1', { selectedChainId: route.chainId });
        if (route.folioId) mergeStorage('athar_scriptorium_v1', { selectedId: route.folioId });
        if (route.storyId) mergeStorage('athar_history_nights_v1', { storyId: route.storyId, chapterIndex: 0 });
        try { sessionStorage.setItem('athar_lens_target', JSON.stringify(route)); } catch (_) {}
    };

    document.addEventListener('click', event => {
        const trigger = event.target?.closest?.('#athar-lens [data-action="select-related"]');
        if (!trigger) return;
        const route = routeFromUid(trigger.dataset.uid);
        if (!route) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        prepareRoute(route);
        window.AtharLens?.close?.();
        window.dispatchEvent(new CustomEvent('athar:navigate', { detail: route }));
    }, true);

    window.Vue.createApp = function createAtharAppWithLensNavigation(rootComponent, ...args) {
        if (rootComponent && typeof rootComponent.setup === 'function' && !rootComponent[ROOT_FLAG]) {
            const originalSetup = rootComponent.setup;

            rootComponent.setup = function setupWithLensNavigation(...setupArgs) {
                const exposed = originalSetup.apply(this, setupArgs);

                const handleNavigation = event => {
                    const detail = event?.detail || {};
                    if (!detail || typeof detail !== 'object') return;

                    if (detail.chapterId !== undefined && typeof exposed.openChapter === 'function') {
                        const chapter = readList(exposed.allChapters).find(item => String(item.id) === String(detail.chapterId));
                        if (chapter) {
                            exposed.openChapter(chapter);
                            return;
                        }
                    }

                    if (detail.hadithId !== undefined && typeof exposed.openHadith === 'function') {
                        if (exposed.headerSearchQuery?.value !== undefined) exposed.headerSearchQuery.value = '';
                        const hadith = readList(exposed.filteredHadiths).find(item => String(item.id) === String(detail.hadithId));
                        if (hadith) {
                            exposed.openHadith(hadith);
                            return;
                        }
                    }

                    if (detail.view && typeof exposed.setView === 'function') {
                        exposed.setView(detail.view);
                        if (detail.query && exposed.headerSearchQuery?.value !== undefined) {
                            exposed.headerSearchQuery.value = detail.query;
                        }
                    }
                };

                window.Vue.onMounted(() => window.addEventListener('athar:navigate', handleNavigation));
                window.Vue.onUnmounted(() => window.removeEventListener('athar:navigate', handleNavigation));
                return exposed;
            };

            rootComponent[ROOT_FLAG] = true;
        }

        return originalCreateApp.call(this, rootComponent, ...args);
    };

    window.Vue.createApp[PATCH_FLAG] = true;
    window.AtharLensNavigation = Object.freeze({ routeFromUid, prepareRoute });
})();
