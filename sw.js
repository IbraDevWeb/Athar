const CACHE_NAME = 'athar-pro-v1';

// Liste de TOUS les fichiers nécessaires pour que l'app marche sans internet
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  './css/style.css',
  './js/config.js',
  './js/app.js',
  // Tes fichiers de données
  './doto.js',
  './hadiths_data.js',
  './tabib_data.js',
  './adhkar_data.js',
  './silsila.js',
  './ussul_data.js',
  './atlas.js',
  // Tes composants Vue.js
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
  // Les outils externes (CDN)
  'https://unpkg.com/vue@3/dist/vue.global.prod.js',
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/fuse.js/dist/fuse.js',
  'https://unpkg.com/lucide@latest/dist/umd/lucide.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css',
  'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css',
  'https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// 1. Installation du Service Worker
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Activation et nettoyage des vieux caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// 3. Interception des requêtes (Mode Hors Ligne)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Si le fichier est en cache, on le sert, sinon on le télécharge
      return cachedResponse || fetch(event.request);
    })
  );
});