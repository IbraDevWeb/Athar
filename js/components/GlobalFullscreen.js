// Athar Pro — mode plein écran global
(() => {
    const ROOT_CLASS = 'athar-app-fullscreen';
    let fallbackActive = false;
    let button = null;
    let exitButton = null;
    let hint = null;

    const refreshIcons = () => setTimeout(() => window.lucide?.createIcons(), 20);
    const isActive = () => Boolean(document.fullscreenElement) || fallbackActive;

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

    const renderState = () => {
        const active = isActive();
        document.documentElement.classList.toggle(ROOT_CLASS, active);
        if (button) {
            button.setAttribute('aria-pressed', String(active));
            button.title = active ? 'Quitter le plein écran' : 'Plein écran';
            button.innerHTML = `<i data-lucide="${active ? 'minimize-2' : 'maximize-2'}"></i><span class="sr-only">${active ? 'Quitter le plein écran' : 'Activer le plein écran'}</span>`;
        }
        if (exitButton) exitButton.hidden = !active;
        if (hint) hint.hidden = !active;
        refreshIcons();
    };

    const exit = async () => {
        fallbackActive = false;
        if (document.fullscreenElement && document.exitFullscreen) {
            try { await document.exitFullscreen(); } catch (_) {}
        }
        renderState();
    };

    const enter = async () => {
        markLayout();
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
        } else {
            button = document.getElementById('athar-fullscreen-toggle');
        }

        if (!document.getElementById('athar-fullscreen-exit')) {
            exitButton = document.createElement('button');
            exitButton.id = 'athar-fullscreen-exit';
            exitButton.type = 'button';
            exitButton.className = 'athar-fullscreen-exit';
            exitButton.innerHTML = '<i data-lucide="minimize-2"></i><span>Quitter</span>';
            exitButton.addEventListener('click', exit);
            document.body.appendChild(exitButton);
        } else exitButton = document.getElementById('athar-fullscreen-exit');

        if (!document.getElementById('athar-fullscreen-hint')) {
            hint = document.createElement('div');
            hint.id = 'athar-fullscreen-hint';
            hint.className = 'athar-fullscreen-hint';
            hint.innerHTML = '<i data-lucide="keyboard"></i><span><b>Mode immersif</b><small>Échap ou Ctrl + Maj + F pour quitter</small></span>';
            document.body.appendChild(hint);
            setTimeout(() => hint?.classList.add('is-discreet'), 2600);
        } else hint = document.getElementById('athar-fullscreen-hint');

        renderState();
    };

    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) fallbackActive = false;
        renderState();
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && fallbackActive) exit();
        if (event.key.toLocaleLowerCase() === 'f' && event.ctrlKey && event.shiftKey) {
            event.preventDefault();
            toggle();
        }
    });

    const observer = new MutationObserver(() => {
        if (!button?.isConnected) inject();
        else markLayout();
    });
    const start = () => {
        inject();
        observer.observe(document.getElementById('app') || document.body, { childList: true, subtree: true });
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
    else start();

    window.AtharFullscreen = { toggle, enter, exit, isActive };
})();