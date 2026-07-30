const fs = require('node:fs');
const vm = require('node:vm');

const paths = {
    fullscreen: 'js/components/GlobalFullscreen.js',
    bridge: 'js/components/ThemeBridge.js',
    settings: 'js/composables/useSettings.js',
    css: 'css/fullscreen-global.css',
    config: 'js/config.js',
    worker: 'service-worker.js'
};

for (const path of Object.values(paths)) {
    if (!fs.existsSync(path)) throw new Error(`Fichier de thème manquant : ${path}`);
}

const fullscreen = fs.readFileSync(paths.fullscreen, 'utf8');
const bridge = fs.readFileSync(paths.bridge, 'utf8');
const settings = fs.readFileSync(paths.settings, 'utf8');
const css = fs.readFileSync(paths.css, 'utf8');
const config = fs.readFileSync(paths.config, 'utf8');
const worker = fs.readFileSync(paths.worker, 'utf8');

new vm.Script(fullscreen, { filename: paths.fullscreen });
new vm.Script(bridge, { filename: paths.bridge });
new vm.Script(settings, { filename: paths.settings });

for (const token of [
    'athar-immersive-theme',
    'toggleTheme',
    "document.documentElement.classList.contains('dark')",
    'MutationObserver',
    "attributeFilter: ['class']",
    'athar:theme-changed'
]) {
    if (!fullscreen.includes(token)) throw new Error(`Interface du thème immersif absente : ${token}`);
}

for (const token of [
    "const SETTINGS_KEY = 'athar_settings'",
    'const setDarkMode =',
    "document.documentElement.classList.toggle('dark', next)",
    'persistSettings()',
    "window.dispatchEvent(new CustomEvent('athar:theme-changed'",
    'window.AtharTheme =',
    "toggle: (source = 'external')",
    'setDarkMode,'
]) {
    if (!settings.includes(token)) throw new Error(`Contrôleur central du thème absent : ${token}`);
}

for (const token of [
    "document.addEventListener('click', handleImmersiveTheme, true)",
    'event.stopImmediatePropagation()',
    "api.toggle('immersive')",
    "api.toggle('immersive-shortcut')",
    "window.addEventListener('athar:theme-changed', updateButton)",
    'window.AtharFullscreen.toggleTheme =',
    'MutationObserver'
]) {
    if (!bridge.includes(token)) throw new Error(`Pont du thème immersif absent : ${token}`);
}

for (const token of [
    '.athar-immersive-theme',
    'html.dark.athar-app-fullscreen',
    'html.dark.athar-app-fullscreen::backdrop',
    'html.dark.athar-app-fullscreen .athar-global-mainframe > main',
    'color-scheme: dark',
    'right: calc(60px + env(safe-area-inset-right, 0px))',
    'right: calc(112px + env(safe-area-inset-right, 0px)) !important',
    '.athar-immersive-theme span'
]) {
    if (!css.includes(token)) throw new Error(`Style sombre immersif absent : ${token}`);
}

if (!css.includes('@media (max-width: 700px)')) {
    throw new Error('Disposition mobile du thème immersif absente.');
}

const configVersion = Number(config.match(/athar-pro-v(\d+)/)?.[1] || 0);
const workerVersion = Number(worker.match(/athar-pro-v(\d+)/)?.[1] || 0);
if (configVersion < 23 || configVersion !== workerVersion) {
    throw new Error(`Cache du thème incohérent : config v${configVersion}, worker v${workerVersion}.`);
}

const configBridge = 'js/components/ThemeBridge.js?v=${APP_VERSION}';
if (!config.includes(configBridge)) throw new Error('ThemeBridge.js n’est pas chargé par config.js.');
if (config.indexOf(configBridge) < config.indexOf('js/components/GlobalFullscreen.js?v=${APP_VERSION}')) {
    throw new Error('ThemeBridge.js doit être chargé après le contrôleur immersif.');
}

for (const asset of [
    `css/fullscreen-global.css?v=athar-pro-v${workerVersion}`,
    `js/components/GlobalFullscreen.js?v=athar-pro-v${workerVersion}`,
    `js/components/ThemeBridge.js?v=athar-pro-v${workerVersion}`,
    'js/composables/useSettings.js'
]) {
    if (!worker.includes(asset)) throw new Error(`Ressource du thème absente du cache : ${asset}`);
}

console.log(`Thème validé : bouton principal restauré, API centrale, pont immersif direct, raccourci et cache v${workerVersion}.`);
