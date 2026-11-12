#!/usr/bin/env node
// Contrôle du squelette Kutub as-Sitta : aucun hadith fictif ni disparition du corpus actuel.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const read = path => fs.readFileSync(path, 'utf8');

const registrySource = read('js/kutub-sitta-registry.js');
new vm.Script(registrySource);
const registry = vm.runInNewContext(registrySource + '\nATHAR_KUTUB_SITTA');
const expected = ['bukhari','muslim','abu-dawud','tirmidhi','nasai','ibn-majah'];
assert.equal(registry.version, 1, 'Version du registre inconnue');
assert.deepEqual(Array.from(registry.collections, item => item.id), expected, 'Les six recueils et leur ordre sont incorrects');
assert.equal(new Set(registry.collections.map(book => book.id)).size, 6, 'Identifiants dupliqués');
for (const book of registry.collections) {
    assert.ok(book.name && book.arabicName && book.compiler && book.type && book.description, 'Métadonnées manquantes : ' + book.id);
    assert.equal(book.dataPath, 'data/kutub-sitta/' + book.id + '.json', 'Chemin de recueil inattendu');
    const payload = JSON.parse(read(book.dataPath));
    assert.equal(payload.schemaVersion, 1, 'Schéma invalide : ' + book.id);
    assert.equal(payload.collectionId, book.id, 'Un livre charge le mauvais jeu de données : ' + book.id);
    assert.deepEqual(payload.sourceRecords, [], 'Provenance fictive : ' + book.id);
    assert.deepEqual(payload.chapters, [], 'Chapitres non encore vérifiés : ' + book.id);
    assert.deepEqual(payload.hadiths, [], 'Hadiths non encore vérifiés : ' + book.id);
}

const existing = vm.runInNewContext(read('hadiths_data.js') + '\nSTORED_HADITHS');
assert.equal(existing.length, 50, 'Le corpus des 50 hadiths existants a changé');

const view = read('js/components/HadithsView.js');
const reader = read('js/components/HadithReaderView.js');
new vm.Script(view);
new vm.Script(reader);
for (const marker of [
    "section = Vue.ref('library')", "section==='kutub'", 'ATHAR_KUTUB_SITTA.collections',
    'selectedBookId', 'openBook = async book', 'closeBook = ()', 'fetch(book.dataPath)',
    'bookPayload', 'bookError', 'hadith-kutub-book', 'hadith-kutub-empty', 'bookChapters',
    'bookHadiths', 'props.openHadith(hadith)', "section==='library'", 'hadith-pro-search-area'
]) assert.ok(view.includes(marker), 'Comportement de la rubrique absent : ' + marker);
assert.ok(reader.includes('hadith.source_url') && reader.includes('noopener noreferrer'), 'Source externe future non disponible');

const html = read('index.html'), worker = read('service-worker.js');
const registryPos = html.indexOf('js/kutub-sitta-registry.js');
const viewPos = html.indexOf('js/components/HadithsView.js');
assert.ok(registryPos >= 0 && viewPos > registryPos, 'Le registre doit précéder le catalogue');
assert.ok(html.includes('hadiths_data.js'), 'Corpus actuel non chargé');
const match = worker.match(/const APP_SHELL\s*=\s*(\[[\s\S]*?\]);/);
assert.ok(match, 'Précache PWA introuvable');
const assets = vm.runInNewContext(match[1]);
assert.ok(assets.some(path => path.includes('js/kutub-sitta-registry.js')), 'Registre absent du précache');
for (const book of registry.collections) {
    assert.ok(assets.some(path => path.includes(book.dataPath)), 'Recueil vide absent du précache : ' + book.id);
}
assert.ok(assets.length < 60, 'Précache PWA trop volumineux en fichiers');
console.log('Kutub as-Sitta : six sections vides, 50 hadiths existants préservés, chemins et cache validés.');
