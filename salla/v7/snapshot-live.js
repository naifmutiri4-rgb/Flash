// معاينة GitHub لاتجاه «بث مباشر» على صفحات ملاك الحقيقية:
// نفس HTML اللي ترسمه سلة + CSS الثيم + v7/live.css (بدون CSS المخصص الحالي)، وصور المنتجات الجديدة،
// والرئيسية فيها بلوكات HTML بنفس كلاس ملاك (s-block--bundle-html-content): الهيدر، شريط الثقة، الخطوات.
// بدون جافاسكربت (أزرار الكميات radio عادية وتشتغل، وشريط المستويات CSS). الأسعار بالريال.
// التشغيل: node salla/v7/snapshot-live.js ← salla/v7/site/  ثم optimize.py ← docs/live/
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const { execFileSync } = require('child_process');

const OUT = path.join(__dirname, 'site');
fs.mkdirSync(OUT, { recursive: true });
const BASE = 'https://flashstore-ksa.com';
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const PRODUCTS = {
  1591098480: ['views', 'مشاهدات-تيك-توك'], 767542597: ['likes', 'لايكات-تيك-توك'], 904807258: ['shares', 'شير-تيك-توك'], 2046465224: ['saves', 'حفظ-تيك-توك'],
  1368006104: ['saver', 'بكج-التوفير'], 1949748553: ['saver-plus', 'بكج-التوفير-المطور'], 1246605374: ['interact', 'بكج-التفاعل'],
  950743674: ['gold', 'بكج-الذهبي'], 651289082: ['explore', 'بكج-اكسبلور'],
};
const IMG = {};
for (const [id, [slug]] of Object.entries(PRODUCTS)) IMG[id] = 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, 'img', slug + '.png')).toString('base64');
const HERO = 'https://naifmutiri4-rgb.github.io/Flash/live/hero.webp?v=2';
const liveCss = fs.readFileSync(path.join(__dirname, 'live.css'), 'utf8');
const LOGO = 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, '..', '..', 'docs', 'live', 'logo.png')).toString('base64');

const D = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', '_src', 'data.json'), 'utf8'));
const PRICES = {};
for (const sg of D.singles) for (const [q, pr] of sg.tiers) { const k = q.toLocaleString('en-US'); PRICES[`${k} ${sg.unit}`] = pr; if (sg.unit === 'حفظ') PRICES[k] = pr; }
const PACK_PRICES = { 1368006104: [9.99, 17.99], 1949748553: [17.99, 24.99], 1246605374: [29.99, 39.99], 950743674: [39.99, 49.99], 651289082: [54.99, 79.99] };
const FROM = { 1591098480: 4.99, 767542597: 5.99, 904807258: 1.99, 2046465224: 1.99 };

const cache = new Map();
function curl(url) {
  if (cache.has(url)) return cache.get(url);
  let out = null;
  for (let i = 0; i < 3 && out == null; i++) { try { out = execFileSync('curl', ['-sL', '--fail', '-A', UA, url], { maxBuffer: 1 << 28 }); } catch { out = null; } }
  cache.set(url, out); return out;
}
const MIME = { woff2: 'font/woff2', woff: 'font/woff', ttf: 'font/ttf', otf: 'font/otf', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', svg: 'image/svg+xml', gif: 'image/gif' };
function dataUri(url) {
  const ext = (url.split('?')[0].split('.').pop() || '').toLowerCase();
  const buf = curl(url); if (!buf || !MIME[ext]) return null;
  return `data:${MIME[ext]};base64,${buf.toString('base64')}`;
}
function inlineCssUrls(css, baseHref) {
  return css.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g, (m, q, u) => {
    if (u.startsWith('data:') || u.startsWith('#')) return m;
    let abs; try { abs = new URL(u, baseHref).href; } catch { return m; }
    const d = dataUri(abs); return d ? `url("${d}")` : 'none';
  });
}
const ic = s => `<i>${s}</i>`;
const HOME_TOP = `<section class="s-block s-block--bundle-html-content"><salla-custom-component component-name="html-content">
<div class="lv-hero"><img src="${HERO}" alt="فلاش ستور: مشاهدات ولايكات وشير وحفظ لتيك توك" width="1170" height="1560" fetchpriority="high"></div>
<div class="lv-trust"><div><i class="lv-bolt"></i>تنفيذ فوري</div><div><i class="lv-shield"></i>تعويض حسب السياسة</div><div><i class="lv-lock"></i>دفع آمن عبر سلة</div><div><i class="lv-chat"></i>دعم متواصل</div></div>
</salla-custom-component></section>`;
const HOME_HOW = `<section class="s-block s-block--bundle-html-content"><salla-custom-component component-name="html-content">
<div class="lv-how"><h2>3 خطوات</h2><ol><li><b>1</b>اختر الخدمة والكمية</li><li><b>2</b>الصق رابط المقطع</li><li><b>3</b>ادفع، والتنفيذ يبدأ فوراً</li></ol></div>
</salla-custom-component></section>`;

async function snap(browser, url, outName, isHome, state) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'ar-SA', userAgent: UA, ...(state ? { storageState: state } : {}) });
  const p = await ctx.newPage();
  await p.route(r => /themes\/customization\/.*\.(css|js)/.test(r.href), r => r.fulfill({ status: 200, contentType: r.request().url().endsWith('.js') ? 'text/javascript' : 'text/css', body: '' }));
  if (state) await p.addInitScript(t => { const put = () => { if (document.head && !document.getElementById('lv-live')) { const s = document.createElement('style'); s.id = 'lv-live'; s.textContent = t; document.head.appendChild(s); return true; } }; if (!put()) new MutationObserver((m, o) => { if (put()) o.disconnect(); }).observe(document, { childList: true, subtree: true }); }, liveCss);
  if (!state) await p.route(r => decodeURI(r.href) === decodeURI(url), async route => {
    let html = curl(url).toString('utf8');
    if (!html.includes('</head>')) throw new Error('page fetch blocked: ' + url);
    html = html.replace('"currency_code":"USD","country_code":"US"', '"currency_code":"SAR","country_code":"SA"')
      .replace('</head>', `<style id="lv-live">${liveCss}</style></head>`);
    await route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html });
  });
  await p.goto(url, { waitUntil: 'networkidle', timeout: 120000 });
  await p.waitForTimeout(1500);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { scrollTo(0, y); await new Promise(r => setTimeout(r, 100)); } scrollTo(0, 0); });
  await p.waitForTimeout(1000);
  // صور المنتجات الجديدة (الكروت + صورة صفحة المنتج + صورة شريط الشراء)
  // البانر: نسخة المعاينة الجديدة (اكسبلور) بدل اللي في المتجر
  await p.evaluate(() => { document.querySelectorAll('section.s-block--fixed-banner img').forEach(i => { i.src = 'https://naifmutiri4-rgb.github.io/Flash/live/banner-d-v3.webp'; }); document.querySelectorAll('section.s-block--fixed-banner source').forEach(x => { x.srcset = 'https://naifmutiri4-rgb.github.io/Flash/live/banner-m-v3.webp'; }); });
  await p.evaluate(L => { document.querySelectorAll('.navbar-brand img, .store-footer img[alt*="فلاش"], .store-footer .logo img').forEach(i => { i.src = L; i.removeAttribute('srcset'); i.removeAttribute('data-src'); }); }, LOGO);
  await p.evaluate(([IMG, HOME_TOP, HOME_HOW, isHome, pid]) => {
    const idOf = h => (decodeURIComponent(h || '').match(/\/p(\d+)/) || [])[1];
    document.querySelectorAll('.s-product-card-entry').forEach(card => {
      const id = (card.id.match(/(\d+)$/) || [])[1] || idOf((card.querySelector('a') || {}).href);
      const im = card.querySelector('.s-product-card-image img');
      if (id && IMG[id] && im) { im.src = IMG[id]; im.removeAttribute('data-src'); im.style.aspectRatio = '1/1'; }
    });
    document.querySelectorAll('.cart-item').forEach(ci => { const a = ci.querySelector('a[href]'); const id = a && idOf(a.href); const im = ci.querySelector('img'); if (id && IMG[id] && im) { im.src = IMG[id]; im.removeAttribute('data-src'); } });
    if (pid && IMG[pid]) {
      document.querySelectorAll('.product-single .sidebar img').forEach(im => { im.src = IMG[pid]; im.removeAttribute('srcset'); im.removeAttribute('data-src'); });
      document.querySelectorAll('.sticky-product-bar [data-bg]').forEach(e => { e.style.backgroundImage = `url(${IMG[pid]})`; });
    }
    if (isHome) {
      const first = document.querySelector('section[component-id="721318189"]');
      if (first) first.insertAdjacentHTML('beforebegin', HOME_TOP);
      const singles = document.querySelector('section[component-id="79990830"]');
      if (singles) singles.insertAdjacentHTML('afterend', HOME_HOW);
    }
  }, [IMG, HOME_TOP, HOME_HOW, isHome, (decodeURI(url).match(/p(\d+)$/) || [])[1]]);
  // الأسعار بالريال
  await p.evaluate(([prices, packs, from]) => {
    const sar = x => x.toFixed(2) + ' <i class="sicon-sar"></i>';
    document.querySelectorAll('.s-product-options-grid-mode-span').forEach(sp => {
      const name = sp.textContent.replace(/\s*\(.*\)\s*$/, '').trim();
      if (prices[name] != null) sp.textContent = `${name} (${prices[name]} ر.س)`;
    });
    document.querySelectorAll('.s-product-card-entry').forEach(card => {
      const id = (card.id.match(/(\d+)$/) || [])[1] || (decodeURIComponent((card.querySelector('a') || {}).href || '').match(/\/p(\d+)/) || [])[1];
      const pr = card.querySelector('.s-product-card-price'), before = card.querySelector('.s-product-card-price-before');
      if (packs[id] && pr) { pr.innerHTML = sar(packs[id][0]); if (before) before.innerHTML = sar(packs[id][1]); }
      if (from[id] && pr) { pr.innerHTML = 'من ' + sar(from[id]); if (before) before.remove(); }
    });
    const pid = (decodeURIComponent(location.pathname).match(/p(\d+)$/) || [])[1];
    if (packs[pid]) {
      document.querySelectorAll('.main-content > .price .total-price').forEach(e => { e.innerHTML = sar(packs[pid][0]); });
      document.querySelectorAll('.main-content > .price .before-price').forEach(e => { e.innerHTML = sar(packs[pid][1]); });
      const sv = document.querySelector('#save-money'); if (sv) sv.innerHTML = sar(packs[pid][1] - packs[pid][0]);
    }
    if (document.body.classList.contains('cart')) {
      document.querySelectorAll('.cart-item .item-total').forEach(e => { e.textContent = '12.99'; });
      document.querySelectorAll('.cart-item .s-quantity-input-input').forEach(e => e.setAttribute('value', '1'));
      document.querySelectorAll('.cart-item .item-price, .cart-item .item-total, .s-cart-summary-total, .s-cart-summary-card [class*="amount"], .s-cart-summary-card-bar > *:last-child, .s-cart-summary-card [class*="total"] span:last-child').forEach(e => { if (/\$/.test(e.textContent)) e.innerHTML = sar(12.99); });
      document.querySelectorAll('.cart-item .s-product-options-grid-mode-span, .cart-item .s-product-options-grid-mode-span').forEach(() => {});
      document.querySelectorAll('*').forEach(e => { if (e.children.length === 0 && /\$/.test(e.textContent) && /^[\s\d.,]+\$\s*$/.test(e.textContent)) e.innerHTML = sar(12.99); });
    } else document.querySelectorAll('.s-cart-summary-total').forEach(e => { e.innerHTML = '0 ' + '<i class="sicon-sar"></i>'; });
  }, [PRICES, PACK_PRICES, FROM]);
  await p.waitForTimeout(500);

  const sheets = await p.evaluate(() => {
    const out = [];
    for (const s of document.styleSheets) {
      const n = s.ownerNode;
      if (n && n.tagName === 'LINK') { out.push({ href: n.href }); continue; }
      let t = ''; try { t = [...s.cssRules].map(r => r.cssText).join('\n'); } catch { t = n ? n.textContent : ''; }
      out.push({ text: t, base: location.href });
    }
    for (const s of document.adoptedStyleSheets || []) out.push({ text: [...s.cssRules].map(r => r.cssText).join('\n'), base: location.href });
    return out;
  });
  let css = '';
  for (const s of sheets) {
    if (s.href) {
      if (/themes\/customization\//.test(s.href)) continue;
      const buf = curl(s.href); if (!buf) continue;
      css += '/*@@sheet*/\n' + inlineCssUrls(buf.toString('utf8'), s.href) + '\n';
    } else css += '/*@@sheet*/\n' + inlineCssUrls(s.text, s.base) + '\n';
  }
  css += '/*@@sheet*/\n.swiper-button-next,.swiper-button-prev,salla-loading,.s-loading{display:none!important} .s-product-card-entry{height:auto!important;max-height:none!important;overflow:visible!important} .s-products-list-wrapper{grid-auto-rows:auto!important;grid-template-rows:none!important;align-items:start}\n';

  let html = await p.evaluate(() => {
    document.querySelectorAll('script,noscript,iframe,link[rel="stylesheet"],link[rel="preload"],link[rel="prefetch"],link[rel="modulepreload"],style').forEach(e => e.remove());
    document.querySelectorAll('img').forEach(im => { if (im.currentSrc && !im.src.startsWith('data:') && !im.closest('picture')) im.setAttribute('src', im.currentSrc); im.removeAttribute('srcset'); im.removeAttribute('data-src'); im.removeAttribute('loading'); });
    return '<!doctype html>\n' + document.documentElement.outerHTML;
  });
  html = html.replace(/(src|href)="(https:\/\/cdn[^"]+\.(?:png|jpe?g|webp|svg|gif)[^"]*)"/g, (m, a, u) => { const d = dataUri(u.replace(/&amp;/g, '&')); return d ? `${a}="${d}"` : m; });
  html = html.replace(/url\(&quot;(https:\/\/cdn[^&]+)&quot;\)/g, (m, u) => { const d = dataUri(u); return d ? `url(&quot;${d}&quot;)` : m; });
  html = html.replace(/href="([^"]*)"/g, (m, h) => {
    if (h.startsWith('#') || h.startsWith('data:')) return m;
    let u; try { u = new URL(h.replace(/&amp;/g, '&'), BASE); } catch { return m; }
    const id = (decodeURIComponent(u.pathname).match(/\/p(\d+)$/) || [])[1];
    if (id && PRODUCTS[id]) return `href="${PRODUCTS[id][0]}.html"`;
    if (u.host === 'flashstore-ksa.com' && (u.pathname === '/' || u.pathname === '')) return 'href="index.html"';
    if (u.host === 'flashstore-ksa.com' && u.pathname === '/cart') return 'href="cart.html"';
    return 'href="#"';
  });
  html = html.replace('</head>', `<style>${css}</style></head>`).replace(/<title>[^<]*<\/title>/, '<title>فلاش ستور · بث مباشر</title>');
  fs.writeFileSync(path.join(OUT, outName + '.html'), html);
  console.log(outName, Math.round(html.length / 1024) + 'KB');
  await ctx.close();
}

(async () => {
  const b = await chromium.launch();
  if (process.argv[2] === 'cart') { await snap(b, BASE + '/cart', 'cart', false, process.argv[3]); await b.close(); return; }
  await snap(b, BASE + '/', 'index', true);
  for (const [id, [slug, ar]] of Object.entries(PRODUCTS)) await snap(b, `${BASE}/${ar}/p${id}`, slug, false);
  await b.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
