// يفتح صفحات المعاينة محلياً بدون إنترنت (نفس قيود صفحة Artifact) ويصوّرها، ويجرب الضغط على كمية
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  for (const n of process.argv.slice(2)) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
    const blocked = new Set();
    await ctx.route(r => !r.href.startsWith('file:') && !r.href.startsWith('data:'), r => { blocked.add(new URL(r.request().url()).host); r.abort(); });
    const p = await ctx.newPage();
    const errs = [];
    p.on('pageerror', e => errs.push(e.message));
    await p.goto('file://' + path.join(__dirname, 'site', n + '.html'));
    await p.waitForTimeout(800);
    const l = await p.$$('.s-product-options-grid-mode label');
    if (l[2]) await l[2].click();
    const st = await p.evaluate(() => ({ h: document.body.scrollHeight, overflow: document.documentElement.scrollWidth > innerWidth, checked: document.querySelectorAll('.s-product-options-grid-mode input:checked').length, imgsBroken: [...document.images].filter(i => i.complete && !i.naturalWidth).length }));
    console.log(n, JSON.stringify(st), 'blocked:', [...blocked].join(','), errs.slice(0, 2).join(' | '));
    await p.screenshot({ path: path.join(__dirname, `chk-${n}.png`), fullPage: true });
    await ctx.close();
  }
  await b.close();
})();
