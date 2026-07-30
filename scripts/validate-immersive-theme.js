const fs = require('node:fs');
const vm = require('node:vm');

const paths = {
    fullscreen: 'js/components/GlobalFullscreen.js',
    css: 'css/fullscreen-global.css',
    config: 'js/config.js',
    worker: 'service-worker.js'
};

for (const path of Object.values(paths)) {
    if (!fs.existsSync(path)) throw new Error(`Fichier immersif manquant : ${path}`);
}

const fullscreen = fs.readFileSync(paths.fullscreen, 'utf8');
const css = fs.readFileSync(paths.css, 'utf8');
const config = fs.readFileSync(paths.config, 'utf8');
const worker = fs.readFileSync(paths.worker, 'utf8');

new vm.Script(fullscreen, { filename: paths.fullscreen });

for (const token of [
    "SETTINGS_KEY = 'athar_settings'",
    'athar-immersive-theme',
    'toggleTheme',
    'findNativeThemeButton',
    "document.documentElement.classList.contains('dark')",
    "nativeButton.click()",
    'MutationObserver',
    "attributeFilter: ['class']",
    "athar:theme-changed",
    "toggleTheme }"
]) {
    if (!fullscreen.includes(token)) throw new Error(`Synchronisation du thème immersif absente : ${token}`);
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
if (configVersion !== 22 || workerVersion !== 22) {
    throw new Error(`Cache immersif incohérent : config v${configVersion}, worker v${workerVersion}.`);
}

for (const asset of ['css/fullscreen-global.css?v=athar-pro-v22', 'js/components/GlobalFullscreen.js?v=athar-pro-v22']) {
    if (!worker.includes(asset)) throw new Error(`Ressource sombre absente du cache : ${asset}`);
}

console.log('Thème immersif validé : commande dédiée, synchronisation Vue, styles sombres, barre mobile sans superposition et cache v22.');