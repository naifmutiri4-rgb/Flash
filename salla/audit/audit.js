const { chromium } = require('playwright');
const OUT = __dirname;
const pages = {
  home: 'https://flashstore-ksa.com/',
  cat: 'https://flashstore-ksa.com/الرئيسية/c907979757',
  pack: 'https://flashstore-ksa.com/بكج-التفاعل/p1246605374',
  single: 'https://flashstore-ksa.com/لايكات-تيك-توك/p767542597',
};
(async () => {
  const b = await chromium.launch();
  for (const [vpName, vp] of [['m', { width: 390, height: 844 }], ['d', { width: 1440, height: 900 }]]) {
    for (const [k, url] of Object.entries(pages)) {
      if (vpName === 'd' && k === 'cat') continue;
      const ctx = await b.newContext({ viewport: vp, locale: 'ar-SA', timezoneId: 'Asia/Riyadh' });
      const p = await ctx.newPage();
      let bytes = 0, reqs = 0; const errs = []; const hosts = {};
      p.on('response', async r => { reqs++; const h = new URL(r.url()).host; hosts[h] = (hosts[h] || 0) + 1; try { const l = +(r.headers()['content-length'] || 0); bytes += l; } catch {} });
      p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 120)); });
      await p.addInitScript(() => {
        window.__lcp = 0; window.__cls = 0;
        new PerformanceObserver(l => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
        new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
      });
      const t0 = Date.now();
      await p.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
      const load = Date.now() - t0;
      await p.waitForTimeout(2000);
      const info = await p.evaluate(() => {
        const nav = performance.getEntriesByType('navigation')[0];
        const res = performance.getEntriesByType('resource');
        const by = {}; let tot = 0;
        for (const r of res) { const t = r.initiatorType; by[t] = (by[t] || 0) + (r.transferSize || 0); tot += r.transferSize || 0; }
        const imgs = [...document.images].map(i => ({ s: i.currentSrc.split('/').pop().slice(0, 40), nw: i.naturalWidth, w: i.clientWidth, lazy: i.loading })).filter(i => i.w > 0);
        const secs = [...document.querySelectorAll('main > *, .home-wrapper > *, section')].slice(0, 40).map(s => (s.tagName + '.' + [...s.classList].slice(0, 2).join('.') + ' "' + (s.querySelector('h1,h2,h3')?.textContent.trim().slice(0, 40) || '') + '"'));
        const links = [...document.querySelectorAll('header a, nav a, .main-menu a')].map(a => a.textContent.trim().replace(/\s+/g, ' ').slice(0, 30)).filter(Boolean);
        const prices = [...document.querySelectorAll('.s-product-card-price, .s-product-card-sale-price, .price, .total-price')].slice(0, 12).map(e => e.textContent.trim().replace(/\s+/g, ' ').slice(0, 40));
        const overflowX = document.documentElement.scrollWidth > innerWidth;
        const tiny = [...document.querySelectorAll('a,button')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && (r.height < 32 || r.width < 32); }).length;
        return { ttfb: Math.round(nav.responseStart), dcl: Math.round(nav.domContentLoadedEventEnd), loadEv: Math.round(nav.loadEventEnd), lcp: Math.round(window.__lcp), cls: +window.__cls.toFixed(3), transferKB: Math.round(tot / 1024), byTypeKB: Object.fromEntries(Object.entries(by).map(([k, v]) => [k, Math.round(v / 1024)])), nres: res.length, imgs: imgs.slice(0, 15), docH: document.documentElement.scrollHeight, secs, links: [...new Set(links)].slice(0, 30), prices, overflowX, tinyTargets: tiny, title: document.title, h1: document.querySelector('h1')?.textContent.trim().slice(0, 60) };
      });
      info.load = load; info.errs = errs.slice(0, 8); info.hosts = hosts;
      console.log('=====', vpName, k, JSON.stringify(info, null, 0));
      await p.screenshot({ path: `${OUT}/${vpName}-${k}.png`, fullPage: true });
      await ctx.close();
    }
  }
  await b.close();
})().catch(e => { console.log('ERR', e.message); process.exit(1); });
