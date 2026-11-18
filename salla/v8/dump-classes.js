const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  await p.goto('https://flashstore-ksa.com/pages/lp1304367330/1377310171', { waitUntil: 'networkidle', timeout: 90000 });
  await p.waitForTimeout(1500);
  const out = await p.evaluate(() => {
    const rows = [];
    const walk = (el, d) => {
      if (d > 9) return;
      for (const c of el.children) {
        if (['SCRIPT','STYLE','LINK','META','NOSCRIPT'].includes(c.tagName)) continue;
        const cs = getComputedStyle(c);
        rows.push(' '.repeat(d) + c.tagName.toLowerCase() + (c.id ? '#' + c.id : '') + (c.className && typeof c.className === 'string' ? '.' + c.className.trim().split(/\s+/).join('.') : '') + ' bg=' + cs.backgroundColor + ' color=' + cs.color + (c.children.length ? '' : ' "' + (c.textContent || '').trim().slice(0, 30) + '"'));
        if (c.tagName.toLowerCase() !== 'salla-html-content' && c.tagName !== 'svg') walk(c, d + 1);
      }
    };
    walk(document.body, 0);
    return rows.join('\n');
  });
  console.log(out);
  const css = await p.evaluate(() => [...document.styleSheets].map(s => s.href).filter(Boolean));
  console.log(css.join('\n'));
  await b.close();
})();
