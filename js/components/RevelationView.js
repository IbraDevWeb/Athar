const RevelationView = {
    template: `
    <div class="h-full relative">
        <div id="revelation-map" class="h-full w-full z-0"></div>
        
        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-brand-dark/90 backdrop-blur px-6 py-3 rounded-full shadow-xl border border-brand-gold/30 z-[1000]">
            <span class="font-display font-bold text-brand-dark dark:text-brand-gold text-sm">Carte de la Révélation</span>
        </div>
    </div>
    `,
    props: ['settings'],
    mounted() {
        if (typeof L === 'undefined' || typeof REVELATION_LOCATIONS === 'undefined') return;

        const map = L.map('revelation-map', { zoomControl: false }).setView([24.467, 39.600], 6);
        
        // Tuiles "Gold/Vintage"
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(map);

        // Ajout des marqueurs
        REVELATION_LOCATIONS.forEach(loc => {
            const iconHtml = `<div class="w-8 h-8 bg-brand-dark text-brand-gold rounded-full flex items-center justify-center border-2 border-brand-gold shadow-lg font-bold text-xs"><i class="fa-solid fa-quran"></i></div>`;
            
            const customIcon = L.divIcon({
                html: iconHtml,
                className: 'custom-marker',
                iconSize: [32, 32],
                iconAnchor: [16, 32]
            });

            const marker = L.marker([loc.lat, loc.lng], { icon: customIcon }).addTo(map);
            
            marker.bindPopup(`
                <div class="text-center p-2 font-serif">
                    <h3 class="font-bold text-brand-gold mb-1">${loc.title}</h3>
                    <p class="text-xs italic mb-2">"${loc.verse}"</p>
                    <p class="text-[10px] text-gray-500">${loc.desc}</p>
                </div>
            `);
        });

        // CSS correctif pour le mode sombre
        if (this.settings.darkMode) {
            document.querySelector('.leaflet-layer').style.filter = "invert(100%) hue-rotate(180deg) brightness(0.8) contrast(0.9)";
        }
    }
};