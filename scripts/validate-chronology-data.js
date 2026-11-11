#!/usr/bin/env node
// Tests de non-régression : jamais d'année déduite d'un âge, d'un lieu ou d'un mot-clé vague.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const read = path => fs.readFileSync(path, 'utf8');
const chapters = vm.runInNewContext(read('biographies_data.js') + '\nCHAPTERS_DATA');
const chronology = vm.runInNewContext(read('js/timeline-chronology.js') + '\nATHAR_CHRONOLOGY');
const timeline = read('js/components/TimelineView.js');
const index = read('index.html');
const worker = read('service-worker.js');

const get = (label, desc = 'Récit rapporté') => chronology.resolve({year:label,desc}, 999, 0);
for (const label of ['Enfance','Jeunesse','Naissance','Conversion','Débuts','Mecque','Médine','Hégire','Vie du Prophète','Surnoms','Mission','Qouba','70 ans','46 ans après','Après 11 H','Avant 8 H']) {
  assert.equal(get(label).periodId, 'undated', label + ' ne doit pas induire une date ou une période non explicitement justifiée');
  assert.equal(get(label).year, null, label + ' : année inventée');
}
assert.equal(get('Avant l’Hégire').periodId, 'origins');
assert.equal(get('Avant l’Hégire').year, null);
assert.equal(get('Aqaba II').periodId, 'origins');
assert.equal(get('Abyssinie').periodId, 'origins');
assert.equal(get('Califat d’Omar').periodId, 'rashidun');
assert.equal(get('Califat d’Omar').year, null);
assert.equal(get('Badr').year, 2);
assert.equal(get('2 H').year, 2);
assert.equal(get('3 H').periodId, 'prophetic');
assert.equal(get('51 H (52 H aussi rapporté)').precision, 'variant');
assert.equal(get('3 ou 4 H selon les récits').precision, 'variant');
assert.equal(get('3 ou 4 H selon les récits').periodId, 'prophetic');
assert.equal(get('11 H (12 H également rapporté)').periodId, 'undated');
assert.equal(get('11 H (12 H également rapporté)').year, null);
assert.equal(get('17-18 H').precision, 'variant');
assert.equal(get('22 H (ou 30 H)').precision, 'variant');
assert.equal(get('20 ou 25 H').precision, 'variant');
assert.equal(get('13/15 H').precision, 'variant');
assert.equal(get('20 H').year, 20);
const oumama = chapters.find(chapter => chapter.id === 71);
assert.ok(oumama?.timeline?.length, 'Notice d’Oumâma absente');
const first = chronology.resolve(oumama.timeline[0], 71, 0);
assert.equal(first.year, null, 'Oumâma : 612 est une datation inventée');
assert.equal(first.periodId, 'undated', 'Oumâma ne doit pas être placée avant l’Hégire');
assert.equal(first.reference?.sourceUrl, 'https://sunnah.com/bukhari:516');
assert.ok(/aucune année/i.test(first.reference?.note || ''), 'Prudence chronologique d’Oumâma absente');

let total=0, reported=0, variants=0, periodOnly=0, undated=0;
for (const chapter of chapters) {
  (chapter.timeline || []).forEach((event,index) => {
    if (!event?.desc) return;
    total++;
    const point = chronology.resolve(event, chapter.id, index);
    assert.ok(['origins','prophetic','rashidun','umayyad','abbasid','postclassical','undated'].includes(point.periodId), 'Période invalide');
    assert.ok(point.detail && point.dateBadge, 'Datation sans statut : '+chapter.id+'/'+index);
    if (point.year !== null) {
      const hasYear = /^\s*\d{1,3}\s*(?:H\b|(?:ou|\/|[-–])\s*\d{1,3}\s*H\b)/i.test(event.year);
      assert.ok(hasYear || event.year.trim().toLowerCase() === 'badr', 'Année déduite sans support : '+chapter.id+'/'+index);
    }
    if (point.periodId === 'undated') assert.equal(point.year,null);
    if (point.precision === 'reported') reported++;
    if (point.precision === 'variant') variants++;
    if (point.precision === 'period') periodOnly++;
    if (point.precision === 'undated') undated++;
  });
}
assert.ok(total >= 300, 'Des événements auraient été perdus');
assert.ok(undated > 0 && reported > 0, 'Le tri doit conserver les repères datés et non datés');
assert.ok(timeline.includes('ATHAR_CHRONOLOGY.resolve'), 'Le composant n’utilise pas le moteur prudent');
assert.ok(!/\binferYear\b|\bchapterAnchors\b|gregorianApprox/.test(timeline), 'Inférence historique automatique non autorisée');
assert.ok(!/≈\s*612/.test(timeline), 'Année fictive présente dans la frise');
assert.ok(index.indexOf('js/timeline-chronology.js') > -1 && index.indexOf('js/timeline-chronology.js') < index.indexOf('js/components/TimelineView.js'), 'Moteur chronologique chargé dans le mauvais ordre');
assert.ok(worker.includes('js/timeline-chronology.js'), 'Moteur non précaché');
console.log('Frise auditable : '+total+' événements ; '+reported+' années déclarées ou repères nommés, '+variants+' datations multiples, '+periodOnly+' périodes seules, '+undated+' dates non renseignées.');
