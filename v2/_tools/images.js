// يولّد صور المنتجات (1080×1080) من data.json — التشغيل: node v2/_tools/images.js
// يحتاج Playwright + Chromium. المخرجات: v2/img/<slug>.png (للرفع على سلة) و <slug>.webp (للموقع)
//
// لوحة ألوان موحدة لكل الصور: خلفية داكنة + أصفر الهوية + أبيض.
// مصممة للجوال بعمودين: الصورة تظهر بعرض ~170px، فكل نص مهم ≥ 70px في الصورة الأصلية
// (≈ 11px أو أكثر على الشاشة)، وعدد العناصر قليل وكبير.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const D = JSON.parse(fs.readFileSync(path.join(ROOT, '..', '_src', 'data.json'), 'utf8'));
const font = f => 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'fonts', f)).toString('base64');

const C = { bg: '#111114', card: '#1E1E23', line: '#2C2C33', acc: '#FDD407', ink: '#111114', tx: '#FFFFFF', mut: '#B4B4BC' };
const UNIT = { 'i-eye': 'مشاهدة', 'i-heart': 'لايك', 'i-share': 'شير', 'i-save': 'حفظ', 'i-user': 'متابع' };
const ICONS = {
  'i-eye': '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/><circle cx="12" cy="12" r="3.4" fill="currentColor"/>',
  'i-heart': '<path fill="currentColor" d="M12 21s-7.5-4.6-9.5-9.2C1 8.2 3.4 4.5 7 4.5c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.6 0 6 3.7 4.5 7.3C19.5 16.4 12 21 12 21z"/>',
  'i-share': '<path fill="currentColor" d="M14 3.5l7.5 7.5-7.5 7.5v-4.2c-6 0-9.3 2.1-11.5 6.2 0-7.3 3.3-12.3 11.5-13.3z"/>',
  'i-save': '<path fill="currentColor" d="M6 2.5h12a1 1 0 0 1 1 1V22l-7-4.6L5 22V3.5a1 1 0 0 1 1-1z"/>',
  'i-user': '<circle cx="9" cy="7.5" r="4.2" fill="currentColor"/><path fill="currentColor" d="M1.5 21c0-4.4 3.4-7.2 7.5-7.2s7.5 2.8 7.5 7.2z"/><path d="M19.5 7.5v7M16 11h7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
  'bolt': '<path fill="currentColor" d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
};
const ic = (k, s, c) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" style="color:${c};display:block">${ICONS[k]}</svg>`;
const n = x => Number(x).toLocaleString('en-US');

const BASE = `
@font-face{font-family:R;src:url(${font('readex-pro-arabic-700-normal.woff2')}) format('woff2');font-weight:700;unicode-range:U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF}
@font-face{font-family:R;src:url(${font('readex-pro-latin-700-normal.woff2')}) format('woff2');font-weight:700}
@font-face{font-family:R;src:url(${font('readex-pro-arabic-400-normal.woff2')}) format('woff2');font-weight:400;unicode-range:U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF}
@font-face{font-family:R;src:url(${font('readex-pro-latin-400-normal.woff2')}) format('woff2');font-weight:400}
*{box-sizing:border-box;margin:0}
html,body{width:1080px;height:1080px;overflow:hidden}
body{font-family:R;direction:rtl;background:${C.bg};color:${C.tx}}
.cv{position:absolute;inset:0;overflow:hidden}
.glow{position:absolute;width:980px;height:980px;border-radius:50%;background:radial-gradient(closest-side,${C.acc}30,transparent);top:-470px;right:-330px}
.top{position:absolute;top:60px;inset-inline:60px;display:flex;justify-content:space-between;align-items:center}
.brand{display:flex;align-items:center;gap:16px;font-size:44px;font-weight:700}
.brand i{width:72px;height:72px;border-radius:20px;background:${C.acc};display:grid;place-items:center}
.tag{font-size:40px;font-weight:700;padding:12px 30px;border-radius:99px;background:${C.acc};color:${C.ink}}
h1{position:absolute;top:186px;inset-inline:60px;font-size:112px;line-height:1.08;font-weight:700;white-space:nowrap}
.sub{position:absolute;top:338px;inset-inline:60px;font-size:46px;color:${C.mut};display:flex;align-items:center;gap:18px}
.g{position:absolute;bottom:60px;inset-inline:60px;display:grid;grid-template-columns:1fr 1fr;gap:22px}
`;

// اختيار 6 كميات موزعة: الأصغر، الأكبر، الأكثر طلباً، والباقي بالتساوي
function pick6(tiers, hot) {
  const s = [...tiers].sort((a, b) => a - b);
  if (s.length <= 6) return s;
  const keep = new Set([0, s.length - 1, Math.max(0, s.indexOf(hot))]);
  for (let k = 1; keep.size < 6; k++) keep.add(Math.round((k * (s.length - 1)) / 6));
  return [...keep].sort((a, b) => a - b).map(i => s[i]);
}

function single(s) {
  // تصميم الخدمة: أيقونة كبيرة في المنتصف + اسم الخدمة بهايلايت أصفر، بدون كميات
  const name = s.name.replace(' تيك توك', '');
  return `<style>${BASE}
  .hero{position:absolute;inset:170px 60px 70px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:54px;text-align:center}
  .big{width:380px;height:380px;border-radius:100px;background:${C.card};border:4px solid ${C.line};display:grid;place-items:center;box-shadow:0 40px 90px -40px ${C.acc}66}
  .nm{font-size:150px;line-height:1.25;font-weight:700;color:${C.ink};background:${C.acc};padding:4px 54px 22px;border-radius:34px;transform:rotate(-2deg)}
  .nm-wrap{display:flex;flex-direction:column;align-items:center;gap:26px}
  .tt{font-size:46px;color:${C.mut}}
  </style>
  <div class="glow"></div>
  <div class="top"><div class="brand"><i>${ic('bolt', 44, C.ink)}</i>فلاش ستور</div><div class="tag">تنفيذ آلي</div></div>
  <div class="hero"><div class="big">${ic(s.icon, 220, C.acc)}</div>
  <div class="nm-wrap"><div class="nm">${name}</div><div class="tt">تيك توك</div></div></div>`;
}

function pack(p, level, total) {
  const tiles = p.items.map(([i, num, u]) => `<div class="t"><div class="th"><span class="ti">${ic(i, 50, C.ink)}</span><small>${u}</small></div><b>${num}</b></div>`).join('');
  const bars = Array.from({ length: total }, (_, k) => `<i class="${k < level ? 'on' : ''}"></i>`).join('');
  return `<style>${BASE}
  .lv{display:flex;gap:10px}.lv i{width:56px;height:16px;border-radius:9px;background:${C.line}}.lv i.on{background:${C.acc}}
  .t{height:236px;border-radius:36px;background:${C.card};border:3px solid ${C.line};padding:26px 32px;display:flex;flex-direction:column;justify-content:space-between}
  .th{display:flex;align-items:center;gap:16px}
  .ti{width:84px;height:84px;border-radius:24px;background:${C.acc};display:grid;place-items:center}
  .t small{font-size:46px;color:${C.mut}}
  .t b{font-size:96px;line-height:1;direction:ltr;text-align:right}
  </style>
  <div class="glow"></div>
  <div class="top"><div class="brand"><i>${ic('bolt', 44, C.ink)}</i>فلاش ستور</div><div class="tag">${p.hot ? 'الأكثر طلباً' : p.regular ? 'عرض خاص' : 'باقة'}</div></div>
  <h1>${p.name}</h1>
  <div class="sub">المستوى <span class="lv">${bars}</span></div>
  <div class="g">${tiles}</div>`;
}

(async () => {
  const out = path.join(ROOT, 'img');
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 1080, height: 1080 } });
  const jobs = [];
  const packs = D.packs.filter(p => !p.out).sort((a, b) => a.price - b.price);
  packs.forEach((p, i) => jobs.push([p.slug, pack(p, i + 1, packs.length)]));
  D.singles.forEach(s => jobs.push([s.slug, single(s)]));
  for (const [slug, html] of jobs) {
    await pg.setContent(`<!doctype html><meta charset="utf-8"><body><div class="cv">${html}</div></body>`, { waitUntil: 'load' });
    await pg.evaluate(() => document.fonts.ready);
    const over = await pg.evaluate(() => [...document.querySelectorAll('h1,.sub')].some(e => e.scrollWidth > e.clientWidth + 1));
    if (over) console.warn('تحذير: نص أعرض من الصورة في', slug);
    await pg.screenshot({ path: path.join(out, slug + '.png') });
    console.log('img', slug);
  }
  await b.close();
})();
