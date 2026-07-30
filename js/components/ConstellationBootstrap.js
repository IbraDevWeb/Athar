// Athar Pro — amorçage autonome de la Constellation
(() => {
    const VERSION = 'athar-pro-v9';
    let app = null;
    let host = null;
    let loading = null;

    const load = (src, id) => new Promise((resolve, reject) => {
        const existing = document.getElementById(id);
        if (existing) {
            if (existing.dataset.loaded === 'true') return resolve();
            existing.addEventListener('load', resolve, { once: true });
            existing.addEventListener('error', reject, { once: true });
            return;
        }
        const script = document.createElement('script');
        script.id = id;
        script.src = `${src}?v=${VERSION}`;
        script.onload = () => { script.dataset.loaded = 'true'; resolve(); };
        script.onerror = () => reject(new Error(`Impossible de charger ${src}`));
        document.head.appendChild(script);
    });

    const ensureAssets = () => {
        if (loading) return loading;
        loading = load('constellation_part1.js', 'constellation-data-1')
            .then(() => load('constellation_part2.js', 'constellation-data-2'))
            .then(() => load('constellation_part3.js', 'constellation-data-3'))
            .then(() => load('constellation_part4.js', 'constellation-data-4'))
            .then(() => load('constellation_links.js', 'constellation-links'))
            .then(() => load('js/components/ConstellationCore.js', 'constellation-core'))
            .then(() => load('js/components/ConstellationTemplate.js', 'constellation-template'));
        return loading;
    };

    const findHost = () => {
        const heading = [...document.querySelectorAll('h1')].find(node => node.textContent.trim() === 'Constellation Coranique');
        return heading?.closest('div.h-full.flex.flex-col') || null;
    };

    const scan = async () => {
        if (host && !host.isConnected) {
            try { app?.unmount(); } catch (_) {}
            app = null;
            host = null;
        }
        if (host) return;
        const target = findHost();
        if (!target || target.dataset.constellationMounted === 'true') return;
        target.dataset.constellationMounted = 'true';
        target.innerHTML = '<div class="constellation-runtime-root"><div class="constellation-loading"><span class="constellation-loader"></span><strong>Construction de la constellation…</strong><small>Chargement des concepts et relations.</small></div></div>';
        try {
            await ensureAssets();
            if (!target.isConnected) return;
            host = target;
            app = Vue.createApp(window.ConstellationApp);
            app.mount(target.querySelector('.constellation-runtime-root'));
        } catch (error) {
            console.error('Constellation:', error);
            target.innerHTML = `<div class="constellation-error"><h2>Constellation indisponible</h2><p>${error.message || 'Erreur de chargement.'}</p><button onclick="location.reload()">Recharger</button></div>`;
        }
    };

    const start = () => {
        new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
        scan();
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
    else start();
})();
