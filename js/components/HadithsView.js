const HadithsView = {
    props: ['hadiths', 'searchQuery', 'openHadith'],
    template: `
    <div class="max-w-7xl mx-auto p-6 md:p-12 min-h-full">
        
        <div class="text-center mb-16 animate-fade-in relative">
            <div class="inline-flex items-center gap-2 px-4 py-1.5 border border-brand-gold/30 rounded-full bg-white dark:bg-brand-dark-lighter shadow-sm mb-6">
                <i data-lucide="scroll" class="w-4 h-4 text-brand-gold"></i>
                <span class="text-[10px] font-bold tracking-widest text-brand-gold uppercase">La Sounnah</span>
            </div>
            <h2 class="font-display font-bold text-4xl md:text-5xl text-brand-dark dark:text-white mb-4 leading-tight">
                Perles Prophétiques
            </h2>
            <p class="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto font-serif italic">
                Une sélection de hadiths authentiques, sources de lumière et de sagesse pour le cœur.
            </p>
        </div>

        <div v-if="searchQuery" class="mb-8 text-center animate-fade-in">
            <span class="inline-flex items-center gap-2 px-4 py-2 bg-brand-gold/10 text-brand-gold rounded-lg text-xs font-bold border border-brand-gold/20">
                <i data-lucide="search" class="w-3 h-3"></i>
                Résultats pour : "{{ searchQuery }}"
            </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
            <div v-for="(h, idx) in hadiths" :key="h.id" @click="openHadith(h)" 
                class="group relative bg-white dark:bg-brand-dark-lighter rounded-2xl p-8 border border-gray-100 dark:border-gray-700 hover:border-brand-gold/50 hover:shadow-[0_10px_40px_-10px_rgba(197,160,89,0.15)] cursor-pointer transition-all duration-300 flex flex-col h-full animate-slide-up"
                :style="{ animationDelay: idx * 0.05 + 's' }">
                
                <div class="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    <i data-lucide="quote" class="w-16 h-16 text-brand-gold"></i>
                </div>

                <div class="flex justify-between items-start mb-6 relative z-10">
                    <span class="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <span class="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
                        Hadith #{{ h.id.toString().split(' ')[0] }}
                    </span>
                    <span class="px-2 py-1 rounded bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-[9px] font-bold uppercase border border-green-100 dark:border-green-900/30">
                        {{ h.grade }}
                    </span>
                </div>

                <h3 class="font-display font-bold text-lg text-brand-dark dark:text-gray-100 mb-4 group-hover:text-brand-gold transition-colors leading-snug line-clamp-2">
                    {{ h.title }}
                </h3>

                <div class="flex-grow relative z-10">
                    <p class="text-sm text-gray-500 dark:text-gray-400 italic font-serif leading-relaxed line-clamp-4 relative pl-4 border-l-2 border-brand-gold/20">
                        "{{ h.hadeeth }}"
                    </p>
                </div>

                <div class="pt-6 mt-6 border-t border-gray-50 dark:border-gray-700/50 flex justify-between items-center relative z-10">
                    <span class="text-[10px] text-gray-400 font-bold uppercase tracking-wider truncate max-w-[150px]">
                        {{ h.attribution }}
                    </span>
                    <button class="w-8 h-8 rounded-full bg-brand-paper dark:bg-brand-dark flex items-center justify-center text-brand-gold opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                        <i data-lucide="arrow-right" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
        </div>

        <div v-if="hadiths.length === 0" class="flex flex-col items-center justify-center py-32 text-gray-400 animate-fade-in">
            <div class="w-20 h-20 bg-gray-50 dark:bg-brand-dark-lighter rounded-full flex items-center justify-center mb-6">
                <i data-lucide="search-x" class="w-10 h-10 opacity-30"></i>
            </div>
            <p class="font-serif italic text-lg">Aucun hadith ne correspond à votre recherche.</p>
            <button @click="searchQuery = ''" class="mt-4 text-brand-gold text-xs font-bold uppercase tracking-widest hover:underline">Réinitialiser</button>
        </div>
    </div>
    `
};