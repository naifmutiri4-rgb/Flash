// ① «بث مباشر» — شاشة لايف: حبري بنفسجي + لافندر، سماوي/وردي، كروت بشكل شاشة 9:16
const { icon, iconFill, singles, packs, n, k, sar } = require('./data');
const C = { bg: '#0B0A12', bg2: '#EEEBFF', cy: '#00E5D4', pk: '#FF3D7F', ink: '#0B0A12', mut: '#9A96B5', card: '#16142A' };

const pimg = (s, sz = 500) => `
<div class="pimg" style="width:${sz}px;height:${sz}px">
  <svg viewBox="0 0 500 500" width="${sz}" height="${sz}">
    <defs>
      <linearGradient id="g1${s.key}${sz}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.cy}"/><stop offset="1" stop-color="${C.pk}"/></linearGradient>
      <radialGradient id="r1${s.key}${sz}" cx=".5" cy=".42" r=".6"><stop offset="0" stop-color="#2A1F52"/><stop offset="1" stop-color="${C.bg}"/></radialGradient>
    </defs>
    <rect width="500" height="500" fill="url(#r1${s.key}${sz})"/>
    <g opacity=".18" stroke="#fff" stroke-width="1">${Array.from({ length: 11 }, (_, i) => `<line x1="0" y1="${i * 50}" x2="500" y2="${i * 50}"/><line x1="${i * 50}" y1="0" x2="${i * 50}" y2="500"/>`).join('')}</g>
    <g transform="translate(250 230) rotate(-8)">
      <rect x="-92" y="-160" width="184" height="320" rx="30" fill="#14112A" stroke="url(#g1${s.key}${sz})" stroke-width="6"/>
      <rect x="-76" y="-140" width="152" height="280" rx="18" fill="#1F1A3D"/>
      <rect x="-60" y="-128" width="56" height="22" rx="11" fill="${C.pk}"/><circle cx="-48" cy="-117" r="4" fill="#fff"/>
      <text x="-22" y="-112" fill="#fff" font-size="13" font-weight="800" text-anchor="middle" font-family="IBM Plex Sans Arabic">LIVE</text>
      <g transform="translate(0 -10)" color="#fff">${iconFill(s.ic, 84, 'x="-42" y="-42" style="color:#fff"')}</g>
      <rect x="-60" y="60" width="120" height="8" rx="4" fill="#ffffff22"/><rect x="-60" y="60" width="84" height="8" rx="4" fill="url(#g1${s.key}${sz})"/>
    </g>
    <g font-family="IBM Plex Sans Arabic" font-weight="800">
      <rect x="300" y="118" width="150" height="54" rx="27" fill="${C.cy}"/><text x="375" y="153" font-size="24" text-anchor="middle" fill="${C.ink}">+${k(s.q[2][0])}</text>
      <rect x="40" y="300" width="128" height="46" rx="23" fill="${C.pk}"/><text x="104" y="330" font-size="20" text-anchor="middle" fill="#fff">فوري ⚡</text>
    </g>
    <text x="250" y="452" font-family="IBM Plex Sans Arabic" font-size="44" font-weight="800" fill="#fff" text-anchor="middle">${s.name.replace(' تيك توك', '')}</text>
    <text x="250" y="482" font-family="IBM Plex Sans Arabic" font-size="18" fill="${C.mut}" text-anchor="middle">فلاش ستور · تيك توك</text>
  </svg>
</div>`;

const hero = `
<div id="hero" class="hero">
  <div class="hero-glow a"></div><div class="hero-glow b"></div>
  <div class="phone3d"><div class="ph"><div class="ph-scr">
    <span class="live">● LIVE</span>
    <div class="ph-feed"><i></i><i></i><i></i></div>
    <div class="ph-side">${iconFill('heart', 26)}<b>12.4K</b>${iconFill('save', 24)}<b>890</b>${iconFill('share', 24)}<b>1.1K</b></div>
  </div></div></div>
  <div class="float f1">${icon('eye', 18)} +10K مشاهدة</div>
  <div class="float f2">${iconFill('heart', 16)} +1K لايك</div>
  <div class="float f3">⚡ تنفيذ فوري</div>
  <div class="hero-copy">
    <h1>خلّ مقطعك<br><span>يشتغل لايف</span></h1>
    <p>مشاهدات ولايكات وشير وحفظ لتيك توك، بأسعار واضحة من 1.99 ر.س</p>
  </div>
</div>`;

const header = `<header class="hd"><button>${icon('menu', 22)}</button><div class="logo"><span>${iconFill('bolt', 16)}</span>فلاش ستور</div><div class="hd-r"><button>${icon('search', 20)}</button><button class="cartb">${icon('cart', 20)}<em>1</em></button></div></header>
<div class="ticker"><span>خصم 10% على كل الخدمات بكود F10</span><span>•</span><span>تنفيذ فوري</span><span>•</span><span>دفع آمن عبر سلة</span></div>`;

const home = `
<section class="scr" id="home">${header}${hero}
  <div class="trust">${[['bolt', 'تنفيذ فوري'], ['shield', 'تعويض حسب السياسة'], ['lock', 'دفع آمن عبر سلة'], ['chat', 'دعم متواصل']].map(([i, t]) => `<div>${icon(i, 18)}<span>${t}</span></div>`).join('')}</div>
  <div class="sec light">
    <div class="sh"><h2>الباقات</h2><small>اسحب ←</small></div>
    <div class="reel">${packs.map((p, i) => `<article class="reel-card ${i === 2 ? 'on' : ''}"><div class="rc-top"><span class="live sm">● ${k(p.v)}</span></div><h3>${p.name}</h3>
      <ul><li>${icon('eye', 14)} ${n(p.v)}</li><li>${icon('heart', 14)} ${n(p.l)}</li><li>${icon('share', 14)} ${n(p.s)}</li><li>${icon('save', 14)} ${n(p.f)}</li></ul>
      <div class="rc-p"><b>${sar(p.price)}</b> ر.س</div></article>`).join('')}</div>
  </div>
  <div class="sec">
    <div class="sh"><h2>اختر الخدمة</h2></div>
    <div class="grid2">${singles.map(s => `<a class="svc"><div class="svc-img">${pimg(s, 165)}</div><div class="svc-b"><b>${s.short}</b><small>من <em>${sar(s.from)}</em> ر.س</small></div></a>`).join('')}</div>
  </div>
  <div class="sec light how"><h2>3 خطوات</h2><ol><li><b>1</b>اختر الخدمة والكمية</li><li><b>2</b>الصق رابط المقطع</li><li><b>3</b>ادفع، والتنفيذ يبدأ فوراً</li></ol></div>
</section>`;

const v = singles[0];
const product = `
<section class="scr" id="product">${header}
  <div class="pp-img">${pimg(v, 358)}</div>
  <div class="pp-head"><h1>${v.name}</h1><div class="pp-price"><small>المجموع</small><b>12.99</b> ر.س</div></div>
  <div class="tags"><span>${icon('bolt', 14)} فوري</span><span>${icon('user', 14)} حسابات أجانب</span><span>${icon('shield', 14)} تعويض حسب السياسة</span></div>
  <div class="box">
    <div class="box-h"><b>اختر عدد المشاهدات</b><span class="sel">10,000 مشاهدة</span></div>
    <div class="levels">${v.q.slice(0, 6).map(([q], i) => `<i class="${i <= 2 ? 'f' : ''} ${i === 2 ? 'cur' : ''}"></i>`).join('')}</div>
    <div class="qgrid">${v.q.map(([q, p], i) => `<label class="${i === 2 ? 'on' : ''}"><b>${k(q)}</b><small>${sar(p)} ر.س</small></label>`).join('')}</div>
  </div>
  <div class="box"><div class="box-h"><b>رابط المقطع</b></div><div class="inp">${icon('link', 18)}<span>https://www.tiktok.com/@…/video/…</span></div></div>
  <div class="desc"><h3>معلومات الخدمة</h3><dl><div><dt>مدة التنفيذ</dt><dd>فوري</dd></div><div><dt>نوع الحسابات</dt><dd>أجانب</dd></div><div><dt>ضمان التعويض</dt><dd>حسب السياسة</dd></div></dl>
  <h3>قبل ما تطلب</h3><p>تأكد إن الحساب عام وليس خاصاً. الصق الرابط فقط، ما نطلب كلمة المرور أبداً.</p></div>
  <div class="buybar"><div class="qty"><button>−</button><span>1</span><button>+</button></div><button class="buy">${icon('cart', 20)} أضف للسلة · 12.99</button></div>
</section>`;

const cart = `
<section class="scr" id="cart">${header}
  <div class="cart-h"><h1>السلة</h1><span>منتج واحد</span></div>
  <div class="toast">${icon('check', 18)} تمت الإضافة للسلة</div>
  <div class="citem"><div class="ci-img">${pimg(v, 84)}</div><div class="ci-b"><b>${v.name}</b><small>10,000 مشاهدة</small><small class="lnk">${icon('link', 12)} tiktok.com/@…/video/…</small></div><div class="ci-p"><b>12.99</b><small>ر.س</small></div></div>
  <div class="coupon"><span>كود الخصم</span><em>F10</em><button>تطبيق</button></div>
  <div class="sum"><div><span>المجموع</span><b>12.99 ر.س</b></div><div class="tot"><span>الإجمالي</span><b>12.99 ر.س</b></div><small>الأسعار شاملة الضريبة حسب إعدادات سلة</small></div>
  <button class="buy wide">إتمام الطلب ${icon('arrow', 18)}</button>
  <button class="apay"> Pay</button>
  <div class="trust mini">${[['lock', 'دفع آمن عبر سلة'], ['bolt', 'تنفيذ فوري']].map(([i, t]) => `<div>${icon(i, 16)}<span>${t}</span></div>`).join('')}</div>
</section>`;

const css = `
:root{--bg:${C.bg};--bg2:${C.bg2};--cy:${C.cy};--pk:${C.pk};--mut:${C.mut};--card:${C.card}}
body{font-family:'IBM Plex Sans Arabic',sans-serif;background:#222;margin:0}
.scr{width:390px;background:var(--bg);color:#fff;position:relative;overflow:hidden;padding-bottom:24px}
.hd{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;position:relative;z-index:3}
.hd button{width:40px;height:40px;border-radius:12px;border:1px solid #2B2747;background:#14122A;color:#fff;display:grid;place-items:center;position:relative}
.hd-r{display:flex;gap:8px}.cartb{background:linear-gradient(135deg,var(--cy),var(--pk))!important;border:0!important;color:var(--bg)!important}
.cartb em{position:absolute;top:-5px;left:-5px;background:#fff;color:var(--bg);font-style:normal;font-size:11px;font-weight:800;width:18px;height:18px;border-radius:9px;display:grid;place-items:center}
.logo{display:flex;align-items:center;gap:7px;font-weight:800;font-size:18px}.logo span{width:26px;height:26px;border-radius:8px;background:linear-gradient(135deg,var(--cy),var(--pk));display:grid;place-items:center;color:var(--bg)}
.ticker{display:flex;gap:14px;white-space:nowrap;font-size:12.5px;font-weight:700;padding:7px 16px;background:#14122A;color:var(--cy);border-block:1px solid #221F3D}
.hero{position:relative;height:520px;overflow:hidden}
.hero-glow{position:absolute;border-radius:50%;filter:blur(60px);opacity:.55}.hero-glow.a{width:260px;height:260px;background:var(--pk);top:40px;left:-60px}.hero-glow.b{width:240px;height:240px;background:var(--cy);top:160px;right:-70px;opacity:.4}
.phone3d{position:absolute;top:30px;left:50%;transform:translateX(-50%);perspective:900px}
.ph{width:170px;height:330px;border-radius:32px;background:#0E0C1E;border:5px solid #2C2850;transform:rotateY(-24deg) rotateX(10deg) rotateZ(-4deg);box-shadow:-30px 40px 60px rgba(0,0,0,.6),0 0 0 1px #ffffff14 inset;padding:8px}
.ph-scr{height:100%;border-radius:24px;background:linear-gradient(160deg,#2B1E5C,#11102A 60%);position:relative;overflow:hidden}
.live{position:absolute;top:10px;right:10px;background:var(--pk);font-size:11px;font-weight:800;padding:3px 9px;border-radius:999px}.live.sm{position:static;font-size:10px}
.ph-feed i{position:absolute;inset-inline:14px;height:8px;border-radius:4px;background:#ffffff1c}.ph-feed i:nth-child(1){bottom:46px;width:60%}.ph-feed i:nth-child(2){bottom:32px;width:40%}.ph-feed i:nth-child(3){bottom:18px;width:50%}
.ph-side{position:absolute;left:8px;bottom:70px;display:flex;flex-direction:column;align-items:center;gap:2px;font-size:10px}.ph-side svg{color:#fff}.ph-side b{margin-bottom:8px}
.float{position:absolute;padding:8px 13px;border-radius:999px;font-weight:800;font-size:14px;display:flex;align-items:center;gap:6px;box-shadow:0 12px 30px -8px rgba(0,0,0,.6)}
.f1{top:70px;right:18px;background:var(--cy);color:var(--bg);transform:rotate(4deg)}.f2{top:220px;left:14px;background:var(--pk);transform:rotate(-6deg)}.f3{top:300px;right:22px;background:#fff;color:var(--bg)}
.hero-copy{position:absolute;bottom:20px;inset-inline:18px}.hero-copy h1{font-size:40px;line-height:1.15;margin:0 0 10px;font-weight:800}.hero-copy h1 span{background:linear-gradient(90deg,var(--cy),var(--pk));-webkit-background-clip:text;color:transparent}
.hero-copy p{color:var(--mut);margin:0;font-size:15px;line-height:1.7}
.trust{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:6px 16px 22px}.trust div{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700;background:var(--card);border:1px solid #241F45;border-radius:12px;padding:10px}.trust svg{color:var(--cy);flex:none}
.trust.mini{padding:12px 16px 0}
.sec{padding:24px 16px}.sec.light{background:var(--bg2);color:var(--bg)}.sh{display:flex;justify-content:space-between;align-items:baseline}.sh h2,.sec h2{font-size:24px;margin:0 0 14px;font-weight:800}.sh small{color:#6B6690}
.reel{display:flex;gap:10px;overflow:hidden;margin-inline:-16px;padding-inline:16px}
.reel-card{flex:none;width:150px;height:266px;border-radius:20px;background:var(--bg);color:#fff;padding:12px;display:flex;flex-direction:column;position:relative;overflow:hidden}
.reel-card::before{content:"";position:absolute;inset:0;background:radial-gradient(120px 120px at 80% 10%,#FF3D7F55,transparent),radial-gradient(140px 140px at 10% 90%,#00E5D433,transparent)}
.reel-card>*{position:relative}.reel-card.on{outline:3px solid var(--pk)}
.reel-card h3{font-size:17px;margin:auto 0 8px;line-height:1.3}.reel-card ul{list-style:none;margin:0 0 10px;padding:0;font-size:12px;display:grid;gap:3px;color:#CFCBE8}.reel-card li{display:flex;gap:5px;align-items:center}
.rc-p{font-size:12px;color:var(--mut)}.rc-p b{font-size:22px;color:#fff}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px}.svc{background:var(--card);border-radius:18px;overflow:hidden;border:1px solid #241F45}
.svc-img .pimg{margin:0 auto}.svc-b{padding:10px 12px;display:flex;justify-content:space-between;align-items:baseline}.svc-b b{font-size:16px}.svc-b small{color:var(--mut)}.svc-b em{font-style:normal;color:var(--cy);font-weight:800;font-size:15px}
.how ol{list-style:none;margin:0;padding:0;display:grid;gap:10px}.how li{display:flex;gap:12px;align-items:center;font-weight:700;background:#fff;border-radius:14px;padding:12px}.how li b{width:32px;height:32px;border-radius:50%;background:var(--bg);color:var(--cy);display:grid;place-items:center}
.pp-img{padding:6px 16px}.pp-img .pimg{border-radius:24px;overflow:hidden;width:358px!important}
.pp-head{display:flex;justify-content:space-between;align-items:end;padding:14px 16px 6px}.pp-head h1{font-size:26px;margin:0}.pp-price{text-align:left;color:var(--mut);font-size:13px}.pp-price small{display:block}.pp-price b{font-size:30px;color:#fff}
.tags{display:flex;gap:6px;padding:4px 16px 14px;flex-wrap:wrap}.tags span{display:flex;gap:5px;align-items:center;font-size:12px;font-weight:700;padding:6px 10px;border-radius:999px;background:#17142D;border:1px solid #2A2550;color:#D8D4F2}
.box{margin:0 16px 12px;background:var(--card);border:1px solid #241F45;border-radius:20px;padding:16px}.box-h{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}.box-h b{font-size:16px}.sel{font-size:13px;font-weight:800;color:var(--bg);background:var(--cy);padding:4px 10px;border-radius:999px}
.levels{display:grid;grid-template-columns:repeat(6,1fr);gap:4px;margin-bottom:14px}.levels i{height:8px;border-radius:4px;background:#2A2550}.levels i.f{background:linear-gradient(90deg,var(--cy),var(--pk))}.levels i.cur{box-shadow:0 0 0 2px #fff}
.qgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.qgrid label{border-radius:14px;background:var(--bg);border:1px solid #2A2550;padding:10px 4px;text-align:center}.qgrid b{display:block;font-size:18px}.qgrid small{color:var(--mut);font-size:12px}
.qgrid label.on{background:linear-gradient(135deg,#00E5D422,#FF3D7F33);border-color:var(--pk);box-shadow:0 0 0 1px var(--pk) inset}.qgrid label.on small{color:#fff}
.inp{display:flex;gap:8px;align-items:center;background:var(--bg);border:1px solid #2A2550;border-radius:12px;padding:14px;color:var(--mut);direction:ltr;font-size:13px}
.desc{margin:4px 16px 12px;padding:16px;border-radius:20px;background:var(--bg2);color:var(--bg)}.desc h3{margin:0 0 8px;font-size:16px}.desc dl{margin:0 0 14px;display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.desc dl div{background:#fff;border-radius:12px;padding:10px 8px}.desc dt{font-size:11px;color:#6B6690}.desc dd{margin:0;font-weight:800}.desc p{margin:0;line-height:1.8;font-size:14px}
.buybar{display:flex;gap:8px;padding:12px 16px;position:sticky;bottom:0;background:#0B0A12ee;border-top:1px solid #241F45}.qty{display:flex;align-items:center;border:1px solid #2A2550;border-radius:14px}.qty button{width:36px;height:52px;background:none;border:0;color:#fff;font-size:20px}.qty span{width:20px;text-align:center;font-weight:800}
.buy{flex:1;border:0;border-radius:14px;height:54px;font:800 16px 'IBM Plex Sans Arabic';color:var(--bg);background:linear-gradient(90deg,var(--cy),var(--pk));display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 10px 30px -10px var(--pk)}
.buy.wide{width:calc(100% - 32px);margin:6px 16px 8px}.apay{width:calc(100% - 32px);margin:0 16px;height:50px;border-radius:14px;border:1px solid #fff3;background:#000;color:#fff;font:700 18px -apple-system,sans-serif}
.cart-h{display:flex;justify-content:space-between;align-items:baseline;padding:8px 16px}.cart-h h1{margin:0;font-size:28px}.cart-h span{color:var(--mut)}
.toast{margin:6px 16px 14px;padding:12px 14px;border-radius:14px;background:var(--cy);color:var(--bg);font-weight:800;display:flex;gap:8px;align-items:center}
.citem{margin:0 16px 12px;background:var(--card);border-radius:18px;padding:10px;display:flex;gap:12px;align-items:center;border:1px solid #241F45}.ci-img .pimg{border-radius:12px;overflow:hidden}.ci-b{flex:1;display:grid;gap:2px}.ci-b small{color:var(--mut)}.lnk{direction:ltr;text-align:right;display:flex;gap:4px;align-items:center;font-size:11px}.ci-p{text-align:center}.ci-p b{font-size:20px;display:block}.ci-p small{color:var(--mut)}
.coupon{margin:0 16px 12px;display:flex;align-items:center;gap:10px;padding:8px 8px 8px 14px;border-radius:14px;border:1px dashed var(--pk)}.coupon span{color:var(--mut);font-size:13px}.coupon em{font-style:normal;font-weight:800;flex:1;font-size:16px;letter-spacing:1px}.coupon button{border:0;border-radius:10px;padding:9px 14px;background:var(--pk);color:#fff;font:800 13px 'IBM Plex Sans Arabic'}
.sum{margin:0 16px 12px;background:var(--bg2);color:var(--bg);border-radius:18px;padding:14px 16px;display:grid;gap:8px}.sum div{display:flex;justify-content:space-between}.sum .tot{border-top:1px solid #0B0A1222;padding-top:8px;font-size:18px}.sum small{color:#6B6690;font-size:11px}
`;
// صورة الباقة بنفس النظام: نفس الجوال والإطار، وبدل الأيقونة الكبيرة 4 أسطر بمحتويات الباقة
const pimgPack = (p, sz = 500) => `
<div class="pimg" style="width:${sz}px;height:${sz}px">
  <svg viewBox="0 0 500 500" width="${sz}" height="${sz}">
    <defs>
      <linearGradient id="g1${p.key}${sz}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.cy}"/><stop offset="1" stop-color="${C.pk}"/></linearGradient>
      <radialGradient id="r1${p.key}${sz}" cx=".5" cy=".42" r=".6"><stop offset="0" stop-color="#2A1F52"/><stop offset="1" stop-color="${C.bg}"/></radialGradient>
    </defs>
    <rect width="500" height="500" fill="url(#r1${p.key}${sz})"/>
    <g opacity=".18" stroke="#fff" stroke-width="1">${Array.from({ length: 11 }, (_, i) => `<line x1="0" y1="${i * 50}" x2="500" y2="${i * 50}"/><line x1="${i * 50}" y1="0" x2="${i * 50}" y2="500"/>`).join('')}</g>
    <g transform="translate(250 230) rotate(-8)">
      <rect x="-92" y="-160" width="184" height="320" rx="30" fill="#14112A" stroke="url(#g1${p.key}${sz})" stroke-width="6"/>
      <rect x="-76" y="-140" width="152" height="280" rx="18" fill="#1F1A3D"/>
      <rect x="-60" y="-128" width="56" height="22" rx="11" fill="${C.pk}"/><circle cx="-48" cy="-117" r="4" fill="#fff"/>
      <text x="-22" y="-112" fill="#fff" font-size="13" font-weight="800" text-anchor="middle" font-family="IBM Plex Sans Arabic">LIVE</text>
      ${[['eye', p.v], ['heart', p.l], ['share', p.s], ['save', p.f]].map(([ic, val], i) => `
      <g transform="translate(0 ${-78 + i * 52})">
        <rect x="-62" y="-20" width="124" height="40" rx="12" fill="#ffffff10"/>
        <g transform="translate(30 -11)" style="color:${i % 2 ? C.pk : C.cy}">${iconFill(ic, 22)}</g>
        <text x="-50" y="8" font-family="IBM Plex Sans Arabic" font-size="21" font-weight="800" fill="#fff">${k(val)}</text>
      </g>`).join('')}
    </g>
    <g font-family="IBM Plex Sans Arabic" font-weight="800">
      <rect x="322" y="292" width="150" height="50" rx="25" fill="${C.cy}"/><text x="397" y="325" font-size="22" text-anchor="middle" direction="rtl" fill="${C.ink}">4 خدمات</text>
      <rect x="40" y="300" width="128" height="46" rx="23" fill="${C.pk}"/><text x="104" y="330" font-size="20" text-anchor="middle" fill="#fff">فوري ⚡</text>
    </g>
    <text x="250" y="452" font-family="IBM Plex Sans Arabic" font-size="42" font-weight="800" fill="#fff" text-anchor="middle">${p.name}</text>
    <text x="250" y="482" font-family="IBM Plex Sans Arabic" font-size="18" fill="${C.mut}" text-anchor="middle">فلاش ستور · تيك توك</text>
  </svg>
</div>`;

module.exports.pimg = pimg; module.exports.pimgPack = pimgPack;
Object.assign(module.exports, { id: 'd1-live', title: 'بث مباشر', font: 'IBM+Plex+Sans+Arabic:wght@400;500;700', css, body: home + product + cart, asset: pimg(singles[0], 500) });
