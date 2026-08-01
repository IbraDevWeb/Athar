window.RootTreeView = {
    props: ['settings'],
    setup() {
        const { ref, computed, onMounted, onBeforeUnmount, nextTick } = Vue;
        const data = window.ROOT_TREE_DATA || { meta: {}, categories: [], roots: [], guides: [], glossary: [] };
        const storageKey = 'athar_root_tree_v1';

        const view = ref('explore');
        const selectedRootId = ref(data.roots?.[0]?.id || null);
        const selectedDerivativeId = ref(null);
        const category = ref('all');
        const search = ref('');
        const visited = ref([]);
        const showMethod = ref(false);
        const guideId = ref(null);
        const guideStep = ref(0);
        const searchInput = ref(null);

        const normalize = value => String(value || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim();

        const filteredRoots = computed(() => {
            const query = normalize(search.value);
            return data.roots.filter(root => {
                const matchesCategory = category.value === 'all' || root.category === category.value;
                if (!matchesCategory) return false;
                if (!query) return true;
                const haystack = [
                    root.root,
                    root.transliteration,
                    root.title,
                    root.core,
                    root.nuance,
                    ...root.derivatives.flatMap(item => [item.word, item.transliteration, item.label, item.note]),
                    ...root.verses.flatMap(item => [item.reference, item.arabic, item.translation])
                ].join(' ');
                return normalize(haystack).includes(query) || haystack.includes(search.value.trim());
            });
        });

        const selectedRoot = computed(() => data.roots.find(root => root.id === selectedRootId.value) || filteredRoots.value[0] || data.roots[0] || null);
        const selectedDerivative = computed(() => selectedRoot.value?.derivatives.find(item => item.id === selectedDerivativeId.value) || null);
        const selectedVerses = computed(() => {
            const root = selectedRoot.value;
            if (!root) return [];
            if (!selectedDerivative.value) return root.verses;
            return [...root.verses].sort((a, b) => {
                const aHit = a.focus.includes(selectedDerivative.value.word.replace(/[ًٌٍَُِّْٰ]/g, '')) || a.arabic.includes(selectedDerivative.value.word.split(' ')[0]);
                const bHit = b.focus.includes(selectedDerivative.value.word.replace(/[ًٌٍَُِّْٰ]/g, '')) || b.arabic.includes(selectedDerivative.value.word.split(' ')[0]);
                return Number(bHit) - Number(aHit);
            });
        });

        const activeGuide = computed(() => data.guides.find(guide => guide.id === guideId.value) || null);
        const activeGuideStep = computed(() => activeGuide.value?.steps?.[guideStep.value] || null);
        const visitedCount = computed(() => visited.value.length);
        const progressPercent = computed(() => data.roots.length ? Math.round((visitedCount.value / data.roots.length) * 100) : 0);

        const saveState = () => {
            try {
                localStorage.setItem(storageKey, JSON.stringify({
                    selectedRootId: selectedRootId.value,
                    visited: visited.value
                }));
            } catch (_) {}
        };

        const markVisited = id => {
            if (!id || visited.value.includes(id)) return;
            visited.value = [...visited.value, id];
            saveState();
        };

        const selectRoot = (id, derivativeId = null) => {
            if (!data.roots.some(root => root.id === id)) return;
            selectedRootId.value = id;
            selectedDerivativeId.value = derivativeId;
            markVisited(id);
            saveState();
        };

        const selectDerivative = id => {
            selectedDerivativeId.value = selectedDerivativeId.value === id ? null : id;
        };

        const clearSearch = () => {
            search.value = '';
            category.value = 'all';
        };

        const surprise = () => {
            const pool = data.roots.filter(root => root.id !== selectedRootId.value);
            const root = pool[Math.floor(Math.random() * pool.length)] || data.roots[0];
            if (root) selectRoot(root.id);
        };

        const moveRoot = direction => {
            const roots = filteredRoots.value.length ? filteredRoots.value : data.roots;
            if (!roots.length) return;
            const index = Math.max(0, roots.findIndex(root => root.id === selectedRoot.value?.id));
            const next = (index + direction + roots.length) % roots.length;
            selectRoot(roots[next].id);
        };

        const startGuide = id => {
            const guide = data.guides.find(item => item.id === id);
            if (!guide) return;
            guideId.value = id;
            guideStep.value = 0;
            view.value = 'guide';
            const first = guide.steps[0];
            selectRoot(first.rootId, first.derivativeId);
        };

        const goGuideStep = index => {
            if (!activeGuide.value) return;
            const bounded = Math.max(0, Math.min(index, activeGuide.value.steps.length - 1));
            guideStep.value = bounded;
            const step = activeGuide.value.steps[bounded];
            selectRoot(step.rootId, step.derivativeId);
        };

        const leaveGuide = () => {
            guideId.value = null;
            guideStep.value = 0;
            view.value = 'explore';
        };

        const openSource = url => {
            if (!url) return;
            window.open(url, '_blank', 'noopener,noreferrer');
        };

        const onKeydown = event => {
            const tag = event.target?.tagName?.toLowerCase();
            const typing = tag === 'input' || tag === 'textarea' || tag === 'select';
            if (event.key === '/' && !typing) {
                event.preventDefault();
                view.value = 'explore';
                nextTick(() => searchInput.value?.focus());
                return;
            }
            if (event.key === 'Escape') {
                if (showMethod.value) showMethod.value = false;
                else if (view.value === 'guide') leaveGuide();
                return;
            }
            if (typing || showMethod.value || view.value !== 'explore') return;
            if (event.key === 'ArrowLeft') moveRoot(-1);
            if (event.key === 'ArrowRight') moveRoot(1);
        };

        onMounted(() => {
            document.documentElement.classList.add('athar-root-tree-active');
            try {
                const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
                if (Array.isArray(saved.visited)) visited.value = saved.visited.filter(id => data.roots.some(root => root.id === id));
                if (data.roots.some(root => root.id === saved.selectedRootId)) selectedRootId.value = saved.selectedRootId;
            } catch (_) {}
            markVisited(selectedRootId.value);
            window.addEventListener('keydown', onKeydown);
        });

        onBeforeUnmount(() => {
            document.documentElement.classList.remove('athar-root-tree-active');
            window.removeEventListener('keydown', onKeydown);
        });

        return {
            data,
            view,
            selectedRootId,
            selectedDerivativeId,
            category,
            search,
            visited,
            showMethod,
            guideId,
            guideStep,
            searchInput,
            filteredRoots,
            selectedRoot,
            selectedDerivative,
            selectedVerses,
            activeGuide,
            activeGuideStep,
            visitedCount,
            progressPercent,
            selectRoot,
            selectDerivative,
            clearSearch,
            surprise,
            moveRoot,
            startGuide,
            goGuideStep,
            leaveGuide,
            openSource
        };
    },
    template: `
    <section class="rt7-shell">
        <div class="rt7-orb rt7-orb-one" aria-hidden="true"></div>
        <div class="rt7-orb rt7-orb-two" aria-hidden="true"></div>

        <header class="rt7-header">
            <div class="rt7-brand">
                <span class="rt7-brand-icon"><i data-lucide="sprout"></i></span>
                <span>
                    <small>Coran & langue</small>
                    <strong>L’Arbre des Racines</strong>
                </span>
            </div>

            <nav class="rt7-view-tabs" aria-label="Navigation de la section">
                <button type="button" :class="{ active: view === 'explore' }" @click="view = 'explore'; guideId = null">
                    <i data-lucide="git-branch"></i><span>Explorer</span>
                </button>
                <button type="button" :class="{ active: view === 'guide' }" @click="view = 'guide'">
                    <i data-lucide="route"></i><span>Parcours</span>
                </button>
            </nav>

            <div class="rt7-header-actions">
                <button type="button" class="rt7-progress" @click="showMethod = true" :aria-label="visitedCount + ' racines explorées'">
                    <span><b>{{ visitedCount }}</b>/{{ data.roots.length }}</span>
                    <span class="rt7-progress-track"><i :style="{ width: progressPercent + '%' }"></i></span>
                </button>
                <button type="button" class="rt7-icon-button" @click="showMethod = true" aria-label="Méthode et lexique">
                    <i data-lucide="info"></i>
                </button>
            </div>
        </header>

        <main v-if="view === 'explore'" class="rt7-explore">
            <section class="rt7-intro">
                <div>
                    <p class="rt7-kicker">Morphologie arabe · lecture pédagogique</p>
                    <h1>Une idée.<br><em>Une famille de mots.</em></h1>
                    <p>{{ data.meta.editorialNote }}</p>
                </div>
                <div class="rt7-intro-mark" aria-hidden="true">
                    <span>جذر</span>
                    <small>racine</small>
                </div>
            </section>

            <section class="rt7-toolbar" aria-label="Recherche et filtres">
                <label class="rt7-search">
                    <i data-lucide="search"></i>
                    <input ref="searchInput" v-model="search" type="search" placeholder="Chercher une racine, un mot ou un sens…" autocomplete="off">
                    <kbd>/</kbd>
                </label>
                <div class="rt7-categories">
                    <button v-for="item in data.categories" :key="item.id" type="button" :class="{ active: category === item.id }" @click="category = item.id">
                        <i :data-lucide="item.icon"></i><span>{{ item.label }}</span>
                    </button>
                </div>
                <button type="button" class="rt7-surprise" @click="surprise">
                    <i data-lucide="shuffle"></i><span>Découvrir</span>
                </button>
            </section>

            <div v-if="filteredRoots.length" class="rt7-workspace">
                <aside class="rt7-root-rail" aria-label="Racines disponibles">
                    <button
                        v-for="root in filteredRoots"
                        :key="root.id"
                        type="button"
                        :class="{ active: selectedRoot && selectedRoot.id === root.id, visited: visited.includes(root.id) }"
                        :style="{ '--root-accent': root.color }"
                        @click="selectRoot(root.id)">
                        <span class="rt7-rail-arabic">{{ root.root }}</span>
                        <span class="rt7-rail-copy"><strong>{{ root.title }}</strong><small>{{ root.transliteration }}</small></span>
                        <i v-if="visited.includes(root.id)" data-lucide="check"></i>
                    </button>
                </aside>

                <section v-if="selectedRoot" class="rt7-tree-stage" :style="{ '--root-accent': selectedRoot.color }">
                    <div class="rt7-tree-heading">
                        <button type="button" class="rt7-arrow" @click="moveRoot(-1)" aria-label="Racine précédente"><i data-lucide="arrow-left"></i></button>
                        <div>
                            <small>{{ selectedRoot.transliteration }}</small>
                            <h2>{{ selectedRoot.title }}</h2>
                        </div>
                        <button type="button" class="rt7-arrow" @click="moveRoot(1)" aria-label="Racine suivante"><i data-lucide="arrow-right"></i></button>
                    </div>

                    <div class="rt7-tree-canvas">
                        <div class="rt7-root-core">
                            <span class="rt7-root-label">La racine</span>
                            <div class="rt7-root-letters" dir="rtl">
                                <b v-for="letter in selectedRoot.letters" :key="letter">{{ letter }}</b>
                            </div>
                            <p>{{ selectedRoot.core }}</p>
                        </div>

                        <div class="rt7-branches" aria-label="Mots dérivés">
                            <button
                                v-for="(item, index) in selectedRoot.derivatives"
                                :key="item.id"
                                type="button"
                                :class="['rt7-branch', 'branch-' + (index + 1), { active: selectedDerivativeId === item.id }]"
                                @click="selectDerivative(item.id)">
                                <span class="rt7-branch-word" lang="ar" dir="rtl">{{ item.word }}</span>
                                <span><strong>{{ item.label }}</strong><small>{{ item.transliteration }} · {{ item.form }}</small></span>
                                <i data-lucide="chevron-right"></i>
                            </button>
                        </div>
                    </div>

                    <blockquote class="rt7-memory">
                        <i data-lucide="lightbulb"></i>
                        <span><small>Image mentale</small>{{ selectedRoot.memory }}</span>
                    </blockquote>
                </section>

                <aside v-if="selectedRoot" class="rt7-inspector">
                    <div class="rt7-inspector-head">
                        <span class="rt7-inspector-icon"><i :data-lucide="selectedDerivative ? 'focus' : 'scan-text'"></i></span>
                        <div>
                            <small>{{ selectedDerivative ? 'Mot sélectionné' : 'Champ de sens' }}</small>
                            <h3>{{ selectedDerivative ? selectedDerivative.word : selectedRoot.root }}</h3>
                        </div>
                    </div>

                    <div v-if="selectedDerivative" class="rt7-word-detail">
                        <p class="rt7-word-label">{{ selectedDerivative.label }}</p>
                        <div class="rt7-word-meta"><span>{{ selectedDerivative.transliteration }}</span><span>{{ selectedDerivative.form }}</span></div>
                        <p>{{ selectedDerivative.note }}</p>
                    </div>
                    <div v-else class="rt7-root-detail">
                        <p>{{ selectedRoot.nuance }}</p>
                    </div>

                    <div class="rt7-verses">
                        <div class="rt7-section-title"><span>Dans le Coran</span><small>{{ selectedVerses.length }} exemples</small></div>
                        <article v-for="verse in selectedVerses" :key="verse.reference">
                            <small>{{ verse.reference }}</small>
                            <p class="rt7-verse-arabic" lang="ar" dir="rtl">{{ verse.arabic }}</p>
                            <p>{{ verse.translation }}</p>
                            <span>{{ verse.focus }}</span>
                        </article>
                    </div>

                    <button type="button" class="rt7-source-button" @click="openSource(selectedRoot.sourceUrl)">
                        <i data-lucide="external-link"></i><span>Consulter l’analyse morphologique</span>
                    </button>
                </aside>
            </div>

            <section v-else class="rt7-empty">
                <i data-lucide="search-x"></i>
                <h2>Aucune racine trouvée</h2>
                <p>Essaie un autre mot ou réinitialise les filtres.</p>
                <button type="button" @click="clearSearch">Tout afficher</button>
            </section>
        </main>

        <main v-else class="rt7-guides">
            <section v-if="!activeGuide" class="rt7-guide-library">
                <header>
                    <p class="rt7-kicker">Apprentissage guidé</p>
                    <h1>Comprendre sans surinterpréter</h1>
                    <p>Trois parcours courts pour apprendre à reconnaître une famille de mots tout en laissant le contexte décider du sens précis.</p>
                </header>
                <div class="rt7-guide-grid">
                    <button v-for="(guide, index) in data.guides" :key="guide.id" type="button" @click="startGuide(guide.id)">
                        <span class="rt7-guide-number">0{{ index + 1 }}</span>
                        <span><small>{{ guide.duration }}</small><strong>{{ guide.title }}</strong><p>{{ guide.summary }}</p></span>
                        <i data-lucide="arrow-up-right"></i>
                    </button>
                </div>
            </section>

            <section v-else class="rt7-guide-reader">
                <header class="rt7-guide-header">
                    <button type="button" @click="leaveGuide"><i data-lucide="arrow-left"></i><span>Les parcours</span></button>
                    <div><small>Étape {{ guideStep + 1 }} sur {{ activeGuide.steps.length }}</small><strong>{{ activeGuide.title }}</strong></div>
                    <span class="rt7-guide-duration">{{ activeGuide.duration }}</span>
                </header>

                <div class="rt7-guide-progress"><span :style="{ width: ((guideStep + 1) / activeGuide.steps.length * 100) + '%' }"></span></div>

                <div class="rt7-guide-content" v-if="activeGuideStep && selectedRoot">
                    <div class="rt7-guide-root" :style="{ '--root-accent': selectedRoot.color }">
                        <small>{{ selectedRoot.transliteration }}</small>
                        <div dir="rtl"><b v-for="letter in selectedRoot.letters" :key="letter">{{ letter }}</b></div>
                        <p>{{ selectedRoot.title }}</p>
                    </div>
                    <article>
                        <span class="rt7-step-kicker">Étape {{ guideStep + 1 }}</span>
                        <h2>{{ activeGuideStep.title }}</h2>
                        <p>{{ activeGuideStep.text }}</p>
                        <div v-if="selectedDerivative" class="rt7-guide-word">
                            <span lang="ar" dir="rtl">{{ selectedDerivative.word }}</span>
                            <div><strong>{{ selectedDerivative.label }}</strong><small>{{ selectedDerivative.transliteration }} · {{ selectedDerivative.form }}</small></div>
                        </div>
                    </article>
                </div>

                <footer class="rt7-guide-controls">
                    <button type="button" :disabled="guideStep === 0" @click="goGuideStep(guideStep - 1)"><i data-lucide="arrow-left"></i><span>Précédent</span></button>
                    <div>
                        <button v-for="(_, index) in activeGuide.steps" :key="index" type="button" :class="{ active: index === guideStep, done: index < guideStep }" @click="goGuideStep(index)">{{ index + 1 }}</button>
                    </div>
                    <button v-if="guideStep < activeGuide.steps.length - 1" type="button" class="primary" @click="goGuideStep(guideStep + 1)"><span>Continuer</span><i data-lucide="arrow-right"></i></button>
                    <button v-else type="button" class="primary" @click="leaveGuide"><span>Terminer</span><i data-lucide="check"></i></button>
                </footer>
            </section>
        </main>

        <div v-if="showMethod" class="rt7-overlay" @click.self="showMethod = false">
            <section class="rt7-method" role="dialog" aria-modal="true" aria-labelledby="rt7-method-title">
                <header>
                    <div><small>Méthode</small><h2 id="rt7-method-title">Lire les racines avec précision</h2></div>
                    <button type="button" @click="showMethod = false" aria-label="Fermer"><i data-lucide="x"></i></button>
                </header>
                <p>{{ data.meta.editorialNote }}</p>
                <div class="rt7-glossary">
                    <article v-for="item in data.glossary" :key="item.term">
                        <span lang="ar" dir="rtl">{{ item.arabic }}</span>
                        <div><strong>{{ item.term }}</strong><p>{{ item.definition }}</p></div>
                    </article>
                </div>
                <div class="rt7-method-warning">
                    <i data-lucide="triangle-alert"></i>
                    <p>Une ressemblance de racine n’autorise pas à inventer une traduction. La forme grammaticale, le verset et l’usage arabe restent déterminants.</p>
                </div>
                <footer>
                    <button v-for="source in data.meta.sources" :key="source.url" type="button" @click="openSource(source.url)"><i data-lucide="external-link"></i><span>{{ source.label }}</span></button>
                </footer>
            </section>
        </div>
    </section>
    `
};
