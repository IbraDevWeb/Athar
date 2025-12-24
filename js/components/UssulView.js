const UssulView = {
    props: ['lessons', 'formatText', 'goHome'],
    data() {
        return {
            activeLesson: null,
            scrollProgress: 0,
            showTOC: false // Pour le mobile éventuellement
        }
    },
    computed: {
        // Trouve l'index de la leçon actuelle pour gérer Précédent/Suivant
        currentIndex() {
            return this.lessons.findIndex(l => l.id === this.activeLesson?.id);
        },
        prevLesson() {
            return this.currentIndex > 0 ? this.lessons[this.currentIndex - 1] : null;
        },
        nextLesson() {
            return this.currentIndex < this.lessons.length - 1 ? this.lessons[this.currentIndex + 1] : null;
        }
    },
    mounted() {
        window.addEventListener('scroll', this.updateProgress);
    },
    beforeUnmount() {
        window.removeEventListener('scroll', this.updateProgress);
    },
    methods: {
        selectLesson(lesson) {
            this.activeLesson = lesson;
            this.scrollProgress = 0;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        handleBack() {
            if (this.activeLesson) {
                this.activeLesson = null;
                this.scrollProgress = 0;
            } else {
                this.goHome();
            }
        },
        updateProgress() {
            if (!this.activeLesson) return;
            const scrollTop = window.scrollY;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            this.scrollProgress = (scrollTop / docHeight) * 100;
        },
        scrollToSection(index) {
            const element = document.getElementById(`section-${index}`);
            if (element) {
                const headerOffset = 100;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            }
        }
    },
    template: `
    <div class="min-h-full bg-[#FAFAFA] dark:bg-[#0F1115] relative transition-colors duration-500 font-sans selection:bg-brand-gold/30 selection:text-brand-dark">
        
        <div v-if="activeLesson" class="fixed top-0 left-0 h-1 bg-brand-gold z-50 transition-all duration-100 ease-out shadow-[0_0_10px_rgba(212,175,55,0.5)]" :style="{ width: scrollProgress + '%' }"></div>

        <header class="sticky top-0 z-40 h-16 bg-white/90 dark:bg-[#0F1115]/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/5 flex items-center justify-between px-4 md:px-8 transition-all">
            <div class="flex items-center gap-4">
                <button @click="handleBack" 
                        class="group flex items-center gap-3 text-sm font-medium text-gray-500 hover:text-brand-dark dark:text-gray-400 dark:hover:text-white transition-colors">
                    <div class="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center group-hover:bg-brand-gold group-hover:text-white transition-all">
                        <i data-lucide="arrow-left" class="w-4 h-4 transition-transform group-hover:-translate-x-0.5"></i>
                    </div>
                    <span class="hidden md:inline font-bold tracking-wide uppercase text-xs">
                        {{ activeLesson ? 'Retour au sommaire' : 'Accueil' }}
                    </span>
                </button>
            </div>
            
            <div class="absolute left-1/2 -translate-x-1/2 opacity-0 md:opacity-100 transition-opacity duration-300 pointer-events-none" :class="{'opacity-0': scrollProgress < 5, 'opacity-100': scrollProgress > 5}">
                <span v-if="activeLesson" class="font-display font-bold text-gray-900 dark:text-white text-sm tracking-wide">
                    {{ activeLesson.title }}
                </span>
            </div>

            <div class="flex items-center gap-3">
                 <span v-if="activeLesson" class="px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 hidden md:block">
                    Cours N°{{ activeLesson.id }}
                </span>
                <a v-if="activeLesson" :href="activeLesson.videoUrl" target="_blank" 
                   class="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-full flex items-center gap-2 transition-all shadow-lg shadow-red-600/20 hover:shadow-red-600/40 text-[10px] font-bold uppercase tracking-wide transform hover:-translate-y-0.5">
                    <i data-lucide="play-circle" class="w-3.5 h-3.5 fill-current"></i> 
                    <span class="hidden sm:inline">Vidéo</span>
                </a>
            </div>
        </header>

        <div v-if="!activeLesson" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 animate-fade-in">
            
            <div class="text-center mb-20 space-y-6 relative">
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl -z-10"></div>
                
                <span class="inline-block px-4 py-1.5 rounded-full border border-brand-gold/30 bg-brand-gold/5 text-brand-gold text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                    Parcours Académique
                </span>
                <h1 class="font-display font-bold text-5xl md:text-6xl text-brand-dark dark:text-white tracking-tight">
                    Usul al-Fiqh
                </h1>
                <p class="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-serif leading-relaxed">
                    Maîtrisez les fondements de la jurisprudence islamique à travers une série de cours structurés, du concept de la Preuve à l'Ijtihad.
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                <div v-for="(lesson, index) in lessons" :key="lesson.id" 
                     @click="selectLesson(lesson)"
                     class="group relative bg-white dark:bg-[#18181B] rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-gold/10 border border-gray-100 dark:border-white/5 flex flex-col h-full overflow-hidden">
                    
                    <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-brand-gold/10 to-transparent rounded-bl-full -mr-16 -mt-16 transition-all group-hover:scale-150 duration-500 ease-out"></div>

                    <div class="relative z-10 flex justify-between items-start mb-6">
                        <span class="font-mono text-4xl font-bold text-gray-100 dark:text-white/5 group-hover:text-brand-gold/20 transition-colors">
                            {{ String(index + 1).padStart(2, '0') }}
                        </span>
                        <div class="w-8 h-8 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-brand-gold group-hover:text-white transition-colors duration-300">
                            <i data-lucide="arrow-up-right" class="w-4 h-4"></i>
                        </div>
                    </div>
                    
                    <div class="relative z-10 flex-grow">
                        <h3 class="font-display text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-brand-gold transition-colors leading-snug">
                            {{ lesson.title }}
                        </h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400 font-serif leading-relaxed line-clamp-3">
                            {{ lesson.intro }}
                        </p>
                    </div>

                    <div class="relative z-10 mt-8 pt-6 border-t border-gray-100 dark:border-white/5 flex items-center gap-3">
                        <div class="w-6 h-6 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold text-[10px] font-bold">
                            <i data-lucide="user" class="w-3 h-3"></i>
                        </div>
                        <span class="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                            {{ lesson.author.split(' ').slice(-1)[0] }} </span>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="flex justify-center animate-slide-up">
            
            <aside class="hidden xl:block w-64 fixed left-8 top-32 bottom-8 overflow-y-auto pr-4 scrollbar-hide">
                <nav class="space-y-1">
                    <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-3">Dans ce cours</p>
                    <a v-for="(section, index) in activeLesson.sections" 
                       :key="index"
                       @click.prevent="scrollToSection(index)"
                       class="block px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-dark dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer leading-tight">
                       {{ section.title.replace(/^[0-9]+\.\s*/, '') }}
                    </a>
                </nav>
            </aside>

            <main class="w-full max-w-3xl px-6 py-12 md:py-20 bg-white dark:bg-[#0F1115] md:bg-transparent shadow-sm md:shadow-none">
                
                <div class="text-center mb-16 border-b border-gray-100 dark:border-white/10 pb-12">
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 text-brand-gold text-[10px] font-bold uppercase tracking-widest mb-6">
                        <span class="w-2 h-2 rounded-full bg-brand-gold animate-pulse"></span>
                        Leçon {{ String(activeLesson.id).padStart(2, '0') }}
                    </div>
                    
                    <h1 class="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-gray-900 dark:text-white mb-8 leading-[1.1]">
                        {{ activeLesson.title }}
                    </h1>
                    
                    <div class="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-sm text-gray-500 dark:text-gray-400 font-medium">
                        <span class="flex items-center gap-2">
                            <i data-lucide="user" class="w-4 h-4 text-brand-gold"></i>
                            {{ activeLesson.author }}
                        </span>
                        <span class="hidden md:inline w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span class="flex items-center gap-2">
                            <i data-lucide="clock" class="w-4 h-4 text-brand-gold"></i>
                            Lecture : ~15 min
                        </span>
                    </div>
                </div>

                <div class="flex justify-center mb-16 opacity-60 dark:opacity-40">
                     <svg width="200" height="40" viewBox="0 0 200 40" fill="currentColor" class="text-brand-dark dark:text-white">
                        <path d="M100,20 Q120,5 140,20 T180,20" fill="none" stroke="currentColor" stroke-width="1" />
                        <path d="M100,20 Q80,35 60,20 T20,20" fill="none" stroke="currentColor" stroke-width="1" />
                        <circle cx="100" cy="15" r="3" />
                     </svg>
                </div>

                <div class="space-y-16">
                    <div v-for="(section, index) in activeLesson.sections" :key="index" 
                         :id="'section-' + index"
                         class="group scroll-mt-32">
                        
                        <div class="flex items-center gap-4 mb-6">
                            <span class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-brand-gold font-bold font-mono text-lg shadow-sm">
                                {{ index + 1 }}
                            </span>
                            <h2 class="font-display text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                {{ section.title.replace(/^[0-9]+\.\s*/, '') }}
                            </h2>
                        </div>

                        <div class="prose prose-lg prose-slate dark:prose-invert max-w-none 
                                    font-serif leading-[2] text-gray-700 dark:text-gray-300 text-justify tracking-wide">
                            <p v-html="formatText(section.content)"></p>
                        </div>

                        <div v-if="section.deepDive" class="mt-10 mx-auto transform hover:scale-[1.01] transition-transform duration-300">
                            <div class="relative overflow-hidden rounded-2xl bg-[#F8F5F2] dark:bg-[#1a1a1a] border border-[#E8E1D9] dark:border-gray-800 p-8">
                                <div class="absolute top-0 right-0 -mt-4 -mr-4 w-16 h-16 bg-brand-gold/10 rounded-full blur-xl"></div>
                                
                                <h3 class="relative font-bold text-brand-dark dark:text-brand-gold uppercase text-xs tracking-widest mb-4 flex items-center gap-3">
                                    <span class="flex items-center justify-center w-6 h-6 rounded bg-brand-gold text-white shadow-sm">
                                        <i data-lucide="lightbulb" class="w-3 h-3"></i>
                                    </span>
                                    {{ section.deepDive.title }}
                                </h3>
                                
                                <div class="relative text-base text-gray-700 dark:text-gray-400 font-serif italic leading-relaxed border-l-2 border-brand-gold/30 pl-4" 
                                     v-html="formatText(section.deepDive.content)">
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div class="mt-24 pt-12 border-t border-gray-200 dark:border-gray-800">
                    <div class="flex flex-col md:flex-row justify-between items-center gap-6">
                        
                        <button v-if="prevLesson" @click="selectLesson(prevLesson)" 
                                class="w-full md:w-auto flex items-center gap-4 px-6 py-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-brand-gold/50 hover:bg-gray-50 dark:hover:bg-white/5 transition-all group text-left">
                            <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-400 group-hover:text-brand-gold transition-colors">
                                <i data-lucide="arrow-left" class="w-5 h-5"></i>
                            </div>
                            <div>
                                <span class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Précédent</span>
                                <span class="block font-display font-bold text-gray-900 dark:text-white group-hover:text-brand-gold transition-colors text-sm line-clamp-1 max-w-[150px]">
                                    {{ prevLesson.title }}
                                </span>
                            </div>
                        </button>
                        <div v-else class="hidden md:block w-1/3"></div> <button v-if="nextLesson" @click="selectLesson(nextLesson)" 
                                class="w-full md:w-auto flex items-center justify-end gap-4 px-6 py-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-brand-gold/50 hover:bg-gray-50 dark:hover:bg-white/5 transition-all group text-right">
                            <div>
                                <span class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Suivant</span>
                                <span class="block font-display font-bold text-gray-900 dark:text-white group-hover:text-brand-gold transition-colors text-sm line-clamp-1 max-w-[150px]">
                                    {{ nextLesson.title }}
                                </span>
                            </div>
                            <div class="w-10 h-10 rounded-full bg-brand-dark flex items-center justify-center text-white shadow-lg shadow-brand-dark/20 group-hover:bg-brand-gold transition-colors">
                                <i data-lucide="arrow-right" class="w-5 h-5"></i>
                            </div>
                        </button>
                    </div>
                    
                    <div class="mt-12 text-center">
                        <button @click="handleBack" class="text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 uppercase tracking-widest transition-colors pb-1 border-b border-transparent hover:border-gray-400">
                            Retourner au menu principal
                        </button>
                    </div>
                </div>
                
            </main>
        </div>
    </div>
    `
};