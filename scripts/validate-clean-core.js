#!/usr/bin/env node
// Contractuel : pas de RAG, de ressources supprimées ou d'appels serveur côté public.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const assert = (ok, message) => { if (!ok) throw new Error(message); };
for (const name of ['rag','render.yaml','research-library.html','RAG_HOSTED.md','RAG_INGESTION.md','sw.js']) {
  assert(!fs.existsSync(path.join(root, name)), 'Ancienne ressource encore présente : '+name);
}
const workflows = fs.readdirSync(path.join(root,'.github/workflows')).filter(n=>n.endsWith('.yml'));
assert(workflows.length === 2 && workflows.includes('validate-static.yml') && workflows.includes('athar-public-live.yml'), 'Anciennes automatisations encore actives');
const config = read('js/config.js'), html = read('index.html'), sw = read('service-worker.js'), app=read('js/app.js');
assert(config.includes('athar-pro-v55-siyar-21-30-1') && sw.includes('athar-pro-v55-siyar-21-30-1'), 'Version PWA non synchronisée');
assert(!/ScholarV4Bootstrap|ScholarLibraryV4View|onrender\.com|research-library\.html/i.test(config+html+sw+app),'Client RAG encore chargé');
const match=sw.match(/const APP_SHELL\s*=\s*(\[[\s\S]*?\]);/);
assert(match, 'Liste de précache absente');
const assets = vm.runInNewContext(match[1]);
assert(assets.length > 30 && assets.length < 60, 'Le cache public doit rester compact');
assert(new Set(assets).size === assets.length, 'Le cache contient des doublons');
for(const url of assets) {
  assert(!/\/rag\/|research|ScholarLibrary|ux-v40/i.test(url), 'RAG dans le cache : '+url);
  const resource=String(url).replace(/^\.\//,'').split('?')[0];
  if(resource) assert(fs.existsSync(path.join(root,resource)), 'Ressource PWA absente : '+url);
}
const imports=[...html.matchAll(/<script[^>]*\bsrc=["']([^"']+)["']/g)].map(m=>m[1]).filter(x=>!/^https?:/.test(x));
for(const url of imports) assert(fs.existsSync(path.join(root,url.split('?')[0])), 'Script public absent : '+url);
const names=['HomeView','TimelineView','LibraryView','GlossaryView','HadithsView','HadithReaderView','TabibView','TabibDetailView','AdhkarView','AdhkarReaderView','ReaderView','TasbihView'];
for(const name of names) assert(imports.some(url=>url.startsWith('js/components/'+name+'.js')), 'Composant absent du site : '+name);
for(const name of ['transmission_data.js','atlas_data.js','ussul_data.js','constellation_part1.js']) {
  assert(!imports.includes(name), 'Module non publié téléchargé : '+name);
}
console.log('Athar : seulement sept rubriques chargées, '+assets.length+' ressources PWA, 2 workflows, aucun RAG.');
