const GlossaryView = {
    props: ['glossary', 'searchQuery'],
    emits: ['update:searchQuery'],
    setup(props) {
        const category = Vue.ref('Tous');
        const visibleLimit = Vue.ref(24);
        // Classement de navigation uniquement, construit à partir des libellés du lexique.
        const categoryOf = item => {
            const origin = String(item?.origin || '').toLocaleLowerCase('fr');
            if (/lieu|ville|géograph|empire|région|route/.test(origin)) return 'Lieux';
            if (/personnage|compagnon|tribu|famille|lignée|dynastie|généalogie|surnom|titre|groupe/.test(origin)) return 'Figures & peuples';
            if (/bataille|expédition|histoire|événement|calendrier/.test(origin)) return 'Histoire';
            if (/fiqh|oussoul|hadith|coran|épistémologie|logique|méthodologie|langue|source|école|croyance|aqida|théologie|concept|science|méthode/.test(origin)) return 'Savoirs';
            return 'Autres';
        };
        const categories = ['Tous', 'Savoirs', 'Lieux', 'Figures & peuples', 'Histoire', 'Autres'];
        const counts = Vue.computed(() => {
            const all = Array.isArray(props.glossary) ? props.glossary : [];
            return Object.fromEntries(categories.map(name => [
                name, name === 'Tous' ? all.length : all.filter(item => categoryOf(item) === name).length
            ]));
        });
        const filtered = Vue.computed(() => {
            const items = Array.isArray(props.glossary) ? props.glossary : [];
            return category.value === 'Tous' ? items : items.filter(item => categoryOf(item) === category.value);
        });
        const displayed = Vue.computed(() => filtered.value.slice(0, visibleLimit.value));
        const loadMore = () => { visibleLimit.value += 24; Vue.nextTick(() => window.lucide?.createIcons()); };
        Vue.watch([category, () => props.searchQuery], () => {
            visibleLimit.value = 24;
            Vue.nextTick(() => window.lucide?.createIcons());
        });
        return { category, categories, counts, displayed, filtered, visibleLimit, loadMore, categoryOf };
    },
    template: `
    <section class="glossary-pro-root">
        <div class="glossary-pro-container">
            <header class="glossary-pro-hero">
                <span class="glossary-pro-kicker"><i data-lucide="book-a" aria-hidden="true"></i> Lexique & définitions</span>
                <h1>Termes & Lieux</h1>
                <p>Retrouver les batailles, les peuples, les lieux et les notions rencontrées dans les récits.</p>
                <label class="glossary-pro-search">
                    <i data-lucide="search" aria-hidden="true"></i>
                    <input type="search" :value="searchQuery" @input="$emit('update:searchQuery', $event.target.value)"
                        aria-label="Rechercher un terme" placeholder="Rechercher une définition…" autocomplete="off">
                </label>
                <div class="glossary-pro-categories" role="group" aria-label="Explorer les termes par thème">
                    <button v-for="name in categories" :key="name" type="button"
                        :class="{ active: category===name }" :aria-pressed="category===name"
                        @click="category=name">
                        {{ name }} <span>{{ counts[name] }}</span>
                    </button>
                </div>
            </header>
            <p class="glossary-pro-result" aria-live="polite">{{ filtered.length }} terme{{ filtered.length>1?'s':'' }}</p>
            <div v-if="displayed.length" class="glossary-pro-grid">
                <article v-for="(item,index) in displayed" :key="item.term || index" class="glossary-pro-card">
                    <header>
                        <span class="glossary-pro-card-icon"><i data-lucide="book-text" aria-hidden="true"></i></span>
                        <span class="glossary-pro-card-origin">{{ item.origin || 'Terme' }}</span>
                    </header>
                    <h2>{{ item.term }}</h2>
                    <p>{{ item.def }}</p>
                    <footer><span>{{ categoryOf(item) }}</span></footer>
                </article>
            </div>
            <div v-if="filtered.length>visibleLimit" class="glossary-pro-more">
                <span>{{ displayed.length }} termes affichés sur {{ filtered.length }}</span>
                <button type="button" @click="loadMore">Afficher plus de termes <i data-lucide="chevron-down" aria-hidden="true"></i></button>
            </div>
            <div v-if="!filtered.length" class="glossary-pro-empty" role="status">
                <i data-lucide="search-x" aria-hidden="true"></i>
                <h2>Aucun terme trouvé</h2>
                <p>Essaie un autre mot ou sélectionne une autre catégorie.</p>
                <button type="button" @click="category='Tous'; $emit('update:searchQuery', '')">Tout afficher</button>
            </div>
        </div>
    </section>
    `
};
