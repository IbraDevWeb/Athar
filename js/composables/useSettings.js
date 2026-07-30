/**
 * Gère la logique des paramètres d'affichage (thème, taille de police, langue).
 * @param {import('vue').Ref<object>} settingsRef - Le ref contenant l'objet de paramètres global de l'application.
 * @returns {object} Les propriétés computed et les méthodes pour les modifier.
 */
function useSettings(settingsRef) {
    const SETTINGS_KEY = 'athar_settings';

    // --- COMPUTED PROPS ---
    const darkMode = Vue.computed(() => Boolean(settingsRef.value.darkMode));
    const fontSize = Vue.computed(() => settingsRef.value.fontSize);
    const langue = Vue.computed(() => settingsRef.value.langue || 'fr');

    const updateThemeMeta = (dark) => {
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', dark ? '#070707' : '#f9f7f2');
        document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
    };

    const persistSettings = () => {
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settingsRef.value));
        } catch (error) {
            console.warn('Impossible de mémoriser les paramètres Athar :', error);
        }
    };

    /**
     * Point d'entrée unique du thème. La classe DOM est appliquée immédiatement,
     * sans attendre le watcher Vue, afin que les boutons normal et immersif aient
     * exactement le même comportement.
     */
    const setDarkMode = (enabled, source = 'app') => {
        const next = Boolean(enabled);
        settingsRef.value.darkMode = next;
        document.documentElement.classList.toggle('dark', next);
        updateThemeMeta(next);
        persistSettings();
        window.dispatchEvent(new CustomEvent('athar:theme-changed', {
            detail: { darkMode: next, source }
        }));
        return next;
    };

    const toggleDarkMode = (source = 'app') => setDarkMode(!Boolean(settingsRef.value.darkMode), source);

    const adjustFontSize = () => {
        settingsRef.value.fontSize = settingsRef.value.fontSize >= 24 ? 16 : settingsRef.value.fontSize + 2;
    };

    const setLangue = (lang) => {
        if (['fr', 'ar'].includes(lang)) settingsRef.value.langue = lang;
    };

    // API stable utilisée par le mode immersif : aucun clic simulé sur un bouton caché.
    window.AtharTheme = {
        isDark: () => Boolean(settingsRef.value.darkMode),
        set: (enabled, source = 'external') => setDarkMode(enabled, source),
        toggle: (source = 'external') => toggleDarkMode(source),
        sync: () => setDarkMode(Boolean(settingsRef.value.darkMode), 'sync')
    };

    return {
        darkMode,
        fontSize,
        langue,
        toggleDarkMode,
        setDarkMode,
        adjustFontSize,
        setLangue
    };
}
