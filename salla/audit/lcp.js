// يقيس LCP ويحدد العنصر المسؤول عنه (مع حقن CSS اختياري في <head>)، على جوال مع إبطاء شبكة 4G تقريبي
const { chromium } = require('playwright');
const fs = require('fs');
const { execFileSync } = require('child_process');
(async () => {
  const [url, css, w] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: +w || 390, height: 844 } });
  if (css && css !== '-') {
    const txt = fs.readFileSync(css, 'utf8');
    await p.route(r => decodeURI(r) === decodeURI(url), async route => {
      const html = execFileSync('curl', ['-sL', url], { maxBuffer: 1 << 26 }).toString('utf8');
      await route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html.replace('</head>', `<style>${txt}</style></head>`) });
    });
  }
  const cdp = await p.context().newCDPSession(p);
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6e6 / 8 * 4, uploadThroughput: 750e3 / 8 * 4 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await p.addInitScript(() => {
    window.__lcp = [];
    new PerformanceObserver(l => { for (const e of l.getEntries()) { const n = e.element; window.__lcp.push(Math.round(e.startTime) + 'ms ' + (n ? n.tagName.toLowerCase() + '.' + [...n.classList].slice(0, 2).join('.') + ' "' + (n.textContent || n.currentSrc || '').trim().slice(0, 40) + '"' : '?') + ' size=' + e.size); } }).observe({ type: 'largest-contentful-paint', buffered: true });
  });
  await p.goto(url, { waitUntil: 'networkidle', timeout: 120000 });
  await p.waitForTimeout(2000);
  console.log((await p.evaluate(() => window.__lcp)).join('\n'));
  await b.close();
})();
