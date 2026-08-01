// Athar Pro — Les Nuits de l’Histoire.
window.HistoryNightsView = {
    props: ['settings'],
    setup() {
        const { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } = Vue;
        const dataset = window.HISTORY_NIGHTS_DATA || { meta: {}, stories: [] };
        const STORAGE_KEY = 'athar_history_nights_v1';

        const mode = ref('library');
        const activeStoryId = ref(dataset.stories[0]?.id || null);
        const chapterIndex = ref(0);
        const completed = ref([]);
        const showSources = ref(false);
        const showAbout = ref(false);
        const isSpeaking = ref(false);
        const isPaused = ref(false);
        const speechError = ref('');

        const storyIndex = computed(() => new Map(dataset.stories.map((story) => [story.id, story])));
        const activeStory = computed(() => storyIndex.value.get(activeStoryId.value) || dataset.stories[0] || null);
        const activeChapter = computed(() => activeStory.value?.chapters?.[chapterIndex.value] || null);
        const featuredStory = computed(() => dataset.stories.find((story) => story.featured) || dataset.stories[0] || null);
        const chapterCount = computed(() => activeStory.value?.chapters?.length || 0);
        const progress = computed(() => chapterCount.value ? Math.round(((chapterIndex.value + 1) / chapterCount.value) * 100) : 0);
        const speechSupported = computed(() => typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window);
        const narrationLabel = computed(() => {
            if (!speechSupported.value) return 'Lecture vocale indisponible';
            if (isPaused.value) return 'Reprendre la lecture';
            if (isSpeaking.value) return 'Mettre en pause';
            return 'Écouter ce chapitre';
        });
        const resumeStory = computed(() => {
            const saved = loadSavedState();
            return saved.storyId ? storyIndex.value.get(saved.storyId) || null : null;
        });
        const resumeChapterIndex = computed(() => {
            const saved = loadSavedState();
            return Number.isInteger(saved.chapterIndex) ? Math.max(0, saved.chapterIndex) : 0;
        });

        function loadSavedState() {
            try {
                const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
                return stored && typeof stored === 'object' ? stored : {};
            } catch (error) {
                return {};
            }
        }

        function persist() {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify({
                    storyId: activeStoryId.value,
                    chapterIndex: chapterIndex.value,
                    completed: completed.value
                }));
            } catch (error) {
                console.warn('Progression Nuits de l’Histoire indisponible', error);
            }
        }

        function refreshIcons() {
            nextTick(() => {
                if (window.AtharIcons?.refresh) window.AtharIcons.refresh();
                else if (window.lucide?.createIcons) window.lucide.createIcons();
            });
        }

        function stopNarration() {
            if (speechSupported.value) window.speechSynthesis.cancel();
            isSpeaking.value = false;
            isPaused.value = false;
        }

        function openStory(story, startAt = 0) {
            if (!story) return;
            stopNarration();
            activeStoryId.value = story.id;
            chapterIndex.value = Math.min(Math.max(Number(startAt) || 0, 0), Math.max(story.chapters.length - 1, 0));
            mode.value = 'reader';
            showSources.value = false;
            speechError.value = '';
            persist();
            refreshIcons();
        }

        function resumeReading() {
            const story = resumeStory.value;
            if (story) openStory(story, resumeChapterIndex.value);
        }

        function backToLibrary() {
            stopNarration();
            mode.value = 'library';
            showSources.value = false;
            refreshIcons();
        }

        function selectChapter(index) {
            if (!activeStory.value) return;
            stopNarration();
            chapterIndex.value = Math.min(Math.max(index, 0), activeStory.value.chapters.length - 1);
            speechError.value = '';
            persist();
            refreshIcons();
        }

        function previousChapter() {
            if (chapterIndex.value > 0) selectChapter(chapterIndex.value - 1);
        }

        function nextChapter() {
            if (chapterIndex.value < chapterCount.value - 1) selectChapter(chapterIndex.value + 1);
            else finishStory();
        }

        function finishStory() {
            if (!activeStory.value) return;
            if (!completed.value.includes(activeStory.value.id)) completed.value = [...completed.value, activeStory.value.id];
            persist();
            backToLibrary();
        }

        function toggleNarration() {
            speechError.value = '';
            if (!speechSupported.value || !activeChapter.value || !activeStory.value) {
                speechError.value = 'La lecture vocale n’est pas disponible dans ce navigateur.';
                return;
            }

            if (isSpeaking.value && isPaused.value) {
                window.speechSynthesis.resume();
                isPaused.value = false;
                return;
            }

            if (isSpeaking.value) {
                window.speechSynthesis.pause();
                isPaused.value = true;
                return;
            }

            window.speechSynthesis.cancel();
            const text = [
                activeStory.value.title,
                activeChapter.value.title,
                ...(activeChapter.value.body || []),
                `À retenir : ${activeChapter.value.reflection}`
            ].join('. ');
            const utterance = new SpeechSynthesisUtterance(text);
            const voices = window.speechSynthesis.getVoices();
            const frenchVoice = voices.find((voice) => String(voice.lang || '').toLowerCase().startsWith('fr'));
            if (frenchVoice) utterance.voice = frenchVoice;
            utterance.lang = 'fr-FR';
            utterance.rate = 0.92;
            utterance.pitch = 0.96;
            utterance.volume = 1;
            utterance.onstart = () => {
                isSpeaking.value = true;
                isPaused.value = false;
            };
            utterance.onend = () => {
                isSpeaking.value = false;
                isPaused.value = false;
            };
            utterance.onerror = (event) => {
                isSpeaking.value = false;
                isPaused.value = false;
                if (event.error !== 'canceled' && event.error !== 'interrupted') {
                    speechError.value = 'La lecture vocale a été interrompue par le navigateur.';
                }
            };
            window.speechSynthesis.speak(utterance);
        }

        function handleKeydown(event) {
            if (showSources.value || showAbout.value) {
                if (event.key === 'Escape') {
                    showSources.value = false;
                    showAbout.value = false;
                }
                return;
            }
            if (mode.value !== 'reader') return;
            const target = event.target;
            if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
            if (event.key === 'ArrowRight') nextChapter();
            if (event.key === 'ArrowLeft') previousChapter();
            if (event.key === 'Escape') backToLibrary();
        }

        onMounted(() => {
            const saved = loadSavedState();
            if (Array.isArray(saved.completed)) completed.value = saved.completed.filter((id) => storyIndex.value.has(id));
            if (saved.storyId && storyIndex.value.has(saved.storyId)) {
                activeStoryId.value = saved.storyId;
                chapterIndex.value = Math.min(Math.max(Number(saved.chapterIndex) || 0, 0), storyIndex.value.get(saved.storyId).chapters.length - 1);
            }
            document.documentElement.classList.add('athar-history-nights-active');
            window.addEventListener('keydown', handleKeydown);
            refreshIcons();
        });

        onBeforeUnmount(() => {
            stopNarration();
            document.documentElement.classList.remove('athar-history-nights-active');
            window.removeEventListener('keydown', handleKeydown);
        });

        watch([activeStoryId, chapterIndex, completed], persist, { deep: true });

        return {
            dataset,
            mode,
            activeStory,
            activeChapter,
            featuredStory,
            chapterIndex,
            chapterCount,
            progress,
            completed,
            showSources,
            showAbout,
            speechSupported,
            isSpeaking,
            isPaused,
            speechError,
            narrationLabel,
            resumeStory,
            resumeChapterIndex,
            openStory,
            resumeReading,
            backToLibrary,
            selectChapter,
            previousChapter,
            nextChapter,
            finishStory,
            toggleNarration,
            stopNarration
        };
    },
    template: `
    <section class="hn6-shell" :class="{ 'is-reading': mode === 'reader' }">
        <div class="hn6-stars" aria-hidden="true"></div>

        <div v-if="mode === 'library'" class="hn6-frame hn6-library">
            <header class="hn6-masthead">
                <div class="hn6-brand">
                    <span class="hn6-brand-mark"><i data-lucide="moon-star"></i></span>
                    <span>
                        <small>Récits immersifs</small>
                        <strong>Les Nuits de l’Histoire</strong>
                    </span>
                </div>
                <button class="hn6-icon-button" type="button" @click="showAbout = true" aria-label="À propos de cette section">
                    <i data-lucide="info"></i>
                </button>
            </header>

            <main>
                <article v-if="featuredStory" class="hn6-hero" :style="{ '--hn-accent': featuredStory.accent }">
                    <div class="hn6-hero-copy">
                        <div class="hn6-eyebrow"><span>Nuit {{ String(featuredStory.order).padStart(2, '0') }}</span><span>{{ featuredStory.theme }}</span></div>
                        <p class="hn6-arabic" dir="rtl">{{ featuredStory.arabic }}</p>
                        <h1>{{ featuredStory.title }}</h1>
                        <p class="hn6-hero-subtitle">{{ featuredStory.subtitle }}</p>
                        <p class="hn6-summary">{{ featuredStory.summary }}</p>
                        <div class="hn6-meta-row">
                            <span><i data-lucide="map-pin"></i>{{ featuredStory.location }}</span>
                            <span><i data-lucide="clock-3"></i>{{ featuredStory.duration }}</span>
                            <span><i data-lucide="book-open"></i>{{ featuredStory.chapters.length }} chapitres</span>
                        </div>
                        <div class="hn6-hero-actions">
                            <button class="hn6-primary" type="button" @click="openStory(featuredStory, 0)">
                                <i data-lucide="play"></i><span>Commencer le récit</span>
                            </button>
                            <button v-if="resumeStory" class="hn6-secondary" type="button" @click="resumeReading">
                                <i data-lucide="history"></i><span>Reprendre {{ resumeStory.title }}</span>
                            </button>
                        </div>
                    </div>
                    <blockquote class="hn6-hero-quote">
                        <i data-lucide="quote"></i>
                        <p>{{ featuredStory.opening }}</p>
                        <cite>{{ featuredStory.openingSource }}</cite>
                    </blockquote>
                </article>

                <section class="hn6-collection" aria-labelledby="hn6-collection-title">
                    <header>
                        <div>
                            <small>La collection</small>
                            <h2 id="hn6-collection-title">Quatre nuits, quatre décisions</h2>
                        </div>
                        <p>Chaque récit se lit en une douzaine de minutes, chapitre après chapitre.</p>
                    </header>

                    <div class="hn6-story-grid">
                        <button
                            v-for="story in dataset.stories"
                            :key="story.id"
                            type="button"
                            class="hn6-story-card"
                            :class="{ 'is-complete': completed.includes(story.id) }"
                            :style="{ '--hn-accent': story.accent }"
                            @click="openStory(story, 0)">
                            <span class="hn6-card-number">{{ String(story.order).padStart(2, '0') }}</span>
                            <span class="hn6-card-icon"><i :data-lucide="story.icon"></i></span>
                            <span class="hn6-card-copy">
                                <small>{{ story.period }} · {{ story.theme }}</small>
                                <strong>{{ story.title }}</strong>
                                <em>{{ story.subtitle }}</em>
                            </span>
                            <span class="hn6-card-state">
                                <i v-if="completed.includes(story.id)" data-lucide="check"></i>
                                <i v-else data-lucide="arrow-up-right"></i>
                            </span>
                        </button>
                    </div>
                </section>
            </main>
        </div>

        <div v-else-if="activeStory && activeChapter" class="hn6-reader">
            <header class="hn6-reader-header">
                <button type="button" class="hn6-reader-back" @click="backToLibrary">
                    <i data-lucide="arrow-left"></i><span>Collection</span>
                </button>
                <div class="hn6-reader-title">
                    <small>{{ activeStory.title }}</small>
                    <strong>Chapitre {{ chapterIndex + 1 }} sur {{ chapterCount }}</strong>
                </div>
                <button type="button" class="hn6-icon-button" @click="showSources = true" aria-label="Voir les sources">
                    <i data-lucide="library"></i>
                </button>
            </header>

            <div class="hn6-reader-progress" aria-hidden="true"><span :style="{ width: progress + '%' }"></span></div>

            <div class="hn6-reader-layout">
                <nav class="hn6-chapter-rail" aria-label="Chapitres du récit">
                    <button
                        v-for="(chapter, index) in activeStory.chapters"
                        :key="chapter.id"
                        type="button"
                        :class="{ active: index === chapterIndex, done: index < chapterIndex }"
                        @click="selectChapter(index)">
                        <span>{{ String(index + 1).padStart(2, '0') }}</span>
                        <span><small>{{ chapter.kicker }}</small><strong>{{ chapter.title }}</strong></span>
                    </button>
                </nav>

                <article class="hn6-reading-sheet">
                    <header>
                        <div class="hn6-reading-kicker"><span>{{ activeChapter.kicker }}</span><span>{{ activeChapter.readTime }}</span></div>
                        <p class="hn6-reading-arabic" dir="rtl">{{ activeStory.arabic }}</p>
                        <h1>{{ activeChapter.title }}</h1>
                    </header>

                    <div class="hn6-prose">
                        <p v-for="(paragraph, index) in activeChapter.body" :key="index">{{ paragraph }}</p>
                    </div>

                    <aside class="hn6-reflection">
                        <i data-lucide="sparkles"></i>
                        <div><small>À retenir</small><p>{{ activeChapter.reflection }}</p></div>
                    </aside>
                </article>
            </div>

            <footer class="hn6-player">
                <div class="hn6-player-story">
                    <span :style="{ '--hn-accent': activeStory.accent }"><i :data-lucide="activeStory.icon"></i></span>
                    <div><small>{{ activeStory.theme }}</small><strong>{{ activeChapter.title }}</strong></div>
                </div>

                <div class="hn6-player-controls">
                    <button type="button" @click="previousChapter" :disabled="chapterIndex === 0" aria-label="Chapitre précédent"><i data-lucide="skip-back"></i></button>
                    <button type="button" class="hn6-narrate" @click="toggleNarration" :disabled="!speechSupported" :aria-label="narrationLabel">
                        <i :data-lucide="isSpeaking && !isPaused ? 'pause' : 'volume-2'"></i>
                    </button>
                    <button type="button" @click="nextChapter" :aria-label="chapterIndex === chapterCount - 1 ? 'Terminer le récit' : 'Chapitre suivant'">
                        <i :data-lucide="chapterIndex === chapterCount - 1 ? 'check' : 'skip-forward'"></i>
                    </button>
                </div>

                <div class="hn6-player-status">
                    <small>{{ narrationLabel }}</small>
                    <span>{{ progress }} %</span>
                </div>
                <p v-if="speechError" class="hn6-speech-error">{{ speechError }}</p>
            </footer>
        </div>

        <transition name="fade">
            <div v-if="showSources" class="hn6-overlay" @click.self="showSources = false">
                <section class="hn6-dialog" role="dialog" aria-modal="true" aria-labelledby="hn6-sources-title">
                    <header>
                        <div><small>Références</small><h2 id="hn6-sources-title">Sources du récit</h2></div>
                        <button type="button" @click="showSources = false" aria-label="Fermer"><i data-lucide="x"></i></button>
                    </header>
                    <div class="hn6-dialog-body">
                        <p>Le récit distingue les faits rattachés aux sources de la mise en scène éditoriale destinée à faciliter la lecture.</p>
                        <ol><li v-for="source in activeStory.sources" :key="source">{{ source }}</li></ol>
                    </div>
                </section>
            </div>
        </transition>

        <transition name="fade">
            <div v-if="showAbout" class="hn6-overlay" @click.self="showAbout = false">
                <section class="hn6-dialog" role="dialog" aria-modal="true" aria-labelledby="hn6-about-title">
                    <header>
                        <div><small>Méthode éditoriale</small><h2 id="hn6-about-title">À propos des Nuits</h2></div>
                        <button type="button" @click="showAbout = false" aria-label="Fermer"><i data-lucide="x"></i></button>
                    </header>
                    <div class="hn6-dialog-body">
                        <p>{{ dataset.meta.editorialNote }}</p>
                        <p>La lecture vocale utilise uniquement les capacités du navigateur. Aucune voix ni donnée d’écoute n’est envoyée à un service tiers par ce module.</p>
                    </div>
                </section>
            </div>
        </transition>
    </section>
    `
};
