// Athar Pro — pont fiable entre le thème Vue et les commandes immersives
(() => {
    let retryTimer = null;
    let observer = null;

    const themeApi = () => window.AtharTheme;

    const updateButton = () => {
        const button = document.getElementById('athar-immersive-theme');
        const api = themeApi();
        if (!button || !api) return false;

        const dark = api.isDark();
        const label = dark ? 'Passer en mode clair' : 'Passer en mode sombre';
        button.title = label;
        button.setAttribute('aria-label', label);
        button.setAttribute('aria-pressed', String(dark));
        button.innerHTML = `<i data-lucide="${dark ? 'sun' : 'moon'}"></i><span>${dark ? 'Clair' : 'Sombre'}</span>`;
        setTimeout(() => window.lucide?.createIcons(), 0);
        return true;
    };

    const handleImmersiveTheme = (event) => {
        const button = event.target.closest?.('#athar-immersive-theme');
        if (!button) return;

        const api = themeApi();
        if (!api) return;

        // L'ancien contrôleur utilisait un clic simulé sur le bouton Vue caché.
        // On l'empêche de s'exécuter et on appelle directement la source de vérité.
        event.preventDefault();
        event.stopImmediatePropagation();
        api.toggle('immersive');
        updateButton();
    };

    const handleShortcut = (event) => {
        if (!(event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'd')) return;
        if (!document.documentElement.classList.contains('athar-app-fullscreen')) return;

        const api = themeApi();
        if (!api) return;

        event.preventDefault();
        event.stopImmediatePropagation();
        api.toggle('immersive-shortcut');
        updateButton();
    };

    const install = (attempt = 0) => {
        const ready = Boolean(themeApi() && document.getElementById('athar-immersive-theme'));
        if (!ready) {
            if (attempt < 80) retryTimer = setTimeout(() => install(attempt + 1), 100);
            return;
        }

        document.addEventListener('click', handleImmersiveTheme, true);
        document.addEventListener('keydown', handleShortcut, true);
        window.addEventListener('athar:theme-changed', updateButton);
        updateButton();

        observer = new MutationObserver(() => updateButton());
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        if (window.AtharFullscreen) {
            window.AtharFullscreen.toggleTheme = () => themeApi()?.toggle('immersive-api');
        }
    };

    window.addEventListener('beforeunload', () => {
        clearTimeout(retryTimer);
        observer?.disconnect();
        document.removeEventListener('click', handleImmersiveTheme, true);
        document.removeEventListener('keydown', handleShortcut, true);
        window.removeEventListener('athar:theme-changed', updateButton);
    }, { once: true });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => install(), { once: true });
    } else {
        install();
    }
})();
