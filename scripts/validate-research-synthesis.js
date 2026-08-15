#!/usr/bin/env node

const fs = require('node:fs');
const vm = require('node:vm');

const viewPath = 'js/components/ScholarLibraryV4View.js';
const bridgePath = 'js/components/ScholarSynthesisBridge.js';
const cssPath = 'css/athar-research-synthesis.css';

for (const path of [viewPath, bridgePath, cssPath]) {
    if (!fs.existsSync(path)) throw new Error(`Fichier manquant : ${path}`);
}

const context = vm.createContext({
    window: {},
    console,
    URL,
    setTimeout,
    clearTimeout
});
vm.runInContext(fs.readFileSync(viewPath, 'utf8'), context, { filename: viewPath });
if (!context.window.ScholarLibraryV4View) throw new Error('La vue Athar Research ne s’initialise pas.');
const originalTemplate = context.window.ScholarLibraryV4View.template;
if (!originalTemplate.includes('@click="ask"')) throw new Error('Ancre du bouton de recherche introuvable avant synthèse.');

vm.runInContext(fs.readFileSync(bridgePath, 'utf8'), context, { filename: bridgePath });
const patched = context.window.ScholarLibraryV4View;
if (!patched.__atharGroundedSynthesis) throw new Error('Le bridge de synthèse n’a pas marqué la vue comme patchée.');

const tokens = [
    'ar5-answer-modes',
    'Synthèse IA',
    'Passages uniquement',
    '@click="runQuestion"',
    'ar5-synthesis',
    'Positions retrouvées',
    'Convergences',
    'Divergences',
    'selectSynthesisSource(sourceId)',
    'synthesisError'
];
for (const token of tokens) {
    if (!patched.template.includes(token)) throw new Error(`Injection UI absente : ${token}`);
}

const css = fs.readFileSync(cssPath, 'utf8');
for (const token of ['.ar5-answer-modes', '.ar5-synthesis', '.ar5-position-card', '.ar5-position-citations', '@media (max-width: 760px)']) {
    if (!css.includes(token)) throw new Error(`Style de synthèse absent : ${token}`);
}

const bridge = fs.readFileSync(bridgePath, 'utf8');
if (!bridge.includes("'/api/rag/v5/synthesize'")) throw new Error('Endpoint de synthèse non appelé.');
if (/body:\s*JSON\.stringify\([^)]*sources/i.test(bridge)) throw new Error('Le navigateur ne doit jamais fournir les sources à synthétiser.');

console.log('Athar Research grounded synthesis UI validée : mode IA, injection Vue, citations cliquables et absence de sources client.');
