import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const base = process.env.ATHAR_E2E_BASE || 'https://ibradevweb.github.io/Athar';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
const errors = [];

page.on('pageerror', error => errors.push(String(error?.stack || error)));
page.on('console', message => {
  if (message.type() === 'error' && !/favicon|Failed to load resource/i.test(message.text())) {
    errors.push(`console: ${message.text()}`);
  }
});

try {
  const stamp = Date.now();
  await page.goto(`${base}/index.html?v402=${stamp}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.locator('[data-athar-research-v5-nav]').waitFor({ state: 'visible', timeout: 30000 });
  await page.locator('[data-athar-research-v5-nav]').click();

  const shell = page.locator('.ar5-shell[data-athar-v40="research"]');
  await shell.waitFor({ state: 'visible', timeout: 20000 });
  await page.locator('html[data-athar-v40-runtime-truth="athar-v40-runtime-truth-1"]').waitFor({ state: 'attached', timeout: 10000 });

  await page.waitForFunction(() => {
    const runtime = document.querySelector('.ar5-runtime');
    const label = runtime?.querySelector('strong')?.textContent?.trim() || '';
    return runtime?.classList.contains('online') && /^RAG V\d+(?:\.\d+){0,2}$/i.test(label);
  }, null, { timeout: 100000 });

  const runtimeLabel = (await page.locator('.ar5-runtime strong').textContent())?.trim() || '';
  assert.match(runtimeLabel, /^RAG V\d+(?:\.\d+){0,2}$/i);

  const runtimeRow = page.locator('.ar5-home-side dl > div').filter({ hasText: 'Moteur' }).first();
  if (await runtimeRow.count()) {
    const displayedRuntime = (await runtimeRow.locator('dd').textContent())?.trim() || '';
    assert.equal(displayedRuntime, runtimeLabel, 'Le moteur affiché doit provenir du runtime réellement connecté.');
    assert.equal(await runtimeRow.locator('dd').getAttribute('data-athar-runtime-source'), 'connected');
  }

  const query = "Quelles sont les règles du tayammum lorsqu'une personne ne peut pas utiliser l'eau ?";
  await page.locator('.ar5-composer textarea').fill(query);
  await page.locator('.ar5-composer button').filter({ hasText: 'Rechercher' }).click();

  await page.waitForFunction(() => {
    const results = document.querySelector('.ar5-results');
    const alert = document.querySelector('.ar5-alert');
    return Boolean(results || alert);
  }, null, { timeout: 135000 });

  const alert = page.locator('.ar5-alert');
  if (await alert.count() && await alert.isVisible()) {
    throw new Error(`Athar Research production error: ${(await alert.textContent())?.trim() || 'unknown error'}`);
  }

  const results = page.locator('.ar5-results');
  await results.waitFor({ state: 'visible', timeout: 5000 });
  assert.match((await page.locator('.ar5-analysis').textContent()) || '', /Moteur\s*RAG V\d+/i);

  const cards = page.locator('.ar5-source-card');
  assert.ok(await cards.count() > 0, 'La requête de contrôle doit renvoyer au moins une preuve documentaire.');
  assert.match((await cards.first().locator('.ar5-source-card-top span').textContent()) || '', /^\[S1\]$/);
  assert.ok(((await cards.first().locator('h3').textContent()) || '').trim().length > 0, 'La première preuve doit nommer son ouvrage.');

  const evidenceText = [
    await page.locator('.ar5-text-block.arabic p').first().textContent().catch(() => ''),
    await page.locator('.ar5-text-block:not(.arabic) p').first().textContent().catch(() => '')
  ].join(' ').trim();
  assert.ok(evidenceText.length > 20, 'La première preuve doit exposer un passage lisible.');
  assert.deepEqual(errors, []);

  console.log(`ATHAR V40.2 LIVE RESEARCH: PASS — ${runtimeLabel}, ${await cards.count()} source(s).`);
} finally {
  await browser.close();
}
