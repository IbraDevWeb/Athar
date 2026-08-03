// Athar Pro — Bibliothèque Savante V2, expérience citation-first
window.ScholarLibraryV2View = {
    name: 'ScholarLibraryV2View',
    props: ['settings', 'setView'],
    setup(props) {
        const { ref, computed, onMounted, onBeforeUnmount, nextTick } = Vue;

        const mode = ref('ask');
        const query = ref('');
        const profile = ref('maliki');
        const discipline = ref('');
        const detailLevel = ref('standard');
        const loading = ref(false);
        const error = ref('');
        const response = ref(null);
        const selectedSourceId = ref('');
        const copiedSourceId = ref('');
        const searchInput = ref(null);
        const status = ref({
            connected: false,
            books: 0,
            chunks: 0,
            pages: 0,
            substantive_passages: 0,
            catalogue_notices: 0,
            readiness: 0,
            target_books: 25,
            corpus: [],
            translation_statuses: []
        });
        const evaluation = ref({ cases: 0, target: 200, progress: 0, disciplines: {}, items: [] });
        const seed = ref({ books: [], chunks: [] });

        const profiles = [
            { id: 'maliki', label: 'Mālikite prioritaire', value: 'Mālikite', icon: 'landmark' },
            { id: 'compare', label: 'Comparer les madhhabs', value: 'Comparatif', icon: 'columns-3' },
            { id: 'all', label: 'Toutes les sources', value: '', icon: 'library-big' }
        ];

        const disciplines = [
            '', 'Fiqh', 'Tafsīr', 'Hadith', 'Sīra', 'Uṣūl', 'Fiqh comparé', 'Langue arabe', 'Sciences du hadith'
        ];

        const examples = [
            {
                eyebrow: 'Fiqh mālikite',
                question: 'Peut-on regrouper dhuhr et asr à l’heure de dhuhr pendant le voyage ?',
                icon: 'route'
            },
            {
                eyebrow: 'Purification',
                question: 'Dans quels cas le tayammum remplace-t-il les ablutions ?',
                icon: 'droplets'
            },
            {
                eyebrow: 'Fiqh comparé',
                question: 'Comment les quatre madhhabs divergent-ils sur le séjour du voyageur ?',
                icon: 'scale'
            },
            {
                eyebrow: 'Tafsīr',
                question: 'Comment les exégètes expliquent-ils la miséricorde dans la basmala ?',
                icon: 'book-open-text'
            }
        ];

        const profileValue = computed(() => profiles.find(item => item.id === profile.value)?.value || '');
        const answer = computed(() => response.value?.answer || null);
        const analysis = computed(() => response.value?.analysis || null);
        const sources = computed(() => response.value?.sources || []);
        const citationAudit = computed(() => response.value?.citation_audit || null);
        const selectedSource = computed(() => sources.value.find(item => item.citation_id === selectedSourceId.value) || sources.value[0] || null);
        const substantiveRatio = computed(() => {
            const total = Number(status.value.chunks || 0);
            return total ? Math.round((Number(status.value.substantive_passages || 0) / total) * 100) : 0;
        });
        const corpusProgress = computed(() => {
            const target = Number(status.value.target_books || 25);
            return target ? Math.min(100, Math.round((Number(status.value.books || 0) / target) * 100)) : 0;
        });
        const verdictClass = computed(() => `is-${answer.value?.coverage?.verdict || 'idle'}`);
        const isDemoCorpus = computed(() => !status.value.connected || !status.value.substantive_passages);

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

        const loadSeed = async () => {
            try {
                const request = await fetch('rag/seed.json?v=athar-pro-v34', { cache: 'no-store' });
                if (request.ok) seed.value = await request.json();
            } catch (_) {
                seed.value = { books: [], chunks: [] };
            }
        };

        const loadStatus = async () => {
            try {
                const request = await fetch('/api/rag/v2/status', { cache: 'no-store' });
                if (!request.ok) throw new Error(`HTTP ${request.status}`);
                status.value = { connected: true, ...(await request.json()) };
            } catch (_) {
                status.value = {
                    connected: false,
                    books: seed.value.books.length,
                    chunks: seed.value.chunks.length,
                    pages: 0,
                    substantive_passages: seed.value.chunks.filter(item => String(item.text_fr || item.text_ar || '').length >= 120).length,
                    catalogue_notices: seed.value.chunks.filter(item => item.translation_status === 'catalogue_public').length,
                    readiness: 0,
                    target_books: 25,
                    corpus: seed.value.books.map(book => ({ ...book, chunks: seed.value.chunks.filter(chunk => chunk.book_id === book.id).length, indexed_pages: 0 })),
                    translation_statuses: []
                };
            }
        };

        const loadEvaluation = async () => {
            try {
                const request = await fetch('/api/rag/v2/evaluation', { cache: 'no-store' });
                if (!request.ok) throw new Error(`HTTP ${request.status}`);
                evaluation.value = await request.json();
            } catch (_) {
                try {
                    const request = await fetch('rag/evaluation_v2.json', { cache: 'no-store' });
                    const payload = request.ok ? await request.json() : { cases: [] };
                    const items = payload.cases || [];
                    evaluation.value = {
                        cases: items.length,
                        target: 200,
                        progress: Math.round((items.length / 200) * 100),
                        disciplines: {},
                        items
                    };
                } catch (_) {
                    evaluation.value = { cases: 0, target: 200, progress: 0, disciplines: {}, items: [] };
                }
            }
        };

        const localFallback = value => {
            const terms = normalize(value).split(' ').filter(term => term.length > 2);
            const bookMap = new Map(seed.value.books.map(book => [book.id, book]));
            const matches = seed.value.chunks.map(chunk => {
                const book = bookMap.get(chunk.book_id) || {};
                const haystack = normalize([book.title, book.title_ar, book.author, book.discipline, book.madhhab, chunk.chapter, chunk.text_fr, chunk.text_ar].filter(Boolean).join(' '));
                const hits = terms.filter(term => haystack.includes(term)).length;
                return {
                    ...book,
                    ...chunk,
                    citation_id: '',
                    score: Math.min(92, 38 + hits * 13),
                    source_type: chunk.translation_status === 'catalogue_public' ? 'Notice de catalogue' : 'Source documentaire',
                    verification_status: chunk.translation_status === 'catalogue_public' ? 'Notice uniquement' : 'Importé · à vérifier',
                    edition: 'Édition non renseignée',
                    page_end: chunk.page,
                    has_substantive_text: String(chunk.text_fr || chunk.text_ar || '').length >= 120
                };
            }).filter(item => item.score > 45).sort((a, b) => b.score - a.score).slice(0, 8);
            matches.forEach((item, index) => { item.citation_id = `S${index + 1}`; });
            const substantive = matches.filter(item => item.has_substantive_text && item.verification_status !== 'Notice uniquement');
            const claims = substantive.slice(0, 3).map((item, index) => ({
                id: `C${index + 1}`,
                title: index ? 'Passage complémentaire' : 'Passage principal',
                text: String(item.text_fr || item.text_ar || '').slice(0, 520),
                kind: 'direct_excerpt',
                source_ids: [item.citation_id],
                support: item.score
            }));
            return {
                query: value,
                analysis: {
                    language: /[\u0600-\u06ff]/.test(value) ? 'ar' : 'fr',
                    discipline: discipline.value || 'Recherche générale',
                    madhhab: profileValue.value || 'Toutes les écoles',
                    topics: terms.slice(0, 3),
                    question_type: 'recherche documentaire locale'
                },
                answer: {
                    summary: claims.length
                        ? 'Le serveur V2 n’est pas actif. Athar affiche uniquement les passages présents dans l’index embarqué, sans produire de conclusion religieuse.'
                        : 'Le petit index embarqué ne contient pas de passage substantiel suffisant pour cette question.',
                    claims,
                    conditions: [],
                    divergences: [],
                    limits: [
                        'Le serveur Bibliothèque Savante V2 n’est pas détecté.',
                        'Les notices de catalogue ne permettent pas d’attribuer une position juridique détaillée.'
                    ],
                    coverage: {
                        verdict: claims.length ? 'partial' : 'insufficient',
                        label: claims.length ? 'Couverture partielle' : 'Sources insuffisantes',
                        score: claims.length ? 28 : 0,
                        substantive_passages: substantive.length,
                        unique_books: new Set(substantive.map(item => item.book_id)).size,
                        verified_passages: 0,
                        average_relevance: claims.length ? Math.round(claims.reduce((sum, claim) => sum + claim.support, 0) / claims.length) : 0
                    },
                    answer_mode: 'embedded_fallback'
                },
                sources: matches,
                citation_audit: {
                    all_claims_cited: claims.length > 0,
                    valid_source_ids: true,
                    claim_count: claims.length,
                    cited_source_count: claims.length
                }
            };
        };

        const ask = async () => {
            const value = query.value.trim();
            if (value.length < 3 || loading.value) return;
            loading.value = true;
            error.value = '';
            response.value = null;
            selectedSourceId.value = '';

            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), detailLevel.value === 'deep' ? 45000 : 22000);
            try {
                const request = await fetch('/api/rag/v2/ask', {
                    method: 'POST',
                    cache: 'no-store',
                    signal: controller.signal,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query: value,
                        madhhab: profileValue.value,
                        discipline: discipline.value,
                        limit: detailLevel.value === 'deep' ? 16 : detailLevel.value === 'brief' ? 8 : 12
                    })
                });
                if (!request.ok) throw new Error(`HTTP ${request.status}`);
                const payload = await request.json();
                if (!payload.ok) throw new Error(payload.error || 'Réponse V2 invalide');
                response.value = payload;
                status.value.connected = true;
            } catch (searchError) {
                response.value = localFallback(value);
                error.value = searchError?.name === 'AbortError'
                    ? 'Le moteur V2 a dépassé le délai prévu. Athar affiche le corpus embarqué sans extrapolation.'
                    : 'Le serveur V2 n’est pas détecté. La réponse est limitée à l’index embarqué.';
            } finally {
                clearTimeout(timeout);
                selectedSourceId.value = response.value?.sources?.[0]?.citation_id || '';
                loading.value = false;
                nextTick(() => document.querySelector('.sv2-response')?.scrollIntoView?.({ behavior: 'smooth', block: 'start' }));
            }
        };

        const chooseExample = item => {
            query.value = item.question;
            if (item.eyebrow === 'Fiqh comparé') profile.value = 'compare';
            mode.value = 'ask';
            nextTick(ask);
        };

        const sourcesForClaim = claim => (claim?.source_ids || []).map(id => sources.value.find(source => source.citation_id === id)).filter(Boolean);
        const selectSource = sourceOrId => {
            selectedSourceId.value = typeof sourceOrId === 'string' ? sourceOrId : sourceOrId?.citation_id;
            nextTick(() => document.querySelector('.sv2-evidence')?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' }));
        };

        const citationFor = item => {
            if (!item) return '';
            const location = [
                item.volume ? `vol. ${item.volume}` : '',
                item.chapter,
                item.page != null ? `p. ${item.page}${item.page_end && item.page_end !== item.page ? `–${item.page_end}` : ''}` : ''
            ].filter(Boolean).join(' · ');
            return `${item.author || 'Auteur non indiqué'}, ${item.title}${location ? ` · ${location}` : ''}. ${item.source_url || ''}`;
        };

        const copyCitation = async item => {
            try {
                await navigator.clipboard.writeText(citationFor(item));
                copiedSourceId.value = item.citation_id;
                setTimeout(() => { if (copiedSourceId.value === item.citation_id) copiedSourceId.value = ''; }, 1600);
            } catch (_) {
                copiedSourceId.value = '';
            }
        };

        const openCompanions = () => {
            if (typeof props.setView === 'function') props.setView('library');
        };

        const resetQuestion = () => {
            response.value = null;
            selectedSourceId.value = '';
            error.value = '';
            nextTick(() => searchInput.value?.focus());
        };

        const handleKeydown = event => {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'enter') {
                event.preventDefault();
                ask();
            }
            if (event.key === 'Escape' && response.value) resetQuestion();
        };

        const formatSync = value => {
            if (!value) return 'Non synchronisé';
            try {
                return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(new Date(value));
            } catch (_) {
                return String(value);
            }
        };

        onMounted(async () => {
            document.documentElement.classList.add('athar-scholar-v2-active');
            window.addEventListener('keydown', handleKeydown);
            await loadSeed();
            await Promise.all([loadStatus(), loadEvaluation()]);
        });

        onBeforeUnmount(() => {
            document.documentElement.classList.remove('athar-scholar-v2-active');
            window.removeEventListener('keydown', handleKeydown);
        });

        return {
            mode,
            query,
            profile,
            discipline,
            detailLevel,
            loading,
            error,
            response,
            answer,
            analysis,
            sources,
            citationAudit,
            selectedSource,
            selectedSourceId,
            copiedSourceId,
            searchInput,
            status,
            evaluation,
            profiles,
            disciplines,
            examples,
            substantiveRatio,
            corpusProgress,
            verdictClass,
            isDemoCorpus,
            ask,
            chooseExample,
            sourcesForClaim,
            selectSource,
            citationFor,
            copyCitation,
            openCompanions,
            resetQuestion,
            formatSync
        };
    },
    template: `
    <section class="sv2-shell" aria-label="Bibliothèque Savante V2">
        <header class="sv2-header">
            <div class="sv2-brand-block">
                <div class="sv2-kicker-row">
                    <span class="sv2-masterpiece">Pièce maîtresse d’Athar</span>
                    <span class="sv2-live" :class="{ online: status.connected }"><i></i>{{ status.connected ? 'Moteur V2 connecté' : 'Mode embarqué' }}</span>
                </div>
                <h1>Bibliothèque <span>Savante</span></h1>
                <p class="sv2-arabic" lang="ar" dir="rtl">مكتبة آثار العلمية</p>
                <p class="sv2-subtitle">Une question religieuse, une réponse structurée et chaque affirmation reliée au passage qui la soutient.</p>
            </div>
            <button type="button" class="sv2-companions-link" @click="openCompanions">
                <span class="sv2-companions-icon"><i data-lucide="users-round"></i></span>
                <span><small>Autre pilier d’Athar</small><strong>Bibliothèque des Compagnons</strong></span>
                <i data-lucide="arrow-up-right"></i>
            </button>
        </header>

        <nav class="sv2-tabs" aria-label="Espaces de la Bibliothèque Savante">
            <button type="button" :class="{ active: mode === 'ask' }" @click="mode = 'ask'"><i data-lucide="message-square-text"></i>Interroger</button>
            <button type="button" :class="{ active: mode === 'corpus' }" @click="mode = 'corpus'"><i data-lucide="library-big"></i>Bibliothèque</button>
            <button type="button" :class="{ active: mode === 'quality' }" @click="mode = 'quality'"><i data-lucide="badge-check"></i>Qualité & méthode</button>
        </nav>

        <main v-if="mode === 'ask'" class="sv2-ask-space">
            <section class="sv2-query-panel">
                <div class="sv2-query-heading">
                    <div>
                        <span>Question religieuse</span>
                        <h2>Que souhaites-tu vérifier dans les ouvrages ?</h2>
                    </div>
                    <span class="sv2-citation-rule"><i data-lucide="shield-check"></i>Aucune affirmation sans source</span>
                </div>

                <div class="sv2-question-box">
                    <textarea
                        ref="searchInput"
                        v-model="query"
                        rows="3"
                        placeholder="Ex. Selon le madhhab mālikite, peut-on regrouper dhuhr et asr à l’heure de dhuhr pendant le voyage ?"
                        aria-label="Question à la Bibliothèque Savante"
                    ></textarea>
                    <button type="button" :disabled="loading || query.trim().length < 3" @click="ask">
                        <span v-if="!loading">Interroger les sources</span>
                        <span v-else>Analyse du corpus…</span>
                        <i v-if="!loading" data-lucide="arrow-right"></i>
                        <i v-else data-lucide="loader-circle" class="sv2-spin"></i>
                    </button>
                </div>

                <div class="sv2-query-controls">
                    <div class="sv2-profile-switch" aria-label="Profil de recherche">
                        <button v-for="item in profiles" :key="item.id" type="button" :class="{ active: profile === item.id }" @click="profile = item.id">
                            <i :data-lucide="item.icon"></i><span>{{ item.label }}</span>
                        </button>
                    </div>
                    <label>
                        <span>Discipline</span>
                        <select v-model="discipline">
                            <option v-for="item in disciplines" :key="item || 'all'" :value="item">{{ item || 'Détection automatique' }}</option>
                        </select>
                    </label>
                    <label>
                        <span>Niveau</span>
                        <select v-model="detailLevel">
                            <option value="brief">Essentiel</option>
                            <option value="standard">Standard</option>
                            <option value="deep">Approfondi</option>
                        </select>
                    </label>
                </div>
                <p class="sv2-shortcut"><kbd>Ctrl</kbd> + <kbd>Entrée</kbd> pour lancer · français et arabe acceptés</p>
            </section>

            <div v-if="error" class="sv2-alert"><i data-lucide="triangle-alert"></i><span>{{ error }}</span></div>

            <section v-if="!response && !loading" class="sv2-start">
                <div class="sv2-start-head">
                    <div><span>Commencer avec une question</span><h2>Quatre chemins pour tester la bibliothèque</h2></div>
                    <div class="sv2-start-stats">
                        <strong>{{ status.substantive_passages || 0 }}</strong><span>passages substantiels</span>
                    </div>
                </div>
                <div class="sv2-example-grid">
                    <button v-for="example in examples" :key="example.question" type="button" @click="chooseExample(example)">
                        <span class="sv2-example-icon"><i :data-lucide="example.icon"></i></span>
                        <small>{{ example.eyebrow }}</small>
                        <strong>{{ example.question }}</strong>
                        <b>Interroger <i data-lucide="arrow-right"></i></b>
                    </button>
                </div>
                <div class="sv2-principles">
                    <article><i data-lucide="scan-search"></i><div><strong>Retrouver</strong><span>Recherche française, arabe et conceptuelle.</span></div></article>
                    <article><i data-lucide="list-checks"></i><div><strong>Structurer</strong><span>Réponse, conditions, divergences et limites.</span></div></article>
                    <article><i data-lucide="quote"></i><div><strong>Vérifier</strong><span>Chaque affirmation ouvre le passage exact utilisé.</span></div></article>
                </div>
            </section>

            <section v-if="loading" class="sv2-loading" aria-live="polite">
                <div class="sv2-loading-orbit"><span></span><i data-lucide="book-open-check"></i></div>
                <div><strong>Lecture du corpus en cours</strong><span>Analyse de la question · classement des passages · audit des citations</span></div>
            </section>

            <section v-if="response && answer" class="sv2-response">
                <div class="sv2-analysis-strip">
                    <div><span>Discipline détectée</span><strong>{{ analysis?.discipline }}</strong></div>
                    <div><span>Cadre</span><strong>{{ analysis?.madhhab }}</strong></div>
                    <div><span>Type de question</span><strong>{{ analysis?.question_type }}</strong></div>
                    <div class="sv2-analysis-topics"><span>Notions</span><p><b v-for="topic in analysis?.topics" :key="topic">{{ topic }}</b></p></div>
                    <button type="button" @click="resetQuestion"><i data-lucide="rotate-ccw"></i>Nouvelle question</button>
                </div>

                <div class="sv2-confidence" :class="verdictClass">
                    <div class="sv2-confidence-score">
                        <svg viewBox="0 0 44 44" aria-hidden="true">
                            <circle cx="22" cy="22" r="18"></circle>
                            <circle cx="22" cy="22" r="18" :style="{ strokeDashoffset: 113 - (113 * (answer.coverage?.score || 0) / 100) }"></circle>
                        </svg>
                        <strong>{{ answer.coverage?.score || 0 }}<small>%</small></strong>
                    </div>
                    <div><span>Niveau de preuve</span><h2>{{ answer.coverage?.label }}</h2><p>{{ answer.summary }}</p></div>
                    <dl>
                        <div><dt>Passages utiles</dt><dd>{{ answer.coverage?.substantive_passages || 0 }}</dd></div>
                        <div><dt>Ouvrages distincts</dt><dd>{{ answer.coverage?.unique_books || 0 }}</dd></div>
                        <div><dt>Citations valides</dt><dd>{{ citationAudit?.valid_source_ids ? 'Oui' : 'À revoir' }}</dd></div>
                    </dl>
                </div>

                <div class="sv2-answer-layout">
                    <div class="sv2-answer-column">
                        <div class="sv2-section-title"><span>Réponse documentaire</span><p>{{ answer.claims?.length || 0 }} affirmation(s) vérifiable(s)</p></div>

                        <div v-if="!answer.claims?.length" class="sv2-insufficient">
                            <i data-lucide="shield-alert"></i>
                            <div><h3>Aucune conclusion produite</h3><p>Athar refuse de compléter la réponse lorsque le corpus ne contient pas de passage substantiel suffisant.</p></div>
                        </div>

                        <article v-for="claim in answer.claims" :key="claim.id" class="sv2-claim">
                            <div class="sv2-claim-head">
                                <span>{{ claim.kind === 'direct_excerpt' ? 'Extrait direct' : 'Synthèse sourcée' }}</span>
                                <b>{{ claim.support || 0 }} % de soutien</b>
                            </div>
                            <h3>{{ claim.title }}</h3>
                            <p>{{ claim.text }}</p>
                            <div class="sv2-claim-sources">
                                <button v-for="source in sourcesForClaim(claim)" :key="source.citation_id" type="button" @click="selectSource(source)">
                                    <span>[{{ source.citation_id }}]</span>{{ source.title }}<i data-lucide="arrow-up-right"></i>
                                </button>
                            </div>
                        </article>

                        <div v-if="answer.conditions?.length" class="sv2-subsection">
                            <div class="sv2-section-title"><span>Conditions repérées</span></div>
                            <article v-for="item in answer.conditions" :key="item.text" class="sv2-note-card condition">
                                <i data-lucide="list-checks"></i><div><h3>{{ item.title }}</h3><p>{{ item.text }}</p><button v-for="sourceId in item.source_ids" :key="sourceId" @click="selectSource(sourceId)">[{{ sourceId }}]</button></div>
                            </article>
                        </div>

                        <div v-if="answer.divergences?.length" class="sv2-subsection">
                            <div class="sv2-section-title"><span>Divergences et nuances</span></div>
                            <article v-for="item in answer.divergences" :key="item.text" class="sv2-note-card divergence">
                                <i data-lucide="git-compare-arrows"></i><div><h3>{{ item.title }}</h3><p>{{ item.text }}</p><button v-for="sourceId in item.source_ids" :key="sourceId" @click="selectSource(sourceId)">[{{ sourceId }}]</button></div>
                            </article>
                        </div>

                        <div class="sv2-limits">
                            <div class="sv2-section-title"><span>Limites de cette réponse</span></div>
                            <ul><li v-for="item in answer.limits" :key="item"><i data-lucide="circle-alert"></i>{{ item }}</li></ul>
                        </div>
                    </div>

                    <aside class="sv2-evidence" :class="{ empty: !selectedSource }">
                        <template v-if="selectedSource">
                            <div class="sv2-evidence-head">
                                <div><span>Preuve sélectionnée</span><strong>[{{ selectedSource.citation_id }}]</strong></div>
                                <b :class="{ verified: selectedSource.verification_status === 'Passage vérifié' }">{{ selectedSource.verification_status }}</b>
                            </div>
                            <h2>{{ selectedSource.title }}</h2>
                            <p class="sv2-evidence-arabic-title" lang="ar" dir="rtl">{{ selectedSource.title_ar }}</p>
                            <p class="sv2-evidence-author">{{ selectedSource.author }}</p>

                            <dl class="sv2-evidence-meta">
                                <div><dt>Type</dt><dd>{{ selectedSource.source_type }}</dd></div>
                                <div><dt>Discipline</dt><dd>{{ selectedSource.discipline || 'Non renseignée' }}</dd></div>
                                <div><dt>Madhhab</dt><dd>{{ selectedSource.madhhab || 'Transversal' }}</dd></div>
                                <div><dt>Localisation</dt><dd>{{ [selectedSource.volume ? 'vol. ' + selectedSource.volume : '', selectedSource.page != null ? 'p. ' + selectedSource.page : ''].filter(Boolean).join(' · ') || 'Non renseignée' }}</dd></div>
                            </dl>

                            <div v-if="selectedSource.chapter" class="sv2-evidence-chapter"><span>Chapitre</span><strong>{{ selectedSource.chapter }}</strong></div>

                            <div v-if="selectedSource.text_ar" class="sv2-source-text arabic">
                                <div><span>Texte arabe</span><b>Original indexé</b></div>
                                <p lang="ar" dir="rtl">{{ selectedSource.text_ar }}</p>
                            </div>
                            <div v-if="selectedSource.text_fr" class="sv2-source-text french">
                                <div><span>Traduction</span><b>{{ selectedSource.translation_status || 'Statut inconnu' }}</b></div>
                                <p>{{ selectedSource.text_fr }}</p>
                            </div>

                            <div class="sv2-evidence-actions">
                                <button type="button" @click="copyCitation(selectedSource)"><i data-lucide="copy"></i>{{ copiedSourceId === selectedSource.citation_id ? 'Copiée' : 'Copier la citation' }}</button>
                                <a v-if="selectedSource.source_url" :href="selectedSource.source_url" target="_blank" rel="noopener noreferrer"><i data-lucide="external-link"></i>Ouvrir la source</a>
                            </div>

                            <div class="sv2-source-list">
                                <span>Toutes les preuves</span>
                                <button v-for="source in sources" :key="source.citation_id" type="button" :class="{ active: selectedSourceId === source.citation_id }" @click="selectSource(source)">
                                    <b>[{{ source.citation_id }}]</b><span>{{ source.title }}</span><small>{{ source.score }}%</small>
                                </button>
                            </div>
                        </template>
                        <div v-else class="sv2-evidence-empty"><i data-lucide="book-x"></i><p>Aucune preuve sélectionnée.</p></div>
                    </aside>
                </div>
            </section>
        </main>

        <main v-else-if="mode === 'corpus'" class="sv2-corpus-space">
            <section class="sv2-corpus-hero">
                <div>
                    <span>Bibliothèque en construction contrôlée</span>
                    <h2>Moins de livres, mais chaque passage doit être traçable.</h2>
                    <p>L’objectif V2 est de structurer les volumes, chapitres, pages, traductions et statuts de vérification avant d’élargir massivement le corpus.</p>
                </div>
                <div class="sv2-corpus-ring"><strong>{{ corpusProgress }}%</strong><span>{{ status.books || 0 }} / {{ status.target_books || 25 }} ouvrages cibles</span></div>
            </section>

            <div class="sv2-corpus-stats">
                <article><span>Ouvrages</span><strong>{{ status.books || 0 }}</strong><small>objectif V2 : {{ status.target_books || 25 }}</small></article>
                <article><span>Passages indexés</span><strong>{{ status.chunks || 0 }}</strong><small>{{ status.pages || 0 }} pages distinctes</small></article>
                <article><span>Passages substantiels</span><strong>{{ status.substantive_passages || 0 }}</strong><small>{{ substantiveRatio }} % du corpus</small></article>
                <article><span>Notices seules</span><strong>{{ status.catalogue_notices || 0 }}</strong><small>non utilisées pour conclure</small></article>
            </div>

            <div class="sv2-corpus-grid">
                <article v-for="book in status.corpus" :key="book.id" class="sv2-book-card">
                    <div class="sv2-book-top"><span>{{ book.discipline || 'Ouvrage classique' }}</span><b>{{ book.indexed_pages || 0 }} page(s)</b></div>
                    <h3>{{ book.title }}</h3>
                    <p lang="ar" dir="rtl">{{ book.title_ar }}</p>
                    <strong>{{ book.author }}</strong>
                    <dl><div><dt>Madhhab</dt><dd>{{ book.madhhab || 'Transversal' }}</dd></div><div><dt>Passages</dt><dd>{{ book.chunks || 0 }}</dd></div><div><dt>Dernière synchro</dt><dd>{{ formatSync(book.last_sync) }}</dd></div></dl>
                    <a :href="book.source_url" target="_blank" rel="noopener noreferrer">Voir la notice source <i data-lucide="external-link"></i></a>
                </article>
            </div>
        </main>

        <main v-else class="sv2-quality-space">
            <section class="sv2-quality-hero">
                <div><span>Qualité mesurable</span><h2>Une bibliothèque religieuse doit savoir dire : « je ne sais pas encore ».</h2><p>La V2 mesure la récupération, la validité des citations, la diversité des sources et la capacité à refuser une conclusion insuffisamment étayée.</p></div>
                <div class="sv2-quality-score"><strong>{{ evaluation.cases }}</strong><span>questions de contrôle</span><small>objectif : {{ evaluation.target }}</small></div>
            </section>

            <div class="sv2-method-grid">
                <article><span>01</span><i data-lucide="scan-search"></i><h3>Analyser</h3><p>Détection de la discipline, du madhhab, du type de question et des notions arabes ou françaises.</p></article>
                <article><span>02</span><i data-lucide="layers-3"></i><h3>Récupérer</h3><p>Recherche lexicale enrichie, correspondances conceptuelles et priorité donnée aux textes substantiels.</p></article>
                <article><span>03</span><i data-lucide="badge-check"></i><h3>Auditer</h3><p>Chaque affirmation doit citer une source valide et aucune notice de catalogue ne peut soutenir une règle religieuse.</p></article>
                <article><span>04</span><i data-lucide="shield-alert"></i><h3>Refuser</h3><p>Lorsque la couverture est faible, Athar présente les documents disponibles sans inventer une conclusion.</p></article>
            </div>

            <section class="sv2-evaluation-panel">
                <div class="sv2-evaluation-head">
                    <div><span>Banc d’évaluation initial</span><h2>{{ evaluation.cases }} questions sur {{ evaluation.target }}</h2></div>
                    <div class="sv2-evaluation-progress"><span :style="{ width: evaluation.progress + '%' }"></span></div>
                </div>
                <div class="sv2-evaluation-list">
                    <article v-for="(item, index) in evaluation.items.slice(0, 12)" :key="item.id">
                        <span>{{ String(index + 1).padStart(2, '0') }}</span>
                        <div><strong>{{ item.question }}</strong><small>{{ item.discipline }} · {{ item.madhhab || 'Toutes sources' }}</small></div>
                        <button type="button" @click="query = item.question; profile = item.madhhab === 'Comparatif' ? 'compare' : item.madhhab ? 'maliki' : 'all'; discipline = item.discipline; mode = 'ask'; $nextTick(ask)">Tester</button>
                    </article>
                </div>
            </section>

            <div class="sv2-safety-note"><i data-lucide="info"></i><p><strong>Athar n’est pas un mufti.</strong> La bibliothèque aide à retrouver, comparer et citer les textes. Une question personnelle complexe doit être soumise à une personne qualifiée avec son contexte complet.</p></div>
        </main>
    </section>
    `
};
