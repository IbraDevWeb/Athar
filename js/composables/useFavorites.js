// Fichier: js/composables/useFavorites.js

/**
 * Composable pour gérer la logique des favoris.
 * Il n'utilise pas d'imports/exports car nous n'avons pas d'étape de build.
 * @param {Vue.Ref} settings - L'objet réactif des paramètres de l'application.
 * @returns {object} - Un objet contenant l'état et les fonctions liés aux favoris.
 */
function useFavorites(settings) {
    const { ref, computed } = Vue;

    // Le filtre pour la vue (afficher tout ou juste les favoris)
    const viewFilter = ref('all'); // 'all' ou 'favorites'

    /**
     * Vérifie si un chapitre est dans les favoris.
     * @param {string|number} id - L'ID du chapitre.
     * @returns {boolean}
     */
    const isFavorite = (id) => {
        return settings.value.favorites.includes(id);
    };

    /**
     * Ajoute ou retire un chapitre des favoris.
     * @param {string|number} id - L'ID du chapitre.
     * @returns {string} - 'added' si ajouté, 'removed' si retiré.
     */
    const toggleFavorite = (id) => {
        const index = settings.value.favorites.indexOf(id);
        if (index === -1) {
            settings.value.favorites.push(id);
            return 'added';
        } else {
            settings.value.favorites.splice(index, 1);
            return 'removed';
        }
    };

    /**
     * Bascule le filtre de la vue pour afficher/masquer les favoris.
     */
    const toggleFilterFavorite = () => {
        viewFilter.value = viewFilter.value === 'favorites' ? 'all' : 'favorites';
    };

    // On retourne les fonctions et états pour qu'ils soient utilisables dans app.js
    return {
        viewFilter,
        isFavorite,
        toggleFavorite,
        toggleFilterFavorite,
    };
}
