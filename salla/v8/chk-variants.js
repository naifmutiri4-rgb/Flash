const { chromium, devices } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const urls = ['https://flashstore-ksa.com/pages/lp1304367330/1377310171', 'https://flashstore-ksa.com/ar/pages/lp1304367330/1377310171', 'https://flashstore-ksa.com/pages/lp1304367330/1377310171?ttclid=x&utm_source=tiktok'];
  for (const u of urls) {
    const ctx = await b.newContext({ ...devices['iPhone 15'] });
    const p = await ctx.newPage(); const api = [];
    p.on('response', async r => { const x = r.url(); if (/landing|page|component|api/i.test(x) && /json|api/.test((r.headers()['content-type'] || '') + x)) api.push(r.status() + ' ' + (r.headers()['cf-cache-status'] || '') + ' ' + (r.headers()['age'] || '') + ' ' + x.slice(0, 140)); });
    await p.goto(u, { waitUntil: 'networkidle', timeout: 90000 }); await p.waitForTimeout(2000);
    const st = await p.evaluate(() => ({ newD: !!document.querySelector('.fx-lp'), oldD: document.documentElement.innerHTML.includes('Thmanyah') || !!document.querySelector('svg.logo'), url: location.href }));
    console.log(JSON.stringify(st)); console.log(api.slice(0, 8).join('\n'));
    await ctx.close();
  }
  await b.close();
})();
