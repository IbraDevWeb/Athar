import { chromium } from 'playwright';

const base = process.env.ATHAR_E2E_BASE || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });

try {
  await page.goto(`${base}/index.html?trace=${Date.now()}`, { waitUntil: 'domcontentloaded', timeout: 90_000 });
  await page.waitForSelector('#app > header', { state: 'visible', timeout: 60_000 });
  await page.waitForFunction(() => Boolean(window.AtharUX?.version), { timeout: 20_000 });
  const nav = page.locator('[data-athar-research-v5-nav]').first();
  await nav.waitFor({ state: 'visible', timeout: 20_000 });
  await nav.click();
  await page.waitForSelector('[data-athar-research-v5-route] .ar5-shell', { state: 'visible', timeout: 20_000 });
  await page.waitForTimeout(700);

  await page.evaluate(() => {
    window.__atharMutationTrace = [];
    window.__atharMutationTraceObserver?.disconnect?.();
    window.__atharMutationTraceObserver = new MutationObserver(records => {
      for (const record of records) {
        const node = record.target;
        window.__atharMutationTrace.push({
          tag: node.tagName,
          id: node.id || '',
          className: typeof node.className === 'string' ? node.className : '',
          hidden: Boolean(node.hidden),
          oldValue: record.oldValue,
          uxHidden: node.dataset?.atharUxHidden || '',
          fullscreenKind: node.dataset?.atharNewtoolFullscreen || '',
          ariaLabel: node.getAttribute?.('aria-label') || '',
          text: (node.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 120)
        });
      }
    });
    window.__atharMutationTraceObserver.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ['hidden'],
      attributeOldValue: true
    });
  });

  await page.waitForTimeout(700);
  const trace = await page.evaluate(() => window.__atharMutationTrace || []);
  console.log('TRACE_COUNT', trace.length);
  console.log('TRACE', JSON.stringify(trace.slice(0, 80), null, 2));

  const grouped = {};
  for (const entry of trace) {
    const key = `${entry.tag}#${entry.id}.${entry.className}|${entry.fullscreenKind}|${entry.ariaLabel}`;
    grouped[key] = (grouped[key] || 0) + 1;
  }
  console.log('GROUPED', JSON.stringify(grouped, null, 2));
} finally {
  await browser.close();
}
