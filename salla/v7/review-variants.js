// يصوّر قسم آراء العملاء بأكثر من لون لفقاعة الرسالة (كلها من ألوان المتجر) + أسهم التنقل، ويجمعها في لوحة وحدة
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..', '..', 'docs', 'live');
const S = '/tmp/claude-0/-home-user/3415ab36-c530-53dc-99ff-5fe0e5e0e39f/scratchpad/rv/';
fs.mkdirSync(S, { recursive: true });
const T = { html: 'text/html; charset=utf-8', css: 'text/css', webp: 'image/webp', woff2: 'font/woff2', woff: 'font/woff', ttf: 'font/ttf', svg: 'image/svg+xml', png: 'image/png' };
const srv = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': T[f.split('.').pop()] || 'application/octet-stream' }); r.end(d); }); }).listen(8767);
const P = 'body#app.index .s-block--testimonials .swiper-slide p', TAIL = P + '::after', Q = 'body#app.index .s-block--testimonials .testimonial__icon';
const bubble = (bg, fg, tail, q, border = 'transparent') => `${P}{background:${bg}!important;color:${fg}!important;border:1px solid ${border}!important}${TAIL}{background:${tail}!important}${Q}{color:${q}!important}`;
// الأسهم: تظهر فوق يمين/يسار العنوان، دائرية، وحدة بيضاء ووحدة متدرّجة
const ARROWS = fs.readFileSync(path.join(__dirname, 'review-arrows.css'), 'utf8');
const V = {
  '1-gradient': ['تدرّج سماوي ← وردي', bubble('linear-gradient(135deg,#00E5D4,#FF3D7F)', '#0B0A12', '#FF3D7F', '#0B0A12')],
  '2-pink': ['وردي', bubble('#D41E5A', '#FFFFFF', '#D41E5A', '#FFFFFF')],
  '3-cyan': ['سماوي', bubble('#00E5D4', '#0B0A12', '#00E5D4', '#0B0A12')],
  '4-violet': ['بنفسجي', bubble('#2A1F52', '#FFFFFF', '#2A1F52', '#00E5D4')],
  '5-ink': ['داكن (الحالي)', ''],
};
(async () => {
  const b = await chromium.launch();
  const files = [];
  for (const [k, [label, css]] of Object.entries(V)) {
    const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
    await p.goto('http://localhost:8767/index.html', { waitUntil: 'networkidle' });
    await p.addStyleTag({ content: ARROWS + css });
    const t = await p.$('.s-block--testimonials'); await t.scrollIntoViewIfNeeded(); await p.waitForTimeout(200);
    const f = `${S}${k}.png`; await t.screenshot({ path: f }); files.push([f, label]);
    await p.close();
  }
  await b.close(); srv.close();
  // لوحة واحدة: كل خيار برقمه واسمه
  const tiles = files.map(([f, label], i) => { const o = `${S}tile-${i}.png`; execFileSync('convert', [f, '-resize', '390x', '-gravity', 'north', '-background', '#0B0A12', '-splice', '0x56', '-fill', '#FFFFFF', '-font', 'DejaVu-Sans-Bold', '-pointsize', '28', '-annotate', '+0+12', String(i + 1), o]); return o; });
  execFileSync('convert', [...tiles, '+append', `${S}sheet.png`]);
  console.log('ok', tiles.length);
})();
