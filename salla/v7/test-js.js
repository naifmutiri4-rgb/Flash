// يختبر live.js + live.css على صفحة منتج حقيقية (في متصفح الاختبار فقط): تقسيم أزرار الكمية، سطر «اخترت»،
// السعر على زر السلة مع تغيير العدد، وإن الإضافة للسلة ما زالت تشتغل، وبدون أخطاء من كودنا. ويصوّر.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const S = '/tmp/claude-0/-home-user/3415ab36-c530-53dc-99ff-5fe0e5e0e39f/scratchpad/qa/';
(async () => {
  const css = fs.readFileSync(path.join(__dirname, 'live.css'), 'utf8');
  const js = fs.readFileSync(path.join(__dirname, 'live.js'), 'utf8');
  const b = await chromium.launch();
  for (const [name, url] of [['views', 'https://flashstore-ksa.com/مشاهدات-تيك-توك/p1591098480'], ['interact', 'https://flashstore-ksa.com/بكج-التفاعل/p1246605374']]) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: 'ar-SA', timezoneId: 'Asia/Riyadh' });
    await ctx.route(u => /themes\/customization\/.*\.(css|js)/.test(u.href), r => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
    await ctx.addInitScript(t => { const put = () => { if (document.head && !document.getElementById('lv')) { const s = document.createElement('style'); s.id = 'lv'; s.textContent = t; document.head.appendChild(s); return true; } }; if (!put()) new MutationObserver((m, o) => { if (put()) o.disconnect(); }).observe(document, { childList: true, subtree: true }); }, css);
    const p = await ctx.newPage(); const errs = [];
    p.on('pageerror', e => errs.push(e.stack ? e.stack.slice(0, 160) : e.message));
    await p.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
    await p.addScriptTag({ content: js });
    await p.waitForTimeout(500);
    const labels = await p.$$('.s-product-options-grid-mode label');
    if (labels[2]) await labels[2].click();
    await p.waitForTimeout(300);
    const r1 = await p.evaluate(() => ({ split: document.querySelectorAll('[data-lv-q]').length, sel: (document.querySelector('[data-lv-sel]') || {}).dataset?.lvSel, btn: document.querySelector('.sticky-product-bar salla-add-product-button button.s-button-primary')?.getAttribute('data-lv-total') }));
    const plus = await p.$('.sticky-product-bar .s-quantity-input-increase-button'); if (plus) { await plus.click(); await p.waitForTimeout(400); }
    const r2 = await p.evaluate(() => document.querySelector('.sticky-product-bar salla-add-product-button button.s-button-primary')?.getAttribute('data-lv-total'));
    const inp = await p.$('.s-product-options-text input, .s-product-options-text textarea'); if (inp) await inp.fill('https://www.tiktok.com/@flash/video/7300000000000000000');
    const box = await p.$('.s-product-options-option-container') || await p.$('.sticky-product-bar');
    await (await p.$('.product-single .main-content > .flex.flex-col')).scrollIntoViewIfNeeded();
    await p.evaluate(() => scrollBy(0, 220)); await p.waitForTimeout(300);
    await p.screenshot({ path: `${S}js-${name}.png` });
    await p.click('.sticky-product-bar salla-add-product-button button.s-button-primary'); await p.waitForTimeout(3000);
    const added = await p.evaluate(() => !!document.querySelector('.s-add-product-toast--visible'));
    const ours = errs.filter(e => /lvLive|data-lv|splitLabels|selectedOf/.test(e));
    console.log(name, JSON.stringify(r1), 'qty2:', r2, 'added:', added, 'ourErrors:', ours.length, ours[0] || '', '| otherErrors:', errs.length - ours.length);
    await ctx.close();
  }
  await b.close();
})();
