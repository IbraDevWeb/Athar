const fs = require('node:fs');
const vm = require('node:vm');

const paths = {
    css: 'css/mobile-pro.css',
    script: 'js/components/MobileExperience.js',
    fullscreen: 'css/fullscreen-global.css',
    config: 'js/config.js',
    worker: 'service-worker.js'
};

for (const file of Object.values(paths)) {
    if (!fs.existsSync(file)) throw new Error(`Ressource mobile manquante : ${file}`);
}

const css = fs.readFileSync(paths.css, 'utf8');
const script = fs.readFileSync(paths.script, 'utf8');
const config = fs.readFileSync(paths.config, 'utf8');
const worker = fs.readFileSync(paths.worker, 'utf8');

new vm.Script(script, { filename: paths.script });

for (const token of [
    '--athar-viewport-height',
    '100dvh',
    'env(safe-area-inset-top',
    'env(safe-area-inset-bottom',
    '.athar-mobile-dock',
    'grid-template-columns: repeat(5',
    '.athar-native-mobile-menu',
    '.athar-keyboard-open',
    'html.athar-app-fullscreen .athar-global-mainframe > main',
    'html.athar-app-fullscreen .athar-immersive-current',
    'left: calc(60px + var(--athar-safe-left))',
    'right: calc(60px + var(--athar-safe-right))',
    '@media (max-width: 767px)',
    '@media (prefers-reduced-motion: reduce)'
]) {
    if (!css.includes(token)) throw new Error(`Protection CSS mobile absente : ${token}`);
}

for (const token of [
    "window.matchMedia('(max-width: 767px)')",
    'athar-mobile-dock',
    'Navigation mobile principale',
    'visualViewport',
    'athar-keyboard-open',
    'athar-mobile-detail',
    'MutationObserver',
    'requestAnimationFrame',
    'findSidebarButton',
    'findMobileMenuButton',
    'isDetailView',
    'window.AtharMobile'
]) {
    if (!script.includes(token)) throw new Error(`Comportement mobile absent : ${token}`);
}

const dockViews = [...script.matchAll(/\['(home|library|hadiths|ussul|menu)',/g)].map(match => match[1]);
for (const required of ['home', 'library', 'hadiths', 'ussul', 'menu']) {
    if (!dockViews.includes(required)) throw new Error(`Destination mobile absente : ${required}`);
}

const configVersion = Number(config.match(/athar-pro-v(\d+)/)?.[1] || 0);
const workerVersion = Number(worker.match(/athar-pro-v(\d+)/)?.[1] || 0);
if (configVersion < 21 || workerVersion !== configVersion) {
    throw new Error(`Versions mobile incohérentes : config v${configVersion}, worker v${workerVersion}.`);
}

if (!config.includes('viewport-fit=cover')) throw new Error('La prise en charge des zones sûres iOS est absente.');
if (!config.includes('css/mobile-pro.css?v=${APP_VERSION}')) throw new Error('La feuille mobile n’est pas chargée en dernier.');
if (!config.includes('js/components/MobileExperience.js?v=${APP_VERSION}')) throw new Error('Le contrôleur mobile n’est pas chargé.');

for (const asset of [`css/mobile-pro.css?v=athar-pro-v${configVersion}`, `js/components/MobileExperience.js?v=athar-pro-v${configVersion}`]) {
    if (!worker.includes(asset)) throw new Error(`Ressource mobile absente du cache : ${asset}`);
}

if (css.includes('padding-top: 112px') || css.includes('top: 62px')) {
    throw new Error('Le correctif mobile ne doit pas réintroduire une barre immersive sur deux lignes.');
}

console.log(`Expérience mobile validée : viewport dynamique, zones sûres, dock tactile, clavier, lecteurs, menu et barre immersive compacte en cache v${configVersion}.`);