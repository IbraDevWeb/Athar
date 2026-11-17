// Siyar 06–15 : lecture des sources et correspondances de notices après vérification statique.
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = (process.env.ATHAR_E2E_BASE || 'http://127.0.0.1:4173').replace(/\/$/, '');
const browser = await chromium.launch({ headless: true });
const sections = [
    ['library', 'Bibliothèque'],
    ['timeline', 'Frise Chrono'],
    ['glossary', 'Lexique'],
    ['hadiths', 'Hadiths'],
    ['tabib', 'Tabib Al-Qulub'],
    ['adhkar', 'Al-Adhkar'],
    ['tasbih', 'Tasbih'],
    ['ussul', 'Usûl al-Fiqh'],
    ['fiqh-maliki', 'Fiqh malikite']
];
const allowed = ['home', ...sections.map(([view]) => view)];
const blocked = ['transmission', 'atlas', 'belief', 'constellation', 'scriptorium', 'research'];

const header = page => page.locator('#athar-immersive-current');
const main = page => page.locator('.athar-global-mainframe > main');

async function ready(page) {
    await page.locator('.ap-launch-grid').waitFor({ state: 'visible', timeout: 60000 });
    await page.locator('#athar-immersive-menu').waitFor({ state: 'visible', timeout: 30000 });
    await page.locator('#athar-immersive-theme').waitFor({ state: 'visible', timeout: 30000 });
    await page.locator('#athar-immersive-quick').waitFor({ state: 'visible', timeout: 30000 });
    const info = await page.evaluate(() => ({
        shell: document.documentElement.classList.contains('athar-immersive-only')
            && document.documentElement.classList.contains('athar-app-fullscreen'),
        hiddenHeader: getComputedStyle(document.querySelector('#app > header')).display === 'none',
        hiddenSidebar: getComputedStyle(document.querySelector('#app aside.w-72')).display === 'none',
        fullscreenButton: Boolean(document.querySelector('#athar-fullscreen-toggle, #athar-fullscreen-exit')),
        fullscreenElement: Boolean(document.fullscreenElement),
        nativeMenu: Boolean(document.querySelector('#app .athar-native-mobile-menu'))
    }));
    assert.equal(info.shell, true, 'Le mode immersif doit être actif automatiquement.');
    assert.equal(info.hiddenHeader, true, "L'ancien en-tête ne doit plus être visible.");
    assert.equal(info.hiddenSidebar, true, "L'ancienne barre latérale ne doit plus être visible.");
    assert.equal(info.fullscreenButton, false, 'Aucun bouton pour entrer ou quitter le grand écran.');
    assert.equal(info.fullscreenElement, false, "Ne pas appeler l'API plein écran du navigateur.");
    assert.equal(info.nativeMenu, false, "L'ancien menu mobile ne doit pas être monté.");
    assert.equal(await page.locator('.ap-launch-grid button').count(), 9);
    assert.equal(await page.locator('#athar-lens').count(), 0);

    const drawer = page.locator('#athar-immersive-drawer [data-athar-view]');
    await drawer.first().waitFor({ state: 'attached' });
    const menuViews = await drawer.evaluateAll(nodes => nodes.map(node => node.dataset.atharView).sort());
    assert.deepEqual(menuViews, [...allowed].sort(), 'Les 9 rubriques et Accueil doivent être les seuls liens de navigation.');
    for(const view of blocked) {
        assert.ok(!menuViews.includes(view), 'Une rubrique non publiée a été affichée : ' + view);
    }
}
async function navigate(page, view) {
    await page.locator('#athar-immersive-menu').click();
    const drawer = page.locator('#athar-immersive-drawer');
    await drawer.waitFor({ state: 'visible', timeout: 15000 });
    await drawer.locator('[data-athar-view="' + view + '"]').click();
    await page.waitForFunction(() => !document.querySelector('#athar-immersive-drawer.is-open'), { timeout: 15000 });
}
async function home(page) {
    await header(page).click();
    await ready(page);
}
function collectErrors(page) {
    const errors=[];
    page.on('pageerror', err => errors.push(String(err?.message || err)));
    return errors;
}

async function desktop() {
    const page = await browser.newPage({ viewport:{width:1440,height:920} });
    const errors = collectErrors(page);
    await page.goto(base+'/index.html?ui=desktop', { waitUntil:'domcontentloaded', timeout:90000 });
    await ready(page);
    // Même sur ordinateur, un zoom au trackpad ne doit pas réduire la hauteur de l'application.
    const desktopZoomSession=await page.context().newCDPSession(page);
    await desktopZoomSession.send('Emulation.setPageScaleFactor',{pageScaleFactor:2});
    await page.waitForFunction(()=>window.visualViewport?.scale>=1.9,null,{timeout:5000});
    await page.waitForFunction(()=>Math.abs(
        parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--athar-viewport-height'))-window.innerHeight
    )<=2,null,{timeout:5000});
    const desktopZoom=await page.evaluate(()=>({
        layout:window.innerHeight,
        visual:window.visualViewport.height,
        app:document.getElementById('app').getBoundingClientRect().height,
        overflow:getComputedStyle(document.querySelector('.athar-global-mainframe > main')).overflowX
    }));
    assert.ok(desktopZoom.visual<desktopZoom.layout*.7,'Zoom ordinateur non simulé');
    assert.ok(Math.abs(desktopZoom.app-desktopZoom.layout)<=3,'Bande blanche en zoomant sur ordinateur : '+JSON.stringify(desktopZoom));
    assert.equal(desktopZoom.overflow,'auto','Le défilement horizontal est coupé sur ordinateur');
    await desktopZoomSession.send('Emulation.setPageScaleFactor',{pageScaleFactor:1});
    await page.waitForFunction(()=>window.visualViewport?.scale<=1.01,null,{timeout:5000});
    await desktopZoomSession.detach();
    assert.match(await header(page).innerText(), /Accueil/);

    const title = (await page.locator('.ap-hadith-slide h3').innerText()).trim();
    await page.locator('.ap-hadith-next').click();
    await page.waitForFunction(previous => document.querySelector('.ap-hadith-slide h3')?.textContent?.trim() !== previous, title);
    await page.locator('.ap-hadith-read').click();
    await page.locator('.hadith-reader-pro').waitFor({state:'visible'});
    assert.match(await page.locator('#athar-immersive-quick').getAttribute('aria-label'), /Retour à Hadiths/);
    await page.locator('#athar-immersive-quick').click();
    await page.locator('.hadith-pro-root, .hadiths-pro-root').first().waitFor({state:'visible'});
    await home(page);

    for (const [view, label] of sections) {
        await page.locator('.ap-launch-grid button').filter({hasText:label}).first().click();
        await page.waitForFunction(() => !document.querySelector('.ap-launch-grid'), {timeout:20000});
        assert.ok((await main(page).innerText()).trim().length > 40, 'Rubrique vide : '+label);
        await home(page);
    }

    // Tabib al-Qulûb : la fiche Istikhâra complète remplace la version abrégée sans doublon.
    await navigate(page, 'tabib');
    await page.getByRole('heading',{name:'L’istikhâra — remettre son choix à Allah'}).click();
    await page.getByRole('heading',{name:'L’istikhâra — remettre son choix à Allah',level:1}).waitFor({state:'visible'});
    assert.ok((await page.locator('p[dir="rtl"]').first().innerText()).length>35,'Verset non affiché');
    const duaa=page.locator('p[dir="rtl"]').last();
    assert.ok((await duaa.innerText()).length>500,'Invocation Istikhâra encore abrégée');
    assert.equal(await page.locator('section[aria-label="Questions courantes sur l’istikhâra"] details').count(),5,'Les cinq questions de la fiche manquent');
    await page.locator('section[aria-label="Questions courantes sur l’istikhâra"] details').first().locator('summary').click();
    assert.match(await page.locator('section[aria-label="Questions courantes sur l’istikhâra"] details').first().innerText(),/Le hadith ne demande aucun rêve/);
    assert.equal(await page.locator('section[aria-label="Vocabulaire de la prière de consultation"] dt').count(),5,'Le lexique Istikhâra est incomplet');
    assert.ok(await page.locator('a[href="https://sunnah.com/bukhari:1166"]').count()>=1,'Source précise Sahîh al-Bukhârî absente');
    await page.getByRole('button',{name:'Retour aux remèdes'}).click();
    await page.getByRole('heading',{name:'Pharmacie des Âmes',level:2}).waitFor({state:'visible'});

    // Douze nouveaux remèdes pédagogiques (51–62) avec sources, lexique et questions.
    assert.equal(await page.locator('div.grid.grid-cols-1 > div.group').count(),62,'Le catalogue doit proposer 62 fiches Tabib');
    await page.locator('div.grid.grid-cols-1 > div.group h3').filter({hasText:'Quand l’exaucement semble tarder'}).click();
    await page.getByRole('heading',{name:'Quand l’exaucement semble tarder',level:1}).waitFor({state:'visible'});
    assert.equal(await page.locator('section[aria-label^="Questions fréquentes : "] details').count(),3,'Questions de la fiche 51 absentes');
    assert.equal(await page.locator('section[aria-label^="Lexique : "] dt').count(),3,'Lexique de la fiche 51 absent');
    assert.ok(await page.locator('a[href="https://sunnah.com/muslim:2735c"]').count()>=1,'Source du hadith de la fiche 51 absente');
    assert.ok(await page.locator('a[href="https://quran.com/2/186"]').count()>=1,'Source coranique de la fiche 51 absente');
    assert.match(await page.locator('span').filter({hasText:'Parole prophétique'}).first().innerText(),/parole prophétique/i);
    await page.getByRole('button',{name:'Retour aux remèdes'}).click();
    await page.getByRole('heading',{name:'Pharmacie des Âmes',level:2}).waitFor({state:'visible'});
    await page.locator('div.grid.grid-cols-1 > div.group h3').filter({hasText:'La douceur qui transforme les relations'}).click();
    await page.getByRole('heading',{name:'La douceur qui transforme les relations',level:1}).waitFor({state:'visible'});
    assert.ok(await page.locator('a[href="https://sunnah.com/muslim:2594a"]').count()>=1,'Source de la fiche 62 absente');
    assert.equal(await page.locator('section[aria-label^="Questions fréquentes : "] details').count(),3,'Questions de la fiche 62 absentes');
    const tabibDesktopVisual=await page.evaluate(()=>{
        const root=document.querySelector('.tabib-detail-root.tabib-detail-enriched');
        const links=[...root.querySelectorAll('a.tabib-source-link')];
        const quran=root.querySelector('a[href="https://quran.com/3/159"]');
        return {
            essenceCount:root.querySelectorAll('.tabib-learning-essence').length,
            essenceTitlePresent:root.textContent.includes('Le cœur de la démarche'),
            quranSource:!!quran,
            linkCount:links.length,
            maxLinkHeight:Math.max(0,...links.map(link=>link.getBoundingClientRect().height)),
            maxLinkWidth:Math.max(0,...links.map(link=>link.getBoundingClientRect().width)),
            badIcons:root.querySelectorAll('a.tabib-source-link i[data-lucide],a.tabib-source-link svg').length
        };
    });
    assert.equal(tabibDesktopVisual.essenceCount,0,'Encadré cœur de la démarche encore visible sur PC');
    assert.equal(tabibDesktopVisual.essenceTitlePresent,false,'Titre cœur de la démarche encore affiché sur PC');
    assert.ok(tabibDesktopVisual.quranSource&&tabibDesktopVisual.linkCount>=3,'Liens des sources absents de la fiche');
    assert.equal(tabibDesktopVisual.badIcons,0,'Une icône géante subsiste dans les liens de sources');
    assert.ok(tabibDesktopVisual.maxLinkHeight<=52&&tabibDesktopVisual.maxLinkWidth<=900,'Lien géant sur PC : '+JSON.stringify(tabibDesktopVisual));

    await page.getByRole('button',{name:'Retour aux remèdes'}).click();
    await home(page);

    // Système de galeries : palette spécifique et cartes lisibles sur ordinateur.
    for (const [view,rootSelector,cardSelector,accent] of [
        ['library','.library-pro-root','.library-pro-selection .library-pro-card','#916622'],
        ['hadiths','.hadith-pro-root','.hadith-pro-card','#496f82'],
        ['adhkar','.adhkar-pro-shell','.adhkar-pro-card','#765b99'],
        ['glossary','.glossary-pro-root','.glossary-pro-card','#af7459'],
        ['timeline','.timeline-pro','.timeline-pro-event-card','#a17a3d']
    ]) {
        await navigate(page,view);
        const root=page.locator(rootSelector);
        await root.waitFor({state:'visible'});
        await page.waitForFunction(selector => Boolean(document.querySelector(selector)
            && getComputedStyle(document.querySelector(selector)).getPropertyValue('--ax-accent').trim()),rootSelector);
        assert.equal(await root.evaluate(el=>getComputedStyle(el).getPropertyValue('--ax-accent').trim()),accent,'Couleur de galerie incorrecte : '+view);
        const cards=page.locator(cardSelector);
        assert.ok(await cards.count()>0,'Aucune fiche visible : '+view);
        const rect=await cards.first().boundingBox();
        assert.ok(rect && rect.width>=170,'Fiche trop étroite sur PC : '+view);
        assert.ok(parseFloat(await cards.first().evaluate(el=>getComputedStyle(el).borderTopLeftRadius))>=16,'Coins de fiches incohérents : '+view);
        await home(page);
    }
    // Adhkâr : accès immédiat aux invocations, parcours secondaires et lecteur fonctionnel.
    await navigate(page,'adhkar');
    await page.locator('.adhkar-pro-card').first().waitFor({state:'visible'});
    assert.equal(await page.locator('.adhkar-pro-card').count(),18,'Les 18 premières invocations doivent apparaître directement');
    assert.equal(await page.locator('.adhkar-pro-hero-stats').count(),0,'Les gros chiffres ne doivent plus encombrer l’en-tête');
    assert.ok(await page.locator('.adhkar-pro-category-row button').count()>=8,'Les contextes doivent être accessibles');
    const adhkarGeo=await page.evaluate(()=>{
        const root=document.querySelector('.adhkar-pro-shell');
        const options=[...root.querySelectorAll('.adhkar-pro-category-row button')];
        const cards=[...root.querySelectorAll('.adhkar-pro-card')];
        const first=cards[0].getBoundingClientRect();
        return {
            overflow:root.scrollWidth-root.clientWidth,
            firstCardTop:first.top,
            columns:getComputedStyle(root.querySelector('.adhkar-pro-card-grid')).gridTemplateColumns.split(' ').length,
            clipped:options.filter(el=>{
                const r=el.getBoundingClientRect();
                return r.left<-2||r.right>innerWidth+2||el.scrollWidth>el.clientWidth+3;
            }).map(el=>el.innerText.trim()),
            clippedTitles:cards.filter(card=>{
                const name=card.querySelector('h3');
                return name.scrollHeight>name.clientHeight+3||name.scrollWidth>name.clientWidth+3;
            }).map(card=>card.querySelector('h3').innerText)
        };
    });
    assert.ok(adhkarGeo.overflow<=3,'La section Adhkâr déborde horizontalement');
    assert.deepEqual(adhkarGeo.clipped,[],'Des contextes sont rognés');
    assert.deepEqual(adhkarGeo.clippedTitles,[],'Un titre de dhikr est coupé');
    assert.equal(adhkarGeo.columns,3,'Le catalogue PC doit afficher trois cartes par ligne');
    assert.ok(adhkarGeo.firstCardTop<950,'Les premières invocations sont trop éloignées du titre');
    await page.locator('.adhkar-pro-category-row button').filter({hasText:'Réveil'}).click();
    assert.ok(await page.locator('.adhkar-pro-card').count()>0,'Filtre Réveil inopérant');
    assert.ok(await page.locator('.adhkar-pro-card').count()<18,'La catégorie ne réduit pas les cartes');
    await page.locator('.adhkar-pro-category-row button').first().click();
    await page.locator('.adhkar-pro-card').first().click();
    await page.locator('.adhkar-pro-reader').waitFor({state:'visible'});
    assert.equal(await page.locator('.adhkar-pro-reader-notes').getAttribute('open'),null,'Les références doivent rester repliées sous le dhikr');
    assert.ok(await page.locator('.adhkar-pro-arabic-block p').isVisible(),'Le texte arabe doit être visible');
    assert.ok(await page.locator('.adhkar-pro-reading-grid').isVisible(),'La traduction doit être visible');
    await page.locator('.adhkar-pro-counter').click();
    assert.match(await page.locator('.adhkar-pro-counter-heading strong').innerText(),/1\s*\/\s*1/,'Le compteur ne fonctionne pas');
    await page.locator('.adhkar-pro-reader-notes > summary').click();
    assert.ok(await page.locator('.adhkar-pro-reader-notes-body').isVisible(),'Les références ne peuvent pas être dépliées');
    const hisnSource = page.locator('.adhkar-pro-reader-notes-body .adhkar-source-link').first();
    assert.ok(await hisnSource.isVisible(),'Le lien de la référence précise doit être visible');
    assert.equal(await hisnSource.getAttribute('href'),'https://sunnah.com/hisn/1',
        'La référence doit ouvrir la notice exacte de Hisn al-Muslim');
    await page.locator('.adhkar-pro-reader > header button').last().click();
    await page.locator('.adhkar-pro-reader-close').click();
    await page.locator('.adhkar-pro-library-toolbar > button').first().click();
    assert.equal(await page.locator('.adhkar-pro-card').count(),1,'Le filtre favoris doit cibler le dhikr choisi');
    await page.locator('.adhkar-pro-library-toolbar > button').first().click();
    await page.locator('.adhkar-pro-tabs button').filter({hasText:'Parcours guidés'}).click();
    assert.ok(await page.locator('.adhkar-pro-routine-card').count()>=3,'Les parcours guidés doivent rester disponibles');
    await page.locator('.adhkar-pro-routine-card button').first().click();
    await page.locator('.adhkar-pro-reader').waitFor({state:'visible'});
    assert.ok(await page.locator('.adhkar-pro-reader > footer button').count()===2,'Navigation du parcours manquante');
    await page.locator('.adhkar-pro-reader-close').click();
    await page.locator('.adhkar-pro-tabs button').filter({hasText:'Suivi personnel'}).click();
    assert.equal(await page.locator('.adhkar-pro-stat-grid article').count(),4,'Le suivi des répétitions est perdu');
    await home(page);

    // Le lexique doit limiter les premières fiches, tout en conservant la recherche.
    await navigate(page,'glossary');
    await page.locator('.glossary-pro-card').first().waitFor({state:'visible',timeout:20000});
    assert.equal(await page.locator('.glossary-pro-card').count(),24,'Le lexique doit afficher 24 définitions initialement');
    await page.getByRole('button',{name:'Afficher plus de termes'}).click();
    assert.equal(await page.locator('.glossary-pro-card').count(),48,'Le lexique doit paginer les définitions');
    await page.locator('.glossary-pro-search input').fill('badr');
    assert.ok(await page.locator('.glossary-pro-card').count()>0,'Recherche lexique inactive');
    assert.ok(await page.locator('.glossary-pro-card').count()<24,'La recherche lexique ne filtre pas');
    await home(page);

    // Refonte Hadith : 18 cartes légères, recherche directe et fiche en lecture continue.
    await navigate(page,'hadiths');
    await page.locator('.hadith-pro-root').waitFor({state:'visible'});
    assert.match(await page.locator('.hadith-pro-heading h1').innerText(),/les hadiths/i);
    assert.equal(await page.locator('.hadith-pro-card').count(),18,'La grille Hadith doit limiter le premier affichage');
    // Régression visuelle : aucun compteur géant ni filtre rogné et grille visible sans vide superflu.
    const visual = await page.evaluate(() => {
        const root=document.querySelector('.hadith-pro-root');
        const topics=[...root.querySelectorAll('.hadith-pro-topic-row button')];
        const nav=[...root.querySelectorAll('.hadith-kutub-tabs button')];
        const cards=[...root.querySelectorAll('.hadith-pro-card')];
        const r=el=>{const b=el.getBoundingClientRect();return {x:b.left,right:b.right,y:b.top,width:b.width,height:b.height};};
        return {
            viewport:innerWidth,accent:getComputedStyle(root).getPropertyValue('--ax-accent').trim(),
            counter:root.querySelectorAll('.hadith-pro-count').length,
            topics:topics.map(el=>({...r(el),overflow:el.scrollWidth-el.clientWidth})),
            nav:nav.map(r),
            topicContainer:root.querySelector('.hadith-pro-topic-row').scrollWidth-root.querySelector('.hadith-pro-topic-row').clientWidth,
            card:r(cards[0]),
            heading:r(root.querySelector('.hadith-pro-heading')),
            gridColumns:getComputedStyle(root.querySelector('.hadith-pro-grid')).gridTemplateColumns.split(' ').length,
            headingClipped:root.querySelector('.hadith-pro-heading h1').scrollWidth > root.querySelector('.hadith-pro-heading h1').clientWidth+2,
            titleClipped:cards.some(el=>el.querySelector('h2').scrollHeight>el.querySelector('h2').clientHeight+2)
        };
    });
    assert.equal(visual.accent,'#496f82','La palette Hadith raffinée n’est pas appliquée');
    assert.equal(visual.counter,0,'Le compteur géant de Hadiths est toujours visible');
    assert.ok(visual.heading.height<220,'L’en-tête Hadith est trop massif : '+JSON.stringify(visual));
    assert.ok(visual.card.y<760,'Les cartes de hadiths sont rejetées trop bas : '+JSON.stringify(visual));
    assert.equal(visual.gridColumns,3,'La grille PC doit présenter trois colonnes');
    assert.ok(!visual.headingClipped && !visual.titleClipped,'Un titre Hadith est coupé');
    assert.ok(visual.topicContainer<=3,'Les thèmes créent un scroll horizontal');
    for (const element of [...visual.topics,...visual.nav]) {
        assert.ok(element.x>=-2 && element.right<=visual.viewport+2,'Un filtre est tronqué sur ordinateur : '+JSON.stringify(element));
        if (element.overflow!==undefined) assert.ok(element.overflow<=3,'Le texte d’un filtre dépasse : '+JSON.stringify(element));
    }
    assert.equal(await page.locator('.hadith-pro-hero,.hadith-pro-progress-view').count(),0,'Ancien tableau de bord Hadith encore visible');
    await page.getByRole('button',{name:'Voir plus de hadiths'}).click();
    assert.ok(await page.locator('.hadith-pro-card').count()>18,'Le chargement progressif des hadiths est inactif');
    await page.locator('.hadith-pro-search input').fill('colère');
    assert.ok(await page.locator('.hadith-pro-card').count()>0,'Recherche Hadith sans résultat pour colère');
    assert.ok(await page.locator('.hadith-pro-card').count()<18,'La recherche Hadith ne filtre pas');
    await page.locator('.hadith-pro-search input').fill('');
    const firstHadithCard=page.locator('.hadith-pro-card').first();
    await firstHadithCard.click();
    await page.locator('.hadith-reader-pro').waitFor({state:'visible'});
    assert.ok(await page.locator('.hadith-reader-text-view').isVisible(),'Texte du hadith invisible');
    assert.ok(await page.locator('.hadith-reader-explanation-view').isVisible(),'L’explication doit suivre sans changer d’onglet');
    assert.ok(await page.locator('.hadith-reader-lessons-view').isVisible(),'Les enseignements doivent suivre sans onglet');
    assert.equal(await page.locator('.hadith-reader-tabs').count(),0,'Les cinq anciens onglets sont encore présents');
    const hadithNotes=page.locator('.hadith-reader-source-view');
    assert.equal(await hadithNotes.getAttribute('open'),null,'Les réserves Hadith doivent être repliées');
    await hadithNotes.locator('summary').click();
    assert.match(await hadithNotes.innerText(),/Degré indiqué/,'Le degré a été perdu dans la fiche');
    await page.locator('.hadith-reader-language-switch button').filter({hasText:'Arabe'}).click();
    assert.ok(await page.locator('.hadith-reader-arabic').isVisible(),'Lecture arabe non disponible');
    await page.locator('.hadith-reader-language-switch button').filter({hasText:'Les deux'}).click();
    const memo='Révision personnelle temporaire';
    await page.locator('.hadith-reader-notes textarea').fill(memo);
    await page.locator('#athar-immersive-quick').click();
    await page.locator('.hadith-pro-root').waitFor({state:'visible'});
    await page.locator('.hadith-pro-card').first().click();
    assert.equal(await page.locator('.hadith-reader-notes textarea').inputValue(),memo,'La note personnelle doit survivre au retour à la liste');
    await page.locator('#athar-immersive-quick').click();
    // Navigation Kutub as-Sitta, les six recueils doivent être des sous-sections accessibles.
    await page.locator('.hadith-kutub-tabs button').nth(1).click();
    assert.equal(await page.locator('.hadith-kutub-book').count(),6,'Les six livres ne sont pas présents');
    assert.equal(await page.locator('.hadith-pro-card').count(),0,'Le corpus courant est mélangé aux recueils vides');
    // Catalogue Bukhârî, sur le modèle visuel Tabîb al-Qulûb.
    await page.locator('.hadith-kutub-book').first().click();
    await page.locator('.bukhari-card').first().waitFor({state:'visible',timeout:15000});
    assert.equal(await page.locator('.bukhari-card').count(),12,'Le recueil doit commencer par douze cartes');
    assert.match(await page.locator('.bukhari-showcase-hero h2').innerText(),/Bukhârî/);
    assert.match(await page.locator('.bukhari-card-title').first().innerText(),/intentions/i);
    assert.equal(await page.locator('.hadith-pro-heading').count(),0,'En-tête redondant après ouverture');
    assert.equal(await page.locator('.hadith-kutub-tabs').count(),0,'Double navigation dans Bukhârî');
    const gallery=await page.evaluate(()=>{
        const root=document.querySelector('.bukhari-book-view');
        const cards=[...root.querySelectorAll('.bukhari-card')];
        const titles=cards.map(card=>card.querySelector('.bukhari-card-title'));
        return {overflow:root.scrollWidth-root.clientWidth,
            columns:getComputedStyle(root.querySelector('.bukhari-card-grid')).gridTemplateColumns.split(' ').length,
            cardY:cards[0].getBoundingClientRect().top,
            clipped:titles.filter(el=>el.scrollWidth>el.clientWidth+2||el.scrollHeight>el.clientHeight+2).map(el=>el.textContent)};
    });
    assert.ok(gallery.overflow<=3,'Galerie débordante : '+JSON.stringify(gallery));
    assert.equal(gallery.columns,3,'Trois cartes attendues sur PC');
    assert.deepEqual(gallery.clipped,[],'Des titres sont tronqués');
    assert.ok(gallery.cardY<1150,'Le catalogue commence trop bas');
    await page.locator('.bukhari-book-switch button').nth(1).click();
    assert.equal(await page.locator('.bukhari-card').count(),7,'Le livre Révélation doit contenir 7 hadiths');
    await page.locator('.bukhari-book-switch button').nth(2).click();
    assert.equal(await page.locator('.bukhari-card').count(),12,'Le livre Foi reste paginé par douze');
    assert.match(await page.locator('.bukhari-card-number').first().innerText(),/8/);
    await page.locator('.bukhari-book-switch button').first().click();
    await page.locator('.bukhari-card-favorite').first().click();
    assert.equal(await page.locator('.bukhari-card-favorite').first().getAttribute('aria-pressed'),'true','Favoris non activés');
    await page.locator('.bukhari-catalog-favorites').click();
    assert.equal(await page.locator('.bukhari-card').count(),1,'Filtre favoris incorrect');
    await page.locator('.bukhari-catalog-favorites').click();
    await page.locator('.bukhari-card-link').first().click();
    await page.locator('.bukhari-reader-pro').waitFor({state:'visible'});
    assert.match(await page.locator('.bukhari-reader-hero h1').innerText(),/intentions/i);
    assert.match(await page.locator('.bukhari-reader-meta').innerText(),/Hadith n° 1/);
    assert.ok((await page.locator('.bukhari-reader-original blockquote').innerText()).length>150,'Arabe absent');
    assert.ok((await page.locator('.bukhari-reader-translation p').first().innerText()).length>90,'Français absent');
    assert.equal(await page.locator('.hadith-reader-lessons-view').count(),0,'Enseignements inventés');
    assert.equal(await page.locator('.bukhari-reader-source').getAttribute('open'),null,'Sources non repliées');
    assert.equal(await page.locator('.bukhari-reader-source a[href*="github.com"]').count(),0,'Lien GitHub visible');
    await page.locator('.bukhari-reader-source summary').click();
    assert.ok(await page.locator('.hadith-reader-translation-notice').isVisible(),'Limite de traduction absente');
    assert.equal(await page.locator('a[href="https://sunnah.com/bukhari:1"]').count(),1,'Source Sunnah.com absente');
    await page.locator('.bukhari-reader-language-switch button').nth(1).click();
    assert.equal(await page.locator('.bukhari-reader-translation').count(),0,'Arabe seul inopérant');
    await page.locator('.bukhari-reader-language-switch button').nth(2).click();
    assert.equal(await page.locator('.bukhari-reader-original').count(),0,'Français seul inopérant');
    await page.locator('.bukhari-reader-language-switch button').first().click();
    const personalNote='Réflexion test, à conserver';
    await page.locator('.bukhari-reader-journal textarea').fill(personalNote);
    await page.locator('.bukhari-reader-back').click();
    await page.locator('.bukhari-book-view').waitFor({state:'visible',timeout:15000});
    assert.equal(await page.locator('.bukhari-card').count(),12,'Retour au recueil inopérant');
    await page.locator('.bukhari-card-link').first().click();
    await page.locator('.bukhari-reader-pro').waitFor({state:'visible'});
    assert.equal(await page.locator('.bukhari-reader-journal textarea').inputValue(),personalNote,'Note perdue');
    await page.locator('.bukhari-reader-back').click();
    await page.locator('.bukhari-book-view').waitFor({state:'visible'});
    await page.locator('.bukhari-catalog-search input').fill('Gabriel interroge');
    await page.locator('.bukhari-card').first().waitFor({state:'visible'});
    assert.equal(await page.locator('.bukhari-card').count(),1,'Recherche par titre imprécise');
    assert.match(await page.locator('.bukhari-card-number').innerText(),/50/);
    await page.locator('.bukhari-card-link').click();
    await page.locator('.bukhari-reader-pro').waitFor({state:'visible'});
    assert.ok((await page.locator('.bukhari-reader-original blockquote').innerText()).length>150,'Hadith 50 arabe absent');
    await page.locator('.bukhari-reader-back').click();
    await page.locator('.bukhari-book-view').waitFor({state:'visible'});
    await page.locator('.hadith-kutub-back').click();
    // Sahîh Muslim : les références 1–7 (Introduction) et 8–50 (Livre de la foi) ont été importées.
    await page.locator('.hadith-kutub-book').nth(1).click();
    await page.locator('.bukhari-card').first().waitFor({state:'visible',timeout:15000});
    assert.equal(await page.locator('.bukhari-card').count(),12,'Muslim doit commencer avec 12 cartes');
    assert.match(await page.locator('.bukhari-showcase-hero h2').innerText(),/Muslim/);
    assert.equal(await page.locator('.bukhari-book-switch button').count(),3,'Introduction et Foi doivent être accessibles');
    await page.locator('.bukhari-card-link').first().click();
    await page.locator('.bukhari-reader-pro').waitFor({state:'visible'});
    assert.match(await page.locator('.bukhari-reader-meta').innerText(),/Narration n° 1/);
    assert.ok((await page.locator('.bukhari-reader-original blockquote').innerText()).length>90,'Muslim 1 : arabe absent');
    await page.locator('.bukhari-reader-source summary').click();
    assert.equal(await page.locator('a[href="https://sunnah.com/muslim:1"]').count(),1,'Muslim 1 : source absente');
    await page.locator('.bukhari-reader-back').click();
    await page.locator('.bukhari-book-view').waitFor({state:'visible'});
    await page.locator('.bukhari-book-switch button').nth(2).click();
    assert.match(await page.locator('.bukhari-card-number').first().innerText(),/8/);
    await page.locator('.bukhari-card-link').first().click();
    await page.locator('.bukhari-reader-pro').waitFor({state:'visible'});
    assert.match(await page.locator('.bukhari-reader-book').innerText(),/Foi/);
    assert.match(await page.locator('.bukhari-reader-meta').innerText(),/8/);
    await page.locator('.bukhari-reader-back').click();
    await page.locator('.bukhari-book-view').waitFor({state:'visible'});
    await page.locator('.bukhari-catalog-search input').fill('50');
    await page.locator('.bukhari-card').first().waitFor({state:'visible'});
    assert.match(await page.locator('.bukhari-card-number').first().innerText(),/50/);
    await page.locator('.bukhari-card-link').first().click();
    await page.locator('.bukhari-reader-pro').waitFor({state:'visible'});
    assert.ok((await page.locator('.bukhari-reader-original blockquote').innerText()).length>150,'Muslim 50 : arabe absent');
    assert.ok((await page.locator('.bukhari-reader-translation p').first().innerText()).length>80,'Muslim 50 : français absent');
    await page.locator('.bukhari-reader-source summary').click();
    assert.equal(await page.locator('a[href="https://sunnah.com/muslim:50"]').count(),1,'Muslim 50 : source absente');
    await page.locator('.bukhari-reader-back').click();
    await page.locator('.bukhari-book-view').waitFor({state:'visible'});
    await page.locator('.hadith-kutub-back').click();
    // Sunan Abî Dâwûd : 50 références du Livre de la purification dans le lecteur bilingue.
    await page.locator('.hadith-kutub-book').nth(2).click();
    await page.locator('.bukhari-card').first().waitFor({state:'visible',timeout:15000});
    assert.equal(await page.locator('.bukhari-card').count(),12,'Abî Dâwûd doit afficher 12 cartes au départ');
    assert.match(await page.locator('.bukhari-showcase-hero h2').innerText(),/Dâwûd/);
    assert.equal(await page.locator('.bukhari-book-switch button').count(),2,'Le seul livre Purification doit être accessible');
    await page.locator('.bukhari-card-link').first().click();
    await page.locator('.bukhari-reader-pro').waitFor({state:'visible'});
    assert.match(await page.locator('.bukhari-reader-book').innerText(),/Purification/);
    assert.ok((await page.locator('.bukhari-reader-original blockquote').innerText()).length>100,'Abî Dâwûd 1 : arabe absent');
    assert.ok((await page.locator('.bukhari-reader-translation p').first().innerText()).length>50,'Abî Dâwûd 1 : français absent');
    await page.locator('.bukhari-reader-source summary').click();
    assert.equal(await page.locator('a[href="https://sunnah.com/abudawud:1"]').count(),1,'Abî Dâwûd 1 : source absente');
    assert.ok(await page.locator('.bukhari-reader-source-records').count()>0,'Abî Dâwûd : appréciations non affichées');
    assert.match(await page.locator('.bukhari-reader-source').innerText(),/Al-Albani/,'Abî Dâwûd : auteur de l’appréciation absent');
    await page.locator('.bukhari-reader-back').click();
    await page.locator('.bukhari-book-view').waitFor({state:'visible'});
    await page.locator('.bukhari-catalog-search input').fill('Donner le siwâk à la personne la plus âgée');
    assert.equal(await page.locator('.bukhari-card').count(),1,'Abî Dâwûd 50 doit être trouvable par titre');
    assert.match(await page.locator('.bukhari-card-number').first().innerText(),/50/);
    await page.locator('.bukhari-card-link').click();
    await page.locator('.bukhari-reader-pro').waitFor({state:'visible'});
    assert.ok((await page.locator('.bukhari-reader-original blockquote').innerText()).length>200,'Abî Dâwûd 50 : arabe absent');
    await page.locator('.bukhari-reader-source summary').click();
    assert.equal(await page.locator('a[href="https://sunnah.com/abudawud:50"]').count(),1,'Abî Dâwûd 50 : source absente');
    await page.locator('.bukhari-reader-back').click();
    await page.locator('.bukhari-book-view').waitFor({state:'visible'});
    assert.equal(await page.locator('.hadith-sharh-bridge').count(),0,'Le cours de croyance ne doit plus apparaître dans Sunan Abî Dâwûd');
    await page.locator('.hadith-kutub-back').click();
    for (let index=3; index<6; index++) {
        await page.locator('.hadith-kutub-book').nth(index).click();
        await page.locator('.hadith-kutub-book-view').waitFor({state:'visible'});
        await page.locator('.hadith-kutub-empty h3').waitFor({state:'visible',timeout:12000});
        assert.match(await page.locator('.hadith-kutub-book-counts').innerText(),/0 livre.*0 hadith/s,
            'Un autre recueil supposé vide possède du contenu');
        assert.match(await page.locator('.hadith-kutub-empty h3').innerText(),/prêt à être rempli/i);
        await page.getByRole('button',{name:'Tous les recueils'}).click();
    }
    await page.locator('.hadith-kutub-tabs button').nth(0).click();
    assert.equal(await page.locator('.hadith-pro-card').count(),18,'Le corpus original ne revient pas');
    await home(page);
    // Usûl al-Fiqh est la huitième rubrique publique, avec les cours et le lexique d'origine.
    await navigate(page,'ussul');
    await page.locator('.ussul-pro-root').waitFor({state:'visible',timeout:15000});
    assert.equal(await page.locator('.ussul-pro-course-card').count(),7,'Les sept cours historiques ne sont pas visibles');
    assert.match(await page.locator('.ussul-pro-hero h1').innerText(),/Usûl al-Fiqh/);
    assert.equal(await page.locator('.belief-study').count(),0,'La section Croyance reste visible');
    await page.locator('.ussul-glossary-launch').click();
    await page.locator('#ussul-course-lexicon').waitFor({state:'visible'});
    assert.ok(await page.locator('.ussul-glossary-entry').count()>=20,'Les notions du lexique sont manquantes');
    await page.locator('.ussul-glossary-search input').fill('Mutakallimin');
    assert.ok(await page.locator('.ussul-glossary-entry').count()>=1,'Recherche lexique inactive');
    await page.locator('.ussul-glossary-entry button').first().click();
    await page.locator('.ussul-pro-reader').waitFor({state:'visible'});
    assert.ok(await page.locator('.ussul-pro-content-section').count()>0,'Texte complet de la leçon absent');
    assert.ok(await page.locator('.ussul-pro-deep-dive').count()>0,'Approfondissements historiques perdus');
    assert.ok(await page.locator('.ussul-pro-prose .term-highlight').count()>0,'Termes du corpus non mis en relief');
    await page.locator('.ussul-pro-lesson-actions button').filter({hasText:'Marquer comme terminée'}).click();
    await page.locator('.ussul-pro-back').click();
    await page.locator('.ussul-pro-course-grid').waitFor({state:'visible'});
    assert.match(await page.locator('.ussul-pro-progress-card').innerText(),/1 leçon terminée/,'Progression non conservée');
    await page.route('https://www.youtube-nocookie.com/**',route=>route.fulfill({status:200,contentType:'text/html',body:'<!doctype html><html><body>Lecteur simulé</body></html>'}));
    await page.locator('.ussul-pro-course-video').first().click();
    await page.locator('.ussul-video-player.is-theater').waitFor({state:'visible'});
    assert.equal(await page.locator('.ussul-video-frame iframe').count(),1,'Le lecteur intégré du cours ne s’ouvre pas');
    assert.match(await page.locator('.ussul-video-frame iframe').getAttribute('src'),/youtube-nocookie.com\/embed\//,'Mauvaise origine vidéo');
    await page.locator('.ussul-video-player button[title="Réduire en PiP"]').click();
    await page.locator('.ussul-video-player.is-floating').waitFor({state:'visible'});
    await page.locator('.ussul-video-player button[title="Agrandir"]').click();
    await page.locator('.ussul-video-player.is-theater').waitFor({state:'visible'});
    await page.locator('.ussul-video-player button[title="Fermer"]').click();
    assert.equal(await page.locator('.ussul-video-layer').count(),0,'Le lecteur vidéo ne se ferme pas');
    await page.locator('.ussul-pro-back').click();
    await page.locator('.ussul-pro-back').click();
    await ready(page);

    // Fiqh malikite : le catalogue est l'entrée principale, comme pour Usûl.
    await navigate(page,'fiqh-maliki');
    await page.locator('.fiqh-m-index').waitFor({state:'visible'});
    assert.match(await page.locator('#fiqh-m-index-heading').innerText(),/Fiqh malikite/);
    assert.equal(await page.locator('.fiqh-m-catalog-card').count(),15,'Le catalogue doit afficher quinze fiches');
    assert.match(await page.locator('.fiqh-m-index-progress').innerText(),/fiche/);
    await page.locator('.fiqh-m-index-search input').fill('rosée');
    assert.ok(await page.locator('.fiqh-m-catalog-card').count()>=1 && await page.locator('.fiqh-m-catalog-card').count()<15,'La recherche dans les cours et le lexique est inactive');
    assert.match(await page.locator('.fiqh-m-catalog-card h2').first().innerText(),/eaux naturelles/i);
    await page.locator('.fiqh-m-index-search input').fill('expression introuvable xyz 987');
    assert.equal(await page.locator('.fiqh-m-catalog-card').count(),0,'Aucun résultat ne devrait correspondre à cette recherche');
    await page.locator('.fiqh-m-index-search input').fill('');
    assert.equal(await page.locator('.fiqh-m-catalog-card').count(),15,'Toutes les cartes doivent réapparaître');
    await page.locator('.fiqh-m-catalog-main').first().click();
    assert.match(await page.locator('#fiqh-m-heading').innerText(),/Comprendre le livre/);
    assert.equal(await page.locator('.fiqh-m-lesson-link').count(),15,'Les quinze fiches doivent être accessibles dans le lecteur');
    assert.equal(await page.locator('.fiqh-m-section').count(),4,'Quatre parties dans la fiche introductive attendues');
    assert.ok(await page.locator('a[href="https://usul.ai/ar/t/mawahib-al-jalil-fi-sharh-mukhtasar-khalil"]').count()>=1,'Livre original non référencé');
    assert.equal(await page.locator('.fiqh-m-passage').count(),4,'Chaque étape doit afficher un extrait arabe suivi de sa traduction');
    assert.equal(await page.locator('.fiqh-m-passage-translation').count(),4,'Traductions pédagogiques manquantes');
    assert.equal(await page.locator('.fiqh-m-breakdown').count(),4,'Décomposition pas à pas absente');
    assert.equal(await page.locator('.fiqh-m-case').count(),4,'Exemples concrets absents');
    assert.equal(await page.locator('.fiqh-m-takeaway').count(),4,'Repères « à retenir » absents');
    assert.equal(await page.locator('.fiqh-m-goals li').count(),4,'Objectifs de lecture absents');
    assert.match(await page.locator('.fiqh-m-passage blockquote').first().innerText(),/فساد العبادة وصحتها/);
    assert.match(await page.locator('.fiqh-m-quote blockquote').innerText(),/الألغاز/,'Extrait de la préface non visible');
    await page.locator('.fiqh-m-tabs button').filter({hasText:'Lexique'}).click();
    assert.equal(await page.locator('.fiqh-m-term').count(),8,'Lexique introductif de huit notions absent');
    await page.locator('.fiqh-m-search input').fill('Mukhtasar');
    assert.ok(await page.locator('.fiqh-m-term').count()>=1 && await page.locator('.fiqh-m-term').count()<8,'Recherche du lexique inactive');
    assert.match(await page.locator('.fiqh-m-term h3').first().innerText(),/Mukhtasar/);
    await page.locator('.fiqh-m-tabs button').filter({hasText:'Se vérifier'}).click();
    assert.equal(await page.locator('.fiqh-m-question').count(),5,'Cinq questions de raisonnement attendues pour la fiche 01');
    await page.locator('.fiqh-m-question').first().locator('.fiqh-m-choices button').nth(1).click();
    assert.match(await page.locator('.fiqh-m-question').first().innerText(),/Bonne réponse/);
    await page.locator('.fiqh-m-tabs button').filter({hasText:'Lire la fiche'}).click();
    if (await page.locator('.fiqh-m-complete').getAttribute('aria-pressed') !== 'true') await page.locator('.fiqh-m-complete').click();
    assert.match(await page.locator('.fiqh-m-complete').innerText(),/marquée comme lue/);

    await page.locator('.fiqh-m-lesson-link').nth(1).click();
    assert.match(await page.locator('#fiqh-m-heading').innerText(),/purification/i);
    assert.equal(await page.locator('.fiqh-m-section').count(),5,'La fiche 02 doit comporter cinq lectures guidées');
    assert.equal(await page.locator('.fiqh-m-goals li').count(),5,'Les objectifs pédagogiques de la fiche 02 manquent');
    assert.equal(await page.locator('.fiqh-m-passage').count(),5,'Cinq citations arabes intégrées attendues');
    assert.equal(await page.locator('.fiqh-m-passage-translation').count(),5,'Traductions de passage manquantes');
    assert.equal(await page.locator('.fiqh-m-breakdown').count(),5,'Décompositions pédagogiques manquantes');
    assert.equal(await page.locator('.fiqh-m-case').count(),5,'Exemples concrets manquants');
    assert.equal(await page.locator('.fiqh-m-takeaway').count(),5,'À retenir manquants');
    assert.equal(await page.locator('.fiqh-m-passage-link').count(),5,'Les liens directs vers les passages originaux doivent être présents');
    assert.match(await page.locator('.fiqh-m-passage').nth(2).innerText(),/المشهور أنه لا يرفع الحدث/,'Mashhûr sur le tayammum non visible');
    assert.match(await page.locator('.fiqh-m-passage').nth(3).innerText(),/المشهور في المذهب/,'Mashhûr sur le khabath non visible');
    assert.match(await page.locator('.fiqh-m-quote blockquote').innerText(),/ما صدق عليه اسم ماء بلا قيد/);
    assert.ok(await page.locator('a[href*="/ar/library/content/19/84/"]').count()>=1,'Première source du Kitâb al-Tahâra absente');
    assert.ok(await page.locator('a[href*="/ar/library/content/19/85/"]').count()>=1,'Source sur l’eau mutlaq absente');
    assert.equal(await page.locator('.fiqh-m-section').first().locator('p:not(.fiqh-m-reference)').first().evaluate(el => getComputedStyle(el).textAlign),'justify','Les paragraphes français doivent être justifiés');
    assert.equal(await page.locator('.fiqh-m-complete').getAttribute('aria-pressed'),'false','La fiche 01 ne doit pas valider la fiche 02');
    await page.locator('.fiqh-m-tabs button').filter({hasText:'Lexique'}).click();
    assert.equal(await page.locator('.fiqh-m-term').count(),10,'Dix termes requis pour la fiche 02');
    await page.locator('.fiqh-m-search input').fill('mutlaq');
    assert.ok((await page.locator('.fiqh-m-term').count())>=1 && (await page.locator('.fiqh-m-term').count())<10,'Recherche du vocabulaire technique inactive');
    await page.locator('.fiqh-m-tabs button').filter({hasText:'Se vérifier'}).click();
    assert.equal(await page.locator('.fiqh-m-question').count(),7,'Sept questions corrigées attendues');
    assert.equal(await page.locator('.fiqh-m-answer').count(),0,'Réponses de la fiche 01 présentes par erreur');
    await page.locator('.fiqh-m-question').first().locator('.fiqh-m-choices button').nth(1).click();
    assert.match(await page.locator('.fiqh-m-question').first().innerText(),/Bonne réponse/);
    await page.locator('.fiqh-m-tabs button').filter({hasText:'Lire la fiche'}).click();
    await page.locator('.fiqh-m-complete').click();
    assert.match(await page.locator('.fiqh-m-complete').innerText(),/marquée comme lue/);
    assert.deepEqual(await page.evaluate(() => [
        localStorage.getItem('athar_fiqh_maliki_intro_01_done'),
        localStorage.getItem('athar_fiqh_maliki_tahara_02_done')
    ]),['1','1'],'Le suivi des fiches 01 et 02 doit rester distinct');
    await page.locator('.fiqh-m-lesson-link').first().click();
    assert.match(await page.locator('#fiqh-m-heading').innerText(),/Comprendre le livre/);
    assert.equal(await page.locator('.fiqh-m-complete').getAttribute('aria-pressed'),'true','La progression de la fiche 01 a été perdue');

    // Fiche 03 : cours guidé, six passages attribués, huit QCM et liens directs.
    assert.equal(await page.locator('.fiqh-m-lesson-link').count(),15,'Les quinze fiches doivent être accessibles');
    await page.locator('.fiqh-m-lesson-link').nth(2).click();
    assert.match(await page.locator('#fiqh-m-heading').innerText(),/eaux naturelles/i);
    assert.equal(await page.locator('.fiqh-m-section').count(),6,'Six étapes de lecture attendues pour la fiche 03');
    assert.equal(await page.locator('.fiqh-m-goals li').count(),5,'Cinq objectifs attendus');
    assert.equal(await page.locator('.fiqh-m-passage').count(),6,'Six citations intégrées attendues');
    assert.equal(await page.locator('.fiqh-m-passage-translation').count(),6,'Chaque citation doit être traduite');
    assert.equal(await page.locator('.fiqh-m-breakdown').count(),6,'Six développements pas à pas attendus');
    assert.equal(await page.locator('.fiqh-m-case').count(),6,'Six exemples concrets attendus');
    assert.equal(await page.locator('.fiqh-m-takeaway').count(),6,'Six conclusions à retenir attendues');
    assert.equal(await page.locator('.fiqh-m-passage-link').count(),6,'Six liens vers les passages arabes originaux attendus');
    assert.match(await page.locator('.fiqh-m-passage blockquote').nth(1).innerText(),/ماء البحر/);
    assert.match(await page.locator('.fiqh-m-passage blockquote').nth(3).innerText(),/الندى/);
    assert.match(await page.locator('.fiqh-m-passage blockquote').nth(5).innerText(),/المشهور/);
    assert.match(await page.locator('.fiqh-m-quote blockquote').innerText(),/مِنْ نَدًى/);
    assert.ok(await page.locator('a[href*="/ar/library/content/19/85/"]').count()>=1,'Source de l’eau de mer manquante');
    assert.ok(await page.locator('a[href*="ID=87"]').count()>=1,'Source directe de la rosée manquante');
    assert.ok(await page.locator('a[href*="/ar/library/content/19/88/"]').count()>=1,'Source de la neige et du sel manquante');
    assert.equal(await page.locator('.fiqh-m-section').first().locator('p:not(.fiqh-m-reference)').first().evaluate(el=>getComputedStyle(el).textAlign),'justify','La lecture française doit être justifiée');
    assert.equal(await page.locator('.fiqh-m-complete').getAttribute('aria-pressed'),'false','La fiche 03 a été marquée lue à tort');
    await page.locator('.fiqh-m-tabs button').filter({hasText:'Lexique'}).click();
    assert.equal(await page.locator('.fiqh-m-term').count(),10,'Lexique de dix notions attendu');
    await page.locator('.fiqh-m-search input').fill('Nadâ');
    assert.ok((await page.locator('.fiqh-m-term').count())>=1 && (await page.locator('.fiqh-m-term').count())<10,'Recherche de nadâ inactive');
    await page.locator('.fiqh-m-tabs button').filter({hasText:'Se vérifier'}).click();
    assert.equal(await page.locator('.fiqh-m-question').count(),8,'Huit QCM attendus');
    assert.equal(await page.locator('.fiqh-m-answer').count(),0,'Réponses des autres fiches conservées par erreur');
    await page.locator('.fiqh-m-question').first().locator('.fiqh-m-choices button').first().click();
    assert.match(await page.locator('.fiqh-m-question').first().innerText(),/Bonne réponse/);
    await page.locator('.fiqh-m-tabs button').filter({hasText:'Lire la fiche'}).click();
    await page.locator('.fiqh-m-complete').click();
    assert.match(await page.locator('.fiqh-m-complete').innerText(),/marquée comme lue/);
    assert.equal(await page.evaluate(()=>localStorage.getItem('athar_fiqh_maliki_eaux_03_done')),'1','Progression autonome de la fiche 03 non persistée');
    await page.locator('.fiqh-m-lesson-link').nth(1).click();
    assert.equal(await page.locator('.fiqh-m-complete').getAttribute('aria-pressed'),'true','Lecture de la fiche 02 perdue');

    // Fiche 04 : six lectures arabes commentées, liens source et progression indépendante.
    assert.equal(await page.locator('.fiqh-m-lesson-link').count(),15);
    await page.locator('.fiqh-m-lesson-link').nth(3).click();
    assert.match(await page.locator('#fiqh-m-heading').innerText(),/eau modifiée/i);
    assert.equal(await page.locator('.fiqh-m-section').count(),6);
    assert.equal(await page.locator('.fiqh-m-goals li').count(),6);
    assert.equal(await page.locator('.fiqh-m-passage').count(),6);
    assert.equal(await page.locator('.fiqh-m-passage-translation').count(),6);
    assert.equal(await page.locator('.fiqh-m-passage-link').count(),6);
    assert.equal(await page.locator('.fiqh-m-breakdown').count(),6);
    assert.equal(await page.locator('.fiqh-m-case').count(),6);
    assert.equal(await page.locator('.fiqh-m-takeaway').count(),6);
    assert.match(await page.locator('.fiqh-m-passage blockquote').nth(0).innerText(),/لونا أو طعما أو ريحا/);
    assert.match(await page.locator('.fiqh-m-passage blockquote').nth(4).innerText(),/المذهب/);
    assert.ok(await page.locator('a[href*="/ar/library/content/19/101/"]').count()>0);
    assert.equal(await page.locator('.fiqh-m-section').first().locator('p:not(.fiqh-m-reference)').first().evaluate(el=>getComputedStyle(el).textAlign),'justify');
    assert.equal(await page.locator('.fiqh-m-complete').getAttribute('aria-pressed'),'false');
    await page.locator('.fiqh-m-tabs button').filter({hasText:'Lexique'}).click();
    assert.equal(await page.locator('.fiqh-m-term').count(),10);
    await page.locator('.fiqh-m-search input').fill('Mukhâlata');
    assert.ok(await page.locator('.fiqh-m-term').count()>=1);
    await page.locator('.fiqh-m-tabs button').filter({hasText:'Se vérifier'}).click();
    assert.equal(await page.locator('.fiqh-m-question').count(),8);
    await page.locator('.fiqh-m-question').first().locator('.fiqh-m-choices button').nth(1).click();
    assert.match(await page.locator('.fiqh-m-question').first().innerText(),/Bonne réponse/);
    await page.locator('.fiqh-m-tabs button').filter({hasText:'Lire la fiche'}).click();
    await page.locator('.fiqh-m-complete').click();
    assert.equal(await page.evaluate(()=>localStorage.getItem('athar_fiqh_maliki_eaux_04_done')),'1');

    // Fiche 05 : sept lectures guidées, avis du madhhab et quiz avancé.
    await page.locator('.fiqh-m-lesson-link').nth(4).click();
    assert.match(await page.locator('#fiqh-m-heading').innerText(),/mélanges purs/i);
    assert.equal(await page.locator('.fiqh-m-section').count(),7,'Sept lectures guidées attendues');
    assert.equal(await page.locator('.fiqh-m-goals li').count(),7,'Sept objectifs de compréhension requis');
    assert.equal(await page.locator('.fiqh-m-passage').count(),7,'Sept passages arabes attendus');
    assert.equal(await page.locator('.fiqh-m-passage-translation').count(),7);
    assert.equal(await page.locator('.fiqh-m-passage-link').count(),7);
    assert.equal(await page.locator('.fiqh-m-breakdown').count(),7);
    assert.equal(await page.locator('.fiqh-m-case').count(),7);
    assert.equal(await page.locator('.fiqh-m-takeaway').count(),7);
    assert.match(await page.locator('.fiqh-m-passage blockquote').first().innerText(),/طاهر غير مطهر/);
    assert.match(await page.locator('.fiqh-m-passage blockquote').nth(4).innerText(),/المذهب/);
    assert.match(await page.locator('.fiqh-m-passage blockquote').nth(5).innerText(),/ابن هارون/);
    assert.ok(await page.locator('a[href*="/ar/library/content/19/101/"]').count()>=1);
    assert.equal(await page.locator('.fiqh-m-section').first().locator('p:not(.fiqh-m-reference)').first().evaluate(el=>getComputedStyle(el).textAlign),'justify','Les paragraphes doivent rester justifiés');
    assert.equal(await page.locator('.fiqh-m-complete').getAttribute('aria-pressed'),'false','La fiche 05 ne doit pas être prévalidée');
    await page.locator('.fiqh-m-tabs button').filter({hasText:'Lexique'}).click();
    assert.equal(await page.locator('.fiqh-m-term').count(),12,'Douze entrées attendues');
    await page.locator('.fiqh-m-search input').fill('Za‘farân');
    assert.ok(await page.locator('.fiqh-m-term').count()>=1,'Recherche du safran inactive');
    await page.locator('.fiqh-m-tabs button').filter({hasText:'Se vérifier'}).click();
    assert.equal(await page.locator('.fiqh-m-question').count(),9,'Neuf questions corrigées requises');
    assert.equal(await page.locator('.fiqh-m-answer').count(),0);
    await page.locator('.fiqh-m-question').first().locator('.fiqh-m-choices button').first().click();
    assert.match(await page.locator('.fiqh-m-question').first().innerText(),/Bonne réponse/);
    await page.locator('.fiqh-m-tabs button').filter({hasText:'Lire la fiche'}).click();
    await page.locator('.fiqh-m-complete').click();
    assert.equal(await page.evaluate(()=>localStorage.getItem('athar_fiqh_maliki_eaux_05_done')),'1');

    // Fiche 06 : eau souillée, eau inchangée, avis connu et divergences attribuées.
    await page.locator('.fiqh-m-lesson-link').nth(5).click();
    assert.match(await page.locator('#fiqh-m-heading').innerText(),/impureté/i);
    assert.equal(await page.locator('.fiqh-m-section').count(),7,'Sept lectures guidées attendues dans la fiche 06');
    assert.equal(await page.locator('.fiqh-m-goals li').count(),7,'Sept objectifs attendus');
    assert.equal(await page.locator('.fiqh-m-passage').count(),7,'Sept extraits arabes attendus');
    assert.equal(await page.locator('.fiqh-m-passage-translation').count(),7,'Toutes les citations doivent être traduites');
    assert.equal(await page.locator('.fiqh-m-passage-link').count(),7,'Les passages originaux doivent être consultables');
    assert.equal(await page.locator('.fiqh-m-breakdown').count(),7,'Décomposition pédagogique absente');
    assert.equal(await page.locator('.fiqh-m-case').count(),7,'Exemples concrets absents');
    assert.equal(await page.locator('.fiqh-m-takeaway').count(),7,'À retenir manquants');
    assert.match(await page.locator('.fiqh-m-passage blockquote').nth(0).innerText(),/نجسا فالماء نجس/);
    assert.match(await page.locator('.fiqh-m-passage blockquote').nth(3).innerText(),/فإنه طهور/);
    assert.match(await page.locator('.fiqh-m-passage blockquote').nth(5).innerText(),/ابن القاسم/);
    assert.match(await page.locator('.fiqh-m-passage blockquote').nth(6).innerText(),/مراعاة الخلاف/);
    assert.ok(await page.locator('a[href*="/ar/library/content/19/101/"]').count()>=1,'Source p. 59 non liée');
    assert.ok(await page.locator('a[href*="/ar/library/content/19/109/"]').count()>=1,'Source p. 70–72 non liée');
    assert.equal(await page.locator('.fiqh-m-section').first().locator('p:not(.fiqh-m-reference)').first().evaluate(el=>getComputedStyle(el).textAlign),'justify','Les paragraphes français doivent être justifiés');
    assert.equal(await page.locator('.fiqh-m-complete').getAttribute('aria-pressed'),'false','La fiche 06 ne doit pas hériter de la lecture 05');
    await page.locator('.fiqh-m-tabs button').filter({hasText:'Lexique'}).click();
    assert.equal(await page.locator('.fiqh-m-term').count(),12,'Douze mots du lexique attendus');
    await page.locator('.fiqh-m-search input').fill('Murâ');
    assert.ok(await page.locator('.fiqh-m-term').count()>=1,'Recherche de murâ‘ât al-khilâf inactive');
    await page.locator('.fiqh-m-tabs button').filter({hasText:'Se vérifier'}).click();
    assert.equal(await page.locator('.fiqh-m-question').count(),9,'Neuf questions corrigées attendues');
    assert.equal(await page.locator('.fiqh-m-answer').count(),0,'Le quiz doit être réinitialisé');
    await page.locator('.fiqh-m-question').first().locator('.fiqh-m-choices button').first().click();
    assert.match(await page.locator('.fiqh-m-question').first().innerText(),/Bonne réponse/);
    await page.locator('.fiqh-m-tabs button').filter({hasText:'Lire la fiche'}).click();
    await page.locator('.fiqh-m-complete').click();
    assert.equal(await page.evaluate(()=>localStorage.getItem('athar_fiqh_maliki_eaux_06_done')),'1','Progression propre à la fiche 06 non sauvegardée');
    await page.locator('.fiqh-m-lesson-link').nth(4).click();
    assert.equal(await page.locator('.fiqh-m-complete').getAttribute('aria-pressed'),'true','La progression de la fiche 05 a été perdue');
    assert.match(await page.locator('.fiqh-m-aside-progress').innerText(),/6\s*\/\s*14/,'Progression des six premières fiches erronée');

    // Fiches 07 à 09 : eau déjà utilisée, usages recommandés, eau courante et stagnante.
    const fiqhAdvancedLessons = [
        {index:6,number:'07',title:/eau déjà utilisée/i,quote:/وكره ماء مستعمل في حدث/,source:'/19/107/',search:'musta',parts:7,terms:12,questions:9,key:'athar_fiqh_maliki_eaux_07_done'},
        {index:7,number:'08',title:/usages recommandés/i,quote:/وفي غيره تردد/,source:'/19/108/',search:'Taraddud',parts:9,terms:14,questions:12,key:'athar_fiqh_maliki_eaux_08_done'},
        {index:8,number:'09',title:/eau courante et stagnante/i,quote:/وراكد يغتسل فيه/,source:'/19/113/',search:'Jirya',parts:10,terms:15,questions:12,key:'athar_fiqh_maliki_eaux_09_done'}
    ];
    for(const check of fiqhAdvancedLessons){
        await page.locator('.fiqh-m-lesson-link').nth(check.index).click();
        assert.match(await page.locator('#fiqh-m-heading').innerText(),check.title,'Titre erroné : '+check.number);
        assert.equal(await page.locator('.fiqh-m-section').count(),check.parts,'Nombre de lectures incorrect pour '+check.number);
        if(check.number === '09'){
            assert.equal(await page.locator('.fiqh-m-goals li').count(),10,'Dix objectifs attendus dans la fiche 09');
            assert.equal(await page.locator('.fiqh-m-passage').count(),10,'Dix citations attendues en fiche 09');
            assert.equal(await page.locator('.fiqh-m-passage-translation').count(),10,'Dix traductions attendues');
            assert.equal(await page.locator('.fiqh-m-passage-link').count(),10,'Dix liens vers les sources attendus');
            assert.equal(await page.locator('.fiqh-m-breakdown').count(),10,'Dix analyses décomposées attendues');
            assert.equal(await page.locator('.fiqh-m-case').count(),10,'Dix cas d’étude attendus');
            assert.equal(await page.locator('.fiqh-m-takeaway').count(),10,'Dix synthèses attendues');
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(0).innerText(),/أما الماء الجاري فحكمه كالكثير/,'Citation sur l’eau courante absente');
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(3).innerText(),/والظاهر ما قاله ابن عبد السلام/,'Préférence d’al-Hattâb absente');
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(6).innerText(),/وراكد يغتسل فيه/,'Formule de Khalîl absente');
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(8).innerText(),/القول المشهور/,'Discussion du mashhûr absente');
            assert.ok(await page.locator('a[href*="/19/111/"]').count()>=1,'Lien au texte de l’eau courante absent');
            assert.ok(await page.locator('a[href*="/19/113/"]').count()>=1,'Lien au texte de l’eau stagnante absent');
        }
        if(check.number === '08'){
            assert.equal(await page.locator('.fiqh-m-goals li').count(),9,'Neuf objectifs attendus en fiche 08');
            assert.equal(await page.locator('.fiqh-m-passage').count(),9,'Neuf citations arabes attendues');
            assert.equal(await page.locator('.fiqh-m-passage-translation').count(),9,'Neuf traductions attendues');
            assert.equal(await page.locator('.fiqh-m-passage-link').count(),9,'Neuf liens vers les sources attendus');
            assert.equal(await page.locator('.fiqh-m-breakdown').count(),9,'Neuf explications détaillées attendues');
            assert.equal(await page.locator('.fiqh-m-case').count(),9,'Neuf situations pédagogiques attendues');
            assert.equal(await page.locator('.fiqh-m-takeaway').count(),9,'Neuf synthèses attendues');
            assert.match(await page.locator('.fiqh-m-passage blockquote').first().innerText(),/وفي غيره تردد/,'Formule de Khalîl absente');
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(4).innerText(),/سببه أمران/,'Analyse d’al-Qarâfî absente');
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(7).innerText(),/مكروه وبلا تردد/,'Conclusion d’al-Hattâb absente');
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(8).innerText(),/لا كراهة فيه/,'Dernière distinction absente');
        }
        if(check.number === '07'){
            assert.equal(await page.locator('.fiqh-m-goals li').count(),7,'Sept objectifs attendus en fiche 07');
            assert.equal(await page.locator('.fiqh-m-passage').count(),7,'Sept passages arabes attendus en fiche 07');
            assert.equal(await page.locator('.fiqh-m-passage-translation').count(),7,'Sept traductions absentes en fiche 07');
            assert.equal(await page.locator('.fiqh-m-passage-link').count(),7,'Sept sources primaires doivent être accessibles en fiche 07');
            assert.equal(await page.locator('.fiqh-m-breakdown').count(),7,'Sept analyses décomposées attendues');
            assert.equal(await page.locator('.fiqh-m-case').count(),7,'Sept exemples pédagogiques attendus');
            assert.equal(await page.locator('.fiqh-m-takeaway').count(),7,'Sept conclusions à retenir attendues');
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(0).innerText(),/وكره ماء مستعمل في حدث/,'Citation de Khalîl absente');
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(2).innerText(),/فإن لم يجد غيره/,'Cas de besoin absent');
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(3).innerText(),/مقابل المشهور/,'Opinions divergentes absentes');
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(6).innerText(),/ولا يجوز له التيمم/,'Conclusion en p. 68 absente');
        }
        assert.match(await page.locator('.fiqh-m-quote blockquote').innerText(),check.quote,'Citation arabe manquante : '+check.number);
        assert.ok(await page.locator('a[href*="'+check.source+'"]').count()>=1,'Source primaire absente : '+check.number);
        assert.equal(await page.locator('.fiqh-m-complete').getAttribute('aria-pressed'),'false','Fiche '+check.number+' marquée comme lue à tort');
        await page.locator('.fiqh-m-tabs button').filter({hasText:'Lexique'}).click();
        assert.equal(await page.locator('.fiqh-m-term').count(),check.terms,'Lexique incomplet : '+check.number);
        await page.locator('.fiqh-m-search input').fill(check.search);
        assert.equal(await page.locator('.fiqh-m-term').count(),1,'Recherche de lexique inactive : '+check.number);
        await page.locator('.fiqh-m-tabs button').filter({hasText:'Se vérifier'}).click();
        assert.equal(await page.locator('.fiqh-m-question').count(),check.questions,'Quiz incomplet : '+check.number);
        assert.equal(await page.locator('.fiqh-m-answer').count(),0,'Quiz contaminé : '+check.number);
        await page.locator('.fiqh-m-choices button').first().click();
        assert.equal(await page.locator('.fiqh-m-answer').count(),1,'Correction du quiz absente : '+check.number);
        await page.locator('.fiqh-m-tabs button').filter({hasText:'Lire la fiche'}).click();
        await page.locator('.fiqh-m-complete').click();
        assert.equal(await page.locator('.fiqh-m-complete').getAttribute('aria-pressed'),'true');
        assert.equal(await page.evaluate(key=>localStorage.getItem(key),check.key),'1','Progression de '+check.number+' non persistée');
    }
    assert.match(await page.locator('.fiqh-m-aside-progress').innerText(),/9\s*\/\s*14/,'Progression des fiches précédentes erronée');
    // Fiches 10-12 : bassin public, eau du puits peu abondante, et reste d'eau (su’r).
    const fiqhLatestLessons=[
        {index:9,number:'10',title:/bassins collectifs/i,quote:/يُفْرَغُ بِسُرْعَةٍ/,source:'/19/114/',search:'Birak',parts:9,terms:15,questions:12,key:'athar_fiqh_maliki_eaux_10_done'},
        {index:10,number:'11',title:/eau limitée/i,quote:/يَحْتَالُ/,source:'/19/115/',search:'Bi’r',parts:11,terms:18,questions:12,key:'athar_fiqh_maliki_eaux_11_done'},
        {index:11,number:'12',title:/su’r/i,quote:/الِاحْتِرَازُ/,source:'/19/118/',search:'Tawwâfûn',parts:14,terms:20,questions:17,key:'athar_fiqh_maliki_eaux_12_done'},
        {index:12,number:'13',title:/eau chauffée au soleil/i,quote:/كَمُشَمَّسٍ/,source:'/19/120/',search:'Mushammas',parts:15,terms:20,questions:16,key:'athar_fiqh_maliki_eaux_13_done'},
        {index:13,number:'14',title:/eau chaude et le hammam/i,quote:/لَمْ يَطْلُبْ/,source:'/4471/112',search:'Hammâm',parts:19,terms:22,questions:19,key:'athar_fiqh_maliki_eaux_14_done'},
        {index:14,number:'15',title:/souillures constatées et animal mort/i,quote:/تسعة وأربعين/,source:'/4471/115',search:'Nafs sâ’ila',parts:20,terms:22,questions:20,key:'athar_fiqh_maliki_eaux_15_done'}
    ];
    for(const check of fiqhLatestLessons){
        await page.locator('.fiqh-m-lesson-link').nth(check.index).click();
        assert.match(await page.locator('#fiqh-m-heading').innerText(),check.title,'Titre absent '+check.number);
        assert.equal(await page.locator('.fiqh-m-section').count(),check.parts||4,'Nombre de lectures incorrect pour '+check.number);
        if(check.number==='15'){
            for(const selector of ['.fiqh-m-goals li','.fiqh-m-passage','.fiqh-m-passage-translation','.fiqh-m-passage-link','.fiqh-m-breakdown','.fiqh-m-case','.fiqh-m-takeaway'])
                assert.equal(await page.locator(selector).count(),20,'Lecture fiche 15 incomplète : '+selector);
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(0).innerText(),/ريئت على فيه/,'Khalîl absent');
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(8).innerText(),/بري ذو نفس سائلة/,'Condition de l’animal absent');
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(9).innerText(),/شذوذ لا وجه له/,'Avis d’Ibn Rushd absent');
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(15).innerText(),/وهذا هو المشهور/,'Mashhûr absent');
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(19).innerText(),/تسعة وأربعين/,'Parole d’Ibn al-Mâjishûn absente');
            for(const pg of [114,115,116,117])assert.ok(await page.locator('a[href*="/4471/'+pg+'"]').count()>=1,'Source de la fiche 15 absente : '+pg);
        }
        if(check.number==='14'){
            assert.equal(await page.locator('.fiqh-m-goals li').count(),19,'19 objectifs');
            assert.equal(await page.locator('.fiqh-m-passage').count(),19,'19 citations');
            assert.equal(await page.locator('.fiqh-m-passage-translation').count(),19,'19 traductions');
            assert.equal(await page.locator('.fiqh-m-passage-link').count(),19,'19 références');
            assert.equal(await page.locator('.fiqh-m-breakdown').count(),19,'19 décompositions');
            assert.equal(await page.locator('.fiqh-m-case').count(),19,'19 exemples');
            assert.equal(await page.locator('.fiqh-m-takeaway').count(),19,'19 conclusions');
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(0).innerText(),/الماء المسخن بالنجاسة/,'Chauffage absent');
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(1).innerText(),/وأنا أفعله كثيرا/,'Mâlik absent');
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(4).innerText(),/لم يطلب من عباده المشاق/,'Ibn al-Imâm absent');
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(7).innerText(),/دخول الحمام/,'Hammam absent');
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(14).innerText(),/عشرة شروط/,'Ibn Shâs absent');
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(15).innerText(),/منها واجب ومنها مندوب/,'Adab absent');
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(18).innerText(),/حديث ضعيف/,'Hadith critique absent');
            for(const pg of [112,113,114]) assert.ok(await page.locator('a[href*="/4471/'+pg+'"]').count()>=1,'Page absente : '+pg);
        }
        if(check.number==='13'){
            assert.equal(await page.locator('.fiqh-m-goals li').count(),15,'Quinze objectifs attendus dans la fiche 13');
            assert.equal(await page.locator('.fiqh-m-passage').count(),15,'Quinze extraits arabes attendus');
            assert.equal(await page.locator('.fiqh-m-passage-translation').count(),15,'Quinze traductions attendues');
            assert.equal(await page.locator('.fiqh-m-passage-link').count(),15,'Quinze liens vers les sources attendus');
            assert.equal(await page.locator('.fiqh-m-breakdown').count(),15,'Quinze explications décomposées attendues');
            assert.equal(await page.locator('.fiqh-m-case').count(),15,'Quinze exemples pédagogiques attendus');
            assert.equal(await page.locator('.fiqh-m-takeaway').count(),15,'Quinze synthèses attendues');
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(0).innerText(),/كمشمس/,'Formule de Khalîl absente');
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(1).innerText(),/والمشمس كغيره/,'Avis d’Ibn al-Hâjib absent');
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(3).innerText(),/لم يصح فيه حديث/,'Critique du hadith absente');
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(9).innerText(),/القول بكراهة المشمس قوي/,'Préférence d’al-Hattâb absente');
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(11).innerText(),/إن توضأ به أجزأه/,'Précision sur la validité absente');
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(12).innerText(),/كراهة إرشاد/,'Nuance d’Ibn Farhûn absente');
            assert.ok(await page.locator('a[href*="/19/120/"]').count()>=1,'Source originale du passage absente');
        }
        if(check.number==='12'){
            assert.equal(await page.locator('.fiqh-m-goals li').count(),14,'Quatorze objectifs attendus dans la fiche 12');
            assert.equal(await page.locator('.fiqh-m-passage').count(),14,'Quatorze citations arabes attendues en fiche 12');
            assert.equal(await page.locator('.fiqh-m-passage-translation').count(),14,'Quatorze traductions attendues en fiche 12');
            assert.equal(await page.locator('.fiqh-m-passage-link').count(),14,'Quatorze liens vers les sources attendus en fiche 12');
            assert.equal(await page.locator('.fiqh-m-breakdown').count(),14,'Quatorze décompositions attendues en fiche 12');
            assert.equal(await page.locator('.fiqh-m-case').count(),14,'Quatorze exemples pédagogiques attendus en fiche 12');
            assert.equal(await page.locator('.fiqh-m-takeaway').count(),14,'Quatorze synthèses attendues en fiche 12');
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(0).innerText(),/وسؤر شارب خمر/,'Formule de Khalîl absente');
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(2).innerText(),/ابن الحاجب/,'Transmission des avis absente');
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(4).innerText(),/صاحب البيان/,'Nuance du Bayân absente');
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(6).innerText(),/الهرة ليست بنجس/,'Hadith du chat absent');
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(10).innerText(),/ثلاثة أقوال/,'Présentation des trois avis absente');
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(11).innerText(),/واختاره ابن رشد/,'Choix d’Ibn Rushd absent');
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(13).innerText(),/والسرف فيه/,'Discussion de l’excès absente');
            assert.ok(await page.locator('a[href*="/19/117/"]').count()>=1,'Lien à la page 77 absent');
            assert.ok(await page.locator('a[href*="/19/118/"]').count()>=1,'Lien à la page 78 absent');
        }
        if(check.number==='11'){
            assert.equal(await page.locator('.fiqh-m-goals li').count(),11,'Onze objectifs attendus dans la fiche 11');
            assert.equal(await page.locator('.fiqh-m-passage').count(),11,'Onze citations arabes attendues');
            assert.equal(await page.locator('.fiqh-m-passage-translation').count(),11,'Onze traductions attendues');
            assert.equal(await page.locator('.fiqh-m-passage-link').count(),11,'Onze liens vers les sources attendus');
            assert.equal(await page.locator('.fiqh-m-breakdown').count(),11,'Onze explications décomposées attendues');
            assert.equal(await page.locator('.fiqh-m-case').count(),11,'Onze exemples pédagogiques attendus');
            assert.equal(await page.locator('.fiqh-m-takeaway').count(),11,'Onze synthèses attendues');
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(1).innerText(),/يحتال حتى يغسل يديه/,'Parole de Mâlik absente');
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(3).innerText(),/فإن اغتسل فيها أجزأه/,'Avis d’Ibn al-Qâsim absent');
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(6).innerText(),/ينبغي أن يتلطف/,'Précision de Sanad absente');
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(9).innerText(),/وحكم الجنابة باق/,'Analyse de la janâba non levée absente');
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(10).innerText(),/وإن لم يتغير فغسله يجزيه/,'Analyse de l’eau inchangée absente');
            assert.ok(await page.locator('a[href*="/19/115/"]').count()>=1,'Source sur le puits absente');
            assert.ok(await page.locator('a[href*="/19/116/"]').count()>=1,'Source sur le bassin absente');
        }
        if(check.number==='10'){
            assert.equal(await page.locator('.fiqh-m-goals li').count(),9,'Neuf objectifs attendus en fiche 10');
            assert.equal(await page.locator('.fiqh-m-passage').count(),9,'Neuf extraits arabes attendus');
            assert.equal(await page.locator('.fiqh-m-passage-translation').count(),9,'Neuf traductions attendues');
            assert.equal(await page.locator('.fiqh-m-passage-link').count(),9,'Neuf liens vers les sources attendus');
            assert.equal(await page.locator('.fiqh-m-breakdown').count(),9,'Neuf analyses progressives attendues');
            assert.equal(await page.locator('.fiqh-m-case').count(),9,'Neuf exemples pédagogiques attendus');
            assert.equal(await page.locator('.fiqh-m-takeaway').count(),9,'Neuf synthèses attendues');
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(0).innerText(),/البرك المعدة للوضوء/,'Contexte arabe absent');
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(3).innerText(),/وإن لم يتغير/,'Distinction de réprobation absente');
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(6).innerText(),/وإن تحقق/,'Cas des souillures établies absent');
            assert.match(await page.locator('.fiqh-m-passage blockquote').nth(8).innerText(),/يجدّد|يجدد/,'Renouvellement de l’eau absent');
        }
        assert.match(await page.locator('.fiqh-m-quote blockquote').innerText(),check.quote,'Citation arabe absente '+check.number);
        assert.ok(await page.locator('a[href*="'+check.source+'"]').count()>=1,'Source de référence absente '+check.number);
        assert.equal(await page.locator('.fiqh-m-complete').getAttribute('aria-pressed'),'false','Fiche marquée comme lue à tort '+check.number);
        await page.locator('.fiqh-m-tabs button').filter({hasText:'Lexique'}).click();
        assert.equal(await page.locator('.fiqh-m-term').count(),check.terms||6,'Lexique incomplet pour '+check.number);
        await page.locator('.fiqh-m-search input').fill(check.search);
        assert.equal(await page.locator('.fiqh-m-term').count(),1,'Recherche de lexique inactive '+check.number);
        await page.locator('.fiqh-m-tabs button').filter({hasText:'Se vérifier'}).click();
        assert.equal(await page.locator('.fiqh-m-question').count(),check.questions||3,'Quiz incomplet pour '+check.number);
        assert.equal(await page.locator('.fiqh-m-answer').count(),0,'Quiz non réinitialisé '+check.number);
        await page.locator('.fiqh-m-choices button').first().click();
        assert.equal(await page.locator('.fiqh-m-answer').count(),1,'Correction du QCM manquante '+check.number);
        await page.locator('.fiqh-m-tabs button').filter({hasText:'Lire la fiche'}).click();
        await page.locator('.fiqh-m-complete').click();
        assert.equal(await page.locator('.fiqh-m-complete').getAttribute('aria-pressed'),'true');
        assert.equal(await page.evaluate(key=>localStorage.getItem(key),check.key),'1','Suivi non enregistré '+check.number);
    }
    assert.match(await page.locator('.fiqh-m-aside-progress').innerText(),/14\s*\/\s*14/,'Progression des quinze fiches incorrecte');
    await page.locator('.fiqh-m-lesson-link').first().click();
    assert.equal(await page.locator('.fiqh-m-complete').getAttribute('aria-pressed'),'true','Lecture historique de la fiche 01 perdue');
    await page.locator('.fiqh-m-lesson-link').nth(2).click();
    assert.equal(await page.locator('.fiqh-m-complete').getAttribute('aria-pressed'),'true','Lecture historique de la fiche 03 perdue');

    await page.locator('.fiqh-m-back').click();
    await page.locator('.fiqh-m-index').waitFor({state:'visible'});
    assert.equal(await page.locator('.fiqh-m-catalog-card').count(),15,'Retour au sommaire impossible');
    assert.match(await page.locator('.fiqh-m-index-progress').innerText(),/15 fiches lues sur 15/,'Progression du sommaire incorrecte');
    await page.locator('.fiqh-m-index-resume').click();
    assert.match(await page.locator('#fiqh-m-heading').innerText(),/eaux naturelles/i,'Reprendre la dernière fiche ne fonctionne pas');
    await page.locator('.fiqh-m-back').click();
    await page.locator('.fiqh-m-index-back').click();
    await ready(page);

    // UX : l'accès aux histoires doit être immédiat, lisible et léger.
    await navigate(page, 'library');
    await page.locator('.library-pro-selection').waitFor({state:'visible'});
    assert.match(await page.locator('.library-pro-selection-intro h1').innerText(),/Choisir une histoire/i);
    const firstBatch = page.locator('.library-pro-selection-results .library-pro-card');
    assert.equal(await firstBatch.count(),18,'La page de sélection doit afficher 18 cartes au départ');
    assert.equal(await page.locator('.library-pro-card-metrics').count(),0,'Les quatre blocs de statistiques ne doivent plus encombrer les cartes');
    // Numéros de fiches : tranches réelles, tri numérique et recherche exacte.
    const displayedNumbers=async()=>await page.locator('.library-pro-card-index').allInnerTexts();
    const numbers=await displayedNumbers();
    const ids=numbers.map(value=>Number(value.replace(/\D/g,'')));
    assert.ok(ids.length===18 && ids.every((id,index)=>index===0||id>=ids[index-1]),'Le catalogue doit commencer par la numérotation croissante : '+JSON.stringify(numbers));
    const numericNav=page.locator('.library-pro-number-nav');
    assert.ok(await numericNav.locator('button').count()>=7,'Les tranches de numéros doivent être accessibles');
    await numericNav.locator('button').nth(2).click();
    const rangeIds=(await displayedNumbers()).map(value=>Number(value.replace(/\D/g,'')));
    assert.ok(rangeIds.length>0&&rangeIds.every(id=>id>=21&&id<=40),'La tranche 21 à 40 est erronée : '+JSON.stringify(rangeIds));
    await page.locator('#library-sort').selectOption('number-desc');
    const descending=(await displayedNumbers()).map(value=>Number(value.replace(/\D/g,'')));
    assert.ok(descending.every((id,index)=>index===0||id<=descending[index-1]),'Le tri numérique décroissant ne fonctionne pas');
    await page.locator('#library-sort').selectOption('number-asc');
    await numericNav.locator('button').first().click();
    await page.locator('.library-pro-selection-search input').fill('37');
    assert.equal(await firstBatch.count(),1,'La recherche du numéro 37 doit retourner une seule fiche');
    assert.match(await firstBatch.first().locator('.library-pro-card-index').innerText(),/37/);
    await page.locator('.library-pro-selection-search input').fill('');
    await numericNav.locator('button').last().click();
    assert.ok(await firstBatch.count()>0,'Les notices au-delà de 200 doivent rester accessibles');
    await numericNav.locator('button').first().click();
    assert.equal(await firstBatch.count(),18,'La liste complète doit être rétablie');
    const geometry=await page.evaluate(()=>{
        const root=document.querySelector('.library-pro-selection');
        const cards=[...root.querySelectorAll('.library-pro-card')];
        const ranges=[...root.querySelectorAll('.library-pro-number-nav button')];
        return {
            count:cards.length,top:cards[0]?.getBoundingClientRect().top,
            clipped:ranges.filter(el=>{const b=el.getBoundingClientRect();return b.left<-2||b.right>innerWidth+2||el.scrollWidth>el.clientWidth+3}).map(el=>el.textContent.trim()),
            titleClipped:cards.some(card=>{const el=card.querySelector('h2');return el.scrollHeight>el.clientHeight+2 || el.scrollWidth>el.clientWidth+2}),
            scroll:root.scrollWidth-root.clientWidth
        };
    });
    assert.deepEqual(geometry.clipped,[],'Tranches numériques coupées sur PC');
    assert.ok(!geometry.titleClipped,'Un nom de personnage est tronqué');
    assert.ok(geometry.scroll<=3,'Le catalogue déborde horizontalement');

    await page.locator('.library-pro-quick-categories button').filter({hasText:'Badr'}).click();
    assert.ok(await firstBatch.count()>0,'Le thème Badr doit conserver des résultats');
    assert.ok(await page.locator('.library-pro-active-filters').isVisible(),'Les filtres sélectionnés doivent être visibles');
    await page.locator('.library-pro-active-filters button').click();
    assert.equal(await firstBatch.count(),18,'La réinitialisation doit rétablir le premier lot');
    await page.getByRole('button',{name:"Afficher plus d'histoires"}).click();
    assert.equal(await firstBatch.count(),36,'Le chargement progressif doit exposer 36 cartes');
    await page.locator('.library-pro-selection-search input').fill('Khoubayb');
    assert.ok((await firstBatch.count())>=1,'La recherche en direct ne retourne pas Khoubayb');
    assert.ok((await firstBatch.count())<18,'La recherche doit réduire le nombre de cartes');
    await firstBatch.first().locator('.library-pro-card-top button').click();
    assert.ok(await page.locator('.library-pro-selection').isVisible(),'Un favori ne doit pas ouvrir la notice par accident');
    await page.getByRole('button',{name:'Affichage en liste'}).click();
    assert.ok(await page.locator('.library-pro-results.is-list').isVisible(),'La liste compacte doit être disponible');
    await page.getByRole('button',{name:'Effacer la recherche'}).click();
    assert.equal(await firstBatch.count(),18,'Après recherche, le nombre de cartes doit se réinitialiser');
    await home(page);

    // Lecture-first : les analyses d'isnâd n'interrompent pas le récit d'Ibn Rawâha.
    await navigate(page, 'library');
    await page.locator('.library-pro-selection').waitFor({state:'visible'});
    await page.locator('.library-pro-selection-search input').fill('Abd-Allah ibn Rawaha');
    await page.locator('.library-pro-card').filter({hasText:'Abd-Allah ibn Rawaha'}).first().click();
    await page.getByRole('tab',{name:'Récit',exact:true}).click();
    const rawahaButton=page.locator('button[aria-expanded]').filter({hasText:'Venez, croyons un instant'}).first();
    await rawahaButton.click();
    const rawahaStory=rawahaButton.locator('..');
    const rawahaText=await rawahaStory.locator('.prose').innerText();
    assert.match(rawahaText,/inviter ses compagnons/i,'L’histoire d’Ibn Rawâha doit rester lisible');
    assert.ok(!/Al-Haythamî|Al-Arna.ût|hasan|faible|Siyar/.test(rawahaText),'Une analyse technique demeure dans le récit');
    const contextualNotes=rawahaStory.locator('details.athar-story-context');
    assert.equal(await contextualNotes.getAttribute('open'),null,'Le commentaire critique doit être fermé par défaut');
    assert.equal(await contextualNotes.locator('.athar-story-context-body').isVisible(),false,'La critique documentaire doit être secondaire');
    await contextualNotes.locator('summary').click();
    assert.equal(await contextualNotes.locator('.athar-story-context-body').isVisible(),true,'Les précisions doivent s’ouvrir au choix du lecteur');
    assert.match(await contextualNotes.innerText(),/Al-Haythamî/,'Le classement d’Al-Haythamî ne doit pas être perdu');
    assert.match(await contextualNotes.innerText(),/Arna.ût/i,'L’avis divergent ne doit pas être perdu');
    assert.ok(await contextualNotes.locator('a[href^="https://"]').count()>=1,'Référence externe introuvable sous le récit');
    await page.locator('#athar-immersive-quick').click();
    await page.locator('.library-pro-root').waitFor({state:'visible'});
    // Reprise fonctionnelle, mais compacte et placée après les filtres.
    const compactResume = page.locator('.library-pro-resume-inline');
    await compactResume.waitFor({state:'visible'});
    assert.match(await compactResume.innerText(),/Abd-Allah ibn Rawaha/i,'Dernière biographie absente de la reprise');
    assert.equal(await page.locator('.library-pro-selection-intro .library-pro-revisit').count(),0,'La grande carte de reprise ne doit plus occuper l’en-tête');
    const resumeHeight = await compactResume.boundingBox();
    assert.ok(resumeHeight && resumeHeight.height<75,'La reprise de lecture n’est pas compacte');
    await compactResume.locator('button').click();
    await page.getByRole('tab',{name:'Récit',exact:true}).waitFor({state:'visible'});
    await page.locator('#athar-immersive-quick').click();
    await page.locator('.library-pro-root').waitFor({state:'visible'});
    await home(page);

    // Frise refondue : un seul fil, périodes accessibles et fiches lisibles.
    await navigate(page,'timeline');
    await page.locator('.timeline-pro-event-card').first().waitFor({state:'visible'});
    assert.equal(await page.locator('.timeline-pro-modes,.timeline-pro-period-rail').count(),0,'Les anciennes interfaces de navigation n’ont pas été retirées');
    assert.ok(await page.locator('.timeline-pro-periods button').count()>=7,'Les périodes historiques ne sont pas accessibles');
    assert.equal(await page.locator('.timeline-pro-paths').getAttribute('open'),null,'Les parcours facultatifs doivent être repliés');
    const timelineGeometry=await page.evaluate(()=>{
        const root=document.querySelector('.timeline-pro');
        const cards=[...root.querySelectorAll('.timeline-pro-event-card')];
        const choices=[...root.querySelectorAll('.timeline-pro-periods button')];
        const rect=el=>el.getBoundingClientRect();
        return {
            overflow:root.scrollWidth-root.clientWidth,
            clipped:choices.filter(el=>rect(el).left<-2||rect(el).right>innerWidth+2||el.scrollWidth>el.clientWidth+3).map(el=>el.textContent.trim()),
            firstCardY:rect(cards[0]).top,
            cards:cards.length,
            heading:root.querySelector('.timeline-pro-hero h1').innerText
        };
    });
    assert.equal(timelineGeometry.overflow<=3,true,'La frise déborde : '+JSON.stringify(timelineGeometry));
    assert.deepEqual(timelineGeometry.clipped,[],'Un choix de période est tronqué');
    assert.ok(timelineGeometry.firstCardY<1150,'Trop d’interface avant les premiers récits');
    assert.match(timelineGeometry.heading,/l’histoire/i);
    await page.locator('.timeline-pro-periods button').nth(1).click();
    assert.equal(await page.locator('.timeline-pro-period').count(),1,'Filtrer une période doit masquer les autres');
    assert.ok(await page.locator('.timeline-pro-event-card').count()<=7,'Les premiers événements doivent être paginés');
    await page.locator('.timeline-pro-event-card').first().click();
    await page.locator('.timeline-pro-drawer').waitFor({state:'visible'});
    assert.equal(await page.locator('.timeline-pro-reading-method').getAttribute('open'),null,'Sources et fiabilité doivent rester au second plan');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.timeline-pro-drawer').count(),0,'La touche Échap doit fermer le récit');
    await page.locator('.timeline-pro-periods button').first().click();
    await page.locator('.timeline-pro-paths > summary').click();
    assert.ok(await page.locator('.timeline-pro-path-list button').count()>=3,'Parcours suggérés indisponibles');
    await page.locator('.timeline-pro-path-list button').first().click();
    assert.ok(await page.locator('.timeline-pro-active-path').isVisible(),'Le parcours choisi doit être visible');
    await page.getByRole('button',{name:'Quitter le parcours'}).click();
    await page.locator('.timeline-pro-paths > summary').click();
    await page.locator('.timeline-pro-search input').fill('Oumama');
    assert.ok(await page.locator('.timeline-pro-event-card').count()>0,'La recherche historique échoue');
    assert.equal(await page.locator('.timeline-pro-period').count(),1,'La recherche ne devrait montrer que les périodes concernées');
    await page.locator('.timeline-pro-search input').fill('');
    await home(page);

    // Régression historique : le port d’Oumâma pendant la prière n'est pas daté « ≈ 612 ».
    await navigate(page, 'timeline');
    await page.locator('.timeline-pro-search input').fill('Oumama');
    await page.locator('.timeline-pro-event-card').filter({hasText:'Oumama'}).first().click();
    const historical=page.locator('.timeline-pro-drawer');
    await historical.waitFor({state:'visible'});
    assert.match(await historical.locator('header').innerText(),/Date à préciser/i,'Oumâma classée dans une fausse période historique');
    assert.ok(await historical.locator('a[href="https://sunnah.com/bukhari:516"]').count() === 1,'Source Bukhârî 516 absente');
    assert.ok(!/612/.test(await historical.innerText()),'Année inventée toujours visible pour Oumâma');
    await historical.locator('header button').click();
    await home(page);

    await navigate(page, 'library');
    await page.locator('.library-pro-root').waitFor({state:'visible',timeout:20000});
    await page.locator('.library-pro-search-hero input').fill('Abou Oubayda');
    await page.locator('.library-pro-card').filter({hasText:'Abou Oubayda'}).first().click();
    await page.getByRole('tab',{name:'Sources',exact:true}).click();
    const sources=page.locator('.athar-siyar-sources');
    assert.equal(await sources.isVisible(),true,'Les références Siyar doivent rester lisibles.');
    assert.equal(await sources.locator('a[href="https://siyar.fr/livre/1/11"]').count(),1);
    assert.equal(await sources.locator('article').filter({hasText:'Le jeûne est une protection'}).count(),1,'Isnâd du jeûne absent du registre');
    await page.getByRole('tab',{name:'Chronologie',exact:true}).click();
    const chronologyNotes=page.locator('.max-w-2xl.mx-auto.py-8 details.athar-story-context').first();
    assert.equal(await chronologyNotes.getAttribute('open'),null,'La critique des chronologies doit être repliée');
    await chronologyNotes.locator('summary').click();
    assert.ok(await chronologyNotes.locator('a[href="https://siyar.fr/livre/1/11"]').count()>=1,'Lien vers la notice chronologique absent');
    await page.getByRole('tab',{name:'Citations',exact:true}).click();
    const quotes=page.locator('article').filter({hasText:'Chaque communauté a un digne de confiance'});
    assert.ok(await quotes.count()>=1,'Le texte de la citation principale doit rester accessible');
    const citationNotes=quotes.first().locator('details.athar-story-context');
    assert.equal(await citationNotes.getAttribute('open'),null,'La fiabilité ne doit pas s’afficher par défaut sous la citation');
    assert.equal(await citationNotes.locator('.athar-story-context-body').isVisible(),false,'L’analyse de citation doit rester au second plan');
    await citationNotes.locator('summary').click();
    assert.match(await citationNotes.innerText(),/Al-Bukhârî 3744/,'La référence doit figurer dans le volet secondaire');
    assert.ok(await citationNotes.getByText('Chaîne documentée').count()>=1,'Chaîne documentée absente');
    assert.ok(await citationNotes.locator('a[href="https://sunnah.com/bukhari:3744"]').count()===1,'Lien vers source primaire absent');
    assert.match(await page.locator('#athar-immersive-quick').getAttribute('aria-label'),/Retour à Bibliothèque/);
    await page.locator('#athar-immersive-quick').click();
    await page.locator('.library-pro-root').waitFor({state:'visible'});
    // Les nouvelles sources doivent être visibles dans les notices sans héberger le PDF.
    for (const [needle,link] of [
        ['Saïd ibn Zayd','https://siyar.fr/livre/1/126'],
        ['Salim Mawla','https://siyar.fr/livre/1/169'],
        ['Hamza Ibn Abdelmoutalib','https://siyar.fr/livre/1/175'],
        ["'Aqil ibn Al-Boukayr",'https://siyar.fr/livre/1/186'],
        ['Jafar ibn Abou Talib','https://siyar.fr/livre/1/207'],
        ['Saad ibn Oubada','https://siyar.fr/livre/1/274'],
        ['Abou Zayd Al-Ansari','https://siyar.fr/livre/1/342'],
        ['Bilal ibn Rabah','https://siyar.fr/livre/1/354'],
        ['Ibnou Oum Maktoum','https://siyar.fr/livre/1/367'],
        ['Oubay ibn Kaab','https://siyar.fr/livre/1/397'],
        ['Salmane Al-Farissi','https://siyar.fr/livre/1/524'],
        ["'Oubada ibn As-Samit",'https://siyar.fr/livre/2/1'],
        ['Hatib ibn Abou Baltaa','https://siyar.fr/livre/2/40']
    ]) {
        await page.locator('.library-pro-search-hero input').fill(needle);
        await page.locator('.library-pro-card').filter({hasText:needle}).first().click();
        await page.getByRole('tab',{name:'Sources',exact:true}).click();
        const bibliography=page.locator('.athar-siyar-sources');
        assert.equal(await bibliography.isVisible(),true,'Sources absentes pour '+needle);
        assert.ok(await bibliography.locator('a[href="'+link+'"]').count()>=1,'URL bibliographique absente pour '+needle);
        assert.equal(await bibliography.locator('a[href$=".pdf"]').count(),0,'Ne pas héberger de PDF pour '+needle);
        await page.locator('#athar-immersive-quick').click();
        await page.locator('.library-pro-root').waitFor({state:'visible'});
    }
    await home(page);

    // Biographie 12 : références externes réelles, sans page Siyar inventée.
    await navigate(page, 'library');
    await page.locator('.library-pro-root').waitFor({state:'visible'});
    await page.locator('.library-pro-search-hero input').fill('Abd-Allah ibn Jahche');
    await page.locator('.library-pro-card').filter({hasText:'Abd-Allah ibn Jahche'}).first().click();
    await page.getByRole('tab',{name:'Sources',exact:true}).click();
    const externalSource = page.locator('.athar-siyar-sources');
    assert.match(await externalSource.innerText(), /sources externes/i,'La fiche 12 doit déclarer ses sources externes');
    assert.ok(await externalSource.locator('a[href="https://dorar.net/history/event/54"]').count()>=1,'Le dossier historique d’Abd-Allah doit être accessible');
    assert.ok(!/Fascicule sources externes, p\. null/.test(await externalSource.innerText()),'Page bibliographique inventée pour la fiche 12');
    await page.getByRole('tab',{name:'Quiz',exact:true}).click();
    assert.ok(await page.locator('div.max-w-2xl.mx-auto.space-y-10 > div.bg-white').count() >= 5, 'Cinq questions attendues dans la fiche 12');
    await page.locator('#athar-immersive-quick').click();
    await page.locator('.library-pro-root').waitFor({state:'visible'});
    await home(page);

    // Quatrième vague : ne pas confondre commentaire d'historien et parole prophétique.
    await navigate(page, 'library');
    await page.locator('.library-pro-root').waitFor({state:'visible'});
    await page.locator('.library-pro-search-hero input').fill('Mistah ibn Outhatha');
    await page.locator('.library-pro-card').filter({hasText:'Mistah ibn Outhatha'}).first().click();
    await page.getByRole('tab',{name:'Citations',exact:true}).click();
    assert.ok(await page.getByText('Commentaire d’un savant',{exact:true}).count()>=1,'Commentaire d’adh-Dhahabî identifié comme hadith');
    await page.getByRole('tab',{name:'Sources',exact:true}).click();
    const mistahRefs=page.locator('.athar-siyar-sources');
    assert.ok(await mistahRefs.locator('a[href="https://sunnah.com/bukhari:4750"]').count()>=1,'Récit de l’Ifk absent de Mistah');
    assert.ok((await mistahRefs.innerText()).includes('versions 4, 5 et 6 H'), 'Réserve et variantes chronologiques sur l’Ifk absentes');
    await page.getByRole('tab',{name:'Quiz',exact:true}).click();
    assert.ok(await page.locator('div.max-w-2xl.mx-auto.space-y-10 > div.bg-white').count() >= 6,'Six questions attendues pour Mistah');
    await page.locator('#athar-immersive-quick').click();
    await page.locator('.library-pro-root').waitFor({state:'visible'});
    await home(page);

    // Vague 21–30 : recoupement hadith de Al-Barâ et statut d'un tâbi‘î.
    await navigate(page, 'library');
    await page.locator('.library-pro-root').waitFor({state:'visible'});
    await page.locator('.library-pro-search-hero input').fill('Al-Bara ibn Malik');
    await page.locator('.library-pro-card').filter({hasText:'Al-Bara ibn Malik'}).first().click();
    await page.getByRole('tab',{name:'Sources',exact:true}).click();
    const baraSources=page.locator('.athar-siyar-sources');
    assert.ok(await baraSources.locator('a[href="https://sunnah.com/tirmidhi:3854"]').count()>=1,'Source At-Tirmidhî 3854 absente');
    assert.match(await baraSources.innerText(),/hasan gharîb/i,'Jugement d’At-Tirmidhî absent');
    await page.getByRole('tab',{name:'Quiz',exact:true}).click();
    assert.ok(await page.locator('div.max-w-2xl.mx-auto.space-y-10 > div.bg-white').count()>=5,'Cinq questions attendues pour Al-Barâ');
    await page.locator('#athar-immersive-quick').click();
    await page.locator('.library-pro-root').waitFor({state:'visible'});
    await page.locator('.library-pro-search-hero input').fill('Abd-Allah ibn Abd-Allah');
    await page.locator('.library-pro-card').filter({hasText:'Transmetteur de la Génération Suivante'}).first().click();
    await page.getByRole('tab',{name:'Citations',exact:true}).click();
    assert.ok(await page.getByText('Commentaire d’un savant',{exact:true}).count()>=1,'Avis d’Ibn Sa‘d confondu avec un hadith');
    await page.getByRole('tab',{name:'Sources',exact:true}).click();
    assert.ok(await page.locator('.athar-siyar-sources a[href="https://siyar.fr/livre/1/203"]').count()>=1,'Référence de la notice 30 absente');
    await page.locator('#athar-immersive-quick').click();
    await page.locator('.library-pro-root').waitFor({state:'visible'});
    await home(page);

    // Vague 31–40 : récit sourcé, sept questions, verset distingué des hadiths.
    await navigate(page, 'library');
    await page.locator('.library-pro-root').waitFor({state:'visible'});
    await page.locator('.library-pro-search-hero input').fill('Jafar ibn Abou Talib');
    await page.locator('.library-pro-card').filter({hasText:'Jafar ibn Abou Talib'}).first().click();
    await page.getByRole('tab',{name:'Sources',exact:true}).click();
    const jaafarSource=page.locator('.athar-siyar-sources');
    assert.ok(await jaafarSource.locator('a[href="https://sunnah.com/bukhari:4251"]').count()>0,'Ressemblance de Ja‘far : Bukhârî 4251 manquant');
    assert.ok(await jaafarSource.locator('a[href="https://sunnah.com/bukhari:4261"]').count()>0,'Mou’ta : Bukhârî 4261 manquant');
    await page.getByRole('tab',{name:'Quiz',exact:true}).click();
    assert.ok(await page.locator('div.max-w-2xl.mx-auto.space-y-10 > div.bg-white').count()>=7,'Sept questions documentaires attendues pour Ja‘far');
    await page.locator('#athar-immersive-quick').click();
    await page.locator('.library-pro-root').waitFor({state:'visible'});
    await page.locator('.library-pro-search-hero input').fill('Zayd ibn Haritha');
    await page.locator('.library-pro-card').filter({hasText:'Zayd ibn Haritha'}).first().click();
    await page.getByRole('tab',{name:'Citations',exact:true}).click();
    assert.ok(await page.getByText('Verset coranique',{exact:true}).count()>0,'Coran 33:37 ne doit pas être affiché comme un hadith');
    await page.getByRole('tab',{name:'Sources',exact:true}).click();
    assert.ok(await page.locator('.athar-siyar-sources a[href="https://quran.com/33/37"]').count()>0,'Verset 33:37 sans lien documentaire');
    await page.locator('#athar-immersive-quick').click();
    await page.locator('.library-pro-root').waitFor({state:'visible'});
    await home(page);

    // Tome 2 : les neuf nouvelles notices sont accessibles depuis la Bibliothèque
    // avec récits complets, questions de compréhension et références repliables.
    await navigate(page, 'library');
    await page.locator('.library-pro-root').waitFor({state:'visible',timeout:20000});
    for (const [query,expected] of [
      ['Abou Dharr','Abou Dharr'],
      ['Al-Hakam','Al-Hakam'],
      ['Khosro','Yazdgard III'],
      ['Khadîja','Khadîja'],
      ['Fâtima az-Zahrâ','Fâtima az-Zahrâ']
    ]) {
        await page.locator('.library-pro-search-hero input').fill(query);
        const card = page.locator('.library-pro-card').filter({hasText:expected}).first();
        await card.waitFor({state:'visible'});
        await card.click();
        await page.getByRole('tab',{name:'Récit',exact:true}).click();
        assert.ok(await page.locator('button[aria-expanded]').count()>=4,'Récits incomplets : '+expected);
        await page.getByRole('tab',{name:'Citations',exact:true}).click();
        const cited = page.locator('article details.athar-story-context').first();
        assert.equal(await cited.getAttribute('open'),null,'Les références doivent être repliées : '+expected);
        await cited.locator('summary').click();
        assert.ok(await cited.locator('a[href^="https://"]').count()>=1,'Référence externe inaccessible : '+expected);
        await page.getByRole('tab',{name:'Sources',exact:true}).click();
        assert.ok(await page.locator('.athar-siyar-sources a[href^="https://siyar.fr/livre/2/"]').count()>=1,'Notice Siyar manquante : '+expected);
        await page.locator('#athar-immersive-quick').click();
        await page.locator('.library-pro-root').waitFor({state:'visible'});
    }
    await home(page);

    const previousTheme=await page.evaluate(()=>document.documentElement.classList.contains('dark'));
    await page.locator('#athar-immersive-theme').click();
    await page.waitForFunction(before => document.documentElement.classList.contains('dark') !== before,previousTheme,{timeout:5000});
    await page.locator('#athar-immersive-theme').click();
    await page.waitForFunction(before => document.documentElement.classList.contains('dark') === before,previousTheme,{timeout:5000});
    await page.keyboard.press('Control+Shift+f');
    assert.equal(await page.locator('#athar-fullscreen-toggle, #athar-fullscreen-exit').count(),0);
    assert.equal(await page.evaluate(()=>document.documentElement.classList.contains('athar-app-fullscreen')),true);

    assert.deepEqual(errors,[],'Erreurs JavaScript desktop : '+errors.join(' / '));
    await page.close();
}

async function mobile(width,height) {
    const page=await browser.newPage({viewport:{width,height},isMobile:true,hasTouch:true});
    const errors=collectErrors(page);
    await page.goto(base+'/index.html?ui=mobile-'+width,{waitUntil:'domcontentloaded',timeout:90000});
    await ready(page);
    assert.equal(await page.locator('#athar-mobile-dock').count(),0,'Le deuxième dock mobile doit disparaître.');
    // Régression zoom tactile : la hauteur de la page ne doit pas suivre le visualViewport
    // réduit par le pincement, et le lecteur doit rester déplaçable horizontalement.
    const zoomSession=await page.context().newCDPSession(page);
    await zoomSession.send('Emulation.setPageScaleFactor',{pageScaleFactor:2});
    await page.waitForFunction(()=>window.visualViewport?.scale>=1.9,null,{timeout:5000});
    await page.waitForFunction(()=>Math.abs(
        parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--athar-viewport-height'))-window.innerHeight
    )<=2,null,{timeout:5000});
    const zoomLayout=await page.evaluate(()=>{
        const layout=window.innerHeight;
        const app=document.getElementById('app');
        const outer=document.querySelector('.athar-global-mainframe > main');
        return {
            layout,visual:window.visualViewport.height,
            appHeight:app.getBoundingClientRect().height,
            variable:parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--athar-viewport-height')),
            scrollX:getComputedStyle(outer).overflowX,
            falseKeyboard:document.documentElement.classList.contains('athar-keyboard-open')
        };
    });
    assert.ok(zoomLayout.visual<zoomLayout.layout*.7,'La simulation de zoom tactile ne fonctionne pas : '+JSON.stringify(zoomLayout));
    assert.ok(Math.abs(zoomLayout.appHeight-zoomLayout.layout)<=3,'Une bande vide apparaît sous Athar lors du zoom : '+JSON.stringify(zoomLayout));
    assert.equal(zoomLayout.scrollX,'auto','Le mode immersif empêche le déplacement horizontal');
    assert.equal(zoomLayout.falseKeyboard,false,'Le zoom ne doit pas être confondu avec le clavier mobile');

    await page.evaluate(()=>{
        const outer=document.querySelector('.athar-global-mainframe > main');
        const probe=document.createElement('div');
        probe.id='athar-pan-test-probe';
        probe.style.cssText='width:160vw;height:140px;pointer-events:auto;';
        outer.prepend(probe);
        outer.scrollLeft=0;
        outer.scrollTop=0;
    });
    const panStartX=Math.min(170,Math.round(width/2)-20);
    await zoomSession.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:panStartX,y:135,id:0}]});
    for(const delta of [12,24,36,48,60,72,84,96]){
        await zoomSession.send('Input.dispatchTouchEvent',{
            type:'touchMove',touchPoints:[{x:panStartX-delta,y:135,id:0}]
        });
        await page.waitForTimeout(18);
    }
    await zoomSession.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    await page.waitForTimeout(80);
    const panX=await page.evaluate(()=>document.querySelector('.athar-global-mainframe > main').scrollLeft);
    assert.ok(panX>10,'Un balayage tactile ne déplace pas le lecteur horizontalement sous zoom : '+panX);
    await page.evaluate(()=>{
        document.getElementById('athar-pan-test-probe')?.remove();
        const outer=document.querySelector('.athar-global-mainframe > main');
        outer.scrollLeft=0;
        outer.scrollTop=0;
    });
    await zoomSession.send('Emulation.setPageScaleFactor',{pageScaleFactor:1});
    await page.waitForFunction(()=>window.visualViewport?.scale<=1.01,null,{timeout:5000});
    await zoomSession.detach();

    for(const id of ['athar-immersive-menu','athar-immersive-quick','athar-immersive-theme']){
        const rect=await page.locator('#'+id).boundingBox();
        assert.ok(rect && rect.width>=40 && rect.height>=40,'Bouton mobile trop petit : '+id);
    }
    const bar=await page.locator('#athar-immersive-current').boundingBox();
    assert.ok(bar && bar.x>45 && bar.x+bar.width<width-95,'Les boutons se chevauchent sur téléphone.');

    await page.locator('#athar-immersive-quick').click();
    const compact = page.locator('.tasbih-simple-layout');
    await compact.waitFor({state:'visible',timeout:20000});
    assert.equal(await page.locator('.tasbih-simple-choices').isVisible(), true);
    assert.equal(await page.locator('.tasbih-focus-card').count(), 1, 'Un seul compteur doit être mis en avant.');
    assert.equal(await page.locator('.tasbih-pro-header-actions').count(), 0, 'Les anciens boutons plein écran et fermeture doivent disparaître.');
    assert.equal(await page.locator('.tasbih-simple-more').getAttribute('open'), null, 'Les options doivent être repliées par défaut.');
    assert.ok((await page.locator('.tasbih-quick-choice').count()) >= 6, 'Les formules rapides doivent être visibles.');
    assert.equal(await page.locator('.tasbih-quick-choice[aria-pressed="true"]').count(), 1);
    const counter=page.locator('.tasbih-counter-button');
    await counter.waitFor({state:'visible',timeout:20000});
    const box=await counter.boundingBox();
    assert.ok(box && box.width<=width-20 && box.height>=180,'Le compteur Tasbih doit tenir dans le téléphone.');
    const before=Number((await page.locator('.tasbih-counter-inner strong').first().innerText()).replace(/\s/g,''));
    await counter.click();
    const after=Number((await page.locator('.tasbih-counter-inner strong').first().innerText()).replace(/\s/g,''));
    assert.equal(after,before+1,'Le compteur Tasbih ne réagit pas au toucher.');
    await page.locator('.tasbih-simple-actions button').filter({hasText:'Annuler le dernier'}).click();
    assert.equal(Number((await page.locator('.tasbih-counter-inner strong').innerText()).replace(/\s/g,'')), before, 'Annuler ne fonctionne pas.');
    await counter.click();
    await page.locator('.tasbih-quick-choice').filter({hasText:'Taḥmīd'}).click();
    const confirm = page.getByRole('alertdialog');
    await confirm.waitFor({state:'visible'});
    assert.match(await confirm.innerText(),/La séance en cours sera enregistrée/);
    await confirm.getByRole('button',{name:'Annuler'}).click();
    assert.equal(await page.locator('.tasbih-quick-choice[aria-pressed="true"]').count(),1);
    assert.match(await page.locator('.tasbih-quick-choice[aria-pressed="true"]').innerText(),/Tasbīḥ/);
    await page.locator('.tasbih-quick-choice').filter({hasText:'Taḥmīd'}).click();
    await confirm.getByRole('button',{name:'Enregistrer et changer'}).click();
    assert.match(await page.locator('.tasbih-quick-choice[aria-pressed="true"]').innerText(),/Taḥmīd/);
    const archived = await page.evaluate(()=>JSON.parse(localStorage.getItem('athar_tasbih_v2')||'{}'));
    assert.ok(archived.history?.length && archived.history[0].total>=1,'Le changement de formule doit conserver la séance.');
    await page.locator('.tasbih-simple-more > summary').click();
    assert.equal(await page.locator('.tasbih-simple-more').getAttribute('open'),'','Les options avancées ne s’ouvrent pas.');
    assert.equal(await page.locator('.tasbih-setting-row[aria-pressed]').count(),5);
    await page.locator('.tasbih-simple-more > summary').click();
    await counter.click();
    await page.locator('.tasbih-simple-actions button.primary').click();
    const saved = await page.evaluate(()=>JSON.parse(localStorage.getItem('athar_tasbih_v2')||'{}'));
    assert.ok(saved.history?.length>=2,'La séance terminée doit être enregistrée.');
    assert.equal(saved.sessionTotal,0,'La séance doit revenir à zéro après enregistrement.');
    await home(page);

    await navigate(page,'library');
    await page.locator('.library-pro-root').waitFor({state:'visible',timeout:20000});
    await page.locator('.library-pro-search-hero input').fill('Abou Oubayda');
    await page.locator('.library-pro-card').filter({hasText:'Abou Oubayda'}).first().click();
    const reader = page.getByRole('tab',{name:'Sources',exact:true});
    await reader.waitFor({state:'visible'});
    await reader.click();
    const sources=page.locator('.athar-siyar-sources');
    assert.equal(await sources.isVisible(),true,'Les sources doivent s’afficher sur téléphone.');
    const outerMain=main(page);
    // Les transitions et le défilement peuvent être animés selon le navigateur.
    // Forcer une lecture instantanée et attendre que le scroll soit stabilisé.
    await outerMain.evaluate(el=>{el.style.scrollBehavior='auto';el.scrollTop=el.scrollHeight});
    const metrics = await outerMain.evaluate(el=>({top:el.scrollTop,height:el.clientHeight,total:el.scrollHeight,overflow:getComputedStyle(el).overflowY}));
    assert.ok(metrics.total>metrics.height && metrics.top>0,'La lecture ne doit pas être bloquée sur téléphone : '+JSON.stringify(metrics));
    await page.locator('#athar-immersive-quick').click();
    await page.locator('.library-pro-root').waitFor({state:'visible'});
    await home(page);

    // Bibliothèque numérotée : aucune tranche ou carte coupée sur écran étroit.
    await navigate(page,'library');
    await page.locator('.library-pro-number-nav button').first().waitFor({state:'visible'});
    const libraryMobile = await page.evaluate(()=>{
        const root=document.querySelector('.library-pro-selection');
        const bounds=[...root.querySelectorAll('.library-pro-number-nav button,.library-pro-quick-categories button,.library-pro-card')];
        const clipped=bounds.filter(el=>{
            const r=el.getBoundingClientRect();
            return r.left<-2||r.right>innerWidth+2||el.scrollWidth>el.clientWidth+4;
        }).map(el=>({text:el.textContent.trim().slice(0,28),width:el.clientWidth,scroll:el.scrollWidth}));
        return {
            clipped,overflow:root.scrollWidth-root.clientWidth,
            textCut:[...root.querySelectorAll('.library-pro-card h2')].filter(el=>el.scrollHeight>el.clientHeight+2||el.scrollWidth>el.clientWidth+2).map(el=>el.textContent)
        };
    });
    assert.deepEqual(libraryMobile.clipped,[],'Cartes ou numéros tronqués à '+width+'px : '+JSON.stringify(libraryMobile));
    assert.deepEqual(libraryMobile.textCut,[],'Noms de biographies coupés à '+width+'px');
    assert.ok(libraryMobile.overflow<=3,'Le catalogue dépasse la largeur du smartphone');
    await page.locator('.library-pro-number-nav button').nth(1).click();
    assert.ok(await page.locator('.library-pro-card-index').count()>0,'Tranche de numéros inactive sur mobile');
    await home(page);

    // Les cinq pages de fiches doivent respecter la largeur du smartphone.
    for (const [view,rootSelector,cardSelector] of [
        ['library','.library-pro-root','.library-pro-selection .library-pro-card'],
        ['hadiths','.hadith-pro-root','.hadith-pro-card'],
        ['adhkar','.adhkar-pro-shell','.adhkar-pro-card'],
        ['glossary','.glossary-pro-root','.glossary-pro-card'],
        ['timeline','.timeline-pro','.timeline-pro-event-card']
    ]) {
        await navigate(page,view);
        await page.locator(rootSelector).waitFor({state:'visible'});
        const card=page.locator(cardSelector).first();
        await card.waitFor({state:'visible'});
        const rect=await card.boundingBox();
        assert.ok(rect && rect.width<=width-12,'Fiche trop large sur mobile : '+view+'/'+width);
        assert.ok(rect.x>=-3 && rect.x+rect.width<=width+3,'Débordement de carte sur mobile : '+view+'/'+width);
        await home(page);
    }

    // Frise responsive : événements, périodes et fenêtre de lecture sans débordement.
    await navigate(page,'timeline');
    await page.locator('.timeline-pro-event-card').first().waitFor({state:'visible'});
    const timelineMobile=await page.evaluate(()=>{
        const root=document.querySelector('.timeline-pro');
        const els=[...root.querySelectorAll('.timeline-pro-periods button,.timeline-pro-event-card,.timeline-pro-search')];
        return {overflow:root.scrollWidth-root.clientWidth,
            clipped:els.filter(el=>{
                const b=el.getBoundingClientRect();
                return b.left < -2 || b.right > innerWidth+2 || el.scrollWidth > el.clientWidth+4;
            }).map(el=>el.className+' '+el.textContent.trim().slice(0,35)),
            cardWidth:root.querySelector('.timeline-pro-event-card').getBoundingClientRect().width
        };
    });
    assert.ok(timelineMobile.overflow<=3,'Frise plus large que l’écran : '+width+'px '+JSON.stringify(timelineMobile));
    assert.deepEqual(timelineMobile.clipped,[],'Date, filtre ou événement rogné sur '+width+'px : '+JSON.stringify(timelineMobile));
    assert.ok(timelineMobile.cardWidth>width*.60,'Fiche trop étroite sur mobile : '+width);
    await page.locator('.timeline-pro-event-card').first().click();
    await page.locator('.timeline-pro-drawer').waitFor({state:'visible'});
    const panel=await page.locator('.timeline-pro-drawer').boundingBox();
    assert.ok(panel && panel.width<=width+2,'Lecteur de la frise plus large que l’écran');
    await page.locator('.timeline-pro-reading-method summary').click();
    assert.ok(await page.locator('.timeline-pro-reading-apparatus').isVisible(),'Les sources doivent être consultables sur mobile');
    await page.locator('.timeline-pro-drawer-close').click();
    await home(page);

    // Sous-sections Kutub as-Sitta aussi navigables sur smartphone.
    await navigate(page,'hadiths');
    await page.locator('.hadith-pro-root').waitFor({state:'visible'});
    await page.locator('.hadith-kutub-tabs button').nth(1).click();
    assert.equal(await page.locator('.hadith-kutub-book').count(),6,'Six recueils manquants sur téléphone');
    const bookWidth=await page.locator('.hadith-kutub-book').first().boundingBox();
    assert.ok(bookWidth && bookWidth.width<=width,'Carte de recueil trop large sur téléphone');
    await page.locator('.hadith-kutub-book').first().click();
    await page.locator('.bukhari-card').first().waitFor({state:'visible'});
    const mobileBook=await page.evaluate(()=>{
        const root=document.querySelector('.bukhari-book-view');
        const cards=[...root.querySelectorAll('.bukhari-card')];
        const buttons=[...root.querySelectorAll('.bukhari-book-switch button')];
        return {overflow:root.scrollWidth-root.clientWidth,
            columns:getComputedStyle(root.querySelector('.bukhari-card-grid')).gridTemplateColumns.split(' ').length,
            clipped:[...cards,...buttons].filter(el=>{
                const b=el.getBoundingClientRect();
                return b.left<-2||b.right>innerWidth+2||el.scrollWidth>el.clientWidth+4;
            }).map(el=>el.textContent.trim().slice(0,38)),
            titles:cards.filter(card=>{
                const el=card.querySelector('.bukhari-card-title');
                return el.scrollWidth>el.clientWidth+3||el.scrollHeight>el.clientHeight+3;
            }).map(card=>card.querySelector('.bukhari-card-title').innerText)};
    });
    assert.ok(mobileBook.overflow<=3 && !mobileBook.clipped.length,
        'Galerie Bukhârî coupée sur '+width+'px : '+JSON.stringify(mobileBook));
    assert.deepEqual(mobileBook.titles,[],'Titre rogné sur '+width+'px');
    assert.equal(mobileBook.columns,1,'Une carte par ligne sur téléphone');
    await page.locator('.bukhari-card-link').first().click();
    await page.locator('.bukhari-reader-pro').waitFor({state:'visible'});
    assert.ok(await page.locator('.bukhari-reader-translation').isVisible(),'Français absent sur mobile');
    const readerGeometry=await page.evaluate(()=>{
        const reader=document.querySelector('.bukhari-reader-pro');
        const components=[reader.querySelector('.bukhari-reader-original'),reader.querySelector('.bukhari-reader-translation')];
        return {overflow:reader.scrollWidth-reader.clientWidth,
            clipped:components.filter(el=>el.scrollWidth>el.clientWidth+3).map(el=>el.className)};
    });
    assert.ok(readerGeometry.overflow<=3 && !readerGeometry.clipped.length,
        'Lecteur trop large : '+width+'px '+JSON.stringify(readerGeometry));
    await page.locator('.bukhari-reader-source summary').click();
    assert.ok(await page.locator('.bukhari-reader-external').isVisible(),'Sunnah.com absent sur mobile');
    await page.locator('.bukhari-reader-back').click();
    await page.locator('.bukhari-book-view').waitFor({state:'visible'});
    await page.locator('.hadith-kutub-back').click();
    await page.locator('.hadith-kutub-book').last().click();
    await page.locator('.hadith-kutub-empty h3').waitFor({state:'visible',timeout:12000});
    assert.match(await page.locator('.hadith-kutub-book-head h2').innerText(),/Ibn Mâjah/,'Navigation du dernier recueil cassée');
    await page.locator('.hadith-kutub-back').click();
    await page.locator('.hadith-kutub-tabs button').nth(0).click();
    assert.equal(await page.locator('.hadith-pro-card').count(),18,'Corpus actuel perdu au retour sur mobile');
    await home(page);

    // Même lecture continue sur 390 et 360 px, sans débordement ni mini-onglets.
    await navigate(page,'hadiths');
    await page.locator('.hadith-pro-root').waitFor({state:'visible'});
    assert.equal(await page.locator('.hadith-pro-card').count(),18,'Lot initial Hadith absent sur mobile');
    const mobileVisual=await page.evaluate(() => {
        const root=document.querySelector('.hadith-pro-root');
        const container=root.querySelector('.hadith-pro-topic-row');
        const pieces=[...container.querySelectorAll('button'),...root.querySelectorAll('.hadith-kutub-tabs button'),...root.querySelectorAll('.hadith-pro-search-actions button')];
        const clipped=pieces.filter(el=>{
            const rect=el.getBoundingClientRect();
            return rect.left<-2 || rect.right>innerWidth+2 || el.scrollWidth>el.clientWidth+3;
        }).map(el=>({text:el.textContent.trim(),width:el.clientWidth,scroll:el.scrollWidth,left:el.getBoundingClientRect().left,right:el.getBoundingClientRect().right}));
        const titles=[...root.querySelectorAll('.hadith-pro-card h2')].filter(el=>el.scrollWidth>el.clientWidth+3||el.scrollHeight>el.clientHeight+3);
        return {clipped,titles:titles.map(el=>el.textContent),overflow:document.documentElement.scrollWidth-innerWidth,
            chipScroll:container.scrollWidth-container.clientWidth,
            gridColumns:getComputedStyle(root.querySelector('.hadith-pro-grid')).gridTemplateColumns.split(' ').length};
    });
    assert.deepEqual(mobileVisual.clipped,[],'Filtres ou boutons tronqués sur '+width+'px : '+JSON.stringify(mobileVisual));
    assert.deepEqual(mobileVisual.titles,[],'Titres de hadiths tronqués sur '+width+'px');
    assert.ok(mobileVisual.overflow<=3 && mobileVisual.chipScroll<=3,'Débordement horizontal Hadith sur '+width+'px : '+JSON.stringify(mobileVisual));
    assert.equal(mobileVisual.gridColumns,1,'Une seule colonne de cartes sur téléphone');
    await page.locator('.hadith-pro-search input').fill('colère');
    assert.ok(await page.locator('.hadith-pro-card').count()>0,'Recherche mobile Hadith inactive');
    await page.locator('.hadith-pro-card').first().click();
    await page.locator('.hadith-reader-pro').waitFor({state:'visible'});
    assert.ok(await page.locator('.hadith-reader-french').isVisible(),'Traduction française invisible sur mobile');
    await page.locator('.hadith-reader-language-switch button').filter({hasText:'Arabe'}).click();
    assert.ok(await page.locator('.hadith-reader-arabic').isVisible(),'Texte arabe invisible sur mobile');
    const readerWidth=await page.locator('.hadith-reader-shell').boundingBox();
    assert.ok(readerWidth && readerWidth.width<=width,'Le lecteur Hadith dépasse la largeur du téléphone');
    await page.locator('.hadith-reader-endnotes summary').click();
    assert.ok(await page.locator('.hadith-reader-source-grid').isVisible(),'Références non accessibles sur téléphone');
    await page.locator('#athar-immersive-quick').click();
    await page.locator('.hadith-pro-root').waitFor({state:'visible'});
    await home(page);

    await navigate(page,'adhkar');
    await page.locator('.adhkar-pro-card').first().waitFor({state:'visible'});
    const dhikrMobile=await page.evaluate(()=>{
        const root=document.querySelector('.adhkar-pro-shell');
        const candidates=[...root.querySelectorAll('.adhkar-pro-card,.adhkar-pro-category-row button,.adhkar-pro-tabs button,.adhkar-pro-library-toolbar button')];
        const clipped=candidates.filter(el=>{
            const r=el.getBoundingClientRect();
            return r.left<-2||r.right>innerWidth+2||el.scrollWidth>el.clientWidth+4;
        }).map(el=>({text:el.textContent.trim().slice(0,30),width:el.clientWidth,scroll:el.scrollWidth}));
        const titles=[...root.querySelectorAll('.adhkar-pro-card h3')].filter(el=>el.scrollHeight>el.clientHeight+3||el.scrollWidth>el.clientWidth+3).map(el=>el.textContent);
        return {overflow:root.scrollWidth-root.clientWidth,
            columns:getComputedStyle(root.querySelector('.adhkar-pro-card-grid')).gridTemplateColumns.split(' ').length,
            clipped,titles};
    });
    assert.ok(dhikrMobile.overflow<=3,'Débordement horizontal Adhkâr sur '+width+'px : '+JSON.stringify(dhikrMobile));
    assert.deepEqual(dhikrMobile.clipped,[],'Carte ou bouton coupé sur '+width+'px : '+JSON.stringify(dhikrMobile));
    assert.deepEqual(dhikrMobile.titles,[],'Titre de dhikr tronqué sur '+width+'px');
    assert.equal(dhikrMobile.columns,1,'Une carte par ligne sur téléphone');
    await page.locator('.adhkar-pro-card').first().click();
    await page.locator('.adhkar-pro-reader').waitFor({state:'visible'});
    const dhikrReaderBounds=await page.locator('.adhkar-pro-reader').boundingBox();
    assert.ok(dhikrReaderBounds && dhikrReaderBounds.width<=width+2,'Lecteur de dhikr trop large sur téléphone');
    await page.locator('.adhkar-pro-reader-notes summary').click();
    assert.ok(await page.locator('.adhkar-pro-reader-notes-body').isVisible(),'Sources non accessibles sur smartphone');
    await page.locator('.adhkar-pro-counter').click();
    await page.locator('.adhkar-pro-reader-close').click();
    await page.locator('.adhkar-pro-reader').waitFor({state:'detached',timeout:10000});
    await home(page);
    await navigate(page,'tabib');
    await page.locator('div.grid.grid-cols-1 > div.group h3').filter({hasText:'La douceur qui transforme les relations'}).click();
    await page.locator('.tabib-detail-root.tabib-detail-enriched').waitFor({state:'visible'});
    const tabibMobileVisual=await page.evaluate(()=>{
        const root=document.querySelector('.tabib-detail-root.tabib-detail-enriched');
        const links=[...root.querySelectorAll('a.tabib-source-link')];
        return {
            essenceCount:root.querySelectorAll('.tabib-learning-essence').length,
            essenceTitlePresent:root.textContent.includes('Le cœur de la démarche'),
            badIcons:root.querySelectorAll('a.tabib-source-link i[data-lucide],a.tabib-source-link svg').length,
            maxLinkHeight:Math.max(0,...links.map(x=>x.getBoundingClientRect().height)),
            horizontalOverflow:root.scrollWidth-root.clientWidth
        };
    });
    assert.equal(tabibMobileVisual.essenceCount,0,'Encadré cœur de la démarche encore visible sur '+width+'px');
    assert.equal(tabibMobileVisual.essenceTitlePresent,false,'Titre cœur de la démarche encore affiché sur '+width+'px');
    assert.equal(tabibMobileVisual.badIcons,0,'Icône géante dans les sources sur '+width+'px');
    assert.ok(tabibMobileVisual.maxLinkHeight<=85&&tabibMobileVisual.horizontalOverflow<=3,'Débordement de la nouvelle fiche Tabib sur '+width+'px : '+JSON.stringify(tabibMobileVisual));
    await page.getByRole('button',{name:'Retour aux remèdes'}).click();
    await home(page);

    await navigate(page,'fiqh-maliki');
    await page.locator('.fiqh-m-root').waitFor({state:'visible'});
    const fiqhVisual=await page.evaluate(()=>{
        const root=document.querySelector('.fiqh-m-root');
        const content=root.querySelector('.fiqh-m-content');
        const links=[...root.querySelectorAll('a[href^="https://"]')];
        return {overflow:root.scrollWidth-root.clientWidth,
            rootWidth:root.getBoundingClientRect().width,
            contentWidth:content.getBoundingClientRect().width,
            leadFont:parseFloat(getComputedStyle(root.querySelector('.fiqh-m-lead')).fontSize),
            oversizedLinks:links.filter(a=>a.getBoundingClientRect().height>110).length};
    });
    assert.ok(fiqhVisual.overflow<=3&&fiqhVisual.rootWidth<=width+2,'Fiqh malikite déborde sur '+width+' px : '+JSON.stringify(fiqhVisual));
    assert.ok(fiqhVisual.contentWidth<=width&&fiqhVisual.leadFont<=14&&!fiqhVisual.oversizedLinks,'Fiche Fiqh massive sur mobile : '+JSON.stringify(fiqhVisual));
    await page.locator('.fiqh-m-tabs button').filter({hasText:'Lexique'}).click();
    assert.equal(await page.locator('.fiqh-m-term').count(),6,'Lexique Fiqh absent sur mobile');
    await page.locator('.fiqh-m-back').click();
    await home(page);

    await navigate(page,'ussul');
    await page.locator('.ussul-pro-course-card').first().waitFor({state:'visible'});
    assert.equal(await page.locator('.ussul-pro-course-card').count(),7,'Usûl absent sur mobile');
    await page.locator('.ussul-glossary-launch').click();
    await page.locator('.ussul-glossary-panel').waitFor({state:'visible'});
    const glossaryWidth=await page.locator('.ussul-glossary-panel').boundingBox();
    assert.ok(glossaryWidth&&glossaryWidth.width<=width+2,'Lexique trop large sur '+width+'px');
    await page.locator('.ussul-glossary-panel>header>button').click();
    await home(page);
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
    assert.ok(overflow<=3,'Un débordement horizontal apparaît sur téléphone : '+overflow);
    assert.deepEqual(errors,[],'Erreurs JavaScript mobile '+width+'px : '+errors.join(' / '));
    await page.close();
}

try {
    await desktop();
    await mobile(390,844);
    await mobile(360,740);
    console.log('ATHAR IMMERSIVE ONLY BROWSER GATE: PASS — desktop, 390px/360px, source reading, hadith and tasbih.');
} finally {
    await browser.close();
}
