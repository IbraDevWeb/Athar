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
    ['tasbih', 'Tasbih']
];
const allowed = ['home', ...sections.map(([view]) => view)];
const blocked = ['transmission', 'atlas', 'ussul', 'constellation', 'scriptorium', 'research'];

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
    assert.equal(await page.locator('.ap-launch-grid button').count(), 7);
    assert.equal(await page.locator('#athar-lens').count(), 0);

    const drawer = page.locator('#athar-immersive-drawer [data-athar-view]');
    await drawer.first().waitFor({ state: 'attached' });
    const menuViews = await drawer.evaluateAll(nodes => nodes.map(node => node.dataset.atharView).sort());
    assert.deepEqual(menuViews, [...allowed].sort(), 'Les 7 rubriques et Accueil doivent être les seuls liens de navigation.');
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

    // UX : l'accès aux histoires doit être immédiat, lisible et léger.
    await navigate(page, 'library');
    await page.locator('.library-pro-selection').waitFor({state:'visible'});
    assert.match(await page.locator('.library-pro-selection-intro h1').innerText(),/Choisir une histoire/i);
    const firstBatch = page.locator('.library-pro-selection-results .library-pro-card');
    assert.equal(await firstBatch.count(),18,'La page de sélection doit afficher 18 cartes au départ');
    assert.equal(await page.locator('.library-pro-card-metrics').count(),0,'Les quatre blocs de statistiques ne doivent plus encombrer les cartes');
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
    await outerMain.evaluate(el=>{el.scrollTop=el.scrollHeight});
    assert.ok((await outerMain.evaluate(el=>el.scrollTop))>0,'La lecture ne doit pas être bloquée sur téléphone.');
    await page.locator('#athar-immersive-quick').click();
    await page.locator('.library-pro-root').waitFor({state:'visible'});
    await home(page);

    await navigate(page,'adhkar');
    assert.ok((await main(page).innerText()).trim().length>40,"Les Adhkâr doivent être lisibles sur téléphone.");
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
