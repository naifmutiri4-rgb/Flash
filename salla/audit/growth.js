// يسجّل تغيّر ارتفاع كل قسم أثناء التحميل، عشان نعرف مين يكبر أو يصغر ويحرّك اللي تحته
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [url, css, w] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: +w || 390, height: 844 }, locale: 'ar-SA' });
  if (css && css !== '-') {
    const txt = fs.readFileSync(css, 'utf8');
    await p.addInitScript(t => { const s = document.createElement('style'); s.textContent = t; (document.head || document.documentElement).appendChild(s); }, txt);
  }
  await p.addInitScript(() => {
    window.__log = [];
    const key = e => e.tagName.toLowerCase() + '.' + [...e.classList].slice(0, 3).join('.');
    let last = {};
    const tick = () => {
      const els = document.querySelectorAll('header, .angel-ad, main > *, .main-content > *, section.s-block, footer, salla-products-list, .breadcrumbs, .cat-square-banner');
      els.forEach((e, i) => {
        const h = Math.round(e.getBoundingClientRect().height); const k = i + ':' + key(e);
        if (last[k] !== undefined && Math.abs(last[k] - h) > 4) window.__log.push(Math.round(performance.now()) + 'ms ' + k + ' ' + last[k] + '→' + h);
        last[k] = h;
      });
      if (performance.now() < 9000) setTimeout(tick, 50);
    };
    document.addEventListener('DOMContentLoaded', tick);
  });
  await p.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
  await p.waitForTimeout(3000);
  console.log((await p.evaluate(() => window.__log)).slice(0, 40).join('\n'));
  await b.close();
})();
