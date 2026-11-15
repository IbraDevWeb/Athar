const CACHE_VERSION = 'athar-pro-v81-tabib-no-essence-v1';
// Seules les ressources de la version publique sont précachées.
const APP_SHELL = [
    './',
    './index.html',
    './manifest.json',
    './icon.png',
    './css/style.css',
    './css/section-gallery-unified.css?v=athar-pro-v81-tabib-no-essence-v1',
    './css/hadith-editorial-finish.css?v=athar-pro-v81-tabib-no-essence-v1',
    './css/bukhari-first-50.css?v=athar-pro-v81-tabib-no-essence-v1',
    './css/bukhari-tabib-inspired.css?v=athar-pro-v81-tabib-no-essence-v1',
    './css/athar-launch.css?v=athar-public-3',
    './js/config.js?v=athar-tabib-no-essence-v1',
    './js/app.js?v=athar-core-tabib-12-v1',
    './js/components/HomeView.js?v=athar-public-3',
    './js/components/ReaderView.js?v=athar-reading-01-40-v2',
    './js/components/TasbihView.js?v=athar-tasbih-simple-1',
    './biographies_data.js?v=athar-siyar-reading-01-40-1',
    './biography_sources_data.js?v=athar-siyar-reading-01-40-1',
    './siyar_101_109_data.js?v=athar-siyar-101-109-v1',
    './js/biography-reading-presentation.js?v=athar-reading-01-40-v2',
    './glossary_data.js',
    './hadiths_data.js',
    './js/kutub-sitta-registry.js?v=athar-kutub-sitta-v3',
    './ussul_data.js?v=athar-usul-core-v1',
    './data/kutub-sitta/bukhari.json',
    './data/kutub-sitta/muslim.json',
    './data/kutub-sitta/abu-dawud.json',
    './data/kutub-sitta/tirmidhi.json',
    './data/kutub-sitta/nasai.json',
    './data/kutub-sitta/ibn-majah.json',
    './tabib_data.js?v=athar-istikhara-v1',
    './tabib_new_fiches_data.js?v=athar-tabib-12-v1',
    './adhkar_data.js?v=athar-adhkar-sources-v1',
    './js/composables/useFavorites.js',
    './js/composables/useSettings.js',
    './js/timeline-chronology.js?v=athar-timeline-v2',
    './js/components/TimelineView.js?v=athar-timeline-intuitive-v1',
    './js/components/LibraryView.js?v=athar-library-numbered-v1',
    './js/components/GlossaryView.js',
    './js/components/UssulView.js?v=athar-usul-refined-v1',
    './js/components/HadithsView.js?v=athar-abu-dawud-50-v2',
    './js/components/HadithReaderView.js?v=athar-abu-dawud-50-reader-v1',
    './js/components/TabibView.js?v=athar-tabib-12-v1',
    './js/components/TabibDetailView.js?v=athar-tabib-no-essence-v1',
    './js/components/AdhkarView.js?v=athar-adhkar-sources-v1',
    './js/components/AdhkarReaderView.js',
    './css/tasbih-pro.css?v=athar-pro-v81-tabib-no-essence-v1',
    './css/timeline-pro.css?v=athar-pro-v81-tabib-no-essence-v1',
    './css/fullscreen-global.css?v=athar-pro-v81-tabib-no-essence-v1',
    './css/adhkar-pro.css?v=athar-pro-v81-tabib-no-essence-v1',
    './css/adhkar-calm-reading.css?v=athar-pro-v81-tabib-no-essence-v1',
    './css/hadith-pro.css?v=athar-pro-v81-tabib-no-essence-v1',
    './css/ussul-pro.css?v=athar-pro-v81-tabib-no-essence-v1',
    './css/library-pro.css?v=athar-pro-v81-tabib-no-essence-v1',
    './css/library-stream-numeric.css?v=athar-pro-v81-tabib-no-essence-v1',
    './css/library-immersive-fix.css?v=athar-pro-v81-tabib-no-essence-v1',
    './css/mobile-pro.css?v=athar-pro-v81-tabib-no-essence-v1',
    './css/interaction-stability.css?v=athar-pro-v81-tabib-no-essence-v1',
    './css/immersive-only.css?v=athar-pro-v81-tabib-no-essence-v1',
    './css/tasbih-simple.css?v=athar-pro-v81-tabib-no-essence-v1',
    './js/components/VueSafeIcons.js?v=athar-pro-v81-tabib-no-essence-v1',
    './js/components/AtharLensBridge.js?v=athar-pro-v81-tabib-no-essence-v1',
    './js/components/GlobalFullscreen.js?v=athar-pro-v81-tabib-no-essence-v1',
    './js/components/MobileExperience.js?v=athar-pro-v81-tabib-no-essence-v1',
    './js/components/ThemeBridge.js?v=athar-pro-v81-tabib-no-essence-v1',
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
