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
    if (book.id === 'bukhari') {
        assert.equal(book.importedCount, 50, 'La carte al-Bukhârî doit annoncer 50 hadiths');
        assert.equal(payload.hadiths.length, 50, 'Les 50 premiers hadiths ne sont pas tous présents');
        assert.equal(payload.chapters.length, 2, 'Les deux livres historiques sont indispensables');
        assert.deepEqual(Array.from(payload.chapters, x => x.id), ['revelation','faith']);
        assert.equal(payload.sourceRecords.length, 3, 'Références de provenance incomplètes');
        assert.equal(payload.range.first, 1);
        assert.equal(payload.range.last, 50);
        assert.ok(payload.editorialStatus.includes('traduction'),'Prudence éditoriale absente');
        const nums = payload.hadiths.map(x => x.number);
        assert.deepEqual(nums, Array.from({length:50},(_,i)=>i+1),'Numéros 1–50 discontinus ou dans le désordre');
        for (const entry of payload.hadiths) {
            const n = entry.number, bookNumber = n<=7?1:2;
            assert.equal(entry.id, 'Sahih al-Bukhari '+n,'Identifiant invalide');
            assert.equal(entry.bookNumber, bookNumber,'Affectation au livre invalide : '+n);
            assert.equal(entry.inBookNumber, n<=7?n:n-7,'Numérotation interne invalide : '+n);
            assert.equal(entry.chapterId, n<=7?'revelation':'faith');
            assert.ok(entry.hadeeth_ar.length>100,'Texte arabe incomplet : '+n);
            assert.ok(entry.hadeeth.length>80,'Version française incomplète : '+n);
            assert.equal(entry.source_url,'https://sunnah.com/bukhari:'+n);
            assert.ok(entry.textSourceUrl.startsWith('https://github.com/fawazahmed0/hadith-api/'));
            assert.ok(entry.translationSourceUrl.startsWith('https://github.com/fawazahmed0/hadith-api/'));
            assert.ok(entry.translationNotice.includes('non identifiés') || entry.translationNotice.includes('non identifiés') ||
                entry.translationNotice.includes('non identifi'), 'Limite de traduction non signalée : '+n);
        }
    } else {
        assert.deepEqual(payload.sourceRecords, [], 'Provenance fictive : ' + book.id);
        assert.deepEqual(payload.chapters, [], 'Chapitres non encore vérifiés : ' + book.id);
        assert.deepEqual(payload.hadiths, [], 'Hadiths non encore vérifiés : ' + book.id);
    }
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
    'bookHadiths', 'props.openHadith(hadith)', "section==='library'", 'hadith-pro-search-area',
    'bookExcerpt', 'athar_kutub_return_book', 'hadith-kutub-list-excerpt'
]) assert.ok(view.includes(marker), 'Comportement de la rubrique absent : ' + marker);
assert.ok(reader.includes('hadith.source_url') && reader.includes('noopener noreferrer'), 'Source externe future non disponible');
assert.ok(reader.includes('translationNotice') && reader.includes('hadith.translationSourceUrl'),
 'La source de traduction doit être consultable, avec sa limite de provenance.');
const cssBukhari=read('css/bukhari-first-50.css');
assert.ok(cssBukhari.includes('.hadith-kutub-list-excerpt') && cssBukhari.includes('@media(max-width:690px)'),
 'La nouvelle liste de hadiths n’est pas responsive.');

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
console.log('Kutub as-Sitta : 50 premiers hadiths de Bukhârî importés, cinq recueils encore vides, 50 thématiques préservés.');
