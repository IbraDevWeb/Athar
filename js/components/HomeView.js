const HomeView = {
    props: ['setView', 'openRandomChapter', 'hadithCount', 'companionCount', 'hadiths', 'openHadith'],
    setup(props) {
        const timeGreeting = Vue.computed(() => {
            const hour = new Date().getHours();
            if (hour < 5) return "Qiyam al-Layl";
            if (hour < 12) return "Sabah al-Khayr";
            if (hour < 18) return "Masa' al-Khayr";
            return "Layla Sa'ida";
        });

        // --- LOGIQUE DU CARROUSEL ---
        const currentIndex = Vue.ref(0);
        const timer = Vue.ref(null);
        const isPaused = Vue.ref(false);
        const progress = Vue.ref(0);
        const progressInterval = Vue.ref(null);

        // Initialisation aléatoire
        if (props.hadiths && props.hadiths.length > 0) {
            currentIndex.value = Math.floor(Math.random() * props.hadiths.length);
        }

        const currentWisdom = Vue.computed(() => {
            if (!props.hadiths || props.hadiths.length === 0) return {
                hadeeth: "Le savoir est une lumière qu'Allah projette dans le cœur.",
                attribution: "Sagesse",
                id: null
            };
            return props.hadiths[currentIndex.value];
        });

        const nextHadith = () => {
            if (props.hadiths.length > 0) {
                currentIndex.value = (currentIndex.value + 1) % props.hadiths.length;
                progress.value = 0;
            }
        };

        const startTimer = () => {
            // Timer principal pour changer le hadith (10s)
            timer.value = setInterval(() => {
                if (!isPaused.value) nextHadith();
            }, 10000);

            // Timer fluide pour la barre de progression (tous les 100ms)
            progressInterval.value = setInterval(() => {
                if (!isPaused.value) {
                    progress.value += 1; // 1% toutes les 100ms = 100% en 10s
                    if (progress.value > 100) progress.value = 0;
                }
            }, 100);
        };

        const stopTimer = () => {
            clearInterval(timer.value);
            clearInterval(progressInterval.value);
        };

        Vue.onMounted(() => startTimer());
        Vue.onUnmounted(() => stopTimer());

        return { 
            timeGreeting, 
            currentWisdom, 
            isPaused, 
            progress,
            nextHadith,
            // Fonction pour tronquer le texte s'il est trop long pour la carte
            truncate: (text, length) => {
                if (!text) return '';
                return text.length > length ? text.substring(0, length) + '...' : text;
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
                    <span class="font-arabic text-xl text-brand-gold mb-2 block opacity-80">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</span>
                    <h1 class="font-display text-4xl md:text-5xl font-bold text-brand-dark dark:text-white leading-tight">
                        {{ timeGreeting }}, <br>
                        <span class="text-brand-gold">Chercheur de Lumière.</span>
                    </h1>
                    <p class="mt-2 text-gray-500 dark:text-gray-400 max-w-lg font-serif">
                        Bienvenue dans <strong>Athar Pro</strong>. {{ companionCount }} biographies et {{ hadithCount }} hadiths vous attendent pour revivre l'Héritage.
                    </p>
                </div>
                <div class="flex gap-3">
                    <button @click="openRandomChapter" class="group relative px-6 py-3 bg-white dark:bg-brand-dark-lighter border border-brand-gold/30 hover:border-brand-gold text-brand-dark dark:text-white rounded-xl font-bold uppercase text-xs tracking-widest transition-all shadow-sm hover:shadow-glow flex items-center gap-2">
                        <i data-lucide="shuffle" class="w-4 h-4 text-brand-gold group-hover:rotate-180 transition-transform duration-500"></i>
                        <span>Découverte</span>
                    </button>
                    <button @click="setView('library')" class="px-6 py-3 bg-brand-dark dark:bg-white text-brand-gold dark:text-brand-dark rounded-xl font-bold uppercase text-xs tracking-widest shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2">
                        <span>Explorer tout</span>
                        <i data-lucide="arrow-right" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 md:auto-rows-[180px]">
                
                <div @click="setView('library')" class="md:col-span-2 md:row-span-2 group cursor-pointer relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-dark to-gray-900 text-white shadow-xl hover:shadow-2xl transition-all duration-500 border border-brand-gold/20">
                    <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div class="absolute right-0 bottom-0 p-8 opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-700">
                        <i data-lucide="book-open" class="w-48 h-48 text-brand-gold"></i>
                    </div>
                    <div class="relative h-full flex flex-col justify-between p-8">
                        <div class="w-12 h-12 rounded-2xl bg-brand-gold/20 backdrop-blur-sm flex items-center justify-center border border-brand-gold/30">
                            <i data-lucide="library" class="w-6 h-6 text-brand-gold"></i>
                        </div>
                        <div>
                            <h3 class="font-display text-3xl font-bold mb-2 text-white group-hover:text-brand-gold transition-colors">La Bibliothèque</h3>
                            <p class="text-gray-300 text-sm leading-relaxed max-w-sm">
                                L'encyclopédie complète des Sahaba. Biographies détaillées, récits authentifiés et leçons de vie.
                            </p>
                        </div>
                    </div>
                </div>

                <div @click="setView('timeline')" class="md:col-span-2 group cursor-pointer relative overflow-hidden rounded-3xl bg-white dark:bg-brand-dark-lighter border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-card hover:border-brand-gold/40 transition-all duration-300">
                    <div class="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 group-hover:opacity-100 group-hover:scale-110 group-hover:-translate-x-4 transition-all duration-500 bg-brand-gold/10 p-3 rounded-full">
                        <i data-lucide="clock" class="w-8 h-8 text-brand-gold"></i>
                    </div>
                    <div class="h-full flex flex-col justify-center p-8">
                        <h3 class="font-display text-xl font-bold text-brand-dark dark:text-white mb-1 flex items-center gap-2">
                            Frise Chronologique <span class="px-2 py-0.5 rounded text-[9px] bg-red-100 text-red-600 dark:bg-red-900/30 font-sans tracking-wide">NOUVEAU</span>
                        </h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Visualisez l'histoire islamique sur un axe unifié.</p>
                    </div>
                </div>

                <div @click="setView('atlas')" class="group cursor-pointer rounded-3xl bg-blue-50 dark:bg-[#1e293b] border border-blue-100 dark:border-blue-900/30 p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                    <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <i data-lucide="globe" class="w-24 h-24 text-blue-600"></i>
                    </div>
                    <i data-lucide="map" class="w-8 h-8 text-blue-600 mb-4"></i>
                    <span class="font-display font-bold text-blue-900 dark:text-blue-100">Atlas Géographique</span>
                </div>

                <div @click="setView('tabib')" class="group cursor-pointer rounded-3xl bg-emerald-50 dark:bg-[#064e3b]/40 border border-emerald-100 dark:border-emerald-900/30 p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                    <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <i data-lucide="heart" class="w-24 h-24 text-emerald-600"></i>
                    </div>
                    <i data-lucide="heart-pulse" class="w-8 h-8 text-emerald-600 mb-4"></i>
                    <span class="font-display font-bold text-emerald-900 dark:text-emerald-100">Tabib Al-Qulub</span>
                </div>

                <div @click="setView('hadiths')" class="group cursor-pointer rounded-3xl bg-amber-50 dark:bg-[#78350f]/20 border border-amber-100 dark:border-amber-900/30 p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                    <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <i data-lucide="scroll" class="w-24 h-24 text-amber-600"></i>
                    </div>
                    <i data-lucide="scroll-text" class="w-8 h-8 text-amber-600 mb-4"></i>
                    <span class="font-display font-bold text-amber-900 dark:text-amber-100">Hadiths Authentiques</span>
                </div>

                <div @click="setView('glossary')" class="group cursor-pointer rounded-3xl bg-purple-50 dark:bg-[#4c1d95]/20 border border-purple-100 dark:border-purple-900/30 p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                    <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <i data-lucide="book-a" class="w-24 h-24 text-purple-600"></i>
                    </div>
                    <i data-lucide="book-open-check" class="w-8 h-8 text-purple-600 mb-4"></i>
                    <span class="font-display font-bold text-purple-900 dark:text-purple-100">Lexique & Termes</span>
                </div>

            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div @click="currentWisdom.id && openHadith(currentWisdom)" 
                     @mouseenter="isPaused = true" 
                     @mouseleave="isPaused = false"
                     class="md:col-span-2 rounded-2xl bg-brand-paper dark:bg-brand-dark border border-brand-gold/10 p-8 relative flex flex-col justify-center shadow-inner group cursor-pointer overflow-hidden min-h-[200px]">
                    
                    <div class="absolute top-0 left-0 h-1 bg-brand-gold/20 w-full">
                        <div class="h-full bg-brand-gold transition-all duration-100 ease-linear" :style="{ width: progress + '%' }"></div>
                    </div>

                    <i data-lucide="quote" class="absolute top-6 left-6 w-8 h-8 text-brand-gold/20 group-hover:text-brand-gold/40 transition-colors"></i>
                    
                    <div class="relative z-10 pl-8 border-l-2 border-brand-gold/30 group-hover:border-brand-gold transition-colors duration-300">
                        <transition name="fade" mode="out-in">
                            <div :key="currentWisdom.id" class="space-y-3">
                                <p class="font-serif italic text-lg md:text-xl text-brand-dark dark:text-gray-200 leading-relaxed">
                                    "{{ truncate(currentWisdom.hadeeth, 180) }}"
                                </p>
                                <div class="flex items-center justify-between">
                                    <span class="text-xs font-bold text-brand-gold uppercase tracking-widest">— {{ truncate(currentWisdom.attribution, 40) }}</span>
                                    <span class="text-[10px] text-gray-400 bg-white dark:bg-brand-dark-lighter px-2 py-1 rounded-full border border-gray-100 dark:border-gray-700 group-hover:border-brand-gold/30 transition-colors">
                                        Lire le hadith <i data-lucide="arrow-right" class="w-3 h-3 inline ml-1"></i>
                                    </span>
                                </div>
                            </div>
                        </transition>
                    </div>

                    <div class="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button @click.stop="nextHadith" class="p-1.5 rounded-full bg-white dark:bg-brand-dark-lighter shadow-sm hover:text-brand-gold text-gray-400">
                            <i data-lucide="refresh-cw" class="w-3 h-3"></i>
                        </button>
                    </div>
                </div>

                <div class="rounded-2xl bg-white dark:bg-brand-dark-lighter border border-gray-100 dark:border-gray-700 p-6 flex flex-col justify-center items-center text-center shadow-sm">
                    <div class="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center mb-3 animate-pulse">
                        <span class="font-display font-bold text-brand-gold text-xl">v2</span>
                    </div>
                    <h4 class="font-bold text-brand-dark dark:text-white text-sm uppercase tracking-wide mb-1">AtharPro</h4>
                    <p class="text-xs text-gray-400">Encyclopédie collaborative & open-source.</p>
                </div>
            </div>

        </div>
    </div>
    `
};