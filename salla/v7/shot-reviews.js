// يصوّر قسم آراء العملاء في الرئيسية وتقييمات صفحة المنتج من معاينة docs/live
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..', 'docs', 'live');
const S = '/tmp/claude-0/-home-user/3415ab36-c530-53dc-99ff-5fe0e5e0e39f/scratchpad/';
const T = { html: 'text/html; charset=utf-8', css: 'text/css', webp: 'image/webp', woff2: 'font/woff2', woff: 'font/woff', ttf: 'font/ttf', svg: 'image/svg+xml', png: 'image/png' };
const srv = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': T[f.split('.').pop()] || 'application/octet-stream' }); r.end(d); }); }).listen(8766);
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await p.goto('http://localhost:8766/index.html', { waitUntil: 'networkidle' });
  const t = await p.$('.s-block--testimonials'); if (t) { await t.scrollIntoViewIfNeeded(); await t.screenshot({ path: S + 'rv-home.png' }); }
  await p.goto('http://localhost:8766/interact.html', { waitUntil: 'networkidle' });
  const c = await p.$('#product-tabs-faqs'); if (c) { await c.scrollIntoViewIfNeeded(); const y = await p.evaluate(e => e.getBoundingClientRect().top + scrollY, c); await p.screenshot({ path: S + 'rv-prod.png', fullPage: true, clip: { x: 0, y, width: 390, height: 900 } }); }
  await b.close(); srv.close();
})();
