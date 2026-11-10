#!/usr/bin/env node
const fs = require('node:fs'), path = require('node:path');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
const index=read('index.html'), app=read('js/app.js'), home=read('js/components/HomeView.js');
const mobile=read('js/components/MobileExperience.js'), config=read('js/config.js');
const worker=read('service-worker.js');
const immersive=read('js/components/GlobalFullscreen.js');
const immersiveCss=read('css/immersive-only.css');
const allowed=['home','library','timeline','glossary','hadiths','tabib','adhkar','tasbih'];
const published=allowed.slice(1), errors=[];
const check=(ok,msg)=>{if(!ok)errors.push(msg)};
const nav=[...index.matchAll(/@click="setView\('([^']+)'\)/g)].map(x=>x[1]);
for(const mode of published){
 check(nav.includes(mode),'Navigation absente : '+mode);
 check(home.includes("view: '"+mode+"'"),'Accueil incomplet : '+mode);
}
check(nav.every(x=>allowed.includes(x)),'Navigation non publiée : '+nav.filter(x=>!allowed.includes(x)));
check((home.match(/view: '/g)||[]).length===7,'Accueil : nombre de cartes incorrect');
check(app.includes('if (!isAvailableView(mode))'),'Garde de navigation manquant');
check(app.includes('watch(viewMode, mode =>'),'Garde de changement direct manquant');
check(mobile.includes("['adhkar', 'Al-Adhkar', 'sunrise']"),'Dock mobile erroné');
check(mobile.includes('if (!published.has(view)) return;'),'Filtrage mobile manquant');
check(immersive.includes('PUBLISHED_VIEWS.has(view)'), 'Menu immersif non filtré');
check(index.includes('athar-app-fullscreen athar-immersive-only'), 'Le mode immersif doit être actif dès le HTML');
check(!immersive.includes('requestFullscreen') && !immersive.includes('exitFullscreen'), 'Le navigateur ne doit pas être basculé en plein écran');
check(!immersive.includes('athar-fullscreen-toggle') && !immersive.includes('athar-fullscreen-exit'), 'Anciens boutons grand écran encore créés');
check(immersive.includes('athar-immersive-quick') && immersive.includes('DETAIL_PARENT'), 'Navigation Retour/Tasbih absente');
check(immersiveCss.includes('.athar-global-sidebar') && immersiveCss.includes('display: none !important'), 'La barre latérale doit être masquée');
check(immersiveCss.includes('.tasbih-counter-button'), 'Adaptation Tasbih au téléphone absente');
check(!config.includes("writeEarlyScript('js/components/AtharLens.js'"), 'Moteur Athar Lens encore chargé');
check(!config.includes("css/athar-lens.css"), 'Styles Athar Lens encore chargés');
check(!worker.includes("'./js/components/AtharLens.js?"), 'Moteur Athar Lens encore précaché');
check(home.includes('hadithSlides') && home.includes('openCurrentHadith') && home.includes('previousHadith'), 'Carrousel de hadiths absent');
check(home.includes("props: ['setView', 'hadiths', 'openHadith']"), 'Le carrousel ne reçoit pas le corpus existant');
check(index.includes(':open-hadith="openHadith"'), 'Le bouton de lecture n’ouvre pas la fiche');
check(!config.includes('ScholarV4Bootstrap') && !config.includes('research-library'), 'Un module documentaire est encore injecté');
check(!index.includes('research-library.html'), 'L’ancienne interface de recherche est encore référencée');
check(!worker.includes('/rag/') && !worker.includes('research-library'), 'Le cache inclut encore des dépendances RAG');
check(config.includes('css/athar-launch.css?v=athar-public-3'),'Styles accueil absents');
const version=config.match(/const APP_VERSION = '([^']+)'/)?.[1];
check(Boolean(version)&&worker.includes("const CACHE_VERSION = '"+version+"'"),'Version PWA incorrecte');
check((index.match(/<div\b/g)||[]).length===(index.match(/<\/div>/g)||[]).length,'Balises div déséquilibrées');
if(errors.length){errors.forEach(x=>console.error(x));process.exit(1)}
console.log('Sept rubriques publiques : navigation, accueil et cache autonomes validés.');
