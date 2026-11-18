// يسوي GIF لصفحة التحميل: نفس عناصر ملاك (#preloader + زر تخطي + الصورة) مع الـ CSS حقنا، لقطة كل 80ms من الحركة
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const { execFileSync } = require('child_process');
const S = '/tmp/claude-0/-home-user/3415ab36-c530-53dc-99ff-5fe0e5e0e39f/scratchpad/gif/';
fs.mkdirSync(S, { recursive: true });
(async () => {
  const css = fs.readFileSync(path.join(__dirname, 'live.css'), 'utf8');
  const svg = fs.readFileSync(path.join(__dirname, '..', '..', 'docs', 'live', 'loader-static.svg')).toString('base64');
  const html = `<!doctype html><html dir="rtl"><head><link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@700&display=block" rel="stylesheet"><style>
body{margin:0;font-family:'IBM Plex Sans Arabic'}#preloader{position:fixed;inset:0;z-index:99}
.preloader-skip{position:absolute;top:16px;left:16px;background:#ffffff14;color:#fff;border:1px solid #ffffff33;border-radius:999px;padding:6px 14px;font:700 13px 'IBM Plex Sans Arabic'}
${css}</style></head><body id="app" class="index"><div id="preloader"><button class="preloader-skip" type="button">تخطي</button><img class="preloader" src="data:image/svg+xml;base64,${svg}" width="180"></div></body></html>`;
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 640 }, deviceScaleFactor: 1 });
  await p.setContent(html, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() => document.getAnimations().forEach(a => a.pause()));
  const frames = [];
  for (let t = 0, i = 0; t <= 2300; t += 80, i++) {
    await p.evaluate(ms => document.getAnimations().forEach(a => { a.currentTime = ms; }), t);
    const f = `${S}f${String(i).padStart(3, '0')}.png`; await p.screenshot({ path: f }); frames.push(f);
  }
  await b.close();
  execFileSync('convert', ['-delay', '8', '-loop', '0', ...frames, '-layers', 'Optimize', `${S}loader.gif`]);
  execFileSync('convert', [frames[0], frames[8], frames[15], frames[22], '+append', '-resize', '50%', `${S}strip.png`]);
  console.log('frames', frames.length);
})();
