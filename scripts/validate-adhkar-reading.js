#!/usr/bin/env node
// Régression Al-Adhkâr : conservation du texte documentaire, lecture et navigation.
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const read=p=>fs.readFileSync(p,'utf8');
const data=vm.runInNewContext(read('adhkar_data.js')+'\nADHKAR_DATA');
const code=read('js/components/AdhkarView.js');
const css=read('css/adhkar-calm-reading.css');
const config=read('js/config.js');
const worker=read('service-worker.js');
new vm.Script(code,{filename:'js/components/AdhkarView.js'});
assert.ok(Array.isArray(data) && data.length>=25,'Toutes les fiches de dhikr doivent rester disponibles');
assert.equal(new Set(data.map(x=>x.id)).size,data.length,'Numéros de dhikr dupliqués');
for (const entry of data) {
  for (const field of ['id','category','title','arabic','translation','count','source']) {
    assert.ok(String(entry[field]??'').trim(), 'Champ documentaire vide : '+entry.id+'/'+field);
  }
}
// Bibliographie vérifiable : une fiche = son numéro exact dans Hisn al-Muslim.
// Les textes de récitation ne doivent plus comporter de coupures silencieuses.
assert.equal((read('adhkar_data.js').match(/\\[cite:/gi)||[]).length,0,'Annotations de citation techniques dans le corpus');
for (const entry of data) {
  assert.equal(entry.source_url,'https://sunnah.com/hisn/'+entry.id,'Référence individuelle manquante : '+entry.id);
  assert.ok(entry.source.includes('Hisn al-Muslim n° '+entry.id),'Source éditoriale non localisable : '+entry.id);
  for (const field of ['arabic','phonetic','translation','context']) {
    assert.ok(!/\\.{3}|…/.test(String(entry[field]||'')),
      'Texte de récitation encore abrégé : '+entry.id+'/'+field);
  }
}
assert.ok(data.find(x=>x.id===14).arabic.startsWith('اللَّهُمَّ اجْعَلْنِي'),
  'Le texte d’ablution ne doit pas contenir un fragment de la prière pour la lumière');
assert.equal((data.find(x=>x.id===4).arabic.match(/\\{(?:19\\d|200)\\}/g)||[]).length,11,
  'Le Coran 3:190–200 doit être présent intégralement en arabe');
assert.ok(data.find(x=>x.id===4).additional_source_url.includes('quran.com/'),
  'Le lien de la traduction complète du Coran doit être disponible');
assert.ok(data.find(x=>x.id===24).additional_source_url.endsWith('/bukhari:3370'),
  'La formule de salawât doit être documentée séparément de la consigne du Hisn');
for (const token of [':href="selected.source_url"',':href="selected.additional_source_url"',
                    'selected.translation_label','selected.editorial_note']) {
  assert.ok(code.includes(token),'Affichage des références et avertissements incomplet : '+token);
}
const categories=new Set(data.map(x=>x.category));
assert.ok(categories.size>=7,'Des contextes de dhikr ont disparu');
for(const marker of [
  "mode = Vue.ref('library')",
  'displayedItems = Vue.computed(() => filteredItems.value.slice(0,visibleLimit.value))',
  'visibleLimit = Vue.ref(18)',
  'categoryChoices = Vue.computed',
  'favoritesOnly', 'toggleFavorite', 'routineCompletion','openRoutine',
  'recordCompletion', 'state.history', 'decrement','resetItem','persist',
  'adhkar-pro-card-grid','adhkar-pro-routine-grid','adhkar-pro-reader',
  'adhkar-pro-reader-notes','selected.source','selected.virtue',
  'aria-modal="true"', 'aria-pressed="isFavorite',
  'adr'
].filter(token=>token!=='adr')) {
  assert.ok(code.includes(marker),'Fonction Adhkâr perdue : '+marker);
}
assert.ok(code.includes('const focusReader = () => Vue.nextTick'),'Le lecteur doit gérer le focus');
assert.ok(code.includes("event.key === 'Escape'"),'La fermeture au clavier est absente');
assert.ok(code.includes("selected.value=null")||code.includes("selected.value = null"),'La fermeture du lecteur est absente');
assert.ok(code.includes('<details class="adhkar-pro-reader-notes">'),'Les références doivent rester en second plan');
assert.ok(!code.includes('class="adhkar-pro-hero-stats"'),'Les gros indicateurs ne doivent plus encombrer la page');
for(const marker of [
 '.adhkar-pro-shell .adhkar-pro-card','.adhkar-pro-shell .adhkar-pro-routine-card',
 '.adhkar-pro-shell .adhkar-pro-reader',
 '.adhkar-pro-shell .adhkar-pro-category-row',
 '.adhkar-pro-shell .adhkar-pro-card-arabic',
 '.adhkar-pro-shell .adhkar-pro-counter',
 '.adhkar-pro-shell .adhkar-pro-reader-notes',
 '@media(max-width:610px)','@media(max-width:370px)',
 'prefers-reduced-motion:reduce'
]) assert.ok(css.includes(marker),'Style ou breakpoint manquant : '+marker);
assert.ok(css.includes('::before') && css.includes('content:none!important'), 'Décorations lourdes des cartes non retirées');
for (const scope of ['.library-pro-root','.timeline-pro','.hadith-pro-root','.glossary-pro-root','.tabib-pro-root']) {
  assert.ok(!css.includes(scope),'Surcharge Adhkâr hors périmètre : '+scope);
}
assert.ok(config.includes("css/adhkar-calm-reading.css?v=\${APP_VERSION}"),'Feuille de lecture non chargée');
assert.ok(worker.includes('css/adhkar-calm-reading.css'), 'Feuille Adhkâr absente du cache');
assert.ok(worker.includes('js/components/AdhkarView.js?v=athar-adhkar-sources-v1'),'Composant Adhkâr non versionné');
assert.ok(config.indexOf("'athar-adhkar-calm-reading'")>config.indexOf("'athar-library-stream-numeric'"),
 'La finition Adhkâr doit se charger après le style transversal');
console.log('Adhkâr validés : '+data.length+' invocations, '+categories.size+' contextes, compteur et sources conservés.');
