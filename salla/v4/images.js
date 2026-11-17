// صور منتجات فلاش ستور v4 (1080×1080) — هوية Dark Luxury Tech بالبرتقالي والذهبي.
// التشغيل: node salla/v4/images.js  ← المخرجات: salla/v4/img/<slug>.png
// القاعدة: نظام واحد للهوية، لكن كل منتج له تكوين خاص به:
//   - الباقات: رقم المشاهدات هو البطل (2K / 5K / 10K / 15K / 20K) + حلقة مستوى تختلف لكل باقة + 4 أرقام المحتوى.
//   - الخدمات المفردة: أيقونة الخدمة كبيرة + الاسم بهايلايت + نقش خلفية خاص بالخدمة (بدون كميات، حسب طلب المتجر).
// مقروءة على الجوال بعمودين (الصورة ~170px): أصغر نص مهم ≥ 44px في الأصل.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const D = JSON.parse(fs.readFileSync(path.join(ROOT, '_src', 'data.json'), 'utf8'));
const font = f => 'data:font/woff2;base64,' + fs.readFileSync(path.join(ROOT, 'v2', 'fonts', f)).toString('base64');

const C = { bg: '#111111', s1: '#1E1E1E', line: '#343434', p: '#FC9E01', pl: '#FFC04D', pd: '#C77A00', ink: '#111111', fg: '#FFFFFF', mut: '#B8B8B8' };
const ICONS = {
  'i-eye': '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><circle cx="12" cy="12" r="3.3" fill="currentColor"/>',
  'i-heart': '<path fill="currentColor" d="M12 20.5s-7.5-4.6-9.5-9.2C1 7.7 3.4 4 7 4c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.6 0 6 3.7 4.5 7.3-2 4.6-9.5 9.2-9.5 9.2z"/>',
  'i-share': '<path fill="currentColor" d="M14 3.5l7.5 7.5-7.5 7.5v-4.2c-6 0-9.3 2.1-11.5 6.2 0-7.3 3.3-12.3 11.5-13.3z"/>',
  'i-save': '<path fill="currentColor" d="M6 2.5h12a1 1 0 0 1 1 1V22l-7-4.6L5 22V3.5a1 1 0 0 1 1-1z"/>',
  'bolt': '<path fill="currentColor" d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
};
const ic = (k, s, c, extra = '') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" style="color:${c};display:block;${extra}">${ICONS[k]}</svg>`;
const UNIT = { 'i-eye': 'مشاهدة', 'i-heart': 'لايك', 'i-share': 'شير', 'i-save': 'حفظ' };
// «الأكثر طلباً» = الأكثر مبيعاً آخر 90 يوم في تقارير سلة (بكج التوفير)، نفس اللي في الرئيسية
const HOT = 'saver';
const short = s => { const v = Number(String(s).replace(/,/g, '')); return v >= 1000 ? (v / 1000) + 'K' : String(v); };

const BASE = `
@font-face{font-family:R;src:url(${font('readex-pro-arabic-700-normal.woff2')}) format('woff2');font-weight:700;unicode-range:U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF}
@font-face{font-family:R;src:url(${font('readex-pro-latin-700-normal.woff2')}) format('woff2');font-weight:700}
@font-face{font-family:R;src:url(${font('readex-pro-arabic-400-normal.woff2')}) format('woff2');font-weight:400;unicode-range:U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF}
@font-face{font-family:R;src:url(${font('readex-pro-latin-400-normal.woff2')}) format('woff2');font-weight:400}
*{box-sizing:border-box;margin:0}
html,body{width:1080px;height:1080px;overflow:hidden}
body{font-family:R;direction:rtl;background:${C.bg};color:${C.fg}}
.cv{position:absolute;inset:0;overflow:hidden;background:radial-gradient(90% 70% at 85% 0%,#2A1C05 0%,${C.bg} 62%)}
.frame{position:absolute;inset:28px;border:2px solid ${C.line};border-radius:56px;pointer-events:none}
.top{position:absolute;top:70px;inset-inline:0;display:flex;justify-content:center;align-items:center}
.brand{display:flex;align-items:center;gap:14px;font-size:40px;font-weight:700;color:${C.fg}}
.brand i{width:62px;height:62px;border-radius:18px;background:${C.p};display:grid;place-items:center}
.tag{font-size:36px;font-weight:700;padding:10px 26px;border-radius:99px;border:2px solid ${C.p};color:${C.p}}
.tag.solid{background:${C.p};color:${C.ink}}
.gold{background:linear-gradient(180deg,${C.pl} 0%,${C.p} 55%,${C.pd} 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
`;

// حلقة المستوى: عدد الأقواس المضيئة = ترتيب الباقة (تختلف لكل باقة)
function ring(level, total, size) {
  const r = size / 2 - 14, cx = size / 2, gap = 7, seg = 360 / total;
  const arc = (a0, a1) => {
    const p = a => [cx + r * Math.cos((a - 90) * Math.PI / 180), cx + r * Math.sin((a - 90) * Math.PI / 180)];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  };
  let s = '';
  for (let k = 0; k < total; k++) {
    const on = k < level;
    s += `<path d="${arc(k * seg + gap / 2, (k + 1) * seg - gap / 2)}" fill="none" stroke="${on ? C.p : C.line}" stroke-width="16" stroke-linecap="round"/>`;
  }
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="position:absolute;inset:0">${s}</svg>`;
}

function pack(p, level, total) {
  const views = p.items.find(i => i[0] === 'i-eye')[1];
  const rest = p.items.filter(i => i[0] !== 'i-eye');
  const tag = p.slug === HOT ? '<div class="tag solid" style="align-self:flex-start">الأكثر طلباً</div>' : '';
  const stats = rest.map(([i, n, u]) => `<div class="st"><span>${ic(i, 46, C.p)}</span><b>${n}</b><small>${u}</small></div>`).join('');
  return `<style>${BASE}
  .hero{position:absolute;top:200px;inset-inline:76px;display:flex;align-items:center;gap:44px}
  .dial{position:relative;width:420px;height:420px;flex:none;display:grid;place-items:center}
  .dial .in{display:flex;flex-direction:column;align-items:center;gap:6px}
  .dial .num{font-size:150px;line-height:1;font-weight:700;direction:ltr;letter-spacing:-2px}
  .dial .u{font-size:46px;color:${C.mut};display:flex;align-items:center;gap:10px}
  .name{display:flex;flex-direction:column;gap:18px;min-width:0}
  .name h1{font-size:96px;line-height:1.1;font-weight:700}
  .name p{font-size:44px;color:${C.mut};line-height:1.35}
  .row{position:absolute;bottom:76px;inset-inline:76px;display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
  .st{height:210px;border-radius:36px;background:${C.s1};border:2px solid ${C.line};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px}
  .st b{font-size:84px;line-height:1;font-weight:700;direction:ltr}
  .st small{font-size:40px;color:${C.mut}}
  </style>
  <div class="frame"></div>
  <div class="top"><div class="brand"><i>${ic('bolt', 38, C.ink)}</i>فلاش ستور</div></div>
  <div class="hero">
    <div class="dial">${ring(level, total, 420)}<div class="in">${ic('i-eye', 64, C.p)}<div class="num gold">${short(views)}</div><div class="u">مشاهدة</div></div></div>
    <div class="name"><h1>${p.name.replace('بكج ', 'بكج<br>')}</h1><p>مشاهدات ولايك<br>وشير وحفظ</p>${tag}</div>
  </div>
  <div class="row">${stats}</div>`;
}

// نقش خلفية خاص بكل خدمة (خفيف، عشان ما يزحم)
function motif(icon) {
  const cells = [];
  const pos = [[110, 760, 70, -12], [260, 880, 46, 10], [880, 820, 64, 14], [960, 640, 40, -8], [140, 560, 38, 6], [930, 420, 52, -16], [80, 330, 44, 12]];
  if (icon === 'i-eye') {
    for (let k = 1; k <= 5; k++) cells.push(`<circle cx="540" cy="470" r="${150 + k * 70}" fill="none" stroke="${C.p}" stroke-opacity="${(0.22 - k * 0.035).toFixed(3)}" stroke-width="3"/>`);
    return `<svg width="1080" height="1080" style="position:absolute;inset:0">${cells.join('')}</svg>`;
  }
  return pos.map(([x, y, s, r]) => ic(icon, s, C.p, `position:absolute;left:${x}px;top:${y}px;opacity:.16;transform:rotate(${r}deg)`)).join('');
}

function single(s) {
  const name = s.name.replace(' تيك توك', '');
  return `<style>${BASE}
  .hero{position:absolute;inset:170px 76px 96px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:56px;text-align:center}
  .big{width:360px;height:360px;border-radius:96px;background:${C.s1};border:4px solid ${C.p};display:grid;place-items:center;box-shadow:0 40px 100px -40px ${C.p}88}
  .nm{font-size:150px;line-height:1.22;font-weight:700;color:${C.ink};background:linear-gradient(180deg,${C.pl},${C.p});padding:2px 56px 22px;border-radius:34px;transform:rotate(-2deg)}
  .wrap{display:flex;flex-direction:column;align-items:center;gap:24px}
  .tt{font-size:46px;color:${C.mut}}
  </style>
  ${motif(s.icon)}
  <div class="frame"></div>
  <div class="top"><div class="brand"><i>${ic('bolt', 38, C.ink)}</i>فلاش ستور</div></div>
  <div class="hero"><div class="big">${ic(s.icon, 210, C.p)}</div>
  <div class="wrap"><div class="nm">${name}</div><div class="tt">تيك توك</div></div></div>`;
}

(async () => {
  const out = path.join(__dirname, 'img');
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 1080, height: 1080 } });
  const packs = D.packs.filter(p => !p.out).sort((a, b) => a.price - b.price);
  const jobs = packs.map((p, i) => [p.slug, pack(p, i + 1, packs.length)]).concat(D.singles.map(s => [s.slug, single(s)]));
  for (const [slug, html] of jobs) {
    await pg.setContent(`<!doctype html><meta charset="utf-8"><body><div class="cv">${html}</div></body>`, { waitUntil: 'load' });
    await pg.evaluate(() => document.fonts.ready);
    const over = await pg.evaluate(() => [...document.querySelectorAll('h1,.st b,.num,.nm')].filter(e => e.scrollWidth > e.clientWidth + 1 || e.getBoundingClientRect().right > 1080 || e.getBoundingClientRect().left < 0).map(e => e.textContent));
    if (over.length) console.warn('تحذير: نص يطلع برا في', slug, over);
    await pg.screenshot({ path: path.join(out, slug + '.png') });
    console.log('img', slug);
  }
  await b.close();
})();
