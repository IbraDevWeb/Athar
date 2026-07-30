// Athar Pro — finitions de l’expérience Transmission Focus
(() => {
    if (!window.Vue || typeof window.Vue.createApp !== 'function') return;

    const PATCH_FLAG = Symbol.for('athar.transmission.focus.patched');
    const originalCreateApp = window.Vue.createApp;

    const readRef = target => window.Vue.isRef(target) ? target.value : target;
    const writeRef = (target, value) => {
        if (window.Vue.isRef(target)) target.value = value;
    };

    const installLayoutProtection = () => {
        if (document.getElementById('athar-transmission-focus-protection')) return;
        const style = document.createElement('style');
        style.id = 'athar-transmission-focus-protection';
        style.textContent = `
            html.athar-transmission-lock .athar-global-mainframe > main {
                overflow: hidden !important;
            }
            @media (max-width: 620px) {
                html.athar-transmission-active .athar-mobile-dock {
                    display: none !important;
                }
            }
        `;
        document.head.appendChild(style);
    };

    const patchTransmission = definition => {
        if (!definition || definition[PATCH_FLAG] || typeof definition.setup !== 'function') return definition;
        definition[PATCH_FLAG] = true;

        const originalSetup = definition.setup;
        definition.setup = function patchedTransmissionSetup(props, context) {
            const state = originalSetup(props, context);
            const originalSetFocus = state.setFocus;
            const originalCloseProfile = state.closeProfile;

            state.setFocus = (id, options = {}) => {
                const activeView = readRef(state.viewMode);
                const activeTab = readRef(state.profileTab) || 'overview';
                const enhancedOptions = options.profile
                    ? { ...options, keepView: true }
                    : options;

                originalSetFocus(id, enhancedOptions);

                if (options.profile) {
                    writeRef(state.profileTab, options.profileTab || activeTab);
                    writeRef(state.viewMode, activeView);
                }
            };

            state.openProfile = function openTransmissionProfile(scholar, requestedTab) {
                if (!scholar) return;
                const activeView = readRef(state.viewMode);
                const tab = requestedTab || readRef(state.profileTab) || 'overview';

                originalSetFocus(scholar.id, {
                    profile: true,
                    group: false,
                    closeDirectory: true,
                    keepView: true
                });

                writeRef(state.profileTab, tab);
                writeRef(state.viewMode, activeView);
            };

            state.closeProfile = () => {
                originalCloseProfile();
                writeRef(state.profileTab, 'overview');
            };

            const syncRootState = () => {
                const root = document.documentElement;
                root.classList.add('athar-transmission-active');
                root.classList.toggle(
                    'athar-transmission-lock',
                    Boolean(readRef(state.directoryOpen) || readRef(state.profileOpen) || readRef(state.aboutOpen))
                );
            };

            window.Vue.watch(
                [state.directoryOpen, state.profileOpen, state.aboutOpen],
                syncRootState,
                { flush: 'post' }
            );
            window.Vue.onMounted(syncRootState);
            window.Vue.onBeforeUnmount(() => {
                document.documentElement.classList.remove('athar-transmission-active', 'athar-transmission-lock');
            });

            return state;
        };

        return definition;
    };

    window.Vue.createApp = function createPatchedAtharApp(rootComponent, ...args) {
        const components = rootComponent && rootComponent.components;
        if (components && components['transmission-view']) {
            patchTransmission(components['transmission-view']);
        }
        return originalCreateApp.call(this, rootComponent, ...args);
    };

    installLayoutProtection();
    window.AtharTransmissionFocus = { patchTransmission };
})();