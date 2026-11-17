// لقطات معاينة v5 بأماكن تمرير مختلفة (عشان العدّاد يبان بعد ما يدور)
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await p.goto('file://' + __dirname + '/preview.html');
  const spots = [['top', 0], ['counter', '.fx-counter'], ['board', '.fx-board'], ['how', '.fx-how']];
  for (const [n, s] of spots) {
    await p.evaluate(s => { if (typeof s === 'number') scrollTo(0, s); else { const e = document.querySelector(s); scrollTo(0, e.getBoundingClientRect().top + scrollY - 40); } }, s);
    await p.waitForTimeout(400);
    await p.screenshot({ path: __dirname + `/shot-${n}.png` });
  }
  await b.close();
})();
