const AdhkarReaderView = {
    props: ['dhikr', 'settings', 'counts', 'closeReader', 'handleDhikrClick', 'getProgress', 'copyText', 'adjustFontSize'],
    template: `
    <div class="min-h-full bg-brand-paper dark:bg-brand-dark">
        
        <div class="sticky top-0 z-30 bg-white/95 dark:bg-brand-dark-lighter/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 py-3 px-4 flex justify-between items-center md:hidden shadow-sm">
            <button @click="closeReader" class="text-gray-500 p-1 active:scale-95"><i data-lucide="arrow-left" class="w-5 h-5"></i></button>
            <span class="font-bold text-xs font-display uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Invocation</span>
            <button @click="copyText(dhikr.arabic)" class="text-gray-500 p-2"><i data-lucide="copy" class="w-4 h-4"></i></button>
        </div>

        <div class="max-w-4xl mx-auto px-4 md:px-8 py-10 md:py-16 animate-fade-in relative">
            
            <div class="hidden md:flex justify-between items-center mb-10">
                <button @click="closeReader" class="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-indigo-600 transition-colors">
                    <div class="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center group-hover:border-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all"><i data-lucide="arrow-left" class="w-3 h-3"></i></div>
                    Retour aux Adhkar
                </button>
                <div class="flex gap-2">
                    <button @click="adjustFontSize" class="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-brand-dark dark:hover:text-white hover:border-brand-dark transition-all" title="Taille texte"><i data-lucide="type" class="w-4 h-4"></i></button>
                    <button @click="copyText(dhikr.arabic)" class="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-indigo-500 hover:border-indigo-500 transition-all"><i data-lucide="copy" class="w-4 h-4"></i></button>
                </div>
            </div>

            <div class="bg-white dark:bg-brand-dark-lighter rounded-3xl shadow-card border border-gray-100 dark:border-gray-700 overflow-hidden relative">
                <div class="absolute top-0 right-0 w-40 h-40 bg-indigo-500/5 rounded-bl-full pointer-events-none"></div>
                
                <div class="p-8 md:p-12 text-center border-b border-gray-100 dark:border-gray-700">
                    <div class="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 rounded-full text-[10px] font-bold uppercase tracking-widest mb-8">
                        {{ dhikr.category }}
                    </div>
                    
                    <h1 class="font-display font-bold text-2xl md:text-3xl text-brand-dark dark:text-white mb-10 leading-tight">
                        {{ dhikr.title }}
                    </h1>

                    <div class="bg-brand-paper dark:bg-brand-dark/50 p-8 md:p-12 rounded-2xl relative mb-10 shadow-inner border border-brand-gold/10 w-full">
                        <p class="font-arabic text-3xl md:text-4xl text-brand-dark dark:text-gray-100 leading-[2.8] text-center" dir="rtl" :style="{ fontSize: (settings.fontSize + 10) + 'px' }">
                            {{ dhikr.arabic }}
                        </p>
                    </div>

                    <div class="mb-8">
                        <p class="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-3">Phonétique</p>
                        <p class="font-serif text-lg text-gray-600 dark:text-gray-300 leading-relaxed italic" :style="{ fontSize: settings.fontSize + 'px' }">
                            {{ dhikr.phonetic }}
                        </p>
                    </div>

                    <div class="flex justify-center my-10">
                        <button @click="handleDhikrClick(dhikr.id, dhikr.count)" 
                                class="relative w-24 h-24 md:w-32 md:h-32 rounded-full flex flex-col items-center justify-center transition-all duration-200 select-none active:scale-95 shadow-lg group border-4"
                                :class="[
                                    (counts[dhikr.id] === dhikr.count) 
                                    ? 'bg-green-500 border-green-600 text-white shadow-green-500/30' 
                                    : 'bg-white dark:bg-brand-dark border-indigo-100 dark:border-gray-600 hover:border-indigo-400 text-brand-dark dark:text-white'
                                ]">
                            
                            <svg v-if="counts[dhikr.id] !== dhikr.count" class="absolute inset-0 w-full h-full -rotate-90 text-indigo-500" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="46" fill="none" stroke-width="0" />
                                <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" stroke-width="4" stroke-dasharray="289" :stroke-dashoffset="289 - (getProgress(dhikr.id, dhikr.count) / 100 * 289)" class="transition-all duration-300 ease-out" />
                            </svg>

                            <div class="relative z-10 flex flex-col items-center">
                                <template v-if="counts[dhikr.id] === dhikr.count">
                                    <i data-lucide="check" class="w-8 h-8 md:w-10 md:h-10 mb-1"></i>
                                    <span class="text-[10px] font-bold uppercase tracking-widest">Terminé</span>
                                </template>
                                <template v-else>
                                    <span class="text-3xl md:text-4xl font-bold font-arabic tabular-nums">{{ counts[dhikr.id] || 0 }}</span>
                                    <div class="h-px w-8 bg-gray-200 dark:bg-gray-600 my-1"></div>
                                    <span class="text-xs text-gray-400 font-bold">{{ dhikr.count }}x</span>
                                </template>
                            </div>
                        </button>
                    </div>
                </div>

                <div class="p-8 md:p-12 bg-gray-50/50 dark:bg-black/5">
                    <div class="space-y-8">
                        <div>
                            <h3 class="font-display text-lg font-bold text-brand-dark dark:text-gray-100 mb-4 flex items-center gap-3">
                                <i data-lucide="languages" class="w-5 h-5 text-indigo-500"></i> Traduction
                            </h3>
                            <p class="text-gray-700 dark:text-gray-300 leading-loose text-justify font-sans" :style="{ fontSize: settings.fontSize + 'px' }">
                                {{ dhikr.translation }}
                            </p>
                        </div>

                        <div v-if="dhikr.virtue || dhikr.source" class="bg-indigo-50 dark:bg-indigo-900/10 rounded-xl p-6 border border-indigo-100 dark:border-indigo-800/30">
                            <h3 class="font-display text-sm font-bold text-indigo-800 dark:text-indigo-300 mb-3 flex items-center gap-2">
                                <i data-lucide="sparkles" class="w-4 h-4"></i> Mérites & Source
                            </h3>
                            <p class="text-sm text-indigo-900/80 dark:text-indigo-200/80 leading-relaxed mb-2">
                                {{ dhikr.virtue || "Un dhikr recommandé pour apaiser le cœur et se rapprocher d'Allah." }}
                            </p>
                            <p class="text-xs font-bold text-indigo-400 uppercase tracking-wider mt-4">
                                — {{ dhikr.source }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="text-center mt-12 pb-10">
                <button @click="closeReader" class="px-8 py-3 rounded-full bg-white dark:bg-brand-dark-lighter border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-500 hover:text-indigo-500 hover:border-indigo-500 uppercase tracking-widest inline-flex items-center gap-2 transition-all shadow-sm hover:shadow-md active:scale-95">
                    Fermer l'invocation
                </button>
            </div>
        </div>
    </div>
    `
};