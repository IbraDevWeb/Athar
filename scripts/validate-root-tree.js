#!/usr/bin/env node
const fs = require('fs');
const vm = require('vm');
const read = path => fs.readFileSync(path, 'utf8');
const fail = message => { console.error(`Root Tree validation failed: ${message}`); process.exit(1); };
const need = (source, token, label) => { if (!source.includes(token)) fail(`${label} is missing: ${token}`); };

const context = { window:{} };
vm.createContext(context); vm.runInContext(read('roots_data.js'), context);
const data = context.window.ROOT_TREE_DATA;
if (!data || data.roots?.length !== 10 || data.guides?.length !== 3) fail('Root corpus is incomplete.');
const rootIds = new Set();
const derivativeIds = new Set();
for (const root of data.roots) {
    if (!root.id || rootIds.has(root.id)) fail(`Invalid root ${root.id}.`);
    rootIds.add(root.id);
    if (!Array.isArray(root.letters) || root.letters.length !== 3) fail(`${root.id} needs three letters.`);
    if (!Array.isArray(root.derivatives) || root.derivatives.length !== 5) fail(`${root.id} needs five derivatives.`);
    if (!Array.isArray(root.verses) || root.verses.length !== 3) fail(`${root.id} needs three verses.`);
    if (!/^https:\/\/corpus\.quran\.com\//.test(root.sourceUrl)) fail(`${root.id} uses an unsupported source.`);
    root.derivatives.forEach(item => { if (!item.id || derivativeIds.has(item.id)) fail(`Invalid derivative ${item.id}.`); derivativeIds.add(item.id); });
}
for (const guide of data.guides) for (const step of guide.steps || []) {
    if (!rootIds.has(step.rootId) || !derivativeIds.has(step.derivativeId)) fail(`${guide.id} has an invalid step.`);
}
const component = read('js/components/RootTreeView.js');
['rt7-workspace','rt7-tree-stage','rt7-inspector','rt7-guide-reader','athar-root-tree-active','showMethod','onBeforeUnmount','localStorage.setItem'].forEach(t => need(component,t,'RootTreeView'));
if (/<canvas\b|<iframe|fetch\s*\(|new\s+Audio\s*\(/i.test(component)) fail('Remote runtime detected.');
const css = read('css/root-tree.css');
['.rt7-shell','.rt7-tree-canvas','.rt7-branch','.rt7-overlay','html.athar-root-tree-active .athar-mobile-dock','@media (max-width: 760px)','touch-action: manipulation'].forEach(t => need(css,t,'Root Tree CSS'));
if ((css.match(/{/g)||[]).length !== (css.match(/}/g)||[]).length) fail('Unbalanced CSS braces.');

const config = read('js/config.js');
["const APP_VERSION = 'athar-pro-v33'","writeEarlyScript('roots_data.js'",'css/root-tree.css?v=${APP_VERSION}'].forEach(t => need(config,t,'config.js'));
const worker = read('service-worker.js');
["const CACHE_VERSION = 'athar-pro-v33'",'./roots_data.js?v=athar-pro-v33','./css/root-tree.css?v=athar-pro-v33'].forEach(t => need(worker,t,'service worker'));
need(read('extensions_data.js'),'Explorateur visuel des racines arabes','metadata');
console.log(`Root Tree validated: ${data.roots.length} roots, ${derivativeIds.size} derivatives and cache v33.`);
