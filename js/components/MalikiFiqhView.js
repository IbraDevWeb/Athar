// Athar — Fiqh malikite : parcours de fiches indépendantes, édition sobre et autonome.
// Les contenus viennent de fiqh_maliki_data.js ; ne pas improviser des avis juridiques.
const MalikiFiqhView = {
    props: ['course', 'goHome'],
    setup(props) {
        const activeTab = Vue.ref('cours');
        const glossarySearch = Vue.ref('');
        const answers = Vue.ref({});
        const selectedLessonKey = Vue.ref(null);
        const lesson = Vue.computed(() => selectedLessonKey.value ? (props.course?.[selectedLessonKey.value] || null) : null);
        const catalogSearch = Vue.ref('');
        const lastLessonKey = Vue.ref(null);
        const scrollArea = Vue.ref(null);
        const lessonCatalog = [
            { key:'intro', name:'Découvrir l’ouvrage' },
            { key:'purification', name:'Kitâb al-Tahâra' },
            { key:'naturalWaters', name:'Les eaux naturelles' },
            { key:'waterChanges', name:'L’eau modifiée' },
            { key:'pureMixtures', name:'Les mélanges purs' },
            { key:'impureContact', name:'L’eau et l’impureté' }
        ];
        const storageKeys = {
            intro:'athar_fiqh_maliki_intro_01_done',
            purification:'athar_fiqh_maliki_tahara_02_done',
            naturalWaters:'athar_fiqh_maliki_eaux_03_done',
            waterChanges:'athar_fiqh_maliki_eaux_04_done',
            pureMixtures:'athar_fiqh_maliki_eaux_05_done',
            impureContact:'athar_fiqh_maliki_eaux_06_done'
        };
        const availableLessons = Vue.computed(() => lessonCatalog.filter(entry => props.course?.[entry.key]));
        const completed = Vue.ref(Object.fromEntries(lessonCatalog.map(entry => [entry.key,false])));
        const completedCount = Vue.computed(() => availableLessons.value.filter(entry => completed.value[entry.key]).length);
        const completionPercent = Vue.computed(() => availableLessons.value.length ? Math.round(completedCount.value * 100 / availableLessons.value.length) : 0);
        const totalSections = Vue.computed(() => availableLessons.value.reduce((total,entry) => total + (props.course?.[entry.key]?.sections?.length || 0),0));
        const totalTerms = Vue.computed(() => availableLessons.value.reduce((total,entry) => total + (props.course?.[entry.key]?.lexicon?.length || 0),0));
        const filteredLessons = Vue.computed(() => {
            const search = normalize(catalogSearch.value);
            if(!search) return availableLessons.value;
            return availableLessons.value.filter(entry => {
                const fiche = props.course?.[entry.key];
                if(!fiche) return false;
                return normalize([
                    entry.name,fiche.title,fiche.subtitle,fiche.sourceSection,
                    ...(fiche.sections || []).flatMap(section => [section.title,...(section.paragraphs || [])]),
                    ...(fiche.lexicon || []).flatMap(term => [term.term,term.arabic,term.definition])
                ].join(' ')).includes(search);
            });
        });
        const lastLesson = Vue.computed(() => availableLessons.value.find(entry => entry.key === lastLessonKey.value) || null);
        const nextLesson = Vue.computed(() => {
            const index = availableLessons.value.findIndex(entry => entry.key === selectedLessonKey.value);
            return index >= 0 ? availableLessons.value[index + 1] || null : null;
        });
        const done = Vue.computed(() => !!completed.value[selectedLessonKey.value]);
        const storageKeyFor = key => storageKeys[key];
        const tabs = [
            { id:'cours', title:'Lire la fiche', icon:'book-open' },
            { id:'lexique', title:'Lexique', icon:'book-a' },
            { id:'quiz', title:'Se vérifier', icon:'check-circle-2' }
        ];
        const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
        const glossary = Vue.computed(() => {
            const entries = lesson.value?.lexicon || [];
            const search = normalize(glossarySearch.value);
            return !search ? entries : entries.filter(x => normalize([x.term,x.arabic,x.definition].join(' ')).includes(search));
        });
        const answerCount = Vue.computed(() => Object.keys(answers.value).length);
        const correctCount = Vue.computed(() => (lesson.value?.quiz || []).reduce((count,q,i) => count + (answers.value[i] === q.answer ? 1 : 0),0));
        const changeTab = id => {
            activeTab.value = id;
            Vue.nextTick(() => window.lucide?.createIcons());
        };
        const selectAnswer = (questionIndex, choiceIndex) => {
            answers.value = { ...answers.value, [questionIndex]:choiceIndex };
        };
        const toggleDone = () => {
            const key = selectedLessonKey.value, value = !done.value;
            completed.value = { ...completed.value, [key]:value };
            try {
                if (value) localStorage.setItem(storageKeyFor(key),'1');
                else localStorage.removeItem(storageKeyFor(key));
            } catch (_) { /* Le suivi reste optionnel si le stockage est désactivé. */ }
        };
        const selectLesson = key => {
            if (!lessonCatalog.some(entry => entry.key === key) || !props.course?.[key]) return;
            selectedLessonKey.value = key;
            lastLessonKey.value = key;
            answers.value = {};
            glossarySearch.value = '';
            changeTab('cours');
            try { localStorage.setItem('athar_fiqh_maliki_last_lesson',key); } catch (_) {}
            Vue.nextTick(() => { if(scrollArea.value) scrollArea.value.scrollTop = 0; window.lucide?.createIcons(); });
        };
        const handleBack = () => {
            if(selectedLessonKey.value) {
                selectedLessonKey.value = null;
                answers.value = {};
                Vue.nextTick(() => { if(scrollArea.value) scrollArea.value.scrollTop = 0; window.lucide?.createIcons(); });
            } else if(typeof props.goHome === 'function') props.goHome();
        };
        Vue.onMounted(() => {
            try {
                completed.value = Object.fromEntries(lessonCatalog.map(entry => [entry.key,localStorage.getItem(storageKeyFor(entry.key)) === '1']));
                lastLessonKey.value = localStorage.getItem('athar_fiqh_maliki_last_lesson');
            } catch (_) { /* Le stockage local peut être désactivé. */ }
            Vue.nextTick(() => window.lucide?.createIcons());
        });
        return { activeTab, glossarySearch, catalogSearch, answers, done, completed, completedCount, completionPercent, totalSections, totalTerms, availableLessons, filteredLessons, lastLesson, nextLesson, selectedLessonKey, scrollArea, lesson, tabs, glossary, answerCount, correctCount, changeTab, selectAnswer, selectLesson, handleBack, toggleDone };
    },
    template: `
    <div class="fiqh-m-root" v-if="course && course.intro">
        <div class="fiqh-m-scroll" ref="scrollArea">
            <div v-if="!selectedLessonKey" class="fiqh-m-index">
                <header class="fiqh-m-index-top">
                    <button type="button" class="fiqh-m-index-back" @click="handleBack"><i data-lucide="arrow-left" aria-hidden="true"></i> Accueil</button>
                    <div class="fiqh-m-index-brand"><span lang="ar" dir="rtl">الفقه المالكي</span><strong>Fiqh malikite</strong></div>
                    <span class="fiqh-m-index-top-note">PARCOURS D'ÉTUDE</span>
                </header>
                <div class="fiqh-m-index-main">
                    <section class="fiqh-m-index-hero" aria-labelledby="fiqh-m-index-heading">
                        <div class="fiqh-m-index-hero-copy">
                            <span class="fiqh-m-eyebrow">ÉTUDE DES TEXTES · ÉCOLE MALIKITE</span>
                            <p class="fiqh-m-index-arabic" lang="ar" dir="rtl">مَوَاهِبُ الْجَلِيلِ</p>
                            <h1 id="fiqh-m-index-heading">Fiqh malikite</h1>
                            <p>Étudier progressivement le <em>Mawâhib al-Jalîl</em> d'al-Hattâb : comprendre les formulations de Khalîl, les explications du commentaire et les avis rapportés.</p>
                            <div class="fiqh-m-index-stats">
                                <span>{{ availableLessons.length }} fiches</span>
                                <span>{{ totalSections }} parties</span>
                                <span>{{ totalTerms }} notions de lexique</span>
                            </div>
                        </div>
                        <div class="fiqh-m-index-progress">
                            <div class="fiqh-m-index-ring" :style="{ '--fm-progress': completionPercent + '%' }" :aria-label="completionPercent + '% de fiches lues'"><strong>{{ completionPercent }}%</strong></div>
                            <div><span>Progression locale</span><b>{{ completedCount }} fiche{{ completedCount > 1 ? 's' : '' }} lue{{ completedCount > 1 ? 's' : '' }} sur {{ availableLessons.length }}</b><p>Les données restent sur cet appareil.</p></div>
                        </div>
                    </section>

                    <div class="fiqh-m-index-tools">
                        <label class="fiqh-m-index-search"><i data-lucide="search" aria-hidden="true"></i><input v-model="catalogSearch" type="search" aria-label="Rechercher une fiche malikite" placeholder="Rechercher une fiche, une notion ou un sujet…"></label>
                        <button v-if="lastLesson" type="button" class="fiqh-m-index-resume" @click="selectLesson(lastLesson.key)"><i data-lucide="history" aria-hidden="true"></i><span>Reprendre : {{ course[lastLesson.key].title }}</span></button>
                    </div>

                    <section v-if="filteredLessons.length" class="fiqh-m-index-grid" aria-label="Fiches de fiqh malikite">
                        <article v-for="entry in filteredLessons" :key="entry.key" class="fiqh-m-catalog-card" :class="{ 'is-completed':completed[entry.key] }">
                            <button type="button" class="fiqh-m-catalog-main" @click="selectLesson(entry.key)" :aria-label="'Lire la fiche ' + course[entry.key].number + ' : ' + course[entry.key].title">
                                <div class="fiqh-m-catalog-number"><span>{{ course[entry.key].number }}</span><i v-if="completed[entry.key]" data-lucide="check-circle-2" aria-label="Fiche lue"></i></div>
                                <small>{{ entry.key === 'intro' ? 'DÉCOUVRIR L’OUVRAGE' : 'KITÂB AL-TAHÂRA · PURIFICATION' }}</small>
                                <h2>{{ course[entry.key].title }}</h2>
                                <p>{{ course[entry.key].subtitle }}</p>
                                <footer><span><i data-lucide="book-open" aria-hidden="true"></i> {{ course[entry.key].sections.length }} parties</span><strong>{{ completed[entry.key] ? 'Relire la fiche' : 'Lire la fiche' }} <i data-lucide="arrow-right" aria-hidden="true"></i></strong></footer>
                            </button>
                        </article>
                    </section>
                    <p v-else class="fiqh-m-index-empty" role="status">Aucune fiche ne correspond à votre recherche.</p>
                    <p class="fiqh-m-index-disclaimer">Supports pédagogiques fondés sur des passages identifiés du commentaire. Les synthèses ne constituent pas des fatwas. <a :href="course.book.sourceUrl" rel="noopener noreferrer" target="_blank">Consulter le livre original</a>.</p>
                </div>
            </div>
            <div v-else class="fiqh-m-wrap">
                <header class="fiqh-m-top">
                    <button class="fiqh-m-back" type="button" @click="handleBack" aria-label="Retour à toutes les fiches">
                        <i data-lucide="arrow-left" aria-hidden="true"></i> Toutes les fiches
                    </button>
                    <span class="fiqh-m-top-title">Athar <span aria-hidden="true">/</span> Fiqh malikite</span>
                    <span class="fiqh-m-top-state"><span class="fiqh-m-small-dot"></span> Fiche {{ lesson.number }}</span>
                </header>

                <section class="fiqh-m-hero" aria-labelledby="fiqh-m-heading">
                    <p class="fiqh-m-eyebrow">ÉTUDE DES TEXTES · ÉCOLE MALIKITE</p>
                    <p class="fiqh-m-arabic-heading" lang="ar" dir="rtl">{{ selectedLessonKey === 'intro' ? 'مَوَاهِبُ الْجَلِيلِ' : 'كِتَابُ الطَّهَارَةِ' }}</p>
                    <h1 id="fiqh-m-heading" v-if="selectedLessonKey === 'intro'">Comprendre le livre <em>avant les règles.</em></h1>
                    <h1 id="fiqh-m-heading" v-else-if="selectedLessonKey === 'purification'">Comprendre <em>la purification.</em></h1>
                    <h1 id="fiqh-m-heading" v-else-if="selectedLessonKey === 'naturalWaters'">Découvrir <em>les eaux naturelles.</em></h1>
                    <h1 id="fiqh-m-heading" v-else-if="selectedLessonKey === 'waterChanges'">Comprendre <em>l’eau modifiée.</em></h1>
                    <h1 id="fiqh-m-heading" v-else-if="selectedLessonKey === 'pureMixtures'">Étudier <em>les mélanges purs.</em></h1>
                    <h1 id="fiqh-m-heading" v-else>Étudier <em>l’eau et l’impureté.</em></h1>
                    <p class="fiqh-m-lead">{{ lesson.subtitle }}</p>
                    <div class="fiqh-m-hero-meta">
                        <span><i data-lucide="book-open" aria-hidden="true"></i> {{ course.book.authorArabic }}</span>
                        <span><i data-lucide="bookmark" aria-hidden="true"></i> {{ course.book.death }}</span>
                        <span><i data-lucide="layers" aria-hidden="true"></i> {{ availableLessons.length }} fiches disponibles</span>
                    </div>
                </section>

                <div class="fiqh-m-workspace">
                    <aside class="fiqh-m-sidebar" aria-label="Parcours du livre">
                        <p class="fiqh-m-aside-label">LE PARCOURS</p>
                        <p class="fiqh-m-aside-progress">{{ completedCount }} / {{ availableLessons.length }} fiches lues</p>
                        <button v-for="entry in availableLessons"
                            :key="entry.key" type="button" class="fiqh-m-current fiqh-m-lesson-link"
                            :class="{ 'is-selected':selectedLessonKey === entry.key }"
                            :aria-current="selectedLessonKey === entry.key ? 'step' : undefined"
                            @click="selectLesson(entry.key)">
                            <span class="fiqh-m-current-num">{{ course[entry.key].number }}</span>
                            <div>
                                <strong>{{ entry.name }}</strong>
                                <small>{{ completed[entry.key] ? 'Lue · accessible' : 'Accessible' }}</small>
                            </div>
                            <i data-lucide="check-circle-2" v-if="completed[entry.key]" aria-label="Terminée"></i>
                        </button>
                        <p class="fiqh-m-aside-label fiqh-m-aside-gap">ENSUITE, PROGRESSIVEMENT</p>
                        <div class="fiqh-m-coming">
                            <span class="fiqh-m-coming-num">07</span>
                            <div>
                                <span>{{ course.nextChapter.title }}</span>
                                <small>{{ course.nextChapter.status }}</small>
                            </div>
                            <i data-lucide="lock" aria-hidden="true"></i>
                        </div>
                        <p class="fiqh-m-aside-note">Chaque fiche possède son lexique, son quiz et un suivi de lecture indépendant. Les règles non encore étudiées ne sont pas présentées comme acquises.</p>
                    </aside>

                    <div class="fiqh-m-content">
                        <section class="fiqh-m-book-strip" aria-label="Référence du livre">
                            <div>
                                <span class="fiqh-m-eyebrow">NOTRE TEXTE DE RÉFÉRENCE</span>
                                <h2>{{ course.book.title }}</h2>
                                <p lang="ar" dir="rtl">{{ course.book.arabicTitle }}</p>
                                <span class="fiqh-m-book-details">{{ course.book.edition }}</span>
                            </div>
                            <a :href="course.book.sourceUrl" target="_blank" rel="noopener noreferrer" class="fiqh-m-source-button">
                                Consulter le livre <i data-lucide="external-link" aria-hidden="true"></i>
                            </a>
                        </section>

                        <nav class="fiqh-m-tabs" role="tablist" aria-label="Contenu de la fiche">
                            <button v-for="tab in tabs" :key="tab.id" type="button" role="tab"
                                :aria-selected="activeTab === tab.id" :class="{ 'is-active':activeTab === tab.id }"
                                @click="changeTab(tab.id)">
                                <i :data-lucide="tab.icon" aria-hidden="true"></i>{{ tab.title }}
                            </button>
                        </nav>

                        <div class="fiqh-m-tab-pane" v-if="activeTab === 'cours'" role="tabpanel">
                            <div class="fiqh-m-reader-heading">
                                <span class="fiqh-m-eyebrow">FICHE {{ lesson.number }} · {{ lesson.sourceSection }}</span>
                                <h2>{{ lesson.title }}</h2>
                                <p>Une fiche basée sur un passage identifié du livre. Les explications en français sont des synthèses pédagogiques, et non une traduction intégrale ni un avis juridique personnel.</p>
                            </div>

                            <div class="fiqh-m-prose">
                                <section v-for="section in lesson.sections" :key="section.id" class="fiqh-m-section">
                                    <span class="fiqh-m-section-index">{{ section.eyebrow }}</span>
                                    <h3>{{ section.title }}</h3>
                                    <p v-for="(paragraph,i) in section.paragraphs" :key="i">{{ paragraph }}</p>
                                    <p class="fiqh-m-reference"><i data-lucide="bookmark" aria-hidden="true"></i> {{ section.sourceNote }}</p>
                                </section>
                            </div>

                            <figure class="fiqh-m-quote">
                                <figcaption>UN COURT PASSAGE DU LIVRE</figcaption>
                                <blockquote lang="ar" dir="rtl">{{ lesson.quote.arabic }}</blockquote>
                                <p>{{ lesson.quote.meaning }}</p>
                                <small>{{ lesson.quote.label }}</small>
                            </figure>

                            <div class="fiqh-m-lesson-bottom">
                                <button type="button" class="fiqh-m-complete" :aria-pressed="done" :class="{ 'is-done':done }" @click="toggleDone">
                                    <i :data-lucide="done ? 'check-circle-2' : 'circle'" aria-hidden="true"></i>
                                    {{ done ? 'Fiche marquée comme lue' : 'Marquer la fiche comme lue' }}
                                </button>
                                <button type="button" class="fiqh-m-text-action" @click="changeTab('lexique')">
                                    Revoir les termes <i data-lucide="arrow-right" aria-hidden="true"></i>
                                </button>
                                <button v-if="nextLesson" type="button" class="fiqh-m-text-action" @click="selectLesson(nextLesson.key)">
                                    Fiche {{ course[nextLesson.key].number }} <i data-lucide="arrow-right" aria-hidden="true"></i>
                                </button>
                            </div>
                        </div>

                        <div class="fiqh-m-tab-pane" v-else-if="activeTab === 'lexique'" role="tabpanel">
                            <div class="fiqh-m-reader-heading">
                                <span class="fiqh-m-eyebrow">VOCABULAIRE ARABE — FRANÇAIS</span>
                                <h2>Les mots de la fiche {{ lesson.number }}</h2>
                                <p>{{ lesson.lexicon.length }} notions pour lire ce passage. Définitions pédagogiques d’Athar, non citations littérales du commentaire.</p>
                            </div>
                            <label class="fiqh-m-search"><i data-lucide="search" aria-hidden="true"></i>
                                <input v-model="glossarySearch" type="search" placeholder="Rechercher une notion…" aria-label="Rechercher dans le lexique malikite">
                            </label>
                            <div class="fiqh-m-terms">
                                <article v-for="term in glossary" :key="term.term" class="fiqh-m-term">
                                    <span class="fiqh-m-term-arabic" lang="ar" dir="rtl">{{ term.arabic }}</span>
                                    <h3>{{ term.term }}</h3>
                                    <p>{{ term.definition }}</p>
                                </article>
                            </div>
                            <p v-if="!glossary.length" class="fiqh-m-empty">Aucune notion trouvée.</p>
                        </div>

                        <div class="fiqh-m-tab-pane" v-else role="tabpanel">
                            <div class="fiqh-m-reader-heading">
                                <span class="fiqh-m-eyebrow">SE VÉRIFIER · {{ lesson.quiz.length }} QUESTIONS</span>
                                <h2>Qu’as-tu retenu ?</h2>
                                <p>Ces questions vérifient la compréhension du passage étudié ; elles ne constituent pas une fatwa.</p>
                            </div>
                            <div class="fiqh-m-quiz">
                                <section v-for="(q, index) in lesson.quiz" :key="index" class="fiqh-m-question">
                                    <span class="fiqh-m-question-number">QUESTION {{ String(index + 1).padStart(2,'0') }}</span>
                                    <h3>{{ q.question }}</h3>
                                    <div class="fiqh-m-choices">
                                        <button v-for="(choice,choiceIndex) in q.choices" :key="choiceIndex" type="button"
                                            :aria-pressed="answers[index] === choiceIndex"
                                            :class="{ 'is-picked':answers[index] === choiceIndex, 'is-correct':answers[index] === choiceIndex && choiceIndex === q.answer, 'is-wrong':answers[index] === choiceIndex && choiceIndex !== q.answer }"
                                            @click="selectAnswer(index,choiceIndex)">
                                            <span>{{ String.fromCharCode(65 + choiceIndex) }}</span>{{ choice }}
                                        </button>
                                    </div>
                                    <p v-if="answers[index] !== undefined" class="fiqh-m-answer">
                                        <strong>{{ answers[index] === q.answer ? 'Bonne réponse.' : 'À revoir.' }}</strong> {{ q.explanation }}
                                    </p>
                                </section>
                                <p class="fiqh-m-result" v-if="answerCount === lesson.quiz.length">
                                    {{ correctCount }} / {{ lesson.quiz.length }} réponses justes. Tu peux modifier tes réponses à tout moment.
                                </p>
                            </div>
                        </div>

                        <footer class="fiqh-m-footer">
                            <p><i data-lucide="shield-check" aria-hidden="true"></i> Support d’étude progressif. Ce prototype ne remplace pas l’étude auprès d’un enseignant et ne délivre pas de fatwas.</p>
                            <div>
                                <a v-for="source in lesson.sources" :key="source.url" :href="source.url" target="_blank" rel="noopener noreferrer">
                                    {{ source.label }} <i data-lucide="external-link" aria-hidden="true"></i>
                                </a>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
};
