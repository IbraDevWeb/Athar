const RelationsView = {
    template: `
    <div class="h-full relative bg-brand-dark overflow-hidden">
        <div id="network-container" class="w-full h-full"></div>
        
        <div class="absolute top-4 left-4 bg-black/50 p-4 rounded-xl backdrop-blur border border-white/10 text-white max-w-xs">
            <h3 class="font-display font-bold text-brand-gold mb-2">Le Tissage des Liens</h3>
            <p class="text-xs text-gray-300">Explorez les connexions entre les compagnons. Zoomez et glissez pour naviguer.</p>
        </div>
    </div>
    `,
    mounted() {
        if (typeof vis === 'undefined' || typeof RELATIONS_DATA === 'undefined') return;

        const container = document.getElementById('network-container');
        const data = {
            nodes: new vis.DataSet(RELATIONS_DATA.nodes),
            edges: new vis.DataSet(RELATIONS_DATA.edges)
        };
        const options = {
            nodes: {
                shape: 'dot',
                size: 20,
                font: { size: 14, color: '#ffffff', face: 'Cinzel' },
                borderWidth: 2,
                color: { background: '#1a1c23', border: '#c5a059', highlight: { background: '#c5a059', border: '#ffffff' } }
            },
            edges: {
                width: 1,
                color: { color: 'rgba(255,255,255,0.2)', highlight: '#c5a059' },
                smooth: { type: 'continuous' }
            },
            physics: {
                stabilization: false,
                barnesHut: { gravitationalConstant: -2000, springConstant: 0.04, springLength: 150 }
            },
            interaction: { hover: true, tooltipDelay: 200 }
        };
        
        this.network = new vis.Network(container, data, options);
    }
};