const { chromium } = require('playwright'); const fs = require('fs');
const S = '/tmp/claude-0/-home-user/3415ab36-c530-53dc-99ff-5fe0e5e0e39f/scratchpad/';
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await p.route(u => /themes\/customization\/.*\.css/.test(u.href), r => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  await p.goto(process.argv[2], { waitUntil: 'networkidle', timeout: 90000 });
  await p.addStyleTag({ content: fs.readFileSync(__dirname + '/live.css', 'utf8') });
  const l = await p.$$('.s-product-options-grid-mode label'); await l[2].click(); await p.waitForTimeout(400);
  const g = await p.$('.s-product-options-grid-mode'); await g.scrollIntoViewIfNeeded();
  console.log(await p.evaluate(() => { const g = document.querySelector('.s-product-options-grid-mode'); const c = getComputedStyle(g, '::before'); return [c.backgroundImage, c.opacity, c.visibility, c.position, getComputedStyle(g).overflow, c.width].join(' | '); }));
  await g.screenshot({ path: S + 'g1.png' });
  await p.addStyleTag({ content: '.product-single .s-product-options-grid-mode::before{-webkit-mask:none!important;mask:none!important}' }); await p.waitForTimeout(200);
  await g.screenshot({ path: S + 'g2.png' });
  await b.close();
})();
