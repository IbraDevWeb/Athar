const HadithReaderView = {
    props: ['hadith', 'settings', 'closeReader', 'shareHadith', 'adjustFontSize'],
    setup(props) {
        const STORAGE_KEY = 'athar_hadith_v2';
        const activeTab = Vue.ref('text');
        const languageMode = Vue.ref('bilingual');
        const note = Vue.ref('');
        const state = Vue.reactive({ favorites: [], read: {}, recent: [], notes: {} });
        const uid = Vue.computed(() => String(props.hadith?.id || props.hadith?.title || 'hadith'));
        const clean = value => String(value || '').replace(/\r/g, '').replace(/\n{3,}/g, '\n\n').trim();
        const normalize = value => String(value || '').toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

        const collection = Vue.computed(() => {
            const text = normalize(`${props.hadith?.id || ''} ${props.hadith?.attribution || ''}`);
            const matches = [];
            if (/bukhari|bukhârî/.test(text)) matches.push('Al-Bukhārī');
            if (/muslim/.test(text)) matches.push('Muslim');
            if (/abu daw|abû daw|abi daw/.test(text)) matches.push('Abū Dāwūd');
            if (/tirmidhi|tirmidhî/.test(text)) matches.push('Al-Tirmidhī');
            if (/nasa|nasâ/.test(text)) matches.push('Al-Nasāʾī');
            if (/ibn majah|ibn mâjah/.test(text)) matches.push('Ibn Mājah');
            if (/ahmad|aḥmad/.test(text)) matches.push('Aḥmad');
            return matches.length > 1 ? 'Sources multiples' : (matches[0] || 'Autres recueils');
        });

        const narrator = Vue.computed(() => {
            const intro = clean(props.hadith?.hadeeth_intro || props.hadith?.hadeeth || '');
            const cut = intro.split(/ relate | rapporte | a relaté | رضي الله عنه| رضي الله عنها/i)[0];
            return cut.replace(/^(d'après|selon)\s+/i, '').replace(/[,:؛]+$/g, '').trim() || 'Transmetteur non précisé';
        });

        const reference = Vue.computed(() => clean(props.hadith?.id || 'Référence non indiquée'));
        const isFavorite = Vue.computed(() => state.favorites.includes(uid.value));
        const isRead = Vue.computed(() => Boolean(state.read[uid.value]));
        const words = Vue.computed(() => clean(`${props.hadith?.hadeeth || ''} ${props.hadith?.explanation || ''}`).split(/\s+/).filter(Boolean).length);
        const readingTime = Vue.computed(() => Math.max(2, Math.ceil(words.value / 180)));
        const hints = Vue.computed(() => Array.isArray(props.hadith?.hints) ? props.hadith.hints.map(clean).filter(Boolean) : []);
        const hintsAr = Vue.computed(() => Array.isArray(props.hadith?.hints_ar) ? props.hadith.hints_ar.map(clean).filter(Boolean) : []);
        const wordMeanings = Vue.computed(() => Array.isArray(props.hadith?.words_meanings_ar) ? props.hadith.words_meanings_ar : []);
        const studyQuestions = Vue.computed(() => {
            const first = hints.value[0] || 'Quel principe central ce hadith établit-il ?';
            return [
                `Comment reformuler avec tes propres mots l'enseignement suivant : « ${first} » ?`,
                'Dans quelle situation concrète de ta semaine cet enseignement pourrait-il modifier une décision ou un comportement ?',
                'Quelle distinction faut-il conserver entre le texte transmis, son degré indiqué et l’explication pédagogique proposée ?'
            ];
        });

        const load = () => {
            try {
                const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
                state.favorites = Array.isArray(saved.favorites) ? saved.favorites : [];
                state.read = saved.read && typeof saved.read === 'object' ? saved.read : {};
                state.recent = Array.isArray(saved.recent) ? saved.recent : [];
                state.notes = saved.notes && typeof saved.notes === 'object' ? saved.notes : {};
                note.value = state.notes[uid.value] || '';
            } catch (_) {}
        };
        const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify({ favorites: state.favorites, read: state.read, recent: state.recent, notes: state.notes }));
        const markRead = () => {
            state.read[uid.value] = new Date().toISOString();
            state.recent = [uid.value, ...state.recent.filter(id => id !== uid.value)].slice(0, 30);
            save();
        };
        const toggleFavorite = () => {
            state.favorites = isFavorite.value ? state.favorites.filter(id => id !== uid.value) : [...state.favorites, uid.value];
            save();
        };
        const saveNote = () => {
            state.notes[uid.value] = note.value.trim();
            save();
        };
        const copyText = async () => {
            const text = [props.hadith?.title, props.hadith?.hadeeth_ar, props.hadith?.hadeeth, props.hadith?.attribution].filter(Boolean).join('\n\n');
            try { await navigator.clipboard.writeText(text); } catch (_) {}
        };
        const setTab = value => { activeTab.value = value; setTimeout(() => window.lucide?.createIcons(), 20); };
        const formatMeaning = item => {
            if (typeof item === 'string') return { word: item, meaning: '' };
            return { word: item?.word || item?.term || item?.arabic || '', meaning: item?.meaning || item?.explanation || item?.translation || '' };
        };
        const handleKey = event => {
            if (event.key === 'Escape') props.closeReader();
            if (event.key.toLocaleLowerCase() === 'f' && (event.ctrlKey || event.metaKey)) { event.preventDefault(); toggleFavorite(); }
        };

        Vue.onMounted(() => {
            load(); markRead();
            window.addEventListener('keydown', handleKey);
            setTimeout(() => window.lucide?.createIcons(), 30);
        });
        Vue.onUnmounted(() => window.removeEventListener('keydown', handleKey));
        Vue.watch(note, () => {
            clearTimeout(window.__atharHadithNoteTimer);
            window.__atharHadithNoteTimer = setTimeout(saveNote, 450);
        });

        return {
            activeTab, languageMode, note, collection, narrator, reference, isFavorite, isRead, readingTime,
            hints, hintsAr, wordMeanings, studyQuestions, clean, toggleFavorite, saveNote, copyText, setTab, formatMeaning
        };
    },
    template: `
    <div class="hadith-reader-pro">
        <header class="hadith-reader-toolbar">
            <button @click="closeReader" class="hadith-reader-back"><i data-lucide="arrow-left"></i><span>Bibliothèque</span></button>
            <div class="hadith-reader-toolbar-title"><span>Étude du hadith</span><b>{{ reference }}</b></div>
            <div class="hadith-reader-actions">
                <button @click="adjustFontSize" title="Taille du texte"><i data-lucide="type"></i></button>
                <button @click="copyText" title="Copier"><i data-lucide="copy"></i></button>
                <button @click="shareHadith" title="Partager"><i data-lucide="share-2"></i></button>
                <button @click="toggleFavorite" :class="{active:isFavorite}" title="Favori"><i data-lucide="heart"></i></button>
            </div>
        </header>

        <main class="hadith-reader-shell">
            <section class="hadith-reader-hero">
                <div class="hadith-reader-badges"><span>{{ collection }}</span><span>{{ hadith.grade || 'Degré non indiqué' }}</span><span>{{ readingTime }} min</span><span v-if="isRead"><i data-lucide="check"></i> Consulté</span></div>
                <p class="hadith-reader-label" lang="ar" dir="rtl">حديث نبوي</p>
                <h1>{{ hadith.title }}</h1>
                <p class="hadith-reader-narrator"><i data-lucide="user-round"></i><span>Transmis ici par <b>{{ narrator }}</b></span></p>
            </section>

            <nav class="hadith-reader-tabs">
                <button v-for="tab in [{id:'text',label:'Texte',icon:'languages'},{id:'explanation',label:'Explication',icon:'book-open'},{id:'lessons',label:'Enseignements',icon:'lightbulb'},{id:'source',label:'Transmission',icon:'git-branch'},{id:'study',label:'Étudier',icon:'pencil-line'}]" :key="tab.id" @click="setTab(tab.id)" :class="{active:activeTab===tab.id}"><i :data-lucide="tab.icon"></i><span>{{ tab.label }}</span></button>
            </nav>

            <section v-if="activeTab==='text'" class="hadith-reader-text-view">
                <div class="hadith-reader-language-switch"><button @click="languageMode='bilingual'" :class="{active:languageMode==='bilingual'}">Bilingue</button><button @click="languageMode='arabic'" :class="{active:languageMode==='arabic'}">العربية</button><button @click="languageMode='french'" :class="{active:languageMode==='french'}">Français</button></div>
                <article v-if="languageMode!=='french'" class="hadith-reader-arabic" lang="ar" dir="rtl">
                    <p v-if="hadith.hadeeth_intro_ar" class="hadith-reader-intro-ar">{{ clean(hadith.hadeeth_intro_ar) }}</p>
                    <blockquote :style="{fontSize:(settings.fontSize+14)+'px'}">{{ clean(hadith.hadeeth_ar) }}</blockquote>
                </article>
                <article v-if="languageMode!=='arabic'" class="hadith-reader-french">
                    <span>Rendu français fourni dans la base</span>
                    <p :style="{fontSize:settings.fontSize+'px'}">{{ clean(hadith.hadeeth) }}</p>
                </article>
                <div class="hadith-reader-source-line"><i data-lucide="bookmark"></i><span>{{ hadith.attribution }}</span></div>
            </section>

            <section v-else-if="activeTab==='explanation'" class="hadith-reader-explanation-view">
                <article><header><i data-lucide="book-open-check"></i><div><span>Explication française</span><h2>Comprendre le sens général</h2></div></header><div class="hadith-reader-prose" :style="{fontSize:settings.fontSize+'px'}"><p v-for="(paragraph,index) in clean(hadith.explanation).split(/\n\n+/)" :key="index">{{ paragraph }}</p></div></article>
                <article v-if="hadith.explanation_ar" class="hadith-reader-ar-explanation" lang="ar" dir="rtl"><header><i data-lucide="languages"></i><div><span>الشرح العربي</span><h2>شرح الحديث</h2></div></header><div class="hadith-reader-prose-ar"><p v-for="(paragraph,index) in clean(hadith.explanation_ar).split(/\n\n+/)" :key="index">{{ paragraph }}</p></div></article>
            </section>

            <section v-else-if="activeTab==='lessons'" class="hadith-reader-lessons-view">
                <div class="hadith-reader-section-title"><span>Extraction pédagogique</span><h2>Enseignements à retenir</h2><p>Ces points synthétisent l’explication fournie avec le texte.</p></div>
                <ol><li v-for="(hint,index) in hints" :key="index"><b>{{ String(index+1).padStart(2,'0') }}</b><p>{{ hint }}</p></li></ol>
                <article v-if="hintsAr.length" lang="ar" dir="rtl"><h3>الفوائد المستنبطة</h3><ul><li v-for="(hint,index) in hintsAr" :key="index">{{ hint }}</li></ul></article>
                <div v-if="!hints.length" class="hadith-reader-empty-note"><i data-lucide="info"></i><span>Aucun enseignement synthétique distinct n’est fourni pour ce texte. Consulte l’explication complète.</span></div>
            </section>

            <section v-else-if="activeTab==='source'" class="hadith-reader-source-view">
                <div class="hadith-reader-source-grid">
                    <article><i data-lucide="user-round"></i><span>Transmetteur présenté</span><b>{{ narrator }}</b><p>{{ clean(hadith.hadeeth_intro || '') }}</p></article>
                    <article><i data-lucide="library"></i><span>Collection repérée</span><b>{{ collection }}</b><p>{{ hadith.attribution }}</p></article>
                    <article><i data-lucide="badge-check"></i><span>Degré indiqué</span><b>{{ hadith.grade || 'Non indiqué' }}</b><p v-if="hadith.grade_ar" lang="ar" dir="rtl">{{ hadith.grade_ar }}</p></article>
                    <article><i data-lucide="hash"></i><span>Référence interne</span><b>{{ reference }}</b><p>{{ Array.isArray(hadith.translations) ? hadith.translations.length+' langues disponibles dans la source de données' : 'Informations de traduction non indiquées' }}</p></article>
                </div>
                <article v-if="wordMeanings.length" class="hadith-reader-vocabulary"><header><i data-lucide="book-a"></i><h2>Vocabulaire arabe fourni</h2></header><div><span v-for="(entry,index) in wordMeanings" :key="index"><b lang="ar" dir="rtl">{{ formatMeaning(entry).word }}</b><small>{{ formatMeaning(entry).meaning }}</small></span></div></article>
                <div class="hadith-reader-methodology"><i data-lucide="shield-alert"></i><div><b>Précaution méthodologique</b><p>Cette fiche organise les informations présentes dans la base. Pour un travail de takhrīj complet, il faut revenir aux éditions des recueils, aux différentes voies de transmission et aux jugements détaillés des spécialistes.</p></div></div>
            </section>

            <section v-else class="hadith-reader-study-view">
                <div class="hadith-reader-study-grid">
                    <article><header><i data-lucide="circle-help"></i><div><span>Tadabbur et compréhension</span><h2>Questions d’étude</h2></div></header><ol><li v-for="(question,index) in studyQuestions" :key="index"><b>{{ index+1 }}</b><p>{{ question }}</p></li></ol></article>
                    <article><header><i data-lucide="notebook-pen"></i><div><span>Espace personnel</span><h2>Mes notes</h2></div></header><textarea v-model="note" @blur="saveNote" placeholder="Écris ici une reformulation, une question à vérifier ou une application concrète…"></textarea><small>Enregistrement local automatique sur cet appareil.</small></article>
                </div>
                <div class="hadith-reader-study-actions"><button @click="toggleFavorite" :class="{active:isFavorite}"><i data-lucide="heart"></i>{{ isFavorite?'Retirer des favoris':'Conserver pour révision' }}</button><button @click="shareHadith"><i data-lucide="share-2"></i>Partager la référence</button></div>
            </section>
        </main>
    </div>
    `
};