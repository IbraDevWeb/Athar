const UssulView = {
    props: ['lessons', 'formatText', 'goHome'],
    data() {
        return {
            activeLesson: null,
            scrollProgress: 0,
            activeSectionIndex: 0
        }
    },
    computed: {
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
        window.addEventListener('scroll', this.handleScroll);
    },
    beforeUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
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
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                this.goHome();
            }
        },
        handleScroll() {
            if (!this.activeLesson) return;
            
            // 1. Barre de progression
            const scrollTop = window.scrollY;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            this.scrollProgress = (scrollTop / docHeight) * 100;

            // 2. Détection de la section active pour le sommaire
            const sections = document.querySelectorAll('.lesson-section');
            sections.forEach((section, index) => {
                const rect = section.getBoundingClientRect();
                if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
                    this.activeSectionIndex = index;
                }
            });
        },
        scrollToSection(index) {
            const element = document.getElementById(`section-${index}`);
            if (element) {
                const offset = 100; // Marge pour le header sticky
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                this.activeSectionIndex = index;
            }
        }
    },
    template: `
    <div class="min-h-full bg-brand-paper dark:bg-brand-dark relative transition-colors duration-500 font-sans selection:bg-brand-gold/30 selection:text-brand-dark">
        
        <div v-if="activeLesson" class="fixed top-0 left-0 h-1 bg-brand-gold z-[60] transition-all duration-100 ease-out shadow-[0_0_10px_rgba(197,160,89,0.5)]" :style="{ width: scrollProgress + '%' }"></div>

        <header class="sticky top-0 z-50 h-16 bg-white/90 dark:bg-brand-dark-lighter/90 backdrop-blur-xl border-b border-brand-gold/10 flex items-center justify-between px-4 md:px-8 transition-all shadow-sm">
            
            <button @click="handleBack" 
                    class="group flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-brand-dark dark:text-gray-400 dark:hover:text-white transition-colors">
                <div class="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center group-hover:bg-brand-gold group-hover:border-brand-gold group-hover:text-white transition-all">
                    <i data-lucide="arrow-left" class="w-4 h-4 transition-transform group-hover:-translate-x-0.5"></i>
                </div>
                <span class="hidden md:inline">
                    {{ activeLesson ? 'Retour au sommaire' : 'Accueil' }}
                </span>
            </button>
            
            <div class="absolute left-1/2 -translate-x-1/2 transition-opacity duration-300 pointer-events-none hidden md:block" 
                 :class="{'opacity-0': !activeLesson || scrollProgress < 5, 'opacity-100': activeLesson && scrollProgress > 5}">
                <span v-if="activeLesson" class="font-display font-bold text-brand-dark dark:text-white text-sm tracking-wide truncate max-w-[300px]">
                    {{ activeLesson.title }}
                </span>
            </div>

            <div class="flex items-center gap-3">
                 <span v-if="activeLesson" class="px-3 py-1 rounded-full bg-brand-gold/10 text-brand-gold text-[9px] font-bold uppercase tracking-widest border border-brand-gold/20 hidden md:block">
                    Leçon {{ String(activeLesson.id).padStart(2, '0') }}
                </span>
                <a v-if="activeLesson && activeLesson.videoUrl" :href="activeLesson.videoUrl" target="_blank" 
                   class="w-9 h-9 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm border border-red-100 dark:border-red-900/30" title="Voir la vidéo">
                    <i data-lucide="play" class="w-3.5 h-3.5 fill-current"></i>
                </a>
            </div>
        </header>

        <div v-if="!activeLesson" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 animate-fade-in">
            
            <div class="text-center mb-20 space-y-6 relative">
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl -z-10"></div>
                
                <span class="inline-block px-4 py-1.5 rounded-full border border-brand-gold/30 bg-white dark:bg-brand-dark-lighter text-brand-gold text-[10px] font-bold uppercase tracking-[0.2em] mb-4 shadow-sm">
                    Académie
                </span>
                <h1 class="font-display font-bold text-5xl md:text-7xl text-brand-dark dark:text-white tracking-tight">
                    Oussoul <span class="text-brand-gold">Al-Fiqh</span>
                </h1>
                <p class="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-serif leading-relaxed">
                    Les fondements de la compréhension. Une série structurée pour maîtriser les outils de la jurisprudence islamique.
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 pb-20">
                <div v-for="(lesson, index) in lessons" :key="lesson.id" 
                     @click="selectLesson(lesson)"
                     class="group relative bg-white dark:bg-brand-dark-lighter rounded-[2rem] p-8 cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(197,160,89,0.15)] border border-gray-100 dark:border-white/5 flex flex-col h-full overflow-hidden animate-slide-up"
                     :style="{ animationDelay: index * 0.05 + 's' }">
                    
                    <span class="absolute top-4 right-6 font-display text-6xl font-bold text-gray-50 dark:text-white/5 group-hover:text-brand-gold/10 transition-colors select-none">
                        {{ String(index + 1).padStart(2, '0') }}
                    </span>

                    <div class="relative z-10 flex flex-col h-full">
                        <div class="w-12 h-12 rounded-2xl bg-brand-paper dark:bg-brand-dark flex items-center justify-center text-brand-gold mb-6 group-hover:scale-110 transition-transform duration-500 border border-brand-gold/10">
                            <i data-lucide="book-open" class="w-6 h-6"></i>
                        </div>
                        
                        <h3 class="font-display text-xl font-bold text-brand-dark dark:text-white mb-3 group-hover:text-brand-gold transition-colors leading-snug">
                            {{ lesson.title }}
                        </h3>
                        
                        <p class="text-sm text-gray-500 dark:text-gray-400 font-serif leading-relaxed line-clamp-3 mb-6 flex-grow">
                            {{ lesson.intro }}
                        </p>

                        <div class="pt-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <i data-lucide="clock" class="w-3 h-3"></i> 15 min
                            </span>
                            <span class="text-[10px] font-bold text-brand-gold uppercase tracking-widest group-hover:underline flex items-center gap-1">
                                Commencer <i data-lucide="arrow-right" class="w-3 h-3"></i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="flex justify-center animate-slide-up relative">
            
            <aside class="hidden xl:block w-72 fixed left-8 top-32 bottom-8 overflow-y-auto pr-4 scrollbar-thin pl-4 border-l border-brand-gold/10">
                <nav class="space-y-1">
                    <p class="text-[10px] font-bold text-brand-gold uppercase tracking-[0.2em] mb-6">Plan du cours</p>
                    <a v-for="(section, index) in activeLesson.sections" 
                       :key="index"
                       @click.prevent="scrollToSection(index)"
                       class="block px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-brand-dark dark:hover:text-white hover:bg-white dark:hover:bg-white/5 rounded-lg transition-all cursor-pointer leading-relaxed border-l-2 border-transparent"
                       :class="{'border-brand-gold text-brand-dark dark:text-white bg-white dark:bg-white/5 shadow-sm': activeSectionIndex === index}">
                       {{ section.title.replace(/^[0-9]+\.\s*/, '') }}
                    </a>
                </nav>
            </aside>

            <main class="w-full max-w-3xl px-6 py-12 md:py-20 md:mx-auto">
                
                <div class="text-center mb-16 border-b border-brand-gold/10 pb-12">
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 text-brand-gold text-[10px] font-bold uppercase tracking-widest mb-6 border border-brand-gold/20">
                        <span class="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse"></span>
                        Leçon {{ String(activeLesson.id).padStart(2, '0') }}
                    </div>
                    
                    <h1 class="font-display font-bold text-3xl md:text-5xl text-brand-dark dark:text-white mb-8 leading-tight">
                        {{ activeLesson.title }}
                    </h1>
                    
                    <div class="flex flex-wrap justify-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                        <span class="flex items-center gap-2 bg-white dark:bg-brand-dark-lighter border border-gray-200 dark:border-white/10 px-3 py-1.5 rounded-full">
                            <i data-lucide="user" class="w-3 h-3 text-brand-gold"></i>
                            {{ activeLesson.author ? activeLesson.author : 'Cheikh Al-Kamel' }}
                        </span>
                        <span class="flex items-center gap-2 bg-white dark:bg-brand-dark-lighter border border-gray-200 dark:border-white/10 px-3 py-1.5 rounded-full">
                            <i data-lucide="book" class="w-3 h-3 text-brand-gold"></i>
                            {{ activeLesson.sections.length }} Chapitres
                        </span>
                    </div>
                </div>

                <div class="space-y-20">
                    <div v-for="(section, index) in activeLesson.sections" :key="index" 
                         :id="'section-' + index"
                         class="lesson-section scroll-mt-32">
                        
                        <div class="flex items-start gap-4 mb-6">
                            <span class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-brand-dark dark:bg-white text-brand-gold dark:text-brand-dark font-mono font-bold text-sm shadow-md mt-1">
                                {{ index + 1 }}
                            </span>
                            <h2 class="font-display text-2xl font-bold text-brand-dark dark:text-white leading-tight pt-1">
                                {{ section.title.replace(/^[0-9]+\.\s*/, '') }}
                            </h2>
                        </div>

                        <div class="prose prose-lg dark:prose-invert max-w-none font-serif leading-loose text-gray-600 dark:text-gray-300 text-justify pl-0 md:pl-12">
                            <p v-html="formatText(section.content)"></p>
                        </div>

                        <div v-if="section.deepDive" class="mt-10 ml-0 md:ml-12">
                            <div class="relative overflow-hidden rounded-2xl bg-[#F8F5F2] dark:bg-[#151920] border-l-4 border-brand-gold p-6 md:p-8 shadow-sm">
                                
                                <h3 class="font-bold text-brand-dark dark:text-white uppercase text-xs tracking-widest mb-4 flex items-center gap-2">
                                    <i data-lucide="microscope" class="w-4 h-4 text-brand-gold"></i>
                                    {{ section.deepDive.title || "Pour aller plus loin" }}
                                </h3>
                                
                                <div class="relative text-sm md:text-base text-gray-600 dark:text-gray-400 font-serif italic leading-relaxed" 
                                     v-html="formatText(section.deepDive.content)">
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div class="mt-32 pt-12 border-t border-brand-gold/10">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        <button v-if="prevLesson" @click="selectLesson(prevLesson)" 
                                class="flex items-center gap-4 p-4 rounded-2xl border border-gray-200 dark:border-white/5 hover:border-brand-gold/50 bg-white dark:bg-brand-dark-lighter hover:shadow-lg transition-all group text-left">
                            <div class="w-10 h-10 rounded-full bg-brand-paper dark:bg-brand-dark flex items-center justify-center text-gray-400 group-hover:text-brand-gold transition-colors shrink-0">
                                <i data-lucide="arrow-left" class="w-5 h-5"></i>
                            </div>
                            <div>
                                <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Précédent</span>
                                <span class="block font-display font-bold text-brand-dark dark:text-white group-hover:text-brand-gold transition-colors text-sm line-clamp-1">
                                    {{ prevLesson.title }}
                                </span>
                            </div>
                        </button>
                        <div v-else class="hidden md:block"></div> 

                        <button v-if="nextLesson" @click="selectLesson(nextLesson)" 
                                class="flex items-center justify-between md:justify-end gap-4 p-4 rounded-2xl border border-gray-200 dark:border-white/5 hover:border-brand-gold/50 bg-white dark:bg-brand-dark-lighter hover:shadow-lg transition-all group text-right">
                            <div>
                                <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Suivant</span>
                                <span class="block font-display font-bold text-brand-dark dark:text-white group-hover:text-brand-gold transition-colors text-sm line-clamp-1">
                                    {{ nextLesson.title }}
                                </span>
                            </div>
                            <div class="w-10 h-10 rounded-full bg-brand-dark flex items-center justify-center text-white shadow-lg shadow-brand-dark/20 group-hover:bg-brand-gold transition-colors shrink-0">
                                <i data-lucide="arrow-right" class="w-5 h-5"></i>
                            </div>
                        </button>
                    </div>
                    
                    <div class="mt-16 text-center">
                        <button @click="handleBack" class="px-8 py-3 rounded-full border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-400 hover:text-brand-dark dark:hover:text-white hover:border-brand-gold uppercase tracking-widest transition-all hover:bg-white dark:hover:bg-white/5">
                            Fermer le cours
                        </button>
                    </div>
                </div>
                
            </main>
        </div>
    </div>
    `
};