const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 800, height: 1600 }, deviceScaleFactor: 2 });
  await p.goto('file://' + __dirname + '/banners-salla.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
  for (const i of ['d1','d2','d3','d4','m1','m2','m3','m4']) await p.locator('#' + i).screenshot({ path: __dirname + `/out5/${i}.png` });
  await b.close();
})();
