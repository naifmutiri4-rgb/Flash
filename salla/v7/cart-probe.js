// يضيف «مشاهدات 10,000» للسلة في متصفح الاختبار (سلة تجريبية في هذا المتصفح فقط، بدون دفع)،
// يفتح صفحة السلة مع live.css، يطبع بنيتها ويصوّرها.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const S = '/tmp/claude-0/-home-user/3415ab36-c530-53dc-99ff-5fe0e5e0e39f/scratchpad/';
(async () => {
  const css = fs.readFileSync(path.join(__dirname, 'live.css'), 'utf8');
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: 'ar-SA', timezoneId: 'Asia/Riyadh' });
  const p = await ctx.newPage();
  await p.route(u => /themes\/customization\/.*\.(css|js)/.test(u.href), r => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  await p.addInitScript(t => { const put = () => { if (document.head && !document.getElementById('lv')) { const s = document.createElement('style'); s.id = 'lv'; s.textContent = t; document.head.appendChild(s); return true; } }; if (!put()) new MutationObserver((m, o) => { if (put()) o.disconnect(); }).observe(document, { childList: true, subtree: true }); }, css);
  await p.goto('https://flashstore-ksa.com/مشاهدات-تيك-توك/p1591098480', { waitUntil: 'networkidle', timeout: 90000 });
  await (await p.$$('.s-product-options-grid-mode label'))[2].click();
  const inp = await p.$('.s-product-options-text input, .s-product-options-text textarea');
  if (inp) await inp.fill('https://www.tiktok.com/@flash/video/7300000000000000000');
  await p.click('.sticky-product-bar salla-add-product-button button.s-button-primary');
  await p.waitForTimeout(3500);
  await p.screenshot({ path: S + 'cart-toast.png' });
  await p.goto('https://flashstore-ksa.com/cart', { waitUntil: 'networkidle', timeout: 90000 });
  await p.waitForTimeout(2000);
  if (process.argv[2] === 'dump') console.log(await p.evaluate(() => { const m = document.querySelector('main') || document.body; return m.outerHTML.replace(/\s+/g, ' ').replace(/<svg.*?<\/svg>/g, '<svg/>').replace(/<!---->/g, '').split('cart:start')[1].slice(0, 9000); }));
  console.log('ox', await p.evaluate(() => document.documentElement.scrollWidth > innerWidth));
  await p.screenshot({ path: S + 'cart-page.png', fullPage: true });
  fs.writeFileSync(S + 'cart-state.json', JSON.stringify(await ctx.storageState()));
  await b.close();
})().catch(e => { console.log('ERR', e.message); process.exit(1); });
