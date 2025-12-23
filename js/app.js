// Fichier: js/app.js (Version corrigée et complète)
const { createApp, ref, computed, onMounted, onUnmounted, watch } = Vue;

const app = createApp({
    components: {
        'home-view': HomeView,
        'timeline-view': TimelineView,
        'library-view': LibraryView,
        'glossary-view': GlossaryView,
        'hadiths-view': HadithsView,
        'hadith-reader-view': HadithReaderView,
        'tabib-view': TabibView,
        'tabib-detail-view': TabibDetailView,
        'adhkar-view': AdhkarView,
        'adhkar-reader-view': AdhkarReaderView,
        'reader-view': ReaderView,
        'transmission-view': TransmissionView,
        'atlas-view': AtlasView,
        'ussul-view': UssulView,
        'prophetic-clock-view': PropheticClockView,
        'relations-view': RelationsView,
        'revelation-view': RevelationView,
        'tool-view': ToolView
    },
    setup() {
        // --- INITIALIZATION ---
        const dataError = ref(false);
        let safeChapters = [];
        let safeGlossary = {};
        let safeHadiths = [];
        let safeUssul = [];
        let safeSilsila = [];
        let safeSilsilaThemes = {};

        try {
            // Vérification des variables globales
            if (typeof CHAPTERS_DATA === 'undefined') throw new Error("Les données biographies sont introuvables.");
            safeChapters = CHAPTERS_DATA;
            safeGlossary = (typeof GLOSSARY_DATA !== 'undefined') ? GLOSSARY_DATA : {};
            safeHadiths = (typeof STORED_HADITHS !== 'undefined') ? STORED_HADITHS : [];
            safeUssul = (typeof USSUL_LESSONS !== 'undefined') ? USSUL_LESSONS : [];
            safeSilsila = (typeof SILSILA_DATA !== 'undefined') ? SILSILA_DATA : [];
            safeSilsilaThemes = (typeof SILSILA_THEMES !== 'undefined') ? SILSILA_THEMES : {};
        } catch (e) {
            console.error("Critical Data Error:", e);
            dataError.value = true;
        }

        // --- REACTIVE STATE ---
        const viewMode = ref('home'); // Vue par défaut : Accueil
        const headerSearchQuery = ref('');
        const currentChapter = ref(null);
        const currentHadith = ref(null);
        const activeStoryId = ref(null);
        const mobileMenuOpen = ref(false);
        const showTasbih = ref(false);
        const tasbihCount = ref(0);
        const viewFilter = ref('all');
        const activeCategory = ref('Tous');
        const readingProgress = ref(0);
        const visibleCount = ref(12);
        const mainScroll = ref(null);
        const quizAnswers = ref({});
        const toasts = ref([]);
        
        // États pour Tabib
        const currentRemedy = ref(null);
        const tabibFilter = ref('Tous');
        const tabibCategories = ['Tous', 'Tristesse', 'Anxiété', 'Colère', 'Famille', 'Protection', 'Foi'];
        const showBreathing = ref(false);
        const breathState = ref('inhale');
        const breathText = ref('Inspirez');

        // --- SETTINGS ---
        const settings = ref({ darkMode: false, fontSize: 18, favorites: [], lastReadId: null });
        const categories = ref(['Tous', 'Califes', '10 Promis', 'Ahl al-Bayt', 'Muhajirun', 'Ansar', 'Commandants', 'Savants', 'Martyrs', 'Mères des Croyants', 'Badr', 'Ouhoud']);

        // --- COMPUTED: Unified Global Timeline ---
        const globalTimeline = computed(() => {
             let events = [];
             Object.entries(safeGlossary).forEach(([key, val]) => {
                const match = val.origin.match(/(\d+)\s*H/i);
                if (match) events.push({ year: parseInt(match[1]), yearLabel: match[0], title: key.charAt(0).toUpperCase() + key.slice(1), desc: val.def, type: 'glossary', linkId: null });
             });
             safeChapters.forEach(chap => {
                chap.timeline.forEach(t => {
                    const rawYear = t.year.toLowerCase().trim();
                    const numMatch = rawYear.match(/(\d+)/);
                    const val = numMatch ? parseInt(numMatch[1]) : 0;
                    let sortYear = (rawYear.includes('av') || rawYear.includes('pré')) ? (val > 0 ? -val : -100) : val;
                    events.push({ year: sortYear, yearLabel: t.year, title: `${chap.name} (${t.year})`, desc: t.desc, type: 'chapter', linkId: chap.id });
                });
             });
             return events.sort((a, b) => a.year - b.year);
        });

        // --- COMPUTED: Filtered Glossary ---
        const filteredGlossary = computed(() => {
            let list = Object.entries(safeGlossary).map(([key, val]) => ({ term: key, ...val }));
            if (headerSearchQuery.value && viewMode.value === 'glossary') {
                const q = headerSearchQuery.value.toLowerCase();
                list = list.filter(i => i.term.toLowerCase().includes(q) || i.def.toLowerCase().includes(q));
            }
            return list.sort((a, b) => a.term.localeCompare(b.term));
        });

        // --- COMPUTED: Filtered Hadiths ---
        const filteredHadiths = computed(() => {
            let list = safeHadiths;
            if (headerSearchQuery.value && viewMode.value === 'hadiths') {
                const q = headerSearchQuery.value.toLowerCase();
                list = list.filter(h => 
                    h.title.toLowerCase().includes(q) || 
                    h.hadeeth.toLowerCase().includes(q) ||
                    h.explanation.toLowerCase().includes(q)
                );
            }
            return list;
        });

        // --- COMPUTED: Filtered Adhkar ---
        const adhkarCategories = ref(['Tous', 'Matin', 'Soir', 'Sommeil', 'Prière', 'Maison']);
        const activeAdhkarCategory = ref('Tous');

        const filteredAdhkar = computed(() => {
            let data = (typeof ADHKAR_DATA !== 'undefined') ? ADHKAR_DATA : [];
            
            if (activeAdhkarCategory.value !== 'Tous') {
                data = data.filter(a => a.category === activeAdhkarCategory.value);
            }

            if (headerSearchQuery.value && viewMode.value === 'adhkar') {
                const q = headerSearchQuery.value.toLowerCase();
                data = data.filter(a => 
                    a.title.toLowerCase().includes(q) || 
                    a.translation.toLowerCase().includes(q) ||
                    a.category.toLowerCase().includes(q)
                );
            }
            return data;
        });

        // --- LOGIQUE COMPTEUR ADHKAR ---
        const adhkarCounts = ref({});

        const handleDhikrClick = (id, target) => {
            if (adhkarCounts.value[id] === undefined) {
                adhkarCounts.value[id] = 0;
            }

            if (adhkarCounts.value[id] < target) {
                adhkarCounts.value[id]++;
                if (navigator.vibrate) navigator.vibrate(10);

                if (adhkarCounts.value[id] === target) {
                    if (navigator.vibrate) navigator.vibrate([50, 50, 50]); 
                    showToast("Dhikr terminé !", "check-circle");
                }
            } else {
                adhkarCounts.value[id] = 0;
                if (navigator.vibrate) navigator.vibrate(20);
            }
        };

        const getProgress = (id, target) => {
            const current = adhkarCounts.value[id] || 0;
            return Math.min((current / target) * 100, 100);
        };

        const copyText = (text) => {
            navigator.clipboard.writeText(text);
            showToast("Texte copié !", "copy");
        };

        // --- COMPUTED: Filtered Remedies (Tabib) ---
        const filteredRemedies = computed(() => {
            let data = (typeof TABIB_DATA !== 'undefined') ? TABIB_DATA : [];
            
            if (tabibFilter.value !== 'Tous') {
                const map = {
                    'Tristesse': ['Tristesse', 'Peine', 'Dépression', 'Solitude', 'Deuil'],
                    'Anxiété': ['Stress', 'Peur', 'Avenir', 'Doute', 'Waswas'],
                    'Colère': ['Colère', 'Haine', 'Conflit', 'Rancune'],
                    'Famille': ['Couple', 'Mariage', 'Enfant', 'Famille'],
                    'Protection': ['Protection', 'Oeil', 'Jalousie', 'Sorcellerie'],
                    'Foi': ['Foi', 'Prière', 'Repentir', 'Péchés', 'Kibr']
                };
                const targetTags = map[tabibFilter.value] || [tabibFilter.value];
                data = data.filter(r => r.tags.some(t => targetTags.includes(t)));
            }

            if (headerSearchQuery.value && viewMode.value === 'tabib') {
                const q = headerSearchQuery.value.toLowerCase();
                if (window.Fuse) {
                     const fuse = new Fuse(data, { keys: ['title', 'tags', 'intro', 'quran.fr'], threshold: 0.3 });
                     return fuse.search(q).map(r => r.item);
                } else {
                     return data.filter(r => r.title.toLowerCase().includes(q) || r.intro.toLowerCase().includes(q));
                }
            }
            return data;
        });

        // --- COMPUTED: Filtered Chapters ---
        const filteredChapters = computed(() => {
            let data = safeChapters;
            if (activeCategory.value !== 'Tous') data = data.filter(c => c.tags.includes(activeCategory.value));
            if (viewFilter.value === 'favorites') data = data.filter(c => settings.value.favorites.includes(c.id));
            
            if (headerSearchQuery.value && viewMode.value === 'library') {
                if (window.Fuse) {
                    const fuseOptions = { 
                        keys: [
                            { name: 'name', weight: 0.4 },
                            { name: 'arabicName', weight: 0.2 },
                            { name: 'intro', weight: 0.2 },
                            { name: 'tags', weight: 0.2 },
                            { name: 'narratives.title', weight: 0.1 },
                            { name: 'narratives.content', weight: 0.1 }
                        ], 
                        threshold: 0.4,
                        ignoreLocation: true
                    };
                    const fuse = new Fuse(data, fuseOptions);
                    data = fuse.search(headerSearchQuery.value).map(result => result.item);
                } else {
                    const q = headerSearchQuery.value.toLowerCase();
                    data = data.filter(c => c.name.toLowerCase().includes(q) || c.arabicName.includes(q));
                }
            }
            return data;
        });

        const displayedChapters = computed(() => filteredChapters.value.slice(0, visibleCount.value));
        const lastReadChapter = computed(() => (!settings.value.lastReadId) ? null : safeChapters.find(c => c.id === settings.value.lastReadId));

        // --- NAVIGATION METHODS ---
        
        const openRemedy = (item) => {
            currentRemedy.value = item;
            setView('tabib-detail');
        };

        const closeRemedy = () => {
            setView('tabib');
            currentRemedy.value = null;
        };

        setInterval(() => {
            if(showBreathing.value) {
                if(breathState.value === 'inhale') {
                    breathState.value = 'exhale';
                    breathText.value = 'Expirez';
                } else {
                    breathState.value = 'inhale';
                    breathText.value = 'Inspirez';
                }
            }
        }, 4000);

        const setView = (mode) => {
            viewMode.value = mode;
            if (!['glossary', 'library', 'hadiths'].includes(mode)) headerSearchQuery.value = '';
            mobileMenuOpen.value = false;
            window.scrollTo(0, 0);
            refreshIcons();
        };

        const openChapter = (chap) => {
            quizAnswers.value = {};
            currentChapter.value = chap;
            setView('reader');
            settings.value.lastReadId = chap.id;
            readingProgress.value = 0;
        };

        const openHadith = (hadith) => {
            currentHadith.value = hadith;
            setView('hadith-reader');
            window.scrollTo(0, 0);
        };

        const currentDhikr = ref(null);

        const openDhikr = (item) => {
            currentDhikr.value = item;
            setView('adhkar-reader');
            window.scrollTo(0, 0);
        };

        const closeReader = () => {
            if (viewMode.value === 'hadith-reader') setView('hadiths');
            else if (viewMode.value === 'adhkar-reader') setView('adhkar');
            else if (viewMode.value === 'reader') setView('library');
            else setView('library');
        };
        const goHome = closeReader;

        // --- SILSILA (TRANSMISSION) LOGIC ---
        const silsilaTab = ref('hadith'); 
        const silsilaRootId = ref({ hadith: 'bukhari', fiqh: 'shafi', quran: 'nafi' }); 

        const focusedScholar = computed(() => {
            const currentId = silsilaRootId.value[silsilaTab.value];
            return safeSilsila.find(s => s.id === currentId) || null;
        });

        const currentTheme = computed(() => safeSilsilaThemes[silsilaTab.value] || safeSilsilaThemes.hadith);

        const openScholarFiche = (scholar) => {
            const match = safeChapters.find(c => c.name.includes(scholar.name) || scholar.name.includes(c.name));
            if (match) {
                openChapter(match);
            } else {
                showToast("Biographie détaillée bientôt disponible", "clock");
            }
        };

        // --- UTILS & INTERACTIONS ---
        const openChapterById = (id) => { const ch = safeChapters.find(c => c.id === id); if (ch) openChapter(ch); };
        const openRandomChapter = () => { if (safeChapters.length === 0) return; openChapter(safeChapters[Math.floor(Math.random() * safeChapters.length)]); };
        const showToast = (msg, icon = 'check-circle') => { const id = Date.now(); toasts.value.push({ id, msg, icon }); setTimeout(() => toasts.value = toasts.value.filter(t => t.id !== id), 3500); };
        const toggleFavorite = (id) => { const idx = settings.value.favorites.indexOf(id); if (idx === -1) { settings.value.favorites.push(id); showToast("Ajouté aux favoris", "heart"); } else { settings.value.favorites.splice(idx, 1); showToast("Retiré des favoris", "minus-circle"); } };
        const isFavorite = (id) => settings.value.favorites.includes(id);
        const toggleFilterFavorite = () => { viewFilter.value = viewFilter.value === 'favorites' ? 'all' : 'favorites'; };
        const incrementTasbih = () => { tasbihCount.value++; if (navigator.vibrate) navigator.vibrate(5); };
        const handleQuizAnswer = (qIdx, optIdx, correctIdx) => { if (quizAnswers.value[qIdx] !== undefined) return; quizAnswers.value[qIdx] = optIdx; if (navigator.vibrate) { if (optIdx === correctIdx) navigator.vibrate([50, 50, 50]); else navigator.vibrate(200); } };
        
        const shareContent = async (title, text) => {
            const url = window.location.href;
            const data = { title, text: text + " - Via AtharPro", url };
            if (navigator.share) { try { await navigator.share(data); } catch(e){} }
            else { try { await navigator.clipboard.writeText(`${title} - ${url}`); showToast("Copié !", "copy"); } catch(e) { showToast("Erreur copie", "x-circle"); } }
        };

        const tooltip = ref({ show: false, x: 0, y: 0, data: {} });
        const formatText = (text) => {
            if (!text) return '';
            let f = text.replace(/\\'/g, "'"); 
            f = f.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            f = f.replace(/@\{([^}]+)\}/g, (match, term) => `<span class="link-highlight" onclick="event.stopPropagation(); window.appOpenLink('${term.replace(/'/g, "\\'")}')" onmouseenter="window.appProfileHover(event, '${term.replace(/'/g, "\\'")}')" onmouseleave="window.appHideTooltip()">${term}</span>`);
            f = f.replace(/\{([^}]+)\}/g, (match, term) => `<span class="term-highlight" onmouseenter="window.appGlossaryHover(event, '${term.replace(/'/g, "\\'")}')" onmouseleave="window.appHideTooltip()">${term}</span>`);
            if (headerSearchQuery.value && !['glossary','hadiths'].includes(viewMode.value) && headerSearchQuery.value.length > 2) {
                const regex = new RegExp(`(${headerSearchQuery.value})(?![^<]*>|[^<>]*<\/a>)`, 'gi');
                f = f.replace(regex, '<mark class="bg-yellow-200 text-black rounded-sm px-0.5">$1</mark>');
            }
            return f;
        };

        const handleScroll = (e) => {
            const { scrollTop, scrollHeight, clientHeight } = e.target;
            if (viewMode.value === 'reader' || viewMode.value === 'hadith-reader') readingProgress.value = (scrollTop / (scrollHeight - clientHeight)) * 100;
            if (viewMode.value === 'library' && scrollHeight - scrollTop <= clientHeight + 200 && visibleCount.value < filteredChapters.value.length) visibleCount.value += 12;
        };
        
        const refreshIcons = () => setTimeout(() => { if (window.lucide) window.lucide.createIcons(); }, 550);

        onMounted(() => {
            const loader = document.getElementById('app-loader'); if (loader) loader.style.display = 'none';
            const saved = localStorage.getItem('athar_settings'); if (saved) settings.value = { ...settings.value, ...JSON.parse(saved) };
            const savedTasbih = localStorage.getItem('athar_tasbih'); if (savedTasbih) tasbihCount.value = parseInt(savedTasbih);
            if (settings.value.darkMode) document.documentElement.classList.add('dark');
            
            window.appOpenLink = (name) => { const target = safeChapters.find(c => c.name.toLowerCase().includes(name.toLowerCase())); if (target) openChapter(target); else showToast(`Chapitre "${name}" introuvable`, 'alert-circle'); };
            window.appGlossaryHover = (e, term) => { const def = safeGlossary[term.toLowerCase()]; if (def) tooltip.value = { show: true, x: e.target.getBoundingClientRect().left + e.target.getBoundingClientRect().width / 2, y: e.target.getBoundingClientRect().top, data: { origin: 'Glossaire', term, def: def.def } }; };
            window.appProfileHover = (e, name) => { const target = safeChapters.find(c => c.name.toLowerCase().includes(name.toLowerCase())); if (target) tooltip.value = { show: true, x: e.target.getBoundingClientRect().left + e.target.getBoundingClientRect().width / 2, y: e.target.getBoundingClientRect().top, data: { origin: target.tags[0], term: target.name, def: target.intro.substring(0, 80) + '...' } }; };
            window.appHideTooltip = () => tooltip.value.show = false;
            
            window.addEventListener('keydown', (e) => { if (e.key === 'Escape') { if (showTasbih.value) showTasbih.value = false; else if (mobileMenuOpen.value) mobileMenuOpen.value = false; else if (viewMode.value === 'reader' || viewMode.value === 'hadith-reader') closeReader(); } });
            refreshIcons();
        });

        watch(settings, (v) => { localStorage.setItem('athar_settings', JSON.stringify(v)); v.darkMode ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark'); }, { deep: true });
        watch([activeCategory, headerSearchQuery, viewFilter], () => { visibleCount.value = 12; if (mainScroll.value) mainScroll.value.scrollTop = 0; });
        watch(tasbihCount, (v) => localStorage.setItem('athar_tasbih', v));

        watch(mobileMenuOpen, (isOpen) => {
            if (isOpen) {
                setTimeout(() => {
                    if (window.lucide) window.lucide.createIcons();
                }, 50); // Petit délai pour laisser le temps au menu de s'ouvrir
            }
        });

        // Liste des clés des nouvelles sections
const extensionsList = [
    'constellation', 'eloquence', 'roots', 'scriptorium', 'diwan',
    'scholars_map', 'mosque', 'history_nights', 'isnad', 'currency', 'astronomy',
    'brahine', 'faqih', 'balance', 'memory'
];

// Fonction helper pour le style des boutons (à mettre dans le return)
const navBtnClass = (mode) => {
    const base = 'w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition-all duration-200 ';
    return base + (viewMode.value === mode ? 'bg-brand-dark text-brand-gold dark:bg-white dark:text-brand-dark shadow-lg' : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-brand-dark-lighter');
};

        return {
            dataError, viewMode, headerSearchQuery, filteredChapters, displayedChapters, mainScroll, globalTimeline, filteredGlossary,
            filteredHadiths, currentHadith, openHadith,
            currentChapter, filteredAdhkar, adhkarCategories, activeAdhkarCategory, copyText, activeStoryId, mobileMenuOpen, activeCategory, adhkarCounts, handleDhikrClick, currentDhikr, openDhikr, getProgress, categories, readingProgress, tabibCategories, tabibFilter, filteredRemedies, currentRemedy, 
            openRemedy, closeRemedy, showBreathing, breathState, breathText,
            settings, tooltip, toasts, showTasbih, tasbihCount, lastReadChapter, viewFilter, quizAnswers, handleQuizAnswer,
            setView, openChapter, openChapterById, closeReader, toggleFavorite, isFavorite, formatText, handleScroll,
            adjustFontSize: () => settings.value.fontSize = settings.value.fontSize >= 24 ? 16 : settings.value.fontSize + 2,
            toggleDarkMode: () => settings.value.darkMode = !settings.value.darkMode,
            toggleStory: (id) => activeStoryId.value = activeStoryId.value === id ? null : id,
            toggleTasbih: () => showTasbih.value = !showTasbih.value,
            incrementTasbih, toggleFilterFavorite, 
            shareChapter: () => shareContent(currentChapter.value.name, currentChapter.value.intro),
            shareHadith: () => shareContent(currentHadith.value.title, currentHadith.value.hadeeth),
            openRandomChapter, goHome,
            currentTheme, 
            openScholarFiche, 
            silsilaThemes: safeSilsilaThemes, safeSilsila, silsilaRootId, safeUssul, extensionsList, navBtnClass
        };
    }
});

app.mount('#app');

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('App prête (SW registered)', reg))
            .catch(err => console.log('Erreur SW:', err));
    });
}