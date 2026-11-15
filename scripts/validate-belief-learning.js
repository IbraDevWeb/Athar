#!/usr/bin/env node
const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');
const read=p=>fs.readFileSync(p,'utf8');
const src=read('belief_course_data.js'), view=read('js/components/BeliefLearningView.js');
const home=read('js/components/HomeView.js'),app=read('js/app.js'),nav=read('js/components/GlobalFullscreen.js');
const mobile=read('js/components/MobileExperience.js'), hadiths=read('js/components/HadithsView.js');
const html=read('index.html'),css=read('css/belief-learning.css'),config=read('js/config.js'),sw=read('service-worker.js');
new vm.Script(src,{filename:'belief_course_data.js'});
new vm.Script(view,{filename:'js/components/BeliefLearningView.js'});
const data=vm.runInNewContext(src+'\nATHAR_BELIEF_COURSE');
assert.equal(data.title,'Apprentissage de la croyance');
assert.equal(data.id,'belief');
assert.equal(data.lessons.length,1,'Seul un enregistrement a été fourni');
const l=data.lessons[0];assert.equal(l.audioDurationSeconds,1593);
assert.equal(l.videoId,'14JeEI318Xc');
assert.equal(l.transcriptStatus,'non_verifie','Transcription non vérifiée ne doit pas être présentée comme approuvée');
assert.equal(l.transcript,'','Ne pas fabriquer de transcription');
assert.deepEqual(Array.from(l.sections),[],'Aucune partie ne peut être attribuée sans écouter/transcrire');
assert.ok(Array.isArray(data.glossary)&&data.glossary.length>=4,'Lexique introductif absent');
assert.ok(data.glossaryNotice.includes('indépendant du contenu oral'),'Le lexique doit être clairement distinct de l’audio');
assert.ok(data.editorialNote.includes('pas encore établies'),'L’état éditorial doit rester transparent');
for(const key of ['athar_belief_learning_v1','localStorage.setItem','filteredLessons','resume()','toggleDone()','saveNote(event)','youtube-nocookie.com/embed/','toggleFloating()','belief-transcript-empty','belief-glossary-grid','belief-method','noopener noreferrer','v-if="!videoOpen"'])
 assert.ok(view.includes(key),'Fonctionnalité manquante : '+key);
assert.ok(!view.includes('v-html'),'Aucune injection HTML pour notes, lexique ou cours');
assert.ok(app.includes("'belief-learning-view': BeliefLearningView"),'Composant non enregistré');
assert.ok(app.includes("'tasbih', 'belief'"),'8e rubrique non publiée');
assert.ok(html.includes('viewMode === \'belief\''),'Affichage de la rubrique non accessible');
assert.ok(html.includes("setView('belief')"),'Lien de menu absent');
assert.ok(html.includes('<belief-learning-view'),'Composant non monté');
assert.ok(home.includes("view: 'belief'"),'Huitième carte d’accueil absente');
assert.ok(nav.includes("['belief', 'Apprentissage de la croyance'"),'Menu immersif incomplet');
assert.ok(mobile.includes("belief: 'Apprentissage de la croyance'"),'Menu mobile incomplet');
assert.ok(!hadiths.includes('SharhStudyView') && !hadiths.includes('sharhOpen') && !hadiths.includes('sharhCourse'),
 'Ancienne association erronée à Abî Dâwûd toujours présente');
assert.ok(html.indexOf('belief_course_data.js')<html.indexOf('BeliefLearningView.js'),'Données avant composant');
assert.ok(html.indexOf('BeliefLearningView.js')<html.indexOf('js/app.js'),'Composant avant initialisation');
for(const token of ['.belief-study','.belief-glossary-grid','.belief-video.is-floating','.dark .belief-study','@media(max-width:560px)','prefers-reduced-motion:reduce'])
 assert.ok(css.includes(token),'Style non pris en charge : '+token);
assert.ok(config.includes('css/belief-learning.css?v=${APP_VERSION}'),'CSS dynamique non chargé');
for(const t of ['belief_course_data.js','BeliefLearningView.js','belief-learning.css'])
 assert.ok(sw.includes(t),'Fichier absent du cache : '+t);
const m=sw.match(/const APP_SHELL\s*=\s*(\[[\s\S]*?\]);/);
assert.ok(m,'Liste cache absente');const shell=vm.runInNewContext(m[1]);
assert.ok(shell.length<65,'Limite de cache dépassée');
console.log('Huitième rubrique croyance, cours vidéo, lexique général, transcription annoncée non vérifiée, navigateur et PWA reliés.');
