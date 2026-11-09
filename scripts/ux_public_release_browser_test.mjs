import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = (process.env.ATHAR_E2E_BASE || 'http://127.0.0.1:4173').replace(/\/$/, '');
const sections = [
  ['library', 'Bibliothèque'],
  ['timeline', 'Frise Chrono'],
  ['glossary', 'Lexique'],
  ['hadiths', 'Hadiths'],
  ['tabib', 'Tabib Al-Qulub'],
  ['adhkar', 'Al-Adhkar'],
  ['tasbih', 'Tasbih']
];
const allowed = ['home', ...sections.map(item => item[0])];
const blocked = ['Transmission', 'Atlas Interactif', 'Oussoul Al-Fiqh', 'Constellation', 'Athar Research', 'Scriptorium', 'Ciel Anciens'];
const browser = await chromium.launch({ headless: true });

async function ready(page) {
  await page.locator('#app > header').waitFor({ state: 'visible', timeout: 60000 });
  await page.locator('.ap-launch-grid').waitFor({ state: 'visible', timeout: 60000 });
  await page.waitForFunction(() => {
    const loader=document.getElementById('app-loader');
    return !loader || getComputedStyle(loader).display === 'none';
  }, { timeout: 60000 });
}

async function checkLanding(page) {
  await ready(page);
  const cards = page.locator('.ap-launch-grid button');
  assert.equal(await cards.count(), 7, "L'accueil doit comporter sept cartes.");
  for (const [, label] of sections) {
    assert.equal(await cards.filter({ hasText: label }).count(), 1, 'Carte manquante : ' + label);
  }
  assert.equal(await page.locator('[data-athar-research-v5-nav]').count(), 0, 'Athar Research injecté dans le menu.');
  for (const label of blocked) {
    assert.equal(await page.locator('#app aside.w-72 button').filter({ hasText: label }).count(), 0, 'Rubrique non publiée : ' + label);
  }
  await page.locator('#athar-immersive-drawer').waitFor({ state: 'attached', timeout: 25000 });
  const immersive = await page.locator('#athar-immersive-drawer [data-athar-view]').evaluateAll(
    nodes => nodes.map(node => node.getAttribute('data-athar-view')).sort()
  );
  assert.deepEqual(immersive, [...allowed].sort(), 'Le menu immersif affiche des rubriques non publiées.');
  assert.equal(await page.locator('#athar-lens').count(), 0, 'Le lanceur Athar Lens reste visible.');
  assert.equal(await page.evaluate(() => Boolean(window.AtharLens)), false, 'Le moteur Athar Lens ne doit plus être initialisé.');
  await page.keyboard.press('Control+k');
  assert.equal(await page.locator('#athar-lens').count(), 0, 'Le raccourci Ctrl+K réactive Athar Lens.');
  const carousel = page.locator('.ap-hadith-panel');
  await carousel.waitFor({ state: 'visible', timeout: 15000 });
  assert.ok((await carousel.locator('.ap-hadith-quote').innerText()).trim().length > 35, 'Aucun texte dans le carrousel.');
  assert.ok((await carousel.locator('.ap-hadith-source').innerText()).trim().length > 0, 'La référence du hadith est absente.');
  assert.ok(await carousel.locator('.ap-hadith-dot').count() >= 2, 'Les contrôles du carrousel sont absents.');
}

async function desktop() {
  const page = await browser.newPage({ viewport: { width: 1440, height: 920 } });
  const errors = [];
  page.on('pageerror', error => errors.push(String(error?.message || error)));
  await page.goto(base + '/index.html?release=desktop', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await checkLanding(page);

  const firstHadithTitle = (await page.locator('.ap-hadith-slide h3').innerText()).trim();
  await page.locator('.ap-hadith-next').click();
  await page.waitForFunction(title => {
    const current = document.querySelector('.ap-hadith-slide h3')?.textContent?.trim();
    return Boolean(current && current !== title);
  }, firstHadithTitle, { timeout: 8000 });
  await page.locator('.ap-hadith-previous').click();
  await page.waitForFunction(title => document.querySelector('.ap-hadith-slide h3')?.textContent?.trim() === title, firstHadithTitle, { timeout: 8000 });
  await page.locator('.ap-hadith-read').click();
  await page.locator('.hadith-reader-pro').waitFor({ state: 'visible', timeout: 15000 });
  assert.equal((await page.locator('.hadith-reader-hero h1').innerText()).trim(), firstHadithTitle, 'La fiche ouverte ne correspond pas à la carte.');
  await page.locator('#app > header [title="Retour à l\'accueil"]').click();
  await ready(page);

  const labels = (await page.locator('#app aside.w-72 div.p-4.space-y-1 button').allTextContents()).map(x => x.trim());
  assert.deepEqual(labels, ['Accueil', ...sections.map(item => item[1])], 'Navigation latérale incorrecte.');
  for (const [, label] of sections) {
    await page.locator('.ap-launch-grid button').filter({ hasText: label }).first().click();
    await page.waitForFunction(() => !document.querySelector('.ap-launch-grid'), { timeout: 25000 });
    const content = (await page.locator('#app main').first().innerText()).trim();
    assert.ok(content.length > 40, 'Contenu vide pour la section : ' + label);
    await page.locator('#app > header [title="Retour à l\'accueil"]').click();
    await ready(page);
  }

  await page.evaluate(() => window.dispatchEvent(new CustomEvent('athar:navigate', { detail: { view: 'atlas' } })));
  await page.waitForTimeout(250);
  assert.equal(await page.locator('.ap-launch-grid').isVisible(), true, 'Une vue masquée reste accessible par événement.');

  await page.goto(base + '/research-library.html?release=redirect', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForURL(url => url.pathname.endsWith('/index.html'), { timeout: 20000 });
  await ready(page);
  assert.deepEqual(errors, [], 'Erreurs JavaScript sur ordinateur : ' + errors.join(' / '));
  await page.close();
}

async function mobile() {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const errors = [];
  page.on('pageerror', error => errors.push(String(error?.message || error)));
  await page.goto(base + '/index.html?release=mobile', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await ready(page);
  assert.equal(await page.locator('.ap-launch-grid button').count(), 7);
  assert.equal(await page.locator('#athar-lens').count(), 0);
  const mobileQuote = page.locator('.ap-hadith-quote');
  assert.ok((await mobileQuote.innerText()).trim().length > 35, 'Carrousel vide sur mobile.');
  await page.locator('.ap-hadith-next').click();
  assert.ok((await page.locator('.ap-hadith-count').innerText()).includes('2 /'), 'Le carrousel mobile ne défile pas.');

  const dock = page.locator('#athar-mobile-dock');
  await dock.waitFor({ state: 'visible', timeout: 20000 });
  assert.equal(await dock.locator('[data-mobile-view="ussul"]').count(), 0, 'Ancien raccourci Oussoul encore actif.');
  await page.locator('#app > header button[class*="md:hidden"]').click();
  const menu = page.locator('#app .athar-native-mobile-menu');
  await menu.waitFor({ state: 'visible', timeout: 20000 });
  const buttons = (await menu.locator('button').allTextContents()).map(x => x.trim());
  for (const label of blocked) assert.ok(!buttons.some(x => x === label), 'Rubrique dans le menu mobile : ' + label);
  await menu.locator('button').filter({ hasText: 'Frise Chrono' }).first().click();
  await page.waitForFunction(() => !document.querySelector('.ap-launch-grid'), { timeout: 20000 });
  assert.ok((await page.locator('#app main').first().innerText()).trim().length > 40, 'Frise mobile vide.');
  assert.deepEqual(errors, [], 'Erreurs JavaScript sur mobile : ' + errors.join(' / '));
  await page.close();
}

try {
  await desktop();
  await mobile();
  console.log('ATHAR PUBLIC RELEASE BROWSER GATE: PASS (7 rubriques, carrousel de hadiths, menu mobile, absence de Lens, immersion, redirection).');
} finally {
  await browser.close();
}
