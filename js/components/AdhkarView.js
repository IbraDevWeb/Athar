const AdhkarView = {
    props: ['adhkar', 'settings'],
    setup(props) {
        const STORAGE_KEY = 'athar_adhkar_v2';
        const mode = Vue.ref('routines');
        const query = Vue.ref('');
        const category = Vue.ref('Tous');
        const favoritesOnly = Vue.ref(false);
        const selected = Vue.ref(null);
        const activeRoutine = Vue.ref(null);
        const routineIndex = Vue.ref(0);
        const compactArabic = Vue.ref(false);
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
                source: clean(item.source)
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

        const openItem = item => {
            selected.value = item;
            setTimeout(() => window.lucide?.createIcons(), 20);
        };
        const closeItem = () => { selected.value = null; activeRoutine.value = null; routineIndex.value = 0; };
        const openRoutine = routine => {
            activeRoutine.value = routine;
            routineIndex.value = 0;
            selected.value = routine.items[0] || null;
            setTimeout(() => window.lucide?.createIcons(), 20);
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
            const target = event.target;
            if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
            if (event.key === 'Escape' && selected.value) { event.preventDefault(); closeItem(); }
            if ((event.code === 'Space' || event.key === 'Enter') && selected.value) { event.preventDefault(); increment(selected.value); }
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
        Vue.watch([mode, category, favoritesOnly, query], () => setTimeout(() => window.lucide?.createIcons(), 20));

        return {
            mode, query, category, favoritesOnly, selected, activeRoutine, routineIndex, compactArabic, categories, filteredItems, routines,
            state, isFavorite, isComplete, progress, routineCompletion, totalRepetitions, completedToday, favoriteCount, weeklyData,
            maxWeekly, streak, currentRoutineItems, currentRoutinePosition, toggleFavorite, increment, decrement, resetItem, resetToday, openItem,
            closeItem, openRoutine, nextRoutine, previousRoutine, copyItem, selectMode, formatDate, categoryIcon
        };
    },
    template: `
    <section class="adhkar-pro-shell">
        <header class="adhkar-pro-hero">
            <div>
                <span class="adhkar-pro-kicker"><i data-lucide="sparkles"></i> Le rappel au quotidien</span>
                <h1>Al-Adhkar <span>الأذكار</span></h1>
                <p>Un espace de lecture, de mémorisation et de pratique personnelle organisé par contexte.</p>
            </div>
            <div class="adhkar-pro-hero-stats">
                <article><b>{{ completedToday }}</b><span>terminés aujourd’hui</span></article>
                <article><b>{{ streak }}</b><span>jours de régularité</span></article>
                <article><b>{{ totalRepetitions }}</b><span>répétitions enregistrées</span></article>
            </div>
        </header>

        <nav class="adhkar-pro-tabs" aria-label="Navigation Al-Adhkar">
            <button @click="selectMode('routines')" :class="{active:mode==='routines'}"><i data-lucide="route"></i><span>Parcours</span></button>
            <button @click="selectMode('library')" :class="{active:mode==='library'}"><i data-lucide="library"></i><span>Bibliothèque</span></button>
            <button @click="selectMode('progress')" :class="{active:mode==='progress'}"><i data-lucide="chart-no-axes-column-increasing"></i><span>Progression</span></button>
        </nav>

        <main class="adhkar-pro-main">
            <section v-if="mode==='routines'" class="adhkar-pro-routines">
                <div class="adhkar-pro-section-head">
                    <div><span>Pratique guidée</span><h2>Choisir un parcours</h2></div>
                    <p>Ces sélections organisent la bibliothèque pour faciliter l’usage. Elles ne prétendent pas constituer un ordre canonique unique.</p>
                </div>
                <div class="adhkar-pro-routine-grid">
                    <article v-for="routine in routines" :key="routine.id" class="adhkar-pro-routine-card">
                        <div class="adhkar-pro-routine-icon"><i :data-lucide="routine.icon"></i></div>
                        <span>{{ routine.items.length }} invocations</span>
                        <h3>{{ routine.title }}</h3>
                        <p>{{ routine.subtitle }}</p>
                        <div class="adhkar-pro-routine-progress"><i :style="{width:routineCompletion(routine)+'%'}"></i></div>
                        <small>{{ routineCompletion(routine) }} % terminé</small>
                        <button @click="openRoutine(routine)">Commencer <i data-lucide="arrow-right"></i></button>
                    </article>
                </div>
                <aside class="adhkar-pro-method-note"><i data-lucide="book-open-check"></i><div><b>Méthode éditoriale</b><p>Le texte arabe, la translittération, le sens et la source affichée reprennent les données du recueil. Pour une étude juridique ou critique détaillée, consulter l’édition complète et les commentaires savants.</p></div></aside>
            </section>

            <section v-else-if="mode==='library'" class="adhkar-pro-library">
                <div class="adhkar-pro-library-toolbar">
                    <label><i data-lucide="search"></i><input v-model="query" placeholder="Rechercher un contexte, une formule ou une source…"></label>
                    <button @click="favoritesOnly=!favoritesOnly" :class="{active:favoritesOnly}"><i data-lucide="heart"></i> Favoris</button>
                    <button @click="compactArabic=!compactArabic" :class="{active:compactArabic}"><i data-lucide="type"></i> Arabe compact</button>
                </div>
                <div class="adhkar-pro-category-row">
                    <button v-for="cat in categories" :key="cat" @click="category=cat" :class="{active:category===cat}">{{ cat }}</button>
                </div>
                <div class="adhkar-pro-result-line"><b>{{ filteredItems.length }}</b> invocation<span v-if="filteredItems.length>1">s</span><button @click="resetToday">Réinitialiser les compteurs du jour</button></div>
                <div class="adhkar-pro-card-grid">
                    <article v-for="item in filteredItems" :key="item.id" class="adhkar-pro-card" :class="{complete:isComplete(item)}" @click="openItem(item)">
                        <div class="adhkar-pro-card-top"><span><i :data-lucide="categoryIcon(item.category)"></i>{{ item.category }}</span><button @click.stop="toggleFavorite(item)" :aria-label="isFavorite(item.id)?'Retirer des favoris':'Ajouter aux favoris'"><i data-lucide="heart" :class="{filled:isFavorite(item.id)}"></i></button></div>
                        <h3>{{ item.title }}</h3>
                        <p class="adhkar-pro-card-arabic" :class="{compact:compactArabic}" dir="rtl" lang="ar">{{ item.arabic }}</p>
                        <p class="adhkar-pro-card-meaning">{{ item.translation }}</p>
                        <div class="adhkar-pro-card-foot"><span>{{ item.count }}×</span><div><i :style="{width:progress(item)+'%'}"></i></div><b>{{ Math.round(progress(item)) }} %</b></div>
                    </article>
                </div>
                <div v-if="!filteredItems.length" class="adhkar-pro-empty"><i data-lucide="search-x"></i><h3>Aucun résultat</h3><p>Modifiez la recherche ou les filtres.</p></div>
            </section>

            <section v-else class="adhkar-pro-progress">
                <div class="adhkar-pro-stat-grid">
                    <article><i data-lucide="check-circle-2"></i><b>{{ completedToday }}</b><span>fiches terminées aujourd’hui</span></article>
                    <article><i data-lucide="flame"></i><b>{{ streak }}</b><span>jours consécutifs</span></article>
                    <article><i data-lucide="heart"></i><b>{{ favoriteCount }}</b><span>favoris</span></article>
                    <article><i data-lucide="hash"></i><b>{{ totalRepetitions }}</b><span>répétitions cumulées</span></article>
                </div>
                <div class="adhkar-pro-progress-layout">
                    <article class="adhkar-pro-week-card">
                        <div class="adhkar-pro-section-head"><div><span>Sept derniers jours</span><h2>Régularité</h2></div></div>
                        <div class="adhkar-pro-bars"><div v-for="day in weeklyData" :key="day.key"><span>{{ day.total }}</span><i><b :style="{height:Math.max(5,(day.total/maxWeekly)*100)+'%'}"></b></i><small>{{ day.label }}</small></div></div>
                    </article>
                    <article class="adhkar-pro-history-card">
                        <div class="adhkar-pro-section-head"><div><span>Journal local</span><h2>Dernières pratiques</h2></div></div>
                        <div class="adhkar-pro-history-list">
                            <div v-for="entry in state.history.slice(0,12)" :key="entry.id"><i data-lucide="check"></i><div><b>{{ entry.title }}</b><span>{{ entry.category }} · {{ entry.repetitions }} répétition<span v-if="entry.repetitions>1">s</span></span></div><time>{{ formatDate(entry.at) }}</time></div>
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
                        <button @click="closeItem" aria-label="Fermer"><i data-lucide="x"></i></button>
                        <div><span>{{ activeRoutine ? activeRoutine.title+' · '+currentRoutinePosition : selected.category }}</span><h2>{{ selected.title }}</h2></div>
                        <button @click="toggleFavorite(selected)" aria-label="Favori"><i data-lucide="heart" :class="{filled:isFavorite(selected.id)}"></i></button>
                    </header>
                    <div class="adhkar-pro-reader-scroll">
                        <section class="adhkar-pro-arabic-block"><p dir="rtl" lang="ar">{{ selected.arabic }}</p><button @click="copyItem(selected)"><i data-lucide="copy"></i> Copier</button></section>
                        <section class="adhkar-pro-reading-grid">
                            <article><span>Translittération</span><p class="phonetic">{{ selected.phonetic || 'Non renseignée.' }}</p></article>
                            <article><span>Sens en français</span><p>{{ selected.translation }}</p></article>
                            <article><span>Contexte d’usage</span><p>{{ selected.context || 'Consulter la source complète pour le contexte détaillé.' }}</p></article>
                            <article><span>Référence indiquée</span><p>{{ selected.source || 'Source non précisée dans la fiche.' }}</p></article>
                        </section>
                        <section class="adhkar-pro-counter-zone">
                            <div class="adhkar-pro-reader-progress"><i :style="{width:progress(selected)+'%'}"></i></div>
                            <button class="adhkar-pro-counter" @click="increment(selected)" :class="{complete:isComplete(selected)}">
                                <template v-if="isComplete(selected)"><i data-lucide="check"></i><b>Terminé</b><span>{{ selected.count }} / {{ selected.count }}</span></template>
                                <template v-else><b>{{ state.counts[selected.id] || 0 }}</b><span>sur {{ selected.count }}</span><small>Cliquer, Espace ou Entrée</small></template>
                            </button>
                            <div class="adhkar-pro-counter-actions"><button @click="decrement(selected)" :disabled="!(state.counts[selected.id]>0)"><i data-lucide="undo-2"></i> Annuler</button><button @click="resetItem(selected)"><i data-lucide="rotate-ccw"></i> Recommencer</button></div>
                        </section>
                    </div>
                    <footer v-if="activeRoutine"><button @click="previousRoutine" :disabled="routineIndex===0"><i data-lucide="arrow-left"></i> Précédent</button><span>{{ currentRoutinePosition }}</span><button @click="nextRoutine">{{ routineIndex===activeRoutine.items.length-1?'Terminer':'Suivant' }} <i data-lucide="arrow-right"></i></button></footer>
                </article>
            </div>
        </transition>
    </section>`
};