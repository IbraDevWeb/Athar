const HadithsView = {
    components: { 'sharh-study-view': SharhStudyView },
    props: ['hadiths', 'searchQuery', 'openHadith'],
    setup(props) {
        const STORAGE_KEY = 'athar_hadith_v2';
        const query = Vue.ref('');
        const themeFilter = Vue.ref('Tous');
        const collectionFilter = Vue.ref('Toutes');
        const gradeFilter = Vue.ref('Tous');
        const favoritesOnly = Vue.ref(false);
        const unreadOnly = Vue.ref(false);
        const sortMode = Vue.ref('original');
        const showFilters = Vue.ref(false);
        const visibleLimit = Vue.ref(18);
        const section = Vue.ref('library');
        const books = ATHAR_KUTUB_SITTA.collections;
        const selectedBookId = Vue.ref(null);
        const sharhOpen = Vue.ref(false);
        const sharhCourse = typeof ATHAR_SHARH_ABU_DAWUD !== 'undefined' ? ATHAR_SHARH_ABU_DAWUD : null;
        const bookPayload = Vue.ref(null);
        const bookLoading = Vue.ref(false);
        const bookError = Vue.ref('');
        const bookQuery = Vue.ref('');
        const bookChapter = Vue.ref('all');
        const bookVisibleLimit = Vue.ref(12);
        const bookFavoritesOnly = Vue.ref(false);
        const selectedBook = Vue.computed(() => books.find(book => book.id === selectedBookId.value) || null);
        const bookChapters = Vue.computed(() => bookPayload.value?.chapters || []);
        const bookHadiths = Vue.computed(() => bookPayload.value?.hadiths || []);
        const bookExcerpt = value => {
            const text = String(value || '').replace(/\s+/g, ' ').trim();
            if (text.length <= 205) return text;
            const cut = text.slice(0,206);
            return cut.slice(0,Math.max(100,cut.lastIndexOf(' '))).trimEnd() + '…';
        };
        const bookName = entry => bookChapters.value.find(c=>c.id===entry.chapterId)?.titleFr || 'Livre';
        const RETURN_BOOK_KEY = 'athar_kutub_return_book';
        const filteredBookHadiths = Vue.computed(() => {
            const terms = normalize(bookQuery.value).split(/\s+/).filter(Boolean);
            return bookHadiths.value.filter(h => {
                const searchText = normalize([h.title,h.readingTitle,h.hadeeth,h.hadeeth_ar,h.id,h.attribution,h.number].join(' '));
                return (bookChapter.value === 'all' || h.chapterId === bookChapter.value)
                    && (!bookFavoritesOnly.value || state.favorites.includes(String(h.id)))
                    && terms.every(term => searchText.includes(term));
            });
        });
        const visibleBookHadiths = Vue.computed(() => filteredBookHadiths.value.slice(0, bookVisibleLimit.value));
        const bookCounts = Vue.computed(() => {
            const counts=new Map();
            for (const entry of bookHadiths.value) counts.set(entry.chapterId,(counts.get(entry.chapterId)||0)+1);
            return counts;
        });
        const bookFavoriteCount = Vue.computed(() => bookHadiths.value.filter(entry => state.favorites.includes(String(entry.id))).length);
        const isBookFavorite = entry => state.favorites.includes(String(entry.id));
        const toggleBookFavorite = (entry,event) => {
            event?.preventDefault();event?.stopPropagation();
            if(!entry) return;
            const id=String(entry.id);
            state.favorites=isBookFavorite(entry) ? state.favorites.filter(x=>x!==id) : [...state.favorites,id];
            save();refreshIcons();
        };
        const bookLead = entry => {
            const text=String(entry?.hadeeth||'').replace(/\s+/g,' ').trim();
            // L'aperçu, et jamais le texte intégral, peut omettre « Rapporté par … : ».
            const match=/^Rapporté par [^:]{2,125}:\s*/i.exec(text);
            return bookExcerpt(match?text.slice(match[0].length):text,205);
        };
        let bookRequestId = 0;
        const state = Vue.reactive({ favorites: [], read: {}, recent: [], notes: {} });

        // Classification de navigation indicative : elle ne remplace pas l'index des recueils.
        const themeRules = [
            { label: 'Foi & intention', keywords: ['foi', 'croire', 'allah', 'intention', 'sincérité', 'unicité', 'islam'] },
            { label: 'Adoration', keywords: ['prière', 'jeûne', 'aumône', 'hajj', 'invocation', 'dhikr', 'ablution', 'mosquée'] },
            { label: 'Cœur & spiritualité', keywords: ['cœur', 'repentir', 'pardon', 'miséricorde', 'patience', 'espoir', 'âme', 'piété'] },
            { label: 'Éthique & caractère', keywords: ['caractère', 'douceur', 'colère', 'vérité', 'modestie', 'générosité', 'bienveillance', 'orgueil'] },
            { label: 'Relations & famille', keywords: ['frère', 'parents', 'famille', 'épouse', 'voisin', 'amour', 'fraternité', 'enfant'] },
            { label: 'Savoir', keywords: ['science', 'savoir', 'enseigner', 'apprendre', 'transmettre', 'savants', 'connaissance', 'coran'] },
            { label: 'Justice & société', keywords: ['justice', 'juge', 'responsabilité', 'communauté', 'autorité', 'injustice', 'droit', 'commerce', 'argent', 'dette'] },
            { label: 'Épreuves & au-delà', keywords: ['mort', 'résurrection', 'paradis', 'enfer', 'épreuve', 'maladie', 'tombe', 'jugement'] }
        ];
        const clean = value => String(value || '').replace(/\r/g, '').replace(/\n{3,}/g, '\n\n').trim();
        const normalize = value => clean(value).toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ');
        const uidOf = item => String(item?.id || item?.title || 'hadith');
        const collectionOf = item => {
            const text = normalize(String(item.id || '') + ' ' + String(item.attribution || ''));
            const names = [];
            if (/bukhari|bukhari|boukhari/.test(text)) names.push('Al-Bukhârî');
            if (/muslim/.test(text)) names.push('Muslim');
            if (/abu daw|abu daw|abi daw/.test(text)) names.push('Abou Dâwoud');
            if (/tirmidhi|tirmidi/.test(text)) names.push('At-Tirmidhî');
            if (/nasa/.test(text)) names.push('An-Nasâ’î');
            if (/ibn majah/.test(text)) names.push('Ibn Mâjah');
            if (/ahmad/.test(text)) names.push('Ahmad');
            return names.length > 1 ? 'Recueils multiples' : (names[0] || 'Autre recueil');
        };
        const themeOf = item => {
            const searchable = normalize([item.title, item.hadeeth, item.explanation, ...(item.hints || [])].join(' '));
            let best = null, bestScore = 0;
            for (const rule of themeRules) {
                const score = rule.keywords.reduce((n, word) => n + Number(searchable.includes(normalize(word))), 0);
                if (score > bestScore) { best = rule.label; bestScore = score; }
            }
            return best || 'Autres enseignements';
        };
        const load = () => {
            try {
                const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
                state.favorites = Array.isArray(stored.favorites) ? stored.favorites : [];
                state.read = stored.read && typeof stored.read === 'object' ? stored.read : {};
                state.recent = Array.isArray(stored.recent) ? stored.recent : [];
                state.notes = stored.notes && typeof stored.notes === 'object' ? stored.notes : {};
            } catch (_) {}
        };
        const save = () => {
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify({
                favorites: state.favorites, read: state.read, recent: state.recent, notes: state.notes
            })); } catch (_) {}
        };
        const enriched = Vue.computed(() => (props.hadiths || []).map((raw, index) => ({
            raw, index, uid: uidOf(raw), topic: themeOf(raw),
            collection: collectionOf(raw), grade: clean(raw.grade) || 'Non indiqué',
            favorite: state.favorites.includes(uidOf(raw)), read: Boolean(state.read[uidOf(raw)])
        })));
        const themes = Vue.computed(() => {
            const counter = new Map();
            for (const item of enriched.value) counter.set(item.topic, (counter.get(item.topic) || 0) + 1);
            return [...counter.entries()].map(([label, count]) => ({ label, count }))
                .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'fr'));
        });
        const collections = Vue.computed(() => [...new Set(enriched.value.map(item => item.collection))].sort((a,b) => a.localeCompare(b,'fr')));
        const grades = Vue.computed(() => [...new Set(enriched.value.map(item => item.grade))].sort((a,b) => a.localeCompare(b,'fr')));
        const filtered = Vue.computed(() => {
            const terms = normalize([props.searchQuery, query.value].filter(Boolean).join(' ')).split(/\s+/).filter(Boolean);
            const items = enriched.value.filter(item => {
                const raw = item.raw;
                const haystack = normalize([raw.id, raw.title, raw.hadeeth, raw.hadeeth_ar, raw.hadeeth_intro,
                    raw.explanation, raw.attribution, item.topic, item.collection, ...(raw.hints || [])].join(' '));
                return terms.every(term => haystack.includes(term))
                    && (themeFilter.value === 'Tous' || item.topic === themeFilter.value)
                    && (collectionFilter.value === 'Toutes' || item.collection === collectionFilter.value)
                    && (gradeFilter.value === 'Tous' || item.grade === gradeFilter.value)
                    && (!favoritesOnly.value || item.favorite)
                    && (!unreadOnly.value || !item.read);
            });
            if (sortMode.value === 'alpha') items.sort((a,b) => a.raw.title.localeCompare(b.raw.title,'fr'));
            if (sortMode.value === 'collection') items.sort((a,b) => a.collection.localeCompare(b.collection,'fr') || a.index-b.index);
            if (sortMode.value === 'unread') items.sort((a,b) => Number(a.read)-Number(b.read) || a.index-b.index);
            return items;
        });
        const visibleItems = Vue.computed(() => filtered.value.slice(0, visibleLimit.value));
        const activeFilters = Vue.computed(() => Boolean(query.value.trim() || props.searchQuery || themeFilter.value !== 'Tous' ||
            collectionFilter.value !== 'Toutes' || gradeFilter.value !== 'Tous' || favoritesOnly.value || unreadOnly.value));
        const stats = Vue.computed(() => ({
            total: enriched.value.length,
            read: enriched.value.filter(item => item.read).length,
            favorites: enriched.value.filter(item => item.favorite).length
        }));
        const recentItem = Vue.computed(() => state.recent.map(id => enriched.value.find(x => x.uid === id)).find(Boolean) || null);
        const resetFilters = () => {
            query.value = ''; themeFilter.value = 'Tous'; collectionFilter.value = 'Toutes';
            gradeFilter.value = 'Tous'; favoritesOnly.value = false; unreadOnly.value = false;
            sortMode.value = 'original';
        };
        const chooseTheme = label => { themeFilter.value = themeFilter.value === label ? 'Tous' : label; };
        const toggleFavorite = (item, event) => {
            event?.preventDefault(); event?.stopPropagation();
            state.favorites = item.favorite ? state.favorites.filter(x => x !== item.uid) : [...state.favorites, item.uid];
            save();
        };
        const open = item => {
            state.read[item.uid] = new Date().toISOString();
            state.recent = [item.uid, ...state.recent.filter(x => x !== item.uid)].slice(0, 30);
            save();
            props.openHadith(item.raw);
        };
        const random = () => {
            const items = filtered.value.length ? filtered.value : enriched.value;
            if (items.length) open(items[Math.floor(Math.random() * items.length)]);
        };
        const selectSection = name => {
            if (name !== 'library' && name !== 'kutub') return;
            section.value = name;
            if (name !== 'kutub') {
                bookRequestId += 1;
                selectedBookId.value = null;
                bookPayload.value = null;
                bookError.value = '';
            }
            refreshIcons();
        };
        const openBook = async book => {
            if (!book || !books.some(item => item.id === book.id)) return;
            const requestId = ++bookRequestId;
            section.value = 'kutub';
            selectedBookId.value = book.id;
            bookPayload.value = null;
            bookError.value = '';
            bookLoading.value = true;
            bookQuery.value = '';
            bookChapter.value = 'all';
            bookVisibleLimit.value = ['bukhari','muslim','abu-dawud'].includes(book.id) ? 12 : 18;
            bookFavoritesOnly.value = false;
            refreshIcons();
            try {
                const response = await fetch(book.dataPath);
                if (!response.ok) throw new Error('HTTP ' + response.status);
                const data = await response.json();
                if (data.schemaVersion !== 1 || data.collectionId !== book.id
                    || !Array.isArray(data.chapters) || !Array.isArray(data.hadiths)
                    || !Array.isArray(data.sourceRecords)) throw new Error('Données du recueil non conformes');
                if (['bukhari','muslim','abu-dawud'].includes(book.id) && (
                    data.hadiths.length !== 50 ||
                    data.hadiths.some((entry,index)=>entry.number!==index+1 || !entry.hadeeth_ar || !entry.hadeeth)
                )) throw new Error('Import des 50 premiers textes incomplet ou non trié');
                if (requestId === bookRequestId) bookPayload.value = data;
            } catch (error) {
                if (requestId === bookRequestId) bookError.value = 'Ce recueil ne peut pas être chargé. Réessaie.';
                console.warn('Chargement Kutub as-Sitta :', error);
            } finally {
                if (requestId === bookRequestId) {
                    bookLoading.value = false;
                    refreshIcons();
                }
            }
        };
        const openSharh = () => {
            if (selectedBook.value?.id !== 'abu-dawud' || !sharhCourse) return;
            sharhOpen.value = true;
            refreshIcons();
        };
        const closeSharh = () => { sharhOpen.value = false; refreshIcons(); };
        const closeBook = () => {
            sharhOpen.value = false;
            bookRequestId += 1;
            selectedBookId.value = null;
            bookPayload.value = null;
            bookError.value = '';
            bookLoading.value = false;
            refreshIcons();
        };
        const openBookHadith = hadith => {
            if (!hadith || !selectedBook.value) return;
            try { sessionStorage.setItem(RETURN_BOOK_KEY, selectedBook.value.id); } catch (_) {}
            props.openHadith(hadith);
        };
        const refreshIcons = () => Vue.nextTick(() => window.lucide?.createIcons());
        Vue.onMounted(() => {
            load(); refreshIcons();
            // Retour exact au recueil après lecture ; ne pas renvoyer aux 50 hadiths thématiques.
            let returning = null;
            try {
                returning = sessionStorage.getItem(RETURN_BOOK_KEY);
                sessionStorage.removeItem(RETURN_BOOK_KEY);
            } catch (_) {}
            const savedBook = books.find(book => book.id === returning);
            if (savedBook) openBook(savedBook);
        });
        Vue.watch([query, themeFilter, collectionFilter, gradeFilter, favoritesOnly, unreadOnly, sortMode], () => { visibleLimit.value = 18; refreshIcons(); });
        Vue.watch(visibleLimit, refreshIcons);
        Vue.watch([section, bookQuery, bookChapter, selectedBookId], () => {
            bookVisibleLimit.value = ['bukhari','muslim','abu-dawud'].includes(selectedBookId.value) ? 12 : 18;
            refreshIcons();
        });
        Vue.watch(bookFavoritesOnly, () => {
            bookVisibleLimit.value = 12;
            refreshIcons();
        });
        Vue.watch(bookVisibleLimit, refreshIcons);
        return {
            query, themeFilter, collectionFilter, gradeFilter, favoritesOnly, unreadOnly,
            sortMode, showFilters, visibleLimit, visibleItems, filtered, themes, collections, grades, stats,
            recentItem, activeFilters, resetFilters, chooseTheme, toggleFavorite, open, random, clean,
            section, books, selectedBook, selectedBookId, selectSection, openBook, closeBook,
            sharhOpen, sharhCourse, openSharh, closeSharh,
            bookPayload, bookLoading, bookError, bookQuery, bookChapter, bookChapters, bookHadiths,
            filteredBookHadiths, visibleBookHadiths, bookVisibleLimit, openBookHadith, bookExcerpt, bookName, bookLead,
            bookCounts, bookFavoriteCount, bookFavoritesOnly, isBookFavorite, toggleBookFavorite
        };
    },
    template: `
    <section class="hadith-pro-root">
        <sharh-study-view v-if="sharhOpen" :course="sharhCourse" :close-study="closeSharh"></sharh-study-view>
        <div v-else class="hadith-pro-container">
            <header v-if="!['bukhari','muslim','abu-dawud'].includes(selectedBook?.id)" class="hadith-pro-heading">
                <div>
                    <span class="hadith-pro-eyebrow"><i data-lucide="scroll-text" aria-hidden="true"></i> Bibliothèque des transmissions</span>
                    <h1>Les hadiths</h1>
                    <p>Une parole à découvrir, un enseignement à approfondir.</p>
                </div>
            </header>

            <nav v-if="!['bukhari','muslim','abu-dawud'].includes(selectedBook?.id)" class="hadith-kutub-tabs" aria-label="Bibliothèques de hadiths">
                <button type="button" :class="{active:section==='library'}" :aria-pressed="section==='library'" @click="selectSection('library')">
                    <i data-lucide="book-open" aria-hidden="true"></i> Hadiths disponibles
                    <span>{{ stats.total }}</span>
                </button>
                <button type="button" :class="{active:section==='kutub'}" :aria-pressed="section==='kutub'" @click="selectSection('kutub')">
                    <i data-lucide="library" aria-hidden="true"></i> Kutub as-Sitta
                    <span>6 recueils</span>
                </button>
            </nav>

            <div v-if="section==='library'" class="hadith-kutub-existing-library">
                <div class="hadith-pro-search-area">
                <label class="hadith-pro-search">
                    <i data-lucide="search" aria-hidden="true"></i>
                    <span class="sr-only">Rechercher un hadith</span>
                    <input v-model="query" type="search" autocomplete="off" placeholder="Rechercher un hadith…" aria-label="Rechercher un hadith">
                    <button v-if="query" type="button" @click.prevent="query=''" aria-label="Effacer la recherche"><i data-lucide="x"></i></button>
                </label>
                <div class="hadith-pro-search-actions">
                    <button type="button" :class="{active:favoritesOnly}" :aria-pressed="favoritesOnly" @click="favoritesOnly=!favoritesOnly">
                        <i data-lucide="heart" aria-hidden="true"></i><span>Favoris</span><small>{{ stats.favorites }}</small>
                    </button>
                    <button type="button" :class="{active:unreadOnly}" :aria-pressed="unreadOnly" @click="unreadOnly=!unreadOnly">
                        <i data-lucide="book-open" aria-hidden="true"></i><span>À découvrir</span>
                    </button>
                    <button type="button" @click="random" aria-label="Ouvrir un hadith au hasard" title="Découvrir un hadith">
                        <i data-lucide="shuffle" aria-hidden="true"></i><span>Au hasard</span>
                    </button>
                </div>
            </div>

            <div class="hadith-pro-topic-row" role="group" aria-label="Filtrer par thème">
                <button type="button" :class="{active:themeFilter==='Tous'}" :aria-pressed="themeFilter==='Tous'" @click="chooseTheme('Tous')">Tous <span>{{ stats.total }}</span></button>
                <button v-for="topic in themes" :key="topic.label" type="button" :class="{active:themeFilter===topic.label}" :aria-pressed="themeFilter===topic.label" @click="chooseTheme(topic.label)">
                    {{ topic.label }} <span>{{ topic.count }}</span>
                </button>
            </div>

            <div class="hadith-pro-tools">
                <div class="hadith-pro-result-count" aria-live="polite">
                    <strong>{{ filtered.length }}</strong> résultat{{ filtered.length>1?'s':'' }}
                    <span v-if="stats.read">· {{ stats.read }} déjà consulté{{ stats.read>1?'s':'' }}</span>
                </div>
                <div class="hadith-pro-tool-buttons">
                    <label class="hadith-pro-sort"><span>Trier</span>
                        <select v-model="sortMode" aria-label="Trier les hadiths">
                            <option value="original">Ordre du corpus</option>
                            <option value="alpha">Titre A–Z</option>
                            <option value="collection">Par recueil</option>
                            <option value="unread">Non lus d'abord</option>
                        </select>
                    </label>
                    <button type="button" class="hadith-pro-filter-button" :class="{active:showFilters}" :aria-expanded="showFilters" @click="showFilters=!showFilters">
                        <i data-lucide="sliders-horizontal" aria-hidden="true"></i> Filtres
                    </button>
                    <button v-if="activeFilters" type="button" class="hadith-pro-reset" @click="resetFilters">Réinitialiser</button>
                </div>
            </div>

            <div v-if="showFilters" class="hadith-pro-advanced">
                <label>Recueil
                    <select v-model="collectionFilter" aria-label="Filtrer par recueil">
                        <option>Toutes</option><option v-for="collection in collections" :key="collection">{{ collection }}</option>
                    </select>
                </label>
                <label>Degré indiqué
                    <select v-model="gradeFilter" aria-label="Filtrer par degré">
                        <option>Tous</option><option v-for="grade in grades" :key="grade">{{ grade }}</option>
                    </select>
                </label>
                <p>Les thèmes sont des regroupements de navigation proposés par Athar, non les chapitres des recueils d'origine.</p>
            </div>

            <div v-if="visibleItems.length" class="hadith-pro-grid">
                <article v-for="item in visibleItems" :key="item.uid" class="hadith-pro-card" :class="{read:item.read}"
                    role="button" tabindex="0" :aria-label="'Lire le hadith : '+item.raw.title"
                    @click="open(item)" @keydown.enter.self.prevent="open(item)" @keydown.space.self.prevent="open(item)">
                    <div class="hadith-pro-card-top">
                        <span class="hadith-pro-card-symbol" aria-hidden="true"><i data-lucide="scroll-text"></i></span>
                        <span class="hadith-pro-card-actions">
                            <span class="hadith-pro-card-topic">{{ item.topic }}</span>
                            <button type="button" class="hadith-pro-favorite" :class="{active:item.favorite}"
                                :aria-label="item.favorite?'Retirer des favoris':'Ajouter aux favoris'" :aria-pressed="item.favorite"
                                @click.stop="toggleFavorite(item,$event)" @keydown.stop>
                                <i data-lucide="heart" aria-hidden="true"></i>
                            </button>
                        </span>
                    </div>
                    <h2>{{ item.raw.title }}</h2>
                    <p class="hadith-pro-card-excerpt">{{ clean(item.raw.hadeeth) }}</p>
                    <footer>
                        <span class="hadith-pro-card-reference">{{ item.collection }} <span class="hadith-pro-card-separator">·</span> {{ item.raw.id }}</span>
                        <span class="hadith-pro-card-open">{{ item.read?'Relire':'Lire' }} <i data-lucide="arrow-right" aria-hidden="true"></i></span>
                    </footer>
                </article>
            </div>
            <div v-else class="hadith-pro-empty">
                <i data-lucide="search-x" aria-hidden="true"></i>
                <h2>Aucun hadith trouvé</h2>
                <p>Essaie une autre recherche ou enlève certains filtres.</p>
                <button type="button" @click="resetFilters">Afficher tous les hadiths</button>
            </div>

            <div v-if="filtered.length>visibleLimit" class="hadith-pro-more">
                <p>{{ visibleItems.length }} sur {{ filtered.length }} hadiths</p>
                <button type="button" @click="visibleLimit+=18">Voir plus de hadiths <i data-lucide="chevron-down" aria-hidden="true"></i></button>
            </div>

            <div v-if="recentItem && !activeFilters" class="hadith-pro-resume">
                <span>Dernière lecture</span>
                <button type="button" @click="open(recentItem)"><span>{{ recentItem.raw.title }}</span><i data-lucide="arrow-right" aria-hidden="true"></i></button>
            </div>
            </div>

            <section v-else class="hadith-kutub-section">
                <template v-if="!selectedBook">
                    <div class="hadith-kutub-section-head">
                        <div>
                            <span class="hadith-pro-eyebrow">Les six recueils classiques</span>
                            <h2>Kutub as-Sitta <span lang="ar" dir="rtl">الكتب الستة</span></h2>
                            <p>Chaque recueil dispose désormais de son propre espace. Les textes seront ajoutés progressivement, avec leurs références.</p>
                        </div>
                    </div>
                    <div class="hadith-kutub-grid">
                        <button v-for="(book,index) in books" :key="book.id" type="button"
                            class="hadith-kutub-book" :aria-label="'Ouvrir le recueil '+book.name" @click="openBook(book)">
                            <span class="hadith-kutub-book-index">{{ String(index+1).padStart(2,'0') }}</span>
                            <span class="hadith-kutub-book-mark" aria-hidden="true"><i data-lucide="book-open"></i></span>
                            <span class="hadith-kutub-book-ar" lang="ar" dir="rtl">{{ book.arabicName }}</span>
                            <strong>{{ book.name }}</strong>
                            <small>{{ book.compiler }}</small>
                            <span class="hadith-kutub-book-bottom">{{ book.importedCount ? book.importedCount+' hadiths disponibles' : 'En préparation' }} <i data-lucide="arrow-right" aria-hidden="true"></i></span>
                        </button>
                    </div>
                    <p class="hadith-kutub-footnote">Les recueils seront complétés progressivement. Les {{ stats.total }} hadiths déjà disponibles restent dans la bibliothèque actuelle.</p>
                </template>

                <section v-else class="hadith-kutub-book-view" :class="{'bukhari-book-view':['bukhari','muslim','abu-dawud'].includes(selectedBook.id)}" :aria-label="'Recueil '+selectedBook.name">
                    <button type="button" class="hadith-kutub-back" @click="closeBook">
                        <i data-lucide="arrow-left" aria-hidden="true"></i> Tous les recueils
                    </button>
                    <header v-if="!['bukhari','muslim','abu-dawud'].includes(selectedBook.id)" class="hadith-kutub-book-head">
                        <div>
                            <span class="hadith-pro-eyebrow">{{ selectedBook.type }} · {{ selectedBook.compiler }}</span>
                            <h2>{{ selectedBook.name }}</h2>
                            <p>{{ selectedBook.description }}</p>
                        </div>
                        <p class="hadith-kutub-book-head-ar" lang="ar" dir="rtl">{{ selectedBook.arabicName }}</p>
                    </header>
                    <header v-else class="bukhari-showcase-hero">
                        <span class="bukhari-showcase-kicker"><i data-lucide="book-open-check" aria-hidden="true"></i> Aux sources des transmissions</span>
                        <span class="bukhari-showcase-arabic" lang="ar" dir="rtl">{{ selectedBook.arabicName }}</span>
                        <h2 v-if="selectedBook.id==='abu-dawud'">Sunan <em>Abî Dâwûd</em></h2>
                        <h2 v-else>Sahîh <em>{{ selectedBook.id==='muslim' ? 'Muslim' : 'al-Bukhârî' }}</em></h2>
                        <p v-if="selectedBook.id==='muslim'">Les 50 premières références de Sahîh Muslim : 1 à 7 dans l’Introduction, puis 8 à 50 dans le Livre de la foi. Une première variante par numéro, en arabe et en français. L’Introduction inclut aussi des propos de transmetteurs.</p>
                        <p v-else-if="selectedBook.id==='abu-dawud'">Les 50 premières références de Sunan Abî Dâwûd, toutes dans le Livre de la purification. Textes arabes, version française et appréciations attribuées à leurs auteurs : certaines chaînes sont jugées faibles et les avis peuvent diverger.</p>
                        <p v-else>Les cinquante premiers hadiths, du commencement de la Révélation aux premières questions sur la foi. Découvrez leurs textes complets en arabe et en français.</p>
                        <div class="bukhari-showcase-meta">
                            <span><strong>50</strong> hadiths</span><span aria-hidden="true">·</span>
                            <span><strong>{{ bookPayload?.chapters?.length || 1 }}</strong> {{ selectedBook.id==='muslim'?'sections':'livres' }}</span><span aria-hidden="true">·</span>
                            <span>Lecture bilingue</span>
                        </div>
                    </header>

                    <div v-if="selectedBook.id==='abu-dawud' && sharhCourse" class="hadith-sharh-bridge">
                        <div><span>Parcours d’étude</span><h3>Étudier le Sharh</h3><p>Un lecteur vidéo, des notes et une progression, inspirés du parcours Usûl al-Fiqh.</p></div>
                        <button type="button" @click="openSharh">Ouvrir le parcours <i data-lucide="arrow-right" aria-hidden="true"></i></button>
                    </div>
                    <div v-if="bookLoading" class="hadith-kutub-empty" role="status">
                        <i data-lucide="loader-circle" aria-hidden="true"></i>
                        <p>Ouverture du recueil…</p>
                    </div>
                    <div v-else-if="bookError" class="hadith-kutub-empty" role="alert">
                        <i data-lucide="alert-circle" aria-hidden="true"></i>
                        <p>{{ bookError }}</p>
                        <button type="button" @click="openBook(selectedBook)">Réessayer</button>
                    </div>
                    <template v-else-if="bookPayload">
                        <div v-if="['bukhari','muslim','abu-dawud'].includes(selectedBook.id) && bookHadiths.length" class="bukhari-catalog">
                            <nav class="bukhari-book-switch" :aria-label="'Explorer les sections de '+selectedBook.name">
                                <button type="button" :aria-pressed="bookChapter==='all'" :class="{active:bookChapter==='all'}"
                                    @click="bookChapter='all'">Tous les hadiths <small>{{ bookHadiths.length }}</small></button>
                                <button v-for="chapter in bookChapters" :key="chapter.id" type="button"
                                    :class="{active:bookChapter===chapter.id}" :aria-pressed="bookChapter===chapter.id"
                                    @click="bookChapter=chapter.id">
                                    {{ chapter.titleFr }} <small>{{ bookCounts.get(chapter.id)||0 }}</small>
                                </button>
                            </nav>
                            <div class="bukhari-catalog-tools">
                                <label class="bukhari-catalog-search">
                                    <i data-lucide="search" aria-hidden="true"></i>
                                    <input v-model="bookQuery" type="search" :aria-label="'Rechercher dans '+selectedBook.name"
                                        placeholder="Numéro, mot ou passage…" autocomplete="off">
                                    <button v-if="bookQuery" type="button" @click.prevent="bookQuery=''" aria-label="Effacer la recherche">
                                        <i data-lucide="x" aria-hidden="true"></i>
                                    </button>
                                </label>
                                <button type="button" class="bukhari-catalog-favorites" :class="{active:bookFavoritesOnly}"
                                    :aria-pressed="bookFavoritesOnly" @click="bookFavoritesOnly=!bookFavoritesOnly">
                                    <i data-lucide="heart" aria-hidden="true"></i> Favoris <small>{{ bookFavoriteCount }}</small>
                                </button>
                            </div>
                            <div class="bukhari-catalog-heading">
                                <div><span>Parcourir les textes</span>
                                    <h3>{{ bookChapter==='all' ? 'Les premières transmissions' : bookChapters.find(c=>c.id===bookChapter)?.titleFr }}</h3>
                                </div>
                                <p aria-live="polite">{{ filteredBookHadiths.length }} hadith{{ filteredBookHadiths.length>1?'s':'' }}</p>
                            </div>
                            <div v-if="visibleBookHadiths.length" class="bukhari-card-grid">
                                <article v-for="entry in visibleBookHadiths" :key="entry.id" class="bukhari-card">
                                    <button type="button" class="bukhari-card-link" @click="openBookHadith(entry)"
                                        :aria-label="'Lire '+selectedBook.name+', narration n° '+entry.number+', '+(entry.readingTitle||entry.title)">
                                        <span class="bukhari-card-decor" aria-hidden="true"></span>
                                        <span class="bukhari-card-top">
                                            <span class="bukhari-card-icon" aria-hidden="true"><i :data-lucide="entry.readingIcon||'book-open'"></i></span>
                                            <span class="bukhari-card-number">N° {{ entry.number }}</span>
                                        </span>
                                        <span class="bukhari-card-category">{{ bookName(entry) }}</span>
                                        <strong class="bukhari-card-title">{{ entry.readingTitle||entry.title }}</strong>
                                        <span class="bukhari-card-excerpt">{{ bookLead(entry) }}</span>
                                        <span class="bukhari-card-foot">
                                            <span>{{ selectedBook.id==='muslim'?'Narration':'Hadith' }} {{ entry.number }} <i data-lucide="dot" aria-hidden="true"></i> {{ selectedBook.id==='muslim'?(entry.bookNumber===0?'Introduction':'Livre de la foi'):'Livre '+entry.bookNumber }}</span>
                                            <b>Lire le texte <i data-lucide="arrow-right" aria-hidden="true"></i></b>
                                        </span>
                                    </button>
                                    <button type="button" class="bukhari-card-favorite" :aria-pressed="isBookFavorite(entry)"
                                        :aria-label="isBookFavorite(entry)?'Retirer le hadith '+entry.number+' des favoris':'Ajouter le hadith '+entry.number+' aux favoris'"
                                        @click="toggleBookFavorite(entry,$event)">
                                        <i data-lucide="heart" aria-hidden="true"></i>
                                    </button>
                                </article>
                            </div>
                            <div v-else class="bukhari-catalog-empty" role="status">
                                <i data-lucide="search-x" aria-hidden="true"></i>
                                <h3>Aucun hadith trouvé</h3><p>Essaie un autre numéro ou enlève le filtre des favoris.</p>
                                <button type="button" @click="bookQuery='';bookChapter='all';bookFavoritesOnly=false">Tout afficher</button>
                            </div>
                            <div v-if="filteredBookHadiths.length>bookVisibleLimit" class="bukhari-catalog-more">
                                <span>{{ visibleBookHadiths.length }} hadiths sur {{ filteredBookHadiths.length }}</span>
                                <button type="button" @click="bookVisibleLimit+=12">
                                    Afficher plus de hadiths <i data-lucide="chevron-down" aria-hidden="true"></i>
                                </button>
                            </div>
                            <p class="bukhari-catalog-note">Les intitulés de ces cartes sont des repères éditoriaux, distincts des textes transmis. Dans l’Introduction de Muslim, certaines narrations sont des propos de transmetteurs, pas des paroles attribuées au Prophète. Dans les Sunan d’Abî Dâwûd, les appréciations peuvent différer selon les spécialistes ; elles sont attribuées dans la fiche.</p>
                        </div>
                        <template v-else>
                        <div class="hadith-kutub-book-counts" aria-label="Contenu importé">
                            <span><strong>{{ bookChapters.length }}</strong> livre{{ bookChapters.length>1?'s':'' }}</span>
                            <span><strong>{{ bookHadiths.length }}</strong> hadith{{ bookHadiths.length>1?'s':'' }} importé{{ bookHadiths.length>1?'s':'' }}</span>
                        </div>
                        <div v-if="bookHadiths.length" class="hadith-kutub-imported">
                            <div class="hadith-kutub-imported-controls">
                                <label class="hadith-pro-search"><i data-lucide="search" aria-hidden="true"></i>
                                    <input v-model="bookQuery" type="search" :aria-label="'Rechercher dans '+selectedBook.name"
                                        placeholder="Rechercher dans ce recueil…">
                                </label>
                                <select v-model="bookChapter" aria-label="Choisir un livre">
                                    <option value="all">Tous les livres</option>
                                    <option v-for="chapter in bookChapters" :key="chapter.id" :value="chapter.id">{{ chapter.titleFr || chapter.titleAr || chapter.id }}</option>
                                </select>
                            </div>
                            <p class="hadith-kutub-result" aria-live="polite">{{ filteredBookHadiths.length }} résultat{{ filteredBookHadiths.length>1?'s':'' }} · classés par numéro croissant</p>
                            <div v-if="visibleBookHadiths.length" class="hadith-kutub-hadith-grid">
                                <button v-for="entry in visibleBookHadiths" :key="entry.id" type="button"
                                    class="hadith-kutub-hadith" @click="openBookHadith(entry)">
                                    <span class="hadith-kutub-list-number">N° {{ entry.number }}</span>
                                    <span class="hadith-kutub-list-content">
                                        <strong>{{ entry.title }}</strong>
                                        <span class="hadith-kutub-list-excerpt">{{ bookExcerpt(entry.hadeeth) }}</span>
                                        <small>{{ bookName(entry) }} · Livre {{ entry.bookNumber }}, hadith {{ entry.inBookNumber }}</small>
                                    </span>
                                    <i data-lucide="arrow-right" aria-hidden="true"></i>
                                </button>
                            </div>
                            <div v-else class="hadith-kutub-empty"><p>Aucun texte ne correspond à ces filtres.</p></div>
                            <div v-if="filteredBookHadiths.length>bookVisibleLimit" class="hadith-pro-more">
                                <button type="button" @click="bookVisibleLimit+=18">Voir plus de hadiths <i data-lucide="chevron-down" aria-hidden="true"></i></button>
                            </div>
                            <p v-if="bookPayload.editorialStatus" class="hadith-kutub-source-note">
                                Textes arabes et français issus d’éditions numériques référencées. Les informations de provenance et les limites de traduction sont disponibles dans chaque fiche.
                            </p>
                        </div>
                        <div v-else class="hadith-kutub-empty">
                            <i data-lucide="book-open" aria-hidden="true"></i>
                            <h3>Ce recueil est prêt à être rempli</h3>
                            <p>Aucun hadith n'a encore été ajouté. Ses chapitres, textes arabes, traductions et références seront intégrés progressivement.</p>
                        </div>
                        </template>
                    </template>
                </section>
            </section>
        </div>
    </section>
    `
};
