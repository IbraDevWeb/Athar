const TransmissionView = {
    props: ['silsila', 'themes', 'rootIds', 'openScholarFiche'],

    setup(props) {
        const { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } = Vue;

        const viewMode = ref('map');
        const activeGroup = ref('all');
        const searchQuery = ref('');
        const directoryScope = ref('all');
        const focusId = ref((props.rootIds && props.rootIds.fiqh) || 11);
        const directoryOpen = ref(false);
        const profileOpen = ref(false);
        const aboutOpen = ref(false);
        const profileTab = ref('overview');
        const activeJourneyId = ref(null);
        const journeyStep = ref(0);
        const quiz = ref(null);
        const quizAnswer = ref(null);
        const quizScore = ref({ correct: 0, total: 0 });
        const visitedIds = ref([]);
        const favoriteIds = ref([]);
        const recentIds = ref([]);

        const normalize = (value = '') => String(value)
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[ʿʾ‘’'`]/g, '')
            .toLowerCase();

        const allScholars = computed(() => Array.isArray(props.silsila) ? props.silsila : []);

        const activeThemes = computed(() => {
            const defaults = {
                pre: { label: 'Fondations', shortLabel: 'Fondations', accent: '#475569', icon: 'landmark' },
                fiqh: { label: 'Fiqh & écoles', shortLabel: 'Fiqh', accent: '#047857', icon: 'scale' },
                hadith: { label: 'Hadith & critique', shortLabel: 'Hadith', accent: '#6d28d9', icon: 'scroll-text' },
                quran: { label: 'Qirāʾāt & riwāyāt', shortLabel: 'Lectures', accent: '#b45309', icon: 'book-open' }
            };
            return props.themes ? { ...defaults, ...props.themes } : defaults;
        });

        const disciplineTabs = computed(() => [
            { key: 'all', label: 'Tout le réseau', short: 'Tout', icon: 'network' },
            { key: 'fiqh', label: activeThemes.value.fiqh.label, short: activeThemes.value.fiqh.shortLabel || 'Fiqh', icon: activeThemes.value.fiqh.icon || 'scale' },
            { key: 'hadith', label: activeThemes.value.hadith.label, short: activeThemes.value.hadith.shortLabel || 'Hadith', icon: activeThemes.value.hadith.icon || 'scroll-text' },
            { key: 'quran', label: activeThemes.value.quran.label, short: activeThemes.value.quran.shortLabel || 'Lectures', icon: activeThemes.value.quran.icon || 'book-open' }
        ]);

        const journeys = computed(() => {
            if (typeof SILSILA_JOURNEYS !== 'undefined' && Array.isArray(SILSILA_JOURNEYS)) return SILSILA_JOURNEYS;
            return [];
        });

        const scholarMap = computed(() => new Map(allScholars.value.map(scholar => [Number(scholar.id), scholar])));
        const getScholar = id => scholarMap.value.get(Number(id)) || null;
        const focusedScholar = computed(() => getScholar(focusId.value) || allScholars.value[0] || null);

        const currentTheme = computed(() => {
            const group = focusedScholar.value ? focusedScholar.value.group : 'pre';
            return activeThemes.value[group] || activeThemes.value.pre;
        });

        const relationLabel = (teacher, student) => {
            if (!teacher || !student) return 'Transmission';
            return student.relations && student.relations.teachers && student.relations.teachers[teacher.id]
                ? student.relations.teachers[teacher.id]
                : 'Lien d’enseignement ou de transmission';
        };

        const relationKind = relation => {
            const value = normalize(relation);
            if (value.includes('direct') || value.includes('eleve') || value.includes('enseignement')) return 'direct';
            if (value.includes('intermediaire') || value.includes('filiation') || value.includes('par plusieurs')) return 'indirect';
            if (value.includes('influence') || value.includes('ecole')) return 'influence';
            return 'transmission';
        };

        const masters = computed(() => {
            if (!focusedScholar.value || !Array.isArray(focusedScholar.value.teachers)) return [];
            return focusedScholar.value.teachers
                .map(id => getScholar(id))
                .filter(Boolean)
                .map(scholar => {
                    const relation = relationLabel(scholar, focusedScholar.value);
                    return { ...scholar, relation, relationKind: relationKind(relation) };
                });
        });

        const students = computed(() => {
            if (!focusedScholar.value || !Array.isArray(focusedScholar.value.students)) return [];
            return focusedScholar.value.students
                .map(id => getScholar(id))
                .filter(Boolean)
                .map(scholar => {
                    const relation = relationLabel(focusedScholar.value, scholar);
                    return { ...scholar, relation, relationKind: relationKind(relation) };
                });
        });

        const visibleMasters = computed(() => masters.value.slice(0, 5));
        const visibleStudents = computed(() => students.value.slice(0, 5));

        const filteredScholars = computed(() => {
            const query = normalize(searchQuery.value.trim());
            return allScholars.value
                .filter(scholar => activeGroup.value === 'all' || scholar.group === activeGroup.value || scholar.group === 'pre')
                .filter(scholar => {
                    if (!query) return true;
                    const haystack = [
                        scholar.label, scholar.arabicName, scholar.role, scholar.city, scholar.region,
                        scholar.bio, scholar.legacy, ...(scholar.keywords || []),
                        ...(scholar.contributions || []), ...(scholar.works || []), ...(scholar.sources || [])
                    ].map(normalize).join(' ');
                    return haystack.includes(query);
                })
                .sort((a, b) => {
                    if (a.group === 'pre' && b.group !== 'pre') return -1;
                    if (b.group === 'pre' && a.group !== 'pre') return 1;
                    return String(a.label).localeCompare(String(b.label), 'fr');
                });
        });

        const favoriteScholars = computed(() => favoriteIds.value.map(getScholar).filter(Boolean));
        const recentScholars = computed(() => recentIds.value.map(getScholar).filter(Boolean));

        const directoryScholars = computed(() => {
            const base = filteredScholars.value;
            if (directoryScope.value === 'favorites') {
                const favoriteSet = new Set(favoriteIds.value);
                return base.filter(scholar => favoriteSet.has(Number(scholar.id)));
            }
            if (directoryScope.value === 'recent') {
                const order = new Map(recentIds.value.map((id, index) => [Number(id), index]));
                return base
                    .filter(scholar => order.has(Number(scholar.id)))
                    .sort((a, b) => order.get(Number(a.id)) - order.get(Number(b.id)));
            }
            return base;
        });

        const visitedCount = computed(() => visitedIds.value.filter(id => scholarMap.value.has(Number(id))).length);
        const explorationProgress = computed(() => allScholars.value.length
            ? Math.round((visitedCount.value / allScholars.value.length) * 100)
            : 0);

        const stats = computed(() => ({
            total: allScholars.value.length,
            links: allScholars.value.reduce((sum, scholar) => sum + (Array.isArray(scholar.students) ? scholar.students.length : 0), 0),
            fiqh: allScholars.value.filter(scholar => scholar.group === 'fiqh').length,
            hadith: allScholars.value.filter(scholar => scholar.group === 'hadith').length,
            quran: allScholars.value.filter(scholar => scholar.group === 'quran').length
        }));

        const activeJourney = computed(() => journeys.value.find(journey => journey.id === activeJourneyId.value) || null);
        const journeyScholars = computed(() => activeJourney.value
            ? activeJourney.value.scholarIds.map(getScholar).filter(Boolean)
            : []);
        const activeJourneyScholar = computed(() => journeyScholars.value[journeyStep.value] || null);
        const recommendedJourney = computed(() => {
            const group = focusedScholar.value && focusedScholar.value.group;
            return journeys.value.find(journey => journey.group === group)
                || journeys.value.find(journey => group && journey.scholarIds.includes(focusedScholar.value.id))
                || journeys.value[0]
                || null;
        });

        const typeLabels = {
            prophet: 'Prophète',
            companion: 'Compagnon',
            successor: 'Tābiʿī',
            imam: 'Imam et juriste',
            muhaddith: 'Traditionniste',
            critic: 'Critique du hadith',
            compiler: 'Compilateur',
            reader: 'Imam lecteur',
            transmitter: 'Transmetteur canonique',
            scholar: 'Savant'
        };

        const getTypeLabel = scholar => typeLabels[scholar && scholar.type] || 'Savant';
        const getTheme = scholar => activeThemes.value[(scholar && scholar.group) || 'pre'] || activeThemes.value.pre;
        const isVisited = id => visitedIds.value.includes(Number(id));
        const isFavorite = id => favoriteIds.value.includes(Number(id));
        const firstLetter = scholar => String(scholar && scholar.label || 'A').replace(/^[ʿʾ‘’'`\s]+/, '').charAt(0).toUpperCase() || 'A';
        const relationCountLabel = (count, singular, plural) => `${count} ${count > 1 ? plural : singular}`;

        const hydrateIcons = () => nextTick(() => window.lucide?.createIcons());

        const persist = () => {
            localStorage.setItem('athar_transmission_visited', JSON.stringify(visitedIds.value));
            localStorage.setItem('athar_transmission_favorites', JSON.stringify(favoriteIds.value));
            localStorage.setItem('athar_transmission_recent', JSON.stringify(recentIds.value));
        };

        const markVisited = id => {
            const numericId = Number(id);
            if (!visitedIds.value.includes(numericId)) visitedIds.value = [...visitedIds.value, numericId];
            recentIds.value = [numericId, ...recentIds.value.filter(item => Number(item) !== numericId)].slice(0, 12);
            persist();
        };

        const setFocus = (id, options = {}) => {
            const scholar = getScholar(id);
            if (!scholar) return;
            focusId.value = Number(scholar.id);
            markVisited(scholar.id);
            if (options.group !== false && scholar.group !== 'pre') activeGroup.value = scholar.group;
            if (options.closeDirectory !== false) directoryOpen.value = false;
            if (options.profile) {
                profileTab.value = 'overview';
                profileOpen.value = true;
            }
            viewMode.value = options.keepView ? viewMode.value : 'map';
            hydrateIcons();
        };

        const openProfile = scholar => {
            if (!scholar) return;
            setFocus(scholar.id, { profile: true, group: false, closeDirectory: true });
        };

        const closeProfile = () => {
            profileOpen.value = false;
            hydrateIcons();
        };

        const openDirectory = (scope = 'all') => {
            directoryScope.value = scope;
            directoryOpen.value = true;
            hydrateIcons();
            nextTick(() => document.querySelector('.tx3-directory-search input')?.focus());
        };

        const closeDirectory = () => {
            directoryOpen.value = false;
            hydrateIcons();
        };

        const toggleFavorite = id => {
            const numericId = Number(id);
            favoriteIds.value = favoriteIds.value.includes(numericId)
                ? favoriteIds.value.filter(item => item !== numericId)
                : [...favoriteIds.value, numericId];
            persist();
            hydrateIcons();
        };

        const switchDiscipline = group => {
            activeGroup.value = group;
            searchQuery.value = '';
            directoryScope.value = 'all';
            const preferred = group === 'all'
                ? getScholar(1) || allScholars.value[0]
                : getScholar(props.rootIds && props.rootIds[group]) || allScholars.value.find(scholar => scholar.group === group);
            if (preferred) setFocus(preferred.id, { group: false, keepView: viewMode.value === 'journeys' });
            hydrateIcons();
        };

        const discoverRandom = () => {
            const pool = filteredScholars.value.length ? filteredScholars.value : allScholars.value;
            if (!pool.length) return;
            const scholar = pool[Math.floor(Math.random() * pool.length)];
            setFocus(scholar.id, { group: activeGroup.value !== 'all' });
        };

        const showView = mode => {
            if (mode === 'directory') {
                openDirectory();
                return;
            }
            viewMode.value = mode;
            if (mode !== 'journeys') activeJourneyId.value = null;
            if (mode === 'review') buildQuiz();
            hydrateIcons();
        };

        const startJourney = journey => {
            if (!journey) return;
            activeJourneyId.value = journey.id;
            journeyStep.value = 0;
            viewMode.value = 'journeys';
            const first = getScholar(journey.scholarIds[0]);
            if (first) {
                focusId.value = Number(first.id);
                markVisited(first.id);
            }
            hydrateIcons();
        };

        const closeJourney = () => {
            activeJourneyId.value = null;
            journeyStep.value = 0;
            hydrateIcons();
        };

        const goToJourneyStep = index => {
            const scholars = journeyScholars.value;
            if (!scholars.length) return;
            journeyStep.value = Math.max(0, Math.min(index, scholars.length - 1));
            const scholar = scholars[journeyStep.value];
            focusId.value = Number(scholar.id);
            markVisited(scholar.id);
            hydrateIcons();
        };

        const nextJourneyStep = () => {
            if (journeyStep.value < journeyScholars.value.length - 1) goToJourneyStep(journeyStep.value + 1);
        };

        const previousJourneyStep = () => {
            if (journeyStep.value > 0) goToJourneyStep(journeyStep.value - 1);
        };

        const buildQuiz = () => {
            const pool = filteredScholars.value.filter(scholar => isVisited(scholar.id));
            const subjects = pool.length ? pool : filteredScholars.value;
            const subject = subjects.length
                ? subjects[Math.floor(Math.random() * subjects.length)]
                : focusedScholar.value;
            if (!subject) return;

            const subjectMasters = Array.isArray(subject.teachers)
                ? subject.teachers.map(getScholar).filter(Boolean).map(scholar => ({ ...scholar, relation: relationLabel(scholar, subject) }))
                : [];
            const subjectStudents = Array.isArray(subject.students)
                ? subject.students.map(getScholar).filter(Boolean).map(scholar => ({ ...scholar, relation: relationLabel(subject, scholar) }))
                : [];

            const possibleRelations = [];
            if (subjectMasters.length) possibleRelations.push({
                mode: 'master',
                prompt: `Qui figure parmi les maîtres ou sources de transmission de ${subject.label} ?`,
                correct: subjectMasters[Math.floor(Math.random() * subjectMasters.length)]
            });
            if (subjectStudents.length) possibleRelations.push({
                mode: 'student',
                prompt: `Qui figure parmi les élèves ou continuateurs de ${subject.label} ?`,
                correct: subjectStudents[Math.floor(Math.random() * subjectStudents.length)]
            });
            possibleRelations.push({
                mode: 'group',
                prompt: `Dans quelle discipline cette fiche est-elle classée ?`,
                correct: { id: subject.group, label: activeThemes.value[subject.group]?.label || 'Fondations' }
            });

            const selected = possibleRelations[Math.floor(Math.random() * possibleRelations.length)];
            let options;
            if (selected.mode === 'group') {
                options = ['fiqh', 'hadith', 'quran', 'pre'].map(key => ({ id: key, label: activeThemes.value[key].label }));
            } else {
                const distractors = allScholars.value
                    .filter(scholar => scholar.id !== selected.correct.id && scholar.id !== subject.id)
                    .filter(scholar => scholar.group === selected.correct.group || scholar.group === subject.group || scholar.group === 'pre')
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 3);
                options = [selected.correct, ...distractors].sort(() => Math.random() - 0.5);
            }

            quiz.value = {
                subject,
                prompt: selected.prompt,
                correctId: selected.correct.id,
                options
            };
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
            navigator.vibrate?.(correct ? [20, 30, 20] : 80);
            hydrateIcons();
        };

        const quizOptionClass = id => {
            if (quizAnswer.value === null) return 'tx3-quiz-option-idle';
            if (String(id) === String(quiz.value.correctId)) return 'tx3-quiz-option-correct';
            if (String(id) === String(quizAnswer.value)) return 'tx3-quiz-option-wrong';
            return 'tx3-quiz-option-muted';
        };

        const handleKeydown = event => {
            if (event.key === 'Escape') {
                if (aboutOpen.value) aboutOpen.value = false;
                else if (profileOpen.value) closeProfile();
                else if (directoryOpen.value) closeDirectory();
                else if (activeJourneyId.value) closeJourney();
            }
            if (event.key === '/' && !directoryOpen.value && !profileOpen.value) {
                event.preventDefault();
                openDirectory();
            }
        };

        watch(focusId, () => {
            if (focusedScholar.value) markVisited(focusedScholar.value.id);
            hydrateIcons();
        });

        watch([viewMode, activeGroup, searchQuery, directoryScope, directoryOpen, profileTab, profileOpen, aboutOpen, activeJourneyId, journeyStep], hydrateIcons);

        onMounted(() => {
            try {
                visitedIds.value = JSON.parse(localStorage.getItem('athar_transmission_visited') || '[]').map(Number);
                favoriteIds.value = JSON.parse(localStorage.getItem('athar_transmission_favorites') || '[]').map(Number);
                recentIds.value = JSON.parse(localStorage.getItem('athar_transmission_recent') || '[]').map(Number);
            } catch (_) {
                visitedIds.value = [];
                favoriteIds.value = [];
                recentIds.value = [];
            }
            if (!focusedScholar.value && allScholars.value.length) focusId.value = Number(allScholars.value[0].id);
            if (focusedScholar.value) markVisited(focusedScholar.value.id);
            buildQuiz();
            document.addEventListener('keydown', handleKeydown);
            hydrateIcons();
        });

        onBeforeUnmount(() => document.removeEventListener('keydown', handleKeydown));

        return {
            viewMode, activeGroup, searchQuery, directoryScope, focusId, directoryOpen, profileOpen,
            aboutOpen, profileTab, activeJourneyId, journeyStep, quiz, quizAnswer, quizScore,
            visitedIds, favoriteIds, recentIds, allScholars, activeThemes, disciplineTabs, journeys,
            focusedScholar, currentTheme, masters, students, visibleMasters, visibleStudents,
            filteredScholars, directoryScholars, favoriteScholars, recentScholars, visitedCount,
            explorationProgress, stats, activeJourney, journeyScholars, activeJourneyScholar,
            recommendedJourney, getScholar, getTypeLabel, getTheme, isVisited, isFavorite,
            firstLetter, relationCountLabel, setFocus, openProfile, closeProfile, openDirectory,
            closeDirectory, toggleFavorite, switchDiscipline, discoverRandom, showView,
            startJourney, closeJourney, goToJourneyStep, nextJourneyStep, previousJourneyStep,
            buildQuiz, answerQuiz, quizOptionClass
        };
    },

    template: `
    <section class="tx3-shell min-h-full bg-brand-paper dark:bg-brand-dark text-brand-dark dark:text-gray-100">
        <div class="tx3-ambient tx3-ambient-one"></div>
        <div class="tx3-ambient tx3-ambient-two"></div>
        <div class="tx3-grid-texture"></div>

        <div class="tx3-app">
            <header class="tx3-topbar">
                <button type="button" class="tx3-brand" @click="showView('map')" aria-label="Revenir à la carte">
                    <span class="tx3-brand-mark"><i data-lucide="git-fork"></i></span>
                    <span>
                        <small>Cartographie du savoir</small>
                        <strong>Transmission</strong>
                    </span>
                </button>

                <div class="tx3-top-actions">
                    <label class="tx3-discipline-select">
                        <i :data-lucide="activeGroup === 'all' ? 'network' : activeThemes[activeGroup].icon"></i>
                        <select v-model="activeGroup" @change="switchDiscipline(activeGroup)" aria-label="Choisir une discipline">
                            <option v-for="tab in disciplineTabs" :key="tab.key" :value="tab.key">{{ tab.label }}</option>
                        </select>
                        <i data-lucide="chevron-down"></i>
                    </label>

                    <button type="button" class="tx3-icon-btn tx3-search-trigger" @click="openDirectory('all')" title="Rechercher une personne">
                        <i data-lucide="search"></i><span>Rechercher</span>
                    </button>
                    <button type="button" class="tx3-icon-btn" @click="discoverRandom" title="Découverte aléatoire">
                        <i data-lucide="shuffle"></i><span class="tx3-desktop-label">Surprendre</span>
                    </button>
                    <button type="button" class="tx3-icon-btn" @click="aboutOpen = true" title="À propos du réseau">
                        <i data-lucide="info"></i>
                    </button>
                </div>
            </header>

            <div class="tx3-progress">
                <span><i data-lucide="sparkles"></i>{{ visitedCount }} fiches explorées · {{ explorationProgress }} % du réseau</span>
                <div><span :style="{ width: explorationProgress + '%' }"></span></div>
                <button v-if="recentScholars.length" type="button" @click="openDirectory('recent')">Historique</button>
            </div>

            <main class="tx3-main">
                <section v-if="viewMode === 'map' && focusedScholar" class="tx3-map-view" :style="{ '--accent': currentTheme.accent }">
                    <div class="tx3-stage-head">
                        <div class="tx3-stage-context">
                            <span class="tx3-category"><i :data-lucide="currentTheme.icon"></i>{{ currentTheme.label }}</span>
                            <span>{{ relationCountLabel(masters.length, 'maître', 'maîtres') }} · {{ relationCountLabel(students.length, 'élève', 'élèves') }}</span>
                        </div>
                        <div class="tx3-stage-actions">
                            <button type="button" @click="toggleFavorite(focusedScholar.id)" :class="{ active: isFavorite(focusedScholar.id) }" :aria-label="isFavorite(focusedScholar.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'">
                                <i :data-lucide="isFavorite(focusedScholar.id) ? 'bookmark-check' : 'bookmark'"></i>
                            </button>
                            <button type="button" @click="openProfile(focusedScholar)" aria-label="Ouvrir la fiche détaillée">
                                <i data-lucide="panel-right-open"></i>
                            </button>
                        </div>
                    </div>

                    <div class="tx3-network-stage">
                        <section class="tx3-relation-band tx3-relation-band-top" aria-label="Maîtres et sources">
                            <div class="tx3-relation-title">
                                <span>En amont</span>
                                <strong>Maîtres et sources</strong>
                            </div>
                            <div v-if="visibleMasters.length" class="tx3-relation-scroll">
                                <button v-for="master in visibleMasters" :key="master.id" type="button"
                                        class="tx3-node tx3-node-master"
                                        :class="'is-' + master.relationKind"
                                        :style="{ '--node-accent': getTheme(master).accent }"
                                        @click="setFocus(master.id)"
                                        :title="master.relation">
                                    <span class="tx3-node-avatar">{{ firstLetter(master) }}</span>
                                    <span class="tx3-node-copy">
                                        <strong>{{ master.label }}</strong>
                                        <small>{{ master.relation }}</small>
                                    </span>
                                    <i data-lucide="arrow-down"></i>
                                </button>
                                <button v-if="masters.length > visibleMasters.length" type="button" class="tx3-more-node" @click="openProfile(focusedScholar)">
                                    +{{ masters.length - visibleMasters.length }}<span>autres</span>
                                </button>
                            </div>
                            <div v-else class="tx3-empty-band"><i data-lucide="circle-dashed"></i><span>Aucun maître antérieur représenté dans ce réseau pédagogique.</span></div>
                        </section>

                        <div class="tx3-vertical-thread tx3-thread-top"><span></span></div>

                        <article class="tx3-focus-card">
                            <div class="tx3-focus-glow"></div>
                            <div class="tx3-focus-header">
                                <span class="tx3-focus-avatar">{{ firstLetter(focusedScholar) }}</span>
                                <div class="tx3-focus-identity">
                                    <span>{{ getTypeLabel(focusedScholar) }}</span>
                                    <h1>{{ focusedScholar.label }}</h1>
                                    <p lang="ar" dir="rtl">{{ focusedScholar.arabicName }}</p>
                                </div>
                            </div>

                            <div class="tx3-focus-meta">
                                <span><i data-lucide="calendar-days"></i>{{ focusedScholar.dates }}</span>
                                <span><i data-lucide="map-pin"></i>{{ focusedScholar.city || focusedScholar.region }}</span>
                                <span><i data-lucide="badge-info"></i>{{ focusedScholar.role }}</span>
                            </div>

                            <p class="tx3-focus-summary">{{ focusedScholar.bio }}</p>

                            <div class="tx3-focus-insights">
                                <button type="button" @click="profileTab = 'lineage'; openProfile(focusedScholar)">
                                    <i data-lucide="waypoints"></i>
                                    <span><strong>{{ masters.length + students.length }}</strong><small>relations visibles</small></span>
                                </button>
                                <button type="button" @click="profileTab = 'works'; openProfile(focusedScholar)">
                                    <i data-lucide="sparkles"></i>
                                    <span><strong>{{ (focusedScholar.contributions || []).length }}</strong><small>apports documentés</small></span>
                                </button>
                                <button type="button" @click="profileTab = 'sources'; openProfile(focusedScholar)">
                                    <i data-lucide="library"></i>
                                    <span><strong>{{ (focusedScholar.sources || []).length }}</strong><small>références</small></span>
                                </button>
                            </div>

                            <div class="tx3-focus-actions">
                                <button type="button" class="tx3-primary-action" @click="openProfile(focusedScholar)">
                                    Lire la fiche <i data-lucide="arrow-up-right"></i>
                                </button>
                                <button type="button" class="tx3-secondary-action" @click="showView('review')">
                                    <i data-lucide="brain-circuit"></i> Réviser ce réseau
                                </button>
                            </div>
                        </article>

                        <div class="tx3-vertical-thread tx3-thread-bottom"><span></span></div>

                        <section class="tx3-relation-band tx3-relation-band-bottom" aria-label="Élèves et continuateurs">
                            <div class="tx3-relation-title">
                                <span>En aval</span>
                                <strong>Élèves et continuateurs</strong>
                            </div>
                            <div v-if="visibleStudents.length" class="tx3-relation-scroll">
                                <button v-for="student in visibleStudents" :key="student.id" type="button"
                                        class="tx3-node tx3-node-student"
                                        :class="'is-' + student.relationKind"
                                        :style="{ '--node-accent': getTheme(student).accent }"
                                        @click="setFocus(student.id)"
                                        :title="student.relation">
                                    <i data-lucide="arrow-down"></i>
                                    <span class="tx3-node-avatar">{{ firstLetter(student) }}</span>
                                    <span class="tx3-node-copy">
                                        <strong>{{ student.label }}</strong>
                                        <small>{{ student.relation }}</small>
                                    </span>
                                </button>
                                <button v-if="students.length > visibleStudents.length" type="button" class="tx3-more-node" @click="openProfile(focusedScholar)">
                                    +{{ students.length - visibleStudents.length }}<span>autres</span>
                                </button>
                            </div>
                            <div v-else class="tx3-empty-band"><i data-lucide="circle-dashed"></i><span>Aucun continuateur postérieur représenté dans le réseau actuel.</span></div>
                        </section>
                    </div>

                    <button v-if="recommendedJourney" type="button" class="tx3-journey-teaser" @click="startJourney(recommendedJourney)">
                        <span class="tx3-journey-teaser-icon"><i :data-lucide="recommendedJourney.icon || 'route'"></i></span>
                        <span>
                            <small>Parcours recommandé</small>
                            <strong>{{ recommendedJourney.title }}</strong>
                            <em>{{ recommendedJourney.scholarIds.length }} étapes · lecture guidée</em>
                        </span>
                        <i data-lucide="arrow-right"></i>
                    </button>
                </section>

                <section v-else-if="viewMode === 'journeys'" class="tx3-journeys-view">
                    <template v-if="!activeJourney">
                        <header class="tx3-section-intro">
                            <div>
                                <span><i data-lucide="route"></i> Apprendre pas à pas</span>
                                <h1>Parcours guidés</h1>
                                <p>Suivez une question précise à travers quelques figures. Une étape, une relation et une idée essentielle à la fois.</p>
                            </div>
                            <button type="button" @click="showView('map')"><i data-lucide="waypoints"></i> Retour à la carte</button>
                        </header>

                        <div class="tx3-journey-gallery">
                            <button v-for="journey in journeys" :key="journey.id" type="button"
                                    class="tx3-journey-card"
                                    :style="{ '--accent': activeThemes[journey.group]?.accent || '#c5a059' }"
                                    @click="startJourney(journey)">
                                <span class="tx3-journey-number">{{ String(journey.scholarIds.length).padStart(2, '0') }}</span>
                                <span class="tx3-journey-icon"><i :data-lucide="journey.icon || 'route'"></i></span>
                                <span class="tx3-journey-copy">
                                    <small>{{ journey.subtitle }}</small>
                                    <strong>{{ journey.title }}</strong>
                                    <p>{{ journey.description }}</p>
                                    <em>{{ journey.scholarIds.length }} étapes · commencer</em>
                                </span>
                                <i data-lucide="arrow-up-right"></i>
                            </button>
                        </div>
                    </template>

                    <article v-else-if="activeJourneyScholar" class="tx3-journey-player" :style="{ '--accent': getTheme(activeJourneyScholar).accent }">
                        <header class="tx3-player-top">
                            <button type="button" @click="closeJourney"><i data-lucide="arrow-left"></i><span>Tous les parcours</span></button>
                            <div>
                                <small>Parcours actif</small>
                                <strong>{{ activeJourney.title }}</strong>
                            </div>
                            <span>{{ journeyStep + 1 }} / {{ journeyScholars.length }}</span>
                        </header>

                        <div class="tx3-player-track">
                            <button v-for="(scholar, index) in journeyScholars" :key="scholar.id" type="button"
                                    @click="goToJourneyStep(index)"
                                    :class="{ active: journeyStep === index, done: index < journeyStep }"
                                    :aria-label="'Étape ' + (index + 1) + ' : ' + scholar.label">
                                <span>{{ index + 1 }}</span>
                                <small>{{ scholar.label }}</small>
                            </button>
                        </div>

                        <div class="tx3-player-stage">
                            <span class="tx3-player-step">Étape {{ journeyStep + 1 }}</span>
                            <div class="tx3-player-avatar">{{ firstLetter(activeJourneyScholar) }}</div>
                            <span class="tx3-type">{{ getTypeLabel(activeJourneyScholar) }}</span>
                            <h1>{{ activeJourneyScholar.label }}</h1>
                            <p class="tx3-player-arabic" lang="ar" dir="rtl">{{ activeJourneyScholar.arabicName }}</p>
                            <div class="tx3-player-meta">
                                <span>{{ activeJourneyScholar.dates }}</span>
                                <span>{{ activeJourneyScholar.city || activeJourneyScholar.region }}</span>
                            </div>
                            <p class="tx3-player-bio">{{ activeJourneyScholar.bio }}</p>
                            <button type="button" @click="openProfile(activeJourneyScholar)">Approfondir cette étape <i data-lucide="panel-right-open"></i></button>
                        </div>

                        <footer class="tx3-player-controls">
                            <button type="button" @click="previousJourneyStep" :disabled="journeyStep === 0">
                                <i data-lucide="arrow-left"></i><span>Précédent</span>
                            </button>
                            <div class="tx3-player-progress"><span :style="{ width: ((journeyStep + 1) / journeyScholars.length * 100) + '%' }"></span></div>
                            <button type="button" @click="nextJourneyStep" :disabled="journeyStep === journeyScholars.length - 1">
                                <span>Continuer</span><i data-lucide="arrow-right"></i>
                            </button>
                        </footer>
                    </article>
                </section>

                <section v-else class="tx3-review-view">
                    <header class="tx3-section-intro tx3-review-intro">
                        <div>
                            <span><i data-lucide="brain-circuit"></i> Mémorisation active</span>
                            <h1>Réviser le réseau</h1>
                            <p>Les questions utilisent en priorité les fiches déjà explorées, puis élargissent progressivement le corpus.</p>
                        </div>
                        <button type="button" @click="showView('map')"><i data-lucide="waypoints"></i> Retour à la carte</button>
                    </header>

                    <article v-if="quiz" class="tx3-quiz-stage">
                        <div class="tx3-quiz-score">
                            <span>Session</span>
                            <strong>{{ quizScore.correct }} / {{ quizScore.total }}</strong>
                            <small>bonnes réponses</small>
                        </div>
                        <div class="tx3-quiz-content">
                            <span class="tx3-quiz-subject">{{ quiz.subject.label }}</span>
                            <h2>{{ quiz.prompt }}</h2>
                            <div class="tx3-quiz-options">
                                <button v-for="option in quiz.options" :key="option.id" type="button"
                                        @click="answerQuiz(option.id)"
                                        :disabled="quizAnswer !== null"
                                        :class="quizOptionClass(option.id)">
                                    <span>{{ option.label }}</span>
                                    <i v-if="quizAnswer !== null && String(option.id) === String(quiz.correctId)" data-lucide="check-circle-2"></i>
                                    <i v-else-if="quizAnswer !== null && String(option.id) === String(quizAnswer)" data-lucide="x-circle"></i>
                                    <i v-else data-lucide="circle"></i>
                                </button>
                            </div>
                            <button v-if="quizAnswer !== null" type="button" class="tx3-next-question" @click="buildQuiz">
                                Question suivante <i data-lucide="arrow-right"></i>
                            </button>
                        </div>
                    </article>
                </section>
            </main>

            <nav class="tx3-space-nav" aria-label="Espaces de Transmission">
                <button type="button" @click="showView('map')" :class="{ active: viewMode === 'map' && !directoryOpen }">
                    <i data-lucide="waypoints"></i><span>Carte</span>
                </button>
                <button type="button" @click="openDirectory('all')" :class="{ active: directoryOpen }">
                    <i data-lucide="users"></i><span>Personnes</span>
                </button>
                <button type="button" @click="showView('journeys')" :class="{ active: viewMode === 'journeys' }">
                    <i data-lucide="route"></i><span>Parcours</span>
                </button>
                <button type="button" @click="showView('review')" :class="{ active: viewMode === 'review' }">
                    <i data-lucide="brain-circuit"></i><span>Réviser</span>
                </button>
            </nav>
        </div>

        <transition name="tx3-fade">
            <button v-if="directoryOpen" type="button" class="tx3-overlay" @click="closeDirectory" aria-label="Fermer le répertoire"></button>
        </transition>

        <transition name="tx3-slide">
            <aside v-if="directoryOpen" class="tx3-directory-drawer" role="dialog" aria-modal="true" aria-label="Répertoire des personnes">
                <header class="tx3-drawer-head">
                    <div>
                        <small>Explorer le corpus</small>
                        <h2>Personnes</h2>
                    </div>
                    <button type="button" @click="closeDirectory" aria-label="Fermer"><i data-lucide="x"></i></button>
                </header>

                <div class="tx3-directory-search">
                    <i data-lucide="search"></i>
                    <input v-model="searchQuery" type="search" placeholder="Nom, ville, œuvre, notion…" aria-label="Rechercher une personne">
                    <button v-if="searchQuery" type="button" @click="searchQuery = ''" aria-label="Effacer"><i data-lucide="x"></i></button>
                </div>

                <div class="tx3-directory-disciplines">
                    <button v-for="tab in disciplineTabs" :key="tab.key" type="button"
                            @click="switchDiscipline(tab.key); directoryOpen = true"
                            :class="{ active: activeGroup === tab.key }">
                        <i :data-lucide="tab.icon"></i><span>{{ tab.short }}</span>
                    </button>
                </div>

                <div class="tx3-directory-scopes">
                    <button type="button" @click="directoryScope = 'all'" :class="{ active: directoryScope === 'all' }">Tout <span>{{ filteredScholars.length }}</span></button>
                    <button type="button" @click="directoryScope = 'favorites'" :class="{ active: directoryScope === 'favorites' }">Favoris <span>{{ favoriteScholars.length }}</span></button>
                    <button type="button" @click="directoryScope = 'recent'" :class="{ active: directoryScope === 'recent' }">Récents <span>{{ recentScholars.length }}</span></button>
                </div>

                <div class="tx3-directory-list">
                    <button v-for="scholar in directoryScholars" :key="scholar.id" type="button"
                            class="tx3-directory-person"
                            :class="{ active: focusId === scholar.id }"
                            :style="{ '--accent': getTheme(scholar).accent }"
                            @click="setFocus(scholar.id)">
                        <span class="tx3-directory-avatar">{{ firstLetter(scholar) }}</span>
                        <span class="tx3-directory-copy">
                            <strong>{{ scholar.label }}</strong>
                            <small>{{ scholar.role }}</small>
                            <em>{{ scholar.dates }} · {{ scholar.city || scholar.region }}</em>
                        </span>
                        <span class="tx3-directory-status">
                            <i v-if="isFavorite(scholar.id)" data-lucide="bookmark"></i>
                            <i v-if="isVisited(scholar.id)" data-lucide="check-circle-2"></i>
                        </span>
                    </button>

                    <div v-if="!directoryScholars.length" class="tx3-directory-empty">
                        <i data-lucide="search-x"></i>
                        <strong>Aucune fiche trouvée</strong>
                        <p>Modifiez la recherche, la discipline ou le filtre sélectionné.</p>
                    </div>
                </div>

                <footer class="tx3-drawer-foot">
                    <span><kbd>/</kbd> rechercher rapidement</span>
                    <button type="button" @click="discoverRandom">Découverte aléatoire <i data-lucide="shuffle"></i></button>
                </footer>
            </aside>
        </transition>

        <transition name="tx3-fade">
            <button v-if="profileOpen" type="button" class="tx3-overlay tx3-profile-overlay" @click="closeProfile" aria-label="Fermer la fiche"></button>
        </transition>

        <transition name="tx3-profile">
            <aside v-if="profileOpen && focusedScholar" class="tx3-profile-drawer" role="dialog" aria-modal="true" :aria-label="'Fiche de ' + focusedScholar.label" :style="{ '--accent': currentTheme.accent }">
                <header class="tx3-profile-head">
                    <button type="button" class="tx3-profile-close" @click="closeProfile" aria-label="Fermer"><i data-lucide="x"></i></button>
                    <span class="tx3-profile-avatar">{{ firstLetter(focusedScholar) }}</span>
                    <span class="tx3-category"><i :data-lucide="currentTheme.icon"></i>{{ currentTheme.label }}</span>
                    <h2>{{ focusedScholar.label }}</h2>
                    <p lang="ar" dir="rtl">{{ focusedScholar.arabicName }}</p>
                    <div class="tx3-profile-head-actions">
                        <button type="button" @click="toggleFavorite(focusedScholar.id)" :class="{ active: isFavorite(focusedScholar.id) }">
                            <i :data-lucide="isFavorite(focusedScholar.id) ? 'bookmark-check' : 'bookmark'"></i>
                            {{ isFavorite(focusedScholar.id) ? 'Enregistrée' : 'Enregistrer' }}
                        </button>
                    </div>
                </header>

                <div class="tx3-profile-meta">
                    <span><i data-lucide="calendar-days"></i>{{ focusedScholar.dates }}</span>
                    <span><i data-lucide="map-pin"></i>{{ focusedScholar.city || focusedScholar.region }}</span>
                    <span><i data-lucide="badge-info"></i>{{ focusedScholar.role }}</span>
                    <span><i data-lucide="hourglass"></i>{{ focusedScholar.era }}</span>
                </div>

                <nav class="tx3-profile-tabs" role="tablist">
                    <button type="button" @click="profileTab = 'overview'" :class="{ active: profileTab === 'overview' }">Biographie</button>
                    <button type="button" @click="profileTab = 'lineage'" :class="{ active: profileTab === 'lineage' }">Transmission</button>
                    <button type="button" @click="profileTab = 'works'" :class="{ active: profileTab === 'works' }">Héritage</button>
                    <button type="button" @click="profileTab = 'sources'" :class="{ active: profileTab === 'sources' }">Sources</button>
                </nav>

                <div class="tx3-profile-body">
                    <section v-if="profileTab === 'overview'" class="tx3-profile-section">
                        <div class="tx3-profile-lead"><i data-lucide="quote"></i><p>{{ focusedScholar.bio }}</p></div>
                        <div class="tx3-profile-block">
                            <span>Héritage</span>
                            <h3>Ce que cette figure a transmis</h3>
                            <p>{{ focusedScholar.legacy || 'Cette fiche présente les principaux repères de son héritage savant.' }}</p>
                        </div>
                        <div v-if="focusedScholar.keywords && focusedScholar.keywords.length" class="tx3-tags">
                            <span v-for="tag in focusedScholar.keywords" :key="tag">{{ tag }}</span>
                        </div>
                    </section>

                    <section v-else-if="profileTab === 'lineage'" class="tx3-profile-section">
                        <div class="tx3-profile-lineage">
                            <div>
                                <header><i data-lucide="arrow-up"></i><span><small>En amont</small><strong>Maîtres et sources</strong></span></header>
                                <button v-for="master in masters" :key="master.id" type="button" @click="setFocus(master.id, { profile: true, group: false, closeDirectory: false })">
                                    <span>{{ firstLetter(master) }}</span>
                                    <span><strong>{{ master.label }}</strong><small>{{ master.relation }}</small></span>
                                    <i data-lucide="arrow-up-right"></i>
                                </button>
                                <p v-if="!masters.length" class="tx3-muted">Aucun maître antérieur n’est représenté dans ce réseau.</p>
                            </div>
                            <div>
                                <header><i data-lucide="arrow-down"></i><span><small>En aval</small><strong>Élèves et continuateurs</strong></span></header>
                                <button v-for="student in students" :key="student.id" type="button" @click="setFocus(student.id, { profile: true, group: false, closeDirectory: false })">
                                    <span>{{ firstLetter(student) }}</span>
                                    <span><strong>{{ student.label }}</strong><small>{{ student.relation }}</small></span>
                                    <i data-lucide="arrow-down-right"></i>
                                </button>
                                <p v-if="!students.length" class="tx3-muted">Aucun continuateur postérieur n’est représenté dans ce réseau.</p>
                            </div>
                        </div>
                        <div class="tx3-method-note"><i data-lucide="triangle-alert"></i><p>Cette carte est pédagogique : elle ne prétend pas représenter toutes les rencontres, tous les intermédiaires ni toutes les voies de transmission.</p></div>
                    </section>

                    <section v-else-if="profileTab === 'works'" class="tx3-profile-section">
                        <div class="tx3-profile-columns">
                            <div>
                                <span>Apports</span>
                                <h3>Contributions majeures</h3>
                                <ul><li v-for="item in focusedScholar.contributions" :key="item"><i data-lucide="check"></i>{{ item }}</li></ul>
                            </div>
                            <div>
                                <span>Corpus</span>
                                <h3>Œuvres associées</h3>
                                <ul>
                                    <li v-for="item in focusedScholar.works" :key="item"><i data-lucide="book-marked"></i>{{ item }}</li>
                                    <li v-if="!focusedScholar.works || !focusedScholar.works.length" class="tx3-muted">Enseignement principalement transmis par les élèves et les sources biographiques.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section v-else class="tx3-profile-section">
                        <div class="tx3-source-intro"><i data-lucide="library-big"></i><div><span>Vérification</span><h3>Références indicatives</h3><p>Ces références orientent la vérification sans signifier que chaque détail fasse l’objet d’un consensus absolu.</p></div></div>
                        <ol class="tx3-source-list"><li v-for="source in focusedScholar.sources" :key="source">{{ source }}</li></ol>
                        <p v-if="!focusedScholar.sources || !focusedScholar.sources.length" class="tx3-muted">Références détaillées à compléter.</p>
                    </section>
                </div>
            </aside>
        </transition>

        <transition name="tx3-fade">
            <div v-if="aboutOpen" class="tx3-about-layer" @click.self="aboutOpen = false">
                <article class="tx3-about-card" role="dialog" aria-modal="true" aria-label="À propos du réseau">
                    <header>
                        <span><i data-lucide="network"></i></span>
                        <div><small>Méthodologie</small><h2>Lire le réseau</h2></div>
                        <button type="button" @click="aboutOpen = false" aria-label="Fermer"><i data-lucide="x"></i></button>
                    </header>
                    <p>Transmission relie des figures par des relations d’enseignement, de filiation savante ou de continuité pédagogique. La nature exacte du lien reste indiquée dans chaque fiche.</p>
                    <div class="tx3-about-stats">
                        <div><strong>{{ stats.total }}</strong><span>fiches</span></div>
                        <div><strong>{{ stats.links }}</strong><span>liens</span></div>
                        <div><strong>{{ journeys.length }}</strong><span>parcours</span></div>
                    </div>
                    <div class="tx3-legend">
                        <span class="is-direct"><i></i> Enseignement direct</span>
                        <span class="is-indirect"><i></i> Filiation indirecte</span>
                        <span class="is-influence"><i></i> Influence ou école</span>
                        <span class="is-transmission"><i></i> Transmission documentée</span>
                    </div>
                    <button type="button" class="tx3-primary-action" @click="aboutOpen = false">Compris</button>
                </article>
            </div>
        </transition>
    </section>
    `
};