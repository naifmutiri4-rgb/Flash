// يقارن LCP و CLS للرئيسية: الكود الحالي في المتجر مقابل live.min.css الجديد (يستبدل ملف CSS المخصص في متصفح الاختبار فقط)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const css = fs.readFileSync(path.join(__dirname, 'live.min.css'), 'utf8');
  const b = await chromium.launch();
  for (const mode of ['current', 'new', 'current', 'new']) {
    const ctx = await b.newContext({ viewport: { width: 412, height: 823 }, deviceScaleFactor: 1.75, userAgent: 'Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36' });
    if (mode === 'new') await ctx.route(u => /themes\/customization\/.*\.css/.test(u.href), r => r.fulfill({ status: 200, contentType: 'text/css', body: css }));
    await ctx.addInitScript(() => {
      window.__cwv = { cls: 0, lcp: 0, el: '' };
      new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cwv.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver(l => { const e = l.getEntries().at(-1); window.__cwv.lcp = e.startTime; window.__cwv.el = (e.element && (e.element.tagName + '.' + (e.element.className || '').toString().slice(0, 30))) || e.url.slice(-40); }).observe({ type: 'largest-contentful-paint', buffered: true });
    });
    const p = await ctx.newPage();
    const cdp = await ctx.newCDPSession(p);
    await cdp.send('Network.enable');
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await p.goto('https://flashstore-ksa.com/?t=' + Date.now(), { waitUntil: 'load', timeout: 180000 });
    await p.waitForTimeout(6000);
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise(r => setTimeout(r, 150)); } });
    await p.waitForTimeout(1500);
    const r = await p.evaluate(() => window.__cwv);
    console.log(`${mode.padEnd(7)} LCP ${(r.lcp / 1000).toFixed(2)}s (${r.el}) | CLS ${r.cls.toFixed(3)}`);
    await ctx.close();
  }
  await b.close();
})();
