// يصوّر شريط الثقة (.lv-trust) من معاينة docs/live
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..', 'docs', 'live');
const T = { html: 'text/html; charset=utf-8', css: 'text/css', webp: 'image/webp', woff2: 'font/woff2', woff: 'font/woff', ttf: 'font/ttf', svg: 'image/svg+xml', png: 'image/png' };
const srv = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': T[f.split('.').pop()] || 'application/octet-stream' }); r.end(d); }); }).listen(8768);
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
  await p.goto('http://localhost:8768/index.html', { waitUntil: 'networkidle' });
  const t = await p.$('.lv-trust'); await t.scrollIntoViewIfNeeded();
  await t.screenshot({ path: '/tmp/claude-0/-home-user/3415ab36-c530-53dc-99ff-5fe0e5e0e39f/scratchpad/trust.png' });
  await b.close(); srv.close();
})();
