const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 700 }, deviceScaleFactor: 1 });
  await p.goto('file://' + __dirname + '/headers3.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
  for (const i of ['m1','m2','m3','m4','m5']) await p.locator('#' + i).screenshot({ path: __dirname + `/out3/${i}.png` });
  await b.close();
})();
