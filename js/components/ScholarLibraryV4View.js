// Athar Research — interface documentaire V5
// Espace autonome de recherche dans le corpus savant. Aucun fallback vers la bibliothèque classique.
window.ScholarLibraryV4View = {
    name: 'AtharResearchView',
    props: ['settings', 'setView'],
    setup(props) {
        const { ref, computed, onMounted, nextTick } = Vue;
        const DEFAULT_ORIGIN = 'https://athar-rag-ibradevweb.onrender.com';
        const REMOTE_CONFIG = 'rag/remote.json';
        const REQUEST_TIMEOUT_MS = 120000;
        const HISTORY_KEY = 'athar_research_history_v1';

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
        const status = ref({ connected: false, books: 0, chunks: 0, substantive_passages: 0, fts_ready: false, engine_version: 0 });
        const books = ref([]);
        const booksLoading = ref(false);
        const bookQuery = ref('');
        const bookDiscipline = ref('');
        const bookMadhhab = ref('');
        const history = ref([]);
        const translationMode = ref('faithful');
        const translationLoadingKey = ref('');
        const translationError = ref('');
        const translations = ref({});

        const examples = [
            { icon: 'volume-2', label: 'Fiqh', query: 'Dans quelles prières récite-t-on à voix haute ?' },
            { icon: 'route', label: 'Voyage', query: 'Peut-on regrouper les prières en voyage ?' },
            { icon: 'droplets', label: 'Purification', query: 'Comment faire le wudu ?' },
            { icon: 'book-marked', label: 'Ouvrage précis', query: 'Que dit Sahih al-Bukhari sur les intentions ?' },
            { icon: 'moon-star', label: 'Hadith', query: 'Que rapporte Sunan al-Tirmidhi sur la prière du witr ?' },
            { icon: 'landmark', label: 'Sīra', query: "Que trouve-t-on dans la Sira d'Ibn Hisham concernant la bataille de Badr ?" }
        ];
        const madhhabs = [
            { value: '', label: 'Toutes les écoles' },
            { value: 'Mālikite', label: 'Mālikite' },
            { value: 'Ḥanafite', label: 'Ḥanafite' },
            { value: 'Shāfiʿite', label: 'Shāfiʿite' },
            { value: 'Ḥanbalite', label: 'Ḥanbalite' }
        ];
        const disciplines = ['', 'Fiqh', 'Hadith', 'Tafsir', 'Sira', 'Usul', 'Aqida', 'Histoire'];
        const translationModes = [
            { value: 'faithful', label: 'Fidèle', help: 'Français clair, sens technique préservé.' },
            { value: 'literal', label: 'Littérale', help: 'Au plus près de la formulation arabe.' },
            { value: 'study', label: 'Étude', help: 'Traduction + termes techniques expliqués.' }
        ];
        const conceptLabels = {
            eclipse_prayer: 'prière de l’éclipse',
            intention: 'intention', prayer: 'prière', recitation_aloud: 'récitation à voix haute', recitation_silent: 'récitation à voix basse',
            recitation: 'récitation', fatiha: 'al-Fātiḥa', basmala: 'basmala', witr: 'witr', qunut: 'qunūt', ruku: 'rukūʿ', sujud: 'sujūd',
            tashahhud: 'tashahhud', takbir: 'takbīr', taslim: 'taslīm', adhan: 'adhān', iqama: 'iqāma', congregation: 'prière en groupe', imam: 'imam',
            friday_prayer: 'prière du vendredi', prayer_times: 'horaires de prière', fajr: 'fajr', dhuhr: 'ẓuhr', asr: 'ʿaṣr', maghrib: 'maghrib', isha: 'ʿishāʾ',
            travel: 'voyage', combine_prayers: 'regroupement des prières', shorten_prayer: 'raccourcissement de la prière', purification: 'purification',
            wudu: 'wuḍūʾ', ghusl: 'ghusl', tayammum: 'tayammum', menstruation: 'menstruations', fasting: 'jeûne', zakat: 'zakāt', marriage: 'mariage',
            divorce: 'divorce', inheritance: 'héritage', riba: 'ribā', badr: 'bataille de Badr', ayat_al_kursi: 'Āyat al-Kursī'
        };

        const sources = computed(() => response.value?.sources || []);
        const answer = computed(() => response.value?.answer || null);
        const analysis = computed(() => response.value?.analysis || null);
        const routedBook = computed(() => analysis.value?.routed_book || null);
        const selectedSource = computed(() => sources.value.find(item => item.citation_id === selectedSourceId.value) || sources.value[0] || null);
        const translationKey = (source, wantedMode = translationMode.value) => `${source?.book_id || ''}:${source?.id || ''}:${wantedMode}`;
        const selectedTranslation = computed(() => translations.value[translationKey(selectedSource.value)] || null);
        const translationPending = computed(() => Boolean(selectedSource.value && translationLoadingKey.value === translationKey(selectedSource.value)));
        const selectedTranslationMode = computed(() => translationModes.find(item => item.value === translationMode.value) || translationModes[0]);
        const substantiveRatio = computed(() => status.value.chunks ? Math.round((status.value.substantive_passages || 0) * 100 / status.value.chunks) : 0);
        const resultTitle = computed(() => {
            const count = sources.value.length;
            if (!count) return 'Aucun passage suffisamment pertinent';
            return count + ' passage' + (count > 1 ? 's' : '') + ' retrouvé' + (count > 1 ? 's' : '');
        });
        const engineLabel = computed(() => Number(status.value.engine_version || 0) >= 5 ? 'RAG V5' : 'RAG');
        const runtimeLabel = computed(() => status.value.runtime_profile === 'low-memory' ? 'Production optimisée' : 'Production');
        const conceptLabel = value => conceptLabels[String(value || '')] || String(value || '').replaceAll('_', ' ');
        const displayedNotions = computed(() => {
            const notions = analysis.value?.notions;
            if (Array.isArray(notions) && notions.length) return notions.filter(Boolean);
            return (analysis.value?.concepts || []).map(conceptLabel).filter(Boolean);
        });
        const sourceNotions = source => (source?.matched_concepts || []).map(conceptLabel).filter(Boolean).join(', ');

        const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        const filteredBooks = computed(() => {
            const needle = normalize(bookQuery.value);
            const wantedDiscipline = normalize(bookDiscipline.value);
            const wantedMadhhab = normalize(bookMadhhab.value);
            return books.value.filter(book => {
                const haystack = normalize([book.title, book.title_ar, book.author, book.discipline, book.madhhab].filter(Boolean).join(' '));
                return (!needle || haystack.includes(needle))
                    && (!wantedDiscipline || normalize(book.discipline).includes(wantedDiscipline))
                    && (!wantedMadhhab || normalize(book.madhhab).includes(wantedMadhhab));
            });
        });
        const distinctBookDisciplines = computed(() => [...new Set(books.value.map(book => book.discipline).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'fr')));
        const distinctBookMadhhabs = computed(() => [...new Set(books.value.map(book => book.madhhab).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'fr')));

        const validOrigin = value => {
            try { const url = new URL(String(value || '')); return url.protocol === 'https:' ? url.origin : ''; }
            catch (_) { return ''; }
        };

        const resolveOrigin = async () => {
            if (apiOrigin.value) return apiOrigin.value;
            try {
                const url = new URL(REMOTE_CONFIG, window.location.href);
                url.searchParams.set('v', 'rag-v5-ui');
                const request = await window.fetch(url.href, { cache: 'no-store', headers: { Accept: 'application/json' } });
                if (request.ok) {
                    const configured = validOrigin((await request.json())?.origin);
                    if (configured) return (apiOrigin.value = configured);
                }
            } catch (_) {}
            return (apiOrigin.value = DEFAULT_ORIGIN);
        };

        const apiFetch = async (path, options = {}, timeoutMs = REQUEST_TIMEOUT_MS) => {
            const origin = await resolveOrigin();
            const controller = new AbortController();
            const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
            try {
                return await window.fetch(origin + path, {
                    cache: 'no-store', ...options, signal: controller.signal,
                    headers: { Accept: 'application/json', ...(options.body ? { 'Content-Type': 'application/json; charset=utf-8' } : {}), ...(options.headers || {}) }
                });
            } finally { window.clearTimeout(timeout); }
        };

        const validateV5 = payload => {
            if (!payload?.ok) throw new Error(payload?.error || 'Réponse API invalide.');
            if (Number(payload?.engine_version || 0) !== 5 || payload?.engine !== 'rag-v5-hybrid-multilingual') throw new Error('Le moteur documentaire V5 n’est pas encore actif.');
            return payload;
        };

        const connect = async () => {
            waking.value = true; error.value = '';
            try {
                const health = await apiFetch('/healthz', {}, 90000);
                if (!health.ok) throw new Error('HTTP ' + health.status);
                validateV5(await health.json());
                const request = await apiFetch('/api/rag/v5/status');
                if (!request.ok) throw new Error('HTTP ' + request.status);
                status.value = { ...validateV5(await request.json()), connected: true };
            } catch (connectionError) {
                status.value = { connected: false, books: 0, chunks: 0, substantive_passages: 0, fts_ready: false, engine_version: 0 };
                error.value = connectionError?.name === 'AbortError' ? 'Le moteur met trop de temps à répondre.' : 'Moteur documentaire indisponible : ' + (connectionError?.message || 'connexion impossible');
            } finally { waking.value = false; }
        };

        const loadHistory = () => {
            try { const parsed = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); history.value = Array.isArray(parsed) ? parsed.slice(0, 20) : []; }
            catch (_) { history.value = []; }
        };
        const saveHistory = payload => {
            const item = {
                id: String(Date.now()), query: query.value.trim(), created_at: new Date().toISOString(), count: Number(payload?.count || 0),
                routed_book: payload?.analysis?.routed_book?.title || '',
                top_books: [...new Set((payload?.sources || []).map(source => source.title).filter(Boolean))].slice(0, 3)
            };
            history.value = [item, ...history.value.filter(entry => entry.query !== item.query)].slice(0, 20);
            try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history.value)); } catch (_) {}
        };

        const ask = async () => {
            const value = query.value.trim();
            if (loading.value || value.length < 3) return;
            loading.value = true; error.value = ''; response.value = null; selectedSourceId.value = ''; translationError.value = '';
            try {
                const request = await apiFetch('/api/rag/v5/ask', { method: 'POST', body: JSON.stringify({ query: value, limit: 8, madhhab: madhhab.value, discipline: discipline.value }) });
                const payload = await request.json().catch(() => ({}));
                if (!request.ok) throw new Error(payload?.error || 'HTTP ' + request.status);
                validateV5(payload);
                response.value = payload;
                status.value = { ...status.value, connected: true, engine_version: 5 };
                selectedSourceId.value = payload.sources?.[0]?.citation_id || '';
                saveHistory(payload);
                nextTick(() => document.querySelector('.ar5-results')?.scrollIntoView?.({ behavior: 'smooth', block: 'start' }));
            } catch (searchError) {
                error.value = searchError?.name === 'AbortError' ? 'La recherche a dépassé deux minutes. Aucun résultat de secours n’est affiché.' : 'Recherche impossible : ' + (searchError?.message || 'serveur indisponible');
            } finally { loading.value = false; }
        };

        const loadBooks = async () => {
            if (books.value.length || booksLoading.value) return;
            booksLoading.value = true; error.value = '';
            try {
                const request = await apiFetch('/api/rag/v5/books');
                const payload = await request.json().catch(() => ({}));
                if (!request.ok) throw new Error(payload?.error || 'HTTP ' + request.status);
                books.value = validateV5(payload).books || [];
            } catch (bookError) { error.value = 'Impossible de charger les ouvrages : ' + (bookError?.message || 'erreur inconnue'); }
            finally { booksLoading.value = false; }
        };

        const setTranslationMode = value => {
            if (!translationModes.some(item => item.value === value)) return;
            translationMode.value = value;
            translationError.value = '';
        };
        const translateSelected = async () => {
            const source = selectedSource.value;
            if (!source?.id || !source?.book_id || !source?.text_ar) {
                translationError.value = 'Ce passage arabe ne peut pas être envoyé au traducteur.';
                return;
            }
            const key = translationKey(source);
            if (translationLoadingKey.value) return;
            translationLoadingKey.value = key;
            translationError.value = '';
            try {
                const request = await apiFetch('/api/rag/v5/translate', {
                    method: 'POST',
                    body: JSON.stringify({ source_id: source.id, book_id: source.book_id, mode: translationMode.value })
                }, 45000);
                const payload = await request.json().catch(() => ({}));
                if (!request.ok) throw new Error(payload?.error || 'HTTP ' + request.status);
                validateV5(payload);
                if (!payload?.translation?.text_fr) throw new Error('Aucune traduction exploitable n’a été reçue.');
                translations.value = { ...translations.value, [key]: payload.translation };
                nextTick(() => document.querySelector('.ar5-ai-translation')?.scrollIntoView?.({ behavior: 'smooth', block: 'nearest' }));
            } catch (translationFailure) {
                translationError.value = translationFailure?.name === 'AbortError'
                    ? 'La traduction a dépassé le délai prévu. Réessaie dans quelques instants.'
                    : (translationFailure?.message || 'La traduction IA est indisponible.');
            } finally {
                if (translationLoadingKey.value === key) translationLoadingKey.value = '';
            }
        };
        const copyTranslation = async translation => {
            const text = translation?.text_fr || '';
            if (!text) return;
            try { await navigator.clipboard.writeText(text); } catch (_) {}
        };

        const changeMode = value => { mode.value = value; error.value = ''; if (value === 'corpus') loadBooks(); };
        const chooseExample = value => { query.value = value; mode.value = 'ask'; nextTick(ask); };
        const rerunHistory = item => { query.value = item?.query || ''; mode.value = 'ask'; nextTick(ask); };
        const clearHistory = () => { history.value = []; try { localStorage.removeItem(HISTORY_KEY); } catch (_) {} };
        const selectSource = sourceOrId => { selectedSourceId.value = typeof sourceOrId === 'string' ? sourceOrId : sourceOrId?.citation_id; translationError.value = ''; };
        const reset = () => { response.value = null; selectedSourceId.value = ''; error.value = ''; translationError.value = ''; translationLoadingKey.value = ''; nextTick(() => document.querySelector('.ar5-composer textarea')?.focus()); };
        const copyCitation = async source => {
            if (!source) return;
            const parts = [source.author, source.title, source.chapter, source.page != null ? 'p. ' + source.page : '', source.source_url].filter(Boolean);
            try { await navigator.clipboard.writeText(parts.join(' · ')); } catch (_) {}
        };
        const onComposerKeydown = event => { if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') { event.preventDefault(); ask(); } };
        const formatNumber = value => new Intl.NumberFormat('fr-FR').format(Number(value || 0));
        const formatDate = value => { try { return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)); } catch (_) { return ''; } };
        const openCompanions = () => typeof props.setView === 'function' && props.setView('library');
        const openHome = () => typeof props.setView === 'function' && props.setView('home');

        onMounted(() => { loadHistory(); connect(); });

        return {
            mode, query, madhhab, discipline, loading, waking, error, response, status, books, booksLoading, bookQuery,
            bookDiscipline, bookMadhhab, history, examples, madhhabs, disciplines, sources, answer, analysis, routedBook,
            selectedSource, selectedSourceId, substantiveRatio, resultTitle, engineLabel, runtimeLabel, displayedNotions, filteredBooks,
            distinctBookDisciplines, distinctBookMadhhabs, translationModes, translationMode, selectedTranslationMode,
            selectedTranslation, translationPending, translationError, ask, connect, changeMode, chooseExample, rerunHistory, clearHistory,
            selectSource, reset, copyCitation, sourceNotions, onComposerKeydown, formatNumber, formatDate, openCompanions, openHome,
            setTranslationMode, translateSelected, copyTranslation
        };
    },
    template: `
    <section class="ar5-shell" aria-label="Athar Research — Bibliothèque Savante">
        <header class="ar5-topbar">
            <div class="ar5-brand" @click="changeMode('ask')"><span class="ar5-brand-mark"><i data-lucide="scan-search"></i></span><span class="ar5-brand-copy"><small>Athar</small><strong>Research</strong></span></div>
            <div class="ar5-runtime" :class="{ online: status.connected }"><span class="ar5-runtime-dot"></span><span><strong>{{ status.connected ? engineLabel : (waking ? 'Connexion…' : 'Hors ligne') }}</strong><small>{{ status.connected ? runtimeLabel : 'Moteur documentaire' }}</small></span></div>
            <div class="ar5-top-actions"><button type="button" class="ar5-ghost" @click="openHome"><i data-lucide="grid-2x2"></i><span>Athar Pro</span></button><button type="button" class="ar5-ghost" @click="openCompanions"><i data-lucide="users-round"></i><span>Compagnons</span></button></div>
        </header>

        <div class="ar5-frame">
            <aside class="ar5-rail">
                <div class="ar5-rail-intro"><span>Moteur documentaire</span><p>Recherche directe dans les ouvrages indexés, sans réponse de remplacement.</p></div>
                <nav aria-label="Navigation Athar Research">
                    <button type="button" :class="{ active: mode === 'ask' }" @click="changeMode('ask')"><i data-lucide="search"></i><span><strong>Recherche</strong><small>Interroger le corpus</small></span></button>
                    <button type="button" :class="{ active: mode === 'corpus' }" @click="changeMode('corpus')"><i data-lucide="library-big"></i><span><strong>Ouvrages</strong><small>Explorer le corpus</small></span></button>
                    <button type="button" :class="{ active: mode === 'history' }" @click="changeMode('history')"><i data-lucide="history"></i><span><strong>Historique</strong><small>Reprendre une recherche</small></span></button>
                    <button type="button" :class="{ active: mode === 'method' }" @click="changeMode('method')"><i data-lucide="shield-check"></i><span><strong>Méthode</strong><small>Comprendre le moteur</small></span></button>
                </nav>
                <div class="ar5-rail-stats"><div><span>Ouvrages</span><strong>{{ formatNumber(status.books) }}</strong></div><div><span>Passages</span><strong>{{ formatNumber(status.chunks) }}</strong></div></div>
                <button type="button" class="ar5-classic-link" @click="openCompanions"><i data-lucide="arrow-left-right"></i><span><small>Espace distinct</small><strong>Bibliothèque des Compagnons</strong></span></button>
            </aside>

            <main class="ar5-main">
                <div v-if="error" class="ar5-alert"><i data-lucide="triangle-alert"></i><span>{{ error }}</span><button v-if="!waking" type="button" @click="connect">Réessayer</button></div>

                <template v-if="mode === 'ask'">
                    <section class="ar5-hero">
                        <div class="ar5-eyebrow"><span>Bibliothèque Savante</span><b>{{ status.connected ? 'Corpus connecté' : 'Connexion requise' }}</b></div>
                        <h1>Chercher dans les textes.<br><em>Lire les preuves.</em></h1>
                        <p>Pose une question en français ou en arabe. Athar détecte les notions, cible l’ouvrage lorsqu’il est nommé et renvoie les passages les plus pertinents du corpus.</p>
                        <div class="ar5-composer" :class="{ busy: loading }">
                            <textarea v-model="query" rows="4" @keydown="onComposerKeydown" placeholder="Ex. Dans quelles prières récite-t-on à voix haute ?" aria-label="Question à Athar Research"></textarea>
                            <div class="ar5-composer-footer"><span><i data-lucide="command"></i> Ctrl + Entrée</span><button type="button" :disabled="loading || waking || query.trim().length < 3" @click="ask"><i v-if="!loading" data-lucide="arrow-up-right"></i><i v-else data-lucide="loader-circle" class="ar5-spin"></i><span>{{ loading ? 'Recherche…' : 'Rechercher' }}</span></button></div>
                        </div>
                        <div class="ar5-filters">
                            <label><span>École</span><select v-model="madhhab"><option v-for="item in madhhabs" :key="item.value" :value="item.value">{{ item.label }}</option></select></label>
                            <label><span>Discipline</span><select v-model="discipline"><option v-for="item in disciplines" :key="item || 'auto'" :value="item">{{ item || 'Automatique' }}</option></select></label>
                            <div class="ar5-corpus-pill"><i data-lucide="database"></i><span><strong>{{ formatNumber(status.substantive_passages) }}</strong> passages substantiels</span></div>
                        </div>
                    </section>

                    <section v-if="!response && !loading" class="ar5-discovery">
                        <div class="ar5-section-head"><div><span>Exemples</span><h2>Questions naturelles</h2></div><p>Pas besoin de connaître le vocabulaire arabe exact.</p></div>
                        <div class="ar5-example-grid"><button v-for="example in examples" :key="example.query" type="button" @click="chooseExample(example.query)"><span class="ar5-example-icon"><i :data-lucide="example.icon"></i></span><small>{{ example.label }}</small><strong>{{ example.query }}</strong><span class="ar5-example-arrow"><i data-lucide="arrow-up-right"></i></span></button></div>
                    </section>

                    <section v-if="loading" class="ar5-loading" aria-live="polite"><span class="ar5-loading-mark"><i data-lucide="scan-search"></i></span><div><strong>Recherche dans les ouvrages</strong><p>Analyse des notions · interrogation de l’index · classement des passages</p></div></section>

                    <section v-if="response && answer" class="ar5-results">
                        <div class="ar5-result-head"><div><span>Résultat documentaire</span><h2>{{ resultTitle }}</h2><p>{{ answer.summary }}</p></div><button type="button" class="ar5-new-search" @click="reset"><i data-lucide="plus"></i>Nouvelle recherche</button></div>
                        <div class="ar5-analysis"><div><span>Moteur</span><strong>RAG V5</strong></div><div><span>Mode</span><strong>{{ routedBook ? 'Ouvrage ciblé' : 'Corpus général' }}</strong></div><div v-if="routedBook"><span>Ouvrage détecté</span><strong>{{ routedBook.title }}</strong></div><div><span>Notions</span><strong>{{ displayedNotions.join(' · ') || 'Recherche lexicale' }}</strong></div></div>

                        <div v-if="sources.length" class="ar5-result-layout">
                            <div class="ar5-source-list">
                                <article v-for="source in sources" :key="source.citation_id" class="ar5-source-card" :class="{ active: selectedSourceId === source.citation_id }" @click="selectSource(source)">
                                    <div class="ar5-source-card-top"><span>[{{ source.citation_id }}]</span><b>{{ source.relevance }}% pertinent</b></div><h3>{{ source.title }}</h3><p class="ar5-source-author">{{ source.author || 'Auteur non renseigné' }}</p><p v-if="source.chapter" class="ar5-source-chapter">{{ source.chapter }}</p>
                                    <p class="ar5-source-preview" :class="{ arabic: !source.text_fr && source.text_ar }" :dir="!source.text_fr && source.text_ar ? 'rtl' : 'ltr'">{{ source.text_fr || source.text_ar }}</p>
                                    <div class="ar5-source-tags"><span v-if="source.discipline">{{ source.discipline }}</span><span v-if="source.madhhab">{{ source.madhhab }}</span><span v-if="source.page != null">p. {{ source.page }}</span></div>
                                </article>
                            </div>
                            <aside class="ar5-evidence">
                                <template v-if="selectedSource">
                                    <div class="ar5-evidence-top"><div><span>Passage sélectionné</span><strong>[{{ selectedSource.citation_id }}]</strong></div><b>{{ selectedSource.relevance }}%</b></div><h2>{{ selectedSource.title }}</h2><p v-if="selectedSource.title_ar" class="ar5-evidence-title-ar" lang="ar" dir="rtl">{{ selectedSource.title_ar }}</p><p class="ar5-evidence-author">{{ selectedSource.author }}</p>
                                    <dl class="ar5-evidence-meta"><div><dt>Discipline</dt><dd>{{ selectedSource.discipline || '—' }}</dd></div><div><dt>École</dt><dd>{{ selectedSource.madhhab || 'Transversal' }}</dd></div><div><dt>Page</dt><dd>{{ selectedSource.page ?? '—' }}</dd></div><div><dt>Notions</dt><dd>{{ sourceNotions(selectedSource) || '—' }}</dd></div></dl>
                                    <div v-if="selectedSource.chapter" class="ar5-evidence-chapter"><span>Chapitre</span><strong>{{ selectedSource.chapter }}</strong></div>
                                    <section v-if="selectedSource.text_ar" class="ar5-text-block arabic"><header><span>Texte arabe</span><b>Original indexé</b></header><p lang="ar" dir="rtl">{{ selectedSource.text_ar }}</p></section>
                                    <section v-if="selectedSource.text_fr" class="ar5-text-block"><header><span>Texte français</span><b>{{ selectedSource.translation_status || 'Indexé' }}</b></header><p>{{ selectedSource.text_fr }}</p></section>

                                    <section v-if="selectedSource.text_ar" class="ar5-translation-tool" aria-label="Traduire le passage avec l’intelligence artificielle">
                                        <div class="ar5-translation-tool-head"><div><span>Comprendre ce passage</span><h3>Traduction IA à la demande</h3></div><b><i data-lucide="sparkles"></i> Gemini</b></div>
                                        <p class="ar5-translation-intro">Choisis le niveau de lecture. Le modèle reçoit le passage complet ainsi que l’ouvrage, l’auteur, le chapitre, la discipline et l’école pour limiter les contresens techniques.</p>
                                        <div class="ar5-translation-modes" role="group" aria-label="Mode de traduction">
                                            <button v-for="item in translationModes" :key="item.value" type="button" :class="{ active: translationMode === item.value }" @click.stop="setTranslationMode(item.value)"><strong>{{ item.label }}</strong><small>{{ item.help }}</small></button>
                                        </div>
                                        <div v-if="translationError" class="ar5-translation-error"><i data-lucide="triangle-alert"></i><span>{{ translationError }}</span></div>
                                        <button type="button" class="ar5-translate-button" :disabled="translationPending" @click.stop="translateSelected"><i v-if="translationPending" data-lucide="loader-circle" class="ar5-spin"></i><i v-else data-lucide="languages"></i><span>{{ translationPending ? 'Traduction en cours…' : (selectedTranslation ? 'Retraduire en mode ' + selectedTranslationMode.label : 'Traduire en mode ' + selectedTranslationMode.label) }}</span></button>

                                        <article v-if="selectedTranslation" class="ar5-ai-translation">
                                            <header><div><span>Traduction assistée par IA</span><strong>{{ selectedTranslation.mode_label }}</strong></div><b>Non vérifiée</b></header>
                                            <p class="ar5-ai-translation-text">{{ selectedTranslation.text_fr }}</p>
                                            <div v-if="selectedTranslation.terms?.length" class="ar5-translation-terms"><h4>Termes techniques</h4><dl><div v-for="(term, index) in selectedTranslation.terms" :key="index"><dt><b lang="ar" dir="rtl">{{ term.arabic }}</b><span>{{ term.transliteration }}</span></dt><dd>{{ term.explanation }}</dd></div></dl></div>
                                            <div v-if="selectedTranslation.uncertainties?.length" class="ar5-translation-uncertainties"><strong><i data-lucide="circle-help"></i>Points à vérifier</strong><ul><li v-for="(item, index) in selectedTranslation.uncertainties" :key="index">{{ item }}</li></ul></div>
                                            <div v-if="selectedTranslation.source_truncated" class="ar5-translation-uncertainties"><strong><i data-lucide="scissors"></i>Passage très long</strong><p>La traduction a été limitée à la portion maximale acceptée par Athar. Consulte l’arabe original pour la suite.</p></div>
                                            <footer><span>{{ selectedTranslation.provider === 'google-gemini' ? 'Gemini' : selectedTranslation.provider }} · {{ selectedTranslation.model }}</span><button type="button" @click.stop="copyTranslation(selectedTranslation)"><i data-lucide="copy"></i>Copier</button></footer>
                                        </article>
                                        <p class="ar5-translation-notice"><i data-lucide="shield-alert"></i><span>{{ selectedTranslation?.notice || 'La traduction IA est une aide de lecture non vérifiée. Le texte arabe original reste la référence.' }}</span></p>
                                    </section>

                                    <div class="ar5-evidence-actions"><button type="button" @click.stop="copyCitation(selectedSource)"><i data-lucide="copy"></i>Copier la citation</button><a v-if="selectedSource.source_url" :href="selectedSource.source_url" target="_blank" rel="noopener noreferrer"><i data-lucide="external-link"></i>Source originale</a></div>
                                </template>
                            </aside>
                        </div>
                        <div v-else class="ar5-empty"><span><i data-lucide="search-x"></i></span><h3>Aucune preuve suffisante</h3><p>Essaie une formulation plus directe, précise un ouvrage, une école ou une discipline. Athar n’invente pas de passage pour remplir le résultat.</p><div><button v-for="example in examples.slice(0,3)" :key="example.query" @click="chooseExample(example.query)">{{ example.query }}</button></div></div>
                    </section>
                </template>

                <template v-else-if="mode === 'corpus'">
                    <section class="ar5-page-head"><span>Corpus</span><h1>Les ouvrages indexés</h1><p>Catalogue réellement exposé par le moteur documentaire, distinct de la bibliothèque éditoriale des Compagnons.</p></section>
                    <section class="ar5-corpus-stats"><article><span>Ouvrages</span><strong>{{ formatNumber(status.books) }}</strong></article><article><span>Passages</span><strong>{{ formatNumber(status.chunks) }}</strong></article><article><span>Substantiels</span><strong>{{ formatNumber(status.substantive_passages) }}</strong></article><article><span>Couverture</span><strong>{{ substantiveRatio }}%</strong></article></section>
                    <section class="ar5-book-tools"><label class="ar5-book-search"><i data-lucide="search"></i><input v-model="bookQuery" placeholder="Titre, auteur, discipline…"></label><select v-model="bookDiscipline"><option value="">Toutes les disciplines</option><option v-for="item in distinctBookDisciplines" :key="item" :value="item">{{ item }}</option></select><select v-model="bookMadhhab"><option value="">Toutes les écoles</option><option v-for="item in distinctBookMadhhabs" :key="item" :value="item">{{ item }}</option></select></section>
                    <section v-if="booksLoading" class="ar5-loading"><span class="ar5-loading-mark"><i data-lucide="loader-circle" class="ar5-spin"></i></span><div><strong>Chargement du corpus</strong></div></section>
                    <section v-else class="ar5-books-grid"><article v-for="book in filteredBooks" :key="book.id" class="ar5-book-card"><div class="ar5-book-card-top"><span>{{ book.discipline || 'Ouvrage' }}</span><b>{{ formatNumber(book.chunks || 0) }} passages</b></div><h3>{{ book.title }}</h3><p v-if="book.title_ar" class="ar5-book-ar" lang="ar" dir="rtl">{{ book.title_ar }}</p><p>{{ book.author || 'Auteur non renseigné' }}</p><footer><span v-if="book.madhhab">{{ book.madhhab }}</span><span>{{ formatNumber(book.indexed_pages || book.pages || 0) }} pages</span><a v-if="book.source_url" :href="book.source_url" target="_blank" rel="noopener noreferrer"><i data-lucide="external-link"></i></a></footer></article></section>
                    <div v-if="!booksLoading && !filteredBooks.length" class="ar5-empty compact"><span><i data-lucide="book-x"></i></span><h3>Aucun ouvrage correspondant</h3><p>Modifie les filtres ou la recherche.</p></div>
                </template>

                <template v-else-if="mode === 'history'">
                    <section class="ar5-page-head with-action"><div><span>Historique local</span><h1>Reprendre une recherche</h1><p>Conservé uniquement dans ce navigateur. Aucun historique n’est envoyé au serveur.</p></div><button v-if="history.length" type="button" @click="clearHistory"><i data-lucide="trash-2"></i>Effacer</button></section>
                    <section v-if="history.length" class="ar5-history-list"><button v-for="item in history" :key="item.id" type="button" @click="rerunHistory(item)"><span class="ar5-history-icon"><i data-lucide="history"></i></span><span class="ar5-history-copy"><small>{{ formatDate(item.created_at) }}</small><strong>{{ item.query }}</strong><em>{{ item.routed_book || item.top_books.join(' · ') || 'Corpus général' }}</em></span><span class="ar5-history-count">{{ item.count }}<small>passages</small></span><i data-lucide="arrow-up-right"></i></button></section>
                    <div v-else class="ar5-empty"><span><i data-lucide="history"></i></span><h3>Aucune recherche enregistrée</h3><p>Les recherches réussies apparaîtront ici pour pouvoir être relancées rapidement.</p><button @click="changeMode('ask')">Commencer une recherche</button></div>
                </template>

                <template v-else>
                    <section class="ar5-page-head"><span>Méthode</span><h1>Ce que fait Athar Research</h1><p>Un moteur documentaire, pas un oracle. L’objectif est de retrouver des passages vérifiables et de rendre le chemin vers la source visible.</p></section>
                    <section class="ar5-method-grid"><article><span>01</span><i data-lucide="message-square-text"></i><h3>Comprendre la question</h3><p>Une couche d’analyse sémantique peut enrichir la question avec les notions françaises et arabes pertinentes ; si elle est indisponible, l’ontologie locale prend automatiquement le relais.</p></article><article><span>02</span><i data-lucide="book-key"></i><h3>Cibler l’ouvrage</h3><p>Lorsqu’un livre ou un auteur est explicitement nommé, la recherche est prioritairement routée vers cet ouvrage.</p></article><article><span>03</span><i data-lucide="scan-search"></i><h3>Retrouver les passages</h3><p>L’index plein texte remonte un ensemble borné de candidats qui sont ensuite reclassés selon leur proximité documentaire.</p></article><article><span>04</span><i data-lucide="quote"></i><h3>Afficher la preuve</h3><p>Le résultat conserve le texte, l’ouvrage, l’auteur, le chapitre, la page et le lien source quand ils sont disponibles.</p></article></section>
                    <section class="ar5-method-note"><div><i data-lucide="shield-alert"></i></div><div><span>À retenir</span><h2>Pertinence documentaire ≠ certitude religieuse</h2><p>Le pourcentage affiché mesure la proximité entre la question et le passage indexé. Il ne classe ni l’authenticité d’un hadith, ni la force d’un avis juridique, ni la valeur d’une école.</p></div></section>
                    <section class="ar5-method-tech"><div><span>Moteur</span><strong>RAG V5 multilingue</strong></div><div><span>Corpus</span><strong>{{ formatNumber(status.books) }} ouvrages</strong></div><div><span>Index</span><strong>{{ status.fts_ready ? 'FTS actif' : 'À vérifier' }}</strong></div><div><span>Mode</span><strong>Preuves directes</strong></div></section>
                </template>
            </main>
        </div>
    </section>
    `
};
