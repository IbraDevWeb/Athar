#!/usr/bin/env node
// Fiqh malikite : contrôle des douze fiches, fondées sur les passages vérifiés d'al-Hattâb.
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
assert.ok(book.recommendedWater.sections[4].passage.sourceLabel.includes('al-Qarâfî'),'Analyse des deux causes mal attribuée');
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
const advancedLessons = [
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
assert.equal(new Set(['usedWater','recommendedWater','flowingWater'].flatMap(key=>book[key].lexicon.map(x=>x.term))).size,32,'Les 32 notions des fiches 07 à 09 doivent être distinctes');
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
console.log('Fiqh malikite : 12 fiches vérifiées ; fiche 01 = 4 étapes ; fiche 02 = 5 lectures ; fiche 03 = 6 lectures guidées, 10 termes, 8 questions ; fiche 04 = 6 lectures guidées, 10 termes, 8 QCM ; fiche 05 = 7 lectures guidées, 12 termes, 9 questions ; fiche 06 = 7 lectures guidées, 12 termes, 9 questions ; fiche 07 = 7 lectures guidées, 12 termes, 9 questions ; fiche 08 = 9 lectures commentées, 14 termes, 12 questions ; fiches 09-12 préservées ; '+shell.length+' ressources PWA.');
