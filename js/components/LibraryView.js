const LibraryView = {
    props: [
        'categories',
        'activeCategory',
        'lastReadChapter',
        'headerSearchQuery',
        'filteredChapters',
        'openChapter',
        'isFavorite'
    ],
    emits: ['update:activeCategory'],
    template: `
    <div class="max-w-7xl mx-auto p-6 md:p-12 lg:p-16 min-h-full">
        <div class="text-center mb-12 space-y-5 animate-fade-in relative">
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl -z-10"></div>
            <span class="inline-flex items-center gap-2 px-4 py-1.5 border border-brand-gold/30 rounded-full text-[10px] font-bold tracking-[0.2em] text-brand-gold uppercase bg-white dark:bg-brand-dark-lighter shadow-sm">
                <i data-lucide="library" class="w-3.5 h-3.5"></i> Notices historiques documentées
            </span>
            <h2 class="font-serif font-bold text-4xl md:text-6xl text-brand-dark dark:text-white leading-tight">Les figures de l'histoire islamique</h2>
            <p class="text-gray-500 dark:text-gray-400 text-sm md:text-base font-sans max-w-2xl mx-auto leading-relaxed">
                Chaque notice indique sa référence principale. Les récits anciens pouvant comporter des variantes, les formulations sont à lire avec le niveau de prudence signalé.
            </p>
            <a href="methodologie.html" class="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-gold hover:underline">
                <i data-lucide="book-check" class="w-3.5 h-3.5"></i> Lire la méthodologie éditoriale
            </a>
        </div>

        <div class="mb-14 animate-fade-in" style="animation-delay: 0.1s">
            <div class="flex flex-wrap justify-center gap-3" role="group" aria-label="Filtrer les notices par catégorie">
                <button v-for="cat in categories" :key="cat" type="button"
                        @click="$emit('update:activeCategory', cat)"
                        class="px-5 py-2.5 rounded-xl text-[11px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 border shadow-sm select-none flex items-center gap-2"
                        :aria-pressed="activeCategory === cat"
                        :class="activeCategory === cat
                            ? 'bg-brand-dark text-brand-gold border-brand-dark dark:bg-brand-gold dark:text-brand-dark transform scale-105 ring-4 ring-brand-gold/10'
                            : 'bg-white text-gray-500 border-gray-100 hover:border-brand-gold hover:text-brand-gold dark:bg-brand-dark-lighter dark:border-gray-800 dark:text-gray-400 hover:shadow-md'">
                    <span v-if="activeCategory === cat" class="w-1.5 h-1.5 rounded-full bg-current"></span> {{ cat }}
                </button>
            </div>
        </div>

        <div v-if="lastReadChapter && !headerSearchQuery" @click="openChapter(lastReadChapter)" @keydown.enter.prevent="openChapter(lastReadChapter)" @keydown.space.prevent="openChapter(lastReadChapter)" role="button" tabindex="0" class="mb-12 mx-auto max-w-3xl bg-white dark:bg-brand-dark-lighter border border-brand-gold/20 rounded-2xl p-1 overflow-hidden cursor-pointer hover:shadow-card hover:-translate-y-1 transition-all duration-300 group animate-slide-up focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-gold/30">
            <div class="bg-brand-paper dark:bg-brand-dark/50 rounded-xl p-6 flex items-center justify-between relative overflow-hidden">
                <div class="absolute right-0 top-0 w-32 h-32 bg-brand-gold/10 rounded-full blur-2xl translate-x-10 -translate-y-10"></div>
                <div class="relative z-10">
                    <p class="text-[10px] uppercase tracking-widest text-brand-gold font-bold mb-2 flex items-center gap-2"><i data-lucide="history" class="w-3 h-3"></i> Reprendre la lecture</p>
                    <h3 class="font-display font-bold text-2xl text-brand-dark dark:text-white mb-1">{{ lastReadChapter.name }}</h3>
                    <p class="text-xs text-gray-500 italic">{{ lastReadChapter.subtitle }}</p>
                </div>
                <div class="w-12 h-12 rounded-full bg-white dark:bg-brand-dark flex items-center justify-center shadow-lg border border-brand-gold/10 group-hover:bg-brand-gold group-hover:text-white transition-colors relative z-10">
                    <i data-lucide="play" class="w-5 h-5 fill-current ml-1"></i>
                </div>
            </div>
        </div>

        <div v-if="filteredChapters.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
            <article v-for="(chap, idx) in filteredChapters" :key="chap.id" @click="openChapter(chap)" @keydown.enter.prevent="openChapter(chap)" @keydown.space.prevent="openChapter(chap)" role="button" tabindex="0"
                    class="group bg-white dark:bg-brand-dark-lighter rounded-2xl p-7 shadow-sm hover:shadow-card border border-gray-100 dark:border-gray-700/50 hover:border-brand-gold/40 transition-all duration-300 cursor-pointer relative overflow-hidden h-full flex flex-col animate-slide-up focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-gold/30"
                    :style="{ animationDelay: Math.min(idx, 12) * 0.04 + 's' }">
                <div class="absolute -right-8 -top-8 w-32 h-32 bg-brand-gold/5 rounded-full group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
                <div class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-gold/0 to-transparent group-hover:via-brand-gold/50 transition-all duration-500"></div>
                <div v-if="isFavorite(chap.id)" class="absolute top-5 right-5 text-red-500 z-10 animate-fade-in filter drop-shadow-sm"><i data-lucide="heart" class="w-4 h-4 fill-current"></i></div>

                <div class="relative z-10 flex flex-col h-full">
                    <div class="flex justify-between items-start mb-5">
                        <span class="text-[9px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-brand-dark px-2.5 py-1 rounded-md border border-gray-100 dark:border-gray-700 group-hover:border-brand-gold/20 transition-colors">{{ chap.tags && chap.tags[0] ? chap.tags[0] : 'Histoire' }}</span>
                        <span class="font-arabic text-2xl text-brand-gold/80 group-hover:text-brand-gold transition-colors" lang="ar" dir="rtl">{{ chap.arabicName }}</span>
                    </div>
                    <h3 class="font-display text-xl font-bold mb-1.5 text-brand-dark dark:text-gray-100 group-hover:text-brand-gold transition-colors leading-tight">{{ chap.name }}</h3>
                    <p class="text-xs text-gray-400 italic mb-5 font-serif">« {{ chap.subtitle }} »</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-6 flex-grow leading-relaxed opacity-90">{{ chap.intro }}</p>
                    <div class="flex items-center justify-between gap-3 mt-auto">
                        <span class="text-brand-gold text-[10px] font-bold uppercase tracking-widest opacity-70 group-hover:opacity-100 transition-opacity">Lire la notice <i data-lucide="arrow-right" class="w-3.5 h-3.5 ml-1 inline group-hover:translate-x-1 transition-transform"></i></span>
                        <span v-if="chap.source" class="text-[9px] text-gray-400 inline-flex items-center gap-1" title="Une référence principale est indiquée"><i data-lucide="book-check" class="w-3 h-3"></i> Référencée</span>
                    </div>
                </div>
            </article>
        </div>

        <div v-else class="flex flex-col items-center justify-center py-24 text-center text-gray-400">
            <i data-lucide="search-x" class="w-10 h-10 mb-4 opacity-30"></i>
            <p class="font-serif italic">Aucune notice ne correspond aux critères sélectionnés.</p>
        </div>
    </div>
    `
};
