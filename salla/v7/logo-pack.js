// حزمة شعار فلاش ستور «بث مباشر»: الشعار الكامل (نص أبيض / نص داكن)، صورة واتساب، أيقونة التبويب بكل المقاسات
// المخرجات: docs/live/brand/
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const { execFileSync } = require('child_process');
const OUT = path.join(__dirname, '..', '..', 'docs', 'live', 'brand');
fs.mkdirSync(OUT, { recursive: true });
const mark = (s, id) => `
<svg viewBox="0 0 120 120" width="${s}" height="${s}">
  <defs><linearGradient id="lg${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#00E5D4"/><stop offset="1" stop-color="#FF3D7F"/></linearGradient></defs>
  <rect x="4" y="4" width="112" height="112" rx="32" fill="url(#lg${id})"/>
  <rect x="4" y="4" width="112" height="56" rx="32" fill="#fff" opacity=".12"/>
  <path d="M66 18 32 66h24l-6 36 36-50H62l4-34Z" fill="#0B0A12" stroke="#0B0A12" stroke-width="3" stroke-linejoin="round"/>
  <circle cx="96" cy="24" r="9" fill="#fff"/><circle cx="96" cy="24" r="5" fill="#FF3D7F"/>
</svg>`;
const lockup = (id, txt) => `<div id="${id}" class="lock">${mark(112, id)}<div class="t"><b style="color:${txt}">فلاش ستور</b><small>FLASH STORE</small></div></div>`;
const html = `<!doctype html><html dir="rtl"><head>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@700&family=Space+Grotesk:wght@700&display=block" rel="stylesheet">
<style>body{margin:0;background:transparent}
.lock{display:inline-flex;align-items:center;gap:18px;padding:10px 14px}
.t{display:flex;flex-direction:column;line-height:1}
.t b{font:700 64px 'IBM Plex Sans Arabic';letter-spacing:-.5px}
.t small{font:700 17px 'Space Grotesk';letter-spacing:7.5px;margin-top:8px;background:linear-gradient(90deg,#FF3D7F,#00E5D4);-webkit-background-clip:text;color:transparent;direction:ltr;text-align:right}
.sq{display:grid;place-items:center}
#wa{width:640px;height:640px;background:radial-gradient(420px 420px at 30% 25%,#2A1F52,#0B0A12 70%)}
#wa .in{display:grid;justify-items:center;gap:22px}
#wa b{font:700 46px 'IBM Plex Sans Arabic';color:#fff}
#fav{width:512px;height:512px;background:transparent}
#banner{width:1200px;height:630px;background:radial-gradient(520px 420px at 80% 20%,rgba(255,61,127,.35),transparent 70%),radial-gradient(520px 420px at 15% 85%,rgba(0,229,212,.28),transparent 70%),#0B0A12;display:grid;place-items:center}
#banner .lock{transform:scale(1.7)}
</style></head><body>
${lockup('onDark', '#FFFFFF')}
${lockup('onLight', '#0B0A12')}
<div id="wa" class="sq"><div class="in">${mark(330, 'wa')}<b>فلاش ستور</b></div></div>
<div id="fav" class="sq">${mark(512, 'fav')}</div>
<div id="banner">${lockup('bn', '#FFFFFF').replace('id="bn"', 'id="bnl"').replace(/width="112" height="112"/, 'width="150" height="150"')}</div>
</body></html>`;
(async () => {
  const b = await chromium.launch();
  const shot = async (sel, file, dpr, bg) => {
    const p = await b.newPage({ viewport: { width: 1300, height: 900 }, deviceScaleFactor: dpr });
    await p.setContent(html, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready);
    if (bg) await p.evaluate(c => { document.body.style.background = c; }, bg);
    await p.locator(sel).screenshot({ path: path.join(OUT, file), omitBackground: !bg });
    await p.close();
  };
  await shot('#onDark', 'logo-white-text.png', 4);           // للخلفيات الداكنة (هيدر المتجر)
  await shot('#onLight', 'logo-dark-text.png', 4);           // للخلفيات الفاتحة (الفواتير، الإيميلات، شعار سلة)
  await shot('#wa', 'whatsapp-profile.png', 1.6);            // 1024×1024 صورة واتساب (الدائرة تقص الأطراف بأمان)
  await shot('#fav', 'favicon-512.png', 1);                  // علامة التبويب الكبيرة
  await shot('#banner', 'share-banner.png', 1);              // صورة المشاركة 1200×630 (روابط واتساب وتويتر)
  await shot('#onDark', 'preview-on-dark.png', 2, '#0B0A12');
  await b.close();
  const fav = path.join(OUT, 'favicon-512.png');
  for (const s of [192, 180, 64, 32, 16]) execFileSync('convert', [fav, '-resize', `${s}x${s}`, path.join(OUT, `favicon-${s}.png`)]);
  execFileSync('convert', [fav, '-define', 'icon:auto-resize=64,48,32,16', path.join(OUT, 'favicon.ico')]);
  console.log(execFileSync('identify', fs.readdirSync(OUT).filter(f => /\.(png|ico)$/.test(f)).map(f => path.join(OUT, f))).toString().replace(new RegExp(OUT + '/', 'g'), ''));
})();
