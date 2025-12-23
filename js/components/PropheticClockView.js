const PropheticClockView = {
    template: `
    <div class="h-full flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div class="absolute inset-0 bg-islamic opacity-5 pointer-events-none"></div>
        
        <h2 class="font-display text-3xl font-bold text-brand-gold mb-8 z-10">L'Horloge Prophétique</h2>

        <div class="relative w-80 h-80 md:w-96 md:h-96">
            <svg viewBox="0 0 100 100" class="w-full h-full drop-shadow-2xl">
                <circle cx="50" cy="50" r="48" fill="var(--bg-paper)" class="dark:fill-gray-800" stroke="#c5a059" stroke-width="0.5"/>
                
                <path v-for="(seg, i) in segments" :key="i" 
                      :d="getSegmentPath(seg.start, seg.end)" 
                      fill="transparent" 
                      stroke="rgba(197, 160, 89, 0.3)" 
                      stroke-width="15" 
                      class="hover:stroke-brand-gold transition-colors cursor-pointer"
                      @click="activeSegment = seg" />

                <line x1="50" y1="50" x2="50" y2="10" 
                      stroke="#ef4444" stroke-width="1" stroke-linecap="round"
                      :transform="'rotate(' + currentRotation + ' 50 50)'" 
                      class="transition-transform duration-1000 ease-linear" />
                
                <circle cx="50" cy="50" r="2" fill="#c5a059" />
            </svg>

            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div class="text-center mt-20">
                    <span class="block font-mono text-2xl font-bold text-brand-dark dark:text-white">{{ currentTime }}</span>
                </div>
            </div>
        </div>

        <div v-if="activeSegment" class="mt-8 p-6 bg-white dark:bg-brand-dark-lighter border border-brand-gold/20 rounded-xl shadow-lg max-w-md text-center animate-slide-up z-10">
            <h3 class="font-bold text-brand-gold uppercase tracking-widest text-sm mb-2">{{ activeSegment.label }}</h3>
            <p class="text-gray-600 dark:text-gray-300 font-serif italic">{{ activeSegment.desc }}</p>
        </div>
        <div v-else class="mt-8 text-gray-400 text-sm z-10">Cliquez sur un segment coloré</div>
    </div>
    `,
    data() {
        return {
            now: new Date(),
            activeSegment: null,
            routine: typeof PROPHETIC_ROUTINE !== 'undefined' ? PROPHETIC_ROUTINE : []
        }
    },
    computed: {
        currentTime() {
            return this.now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        },
        currentRotation() {
            // Convertir l'heure en degrés (0-360)
            const minutes = this.now.getHours() * 60 + this.now.getMinutes();
            return (minutes / 1440) * 360;
        },
        segments() {
            return this.routine; // Simplifié pour l'exemple
        }
    },
    mounted() {
        this.timer = setInterval(() => this.now = new Date(), 1000 * 60);
        // Trouver le segment actuel
        const h = this.now.getHours();
        this.activeSegment = this.routine.find(r => h >= r.start && h < r.end) || null;
    },
    beforeUnmount() {
        clearInterval(this.timer);
    },
    methods: {
        getSegmentPath(startH, endH) {
            // Calcul mathématique pour dessiner un arc SVG
            const startAngle = (startH / 24) * 360;
            const endAngle = (endH / 24) * 360;
            const x1 = 50 + 40 * Math.sin(Math.PI * 2 * startAngle / 360);
            const y1 = 50 - 40 * Math.cos(Math.PI * 2 * startAngle / 360);
            const x2 = 50 + 40 * Math.sin(Math.PI * 2 * endAngle / 360);
            const y2 = 50 - 40 * Math.cos(Math.PI * 2 * endAngle / 360);
            const largeArc = endAngle - startAngle > 180 ? 1 : 0;
            return `M ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2}`;
        }
    }
};