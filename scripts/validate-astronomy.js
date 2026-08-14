const fs = require('fs');
const vm = require('vm');
const read = path => fs.readFileSync(path, 'utf8');
const fail = message => { console.error(`Astronomy validation failed: ${message}`); process.exit(1); };
const need = (source, token, label) => { if (!source.includes(token)) fail(`${label} is missing: ${token}`); };

const context = { window: {} };
vm.createContext(context); vm.runInContext(read('astronomy_data.js'), context);
const data = context.window.ANCIENT_SKY_DATA;
if (!data || data.seasons?.length !== 4 || data.moments?.length < 5 || data.objects?.length < 14 || data.guides?.length < 3) fail('Astronomy corpus is incomplete.');
const ids = new Set(data.objects.map(item => item.id));
for (const item of data.objects) {
    for (const key of ['name','arabic','transliteration','summary','story','memory','source']) if (!String(item[key] || '').trim()) fail(`${item.id} is missing ${key}.`);
    for (const season of data.seasons) if (!Array.isArray(item.positions?.[season.id]) || item.positions[season.id].length !== 2) fail(`${item.id} has an invalid ${season.id} position.`);
}
for (const guide of data.guides) for (const step of guide.steps || []) if (!ids.has(step.objectId)) fail(`${guide.id} points to an unknown object.`);

const component = read('js/components/AncientSkyView.js');
['sky5-planisphere','visibleObjects','visibleLinks','backgroundStars','selectSeason','startGuide','showAbout','athar-astronomy-active','onBeforeUnmount'].forEach(t => need(component,t,'AncientSkyView'));
if (/<canvas\b|getContext\s*\(\s*['"]webgl|THREE\./i.test(component)) fail('Heavy rendering engine detected.');
const css = read('css/ancient-sky.css');
['.sky5-shell','.sky5-planisphere','.sky5-inspector','.sky5-guides','html.athar-app-fullscreen .sky5-frame','@media (max-width: 640px)','touch-action: manipulation'].forEach(t => need(css,t,'Astronomy CSS'));

const config = read('js/config.js');
["const APP_VERSION = 'athar-pro-v36'","writeEarlyScript('astronomy_data.js'","writeEarlyScript('js/components/AncientSkyView.js'",'css/ancient-sky.css?v=${APP_VERSION}'].forEach(t => need(config,t,'config.js'));
const worker = read('service-worker.js');
["const CACHE_VERSION = 'athar-pro-v36'",'./astronomy_data.js?v=athar-pro-v36','./js/components/AncientSkyView.js?v=athar-pro-v36','./css/ancient-sky.css?v=athar-pro-v36'].forEach(t => need(worker,t,'service worker'));
need(read('extensions_data.js'),'Planisphère pédagogique','metadata');
console.log(`Astronomy validated: ${data.objects.length} objects and cache v36.`);
