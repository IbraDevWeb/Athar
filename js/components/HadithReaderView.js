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
        const isKutubHadith = Vue.computed(() => Boolean(props.hadith?.number != null && props.hadith?.bookNumber != null));
        const isBukhari = Vue.computed(() => isKutubHadith.value && /^Sahih al-Bukhari [1-9][0-9]*$/.test(String(props.hadith?.id||'')));
        const isMuslim = Vue.computed(() => isKutubHadith.value && /^Sahih Muslim Introduction [1-9][0-9]*$/.test(String(props.hadith?.id||'')));
        const isPremiumReader = Vue.computed(() => isBukhari.value || isMuslim.value);
        const bukhariBook = Vue.computed(() => isMuslim.value ? 'Introduction — science de la transmission' : Number(props.hadith?.bookNumber)===1
            ? 'Le commencement de la Révélation' : 'La Foi');
        const translationNotice = Vue.computed(() => clean(props.hadith?.translationNotice || ''));
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
            if (isKutubHadith.value) return 'Chaîne de transmission conservée dans le texte arabe intégral';
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
            const text = [isPremiumReader.value ? props.hadith?.readingTitle : props.hadith?.title, props.hadith?.hadeeth_ar, props.hadith?.hadeeth, props.hadith?.attribution]
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
            languageMode, note, copied, clean, collection, reference, narrator, isKutubHadith, isBukhari, isMuslim, isPremiumReader, bukhariBook, translationNotice, isFavorite, isRead,
            hints, hintsAr, wordMeanings, explanationParagraphs, explanationArabicParagraphs, studyQuestions,
            formatMeaning, toggleFavorite, saveNote, copyText, jumpTo
        };
    },
    template: `
    <section class="hadith-reader-pro" :class="{'bukhari-reader-pro':isPremiumReader}">
        <template v-if="isPremiumReader">
            <main class="bukhari-reader-shell">
                <div class="bukhari-reader-toolbar">
                    <button type="button" class="bukhari-reader-back" @click="closeReader">
                        <span class="bukhari-reader-back-icon"><i data-lucide="arrow-left" aria-hidden="true"></i></span>
                        Retour au recueil
                    </button>
                    <div class="bukhari-reader-actions">
                        <button type="button" @click="adjustFontSize" aria-label="Agrandir le texte" title="Agrandir le texte">
                            <i data-lucide="type" aria-hidden="true"></i>
                        </button>
                        <button type="button" @click="copyText" :aria-label="copied?'Texte copié':'Copier le hadith'"
                            :title="copied?'Copié':'Copier le texte'">
                            <i :data-lucide="copied?'check':'copy'" aria-hidden="true"></i>
                        </button>
                        <button type="button" @click="shareHadith" aria-label="Partager le hadith" title="Partager">
                            <i data-lucide="share-2" aria-hidden="true"></i>
                        </button>
                        <button type="button" @click="toggleFavorite" :aria-pressed="isFavorite"
                            :aria-label="isFavorite?'Retirer des favoris':'Ajouter aux favoris'"
                            :class="{active:isFavorite}" title="Enregistrer dans mes favoris">
                            <i data-lucide="heart" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
                <header class="bukhari-reader-hero hadith-reader-heading">
                    <span class="bukhari-reader-kicker"><i data-lucide="book-open-check" aria-hidden="true"></i> {{ isMuslim ? "Science de la transmission" : "La tradition prophétique" }}</span>
                    <span class="bukhari-reader-hero-icon" aria-hidden="true">
                        <i :data-lucide="hadith.readingIcon||'book-open'"></i>
                    </span>
                    <span class="bukhari-reader-hero-arabic" lang="ar" dir="rtl">{{ isMuslim ? "صحيح مسلم" : "صحيح البخاري" }}</span>
                    <h1>{{ hadith.readingTitle||hadith.title }}</h1>
                    <p class="bukhari-reader-book">{{ bukhariBook }}</p>
                    <div class="bukhari-reader-meta">
                        <span>Hadith n° {{ hadith.number }}</span><span aria-hidden="true">·</span>
                        <span>{{ isMuslim ? "Introduction, narration " + hadith.inBookNumber : "Livre " + hadith.bookNumber + ", hadith " + hadith.inBookNumber }}</span>
                    </div>
                </header>

                <div class="bukhari-reader-language-switch" role="group" aria-label="Choisir la langue de lecture">
                    <button type="button" @click="languageMode='bilingual'" :aria-pressed="languageMode==='bilingual'"
                        :class="{active:languageMode==='bilingual'}">Arabe et français</button>
                    <button type="button" @click="languageMode='arabic'" :aria-pressed="languageMode==='arabic'"
                        :class="{active:languageMode==='arabic'}">Arabe</button>
                    <button type="button" @click="languageMode='french'" :aria-pressed="languageMode==='french'"
                        :class="{active:languageMode==='french'}">Français</button>
                </div>

                <div class="bukhari-reader-content">
                    <section v-if="languageMode!=='french'" class="bukhari-reader-original hadith-reader-arabic">
                        <div class="bukhari-reader-card-ornament" aria-hidden="true"><i data-lucide="book-open"></i></div>
                        <div class="bukhari-reader-original-body">
                            <span class="bukhari-reader-overline">Le texte transmis · الرواية العربية</span>
                            <blockquote lang="ar" dir="rtl" :style="{fontSize:(settings.fontSize+12)+'px'}">{{ clean(hadith.hadeeth_ar) }}</blockquote>
                            <div class="bukhari-reader-original-caption"><i data-lucide="bookmark" aria-hidden="true"></i>
                                Texte arabe complet, avec sa chaîne de transmission
                            </div>
                        </div>
                    </section>
                    <section v-if="languageMode!=='arabic'" class="bukhari-reader-translation hadith-reader-french">
                        <div class="bukhari-reader-translation-head">
                            <span class="bukhari-reader-translation-symbol" aria-hidden="true"><i data-lucide="languages"></i></span>
                            <div><span>Lecture accompagnée</span><h2>Le récit en français</h2></div>
                        </div>
                        <p :style="{fontSize:settings.fontSize+'px'}">{{ clean(hadith.hadeeth) }}</p>
                        <div class="bukhari-reader-translation-caption">
                            Version française de l'édition numérique · provenance et précisions en bas de page
                        </div>
                    </section>

                    <section class="bukhari-reader-journal">
                        <div class="bukhari-reader-journal-heading">
                            <span class="bukhari-reader-journal-icon" aria-hidden="true"><i data-lucide="notebook-pen"></i></span>
                            <div><span>Lecture personnelle</span><h2>Ce que je retiens</h2></div>
                        </div>
                        <p>Un espace pour tes observations et questions personnelles, sans les confondre avec le texte transmis.</p>
                        <textarea v-model="note" @blur="saveNote" rows="4"
                            aria-label="Mes notes personnelles sur ce hadith"
                            placeholder="Une réflexion, une question, un passage à approfondir…"></textarea>
                        <span class="bukhari-reader-autosave"><i data-lucide="lock" aria-hidden="true"></i>
                            Notes enregistrées sur cet appareil
                        </span>
                    </section>

                    <section class="hadith-reader-endnotes bukhari-reader-source-wrap">
                        <details class="hadith-reader-details hadith-reader-source-view bukhari-reader-source">
                            <summary><span><i data-lucide="library" aria-hidden="true"></i> Référence et provenance</span>
                                <i data-lucide="chevron-down" aria-hidden="true"></i>
                            </summary>
                            <div class="bukhari-reader-source-body">
                                <div class="bukhari-reader-source-records">
                                    <div><span>Recueil</span><strong>{{ isMuslim ? "Sahîh Muslim" : "Sahîh al-Bukhârî" }}</strong></div>
                                    <div><span>Numérotation</span><strong>Hadith {{ hadith.number }}</strong></div>
                                    <div><span>Section</span><strong>{{ isMuslim ? "Introduction" : hadith.bookNumber + " · " + bukhariBook }}</strong></div>
                                    <div><span>Dans la section</span><strong>{{ isMuslim ? "Narration" : "Hadith" }} {{ hadith.inBookNumber }}</strong></div>
                                </div>
                                <p v-if="translationNotice" class="hadith-reader-translation-notice">{{ translationNotice }}</p>
                                <p class="bukhari-reader-source-caution">Le titre de lecture est éditorial. Le texte complet ci-dessus reste distinct des explications et commentaires savants.<span v-if="isMuslim"> L’Introduction de Muslim contient aussi des propos de transmetteurs et n’est pas intégralement régie par le statut du corpus principal.</span></p>
                                <a v-if="hadith.source_url && hadith.source_url.startsWith('https://sunnah.com/')"
                                    :href="hadith.source_url" target="_blank" rel="noopener noreferrer" class="bukhari-reader-external">
                                    Consulter le hadith sur Sunnah.com <i data-lucide="external-link" aria-hidden="true"></i>
                                </a>
                            </div>
                        </details>
                    </section>
                </div>
            </main>
        </template>
        <template v-else>
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
                <button v-if="!isKutubHadith || explanationParagraphs.length" type="button" @click="jumpTo('hadith-reading-explanation')">Explication</button>
                <button v-if="!isKutubHadith || hints.length" type="button" @click="jumpTo('hadith-reading-lessons')">À retenir</button>
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
                        <span v-if="isKutubHadith" class="hadith-reader-translation-label">Version française de l’édition numérique</span>
                        <p :style="{fontSize:settings.fontSize+'px'}">{{ clean(hadith.hadeeth) }}</p>
                    </div>
                    <p v-if="languageMode==='arabic' && !hadith.hadeeth_ar" class="hadith-reader-unavailable">Texte arabe non disponible dans la base.</p>
                </div>
            </section>

            <section v-if="!isKutubHadith || explanationParagraphs.length" id="hadith-reading-explanation" class="hadith-reader-section hadith-reader-explanation-view">
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

            <section v-if="!isKutubHadith || hints.length" id="hadith-reading-lessons" class="hadith-reader-section hadith-reader-lessons-view">
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
                    <p v-if="isKutubHadith" class="hadith-reader-translation-notice">{{ translationNotice }}</p>
                    <p v-if="hadith.translationSourceUrl && hadith.translationSourceUrl.startsWith('https://')" class="hadith-reader-source-link">
                        <a :href="hadith.translationSourceUrl" target="_blank" rel="noopener noreferrer">Édition française consultée</a>
                    </p>
                    <p v-if="hadith.textSourceUrl && hadith.textSourceUrl.startsWith('https://')" class="hadith-reader-source-link">
                        <a :href="hadith.textSourceUrl" target="_blank" rel="noopener noreferrer">Édition arabe consultée</a>
                    </p>
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
        </template>
    </section>
    `
};
