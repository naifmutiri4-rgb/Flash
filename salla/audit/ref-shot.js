// يصوّر صفحة مرجعية (متجر آخر) ويستخرج تركيب ومظهر قسم اختيار الكمية — للاستلهام فقط
const { chromium } = require('playwright');
(async () => {
  const [url, outPrefix] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await p.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
  await p.waitForTimeout(2500);
  const opt = await p.$('salla-product-options, .s-product-options-wrapper, #product-tabs-options, form.product-form');
  if (opt) { await opt.scrollIntoViewIfNeeded(); await p.waitForTimeout(500); await opt.screenshot({ path: outPrefix + '-options.png' }); }
  await p.screenshot({ path: outPrefix + '-full.png', fullPage: true });
  const info = await p.evaluate(() => {
    const root = document.querySelector('salla-product-options') || document.querySelector('.product-form');
    if (!root) return 'no options root';
    const labels = [...root.querySelectorAll('label')].slice(0, 6);
    const desc = labels.map(l => {
      const span = l.querySelector('div,span') || l; const c = getComputedStyle(span);
      return { html: l.outerHTML.replace(/\s+/g, ' ').slice(0, 600), bg: c.backgroundColor, border: c.border, radius: c.borderRadius, color: c.color, size: c.fontSize, h: Math.round(span.getBoundingClientRect().height), w: Math.round(span.getBoundingClientRect().width) };
    });
    const grid = root.querySelector('[class*="grid-mode"], .s-product-options-grid-mode');
    return { gridClass: grid ? grid.className : null, gridCols: grid ? getComputedStyle(grid).gridTemplateColumns : null, labels: desc };
  });
  console.log(JSON.stringify(info, null, 1).slice(0, 6000));
  // CSS مخصص للمتجر لو موجود
  const custom = await p.evaluate(() => [...document.querySelectorAll('style')].map(s => s.textContent).filter(t => /option|grid-mode|s-product-options/.test(t)).map(t => t.slice(0, 3000)).join('\n----\n'));
  console.log('CUSTOM CSS:\n' + custom.slice(0, 6000));
  await b.close();
})();
