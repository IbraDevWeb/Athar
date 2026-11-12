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
    const APP_VERSION = 'athar-pro-v58-narrative-reading-01-40-1';

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

    const writeEarlyScript = (src, id, version = APP_VERSION) => {
        if (document.readyState !== 'loading' || document.getElementById(id)) return;
        document.write(`<script id="${id}" src="${src}?v=${version}"><\/script>`);
    };

    document.title = "Athar Pro — Bibliothèque et outils d'étude";
    setMeta('meta[name="description"]', 'Biographies, chronologie, lexique, hadiths, Tabib Al-Qulub, adhkar et tasbih dans Athar Pro.');
    setMeta('meta[property="og:title"]', "Athar Pro — Bibliothèque et outils d'étude");
    setMeta('meta[property="og:description"]', 'Explorez les sept rubriques disponibles dans Athar Pro.');

    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) viewport.setAttribute('content', 'width=device-width, initial-scale=1, viewport-fit=cover');

    // Charger les seules sections publiées d'Athar.
    writeEarlyScript('js/components/VueSafeIcons.js', 'athar-vue-safe-icons');
    writeEarlyScript('js/components/AtharLensBridge.js', 'athar-navigation-bridge');

    ensureStylesheet(`css/tasbih-pro.css?v=${APP_VERSION}`, 'athar-tasbih-pro');
    ensureStylesheet(`css/timeline-pro.css?v=${APP_VERSION}`, 'athar-timeline-pro');
    ensureStylesheet(`css/fullscreen-global.css?v=${APP_VERSION}`, 'athar-fullscreen-global');
    ensureStylesheet(`css/adhkar-pro.css?v=${APP_VERSION}`, 'athar-adhkar-pro');
    ensureStylesheet(`css/hadith-pro.css?v=${APP_VERSION}`, 'athar-hadith-pro');
    ensureStylesheet(`css/library-pro.css?v=${APP_VERSION}`, 'athar-library-pro');
    ensureStylesheet(`css/library-immersive-fix.css?v=${APP_VERSION}`, 'athar-library-immersive-fix');
    ensureStylesheet(`css/mobile-pro.css?v=${APP_VERSION}`, 'athar-mobile-pro');
    ensureStylesheet(`css/interaction-stability.css?v=${APP_VERSION}`, 'athar-interaction-stability');
    ensureStylesheet(`css/immersive-only.css?v=${APP_VERSION}`, 'athar-immersive-only-styles');
    ensureStylesheet(`css/tasbih-simple.css?v=${APP_VERSION}`, 'athar-tasbih-simple-styles');
    ensureStylesheet('css/athar-launch.css?v=athar-public-3', 'athar-launch-styles');

    ensureScript(`js/components/GlobalFullscreen.js?v=${APP_VERSION}`, 'athar-global-fullscreen');
    ensureScript(`js/components/MobileExperience.js?v=${APP_VERSION}`, 'athar-mobile-experience');
    ensureScript(`js/components/ThemeBridge.js?v=${APP_VERSION}`, 'athar-theme-bridge');

    // Supprimer les anciens paramètres du moteur documentaire, sans toucher aux comptes locaux.
    try {
        const obsolete = key => /^athar_(?:rag|research|v40_(?:open_research|research|research_draft))/i.test(key);
        for (const storage of [window.localStorage, window.sessionStorage]) {
            for (let i = storage.length - 1; i >= 0; i--) {
                const key = storage.key(i);
                if (key && obsolete(key)) storage.removeItem(key);
            }
        }
    } catch (_) { /* stockage indisponible */ }
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
            const registration = await navigator.serviceWorker.register(`./service-worker.js?v=${APP_VERSION}`, { updateViaCache: 'none' });
            await registration.update();
        } catch (error) {
            console.warn('Mise à jour du cache non terminée :', error);
        }
    });
})();
