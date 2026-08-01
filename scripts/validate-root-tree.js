#!/usr/bin/env node
const fs = require('fs');
const vm = require('vm');
const read = path => fs.readFileSync(path, 'utf8');
const fail = message => { console.error(`Root Tree validation failed: ${message}`); process.exit(1); };
const need = (source, token, label) => { if (!source.includes(token)) fail(`${label} is missing: ${token}`); };

const context = { window:{} };
vm.createContext(context); vm.runInContext(read('roots_data.js'), context);
const data = context.window.ROOT_TREE_DATA;
if (!data || !Array.isArray(data.roots) || data.roots.length !== 10) fail('Ten roots are required.');
if (!Array.isArray(data.guides) || data.guides.length !== 3) fail('Three guides are required.');
const rootIds=new Set(), derivativeIds=new Set();
for (const root of data.roots) {
    if (!root.id || rootIds.has(root.id)) fail(`Invalid root ${root.id}.`);
    rootIds.add(root.id);
    if (!Array.isArray(root.letters) || root.letters.length !== 3) fail(`${root.id} needs three letters.`);
    if (!Array.isArray(root.derivatives) || root.derivatives.length !== 5) fail(`${root.id} needs five derivatives.`);
    if (!Array.isArray(root.verses) || root.verses.length !== 3) fail(`${root.id} needs three verses.`);
    if (!/^https:\/\/corpus\.quran\.com\//.test(root.sourceUrl)) fail(`${root.id} uses an unsupported source.`);
    root.derivatives.forEach(item=>{ if(!item.id||derivativeIds.has(item.id)) fail(`Invalid derivative ${item.id}.`); derivativeIds.add(item.id); });
}
for(const guide of data.guides) for(const step of guide.steps||[]) {
    if(!rootIds.has(step.rootId)||!derivativeIds.has(step.derivativeId)) fail(`${guide.id} has an invalid step.`);
}
const component=read('js/components/RootTreeView.js');
['rt7-workspace','rt7-tree-stage','rt7-inspector','rt7-guide-reader','athar-root-tree-active','showMethod','onBeforeUnmount','localStorage.setItem'].forEach(t=>need(component,t,'RootTreeView'));
if(/<canvas\b|<iframe|fetch\s*\(|new\s+Audio\s*\(/i.test(component)) fail('Remote runtime detected.');
const css=read('css/root-tree.css');
['.rt7-shell','.rt7-tree-canvas','.rt7-branch','.rt7-overlay','html.athar-root-tree-active .athar-mobile-dock','@media (max-width: 760px)','touch-action: manipulation'].forEach(t=>need(css,t,'Root Tree CSS'));
if((css.match(/{/g)||[]).length!==(css.match(/}/g)||[]).length) fail('Unbalanced CSS braces.');

const bridge=read('js/components/AstronomyBootstrap.js');
["'root-tree-view': window.RootTreeView","'golden-chain-view': window.GoldenChainView","currentTool === 'roots'","currentTool === 'isnad'",'PATCH_FLAG'].forEach(t=>need(bridge,t,'Bridge'));
const anchor=`<scholar-atlas-module v-if="currentTool === 'scholars_map'" :settings="settings"></scholar-atlas-module>\n    <div v-else`;
need(read('js/components/ToolView.js'),anchor,'ToolView');
const sandbox={console,window:{AncientSkyView:{},HistoryNightsView:{},ScriptoriumView:{},RootTreeView:{},GoldenChainView:{},Vue:{createApp:r=>r}}};
vm.createContext(sandbox); vm.runInContext(bridge,sandbox);
const fake={components:{},template:anchor}; sandbox.window.Vue.createApp({components:{'tool-view':fake}});
for(const name of ['root-tree-view','golden-chain-view']) if(!fake.components[name]) fail(`${name} not registered.`);
if(!fake.template.includes(`currentTool === 'isnad'`)) fail('Isnad route not preserved.');

const config=read('js/config.js');
["const APP_VERSION = 'athar-pro-v32'","writeEarlyScript('roots_data.js'",'css/root-tree.css?v=${APP_VERSION}'].forEach(t=>need(config,t,'config.js'));
const worker=read('service-worker.js');
["const CACHE_VERSION = 'athar-pro-v32'",'./roots_data.js?v=athar-pro-v32','./css/root-tree.css?v=athar-pro-v32'].forEach(t=>need(worker,t,'service worker'));
need(read('extensions_data.js'),'Explorateur visuel des racines arabes','metadata');
console.log(`Root Tree validated: ${data.roots.length} roots, ${derivativeIds.size} derivatives and cache v32.`);
