import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = process.env.ATHAR_E2E_BASE || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });

const visibleFullscreenCount = page => page.evaluate(() => {
  const nodes = [...document.querySelectorAll('#athar-fullscreen-toggle, [data-athar-newtool-fullscreen]')];
  return nodes.filter(node => {
    if (node.hidden || node.closest('[hidden]')) return false;
    const style = getComputedStyle(node);
    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
  }).length;
});

async function waitForApp(page) {
  await page.waitForSelector('#app > header', { state: 'visible', timeout: 60_000 });
  await page.waitForFunction(() => {
    const loader = document.getElementById('app-loader');
    if (!loader) return true;
    const style = getComputedStyle(loader);
    return style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0;
  }, { timeout: 60_000 });
  await page.waitForFunction(() => Boolean(window.AtharUX?.version), { timeout: 20_000 });
}

async function assertHealthy(page, label) {
  const loaderVisible = await page.locator('#app-loader').isVisible().catch(() => false);
  assert.equal(loaderVisible, false, `${label}: le loader global ne doit pas réapparaître`);

  const mainVisible = await page.locator('main').first().isVisible().catch(() => false);
  assert.equal(mainVisible, true, `${label}: la zone principale doit rester visible`);

  const bodyBusy = await page.evaluate(() => getComputedStyle(document.body).pointerEvents === 'none');
  assert.equal(bodyBusy, false, `${label}: la page ne doit pas bloquer les clics`);

  const controls = await visibleFullscreenCount(page);
  assert.ok(controls <= 1, `${label}: ${controls} contrôles grand écran visibles`);
}

async function openFreshAndClick(page, label) {
  await page.goto(`${base}/index.html?uxv39=${encodeURIComponent(label)}`, { waitUntil: 'domcontentloaded', timeout: 90_000 });
  await waitForApp(page);
  const button = page.locator('#app aside.w-72 button').filter({ hasText: label }).first();
  await button.waitFor({ state: 'visible', timeout: 20_000 });
  await button.click();
  await page.waitForTimeout(400);
  await assertHealthy(page, label);
}

async function desktopFlow() {
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(String(error?.stack || error)));

  const sections = [
    'Bibliothèque',
    'Frise Chrono',
    'Lexique',
    'Hadiths',
    'Al-Adhkar',
    'Tasbih',
    'Transmission',
    'Atlas Interactif',
    'Oussoul Al-Fiqh'
  ];
  for (const label of sections) await openFreshAndClick(page, label);

  await page.goto(`${base}/index.html?uxv39=immersive`, { waitUntil: 'domcontentloaded', timeout: 90_000 });
  await waitForApp(page);
  assert.equal(await page.evaluate(() => window.AtharUX.version), 'athar-ux-v39-safe-1');

  const fullscreen = page.locator('#athar-fullscreen-toggle');
  await fullscreen.waitFor({ state: 'visible', timeout: 20_000 });
  assert.equal(await visibleFullscreenCount(page), 1, 'SPA: un seul contrôle grand écran doit être visible');
  await fullscreen.click();
  await page.waitForFunction(() => Boolean(document.fullscreenElement) || document.documentElement.classList.contains('athar-app-fullscreen'), { timeout: 10_000 });
  assert.equal(await page.evaluate(() => localStorage.getItem('athar_immersive_intent_v39')), '1');

  const immersiveMenu = page.locator('#athar-immersive-menu');
  await immersiveMenu.waitFor({ state: 'visible', timeout: 10_000 });
  await immersiveMenu.click();
  const drawerTarget = page.locator('#athar-immersive-drawer [data-athar-view="hadiths"]');
  await drawerTarget.waitFor({ state: 'visible', timeout: 10_000 });
  await drawerTarget.click();
  await page.waitForTimeout(400);
  await assertHealthy(page, 'Hadiths en mode immersif');

  const stillImmersive = await page.evaluate(() => Boolean(document.fullscreenElement) || document.documentElement.classList.contains('athar-app-fullscreen'));
  assert.equal(stillImmersive, true, 'Le mode immersif doit survivre au changement de section SPA');

  await page.goto(`${base}/research-library.html?uxv39=e2e`, { waitUntil: 'domcontentloaded', timeout: 90_000 });
  await page.waitForSelector('.library-topbar', { state: 'visible', timeout: 30_000 });
  await page.waitForFunction(() => Boolean(window.AtharUX?.version), { timeout: 20_000 });
  await page.waitForTimeout(700);

  const persistentStandalone = await page.evaluate(() => document.documentElement.classList.contains('athar-newtool-local-fullscreen'));
  assert.equal(persistentStandalone, true, 'Le mode immersif doit être restauré sur la Bibliothèque autonome');
  assert.equal(await visibleFullscreenCount(page), 1, 'Bibliothèque: un seul contrôle grand écran visible');

  const localFullscreen = page.locator('[data-athar-newtool-fullscreen]:visible').first();
  await localFullscreen.click();
  await page.waitForTimeout(300);
  assert.equal(await page.evaluate(() => localStorage.getItem('athar_immersive_intent_v39')), '0');
  assert.equal(await page.evaluate(() => document.documentElement.classList.contains('athar-newtool-local-fullscreen')), false);

  if (pageErrors.length) {
    throw new Error(`Erreurs JavaScript desktop:\n${pageErrors.join('\n---\n')}`);
  }
  await page.close();
}

async function mobileFlow() {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(String(error?.stack || error)));

  await page.goto(`${base}/index.html?uxv39=mobile`, { waitUntil: 'domcontentloaded', timeout: 90_000 });
  await waitForApp(page);

  const menu = page.locator('#app > header button').filter({ has: page.locator('[data-lucide="menu"]') }).last();
  await menu.waitFor({ state: 'visible', timeout: 15_000 });
  await menu.click();

  // Le SPA et MobileExperience contiennent tous deux des boutons « Hadiths ».
  // On cible explicitement le panneau de menu Vue visible au premier plan.
  const mobileOverlay = page
    .locator('#app div[class*="absolute"][class*="inset-0"][class*="z-50"]')
    .filter({ hasText: 'Menu' })
    .first();
  await mobileOverlay.waitFor({ state: 'visible', timeout: 10_000 });

  const hadithButton = mobileOverlay.locator('button').filter({ hasText: 'Hadiths' }).first();
  await hadithButton.waitFor({ state: 'visible', timeout: 10_000 });
  await hadithButton.click();
  await page.waitForTimeout(350);
  await assertHealthy(page, 'Hadiths mobile');

  if (pageErrors.length) {
    throw new Error(`Erreurs JavaScript mobile:\n${pageErrors.join('\n---\n')}`);
  }
  await page.close();
}

try {
  await desktopFlow();
  await mobileFlow();
  console.log('ATHAR UX V39 BROWSER GATE: PASS');
} finally {
  await browser.close();
}
