import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const base = process.env.ATHAR_E2E_BASE || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
const errors = [];
page.on('pageerror', error => errors.push(String(error?.stack || error)));
page.on('console', message => {
  if (message.type() === 'error' && !/favicon|Failed to load resource/i.test(message.text())) errors.push(`console: ${message.text()}`);
});

const engine = { ok: true, engine: 'athar-v6.5.3-hybrid', engine_version: 6 };
const book = {
  id: 'book-1', title: 'Al-Muwaṭṭaʾ', title_ar: 'الموطأ', author: 'Mālik ibn Anas', discipline: 'Hadith', madhhab: 'Mālikite',
  chunks: 1280, indexed_pages: 420, indexed_sections: 96, first_page: 1, last_page: 420, pages: 420,
  arabic_passages: 1280, french_passages: 120, has_french: true,
  source_url: 'https://example.test/muwatta', metadata: { source: 'OpenITI', edition: 'Édition de test' }
};

await page.route('https://athar-rag-ibradevweb.onrender.com/**', async route => {
  const url = new URL(route.request().url());
  let payload = engine;
  if (url.pathname.endsWith('/status')) payload = { ...engine, books: 215, chunks: 574461, substantive_passages: 517287, fts_ready: true, runtime_profile: 'low-memory' };
  else if (url.pathname.endsWith('/library-books') || url.pathname.endsWith('/books')) payload = { ...engine, books: [book] };
  else if (url.pathname.endsWith('/book')) payload = { ...engine, book };
  else if (url.pathname.endsWith('/toc')) payload = { ...engine, toc: { items: [{ sequence: 1, chapter: 'كتاب الطهارة', first_page: 1 }], total: 1, truncated: false } };
  else if (url.pathname.endsWith('/read')) payload = { ...engine, page: 1, offset: 0, total: 1, previous_offset: null, next_offset: null, previous_page: null, next_page: 2, passages: [{ id: 'p1', page: 1, sequence: 1, chapter: 'كتاب الطهارة', text_ar: 'بسم الله الرحمن الرحيم', text_fr: 'Au nom d’Allah, le Tout Miséricordieux.', translation_status: 'human_verified', source_url: 'https://example.test/muwatta/1' }] };
  else if (url.pathname.endsWith('/book-search')) payload = { ...engine, hits: [] };
  await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(payload) });
});

try {
  await page.goto(`${base}/index.html`, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-athar-research-v5-nav]').waitFor({ state: 'visible', timeout: 30000 });
  await page.locator('[data-athar-research-v5-nav]').click();
  const shell = page.locator('.ar5-shell[data-athar-v40="research"]');
  await shell.waitFor({ state: 'visible', timeout: 15000 });
  await page.locator('html[data-athar-v40-polish="athar-v40-polish-1"]').waitFor({ state: 'attached', timeout: 10000 });

  assert.equal((await page.locator('.ar5-nav-version').first().textContent())?.trim(), 'V6');
  assert.equal(await page.locator('.ar5-topbar .ar5-brand').evaluate(el => getComputedStyle(el).display), 'none');
  assert.equal(await page.locator('.ar5-topbar .ar5-ghost').first().evaluate(el => getComputedStyle(el).display), 'none');
  assert.equal(await page.locator('.ar40-library-link').isVisible(), true);

  await page.locator('.ar5-rail nav button').filter({ hasText: 'Ouvrages' }).click();
  const card = page.locator('.ar5-book-card[data-book-id="book-1"]');
  await card.waitFor({ state: 'visible', timeout: 10000 });

  await Promise.all([
    page.waitForURL(url => url.pathname.endsWith('/research-library.html') && url.hash.includes('book=book-1'), { timeout: 15000 }),
    card.click()
  ]);
  await page.locator('#readerView:not([hidden])').waitFor({ state: 'visible', timeout: 10000 });
  const researchAction = page.locator('.ar40-reader-research');
  await researchAction.waitFor({ state: 'visible' });
  assert.match((await researchAction.textContent()) || '', /Interroger cette page/i);
  assert.equal(await page.locator('.library-topbar-actions > a').evaluate(el => getComputedStyle(el).display), 'none');
  assert.equal(await page.locator('.library-nav a').first().evaluate(el => getComputedStyle(el).display), 'none');

  await Promise.all([
    page.waitForURL(url => url.pathname.endsWith('/index.html'), { timeout: 15000 }),
    researchAction.click()
  ]);
  await page.locator('.ar5-shell[data-athar-v40="research"]').waitFor({ state: 'visible', timeout: 15000 });
  const draft = await page.locator('.ar5-composer textarea').inputValue();
  assert.match(draft, /Al-Muwaṭṭaʾ/);
  assert.match(draft, /page 1/);
  assert.deepEqual(errors, []);
  console.log('ATHAR V40.1 PROFESSIONAL POLISH JOURNEY: PASS');
} finally {
  await browser.close();
}
