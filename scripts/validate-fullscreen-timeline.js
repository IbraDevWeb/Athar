const fs = require('node:fs');
const vm = require('node:vm');

const files = {
    timeline: 'js/components/TimelineView.js',
    fullscreen: 'js/components/GlobalFullscreen.js',
    timelineCss: 'css/timeline-pro.css',
    fullscreenCss: 'css/fullscreen-global.css',
    config: 'js/config.js',
    worker: 'service-worker.js'
};
for (const path of Object.values(files)) if (!fs.existsSync(path)) throw new Error(`Fichier manquant : ${path}`);

const timeline = fs.readFileSync(files.timeline, 'utf8');
const fullscreen = fs.readFileSync(files.fullscreen, 'utf8');
const timelineCss = fs.readFileSync(files.timelineCss, 'utf8');
const fullscreenCss = fs.readFileSync(files.fullscreenCss, 'utf8');
const config = fs.readFileSync(files.config, 'utf8');
const worker = fs.readFileSync(files.worker, 'utf8');

new vm.Script(timeline, { filename: files.timeline });
new vm.Script(fullscreen, { filename: files.fullscreen });

const timelineTokens = ["mode = Vue.ref('timeline')", "mode==='eras'", "mode==='paths'", 'gregorianApprox', 'groupedEvents', 'pathways', 'selectedEvent', 'openBiography', 'timeline-pro-period-rail'];
for (const token of timelineTokens) if (!timeline.includes(token)) throw new Error(`Fonction de frise absente : ${token}`);
if ((timeline.match(/id: '[a-z-]+', label:/g) || []).length < 7) throw new Error('La frise doit définir au moins sept périodes.');
if ((timeline.match(/title: '[^']+'/g) || []).length < 4) throw new Error('Les parcours chronologiques sont insuffisants.');
if (!timelineCss.includes('.timeline-pro-workspace') || !timelineCss.includes('.timeline-pro-drawer') || !timelineCss.includes('@media(max-width:820px)')) throw new Error('Design de frise incomplet.');

const fullscreenTokens = ['requestFullscreen', 'exitFullscreen', 'fullscreenchange', "event.ctrlKey && event.shiftKey", 'athar-app-fullscreen', 'GlobalFullscreen'];
for (const token of fullscreenTokens) if (!fullscreen.includes(token)) throw new Error(`Fonction plein écran absente : ${token}`);
if (!fullscreenCss.includes('.athar-fullscreen-toggle') || !fullscreenCss.includes('.athar-global-sidebar') || !fullscreenCss.includes('.athar-fullscreen-exit')) throw new Error('Design plein écran incomplet.');

for (const asset of ['css/timeline-pro.css', 'css/fullscreen-global.css', 'js/components/GlobalFullscreen.js']) {
    if (!config.includes(asset)) throw new Error(`Ressource non chargée par config.js : ${asset}`);
    if (!worker.includes(asset)) throw new Error(`Ressource non mise en cache : ${asset}`);
}
if (!config.includes('athar-pro-v13') || !worker.includes('athar-pro-v13')) throw new Error('La migration du cache v13 est absente.');

console.log('Plein écran global et frise professionnelle validés : modes, périodes, parcours, détails, responsive et cache v13.');