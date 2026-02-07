const TransmissionView = {
    props: ['silsila', 'themes', 'rootIds', 'openScholarFiche'],
    
    setup(props) {
        const { ref, computed, watch } = Vue;

        // Onglet actif par défaut
        const currentTab = ref('hadith');
        
        // ID du savant affiché au centre
        const focusId = ref(props.rootIds ? props.rootIds.hadith : null);

        // --- 1. SÉCURISATION DES THÈMES ---
        // On s'assure que les couleurs existent toujours même si les données tardent à charger
        const activeThemes = computed(() => {
            return props.themes || {
                hadith: { label: 'Hadith', btn: 'bg-purple-600', border: 'border-purple-200', bg: 'bg-purple-50', color: 'text-purple-600' },
                fiqh: { label: 'Fiqh', btn: 'bg-emerald-600', border: 'border-emerald-200', bg: 'bg-emerald-50', color: 'text-emerald-600' },
                quran: { label: 'Coran', btn: 'bg-amber-600', border: 'border-amber-200', bg: 'bg-amber-50', color: 'text-amber-600' },
                pre: { label: 'Ancien', btn: 'bg-gray-500', border: 'border-gray-200', bg: 'bg-gray-50', color: 'text-gray-600' }
            };
        });

        // --- 2. RÉCUPÉRATION DU SAVANT ---
        const focusedScholar = computed(() => {
            if (!props.silsila) return null;
            return props.silsila.find(s => s.id === focusId.value);
        });

        // --- 3. LOGIQUE INTELLIGENTE (AUTO-SWITCH) ---
        // Si on clique sur un savant d'une autre matière (ex: Nafi), on change l'onglet automatiquement
        watch(focusedScholar, (newVal) => {
            if (newVal && ['hadith', 'fiqh', 'quran'].includes(newVal.group)) {
                if (currentTab.value !== newVal.group) {
                    currentTab.value = newVal.group;
                }
            }
        });

        // Récupère le style du savant affiché (pour colorer la carte)
        const currentScholarTheme = computed(() => {
            if (!focusedScholar.value) return activeThemes.value.hadith;
            return activeThemes.value[focusedScholar.value.group] || activeThemes.value.pre;
        });

        // --- 4. MAÎTRES ET ÉLÈVES ---
        const getScholar = (id) => props.silsila.find(s => s.id === id);

        const masters = computed(() => {
            if (!focusedScholar.value || !focusedScholar.value.teachers) return [];
            return focusedScholar.value.teachers.map(getScholar).filter(Boolean);
        });

        const students = computed(() => {
            if (!focusedScholar.value || !focusedScholar.value.students) return [];
            return focusedScholar.value.students.map(getScholar).filter(Boolean);
        });

        // --- 5. NAVIGATION ---
        const setFocus = (id) => {
            focusId.value = id;
            if(window.navigator.vibrate) window.navigator.vibrate(5);
        };

        const switchTab = (tab) => {
            currentTab.value = tab;
            // Retour à la racine de la matière quand on change d'onglet manuellement
            if (props.rootIds && props.rootIds[tab]) {
                focusId.value = props.rootIds[tab];
            }
        };

        const quickNav = computed(() => {
            if (currentTab.value === 'hadith') return [41, 42, 43, 44]; // Bukhari, Muslim...
            if (currentTab.value === 'fiqh') return [10, 11, 12, 13]; // 4 Imams
            if (currentTab.value === 'quran') return [60, 63]; // Nafi, Asim
            return [];
        });

        const getScholarName = (id) => {
            const s = getScholar(id);
            return s ? s.name || s.label : '';
        };

        // Fonction pour obtenir la couleur d'un petit badge (Maître/Élève)
        const getBadgeColor = (group) => {
            const t = activeThemes.value[group];
            return t ? t.color : 'text-gray-400';
        };

        return { 
            currentTab, focusId, activeThemes, currentScholarTheme,
            focusedScholar, masters, students, 
            setFocus, switchTab, quickNav, getScholarName, getBadgeColor
        };
    },

    template: `
    <div class="max-w-5xl mx-auto p-4 md:p-12 min-h-full flex flex-col items-center">
        
        <div class="w-full max-w-lg mb-12 relative z-20 animate-fade-in">
            <div class="bg-white dark:bg-brand-dark-lighter p-1.5 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 flex justify-between gap-1">
                <button v-for="(theme, key) in activeThemes" :key="key" 
                        v-show="key !== 'pre'"
                        @click="switchTab(key)" 
                        class="flex-1 py-2.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2"
                        :class="currentTab === key ? theme.btn + ' shadow-md transform scale-105 text-white' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-brand-dark'">
                    <i v-if="theme.icon" :data-lucide="theme.icon" class="w-3.5 h-3.5 hidden md:block"></i>
                    <span>{{ theme.label || key }}</span>
                </button>
            </div>
        </div>

        <div v-if="focusedScholar" class="relative w-full flex flex-col items-center animate-slide-up flex-1">
            
            <div class="flex flex-wrap justify-center gap-6 pb-6 relative z-10 w-full">
                <div v-for="m in masters" :key="m.id" @click="setFocus(m.id)" class="flex flex-col items-center group cursor-pointer w-28 md:w-32">
                    <div class="w-full bg-white dark:bg-brand-dark-lighter border border-gray-200 dark:border-gray-700 p-3 rounded-xl text-center shadow-sm relative z-20 hover:-translate-y-1 transition-transform duration-300 hover:shadow-md hover:border-brand-gold/50">
                        <div class="flex justify-between items-center mb-1">
                            <span class="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Maître</span>
                            <span class="w-2 h-2 rounded-full" :class="activeThemes[m.group]?.btn || 'bg-gray-300'"></span>
                        </div>
                        <h4 class="font-bold text-xs truncate text-brand-dark dark:text-gray-200">{{ m.label || m.name }}</h4>
                    </div>
                    <div class="h-8 w-px bg-gray-300 dark:bg-gray-600 -mt-1 relative z-0 group-hover:bg-brand-gold transition-colors"></div>
                </div>
                
                <div v-if="masters.length === 0" class="text-gray-300 text-[10px] uppercase tracking-widest py-4">
                    Début de la chaîne
                </div>
            </div>

            <div class="relative z-20 my-2 w-full max-w-lg">
                <div v-if="masters.length > 0" class="absolute -top-6 left-1/2 -translate-x-1/2 w-px h-6 bg-gray-300 dark:bg-gray-600 z-0"></div>

                <div class="relative bg-white dark:bg-brand-dark-lighter border-2 p-8 rounded-[2rem] text-center shadow-2xl w-full z-10 transform transition-all duration-300" 
                     :class="currentScholarTheme.border">
                    
                    <span class="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white mb-4 shadow-sm" 
                          :class="currentScholarTheme.btn">
                        {{ focusedScholar.role || 'Savant' }}
                    </span>

                    <h1 class="font-display font-bold text-2xl md:text-3xl text-brand-dark dark:text-white mb-4 leading-tight">
                        {{ focusedScholar.label || focusedScholar.name }}
                    </h1>
                    
                    <div class="prose prose-sm dark:prose-invert mx-auto mb-8 text-sm text-gray-500 leading-relaxed font-serif italic" 
                         v-html="focusedScholar.bio"></div>

                    <button v-if="openScholarFiche" @click="openScholarFiche(focusedScholar)" 
                            class="w-full py-3 rounded-xl font-bold uppercase tracking-widest text-xs text-white shadow-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2" 
                            :class="currentScholarTheme.btn">
                        <i data-lucide="book-open" class="w-4 h-4"></i>
                        Voir la Biographie
                    </button>
                </div>

                <div v-if="students.length > 0" class="absolute -bottom-6 left-1/2 -translate-x-1/2 w-px h-6 bg-gray-300 dark:bg-gray-600 z-0"></div>
            </div>

            <div class="flex flex-wrap justify-center gap-6 pt-6 relative z-10 w-full">
                <div v-for="s in students" :key="s.id" @click="setFocus(s.id)" class="flex flex-col items-center group cursor-pointer w-28 md:w-32">
                    <div class="h-8 w-px bg-gray-300 dark:bg-gray-600 -mb-1 relative z-0 group-hover:bg-brand-gold transition-colors"></div>
                    
                    <div class="w-full bg-white dark:bg-brand-dark-lighter border border-gray-200 dark:border-gray-700 p-3 rounded-xl text-center shadow-sm relative z-20 bg-gray-50/50 hover:bg-white dark:hover:bg-brand-dark-lighter transition-all duration-300 hover:translate-y-1 hover:shadow-md hover:border-brand-gold/50">
                        <div class="flex justify-between items-center mb-1">
                            <span class="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Élève</span>
                            <span class="w-2 h-2 rounded-full" :class="activeThemes[s.group]?.btn || 'bg-gray-300'"></span>
                        </div>
                        <h4 class="font-bold text-xs truncate text-brand-dark dark:text-gray-200">{{ s.label || s.name }}</h4>
                    </div>
                </div>
                
                <div v-if="students.length === 0" class="text-gray-300 text-[10px] uppercase tracking-widest py-4">
                    Fin de la chaîne connue
                </div>
            </div>
        </div>

        <div class="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 w-full text-center relative z-10">
            <h3 class="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">
                Piliers de cette branche
            </h3>
            
            <div class="flex flex-wrap justify-center gap-2">
                <button v-for="id in quickNav" :key="id" 
                        @click="setFocus(id)"
                        class="px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all"
                        :class="focusId === id 
                        ? activeThemes[currentTab].btn + ' text-white border-transparent shadow-md' 
                        : 'bg-white dark:bg-brand-dark-lighter border-gray-200 dark:border-gray-700 text-gray-500 hover:border-brand-gold'">
                    {{ getScholarName(id) }}
                </button>
            </div>
        </div>

    </div>
    `
};