const ReaderView = {
    props: [
        'chapter', 
        'settings', 
        'isFavorite', 
        'activeStoryId', 
        'quizAnswers', 
        'closeReader', 
        'shareChapter', 
        'toggleFavorite', 
        'adjustFontSize', 
        'toggleStory', 
        'handleQuizAnswer', 
        'goHome', 
        'formatText',
        'filteredChapters' // Indispensable pour la navigation Précédent/Suivant
    ],
    data() {
        return {
            activeTab: 'narrative', // narrative | timeline | hadiths | quiz
            audioPlaying: false,
            audioInstance: null,
            audioProgress: 0,
            showScore: false,
            score: 0
        }
    },
    watch: {
        // Si on change de chapitre via "Suivant", on remet tout à zéro
        'chapter.id': function() {
            this.activeTab = 'narrative';
            this.showScore = false;
            this.score = 0;
            if (this.audioInstance) {
                this.audioInstance.pause();
                this.audioInstance = null;
                this.audioPlaying = false;
                this.audioProgress = 0;
            }
            window.scrollTo(0, 0);
        }
    },
    computed: {
        // --- 1. SÉCURITÉ DES DONNÉES ---
        // Unifie les formats de données (quiz vs quizData, narratives vs stories)
        safeQuiz() {
            const rawData = this.chapter.quiz || this.chapter.quizData || [];
            return rawData.map(item => ({
                question: item.question || item.q,
                options: item.options || item.opts,
                correct: item.correct !== undefined ? item.correct : item.c,
                explanation: item.explanation || item.exp || "Réponse validée."
            }));
        },
        
        safeHadiths() {
            return Array.isArray(this.chapter.hadiths) ? this.chapter.hadiths : [];
        },

        // --- 2. LOGIQUE DE NAVIGATION ---
        neighbors() {
            if (!this.filteredChapters || this.filteredChapters.length === 0) return { prev: null, next: null };
            const idx = this.filteredChapters.findIndex(c => c.id === this.chapter.id);
            return {
                prev: idx > 0 ? this.filteredChapters[idx - 1] : null,
                next: idx < this.filteredChapters.length - 1 ? this.filteredChapters[idx + 1] : null
            };
        },

        // --- 3. UTILITAIRES ---
        quizProgress() {
            if (this.safeQuiz.length === 0) return 0;
            const answered = Object.keys(this.quizAnswers).filter(k => this.quizAnswers[k] !== undefined).length;
            return Math.round((answered / this.safeQuiz.length) * 100);
        },

        estimatedReadingTime() {
            // Calcul approximatif : 200 mots par minute
            let text = (this.chapter.intro || '') + (this.chapter.physicalDesc || '') + (this.chapter.genealogy || '');
            if (this.chapter.narratives) {
                this.chapter.narratives.forEach(n => text += (n.content || ''));
            }
            const words = text.split(/\s+/).length;
            const min = Math.ceil(words / 200);
            return min + " min";
        }
    },
    methods: {
        // --- GESTION AUDIO AVANCÉE ---
        toggleAudio() {
            if (!this.chapter.audioUrl) return;

            if (!this.audioInstance) {
                this.audioInstance = new Audio(this.chapter.audioUrl);
                
                // Mise à jour de la barre de progression
                this.audioInstance.ontimeupdate = () => {
                    if(this.audioInstance.duration) {
                        this.audioProgress = (this.audioInstance.currentTime / this.audioInstance.duration) * 100;
                    }
                };
                
                // Reset à la fin
                this.audioInstance.onended = () => {
                    this.audioPlaying = false;
                    this.audioProgress = 0;
                };
            }

            if (this.audioPlaying) {
                this.audioInstance.pause();
                this.audioPlaying = false;
            } else {
                this.audioInstance.play();
                this.audioPlaying = true;
            }
        },

        // --- STYLES DU QUIZ ---
        getQuizClass(qIdx, optIdx, correctIdx) {
            const userAnswer = this.quizAnswers[qIdx];
            
            // État neutre (pas encore répondu)
            if (userAnswer === undefined) {
                return 'bg-white dark:bg-brand-dark-lighter border-gray-200 dark:border-gray-700 hover:border-brand-gold hover:bg-brand-gold/5 text-gray-700 dark:text-gray-300';
            }
            // La bonne réponse (s'affiche toujours en vert)
            if (optIdx === correctIdx) {
                return 'bg-emerald-100 border-emerald-500 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-500 dark:text-emerald-400 font-bold shadow-inner transform scale-[1.01]';
            }
            // La mauvaise réponse sélectionnée (en rouge)
            if (userAnswer === optIdx && optIdx !== correctIdx) {
                return 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900/30 dark:border-red-500 dark:text-red-400 opacity-75';
            }
            // Les autres options (grisées)
            return 'bg-gray-50 dark:bg-brand-dark/50 border-transparent text-gray-400 opacity-40 cursor-not-allowed';
        },

        calculateScore() {
            if(this.safeQuiz.length === 0) return;
            let correct = 0;
            this.safeQuiz.forEach((q, idx) => {
                if(this.quizAnswers[idx] === q.correct) correct++;
            });
            this.score = correct;
            this.showScore = true;
            // Scroll vers le score pour être sûr qu'il est vu
            setTimeout(() => {
                const scoreEl = document.getElementById('score-result');
                if(scoreEl) scoreEl.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        },

        scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    },
    beforeUnmount() {
        if (this.audioInstance) {
            this.audioInstance.pause();
            this.audioInstance = null;
        }
    },
    template: `
    <div class="min-h-full bg-brand-paper dark:bg-brand-dark pb-20 relative selection:bg-brand-gold selection:text-white">
        
        <div class="md:hidden sticky top-0 z-50 bg-white/95 dark:bg-brand-dark-lighter/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 px-4 h-16 flex items-center justify-between shadow-sm transition-all duration-300">
            <button @click="closeReader" class="w-10 h-10 -ml-2 flex items-center justify-center text-gray-500 active:scale-90 transition-transform"><i data-lucide="arrow-left" class="w-5 h-5"></i></button>
            <div class="flex flex-col items-center max-w-[50%]">
                <span class="text-[10px] uppercase tracking-widest text-brand-gold font-bold">Biographie</span>
                <span class="font-display font-bold text-sm truncate text-brand-dark dark:text-white">{{ chapter.name }}</span>
            </div>
            <div class="flex gap-1">
                <button @click="adjustFontSize" class="w-10 h-10 flex items-center justify-center text-gray-500 active:scale-90"><i data-lucide="type" class="w-5 h-5"></i></button>
                <button @click="toggleFavorite(chapter.id)" :class="isFavorite(chapter.id) ? 'text-red-500' : 'text-gray-400'" class="w-10 h-10 flex items-center justify-center active:scale-90"><i data-lucide="heart" :class="['w-5 h-5 transition-colors', isFavorite(chapter.id) ? 'fill-current' : '']"></i></button>
            </div>
        </div>

        <div class="relative bg-brand-paper dark:bg-brand-dark-lighter border-b border-gray-200 dark:border-gray-800 pt-20 pb-16 md:py-24 px-6 text-center overflow-hidden">
            <div class="absolute inset-0 bg-islamic opacity-[0.07] dark:opacity-[0.03] pointer-events-none mix-blend-multiply dark:mix-blend-overlay"></div>
            <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/0 via-transparent to-brand-paper dark:to-brand-dark pointer-events-none"></div>
            
            <div class="hidden md:flex justify-between items-center absolute top-8 left-8 right-8 z-20">
                <button @click="closeReader" class="group flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-brand-dark dark:hover:text-white transition-colors">
                    <div class="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center group-hover:bg-brand-gold group-hover:border-brand-gold group-hover:text-white transition-all shadow-sm"><i data-lucide="arrow-left" class="w-4 h-4"></i></div>
                    <span>Retour Bibliothèque</span>
                </button>
                <div class="flex gap-3">
                    <button @click="shareChapter" class="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-brand-gold hover:border-brand-gold transition-all bg-white dark:bg-brand-dark shadow-sm" title="Partager"><i data-lucide="share-2" class="w-4 h-4"></i></button>
                    <button @click="adjustFontSize" class="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-brand-dark dark:hover:text-white hover:border-brand-dark transition-all bg-white dark:bg-brand-dark shadow-sm" title="Taille texte"><i data-lucide="type" class="w-4 h-4"></i></button>
                    <button @click="toggleFavorite(chapter.id)" class="w-10 h-10 flex items-center justify-center rounded-full border bg-white dark:bg-brand-dark shadow-sm transition-all" :class="isFavorite(chapter.id) ? 'border-red-200 bg-red-50 text-red-500' : 'border-gray-200 dark:border-gray-700 text-gray-400 hover:text-red-400 hover:border-red-200'"><i data-lucide="heart" :class="['w-4 h-4', isFavorite(chapter.id) ? 'fill-current' : '']"></i></button>
                </div>
            </div>

            <div class="relative z-10 animate-fade-in max-w-4xl mx-auto">
                <div class="flex items-center justify-center gap-3 mb-6">
                    <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-[10px] font-bold uppercase tracking-widest">
                        <span class="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse"></span>
                        {{ chapter.tags ? chapter.tags[0] : 'Biographie' }}
                    </span>
                    <span class="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        <i data-lucide="clock" class="w-3 h-3"></i> {{ estimatedReadingTime }}
                    </span>
                </div>

                <h1 class="font-display text-4xl md:text-7xl text-brand-dark dark:text-white mb-4 font-bold tracking-tight leading-tight drop-shadow-sm">{{ chapter.name }}</h1>
                <p class="font-arabic text-4xl md:text-6xl text-brand-gold/30 mb-8 select-none">{{ chapter.arabicName }}</p>
                
                <div class="flex items-center justify-center gap-6 mb-10">
                    <div class="h-px w-16 bg-gradient-to-r from-transparent to-brand-gold/40"></div>
                    <p class="font-serif italic text-gray-500 dark:text-gray-400 text-lg md:text-xl">« {{ chapter.subtitle }} »</p>
                    <div class="h-px w-16 bg-gradient-to-l from-transparent to-brand-gold/40"></div>
                </div>

                <div v-if="chapter.audioUrl" class="max-w-md mx-auto bg-white dark:bg-brand-dark shadow-xl rounded-2xl p-2 pr-6 flex items-center gap-4 border border-gray-100 dark:border-gray-700 relative overflow-hidden group hover:border-brand-gold/30 transition-colors">
                    <button @click="toggleAudio" class="w-12 h-12 rounded-xl bg-brand-gold text-white flex items-center justify-center shadow-lg shadow-brand-gold/30 hover:scale-105 active:scale-95 transition-all z-10 relative">
                        <i :data-lucide="audioPlaying ? 'pause' : 'play'" class="w-5 h-5 fill-current"></i>
                    </button>
                    <div class="flex-1 z-10">
                        <div class="flex justify-between items-center mb-1">
                            <div class="text-xs font-bold uppercase tracking-widest text-gray-400">Version Audio</div>
                            <div v-if="audioPlaying" class="flex gap-0.5 items-end h-3">
                                <div class="w-0.5 bg-brand-gold animate-[pulse_0.6s_ease-in-out_infinite] h-2"></div>
                                <div class="w-0.5 bg-brand-gold animate-[pulse_0.8s_ease-in-out_infinite] h-3"></div>
                                <div class="w-0.5 bg-brand-gold animate-[pulse_0.5s_ease-in-out_infinite] h-1.5"></div>
                            </div>
                        </div>
                        <div class="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden w-full">
                            <div class="h-full bg-brand-gold transition-all duration-300 ease-linear" :style="{ width: audioProgress + '%' }"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="sticky top-0 md:relative z-40 bg-white/90 dark:bg-brand-dark/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm overflow-x-auto no-scrollbar">
            <div class="max-w-4xl mx-auto flex justify-center min-w-max px-4">
                <button @click="activeTab = 'narrative'" class="relative py-4 px-6 md:px-8 text-xs font-bold uppercase tracking-widest transition-colors" :class="activeTab === 'narrative' ? 'text-brand-gold' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'">
                    Récit
                    <div v-if="activeTab === 'narrative'" class="absolute bottom-0 left-0 w-full h-0.5 bg-brand-gold"></div>
                </button>
                <button v-if="chapter.timeline && chapter.timeline.length" @click="activeTab = 'timeline'" class="relative py-4 px-6 md:px-8 text-xs font-bold uppercase tracking-widest transition-colors" :class="activeTab === 'timeline' ? 'text-brand-gold' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'">
                    Chronologie
                    <div v-if="activeTab === 'timeline'" class="absolute bottom-0 left-0 w-full h-0.5 bg-brand-gold"></div>
                </button>
                <button v-if="safeHadiths.length > 0" @click="activeTab = 'hadiths'" class="relative py-4 px-6 md:px-8 text-xs font-bold uppercase tracking-widest transition-colors" :class="activeTab === 'hadiths' ? 'text-brand-gold' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'">
                    Héritage
                    <div v-if="activeTab === 'hadiths'" class="absolute bottom-0 left-0 w-full h-0.5 bg-brand-gold"></div>
                </button>
                <button v-if="safeQuiz.length > 0" @click="activeTab = 'quiz'" class="relative py-4 px-6 md:px-8 text-xs font-bold uppercase tracking-widest transition-colors" :class="activeTab === 'quiz' ? 'text-brand-gold' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'">
                    Quiz
                    <div v-if="activeTab === 'quiz'" class="absolute bottom-0 left-0 w-full h-0.5 bg-brand-gold"></div>
                </button>
            </div>
        </div>

        <main class="max-w-4xl mx-auto px-4 md:px-6 py-12 min-h-[60vh] animate-slide-up" :style="{ fontSize: settings.fontSize + 'px' }">

            <div v-show="activeTab === 'narrative'" class="space-y-16">
                
                <div class="bg-white dark:bg-brand-dark-lighter rounded-2xl p-8 shadow-card border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-bl-[100px] transition-transform group-hover:scale-110"></div>
                    <div class="relative z-10">
                        <h3 class="font-display font-bold text-lg text-brand-dark dark:text-white mb-6 flex items-center gap-2">
                            <i data-lucide="fingerprint" class="w-5 h-5 text-brand-gold"></i> Identité & Profil
                        </h3>
                        <div class="grid md:grid-cols-2 gap-10 text-base leading-relaxed">
                            <div>
                                <span class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2 block">Généalogie</span>
                                <p class="text-gray-700 dark:text-gray-300 font-serif" v-html="formatText(chapter.genealogy)"></p>
                            </div>
                            <div>
                                <span class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2 block">Physionomie</span>
                                <p class="text-gray-600 dark:text-gray-400 italic font-serif">{{ chapter.physicalDesc }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="chapter.heroQuote" class="text-center py-8 px-4 md:px-12 relative">
                    <i class="absolute top-0 left-0 text-6xl font-serif text-brand-gold/10 font-bold">“</i>
                    <p class="font-serif text-2xl md:text-3xl text-brand-dark dark:text-gray-100 font-medium leading-relaxed">{{ chapter.heroQuote }}</p>
                    <i class="absolute bottom-0 right-0 text-6xl font-serif text-brand-gold/10 font-bold rotate-180">“</i>
                </div>

                <div class="space-y-6">
                    <div v-for="(story, index) in chapter.narratives" :key="story.id" 
                         class="bg-white dark:bg-brand-dark-lighter rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300"
                         :class="activeStoryId === story.id ? 'shadow-lg ring-1 ring-brand-gold border-brand-gold/50' : 'hover:border-brand-gold/30'">
                        
                        <button @click="toggleStory(story.id)" class="w-full flex justify-between items-center p-6 text-left focus:outline-none bg-gray-50/30 dark:bg-white/5 hover:bg-white dark:hover:bg-brand-dark-lighter transition-colors">
                            <div class="flex items-center gap-5">
                                <span class="font-display text-4xl font-bold text-gray-200 dark:text-white/10 group-hover:text-brand-gold/30 transition-colors">{{ String(index + 1).padStart(2, '0') }}</span>
                                <h3 class="font-bold text-lg md:text-xl text-brand-dark dark:text-white">{{ story.title }}</h3>
                            </div>
                            <div class="w-8 h-8 rounded-full bg-gray-100 dark:bg-brand-dark flex items-center justify-center transition-transform duration-300" :class="activeStoryId === story.id ? 'rotate-180 bg-brand-gold text-white' : 'text-gray-400'">
                                <i data-lucide="chevron-down" class="w-5 h-5"></i>
                            </div>
                        </button>

                        <div v-show="activeStoryId === story.id" class="px-6 md:px-8 pb-8 pt-4 animate-fade-in bg-white dark:bg-brand-dark-lighter">
                            <div class="prose prose-lg prose-brand dark:prose-invert max-w-none font-serif leading-loose text-justify text-gray-600 dark:text-gray-300">
                                <p v-html="formatText(story.content)"></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-show="activeTab === 'timeline'" class="max-w-2xl mx-auto py-8">
                <div class="relative pl-8 border-l-2 border-brand-gold/20 space-y-12">
                    <div v-for="(evt, i) in chapter.timeline" :key="i" class="relative group">
                        <div class="absolute -left-[41px] top-1 flex items-center justify-center w-6 h-6 bg-brand-paper dark:bg-brand-dark border-4 border-brand-gold rounded-full z-10 group-hover:scale-125 transition-transform shadow-[0_0_0_4px_rgba(255,255,255,1)] dark:shadow-[0_0_0_4px_rgba(26,28,35,1)]"></div>
                        
                        <div class="bg-white dark:bg-brand-dark-lighter p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all relative">
                            <span class="inline-block px-3 py-1 bg-brand-gold/10 text-brand-gold text-[10px] font-bold uppercase tracking-widest rounded-full mb-3">
                                {{ evt.year }}
                            </span>
                            <p class="text-gray-700 dark:text-gray-300 leading-relaxed font-serif" v-html="formatText(evt.desc)"></p>
                        </div>
                    </div>
                </div>
            </div>

            <div v-show="activeTab === 'hadiths'" class="space-y-8">
                <div v-if="safeHadiths.length > 0">
                    <div v-for="(h, index) in safeHadiths" :key="index" class="bg-white dark:bg-brand-dark-lighter p-8 md:p-12 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm text-center relative overflow-hidden group">
                        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-50"></div>
                        <div class="absolute top-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <i data-lucide="scroll" class="w-24 h-24"></i>
                        </div>
                        
                        <i class="block text-4xl text-brand-gold/30 font-serif font-bold mb-6">“</i>
                        <p class="font-serif text-xl md:text-2xl leading-loose text-brand-dark dark:text-gray-100 mb-8 relative z-10">{{ h.text }}</p>
                        
                        <div class="inline-flex flex-col items-center">
                            <div class="w-10 h-1 bg-brand-gold/20 mb-3"></div>
                            <p class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">{{ h.narrator }}</p>
                            <p class="text-xs text-brand-gold mt-1">{{ h.source }}</p>
                        </div>
                    </div>
                </div>
                <div v-else class="text-center py-20 bg-gray-50 dark:bg-brand-dark-lighter rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                    <div class="mb-4 opacity-30">
                        <i data-lucide="feather" class="w-12 h-12 mx-auto"></i>
                    </div>
                    <p class="text-gray-500 italic font-serif leading-loose px-8">
                        Aucun récit authentique n'a été répertorié pour ce compagnon dans cette section.
                    </p>
                </div>
            </div>

            <div v-show="activeTab === 'quiz'" class="max-w-2xl mx-auto space-y-10">
                <div class="text-center mb-8">
                    <h3 class="font-display text-2xl font-bold mb-2">Testez vos connaissances</h3>
                    <p class="text-gray-500 text-sm">Complétez le quiz pour valider votre lecture.</p>
                </div>

                <div v-for="(q, qIdx) in safeQuiz" :key="qIdx" class="bg-white dark:bg-brand-dark-lighter p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">
                    <div class="flex gap-4 mb-6">
                        <span class="flex-shrink-0 w-8 h-8 rounded-full bg-brand-gold text-white flex items-center justify-center font-bold font-serif">{{ qIdx + 1 }}</span>
                        <h4 class="font-bold text-lg text-brand-dark dark:text-gray-200 pt-0.5">{{ q.question }}</h4>
                    </div>

                    <div class="space-y-3 pl-12">
                        <button v-for="(opt, optIdx) in q.options" :key="optIdx"
                                @click="handleQuizAnswer(qIdx, optIdx, q.correct)"
                                :disabled="quizAnswers[qIdx] !== undefined"
                                class="w-full text-left p-4 rounded-xl border transition-all duration-300 flex justify-between items-center group relative overflow-hidden"
                                :class="getQuizClass(qIdx, optIdx, q.correct)">
                            
                            <span class="relative z-10 font-medium">{{ opt }}</span>
                            
                            <div class="relative z-10">
                                <i v-if="quizAnswers[qIdx] !== undefined && optIdx === q.correct" data-lucide="check-circle" class="w-5 h-5 text-emerald-600 dark:text-emerald-400"></i>
                                <i v-if="quizAnswers[qIdx] === optIdx && optIdx !== q.correct" data-lucide="x-circle" class="w-5 h-5 text-red-500"></i>
                            </div>
                        </button>
                    </div>

                    <div v-if="quizAnswers[qIdx] !== undefined" class="mt-6 ml-12 p-5 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800/30 animate-fade-in">
                        <div class="flex gap-3 items-start text-blue-800 dark:text-blue-300">
                            <i data-lucide="info" class="w-5 h-5 shrink-0 mt-0.5"></i>
                            <div class="text-sm leading-relaxed">
                                <strong class="block mb-1 font-bold uppercase tracking-wider text-xs">Le Saviez-vous ?</strong>
                                {{ q.explanation }}
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="quizProgress === 100" id="score-result" class="text-center py-10 animate-scale-in">
                    <button @click="calculateScore" v-if="!showScore" class="px-8 py-4 bg-brand-gold text-white rounded-full font-bold uppercase tracking-widest shadow-lg hover:bg-brand-gold-light transition-colors transform hover:-translate-y-1">
                        Voir mon score final
                    </button>
                    <div v-else class="bg-brand-dark text-white p-8 rounded-2xl shadow-xl inline-block relative overflow-hidden min-w-[300px]">
                        <div class="absolute inset-0 bg-islamic opacity-10"></div>
                        <div class="relative z-10">
                            <div class="text-xs uppercase tracking-widest text-gray-400 mb-2">Score Final</div>
                            <div class="font-display text-6xl font-bold text-brand-gold mb-2">{{ score }} / {{ safeQuiz.length }}</div>
                            <p class="text-gray-300 italic">{{ score === safeQuiz.length ? 'Parfait ! Ma sha Allah !' : 'Continuez vos efforts !' }}</p>
                        </div>
                    </div>
                </div>
            </div>

        </main>

        <div class="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-brand-dark-lighter py-8 mt-12">
            <div class="max-w-4xl mx-auto px-6 flex justify-between items-center">
                
                <div v-if="neighbors.prev" @click="$parent.openChapter(neighbors.prev)" class="group cursor-pointer flex flex-col items-start gap-1 text-left w-1/3 hover:bg-gray-50 dark:hover:bg-white/5 p-4 rounded-xl transition-colors">
                    <span class="text-[10px] uppercase tracking-widest text-gray-400 font-bold group-hover:text-brand-gold transition-colors flex items-center gap-1">
                        <i data-lucide="arrow-left" class="w-3 h-3"></i> Précédent
                    </span>
                    <span class="font-bold text-sm md:text-base text-brand-dark dark:text-white truncate w-full">
                        {{ neighbors.prev.name }}
                    </span>
                </div>
                <div v-else class="w-1/3"></div>

                <button @click="scrollToTop" class="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-brand-gold hover:border-brand-gold transition-all bg-brand-paper dark:bg-brand-dark shadow-sm">
                    <i data-lucide="arrow-up" class="w-5 h-5"></i>
                </button>

                <div v-if="neighbors.next" @click="$parent.openChapter(neighbors.next)" class="group cursor-pointer flex flex-col items-end gap-1 text-right w-1/3 hover:bg-gray-50 dark:hover:bg-white/5 p-4 rounded-xl transition-colors">
                    <span class="text-[10px] uppercase tracking-widest text-gray-400 font-bold group-hover:text-brand-gold transition-colors flex items-center gap-1">
                        Suivant <i data-lucide="arrow-right" class="w-3 h-3"></i>
                    </span>
                    <span class="font-bold text-sm md:text-base text-brand-dark dark:text-white truncate w-full">
                        {{ neighbors.next.name }}
                    </span>
                </div>
                <div v-else class="w-1/3"></div>

            </div>
        </div>

    </div>
    `
};