// فحص سريع: هل قاعدة حجز المكان تنطبق على قسم HTML أثناء التحميل؟
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [url, css, sel] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  const txt = fs.readFileSync(css, 'utf8');
  await p.addInitScript(t => { const s = document.createElement('style'); s.id = 'fx'; s.textContent = t; (document.head || document.documentElement).appendChild(s); }, txt);
  await p.goto(url, { waitUntil: 'domcontentloaded' });
  for (const t of [300, 900, 2500]) {
    await p.waitForTimeout(t);
    console.log(t, await p.evaluate(sel => {
      const e = document.querySelector(sel); if (!e) return 'none';
      const c = getComputedStyle(e);
      return 'minH=' + c.minHeight + ' h=' + Math.round(e.getBoundingClientRect().height) + ' styleTag=' + !!document.getElementById('fx') + ' inHead=' + (document.getElementById('fx')?.parentNode?.tagName);
    }, sel));
  }
  await b.close();
})();
