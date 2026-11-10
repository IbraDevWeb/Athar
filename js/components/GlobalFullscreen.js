// Athar Pro — mode immersif global avec navigation et thème intégrés
(() => {
    const ROOT_CLASS = 'athar-app-fullscreen';
    const STORAGE_KEY = 'athar_immersive_last_view';
    const SETTINGS_KEY = 'athar_settings';
    const PUBLISHED_VIEWS = new Set(['home', 'library', 'timeline', 'glossary', 'hadiths', 'tabib', 'adhkar', 'tasbih']);
    const NAV_GROUPS = [
        {
            label: 'Essentiel',
            items: [
                ['home', 'Accueil', 'home'], ['library', 'Bibliothèque', 'library'], ['timeline', 'Frise Chrono', 'clock'],
                ['glossary', 'Lexique', 'book-a'], ['hadiths', 'Hadiths', 'scroll-text'], ['tabib', 'Tabib Al-Qulub', 'heart-pulse'],
                ['adhkar', 'Al-Adhkar', 'sunrise'], ['tasbih', 'Tasbih', 'rotate-cw'], ['transmission', 'Transmission', 'git-fork'],
                ['atlas', 'Atlas Interactif', 'map'], ['ussul', 'Oussoul Al-Fiqh', 'scale']
            ]
        },
        {
            label: 'Étude & Coran',
            items: [
                ['constellation', 'Constellation', 'network'], ['eloquence', 'Éloquence', 'mic-2'], ['roots', 'Racines', 'sprout'],
                ['scriptorium', 'Scriptorium', 'feather'], ['diwan', 'Diwan Sonore', 'headphones']
            ]
        },
        {
            label: 'Histoire & Monde',
            items: [
                ['scholars_map', 'Atlas Savants', 'globe'], ['mosque', 'Mosquée 3D', 'landmark'], ['history_nights', 'Nuits Histoire', 'moon'],
                ['isnad', "Chaîne d'Or", 'link'], ['currency', 'Dinar & Dirham', 'coins'], ['astronomy', 'Ciel Anciens', 'star']
            ]
        },
        {
            label: 'Esprit & Raison',
            items: [
                ['brahine', 'Al-Brahine', 'shield'], ['faqih', 'Atelier Faqih', 'gavel'], ['balance', 'Balance Actions', 'scale'],
                ['memory', 'Palais Mémoire', 'brain-circuit']
            ]
        }
    ].map(group => ({ ...group, items: group.items.filter(([view]) => PUBLISHED_VIEWS.has(view)) }))
     .filter(group => group.items.length > 0);

    let quickButton = null;
    let menuButton = null;
    let themeButton = null;
    let currentBadge = null;
    let drawer = null;
    let backdrop = null;
    let currentView = localStorage.getItem(STORAGE_KEY) || 'home';
    if (!PUBLISHED_VIEWS.has(currentView)) currentView = 'home';
    let retryTimer = null;
    let themeObserver = null;

    const refreshIcons = () => setTimeout(() => window.lucide?.createIcons(), 20);
    // L'affichage immersif fait désormais partie de la page, sans Fullscreen API.
    const isActive = () => true;
    const DETAIL_PARENT = {
        reader: ['library', 'Bibliothèque'],
        'hadith-reader': ['hadiths', 'Hadiths'],
        'adhkar-reader': ['adhkar', 'Al-Adhkar'],
        'tabib-detail': ['tabib', 'Tabib Al-Qulub']
    };
    const DETAIL_LABEL = {
        reader: 'Lecture de biographie',
        'hadith-reader': 'Lecture de hadith',
        'adhkar-reader': 'Lecture d’invocation',
        'tabib-detail': 'Lecture spirituelle'
    };
    const isDark = () => document.documentElement.classList.contains('dark');
    const normalize = value => String(value || '').replace(/\s+/g, ' ').trim().toLowerCase();
    const allItems = NAV_GROUPS.flatMap(group => group.items.map(item => ({ view: item[0], label: item[1], icon: item[2] })));

    const updateThemeMeta = dark => {
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', dark ? '#070707' : '#f9f7f2');
        document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
    };

    const renderThemeState = () => {
        const dark = isDark();
        updateThemeMeta(dark);
        if (!themeButton) return;
        const label = dark ? 'Passer en mode clair' : 'Passer en mode sombre';
        themeButton.title = label;
        themeButton.setAttribute('aria-label', label);
        themeButton.setAttribute('aria-pressed', String(dark));
        themeButton.innerHTML = `<i data-lucide="${dark ? 'sun' : 'moon'}"></i><span>${dark ? 'Clair' : 'Sombre'}</span>`;
        refreshIcons();
    };

    const findNativeThemeButton = () => {
        const candidates = [...document.querySelectorAll('#app > header button')];
        return candidates.find(node => /mode clair|mode sombre/i.test(node.getAttribute('title') || ''))
            || candidates.find(node => node.querySelector('[data-lucide="sun"], [data-lucide="moon"]'))
            || null;
    };

    const persistFallbackTheme = dark => {
        try {
            const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
            localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...saved, darkMode: dark }));
        } catch (_) {}
    };

    const toggleTheme = () => {
        const before = isDark();
        const nativeButton = findNativeThemeButton();
        if (nativeButton) {
            nativeButton.click();
        } else {
            const next = !before;
            document.documentElement.classList.toggle('dark', next);
            persistFallbackTheme(next);
            window.dispatchEvent(new CustomEvent('athar:theme-changed', { detail: { darkMode: next, immersive: true } }));
        }
        setTimeout(() => {
            if (isDark() === before && nativeButton) {
                const next = !before;
                document.documentElement.classList.toggle('dark', next);
                persistFallbackTheme(next);
            }
            renderThemeState();
        }, 40);
    };

    const markLayout = () => {
        const app = document.getElementById('app');
        if (!app) return false;
        const header = app.querySelector(':scope > header');
        const frame = header?.nextElementSibling;
        const sidebar = frame?.querySelector(':scope > aside');
        header?.classList.add('athar-global-header');
        frame?.classList.add('athar-global-mainframe');
        sidebar?.classList.add('athar-global-sidebar');
        return Boolean(header && frame);
    };

    const setCurrentView = (view, label) => {
        currentView = view || currentView;
        localStorage.setItem(STORAGE_KEY, currentView);
        const item = allItems.find(entry => entry.view === currentView);
        const title = label || item?.label || 'Athar Pro';
        if (currentBadge?.querySelector('span')) currentBadge.querySelector('span').textContent = DETAIL_LABEL[view] || title;
        const backTarget = DETAIL_PARENT[view];
        if (quickButton) {
            quickButton.dataset.targetView = backTarget ? backTarget[0] : 'tasbih';
            quickButton.dataset.targetLabel = backTarget ? backTarget[1] : 'Tasbih';
            quickButton.title = backTarget ? 'Retour à ' + backTarget[1] : 'Ouvrir le Tasbih';
            quickButton.setAttribute('aria-label', quickButton.title);
            quickButton.innerHTML = backTarget
                ? '<i data-lucide="arrow-left"></i><span>Retour</span>'
                : '<i data-lucide="rotate-cw"></i><span>Tasbih</span>';
        }
        drawer?.querySelectorAll('[data-athar-view]').forEach(node => {
            const active = node.dataset.atharView === currentView;
            node.classList.toggle('is-active', active);
            node.setAttribute('aria-current', active ? 'page' : 'false');
        });
    };

    const closeDrawer = () => {
        drawer?.classList.remove('is-open');
        backdrop?.classList.remove('is-open');
        menuButton?.setAttribute('aria-expanded', 'false');
        const main = document.querySelector('.athar-global-mainframe > main');
        if (main) main.inert = false;
        document.documentElement.classList.remove('athar-immersive-menu-open');
    };

    const openDrawer = () => {
        if (!isActive()) return;
        drawer?.classList.add('is-open');
        backdrop?.classList.add('is-open');
        menuButton?.setAttribute('aria-expanded', 'true');
        document.documentElement.classList.add('athar-immersive-menu-open');
        const main = document.querySelector('.athar-global-mainframe > main');
        if (main) main.inert = true;
        drawer?.querySelector('.is-active')?.scrollIntoView({ block: 'nearest' });
    };

    const toggleDrawer = () => drawer?.classList.contains('is-open') ? closeDrawer() : openDrawer();

    const navigate = (view, label) => {
        if (!PUBLISHED_VIEWS.has(view)) return;
        closeDrawer();
        window.dispatchEvent(new CustomEvent('athar:navigate', {
            detail: { view, label, immersive: true }
        }));
        setCurrentView(view, label);
        refreshIcons();
    };

    const renderState = () => {
        document.documentElement.classList.add(ROOT_CLASS, 'athar-immersive-only');
        [quickButton, menuButton, themeButton, currentBadge].forEach(node => {
            if (node) node.hidden = false;
        });
        setCurrentView(currentView);
        renderThemeState();
        refreshIcons();
    };
    // Compatibilité : les extensions peuvent appeler ces méthodes sans changer de mode.
    const enter = () => { markLayout(); renderState(); };
    const exit = () => { closeDrawer(); renderState(); };
    const toggle = () => renderState();

    const buildDrawer = () => {
        if (document.getElementById('athar-immersive-drawer')) {
            drawer = document.getElementById('athar-immersive-drawer');
            backdrop = document.getElementById('athar-immersive-backdrop');
            return;
        }

        backdrop = document.createElement('button');
        backdrop.id = 'athar-immersive-backdrop';
        backdrop.className = 'athar-immersive-backdrop';
        backdrop.type = 'button';
        backdrop.setAttribute('aria-label', 'Fermer le menu immersif');
        backdrop.addEventListener('click', closeDrawer);
        document.body.appendChild(backdrop);

        drawer = document.createElement('aside');
        drawer.id = 'athar-immersive-drawer';
        drawer.className = 'athar-immersive-drawer';
        drawer.setAttribute('aria-label', 'Navigation immersive');
        drawer.innerHTML = `
            <div class="athar-immersive-drawer-head">
                <div><b>Athar<span>Pro</span></b><small>Navigation immersive</small></div>
                <button type="button" data-close-drawer aria-label="Fermer"><i data-lucide="x"></i></button>
            </div>
            <nav>${NAV_GROUPS.map(group => `
                <section>
                    <h3>${group.label}</h3>
                    ${group.items.map(([view, label, icon]) => `<button type="button" data-athar-view="${view}" data-label="${label}"><i data-lucide="${icon}"></i><span>${label}</span></button>`).join('')}
                </section>`).join('')}
            </nav>
            <div class="athar-immersive-drawer-foot"><span>Athar Pro</span><small>7 rubriques disponibles</small></div>`;
        drawer.querySelector('[data-close-drawer]')?.addEventListener('click', closeDrawer);
        drawer.querySelectorAll('[data-athar-view]').forEach(node => {
            node.addEventListener('click', () => navigate(node.dataset.atharView, node.dataset.label));
        });
        document.body.appendChild(drawer);
    };

    const inject = () => {
        if (!markLayout()) return false;
        if (!document.getElementById('athar-immersive-menu')) {
            menuButton = document.createElement('button');
            menuButton.id = 'athar-immersive-menu';
            menuButton.type = 'button';
            menuButton.className = 'athar-immersive-menu';
            menuButton.innerHTML = '<i data-lucide="menu"></i><span>Sections</span>';
            menuButton.setAttribute('aria-expanded', 'false');
            menuButton.addEventListener('click', toggleDrawer);
            document.body.appendChild(menuButton);
        } else menuButton = document.getElementById('athar-immersive-menu');

        if (!document.getElementById('athar-immersive-current')) {
            currentBadge = document.createElement('button');
            currentBadge.type = 'button';
            currentBadge.setAttribute('aria-label', "Retour à l'accueil");
            currentBadge.title = "Retour à l'accueil";
            currentBadge.addEventListener('click', () => navigate('home', 'Accueil'));
            currentBadge.id = 'athar-immersive-current';
            currentBadge.className = 'athar-immersive-current';
            currentBadge.innerHTML = '<i data-lucide="sparkles"></i><span>Athar Pro</span>';
            document.body.appendChild(currentBadge);
        } else currentBadge = document.getElementById('athar-immersive-current');

        if (!document.getElementById('athar-immersive-theme')) {
            themeButton = document.createElement('button');
            themeButton.id = 'athar-immersive-theme';
            themeButton.type = 'button';
            themeButton.className = 'athar-immersive-theme';
            themeButton.addEventListener('click', toggleTheme);
            document.body.appendChild(themeButton);
        } else themeButton = document.getElementById('athar-immersive-theme');

        if (!document.getElementById('athar-immersive-quick')) {
            quickButton = document.createElement('button');
            quickButton.id = 'athar-immersive-quick';
            quickButton.type = 'button';
            quickButton.className = 'athar-immersive-quick';
            quickButton.addEventListener('click', () =>
                navigate(quickButton.dataset.targetView || 'tasbih', quickButton.dataset.targetLabel || 'Tasbih')
            );
            document.body.appendChild(quickButton);
        } else quickButton = document.getElementById('athar-immersive-quick');

        buildDrawer();
        renderThemeState();
        renderState();
        return true;
    };

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && drawer?.classList.contains('is-open')) {
            event.preventDefault();
            closeDrawer();
            return;
        }
        if (event.key.toLocaleLowerCase() === 'm' && event.ctrlKey && isActive()) {
            event.preventDefault();
            toggleDrawer();
        }
        if (event.key.toLocaleLowerCase() === 'd' && event.ctrlKey && event.shiftKey && isActive()) {
            event.preventDefault();
            toggleTheme();
        }
    });

    window.addEventListener('athar:theme-changed', renderThemeState);
    window.addEventListener('athar:view-changed', event => {
        const view = event.detail?.view;
        if (!view) return;
        const item = allItems.find(entry => entry.view === view);
        setCurrentView(view, item?.label);
        refreshIcons();
    });
    window.addEventListener('storage', event => {
        if (event.key === SETTINGS_KEY) renderThemeState();
    });

    const start = (attempt = 0) => {
        if (inject()) {
            if (!themeObserver) {
                themeObserver = new MutationObserver(mutations => {
                    if (mutations.some(mutation => mutation.attributeName === 'class')) renderThemeState();
                });
                themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
            }
            return;
        }
        if (attempt < 30) retryTimer = setTimeout(() => start(attempt + 1), 100);
    };

    window.addEventListener('beforeunload', () => {
        clearTimeout(retryTimer);
        themeObserver?.disconnect();
    }, { once: true });
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => start(), { once: true });
    else start();

    window.AtharFullscreen = { toggle, enter, exit, isActive, openMenu: openDrawer, navigate, toggleTheme };
})();