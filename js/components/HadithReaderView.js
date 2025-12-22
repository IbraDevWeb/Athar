const HadithReaderView = {
    props: ['hadith', 'settings', 'closeReader', 'shareHadith', 'adjustFontSize'],
    template: `
    <div class="min-h-full bg-brand-paper dark:bg-brand-dark">
        <div class="sticky top-0 z-30 bg-white/95 dark:bg-brand-dark-lighter/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 py-3 px-4 flex justify-between items-center md:hidden shadow-sm">
            <button @click="closeReader" class="text-gray-500 p-1 active:scale-95"><i data-lucide="arrow-left" class="w-5 h-5"></i></button>
            <span class="font-bold text-xs font-display uppercase tracking-widest text-brand-dark dark:text-gray-100">Hadith #{{ hadith.id }}</span>
            <button @click="shareHadith" class="text-gray-500 p-2"><i data-lucide="share-2" class="w-4 h-4"></i></button>
        </div>

        <div class="max-w-5xl mx-auto px-4 md:px-8 py-10 md:py-16 animate-fade-in relative">
            
            <div class="hidden md:flex justify-between items-center mb-10">
                <button @click="closeReader" class="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-brand-gold transition-colors">
                    <div class="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center group-hover:border-brand-gold group-hover:bg-brand-gold group-hover:text-white transition-all"><i data-lucide="arrow-left" class="w-3 h-3"></i></div>
                    Retour
                </button>
                <div class="flex gap-2">
                    <button @click="adjustFontSize" class="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-brand-dark dark:hover:text-white hover:border-brand-dark transition-all" title="Taille texte"><i data-lucide="type" class="w-4 h-4"></i></button>
                    <button @click="shareHadith" class="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-brand-gold hover:border-brand-gold transition-all"><i data-lucide="share-2" class="w-4 h-4"></i></button>
                </div>
            </div>

            <div class="bg-white dark:bg-brand-dark-lighter rounded-2xl shadow-card border border-gray-100 dark:border-gray-700 overflow-hidden relative">
                <div class="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-bl-full pointer-events-none"></div>
                
                <div class="p-8 md:p-14 text-center border-b border-gray-100 dark:border-gray-700">
                    <div class="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/10 text-brand-gold rounded-full text-[10px] font-bold uppercase tracking-widest mb-8">
                        {{ hadith.grade }}
                    </div>
                    
                    <h1 class="font-display font-bold text-2xl md:text-4xl text-brand-dark dark:text-white mb-10 leading-tight">
                        {{ hadith.title }}
                    </h1>

                    <div class="bg-brand-paper dark:bg-brand-dark/50 p-8 md:p-12 rounded-2xl relative mb-10 shadow-inner border border-brand-gold/10 w-full">
                        <i class="text-5xl text-brand-gold/20 font-serif absolute top-4 left-6">“</i>
                        
                        <p class="font-arabic text-3xl md:text-4xl text-brand-dark dark:text-gray-100 leading-[2.8] text-center" dir="rtl" :style="{ fontSize: (settings.fontSize + 10) + 'px' }">
                            {{ hadith.hadeeth_ar }}
                        </p>
                    </div>

                    <div class="font-serif text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed italic px-4" :style="{ fontSize: settings.fontSize + 'px' }">
                        {{ hadith.hadeeth }}
                    </div>

                    <p class="text-xs text-gray-400 mt-8 uppercase tracking-widest font-bold">
                        — {{ hadith.attribution }}
                    </p>
                </div>

                <div class="p-8 md:p-14 bg-gray-50/50 dark:bg-black/5">
                    <h3 class="font-display text-lg font-bold text-brand-dark dark:text-gray-100 mb-6 flex items-center gap-3">
                        <i data-lucide="book-open" class="w-5 h-5 text-brand-gold"></i> Explication
                    </h3>
                    <div class="prose prose-brand dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 leading-loose font-serif text-justify" :style="{ fontSize: settings.fontSize + 'px' }">
                        {{ hadith.explanation }}
                    </div>

                    <div v-if="hadith.hints && hadith.hints.length" class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                        <h3 class="font-display text-lg font-bold text-brand-dark dark:text-gray-100 mb-6 flex items-center gap-3">
                            <i data-lucide="lightbulb" class="w-5 h-5 text-brand-gold"></i> Leçons à retenir
                        </h3>
                        <ul class="space-y-4">
                            <li v-for="(hint, i) in hadith.hints" :key="i" class="flex gap-4 items-start p-3 rounded-lg hover:bg-white dark:hover:bg-brand-dark-lighter transition-colors">
                                <span class="w-6 h-6 rounded-full bg-brand-gold/20 text-brand-gold flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{{ i + 1 }}</span>
                                <span class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ hint }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="text-center mt-12 pb-10">
                <button @click="closeReader" class="px-8 py-3 rounded-full bg-white dark:bg-brand-dark-lighter border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-500 hover:text-brand-gold hover:border-brand-gold uppercase tracking-widest inline-flex items-center gap-2 transition-all shadow-sm hover:shadow-md active:scale-95">
                    Fermer le Hadith
                </button>
            </div>
        </div>
    </div>
    `
};