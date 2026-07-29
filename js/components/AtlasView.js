const AtlasView = {
    props: ['settings'],

    setup(props) {
        const { ref, reactive, computed, watch, onMounted, onUnmounted, nextTick } = Vue;

        let map = null;
        let tileLayer = null;
        let markerLayer = null;
        let routeLayer = null;
        const markerById = new Map();

        const viewMode = ref('map');
        const selectedLocation = ref(null);
        const detailsOpen = ref(false);
        const detailsTab = ref('overview');
        const imageFailed = ref(false);
        const visibleCount = ref(24);
        const activeJourneyId = ref(null);
        const journeyStep = ref(0);
        const quiz = ref(null);
        const quizAnswer = ref(null);
        const quizScore = ref({ correct: 0, total: 0 });
        const favorites = ref([]);
        const visited = ref([]);

        const filters = reactive({
            search: '',
            type: 'all',
            region: 'all',
            era: 'all',
            maxYear: 230,
            favoritesOnly: false
        });

        const typeConfig = {
            ville: { label: 'Cité', icon: 'building-2', fa: 'fa-solid fa-city', color: '#047857' },
            bataille: { label: 'Bataille', icon: 'shield', fa: 'fa-solid fa-shield-halved', color: '#b91c1c' },
            monument: { label: 'Site', icon: 'landmark', fa: 'fa-solid fa-landmark', color: '#1d4ed8' }
        };

        const eraConfig = {
            pre: { label: 'Avant l’Hégire', min: -50, max: -1 },
            prophetic: { label: 'Époque prophétique', min: 0, max: 11 },
            rashidun: { label: 'Califes bien guidés', min: 12, max: 40 },
            umayyad: { label: 'Époque omeyyade', min: 41, max: 132 },
            abbasid: { label: 'Premiers Abbassides', min: 133, max: 230 },
            timeless: { label: 'Repère intemporel', min: null, max: null }
        };

        const locationOverrides = {
            1: {
                yearLabel: 'Repère sacré et historique',
                summary: 'La Mecque est le centre du pèlerinage musulman et abrite la Kaaba, vers laquelle les musulmans s’orientent pour la prière.',
                sources: [
                    { label: 'Coran 2:144 — orientation vers al-Masjid al-Haram', url: 'https://quran.com/2/144' }
                ]
            },
            2: {
                yearLabel: '1 H · arrivée de l’Hégire',
                summary: 'Médine accueillit le Prophète et les émigrants. Elle devint le principal centre politique et religieux de la première communauté musulmane.'
            },
            3: {
                yearLabel: 'Repère sacré · conquête sous ʿUmar vers 16 H',
                summary: 'Jérusalem est associée à al-Isrāʾ et al-Miʿrāj et abrite al-Masjid al-Aqṣā. La ville passa sous autorité musulmane au temps du calife ʿUmar.'
            },
            4: {
                year: 1,
                yearLabel: '1 H · arrivée à Quba',
                summary: 'La mosquée de Quba est liée aux premiers jours de l’arrivée à Médine. Des hadiths rapportent la visite régulière du Prophète et le mérite d’y prier.',
                sources: [
                    { label: 'Sahih al-Bukhari 1191 — visite de Quba', url: 'https://sunnah.com/bukhari:1191' },
                    { label: 'Sunan Ibn Majah 1412 — mérite de la prière à Quba', url: 'https://sunnah.com/ibnmajah:1412' }
                ]
            },
            5: {
                year: 2,
                yearLabel: 'Vers 2 H · changement de qibla',
                summary: 'La mosquée est traditionnellement associée au changement de direction de la prière vers la Kaaba. Le Coran établit ce changement ; l’identification précise du lieu relève de la tradition historique locale.',
                sources: [
                    { label: 'Coran 2:144 — changement de qibla', url: 'https://quran.com/2/144' }
                ],
                caution: 'La localisation exacte de l’épisode dans cette mosquée n’est pas formulée dans le verset lui-même.'
            },
            6: {
                sortYear: -13,
                yearLabel: 'Avant l’Hégire · début de la Révélation',
                summary: 'La grotte de Hira est traditionnellement identifiée comme le lieu de la première révélation reçue par le Prophète Muhammad.'
            },
            7: {
                year: 1,
                yearLabel: '1 H · Hégire',
                summary: 'La grotte de Thawr est associée au refuge du Prophète et d’Abu Bakr pendant leur départ de La Mecque vers Médine.'
            },
            8: {
                sortYear: -10,
                yearLabel: 'Période mecquoise',
                summary: 'La maison d’al-Arqam est traditionnellement présentée comme un lieu discret de réunion et d’enseignement pour les premiers musulmans.'
            },
            9: {
                sortYear: -1,
                yearLabel: 'Avant l’Hégire et rites du Hajj',
                summary: 'Mina est un site central du pèlerinage. La zone d’al-ʿAqaba, à proximité, est liée aux serments qui précédèrent l’Hégire.'
            },
            10: {
                year: 10,
                yearLabel: '10 H · pèlerinage d’adieu',
                summary: 'ʿArafat est le lieu du stationnement rituel du Hajj. Le Prophète y prononça un sermon majeur lors de son pèlerinage d’adieu.'
            },
            11: {
                year: 2,
                yearLabel: '2 H · Badr',
                summary: 'Badr fut la première grande bataille de la communauté médinoise. Les sources décrivent une force musulmane d’environ trois cents hommes face à une armée mecquoise nettement plus nombreuse.',
                sources: [
                    { label: 'Coran 3:123 — secours accordé à Badr', url: 'https://quran.com/3/123' }
                ]
            },
            14: {
                year: 7,
                yearLabel: '7 H · Khaybar',
                summary: 'La campagne de Khaybar conduisit à la prise progressive de plusieurs forteresses au nord de Médine. Les récits détaillés comportent des variantes.'
            },
            15: {
                year: 8,
                yearLabel: '8 H · Muʾta',
                summary: 'Muʾta opposa une force musulmane à des troupes liées à l’espace byzantin. Zayd ibn Haritha, Jaʿfar ibn Abi Talib et ʿAbd Allah ibn Rawaha y furent tués.'
            },
            18: {
                year: 15,
                yearLabel: 'Vers 15 H / 636 · Yarmouk',
                summary: 'Yarmouk fut une bataille décisive des conquêtes du Levant face aux forces byzantines. La chronologie détaillée des opérations varie selon les sources.'
            },
            19: {
                year: 15,
                yearLabel: 'Vers 15 H · al-Qadisiyya',
                summary: 'Al-Qadisiyya fut une bataille majeure contre l’Empire sassanide. Sa datation exacte est discutée et se situe généralement au milieu des années 630.'
            },
            20: {
                year: 6,
                yearLabel: '6 H · al-Hudaybiyya',
                summary: 'Le traité d’al-Hudaybiyya établit une trêve entre les musulmans de Médine et Quraysh. Le serment d’al-Ridwan est également associé à cet épisode.'
            },
            27: {
                year: 14,
                yearLabel: 'Vers 14 H · prise de Damas',
                summary: 'Damas passa sous autorité musulmane pendant les campagnes du Levant. Les récits sur les modalités exactes de la capitulation diffèrent selon les traditions historiques.',
                caution: 'Les récits des portes ouvertes par la paix ou par la force ne doivent pas être présentés comme un déroulement unanimement établi.'
            },
            28: {
                year: 20,
                yearLabel: '20 H · fondation de Fustat',
                summary: 'Fustat fut fondée comme camp et centre administratif après la conquête de l’Égypte. Elle devint le principal noyau urbain de l’Égypte islamique avant Le Caire.'
            },
            42: {
                year: 17,
                yearLabel: '17 H · fondation de Koufa',
                summary: 'Koufa fut fondée comme ville de garnison en Irak. Elle devint un centre politique, linguistique, juridique et religieux majeur.'
            },
            43: {
                year: 14,
                yearLabel: 'Vers 14 H · fondation de Bassora',
                summary: 'Bassora fut établie comme ville de garnison et devint rapidement un grand centre de commerce, de langue arabe, de droit et de transmission.'
            },
            94: {
                year: 92,
                yearLabel: 'Après 92 H · Cordoue islamique',
                summary: 'Cordoue passa sous domination musulmane au début du VIIIe siècle. Elle devint plus tard la capitale de l’émirat puis du califat omeyyade d’al-Andalus.',
                caution: 'La ville ne devint pas immédiatement une grande capitale en 92 H ; son rôle politique se développa progressivement.'
            },
            98: {
                year: 50,
                yearLabel: 'Vers 50 H · fondation de Kairouan',
                summary: 'Kairouan fut fondée comme base durable au Maghreb et devint un centre majeur de pouvoir, d’enseignement et de culture islamique.'
            },
            113: {
                year: 49,
                yearLabel: 'Campagnes omeyyades contre Constantinople',
                summary: 'Plusieurs campagnes et sièges omeyyades visèrent Constantinople. Leur chronologie et leur découpage exact font l’objet de discussions historiques.'
            },
            114: {
                year: 223,
                yearLabel: '223 H · campagne d’Amorium',
                summary: 'Amorium fut prise lors d’une grande campagne du calife al-Muʿtasim contre l’Empire byzantin. Les récits populaires associés à cette campagne doivent être distingués des faits solidement établis.'
            },
            117: {
                year: 145,
                yearLabel: '145 H / 762 · fondation de Bagdad',
                summary: 'Bagdad fut fondée par le calife al-Mansur comme nouvelle capitale abbasside. La ville ronde devint rapidement un centre politique, scientifique et commercial majeur.'
            },
            122: {
                year: 100,
                yearLabel: 'Chronologie indicative · océan Indien',
                summary: 'Zanzibar illustre l’ancienneté des circulations maritimes entre l’Afrique orientale, l’Arabie et l’océan Indien. La datation précise des premières communautés musulmanes locales reste à manier avec prudence.',
                caution: 'Ce repère ne doit pas être lu comme la preuve d’une implantation urbaine musulmane précisément datée de 100 H.'
            }
        };

        const journeys = [
            {
                id: 'hijra',
                title: 'Sur les traces de l’Hégire',
                subtitle: 'De La Mecque à Médine',
                description: 'Un parcours pédagogique entre les principaux repères traditionnellement associés au départ de La Mecque et à l’arrivée dans la cité médinoise.',
                icon: 'footprints',
                ids: [1, 7, 4, 2],
                accent: '#c5a059'
            },
            {
                id: 'hajj',
                title: 'Géographie du pèlerinage',
                subtitle: 'Makkah, Mina, ʿArafat et Médine',
                description: 'Comprendre la proximité et la fonction des principaux lieux liés au Hajj et aux visites de la région du Hedjaz.',
                icon: 'route',
                ids: [1, 9, 10, 4, 2],
                accent: '#0f766e'
            },
            {
                id: 'sira-campaigns',
                title: 'Les grandes campagnes de la Sira',
                subtitle: '2 H à 9 H',
                description: 'Badr, Uhud, le Fossé, Khaybar, Muʾta, Hunayn et Tabuk replacés dans leur espace et leur chronologie.',
                icon: 'shield',
                ids: [11, 12, 13, 14, 15, 16, 17],
                accent: '#b91c1c'
            },
            {
                id: 'rashidun-expansion',
                title: 'Du Hedjaz aux nouveaux centres',
                subtitle: 'Époque des Califes bien guidés',
                description: 'Levant, Irak et Égypte : batailles, fondations urbaines et nouveaux centres administratifs.',
                icon: 'compass',
                ids: [3, 27, 18, 19, 42, 43, 28],
                accent: '#1d4ed8'
            },
            {
                id: 'knowledge-cities',
                title: 'Les cités du savoir',
                subtitle: 'Médine, Koufa, Bassora, Bagdad et au-delà',
                description: 'Un parcours transversal à travers plusieurs villes devenues des foyers de droit, de hadith, de langue et de culture.',
                icon: 'library',
                ids: [2, 42, 43, 117, 121, 98, 94],
                accent: '#6d28d9'
            }
        ];

        const normalizeText = (value = '') => String(value)
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[ʿʾ‘’'`]/g, '')
            .toLowerCase()
            .trim();

        const canonicalName = (name = '') => normalizeText(name.replace(/\([^)]*\)/g, '').replace(/al-/gi, ''));

        const inferRegion = (coords = []) => {
            const [lat, lon] = coords;
            if (!Number.isFinite(lat) || !Number.isFinite(lon)) return 'Autres régions';
            if (lon < 0 && lat > 25) return 'Al-Andalus';
            if (lon < 20 && lat > 25) return 'Maghreb & Méditerranée';
            if (lat < 15) return 'Afrique orientale & océan Indien';
            if (lon >= 20 && lon < 35 && lat < 33) return 'Égypte & vallée du Nil';
            if (lon >= 34 && lon < 43 && lat >= 29 && lat < 38) return 'Levant';
            if (lon >= 42 && lon < 51 && lat >= 28 && lat < 38) return 'Irak & Jazira';
            if (lat >= 37 && lon >= 25 && lon < 51) return 'Anatolie & Caucase';
            if (lon >= 49) return 'Iran, Khurasan & Asie centrale';
            if (lon >= 34 && lon < 56 && lat >= 12 && lat < 32) return 'Arabie & Hedjaz';
            return 'Autres régions';
        };

        const inferEra = (sortYear) => {
            if (sortYear === null || sortYear === undefined || Number.isNaN(sortYear)) return 'timeless';
            if (sortYear < 0) return 'pre';
            if (sortYear <= 11) return 'prophetic';
            if (sortYear <= 40) return 'rashidun';
            if (sortYear <= 132) return 'umayyad';
            return 'abbasid';
        };

        const buildLocation = (raw) => {
            const override = locationOverrides[raw.id] || {};
            const numericYear = Number.isFinite(Number(override.year))
                ? Number(override.year)
                : Number.isFinite(Number(raw.year))
                    ? Number(raw.year)
                    : null;
            const sortYear = Number.isFinite(Number(override.sortYear))
                ? Number(override.sortYear)
                : numericYear;
            const coords = Array.isArray(raw.coords) ? raw.coords.map(Number) : [];
            const type = typeConfig[raw.type] ? raw.type : 'monument';
            const figures = [...new Set([...(Array.isArray(raw.figures) ? raw.figures : []), ...(override.figures || [])])];
            const sources = Array.isArray(override.sources) ? override.sources : [];

            return {
                ...raw,
                ...override,
                coords,
                type,
                figures,
                sources,
                year: numericYear,
                sortYear,
                yearLabel: override.yearLabel || (numericYear !== null ? `Vers ${numericYear} H` : 'Repère chronologique à préciser'),
                summary: override.summary || raw.desc || 'Notice en cours de documentation.',
                region: override.region || inferRegion(coords),
                era: override.era || inferEra(sortYear),
                caution: override.caution || '',
                searchText: normalizeText([
                    raw.name,
                    override.summary || raw.desc,
                    figures.join(' '),
                    override.region || inferRegion(coords),
                    typeConfig[type].label
                ].join(' '))
            };
        };

        const rawLocations = computed(() => {
            const source = typeof atlasLocations !== 'undefined' && Array.isArray(atlasLocations) ? atlasLocations : [];
            return source.map(buildLocation);
        });

        const locations = computed(() => {
            const byCanonical = new Map();
            rawLocations.value.forEach((loc) => {
                const key = canonicalName(loc.name);
                const existing = byCanonical.get(key);
                if (!existing) {
                    byCanonical.set(key, loc);
                    return;
                }
                const close = Math.abs(existing.coords[0] - loc.coords[0]) < 0.15 && Math.abs(existing.coords[1] - loc.coords[1]) < 0.15;
                if (!close) {
                    byCanonical.set(`${key}-${loc.id}`, loc);
                    return;
                }
                existing.figures = [...new Set([...existing.figures, ...loc.figures])];
                existing.sources = [...existing.sources, ...loc.sources];
                existing.duplicateIds = [...(existing.duplicateIds || []), loc.id];
            });
            return Array.from(byCanonical.values()).sort((a, b) => a.name.localeCompare(b.name, 'fr'));
        });

        const regions = computed(() => [...new Set(locations.value.map(loc => loc.region))].sort((a, b) => a.localeCompare(b, 'fr')));
        const totalYears = computed(() => Math.max(230, ...locations.value.map(loc => Number.isFinite(loc.sortYear) ? loc.sortYear : 0)));

        const filteredLocations = computed(() => {
            const query = normalizeText(filters.search);
            return locations.value.filter((loc) => {
                const searchMatch = !query || loc.searchText.includes(query);
                const typeMatch = filters.type === 'all' || loc.type === filters.type;
                const regionMatch = filters.region === 'all' || loc.region === filters.region;
                const eraMatch = filters.era === 'all' || loc.era === filters.era;
                const yearMatch = !Number.isFinite(loc.sortYear) || loc.sortYear <= Number(filters.maxYear);
                const favoriteMatch = !filters.favoritesOnly || favorites.value.includes(loc.id);
                return searchMatch && typeMatch && regionMatch && eraMatch && yearMatch && favoriteMatch;
            });
        });

        const displayedLocations = computed(() => filteredLocations.value.slice(0, visibleCount.value));
        const selectedJourney = computed(() => journeys.find(journey => journey.id === activeJourneyId.value) || null);
        const journeyLocations = computed(() => selectedJourney.value ? selectedJourney.value.ids.map(id => getLocation(id)).filter(Boolean) : []);
        const currentJourneyLocation = computed(() => journeyLocations.value[journeyStep.value] || null);
        const progressPercent = computed(() => locations.value.length ? Math.round((visited.value.length / locations.value.length) * 100) : 0);
        const filterCount = computed(() => [filters.type, filters.region, filters.era].filter(value => value !== 'all').length + (filters.search ? 1 : 0) + (filters.favoritesOnly ? 1 : 0));

        const stats = computed(() => ({
            total: locations.value.length,
            cities: locations.value.filter(loc => loc.type === 'ville').length,
            battles: locations.value.filter(loc => loc.type === 'bataille').length,
            regions: regions.value.length
        }));

        const getLocation = (id) => locations.value.find(loc => loc.id === Number(id)) || null;
        const isFavorite = (id) => favorites.value.includes(Number(id));
        const isVisited = (id) => visited.value.includes(Number(id));

        const persistList = (key, value) => {
            try { localStorage.setItem(key, JSON.stringify(value)); } catch (error) { console.warn('Stockage Atlas indisponible', error); }
        };

        const toggleFavorite = (id) => {
            const numericId = Number(id);
            favorites.value = isFavorite(numericId)
                ? favorites.value.filter(item => item !== numericId)
                : [...favorites.value, numericId];
            persistList('athar_atlas_favorites_v1', favorites.value);
            refreshIcons();
        };

        const markVisited = (id) => {
            const numericId = Number(id);
            if (!visited.value.includes(numericId)) {
                visited.value = [...visited.value, numericId];
                persistList('athar_atlas_visited_v1', visited.value);
            }
        };

        const refreshIcons = () => nextTick(() => {
            if (window.lucide) window.lucide.createIcons();
        });

        const createMapIcon = (loc, active = false) => {
            const config = typeConfig[loc.type] || typeConfig.monument;
            return L.divIcon({
                className: 'atlas-pro-marker-shell',
                html: `<div class="atlas-pro-marker atlas-pro-marker-${loc.type}${active ? ' is-active' : ''}" style="--atlas-pin:${config.color}"><i class="${config.fa}"></i></div>`,
                iconSize: [38, 46],
                iconAnchor: [19, 43],
                tooltipAnchor: [0, -38]
            });
        };

        const mapConfig = {
            light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
            dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
        };

        const initMap = () => {
            const container = document.getElementById('atlas-pro-map');
            if (!container || typeof L === 'undefined') return;
            if (container._leaflet_id) container._leaflet_id = null;

            map = L.map(container, {
                zoomControl: false,
                attributionControl: true,
                minZoom: 2,
                worldCopyJump: true
            }).setView([27, 39], 4);

            L.control.zoom({ position: 'bottomright' }).addTo(map);
            tileLayer = L.tileLayer(props.settings && props.settings.darkMode ? mapConfig.dark : mapConfig.light, {
                maxZoom: 19,
                attribution: mapConfig.attribution
            }).addTo(map);

            markerLayer = L.markerClusterGroup({
                showCoverageOnHover: false,
                maxClusterRadius: 45,
                spiderfyOnMaxZoom: true,
                iconCreateFunction: (cluster) => L.divIcon({
                    className: 'atlas-pro-cluster-shell',
                    html: `<div class="atlas-pro-cluster"><span>${cluster.getChildCount()}</span><small>lieux</small></div>`,
                    iconSize: [52, 52]
                })
            });
            routeLayer = L.layerGroup();
            map.addLayer(markerLayer);
            map.addLayer(routeLayer);
            renderMarkers(false);
            drawHijraReference();
            setTimeout(() => map && map.invalidateSize(), 120);
        };

        const drawHijraReference = () => {
            if (!routeLayer || activeJourneyId.value) return;
            if (typeof hijraRoutePoints !== 'undefined' && Array.isArray(hijraRoutePoints)) {
                L.polyline(hijraRoutePoints, {
                    color: '#c5a059',
                    weight: 2,
                    dashArray: '7 10',
                    opacity: 0.38,
                    interactive: false
                }).addTo(routeLayer);
            }
        };

        const renderMarkers = (fit = false) => {
            if (!map || !markerLayer) return;
            markerLayer.clearLayers();
            markerById.clear();

            const markers = filteredLocations.value.map((loc) => {
                const marker = L.marker(loc.coords, {
                    icon: createMapIcon(loc, selectedLocation.value && selectedLocation.value.id === loc.id),
                    title: loc.name,
                    keyboard: true
                });
                marker.bindTooltip(`<strong>${loc.name}</strong><span>${loc.yearLabel}</span>`, {
                    direction: 'top',
                    offset: [0, -36],
                    className: 'atlas-pro-tooltip'
                });
                marker.on('click', () => openDetails(loc, true));
                markerById.set(loc.id, marker);
                return marker;
            });

            markerLayer.addLayers(markers);
            if (fit && markers.length) {
                const bounds = markerLayer.getBounds();
                if (bounds.isValid()) map.fitBounds(bounds.pad(0.12), { maxZoom: 7 });
            }
        };

        const drawJourney = () => {
            if (!routeLayer) return;
            routeLayer.clearLayers();
            const points = journeyLocations.value.map(loc => loc.coords);
            if (points.length > 1) {
                L.polyline(points, {
                    color: selectedJourney.value ? selectedJourney.value.accent : '#c5a059',
                    weight: 4,
                    opacity: 0.8,
                    dashArray: '2 9',
                    lineCap: 'round'
                }).addTo(routeLayer);
            }
            if (!activeJourneyId.value) drawHijraReference();
        };

        const openDetails = (loc, fly = false) => {
            if (!loc) return;
            selectedLocation.value = loc;
            detailsTab.value = 'overview';
            detailsOpen.value = true;
            imageFailed.value = false;
            markVisited(loc.id);
            if (fly && map) map.flyTo(loc.coords, Math.max(map.getZoom(), 7), { duration: 0.9 });
            refreshIcons();
        };

        const closeDetails = () => {
            detailsOpen.value = false;
            selectedLocation.value = null;
            imageFailed.value = false;
            renderMarkers(false);
        };

        const setViewMode = (mode) => {
            viewMode.value = mode;
            if (mode === 'map') {
                nextTick(() => {
                    if (!map) initMap();
                    else {
                        map.invalidateSize();
                        renderMarkers(false);
                        drawJourney();
                    }
                });
            }
            refreshIcons();
        };

        const resetFilters = () => {
            filters.search = '';
            filters.type = 'all';
            filters.region = 'all';
            filters.era = 'all';
            filters.maxYear = totalYears.value;
            filters.favoritesOnly = false;
            visibleCount.value = 24;
        };

        const fitVisible = () => renderMarkers(true);

        const showRandomLocation = () => {
            const pool = filteredLocations.value.length ? filteredLocations.value : locations.value;
            if (!pool.length) return;
            const loc = pool[Math.floor(Math.random() * pool.length)];
            setViewMode('map');
            nextTick(() => openDetails(loc, true));
        };

        const startJourney = (journey) => {
            activeJourneyId.value = journey.id;
            journeyStep.value = 0;
            resetFilters();
            setViewMode('map');
            nextTick(() => {
                drawJourney();
                const first = currentJourneyLocation.value;
                if (first) openDetails(first, true);
                if (map && journeyLocations.value.length) {
                    const bounds = L.latLngBounds(journeyLocations.value.map(loc => loc.coords));
                    map.fitBounds(bounds.pad(0.2), { maxZoom: 7 });
                }
            });
        };

        const stopJourney = () => {
            activeJourneyId.value = null;
            journeyStep.value = 0;
            if (routeLayer) {
                routeLayer.clearLayers();
                drawHijraReference();
            }
            closeDetails();
        };

        const goToJourneyStep = (index) => {
            if (!journeyLocations.value.length) return;
            const bounded = Math.max(0, Math.min(index, journeyLocations.value.length - 1));
            journeyStep.value = bounded;
            const loc = journeyLocations.value[bounded];
            openDetails(loc, true);
            drawJourney();
        };

        const nextJourneyStep = () => goToJourneyStep(journeyStep.value + 1);
        const previousJourneyStep = () => goToJourneyStep(journeyStep.value - 1);

        const startQuiz = () => {
            const candidates = locations.value.filter(loc => loc.region && loc.region !== 'Autres régions');
            if (!candidates.length) return;
            const target = candidates[Math.floor(Math.random() * candidates.length)];
            const distractors = regions.value.filter(region => region !== target.region).sort(() => Math.random() - 0.5).slice(0, 3);
            const options = [...distractors, target.region].sort(() => Math.random() - 0.5);
            quiz.value = {
                location: target,
                question: `Dans quelle grande région se situe « ${target.name} » ?`,
                options,
                correct: target.region
            };
            quizAnswer.value = null;
            refreshIcons();
        };

        const answerQuiz = (option) => {
            if (!quiz.value || quizAnswer.value) return;
            quizAnswer.value = option;
            quizScore.value = {
                correct: quizScore.value.correct + (option === quiz.value.correct ? 1 : 0),
                total: quizScore.value.total + 1
            };
        };

        const closeQuiz = () => {
            quiz.value = null;
            quizAnswer.value = null;
        };

        const yearDisplay = computed(() => {
            const value = Number(filters.maxYear);
            if (value < 0) return `Avant l’Hégire`;
            if (value === 0) return 'Hégire';
            return `${value} H`;
        });

        const loadLocalState = () => {
            try {
                favorites.value = JSON.parse(localStorage.getItem('athar_atlas_favorites_v1') || '[]').map(Number);
                visited.value = JSON.parse(localStorage.getItem('athar_atlas_visited_v1') || '[]').map(Number);
                const storedScore = JSON.parse(localStorage.getItem('athar_atlas_quiz_v1') || 'null');
                if (storedScore && Number.isFinite(storedScore.total)) quizScore.value = storedScore;
            } catch (error) {
                favorites.value = [];
                visited.value = [];
            }
        };

        watch(() => props.settings && props.settings.darkMode, (isDark) => {
            if (tileLayer) tileLayer.setUrl(isDark ? mapConfig.dark : mapConfig.light);
        });

        watch(filteredLocations, () => {
            visibleCount.value = 24;
            renderMarkers(false);
            refreshIcons();
        });

        watch(selectedLocation, () => renderMarkers(false));
        watch(quizScore, value => persistList('athar_atlas_quiz_v1', value), { deep: true });

        onMounted(() => {
            loadLocalState();
            filters.maxYear = totalYears.value;
            refreshIcons();
            nextTick(() => setTimeout(initMap, 120));
        });

        onUnmounted(() => {
            if (map) {
                map.remove();
                map = null;
            }
        });

        return {
            viewMode,
            filters,
            typeConfig,
            eraConfig,
            journeys,
            selectedLocation,
            detailsOpen,
            detailsTab,
            imageFailed,
            visibleCount,
            activeJourneyId,
            selectedJourney,
            journeyStep,
            journeyLocations,
            currentJourneyLocation,
            quiz,
            quizAnswer,
            quizScore,
            favorites,
            visited,
            locations,
            regions,
            totalYears,
            filteredLocations,
            displayedLocations,
            progressPercent,
            filterCount,
            stats,
            yearDisplay,
            isFavorite,
            isVisited,
            toggleFavorite,
            openDetails,
            closeDetails,
            setViewMode,
            resetFilters,
            fitVisible,
            showRandomLocation,
            startJourney,
            stopJourney,
            goToJourneyStep,
            nextJourneyStep,
            previousJourneyStep,
            startQuiz,
            answerQuiz,
            closeQuiz
        };
    },

    template: `
    <section class="atlas-pro-shell">
        <div class="atlas-pro-ambient atlas-pro-ambient-one"></div>
        <div class="atlas-pro-ambient atlas-pro-ambient-two"></div>

        <div class="atlas-pro-container">
            <header class="atlas-pro-hero">
                <div class="atlas-pro-hero-copy">
                    <span class="atlas-pro-eyebrow"><i data-lucide="map"></i> Géographie historique</span>
                    <h1>Atlas des mondes<br><em>de l’Islam ancien</em></h1>
                    <p>
                        Explorez les lieux de la Sira, les villes du savoir, les champs de bataille et les grands axes d’expansion dans une interface cartographique documentée et progressive.
                    </p>
                    <div class="atlas-pro-hero-actions">
                        <button type="button" class="atlas-pro-primary" @click="showRandomLocation">
                            <i data-lucide="shuffle"></i> Découverte aléatoire
                        </button>
                        <button type="button" class="atlas-pro-secondary" @click="startQuiz">
                            <i data-lucide="brain-circuit"></i> Défi géographique
                        </button>
                    </div>
                    <p class="atlas-pro-method-note">
                        <i data-lucide="info"></i>
                        Les coordonnées et dates sont des repères pédagogiques. Elles ne remplacent pas un atlas historique critique ni une étude des variantes de sources.
                    </p>
                </div>

                <div class="atlas-pro-hero-panel">
                    <div class="atlas-pro-progress-head">
                        <div>
                            <span>Votre exploration</span>
                            <strong>{{ visited.length }} / {{ locations.length }} lieux</strong>
                        </div>
                        <b>{{ progressPercent }}%</b>
                    </div>
                    <div class="atlas-pro-progress-track"><span :style="{ width: progressPercent + '%' }"></span></div>
                    <div class="atlas-pro-stat-grid">
                        <div><strong>{{ stats.total }}</strong><span>fiches consolidées</span></div>
                        <div><strong>{{ stats.cities }}</strong><span>cités</span></div>
                        <div><strong>{{ stats.battles }}</strong><span>batailles</span></div>
                        <div><strong>{{ stats.regions }}</strong><span>régions</span></div>
                    </div>
                </div>
            </header>

            <nav class="atlas-pro-modebar" aria-label="Modes de consultation de l’Atlas">
                <button type="button" :class="{ active: viewMode === 'map' }" @click="setViewMode('map')"><i data-lucide="map-pinned"></i> Carte</button>
                <button type="button" :class="{ active: viewMode === 'directory' }" @click="setViewMode('directory')"><i data-lucide="layout-grid"></i> Répertoire</button>
                <button type="button" :class="{ active: viewMode === 'journeys' }" @click="setViewMode('journeys')"><i data-lucide="route"></i> Parcours guidés</button>
            </nav>

            <div class="atlas-pro-filterbar">
                <label class="atlas-pro-search">
                    <i data-lucide="search"></i>
                    <input v-model="filters.search" type="search" placeholder="Rechercher un lieu, une figure, une région…" aria-label="Rechercher dans l’Atlas">
                </label>

                <select v-model="filters.type" aria-label="Filtrer par type">
                    <option value="all">Tous les types</option>
                    <option v-for="(config, key) in typeConfig" :key="key" :value="key">{{ config.label }}</option>
                </select>

                <select v-model="filters.region" aria-label="Filtrer par région">
                    <option value="all">Toutes les régions</option>
                    <option v-for="region in regions" :key="region" :value="region">{{ region }}</option>
                </select>

                <select v-model="filters.era" aria-label="Filtrer par période">
                    <option value="all">Toutes les périodes</option>
                    <option v-for="(era, key) in eraConfig" :key="key" :value="key">{{ era.label }}</option>
                </select>

                <button type="button" class="atlas-pro-filter-favorite" :class="{ active: filters.favoritesOnly }" @click="filters.favoritesOnly = !filters.favoritesOnly">
                    <i data-lucide="heart"></i><span>Favoris</span>
                </button>

                <button v-if="filterCount" type="button" class="atlas-pro-reset" @click="resetFilters">
                    <i data-lucide="rotate-ccw"></i> Réinitialiser <b>{{ filterCount }}</b>
                </button>
            </div>

            <div class="atlas-pro-timebar">
                <div class="atlas-pro-time-copy">
                    <span>Chronologie visible</span>
                    <strong>{{ yearDisplay }}</strong>
                </div>
                <input v-model.number="filters.maxYear" type="range" min="-13" :max="totalYears" step="1" aria-label="Année maximale visible">
                <div class="atlas-pro-time-labels"><span>Avant l’Hégire</span><span>{{ totalYears }} H</span></div>
            </div>

            <div v-show="viewMode === 'map'" class="atlas-pro-map-layout">
                <aside class="atlas-pro-map-list">
                    <div class="atlas-pro-panel-heading">
                        <div><span>Résultats</span><strong>{{ filteredLocations.length }} lieux visibles</strong></div>
                        <button type="button" @click="fitVisible" title="Cadrer les résultats"><i data-lucide="scan"></i></button>
                    </div>

                    <div v-if="activeJourneyId && selectedJourney" class="atlas-pro-active-journey">
                        <div class="atlas-pro-journey-icon" :style="{ '--journey-accent': selectedJourney.accent }"><i :data-lucide="selectedJourney.icon"></i></div>
                        <div>
                            <span>Parcours actif</span>
                            <strong>{{ selectedJourney.title }}</strong>
                            <small>Étape {{ journeyStep + 1 }} sur {{ journeyLocations.length }}</small>
                        </div>
                        <button type="button" @click="stopJourney" title="Quitter le parcours"><i data-lucide="x"></i></button>
                    </div>

                    <div class="atlas-pro-list-scroll">
                        <button v-for="loc in filteredLocations" :key="loc.id" type="button" class="atlas-pro-list-item" :class="{ active: selectedLocation && selectedLocation.id === loc.id }" @click="openDetails(loc, true)">
                            <span class="atlas-pro-list-icon" :style="{ '--item-color': typeConfig[loc.type].color }"><i :data-lucide="typeConfig[loc.type].icon"></i></span>
                            <span class="atlas-pro-list-copy">
                                <strong>{{ loc.name }}</strong>
                                <small>{{ loc.region }} · {{ loc.yearLabel }}</small>
                            </span>
                            <i v-if="isFavorite(loc.id)" data-lucide="heart" class="atlas-pro-list-heart"></i>
                            <i data-lucide="chevron-right" class="atlas-pro-list-arrow"></i>
                        </button>
                        <div v-if="!filteredLocations.length" class="atlas-pro-empty">
                            <i data-lucide="map-off"></i>
                            <strong>Aucun lieu ne correspond aux filtres.</strong>
                            <button type="button" @click="resetFilters">Réinitialiser</button>
                        </div>
                    </div>
                </aside>

                <div class="atlas-pro-map-card">
                    <div id="atlas-pro-map" class="atlas-pro-map"></div>
                    <div class="atlas-pro-map-legend">
                        <span v-for="(config, key) in typeConfig" :key="key"><i :style="{ background: config.color }"></i>{{ config.label }}</span>
                    </div>

                    <div v-if="activeJourneyId && currentJourneyLocation" class="atlas-pro-journey-controller">
                        <button type="button" @click="previousJourneyStep" :disabled="journeyStep === 0"><i data-lucide="chevron-left"></i></button>
                        <div>
                            <span>Étape {{ journeyStep + 1 }} / {{ journeyLocations.length }}</span>
                            <strong>{{ currentJourneyLocation.name }}</strong>
                        </div>
                        <button type="button" @click="nextJourneyStep" :disabled="journeyStep >= journeyLocations.length - 1"><i data-lucide="chevron-right"></i></button>
                    </div>
                </div>
            </div>

            <div v-if="viewMode === 'directory'" class="atlas-pro-directory">
                <div class="atlas-pro-section-heading">
                    <div><span>Répertoire</span><h2>{{ filteredLocations.length }} fiches géographiques</h2></div>
                    <p>Chaque fiche réunit un repère chronologique, une localisation, les principales figures associées et un niveau de prudence éditoriale.</p>
                </div>

                <div class="atlas-pro-card-grid">
                    <article v-for="loc in displayedLocations" :key="loc.id" class="atlas-pro-place-card" :class="{ visited: isVisited(loc.id) }">
                        <button type="button" class="atlas-pro-card-favorite" :class="{ active: isFavorite(loc.id) }" @click.stop="toggleFavorite(loc.id)" :aria-label="isFavorite(loc.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'">
                            <i data-lucide="heart"></i>
                        </button>
                        <button type="button" class="atlas-pro-card-body" @click="openDetails(loc)">
                            <div class="atlas-pro-card-top">
                                <span class="atlas-pro-card-type" :style="{ '--type-color': typeConfig[loc.type].color }"><i :data-lucide="typeConfig[loc.type].icon"></i>{{ typeConfig[loc.type].label }}</span>
                                <span v-if="isVisited(loc.id)" class="atlas-pro-visited"><i data-lucide="check"></i> Exploré</span>
                            </div>
                            <h3>{{ loc.name }}</h3>
                            <p>{{ loc.summary }}</p>
                            <div class="atlas-pro-card-meta"><span><i data-lucide="calendar"></i>{{ loc.yearLabel }}</span><span><i data-lucide="map-pin"></i>{{ loc.region }}</span></div>
                            <div class="atlas-pro-card-footer"><span>{{ loc.figures.length }} figure{{ loc.figures.length > 1 ? 's' : '' }} liée{{ loc.figures.length > 1 ? 's' : '' }}</span><i data-lucide="arrow-right"></i></div>
                        </button>
                    </article>
                </div>

                <button v-if="visibleCount < filteredLocations.length" type="button" class="atlas-pro-load-more" @click="visibleCount += 24">
                    Afficher 24 fiches supplémentaires
                </button>
            </div>

            <div v-if="viewMode === 'journeys'" class="atlas-pro-journeys">
                <div class="atlas-pro-section-heading">
                    <div><span>Parcours guidés</span><h2>Apprendre l’histoire par l’espace</h2></div>
                    <p>Chaque parcours sélectionne une série de lieux, les relie sur la carte et vous accompagne étape par étape.</p>
                </div>

                <div class="atlas-pro-journey-grid">
                    <article v-for="journey in journeys" :key="journey.id" class="atlas-pro-journey-card" :style="{ '--journey-color': journey.accent }">
                        <div class="atlas-pro-journey-card-icon"><i :data-lucide="journey.icon"></i></div>
                        <span>{{ journey.subtitle }}</span>
                        <h3>{{ journey.title }}</h3>
                        <p>{{ journey.description }}</p>
                        <div class="atlas-pro-journey-steps">
                            <span v-for="(id, index) in journey.ids" :key="id"><b>{{ index + 1 }}</b>{{ locations.find(loc => loc.id === id)?.name || 'Étape' }}</span>
                        </div>
                        <button type="button" @click="startJourney(journey)"><i data-lucide="play"></i> Commencer le parcours</button>
                    </article>
                </div>
            </div>
        </div>

        <transition name="fade">
            <div v-if="detailsOpen && selectedLocation" class="atlas-pro-backdrop" @click.self="closeDetails"></div>
        </transition>

        <transition name="slide-right">
            <aside v-if="detailsOpen && selectedLocation" class="atlas-pro-drawer" role="dialog" aria-modal="true" :aria-label="'Fiche de ' + selectedLocation.name">
                <div class="atlas-pro-drawer-media">
                    <img v-if="selectedLocation.image && !imageFailed" :src="selectedLocation.image" :alt="selectedLocation.name" @error="imageFailed = true">
                    <div v-else class="atlas-pro-image-fallback"><i :data-lucide="typeConfig[selectedLocation.type].icon"></i></div>
                    <div class="atlas-pro-media-shade"></div>
                    <button type="button" class="atlas-pro-close" @click="closeDetails" aria-label="Fermer la fiche"><i data-lucide="x"></i></button>
                    <button type="button" class="atlas-pro-drawer-favorite" :class="{ active: isFavorite(selectedLocation.id) }" @click="toggleFavorite(selectedLocation.id)"><i data-lucide="heart"></i></button>
                    <div class="atlas-pro-drawer-title">
                        <span :style="{ '--type-color': typeConfig[selectedLocation.type].color }"><i :data-lucide="typeConfig[selectedLocation.type].icon"></i>{{ typeConfig[selectedLocation.type].label }}</span>
                        <h2>{{ selectedLocation.name }}</h2>
                        <p>{{ selectedLocation.yearLabel }} · {{ selectedLocation.region }}</p>
                    </div>
                </div>

                <nav class="atlas-pro-drawer-tabs">
                    <button type="button" :class="{ active: detailsTab === 'overview' }" @click="detailsTab = 'overview'">Vue d’ensemble</button>
                    <button type="button" :class="{ active: detailsTab === 'people' }" @click="detailsTab = 'people'">Figures</button>
                    <button type="button" :class="{ active: detailsTab === 'sources' }" @click="detailsTab = 'sources'">Sources & prudence</button>
                </nav>

                <div class="atlas-pro-drawer-scroll">
                    <div v-if="detailsTab === 'overview'" class="atlas-pro-tab-content">
                        <p class="atlas-pro-summary">{{ selectedLocation.summary }}</p>
                        <div class="atlas-pro-fact-grid">
                            <div><i data-lucide="calendar-days"></i><span>Période</span><strong>{{ eraConfig[selectedLocation.era]?.label || 'À préciser' }}</strong></div>
                            <div><i data-lucide="map-pin"></i><span>Région</span><strong>{{ selectedLocation.region }}</strong></div>
                            <div><i data-lucide="locate-fixed"></i><span>Coordonnées</span><strong>{{ selectedLocation.coords[0].toFixed(3) }}, {{ selectedLocation.coords[1].toFixed(3) }}</strong></div>
                            <div><i data-lucide="users"></i><span>Figures liées</span><strong>{{ selectedLocation.figures.length }}</strong></div>
                        </div>
                        <div v-if="selectedLocation.caution" class="atlas-pro-caution"><i data-lucide="triangle-alert"></i><div><strong>Point de prudence</strong><p>{{ selectedLocation.caution }}</p></div></div>
                        <div class="atlas-pro-coordinate-note"><i data-lucide="crosshair"></i><p>Le point cartographique sert de repère. Pour les batailles, itinéraires et sites anciens, l’emplacement exact peut être débattu ou couvrir une zone plus large.</p></div>
                    </div>

                    <div v-if="detailsTab === 'people'" class="atlas-pro-tab-content">
                        <div v-if="selectedLocation.figures.length" class="atlas-pro-figure-list">
                            <div v-for="figure in selectedLocation.figures" :key="figure"><span>{{ figure.charAt(0) }}</span><div><strong>{{ figure }}</strong><small>Figure associée dans les données de l’Atlas</small></div></div>
                        </div>
                        <div v-else class="atlas-pro-empty-tab"><i data-lucide="users-round"></i><p>Aucune figure n’est encore associée à cette fiche.</p></div>
                    </div>

                    <div v-if="detailsTab === 'sources'" class="atlas-pro-tab-content">
                        <div class="atlas-pro-editorial-card">
                            <i data-lucide="book-check"></i>
                            <div><strong>Lecture éditoriale</strong><p>Une référence affichée soutient un point précis. Elle ne certifie pas automatiquement chaque détail, date ou localisation de la notice.</p></div>
                        </div>
                        <div v-if="selectedLocation.sources.length" class="atlas-pro-source-list">
                            <a v-for="source in selectedLocation.sources" :key="source.label" :href="source.url" target="_blank" rel="noopener noreferrer"><i data-lucide="external-link"></i><span>{{ source.label }}</span></a>
                        </div>
                        <div v-else class="atlas-pro-empty-tab"><i data-lucide="book-dashed"></i><p>Aucune référence détaillée n’est encore attachée à cette fiche. Le repère reste pédagogique et doit être complété avant une utilisation académique.</p></div>
                    </div>
                </div>

                <div class="atlas-pro-drawer-actions">
                    <button type="button" @click="setViewMode('map'); openDetails(selectedLocation, true)"><i data-lucide="navigation"></i> Voir sur la carte</button>
                    <button type="button" :class="{ active: isFavorite(selectedLocation.id) }" @click="toggleFavorite(selectedLocation.id)"><i data-lucide="heart"></i>{{ isFavorite(selectedLocation.id) ? 'Enregistré' : 'Ajouter aux favoris' }}</button>
                </div>
            </aside>
        </transition>

        <transition name="fade">
            <div v-if="quiz" class="atlas-pro-quiz-backdrop" @click.self="closeQuiz">
                <section class="atlas-pro-quiz" role="dialog" aria-modal="true" aria-label="Défi géographique">
                    <button type="button" class="atlas-pro-quiz-close" @click="closeQuiz"><i data-lucide="x"></i></button>
                    <span class="atlas-pro-eyebrow"><i data-lucide="brain-circuit"></i> Défi géographique</span>
                    <h2>{{ quiz.question }}</h2>
                    <p>Score : {{ quizScore.correct }} / {{ quizScore.total }}</p>
                    <div class="atlas-pro-quiz-options">
                        <button v-for="option in quiz.options" :key="option" type="button" @click="answerQuiz(option)" :disabled="!!quizAnswer" :class="{ correct: quizAnswer && option === quiz.correct, wrong: quizAnswer === option && option !== quiz.correct }">{{ option }}</button>
                    </div>
                    <div v-if="quizAnswer" class="atlas-pro-quiz-result" :class="{ success: quizAnswer === quiz.correct }">
                        <i :data-lucide="quizAnswer === quiz.correct ? 'circle-check' : 'circle-x'"></i>
                        <div><strong>{{ quizAnswer === quiz.correct ? 'Bonne réponse' : 'À revoir' }}</strong><p>{{ quiz.location.name }} se situe dans la région « {{ quiz.correct }} ».</p></div>
                    </div>
                    <button v-if="quizAnswer" type="button" class="atlas-pro-primary" @click="startQuiz"><i data-lucide="refresh-cw"></i> Question suivante</button>
                </section>
            </div>
        </transition>
    </section>
    `
};
