// لقطة شاشة كمبيوتر (بدون صفحة كاملة) لصفحة المنتج مع CSS و JS، عشان نشوف شريط الشراء الثابت كما يظهر فعلاً
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const css = fs.readFileSync(path.join(__dirname, 'live.css'), 'utf8'), js = fs.readFileSync(path.join(__dirname, 'live.min.js'), 'utf8');
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
  await ctx.route(u => /themes\/customization\/.*\.(css|js)/.test(u.href), r => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  await ctx.addInitScript(t => { const put = () => { if (document.head && !document.getElementById('lv')) { const s = document.createElement('style'); s.id = 'lv'; s.textContent = t; document.head.appendChild(s); return true; } }; if (!put()) new MutationObserver((m, o) => { if (put()) o.disconnect(); }).observe(document, { childList: true, subtree: true }); }, css);
  await ctx.addInitScript(js);
  const p = await ctx.newPage();
  await p.goto('https://flashstore-ksa.com/مشاهدات-تيك-توك/p1591098480', { waitUntil: 'networkidle', timeout: 90000 });
  await (await p.$$('.s-product-options-grid-mode label'))[2].click();
  await p.evaluate(() => scrollTo(0, 700)); await p.waitForTimeout(800);
  await p.screenshot({ path: '/tmp/claude-0/-home-user/3415ab36-c530-53dc-99ff-5fe0e5e0e39f/scratchpad/qa/d-bar.png' });
  await b.close();
})();
