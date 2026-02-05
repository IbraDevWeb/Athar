const TimelineView = {
    props: ['chapters', 'openChapterById', 'formatText'],

    setup(props) {
        // --- MOTEUR CHRONOLOGIQUE CONTEXTUEL ---
        // On prend maintenant l'ID du compagnon pour savoir de quel siècle on parle
        const parseYear = (yearStr, companionId) => {
            if (!yearStr) return 9999;
            const s = yearStr.toString().toLowerCase().trim();

            // 1. DATES HÉGIRIENNES EXPLICITES (Priorité absolue)
            // Ex: "581 H" -> 581
            const hMatch = s.match(/(\d+)\s*h/);
            if (hMatch) return parseInt(hMatch[1]);

            // 2. GESTION DES FIGURES TARDIVES (CORRECTIF SPÉCIAL)
            // Fatima as-Samarqandiyya (ID 106) est du 6ème siècle H.
            if (companionId === 106) {
                if (s.includes('naissance') || s.includes('jeunesse')) return 540;
                if (s.includes('mariage') || s.includes('dot')) return 560;
                if (s.includes('migration') || s.includes('alep')) return 570;
                return 581; // Par défaut fin 6ème siècle
            }

            // Sayyida Nafisa (ID 103) est du 2ème/3ème siècle H.
            if (companionId === 103) {
                if (s.includes('naissance') || s.includes('145')) return 145;
                if (s.includes('mariage')) return 165;
                if (s.includes('arrivée') || s.includes('caire')) return 193;
                return 208; // Par défaut début 3ème siècle
            }

            // Atika / Umm Ma'bad (ID 102) - Contemporaine Hégire mais événements distincts
            // Si l'utilisateur veut les grouper à la fin, on peut forcer, 
            // MAIS historiquement c'est 1 H. Je la laisse en 1 H pour la cohérence historique
            // sauf si c'est "Post-Prophétique".
            if (companionId === 102) {
                if (s.includes('post') || s.includes('vie')) return 15;
                return 1; // Hégire par défaut
            }

            // 3. DICTIONNAIRE DES ÉVÉNEMENTS (Pour les Compagnons standards)
            
            // Période Pré-Islamique (Négatif)
            if (s.includes('avant') || s.includes('pré') || s.includes('jahiliya')) return -15;
            if (s.includes('enfance') || s.includes('jeunesse') || s.includes('naissance')) return -10;
            if (s.includes('mecque') || s.includes('débuts') || s.includes('conversion') || s.includes('islam')) return -5;
            if (s.includes('abyssinie') || s.includes('exil')) return -3;
            if (s.includes('aqaba')) return -1;

            // Période Prophétique (1 H - 11 H)
            if (s.includes('hégire') || s.includes('qouba') || s.includes('1 h')) return 1;
            if (s.includes('badr')) return 2;
            if (s.includes('ouhoud')) return 3;
            if (s.includes('raji') || s.includes('bi\'r')) return 4;
            if (s.includes('fossé') || s.includes('khandaq') || s.includes('ahzab')) return 5;
            if (s.includes('hudaybiya') || s.includes('pacte') || s.includes('6 h')) return 6;
            if (s.includes('khaybar') || s.includes('7 h')) return 7;
            if (s.includes('mouta') || s.includes('conquête') || s.includes('fath') || s.includes('hunayn')) return 8;
            if (s.includes('tabouk') || s.includes('9 h')) return 9;
            if (s.includes('adieu') || s.includes('pèlerinage')) return 10;
            if ((s.includes('mort') && s.includes('prophète')) || s.includes('saqifa')) return 11;

            // Califats (12 H - 40 H)
            if (s.includes('abou bakr') || s.includes('yamama') || s.includes('ridda')) return 12;
            if (s.includes('omar') || s.includes('qadisiyya') || s.includes('yarmouk') || s.includes('sham')) return 15;
            if (s.includes('outhman') || s.includes('shura')) return 25;
            if (s.includes('ali') || s.includes('siffine') || s.includes('chameau')) return 37;
            if (s.includes('muawiya')) return 41;

            // Fallback générique
            const numStart = s.match(/^(\d+)/);
            if (numStart) return parseInt(numStart[1]);

            return 9999;
        };

        // --- Construction de la Frise ---
        const unifiedTimeline = Vue.computed(() => {
            if (!props.chapters) return [];

            let allEvents = [];

            props.chapters.forEach(chap => {
                if (chap.timeline && Array.isArray(chap.timeline)) {
                    chap.timeline.forEach(event => {
                        // On ignore les événements vides
                        if (!event.desc) return;

                        // Calcul de la date de tri en passant l'ID du compagnon
                        const sortVal = parseYear(event.year, chap.id);

                        allEvents.push({
                            rawYear: event.year, 
                            sortValue: sortVal,
                            desc: event.desc,
                            companionId: chap.id,
                            companionName: chap.name,
                            isVerified: chap.verified
                        });
                    });
                }
            });

            // Tri Ascendant
            return allEvents.sort((a, b) => {
                return a.sortValue - b.sortValue;
            });
        });

        const isLeft = (index) => index % 2 === 0;

        return { unifiedTimeline, isLeft };
    },

    template: `
    <div class="max-w-6xl mx-auto p-4 md:p-8 min-h-screen">
        
        <div class="text-center mb-16 animate-fade-in pt-8">
            <span class="inline-block px-3 py-1 mb-4 text-[10px] font-bold tracking-widest text-brand-gold uppercase border border-brand-gold/30 rounded-full bg-white dark:bg-brand-dark-lighter shadow-sm">
                VUE D'ENSEMBLE
            </span>
            <h2 class="font-display font-bold text-4xl md:text-6xl text-brand-dark dark:text-white mb-6">
                FRISE CHRONOLOGIQUE
            </h2>
            <p class="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-lg mx-auto font-serif italic">
                L'histoire de la génération unique et de ses héritiers, classée chronologiquement.
            </p>
        </div>

        <div class="relative pb-24">
            <div class="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand-gold/40 to-transparent md:-ml-[0.5px]"></div>

            <div v-for="(event, idx) in unifiedTimeline" :key="idx" 
                 class="relative mb-12 md:mb-0 md:flex md:justify-between md:items-center group"
                 :class="{'md:flex-row-reverse': !isLeft(idx)}">
                
                <div class="absolute left-4 md:left-1/2 -translate-x-1/2 top-6 md:top-1/2 md:-translate-y-1/2 z-10 flex items-center justify-center">
                    <div class="w-4 h-4 bg-brand-paper dark:bg-brand-dark border-2 border-brand-gold rounded-full group-hover:scale-150 group-hover:bg-brand-gold transition-all duration-300 shadow-[0_0_0_4px_rgba(197,160,89,0.1)]"></div>
                </div>

                <div class="hidden md:block md:w-1/2"></div>

                <div class="pl-12 md:pl-0 md:w-1/2 md:py-6"
                     :class="isLeft(idx) ? 'md:pr-16' : 'md:pl-16'">
                    
                    <div class="bg-white dark:bg-brand-dark-lighter p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-card hover:-translate-y-1 transition-all duration-300 relative cursor-pointer group/card"
                         @click="openChapterById(event.companionId)">
                        
                        <div class="absolute -top-3 px-3 py-1 bg-brand-gold text-white text-[10px] font-bold rounded-lg shadow-md tracking-wider uppercase"
                             :class="isLeft(idx) ? 'right-4 md:right-auto md:left-4' : 'right-4'">
                            {{ event.rawYear }}
                        </div>

                        <div class="flex flex-col gap-1 mb-3 pt-2">
                            <h3 class="font-display font-bold text-brand-dark dark:text-gray-100 text-sm tracking-wide group-hover/card:text-brand-gold transition-colors flex items-center gap-2">
                                {{ event.companionName.toUpperCase() }}
                                <i v-if="event.isVerified" data-lucide="badge-check" class="w-3.5 h-3.5 text-brand-gold/60"></i>
                            </h3>
                        </div>

                        <p class="text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-sans line-clamp-3 group-hover/card:line-clamp-none transition-all" v-html="formatText(event.desc)"></p>
                    </div>
                </div>
            </div>
            
            <div class="text-center pt-12 opacity-30">
                <i data-lucide="infinity" class="w-8 h-8 mx-auto text-brand-gold"></i>
            </div>
        </div>
    </div>
    `
};