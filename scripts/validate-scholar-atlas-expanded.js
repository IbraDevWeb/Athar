const fs = require('node:fs');
const vm = require('node:vm');

const files = [
    'scholar_atlas_core.js',
    'scholar_atlas_traditions.js',
    'scholar_atlas_thought.js',
    'scholar_atlas_cities_expansion.js',
    'scholar_atlas_women_1.js',
    'scholar_atlas_women_2.js',
    'scholar_atlas_women_3.js',
    'scholar_atlas_women_4.js',
    'scholar_atlas_men_law.js',
    'scholar_atlas_men_hadith_tafsir.js',
    'scholar_atlas_men_qiraat_language.js',
    'scholar_atlas_men_science_history.js',
    'scholar_atlas_enrichment.js'
];

const context = vm.createContext({ window: {}, console });
for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    vm.runInContext(source, context, { filename: file });
}

const data = context.window.SCHOLAR_ATLAS_DATA;
if (!data) throw new Error('SCHOLAR_ATLAS_DATA introuvable.');
const scholars = data.scholars;
const cities = data.cities;
const journeys = data.journeys;

if (scholars.length < 135) throw new Error(`Atlas trop limité : ${scholars.length} profils, 135 minimum.`);
if (scholars.filter((item) => item.gender === 'F').length < 35) throw new Error('La représentation des savantes est insuffisante.');
if (cities.length < 55) throw new Error(`Nombre de foyers insuffisant : ${cities.length}.`);
if (journeys.length < 11) throw new Error(`Nombre de parcours insuffisant : ${journeys.length}.`);

const cityIds = new Set(cities.map((city) => city.id));
if (cityIds.size !== cities.length) throw new Error('Identifiants de villes dupliqués.');
const scholarIds = new Set(scholars.map((scholar) => scholar.id));
if (scholarIds.size !== scholars.length) throw new Error('Identifiants de savants dupliqués.');

for (const city of cities) {
    if (!city.id || !city.name || !Array.isArray(city.coords) || city.coords.length !== 2) throw new Error(`Ville invalide : ${city.id || city.name}`);
    if (!city.coords.every(Number.isFinite)) throw new Error(`Coordonnées invalides pour ${city.id}.`);
    if (city.coords[0] < -90 || city.coords[0] > 90 || city.coords[1] < -180 || city.coords[1] > 180) throw new Error(`Coordonnées hors limites pour ${city.id}.`);
}

for (const scholar of scholars) {
    if (!scholar.id || !scholar.name || !scholar.arabic) throw new Error(`Profil incomplet : ${scholar.id || scholar.name}`);
    if (!Number.isFinite(scholar.born) || !Number.isFinite(scholar.died) || scholar.died <= scholar.born) throw new Error(`Dates invalides pour ${scholar.id}.`);
    if (!cityIds.has(scholar.city)) throw new Error(`Foyer inconnu pour ${scholar.id}: ${scholar.city}`);
    if (!Array.isArray(scholar.routes) || scholar.routes.some((id) => !cityIds.has(id))) throw new Error(`Itinéraire invalide pour ${scholar.id}.`);
    if (!Array.isArray(scholar.disciplines) || !scholar.disciplines.length) throw new Error(`Disciplines absentes pour ${scholar.id}.`);
    if (String(scholar.bio || '').length < 70) throw new Error(`Biographie trop courte pour ${scholar.id}.`);
    if (String(scholar.legacy || '').length < 55) throw new Error(`Héritage trop court pour ${scholar.id}.`);
    if (!Array.isArray(scholar.sources) || scholar.sources.length < 2) throw new Error(`Sources insuffisantes pour ${scholar.id}.`);
    for (const field of ['formation', 'method', 'context', 'debates']) {
        if (String(scholar[field] || '').length < 90) throw new Error(`${field} insuffisant pour ${scholar.id}.`);
    }
    for (const field of ['teachers', 'students', 'institutions', 'keyTerms', 'milestones', 'studyQuestions', 'workNotes']) {
        if (!Array.isArray(scholar[field])) throw new Error(`${field} doit être un tableau pour ${scholar.id}.`);
    }
    if (scholar.milestones.length < 3 || scholar.studyQuestions.length < 3) throw new Error(`Parcours pédagogique incomplet pour ${scholar.id}.`);
}

const journeyIds = new Set();
for (const journey of journeys) {
    if (!journey.id || journeyIds.has(journey.id)) throw new Error(`Parcours dupliqué ou invalide : ${journey.id}`);
    journeyIds.add(journey.id);
    if (!Array.isArray(journey.scholarIds) || journey.scholarIds.length < 3) throw new Error(`Parcours trop court : ${journey.id}`);
    if (journey.scholarIds.some((id) => !scholarIds.has(id))) throw new Error(`Profil inconnu dans le parcours ${journey.id}.`);
}

console.log(`Atlas Savants validé : ${scholars.length} profils (${scholars.filter((item) => item.gender === 'F').length} femmes), ${cities.length} foyers et ${journeys.length} parcours.`);
