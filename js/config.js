tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                brand: {
                    gold: '#c5a059',
                    'gold-light': '#e6c88a',
                    dark: '#000000',
                    'dark-lighter': '#070707',
                    'dark-accent': '#111111',
                    paper: '#f9f7f2',
                    'paper-dark': '#f0ede6',
                    dim: 'rgba(0,0,0,0.5)'
                }
            },
            fontFamily: {
                serif: ['"Libre Baskerville"', 'serif'],
                display: ['"Cinzel"', 'serif'],
                arabic: ['"Amiri"', 'serif'],
                sans: ['"Inter"', 'sans-serif']
            },
            backgroundImage: {
                grain: "url('https://www.transparenttextures.com/patterns/cream-paper.png')",
                islamic: "url('https://www.transparenttextures.com/patterns/arabesque.png')",
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))'
            },
            boxShadow: {
                glow: '0 0 15px rgba(197, 160, 89, 0.3)',
                card: '0 10px 30px -5px rgba(0, 0, 0, 0.1)',
                'inner-light': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.3)'
            },
            animation: {
                'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                'slide-in-right': 'slideInRight 0.4s ease-out',
                'pulse-slow': 'pulse 3s infinite',
                float: 'float 6s ease-in-out infinite'
            },
            keyframes: {
                fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
                slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
                slideInRight: { '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'translateX(0)' } },
                float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-5px)' } }
            }
        }
    }
};

(() => {
    const APP_VERSION = 'athar-pro-v30';

    const setMeta = (selector, content) => {
        const element = document.querySelector(selector);
        if (element) element.setAttribute('content', content);
    };

    const ensureStylesheet = (href, id) => {
        if (document.getElementById(id)) return;
        const link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    };

    const ensureScript = (src, id) => {
        if (document.getElementById(id)) return;
        const script = document.createElement('script');
        script.id = id;
        script.src = src;
        script.defer = true;
        document.head.appendChild(script);
    };

    const writeEarlyScript = (src, id) => {
        if (document.readyState !== 'loading' || document.getElementById(id)) return;
        document.write(`<script id="${id}" src="${src}?v=${APP_VERSION}"><\/script>`);
    };

    const writeScholarAtlasScript = (src, id) => {
        if (document.readyState !== 'loading' || document.getElementById(id)) return;
        document.write(`<script id="${id}" src="${src}?v=${APP_VERSION}"><\/script>`);
    };

    document.title = "Athar Pro — Bibliothèque numérique d'histoire islamique";
    setMeta('meta[name="description"]', "Biographies documentées, hadiths référencés et outils d'étude de l'histoire islamique.");
    setMeta('meta[property="og:title"]', "Athar Pro — Bibliothèque numérique d'histoire islamique");
    setMeta('meta[property="og:description"]', "Explorez des notices historiques, des hadiths référencés et outils d'étude, avec une méthodologie éditoriale transparente.");

    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) viewport.setAttribute('content', 'width=device-width, initial-scale=1, viewport-fit=cover');

    /* Ponts chargés avant le montage de Vue. */
    writeEarlyScript('js/components/VueSafeIcons.js', 'athar-vue-safe-icons');
    writeEarlyScript('astronomy_data.js', 'athar-astronomy-data');
    writeEarlyScript('js/components/AncientSkyView.js', 'athar-ancient-sky-view');
    writeEarlyScript('history_nights_data.js', 'athar-history-nights-data');
    writeEarlyScript('js/components/HistoryNightsView.js', 'athar-history-nights-view');
    writeEarlyScript('scriptorium_data.js', 'athar-scriptorium-data');
    writeEarlyScript('js/components/ScriptoriumView.js', 'athar-scriptorium-view');
    writeEarlyScript('js/components/AstronomyBootstrap.js', 'athar-tool-extensions-bootstrap');

    ensureStylesheet(`css/transmission.css?v=${APP_VERSION}`, 'athar-transmission-styles');
    ensureStylesheet(`css/atlas.css?v=${APP_VERSION}`, 'athar-atlas-styles');
    ensureStylesheet(`css/atlas-layout-fix.css?v=${APP_VERSION}`, 'athar-atlas-layout-fix');
    ensureStylesheet(`css/scholar-atlas.css?v=${APP_VERSION}`, 'athar-scholar-atlas-styles');
    ensureStylesheet(`css/scholar-atlas-expansion.css?v=${APP_VERSION}`, 'athar-scholar-atlas-expansion');
    ensureStylesheet(`css/constellation-base.css?v=${APP_VERSION}`, 'athar-constellation-base');
    ensureStylesheet(`css/constellation-content.css?v=${APP_VERSION}`, 'athar-constellation-content');
    ensureStylesheet(`css/constellation-overlays.css?v=${APP_VERSION}`, 'athar-constellation-overlays');
    ensureStylesheet(`css/constellation-study.css?v=${APP_VERSION}`, 'athar-constellation-study');
    ensureStylesheet(`css/tasbih-pro.css?v=${APP_VERSION}`, 'athar-tasbih-pro');
    ensureStylesheet(`css/timeline-pro.css?v=${APP_VERSION}`, 'athar-timeline-pro');
    ensureStylesheet(`css/fullscreen-global.css?v=${APP_VERSION}`, 'athar-fullscreen-global');
    ensureStylesheet(`css/adhkar-pro.css?v=${APP_VERSION}`, 'athar-adhkar-pro');
    ensureStylesheet(`css/hadith-pro.css?v=${APP_VERSION}`, 'athar-hadith-pro');
    ensureStylesheet(`css/ussul-pro.css?v=${APP_VERSION}`, 'athar-ussul-pro');
    ensureStylesheet(`css/ussul-immersive-fix.css?v=${APP_VERSION}`, 'athar-ussul-immersive-fix');
    ensureStylesheet(`css/library-pro.css?v=${APP_VERSION}`, 'athar-library-pro');
    ensureStylesheet(`css/library-immersive-fix.css?v=${APP_VERSION}`, 'athar-library-immersive-fix');
    ensureStylesheet(`css/mobile-pro.css?v=${APP_VERSION}`, 'athar-mobile-pro');
    ensureStylesheet(`css/interaction-stability.css?v=${APP_VERSION}`, 'athar-interaction-stability');
    ensureStylesheet(`css/ancient-sky.css?v=${APP_VERSION}`, 'athar-ancient-sky-styles');
    ensureStylesheet(`css/history-nights.css?v=${APP_VERSION}`, 'athar-history-nights-styles');
    ensureStylesheet(`css/history-nights-scroll.css?v=${APP_VERSION}`, 'athar-history-nights-scroll');
    ensureStylesheet(`css/scriptorium.css?v=${APP_VERSION}`, 'athar-scriptorium-styles');

    if (!window.SCHOLAR_ATLAS_DATA) {
        writeScholarAtlasScript('scholar_atlas_core.js', 'athar-scholar-atlas-core');
        writeScholarAtlasScript('scholar_atlas_traditions.js', 'athar-scholar-atlas-traditions');
        writeScholarAtlasScript('scholar_atlas_thought.js', 'athar-scholar-atlas-thought');
        writeScholarAtlasScript('scholar_atlas_cities_expansion.js', 'athar-scholar-atlas-cities-expansion');
        writeScholarAtlasScript('scholar_atlas_women_1.js', 'athar-scholar-atlas-women-1');
        writeScholarAtlasScript('scholar_atlas_women_2.js', 'athar-scholar-atlas-women-2');
        writeScholarAtlasScript('scholar_atlas_women_3.js', 'athar-scholar-atlas-women-3');
        writeScholarAtlasScript('scholar_atlas_women_4.js', 'athar-scholar-atlas-women-4');
        writeScholarAtlasScript('scholar_atlas_men_law.js', 'athar-scholar-atlas-men-law');
        writeScholarAtlasScript('scholar_atlas_men_hadith_tafsir.js', 'athar-scholar-atlas-men-hadith-tafsir');
        writeScholarAtlasScript('scholar_atlas_men_qiraat_language.js', 'athar-scholar-atlas-men-qiraat-language');
        writeScholarAtlasScript('scholar_atlas_men_science_history.js', 'athar-scholar-atlas-men-science-history');
        writeScholarAtlasScript('scholar_atlas_enrichment.js', 'athar-scholar-atlas-enrichment');
    }

    ensureScript(`js/components/ScholarAtlasExpansionPatch.js?v=${APP_VERSION}`, 'athar-scholar-atlas-expansion-patch');
    ensureScript(`js/components/ConstellationBootstrap.js?v=${APP_VERSION}`, 'athar-constellation-bootstrap');
    ensureScript(`js/components/GlobalFullscreen.js?v=${APP_VERSION}`, 'athar-global-fullscreen');
    ensureScript(`js/components/MobileExperience.js?v=${APP_VERSION}`, 'athar-mobile-experience');
    ensureScript(`js/components/ThemeBridge.js?v=${APP_VERSION}`, 'athar-theme-bridge');

    window.addEventListener('load', async () => {
        if (!('serviceWorker' in navigator) || !location.protocol.startsWith('http')) return;
        try {
            const previousVersion = localStorage.getItem('athar_app_version');
            if (previousVersion !== APP_VERSION) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                await Promise.all(registrations.map(registration => registration.unregister()));
                if ('caches' in window) {
                    const cacheNames = await caches.keys();
                    await Promise.all(cacheNames.filter(name => name.startsWith('athar-pro-')).map(name => caches.delete(name)));
                }
                localStorage.setItem('athar_app_version', APP_VERSION);
            }
            await navigator.serviceWorker.register(`./service-worker.js?v=${APP_VERSION}`);
        } catch (error) {
            console.warn('Mise à jour du cache non terminée :', error);
        }
    });
})();
