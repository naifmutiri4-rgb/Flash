// يجرّب أزرار الشراء فعلياً مع/بدون CSS v4: يعبّي رابط المقطع، يضغط «أضف للسلة» ويشوف السلة،
// ثم يضغط «اشتر الآن» ويصوّر النافذة اللي تطلع (فيها Apple Pay في Safari الحقيقي).
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [url, css, out] = process.argv.slice(2);
  const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
  const b = await chromium.launch();
  for (const mode of ['before', 'after']) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, userAgent: UA, deviceScaleFactor: 2 });
    const p = await ctx.newPage();
    if (mode === 'after') await p.addInitScript(t => { const put = () => { if (document.head && !document.getElementById('fx-qa')) { const s = document.createElement('style'); s.id = 'fx-qa'; s.textContent = t; document.head.appendChild(s); return true; } }; if (!put()) new MutationObserver((m, o) => { if (put()) o.disconnect(); }).observe(document, { childList: true, subtree: true }); }, fs.readFileSync(css, 'utf8'));
    const api = [];
    p.on('response', r => { const u = r.url(); if (/cart|checkout|quick/.test(u) && u.includes('salla')) api.push(r.status() + ' ' + r.request().method() + ' ' + u.replace(/\?.*/, '').split('/').slice(-3).join('/')); });
    await p.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
    await p.waitForTimeout(1500);
    const opts = await p.$$('.s-product-options-grid-mode label'); if (opts[1]) await opts[1].click();
    const inp = await p.$('.s-product-options-text input, .s-product-options-text textarea');
    if (inp) await inp.fill('https://www.tiktok.com/@test/video/7300000000000000000');
    // 1) أضف للسلة
    const add = await p.$('.sticky-product-bar button.s-button-primary, .sticky-product-bar salla-add-product-button button');
    let addRes = 'no button';
    if (add) {
      const box = await add.boundingBox();
      await add.click({ timeout: 5000 }).then(() => addRes = 'clicked').catch(e => addRes = 'CLICK FAILED: ' + e.message.slice(0, 80));
      await p.waitForTimeout(3000);
      addRes += ' box=' + JSON.stringify(box && { w: Math.round(box.width), h: Math.round(box.height) });
    }
    const toast = await p.evaluate(() => [...document.querySelectorAll('.s-toast,[class*=toast],.swal2-popup')].map(e => e.textContent.trim().replace(/\s+/g, ' ')).filter(Boolean).slice(0, 1).join(''));
    // 2) اشتر الآن
    const buy = await p.$('salla-mini-checkout-widget, .s-add-product-button-mini-checkout');
    let buyRes = 'no widget';
    if (buy) {
      const box = await buy.boundingBox();
      await buy.click({ timeout: 5000 }).then(() => buyRes = 'clicked').catch(e => buyRes = 'CLICK FAILED: ' + e.message.slice(0, 80));
      await p.waitForTimeout(3500);
      buyRes += ' box=' + JSON.stringify(box && { w: Math.round(box.width), h: Math.round(box.height) });
    }
    const sheet = await p.evaluate(() => {
      const cand = [...document.querySelectorAll('.s-mini-checkout *, salla-mini-checkout-widget *, .s-modal-body, [class*=mini-checkout][class*=open], .s-drawer, .s-bottom-sheet')]
        .filter(e => { const r = e.getBoundingClientRect(); return r.width > 200 && r.height > 120; });
      const e = cand.sort((a, b) => b.getBoundingClientRect().height - a.getBoundingClientRect().height)[0];
      return e ? e.className.toString().slice(0, 80) + ' :: ' + e.innerText.trim().replace(/\s+/g, ' ').slice(0, 200) : 'no sheet found';
    });
    console.log('=====', mode, '\n add:', addRes, '| toast:', toast.slice(0, 60), '\n buy:', buyRes, '\n sheet:', sheet, '\n api:', api.slice(-8).join(' ; '));
    await p.screenshot({ path: `${out}-${mode}.png` });
    await ctx.close();
  }
  await b.close();
})();
