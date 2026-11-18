// شعار «بث مباشر»: مربع متدرّج (سماوي ← وردي) فيه برق داكن ونقطة «لايف»، + «فلاش ستور» أبيض، + FLASH STORE صغير
// يطلع PNG بخلفية شفافة (للهيدر الداكن) + نسخة مربعة للأيقونة/التطبيق
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', '..', 'docs', 'live');
const mark = (s) => `
<svg viewBox="0 0 120 120" width="${s}" height="${s}">
  <defs><linearGradient id="lg${s}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#00E5D4"/><stop offset="1" stop-color="#FF3D7F"/></linearGradient></defs>
  <rect x="4" y="4" width="112" height="112" rx="32" fill="url(#lg${s})"/>
  <rect x="4" y="4" width="112" height="56" rx="32" fill="#fff" opacity=".12"/>
  <path d="M66 18 32 66h24l-6 36 36-50H62l4-34Z" fill="#0B0A12" stroke="#0B0A12" stroke-width="3" stroke-linejoin="round"/>
  <circle cx="96" cy="24" r="9" fill="#fff"/><circle cx="96" cy="24" r="5" fill="#FF3D7F"/>
</svg>`;
const html = `<!doctype html><html dir="rtl"><head>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@700&family=Space+Grotesk:wght@700&display=block" rel="stylesheet">
<style>body{margin:0;background:transparent}
#logo{display:inline-flex;align-items:center;gap:18px;padding:10px 14px}
#logo .t{display:flex;flex-direction:column;line-height:1}
#logo b{font:700 64px 'IBM Plex Sans Arabic';color:#fff;letter-spacing:-.5px}
#logo small{font:700 17px 'Space Grotesk';letter-spacing:7.5px;margin-top:8px;background:linear-gradient(90deg,#FF3D7F,#00E5D4);-webkit-background-clip:text;color:transparent;direction:ltr;text-align:right}
#icon{width:512px;height:512px;display:grid;place-items:center;background:#0B0A12}
</style></head><body>
<div id="logo">${mark(112)}<div class="t"><b>فلاش ستور</b><small>FLASH STORE</small></div></div>
<div id="icon">${mark(400)}</div>
</body></html>`;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 900, height: 800 }, deviceScaleFactor: 2 });
  await p.setContent(html, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.locator('#logo').screenshot({ path: path.join(OUT, 'logo.png'), omitBackground: true });
  await p.setViewportSize({ width: 900, height: 800 });
  const pi = await b.newPage({ viewport: { width: 512, height: 512 }, deviceScaleFactor: 1 });
  await pi.setContent(html, { waitUntil: 'networkidle' }); await pi.evaluate(() => document.fonts.ready);
  await pi.locator('#icon').screenshot({ path: path.join(OUT, 'logo-icon.png') });
  // معاينة على خلفية الهيدر
  await p.evaluate(() => { document.body.style.background = '#0B0A12'; });
  await p.locator('#logo').screenshot({ path: '/tmp/claude-0/-home-user/3415ab36-c530-53dc-99ff-5fe0e5e0e39f/scratchpad/logo-on-dark.png' });
  await b.close();
})();
