const fs = require('fs');
const vm = require('vm');

const read = (path) => fs.readFileSync(path, 'utf8');
const fail = (message) => {
    console.error(`Astronomy validation failed: ${message}`);
    process.exit(1);
};
const requireToken = (source, token, label) => {
    if (!source.includes(token)) fail(`${label} is missing: ${token}`);
};

const context = { window: {} };
vm.createContext(context);
vm.runInContext(read('astronomy_data.js'), context, { filename: 'astronomy_data.js' });
const data = context.window.ANCIENT_SKY_DATA;
if (!data) fail('ANCIENT_SKY_DATA was not exposed.');

if (!Array.isArray(data.seasons) || data.seasons.length !== 4) fail('Exactly four seasonal presets are required.');
if (!Array.isArray(data.moments) || data.moments.length < 5) fail('Night-time controls are incomplete.');
if (!Array.isArray(data.objects) || data.objects.length < 14) fail('The pedagogical sky corpus is too small.');
if (!Array.isArray(data.guides) || data.guides.length < 3) fail('Three guided paths are required.');

const objectIds = new Set();
for (const object of data.objects) {
    if (!object.id || objectIds.has(object.id)) fail(`Invalid or duplicate object id: ${object.id}`);
    objectIds.add(object.id);
    for (const key of ['name', 'arabic', 'transliteration', 'summary', 'story', 'memory', 'source']) {
        if (!String(object[key] || '').trim()) fail(`${object.id} is missing ${key}.`);
    }
    if (!object.positions || typeof object.positions !== 'object') fail(`${object.id} has no seasonal positions.`);
    for (const season of data.seasons) {
        const position = object.positions[season.id];
        if (!Array.isArray(position) || position.length !== 2 || position.some((value) => !Number.isFinite(Number(value)))) {
            fail(`${object.id} has an invalid ${season.id} position.`);
        }
    }
}

for (const guide of data.guides) {
    if (!Array.isArray(guide.steps) || guide.steps.length < 3) fail(`${guide.id} must contain at least three steps.`);
    guide.steps.forEach((step) => {
        if (!objectIds.has(step.objectId)) fail(`${guide.id} points to unknown object ${step.objectId}.`);
    });
}

for (const link of data.links || []) {
    if (!Array.isArray(link.objects) || link.objects.length < 2) fail(`${link.id} has no usable line.`);
    link.objects.forEach((id) => {
        if (!objectIds.has(id)) fail(`${link.id} points to unknown object ${id}.`);
    });
}

const component = read('js/components/AncientSkyView.js');
[
    'sky5-planisphere', 'visibleObjects', 'visibleLinks', 'backgroundStars', 'selectSeason',
    'startGuide', 'showAbout', '@click="selectObject(object.id)"', 'type="range"',
    'athar-astronomy-active', 'onBeforeUnmount'
].forEach((token) => requireToken(component, token, 'AncientSkyView'));
if (/WebGL|THREE\.|canvas\.getContext/.test(component)) fail('The lightweight module must not add a WebGL engine.');

const bridge = read('js/components/AstronomyBootstrap.js');
[
    "'ancient-sky-view': window.AncientSkyView",
    "currentTool === 'astronomy'",
    'currentTool === \'scholars_map\'',
    'window.Vue.createApp',
    'PATCH_FLAG'
].forEach((token) => requireToken(bridge, token, 'AstronomyBootstrap'));

const css = read('css/ancient-sky.css');
[
    '.sky5-shell', '.sky5-main', '.sky5-planisphere', '.sky5-inspector', '.sky5-guides',
    'html.athar-app-fullscreen .sky5-frame', '@media (max-width: 900px)',
    '@media (max-width: 640px)', 'prefers-reduced-motion', 'touch-action: manipulation'
].forEach((token) => requireToken(css, token, 'Ancient sky CSS'));

const config = read('js/config.js');
[
    "const APP_VERSION = 'athar-pro-v28'",
    "writeEarlyScript('astronomy_data.js'",
    "writeEarlyScript('js/components/AncientSkyView.js'",
    "writeEarlyScript('js/components/AstronomyBootstrap.js'",
    "ensureStylesheet(`css/ancient-sky.css?v=${APP_VERSION}`"
].forEach((token) => requireToken(config, token, 'config.js'));

const worker = read('service-worker.js');
[
    "const CACHE_VERSION = 'athar-pro-v28'",
    './astronomy_data.js?v=athar-pro-v28',
    './js/components/AncientSkyView.js?v=athar-pro-v28',
    './js/components/AstronomyBootstrap.js?v=athar-pro-v28',
    './css/ancient-sky.css?v=athar-pro-v28'
].forEach((token) => requireToken(worker, token, 'service worker'));

const extensionData = read('extensions_data.js');
requireToken(extensionData, 'Planisphère pédagogique', 'astronomy extension metadata');

console.log(`Astronomy validated: ${data.objects.length} objects, ${data.guides.length} guides, ${data.links.length} figures.`);
