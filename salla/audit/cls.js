// يقيس تزحزح المحتوى (CLS) ويحدد مسبباته. لو انعطى ملف CSS، ينحقن داخل <head> في رد الصفحة نفسه
// (نفس مكان «CSS مخصص» في سلة)، عشان القياس يكون واقعي من أول رسم للصفحة.
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [url, css, w] = process.argv.slice(2);
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: +w || 390, height: 844 }, locale: 'ar-SA' });
  const p = await ctx.newPage();
  if (css && css !== '-') {
    const txt = fs.readFileSync(css, 'utf8');
    await p.route(r => r === url || decodeURI(r) === decodeURI(url), async route => {
      // route.fetch ما يمر على بروكسي البيئة، فنجيب الصفحة بـ curl
      const html = require('child_process').execFileSync('curl', ['-sL', url], { maxBuffer: 1 << 26 }).toString('utf8');
      const body = html.replace('</head>', `<style id="fx-test">${txt}</style></head>`);
      await route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body });
    });
  }
  await p.addInitScript(() => {
    window.__shifts = [];
    new PerformanceObserver(l => {
      for (const e of l.getEntries()) {
        if (e.hadRecentInput) continue;
        const src = (e.sources || []).map(s => { const n = s.node; if (!n || !n.tagName) return '?'; return n.tagName.toLowerCase() + (n.id ? '#' + n.id : '') + '.' + [...(n.classList || [])].slice(0, 3).join('.') + ' Δy=' + Math.round(s.currentRect.y - s.previousRect.y) + ' h' + Math.round(s.previousRect.height) + '→' + Math.round(s.currentRect.height); });
        window.__shifts.push({ v: +e.value.toFixed(3), t: Math.round(e.startTime), src });
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });
  await p.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
  await p.waitForTimeout(2500);
  const injected = await p.evaluate(() => !!document.getElementById('fx-test'));
  const s = await p.evaluate(() => window.__shifts);
  console.log('CLS total', s.reduce((a, x) => a + x.v, 0).toFixed(3), css && css !== '-' ? '(css injected: ' + injected + ')' : '(no css)');
  for (const x of s.sort((a, b) => b.v - a.v).slice(0, 6)) console.log(' ', x.v, x.t + 'ms', x.src.join(' | ').slice(0, 260));
  await b.close();
})();
