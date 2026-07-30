const fs = require('node:fs');
const vm = require('node:vm');

const paths = {
    fullscreen: 'js/components/GlobalFullscreen.js',
    adhkar: 'js/components/AdhkarView.js',
    fullscreenCss: 'css/fullscreen-global.css',
    adhkarCss: 'css/adhkar-pro.css',
    config: 'js/config.js',
    worker: 'service-worker.js'
};
for (const path of Object.values(paths)) {
    if (!fs.existsSync(path)) throw new Error(`Fichier manquant : ${path}`);
}

const fullscreen = fs.readFileSync(paths.fullscreen, 'utf8');
const adhkar = fs.readFileSync(paths.adhkar, 'utf8');
const fullscreenCss = fs.readFileSync(paths.fullscreenCss, 'utf8');
const adhkarCss = fs.readFileSync(paths.adhkarCss, 'utf8');
const config = fs.readFileSync(paths.config, 'utf8');
const worker = fs.readFileSync(paths.worker, 'utf8');

new vm.Script(fullscreen, { filename: paths.fullscreen });
new vm.Script(adhkar, { filename: paths.adhkar });

for (const token of ['NAV_GROUPS', "['ussul', 'Oussoul Al-Fiqh'", 'athar-immersive-drawer', 'findVueNavigationButton', 'data-athar-view', 'openMenu: openDrawer', "CustomEvent('athar:navigate'"]) {
    if (!fullscreen.includes(token)) throw new Error(`Navigation immersive incomplète : ${token}`);
}
if ((fullscreen.match(/\['[a-z_]+', '[^']+'/g) || []).length < 20) throw new Error('Le menu immersif ne couvre pas assez de sections.');
for (const selector of ['.athar-immersive-menu', '.athar-immersive-drawer', '.athar-immersive-current', '.athar-global-sidebar']) {
    if (!fullscreenCss.includes(selector)) throw new Error(`Style immersif absent : ${selector}`);
}

for (const token of ['athar_adhkar_v2', "mode = Vue.ref('routines')", "mode==='library'", "mode==='progress'", 'rawItems', 'categories = Vue.computed', 'routines = Vue.computed', 'weeklyData', 'recordCompletion', 'lang="ar"', "event.code === 'Space'", 'Méthode éditoriale']) {
    if (!adhkar.includes(token)) throw new Error(`Fonction Al-Adhkar absente : ${token}`);
}
if ((adhkar.match(/id: '[a-z-]+', icon:/g) || []).length < 4) throw new Error('Les parcours Al-Adhkar sont insuffisants.');
if (!adhkar.includes("replace(/\\s*\\[cite:")) throw new Error('Le nettoyage des marqueurs de citation est absent.');
for (const selector of ['.adhkar-pro-shell', '.adhkar-pro-routine-grid', '.adhkar-pro-card-grid', '.adhkar-pro-reader-layer', '.adhkar-pro-progress-layout']) {
    if (!adhkarCss.includes(selector)) throw new Error(`Style Al-Adhkar absent : ${selector}`);
}
if (!adhkarCss.includes('@media(max-width:820px)') || !adhkarCss.includes('prefers-reduced-motion')) throw new Error('Responsive ou accessibilité Al-Adhkar incomplet.');

for (const asset of ['css/adhkar-pro.css', 'js/components/AdhkarView.js', 'js/components/GlobalFullscreen.js']) {
    if (!worker.includes(asset)) throw new Error(`Ressource absente du cache : ${asset}`);
}
if (!config.includes('css/adhkar-pro.css') || !config.includes('athar-pro-v14') || !worker.includes('athar-pro-v14')) {
    throw new Error('Intégration du cache v14 incomplète.');
}

console.log('Mode immersif navigable et Al-Adhkar professionnel validés : navigation inter-sections, Oussoul, parcours, arabe, lecteur, progression et cache v14.');