#!/usr/bin/env node

const fs = require('fs');
const vm = require('vm');

const read = path => fs.readFileSync(path, 'utf8');
const fail = message => {
    console.error(`Root Tree validation failed: ${message}`);
    process.exit(1);
};
const requireToken = (source, token, label) => {
    if (!source.includes(token)) fail(`${label} is missing: ${token}`);
};

const context = { window: {} };
vm.createContext(context);
vm.runInContext(read('roots_data.js'), context, { filename: 'roots_data.js' });
const data = context.window.ROOT_TREE_DATA;
if (!data) fail('ROOT_TREE_DATA was not exposed.');
if (!data.meta || !String(data.meta.editorialNote || '').trim()) fail('Editorial methodology is missing.');
if (!Array.isArray(data.roots) || data.roots.length !== 10) fail('Exactly ten launch roots are required.');
if (!Array.isArray(data.guides) || data.guides.length !== 3) fail('Exactly three guided paths are required.');
if (!Array.isArray(data.glossary) || data.glossary.length < 4) fail('The morphology glossary is incomplete.');

const rootIds = new Set();
const derivativeIds = new Set();
for (const root of data.roots) {
    if (!root.id || rootIds.has(root.id)) fail(`Invalid or duplicate root id: ${root.id}`);
    rootIds.add(root.id);
    if (!Array.isArray(root.letters) || root.letters.length !== 3) fail(`${root.id} must expose exactly three root letters.`);
    for (const field of ['root', 'transliteration', 'title', 'category', 'core', 'nuance', 'memory', 'sourceUrl']) {
        if (!String(root[field] || '').trim()) fail(`${root.id} is missing ${field}.`);
    }
    if (!/^https:\/\/corpus\.quran\.com\//.test(root.sourceUrl)) fail(`${root.id} uses an unsupported source domain.`);
    if (!Array.isArray(root.derivatives) || root.derivatives.length !== 5) fail(`${root.id} must contain five derivatives.`);
    if (!Array.isArray(root.verses) || root.verses.length !== 3) fail(`${root.id} must contain three Quran examples.`);
    for (const derivative of root.derivatives) {
        if (!derivative.id || derivativeIds.has(derivative.id)) fail(`Invalid or duplicate derivative id: ${derivative.id}`);
        derivativeIds.add(derivative.id);
        for (const field of ['word', 'transliteration', 'label', 'form', 'note']) {
            if (!String(derivative[field] || '').trim()) fail(`${derivative.id} is missing ${field}.`);
        }
    }
    for (const verse of root.verses) {
        for (const field of ['reference', 'arabic', 'translation', 'focus']) {
            if (!String(verse[field] || '').trim()) fail(`${root.id} contains an incomplete Quran example.`);
        }
    }
}

for (const guide of data.guides) {
    if (!Array.isArray(guide.steps) || guide.steps.length !== 3) fail(`${guide.id} must contain three steps.`);
    guide.steps.forEach(step => {
        if (!rootIds.has(step.rootId)) fail(`${guide.id} points to unknown root ${step.rootId}.`);
        if (!derivativeIds.has(step.derivativeId)) fail(`${guide.id} points to unknown derivative ${step.derivativeId}.`);
    });
}

const component = read('js/components/RootTreeView.js');
[
    'rt7-workspace', 'rt7-tree-stage', 'rt7-inspector', 'rt7-guide-reader',
    'athar_root_tree_v1', 'athar-root-tree-active', 'filteredRoots', 'selectedDerivative',
    'startGuide', 'goGuideStep', 'showMethod', 'onBeforeUnmount',
    '@click="selectRoot(root.id)"', '@click="selectDerivative(item.id)"',
    '@click.self="showMethod = false"', 'localStorage.setItem'
].forEach(token => requireToken(component, token, 'RootTreeView'));
if (/<canvas\b|<iframe|fetch\s*\(|new\s+Audio\s*\(/i.test(component)) {
    fail('The root explorer must remain a lightweight local Vue/CSS module.');
}

const css = read('css/root-tree.css');
[
    '.rt7-shell', '.rt7-toolbar', '.rt7-root-rail', '.rt7-tree-canvas', '.rt7-branch',
    '.rt7-inspector', '.rt7-guide-reader', '.rt7-overlay',
    'html.athar-root-tree-active .athar-mobile-dock',
    'html.athar-app-fullscreen .rt7-shell', '@media (max-width: 760px)',
    '@media (max-width: 430px)', 'prefers-reduced-motion', 'touch-action: manipulation'
].forEach(token => requireToken(css, token, 'Root Tree CSS'));
const openCss = (css.match(/{/g) || []).length;
const closeCss = (css.match(/}/g) || []).length;
if (openCss !== closeCss) fail(`Unbalanced CSS braces: ${openCss} opening / ${closeCss} closing.`);

const bridge = read('js/components/AstronomyBootstrap.js');
[
    "'root-tree-view': window.RootTreeView",
    "currentTool === 'roots'",
    "currentTool === 'scriptorium'",
    "currentTool === 'history_nights'",
    "currentTool === 'astronomy'",
    "currentTool === 'scholars_map'",
    'window.Vue.createApp',
    'PATCH_FLAG'
].forEach(token => requireToken(bridge, token, 'Tool extensions bootstrap'));

const toolView = read('js/components/ToolView.js');
const toolAnchor = `<scholar-atlas-module v-if="currentTool === 'scholars_map'" :settings="settings"></scholar-atlas-module>\n    <div v-else`;
requireToken(toolView, toolAnchor, 'ToolView integration anchor');

const bridgeContext = {
    console,
    window: {
        AncientSkyView: { name: 'AncientSkyView' },
        HistoryNightsView: { name: 'HistoryNightsView' },
        ScriptoriumView: { name: 'ScriptoriumView' },
        RootTreeView: { name: 'RootTreeView' },
        Vue: { createApp: root => root }
    }
};
vm.createContext(bridgeContext);
vm.runInContext(bridge, bridgeContext, { filename: 'AstronomyBootstrap.js' });
const fakeToolView = { components: {}, template: toolAnchor };
bridgeContext.window.Vue.createApp({ components: { 'tool-view': fakeToolView } });
if (!fakeToolView.components['root-tree-view']) fail('RootTreeView was not registered in ToolView.');
if (!fakeToolView.template.includes(`currentTool === 'roots'`)) fail('The roots route was not inserted in ToolView.');
if (!fakeToolView.template.includes(`currentTool === 'scriptorium'`)) fail('Scriptorium routing was not preserved.');

const config = read('js/config.js');
[
    "const APP_VERSION = 'athar-pro-v31'",
    "writeEarlyScript('roots_data.js'",
    "writeEarlyScript('js/components/RootTreeView.js'",
    "writeEarlyScript('js/components/AstronomyBootstrap.js'",
    'css/root-tree.css?v=${APP_VERSION}'
].forEach(token => requireToken(config, token, 'config.js'));

const worker = read('service-worker.js');
[
    "const CACHE_VERSION = 'athar-pro-v31'",
    './roots_data.js?v=athar-pro-v31',
    './js/components/RootTreeView.js?v=athar-pro-v31',
    './js/components/AstronomyBootstrap.js?v=athar-pro-v31',
    './css/root-tree.css?v=athar-pro-v31'
].forEach(token => requireToken(worker, token, 'service worker'));

const extensionData = read('extensions_data.js');
requireToken(extensionData, 'Explorateur visuel des racines arabes', 'Root Tree extension metadata');

console.log(`Root Tree validated: ${data.roots.length} roots, ${derivativeIds.size} derivatives, ${data.guides.length} guides and cache v31.`);
