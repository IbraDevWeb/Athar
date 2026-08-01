#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const paths = {
    data: path.join(root, 'transmission_data.js'),
    component: path.join(root, 'js', 'components', 'TransmissionView.js'),
    css: path.join(root, 'css', 'transmission.css'),
    config: path.join(root, 'js', 'config.js'),
    worker: path.join(root, 'service-worker.js')
};

const failures = [];
const fail = message => failures.push(message);
const conflictPattern = /^(<<<<<<<|=======|>>>>>>>)/m;

for (const [label, filePath] of Object.entries(paths)) {
    if (!fs.existsSync(filePath)) {
        fail(`missing ${label}: ${path.relative(root, filePath)}`);
        continue;
    }
    const source = fs.readFileSync(filePath, 'utf8');
    if (conflictPattern.test(source)) fail(`unresolved conflict marker in ${path.relative(root, filePath)}`);
}

if (failures.length) {
    failures.forEach(message => console.error(`Transmission validation failed: ${message}`));
    process.exit(1);
}

const dataSource = `${fs.readFileSync(paths.data, 'utf8')}
;globalThis.__transmission = { SILSILA_DATA, SILSILA_JOURNEYS, SILSILA_THEMES };`;
const context = {};
vm.createContext(context);
vm.runInContext(dataSource, context, { filename: 'transmission_data.js' });

const component = fs.readFileSync(paths.component, 'utf8');
const css = fs.readFileSync(paths.css, 'utf8');
const config = fs.readFileSync(paths.config, 'utf8');
const worker = fs.readFileSync(paths.worker, 'utf8');
new vm.Script(component, { filename: 'js/components/TransmissionView.js' });

const { SILSILA_DATA, SILSILA_JOURNEYS, SILSILA_THEMES } = context.__transmission;
const requiredGroups = ['pre', 'fiqh', 'hadith', 'quran'];

if (!SILSILA_DATA || !Array.isArray(SILSILA_DATA.nodes) || !Array.isArray(SILSILA_DATA.edges)) {
    fail('SILSILA_DATA must contain nodes and edges arrays');
} else {
    const ids = new Set();
    for (const node of SILSILA_DATA.nodes) {
        if (!Number.isInteger(node.id)) fail(`node id must be an integer: ${node.label || 'unknown'}`);
        if (ids.has(node.id)) fail(`duplicate node id ${node.id}`);
        ids.add(node.id);
        for (const field of ['label', 'arabicName', 'group', 'role', 'dates', 'bio']) {
            if (!node[field]) fail(`node ${node.id} is missing ${field}`);
        }
        if (!requiredGroups.includes(node.group)) fail(`node ${node.id} has unknown group ${node.group}`);
        for (const field of ['contributions', 'works', 'keywords', 'sources']) {
            if (!Array.isArray(node[field])) fail(`node ${node.id} field ${field} must be an array`);
        }
    }

    for (const edge of SILSILA_DATA.edges) {
        if (!ids.has(edge.from) || !ids.has(edge.to)) fail(`edge ${edge.from} -> ${edge.to} references an unknown node`);
        if (edge.from === edge.to) fail(`self-referencing edge on node ${edge.from}`);
    }

    if (!Array.isArray(SILSILA_JOURNEYS) || SILSILA_JOURNEYS.length === 0) {
        fail('SILSILA_JOURNEYS must contain at least one guided journey');
    } else {
        const journeyIds = new Set();
        for (const journey of SILSILA_JOURNEYS) {
            if (!journey.id || journeyIds.has(journey.id)) fail(`invalid or duplicate journey id ${journey.id}`);
            journeyIds.add(journey.id);
            if (!Array.isArray(journey.scholarIds) || journey.scholarIds.length < 2) {
                fail(`journey ${journey.id} must contain at least two scholars`);
                continue;
            }
            for (const id of journey.scholarIds) {
                if (!ids.has(id)) fail(`journey ${journey.id} references unknown scholar ${id}`);
            }
        }
    }
}

for (const group of requiredGroups) {
    if (!SILSILA_THEMES[group]) fail(`missing theme for group ${group}`);
}

for (const token of [
    "const mode = ref('explore')",
    'const overlay = ref(null)',
    'const activeGroup = ref',
    'const masters = computed',
    'const students = computed',
    'const directoryResults = computed',
    'const activeJourney = computed',
    'const buildQuiz =',
    "event.key === '/'",
    "classList.add('athar-transmission-active')",
    "classList.toggle('athar-transmission-overlay'",
    'onBeforeUnmount',
    'tx4-explore',
    'tx4-portrait',
    'tx4-lineage',
    'tx4-command',
    'tx4-profile',
    'tx4-journeys',
    'tx4-review',
    'tx4-mode-nav'
]) {
    if (!component.includes(token)) fail(`missing editorial Transmission behavior: ${token}`);
}

for (const obsolete of [
    'tx3-',
    'tx-stats-grid',
    'tx-explore-layout',
    'tx-side-panel',
    'tx-learning-panel',
    'tx-quiz-card',
    'tx-quick-journeys'
]) {
    if (component.includes(obsolete)) fail(`obsolete Transmission structure remains in component: ${obsolete}`);
    if (css.includes(obsolete)) fail(`obsolete Transmission structure remains in CSS: ${obsolete}`);
}

for (const token of [
    '.tx4-shell',
    '.tx4-masthead',
    '.tx4-explore',
    'grid-template-columns: minmax(0, 1.35fr) minmax(330px, .65fr)',
    '.tx4-portrait',
    '.tx4-lineage-row',
    '.tx4-current-row',
    '.tx4-mode-nav',
    '.tx4-command',
    '.tx4-profile',
    '.tx4-journeys',
    '.tx4-review-card',
    'html.athar-app-fullscreen .tx4-frame',
    'padding-top: calc(var(--athar-immersive-bar, 60px) + 18px)',
    'top: calc(var(--athar-immersive-bar, 60px) + 8px)',
    'html.athar-transmission-active .athar-mobile-dock',
    'html.athar-transmission-overlay .athar-global-mainframe > main',
    'env(safe-area-inset-bottom',
    'var(--athar-viewport-height, 100dvh)',
    '@media (max-width: 620px)',
    '@media (prefers-reduced-motion: reduce)'
]) {
    if (!css.includes(token)) fail(`missing editorial design protection: ${token}`);
}

const openBraces = (css.match(/{/g) || []).length;
const closeBraces = (css.match(/}/g) || []).length;
if (openBraces !== closeBraces) fail(`unbalanced CSS braces: ${openBraces} opening / ${closeBraces} closing`);

const configVersion = Number(config.match(/const APP_VERSION = 'athar-pro-v(\d+)'/)?.[1] || 0);
const workerVersion = Number(worker.match(/const CACHE_VERSION = 'athar-pro-v(\d+)'/)?.[1] || 0);
if (configVersion !== workerVersion || configVersion < 26) {
    fail(`inconsistent or stale application cache: config v${configVersion}, worker v${workerVersion}`);
}

for (const legacy of [
    'TransmissionFocusPatch.js',
    'athar-transmission-focus-patch',
    'transmission-immersive-fix.css',
    'athar-transmission-immersive-fix'
]) {
    if (config.includes(legacy)) fail(`legacy Transmission layer is still loaded by config: ${legacy}`);
    if (worker.includes(legacy)) fail(`legacy Transmission layer is still cached: ${legacy}`);
}

for (const asset of [
    `css/transmission.css?v=athar-pro-v${workerVersion}`,
    `js/components/TransmissionView.js?v=athar-pro-v${workerVersion}`,
    `transmission_data.js?v=athar-pro-v${workerVersion}`
]) {
    if (!worker.includes(asset)) fail(`Transmission asset missing from cache: ${asset}`);
}

if (failures.length) {
    failures.forEach(message => console.error(`Transmission validation failed: ${message}`));
    process.exit(1);
}

const counts = requiredGroups
    .map(group => `${group}:${SILSILA_DATA.nodes.filter(node => node.group === group).length}`)
    .join(', ');
console.log(
    `Transmission Editorial valid — ${SILSILA_DATA.nodes.length} profiles, ${SILSILA_DATA.edges.length} links, ` +
    `${SILSILA_JOURNEYS.length} journeys (${counts}); portrait, lineage rail, command palette, profile, journeys, review, mobile and immersive v${workerVersion}.`
);
