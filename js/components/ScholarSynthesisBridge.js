// Athar Research — synthèse IA strictement fondée sur les passages RAG
(() => {
    'use strict';

    const component = window.ScholarLibraryV4View;
    if (!component || typeof component.setup !== 'function' || typeof component.template !== 'string') return;
    if (component.__atharGroundedSynthesis) return;

    const DEFAULT_ORIGIN = 'https://athar-rag-ibradevweb.onrender.com';
    const REMOTE_CONFIG = 'rag/remote.json';
    const MODE_KEY = 'athar_research_answer_mode_v1';
    const HISTORY_KEY = 'athar_research_history_v1';
    const REQUEST_TIMEOUT_MS = 150000;
    let cachedOrigin = '';

    const validOrigin = value => {
        try {
            const url = new URL(String(value || ''));
            return url.protocol === 'https:' ? url.origin : '';
        } catch (_) {
            return '';
        }
    };

    const resolveOrigin = async () => {
        if (cachedOrigin) return cachedOrigin;
        try {
            const url = new URL(REMOTE_CONFIG, window.location.href);
            url.searchParams.set('v', 'rag-v5-synthesis');
            const request = await window.fetch(url.href, { cache: 'no-store', headers: { Accept: 'application/json' } });
            if (request.ok) {
                const configured = validOrigin((await request.json())?.origin);
                if (configured) return (cachedOrigin = configured);
            }
        } catch (_) {}
        return (cachedOrigin = DEFAULT_ORIGIN);
    };

    const fetchSynthesis = async payload => {
        const origin = await resolveOrigin();
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
        try {
            const request = await window.fetch(origin + '/api/rag/v5/synthesize', {
                method: 'POST',
                cache: 'no-store',
                signal: controller.signal,
                headers: { Accept: 'application/json', 'Content-Type': 'application/json; charset=utf-8' },
                body: JSON.stringify(payload)
            });
            const data = await request.json().catch(() => ({}));
            if (!request.ok) throw new Error(data?.error || `HTTP ${request.status}`);
            if (!data?.ok || Number(data?.engine_version || 0) !== 5 || data?.engine !== 'rag-v5-hybrid-multilingual') {
                throw new Error('Le moteur de synthèse Athar V5 n’est pas disponible.');
            }
            return data;
        } finally {
            window.clearTimeout(timeout);
        }
    };

    const storeHistory = (query, payload) => {
        try {
            const parsed = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
            const current = Array.isArray(parsed) ? parsed : [];
            const item = {
                id: String(Date.now()),
                query,
                created_at: new Date().toISOString(),
                count: Number(payload?.count || 0),
                routed_book: payload?.analysis?.routed_book?.title || '',
                top_books: [...new Set((payload?.sources || []).map(source => source.title).filter(Boolean))].slice(0, 3),
                answer_mode: 'synthesis'
            };
            const next = [item, ...current.filter(entry => entry?.query !== query)].slice(0, 20);
            localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
        } catch (_) {}
    };

    const originalSetup = component.setup;
    component.setup = function groundedSynthesisSetup(props) {
        const base = originalSetup(props);
        const { ref, computed, nextTick } = Vue;
        const answerMode = ref(localStorage.getItem(MODE_KEY) === 'evidence' ? 'evidence' : 'synthesis');
        const synthesisStage = ref('');

        const synthesis = computed(() => base.answer?.value?.synthesis || null);
        const synthesisError = computed(() => base.answer?.value?.synthesis_error || '');
        const synthesisSourceIds = computed(() => base.response?.value?.synthesis_source_ids || synthesis.value?.source_ids || []);
        const isSynthesisMode = computed(() => answerMode.value === 'synthesis');

        const setAnswerMode = value => {
            answerMode.value = value === 'evidence' ? 'evidence' : 'synthesis';
            try { localStorage.setItem(MODE_KEY, answerMode.value); } catch (_) {}
        };

        const runSynthesis = async () => {
            const value = String(base.query?.value || '').trim();
            if (base.loading?.value || value.length < 3) return;
            base.loading.value = true;
            base.error.value = '';
            base.response.value = null;
            base.selectedSourceId.value = '';
            if (base.translationError) base.translationError.value = '';
            synthesisStage.value = 'Recherche des passages dans le corpus…';
            try {
                // The endpoint performs retrieval first, then synthesizes only its own RAG results.
                const pending = fetchSynthesis({
                    query: value,
                    limit: 12,
                    madhhab: base.madhhab?.value || '',
                    discipline: base.discipline?.value || ''
                });
                window.setTimeout(() => {
                    if (base.loading?.value) synthesisStage.value = 'Comparaison des passages et des positions…';
                }, 900);
                const payload = await pending;
                base.response.value = payload;
                if (base.status) base.status.value = { ...base.status.value, connected: true, engine_version: 5 };
                base.selectedSourceId.value = payload.sources?.[0]?.citation_id || '';
                storeHistory(value, payload);
                synthesisStage.value = payload?.answer?.synthesis
                    ? 'Synthèse terminée'
                    : 'Passages retrouvés — synthèse indisponible';
                nextTick(() => document.querySelector('.ar5-results')?.scrollIntoView?.({ behavior: 'smooth', block: 'start' }));
            } catch (failure) {
                base.error.value = failure?.name === 'AbortError'
                    ? 'La recherche et la synthèse ont dépassé le délai prévu.'
                    : 'Synthèse impossible : ' + (failure?.message || 'serveur indisponible');
            } finally {
                base.loading.value = false;
            }
        };

        const runQuestion = () => answerMode.value === 'synthesis' ? runSynthesis() : base.ask();
        const chooseExample = value => {
            base.query.value = value;
            if (base.mode) base.mode.value = 'ask';
            nextTick(runQuestion);
        };
        const rerunHistory = item => {
            base.query.value = item?.query || '';
            if (base.mode) base.mode.value = 'ask';
            if (item?.answer_mode === 'synthesis') setAnswerMode('synthesis');
            nextTick(runQuestion);
        };
        const onComposerKeydown = event => {
            if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                event.preventDefault();
                runQuestion();
            }
        };
        const selectSynthesisSource = sourceId => {
            base.selectSource?.(sourceId);
            nextTick(() => document.querySelector('.ar5-evidence')?.scrollIntoView?.({ behavior: 'smooth', block: 'nearest' }));
        };
        const positionStatusLabel = computed(() => {
            const value = synthesis.value?.position_status;
            if (value === 'multiple') return 'Plusieurs positions retrouvées';
            if (value === 'single') return 'Une position documentée';
            if (value === 'not_applicable') return 'Synthèse documentaire';
            return 'Preuves limitées';
        });

        return {
            ...base,
            answerMode,
            synthesis,
            synthesisError,
            synthesisSourceIds,
            synthesisStage,
            isSynthesisMode,
            positionStatusLabel,
            setAnswerMode,
            runQuestion,
            chooseExample,
            rerunHistory,
            onComposerKeydown,
            selectSynthesisSource
        };
    };

    const modeAnchor = '<div class="ar5-composer" :class="{ busy: loading }">';
    if (component.template.includes(modeAnchor)) {
        component.template = component.template.replace(modeAnchor, `
                        <div class="ar5-answer-modes" role="group" aria-label="Type de réponse">
                            <button type="button" :class="{ active: answerMode === 'synthesis' }" @click="setAnswerMode('synthesis')">
                                <span><i data-lucide="sparkles"></i></span>
                                <strong>Synthèse IA</strong>
                                <small>Comparer et résumer les positions sourcées</small>
                            </button>
                            <button type="button" :class="{ active: answerMode === 'evidence' }" @click="setAnswerMode('evidence')">
                                <span><i data-lucide="quote"></i></span>
                                <strong>Passages uniquement</strong>
                                <small>Afficher les preuves sans synthèse</small>
                            </button>
                        </div>
                        ${modeAnchor}`);
    }

    component.template = component.template.replace(
        '@click="ask"><i v-if="!loading" data-lucide="arrow-up-right"></i><i v-else data-lucide="loader-circle" class="ar5-spin"></i><span>{{ loading ? \'Recherche…\' : \'Rechercher\' }}</span></button>',
        '@click="runQuestion"><i v-if="!loading" :data-lucide="answerMode === \'synthesis\' ? \'sparkles\' : \'arrow-up-right\'"></i><i v-else data-lucide="loader-circle" class="ar5-spin"></i><span>{{ loading ? (answerMode === \'synthesis\' ? \'Analyse…\' : \'Recherche…\') : (answerMode === \'synthesis\' ? \'Analyser le corpus\' : \'Rechercher\') }}</span></button>'
    );

    component.template = component.template.replace(
        '<section v-if="loading" class="ar5-loading" aria-live="polite"><span class="ar5-loading-mark"><i data-lucide="scan-search"></i></span><div><strong>Recherche dans les ouvrages</strong><p>Analyse des notions · interrogation de l’index · classement des passages</p></div></section>',
        '<section v-if="loading" class="ar5-loading" aria-live="polite"><span class="ar5-loading-mark"><i :data-lucide="answerMode === \'synthesis\' ? \'sparkles\' : \'scan-search\'"></i></span><div><strong>{{ answerMode === \'synthesis\' ? \'Athar analyse les sources\' : \'Recherche dans les ouvrages\' }}</strong><p>{{ answerMode === \'synthesis\' ? (synthesisStage || \'Recherche RAG puis synthèse des positions\') : \'Analyse des notions · interrogation de l’index · classement des passages\' }}</p></div></section>'
    );

    const synthesisAnchor = '<div v-if="sources.length" class="ar5-result-layout">';
    if (component.template.includes(synthesisAnchor)) {
        component.template = component.template.replace(synthesisAnchor, `
                        <section v-if="synthesis" class="ar5-synthesis" aria-label="Synthèse IA fondée sur les sources">
                            <header class="ar5-synthesis-head">
                                <div><span><i data-lucide="sparkles"></i> Synthèse du corpus</span><h3>{{ positionStatusLabel }}</h3></div>
                                <div class="ar5-synthesis-provider"><b>Gemini</b><small>{{ synthesis.model }}</small></div>
                            </header>
                            <p class="ar5-synthesis-overview">{{ synthesis.overview }}</p>
                            <div class="ar5-synthesis-proofline"><i data-lucide="shield-check"></i><span>Générée uniquement à partir de {{ synthesis.source_count }} passage{{ synthesis.source_count > 1 ? 's' : '' }} retrouvé{{ synthesis.source_count > 1 ? 's' : '' }} par le RAG Athar.</span></div>

                            <div v-if="synthesis.positions?.length" class="ar5-position-section">
                                <div class="ar5-synthesis-subhead"><span>Positions retrouvées</span><strong>{{ synthesis.positions.length }}</strong></div>
                                <div class="ar5-position-grid">
                                    <article v-for="(position, index) in synthesis.positions" :key="index" class="ar5-position-card">
                                        <div class="ar5-position-index">{{ String(index + 1).padStart(2, '0') }}</div>
                                        <div class="ar5-position-copy"><div class="ar5-position-title"><h4>{{ position.title }}</h4><span v-if="position.school_or_tradition">{{ position.school_or_tradition }}</span></div><p>{{ position.summary }}</p><div class="ar5-position-citations"><button v-for="sourceId in position.source_ids" :key="sourceId" type="button" @click="selectSynthesisSource(sourceId)">[{{ sourceId }}]</button></div></div>
                                    </article>
                                </div>
                            </div>

                            <div v-if="synthesis.agreements?.length || synthesis.differences?.length" class="ar5-synthesis-compare">
                                <article v-if="synthesis.agreements?.length"><header><i data-lucide="equal"></i><strong>Convergences</strong></header><ul><li v-for="(item, index) in synthesis.agreements" :key="index">{{ item }}</li></ul></article>
                                <article v-if="synthesis.differences?.length"><header><i data-lucide="split"></i><strong>Divergences</strong></header><ul><li v-for="(item, index) in synthesis.differences" :key="index">{{ item }}</li></ul></article>
                            </div>

                            <div v-if="synthesis.limits?.length" class="ar5-synthesis-limits"><header><i data-lucide="triangle-alert"></i><strong>Limites de cette synthèse</strong></header><ul><li v-for="(item, index) in synthesis.limits" :key="index">{{ item }}</li></ul></div>
                            <footer class="ar5-synthesis-notice"><i data-lucide="book-open-check"></i><span>{{ synthesis.notice }}</span></footer>
                        </section>
                        <section v-else-if="synthesisError" class="ar5-synthesis-fallback"><i data-lucide="circle-alert"></i><div><strong>Synthèse IA indisponible</strong><p>{{ synthesisError }}</p><small>Les passages retrouvés par le RAG sont affichés ci-dessous et restent consultables.</small></div></section>

                        ${synthesisAnchor}`);
    }

    component.__atharGroundedSynthesis = true;
    window.AtharScholarSynthesis = { resolveOrigin, fetchSynthesis };
})();
