#!/usr/bin/env node
const fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(p,'utf8');
const source=read('ussul_data.js'), view=read('js/components/UssulView.js');
const css=read('css/ussul-pro.css'),app=read('js/app.js'),html=read('index.html');
const home=read('js/components/HomeView.js'),nav=read('js/components/GlobalFullscreen.js');
const mobile=read('js/components/MobileExperience.js'),sw=read('service-worker.js'),config=read('js/config.js');
// Le blob original (avant masquage de la section) fait foi : aucun texte ne doit être réécrit ou omis.
const dataBytes=Buffer.from(source,'utf8');
const gitSha=crypto.createHash('sha1').update('blob '+dataBytes.length+'\0').update(dataBytes).digest('hex');
assert.equal(gitSha,'cc94c05ffc6a576fc77a510ff9d5af8878031a16','Le corpus original des leçons a été altéré');
new vm.Script(source);new vm.Script(view);
const context=vm.createContext({ URL,URLSearchParams,window:{location:{href:'https://example.com/',origin:'https://example.com',protocol:'https:'}},localStorage:{} });
vm.runInContext(source,context);vm.runInContext(view,context);
const lessons=vm.runInContext('USSUL_LESSONS',context);
const component=vm.runInContext('UssulView',context);
assert.equal(lessons.length,7,'Les sept leçons historiques doivent être conservées');
const keys=new Set();
let nSections=0,nDeepDives=0,markedTerms=0;
for(const lesson of lessons){
 assert.ok(lesson.title&&lesson.author&&lesson.intro&&lesson.videoUrl,'Métadonnées d’une leçon manquantes');
 assert.ok(Array.isArray(lesson.sections)&&lesson.sections.length,'Leçon sans son contenu');
 const key=component.methods.lessonKey.call({lessons},lesson);
 assert.ok(!keys.has(key),'Identifiants UI de leçon dupliqués');keys.add(key);
 const video=component.methods.extractYouTubeId(lesson.videoUrl);
 assert.match(video,/^[A-Za-z0-9_-]{11}$/,'Identifiant vidéo non reconnu');
 for(const section of lesson.sections){
   nSections++;
   assert.ok(section.title && typeof section.content==='string' && section.content.length>20,'Texte de section supprimé');
   markedTerms+=(section.content.match(/\{[^{}\r\n]{1,72}\}/g)||[]).length;
   if(section.deepDive){
     nDeepDives++;
     assert.ok(section.deepDive.title && section.deepDive.content,'Encadré pédagogique supprimé');
     markedTerms+=(section.deepDive.content.match(/\{[^{}\r\n]{1,72}\}/g)||[]).length;
   }
 }
}
assert.ok(nSections>=20,'Sections historiques perdues : '+nSections);
assert.ok(nDeepDives>=8,'Encadrés approfondis perdus : '+nDeepDives);
assert.ok(markedTerms>=100,'Termes de lexique manquants : '+markedTerms);
assert.ok(view.includes('v-html="formatText(section.content)"') && view.includes('formatText(section.deepDive.content)'),'Corps ou approfondissements non rendus');
assert.ok(view.includes('athar_ussul_v2'),'Progression historique ne doit pas être effacée');
for(const token of ['glossaryEntries()','filteredGlossary()','visibleGlossary()','openGlossary()','goToGlossaryEntry(entry)','ussul-glossary-grid','ussul-glossary-context','v-for="entry in visibleGlossary"'])
 assert.ok(view.includes(token),'Lexique dynamique incomplet : '+token);
assert.ok(view.includes('GLOSSARY_DATA'),'Les définitions du lexique Athar doivent être reprises si disponibles');
assert.ok(view.includes('youtube-nocookie.com/embed/') && view.includes('minimizeVideo()') && view.includes('expandVideo()'),'Lecteur vidéo PiP incomplet');
assert.ok(app.includes("'ussul-view': UssulView") && app.includes("'tasbih', 'ussul'"),'Usûl non publié par Vue');
assert.ok(!app.includes("'belief-learning-view': BeliefLearningView"),'Croyance encore enregistrée dans Vue');
assert.ok(home.includes("view: 'ussul'") && !home.includes("view: 'belief'"),'Accueil non mis à jour');
assert.ok(nav.includes("['ussul', 'Usûl al-Fiqh'") && !nav.includes("['belief',"),'Navigation immersive incorrecte');
assert.ok(mobile.includes("ussul: 'Usûl al-Fiqh'") && !mobile.includes("belief: '"),'Navigation mobile incorrecte');
assert.ok(html.includes("setView('ussul')") && !html.includes("setView('belief')"),'Menu non mis à jour');
assert.ok(html.includes("<ussul-view") && !html.includes("<belief-learning-view"),'Rendu de module incorrect');
assert.ok(html.indexOf('ussul_data.js')>0 && html.indexOf('ussul_data.js')<html.indexOf('UssulView.js') && html.indexOf('UssulView.js')<html.indexOf('js/app.js'),'Ordre de chargement invalide');
assert.ok(!html.includes('belief_course_data.js') && !html.includes('BeliefLearningView.js'),'Ressources Croyance encore chargées');
assert.ok(css.includes('.ussul-glossary-panel') && css.includes('.ussul-pro-prose') && css.includes('.ussul-video-player.is-floating'),'Design incomplet');
assert.ok(css.includes('html.athar-app-fullscreen .ussul-pro-root') && css.includes('prefers-reduced-motion'),'Adaptation globale ou accessibilité absente');
assert.ok(config.includes('css/ussul-pro.css?v=${APP_VERSION}'),'CSS Usûl absent du loader');
assert.ok(!config.includes('css/belief-learning.css'),'CSS Croyance encore chargé');
for(const path of ['ussul_data.js','UssulView.js','ussul-pro.css'])assert.ok(sw.includes(path),'Ressource Usûl non précachée : '+path);
for(const path of ['belief_course_data.js','BeliefLearningView.js','belief-learning.css'])assert.ok(!sw.includes(path),'Croyance ne doit pas être précachée : '+path);
const assets=vm.runInNewContext(sw.match(/const APP_SHELL\s*=\s*(\[[\s\S]*?\]);/)[1]);
assert.ok(assets.length<65 && new Set(assets).size===assets.length,'Ressources PWA excessives ou en doublon');
console.log('Usûl : '+lessons.length+' cours originaux, '+nSections+' sections, '+nDeepDives+' approfondissements, '+markedTerms+' occurrences de notions balisées ; huitième rubrique accessible, croyance masquée.');
