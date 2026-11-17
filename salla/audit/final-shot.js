// لقطة «بعد»: صفحة حقيقية + CSS v4 داخل <head> + صور المنتجات الجديدة مكان القديمة (معاينة فقط، ما يتغير شي في المتجر)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const { execFileSync } = require('child_process');
const IMG = path.join(__dirname, '..', 'v4', 'img');
const MAP = { 1368006104: 'saver', 1949748553: 'saver-plus', 1246605374: 'interact', 950743674: 'gold', 651289082: 'explore', 1591098480: 'views', 767542597: 'likes', 904807258: 'shares', 2046465224: 'saves' };
(async () => {
  const [url, css, out, w, click] = process.argv.slice(2);
  const txt = fs.readFileSync(css, 'utf8');
  const imgs = Object.fromEntries(Object.entries(MAP).map(([id, s]) => [id, 'data:image/png;base64,' + fs.readFileSync(path.join(IMG, s + '.png')).toString('base64')]));
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: +w, height: 900 }, deviceScaleFactor: 1 });
  await p.route(r => decodeURI(r) === decodeURI(url), async route => {
    const html = execFileSync('curl', ['-sL', url], { maxBuffer: 1 << 26 }).toString('utf8');
    await route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html.replace('</head>', `<style>${txt}</style></head>`) });
  });
  await p.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
  await p.waitForTimeout(1500);
  if (click) { const l = await p.$$('.s-product-options-grid-mode label'); if (l[+click]) { await l[+click].click(); await p.waitForTimeout(800); } }
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise(r => setTimeout(r, 100)); } scrollTo(0, 0); });
  await p.evaluate(imgs => {
    const pid = (location.pathname.match(/p(\d+)$/) || [])[1];
    document.querySelectorAll('img').forEach(im => {
      const a = im.closest('a[href]'); const m = a && a.getAttribute('href').match(/p(\d+)$/);
      const id = m ? m[1] : (im.closest('.product-single .sidebar, .swiper, salla-slider') ? pid : null);
      if (id && imgs[id] && /cdn\.salla\.sa\/wGApz/.test(im.currentSrc || im.src)) { im.removeAttribute('srcset'); im.src = imgs[id]; }
    });
  }, imgs);
  await p.waitForTimeout(800);
  await p.screenshot({ path: out, fullPage: true });
  await b.close();
})();
