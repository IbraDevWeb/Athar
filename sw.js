const CACHE_NAME = 'athar-pro-v2'; // J'ai passé la version à v2 pour forcer la mise à jour

const ASSETS_TO_CACHE = [
  // --- RACINE ---
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  './css/style.css',
  './js/config.js',
  './js/app.js',

  // --- DONNÉES (ANCIENNES) ---
  './doto.js',
  './hadiths_data.js',
  './tabib_data.js',
  './adhkar_data.js',
  './silsila.js',
  './ussul_data.js',
  './atlas.js',

  // --- DONNÉES (NOUVELLES) ---
  './clock_data.js',
  './relations_data.js',
  './revelation_data.js',
  './extensions_data.js',

  // --- COMPOSANTS VUE.JS (ANCIENS) ---
  './js/components/TimelineView.js',
  './js/components/LibraryView.js',
  './js/components/GlossaryView.js',
  './js/components/HadithsView.js',
  './js/components/HadithReaderView.js',
  './js/components/TabibView.js',
  './js/components/TabibDetailView.js',
  './js/components/AdhkarView.js',
  './js/components/AdhkarReaderView.js',
  './js/components/ReaderView.js',
  './js/components/TransmissionView.js',
  './js/components/AtlasView.js',
  './js/components/UssulView.js',
  './js/components/HomeView.js',

  // --- COMPOSANTS VUE.JS (NOUVEAUX) ---
  './js/components/PropheticClockView.js',
  './js/components/RelationsView.js',
  './js/components/RevelationView.js',
  './js/components/ToolView.js',

  // --- LIBRAIRIES EXTERNES (CDN) ---
  'https://unpkg.com/vue@3/dist/vue.global.prod.js',
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/fuse.js/dist/fuse.js',
  'https://unpkg.com/lucide@latest/dist/umd/lucide.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.css',
  'https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.Default.css',
  'https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  // Ajout important pour le "Tissage des Liens"
  'https://cdnjs.cloudflare.com/ajax/libs/vis-network/9.1.2/dist/dist/vis-network.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/vis-network/9.1.2/dist/vis-network.min.js'
];

// 1. Installation
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Activation (Nettoyage des vieux caches)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// 3. Interception (Stratégie : Cache, puis Réseau)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});