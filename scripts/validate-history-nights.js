#!/usr/bin/env node

const fs = require('fs');
const vm = require('vm');

const read = (path) => fs.readFileSync(path, 'utf8');
const fail = (message) => {
    console.error(`History Nights validation failed: ${message}`);
    process.exit(1);
};
const requireToken = (source, token, label) => {
    if (!source.includes(token)) fail(`${label} is missing: ${token}`);
};

const context = { window: {} };
vm.createContext(context);
vm.runInContext(read('history_nights_data.js'), context, { filename: 'history_nights_data.js' });
const data = context.window.HISTORY_NIGHTS_DATA;
if (!data) fail('HISTORY_NIGHTS_DATA was not exposed.');
if (!data.meta || !String(data.meta.editorialNote || '').trim()) fail('The editorial methodology is missing.');
if (!Array.isArray(data.stories) || data.stories.length !== 4) fail('Exactly four launch stories are required.');

const storyIds = new Set();
const chapterIds = new Set();
let totalChapters = 0;
for (const story of data.stories) {
    if (!story.id || storyIds.has(story.id)) fail(`Invalid or duplicate story id: ${story.id}`);
    storyIds.add(story.id);
    for (const field of ['title', 'arabic', 'subtitle', 'period', 'location', 'theme', 'duration', 'summary', 'opening', 'openingSource']) {
        if (!String(story[field] || '').trim()) fail(`${story.id} is missing ${field}.`);
    }
    if (!Array.isArray(story.sources) || story.sources.length < 3) fail(`${story.id} needs at least three source references.`);
    if (!Array.isArray(story.chapters) || story.chapters.length !== 4) fail(`${story.id} must contain exactly four chapters.`);
    story.chapters.forEach((chapter) => {
        totalChapters += 1;
        if (!chapter.id || chapterIds.has(chapter.id)) fail(`Invalid or duplicate chapter id: ${chapter.id}`);
        chapterIds.add(chapter.id);
        for (const field of ['title', 'kicker', 'readTime', 'reflection']) {
            if (!String(chapter[field] || '').trim()) fail(`${chapter.id} is missing ${field}.`);
        }
        if (!Array.isArray(chapter.body) || chapter.body.length < 3) fail(`${chapter.id} must contain at least three paragraphs.`);
        if (chapter.body.some((paragraph) => String(paragraph).trim().length < 80)) fail(`${chapter.id} contains an underdeveloped paragraph.`);
    });
}

const component = read('js/components/HistoryNightsView.js');
[
    'hn6-story-grid', 'hn6-reading-sheet', 'hn6-player', 'speechSynthesis',
    'SpeechSynthesisUtterance', 'speechSupported', 'toggleNarration', 'stopNarration',
    'athar_history_nights_v1', 'athar-history-nights-active', 'onBeforeUnmount',
    '@click="openStory(story, 0)"', '@click="selectChapter(index)"',
    ':disabled="!speechSupported"', '@click.self="showSources = false"'
].forEach((token) => requireToken(component, token, 'HistoryNightsView'));

if (/new\s+Audio\s*\(|<audio|<iframe|fetch\s*\(/i.test(component)) {
    fail('The launch reader must not depend on remote audio, iframes or fetch calls.');
}
if (/autoplay/i.test(component)) fail('Narration must never autoplay.');

const css = read('css/history-nights.css');
[
    '.hn6-shell', '.hn6-hero', '.hn6-story-grid', '.hn6-reader-layout', '.hn6-player',
    '.hn6-overlay', 'html.athar-history-nights-active .athar-mobile-dock',
    'html.athar-app-fullscreen .hn6-reader', '@media (max-width: 760px)',
    '@media (max-width: 480px)', 'prefers-reduced-motion', 'touch-action: manipulation'
].forEach((token) => requireToken(css, token, 'History Nights CSS'));

const scrollCss = read('css/history-nights-scroll.css');
[
    '@media (min-width: 761px)', '.hn6-reading-sheet', 'height: 100%',
    'overflow-y: auto', 'overscroll-behavior: contain', '@media (max-width: 760px)'
].forEach((token) => requireToken(scrollCss, token, 'History Nights scroll CSS'));

const bridge = read('js/components/AstronomyBootstrap.js');
[
    "'history-nights-view': window.HistoryNightsView",
    "'scriptorium-view': window.ScriptoriumView",
    "currentTool === 'history_nights'",
    "currentTool === 'astronomy'",
    "currentTool === 'scriptorium'",
    "currentTool === 'scholars_map'",
    'window.Vue.createApp',
    'PATCH_FLAG'
].forEach((token) => requireToken(bridge, token, 'Tool extensions bootstrap'));

const toolView = read('js/components/ToolView.js');
const toolAnchor = `<scholar-atlas-module v-if="currentTool === 'scholars_map'" :settings="settings"></scholar-atlas-module>\n    <div v-else`;
requireToken(toolView, toolAnchor, 'ToolView integration anchor');

const bridgeContext = {
    console,
    window: {
        AncientSkyView: { name: 'AncientSkyView' },
        HistoryNightsView: { name: 'HistoryNightsView' },
        ScriptoriumView: { name: 'ScriptoriumView' },
        Vue: { createApp: (root) => root }
    }
};
vm.createContext(bridgeContext);
vm.runInContext(bridge, bridgeContext, { filename: 'AstronomyBootstrap.js' });
const fakeToolView = { components: {}, template: toolAnchor };
bridgeContext.window.Vue.createApp({ components: { 'tool-view': fakeToolView } });
if (!fakeToolView.components['history-nights-view']) fail('HistoryNightsView was not registered in ToolView.');
if (!fakeToolView.components['scriptorium-view']) fail('ScriptoriumView was not registered alongside History Nights.');
if (!fakeToolView.template.includes(`currentTool === 'history_nights'`)) fail('The history_nights route was not inserted in ToolView.');
if (!fakeToolView.template.includes(`currentTool === 'astronomy'`)) fail('The astronomy route was not preserved.');
if (!fakeToolView.template.includes(`currentTool === 'scriptorium'`)) fail('The scriptorium route was not preserved.');

const config = read('js/config.js');
[
    "const APP_VERSION = 'athar-pro-v30'",
    "writeEarlyScript('history_nights_data.js'",
    "writeEarlyScript('js/components/HistoryNightsView.js'",
    "writeEarlyScript('js/components/AstronomyBootstrap.js'",
    'css/history-nights.css?v=${APP_VERSION}',
    'css/history-nights-scroll.css?v=${APP_VERSION}'
].forEach((token) => requireToken(config, token, 'config.js'));

const worker = read('service-worker.js');
[
    "const CACHE_VERSION = 'athar-pro-v30'",
    './history_nights_data.js?v=athar-pro-v30',
    './js/components/HistoryNightsView.js?v=athar-pro-v30',
    './js/components/AstronomyBootstrap.js?v=athar-pro-v30',
    './css/history-nights.css?v=athar-pro-v30',
    './css/history-nights-scroll.css?v=athar-pro-v30'
].forEach((token) => requireToken(worker, token, 'service worker'));

const extensionData = read('extensions_data.js');
requireToken(extensionData, 'Récits historiques immersifs, sourcés', 'history nights extension metadata');

console.log(`History Nights validated: ${data.stories.length} stories, ${totalChapters} chapters, optional local narration and cache v30.`);
