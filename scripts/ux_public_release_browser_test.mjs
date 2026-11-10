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

    await navigate(page, 'library');
    await page.locator('.library-pro-root').waitFor({state:'visible',timeout:20000});
    await page.locator('.library-pro-search-hero input').fill('Abou Oubayda');
    await page.locator('.library-pro-card').filter({hasText:'Abou Oubayda'}).first().click();
    await page.getByRole('tab',{name:'Sources',exact:true}).click();
    const sources=page.locator('.athar-siyar-sources');
    assert.equal(await sources.isVisible(),true,'Les références Siyar doivent rester lisibles.');
    assert.equal(await sources.locator('a[href="https://siyar.fr/livre/1/11"]').count(),1);
    assert.match(await page.locator('#athar-immersive-quick').getAttribute('aria-label'),/Retour à Bibliothèque/);
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

    await page.goto(base+'/research-library.html?ui=blocked',{waitUntil:'domcontentloaded'});
    await page.waitForURL(url=>url.pathname.endsWith('/index.html'),{timeout:20000});
    await ready(page);
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
    const counter=page.locator('.tasbih-counter-button');
    await counter.waitFor({state:'visible',timeout:20000});
    const box=await counter.boundingBox();
    assert.ok(box && box.width<=width-20 && box.height>=180,'Le compteur Tasbih doit tenir dans le téléphone.');
    const before=Number((await page.locator('.tasbih-counter-inner strong').first().innerText()).replace(/\s/g,''));
    await counter.click();
    const after=Number((await page.locator('.tasbih-counter-inner strong').first().innerText()).replace(/\s/g,''));
    assert.equal(after,before+1,'Le compteur Tasbih ne réagit pas au toucher.');
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
