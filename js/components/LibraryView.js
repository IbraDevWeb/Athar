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
        'openRandomChapter'
    ],
    emits: ['update:activeCategory'],
    data() {
        return {
            activeSpace: 'home',
            query: this.headerSearchQuery || '',
            layoutMode: 'grid',
            sortMode: 'featured',
            contentFilter: 'all',
            activeLetter: 'Tous',
            selectedCollectionId: null,
            showFilters: false,
            recentHistory: []
        };
    },
    computed: {
        chapters() {
            if (Array.isArray(this.allChapters) && this.allChapters.length) return this.allChapters.filter(Boolean);
            if (Array.isArray(this.$root?.allChapters) && this.$root.allChapters.length) return this.$root.allChapters.filter(Boolean);
            return Array.isArray(this.filteredChapters) ? this.filteredChapters.filter(Boolean) : [];
        },
        stats() {
            return {
                profiles: this.chapters.length,
                narratives: this.chapters.reduce((sum, item) => sum + this.safeArray(item.narratives).length, 0),
                timeline: this.chapters.reduce((sum, item) => sum + this.safeArray(item.timeline).length, 0),
                traditions: this.chapters.reduce((sum, item) => sum + this.safeArray(item.hadiths).length, 0),
                sourced: this.chapters.filter((item) => item.source).length
            };
        },
        sourcedRate() {
            return this.chapters.length ? Math.round((this.stats.sourced / this.chapters.length) * 100) : 0;
        },
        featured() {
            return [...this.chapters].sort((a, b) => this.density(b) - this.density(a)).slice(0, 5);
        },
        leadChapter() {
            return this.lastReadChapter || this.featured[0] || null;
        },
        categoryList() {
            if (Array.isArray(this.categories) && this.categories.length) return this.categories;
            const tags = this.chapters.flatMap((item) => this.safeArray(item.tags));
            return ['Tous', ...new Set(tags)];
        },
        letters() {
            return [...new Set(this.chapters.map((item) => this.normalize(item.name).charAt(0).toUpperCase()).filter(Boolean))]
                .sort((a, b) => a.localeCompare(b, 'fr'));
        },
        catalogItems() {
            let items = [...this.chapters];
            if (this.activeCategory && this.activeCategory !== 'Tous') {
                items = items.filter((item) => this.safeArray(item.tags).includes(this.activeCategory));
            }
            if (this.viewFilter === 'favorites') items = items.filter((item) => this.favorite(item.id));

            const q = this.normalize(this.query).toLowerCase();
            if (q) {
                items = items.filter((item) => {
                    const searchable = [
                        item.name,
                        item.arabicName,
                        item.subtitle,
                        item.intro,
                        item.genealogy,
                        item.physicalDesc,
                        item.source,
                        ...this.safeArray(item.tags),
                        ...this.safeArray(item.narratives).flatMap((story) => [story.title, story.content]),
                        ...this.safeArray(item.timeline).flatMap((event) => [event.year, event.desc])
                    ].join(' ');
                    return this.normalize(searchable).toLowerCase().includes(q);
                });
            }

            if (this.contentFilter === 'sourced') items = items.filter((item) => item.source);
            if (this.contentFilter === 'stories') items = items.filter((item) => this.safeArray(item.narratives).length >= 3);
            if (this.contentFilter === 'timeline') items = items.filter((item) => this.safeArray(item.timeline).length > 0);
            if (this.contentFilter === 'traditions') items = items.filter((item) => this.safeArray(item.hadiths).length > 0);
            if (this.contentFilter === 'quiz') items = items.filter((item) => this.safeArray(item.quizData || item.quiz).length > 0);
            if (this.activeLetter !== 'Tous') items = items.filter((item) => this.normalize(item.name).charAt(0).toUpperCase() === this.activeLetter);

            const recentOrder = new Map(this.recentHistory.map((entry, index) => [String(entry.id), index]));
            if (this.sortMode === 'alpha') items.sort((a, b) => String(a.name).localeCompare(String(b.name), 'fr'));
            if (this.sortMode === 'dense') items.sort((a, b) => this.density(b) - this.density(a));
            if (this.sortMode === 'recent') items.sort((a, b) => (recentOrder.get(String(a.id)) ?? 9999) - (recentOrder.get(String(b.id)) ?? 9999));
            if (this.sortMode === 'featured') items.sort((a, b) => Number(Boolean(b.verified)) - Number(Boolean(a.verified)) || this.density(b) - this.density(a));
            return items;
        },
        collections() {
            const definitions = [
                ['foundations', 'Figures fondatrices', 'الرعيل الأول', 'crown', 'Califes, dix promis et grandes figures des premières générations.', ['Califes', '10 Promis', 'Ahl al-Bayt']],
                ['hijra', 'Communautés de l’Hégire', 'المهاجرون والأنصار', 'route', 'Muhājirūn et Anṣār au cœur de la formation de Médine.', ['Muhajirun', 'Ansar']],
                ['campaigns', 'Épreuves et commandement', 'السير والمغازي', 'shield', 'Badr, Uḥud, commandants et figures du sacrifice.', ['Badr', 'Ouhoud', 'Commandants', 'Martyrs']],
                ['women', 'Femmes de transmission', 'نساء العلم', 'flower-2', 'Mères des croyants et femmes de la mémoire islamique.', ['Mères des Croyants']],
                ['scholars', 'Savants et héritiers', 'العلماء والورثة', 'graduation-cap', 'Figures savantes et héritiers intellectuels du corpus.', ['Savants']],
                ['sourced', 'Notices documentées', 'التراجم الموثقة', 'book-check', 'Notices disposant d’une référence principale explicite.', []]
            ];
            return definitions.map(([id, title, arabic, icon, description, tags]) => ({
                id, title, arabic, icon, description,
                items: id === 'sourced'
                    ? this.chapters.filter((item) => item.source)
                    : this.chapters.filter((item) => tags.some((tag) => this.safeArray(item.tags).includes(tag)))
            }));
        },
        selectedCollection() {
            return this.collections.find((item) => item.id === this.selectedCollectionId) || null;
        },
        favoriteItems() {
            return this.chapters.filter((item) => this.favorite(item.id));
        },
        recentItems() {
            const map = new Map(this.chapters.map((item) => [String(item.id), item]));
            return this.recentHistory.map((entry) => map.get(String(entry.id))).filter(Boolean).slice(0, 12);
        },
        filterCount() {
            return [
                this.activeCategory && this.activeCategory !== 'Tous',
                this.contentFilter !== 'all',
                this.activeLetter !== 'Tous',
                Boolean(this.query)
            ].filter(Boolean).length;
        }
    },
    watch: {
        headerSearchQuery(value) {
            if (value !== this.query) this.query = value || '';
        },
        activeSpace() {
            this.icons();
        },
        selectedCollectionId() {
            this.icons();
        },
        layoutMode() {
            this.icons();
        }
    },
    mounted() {
        this.loadHistory();
        this.icons();
    },
    methods: {
        safeArray(value) {
            return Array.isArray(value) ? value.filter(Boolean) : [];
        },
        normalize(value) {
            return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
        },
        density(item) {
            return this.safeArray(item.narratives).length * 3
                + this.safeArray(item.timeline).length * 2
                + this.safeArray(item.hadiths).length * 2
                + this.safeArray(item.quizData || item.quiz).length
                + Number(Boolean(item.source)) * 3
                + Number(Boolean(item.verified)) * 2;
        },
        metrics(item) {
            return {
                stories: this.safeArray(item.narratives).length,
                events: this.safeArray(item.timeline).length,
                traditions: this.safeArray(item.hadiths).length,
                quiz: this.safeArray(item.quizData || item.quiz).length
            };
        },
        readingTime(item) {
            let text = `${item.intro || ''} ${item.genealogy || ''} ${item.physicalDesc || ''}`;
            this.safeArray(item.narratives).forEach((story) => { text += ` ${story.content || ''}`; });
            const words = text.trim() ? text.trim().split(/\s+/).length : 0;
            return `${Math.max(2, Math.ceil(words / 210))} min`;
        },
        favorite(id) {
            if (typeof this.isFavorite === 'function') return this.isFavorite(id);
            if (typeof this.$root?.isFavorite === 'function') return this.$root.isFavorite(id);
            return false;
        },
        updateQuery(value) {
            this.query = value;
            if (this.$root && 'headerSearchQuery' in this.$root) this.$root.headerSearchQuery = value;
        },
        selectCategory(category) {
            this.$emit('update:activeCategory', category);
        },
        resetFilters() {
            this.$emit('update:activeCategory', 'Tous');
            this.contentFilter = 'all';
            this.activeLetter = 'Tous';
            this.updateQuery('');
        },
        openItem(item) {
            if (!item) return;
            this.recentHistory = [
                { id: item.id, openedAt: Date.now() },
                ...this.recentHistory.filter((entry) => String(entry.id) !== String(item.id))
            ].slice(0, 30);
            this.saveHistory();
            if (typeof this.openChapter === 'function') this.openChapter(item);
            else if (typeof this.$root?.openChapter === 'function') this.$root.openChapter(item);
        },
        toggleItemFavorite(item, event) {
            event?.stopPropagation();
            if (typeof this.toggleFavorite === 'function') this.toggleFavorite(item.id);
            else if (typeof this.$root?.toggleFavorite === 'function') this.$root.toggleFavorite(item.id);
            this.icons();
        },
        randomChapter() {
            if (typeof this.openRandomChapter === 'function') this.openRandomChapter();
            else if (typeof this.$root?.openRandomChapter === 'function') this.$root.openRandomChapter();
            else if (this.chapters.length) this.openItem(this.chapters[Math.floor(Math.random() * this.chapters.length)]);
        },
        chooseCollection(collection) {
            this.selectedCollectionId = collection.id;
            this.activeSpace = 'collections';
        },
        loadHistory() {
            try {
                const saved = JSON.parse(localStorage.getItem('athar_library_v2') || '{}');
                this.recentHistory = Array.isArray(saved.recent) ? saved.recent : [];
            } catch (error) {
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
        icons() {
            window.setTimeout(() => window.lucide?.createIcons(), 40);
        }
    },
    template: `
    <section class="library-pro-root">
        <header class="library-pro-nav">
            <div class="library-pro-identity">
                <span class="library-pro-seal"><i data-lucide="library-big"></i></span>
                <div><span lang="ar" dir="rtl">المكتبة</span><b>Bibliothèque Athar</b></div>
            </div>
            <nav aria-label="Espaces de la bibliothèque">
                <button v-for="space in [
                    { id: 'home', label: 'Accueil', icon: 'home' },
                    { id: 'catalog', label: 'Catalogue', icon: 'rows-3' },
                    { id: 'collections', label: 'Collections', icon: 'layers-3' },
                    { id: 'personal', label: 'Ma bibliothèque', icon: 'bookmark' }
                ]" :key="space.id" type="button" @click="activeSpace = space.id" :class="{ active: activeSpace === space.id }">
                    <i :data-lucide="space.icon"></i><span>{{ space.label }}</span>
                </button>
            </nav>
            <div class="library-pro-nav-actions">
                <button type="button" @click="randomChapter" title="Découverte aléatoire"><i data-lucide="shuffle"></i></button>
                <a href="methodologie.html" title="Méthodologie éditoriale"><i data-lucide="book-check"></i></a>
            </div>
        </header>

        <div class="library-pro-scroll">
            <div v-if="activeSpace === 'home'" class="library-pro-home">
                <section class="library-pro-hero">
                    <div class="library-pro-hero-copy">
                        <p class="library-pro-eyebrow"><i data-lucide="sparkles"></i> Cœur documentaire d’Athar Pro</p>
                        <p class="library-pro-hero-arabic" lang="ar" dir="rtl">موسوعة التراجم والسير</p>
                        <h1>Explorer les vies,<br><em>comprendre les héritages.</em></h1>
                        <p class="library-pro-hero-intro">Une porte d’entrée éditoriale vers les figures, les récits, les transmissions et les repères historiques de l’encyclopédie.</p>
                        <label class="library-pro-search-hero">
                            <i data-lucide="search"></i>
                            <input :value="query" @input="updateQuery($event.target.value); activeSpace = 'catalog'" placeholder="Chercher une figure, une notion, un récit, une bataille…">
                            <span>Recherche globale</span>
                        </label>
                        <div class="library-pro-hero-actions">
                            <button v-if="lastReadChapter" type="button" class="primary" @click="openItem(lastReadChapter)"><i data-lucide="play"></i> Reprendre {{ lastReadChapter.name }}</button>
                            <button type="button" @click="activeSpace = 'catalog'"><i data-lucide="compass"></i> Explorer le catalogue</button>
                        </div>
                    </div>
                    <aside class="library-pro-hero-panel">
                        <div class="library-pro-panel-head"><span>État du corpus</span><b>{{ sourcedRate }}%</b></div>
                        <div class="library-pro-corpus-ring" :style="{ '--library-progress': sourcedRate + '%' }"><div><strong>{{ stats.profiles }}</strong><span>notices</span></div></div>
                        <dl class="library-pro-corpus-stats">
                            <div><dt>Récits</dt><dd>{{ stats.narratives }}</dd></div>
                            <div><dt>Repères</dt><dd>{{ stats.timeline }}</dd></div>
                            <div><dt>Traditions</dt><dd>{{ stats.traditions }}</dd></div>
                            <div><dt>Sourcées</dt><dd>{{ stats.sourced }}</dd></div>
                        </dl>
                        <p>Le pourcentage mesure la présence d’une référence principale dans les données actuelles.</p>
                    </aside>
                </section>

                <section v-if="leadChapter" class="library-pro-editorial">
                    <div class="library-pro-section-heading"><div><span>Sélection éditoriale</span><h2>{{ lastReadChapter ? 'Reprendre le fil' : 'Commencer par une grande notice' }}</h2></div><button type="button" @click="activeSpace = 'catalog'">Tout parcourir <i data-lucide="arrow-right"></i></button></div>
                    <div class="library-pro-editorial-grid">
                        <article class="library-pro-lead" @click="openItem(leadChapter)" tabindex="0" @keydown.enter="openItem(leadChapter)">
                            <div class="library-pro-lead-number">{{ String(leadChapter.id).padStart(2, '0') }}</div>
                            <div class="library-pro-lead-content">
                                <div class="library-pro-card-badges"><span v-if="leadChapter.verified"><i data-lucide="badge-check"></i> Vérifiée</span><span v-for="tag in safeArray(leadChapter.tags).slice(0, 2)" :key="tag">{{ tag }}</span></div>
                                <p class="library-pro-lead-arabic" lang="ar" dir="rtl">{{ leadChapter.arabicName }}</p>
                                <h3>{{ leadChapter.name }}</h3><blockquote>« {{ leadChapter.subtitle }} »</blockquote><p>{{ leadChapter.intro }}</p>
                                <div class="library-pro-lead-footer"><span><i data-lucide="clock-3"></i> {{ readingTime(leadChapter) }}</span><span><i data-lucide="scroll-text"></i> {{ metrics(leadChapter).stories }} récits</span><b>Ouvrir la notice <i data-lucide="arrow-up-right"></i></b></div>
                            </div>
                        </article>
                        <div class="library-pro-secondary-list">
                            <article v-for="item in featured.filter(chapter => chapter.id !== leadChapter.id).slice(0, 3)" :key="item.id" @click="openItem(item)" tabindex="0" @keydown.enter="openItem(item)">
                                <span class="library-pro-mini-arabic" lang="ar" dir="rtl">{{ item.arabicName }}</span><div><small>{{ safeArray(item.tags)[0] || 'Notice' }}</small><h3>{{ item.name }}</h3><p>{{ item.subtitle }}</p></div><i data-lucide="arrow-up-right"></i>
                            </article>
                        </div>
                    </div>
                </section>

                <section class="library-pro-collections-preview">
                    <div class="library-pro-section-heading"><div><span>Portes d’entrée</span><h2>Explorer par collections</h2></div><button type="button" @click="activeSpace = 'collections'">Voir les collections <i data-lucide="arrow-right"></i></button></div>
                    <div class="library-pro-collection-grid">
                        <button v-for="collection in collections" :key="collection.id" type="button" @click="chooseCollection(collection)">
                            <span class="library-pro-collection-icon"><i :data-lucide="collection.icon"></i></span><span class="library-pro-collection-arabic" lang="ar" dir="rtl">{{ collection.arabic }}</span><b>{{ collection.title }}</b><p>{{ collection.description }}</p><small>{{ collection.items.length }} notices <i data-lucide="arrow-right"></i></small>
                        </button>
                    </div>
                </section>

                <section class="library-pro-method">
                    <div><span class="library-pro-method-icon"><i data-lucide="scan-search"></i></span><div><small>Lire avec méthode</small><h2>Une encyclopédie documentée, pas une suite de récits isolés.</h2><p>Les fiches signalent leur source principale et doivent être lues en tenant compte des variantes, des genres biographiques et du contexte de transmission.</p></div></div>
                    <a href="methodologie.html">Consulter la méthodologie <i data-lucide="arrow-up-right"></i></a>
                </section>
            </div>

            <div v-else-if="activeSpace === 'catalog'" class="library-pro-catalog">
                <section class="library-pro-catalog-head"><div><span>Index encyclopédique</span><h1>Catalogue des notices</h1><p>Recherchez dans les noms, titres, récits, tags, chronologies et références existantes.</p></div><div class="library-pro-result-count"><strong>{{ catalogItems.length }}</strong><span>résultats</span></div></section>
                <section class="library-pro-catalog-tools">
                    <label class="library-pro-search-bar"><i data-lucide="search"></i><input :value="query" @input="updateQuery($event.target.value)" placeholder="Rechercher dans le corpus…"><button v-if="query" type="button" @click="updateQuery('')"><i data-lucide="x"></i></button></label>
                    <button type="button" class="library-pro-filter-toggle" @click="showFilters = !showFilters" :class="{ active: showFilters || filterCount }"><i data-lucide="sliders-horizontal"></i> Filtres <span v-if="filterCount">{{ filterCount }}</span></button>
                    <select v-model="sortMode"><option value="featured">Sélection éditoriale</option><option value="alpha">Ordre alphabétique</option><option value="dense">Fiches les plus denses</option><option value="recent">Consultées récemment</option></select>
                    <div class="library-pro-layout-switch"><button type="button" @click="layoutMode = 'grid'" :class="{ active: layoutMode === 'grid' }"><i data-lucide="layout-grid"></i></button><button type="button" @click="layoutMode = 'list'" :class="{ active: layoutMode === 'list' }"><i data-lucide="list"></i></button></div>
                </section>
                <section v-show="showFilters" class="library-pro-filter-panel">
                    <div><span>Catégories</span><div class="library-pro-chip-list"><button v-for="category in categoryList" :key="category" type="button" @click="selectCategory(category)" :class="{ active: activeCategory === category }">{{ category }}</button></div></div>
                    <div><span>Contenu disponible</span><div class="library-pro-chip-list"><button v-for="filter in [{id:'all',label:'Tout'},{id:'sourced',label:'Avec source'},{id:'stories',label:'Récits développés'},{id:'timeline',label:'Chronologie'},{id:'traditions',label:'Traditions'},{id:'quiz',label:'Quiz'}]" :key="filter.id" type="button" @click="contentFilter = filter.id" :class="{ active: contentFilter === filter.id }">{{ filter.label }}</button></div></div>
                    <div><span>Index alphabétique</span><div class="library-pro-letter-list"><button type="button" @click="activeLetter = 'Tous'" :class="{ active: activeLetter === 'Tous' }">Tous</button><button v-for="letter in letters" :key="letter" type="button" @click="activeLetter = letter" :class="{ active: activeLetter === letter }">{{ letter }}</button></div></div>
                    <button type="button" class="library-pro-reset" @click="resetFilters"><i data-lucide="rotate-ccw"></i> Réinitialiser</button>
                </section>
                <div v-if="catalogItems.length" class="library-pro-results" :class="'is-' + layoutMode">
                    <article v-for="item in catalogItems" :key="item.id" class="library-pro-card" @click="openItem(item)" tabindex="0" @keydown.enter="openItem(item)">
                        <div class="library-pro-card-top"><div class="library-pro-card-badges"><span v-if="item.verified"><i data-lucide="badge-check"></i> Vérifiée</span><span>{{ safeArray(item.tags)[0] || 'Histoire' }}</span></div><button type="button" @click="toggleItemFavorite(item, $event)" :class="{ active: favorite(item.id) }"><i data-lucide="heart"></i></button></div>
                        <div class="library-pro-card-main"><span class="library-pro-card-arabic" lang="ar" dir="rtl">{{ item.arabicName }}</span><h2>{{ item.name }}</h2><blockquote>« {{ item.subtitle }} »</blockquote><p>{{ item.intro }}</p></div>
                        <dl class="library-pro-card-metrics"><div><dt><i data-lucide="scroll-text"></i></dt><dd>{{ metrics(item).stories }}<span>récits</span></dd></div><div><dt><i data-lucide="calendar-range"></i></dt><dd>{{ metrics(item).events }}<span>repères</span></dd></div><div><dt><i data-lucide="messages-square"></i></dt><dd>{{ metrics(item).traditions }}<span>traditions</span></dd></div><div><dt><i data-lucide="clock-3"></i></dt><dd>{{ readingTime(item) }}<span>lecture</span></dd></div></dl>
                        <footer><span v-if="item.source"><i data-lucide="book-check"></i> Référence indiquée</span><span v-else><i data-lucide="circle-alert"></i> Source à préciser</span><b>Étudier <i data-lucide="arrow-right"></i></b></footer>
                    </article>
                </div>
                <div v-else class="library-pro-empty"><i data-lucide="search-x"></i><h2>Aucune notice trouvée</h2><p>Modifiez les filtres ou élargissez votre recherche.</p><button type="button" @click="resetFilters">Réinitialiser les filtres</button></div>
            </div>

            <div v-else-if="activeSpace === 'collections'" class="library-pro-collections-page">
                <section class="library-pro-page-title"><span>Parcours éditoriaux</span><h1>Collections thématiques</h1><p>Des regroupements générés à partir des catégories existantes, sans modifier le corpus.</p></section>
                <div class="library-pro-collection-index">
                    <button v-for="collection in collections" :key="collection.id" type="button" @click="selectedCollectionId = collection.id" :class="{ active: selectedCollectionId === collection.id }"><span><i :data-lucide="collection.icon"></i></span><div><small lang="ar" dir="rtl">{{ collection.arabic }}</small><b>{{ collection.title }}</b><p>{{ collection.description }}</p></div><strong>{{ collection.items.length }}</strong></button>
                </div>
                <section v-if="selectedCollection" class="library-pro-active-collection">
                    <div class="library-pro-section-heading"><div><span>{{ selectedCollection.arabic }}</span><h2>{{ selectedCollection.title }}</h2><p>{{ selectedCollection.description }}</p></div><button type="button" @click="selectedCollectionId = null"><i data-lucide="x"></i> Fermer</button></div>
                    <div class="library-pro-shelf"><article v-for="item in selectedCollection.items" :key="item.id" @click="openItem(item)" tabindex="0" @keydown.enter="openItem(item)"><span lang="ar" dir="rtl">{{ item.arabicName }}</span><small>{{ safeArray(item.tags)[0] || 'Notice' }}</small><h3>{{ item.name }}</h3><p>{{ item.subtitle }}</p><footer><span>{{ readingTime(item) }}</span><i data-lucide="arrow-up-right"></i></footer></article></div>
                </section>
                <div v-else class="library-pro-collection-prompt"><i data-lucide="layers-3"></i><h2>Choisissez une collection</h2><p>Chaque collection ouvre une perspective différente sur les notices déjà présentes.</p></div>
            </div>

            <div v-else class="library-pro-personal">
                <section class="library-pro-page-title"><span>Espace personnel local</span><h1>Ma bibliothèque</h1><p>Favoris et historique restent enregistrés uniquement dans ce navigateur.</p></section>
                <div class="library-pro-personal-stats"><div><span><i data-lucide="heart"></i></span><strong>{{ favoriteItems.length }}</strong><p>favoris</p></div><div><span><i data-lucide="history"></i></span><strong>{{ recentItems.length }}</strong><p>consultées récemment</p></div><div><span><i data-lucide="book-open-check"></i></span><strong>{{ lastReadChapter ? 1 : 0 }}</strong><p>lecture à reprendre</p></div></div>
                <section v-if="lastReadChapter" class="library-pro-resume-card" @click="openItem(lastReadChapter)" tabindex="0" @keydown.enter="openItem(lastReadChapter)"><span lang="ar" dir="rtl">{{ lastReadChapter.arabicName }}</span><div><small>Reprendre la dernière lecture</small><h2>{{ lastReadChapter.name }}</h2><p>{{ lastReadChapter.subtitle }}</p></div><button type="button"><i data-lucide="play"></i></button></section>
                <section class="library-pro-personal-section"><div class="library-pro-section-heading"><div><span>À conserver</span><h2>Favoris</h2></div><button type="button" @click="activeSpace = 'catalog'">Ajouter des notices <i data-lucide="arrow-right"></i></button></div><div v-if="favoriteItems.length" class="library-pro-shelf"><article v-for="item in favoriteItems" :key="item.id" @click="openItem(item)" tabindex="0" @keydown.enter="openItem(item)"><span lang="ar" dir="rtl">{{ item.arabicName }}</span><small>{{ safeArray(item.tags)[0] || 'Notice' }}</small><h3>{{ item.name }}</h3><p>{{ item.subtitle }}</p><footer><span>{{ readingTime(item) }}</span><i data-lucide="heart" class="is-favorite"></i></footer></article></div><div v-else class="library-pro-inline-empty"><i data-lucide="heart"></i><p>Aucune notice favorite pour le moment.</p></div></section>
                <section class="library-pro-personal-section"><div class="library-pro-section-heading"><div><span>Votre parcours</span><h2>Lectures récentes</h2></div></div><div v-if="recentItems.length" class="library-pro-recent-list"><button v-for="(item, index) in recentItems" :key="item.id" type="button" @click="openItem(item)"><span>{{ String(index + 1).padStart(2, '0') }}</span><div><small>{{ safeArray(item.tags)[0] || 'Notice' }}</small><b>{{ item.name }}</b><p>{{ item.subtitle }}</p></div><em>{{ readingTime(item) }}</em><i data-lucide="arrow-right"></i></button></div><div v-else class="library-pro-inline-empty"><i data-lucide="history"></i><p>Les notices ouvertes apparaîtront ici.</p></div></section>
            </div>
        </div>
    </section>
    `
};