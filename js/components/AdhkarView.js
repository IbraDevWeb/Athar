const AdhkarView = {
    props: ['adhkar', 'categories', 'activeCategory', 'searchQuery', 'adhkarCounts', 'openDhikr'],
    emits: ['update:activeCategory'],
    template: `
    <div class="max-w-7xl mx-auto p-6 md:p-12 min-h-full">
        <div class="text-center mb-12 animate-fade-in">
            <span class="inline-block px-3 py-1 border border-indigo-500/30 rounded-full text-[10px] font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase bg-indigo-50 dark:bg-indigo-900/10 shadow-sm mb-4">
                Souvenir d'Allah
            </span>
            <h2 class="font-display font-bold text-3xl md:text-5xl text-brand-dark dark:text-white mb-4">Al-Adhkar An-Nawawiya</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 max-w-lg mx-auto mb-8">Les invocations authentiques pour fortifier l'âme au quotidien.</p>
            
            <div class="flex flex-wrap justify-center gap-2 mb-8">
                <button v-for="cat in categories" :key="cat" @click="$emit('update:activeCategory', cat)"
                        :class="['px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 border flex items-center gap-2', 
                        activeCategory === cat 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg transform scale-105' 
                        : 'bg-white dark:bg-brand-dark-lighter border-gray-200 dark:border-gray-700 text-gray-500 hover:border-indigo-500 hover:text-indigo-600']">
                    {{ cat }}
                </button>
            </div>

            <div class="max-w-md mx-auto relative group mb-8">
                <i data-lucide="search" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"></i>
                <input type="text" :value="searchQuery" readonly placeholder="Utilisez la barre de recherche globale..." class="relative w-full py-3 pl-12 pr-4 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-brand-dark-lighter shadow-sm outline-none transition-all cursor-not-allowed opacity-70">
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
            <div v-for="(dhikr, idx) in adhkar" :key="dhikr.id" @click="openDhikr(dhikr)"
                class="bg-white dark:bg-brand-dark-lighter rounded-xl p-6 border border-gray-100 dark:border-gray-700 hover:border-indigo-400/40 hover:shadow-card cursor-pointer transition-all duration-300 group flex flex-col h-full animate-slide-up"
                :style="{ animationDelay: idx * 0.03 + 's' }">
                
                <div class="flex justify-between items-start mb-4">
                    <span class="text-[9px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded uppercase tracking-wider border border-indigo-100 dark:border-indigo-800">{{ dhikr.category }}</span>
                    <i v-if="adhkarCounts[dhikr.id] === dhikr.count" data-lucide="check-circle-2" class="w-4 h-4 text-green-500"></i>
                    <span v-else class="text-[10px] text-gray-400 font-mono">{{ dhikr.count }}x</span>
                </div>

                <h3 class="font-display font-bold text-lg text-brand-dark dark:text-gray-100 mb-3 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
                    {{ dhikr.title }}
                </h3>

                <p class="text-xs text-gray-500 dark:text-gray-400 mb-4 line-clamp-3 italic font-serif flex-grow">
                    "{{ dhikr.translation }}"
                </p>

                <div class="pt-4 border-t border-gray-50 dark:border-gray-800 mt-auto flex justify-between items-center text-xs text-gray-400">
                    <span class="truncate max-w-[70%]">{{ dhikr.source }}</span>
                    <span class="flex items-center gap-1 text-indigo-500 font-bold uppercase text-[9px] tracking-widest group-hover:underline">Ouvrir <i data-lucide="arrow-right" class="w-3 h-3"></i></span>
                </div>
            </div>
        </div>
        
        <div v-if="adhkar.length === 0" class="text-center py-20 text-gray-400">
            <i data-lucide="search-x" class="w-10 h-10 mx-auto mb-3 opacity-50"></i>
            <p>Aucune invocation trouvée.</p>
        </div>
    </div>
    `
};