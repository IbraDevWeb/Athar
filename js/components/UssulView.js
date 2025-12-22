const UssulView = {
    props: ['lessons', 'formatText', 'goHome'],
    data() {
        return {
            activeLesson: null // Par défaut, on n'affiche aucune leçon, donc on voit le menu
        }
    },
    methods: {
        selectLesson(lesson) {
            this.activeLesson = lesson;
            window.scrollTo(0, 0);
        },
        handleBack() {
            // Si on est dans une leçon, on revient au menu
            if (this.activeLesson) {
                this.activeLesson = null;
            } else {
                // Sinon, on revient à l'accueil général de l'app
                this.goHome();
            }
        }
    },
    template: `
    <div class="min-h-full bg-brand-paper dark:bg-brand-dark relative">
        
        <header class="sticky top-0 z-30 h-16 bg-white/90 dark:bg-brand-dark-lighter/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 flex items-center justify-between px-4 md:px-6 transition-all shadow-sm">
            <div class="flex items-center gap-4">
                <button @click="handleBack" class="text-gray-500 hover:text-brand-gold transition-colors flex items-center gap-2">
                    <i data-lucide="arrow-left" class="w-5 h-5"></i>
                    <span v-if="activeLesson" class="text-xs font-bold uppercase tracking-widest hidden md:inline">Retour au menu</span>
                </button>
                <div class="flex flex-col">
                    <span class="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Oussoul Al-Fiqh</span>
                    <span class="font-bold font-display text-brand-dark dark:text-gray-100 text-sm md:text-base truncate max-w-[200px] md:max-w-md">
                        {{ activeLesson ? activeLesson.title : 'Sommaire des cours' }}
                    </span>
                </div>
            </div>
            
            <a v-if="activeLesson" :href="activeLesson.videoUrl" target="_blank" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center gap-2 transition-all shadow-lg shadow-red-600/20 text-xs font-bold uppercase tracking-wide group hover:-translate-y-0.5">
                <i data-lucide="youtube" class="w-4 h-4 group-hover:fill-current"></i> 
                <span class="hidden md:inline">Voir la vidéo</span>
            </a>
        </header>

        <div v-if="!activeLesson" class="max-w-5xl mx-auto p-6 md:p-12 animate-fade-in">
            <div class="text-center mb-12">
                <h1 class="font-display font-bold text-3xl md:text-4xl text-brand-dark dark:text-white mb-4">
                    Les Fondements
                </h1>
                <p class="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                    Sélectionnez un cours pour explorer les règles de la jurisprudence islamique.
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div v-for="(lesson, index) in lessons" :key="lesson.id" 
                     @click="selectLesson(lesson)"
                     class="group cursor-pointer bg-white dark:bg-brand-dark-lighter rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm hover:shadow-xl hover:border-brand-gold/30 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                    
                    <div class="absolute -right-4 -top-4 text-9xl font-display font-bold text-gray-50 dark:text-brand-dark opacity-50 group-hover:text-brand-gold/10 transition-colors pointer-events-none">
                        {{ index + 1 }}
                    </div>

                    <div class="relative z-10">
                        <span class="inline-block px-3 py-1 bg-brand-gold/10 text-brand-gold rounded-full text-[10px] font-bold tracking-widest uppercase mb-4">
                            Leçon {{ index + 1 }}
                        </span>
                        
                        <h3 class="font-display text-xl font-bold text-brand-dark dark:text-gray-100 mb-2 group-hover:text-brand-gold transition-colors">
                            {{ lesson.title }}
                        </h3>
                        
                        <p class="text-sm text-gray-500 dark:text-gray-400 font-serif italic mb-6 line-clamp-2">
                            {{ lesson.intro }}
                        </p>

                        <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                            <span class="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-2">
                                <i data-lucide="user" class="w-3 h-3"></i> {{ lesson.author }}
                            </span>
                            <span class="w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center group-hover:bg-brand-gold transition-colors shadow-lg">
                                <i data-lucide="arrow-right" class="w-4 h-4"></i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="max-w-4xl mx-auto p-6 md:p-12 animate-slide-up">
            
            <div class="text-center mb-16">
                <span class="inline-block px-3 py-1 border border-brand-gold/30 rounded-full text-[10px] font-bold tracking-widest text-brand-gold uppercase bg-white dark:bg-brand-dark-lighter shadow-sm mb-4">
                    Les Fondements de La Jurisprudence
                </span>
                <h1 class="font-display font-bold text-3xl md:text-5xl text-brand-dark dark:text-white mb-6 leading-tight">
                    {{ activeLesson.title }}
                </h1>
                <p class="text-gray-500 dark:text-gray-400 italic font-serif">
                    Explication de l'ouvrage d'{{ activeLesson.author }}
                </p>
            </div>

            <div class="space-y-12 relative">
                <div class="absolute left-0 md:-left-8 top-0 bottom-0 w-px bg-brand-gold/20 hidden md:block"></div>

                <div v-for="(section, index) in activeLesson.sections" :key="index" class="relative group animate-slide-up" :style="{ animationDelay: index * 0.1 + 's' }">
                    
                    <div class="hidden md:flex absolute -left-12 top-0 w-8 h-8 bg-brand-paper dark:bg-brand-dark border border-brand-gold/50 rounded-full items-center justify-center text-brand-gold font-bold font-serif text-sm z-10 group-hover:bg-brand-gold group-hover:text-white transition-colors">
                        {{ index + 1 }}
                    </div>

                    <h2 class="font-display text-2xl font-bold text-brand-dark dark:text-gray-100 mb-4 flex items-center gap-3">
                        <span class="md:hidden text-brand-gold text-lg">#{{ index + 1 }}</span>
                        {{ section.title }}
                    </h2>

                    <div class="prose prose-brand dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-loose font-serif text-justify text-lg">
                        <p v-html="formatText(section.content)"></p>
                    </div>

                    <div v-if="section.deepDive" class="mt-6 bg-white dark:bg-brand-dark-lighter border-l-4 border-brand-gold rounded-r-xl p-6 shadow-sm my-8">
                        <h3 class="font-bold text-brand-gold uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
                            <i data-lucide="microscope" class="w-4 h-4"></i> {{ section.deepDive.title }}
                        </h3>
                        <p class="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed" v-html="formatText(section.deepDive.content)"></p>
                    </div>

                </div>
            </div>

            <div class="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
                <p class="text-xs text-gray-400">Basé sur les cours du Sheikh Dr. Yusuf Al-Ghafis</p>
            </div>
        </div>
    </div>
    `
};