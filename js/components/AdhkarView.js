const AdhkarView = {
    props: ['adhkar', 'settings'],
    setup(props) {
        const STORAGE_KEY = 'athar_adhkar_v2';
        const mode = Vue.ref('library');
        const query = Vue.ref('');
        const category = Vue.ref('Tous');
        const favoritesOnly = Vue.ref(false);
        const selected = Vue.ref(null);
        const activeRoutine = Vue.ref(null);
        const routineIndex = Vue.ref(0);
        const compactArabic = Vue.ref(false);
        const visibleLimit = Vue.ref(18);
        let previousFocus = null;
        const state = Vue.reactive({ counts: {}, favorites: [], totals: {}, history: [], lastDate: '' });

        const todayKey = () => new Date().toISOString().slice(0, 10);
        const clean = value => String(value || '').replace(/\s*\[cite:[^\]]+\]/gi, '').replace(/\s+/g, ' ').trim();
        const normalize = value => clean(value).toLocaleLowerCase('fr');
        const rawItems = Vue.computed(() => {
            const source = (typeof ADHKAR_DATA !== 'undefined' && Array.isArray(ADHKAR_DATA)) ? ADHKAR_DATA : (Array.isArray(props.adhkar) ? props.adhkar : []);
            return source.filter(Boolean).map(item => ({
                ...item,
                id: Number(item.id),
                count: Math.max(1, Number(item.count) || 1),
                category: clean(item.category) || 'Autres',
                title: clean(item.title),
                arabic: clean(item.arabic),
                phonetic: clean(item.phonetic),
                translation: clean(item.translation),
                context: clean(item.context),
                virtue: clean(item.virtue),
                source: clean(item.source),
                source_url: clean(item.source_url),
                additional_source_url: clean(item.additional_source_url),
                additional_source_label: clean(item.additional_source_label),
                translation_label: clean(item.translation_label),
                editorial_note: clean(item.editorial_note)
            }));
        });

        const categories = Vue.computed(() => ['Tous', ...new Set(rawItems.value.map(item => item.category))]);
        const favorites = Vue.computed(() => new Set(state.favorites.map(Number)));
        const isFavorite = id => favorites.value.has(Number(id));
        const progress = item => Math.min(100, ((Number(state.counts[item.id]) || 0) / item.count) * 100);
        const isComplete = item => (Number(state.counts[item.id]) || 0) >= item.count;

        const filteredItems = Vue.computed(() => {
            const q = normalize(query.value);
            return rawItems.value.filter(item => {
                if (category.value !== 'Tous' && item.category !== category.value) return false;
                if (favoritesOnly.value && !isFavorite(item.id)) return false;
                if (!q) return true;
                return [item.title, item.arabic, item.phonetic, item.translation, item.context, item.source, item.category]
                    .some(value => normalize(value).includes(q));
            });
        });

        const displayedItems = Vue.computed(() => filteredItems.value.slice(0,visibleLimit.value));
        const loadMore = () => { visibleLimit.value += 18; Vue.nextTick(() => window.lucide?.createIcons()); };
        const categoryChoices = Vue.computed(() => categories.value.map(label => ({
            label, count:label === 'Tous'
                ? rawItems.value.length
                : rawItems.value.filter(item => item.category === label).length
        })));
        const resetFilters = () => {
            query.value=''; category.value='Tous'; favoritesOnly.value=false; visibleLimit.value=18;
        };
        const preview = (value,length=150) => {
            const text = String(value || '').replace(/\s+/g,' ').trim();
            if (text.length <= length) return text;
            const cut = text.slice(0,length+1);
            return cut.slice(0,Math.max(60,cut.lastIndexOf(' '))).trimEnd()+'…';
        };
        const byCategories = wanted => rawItems.value.filter(item => wanted.includes(item.category));
        const routines = Vue.computed(() => {
            const firstOfEach = [];
            const seen = new Set();
            rawItems.value.forEach(item => {
                if (!seen.has(item.category)) { seen.add(item.category); firstOfEach.push(item); }
            });
            return [
                {
                    id: 'start-day', icon: 'sunrise', title: 'Commencer la journée', subtitle: 'Réveil, purification et préparation',
                    note: 'Parcours pratique construit à partir des rubriques existantes ; il ne constitue pas un ordre rituel unique.',
                    items: byCategories(['Réveil', 'Ablutions', 'Habits']).slice(0, 9)
                },
                {
                    id: 'home-path', icon: 'home', title: 'Sortir, revenir et se rendre à la mosquée', subtitle: 'Maison, déplacement et mosquée',
                    note: 'Une sélection pour accompagner les transitions ordinaires de la journée.',
                    items: byCategories(['Maison', 'Mosquée']).slice(0, 8)
                },
                {
                    id: 'prayer-path', icon: 'circle-dot', title: 'Autour de la prière', subtitle: 'Adhan et ouverture de la prière',
                    note: 'Les formulations et nombres restent ceux indiqués par chaque fiche.',
                    items: byCategories(['Adhan', 'Prière']).slice(0, 10)
                },
                {
                    id: 'essentials', icon: 'route', title: 'Repères du quotidien', subtitle: 'Un dhikr représentatif par contexte',
                    note: 'Parcours de découverte destiné à parcourir la bibliothèque sans prétendre remplacer un recueil complet.',
                    items: firstOfEach.slice(0, 10)
                }
            ].filter(routine => routine.items.length);
        });

        const routineCompletion = routine => {
            if (!routine.items.length) return 0;
            return Math.round((routine.items.filter(isComplete).length / routine.items.length) * 100);
        };

        const totalRepetitions = Vue.computed(() => Object.values(state.totals).reduce((sum, value) => sum + (Number(value) || 0), 0));
        const todayHistory = Vue.computed(() => state.history.filter(entry => entry.date === todayKey()));
        const completedToday = Vue.computed(() => new Set(todayHistory.value.map(entry => Number(entry.itemId))).size);
        const favoriteCount = Vue.computed(() => state.favorites.length);

        const weeklyData = Vue.computed(() => {
            const formatter = new Intl.DateTimeFormat('fr-FR', { weekday: 'short' });
            return Array.from({ length: 7 }, (_, offset) => {
                const date = new Date();
                date.setDate(date.getDate() - (6 - offset));
                const key = date.toISOString().slice(0, 10);
                const total = state.history.filter(entry => entry.date === key).reduce((sum, entry) => sum + (Number(entry.repetitions) || 0), 0);
                return { key, label: formatter.format(date).replace('.', ''), total };
            });
        });
        const maxWeekly = Vue.computed(() => Math.max(1, ...weeklyData.value.map(day => day.total)));

        const streak = Vue.computed(() => {
            const dates = new Set(state.history.map(entry => entry.date));
            let count = 0;
            const cursor = new Date();
            while (dates.has(cursor.toISOString().slice(0, 10))) {
                count += 1;
                cursor.setDate(cursor.getDate() - 1);
            }
            return count;
        });

        const currentRoutineItems = Vue.computed(() => activeRoutine.value?.items || []);
        const currentRoutinePosition = Vue.computed(() => activeRoutine.value ? `${routineIndex.value + 1} / ${activeRoutine.value.items.length}` : '');

        const persist = () => localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state }));
        const load = () => {
            try {
                const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
                if (saved && typeof saved === 'object') Object.assign(state, saved);
            } catch (_) {}
            if (state.lastDate !== todayKey()) {
                state.counts = {};
                state.lastDate = todayKey();
                persist();
            }
        };

        const toggleFavorite = item => {
            const id = Number(item.id);
            state.favorites = isFavorite(id) ? state.favorites.filter(value => Number(value) !== id) : [...state.favorites, id];
        };

        const recordCompletion = item => {
            const date = todayKey();
            const already = state.history.some(entry => entry.date === date && Number(entry.itemId) === Number(item.id));
            if (!already) {
                state.history.unshift({
                    id: `${Date.now()}-${item.id}`,
                    date,
                    at: new Date().toISOString(),
                    itemId: item.id,
                    title: item.title,
                    category: item.category,
                    repetitions: item.count
                });
                state.history = state.history.slice(0, 120);
            }
        };

        const increment = item => {
            const current = Number(state.counts[item.id]) || 0;
            if (current >= item.count) return;
            state.counts[item.id] = current + 1;
            state.totals[item.id] = (Number(state.totals[item.id]) || 0) + 1;
            if (state.counts[item.id] >= item.count) {
                recordCompletion(item);
                if (navigator.vibrate) navigator.vibrate([35, 45, 35]);
            } else if (navigator.vibrate) navigator.vibrate(8);
        };

        const decrement = item => {
            state.counts[item.id] = Math.max(0, (Number(state.counts[item.id]) || 0) - 1);
        };
        const resetItem = item => { state.counts[item.id] = 0; };
        const resetToday = () => {
            if (!window.confirm('Réinitialiser les compteurs en cours pour aujourd’hui ?')) return;
            state.counts = {};
        };

        const focusReader = () => Vue.nextTick(() => {
            window.lucide?.createIcons();
            document.querySelector('.adhkar-pro-reader-close')?.focus();
        });
        const openItem = item => {
            previousFocus = document.activeElement;
            activeRoutine.value = null;
            selected.value = item;
            focusReader();
        };
        const closeItem = () => {
            selected.value = null; activeRoutine.value = null; routineIndex.value = 0;
            Vue.nextTick(() => { if (previousFocus?.isConnected) previousFocus.focus(); });
        };
        const openRoutine = routine => {
            previousFocus = document.activeElement;
            activeRoutine.value = routine;
            routineIndex.value = 0;
            selected.value = routine.items[0] || null;
            focusReader();
        };
        const nextRoutine = () => {
            if (!activeRoutine.value) return;
            if (routineIndex.value < activeRoutine.value.items.length - 1) {
                routineIndex.value += 1;
                selected.value = activeRoutine.value.items[routineIndex.value];
            } else {
                selected.value = null;
                activeRoutine.value = null;
                mode.value = 'progress';
            }
        };
        const previousRoutine = () => {
            if (!activeRoutine.value || routineIndex.value <= 0) return;
            routineIndex.value -= 1;
            selected.value = activeRoutine.value.items[routineIndex.value];
        };
        const copyItem = async item => {
            const text = `${item.arabic}\n\n${item.phonetic}\n\n${item.translation}\n— ${item.source}`;
            try { await navigator.clipboard.writeText(text); } catch (_) {}
        };
        const selectMode = value => {
            mode.value = value;
            selected.value = null;
            activeRoutine.value = null;
            setTimeout(() => window.lucide?.createIcons(), 20);
        };
        const formatDate = value => {
            try { return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(value)); }
            catch (_) { return value; }
        };
        const categoryIcon = value => ({ Réveil: 'sunrise', Habits: 'shirt', Toilettes: 'door-open', Ablutions: 'droplets', Maison: 'home', Mosquée: 'landmark', Adhan: 'volume-2', Prière: 'circle-dot' }[value] || 'sparkles');

        const onKeydown = event => {
            if (!selected.value) return;
            if (event.key === 'Escape') { event.preventDefault(); closeItem(); return; }
            const target = event.target;
            const modal = document.querySelector('.adhkar-pro-reader');
            if (event.key === 'Tab' && modal) {
                const controls = [...modal.querySelectorAll('button:not([disabled]),a[href],summary,[tabindex]:not([tabindex="-1"])')]
                    .filter(el => el.getClientRects().length);
                if (!controls.length) return;
                if (event.shiftKey && document.activeElement===controls[0]) {
                    event.preventDefault(); controls[controls.length-1].focus();
                } else if (!event.shiftKey && document.activeElement===controls[controls.length-1]) {
                    event.preventDefault(); controls[0].focus();
                }
            }
            if (target?.closest?.('button,a,input,textarea,select,summary,[contenteditable="true"]')) return;
            if (event.key === 'ArrowRight' && activeRoutine.value) nextRoutine();
            if (event.key === 'ArrowLeft' && activeRoutine.value) previousRoutine();
        };

        Vue.onMounted(() => {
            load();
            document.addEventListener('keydown', onKeydown);
            setTimeout(() => window.lucide?.createIcons(), 30);
        });
        Vue.onUnmounted(() => document.removeEventListener('keydown', onKeydown));
        Vue.watch(state, persist, { deep: true });
        Vue.watch([category,favoritesOnly,query], () => {
            visibleLimit.value=18;
            Vue.nextTick(() => window.lucide?.createIcons());
        });
        Vue.watch([mode,selected,activeRoutine], () => Vue.nextTick(() => window.lucide?.createIcons()));

        return {
            mode, query, category, favoritesOnly, selected, activeRoutine, routineIndex, compactArabic,
            rawItems, categories, categoryChoices, filteredItems, displayedItems, visibleLimit, loadMore, resetFilters, preview, routines,
            state, isFavorite, isComplete, progress, routineCompletion, totalRepetitions, completedToday, favoriteCount, weeklyData,
            maxWeekly, streak, currentRoutineItems, currentRoutinePosition, toggleFavorite, increment, decrement, resetItem, resetToday, openItem,
            closeItem, openRoutine, nextRoutine, previousRoutine, copyItem, selectMode, formatDate, categoryIcon
        };
    },
    template: `

    <section class="adhkar-pro-shell">
        <header class="adhkar-pro-hero">
            <span class="adhkar-pro-kicker"><i data-lucide="sparkles" aria-hidden="true"></i> Le rappel au quotidien</span>
            <h1>Al-Adhkâr <span lang="ar" dir="rtl">الأذكار</span></h1>
            <p>Choisissez un contexte, lisez l'invocation à votre rythme et retrouvez facilement ses références.</p>
            <div class="adhkar-pro-hero-meta">
                <span><strong>{{ rawItems.length }}</strong> invocations</span>
                <span aria-hidden="true">·</span>
                <span><strong>{{ categories.length-1 }}</strong> contextes</span>
            </div>
        </header>

        <nav class="adhkar-pro-tabs" aria-label="Navigation Al-Adhkâr">
            <button type="button" @click="selectMode('library')" :class="{active:mode==='library'}" :aria-pressed="mode==='library'">
                <i data-lucide="book-open" aria-hidden="true"></i><span>Invocations</span>
            </button>
            <button type="button" @click="selectMode('routines')" :class="{active:mode==='routines'}" :aria-pressed="mode==='routines'">
                <i data-lucide="route" aria-hidden="true"></i><span>Parcours guidés</span>
            </button>
            <button type="button" @click="selectMode('progress')" :class="{active:mode==='progress'}" :aria-pressed="mode==='progress'">
                <i data-lucide="chart-no-axes-column-increasing" aria-hidden="true"></i><span>Suivi personnel</span>
            </button>
        </nav>

        <main class="adhkar-pro-main">
            <section v-if="mode==='library'" class="adhkar-pro-library">
                <div class="adhkar-pro-library-toolbar">
                    <label class="adhkar-pro-search">
                        <i data-lucide="search" aria-hidden="true"></i>
                        <input v-model="query" type="search" autocomplete="off"
                            aria-label="Rechercher une invocation" placeholder="Rechercher une invocation, un contexte…">
                    </label>
                    <button type="button" @click="favoritesOnly=!favoritesOnly" :aria-pressed="favoritesOnly" :class="{active:favoritesOnly}">
                        <i data-lucide="heart" aria-hidden="true"></i> Favoris
                    </button>
                    <button type="button" @click="compactArabic=!compactArabic" :aria-pressed="compactArabic" :class="{active:compactArabic}">
                        <i data-lucide="type" aria-hidden="true"></i> Arabe compact
                    </button>
                </div>

                <div class="adhkar-pro-category-row" role="group" aria-label="Filtrer par contexte">
                    <button v-for="choice in categoryChoices" :key="choice.label" type="button"
                        @click="category=choice.label" :aria-pressed="category===choice.label" :class="{active:category===choice.label}">
                        {{ choice.label === 'Tous' ? 'Tous les contextes' : choice.label }}
                        <small>{{ choice.count }}</small>
                    </button>
                </div>

                <header class="adhkar-pro-results-head">
                    <div><span>À découvrir</span><h2>{{ category==='Tous' ? 'Toutes les invocations' : category }}</h2></div>
                    <p aria-live="polite">{{ filteredItems.length }} invocation{{ filteredItems.length>1?'s':'' }}</p>
                </header>
                <div class="adhkar-pro-results-actions">
                    <button v-if="category!=='Tous' || favoritesOnly || query" type="button" @click="resetFilters">
                        <i data-lucide="rotate-ccw" aria-hidden="true"></i> Effacer les filtres
                    </button>
                    <button type="button" @click="resetToday" class="adhkar-pro-reset-today">
                        <i data-lucide="refresh-cw" aria-hidden="true"></i> Réinitialiser les compteurs
                    </button>
                </div>

                <div v-if="filteredItems.length" class="adhkar-pro-card-grid">
                    <article v-for="item in displayedItems" :key="item.id" class="adhkar-pro-card"
                        :class="{complete:isComplete(item)}" tabindex="0" role="button"
                        :aria-label="'Lire l’invocation : '+item.title"
                        @click="openItem(item)" @keydown.enter.self.prevent="openItem(item)" @keydown.space.self.prevent="openItem(item)">
                        <div class="adhkar-pro-card-top">
                            <span class="adhkar-pro-card-emblem" aria-hidden="true"><i :data-lucide="categoryIcon(item.category)"></i></span>
                            <span class="adhkar-pro-card-label">{{ item.category }}</span>
                            <button type="button" @click.stop="toggleFavorite(item)" @keydown.stop
                                :aria-label="isFavorite(item.id)?'Retirer des favoris':'Ajouter aux favoris'"
                                :aria-pressed="isFavorite(item.id)">
                                <i data-lucide="heart" aria-hidden="true" :class="{filled:isFavorite(item.id)}"></i>
                            </button>
                        </div>
                        <h3>{{ item.title }}</h3>
                        <p class="adhkar-pro-card-arabic" :class="{compact:compactArabic}" lang="ar" dir="rtl">{{ preview(item.arabic,compactArabic?75:125) }}</p>
                        <p class="adhkar-pro-card-meaning">{{ preview(item.translation,150) }}</p>
                        <footer class="adhkar-pro-card-foot">
                            <span>{{ item.count }} répétition{{ item.count>1?'s':'' }}</span>
                            <div class="adhkar-pro-card-progress" :aria-label="'Progression '+Math.round(progress(item))+' pour cent'">
                                <i :style="{width:progress(item)+'%'}"></i>
                            </div>
                            <strong>{{ isComplete(item) ? 'Terminé' : 'Lire' }} <i data-lucide="arrow-right" aria-hidden="true"></i></strong>
                        </footer>
                    </article>
                </div>
                <div v-if="filteredItems.length && displayedItems.length<filteredItems.length" class="adhkar-pro-more">
                    <span>{{ displayedItems.length }} invocations affichées sur {{ filteredItems.length }}</span>
                    <button type="button" @click="loadMore">Afficher plus d'invocations <i data-lucide="chevron-down" aria-hidden="true"></i></button>
                </div>
                <div v-if="!filteredItems.length" class="adhkar-pro-empty" role="status">
                    <i data-lucide="search-x" aria-hidden="true"></i>
                    <h3>Aucune invocation trouvée</h3>
                    <p>Essayez une autre recherche ou retirez un filtre.</p>
                    <button type="button" @click="resetFilters">Tout afficher</button>
                </div>
            </section>

            <section v-else-if="mode==='routines'" class="adhkar-pro-routines">
                <div class="adhkar-pro-section-head">
                    <div><span>Pratique guidée</span><h2>Choisir un parcours</h2></div>
                    <p>Quelques chemins simples pour retrouver les invocations au fil de la journée.</p>
                </div>
                <div class="adhkar-pro-routine-grid">
                    <article v-for="routine in routines" :key="routine.id" class="adhkar-pro-routine-card">
                        <div class="adhkar-pro-routine-top">
                            <span class="adhkar-pro-routine-icon"><i :data-lucide="routine.icon" aria-hidden="true"></i></span>
                            <span class="adhkar-pro-routine-count">{{ routine.items.length }} invocations</span>
                        </div>
                        <h3>{{ routine.title }}</h3>
                        <p>{{ routine.subtitle }}</p>
                        <div class="adhkar-pro-routine-bottom">
                            <div class="adhkar-pro-routine-progress" :aria-label="'Progression '+routineCompletion(routine)+' pour cent'">
                                <i :style="{width:routineCompletion(routine)+'%'}"></i>
                            </div>
                            <small>{{ routineCompletion(routine) }} % terminé</small>
                            <button type="button" @click="openRoutine(routine)">
                                Commencer le parcours <i data-lucide="arrow-right" aria-hidden="true"></i>
                            </button>
                        </div>
                    </article>
                </div>
                <details class="adhkar-pro-method-note">
                    <summary>Méthode et sources <i data-lucide="chevron-down" aria-hidden="true"></i></summary>
                    <p>Les parcours sont des sélections pratiques des rubriques existantes, et non un ordre rituel unique. Les formulations et nombres de répétitions restent ceux de chaque fiche. Pour une étude détaillée, consulter l'édition complète et les commentaires savants.</p>
                </details>
            </section>

            <section v-else class="adhkar-pro-progress">
                <div class="adhkar-pro-section-head">
                    <div><span>Votre pratique</span><h2>Suivi personnel</h2></div>
                    <p>Ces informations restent enregistrées dans ce navigateur.</p>
                </div>
                <div class="adhkar-pro-stat-grid">
                    <article><i data-lucide="check-circle-2" aria-hidden="true"></i><b>{{ completedToday }}</b><span>fiches terminées aujourd’hui</span></article>
                    <article><i data-lucide="flame" aria-hidden="true"></i><b>{{ streak }}</b><span>jours consécutifs</span></article>
                    <article><i data-lucide="heart" aria-hidden="true"></i><b>{{ favoriteCount }}</b><span>favoris</span></article>
                    <article><i data-lucide="hash" aria-hidden="true"></i><b>{{ totalRepetitions }}</b><span>répétitions cumulées</span></article>
                </div>
                <div class="adhkar-pro-progress-layout">
                    <article class="adhkar-pro-week-card">
                        <div class="adhkar-pro-section-head"><div><span>Sept derniers jours</span><h2>Régularité</h2></div></div>
                        <div class="adhkar-pro-bars"><div v-for="day in weeklyData" :key="day.key"><span>{{ day.total }}</span><i><b :style="{height:Math.max(5,(day.total/maxWeekly)*100)+'%'}"></b></i><small>{{ day.label }}</small></div></div>
                    </article>
                    <article class="adhkar-pro-history-card">
                        <div class="adhkar-pro-section-head"><div><span>Journal local</span><h2>Dernières pratiques</h2></div></div>
                        <div class="adhkar-pro-history-list">
                            <div v-for="entry in state.history.slice(0,12)" :key="entry.id"><i data-lucide="check" aria-hidden="true"></i><div><b>{{ entry.title }}</b><span>{{ entry.category }} · {{ entry.repetitions }} répétition<span v-if="entry.repetitions>1">s</span></span></div><time>{{ formatDate(entry.at) }}</time></div>
                            <p v-if="!state.history.length" class="adhkar-pro-no-history">Aucune séance enregistrée. Terminez une fiche pour commencer votre journal.</p>
                        </div>
                    </article>
                </div>
            </section>
        </main>

        <transition name="fade">
            <div v-if="selected" class="adhkar-pro-reader-layer" @click.self="closeItem">
                <article class="adhkar-pro-reader" role="dialog" aria-modal="true" :aria-label="selected.title">
                    <header>
                        <button type="button" class="adhkar-pro-reader-close" @click="closeItem" aria-label="Fermer le dhikr">
                            <i data-lucide="x" aria-hidden="true"></i>
                        </button>
                        <div>
                            <span>{{ activeRoutine ? activeRoutine.title+' · '+currentRoutinePosition : selected.category }}</span>
                            <h2>{{ selected.title }}</h2>
                        </div>
                        <button type="button" @click="toggleFavorite(selected)" :aria-pressed="isFavorite(selected.id)"
                            :aria-label="isFavorite(selected.id)?'Retirer des favoris':'Ajouter aux favoris'">
                            <i data-lucide="heart" aria-hidden="true" :class="{filled:isFavorite(selected.id)}"></i>
                        </button>
                    </header>
                    <div class="adhkar-pro-reader-scroll">
                        <section class="adhkar-pro-arabic-block" aria-label="Texte arabe de l'invocation">
                            <p dir="rtl" lang="ar">{{ selected.arabic }}</p>
                            <button type="button" @click="copyItem(selected)"><i data-lucide="copy" aria-hidden="true"></i> Copier</button>
                        </section>

                        <section class="adhkar-pro-reading-grid" aria-label="Lecture et sens">
                            <article v-if="selected.phonetic"><span>Translittération</span><p class="phonetic">{{ selected.phonetic }}</p></article>
                            <article><span>{{ selected.translation_label || "Sens en français" }}</span><p>{{ selected.translation }}</p></article>
                        </section>

                        <section class="adhkar-pro-counter-zone" aria-label="Compteur de répétitions">
                            <div class="adhkar-pro-counter-heading">
                                <span><i data-lucide="repeat" aria-hidden="true"></i> Répétitions</span>
                                <strong>{{ state.counts[selected.id] || 0 }} / {{ selected.count }}</strong>
                            </div>
                            <div class="adhkar-pro-reader-progress"><i :style="{width:progress(selected)+'%'}"></i></div>
                            <button type="button" class="adhkar-pro-counter" @click="increment(selected)" :disabled="isComplete(selected)"
                                :class="{complete:isComplete(selected)}"
                                :aria-label="isComplete(selected)?'Invocation terminée':'Compter une répétition'">
                                <template v-if="isComplete(selected)"><i data-lucide="check" aria-hidden="true"></i> Terminé</template>
                                <template v-else><i data-lucide="plus" aria-hidden="true"></i> Ajouter une répétition</template>
                            </button>
                            <div class="adhkar-pro-counter-actions">
                                <button type="button" @click="decrement(selected)" :disabled="!(state.counts[selected.id]>0)">
                                    <i data-lucide="undo-2" aria-hidden="true"></i> Annuler
                                </button>
                                <button type="button" @click="resetItem(selected)">
                                    <i data-lucide="rotate-ccw" aria-hidden="true"></i> Recommencer
                                </button>
                            </div>
                        </section>

                        <details class="adhkar-pro-reader-notes">
                            <summary>Contexte et référence <i data-lucide="chevron-down" aria-hidden="true"></i></summary>
                            <div class="adhkar-pro-reader-notes-body">
                                <div><strong>Contexte d’usage</strong><p>{{ selected.context || 'Consulter la source complète pour le contexte détaillé.' }}</p></div>
                                <div><strong>Référence bibliographique</strong><p>{{ selected.source || 'Source non précisée dans la fiche.' }}</p></div>
                                <div v-if="selected.source_url || selected.additional_source_url"><strong>Textes de référence</strong>
                                    <p v-if="selected.source_url"><a class="adhkar-source-link" :href="selected.source_url" target="_blank" rel="noopener noreferrer">Consulter Hisn al-Muslim n° {{ selected.id }}</a></p>
                                    <p v-if="selected.additional_source_url"><a class="adhkar-source-link" :href="selected.additional_source_url" target="_blank" rel="noopener noreferrer">{{ selected.additional_source_label || 'Consulter la source complémentaire' }}</a></p>
                                </div>
                                <div v-if="selected.editorial_note"><strong>Précision éditoriale</strong><p>{{ selected.editorial_note }}</p></div>
                                <div v-if="selected.virtue"><strong>Mérite rapporté</strong><p>{{ selected.virtue }}</p></div>
                            </div>
                        </details>
                    </div>
                    <footer v-if="activeRoutine">
                        <button type="button" @click="previousRoutine" :disabled="routineIndex===0">
                            <i data-lucide="arrow-left" aria-hidden="true"></i> Précédent
                        </button>
                        <span>{{ currentRoutinePosition }}</span>
                        <button type="button" @click="nextRoutine">
                            {{ routineIndex===activeRoutine.items.length-1?'Terminer':'Suivant' }}
                            <i data-lucide="arrow-right" aria-hidden="true"></i>
                        </button>
                    </footer>
                </article>
            </div>
        </transition>
    </section>
    `
};
