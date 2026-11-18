// يشغّل live.min.js على الرئيسية والتصنيف والسلة ويتأكد إنه ما يطلع أخطاء ولا يغيّر شي غير متوقع
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const js = fs.readFileSync(path.join(__dirname, 'live.min.js'), 'utf8');
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  for (const u of ['https://flashstore-ksa.com/', 'https://flashstore-ksa.com/التخفيضات/c779761984', 'https://flashstore-ksa.com/cart']) {
    const p = await ctx.newPage(); const errs = [];
    p.on('pageerror', e => errs.push(e.message.slice(0, 100)));
    await p.goto(u, { waitUntil: 'networkidle', timeout: 90000 });
    const before = errs.length;
    await p.addScriptTag({ content: js }); await p.waitForTimeout(2000);
    console.log(decodeURI(u).replace('https://flashstore-ksa.com', '') || '/', 'errors from our code:', errs.length - before, '| buy-now styled:', await p.evaluate(() => [...document.querySelectorAll('salla-mini-checkout-widget')].filter(w => w.shadowRoot && w.shadowRoot.querySelector('style[data-lv]')).length));
    await p.close();
  }
  await b.close();
})();
