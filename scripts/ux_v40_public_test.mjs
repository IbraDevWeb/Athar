import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const base = (process.env.ATHAR_E2E_BASE || 'https://ibradevweb.github.io/Athar').replace(/\/$/, '');
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
const fatal = [];

page.on('pageerror', error => fatal.push(`pageerror: ${String(error?.message || error)}`));
page.on('console', message => {
  if (message.type() !== 'error') return;
  const text = message.text();
  if (/favicon|Failed to load resource|net::ERR_BLOCKED_BY_CLIENT/i.test(text)) return;
  fatal.push(`console: ${text}`);
});

async function waitForResearch() {
  const shell = page.locator('.ar5-shell[data-athar-v40="research"]');
  if (await shell.count()) {
    await shell.waitFor({ state: 'visible', timeout: 30000 });
    return;
  }
  const nav = page.locator('[data-athar-research-v5-nav]');
  await nav.waitFor({ state: 'visible', timeout: 45000 });
  await nav.click();
  await shell.waitFor({ state: 'visible', timeout: 45000 });
}

try {
  await page.goto(`${base}/index.html?v40live=${Date.now()}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await waitForResearch();
  assert.equal(await page.locator('html').getAttribute('data-athar-v40'), 'athar-v40-research-library-1');
  await page.locator('.ar40-library-link').waitFor({ state: 'visible', timeout: 15000 });
  await page.locator('.ar40-composer-hint').waitFor({ state: 'visible', timeout: 15000 });

  await page.keyboard.press('/');
  assert.equal(await page.evaluate(() => document.activeElement?.matches('.ar5-composer textarea')), true, 'Research shortcut / must focus the composer');

  await Promise.all([
    page.waitForURL(url => url.pathname.endsWith('/research-library.html'), { timeout: 30000 }),
    page.locator('.ar40-library-link').click()
  ]);
  await page.locator('body.athar-v40-library').waitFor({ state: 'attached', timeout: 30000 });
  assert.equal(await page.locator('html').getAttribute('data-athar-v40'), 'athar-v40-research-library-1');

  const firstBook = page.locator('.book-card[data-book-id]').first();
  await firstBook.waitFor({ state: 'visible', timeout: 120000 });
  const title = (await firstBook.locator('h3').textContent())?.trim() || '';
  assert.ok(title, 'The public library must expose at least one titled book');
  await firstBook.click();

  await page.locator('#readerView:not([hidden])').waitFor({ state: 'visible', timeout: 60000 });
  await page.locator('#readerPaper .reader-passage').first().waitFor({ state: 'visible', timeout: 120000 });
  await page.locator('.ar40-reader-research').waitFor({ state: 'visible', timeout: 15000 });

  await Promise.all([
    page.waitForURL(url => url.pathname.endsWith('/index.html'), { timeout: 30000 }),
    page.locator('.ar40-reader-research').click()
  ]);
  await waitForResearch();
  const draft = await page.locator('.ar5-composer textarea').inputValue();
  assert.ok(draft.includes(title), `Research draft must contain opened book title: ${title}`);
  assert.match(draft, /^Dans l’ouvrage «/);

  assert.deepEqual(fatal, [], `Public browser errors:\n${fatal.join('\n')}`);
  console.log(`ATHAR V40 PUBLIC JOURNEY: PASS — ${title}`);
} finally {
  await browser.close();
}
