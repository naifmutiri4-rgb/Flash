const { chromium, devices } = require('playwright');
const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', '..', 'docs', 'live', 'home-preview');
fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPhone 13'] });
  const p = await ctx.newPage();
  await p.goto('https://flashstore-ksa.com/?v=' + Date.now(), { waitUntil: 'networkidle', timeout: 90000 });
  for (let y = 0; y < 14000; y += 500) { await p.evaluate(y => scrollTo(0, y), y); await p.waitForTimeout(200); }
  await p.waitForTimeout(1500);
  const html = await p.evaluate(() => {
    const base = location.origin;
    document.querySelectorAll('script,noscript,iframe,link[rel=preload][as=script],link[rel=modulepreload]').forEach(e => e.remove());
    document.querySelectorAll('img').forEach(i => {
      const s = i.currentSrc || i.src || i.dataset.src; if (s) i.src = s;
      i.removeAttribute('loading'); i.removeAttribute('data-src'); i.classList.remove('lazy');
      i.style.opacity = '1';
    });
    document.querySelectorAll('[data-bg]').forEach(e => { e.style.backgroundImage = `url(${e.dataset.bg})`; });
    document.querySelectorAll('a[href]').forEach(a => { try { a.href = new URL(a.getAttribute('href'), base).href; } catch {} });
    document.querySelectorAll('link[href]').forEach(l => { try { l.href = new URL(l.getAttribute('href'), base).href; } catch {} });
    document.querySelectorAll('section.s-block--fixed-banner img').forEach(i => {
      const m = (i.getAttribute('src') || '').match(/hb\/mobile-(\d)\.webp/); if (!m) return;
      let pic = i.closest('picture');
      if (!pic) { pic = document.createElement('picture'); i.parentNode.insertBefore(pic, i); pic.appendChild(i); }
      pic.querySelectorAll('source').forEach(x => x.remove());
      const so = document.createElement('source'); so.media = '(min-width: 768px)'; so.srcset = i.src.replace('mobile-' + m[1], 'desktop-' + m[1]);
      pic.insertBefore(so, i); i.removeAttribute('srcset'); i.removeAttribute('sizes');
    });
    const pre = document.getElementById('preloader'); if (pre) pre.remove();
    const st = document.createElement('style');
    st.textContent = `section[component-id="1555484643"],#preloader,.loader-init{display:none!important}
      body,html{overflow:auto!important}
      .fx-note{position:fixed;left:12px;bottom:12px;z-index:99999;background:#FF3D7F;color:#fff;font:600 13px Tahoma;padding:8px 12px;border-radius:12px;box-shadow:0 8px 20px rgba(0,0,0,.5)}`;
    document.head.appendChild(st);
    const n = document.createElement('div'); n.className = 'fx-note'; n.textContent = 'معاينة: الترتيب الجديد بدون «3 خطوات»'; document.body.appendChild(n);
    return '<!doctype html>\n' + document.documentElement.outerHTML;
  });
  fs.writeFileSync(path.join(OUT, 'index.html'), html);
  console.log('bytes', html.length);
  await b.close();
})();
