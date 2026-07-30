// Athar Pro — orchestration de l'expérience mobile
(() => {
    const MOBILE_QUERY = window.matchMedia('(max-width: 767px)');
    const VIEW_LABELS = {
        home: 'Accueil',
        library: 'Bibliothèque',
        timeline: 'Frise Chrono',
        glossary: 'Lexique',
        hadiths: 'Hadiths',
        tabib: 'Tabib Al-Qulub',
        adhkar: 'Al-Adhkar',
        tasbih: 'Tasbih',
        transmission: 'Transmission',
        atlas: 'Atlas Interactif',
        ussul: 'Oussoul Al-Fiqh',
        constellation: 'Constellation',
        eloquence: 'Éloquence',
        roots: 'Racines',
        scriptorium: 'Scriptorium',
        diwan: 'Diwan Sonore',
        scholars_map: 'Atlas Savants',
        mosque: 'Mosquée 3D',
        history_nights: 'Nuits Histoire',
        isnad: "Chaîne d'Or",
        currency: 'Dinar & Dirham',
        astronomy: 'Ciel Anciens',
        brahine: 'Al-Brahine',
        faqih: 'Atelier Faqih',
        balance: 'Balance Actions',
        memory: 'Palais Mémoire'
    };
    const DOCK_ITEMS = [
        ['home', 'Accueil', 'home'],
        ['library', 'Bibliothèque', 'library'],
        ['hadiths', 'Hadiths', 'scroll-text'],
        ['ussul', 'Oussoul', 'scale'],
        ['menu', 'Menu', 'menu']
    ];

    let dock = null;
    let observer = null;
    let scheduled = false;
    let activeView = 'home';
    let baseViewportHeight = window.innerHeight;

    const normalize = value => String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();

    const isVisible = node => {
        if (!node || !node.isConnected) return false;
        const style = window.getComputedStyle(node);
        if (style.display === 'none' || style.visibility === 'hidden') return false;
        const rect = node.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
    };

    const markShell = () => {
        const app = document.getElementById('app');
        if (!app) return false;
        const header = app.querySelector(':scope > header');
        const frame = header?.nextElementSibling;
        const main = frame?.querySelector(':scope > main');
        header?.classList.add('athar-global-header');
        frame?.classList.add('athar-global-mainframe');
        main?.classList.add('athar-global-main');

        if (frame) {
            [...frame.children].forEach(node => {
                if (!(node instanceof HTMLElement)) return;
                const classes = node.classList;
                if (classes.contains('absolute') && classes.contains('inset-0') && classes.contains('z-50')) {
                    node.classList.add('athar-native-mobile-menu');
                }
            });
        }
        return Boolean(header && frame && main);
    };

    const findSidebarButton = view => {
        const wanted = normalize(VIEW_LABELS[view]);
        if (!wanted) return null;
        const buttons = [...document.querySelectorAll('#app aside button')];
        return buttons.find(button => normalize(button.textContent) === wanted)
            || buttons.find(button => normalize(button.textContent).includes(wanted));
    };

    const findMobileMenuButton = () => {
        const header = document.querySelector('#app > header');
        if (!header) return null;
        return [...header.querySelectorAll('button')].find(button => button.querySelector('[data-lucide="menu"]')) || null;
    };

    const navigate = view => {
        const target = findSidebarButton(view);
        if (target) {
            target.click();
            activeView = view;
            scheduleSync();
            return;
        }
        window.dispatchEvent(new CustomEvent('athar:navigate', {
            detail: { view, label: VIEW_LABELS[view], mobile: true }
        }));
    };

    const openMenu = () => {
        const button = findMobileMenuButton();
        if (button) button.click();
    };

    const inferViewFromSidebar = () => {
        const buttons = [...document.querySelectorAll('#app aside button')];
        const active = buttons.find(button => {
            const classes = String(button.className || '');
            return classes.includes('bg-brand-dark')
                || classes.includes('bg-brand-gold')
                || classes.includes('dark:bg-white');
        });
        if (!active) return null;
        const label = normalize(active.textContent);
        return Object.entries(VIEW_LABELS).find(([, value]) => label.includes(normalize(value)))?.[0] || null;
    };

    const inferViewFromContent = () => {
        const main = document.querySelector('#app main');
        if (!main) return null;
        const markers = [
            ['library', '.library-pro-root'],
            ['ussul', '.ussul-pro-root'],
            ['hadiths', '.hadith-pro-root, .hadiths-pro-root'],
            ['timeline', '.timeline-pro-container'],
            ['transmission', '.transmission-view, .transmission-pro-root'],
            ['atlas', '.atlas-view, .atlas-pro-root'],
            ['tasbih', '.tasbih-pro-root'],
            ['adhkar', '.adhkar-pro-root'],
            ['home', '.ap-home']
        ];
        for (const [view, selector] of markers) {
            const node = main.querySelector(selector);
            if (isVisible(node)) return view;
        }
        return null;
    };

    const isDetailView = () => {
        const main = document.querySelector('#app main');
        if (!main) return false;
        const backButton = [...main.querySelectorAll('button[aria-label]')].find(button => {
            const label = normalize(button.getAttribute('aria-label'));
            return isVisible(button) && (label.startsWith('retour') || label.includes('fermer le lecteur'));
        });
        if (backButton) return true;
        const ussulStudy = main.querySelector('.ussul-pro-study');
        if (isVisible(ussulStudy)) return true;
        return false;
    };

    const setActiveDockItem = view => {
        if (!dock) return;
        dock.querySelectorAll('[data-mobile-view]').forEach(button => {
            const active = button.dataset.mobileView === view;
            button.classList.toggle('is-active', active);
            button.setAttribute('aria-current', active ? 'page' : 'false');
        });
    };

    const updateViewport = () => {
        const visualHeight = window.visualViewport?.height || window.innerHeight;
        const visualTop = window.visualViewport?.offsetTop || 0;
        if (!document.documentElement.classList.contains('athar-keyboard-open')) {
            baseViewportHeight = Math.max(baseViewportHeight, window.innerHeight, visualHeight);
        }
        document.documentElement.style.setProperty('--athar-viewport-height', `${Math.round(visualHeight)}px`);
        document.documentElement.style.setProperty('--athar-visual-offset-top', `${Math.round(visualTop)}px`);
        const keyboardOpen = MOBILE_QUERY.matches && (baseViewportHeight - visualHeight > 150);
        document.documentElement.classList.toggle('athar-keyboard-open', keyboardOpen);
    };

    const sync = () => {
        scheduled = false;
        if (!markShell()) return;
        const html = document.documentElement;
        html.classList.toggle('athar-mobile-shell', MOBILE_QUERY.matches);
        const inferred = inferViewFromSidebar() || inferViewFromContent();
        if (inferred) activeView = inferred;
        const detail = isDetailView();
        html.classList.toggle('athar-mobile-detail', detail);
        html.dataset.atharView = activeView;
        if (dock) {
            dock.hidden = !MOBILE_QUERY.matches || detail || html.classList.contains('athar-app-fullscreen') || html.classList.contains('athar-keyboard-open');
            setActiveDockItem(activeView);
        }
        window.lucide?.createIcons();
    };

    const scheduleSync = () => {
        if (scheduled) return;
        scheduled = true;
        window.requestAnimationFrame(sync);
    };

    const buildDock = () => {
        const existing = document.getElementById('athar-mobile-dock');
        if (existing) {
            dock = existing;
            return;
        }
        dock = document.createElement('nav');
        dock.id = 'athar-mobile-dock';
        dock.className = 'athar-mobile-dock';
        dock.setAttribute('aria-label', 'Navigation mobile principale');
        dock.innerHTML = DOCK_ITEMS.map(([view, label, icon]) => `
            <button type="button" ${view === 'menu' ? 'data-mobile-menu' : `data-mobile-view="${view}"`} aria-label="${label}">
                <i data-lucide="${icon}"></i>
                <span>${label}</span>
            </button>`).join('');
        dock.querySelectorAll('[data-mobile-view]').forEach(button => {
            button.addEventListener('click', () => navigate(button.dataset.mobileView));
        });
        dock.querySelector('[data-mobile-menu]')?.addEventListener('click', openMenu);
        document.body.appendChild(dock);
    };

    const start = () => {
        buildDock();
        updateViewport();
        sync();
        observer = new MutationObserver(scheduleSync);
        const app = document.getElementById('app');
        if (app) observer.observe(app, { subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'style'] });

        MOBILE_QUERY.addEventListener?.('change', () => {
            updateViewport();
            scheduleSync();
        });
        window.addEventListener('resize', () => {
            updateViewport();
            scheduleSync();
        }, { passive: true });
        window.addEventListener('orientationchange', () => {
            baseViewportHeight = window.innerHeight;
            window.setTimeout(() => {
                updateViewport();
                scheduleSync();
            }, 180);
        }, { passive: true });
        window.visualViewport?.addEventListener('resize', () => {
            updateViewport();
            scheduleSync();
        }, { passive: true });
        window.visualViewport?.addEventListener('scroll', updateViewport, { passive: true });
        document.addEventListener('fullscreenchange', scheduleSync);
        window.addEventListener('athar:view-changed', event => {
            if (event.detail?.view) activeView = event.detail.view;
            scheduleSync();
        });
    };

    window.addEventListener('beforeunload', () => observer?.disconnect(), { once: true });
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
    else start();

    window.AtharMobile = { sync: scheduleSync, navigate, openMenu, updateViewport };
})();
