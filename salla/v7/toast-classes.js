// يطبع كلاسات نافذة «تمت الإضافة إلى سلة المشتريات» بعد الإضافة
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  await p.goto('https://flashstore-ksa.com/مشاهدات-تيك-توك/p1591098480', { waitUntil: 'networkidle', timeout: 90000 });
  await (await p.$$('.s-product-options-grid-mode label'))[2].click();
  const inp = await p.$('.s-product-options-text input, .s-product-options-text textarea'); if (inp) await inp.fill('https://www.tiktok.com/@flash/video/7300000000000000000');
  await p.click('.sticky-product-bar salla-add-product-button button.s-button-primary'); await p.waitForTimeout(3000);
  console.log(await p.evaluate(() => {
    const t = [...document.querySelectorAll('*')].filter(e => /تمت الإضافة/.test(e.textContent || '') && e.getBoundingClientRect().height > 0).sort((a, b) => a.textContent.length - b.textContent.length)[0];
    const o = []; let e = t; for (let i = 0; e && i < 10; i++, e = e.parentElement) o.push(e.tagName.toLowerCase() + '.' + e.className.toString().trim().replace(/\s+/g, '.').slice(0, 120));
    return o.join('\n');
  }));
  await b.close();
})();
