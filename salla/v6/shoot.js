// يبني صفحة لكل اتجاه ويصوّر: الرئيسية، المنتج، السلة، الهيدر (Hero)، وصورة المنتج النموذجية
// الاستخدام: node shoot.js d1-live [d2-receipt ...]
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const out = path.join(__dirname, 'previews');
fs.mkdirSync(out, { recursive: true });
(async () => {
  const b = await chromium.launch();
  for (const id of process.argv.slice(2)) {
    const d = require('./' + id);
    const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=${d.font}&display=block" rel="stylesheet">
<style>*{box-sizing:border-box}button{font-family:inherit;cursor:pointer}a{color:inherit;text-decoration:none}.pimg svg{direction:ltr}${d.css}
.asset{width:max-content}</style></head><body>${d.body}<div class="asset">${d.asset}</div></body></html>`;
    fs.writeFileSync(path.join(out, id + '.html'), html);
    const p = await b.newPage({ viewport: { width: 640, height: 900 }, deviceScaleFactor: 2 });
    await p.setContent(html, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(300);
    for (const s of ['home', 'product', 'cart']) await p.locator('#' + s).screenshot({ path: path.join(out, `${id}-${s}.png`) });
    await p.locator('#hero').screenshot({ path: path.join(out, `${id}-hero.png`) });
    await p.locator('.asset > *').first().screenshot({ path: path.join(out, `${id}-product-image.png`) });
    const ox = await p.evaluate(() => [...document.querySelectorAll('.scr')].map(s => s.id + ':' + s.scrollWidth + 'x' + s.scrollHeight).join(' '));
    console.log(id, ox);
    await p.close();
  }
  await b.close();
})();
