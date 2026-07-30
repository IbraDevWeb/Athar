const TimelineView = {
    props: ['chapters', 'openChapterById', 'formatText'],

    setup(props) {
        const mode = Vue.ref('timeline');
        const query = Vue.ref('');
        const periodFilter = Vue.ref('all');
        const tagFilter = Vue.ref('all');
        const activePathId = Vue.ref(null);
        const density = Vue.ref('comfortable');
        const selectedEvent = Vue.ref(null);

        const periods = [
            { id: 'origins', label: 'Avant l’Hégire', short: 'Pré-Hégire', min: -9999, max: 0, color: '#64748b', icon: 'sunrise', description: 'Jeunesses, conversions, persécutions et premiers départs avant l’installation à Médine.' },
            { id: 'prophetic', label: 'Période prophétique', short: '1–11 H', min: 1, max: 11, color: '#0f766e', icon: 'moon-star', description: 'Hégire, construction de la communauté médinoise, expéditions et derniers enseignements.' },
            { id: 'rashidun', label: 'Califes bien guidés', short: '11–40 H', min: 12, max: 40, color: '#a16207', icon: 'landmark', description: 'Ridda, premières conquêtes, organisation du califat et grandes crises politiques.' },
            { id: 'umayyad', label: 'Période omeyyade', short: '41–132 H', min: 41, max: 132, color: '#b45309', icon: 'flag', description: 'Consolidation impériale, nouvelles générations et premiers grands foyers savants.' },
            { id: 'abbasid', label: 'Période abbasside', short: '132–656 H', min: 133, max: 656, color: '#7c3aed', icon: 'library', description: 'Institutionnalisation des sciences, circulation des œuvres et maturation des écoles.' },
            { id: 'postclassical', label: 'Après 656 H', short: 'Après 656 H', min: 657, max: 9998, color: '#2563eb', icon: 'route', description: 'Transmission, commentaires, réformes et renouvellements dans des contextes régionaux variés.' },
            { id: 'undated', label: 'Date à préciser', short: 'Non daté', min: 9999, max: 9999, color: '#94a3b8', icon: 'circle-dashed', description: 'Repères qualitatifs dont la date exacte n’est pas fournie dans la notice.' }
        ];

        const normalized = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr');
        const explicitHijri = value => {
            const match = normalized(value).match(/(?:^|\D)(\d{1,4})\s*(?:h|hijr)/);
            return match ? Number(match[1]) : null;
        };
        const chapterAnchors = chapter => {
            const exact = (chapter.timeline || []).map(item => explicitHijri(`${item.year} ${item.desc}`)).filter(Number.isFinite);
            return exact.length ? { min: Math.min(...exact), max: Math.max(...exact) } : { min: null, max: null };
        };
        const inferYear = (event, chapter) => {
            const combined = normalized(`${event.year} ${event.desc}`);
            const exact = explicitHijri(`${event.year} ${event.desc}`);
            if (Number.isFinite(exact)) return exact;
            const anchors = chapterAnchors(chapter);
            const named = [
                [/hegire|qouba|quba|aqaba/, 1], [/badr/, 2], [/ouhoud|uhud/, 3], [/raji|bi.?r ma.?una/, 4],
                [/fosse|khandaq|ahzab/, 5], [/hudaybiya|houdaybiya/, 6], [/khaybar/, 7],
                [/mouta|mu.?ta|conquete de la mecque|hunayn/, 8], [/tabouk|tabuk/, 9], [/pelerinage d.?adieu/, 10],
                [/mort du prophete|deces du prophete|saqifa/, 11], [/ridda|yamama|abou bakr/, 12],
                [/yarmouk|qadisiyya|cadisiyya/, 15], [/chameau|al-jamal/, 36], [/siffine|siffin/, 37], [/muawiya/, 41]
            ];
            const namedMatch = named.find(([pattern]) => pattern.test(combined));
            if (namedMatch) return namedMatch[1];
            if (/avant|pre-islam|jahili|mecque|conversion|persecution|abyssinie|exil/.test(combined)) {
                if (anchors.min && anchors.min > 80) return Math.max(1, anchors.min - 35);
                return -5;
            }
            if (/naissance|enfance|jeunesse|formation/.test(combined)) {
                if (anchors.min && anchors.min > 40) return Math.max(1, anchors.min - 40);
                return -10;
            }
            if (/mariage|installation|enseignement/.test(combined) && anchors.max) return Math.max(1, anchors.max - 20);
            if (/mort|deces|disparition/.test(combined) && anchors.max) return anchors.max;
            const leadingNumber = normalized(event.year).match(/^(\d{1,4})/);
            return leadingNumber ? Number(leadingNumber[1]) : 9999;
        };
        const periodFor = year => periods.find(item => year >= item.min && year <= item.max) || periods[periods.length - 1];
        const gregorianApprox = year => {
            if (!Number.isFinite(year) || year === 9999) return 'Date à préciser';
            if (year <= 0) return `≈ ${Math.round(622 + year)}`;
            return `≈ ${Math.round(621.5774 + year * 0.970224)}`;
        };

        const allEvents = Vue.computed(() => {
            const result = [];
            (props.chapters || []).forEach(chapter => {
                (chapter.timeline || []).forEach((event, index) => {
                    if (!event || !event.desc) return;
                    const year = inferYear(event, chapter);
                    result.push({
                        id: `${chapter.id}-${index}`, year, rawYear: event.year || 'Date à préciser', gregorian: gregorianApprox(year),
                        desc: event.desc, companionId: chapter.id, companionName: chapter.name, arabicName: chapter.arabicName || '',
                        subtitle: chapter.subtitle || '', intro: chapter.intro || '', source: chapter.source || '',
                        tags: Array.isArray(chapter.tags) ? chapter.tags : [], isVerified: Boolean(chapter.verified), period: periodFor(year)
                    });
                });
            });
            return result.sort((a, b) => a.year - b.year || a.companionName.localeCompare(b.companionName, 'fr'));
        });

        const tags = Vue.computed(() => [...new Set(allEvents.value.flatMap(item => item.tags))].sort((a, b) => a.localeCompare(b, 'fr')));
        const pathways = Vue.computed(() => {
            const idsFor = predicate => allEvents.value.filter(predicate).map(item => item.id);
            return [
                { id: 'prophetic-life', title: 'Autour de la période prophétique', subtitle: 'Des premières conversions à 11 H', icon: 'moon-star', color: '#0f766e', description: 'Suivre les événements vécus par les Compagnons avant l’Hégire et pendant la formation de la communauté médinoise.', eventIds: idsFor(item => item.year <= 11) },
                { id: 'caliphates', title: 'Califats et premières conquêtes', subtitle: 'De 11 à 41 H', icon: 'landmark', color: '#a16207', description: 'Observer les successions politiques, les campagnes, les responsabilités administratives et les premières discordes.', eventIds: idsFor(item => item.year >= 11 && item.year <= 41) },
                { id: 'women', title: 'Femmes, familles et transmission', subtitle: 'Mères des croyants et savantes', icon: 'users-round', color: '#be185d', description: 'Rassembler les repères associés aux Mères des croyants, aux femmes de la première génération et aux héritières du savoir.', eventIds: idsFor(item => item.tags.some(tag => /mères|femmes|savants/i.test(tag)) || /bint|oum |umm |sayyida|fatima|aisha|hafsa/i.test(normalized(item.companionName))) },
                { id: 'scholars', title: 'Des Compagnons aux héritiers', subtitle: 'Transmission sur plusieurs siècles', icon: 'library', color: '#7c3aed', description: 'Voir comment les notices tardives prolongent l’histoire des premières générations par l’enseignement et la transmission.', eventIds: idsFor(item => item.tags.includes('Savants') || item.year > 40) }
            ].filter(path => path.eventIds.length);
        });
        const activePath = Vue.computed(() => pathways.value.find(item => item.id === activePathId.value) || null);
        const activePathIds = Vue.computed(() => new Set(activePath.value?.eventIds || []));
        const filteredEvents = Vue.computed(() => {
            const needle = normalized(query.value.trim());
            return allEvents.value.filter(item => {
                if (periodFilter.value !== 'all' && item.period.id !== periodFilter.value) return false;
                if (tagFilter.value !== 'all' && !item.tags.includes(tagFilter.value)) return false;
                if (activePath.value && !activePathIds.value.has(item.id)) return false;
                if (!needle) return true;
                return normalized([item.rawYear, item.companionName, item.arabicName, item.subtitle, item.desc, item.period.label, ...item.tags].join(' ')).includes(needle);
            });
        });
        const groupedEvents = Vue.computed(() => periods.map(period => ({ ...period, events: filteredEvents.value.filter(item => item.period.id === period.id) })).filter(group => group.events.length));
        const stats = Vue.computed(() => {
            const dated = allEvents.value.filter(item => item.year !== 9999);
            return { events: allEvents.value.length, figures: new Set(allEvents.value.map(item => item.companionId)).size, periods: new Set(dated.map(item => item.period.id)).size, first: dated[0]?.rawYear || '—', last: dated[dated.length - 1]?.rawYear || '—' };
        });
        const eraSummaries = Vue.computed(() => periods.map(period => {
            const events = allEvents.value.filter(item => item.period.id === period.id);
            return { ...period, events, figures: [...new Set(events.map(item => item.companionName))], count: events.length };
        }).filter(item => item.count));

        const clearFilters = () => { query.value = ''; periodFilter.value = 'all'; tagFilter.value = 'all'; activePathId.value = null; };
        const openEvent = event => { selectedEvent.value = event; Vue.nextTick(() => window.lucide?.createIcons()); };
        const closeEvent = () => { selectedEvent.value = null; };
        const openBiography = event => { closeEvent(); props.openChapterById(event.companionId); };
        const setMode = value => { mode.value = value; Vue.nextTick(() => window.lucide?.createIcons()); };
        const selectPeriod = id => {
            periodFilter.value = id;
            mode.value = 'timeline';
            Vue.nextTick(() => { document.getElementById(`timeline-period-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); window.lucide?.createIcons(); });
        };
        const startPath = path => { activePathId.value = path.id; periodFilter.value = 'all'; tagFilter.value = 'all'; query.value = ''; mode.value = 'timeline'; Vue.nextTick(() => window.lucide?.createIcons()); };
        Vue.watch([mode, query, periodFilter, tagFilter, activePathId, density], () => Vue.nextTick(() => window.lucide?.createIcons()));
        Vue.onMounted(() => Vue.nextTick(() => window.lucide?.createIcons()));

        return { mode, query, periodFilter, tagFilter, activePathId, density, selectedEvent, periods, tags, pathways, activePath, filteredEvents, groupedEvents, stats, eraSummaries, clearFilters, openEvent, closeEvent, openBiography, setMode, selectPeriod, startPath };
    },

    template: `
    <section class="timeline-pro">
        <div class="timeline-pro-container">
            <header class="timeline-pro-hero">
                <div class="timeline-pro-hero-copy">
                    <span class="timeline-pro-eyebrow"><i data-lucide="history"></i> Histoire structurée</span>
                    <h1>Frise <em>chronologique</em></h1>
                    <p>Parcourez les événements par période, personnage et thème. Les dates imprécises sont signalées comme des repères pédagogiques et non comme des datations définitives.</p>
                    <div class="timeline-pro-actions"><button class="timeline-pro-primary" @click="setMode('timeline')"><i data-lucide="list-tree"></i> Explorer la chronologie</button><button class="timeline-pro-secondary" @click="setMode('paths')"><i data-lucide="route"></i> Parcours guidés</button></div>
                </div>
                <aside class="timeline-pro-stats"><div><strong>{{ stats.events }}</strong><span>événements</span></div><div><strong>{{ stats.figures }}</strong><span>figures</span></div><div><strong>{{ stats.periods }}</strong><span>périodes</span></div><div><strong>{{ stats.first }}</strong><span>premier repère</span></div></aside>
            </header>

            <nav class="timeline-pro-modes" aria-label="Modes de la frise"><button :class="{active:mode==='timeline'}" @click="setMode('timeline')"><i data-lucide="milestone"></i> Chronologie</button><button :class="{active:mode==='eras'}" @click="setMode('eras')"><i data-lucide="columns-3"></i> Périodes</button><button :class="{active:mode==='paths'}" @click="setMode('paths')"><i data-lucide="route"></i> Parcours</button></nav>

            <div class="timeline-pro-toolbar">
                <label class="timeline-pro-search"><i data-lucide="search"></i><input v-model="query" type="search" placeholder="Personnage, événement, bataille, ville…"></label>
                <select v-model="periodFilter" aria-label="Filtrer par période"><option value="all">Toutes les périodes</option><option v-for="period in periods" :key="period.id" :value="period.id">{{ period.label }}</option></select>
                <select v-model="tagFilter" aria-label="Filtrer par catégorie"><option value="all">Toutes les catégories</option><option v-for="tag in tags" :key="tag" :value="tag">{{ tag }}</option></select>
                <button class="timeline-pro-density" @click="density=density==='compact'?'comfortable':'compact'" :title="density==='compact'?'Affichage aéré':'Affichage compact'"><i :data-lucide="density==='compact'?'rows-3':'list-collapse'"></i></button>
                <button v-if="query||periodFilter!=='all'||tagFilter!=='all'||activePathId" class="timeline-pro-reset" @click="clearFilters"><i data-lucide="rotate-ccw"></i> Réinitialiser</button>
            </div>

            <div v-if="activePath" class="timeline-pro-active-path" :style="{'--path-color':activePath.color}"><i :data-lucide="activePath.icon"></i><div><span>Parcours actif</span><strong>{{ activePath.title }}</strong><small>{{ filteredEvents.length }} repères sélectionnés</small></div><button @click="activePathId=null"><i data-lucide="x"></i></button></div>

            <section v-if="mode==='timeline'" class="timeline-pro-workspace" :class="'is-'+density">
                <aside class="timeline-pro-period-rail">
                    <header><span>Naviguer</span><strong>{{ filteredEvents.length }} résultats</strong></header>
                    <button v-for="period in periods" :key="period.id" :class="{active:periodFilter===period.id}" @click="selectPeriod(period.id)"><i :data-lucide="period.icon" :style="{color:period.color}"></i><span><strong>{{ period.label }}</strong><small>{{ period.short }}</small></span></button>
                    <div class="timeline-pro-method-note"><i data-lucide="info"></i><p>Les équivalences grégoriennes sont approximatives. Ouvrez une fiche pour revenir au contexte biographique.</p></div>
                </aside>
                <div class="timeline-pro-stream">
                    <div v-if="!groupedEvents.length" class="timeline-pro-empty"><i data-lucide="calendar-x"></i><strong>Aucun événement trouvé</strong><p>Modifiez les filtres ou réinitialisez la recherche.</p><button @click="clearFilters">Tout afficher</button></div>
                    <section v-for="group in groupedEvents" :key="group.id" class="timeline-pro-period" :id="'timeline-period-'+group.id" :style="{'--period-color':group.color}">
                        <header class="timeline-pro-period-head"><span class="timeline-pro-period-icon"><i :data-lucide="group.icon"></i></span><div><small>{{ group.short }}</small><h2>{{ group.label }}</h2><p>{{ group.description }}</p></div><b>{{ group.events.length }}</b></header>
                        <div class="timeline-pro-event-list">
                            <article v-for="event in group.events" :key="event.id" class="timeline-pro-event" @click="openEvent(event)">
                                <div class="timeline-pro-date"><strong>{{ event.rawYear }}</strong><small>{{ event.gregorian }}</small></div><span class="timeline-pro-dot"></span>
                                <button class="timeline-pro-event-card"><div class="timeline-pro-event-person"><span class="timeline-pro-arabic">{{ event.arabicName }}</span><div><small>{{ event.subtitle || group.label }}</small><h3>{{ event.companionName }}</h3></div><i v-if="event.isVerified" data-lucide="badge-check"></i></div><p v-html="formatText(event.desc)"></p><footer><span v-for="tag in event.tags.slice(0,3)" :key="tag">{{ tag }}</span><b>Voir le détail <i data-lucide="arrow-up-right"></i></b></footer></button>
                            </article>
                        </div>
                    </section>
                </div>
            </section>

            <section v-if="mode==='eras'" class="timeline-pro-era-view"><header class="timeline-pro-section-heading"><div><span>Lecture par grandes périodes</span><h2>Comprendre les changements de contexte</h2></div><p>Chaque période regroupe les événements disponibles dans les biographies de la bibliothèque.</p></header><div class="timeline-pro-era-grid"><article v-for="era in eraSummaries" :key="era.id" :style="{'--period-color':era.color}"><div class="timeline-pro-era-top"><span><i :data-lucide="era.icon"></i></span><b>{{ era.short }}</b></div><h3>{{ era.label }}</h3><p>{{ era.description }}</p><div class="timeline-pro-era-metrics"><span><strong>{{ era.count }}</strong> événements</span><span><strong>{{ era.figures.length }}</strong> figures</span></div><div class="timeline-pro-era-figures"><span v-for="name in era.figures.slice(0,5)" :key="name">{{ name }}</span><small v-if="era.figures.length>5">+ {{ era.figures.length-5 }} autres</small></div><button @click="selectPeriod(era.id)"><i data-lucide="arrow-right"></i> Explorer cette période</button></article></div></section>

            <section v-if="mode==='paths'" class="timeline-pro-path-view"><header class="timeline-pro-section-heading"><div><span>Parcours guidés</span><h2>Suivre un fil historique</h2></div><p>Des sélections éditoriales pour éviter de se perdre dans l’ensemble des événements.</p></header><div class="timeline-pro-path-grid"><article v-for="path in pathways" :key="path.id" :style="{'--path-color':path.color}"><span class="timeline-pro-path-icon"><i :data-lucide="path.icon"></i></span><small>{{ path.eventIds.length }} repères</small><h3>{{ path.title }}</h3><b>{{ path.subtitle }}</b><p>{{ path.description }}</p><button @click="startPath(path)"><i data-lucide="play"></i> Commencer le parcours</button></article></div></section>
        </div>

        <div v-if="selectedEvent" class="timeline-pro-backdrop" @click.self="closeEvent"><article class="timeline-pro-drawer" :style="{'--period-color':selectedEvent.period.color}"><header><span><i :data-lucide="selectedEvent.period.icon"></i></span><div><small>{{ selectedEvent.period.label }}</small><h2>{{ selectedEvent.rawYear }}</h2><p>{{ selectedEvent.gregorian }} de l’ère commune</p></div><button @click="closeEvent"><i data-lucide="x"></i></button></header><div class="timeline-pro-drawer-scroll"><section class="timeline-pro-drawer-person"><p class="timeline-pro-drawer-arabic">{{ selectedEvent.arabicName }}</p><span>{{ selectedEvent.subtitle }}</span><h3>{{ selectedEvent.companionName }}</h3><p>{{ selectedEvent.intro }}</p></section><section class="timeline-pro-drawer-event"><span>Événement</span><p v-html="formatText(selectedEvent.desc)"></p></section><div class="timeline-pro-drawer-tags"><span v-for="tag in selectedEvent.tags" :key="tag">{{ tag }}</span></div><section v-if="selectedEvent.source" class="timeline-pro-source"><i data-lucide="book-check"></i><div><span>Source principale de la notice</span><strong>{{ selectedEvent.source }}</strong></div></section><p class="timeline-pro-caution"><i data-lucide="triangle-alert"></i> Cette frise réorganise les repères présents dans les fiches. Une date inférée ou approximative doit être contrôlée dans les sources historiques spécialisées.</p></div><footer><button @click="openBiography(selectedEvent)"><i data-lucide="book-open"></i> Ouvrir la biographie complète</button></footer></article></div>
    </section>`
};