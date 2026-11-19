const { chromium, devices } = require('playwright');
(async () => {
  const b = await chromium.launch();
  for (const [n, o] of [['m', { ...devices['iPhone 13'] }], ['d', { viewport: { width: 1366, height: 900 } }]]) {
    const c = await b.newContext(o); const p = await c.newPage();
    await p.goto('file://' + __dirname + '/../../docs/live/home-preview/index.html', { waitUntil: 'networkidle', timeout: 90000 });
    await p.waitForTimeout(1500);
    const r = await p.evaluate(() => ({ banners: [...document.querySelectorAll('section.s-block--fixed-banner img')].map(i => (i.currentSrc||i.src).split('/').pop() + ' ' + i.naturalWidth), steps: !!document.querySelector('section[component-id="1555484643"]') && getComputedStyle(document.querySelector('section[component-id="1555484643"]')).display, broken: [...document.images].filter(i => i.complete && !i.naturalWidth).length, h: document.body.scrollHeight }));
    console.log(n, JSON.stringify(r));
    await p.screenshot({ path: `out7/prev-${n}.png`, fullPage: true }); await c.close();
  }
  await b.close();
})();
