#!/usr/bin/env node
const fs = require('node:fs'), path = require('node:path');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
const index=read('index.html'), app=read('js/app.js'), home=read('js/components/HomeView.js');
const mobile=read('js/components/MobileExperience.js'), config=read('js/config.js');
const worker=read('service-worker.js'), research=read('research-library.html');
const immersive=read('js/components/GlobalFullscreen.js'), lens=read('js/components/AtharLens.js');
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
check(lens.includes('PUBLISHED_VIEWS.has(item?.route?.view)'), 'Athar Lens contient des sections non publiées');
check(!config.includes("writeEarlyScript('js/components/ScholarV4Bootstrap.js'"),'Module recherche injecté');
check(research.includes("window.location.replace(new URL('./index.html', window.location.href))"),'Redirection recherche manquante');
check(config.includes('css/athar-launch.css?v=athar-public-1'),'Styles accueil absents');
const version=config.match(/const APP_VERSION = '([^']+)'/)?.[1];
check(Boolean(version)&&worker.includes("const CACHE_VERSION = '"+version+"'"),'Version PWA incorrecte');
check((index.match(/<div\b/g)||[]).length===(index.match(/<\/div>/g)||[]).length,'Balises div déséquilibrées');
if(errors.length){errors.forEach(x=>console.error(x));process.exit(1)}
console.log('Sept rubriques publiques : navigation, accueil, cache et redirection validés.');
