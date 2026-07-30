// Fichier: js/components/ToolView.js

const ScholarAtlasModule = {
    props: ['settings'],
    setup(props) {
        const { ref, reactive, computed, watch, onMounted, onUnmounted, nextTick } = Vue;

        let map = null;
        let tileLayer = null;
        let markerLayer = null;
        let routeLayer = null;
        let resizeObserver = null;
        const markerByCity = new Map();

        const ready = ref(false);
        const loadError = ref('');
        const viewMode = ref('map');
        const listMode = ref('cities');
        const selectedCityId = ref(null);
        const selectedScholar = ref(null);
        const detailsOpen = ref(false);
        const detailsTab = ref('profile');
        const visibleCount = ref(18);
        const activeJourneyId = ref(null);
        const journeyStep = ref(0);
        const favorites = ref([]);
        const studied = ref([]);
        const quiz = ref(null);
        const quizAnswer = ref(null);
        const quizScore = ref({ correct: 0, total: 0 });
        const showMethodology = ref(false);
        const dataset = ref({ meta: {}, cities: [], scholars: [], journeys: [] });

        const filters = reactive({
            search: '',
            discipline: 'all',
            school: 'all',
            region: 'all',
            century: 'all',
            gender: 'all',
            favoritesOnly: false
        });

        const disciplineLabels = {
            Hadith: 'Hadith', Fiqh: 'Fiqh', Qiraat: 'Lectures', Tafsir: 'Tafsīr', Theology: 'Théologie',
            Usul: 'Uṣūl', Arabic: 'Langue arabe', History: 'Histoire', Biography: 'Biographie',
            Spiritualité: 'Spiritualité', Philosophy: 'Philosophie', Mathematics: 'Mathématiques',
            Astronomy: 'Astronomie', Geography: 'Géographie', Medicine: 'Médecine', Optics: 'Optique',
            Sciences: 'Sciences', Adab: 'Adab', Poetics: 'Poétique', Poetry: 'Poésie', Sociology: 'Société',
            'Legal Theory': 'Théorie juridique'
        };

        const disciplineColors = {
            Hadith: '#0f766e', Fiqh: '#a16207', Qiraat: '#2563eb', Tafsir: '#047857', Theology: '#7c3aed',
            Usul: '#b45309', Arabic: '#c2410c', History: '#475569', Biography: '#475569', Spiritualité: '#be185d',
            Philosophy: '#6d28d9', Mathematics: '#0369a1', Astronomy: '#0e7490', Geography: '#0284c7',
            Medicine: '#be123c', Optics: '#0891b2', Sciences: '#0369a1', Adab: '#c2410c', Poetics: '#c2410c',
            Poetry: '#be185d', Sociology: '#475569', 'Legal Theory': '#a16207'
        };

        const normalize = (value) => String(value || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[ʿʾ]/g, '')
            .toLowerCase();

        const loadScript = (src, id) => new Promise((resolve, reject) => {
            const existing = document.getElementById(id);
            if (existing) {
                if (existing.dataset.loaded === 'true') resolve();
                else {
                    existing.addEventListener('load', resolve, { once: true });
                    existing.addEventListener('error', reject, { once: true });
                }
                return;
            }
            const script = document.createElement('script');
            script.id = id;
            script.src = src;
            script.async = false;
            script.addEventListener('load', () => {
                script.dataset.loaded = 'true';
                resolve();
            }, { once: true });
            script.addEventListener('error', () => reject(new Error(`Impossible de charger ${src}`)), { once: true });
            document.body.appendChild(script);
        });

        const cityIndex = computed(() => new Map(dataset.value.cities.map((city) => [city.id, city])));
        const scholarIndex = computed(() => new Map(dataset.value.scholars.map((scholar) => [scholar.id, scholar])));

        const scholars = computed(() => dataset.value.scholars.map((scholar) => {
            const city = cityIndex.value.get(scholar.city) || null;
            const century = Math.max(1, Math.ceil(Number(scholar.died || 1) / 100));
            const searchText = normalize([
                scholar.name, scholar.arabic, scholar.title, scholar.knownFor, scholar.bio, scholar.legacy,
                scholar.school, scholar.disciplines.join(' '), scholar.works.join(' '), city ? city.name : '', city ? city.region : ''
            ].join(' '));
            return { ...scholar, cityData: city, century, searchText };
        }));

        const disciplines = computed(() => [...new Set(scholars.value.flatMap((scholar) => scholar.disciplines))]
            .sort((a, b) => (disciplineLabels[a] || a).localeCompare(disciplineLabels[b] || b, 'fr')));
        const schools = computed(() => [...new Set(scholars.value.map((scholar) => scholar.school))].sort((a, b) => a.localeCompare(b, 'fr')));
        const regions = computed(() => [...new Set(dataset.value.cities.map((city) => city.region))].sort((a, b) => a.localeCompare(b, 'fr')));
        const centuries = computed(() => [...new Set(scholars.value.map((scholar) => scholar.century))].sort((a, b) => a - b));

        const filteredScholars = computed(() => {
            const query = normalize(filters.search);
            return scholars.value.filter((scholar) => {
                const searchMatch = !query || scholar.searchText.includes(query);
                const disciplineMatch = filters.discipline === 'all' || scholar.disciplines.includes(filters.discipline);
                const schoolMatch = filters.school === 'all' || scholar.school === filters.school;
                const regionMatch = filters.region === 'all' || (scholar.cityData && scholar.cityData.region === filters.region);
                const centuryMatch = filters.century === 'all' || scholar.century === Number(filters.century);
                const genderMatch = filters.gender === 'all' || scholar.gender === filters.gender;
                const favoriteMatch = !filters.favoritesOnly || favorites.value.includes(scholar.id);
                return searchMatch && disciplineMatch && schoolMatch && regionMatch && centuryMatch && genderMatch && favoriteMatch;
            }).sort((a, b) => a.died - b.died || a.name.localeCompare(b.name, 'fr'));
        });

        const citiesWithScholars = computed(() => dataset.value.cities.map((city) => {
            const cityScholars = filteredScholars.value.filter((scholar) => scholar.city === city.id);
            return {
                ...city,
                scholars: cityScholars,
                dominant: cityScholars.length ? cityScholars[0].disciplines[0] : 'History'
            };
        }).filter((city) => city.scholars.length).sort((a, b) => b.scholars.length - a.scholars.length || a.name.localeCompare(b.name, 'fr')));

        const selectedCity = computed(() => selectedCityId.value ? citiesWithScholars.value.find((city) => city.id === selectedCityId.value) || null : null);
        const displayedScholars = computed(() => filteredScholars.value.slice(0, visibleCount.value));
        const selectedJourney = computed(() => dataset.value.journeys.find((journey) => journey.id === activeJourneyId.value) || null);
        const journeyScholars = computed(() => selectedJourney.value
            ? selectedJourney.value.scholarIds.map((id) => scholarIndex.value.get(id)).filter(Boolean)
            : []);
        const currentJourneyScholar = computed(() => journeyScholars.value[journeyStep.value] || null);
        const progressPercent = computed(() => scholars.value.length ? Math.round((studied.value.length / scholars.value.length) * 100) : 0);
        const filterCount = computed(() => [filters.discipline, filters.school, filters.region, filters.century, filters.gender]
            .filter((value) => value !== 'all').length + (filters.search ? 1 : 0) + (filters.favoritesOnly ? 1 : 0));

        const stats = computed(() => ({
            scholars: scholars.value.length,
            cities: new Set(scholars.value.map((scholar) => scholar.city)).size,
            women: scholars.value.filter((scholar) => scholar.gender === 'F').length,
            disciplines: disciplines.value.length
        }));

        const isFavorite = (id) => favorites.value.includes(id);
        const isStudied = (id) => studied.value.includes(id);
        const disciplineLabel = (key) => disciplineLabels[key] || key;
        const scholarColor = (scholar) => disciplineColors[scholar && scholar.disciplines ? scholar.disciplines[0] : 'History'] || '#64748b';
        const centuryLabel = (century) => `${century}${century === 1 ? 'er' : 'e'} siècle H`;
        const lifeLabel = (scholar) => `${scholar.born < 0 ? Math.abs(scholar.born) + ' av. H' : scholar.born + ' H'} — ${scholar.died} H`;

        const persist = (key, value) => {
            try { localStorage.setItem(key, JSON.stringify(value)); } catch (error) { console.warn('Stockage Atlas Savants indisponible', error); }
        };

        const loadLocalState = () => {
            try {
                favorites.value = JSON.parse(localStorage.getItem('athar_scholar_favorites_v1') || '[]');
                studied.value = JSON.parse(localStorage.getItem('athar_scholar_studied_v1') || '[]');
                const storedScore = JSON.parse(localStorage.getItem('athar_scholar_quiz_v1') || 'null');
                if (storedScore && Number.isFinite(storedScore.total)) quizScore.value = storedScore;
            } catch (error) {
                favorites.value = [];
                studied.value = [];
            }
        };

        const toggleFavorite = (id) => {
            favorites.value = isFavorite(id) ? favorites.value.filter((item) => item !== id) : [...favorites.value, id];
            persist('athar_scholar_favorites_v1', favorites.value);
        };

        const markStudied = (id) => {
            if (!studied.value.includes(id)) {
                studied.value = [...studied.value, id];
                persist('athar_scholar_studied_v1', studied.value);
            }
        };

        const refreshIcons = () => nextTick(() => {
            if (window.lucide) window.lucide.createIcons();
        });

        const mapConfig = {
            light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
            dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
        };

        const createCityIcon = (city, active = false) => {
            const color = disciplineColors[city.dominant] || '#64748b';
            return L.divIcon({
                className: 'scholar-atlas-marker-shell',
                html: `<div class="scholar-atlas-marker${active ? ' is-active' : ''}" style="--marker-color:${color}"><strong>${city.scholars.length}</strong><span>${city.scholars.length > 1 ? 'savants' : 'savant'}</span></div>`,
                iconSize: [58, 58],
                iconAnchor: [29, 29]
            });
        };

        const initMap = () => {
            const container = document.getElementById('scholar-atlas-map');
            if (!container || typeof L === 'undefined') return;
            if (map) map.remove();
            if (container._leaflet_id) container._leaflet_id = null;

            map = L.map(container, {
                zoomControl: false,
                attributionControl: true,
                minZoom: 2,
                worldCopyJump: true
            }).setView([32, 38], 3);

            L.control.zoom({ position: 'bottomright' }).addTo(map);
            tileLayer = L.tileLayer(props.settings && props.settings.darkMode ? mapConfig.dark : mapConfig.light, {
                maxZoom: 19,
                attribution: mapConfig.attribution
            }).addTo(map);

            markerLayer = typeof L.markerClusterGroup === 'function'
                ? L.markerClusterGroup({ showCoverageOnHover: false, maxClusterRadius: 52, spiderfyOnMaxZoom: true })
                : L.layerGroup();
            routeLayer = L.layerGroup();
            markerLayer.addTo(map);
            routeLayer.addTo(map);
            renderMarkers(false);

            setTimeout(() => map && map.invalidateSize(), 120);
            resizeObserver = new ResizeObserver(() => map && map.invalidateSize());
            resizeObserver.observe(container);
        };

        const renderMarkers = (fit = false) => {
            if (!map || !markerLayer) return;
            markerLayer.clearLayers();
            markerByCity.clear();

            const markers = citiesWithScholars.value.map((city) => {
                const marker = L.marker(city.coords, {
                    icon: createCityIcon(city, selectedCityId.value === city.id),
                    title: city.name,
                    keyboard: true
                });
                marker.bindTooltip(`<strong>${city.name}</strong><span>${city.scholars.length} figure${city.scholars.length > 1 ? 's' : ''}</span>`, {
                    direction: 'top', offset: [0, -24], className: 'scholar-atlas-tooltip'
                });
                marker.on('click', () => selectCity(city.id, true));
                markerByCity.set(city.id, marker);
                return marker;
            });

            if (typeof markerLayer.addLayers === 'function') markerLayer.addLayers(markers);
            else markers.forEach((marker) => markerLayer.addLayer(marker));

            if (fit && markers.length) {
                const bounds = typeof markerLayer.getBounds === 'function'
                    ? markerLayer.getBounds()
                    : L.latLngBounds(citiesWithScholars.value.map((city) => city.coords));
                if (bounds.isValid()) map.fitBounds(bounds.pad(0.1), { maxZoom: 6 });
            }
        };

        const drawRoute = (scholar = null) => {
            if (!routeLayer) return;
            routeLayer.clearLayers();
            let cityIds = [];
            let color = '#c5a059';

            if (selectedJourney.value) {
                cityIds = journeyScholars.value.map((item) => item.city);
                color = selectedJourney.value.accent;
            } else if (scholar) {
                cityIds = scholar.routes;
                color = scholarColor(scholar);
            }

            const unique = cityIds.filter((id, index) => index === 0 || id !== cityIds[index - 1]);
            const points = unique.map((id) => cityIndex.value.get(id)).filter(Boolean).map((city) => city.coords);
            if (points.length > 1) {
                L.polyline(points, { color, weight: 4, opacity: 0.78, dashArray: '2 9', lineCap: 'round' }).addTo(routeLayer);
                const bounds = L.latLngBounds(points);
                if (bounds.isValid()) map.fitBounds(bounds.pad(0.18), { maxZoom: 6 });
            }
        };

        const selectCity = (cityId, fly = false) => {
            selectedCityId.value = cityId;
            listMode.value = 'scholars';
            const city = cityIndex.value.get(cityId);
            if (fly && map && city) map.flyTo(city.coords, Math.max(map.getZoom(), 6), { duration: 0.85 });
            renderMarkers(false);
            refreshIcons();
        };

        const clearSelectedCity = () => {
            selectedCityId.value = null;
            listMode.value = 'cities';
            renderMarkers(false);
            refreshIcons();
        };

        const openScholar = (scholar, fly = false) => {
            if (!scholar) return;
            selectedScholar.value = scholar;
            detailsTab.value = 'profile';
            detailsOpen.value = true;
            markStudied(scholar.id);
            selectedCityId.value = scholar.city;
            if (fly && map && scholar.cityData) map.flyTo(scholar.cityData.coords, Math.max(map.getZoom(), 7), { duration: 0.9 });
            drawRoute(scholar);
            renderMarkers(false);
            refreshIcons();
        };

        const closeDetails = () => {
            detailsOpen.value = false;
            selectedScholar.value = null;
            if (!activeJourneyId.value && routeLayer) routeLayer.clearLayers();
            renderMarkers(false);
        };

        const setViewMode = (mode) => {
            viewMode.value = mode;
            if (mode === 'map') nextTick(() => {
                if (!map) initMap();
                else {
                    map.invalidateSize();
                    renderMarkers(false);
                    drawRoute(selectedScholar.value);
                }
            });
            refreshIcons();
        };

        const resetFilters = () => {
            filters.search = '';
            filters.discipline = 'all';
            filters.school = 'all';
            filters.region = 'all';
            filters.century = 'all';
            filters.gender = 'all';
            filters.favoritesOnly = false;
            visibleCount.value = 18;
            clearSelectedCity();
        };

        const showRandomScholar = () => {
            const pool = filteredScholars.value.length ? filteredScholars.value : scholars.value;
            if (!pool.length) return;
            const scholar = pool[Math.floor(Math.random() * pool.length)];
            setViewMode('map');
            nextTick(() => openScholar(scholar, true));
        };

        const startJourney = (journey) => {
            activeJourneyId.value = journey.id;
            journeyStep.value = 0;
            setViewMode('map');
            nextTick(() => {
                drawRoute();
                if (currentJourneyScholar.value) openScholar(currentJourneyScholar.value, false);
            });
        };

        const stopJourney = () => {
            activeJourneyId.value = null;
            journeyStep.value = 0;
            if (routeLayer) routeLayer.clearLayers();
            closeDetails();
        };

        const goToJourneyStep = (index) => {
            if (index < 0 || index >= journeyScholars.value.length) return;
            journeyStep.value = index;
            const scholar = currentJourneyScholar.value;
            if (scholar) openScholar(scholar, true);
        };
        const nextJourneyStep = () => goToJourneyStep(journeyStep.value + 1);
        const previousJourneyStep = () => goToJourneyStep(journeyStep.value - 1);

        const startQuiz = () => {
            if (scholars.value.length < 4) return;
            const answer = scholars.value[Math.floor(Math.random() * scholars.value.length)];
            const type = answer.works.length ? ['work', 'city', 'discipline'][Math.floor(Math.random() * 3)] : ['city', 'discipline'][Math.floor(Math.random() * 2)];
            const distractors = scholars.value.filter((item) => item.id !== answer.id).sort(() => Math.random() - 0.5).slice(0, 3);
            const options = [...distractors, answer].sort(() => Math.random() - 0.5);
            let prompt = '';
            let clue = '';
            if (type === 'work') {
                const work = answer.works[Math.floor(Math.random() * answer.works.length)];
                prompt = `Qui est associé à « ${work} » ?`;
                clue = 'Œuvre et auteur';
            } else if (type === 'city') {
                prompt = `Quel savant est principalement rattaché à ${answer.cityData ? answer.cityData.name : 'cette ville'} ?`;
                clue = 'Géographie du savoir';
            } else {
                prompt = `Qui correspond au profil : ${answer.disciplines.slice(0, 2).map(disciplineLabel).join(' · ')} ?`;
                clue = 'Discipline savante';
            }
            quiz.value = { answer, options, prompt, clue };
            quizAnswer.value = null;
            refreshIcons();
        };

        const answerQuiz = (option) => {
            if (!quiz.value || quizAnswer.value) return;
            quizAnswer.value = option;
            quizScore.value = {
                correct: quizScore.value.correct + (option.id === quiz.value.answer.id ? 1 : 0),
                total: quizScore.value.total + 1
            };
        };

        const closeQuiz = () => {
            quiz.value = null;
            quizAnswer.value = null;
        };

        watch(() => props.settings && props.settings.darkMode, (isDark) => {
            if (tileLayer) tileLayer.setUrl(isDark ? mapConfig.dark : mapConfig.light);
        });

        watch(filteredScholars, () => {
            visibleCount.value = 18;
            if (selectedCityId.value && !citiesWithScholars.value.some((city) => city.id === selectedCityId.value)) clearSelectedCity();
            renderMarkers(false);
            refreshIcons();
        });

        watch(quizScore, (value) => persist('athar_scholar_quiz_v1', value), { deep: true });

        onMounted(async () => {
            loadLocalState();
            try {
                if (!window.SCHOLAR_ATLAS_DATA) {
                    await loadScript('scholar_atlas_core.js?v=athar-pro-v8', 'athar-scholar-atlas-core');
                    await loadScript('scholar_atlas_traditions.js?v=athar-pro-v8', 'athar-scholar-atlas-traditions');
                    await loadScript('scholar_atlas_thought.js?v=athar-pro-v8', 'athar-scholar-atlas-thought');
                }
                if (!window.SCHOLAR_ATLAS_DATA || !window.SCHOLAR_ATLAS_DATA.scholars.length) throw new Error('La base Atlas Savants est vide.');
                dataset.value = window.SCHOLAR_ATLAS_DATA;
                ready.value = true;
                await nextTick();
                initMap();
                refreshIcons();
            } catch (error) {
                console.error('Atlas Savants:', error);
                loadError.value = error.message || 'Le module ne peut pas être chargé.';
            }
        });

        onUnmounted(() => {
            if (resizeObserver) resizeObserver.disconnect();
            if (map) map.remove();
            map = null;
        });

        return {
            ready, loadError, viewMode, listMode, filters, dataset, scholars, filteredScholars, displayedScholars,
            disciplines, schools, regions, centuries, citiesWithScholars, selectedCity, selectedCityId,
            selectedScholar, detailsOpen, detailsTab, visibleCount, activeJourneyId, selectedJourney,
            journeyStep, journeyScholars, currentJourneyScholar, favorites, studied, quiz, quizAnswer, quizScore,
            showMethodology, progressPercent, filterCount, stats, disciplineLabel, scholarColor, centuryLabel,
            lifeLabel, isFavorite, isStudied, toggleFavorite, selectCity, clearSelectedCity, openScholar,
            closeDetails, setViewMode, resetFilters, showRandomScholar, startJourney, stopJourney,
            nextJourneyStep, previousJourneyStep, goToJourneyStep, startQuiz, answerQuiz, closeQuiz
        };
    },
    template: `
    <section class="scholar-atlas-shell">
        <div v-if="!ready && !loadError" class="scholar-atlas-loading">
            <div class="scholar-atlas-loader"></div>
            <strong>Construction de la carte du savoir…</strong>
            <span>Chargement des villes, des itinéraires et des fiches.</span>
        </div>

        <div v-else-if="loadError" class="scholar-atlas-error">
            <i data-lucide="triangle-alert"></i>
            <h2>Atlas Savants indisponible</h2>
            <p>{{ loadError }}</p>
            <button type="button" onclick="window.location.reload()"><i data-lucide="refresh-cw"></i> Recharger</button>
        </div>

        <template v-else>
            <div class="scholar-atlas-orb scholar-atlas-orb-one"></div>
            <div class="scholar-atlas-orb scholar-atlas-orb-two"></div>

            <div class="scholar-atlas-container">
                <header class="scholar-atlas-hero">
                    <div class="scholar-atlas-hero-copy">
                        <span class="scholar-atlas-eyebrow"><i data-lucide="globe-2"></i> Géographie du savoir</span>
                        <h1>Atlas des <em>savants</em></h1>
                        <p>Explorez les villes, les voyages, les disciplines et les œuvres qui ont façonné l’histoire intellectuelle islamique, du premier siècle de l’Hégire aux grandes synthèses classiques.</p>
                        <div class="scholar-atlas-hero-actions">
                            <button type="button" class="scholar-atlas-primary" @click="showRandomScholar"><i data-lucide="shuffle"></i> Découverte aléatoire</button>
                            <button type="button" class="scholar-atlas-secondary" @click="startQuiz"><i data-lucide="brain-circuit"></i> Défi du savoir</button>
                            <button type="button" class="scholar-atlas-ghost" @click="showMethodology = true"><i data-lucide="info"></i> Méthodologie</button>
                        </div>
                    </div>

                    <div class="scholar-atlas-progress-card">
                        <div class="scholar-atlas-progress-head">
                            <div><span>Votre parcours</span><strong>{{ studied.length }} / {{ scholars.length }} fiches étudiées</strong></div>
                            <b>{{ progressPercent }}%</b>
                        </div>
                        <div class="scholar-atlas-progress-track"><span :style="{ width: progressPercent + '%' }"></span></div>
                        <div class="scholar-atlas-stat-grid">
                            <div><strong>{{ stats.scholars }}</strong><span>savants</span></div>
                            <div><strong>{{ stats.cities }}</strong><span>foyers</span></div>
                            <div><strong>{{ stats.disciplines }}</strong><span>disciplines</span></div>
                            <div><strong>{{ stats.women }}</strong><span>femmes de savoir</span></div>
                        </div>
                    </div>
                </header>

                <nav class="scholar-atlas-modebar" aria-label="Modes de consultation">
                    <button type="button" :class="{ active: viewMode === 'map' }" @click="setViewMode('map')"><i data-lucide="map-pinned"></i> Carte</button>
                    <button type="button" :class="{ active: viewMode === 'directory' }" @click="setViewMode('directory')"><i data-lucide="layout-grid"></i> Répertoire</button>
                    <button type="button" :class="{ active: viewMode === 'journeys' }" @click="setViewMode('journeys')"><i data-lucide="route"></i> Parcours</button>
                </nav>

                <div class="scholar-atlas-filterbar">
                    <label class="scholar-atlas-search"><i data-lucide="search"></i><input v-model="filters.search" type="search" placeholder="Nom, œuvre, ville, discipline…" aria-label="Rechercher un savant"></label>
                    <select v-model="filters.discipline" aria-label="Filtrer par discipline"><option value="all">Toutes les disciplines</option><option v-for="discipline in disciplines" :key="discipline" :value="discipline">{{ disciplineLabel(discipline) }}</option></select>
                    <select v-model="filters.school" aria-label="Filtrer par école"><option value="all">Toutes les écoles</option><option v-for="school in schools" :key="school" :value="school">{{ school }}</option></select>
                    <select v-model="filters.region" aria-label="Filtrer par région"><option value="all">Toutes les régions</option><option v-for="region in regions" :key="region" :value="region">{{ region }}</option></select>
                    <select v-model="filters.century" aria-label="Filtrer par siècle"><option value="all">Tous les siècles</option><option v-for="century in centuries" :key="century" :value="century">{{ centuryLabel(century) }}</option></select>
                    <select v-model="filters.gender" aria-label="Filtrer les profils"><option value="all">Tous les profils</option><option value="F">Femmes de savoir</option><option value="M">Hommes</option></select>
                    <button type="button" class="scholar-atlas-favorite-filter" :class="{ active: filters.favoritesOnly }" @click="filters.favoritesOnly = !filters.favoritesOnly"><i data-lucide="heart"></i> Favoris</button>
                    <button v-if="filterCount" type="button" class="scholar-atlas-reset" @click="resetFilters"><i data-lucide="rotate-ccw"></i><b>{{ filterCount }}</b></button>
                </div>

                <div v-show="viewMode === 'map'" class="scholar-atlas-map-layout">
                    <aside class="scholar-atlas-sidebar">
                        <div class="scholar-atlas-sidebar-head">
                            <button v-if="listMode === 'scholars'" type="button" @click="clearSelectedCity"><i data-lucide="arrow-left"></i></button>
                            <div>
                                <span>{{ listMode === 'cities' ? 'Foyers du savoir' : selectedCity?.region }}</span>
                                <strong>{{ listMode === 'cities' ? citiesWithScholars.length + ' villes visibles' : selectedCity?.name }}</strong>
                            </div>
                            <button v-if="listMode === 'cities'" type="button" @click="() => { if (citiesWithScholars.length) selectCity(citiesWithScholars[0].id, true) }" title="Ouvrir le premier foyer"><i data-lucide="locate-fixed"></i></button>
                        </div>

                        <div v-if="activeJourneyId && selectedJourney" class="scholar-atlas-active-journey">
                            <div :style="{ '--journey-color': selectedJourney.accent }"><i :data-lucide="selectedJourney.icon"></i></div>
                            <span><small>Parcours actif</small><strong>{{ selectedJourney.title }}</strong><b>Étape {{ journeyStep + 1 }} / {{ journeyScholars.length }}</b></span>
                            <button type="button" @click="stopJourney"><i data-lucide="x"></i></button>
                        </div>

                        <div class="scholar-atlas-sidebar-scroll">
                            <template v-if="listMode === 'cities'">
                                <button v-for="city in citiesWithScholars" :key="city.id" type="button" class="scholar-atlas-city-row" :class="{ active: selectedCityId === city.id }" @click="selectCity(city.id, true)">
                                    <span class="scholar-atlas-city-count" :style="{ '--city-color': scholarColor(city.scholars[0]) }"><strong>{{ city.scholars.length }}</strong><small>profil{{ city.scholars.length > 1 ? 's' : '' }}</small></span>
                                    <span><strong>{{ city.name }}</strong><small>{{ city.region }} · {{ city.scholars.slice(0, 2).map(s => s.name).join(', ') }}</small></span>
                                    <i data-lucide="chevron-right"></i>
                                </button>
                            </template>
                            <template v-else>
                                <button v-for="scholar in selectedCity?.scholars || []" :key="scholar.id" type="button" class="scholar-atlas-scholar-row" @click="openScholar(scholar, true)">
                                    <span class="scholar-atlas-mini-avatar" :style="{ '--scholar-color': scholarColor(scholar) }">{{ scholar.arabic.slice(0, 1) }}</span>
                                    <span><strong>{{ scholar.name }}</strong><small>{{ scholar.title }} · {{ scholar.died }} H</small></span>
                                    <i v-if="isFavorite(scholar.id)" data-lucide="heart" class="scholar-atlas-row-heart"></i>
                                    <i data-lucide="chevron-right"></i>
                                </button>
                            </template>
                        </div>
                    </aside>

                    <div class="scholar-atlas-map-card">
                        <div id="scholar-atlas-map" class="scholar-atlas-map"></div>
                        <div class="scholar-atlas-map-legend"><span><i style="background:#0f766e"></i>Hadith</span><span><i style="background:#a16207"></i>Fiqh</span><span><i style="background:#2563eb"></i>Lectures</span><span><i style="background:#0369a1"></i>Sciences</span></div>
                        <div v-if="activeJourneyId && currentJourneyScholar" class="scholar-atlas-journey-controller">
                            <button type="button" @click="previousJourneyStep" :disabled="journeyStep === 0"><i data-lucide="chevron-left"></i></button>
                            <div><span>Étape {{ journeyStep + 1 }} / {{ journeyScholars.length }}</span><strong>{{ currentJourneyScholar.name }}</strong><small>{{ currentJourneyScholar.cityData?.name }}</small></div>
                            <button type="button" @click="nextJourneyStep" :disabled="journeyStep >= journeyScholars.length - 1"><i data-lucide="chevron-right"></i></button>
                        </div>
                    </div>
                </div>

                <div v-if="viewMode === 'directory'" class="scholar-atlas-directory">
                    <div class="scholar-atlas-section-heading"><div><span>Répertoire</span><h2>{{ filteredScholars.length }} profils savants</h2></div><p>Parcourez les fiches par ordre chronologique, ajoutez vos favoris et suivez votre progression.</p></div>
                    <div class="scholar-atlas-card-grid">
                        <article v-for="scholar in displayedScholars" :key="scholar.id" class="scholar-atlas-card" :class="{ studied: isStudied(scholar.id) }" :style="{ '--scholar-color': scholarColor(scholar) }">
                            <button type="button" class="scholar-atlas-card-favorite" :class="{ active: isFavorite(scholar.id) }" @click.stop="toggleFavorite(scholar.id)" :aria-label="isFavorite(scholar.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'"><i data-lucide="heart"></i></button>
                            <button type="button" class="scholar-atlas-card-body" @click="openScholar(scholar)">
                                <div class="scholar-atlas-card-top"><span class="scholar-atlas-avatar">{{ scholar.arabic.slice(0, 1) }}</span><span v-if="isStudied(scholar.id)" class="scholar-atlas-studied"><i data-lucide="check"></i> Étudié</span></div>
                                <p class="scholar-atlas-arabic">{{ scholar.arabic }}</p><h3>{{ scholar.name }}</h3><span class="scholar-atlas-card-title">{{ scholar.title }}</span><p>{{ scholar.knownFor }}</p>
                                <div class="scholar-atlas-tags"><span v-for="discipline in scholar.disciplines.slice(0, 3)" :key="discipline">{{ disciplineLabel(discipline) }}</span></div>
                                <div class="scholar-atlas-card-footer"><span><i data-lucide="map-pin"></i>{{ scholar.cityData?.name }}</span><span><i data-lucide="calendar"></i>{{ scholar.died }} H</span></div>
                            </button>
                        </article>
                    </div>
                    <button v-if="visibleCount < filteredScholars.length" type="button" class="scholar-atlas-load-more" @click="visibleCount += 18">Afficher davantage</button>
                </div>

                <div v-if="viewMode === 'journeys'" class="scholar-atlas-journeys">
                    <div class="scholar-atlas-section-heading"><div><span>Parcours guidés</span><h2>Apprendre par les itinéraires</h2></div><p>Chaque parcours relie des figures, des villes et des disciplines autour d’un fil pédagogique.</p></div>
                    <div class="scholar-atlas-journey-grid">
                        <article v-for="journey in dataset.journeys" :key="journey.id" class="scholar-atlas-journey-card" :style="{ '--journey-color': journey.accent }">
                            <div class="scholar-atlas-journey-icon"><i :data-lucide="journey.icon"></i></div><span>{{ journey.subtitle }}</span><h3>{{ journey.title }}</h3><p>{{ journey.description }}</p>
                            <div class="scholar-atlas-journey-steps"><span v-for="(id, index) in journey.scholarIds.slice(0, 6)" :key="id"><b>{{ index + 1 }}</b>{{ scholars.find(s => s.id === id)?.name }}</span><small v-if="journey.scholarIds.length > 6">+ {{ journey.scholarIds.length - 6 }} autres étapes</small></div>
                            <button type="button" @click="startJourney(journey)"><i data-lucide="play"></i> Commencer le parcours</button>
                        </article>
                    </div>
                </div>
            </div>

            <transition name="fade"><div v-if="detailsOpen" class="scholar-atlas-backdrop" @click="closeDetails"></div></transition>
            <transition name="slide-right">
                <aside v-if="detailsOpen && selectedScholar" class="scholar-atlas-drawer">
                    <div class="scholar-atlas-drawer-hero" :style="{ '--scholar-color': scholarColor(selectedScholar) }">
                        <button type="button" class="scholar-atlas-drawer-close" @click="closeDetails"><i data-lucide="x"></i></button>
                        <button type="button" class="scholar-atlas-drawer-favorite" :class="{ active: isFavorite(selectedScholar.id) }" @click="toggleFavorite(selectedScholar.id)"><i data-lucide="heart"></i></button>
                        <div class="scholar-atlas-drawer-avatar">{{ selectedScholar.arabic.slice(0, 1) }}</div><p>{{ selectedScholar.arabic }}</p><h2>{{ selectedScholar.name }}</h2><span>{{ selectedScholar.title }}</span>
                    </div>
                    <nav class="scholar-atlas-drawer-tabs"><button :class="{ active: detailsTab === 'profile' }" @click="detailsTab = 'profile'">Profil</button><button :class="{ active: detailsTab === 'works' }" @click="detailsTab = 'works'">Œuvres</button><button :class="{ active: detailsTab === 'journey' }" @click="detailsTab = 'journey'">Géographie</button><button :class="{ active: detailsTab === 'sources' }" @click="detailsTab = 'sources'">Sources</button></nav>
                    <div class="scholar-atlas-drawer-scroll">
                        <section v-if="detailsTab === 'profile'" class="scholar-atlas-tab-content"><p class="scholar-atlas-lead">{{ selectedScholar.knownFor }}</p><p>{{ selectedScholar.bio }}</p><div class="scholar-atlas-fact-grid"><div><i data-lucide="calendar"></i><span>Vie</span><strong>{{ lifeLabel(selectedScholar) }}</strong></div><div><i data-lucide="map-pin"></i><span>Foyer principal</span><strong>{{ selectedScholar.cityData?.name }}</strong></div><div><i data-lucide="landmark"></i><span>École</span><strong>{{ selectedScholar.school }}</strong></div><div><i data-lucide="book-open"></i><span>Disciplines</span><strong>{{ selectedScholar.disciplines.map(disciplineLabel).join(', ') }}</strong></div></div><div class="scholar-atlas-legacy"><i data-lucide="sparkles"></i><div><strong>Héritage intellectuel</strong><p>{{ selectedScholar.legacy }}</p></div></div></section>
                        <section v-else-if="detailsTab === 'works'" class="scholar-atlas-tab-content"><div v-if="selectedScholar.works.length" class="scholar-atlas-work-list"><div v-for="(work, index) in selectedScholar.works" :key="work"><b>{{ String(index + 1).padStart(2, '0') }}</b><span><strong>{{ work }}</strong><small>Œuvre ou attribution associée à cette figure.</small></span></div></div><div v-else class="scholar-atlas-empty-tab"><i data-lucide="library"></i><p>Aucune œuvre précise n’est affichée : l’influence de cette figure repose principalement sur l’enseignement oral et la transmission.</p></div></section>
                        <section v-else-if="detailsTab === 'journey'" class="scholar-atlas-tab-content"><div class="scholar-atlas-route-list"><div v-for="(cityId, index) in selectedScholar.routes" :key="cityId"><b>{{ index + 1 }}</b><span><strong>{{ dataset.cities.find(c => c.id === cityId)?.name }}</strong><small>{{ dataset.cities.find(c => c.id === cityId)?.region }}</small></span><i data-lucide="arrow-down" v-if="index < selectedScholar.routes.length - 1"></i></div></div><p class="scholar-atlas-note"><i data-lucide="info"></i> Cet itinéraire est une reconstruction pédagogique des principales étapes connues ou rapportées, et non un journal exhaustif de tous les déplacements.</p></section>
                        <section v-else class="scholar-atlas-tab-content"><div class="scholar-atlas-source-list"><div v-for="source in selectedScholar.sources" :key="source"><i data-lucide="book-marked"></i><span><strong>{{ source }}</strong><small>Référence bibliographique indicative à consulter dans une édition critique.</small></span></div></div><div class="scholar-atlas-editorial"><i data-lucide="shield-check"></i><div><strong>Prudence éditoriale</strong><p>Les notices distinguent autant que possible le repère pédagogique de l’affirmation historique. Les dates et itinéraires peuvent connaître des variantes.</p></div></div></section>
                    </div>
                </aside>
            </transition>

            <div v-if="showMethodology" class="scholar-atlas-modal-backdrop" @click.self="showMethodology = false"><div class="scholar-atlas-method-modal"><button type="button" @click="showMethodology = false"><i data-lucide="x"></i></button><span>Méthodologie éditoriale</span><h2>Comment lire cet Atlas ?</h2><p>{{ dataset.meta.scope }}</p><div><article v-for="(item, index) in dataset.meta.methodology" :key="item"><b>{{ index + 1 }}</b><p>{{ item }}</p></article></div></div></div>

            <div v-if="quiz" class="scholar-atlas-modal-backdrop" @click.self="closeQuiz"><div class="scholar-atlas-quiz"><button class="scholar-atlas-quiz-close" type="button" @click="closeQuiz"><i data-lucide="x"></i></button><span>{{ quiz.clue }}</span><h2>{{ quiz.prompt }}</h2><p>Score : {{ quizScore.correct }} / {{ quizScore.total }}</p><div class="scholar-atlas-quiz-options"><button v-for="option in quiz.options" :key="option.id" type="button" :disabled="!!quizAnswer" :class="{ correct: quizAnswer && option.id === quiz.answer.id, wrong: quizAnswer && quizAnswer.id === option.id && option.id !== quiz.answer.id }" @click="answerQuiz(option)">{{ option.name }}</button></div><div v-if="quizAnswer" class="scholar-atlas-quiz-result" :class="{ success: quizAnswer.id === quiz.answer.id }"><i :data-lucide="quizAnswer.id === quiz.answer.id ? 'circle-check' : 'circle-x'"></i><div><strong>{{ quizAnswer.id === quiz.answer.id ? 'Bonne réponse' : 'À revoir' }}</strong><p>{{ quiz.answer.name }} — {{ quiz.answer.knownFor }}</p></div></div><button v-if="quizAnswer" type="button" class="scholar-atlas-next-quiz" @click="startQuiz">Question suivante</button></div></div>
        </template>
    </section>
    `
};

const ToolView = {
    components: { 'scholar-atlas-module': ScholarAtlasModule },
    props: ['currentTool', 'settings'],
    data() {
        return { amount: 1, currencyType: 'dinar' };
    },
    computed: {
        toolData() {
            return typeof EXTENSIONS_DATA !== 'undefined' && EXTENSIONS_DATA[this.currentTool]
                ? EXTENSIONS_DATA[this.currentTool]
                : null;
        },
        convertedValue() {
            if (!this.toolData || !this.toolData.rates) return 0;
            const rates = this.toolData.rates;
            const value = this.currencyType === 'dinar'
                ? this.amount * rates.dinar_weight * rates.gold_gram
                : this.amount * rates.dirham_weight * rates.silver_gram;
            return value.toFixed(2);
        }
    },
    template: `
    <scholar-atlas-module v-if="currentTool === 'scholars_map'" :settings="settings"></scholar-atlas-module>
    <div v-else class="h-full flex flex-col bg-brand-paper dark:bg-brand-dark overflow-y-auto">
        <header v-if="toolData" class="p-8 pb-4 text-center animate-fade-in">
            <div class="w-16 h-16 mx-auto bg-brand-gold/10 rounded-full flex items-center justify-center mb-4 text-brand-gold"><i :data-lucide="toolData.icon" class="w-8 h-8"></i></div>
            <h1 class="font-display text-3xl font-bold text-brand-dark dark:text-white mb-2">{{ toolData.title }}</h1>
            <p class="text-sm text-gray-500 font-serif italic">{{ toolData.desc }}</p>
        </header>
        <div class="flex-1 p-6 md:p-12 max-w-4xl mx-auto w-full">
            <div v-if="!toolData" class="text-center text-red-500">Erreur : données introuvables pour {{ currentTool }}</div>
            <div v-else-if="currentTool === 'currency'" class="bg-white dark:bg-brand-dark-lighter p-8 rounded-2xl shadow-card border border-brand-gold/20 animate-slide-up">
                <div class="flex flex-col gap-6">
                    <div class="flex justify-center gap-4 mb-4"><button @click="currencyType = 'dinar'" :class="['px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-all', currencyType === 'dinar' ? 'bg-brand-gold text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500']">Dinar (Or)</button><button @click="currencyType = 'dirham'" :class="['px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-all', currencyType === 'dirham' ? 'bg-gray-400 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500']">Dirham (Argent)</button></div>
                    <div class="text-center"><label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Quantité historique</label><div class="flex items-center justify-center gap-4"><input type="number" v-model="amount" class="w-32 text-center text-4xl font-display font-bold bg-transparent border-b-2 border-brand-gold/30 focus:border-brand-gold outline-none text-brand-dark dark:text-white p-2"><span class="text-xl font-serif text-gray-500">{{ currencyType === 'dinar' ? 'Dinars' : 'Dirhams' }}</span></div></div>
                    <div class="h-px bg-gray-200 dark:bg-gray-700 w-1/2 mx-auto my-4"></div>
                    <div class="text-center"><label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Valeur estimée aujourd’hui</label><div class="text-5xl font-display font-bold text-brand-gold">{{ convertedValue }} <span class="text-2xl text-gray-400">€</span></div><p class="text-[10px] text-gray-400 mt-2">Estimation fondée sur les valeurs configurées dans le projet.</p></div>
                </div>
            </div>
            <div v-else class="text-center py-20 bg-white dark:bg-brand-dark-lighter rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 animate-fade-in"><div class="w-20 h-20 mx-auto bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 text-gray-300"><i data-lucide="hammer" class="w-10 h-10"></i></div><h3 class="font-bold text-lg text-gray-400">Section en construction</h3><p class="text-sm text-gray-400 mt-2">L’implémentation de ce module est en cours.</p></div>
        </div>
    </div>
    `,
    mounted() { if (window.lucide) window.lucide.createIcons(); },
    updated() { if (window.lucide) window.lucide.createIcons(); }
};
