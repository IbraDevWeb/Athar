/**
 * Gère la logique des paramètres d'affichage (thème, taille de police, langue).
 * @param {import('vue').Ref<object>} settingsRef - Le ref contenant l'objet de paramètres global de l'application.
 * @returns {object} Les propriétés computed (darkMode, fontSize, langue) et les méthodes pour les modifier.
 */
function useSettings(settingsRef) {
    // --- COMPUTED PROPS (Lecture seule) ---
    const darkMode = Vue.computed(() => settingsRef.value.darkMode);
    const fontSize = Vue.computed(() => settingsRef.value.fontSize);
    // Ajout de la langue comme demandé, avec une valeur par défaut.
    const langue = Vue.computed(() => settingsRef.value.langue || 'fr');

    // --- ACTIONS ---
    const toggleDarkMode = () => {
        settingsRef.value.darkMode = !settingsRef.value.darkMode;
    };

    const adjustFontSize = () => {
        settingsRef.value.fontSize = settingsRef.value.fontSize >= 24 ? 16 : settingsRef.value.fontSize + 2;
    };

    const setLangue = (lang) => {
        // S'assure que la langue est valide avant de la changer
        if (['fr', 'ar'].includes(lang)) {
            settingsRef.value.langue = lang;
        }
    };

    // --- EXPORT ---
    return {
        darkMode,
        fontSize,
        langue,
        toggleDarkMode,
        adjustFontSize,
        setLangue,
    };
}
