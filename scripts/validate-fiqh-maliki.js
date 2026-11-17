#!/usr/bin/env node
// Fiqh malikite : contrôle des seize fiches, fondées sur les passages vérifiés d'al-Hattâb.
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
assert.equal(book.intro.goals.length,4,'Quatre objectifs de compréhension attendus');
assert.ok(book.intro.subtitle.includes('traduire')||book.intro.subtitle.includes('traduire'),'But pédagogique non indiqué');
assert.deepEqual(Array.from(book.intro.sections,x=>x.id),['fiqh','authors','commentary','method'],'Sections modifiées');
for(const section of book.intro.sections){
 assert.ok(section.title&&section.paragraphs.length===2&&section.sourceNote);
 assert.ok(section.paragraphs.every(p=>p.length>=200),'Les paragraphes doivent expliquer, pas résumer en une ligne');
 assert.ok(section.passage?.arabic&&section.passage.translation&&section.passage.explanation&&section.passage.sourceLabel,'Citation et traduction absentes');
 assert.ok(section.steps?.length>=3&&section.steps.every(st=>st.label&&st.text.length>=140),'Découpage du passage trop succinct');
 assert.ok(section.example?.title&&section.example.text.length>=220,'Exemple concret insuffisant');
 assert.ok(section.takeaway?.length>=120,'À retenir insuffisant');
 assert.ok(section.sourceNote.includes('tome 1'),'Référence précise absente');
}
assert.deepEqual(Array.from(book.intro.sections,s=>s.passage.arabic),[
 'فساد العبادة وصحتها','صغر حجمه وكثر علمه','ما به الفتوى وما هو الأرجح','وأميل إلى البسط والإيضاح'
]);
assert.equal(book.intro.lexicon.length,8);
assert.ok(book.intro.lexicon.every(x=>x.arabic&&x.term&&x.definition.length>40));
assert.equal(book.intro.quiz.length,5);
for(const q of book.intro.quiz)assert.ok(q.choices.length===3&&q.answer>=0&&q.answer<3&&q.explanation);
assert.equal(book.intro.quote.arabic,'كاد يعد من جملة الألغاز');
assert.ok(book.intro.quote.arabic.split(/\s+/).length<=15);
assert.ok(book.intro.quote.label.includes('traduction de sens contextualisée'));
assert.equal(book.intro.sources.length,2);
assert.ok(book.intro.sources.some(x=>x.url.startsWith('https://islamweb.net/ar/library/content/19/1/')));
assert.equal(book.purification.number,'02');
assert.equal(book.purification.id,'tahara-02');
assert.equal(book.purification.sections.length,5,'La fiche 02 doit approfondir cinq étapes');
assert.equal(book.purification.goals.length,5);
assert.deepEqual(Array.from(book.purification.sections,x=>x.id),['opening','meaning','hadath','distinction','water']);
assert.deepEqual(Array.from(book.purification.sections,x=>x.passage.arabic),[
 'النزاهة والنظافة من الأدناس والأوساخ',
 'رفع الحدث وإزالة النجاسة',
 'المشهور أنه لا يرفع الحدث',
 'فما ذكره هو المشهور في المذهب',
 'ما صدق عليه اسم ماء بلا قيد'
],'Citations arabes du Livre de la purification altérées');
for(const section of book.purification.sections){
 assert.ok(section.title&&section.paragraphs.length===2&&section.sourceNote);
 assert.ok(section.paragraphs.every(p=>p.length>=350),'Une explication de la fiche 02 est trop courte : '+section.id);
 assert.ok(section.passage?.arabic&&section.passage.translation&&section.passage.explanation,'Citation non expliquée');
 assert.ok(section.passage.sourceUrl?.startsWith('https://'),'Lien direct au passage original manquant');
 assert.ok(section.steps.length>=3&&section.steps.every(step=>step.label&&step.text.length>=130),'Décomposition insuffisante : '+section.id);
 assert.ok(section.example?.text.length>=280&&section.takeaway?.length>=150,'Exemple ou enseignement trop court');
 assert.ok(section.sourceNote.includes('t. 1'),'Référence de page manquante');
}
assert.ok(book.purification.sections[2].passage.explanation.includes('mashhûr'),'L’avis connu sur le tayammum doit être contextualisé');
assert.ok(book.purification.sections[3].passage.explanation.includes('mashhûr'),'L’avis connu sur le khabath doit être contextualisé');
assert.equal(book.purification.lexicon.length,10);
assert.ok(book.purification.lexicon.every(x=>x.arabic&&x.term&&x.definition.length>=80));
assert.equal(book.purification.quiz.length,7);
for(const q of book.purification.quiz)assert.ok(q.choices.length===3&&q.answer>=0&&q.answer<3&&q.explanation.length>=95);
assert.equal(book.purification.quote.arabic,'ما صدق عليه اسم ماء بلا قيد');
assert.ok(book.purification.quote.label.includes('Khalîl'),'Attribution du texte de Khalîl perdue');
assert.equal(book.purification.sources.length,3);
assert.ok(book.purification.sources.some(x=>x.url.includes('/ar/library/content/19/84/')));
assert.ok(book.purification.sources.some(x=>x.url.includes('/ar/library/content/19/85/')));
assert.ok(view.includes('fiqh-m-passage-link')&&view.includes('section.passage.sourceUrl'),'Lien à chaque passage original absent');
assert.ok(css.includes('text-align:justify')&&css.includes('hyphens:auto'),'Justification des paragraphes absente');
assert.equal(book.naturalWaters.id,'natural-waters-03');
assert.equal(book.naturalWaters.number,'03');
assert.equal(book.naturalWaters.sections.length,6,'Six explications progressives attendues');
assert.equal(book.naturalWaters.goals.length,5);
assert.deepEqual(Array.from(book.naturalWaters.sections,x=>x.id),['origin','sea','classification','dew','snow','salt']);
assert.deepEqual(Array.from(book.naturalWaters.sections,x=>x.passage.arabic),[
 'ودخل في حده ما كانت إضافته بيانية كماء المطر وماء الندى',
 'كماء البحر ولا خلاف في جواز التطهير به',
 'ومنها ما لا يسلبه الطهورية ولا يقتضي كراهة استعماله',
 'يتيمم إلا أن يجمع من الندى ما يتوضأ به',
 'لا فرق بين أن يكون مائعا من أصله أو يكون جامدا ثم ذاب بعد ذلك',
 'الظاهر حمل كلام المصنف على العموم لأن القول الأول هو المشهور'
],'Ne pas remplacer les citations vérifiées de Mawâhib al-Jalîl');
for(const section of book.naturalWaters.sections){
 assert.ok(section.title&&section.paragraphs.length===2&&section.sourceNote,'Section incomplète');
 assert.ok(section.paragraphs.every(p=>p.length>=450),'Explication trop courte '+section.id);
 assert.ok(section.passage?.arabic&&section.passage.translation&&section.passage.explanation&&section.passage.sourceUrl?.startsWith('https://'),'Citation, traduction ou lien direct absent : '+section.id);
 assert.ok(section.steps.length>=4 && section.steps.every(st=>st.label&&st.text.length>=130),'Décomposition insuffisante : '+section.id);
 assert.ok(section.example?.title&&section.example.text.length>=400,'Exemple concret absent : '+section.id);
 assert.ok(section.takeaway.length>=160,'Conclusion pédagogique absente : '+section.id);
 assert.ok(section.sourceNote.includes('t. 1'),'Numéro de volume absent : '+section.id);
}
assert.ok(book.naturalWaters.sections[3].passage.sourceLabel.includes('Mâlik'),'Réponse de Mâlik non attribuée');
assert.ok(book.naturalWaters.sections[5].passage.explanation.includes('mashhûr'),'Avis connu et divergence non expliqués');
assert.equal(book.naturalWaters.lexicon.length,10,'Dix notions de lexique attendues');
assert.ok(book.naturalWaters.lexicon.every(x=>x.arabic&&x.term&&x.definition.length>=80));
assert.equal(book.naturalWaters.quiz.length,8,'Huit questions de raisonnement attendues');
for(const question of book.naturalWaters.quiz)assert.ok(question.choices.length===3&&question.answer>=0&&question.answer<3&&question.explanation.length>=100,'Question incomplète');
assert.equal(book.naturalWaters.quote.arabic,'وَإِنْ جُمِعَ مِنْ نَدًى');
assert.ok(book.naturalWaters.quote.label.includes('Khalîl'),'L’extrait du Mukhtasar doit être attribué');
assert.equal(book.naturalWaters.sources.length,4);
assert.ok(book.naturalWaters.sources.some(x=>x.url.includes('/19/85/')),'Source eau de mer p. 46 manquante');
assert.ok(book.naturalWaters.sources.some(x=>x.url.includes('ID=87')),'Source rosée p. 51 manquante');
assert.ok(book.naturalWaters.sources.some(x=>x.url.includes('/19/88/')),'Source neige et avis p. 51 manquante');
assert.equal(book.waterChanges.id,'water-changes-04');
assert.equal(book.waterChanges.number,'04');
assert.equal(book.waterChanges.goals.length,6,'La fiche 04 doit avoir six objectifs');
assert.equal(book.waterChanges.sections.length,6,'Six lectures guidées attendues');
assert.deepEqual(Array.from(book.waterChanges.sections,x=>x.id),['properties','separability','two-judgements','contact-mix','small-change','unchanged']);
assert.deepEqual(Array.from(book.waterChanges.sections,x=>x.passage.arabic),[
 'لونا أو طعما أو ريحا',
 'بما يفارقه غالبا',
 'وحكمه كمغيره',
 'والظاهر أنه مخالط',
 'وهذا هو المعروف في المذهب',
 'تغير أحد أوصاف الماء'
]);
for(const section of book.waterChanges.sections){
 assert.ok(section.title&&section.paragraphs.length===2&&section.paragraphs.every(p=>p.length>=400),'Développement incomplet dans '+section.id);
 assert.ok(section.passage?.arabic&&section.passage.translation&&section.passage.explanation&&section.passage.sourceUrl?.includes('/19/101/'),'Citation ou source absente : '+section.id);
 assert.ok(section.steps.length>=4&&section.steps.every(step=>step.label&&step.text.length>=130),'Analyse progressive incomplète : '+section.id);
 assert.ok(section.example?.title&&section.example.text.length>=390,'Exemple pédagogique insuffisant : '+section.id);
 assert.ok(section.takeaway.length>=175&&section.sourceNote.includes('t. 1'),'Conclusion ou pagination absente : '+section.id);
}
assert.ok(book.waterChanges.sections[3].passage.sourceLabel.includes('Al-Tawdîh'),'Attribution de la formule rapportée incorrecte');
assert.ok(book.waterChanges.sections[4].passage.explanation.includes('madhhab'),'Statut doctrinal de l’avis non expliqué');
assert.equal(book.waterChanges.lexicon.length,10);
assert.ok(book.waterChanges.lexicon.every(x=>x.arabic&&x.term&&x.definition.length>=85));
assert.equal(book.waterChanges.quiz.length,8);
for(const question of book.waterChanges.quiz)assert.ok(question.choices.length===3&&question.answer>=0&&question.answer<3&&question.explanation.length>=100);
assert.equal(book.waterChanges.quote.arabic,'لَوْنًا أَوْ طَعْمًا أَوْ رِيحًا');
assert.ok(book.waterChanges.sources.some(x=>x.url.includes('/19/101/')));
assert.ok(css.includes('text-align:justify')&&css.includes('hyphens:auto'),'Paragraphes justifiés non conservés');
assert.equal(book.pureMixtures.id,'pure-mixtures-05');
assert.equal(book.pureMixtures.number,'05');
assert.equal(book.pureMixtures.goals.length,7,'Sept objectifs de la fiche 05 attendus');
assert.equal(book.pureMixtures.sections.length,7,'Sept lectures guidées attendues');
assert.deepEqual(Array.from(book.pureMixtures.sections,x=>x.id),['two-qualities','ordinary-uses','ingredients','oil-contact','relative-quantity','subtle-change','unchanged-contact']);
assert.deepEqual(Array.from(book.pureMixtures.sections,x=>x.passage.arabic),[
 'فالماء طاهر غير مطهر',
 'فيستعمل في العادات كالشرب والطبخ والعجن',
 'وكاللبن والزعفران والخل وغير ذلك',
 'الدهن الذي يخالط الماء أي يمازجه',
 'والمعروف من المذهب أنه غير طهور',
 'وما قاله ابن هارون هو الذي يقتضيه كلام أهل المذهب',
 'لا مجرد مخالطة الماء لغيره'
]);
for(const section of book.pureMixtures.sections){
 assert.ok(section.title&&section.paragraphs.length===2&&section.paragraphs.every(p=>p.length>=400),'Développement trop court : '+section.id);
 assert.ok(section.passage?.arabic&&section.passage.translation&&section.passage.explanation&&section.passage.sourceUrl?.includes('/19/101/'),'Texte arabe ou lien manquant : '+section.id);
 assert.ok(section.steps.length>=4&&section.steps.every(st=>st.label&&st.text.length>=130),'Explication pas à pas insuffisante : '+section.id);
 assert.ok(section.example?.title&&section.example.text.length>=400,'Exemple concret incomplet : '+section.id);
 assert.ok(section.takeaway.length>=170&&section.sourceNote.includes('t. 1'),'Conclusion ou page absente : '+section.id);
}
assert.ok(book.pureMixtures.sections[4].passage.sourceLabel.includes('al-Lakhmî'),'Avis connu non attribué à son auteur');
assert.ok(book.pureMixtures.sections[5].passage.sourceLabel.includes('al-Hattâb'),'Propos personnels du commentateur non attribués');
assert.equal(book.pureMixtures.lexicon.length,12,'Douze termes arabes attendus');
assert.ok(book.pureMixtures.lexicon.every(x=>x.arabic&&x.term&&x.definition.length>=85),'Lexique de la fiche 05 incomplet');
assert.equal(book.pureMixtures.quiz.length,9,'Neuf questions corrigées attendues');
for(const question of book.pureMixtures.quiz)assert.ok(question.choices.length===3&&question.answer>=0&&question.answer<3&&question.explanation.length>=105,'Question de la fiche 05 incomplète');
assert.equal(book.pureMixtures.quote.arabic,'فَالْمَاءُ طَاهِرٌ غَيْرُ مُطَهِّرٍ');
assert.ok(book.pureMixtures.sources.some(x=>x.url.includes('/19/101/')));
assert.ok(css.includes('text-align:justify')&&css.includes('hyphens:auto'),'Justification de texte non conservée');
assert.equal(book.impureContact.id,'impure-contact-06');
assert.equal(book.impureContact.number,'06');
assert.equal(book.impureContact.goals.length,7,'Sept objectifs de compréhension nécessaires');
assert.equal(book.impureContact.sections.length,7,'Sept lectures expliquées sont attendues');
assert.deepEqual(Array.from(book.impureContact.sections,x=>x.id),['altered','effects','small-unchanged','mashhur','no-other','opinions','reasoning']);
assert.deepEqual(Array.from(book.impureContact.sections,x=>x.passage.arabic),[
  'وإن كان ذلك الشيء الذي غير الماء نجسا فالماء نجس',
  'لا يستعمل لا في العادات ولا في العبادات',
  'بنجس لم يتغير',
  'فإنه طهور ولكنه يكره استعماله',
  'فإن لم يجد غيره وجب عليه استعماله',
  'وقال ابن القاسم',
  'مراعاة الخلاف'
],'Conserver les extraits originaux vérifiés dans le livre');
for(const section of book.impureContact.sections){
 assert.ok(section.title&&section.paragraphs.length===2&&section.paragraphs.every(p=>p.length>=420),'Développement trop court : '+section.id);
 assert.ok(section.passage?.arabic&&section.passage.translation&&section.passage.explanation&&section.passage.sourceUrl?.startsWith('https://'),'Extrait arabe ou source absente : '+section.id);
 assert.ok(section.steps.length>=4&&section.steps.every(st=>st.label&&st.text.length>=130),'Explication progressive incomplète : '+section.id);
 assert.ok(section.example?.title&&section.example.text.length>=390,'Exemple concret absent : '+section.id);
 assert.ok(section.takeaway.length>=170&&section.sourceNote.includes('t. 1'),'Synthèse ou référence absente : '+section.id);
}
for(const section of book.impureContact.sections.slice(0,2))assert.ok(section.passage.sourceUrl.includes('/19/101/'),'Source p. 59 perdue');
for(const section of book.impureContact.sections.slice(2))assert.ok(section.passage.sourceUrl.includes('/19/109/'),'Source p. 70-72 perdue');
assert.ok(book.impureContact.sections[2].passage.sourceLabel.includes('Khalîl'),'Les mots de Khalîl doivent être correctement attribués');
assert.ok(book.impureContact.sections[5].paragraphs.some(p=>p.includes('Ibn al-Qâsim')),'Divergence d’Ibn al-Qâsim non expliquée');
assert.ok(book.impureContact.sections[6].paragraphs.some(p=>p.includes('al-Nawawî')),'Statut distinct des hadiths non expliqué');
assert.equal(book.impureContact.lexicon.length,12,'Douze termes arabes nécessaires');
assert.equal(new Set(book.impureContact.lexicon.map(x=>x.term)).size,12);
assert.ok(book.impureContact.lexicon.every(x=>x.arabic&&x.term&&x.definition.length>=90),'Notions insuffisamment expliquées');
assert.equal(book.impureContact.quiz.length,9,'Neuf questions corrigées attendues');
for(const question of book.impureContact.quiz)assert.ok(question.choices.length===3&&question.answer>=0&&question.answer<3&&question.explanation.length>=115,'Quiz incomplet');
assert.equal(book.impureContact.quote.arabic,'وَيَسِيرٌ كَآنِيَةِ وُضُوءٍ وَغُسْلٍ بِنَجَسٍ لَمْ يَتَغَيَّرْ');
assert.ok(book.impureContact.sources.some(x=>x.url.startsWith('https://usul.ai/')));
for(const id of ['/19/101/','/19/109/'])assert.ok(book.impureContact.sources.some(x=>x.url.includes(id)),'Source originale manquante : '+id);
assert.ok(css.includes('text-align:justify')&&css.includes('hyphens:auto'),'Justification française absente');
assert.equal(book.usedWater.id,'used-water-07');assert.equal(book.usedWater.number,'07');
assert.equal(book.usedWater.goals.length,7,'Sept objectifs détaillés sont attendus pour la fiche 07');
assert.equal(book.usedWater.sections.length,7,'Sept lectures guidées attendues pour la fiche 07');
assert.deepEqual(Array.from(book.usedWater.sections,s=>s.id),[
 'third-category','what-used-means','availability','different-opinions','reasoning','quantity','context-and-limits'
],'Ordre des sept lectures non respecté');
assert.deepEqual(Array.from(book.usedWater.sections,s=>s.passage.arabic),[
 'وكره ماء مستعمل في حدث',
 'الماء المتنازع فيه هو المجموع عن الأعضاء لا ما يفضل في الإناء بعد الطهارة',
 'فإن لم يجد غيره تطهر به ولا يتيمم مع وجوده',
 'ومقابل المشهور في الماء المستعمل في الحدث قولان',
 'والراجح في تعليل الكراهة كونه مختلفا في طهوريته',
 'ولا شك أن المحكوم له بالكراهة هو اليسير',
 'تعين عليه ذلك ولا يجوز له التيمم'
],'Extraits arabes vérifiés altérés');
for(const section of book.usedWater.sections){
 assert.ok(section.paragraphs.length===2&&section.paragraphs.every(p=>p.length>=420),'Fiche 07 : développements insuffisants : '+section.id);
 assert.ok(section.passage?.arabic&&section.passage?.translation&&section.passage?.explanation&&section.passage?.sourceLabel&&section.passage?.sourceUrl?.includes('/19/107/'),'Fiche 07 : citation et lien manquants : '+section.id);
 assert.ok(section.steps?.length>=4&&section.steps.every(st=>st.label&&st.text.length>=130),'Fiche 07 : notions trop courtes : '+section.id);
 assert.ok(section.example?.title&&section.example.text.length>=390,'Fiche 07 : exemple pédagogique absent : '+section.id);
 assert.ok(section.takeaway.length>=170&&section.sourceNote.includes('t. 1'),'Fiche 07 : synthèse et référence manquantes : '+section.id);
}
assert.ok(book.usedWater.sections[0].passage.sourceLabel.includes('Khalîl'),'Formule originale de Khalîl non attribuée');
assert.ok(book.usedWater.sections[1].passage.sourceLabel.includes('Al-Qarâfî'),'Citation de la Dhakhîra mal attribuée');
assert.ok(book.usedWater.sections[3].paragraphs.some(x=>x.includes('Asbagh')),'Divergences insuffisamment documentées');
assert.ok(book.usedWater.sections[4].passage.sourceLabel.includes('al-Hattâb'),'Argument personnel du commentateur non identifié');
assert.equal(book.usedWater.lexicon.length,12,'Douze entrées de lexique requises dans la fiche 07');
assert.equal(new Set(book.usedWater.lexicon.map(x=>x.term)).size,12,'Doublons dans le lexique 07');
assert.ok(book.usedWater.lexicon.every(x=>x.arabic&&x.term&&x.definition.length>=90),'Définition de lexique insuffisante 07');
assert.equal(book.usedWater.quiz.length,9,'Neuf questions corrigées attendues dans la fiche 07');
for(const q of book.usedWater.quiz)assert.ok(q.choices.length===3&&q.answer>=0&&q.answer<3&&q.explanation.length>=115,'Question ou correction incomplète fiche 07');
assert.equal(book.usedWater.quote.arabic,'وكره ماء مستعمل في حدث');
assert.ok(book.usedWater.sources.some(x=>x.url===book.book.sourceUrl));
assert.ok(book.usedWater.sources.some(x=>x.url.includes('/19/107/')),'Source arabe de la fiche 07 absente');
assert.equal(book.recommendedWater.id,'recommended-used-water-08');
assert.equal(book.recommendedWater.number,'08');
assert.equal(book.recommendedWater.goals.length,9,'Neuf objectifs de la fiche 08 sont attendus');
assert.equal(book.recommendedWater.sections.length,9,'Neuf lectures commentées sont attendues dans la fiche 08');
assert.deepEqual(Array.from(book.recommendedWater.sections,s=>s.id),[
 'opening','uses','restrictive','general','two-reasons','one-reason','tiraz','hattab-conclusion','ordinary-uses'
],'Ordre des lectures de la fiche 08 altéré');
assert.deepEqual(Array.from(book.recommendedWater.sections,s=>s.passage.arabic),[
 'وفي غيره تردد',
 'الأوضية والاغتسالات المسنونة',
 'تقييد الكراهة بالمستعمل في الحدث',
 'وأطلق ابن بشير',
 'سببه أمران',
 'احتمل الخلاف',
 'الظاهر كراهته',
 'مكروه وبلا تردد',
 'لا كراهة فيه'
],'Formules arabes attendues en fiche 08');
for(const s of book.recommendedWater.sections) {
 assert.ok(s.paragraphs.length===2&&s.paragraphs.every(p=>p.length>=420),'Développement insuffisant 08 : '+s.id);
 assert.ok(s.passage?.arabic&&s.passage.translation&&s.passage.explanation&&s.passage.sourceLabel&&s.passage.sourceUrl?.includes('/19/108/'),'Citation ou source manquante en fiche 08 : '+s.id);
 assert.ok(s.steps?.length===4&&s.steps.every(st=>st.label&&st.text.length>=130),'Analyse progressive manquante : '+s.id);
 assert.ok(s.example?.title&&s.example.text.length>=390,'Exemple pédagogique manquant : '+s.id);
 assert.ok(s.takeaway.length>=170&&s.sourceNote.includes('t. 1'),'Synthèse ou référence trop courte : '+s.id);
}
assert.ok(book.recommendedWater.sections[0].passage.sourceLabel.includes('Khalîl'),'Source de la formule initiale incorrecte');
assert.ok(book.recommendedWater.sections[4].passage.sourceLabel.includes('Al-Qarâfî'),'Analyse des deux causes mal attribuée');
assert.ok(book.recommendedWater.sections[6].passage.sourceLabel.includes('al-Tirâz'),'Propos d’al-Tirâz non attribués');
assert.ok(book.recommendedWater.sections[7].passage.sourceLabel.includes('al-Hattâb'),'Conclusion personnelle d’al-Hattâb non attribuée');
assert.equal(book.recommendedWater.lexicon.length,14,'Quatorze notions doivent être définies en fiche 08');
assert.equal(new Set(book.recommendedWater.lexicon.map(x=>x.term)).size,14,'Doublon de lexique en fiche 08');
assert.ok(book.recommendedWater.lexicon.every(x=>x.arabic&&x.term&&x.definition.length>=110),'Définition de la fiche 08 insuffisante');
assert.equal(book.recommendedWater.quiz.length,12,'Douze questions pédagogiques attendues pour la fiche 08');
for(const q of book.recommendedWater.quiz)assert.ok(q.choices.length===3&&q.answer>=0&&q.answer<3&&q.explanation.length>=140,'Question ou correction de la fiche 08 incomplète');
assert.equal(book.recommendedWater.quote.arabic,'وفي غيره تردد');
assert.ok(book.recommendedWater.sources.some(x=>x.url===book.book.sourceUrl));
assert.ok(book.recommendedWater.sources.some(x=>x.url.includes('/19/108/')));
assert.equal(book.flowingWater.id,'flowing-stagnant-water-09');
assert.equal(book.flowingWater.number,'09');
assert.equal(book.flowingWater.goals.length,10,'Dix objectifs sont attendus pour la fiche 09');
assert.equal(book.flowingWater.sections.length,10,'Dix lectures expliquées sont attendues dans la fiche 09');
assert.deepEqual(Array.from(book.flowingWater.sections,s=>s.id),[
 'water-flow','conditions','where-falls','hattab-choice','moving-impurity','downstream',
 'stagnant','stagnant-sizes','mashhur','repeated-bathing'
],'Ordre des dix lectures modifié');
assert.deepEqual(Array.from(book.flowingWater.sections,s=>s.passage.arabic),[
 'أما الماء الجاري فحكمه كالكثير',
 'إذا كان المجموع كثيرا والجرية لا انفكاك لها',
 'لأن ما قبل محل السقوط غير مخالط',
 'والظاهر ما قاله ابن عبد السلام وابن عرفة',
 'فإن كانت جارية مع الماء فما فوقها طاهر إجماعا',
 'إن الماء الجاري إذا وقعت فيه نجاسة جرى بها فما بعدها منه طاهر',
 'وراكد يغتسل فيه',
 'فأما المستبحر والماء المعين كالغدير الكبير والبركة الكبيرة',
 'وأما على القول المشهور الذي مشى عليه المصنف فهو طاهر مطهر',
 'لأنه يسرع إليه التغير ولا يفطن به'
],'Extraits arabes de la fiche 09 modifiés');
for(const s of book.flowingWater.sections){
 assert.ok(s.paragraphs.length===2&&s.paragraphs.every(p=>p.length>=330),'Développement trop court : '+s.id);
 assert.ok(s.passage?.arabic&&s.passage.translation&&s.passage.explanation&&s.passage.sourceLabel&&s.passage.sourceUrl?.startsWith('https://'),'Citation ou source manquante : '+s.id);
 assert.ok(s.steps.length===4&&s.steps.every(st=>st.label&&st.text.length>=110),'Étape pédagogique incomplète : '+s.id);
 assert.ok(s.example?.title&&s.example.text.length>=350,'Exemple absent : '+s.id);
 assert.ok(s.takeaway.length>=150&&(/t\. 1|tome 1/.test(s.sourceNote)),'Conclusion ou référence absente : '+s.id);
}
for(const s of book.flowingWater.sections.slice(0,6)) assert.ok(s.passage.sourceUrl.includes('/19/111/'),'Lien texte eau courante perdu');
for(const s of book.flowingWater.sections.slice(6)) assert.ok(s.passage.sourceUrl.includes('/19/113/'),'Lien texte eau stagnante perdu');
assert.ok(book.flowingWater.sections[0].passage.sourceLabel.includes('Al-Mâzarî'),'Propos d’al-Mâzarî mal attribués');
assert.ok(book.flowingWater.sections[1].passage.sourceLabel.includes('Ibn al-Hâjib'),'Propos d’Ibn al-Hâjib mal attribués');
assert.ok(book.flowingWater.sections[3].passage.sourceLabel.includes('al-Hattâb'),'Préférence du commentateur non attribuée');
assert.ok(book.flowingWater.sections[4].passage.sourceLabel.includes('Al-Tirâz'),'Citation de l’auteur d’al-Tirâz non attribuée');
assert.ok(book.flowingWater.sections[6].passage.sourceLabel.includes('Khalîl'),'Paroles du Mukhtasar non attribuées');
assert.ok(book.flowingWater.sections[8].passage.explanation.includes('mashhûr'),'Divergence du mashhûr non expliquée');
assert.equal(book.flowingWater.lexicon.length,15,'Quinze définitions attendues en fiche 09');
assert.equal(new Set(book.flowingWater.lexicon.map(x=>x.term)).size,15,'Lexique 09 contient des doublons');
assert.ok(book.flowingWater.lexicon.every(x=>x.arabic&&x.term&&x.definition.length>=105),'Définitions incomplètes fiche 09');
assert.equal(book.flowingWater.quiz.length,12,'Douze questions attendues en fiche 09');
for(const q of book.flowingWater.quiz)assert.ok(q.choices.length===3&&q.answer>=0&&q.answer<3&&q.explanation.length>=140,'Question ou correction trop courte fiche 09');
assert.equal(book.flowingWater.quote.arabic,'وراكد يغتسل فيه');
assert.ok(book.flowingWater.sources.some(x=>x.url===book.book.sourceUrl));
for(const id of ['/19/111/','/19/113/'])assert.ok(book.flowingWater.sources.some(x=>x.url.includes(id)),'Source originale de la fiche 09 absente : '+id);
assert.equal(new Set(['usedWater','recommendedWater','flowingWater'].flatMap(key=>book[key].lexicon.map(x=>x.term))).size,41,'Les notions des fiches 07-09 doivent être distinctes');
assert.equal(book.publicBasins.id,'public-basins-10');
assert.equal(book.publicBasins.number,'10');
assert.equal(book.publicBasins.goals.length,9,'Neuf objectifs sont attendus pour la fiche 10');
assert.equal(book.publicBasins.sections.length,9,'Neuf lectures commentées attendues dans la fiche 10');
assert.deepEqual(Array.from(book.publicBasins.sections,s=>s.id),[
 'context','changed','invalid','unchanged','contacts','probability','certainty','duration','renewal'
],'Ordre des lectures de la fiche 10 incorrect');
assert.deepEqual(Array.from(book.publicBasins.sections,s=>s.passage.arabic),[
 'البرك المعدة للوضوء',
 'إن تغير أحد أوصاف الماء',
 'فلا يصح الوضوء بها',
 'وإن لم يتغير فيكره الوضوء منها',
 'لاختلاف الأيدي والأرجل',
 'والغالب أن فيها النجاسة',
 'وإن تحقق غسلهم النجاسة فيها وكثرته',
 'وهذا فيما تطول إقامة الماء فيه',
 'وأما ما يفرغ بسرعة ويجدد له ماء آخر فأمره خفيف'
],'Citations arabes de la fiche 10 incorrectes');
for(const s of book.publicBasins.sections){
 assert.ok(s.paragraphs.length===2&&s.paragraphs.every(p=>p.length>=390),'Développement trop court en fiche 10 : '+s.id);
 assert.ok(s.passage?.arabic&&s.passage.translation&&s.passage.explanation&&/al-Hattâb/i.test(s.passage.sourceLabel)&&s.passage.sourceUrl?.includes('/19/114/'),'Attribution, traduction ou source absente : '+s.id);
 assert.ok(s.steps.length===4&&s.steps.every(x=>x.label&&x.text.length>=85),'Explications guidées incomplètes : '+s.id);
 assert.ok(s.example?.title&&s.example.text.length>=370,'Situation pédagogique absente : '+s.id);
 assert.ok(s.takeaway.length>=150&&s.sourceNote.includes('p. 76'),'Synthèse ou référence absente : '+s.id);
}
assert.equal(book.publicBasins.lexicon.length,15,'Quinze notions attendues dans la fiche 10');
assert.equal(new Set(book.publicBasins.lexicon.map(x=>x.term)).size,15,'Doublons de lexique en fiche 10');
assert.ok(book.publicBasins.lexicon.every(x=>x.arabic&&x.term&&x.definition.length>=120),'Définition incomplète en fiche 10');
assert.equal(book.publicBasins.quiz.length,12,'Douze questions attendues dans la fiche 10');
for(const q of book.publicBasins.quiz)assert.ok(q.choices.length===3&&q.answer>=0&&q.answer<3&&q.explanation.length>=160,'Correction ou choix incomplet en fiche 10');
assert.equal(book.publicBasins.quote.arabic,'وَأَمَّا مَا يُفْرَغُ بِسُرْعَةٍ وَيُجَدَّدُ لَهُ مَاءٌ آخَرُ فَأَمْرُهُ خَفِيفٌ');
assert.ok(book.publicBasins.quote.label.includes('al-Hattâb'),'Citation finale mal attribuée');
assert.ok(book.publicBasins.sources.some(s=>s.url===book.book.sourceUrl),'Référence Usul absente fiche 10');
assert.ok(book.publicBasins.sources.some(s=>s.url.includes('/19/114/')),'Référence Islamweb absente fiche 10');
assert.equal(book.limitedWell.id,'well-necessity-11');
assert.equal(book.limitedWell.number,'11');
assert.equal(book.limitedWell.goals.length,11,'Onze objectifs sont attendus en fiche 11');
assert.equal(book.limitedWell.sections.length,11,'Onze lectures commentées attendues en fiche 11');
assert.deepEqual(Array.from(book.limitedWell.sections,s=>s.id),[
 'well-case','malik-response','malik-avoid','ibn-qasim','necessity','improvising',
 'sanad-advice','sanad-objection','basin-intro','basin-changed','basin-unchanged'
],'Ordre des onze lectures de la fiche 11 altéré');
assert.deepEqual(Array.from(book.limitedWell.sections,s=>s.passage.arabic),[
 'أتى الجنب بئرا قليلة الماء وبيده قذر وليس معه ما يغرف به',
 'يحتال حتى يغسل يديه ويغرف ويغتسل',
 'وكره أن يقول يغتسل فيها',
 'فإن اغتسل فيها أجزأه ولم ينجسها إذا كان الماء معينا',
 'إنما كره له الاغتسال فيه إذا وجد منه بدلا',
 'يأخذه بطرف ثوبه',
 'ينبغي أن يتلطف في إزالة النجاسة من يده وتقليلها',
 'فإنه إذا اغترف وقلل الماء وبالغ في التدلك',
 'إن اغتسل به في الحياض أو في القصرية قبل أن يغسل الأذى عن نفسه',
 'فإن تغير أحد أوصافه لم يجزه غسله وحكم الجنابة باق',
 'وإن لم يتغير فغسله يجزيه'
],'Les citations arabes de la fiche 11 ont changé');
for(const s of book.limitedWell.sections){
 assert.ok(s.paragraphs.length===2&&s.paragraphs.every(p=>p.length>=390),'Développements trop courts en fiche 11 : '+s.id);
 assert.ok(s.passage?.arabic&&s.passage.translation&&s.passage.explanation&&s.passage.sourceLabel&&s.passage.sourceUrl?.includes('/19/'),'Citation, traduction ou attribution absente en fiche 11 : '+s.id);
 assert.ok(s.steps.length===4&&s.steps.every(x=>x.label&&x.text.length>=90),'Explication progressive incomplète en fiche 11 : '+s.id);
 assert.ok(s.example?.title&&s.example.text.length>=380,'Exemple pédagogique manquant en fiche 11 : '+s.id);
 assert.ok(s.takeaway.length>=190&&(/t\. 1|tome 1/.test(s.sourceNote)),'Conclusion ou référence manquante en fiche 11 : '+s.id);
}
for(const s of book.limitedWell.sections.slice(0,8))assert.ok(s.passage.sourceUrl.includes('/19/115/'),'Lien vers le puits absent pour '+s.id);
for(const s of book.limitedWell.sections.slice(8))assert.ok(s.passage.sourceUrl.includes('/19/116/'),'Lien vers le bassin absent pour '+s.id);
assert.ok(book.limitedWell.sections[1].passage.sourceLabel.includes('Mâlik'),'Réponse de Mâlik mal attribuée');
assert.ok(book.limitedWell.sections[3].passage.sourceLabel.includes('Ibn al-Qâsim'),'Propos d’Ibn al-Qâsim mal attribué');
assert.ok(book.limitedWell.sections[4].passage.sourceLabel.includes('Mâlik'),'Rôle de l’alternative mal attribué');
assert.ok(book.limitedWell.sections[6].passage.sourceLabel.includes('Sanad'),'Propos de Sanad non attribués');
assert.ok(book.limitedWell.sections[8].passage.sourceLabel.includes('Abû al-Hasan'),'Transmission d’Abû al-Hasan absente');
assert.ok(book.limitedWell.sections[10].passage.sourceLabel.includes('Abd al-Haqq'),'Propos d’Abd al-Haqq non attribués');
assert.equal(book.limitedWell.lexicon.length,18,'Dix-huit termes attendus dans la fiche 11');
assert.equal(new Set(book.limitedWell.lexicon.map(x=>x.term)).size,18,'Doublon de lexique en fiche 11');
assert.ok(book.limitedWell.lexicon.every(x=>x.arabic&&x.term&&x.definition.length>=110),'Définition de la fiche 11 trop brève');
assert.equal(book.limitedWell.quiz.length,12,'Douze questions attendues dans la fiche 11');
for(const q of book.limitedWell.quiz) assert.ok(q.choices.length===3&&q.answer>=0&&q.answer<3&&q.explanation.length>=120,'Quiz ou correction incomplet dans la fiche 11');
assert.equal(book.limitedWell.quote.arabic,'يَحْتَالُ حَتَّى يَغْسِلَ يَدَيْهِ وَيَغْرِفَ وَيَغْتَسِلَ');
assert.ok(book.limitedWell.quote.label.includes('Mâlik'),'Attribution de la citation générale manquante');
assert.ok(book.limitedWell.sources.some(x=>x.url===book.book.sourceUrl),'Source Usul de la fiche 11 absente');
for(const u of ['/19/115/','/19/116/'])assert.ok(book.limitedWell.sources.some(x=>x.url.includes(u)),'Source Islamweb manquante : '+u);
assert.equal(book.leftoverWater.id,'leftover-water-12');
assert.equal(book.leftoverWater.number,'12');
assert.equal(book.leftoverWater.goals.length,14,'Quatorze objectifs attendus en fiche 12');
assert.equal(book.leftoverWater.sections.length,14,'Quatorze lectures attendues en fiche 12');
assert.deepEqual(Array.from(book.leftoverWater.sections,s=>s.id),[
 'definition','famous-qualification','jurists-wording','habitual-drinker','mouth-hand',
 'hard-to-avoid','cat-hadith','commentators-cat','food-mashhur','mudawwana-animals',
 'three-views','ibn-rushd','water-food-priority','water-waste'
],'Les quatorze étapes de la fiche 12 ont changé');
assert.deepEqual(Array.from(book.leftoverWater.sections,s=>s.passage.arabic),[
 'وسؤر شارب خمر وما أدخل يده فيه وما لا يتوقى نجسا من ماء',
 'إذا كان يسيرا كآنية الوضوء والغسل كما تقدم مكروه مع وجود غيره فإن لم يجد غيره استعمله وهذا هو المشهور',
 'ولم يصرح ابن الحاجب بالكراهة فيه وصرح بها ابن الجلاب وصاحب التلقين وصاحب البيان',
 'ولا بد من اعتبار كثرة شربه كما أشار إليه ابن الإمام',
 'فإن تحققت جاز استعماله من غير كراهة قاله صاحب البيان وغيره',
 'لا إن عسر الاحتراز منه أو كان طعاما',
 'الهرة ليست بنجس إنما هي من الطوافين عليكم أو الطوافات',
 'والأظهر أنها للنوعين كما في روايات الواو',
 'وما ذكره المصنف من التفرقة بين الماء والطعام هو المشهور وهو مذهب المدونة',
 'إن شربت من طعام لبن أو غيره أكل إلا أن يكون في أفواهها وقت شربها أذى فلا يؤكل',
 'وفي المسألة ثلاثة أقوال',
 'والثاني الحمل على الطهارة فيها نظر إلى الأصل واختاره ابن رشد',
 'والثالث المشهور يطرح الماء دون الطعام',
 'والسرف فيه غلو وبدعة'
],'Les citations arabes de la fiche 12 ont changé');
for(const s of book.leftoverWater.sections){
 assert.ok(s.paragraphs.length===2&&s.paragraphs.every(p=>p.length>=440),'Développement trop court en fiche 12 : '+s.id);
 assert.ok(s.passage?.arabic&&s.passage.translation&&s.passage.explanation&&s.passage.sourceLabel?.length>=50&&s.passage.sourceUrl?.includes('/19/'),'Citation, sens ou attribution absents en fiche 12 : '+s.id);
 assert.ok(s.steps.length===4&&s.steps.every(x=>x.label&&x.text.length>=90),'Explication progressive incomplète en fiche 12 : '+s.id);
 assert.ok(s.example?.title&&s.example.text.length>=390,'Situation pédagogique incomplète en fiche 12 : '+s.id);
 assert.ok(s.takeaway.length>=195&&(/tome 1|t\. 1/.test(s.sourceNote)),'Synthèse ou source incomplète en fiche 12 : '+s.id);
}
for(const s of book.leftoverWater.sections.slice(0,5))assert.ok(s.passage.sourceUrl.includes('/19/117/'),'Source page 77 absente : '+s.id);
for(const s of book.leftoverWater.sections.slice(5))assert.ok(s.passage.sourceUrl.includes('/19/118/'),'Source page 78 absente : '+s.id);
assert.ok(book.leftoverWater.sections[0].passage.sourceLabel.includes('Khalîl'),'Mots de Khalîl non attribués');
assert.ok(book.leftoverWater.sections[2].passage.sourceLabel.includes('Ibn al-Hâjib'),'Comparaison des avis non attribuée');
assert.ok(book.leftoverWater.sections[3].passage.sourceLabel.includes('Ibn al-Imâm'),'Précision d’Ibn al-Imâm absente');
assert.ok(book.leftoverWater.sections[4].passage.sourceLabel.includes('Bayân'),'Propos du Bayân non attribués');
assert.ok(book.leftoverWater.sections[6].passage.sourceLabel.includes('Hadith')||book.leftoverWater.sections[6].passage.sourceLabel.includes('Hadith'.toLowerCase())||book.leftoverWater.sections[6].passage.sourceLabel.includes('Hadith'.toUpperCase())||book.leftoverWater.sections[6].passage.sourceLabel.includes('Hadith'.toLowerCase()),'Preuve prophétique mal attribuée');
assert.ok(book.leftoverWater.sections[7].passage.sourceLabel.includes('Nawawî'),'Analyse du hadith non attribuée');
assert.ok(book.leftoverWater.sections[9].passage.sourceLabel.includes('Mudawwana'),'Citation de la Mudawwana non attribuée');
assert.ok(book.leftoverWater.sections[11].passage.sourceLabel.includes('Ibn Rushd'),'Choix d’Ibn Rushd non attribué');
assert.ok(book.leftoverWater.sections[12].passage.sourceLabel.includes('Ibn Nâjî'),'Justifications du mashhûr non attribuées');
assert.ok(book.leftoverWater.sections[13].passage.sourceLabel.includes('Abû Muhammad'),'Discussion du gaspillage non attribuée');
assert.equal(book.leftoverWater.lexicon.length,20,'Vingt termes attendus dans la fiche 12');
assert.equal(new Set(book.leftoverWater.lexicon.map(x=>x.term)).size,20,'Lexique de la fiche 12 en doublon');
assert.ok(book.leftoverWater.lexicon.every(x=>x.arabic&&x.term&&x.definition.length>=125),'Définition du lexique trop courte en fiche 12');
assert.equal(book.leftoverWater.quiz.length,17,'Dix-sept questions attendues en fiche 12');
for(const q of book.leftoverWater.quiz)assert.ok(q.choices.length===3&&q.answer>=0&&q.answer<3&&q.explanation.length>=140,'Quiz incomplet en fiche 12');
assert.equal(book.leftoverWater.quote.arabic,'لَا إِنْ عَسُرَ الِاحْتِرَازُ مِنْهُ أَوْ كَانَ طَعَامًا');
assert.ok(book.leftoverWater.quote.label.includes('Khalîl'),'Citation principale mal attribuée');
assert.ok(book.leftoverWater.sources.some(x=>x.url===book.book.sourceUrl),'Référence Usul fiche 12 absente');
for(const id of ['/19/117/','/19/118/'])assert.ok(book.leftoverWater.sources.some(s=>s.url.includes(id)),'Référence primaire absente : '+id);
assert.equal(new Set(['publicBasins','limitedWell','leftoverWater'].flatMap(key=>book[key].lexicon.map(x=>x.term))).size,53,'Les 53 termes des fiches 10 à 12 doivent être distincts');
// Fiche 13 : lire Khalîl et les avis transmis par al-Hattâb sur l'eau chauffée au soleil.
assert.equal(book.sunHeatedWater.id,'sun-heated-water-13');
assert.equal(book.sunHeatedWater.number,'13');
assert.equal(book.sunHeatedWater.status,'disponible');
assert.equal(book.sunHeatedWater.goals.length,15,'Quinze objectifs attendus dans la fiche 13');
assert.equal(book.sunHeatedWater.sections.length,15,'Quinze lectures commentées attendues dans la fiche 13');
assert.deepEqual(Array.from(book.sunHeatedWater.sections,x=>x.id),[
 'reading-khalil','ibn-hajib','iyad-sanad','hadith','classification-hadith',
 'copper-regions','conditional-harm','nawawi-hadith','nawawi-disagreement',
 'hattab-conclusion','ibn-al-furat','validity','medical-karaha','cooling','body-ponds-fire'
],'Ordre des quinze lectures de la fiche 13 altéré');
assert.deepEqual(Array.from(book.sunHeatedWater.sections,x=>x.passage.arabic),[
 'كمشمس',
 'والمشمس كغيره فلا كراهة فيه',
 'وكره الوضوء بالماء المسخن بالشمس من جهة الطب',
 'قال عبد الحق لم يصح فيه حديث',
 'وما ذكره ابن فرحون من كون الحديث موضوعا قاله بعضهم والأكثر على أنه حديث ضعيف',
 'لو شمس في أواني الصفر في البلاد الحارة',
 'والحق أن التجربة إن قضت بضرر استعماله فالقول بالكراهة ظاهر',
 'فالصواب الجزم بأنه لا كراهة فيه',
 'وقد جزم النووي في منهاجه بكراهة المشمس',
 'والحاصل أن القول بكراهة المشمس قوي',
 'وجوز ابن الفرات أن يكون التشبيه في قول المصنف كمشمس راجعا إلى ما قبله من المكروهات',
 'إن توضأ به أجزأه',
 'إذا قلنا بالكراهة فالظاهر أنها كراهة إرشاد من جهة الطب وليست كراهة شرعية',
 'وانظر هل تزول الكراهة بتبريده أو لا أو يرجع في ذلك للأطباء',
 'المسخن بالنار لا كراهة فيه كما صرح بذلك ابن الحاجب وغيره'
],'Citations arabes fiche 13 modifiées');
for(const part of book.sunHeatedWater.sections){
 assert.ok(part.paragraphs.length===2 && part.paragraphs.every(p=>p.length>=410),'Explication trop brève : '+part.id);
 assert.ok(part.passage?.arabic && part.passage.translation && part.passage.explanation && part.passage.sourceLabel.length>=55,'Citation ou attribution manquante : '+part.id);
 assert.ok(part.passage.sourceUrl.includes('/19/120/'),'Lien vers le passage original absent : '+part.id);
 assert.ok(part.steps.length===4 && part.steps.every(st=>st.label && st.text.length>=80),'Décorticage incomplet : '+part.id);
 assert.ok(part.example?.title && part.example.text.length>=345,'Exemple pédagogique insuffisant : '+part.id);
 assert.ok(part.takeaway.length>=155 && (part.sourceNote.includes('t. 1') || part.sourceNote.includes('tome 1')),'Synthèse ou source incomplète : '+part.id);
}
assert.ok(book.sunHeatedWater.sections[0].passage.sourceLabel.includes('Khalîl'),'Texte de Khalîl mal attribué');
assert.ok(book.sunHeatedWater.sections[1].passage.sourceLabel.includes('Ibn al-Hâjib'),'Avis d’Ibn al-Hâjib non attribué');
assert.ok(book.sunHeatedWater.sections[2].passage.sourceLabel.includes('Sanad'),'Avis de Sanad non attribué');
assert.ok(book.sunHeatedWater.sections[3].passage.sourceLabel.includes('Abd al-Haqq'),'Critique du hadith non attribuée');
assert.ok(book.sunHeatedWater.sections[4].passage.sourceLabel.includes('Al-Hattâb'),'Nuance d’al-Hattâb sur la faiblesse du hadith absente');
assert.ok(book.sunHeatedWater.sections[7].passage.sourceLabel.includes('Nawawî'),'Critique d’al-Nawawî non attribuée');
assert.ok(book.sunHeatedWater.sections[9].passage.sourceLabel.includes('Al-Hattâb'),'Préférence d’al-Hattâb non attribuée');
assert.ok(book.sunHeatedWater.sections[12].passage.sourceLabel.includes('Ibn Farhûn'),'Divergence sur la karâha non attribuée');
assert.equal(book.sunHeatedWater.lexicon.length,20,'Vingt termes attendus au lexique de la fiche 13');
assert.equal(new Set(book.sunHeatedWater.lexicon.map(x=>x.term)).size,20,'Termes répétés dans le lexique 13');
assert.ok(book.sunHeatedWater.lexicon.every(x=>x.arabic&&x.term&&x.definition.length>=125),'Définition du lexique fiche 13 trop succincte');
assert.equal(book.sunHeatedWater.quiz.length,16,'Seize questions corrigées attendues dans la fiche 13');
for(const question of book.sunHeatedWater.quiz)assert.ok(question.choices.length===3 && question.answer>=0 && question.answer<3 && question.explanation.length>=130,'Quiz fiche 13 incomplet');
assert.equal(book.sunHeatedWater.quote.arabic,'كَمُشَمَّسٍ');
assert.ok(book.sunHeatedWater.quote.label.includes('Khalîl'),'Citation de Khalîl mal attribuée');
assert.ok(book.sunHeatedWater.sources.some(x=>x.url===book.book.sourceUrl),'Lien Usul fiche 13 absent');
assert.ok(book.sunHeatedWater.sources.some(x=>x.url.includes('/19/120/')),'Passage Islamweb fiche 13 absent');
assert.ok(book.sunHeatedWater.sources.some(x=>x.url.includes('/4471/110')),'Source imprimée distincte fiche 13 absente');
// Fiche 14 : la chaleur de l’eau, le sens de la difficulté et les avis sur l’entrée au hammam.
assert.equal(book.heatedWaterHammam.id,'heated-water-hammam-14');
assert.equal(book.heatedWaterHammam.number,'14');
assert.equal(book.heatedWaterHammam.status,'disponible');
assert.equal(book.heatedWaterHammam.goals.length,19,'Dix-neuf objectifs attendus dans la fiche 14');
assert.equal(book.heatedWaterHammam.sections.length,19,'Dix-neuf lectures commentées attendues dans la fiche 14');
assert.deepEqual(Array.from(book.heatedWaterHammam.sections,x=>x.id),["heated-with-najasa","malik-ashhab","ibn-abd-salam-climate","mujahid-comfort","ibn-imam-no-hardship","hardship-reward","ubbi-warming","hammam-three-cases","private-hammam","uncovered-users","necessary-withdrawal","covered-with-covered","malik-basin-purity","bayyan-basin-risk","ibn-shas-conditions","obligatory-recommended","custom-seasons","women-bath-opinions","weak-hammam-report"],'Ordre des sections de la fiche 14 modifié');
assert.deepEqual(Array.from(book.heatedWaterHammam.sections,x=>x.passage.arabic),["يكره الماء المسخن بالنجاسة وإن لم يتغير","لا بأس بالوضوء بالماء المسخن وأنا أفعله كثيرا","وما وقع لمالك رحمه الله من تفضيل البارد على المسخن إنما ذلك لكونه يشد الأعضاء ولنشاط النفس بعده في إقليم الحجاز وحرارة البلاد","ونقل في البيان كراهته عن مجاهد","لأن الله تعالى لم يطلب من عباده المشاق","فإن لم تحصل إلا بمشقة عظم الأجر لقرب الإخلاص","وتسخين الماء لدفع برده ليقوى على العبادة لا يمنع لحصول الثواب المذكور","وأما دخول الحمام فوقع فيه اختلاف في الروايات وفتاوى الشيوخ","الأول إذا كان خاليا","الثاني إذا كان غير مستتر أو معه من لا يستتر","إلا أن يدخله غاضا بصره لإخراجه لا لمقامه فيه","لا بأس به وتركه أحسن","نعم إذا كان طاهرا","لأنه يسخن بالأقذار والنجاسات ولاختلاف الأيدي","وعلى القول بالجواز يصح بعشرة شروط ذكرها ابن شاس","هذه آداب منها واجب ومنها مندوب","يختص كل زمان بعادته وعرفه","ولا تدخله امرأة إلا من علة","لكن ذكر النووي في شرح المهذب في كتاب الحج أنه حديث ضعيف"],'Citations arabes de la fiche 14 modifiées');
for(const part of book.heatedWaterHammam.sections){
 assert.ok(part.paragraphs.length===2&&part.paragraphs.every(p=>p.length>=450),'Développement insuffisant : '+part.id);
 assert.ok(part.passage.arabic&&part.passage.translation&&part.passage.sourceLabel.length>=50&&part.passage.explanation.length>=130,'Citation, attribution ou contexte absents : '+part.id);
 assert.ok(part.passage.sourceUrl.includes('/4471/11'),'Référence primaire page 112-114 absente : '+part.id);
 assert.ok(part.steps.length===4&&part.steps.every(x=>x.label&&x.text.length>=80),'Étapes guidées insuffisantes : '+part.id);
 assert.ok(part.example?.title&&part.example.text.length>=360,'Exemple pédagogique insuffisant : '+part.id);
 assert.ok(part.takeaway.length>=155&&part.sourceNote.includes('tome 1'),'Conclusion ou source manquante : '+part.id);
}
assert.ok(book.heatedWaterHammam.sections[1].passage.sourceLabel.includes('Mâlik'),'Parole de Mâlik mal attribuée');
assert.ok(book.heatedWaterHammam.sections[4].passage.sourceLabel.includes('Ibn al-Imâm'),'Discussion de la difficulté non attribuée');
assert.ok(book.heatedWaterHammam.sections[7].passage.sourceLabel.includes('Ibn Rushd'),'Trois cas du hammam non attribués');
assert.ok(book.heatedWaterHammam.sections[10].passage.sourceLabel.includes('Ibn al-Qâsim'),'Prélèvement nécessaire non attribué');
assert.ok(book.heatedWaterHammam.sections[14].passage.sourceLabel.includes('Ibn Shâs'),'Dix recommandations non attribuées');
assert.ok(book.heatedWaterHammam.sections[15].passage.sourceLabel.includes('Al-Hattâb'),'Obligatoire et recommandé mal attribués');
assert.ok(book.heatedWaterHammam.sections[17].passage.sourceLabel.includes('Risâla'),'Discussion des femmes sans source');
assert.ok(book.heatedWaterHammam.sections[18].passage.sourceLabel.includes('Nawawî'),'Critique du récit non attribuée');
assert.equal(book.heatedWaterHammam.lexicon.length,22,'Vingt-deux entrées attendues dans le lexique');
assert.equal(new Set(book.heatedWaterHammam.lexicon.map(x=>x.term)).size,22,'Doublons lexique fiche 14');
assert.ok(book.heatedWaterHammam.lexicon.every(x=>x.arabic&&x.term&&x.definition.length>=120),'Définition du lexique trop courte');
assert.equal(book.heatedWaterHammam.quiz.length,19,'Dix-neuf questions attendues');
for(const q of book.heatedWaterHammam.quiz)assert.ok(q.choices.length===3&&q.answer>=0&&q.answer<3&&q.explanation.length>=120,'Question ou correction insuffisante');
assert.ok(book.heatedWaterHammam.quote.arabic.includes('لَمْ يَطْلُبْ'),'Citation principale de la difficulté absente');
assert.ok(book.heatedWaterHammam.sources.some(x=>x.url===book.book.sourceUrl),'Référence Usul absente');
for(const x of ['/4471/112','/4471/113','/4471/114','/19/121/','/19/122/'])assert.ok(book.heatedWaterHammam.sources.some(s=>s.url.includes(x)),'Référence primaire manquante : '+x);
// Fiche 15 : souillures constatées, animal mort en eau stagnante et divergences sur le puisage.
assert.equal(book.visibleImpurityAndWells.id,'visible-impurity-wells-15');
assert.equal(book.visibleImpurityAndWells.number,'15');
assert.equal(book.visibleImpurityAndWells.status,'disponible');
assert.equal(book.visibleImpurityAndWells.sections.length,20,'Vingt lectures commentées requises pour la fiche 15');
assert.equal(book.visibleImpurityAndWells.goals.length,20,'Vingt objectifs explicites requis');
assert.equal(new Set(book.visibleImpurityAndWells.sections.map(s=>s.id)).size,20,'Sections en doublon');
assert.deepEqual(Array.from(book.visibleImpurityAndWells.sections,s=>s.id),[
 'mouth','language','habit','alteration','food','certainty','timing','absence','animal-death','alive',
 'rushd-ibn-imam','fell-dead','blood','stagnant','water-changed','mashhur','mudawwana','wisdom','amount','majishun'
],'Ordre des lectures de la fiche 15 altéré');
for(const part of book.visibleImpurityAndWells.sections){
 assert.ok(part.paragraphs.length===2&&part.paragraphs.every(x=>x.length>=390),'Lecture trop courte : '+part.id);
 assert.ok(part.passage.arabic&&part.passage.translation&&part.passage.sourceLabel.length>=60&&part.passage.explanation.length>=120,'Attribution ou explication manquante : '+part.id);
 assert.ok(part.context.length>=110&&/[?!]/.test(part.context),'Cas de départ peu concret : '+part.id);
 assert.ok(/[.!?…]$/.test(part.passage.explanation),'Explication sous citation tronquée : '+part.id);
 assert.ok(/\/4471\/11[4567]/.test(part.passage.sourceUrl),'Lien vers la page arabe d’origine manquant : '+part.id);
 assert.ok(part.steps.length===4&&part.steps.every(x=>x.label&&x.text.length>=65),'Décomposition insuffisante : '+part.id);
 assert.ok(part.example.title&&part.example.text.length>=345,'Exemple pédagogique insuffisant : '+part.id);
 assert.ok(part.takeaway.length>=145&&part.sourceNote.includes('tome 1'),'Synthèse ou pagination manquante : '+part.id);
}
for(const index of [0,8])assert.ok(book.visibleImpurityAndWells.sections[index].passage.sourceLabel.includes('Khalîl'),'Parole du Mukhtasar mal attribuée');
assert.ok(book.visibleImpurityAndWells.sections[5].passage.sourceLabel.includes('Al-Hattâb'),'Critique de la formulation mal attribuée');
assert.ok(book.visibleImpurityAndWells.sections[9].passage.sourceLabel.includes('Ibn Rushd'),'Divergence sur l’animal vivant mal attribuée');
assert.ok(book.visibleImpurityAndWells.sections[10].passage.sourceLabel.includes('Ibn al-Imâm'),'Divergence de présomption mal attribuée');
assert.ok(book.visibleImpurityAndWells.sections[16].passage.sourceLabel.includes('Mudawwana'),'Transmission de Mâlik non attribuée');
assert.ok(book.visibleImpurityAndWells.sections[19].passage.sourceLabel.includes('Ibn al-Mâjishûn'),'Parole finale mal attribuée');
assert.equal(book.visibleImpurityAndWells.lexicon.length,22,'Vingt-deux termes de lexique attendus');
assert.equal(new Set(book.visibleImpurityAndWells.lexicon.map(t=>t.term)).size,22,'Doublons de lexique fiche 15');
assert.ok(book.visibleImpurityAndWells.lexicon.every(t=>t.arabic&&t.term&&t.definition.length>=110),'Définition du lexique trop courte');
assert.equal(book.visibleImpurityAndWells.quiz.length,20,'Vingt questions corrigées attendues');
for(const q of book.visibleImpurityAndWells.quiz)assert.ok(q.choices.length===3&&q.answer>=0&&q.answer<3&&q.explanation.length>=135,'Question ou correction insuffisante');
assert.ok(book.visibleImpurityAndWells.quote.arabic.includes('تسعة وأربعين'),'Parole d’Ibn al-Mâjishûn absente');
for(const x of ['/4471/114','/4471/115','/4471/116','/4471/117'])
 assert.ok(book.visibleImpurityAndWells.sources.some(s=>s.url.includes(x)),'Lien source primaire absent : '+x);
// Fiche 16 : l’eau dont l’altération causée par l’impureté disparaît.
assert.equal(book.restoredWater.id,'water-purity-return-16');
assert.equal(book.restoredWater.number,'16');
assert.equal(book.restoredWater.status,'disponible');
assert.equal(book.restoredWater.sections.length,24,'Vingt-quatre lectures attendues pour la fiche 16');
assert.equal(book.restoredWater.goals.length,24,'Vingt-quatre objectifs de lecture attendus');
assert.deepEqual(Array.from(book.restoredWater.sections,s=>s.id),[
 'khalil-condition','paths','abundant-consensus','well','rain','abu-muhammad','other-substance','spontaneous','partial-withdrawal','two-positions','ibn-ghazi','ibn-marzouq',
 'ibn-arafa','absence-evidence','ibn-wahb-scenario','ibn-qasim','ibn-rushd','malik-narrations','tartushi-cistern','fakihani','clay','pure-change','small-added-water','final-volumes-urine'
],'Ordre des 24 lectures de la fiche 16 modifié');
assert.equal(new Set(book.restoredWater.sections.map(s=>s.id)).size,24,'Identifiants des lectures en doublon');
for(const part of book.restoredWater.sections){
 assert.ok(part.paragraphs.length===2&&part.paragraphs.every(x=>x.length>=410),'Deux développements longs manquants : '+part.id);
 assert.ok(part.passage.arabic&&part.passage.translation&&part.passage.explanation.length>=120&&part.passage.sourceLabel.length>=50,'Citation, explication ou attribution absente : '+part.id);
 assert.ok(part.context.length>=110&&/[?!]/.test(part.context),'Situation initiale non expliquée : '+part.id);
 assert.ok(/[.!?…]$/.test(part.passage.explanation),'Explication sous citation tronquée : '+part.id);
 assert.ok(/\/4471\/1(?:18|19|20)/.test(part.passage.sourceUrl),'Référence primaire page 118-120 absente : '+part.id);
 assert.ok(part.steps.length===4&&part.steps.every(x=>x.label&&x.text.length>=60),'Analyse en quatre étapes incomplète : '+part.id);
 assert.ok(part.example?.title&&part.example.text.length>=350,'Situation concrète insuffisante : '+part.id);
 assert.ok(part.takeaway.length>=140&&part.sourceNote.includes('tome 1'),'Conclusion ou référence manquante : '+part.id);
}
assert.ok(book.restoredWater.sections[0].passage.sourceLabel.includes('Khalîl'),'Phrase du Mukhtasar non attribuée');
assert.ok(book.restoredWater.sections[2].passage.sourceLabel.includes('Tawdîh'),'Accord lié à al-Tawdîh mal attribué');
assert.ok(book.restoredWater.sections[9].passage.sourceLabel.includes('Ibn Yûnus'),'Question de l’avis d’Ibn Yûnus effacée');
assert.ok(book.restoredWater.sections[10].passage.sourceLabel.includes('Ibn Ghâzî'),'Critique d’Ibn Ghâzî non attribuée');
assert.ok(book.restoredWater.sections[11].passage.sourceLabel.includes('Ibn Marzûq'),'Critique d’Ibn Marzûq non attribuée');
assert.ok(book.restoredWater.sections[12].passage.sourceLabel.includes('Ibn ‘Arafa'),'Propos d’Ibn ‘Arafa absent');
assert.ok(book.restoredWater.sections[15].passage.sourceLabel.includes('Ibn al-Qâsim'),'Avis d’Ibn al-Qâsim absent');
assert.ok(book.restoredWater.sections[16].passage.sourceLabel.includes('Ibn Rushd'),'Préférence d’Ibn Rushd absente');
assert.ok(book.restoredWater.sections[17].passage.sourceLabel.includes('Mâlik'),'Transmission de Mâlik absente');
assert.ok(book.restoredWater.sections[18].passage.sourceLabel.includes('Tirâz'),'Récit d’al-Tirâz mal attribué');
assert.ok(book.restoredWater.sections[19].passage.sourceLabel.includes('Fâkihânî'),'Mashhûr d’Ibn al-Fâkihânî absent');
assert.ok(book.restoredWater.sections[21].passage.sourceLabel.includes('Karawî'),'Cas de la substance pure mal attribué');
assert.ok(book.restoredWater.sections[22].passage.sourceLabel.includes('Bisâtî'),'Petite addition d’eau non traitée');
assert.ok(book.restoredWater.sections[23].passage.sourceLabel.includes('Al-Hattâb'),'Conclusion de l’auteur absente');
assert.equal(book.restoredWater.lexicon.length,28,'Vingt-huit termes attendus dans le lexique');
assert.equal(new Set(book.restoredWater.lexicon.map(x=>x.term)).size,28,'Terme répété dans le lexique 16');
assert.ok(book.restoredWater.lexicon.every(x=>x.arabic&&x.term&&x.definition.length>=110),'Lexique insuffisamment développé');
assert.equal(book.restoredWater.quiz.length,24,'Vingt-quatre questions corrigées attendues');
for(const question of book.restoredWater.quiz)assert.ok(question.choices.length===3&&question.answer>=0&&question.answer<3&&question.explanation.length>=150,'Question ou justification incomplète');
assert.ok(book.restoredWater.quote.arabic.includes('عدم الوجدان عدم الوجود'),'Enseignement principal du chapitre perdu');
assert.ok(book.restoredWater.sources.some(x=>x.url===book.book.sourceUrl),'Notice Usul manquante');
for(const pg of [118,119,120])assert.ok(book.restoredWater.sources.some(x=>x.url.includes('/4471/'+pg)),'Page primaire fiche 16 absente : '+pg);

assert.ok(book.nextChapter.status.includes('fiche 17 non publiée'));
assert.equal(['intro','purification','naturalWaters','waterChanges','pureMixtures','impureContact','usedWater','recommendedWater','flowingWater','publicBasins','limitedWell','leftoverWater','sunHeatedWater','heatedWaterHammam','visibleImpurityAndWells','restoredWater'].filter(key=>book[key]?.status==='disponible').length,16,'Seize fiches réellement accessibles');
// Relecture pédagogique globale : 129 lectures des fiches 01 à 14 commencent par un cas compréhensible.
const firstFourteen=['intro','purification','naturalWaters','waterChanges','pureMixtures','impureContact','usedWater','recommendedWater','flowingWater','publicBasins','limitedWell','leftoverWater','sunHeatedWater','heatedWaterHammam'];
const allPreviousSections=firstFourteen.flatMap(key=>book[key].sections);
assert.equal(allPreviousSections.length,129,'Le nombre de lectures des quatorze fiches historiques a changé');
assert.ok(allPreviousSections.every(s=>s.passage?.arabic&&s.passage?.translation&&(s.passage?.sourceUrl||s.passage?.sourceLabel)),'Référence de citation manquante parmi les quatorze fiches');
assert.ok(allPreviousSections.every(s=>s.context?.length>=175||s.example?.text?.length>=120),'Une lecture ancienne n’offre pas de cas pour commencer');
assert.ok(book.sunHeatedWater.sections.every(s=>s.context?.length>=175),'Quinze introductions de la fiche 13 manquantes');
assert.ok(book.heatedWaterHammam.sections.every(s=>s.context?.length>=175),'Dix-neuf introductions de la fiche 14 manquantes');
assert.ok(view.includes('v-else-if="section.example" class="fiqh-m-case fiqh-m-case-intro"'),'Les exemples des fiches 1 à 12 ne précèdent pas les citations');
assert.ok(view.includes('v-if="section.example && section.context" class="fiqh-m-case"'),'L’ancien exemple est dupliqué au lieu d’être déplacé');
assert.ok(view.indexOf('fiqh-m-case-intro')<view.indexOf('v-if="section.passage"'),'La situation doit précéder l’extrait arabe');
assert.ok(!book.visibleImpurityAndWells.sections[0].paragraphs[0].startsWith('Après la discussion sur le hammam'),'Ancienne introduction opaque encore présente');
assert.ok(book.visibleImpurityAndWells.sections[0].paragraphs[0].includes('vient de boire du vin'),'Exemple initial de la bouche souillée absent');
assert.ok(view.includes('fiqh-m-situation'),'Contexte d’abord requis');
for(const t of ['role="tablist"','role="tabpanel"','lesson.sections','lesson.value?.lexicon','lesson.quiz','lesson.quote.arabic','lesson.sources','fiqh-m-source-button','fiqh-m-terms','fiqh-m-quiz','localStorage','selectedLessonKey','selectLesson(entry.key)','athar_fiqh_maliki_tahara_02_done','athar_fiqh_maliki_eaux_03_done','athar_fiqh_maliki_eaux_04_done','athar_fiqh_maliki_eaux_05_done','athar_fiqh_maliki_eaux_06_done','athar_fiqh_maliki_eaux_07_done','athar_fiqh_maliki_eaux_08_done','athar_fiqh_maliki_eaux_09_done','athar_fiqh_maliki_eaux_10_done','athar_fiqh_maliki_eaux_11_done','athar_fiqh_maliki_eaux_12_done','athar_fiqh_maliki_eaux_13_done','athar_fiqh_maliki_eaux_14_done','athar_fiqh_maliki_eaux_15_done','athar_fiqh_maliki_eaux_16_done','availableLessons','completedCount','course[entry.key].number','fiqh-m-index','fiqh-m-catalog-card','fiqh-m-index-search','fiqh-m-index-progress','fiqh-m-index-resume','fiqh-m-index-back','fiqh-m-index-grid','filteredLessons','handleBack','athar_fiqh_maliki_last_lesson'])assert.ok(view.includes(t),'Composant incomplet : '+t);
assert.ok(css.includes('.dark .fiqh-m-root')&&css.includes('@media(max-width:540px)')&&css.includes('prefers-reduced-motion'));
for(const token of ['.fiqh-m-index-grid','.fiqh-m-catalog-card','.fiqh-m-index-progress','.fiqh-m-index-ring','@media(max-width:610px)']) assert.ok(css.includes(token),'Style catalogue absent : '+token);
for(const token of ['fiqh-m-goals','fiqh-m-passage','fiqh-m-passage-translation','fiqh-m-breakdown','fiqh-m-case','fiqh-m-takeaway','section.passage','section.steps','section.example'])assert.ok(view.includes(token),'Pédagogie guidée absente : '+token);
for(const token of ['.fiqh-m-goals','.fiqh-m-passage','.fiqh-m-breakdown','.fiqh-m-case','.fiqh-m-takeaway'])assert.ok(css.includes(token),'Style pédagogique absent : '+token);
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
console.log('Fiqh malikite : 16 fiches vérifiées ; fiche 01 = 4 étapes ; fiche 02 = 5 lectures ; fiche 03 = 6 lectures guidées, 10 termes, 8 questions ; fiche 04 = 6 lectures guidées, 10 termes, 8 QCM ; fiche 05 = 7 lectures guidées, 12 termes, 9 questions ; fiche 06 = 7 lectures guidées, 12 termes, 9 questions ; fiche 07 = 7 lectures guidées, 12 termes, 9 questions ; fiche 08 = 9 lectures commentées, 14 termes, 12 questions ; fiche 09 = 10 lectures commentées, 15 termes, 12 questions ; fiche 10 = 9 lectures commentées, 15 termes, 12 questions ; fiche 11 = 11 lectures commentées, 18 termes, 12 questions ; fiche 12 = 14 lectures commentées, 20 termes, 17 questions ; fiche 13 = 15 lectures commentées, 20 termes, 16 questions ; fiche 14 = 19 lectures commentées, 22 termes, 19 questions ; fiche 15 = 20 lectures commentées, 22 termes, 20 questions ; fiche 16 = 24 lectures commentées, 28 termes, 24 questions ; '+shell.length+' ressources PWA.');
