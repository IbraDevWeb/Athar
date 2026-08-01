#!/usr/bin/env node

const fs = require('fs');
const vm = require('vm');

const read = (path) => fs.readFileSync(path, 'utf8');
const fail = (message) => {
    console.error(`Scriptorium validation failed: ${message}`);
    process.exit(1);
};
const requireToken = (source, token, label) => {
    if (!source.includes(token)) fail(`${label} is missing: ${token}`);
};

const context = { window: {} };
vm.createContext(context);
vm.runInContext(read('scriptorium_data.js'), context, { filename: 'scriptorium_data.js' });
const data = context.window.SCRIPTORIUM_DATA;
if (!data) fail('SCRIPTORIUM_DATA was not exposed.');
if (!data.meta || !String(data.meta.editorialNote || '').trim() || !String(data.meta.sourcePolicy || '').trim()) {
    fail('Editorial methodology is incomplete.');
}
if (!Array.isArray(data.folios) || data.folios.length !== 6) fail('Exactly six launch folios are required.');
if (!Array.isArray(data.glossary) || data.glossary.length < 5) fail('The manuscript glossary is incomplete.');
if (!data.workshop || !Array.isArray(data.workshop.scripts) || data.workshop.scripts.length !== 6) {
    fail('The workshop script presets are incomplete.');
}

const ids = new Set();
for (const folio of data.folios) {
    if (!folio.id || ids.has(folio.id)) fail(`Invalid or duplicate folio id: ${folio.id}`);
    ids.add(folio.id);
    for (const field of ['title', 'arabic', 'period', 'region', 'script', 'support', 'format', 'summary', 'insight']) {
        if (!String(folio[field] || '').trim()) fail(`${folio.id} is missing ${field}.`);
    }
    if (!Array.isArray(folio.observations) || folio.observations.length < 4) fail(`${folio.id} needs four observations.`);
    if (!folio.visual || !['portrait', 'landscape'].includes(folio.visual.orientation)) fail(`${folio.id} has an invalid visual format.`);
    if (!Number.isFinite(Number(folio.visual.lineCount)) || Number(folio.visual.lineCount) < 5) fail(`${folio.id} has an invalid line count.`);
    if (!folio.source || !String(folio.source.institution || '').trim() || !String(folio.source.note || '').trim()) {
        fail(`${folio.id} has no institutional source.`);
    }
    if (!/^https:\/\/(www\.metmuseum\.org|essentiels\.bnf\.fr|ccfr\.bnf\.fr)\//.test(String(folio.source.url || ''))) {
        fail(`${folio.id} uses an unsupported source domain.`);
    }
}

const component = read('js/components/ScriptoriumView.js');
[
    'sc7-gallery', 'sc7-workshop', 'sc7-timeline', 'sc7-folio', 'sc7-inspector',
    'athar_scriptorium_v1', 'athar-scriptorium-active', 'selectFolio', 'stepFolio',
    'workshopStyle', 'showMethodology', 'onBeforeUnmount', '@click="setMode(\'workshop\')"',
    '@click.self="showMethodology = false"', 'target="_blank"', 'Reconstitution graphique — non fac-similé'
].forEach((token) => requireToken(component, token, 'ScriptoriumView'));
if (/<canvas\b|<iframe|fetch\s*\(|new\s+Audio\s*\(/i.test(component)) {
    fail('The Scriptorium must remain a lightweight local SVG/CSS-free gallery without remote runtimes.');
}

const css = read('css/scriptorium.css');
[
    '.sc7-shell', '.sc7-header', '.sc7-gallery', '.sc7-folio', '.sc7-workshop',
    '.sc7-timeline', '.sc7-overlay', 'html.athar-scriptorium-active .athar-mobile-dock',
    'html.athar-app-fullscreen .sc7-shell', '@media (max-width: 900px)',
    '@media (max-width: 640px)', 'prefers-reduced-motion', 'touch-action: manipulation'
].forEach((token) => requireToken(css, token, 'Scriptorium CSS'));

const openCss = (css.match(/{/g) || []).length;
const closeCss = (css.match(/}/g) || []).length;
if (openCss !== closeCss) fail(`Unbalanced CSS braces: ${openCss} opening / ${closeCss} closing.`);

const bridge = read('js/components/AstronomyBootstrap.js');
[
    "'scriptorium-view': window.ScriptoriumView",
    "currentTool === 'scriptorium'",
    "currentTool === 'history_nights'",
    "currentTool === 'astronomy'",
    "currentTool === 'scholars_map'",
    'window.Vue.createApp',
    'PATCH_FLAG'
].forEach((token) => requireToken(bridge, token, 'Tool extensions bootstrap'));

const toolView = read('js/components/ToolView.js');
const toolAnchor = `<scholar-atlas-module v-if="currentTool === 'scholars_map'" :settings="settings"></scholar-atlas-module>\n    <div v-else`;
requireToken(toolView, toolAnchor, 'ToolView integration anchor');

const bridgeContext = {
    console,
    window: {
        AncientSkyView: { name: 'AncientSkyView' },
        HistoryNightsView: { name: 'HistoryNightsView' },
        ScriptoriumView: { name: 'ScriptoriumView' },
        Vue: { createApp: (root) => root }
    }
};
vm.createContext(bridgeContext);
vm.runInContext(bridge, bridgeContext, { filename: 'AstronomyBootstrap.js' });
const fakeToolView = { components: {}, template: toolAnchor };
bridgeContext.window.Vue.createApp({ components: { 'tool-view': fakeToolView } });
if (!fakeToolView.components['scriptorium-view']) fail('ScriptoriumView was not registered in ToolView.');
if (!fakeToolView.template.includes(`currentTool === 'scriptorium'`)) fail('The scriptorium route was not inserted in ToolView.');
if (!fakeToolView.template.includes(`currentTool === 'history_nights'`)) fail('History Nights routing was not preserved.');
if (!fakeToolView.template.includes(`currentTool === 'astronomy'`)) fail('Ancient Sky routing was not preserved.');

const config = read('js/config.js');
[
    "const APP_VERSION = 'athar-pro-v30'",
    "writeEarlyScript('scriptorium_data.js'",
    "writeEarlyScript('js/components/ScriptoriumView.js'",
    "writeEarlyScript('js/components/AstronomyBootstrap.js'",
    'css/scriptorium.css?v=${APP_VERSION}'
].forEach((token) => requireToken(config, token, 'config.js'));

const worker = read('service-worker.js');
[
    "const CACHE_VERSION = 'athar-pro-v30'",
    './scriptorium_data.js?v=athar-pro-v30',
    './js/components/ScriptoriumView.js?v=athar-pro-v30',
    './js/components/AstronomyBootstrap.js?v=athar-pro-v30',
    './css/scriptorium.css?v=athar-pro-v30'
].forEach((token) => requireToken(worker, token, 'service worker'));

const extensionData = read('extensions_data.js');
requireToken(extensionData, 'Galerie interactive des écritures, supports et rythmes', 'Scriptorium extension metadata');

console.log(`Scriptorium validated: ${data.folios.length} folios, ${data.glossary.length} glossary terms, workshop and cache v30.`);
