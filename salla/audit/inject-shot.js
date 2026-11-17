// يفتح صفحة من المتجر الحي، يحقن ملف CSS، ويصوّر الصفحة كاملة (لتجربة الـ CSS قبل لصقه في سلة)
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [url, css, out, w, click] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: +w, height: 900 }, locale: 'ar-SA' });
  await p.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
  await p.waitForTimeout(1500);
  await p.addStyleTag({ content: fs.readFileSync(css, 'utf8') });
  if (click) {
    const l = await p.$$('.s-product-options-grid-mode label');
    if (l[+click]) { await l[+click].click(); await p.waitForTimeout(800); }
  }
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); }
    scrollTo(0, 0);
  });
  await p.waitForTimeout(800);
  console.log('overflowX', await p.evaluate(() => document.documentElement.scrollWidth > innerWidth));
  await p.screenshot({ path: out, fullPage: true });
  await b.close();
})();
