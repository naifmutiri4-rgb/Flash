// معاينة محلية فقط: يفتح صفحة المنتج الحقيقية، يوقف CSS المخصص الحالي، يحقن live.css داخل المتصفح هذا فقط،
// يعرض الأسعار بالريال (بدل الدولار اللي تطلع لمتصفح خارج السعودية)، يختار كمية ويعبّي الرابط، ويصوّر.
// لا يحفظ أي شي في سلة.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const SAR = { 1591098480: [4.99, 7.99, 12.99, 39.99, 79.99, 119.99, 199.99, 419.99, 789.99] };
(async () => {
  const [url, out, pick = '2', img] = process.argv.slice(2);
  const css = fs.readFileSync(path.join(__dirname, 'live.css'), 'utf8');
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: 'ar-SA',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' });
  const p = await ctx.newPage();
  await p.route(u => /themes\/customization\/.*\.css/.test(u.href), r => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  const errors = [];
  p.on('pageerror', e => errors.push(e.message.slice(0, 120)));
  await p.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
  await p.addStyleTag({ content: css });
  const pid = (url.match(/p(\d+)/) || [])[1];
  await p.evaluate(([prices, imgData]) => {
    const fmt = x => x.toFixed(2) + ' ر.س';
    if (prices) document.querySelectorAll('.s-product-options-grid-mode-span').forEach((s, i) => { if (prices[i] != null) s.textContent = s.textContent.replace(/\([^)]*\)/, '(' + fmt(prices[i]) + ')'); });
    document.querySelectorAll('.total-price,.before-price,.s-cart-summary-total').forEach(e => { e.textContent = e.textContent.replace(/\$/g, 'ر.س'); });
    if (imgData) document.querySelectorAll('.product-single .sidebar img').forEach(i => { i.src = imgData; i.srcset = ''; });
  }, [SAR[pid], img ? 'data:image/png;base64,' + fs.readFileSync(img).toString('base64') : null]);
  const labels = await p.$$('.s-product-options-grid-mode label');
  if (labels[+pick]) await labels[+pick].click();
  const inp = await p.$('.s-product-options-text input, .s-product-options-text textarea');
  if (inp) await inp.fill('https://www.tiktok.com/@flash/video/7300000000000000000');
  await p.evaluate(() => document.activeElement && document.activeElement.blur());
  await p.waitForTimeout(600);
  const info = await p.evaluate(() => ({
    overflowX: document.documentElement.scrollWidth > innerWidth,
    fill: getComputedStyle(document.querySelector('.s-product-options-grid-mode') || document.body).getPropertyValue('--lv-p'),
  }));
  console.log(JSON.stringify(info), errors.length ? 'JS errors: ' + errors.join(' | ') : 'no JS errors');
  const main = await p.$('.product-single .main-content');
  const top = await p.evaluate(() => scrollY + document.querySelector('.product-single .sidebar').getBoundingClientRect().top - 70);
  const bottom = await p.evaluate(() => { const a = document.querySelector('article.full-description'); return scrollY + a.getBoundingClientRect().bottom + 16; });
  await p.screenshot({ path: out.replace('.png', '-sticky.png') });
  await p.addStyleTag({ content: '.sticky-product-bar{position:static!important;transform:none!important}' });
  await p.waitForTimeout(300);
  const bottom2 = await p.evaluate(() => { const a = document.querySelector('article.full-description'); return scrollY + a.getBoundingClientRect().bottom + 16; });
  await p.screenshot({ path: out, fullPage: true, clip: { x: 0, y: 0, width: 390, height: Math.ceil(bottom2) } });
  await b.close();
})();
