const TransmissionView = {
    props: ['silsila', 'themes', 'rootIds', 'openScholarFiche'],

    setup(props) {
        const { ref, computed, watch, onMounted, nextTick } = Vue;

        const viewMode = ref('explore');
        const activeGroup = ref('all');
        const searchQuery = ref('');
        const focusId = ref((props.rootIds && props.rootIds.fiqh) || 11);
        const profileOpen = ref(false);
        const profileTab = ref('overview');
        const activeJourneyId = ref(null);
        const journeyStep = ref(0);
        const quiz = ref(null);
        const quizAnswer = ref(null);
        const quizScore = ref({ correct: 0, total: 0 });
        const visitedIds = ref([]);
        const favoriteIds = ref([]);

        const normalize = (value = '') => String(value)
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[ʿʾ‘’'`]/g, '')
            .toLowerCase();

        const allScholars = computed(() => Array.isArray(props.silsila) ? props.silsila : []);

        const activeThemes = computed(() => {
            const defaults = {
                pre: { label: 'Fondations', shortLabel: 'Fondations', btn: 'bg-slate-700', accent: '#475569', icon: 'landmark' },
                fiqh: { label: 'Fiqh & écoles', shortLabel: 'Fiqh', btn: 'bg-emerald-700', accent: '#047857', icon: 'scale' },
                hadith: { label: 'Hadith & critique', shortLabel: 'Hadith', btn: 'bg-violet-700', accent: '#6d28d9', icon: 'scroll-text' },
                quran: { label: 'Qirāʾāt & riwāyāt', shortLabel: 'Lectures', btn: 'bg-amber-700', accent: '#b45309', icon: 'book-open' }
            };
            return props.themes ? { ...defaults, ...props.themes } : defaults;
        });

        const disciplineTabs = computed(() => [
            { key: 'all', label: 'Tout le réseau', icon: 'network' },
            { key: 'fiqh', label: activeThemes.value.fiqh.shortLabel || 'Fiqh', icon: activeThemes.value.fiqh.icon || 'scale' },
            { key: 'hadith', label: activeThemes.value.hadith.shortLabel || 'Hadith', icon: activeThemes.value.hadith.icon || 'scroll-text' },
            { key: 'quran', label: activeThemes.value.quran.shortLabel || 'Lectures', icon: activeThemes.value.quran.icon || 'book-open' }
        ]);

        const journeys = computed(() => {
            if (typeof SILSILA_JOURNEYS !== 'undefined' && Array.isArray(SILSILA_JOURNEYS)) return SILSILA_JOURNEYS;
            return [];
        });

        const scholarMap = computed(() => new Map(allScholars.value.map(s => [s.id, s])));
        const getScholar = (id) => scholarMap.value.get(Number(id)) || null;

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

        const masters = computed(() => {
            if (!focusedScholar.value || !Array.isArray(focusedScholar.value.teachers)) return [];
            return focusedScholar.value.teachers
                .map(id => getScholar(id))
                .filter(Boolean)
                .map(s => ({ ...s, relation: relationLabel(s, focusedScholar.value) }));
        });

        const students = computed(() => {
            if (!focusedScholar.value || !Array.isArray(focusedScholar.value.students)) return [];
            return focusedScholar.value.students
                .map(id => getScholar(id))
                .filter(Boolean)
                .map(s => ({ ...s, relation: relationLabel(focusedScholar.value, s) }));
        });

        const filteredScholars = computed(() => {
            const query = normalize(searchQuery.value.trim());
            return allScholars.value
                .filter(s => activeGroup.value === 'all' || s.group === activeGroup.value || s.group === 'pre')
                .filter(s => {
                    if (!query) return true;
                    const haystack = [
                        s.label, s.arabicName, s.role, s.city, s.region, s.bio,
                        ...(s.keywords || []), ...(s.contributions || []), ...(s.works || [])
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
        const visitedCount = computed(() => visitedIds.value.filter(id => scholarMap.value.has(id)).length);
        const explorationProgress = computed(() => allScholars.value.length
            ? Math.round((visitedCount.value / allScholars.value.length) * 100)
            : 0);

        const stats = computed(() => ({
            total: allScholars.value.length,
            fiqh: allScholars.value.filter(s => s.group === 'fiqh').length,
            hadith: allScholars.value.filter(s => s.group === 'hadith').length,
            quran: allScholars.value.filter(s => s.group === 'quran').length
        }));

        const activeJourney = computed(() => journeys.value.find(j => j.id === activeJourneyId.value) || null);
        const journeyScholars = computed(() => activeJourney.value
            ? activeJourney.value.scholarIds.map(getScholar).filter(Boolean)
            : []);
        const activeJourneyScholar = computed(() => journeyScholars.value[journeyStep.value] || null);

        const typeLabels = {
            prophet: 'Prophète', companion: 'Compagnon', successor: 'Tābiʿī', imam: 'Imam et juriste',
            muhaddith: 'Traditionniste', critic: 'Critique du hadith', compiler: 'Compilateur',
            reader: 'Imam lecteur', transmitter: 'Transmetteur canonique', scholar: 'Savant'
        };
        const getTypeLabel = scholar => typeLabels[scholar && scholar.type] || 'Savant';
        const getTheme = scholar => activeThemes.value[(scholar && scholar.group) || 'pre'] || activeThemes.value.pre;
        const isVisited = id => visitedIds.value.includes(Number(id));
        const isFavorite = id => favoriteIds.value.includes(Number(id));

        const hydrateIcons = () => nextTick(() => {
            if (window.lucide) window.lucide.createIcons();
        });

        const persist = () => {
            localStorage.setItem('athar_transmission_visited', JSON.stringify(visitedIds.value));
            localStorage.setItem('athar_transmission_favorites', JSON.stringify(favoriteIds.value));
        };

        const markVisited = id => {
            const numericId = Number(id);
            if (!visitedIds.value.includes(numericId)) {
                visitedIds.value = [...visitedIds.value, numericId];
                persist();
            }
        };

        const setFocus = (id, options = {}) => {
            const scholar = getScholar(id);
            if (!scholar) return;
            focusId.value = scholar.id;
            markVisited(scholar.id);
            if (options.group !== false && scholar.group !== 'pre') activeGroup.value = scholar.group;
            if (options.profile) {
                profileTab.value = 'overview';
                profileOpen.value = true;
            }
            hydrateIcons();
        };

        const openProfile = scholar => {
            if (!scholar) return;
            setFocus(scholar.id, { profile: true, group: false });
        };

        const closeProfile = () => {
            profileOpen.value = false;
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
            const preferred = group === 'all'
                ? getScholar(1)
                : getScholar(props.rootIds && props.rootIds[group]) || allScholars.value.find(s => s.group === group);
            if (preferred) setFocus(preferred.id, { group: false });
            hydrateIcons();
        };

        const discoverRandom = () => {
            const pool = filteredScholars.value.length ? filteredScholars.value : allScholars.value;
            if (!pool.length) return;
            const scholar = pool[Math.floor(Math.random() * pool.length)];
            setFocus(scholar.id, { group: activeGroup.value !== 'all' });
            viewMode.value = 'explore';
        };

        const startJourney = journey => {
            activeJourneyId.value = journey.id;
            journeyStep.value = 0;
            viewMode.value = 'journeys';
            const first = getScholar(journey.scholarIds[0]);
            if (first) setFocus(first.id, { group: false });
            hydrateIcons();
        };

        const goToJourneyStep = index => {
            const scholars = journeyScholars.value;
            if (!scholars.length) return;
            journeyStep.value = Math.max(0, Math.min(index, scholars.length - 1));
            setFocus(scholars[journeyStep.value].id, { group: false });
        };

        const nextJourneyStep = () => {
            if (journeyStep.value < journeyScholars.value.length - 1) goToJourneyStep(journeyStep.value + 1);
        };

        const previousJourneyStep = () => {
            if (journeyStep.value > 0) goToJourneyStep(journeyStep.value - 1);
        };

        const buildQuiz = () => {
            const subject = focusedScholar.value;
            if (!subject) return;
            const possibleRelations = [];
            if (masters.value.length) possibleRelations.push({
                mode: 'master',
                prompt: `Qui figure parmi les maîtres ou sources de transmission de ${subject.label} ?`,
                correct: masters.value[Math.floor(Math.random() * masters.value.length)]
            });
            if (students.value.length) possibleRelations.push({
                mode: 'student',
                prompt: `Qui figure parmi les élèves ou continuateurs de ${subject.label} ?`,
                correct: students.value[Math.floor(Math.random() * students.value.length)]
            });
            if (!possibleRelations.length) {
                possibleRelations.push({
                    mode: 'group',
                    prompt: `Dans quelle discipline cette fiche est-elle classée ?`,
                    correct: { id: subject.group, label: activeThemes.value[subject.group].label }
                });
            }

            const selected = possibleRelations[Math.floor(Math.random() * possibleRelations.length)];
            let options;
            if (selected.mode === 'group') {
                options = ['fiqh', 'hadith', 'quran', 'pre'].map(key => ({ id: key, label: activeThemes.value[key].label }));
            } else {
                const distractors = allScholars.value
                    .filter(s => s.id !== selected.correct.id && s.id !== subject.id)
                    .filter(s => s.group === selected.correct.group || s.group === subject.group || s.group === 'pre')
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 3);
                options = [selected.correct, ...distractors].sort(() => Math.random() - 0.5);
            }

            quiz.value = {
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
            if (navigator.vibrate) navigator.vibrate(correct ? [20, 30, 20] : 80);
            hydrateIcons();
        };

        const quizOptionClass = id => {
            if (quizAnswer.value === null) return 'tx-quiz-option-idle';
            if (String(id) === String(quiz.value.correctId)) return 'tx-quiz-option-correct';
            if (String(id) === String(quizAnswer.value)) return 'tx-quiz-option-wrong';
            return 'tx-quiz-option-muted';
        };

        const showView = mode => {
            viewMode.value = mode;
            hydrateIcons();
        };

        const injectStyles = () => {
            if (document.getElementById('athar-transmission-styles')) return;
            const link = document.createElement('link');
            link.id = 'athar-transmission-styles';
            link.rel = 'stylesheet';
            link.href = 'css/transmission.css?v=1';
            document.head.appendChild(link);
        };

        watch(focusId, () => {
            markVisited(focusId.value);
            buildQuiz();
            hydrateIcons();
        });
        watch([viewMode, activeGroup, searchQuery, profileTab, profileOpen], hydrateIcons);

        onMounted(() => {
            injectStyles();
            try {
                visitedIds.value = JSON.parse(localStorage.getItem('athar_transmission_visited') || '[]').map(Number);
                favoriteIds.value = JSON.parse(localStorage.getItem('athar_transmission_favorites') || '[]').map(Number);
            } catch (error) {
                visitedIds.value = [];
                favoriteIds.value = [];
            }
            if (!focusedScholar.value && allScholars.value.length) focusId.value = allScholars.value[0].id;
            if (focusedScholar.value) markVisited(focusedScholar.value.id);
            buildQuiz();
            hydrateIcons();
        });

        return {
            viewMode, activeGroup, searchQuery, focusId, profileOpen, profileTab,
            activeJourneyId, journeyStep, quiz, quizAnswer, quizScore, visitedIds, favoriteIds,
            allScholars, activeThemes, disciplineTabs, journeys, focusedScholar, currentTheme,
            masters, students, filteredScholars, favoriteScholars, visitedCount, explorationProgress,
            stats, activeJourney, journeyScholars, activeJourneyScholar,
            getScholar, getTypeLabel, getTheme, isVisited, isFavorite, setFocus, openProfile,
            closeProfile, toggleFavorite, switchDiscipline, discoverRandom, startJourney,
            goToJourneyStep, nextJourneyStep, previousJourneyStep, buildQuiz, answerQuiz,
            quizOptionClass, showView
        };
    },

    template: `
    <section class="tx-shell min-h-full bg-brand-paper dark:bg-brand-dark text-brand-dark dark:text-gray-100">
        <div class="tx-ambient tx-ambient-one"></div>
        <div class="tx-ambient tx-ambient-two"></div>

        <div class="tx-container">
            <header class="tx-hero">
                <div class="tx-hero-copy">
                    <div class="tx-eyebrow"><i data-lucide="git-fork"></i> Cartographie du savoir</div>
                    <h1>Les chemins de la <span>transmission</span></h1>
                    <p>
                        Explorez les maîtres, les élèves, les écoles juridiques, les compilateurs du hadith
                        et les dix lectures canoniques. Chaque lien précise s’il s’agit d’un enseignement direct
                        ou d’une filiation transmise par plusieurs intermédiaires.
                    </p>
                    <div class="tx-hero-actions">
                        <button type="button" class="tx-btn tx-btn-primary" @click="discoverRandom">
                            <i data-lucide="shuffle"></i> Découverte aléatoire
                        </button>
                        <button type="button" class="tx-btn tx-btn-secondary" @click="showView('journeys')">
                            <i data-lucide="route"></i> Parcours guidés
                        </button>
                    </div>
                </div>

                <div class="tx-progress-card">
                    <div class="tx-progress-ring" :style="{ '--progress': explorationProgress + '%' }">
                        <div><strong>{{ explorationProgress }}%</strong><span>exploré</span></div>
                    </div>
                    <div class="tx-progress-copy">
                        <span>Votre exploration</span>
                        <strong>{{ visitedCount }} / {{ stats.total }} fiches</strong>
                        <p>Les fiches visitées sont mémorisées sur cet appareil.</p>
                    </div>
                </div>
            </header>

            <div class="tx-stats-grid">
                <div class="tx-stat"><i data-lucide="users"></i><strong>{{ stats.total }}</strong><span>fiches documentées</span></div>
                <div class="tx-stat"><i data-lucide="scale"></i><strong>{{ stats.fiqh }}</strong><span>figures du fiqh</span></div>
                <div class="tx-stat"><i data-lucide="scroll-text"></i><strong>{{ stats.hadith }}</strong><span>savants du hadith</span></div>
                <div class="tx-stat"><i data-lucide="book-open"></i><strong>{{ stats.quran }}</strong><span>lecteurs et rāwīs</span></div>
            </div>

            <div class="tx-toolbar">
                <div class="tx-search-wrap">
                    <i data-lucide="search"></i>
                    <input v-model="searchQuery" type="search" placeholder="Rechercher un nom, une ville, une œuvre…" aria-label="Rechercher dans les transmissions">
                    <button v-if="searchQuery" type="button" @click="searchQuery = ''" aria-label="Effacer la recherche"><i data-lucide="x"></i></button>
                </div>

                <div class="tx-discipline-tabs" role="tablist" aria-label="Disciplines">
                    <button v-for="tab in disciplineTabs" :key="tab.key" type="button"
                            @click="switchDiscipline(tab.key)"
                            :class="{ active: activeGroup === tab.key }"
                            :aria-selected="activeGroup === tab.key">
                        <i :data-lucide="tab.icon"></i><span>{{ tab.label }}</span>
                    </button>
                </div>

                <div class="tx-view-switch" role="group" aria-label="Mode d’affichage">
                    <button type="button" @click="showView('explore')" :class="{ active: viewMode === 'explore' }" title="Explorer"><i data-lucide="waypoints"></i></button>
                    <button type="button" @click="showView('directory')" :class="{ active: viewMode === 'directory' }" title="Répertoire"><i data-lucide="layout-grid"></i></button>
                    <button type="button" @click="showView('journeys')" :class="{ active: viewMode === 'journeys' }" title="Parcours"><i data-lucide="route"></i></button>
                </div>
            </div>

            <div v-if="viewMode === 'explore'" class="tx-explore-layout">
                <aside class="tx-side-panel">
                    <div class="tx-panel-heading">
                        <div><span>Répertoire</span><strong>{{ filteredScholars.length }} personnes</strong></div>
                        <i data-lucide="list-filter"></i>
                    </div>
                    <div class="tx-mini-list">
                        <button v-for="scholar in filteredScholars" :key="scholar.id" type="button"
                                @click="setFocus(scholar.id)"
                                :class="['tx-mini-person', { active: focusId === scholar.id }]">
                            <span class="tx-avatar" :style="{ '--accent': getTheme(scholar).accent }">{{ scholar.label.charAt(0) }}</span>
                            <span class="tx-mini-copy"><strong>{{ scholar.label }}</strong><small>{{ scholar.role }}</small></span>
                            <i v-if="isVisited(scholar.id)" data-lucide="check-circle-2" class="tx-visited-icon"></i>
                        </button>
                    </div>
                    <div v-if="favoriteScholars.length" class="tx-favorites-strip">
                        <span><i data-lucide="bookmark"></i> Favoris</span>
                        <button v-for="scholar in favoriteScholars.slice(0, 5)" :key="scholar.id" type="button" @click="setFocus(scholar.id)" :title="scholar.label">
                            {{ scholar.label.charAt(0) }}
                        </button>
                    </div>
                </aside>

                <main v-if="focusedScholar" class="tx-focus-zone">
                    <div class="tx-lineage-label"><i data-lucide="arrow-down"></i> Maîtres et sources de transmission</div>
                    <div v-if="masters.length" class="tx-relations-row tx-relations-masters">
                        <button v-for="master in masters" :key="master.id" type="button" class="tx-relation-card" @click="setFocus(master.id)">
                            <span class="tx-relation-avatar" :style="{ '--accent': getTheme(master).accent }">{{ master.label.charAt(0) }}</span>
                            <span><strong>{{ master.label }}</strong><small>{{ master.relation }}</small></span>
                            <i data-lucide="arrow-up-right"></i>
                        </button>
                    </div>
                    <div v-else class="tx-empty-relation">Aucun maître n’est représenté avant cette fiche dans ce parcours pédagogique.</div>

                    <article class="tx-main-card" :style="{ '--accent': currentTheme.accent }">
                        <div class="tx-card-topline">
                            <span class="tx-category-pill"><i :data-lucide="currentTheme.icon"></i>{{ currentTheme.label }}</span>
                            <div class="tx-card-actions">
                                <button type="button" @click="toggleFavorite(focusedScholar.id)" :class="{ active: isFavorite(focusedScholar.id) }" :aria-label="isFavorite(focusedScholar.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'">
                                    <i :data-lucide="isFavorite(focusedScholar.id) ? 'bookmark-check' : 'bookmark'"></i>
                                </button>
                                <button type="button" @click="openProfile(focusedScholar)" aria-label="Ouvrir la fiche complète"><i data-lucide="expand"></i></button>
                            </div>
                        </div>

                        <div class="tx-main-identity">
                            <div class="tx-main-avatar">{{ focusedScholar.label.charAt(0) }}</div>
                            <div>
                                <span class="tx-type-label">{{ getTypeLabel(focusedScholar) }}</span>
                                <h2>{{ focusedScholar.label }}</h2>
                                <p class="tx-arabic" lang="ar" dir="rtl">{{ focusedScholar.arabicName }}</p>
                            </div>
                        </div>

                        <div class="tx-meta-row">
                            <span><i data-lucide="calendar-days"></i>{{ focusedScholar.dates }}</span>
                            <span><i data-lucide="map-pin"></i>{{ focusedScholar.city || focusedScholar.region }}</span>
                            <span><i data-lucide="badge-info"></i>{{ focusedScholar.role }}</span>
                        </div>

                        <p class="tx-summary">{{ focusedScholar.bio }}</p>

                        <div class="tx-contribution-grid">
                            <div v-for="item in (focusedScholar.contributions || []).slice(0, 3)" :key="item">
                                <i data-lucide="sparkle"></i><span>{{ item }}</span>
                            </div>
                        </div>

                        <div class="tx-main-footer">
                            <button type="button" class="tx-btn tx-btn-primary" @click="openProfile(focusedScholar)">
                                <i data-lucide="book-open-check"></i> Ouvrir la fiche complète
                            </button>
                            <span class="tx-source-hint"><i data-lucide="library"></i>{{ (focusedScholar.sources || []).length }} références indicatives</span>
                        </div>
                    </article>

                    <div class="tx-lineage-label tx-lineage-bottom"><i data-lucide="arrow-down"></i> Élèves et continuateurs</div>
                    <div v-if="students.length" class="tx-relations-row tx-relations-students">
                        <button v-for="student in students" :key="student.id" type="button" class="tx-relation-card" @click="setFocus(student.id)">
                            <span class="tx-relation-avatar" :style="{ '--accent': getTheme(student).accent }">{{ student.label.charAt(0) }}</span>
                            <span><strong>{{ student.label }}</strong><small>{{ student.relation }}</small></span>
                            <i data-lucide="arrow-down-right"></i>
                        </button>
                    </div>
                    <div v-else class="tx-empty-relation">Aucun élève n’est représenté après cette fiche dans le réseau actuel.</div>
                </main>

                <aside class="tx-learning-panel">
                    <div class="tx-quiz-card">
                        <div class="tx-panel-heading">
                            <div><span>Défi express</span><strong>{{ quizScore.correct }} / {{ quizScore.total }} bonnes réponses</strong></div>
                            <i data-lucide="brain-circuit"></i>
                        </div>
                        <template v-if="quiz">
                            <p class="tx-quiz-question">{{ quiz.prompt }}</p>
                            <div class="tx-quiz-options">
                                <button v-for="option in quiz.options" :key="option.id" type="button"
                                        @click="answerQuiz(option.id)"
                                        :disabled="quizAnswer !== null"
                                        :class="quizOptionClass(option.id)">
                                    <span>{{ option.label }}</span>
                                    <i v-if="quizAnswer !== null && String(option.id) === String(quiz.correctId)" data-lucide="check-circle-2"></i>
                                    <i v-else-if="quizAnswer !== null && String(option.id) === String(quizAnswer)" data-lucide="x-circle"></i>
                                </button>
                            </div>
                            <button v-if="quizAnswer !== null" type="button" class="tx-next-question" @click="buildQuiz">
                                Question suivante <i data-lucide="arrow-right"></i>
                            </button>
                        </template>
                    </div>

                    <div class="tx-method-card">
                        <i data-lucide="info"></i>
                        <div><strong>Comment lire le graphe ?</strong><p>Un lien peut représenter un apprentissage direct ou une filiation passant par plusieurs intermédiaires. La fiche indique le niveau de relation.</p></div>
                    </div>

                    <div class="tx-quick-journeys">
                        <span>Parcours recommandés</span>
                        <button v-for="journey in journeys.slice(0, 3)" :key="journey.id" type="button" @click="startJourney(journey)">
                            <i :data-lucide="journey.icon"></i><span><strong>{{ journey.title }}</strong><small>{{ journey.scholarIds.length }} étapes</small></span><i data-lucide="chevron-right"></i>
                        </button>
                    </div>
                </aside>
            </div>

            <div v-else-if="viewMode === 'directory'" class="tx-directory-view">
                <div class="tx-section-heading">
                    <div><span>Répertoire complet</span><h2>{{ filteredScholars.length }} fiches à explorer</h2></div>
                    <p>Filtrez par discipline ou recherchez une ville, une œuvre et un concept.</p>
                </div>
                <div class="tx-directory-grid">
                    <article v-for="scholar in filteredScholars" :key="scholar.id" class="tx-directory-card" :style="{ '--accent': getTheme(scholar).accent }">
                        <div class="tx-directory-top">
                            <span class="tx-directory-avatar">{{ scholar.label.charAt(0) }}</span>
                            <button type="button" @click="toggleFavorite(scholar.id)" :class="{ active: isFavorite(scholar.id) }"><i :data-lucide="isFavorite(scholar.id) ? 'bookmark-check' : 'bookmark'"></i></button>
                        </div>
                        <span class="tx-type-label">{{ getTypeLabel(scholar) }}</span>
                        <h3>{{ scholar.label }}</h3>
                        <p class="tx-arabic" lang="ar" dir="rtl">{{ scholar.arabicName }}</p>
                        <div class="tx-directory-meta"><span>{{ scholar.dates }}</span><span>{{ scholar.city || scholar.region }}</span></div>
                        <p>{{ scholar.bio }}</p>
                        <div class="tx-directory-footer">
                            <span v-if="isVisited(scholar.id)"><i data-lucide="check-circle-2"></i> Visitée</span>
                            <button type="button" @click="openProfile(scholar)">Voir la fiche <i data-lucide="arrow-right"></i></button>
                        </div>
                    </article>
                </div>
                <div v-if="!filteredScholars.length" class="tx-no-results"><i data-lucide="search-x"></i><strong>Aucun résultat</strong><p>Essayez un autre terme ou réinitialisez le filtre.</p></div>
            </div>

            <div v-else class="tx-journeys-view">
                <div class="tx-section-heading">
                    <div><span>Apprendre pas à pas</span><h2>Parcours guidés</h2></div>
                    <p>Chaque parcours relie quelques fiches autour d’une question claire. Avancez étape par étape, puis ouvrez les profils qui vous intéressent.</p>
                </div>

                <div class="tx-journey-grid">
                    <button v-for="journey in journeys" :key="journey.id" type="button" class="tx-journey-card" @click="startJourney(journey)" :class="{ active: activeJourneyId === journey.id }">
                        <span class="tx-journey-icon" :style="{ '--accent': activeThemes[journey.group].accent }"><i :data-lucide="journey.icon"></i></span>
                        <span class="tx-journey-copy"><small>{{ journey.subtitle }}</small><strong>{{ journey.title }}</strong><p>{{ journey.description }}</p></span>
                        <span class="tx-journey-count">{{ journey.scholarIds.length }} étapes</span>
                    </button>
                </div>

                <div v-if="activeJourney && activeJourneyScholar" class="tx-journey-player">
                    <div class="tx-player-header">
                        <div><span>Parcours actif</span><h3>{{ activeJourney.title }}</h3></div>
                        <span>{{ journeyStep + 1 }} / {{ journeyScholars.length }}</span>
                    </div>

                    <div class="tx-stepper">
                        <button v-for="(scholar, index) in journeyScholars" :key="scholar.id" type="button" @click="goToJourneyStep(index)" :class="{ active: journeyStep === index, done: index < journeyStep }">
                            <span>{{ index + 1 }}</span><small>{{ scholar.label }}</small>
                        </button>
                    </div>

                    <article class="tx-player-card" :style="{ '--accent': getTheme(activeJourneyScholar).accent }">
                        <div class="tx-player-avatar">{{ activeJourneyScholar.label.charAt(0) }}</div>
                        <div class="tx-player-content">
                            <span class="tx-type-label">{{ getTypeLabel(activeJourneyScholar) }}</span>
                            <h3>{{ activeJourneyScholar.label }}</h3>
                            <p class="tx-arabic" lang="ar" dir="rtl">{{ activeJourneyScholar.arabicName }}</p>
                            <p>{{ activeJourneyScholar.bio }}</p>
                            <button type="button" @click="openProfile(activeJourneyScholar)">Approfondir cette étape <i data-lucide="expand"></i></button>
                        </div>
                    </article>

                    <div class="tx-player-controls">
                        <button type="button" @click="previousJourneyStep" :disabled="journeyStep === 0"><i data-lucide="arrow-left"></i> Précédent</button>
                        <div class="tx-player-progress"><span :style="{ width: ((journeyStep + 1) / journeyScholars.length * 100) + '%' }"></span></div>
                        <button type="button" @click="nextJourneyStep" :disabled="journeyStep === journeyScholars.length - 1">Suivant <i data-lucide="arrow-right"></i></button>
                    </div>
                </div>
            </div>
        </div>

        <transition name="fade">
            <div v-if="profileOpen && focusedScholar" class="tx-modal-backdrop" @click.self="closeProfile">
                <article class="tx-profile-modal" role="dialog" aria-modal="true" :aria-label="'Fiche de ' + focusedScholar.label" :style="{ '--accent': currentTheme.accent }">
                    <header class="tx-profile-header">
                        <div class="tx-profile-symbol">{{ focusedScholar.label.charAt(0) }}</div>
                        <div class="tx-profile-title">
                            <span class="tx-category-pill"><i :data-lucide="currentTheme.icon"></i>{{ currentTheme.label }}</span>
                            <h2>{{ focusedScholar.label }}</h2>
                            <p class="tx-arabic" lang="ar" dir="rtl">{{ focusedScholar.arabicName }}</p>
                        </div>
                        <div class="tx-profile-actions">
                            <button type="button" @click="toggleFavorite(focusedScholar.id)" :class="{ active: isFavorite(focusedScholar.id) }"><i :data-lucide="isFavorite(focusedScholar.id) ? 'bookmark-check' : 'bookmark'"></i></button>
                            <button type="button" @click="closeProfile"><i data-lucide="x"></i></button>
                        </div>
                    </header>

                    <div class="tx-profile-meta">
                        <span><i data-lucide="calendar-days"></i>{{ focusedScholar.dates }}</span>
                        <span><i data-lucide="map-pin"></i>{{ focusedScholar.city || focusedScholar.region }}</span>
                        <span><i data-lucide="badge-info"></i>{{ focusedScholar.role }}</span>
                        <span><i data-lucide="hourglass"></i>{{ focusedScholar.era }}</span>
                    </div>

                    <nav class="tx-profile-tabs" role="tablist">
                        <button type="button" @click="profileTab = 'overview'" :class="{ active: profileTab === 'overview' }">Vue d’ensemble</button>
                        <button type="button" @click="profileTab = 'lineage'" :class="{ active: profileTab === 'lineage' }">Transmission</button>
                        <button type="button" @click="profileTab = 'works'" :class="{ active: profileTab === 'works' }">Œuvres & apports</button>
                        <button type="button" @click="profileTab = 'sources'" :class="{ active: profileTab === 'sources' }">Sources</button>
                    </nav>

                    <div class="tx-profile-body">
                        <div v-if="profileTab === 'overview'" class="tx-profile-section">
                            <div class="tx-profile-lead"><i data-lucide="quote"></i><p>{{ focusedScholar.bio }}</p></div>
                            <div class="tx-profile-block"><h3>Héritage</h3><p>{{ focusedScholar.legacy || 'Cette fiche présente les principaux repères de son héritage savant.' }}</p></div>
                            <div v-if="focusedScholar.keywords && focusedScholar.keywords.length" class="tx-tags"><span v-for="tag in focusedScholar.keywords" :key="tag">{{ tag }}</span></div>
                        </div>

                        <div v-else-if="profileTab === 'lineage'" class="tx-profile-section">
                            <div class="tx-lineage-columns">
                                <div><h3><i data-lucide="arrow-up"></i> Maîtres et sources</h3>
                                    <button v-for="master in masters" :key="master.id" type="button" @click="setFocus(master.id, { profile: true, group: false })"><strong>{{ master.label }}</strong><small>{{ master.relation }}</small></button>
                                    <p v-if="!masters.length" class="tx-muted">Aucun maître antérieur n’est représenté dans ce réseau.</p>
                                </div>
                                <div><h3><i data-lucide="arrow-down"></i> Élèves et continuateurs</h3>
                                    <button v-for="student in students" :key="student.id" type="button" @click="setFocus(student.id, { profile: true, group: false })"><strong>{{ student.label }}</strong><small>{{ student.relation }}</small></button>
                                    <p v-if="!students.length" class="tx-muted">Aucun élève postérieur n’est représenté dans ce réseau.</p>
                                </div>
                            </div>
                            <div class="tx-method-note"><i data-lucide="triangle-alert"></i><p>Le réseau est une carte pédagogique : il ne prétend pas représenter toutes les rencontres, tous les intermédiaires ni toutes les voies de transmission.</p></div>
                        </div>

                        <div v-else-if="profileTab === 'works'" class="tx-profile-section">
                            <div class="tx-profile-grid">
                                <div><h3>Contributions majeures</h3><ul><li v-for="item in focusedScholar.contributions" :key="item"><i data-lucide="check"></i>{{ item }}</li></ul></div>
                                <div><h3>Œuvres ou corpus associés</h3><ul><li v-for="item in focusedScholar.works" :key="item"><i data-lucide="book-marked"></i>{{ item }}</li><li v-if="!focusedScholar.works || !focusedScholar.works.length" class="tx-muted">Enseignement principalement transmis par les élèves et les sources biographiques.</li></ul></div>
                            </div>
                        </div>

                        <div v-else class="tx-profile-section">
                            <div class="tx-source-intro"><i data-lucide="library-big"></i><div><h3>Références indicatives</h3><p>Ces références servent à orienter la vérification. Elles ne signifient pas que chaque détail de la fiche fait l’objet d’un consensus absolu.</p></div></div>
                            <ol class="tx-source-list"><li v-for="source in focusedScholar.sources" :key="source">{{ source }}</li></ol>
                            <p v-if="!focusedScholar.sources || !focusedScholar.sources.length" class="tx-muted">Références détaillées à compléter.</p>
                        </div>
                    </div>
                </article>
            </div>
        </transition>
    </section>
    `
};
