const TransmissionView = {
    props: ['silsila', 'themes', 'rootIds', 'openScholarFiche'],
    
    setup(props) {
        const { ref, computed, watch } = Vue;

        const currentTab = ref('hadith');
        // Initialisation sécurisée
        const focusId = ref(props.rootIds ? props.rootIds.hadith : null);

        // --- 1. CONFIGURATION DES THÈMES & STYLES ---
        const activeThemes = computed(() => {
            const defaults = {
                hadith: { label: "Hadiths", color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200", btn: "bg-purple-600", accent: "from-purple-500 to-indigo-600" },
                fiqh: { label: "Fiqh", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", btn: "bg-emerald-600", accent: "from-emerald-500 to-teal-600" },
                quran: { label: "Lectures", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", btn: "bg-amber-600", accent: "from-amber-500 to-orange-600" },
                pre: { label: "Ancien", color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-200", btn: "bg-slate-500", accent: "from-slate-400 to-slate-500" }
            };
            return props.themes ? { ...defaults, ...props.themes } : defaults;
        });

        // --- 2. LOGIQUE CŒUR ---
        const focusedScholar = computed(() => {
            if (!props.silsila) return null;
            return props.silsila.find(s => s.id === focusId.value);
        });

        // Détection automatique du thème selon le savant affiché
        watch(focusedScholar, (newVal) => {
            if (newVal && activeThemes.value[newVal.group]) {
                if (currentTab.value !== newVal.group) {
                    currentTab.value = newVal.group;
                }
            }
        });

        const currentTheme = computed(() => activeThemes.value[currentTab.value] || activeThemes.value.hadith);

        // --- 3. RÉSEAU (MAÎTRES / ÉLÈVES) ---
        const getScholar = (id) => props.silsila.find(s => s.id === id);

        const masters = computed(() => {
            if (!focusedScholar.value || !focusedScholar.value.teachers) return [];
            return focusedScholar.value.teachers.map(getScholar).filter(Boolean);
        });

        const students = computed(() => {
            if (!focusedScholar.value || !focusedScholar.value.students) return [];
            return focusedScholar.value.students.map(getScholar).filter(Boolean);
        });

        // --- 4. NAVIGATION & UTILITAIRES ---
        const setFocus = (id) => {
            focusId.value = id;
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if(window.navigator.vibrate) window.navigator.vibrate(5);
        };

        const switchTab = (tab) => {
            currentTab.value = tab;
            if (props.rootIds && props.rootIds[tab]) {
                focusId.value = props.rootIds[tab];
            }
        };

        const quickNav = computed(() => {
            // Piliers par défaut si non définis
            if (currentTab.value === 'hadith') return [41, 42, 43, 44, 45, 46]; 
            if (currentTab.value === 'fiqh') return [10, 11, 12, 13]; 
            if (currentTab.value === 'quran') return [60, 63]; 
            return [];
        });

        const getScholarName = (id) => {
            const s = getScholar(id);
            return s ? s.name || s.label : '';
        };

        // Extraction d'une courte bio (première phrase)
        const getShortBio = (bio) => {
            if (!bio) return "Un grand savant de cette communauté.";
            const div = document.createElement("div");
            div.innerHTML = bio;
            const text = div.textContent || div.innerText || "";
            return text.split('.')[0] + '.';
        };

        return { 
            currentTab, focusId, activeThemes, currentTheme,
            focusedScholar, masters, students, 
            setFocus, switchTab, quickNav, getScholarName, getShortBio
        };
    },

    template: `
    <div class="min-h-full bg-[#fcfbf9] dark:bg-brand-dark transition-colors duration-500 font-serif relative overflow-hidden">
        
        <div class="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none" 
             style="background-image: url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23000000\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');">
        </div>

        <div class="max-w-6xl mx-auto p-4 md:p-8 relative z-10 flex flex-col items-center min-h-[90vh]">

            <nav class="w-full max-w-lg mb-12 animate-fade-in">
                <div class="bg-white dark:bg-brand-dark-lighter p-1.5 rounded-full shadow-lg border border-brand-gold/10 flex justify-between relative overflow-hidden">
                    <button v-for="(theme, key) in activeThemes" :key="key" 
                            v-show="key !== 'pre'"
                            @click="switchTab(key)" 
                            class="relative flex-1 py-3 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 z-10"
                            :class="currentTab === key ? theme.btn + ' text-white shadow-md transform scale-[1.02]' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'">
                        <span class="truncate">{{ theme.label || key }}</span>
                    </button>
                </div>
            </nav>

            <div v-if="focusedScholar" class="w-full flex flex-col items-center flex-1 max-w-2xl">
                
                <div class="flex flex-col items-center w-full mb-2 group/masters">
                    <div class="flex flex-wrap justify-center gap-4 relative z-10">
                        <div v-for="m in masters" :key="m.id" @click="setFocus(m.id)" 
                             class="flex flex-col items-center cursor-pointer transition-all duration-300 hover:-translate-y-1 opacity-70 hover:opacity-100">
                            
                            <div class="px-5 py-3 rounded-xl bg-white dark:bg-brand-dark-lighter border border-gray-200 dark:border-gray-700 shadow-sm text-center min-w-[120px] hover:border-brand-gold/50 transition-colors">
                                <span class="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">A pris de</span>
                                <h4 class="font-bold text-xs text-brand-dark dark:text-gray-200 line-clamp-1">{{ m.name || m.label }}</h4>
                            </div>
                            
                            <div class="h-8 w-px bg-gradient-to-b from-gray-300 to-brand-gold/50 dark:from-gray-700 dark:to-brand-gold/50"></div>
                        </div>
                    </div>

                    <div v-if="masters.length === 0" class="text-center py-4 opacity-40">
                        <span class="text-[9px] font-bold uppercase tracking-widest text-gray-400 border-b border-dashed border-gray-300 pb-1">Début de la chaîne documentée</span>
                        <div class="h-8 w-px bg-gradient-to-b from-transparent to-brand-gold/30 mx-auto mt-1"></div>
                    </div>
                </div>

                <div class="relative w-full z-20 animate-scale-up">
                    
                    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-brand-gold/10 to-transparent blur-2xl -z-10 rounded-full"></div>

                    <div class="bg-white dark:bg-brand-dark-lighter rounded-[2rem] shadow-2xl border-t-4 p-8 md:p-12 text-center relative overflow-hidden transition-all duration-300"
                         :class="[currentTheme.border.replace('border-', 'border-t-')]">
                        
                        <span class="inline-block px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white mb-6 shadow-md transform -translate-y-1" 
                              :class="currentTheme.btn">
                            {{ focusedScholar.role || 'Savant' }}
                        </span>

                        <h1 class="font-display font-bold text-3xl md:text-5xl text-brand-dark dark:text-white mb-3 leading-tight">
                            {{ focusedScholar.name || focusedScholar.label }}
                        </h1>
                        
                        <p class="font-arabic text-2xl text-brand-gold mb-6 dir-rtl opacity-90">
                            {{ focusedScholar.arabicName || '' }}
                        </p>

                        <div class="flex items-center justify-center gap-4 mb-6 opacity-30">
                            <div class="h-px w-16 bg-brand-dark dark:bg-white"></div>
                            <div class="w-2 h-2 rotate-45 border border-brand-dark dark:border-white"></div>
                            <div class="h-px w-16 bg-brand-dark dark:bg-white"></div>
                        </div>
                        
                        <p class="text-sm md:text-base text-gray-500 dark:text-gray-400 font-serif italic leading-relaxed max-w-lg mx-auto mb-8">
                            {{ getShortBio(focusedScholar.bio) }}
                        </p>

                        <div class="flex justify-center gap-4">
                            <button v-if="openScholarFiche" @click="openScholarFiche(focusedScholar)" 
                                    class="px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2" 
                                    :class="currentTheme.btn">
                                <i data-lucide="book-open" class="w-4 h-4"></i>
                                Biographie Complète
                            </button>
                        </div>
                        
                        <i data-lucide="feather" class="absolute -bottom-6 -right-6 w-32 h-32 text-gray-50 dark:text-white/5 rotate-[-20deg]"></i>
                    </div>
                </div>

                <div class="flex flex-col items-center w-full mt-2 group/students">
                    
                    <div v-if="students.length > 0" class="h-8 w-px bg-gradient-to-b from-brand-gold/50 to-gray-300 dark:from-brand-gold/50 dark:to-gray-700"></div>
                    <div v-else class="h-8 w-px bg-gradient-to-b from-brand-gold/30 to-transparent"></div>

                    <div class="flex flex-wrap justify-center gap-4 relative z-10">
                        <div v-for="s in students" :key="s.id" @click="setFocus(s.id)" 
                             class="flex flex-col items-center cursor-pointer transition-all duration-300 hover:translate-y-1 opacity-70 hover:opacity-100">
                            
                            <div class="h-4 w-px bg-gray-300 dark:bg-gray-700"></div>

                            <div class="px-5 py-3 rounded-xl bg-white dark:bg-brand-dark-lighter border border-gray-200 dark:border-gray-700 shadow-sm text-center min-w-[120px] hover:border-brand-gold/50 transition-colors bg-gray-50/50 dark:bg-white/5">
                                <span class="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">A enseigné à</span>
                                <h4 class="font-bold text-xs text-brand-dark dark:text-gray-200 line-clamp-1">{{ s.name || s.label }}</h4>
                            </div>
                        </div>
                    </div>

                    <div v-if="students.length === 0" class="text-center py-4 opacity-40">
                        <span class="text-[9px] font-bold uppercase tracking-widest text-gray-400 border-t border-dashed border-gray-300 pt-1">Fin de la transmission directe</span>
                    </div>
                </div>

            </div>

            <div class="w-full max-w-4xl mt-20 pt-10 border-t border-brand-gold/10 text-center animate-fade-in">
                <h3 class="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 mb-6 flex items-center justify-center gap-2">
                    <span class="w-8 h-px bg-gray-300 dark:bg-gray-700"></span>
                    Piliers de la Science
                    <span class="w-8 h-px bg-gray-300 dark:bg-gray-700"></span>
                </h3>
                
                <div class="flex flex-wrap justify-center gap-3">
                    <button v-for="id in quickNav" :key="id" 
                            @click="setFocus(id)"
                            class="group px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all duration-300 flex items-center gap-2"
                            :class="focusId === id 
                            ? currentTheme.btn + ' text-white border-transparent shadow-md' 
                            : 'bg-white dark:bg-brand-dark-lighter border-gray-200 dark:border-gray-700 text-gray-500 hover:border-brand-gold hover:text-brand-dark dark:hover:text-white'">
                        <span class="w-1.5 h-1.5 rounded-full" :class="focusId === id ? 'bg-white' : currentTheme.bg.replace('bg-', 'bg-')"></span>
                        {{ getScholarName(id) }}
                    </button>
                </div>
            </div>

        </div>
    </div>
    `
};