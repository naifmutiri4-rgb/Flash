// ③ «لوحة تحكم» — مختبر نمو: أخضر ليلي + نعناعي، أخضر حمضي، ويدجت وإحصائيات وأرقام مونو
const { icon, iconFill, singles, packs, n, k, sar } = require('./data');
const C = { bg: '#08130F', bg2: '#D9F5E6', ac: '#9BFF3C', ink: '#08130F', mut: '#7FA493', card: '#0F211A', line: '#1C3A2E' };
const M = "'JetBrains Mono',monospace";
const spark = (seed, w = 120, h = 36, col = C.ac) => { let y = h - 6, d = `M0 ${y}`; for (let i = 1; i <= 8; i++) { y = Math.max(4, y - ((i * seed) % 7) + 2); d += ` L${(w / 8) * i} ${y}`; } return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><path d="${d}" fill="none" stroke="${col}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="${d} L${w} ${h} L0 ${h}Z" fill="${col}" opacity=".12"/></svg>`; };

const pimg = (s, sz = 500) => `
<div class="pimg" style="width:${sz}px;height:${sz}px">
  <svg viewBox="0 0 500 500" width="${sz}" height="${sz}">
    <defs><linearGradient id="b3${s.key}${sz}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${C.ac}" stop-opacity=".25"/><stop offset="1" stop-color="${C.ac}"/></linearGradient></defs>
    <rect width="500" height="500" fill="${C.bg}"/>
    <g stroke="${C.line}" stroke-width="1">${Array.from({ length: 9 }, (_, i) => `<line x1="40" y1="${120 + i * 30}" x2="460" y2="${120 + i * 30}"/>`).join('')}</g>
    ${[60, 95, 130, 175, 225, 290].map((h, i) => `<g transform="translate(${70 + i * 66} ${360 - h})"><path d="M0 0 h40 v${h} h-40Z" fill="url(#b3${s.key}${sz})"/><path d="M0 0 l12 -10 h40 l-12 10Z" fill="#C8FF8A"/><path d="M40 0 l12 -10 v${h} l-12 10Z" fill="#5FA324"/></g>`).join('')}
    <path d="M70 330 C160 300 220 260 300 190 S420 90 450 70" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="6 6"/>
    <circle cx="450" cy="70" r="8" fill="#fff"/>
    <rect x="30" y="30" width="188" height="70" rx="14" fill="${C.card}" stroke="${C.line}"/>
    <g transform="translate(46 50)" style="color:${C.ac}">${iconFill(s.ic, 30)}</g>
    <text x="200" y="62" font-family="Tajawal" font-size="22" font-weight="800" fill="#fff" text-anchor="end">${s.short}</text>
    <text x="200" y="88" font-family="JetBrains Mono" font-size="14" fill="${C.mut}" text-anchor="end">FLASH · TT</text>
    <rect x="30" y="400" width="440" height="70" rx="14" fill="${C.ac}"/>
    <text x="450" y="446" font-family="Tajawal" font-size="28" font-weight="800" fill="${C.ink}" text-anchor="end">${s.name}</text>
    <text x="50" y="446" font-family="JetBrains Mono" font-size="24" font-weight="800" fill="${C.ink}">▲ ${k(s.q[2][0])}</text>
  </svg>
</div>`;

const hero = `
<div id="hero" class="hero">
  <div class="grid-bg"></div>
  <svg class="iso" viewBox="0 0 390 300" width="390" height="300"><defs><linearGradient id="hb" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#9BFF3C" stop-opacity=".15"/><stop offset="1" stop-color="#9BFF3C"/></linearGradient></defs>
  ${[50, 80, 115, 155, 200, 250].map((h, i) => `<g transform="translate(${40 + i * 54} ${285 - h - i * 4})"><path d="M0 0 h32 v${h} h-32Z" fill="url(#hb)"/><path d="M0 0 l14 -12 h32 l-14 12Z" fill="#D7FF9E"/><path d="M32 0 l14 -12 v${h} l-14 12Z" fill="#4E8C1C"/></g>`).join('')}
  <path d="M50 250 C120 230 200 180 260 110 S340 30 360 20" fill="none" stroke="#fff" stroke-width="2.5" stroke-dasharray="6 6"/><circle cx="360" cy="20" r="6" fill="#fff"/></svg>
  <div class="hud h1"><small class="m">VIEWS</small><b class="m">+10,000</b>${spark(5, 110, 28)}</div>
  <div class="hud h2"><small class="m">STATUS</small><b>● يشتغل الحين</b></div>
  <div class="hero-copy"><span class="m kick">// FLASH.LAB</span><h1>راقب مقطعك<br><em>يطلع.</em></h1><p>اختر الرقم اللي تبيه. التنفيذ فوري بعد الدفع.</p></div>
</div>`;

const header = `<header class="hd"><div class="logo"><span>${iconFill('bolt', 15)}</span><b>flash</b><small class="m">store</small></div><div class="hd-r"><button>${icon('search', 19)}</button><button>${icon('user', 19)}</button><button class="cartb">${icon('cart', 19)}<em class="m">1</em></button></div></header>
<div class="status m"><span>● ONLINE</span><span>CODE: F10 = -10%</span><span>⚡ INSTANT</span></div>`;

const home = `
<section class="scr" id="home">${header}${hero}
  <div class="sec">
    <div class="sh"><h2>الخدمات</h2><span class="m">04 SERVICES</span></div>
    <div class="widgets">${singles.map((s, i) => `<a class="wd"><div class="wd-t"><span class="wd-ic">${icon(s.ic, 18)}</span><span class="m tag">${k(s.q[0][0])}–${k(s.q.at(-1)[0])}</span></div><b>${s.short}</b>${spark(3 + i, 140, 34)}<div class="wd-p"><small>من</small><b class="m">${sar(s.from)}</b><small>ر.س</small></div></a>`).join('')}</div>
  </div>
  <div class="sec mint">
    <div class="sh"><h2>الخطط</h2><span class="m">05 PLANS</span></div>
    <div class="plans">${packs.map((p, i) => `<a class="plan ${i === 2 ? 'hot' : ''}"><div class="pl-h"><b>${p.name}</b><span class="m pr">${sar(p.price)} <small>ر.س</small></span></div>
      <div class="meters">${[['eye', p.v, 20000], ['heart', p.l, 1500], ['share', p.s, 750], ['save', p.f, 750]].map(([ic, val, max]) => `<div class="mt">${icon(ic, 13)}<span class="m">${k(val)}</span><i><u style="width:${Math.round(val / max * 100)}%"></u></i></div>`).join('')}</div></a>`).join('')}</div>
  </div>
  <div class="sec"><div class="sh"><h2>طريقة التشغيل</h2></div>
    <div class="term m"><p><span>$</span> اختر الخدمة والكمية</p><p><span>$</span> الصق رابط المقطع</p><p><span>$</span> ادفع عبر سلة</p><p class="ok">✓ يبدأ التنفيذ فوراً</p></div>
    <div class="kpis"><div><b class="m">⚡</b><small>تنفيذ فوري</small></div><div><b class="m">↺</b><small>تعويض حسب السياسة</small></div><div><b class="m">🔒</b><small>دفع آمن</small></div></div>
  </div>
</section>`;

const v = singles[0];
const product = `
<section class="scr" id="product">${header}
  <div class="pp-img">${pimg(v, 358)}</div>
  <div class="ph"><span class="m kick">SERVICE / VIEWS</span><h1>${v.name}</h1></div>
  <div class="counter"><small class="m">SELECTED</small><div class="cn"><b class="m">10,000</b><span>مشاهدة</span></div><div class="cn-p"><b class="m">12.99</b><small>ر.س</small></div></div>
  <div class="meter">${v.q.map(([q, p], i) => `<div class="seg ${i <= 2 ? 'f' : ''} ${i === 2 ? 'cur' : ''}"><i></i><span class="m">${k(q)}</span></div>`).join('')}</div>
  <div class="opts">${v.q.map(([q, p], i) => `<label class="${i === 2 ? 'on' : ''}"><span class="m q">${k(q)}</span><span class="m p">${sar(p)}</span></label>`).join('')}</div>
  <div class="field"><label class="m">// رابط المقطع</label><div class="inp m">${icon('link', 16)} https://www.tiktok.com/@…/video/…</div></div>
  <div class="specs"><div><small class="m">ETA</small><b>فوري</b></div><div><small class="m">SOURCE</small><b>أجانب</b></div><div><small class="m">REFILL</small><b>حسب السياسة</b></div></div>
  <div class="warn">${icon('shield', 18)}<p>الحساب لازم يكون عام. ما نطلب كلمة المرور أبداً.</p></div>
  <div class="buybar"><div class="qty m"><button>−</button><span>1</span><button>+</button></div><button class="buy">${icon('bolt', 18)} تشغيل الطلب</button></div>
  <div class="loading"><span class="m">ADDING TO CART…</span><i><u></u></i></div>
</section>`;

const cart = `
<section class="scr" id="cart">${header}
  <div class="ph"><span class="m kick">CART / 01 ITEM</span><h1>ملخص التشغيل</h1></div>
  <div class="ok-bar m">✓ ADDED · تمت الإضافة</div>
  <div class="ci"><div class="ci-img">${pimg(v, 76)}</div><div class="ci-b"><b>${v.name}</b><span class="m">10,000 × 1</span><span class="m lnk">tiktok.com/@…/video/…</span></div><b class="m">12.99</b></div>
  <div class="console m"><p><span>subtotal</span><b>12.99</b></p><p><span>coupon</span><b class="ac">F10 ▸ تطبيق</b></p><p class="tt"><span>الإجمالي</span><b>12.99 ر.س</b></p></div>
  <button class="buy wide">${icon('bolt', 18)} إتمام الطلب</button>
  <button class="apay"> Pay</button>
</section>`;

const css = `
:root{--bg:${C.bg};--mint:${C.bg2};--ac:${C.ac};--mut:${C.mut};--card:${C.card};--line:${C.line}}
body{font-family:'Tajawal',sans-serif;background:#222;margin:0}.m{font-family:${M}}
.scr{width:390px;background:var(--bg);color:#E8FFF2;overflow:hidden;padding-bottom:24px}
.hd{display:flex;justify-content:space-between;align-items:center;padding:12px 16px}.hd-r{display:flex;gap:6px}
.hd button{width:40px;height:40px;border-radius:10px;border:1px solid var(--line);background:var(--card);color:#E8FFF2;display:grid;place-items:center;position:relative}
.cartb{background:var(--ac)!important;color:var(--bg)!important;border:0!important}.cartb em{position:absolute;top:-6px;left:-6px;font-style:normal;font-size:10px;background:#fff;color:var(--bg);border-radius:4px;padding:1px 5px}
.logo{display:flex;align-items:center;gap:6px}.logo span{width:28px;height:28px;border-radius:8px;background:var(--ac);color:var(--bg);display:grid;place-items:center}.logo b{font-size:20px;font-weight:800;font-family:${M};letter-spacing:-1px}.logo small{color:var(--mut);font-size:12px}
.status{display:flex;justify-content:space-between;font-size:11px;padding:7px 16px;border-block:1px solid var(--line);color:var(--ac)}
.hero{position:relative;height:520px;overflow:hidden}.grid-bg{position:absolute;inset:0;background-image:linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px);background-size:28px 28px;mask:radial-gradient(260px 240px at 50% 35%,#000,transparent)}
.iso{position:absolute;top:30px;left:0;filter:drop-shadow(0 0 24px #9BFF3C55)}
.bar{width:28px;height:var(--h);background:linear-gradient(0deg,#3D7A1A,var(--ac));position:relative;transform-style:preserve-3d;box-shadow:0 0 30px #9BFF3C44}
.bar::after{content:"";position:absolute;inset:0;transform:translateZ(0)}
.bar i{position:absolute;top:0;left:0;width:28px;height:28px;background:#D7FF9E;transform-origin:top;transform:rotateX(90deg)}
.hud{position:absolute;background:#0F211Aee;border:1px solid var(--line);border-radius:12px;padding:10px 12px;display:grid;gap:3px;box-shadow:0 20px 40px -10px #000}.hud small{font-size:10px;color:var(--mut)}.hud b{font-size:20px;color:var(--ac)}
.h1{top:24px;left:14px}.h2{top:250px;right:14px}.h2 b{font-size:14px;color:#E8FFF2;font-family:Tajawal}
.hero-copy{position:absolute;bottom:22px;inset-inline:18px}.kick{font-size:11px;color:var(--ac);letter-spacing:1px}.hero-copy h1{font-size:46px;line-height:1.05;margin:8px 0 10px;font-weight:800}.hero-copy em{font-style:normal;color:var(--ac)}.hero-copy p{margin:0;color:var(--mut);font-size:16px}
.sec{padding:26px 16px}.sh{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:14px}.sh h2{font-size:28px;margin:0;font-weight:800}.sh span{font-size:11px;color:var(--mut)}
.widgets{display:grid;grid-template-columns:1fr 1fr;gap:10px}.wd{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:12px;display:grid;gap:6px}
.wd-t{display:flex;justify-content:space-between;align-items:center}.wd-ic{width:32px;height:32px;border-radius:9px;background:#9BFF3C1A;color:var(--ac);display:grid;place-items:center}.tag{font-size:10px;color:var(--mut);direction:ltr}
.wd>b{font-size:19px}.wd svg{width:100%}.wd-p{display:flex;align-items:baseline;gap:4px}.wd-p small{font-size:11px;color:var(--mut)}.wd-p b{font-size:20px;color:var(--ac)}
.mint{background:var(--mint);color:var(--bg)}.mint .sh span{color:#3C6B55}
.plans{display:grid;gap:8px}.plan{background:#fff;border-radius:14px;padding:12px 14px;border:1px solid #B9E3CC}.plan.hot{background:var(--bg);color:#E8FFF2;border-color:var(--bg)}
.pl-h{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px}.pl-h b{font-size:17px}.pr{font-weight:800;font-size:18px}.pr small{font-family:Tajawal;font-weight:400;font-size:11px}
.meters{display:grid;grid-template-columns:1fr 1fr;gap:5px 12px}.mt{display:flex;align-items:center;gap:6px;font-size:11px}.mt span{width:34px}.mt i{flex:1;height:5px;border-radius:3px;background:#08130F1A}.plan.hot .mt i{background:#ffffff1A}.mt u{display:block;height:100%;border-radius:3px;background:#2E7D32}.plan.hot .mt u{background:var(--ac)}
.term{background:#050C09;border:1px solid var(--line);border-radius:14px;padding:14px;font-size:13px;line-height:2}.term p{margin:0;font-family:Tajawal;font-size:15px}.term span{color:var(--ac);margin-inline-end:8px}.term .ok{color:var(--ac)}
.kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px}.kpis div{border:1px solid var(--line);border-radius:12px;padding:10px;text-align:center;display:grid;gap:4px}.kpis b{font-size:18px;color:var(--ac)}.kpis small{font-size:12px;color:var(--mut)}
.pp-img{padding:4px 16px}.pp-img .pimg{border-radius:20px;overflow:hidden;border:1px solid var(--line)}
.ph{padding:14px 16px 4px}.ph h1{font-size:28px;margin:4px 0 0}
.counter{margin:12px 16px;padding:14px 16px;border-radius:16px;background:var(--card);border:1px solid var(--line);display:grid;grid-template-columns:1fr auto;align-items:end}.counter small{grid-column:1/-1;font-size:10px;color:var(--mut)}
.cn b{font-size:38px;color:var(--ac);letter-spacing:-1px}.cn span{color:var(--mut);margin-inline-start:6px}.cn-p{text-align:left}.cn-p b{font-size:26px}.cn-p small{color:var(--mut);display:block;font-size:12px}
.meter{display:grid;grid-template-columns:repeat(9,1fr);gap:3px;margin:0 16px 12px}.seg{display:grid;gap:4px;text-align:center}.seg i{height:22px;border-radius:4px;background:var(--card);border:1px solid var(--line)}.seg.f i{background:var(--ac);border-color:var(--ac);opacity:.55}.seg.cur i{opacity:1;box-shadow:0 0 16px #9BFF3C88}.seg span{font-size:9px;color:var(--mut)}
.opts{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:0 16px 14px}.opts label{border:1px solid var(--line);border-radius:10px;padding:10px 8px;display:flex;justify-content:space-between;align-items:baseline;background:var(--card)}.opts .q{font-weight:800;font-size:15px}.opts .p{font-size:11px;color:var(--mut)}
.opts label.on{border-color:var(--ac);background:#9BFF3C14;box-shadow:inset 0 0 0 1px var(--ac)}.opts label.on .p{color:var(--ac)}
.field{margin:0 16px 12px}.field label{font-size:12px;color:var(--ac);display:block;margin-bottom:6px}.inp{display:flex;gap:8px;align-items:center;border:1px solid var(--line);border-radius:12px;padding:14px 12px;background:#050C09;font-size:12px;color:var(--mut);direction:ltr}
.specs{margin:0 16px 12px;display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.specs div{background:var(--mint);color:var(--bg);border-radius:12px;padding:10px;display:grid;gap:2px}.specs small{font-size:9.5px;color:#3C6B55}.specs b{font-size:15px}
.warn{margin:0 16px 14px;display:flex;gap:10px;align-items:center;padding:12px;border-radius:12px;border:1px dashed #9BFF3C66;color:var(--ac)}.warn p{margin:0;color:#CFEBDD;font-size:13.5px}
.buybar{display:flex;gap:8px;margin:0 16px}.qty{display:flex;align-items:center;border:1px solid var(--line);border-radius:12px}.qty button{width:34px;height:54px;border:0;background:none;color:#fff;font-size:18px}
.buy{flex:1;height:56px;border:0;border-radius:12px;background:var(--ac);color:var(--bg);font:800 18px Tajawal;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 0 0 4px #9BFF3C22}
.loading{margin:10px 16px 0;display:grid;gap:5px}.loading span{font-size:10px;color:var(--mut)}.loading i{height:4px;border-radius:2px;background:var(--card)}.loading u{display:block;width:62%;height:100%;border-radius:2px;background:var(--ac)}
.ok-bar{margin:8px 16px 12px;padding:10px 12px;border-radius:10px;background:var(--ac);color:var(--bg);font-size:13px;font-weight:800}
.ci{margin:0 16px 12px;display:flex;gap:10px;align-items:center;background:var(--card);border:1px solid var(--line);border-radius:14px;padding:10px}.ci-img .pimg{border-radius:10px;overflow:hidden}.ci-b{flex:1;display:grid;gap:2px}.ci-b span{font-size:11px;color:var(--mut)}.lnk{direction:ltr;text-align:right}.ci>b{font-size:20px;color:var(--ac)}
.console{margin:0 16px 14px;background:#050C09;border:1px solid var(--line);border-radius:14px;padding:6px 14px;font-size:14px}.console p{display:flex;justify-content:space-between;margin:0;padding:10px 0;border-bottom:1px dashed var(--line)}.console p:last-child{border:0}.console span{color:var(--mut)}.ac{color:var(--ac)}.console .tt{font-size:18px}.tt span{color:#E8FFF2;font-family:Tajawal;font-weight:800}
.buy.wide{width:calc(100% - 32px);margin:0 16px 8px}.apay{width:calc(100% - 32px);margin:0 16px;height:50px;border-radius:12px;background:#000;color:#fff;border:1px solid #333;font:700 18px -apple-system,sans-serif}
`;
module.exports = { id: 'd3-lab', title: 'لوحة تحكم', font: 'Tajawal:wght@400;500;700;800&family=JetBrains+Mono:wght@400;800', css, body: home + product + cart, asset: pimg(singles[0], 500) };
