const TimelineView = {
    props: ['chapters', 'openChapterById', 'formatText'],

    setup(props) {
        // Une seule vue chronologique ; les parcours et critères sont facultatifs.
        const query = Vue.ref('');
        const periodFilter = Vue.ref('all');
        const tagFilter = Vue.ref('all');
        const activePathId = Vue.ref(null);
        const selectedEvent = Vue.ref(null);
        const visibleCounts = Vue.ref({});
        const PAGE_SIZE = 7;

        const periods = [
            { id: 'origins', label: 'Avant l’Hégire', short: 'Pré-Hégire', min: -9999, max: 0, color: '#64748b', icon: 'sunrise', description: 'Jeunesses, conversions, persécutions et premiers départs avant l’installation à Médine.' },
            { id: 'prophetic', label: 'Période prophétique', short: '1–10 H', min: 1, max: 10, color: '#0f766e', icon: 'moon-star', description: 'Hégire, construction de la communauté médinoise, expéditions et derniers enseignements.' },
            { id: 'rashidun', label: 'Califes bien guidés', short: '11–40 H', min: 11, max: 40, color: '#a16207', icon: 'landmark', description: 'Ridda, premières conquêtes, organisation du califat et grandes crises politiques.' },
            { id: 'umayyad', label: 'Période omeyyade', short: '41–132 H', min: 41, max: 132, color: '#b45309', icon: 'flag', description: 'Consolidation impériale, nouvelles générations et premiers grands foyers savants.' },
            { id: 'abbasid', label: 'Période abbasside', short: '132–656 H', min: 133, max: 656, color: '#7c3aed', icon: 'library', description: 'Institutionnalisation des sciences, circulation des œuvres et maturation des écoles.' },
            { id: 'postclassical', label: 'Après 656 H', short: 'Après 656 H', min: 657, max: 9998, color: '#2563eb', icon: 'route', description: 'Transmission, commentaires, réformes et renouvellements dans des contextes régionaux variés.' },
            { id: 'undated', label: 'Date à préciser', short: 'Non daté', min: 9999, max: 9999, color: '#94a3b8', icon: 'circle-dashed', description: 'Repères qualitatifs dont la date exacte n’est pas fournie dans la notice.' }
        ];

        const normalized = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr');
        const periodFor = id => periods.find(period => period.id === id) || periods[periods.length - 1];
        // Toute datation est issue du libellé documentaire ou du repère contextuel strict.
        // Aucune interpolation entre deux événements ni conversion grégorienne automatique.
        const allEvents = Vue.computed(() => {
            const result = [];
            (props.chapters || []).forEach(chapter => {
                (chapter.timeline || []).forEach((event, index) => {
                    if (!event || !event.desc) return;
                    const dating = ATHAR_CHRONOLOGY.resolve(event, chapter.id, index);
                    const reading = ATHAR_READING_PRESENTATION.timeline(chapter, event, index);
                    const sources = typeof BIOGRAPHY_SOURCES !== 'undefined' ? BIOGRAPHY_SOURCES[String(chapter.id)] : null;
                    const evidence = sources?.entries?.find(item => item.kind === 'timeline' && Number(item.id) === index) || null;
                    result.push({
                        id: `${chapter.id}-${index}`, ...dating,
                        rawYear: reading.readingYear || event.year || 'Non précisée', originalYear: event.year,
                        desc: reading.readingDesc, originalDesc: reading.readingContext,
                        evidence, fascicle: sources?.fascicle || '', sourceReadUrl: sources?.readUrl || '',
                        companionId: chapter.id, companionName: chapter.name, arabicName: chapter.arabicName || '',
                        subtitle: chapter.subtitle || '', intro: ATHAR_READING_PRESENTATION.intro(chapter), source: chapter.source || '',
                        tags: Array.isArray(chapter.tags) ? chapter.tags : [], isVerified: Boolean(chapter.verified), period: periodFor(dating.periodId)
                    });
                });
            });
            return result.sort((a, b) => (a.periodId === 'undated') - (b.periodId === 'undated') || a.sortYear - b.sortYear || a.companionName.localeCompare(b.companionName, 'fr'));
        });

        const tags = Vue.computed(() => [...new Set(allEvents.value.flatMap(item => item.tags))].sort((a, b) => a.localeCompare(b, 'fr')));
        const pathways = Vue.computed(() => {
            const idsFor = predicate => allEvents.value.filter(predicate).map(item => item.id);
            return [
                { id: 'prophetic-life', title: 'Autour de la période prophétique', subtitle: 'De la prédication à la fin de la mission prophétique', icon: 'moon-star', color: '#0f766e', description: 'Suivre les événements vécus par les Compagnons avant l’Hégire et pendant la formation de la communauté médinoise.', eventIds: idsFor(item => item.period.id === 'origins' || item.period.id === 'prophetic') },
                { id: 'caliphates', title: 'Califats et premières conquêtes', subtitle: 'De 11 à 41 H', icon: 'landmark', color: '#a16207', description: 'Observer les successions politiques, les campagnes, les responsabilités administratives et les premières discordes.', eventIds: idsFor(item => item.period.id === 'rashidun' || item.period.id === 'umayyad' && item.year === 41) },
                { id: 'women', title: 'Femmes, familles et transmission', subtitle: 'Mères des croyants et savantes', icon: 'users-round', color: '#be185d', description: 'Rassembler les repères associés aux Mères des croyants, aux femmes de la première génération et aux héritières du savoir.', eventIds: idsFor(item => item.tags.some(tag => /mères|femmes|savants/i.test(tag)) || /bint|oum |umm |sayyida|fatima|aisha|hafsa/i.test(normalized(item.companionName))) },
                { id: 'scholars', title: 'Des Compagnons aux héritiers', subtitle: 'Transmission sur plusieurs siècles', icon: 'library', color: '#7c3aed', description: 'Voir comment les notices tardives prolongent l’histoire des premières générations par l’enseignement et la transmission.', eventIds: idsFor(item => item.tags.includes('Savants') || (Number.isFinite(item.year) && item.year > 40)) }
            ].filter(path => path.eventIds.length);
        });
        const activePath = Vue.computed(() => pathways.value.find(item => item.id === activePathId.value) || null);
        const activePathIds = Vue.computed(() => new Set(activePath.value?.eventIds || []));
        const periodChoices = Vue.computed(() => periods.map(period => ({
            ...period,
            count: allEvents.value.filter(item => item.periodId === period.id).length
        })).filter(period => period.count));
        const filteredEvents = Vue.computed(() => {
            const needle = normalized(query.value.trim());
            return allEvents.value.filter(event => {
                if (periodFilter.value !== 'all' && event.periodId !== periodFilter.value) return false;
                if (tagFilter.value !== 'all' && !event.tags.includes(tagFilter.value)) return false;
                if (activePath.value && !activePathIds.value.has(event.id)) return false;
                return !needle || normalized([
                    event.rawYear, event.companionName, event.arabicName,
                    event.subtitle, event.desc, event.period.label, ...event.tags
                ].join(' ')).includes(needle);
            });
        });
        const groupedEvents = Vue.computed(() => periods.map(period => {
            const events = filteredEvents.value.filter(item => item.periodId === period.id);
            const limit = visibleCounts.value[period.id] || PAGE_SIZE;
            return {...period, events, visibleEvents:events.slice(0,limit),
                remaining:Math.max(0,events.length-limit)};
        }).filter(group => group.events.length));
        const stats = Vue.computed(() => ({
            events:allEvents.value.length,
            figures:new Set(allEvents.value.map(item => item.companionId)).size,
            undated:allEvents.value.filter(item => item.periodId === 'undated').length
        }));
        const currentPeriodName = Vue.computed(() => periodFilter.value === 'all'
            ? 'Tous les événements'
            : (periods.find(p => p.id === periodFilter.value)?.label || 'Les événements'));
        const hasFilters = Vue.computed(() => Boolean(query.value || periodFilter.value !== 'all'
            || tagFilter.value !== 'all' || activePathId.value));
        const preview = text => {
            const plain = String(text || '').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
            if (plain.length <= 192) return plain;
            const cut = plain.slice(0,193);
            return cut.slice(0,Math.max(120,cut.lastIndexOf(' '))).trimEnd() + '…';
        };
        const refreshIcons = () => Vue.nextTick(() => window.lucide?.createIcons());
        const clearFilters = () => {
            query.value = ''; periodFilter.value = 'all'; tagFilter.value = 'all';
            activePathId.value = null;
        };
        const selectPeriod = id => {
            if (id !== 'all' && !periods.some(item => item.id === id)) return;
            periodFilter.value = id;
            activePathId.value = null;
        };
        const showMore = group => {
            visibleCounts.value = {
                ...visibleCounts.value,
                [group.id]: (visibleCounts.value[group.id] || PAGE_SIZE) + PAGE_SIZE
            };
            refreshIcons();
        };
        const startPath = path => {
            activePathId.value = path.id;
            periodFilter.value = 'all';
            tagFilter.value = 'all';
            query.value = '';
            refreshIcons();
        };
        let previousFocus = null;
        const openEvent = event => {
            previousFocus = document.activeElement;
            selectedEvent.value = event;
            Vue.nextTick(() => {
                window.lucide?.createIcons();
                document.querySelector('.timeline-pro-drawer-close')?.focus();
            });
        };
        const closeEvent = (restoreFocus = true) => {
            selectedEvent.value = null;
            if (restoreFocus) Vue.nextTick(() => previousFocus?.isConnected && previousFocus.focus());
        };
        const openBiography = event => {
            closeEvent(false);
            props.openChapterById(event.companionId);
        };
        const onDialogKeydown = event => {
            if (!selectedEvent.value) return;
            if (event.key === 'Escape') {
                event.preventDefault();
                closeEvent();
            }
            if (event.key !== 'Tab') return;
            const dialog = document.querySelector('.timeline-pro-drawer');
            const items = [...(dialog?.querySelectorAll('button:not([disabled]),a[href],summary,[tabindex]:not([tabindex="-1"])') || [])]
                .filter(el => el.getClientRects().length);
            if (!items.length) return;
            const first=items[0], last=items[items.length-1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault(); last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault(); first.focus();
            }
        };
        Vue.watch([query,periodFilter,tagFilter,activePathId], () => {
            visibleCounts.value = {};
            refreshIcons();
        });
        Vue.onMounted(() => {
            document.addEventListener('keydown',onDialogKeydown);
            refreshIcons();
        });
        Vue.onUnmounted(() => document.removeEventListener('keydown',onDialogKeydown));

        return {
            query,periodFilter,tagFilter,activePathId,selectedEvent,periods,periodChoices,
            tags,pathways,activePath,filteredEvents,groupedEvents,stats,currentPeriodName,hasFilters,
            preview,clearFilters,selectPeriod,startPath,showMore,openEvent,closeEvent,openBiography
        };
    },
    template: `

    <section class="timeline-pro">
        <div class="timeline-pro-container">
            <header class="timeline-pro-hero">
                <span class="timeline-pro-eyebrow"><i data-lucide="milestone" aria-hidden="true"></i> Repères historiques</span>
                <h1>Le fil de <em>l’histoire</em></h1>
                <p>Parcourir les événements dans l’ordre, rencontrer celles et ceux qui les ont vécus, puis accéder à leur récit.</p>
                <div class="timeline-pro-hero-stats">
                    <span><strong>{{ stats.events }}</strong> événements</span>
                    <span aria-hidden="true">·</span>
                    <span><strong>{{ stats.figures }}</strong> figures historiques</span>
                </div>
            </header>

            <div class="timeline-pro-explore">
                <nav class="timeline-pro-periods" aria-label="Choisir une période">
                    <button type="button" :class="{active:periodFilter==='all' && !activePath}" :aria-pressed="periodFilter==='all' && !activePath" @click="selectPeriod('all')">
                        Toutes les périodes <small>{{ stats.events }}</small>
                    </button>
                    <button v-for="period in periodChoices" :key="period.id" type="button"
                        :class="{active:periodFilter===period.id}" :aria-pressed="periodFilter===period.id"
                        @click="selectPeriod(period.id)">
                        {{ period.label }} <small>{{ period.count }}</small>
                    </button>
                </nav>

                <div class="timeline-pro-toolbar">
                    <label class="timeline-pro-search">
                        <i data-lucide="search" aria-hidden="true"></i>
                        <input v-model="query" type="search" aria-label="Rechercher dans la chronologie"
                            placeholder="Rechercher une personne, un lieu, un événement…" autocomplete="off">
                        <button v-if="query" type="button" @click.prevent="query=''" aria-label="Effacer la recherche">
                            <i data-lucide="x" aria-hidden="true"></i>
                        </button>
                    </label>
                    <label class="timeline-pro-tag-filter">
                        <span>Catégorie</span>
                        <select v-model="tagFilter" aria-label="Filtrer les événements par catégorie">
                            <option value="all">Toutes</option>
                            <option v-for="tag in tags" :key="tag" :value="tag">{{ tag }}</option>
                        </select>
                    </label>
                    <button v-if="hasFilters" type="button" class="timeline-pro-reset" @click="clearFilters">
                        <i data-lucide="rotate-ccw" aria-hidden="true"></i> Effacer
                    </button>
                </div>

                <details class="timeline-pro-paths">
                    <summary><span><i data-lucide="route" aria-hidden="true"></i> Explorer un parcours thématique</span>
                        <i data-lucide="chevron-down" aria-hidden="true"></i>
                    </summary>
                    <div class="timeline-pro-path-list">
                        <button v-for="path in pathways" :key="path.id" type="button"
                            :class="{active:activePathId===path.id}" @click="startPath(path)">
                            <strong>{{ path.title }}</strong>
                            <span>{{ path.eventIds.length }} repères <i data-lucide="arrow-right" aria-hidden="true"></i></span>
                        </button>
                    </div>
                </details>
                <div v-if="activePath" class="timeline-pro-active-path">
                    <span><i data-lucide="route" aria-hidden="true"></i> Parcours : <strong>{{ activePath.title }}</strong></span>
                    <button type="button" @click="activePathId=null" aria-label="Quitter le parcours"><i data-lucide="x" aria-hidden="true"></i></button>
                </div>
            </div>

            <section class="timeline-pro-results" aria-label="Événements chronologiques">
                <header class="timeline-pro-results-header">
                    <div>
                        <span>À explorer</span>
                        <h2>{{ activePath ? activePath.title : currentPeriodName }}</h2>
                    </div>
                    <p aria-live="polite">{{ filteredEvents.length }} repère{{ filteredEvents.length>1?'s':'' }}</p>
                </header>
                <div v-if="!groupedEvents.length" class="timeline-pro-empty" role="status">
                    <i data-lucide="search-x" aria-hidden="true"></i>
                    <h3>Aucun événement trouvé</h3>
                    <p>Essaie un autre terme ou retire les filtres.</p>
                    <button type="button" @click="clearFilters">Tout afficher</button>
                </div>
                <div v-else class="timeline-pro-stream">
                    <section v-for="group in groupedEvents" :key="group.id" class="timeline-pro-period"
                        :id="'timeline-period-'+group.id" :style="{'--period-color':group.color}">
                        <header class="timeline-pro-period-head">
                            <span class="timeline-pro-period-icon" aria-hidden="true"><i :data-lucide="group.icon"></i></span>
                            <div>
                                <span class="timeline-pro-period-range">{{ group.short }}</span>
                                <h3>{{ group.label }}</h3>
                                <p>{{ group.description }}</p>
                            </div>
                            <span class="timeline-pro-period-total">{{ group.events.length }} repères</span>
                        </header>
                        <ol class="timeline-pro-event-list">
                            <li v-for="event in group.visibleEvents" :key="event.id" class="timeline-pro-event">
                                <span class="timeline-pro-date">{{ event.rawYear }}</span>
                                <span class="timeline-pro-dot" aria-hidden="true"></span>
                                <button type="button" class="timeline-pro-event-card" @click="openEvent(event)"
                                    :aria-label="'Lire le récit de '+event.companionName+', '+event.rawYear">
                                    <span class="timeline-pro-event-person">
                                        <strong>{{ event.companionName }}</strong>
                                        <span v-if="event.arabicName" class="timeline-pro-arabic" lang="ar" dir="rtl">{{ event.arabicName }}</span>
                                    </span>
                                    <span class="timeline-pro-event-summary">{{ preview(event.desc) }}</span>
                                    <span class="timeline-pro-event-bottom">
                                        <span>{{ event.subtitle || group.label }}</span>
                                        <b>Lire le récit <i data-lucide="arrow-right" aria-hidden="true"></i></b>
                                    </span>
                                </button>
                            </li>
                        </ol>
                        <button v-if="group.remaining" class="timeline-pro-more" type="button" @click="showMore(group)">
                            Afficher {{ Math.min(group.remaining,7) }} repères supplémentaires
                            <i data-lucide="chevron-down" aria-hidden="true"></i>
                        </button>
                    </section>
                </div>
                <details class="timeline-pro-method">
                    <summary>À propos des dates et des références <i data-lucide="chevron-down" aria-hidden="true"></i></summary>
                    <p>Les périodes correspondent aux repères disponibles dans les biographies. Certains événements n’ont pas d’année connue : ils sont regroupés dans « Date à préciser » sans datation inventée. Les sources et variantes sont accessibles dans chaque récit.</p>
                </details>
            </section>
        </div>

        <div v-if="selectedEvent" class="timeline-pro-backdrop" @click.self="closeEvent()">
            <article class="timeline-pro-drawer" role="dialog" aria-modal="true" :aria-label="'Récit historique : '+selectedEvent.companionName">
                <header class="timeline-pro-drawer-header">
                    <div>
                        <span class="timeline-pro-drawer-period">{{ selectedEvent.period.label }}</span>
                        <h2>{{ selectedEvent.rawYear }}</h2>
                    </div>
                    <button type="button" class="timeline-pro-drawer-close" @click="closeEvent()" aria-label="Fermer le récit">
                        <i data-lucide="x" aria-hidden="true"></i>
                    </button>
                </header>
                <div class="timeline-pro-drawer-scroll">
                    <section class="timeline-pro-drawer-person">
                        <span v-if="selectedEvent.arabicName" class="timeline-pro-drawer-arabic" lang="ar" dir="rtl">{{ selectedEvent.arabicName }}</span>
                        <h3>{{ selectedEvent.companionName }}</h3>
                        <p v-if="selectedEvent.subtitle">{{ selectedEvent.subtitle }}</p>
                    </section>
                    <section class="timeline-pro-drawer-event">
                        <h4>Le récit</h4>
                        <div class="timeline-pro-event-full" v-html="formatText(selectedEvent.desc)"></div>
                    </section>
                    <div v-if="selectedEvent.tags.length" class="timeline-pro-drawer-tags">
                        <span v-for="tag in selectedEvent.tags" :key="tag">{{ tag }}</span>
                    </div>
                    <details class="timeline-pro-reading-method">
                        <summary>Sources, variantes et fiabilité <i data-lucide="chevron-down" aria-hidden="true"></i></summary>
                        <div class="timeline-pro-reading-apparatus">
                            <p v-if="selectedEvent.originalDesc"><strong>Formulation documentaire et variantes :</strong> {{ selectedEvent.originalYear }} — {{ selectedEvent.originalDesc }}</p>
                            <p><strong>Précision de datation :</strong> {{ selectedEvent.dateBadge }}. {{ selectedEvent.detail }}</p>
                            <p v-if="selectedEvent.evidence?.note">{{ selectedEvent.evidence.note }}</p>
                            <p v-if="selectedEvent.evidence?.hadithRef"><strong>{{ selectedEvent.evidence.hadithRef }}</strong></p>
                            <p v-if="selectedEvent.evidence?.printedPage != null">Fascicule {{ selectedEvent.fascicle }}, p. {{ selectedEvent.evidence.printedPage }}</p>
                            <a v-if="selectedEvent.evidence?.externalUrl" :href="selectedEvent.evidence.externalUrl" target="_blank" rel="noopener noreferrer">Consulter la référence de l’événement</a>
                            <a v-if="selectedEvent.reference?.sourceUrl" :href="selectedEvent.reference.sourceUrl" target="_blank" rel="noopener noreferrer">{{ selectedEvent.reference.sourceTitle }}</a>
                            <p v-if="selectedEvent.reference?.note">{{ selectedEvent.reference.note }}</p>
                            <p v-if="selectedEvent.source"><strong>Ouvrage principal :</strong> {{ selectedEvent.source }}</p>
                            <a v-if="selectedEvent.sourceReadUrl" :href="selectedEvent.sourceReadUrl" target="_blank" rel="noopener noreferrer">Consulter la notice source (référence générale)</a>
                            <p>Athar présente les variantes sans attribuer une année qui n’est pas établie par la notice.</p>
                        </div>
                    </details>
                </div>
                <footer>
                    <button type="button" @click="openBiography(selectedEvent)">
                        <i data-lucide="book-open" aria-hidden="true"></i> Ouvrir la biographie
                        <i data-lucide="arrow-up-right" aria-hidden="true"></i>
                    </button>
                </footer>
            </article>
        </div>
    </section>
    `
};
