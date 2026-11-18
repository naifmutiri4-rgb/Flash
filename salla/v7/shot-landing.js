// يصوّر صفحة الهبوط النشطة الحالية على الجوال
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await p.goto(process.argv[2], { waitUntil: 'networkidle', timeout: 90000 });
  await p.waitForTimeout(1500);
  console.log(await p.evaluate(() => ({ h: document.body.scrollHeight, text: document.body.innerText.replace(/\s+/g, ' ').slice(0, 400), styles: [...document.querySelectorAll('salla-custom-component style, .s-block style')].length })));
  await p.screenshot({ path: '/tmp/claude-0/-home-user/3415ab36-c530-53dc-99ff-5fe0e5e0e39f/scratchpad/lp-now.png', fullPage: true });
  await b.close();
})();
