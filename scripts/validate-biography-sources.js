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
assert.deepEqual(Object.keys(bibliography).sort(), ['1','2','3','4','5']);
let total=0, qualified=0;
for (const [id, source] of Object.entries(bibliography)) {
  const chapter = chapters.find(c => String(c.id) === id);
  assert.ok(chapter, 'Biographie inexistante : '+id);
  assert.match(source.readUrl, /^https:\/\/siyar\.fr\/livre\/1\/(11|29|47|73|96)$/);
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
assert.equal(total,14,'Attendu : 14 repères précis sur cinq biographies');
assert.ok(qualified>=6,'Les variantes historiques doivent être conservées');
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
console.log('Siyar : 5 biographies, 14 passages localisés, '+qualified+' mentions de prudence, sans copie PDF.');
