const HadithReaderView = {
    props: ['hadith', 'settings', 'closeReader', 'shareHadith', 'adjustFontSize'],
    template: `
    <div class="min-h-full bg-brand-paper dark:bg-brand-dark relative">
        
        <div class="sticky top-0 z-40 bg-white/90 dark:bg-brand-dark-lighter/90 backdrop-blur-md border-b border-brand-gold/10 py-3 px-4 flex justify-between items-center md:hidden transition-all duration-300">
            <button @click="closeReader" class="text-gray-500 dark:text-gray-400 p-2 -ml-2 active:scale-95"><i data-lucide="arrow-left" class="w-5 h-5"></i></button>
            <span class="font-bold text-xs font-display uppercase tracking-widest text-brand-gold">Hadith</span>
            <button @click="shareHadith" class="text-gray-500 dark:text-gray-400 p-2 -mr-2"><i data-lucide="share-2" class="w-4 h-4"></i></button>
        </div>

        <div class="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-16 animate-fade-in">
            
            <div class="hidden md:flex justify-between items-center mb-12">
                <button @click="closeReader" class="group flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-brand-dark dark:hover:text-white transition-colors pl-2">
                    <i data-lucide="arrow-left" class="w-4 h-4 group-hover:-translate-x-1 transition-transform"></i> Retour
                </button>
                <div class="flex items-center gap-2 bg-white dark:bg-brand-dark-lighter p-1 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
                    <button @click="adjustFontSize" class="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-brand-dark transition-colors" title="Agrandir le texte">
                        <i data-lucide="type" class="w-4 h-4"></i>
                    </button>
                    <div class="w-px h-4 bg-gray-200 dark:bg-gray-700"></div>
                    <button @click="shareHadith" class="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-brand-gold transition-colors" title="Partager">
                        <i data-lucide="share-2" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>

            <div class="bg-white dark:bg-brand-dark-lighter rounded-[2rem] shadow-xl border border-brand-gold/20 overflow-hidden relative mb-12">
                
                <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-gold/40 via-brand-gold to-brand-gold/40"></div>
                <div class="absolute -top-24 -right-24 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none"></div>

                <div class="p-8 md:p-16 text-center">
                    
                    <div class="flex flex-col items-center gap-4 mb-10">
                        <span class="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full text-[10px] font-bold uppercase tracking-widest border border-green-100 dark:border-green-900/30">
                            {{ hadith.grade }}
                        </span>
                        <h1 class="font-display font-bold text-2xl md:text-4xl text-brand-dark dark:text-white leading-tight">
                            {{ hadith.title }}
                        </h1>
                    </div>

                    <div class="mb-12 relative">
                        <i class="absolute -top-6 left-0 text-6xl text-brand-gold/10 font-serif opacity-50 select-none">“</i>
                        
                        <p class="font-arabic text-3xl md:text-5xl text-brand-dark dark:text-gray-100 text-center px-2 md:px-10 py-6" 
                           dir="rtl" 
                           style="line-height: 2.8;">
                            {{ hadith.hadeeth_ar }}
                        </p>
                        
                        <i class="absolute -bottom-10 right-0 text-6xl text-brand-gold/10 font-serif opacity-50 select-none transform rotate-180">“</i>
                    </div>

                    <div class="flex items-center justify-center gap-4 mb-10 opacity-30">
                        <div class="h-px w-24 bg-brand-gold"></div>
                        <div class="w-2 h-2 rotate-45 border border-brand-gold"></div>
                        <div class="h-px w-24 bg-brand-gold"></div>
                    </div>

                    <div class="font-serif text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed italic" 
                         :style="{ fontSize: settings.fontSize + 'px' }">
                        {{ hadith.hadeeth }}
                    </div>

                    <div class="mt-10 pt-6 border-t border-gray-100 dark:border-gray-700">
                        <p class="text-xs text-brand-gold font-bold uppercase tracking-widest">
                            Source : {{ hadith.attribution }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="bg-brand-paper dark:bg-brand-dark border-l-4 border-brand-gold/30 pl-6 md:pl-10 py-4 mb-12">
                <h3 class="font-display text-xl font-bold text-brand-dark dark:text-white mb-6 flex items-center gap-3">
                    <span class="w-8 h-8 rounded-lg bg-brand-gold/10 flex items-center justify-center text-brand-gold"><i data-lucide="book-open" class="w-4 h-4"></i></span>
                    Explication & Contexte
                </h3>
                <div class="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 leading-loose font-serif text-justify"
                     :style="{ fontSize: settings.fontSize + 'px' }">
                    {{ hadith.explanation }}
                </div>
            </div>

            <div v-if="hadith.hints && hadith.hints.length" class="bg-white dark:bg-brand-dark-lighter rounded-2xl p-8 md:p-10 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 class="font-display text-lg font-bold text-brand-dark dark:text-white mb-8 flex items-center gap-3">
                    <i data-lucide="lightbulb" class="w-5 h-5 text-brand-gold"></i>
                    Ce qu'il faut retenir
                </h3>
                <ul class="space-y-4">
                    <li v-for="(hint, i) in hadith.hints" :key="i" class="flex gap-4 group">
                        <div class="flex flex-col items-center gap-1">
                            <span class="w-6 h-6 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center text-xs font-bold shrink-0 group-hover:bg-brand-gold group-hover:text-white transition-colors duration-300">{{ i + 1 }}</span>
                            <div v-if="i !== hadith.hints.length - 1" class="w-px h-full bg-gray-100 dark:bg-gray-700 group-hover:bg-brand-gold/30 transition-colors"></div>
                        </div>
                        <span class="text-gray-600 dark:text-gray-400 leading-relaxed text-sm md:text-base pb-4">{{ hint }}</span>
                    </li>
                </ul>
            </div>

            <div class="text-center mt-16 pb-12 opacity-50 hover:opacity-100 transition-opacity">
                <button @click="closeReader" class="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-brand-gold transition-colors flex items-center justify-center gap-2 mx-auto">
                    <i data-lucide="x-circle" class="w-4 h-4"></i> Fermer la lecture
                </button>
            </div>

        </div>
    </div>
    `
};