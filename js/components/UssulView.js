const UssulView = {
    props: ['lessons', 'formatText', 'goHome'],
    data() {
        return {
            activeLesson: null,
            query: '',
            scrollProgress: 0,
            activeSection: 0,
            showMobileToc: false,
            completedLessons: [],
            lastLessonId: null,
            videoOpen: false,
            videoMode: 'theater',
            videoError: false,
            dragPosition: { x: null, y: null },
            dragState: null
        };
    },
    computed: {
        filteredLessons() {
            const q = this.normalize(this.query);
            if (!q) return this.lessons;
            return this.lessons.filter(lesson => {
                const sections = Array.isArray(lesson.sections) ? lesson.sections : [];
                const text = [
                    lesson.title,
                    lesson.author,
                    lesson.intro,
                    ...sections.map(section => `${section.title || ''} ${section.content || ''} ${section.deepDive?.title || ''} ${section.deepDive?.content || ''}`)
                ].join(' ');
                return this.normalize(text).includes(q);
            });
        },
        currentIndex() {
            return this.activeLesson ? this.lessons.indexOf(this.activeLesson) : -1;
        },
        prevLesson() {
            return this.currentIndex > 0 ? this.lessons[this.currentIndex - 1] : null;
        },
        nextLesson() {
            return this.currentIndex >= 0 && this.currentIndex < this.lessons.length - 1 ? this.lessons[this.currentIndex + 1] : null;
        },
        totalSections() {
            return this.lessons.reduce((total, lesson) => total + (Array.isArray(lesson.sections) ? lesson.sections.length : 0), 0);
        },
        completionPercent() {
            return this.lessons.length ? Math.round((this.completedLessons.length / this.lessons.length) * 100) : 0;
        },
        lastLesson() {
            return this.lessons.find(lesson => this.lessonKey(lesson) === String(this.lastLessonId)) || this.lessons.find(lesson => String(lesson.id) === String(this.lastLessonId)) || null;
        },
        isCurrentCompleted() {
            return this.activeLesson ? this.completedLessons.includes(this.lessonKey(this.activeLesson)) : false;
        },
        videoId() {
            return this.extractYouTubeId(this.activeLesson?.videoUrl || '');
        },
        videoEmbedUrl() {
            if (!this.videoId) return '';
            const params = new URLSearchParams({
                rel: '0',
                modestbranding: '1',
                playsinline: '1',
                enablejsapi: '1',
                iv_load_policy: '3'
            });
            if (typeof window !== 'undefined' && /^https?:$/.test(window.location.protocol)) {
                params.set('origin', window.location.origin);
            }
            return `https://www.youtube-nocookie.com/embed/${this.videoId}?${params.toString()}`;
        },
        playerStyle() {
            if (this.videoMode !== 'floating' || this.dragPosition.x === null || this.dragPosition.y === null) return {};
            return {
                left: `${this.dragPosition.x}px`,
                top: `${this.dragPosition.y}px`,
                right: 'auto',
                bottom: 'auto'
            };
        },
        readingTime() {
            if (!this.activeLesson) return 0;
            const text = (this.activeLesson.sections || []).map(section => `${section.content || ''} ${section.deepDive?.content || ''}`).join(' ');
            const plain = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
            return Math.max(5, Math.ceil(plain.split(' ').filter(Boolean).length / 180));
        }
    },
    mounted() {
        this.loadState();
        window.addEventListener('resize', this.keepPlayerVisible);
        this.refreshIcons();
    },
    beforeUnmount() {
        this.removeDragListeners();
        window.removeEventListener('resize', this.keepPlayerVisible);
    },
    methods: {
        lessonKey(lesson) {
            const index = this.lessons.indexOf(lesson);
            return `${index}:${lesson?.id ?? 'lesson'}:${lesson?.title || ''}`;
        },
        cleanSectionTitle(value) {
            return String(value || '').replace(/^[0-9]+\.\s*/, '').trim();
        },
        normalize(value) {
            return String(value || '')
                .toLocaleLowerCase('fr')
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/<[^>]+>/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
        },
        loadState() {
            try {
                const saved = JSON.parse(localStorage.getItem('athar_ussul_v2') || '{}');
                this.completedLessons = Array.isArray(saved.completedLessons) ? saved.completedLessons.map(String) : [];
                this.lastLessonId = saved.lastLessonId ?? null;
            } catch (_) {
                this.completedLessons = [];
                this.lastLessonId = null;
            }
        },
        saveState() {
            localStorage.setItem('athar_ussul_v2', JSON.stringify({
                completedLessons: this.completedLessons,
                lastLessonId: this.lastLessonId
            }));
        },
        selectLesson(lesson) {
            if (!lesson) return;
            this.activeLesson = lesson;
            this.lastLessonId = this.lessonKey(lesson);
            this.activeSection = 0;
            this.scrollProgress = 0;
            this.showMobileToc = false;
            this.closeVideo();
            this.saveState();
            this.$nextTick(() => {
                const reader = this.$refs.readerScroll;
                if (reader) reader.scrollTop = 0;
                this.refreshIcons();
            });
        },
        selectLessonAndVideo(lesson) {
            this.selectLesson(lesson);
            this.$nextTick(() => this.openVideo('theater'));
        },
        handleBack() {
            if (this.activeLesson) {
                this.closeVideo();
                this.activeLesson = null;
                this.scrollProgress = 0;
                this.activeSection = 0;
                this.$nextTick(this.refreshIcons);
                return;
            }
            this.goHome();
        },
        toggleComplete() {
            if (!this.activeLesson) return;
            const id = this.lessonKey(this.activeLesson);
            this.completedLessons = this.completedLessons.includes(id)
                ? this.completedLessons.filter(item => item !== id)
                : [...this.completedLessons, id];
            this.saveState();
            this.refreshIcons();
        },
        isCompleted(lesson) {
            return this.completedLessons.includes(this.lessonKey(lesson));
        },
        onReaderScroll(event) {
            const container = event.currentTarget;
            const max = container.scrollHeight - container.clientHeight;
            this.scrollProgress = max > 0 ? Math.min(100, Math.max(0, (container.scrollTop / max) * 100)) : 0;
            const sections = Array.from(container.querySelectorAll('[data-ussul-section]'));
            const marker = container.scrollTop + 190;
            let current = 0;
            sections.forEach((section, index) => {
                if (section.offsetTop <= marker) current = index;
            });
            this.activeSection = current;
        },
        scrollToSection(index) {
            const container = this.$refs.readerScroll;
            const target = this.$refs.readerRoot?.querySelector(`#ussul-section-${index}`);
            if (!container || !target) return;
            container.scrollTo({ top: Math.max(0, target.offsetTop - 105), behavior: 'smooth' });
            this.activeSection = index;
            this.showMobileToc = false;
        },
        extractYouTubeId(value) {
            const raw = String(value || '').trim();
            if (!raw) return '';
            try {
                const url = new URL(raw, window.location.href);
                const host = url.hostname.replace(/^www\./, '');
                if (host === 'youtu.be') return url.pathname.split('/').filter(Boolean)[0] || '';
                if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
                    if (url.searchParams.get('v')) return url.searchParams.get('v');
                    const parts = url.pathname.split('/').filter(Boolean);
                    const markerIndex = parts.findIndex(part => ['embed', 'shorts', 'live'].includes(part));
                    if (markerIndex >= 0 && parts[markerIndex + 1]) return parts[markerIndex + 1];
                }
            } catch (_) {}
            const match = raw.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([A-Za-z0-9_-]{11})/);
            return match ? match[1] : '';
        },
        openVideo(mode = 'theater') {
            if (!this.videoId) {
                this.openExternalVideo();
                return;
            }
            this.videoError = false;
            this.videoMode = mode;
            this.videoOpen = true;
            if (mode === 'theater') this.dragPosition = { x: null, y: null };
            this.$nextTick(this.refreshIcons);
        },
        minimizeVideo() {
            this.videoMode = 'floating';
            this.videoError = false;
            this.$nextTick(() => {
                this.keepPlayerVisible();
                this.refreshIcons();
            });
        },
        expandVideo() {
            this.videoMode = 'theater';
            this.dragPosition = { x: null, y: null };
            this.refreshIcons();
        },
        closeVideo() {
            this.videoOpen = false;
            this.videoError = false;
            this.dragState = null;
            this.dragPosition = { x: null, y: null };
            this.removeDragListeners();
        },
        openExternalVideo() {
            if (!this.activeLesson?.videoUrl) return;
            window.open(this.activeLesson.videoUrl, '_blank', 'noopener,noreferrer');
        },
        startDrag(event) {
            if (this.videoMode !== 'floating' || event.button !== 0) return;
            const player = this.$refs.videoPlayer;
            if (!player) return;
            const rect = player.getBoundingClientRect();
            this.dragState = {
                startX: event.clientX,
                startY: event.clientY,
                originX: rect.left,
                originY: rect.top,
                width: rect.width,
                height: rect.height
            };
            window.addEventListener('pointermove', this.onDrag);
            window.addEventListener('pointerup', this.endDrag, { once: true });
            event.preventDefault();
        },
        onDrag(event) {
            if (!this.dragState) return;
            const nextX = this.dragState.originX + event.clientX - this.dragState.startX;
            const nextY = this.dragState.originY + event.clientY - this.dragState.startY;
            this.dragPosition = {
                x: Math.min(Math.max(12, nextX), Math.max(12, window.innerWidth - this.dragState.width - 12)),
                y: Math.min(Math.max(72, nextY), Math.max(72, window.innerHeight - this.dragState.height - 12))
            };
        },
        endDrag() {
            this.dragState = null;
            this.removeDragListeners();
        },
        removeDragListeners() {
            window.removeEventListener('pointermove', this.onDrag);
            window.removeEventListener('pointerup', this.endDrag);
        },
        keepPlayerVisible() {
            if (!this.videoOpen || this.videoMode !== 'floating' || this.dragPosition.x === null) return;
            const player = this.$refs.videoPlayer;
            if (!player) return;
            const rect = player.getBoundingClientRect();
            this.dragPosition = {
                x: Math.min(Math.max(12, this.dragPosition.x), Math.max(12, window.innerWidth - rect.width - 12)),
                y: Math.min(Math.max(72, this.dragPosition.y), Math.max(72, window.innerHeight - rect.height - 12))
            };
        },
        refreshIcons() {
            setTimeout(() => window.lucide?.createIcons(), 30);
        }
    },
    template: `
    <div ref="readerRoot" class="ussul-pro-root">
        <div class="ussul-pro-progress-line" :style="{width:scrollProgress+'%'}"></div>

        <header class="ussul-pro-header">
            <button @click="handleBack" class="ussul-pro-back">
                <i data-lucide="arrow-left"></i>
                <span>{{ activeLesson ? 'Sommaire' : 'Accueil' }}</span>
            </button>
            <div class="ussul-pro-brand">
                <span lang="ar" dir="rtl">أصول الفقه</span>
                <b>{{ activeLesson ? activeLesson.title : 'Oussoul al-Fiqh' }}</b>
            </div>
            <div class="ussul-pro-header-actions">
                <button v-if="activeLesson" @click="showMobileToc=!showMobileToc" class="ussul-mobile-toc-button"><i data-lucide="list"></i></button>
                <button v-if="activeLesson" @click="openVideo('theater')" class="ussul-video-launch"><i data-lucide="play"></i><span>Voir le cours</span></button>
            </div>
        </header>

        <main v-if="!activeLesson" class="ussul-pro-index">
            <section class="ussul-pro-hero">
                <div class="ussul-pro-hero-copy">
                    <span class="ussul-pro-kicker">Parcours académique</span>
                    <p class="ussul-pro-arabic" lang="ar" dir="rtl">أصول الفقه</p>
                    <h1>Oussoul al-Fiqh</h1>
                    <p>Maîtrisez les fondements de la jurisprudence islamique à travers les cours déjà présents dans Athar.</p>
                    <div class="ussul-pro-stats">
                        <span><b>{{ lessons.length }}</b> cours</span>
                        <span><b>{{ totalSections }}</b> chapitres</span>
                        <span><b>{{ completionPercent }}%</b> terminé</span>
                    </div>
                </div>
                <div class="ussul-pro-progress-card">
                    <div class="ussul-pro-progress-ring" :style="{'--progress':completionPercent+'%'}"><strong>{{ completionPercent }}%</strong></div>
                    <div><span>Progression locale</span><b>{{ completedLessons.length }} leçon{{ completedLessons.length>1?'s':'' }} terminée{{ completedLessons.length>1?'s':'' }}</b><p>Les données restent sur cet appareil.</p></div>
                </div>
            </section>

            <section class="ussul-pro-tools">
                <label><i data-lucide="search"></i><input v-model="query" type="search" placeholder="Rechercher un cours, une notion ou un auteur…"></label>
                <button v-if="lastLesson" @click="selectLesson(lastLesson)"><i data-lucide="history"></i><span>Reprendre : {{ lastLesson.title }}</span></button>
            </section>

            <section v-if="filteredLessons.length" class="ussul-pro-course-grid">
                <article v-for="(lesson,index) in filteredLessons" :key="lessonKey(lesson)" class="ussul-pro-course-card" :class="{completed:isCompleted(lesson)}">
                    <button class="ussul-pro-course-main" @click="selectLesson(lesson)">
                        <div class="ussul-pro-course-number"><span>{{ String(index+1).padStart(2,'0') }}</span><i v-if="isCompleted(lesson)" data-lucide="check"></i></div>
                        <p class="ussul-pro-course-author">{{ lesson.author }}</p>
                        <h2>{{ lesson.title }}</h2>
                        <p>{{ lesson.intro }}</p>
                        <footer><span><i data-lucide="layers-3"></i>{{ lesson.sections.length }} parties</span><b>Étudier <i data-lucide="arrow-right"></i></b></footer>
                    </button>
                    <button class="ussul-pro-course-video" @click="selectLessonAndVideo(lesson)" title="Lire la vidéo dans Athar"><i data-lucide="picture-in-picture-2"></i><span>Vidéo intégrée</span></button>
                </article>
            </section>
            <div v-else class="ussul-pro-empty"><i data-lucide="search-x"></i><p>Aucun cours ne correspond à cette recherche.</p></div>
        </main>

        <div v-else class="ussul-pro-study">
            <aside class="ussul-pro-sidebar" :class="{open:showMobileToc}">
                <div class="ussul-pro-sidebar-head"><span>Parcours</span><button @click="showMobileToc=false"><i data-lucide="x"></i></button></div>
                <nav class="ussul-pro-lesson-nav">
                    <button v-for="lesson in lessons" :key="lessonKey(lesson)" @click="selectLesson(lesson)" :class="{active:lesson===activeLesson,completed:isCompleted(lesson)}">
                        <span>{{ String(lesson.id).padStart(2,'0') }}</span><b>{{ lesson.title }}</b><i v-if="isCompleted(lesson)" data-lucide="check"></i>
                    </button>
                </nav>
                <div class="ussul-pro-section-nav">
                    <span>Dans cette leçon</span>
                    <button v-for="(section,index) in activeLesson.sections" :key="index" @click="scrollToSection(index)" :class="{active:activeSection===index}">
                        <small>{{ index+1 }}</small><b>{{ cleanSectionTitle(section.title) }}</b>
                    </button>
                </div>
            </aside>
            <button v-if="showMobileToc" class="ussul-pro-sidebar-backdrop" @click="showMobileToc=false" aria-label="Fermer le sommaire"></button>

            <div ref="readerScroll" class="ussul-pro-reader-scroll" @scroll="onReaderScroll">
                <article class="ussul-pro-reader">
                    <header class="ussul-pro-lesson-hero">
                        <div class="ussul-pro-lesson-meta"><span>Leçon {{ String(activeLesson.id).padStart(2,'0') }}</span><span>{{ activeLesson.sections.length }} parties</span><span>≈ {{ readingTime }} min</span></div>
                        <h1>{{ activeLesson.title }}</h1>
                        <p>{{ activeLesson.intro }}</p>
                        <div class="ussul-pro-lesson-author"><i data-lucide="graduation-cap"></i><span>{{ activeLesson.author }}</span></div>
                        <div class="ussul-pro-lesson-actions">
                            <button @click="openVideo('theater')" class="primary"><i data-lucide="play-circle"></i>Regarder dans Athar</button>
                            <button @click="toggleComplete" :class="{completed:isCurrentCompleted}"><i :data-lucide="isCurrentCompleted?'check-circle-2':'circle'"></i>{{ isCurrentCompleted?'Leçon terminée':'Marquer comme terminée' }}</button>
                        </div>
                    </header>

                    <section v-for="(section,index) in activeLesson.sections" :key="index" :id="'ussul-section-'+index" data-ussul-section class="ussul-pro-content-section">
                        <div class="ussul-pro-section-title"><span>{{ String(index+1).padStart(2,'0') }}</span><h2>{{ cleanSectionTitle(section.title) }}</h2></div>
                        <div class="ussul-pro-prose" v-html="formatText(section.content)"></div>
                        <aside v-if="section.deepDive" class="ussul-pro-deep-dive"><i data-lucide="lightbulb"></i><div><span>Approfondissement</span><h3>{{ section.deepDive.title }}</h3><div v-html="formatText(section.deepDive.content)"></div></div></aside>
                    </section>

                    <footer class="ussul-pro-reader-footer">
                        <button v-if="prevLesson" @click="selectLesson(prevLesson)"><i data-lucide="arrow-left"></i><span><small>Précédent</small><b>{{ prevLesson.title }}</b></span></button>
                        <button @click="toggleComplete" class="complete" :class="{active:isCurrentCompleted}"><i :data-lucide="isCurrentCompleted?'check-circle-2':'circle'"></i>{{ isCurrentCompleted?'Terminée':'Terminer la leçon' }}</button>
                        <button v-if="nextLesson" @click="selectLesson(nextLesson)"><span><small>Suivant</small><b>{{ nextLesson.title }}</b></span><i data-lucide="arrow-right"></i></button>
                    </footer>
                </article>
            </div>
        </div>

        <div v-if="videoOpen" class="ussul-video-layer" :class="'mode-'+videoMode" @click.self="videoMode==='theater' && minimizeVideo()">
            <section ref="videoPlayer" class="ussul-video-player" :class="'is-'+videoMode" :style="playerStyle">
                <header @pointerdown="startDrag">
                    <div><i data-lucide="youtube"></i><span><small>Vidéo du cours</small><b>{{ activeLesson.title }}</b></span></div>
                    <nav>
                        <button v-if="videoMode==='theater'" @click.stop="minimizeVideo" title="Réduire en PiP"><i data-lucide="picture-in-picture-2"></i></button>
                        <button v-else @click.stop="expandVideo" title="Agrandir"><i data-lucide="maximize-2"></i></button>
                        <button @click.stop="openExternalVideo" title="Ouvrir sur YouTube"><i data-lucide="external-link"></i></button>
                        <button @click.stop="closeVideo" title="Fermer"><i data-lucide="x"></i></button>
                    </nav>
                </header>
                <div class="ussul-video-frame">
                    <iframe v-if="videoEmbedUrl" :src="videoEmbedUrl" :title="'Cours vidéo : '+activeLesson.title" loading="eager" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" allowfullscreen></iframe>
                    <div v-else class="ussul-video-fallback"><i data-lucide="video-off"></i><p>Cette adresse vidéo ne peut pas être intégrée.</p><button @click="openExternalVideo">Ouvrir sur YouTube</button></div>
                </div>
                <footer><span><i data-lucide="shield-check"></i>Lecteur YouTube en mode confidentialité renforcée, chargé après ton clic.</span><button @click="openExternalVideo">Lien direct</button></footer>
            </section>
        </div>
    </div>
    `
};
