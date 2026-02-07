const TransmissionView = {
    props: ['silsila', 'themes', 'rootIds', 'openScholarFiche'],
    
    setup(props) {
        const { ref, computed, watch } = Vue;

        const currentTab = ref('hadith');
        const focusId = ref(props.rootIds ? props.rootIds.hadith : null);

        // --- CONFIGURATION VISUELLE ---
        const activeThemes = computed(() => {
            const defaults = {
                hadith: { label: "Hadiths", btn: "bg-purple-600", border: "border-purple-200", bg: "bg-purple-50", color: "text-purple-700" },
                fiqh: { label: "Fiqh", btn: "bg-emerald-600", border: "border-emerald-200", bg: "bg-emerald-50", color: "text-emerald-700" },
                quran: { label: "Lectures", btn: "bg-amber-600", border: "border-amber-200", bg: "bg-amber-50", color: "text-amber-700" },
                pre: { label: "Ancien", btn: "bg-slate-500", border: "border-slate-200", bg: "bg-slate-50", color: "text-slate-600" }
            };
            return props.themes ? { ...defaults, ...props.themes } : defaults;
        });

        // --- LOGIQUE METIER ---
        const focusedScholar = computed(() => {
            if (!props.silsila) return null;
            return props.silsila.find(s => s.id === focusId.value);
        });

        // Changement d'onglet automatique si le savant change de catégorie
        watch(focusedScholar, (newVal) => {
            if (newVal && activeThemes.value[newVal.group]) {
                if (currentTab.value !== newVal.group) {
                    currentTab.value = newVal.group;
                }
            }
        });

        // Thème de la carte centrale
        const currentScholarTheme = computed(() => {
            if (!focusedScholar.value) return activeThemes.value.hadith;
            return activeThemes.value[focusedScholar.value.group] || activeThemes.value.pre;
        });

        const getScholar = (id) => props.silsila.find(s => s.id === id);

        const masters = computed(() => {
            if (!focusedScholar.value || !focusedScholar.value.teachers) return [];
            return focusedScholar.value.teachers.map(getScholar).filter(Boolean);
        });

        const students = computed(() => {
            if (!focusedScholar.value || !focusedScholar.value.students) return [];
            return focusedScholar.value.students.map(getScholar).filter(Boolean);
        });

        // --- NAVIGATION ---
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
            if (currentTab.value === 'hadith') return [41, 42, 43, 44, 45, 46]; 
            if (currentTab.value === 'fiqh') return [10, 11, 12, 13]; 
            if (currentTab.value === 'quran') return [60, 63]; 
            return [];
        });

        const getScholarName = (id) => {
            const s = getScholar(id);
            return s ? s.name || s.label : '';
        };

        const getShortBio = (bio) => {
            if (!bio) return "Un grand savant de cette communauté.";
            const div = document.createElement("div");
            div.innerHTML = bio;
            const text = div.textContent || div.innerText || "";
            return text.split('.')[0] + '.';
        };

        return { 
            currentTab, focusId, activeThemes, currentScholarTheme,
            focusedScholar, masters, students, 
            setFocus, switchTab, quickNav, getScholarName, getShortBio
        };
    },

    template: `
    <div class="min-h-full bg-brand-paper dark:bg-brand-dark transition-colors duration-500 font-serif relative overflow-hidden">
        
        <div class="absolute top-0 left-0 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-multiply dark:mix-blend-normal"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none mix-blend-multiply dark:mix-blend-normal"></div>

        <div class="max-w-6xl mx-auto p-4 md:p-8 relative z-10 flex flex-col items-center min-h-[90vh]">

            <nav class="w-full max-w-lg mb-12 animate-fade-in">
                <div class="bg-white dark:bg-brand-dark-lighter p-1.5 rounded-full shadow-lg border border-brand-gold/20 flex justify-between relative overflow-hidden">
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
                                <span class="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Maître</span>
                                <h4 class="font-bold text-xs text-brand-dark dark:text-gray-200 line-clamp-1">{{ m.name || m.label }}</h4>
                            </div>
                            
                            <div class="h-8 w-px bg-gradient-to-b from-gray-300 to-brand-gold/50 dark:from-gray-700 dark:to-brand-gold/50"></div>
                        </div>
                    </div>

                    <div v-if="masters.length === 0" class="text-center py-4 opacity-40">
                        <span class="text-[9px] font-bold uppercase tracking-widest text-gray-400 border-b border-dashed border-gray-300 pb-1">Début de chaîne connue</span>
                        <div class="h-8 w-px bg-gradient-to-b from-transparent to-brand-gold/30 mx-auto mt-1"></div>
                    </div>
                </div>

                <div class="relative w-full z-20 animate-scale-up">
                    
                    <div class="bg-white dark:bg-brand-dark-lighter rounded-[2.5rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] border-t-4 p-8 md:p-12 text-center relative overflow-hidden transition-all duration-300"
                         :class="[currentScholarTheme.border.replace('border-', 'border-t-')]">
                        
                        <span class="inline-block px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white mb-6 shadow-md transform -translate-y-1" 
                              :class="currentScholarTheme.btn">
                            {{ focusedScholar.role || 'Savant' }}
                        </span>

                        <h1 class="font-display font-bold text-3xl md:text-5xl text-brand-dark dark:text-white mb-3 leading-tight">
                            {{ focusedScholar.name || focusedScholar.label }}
                        </h1>
                        
                        <p class="font-arabic text-2xl text-brand-gold mb-6 dir-rtl opacity-90 select-none">
                            {{ focusedScholar.arabicName || '' }}
                        </p>

                        <div class="flex items-center justify-center gap-4 mb-8 opacity-30">
                            <div class="h-px w-12 bg-brand-dark dark:bg-white"></div>
                            <div class="w-1.5 h-1.5 rotate-45 bg-brand-dark dark:bg-white"></div>
                            <div class="h-px w-12 bg-brand-dark dark:bg-white"></div>
                        </div>
                        
                        <p class="text-sm md:text-base text-gray-500 dark:text-gray-400 font-serif italic leading-relaxed max-w-lg mx-auto mb-8">
                            {{ getShortBio(focusedScholar.bio) }}
                        </p>

                        <div class="flex justify-center gap-4 relative z-10">
                            <button v-if="openScholarFiche" @click="openScholarFiche(focusedScholar)" 
                                    class="px-8 py-3 rounded-full font-bold uppercase tracking-widest text-[10px] md:text-xs text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2" 
                                    :class="currentScholarTheme.btn">
                                <i data-lucide="book-open" class="w-4 h-4"></i>
                                Voir la Biographie
                            </button>
                        </div>
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
                                <span class="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Élève</span>
                                <h4 class="font-bold text-xs text-brand-dark dark:text-gray-200 line-clamp-1">{{ s.name || s.label }}</h4>
                            </div>
                        </div>
                    </div>

                    <div v-if="students.length === 0" class="text-center py-4 opacity-40">
                        <div class="h-4 w-px bg-gradient-to-b from-brand-gold/30 to-transparent mx-auto mb-1"></div>
                        <span class="text-[9px] font-bold uppercase tracking-widest text-gray-400 border-t border-dashed border-gray-300 pt-1">Fin de la transmission connue</span>
                    </div>
                </div>

            </div>

            <div class="w-full max-w-4xl mt-20 pt-10 border-t border-brand-gold/10 text-center animate-fade-in">
                <h3 class="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 mb-6 flex items-center justify-center gap-2">
                    Piliers de la Science
                </h3>
                
                <div class="flex flex-wrap justify-center gap-3">
                    <button v-for="id in quickNav" :key="id" 
                            @click="setFocus(id)"
                            class="group px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all duration-300 flex items-center gap-2 bg-white dark:bg-brand-dark-lighter text-gray-500 hover:border-brand-gold hover:text-brand-dark dark:hover:text-white"
                            :class="focusId === id ? 'border-brand-gold text-brand-gold shadow-sm' : 'border-gray-200 dark:border-gray-700'">
                        {{ getScholarName(id) }}
                    </button>
                </div>
            </div>

        </div>
    </div>
    `
};