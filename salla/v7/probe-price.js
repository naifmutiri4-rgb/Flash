// يقارن: سعر الخيار المكتوب، أسعار سلة اللي تتحدّث في الصفحة بعد الاختيار والعدد، وسعر السلة الفعلي بعد الإضافة
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 844 } }); const p = await ctx.newPage();
  const prices = () => p.evaluate(() => [...document.querySelectorAll('.total-price, .before-price, section.total, .sticky-product-bar [class*="price"]')].map(e => (e.className.toString().split(' ')[0]) + '=' + e.textContent.trim().replace(/\s+/g, ' ').slice(0, 30)).join(' | '));
  await p.goto('https://flashstore-ksa.com/مشاهدات-تيك-توك/p1591098480', { waitUntil: 'networkidle', timeout: 90000 });
  console.log('start  :', await prices());
  const l = await p.$$('.s-product-options-grid-mode label'); await l[2].click(); await p.waitForTimeout(2500);
  console.log('option :', await l[2].innerText(), '\n         ', await prices());
  await p.click('.sticky-product-bar .s-quantity-input-increase-button'); await p.waitForTimeout(2500);
  console.log('qty=2  :', await prices());
  const inp = await p.$('.s-product-options-text input, .s-product-options-text textarea'); if (inp) await inp.fill('https://www.tiktok.com/@flash/video/7300000000000000000');
  await p.click('.sticky-product-bar salla-add-product-button button.s-button-primary'); await p.waitForTimeout(3000);
  await p.goto('https://flashstore-ksa.com/cart', { waitUntil: 'networkidle', timeout: 90000 }); await p.waitForTimeout(1500);
  console.log('cart   :', await p.evaluate(() => [...document.querySelectorAll('.cart-item .item-price, .cart-item .item-total, .s-cart-summary-card-bar')].map(e => e.textContent.trim().replace(/\s+/g, ' ')).join(' | ')));
  await b.close();
})();
