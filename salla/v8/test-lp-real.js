const { chromium } = require('playwright');
const S = '/tmp/claude-0/-home-user/3415ab36-c530-53dc-99ff-5fe0e5e0e39f/scratchpad/';
const code = JSON.parse(require('fs').readFileSync(S + 'stored.json', 'utf8'));
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext();
  const pg = await ctx.newPage();
  const r = await pg.goto('https://flashstore-ksa.com/pages/lp1304367330/1542606730', { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(e => null);
  console.log('public url status:', r ? r.status() : 'err');
  for (const u of ['https://flashstore-ksa.com/', 'https://naifmutiri4-rgb.github.io/Flash/live/logo-420.png']) {
    const x = await ctx.request.get(u).catch(() => null); console.log('link', u, x ? x.status() : 'err');
  }
  await pg.close();
  for (const [w, h] of [[360, 780], [390, 844], [430, 932], [768, 1024], [1366, 900]]) {
    const p = await ctx.newPage(); await p.setViewportSize({ width: w, height: h });
    await p.setContent(`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="https://cdn.assets.salla.network/theme-landing-page/master/_next/static/css/cbd1f70345111460.css"></head>
<body class="pb-16 md:pb-0"><main class="flex flex-col min-h-screen"><div id="mount"></div></main></body></html>`, { waitUntil: 'networkidle' });
    await p.addScriptTag({ type: 'module', content: `
      import 'https://cdn.assets.salla.network/themes/1078728572/latest/html-content.js';
      await customElements.whenDefined('salla-html-content').catch(()=>{});
      window.__tags=[...customElements.constructor.name?[]:[]];
    ` }).catch(e => console.log('bundle load err', e.message));
    await p.waitForTimeout(1500);
    const tag = await p.evaluate(() => ['salla-html-content', 'salla-html-content-ogo1jo'].find(t => customElements.get(t)) || null);
    const res = await p.evaluate(async ({ code, tag }) => {
      const el = document.createElement(tag || 'div');
      el.className = 's-block s-block-html-content';
      if (tag) { el.config = { code }; el.setAttribute('config', JSON.stringify({ code })); } else el.innerHTML = code;
      document.getElementById('mount').appendChild(el);
      await new Promise(r => setTimeout(r, 2500));
      const root = el.shadowRoot || el;
      const lp = root.querySelector('.fx-lp') || document.querySelector('.fx-lp');
      const imgs = [...document.querySelectorAll('img')];
      const btns = [...document.querySelectorAll('.fx-btn')].map(a => { const r = a.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height), a.href]; });
      const clipped = [...document.querySelectorAll('.fx-lp *')].filter(e => e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).overflow !== 'visible').length;
      return { rendered: !!lp, styleOk: lp ? getComputedStyle(lp).backgroundColor : null, overflowX: document.documentElement.scrollWidth > innerWidth, brokenImgs: imgs.filter(i => i.complete && !i.naturalWidth).length, btns, clipped, h: document.documentElement.scrollHeight };
    }, { code, tag });
    console.log(w + 'px', 'tag=' + tag, JSON.stringify(res));
    if (w === 390) await p.screenshot({ path: S + 'real-390.png', fullPage: true });
    if (w === 1366) await p.screenshot({ path: S + 'real-1366.png', fullPage: true });
    await p.close();
  }
  await b.close();
})();
