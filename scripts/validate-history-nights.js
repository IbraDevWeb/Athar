#!/usr/bin/env node
const fs = require('fs');
const vm = require('vm');
const read = path => fs.readFileSync(path, 'utf8');
const fail = message => { console.error(`History Nights validation failed: ${message}`); process.exit(1); };
const need = (source, token, label) => { if (!source.includes(token)) fail(`${label} is missing: ${token}`); };

const context = { window: {} };
vm.createContext(context);
vm.runInContext(read('history_nights_data.js'), context);
const data = context.window.HISTORY_NIGHTS_DATA;
if (!data || !Array.isArray(data.stories) || data.stories.length !== 4) fail('Four stories are required.');
let chapters = 0;
for (const story of data.stories) {
    if (!story.id || !story.title || !story.editorialNote && !data.meta?.editorialNote) fail(`Incomplete story: ${story.id}`);
    if (!Array.isArray(story.sources) || story.sources.length < 3) fail(`${story.id} needs three sources.`);
    if (!Array.isArray(story.chapters) || story.chapters.length !== 4) fail(`${story.id} needs four chapters.`);
    for (const chapter of story.chapters) {
        chapters += 1;
        if (!chapter.id || !chapter.title || !Array.isArray(chapter.body) || chapter.body.length < 3) fail(`Incomplete chapter in ${story.id}.`);
    }
}
const component = read('js/components/HistoryNightsView.js');
['hn6-story-grid','hn6-reading-sheet','hn6-player','speechSynthesis','toggleNarration','athar-history-nights-active','onBeforeUnmount','@click="openStory(story, 0)"'].forEach(t => need(component,t,'HistoryNightsView'));
if (/new\s+Audio\s*\(|<audio|<iframe|fetch\s*\(/i.test(component)) fail('Remote runtime detected.');
const css = read('css/history-nights.css');
['.hn6-shell','.hn6-reader-layout','.hn6-overlay','html.athar-history-nights-active .athar-mobile-dock','@media (max-width: 760px)','touch-action: manipulation'].forEach(t => need(css,t,'History CSS'));
need(read('css/history-nights-scroll.css'),'overflow-y: auto','History scroll CSS');

const bridge = read('js/components/AstronomyBootstrap.js');
["'history-nights-view': window.HistoryNightsView","'golden-chain-view': window.GoldenChainView","currentTool === 'history_nights'","currentTool === 'isnad'",'PATCH_FLAG'].forEach(t => need(bridge,t,'Bridge'));
const anchor = `<scholar-atlas-module v-if="currentTool === 'scholars_map'" :settings="settings"></scholar-atlas-module>\n    <div v-else`;
need(read('js/components/ToolView.js'), anchor, 'ToolView');
const sandbox = { console, window: {
    AncientSkyView:{}, HistoryNightsView:{}, ScriptoriumView:{}, RootTreeView:{}, GoldenChainView:{}, Vue:{ createApp: root => root }
} };
vm.createContext(sandbox); vm.runInContext(bridge, sandbox);
const fake = { components:{}, template:anchor };
sandbox.window.Vue.createApp({ components:{ 'tool-view':fake } });
for (const name of ['history-nights-view','scriptorium-view','root-tree-view','golden-chain-view']) if (!fake.components[name]) fail(`${name} not registered.`);
if (!fake.template.includes(`currentTool === 'isnad'`)) fail('Isnad route not preserved.');

const config = read('js/config.js');
["const APP_VERSION = 'athar-pro-v32'","writeEarlyScript('history_nights_data.js'",'css/history-nights.css?v=${APP_VERSION}'].forEach(t => need(config,t,'config.js'));
const worker = read('service-worker.js');
["const CACHE_VERSION = 'athar-pro-v32'",'./history_nights_data.js?v=athar-pro-v32','./css/history-nights-scroll.css?v=athar-pro-v32'].forEach(t => need(worker,t,'service worker'));
need(read('extensions_data.js'),'Récits historiques immersifs, sourcés','metadata');
console.log(`History Nights validated: ${data.stories.length} stories, ${chapters} chapters and cache v32.`);
