// Fichier: js/components/ToolView.js
const ToolView = {
    props: ['currentTool', 'settings'],
    data() {
        return {
            amount: 1, // Pour le convertisseur
            currencyType: 'dinar' // Pour le convertisseur
        }
    },
    computed: {
        toolData() {
            // Récupère les données depuis la variable globale EXTENSIONS_DATA
            if (typeof EXTENSIONS_DATA !== 'undefined' && EXTENSIONS_DATA[this.currentTool]) {
                return EXTENSIONS_DATA[this.currentTool];
            }
            return null;
        },
        // Logique spécifique pour le convertisseur (Dinar/Dirham)
        convertedValue() {
            if (!this.toolData || !this.toolData.rates) return 0;
            const rates = this.toolData.rates;
            if (this.currencyType === 'dinar') {
                // 1 Dinar = 4.25g d'or
                const value = this.amount * rates.dinar_weight * rates.gold_gram;
                return value.toFixed(2);
            } else {
                // 1 Dirham = 2.975g d'argent
                const value = this.amount * rates.dirham_weight * rates.silver_gram;
                return value.toFixed(2);
            }
        }
    },
    template: `
    <div class="h-full flex flex-col bg-brand-paper dark:bg-brand-dark overflow-y-auto">
        
        <header v-if="toolData" class="p-8 pb-4 text-center animate-fade-in">
            <div class="w-16 h-16 mx-auto bg-brand-gold/10 rounded-full flex items-center justify-center mb-4 text-brand-gold">
                <i :data-lucide="toolData.icon" class="w-8 h-8"></i>
            </div>
            <h1 class="font-display text-3xl font-bold text-brand-dark dark:text-white mb-2">{{ toolData.title }}</h1>
            <p class="text-sm text-gray-500 font-serif italic">{{ toolData.desc }}</p>
        </header>

        <div class="flex-1 p-6 md:p-12 max-w-4xl mx-auto w-full">
            
            <div v-if="!toolData" class="text-center text-red-500">
                Erreur : Données introuvables pour {{ currentTool }}
            </div>

            <div v-else-if="currentTool === 'currency'" class="bg-white dark:bg-brand-dark-lighter p-8 rounded-2xl shadow-card border border-brand-gold/20 animate-slide-up">
                <div class="flex flex-col gap-6">
                    <div class="flex justify-center gap-4 mb-4">
                        <button @click="currencyType = 'dinar'" :class="['px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-all', currencyType === 'dinar' ? 'bg-brand-gold text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500']">Dinar (Or)</button>
                        <button @click="currencyType = 'dirham'" :class="['px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-all', currencyType === 'dirham' ? 'bg-gray-400 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500']">Dirham (Argent)</button>
                    </div>
                    
                    <div class="text-center">
                        <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Quantité Historique</label>
                        <div class="flex items-center justify-center gap-4">
                            <input type="number" v-model="amount" class="w-32 text-center text-4xl font-display font-bold bg-transparent border-b-2 border-brand-gold/30 focus:border-brand-gold outline-none text-brand-dark dark:text-white p-2">
                            <span class="text-xl font-serif text-gray-500">{{ currencyType === 'dinar' ? 'Dinars' : 'Dirhams' }}</span>
                        </div>
                    </div>

                    <div class="h-px bg-gray-200 dark:bg-gray-700 w-1/2 mx-auto my-4"></div>

                    <div class="text-center">
                        <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Valeur Estimée Aujourd'hui</label>
                        <div class="text-5xl font-display font-bold text-brand-gold">
                            {{ convertedValue }} <span class="text-2xl text-gray-400">€</span>
                        </div>
                        <p class="text-[10px] text-gray-400 mt-2">Basé sur le cours de l'or/argent actuel</p>
                    </div>
                </div>
            </div>

            <div v-else class="text-center py-20 bg-white dark:bg-brand-dark-lighter rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 animate-fade-in">
                <div class="w-20 h-20 mx-auto bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 text-gray-300">
                    <i data-lucide="hammer" class="w-10 h-10"></i>
                </div>
                <h3 class="font-bold text-lg text-gray-400">Section en construction</h3>
                <p class="text-sm text-gray-400 mt-2">L'implémentation scientifique de ce module est en cours.</p>
            </div>

        </div>
    </div>
    `,
    mounted() {
        if(window.lucide) window.lucide.createIcons();
    },
    updated() {
        if(window.lucide) window.lucide.createIcons();
    }
};