const fs = require('node:fs');
const vm = require('node:vm');

const paths = {
    data: 'ussul_data.js',
    component: 'js/components/UssulView.js',
    css: 'css/ussul-pro.css',
    config: 'js/config.js',
    worker: 'service-worker.js'
};

for (const path of Object.values(paths)) {
    if (!fs.existsSync(path)) throw new Error(`Fichier Oussoul manquant : ${path}`);
}

const dataSource = fs.readFileSync(paths.data, 'utf8');
const componentSource = fs.readFileSync(paths.component, 'utf8');
const css = fs.readFileSync(paths.css, 'utf8');
const config = fs.readFileSync(paths.config, 'utf8');
const worker = fs.readFileSync(paths.worker, 'utf8');

new vm.Script(dataSource, { filename: paths.data });
new vm.Script(componentSource, { filename: paths.component });

const context = vm.createContext({
    URL,
    URLSearchParams,
    setTimeout,
    window: {
        location: {
            href: 'http://127.0.0.1:8000/',
            protocol: 'http:',
            origin: 'http://127.0.0.1:8000'
        },
        addEventListener() {},
        removeEventListener() {},
        open() {},
        lucide: null
    },
    localStorage: {
        getItem() { return null; },
        setItem() {}
    }
});

vm.runInContext(dataSource, context, { filename: paths.data });
vm.runInContext(componentSource, context, { filename: paths.component });
const lessons = vm.runInContext('USSUL_LESSONS', context);
const component = vm.runInContext('UssulView', context);

if (!Array.isArray(lessons) || lessons.length < 5) throw new Error(`Parcours Oussoul insuffisant : ${lessons?.length || 0} leçons.`);
const internalKeys = new Set();
for (const lesson of lessons) {
    if (!lesson || typeof lesson !== 'object') throw new Error('Leçon Oussoul invalide.');
    for (const field of ['title', 'author', 'intro', 'videoUrl']) {
        if (!String(lesson[field] || '').trim()) throw new Error(`Champ ${field} absent pour la leçon ${lesson.id}.`);
    }
    if (!Array.isArray(lesson.sections) || !lesson.sections.length) throw new Error(`Sections absentes pour la leçon ${lesson.id}.`);
    for (const section of lesson.sections) {
        if (!String(section.title || '').trim() || !String(section.content || '').trim()) {
            throw new Error(`Contenu incomplet dans la leçon ${lesson.id}.`);
        }
    }
    const internalKey = component.methods.lessonKey.call({ lessons }, lesson);
    if (!internalKey || internalKeys.has(internalKey)) throw new Error(`Clé interne Oussoul dupliquée : ${internalKey}`);
    internalKeys.add(internalKey);
    const videoId = component.methods.extractYouTubeId(lesson.videoUrl);
    if (!/^[A-Za-z0-9_-]{11}$/.test(videoId)) {
        throw new Error(`URL YouTube non intégrable pour la leçon ${lesson.id} : ${lesson.videoUrl}`);
    }
}

const urlCases = [
    ['https://youtu.be/2Djsq0fghsU?si=test', '2Djsq0fghsU'],
    ['https://www.youtube.com/watch?v=r-6yO7sucBI', 'r-6yO7sucBI'],
    ['https://youtube.com/embed/of_2814q-ck', 'of_2814q-ck'],
    ['https://youtube.com/shorts/vEM7OC0XkU8', 'vEM7OC0XkU8']
];
for (const [url, expected] of urlCases) {
    const result = component.methods.extractYouTubeId(url);
    if (result !== expected) throw new Error(`Extraction YouTube incorrecte : ${url} → ${result}`);
}

const requiredComponentTokens = [
    'athar_ussul_v2',
    'lessonKey',
    ':key="lessonKey(lesson)"',
    'filteredLessons',
    'completionPercent',
    'onReaderScroll',
    'extractYouTubeId',
    'youtube-nocookie.com/embed',
    "openVideo('theater')",
    'minimizeVideo',
    'expandVideo',
    'startDrag',
    ':src="videoEmbedUrl"',
    'picture-in-picture',
    'allowfullscreen',
    'referrerpolicy="strict-origin-when-cross-origin"',
    'openExternalVideo'
];
for (const token of requiredComponentTokens) {
    if (!componentSource.includes(token)) throw new Error(`Fonction Oussoul absente : ${token}`);
}
if (componentSource.includes('autoplay=1') || componentSource.includes("autoplay: '1'")) {
    throw new Error('Le lecteur Oussoul ne doit pas forcer un autoplay susceptible d’être bloqué.');
}
if (componentSource.includes(':src="activeLesson.videoUrl"')) {
    throw new Error('Le lecteur ne doit jamais injecter directement l’URL courte YouTube dans l’iframe.');
}

for (const selector of [
    '.ussul-pro-root',
    '.ussul-pro-course-grid',
    '.ussul-pro-study',
    '.ussul-pro-reader-scroll',
    '.ussul-video-layer',
    '.ussul-video-player.is-floating',
    '.ussul-video-frame iframe'
]) {
    if (!css.includes(selector)) throw new Error(`Style Oussoul absent : ${selector}`);
}
if (!css.includes('@media(max-width:820px)') || !css.includes('prefers-reduced-motion')) {
    throw new Error('Responsive ou accessibilité Oussoul incomplet.');
}

for (const asset of ['css/ussul-pro.css', 'js/components/UssulView.js', 'ussul_data.js']) {
    if (!worker.includes(asset)) throw new Error(`Ressource Oussoul absente du cache : ${asset}`);
}
if (!config.includes('css/ussul-pro.css?v=${APP_VERSION}')) throw new Error('Feuille Oussoul non chargée par config.js.');
const configVersion = Number(config.match(/athar-pro-v(\d+)/)?.[1] || 0);
const workerVersion = Number(worker.match(/athar-pro-v(\d+)/)?.[1] || 0);
if (configVersion < 18 || configVersion !== workerVersion) throw new Error('Versions du cache Oussoul incohérentes.');

console.log(`Oussoul al-Fiqh validé : ${lessons.length} leçons, ${lessons.reduce((n, lesson) => n + lesson.sections.length, 0)} sections, clés internes stables, URLs YouTube intégrables, PiP interne et cache v${configVersion}.`);
