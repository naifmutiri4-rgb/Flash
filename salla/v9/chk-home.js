const { chromium, devices } = require('playwright');
(async () => {
  const b = await chromium.launch();
  for (const [n, ctxo] of [['m', { ...devices['iPhone 13'] }], ['d', { viewport: { width: 1366, height: 900 } }]]) {
    const ctx = await b.newContext(ctxo); const p = await ctx.newPage();
    await p.goto('https://flashstore-ksa.com/?nocache=' + Date.now(), { waitUntil: 'networkidle', timeout: 90000 });
    for (let y = 0; y < 12000; y += 600) { await p.evaluate(y => scrollTo(0, y), y); await p.waitForTimeout(250); }
    await p.waitForTimeout(1500);
    const r = await p.evaluate(() => [...document.querySelectorAll('section.s-block--fixed-banner, section[class*=fixed-banner]')].map(s => { const i = s.querySelector('img'); return i ? (i.currentSrc || i.src).split('/').pop() + ' ' + i.naturalWidth + 'x' + i.naturalHeight + ' shown ' + Math.round(i.getBoundingClientRect().width) + 'x' + Math.round(i.getBoundingClientRect().height) : 'noimg'; }));
    console.log(n, JSON.stringify(r, null, 1));
    await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(500);
    await p.screenshot({ path: `out7/home-${n}.png`, fullPage: true });
    await ctx.close();
  }
  await b.close();
})();
