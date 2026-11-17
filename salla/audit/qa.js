// فحص جودة (QA) للصفحات الحقيقية مع CSS v4 محقون من أول ما ينبني <head> — بدون curl (Cloudflare يحجبه).
// يطلع: لقطة كاملة + قائمة مشاكل آلية (تمرير أفقي، أزرار لمس صغيرة، نص منخفض التباين، عناصر فاضية ظاهرة، صور مكسورة).
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [url, css, out, w] = process.argv.slice(2);
  const txt = css && css !== '-' ? fs.readFileSync(css, 'utf8') : '';
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: +w || 390, height: 844 }, locale: 'ar-SA' });
  if (txt) await p.addInitScript(t => {
    const put = () => { if (document.head && !document.getElementById('fx-qa')) { const s = document.createElement('style'); s.id = 'fx-qa'; s.textContent = t; document.head.appendChild(s); return true; } return false; };
    if (!put()) new MutationObserver((m, o) => { if (put()) o.disconnect(); }).observe(document, { childList: true, subtree: true });
  }, txt);
  await p.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
  await p.waitForTimeout(1500);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise(r => setTimeout(r, 80)); } scrollTo(0, 0); });
  await p.waitForTimeout(600);
  const issues = await p.evaluate(() => {
    const out = [];
    const vis = e => { const r = e.getBoundingClientRect(); const c = getComputedStyle(e); return r.width > 0 && r.height > 0 && c.visibility !== 'hidden' && c.display !== 'none' && +c.opacity > 0.05; };
    const name = e => e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + '.' + [...e.classList].slice(0, 3).join('.');
    if (document.documentElement.scrollWidth > innerWidth + 1) out.push('تمرير أفقي: ' + document.documentElement.scrollWidth);
    // أزرار ولمس صغيرة
    const small = [...document.querySelectorAll('a,button,[role=button],label')].filter(vis).filter(e => { const r = e.getBoundingClientRect(); return (r.height < 32 || r.width < 32) && (e.textContent.trim().length < 3 || e.querySelector('i,svg')); });
    small.slice(0, 8).forEach(e => { const r = e.getBoundingClientRect(); out.push(`لمس صغير ${Math.round(r.width)}x${Math.round(r.height)}: ${name(e)} "${e.textContent.trim().slice(0, 20)}"`); });
    // تباين
    const lum = c => { const m = c.match(/[\d.]+/g); if (!m) return null; const [r, g, bb] = m.slice(0, 3).map(v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }); return .2126 * r + .7152 * g + .0722 * bb; };
    const bgOf = e => { while (e) { const c = getComputedStyle(e).backgroundColor; if (c && !c.includes('0)') && c !== 'transparent') return c; e = e.parentElement; } return 'rgb(17,17,17)'; };
    const seen = new Set();
    [...document.querySelectorAll('p,span,a,small,b,strong,h1,h2,h3,h4,li,label,div')].filter(vis).forEach(e => {
      if (![...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1)) return;
      const c = getComputedStyle(e); const L1 = lum(c.color), L2 = lum(bgOf(e)); if (L1 == null || L2 == null) return;
      const ratio = (Math.max(L1, L2) + .05) / (Math.min(L1, L2) + .05);
      const big = parseFloat(c.fontSize) >= 18.6 || (parseFloat(c.fontSize) >= 14 && +c.fontWeight >= 700);
      if (ratio < (big ? 3 : 4.5)) { const k = name(e) + c.color; if (!seen.has(k)) { seen.add(k); out.push(`تباين ${ratio.toFixed(2)}: ${name(e)} "${e.textContent.trim().slice(0, 25)}" ${c.color} على ${bgOf(e)}`); } }
    });
    // أقسام ظاهرة بس فاضية
    [...document.querySelectorAll('section.s-block, section')].filter(vis).forEach(s => { const r = s.getBoundingClientRect(); if (s.innerText.trim().length < 2 && !s.querySelector('img,svg') && r.height > 30) out.push(`قسم فاضي ${Math.round(r.height)}px: ${name(s)}`); });
    // صور مكسورة
    [...document.images].filter(vis).forEach(i => { if (i.complete && i.naturalWidth === 0) out.push('صورة مكسورة: ' + (i.currentSrc || i.src).slice(0, 80)); });
    return out;
  });
  console.log('injected:', await p.evaluate(() => !!document.getElementById('fx-qa')));
  console.log(issues.slice(0, 40).join('\n'));
  if (out) await p.screenshot({ path: out, fullPage: true });
  await b.close();
})();
