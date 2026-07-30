const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const files = [
    'scholar_atlas_core.js',
    'scholar_atlas_traditions.js',
    'scholar_atlas_thought.js'
];

const context = vm.createContext({ window: {}, console });
for (const file of files) {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    vm.runInContext(source, context, { filename: file });
}

const data = context.window.SCHOLAR_ATLAS_DATA;
const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };

assert(data && typeof data === 'object', 'SCHOLAR_ATLAS_DATA est introuvable.');
if (data) {
    assert(Array.isArray(data.cities), 'cities doit être un tableau.');
    assert(Array.isArray(data.scholars), 'scholars doit être un tableau.');
    assert(Array.isArray(data.journeys), 'journeys doit être un tableau.');
    assert(data.cities.length >= 40, `Nombre de villes insuffisant : ${data.cities.length}.`);
    assert(data.scholars.length >= 60, `Nombre de savants insuffisant : ${data.scholars.length}.`);
    assert(data.journeys.length >= 6, `Nombre de parcours insuffisant : ${data.journeys.length}.`);

    const cityIds = new Set();
    for (const city of data.cities) {
        assert(city.id && typeof city.id === 'string', 'Une ville ne possède pas d’identifiant valide.');
        assert(!cityIds.has(city.id), `Identifiant de ville dupliqué : ${city.id}.`);
        cityIds.add(city.id);
        assert(city.name && city.region && city.summary, `Ville incomplète : ${city.id}.`);
        assert(Array.isArray(city.coords) && city.coords.length === 2, `Coordonnées invalides : ${city.id}.`);
        if (Array.isArray(city.coords)) {
            const [lat, lon] = city.coords;
            assert(Number.isFinite(lat) && lat >= -90 && lat <= 90, `Latitude invalide : ${city.id}.`);
            assert(Number.isFinite(lon) && lon >= -180 && lon <= 180, `Longitude invalide : ${city.id}.`);
        }
    }

    const scholarIds = new Set();
    for (const scholar of data.scholars) {
        assert(scholar.id && typeof scholar.id === 'string', 'Un savant ne possède pas d’identifiant valide.');
        assert(!scholarIds.has(scholar.id), `Identifiant de savant dupliqué : ${scholar.id}.`);
        scholarIds.add(scholar.id);
        assert(scholar.name && scholar.arabic && scholar.title, `Fiche incomplète : ${scholar.id}.`);
        assert(Number.isFinite(scholar.born) && Number.isFinite(scholar.died), `Dates invalides : ${scholar.id}.`);
        assert(scholar.died >= scholar.born, `Chronologie impossible : ${scholar.id}.`);
        assert(cityIds.has(scholar.city), `Ville principale inconnue pour ${scholar.id} : ${scholar.city}.`);
        assert(Array.isArray(scholar.routes) && scholar.routes.length > 0, `Itinéraire vide : ${scholar.id}.`);
        for (const cityId of scholar.routes || []) {
            assert(cityIds.has(cityId), `Étape inconnue pour ${scholar.id} : ${cityId}.`);
        }
        assert(Array.isArray(scholar.disciplines) && scholar.disciplines.length > 0, `Discipline manquante : ${scholar.id}.`);
        assert(scholar.knownFor && scholar.bio && scholar.legacy, `Contenu éditorial incomplet : ${scholar.id}.`);
        assert(Array.isArray(scholar.sources) && scholar.sources.length > 0, `Source indicative manquante : ${scholar.id}.`);
    }

    const journeyIds = new Set();
    for (const journey of data.journeys) {
        assert(journey.id && !journeyIds.has(journey.id), `Identifiant de parcours invalide ou dupliqué : ${journey.id}.`);
        journeyIds.add(journey.id);
        assert(journey.title && journey.description && journey.icon && journey.accent, `Parcours incomplet : ${journey.id}.`);
        assert(Array.isArray(journey.scholarIds) && journey.scholarIds.length >= 4, `Parcours trop court : ${journey.id}.`);
        for (const scholarId of journey.scholarIds || []) {
            assert(scholarIds.has(scholarId), `Savant inconnu dans ${journey.id} : ${scholarId}.`);
        }
    }
}

if (errors.length) {
    console.error(`Validation Atlas Savants échouée avec ${errors.length} erreur(s) :`);
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
}

console.log(`Atlas Savants valide : ${data.scholars.length} savants, ${data.cities.length} villes, ${data.journeys.length} parcours.`);
