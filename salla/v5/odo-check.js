// يتأكد إن العدّاد يوصل لأرقامه الصحيحة بعد التمرير (scroll-driven)
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  for (const w of [390, 1280]) {
    const p = await b.newPage({ viewport: { width: w, height: 800 } });
    await p.goto('file://' + __dirname + '/preview.html');
    const box = await p.$('.fx-counter');
    for (const off of [-500, 0, 300]) {
      await p.evaluate(o => { const e = document.querySelector('.fx-rail'); scrollTo(0, e.getBoundingClientRect().top + scrollY - innerHeight / 2 + o); }, off);
      await p.waitForTimeout(300);
      const vis = await p.evaluate(() => [...document.querySelectorAll('.fx-od')].map(od => [...od.querySelectorAll('[aria-hidden] > span')].map(s => {
        if (!s.classList.contains('fx-od__d')) return s.textContent;
        const r = s.getBoundingClientRect();
        const hit = [...s.children].find(i => { const q = i.getBoundingClientRect(); return Math.abs(q.top - r.top) < 2; });
        return hit ? hit.textContent : '?';
      }).join('')).join(' '));
      console.log(w, 'offset', off, '→', vis);
    }
    await box.screenshot({ path: __dirname + `/odo-${w}.png` });
    await p.close();
  }
  await b.close();
})();
