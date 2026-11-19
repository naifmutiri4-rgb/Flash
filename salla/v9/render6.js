const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 800, height: 1600 }, deviceScaleFactor: 2 });
  await p.goto('file://' + __dirname + '/banners-fav.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
  for (const i of ['dA','dB','dC','dD','dE','mA','mB','mC','mD','mE']) await p.locator('#' + i).screenshot({ path: __dirname + `/out6/${i}.png` });
  await b.close();
})();
