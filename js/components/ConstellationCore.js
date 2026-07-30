// Athar Pro — moteur de la Constellation coranique
window.ConstellationApp = {
    data() {
        const read = (key, fallback) => {
            try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
            catch (_) { return fallback; }
        };
        return {
            dataSet: window.QURAN_CONSTELLATION_DATA,
            mode: 'network',
            search: '',
            category: 'all',
            favoritesOnly: false,
            selectedId: null,
            drawer: false,
            tab: 'overview',
            favorites: read('athar_constellation_favorites_v1', []),
            studied: read('athar_constellation_studied_v1', []),
            quizScore: read('athar_constellation_quiz_v1', { correct: 0, total: 0 }),
            quiz: null,
            quizAnswer: null,
            methodology: false,
            activePathId: null,
            pathStep: 0,
            toast: '',
            network: null,
            nodes: null,
            edges: null,
            toastTimer: null
        };
    },
    computed: {
        categories() { return Object.entries(this.dataSet.categories).map(([id, item]) => ({ id, ...item })); },
        conceptMap() { return new Map(this.dataSet.concepts.map(item => [item.id, item])); },
        selected() { return this.conceptMap.get(this.selectedId) || null; },
        activePath() { return this.dataSet.paths.find(item => item.id === this.activePathId) || null; },
        pathConcept() { return this.activePath ? this.conceptMap.get(this.activePath.concepts[this.pathStep]) : null; },
        filtered() {
            const q = this.search.trim().toLocaleLowerCase('fr');
            return this.dataSet.concepts.filter(item => {
                if (this.category !== 'all' && item.category !== this.category) return false;
                if (this.favoritesOnly && !this.favorites.includes(item.id)) return false;
                if (!q) return true;
                return [item.title, item.arabic, item.summary, item.key, ...item.tags, ...item.verses]
                    .join(' ').toLocaleLowerCase('fr').includes(q);
            });
        },
        filteredIds() { return new Set(this.filtered.map(item => item.id)); },
        visibleLinks() { return this.dataSet.links.filter(link => this.filteredIds.has(link.from) && this.filteredIds.has(link.to)); },
        related() {
            if (!this.selectedId) return [];
            return this.dataSet.links
                .filter(link => link.from === this.selectedId || link.to === this.selectedId)
                .map(link => ({ item: this.conceptMap.get(link.from === this.selectedId ? link.to : link.from), label: link.label }))
                .filter(entry => entry.item)
                .sort((a, b) => a.item.title.localeCompare(b.item.title, 'fr'));
        },
        stats() {
            return {
                concepts: this.dataSet.concepts.length,
                refs: this.dataSet.concepts.reduce((sum, item) => sum + item.verses.length, 0),
                links: this.dataSet.links.length,
                paths: this.dataSet.paths.length
            };
        },
        progress() { return this.stats.concepts ? Math.round(this.studied.length * 100 / this.stats.concepts) : 0; }
    },
    watch: {
        search() { this.refreshGraph(true); },
        category() { this.refreshGraph(true); },
        favoritesOnly() { this.refreshGraph(true); },
        favorites: { deep: true, handler(value) { localStorage.setItem('athar_constellation_favorites_v1', JSON.stringify(value)); } },
        studied: { deep: true, handler(value) { localStorage.setItem('athar_constellation_studied_v1', JSON.stringify(value)); } },
        quizScore: { deep: true, handler(value) { localStorage.setItem('athar_constellation_quiz_v1', JSON.stringify(value)); } }
    },
    methods: {
        color(item) { return this.dataSet.categories[item?.category || item]?.color || '#c5a059'; },
        isFavorite(id) { return this.favorites.includes(id); },
        isStudied(id) { return this.studied.includes(id); },
        notify(message) {
            this.toast = message;
            clearTimeout(this.toastTimer);
            this.toastTimer = setTimeout(() => { this.toast = ''; }, 2400);
        },
        toggleFavorite(id) {
            this.favorites = this.isFavorite(id) ? this.favorites.filter(item => item !== id) : [...this.favorites, id];
            this.notify(this.isFavorite(id) ? 'Ajouté aux favoris' : 'Retiré des favoris');
        },
        markStudied(id) { if (!this.isStudied(id)) this.studied = [...this.studied, id]; },
        degree(id) {
            return this.dataSet.links.reduce((sum, link) => sum + (link.from === id || link.to === id ? 1 : 0), 0);
        },
        pathHasLink(link) {
            if (!this.activePath) return false;
            return this.activePath.concepts.some((id, index, list) =>
                index < list.length - 1 &&
                ((id === link.from && list[index + 1] === link.to) || (id === link.to && list[index + 1] === link.from))
            );
        },
        nodeModel(item) {
            const inPath = this.activePath?.concepts.includes(item.id);
            const current = this.pathConcept?.id === item.id;
            const color = this.color(item);
            return {
                id: item.id,
                label: item.title,
                title: `${item.arabic}\n${item.summary}`,
                shape: 'dot',
                size: Math.min(23 + this.degree(item.id) * .65, 39),
                borderWidth: current ? 5 : inPath ? 4 : 2,
                opacity: this.activePath && !inPath ? .16 : 1,
                font: { face: 'Inter', size: inPath ? 15 : 13, color: '#f8fafc', strokeWidth: 4, strokeColor: 'rgba(6,8,15,.82)' },
                color: {
                    background: current ? '#fff' : color,
                    border: current ? color : 'rgba(255,255,255,.9)',
                    highlight: { background: '#fff', border: color },
                    hover: { background: color, border: '#fff' }
                },
                shadow: { enabled: true, color: `${color}66`, size: inPath ? 24 : 14, x: 0, y: 4 }
            };
        },
        edgeModel(link, index) {
            const active = this.pathHasLink(link);
            return {
                id: `c-edge-${index}`,
                from: link.from,
                to: link.to,
                label: active ? link.label : '',
                width: active ? 4 : 1,
                hidden: this.activePath ? !active : false,
                dashes: active ? [8, 7] : false,
                color: active
                    ? { color: this.activePath.color, highlight: this.activePath.color, hover: this.activePath.color }
                    : { color: 'rgba(148,163,184,.22)', highlight: '#c5a059', hover: '#c5a059' },
                smooth: { type: 'continuous', roundness: .35 },
                font: { face: 'Inter', size: 9, color: '#e2e8f0', background: 'rgba(7,9,16,.82)', strokeWidth: 0 }
            };
        },
        initGraph() {
            const element = this.$refs.network;
            if (!element || !window.vis) return;
            if (this.network) this.network.destroy();
            this.nodes = new vis.DataSet();
            this.edges = new vis.DataSet();
            this.network = new vis.Network(element, { nodes: this.nodes, edges: this.edges }, {
                autoResize: true,
                layout: { improvedLayout: true, randomSeed: 23 },
                interaction: { hover: true, tooltipDelay: 170, navigationButtons: true, keyboard: { enabled: true, bindToWindow: false } },
                physics: {
                    stabilization: { iterations: 220, fit: true },
                    barnesHut: { gravitationalConstant: -24000, centralGravity: .22, springLength: 135, springConstant: .035, damping: .28, avoidOverlap: .65 }
                }
            });
            this.network.on('click', params => { if (params.nodes.length) this.select(params.nodes[0], false); });
            this.network.on('doubleClick', params => { if (params.nodes.length) this.open(params.nodes[0]); });
            this.network.once('stabilizationIterationsDone', () => {
                this.network.setOptions({ physics: false });
                this.network.fit({ animation: { duration: 480, easingFunction: 'easeInOutQuad' } });
            });
            this.refreshGraph(false);
        },
        refreshGraph(fit = false) {
            if (!this.network || !this.nodes || !this.edges) return;
            this.nodes.clear();
            this.edges.clear();
            this.nodes.add(this.filtered.map(item => this.nodeModel(item)));
            this.edges.add(this.visibleLinks.map((item, index) => this.edgeModel(item, index)));
            if (fit && this.filtered.length) setTimeout(() => this.network?.fit({ animation: { duration: 430, easingFunction: 'easeInOutQuad' } }), 30);
        },
        select(id, openDrawer = true) {
            if (!this.conceptMap.has(id)) return;
            this.selectedId = id;
            this.markStudied(id);
            if (this.network && this.filteredIds.has(id)) {
                this.network.selectNodes([id]);
                this.network.focus(id, { scale: 1.25, animation: { duration: 500, easingFunction: 'easeInOutQuad' } });
            }
            if (openDrawer) {
                this.tab = 'overview';
                this.drawer = true;
            }
            this.icons();
        },
        open(item) { this.select(typeof item === 'string' ? item : item.id, true); },
        closeDrawer() { this.drawer = false; },
        setMode(mode) {
            this.mode = mode;
            this.$nextTick(() => {
                if (mode === 'network') {
                    if (!this.network) this.initGraph();
                    else { this.network.redraw(); this.refreshGraph(true); }
                }
                this.icons();
            });
        },
        resetFilters() { this.search = ''; this.category = 'all'; this.favoritesOnly = false; },
        random() {
            const pool = this.filtered.length ? this.filtered : this.dataSet.concepts;
            if (!pool.length) return;
            this.setMode('network');
            this.$nextTick(() => this.open(pool[Math.floor(Math.random() * pool.length)]));
        },
        startPath(path) {
            this.activePathId = path.id;
            this.pathStep = 0;
            this.resetFilters();
            this.setMode('network');
            this.$nextTick(() => { this.refreshGraph(false); if (this.pathConcept) this.open(this.pathConcept); });
        },
        stopPath() { this.activePathId = null; this.pathStep = 0; this.refreshGraph(true); },
        goPath(index) {
            if (!this.activePath || index < 0 || index >= this.activePath.concepts.length) return;
            this.pathStep = index;
            this.refreshGraph(false);
            this.$nextTick(() => this.pathConcept && this.open(this.pathConcept));
        },
        previousPath() { this.goPath(this.pathStep - 1); },
        nextPath() { this.goPath(this.pathStep + 1); },
        startQuiz() {
            const answer = this.dataSet.concepts[Math.floor(Math.random() * this.dataSet.concepts.length)];
            const useRef = Math.random() > .5;
            const options = [...this.dataSet.concepts.filter(item => item.id !== answer.id).sort(() => Math.random() - .5).slice(0, 3), answer]
                .sort(() => Math.random() - .5);
            this.quiz = {
                answer,
                options,
                eyebrow: useRef ? 'Repère coranique' : 'Définition',
                prompt: useRef ? `Quel concept est relié à ${answer.verses[Math.floor(Math.random() * answer.verses.length)]} ?` : answer.summary
            };
            this.quizAnswer = null;
            this.icons();
        },
        answerQuiz(option) {
            if (this.quizAnswer) return;
            this.quizAnswer = option;
            this.quizScore = {
                correct: this.quizScore.correct + (option.id === this.quiz.answer.id ? 1 : 0),
                total: this.quizScore.total + 1
            };
        },
        closeQuiz() { this.quiz = null; this.quizAnswer = null; },
        async copyRef(ref) {
            try { await navigator.clipboard.writeText(ref); this.notify('Référence copiée'); }
            catch (_) { this.notify('Copie indisponible'); }
        },
        icons() { setTimeout(() => window.lucide?.createIcons(), 30); }
    },
    mounted() { this.$nextTick(() => { this.initGraph(); this.icons(); }); },
    beforeUnmount() { clearTimeout(this.toastTimer); this.network?.destroy(); this.network = null; }
};
