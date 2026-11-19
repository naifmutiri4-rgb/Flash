const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 800, height: 3000 }, deviceScaleFactor: 1000/390 });
  await p.goto('file://' + __dirname + '/banners-current.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
  for (const i of ['mA','mB','mC','mD','mE','mF']) await p.locator('#' + i).screenshot({ path: __dirname + `/out7/${i}.png` });
  await b.close();
})();
