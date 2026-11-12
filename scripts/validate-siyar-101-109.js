#!/usr/bin/env node
// Garde-fou documentaire pour les neuf notices manquantes du tome 2 de Siyar.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const read = file => fs.readFileSync(file, 'utf8');
const context = vm.createContext({ console, localStorage: undefined });
for (const name of ['biographies_data.js','biography_sources_data.js','siyar_101_109_data.js']) {
  new vm.Script(read(name), { filename: name }).runInContext(context);
}
const { chapters, bibliography } = vm.runInContext('({ chapters: CHAPTERS_DATA, bibliography: BIOGRAPHY_SOURCES })', context);
const ids = chapters.map(c => c.id);
assert.equal(ids.length, 113, 'Le corpus doit compter 113 fiches après ajout');
assert.equal(new Set(ids).size, ids.length, 'Identifiants biographiques en doublon');
assert.deepEqual(Array.from(ids).slice(100,109), [101,102,103,104,105,106,107,108,109], 'Numérotation de Siyar discontinue');
for (const [id, needle] of [[202,"Atikah"],[203,"Sayyida Nafisa"],[206,"Samarqandiyya"]]) {
  assert.ok(chapters.find(c => c.id === id)?.name.includes(needle), 'Ancienne notice écrasée : ' + id);
}
let events=0, stories=0, quotes=0, quiz=0, references=0;
for (let id=101;id<=109;id++) {
  const chapter=chapters.find(c=>c.id===id), source=bibliography[String(id)];
  assert.ok(chapter && source, 'Dossier absent '+id);
  for (const key of ['name','arabicName','intro','subtitle','genealogy','physicalDesc','heroQuote','source'])
    assert.ok(String(chapter[key]||'').length>=8, 'Champ incomplet '+id+'/'+key);
  assert.ok(chapter.timeline.length>=4 && chapter.narratives.length>=4, 'Chronologie ou récits incomplets '+id);
  assert.ok(chapter.hadiths.length>=2 && chapter.quizData.length>=5, 'Citations ou quiz incomplets '+id);
  assert.ok(source.readUrl.startsWith('https://siyar.fr/livre/2/'), 'Notice Siyar non reliée '+id);
  assert.ok(source.reviewScope.includes('ne certifie'), 'Réserve méthodologique absente '+id);
  const keys = new Set(source.entries.map(e=>e.kind+':'+e.id));
  assert.equal(keys.size,source.entries.length,'Doublons des repères '+id);
  assert.ok(keys.has('identity:0') && keys.has('quote:0'));
  for(const [i,e] of chapter.timeline.entries()) {
    assert.ok(e.year && e.desc && keys.has('timeline:'+i),'Événement sans référence '+id+'/'+i);events++;
  }
  for(const n of chapter.narratives){
    assert.ok(n.content.length>=100 && keys.has('narrative:'+n.id),'Récit insuffisant ou non sourcé '+id+'/'+n.id);stories++;
  }
  for(const [i,h] of chapter.hadiths.entries()){
    assert.ok(h.text && h.source && keys.has('hadith:'+i),'Transmission sans source '+id+'/'+i);quotes++;
  }
  for (const entry of source.entries) {
    assert.ok(entry.note && entry.externalUrl && /^https:\/\//.test(entry.externalUrl), 'Note sans lien documentaire '+id+'/'+entry.kind+'/'+entry.id);
    if(entry.kind==='hadith') {
      assert.ok(entry.grade && entry.isnad, 'Précision de transmission absente '+id+'/'+entry.id);
      if ([105,106,108].includes(id)) assert.notEqual(entry.grade,'sahih', 'Authentification non établie : '+id);
    }
    references++;
  }
  for (const q of chapter.quizData) {
    assert.ok(q.q && q.opts.length===4 && Number.isInteger(q.c) && q.exp && /^https:\/\//.test(q.ref), 'Quiz ou référence incomplets '+id);quiz++;
  }
}
assert.ok(!chapters.find(c=>c.id===106).tags.includes('Compagnons'),'Yazdgard ne doit pas être présenté comme un compagnon');
assert.ok(chapters.find(c=>c.id===106).intro.includes('dernier souverain'));
assert.ok(chapters.find(c=>c.id===108).heroQuote && bibliography['108'].entries.some(e=>e.kind==='quote'&&/gharîb|gharib/.test(e.note)));
const html=read('index.html'), worker=read('service-worker.js');
assert.ok(html.indexOf('biography_sources_data.js')<html.indexOf('siyar_101_109_data.js'));
assert.ok(html.indexOf('siyar_101_109_data.js')<html.indexOf('js/components/ReaderView.js'));
assert.ok(worker.includes("siyar_101_109_data.js?v=athar-siyar-101-109-v1"), 'Le cache PWA oublie les nouvelles fiches');
const component=read('js/components/ReaderView.js');
assert.ok(component.includes('Sources, variantes et fiabilité') && component.includes('sourceEvidence'), 'Appareil critique absent du lecteur');
console.log('Siyar 101–109 validé : 9 notices, '+events+' événements, '+stories+' récits, '+quotes+' traditions, '+quiz+' questions, '+references+' repères sourcés.');
