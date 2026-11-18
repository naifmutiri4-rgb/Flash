// لقطة كمبيوتر (1280) وتابلت (820) لأول شاشة في معاينة الرئيسية، عشان نشوف البانر العريض
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..', 'docs', 'live');
const S = '/tmp/claude-0/-home-user/3415ab36-c530-53dc-99ff-5fe0e5e0e39f/scratchpad/';
const T = { html: 'text/html; charset=utf-8', css: 'text/css', webp: 'image/webp', woff2: 'font/woff2', woff: 'font/woff', ttf: 'font/ttf', svg: 'image/svg+xml', png: 'image/png' };
const srv = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]) === '/' ? 'index.html' : decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': T[f.split('.').pop()] || 'application/octet-stream' }); r.end(d); }); }).listen(8769);
(async () => {
  const b = await chromium.launch();
  for (const [w, h, n] of [[1280, 800, 'desk'], [820, 1180, 'tab']]) {
    const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    await p.goto('http://localhost:8769/index.html', { waitUntil: 'networkidle' });
    await p.waitForTimeout(500);
    await p.screenshot({ path: `${S}home-${n}.png` });
    await p.close();
  }
  await b.close(); srv.close();
})();
