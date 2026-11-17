// يقيس ارتفاع salla-product-options بعد التحميل (مع الـ CSS) لكل منتج، عشان نحجز مكانه قبل ما يتحمل
const { chromium } = require('playwright');
const fs = require('fs');
const { execFileSync } = require('child_process');
(async () => {
  const [css, ...urls] = process.argv.slice(2);
  const txt = fs.readFileSync(css, 'utf8');
  const b = await chromium.launch();
  for (const w of [390, 1280]) for (const url of urls) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    await p.route(r => decodeURI(r) === decodeURI(url), async route => {
      const html = execFileSync('curl', ['-sL', url], { maxBuffer: 1 << 26 }).toString('utf8');
      await route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html.replace('</head>', `<style>${txt}</style></head>`) });
    });
    await p.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
    await p.waitForTimeout(1500);
    const h = await p.$eval('salla-product-options', e => Math.round(e.getBoundingClientRect().height));
    console.log(w, decodeURI(url).split('/')[3], h);
    await p.close();
  }
  await b.close();
})();
