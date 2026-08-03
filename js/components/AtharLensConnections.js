// Athar Pro — navigation directe des connexions suggérées par Athar Lens.
(() => {
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

    const prepare = route => {
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
        prepare(route);
        window.AtharLens?.close?.();
        window.dispatchEvent(new CustomEvent('athar:navigate', { detail: route }));
    }, true);

    window.AtharLensConnections = Object.freeze({ routeFromUid });
})();
