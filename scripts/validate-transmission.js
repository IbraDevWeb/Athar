#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const dataPath = path.join(root, 'transmission_data.js');
const componentPath = path.join(root, 'js', 'components', 'TransmissionView.js');
const stylePath = path.join(root, 'css', 'transmission.css');
const conflictPattern = /^(<<<<<<<|=======|>>>>>>>)/m;

const fail = (message) => {
    console.error(`Transmission validation failed: ${message}`);
    process.exitCode = 1;
};

for (const filePath of [dataPath, componentPath, stylePath]) {
    if (!fs.existsSync(filePath)) {
        fail(`missing file ${path.relative(root, filePath)}`);
        continue;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    if (conflictPattern.test(content)) {
        fail(`unresolved Git conflict marker in ${path.relative(root, filePath)}`);
    }
}

if (process.exitCode) process.exit();

const source = `${fs.readFileSync(dataPath, 'utf8')}
;globalThis.__transmission = { SILSILA_DATA, SILSILA_JOURNEYS, SILSILA_THEMES };`;
const context = {};
vm.createContext(context);
vm.runInContext(source, context, { filename: 'transmission_data.js' });

const { SILSILA_DATA, SILSILA_JOURNEYS, SILSILA_THEMES } = context.__transmission;
const requiredGroups = ['pre', 'fiqh', 'hadith', 'quran'];

if (!SILSILA_DATA || !Array.isArray(SILSILA_DATA.nodes) || !Array.isArray(SILSILA_DATA.edges)) {
    fail('SILSILA_DATA must contain nodes and edges arrays');
    process.exit();
}

const ids = new Set();
for (const node of SILSILA_DATA.nodes) {
    if (!Number.isInteger(node.id)) fail(`node id must be an integer: ${node.label || 'unknown'}`);
    if (ids.has(node.id)) fail(`duplicate node id ${node.id}`);
    ids.add(node.id);

    for (const field of ['label', 'arabicName', 'group', 'role', 'dates', 'bio']) {
        if (!node[field]) fail(`node ${node.id} is missing ${field}`);
    }

    if (!requiredGroups.includes(node.group)) fail(`node ${node.id} has unknown group ${node.group}`);
    for (const field of ['contributions', 'works', 'keywords', 'sources']) {
        if (!Array.isArray(node[field])) fail(`node ${node.id} field ${field} must be an array`);
    }
}

for (const edge of SILSILA_DATA.edges) {
    if (!ids.has(edge.from) || !ids.has(edge.to)) {
        fail(`edge ${edge.from} -> ${edge.to} references an unknown node`);
    }
    if (edge.from === edge.to) fail(`self-referencing edge on node ${edge.from}`);
}

if (!Array.isArray(SILSILA_JOURNEYS) || SILSILA_JOURNEYS.length === 0) {
    fail('SILSILA_JOURNEYS must contain at least one guided journey');
} else {
    const journeyIds = new Set();
    for (const journey of SILSILA_JOURNEYS) {
        if (!journey.id || journeyIds.has(journey.id)) fail(`invalid or duplicate journey id ${journey.id}`);
        journeyIds.add(journey.id);
        if (!Array.isArray(journey.scholarIds) || journey.scholarIds.length < 2) {
            fail(`journey ${journey.id} must contain at least two scholars`);
            continue;
        }
        for (const id of journey.scholarIds) {
            if (!ids.has(id)) fail(`journey ${journey.id} references unknown scholar ${id}`);
        }
    }
}

for (const group of requiredGroups) {
    if (!SILSILA_THEMES[group]) fail(`missing theme for group ${group}`);
}

if (!process.exitCode) {
    const counts = requiredGroups.map(group => `${group}:${SILSILA_DATA.nodes.filter(node => node.group === group).length}`).join(', ');
    console.log(`Transmission data valid — ${SILSILA_DATA.nodes.length} profiles, ${SILSILA_DATA.edges.length} links, ${SILSILA_JOURNEYS.length} journeys (${counts}).`);
}
