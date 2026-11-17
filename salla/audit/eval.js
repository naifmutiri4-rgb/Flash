// تقييم سرعة المتجر: جوال (390px)، شبكة 4G تقريبية (1.6Mbps×4، 150ms)، معالج أبطأ ×4.
// لكل صفحة: TTFB، FCP، LCP، CLS، مدة المهام الطويلة (TBT تقريبي)، عدد الطلبات، الحجم المنقول، حجم الجافاسكربت.
// الوضع: before = المتجر المنشور كما هو. after = نفس الصفحة + CSS v4 (يتحقن أول ما ينبني <head>).
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [url, mode, cssPath] = process.argv.slice(2);
  const css = mode === 'after' ? fs.readFileSync(cssPath, 'utf8') : '';
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  const cdp = await p.context().newCDPSession(p);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6e6 / 8 * 4, uploadThroughput: 750e3 / 8 * 4 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  const reqType = {}; let bytes = 0, js = 0, img = 0, n = 0;
  cdp.on('Network.responseReceived', e => { reqType[e.requestId] = e.type; });
  cdp.on('Network.loadingFinished', e => { n++; bytes += e.encodedDataLength; if (reqType[e.requestId] === 'Script') js += e.encodedDataLength; if (reqType[e.requestId] === 'Image') img += e.encodedDataLength; });
  if (css) await p.addInitScript(t => { const put = () => { if (document.head && !document.getElementById('fx-e')) { const s = document.createElement('style'); s.id = 'fx-e'; s.textContent = t; document.head.appendChild(s); return true; } }; if (!put()) new MutationObserver((m, o) => { if (put()) o.disconnect(); }).observe(document, { childList: true, subtree: true }); }, css);
  await p.addInitScript(() => {
    window.__m = { lcp: 0, lcpEl: '', cls: 0, tbt: 0, fcp: 0 };
    new PerformanceObserver(l => { for (const e of l.getEntries()) { window.__m.lcp = e.startTime; const n = e.element; window.__m.lcpEl = n ? n.tagName.toLowerCase() + ' ' + ((n.textContent || '').trim().slice(0, 25) || (n.currentSrc || '').split('/').pop().slice(0, 25)) : '?'; } }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__m.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver(l => { for (const e of l.getEntries()) window.__m.tbt += Math.max(0, e.duration - 50); }).observe({ type: 'longtask', buffered: true });
    new PerformanceObserver(l => { for (const e of l.getEntries()) if (e.name === 'first-contentful-paint') window.__m.fcp = e.startTime; }).observe({ type: 'paint', buffered: true });
  });
  await p.goto(url, { waitUntil: 'networkidle', timeout: 150000 });
  await p.waitForTimeout(2500);
  const m = await p.evaluate(() => ({ ...window.__m, ttfb: performance.getEntriesByType('navigation')[0].responseStart, injected: !!document.getElementById('fx-e') }));
  const kb = x => Math.round(x / 1024);
  console.log(JSON.stringify({ mode, ttfb: Math.round(m.ttfb), fcp: Math.round(m.fcp), lcp: Math.round(m.lcp), lcpEl: m.lcpEl, cls: +m.cls.toFixed(3), tbt: Math.round(m.tbt), requests: n, totalKB: kb(bytes), jsKB: kb(js), imgKB: kb(img), injected: m.injected }));
  await b.close();
})().catch(e => { console.log(JSON.stringify({ error: e.message.slice(0, 200) })); process.exit(0); });
