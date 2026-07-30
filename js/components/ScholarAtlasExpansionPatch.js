(() => {
    let attempts = 0;
    const applyPatch = () => {
        attempts += 1;
        if (typeof ScholarAtlasModule === 'undefined') {
            if (attempts < 300) setTimeout(applyPatch, 20);
            return;
        }
        if (ScholarAtlasModule.__atharExpandedV10) return;

        let template = ScholarAtlasModule.template;
        template = template.replace(
            `<nav class="scholar-atlas-drawer-tabs"><button :class="{ active: detailsTab === 'profile' }" @click="detailsTab = 'profile'">Profil</button><button :class="{ active: detailsTab === 'works' }" @click="detailsTab = 'works'">Œuvres</button><button :class="{ active: detailsTab === 'journey' }" @click="detailsTab = 'journey'">Géographie</button><button :class="{ active: detailsTab === 'sources' }" @click="detailsTab = 'sources'">Sources</button></nav>`,
            `<nav class="scholar-atlas-drawer-tabs scholar-atlas-expanded-tabs"><button :class="{ active: detailsTab === 'profile' }" @click="detailsTab = 'profile'">Portrait</button><button :class="{ active: detailsTab === 'formation' }" @click="detailsTab = 'formation'">Formation & méthode</button><button :class="{ active: detailsTab === 'network' }" @click="detailsTab = 'network'">Réseau savant</button><button :class="{ active: detailsTab === 'works' }" @click="detailsTab = 'works'">Œuvres</button><button :class="{ active: detailsTab === 'journey' }" @click="detailsTab = 'journey'">Géographie</button><button :class="{ active: detailsTab === 'sources' }" @click="detailsTab = 'sources'">Sources</button></nav>`
        );

        const profilePattern = /<section v-if="detailsTab === 'profile'" class="scholar-atlas-tab-content">[\s\S]*?<\/section>\s*<section v-else-if="detailsTab === 'works'"/;
        template = template.replace(profilePattern, `<section v-if="detailsTab === 'profile'" class="scholar-atlas-tab-content scholar-atlas-rich-profile">
                            <p class="scholar-atlas-lead">{{ selectedScholar.knownFor }}</p>
                            <div class="scholar-atlas-reading-block"><span>Biographie</span><p>{{ selectedScholar.bio }}</p></div>
                            <div class="scholar-atlas-fact-grid"><div><i data-lucide="calendar"></i><span>Vie</span><strong>{{ lifeLabel(selectedScholar) }}</strong></div><div><i data-lucide="map-pin"></i><span>Foyer principal</span><strong>{{ selectedScholar.cityData?.name }}</strong></div><div><i data-lucide="landmark"></i><span>École ou milieu</span><strong>{{ selectedScholar.school }}</strong></div><div><i data-lucide="book-open"></i><span>Disciplines</span><strong>{{ selectedScholar.disciplines.map(disciplineLabel).join(', ') }}</strong></div></div>
                            <div class="scholar-atlas-reading-block"><span>Contexte historique</span><p>{{ selectedScholar.context }}</p></div>
                            <div class="scholar-atlas-legacy"><i data-lucide="sparkles"></i><div><strong>Héritage intellectuel</strong><p>{{ selectedScholar.legacy }}</p></div></div>
                            <div class="scholar-atlas-question-list"><span>Questions pour approfondir</span><article v-for="(question, index) in selectedScholar.studyQuestions" :key="question"><b>{{ index + 1 }}</b><p>{{ question }}</p></article></div>
                        </section>
                        <section v-else-if="detailsTab === 'formation'" class="scholar-atlas-tab-content">
                            <div class="scholar-atlas-reading-block"><span>Formation</span><p>{{ selectedScholar.formation }}</p></div>
                            <div class="scholar-atlas-reading-block"><span>Méthode de travail</span><p>{{ selectedScholar.method }}</p></div>
                            <div class="scholar-atlas-timeline"><article v-for="item in selectedScholar.milestones" :key="item.label"><b>{{ item.label }}</b><p>{{ item.text }}</p></article></div>
                            <div class="scholar-atlas-editorial scholar-atlas-debate"><i data-lucide="messages-square"></i><div><strong>Débats et précautions</strong><p>{{ selectedScholar.debates }}</p></div></div>
                        </section>
                        <section v-else-if="detailsTab === 'network'" class="scholar-atlas-tab-content">
                            <div class="scholar-atlas-network-grid">
                                <article><span><i data-lucide="user-round-check"></i> Maîtres et influences</span><div v-if="selectedScholar.teachers.length" class="scholar-atlas-name-list"><p v-for="name in selectedScholar.teachers" :key="name">{{ name }}</p></div><p v-else class="scholar-atlas-muted">Réseau précis à documenter dans les dictionnaires biographiques.</p></article>
                                <article><span><i data-lucide="users-round"></i> Élèves et continuateurs</span><div v-if="selectedScholar.students.length" class="scholar-atlas-name-list"><p v-for="name in selectedScholar.students" :key="name">{{ name }}</p></div><p v-else class="scholar-atlas-muted">L’influence est surtout connue par les œuvres ou la réception ultérieure.</p></article>
                                <article><span><i data-lucide="school"></i> Lieux et institutions</span><div class="scholar-atlas-name-list"><p v-for="name in selectedScholar.institutions" :key="name">{{ name }}</p></div></article>
                            </div>
                            <div class="scholar-atlas-keywords"><span>Notions à retenir</span><div><b v-for="term in selectedScholar.keyTerms" :key="term">{{ term }}</b></div></div>
                            <p class="scholar-atlas-note"><i data-lucide="info"></i> Les liens maître-élève explicitement affichés sont sélectifs. Une influence intellectuelle ne signifie pas toujours une rencontre directe.</p>
                        </section>
                        <section v-else-if="detailsTab === 'works'"`);

        const worksPattern = /<section v-else-if="detailsTab === 'works'" class="scholar-atlas-tab-content">[\s\S]*?<\/section>\s*<section v-else-if="detailsTab === 'journey'"/;
        template = template.replace(worksPattern, `<section v-else-if="detailsTab === 'works'" class="scholar-atlas-tab-content">
                            <div v-if="selectedScholar.workNotes.length" class="scholar-atlas-work-list scholar-atlas-expanded-works"><div v-for="(work, index) in selectedScholar.workNotes" :key="work.title"><b>{{ String(index + 1).padStart(2, '0') }}</b><span><strong>{{ work.title }}</strong><small>{{ work.note }}</small></span></div></div>
                            <div v-else class="scholar-atlas-empty-tab"><i data-lucide="library"></i><p>Aucune œuvre précise n’est affichée : l’influence de cette figure repose principalement sur l’enseignement oral, la pratique ou la transmission.</p></div>
                            <div class="scholar-atlas-reading-block"><span>Comment étudier ses œuvres ?</span><p>Commencer par identifier le genre du texte, sa date, son état de conservation et ses commentaires. Comparer ensuite une édition critique, une traduction éventuelle et les usages qu’en ont faits les écoles postérieures.</p></div>
                        </section>
                        <section v-else-if="detailsTab === 'journey'"`);

        ScholarAtlasModule.template = template;
        ScholarAtlasModule.__atharExpandedV10 = true;
    };
    applyPatch();
})();
