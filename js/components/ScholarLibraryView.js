// Athar Pro — Bibliothèque savante RAG
window.ScholarLibraryView = {
    name: 'ScholarLibraryView',
    props: ['settings'],
    setup() {
        const { ref, computed, onMounted, onBeforeUnmount, nextTick } = Vue;

        const mode = ref('search');
        const query = ref('');
        const madhhab = ref('Mālikite');
        const discipline = ref('');
        const loading = ref(false);
        const error = ref('');
        const answer = ref('');
        const answerMode = ref('');
        const results = ref([]);
        const selectedId = ref('');
        const seed = ref({ meta: {}, books: [], chunks: [] });
        const apiStatus = ref({ connected: false, mode: 'demo', books: 0, chunks: 0, pages: 0, ollama_enabled: false });
        const copiedId = ref('');
        const searchInput = ref(null);

        const examples = [
            'Que disent les ouvrages mālikites sur le tayammum ?',
            'Comment les juristes distinguent-ils les temps de la prière ?',
            'Quelle place l’intention occupe-t-elle dans le jeûne ?',
            'Quels chapitres d’al-Qurṭubī traitent de la récitation du Coran ?'
        ];

        const disciplines = computed(() => {
            const values = seed.value.books.map(book => book.discipline).filter(Boolean);
            return [...new Set(values)].sort((a, b) => a.localeCompare(b, 'fr'));
        });

        const selectedResult = computed(() => {
            return results.value.find(item => item.id === selectedId.value) || results.value[0] || null;
        });

        const corpusMode = computed(() => apiStatus.value.connected ? apiStatus.value.mode : 'demo');
        const corpusLabel = computed(() => corpusMode.value === 'local_corpus' ? 'Corpus local synchronisé' : 'Index de démonstration');

        const normalize = value => String(value || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
            .replace(/[أإآٱ]/g, 'ا')
            .replace(/ى/g, 'ي')
            .replace(/ة/g, 'ه')
            .replace(/[^\p{L}\p{N}\s]/gu, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase();

        const expandTerms = value => {
            const map = {
                ablution: ['وضوء', 'wudu', 'purification'],
                tayammum: ['تيمم', 'purification sèche'],
                voyage: ['سفر', 'مسافر', 'voyageur'],
                voyageur: ['سفر', 'مسافر', 'voyage'],
                prière: ['صلاة', 'salat'],
                priere: ['صلاة', 'salat'],
                regroupement: ['جمع', 'regrouper'],
                intention: ['نية', 'niyya'],
                jeûne: ['صيام', 'صوم', 'ramadan'],
                jeune: ['صيام', 'صوم', 'ramadan'],
                miséricorde: ['رحمة', 'رحم'],
                misericorde: ['رحمة', 'رحم'],
                tafsir: ['تفسير', 'exégèse'],
                malikite: ['mālikite', 'مالكي', 'مالك']
            };
            const terms = normalize(value).split(' ').filter(term => term.length > 1);
            const expanded = [...terms];
            terms.forEach(term => (map[term] || []).forEach(extra => expanded.push(...normalize(extra).split(' '))));
            return [...new Set(expanded.filter(Boolean))];
        };

        const bookFor = bookId => seed.value.books.find(book => book.id === bookId) || {};

        const localSearch = value => {
            const terms = expandTerms(value);
            if (!terms.length) return [];
            return seed.value.chunks
                .map(chunk => {
                    const book = bookFor(chunk.book_id);
                    const text = normalize([
                        book.title,
                        book.title_ar,
                        book.author,
                        book.discipline,
                        book.madhhab,
                        chunk.chapter,
                        chunk.text_fr,
                        chunk.text_ar
                    ].filter(Boolean).join(' '));
                    const hits = terms.filter(term => text.includes(term));
                    let score = hits.length * 14;
                    if (normalize(chunk.chapter).includes(normalize(value))) score += 28;
                    if (normalize(book.title).includes(normalize(value))) score += 24;
                    if (madhhab.value && !normalize(book.madhhab).includes(normalize(madhhab.value))) score -= 18;
                    if (discipline.value && !normalize(book.discipline).includes(normalize(discipline.value))) score -= 18;
                    return {
                        ...chunk,
                        ...book,
                        id: chunk.id,
                        book_id: chunk.book_id,
                        score: Math.max(1, Math.min(96, 42 + score)),
                        source_url: chunk.source_url || book.source_url
                    };
                })
                .filter(item => item.score > 42)
                .sort((a, b) => b.score - a.score)
                .slice(0, 8);
        };

        const localAnswer = (value, items) => {
            if (!items.length) return 'Aucun passage suffisamment pertinent n’a été retrouvé dans le petit index de démonstration. Lancez sync-kutub.bat pour enrichir la bibliothèque.';
            const lines = [`Résultats les plus proches de « ${value} » :`];
            items.slice(0, 4).forEach((item, index) => {
                const text = String(item.text_fr || item.text_ar || '').replace(/\s+/g, ' ').trim();
                const location = [item.chapter, item.page != null ? `page ${item.page}` : ''].filter(Boolean).join(', ');
                lines.push(`[${index + 1}] ${text} — ${item.title}${location ? `, ${location}` : ''}.`);
            });
            lines.push('Cette réponse est une synthèse extractive de démonstration. Elle ne doit pas être utilisée pour attribuer un avis détaillé sans ouvrir les sources.');
            return lines.join('\n\n');
        };

        const loadSeed = async () => {
            try {
                const response = await fetch('rag/seed.json?v=athar-pro-v34', { cache: 'no-store' });
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                seed.value = await response.json();
            } catch (loadError) {
                console.warn('[Athar RAG] Index de démonstration indisponible.', loadError);
            }
        };

        const loadStatus = async () => {
            try {
                const response = await fetch('/api/rag/status', { cache: 'no-store' });
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const payload = await response.json();
                apiStatus.value = { connected: true, ...payload };
            } catch (_) {
                apiStatus.value = {
                    connected: false,
                    mode: 'demo',
                    books: seed.value.books.length,
                    chunks: seed.value.chunks.length,
                    pages: 0,
                    ollama_enabled: false
                };
            }
        };

        const ask = async () => {
            const value = query.value.trim();
            if (value.length < 2 || loading.value) return;
            loading.value = true;
            error.value = '';
            answer.value = '';
            results.value = [];
            selectedId.value = '';

            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 12000);
            try {
                const params = new URLSearchParams({ q: value, limit: '8' });
                if (madhhab.value) params.set('madhhab', madhhab.value);
                if (discipline.value) params.set('discipline', discipline.value);
                const response = await fetch(`/api/rag/ask?${params}`, {
                    cache: 'no-store',
                    signal: controller.signal
                });
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const payload = await response.json();
                if (!payload.ok) throw new Error(payload.error || 'Recherche impossible');
                answer.value = payload.answer || '';
                answerMode.value = payload.answer_mode || 'extractive';
                results.value = payload.results || [];
                selectedId.value = results.value[0]?.id || '';
                apiStatus.value.connected = true;
            } catch (searchError) {
                const local = localSearch(value);
                results.value = local;
                selectedId.value = local[0]?.id || '';
                answer.value = localAnswer(value, local);
                answerMode.value = 'demo_local';
                if (searchError?.name !== 'AbortError') {
                    error.value = 'Serveur RAG non détecté : résultats issus de l’index de démonstration embarqué.';
                } else {
                    error.value = 'Le serveur RAG a mis trop de temps à répondre : affichage du corpus de démonstration.';
                }
            } finally {
                clearTimeout(timeout);
                loading.value = false;
                nextTick(() => document.querySelector('.sl9-answer')?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' }));
            }
        };

        const chooseExample = value => {
            query.value = value;
            mode.value = 'search';
            nextTick(ask);
        };

        const selectResult = item => {
            selectedId.value = item.id;
        };

        const citationFor = item => {
            if (!item) return '';
            const location = [item.chapter, item.page != null ? `p. ${item.page}` : ''].filter(Boolean).join(' · ');
            return `${item.author || 'Auteur non indiqué'} — ${item.title}${location ? ` · ${location}` : ''} · ${item.source_url}`;
        };

        const copyCitation = async item => {
            try {
                await navigator.clipboard.writeText(citationFor(item));
                copiedId.value = item.id;
                setTimeout(() => { if (copiedId.value === item.id) copiedId.value = ''; }, 1600);
            } catch (_) {
                copiedId.value = '';
            }
        };

        const handleKeydown = event => {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault();
                mode.value = 'search';
                nextTick(() => searchInput.value?.focus());
            }
            if (event.key === 'Enter' && document.activeElement === searchInput.value && !event.shiftKey) {
                event.preventDefault();
                ask();
            }
        };

        onMounted(async () => {
            document.documentElement.classList.add('athar-scholar-library-active');
            window.addEventListener('keydown', handleKeydown);
            await loadSeed();
            await loadStatus();
        });

        onBeforeUnmount(() => {
            document.documentElement.classList.remove('athar-scholar-library-active');
            window.removeEventListener('keydown', handleKeydown);
        });

        return {
            mode,
            query,
            madhhab,
            discipline,
            disciplines,
            loading,
            error,
            answer,
            answerMode,
            results,
            selectedId,
            selectedResult,
            seed,
            apiStatus,
            corpusLabel,
            examples,
            copiedId,
            searchInput,
            ask,
            chooseExample,
            selectResult,
            copyCitation,
            citationFor
        };
    },
    template: `
    <section class="sl9-shell" aria-label="Bibliothèque savante RAG">
        <header class="sl9-header">
            <div class="sl9-heading">
                <p class="sl9-kicker">Recherche dans les ouvrages classiques</p>
                <div class="sl9-title-line">
                    <div>
                        <h1>Bibliothèque Savante</h1>
                        <p lang="ar" dir="rtl">مكتبة آثار العلمية</p>
                    </div>
                    <span class="sl9-status" :class="{ connected: apiStatus.connected }">
                        <i></i>{{ corpusLabel }}
                    </span>
                </div>
                <p class="sl9-subtitle">Pose une question, retrouve les passages les plus proches et vérifie chaque réponse dans le livre source.</p>
            </div>

            <div class="sl9-counters">
                <div><strong>{{ apiStatus.books || seed.books.length }}</strong><span>ouvrages</span></div>
                <div><strong>{{ apiStatus.chunks || seed.chunks.length }}</strong><span>passages</span></div>
                <div><strong>{{ apiStatus.pages || 0 }}</strong><span>pages indexées</span></div>
            </div>
        </header>

        <nav class="sl9-tabs" aria-label="Espaces de la bibliothèque">
            <button type="button" :class="{ active: mode === 'search' }" @click="mode = 'search'">Interroger</button>
            <button type="button" :class="{ active: mode === 'corpus' }" @click="mode = 'corpus'">Corpus</button>
            <button type="button" :class="{ active: mode === 'method' }" @click="mode = 'method'">Méthode</button>
        </nav>

        <main v-if="mode === 'search'" class="sl9-search-space">
            <div class="sl9-query-card">
                <div class="sl9-query-main">
                    <span class="sl9-query-mark" aria-hidden="true">⌕</span>
                    <textarea
                        ref="searchInput"
                        v-model="query"
                        rows="2"
                        placeholder="Ex. Que disent les ouvrages mālikites sur le regroupement des prières en voyage ?"
                        aria-label="Question à la bibliothèque"
                    ></textarea>
                    <button type="button" :disabled="loading || query.trim().length < 2" @click="ask">
                        <span v-if="!loading">Chercher</span>
                        <span v-else>Analyse…</span>
                    </button>
                </div>
                <div class="sl9-filters">
                    <label>
                        <span>Madhhab</span>
                        <select v-model="madhhab">
                            <option value="">Toutes les écoles</option>
                            <option value="Mālikite">Mālikite</option>
                            <option value="Comparatif">Fiqh comparé</option>
                        </select>
                    </label>
                    <label>
                        <span>Discipline</span>
                        <select v-model="discipline">
                            <option value="">Toutes les disciplines</option>
                            <option v-for="item in disciplines" :key="item" :value="item">{{ item }}</option>
                        </select>
                    </label>
                    <p><kbd>Entrée</kbd> pour lancer · arabe et français acceptés</p>
                </div>
            </div>

            <div v-if="!answer && !loading" class="sl9-starters">
                <p class="sl9-section-label">Questions de départ</p>
                <div class="sl9-starter-grid">
                    <button v-for="(example, index) in examples" :key="example" type="button" @click="chooseExample(example)">
                        <span>0{{ index + 1 }}</span>
                        <strong>{{ example }}</strong>
                        <b>→</b>
                    </button>
                </div>
                <div class="sl9-demo-note" v-if="!apiStatus.connected || apiStatus.mode === 'demo'">
                    <span aria-hidden="true">i</span>
                    <p><strong>Mode démonstration.</strong> Les résultats actuels reposent sur un petit index public. Lance <code>sync-kutub.bat</code> pour importer les pages et activer la base locale complète.</p>
                </div>
            </div>

            <p v-if="error" class="sl9-warning">{{ error }}</p>

            <div v-if="answer || loading" class="sl9-answer-layout">
                <section class="sl9-answer">
                    <div class="sl9-answer-head">
                        <div>
                            <p class="sl9-section-label">Synthèse sourcée</p>
                            <h2>{{ loading ? 'Recherche dans le corpus…' : 'Réponse de la bibliothèque' }}</h2>
                        </div>
                        <span v-if="answerMode">{{ answerMode === 'ollama_grounded' ? 'Ollama local · sources imposées' : answerMode === 'demo_local' ? 'Démonstration locale' : 'Synthèse extractive' }}</span>
                    </div>
                    <div v-if="loading" class="sl9-loading" aria-live="polite"><i></i><i></i><i></i></div>
                    <p v-else class="sl9-answer-text">{{ answer }}</p>
                    <div class="sl9-answer-rule">
                        <span>Principe</span>
                        <p>Une réponse n’est affichée qu’avec des passages retrouvés. Les traductions non relues restent signalées et l’arabe original demeure accessible.</p>
                    </div>
                </section>

                <section class="sl9-results-panel">
                    <div class="sl9-results-head">
                        <p class="sl9-section-label">Passages retrouvés</p>
                        <strong>{{ results.length }}</strong>
                    </div>
                    <div v-if="results.length" class="sl9-results-list">
                        <button
                            v-for="(item, index) in results"
                            :key="item.id"
                            type="button"
                            class="sl9-result"
                            :class="{ active: selectedResult && selectedResult.id === item.id }"
                            @click="selectResult(item)"
                        >
                            <span class="sl9-result-index">{{ index + 1 }}</span>
                            <span class="sl9-result-copy">
                                <strong>{{ item.title }}</strong>
                                <small>{{ item.author }} · {{ item.chapter || 'Passage indexé' }}</small>
                            </span>
                            <em>{{ item.score }}%</em>
                        </button>
                    </div>
                    <p v-else-if="!loading" class="sl9-empty">Aucun passage trouvé dans le corpus actuellement disponible.</p>
                </section>

                <aside v-if="selectedResult" class="sl9-inspector">
                    <div class="sl9-inspector-top">
                        <p class="sl9-section-label">Source sélectionnée</p>
                        <span>{{ selectedResult.translation_status === 'kutub_ai_unreviewed' ? 'Traduction IA non relue' : selectedResult.translation_status === 'arabic_original' ? 'Arabe original' : 'Index public' }}</span>
                    </div>
                    <h3>{{ selectedResult.title }}</h3>
                    <p class="sl9-book-arabic" lang="ar" dir="rtl">{{ selectedResult.title_ar }}</p>
                    <dl>
                        <div><dt>Auteur</dt><dd>{{ selectedResult.author }}</dd></div>
                        <div><dt>Discipline</dt><dd>{{ selectedResult.discipline || '—' }}</dd></div>
                        <div><dt>École</dt><dd>{{ selectedResult.madhhab || '—' }}</dd></div>
                        <div><dt>Repère</dt><dd>{{ selectedResult.chapter || '—' }}<template v-if="selectedResult.page != null"> · p. {{ selectedResult.page }}</template></dd></div>
                    </dl>
                    <blockquote v-if="selectedResult.text_ar" lang="ar" dir="rtl">{{ selectedResult.text_ar }}</blockquote>
                    <p class="sl9-passage-fr">{{ selectedResult.text_fr }}</p>
                    <div class="sl9-source-actions">
                        <a :href="selectedResult.source_url" target="_blank" rel="noopener noreferrer">Ouvrir sur Kutub ↗</a>
                        <button type="button" @click="copyCitation(selectedResult)">{{ copiedId === selectedResult.id ? 'Copié ✓' : 'Copier la citation' }}</button>
                    </div>
                </aside>
            </div>
        </main>

        <main v-else-if="mode === 'corpus'" class="sl9-corpus">
            <div class="sl9-section-intro">
                <p class="sl9-kicker">Corpus initial</p>
                <h2>Une bibliothèque progressive et auditable</h2>
                <p>Les ouvrages sont synchronisés par lots limités. Chaque passage garde son livre, son chapitre, sa page, son URL et son statut de traduction.</p>
            </div>
            <div class="sl9-book-grid">
                <article v-for="book in seed.books" :key="book.id">
                    <div class="sl9-book-top">
                        <span>{{ book.madhhab }}</span>
                        <small>{{ book.pages ? book.pages.toLocaleString('fr-FR') + ' pages' : 'pagination à vérifier' }}</small>
                    </div>
                    <h3>{{ book.title }}</h3>
                    <p class="sl9-book-arabic" lang="ar" dir="rtl">{{ book.title_ar }}</p>
                    <strong>{{ book.author }}</strong>
                    <p>{{ book.description }}</p>
                    <div><em>{{ book.discipline }}</em><a :href="book.source_url" target="_blank" rel="noopener noreferrer">Fiche source ↗</a></div>
                </article>
            </div>
            <div class="sl9-sync-card">
                <div>
                    <p class="sl9-section-label">Synchronisation locale</p>
                    <h3>Enrichir la base en deux clics</h3>
                    <p><code>sync-kutub.bat</code> importe 25 pages par ouvrage et reprend automatiquement à l’exécution suivante.</p>
                </div>
                <ol>
                    <li><span>1</span>Fermer le serveur Athar si nécessaire</li>
                    <li><span>2</span>Lancer <code>sync-kutub.bat</code></li>
                    <li><span>3</span>Relancer <code>start-athar-rag.bat</code></li>
                </ol>
            </div>
        </main>

        <main v-else class="sl9-method">
            <div class="sl9-section-intro">
                <p class="sl9-kicker">Méthode RAG</p>
                <h2>Retrouver d’abord, répondre ensuite</h2>
                <p>Athar ne demande jamais au modèle de répondre de mémoire. La question sert d’abord à retrouver des passages, puis la synthèse est limitée à ces sources.</p>
            </div>
            <div class="sl9-method-flow">
                <article><span>01</span><h3>Normaliser</h3><p>Accents français, voyelles arabes et variantes graphiques sont neutralisés pour rapprocher les requêtes.</p></article>
                <b>→</b>
                <article><span>02</span><h3>Retrouver</h3><p>SQLite FTS5 classe les passages et applique les filtres de madhhab et de discipline.</p></article>
                <b>→</b>
                <article><span>03</span><h3>Fonder</h3><p>La réponse reçoit uniquement les passages sélectionnés, avec des marqueurs de citation obligatoires.</p></article>
                <b>→</b>
                <article><span>04</span><h3>Vérifier</h3><p>L’utilisateur ouvre la page Kutub, consulte l’arabe et contrôle la traduction avant de conclure.</p></article>
            </div>
            <div class="sl9-guardrails">
                <h3>Garde-fous actifs</h3>
                <div>
                    <p><strong>Aucune authentification contournée</strong><span>Le collecteur n’utilise que les pages publiques.</span></p>
                    <p><strong>Arrêt en cas de blocage</strong><span>401, 403, CAPTCHA et protections anti-bot interrompent le crawl.</span></p>
                    <p><strong>Traductions signalées</strong><span>Une traduction générée par IA n’est jamais présentée comme relue.</span></p>
                    <p><strong>Références conservées</strong><span>Chaque passage garde l’URL et la date de collecte.</span></p>
                    <p><strong>Pas de verdict automatique</strong><span>Le système restitue des sources, il ne remplace pas un spécialiste.</span></p>
                    <p><strong>Fonctionnement local</strong><span>La base et les requêtes restent sur l’ordinateur par défaut.</span></p>
                </div>
            </div>
        </main>
    </section>
    `
};
