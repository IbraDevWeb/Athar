import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const base = process.env.ATHAR_E2E_BASE || 'https://ibradevweb.github.io/Athar';
const ragOrigin = 'https://athar-rag-ibradevweb.onrender.com';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
const errors = [];
let forcedHealthFailure = false;
let healthRequests = 0;

page.on('pageerror', error => errors.push(String(error?.stack || error)));
page.on('console', message => {
  if (message.type() === 'error' && !/favicon|Failed to load resource/i.test(message.text())) {
    errors.push(`console: ${message.text()}`);
  }
});

await page.route(`${ragOrigin}/healthz*`, async route => {
  healthRequests += 1;
  if (!forcedHealthFailure) {
    forcedHealthFailure = true;
    await route.abort('failed');
    return;
  }
  await route.continue();
});

try {
  const stamp = Date.now();
  await page.goto(`${base}/index.html?ragReconnect=${stamp}`, {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  await page.waitForFunction(() => (
    window.AtharRagFetchResilience?.version === 'athar-rag-fetch-resilience-1'
  ), null, { timeout: 30000 });

  await page.locator('[data-athar-research-v5-nav]').waitFor({ state: 'visible', timeout: 30000 });
  await page.locator('[data-athar-research-v5-nav]').click();

  await page.locator('.ar5-shell').waitFor({ state: 'visible', timeout: 20000 });
  await page.waitForFunction(() => {
    const runtime = document.querySelector('.ar5-runtime');
    return Boolean(runtime?.classList.contains('online'));
  }, null, { timeout: 100000 });

  assert.equal(forcedHealthFailure, true, 'the test must force the first health request to fail');
  assert.ok(healthRequests >= 2, `expected at least 2 health requests, got ${healthRequests}`);

  const runtimeLabel = (await page.locator('.ar5-runtime strong').textContent())?.trim() || '';
  assert.match(runtimeLabel, /^RAG V\d+(?:\.\d+){0,2}$/i);

  const visibleAlert = page.locator('.ar5-alert:visible');
  assert.equal(await visibleAlert.count(), 0, 'a recovered transient failure must not leave an error banner');

  const stats = (await page.locator('.ar5-rail-stats').textContent()) || '';
  assert.match(stats.replace(/\s+/g, ' '), /Ouvrages\s*269/i, `unexpected corpus stats: ${stats}`);

  const composer = page.locator('.ar5-composer textarea');
  await composer.fill('Que disent les sources du corpus sur la prière ?');
  await composer.press('Control+Enter');

  await page.waitForFunction(() => {
    const results = document.querySelector('.ar5-results');
    const alert = document.querySelector('.ar5-alert');
    return Boolean(results || alert);
  }, null, { timeout: 150000 });

  if (await page.locator('.ar5-alert').count() && await page.locator('.ar5-alert').isVisible()) {
    throw new Error(`Athar Research error after reconnect: ${(await page.locator('.ar5-alert').textContent())?.trim() || 'unknown'}`);
  }

  const cards = page.locator('.ar5-source-card');
  const cardCount = await cards.count();
  assert.ok(cardCount >= 13, `expected citations beyond S12, got ${cardCount}`);
  const ids = await cards.locator('.ar5-source-card-top span').allTextContents();
  assert.ok(ids.includes('[S13]'), `S13 missing after reconnect: ${ids.join(', ')}`);
  assert.deepEqual(errors, []);

  console.log(`ATHAR RAG RECONNECT LIVE: PASS — forced first health failure, recovered in ${healthRequests} health request(s), ${runtimeLabel}, ${cardCount} source(s).`);
} finally {
  await browser.close();
}
