// Page d'accueil de la version publique : uniquement les sections disponibles.
const HomeView = {
    props: ['setView', 'hadiths', 'openHadith'],
    setup(props) {
        const sections = [
            { view: 'library', title: 'Bibliothèque', detail: 'Biographies, récits et parcours des Compagnons.', icon: 'library', number: '01' },
            { view: 'timeline', title: 'Frise Chrono', detail: 'Les grandes dates et les événements à replacer dans leur contexte.', icon: 'clock', number: '02' },
            { view: 'glossary', title: 'Lexique', detail: 'Les termes et notions essentiels à retrouver facilement.', icon: 'book-a', number: '03' },
            { view: 'hadiths', title: 'Hadiths', detail: 'Lire les textes, leurs références et leurs explications.', icon: 'scroll-text', number: '04' },
            { view: 'tabib', title: 'Tabib Al-Qulub', detail: 'Des ressources pour méditer et prendre soin du cœur.', icon: 'heart-pulse', number: '05' },
            { view: 'adhkar', title: 'Al-Adhkar', detail: 'Des invocations et rappels à consulter au quotidien.', icon: 'sunrise', number: '06' },
            { view: 'tasbih', title: 'Tasbih', detail: 'Un compteur simple et accessible pour le dhikr.', icon: 'rotate-cw', number: '07' }
        ];

        const currentIndex = Vue.ref(0);
        const isPaused = Vue.ref(false);
        const hadithSlides = Vue.computed(() => (Array.isArray(props.hadiths) ? props.hadiths : [])
            .filter(item => item && typeof item.hadeeth === 'string' && item.hadeeth.trim().length >= 35
                && typeof item.attribution === 'string' && item.attribution.trim().length > 0)
            .slice(0, 12));
        const currentHadith = Vue.computed(() =>
            hadithSlides.value[currentIndex.value % Math.max(hadithSlides.value.length, 1)] || null);
        const excerpt = value => {
            const text = String(value || '').replace(/\r/g, '').replace(/\s+/g, ' ').trim();
            return text.length > 360 ? text.slice(0, 357).trimEnd() + '…' : text;
        };
        const goToHadith = index => {
            const count = hadithSlides.value.length;
            if (!count) return;
            currentIndex.value = ((index % count) + count) % count;
            Vue.nextTick(() => window.lucide?.createIcons());
        };
        const nextHadith = () => goToHadith(currentIndex.value + 1);
        const previousHadith = () => goToHadith(currentIndex.value - 1);
        const openCurrentHadith = () => {
            if (currentHadith.value && typeof props.openHadith === 'function') props.openHadith(currentHadith.value);
        };
        let rotation = null;
        Vue.onMounted(() => {
            Vue.nextTick(() => window.lucide?.createIcons());
            const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
            if (!reduced) rotation = window.setInterval(() => {
                if (!isPaused.value && !document.hidden && hadithSlides.value.length > 1) nextHadith();
            }, 11000);
        });
        Vue.onUnmounted(() => {
            if (rotation !== null) window.clearInterval(rotation);
        });
        Vue.watch(() => hadithSlides.value.length, count => {
            if (currentIndex.value >= count) currentIndex.value = 0;
        });
        return { sections, hadithSlides, currentHadith, currentIndex, isPaused,
                 excerpt, goToHadith, nextHadith, previousHadith, openCurrentHadith };
    },
    template: `
        <section class="ap-home ap-launch animate-fade-in">
            <div class="ap-launch-wrap">
                <header class="ap-launch-hero">
                    <div class="ap-launch-hero-copy">
                        <span class="ap-launch-eyebrow"><span class="ap-launch-dot"></span> Athar Pro · L’essentiel</span>
                        <p class="ap-launch-arabic" lang="ar" dir="rtl">رَبِّ زِدْنِي عِلْمًا</p>
                        <h1>Le savoir, <em>à portée de lecture.</em></h1>
                        <p class="ap-launch-intro">Un espace épuré pour explorer les biographies, comprendre les textes et accompagner vos instants de rappel.</p>
                        <div class="ap-launch-actions">
                            <button type="button" @click="setView('library')" class="ap-launch-primary">Explorer la bibliothèque <i data-lucide="arrow-up-right" aria-hidden="true"></i></button>
                            <button type="button" @click="setView('hadiths')" class="ap-launch-secondary">Lire les hadiths <i data-lucide="arrow-right" aria-hidden="true"></i></button>
                        </div>
                    </div>
                    <div class="ap-launch-art" aria-hidden="true">
                        <div class="ap-launch-art-ring"></div>
                        <span>أثر</span>
                    </div>
                </header>

                <section class="ap-hadith-feature" aria-label="Carrousel de hadiths"
                         @mouseenter="isPaused = true" @mouseleave="isPaused = false"
                         @focusin="isPaused = true" @focusout="isPaused = false"
                         @keydown.left.prevent="previousHadith" @keydown.right.prevent="nextHadith">
                    <div class="ap-hadith-feature-heading">
                        <span class="ap-launch-section-kicker">À lire & à méditer</span>
                        <h2>Une parole à méditer</h2>
                        <p>Redécouvrez les enseignements prophétiques, une lecture à la fois.</p>
                        <button type="button" class="ap-hadith-all" @click="setView('hadiths')">
                            Tous les hadiths <i data-lucide="arrow-up-right" aria-hidden="true"></i>
                        </button>
                    </div>
                    <div class="ap-hadith-panel" v-if="currentHadith">
                        <div class="ap-hadith-panel-top">
                            <span class="ap-hadith-eyebrow"><i data-lucide="book-open" aria-hidden="true"></i> Hadiths</span>
                            <span class="ap-hadith-count">{{ currentIndex + 1 }} / {{ hadithSlides.length }}</span>
                        </div>
                        <transition name="ap-hadith-fade" mode="out-in">
                            <div class="ap-hadith-slide" :key="currentHadith.id || currentIndex" aria-live="off">
                                <h3>{{ currentHadith.title }}</h3>
                                <p class="ap-hadith-quote">{{ excerpt(currentHadith.hadeeth) }}</p>
                                <p class="ap-hadith-source">{{ currentHadith.attribution }}</p>
                            </div>
                        </transition>
                        <div class="ap-hadith-panel-footer">
                            <button type="button" class="ap-hadith-read" @click="openCurrentHadith">
                                Lire le hadith complet <i data-lucide="arrow-right" aria-hidden="true"></i>
                            </button>
                            <div class="ap-hadith-controls" aria-label="Navigation entre les hadiths">
                                <button type="button" class="ap-hadith-previous" @click="previousHadith"
                                        :disabled="hadithSlides.length < 2" aria-label="Hadith précédent">
                                    <i data-lucide="arrow-left" aria-hidden="true"></i>
                                </button>
                                <button type="button" class="ap-hadith-next" @click="nextHadith"
                                        :disabled="hadithSlides.length < 2" aria-label="Hadith suivant">
                                    <i data-lucide="arrow-right" aria-hidden="true"></i>
                                </button>
                            </div>
                        </div>
                        <div class="ap-hadith-dots" v-if="hadithSlides.length > 1" aria-label="Choisir un hadith">
                            <button v-for="(hadith, index) in hadithSlides" :key="hadith.id || index"
                                    type="button" @click="goToHadith(index)" class="ap-hadith-dot"
                                    :class="{ 'is-active': index === currentIndex }"
                                    :aria-label="'Afficher le hadith ' + (index + 1)"
                                    :aria-current="index === currentIndex ? 'true' : null"></button>
                        </div>
                    </div>
                    <div v-else class="ap-hadith-empty" role="status">Les hadiths ne sont pas disponibles pour le moment.</div>
                </section>

                <div class="ap-launch-section-head">
                    <div>
                        <p class="ap-launch-section-kicker">Votre espace d’étude</p>
                        <h2>Les sept rubriques accessibles</h2>
                    </div>
                    <span class="ap-launch-count">07 / 07</span>
                </div>

                <nav class="ap-launch-grid" aria-label="Rubriques disponibles">
                    <button v-for="section in sections" :key="section.view" type="button"
                            class="ap-launch-card" @click="setView(section.view)"
                            :aria-label="'Ouvrir ' + section.title">
                        <span class="ap-launch-card-top">
                            <span class="ap-launch-card-icon"><i :data-lucide="section.icon" aria-hidden="true"></i></span>
                            <span class="ap-launch-card-number">{{ section.number }}</span>
                        </span>
                        <span class="ap-launch-card-title">{{ section.title }}</span>
                        <span class="ap-launch-card-detail">{{ section.detail }}</span>
                        <span class="ap-launch-card-bottom">Découvrir <i data-lucide="arrow-up-right" aria-hidden="true"></i></span>
                    </button>
                </nav>
            </div>
        </section>
    `
};
