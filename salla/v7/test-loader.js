// يختبر صفحة التحميل الجديدة على الرئيسية (جوال متوسط): يصوّر لقطات أثناء التحميل، ويقيس مدة ظهورها
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const S = '/tmp/claude-0/-home-user/3415ab36-c530-53dc-99ff-5fe0e5e0e39f/scratchpad/ld/';
fs.mkdirSync(S, { recursive: true });
(async () => {
  const css = fs.readFileSync(path.join(__dirname, 'live.css'), 'utf8');
  const svg = fs.readFileSync(path.join(__dirname, '..', '..', 'docs', 'live', 'loader-static.svg'));
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' });
  await ctx.route(u => /themes\/customization\/.*\.(css|js)/.test(u.href), r => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  await ctx.route(u => /Flash\/loader\.svg/.test(u.href), r => r.fulfill({ status: 200, contentType: 'image/svg+xml', body: svg }));
  await ctx.addInitScript(t => { const put = () => { if (document.head && !document.getElementById('lv')) { const s = document.createElement('style'); s.id = 'lv'; s.textContent = t; document.head.appendChild(s); return true; } }; if (!put()) new MutationObserver((m, o) => { if (put()) o.disconnect(); }).observe(document, { childList: true, subtree: true }); }, css);
  await ctx.addInitScript(() => { window.__t = {}; const tick = () => { const pl = document.getElementById('preloader'); if (pl) { if (!window.__t.shown) window.__t.shown = performance.now(); if (+getComputedStyle(pl).opacity < .05 && !window.__t.gone) window.__t.gone = performance.now(); } if (!window.__t.gone) requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
  const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024, uploadThroughput: 750 * 1024 / 8 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  const nav = p.goto('https://flashstore-ksa.com/', { waitUntil: 'load', timeout: 120000 });
  await p.waitForSelector('#preloader', { timeout: 30000 });
  const shots = [];
  for (const ms of [250, 700, 1200]) { await p.waitForTimeout(ms === 250 ? 250 : 450); const f = `${S}f${ms}.png`; await p.screenshot({ path: f }).catch(() => {}); shots.push(f); }
  await nav; await p.waitForTimeout(2500);
  const t = await p.evaluate(() => window.__t);
  console.log(`loader visible ${((t.gone - t.shown) / 1000).toFixed(2)}s (shown ${(t.shown / 1000).toFixed(2)}s → gone ${(t.gone / 1000).toFixed(2)}s)`);
  await b.close();
})();
