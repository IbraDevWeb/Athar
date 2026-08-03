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
})();
