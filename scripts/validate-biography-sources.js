#!/usr/bin/env node
// Garde-fou documentaire : références exactes, nuances, absence de PDFs embarqués.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
const chapters = vm.runInNewContext(read('biographies_data.js') + '\nCHAPTERS_DATA');
const bibliography = vm.runInNewContext(read('biography_sources_data.js') + '\nBIOGRAPHY_SOURCES');
assert.equal(Array.isArray(chapters), true);
const expectedUrls = {
  1: 11, 2: 29, 3: 47, 4: 73, 5: 96,
  6: 126, 7: 150, 8: 156, 9: 158, 10: 165,
  13: 167, 14: 169, 15: 175
};
assert.deepEqual(Object.keys(bibliography).map(Number).sort((a,b) => a-b), Object.keys(expectedUrls).map(Number).sort((a,b) => a-b));
assert.equal(bibliography[11], undefined, 'La notice Athar 11 ne correspond pas au n° 11 du fascicule 07–14');
assert.equal(bibliography[12], undefined, 'La notice Athar 12 ne correspond pas au n° 12 du fascicule 07–14');
let total=0, qualified=0;
for (const [id, source] of Object.entries(bibliography)) {
  const chapter = chapters.find(c => String(c.id) === id);
  assert.ok(chapter, 'Biographie inexistante : '+id);
  assert.equal(source.readUrl, 'https://siyar.fr/livre/1/'+expectedUrls[id]);
  assert.equal(source.publisherUrl, 'https://islam-patrimoine.org/');
  assert.ok(source.translation.includes('Islam Patrimoine'));
  assert.ok(source.reviewScope.includes('ne certifie'));
  assert.ok(source.entries.length > 0);
  const keys=new Set();
  for(const entry of source.entries) {
    const key=entry.kind+':'+entry.id;
    assert.ok(!keys.has(key), 'Doublon documentaire : '+id+'/'+key);
    keys.add(key);
    assert.equal(entry.pdfPage,entry.printedPage+1);
    assert.ok(entry.printedPage > 0 && Number.isInteger(entry.printedPage));
    assert.ok(entry.note.length > 28);
    assert.ok(['located','variant','weak','qualification'].includes(entry.status));
    if(entry.kind==='narrative') {
      assert.ok(chapter.narratives.some(n=>n.id===entry.id), 'Récit introuvable : '+id+'/'+key);
    } else {
      assert.equal(entry.kind,'timeline');
      assert.ok(chapter.timeline[entry.id], 'Événement introuvable : '+id+'/'+key);
    }
    if(entry.status!=='located')qualified++;
    total++;
  }
}
assert.equal(total,46,'Attendu : 46 repères documentaires précis sur treize biographies');
assert.ok(qualified>=15,'Les réserves de transmission et les variantes historiques doivent être conservées');
const conv=chapters.find(c=>c.id===4).narratives.find(n=>n.id===401);
assert.ok(/munkar/.test(conv.content), 'La réserve sur le convoi doit apparaître dans le texte');
const tomb=chapters.find(c=>c.id===2).narratives.find(n=>n.id===204);
assert.ok(!/Miracle de la Tombe/.test(tomb.title),'Intitulé trompeur');
assert.ok(/rêve/.test(tomb.content),'Le récit doit préserver son origine');
assert.ok(bibliography[4].entries.some(x=>x.id===401&&x.status==='weak'));
assert.ok(bibliography[3].entries.some(x=>x.kind==='timeline'&&x.id===0&&x.status==='variant'));
const reader=read('js/components/ReaderView.js');
const library=read('js/components/LibraryView.js');
const index=read('index.html');
const worker=read('service-worker.js');
assert.ok(reader.includes('athar-siyar-sources'),'Onglet bibliographie absent');
assert.ok(reader.includes("sourceEvidence('narrative', story.id)"),'Références récit absentes');
assert.ok(reader.includes("sourceEvidence('timeline', i)"),'Références chronologie absentes');
assert.ok(reader.includes('Lire sur Siyar.fr'),'Lien vers source externe absent');
assert.ok(!library.includes('> Vérifiée<'),'Badge « Vérifiée » non qualifié');
assert.ok(!index.includes('Authentifié avec Siyar'),'Badge latéral non qualifié');
assert.ok(index.includes('biography_sources_data.js?v=athar-siyar-1'),'Registre non chargé');
assert.ok(worker.includes('biography_sources_data.js?v=athar-siyar-1'),'Registre non précaché');
assert.ok(!/https?:\/\/[^"'\s]+\.pdf/i.test(read('biography_sources_data.js')),'Le registre contient un lien vers un PDF');
// Les points controversés du nouveau lot ne doivent plus être présentés comme établis.
const story=(id,n) => chapters.find(c => c.id===id).narratives.find(x => x.id===n);
const evt=(id,n) => chapters.find(c => c.id===id).timeline[n].desc;
assert.ok(/52 H/.test(chapters.find(c=>c.id===6).timeline[4].year));
assert.ok(/3 H/.test(evt(8,3)) && /4 H/.test(evt(8,3)));
assert.ok(/non authentique/.test(evt(9,0)));
assert.ok(/moursal/.test(story(9,903).content));
assert.ok(!/ordonna de s’asseoir/.test(story(13,1301).content));
assert.ok(/critique/.test(story(14,1401).content));
assert.ok(!/en charité/.test(story(14,1403).content));
assert.ok(/idhkhir/.test(story(15,1503).content) && /Mouss’ab/.test(story(15,1503).content));
assert.ok(/chaîne faible/.test(chapters.find(c=>c.id===15).hadiths[0].source));
assert.ok(bibliography[14].entries.some(x=>x.kind==='narrative'&&x.id===1401&&x.status==='weak'));
assert.ok(bibliography[9].entries.some(x=>x.kind==='timeline'&&x.id===0&&x.status==='weak'));
console.log('Siyar : 13 biographies rattachées, '+total+' repères localisés, '+qualified+' mentions de prudence, notices Athar 11/12 en attente, aucun PDF.');
