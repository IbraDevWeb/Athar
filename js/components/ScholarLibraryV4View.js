// Athar — Bibliothèque Savante V4
// Interface volontairement simple : API V4 réelle ou erreur explicite. Aucun faux fallback local.
window.ScholarLibraryV4View = {
    name: 'ScholarLibraryV4View',
    props: ['settings', 'setView'],
    setup(props) {
        const { ref, computed, onMounted, nextTick } = Vue;

        const DEFAULT_ORIGIN = 'https://athar-rag-ibradevweb.onrender.com';
        const REMOTE_CONFIG = 'rag/remote.json';
        const REQUEST_TIMEOUT_MS = 120000;

        const mode = ref('ask');
        const query = ref('');
        const madhhab = ref('');
        const discipline = ref('');
        const loading = ref(false);
        const waking = ref(false);
        const error = ref('');
        const response = ref(null);
        const selectedSourceId = ref('');
        const apiOrigin = ref('');
        const status = ref({ connected: false, books: 0, chunks: 0, substantive_passages: 0, fts_ready: false });
        const books = ref([]);
        const booksLoading = ref(false);

        const examples = [
            'Que dit Sahih al-Bukhari sur les intentions ?',
            'Que dit le Tafsir Ibn Kathir sur Ayat al-Kursi ?',
            'Que rapporte Sunan al-Tirmidhi sur la prière du witr ?',
            "Que trouve-t-on dans la Sira d'Ibn Hisham concernant la bataille de Badr ?"
        ];

        const madhhabs = [
            { value: '', label: 'Toutes les écoles' },
            { value: 'Mālikite', label: 'Mālikite prioritaire' },
            { value: 'Ḥanafite', label: 'Ḥanafite prioritaire' },
            { value: 'Shāfiʿite', label: 'Shāfiʿite prioritaire' },
            { value: 'Ḥanbalite', label: 'Ḥanbalite prioritaire' }
        ];

        const disciplines = ['', 'Fiqh', 'Hadith', 'Tafsir', 'Sira', 'Usul'];
        const sources = computed(() => response.value?.sources || []);
        const answer = computed(() => response.value?.answer || null);
        const analysis = computed(() => response.value?.analysis || null);
        const routedBook = computed(() => analysis.value?.routed_book || null);
        const selectedSource = computed(() => sources.value.find(item => item.citation_id === selectedSourceId.value) || sources.value[0] || null);
        const substantiveRatio = computed(() => {
            const total = Number(status.value.chunks || 0);
            return total ? Math.round(Number(status.value.substantive_passages || 0) * 100 / total) : 0;
        });

        const validOrigin = value => {
            try {
                const url = new URL(String(value || ''));
                if (url.protocol !== 'https:') return '';
                return url.origin;
            } catch (_) {
                return '';
            }
        };

        const resolveOrigin = async () => {
            if (apiOrigin.value) return apiOrigin.value;
            try {
                const url = new URL(REMOTE_CONFIG, window.location.href);
                url.searchParams.set('v', 'rag-v4');
                const request = await window.fetch(url.href, { cache: 'no-store', headers: { Accept: 'application/json' } });
                if (request.ok) {
                    const payload = await request.json();
                    const configured = validOrigin(payload?.origin);
                    if (configured) {
                        apiOrigin.value = configured;
                        return configured;
                    }
                }
            } catch (_) {}
            apiOrigin.value = DEFAULT_ORIGIN;
            return DEFAULT_ORIGIN;
        };

        const apiFetch = async (path, options = {}, timeoutMs = REQUEST_TIMEOUT_MS) => {
            const origin = await resolveOrigin();
            const controller = new AbortController();
            const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
            try {
                return await window.fetch(`${origin}${path}`, {
                    cache: 'no-store',
                    ...options,
                    signal: controller.signal,
                    headers: {
                        Accept: 'application/json',
                        ...(options.body ? { 'Content-Type': 'application/json; charset=utf-8' } : {}),
                        ...(options.headers || {})
                    }
                });
            } finally {
                window.clearTimeout(timeout);
            }
        };

        const connect = async () => {
            waking.value = true;
            error.value = '';
            try {
                const health = await apiFetch('/healthz', {}, 90000);
                if (!health.ok) throw new Error(`HTTP ${health.status}`);
                const healthPayload = await health.json();
                if (healthPayload?.server !== 'athar-rag-v4' || Number(healthPayload?.api_version) !== 4) {
                    throw new Error('Le serveur actif n’est pas la Bibliothèque V4.');
                }

                const request = await apiFetch('/api/rag/v4/status');
                if (!request.ok) throw new Error(`HTTP ${request.status}`);
                const payload = await request.json();
                if (!payload?.ok || payload?.server !== 'athar-rag-v4') throw new Error(payload?.error || 'Statut V4 invalide.');
                status.value = { ...payload, connected: true };
            } catch (connectionError) {
                status.value = { connected: false, books: 0, chunks: 0, substantive_passages: 0, fts_ready: false };
                error.value = connectionError?.name === 'AbortError'
                    ? 'La bibliothèque met trop de temps à se réveiller. Réessaie dans quelques instants.'
                    : `Bibliothèque momentanément indisponible : ${connectionError?.message || 'connexion impossible'}`;
            } finally {
                waking.value = false;
            }
        };

        const ask = async () => {
            const value = query.value.trim();
            if (loading.value || value.length < 3) return;
            loading.value = true;
            error.value = '';
            response.value = null;
            selectedSourceId.value = '';
            try {
                const request = await apiFetch('/api/rag/v4/ask', {
                    method: 'POST',
                    body: JSON.stringify({
                        query: value,
                        limit: 8,
                        madhhab: madhhab.value,
                        discipline: discipline.value
                    })
                });
                const payload = await request.json().catch(() => ({}));
                if (!request.ok || !payload?.ok) throw new Error(payload?.error || `HTTP ${request.status}`);
                if (payload?.server !== 'athar-rag-v4' || Number(payload?.api_version) !== 4) throw new Error('Réponse provenant d’un ancien moteur.');
                response.value = payload;
                status.value.connected = true;
                selectedSourceId.value = payload.sources?.[0]?.citation_id || '';
                nextTick(() => document.querySelector('.sv2-response')?.scrollIntoView?.({ behavior: 'smooth', block: 'start' }));
            } catch (searchError) {
                error.value = searchError?.name === 'AbortError'
                    ? 'La recherche a dépassé deux minutes. Aucune réponse de secours n’est affichée pour éviter de te tromper.'
                    : `Recherche impossible : ${searchError?.message || 'serveur indisponible'}`;
            } finally {
                loading.value = false;
            }
        };

        const loadBooks = async () => {
            if (books.value.length || booksLoading.value) return;
            booksLoading.value = true;
            try {
                const request = await apiFetch('/api/rag/v4/books');
                const payload = await request.json().catch(() => ({}));
                if (!request.ok || !payload?.ok) throw new Error(payload?.error || `HTTP ${request.status}`);
                books.value = payload.books || [];
            } catch (bookError) {
                error.value = `Impossible de charger le catalogue : ${bookError?.message || 'erreur inconnue'}`;
            } finally {
                booksLoading.value = false;
            }
        };

        const changeMode = value => {
            mode.value = value;
            error.value = '';
            if (value === 'corpus') loadBooks();
        };

        const chooseExample = value => {
            query.value = value;
            mode.value = 'ask';
            nextTick(ask);
        };

        const selectSource = sourceOrId => {
            selectedSourceId.value = typeof sourceOrId === 'string' ? sourceOrId : sourceOrId?.citation_id;
        };

        const reset = () => {
            response.value = null;
            selectedSourceId.value = '';
            error.value = '';
        };

        const copyCitation = async source => {
            if (!source) return;
            const parts = [source.author, source.title, source.chapter, source.page != null ? `p. ${source.page}` : '', source.source_url].filter(Boolean);
            try { await navigator.clipboard.writeText(parts.join(' · ')); } catch (_) {}
        };

        const formatNumber = value => new Intl.NumberFormat('fr-FR').format(Number(value || 0));
        const openCompanions = () => typeof props.setView === 'function' && props.setView('library');

        onMounted(connect);

        return {
            mode, query, madhhab, discipline, loading, waking, error, response, status, books, booksLoading,
            examples, madhhabs, disciplines, sources, answer, analysis, routedBook, selectedSource, selectedSourceId,
            substantiveRatio, ask, connect, changeMode, chooseExample, selectSource, reset, copyCitation, formatNumber, openCompanions
        };
    },
    template: `
    <section class="sv2-shell" aria-label="Bibliothèque Savante V4">
        <header class="sv2-header">
            <div class="sv2-brand-block">
                <div class="sv2-kicker-row">
                    <span class="sv2-masterpiece">Bibliothèque Athar</span>
                    <span class="sv2-live" :class="{ online: status.connected }"><i></i>{{ status.connected ? 'Moteur V4 connecté' : (waking ? 'Réveil du serveur…' : 'Serveur indisponible') }}</span>
                </div>
                <h1>Bibliothèque <span>Savante</span></h1>
                <p class="sv2-arabic" lang="ar" dir="rtl">مكتبة آثار العلمية</p>
                <p class="sv2-subtitle">Recherche documentaire dans les ouvrages réels. Aucun passage de secours n’est substitué lorsque le serveur ne répond pas.</p>
            </div>
            <button type="button" class="sv2-companions-link" @click="openCompanions">
                <span class="sv2-companions-icon"><i data-lucide="users-round"></i></span>
                <span><small>Autre bibliothèque</small><strong>Bibliothèque des Compagnons</strong></span>
                <i data-lucide="arrow-up-right"></i>
            </button>
        </header>

        <nav class="sv2-tabs" aria-label="Espaces de la Bibliothèque Savante">
            <button type="button" :class="{ active: mode === 'ask' }" @click="changeMode('ask')"><i data-lucide="message-square-text"></i>Interroger</button>
            <button type="button" :class="{ active: mode === 'corpus' }" @click="changeMode('corpus')"><i data-lucide="library-big"></i>Les ouvrages</button>
            <button type="button" :class="{ active: mode === 'method' }" @click="changeMode('method')"><i data-lucide="shield-check"></i>Méthode</button>
        </nav>

        <main v-if="mode === 'ask'" class="sv2-ask-space">
            <section class="sv2-query-panel">
                <div class="sv2-query-heading">
                    <div><span>Recherche V4</span><h2>Que veux-tu retrouver dans les ouvrages ?</h2></div>
                    <span class="sv2-citation-rule"><i data-lucide="shield-check"></i>Preuves avant synthèse</span>
                </div>

                <div class="sv2-question-box">
                    <textarea v-model="query" rows="3" placeholder="Ex. Que dit Sahih al-Bukhari sur les intentions ?" aria-label="Question à la Bibliothèque Savante"></textarea>
                    <button type="button" :disabled="loading || waking || query.trim().length < 3" @click="ask">
                        <span v-if="!loading">Chercher dans les livres</span><span v-else>Recherche en cours…</span>
                        <i v-if="!loading" data-lucide="search"></i><i v-else data-lucide="loader-circle" class="sv2-spin"></i>
                    </button>
                </div>

                <div class="sv2-query-controls">
                    <label><span>École à privilégier</span><select v-model="madhhab"><option v-for="item in madhhabs" :key="item.value" :value="item.value">{{ item.label }}</option></select></label>
                    <label><span>Discipline</span><select v-model="discipline"><option v-for="item in disciplines" :key="item || 'auto'" :value="item">{{ item || 'Automatique' }}</option></select></label>
                </div>
            </section>

            <div v-if="error" class="sv2-alert"><i data-lucide="triangle-alert"></i><span>{{ error }}</span><button v-if="!status.connected && !waking" type="button" @click="connect">Réessayer</button></div>

            <section v-if="!response && !loading" class="sv2-start">
                <div class="sv2-start-head">
                    <div><span>Tests représentatifs</span><h2>Essaie plusieurs types d’ouvrages</h2></div>
                    <div class="sv2-start-stats"><strong>{{ formatNumber(status.substantive_passages) }}</strong><span>passages substantiels</span></div>
                </div>
                <div class="sv2-example-grid">
                    <button v-for="example in examples" :key="example" type="button" @click="chooseExample(example)">
                        <span class="sv2-example-icon"><i data-lucide="book-search"></i></span><small>Question test</small><strong>{{ example }}</strong><b>Interroger <i data-lucide="arrow-right"></i></b>
                    </button>
                </div>
            </section>

            <section v-if="loading" class="sv2-loading" aria-live="polite">
                <div class="sv2-loading-orbit"><span></span><i data-lucide="book-open-check"></i></div>
                <div><strong>Recherche dans le corpus</strong><span>Détection de l’ouvrage · recherche des concepts · classement des passages</span></div>
            </section>

            <section v-if="response && answer" class="sv2-response">
                <div class="sv2-analysis-strip">
                    <div><span>Moteur</span><strong>RAG V4</strong></div>
                    <div><span>Recherche</span><strong>{{ routedBook ? 'Ouvrage ciblé' : 'Corpus général' }}</strong></div>
                    <div v-if="routedBook"><span>Ouvrage détecté</span><strong>{{ routedBook.title }}</strong></div>
                    <div><span>Concepts</span><strong>{{ analysis?.concepts?.join(' · ') || 'lexicaux' }}</strong></div>
                    <button type="button" @click="reset"><i data-lucide="rotate-ccw"></i>Nouvelle question</button>
                </div>

                <div class="sv2-confidence" :class="sources.length ? 'is-sufficient' : 'is-insufficient'">
                    <div class="sv2-confidence-score"><strong>{{ sources.length }}</strong></div>
                    <div><span>Résultat documentaire</span><h2>{{ sources.length ? 'Passages retrouvés' : 'Aucune preuve suffisante' }}</h2><p>{{ answer.summary }}</p></div>
                    <dl>
                        <div><dt>Passages</dt><dd>{{ sources.length }}</dd></div>
                        <div><dt>Ouvrage ciblé</dt><dd>{{ routedBook ? 'Oui' : 'Non' }}</dd></div>
                        <div><dt>Mode</dt><dd>Extraits directs</dd></div>
                    </dl>
                </div>

                <div class="sv2-answer-layout">
                    <div class="sv2-answer-column">
                        <div class="sv2-section-title"><span>Passages les plus pertinents</span><p>Le pourcentage mesure la pertinence documentaire, pas la certitude religieuse.</p></div>
                        <article v-for="claim in answer.claims" :key="claim.id" class="sv2-claim">
                            <div class="sv2-claim-head"><span>Extrait direct</span><b>{{ claim.relevance }} % de pertinence</b></div>
                            <p>{{ claim.text }}</p>
                            <div class="sv2-claim-sources"><button v-for="sourceId in claim.source_ids" :key="sourceId" @click="selectSource(sourceId)"><span>[{{ sourceId }}]</span>Ouvrir le passage<i data-lucide="arrow-up-right"></i></button></div>
                        </article>
                        <div class="sv2-limits"><div class="sv2-section-title"><span>Important</span></div><ul><li><i data-lucide="info"></i>{{ answer.warning }}</li></ul></div>
                    </div>

                    <aside class="sv2-evidence" :class="{ empty: !selectedSource }">
                        <template v-if="selectedSource">
                            <div class="sv2-evidence-head"><div><span>Preuve sélectionnée</span><strong>[{{ selectedSource.citation_id }}]</strong></div><b>{{ selectedSource.relevance }} % pertinent</b></div>
                            <h2>{{ selectedSource.title }}</h2><p class="sv2-evidence-arabic-title" lang="ar" dir="rtl">{{ selectedSource.title_ar }}</p><p class="sv2-evidence-author">{{ selectedSource.author }}</p>
                            <dl class="sv2-evidence-meta"><div><dt>Discipline</dt><dd>{{ selectedSource.discipline || '—' }}</dd></div><div><dt>Madhhab</dt><dd>{{ selectedSource.madhhab || 'Transversal' }}</dd></div><div><dt>Page</dt><dd>{{ selectedSource.page ?? '—' }}</dd></div><div><dt>Concepts trouvés</dt><dd>{{ selectedSource.matched_concepts?.join(', ') || '—' }}</dd></div></dl>
                            <div v-if="selectedSource.chapter" class="sv2-evidence-chapter"><span>Chapitre</span><strong>{{ selectedSource.chapter }}</strong></div>
                            <div v-if="selectedSource.text_ar" class="sv2-source-text arabic"><div><span>Texte arabe</span><b>Source indexée</b></div><p lang="ar" dir="rtl">{{ selectedSource.text_ar }}</p></div>
                            <div v-if="selectedSource.text_fr" class="sv2-source-text french"><div><span>Texte français</span><b>{{ selectedSource.translation_status }}</b></div><p>{{ selectedSource.text_fr }}</p></div>
                            <div class="sv2-evidence-actions"><button type="button" @click="copyCitation(selectedSource)"><i data-lucide="copy"></i>Copier la citation</button><a v-if="selectedSource.source_url" :href="selectedSource.source_url" target="_blank" rel="noopener noreferrer"><i data-lucide="external-link"></i>Ouvrir la source</a></div>
                            <div class="sv2-source-list"><span>Tous les passages</span><button v-for="source in sources" :key="source.citation_id" :class="{ active: selectedSourceId === source.citation_id }" @click="selectSource(source)"><b>[{{ source.citation_id }}]</b><span>{{ source.title }} · p. {{ source.page ?? '—' }}</span><small>{{ source.relevance }}%</small></button></div>
                        </template>
                        <div v-else class="sv2-evidence-empty"><i data-lucide="book-x"></i><p>Aucun passage suffisamment pertinent.</p></div>
                    </aside>
                </div>
            </section>
        </main>

        <main v-else-if="mode === 'corpus'" class="sv2-corpus-space">
            <section class="sv2-corpus-hero"><div><span>Corpus réellement connecté</span><h2>{{ formatNumber(status.books) }} ouvrages · {{ formatNumber(status.chunks) }} passages</h2><p>Cette liste vient directement de l’API V4. Elle n’est pas reconstruite depuis un petit index embarqué.</p></div><div class="sv2-corpus-ring"><strong>{{ substantiveRatio }}%</strong><span>passages substantiels</span></div></section>
            <div class="sv2-corpus-stats"><article><span>Ouvrages</span><strong>{{ formatNumber(status.books) }}</strong></article><article><span>Passages</span><strong>{{ formatNumber(status.chunks) }}</strong></article><article><span>Substantiels</span><strong>{{ formatNumber(status.substantive_passages) }}</strong></article><article><span>Index FTS</span><strong>{{ status.fts_ready ? 'Actif' : 'Absent' }}</strong></article></div>
            <section v-if="booksLoading" class="sv2-loading"><div><strong>Chargement du catalogue…</strong></div></section>
            <div v-else class="sv2-corpus-grid"><article v-for="book in books" :key="book.id" class="sv2-book-card"><div class="sv2-book-top"><span>{{ book.discipline || 'Ouvrage classique' }}</span><b>{{ formatNumber(book.chunks) }} passages</b></div><h3>{{ book.title }}</h3><p lang="ar" dir="rtl">{{ book.title_ar }}</p><strong>{{ book.author }}</strong><dl><div><dt>Madhhab</dt><dd>{{ book.madhhab || 'Transversal' }}</dd></div><div><dt>Pages indexées</dt><dd>{{ formatNumber(book.indexed_pages) }}</dd></div></dl><a v-if="book.source_url" :href="book.source_url" target="_blank" rel="noopener noreferrer">Ouvrir la source <i data-lucide="external-link"></i></a></article></div>
        </main>

        <main v-else class="sv2-quality-space">
            <section class="sv2-quality-hero"><div><span>Architecture V4</span><h2>Simple, vérifiable et refus explicite.</h2><p>Le moteur détecte l’ouvrage lorsqu’il est nommé, recherche les concepts à l’intérieur de ce livre et ne remplace jamais une recherche échouée par des passages d’un autre corpus.</p></div><div class="sv2-quality-score"><strong>V4</strong><span>evidence-first</span><small>lecture seule</small></div></section>
            <div class="sv2-method-grid"><article><span>01</span><i data-lucide="book-key"></i><h3>Router</h3><p>Si un ouvrage est nommé, Athar identifie d’abord ce livre.</p></article><article><span>02</span><i data-lucide="scan-search"></i><h3>Rechercher</h3><p>Les concepts français et arabes sont cherchés dans le texte réel.</p></article><article><span>03</span><i data-lucide="list-ordered"></i><h3>Classer</h3><p>Les passages sont classés par pertinence documentaire.</p></article><article><span>04</span><i data-lucide="shield-x"></i><h3>Refuser</h3><p>Si aucune preuve ne correspond, Athar affiche zéro passage plutôt qu’une réponse hors sujet.</p></article></div>
        </main>
    </section>
    `
};
