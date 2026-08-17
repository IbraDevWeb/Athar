const fs = require('node:fs');
const vm = require('node:vm');

const componentPath = 'js/components/TasbihView.js';
const cssPath = 'css/tasbih-pro.css';
const configPath = 'js/config.js';
const workerPath = 'service-worker.js';

for (const file of [componentPath, cssPath, configPath, workerPath]) {
    if (!fs.existsSync(file)) throw new Error(`Fichier Tasbih manquant : ${file}`);
}

const source = fs.readFileSync(componentPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const config = fs.readFileSync(configPath, 'utf8');
const worker = fs.readFileSync(workerPath, 'utf8');

new vm.Script(source, { filename: componentPath });

const requiredSourceTokens = [
    "athar_tasbih_v2",
    "mode: 'session'",
    "finishSession",
    "undo",
    "toggleFullscreen",
    "wakeLock",
    "customDhikrs",
    "history",
    "weeklyData",
    "lang=\"ar\"",
    "event.code === 'Space'",
    "state.mode === 'library'",
    "state.mode === 'progress'",
    "class=\"tasbih-progress-view\""
];
for (const token of requiredSourceTokens) {
    if (!source.includes(token)) throw new Error(`Fonction Tasbih absente : ${token}`);
}

if ((source.match(/id: '[a-z-]+'/g) || []).length < 6) throw new Error('Moins de six formules proposées dans le Tasbih.');
if (source.includes("document.getElementById('tasbih-button')")) throw new Error('Ancien effet DOM impératif encore présent.');
if (/selectedDhikr\.value\.totalCount/.test(source)) throw new Error('Ancienne logique totalCount potentiellement NaN encore présente.');
for (const selector of ['.tasbih-session-layout', '.tasbih-counter-card', '.tasbih-stats-grid', '.tasbih-history-list']) {
    if (!css.includes(selector)) throw new Error(`Style Tasbih manquant : ${selector}`);
}
if (!css.includes('@media(max-width:820px)')) throw new Error('Responsive Tasbih absent.');
if (!css.includes('prefers-reduced-motion')) throw new Error('Réduction des animations non prise en charge.');
if (!config.includes("css/tasbih-pro.css?v=${APP_VERSION}")) throw new Error('Feuille Tasbih non chargée par config.js.');

const configVersion = config.match(/APP_VERSION = '([^']+)'/)?.[1] || '';
const workerVersion = worker.match(/CACHE_VERSION = '([^']+)'/)?.[1] || '';
const configMajor = Number(configVersion.match(/^athar-pro-v(\d+)/)?.[1]);
const workerMajor = Number(workerVersion.match(/^athar-pro-v(\d+)/)?.[1]);
if (!Number.isFinite(configMajor) || configMajor < 12) throw new Error('La version de l’application est antérieure à la refonte Tasbih v12.');
if (configVersion !== workerVersion || configMajor !== workerMajor) throw new Error(`Versions de cache incohérentes : config ${configVersion || 'absente'}, worker ${workerVersion || 'absente'}.`);
if (!worker.includes('./js/components/TasbihView.js')) throw new Error('Composant Tasbih absent du cache PWA.');

console.log(`Tasbih validé : compteur, séances, historique, statistiques, arabe, accessibilité et cache ${configVersion}.`);