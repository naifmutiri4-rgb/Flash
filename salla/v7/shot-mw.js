// يصوّر الجوال (390) مرتين: البانر الطولي الحالي، والبانر العريض لو انحط في الجوال (نسخة LIVE اللي في المتجر)
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..', 'docs', 'live');
const S = '/tmp/claude-0/-home-user/3415ab36-c530-53dc-99ff-5fe0e5e0e39f/scratchpad/';
const T = { html: 'text/html; charset=utf-8', css: 'text/css', webp: 'image/webp', woff2: 'font/woff2', woff: 'font/woff', ttf: 'font/ttf', svg: 'image/svg+xml', png: 'image/png' };
const srv = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': T[f.split('.').pop()] || 'application/octet-stream' }); r.end(d); }); }).listen(8771);
(async () => {
  const b = await chromium.launch();
  for (const mode of ['mw']) {
    const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
    await p.goto('http://localhost:8771/index.html', { waitUntil: 'networkidle' });
    await p.evaluate(mode => {
      const sec = document.querySelector('section.s-block--fixed-banner');
      const src = sec.querySelector('source'), img = sec.querySelector('img');
      if (mode === 'tall') { src.srcset = 'banner-m.webp'; }
      else { src.remove(); img.src = 'banner-mw.webp'; img.style.setProperty('aspect-ratio', '8/5', 'important'); }
    }, mode);
    await p.waitForTimeout(600); console.log(mode, await p.evaluate(() => { const s = document.querySelector('section.s-block--fixed-banner'); return [s, s.querySelector('.container'), s.querySelector('a'), s.querySelector('picture'), s.querySelector('img')].map(e => e.tagName + ' ' + JSON.stringify(e.getBoundingClientRect().toJSON(), ['x', 'width', 'height']) + ' ' + getComputedStyle(e).objectFit + ' ' + getComputedStyle(e).transform).join('\n'); }));
    await p.screenshot({ path: `${S}mob-${mode}.png` });
    await p.close();
  }
  await b.close(); srv.close();
})();
