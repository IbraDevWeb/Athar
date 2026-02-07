const TransmissionView = {
    props: ['silsila', 'themes'], // On reçoit SILSILA_DATA (qui contient nodes/edges)
    
    setup(props) {
        const networkContainer = Vue.ref(null);
        const selectedNode = Vue.ref(null);
        const network = Vue.ref(null);

        // Options de configuration pour Vis.js (Style Athar)
        const options = {
            nodes: {
                shape: 'dot',
                size: 20,
                font: {
                    size: 14,
                    face: 'Cinzel',
                    color: '#666' // Par défaut (changé dynamiquement)
                },
                borderWidth: 2,
                shadow: true
            },
            edges: {
                width: 1,
                color: { color: '#ccc', highlight: '#c5a059' },
                smooth: { type: 'cubicBezier', forceDirection: 'vertical', roundness: 0.4 },
                arrows: { to: { enabled: true, scaleFactor: 0.5 } }
            },
            layout: {
                hierarchical: {
                    direction: 'UD', // Haut vers Bas
                    sortMethod: 'directed',
                    levelSeparation: 120,
                    nodeSpacing: 150
                }
            },
            interaction: {
                hover: true,
                tooltipDelay: 200,
                zoomView: true
            },
            physics: false // Statique pour plus de propreté
        };

        const initNetwork = () => {
            if (!networkContainer.value || !props.silsila) return;

            // Préparation des données avec couleurs
            const nodes = new vis.DataSet(props.silsila.nodes.map(n => {
                const theme = props.themes && props.themes[n.group] ? props.themes[n.group] : { color: '#999' };
                // On détecte le mode sombre via la classe html
                const isDark = document.documentElement.classList.contains('dark');
                
                return {
                    ...n,
                    color: {
                        background: isDark ? '#1a1c23' : '#fff',
                        border: theme.color,
                        highlight: { background: theme.color, border: theme.color }
                    },
                    font: { color: isDark ? '#eee' : '#333' }
                };
            }));

            const edges = new vis.DataSet(props.silsila.edges);

            const data = { nodes, edges };

            network.value = new vis.Network(networkContainer.value, data, options);

            // Événement Clic
            network.value.on("click", (params) => {
                if (params.nodes.length > 0) {
                    const nodeId = params.nodes[0];
                    selectedNode.value = props.silsila.nodes.find(n => n.id === nodeId);
                } else {
                    selectedNode.value = null;
                }
            });
        };

        Vue.onMounted(() => {
            // Petit délai pour s'assurer que le DOM est prêt
            setTimeout(initNetwork, 100);
        });

        // Réagir au changement de mode sombre
        Vue.watch(() => document.documentElement.classList.contains('dark'), () => {
            initNetwork();
        });

        return { networkContainer, selectedNode };
    },

    template: `
    <div class="relative w-full h-full min-h-screen bg-brand-paper dark:bg-brand-dark flex flex-col md:flex-row overflow-hidden">
        
        <div class="flex-1 relative h-[60vh] md:h-full bg-grain">
            
            <div class="absolute top-4 left-4 z-10 bg-white/80 dark:bg-black/50 backdrop-blur p-4 rounded-xl border border-brand-gold/20 shadow-sm text-xs">
                <h3 class="font-bold text-brand-gold uppercase tracking-widest mb-2">Légende</h3>
                <div class="space-y-2">
                    <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-green-500"></span> Hanafite</div>
                    <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-yellow-500"></span> Malikite</div>
                    <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-blue-500"></span> Shafi'ite</div>
                    <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-red-500"></span> Hanbalite</div>
                    <div class="flex items-center gap-2"><span class="w-3 h-3 rotate-45 bg-purple-500"></span> Hadith</div>
                </div>
            </div>

            <div ref="networkContainer" class="w-full h-full cursor-grab active:cursor-grabbing"></div>
            
            <div class="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 uppercase tracking-widest pointer-events-none">
                Pincez ou scrollez pour zoomer
            </div>
        </div>

        <transition name="slide-right">
            <div v-if="selectedNode" class="w-full md:w-96 bg-white dark:bg-brand-dark-lighter border-l border-brand-gold/10 shadow-2xl p-8 overflow-y-auto relative z-20 h-[40vh] md:h-full">
                
                <button @click="selectedNode = null" class="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>

                <div class="mt-4">
                    <span class="inline-block px-3 py-1 rounded-full bg-brand-gold/10 text-brand-gold text-[10px] font-bold uppercase tracking-widest mb-4">
                        Génération {{ selectedNode.level }}
                    </span>
                    
                    <h2 class="font-display font-bold text-3xl text-brand-dark dark:text-white mb-2 leading-tight">
                        {{ selectedNode.label.replace('\\n', ' ') }}
                    </h2>
                    
                    <div class="w-12 h-1 bg-brand-gold rounded-full mb-6"></div>

                    <div class="prose prose-sm dark:prose-invert font-serif text-gray-600 dark:text-gray-300 leading-relaxed" 
                         v-html="selectedNode.bio">
                    </div>
                </div>
            </div>
            
            <div v-else class="hidden md:flex w-96 bg-white/50 dark:bg-brand-dark-lighter/50 border-l border-brand-gold/5 p-8 flex-col justify-center items-center text-center text-gray-400">
                <div class="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center mb-4">
                    <i data-lucide="git-fork" class="w-8 h-8 text-brand-gold"></i>
                </div>
                <p class="text-sm font-sans uppercase tracking-widest">Sélectionnez un savant<br>pour voir sa biographie</p>
            </div>
        </transition>

    </div>
    `
};