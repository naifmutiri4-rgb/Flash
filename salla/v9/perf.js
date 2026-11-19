const { chromium, devices } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ ...devices['iPhone 13'] });
  const p = await c.newPage();
  const cdp = await c.newCDPSession(p);
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6e6 / 8 * 1024 / 1000 * 1000, uploadThroughput: 750e3 / 8 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await p.addInitScript(() => { window.__m = { cls: 0, lcp: 0 }; new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__m.cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); new PerformanceObserver(l => { const e = l.getEntries().pop(); window.__m.lcp = e.startTime; window.__m.el = (e.element && (e.element.tagName + ' ' + (e.element.currentSrc || e.element.src || '').split('/').pop())) || ''; }).observe({ type: 'largest-contentful-paint', buffered: true }); });
  const t0 = Date.now();
  await p.goto('https://flashstore-ksa.com/?pf=' + Date.now(), { waitUntil: 'load', timeout: 120000 });
  const load = Date.now() - t0;
  await p.waitForTimeout(6000);
  const m = await p.evaluate(() => ({ ...window.__m, fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime, bytes: performance.getEntriesByType('resource').reduce((a, r) => a + (r.transferSize || 0), 0), reqs: performance.getEntriesByType('resource').length }));
  console.log(JSON.stringify({ load, fcp: Math.round(m.fcp), lcp: Math.round(m.lcp), lcpEl: m.el, cls: m.cls.toFixed(3), kb: Math.round(m.bytes / 1024), reqs: m.reqs }));
  await b.close();
})();
