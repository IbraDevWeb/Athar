// Fichier: js/components/HomeView.js
const HomeView = {
    props: ['setView', 'openRandomChapter', 'hadithCount', 'companionCount'],
    template: `
    <div class="min-h-full flex flex-col items-center justify-center p-6 md:p-12 animate-fade-in relative overflow-hidden">
        
        <div class="absolute inset-0 bg-islamic opacity-5 pointer-events-none"></div>
        <div class="absolute top-0 left-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

        <div class="text-center max-w-3xl mx-auto mb-16 relative z-10">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-[10px] uppercase tracking-[0.2em] font-bold mb-6">
                <span class="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse"></span>
                Encyclopédie Interactive
            </div>
            
            <h1 class="font-display text-5xl md:text-7xl font-bold text-brand-dark dark:text-white mb-6 leading-tight">
                Athar<span class="text-brand-gold">Pro</span>
            </h1>
            
            <p class="font-serif text-lg md:text-xl text-gray-600 dark:text-gray-300 italic mb-8 leading-relaxed">
                "Mes compagnons sont comme des étoiles ; peu importe celle que vous suivez, vous serez guidés."
            </p>

            <div class="flex flex-wrap justify-center gap-4">
                <button @click="setView('library')" class="px-8 py-3 bg-brand-dark dark:bg-white text-white dark:text-brand-dark rounded-full font-bold uppercase tracking-widest text-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
                    <i data-lucide="library" class="w-4 h-4"></i> Explorer la Bibliothèque
                </button>
                <button @click="openRandomChapter" class="px-8 py-3 bg-transparent border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white rounded-full font-bold uppercase tracking-widest text-xs transition-all duration-300 flex items-center gap-2 group">
                    <i data-lucide="shuffle" class="w-4 h-4 group-hover:rotate-180 transition-transform duration-500"></i> Découverte
                </button>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl relative z-10">
            
            <div @click="setView('atlas')" class="group cursor-pointer bg-white dark:bg-brand-dark-lighter p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:border-brand-gold/50 transition-all duration-300 relative overflow-hidden">
                <div class="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <i data-lucide="map" class="w-24 h-24 text-brand-gold"></i>
                </div>
                <div class="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <i data-lucide="globe-2" class="w-5 h-5"></i>
                </div>
                <h3 class="font-display font-bold text-lg text-brand-dark dark:text-gray-100 mb-2">Atlas Interactif</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Explorez le monde des Sahaba géographiquement. Lieux de naissance, batailles et voyages.</p>
            </div>

            <div @click="setView('ussul')" class="group cursor-pointer bg-white dark:bg-brand-dark-lighter p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:border-brand-gold/50 transition-all duration-300 relative overflow-hidden">
                <div class="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <i data-lucide="scale" class="w-24 h-24 text-brand-gold"></i>
                </div>
                <div class="w-10 h-10 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <i data-lucide="scale" class="w-5 h-5"></i>
                </div>
                <h3 class="font-display font-bold text-lg text-brand-dark dark:text-gray-100 mb-2">Oussoul Al-Fiqh</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Les fondements de la jurisprudence expliqués à travers l'ouvrage Al-Ishara.</p>
            </div>

            <div @click="setView('tabib')" class="group cursor-pointer bg-white dark:bg-brand-dark-lighter p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:border-brand-gold/50 transition-all duration-300 relative overflow-hidden">
                <div class="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <i data-lucide="heart-pulse" class="w-24 h-24 text-brand-gold"></i>
                </div>
                <div class="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <i data-lucide="leaf" class="w-5 h-5"></i>
                </div>
                <h3 class="font-display font-bold text-lg text-brand-dark dark:text-gray-100 mb-2">Tabib Al-Qulub</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">La pharmacie des âmes. Remèdes spirituels tirés du Coran et de la Sunna.</p>
            </div>

            <div @click="setView('transmission')" class="group cursor-pointer bg-white dark:bg-brand-dark-lighter p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:border-brand-gold/50 transition-all duration-300 relative overflow-hidden">
                <div class="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <i data-lucide="git-fork" class="w-24 h-24 text-brand-gold"></i>
                </div>
                <div class="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <i data-lucide="git-fork" class="w-5 h-5"></i>
                </div>
                <h3 class="font-display font-bold text-lg text-brand-dark dark:text-gray-100 mb-2">Transmission</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Visualisez les chaînes de transmission (Isnad) des grandes écoles et des Hadiths.</p>
            </div>

            <div @click="setView('timeline')" class="group cursor-pointer bg-white dark:bg-brand-dark-lighter p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:border-brand-gold/50 transition-all duration-300 relative overflow-hidden">
                <div class="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <i data-lucide="clock" class="w-24 h-24 text-brand-gold"></i>
                </div>
                <div class="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <i data-lucide="calendar-clock" class="w-5 h-5"></i>
                </div>
                <h3 class="font-display font-bold text-lg text-brand-dark dark:text-gray-100 mb-2">Chronologie</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Une frise unifiée pour comprendre le contexte historique des événements.</p>
            </div>

             <div @click="setView('hadiths')" class="group cursor-pointer bg-white dark:bg-brand-dark-lighter p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:border-brand-gold/50 transition-all duration-300 relative overflow-hidden">
                <div class="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <i data-lucide="scroll" class="w-24 h-24 text-brand-gold"></i>
                </div>
                <div class="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <i data-lucide="scroll-text" class="w-5 h-5"></i>
                </div>
                <h3 class="font-display font-bold text-lg text-brand-dark dark:text-gray-100 mb-2">Recueil de Hadiths</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Accédez aux paroles prophétiques authentiques classées par thèmes.</p>
            </div>
        </div>

        <div class="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 w-full max-w-4xl flex justify-center gap-8 md:gap-16">
            <div class="text-center">
                <div class="font-display font-bold text-2xl text-brand-dark dark:text-white">{{ companionCount }}</div>
                <div class="text-[10px] text-gray-400 uppercase tracking-widest">Biographies</div>
            </div>
             <div class="text-center">
                <div class="font-display font-bold text-2xl text-brand-dark dark:text-white">{{ hadithCount }}</div>
                <div class="text-[10px] text-gray-400 uppercase tracking-widest">Hadiths</div>
            </div>
            <div class="text-center">
                <div class="font-display font-bold text-2xl text-brand-dark dark:text-white">v2.1</div>
                <div class="text-[10px] text-gray-400 uppercase tracking-widest">Version</div>
            </div>
        </div>

    </div>
    `
};