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

const timelineTokens = [
    'ATHAR_CHRONOLOGY.resolve', 'ATHAR_READING_PRESENTATION.timeline', 'BIOGRAPHY_SOURCES',
    'groupedEvents', 'periodChoices', 'pathways', 'selectedEvent', 'openBiography',
    'timeline-pro-periods', 'timeline-pro-search', 'timeline-pro-event-card',
    'timeline-pro-reading-apparatus', 'timeline-pro-paths', 'timeline-pro-more',
    'showMore', 'aria-modal="true"', 'onDialogKeydown',
    'Math.max(0,events.length-limit)', 'preview(event.desc)'
];
for (const token of timelineTokens) if (!timeline.includes(token)) throw new Error(`Fonction de frise absente : ${token}`);
if (/mode===['"](?:eras|paths|timeline)/.test(timeline) || timeline.includes('timeline-pro-period-rail')) {
    throw new Error('Ancienne navigation à modes multiples encore présente dans la frise.');
}
if ((timeline.match(/id: '[a-z-]+', label:/g) || []).length < 7) throw new Error('Les sept périodes doivent être conservées.');
if ((timeline.match(/title: '[^']+'/g) || []).length < 4) throw new Error('Les parcours historiques doivent rester disponibles.');
const cssTokens = [
    '.timeline-pro-container','.timeline-pro-periods','.timeline-pro-toolbar',
    '.timeline-pro-event-list','.timeline-pro-event-card','.timeline-pro-drawer',
    '.timeline-pro-reading-method','.timeline-pro-reading-apparatus',
    '@media(max-width:680px)','@media(max-width:375px)','prefers-reduced-motion:reduce'
];
for (const token of cssTokens) if (!timelineCss.includes(token)) throw new Error('Finition responsive absente : '+token);
if (!timeline.includes('selectedEvent.reference?.sourceUrl') || !timeline.includes('selectedEvent.evidence?.externalUrl'))
    throw new Error('La frise doit conserver les références historiques vérifiables.');
if (!timeline.includes('v-html="formatText(selectedEvent.desc)"'))
    throw new Error('Le récit documentaire complet doit rester accessible.');
if (!timeline.includes('<details class="timeline-pro-reading-method">'))
    throw new Error('Sources et variantes doivent être repliées après le récit.');
if (timeline.includes('periodByYear('))
    throw new Error('Ne pas réinventer une logique de datation dans la vue.');

const fullscreenTokens = ['athar-app-fullscreen', 'athar-immersive-only', 'AtharFullscreen', 'athar-immersive-menu', 'athar-immersive-quick', "const isActive = () => true", "CustomEvent('athar:navigate'"];
for (const token of fullscreenTokens) if (!fullscreen.includes(token)) throw new Error(`Interface immersive unique incomplète : ${token}`);
for (const old of ['requestFullscreen', 'exitFullscreen', 'athar-fullscreen-toggle', 'athar-fullscreen-exit']) if (fullscreen.includes(old)) throw new Error('Ancienne commande plein écran encore présente : ' + old);
if (!fullscreenCss.includes('.athar-immersive-menu') || !fullscreenCss.includes('.athar-global-sidebar') || !fullscreenCss.includes('.athar-immersive-quick')) throw new Error('Design immersif incomplet.');

// La frise doit passer après les thèmes transversaux pour ne pas hériter d'anciens cadres.
if (config.indexOf("'athar-unified-section-galleries'") > config.indexOf("'athar-timeline-pro'"))
    throw new Error('La feuille de style de la frise doit être insérée après le thème commun.');
if (config.indexOf("'athar-hadith-editorial-finish'") > config.indexOf("'athar-timeline-pro'"))
    throw new Error('La feuille de style de la frise doit rester la dernière surcharge de rubrique.');
if (!worker.includes('js/components/TimelineView.js?v=athar-timeline-intuitive-v1'))
    throw new Error('Le nouveau composant de frise est absent du cache.');

for (const asset of ['css/timeline-pro.css', 'css/fullscreen-global.css', 'js/components/GlobalFullscreen.js']) {
    if (!config.includes(asset)) throw new Error(`Ressource non chargée par config.js : ${asset}`);
    if (!worker.includes(asset)) throw new Error(`Ressource non mise en cache : ${asset}`);
}
const configVersion = Number(config.match(/athar-pro-v(\d+)/)?.[1] || 0);
const workerVersion = Number(worker.match(/athar-pro-v(\d+)/)?.[1] || 0);
if (configVersion < 13 || configVersion !== workerVersion) throw new Error('Versions du cache plein écran incohérentes.');

console.log(`Navigation immersive permanente et frise validées : écran unique, périodes, parcours, responsive et cache v${configVersion}.`);