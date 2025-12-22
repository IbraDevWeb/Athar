const HadithsView = {
    props: ['hadiths', 'searchQuery', 'openHadith'],
    template: `
    <div class="max-w-7xl mx-auto p-6 md:p-12 min-h-full">
        <div class="text-center mb-12 animate-fade-in">
            <span class="inline-block px-3 py-1 border border-brand-gold/30 rounded-full text-[10px] font-bold tracking-widest text-brand-gold uppercase bg-white dark:bg-brand-dark-lighter shadow-sm mb-4">La Sounnah</span>
            <h2 class="font-display font-bold text-3xl md:text-5xl text-brand-dark dark:text-white mb-4">Perles Prophétiques</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 max-w-lg mx-auto mb-8">Une sélection de 50 hadiths authentiques expliqués pour illuminer le cœur et l'esprit.</p>
            
            <div class="max-w-md mx-auto relative group">
                <i data-lucide="search" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"></i>
                <input type="text" :value="searchQuery" readonly placeholder="Utilisez la barre de recherche en haut..." class="relative w-full py-3 pl-12 pr-4 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-brand-dark-lighter shadow-sm focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition-all cursor-not-allowed opacity-70">
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
            <div v-for="(h, idx) in hadiths" :key="h.id" @click="openHadith(h)" 
                class="bg-white dark:bg-brand-dark-lighter rounded-xl p-6 border border-gray-100 dark:border-gray-700 hover:border-brand-gold/40 hover:shadow-card cursor-pointer transition-all duration-300 group flex flex-col h-full animate-slide-up"
                :style="{ animationDelay: idx * 0.03 + 's' }">
                
                <div class="flex justify-between items-start mb-4">
                    <span class="text-[9px] font-bold text-brand-gold bg-brand-gold/10 px-2 py-1 rounded uppercase tracking-wider">Hadith #{{ h.id }}</span>
                    <span class="text-[10px] text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded border border-gray-100 dark:border-gray-700">{{ h.grade }}</span>
                </div>

                <h3 class="font-display font-bold text-lg text-brand-dark dark:text-gray-100 mb-3 group-hover:text-brand-gold transition-colors leading-snug line-clamp-3">
                    {{ h.title }}
                </h3>

                <p class="text-xs text-gray-500 dark:text-gray-400 mb-4 line-clamp-3 italic font-serif flex-grow">
                    "{{ h.hadeeth }}"
                </p>

                <div class="pt-4 border-t border-gray-50 dark:border-gray-800 mt-auto flex justify-between items-center text-xs text-gray-400">
                    <span class="truncate max-w-[70%]">{{ h.attribution }}</span>
                    <span class="flex items-center gap-1 text-brand-gold font-bold uppercase text-[9px] tracking-widest group-hover:underline">Lire <i data-lucide="arrow-right" class="w-3 h-3"></i></span>
                </div>
            </div>
        </div>

        <div v-if="hadiths.length === 0" class="text-center py-20 text-gray-400">
            <i data-lucide="search-x" class="w-10 h-10 mx-auto mb-3 opacity-50"></i>
            <p>Aucun hadith trouvé.</p>
        </div>
    </div>
    `
};