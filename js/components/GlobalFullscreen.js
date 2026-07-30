// Athar Pro — mode immersif global avec navigation intégrée
(() => {
    const ROOT_CLASS = 'athar-app-fullscreen';
    const STORAGE_KEY = 'athar_immersive_last_view';
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
    ];

    let fallbackActive = false;
    let button = null;
    let exitButton = null;
    let menuButton = null;
    let currentBadge = null;
    let drawer = null;
    let backdrop = null;
    let currentView = localStorage.getItem(STORAGE_KEY) || 'home';

    const refreshIcons = () => setTimeout(() => window.lucide?.createIcons(), 20);
    const isActive = () => Boolean(document.fullscreenElement) || fallbackActive;
    const normalize = value => String(value || '').replace(/\s+/g, ' ').trim().toLowerCase();
    const allItems = NAV_GROUPS.flatMap(group => group.items.map(item => ({ view: item[0], label: item[1], icon: item[2] })));

    const markLayout = () => {
        const app = document.getElementById('app');
        if (!app) return;
        const header = app.querySelector(':scope > header');
        const frame = header?.nextElementSibling;
        const sidebar = frame?.querySelector(':scope > aside');
        header?.classList.add('athar-global-header');
        frame?.classList.add('athar-global-mainframe');
        sidebar?.classList.add('athar-global-sidebar');
    };

    const setCurrentView = (view, label) => {
        currentView = view || currentView;
        localStorage.setItem(STORAGE_KEY, currentView);
        const item = allItems.find(entry => entry.view === currentView);
        const title = label || item?.label || 'Athar Pro';
        if (currentBadge) currentBadge.querySelector('span').textContent = title;
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
        document.documentElement.classList.remove('athar-immersive-menu-open');
    };

    const openDrawer = () => {
        if (!isActive()) return;
        drawer?.classList.add('is-open');
        backdrop?.classList.add('is-open');
        menuButton?.setAttribute('aria-expanded', 'true');
        document.documentElement.classList.add('athar-immersive-menu-open');
        drawer?.querySelector('.is-active')?.scrollIntoView({ block: 'nearest' });
    };

    const toggleDrawer = () => drawer?.classList.contains('is-open') ? closeDrawer() : openDrawer();

    const findVueNavigationButton = label => {
        const wanted = normalize(label);
        const candidates = [...document.querySelectorAll('#app aside button, #app [class*="md:hidden"] button')];
        return candidates.find(candidate => normalize(candidate.textContent) === wanted)
            || candidates.find(candidate => normalize(candidate.textContent).includes(wanted));
    };

    const navigate = (view, label) => {
        closeDrawer();
        setCurrentView(view, label);
        const target = findVueNavigationButton(label);
        if (target) {
            target.click();
        } else {
            window.dispatchEvent(new CustomEvent('athar:navigate', { detail: { view, label, immersive: true } }));
        }
        setTimeout(() => {
            markLayout();
            setCurrentView(view, label);
            refreshIcons();
        }, 80);
    };

    const syncCurrentFromApp = () => {
        const buttons = [...document.querySelectorAll('#app aside button')];
        const activeButton = buttons.find(node => {
            const classes = node.className || '';
            return classes.includes('bg-brand-dark') || classes.includes('bg-brand-gold') || classes.includes('dark:bg-white');
        });
        if (!activeButton) return;
        const label = normalize(activeButton.textContent);
        const item = allItems.find(entry => label.includes(normalize(entry.label)));
        if (item) setCurrentView(item.view, item.label);
    };

    const renderState = () => {
        const active = isActive();
        document.documentElement.classList.toggle(ROOT_CLASS, active);
        if (button) {
            button.setAttribute('aria-pressed', String(active));
            button.title = active ? 'Quitter le mode immersif' : 'Mode immersif';
            button.innerHTML = `<i data-lucide="${active ? 'minimize-2' : 'maximize-2'}"></i><span class="sr-only">${active ? 'Quitter le mode immersif' : 'Activer le mode immersif'}</span>`;
        }
        [exitButton, menuButton, currentBadge].forEach(node => { if (node) node.hidden = !active; });
        if (!active) closeDrawer();
        syncCurrentFromApp();
        refreshIcons();
    };

    const exit = async () => {
        fallbackActive = false;
        closeDrawer();
        if (document.fullscreenElement && document.exitFullscreen) {
            try { await document.exitFullscreen(); } catch (_) {}
        }
        renderState();
    };

    const enter = async () => {
        markLayout();
        syncCurrentFromApp();
        try {
            if (document.documentElement.requestFullscreen) {
                await document.documentElement.requestFullscreen({ navigationUI: 'hide' });
                fallbackActive = false;
            } else {
                fallbackActive = true;
            }
        } catch (_) {
            fallbackActive = true;
        }
        renderState();
    };

    const toggle = () => isActive() ? exit() : enter();

    const buildDrawer = () => {
        if (document.getElementById('athar-immersive-drawer')) return;
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
            <div class="athar-immersive-drawer-foot"><span>Ctrl + Maj + F</span><small>Activer ou quitter</small></div>`;
        drawer.querySelector('[data-close-drawer]').addEventListener('click', closeDrawer);
        drawer.querySelectorAll('[data-athar-view]').forEach(node => {
            node.addEventListener('click', () => navigate(node.dataset.atharView, node.dataset.label));
        });
        document.body.appendChild(drawer);
    };

    const inject = () => {
        markLayout();
        const header = document.querySelector('#app > header');
        const actions = header?.querySelector('.flex.items-center.gap-1, .flex.items-center.gap-3');
        if (actions && !document.getElementById('athar-fullscreen-toggle')) {
            button = document.createElement('button');
            button.id = 'athar-fullscreen-toggle';
            button.type = 'button';
            button.className = 'athar-fullscreen-toggle';
            button.addEventListener('click', toggle);
            actions.insertBefore(button, actions.firstChild);
        } else button = document.getElementById('athar-fullscreen-toggle');

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
            currentBadge = document.createElement('div');
            currentBadge.id = 'athar-immersive-current';
            currentBadge.className = 'athar-immersive-current';
            currentBadge.innerHTML = '<i data-lucide="sparkles"></i><span>Athar Pro</span>';
            document.body.appendChild(currentBadge);
        } else currentBadge = document.getElementById('athar-immersive-current');

        if (!document.getElementById('athar-fullscreen-exit')) {
            exitButton = document.createElement('button');
            exitButton.id = 'athar-fullscreen-exit';
            exitButton.type = 'button';
            exitButton.className = 'athar-fullscreen-exit';
            exitButton.innerHTML = '<i data-lucide="minimize-2"></i><span>Quitter</span>';
            exitButton.addEventListener('click', exit);
            document.body.appendChild(exitButton);
        } else exitButton = document.getElementById('athar-fullscreen-exit');

        buildDrawer();
        renderState();
    };

    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) fallbackActive = false;
        renderState();
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && drawer?.classList.contains('is-open')) {
            event.preventDefault();
            closeDrawer();
            return;
        }
        if (event.key === 'Escape' && fallbackActive) exit();
        if (event.key.toLocaleLowerCase() === 'f' && event.ctrlKey && event.shiftKey) {
            event.preventDefault();
            toggle();
        }
        if (event.key.toLocaleLowerCase() === 'm' && event.ctrlKey && isActive()) {
            event.preventDefault();
            toggleDrawer();
        }
    });

    const observer = new MutationObserver(() => {
        if (!button?.isConnected) inject();
        else {
            markLayout();
            syncCurrentFromApp();
        }
    });

    const start = () => {
        inject();
        observer.observe(document.getElementById('app') || document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
    else start();

    window.AtharFullscreen = { toggle, enter, exit, isActive, openMenu: openDrawer, navigate };
})();