// Athar — migration définitive de l'ancien point d'entrée V2 vers la Bibliothèque V4.
// Ce fichier reste chargé par config.js pour compatibilité de cache, mais aucune logique V2 n'est montée.
(() => {
    // Le nouveau composant appelle explicitement l'origine Render configurée.
    // On restaure le fetch natif pour supprimer les anciennes réécritures /api/rag du bridge V2.
    if (window.AtharRagApiBridge?.nativeFetch) {
        window.fetch = window.AtharRagApiBridge.nativeFetch;
    }

    const version = 'rag-v4-ui-1';

    if (document.readyState === 'loading') {
        document.write(`<script src="js/components/ScholarLibraryV4View.js?v=${version}"><\/script>`);
        document.write(`<script src="js/components/ScholarV4Bootstrap.js?v=${version}"><\/script>`);
        return;
    }

    const load = (src, id) => new Promise((resolve, reject) => {
        if (document.getElementById(id)) return resolve();
        const script = document.createElement('script');
        script.id = id;
        script.src = `${src}?v=${version}`;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });

    load('js/components/ScholarLibraryV4View.js', 'athar-scholar-library-v4-view')
        .then(() => load('js/components/ScholarV4Bootstrap.js', 'athar-scholar-v4-bootstrap'))
        .catch(error => console.error('[Athar V4] Chargement de la bibliothèque impossible.', error));
})();
