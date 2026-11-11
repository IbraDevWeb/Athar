const CACHE_VERSION = 'athar-pro-v50-isnad-01-05-1';
// Seules les ressources de la version publique sont précachées.
const APP_SHELL = [
    './',
    './index.html',
    './manifest.json',
    './icon.png',
    './css/style.css',
    './css/athar-launch.css?v=athar-public-3',
    './js/config.js?v=athar-core-1',
    './js/app.js?v=athar-core-1',
    './js/components/HomeView.js?v=athar-public-3',
    './js/components/ReaderView.js?v=athar-siyar-isnad-01-05-1',
    './js/components/TasbihView.js?v=athar-tasbih-simple-1',
    './biographies_data.js?v=athar-siyar-isnad-01-05-1',
    './biography_sources_data.js?v=athar-siyar-isnad-01-05-1',
    './glossary_data.js',
    './hadiths_data.js',
    './tabib_data.js',
    './adhkar_data.js',
    './js/composables/useFavorites.js',
    './js/composables/useSettings.js',
    './js/components/TimelineView.js',
    './js/components/LibraryView.js?v=athar-siyar-isnad-01-05-1',
    './js/components/GlossaryView.js',
    './js/components/HadithsView.js',
    './js/components/HadithReaderView.js',
    './js/components/TabibView.js',
    './js/components/TabibDetailView.js',
    './js/components/AdhkarView.js',
    './js/components/AdhkarReaderView.js',
    './css/tasbih-pro.css?v=athar-pro-v50-isnad-01-05-1',
    './css/timeline-pro.css?v=athar-pro-v50-isnad-01-05-1',
    './css/fullscreen-global.css?v=athar-pro-v50-isnad-01-05-1',
    './css/adhkar-pro.css?v=athar-pro-v50-isnad-01-05-1',
    './css/hadith-pro.css?v=athar-pro-v50-isnad-01-05-1',
    './css/library-pro.css?v=athar-pro-v50-isnad-01-05-1',
    './css/library-immersive-fix.css?v=athar-pro-v50-isnad-01-05-1',
    './css/mobile-pro.css?v=athar-pro-v50-isnad-01-05-1',
    './css/interaction-stability.css?v=athar-pro-v50-isnad-01-05-1',
    './css/immersive-only.css?v=athar-pro-v50-isnad-01-05-1',
    './css/tasbih-simple.css?v=athar-pro-v50-isnad-01-05-1',
    './js/components/VueSafeIcons.js?v=athar-pro-v50-isnad-01-05-1',
    './js/components/AtharLensBridge.js?v=athar-pro-v50-isnad-01-05-1',
    './js/components/GlobalFullscreen.js?v=athar-pro-v50-isnad-01-05-1',
    './js/components/MobileExperience.js?v=athar-pro-v50-isnad-01-05-1',
    './js/components/ThemeBridge.js?v=athar-pro-v50-isnad-01-05-1',
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then(cache => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys.filter(key => key.startsWith('athar-pro-') && key !== CACHE_VERSION).map(key => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    const request = event.request;
    if (request.method !== 'GET') return;
    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;

    const isPage = request.mode === 'navigate';
    const isCodeAsset = /\.(?:js|css)$/.test(url.pathname);
    if (isPage || isCodeAsset) {
        event.respondWith(
            fetch(request, { cache: 'no-store' })
                .then(response => {
                    if (response.ok) {
                        const copy = response.clone();
                        caches.open(CACHE_VERSION).then(cache => cache.put(request, copy));
                    }
                    return response;
                })
                .catch(() => caches.match(request).then(cached => cached || caches.match('./index.html')))
        );
        return;
    }

    event.respondWith(
        caches.match(request).then(cached => cached || fetch(request).then(response => {
            if (response.ok) {
                const copy = response.clone();
                caches.open(CACHE_VERSION).then(cache => cache.put(request, copy));
            }
            return response;
        }))
    );
});
