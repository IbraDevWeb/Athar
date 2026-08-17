import { chromium } from 'playwright';

const base = process.env.ATHAR_E2E_BASE || 'https://ibradevweb.github.io/Athar';
const browser = await chromium.launch({ headless: true });

async function inspectCase(name, immersive) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  if (immersive) {
    await context.addInitScript(() => {
      localStorage.setItem('athar_immersive_intent_v39', '1');
    });
  }
  const page = await context.newPage();
  const errors = [];
  const consoleErrors = [];
  page.on('pageerror', error => errors.push(String(error?.stack || error)));
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });

  await page.goto(`${base}/index.html?research-debug=${name}-${Date.now()}`, { waitUntil: 'domcontentloaded', timeout: 90_000 });
  await page.waitForSelector('#app > header', { state: 'attached', timeout: 60_000 });
  await page.waitForFunction(() => document.getElementById('app-loader') ? !document.getElementById('app-loader').offsetParent : true, { timeout: 60_000 });
  await page.waitForTimeout(800);

  if (immersive) {
    const homeResearch = page.getByRole('button', { name: /Interroger Athar Research/i }).first();
    if (await homeResearch.isVisible().catch(() => false)) await homeResearch.click();
    else await page.locator('[data-athar-research-v5-nav]').first().click({ force: true });
  } else {
    const nav = page.locator('[data-athar-research-v5-nav]').first();
    await nav.waitFor({ state: 'visible', timeout: 20_000 });
    await nav.click();
  }
  await page.waitForTimeout(1500);

  const state = await page.evaluate(() => {
    const route = document.querySelector('[data-athar-research-v5-route]');
    const shell = document.querySelector('.ar5-shell');
    const main = document.querySelector('main');
    const routeStyle = route ? getComputedStyle(route) : null;
    const shellStyle = shell ? getComputedStyle(shell) : null;
    return {
      uxVersion: window.AtharUX?.version || null,
      researchDefined: Boolean(window.ScholarLibraryV4View),
      researchBootstrap: Boolean(window.AtharResearchV5),
      immersiveClass: document.documentElement.classList.contains('athar-app-fullscreen'),
      immersiveIntent: localStorage.getItem('athar_immersive_intent_v39'),
      badge: document.querySelector('#athar-immersive-current span')?.textContent || null,
      routePresent: Boolean(route),
      routeDisplay: routeStyle?.display || null,
      routeVisibility: routeStyle?.visibility || null,
      routeRect: route ? route.getBoundingClientRect().toJSON() : null,
      shellPresent: Boolean(shell),
      shellDisplay: shellStyle?.display || null,
      shellRect: shell ? shell.getBoundingClientRect().toJSON() : null,
      mainText: (main?.innerText || '').slice(0, 1200),
      routeHtml: route?.outerHTML?.slice(0, 2500) || null
    };
  });

  console.log(`RESEARCH_STATE_${name.toUpperCase()}`, JSON.stringify(state, null, 2));
  if (errors.length) console.log(`PAGE_ERRORS_${name.toUpperCase()}`, errors.join('\n---\n'));
  if (consoleErrors.length) console.log(`CONSOLE_ERRORS_${name.toUpperCase()}`, consoleErrors.join('\n---\n'));

  await context.close();
  return { state, errors };
}

try {
  const normal = await inspectCase('normal', false);
  const immersive = await inspectCase('immersive', true);
  const failed = [normal, immersive].some(({ state, errors }) => !state.routePresent || !state.shellPresent || !state.mainText.includes('Athar Research') || errors.length);
  if (failed) process.exitCode = 1;
} finally {
  await browser.close();
}
