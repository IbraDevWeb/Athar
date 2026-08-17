const CACHE_VERSION = 'athar-pro-v39-safe-1';
const APP_SHELL = [
    './',
    './index.html',
    './research-library.html',
    './manifest.json',
    './css/style.css',
    './css/transmission.css?v=athar-pro-v39-safe-1',
    './css/atlas.css?v=athar-pro-v39-safe-1',
    './css/atlas-layout-fix.css?v=athar-pro-v39-safe-1',
    './css/scholar-atlas.css?v=athar-pro-v39-safe-1',
    './css/scholar-atlas-expansion.css?v=athar-pro-v39-safe-1',
    './css/constellation-base.css?v=athar-pro-v39-safe-1',
    './css/constellation-content.css?v=athar-pro-v39-safe-1',
    './css/constellation-overlays.css?v=athar-pro-v39-safe-1',
    './css/constellation-study.css?v=athar-pro-v39-safe-1',
    './css/tasbih-pro.css?v=athar-pro-v39-safe-1',
    './css/timeline-pro.css?v=athar-pro-v39-safe-1',
    './css/fullscreen-global.css?v=athar-pro-v39-safe-1',
    './css/adhkar-pro.css?v=athar-pro-v39-safe-1',
    './css/hadith-pro.css?v=athar-pro-v39-safe-1',
    './css/ussul-pro.css?v=athar-pro-v39-safe-1',
    './css/ussul-immersive-fix.css?v=athar-pro-v39-safe-1',
    './css/library-pro.css?v=athar-pro-v39-safe-1',
    './css/library-immersive-fix.css?v=athar-pro-v39-safe-1',
    './css/mobile-pro.css?v=athar-pro-v39-safe-1',
    './css/interaction-stability.css?v=athar-pro-v39-safe-1',
    './css/ux-v39-safe.css?v=athar-ux-v39-safe-1',
    './css/ancient-sky.css?v=athar-pro-v39-safe-1',
    './css/history-nights.css?v=athar-pro-v39-safe-1',
    './css/history-nights-scroll.css?v=athar-pro-v39-safe-1',
    './css/scriptorium.css?v=athar-pro-v39-safe-1',
    './css/root-tree.css?v=athar-pro-v39-safe-1',
    './css/golden-chain.css?v=athar-pro-v39-safe-1',
    './css/athar-lens.css?v=athar-pro-v39-safe-1',
    './css/athar-research-v5.css?v=athar-research-v6-ui-1',
    './css/athar-research-synthesis.css?v=athar-research-synthesis-1',
    './css/research-library-v2.css?v=athar-reader-v3',
    './js/config.js',
    './js/app.js',
    './js/composables/useSettings.js',
    './js/components/VueSafeIcons.js?v=athar-pro-v39-safe-1',
    './js/components/AtharLensBridge.js?v=athar-pro-v39-safe-1',
    './js/components/AtharLens.js?v=athar-pro-v39-safe-1',
    './astronomy_data.js?v=athar-pro-v39-safe-1',
    './js/components/AncientSkyView.js?v=athar-pro-v39-safe-1',
    './history_nights_data.js?v=athar-pro-v39-safe-1',
    './js/components/HistoryNightsView.js?v=athar-pro-v39-safe-1',
    './scriptorium_data.js?v=athar-pro-v39-safe-1',
    './js/components/ScriptoriumView.js?v=athar-pro-v39-safe-1',
    './roots_data.js?v=athar-pro-v39-safe-1',
    './js/components/RootTreeView.js?v=athar-pro-v39-safe-1',
    './isnad_data.js?v=athar-pro-v39-safe-1',
    './js/components/GoldenChainView.js?v=athar-pro-v39-safe-1',
    './js/components/ScholarLibraryV4View.js?v=athar-research-v6-ui-1',
    './js/components/ScholarSynthesisBridge.js?v=athar-research-v6-ui-1',
    './js/components/ScholarV4Bootstrap.js?v=athar-research-v6-ui-1',
    './js/research-library-v2.js?v=athar-reader-v3',
    './js/components/AstronomyBootstrap.js?v=athar-pro-v39-safe-1',
    './js/components/LibraryView.js',
    './js/components/ReaderView.js',
    './biographies_data.js',
    './js/components/TasbihView.js',
    './js/components/TimelineView.js',
    './js/components/AdhkarView.js',
    './js/components/HadithsView.js',
    './js/components/HadithReaderView.js',
    './js/components/UssulView.js',
    './ussul_data.js',
    './hadiths_data.js',
    './adhkar_data.js',
    './js/components/GlobalFullscreen.js?v=athar-pro-v39-safe-1',
    './js/ux-v39-safe.js?v=athar-ux-v39-safe-1',
    './js/components/MobileExperience.js?v=athar-pro-v39-safe-1',
    './js/components/ThemeBridge.js?v=athar-pro-v39-safe-1',
    './js/components/TransmissionView.js?v=athar-pro-v39-safe-1',
    './transmission_data.js?v=athar-pro-v39-safe-1',
    './js/components/AtlasView.js?v=athar-pro-v39-safe-1',
    './atlas_data.js?v=athar-pro-v39-safe-1',
    './js/components/ToolView.js?v=athar-pro-v39-safe-1',
    './js/components/ScholarAtlasExpansionPatch.js?v=athar-pro-v39-safe-1',
    './scholar_atlas_core.js?v=athar-pro-v39-safe-1',
    './scholar_atlas_traditions.js?v=athar-pro-v39-safe-1',
    './scholar_atlas_thought.js?v=athar-pro-v39-safe-1',
    './scholar_atlas_cities_expansion.js?v=athar-pro-v39-safe-1',
    './scholar_atlas_women_1.js?v=athar-pro-v39-safe-1',
    './scholar_atlas_women_2.js?v=athar-pro-v39-safe-1',
    './scholar_atlas_women_3.js?v=athar-pro-v39-safe-1',
    './scholar_atlas_women_4.js?v=athar-pro-v39-safe-1',
    './scholar_atlas_men_law.js?v=athar-pro-v39-safe-1',
    './scholar_atlas_men_hadith_tafsir.js?v=athar-pro-v39-safe-1',
    './scholar_atlas_men_qiraat_language.js?v=athar-pro-v39-safe-1',
    './scholar_atlas_men_science_history.js?v=athar-pro-v39-safe-1',
    './scholar_atlas_enrichment.js?v=athar-pro-v39-safe-1',
    './js/components/ConstellationBootstrap.js?v=athar-pro-v39-safe-1',
    './js/components/ConstellationCore.js?v=athar-pro-v39-safe-1',
    './js/components/ConstellationTemplate.js?v=athar-pro-v39-safe-1',
    './constellation_part1.js?v=athar-pro-v39-safe-1',
    './constellation_part2.js?v=athar-pro-v39-safe-1',
    './constellation_part3.js?v=athar-pro-v39-safe-1',
    './constellation_part4.js?v=athar-pro-v39-safe-1',
    './constellation_links.js?v=athar-pro-v39-safe-1'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then(cache => Promise.allSettled(APP_SHELL.map(url => cache.add(url))))
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

    if (url.pathname.endsWith('/rag/runtime.json') || url.pathname.endsWith('/rag/remote.json')) {
        event.respondWith(
            fetch(request, { cache: 'no-store' }).catch(() => new Response('', {
                status: 404,
                headers: { 'Cache-Control': 'no-store' }
            }))
        );
        return;
    }

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
