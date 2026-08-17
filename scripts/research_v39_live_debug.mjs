import { chromium } from 'playwright';

const base = process.env.ATHAR_E2E_BASE || 'https://ibradevweb.github.io/Athar';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
const errors = [];
const consoleErrors = [];
page.on('pageerror', error => errors.push(String(error?.stack || error)));
page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });

try {
  await page.goto(`${base}/index.html?research-debug=${Date.now()}`, { waitUntil: 'domcontentloaded', timeout: 90_000 });
  await page.waitForSelector('#app > header', { state: 'visible', timeout: 60_000 });
  await page.waitForFunction(() => document.getElementById('app-loader') ? !document.getElementById('app-loader').offsetParent : true, { timeout: 60_000 });
  const nav = page.locator('[data-athar-research-v5-nav]').first();
  await nav.waitFor({ state: 'visible', timeout: 30_000 });
  await nav.click();
  await page.waitForTimeout(1800);

  const state = await page.evaluate(() => {
    const route = document.querySelector('[data-athar-research-v5-route]');
    const shell = document.querySelector('.ar5-shell');
    const main = document.querySelector('main');
    const custom = document.querySelector('scholar-library-v4-view');
    const routeStyle = route ? getComputedStyle(route) : null;
    const shellStyle = shell ? getComputedStyle(shell) : null;
    return {
      uxVersion: window.AtharUX?.version || null,
      researchDefined: Boolean(window.ScholarLibraryV4View),
      researchBootstrap: Boolean(window.AtharResearchV5),
      routePresent: Boolean(route),
      routeDisplay: routeStyle?.display || null,
      routeVisibility: routeStyle?.visibility || null,
      routeRect: route ? route.getBoundingClientRect().toJSON() : null,
      shellPresent: Boolean(shell),
      shellDisplay: shellStyle?.display || null,
      shellRect: shell ? shell.getBoundingClientRect().toJSON() : null,
      customPresent: Boolean(custom),
      mainText: (main?.innerText || '').slice(0, 1000),
      routeHtml: route?.outerHTML?.slice(0, 3000) || null
    };
  });

  console.log('RESEARCH_STATE', JSON.stringify(state, null, 2));
  if (errors.length) console.log('PAGE_ERRORS', errors.join('\n---\n'));
  if (consoleErrors.length) console.log('CONSOLE_ERRORS', consoleErrors.join('\n---\n'));

  if (!state.routePresent || !state.shellPresent || !state.mainText.includes('Athar Research') || errors.length) {
    process.exitCode = 1;
  }
} finally {
  await browser.close();
}
