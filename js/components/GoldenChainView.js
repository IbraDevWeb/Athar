// Athar Pro — La Chaîne d’Or
window.GoldenChainView = {
    name: 'GoldenChainView',
    props: ['settings'],
    setup() {
        const { ref, computed, onMounted, onBeforeUnmount, nextTick } = Vue;
        const data = window.GOLDEN_CHAIN_DATA || { meta: {}, chains: [], narrators: [], lessons: [], glossary: [] };
        const storageKey = 'athar_golden_chain_v1';

        const mode = ref('explore');
        const selectedChainId = ref(data.chains[0]?.id || '');
        const selectedNarratorId = ref(data.chains[0]?.route?.[0] || '');
        const showMethod = ref(false);
        const showSample = ref(false);
        const activeLessonId = ref('');
        const lessonStep = ref(0);
        const visited = ref([]);

        const narratorMap = computed(() => new Map(data.narrators.map(item => [item.id, item])));
        const selectedChain = computed(() => data.chains.find(item => item.id === selectedChainId.value) || data.chains[0] || null);
        const routeNarrators = computed(() => (selectedChain.value?.route || []).map(id => narratorMap.value.get(id)).filter(Boolean));
        const selectedNarrator = computed(() => narratorMap.value.get(selectedNarratorId.value) || routeNarrators.value[0] || null);
        const activeLesson = computed(() => data.lessons.find(item => item.id === activeLessonId.value) || null);
        const currentLessonStep = computed(() => activeLesson.value?.steps?.[lessonStep.value] || null);
        const progress = computed(() => data.chains.length ? Math.round((new Set(visited.value).size / data.chains.length) * 100) : 0);

        const persist = () => {
            try {
                localStorage.setItem(storageKey, JSON.stringify({
                    selectedChainId: selectedChainId.value,
                    visited: [...new Set(visited.value)]
                }));
            } catch (error) {
                console.warn('[Athar] Progression de La Chaîne d’Or non enregistrée.', error);
            }
        };

        const markVisited = id => {
            if (!id || visited.value.includes(id)) return;
            visited.value = [...visited.value, id];
            persist();
        };

        const selectChain = id => {
            const chain = data.chains.find(item => item.id === id);
            if (!chain) return;
            selectedChainId.value = id;
            selectedNarratorId.value = chain.route[0] || '';
            showSample.value = false;
            markVisited(id);
            persist();
        };

        const selectNarrator = id => {
            if (!narratorMap.value.has(id)) return;
            selectedNarratorId.value = id;
        };

        const setMode = value => {
            mode.value = value;
            showSample.value = false;
            if (value !== 'learn') {
                activeLessonId.value = '';
                lessonStep.value = 0;
            }
            nextTick(() => document.querySelector('.gc8-shell')?.scrollTo?.({ top: 0, behavior: 'smooth' }));
        };

        const stepChain = delta => {
            const index = data.chains.findIndex(item => item.id === selectedChainId.value);
            if (index < 0) return;
            const next = (index + delta + data.chains.length) % data.chains.length;
            selectChain(data.chains[next].id);
        };

        const startLesson = id => {
            activeLessonId.value = id;
            lessonStep.value = 0;
        };

        const stepLesson = delta => {
            if (!activeLesson.value) return;
            lessonStep.value = Math.max(0, Math.min(activeLesson.value.steps.length - 1, lessonStep.value + delta));
        };

        const closeOverlays = () => {
            showMethod.value = false;
            showSample.value = false;
        };

        const handleKeydown = event => {
            if (event.key === 'Escape') {
                closeOverlays();
                if (activeLessonId.value) activeLessonId.value = '';
                return;
            }
            if (showMethod.value || showSample.value) return;
            if (mode.value === 'explore' && event.key === 'ArrowLeft') stepChain(-1);
            if (mode.value === 'explore' && event.key === 'ArrowRight') stepChain(1);
        };

        onMounted(() => {
            document.documentElement.classList.add('athar-golden-chain-active');
            try {
                const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
                if (Array.isArray(saved.visited)) visited.value = saved.visited.filter(id => data.chains.some(item => item.id === id));
                if (data.chains.some(item => item.id === saved.selectedChainId)) selectedChainId.value = saved.selectedChainId;
            } catch (error) {
                console.warn('[Athar] Progression de La Chaîne d’Or non restaurée.', error);
            }
            selectedNarratorId.value = selectedChain.value?.route?.[0] || '';
            markVisited(selectedChainId.value);
            window.addEventListener('keydown', handleKeydown);
        });

        onBeforeUnmount(() => {
            document.documentElement.classList.remove('athar-golden-chain-active');
            window.removeEventListener('keydown', handleKeydown);
        });

        return {
            data,
            mode,
            selectedChainId,
            selectedNarratorId,
            selectedChain,
            routeNarrators,
            selectedNarrator,
            showMethod,
            showSample,
            activeLessonId,
            activeLesson,
            lessonStep,
            currentLessonStep,
            visited,
            progress,
            selectChain,
            selectNarrator,
            setMode,
            stepChain,
            startLesson,
            stepLesson,
            closeOverlays
        };
    },
    template: `
    <section class="gc8-shell" aria-label="La Chaîne d’Or">
        <header class="gc8-header">
            <div class="gc8-heading">
                <p class="gc8-kicker">Sciences du hadith · Isnād</p>
                <div class="gc8-title-row">
                    <div>
                        <h1>{{ data.meta.title }}</h1>
                        <p class="gc8-arabic-title" lang="ar" dir="rtl">{{ data.meta.arabic }}</p>
                    </div>
                    <button type="button" class="gc8-method-btn" @click="showMethod = true">
                        <span aria-hidden="true">i</span>
                        Méthode
                    </button>
                </div>
                <p class="gc8-subtitle">{{ data.meta.subtitle }}</p>
            </div>

            <div class="gc8-progress" aria-label="Progression">
                <div class="gc8-progress-copy">
                    <span>{{ visited.length }} / {{ data.chains.length }} routes explorées</span>
                    <strong>{{ progress }} %</strong>
                </div>
                <div class="gc8-progress-track"><span :style="{ width: progress + '%' }"></span></div>
            </div>
        </header>

        <nav class="gc8-tabs" aria-label="Espaces de La Chaîne d’Or">
            <button type="button" :class="{ active: mode === 'explore' }" @click="setMode('explore')">Explorer</button>
            <button type="button" :class="{ active: mode === 'compare' }" @click="setMode('compare')">Comparer</button>
            <button type="button" :class="{ active: mode === 'learn' }" @click="setMode('learn')">Apprendre</button>
        </nav>

        <main v-if="mode === 'explore'" class="gc8-workspace">
            <aside class="gc8-chain-rail" aria-label="Choix de la chaîne">
                <div class="gc8-rail-head">
                    <span>Routes étudiées</span>
                    <span>{{ data.chains.length }}</span>
                </div>
                <button
                    v-for="chain in data.chains"
                    :key="chain.id"
                    type="button"
                    class="gc8-chain-option"
                    :class="{ active: selectedChainId === chain.id, visited: visited.includes(chain.id) }"
                    @click="selectChain(chain.id)"
                >
                    <span class="gc8-chain-dot" :style="{ '--chain-color': chain.color }"></span>
                    <span class="gc8-chain-option-copy">
                        <strong>{{ chain.title }}</strong>
                        <small>{{ chain.region }} · {{ chain.route.length }} maillons</small>
                    </span>
                    <span class="gc8-check" aria-hidden="true">{{ visited.includes(chain.id) ? '✓' : '→' }}</span>
                </button>
            </aside>

            <article v-if="selectedChain" class="gc8-stage" :style="{ '--chain-color': selectedChain.color }">
                <div class="gc8-stage-head">
                    <div>
                        <p class="gc8-badge">{{ selectedChain.badge }}</p>
                        <h2>{{ selectedChain.title }}</h2>
                        <p class="gc8-chain-arabic" lang="ar" dir="rtl">{{ selectedChain.arabic }}</p>
                    </div>
                    <div class="gc8-stage-controls">
                        <button type="button" @click="stepChain(-1)" aria-label="Chaîne précédente">←</button>
                        <button type="button" @click="stepChain(1)" aria-label="Chaîne suivante">→</button>
                    </div>
                </div>

                <p class="gc8-stage-summary">{{ selectedChain.summary }}</p>

                <div class="gc8-route-wrap">
                    <p class="gc8-direction">{{ data.meta.direction }}</p>
                    <div class="gc8-route" role="list" aria-label="Narrateurs de la chaîne">
                        <template v-for="(narrator, index) in routeNarrators" :key="narrator.id">
                            <button
                                type="button"
                                class="gc8-node"
                                :class="{ active: selectedNarratorId === narrator.id, prophet: narrator.generation === 'prophet' }"
                                @click="selectNarrator(narrator.id)"
                                role="listitem"
                            >
                                <span class="gc8-node-mark">{{ narrator.monogram }}</span>
                                <span class="gc8-node-copy">
                                    <strong>{{ narrator.name }}</strong>
                                    <small>{{ narrator.dates }}</small>
                                    <em>{{ narrator.city }}</em>
                                </span>
                            </button>
                            <div v-if="index < routeNarrators.length - 1" class="gc8-link" aria-hidden="true">
                                <span></span>
                                <small>{{ selectedChain.linkLabels[index] }}</small>
                                <b>›</b>
                            </div>
                        </template>
                    </div>
                </div>

                <div class="gc8-stage-footer">
                    <div class="gc8-source-card">
                        <span>Repère documentaire</span>
                        <strong>{{ selectedChain.collection }}</strong>
                        <small>{{ selectedChain.reference }}</small>
                    </div>
                    <button type="button" class="gc8-sample-btn" @click="showSample = true">
                        <span aria-hidden="true">✦</span>
                        Lire l’exemple transmis
                    </button>
                </div>

                <p class="gc8-scholarly-note">{{ selectedChain.scholarlyNote }}</p>
            </article>

            <aside v-if="selectedNarrator" class="gc8-inspector">
                <p class="gc8-inspector-label">Narrateur sélectionné</p>
                <div class="gc8-inspector-identity">
                    <span class="gc8-inspector-mark">{{ selectedNarrator.monogram }}</span>
                    <div>
                        <h3>{{ selectedNarrator.name }}</h3>
                        <p lang="ar" dir="rtl">{{ selectedNarrator.arabic }}</p>
                    </div>
                </div>
                <div class="gc8-meta-grid">
                    <div><span>Génération</span><strong>{{ data.generations.find(item => item.id === selectedNarrator.generation)?.short }}</strong></div>
                    <div><span>Lieu</span><strong>{{ selectedNarrator.city }}</strong></div>
                </div>
                <div class="gc8-inspector-section">
                    <span>Rôle</span>
                    <p>{{ selectedNarrator.role }}</p>
                </div>
                <div class="gc8-inspector-section">
                    <span>Profil</span>
                    <p>{{ selectedNarrator.summary }}</p>
                </div>
                <div class="gc8-inspector-section">
                    <span>Transmission</span>
                    <p>{{ selectedNarrator.transmission }}</p>
                </div>
                <div class="gc8-appraisal">
                    <span aria-hidden="true">◈</span>
                    <p>{{ selectedNarrator.appraisal }}</p>
                </div>
            </aside>
        </main>

        <main v-else-if="mode === 'compare'" class="gc8-compare">
            <div class="gc8-section-intro">
                <p class="gc8-kicker">Lecture comparative</p>
                <h2>Mêmes sources, itinéraires différents</h2>
                <p>Compare la longueur du noyau, la ville dominante, le type de relation et la collection choisie comme exemple.</p>
            </div>

            <div class="gc8-compare-grid">
                <article v-for="chain in data.chains" :key="chain.id" class="gc8-compare-card" :style="{ '--chain-color': chain.color }">
                    <div class="gc8-compare-top">
                        <span class="gc8-chain-dot"></span>
                        <small>{{ chain.region }}</small>
                    </div>
                    <h3>{{ chain.title }}</h3>
                    <p lang="ar" dir="rtl">{{ chain.arabic }}</p>
                    <div class="gc8-mini-route" aria-label="Résumé de la chaîne">
                        <template v-for="(id, index) in chain.route" :key="id">
                            <span :title="data.narrators.find(item => item.id === id)?.name">{{ data.narrators.find(item => item.id === id)?.monogram }}</span>
                            <b v-if="index < chain.route.length - 1">›</b>
                        </template>
                    </div>
                    <dl>
                        <div><dt>Maillons</dt><dd>{{ chain.route.length }}</dd></div>
                        <div><dt>Collection</dt><dd>{{ chain.collection }}</dd></div>
                        <div><dt>Exemple</dt><dd>{{ chain.sample.theme }}</dd></div>
                    </dl>
                    <button type="button" @click="selectChain(chain.id); setMode('explore')">Ouvrir cette route</button>
                </article>
            </div>
        </main>

        <main v-else class="gc8-learn">
            <div v-if="!activeLesson" class="gc8-lessons-home">
                <div class="gc8-section-intro">
                    <p class="gc8-kicker">Parcours guidés</p>
                    <h2>Comprendre la méthode avant de juger une chaîne</h2>
                    <p>Trois lectures courtes pour acquérir les bons réflexes sans réduire la science du hadith à un score automatique.</p>
                </div>
                <div class="gc8-lesson-grid">
                    <button v-for="(lesson, index) in data.lessons" :key="lesson.id" type="button" @click="startLesson(lesson.id)">
                        <span>0{{ index + 1 }}</span>
                        <div><strong>{{ lesson.title }}</strong><small>{{ lesson.duration }} · {{ lesson.steps.length }} étapes</small></div>
                        <b>→</b>
                    </button>
                </div>
            </div>

            <article v-else class="gc8-guide-reader">
                <button type="button" class="gc8-guide-close" @click="activeLessonId = ''">← Tous les parcours</button>
                <div class="gc8-guide-layout">
                    <aside>
                        <p class="gc8-kicker">{{ activeLesson.duration }}</p>
                        <h2>{{ activeLesson.title }}</h2>
                        <ol>
                            <li v-for="(step, index) in activeLesson.steps" :key="step.title" :class="{ active: lessonStep === index, done: lessonStep > index }">
                                <button type="button" @click="lessonStep = index"><span>{{ index + 1 }}</span>{{ step.title }}</button>
                            </li>
                        </ol>
                    </aside>
                    <div class="gc8-guide-page">
                        <span class="gc8-guide-number">0{{ lessonStep + 1 }}</span>
                        <p>Étape {{ lessonStep + 1 }} sur {{ activeLesson.steps.length }}</p>
                        <h3>{{ currentLessonStep.title }}</h3>
                        <div class="gc8-guide-rule"></div>
                        <p class="gc8-guide-text">{{ currentLessonStep.text }}</p>
                        <div class="gc8-guide-actions">
                            <button type="button" :disabled="lessonStep === 0" @click="stepLesson(-1)">Précédent</button>
                            <button type="button" :disabled="lessonStep === activeLesson.steps.length - 1" @click="stepLesson(1)">Continuer</button>
                        </div>
                    </div>
                </div>
            </article>
        </main>

        <div v-if="showSample && selectedChain" class="gc8-overlay" @click.self="showSample = false">
            <article class="gc8-dialog gc8-sample-dialog" role="dialog" aria-modal="true" aria-label="Exemple transmis">
                <button type="button" class="gc8-dialog-close" @click="showSample = false" aria-label="Fermer">×</button>
                <p class="gc8-kicker">{{ selectedChain.sample.theme }}</p>
                <h2>{{ selectedChain.title }}</h2>
                <blockquote lang="ar" dir="rtl">{{ selectedChain.sample.arabic }}</blockquote>
                <p class="gc8-sample-translation">{{ selectedChain.sample.french }}</p>
                <p class="gc8-sample-note">{{ selectedChain.sample.note }}</p>
                <a :href="selectedChain.sourceUrl" target="_blank" rel="noopener noreferrer">Consulter la notice de la source ↗</a>
            </article>
        </div>

        <div v-if="showMethod" class="gc8-overlay" @click.self="showMethod = false">
            <article class="gc8-dialog" role="dialog" aria-modal="true" aria-label="Méthodologie">
                <button type="button" class="gc8-dialog-close" @click="showMethod = false" aria-label="Fermer">×</button>
                <p class="gc8-kicker">Méthodologie</p>
                <h2>Ce que montre la visualisation</h2>
                <p>{{ data.meta.editorialNote }}</p>
                <p>{{ data.meta.sourcePolicy }}</p>
                <div class="gc8-glossary">
                    <div v-for="item in data.glossary" :key="item.term"><strong>{{ item.term }}</strong><span>{{ item.definition }}</span></div>
                </div>
            </article>
        </div>
    </section>
    `
};
