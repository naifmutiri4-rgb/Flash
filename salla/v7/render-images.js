// يرسم صور المنتجات التسع بنظام «بث مباشر» (1000×1000 PNG، جاهزة للرفع على سلة) + صورة الهيدر للجوال
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const d1 = require('../v6/d1-live');
const { singles, packs } = require('../v6/data');
const OUT = path.join(__dirname, 'img');
fs.mkdirSync(OUT, { recursive: true });
const items = [...singles.map(s => [s.key, d1.pimg(s, 500)]), ...packs.map(p => [p.key, d1.pimgPack(p, 500)])];
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 600, height: 600 }, deviceScaleFactor: 2 });
  await p.setContent(`<!doctype html><html dir="rtl"><head><link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;700&display=block" rel="stylesheet">
<style>body{margin:0;background:#000}.pimg svg{direction:ltr;display:block}.item{width:500px}</style></head><body>${items.map(([k, h]) => `<div class="item" id="i-${k}">${h}</div>`).join('')}</body></html>`, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  for (const [k] of items) await p.locator('#i-' + k).screenshot({ path: path.join(OUT, k + '.png') });
  await b.close();
  console.log('rendered', items.map(i => i[0]).join(' '));
})();
