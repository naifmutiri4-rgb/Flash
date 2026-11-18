// الرئيسية مع live.css + live.min.js على جوال متوسط: متى تختفي صفحة التحميل، وهل صارت مدة التقييم 5 ثواني
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const css = fs.readFileSync(path.join(__dirname, 'live.css'), 'utf8'), js = fs.readFileSync(path.join(__dirname, 'live.min.js'), 'utf8');
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' });
  await ctx.route(u => /themes\/customization\/.*\.(css|js)/.test(u.href), r => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  await ctx.addInitScript(t => { const put = () => { if (document.head && !document.getElementById('lv')) { const s = document.createElement('style'); s.id = 'lv'; s.textContent = t; document.head.appendChild(s); return true; } }; if (!put()) new MutationObserver((m, o) => { if (put()) o.disconnect(); }).observe(document, { childList: true, subtree: true }); }, css);
  await ctx.addInitScript(() => {
    window.__t = {};
    const tick = () => { const pl = document.getElementById('preloader'); if (pl) { if (!window.__t.shown) window.__t.shown = performance.now(); const o = +getComputedStyle(pl).opacity; if (o < 0.05 && !window.__t.invisible) window.__t.invisible = performance.now(); } if (!window.__t.invisible) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message.slice(0, 80)));
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024, uploadThroughput: 750 * 1024 / 8 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await p.goto('https://flashstore-ksa.com/', { waitUntil: 'load', timeout: 120000 });
  await p.addScriptTag({ content: js });
  await p.waitForTimeout(6000);
  const r = await p.evaluate(() => { const s = document.querySelector('.s-block--testimonials .swiper')?.swiper; return { shown: window.__t.shown, invisible: window.__t.invisible, delay: s?.params?.autoplay?.delay, speed: s?.params?.speed, running: s?.autoplay?.running }; });
  const f = x => x ? (x / 1000).toFixed(2) + 's' : '-';
  console.log(`loader shown ${f(r.shown)} → invisible ${f(r.invisible)} (visible for ${f(r.invisible - r.shown)}) | reviews delay=${r.delay}ms speed=${r.speed}ms autoplay=${r.running} | page errors: ${errs.length}`);
  await b.close();
})();
