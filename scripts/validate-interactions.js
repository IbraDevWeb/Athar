#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const files = {
    icons: 'js/components/VueSafeIcons.js',
    css: 'css/interaction-stability.css',
    config: 'js/config.js',
    worker: 'service-worker.js',
    app: 'js/app.js',
    transmission: 'js/components/TransmissionView.js',
    transmissionCss: 'css/transmission.css'
};

const failures = [];
const fail = message => failures.push(message);
const read = relativePath => {
    const absolutePath = path.join(root, relativePath);
    if (!fs.existsSync(absolutePath)) {
        fail(`missing ${relativePath}`);
        return '';
    }
    return fs.readFileSync(absolutePath, 'utf8');
};

const source = Object.fromEntries(Object.entries(files).map(([key, value]) => [key, read(value)]));

for (const [label, content] of Object.entries(source)) {
    if (/^(<<<<<<<|=======|>>>>>>>)/m.test(content)) fail(`unresolved conflict marker in ${files[label]}`);
}

if (source.icons) new vm.Script(source.icons, { filename: files.icons });

for (const token of [
    "Symbol.for('athar.vueSafeIcons.installed')",
    'host.replaceChildren(svg)',
    "host.classList.add('athar-icon-host')",
    'lucide.createIcons = safeCreateIcons',
    'new MutationObserver',
    "attributeFilter: ['data-lucide']",
    'window.AtharIcons = Object.freeze',
    'requestAnimationFrame'
]) {
    if (!source.icons.includes(token)) fail(`safe icon bridge is missing: ${token}`);
}

for (const forbidden of [
    'host.replaceWith(',
    'host.outerHTML',
    'host.remove()',
    'parentNode.replaceChild'
]) {
    if (source.icons.includes(forbidden)) fail(`safe icon bridge must preserve Vue hosts: ${forbidden}`);
}

for (const token of [
    '.athar-icon-host',
    'pointer-events: none !important',
    '.tx4-options button:not(:disabled)',
    'html:not(.athar-transmission-overlay) .tx4-overlay',
    '.fade-leave-active',
    'touch-action: manipulation',
    'min-width: 0',
    'env(safe-area-inset-bottom'
]) {
    if (!source.css.includes(token)) fail(`interaction CSS is missing: ${token}`);
}

if (!source.transmission.includes('@click="answerQuiz(option.id)"')) {
    fail('Transmission quiz answers must keep an explicit Vue click handler');
}
if (!source.transmission.includes(':disabled="quizAnswer !== null"')) {
    fail('Transmission quiz must only disable answers after a response');
}
if (!source.transmissionCss.includes('.tx4-options button')) {
    fail('Transmission quiz options are missing their layout rules');
}

for (const token of [
    'writeEarlyScript',
    "writeEarlyScript('js/components/VueSafeIcons.js'",
    'athar-vue-safe-icons',
    'css/interaction-stability.css?v=${APP_VERSION}'
]) {
    if (!source.config.includes(token)) fail(`interaction foundation is not loaded early enough: ${token}`);
}

if (source.config.includes('cdn.jsdelivr.net/npm/leaflet') || source.config.includes('const writeAsset')) {
    fail('Leaflet must not be injected cross-site through document.write in config.js');
}

const configVersion = source.config.match(/const APP_VERSION = '([^']+)'/)?.[1] || '';
const workerVersion = source.worker.match(/const CACHE_VERSION = '([^']+)'/)?.[1] || '';
const configMajor = Number(configVersion.match(/^athar-pro-v(\d+)/)?.[1] || 0);
const validVersion = /^athar-pro-v\d+(?:-[a-z0-9-]+)*$/i.test(configVersion);
if (!validVersion || configVersion !== workerVersion || configMajor < 27) {
    fail(`inconsistent or stale application cache: config ${configVersion || 'missing'}, worker ${workerVersion || 'missing'}`);
}

for (const asset of [
    `css/interaction-stability.css?v=${workerVersion}`,
    `js/components/VueSafeIcons.js?v=${workerVersion}`,
    `js/components/TransmissionView.js?v=${workerVersion}`
]) {
    if (!source.worker.includes(asset)) fail(`interaction asset missing from cache: ${asset}`);
}

const allRuntime = `${source.app}\n${source.transmission}`;
if (allRuntime.includes('__unsafeCreateIcons')) {
    fail('application code must never call the unsafe native Lucide renderer');
}

const openCss = (source.css.match(/{/g) || []).length;
const closeCss = (source.css.match(/}/g) || []).length;
if (openCss !== closeCss) fail(`unbalanced interaction CSS braces: ${openCss} opening / ${closeCss} closing`);

if (failures.length) {
    failures.forEach(message => console.error(`Interaction validation failed: ${message}`));
    process.exit(1);
}

console.log(
    `Interaction stability valid — Vue-safe Lucide hosts, MutationObserver refresh, quiz clicks, ` +
    `overlay pointer guards, responsive min-width protections and cache ${workerVersion}.`
);
