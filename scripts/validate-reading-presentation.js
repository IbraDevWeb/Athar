#!/usr/bin/env node
// Non-régression : la lecture des 40 premières notices ne doit pas effacer l'appareil critique.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const read = name => fs.readFileSync(path.join(__dirname, '..', name), 'utf8');
const chapters = vm.runInNewContext(read('biographies_data.js') + '\nCHAPTERS_DATA');
const sources = vm.runInNewContext(read('biography_sources_data.js') + '\nBIOGRAPHY_SOURCES');
const reading = vm.runInNewContext(read('js/biography-reading-presentation.js') + '\nATHAR_READING_PRESENTATION');
const reader = read('js/components/ReaderView.js');
const timeline = read('js/components/TimelineView.js');
const index = read('index.html');
const worker = read('service-worker.js');

assert.deepEqual(Array.from(reading.scope), Array.from({ length: 40 }, (_, i) => i + 1));
let events = 0, citations = 0, editedEvents = 0, editedQuotes = 0, editedCitations = 0;
for (let id = 1; id <= 40; id++) {
    const chapter = chapters.find(item => item.id === id);
    const bibliography = sources[String(id)];
    assert.ok(chapter && bibliography, 'Notice ou références absentes : ' + id);
    assert.ok(bibliography.entries.some(ref => ref.kind === 'quote'), 'Citation principale sans dossier : ' + id);
    const fullOriginal = JSON.stringify(chapter);
    const quote = reading.quote(chapter);
    assert.ok(quote, 'Citation principale vide : ' + id);
    if (quote !== chapter.heroQuote) {
        editedQuotes++;
        assert.ok(/\.quote|quote:/.test(read('js/biography-reading-presentation.js')));
    }
    (chapter.timeline || []).forEach((event, i) => {
        const view = reading.timeline(chapter, event, i);
        events++;
        assert.equal(view.year, event.year, 'L’année documentaire ne doit pas être réécrite : ' + id + '/' + i);
        assert.equal(view.desc, event.desc, 'Le récit documentaire ne doit pas être remplacé : ' + id + '/' + i);
        assert.ok(view.readingYear && view.readingDesc);
        if (view.readingYear !== event.year || view.readingDesc !== event.desc) {
            editedEvents++;
            assert.ok(view.readingContext.includes(event.desc), 'Variantes perdues : ' + id + '/' + i);
            assert.ok(view.readingContext.includes(event.year), 'Date originale perdue : ' + id + '/' + i);
        }
    });
    (chapter.hadiths || []).forEach((item, i) => {
        const view = reading.citation(chapter, item, i);
        citations++;
        assert.equal(view.text, item.text);
        assert.equal(view.source, item.source);
        assert.ok(view.readingText, 'Citation vide : ' + id + '/' + i);
        if (view.readingText !== item.text || view.readingNarrator !== item.narrator) {
            editedCitations++;
            assert.equal(view.readingContext, item.text, 'Formulation originale perdue : ' + id + '/' + i);
        }
    });
    assert.equal(JSON.stringify(chapter), fullOriginal, 'La couche de lecture modifie la source : ' + id);
}
assert.equal(events, 137, 'Nombre d’événements inattendu pour les 40 notices');
assert.equal(citations, 62, 'Nombre de citations inattendu pour les 40 notices');
assert.ok(editedEvents >= 20 && editedQuotes >= 5 && editedCitations >= 3, 'Épurations insuffisantes');
for (const text of [
    "sourceEvidence('timeline', i)", "sourceEvidence('quote', 0)",
    "sourceEvidence(h.type === 'verse' ? 'verse' : 'hadith', index)",
    "evt.readingContext", "h.readingContext", 'h.source', 'Sources, variantes et fiabilité'
]) assert.ok(reader.includes(text), 'Information documentaire non accessible : ' + text);
assert.ok(reader.includes('<details v-if="evt.readingContext') && reader.includes('<details v-if="h.source'));
assert.ok(timeline.includes('ATHAR_READING_PRESENTATION.timeline'));
assert.ok(timeline.includes('selectedEvent.evidence?.externalUrl'));
assert.ok(timeline.includes('timeline-pro-reading-method'));
assert.ok(!timeline.includes('<small>{{ event.dateBadge }}</small>'), 'La fiabilité encombre la frise');
assert.ok(index.indexOf('js/biography-reading-presentation.js') < index.indexOf('js/components/TimelineView.js'));
assert.ok(index.indexOf('js/biography-reading-presentation.js') < index.indexOf('js/components/ReaderView.js'));
assert.ok(worker.includes('js/biography-reading-presentation.js'));
console.log('Lecture 1–40 : ' + events + ' événements, ' + citations + ' citations, ' + editedEvents + ' événements reformulés, ' + editedQuotes + ' citations mises en avant épurées, ' + editedCitations + ' citations adaptées. Sources et variantes conservées.');
