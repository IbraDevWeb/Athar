// Athar Pro — Le Ciel des Anciens
// Planisphère SVG léger : aucune dépendance WebGL, aucun calcul d’éphémérides.
window.AncientSkyView = {
    props: ['settings'],

    setup() {
        const { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } = Vue;
        const data = window.ANCIENT_SKY_DATA || { meta: {}, seasons: [], moments: [], categories: [], guides: [], objects: [], links: [] };

        const seasonId = ref('winter');
        const momentId = ref(2);
        const categoryId = ref('all');
        const selectedId = ref('polaris');
        const showLabels = ref(true);
        const showLines = ref(true);
        const showAbout = ref(false);
        const activeGuideId = ref(null);
        const guideStep = ref(0);

        const objectMap = computed(() => new Map(data.objects.map((object) => [object.id, object])));
        const season = computed(() => data.seasons.find((item) => item.id === seasonId.value) || data.seasons[0] || {});
        const moment = computed(() => data.moments.find((item) => Number(item.id) === Number(momentId.value)) || data.moments[2] || { offset: 0, label: '' });
        const activeGuide = computed(() => data.guides.find((guide) => guide.id === activeGuideId.value) || null);
        const activeGuideStep = computed(() => activeGuide.value?.steps?.[guideStep.value] || null);

        const project = (altitude, azimuth) => {
            const radius = ((90 - altitude) / 90) * 42;
            const radians = (azimuth * Math.PI) / 180;
            return {
                x: 50 + radius * Math.sin(radians),
                y: 50 - radius * Math.cos(radians)
            };
        };

        const sceneObjects = computed(() => data.objects.map((object) => {
            const raw = object.positions?.[seasonId.value];
            if (!raw) return null;
            const altitude = Number(raw[0]);
            if (altitude <= 0) return null;
            const azimuth = (Number(raw[1]) + Number(moment.value.offset || 0) + 360) % 360;
            const point = project(altitude, azimuth);
            return { ...object, altitude, azimuth, x: point.x, y: point.y };
        }).filter(Boolean));

        const visibleObjects = computed(() => sceneObjects.value.filter((object) =>
            categoryId.value === 'all' || object.category === categoryId.value || object.id === selectedId.value
        ));

        const sceneMap = computed(() => new Map(sceneObjects.value.map((object) => [object.id, object])));
        const selectedObject = computed(() => sceneMap.value.get(selectedId.value) || sceneObjects.value[0] || null);

        const visibleLinks = computed(() => data.links
            .filter((link) => link.season === 'all' || link.season === seasonId.value)
            .map((link) => ({
                ...link,
                points: link.objects.map((id) => sceneMap.value.get(id)).filter(Boolean)
            }))
            .filter((link) => link.points.length > 1));

        const backgroundStars = computed(() => {
            const stars = [];
            for (let index = 1; index <= 82; index += 1) {
                const angle = (index * 137.508) * Math.PI / 180;
                const radius = 40.5 * Math.sqrt(((index * 47) % 101) / 101);
                stars.push({
                    id: index,
                    x: 50 + Math.cos(angle) * radius,
                    y: 50 + Math.sin(angle) * radius,
                    radius: 0.08 + ((index * 13) % 7) / 24,
                    opacity: 0.22 + ((index * 19) % 9) / 13
                });
            }
            return stars;
        });

        const compass = [
            { label: 'N', x: 50, y: 5.2 },
            { label: 'E', x: 94.8, y: 50 },
            { label: 'S', x: 50, y: 94.8 },
            { label: 'O', x: 5.2, y: 50 }
        ];

        const linePoints = (link) => link.points.map((point) => `${point.x},${point.y}`).join(' ');
        const formatDegrees = (value) => `${Math.round(Number(value) || 0)}°`;

        const refreshIcons = () => nextTick(() => window.lucide?.createIcons?.());

        const selectObject = (id) => {
            if (!objectMap.value.has(id)) return;
            selectedId.value = id;
            refreshIcons();
        };

        const selectSeason = (id) => {
            if (!data.seasons.some((item) => item.id === id)) return;
            seasonId.value = id;
            const current = objectMap.value.get(selectedId.value);
            if (!current?.positions?.[id] || Number(current.positions[id][0]) <= 0) {
                const replacement = data.objects.find((object) => Number(object.positions?.[id]?.[0]) > 0);
                if (replacement) selectedId.value = replacement.id;
            }
            refreshIcons();
        };

        const selectCategory = (id) => {
            categoryId.value = id;
            const first = sceneObjects.value.find((object) => id === 'all' || object.category === id);
            if (first) selectedId.value = first.id;
        };

        const startGuide = (guide) => {
            if (!guide) return;
            activeGuideId.value = guide.id;
            guideStep.value = 0;
            if (guide.id === 'winter') selectSeason('winter');
            if (guide.id === 'summer') selectSeason('summer');
            categoryId.value = 'all';
            const first = guide.steps?.[0];
            if (first) selectedId.value = first.objectId;
            refreshIcons();
        };

        const closeGuide = () => {
            activeGuideId.value = null;
            guideStep.value = 0;
        };

        const goToGuideStep = (index) => {
            if (!activeGuide.value) return;
            const max = activeGuide.value.steps.length - 1;
            guideStep.value = Math.max(0, Math.min(index, max));
            const step = activeGuide.value.steps[guideStep.value];
            if (step) selectedId.value = step.objectId;
            refreshIcons();
        };

        const handleKeydown = (event) => {
            if (event.key === 'Escape') {
                if (showAbout.value) showAbout.value = false;
                else if (activeGuideId.value) closeGuide();
            }
        };

        watch([seasonId, momentId, categoryId, selectedId, showLabels, showLines, activeGuideId, guideStep], refreshIcons);

        onMounted(() => {
            document.documentElement.classList.add('athar-astronomy-active');
            document.addEventListener('keydown', handleKeydown);
            refreshIcons();
        });

        onBeforeUnmount(() => {
            document.documentElement.classList.remove('athar-astronomy-active');
            document.removeEventListener('keydown', handleKeydown);
        });

        return {
            data, seasonId, momentId, categoryId, selectedId, showLabels, showLines, showAbout,
            activeGuideId, guideStep, season, moment, activeGuide, activeGuideStep, selectedObject,
            visibleObjects, visibleLinks, backgroundStars, compass, linePoints, formatDegrees,
            selectObject, selectSeason, selectCategory, startGuide, closeGuide, goToGuideStep
        };
    },

    template: `
    <section class="sky5-shell" :style="{ '--sky5-accent': season.accent || '#c5a059' }">
        <div class="sky5-frame">
            <header class="sky5-header">
                <div class="sky5-brand">
                    <span class="sky5-brand-mark"><i data-lucide="telescope"></i></span>
                    <span>
                        <small>{{ data.meta.subtitle }}</small>
                        <strong>{{ data.meta.title }}</strong>
                    </span>
                </div>

                <nav class="sky5-seasons" aria-label="Choisir une saison">
                    <button v-for="item in data.seasons" :key="item.id" type="button"
                            :class="{ active: seasonId === item.id }" :aria-pressed="seasonId === item.id"
                            @click="selectSeason(item.id)">{{ item.label }}</button>
                </nav>

                <div class="sky5-header-actions">
                    <button type="button" :class="{ active: showLines }" :aria-pressed="showLines" @click="showLines = !showLines" title="Afficher les lignes">
                        <i data-lucide="route"></i><span>Figures</span>
                    </button>
                    <button type="button" :class="{ active: showLabels }" :aria-pressed="showLabels" @click="showLabels = !showLabels" title="Afficher les noms">
                        <i data-lucide="tags"></i><span>Noms</span>
                    </button>
                    <button type="button" @click="showAbout = true" title="Méthodologie">
                        <i data-lucide="info"></i><span>À propos</span>
                    </button>
                </div>
            </header>

            <main class="sky5-main">
                <section class="sky5-observatory">
                    <div class="sky5-scene-head">
                        <div>
                            <small>{{ moment.label }}</small>
                            <h1>{{ season.title }}</h1>
                            <p>{{ season.note }}</p>
                        </div>
                        <div class="sky5-category-scroll" aria-label="Filtrer les repères">
                            <button v-for="category in data.categories" :key="category.id" type="button"
                                    :class="{ active: categoryId === category.id }" @click="selectCategory(category.id)">
                                {{ category.label }}
                            </button>
                        </div>
                    </div>

                    <div class="sky5-planisphere-wrap">
                        <svg class="sky5-planisphere" viewBox="0 0 100 100" role="img" aria-label="Planisphère céleste pédagogique">
                            <defs>
                                <radialGradient id="sky5-dome" cx="50%" cy="42%" r="65%">
                                    <stop offset="0%" stop-color="#17233e"></stop>
                                    <stop offset="55%" stop-color="#0a1020"></stop>
                                    <stop offset="100%" stop-color="#03050b"></stop>
                                </radialGradient>
                                <radialGradient id="sky5-moon" cx="35%" cy="30%" r="70%">
                                    <stop offset="0%" stop-color="#fffbe8"></stop>
                                    <stop offset="100%" stop-color="#d9c477"></stop>
                                </radialGradient>
                                <filter id="sky5-glow" x="-200%" y="-200%" width="400%" height="400%">
                                    <feGaussianBlur stdDeviation="0.8" result="blur"></feGaussianBlur>
                                    <feMerge><feMergeNode in="blur"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge>
                                </filter>
                            </defs>

                            <circle cx="50" cy="50" r="45" fill="url(#sky5-dome)" class="sky5-dome"></circle>
                            <circle cx="50" cy="50" r="42" class="sky5-horizon"></circle>
                            <circle cx="50" cy="50" r="28" class="sky5-altitude-ring"></circle>
                            <circle cx="50" cy="50" r="14" class="sky5-altitude-ring"></circle>
                            <path d="M8 50H92 M50 8V92" class="sky5-axis"></path>

                            <g class="sky5-background-stars" aria-hidden="true">
                                <circle v-for="star in backgroundStars" :key="star.id" :cx="star.x" :cy="star.y"
                                        :r="star.radius" :opacity="star.opacity"></circle>
                            </g>

                            <g v-if="showLines" class="sky5-constellations" aria-hidden="true">
                                <polyline v-for="link in visibleLinks" :key="link.id" :points="linePoints(link)"></polyline>
                            </g>

                            <g v-for="object in visibleObjects" :key="object.id" class="sky5-object"
                               :class="{ selected: selectedObject && selectedObject.id === object.id, moon: object.id === 'moon' }"
                               role="button" tabindex="0" :aria-label="object.name"
                               @click="selectObject(object.id)" @keydown.enter.space.prevent="selectObject(object.id)">
                                <circle class="sky5-hit" :cx="object.x" :cy="object.y" r="4.4"></circle>
                                <circle v-if="selectedObject && selectedObject.id === object.id" class="sky5-selection" :cx="object.x" :cy="object.y" :r="object.size + 2.1"></circle>
                                <circle class="sky5-star" :cx="object.x" :cy="object.y" :r="object.size"
                                        :fill="object.id === 'moon' ? 'url(#sky5-moon)' : object.color" filter="url(#sky5-glow)"></circle>
                                <text v-if="showLabels" class="sky5-label" :x="object.x + object.size + 1.1" :y="object.y - object.size * .35">{{ object.name }}</text>
                            </g>

                            <g class="sky5-compass" aria-hidden="true">
                                <text v-for="point in compass" :key="point.label" :x="point.x" :y="point.y">{{ point.label }}</text>
                            </g>
                        </svg>

                        <div class="sky5-sky-caption"><span><i></i> Zénith</span><span>L’horizon forme le cercle extérieur</span></div>
                    </div>

                    <div class="sky5-time-control">
                        <div class="sky5-time-copy"><i data-lucide="clock-3"></i><span><small>Moment de la nuit</small><strong>{{ moment.label }}</strong></span></div>
                        <input v-model.number="momentId" type="range" min="0" max="4" step="1" aria-label="Moment de la nuit">
                        <div class="sky5-time-ends"><span>Crépuscule</span><span>Aube</span></div>
                    </div>
                </section>

                <aside v-if="selectedObject" class="sky5-inspector" aria-live="polite">
                    <header>
                        <span class="sky5-object-mark"><i data-lucide="sparkles"></i></span>
                        <div><small>{{ selectedObject.type }} · {{ selectedObject.latin }}</small><h2>{{ selectedObject.name }}</h2></div>
                    </header>
                    <div class="sky5-arabic" lang="ar" dir="rtl">{{ selectedObject.arabic }}</div>
                    <p class="sky5-transliteration">{{ selectedObject.transliteration }}</p>
                    <p class="sky5-summary">{{ selectedObject.summary }}</p>

                    <dl class="sky5-facts">
                        <div><dt>Magnitude</dt><dd>{{ selectedObject.magnitude }}</dd></div>
                        <div><dt>Hauteur</dt><dd>{{ formatDegrees(selectedObject.altitude) }}</dd></div>
                        <div><dt>Direction</dt><dd>{{ formatDegrees(selectedObject.azimuth) }}</dd></div>
                    </dl>

                    <section class="sky5-note"><small>Comprendre</small><p>{{ selectedObject.story }}</p></section>
                    <section class="sky5-memory"><span><i data-lucide="brain"></i></span><div><small>Astuce mémoire</small><p>{{ selectedObject.memory }}</p></div></section>
                    <footer><i data-lucide="book-open-check"></i><span>{{ selectedObject.source }}</span></footer>
                </aside>
            </main>

            <section class="sky5-guides" aria-label="Parcours guidés">
                <header><div><small>Apprendre sans se perdre</small><h2>Trois parcours très courts</h2></div><p>Chaque parcours met en évidence un seul repère à la fois.</p></header>
                <div class="sky5-guide-grid">
                    <button v-for="guide in data.guides" :key="guide.id" type="button"
                            :class="{ active: activeGuideId === guide.id }" @click="startGuide(guide)">
                        <span><i :data-lucide="guide.icon"></i></span>
                        <span><strong>{{ guide.title }}</strong><small>{{ guide.short }}</small></span>
                        <i data-lucide="arrow-up-right"></i>
                    </button>
                </div>

                <article v-if="activeGuide && activeGuideStep" class="sky5-guide-reader">
                    <button class="sky5-guide-close" type="button" @click="closeGuide" aria-label="Fermer le parcours"><i data-lucide="x"></i></button>
                    <div class="sky5-guide-progress"><span v-for="(_, index) in activeGuide.steps" :key="index" :class="{ active: index <= guideStep }"></span></div>
                    <div class="sky5-guide-step">
                        <span>{{ guideStep + 1 }}</span>
                        <div><small>{{ activeGuide.title }}</small><h3>{{ activeGuideStep.title }}</h3><p>{{ activeGuideStep.text }}</p></div>
                    </div>
                    <footer>
                        <button type="button" :disabled="guideStep === 0" @click="goToGuideStep(guideStep - 1)"><i data-lucide="arrow-left"></i> Précédent</button>
                        <button v-if="guideStep < activeGuide.steps.length - 1" type="button" @click="goToGuideStep(guideStep + 1)">Continuer <i data-lucide="arrow-right"></i></button>
                        <button v-else type="button" @click="closeGuide">Terminer <i data-lucide="check"></i></button>
                    </footer>
                </article>
            </section>
        </div>

        <transition name="sky5-fade">
            <div v-if="showAbout" class="sky5-overlay" @click.self="showAbout = false">
                <section class="sky5-about" role="dialog" aria-modal="true" aria-label="Méthodologie du Ciel des Anciens">
                    <header><span><i data-lucide="telescope"></i></span><div><small>Méthodologie</small><h2>Un planisphère d’apprentissage</h2></div><button type="button" @click="showAbout = false"><i data-lucide="x"></i></button></header>
                    <p>{{ data.meta.methodology }}</p>
                    <ul><li v-for="source in data.meta.sources" :key="source">{{ source }}</li></ul>
                    <div class="sky5-about-notice"><i data-lucide="shield-check"></i><span>Aucune géolocalisation, aucune API distante et aucun calcul sensible : tout fonctionne localement.</span></div>
                </section>
            </div>
        </transition>
    </section>`
};
