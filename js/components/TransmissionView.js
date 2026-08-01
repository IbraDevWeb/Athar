const TransmissionView = {
    props: ['silsila', 'themes', 'rootIds', 'openScholarFiche'],

    setup(props) {
        const { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } = Vue;

        const mode = ref('explore');
        const activeGroup = ref('all');
        const focusId = ref((props.rootIds && props.rootIds.fiqh) || 1);
        const overlay = ref(null);
        const searchQuery = ref('');
        const searchScope = ref('all');
        const profileTab = ref('story');
        const activeJourneyId = ref(null);
        const journeyStep = ref(0);
        const quiz = ref(null);
        const quizAnswer = ref(null);
        const quizScore = ref({ correct: 0, total: 0 });
        const visitedIds = ref([]);
        const favoriteIds = ref([]);
        const recentIds = ref([]);

        const STORAGE = {
            visited: 'athar_transmission_visited',
            favorites: 'athar_transmission_favorites',
            recent: 'athar_transmission_recent'
        };

        const normalize = (value = '') => String(value)
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[ʿʾ‘’'`]/g, '')
            .toLowerCase();

        const allScholars = computed(() => Array.isArray(props.silsila) ? props.silsila.filter(Boolean) : []);
        const scholarMap = computed(() => new Map(allScholars.value.map(item => [Number(item.id), item])));
        const getScholar = id => scholarMap.value.get(Number(id)) || null;

        const activeThemes = computed(() => ({
            pre: { label: 'Fondations', shortLabel: 'Fondations', accent: '#7c6f58', icon: 'landmark' },
            fiqh: { label: 'Fiqh & écoles', shortLabel: 'Fiqh', accent: '#0f766e', icon: 'scale' },
            hadith: { label: 'Hadith & critique', shortLabel: 'Hadith', accent: '#6d28d9', icon: 'scroll-text' },
            quran: { label: 'Qirāʾāt & riwāyāt', shortLabel: 'Lectures', accent: '#b45309', icon: 'book-open' },
            ...(props.themes || {})
        }));

        const disciplineTabs = computed(() => [
            { key: 'all', label: 'Tout', icon: 'network' },
            { key: 'fiqh', label: activeThemes.value.fiqh.shortLabel || 'Fiqh', icon: activeThemes.value.fiqh.icon || 'scale' },
            { key: 'hadith', label: activeThemes.value.hadith.shortLabel || 'Hadith', icon: activeThemes.value.hadith.icon || 'scroll-text' },
            { key: 'quran', label: activeThemes.value.quran.shortLabel || 'Lectures', icon: activeThemes.value.quran.icon || 'book-open' }
        ]);

        const journeys = computed(() => typeof SILSILA_JOURNEYS !== 'undefined' && Array.isArray(SILSILA_JOURNEYS)
            ? SILSILA_JOURNEYS
            : []);

        const focusedScholar = computed(() => getScholar(focusId.value) || allScholars.value[0] || null);
        const currentTheme = computed(() => activeThemes.value[focusedScholar.value?.group || 'pre'] || activeThemes.value.pre);

        const relationLabel = (teacher, student) => {
            if (!teacher || !student) return 'Lien de transmission documenté';
            return student.relations?.teachers?.[teacher.id] || 'Lien d’enseignement ou de transmission';
        };

        const masters = computed(() => (focusedScholar.value?.teachers || [])
            .map(getScholar)
            .filter(Boolean)
            .map(item => ({ ...item, relation: relationLabel(item, focusedScholar.value) })));

        const students = computed(() => (focusedScholar.value?.students || [])
            .map(getScholar)
            .filter(Boolean)
            .map(item => ({ ...item, relation: relationLabel(focusedScholar.value, item) })));

        const typeLabels = {
            prophet: 'Prophète', companion: 'Compagnon', successor: 'Tābiʿī', imam: 'Imam et juriste',
            muhaddith: 'Traditionniste', critic: 'Critique du hadith', compiler: 'Compilateur',
            reader: 'Imam lecteur', transmitter: 'Transmetteur canonique', scholar: 'Savant'
        };
        const getTypeLabel = scholar => typeLabels[scholar?.type] || 'Savant';
        const getTheme = scholar => activeThemes.value[scholar?.group || 'pre'] || activeThemes.value.pre;
        const firstLetter = scholar => String(scholar?.label || 'A').replace(/^[ʿʾ‘’'`\s]+/, '').charAt(0).toUpperCase() || 'A';
        const isFavorite = id => favoriteIds.value.includes(Number(id));
        const isVisited = id => visitedIds.value.includes(Number(id));

        const filteredScholars = computed(() => {
            const q = normalize(searchQuery.value.trim());
            const allowed = scholar => activeGroup.value === 'all' || scholar.group === activeGroup.value || scholar.group === 'pre';
            return allScholars.value
                .filter(allowed)
                .filter(scholar => {
                    if (!q) return true;
                    const haystack = [
                        scholar.label, scholar.arabicName, scholar.role, scholar.city, scholar.region,
                        scholar.bio, scholar.legacy, ...(scholar.keywords || []), ...(scholar.contributions || []),
                        ...(scholar.works || []), ...(scholar.sources || [])
                    ].map(normalize).join(' ');
                    return haystack.includes(q);
                })
                .sort((a, b) => String(a.label).localeCompare(String(b.label), 'fr'));
        });

        const directoryResults = computed(() => {
            if (searchScope.value === 'favorites') {
                const set = new Set(favoriteIds.value);
                return filteredScholars.value.filter(item => set.has(Number(item.id)));
            }
            if (searchScope.value === 'recent') {
                const order = new Map(recentIds.value.map((id, index) => [Number(id), index]));
                return filteredScholars.value
                    .filter(item => order.has(Number(item.id)))
                    .sort((a, b) => order.get(Number(a.id)) - order.get(Number(b.id)));
            }
            return filteredScholars.value;
        });

        const visitedCount = computed(() => visitedIds.value.filter(id => scholarMap.value.has(Number(id))).length);
        const progress = computed(() => allScholars.value.length ? Math.round(visitedCount.value / allScholars.value.length * 100) : 0);
        const stats = computed(() => ({
            profiles: allScholars.value.length,
            links: allScholars.value.reduce((sum, item) => sum + (item.students?.length || 0), 0),
            journeys: journeys.value.length
        }));

        const activeJourney = computed(() => journeys.value.find(item => item.id === activeJourneyId.value) || null);
        const journeyScholars = computed(() => activeJourney.value
            ? activeJourney.value.scholarIds.map(getScholar).filter(Boolean)
            : []);
        const activeJourneyScholar = computed(() => journeyScholars.value[journeyStep.value] || null);

        const hydrateIcons = () => nextTick(() => window.lucide?.createIcons());

        const persist = () => {
            localStorage.setItem(STORAGE.visited, JSON.stringify(visitedIds.value));
            localStorage.setItem(STORAGE.favorites, JSON.stringify(favoriteIds.value));
            localStorage.setItem(STORAGE.recent, JSON.stringify(recentIds.value));
        };

        const markVisited = id => {
            const numeric = Number(id);
            if (!visitedIds.value.includes(numeric)) visitedIds.value = [...visitedIds.value, numeric];
            recentIds.value = [numeric, ...recentIds.value.filter(item => Number(item) !== numeric)].slice(0, 16);
            persist();
        };

        const setFocus = (id, options = {}) => {
            const scholar = getScholar(id);
            if (!scholar) return;
            focusId.value = Number(scholar.id);
            markVisited(scholar.id);
            if (options.syncGroup !== false && scholar.group !== 'pre') activeGroup.value = scholar.group;
            if (options.closeOverlay !== false) overlay.value = null;
            if (options.keepMode !== true) mode.value = 'explore';
            hydrateIcons();
        };

        const setDiscipline = group => {
            activeGroup.value = group;
            searchQuery.value = '';
            const preferred = group === 'all'
                ? getScholar(1) || allScholars.value[0]
                : getScholar(props.rootIds?.[group]) || allScholars.value.find(item => item.group === group);
            if (preferred) setFocus(preferred.id, { syncGroup: false, keepMode: mode.value !== 'explore' });
        };

        const toggleFavorite = id => {
            const numeric = Number(id);
            favoriteIds.value = isFavorite(numeric)
                ? favoriteIds.value.filter(item => item !== numeric)
                : [...favoriteIds.value, numeric];
            persist();
            hydrateIcons();
        };

        const openSearch = (scope = 'all') => {
            searchScope.value = scope;
            overlay.value = 'search';
            hydrateIcons();
            nextTick(() => document.querySelector('.tx4-command-input')?.focus());
        };

        const openProfile = (tab = 'story') => {
            profileTab.value = tab;
            overlay.value = 'profile';
            hydrateIcons();
        };

        const closeOverlay = () => {
            overlay.value = null;
            hydrateIcons();
        };

        const randomScholar = () => {
            const pool = filteredScholars.value.length ? filteredScholars.value : allScholars.value;
            if (!pool.length) return;
            setFocus(pool[Math.floor(Math.random() * pool.length)].id);
        };

        const changeMode = nextMode => {
            mode.value = nextMode;
            if (nextMode !== 'journeys') activeJourneyId.value = null;
            if (nextMode === 'review') buildQuiz();
            hydrateIcons();
        };

        const startJourney = journey => {
            if (!journey) return;
            activeJourneyId.value = journey.id;
            journeyStep.value = 0;
            mode.value = 'journeys';
            const first = getScholar(journey.scholarIds[0]);
            if (first) {
                focusId.value = Number(first.id);
                markVisited(first.id);
            }
            hydrateIcons();
        };

        const goToJourneyStep = index => {
            const max = journeyScholars.value.length - 1;
            if (max < 0) return;
            journeyStep.value = Math.max(0, Math.min(index, max));
            const scholar = journeyScholars.value[journeyStep.value];
            if (scholar) {
                focusId.value = Number(scholar.id);
                markVisited(scholar.id);
            }
            hydrateIcons();
        };

        const buildQuiz = () => {
            const explored = allScholars.value.filter(item => isVisited(item.id));
            const pool = explored.length >= 4 ? explored : allScholars.value;
            const subject = pool[Math.floor(Math.random() * pool.length)] || focusedScholar.value;
            if (!subject) return;

            const subjectMasters = (subject.teachers || []).map(getScholar).filter(Boolean);
            const subjectStudents = (subject.students || []).map(getScholar).filter(Boolean);
            const kinds = [];
            if (subjectMasters.length) kinds.push({
                prompt: `Qui fait partie des maîtres ou sources de ${subject.label} ?`,
                correct: subjectMasters[Math.floor(Math.random() * subjectMasters.length)]
            });
            if (subjectStudents.length) kinds.push({
                prompt: `Qui fait partie des élèves ou continuateurs de ${subject.label} ?`,
                correct: subjectStudents[Math.floor(Math.random() * subjectStudents.length)]
            });
            if (!kinds.length) {
                kinds.push({
                    prompt: `Dans quelle discipline ${subject.label} est-il principalement classé ?`,
                    correct: { id: subject.group, label: activeThemes.value[subject.group]?.label || 'Fondations' },
                    groups: true
                });
            }

            const selected = kinds[Math.floor(Math.random() * kinds.length)];
            let options;
            if (selected.groups) {
                options = ['pre', 'fiqh', 'hadith', 'quran'].map(key => ({ id: key, label: activeThemes.value[key].label }));
            } else {
                const distractors = allScholars.value
                    .filter(item => item.id !== selected.correct.id && item.id !== subject.id)
                    .sort(() => Math.random() - .5)
                    .slice(0, 3);
                options = [selected.correct, ...distractors].sort(() => Math.random() - .5);
            }

            quiz.value = { subject, prompt: selected.prompt, correctId: selected.correct.id, options };
            quizAnswer.value = null;
            hydrateIcons();
        };

        const answerQuiz = id => {
            if (!quiz.value || quizAnswer.value !== null) return;
            quizAnswer.value = id;
            const correct = String(id) === String(quiz.value.correctId);
            quizScore.value = {
                correct: quizScore.value.correct + (correct ? 1 : 0),
                total: quizScore.value.total + 1
            };
            navigator.vibrate?.(correct ? 30 : 80);
            hydrateIcons();
        };

        const quizClass = id => {
            if (quizAnswer.value === null) return '';
            if (String(id) === String(quiz.value.correctId)) return 'is-correct';
            if (String(id) === String(quizAnswer.value)) return 'is-wrong';
            return 'is-muted';
        };

        const openEncyclopedicFiche = scholar => {
            if (typeof props.openScholarFiche === 'function') props.openScholarFiche(scholar);
        };

        const handleKeydown = event => {
            if (event.key === 'Escape' && overlay.value) closeOverlay();
            if (event.key === '/' && !overlay.value) {
                event.preventDefault();
                openSearch();
            }
        };

        watch([mode, activeGroup, focusId, overlay, profileTab, journeyStep, quizAnswer], hydrateIcons);

        onMounted(() => {
            try {
                visitedIds.value = JSON.parse(localStorage.getItem(STORAGE.visited) || '[]').map(Number);
                favoriteIds.value = JSON.parse(localStorage.getItem(STORAGE.favorites) || '[]').map(Number);
                recentIds.value = JSON.parse(localStorage.getItem(STORAGE.recent) || '[]').map(Number);
            } catch (_) {
                visitedIds.value = [];
                favoriteIds.value = [];
                recentIds.value = [];
            }
            if (!focusedScholar.value && allScholars.value.length) focusId.value = Number(allScholars.value[0].id);
            if (focusedScholar.value) markVisited(focusedScholar.value.id);
            document.documentElement.classList.add('athar-transmission-active');
            document.addEventListener('keydown', handleKeydown);
            buildQuiz();
            hydrateIcons();
        });

        onBeforeUnmount(() => {
            document.documentElement.classList.remove('athar-transmission-active', 'athar-transmission-overlay');
            document.removeEventListener('keydown', handleKeydown);
        });

        watch(overlay, value => {
            document.documentElement.classList.toggle('athar-transmission-overlay', Boolean(value));
        });

        return {
            mode, activeGroup, overlay, searchQuery, searchScope, profileTab, activeJourneyId, journeyStep,
            quiz, quizAnswer, quizScore, allScholars, activeThemes, disciplineTabs, focusedScholar,
            currentTheme, masters, students, filteredScholars, directoryResults, visitedCount, progress,
            stats, journeys, activeJourney, journeyScholars, activeJourneyScholar, getScholar, getTheme,
            getTypeLabel, firstLetter, isFavorite, isVisited, setFocus, setDiscipline, toggleFavorite,
            openSearch, openProfile, closeOverlay, randomScholar, changeMode, startJourney, goToJourneyStep,
            buildQuiz, answerQuiz, quizClass, openEncyclopedicFiche
        };
    },

    template: `
    <section v-if="focusedScholar" class="tx4-shell" :style="{ '--tx4-accent': currentTheme.accent }">
        <div class="tx4-frame">
            <header class="tx4-masthead">
                <button class="tx4-brand" type="button" @click="changeMode('explore')" aria-label="Revenir à l’exploration">
                    <span class="tx4-brand-symbol"><i data-lucide="git-branch"></i></span>
                    <span>
                        <small>Atlas des filiations savantes</small>
                        <strong>Transmission</strong>
                    </span>
                </button>

                <nav class="tx4-disciplines" aria-label="Disciplines">
                    <button v-for="tab in disciplineTabs" :key="tab.key" type="button"
                            :class="{ active: activeGroup === tab.key }"
                            @click="setDiscipline(tab.key)">
                        <i :data-lucide="tab.icon"></i><span>{{ tab.label }}</span>
                    </button>
                </nav>

                <div class="tx4-header-actions">
                    <button type="button" @click="openSearch()" title="Rechercher"><i data-lucide="search"></i><span>Rechercher</span></button>
                    <button type="button" @click="randomScholar" title="Découverte aléatoire"><i data-lucide="shuffle"></i></button>
                    <button type="button" @click="overlay = 'about'" title="À propos"><i data-lucide="info"></i></button>
                </div>
            </header>

            <main class="tx4-main">
                <section v-if="mode === 'explore'" class="tx4-explore">
                    <article class="tx4-portrait">
                        <div class="tx4-portrait-kicker">
                            <span>{{ currentTheme.label }}</span>
                            <button type="button" @click="toggleFavorite(focusedScholar.id)" :class="{ active: isFavorite(focusedScholar.id) }">
                                <i :data-lucide="isFavorite(focusedScholar.id) ? 'bookmark-check' : 'bookmark'"></i>
                            </button>
                        </div>

                        <div class="tx4-identity">
                            <span class="tx4-monogram">{{ firstLetter(focusedScholar) }}</span>
                            <div>
                                <small>{{ getTypeLabel(focusedScholar) }}</small>
                                <h1>{{ focusedScholar.label }}</h1>
                                <p lang="ar" dir="rtl">{{ focusedScholar.arabicName }}</p>
                            </div>
                        </div>

                        <div class="tx4-facts">
                            <span><i data-lucide="calendar-days"></i>{{ focusedScholar.dates }}</span>
                            <span><i data-lucide="map-pin"></i>{{ focusedScholar.city || focusedScholar.region || 'Lieu non précisé' }}</span>
                            <span><i data-lucide="badge-info"></i>{{ focusedScholar.role }}</span>
                        </div>

                        <p class="tx4-lead">{{ focusedScholar.bio }}</p>

                        <div v-if="focusedScholar.contributions?.length" class="tx4-contributions">
                            <span v-for="item in focusedScholar.contributions.slice(0, 3)" :key="item">{{ item }}</span>
                        </div>

                        <div class="tx4-portrait-actions">
                            <button type="button" class="tx4-primary" @click="openProfile('story')">Lire la fiche complète <i data-lucide="arrow-up-right"></i></button>
                            <button type="button" class="tx4-secondary" @click="openProfile('lineage')"><i data-lucide="route"></i> Voir toute la filiation</button>
                        </div>

                        <div class="tx4-progress-note">
                            <span>{{ visitedCount }} profils explorés</span>
                            <div><i :style="{ width: progress + '%' }"></i></div>
                            <strong>{{ progress }} %</strong>
                        </div>
                    </article>

                    <aside class="tx4-lineage" aria-label="Lignée de transmission">
                        <header>
                            <span>Chemin de transmission</span>
                            <strong>{{ masters.length }} en amont · {{ students.length }} en aval</strong>
                        </header>

                        <section class="tx4-lineage-group tx4-lineage-upstream">
                            <div class="tx4-lineage-label"><span>Avant</span><strong>Maîtres & sources</strong></div>
                            <button v-for="master in masters.slice(0, 6)" :key="master.id" type="button" class="tx4-lineage-row"
                                    :style="{ '--row-accent': getTheme(master).accent }" @click="setFocus(master.id)">
                                <span class="tx4-row-dot"></span>
                                <span class="tx4-row-copy"><strong>{{ master.label }}</strong><small>{{ master.relation }}</small></span>
                                <i data-lucide="arrow-up-right"></i>
                            </button>
                            <p v-if="!masters.length" class="tx4-lineage-empty">Aucun maître antérieur représenté dans ce corpus.</p>
                        </section>

                        <div class="tx4-current-row">
                            <span class="tx4-current-marker">{{ firstLetter(focusedScholar) }}</span>
                            <span><small>Position actuelle</small><strong>{{ focusedScholar.label }}</strong></span>
                            <i data-lucide="focus"></i>
                        </div>

                        <section class="tx4-lineage-group tx4-lineage-downstream">
                            <div class="tx4-lineage-label"><span>Après</span><strong>Élèves & continuateurs</strong></div>
                            <button v-for="student in students.slice(0, 6)" :key="student.id" type="button" class="tx4-lineage-row"
                                    :style="{ '--row-accent': getTheme(student).accent }" @click="setFocus(student.id)">
                                <span class="tx4-row-dot"></span>
                                <span class="tx4-row-copy"><strong>{{ student.label }}</strong><small>{{ student.relation }}</small></span>
                                <i data-lucide="arrow-down-right"></i>
                            </button>
                            <p v-if="!students.length" class="tx4-lineage-empty">Aucun continuateur postérieur représenté dans ce corpus.</p>
                        </section>
                    </aside>
                </section>

                <section v-else-if="mode === 'journeys'" class="tx4-journeys">
                    <aside class="tx4-journey-index">
                        <header><small>Apprendre par itinéraires</small><h1>Parcours guidés</h1><p>Une question, quelques figures et une idée essentielle à chaque étape.</p></header>
                        <button v-for="journey in journeys" :key="journey.id" type="button"
                                :class="{ active: activeJourneyId === journey.id }" @click="startJourney(journey)">
                            <span><i :data-lucide="journey.icon || 'route'"></i></span>
                            <span><small>{{ journey.subtitle }}</small><strong>{{ journey.title }}</strong><em>{{ journey.scholarIds.length }} étapes</em></span>
                            <i data-lucide="chevron-right"></i>
                        </button>
                    </aside>

                    <article v-if="activeJourneyScholar" class="tx4-journey-reader">
                        <header>
                            <span>{{ journeyStep + 1 }} / {{ journeyScholars.length }}</span>
                            <div><small>{{ activeJourney.title }}</small><strong>{{ activeJourney.subtitle }}</strong></div>
                        </header>
                        <div class="tx4-step-rail">
                            <button v-for="(scholar, index) in journeyScholars" :key="scholar.id" type="button"
                                    :class="{ active: index === journeyStep, done: index < journeyStep }" @click="goToJourneyStep(index)">
                                <span>{{ index + 1 }}</span><small>{{ scholar.label }}</small>
                            </button>
                        </div>
                        <div class="tx4-journey-subject">
                            <span class="tx4-monogram">{{ firstLetter(activeJourneyScholar) }}</span>
                            <small>{{ getTypeLabel(activeJourneyScholar) }}</small>
                            <h2>{{ activeJourneyScholar.label }}</h2>
                            <p class="tx4-arabic" lang="ar" dir="rtl">{{ activeJourneyScholar.arabicName }}</p>
                            <div class="tx4-facts"><span>{{ activeJourneyScholar.dates }}</span><span>{{ activeJourneyScholar.city || activeJourneyScholar.region }}</span></div>
                            <p class="tx4-lead">{{ activeJourneyScholar.bio }}</p>
                            <button type="button" class="tx4-secondary" @click="openProfile('story')">Approfondir cette étape <i data-lucide="panel-right-open"></i></button>
                        </div>
                        <footer>
                            <button type="button" :disabled="journeyStep === 0" @click="goToJourneyStep(journeyStep - 1)"><i data-lucide="arrow-left"></i> Précédent</button>
                            <div><span :style="{ width: ((journeyStep + 1) / journeyScholars.length * 100) + '%' }"></span></div>
                            <button type="button" :disabled="journeyStep >= journeyScholars.length - 1" @click="goToJourneyStep(journeyStep + 1)">Continuer <i data-lucide="arrow-right"></i></button>
                        </footer>
                    </article>

                    <article v-else class="tx4-journey-placeholder">
                        <i data-lucide="route"></i><h2>Choisissez un parcours</h2><p>L’itinéraire s’ouvrira ici sans multiplier les écrans.</p>
                    </article>
                </section>

                <section v-else class="tx4-review">
                    <article v-if="quiz" class="tx4-review-card">
                        <header><span>Session {{ quizScore.total + 1 }}</span><strong>{{ quizScore.correct }} bonnes réponses</strong></header>
                        <small>{{ quiz.subject.label }}</small>
                        <h1>{{ quiz.prompt }}</h1>
                        <div class="tx4-options">
                            <button v-for="option in quiz.options" :key="option.id" type="button" :class="quizClass(option.id)"
                                    :disabled="quizAnswer !== null" @click="answerQuiz(option.id)">
                                <span>{{ option.label }}</span>
                                <i v-if="quizAnswer !== null && String(option.id) === String(quiz.correctId)" data-lucide="check-circle-2"></i>
                                <i v-else-if="quizAnswer !== null && String(option.id) === String(quizAnswer)" data-lucide="x-circle"></i>
                                <i v-else data-lucide="circle"></i>
                            </button>
                        </div>
                        <button v-if="quizAnswer !== null" type="button" class="tx4-primary" @click="buildQuiz">Question suivante <i data-lucide="arrow-right"></i></button>
                    </article>
                </section>
            </main>

            <nav class="tx4-mode-nav" aria-label="Espaces Transmission">
                <button type="button" :class="{ active: mode === 'explore' }" @click="changeMode('explore')"><i data-lucide="waypoints"></i><span>Explorer</span></button>
                <button type="button" :class="{ active: mode === 'journeys' }" @click="changeMode('journeys')"><i data-lucide="route"></i><span>Parcours</span></button>
                <button type="button" :class="{ active: mode === 'review' }" @click="changeMode('review')"><i data-lucide="brain-circuit"></i><span>Réviser</span></button>
            </nav>
        </div>

        <transition name="tx4-fade">
            <div v-if="overlay" class="tx4-overlay" @click.self="closeOverlay">
                <section v-if="overlay === 'search'" class="tx4-command" role="dialog" aria-modal="true" aria-label="Rechercher dans Transmission">
                    <header><div><small>Répertoire</small><h2>Trouver une figure</h2></div><button type="button" @click="closeOverlay"><i data-lucide="x"></i></button></header>
                    <label class="tx4-command-search"><i data-lucide="search"></i><input class="tx4-command-input" v-model="searchQuery" type="search" placeholder="Nom, ville, œuvre, notion…"></label>
                    <div class="tx4-command-scopes">
                        <button type="button" :class="{ active: searchScope === 'all' }" @click="searchScope = 'all'">Tous</button>
                        <button type="button" :class="{ active: searchScope === 'recent' }" @click="searchScope = 'recent'">Récents</button>
                        <button type="button" :class="{ active: searchScope === 'favorites' }" @click="searchScope = 'favorites'">Favoris</button>
                    </div>
                    <div class="tx4-command-results">
                        <button v-for="scholar in directoryResults" :key="scholar.id" type="button" @click="setFocus(scholar.id)">
                            <span class="tx4-result-avatar" :style="{ '--result-accent': getTheme(scholar).accent }">{{ firstLetter(scholar) }}</span>
                            <span><strong>{{ scholar.label }}</strong><small>{{ scholar.role }} · {{ scholar.city || scholar.region }}</small></span>
                            <i data-lucide="arrow-up-right"></i>
                        </button>
                        <p v-if="!directoryResults.length">Aucun résultat correspondant.</p>
                    </div>
                </section>

                <aside v-else-if="overlay === 'profile'" class="tx4-profile" role="dialog" aria-modal="true" aria-label="Fiche détaillée">
                    <header>
                        <button type="button" @click="closeOverlay"><i data-lucide="x"></i></button>
                        <span class="tx4-monogram">{{ firstLetter(focusedScholar) }}</span>
                        <small>{{ getTypeLabel(focusedScholar) }}</small>
                        <h2>{{ focusedScholar.label }}</h2>
                        <p lang="ar" dir="rtl">{{ focusedScholar.arabicName }}</p>
                    </header>
                    <nav>
                        <button type="button" :class="{ active: profileTab === 'story' }" @click="profileTab = 'story'">Biographie</button>
                        <button type="button" :class="{ active: profileTab === 'lineage' }" @click="profileTab = 'lineage'">Transmission</button>
                        <button type="button" :class="{ active: profileTab === 'legacy' }" @click="profileTab = 'legacy'">Héritage</button>
                        <button type="button" :class="{ active: profileTab === 'sources' }" @click="profileTab = 'sources'">Sources</button>
                    </nav>
                    <div class="tx4-profile-body">
                        <section v-if="profileTab === 'story'">
                            <p class="tx4-profile-lead">{{ focusedScholar.bio }}</p>
                            <dl><div><dt>Dates</dt><dd>{{ focusedScholar.dates }}</dd></div><div><dt>Lieu</dt><dd>{{ focusedScholar.city || focusedScholar.region }}</dd></div><div><dt>Rôle</dt><dd>{{ focusedScholar.role }}</dd></div></dl>
                        </section>
                        <section v-else-if="profileTab === 'lineage'" class="tx4-profile-lineage">
                            <div><h3>Maîtres et sources</h3><button v-for="item in masters" :key="item.id" type="button" @click="setFocus(item.id, { closeOverlay: false }); profileTab = 'lineage'"><strong>{{ item.label }}</strong><small>{{ item.relation }}</small></button><p v-if="!masters.length">Aucune relation antérieure affichée.</p></div>
                            <div><h3>Élèves et continuateurs</h3><button v-for="item in students" :key="item.id" type="button" @click="setFocus(item.id, { closeOverlay: false }); profileTab = 'lineage'"><strong>{{ item.label }}</strong><small>{{ item.relation }}</small></button><p v-if="!students.length">Aucune relation postérieure affichée.</p></div>
                        </section>
                        <section v-else-if="profileTab === 'legacy'">
                            <h3>Héritage</h3><p class="tx4-profile-lead">{{ focusedScholar.legacy || 'Synthèse à compléter.' }}</p>
                            <h3>Contributions</h3><ul><li v-for="item in focusedScholar.contributions || []" :key="item">{{ item }}</li></ul>
                            <h3>Œuvres</h3><ul><li v-for="item in focusedScholar.works || []" :key="item">{{ item }}</li></ul>
                        </section>
                        <section v-else>
                            <h3>Références bibliographiques</h3><ol><li v-for="item in focusedScholar.sources || []" :key="item">{{ item }}</li></ol>
                            <p class="tx4-method">Les relations représentent un enseignement, une transmission ou une filiation explicitement signalée dans les données pédagogiques.</p>
                        </section>
                    </div>
                    <footer><button type="button" @click="toggleFavorite(focusedScholar.id)"><i :data-lucide="isFavorite(focusedScholar.id) ? 'bookmark-check' : 'bookmark'"></i>{{ isFavorite(focusedScholar.id) ? 'Enregistré' : 'Enregistrer' }}</button><button v-if="openScholarFiche" type="button" @click="openEncyclopedicFiche(focusedScholar)">Notice encyclopédique <i data-lucide="external-link"></i></button></footer>
                </aside>

                <section v-else class="tx4-about" role="dialog" aria-modal="true" aria-label="À propos du réseau">
                    <header><span><i data-lucide="git-branch"></i></span><div><small>Méthodologie</small><h2>À propos de Transmission</h2></div><button type="button" @click="closeOverlay"><i data-lucide="x"></i></button></header>
                    <p>Cette cartographie présente des liens pédagogiques entre figures, écoles et traditions. Elle aide à explorer les filiations sans prétendre résumer toute la complexité historique dans une chaîne unique.</p>
                    <div class="tx4-about-stats"><span><strong>{{ stats.profiles }}</strong>profils</span><span><strong>{{ stats.links }}</strong>liens</span><span><strong>{{ stats.journeys }}</strong>parcours</span></div>
                    <p class="tx4-method">Les sources détaillées restent accessibles dans chaque fiche. Les contenus du corpus n’ont pas été modifiés par cette refonte.</p>
                </section>
            </div>
        </transition>
    </section>`
};
