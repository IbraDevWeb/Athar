#!/usr/bin/env node
// Sharh : intégration, sauvegarde locale, vidéo vérifiée par son identifiant uniquement.
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const read=p=>fs.readFileSync(p,'utf8');
const data=read('sharh_course_data.js');
const view=read('js/components/SharhStudyView.js');
const host=read('js/components/HadithsView.js');
const app=read('js/app.js');
const html=read('index.html');
const css=read('css/sharh-study.css');
const config=read('js/config.js');
const sw=read('service-worker.js');
new vm.Script(data,{filename:'sharh_course_data.js'});
new vm.Script(view,{filename:'js/components/SharhStudyView.js'});
new vm.Script(host,{filename:'js/components/HadithsView.js'});
const course=vm.runInNewContext(data+'\nATHAR_SHARH_ABU_DAWUD');
assert.equal(course.id,'abu-dawud');
assert.equal(course.bookTitle,'Sunan Abî Dâwûd');
assert.ok(course.editorialNote.includes('pas pu être vérifiés'),'Absence de réserve éditoriale sur la vidéo');
assert.equal(course.lessons.length,1,'Une vidéo seulement a été communiquée');
assert.equal(course.lessons[0].videoId,'14JeEI318Xc');
assert.match(course.lessons[0].videoUrl,/^https:\/\/youtu\.be\/14JeEI318Xc\?/);
assert.equal(course.lessons[0].sourceConfirmed,false,'Métadonnées vidéo déclarées vérifiées sans preuve');
assert.ok(course.lessons.every(x=>/^[a-zA-Z0-9_-]{11}$/.test(x.videoId)),'Identifiant YouTube invalide');
for(const token of [
 'athar_sharh_abu_dawud_v1','filteredLessons','lastId','resume()',
 'youtube-nocookie.com/embed/','videoOpen','toggleFloating()','stopVideo()',
 'localStorage.setItem','saveNote(event)','toggleDone()',
 'sharh-progress','sharh-sidebar','sharh-video','sharh-method','sharh-caution',
 'noopener noreferrer','allowfullscreen'
]) assert.ok(view.includes(token),'Fonctionnalité du Sharh absente : '+token);
assert.ok(!view.includes('v-html'),'Les notes et contenus ne doivent pas être injectés en HTML');
assert.ok(view.includes('v-if="!videoOpen"'),'La vidéo doit attendre un clic');
assert.ok(!view.includes('src="https://youtu.be/'),'Ne pas injecter une URL de partage dans une iframe');
assert.ok(host.includes('sharh-study-view')&&host.includes("selectedBook.id==='abu-dawud'"),'Le cours doit rester rattaché au recueil');
assert.ok(host.includes("components: { 'sharh-study-view': SharhStudyView }"),'Composant enfant non déclaré localement dans HadithsView');
assert.ok(host.includes('sharhOpen')&&host.includes('closeSharh'),'Impossible de revenir au recueil');
assert.ok(app.includes("'sharh-study-view': SharhStudyView"),'Composant non enregistré');
for(const token of ['sharh_course_data.js','SharhStudyView.js','HadithsView.js','js/app.js']) {
 assert.ok(html.includes(token),'Chargement manquant : '+token);
}
assert.ok(html.indexOf('sharh_course_data.js')<html.indexOf('SharhStudyView.js'),'Données à charger avant composant');
assert.ok(html.indexOf('SharhStudyView.js')<html.indexOf('js/app.js'),'Composant à charger avant Vue');
assert.ok(config.includes('css/sharh-study.css?v=${APP_VERSION}'),'Feuille CSS non chargée');
for(const token of ['.sharh-study','.sharh-video.is-floating','.hadith-sharh-bridge',
 '@media(max-width:560px)','.dark .sharh-study','prefers-reduced-motion:reduce'
]) assert.ok(css.includes(token),'Style manquant : '+token);
for(const token of ['sharh_course_data.js','SharhStudyView.js','sharh-study.css'])
 assert.ok(sw.includes(token),'Fichier Sharh absent du cache : '+token);
const cacheList=sw.match(/const APP_SHELL\s*=\s*(\[[\s\S]*?\]);/);
assert.ok(cacheList,'Liste de cache absente');
const cache=vm.runInNewContext(cacheList[1]);
assert.ok(cache.length<65,'Trop de fichiers préchargés');
console.log('Sharh validé : 1 vidéo fournie, lecteur différé, notes locales, progression et affichage responsive.');
