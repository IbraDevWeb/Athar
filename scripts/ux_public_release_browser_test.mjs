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
  await page.waitForFunction(() => Boolean(window.AtharLens?.search), { timeout: 20000 });
  const lensViews = await page.evaluate(() => window.AtharLens.search('Transmission', 100).map(item => item.route.view));
  assert.ok(lensViews.every(view => allowed.includes(view)), 'Athar Lens expose des fonctionnalités en préparation.');
}

async function desktop() {
  const page = await browser.newPage({ viewport: { width: 1440, height: 920 } });
  const errors = [];
  page.on('pageerror', error => errors.push(String(error?.message || error)));
  await page.goto(base + '/index.html?release=desktop', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await checkLanding(page);

  const labels = (await page.locator('#app aside.w-72 div.p-4.space-y-1 button').allTextContents()).map(x => x.trim());
  assert.deepEqual(labels, ['Accueil', ...sections.map(item => item[1])], 'Navigation latérale incorrecte.');
  for (const [, label] of sections) {
    await page.locator('.ap-launch-grid button').filter({ hasText: label }).first().click();
    await page.waitForFunction(() => !document.querySelector('.ap-launch-grid'), { timeout: 25000 });
    const content = (await page.locator('#app main').innerText()).trim();
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
  assert.ok((await page.locator('#app main').innerText()).trim().length > 40, 'Frise mobile vide.');
  assert.deepEqual(errors, [], 'Erreurs JavaScript sur mobile : ' + errors.join(' / '));
  await page.close();
}

try {
  await desktop();
  await mobile();
  console.log('ATHAR PUBLIC RELEASE BROWSER GATE: PASS (7 rubriques, menu mobile, immersion, Lens, redirection).');
} finally {
  await browser.close();
}
