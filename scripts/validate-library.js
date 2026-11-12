const fs = require('node:fs');
const vm = require('node:vm');

const paths = {
    data: 'biographies_data.js',
    component: 'js/components/LibraryView.js',
    css: 'css/library-pro.css',
    immersive: 'css/library-immersive-fix.css',
    config: 'js/config.js',
    worker: 'service-worker.js'
};

for (const path of Object.values(paths)) {
    if (!fs.existsSync(path)) throw new Error(`Fichier de bibliothèque manquant : ${path}`);
}

const dataSource = fs.readFileSync(paths.data, 'utf8');
const componentSource = fs.readFileSync(paths.component, 'utf8');
const css = fs.readFileSync(paths.css, 'utf8');
const immersiveCss = fs.readFileSync(paths.immersive, 'utf8');
const config = fs.readFileSync(paths.config, 'utf8');
const worker = fs.readFileSync(paths.worker, 'utf8');

new vm.Script(dataSource, { filename: paths.data });
new vm.Script(componentSource, { filename: paths.component });

const context = vm.createContext({
    window: { setTimeout, lucide: null },
    localStorage: { getItem() { return null; }, setItem() {} },
    console
});
vm.runInContext(dataSource, context, { filename: paths.data });
vm.runInContext(componentSource, context, { filename: paths.component });

const chapters = vm.runInContext('CHAPTERS_DATA', context);
const component = vm.runInContext('LibraryView', context);

if (!Array.isArray(chapters) || chapters.length < 20) {
    throw new Error(`Corpus de biographies insuffisant : ${chapters?.length || 0} notices.`);
}

const ids = new Set();
let narratives = 0;
let timelineEvents = 0;
let traditions = 0;
let sourced = 0;

for (const chapter of chapters) {
    if (!chapter || typeof chapter !== 'object') throw new Error('Notice de bibliothèque invalide.');
    if (ids.has(String(chapter.id))) throw new Error(`Identifiant de notice dupliqué : ${chapter.id}`);
    ids.add(String(chapter.id));
    for (const field of ['name', 'arabicName', 'subtitle', 'intro']) {
        if (!String(chapter[field] || '').trim()) throw new Error(`Champ ${field} absent pour la notice ${chapter.id}.`);
    }
    if (!Array.isArray(chapter.tags)) throw new Error(`Tags absents pour la notice ${chapter.id}.`);
    narratives += Array.isArray(chapter.narratives) ? chapter.narratives.filter(Boolean).length : 0;
    timelineEvents += Array.isArray(chapter.timeline) ? chapter.timeline.filter(Boolean).length : 0;
    traditions += Array.isArray(chapter.hadiths) ? chapter.hadiths.filter(Boolean).length : 0;
    sourced += chapter.source ? 1 : 0;
}

if (!component || typeof component !== 'object') throw new Error('Composant LibraryView introuvable.');

for (const token of [
    "activeSpace: 'catalog'",
    "'catalog'",
    "'collections'",
    "'personal'",
    'athar_library_v2',
    'catalogItems',
    'collections()',
    'selectedCollection',
    'favoriteItems',
    'recentItems',
    'Cœur documentaire d’Athar Pro',
    'Choisir une',
    'Affiner',
    'Afficher plus d\'histoires',
    'library-pro-selection-search',
    'quickCategories',
    'displayedCatalogItems',
    'Collections thématiques',
    'Ma bibliothèque',
    'Recherche globale',
    'methodologie.html',
    'lang="ar"',
    'dir="rtl"'
]) {
    if (!componentSource.includes(token)) throw new Error(`Fonction de bibliothèque absente : ${token}`);
}

for (const method of ['safeArray', 'normalize', 'density', 'metrics', 'readingTime', 'openItem', 'toggleItemFavorite', 'randomChapter', 'loadHistory', 'saveHistory']) {
    if (typeof component.methods?.[method] !== 'function') throw new Error(`Méthode de bibliothèque absente : ${method}`);
}

// La nouvelle sélection privilégie l'accès direct, la recherche et une pagination légère.
const catalogue = component.computed.catalogItems;
const ctx = {
    chapters,
    activeCategory: 'Tous',
    viewFilter: 'all',
    query: '',
    contentFilter: 'all',
    activeLetter: 'Tous',
    sortMode: 'alpha',
    recentHistory: [],
    visibleLimit: 18,
    safeArray: component.methods.safeArray,
    normalize: component.methods.normalize,
    density: () => 0,
    hasSourceReference: () => true,
    favorite: () => false
};
Object.defineProperty(ctx,'catalogItems',{get:()=>catalogue.call(ctx)});
if (component.data.call({headerSearchQuery:''}).activeSpace !== 'catalog') throw new Error('La page de sélection doit être la porte d’entrée.');
if (ctx.catalogItems.length < 90) throw new Error('Le catalogue doit conserver tous les profils.');
if (component.computed.displayedCatalogItems.call(ctx).length !== 18) throw new Error('18 cartes initiales attendues pour éviter la surcharge.');
ctx.visibleLimit = 36;
if (component.computed.displayedCatalogItems.call(ctx).length !== 36) throw new Error('Affichage progressif inopérant.');
ctx.query = 'Khoubayb';
if (!ctx.catalogItems.length || ctx.catalogItems.some(item=> !component.methods.normalize(item.name+' '+item.intro+' '+(item.subtitle||'')).toLowerCase().includes('khoubayb'))) throw new Error('Recherche textuelle non fonctionnelle.');
ctx.query = '';
ctx.activeCategory = 'Badr';
if (!ctx.catalogItems.length || ctx.catalogItems.some(item=>!item.tags.includes('Badr'))) throw new Error('Thème rapide Badr non filtrant.');
ctx.activeCategory = 'Tous';
if (component.computed.quickCategories.call(ctx).length < 4) throw new Error('Thèmes rapides introuvables.');
if (!componentSource.includes('aria-label="Chercher une histoire"') || !componentSource.includes('aria-pressed="favorite(item.id)"')) throw new Error('Contrôles de sélection non accessibles.');
if (!css.includes('.library-pro-selection .library-pro-card') || !css.includes('.library-pro-load-more')) throw new Error('Refonte des cartes ou pagination non stylée.');
if (!css.includes('@media (max-width: 600px)')) throw new Error('Affichage mobile de la sélection manquant.');

const sample = chapters[0];
const metrics = component.methods.metrics.call({ safeArray: component.methods.safeArray }, sample);
if (!metrics || !Number.isInteger(metrics.stories) || !Number.isInteger(metrics.events)) {
    throw new Error('Calcul des métriques de notice invalide.');
}

for (const selector of [
    '.library-pro-root',
    '.library-pro-nav',
    '.library-pro-hero',
    '.library-pro-search-hero',
    '.library-pro-collection-grid',
    '.library-pro-catalog-tools',
    '.library-pro-results.is-grid',
    '.library-pro-results.is-list',
    '.library-pro-card',
    '.library-pro-shelf',
    '.library-pro-personal-stats'
]) {
    if (!css.includes(selector)) throw new Error(`Style de bibliothèque absent : ${selector}`);
}

if (!immersiveCss.includes('html.athar-app-fullscreen .library-pro-root') || !immersiveCss.includes('padding-top: 68px')) {
    throw new Error('Compatibilité immersive de la bibliothèque absente.');
}
if (!css.includes('@media (max-width: 820px)') || !css.includes('@media (prefers-reduced-motion: reduce)')) {
    throw new Error('Responsive ou accessibilité de la bibliothèque incomplet.');
}
if (!config.includes('css/library-pro.css?v=${APP_VERSION}') || !config.includes('css/library-immersive-fix.css?v=${APP_VERSION}')) {
    throw new Error('Feuilles de bibliothèque non chargées par config.js.');
}
for (const asset of ['css/library-pro.css', 'css/library-immersive-fix.css', 'js/components/LibraryView.js', 'biographies_data.js']) {
    if (!worker.includes(asset)) throw new Error(`Ressource de bibliothèque absente du cache : ${asset}`);
}

const configVersion = Number(config.match(/athar-pro-v(\d+)/)?.[1] || 0);
const workerVersion = Number(worker.match(/athar-pro-v(\d+)/)?.[1] || 0);
if (configVersion < 20 || configVersion !== workerVersion) throw new Error('Versions du cache de bibliothèque incohérentes.');

console.log(`Bibliothèque validée : ${chapters.length} notices, ${narratives} récits, ${timelineEvents} repères, ${traditions} traditions, ${sourced} notices sourcées, quatre espaces et cache v${configVersion}.`);