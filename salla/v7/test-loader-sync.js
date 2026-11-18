// يختبر إن شريط التحميل يتعبى مع تحميل الصفحة: يسجّل نسبة الشريط كل فريم، ووقت اكتمال الصفحة (load) ووقت الاختفاء
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const css = fs.readFileSync(path.join(__dirname, 'live.css'), 'utf8');
  const js = fs.readFileSync(path.join(__dirname, 'live.min.js'), 'utf8');
  const svg = fs.readFileSync(path.join(__dirname, '..', '..', 'docs', 'live', 'loader-static.svg'));
  const b = await chromium.launch();
  for (const [label, cpu, kbps] of [['جوال متوسط', 4, 1.6 * 1024], ['جوال سريع', 1, 10 * 1024]]) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' });
    await ctx.route(u => /themes\/customization\/.*\.(css|js)/.test(u.href), r => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
    await ctx.route(u => /Flash\/loader\.svg/.test(u.href), r => r.fulfill({ status: 200, contentType: 'image/svg+xml', body: svg }));
    await ctx.addInitScript(t => { const put = () => { if (document.head && !document.getElementById('lv')) { const s = document.createElement('style'); s.id = 'lv'; s.textContent = t; document.head.appendChild(s); return true; } }; if (!put()) new MutationObserver((m, o) => { if (put()) o.disconnect(); }).observe(document, { childList: true, subtree: true }); }, css);
    // كود سلة المخصص ينزل آخر الصفحة: نشغّله عند DOMContentLoaded
    await ctx.addInitScript(code => { document.addEventListener('DOMContentLoaded', () => { (0, eval)(code); }); }, js);
    await ctx.addInitScript(() => {
      window.__s = []; window.__ev = {};
      window.addEventListener('load', () => { window.__ev.load = performance.now(); });
      const tick = () => { const pl = document.getElementById('preloader'); if (pl) { const m = getComputedStyle(pl, '::after').transform.match(/matrix\(([^,]+)/); const op = +getComputedStyle(pl).opacity; window.__s.push([Math.round(performance.now()), m ? +(+m[1]).toFixed(2) : 0, op]); if (!window.__ev.shown) window.__ev.shown = performance.now(); if (op < .05 && !window.__ev.gone) window.__ev.gone = performance.now(); } else if (window.__ev.shown && !window.__ev.gone) window.__ev.gone = performance.now(); if (!window.__ev.gone) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
    const p = await ctx.newPage();
    const cdp = await ctx.newCDPSession(p);
    await cdp.send('Network.enable');
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: kbps * 1024 / 8 * 8, uploadThroughput: 750 * 1024 / 8 });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: cpu });
    await p.goto('https://flashstore-ksa.com/', { waitUntil: 'load', timeout: 120000 });
    await p.waitForTimeout(3000);
    const r = await p.evaluate(() => ({ s: window.__s, ev: window.__ev }));
    const f = x => (x / 1000).toFixed(2) + 's';
    const pick = r.s.filter((x, i) => i % Math.max(1, Math.floor(r.s.length / 10)) === 0).map(x => `${f(x[0])}:${Math.round(x[1] * 100)}%`).join(' ');
    console.log(`${label}: ظهرت ${f(r.ev.shown)} | الصفحة اكتملت ${f(r.ev.load)} | اختفت ${f(r.ev.gone)}\n  الشريط: ${pick}`);
    await ctx.close();
  }
  await b.close();
})();
