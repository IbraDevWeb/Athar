#!/usr/bin/env node

const fs = require('fs');
const vm = require('vm');

const read = path => fs.readFileSync(path, 'utf8');
const fail = message => {
    console.error(`Golden Chain validation failed: ${message}`);
    process.exit(1);
};
const requireToken = (source, token, label) => {
    if (!source.includes(token)) fail(`${label} is missing: ${token}`);
};

const context = { window: {} };
vm.createContext(context);
vm.runInContext(read('isnad_data.js'), context, { filename: 'isnad_data.js' });
const data = context.window.GOLDEN_CHAIN_DATA;
if (!data) fail('GOLDEN_CHAIN_DATA was not exposed.');
if (!data.meta || !String(data.meta.editorialNote || '').trim() || !String(data.meta.sourcePolicy || '').trim()) {
    fail('Editorial methodology is incomplete.');
}
if (!Array.isArray(data.chains) || data.chains.length !== 5) fail('Exactly five launch chains are required.');
if (!Array.isArray(data.narrators) || data.narrators.length < 17) fail('The narrator corpus is incomplete.');
if (!Array.isArray(data.lessons) || data.lessons.length !== 3) fail('Exactly three guided lessons are required.');
if (!Array.isArray(data.glossary) || data.glossary.length < 5) fail('The isnad glossary is incomplete.');

const narratorIds = new Set();
for (const narrator of data.narrators) {
    if (!narrator.id || narratorIds.has(narrator.id)) fail(`Invalid or duplicate narrator id: ${narrator.id}`);
    narratorIds.add(narrator.id);
    for (const field of ['name', 'arabic', 'dates', 'city', 'generation', 'role', 'monogram', 'summary', 'transmission', 'appraisal']) {
        if (!String(narrator[field] || '').trim()) fail(`${narrator.id} is missing ${field}.`);
    }
}

const chainIds = new Set();
for (const chain of data.chains) {
    if (!chain.id || chainIds.has(chain.id)) fail(`Invalid or duplicate chain id: ${chain.id}`);
    chainIds.add(chain.id);
    for (const field of ['title', 'arabic', 'badge', 'region', 'collection', 'reference', 'summary', 'scholarlyNote', 'color']) {
        if (!String(chain[field] || '').trim()) fail(`${chain.id} is missing ${field}.`);
    }
    if (!/^https:\/\/(www\.)?sunnah\.com\//.test(String(chain.sourceUrl || ''))) {
        fail(`${chain.id} uses an unsupported documentary domain.`);
    }
    if (!Array.isArray(chain.route) || chain.route.length < 4 || chain.route.length > 5) {
        fail(`${chain.id} must contain four or five route nodes.`);
    }
    if (!Array.isArray(chain.linkLabels) || chain.linkLabels.length !== chain.route.length - 1) {
        fail(`${chain.id} has inconsistent link labels.`);
    }
    chain.route.forEach(id => {
        if (!narratorIds.has(id)) fail(`${chain.id} points to unknown narrator ${id}.`);
    });
    if (chain.route.at(-1) !== 'prophet') fail(`${chain.id} must end at the prophetic source.`);
    for (const field of ['theme', 'arabic', 'french', 'note']) {
        if (!String(chain.sample?.[field] || '').trim()) fail(`${chain.id} has an incomplete sample.`);
    }
}

for (const lesson of data.lessons) {
    if (!Array.isArray(lesson.steps) || lesson.steps.length !== 3) fail(`${lesson.id} must contain three steps.`);
    lesson.steps.forEach(step => {
        if (!String(step.title || '').trim() || String(step.text || '').trim().length < 80) {
            fail(`${lesson.id} contains an underdeveloped step.`);
        }
    });
}

const component = read('js/components/GoldenChainView.js');
[
    'gc8-workspace', 'gc8-route', 'gc8-node', 'gc8-inspector', 'gc8-compare-grid',
    'gc8-guide-reader', 'gc8-overlay', 'athar_golden_chain_v1', 'athar-golden-chain-active',
    'selectChain', 'selectNarrator', 'showSample', 'showMethod', 'onBeforeUnmount',
    '@click="selectChain(chain.id)"', '@click="selectNarrator(narrator.id)"',
    '@click.self="showSample = false"', '@click.self="showMethod = false"',
    'localStorage.setItem', 'target="_blank"'
].forEach(token => requireToken(component, token, 'GoldenChainView'));
if (/<canvas\b|<iframe|fetch\s*\(|new\s+Audio\s*\(|THREE\./i.test(component)) {
    fail('The isnad explorer must remain a lightweight local Vue/CSS module.');
}

const css = read('css/golden-chain.css');
[
    '.gc8-shell', '.gc8-chain-rail', '.gc8-stage', '.gc8-route', '.gc8-node',
    '.gc8-inspector', '.gc8-compare-grid', '.gc8-guide-reader', '.gc8-overlay',
    'html.athar-golden-chain-active .athar-mobile-dock',
    'html.athar-app-fullscreen .gc8-shell', '@media (max-width: 640px)',
    '@media (max-width: 420px)', 'prefers-reduced-motion', 'touch-action: manipulation'
].forEach(token => requireToken(css, token, 'Golden Chain CSS'));
const openCss = (css.match(/{/g) || []).length;
const closeCss = (css.match(/}/g) || []).length;
if (openCss !== closeCss) fail(`Unbalanced CSS braces: ${openCss} opening / ${closeCss} closing.`);

const bridge = read('js/components/AstronomyBootstrap.js');
[
    "'golden-chain-view': window.GoldenChainView",
    "currentTool === 'isnad'",
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
        GoldenChainView: { name: 'GoldenChainView' },
        Vue: { createApp: root => root }
    }
};
vm.createContext(bridgeContext);
vm.runInContext(bridge, bridgeContext, { filename: 'AstronomyBootstrap.js' });
const fakeToolView = { components: {}, template: toolAnchor };
bridgeContext.window.Vue.createApp({ components: { 'tool-view': fakeToolView } });
if (!fakeToolView.components['golden-chain-view']) fail('GoldenChainView was not registered in ToolView.');
if (!fakeToolView.template.includes(`currentTool === 'isnad'`)) fail('The isnad route was not inserted in ToolView.');
if (!fakeToolView.template.includes(`currentTool === 'roots'`)) fail('Root Tree routing was not preserved.');

const config = read('js/config.js');
[
    "const APP_VERSION = 'athar-pro-v32'",
    "writeEarlyScript('isnad_data.js'",
    "writeEarlyScript('js/components/GoldenChainView.js'",
    "writeEarlyScript('js/components/AstronomyBootstrap.js'",
    'css/golden-chain.css?v=${APP_VERSION}'
].forEach(token => requireToken(config, token, 'config.js'));

const worker = read('service-worker.js');
[
    "const CACHE_VERSION = 'athar-pro-v32'",
    './isnad_data.js?v=athar-pro-v32',
    './js/components/GoldenChainView.js?v=athar-pro-v32',
    './js/components/AstronomyBootstrap.js?v=athar-pro-v32',
    './css/golden-chain.css?v=athar-pro-v32'
].forEach(token => requireToken(worker, token, 'service worker'));

const extensionData = read('extensions_data.js');
requireToken(extensionData, 'Explorateur pédagogique des isnāds', 'Golden Chain extension metadata');

console.log(`Golden Chain validated: ${data.chains.length} chains, ${data.narrators.length} narrators, ${data.lessons.length} lessons and cache v32.`);
