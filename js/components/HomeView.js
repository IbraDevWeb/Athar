const HomeView = {
    props: ['setView', 'openRandomChapter', 'hadithCount', 'companionCount', 'hadiths', 'openHadith'],
    setup(props) {
        const currentIndex = Vue.ref(0);
        const timer = Vue.ref(null);
        const progressTimer = Vue.ref(null);
        const isPaused = Vue.ref(false);
        const progress = Vue.ref(0);

        if (props.hadiths && props.hadiths.length > 0) {
            currentIndex.value = Math.floor(Math.random() * props.hadiths.length);
        }

        const greeting = Vue.computed(() => {
            const hour = new Date().getHours();
            if (hour < 5) return "Veillée";
            if (hour < 12) return "Matin";
            if (hour < 18) return "Étude";
            return "Lecture";
        });

        const currentWisdom = Vue.computed(() => {
            if (!props.hadiths || props.hadiths.length === 0) {
                return {
                    hadeeth: "Le savoir est une lumière qu’Allah projette dans le cœur.",
                    attribution: "Sagesse",
                    id: null
                };
            }
            return props.hadiths[currentIndex.value] || props.hadiths[0];
        });

        const wisdomSource = Vue.computed(() => {
            const item = currentWisdom.value || {};
            return item.attribution || item.reference || item.source || 'Athar Pro';
        });

        const mainEntries = [
            {
                view: 'library',
                icon: 'library',
                eyebrow: 'Bibliothèque',
                title: 'Biographies',
                text: 'Parcourir les vies, les récits et les enseignements des Compagnons.'
            },
            {
                view: 'timeline',
                icon: 'clock',
                eyebrow: 'Repères',
                title: 'Chronologie',
                text: 'Situer les événements et les parcours dans une lecture claire.'
            },
            {
                view: 'hadiths',
                icon: 'scroll-text',
                eyebrow: 'Textes',
                title: 'Hadiths',
                text: 'Accéder aux paroles et aux explications dans un format sobre.'
            },
            {
                view: 'glossary',
                icon: 'book-a',
                eyebrow: 'Notions',
                title: 'Lexique',
                text: 'Retrouver les termes essentiels sans quitter l’étude.'
            }
        ];

        const quickTools = [
            { view: 'adhkar', icon: 'sunrise', label: 'Al-Adhkar' },
            { view: 'tabib', icon: 'heart-pulse', label: 'Tabib Al-Qulub' },
            { view: 'atlas', icon: 'map', label: 'Atlas' },
            { view: 'transmission', icon: 'git-fork', label: 'Transmission' }
        ];

        const hydrateIcons = () => {
            Vue.nextTick(() => {
                if (window.lucide) window.lucide.createIcons();
            });
        };

        const truncate = (text, length = 230) => {
            if (!text) return '';
            const clean = String(text).replace(/\s+/g, ' ').trim();
            return clean.length > length ? clean.substring(0, length).trim() + '…' : clean;
        };

        const nextHadith = () => {
            if (!props.hadiths || props.hadiths.length === 0) return;
            currentIndex.value = (currentIndex.value + 1) % props.hadiths.length;
            progress.value = 0;
            hydrateIcons();
        };

        const openCurrentHadith = () => {
            if (props.hadiths && props.hadiths.length > 0 && currentWisdom.value && props.openHadith) {
                props.openHadith(currentWisdom.value);
            }
        };

        const startTimer = () => {
            timer.value = setInterval(() => {
                if (!isPaused.value) nextHadith();
            }, 11000);

            progressTimer.value = setInterval(() => {
                if (!isPaused.value) {
                    progress.value = progress.value >= 100 ? 0 : progress.value + 0.92;
                }
            }, 100);
        };

        const stopTimer = () => {
            clearInterval(timer.value);
            clearInterval(progressTimer.value);
        };

        Vue.onMounted(() => {
            startTimer();
            hydrateIcons();
        });

        Vue.onUnmounted(() => stopTimer());

        return {
            greeting,
            currentWisdom,
            wisdomSource,
            mainEntries,
            quickTools,
            isPaused,
            progress,
            truncate,
            nextHadith,
            openCurrentHadith
        };
    },
    template: `
    <section class="ap-home min-h-full px-4 py-4 md:px-6 md:py-6 lg:px-8 lg:py-7 animate-fade-in">
        <div class="ap-home-wrap max-w-[1180px] mx-auto">
            <div class="ap-home-head flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div class="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400 font-sans">
                    <span class="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
                    Accueil · {{ greeting }}
                </div>
                <button @click="openRandomChapter" class="ap-home-top-action inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-[0.18em] transition-all active:scale-[0.98]">
                    <i data-lucide="shuffle" class="w-3.5 h-3.5"></i>
                    Découverte aléatoire
                </button>
            </div>

            <div class="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_355px] gap-4 lg:gap-5 items-stretch">
                <article class="ap-home-card ap-home-hero rounded-3xl p-5 md:p-7 lg:p-8 min-h-[430px]">
                    <div class="flex flex-col h-full">
                        <div class="flex items-start justify-between gap-4">
                            <div class="ap-home-seal shrink-0">أ</div>
                            <div class="hidden md:grid grid-cols-2 gap-2 w-[260px]">
                                <div class="ap-home-mini-stat rounded-2xl px-4 py-3">
                                    <span>{{ companionCount }}</span>
                                    <small>Biographies</small>
                                </div>
                                <div class="ap-home-mini-stat rounded-2xl px-4 py-3">
                                    <span>{{ hadithCount }}</span>
                                    <small>Hadiths</small>
                                </div>
                            </div>
                        </div>

                        <div class="mt-8 md:mt-10 max-w-3xl">
                            <p class="ap-home-arabic font-arabic text-brand-gold/90">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
                            <h1 class="ap-home-title font-display font-bold text-brand-dark dark:text-white mt-5">
                                Étudier l’héritage des <span>Compagnons</span>
                            </h1>
                            <p class="ap-home-lead font-sans mt-5 max-w-2xl text-slate-600 dark:text-slate-300">
                                Une porte d’entrée claire vers les biographies, les hadiths, les repères historiques et les notions essentielles.
                            </p>
                        </div>

                        <div class="mt-7 flex flex-col sm:flex-row gap-3">
                            <button @click="setView('library')" class="ap-home-primary-btn group inline-flex items-center justify-center gap-3 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-[0.16em] transition-all active:scale-[0.98]">
                                Ouvrir la bibliothèque
                                <i data-lucide="arrow-right" class="w-4 h-4 transition-transform group-hover:translate-x-1"></i>
                            </button>
                            <button @click="setView('timeline')" class="ap-home-secondary-btn inline-flex items-center justify-center gap-3 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-[0.16em] transition-all active:scale-[0.98]">
                                <i data-lucide="clock" class="w-4 h-4"></i>
                                Voir la frise
                            </button>
                        </div>

                        <div class="mt-auto pt-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <button @click="setView('library')" class="ap-home-inline-card rounded-2xl p-4 text-left group">
                                <span>01</span>
                                <strong>Lire</strong>
                                <small>Biographies & récits</small>
                            </button>
                            <button @click="setView('hadiths')" class="ap-home-inline-card rounded-2xl p-4 text-left group">
                                <span>02</span>
                                <strong>Méditer</strong>
                                <small>Hadiths & sagesses</small>
                            </button>
                            <button @click="setView('glossary')" class="ap-home-inline-card rounded-2xl p-4 text-left group">
                                <span>03</span>
                                <strong>Comprendre</strong>
                                <small>Lexique & repères</small>
                            </button>
                        </div>
                    </div>
                </article>

                <aside class="ap-home-card ap-home-wisdom rounded-3xl p-5 md:p-6 flex flex-col min-h-[430px]"
                       @mouseenter="isPaused = true"
                       @mouseleave="isPaused = false">
                    <div class="flex items-center justify-between gap-4 mb-5">
                        <div>
                            <span class="ap-home-eyebrow">Lecture du jour</span>
                            <h2 class="font-display text-lg font-bold text-brand-dark dark:text-white mt-1">Parole à méditer</h2>
                        </div>
                        <button @click.stop="nextHadith" class="ap-home-icon-btn" title="Changer de hadith">
                            <i data-lucide="refresh-cw" class="w-4 h-4"></i>
                        </button>
                    </div>

                    <button @click="openCurrentHadith" class="ap-home-quote rounded-2xl p-5 text-left flex-1 flex flex-col justify-between group transition-all">
                        <div>
                            <i data-lucide="quote" class="w-6 h-6 text-brand-gold/50 mb-4"></i>
                            <transition name="fade" mode="out-in">
                                <p :key="currentWisdom.id || currentWisdom.hadeeth" class="font-serif italic text-brand-dark dark:text-gray-100 leading-8 text-[0.98rem]">
                                    {{ truncate(currentWisdom.hadeeth, 300) }}
                                </p>
                            </transition>
                        </div>

                        <div class="pt-5 mt-6 border-t border-brand-gold/10 flex items-end justify-between gap-3">
                            <span class="ap-home-source min-w-0">— {{ truncate(wisdomSource, 46) }}</span>
                            <span class="ap-home-read-chip shrink-0">Lire</span>
                        </div>
                    </button>

                    <div class="ap-home-progress mt-4 rounded-full overflow-hidden">
                        <div :style="{ width: progress + '%' }"></div>
                    </div>
                </aside>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4 lg:mt-5">
                <button v-for="entry in mainEntries" :key="entry.view" @click="setView(entry.view)" class="ap-home-card ap-home-nav-card rounded-2xl p-5 text-left group transition-all">
                    <div class="flex items-start justify-between gap-4 mb-5">
                        <span class="ap-home-nav-icon"><i :data-lucide="entry.icon" class="w-4.5 h-4.5"></i></span>
                        <span class="ap-home-eyebrow">{{ entry.eyebrow }}</span>
                    </div>
                    <h3 class="font-display text-lg font-bold text-brand-dark dark:text-white">{{ entry.title }}</h3>
                    <p class="font-sans text-sm text-slate-500 dark:text-slate-400 leading-6 mt-2">{{ entry.text }}</p>
                </button>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-4 mt-4 lg:mt-5">
                <div class="ap-home-card rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                    <div>
                        <span class="ap-home-eyebrow">Parcours conseillé</span>
                        <h3 class="font-display text-xl md:text-2xl font-bold text-brand-dark dark:text-white mt-2">Commencer simplement, puis approfondir.</h3>
                        <p class="font-sans text-sm text-slate-500 dark:text-slate-400 leading-7 mt-2 max-w-2xl">
                            L’accueil reste volontairement proche de la navigation latérale : mêmes contrastes, mêmes rayons, mêmes accents dorés.
                        </p>
                    </div>
                    <button @click="setView('library')" class="ap-home-secondary-btn shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-[0.16em] transition-all active:scale-[0.98]">
                        Commencer
                        <i data-lucide="arrow-up-right" class="w-4 h-4"></i>
                    </button>
                </div>

                <div class="ap-home-card rounded-2xl p-5 md:p-6">
                    <div class="flex items-center justify-between mb-4">
                        <span class="ap-home-eyebrow">Accès rapides</span>
                        <i data-lucide="layout-grid" class="w-4 h-4 text-slate-400"></i>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <button v-for="tool in quickTools" :key="tool.view" @click="setView(tool.view)" class="ap-home-tool rounded-xl px-3 py-3 text-left transition-all">
                            <i :data-lucide="tool.icon" class="w-4 h-4 mb-2"></i>
                            <span>{{ tool.label }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
    `
};
