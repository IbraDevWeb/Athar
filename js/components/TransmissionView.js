const TransmissionView = {
    props: ['silsila', 'themes', 'rootIds', 'openScholarFiche'],
    
    setup(props) {
        const { ref, computed, onMounted, watch } = Vue;

        const currentTab = ref('hadith');
        const focusId = ref(props.rootIds ? props.rootIds.hadith : null);

        // --- Données pour la navigation rapide (le bas de page) ---
        const rootScholarsLists = {
            hadith: ['bukhari', 'muslim', 'abu_dawud', 'tirmidhi', 'nasai', 'ibn_majah', 'zuhri', 'malik'],
            fiqh: ['abu_hanifa', 'malik', 'shafi', 'ahmad', 'awzai', 'layth_sad'],
            quran: ['nafi', 'ibn_kathir_qari', 'abu_amr', 'ibn_amir', 'asim', 'hamzah', 'kisai', 'abu_jafar', 'yaqub', 'khalaf_bazzar']
        };

        const currentRootScholars = computed(() => rootScholarsLists[currentTab.value] || []);

        const getScholarName = (id) => {
            const s = props.silsila.find(x => x.id === id);
            return s ? s.name : id;
        };
        // -----------------------------------------------------------

        const currentTheme = computed(() => props.themes[currentTab.value] || props.themes.hadith);

        const focusedScholar = computed(() => props.silsila.find(s => s.id === focusId.value));

        const masters = computed(() => {
            if (!focusedScholar.value || !focusedScholar.value.teachers) return [];
            return focusedScholar.value.teachers
                .map(tid => props.silsila.find(s => s.id === tid))
                .filter(Boolean);
        });

        const students = computed(() => {
            if (!focusedScholar.value || !focusedScholar.value.students) return [];
            return focusedScholar.value.students
                .map(sid => props.silsila.find(s => s.id === sid))
                .filter(Boolean);
        });

        const setFocus = (id) => {
            focusId.value = id;
            if(window.navigator.vibrate) window.navigator.vibrate(5);
        };

        const switchTab = (tab) => {
            currentTab.value = tab;
            focusId.value = props.rootIds[tab];
        };

        watch(focusedScholar, () => {
            setTimeout(() => { if(window.lucide) window.lucide.createIcons(); }, 100);
        });

        onMounted(() => {
            if(window.lucide) window.lucide.createIcons();
        });

        return { 
            currentTab, focusId, currentTheme, focusedScholar, masters, students, 
            setFocus, switchTab, 
            currentRootScholars, getScholarName // On exporte ces nouvelles variables
        };
    },

    template: `
    <div class="max-w-4xl mx-auto p-6 md:p-12 min-h-full flex flex-col items-center">
        
        <div class="w-full max-w-md mb-12 relative z-20 animate-fade-in">
            <div class="bg-white dark:bg-brand-dark-lighter p-1.5 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 flex justify-between gap-1">
                <button v-for="(theme, key) in themes" :key="key" 
                        @click="switchTab(key)" 
                        class="flex-1 py-2.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2"
                        :class="currentTab === key ? theme.btn + ' shadow-md transform scale-105 text-white' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-brand-dark'">
                    <i :data-lucide="theme.icon" class="w-3.5 h-3.5"></i>
                    <span class="hidden md:inline">{{ key }}</span>
                </button>
            </div>
        </div>

        <div v-if="focusedScholar" class="relative w-full flex flex-col items-center animate-slide-up flex-1">
            
            <div class="flex flex-wrap justify-center gap-6 pb-2 relative z-10 w-full">
                <transition-group name="list">
                    <div v-for="m in masters" :key="m.id" @click="setFocus(m.id)" class="flex flex-col items-center group cursor-pointer relative w-28 md:w-32">
                        <div class="w-full bg-white dark:bg-brand-dark-lighter border border-gray-200 dark:border-gray-700 p-3 rounded-xl text-center shadow-sm relative z-20 hover:-translate-y-1 transition-transform duration-300 hover:shadow-md hover:border-brand-gold/50">
                            <span class="text-[8px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Maître</span>
                            <h4 class="font-bold text-xs truncate text-brand-dark dark:text-gray-200">{{ m.name }}</h4>
                        </div>
                        <div class="h-10 w-px bg-gray-300 dark:bg-gray-600 -mt-2 relative z-0 group-hover:bg-brand-gold transition-colors"></div>
                        <div class="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 -mt-1 group-hover:bg-brand-gold transition-colors"></div>
                    </div>
                </transition-group>
                <div v-if="masters.length === 0" class="text-gray-300 text-[10px] uppercase tracking-widest py-8 border-b border-dashed border-gray-200 dark:border-gray-700 w-full text-center">
                    Début de la chaîne
                </div>
            </div>

            <div class="relative z-20 my-2 w-full max-w-lg">
                 <div v-if="masters.length > 0" class="absolute -top-6 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-gray-300 via-brand-gold to-brand-gold z-0"></div>

                <div class="relative bg-white dark:bg-brand-dark-lighter border-2 p-8 md:p-10 rounded-[2rem] text-center shadow-2xl w-full z-10 transform transition-all duration-500" :class="currentTheme.border">
                    <div class="absolute inset-0 rounded-[2rem] blur-xl opacity-20 -z-10" :class="currentTheme.bg.replace('bg-', 'bg-')"></div>

                    <span class="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white mb-4 shadow-sm" :class="currentTheme.btn">
                        {{ focusedScholar.role }}
                    </span>

                    <h1 class="font-display font-bold text-2xl md:text-4xl text-brand-dark dark:text-white mb-2 leading-tight">
                        {{ focusedScholar.name }}
                    </h1>
                    <p class="font-arabic text-xl md:text-2xl mb-6 opacity-80" :class="currentTheme.color">{{ focusedScholar.arabicName }}</p>
                    <p class="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-serif italic mb-8">"{{ focusedScholar.desc }}"</p>

                    <button @click="openScholarFiche(focusedScholar)" class="w-full py-3 rounded-xl font-bold uppercase tracking-widest text-xs text-white shadow-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2" :class="currentTheme.btn">
                        <i data-lucide="book-open" class="w-4 h-4"></i>
                        Voir la Biographie
                    </button>
                </div>

                <div v-if="students.length > 0" class="absolute -bottom-6 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-brand-gold to-gray-300 z-0"></div>
            </div>

            <div class="flex flex-wrap justify-center gap-6 pt-2 relative z-10 w-full">
                <transition-group name="list">
                    <div v-for="s in students" :key="s.id" @click="setFocus(s.id)" class="flex flex-col items-center group cursor-pointer w-28 md:w-32">
                        <div class="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 -mb-1 relative z-10 group-hover:bg-brand-gold transition-colors"></div>
                        <div class="h-10 w-px bg-gray-300 dark:bg-gray-600 -mb-2 relative z-0 group-hover:bg-brand-gold transition-colors"></div>
                        <div class="w-full bg-white dark:bg-brand-dark-lighter border border-gray-200 dark:border-gray-700 p-3 rounded-xl text-center shadow-sm relative z-20 bg-gray-50/50 hover:bg-white dark:hover:bg-brand-dark-lighter transition-all duration-300 hover:translate-y-1 hover:shadow-md hover:border-brand-gold/50">
                            <span class="text-[8px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Élève</span>
                            <h4 class="font-bold text-xs truncate text-brand-dark dark:text-gray-200">{{ s.name }}</h4>
                        </div>
                    </div>
                </transition-group>
                <div v-if="students.length === 0" class="text-gray-300 text-[10px] uppercase tracking-widest py-8 border-t border-dashed border-gray-200 dark:border-gray-700 w-full text-center mt-4">
                    Fin de la branche connue
                </div>
            </div>
        </div>

        <div v-else class="flex flex-col items-center justify-center py-20 text-center animate-fade-in flex-1">
            <div class="w-16 h-16 bg-gray-100 dark:bg-brand-dark-lighter rounded-full flex items-center justify-center mb-4 text-gray-400">
                <i data-lucide="help-circle" class="w-8 h-8"></i>
            </div>
            <h3 class="font-display font-bold text-xl text-brand-dark dark:text-white mb-2">Données manquantes</h3>
            <p class="text-sm text-gray-500 max-w-xs">Le savant (ID: {{ focusId }}) n'a pas été trouvé dans le fichier <code>silsila.js</code>.</p>
        </div>

        <div class="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 w-full text-center relative z-10">
            <h3 class="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">
                Explorer les autres chaînes
            </h3>
            
            <div class="flex flex-wrap justify-center gap-2">
                <button v-for="id in currentRootScholars" :key="id" 
                        @click="setFocus(id)"
                        :class="['px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all', 
                        focusId === id 
                        ? currentTheme.btn + ' text-white border-transparent shadow-md' 
                        : 'bg-white dark:bg-brand-dark-lighter border-gray-200 dark:border-gray-700 text-gray-500 hover:border-brand-gold']">
                    {{ getScholarName(id) }}
                </button>
            </div>
        </div>

    </div>
    `
};