const HadithReaderView = {
    props: ['hadith', 'settings', 'closeReader', 'shareHadith', 'adjustFontSize'],
    setup(props) {
        const STORAGE_KEY = 'athar_hadith_v2';
        const languageMode = Vue.ref('bilingual');
        const note = Vue.ref('');
        const copied = Vue.ref(false);
        const state = Vue.reactive({ favorites: [], read: {}, recent: [], notes: {} });
        const clean = value => String(value || '').replace(/\r/g, '').replace(/\n{3,}/g, '\n\n').trim();
        const paragraphs = value => {
            const text = clean(value);
            return text ? text.split(/\n{2,}/).map(x => x.trim()).filter(Boolean) : [];
        };
        const normalize = value => clean(value).toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
        const uid = Vue.computed(() => String(props.hadith?.id || props.hadith?.title || 'hadith'));
        const reference = Vue.computed(() => clean(props.hadith?.id || 'Référence non indiquée'));
        const collection = Vue.computed(() => {
            const text = normalize(String(props.hadith?.id || '') + ' ' + String(props.hadith?.attribution || ''));
            const matches = [];
            if (/bukhari|boukhari/.test(text)) matches.push('Al-Bukhârî');
            if (/muslim/.test(text)) matches.push('Muslim');
            if (/abu daw|abi daw/.test(text)) matches.push('Abou Dâwoud');
            if (/tirmidhi|tirmidi/.test(text)) matches.push('At-Tirmidhî');
            if (/nasa/.test(text)) matches.push('An-Nasâ’î');
            if (/ibn majah/.test(text)) matches.push('Ibn Mâjah');
            if (/ahmad/.test(text)) matches.push('Ahmad');
            return matches.length > 1 ? 'Recueils multiples' : (matches[0] || 'Autre recueil');
        });
        const narrator = Vue.computed(() => {
            const intro = clean(props.hadith?.hadeeth_intro || props.hadith?.hadeeth || '');
            const cut = intro.split(/ relate | rapporte | a relaté | رضي الله عنه| رضي الله عنها/i)[0];
            return cut.replace(/^(d'après|selon)\s+/i,'').replace(/[,:؛]+$/g,'').trim() || 'Transmetteur non précisé';
        });
        const isFavorite = Vue.computed(() => state.favorites.includes(uid.value));
        const isRead = Vue.computed(() => Boolean(state.read[uid.value]));
        const hints = Vue.computed(() => Array.isArray(props.hadith?.hints) ? props.hadith.hints.map(clean).filter(Boolean) : []);
        const hintsAr = Vue.computed(() => Array.isArray(props.hadith?.hints_ar) ? props.hadith.hints_ar.map(clean).filter(Boolean) : []);
        const wordMeanings = Vue.computed(() => Array.isArray(props.hadith?.words_meanings_ar) ? props.hadith.words_meanings_ar : []);
        const explanationParagraphs = Vue.computed(() => paragraphs(props.hadith?.explanation));
        const explanationArabicParagraphs = Vue.computed(() => paragraphs(props.hadith?.explanation_ar));
        const studyQuestions = Vue.computed(() => [
            'Comment résumer ce hadith avec tes propres mots ?',
            'Quel enseignement pourrais-tu appliquer dans une situation concrète ?',
            'Quelle distinction faut-il garder entre le texte transmis et son explication ?'
        ]);
        const formatMeaning = item => typeof item === 'string' ? { word: item, meaning: '' } : ({
            word: item?.word || item?.term || item?.arabic || '',
            meaning: item?.meaning || item?.explanation || item?.translation || ''
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
        const save = () => {
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify({
                favorites: state.favorites, read: state.read, recent: state.recent, notes: state.notes
            })); } catch (_) {}
        };
        const markRead = () => {
            state.read[uid.value] = new Date().toISOString();
            state.recent = [uid.value, ...state.recent.filter(id => id !== uid.value)].slice(0, 30);
            save();
        };
        const toggleFavorite = () => {
            state.favorites = isFavorite.value ? state.favorites.filter(id => id !== uid.value) : [...state.favorites, uid.value];
            save();
        };
        const saveNote = () => { state.notes[uid.value] = note.value; save(); };
        const copyText = async () => {
            const text = [props.hadith?.title, props.hadith?.hadeeth_ar, props.hadith?.hadeeth, props.hadith?.attribution]
                .filter(Boolean).join('\n\n');
            try {
                await navigator.clipboard.writeText(text);
                copied.value = true;
                setTimeout(() => { copied.value = false; }, 1800);
            } catch (_) { copied.value = false; }
        };
        const jumpTo = id => {
            const section = document.getElementById(id);
            section?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
        };
        const handleKey = event => {
            if (event.key === 'Escape' && !(event.target instanceof HTMLTextAreaElement)) props.closeReader();
        };
        let noteTimer = null;
        Vue.onMounted(() => {
            load(); markRead();
            window.addEventListener('keydown', handleKey);
            Vue.nextTick(() => window.lucide?.createIcons());
        });
        Vue.watch(note, () => { clearTimeout(noteTimer); noteTimer = setTimeout(saveNote, 450); });
        Vue.onUnmounted(() => {
            window.removeEventListener('keydown', handleKey);
            clearTimeout(noteTimer);
            saveNote();
        });
        return {
            languageMode, note, copied, clean, collection, reference, narrator, isFavorite, isRead,
            hints, hintsAr, wordMeanings, explanationParagraphs, explanationArabicParagraphs, studyQuestions,
            formatMeaning, toggleFavorite, saveNote, copyText, jumpTo
        };
    },
    template: `
    <section class="hadith-reader-pro">
        <header class="hadith-reader-toolbar">
            <button type="button" class="hadith-reader-back" @click="closeReader">
                <i data-lucide="arrow-left" aria-hidden="true"></i><span>Hadiths</span>
            </button>
            <span class="hadith-reader-toolbar-reference">{{ reference }}</span>
            <div class="hadith-reader-actions">
                <button type="button" @click="adjustFontSize" title="Agrandir le texte" aria-label="Agrandir le texte"><i data-lucide="type" aria-hidden="true"></i></button>
                <button type="button" @click="copyText" :title="copied?'Copié':'Copier le hadith'" :aria-label="copied?'Texte copié':'Copier le hadith'">
                    <i :data-lucide="copied?'check':'copy'" aria-hidden="true"></i>
                </button>
                <button type="button" @click="shareHadith" title="Partager" aria-label="Partager le hadith"><i data-lucide="share-2" aria-hidden="true"></i></button>
                <button type="button" @click="toggleFavorite" :class="{active:isFavorite}" :aria-pressed="isFavorite" :title="isFavorite?'Retirer des favoris':'Ajouter aux favoris'" :aria-label="isFavorite?'Retirer des favoris':'Ajouter aux favoris'">
                    <i data-lucide="heart" aria-hidden="true"></i>
                </button>
            </div>
        </header>

        <main class="hadith-reader-shell">
            <header class="hadith-reader-heading">
                <div class="hadith-reader-overline"><span>{{ collection }}</span><span aria-hidden="true">·</span><span>Lecture & compréhension</span></div>
                <h1>{{ hadith.title }}</h1>
            </header>

            <nav class="hadith-reader-jump" aria-label="Accès aux sections du hadith">
                <button type="button" @click="jumpTo('hadith-reading-text')">Texte</button>
                <button type="button" @click="jumpTo('hadith-reading-explanation')">Explication</button>
                <button type="button" @click="jumpTo('hadith-reading-lessons')">À retenir</button>
                <button type="button" @click="jumpTo('hadith-reading-notes')">Mes notes</button>
            </nav>

            <section id="hadith-reading-text" class="hadith-reader-section hadith-reader-text-view">
                <div class="hadith-reader-section-head">
                    <h2>Le hadith</h2>
                    <div class="hadith-reader-language-switch" role="group" aria-label="Langue du hadith">
                        <button type="button" @click="languageMode='bilingual'" :class="{active:languageMode==='bilingual'}" :aria-pressed="languageMode==='bilingual'">Les deux</button>
                        <button type="button" @click="languageMode='arabic'" :class="{active:languageMode==='arabic'}" :aria-pressed="languageMode==='arabic'">Arabe</button>
                        <button type="button" @click="languageMode='french'" :class="{active:languageMode==='french'}" :aria-pressed="languageMode==='french'">Français</button>
                    </div>
                </div>
                <div class="hadith-reader-text-card">
                    <div v-if="languageMode!=='french' && hadith.hadeeth_ar" class="hadith-reader-arabic" lang="ar" dir="rtl">
                        <p v-if="hadith.hadeeth_intro_ar" class="hadith-reader-intro-ar">{{ clean(hadith.hadeeth_intro_ar) }}</p>
                        <blockquote :style="{fontSize:(settings.fontSize+12)+'px'}">{{ clean(hadith.hadeeth_ar) }}</blockquote>
                    </div>
                    <div v-if="languageMode!=='arabic'" class="hadith-reader-french">
                        <p :style="{fontSize:settings.fontSize+'px'}">{{ clean(hadith.hadeeth) }}</p>
                    </div>
                    <p v-if="languageMode==='arabic' && !hadith.hadeeth_ar" class="hadith-reader-unavailable">Texte arabe non disponible dans la base.</p>
                </div>
            </section>

            <section id="hadith-reading-explanation" class="hadith-reader-section hadith-reader-explanation-view">
                <div class="hadith-reader-section-head"><h2>Comprendre</h2></div>
                <div class="hadith-reader-content" :style="{fontSize:settings.fontSize+'px'}">
                    <p v-for="(paragraph,index) in explanationParagraphs" :key="index">{{ paragraph }}</p>
                    <p v-if="!explanationParagraphs.length" class="hadith-reader-unavailable">Aucune explication n'est disponible pour ce hadith.</p>
                </div>
                <details v-if="explanationArabicParagraphs.length" class="hadith-reader-details">
                    <summary>Lire l'explication en arabe <i data-lucide="chevron-down" aria-hidden="true"></i></summary>
                    <div class="hadith-reader-ar-explanation" lang="ar" dir="rtl">
                        <p v-for="(paragraph,index) in explanationArabicParagraphs" :key="index">{{ paragraph }}</p>
                    </div>
                </details>
            </section>

            <section id="hadith-reading-lessons" class="hadith-reader-section hadith-reader-lessons-view">
                <div class="hadith-reader-section-head"><h2>À retenir</h2></div>
                <ol v-if="hints.length" class="hadith-reader-lessons">
                    <li v-for="(hint,index) in hints" :key="index">
                        <span>{{ String(index+1).padStart(2,'0') }}</span><p>{{ hint }}</p>
                    </li>
                </ol>
                <p v-else class="hadith-reader-unavailable">Aucun point synthétique distinct n'est fourni. L'explication ci-dessus reste disponible.</p>
                <details v-if="hintsAr.length" class="hadith-reader-details">
                    <summary>Enseignements en arabe <i data-lucide="chevron-down" aria-hidden="true"></i></summary>
                    <ul lang="ar" dir="rtl" class="hadith-reader-ar-lessons">
                        <li v-for="(hint,index) in hintsAr" :key="index">{{ hint }}</li>
                    </ul>
                </details>
            </section>

            <section id="hadith-reading-notes" class="hadith-reader-section hadith-reader-notes">
                <div class="hadith-reader-section-head"><h2>Mes notes</h2><span>Enregistrées sur cet appareil</span></div>
                <textarea v-model="note" @blur="saveNote" rows="4" aria-label="Mes notes personnelles" placeholder="Ce que je retiens, une question ou une application concrète…"></textarea>
                <details class="hadith-reader-details hadith-reader-study-view">
                    <summary>Questions pour approfondir <i data-lucide="chevron-down" aria-hidden="true"></i></summary>
                    <ol class="hadith-reader-study-questions"><li v-for="(question,index) in studyQuestions" :key="index">{{ question }}</li></ol>
                </details>
            </section>

            <section class="hadith-reader-endnotes">
                <details class="hadith-reader-details hadith-reader-source-view">
                    <summary><span><i data-lucide="book-open" aria-hidden="true"></i> Sources, transmission et précisions</span><i data-lucide="chevron-down" aria-hidden="true"></i></summary>
                    <div class="hadith-reader-source-grid">
                        <div><span>Référence indiquée</span><strong>{{ reference }}</strong></div>
                        <div><span>Recueil repéré</span><strong>{{ collection }}</strong></div>
                        <div><span>Attribution dans la base</span><strong>{{ hadith.attribution }}</strong></div>
                        <div><span>Degré indiqué</span><strong>{{ hadith.grade || 'Non indiqué' }}</strong><p v-if="hadith.grade_ar" lang="ar" dir="rtl">{{ hadith.grade_ar }}</p></div>
                        <div><span>Transmetteur présenté</span><strong>{{ narrator }}</strong><p v-if="hadith.hadeeth_intro">{{ clean(hadith.hadeeth_intro) }}</p></div>
                    </div>
                    <p v-if="hadith.attribution_ar" class="hadith-reader-attribution-ar" lang="ar" dir="rtl">{{ hadith.attribution_ar }}</p>
                    <p v-if="hadith.source_url && hadith.source_url.startsWith('https://')" class="hadith-reader-source-link">
                        <a :href="hadith.source_url" target="_blank" rel="noopener noreferrer">Consulter la source documentaire</a>
                    </p>
                    <div v-if="wordMeanings.length" class="hadith-reader-vocabulary">
                        <h3>Vocabulaire arabe fourni</h3>
                        <ul>
                            <li v-for="(entry,index) in wordMeanings" :key="index">
                                <b lang="ar" dir="rtl">{{ formatMeaning(entry).word }}</b>
                                <span>{{ formatMeaning(entry).meaning }}</span>
                            </li>
                        </ul>
                    </div>
                    <p class="hadith-reader-methodology">Le degré et l'attribution sont ceux présents dans la base Athar. Cette fiche ne remplace pas la vérification des différentes chaînes et éditions des recueils.</p>
                </details>
            </section>
        </main>
    </section>
    `
};
