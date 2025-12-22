const AtlasView = {
    props: ['settings'],
    setup(props) {
        const { onMounted, onUnmounted, ref, watch } = Vue;
        
        let map = null;
        let clusterGroup = null;
        let tileLayer = null;
        let fuse = null;

        // État local
        const state = Vue.reactive({
            filter: 'all',
            search: '',
            year: 230,
            story: { active: false, index: 0, list: [] }
        });

        const showPanel = ref(false);
        const selectedLoc = ref(null);
        const storyProgress = ref("");

        // Config Cartes
        const mapConfig = {
            lightTiles: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
            darkTiles: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        };

        // Création des icônes
        const createIcon = (bgClass, iconClass) => L.divIcon({
            className: 'custom-icon',
            html: `<div class="w-8 h-8 ${bgClass} rounded-full border-2 border-brand-gold shadow-lg flex items-center justify-center text-white relative z-10 group overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent"></div>
                    <i class="${iconClass} text-[10px] relative z-20"></i>
                   </div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -36]
        });

        const icons = {
            ville: createIcon('bg-emerald-700', 'fa-solid fa-mosque'),
            bataille: createIcon('bg-red-700', 'fa-solid fa-shield-halved'),
            monument: createIcon('bg-blue-500', 'fa-solid fa-landmark')
        };

        // Initialisation de la carte
        const initMap = () => {
            if(L.DomUtil.get('map-container') !== null) { 
                L.DomUtil.get('map-container')._leaflet_id = null; 
            }

            map = L.map('map-container', { zoomControl: false, attributionControl: false }).setView([24.5, 44.0], 5);
            L.control.zoom({ position: 'bottomright' }).addTo(map);

            const tileUrl = props.settings.darkMode ? mapConfig.darkTiles : mapConfig.lightTiles;
            tileLayer = L.tileLayer(tileUrl, { className: 'map-tiles', maxZoom: 19 }).addTo(map);

            clusterGroup = L.markerClusterGroup({
                showCoverageOnHover: false,
                maxClusterRadius: 40,
                iconCreateFunction: function(cluster) {
                    return L.divIcon({ 
                        html: '<div class="w-8 h-8 rounded-full bg-brand-dark dark:bg-brand-gold border border-brand-gold text-brand-gold dark:text-brand-dark flex items-center justify-center font-bold font-sans text-xs shadow-lg">' + cluster.getChildCount() + '</div>', 
                        className: 'marker-cluster-custom', iconSize: [40, 40] 
                    });
                }
            });
            map.addLayer(clusterGroup);

            // Recherche floue (Fuse.js)
            if (typeof atlasLocations !== 'undefined') {
                fuse = new Fuse(atlasLocations, { keys: ['name', 'figures', 'desc'], threshold: 0.3 });
                updateMapMarkers();
                
                // Tracé Hégire
                if (typeof hijraRoutePoints !== 'undefined') {
                    L.polyline(hijraRoutePoints, { color: '#c5a059', weight: 3, dashArray: '5, 10', opacity: 0.6, className: 'animate-pulse' }).addTo(map);
                }
            }
        };

        const updateMapMarkers = () => {
            if (!clusterGroup) return;
            clusterGroup.clearLayers();
            
            let filtered = atlasLocations || [];

            // Recherche
            if (state.search) {
                const results = fuse.search(state.search);
                filtered = results.map(r => r.item);
                const ids = new Set(filtered.map(i => i.id));
                filtered = atlasLocations.filter(d => ids.has(d.id));
            }

            // Filtres
            filtered = filtered.filter(item => {
                const typeMatch = state.filter === 'all' || item.type === state.filter;
                const yearMatch = (item.year || 1) <= state.year;
                return typeMatch && yearMatch;
            });

            // Markers
            const markers = filtered.map(loc => {
                const marker = L.marker(loc.coords, { icon: icons[loc.type] || icons.ville, title: loc.name });
                marker.bindTooltip(loc.name, { direction: 'top', offset: [0, -25], className: 'bg-brand-dark/90 text-brand-gold border-none rounded-lg px-3 py-1.5 font-sans text-xs font-bold shadow-xl backdrop-blur-sm' });
                marker.on('click', () => { openDetails(loc); map.flyTo(loc.coords, 8, { duration: 1.2 }); });
                return marker;
            });

            clusterGroup.addLayers(markers);

            if (state.story.active) {
                state.story.list = filtered.sort((a,b) => (a.year||0) - (b.year||0));
                updateStoryUI();
            }
        };

        // Actions UI
        const setFilter = (type) => { state.filter = type; updateMapMarkers(); };
        const handleSearch = (e) => { state.search = e.target.value; updateMapMarkers(); };
        const handleTimeline = (e) => { state.year = parseInt(e.target.value); updateMapMarkers(); };

        // Détails
        const openDetails = (loc) => { selectedLoc.value = loc; showPanel.value = true; };
        const closeDetails = () => { showPanel.value = false; if (state.story.active) stopStoryMode(); };

        // Mode Récit
        const startStoryMode = () => {
            state.story.active = true;
            state.story.index = 0;
            state.filter = 'all';
            state.year = 230;
            updateMapMarkers();
            if (state.story.list.length > 0) visitStoryStep(0);
        };
        const stopStoryMode = () => { state.story.active = false; };
        const visitStoryStep = (idx) => {
            if (idx < 0 || idx >= state.story.list.length) return;
            state.story.index = idx;
            const item = state.story.list[idx];
            openDetails(item);
            map.flyTo(item.coords, 8, { duration: 1.5 });
            updateStoryUI();
        };
        const updateStoryUI = () => { storyProgress.value = `${state.story.index + 1} / ${state.story.list.length}`; };
        const storyNext = () => visitStoryStep(state.story.index + 1);
        const storyPrev = () => visitStoryStep(state.story.index - 1);

        // Lifecycle
        watch(() => props.settings.darkMode, (isDark) => { if (tileLayer) tileLayer.setUrl(isDark ? mapConfig.darkTiles : mapConfig.lightTiles); });
        
        onMounted(() => setTimeout(initMap, 100));
        onUnmounted(() => { if (map) { map.remove(); map = null; } });

        return { state, setFilter, handleSearch, handleTimeline, showPanel, selectedLoc, openDetails, closeDetails, startStoryMode, stopStoryMode, storyNext, storyPrev, storyProgress };
    },
    template: `
    <div class="relative w-full h-full overflow-hidden flex flex-col">
        <div class="absolute top-4 left-4 z-[400] flex gap-2">
            <div class="bg-white/90 dark:bg-brand-dark/90 backdrop-blur-md p-1.5 rounded-2xl shadow-card border border-brand-gold/20 flex gap-1">
                <button @click="setFilter('all')" :class="state.filter === 'all' ? 'bg-brand-dark text-brand-gold' : 'text-gray-500 hover:bg-gray-100'" class="px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all">Tout</button>
                <button @click="setFilter('ville')" :class="state.filter === 'ville' ? 'bg-brand-dark text-brand-gold' : 'text-gray-500 hover:bg-gray-100'" class="px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all">Cités</button>
                <button @click="setFilter('bataille')" :class="state.filter === 'bataille' ? 'bg-brand-dark text-brand-gold' : 'text-gray-500 hover:bg-gray-100'" class="px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all">Batailles</button>
            </div>
        </div>

        <div class="absolute top-4 right-14 z-[400] w-48 md:w-64">
            <input type="text" @input="handleSearch" placeholder="Chercher un lieu..." class="w-full pl-4 pr-4 py-2 bg-white/90 dark:bg-brand-dark/90 backdrop-blur border border-brand-gold/20 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-brand-gold shadow-lg">
        </div>

        <div id="map-container" class="w-full h-full z-0 bg-[#eaddcf] dark:bg-[#1a1c23]"></div>

        <transition name="slide-up">
            <aside v-if="showPanel && selectedLoc" class="absolute top-20 left-4 bottom-24 md:bottom-8 z-[500] w-96 max-w-[90%] bg-white/95 dark:bg-brand-dark/95 backdrop-blur-lg shadow-2xl rounded-3xl border border-brand-gold/20 flex flex-col overflow-hidden">
                <div class="h-40 relative shrink-0 bg-gray-200">
                    <img :src="selectedLoc.image" class="w-full h-full object-cover">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <button @click="closeDetails" class="absolute top-3 right-3 w-8 h-8 bg-black/40 hover:bg-red-500 rounded-full flex items-center justify-center text-white"><i data-lucide="x" class="w-4 h-4"></i></button>
                    <div class="absolute bottom-4 left-6 text-white">
                        <span class="px-2 py-0.5 bg-brand-gold text-[10px] font-bold uppercase rounded mb-1 inline-block">{{ selectedLoc.type }}</span>
                        <h2 class="font-display font-bold text-xl">{{ selectedLoc.name }}</h2>
                        <p class="opacity-80 text-xs mt-1">An {{ selectedLoc.year }} H</p>
                    </div>
                </div>
                <div class="p-6 overflow-y-auto flex-1">
                    <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed text-justify mb-6 font-serif">{{ selectedLoc.desc }}</p>
                    <div v-if="selectedLoc.figures" class="bg-brand-paper dark:bg-brand-dark-accent rounded-xl p-4 border border-brand-gold/10">
                        <h4 class="font-display font-bold text-xs text-brand-gold uppercase tracking-widest mb-3">Figures Liées</h4>
                        <ul class="space-y-2"><li v-for="fig in selectedLoc.figures" :key="fig" class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300"><span class="w-1.5 h-1.5 bg-brand-gold rounded-full"></span> {{ fig }}</li></ul>
                    </div>
                </div>
                <div v-if="state.story.active" class="p-4 bg-gray-50 dark:bg-brand-dark-accent border-t border-brand-gold/10 flex justify-between items-center">
                    <button @click="storyPrev" class="p-2 hover:bg-gray-200 dark:hover:bg-brand-dark rounded-full"><i data-lucide="chevron-left" class="w-4 h-4"></i></button>
                    <span class="font-mono text-xs font-bold text-brand-gold">{{ storyProgress }}</span>
                    <button @click="storyNext" class="p-2 hover:bg-gray-200 dark:hover:bg-brand-dark rounded-full"><i data-lucide="chevron-right" class="w-4 h-4"></i></button>
                </div>
            </aside>
        </transition>

        <div class="absolute bottom-0 left-0 w-full p-4 bg-white/90 dark:bg-brand-dark/90 backdrop-blur border-t border-brand-gold/20 z-[400] flex flex-col md:flex-row gap-4 items-center justify-between">
            <div class="flex items-center gap-4 w-full md:w-2/3">
                <button v-if="!state.story.active" @click="startStoryMode" class="shrink-0 px-4 py-2 bg-brand-dark dark:bg-white text-brand-gold dark:text-brand-dark rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 hover:scale-105 transition-transform shadow-lg"><i data-lucide="play-circle" class="w-4 h-4"></i> Récit</button>
                <button v-else @click="stopStoryMode" class="shrink-0 px-4 py-2 bg-red-500 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:scale-105 transition-transform shadow-lg">Stop</button>
                <div class="flex-1 flex flex-col justify-center">
                    <div class="flex justify-between text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider"><span>Hégire</span><span class="text-brand-gold text-lg">An {{ state.year }}</span><span>230 H</span></div>
                    <input type="range" min="0" max="230" v-model="state.year" @input="handleTimeline" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-gold">
                </div>
            </div>
        </div>
    </div>
    `
};