// يطبع كلاسات ملخص السلة والكوبون وزر إتمام الطلب (بعد إضافة منتج تجريبي)
const { chromium } = require('playwright');
const fs = require('fs');
const S = '/tmp/claude-0/-home-user/3415ab36-c530-53dc-99ff-5fe0e5e0e39f/scratchpad/';
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, storageState: S + 'cart-state.json' });
  const p = await ctx.newPage();
  await p.goto('https://flashstore-ksa.com/cart', { waitUntil: 'networkidle', timeout: 90000 });
  await p.waitForTimeout(1500);
  console.log(await p.evaluate(() => {
    const btn = [...document.querySelectorAll('button,a')].find(e => /إتمام الطلب/.test(e.innerText)); const keep = []; let e = btn; for (let i = 0; e && i < 9; i++, e = e.parentElement) keep.push(e); const tot = [...document.querySelectorAll('*')].filter(x => x.children.length < 3 && /الإجمالي/.test(x.innerText || '')); keep.push(...tot.slice(0, 6));
    return [...new Set(keep.map(e => `${e.tagName.toLowerCase()}#${e.id}.${e.className.toString().trim().replace(/\s+/g, '.').slice(0, 110)} :: ${(e.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 40)}`))].slice(0, 45).join('\n');
  }));
  await b.close();
})();
