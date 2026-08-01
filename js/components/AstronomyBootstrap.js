// Athar Pro — branchement léger du Ciel des Anciens dans ToolView.
(() => {
    if (!window.Vue || typeof window.Vue.createApp !== 'function') return;

    const PATCH_FLAG = Symbol.for('athar.astronomy.tool-view.patched');
    const originalCreateApp = window.Vue.createApp;

    const patchToolView = (toolView) => {
        if (!toolView || toolView[PATCH_FLAG] || !window.AncientSkyView) return toolView;

        const anchor = `<scholar-atlas-module v-if="currentTool === 'scholars_map'" :settings="settings"></scholar-atlas-module>\n    <div v-else`;
        const replacement = `<ancient-sky-view v-if="currentTool === 'astronomy'" :settings="settings"></ancient-sky-view>\n    <scholar-atlas-module v-else-if="currentTool === 'scholars_map'" :settings="settings"></scholar-atlas-module>\n    <div v-else`;

        if (typeof toolView.template !== 'string' || !toolView.template.includes(anchor)) {
            console.warn('[Athar] Le point d’intégration Astronomy dans ToolView est introuvable.');
            return toolView;
        }

        toolView.components = {
            ...(toolView.components || {}),
            'ancient-sky-view': window.AncientSkyView
        };
        toolView.template = toolView.template.replace(anchor, replacement);
        toolView[PATCH_FLAG] = true;
        return toolView;
    };

    window.Vue.createApp = function createAtharAppWithAstronomy(rootComponent, ...args) {
        const components = rootComponent?.components;
        if (components?.['tool-view']) patchToolView(components['tool-view']);
        return originalCreateApp.call(this, rootComponent, ...args);
    };

    window.AtharAstronomy = { patchToolView };
})();
