const CACHE_VERSION = 'athar-pro-v7';
const APP_SHELL = [
    './',
    './index.html',
    './manifest.json',
    './css/style.css',
    './css/transmission.css?v=athar-pro-v7',
    './css/atlas.css?v=athar-pro-v7',
    './css/atlas-layout-fix.css?v=athar-pro-v7',
    './js/config.js',
    './js/app.js',
    './js/components/TransmissionView.js?v=athar-pro-v7',
    './transmission_data.js?v=athar-pro-v7',
    './js/components/AtlasView.js?v=athar-pro-v7',
    './atlas_data.js?v=athar-pro-v7'
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
