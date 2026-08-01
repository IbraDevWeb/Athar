// Athar Pro — branchement léger des modules éditoriaux dans ToolView.
(() => {
    if (!window.Vue || typeof window.Vue.createApp !== 'function') return;

    const PATCH_FLAG = Symbol.for('athar.tool-view.extensions.patched');
    const originalCreateApp = window.Vue.createApp;

    const patchToolView = (toolView) => {
        if (!toolView || toolView[PATCH_FLAG]) return toolView;
        if (!window.AncientSkyView || !window.HistoryNightsView || !window.ScriptoriumView || !window.RootTreeView) return toolView;

        const anchor = `<scholar-atlas-module v-if="currentTool === 'scholars_map'" :settings="settings"></scholar-atlas-module>\n    <div v-else`;
        const replacement = `<root-tree-view v-if="currentTool === 'roots'" :settings="settings"></root-tree-view>\n    <scriptorium-view v-else-if="currentTool === 'scriptorium'" :settings="settings"></scriptorium-view>\n    <history-nights-view v-else-if="currentTool === 'history_nights'" :settings="settings"></history-nights-view>\n    <ancient-sky-view v-else-if="currentTool === 'astronomy'" :settings="settings"></ancient-sky-view>\n    <scholar-atlas-module v-else-if="currentTool === 'scholars_map'" :settings="settings"></scholar-atlas-module>\n    <div v-else`;

        if (typeof toolView.template !== 'string' || !toolView.template.includes(anchor)) {
            console.warn('[Athar] Le point d’intégration des modules éditoriaux dans ToolView est introuvable.');
            return toolView;
        }

        toolView.components = {
            ...(toolView.components || {}),
            'ancient-sky-view': window.AncientSkyView,
            'history-nights-view': window.HistoryNightsView,
            'scriptorium-view': window.ScriptoriumView,
            'root-tree-view': window.RootTreeView
        };
        toolView.template = toolView.template.replace(anchor, replacement);
        toolView[PATCH_FLAG] = true;
        return toolView;
    };

    window.Vue.createApp = function createAtharAppWithEditorialTools(rootComponent, ...args) {
        const components = rootComponent?.components;
        if (components?.['tool-view']) patchToolView(components['tool-view']);
        return originalCreateApp.call(this, rootComponent, ...args);
    };

    window.AtharToolExtensions = { patchToolView };
    window.AtharAstronomy = window.AtharToolExtensions;
})();
