// Athar Pro — Le Scriptorium, galerie pédagogique des manuscrits.
window.ScriptoriumView = {
    props: ['settings'],
    setup() {
        const { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick } = Vue;
        const data = window.SCRIPTORIUM_DATA || { meta: {}, folios: [], glossary: [], workshop: { scripts: [], supports: [] } };

        const mode = ref('gallery');
        const selectedId = ref(data.folios[0]?.id || null);
        const showMethodology = ref(false);
        const visited = ref([]);
        const workshop = reactive({
            script: 'kufic',
            support: 'parchment',
            orientation: 'landscape',
            lines: 7,
            gold: true,
            dots: true
        });

        const sampleLines = [
            'تتغير هيئة الصفحة بتغير الخط',
            'بين الحبر والورق يولد الإيقاع',
            'للخط ميزان وللصفحة نفس',
            'تدل العلامات القارئ على الطريق',
            'يحفظ الناسخ المعنى ويهذب الصورة',
            'كل مخطوط شاهد على زمنه'
        ];

        const selectedIndex = computed(() => Math.max(0, data.folios.findIndex((folio) => folio.id === selectedId.value)));
        const selected = computed(() => data.folios[selectedIndex.value] || data.folios[0] || null);
        const currentVisual = computed(() => selected.value?.visual || {});
        const lineIndexes = computed(() => Array.from({ length: Number(currentVisual.value.lineCount || 8) }, (_, index) => index));
        const visitedCount = computed(() => new Set(visited.value).size);
        const progress = computed(() => data.folios.length ? Math.round((visitedCount.value / data.folios.length) * 100) : 0);

        const workshopScript = computed(() => data.workshop.scripts.find((item) => item.id === workshop.script) || data.workshop.scripts[0]);
        const workshopSupport = computed(() => data.workshop.supports.find((item) => item.id === workshop.support) || data.workshop.supports[0]);
        const workshopLines = computed(() => Array.from({ length: Number(workshop.lines || 7) }, (_, index) => index));
        const workshopStyle = computed(() => ({
            '--sc-paper': workshopSupport.value?.color || '#e4d8b9',
            '--sc-ink': workshop.support === 'blue' ? '#d9b86c' : '#2f241d',
            '--sc-accent': workshop.gold ? '#bd9148' : '#7a5940'
        }));
        const selectedStyle = computed(() => ({
            '--sc-paper': currentVisual.value.paper || '#e4d8b9',
            '--sc-ink': currentVisual.value.ink || '#2f241d',
            '--sc-accent': selected.value?.accent || '#b98a52'
        }));

        const lineText = (index) => sampleLines[index % sampleLines.length];
        const isVisited = (id) => visited.value.includes(id);

        const persist = () => {
            try {
                localStorage.setItem('athar_scriptorium_v1', JSON.stringify({ visited: visited.value, selectedId: selectedId.value }));
            } catch (error) {
                console.warn('Progression du Scriptorium indisponible', error);
            }
        };

        const loadState = () => {
            try {
                const stored = JSON.parse(localStorage.getItem('athar_scriptorium_v1') || '{}');
                if (Array.isArray(stored.visited)) visited.value = stored.visited.filter((id) => data.folios.some((folio) => folio.id === id));
                if (stored.selectedId && data.folios.some((folio) => folio.id === stored.selectedId)) selectedId.value = stored.selectedId;
            } catch (error) {
                visited.value = [];
            }
        };

        const selectFolio = (id) => {
            if (!data.folios.some((folio) => folio.id === id)) return;
            selectedId.value = id;
            if (!visited.value.includes(id)) visited.value = [...visited.value, id];
            persist();
            nextTick(() => window.AtharIcons?.refresh?.());
        };

        const stepFolio = (direction) => {
            if (!data.folios.length) return;
            const next = (selectedIndex.value + direction + data.folios.length) % data.folios.length;
            selectFolio(data.folios[next].id);
        };

        const setMode = (nextMode) => {
            if (!['gallery', 'workshop', 'timeline'].includes(nextMode)) return;
            mode.value = nextMode;
            nextTick(() => window.AtharIcons?.refresh?.());
        };

        const onKeydown = (event) => {
            if (showMethodology.value) {
                if (event.key === 'Escape') showMethodology.value = false;
                return;
            }
            if (mode.value !== 'gallery') return;
            if (event.key === 'ArrowLeft') stepFolio(-1);
            if (event.key === 'ArrowRight') stepFolio(1);
        };

        onMounted(() => {
            loadState();
            document.documentElement.classList.add('athar-scriptorium-active');
            window.addEventListener('keydown', onKeydown);
            selectFolio(selectedId.value);
        });

        onBeforeUnmount(() => {
            document.documentElement.classList.remove('athar-scriptorium-active');
            window.removeEventListener('keydown', onKeydown);
        });

        return {
            data,
            mode,
            selected,
            selectedId,
            selectedIndex,
            currentVisual,
            lineIndexes,
            selectedStyle,
            visitedCount,
            progress,
            isVisited,
            selectFolio,
            stepFolio,
            setMode,
            showMethodology,
            workshop,
            workshopScript,
            workshopSupport,
            workshopLines,
            workshopStyle,
            lineText
        };
    },
    template: `
    <section class="sc7-shell">
        <div class="sc7-atmosphere" aria-hidden="true"></div>

        <header class="sc7-header">
            <div class="sc7-brand">
                <span class="sc7-brand-mark"><i data-lucide="feather"></i></span>
                <span>
                    <small>Arts du livre</small>
                    <strong>Le Scriptorium</strong>
                </span>
            </div>

            <nav class="sc7-tabs" aria-label="Espaces du Scriptorium">
                <button type="button" :class="{ active: mode === 'gallery' }" @click="setMode('gallery')">
                    <i data-lucide="gallery-horizontal-end"></i><span>Galerie</span>
                </button>
                <button type="button" :class="{ active: mode === 'workshop' }" @click="setMode('workshop')">
                    <i data-lucide="pen-tool"></i><span>Atelier</span>
                </button>
                <button type="button" :class="{ active: mode === 'timeline' }" @click="setMode('timeline')">
                    <i data-lucide="history"></i><span>Repères</span>
                </button>
            </nav>

            <button class="sc7-info-button" type="button" @click="showMethodology = true" aria-label="Méthode et lexique">
                <i data-lucide="info"></i>
            </button>
        </header>

        <main v-if="mode === 'gallery' && selected" class="sc7-gallery">
            <section class="sc7-stage" aria-label="Folio reconstitué">
                <div class="sc7-stage-meta">
                    <span>{{ selected.period }}</span>
                    <span>{{ selected.region }}</span>
                </div>

                <button class="sc7-arrow sc7-arrow-prev" type="button" @click="stepFolio(-1)" aria-label="Folio précédent">
                    <i data-lucide="arrow-left"></i>
                </button>

                <div class="sc7-folio-wrap">
                    <div
                        class="sc7-folio"
                        :class="[
                            'is-' + currentVisual.orientation,
                            'script-' + currentVisual.family,
                            'frame-' + currentVisual.frame,
                            { 'has-gold': currentVisual.gold, 'has-colored-dots': currentVisual.dots === 'colored' }
                        ]"
                        :style="selectedStyle">
                        <span class="sc7-folio-grain" aria-hidden="true"></span>
                        <span class="sc7-folio-frame" aria-hidden="true"></span>
                        <span v-if="currentVisual.gold" class="sc7-folio-heading">{{ selected.arabic }}</span>
                        <div class="sc7-lines" dir="rtl">
                            <div v-for="index in lineIndexes" :key="index" class="sc7-line" :class="{ 'is-short': index % 4 === 3 }">
                                <span>{{ lineText(index) }}</span>
                                <i v-if="currentVisual.dots !== 'sparse' && index % 3 === 1" class="sc7-verse-dot" aria-hidden="true"></i>
                            </div>
                        </div>
                        <span v-if="currentVisual.frame === 'illuminated' || currentVisual.frame === 'geometric'" class="sc7-medallion" aria-hidden="true"></span>
                    </div>
                    <p>Reconstitution graphique — non fac-similé</p>
                </div>

                <button class="sc7-arrow sc7-arrow-next" type="button" @click="stepFolio(1)" aria-label="Folio suivant">
                    <i data-lucide="arrow-right"></i>
                </button>
            </section>

            <aside class="sc7-inspector">
                <div class="sc7-inspector-progress">
                    <span>{{ visitedCount }}/{{ data.folios.length }} folios explorés</span>
                    <strong>{{ progress }}%</strong>
                </div>
                <div class="sc7-progress-track"><span :style="{ width: progress + '%' }"></span></div>

                <p class="sc7-kicker">Étape {{ selected.order }}</p>
                <h1>{{ selected.title }}</h1>
                <p class="sc7-arabic" dir="rtl">{{ selected.arabic }}</p>
                <p class="sc7-summary">{{ selected.summary }}</p>

                <dl class="sc7-facts">
                    <div><dt>Écriture</dt><dd>{{ selected.script }}</dd></div>
                    <div><dt>Support</dt><dd>{{ selected.support }}</dd></div>
                    <div><dt>Format</dt><dd>{{ selected.format }}</dd></div>
                    <div><dt>Lignes</dt><dd>{{ selected.lines }}</dd></div>
                </dl>

                <div class="sc7-insight">
                    <i data-lucide="eye"></i>
                    <p>{{ selected.insight }}</p>
                </div>

                <ul class="sc7-observations">
                    <li v-for="item in selected.observations" :key="item"><span></span>{{ item }}</li>
                </ul>

                <a class="sc7-source-link" :href="selected.source.url" target="_blank" rel="noopener noreferrer">
                    <span><small>Source institutionnelle</small><strong>{{ selected.source.institution }}</strong></span>
                    <i data-lucide="external-link"></i>
                </a>
            </aside>

            <nav class="sc7-rail" aria-label="Chronologie des folios">
                <button
                    v-for="folio in data.folios"
                    :key="folio.id"
                    type="button"
                    :class="{ active: folio.id === selectedId, visited: isVisited(folio.id) }"
                    @click="selectFolio(folio.id)">
                    <span class="sc7-rail-index">{{ folio.order }}</span>
                    <span class="sc7-rail-copy"><small>{{ folio.period }}</small><strong>{{ folio.title }}</strong></span>
                    <i v-if="isVisited(folio.id)" data-lucide="check"></i>
                </button>
            </nav>
        </main>

        <main v-else-if="mode === 'workshop'" class="sc7-workshop">
            <section class="sc7-workshop-preview">
                <div class="sc7-section-heading">
                    <p class="sc7-kicker">Expérience guidée</p>
                    <h1>Composer une page</h1>
                    <p>Change quelques paramètres et observe comment le support, le format et le nombre de lignes transforment immédiatement le rythme de lecture.</p>
                </div>

                <div class="sc7-workbench">
                    <div
                        class="sc7-folio is-workshop"
                        :class="[
                            'is-' + workshop.orientation,
                            'script-' + workshop.script,
                            { 'has-gold': workshop.gold, 'has-colored-dots': workshop.dots, 'is-blue': workshop.support === 'blue' }
                        ]"
                        :style="workshopStyle">
                        <span class="sc7-folio-grain" aria-hidden="true"></span>
                        <span class="sc7-folio-frame" aria-hidden="true"></span>
                        <span v-if="workshop.gold" class="sc7-folio-heading">{{ workshopScript.label }}</span>
                        <div class="sc7-lines" dir="rtl">
                            <div v-for="index in workshopLines" :key="index" class="sc7-line" :class="{ 'is-short': index % 4 === 3 }">
                                <span>{{ lineText(index) }}</span>
                                <i v-if="workshop.dots && index % 3 === 1" class="sc7-verse-dot" aria-hidden="true"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <aside class="sc7-controls">
                <div class="sc7-control-group">
                    <label>Écriture</label>
                    <div class="sc7-choice-list">
                        <button v-for="item in data.workshop.scripts" :key="item.id" type="button" :class="{ active: workshop.script === item.id }" @click="workshop.script = item.id">
                            <strong>{{ item.label }}</strong><small>{{ item.description }}</small>
                        </button>
                    </div>
                </div>

                <div class="sc7-control-group">
                    <label>Support</label>
                    <div class="sc7-supports">
                        <button v-for="item in data.workshop.supports" :key="item.id" type="button" :class="{ active: workshop.support === item.id }" @click="workshop.support = item.id">
                            <span :style="{ background: item.color }"></span>{{ item.label }}
                        </button>
                    </div>
                </div>

                <div class="sc7-control-group">
                    <label for="sc7-lines-range">Nombre de lignes <strong>{{ workshop.lines }}</strong></label>
                    <input id="sc7-lines-range" v-model.number="workshop.lines" type="range" min="5" max="17" step="1">
                </div>

                <div class="sc7-control-group">
                    <label>Format</label>
                    <div class="sc7-segmented">
                        <button type="button" :class="{ active: workshop.orientation === 'portrait' }" @click="workshop.orientation = 'portrait'">Vertical</button>
                        <button type="button" :class="{ active: workshop.orientation === 'landscape' }" @click="workshop.orientation = 'landscape'">Oblong</button>
                    </div>
                </div>

                <div class="sc7-toggles">
                    <label><input v-model="workshop.gold" type="checkbox"><span></span>Dorure</label>
                    <label><input v-model="workshop.dots" type="checkbox"><span></span>Repères colorés</label>
                </div>

                <div class="sc7-workshop-note">
                    <i data-lucide="lightbulb"></i>
                    <p><strong>{{ workshopScript.label }}</strong> — {{ workshopScript.description }}. Une page peu chargée paraît monumentale ; une page dense privilégie la continuité de lecture.</p>
                </div>
            </aside>
        </main>

        <main v-else class="sc7-timeline">
            <div class="sc7-section-heading">
                <p class="sc7-kicker">Six repères</p>
                <h1>Une histoire de la page</h1>
                <p>Cette frise ne prétend pas réduire la diversité des traditions manuscrites à une succession unique. Elle met simplement en évidence quelques transformations faciles à reconnaître.</p>
            </div>

            <ol class="sc7-timeline-list">
                <li v-for="folio in data.folios" :key="folio.id">
                    <button type="button" @click="selectFolio(folio.id); setMode('gallery')">
                        <span class="sc7-timeline-number">{{ folio.order }}</span>
                        <span class="sc7-timeline-period">{{ folio.period }}</span>
                        <span class="sc7-timeline-body">
                            <small>{{ folio.region }}</small>
                            <strong>{{ folio.title }}</strong>
                            <em>{{ folio.script }} · {{ folio.support }} · {{ folio.format }}</em>
                        </span>
                        <i data-lucide="arrow-up-right"></i>
                    </button>
                </li>
            </ol>
        </main>

        <div v-if="showMethodology" class="sc7-overlay" @click.self="showMethodology = false">
            <section class="sc7-dialog" role="dialog" aria-modal="true" aria-labelledby="sc7-dialog-title">
                <header>
                    <span><small>Comprendre la section</small><strong id="sc7-dialog-title">Méthode et lexique</strong></span>
                    <button type="button" @click="showMethodology = false" aria-label="Fermer"><i data-lucide="x"></i></button>
                </header>
                <div class="sc7-dialog-body">
                    <div class="sc7-method-card">
                        <i data-lucide="shield-check"></i>
                        <div><h2>Ce que vous regardez</h2><p>{{ data.meta.editorialNote }}</p><p>{{ data.meta.sourcePolicy }}</p></div>
                    </div>
                    <dl class="sc7-glossary">
                        <div v-for="item in data.glossary" :key="item.term"><dt>{{ item.term }}</dt><dd>{{ item.definition }}</dd></div>
                    </dl>
                </div>
            </section>
        </div>
    </section>
    `
};
