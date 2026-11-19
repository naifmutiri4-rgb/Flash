// يحاكي بلوك HTML في صفحات الهبوط: نفس DOMPurify ونفس إعداداته (من html-content.js)، مع CSS قالب صفحات الهبوط،
// ويحقن الناتج في الصفحة بدون Shadow DOM (زي سلة) ويصوّر جوال + كمبيوتر. ويطبع وش انشال من الكود.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const S = '/tmp/claude-0/-home-user/3415ab36-c530-53dc-99ff-5fe0e5e0e39f/scratchpad/';
(async () => {
  const code = fs.readFileSync(path.join(__dirname, 'landing2.html'), 'utf8');
  const b = await chromium.launch();
  for (const [w, h, n] of [[390, 844, 'm'], [1280, 900, 'd']]) {
    const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: w < 500 ? 2 : 1 });
    await p.setContent(`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="https://cdn.assets.salla.network/theme-landing-page/master/_next/static/css/cbd1f70345111460.css">
</head>
<body class="pb-16 md:pb-0"><div class="flex"><salla-html-content class="s-block s-block-html-content" id="host"></salla-html-content></div></body></html>`, { waitUntil: 'networkidle' });
    await p.addScriptTag({ path: S + "dp/node_modules/dompurify/dist/purify.min.js" });
    const r = await p.evaluate(code => {
      const clean = DOMPurify.sanitize(code, { ADD_TAGS: ['iframe'], ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'target'], FORBID_TAGS: ['script', 'base', 'object', 'embed', 'meta', 'link', 'form'], FORBID_ATTR: ['srcdoc', 'formaction'] });
      document.getElementById('host').innerHTML = clean;
      return { inLen: code.length, outLen: clean.length, styleKept: clean.includes('<style>'), removed: DOMPurify.removed.map(x => (x.element && x.element.nodeName) || (x.attribute && 'attr:' + x.attribute.name)).slice(0, 10) };
    }, code);
    await p.waitForTimeout(1500);
    const info = await p.evaluate(() => ({ ox: document.documentElement.scrollWidth > innerWidth, bg: getComputedStyle(document.body).backgroundColor, broken: [...document.images].filter(i => i.complete && !i.naturalWidth).map(i => i.src.slice(-40)) }));
    console.log(n, JSON.stringify(r), JSON.stringify(info));
    await p.screenshot({ path: `${S}lp2-${n}.png`, fullPage: true });
    await p.close();
  }
  await b.close();
})();
