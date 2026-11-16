#!/usr/bin/env node
// Fiqh malikite : contrôle des six fiches, fondées sur les passages vérifiés d'al-Hattâb.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(p,'utf8');
const data=read('fiqh_maliki_data.js'),view=read('js/components/MalikiFiqhView.js'),css=read('css/fiqh-maliki.css');
const html=read('index.html'),app=read('js/app.js'),home=read('js/components/HomeView.js'),sw=read('service-worker.js');
const global=read('js/components/GlobalFullscreen.js'),mobile=read('js/components/MobileExperience.js'),config=read('js/config.js');
new vm.Script(data);new vm.Script(view);
const book=vm.runInNewContext(data+'\nATHAR_MALIKI_FIQH_COURSE');
assert.equal(book.sectionTitle,'Fiqh malikite');
assert.equal(book.book.sourceUrl,'https://usul.ai/ar/t/mawahib-al-jalil-fi-sharh-mukhtasar-khalil');
assert.match(book.book.arabicTitle,/مَوَاهِبُ الْجَلِيلِ/);
assert.match(book.book.author,/Hattâb/);assert.match(book.book.death,/954/);assert.match(book.book.edition,/1412/);
assert.equal(book.intro.number,'01');assert.equal(book.intro.sections.length,4);
assert.deepEqual(Array.from(book.intro.sections,x=>x.id),['fiqh','authors','commentary','method'],'Sections modifiées');
for(const s of book.intro.sections)assert.ok(s.title&&s.paragraphs.length>=2&&s.sourceNote);
assert.equal(book.intro.lexicon.length,6);
assert.ok(book.intro.lexicon.every(x=>x.arabic&&x.term&&x.definition.length>40));
assert.equal(book.intro.quiz.length,3);
for(const q of book.intro.quiz)assert.ok(q.choices.length===3&&q.answer>=0&&q.answer<3&&q.explanation);
assert.equal(book.intro.quote.arabic,'إلَّا أَنَّهُ لِفَرْطِ الْإِيجَازِ كَادَ يُعَدُّ مِنْ جُمْلَةِ الْأَلْغَازِ');
assert.ok(book.intro.quote.arabic.split(/\s+/).length<=15);
assert.ok(book.intro.quote.label.includes('pas une traduction littérale'));
assert.equal(book.intro.sources.length,2);
assert.ok(book.intro.sources.some(x=>x.url.startsWith('https://islamweb.net/ar/library/content/19/1/')));
assert.equal(book.purification.number,'02');
assert.equal(book.purification.id,'tahara-02');
assert.equal(book.purification.sections.length,4);
assert.deepEqual(Array.from(book.purification.sections,x=>x.id),['opening','meaning','distinction','water']);
for(const section of book.purification.sections) assert.ok(section.title&&section.paragraphs.length>=2&&section.sourceNote);
assert.equal(book.purification.lexicon.length,6);
assert.ok(book.purification.lexicon.every(x=>x.arabic&&x.term&&x.definition.length>=40));
assert.equal(book.purification.quiz.length,3);
for(const q of book.purification.quiz) assert.ok(q.choices.length===3&&q.answer>=0&&q.answer<3&&q.explanation);
assert.equal(book.purification.quote.arabic,'بالمطلق وهو ما صدق عليه اسم ماء بلا قيد');
assert.ok(book.purification.quote.label.includes('Mukhtasar de Khalîl'),'Attribution du texte de Khalîl perdue');
assert.equal(book.purification.sources.length,2);
assert.ok(book.purification.sources.some(x=>x.url.startsWith('https://www.islamweb.net/ar/library/content/19/84/')));
assert.equal(book.naturalWaters.id,'natural-waters-03');
assert.equal(book.naturalWaters.number,'03');
assert.equal(book.naturalWaters.sections.length,4);
assert.deepEqual(Array.from(book.naturalWaters.sections,x=>x.id),['name-and-origin','dew','snow','scope']);
for(const section of book.naturalWaters.sections) assert.ok(section.title&&section.paragraphs.length>=2&&section.sourceNote);
assert.equal(book.naturalWaters.lexicon.length,6);
assert.ok(book.naturalWaters.lexicon.every(x=>x.arabic&&x.term&&x.definition.length>=40));
assert.equal(book.naturalWaters.quiz.length,3);
for(const q of book.naturalWaters.quiz) assert.ok(q.choices.length===3&&q.answer>=0&&q.answer<3&&q.explanation);
assert.equal(book.naturalWaters.quote.arabic,'وَإِنْ جُمِعَ مِنْ نَدًى');
assert.ok(book.naturalWaters.quote.label.includes('Mukhtasar de Khalîl'),'L’extrait arabe est attribué à Khalîl');
assert.equal(book.naturalWaters.sources.length,4);
assert.ok(book.naturalWaters.sources.some(x=>x.url.includes('/19/85/')),'Source page 46 manquante');
assert.ok(book.naturalWaters.sources.some(x=>x.url.includes('/19/87/')),'Source rosée page 51 manquante');
assert.ok(book.naturalWaters.sources.some(x=>x.url.includes('/19/88/')),'Source neige fondue page 51 manquante');
const newLessons = [
  {key:'waterChanges',id:'water-changes-04',number:'04',sections:['transition','properties','cause','method'],quote:'لَوْنًا أَوْ طَعْمًا أَوْ رِيحًا',pages:['/19/101/']},
  {key:'pureMixtures',id:'pure-mixtures-05',number:'05',sections:['pure-vs-purifying','examples','mixing','small-change'],quote:'طَاهِرٌ غَيْرُ مُطَهِّرٍ',pages:['/19/101/']},
  {key:'impureContact',id:'impure-contact-06',number:'06',sections:['changed','notchanged','disagreement','synthesis'],quote:'وَيَسِيرٌ كَآنِيَةِ وُضُوءٍ وَغُسْلٍ بِنَجَسٍ لَمْ يَتَغَيَّرْ',pages:['/19/101/','/19/109/']}
];
for(const spec of newLessons){
  const entry=book[spec.key];
  assert.ok(entry,'Fiche manquante : '+spec.key);
  assert.equal(entry.id,spec.id);assert.equal(entry.number,spec.number);
  assert.equal(entry.sections.length,4);
  assert.deepEqual(Array.from(entry.sections,x=>x.id),spec.sections);
  for(const section of entry.sections)assert.ok(section.title&&section.paragraphs.length===2&&section.paragraphs.every(p=>p.length>100)&&section.sourceNote,'Section incomplète');
  assert.equal(entry.lexicon.length,6);
  assert.ok(entry.lexicon.every(x=>x.arabic&&x.term&&x.definition.length>65),'Lexique incomplet');
  assert.equal(entry.quiz.length,3);
  for(const question of entry.quiz)assert.ok(question.choices.length===3&&question.answer>=0&&question.answer<3&&question.explanation.length>70);
  assert.equal(entry.quote.arabic,spec.quote);
  assert.ok(entry.quote.label.includes('al-Hattâb')||entry.quote.label.includes('Khalîl'),'Attribution de la citation manquante');
  assert.ok(entry.sources.some(x=>x.url.startsWith('https://usul.ai/')));
  for(const path of spec.pages)assert.ok(entry.sources.some(x=>x.url.includes(path)),'Source primaire manquante : '+path);
}
assert.equal(new Set(newLessons.flatMap(spec=>book[spec.key].lexicon.map(x=>x.term))).size,18,'Lexique dupliqué dans les trois fiches');
const advancedLessons = [
 {key:'usedWater',number:'07',id:'used-water-07',ids:['third-category','what-used-means','different-opinions','context-and-limits'],quote:'وكره ماء مستعمل في حدث',urls:['/19/107/']},
 {key:'recommendedWater',number:'08',id:'recommended-used-water-08',ids:['why-distinguish','source-disagreement','washes','classify'],quote:'وفي غيره تردد',urls:['/19/108/']},
 {key:'flowingWater',number:'09',id:'flowing-stagnant-water-09',ids:['water-flow','where-falls','stagnant','no-mechanical-rule'],quote:'وراكد يغتسل فيه',urls:['/19/111/','/19/113/']}
];
for(const spec of advancedLessons){
 const entry=book[spec.key];assert.ok(entry,'Fiche manquante : '+spec.key);
 assert.equal(entry.id,spec.id);assert.equal(entry.number,spec.number);
 assert.equal(entry.sections.length,4);
 assert.deepEqual(Array.from(entry.sections,s=>s.id),spec.ids);
 for(const section of entry.sections) assert.ok(section.title&&section.paragraphs.length===2&&section.paragraphs.every(p=>p.length>=240)&&section.sourceNote,'Section incomplète '+spec.key);
 assert.equal(entry.lexicon.length,6);
 assert.ok(entry.lexicon.every(x=>x.arabic&&x.term&&x.definition.length>65));
 assert.equal(entry.quiz.length,3);
 for(const question of entry.quiz) assert.ok(question.choices.length===3&&question.answer>=0&&question.answer<3&&question.explanation.length>75);
 assert.equal(entry.quote.arabic,spec.quote);
 assert.ok(entry.quote.label.includes('Khalîl')&&entry.quote.label.includes('al-Hattâb'),'Attribution incorrecte');
 assert.ok(entry.sources.some(x=>x.url===book.book.sourceUrl));
 for(const path of spec.urls) assert.ok(entry.sources.some(x=>x.url.includes(path)),'Source arabe manquante : '+path);
}
assert.equal(new Set(advancedLessons.flatMap(spec=>book[spec.key].lexicon.map(x=>x.term))).size,18,'Les 18 entrées de lexique doivent être distinctes entre les trois fiches');
const latestLessons = [
 {key:'publicBasins',number:'10',id:'public-basins-10',ids:['context','changed','unchanged','renewal'],quote:'وَأَمَّا مَا يُفْرَغُ بِسُرْعَةٍ وَيُجَدَّدُ لَهُ مَاءٌ آخَرُ فَأَمْرُهُ خَفِيفٌ',urls:['/19/114/']},
 {key:'limitedWell',number:'11',id:'well-necessity-11',ids:['well','procedure','necessity','washing-basin'],quote:'يَحْتَالُ حَتَّى يَغْسِلَ يَدَيْهِ وَيَغْرِفَ وَيَغْتَسِلَ',urls:['/19/115/','/19/116/']},
 {key:'leftoverWater',number:'12',id:'leftover-water-12',ids:['term','evidence','cat','food'],quote:'لَا إِنْ عَسُرَ الِاحْتِرَازُ مِنْهُ أَوْ كَانَ طَعَامًا',urls:['/19/117/','/19/118/']}
];
for(const spec of latestLessons){
 const entry=book[spec.key];assert.ok(entry,'Nouvelle fiche absente : '+spec.key);
 assert.equal(entry.id,spec.id);assert.equal(entry.number,spec.number);
 assert.equal(entry.sections.length,4);
 assert.deepEqual(Array.from(entry.sections,s=>s.id),spec.ids);
 for(const section of entry.sections) assert.ok(section.title&&section.paragraphs.length===2&&section.paragraphs.every(p=>p.length>=240)&&section.sourceNote,'Développement incomplet : '+spec.key);
 assert.equal(entry.lexicon.length,6);
 assert.ok(entry.lexicon.every(x=>x.arabic&&x.term&&x.definition.length>=65),'Lexique incomplet : '+spec.key);
 assert.equal(entry.quiz.length,3);
 for(const question of entry.quiz)assert.ok(question.choices.length===3&&question.answer>=0&&question.answer<3&&question.explanation.length>75,'Quiz incomplet : '+spec.key);
 assert.equal(entry.quote.arabic,spec.quote);
 assert.ok(entry.quote.label.includes('al-Hattâb'),'Attribution arabe non explicitée : '+spec.key);
 assert.ok(entry.sources.some(x=>x.url===book.book.sourceUrl),'Source Usul manquante');
 for(const id of spec.urls)assert.ok(entry.sources.some(x=>x.url.includes(id)),'Source Islamweb manquante : '+id);
}
assert.equal(new Set(latestLessons.flatMap(spec=>book[spec.key].lexicon.map(x=>x.term))).size,18,'Les dix-huit termes des nouvelles fiches doivent être distincts');
assert.ok(book.nextChapter.status.includes('fiche 13 non publiée'));
assert.equal(['intro','purification','naturalWaters','waterChanges','pureMixtures','impureContact','usedWater','recommendedWater','flowingWater','publicBasins','limitedWell','leftoverWater'].filter(key=>book[key]?.status==='disponible').length,12,'Douze fiches réellement accessibles');
for(const t of ['role="tablist"','role="tabpanel"','lesson.sections','lesson.value?.lexicon','lesson.quiz','lesson.quote.arabic','lesson.sources','fiqh-m-source-button','fiqh-m-terms','fiqh-m-quiz','localStorage','selectedLessonKey','selectLesson(entry.key)','athar_fiqh_maliki_tahara_02_done','athar_fiqh_maliki_eaux_03_done','athar_fiqh_maliki_eaux_04_done','athar_fiqh_maliki_eaux_05_done','athar_fiqh_maliki_eaux_06_done','athar_fiqh_maliki_eaux_07_done','athar_fiqh_maliki_eaux_08_done','athar_fiqh_maliki_eaux_09_done','athar_fiqh_maliki_eaux_10_done','athar_fiqh_maliki_eaux_11_done','athar_fiqh_maliki_eaux_12_done','availableLessons','completedCount','course[entry.key].number','fiqh-m-index','fiqh-m-catalog-card','fiqh-m-index-search','fiqh-m-index-progress','fiqh-m-index-resume','fiqh-m-index-back','fiqh-m-index-grid','filteredLessons','handleBack','athar_fiqh_maliki_last_lesson'])assert.ok(view.includes(t),'Composant incomplet : '+t);
assert.ok(css.includes('.dark .fiqh-m-root')&&css.includes('@media(max-width:540px)')&&css.includes('prefers-reduced-motion'));
for(const token of ['.fiqh-m-index-grid','.fiqh-m-catalog-card','.fiqh-m-index-progress','.fiqh-m-index-ring','@media(max-width:610px)']) assert.ok(css.includes(token),'Style catalogue absent : '+token);
assert.ok(view.includes("Vue.ref(null)"),'L’entrée par défaut doit être le sommaire et non la fiche 01');
assert.ok(view.includes("selectedLessonKey.value = null"),'Retour au sommaire manquant');
assert.ok(html.includes('<maliki-fiqh-view :course="malikiFiqhCourse"'));
for(const p of ['fiqh_maliki_data.js','js/components/MalikiFiqhView.js','css/fiqh-maliki.css'])assert.ok(fs.existsSync(p),'Ressource Fiqh absente '+p);
assert.ok(html.indexOf('fiqh_maliki_data.js')<html.indexOf('MalikiFiqhView.js')&&html.indexOf('MalikiFiqhView.js')<html.indexOf('js/app.js'));
assert.ok(app.includes("'maliki-fiqh-view': MalikiFiqhView")&&app.includes("'fiqh-maliki',"));
assert.ok(home.includes("view: 'fiqh-maliki'")&&home.includes("number: '09'"));
assert.ok(global.includes("['fiqh-maliki', 'Fiqh malikite', 'book-marked']"));
assert.ok(mobile.includes("['fiqh-maliki', '.fiqh-m-root']"));
assert.ok(config.includes('css/fiqh-maliki.css?v='));
for(const p of ['fiqh_maliki_data.js','MalikiFiqhView.js','fiqh-maliki.css'])assert.ok(sw.includes(p));
const m=sw.match(/const APP_SHELL\s*=\s*(\[[\s\S]*?\]);/);assert.ok(m);
const shell=vm.runInNewContext(m[1]);assert.ok(shell.length>=65&&shell.length<70&&new Set(shell).size===shell.length);
assert.ok(!html.includes('BeliefLearningView.js')&&!sw.includes('belief_course_data.js'));
console.log('Fiqh malikite : catalogue et 12 fiches vérifiés, recherche, progression, 4 parties et 6 notions chacune, 3 questions par fiche, 9 sections publiques ; '+shell.length+' ressources PWA.');
