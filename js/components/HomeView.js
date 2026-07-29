const HomeView = {
    props: ['setView', 'openRandomChapter', 'hadithCount', 'companionCount', 'hadiths', 'openHadith'],
    setup(props) {
<<<<<<< HEAD
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
=======
        const timeGreeting = Vue.computed(() => {
            const hour = new Date().getHours();
            if (hour < 5) return 'Bonne nuit';
            if (hour < 18) return 'Bonjour';
            return 'Bonsoir';
        });

        const currentIndex = Vue.ref(0);
        const timer = Vue.ref(null);
        const isPaused = Vue.ref(false);
        const progress = Vue.ref(0);
        const progressInterval = Vue.ref(null);

        if (Array.isArray(props.hadiths) && props.hadiths.length > 0) {
            currentIndex.value = Math.floor(Math.random() * props.hadiths.length);
        }

        const currentWisdom = Vue.computed(() => {
            if (!Array.isArray(props.hadiths) || props.hadiths.length === 0) {
                return {
                    hadeeth: 'Aucun hadith n’est disponible pour le moment.',
                    attribution: 'Athar Pro',
                    grade: '',
>>>>>>> af1a1176b0876344300340a1a838325c994ea08b
                    id: null
                };
            }
            return props.hadiths[currentIndex.value] || props.hadiths[0];
        });

<<<<<<< HEAD
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
=======
        const nextHadith = () => {
            if (!Array.isArray(props.hadiths) || props.hadiths.length === 0) return;
            currentIndex.value = (currentIndex.value + 1) % props.hadiths.length;
            progress.value = 0;
        };

        const startTimer = () => {
            timer.value = window.setInterval(() => {
                if (!isPaused.value) nextHadith();
            }, 10000);

            progressInterval.value = window.setInterval(() => {
                if (!isPaused.value) {
                    progress.value = progress.value >= 100 ? 0 : progress.value + 1;
>>>>>>> af1a1176b0876344300340a1a838325c994ea08b
                }
            }, 100);
        };

        const stopTimer = () => {
<<<<<<< HEAD
            clearInterval(timer.value);
            clearInterval(progressTimer.value);
=======
            window.clearInterval(timer.value);
            window.clearInterval(progressInterval.value);
        };

        const handleVisibilityChange = () => {
            isPaused.value = document.hidden;
>>>>>>> af1a1176b0876344300340a1a838325c994ea08b
        };

        Vue.onMounted(() => {
            startTimer();
<<<<<<< HEAD
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
=======
            document.addEventListener('visibilitychange', handleVisibilityChange);
        });

        Vue.onUnmounted(() => {
            stopTimer();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        });

        return {
            timeGreeting,
            currentWisdom,
            isPaused,
            progress,
            nextHadith,
            truncate: (text, length) => {
                if (!text) return '';
                return text.length > length ? `${text.substring(0, length).trim()}…` : text;
            }
        };
    },
    template: `
    <div class="min-h-full p-4 md:p-8 animate-fade-in relative overflow-x-hidden">
        <div class="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-brand-gold/10 to-transparent pointer-events-none"></div>
        <div class="absolute -top-24 -right-24 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none"></div>

        <div class="max-w-7xl mx-auto space-y-8 relative z-10">
            <div class="flex flex-col md:flex-row justify-between items-end gap-6 pb-6 border-b border-brand-gold/10">
                <div>
                    <span class="font-arabic text-xl text-brand-gold mb-2 block opacity-80" lang="ar" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</span>
                    <h1 class="font-display text-4xl md:text-5xl font-bold text-brand-dark dark:text-white leading-tight">
                        {{ timeGreeting }},<br>
                        <span class="text-brand-gold">bienvenue sur Athar Pro.</span>
                    </h1>
                    <p class="mt-3 text-gray-500 dark:text-gray-400 max-w-2xl font-serif leading-relaxed">
                        Une bibliothèque numérique consacrée aux biographies, aux hadiths référencés et aux outils d'étude de l'histoire islamique.
                    </p>
                </div>
                <div class="flex flex-wrap gap-3">
                    <button type="button" @click="openRandomChapter" class="group relative px-6 py-3 bg-white dark:bg-brand-dark-lighter border border-brand-gold/30 hover:border-brand-gold text-brand-dark dark:text-white rounded-xl font-bold uppercase text-xs tracking-widest transition-all shadow-sm hover:shadow-glow flex items-center gap-2">
                        <i data-lucide="shuffle" class="w-4 h-4 text-brand-gold group-hover:rotate-180 transition-transform duration-500"></i>
                        <span>Découvrir une notice</span>
                    </button>
                    <button type="button" @click="setView('library')" class="px-6 py-3 bg-brand-dark dark:bg-white text-brand-gold dark:text-brand-dark rounded-xl font-bold uppercase text-xs tracking-widest shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2">
                        <span>Explorer la bibliothèque</span>
                        <i data-lucide="arrow-right" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 md:auto-rows-[180px]">
                <div @click="setView('library')" @keydown.enter.prevent="setView('library')" @keydown.space.prevent="setView('library')" role="button" tabindex="0" class="md:col-span-2 md:row-span-2 group cursor-pointer relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-dark to-gray-900 text-white shadow-xl hover:shadow-2xl transition-all duration-500 border border-brand-gold/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-gold/40">
                    <div class="absolute inset-0 bg-islamic opacity-10"></div>
                    <div class="absolute right-0 bottom-0 p-8 opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-700">
                        <i data-lucide="book-open" class="w-48 h-48 text-brand-gold"></i>
                    </div>
                    <div class="relative h-full flex flex-col justify-between p-8">
                        <div class="w-12 h-12 rounded-2xl bg-brand-gold/20 backdrop-blur-sm flex items-center justify-center border border-brand-gold/30">
                            <i data-lucide="library" class="w-6 h-6 text-brand-gold"></i>
                        </div>
                        <div>
                            <h2 class="font-display text-3xl font-bold mb-2 text-white group-hover:text-brand-gold transition-colors">La Bibliothèque</h2>
                            <p class="text-gray-300 text-sm leading-relaxed max-w-sm">
                                Des notices documentées, des récits historiques et des références à consulter avec leur degré de certitude.
                            </p>
                        </div>
                    </div>
                </div>

                <div @click="setView('timeline')" @keydown.enter.prevent="setView('timeline')" @keydown.space.prevent="setView('timeline')" role="button" tabindex="0" class="md:col-span-2 group cursor-pointer relative overflow-hidden rounded-3xl bg-white dark:bg-brand-dark-lighter border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-card hover:border-brand-gold/40 transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-gold/30">
                    <div class="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 group-hover:opacity-100 group-hover:scale-110 group-hover:-translate-x-4 transition-all duration-500 bg-brand-gold/10 p-3 rounded-full">
                        <i data-lucide="clock" class="w-8 h-8 text-brand-gold"></i>
                    </div>
                    <div class="h-full flex flex-col justify-center p-8">
                        <h2 class="font-display text-xl font-bold text-brand-dark dark:text-white mb-1">Frise chronologique</h2>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Parcourez les événements datés et les variantes chronologiques indiquées dans les notices.</p>
                    </div>
                </div>

                <div @click="setView('atlas')" @keydown.enter.prevent="setView('atlas')" @keydown.space.prevent="setView('atlas')" role="button" tabindex="0" class="group cursor-pointer rounded-3xl bg-blue-50 dark:bg-[#1e293b] border border-blue-100 dark:border-blue-900/30 p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative overflow-hidden focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300/50">
                    <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity"><i data-lucide="globe" class="w-24 h-24 text-blue-600"></i></div>
                    <i data-lucide="map" class="w-8 h-8 text-blue-600 mb-4"></i>
                    <span class="font-display font-bold text-blue-900 dark:text-blue-100">Atlas géographique</span>
                </div>

                <div @click="setView('tabib')" @keydown.enter.prevent="setView('tabib')" @keydown.space.prevent="setView('tabib')" role="button" tabindex="0" class="group cursor-pointer rounded-3xl bg-emerald-50 dark:bg-[#064e3b]/40 border border-emerald-100 dark:border-emerald-900/30 p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative overflow-hidden focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/50">
                    <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity"><i data-lucide="heart" class="w-24 h-24 text-emerald-600"></i></div>
                    <i data-lucide="heart-pulse" class="w-8 h-8 text-emerald-600 mb-4"></i>
                    <span class="font-display font-bold text-emerald-900 dark:text-emerald-100">Tabib Al-Qulub</span>
                </div>

                <div @click="setView('hadiths')" @keydown.enter.prevent="setView('hadiths')" @keydown.space.prevent="setView('hadiths')" role="button" tabindex="0" class="group cursor-pointer rounded-3xl bg-amber-50 dark:bg-[#78350f]/20 border border-amber-100 dark:border-amber-900/30 p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative overflow-hidden focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/50">
                    <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity"><i data-lucide="scroll" class="w-24 h-24 text-amber-600"></i></div>
                    <i data-lucide="scroll-text" class="w-8 h-8 text-amber-600 mb-4"></i>
                    <span class="font-display font-bold text-amber-900 dark:text-amber-100">Hadiths référencés</span>
                </div>

                <div @click="setView('glossary')" @keydown.enter.prevent="setView('glossary')" @keydown.space.prevent="setView('glossary')" role="button" tabindex="0" class="group cursor-pointer rounded-3xl bg-purple-50 dark:bg-[#4c1d95]/20 border border-purple-100 dark:border-purple-900/30 p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative overflow-hidden focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-300/50">
                    <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity"><i data-lucide="book-a" class="w-24 h-24 text-purple-600"></i></div>
                    <i data-lucide="book-open-check" class="w-8 h-8 text-purple-600 mb-4"></i>
                    <span class="font-display font-bold text-purple-900 dark:text-purple-100">Lexique & termes</span>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div @click="currentWisdom.id && openHadith(currentWisdom)" @keydown.enter.prevent="currentWisdom.id && openHadith(currentWisdom)" @keydown.space.prevent="currentWisdom.id && openHadith(currentWisdom)" @mouseenter="isPaused = true" @mouseleave="isPaused = false" role="button" :tabindex="currentWisdom.id ? 0 : -1" class="md:col-span-2 rounded-2xl bg-brand-paper dark:bg-brand-dark border border-brand-gold/10 p-8 relative flex flex-col justify-center shadow-inner group cursor-pointer overflow-hidden min-h-[200px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-gold/30">
                    <div class="absolute top-0 left-0 h-1 bg-brand-gold/20 w-full"><div class="h-full bg-brand-gold transition-all duration-100 ease-linear" :style="{ width: progress + '%' }"></div></div>
                    <i data-lucide="quote" class="absolute top-6 left-6 w-8 h-8 text-brand-gold/20 group-hover:text-brand-gold/40 transition-colors"></i>
                    <div class="relative z-10 pl-8 border-l-2 border-brand-gold/30 group-hover:border-brand-gold transition-colors duration-300">
                        <transition name="fade" mode="out-in">
                            <div :key="currentWisdom.id" class="space-y-3">
                                <p class="font-serif italic text-lg md:text-xl text-brand-dark dark:text-gray-200 leading-relaxed">« {{ truncate(currentWisdom.hadeeth, 180) }} »</p>
                                <div class="flex flex-wrap items-center justify-between gap-3">
                                    <span class="text-xs font-bold text-brand-gold uppercase tracking-widest">— {{ truncate(currentWisdom.attribution, 55) }}</span>
                                    <span v-if="currentWisdom.grade" class="text-[10px] text-gray-500 dark:text-gray-300 bg-white dark:bg-brand-dark-lighter px-2 py-1 rounded-full border border-gray-100 dark:border-gray-700">{{ currentWisdom.grade }}</span>
                                </div>
                            </div>
                        </transition>
                    </div>
                    <button type="button" @click.stop="nextHadith" aria-label="Afficher un autre hadith" class="absolute bottom-4 right-4 p-2 rounded-full bg-white dark:bg-brand-dark-lighter shadow-sm hover:text-brand-gold text-gray-400 opacity-70 group-hover:opacity-100 transition-opacity">
                        <i data-lucide="refresh-cw" class="w-3 h-3"></i>
                    </button>
                </div>

                <div class="rounded-2xl bg-white dark:bg-brand-dark-lighter border border-gray-100 dark:border-gray-700 p-6 flex flex-col justify-center items-center text-center shadow-sm">
                    <div class="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center mb-3"><i data-lucide="book-check" class="w-6 h-6 text-brand-gold"></i></div>
                    <h2 class="font-bold text-brand-dark dark:text-white text-sm uppercase tracking-wide mb-2">Méthodologie éditoriale</h2>
                    <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">Une référence affichée n'implique pas que chaque détail historique soit unanimement établi.</p>
                    <a href="methodologie.html" class="text-brand-gold text-[10px] font-bold uppercase tracking-widest hover:underline">Consulter la méthode</a>
                </div>
            </div>
        </div>
    </div>
>>>>>>> af1a1176b0876344300340a1a838325c994ea08b
    `
};
