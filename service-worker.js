const CACHE_VERSION = 'athar-pro-v9';
const APP_SHELL = [
    './',
    './index.html',
    './manifest.json',
    './css/style.css',
    './css/transmission.css?v=athar-pro-v9',
    './css/atlas.css?v=athar-pro-v9',
    './css/atlas-layout-fix.css?v=athar-pro-v9',
    './css/scholar-atlas.css?v=athar-pro-v9',
    './css/constellation-base.css?v=athar-pro-v9',
    './css/constellation-content.css?v=athar-pro-v9',
    './css/constellation-overlays.css?v=athar-pro-v9',
    './js/config.js',
    './js/app.js',
    './js/components/TransmissionView.js?v=athar-pro-v9',
    './transmission_data.js?v=athar-pro-v9',
    './js/components/AtlasView.js?v=athar-pro-v9',
    './atlas_data.js?v=athar-pro-v9',
    './js/components/ToolView.js?v=athar-pro-v9',
    './scholar_atlas_core.js?v=athar-pro-v9',
    './scholar_atlas_traditions.js?v=athar-pro-v9',
    './scholar_atlas_thought.js?v=athar-pro-v9',
    './js/components/ConstellationBootstrap.js?v=athar-pro-v9',
    './js/components/ConstellationCore.js?v=athar-pro-v9',
    './js/components/ConstellationTemplate.js?v=athar-pro-v9',
    './constellation_part1.js?v=athar-pro-v9',
    './constellation_part2.js?v=athar-pro-v9',
    './constellation_part3.js?v=athar-pro-v9',
    './constellation_part4.js?v=athar-pro-v9',
    './constellation_links.js?v=athar-pro-v9'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then((cache) => Promise.allSettled(APP_SHELL.map((url) => cache.add(url))))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys
                    .filter((key) => key.startsWith('athar-pro-') && key !== CACHE_VERSION)
                    .map((key) => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const request = event.request;
    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;

    const isPage = request.mode === 'navigate';
    const isCodeAsset = /\.(?:js|css)$/.test(url.pathname);

    if (isPage || isCodeAsset) {
        event.respondWith(
            fetch(request, { cache: 'no-store' })
                .then((response) => {
                    if (response.ok) {
                        const copy = response.clone();
                        caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
                    }
                    return response;
                })
                .catch(() => caches.match(request).then((cached) => cached || caches.match('./index.html')))
        );
        return;
    }

    event.respondWith(
        caches.match(request).then((cached) => cached || fetch(request).then((response) => {
            if (response.ok) {
                const copy = response.clone();
                caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
            }
            return response;
        }))
    );
});
