// يولّد صور المنتجات (1080×1080) من data.json — التشغيل: node v2/_tools/images.js
// يحتاج Playwright + Chromium. المخرجات: v2/img/<slug>.png (للرفع على سلة) و <slug>.webp (للموقع)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const D = JSON.parse(fs.readFileSync(path.join(ROOT, '..', '_src', 'data.json'), 'utf8'));
const font = f => 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'fonts', f)).toString('base64');

// نظام الألوان: لكل مقياس لون ثابت في كل المتجر
const M = {
  'i-eye':   { c: '#2F6BFF', t: '#EAF0FF', n: 'مشاهدة' },
  'i-heart': { c: '#FF2D6F', t: '#FFE9F0', n: 'لايك' },
  'i-share': { c: '#0FA968', t: '#E4F7EE', n: 'شير' },
  'i-save':  { c: '#F28A00', t: '#FFF1DD', n: 'حفظ' },
  'i-user':  { c: '#7347FF', t: '#EFE9FF', n: 'متابع' },
};
const ICONS = {
  'i-eye': '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><circle cx="12" cy="12" r="3.2" fill="currentColor"/>',
  'i-heart': '<path fill="currentColor" d="M12 21s-7.5-4.6-9.5-9.2C1 8.2 3.4 4.5 7 4.5c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.6 0 6 3.7 4.5 7.3C19.5 16.4 12 21 12 21z"/>',
  'i-share': '<path fill="currentColor" d="M14 3.5l7.5 7.5-7.5 7.5v-4.2c-6 0-9.3 2.1-11.5 6.2 0-7.3 3.3-12.3 11.5-13.3z"/>',
  'i-save': '<path fill="currentColor" d="M6 2.5h12a1 1 0 0 1 1 1V22l-7-4.6L5 22V3.5a1 1 0 0 1 1-1z"/>',
  'i-user': '<circle cx="9" cy="7.5" r="4.2" fill="currentColor"/><path fill="currentColor" d="M1.5 21c0-4.4 3.4-7.2 7.5-7.2s7.5 2.8 7.5 7.2z"/><path d="M19.5 7.5v7M16 11h7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
  'bolt': '<path fill="currentColor" d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
};
const ic = (k, s, c) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" style="color:${c};display:block">${ICONS[k]}</svg>`;
const n = x => Number(x).toLocaleString('en-US');
const short = x => n(x);

const BASE = `
@font-face{font-family:R;src:url(${font('readex-pro-arabic-700-normal.woff2')}) format('woff2');font-weight:700;unicode-range:U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF}
@font-face{font-family:R;src:url(${font('readex-pro-latin-700-normal.woff2')}) format('woff2');font-weight:700}
@font-face{font-family:R;src:url(${font('readex-pro-arabic-400-normal.woff2')}) format('woff2');font-weight:400;unicode-range:U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF}
@font-face{font-family:R;src:url(${font('readex-pro-latin-400-normal.woff2')}) format('woff2');font-weight:400}
*{box-sizing:border-box;margin:0}
html,body{width:1080px;height:1080px;overflow:hidden}
.cv{position:absolute;inset:0;overflow:hidden}
body{font-family:R;direction:rtl;position:relative;overflow:hidden}
.top{position:absolute;top:64px;inset-inline:64px;display:flex;justify-content:space-between;align-items:center}
.brand{display:flex;align-items:center;gap:14px;font-size:34px;font-weight:700}
.brand i{width:56px;height:56px;border-radius:16px;background:#FDD407;display:grid;place-items:center}
.tag{font-size:28px;font-weight:700;padding:12px 24px;border-radius:99px}
`;

// صورة خدمة مفردة: لون المقياس + الأيقونة + الاسم + كل الكميات المتاحة
function single(s) {
  const m = M[s.icon], tiers = s.tiers.map(t => t[0]).sort((a, b) => a - b);
  const cols = tiers.length > 9 ? 4 : 3, rows = Math.ceil(tiers.length / cols);
  const ch = rows > 3 ? 88 : 104, fs = rows > 3 ? 40 : 46;
  const hot = s.hot;
  const chips = tiers.map(q => `<div class="q${q === hot ? ' h' : ''}">${short(q)}${q === hot ? '<em>الأكثر طلباً</em>' : ''}</div>`).join('');
  return `<style>${BASE}
  body{background:${m.t};color:#111114}
  .bg{position:absolute;width:760px;height:760px;border-radius:50%;background:${m.c};opacity:.08;top:-260px;left:-260px}
  .brand i{color:#111114}
  .tag{background:#fff;color:${m.c}}
  .hd{position:absolute;top:190px;inset-inline:64px;display:flex;align-items:center;gap:36px}
  .gl{width:200px;height:200px;border-radius:52px;background:${m.c};display:grid;place-items:center;box-shadow:0 30px 60px -20px ${m.c}99}
  h1{font-size:74px;line-height:1.1;font-weight:700;white-space:nowrap}
  h1 small{display:block;font-size:34px;color:#55555c;font-weight:400;margin-top:12px}
  .grid{position:absolute;bottom:64px;inset-inline:64px;display:grid;grid-template-columns:repeat(${cols},1fr);gap:16px}
  .q{position:relative;height:${ch}px;border-radius:24px;background:#fff;display:grid;place-items:center;font-size:${fs}px;font-weight:700;direction:ltr;border:3px solid transparent}
  .q.h{background:${m.c};color:#fff}
  .q em{position:absolute;top:-18px;font-style:normal;font-size:20px;background:#111114;color:#FDD407;padding:4px 14px;border-radius:99px;direction:rtl}
  .lbl{position:absolute;bottom:${64 + rows * ch + (rows - 1) * 16 + 24}px;inset-inline-start:64px;font-size:30px;color:#55555c}
  </style>
  <div class="bg"></div>
  <div class="top"><div class="brand"><i>${ic('bolt', 32, '#111114')}</i>فلاش ستور</div><div class="tag">تنفيذ آلي فوري</div></div>
  <div class="hd"><div class="gl">${ic(s.icon, 116, '#fff')}</div><h1>${s.name}<small>اختر الكمية: ${n(tiers[0])} – ${n(tiers[tiers.length - 1])} ${m.n}</small></h1></div>
  <div class="lbl">الكميات المتاحة</div>
  <div class="grid">${chips}</div>`;
}

// صورة باقة: خلفية داكنة + مستوى الباقة + 4 مربعات ملونة بالكميات
function pack(p, level, total) {
  const tiles = p.items.map(([i, num, u]) => `<div class="t" style="--c:${M[i].c}"><span class="ti">${ic(i, 56, '#fff')}</span><b>${num}</b><small>${u}</small></div>`).join('');
  const bars = Array.from({ length: total }, (_, k) => `<i class="${k < level ? 'on' : ''}"></i>`).join('');
  return `<style>${BASE}
  body{background:#111114;color:#fff}
  .glow{position:absolute;width:900px;height:900px;border-radius:50%;background:radial-gradient(closest-side,#FDD40733,transparent);top:-420px;right:-300px}
  .brand i{color:#111114}
  .tag{background:#FDD407;color:#111114}
  h1{position:absolute;top:196px;inset-inline:64px;font-size:96px;line-height:1.1;font-weight:700}
  .lv{position:absolute;top:338px;inset-inline:64px;display:flex;align-items:center;gap:18px;font-size:30px;color:#A9A9B2}
  .lv span{display:flex;gap:8px}.lv i{width:46px;height:12px;border-radius:9px;background:#2C2C33}.lv i.on{background:#FDD407}
  .g{position:absolute;bottom:64px;inset-inline:64px;display:grid;grid-template-columns:1fr 1fr;gap:20px}
  .t{height:246px;border-radius:36px;background:#1D1D22;border:2px solid #2A2A31;padding:30px 34px;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden}
  .t::after{content:"";position:absolute;inset-inline-end:-60px;bottom:-60px;width:200px;height:200px;border-radius:50%;background:var(--c);opacity:.18}
  .ti{width:92px;height:92px;border-radius:26px;background:var(--c);display:grid;place-items:center}
  .t b{font-size:72px;line-height:1;direction:ltr;text-align:right}
  .t small{font-size:30px;color:#A9A9B2;position:absolute;top:56px;inset-inline-end:34px}
  </style>
  <div class="glow"></div>
  <div class="top"><div class="brand"><i>${ic('bolt', 32, '#111114')}</i>فلاش ستور</div><div class="tag">${p.hot ? 'الأكثر طلباً' : 'باقة تيك توك'}</div></div>
  <h1>${p.name}</h1>
  <div class="lv">مستوى التفاعل <span>${bars}</span></div>
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
    await pg.screenshot({ path: path.join(out, slug + '.png') });
    console.log('img', slug);
  }
  await b.close();
})();
