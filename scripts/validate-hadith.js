const fs = require('node:fs');
const vm = require('node:vm');

const paths = {
    data: 'hadiths_data.js',
    library: 'js/components/HadithsView.js',
    reader: 'js/components/HadithReaderView.js',
    css: 'css/hadith-pro.css',
    config: 'js/config.js',
    worker: 'service-worker.js'
};

for (const path of Object.values(paths)) {
    if (!fs.existsSync(path)) throw new Error(`Fichier Hadith manquant : ${path}`);
}

const dataSource = fs.readFileSync(paths.data, 'utf8');
const library = fs.readFileSync(paths.library, 'utf8');
const reader = fs.readFileSync(paths.reader, 'utf8');
const css = fs.readFileSync(paths.css, 'utf8');
const config = fs.readFileSync(paths.config, 'utf8');
const worker = fs.readFileSync(paths.worker, 'utf8');

new vm.Script(dataSource, { filename: paths.data });
new vm.Script(library, { filename: paths.library });
new vm.Script(reader, { filename: paths.reader });

const context = vm.createContext({});
vm.runInContext(dataSource, context, { filename: paths.data });
const hadiths = vm.runInContext('STORED_HADITHS', context);
if (!Array.isArray(hadiths) || hadiths.length < 30) throw new Error(`Corpus de hadiths insuffisant : ${hadiths?.length || 0}`);

const ids = new Set();
let arabicCount = 0;
let explanationCount = 0;
let hintsCount = 0;
for (const [index, item] of hadiths.entries()) {
    if (!item || typeof item !== 'object') throw new Error(`Hadith invalide à l’index ${index}.`);
    const id = String(item.id || '').trim();
    if (!id) throw new Error(`Identifiant absent à l’index ${index}.`);
    if (ids.has(id)) throw new Error(`Identifiant de hadith dupliqué : ${id}`);
    ids.add(id);
    for (const field of ['title', 'hadeeth', 'attribution', 'grade']) {
        if (!String(item[field] || '').trim()) throw new Error(`Champ ${field} absent pour ${id}.`);
    }
    if (String(item.hadeeth_ar || '').trim().length > 12) arabicCount++;
    if (String(item.explanation || '').trim().length > 40) explanationCount++;
    if (Array.isArray(item.hints) && item.hints.length) hintsCount++;
}

if (arabicCount / hadiths.length < 0.75) throw new Error('Couverture arabe insuffisante dans le corpus.');
if (explanationCount / hadiths.length < 0.75) throw new Error('Couverture des explications insuffisante.');
if (hintsCount / hadiths.length < 0.20) throw new Error('Trop peu de fiches disposent d’enseignements séparés.');

const libraryTokens = [
    'hadith-pro-search', 'hadith-pro-topic-row', 'hadith-pro-grid', 'hadith-pro-card',
    'hadith-pro-advanced', 'hadith-pro-more', 'visibleLimit', 'themeRules', 'collectionOf',
    'favoritesOnly', 'unreadOnly', 'sortMode', 'hadeeth_ar', 'athar_hadith_v2',
    'state.notes', 'notes: state.notes', 'aria-label="Rechercher un hadith"'
];
for (const token of libraryTokens) if (!library.includes(token)) throw new Error(`Fonction de bibliothèque absente : ${token}`);
if (library.includes('hadith-pro-progress-view') || library.includes('hadith-pro-hero')) {
    throw new Error('L’ancienne interface à tableaux de bord est encore chargée.');
}

const readerTokens = [
    'hadith-reader-text-view', 'hadith-reader-explanation-view', 'hadith-reader-lessons-view',
    'hadith-reader-source-view', 'hadith-reader-study-view', 'hadith-reader-jump',
    'hadith-reader-notes', 'hadith-reader-source-grid', 'hadith-reader-language-switch',
    'hadeeth_intro_ar', 'explanation_ar', 'words_meanings_ar', 'studyQuestions',
    'lang="ar"', 'athar_hadith_v2', 'const paragraphs = value',
    'explanationParagraphs', 'explanationArabicParagraphs', 'saveNote',
    '<details class="hadith-reader-details hadith-reader-source-view">'
];
for (const token of readerTokens) if (!reader.includes(token)) throw new Error(`Fonction du lecteur absente : ${token}`);
if (reader.includes('hadith-reader-tabs')) {
    throw new Error('L’ancien lecteur à cinq onglets doit être remplacé par une lecture continue.');
}

const templateStart = reader.indexOf('template: `');
if (templateStart < 0) throw new Error('Template du lecteur Hadith introuvable.');
const templateSource = reader.slice(templateStart);
if (templateSource.includes('.split(/\\n')) {
    throw new Error('Expression régulière contenant \\n détectée dans le template Vue : elle serait transformée en saut de ligne à l’exécution.');
}

for (const selector of ['.hadith-pro-root', '.hadith-pro-grid', '.hadith-pro-search', '.hadith-reader-pro', '.hadith-reader-jump', '.hadith-reader-source-grid']) {
    if (!css.includes(selector)) throw new Error(`Style Hadith manquant : ${selector}`);
}
if (!css.includes('@media(max-width:820px)')) throw new Error('Responsive Hadith absent.');
if (!css.includes('prefers-reduced-motion')) throw new Error('Réduction des animations Hadith absente.');

const crafted = fs.readFileSync('css/hadith-editorial-finish.css','utf8');
if (!config.includes('css/hadith-editorial-finish.css?v=${APP_VERSION}'))
    throw new Error('Le style de finition Hadith n’est pas chargé depuis config.js.');
if (!worker.includes('css/hadith-editorial-finish.css'))
    throw new Error('Le style de finition Hadith est absent du précache PWA.');
if (config.indexOf('athar-unified-section-galleries') > config.indexOf('athar-hadith-editorial-finish'))
    throw new Error('Le style Hadith doit être chargé après le style commun.');
for (const marker of [
    '.hadith-pro-root .hadith-pro-heading', '.hadith-pro-root .hadith-pro-topic-row',
    '.hadith-pro-root .hadith-pro-card h2', '.hadith-pro-root .hadith-kutub-grid',
    '.hadith-reader-pro .hadith-reader-text-card', '.hadith-reader-pro .hadith-reader-jump',
    'flex-wrap:wrap', 'overflow:visible', 'overflow-wrap:break-word',
    '@media (max-width:610px)', '@media (max-width:360px)', 'prefers-reduced-motion:reduce'
]) if (!crafted.includes(marker)) throw new Error('Finition Hadith manquante : '+marker);
if (library.includes('class="hadith-pro-count"')) throw new Error('L’ancien compteur géant demeure.');
if (!library.includes('hadith-pro-card-actions') || !library.includes('hadith-pro-card-reference'))
    throw new Error('Les titres et références des cartes ne disposent pas de la structure finale.');
if (crafted.includes('.library-pro-root') || crafted.includes('.adhkar-pro-shell') || crafted.includes('.timeline-pro'))
    throw new Error('La surcharge Hadith ne doit toucher aucune autre rubrique.');

for (const asset of ['css/hadith-pro.css', 'js/components/HadithsView.js', 'js/components/HadithReaderView.js', 'hadiths_data.js']) {
    if (!worker.includes(asset)) throw new Error(`Ressource Hadith absente du cache : ${asset}`);
}
if (!config.includes('css/hadith-pro.css?v=${APP_VERSION}')) throw new Error('Feuille Hadith non chargée par config.js.');
const configVersion = Number(config.match(/athar-pro-v(\d+)/)?.[1] || 0);
const workerVersion = Number(worker.match(/athar-pro-v(\d+)/)?.[1] || 0);
if (configVersion < 17 || configVersion !== workerVersion) throw new Error('Migration du cache Hadith incohérente.');

console.log(`Hadiths validés : ${hadiths.length} textes, ${arabicCount} en arabe, ${explanationCount} explications, lecteur Vue sûr et cache v${configVersion}.`);