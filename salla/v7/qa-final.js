// فحص شامل لتصميم «بث مباشر» على صفحات المتجر الحقيقية (CSS يُحقن في متصفح الاختبار فقط):
// جوال 390 + كمبيوتر 1280: تمرير أفقي، عناصر طالعة برا الشاشة، نص منخفض التباين، صور مكسورة، أخطاء JS،
// ونسبة الألوان. ويصوّر كل صفحة. التشغيل: node qa-live.js
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const S = '/tmp/claude-0/-home-user/3415ab36-c530-53dc-99ff-5fe0e5e0e39f/scratchpad/qa/';
fs.mkdirSync(S, { recursive: true });
const css = fs.readFileSync(path.join(__dirname, 'live.css'), 'utf8');
const js = fs.readFileSync(path.join(__dirname, 'live.min.js'), 'utf8');
const B = 'https://flashstore-ksa.com';
const PAGES = [
  ['home', B + '/'], ['category', B + '/التخفيضات/c779761984'],
  ['views', B + '/مشاهدات-تيك-توك/p1591098480'], ['likes', B + '/لايكات-تيك-توك/p767542597'],
  ['shares', B + '/شير-تيك-توك/p904807258'], ['saves', B + '/حفظ-تيك-توك/p2046465224'],
  ['saver', B + '/بكج-التوفير/p1368006104'], ['interact', B + '/بكج-التفاعل/p1246605374'], ['explore', B + '/بكج-اكسبلور/p651289082'],
];
const audit = () => {
  const lum = c => { const m = c.match(/[\d.]+/g); if (!m) return null; const [r, g, b] = m.slice(0, 3).map(v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }); return { L: .2126 * r + .7152 * g + .0722 * b, a: m[3] == null ? 1 : +m[3] }; };
  const bgOf = el => { for (let e = el; e; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.backgroundImage !== 'none' && !/url\(/.test(cs.backgroundImage)) return 'gradient'; const c = lum(cs.backgroundColor); if (c && c.a > .5) return cs.backgroundColor; } return 'rgb(11,10,18)'; };
  const vw = innerWidth, out = { overflowX: document.documentElement.scrollWidth > vw + 1, offscreen: [], lowContrast: [], brokenImgs: [] };
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
    const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || +cs.opacity === 0) continue;
    if ((r.right > vw + 2 || r.left < -2) && cs.position !== 'fixed' && !el.closest('.swiper,.s-slider-container,.angel-ad,[class*="slider"],.mask-block,salla-slider')) out.offscreen.push(el.tagName.toLowerCase() + '.' + [...el.classList].slice(0, 3).join('.') + ` ${Math.round(r.left)}→${Math.round(r.right)}`);
    const own = [...el.childNodes].filter(n => n.nodeType === 3 && n.textContent.trim()).map(n => n.textContent.trim()).join(' ');
    if (own && !el.closest('svg')) {
      const bg = bgOf(el); if (bg === 'gradient') continue;
      const f = lum(cs.color), b = lum(bg); if (!f || !b) continue;
      const ratio = (Math.max(f.L, b.L) + .05) / (Math.min(f.L, b.L) + .05);
      const big = parseFloat(cs.fontSize) >= 18.66 || (parseFloat(cs.fontSize) >= 14 && +cs.fontWeight >= 700);
      if (ratio < (big ? 3 : 4.5) && f.a > .5) out.lowContrast.push(`${ratio.toFixed(1)} "${own.slice(0, 30)}" ${cs.color} on ${bg} (${el.tagName.toLowerCase()}.${[...el.classList].slice(0, 2).join('.')})`);
    }
  }
  out.brokenImgs = [...document.images].filter(i => i.complete && !i.naturalWidth && i.getBoundingClientRect().width).map(i => (i.currentSrc || i.src).slice(0, 80));
  out.offscreen = [...new Set(out.offscreen)].slice(0, 8); out.lowContrast = [...new Set(out.lowContrast)].slice(0, 12);
  return out;
};
(async () => {
  const b = await chromium.launch();
  const report = [];
  for (const [w, h, dev] of [[390, 844, 'm'], [1280, 900, 'd']]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, locale: 'ar-SA', timezoneId: 'Asia/Riyadh' });
    await ctx.route(u => /themes\/customization\/.*\.(css|js)/.test(u.href), r => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
    await ctx.addInitScript(t => { const put = () => { if (document.head && !document.getElementById('lv')) { const s = document.createElement('style'); s.id = 'lv'; s.textContent = t; document.head.appendChild(s); return true; } }; if (!put()) new MutationObserver((m, o) => { if (put()) o.disconnect(); }).observe(document, { childList: true, subtree: true }); }, css);
    await ctx.addInitScript(js);
    for (const [name, url] of PAGES) {
      if (dev === 'd' && !['home', 'category', 'views', 'interact'].includes(name)) continue;
      const p = await ctx.newPage(); const errs = [];
      p.on('pageerror', e => errs.push(e.message.slice(0, 90)));
      p.on('console', m => { if (m.type() === 'error' && /lvLive|data-lv/.test(m.text())) errs.push('OURS ' + m.text().slice(0, 80)); });
      p.on('response', r => { if (r.status() >= 400 && /flashstore|salla/.test(r.url()) && !/customization/.test(r.url())) errs.push(r.status() + ' ' + r.url().slice(0, 90)); });
      try { await p.goto(url, { waitUntil: 'networkidle', timeout: 90000 }); } catch (e) { report.push(`${dev}/${name}: LOAD FAIL ${e.message.slice(0, 60)}`); await p.close(); continue; }
      await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise(r => setTimeout(r, 80)); } scrollTo(0, 0); });
      await p.waitForTimeout(800);
      const labels = await p.$$('.s-product-options-grid-mode label');
      let opt = '';
      if (labels.length) { await labels[1].click(); await p.waitForTimeout(300); opt = await p.evaluate(() => { const g = document.querySelector('.s-product-options-grid-mode'); return 'bar=' + getComputedStyle(g).getPropertyValue('--lv-p') + ' checked=' + document.querySelectorAll('.s-product-options-grid-mode input:checked').length; }); }
      const a = await p.evaluate(audit);
      report.push(`== ${dev}/${name} ${opt}\n overflowX=${a.overflowX} broken=${a.brokenImgs.length} errors=${errs.length}\n` +
        (a.offscreen.length ? ' OFFSCREEN: ' + a.offscreen.join(' | ') + '\n' : '') +
        (a.lowContrast.length ? ' LOWCONTRAST:\n  ' + a.lowContrast.join('\n  ') + '\n' : '') +
        (errs.length ? ' ERR: ' + [...new Set(errs)].slice(0, 4).join(' | ') + '\n' : ''));
      await p.screenshot({ path: `${S}${dev}-${name}.png`, fullPage: true });
      await p.close();
    }
    await ctx.close();
  }
  await b.close();
  fs.writeFileSync(S + 'report.txt', report.join('\n'));
  console.log(report.join('\n'));
})();
