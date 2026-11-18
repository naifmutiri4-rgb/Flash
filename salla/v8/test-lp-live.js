const { chromium } = require('playwright');
const S = '/tmp/claude-0/-home-user/3415ab36-c530-53dc-99ff-5fe0e5e0e39f/scratchpad/';
(async () => {
  const b = await chromium.launch();
  for (const [w, h, n] of [[390, 844, 'm'], [1366, 900, 'd']]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    const r = await p.goto('https://flashstore-ksa.com/pages/lp1304367330/1542606730', { waitUntil: 'networkidle', timeout: 90000 });
    await p.waitForTimeout(2500);
    const info = await p.evaluate(() => {
      const lp = document.querySelector('.fx-lp');
      const others = [...document.querySelectorAll('main > *, body > *')].filter(e => !e.contains(lp) && e.offsetHeight > 20 && getComputedStyle(e).display !== 'none').map(e => e.tagName.toLowerCase() + '.' + (e.className || '').toString().slice(0, 40) + ' h=' + e.offsetHeight);
      const fixed = [...document.querySelectorAll('body *')].filter(e => ['fixed','sticky'].includes(getComputedStyle(e).position) && e.offsetHeight > 0 && !lp?.contains(e)).map(e => e.tagName.toLowerCase() + '.' + (e.className || '').toString().slice(0, 40) + ' ' + e.offsetWidth + 'x' + e.offsetHeight);
      return { title: document.title, rendered: !!lp, styleKept: lp ? getComputedStyle(lp).backgroundColor : null, bodyBg: getComputedStyle(document.body).backgroundColor, overflowX: document.documentElement.scrollWidth > innerWidth, broken: [...document.images].filter(i => i.complete && !i.naturalWidth).map(i => i.src.slice(-50)), others, fixed, font: lp ? getComputedStyle(lp.querySelector('h1')).fontFamily : null };
    });
    console.log(n, r.status(), JSON.stringify(info, null, 1));
    await p.screenshot({ path: S + `live-${n}.png`, fullPage: true });
    await p.close();
  }
  await b.close();
})();
