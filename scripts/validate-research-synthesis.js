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

// Regression guard: the public synthesis API path is legacy-compatible, but the
// response engine is now V6.x. Never pin the browser to the historical V5 identity.
if (bridge.includes('Number(data?.engine_version || 0) !== 5')) {
    throw new Error('La synthèse ne doit plus exiger engine_version === 5.');
}
if (bridge.includes("data?.engine !== 'rag-v5-hybrid-multilingual'")) {
    throw new Error('La synthèse ne doit plus exiger l’identité exacte du moteur V5.');
}
if (!bridge.includes('engineVersion >= 5')) {
    throw new Error('Le bridge doit vérifier une compatibilité de protocole V5+ / V6+.');
}
if (!bridge.includes('/^(?:rag|athar)-v/i')) {
    throw new Error('Le bridge doit accepter les identités de runtime rag-v* et athar-v*.');
}
if (!bridge.includes("Le moteur de synthèse Athar n’est pas disponible.")) {
    throw new Error('Le message d’erreur ne doit plus annoncer à tort un moteur V5 requis.');
}
if (!bridge.includes('engine_version: Number(payload?.engine_version')) {
    throw new Error('Le statut UI doit reprendre la version réellement renvoyée par le serveur.');
}

const compatibility = context.window.AtharScholarSynthesis?.isCompatibleEngine;
if (typeof compatibility !== 'function') throw new Error('Le test de compatibilité moteur n’est pas exporté.');
if (!compatibility({ ok: true, engine_version: 5, engine: 'rag-v5-hybrid-multilingual' })) {
    throw new Error('La compatibilité V5 historique doit rester acceptée.');
}
if (!compatibility({ ok: true, engine_version: 6, engine: 'rag-v6.5.1-remote-semantic-fused' })) {
    throw new Error('Le runtime RAG V6 doit être accepté.');
}
if (!compatibility({ ok: true, engine_version: 6, engine: 'athar-v6.5.3-remote-semantic-fusion' })) {
    throw new Error('Le runtime Athar V6.5.3 doit être accepté.');
}
if (compatibility({ ok: false, engine_version: 6, engine: 'athar-v6.5.3-remote-semantic-fusion' })) {
    throw new Error('Une réponse non-ok ne doit jamais être considérée compatible.');
}

console.log('Athar Research grounded synthesis UI validée : V5+/V6+, injection Vue, citations cliquables et absence de sources client.');
