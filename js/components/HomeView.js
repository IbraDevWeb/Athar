// Page d'accueil de la version publique : uniquement les sections disponibles.
const HomeView = {
    props: ['setView'],
    setup() {
        const sections = [
            { view: 'library', title: 'Bibliothèque', detail: 'Biographies, récits et parcours des Compagnons.', icon: 'library', number: '01' },
            { view: 'timeline', title: 'Frise Chrono', detail: 'Les grandes dates et les événements à replacer dans leur contexte.', icon: 'clock', number: '02' },
            { view: 'glossary', title: 'Lexique', detail: 'Les termes et notions essentiels à retrouver facilement.', icon: 'book-a', number: '03' },
            { view: 'hadiths', title: 'Hadiths', detail: 'Lire les textes, leurs références et leurs explications.', icon: 'scroll-text', number: '04' },
            { view: 'tabib', title: 'Tabib Al-Qulub', detail: 'Des ressources pour méditer et prendre soin du cœur.', icon: 'heart-pulse', number: '05' },
            { view: 'adhkar', title: 'Al-Adhkar', detail: 'Des invocations et rappels à consulter au quotidien.', icon: 'sunrise', number: '06' },
            { view: 'tasbih', title: 'Tasbih', detail: 'Un compteur simple et accessible pour le dhikr.', icon: 'rotate-cw', number: '07' }
        ];

        Vue.onMounted(() => Vue.nextTick(() => window.lucide?.createIcons()));
        return { sections };
    },
    template: `
        <section class="ap-home ap-launch animate-fade-in">
            <div class="ap-launch-wrap">
                <header class="ap-launch-hero">
                    <div class="ap-launch-hero-copy">
                        <span class="ap-launch-eyebrow"><span class="ap-launch-dot"></span> Athar Pro · L’essentiel</span>
                        <p class="ap-launch-arabic" lang="ar" dir="rtl">رَبِّ زِدْنِي عِلْمًا</p>
                        <h1>Le savoir, <em>à portée de lecture.</em></h1>
                        <p class="ap-launch-intro">Un espace épuré pour explorer les biographies, comprendre les textes et accompagner vos instants de rappel.</p>
                        <div class="ap-launch-actions">
                            <button type="button" @click="setView('library')" class="ap-launch-primary">Explorer la bibliothèque <i data-lucide="arrow-up-right" aria-hidden="true"></i></button>
                            <button type="button" @click="setView('hadiths')" class="ap-launch-secondary">Lire les hadiths <i data-lucide="arrow-right" aria-hidden="true"></i></button>
                        </div>
                    </div>
                    <div class="ap-launch-art" aria-hidden="true">
                        <div class="ap-launch-art-ring"></div>
                        <span>أثر</span>
                    </div>
                </header>

                <div class="ap-launch-section-head">
                    <div>
                        <p class="ap-launch-section-kicker">Votre espace d’étude</p>
                        <h2>Les sept rubriques accessibles</h2>
                    </div>
                    <span class="ap-launch-count">07 / 07</span>
                </div>

                <nav class="ap-launch-grid" aria-label="Rubriques disponibles">
                    <button v-for="section in sections" :key="section.view" type="button"
                            class="ap-launch-card" @click="setView(section.view)"
                            :aria-label="'Ouvrir ' + section.title">
                        <span class="ap-launch-card-top">
                            <span class="ap-launch-card-icon"><i :data-lucide="section.icon" aria-hidden="true"></i></span>
                            <span class="ap-launch-card-number">{{ section.number }}</span>
                        </span>
                        <span class="ap-launch-card-title">{{ section.title }}</span>
                        <span class="ap-launch-card-detail">{{ section.detail }}</span>
                        <span class="ap-launch-card-bottom">Découvrir <i data-lucide="arrow-up-right" aria-hidden="true"></i></span>
                    </button>
                </nav>
            </div>
        </section>
    `
};
