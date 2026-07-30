const TasbihView = {
    emits: ['close-view'],
    setup() {
        const { ref, reactive, computed, watch, onMounted, onUnmounted, nextTick } = Vue;
        const STORAGE_KEY = 'athar_tasbih_v2';
        const LEGACY_KEY = 'athar_tasbih_data';
        const RADIUS = 46;
        const circumference = 2 * Math.PI * RADIUS;

        const presets = [
            { id: 'subhanallah', label: 'Tasbīḥ', arabic: 'سُبْحَانَ اللَّهِ', transliteration: 'Subḥāna llāh', meaning: 'Gloire et pureté à Allah.', icon: 'sparkles', accent: '#0f766e' },
            { id: 'alhamdulillah', label: 'Taḥmīd', arabic: 'الْحَمْدُ لِلَّهِ', transliteration: 'Al-ḥamdu li-llāh', meaning: 'Toute louange appartient à Allah.', icon: 'sun', accent: '#b7791f' },
            { id: 'allahuakbar', label: 'Takbīr', arabic: 'اللَّهُ أَكْبَرُ', transliteration: 'Allāhu akbar', meaning: 'Allah est plus grand.', icon: 'mountain', accent: '#7c3aed' },
            { id: 'tahlil', label: 'Tahlīl', arabic: 'لَا إِلٰهَ إِلَّا اللَّهُ', transliteration: 'Lā ilāha illā Allāh', meaning: 'Nulle divinité digne d’adoration si ce n’est Allah.', icon: 'circle-dot', accent: '#2563eb' },
            { id: 'istighfar', label: 'Istighfār', arabic: 'أَسْتَغْفِرُ اللَّهَ', transliteration: 'Astaghfiru llāh', meaning: 'Je demande pardon à Allah.', icon: 'droplets', accent: '#be185d' },
            { id: 'salawat', label: 'Ṣalawāt', arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ', transliteration: 'Allāhumma ṣalli ʿalā Muḥammad', meaning: 'Ô Allah, accorde Tes bénédictions à Muḥammad.', icon: 'heart', accent: '#c2410c' }
        ];

        const state = reactive({
            mode: 'session',
            selectedId: 'subhanallah',
            count: 0,
            cycles: 0,
            sessionTotal: 0,
            sessionStartedAt: null,
            elapsedSeconds: 0,
            paused: false,
            goal: 33,
            unlimited: false,
            totals: {},
            history: [],
            customDhikrs: [],
            settings: {
                vibration: true,
                sound: false,
                autoCycle: true,
                keepAwake: false,
                largeArabic: true
            },
            notice: '',
            goalPulse: false,
            confirmAction: '',
            showCustomForm: false,
            customGoalDraft: 250
        });

        const customDraft = reactive({ label: '', arabic: '', transliteration: '', meaning: '', goal: 33 });
        const isFullscreen = ref(false);
        let timer = null;
        let noticeTimer = null;
        let pulseTimer = null;
        let wakeLock = null;
        let audioContext = null;

        const allDhikrs = computed(() => [...presets, ...state.customDhikrs]);
        const selected = computed(() => allDhikrs.value.find(item => item.id === state.selectedId) || allDhikrs.value[0]);
        const progress = computed(() => state.unlimited ? 0 : Math.min(state.count / Math.max(state.goal, 1), 1));
        const progressOffset = computed(() => circumference * (1 - progress.value));
        const goalLabel = computed(() => state.unlimited ? '∞' : state.goal.toLocaleString('fr-FR'));
        const sessionRate = computed(() => state.elapsedSeconds > 0 ? Math.round(state.sessionTotal / (state.elapsedSeconds / 60)) : 0);
        const totalAll = computed(() => Object.values(state.totals).reduce((sum, value) => sum + Number(value || 0), 0));
        const recentHistory = computed(() => state.history.slice(0, 20));
        const selectedTotal = computed(() => Number(state.totals[state.selectedId] || 0));

        const localDayKey = (date = new Date()) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const todayTotal = computed(() => {
            const today = localDayKey();
            const archived = state.history.filter(item => item.dayKey === today).reduce((sum, item) => sum + item.total, 0);
            return archived + (state.sessionTotal > 0 ? state.sessionTotal : 0);
        });

        const weeklyData = computed(() => {
            const result = [];
            for (let offset = 6; offset >= 0; offset -= 1) {
                const date = new Date();
                date.setDate(date.getDate() - offset);
                const key = localDayKey(date);
                let total = state.history.filter(item => item.dayKey === key).reduce((sum, item) => sum + item.total, 0);
                if (key === localDayKey()) total += state.sessionTotal;
                result.push({
                    key,
                    label: new Intl.DateTimeFormat('fr-FR', { weekday: 'short' }).format(date).replace('.', ''),
                    total
                });
            }
            const maximum = Math.max(...result.map(item => item.total), 1);
            return result.map(item => ({ ...item, percent: Math.max(item.total ? 10 : 2, Math.round(item.total * 100 / maximum)) }));
        });

        const streak = computed(() => {
            const activeDays = new Set(state.history.filter(item => item.total > 0).map(item => item.dayKey));
            if (state.sessionTotal > 0) activeDays.add(localDayKey());
            let cursor = new Date();
            if (!activeDays.has(localDayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
            let count = 0;
            while (activeDays.has(localDayKey(cursor))) {
                count += 1;
                cursor.setDate(cursor.getDate() - 1);
            }
            return count;
        });

        const topDhikr = computed(() => {
            const entries = allDhikrs.value.map(item => ({ ...item, total: Number(state.totals[item.id] || 0) }));
            return entries.sort((a, b) => b.total - a.total)[0] || null;
        });

        const formatDuration = (seconds) => {
            const safe = Math.max(0, Number(seconds || 0));
            const minutes = Math.floor(safe / 60);
            const rest = safe % 60;
            return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
        };

        const historyDate = (value) => new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
        }).format(new Date(value));

        const notify = (message) => {
            state.notice = message;
            clearTimeout(noticeTimer);
            noticeTimer = setTimeout(() => { state.notice = ''; }, 2300);
        };

        const refreshIcons = () => nextTick(() => window.lucide?.createIcons());

        const persist = () => {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify({
                    version: 2,
                    selectedId: state.selectedId,
                    count: state.count,
                    cycles: state.cycles,
                    sessionTotal: state.sessionTotal,
                    sessionStartedAt: state.sessionStartedAt,
                    elapsedSeconds: state.elapsedSeconds,
                    paused: state.paused,
                    goal: state.goal,
                    unlimited: state.unlimited,
                    totals: state.totals,
                    history: state.history.slice(0, 100),
                    customDhikrs: state.customDhikrs,
                    settings: state.settings
                }));
            } catch (error) {
                console.warn('Tasbih: sauvegarde locale indisponible', error);
            }
        };

        const migrateLegacy = () => {
            try {
                const legacy = JSON.parse(localStorage.getItem(LEGACY_KEY) || 'null');
                if (!legacy || !Array.isArray(legacy.dhikrCounts)) return;
                const nameMap = { Tasbih: 'subhanallah', Tahmid: 'alhamdulillah', Takbir: 'allahuakbar', Istighfar: 'istighfar', Tahlil: 'tahlil' };
                legacy.dhikrCounts.forEach(item => {
                    const id = nameMap[item.name];
                    if (id) state.totals[id] = Number(item.totalCount || 0);
                });
                const legacyGoals = [33, 99, 100];
                state.goal = legacyGoals[Number(legacy.goalIndex || 0)] || 33;
            } catch (error) {
                console.warn('Tasbih: migration ignorée', error);
            }
        };

        const load = () => {
            try {
                const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
                if (!saved) {
                    migrateLegacy();
                    return;
                }
                state.selectedId = saved.selectedId || state.selectedId;
                state.count = Number(saved.count || 0);
                state.cycles = Number(saved.cycles || 0);
                state.sessionTotal = Number(saved.sessionTotal || 0);
                state.sessionStartedAt = saved.sessionStartedAt || null;
                state.elapsedSeconds = Number(saved.elapsedSeconds || 0);
                state.paused = Boolean(saved.paused);
                state.goal = Math.max(1, Number(saved.goal || 33));
                state.unlimited = Boolean(saved.unlimited);
                state.totals = saved.totals && typeof saved.totals === 'object' ? saved.totals : {};
                state.history = Array.isArray(saved.history) ? saved.history : [];
                state.customDhikrs = Array.isArray(saved.customDhikrs) ? saved.customDhikrs : [];
                state.settings = { ...state.settings, ...(saved.settings || {}) };
            } catch (error) {
                console.warn('Tasbih: données locales invalides', error);
                migrateLegacy();
            }
        };

        const ensureSessionStarted = () => {
            if (!state.sessionStartedAt) state.sessionStartedAt = Date.now();
            state.paused = false;
        };

        const vibrate = (pattern) => {
            if (state.settings.vibration && navigator.vibrate) navigator.vibrate(pattern);
        };

        const playSound = (success = false) => {
            if (!state.settings.sound) return;
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (!AudioContext) return;
                audioContext = audioContext || new AudioContext();
                const oscillator = audioContext.createOscillator();
                const gain = audioContext.createGain();
                oscillator.frequency.value = success ? 620 : 390;
                gain.gain.setValueAtTime(0.028, audioContext.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + (success ? 0.12 : 0.055));
                oscillator.connect(gain).connect(audioContext.destination);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + (success ? 0.13 : 0.06));
            } catch (error) {
                console.warn('Tasbih: son indisponible', error);
            }
        };

        const celebrateGoal = () => {
            state.goalPulse = true;
            clearTimeout(pulseTimer);
            pulseTimer = setTimeout(() => { state.goalPulse = false; }, 700);
            vibrate([45, 55, 45]);
            playSound(true);
            notify(`Objectif de ${state.goal.toLocaleString('fr-FR')} atteint`);
        };

        const increment = () => {
            if (!selected.value) return;
            if (!state.unlimited && !state.settings.autoCycle && state.count >= state.goal) {
                notify('Objectif atteint : termine la séance ou active les cycles automatiques.');
                return;
            }
            ensureSessionStarted();
            state.count += 1;
            state.sessionTotal += 1;
            state.totals[state.selectedId] = Number(state.totals[state.selectedId] || 0) + 1;
            vibrate(12);
            playSound(false);

            if (!state.unlimited && state.count >= state.goal) {
                state.cycles += 1;
                celebrateGoal();
                if (state.settings.autoCycle) state.count = 0;
                else state.count = state.goal;
            }
        };

        const undo = () => {
            if (state.sessionTotal <= 0) return;
            if (!state.unlimited && state.settings.autoCycle && state.count === 0 && state.cycles > 0) {
                state.cycles -= 1;
                state.count = Math.max(state.goal - 1, 0);
            } else {
                state.count = Math.max(state.count - 1, 0);
            }
            state.sessionTotal -= 1;
            state.totals[state.selectedId] = Math.max(Number(state.totals[state.selectedId] || 0) - 1, 0);
            vibrate(8);
            notify('Dernier comptage annulé');
        };

        const resetSessionState = () => {
            state.count = 0;
            state.cycles = 0;
            state.sessionTotal = 0;
            state.sessionStartedAt = null;
            state.elapsedSeconds = 0;
            state.paused = false;
        };

        const finishSession = (silent = false) => {
            if (state.sessionTotal <= 0) {
                if (!silent) notify('La séance est encore vide.');
                return false;
            }
            state.history.unshift({
                id: `session-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                dhikrId: state.selectedId,
                label: selected.value.label,
                arabic: selected.value.arabic,
                total: state.sessionTotal,
                cycles: state.cycles,
                goal: state.unlimited ? null : state.goal,
                duration: state.elapsedSeconds,
                endedAt: Date.now(),
                dayKey: localDayKey()
            });
            state.history = state.history.slice(0, 100);
            const completed = state.sessionTotal;
            resetSessionState();
            if (!silent) notify(`Séance enregistrée : ${completed.toLocaleString('fr-FR')} répétitions`);
            return true;
        };

        const discardSession = () => {
            state.totals[state.selectedId] = Math.max(Number(state.totals[state.selectedId] || 0) - state.sessionTotal, 0);
            resetSessionState();
            notify('Séance en cours effacée');
        };

        const selectDhikr = (id) => {
            if (id === state.selectedId) {
                state.mode = 'session';
                return;
            }
            if (state.sessionTotal > 0) finishSession(true);
            state.selectedId = id;
            resetSessionState();
            state.mode = 'session';
            notify('Nouveau dhikr sélectionné');
            refreshIcons();
        };

        const setGoal = (value) => {
            if (value === 'infinite') {
                state.unlimited = true;
                state.count = state.sessionTotal;
                state.cycles = 0;
                notify('Mode libre activé');
                return;
            }
            const nextGoal = Math.max(1, Math.min(100000, Number(value || 1)));
            state.unlimited = false;
            state.goal = nextGoal;
            state.cycles = Math.floor(state.sessionTotal / nextGoal);
            state.count = state.sessionTotal % nextGoal;
            notify(`Objectif fixé à ${nextGoal.toLocaleString('fr-FR')}`);
        };

        const applyCustomGoal = () => setGoal(state.customGoalDraft);

        const pauseSession = () => {
            if (!state.sessionStartedAt) return;
            state.paused = !state.paused;
            notify(state.paused ? 'Séance en pause' : 'Séance reprise');
        };

        const toggleSetting = async (key) => {
            state.settings[key] = !state.settings[key];
            if (key === 'keepAwake') await syncWakeLock();
            refreshIcons();
        };

        const syncWakeLock = async () => {
            try {
                if (wakeLock) {
                    await wakeLock.release();
                    wakeLock = null;
                }
                if (state.settings.keepAwake && 'wakeLock' in navigator && document.visibilityState === 'visible') {
                    wakeLock = await navigator.wakeLock.request('screen');
                    wakeLock.addEventListener('release', () => { wakeLock = null; }, { once: true });
                }
            } catch (error) {
                state.settings.keepAwake = false;
                notify('Le maintien de l’écran éveillé est indisponible.');
            }
        };

        const toggleFullscreen = async () => {
            try {
                if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
                else await document.exitFullscreen();
            } catch (error) {
                notify('Le mode plein écran est indisponible.');
            }
        };

        const addCustomDhikr = () => {
            const label = customDraft.label.trim();
            const arabic = customDraft.arabic.trim();
            if (!label || !arabic) {
                notify('Ajoute au minimum un nom et le texte arabe.');
                return;
            }
            const item = {
                id: `custom-${Date.now()}`,
                label,
                arabic,
                transliteration: customDraft.transliteration.trim(),
                meaning: customDraft.meaning.trim() || 'Formule personnalisée.',
                icon: 'bookmark',
                accent: '#64748b',
                custom: true
            };
            state.customDhikrs.push(item);
            state.showCustomForm = false;
            state.selectedId = item.id;
            setGoal(customDraft.goal || 33);
            resetSessionState();
            Object.assign(customDraft, { label: '', arabic: '', transliteration: '', meaning: '', goal: 33 });
            state.mode = 'session';
            notify('Dhikr personnalisé ajouté');
            refreshIcons();
        };

        const removeCustomDhikr = (id) => {
            const item = state.customDhikrs.find(entry => entry.id === id);
            if (!item) return;
            state.customDhikrs = state.customDhikrs.filter(entry => entry.id !== id);
            if (state.selectedId === id) {
                resetSessionState();
                state.selectedId = presets[0].id;
            }
            notify('Dhikr personnalisé supprimé');
        };

        const runConfirmedAction = () => {
            if (state.confirmAction === 'discard') discardSession();
            if (state.confirmAction === 'history') {
                state.history = [];
                notify('Historique effacé');
            }
            if (state.confirmAction === 'all') {
                state.totals = {};
                state.history = [];
                resetSessionState();
                notify('Toutes les statistiques ont été réinitialisées');
            }
            state.confirmAction = '';
        };

        const setMode = (mode) => {
            state.mode = mode;
            refreshIcons();
        };

        const handleKeydown = (event) => {
            const target = event.target;
            const interactive = target && ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(target.tagName);
            if (interactive || state.mode !== 'session' || state.confirmAction) return;
            if (event.code === 'Space' || event.code === 'Enter') {
                event.preventDefault();
                increment();
            }
            if (event.code === 'Backspace') {
                event.preventDefault();
                undo();
            }
        };

        const handleVisibility = () => {
            if (document.visibilityState === 'visible') syncWakeLock();
        };

        watch(state, persist, { deep: true });

        onMounted(() => {
            load();
            timer = setInterval(() => {
                if (state.sessionStartedAt && !state.paused) state.elapsedSeconds += 1;
            }, 1000);
            window.addEventListener('keydown', handleKeydown);
            document.addEventListener('fullscreenchange', () => { isFullscreen.value = Boolean(document.fullscreenElement); });
            document.addEventListener('visibilitychange', handleVisibility);
            syncWakeLock();
            refreshIcons();
        });

        onUnmounted(async () => {
            clearInterval(timer);
            clearTimeout(noticeTimer);
            clearTimeout(pulseTimer);
            window.removeEventListener('keydown', handleKeydown);
            document.removeEventListener('visibilitychange', handleVisibility);
            if (wakeLock) await wakeLock.release().catch(() => {});
            if (audioContext) await audioContext.close().catch(() => {});
        });

        return {
            state, customDraft, presets, allDhikrs, selected, circumference, progressOffset, progress,
            goalLabel, sessionRate, totalAll, selectedTotal, todayTotal, weeklyData, streak, topDhikr,
            recentHistory, isFullscreen, formatDuration, historyDate, increment, undo, finishSession,
            selectDhikr, setGoal, applyCustomGoal, pauseSession, toggleSetting, toggleFullscreen,
            addCustomDhikr, removeCustomDhikr, runConfirmedAction, setMode
        };
    },
    template: `
    <section class="tasbih-pro-shell" :style="{ '--tasbih-accent': selected?.accent || '#c5a059' }">
        <div class="tasbih-pro-container">
            <header class="tasbih-pro-header">
                <div class="tasbih-pro-title">
                    <span><i data-lucide="circle-dot-dashed"></i> Compteur de dhikr</span>
                    <h1>Un espace calme pour <em>se rappeler</em></h1>
                    <p>Comptez une formule, organisez une séance et suivez votre régularité sans transformer le dhikr en compétition.</p>
                </div>
                <div class="tasbih-pro-header-actions">
                    <button type="button" @click="toggleFullscreen" :title="isFullscreen ? 'Quitter le plein écran' : 'Passer en plein écran'"><i :data-lucide="isFullscreen ? 'minimize-2' : 'maximize-2'"></i></button>
                    <button type="button" @click="$emit('close-view')" title="Retour à l’accueil"><i data-lucide="x"></i></button>
                </div>
            </header>

            <nav class="tasbih-pro-tabs" aria-label="Sections du Tasbih">
                <button type="button" :class="{ active: state.mode === 'session' }" @click="setMode('session')"><i data-lucide="mouse-pointer-click"></i> Compter</button>
                <button type="button" :class="{ active: state.mode === 'library' }" @click="setMode('library')"><i data-lucide="library"></i> Dhikr</button>
                <button type="button" :class="{ active: state.mode === 'progress' }" @click="setMode('progress')"><i data-lucide="chart-no-axes-column-increasing"></i> Progression</button>
            </nav>

            <div v-if="state.mode === 'session'" class="tasbih-session-layout">
                <aside class="tasbih-preset-panel">
                    <div class="tasbih-panel-heading"><span>Formule active</span><strong>{{ allDhikrs.length }} choix</strong></div>
                    <div class="tasbih-preset-list">
                        <button v-for="item in allDhikrs" :key="item.id" type="button" class="tasbih-preset-row" :class="{ active: item.id === state.selectedId }" :style="{ '--item-accent': item.accent }" @click="selectDhikr(item.id)">
                            <span><i :data-lucide="item.icon"></i></span>
                            <div><strong>{{ item.label }}</strong><small dir="rtl" lang="ar">{{ item.arabic }}</small></div>
                            <b>{{ Number(state.totals[item.id] || 0).toLocaleString('fr-FR') }}</b>
                        </button>
                    </div>
                    <button type="button" class="tasbih-add-shortcut" @click="state.showCustomForm = true; setMode('library')"><i data-lucide="plus"></i> Ajouter une formule</button>
                </aside>

                <main class="tasbih-counter-card" :class="{ 'goal-reached': state.goalPulse }">
                    <div class="tasbih-session-meta">
                        <span><i data-lucide="timer"></i>{{ formatDuration(state.elapsedSeconds) }}</span>
                        <span><i data-lucide="gauge"></i>{{ sessionRate }} / min</span>
                        <span><i data-lucide="repeat-2"></i>{{ state.cycles }} cycle{{ state.cycles > 1 ? 's' : '' }}</span>
                    </div>

                    <div class="tasbih-arabic-block" :class="{ large: state.settings.largeArabic }">
                        <p dir="rtl" lang="ar">{{ selected.arabic }}</p>
                        <strong>{{ selected.transliteration }}</strong>
                        <span>{{ selected.meaning }}</span>
                    </div>

                    <button type="button" class="tasbih-counter-button" @click="increment" :aria-label="'Ajouter une répétition de ' + selected.label">
                        <svg viewBox="0 0 100 100" aria-hidden="true">
                            <circle class="tasbih-ring-track" cx="50" cy="50" :r="46"></circle>
                            <circle v-if="!state.unlimited" class="tasbih-ring-progress" cx="50" cy="50" :r="46" :stroke-dasharray="circumference" :stroke-dashoffset="progressOffset"></circle>
                        </svg>
                        <span class="tasbih-counter-inner">
                            <small>{{ state.paused ? 'EN PAUSE' : 'APPUYER' }}</small>
                            <strong>{{ state.count.toLocaleString('fr-FR') }}</strong>
                            <b>{{ state.unlimited ? 'mode libre' : '/ ' + goalLabel }}</b>
                        </span>
                    </button>

                    <div class="tasbih-keyboard-hint"><kbd>Espace</kbd> ou clic pour compter · <kbd>Retour</kbd> pour annuler</div>

                    <div class="tasbih-session-actions">
                        <button type="button" @click="undo" :disabled="state.sessionTotal === 0"><i data-lucide="undo-2"></i><span>Annuler</span></button>
                        <button type="button" @click="pauseSession" :disabled="!state.sessionStartedAt"><i :data-lucide="state.paused ? 'play' : 'pause'"></i><span>{{ state.paused ? 'Reprendre' : 'Pause' }}</span></button>
                        <button type="button" class="primary" @click="finishSession"><i data-lucide="check"></i><span>Terminer</span></button>
                        <button type="button" class="danger" @click="state.confirmAction = 'discard'" :disabled="state.sessionTotal === 0"><i data-lucide="trash-2"></i><span>Effacer</span></button>
                    </div>
                </main>

                <aside class="tasbih-control-panel">
                    <section>
                        <div class="tasbih-panel-heading"><span>Objectif personnel</span><strong>{{ goalLabel }}</strong></div>
                        <div class="tasbih-goal-grid">
                            <button v-for="value in [33, 100, 500]" :key="value" type="button" :class="{ active: !state.unlimited && state.goal === value }" @click="setGoal(value)">{{ value }}</button>
                            <button type="button" :class="{ active: state.unlimited }" @click="setGoal('infinite')">∞</button>
                        </div>
                        <div class="tasbih-custom-goal"><input v-model.number="state.customGoalDraft" type="number" min="1" max="100000" aria-label="Objectif personnalisé"><button type="button" @click="applyCustomGoal">Appliquer</button></div>
                        <p class="tasbih-editorial-note">Ces nombres sont des réglages personnels. Ils ne présentent pas chaque formule comme prescrite avec ce nombre.</p>
                    </section>

                    <section>
                        <div class="tasbih-panel-heading"><span>Confort de séance</span><strong>Local</strong></div>
                        <button type="button" class="tasbih-setting-row" :class="{ active: state.settings.autoCycle }" @click="toggleSetting('autoCycle')"><i data-lucide="repeat-2"></i><span><strong>Cycles automatiques</strong><small>Repartir à zéro à chaque objectif</small></span><b></b></button>
                        <button type="button" class="tasbih-setting-row" :class="{ active: state.settings.vibration }" @click="toggleSetting('vibration')"><i data-lucide="smartphone"></i><span><strong>Vibration</strong><small>Retour tactile discret</small></span><b></b></button>
                        <button type="button" class="tasbih-setting-row" :class="{ active: state.settings.sound }" @click="toggleSetting('sound')"><i data-lucide="volume-2"></i><span><strong>Son</strong><small>Clic sonore facultatif</small></span><b></b></button>
                        <button type="button" class="tasbih-setting-row" :class="{ active: state.settings.keepAwake }" @click="toggleSetting('keepAwake')"><i data-lucide="sun"></i><span><strong>Écran éveillé</strong><small>Selon la compatibilité du navigateur</small></span><b></b></button>
                        <button type="button" class="tasbih-setting-row" :class="{ active: state.settings.largeArabic }" @click="toggleSetting('largeArabic')"><i data-lucide="languages"></i><span><strong>Arabe agrandi</strong><small>Lecture plus confortable</small></span><b></b></button>
                    </section>

                    <section class="tasbih-live-summary">
                        <div><span>Séance</span><strong>{{ state.sessionTotal.toLocaleString('fr-FR') }}</strong></div>
                        <div><span>Aujourd’hui</span><strong>{{ todayTotal.toLocaleString('fr-FR') }}</strong></div>
                        <div><span>Total de la formule</span><strong>{{ selectedTotal.toLocaleString('fr-FR') }}</strong></div>
                    </section>
                </aside>
            </div>

            <section v-else-if="state.mode === 'library'" class="tasbih-library-view">
                <header class="tasbih-section-heading"><div><span>Bibliothèque personnelle</span><h2>Choisir une formule de dhikr</h2></div><button type="button" @click="state.showCustomForm = !state.showCustomForm"><i :data-lucide="state.showCustomForm ? 'x' : 'plus'"></i>{{ state.showCustomForm ? 'Fermer' : 'Ajouter' }}</button></header>

                <form v-if="state.showCustomForm" class="tasbih-custom-form" @submit.prevent="addCustomDhikr">
                    <div><label>Nom court<input v-model="customDraft.label" type="text" maxlength="40" placeholder="Ex. Duʿāʾ personnel"></label><label>Texte arabe<input v-model="customDraft.arabic" type="text" dir="rtl" lang="ar" maxlength="180" placeholder="النص العربي"></label></div>
                    <div><label>Translittération<input v-model="customDraft.transliteration" type="text" maxlength="180"></label><label>Sens ou rappel<input v-model="customDraft.meaning" type="text" maxlength="220"></label><label>Objectif initial<input v-model.number="customDraft.goal" type="number" min="1" max="100000"></label></div>
                    <p>Vérifie toi-même le texte ajouté : l’application l’enregistre uniquement sur cet appareil.</p>
                    <button type="submit"><i data-lucide="save"></i> Enregistrer la formule</button>
                </form>

                <div class="tasbih-dhikr-grid">
                    <article v-for="item in allDhikrs" :key="item.id" class="tasbih-dhikr-card" :style="{ '--item-accent': item.accent }">
                        <div class="tasbih-dhikr-card-head"><span><i :data-lucide="item.icon"></i></span><small>{{ item.custom ? 'Personnel' : 'Sélection proposée' }}</small><button v-if="item.custom" type="button" @click="removeCustomDhikr(item.id)" aria-label="Supprimer"><i data-lucide="trash-2"></i></button></div>
                        <p dir="rtl" lang="ar">{{ item.arabic }}</p><h3>{{ item.label }}</h3><strong>{{ item.transliteration }}</strong><span>{{ item.meaning }}</span>
                        <footer><div><small>Total local</small><b>{{ Number(state.totals[item.id] || 0).toLocaleString('fr-FR') }}</b></div><button type="button" @click="selectDhikr(item.id)"><i data-lucide="play"></i> Compter</button></footer>
                    </article>
                </div>
            </section>

            <section v-else class="tasbih-progress-view">
                <header class="tasbih-section-heading"><div><span>Progression locale</span><h2>Regarder la régularité, pas la performance</h2></div><button type="button" @click="state.confirmAction = 'all'"><i data-lucide="rotate-ccw"></i> Réinitialiser</button></header>

                <div class="tasbih-stats-grid">
                    <article><i data-lucide="calendar-days"></i><span>Aujourd’hui</span><strong>{{ todayTotal.toLocaleString('fr-FR') }}</strong><small>répétitions</small></article>
                    <article><i data-lucide="layers-3"></i><span>Total enregistré</span><strong>{{ totalAll.toLocaleString('fr-FR') }}</strong><small>sur cet appareil</small></article>
                    <article><i data-lucide="flame"></i><span>Régularité</span><strong>{{ streak }}</strong><small>jour{{ streak > 1 ? 's' : '' }} consécutif{{ streak > 1 ? 's' : '' }}</small></article>
                    <article><i data-lucide="sparkles"></i><span>Formule la plus comptée</span><strong>{{ topDhikr?.label || '—' }}</strong><small>{{ Number(topDhikr?.total || 0).toLocaleString('fr-FR') }}</small></article>
                </div>

                <div class="tasbih-progress-columns">
                    <article class="tasbih-week-card">
                        <div class="tasbih-panel-heading"><span>Sept derniers jours</span><strong>{{ weeklyData.reduce((sum, item) => sum + item.total, 0).toLocaleString('fr-FR') }}</strong></div>
                        <div class="tasbih-week-chart"><div v-for="day in weeklyData" :key="day.key"><span><i :style="{ height: day.percent + '%' }"></i></span><b>{{ day.label }}</b><small>{{ day.total }}</small></div></div>
                    </article>
                    <article class="tasbih-history-card">
                        <div class="tasbih-panel-heading"><span>Historique des séances</span><button v-if="state.history.length" type="button" @click="state.confirmAction = 'history'">Effacer</button></div>
                        <div v-if="recentHistory.length" class="tasbih-history-list">
                            <div v-for="session in recentHistory" :key="session.id"><span dir="rtl" lang="ar">{{ session.arabic }}</span><div><strong>{{ session.label }}</strong><small>{{ historyDate(session.endedAt) }} · {{ formatDuration(session.duration) }}</small></div><b>{{ session.total.toLocaleString('fr-FR') }}</b></div>
                        </div>
                        <div v-else class="tasbih-empty-history"><i data-lucide="history"></i><strong>Aucune séance terminée</strong><p>Une séance apparaît ici lorsque tu utilises le bouton « Terminer ».</p></div>
                    </article>
                </div>
            </section>
        </div>

        <div class="tasbih-sr-live" aria-live="polite">{{ state.notice }}</div>
        <transition name="fade"><div v-if="state.notice" class="tasbih-toast"><i data-lucide="check-circle-2"></i>{{ state.notice }}</div></transition>

        <div v-if="state.confirmAction" class="tasbih-confirm-backdrop" @click.self="state.confirmAction = ''">
            <article class="tasbih-confirm-modal"><span><i data-lucide="triangle-alert"></i></span><h2>{{ state.confirmAction === 'discard' ? 'Effacer la séance en cours ?' : state.confirmAction === 'history' ? 'Effacer tout l’historique ?' : 'Réinitialiser toutes les données ?' }}</h2><p>{{ state.confirmAction === 'discard' ? 'Les répétitions de cette séance seront retirées du total local.' : 'Cette action est limitée à cet appareil et ne peut pas être annulée.' }}</p><div><button type="button" @click="state.confirmAction = ''">Annuler</button><button type="button" class="danger" @click="runConfirmedAction">Confirmer</button></div></article>
        </div>
    </section>
    `
};