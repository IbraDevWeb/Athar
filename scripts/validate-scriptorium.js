#!/usr/bin/env node
const fs = require('fs');
const vm = require('vm');
const read = path => fs.readFileSync(path, 'utf8');
const fail = message => { console.error(`Scriptorium validation failed: ${message}`); process.exit(1); };
const need = (source, token, label) => { if (!source.includes(token)) fail(`${label} is missing: ${token}`); };

const context = { window: {} };
vm.createContext(context); vm.runInContext(read('scriptorium_data.js'), context);
const data = context.window.SCRIPTORIUM_DATA;
if (!data || data.folios?.length !== 6 || data.glossary?.length < 5 || data.workshop?.scripts?.length !== 6) fail('Scriptorium corpus is incomplete.');
for (const folio of data.folios) {
    for (const field of ['id','title','arabic','period','region','script','support','format','summary','insight']) if (!String(folio[field] || '').trim()) fail(`${folio.id} is missing ${field}.`);
    if (!Array.isArray(folio.observations) || folio.observations.length < 4) fail(`${folio.id} needs four observations.`);
    if (!/^https:\/\/(www\.metmuseum\.org|essentiels\.bnf\.fr|ccfr\.bnf\.fr)\//.test(String(folio.source?.url || ''))) fail(`${folio.id} uses an unsupported source.`);
}
const component = read('js/components/ScriptoriumView.js');
['sc7-gallery','sc7-workshop','sc7-timeline','athar-scriptorium-active','showMethodology','onBeforeUnmount','Reconstitution graphique — non fac-similé'].forEach(t => need(component,t,'ScriptoriumView'));
if (/<canvas\b|<iframe|fetch\s*\(|new\s+Audio\s*\(/i.test(component)) fail('Remote runtime detected.');
const css = read('css/scriptorium.css');
['.sc7-shell','.sc7-gallery','.sc7-workshop','.sc7-overlay','html.athar-scriptorium-active .athar-mobile-dock','@media (max-width: 640px)','touch-action: manipulation'].forEach(t => need(css,t,'Scriptorium CSS'));
if ((css.match(/{/g)||[]).length !== (css.match(/}/g)||[]).length) fail('Unbalanced CSS braces.');

const config = read('js/config.js');
["const APP_VERSION = 'athar-pro-v36'","writeEarlyScript('scriptorium_data.js'",'css/scriptorium.css?v=${APP_VERSION}'].forEach(t => need(config,t,'config.js'));
const worker = read('service-worker.js');
["const CACHE_VERSION = 'athar-pro-v36'",'./scriptorium_data.js?v=athar-pro-v36','./css/scriptorium.css?v=athar-pro-v36'].forEach(t => need(worker,t,'service worker'));
need(read('extensions_data.js'),'Galerie interactive des écritures, supports et rythmes','metadata');
console.log(`Scriptorium validated: ${data.folios.length} folios and cache v36.`);
