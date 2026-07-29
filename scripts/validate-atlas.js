const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const dataPath = path.join(root, 'atlas_data.js');
const source = fs.readFileSync(dataPath, 'utf8');
const context = { console };
vm.createContext(context);
vm.runInContext(`${source}\n;globalThis.__atlasLocations = atlasLocations; globalThis.__hijraRoutePoints = hijraRoutePoints;`, context, { filename: dataPath });

const locations = context.__atlasLocations;
const hijraRoute = context.__hijraRoutePoints;
const errors = [];
const warnings = [];
const validTypes = new Set(['ville', 'bataille', 'monument']);

if (!Array.isArray(locations)) errors.push('atlasLocations doit être un tableau.');
if (!Array.isArray(hijraRoute)) errors.push('hijraRoutePoints doit être un tableau.');

const ids = new Set();
const normalizedNames = new Map();

for (const [index, location] of (locations || []).entries()) {
    const label = `Lieu #${location && location.id !== undefined ? location.id : index}`;
    if (!location || typeof location !== 'object') {
        errors.push(`${label}: entrée invalide.`);
        continue;
    }
    if (!Number.isInteger(location.id)) errors.push(`${label}: identifiant entier requis.`);
    if (ids.has(location.id)) errors.push(`${label}: identifiant dupliqué.`);
    ids.add(location.id);

    if (typeof location.name !== 'string' || !location.name.trim()) errors.push(`${label}: nom manquant.`);
    if (!validTypes.has(location.type)) errors.push(`${label}: type invalide « ${location.type} ».`);
    if (!Array.isArray(location.coords) || location.coords.length !== 2 || !location.coords.every(Number.isFinite)) {
        errors.push(`${label}: coordonnées invalides.`);
    } else {
        const [lat, lon] = location.coords;
        if (lat < -90 || lat > 90 || lon < -180 || lon > 180) errors.push(`${label}: coordonnées hors limites.`);
    }
    if (typeof location.desc !== 'string' || location.desc.trim().length < 20) errors.push(`${label}: description insuffisante.`);
    if (!Array.isArray(location.figures)) warnings.push(`${label}: figures devrait être un tableau.`);
    if (location.year !== undefined && (!Number.isFinite(location.year) || location.year < -50 || location.year > 230)) {
        warnings.push(`${label}: année ${location.year} hors de la plage éditoriale habituelle.`);
    }

    const canonical = String(location.name || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\([^)]*\)/g, '')
        .toLowerCase()
        .trim();
    if (canonical) {
        if (normalizedNames.has(canonical)) warnings.push(`${label}: possible doublon de « ${normalizedNames.get(canonical)} ».`);
        else normalizedNames.set(canonical, location.name);
    }
}

for (const [index, point] of (hijraRoute || []).entries()) {
    if (!Array.isArray(point) || point.length !== 2 || !point.every(Number.isFinite)) {
        errors.push(`Route de l’Hégire, point ${index + 1}: coordonnées invalides.`);
    }
}

if ((locations || []).length < 100) errors.push(`Atlas trop incomplet: ${(locations || []).length} lieux seulement.`);

for (const warning of warnings) console.warn(`AVERTISSEMENT: ${warning}`);
if (errors.length) {
    for (const error of errors) console.error(`ERREUR: ${error}`);
    process.exit(1);
}

console.log(`Atlas valide: ${locations.length} lieux, ${ids.size} identifiants uniques, ${hijraRoute.length} points de route.`);
