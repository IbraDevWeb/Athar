const TabibView = {
    props: ['remedies', 'filter', 'categories', 'openRemedy'], // On reçoit les données
    emits: ['update:filter', 'toggleBreathing'], // On peut changer le filtre et ouvrir la respiration
    template: `
    <div class="max-w-7xl mx-auto p-6 md:p-12 min-h-full">
        <div class="text-center mb-12 animate-fade-in">
            <span class="inline-block px-3 py-1 border border-emerald-500/30 rounded-full text-[10px] font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase bg-emerald-50 dark:bg-emerald-900/10 shadow-sm mb-4">
                Guérison Spirituelle
            </span>
            <h2 class="font-display font-bold text-3xl md:text-5xl text-brand-dark dark:text-white mb-4">Pharmacie des Âmes</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 max-w-lg mx-auto mb-8">Des remèdes tirés du Coran et de la Sunnah pour apaiser les maux du cœur.</p>
            
            <div class="flex flex-wrap justify-center gap-2 mb-8">
                <button v-for="cat in categories" :key="cat" 
                        @click="$emit('update:filter', cat)"
                        :class="['px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 border flex items-center gap-2', 
                        filter === cat 
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg transform scale-105' 
                        : 'bg-white dark:bg-brand-dark-lighter border-gray-200 dark:border-gray-700 text-gray-500 hover:border-emerald-500 hover:text-emerald-600']">
                    {{ cat }}
                </button>
            </div>
            
            <button @click="$emit('toggleBreathing')" class="mx-auto px-5 py-2 rounded-full bg-brand-gold/10 text-brand-gold hover:bg-brand-gold hover:text-white transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <i data-lucide="wind" class="w-4 h-4"></i> Exercice de Respiration
            </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
            <div v-for="(item, idx) in remedies" :key="item.id" @click="openRemedy(item)"
                class="group bg-white dark:bg-brand-dark-lighter rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-emerald-500/50 hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col animate-slide-up"
                :style="{ animationDelay: idx * 0.05 + 's' }">
                
                <div class="absolute -right-6 -top-6 w-32 h-32 bg-emerald-500/5 rounded-full group-hover:scale-150 transition-transform duration-700 ease-out"></div>
                
                <div class="p-6 flex-1 relative z-10">
                    <div class="flex justify-between items-start mb-4">
                        <div class="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-inner">
                            <i :data-lucide="item.icon" class="w-6 h-6"></i>
                        </div>
                        <span v-if="item.source_type === 'Coran'" class="px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-100">Ayat</span>
                        <span v-else class="px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100">Dou'a</span>
                    </div>

                    <h3 class="font-display text-xl font-bold text-brand-dark dark:text-gray-100 mb-2 group-hover:text-emerald-600 transition-colors">
                        {{ item.title }}
                    </h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 font-sans line-clamp-2 leading-relaxed">
                        {{ item.intro }}
                    </p>
                </div>

                <div class="px-6 pb-6 pt-2 relative z-10 mt-auto">
                    <div class="flex flex-wrap gap-2">
                        <span v-for="tag in item.tags.slice(0,3)" :key="tag" class="text-[10px] font-medium px-2 py-1 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg border border-gray-100 dark:border-gray-700">
                            #{{ tag }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
};