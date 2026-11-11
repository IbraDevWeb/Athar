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
  1: 11,
  2: 29,
  3: 47,
  4: 73,
  5: 96,
  6: 126,
  7: 150,
  8: 156,
  9: 158,
  10: 165,
  11: 256,
  13: 167,
  14: 169,
  15: 175,
  16: 186,
  17: 187,
  18: 188,
  19: 188,
  20: 188,
  21: 189,
  22: 190,
  23: 192,
  24: 193,
  25: 194,
  26: 196,
  27: 199,
  28: 200,
  29: 200,
  30: 202,
  31: 203,
  32: 203,
  33: 207,
  34: 207,
  35: 219,
  36: 221,
  37: 230,
  38: 242,
  39: 244,
  40: 246,
  41: 249,
  42: 252,
  43: 252,
  44: 252,
  45: 256,
  46: 259,
  47: 261,
  48: 262,
  49: 263,
  50: 265,
  51: 266,
  52: 269,
  53: 270,
  54: 273,
  55: 274,
  56: 282,
  57: 302,
  58: 304,
  59: 309,
  60: 312,
  61: 314,
  62: 322,
  63: 323,
  64: 326,
  65: 328,
  66: 329,
  67: 331,
  68: 334,
  69: 337,
  70: 341,
  71: 341,
  72: 342,
  73: 343,
  74: 346,
  75: 350,
  76: 354,
  77: 367,
  78: 372,
  79: 392,
  80: 393,
  81: 394,
  82: 397,
  83: 411,
  84: 415,
  85: 438,
  86: 458,
  87: 480,
  88: 519,
  89: 520,
  90: 522,
  91: 524,
  92: 1,
  93: 6,
  94: 12,
  95: 13,
  96: 23,
  97: 31,
  98: 32,
  99: 33,
  100: 40,
};
assert.deepEqual(Object.keys(bibliography).map(Number).sort((a,b) => a-b), [...Object.keys(expectedUrls).map(Number),12].sort((a,b) => a-b));
assert.equal(bibliography[11]?.readUrl, 'https://siyar.fr/livre/1/256', 'La fiche Athar 11 est le doublon de la notice Siyar 45');
assert.ok(bibliography[12]?.fascicle === 'sources externes', 'La fiche 12 utilise uniquement des sources externes, sans fausse correspondance Siyar');
let total=0, qualified=0;
for (const [id, source] of Object.entries(bibliography)) {
  const chapter = chapters.find(c => String(c.id) === id);
  assert.ok(chapter, 'Biographie inexistante : '+id);
  if (id === '12') {
    assert.equal(source.readUrl, 'https://dorar.net/history/event/54', 'Dossier historique de Nakhla manquant');
    assert.ok(source.translation.includes('Références arabes'), 'Fiche 12 mal attribuée aux fascicules');
  } else {
    assert.equal(source.readUrl, 'https://siyar.fr/livre/'+(Number(id)>=92 ? 2 : 1)+'/'+expectedUrls[id]);
    assert.equal(source.publisherUrl, 'https://islam-patrimoine.org/');
    assert.ok(source.translation.includes('Islam Patrimoine'));
  }
  assert.ok(source.reviewScope.includes('ne certifie'));
  assert.ok(source.entries.length > 0);
  const keys=new Set();
  for(const entry of source.entries) {
    const key=entry.kind+':'+entry.id;
    assert.ok(!keys.has(key), 'Doublon documentaire : '+id+'/'+key);
    keys.add(key);
    if(entry.pdfPage == null) {
      assert.equal(entry.printedPage,null,'Repère externe avec page imprimée inventée : '+id+'/'+key);
      assert.ok(/^https:\/\/(?:sunnah\.com|dorar\.net|hadithportal\.com|quran\.com|siyar\.fr|(?:www\.|g1\.|gcp\.)?islamweb\.(?:net|com))\//.test(entry.externalUrl || ''),'Référence externe indispensable sans page PDF : '+id+'/'+key);
    } else {
      assert.equal(entry.pdfPage,entry.printedPage+1);
      assert.ok(entry.printedPage > 0 && Number.isInteger(entry.printedPage));
    }
    assert.ok(entry.note.length > 28);
    assert.ok(['located','variant','weak','qualification'].includes(entry.status));
    if(entry.kind==='narrative') {
      assert.ok(chapter.narratives.some(n=>n.id===entry.id), 'Récit introuvable : '+id+'/'+key);
    } else if(entry.kind === 'hadith') {
      assert.ok(Number.isInteger(entry.id) && chapter.hadiths?.[entry.id], 'Hadith introuvable '+id+'/'+key);
      assert.ok(entry.hadithRef && entry.isnad && entry.grade, 'Chaîne ou degré non indiqué '+id+'/'+key);
      assert.ok(['sahih','hasan','weak_chain','ungraded','disputed','attribution_discontinue'].includes(entry.grade),'Degré inconnu : '+entry.grade);
    } else if(entry.kind === 'verse') {
      assert.ok(entry.externalUrl && /quran\.com/.test(entry.externalUrl), 'Verset sans source coranique : '+id+'/'+key);
    } else if(entry.kind === 'quote') {
      assert.equal(entry.id,0,'Citation principale introuvable : '+id+'/'+key);
      assert.ok(chapter.heroQuote && entry.grade,'Citation sans jugement : '+id+'/'+key);
    } else if(entry.kind === 'identity') {
      assert.ok(entry.id===0 || entry.id===1,'Index identité incorrect '+id+'/'+entry.id);
    } else {
      assert.equal(entry.kind,'timeline');
      assert.ok(chapter.timeline[entry.id], 'Événement introuvable : '+id+'/'+key);
    }
    if(entry.status!=='located')qualified++;
    total++;
  }
}
assert.equal(total,342,'278 anciens repères + 64 nouveaux repères du lot 21-30');
for(let id=1;id<=5;id++) {
  const c=chapters.find(x=>x.id===id), entries=bibliography[id].entries;
  assert.equal(entries.filter(e=>e.kind==='hadith').length,c.hadiths.length,'Chaque hadith doit être qualifié : '+id);
  assert.equal(entries.filter(e=>e.kind==='narrative').length,c.narratives.length,'Chaque récit doit être repéré : '+id);
  assert.equal(entries.filter(e=>e.kind==='quote').length,1,'Citation principale sans source : '+id);
}
assert.equal(Object.keys(bibliography).length,100,'99 notices Siyar et un dossier externe sans correspondance fabriquée pour la fiche 12');
for(let n=16;n<=100;n++) assert.ok(bibliography[n].entries.some(e=>e.kind==='identity'&&e.id===0),'Notice sans index : '+n);
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
assert.ok(index.includes('biography_sources_data.js?v=athar-siyar-isnad-16-20-1'),'Registre non chargé');
assert.ok(worker.includes('biography_sources_data.js?v=athar-siyar-isnad-16-20-1'),'Registre non précaché');
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
const c=id=>chapters.find(x=>x.id===id);
assert.ok(/quatre-vingt-dix-neuf/.test(c(26).intro));
assert.ok(/15 ou 20 H/.test(c(27).timeline[3].year), 'Nawfal : conserver 15/20 H, pas 20/25 H');
assert.ok(/C’est alors ‘Aqil/.test(c(35).narratives.find(x=>x.id===353).content));
assert.ok(/Yarmouk/.test(c(49).narratives.find(x=>x.id===492).content));
assert.ok(/récits historiques/.test(c(51).intro));
assert.ok(/ne certifie/.test(bibliography[55].reviewScope));
assert.ok(/14 ou 16 H/.test(c(55).timeline[4].year));
assert.ok(/discontinue/.test(c(56).narratives.find(x=>x.id===564).content));
assert.ok(/12 H/.test(c(60).timeline[1].year));
assert.ok(/Thabit ibn Zayd/.test(c(72).intro));
assert.ok(!/verified: true/.test(read('biographies_data.js')));
assert.ok(reader.includes("entry.kind === 'identity'"));
assert.ok(library.includes('hasSourceReference'));
// Le dernier fascicule couvre deux tomes. Ne jamais renvoyer le n°92 au tome 1.
assert.ok(bibliography[91].readUrl.endsWith('/1/524'));
assert.ok(bibliography[92].readUrl.endsWith('/2/1'));
assert.ok(bibliography[100].readUrl.endsWith('/2/40'));
assert.ok(/Médine/.test(evt(77,3)) && /combat/.test(evt(77,3)));
assert.ok(!/seul cavalier/.test(chapters.find(c=>c.id===81).intro));
assert.ok(/huile de ricin/.test(story(81,813).content));
assert.ok(/moursal/.test(bibliography[82].entries.find(x=>x.kind==='timeline'&&x.id===1).note));
assert.ok(/général adverse/.test(evt(83,2)));
assert.ok(/tradition/.test(story(85,852).content));
assert.ok(/33 ou 36 H/.test(evt(91,5)));
assert.ok(/quarante années/.test(evt(96,2)) && /conteste/.test(evt(96,2)));
assert.ok(bibliography[12].entries.every(entry => entry.pdfPage === null), 'La fiche 12 ne doit pas emprunter de pagination à une autre personne');
for(const id of [101,102,103,106]) assert.ok(!bibliography[id], 'Une fiche hors Siyar 1–100 a été déclarée vérifiée : '+id);
assert.ok(reader.includes("sourceEvidence(h.type === 'verse' ? 'verse' : 'hadith', index)"),'Les avis des hadiths ne sont pas visibles');
assert.ok(reader.includes("sourceEvidence('quote', 0)"),'Les réserves des citations principales ne sont pas visibles');
assert.ok(reader.includes("entry.pdfPage != null"),'La source externe sans PDF doit être affichée sans inventer une page');
assert.equal(bibliography[2].entries.find(e=>e.kind==='quote').status,'weak','Le martyr marchant ne doit pas être classé authentique');
assert.equal(bibliography[4].entries.find(e=>e.kind==='hadith'&&e.id===1).status,'weak','La chaîne d’Abou Moualla doit rester faible');
assert.equal(bibliography[5].entries.find(e=>e.kind==='hadith'&&e.id===1).grade,'disputed','Le Tirmidhi 3752 est controversé');
assert.ok(/chaîne interrompue/.test(chapters.find(c=>c.id===1).hadiths[1].source));
assert.ok(/15/.test(chapters.find(c=>c.id===1).narratives.find(n=>n.id===106).content) || /quinze/.test(chapters.find(c=>c.id===1).narratives.find(n=>n.id===106).content));
for (const id of [6,7,8,9,10]) {
  const chapter = chapters.find(item => item.id === id);
  assert.ok(chapter?.quizData?.length >= 5, 'Quiz insuffisamment développé pour la notice ' + id);
  chapter.quizData.forEach((q, i) => assert.ok(Array.isArray(q.opts) && Number.isInteger(q.c) && q.c >= 0 && q.c < q.opts.length, 'Question invalide : ' + id + '/' + i));
  assert.ok(bibliography[id].entries.some(entry => entry.kind === 'quote' && entry.id === 0 && entry.grade), 'Citation principale sans référence : ' + id);
  (chapter.hadiths || []).forEach((h, i) => {
    const kind = h.type === 'verse' ? 'verse' : 'hadith';
    assert.ok(bibliography[id].entries.some(entry => entry.kind === kind && entry.id === i), 'Citation/verset sans repère : ' + id + '/' + i);
  });
}
// Auditer les notices 11 à 15 sans leur attribuer un degré de hadith par déduction.
for (const id of [11,12,13,14,15]) {
  const chapter = chapters.find(item => item.id === id);
  const entries = bibliography[id].entries;
  assert.ok(chapter?.quizData?.length >= 5, 'Le quiz doit couvrir cinq questions : '+id);
  chapter.quizData.forEach((q,i) => assert.ok(Array.isArray(q.opts) && Number.isInteger(q.c) && q.c>=0 && q.c<q.opts.length && q.exp?.length > 30, 'Question invalide : '+id+'/'+i));
  assert.equal(entries.filter(entry => entry.kind === 'quote').length,1,'Citation principale sans source : '+id);
  for (const [i,h] of (chapter.hadiths || []).entries()) {
    const entry=entries.find(item => item.kind==='hadith' && item.id===i);
    assert.ok(entry?.hadithRef && entry?.isnad && entry?.grade, 'Hadith sans source et classement attribué : '+id+'/'+i);
  }
  for (const [i,event] of (chapter.timeline || []).entries()) {
    assert.ok(entries.some(e => e.kind === 'timeline' && e.id === i), 'Repère chronologique sans source ou réserve : '+id+'/'+i);
  }
  for (const story of chapter.narratives || []) {
    assert.ok(entries.some(e => e.kind === 'narrative' && e.id === story.id), 'Récit sans repère : '+id+'/'+story.id);
  }
}
assert.ok(bibliography[11].entries.some(e => e.kind === 'identity' && /45/.test(e.note)), 'Doublon 11/45 non documenté');
assert.ok(!/fascicule 07.14/.test(bibliography[12].editionNote || '') || /ne correspond pas/.test(bibliography[12].editionNote),'Fausse correspondance de la fiche 12');
assert.ok(/faible/.test(bibliography[15].entries.find(e=>e.kind==='hadith'&&e.id===0).note),'Divergence du maître des martyrs perdue');
// Vague 4 : les récits historiques ne sont pas faussement promus en hadiths sahîh.
for (const id of [16,17,18,19,20]) {
  const chapter = chapters.find(item => item.id === id);
  const entries = bibliography[id].entries;
  assert.ok(chapter?.quizData?.length >= 5, 'Le quiz doit proposer au moins cinq questions : '+id);
  chapter.quizData.forEach((q, i) => assert.ok(Array.isArray(q.opts) && Number.isInteger(q.c) && q.c >= 0 && q.c < q.opts.length && q.exp?.length > 30, 'Question invalide : '+id+'/'+i));
  assert.equal(entries.filter(e => e.kind === 'quote').length,1,'Citation principale sans source : '+id);
  assert.ok(entries.find(e => e.kind === 'quote' && e.id === 0)?.grade, 'Citation principale sans précision : '+id);
  for (const [i, h] of (chapter.hadiths || []).entries()) {
    const source = entries.find(e => e.kind === 'hadith' && e.id === i);
    assert.ok(source?.externalUrl && source?.hadithRef && source?.isnad && source?.grade, 'Tradition rapportée sans source : '+id+'/'+i);
    assert.equal(source.category, h.type === 'prophetic' ? 'prophetic' : h.type, 'Type documentaire incohérent : '+id+'/'+i);
    if (id !== 20 || i === 1) assert.equal(source.grade,'ungraded','Aucun degré ne doit être inventé : '+id+'/'+i);
  }
  for (const [i, event] of (chapter.timeline || []).entries()) {
    assert.ok(entries.some(e => e.kind === 'timeline' && e.id === i && e.externalUrl), 'Chronologie sans source : '+id+'/'+i);
  }
  for (const story of chapter.narratives || []) {
    assert.ok(entries.some(e => e.kind === 'narrative' && e.id === story.id && e.externalUrl), 'Récit sans source : '+id+'/'+story.id);
  }
}
assert.ok(chapters.find(c=>c.id===19).timeline[1].year.includes('11 ou 12 H'),'La datation divergente d’Al-Yamâma doit être visible');
assert.ok(/Datation discutée/.test(chapters.find(c=>c.id===20).timeline[1].year),'La datation de l’Ifk ne doit pas être imposée');
assert.ok(/Décès \(date discutée\)/.test(chapters.find(c=>c.id===20).timeline[2].year),'Décès de Mistah : ne pas imposer une date');
assert.ok(bibliography[20].entries.find(e=>e.kind==='hadith'&&e.id===1).category==='commentary','Le commentaire de Dhahabî n’est pas un hadith');
assert.ok(bibliography[20].entries.find(e=>e.kind==='hadith'&&e.id===0).hadithRef.includes('3007'),'Référence du hadith de Badr manquante');
assert.ok(reader.includes("h.type === 'historical' ? 'Récit biographique rapporté'"),'Étiquette historique absente dans la lecture');
assert.ok(reader.includes("entry.category === 'commentary'"),'Type de commentaire savant invisible dans les sources');

// Vague 5 : contrôle de la traçabilité intégrale des dix nouvelles notices.
for (const id of Array.from({length:10},(_,i)=>i+21)) {
  const ch = chapters.find(c=>c.id===id), entries = bibliography[id].entries;
  assert.ok(ch,'Notice absente '+id);
  assert.equal(ch.quizData.length,5,'Cinq questions documentaires exigées par notice '+id);
  ch.quizData.forEach((q,i)=>assert.ok(q.ref?.startsWith('https://')&&q.exp?.length>35&&Number.isInteger(q.c)&&q.c>=0&&q.c<q.opts.length,'Question incorrecte '+id+'/'+i));
  assert.equal(entries.filter(e=>e.kind==='quote').length,1,'Citation principale non attribuée '+id);
  assert.ok(entries.some(e=>e.kind==='quote'&&e.grade),'Degré ou absence de degré non signalé '+id);
  for(const [i,e] of ch.timeline.entries()) assert.ok(entries.some(x=>x.kind==='timeline'&&x.id===i&&x.externalUrl), 'Date sans source '+id+'/'+i);
  for(const e of ch.narratives) assert.ok(entries.some(x=>x.kind==='narrative'&&x.id===e.id&&x.externalUrl),'Récit sans attribution '+id+'/'+e.id);
  for(const [i,e] of ch.hadiths.entries()) {
    const x=entries.find(x=>x.kind==='hadith'&&x.id===i);
    assert.ok(x?.hadithRef&&x?.externalUrl&&x?.grade&&x?.isnad,'Transmission sans référence '+id+'/'+i);
    assert.equal(x.category,e.type,'Nature de la transmission incorrecte '+id+'/'+i);
    if ([21,22,27,28,29,30].includes(id)) assert.equal(x.grade,'ungraded','Degré inventé pour récit historique '+id);
  }
}
assert.ok(chapters.find(c=>c.id===26).intro.includes('quatre-vingt-dix-neuf'),'Quatre-vingt-dix-neuf, et non cent');
assert.ok(chapters.find(c=>c.id===24).narratives.find(e=>e.id===241).content.includes('chronologique'),'Anachronisme Souhayl non expliqué');
assert.ok(chapters.find(c=>c.id===29).tags.includes("Tabi'i")&&chapters.find(c=>c.id===30).tags.includes("Tabi'i"),'Génération des transmetteurs non corrigée');
assert.ok(/83 ou 84 H/.test(chapters.find(c=>c.id===29).timeline[2].year),'Décès de Babbâ : variantes 83/84 H');
assert.ok(/15 ou 20 H/.test(chapters.find(c=>c.id===27).timeline[3].year),'Décès de Nawfal : variante 15/20 H');
assert.ok(/hasan gharîb/.test(bibliography[26].entries.find(e=>e.kind==='hadith').hadithRef),'Jugement At-Tirmidhî 3854 absent');
assert.ok(/2522/.test(bibliography[24].entries.find(e=>e.kind==='hadith').hadithRef),'Abou Dâwoud 2522 absent');

console.log('Siyar : 99 notices Siyar et une notice externe sur 104, 342 repères, 11 hadiths + 5 citations principales + 24 récits des notices 1–5 qualifiés, aucun PDF.');
