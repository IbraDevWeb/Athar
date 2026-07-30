const LibraryView = {
    props: [
        'categories',
        'activeCategory',
        'lastReadChapter',
        'headerSearchQuery',
        'filteredChapters',
        'allChapters',
        'openChapter',
        'isFavorite',
        'toggleFavorite',
        'viewFilter',
        'toggleFilterFavorite',
        'openRandomChapter',
        'setView'
    ],
    emits: ['update:activeCategory', 'update:searchQuery'],
    data() {
        return {
            activeSpace: 'home',
            localQuery: this.headerSearchQuery || '',
            layoutMode: 'grid',
            sortMode: 'featured',
            contentFilter: 'all',
            activeLetter: 'Tous',
            selectedCollection: null,
            showFilters: false,
            recentHistory: []
        };
    },
    computed: {
        chapters() {
            return Array.isArray(this.allChapters) ? this.allChapters.filter(Boolean) : [];
        },
        libraryStats() {
            return {
                profiles: this.chapters.length,
                narratives: this.chapters.reduce((sum, chapter) => sum + this.safeArray(chapter.narratives).length, 0),
                events: this.chapters.reduce((sum, chapter) => sum + this.safeArray(chapter.timeline).length, 0),
                traditions: this.chapters.reduce((sum, chapter) => sum + this.safeArray(chapter.hadiths).length, 0),
                sourced: this.chapters.filter((chapter) => Boolean(chapter.source)).length
            };
        },
        completionRate() {
            if (!this.chapters.length) return 0;
            return Math.round((this.libraryStats.sourced / this.chapters.length) * 100);
        },
        featuredItems() {
            return [...this.chapters]
                .sort((a, b) => this.densityScore(b) - this.densityScore(a))
                .slice(0, 6);
        },
        editorialLead() {
            return this.lastReadChapter || this.featuredItems[0] || null;
        },
        secondaryFeatured() {
            return this.featuredItems.filter((item) => item.id !== this.editorialLead?.id).slice(0, 3);
        },
        availableLetters() {
            return [...new Set(this.chapters.map((chapter) => this.normalizeText(chapter.name).charAt(0).toUpperCase()).filter(Boolean))]
                .sort((a, b) => a.localeCompare(b, 'fr'));
        },
        catalogItems() {
            let items = Array.isArray(this.filteredChapters) ? [...this.filteredChapters] : [];

            if (this.contentFilter === 'sourced') items = items.filter((chapter) => chapter.source);
            if (this.contentFilter === 'narratives') items = items.filter((chapter) => this.safeArray(chapter.narratives).length >= 3);
            if (this.contentFilter === 'timeline') items = items.filter((chapter) => this.safeArray(chapter.timeline).length > 0);
            if (this.contentFilter === 'traditions') items = items.filter((chapter) => this.safeArray(chapter.hadiths).length > 0);
            if (this.contentFilter === 'quiz') items = items.filter((chapter) => this.safeArray(chapter.quizData || chapter.quiz).length > 0);

            if (this.activeLetter !== 'Tous') {
                items = items.filter((chapter) => this.normalizeText(chapter.name).charAt(0).toUpperCase() === this.activeLetter);
            }

            const recentRank = new Map(this.recentHistory.map((entry, index) => [String(entry.id), index]));
            if (this.sortMode === 'alpha') items.sort((a, b) => String(a.name).localeCompare(String(b.name), 'fr'));
            if (this.sortMode === 'dense') items.sort((a, b) => this.densityScore(b) - this.densityScore(a));
            if (this.sortMode === 'recent') items.sort((a, b) => (recentRank.get(String(a.id)) ?? 9999) - (recentRank.get(String(b.id)) ?? 9999));
            if (this.sortMode === 'featured') items.sort((a, b) => Number(Boolean(b.verified)) - Number(Boolean(a.verified)) || this.densityScore(b) - this.densityScore(a));
            return items;
        },
        collectionDefinitions() {
            const definitions = [
                {
                    id: 'foundations',
                    title: 'Figures fondatrices',
                    arabic: 'الرعيل الأول',
                    icon: 'crown',
                    description: 'Califes, dix promis et grandes figures des premières générations.',
                    filter: (chapter) => this.hasAnyTag(chapter, ['Califes', '10 Promis', 'Ahl al-Bayt'])
                },
                {
                    id: 'hijra',
                    title: 'Les communautés de l’Hégire',
                    arabic: 'المهاجرون والأنصار',
                    icon: 'route',
                    description: 'Muhājirūn, Anṣār et destins liés à la formation de Médine.',
                    filter: (chapter) => this.hasAnyTag(chapter, ['Muhajirun', 'Ansar'])
                },
                {
                    id: 'battlefields',
                    title: 'Épreuves et commandement',
                    arabic: 'السير والمغازي',
                    icon: 'shield',
                    description: 'Badr, Uḥud, commandants et figures du sacrifice.',
                    filter: (chapter) => this.hasAnyTag(chapter, ['Badr', 'Ouhoud', 'Commandants', 'Martyrs'])
                },
                {
                    id: 'women',
                    title: 'Femmes de transmission',
                    arabic: 'نساء العلم',
                    icon: 'flower-2',
                    description: 'Mères des croyants et femmes au cœur de la mémoire islamique.',
                    filter: (chapter) => this.hasAnyTag(chapter, ['Mères des Croyants'])
                },
                {
                    id: 'scholars',
                    title: 'Savants et héritiers',
                    arabic: 'العلماء والورثة',
                    icon: 'graduation-cap',
                    description: 'Les figures savantes et les héritiers intellectuels du corpus.',
                    filter: (chapter) => this.hasAnyTag(chapter, ['Savants'])
                },
                {
                    id: 'documented',
                    title: 'Notices documentées',
                    arabic: 'التراجم الموثقة',
                    icon: 'book-check',
                    description: 'Sélection disposant d’une référence principale explicite.',
                    filter: (chapter) => Boolean(chapter.source)
                }
            ];
            return definitions.map((collection) => ({
                ...collection,
                items: this.chapters.filter(collection.filter)
            }));
        },
        activeCollection() {
            return this.collectionDefinitions.find((collection) => collection.id === this.selectedCollection) || null;
        },
        favoriteItems() {
            return this.chapters.filter((chapter) => this.isFavorite && this.isFavorite(chapter.id));
        },
        recentItems() {
            const chapterMap = new Map(this.chapters.map((chapter) => [String(chapter.id), chapter]));
            return this.recentHistory.map((entry) => chapterMap.get(String(entry.id))).filter(Boolean).slice(0, 12);
        },
        activeFiltersCount() {
            return [
                this.activeCategory !== 'Tous',
                this.contentFilter !== 'all',
                this.activeLetter !== 'Tous',
                Boolean(this.localQuery)
            ].filter(Boolean).length;
        }
    },
    watch: {
        headerSearchQuery(value) {
            if (value !== this.localQuery) this.localQuery = value || '';
        },
        activeSpace() {
            this.refreshIcons();
        },
        selectedCollection() {
            this.refreshIcons();
        },
        layoutMode() {
            this.refreshIcons();
        }
    },
    mounted() {
        this.loadHistory();
        this.refreshIcons();
    },
    methods: {
        safeArray(value) {
            return Array.isArray(value) ? value.filter(Boolean) : [];
        },
        normalizeText(value) {
            return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
        },
        hasAnyTag(chapter, tags) {
            const chapterTags = this.safeArray(chapter.tags);
            return tags.some((tag) => chapterTags.includes(tag));
        },
        densityScore(chapter) {
            return this.safeArray(chapter.narratives).length * 3
                + this.safeArray(chapter.timeline).length * 2
                + this.safeArray(chapter.hadiths).length * 2
                + this.safeArray(chapter.quizData || chapter.quiz).length
                + Number(Boolean(chapter.source)) * 3
                + Number(Boolean(chapter.verified)) * 2;
        },
        estimatedReadingTime(chapter) {
            let text = `${chapter.intro || ''} ${chapter.genealogy || ''} ${chapter.physicalDesc || ''}`;
            this.safeArray(chapter.narratives).forEach((item) => { text += ` ${item.content || ''}`; });
            const words = text.trim() ? text.trim().split(/\s+/).length : 0;
            return `${Math.max(2, Math.ceil(words / 210))} min`;
        },
        metrics(chapter) {
            return {
                narratives: this.safeArray(chapter.narratives).length,
                timeline: this.safeArray(chapter.timeline).length,
                hadiths: this.safeArray(chapter.hadiths).length,
                quiz: this.safeArray(chapter.quizData || chapter.quiz).length
            };
        },
        updateSearch(value) {
            this.localQuery = value;
            this.$emit('update:searchQuery', value);
        },
        clearSearch() {
            this.updateSearch('');
        },
        setCategory(category) {
            this.$emit('update:activeCategory', category);
            this.activeSpace = 'catalog';
            this.refreshIcons();
        },
        resetFilters() {
            this.$emit('update:activeCategory', 'Tous');
            this.contentFilter = 'all';
            this.activeLetter = 'Tous';
            this.clearSearch();
        },
        selectCollection(collection) {
            this.selectedCollection = collection.id;
            this.activeSpace = 'collections';
        },
        openItem(chapter) {
            if (!chapter) return;
            const now = Date.now();
            this.recentHistory = [
                { id: chapter.id, openedAt: now },
                ...this.recentHistory.filter((entry) => String(entry.id) !== String(chapter.id))
            ].slice(0, 30);
            this.saveHistory();
            this.openChapter(chapter);
        },
        loadHistory() {
            try {
                const saved = JSON.parse(localStorage.getItem('athar_library_v2') || '{}');
                this.recentHistory = Array.isArray(saved.recent) ? saved.recent : [];
            } catch (error) {
                console.warn('Historique de bibliothèque indisponible :', error);
                this.recentHistory = [];
            }
        },
        saveHistory() {
            try {
                localStorage.setItem('athar_library_v2', JSON.stringify({ recent: this.recentHistory }));
            } catch (error) {
                console.warn('Historique de bibliothèque non enregistré :', error);
            }
        },
        toggleItemFavorite(chapter, event) {
            event?.stopPropagation();
            if (this.toggleFavorite) this.toggleFavorite(chapter.id);
            this.refreshIcons();
        },
        openRandom() {
            if (this.openRandomChapter) this.openRandomChapter();
        },
        refreshIcons() {
            window.setTimeout(() => {
                if (window.lucide) window.lucide.createIcons();
            }, 30);
        }
    },
    template: `
    <section class="library-pro-root">
        <header class="library-pro-nav">
            <div class="library-pro-identity">
                <span class="library-pro-seal"><i data-lucide="library-big"></i></span>
                <div>
                    <span lang="ar" dir="rtl">المكتبة</span>
                    <b>Bibliothèque Athar</b>
                </div>
            </div>
            <nav aria-label="Espaces de la bibliothèque">
                <button v-for="space in [
                            { id: 'home', label: 'Accueil', icon: 'home' },
                            { id: 'catalog', label: 'Catalogue', icon: 'rows-3' },
                            { id: 'collections', label: 'Collections', icon: 'layers-3' },
                            { id: 'personal', label: 'Ma bibliothèque', icon: 'bookmark' }
                        ]"
                        :key="space.id"
                        type="button"
                        @click="activeSpace = space.id"
                        :class="{ active: activeSpace === space.id }">
                    <i :data-lucide="space.icon"></i><span>{{ space.label }}</span>
                </button>
            </nav>
            <div class="library-pro-nav-actions">
                <button type="button" @click="openRandom" title="Découverte aléatoire"><i data-lucide="shuffle"></i></button>
                <a href="methodologie.html" title="Méthodologie éditoriale"><i data-lucide="book-check"></i></a>
            </div>
        </header>

        <div class="library-pro-scroll">
            <template v-if="activeSpace === 'home'">
                <div class="library-pro-home">
                    <section class="library-pro-hero">
                        <div class="library-pro-hero-copy">
                            <p class="library-pro-eyebrow"><i data-lucide="sparkles"></i> Cœur documentaire d’Athar Pro</p>
                            <p class="library-pro-hero-arabic" lang="ar" dir="rtl">موسوعة التراجم والسير</p>
                            <h1>Explorer les vies,<br><em>comprendre les héritages.</em></h1>
                            <p class="library-pro-hero-intro">Une porte d’entrée éditoriale vers les figures, les récits, les transmissions et les repères historiques de l’encyclopédie.</p>

                            <label class="library-pro-search-hero">
                                <i data-lucide="search"></i>
                                <input :value="localQuery" @input="updateSearch($event.target.value); activeSpace = 'catalog'" placeholder="Chercher une figure, une notion, un récit, une bataille…" aria-label="Rechercher dans la bibliothèque">
                                <span>Recherche globale</span>
                            </label>

                            <div class="library-pro-hero-actions">
                                <button v-if="lastReadChapter" type="button" class="primary" @click="openItem(lastReadChapter)"><i data-lucide="play"></i> Reprendre {{ lastReadChapter.name }}</button>
                                <button type="button" @click="activeSpace = 'catalog'"><i data-lucide="compass"></i> Explorer le catalogue</button>
                            </div>
                        </div>

                        <aside class="library-pro-hero-panel">
                            <div class="library-pro-panel-head">
                                <span>État du corpus</span>
                                <b>{{ completionRate }}%</b>
                            </div>
                            <div class="library-pro-corpus-ring" :style="{ '--library-progress': completionRate + '%' }">
                                <div><strong>{{ libraryStats.profiles }}</strong><span>notices</span></div>
                            </div>
                            <dl class="library-pro-corpus-stats">
                                <div><dt>Récits</dt><dd>{{ libraryStats.narratives }}</dd></div>
                                <div><dt>Repères</dt><dd>{{ libraryStats.events }}</dd></div>
                                <div><dt>Traditions</dt><dd>{{ libraryStats.traditions }}</dd></div>
                                <div><dt>Sourcées</dt><dd>{{ libraryStats.sourced }}</dd></div>
                            </dl>
                            <p>Le pourcentage mesure la présence d’une référence principale dans les données actuelles.</p>
                        </aside>
                    </section>

                    <section v-if="editorialLead" class="library-pro-editorial">
                        <div class="library-pro-section-heading">
                            <div><span>Sélection éditoriale</span><h2>{{ lastReadChapter ? 'Reprendre le fil' : 'Commencer par une grande notice' }}</h2></div>
                            <button type="button" @click="activeSpace = 'catalog'">Tout parcourir <i data-lucide="arrow-right"></i></button>
                        </div>
                        <div class="library-pro-editorial-grid">
                            <article class="library-pro-lead" @click="openItem(editorialLead)" tabindex="0" @keydown.enter="openItem(editorialLead)">
                                <div class="library-pro-lead-number">{{ String(editorialLead.id).padStart(2, '0') }}</div>
                                <div class="library-pro-lead-content">
                                    <div class="library-pro-card-badges">
                                        <span v-if="editorialLead.verified"><i data-lucide="badge-check"></i> Vérifiée</span>
                                        <span v-for="tag in safeArray(editorialLead.tags).slice(0, 2)" :key="tag">{{ tag }}</span>
                                    </div>
                                    <p class="library-pro-lead-arabic" lang="ar" dir="rtl">{{ editorialLead.arabicName }}</p>
                                    <h3>{{ editorialLead.name }}</h3>
                                    <blockquote>« {{ editorialLead.subtitle }} »</blockquote>
                                    <p>{{ editorialLead.intro }}</p>
                                    <div class="library-pro-lead-footer">
                                        <span><i data-lucide="clock-3"></i> {{ estimatedReadingTime(editorialLead) }}</span>
                                        <span><i data-lucide="scroll-text"></i> {{ metrics(editorialLead).narratives }} récits</span>
                                        <b>Ouvrir la notice <i data-lucide="arrow-up-right"></i></b>
                                    </div>
                                </div>
                            </article>

                            <div class="library-pro-secondary-list">
                                <article v-for="chapter in secondaryFeatured" :key="chapter.id" @click="openItem(chapter)" tabindex="0" @keydown.enter="openItem(chapter)">
                                    <span class="library-pro-mini-arabic" lang="ar" dir="rtl">{{ chapter.arabicName }}</span>
                                    <div><small>{{ safeArray(chapter.tags)[0] || 'Notice' }}</small><h3>{{ chapter.name }}</h3><p>{{ chapter.subtitle }}</p></div>
                                    <i data-lucide="arrow-up-right"></i>
                                </article>
                            </div>
                        </div>
                    </section>

                    <section class="library-pro-collections-preview">
                        <div class="library-pro-section-heading">
                            <div><span>Portes d’entrée</span><h2>Explorer par collections</h2></div>
                            <button type="button" @click="activeSpace = 'collections'">Voir les collections <i data-lucide="arrow-right"></i></button>
                        </div>
                        <div class="library-pro-collection-grid">
                            <button v-for="collection in collectionDefinitions" :key="collection.id" type="button" @click="selectCollection(collection)">
                                <span class="library-pro-collection-icon"><i :data-lucide="collection.icon"></i></span>
                                <span class="library-pro-collection-arabic" lang="ar" dir="rtl">{{ collection.arabic }}</span>
                                <b>{{ collection.title }}</b>
                                <p>{{ collection.description }}</p>
                                <small>{{ collection.items.length }} notices <i data-lucide="arrow-right"></i></small>
                            </button>
                        </div>
                    </section>

                    <section class="library-pro-method">
                        <div><span class="library-pro-method-icon"><i data-lucide="scan-search"></i></span><div><small>Lire avec méthode</small><h2>Une encyclopédie documentée, pas une suite de récits isolés.</h2><p>Les fiches signalent leur source principale et doivent être lues en tenant compte des variantes, des genres biographiques et du contexte de transmission.</p></div></div>
                        <a href="methodologie.html">Consulter la méthodologie <i data-lucide="arrow-up-right"></i></a>
                    </section>
                </div>
            </template>

            <template v-else-if="activeSpace === 'catalog'">
                <div class="library-pro-catalog">
                    <section class="library-pro-catalog-head">
                        <div><span>Index encyclopédique</span><h1>Catalogue des notices</h1><p>Recherchez dans les noms, titres, récits, tags et notices existantes.</p></div>
                        <div class="library-pro-result-count"><strong>{{ catalogItems.length }}</strong><span>résultats</span></div>
                    </section>

                    <section class="library-pro-catalog-tools">
                        <label class="library-pro-search-bar">
                            <i data-lucide="search"></i>
                            <input :value="localQuery" @input="updateSearch($event.target.value)" placeholder="Rechercher dans le corpus…">
                            <button v-if="localQuery" type="button" @click="clearSearch" aria-label="Effacer la recherche"><i data-lucide="x"></i></button>
                        </label>
                        <button type="button" class="library-pro-filter-toggle" @click="showFilters = !showFilters" :class="{ active: showFilters || activeFiltersCount }"><i data-lucide="sliders-horizontal"></i> Filtres <span v-if="activeFiltersCount">{{ activeFiltersCount }}</span></button>
                        <select v-model="sortMode" aria-label="Trier le catalogue">
                            <option value="featured">Sélection éditoriale</option>
                            <option value="alpha">Ordre alphabétique</option>
                            <option value="dense">Fiches les plus denses</option>
                            <option value="recent">Consultées récemment</option>
                        </select>
                        <div class="library-pro-layout-switch" aria-label="Mode d’affichage">
                            <button type="button" @click="layoutMode = 'grid'" :class="{ active: layoutMode === 'grid' }"><i data-lucide="layout-grid"></i></button>
                            <button type="button" @click="layoutMode = 'list'" :class="{ active: layoutMode === 'list' }"><i data-lucide="list"></i></button>
                        </div>
                    </section>

                    <section v-show="showFilters" class="library-pro-filter-panel">
                        <div><span>Catégories</span><div class="library-pro-chip-list"><button v-for="category in categories" :key="category" type="button" @click="$emit('update:activeCategory', category)" :class="{ active: activeCategory === category }">{{ category }}</button></div></div>
                        <div><span>Contenu disponible</span><div class="library-pro-chip-list"><button v-for="filter in [
                            { id: 'all', label: 'Tout' },
                            { id: 'sourced', label: 'Avec source' },
                            { id: 'narratives', label: 'Récits développés' },
                            { id: 'timeline', label: 'Chronologie' },
                            { id: 'traditions', label: 'Traditions' },
                            { id: 'quiz', label: 'Quiz' }
                        ]" :key="filter.id" type="button" @click="contentFilter = filter.id" :class="{ active: contentFilter === filter.id }">{{ filter.label }}</button></div></div>
                        <div><span>Index alphabétique</span><div class="library-pro-letter-list"><button type="button" @click="activeLetter = 'Tous'" :class="{ active: activeLetter === 'Tous' }">Tous</button><button v-for="letter in availableLetters" :key="letter" type="button" @click="activeLetter = letter" :class="{ active: activeLetter === letter }">{{ letter }}</button></div></div>
                        <button type="button" class="library-pro-reset" @click="resetFilters"><i data-lucide="rotate-ccw"></i> Réinitialiser</button>
                    </section>

                    <div v-if="catalogItems.length" class="library-pro-results" :class="'is-' + layoutMode">
                        <article v-for="chapter in catalogItems" :key="chapter.id" class="library-pro-card" @click="openItem(chapter)" tabindex="0" @keydown.enter="openItem(chapter)">
                            <div class="library-pro-card-top">
                                <div class="library-pro-card-badges"><span v-if="chapter.verified"><i data-lucide="badge-check"></i> Vérifiée</span><span>{{ safeArray(chapter.tags)[0] || 'Histoire' }}</span></div>
                                <button type="button" @click="toggleItemFavorite(chapter, $event)" :class="{ active: isFavorite && isFavorite(chapter.id) }" :aria-label="isFavorite && isFavorite(chapter.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'"><i data-lucide="heart"></i></button>
                            </div>
                            <div class="library-pro-card-main">
                                <span class="library-pro-card-arabic" lang="ar" dir="rtl">{{ chapter.arabicName }}</span>
                                <h2>{{ chapter.name }}</h2>
                                <blockquote>« {{ chapter.subtitle }} »</blockquote>
                                <p>{{ chapter.intro }}</p>
                            </div>
                            <dl class="library-pro-card-metrics">
                                <div><dt><i data-lucide="scroll-text"></i></dt><dd>{{ metrics(chapter).narratives }}<span>récits</span></dd></div>
                                <div><dt><i data-lucide="calendar-range"></i></dt><dd>{{ metrics(chapter).timeline }}<span>repères</span></dd></div>
                                <div><dt><i data-lucide="messages-square"></i></dt><dd>{{ metrics(chapter).hadiths }}<span>traditions</span></dd></div>
                                <div><dt><i data-lucide="clock-3"></i></dt><dd>{{ estimatedReadingTime(chapter) }}<span>lecture</span></dd></div>
                            </dl>
                            <footer><span v-if="chapter.source"><i data-lucide="book-check"></i> Référence indiquée</span><span v-else><i data-lucide="circle-alert"></i> Source à préciser</span><b>Étudier <i data-lucide="arrow-right"></i></b></footer>
                        </article>
                    </div>
                    <div v-else class="library-pro-empty"><i data-lucide="search-x"></i><h2>Aucune notice trouvée</h2><p>Modifiez les filtres ou élargissez votre recherche.</p><button type="button" @click="resetFilters">Réinitialiser les filtres</button></div>
                </div>
            </template>

            <template v-else-if="activeSpace === 'collections'">
                <div class="library-pro-collections-page">
                    <section class="library-pro-page-title"><span>Parcours éditoriaux</span><h1>Collections thématiques</h1><p>Des regroupements générés à partir des catégories existantes, sans modifier le corpus.</p></section>
                    <div class="library-pro-collection-index">
                        <button v-for="collection in collectionDefinitions" :key="collection.id" type="button" @click="selectedCollection = collection.id" :class="{ active: selectedCollection === collection.id }">
                            <span><i :data-lucide="collection.icon"></i></span><div><small lang="ar" dir="rtl">{{ collection.arabic }}</small><b>{{ collection.title }}</b><p>{{ collection.description }}</p></div><strong>{{ collection.items.length }}</strong>
                        </button>
                    </div>
                    <section v-if="activeCollection" class="library-pro-active-collection">
                        <div class="library-pro-section-heading"><div><span>{{ activeCollection.arabic }}</span><h2>{{ activeCollection.title }}</h2><p>{{ activeCollection.description }}</p></div><button type="button" @click="selectedCollection = null"><i data-lucide="x"></i> Fermer</button></div>
                        <div class="library-pro-shelf">
                            <article v-for="chapter in activeCollection.items" :key="chapter.id" @click="openItem(chapter)" tabindex="0" @keydown.enter="openItem(chapter)">
                                <span lang="ar" dir="rtl">{{ chapter.arabicName }}</span><small>{{ safeArray(chapter.tags)[0] || 'Notice' }}</small><h3>{{ chapter.name }}</h3><p>{{ chapter.subtitle }}</p><footer><span>{{ estimatedReadingTime(chapter) }}</span><i data-lucide="arrow-up-right"></i></footer>
                            </article>
                        </div>
                    </section>
                    <div v-else class="library-pro-collection-prompt"><i data-lucide="layers-3"></i><h2>Choisissez une collection</h2><p>Chaque collection ouvre une perspective différente sur les notices déjà présentes.</p></div>
                </div>
            </template>

            <template v-else>
                <div class="library-pro-personal">
                    <section class="library-pro-page-title"><span>Espace personnel local</span><h1>Ma bibliothèque</h1><p>Favoris et historique restent enregistrés uniquement dans ce navigateur.</p></section>
                    <div class="library-pro-personal-stats">
                        <div><span><i data-lucide="heart"></i></span><strong>{{ favoriteItems.length }}</strong><p>favoris</p></div>
                        <div><span><i data-lucide="history"></i></span><strong>{{ recentItems.length }}</strong><p>consultées récemment</p></div>
                        <div><span><i data-lucide="book-open-check"></i></span><strong>{{ lastReadChapter ? 1 : 0 }}</strong><p>lecture à reprendre</p></div>
                    </div>

                    <section v-if="lastReadChapter" class="library-pro-resume-card" @click="openItem(lastReadChapter)" tabindex="0" @keydown.enter="openItem(lastReadChapter)">
                        <span lang="ar" dir="rtl">{{ lastReadChapter.arabicName }}</span><div><small>Reprendre la dernière lecture</small><h2>{{ lastReadChapter.name }}</h2><p>{{ lastReadChapter.subtitle }}</p></div><button type="button"><i data-lucide="play"></i></button>
                    </section>

                    <section class="library-pro-personal-section">
                        <div class="library-pro-section-heading"><div><span>À conserver</span><h2>Favoris</h2></div><button type="button" @click="activeSpace = 'catalog'">Ajouter des notices <i data-lucide="arrow-right"></i></button></div>
                        <div v-if="favoriteItems.length" class="library-pro-shelf"><article v-for="chapter in favoriteItems" :key="chapter.id" @click="openItem(chapter)" tabindex="0" @keydown.enter="openItem(chapter)"><span lang="ar" dir="rtl">{{ chapter.arabicName }}</span><small>{{ safeArray(chapter.tags)[0] || 'Notice' }}</small><h3>{{ chapter.name }}</h3><p>{{ chapter.subtitle }}</p><footer><span>{{ estimatedReadingTime(chapter) }}</span><i data-lucide="heart" class="is-favorite"></i></footer></article></div>
                        <div v-else class="library-pro-inline-empty"><i data-lucide="heart"></i><p>Aucune notice favorite pour le moment.</p></div>
                    </section>

                    <section class="library-pro-personal-section">
                        <div class="library-pro-section-heading"><div><span>Votre parcours</span><h2>Lectures récentes</h2></div></div>
                        <div v-if="recentItems.length" class="library-pro-recent-list"><button v-for="(chapter, index) in recentItems" :key="chapter.id" type="button" @click="openItem(chapter)"><span>{{ String(index + 1).padStart(2, '0') }}</span><div><small>{{ safeArray(chapter.tags)[0] || 'Notice' }}</small><b>{{ chapter.name }}</b><p>{{ chapter.subtitle }}</p></div><em>{{ estimatedReadingTime(chapter) }}</em><i data-lucide="arrow-right"></i></button></div>
                        <div v-else class="library-pro-inline-empty"><i data-lucide="history"></i><p>Les notices ouvertes apparaîtront ici.</p></div>
                    </section>
                </div>
            </template>
        </div>
    </section>
    `
};