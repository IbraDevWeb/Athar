const HadithsView = {
    props: ['hadiths', 'searchQuery', 'openHadith'],
    setup(props) {
        const STORAGE_KEY = 'athar_hadith_v2';
        const mode = Vue.ref('library');
        const query = Vue.ref('');
        const themeFilter = Vue.ref('Tous');
        const collectionFilter = Vue.ref('Toutes');
        const gradeFilter = Vue.ref('Tous');
        const favoritesOnly = Vue.ref(false);
        const unreadOnly = Vue.ref(false);
        const compact = Vue.ref(false);
        const state = Vue.reactive({ favorites: [], read: {}, recent: [] });

        const themeRules = [
            { label: 'Foi & intention', icon: 'sparkles', keywords: ['foi', 'croire', 'allah', 'intention', 'sincérité', 'unicité', 'islam', 'croyant'] },
            { label: 'Adoration', icon: 'moon-star', keywords: ['prière', 'jeûne', 'aumône', 'hajj', 'invocation', 'dhikr', 'adoration', 'ablution', 'mosquée'] },
            { label: 'Cœur & spiritualité', icon: 'heart', keywords: ['cœur', 'repentir', 'pardon', 'miséricorde', 'patience', 'espoir', 'crainte', 'âme', 'piété'] },
            { label: 'Éthique & caractère', icon: 'gem', keywords: ['caractère', 'douceur', 'colère', 'mensonge', 'vérité', 'modestie', 'générosité', 'bienveillance', 'orgueil'] },
            { label: 'Relations & famille', icon: 'users', keywords: ['frère', 'parents', 'famille', 'épouse', 'voisin', 'amour', 'fraternité', 'enfant', 'proche'] },
            { label: 'Savoir & transmission', icon: 'book-open', keywords: ['science', 'savoir', 'enseigner', 'apprendre', 'transmettre', 'savants', 'connaissance', 'coran', 'sunna'] },
            { label: 'Société & justice', icon: 'scale', keywords: ['justice', 'juge', 'responsabilité', 'communauté', 'autorité', 'injustice', 'droit', 'témoignage', 'musulmans'] },
            { label: 'Commerce & biens', icon: 'coins', keywords: ['vente', 'acheter', 'dette', 'argent', 'commerce', 'prêter', 'bien', 'richesse', 'marchandise'] },
            { label: 'Épreuves & au-delà', icon: 'hourglass', keywords: ['mort', 'résurrection', 'paradis', 'enfer', 'épreuve', 'maladie', 'jour dernier', 'tombe', 'jugement'] }
        ];

        const normalize = value => String(value || '').toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();
        const clean = value => String(value || '').replace(/\r/g, '').replace(/\n{3,}/g, '\n\n').trim();
        const uidOf = item => String(item?.id || item?.title || 'hadith');

        const collectionOf = item => {
            const text = normalize(`${item.id || ''} ${item.attribution || ''}`);
            const matches = [];
            if (/bukhari|bukhârî/.test(text)) matches.push('Al-Bukhārī');
            if (/muslim/.test(text)) matches.push('Muslim');
            if (/abu daw|abû daw|abi daw/.test(text)) matches.push('Abū Dāwūd');
            if (/tirmidhi|tirmidhî/.test(text)) matches.push('Al-Tirmidhī');
            if (/nasa|nasâ/.test(text)) matches.push('Al-Nasāʾī');
            if (/ibn majah|ibn mâjah/.test(text)) matches.push('Ibn Mājah');
            if (/ahmad|aḥmad/.test(text)) matches.push('Aḥmad');
            if (matches.length > 1) return 'Sources multiples';
            return matches[0] || 'Autres recueils';
        };

        const narratorOf = item => {
            const intro = clean(item.hadeeth_intro || item.hadeeth || '');
            if (!intro) return 'Transmetteur non précisé';
            const cut = intro.split(/ relate | rapporte | a relaté | رضي الله عنه| رضي الله عنها/i)[0];
            return cut.replace(/^(d'après|selon)\s+/i, '').replace(/[,:؛]+$/g, '').trim() || 'Transmetteur non précisé';
        };

        const themeOf = item => {
            const haystack = normalize([item.title, item.hadeeth, item.explanation, ...(item.hints || [])].join(' '));
            let best = null;
            let bestScore = 0;
            themeRules.forEach(rule => {
                const score = rule.keywords.reduce((total, keyword) => total + (haystack.includes(normalize(keyword)) ? 1 : 0), 0);
                if (score > bestScore) { best = rule; bestScore = score; }
            });
            return best || { label: 'Repères prophétiques', icon: 'scroll-text' };
        };

        const readingTime = item => {
            const words = clean(`${item.hadeeth || ''} ${item.explanation || ''}`).split(/\s+/).filter(Boolean).length;
            return Math.max(2, Math.ceil(words / 180));
        };

        const load = () => {
            try {
                const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
                state.favorites = Array.isArray(saved.favorites) ? saved.favorites : [];
                state.read = saved.read && typeof saved.read === 'object' ? saved.read : {};
                state.recent = Array.isArray(saved.recent) ? saved.recent : [];
            } catch (_) {}
        };
        const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify({ favorites: state.favorites, read: state.read, recent: state.recent }));

        const enriched = Vue.computed(() => (props.hadiths || []).map(raw => {
            const uid = uidOf(raw);
            const theme = themeOf(raw);
            return {
                raw, uid, theme: theme.label, themeIcon: theme.icon,
                collection: collectionOf(raw), narrator: narratorOf(raw),
                grade: clean(raw.grade || 'Degré non indiqué'),
                read: Boolean(state.read[uid]), favorite: state.favorites.includes(uid),
                minutes: readingTime(raw)
            };
        }));

        const themes = Vue.computed(() => {
            const counts = new Map();
            enriched.value.forEach(item => counts.set(item.theme, (counts.get(item.theme) || 0) + 1));
            return [...counts.entries()].map(([label, count]) => ({
                label, count, icon: themeRules.find(rule => rule.label === label)?.icon || 'scroll-text'
            })).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
        });

        const collections = Vue.computed(() => [...new Set(enriched.value.map(item => item.collection))].sort((a, b) => a.localeCompare(b)));
        const grades = Vue.computed(() => [...new Set(enriched.value.map(item => item.grade))].sort((a, b) => a.localeCompare(b)));

        const filtered = Vue.computed(() => {
            const q = normalize(`${props.searchQuery || ''} ${query.value}`);
            return enriched.value.filter(item => {
                const raw = item.raw;
                const haystack = normalize([raw.title, raw.hadeeth, raw.hadeeth_ar, raw.hadeeth_intro, raw.explanation, raw.attribution, item.narrator, item.theme, item.collection, ...(raw.hints || [])].join(' '));
                return (!q || haystack.includes(q))
                    && (themeFilter.value === 'Tous' || item.theme === themeFilter.value)
                    && (collectionFilter.value === 'Toutes' || item.collection === collectionFilter.value)
                    && (gradeFilter.value === 'Tous' || item.grade === gradeFilter.value)
                    && (!favoritesOnly.value || item.favorite)
                    && (!unreadOnly.value || !item.read);
            });
        });

        const stats = Vue.computed(() => ({
            total: enriched.value.length,
            read: enriched.value.filter(item => item.read).length,
            favorites: enriched.value.filter(item => item.favorite).length,
            collections: collections.value.length
        }));

        const pathways = Vue.computed(() => [
            { id: 'foundations', title: 'Fondements de la foi', subtitle: 'Intention, foi et sincérité', icon: 'sparkles', themes: ['Foi & intention'] },
            { id: 'heart', title: 'Éduquer le cœur', subtitle: 'Miséricorde, patience et repentir', icon: 'heart', themes: ['Cœur & spiritualité'] },
            { id: 'worship', title: 'Vivre l’adoration', subtitle: 'Des actes au sens spirituel', icon: 'moon-star', themes: ['Adoration'] },
            { id: 'character', title: 'Le caractère prophétique', subtitle: 'Douceur, vérité et maîtrise de soi', icon: 'gem', themes: ['Éthique & caractère'] },
            { id: 'relations', title: 'Relations et fraternité', subtitle: 'Famille, proches et vie commune', icon: 'users', themes: ['Relations & famille'] },
            { id: 'society', title: 'Justice et responsabilité', subtitle: 'Biens, droits et société', icon: 'scale', themes: ['Société & justice', 'Commerce & biens'] }
        ].map(path => ({ ...path, items: enriched.value.filter(item => path.themes.includes(item.theme)).slice(0, 6) })).filter(path => path.items.length));

        const recentItems = Vue.computed(() => state.recent.map(id => enriched.value.find(item => item.uid === id)).filter(Boolean).slice(0, 8));
        const favoriteItems = Vue.computed(() => enriched.value.filter(item => item.favorite).slice(0, 8));
        const weekly = Vue.computed(() => {
            const result = [];
            for (let offset = 6; offset >= 0; offset--) {
                const day = new Date(); day.setHours(0, 0, 0, 0); day.setDate(day.getDate() - offset);
                const key = day.toISOString().slice(0, 10);
                const count = Object.values(state.read).filter(value => String(value).slice(0, 10) === key).length;
                result.push({ key, label: day.toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', ''), count });
            }
            return result;
        });
        const weeklyMax = Vue.computed(() => Math.max(1, ...weekly.value.map(day => day.count)));

        const open = item => {
            state.read[item.uid] = new Date().toISOString();
            state.recent = [item.uid, ...state.recent.filter(id => id !== item.uid)].slice(0, 30);
            save();
            props.openHadith(item.raw);
        };
        const toggleFavorite = (item, event) => {
            event?.stopPropagation();
            state.favorites = item.favorite ? state.favorites.filter(id => id !== item.uid) : [...state.favorites, item.uid];
            save();
        };
        const chooseTheme = label => { themeFilter.value = label; mode.value = 'library'; };
        const startPath = path => path.items[0] && open(path.items[0]);
        const random = () => {
            const list = filtered.value.length ? filtered.value : enriched.value;
            if (list.length) open(list[Math.floor(Math.random() * list.length)]);
        };
        const resetFilters = () => {
            query.value = ''; themeFilter.value = 'Tous'; collectionFilter.value = 'Toutes'; gradeFilter.value = 'Tous'; favoritesOnly.value = false; unreadOnly.value = false;
        };
        const refreshIcons = () => setTimeout(() => window.lucide?.createIcons(), 30);

        Vue.onMounted(() => { load(); refreshIcons(); });
        Vue.watch([mode, query, themeFilter, collectionFilter, gradeFilter, favoritesOnly, unreadOnly, compact], refreshIcons);

        return {
            mode, query, themeFilter, collectionFilter, gradeFilter, favoritesOnly, unreadOnly, compact,
            filtered, themes, collections, grades, stats, pathways, recentItems, favoriteItems, weekly, weeklyMax,
            open, toggleFavorite, chooseTheme, startPath, random, resetFilters, clean
        };
    },
    template: `
    <div class="hadith-pro-root">
        <section class="hadith-pro-hero">
            <div class="hadith-pro-hero-copy">
                <span class="hadith-pro-kicker"><i data-lucide="scroll-text"></i> Corpus d'étude</span>
                <p class="hadith-pro-arabic-title" lang="ar" dir="rtl">الحديث النبوي</p>
                <h1>Bibliothèque des Hadiths</h1>
                <p>Lire le texte, identifier sa transmission, comprendre son explication et transformer ses enseignements en questions d'étude.</p>
                <div class="hadith-pro-method"><i data-lucide="shield-check"></i><span>Le degré affiché est celui indiqué dans les données. Il qualifie la transmission rapportée, pas chaque commentaire pédagogique.</span></div>
            </div>
            <div class="hadith-pro-stats">
                <article><b>{{ stats.total }}</b><span>textes</span></article>
                <article><b>{{ stats.read }}</b><span>étudiés</span></article>
                <article><b>{{ stats.favorites }}</b><span>favoris</span></article>
                <article><b>{{ stats.collections }}</b><span>collections</span></article>
            </div>
        </section>

        <nav class="hadith-pro-tabs" aria-label="Navigation Hadiths">
            <button v-for="tab in [{id:'library',label:'Bibliothèque',icon:'library'},{id:'themes',label:'Thèmes',icon:'layout-grid'},{id:'paths',label:'Parcours',icon:'route'},{id:'progress',label:'Progression',icon:'chart-no-axes-column-increasing'}]" :key="tab.id" @click="mode=tab.id" :class="{active:mode===tab.id}"><i :data-lucide="tab.icon"></i><span>{{ tab.label }}</span></button>
        </nav>

        <section v-if="mode==='library'" class="hadith-pro-library">
            <div class="hadith-pro-toolbar">
                <label class="hadith-pro-search"><i data-lucide="search"></i><input v-model="query" type="search" placeholder="Rechercher en français, arabe, par narrateur ou source…"></label>
                <select v-model="themeFilter" aria-label="Filtrer par thème"><option>Tous</option><option v-for="theme in themes" :key="theme.label">{{ theme.label }}</option></select>
                <select v-model="collectionFilter" aria-label="Filtrer par collection"><option>Toutes</option><option v-for="collection in collections" :key="collection">{{ collection }}</option></select>
                <select v-model="gradeFilter" aria-label="Filtrer par degré"><option>Tous</option><option v-for="grade in grades" :key="grade">{{ grade }}</option></select>
                <button @click="favoritesOnly=!favoritesOnly" :class="{active:favoritesOnly}" title="Favoris"><i data-lucide="heart"></i></button>
                <button @click="unreadOnly=!unreadOnly" :class="{active:unreadOnly}" title="Non lus"><i data-lucide="book-dashed"></i></button>
                <button @click="compact=!compact" :class="{active:compact}" title="Affichage compact"><i data-lucide="rows-3"></i></button>
                <button @click="random" title="Découverte aléatoire"><i data-lucide="shuffle"></i></button>
            </div>

            <div class="hadith-pro-resultbar"><span><b>{{ filtered.length }}</b> hadith{{ filtered.length>1?'s':'' }}</span><button @click="resetFilters"><i data-lucide="rotate-ccw"></i> Réinitialiser</button></div>

            <div v-if="filtered.length" :class="['hadith-pro-grid', {compact}]">
                <article v-for="item in filtered" :key="item.uid" class="hadith-pro-card" :class="{read:item.read}" @click="open(item)" @keydown.enter.prevent="open(item)" tabindex="0">
                    <header>
                        <span class="hadith-pro-theme"><i :data-lucide="item.themeIcon"></i>{{ item.theme }}</span>
                        <button @click="toggleFavorite(item,$event)" :class="{active:item.favorite}" :aria-label="item.favorite?'Retirer des favoris':'Ajouter aux favoris'"><i data-lucide="heart"></i></button>
                    </header>
                    <div class="hadith-pro-card-meta"><span>{{ item.collection }}</span><span>{{ item.grade }}</span><span>{{ item.minutes }} min</span></div>
                    <h2>{{ item.raw.title }}</h2>
                    <p class="hadith-pro-card-ar" lang="ar" dir="rtl">{{ item.raw.hadeeth_ar }}</p>
                    <p class="hadith-pro-card-fr">{{ clean(item.raw.hadeeth) }}</p>
                    <footer><span><i data-lucide="user-round"></i>{{ item.narrator }}</span><span class="hadith-pro-open">Étudier <i data-lucide="arrow-right"></i></span></footer>
                </article>
            </div>
            <div v-else class="hadith-pro-empty"><i data-lucide="search-x"></i><h2>Aucun résultat</h2><p>Élargis les filtres ou réinitialise la recherche.</p><button @click="resetFilters">Afficher tout le corpus</button></div>
        </section>

        <section v-else-if="mode==='themes'" class="hadith-pro-themes-view">
            <div class="hadith-pro-section-head"><div><span>Cartographie éditoriale</span><h2>Explorer par grands thèmes</h2></div><p>Ce classement facilite l'étude. Il est produit à partir des mots et explications disponibles et ne remplace pas les chapitres des recueils originaux.</p></div>
            <div class="hadith-pro-theme-grid">
                <button v-for="theme in themes" :key="theme.label" @click="chooseTheme(theme.label)"><i :data-lucide="theme.icon"></i><span><b>{{ theme.label }}</b><small>{{ theme.count }} textes</small></span><i data-lucide="arrow-up-right"></i></button>
            </div>
        </section>

        <section v-else-if="mode==='paths'" class="hadith-pro-paths-view">
            <div class="hadith-pro-section-head"><div><span>Étude guidée</span><h2>Parcours thématiques</h2></div><p>Chaque parcours sélectionne quelques textes pour avancer de la lecture vers l'explication et la mise en pratique.</p></div>
            <div class="hadith-pro-path-grid">
                <article v-for="path in pathways" :key="path.id">
                    <div class="hadith-pro-path-icon"><i :data-lucide="path.icon"></i></div>
                    <span>{{ path.items.length }} étapes</span><h2>{{ path.title }}</h2><p>{{ path.subtitle }}</p>
                    <ol><li v-for="(item,index) in path.items.slice(0,4)" :key="item.uid"><b>{{ index+1 }}</b><span>{{ item.raw.title }}</span></li></ol>
                    <button @click="startPath(path)">Commencer le parcours <i data-lucide="arrow-right"></i></button>
                </article>
            </div>
        </section>

        <section v-else class="hadith-pro-progress-view">
            <div class="hadith-pro-section-head"><div><span>Suivi local</span><h2>Ta progression d'étude</h2></div><p>Les lectures et favoris sont conservés uniquement dans ce navigateur.</p></div>
            <div class="hadith-pro-progress-stats"><article><i data-lucide="book-check"></i><b>{{ stats.read }}</b><span>hadiths étudiés</span></article><article><i data-lucide="heart"></i><b>{{ stats.favorites }}</b><span>favoris</span></article><article><i data-lucide="layers-3"></i><b>{{ stats.total ? Math.round(stats.read/stats.total*100) : 0 }}%</b><span>du corpus parcouru</span></article></div>
            <div class="hadith-pro-progress-layout">
                <article class="hadith-pro-week"><header><h3>Sept derniers jours</h3><span>Hadiths ouverts</span></header><div class="hadith-pro-bars"><div v-for="day in weekly" :key="day.key"><span>{{ day.count }}</span><i :style="{height:Math.max(5,day.count/weeklyMax*100)+'%'}"></i><small>{{ day.label }}</small></div></div></article>
                <article class="hadith-pro-recent"><header><h3>Lectures récentes</h3><span>{{ recentItems.length }}</span></header><button v-for="item in recentItems" :key="item.uid" @click="open(item)"><span><b>{{ item.raw.title }}</b><small>{{ item.collection }} · {{ item.grade }}</small></span><i data-lucide="arrow-right"></i></button><p v-if="!recentItems.length">Aucune lecture enregistrée pour le moment.</p></article>
            </div>
            <article class="hadith-pro-favorites" v-if="favoriteItems.length"><header><h3>À reprendre</h3><span>Favoris</span></header><div><button v-for="item in favoriteItems" :key="item.uid" @click="open(item)"><i data-lucide="heart"></i><span>{{ item.raw.title }}</span></button></div></article>
        </section>
    </div>
    `
};