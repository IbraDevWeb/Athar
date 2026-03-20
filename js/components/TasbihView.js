const TasbihView = {
    template: `
    <div class="h-full bg-brand-paper dark:bg-brand-dark flex flex-col items-center justify-center p-4 animate-fade-in text-center">
        <div class="w-full max-w-md mx-auto">

            <!-- Sélecteur de Dhikr -->
            <div class="mb-8">
                <div class="flex items-center justify-center bg-gray-100 dark:bg-brand-dark-lighter rounded-xl p-1 shadow-inner">
                    <button v-for="d in dhikrOptions" @click="selectDhikr(d)"
                            class="flex-1 px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300"
                            :class="d.name === selectedDhikr.name ? 'bg-white dark:bg-brand-dark text-brand-gold shadow' : 'text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-brand-dark/50'">
                        {{ d.name }}
                    </button>
                </div>
            </div>

            <!-- Affichage du texte arabe -->
            <div class="mb-8 min-h-[80px] flex items-center justify-center">
                <h1 class="font-arabic text-4xl md:text-5xl text-brand-dark dark:text-white transition-all duration-300" :key="selectedDhikr.name">
                    {{ selectedDhikr.arabic }}
                </h1>
            </div>

            <!-- Bouton central et barre de progression -->
            <div class="relative w-64 h-64 md:w-72 md:h-72 mx-auto mb-8">
                <svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                    <!-- Background -->
                    <circle class="text-gray-200 dark:text-brand-dark-lighter" stroke-width="8" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                    <!-- Progress -->
                    <circle class="text-brand-gold transition-all duration-300 ease-linear"
                            stroke-width="8"
                            :stroke-dasharray="circumference"
                            :stroke-dashoffset="progressOffset"
                            stroke-linecap="round"
                            stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" transform="rotate(-90 50 50)" />
                </svg>

                <div @click="increment" id="tasbih-button"
                     class="w-full h-full rounded-full flex flex-col items-center justify-center cursor-pointer select-none active:scale-95 transition-transform bg-white dark:bg-brand-dark-lighter shadow-lg hover:shadow-xl">
                    <span class="font-display text-7xl md:text-8xl font-bold text-brand-dark dark:text-white tabular-nums tracking-tighter leading-none">
                        {{ count }}
                    </span>
                    <span class="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mt-2">/ {{ goal }}</span>
                </div>
            </div>

            <!-- Compteurs et contrôles -->
            <div class="grid grid-cols-3 gap-4 items-center mb-8">
                <div class="text-center bg-gray-100 dark:bg-brand-dark-lighter p-3 rounded-xl shadow-inner">
                    <span class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Objectif</span>
                    <div class="flex items-center justify-center gap-2 mt-1">
                         <button @click="changeGoal(-1)" class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">-</button>
                         <span class="font-bold text-lg text-brand-dark dark:text-white w-12">{{ goal }}</span>
                         <button @click="changeGoal(1)" class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">+</button>
                    </div>
                </div>
                <div class="text-center">
                    <button @click="confirmReset" class="w-16 h-16 flex items-center justify-center rounded-full bg-white dark:bg-brand-dark-lighter shadow-md hover:text-red-500 hover:border-red-200 border border-transparent transition-all">
                        <i data-lucide="rotate-ccw" class="w-6 h-6"></i>
                    </button>
                </div>
                <div class="text-center bg-gray-100 dark:bg-brand-dark-lighter p-3 rounded-xl shadow-inner">
                    <span class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Cycles</span>
                    <span class="block font-bold text-2xl text-brand-dark dark:text-white mt-1">{{ cycles }}</span>
                </div>
            </div>
             <button @click="$emit('close-view')" class="text-xs text-gray-400 hover:text-brand-gold transition-all">Retour</button>
        </div>
    </div>
    `,
    emits: ['close-view'],
    setup() {
        const { ref, reactive, computed, onMounted, watch } = Vue;

        const circumference = 45 * 2 * Math.PI;
        const dhikrOptions = reactive([
            { name: 'Tasbih', arabic: 'سُبْحَانَ ٱللَّٰهِ', count: 0 },
            { name: 'Tahmid', arabic: 'ٱلْحَمْدُ لِلَّٰهِ', count: 0 },
            { name: 'Takbir', arabic: 'ٱللَّٰهُ أَكْبَرُ', count: 0 },
            { name: 'Istighfar', arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ', count: 0 },
            { name: 'Tahlil', arabic: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ', count: 0 }
        ]);
        const goals = [33, 99, 100];
        let currentGoalIndex = ref(0);

        const selectedDhikr = ref(dhikrOptions[0]);
        const count = ref(0);
        const goal = ref(goals[currentGoalIndex.value]);
        const cycles = ref(0);

        const progressOffset = computed(() => {
            return circumference - (count.value / goal.value) * circumference;
        });

        const increment = () => {
            if (count.value < goal.value) {
                count.value++;
                if (navigator.vibrate) navigator.vibrate(15);

                // Ripple effect
                const button = document.getElementById('tasbih-button');
                if (button) {
                    const ripple = document.createElement("span");
                    ripple.classList.add('ripple-effect');
                    button.appendChild(ripple);
                    setTimeout(() => ripple.remove(), 600);
                }

            }

            if (count.value >= goal.value) {
                cycles.value++;
                count.value = 0;
                if (navigator.vibrate) navigator.vibrate([50, 70, 50]);
            }
        };

        const selectDhikr = (dhikr) => {
            selectedDhikr.value = dhikr;
            count.value = dhikr.count;
            cycles.value = Math.floor(dhikr.totalCount / goal.value) || 0;
        };

        const changeGoal = (direction) => {
            currentGoalIndex.value = (currentGoalIndex.value + direction + goals.length) % goals.length;
            goal.value = goals[currentGoalIndex.value];
        };

        const confirmReset = () => {
            if (window.confirm("Voulez-vous vraiment réinitialiser le compteur pour ce dhikr ?")) {
                count.value = 0;
                cycles.value = 0;
                selectedDhikr.value.count = 0;
                selectedDhikr.value.totalCount = 0;
            }
        };
        
        const saveData = () => {
            const dataToSave = {
                dhikrCounts: dhikrOptions.map(d => ({ name: d.name, totalCount: d.totalCount || 0 })),
                goalIndex: currentGoalIndex.value
            };
            localStorage.setItem('athar_tasbih_data', JSON.stringify(dataToSave));
        };

        onMounted(() => {
            const savedData = JSON.parse(localStorage.getItem('athar_tasbih_data'));
            if (savedData) {
                savedData.dhikrCounts.forEach(savedDhikr => {
                    const localDhikr = dhikrOptions.find(d => d.name === savedDhikr.name);
                    if (localDhikr) {
                        localDhikr.totalCount = savedDhikr.totalCount || 0;
                    }
                });
                currentGoalIndex.value = savedData.goalIndex || 0;
                goal.value = goals[currentGoalIndex.value];
            }
            // Initialiser le compteur de la vue avec les données chargées
            selectDhikr(selectedDhikr.value);
            count.value = selectedDhikr.value.totalCount % goal.value;
            cycles.value = Math.floor(selectedDhikr.value.totalCount / goal.value);
        });
        
        watch([count, cycles], () => {
            selectedDhikr.value.count = count.value;
            selectedDhikr.value.totalCount = (cycles.value * goal.value) + count.value;
            saveData();
        });
        
        watch(goal, () => {
             // Recalculer les cycles et le compteur quand l'objectif change
            cycles.value = Math.floor(selectedDhikr.value.totalCount / goal.value);
            count.value = selectedDhikr.value.totalCount % goal.value;
            saveData();
        });

        return {
            dhikrOptions,
            selectedDhikr,
            count,
            goal,
            cycles,
            progressOffset,
            circumference,
            increment,
            selectDhikr,
            changeGoal,
            confirmReset
        };
    }
};
