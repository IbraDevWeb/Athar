const fs = require('node:fs');
const vm = require('node:vm');

const read = path => fs.readFileSync(path, 'utf8');
const files = {
  global: 'js/components/GlobalFullscreen.js',
  local: 'js/new-tools-fullscreen.js',
  app: 'js/app.js',
  bootstrap: 'js/components/ScholarV4Bootstrap.js',
  page: 'research-library.html',
  css: 'css/ux-consistency.css',
  config: 'js/config.js',
  worker: 'service-worker.js'
};
for (const path of Object.values(files)) if (!fs.existsSync(path)) throw new Error(`UX resource missing: ${path}`);

const global = read(files.global);
const local = read(files.local);
const app = read(files.app);
const bootstrap = read(files.bootstrap);
const page = read(files.page);
const css = read(files.css);
const config = read(files.config);
const worker = read(files.worker);
new vm.Script(global, { filename: files.global });
new vm.Script(local, { filename: files.local });
new vm.Script(app, { filename: files.app });

for (const token of ["const PERSIST_KEY = 'athar_immersive_enabled'", 'isPersisted', "localStorage.setItem(PERSIST_KEY, '1')", "localStorage.removeItem(PERSIST_KEY)", "window.addEventListener('athar:view-changed'", 'athar-global-content']) {
  if (!global.includes(token)) throw new Error(`Persistent immersive contract missing: ${token}`);
}
for (const token of ["const PERSIST_KEY = 'athar_immersive_enabled'", "button.dataset.atharNewtoolFullscreen = 'shared'", 'ensureSingleButton', 'removeLocalButtons', 'targetContext', "attributeFilter: ['hidden']"]) {
  if (!local.includes(token)) throw new Error(`Shared standalone fullscreen contract missing: ${token}`);
}
if (local.includes("data.atharNewtoolFullscreen = 'library'") || local.includes("data.atharNewtoolFullscreen = 'reader'")) {
  throw new Error('Standalone reader must not create separate library/reader fullscreen buttons.');
}
for (const token of ["requestedView === 'rag_v5'", "CustomEvent('athar:view-changed'", ".athar-global-mainframe > main", 'history.replaceState']) {
  if (!app.includes(token)) throw new Error(`Navigation continuity missing: ${token}`);
}
for (const token of ['athar-pro-v38', '<span class="ar5-nav-version">V6</span>', 'RAG V6 hybride']) {
  if (!bootstrap.includes(token)) throw new Error(`Research chrome not updated: ${token}`);
}
for (const token of ['css/ux-consistency.css?v=athar-pro-v38', 'css/new-tools-fullscreen.css?v=athar-pro-v38', 'js/new-tools-fullscreen.js?v=athar-pro-v38', 'index.html?view=rag_v5', 'Masquer les panneaux du lecteur']) {
  if (!page.includes(token)) throw new Error(`Standalone library UX contract missing: ${token}`);
}
for (const token of ['--athar-ux-topbar: 68px', '.athar-global-content', '.ar5-topbar,', '.library-topbar,', '.reader-appbar', 'html.athar-app-fullscreen [data-athar-newtool-fullscreen]', '#focusMode::after', '@media (max-width: 900px)']) {
  if (!css.includes(token)) throw new Error(`Shared UX CSS missing: ${token}`);
}
if (!config.includes("const APP_VERSION = 'athar-pro-v38'")) throw new Error('App cache version was not bumped to v38.');
if (!config.includes("css/ux-consistency.css?v=${APP_VERSION}")) throw new Error('Shared UX CSS is not loaded by config.js.');
if (!worker.includes("const CACHE_VERSION = 'athar-pro-v38'")) throw new Error('Service worker cache version was not bumped to v38.');
for (const asset of ['css/ux-consistency.css?v=athar-pro-v38', 'css/new-tools-fullscreen.css?v=athar-pro-v38', 'js/new-tools-fullscreen.js?v=athar-pro-v38']) {
  if (!worker.includes(asset)) throw new Error(`UX asset missing from cache: ${asset}`);
}
console.log('Athar UX v38 valid — one fullscreen control, persistent immersive state, route continuity and shared documentary chrome.');
