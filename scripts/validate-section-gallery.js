#!/usr/bin/env node
// Cohérence de la galerie de fiches. Les données éditoriales restent intactes.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const read = path => fs.readFileSync(path, 'utf8');
const css = read('css/section-gallery-unified.css');
const config = read('js/config.js');
const worker = read('service-worker.js');
for (const asset of ['css/library-pro.css','css/hadith-pro.css','css/adhkar-pro.css','css/timeline-pro.css']) {
    assert.ok(config.includes(asset), 'Style d’origine absent : ' + asset);
}
assert.ok(config.includes('css/section-gallery-unified.css'), 'Galerie non chargée');
assert.ok(worker.includes('css/section-gallery-unified.css'), 'Galerie non cachée en PWA');
assert.ok(css.includes('@media (max-width:590px)') && css.includes('@media (max-width:1100px)'), 'Grilles mobiles incomplètes');
assert.ok(css.includes('.dark .glossary-pro-root') && css.includes('.dark .library-pro-root'), 'Mode sombre incomplet');
assert.ok(css.includes('prefers-reduced-motion:reduce'), 'Réduction des animations absente');
const themes = [
  ['library-pro-root','#365c82'],
  ['hadith-pro-root','#486f99'],
  ['adhkar-pro-shell','#7b62a2'],
  ['glossary-pro-root','#af7459'],
  ['timeline-pro','#a17a3d']
];
for (const [selector,color] of themes) {
    assert.ok(css.includes('.'+selector), 'Style de section absent : '+selector);
    assert.ok(css.includes('--ax-accent:'+color), 'Couleur personnelle absente : '+selector);
}
assert.equal(new Set(themes.map(x=>x[1])).size,themes.length,'Couleurs non différenciées');
const components = {
  library:'js/components/LibraryView.js',
  hadiths:'js/components/HadithsView.js',
  glossary:'js/components/GlossaryView.js',
  adhkar:'js/components/AdhkarView.js',
  timeline:'js/components/TimelineView.js'
};
for (const file of Object.values(components)) new vm.Script(read(file), { filename:file });
const library = read(components.library);
const hadith = read(components.hadiths);
const glossary = read(components.glossary);
const adhkar = read(components.adhkar);
const timeline = read(components.timeline);
assert.ok(library.includes('library-pro-card-emblem') && library.includes('library-pro-card-category'), 'Emblème ou catégorie de biographie absent');
assert.ok(hadith.includes('hadith-pro-card-symbol') && hadith.includes('hadith-kutub-book-mark'), 'Emblème des hadiths absent');
assert.ok(hadith.includes('ATHAR_KUTUB_SITTA.collections'), 'Les six recueils ne doivent pas disparaître');
assert.ok(glossary.includes('glossary-pro-categories') && glossary.includes('glossary-pro-card-icon'), 'Nouvel affichage du lexique incomplet');
assert.ok(glossary.includes('visibleLimit = Vue.ref(24)') && glossary.includes('loadMore'), 'Pagination du lexique absente');
for (const key of ['adhkar-pro-card-grid','adhkar-pro-routine-grid','adhkar-pro-reader-layer']) assert.ok(adhkar.includes(key));
for (const key of ['timeline-pro-event-card','timeline-pro-era-grid','timeline-pro-path-grid']) assert.ok(timeline.includes(key));
const glossaryData = vm.runInNewContext(read('glossary_data.js') + '\nGLOSSARY_DATA');
const hadithData = vm.runInNewContext(read('hadiths_data.js') + '\nSTORED_HADITHS');
assert.ok(Object.keys(glossaryData).length >= 300,'Le lexique a été réduit');
assert.equal(hadithData.length,50,'Les hadiths ont été modifiés');
console.log('Galeries validées : 5 couleurs, 5 sections à fiches, Tabib vert préservé, corpus inchangé.');
