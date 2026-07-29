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
    const APP_VERSION = 'athar-pro-v4';

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

    document.title = "Athar Pro — Bibliothèque numérique d'histoire islamique";
    setMeta('meta[name="description"]', "Biographies documentées, hadiths référencés et outils d'étude de l'histoire islamique.");
    setMeta('meta[property="og:title"]', "Athar Pro — Bibliothèque numérique d'histoire islamique");
    setMeta('meta[property="og:description"]', "Explorez des notices historiques, des hadiths référencés et des outils d'étude, avec une méthodologie éditoriale transparente.");

    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) viewport.setAttribute('content', 'width=device-width, initial-scale=1');

    ensureStylesheet(`css/transmission.css?v=${APP_VERSION}`, 'athar-transmission-styles');

    window.addEventListener('load', async () => {
        if (!('serviceWorker' in navigator) || !location.protocol.startsWith('http')) return;

        try {
            const previousVersion = localStorage.getItem('athar_app_version');
            if (previousVersion !== APP_VERSION) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                await Promise.all(registrations.map((registration) => registration.unregister()));
                if ('caches' in window) {
                    const cacheNames = await caches.keys();
                    await Promise.all(cacheNames.filter((name) => name.startsWith('athar-pro-')).map((name) => caches.delete(name)));
                }
                localStorage.setItem('athar_app_version', APP_VERSION);
            }

            await navigator.serviceWorker.register(`./service-worker.js?v=${APP_VERSION}`);
        } catch (error) {
            console.warn('Mise à jour du cache non terminée :', error);
        }
    });
})();