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
assert.ok(worker.includes('js/components/AdhkarView.js?v=athar-adhkar-reading-v1'),'Composant Adhkâr non versionné');
assert.ok(config.indexOf("'athar-adhkar-calm-reading'")>config.indexOf("'athar-library-stream-numeric'"),
 'La finition Adhkâr doit se charger après le style transversal');
console.log('Adhkâr validés : '+data.length+' invocations, '+categories.size+' contextes, compteur et sources conservés.');
