// يرسم صورة الهيدر بدقة عالية (3x = 1170×1560) من تصميم «بث مباشر»، ويحفظ PNG و WebP عالي الجودة
const { chromium } = require('playwright');
const path = require('path');
const { execFileSync } = require('child_process');
const OUT = path.join(__dirname, '..', '..', 'docs', 'live');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 640, height: 900 }, deviceScaleFactor: 3 });
  await p.goto('file://' + path.join(__dirname, '..', 'v6', 'previews', 'd1-live.html'), { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(400);
  const png = path.join(OUT, 'hero.png');
  await p.locator('#hero').screenshot({ path: png });
  await b.close();
  execFileSync('python3', ['-c', "from PIL import Image;import sys;Image.open(sys.argv[1]).convert('RGB').save(sys.argv[2],'WEBP',quality=92,method=6)", png, path.join(OUT, 'hero.webp')]);
  console.log(execFileSync('identify', [png, path.join(OUT, 'hero.webp')]).toString());
})();
