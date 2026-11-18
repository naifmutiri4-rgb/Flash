// يقيس متى تختفي صفحة التحميل (#preloader) في الرئيسية على جوال متوسط (4G + معالج أبطأ ×4)، ومتى يبدأ كود ملاك
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  for (let run = 1; run <= 2; run++) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' });
    const p = await ctx.newPage();
    const cdp = await ctx.newCDPSession(p);
    await cdp.send('Network.enable');
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8 * 5, uploadThroughput: 750 * 1024 / 8 });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await p.addInitScript(() => {
      window.__t = {};
      new MutationObserver(() => {
        const pl = document.getElementById('preloader');
        if (pl && !window.__t.shown) window.__t.shown = performance.now();
        if (pl && pl.getAttribute('loading-animation') && !window.__t.fade) window.__t.fade = performance.now();
        if (window.__t.shown && !pl && !window.__t.gone) window.__t.gone = performance.now();
      }).observe(document, { childList: true, subtree: true, attributes: true, attributeFilter: ['loading-animation'] });
      document.addEventListener('DOMContentLoaded', () => { window.__t.dcl = performance.now(); });
    });
    await p.goto('https://flashstore-ksa.com/', { waitUntil: 'load', timeout: 120000 });
    await p.waitForFunction(() => window.__t.gone, null, { timeout: 30000 }).catch(() => {});
    const t = await p.evaluate(() => ({ ...window.__t, load: performance.timing.loadEventStart - performance.timing.navigationStart }));
    const f = x => x ? (x / 1000).toFixed(2) + 's' : '-';
    console.log(`run ${run}: loader shown ${f(t.shown)} | DOM ready ${f(t.dcl)} | fade starts ${f(t.fade)} | loader gone ${f(t.gone)} | page load ${f(t.load)}`);
    await ctx.close();
  }
  await b.close();
})();
