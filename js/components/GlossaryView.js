const GlossaryView = {
    props: ['glossary', 'searchQuery'], // On reçoit la liste filtrée et le texte de recherche
    emits: ['update:searchQuery'],      // On signale quand on écrit dans la barre de recherche
    template: `
    <div class="max-w-5xl mx-auto p-6 md:p-12 min-h-full">
        <div class="text-center mb-16 animate-fade-in">
            <span class="inline-block px-3 py-1 border border-brand-gold/30 rounded-full text-[10px] font-bold tracking-widest text-brand-gold uppercase bg-white dark:bg-brand-dark-lighter shadow-sm mb-4">Dictionnaire</span>
            <h2 class="font-display font-bold text-3xl md:text-5xl text-brand-dark dark:text-white mb-4">Termes & Lieux</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-lg mx-auto">Un référentiel complet pour comprendre les batailles, les tribus et les concepts clés de l'époque.</p>
            
            <div class="max-w-md mx-auto relative group">
                <div class="absolute inset-0 bg-brand-gold/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <i data-lucide="search" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"></i>
                <input type="text" 
                       :value="searchQuery"
                       @input="$emit('update:searchQuery', $event.target.value)"
                       placeholder="Filtrer les définitions..." 
                       class="relative w-full py-3 pl-12 pr-4 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-brand-dark-lighter shadow-sm focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition-all">
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-24">
            <div v-for="(item, idx) in glossary" :key="idx" class="bg-white dark:bg-brand-dark-lighter p-6 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-brand-gold/30 hover:shadow-card transition-all animate-slide-up group h-full flex flex-col">
                <div class="flex justify-between items-start mb-3">
                    <h3 class="font-bold text-brand-gold capitalize font-display text-lg group-hover:text-brand-dark dark:group-hover:text-white transition-colors relative">
                        {{ item.term }}
                        <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-gold group-hover:w-full transition-all duration-300"></span>
                    </h3>
                    <span class="text-[9px] uppercase tracking-wider text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-100 dark:border-gray-700">{{ item.origin }}</span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-sans flex-grow">{{ item.def }}</p>
            </div>
        </div>
        
        <div v-if="glossary.length === 0" class="text-center text-gray-400 italic py-20 flex flex-col items-center animate-fade-in">
            <div class="w-16 h-16 bg-gray-100 dark:bg-brand-dark-lighter rounded-full flex items-center justify-center mb-4">
                <i data-lucide="search-x" class="w-8 h-8 opacity-50"></i>
            </div>
            <p>Aucun terme ne correspond à "{{ searchQuery }}"</p>
        </div>
    </div>
    `
};