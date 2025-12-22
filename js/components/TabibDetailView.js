const TabibDetailView = {
    props: ['remedy', 'closeRemedy', 'settings'],
    template: `
    <div class="max-w-4xl mx-auto px-4 py-8 pb-24 min-h-full">
        
        <button @click="closeRemedy" class="mb-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-brand-gold transition-colors group">
            <div class="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center group-hover:bg-brand-gold group-hover:text-white group-hover:border-transparent transition-all">
                <i data-lucide="arrow-left" class="w-4 h-4"></i>
            </div>
            Retour aux remèdes
        </button>

        <div class="text-center mb-10">
            <div class="inline-flex items-center justify-center p-4 rounded-2xl bg-white dark:bg-brand-dark-lighter shadow-lg shadow-emerald-500/10 mb-6 border border-gray-100 dark:border-gray-700">
                <i :data-lucide="remedy.icon" class="w-10 h-10 text-emerald-600"></i>
            </div>
            <h1 class="font-display text-3xl md:text-5xl font-bold text-brand-dark dark:text-white mb-4">{{ remedy.title }}</h1>
            <p class="text-lg text-gray-500 dark:text-gray-400 font-serif italic max-w-2xl mx-auto">"{{ remedy.intro }}"</p>
        </div>

        <div class="grid gap-8 animate-fade-in">
            
            <div v-if="remedy.quran" class="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-3xl p-8 border border-emerald-100 dark:border-emerald-800/30 relative overflow-hidden shadow-sm">
                <div class="absolute top-0 right-0 p-6 opacity-5"><i data-lucide="book-open" class="w-32 h-32 text-emerald-900 dark:text-white"></i></div>
                <div class="relative z-10">
                    <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 mb-6 block">La Parole Divine</span>
                    <p class="font-arabic text-3xl md:text-4xl text-center leading-[2.2] text-emerald-950 dark:text-emerald-50 mb-8" dir="rtl">
                        {{ remedy.quran.ar }}
                    </p>
                    <div class="bg-white/60 dark:bg-black/20 backdrop-blur-sm rounded-xl p-6 text-center border border-emerald-100/50 dark:border-emerald-900/30">
                        <p class="text-emerald-800 dark:text-emerald-200 text-lg font-serif italic mb-3">{{ remedy.quran.fr }}</p>
                        <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">— {{ remedy.quran.ref }}</span>
                    </div>
                </div>
            </div>

            <div class="bg-white dark:bg-brand-dark-lighter rounded-3xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 class="font-display text-xl font-bold text-brand-dark dark:text-white mb-6 flex items-center gap-3">
                    <i data-lucide="lightbulb" class="w-5 h-5 text-brand-gold"></i> Comprendre le mal
                </h3>
                <div class="prose prose-brand dark:prose-invert max-w-none font-sans text-gray-600 dark:text-gray-300 leading-loose text-justify">
                    <p v-html="remedy.tafsir"></p>
                </div>
            </div>

            <div class="bg-white dark:bg-brand-dark-lighter rounded-3xl p-8 md:p-12 border border-gray-200 dark:border-gray-700 shadow-xl relative overflow-hidden">
                <div class="absolute inset-0 bg-islamic opacity-5 pointer-events-none"></div>
                <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-gold via-emerald-500 to-brand-gold"></div>
                
                <div class="text-center relative z-10">
                    <span class="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold border-b border-brand-gold/20 pb-1 mb-8 inline-block">Invocation Prophétique</span>

                    <p class="font-arabic text-3xl md:text-4xl text-brand-dark dark:text-gray-100 leading-[2.8] text-center" dir="rtl" :style="{ fontSize: (settings.fontSize + 10) + 'px' }">
                        {{ remedy.hadith.ar }}
                    </p>

                    <div class="space-y-6 bg-gray-50 dark:bg-brand-dark/50 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-700/50">
                        <div>
                            <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Phonétique</h4>
                            <p class="text-sm md:text-base text-gray-600 dark:text-gray-300 font-medium leading-relaxed">{{ remedy.hadith.phonetic }}</p>
                        </div>
                        <div class="w-12 h-px bg-gray-200 dark:bg-gray-700 mx-auto"></div>
                        <div>
                            <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Traduction</h4>
                            <p class="text-sm md:text-base text-gray-600 dark:text-gray-300 italic">"{{ remedy.hadith.fr }}"</p>
                        </div>
                    </div>
                    <div class="mt-4 text-xs text-gray-400">Source : {{ remedy.hadith.source }}</div>
                </div>
            </div>

            <div class="bg-sky-50 dark:bg-sky-900/10 rounded-3xl p-8 border border-sky-100 dark:border-sky-800/30">
                <h3 class="font-display text-xl font-bold text-sky-800 dark:text-sky-100 mb-6 flex items-center gap-3">
                    <i data-lucide="clipboard-list" class="w-5 h-5 text-sky-500"></i> Ordonnance Pratique
                </h3>
                <div class="space-y-4">
                    <div v-for="(action, i) in remedy.actions" :key="i" class="flex gap-4 items-start p-4 bg-white dark:bg-brand-dark-lighter rounded-xl border border-sky-100 dark:border-sky-800/50 shadow-sm">
                        <span class="flex-shrink-0 w-6 h-6 rounded-full bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 flex items-center justify-center text-xs font-bold mt-0.5">{{ i + 1 }}</span>
                        <span class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{{ action }}</span>
                    </div>
                </div>
            </div>

        </div>
    </div>
    `
};