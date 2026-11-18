// يبني معاينة ثابتة قابلة للتجربة من صفحات flashstore-ksa.com الحقيقية:
// - الرئيسية بترتيب المسودة «ترتيب ذكاء» (عنوان الباقات، خدمة مفردة، العدّاد، كيف تطلب)
// - صفحات المنتجات التسع
// كل صفحة: نفس HTML اللي ترسمه سلة + CSS الثيم + salla/v4/flash-malak.css، والصور والخطوط مضمّنة (data:)،
// وبدون جافاسكربت (أزرار الكميات تشتغل لأنها radio عادية). الأسعار بالريال.
// التشغيل: node salla/preview/snapshot.js  ← المخرجات في salla/preview/site/
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(__dirname, 'site');
fs.mkdirSync(OUT, { recursive: true });
const BASE = 'https://flashstore-ksa.com';
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const PRODUCTS = {
  1591098480: ['views', 'مشاهدات-تيك-توك'], 767542597: ['likes', 'لايكات-تيك-توك'], 904807258: ['shares', 'شير-تيك-توك'], 2046465224: ['saves', 'حفظ-تيك-توك'],
  1368006104: ['saver', 'بكج-التوفير'], 1949748553: ['saver-plus', 'بكج-التوفير-المطور'], 1246605374: ['interact', 'بكج-التفاعل'],
  950743674: ['gold', 'بكج-الذهبي'], 651289082: ['explore', 'بكج-اكسبلور'],
};
// أرقام أقسام المسودة ← أرقام نفس الأقسام في المتجر المنشور (عشان قواعد CSS الخاصة بالأقسام تنطبق)
const ID_MAP = { 721318189: 1634550583, 1707757341: 1593679922, 687110472: 92769472, 79990830: 860512816 };

const cache = new Map();
function curl(url, binary) {
  if (cache.has(url)) return cache.get(url);
  let out = null;
  for (let i = 0; i < 3 && out == null; i++) {
    try { out = execFileSync('curl', ['-sL', '--fail', '-A', UA, url], { maxBuffer: 1 << 28 }); } catch { out = null; }
  }
  cache.set(url, out);
  return out;
}
const MIME = { woff2: 'font/woff2', woff: 'font/woff', ttf: 'font/ttf', otf: 'font/otf', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', svg: 'image/svg+xml', gif: 'image/gif' };
function dataUri(url) {
  const ext = (url.split('?')[0].split('.').pop() || '').toLowerCase();
  const buf = curl(url, true);
  if (!buf || !MIME[ext]) return null;
  return `data:${MIME[ext]};base64,${buf.toString('base64')}`;
}
// يضمّن الخطوط والصور اللي داخل CSS
function inlineCssUrls(css, baseHref) {
  return css.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g, (m, q, u) => {
    if (u.startsWith('data:') || u.startsWith('#')) return m;
    let abs; try { abs = new URL(u, baseHref).href; } catch { return m; }
    const d = dataUri(abs);
    return d ? `url("${d}")` : 'none';
  });
}

let flashCss = fs.readFileSync(path.join(ROOT, 'v4', 'flash-malak.css'), 'utf8')
  .replace(/component-id="(\d+)"/g, (m, id) => `component-id="${ID_MAP[id] || id}"`);
for (const [id, [slug]] of Object.entries(PRODUCTS)) flashCss = flashCss.split(`a[href*="p${id}"]`).join(`a[href*="p${id}"],a[href="${slug}.html"]`);
// أسعار كل كمية بالريال (من بيانات المتجر)
const D = JSON.parse(fs.readFileSync(path.join(ROOT, '..', '_src', 'data.json'), 'utf8'));
const PRICES = {};
// كميات «الحفظ» مكتوبة أرقام بدون وحدة في المتجر، فالرقم وحده يرجع لسعر الحفظ
for (const sg of D.singles) for (const [q, pr] of sg.tiers) { const k = q.toLocaleString('en-US'); PRICES[`${k} ${sg.unit}`] = pr; if (sg.unit === 'حفظ') PRICES[k] = pr; }
// أسعار الباقات بالريال: [السعر، السعر قبل الخصم] كما في سلة
const PACK_PRICES = { 1368006104: [9.99, 17.99], 1949748553: [17.99, 24.99], 1246605374: [29.99, 39.99], 950743674: [39.99, 49.99], 651289082: [54.99, 79.99] };
const blocks = JSON.parse(fs.readFileSync(path.join(ROOT, 'v5', 'home-blocks.json'), 'utf8'));

async function snap(browser, url, outName, isHome) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'ar-SA', userAgent: UA });
  const p = await ctx.newPage();
  await p.route(r => decodeURI(r.href) === decodeURI(url), async route => {
    let html = curl(url).toString('utf8');
    if (!html.includes('</head>')) throw new Error('page fetch blocked: ' + url);
    html = html.replace('"currency_code":"USD","country_code":"US"', '"currency_code":"SAR","country_code":"SA"')
               .replace('</head>', `<style id="fx-flash">${flashCss}</style></head>`);
    if (isHome) html = html
      .replace('<h2 class="w-full da-cp">باقات مميزة</h2>', '<h2 class="w-full da-cp">تفاعل أكثر لمقطعك على تيك توك</h2>')
      .replace('جمعنا لك كل الخدمات ببكجات!', 'باقات جاهزة فيها مشاهدات ولايكات وشير وحفظ لمقطع واحد. تختار، تلصق الرابط، ويبدأ التنفيذ آلياً بعد الدفع.')
      .replace('<h2 class="w-full da-cp">خدمات تيك توك</h2>', '<h2 class="w-full da-cp">خدمة مفردة</h2>')
      .replace('<p class="w-full !p-0 text-gray-400 da-ts">وصل حديثًا</p>', '<p class="w-full !p-0 text-gray-400 da-ts">تبي نوع واحد بس؟ اختر الخدمة، وحدّد الكمية بالضبط داخل صفحتها.</p>');
    await route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html });
  });
  await p.goto(url, { waitUntil: 'networkidle', timeout: 120000 });
  await p.waitForTimeout(1500);
  if (isHome) await p.evaluate(b => {
    const set = (id, h) => { const s = document.querySelector(`section[component-id="${id}"]`); if (s) s.innerHTML = h; };
    const hide = id => { const s = document.querySelector(`section[component-id="${id}"]`); if (s) s.remove(); };
    hide(219185457);                 // البداية القديمة (HTML) ← العنوان صار عنوان قسم الباقات
    set(1593679922, b.counter);      // ليش فلاش القديم ← العدّاد
    set(92769472, b.how_why);        // كيف تطلب القديم ← كيف تطلب + ليش فلاش
    // نفس ترتيب المسودة: الباقات، خدمة مفردة، العدّاد، كيف تطلب
  }, blocks);
  // أسعار أزرار الكميات: نكتبها بالريال من بيانات المتجر (المتصفح هنا خارج السعودية فسلة تحسبها بالدولار)
  await p.evaluate(prices => {
    document.querySelectorAll('.s-product-options-grid-mode-span').forEach(sp => {
      const name = sp.textContent.replace(/\s*\(.*\)\s*$/, '').trim();
      if (prices[name] != null) sp.textContent = `${name} (${prices[name]} ر.س)`;
    });
  }, PRICES);
  // سعر الباقة أعلى الصفحة: سلة ترسمه بالدولار هنا، فنكتبه بالريال (السعر والسعر قبل الخصم من المتجر)
  const pid = (decodeURI(url).match(/p(\d+)$/) || [])[1];
  if (PACK_PRICES[pid]) await p.evaluate(([pr, reg]) => {
    const cur = ' <i class="sicon-sar"></i>';
    document.querySelectorAll('.main-content > .price .total-price').forEach(e => { e.innerHTML = pr.toFixed(2) + cur; });
    document.querySelectorAll('.main-content > .price .before-price').forEach(e => { e.innerHTML = reg.toFixed(2) + cur; });
    const sv = document.querySelector('#save-money'); if (sv) sv.innerHTML = (reg - pr).toFixed(2) + cur;
  }, PACK_PRICES[pid]);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } scrollTo(0, 0); });
  await p.waitForTimeout(1200);

  // CSS: كل الستايلات (روابط، وسوم style، وستايلات مكونات سلة)
  const sheets = await p.evaluate(() => {
    const out = [];
    for (const s of document.styleSheets) {
      const n = s.ownerNode;
      if (n && n.tagName === 'LINK') { out.push({ href: n.href }); continue; }
      let t = '';
      const ours = n && n.id === 'fx-flash';
      try {
        // CSS القديم المنشور في المتجر (يتبدّل بملفنا لما ينلصق في المسودة): نشيل قواعده بس، ونخلي باقي الستايل (مثل ألوان الثيم)
        t = [...s.cssRules].filter(r => ours || !/\.fx-|--fx-/.test(r.cssText)).map(r => r.cssText).join('\n');
      } catch { t = n ? n.textContent : ''; }
      out.push({ text: t, base: location.href });
    }
    for (const s of document.adoptedStyleSheets || []) out.push({ text: [...s.cssRules].map(r => r.cssText).join('\n'), base: location.href });
    return out;
  });
  let css = '';
  for (const s of sheets) {
    if (s.href) {
      const buf = curl(s.href); if (!buf) continue;
      const t = buf.toString('utf8');
      // ملف «CSS مخصص» القديم المنشور (فيه كلاسات fx- القديمة): في المسودة ينستبدل بملفنا، فما نضمّنه
      if (/fx-hero__|--fx-acc|\.fx-steps/.test(t)) { console.log('  skip old custom css:', s.href.slice(0, 80)); continue; }
      css += '/*@@sheet*/\n' + inlineCssUrls(t, s.href) + '\n';
    }
    else css += '/*@@sheet*/\n' + inlineCssUrls(s.text, s.base) + '\n';
  }
  css += '/*@@sheet*/\n/* معاينة: إخفاء ما يحتاج جافاسكربت، وطول البطاقات (الثيم يحسبه بالجافاسكربت) */ .swiper-button-next,.swiper-button-prev,salla-loading,.s-loading{display:none!important} .s-product-card-entry{height:auto!important;max-height:none!important;overflow:visible!important} .s-products-list-wrapper{grid-auto-rows:auto!important;grid-template-rows:none!important;align-items:start}\n';

  // HTML: بدون سكربتات، صور مضمّنة، روابط المنتجات محلية
  let html = await p.evaluate(() => {
    document.querySelectorAll('script,noscript,iframe,link[rel="stylesheet"],link[rel="preload"],link[rel="prefetch"],link[rel="modulepreload"],style').forEach(e => e.remove());
    document.querySelectorAll('img').forEach(im => { if (im.currentSrc) im.setAttribute('src', im.currentSrc); im.removeAttribute('srcset'); im.removeAttribute('data-src'); im.removeAttribute('loading'); });
    return '<!doctype html>\n' + document.documentElement.outerHTML;
  });
  html = html.replace(/(src|href)="(https:\/\/cdn[^"]+\.(?:png|jpe?g|webp|svg|gif)[^"]*)"/g, (m, a, u) => { const d = dataUri(u.replace(/&amp;/g, '&')); return d ? `${a}="${d}"` : m; });
  html = html.replace(/url\(&quot;(https:\/\/cdn[^&]+)&quot;\)/g, (m, u) => { const d = dataUri(u); return d ? `url(&quot;${d}&quot;)` : m; });
  html = html.replace(/href="([^"]*)"/g, (m, h) => {
    let u; try { u = new URL(h.replace(/&amp;/g, '&'), BASE); } catch { return m; }
    const id = (decodeURIComponent(u.pathname).match(/\/p(\d+)$/) || [])[1];
    if (id && PRODUCTS[id]) return `href="${PRODUCTS[id][0]}.html"`;
    if (u.host === 'flashstore-ksa.com' && (u.pathname === '/' || u.pathname === '')) return 'href="home.html"';
    if (h.startsWith('#') || h.startsWith('data:')) return m;
    return 'href="#"';
  });
  html = html.replace('</head>', `<style>${css}</style></head>`)
             .replace(/<title>[^<]*<\/title>/, `<title>معاينة فلاش ستور</title>`);
  fs.writeFileSync(path.join(OUT, outName + '.html'), html);
  console.log(outName, Math.round(html.length / 1024) + 'KB');
  await ctx.close();
}

(async () => {
  const b = await chromium.launch();
  await snap(b, BASE + '/', 'home', true);
  for (const [id, [slug, ar]] of Object.entries(PRODUCTS)) await snap(b, `${BASE}/${ar}/p${id}`, slug, false);
  await b.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
