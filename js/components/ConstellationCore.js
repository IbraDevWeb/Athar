// Athar Pro — lecteur thématique coranique, version sobre et structurée
window.ConstellationApp = {
    data() {
        const read = (key, fallback) => {
            try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
            catch (_) { return fallback; }
        };
        const dataSet = window.QURAN_CONSTELLATION_DATA;
        return {
            dataSet,
            mode: 'study',
            search: '',
            category: 'all',
            favoritesOnly: false,
            selectedId: dataSet.concepts[0]?.id || null,
            favorites: read('athar_constellation_favorites_v2', []),
            studied: read('athar_constellation_studied_v2', []),
            verseCache: read('athar_constellation_arabic_v1', {}),
            verseLoading: {},
            verseErrors: {},
            methodology: false,
            activePathId: null,
            pathStep: 0,
            toast: '',
            toastTimer: null,
            categoryGuides: {
                faith: {
                    question: 'Que révèle ce thème sur Dieu, la révélation et la manière de recevoir la vérité ?',
                    context: 'Les thèmes de foi ne sont pas de simples définitions abstraites. Le Coran les relie à la connaissance de Dieu, à la confiance, à la responsabilité et aux actes.',
                    caution: 'Distinguer ce que le texte affirme explicitement des constructions spéculatives ou des raccourcis théologiques.'
                },
                heart: {
                    question: 'Quel mouvement intérieur le passage décrit-il, et comment ce mouvement transforme-t-il les actes ?',
                    context: 'Le cœur coranique est le lieu de la compréhension, de l’intention, de la maladie, du retour et de l’apaisement. Son état se manifeste dans la conduite.',
                    caution: 'Éviter de réduire les états du cœur à une émotion passagère ou à une formule de développement personnel.'
                },
                worship: {
                    question: 'Comment l’adoration relie-t-elle le geste, l’intention, le temps et la présence devant Dieu ?',
                    context: 'Les actes d’adoration structurent le rapport au temps, au corps, aux biens et à la communauté. Le Coran en rappelle à la fois la forme et la finalité.',
                    caution: 'Cette lecture thématique ne remplace pas l’étude juridique détaillée des conditions, piliers et règles de chaque adoration.'
                },
                ethics: {
                    question: 'Quelle qualité morale est demandée, dans quelle situation et avec quelles limites ?',
                    context: 'L’éthique coranique se déploie dans la parole, les contrats, les conflits, la famille et la vie publique. Elle associe vertu personnelle et justice concrète.',
                    caution: 'Un principe moral général doit être replacé dans le passage complet et articulé aux droits réels des personnes concernées.'
                },
                society: {
                    question: 'Quels droits, devoirs et équilibres collectifs le passage cherche-t-il à protéger ?',
                    context: 'La vie collective est abordée à travers la solidarité, la justice, les responsabilités familiales, la circulation des biens et la protection des vulnérables.',
                    caution: 'Ne pas transformer un repère thématique en règle juridique isolée sans étudier son contexte et les commentaires spécialisés.'
                },
                destiny: {
                    question: 'Comment le passage éclaire-t-il l’épreuve, le temps, la mort et la responsabilité humaine ?',
                    context: 'Le Coran relie l’épreuve à la patience, au discernement, au retour vers Dieu et à l’horizon de la vie dernière, sans nier les causes ni l’action humaine.',
                    caution: 'Éviter les lectures fatalistes : la foi au décret n’annule ni le choix, ni l’effort, ni la recherche de justice.'
                }
            }
        };
    },
    computed: {
        categories() {
            return Object.entries(this.dataSet.categories).map(([id, item]) => ({ id, ...item }));
        },
        conceptMap() {
            return new Map(this.dataSet.concepts.map(item => [item.id, item]));
        },
        selected() {
            return this.conceptMap.get(this.selectedId) || this.filtered[0] || this.dataSet.concepts[0] || null;
        },
        selectedCategory() {
            return this.selected ? this.dataSet.categories[this.selected.category] : null;
        },
        guide() {
            return this.selected ? this.categoryGuides[this.selected.category] : null;
        },
        activePath() {
            return this.dataSet.paths.find(item => item.id === this.activePathId) || null;
        },
        pathConcept() {
            return this.activePath ? this.conceptMap.get(this.activePath.concepts[this.pathStep]) : null;
        },
        filtered() {
            const q = this.normalize(this.search);
            return this.dataSet.concepts.filter(item => {
                if (this.category !== 'all' && item.category !== this.category) return false;
                if (this.favoritesOnly && !this.favorites.includes(item.id)) return false;
                if (!q) return true;
                return this.normalize([item.title, item.arabic, item.summary, item.key, ...item.tags, ...item.verses].join(' ')).includes(q);
            });
        },
        groupedConcepts() {
            return this.categories.map(cat => ({
                ...cat,
                concepts: this.filtered.filter(item => item.category === cat.id)
            })).filter(group => group.concepts.length);
        },
        related() {
            if (!this.selectedId) return [];
            return this.dataSet.links
                .filter(link => link.from === this.selectedId || link.to === this.selectedId)
                .map(link => ({
                    item: this.conceptMap.get(link.from === this.selectedId ? link.to : link.from),
                    label: link.label
                }))
                .filter(entry => entry.item)
                .slice(0, 8);
        },
        stats() {
            return {
                concepts: this.dataSet.concepts.length,
                refs: this.dataSet.concepts.reduce((sum, item) => sum + item.verses.length, 0),
                categories: Object.keys(this.dataSet.categories).length,
                paths: this.dataSet.paths.length
            };
        },
        progress() {
            return this.stats.concepts ? Math.round(this.studied.length * 100 / this.stats.concepts) : 0;
        },
        studyAxes() {
            if (!this.selected) return [];
            const tags = this.selected.tags || [];
            return [
                {
                    title: 'Définir avec précision',
                    text: `Comprendre « ${this.selected.title} » à partir des passages indiqués, sans l’isoler des notions de ${tags.slice(0, 2).join(' et ') || 'foi et responsabilité'}.`
                },
                {
                    title: 'Observer les effets',
                    text: `${this.selected.key} Rechercher comment cette idée agit sur l’intention, la parole, les choix et les relations.`
                },
                {
                    title: 'Comparer les passages',
                    text: 'Lire les références ensemble : chaque passage apporte un angle, une situation ou une conséquence différente du même thème.'
                }
            ];
        },
        studyQuestions() {
            if (!this.selected || !this.guide) return [];
            return [
                this.guide.question,
                `Quels mots, oppositions ou conséquences reviennent dans les versets associés à « ${this.selected.title} » ?`,
                `Comment distinguer une compréhension fidèle du texte d’une application trop rapide ou hors contexte ?`
            ];
        }
    },
    watch: {
        favorites: {
            deep: true,
            handler(value) { localStorage.setItem('athar_constellation_favorites_v2', JSON.stringify(value)); }
        },
        studied: {
            deep: true,
            handler(value) { localStorage.setItem('athar_constellation_studied_v2', JSON.stringify(value)); }
        },
        verseCache: {
            deep: true,
            handler(value) { localStorage.setItem('athar_constellation_arabic_v1', JSON.stringify(value)); }
        },
        filtered(value) {
            if (value.length && !value.some(item => item.id === this.selectedId)) this.selectConcept(value[0].id, false);
        }
    },
    methods: {
        normalize(value) {
            return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[ʿʾ]/g, '').toLowerCase();
        },
        color(item) {
            return this.dataSet.categories[item?.category || item]?.color || '#b38b3f';
        },
        isFavorite(id) { return this.favorites.includes(id); },
        isStudied(id) { return this.studied.includes(id); },
        notify(message) {
            this.toast = message;
            clearTimeout(this.toastTimer);
            this.toastTimer = setTimeout(() => { this.toast = ''; }, 2200);
        },
        toggleFavorite(id) {
            this.favorites = this.isFavorite(id) ? this.favorites.filter(item => item !== id) : [...this.favorites, id];
            this.notify(this.isFavorite(id) ? 'Ajouté aux favoris' : 'Retiré des favoris');
        },
        markStudied(id) {
            if (!this.isStudied(id)) this.studied = [...this.studied, id];
        },
        setMode(mode) {
            this.mode = mode;
            this.$nextTick(this.icons);
        },
        selectConcept(id, scroll = true) {
            if (!this.conceptMap.has(id)) return;
            this.selectedId = id;
            this.markStudied(id);
            this.loadArabicForSelected();
            if (scroll) this.$nextTick(() => this.$refs.reader?.scrollTo({ top: 0, behavior: 'smooth' }));
            this.icons();
        },
        openConcept(item) {
            this.setMode('study');
            this.$nextTick(() => this.selectConcept(typeof item === 'string' ? item : item.id));
        },
        resetFilters() {
            this.search = '';
            this.category = 'all';
            this.favoritesOnly = false;
        },
        random() {
            const pool = this.filtered.length ? this.filtered : this.dataSet.concepts;
            if (!pool.length) return;
            this.openConcept(pool[Math.floor(Math.random() * pool.length)]);
        },
        startPath(path) {
            this.activePathId = path.id;
            this.pathStep = 0;
            this.setMode('study');
            this.$nextTick(() => this.pathConcept && this.selectConcept(this.pathConcept.id));
        },
        stopPath() {
            this.activePathId = null;
            this.pathStep = 0;
        },
        goPath(index) {
            if (!this.activePath || index < 0 || index >= this.activePath.concepts.length) return;
            this.pathStep = index;
            const concept = this.pathConcept;
            if (concept) this.openConcept(concept);
        },
        previousPath() { this.goPath(this.pathStep - 1); },
        nextPath() { this.goPath(this.pathStep + 1); },
        verseText(reference) {
            return this.verseCache[reference] || '';
        },
        async fetchArabicVerse(reference) {
            if (this.verseCache[reference] || this.verseLoading[reference]) return;
            this.verseLoading = { ...this.verseLoading, [reference]: true };
            this.verseErrors = { ...this.verseErrors, [reference]: false };
            try {
                const response = await fetch(`https://api.alquran.cloud/v1/ayah/${encodeURIComponent(reference)}/quran-uthmani`);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const payload = await response.json();
                const text = payload?.data?.text;
                if (!text) throw new Error('Texte arabe absent');
                this.verseCache = { ...this.verseCache, [reference]: text };
            } catch (error) {
                console.warn(`Verset ${reference} indisponible`, error);
                this.verseErrors = { ...this.verseErrors, [reference]: true };
            } finally {
                const next = { ...this.verseLoading };
                delete next[reference];
                this.verseLoading = next;
            }
        },
        loadArabicForSelected() {
            if (!this.selected) return;
            this.selected.verses.forEach(reference => this.fetchArabicVerse(reference));
        },
        verseNote(index) {
            if (!this.selected) return '';
            if (index === 0) return `Point d’entrée principal : observer comment ce passage présente ${this.selected.title.toLowerCase()} et à quelle réponse il appelle.`;
            if (index === 1) return `Élargissement du thème : comparer ce passage au premier afin d’identifier une autre situation, une autre conséquence ou un autre vocabulaire.`;
            return `Mise en perspective : replacer ce verset dans sa sourate et vérifier comment il complète l’idée centrale de la fiche.`;
        },
        async copyRef(reference) {
            try {
                await navigator.clipboard.writeText(reference);
                this.notify('Référence copiée');
            } catch (_) {
                this.notify('Copie indisponible');
            }
        },
        icons() {
            setTimeout(() => window.lucide?.createIcons(), 20);
        }
    },
    mounted() {
        this.markStudied(this.selectedId);
        this.loadArabicForSelected();
        this.icons();
    },
    beforeUnmount() {
        clearTimeout(this.toastTimer);
    }
};