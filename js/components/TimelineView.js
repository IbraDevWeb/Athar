const TimelineView = {
    // On définit ici les données que ce composant reçoit du fichier principal
    props: ['timeline', 'openChapterById', 'formatText'],
    
    template: `
    <div class="max-w-4xl mx-auto p-6 md:p-12 min-h-full">
        <div class="text-center mb-16 animate-fade-in">
            <span class="inline-block px-3 py-1 border border-brand-gold/30 rounded-full text-[10px] font-bold tracking-widest text-brand-gold uppercase bg-white dark:bg-brand-dark-lighter shadow-sm mb-4">Perspective Historique</span>
            <h2 class="font-display font-bold text-3xl md:text-5xl text-brand-dark dark:text-white mb-3">Frise Chronologique Unifiée</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 max-w-lg mx-auto">De l'ère pré-islamique aux grandes conquêtes, suivez le fil de l'histoire à travers les événements majeurs et les vies des Compagnons.</p>
        </div>

        <div class="relative border-l-2 border-brand-gold/20 ml-4 md:ml-1/2 space-y-12 pb-24">
            <div v-for="(event, idx) in timeline" :key="idx" 
                 class="relative pl-10 md:pl-0 md:flex md:justify-between md:items-center group animate-slide-up"
                 :style="{ animationDelay: idx * 0.05 + 's' }">
                
                <div class="absolute left-[-5px] top-0 md:left-1/2 md:-ml-[5px] w-2.5 h-2.5 bg-brand-paper dark:bg-brand-dark border-2 border-brand-gold rounded-full z-10 group-hover:scale-150 group-hover:bg-brand-gold transition-all duration-300 shadow-[0_0_0_4px_rgba(197,160,89,0.1)]"></div>
                
                <div class="md:w-[45%] mb-3 md:mb-0 text-left md:text-right md:pr-12" :class="{'md:order-1': idx % 2 === 0, 'md:order-3 md:text-left md:pl-12': idx % 2 !== 0}">
                    <span class="inline-block px-3 py-1.5 bg-brand-gold/10 text-brand-gold font-bold font-display text-sm rounded-lg shadow-sm border border-brand-gold/20 group-hover:bg-brand-gold group-hover:text-white transition-colors duration-300">
                        {{ event.yearLabel }}
                    </span>
                </div>

                <div class="md:w-[45%] bg-white dark:bg-brand-dark-lighter p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-brand-gold/40 transition-all duration-300 relative group-hover:shadow-card hover:-translate-y-1"
                     :class="{'md:order-3 md:text-left md:ml-12': idx % 2 === 0, 'md:order-1 md:text-right md:mr-12': idx % 2 !== 0}">
                    
                    <div class="hidden md:block absolute top-4 w-3 h-3 bg-white dark:bg-brand-dark-lighter border-t border-r border-gray-100 dark:border-gray-700 rotate-45 transform transition-colors duration-300 group-hover:border-brand-gold/40"
                         :class="idx % 2 === 0 ? '-left-1.5 border-r-0 border-b border-t-0' : '-right-1.5'"></div>

                    <h3 class="font-bold text-brand-dark dark:text-gray-100 text-sm mb-2 flex items-center gap-2" 
                        :class="{'md:justify-end': idx % 2 !== 0}">
                        <i v-if="event.type === 'chapter'" data-lucide="user" class="w-3.5 h-3.5 text-brand-gold"></i>
                        <i v-else data-lucide="flag" class="w-3.5 h-3.5 text-gray-400"></i>
                        {{ event.title }}
                    </h3>
                    
                    <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-sans" v-html="formatText(event.desc)"></p>
                    
                    <button v-if="event.linkId" @click="openChapterById(event.linkId)" 
                            class="mt-4 text-[10px] font-bold uppercase tracking-wider text-brand-gold hover:underline flex items-center gap-1 group/btn"
                            :class="{'md:ml-auto': idx % 2 !== 0}">
                        Lire le récit <i data-lucide="arrow-right" class="w-3 h-3 group-hover/btn:translate-x-1 transition-transform"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
    `
};