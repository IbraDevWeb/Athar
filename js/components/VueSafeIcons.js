/* Athar Pro — rendu Lucide compatible avec le DOM virtuel de Vue */
(() => {
    const INSTALL_FLAG = Symbol.for('athar.vueSafeIcons.installed');
    const SVG_NS = 'http://www.w3.org/2000/svg';
    const warnedIcons = new Set();
    let observer = null;
    let frame = 0;

    const toPascalCase = value => String(value || '')
        .trim()
        .split(/[-_\s]+/)
        .filter(Boolean)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');

    const setAttributes = (element, attributes = {}) => {
        Object.entries(attributes || {}).forEach(([name, value]) => {
            if (name === 'key' || value === undefined || value === null) return;
            element.setAttribute(name, String(value));
        });
    };

    const appendIconNodes = (parent, nodes) => {
        if (!Array.isArray(nodes)) return;
        nodes.forEach(node => {
            if (!Array.isArray(node) || !node.length) return;
            const [tagName, attributes, children] = node;
            const child = document.createElementNS(SVG_NS, tagName);
            setAttributes(child, attributes);
            if (Array.isArray(children)) appendIconNodes(child, children);
            parent.appendChild(child);
        });
    };

    const resolveIcon = (lucide, name, explicitIcons) => {
        const icons = explicitIcons || lucide.icons || {};
        const pascalName = toPascalCase(name);
        const candidate = icons[name]
            || icons[pascalName]
            || icons[`${pascalName}Icon`]
            || lucide[name]
            || lucide[pascalName]
            || lucide[`${pascalName}Icon`];

        if (Array.isArray(candidate)) return candidate;
        if (Array.isArray(candidate?.iconNode)) return candidate.iconNode;
        return null;
    };

    const renderHost = (host, lucide, options = {}) => {
        if (!(host instanceof Element)) return;
        const nameAttr = options.nameAttr || 'data-lucide';
        const iconName = host.getAttribute(nameAttr);
        if (!iconName) return;

        const iconNode = resolveIcon(lucide, iconName, options.icons);
        if (!iconNode) {
            if (!warnedIcons.has(iconName)) {
                warnedIcons.add(iconName);
                console.warn(`[Athar Icons] Icône Lucide introuvable : ${iconName}`);
            }
            return;
        }

        const alreadyRendered = host.getAttribute('data-athar-icon-rendered') === iconName
            && host.firstElementChild?.namespaceURI === SVG_NS;
        if (alreadyRendered) return;

        const svg = document.createElementNS(SVG_NS, 'svg');
        setAttributes(svg, {
            xmlns: SVG_NS,
            width: '100%',
            height: '100%',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': '2',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            'aria-hidden': 'true',
            focusable: 'false',
            class: `lucide lucide-${iconName}`,
            ...(options.attrs || {})
        });
        appendIconNodes(svg, iconNode);

        /*
         * Le nœud hôte (<i>) reste intact. Vue conserve donc exactement le même
         * élément entre deux rendus et ne tente jamais d'insérer à côté d'un
         * nœud que Lucide aurait remplacé.
         */
        host.replaceChildren(svg);
        host.classList.add('athar-icon-host');
        host.setAttribute('data-athar-icon-rendered', iconName);
        host.setAttribute('aria-hidden', host.hasAttribute('aria-label') ? 'false' : 'true');
    };

    const install = () => {
        const lucide = window.lucide;
        if (!lucide || lucide[INSTALL_FLAG]) return Boolean(lucide?.[INSTALL_FLAG]);

        const unsafeCreateIcons = typeof lucide.createIcons === 'function'
            ? lucide.createIcons.bind(lucide)
            : null;

        const safeCreateIcons = (options = {}) => {
            const root = options.root instanceof Element || options.root instanceof Document
                ? options.root
                : document;
            const nameAttr = options.nameAttr || 'data-lucide';
            const selector = `[${CSS.escape(nameAttr)}]`;

            if (root instanceof Element && root.matches(selector)) renderHost(root, lucide, options);
            root.querySelectorAll?.(selector).forEach(host => renderHost(host, lucide, options));
        };

        const scheduleRefresh = root => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => safeCreateIcons({ root: root || document }));
        };

        Object.defineProperty(lucide, '__unsafeCreateIcons', {
            value: unsafeCreateIcons,
            configurable: false,
            enumerable: false,
            writable: false
        });
        lucide.createIcons = safeCreateIcons;
        lucide[INSTALL_FLAG] = true;

        observer = new MutationObserver(mutations => {
            let needsRefresh = false;
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-lucide') {
                    renderHost(mutation.target, lucide);
                    continue;
                }
                if (mutation.type === 'childList' && mutation.addedNodes.length) {
                    needsRefresh = true;
                }
            }
            if (needsRefresh) scheduleRefresh(document);
        });
        observer.observe(document.documentElement, {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: ['data-lucide']
        });

        window.AtharIcons = Object.freeze({
            refresh: root => safeCreateIcons({ root: root || document }),
            schedule: scheduleRefresh,
            render: host => renderHost(host, lucide),
            isSafe: true
        });

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => safeCreateIcons(), { once: true });
        } else {
            safeCreateIcons();
        }
        return true;
    };

    if (!install()) {
        let attempts = 0;
        const timer = window.setInterval(() => {
            attempts += 1;
            if (install() || attempts >= 100) window.clearInterval(timer);
        }, 25);
    }
})();
