// يفتح صفحات docs/live من سيرفر محلي ويصوّرها (جوال) ويتأكد: بدون تمرير أفقي، الصور تحمّلت، الكميات تنضغط
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..', 'docs', 'live');
const S = '/tmp/claude-0/-home-user/3415ab36-c530-53dc-99ff-5fe0e5e0e39f/scratchpad/';
const T = { html: 'text/html; charset=utf-8', css: 'text/css', webp: 'image/webp', woff2: 'font/woff2', woff: 'font/woff', ttf: 'font/ttf', svg: 'image/svg+xml', png: 'image/png' };
const srv = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]) === '/' ? 'index.html' : decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': T[f.split('.').pop()] || 'application/octet-stream' }); r.end(d); }); }).listen(8765);
(async () => {
  const b = await chromium.launch();
  for (const pg of (process.argv[2] || 'index,views,interact').split(',')) {
    const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
    await p.goto('http://localhost:8765/' + pg + '.html', { waitUntil: 'networkidle' });
    const l = await p.$$('.s-product-options-grid-mode label'); if (l[2]) await l[2].click();
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } scrollTo(0, 0); });
    await p.waitForTimeout(500);
    const info = await p.evaluate(() => ({ ox: document.documentElement.scrollWidth > innerWidth, broken: [...document.images].filter(i => i.complete && !i.naturalWidth).length, h: document.body.scrollHeight }));
    console.log(pg, JSON.stringify(info));
    await p.addStyleTag({ content: '.sticky-product-bar{position:static!important}' });
    await p.screenshot({ path: S + 'site-' + pg + '.png', fullPage: true });
    await p.close();
  }
  await b.close(); srv.close();
})();
