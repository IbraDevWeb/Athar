#!/usr/bin/env node

const fs = require('fs');
const vm = require('vm');
const read = path => fs.readFileSync(path, 'utf8');
const fail = message => { console.error(`Golden Chain validation failed: ${message}`); process.exit(1); };
const need = (source, token, label) => { if (!source.includes(token)) fail(`${label} is missing: ${token}`); };

const context = { window: {} };
vm.createContext(context);
vm.runInContext(read('isnad_data.js'), context);
const data = context.window.GOLDEN_CHAIN_DATA;
if (!data?.meta?.editorialNote || !data?.meta?.sourcePolicy) fail('Editorial methodology is incomplete.');
if (!Array.isArray(data.chains) || data.chains.length !== 5) fail('Exactly five chains are required.');
if (!Array.isArray(data.narrators) || data.narrators.length < 17) fail('Narrator corpus is incomplete.');
if (!Array.isArray(data.lessons) || data.lessons.length !== 3) fail('Exactly three lessons are required.');

const narratorIds = new Set();
for (const narrator of data.narrators) {
    if (!narrator.id || narratorIds.has(narrator.id)) fail(`Invalid narrator ${narrator.id}.`);
    narratorIds.add(narrator.id);
    for (const field of ['name','arabic','dates','city','generation','role','monogram','summary','transmission','appraisal']) {
        if (!String(narrator[field] || '').trim()) fail(`${narrator.id} is missing ${field}.`);
    }
}
for (const chain of data.chains) {
    if (!Array.isArray(chain.route) || chain.route.length < 4 || chain.route.length > 5) fail(`${chain.id} has an invalid route.`);
    if (!Array.isArray(chain.linkLabels) || chain.linkLabels.length !== chain.route.length - 1) fail(`${chain.id} link labels are inconsistent.`);
    chain.route.forEach(id => { if (!narratorIds.has(id)) fail(`${chain.id} points to unknown narrator ${id}.`); });
    if (chain.route.at(-1) !== 'prophet') fail(`${chain.id} must end at the prophetic source.`);
    if (!/^https:\/\/(www\.)?sunnah\.com\//.test(String(chain.sourceUrl || ''))) fail(`${chain.id} uses an unsupported source.`);
}

const component = read('js/components/GoldenChainView.js');
['gc8-workspace','gc8-route','gc8-node','gc8-inspector','gc8-compare-grid','gc8-guide-reader','gc8-overlay','athar_golden_chain_v1','athar-golden-chain-active','selectChain','selectNarrator','showSample','showMethod','onBeforeUnmount','localStorage.setItem'].forEach(token => need(component, token, 'GoldenChainView'));
if (/<canvas\b|<iframe|fetch\s*\(|new\s+Audio\s*\(|THREE\./i.test(component)) fail('Remote runtime detected.');

const css = read('css/golden-chain.css');
['.gc8-shell','.gc8-chain-rail','.gc8-stage','.gc8-route','.gc8-node','.gc8-inspector','.gc8-compare-grid','.gc8-guide-reader','.gc8-overlay','html.athar-golden-chain-active .athar-mobile-dock','html.athar-app-fullscreen .gc8-shell','@media (max-width: 640px)','touch-action: manipulation'].forEach(token => need(css, token, 'Golden Chain CSS'));
if ((css.match(/{/g)||[]).length !== (css.match(/}/g)||[]).length) fail('Unbalanced CSS braces.');

const config = read('js/config.js');
const appVersion = config.match(/const APP_VERSION = '([^']+)'/)?.[1];
if (!appVersion) fail('config.js does not declare APP_VERSION.');
["writeEarlyScript('isnad_data.js'","writeEarlyScript('js/components/GoldenChainView.js'",'css/golden-chain.css?v=${APP_VERSION}'].forEach(token => need(config, token, 'config.js'));
const worker = read('service-worker.js');
const cacheVersion = worker.match(/const CACHE_VERSION = '([^']+)'/)?.[1];
if (!cacheVersion) fail('service-worker.js does not declare CACHE_VERSION.');
if (cacheVersion !== appVersion) fail(`Version mismatch: APP_VERSION=${appVersion}, CACHE_VERSION=${cacheVersion}.`);
[`./isnad_data.js?v=${appVersion}`,`./js/components/GoldenChainView.js?v=${appVersion}`,`./css/golden-chain.css?v=${appVersion}`].forEach(token => need(worker, token, 'service worker'));
need(read('extensions_data.js'),'Explorateur pédagogique des isnāds','metadata');
console.log(`Golden Chain validated: ${data.chains.length} chains, ${data.narrators.length} narrators and cache ${cacheVersion}.`);
