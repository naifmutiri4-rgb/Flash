const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 700 }, deviceScaleFactor: 1 });
  await p.goto('file://' + __dirname + '/headers.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
  const ok = await p.evaluate(() => [...document.fonts].map(f => f.family + f.weight + ':' + f.status).join(' '));
  console.log(ok);
  for (const i of [1, 2, 3, 4, 5]) await p.locator('#h' + i).screenshot({ path: __dirname + `/out/header-${i}.png` });
  await b.close();
})();
