// ⑤ «جليد» — زجاج قطبي: كحلي ليلي + ثلجي، أزرق كهربائي وشفق قطبي، كروت زجاج مغبّش وكبسولات
const { icon, iconFill, singles, packs, n, k, sar } = require('./data');
const C = { bg: '#0A1626', bg2: '#DCEBFA', bl: '#3D7BFF', sky: '#7DE2FF', vi: '#B18CFF', ink: '#0A1626', mut: '#8FA6C4' };

const glassIcon = (ic, sz, id) => `
  <defs>
    <linearGradient id="gi${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".55"/><stop offset="1" stop-color="#ffffff" stop-opacity=".08"/></linearGradient>
    <linearGradient id="ge${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity=".1"/></linearGradient>
  </defs>
  <rect x="-${sz / 2}" y="-${sz / 2}" width="${sz}" height="${sz}" rx="${sz * .28}" fill="url(#gi${id})" stroke="url(#ge${id})" stroke-width="2"/>`;

const pimg = (s, sz = 500) => {
  const id = s.key + sz;
  return `
<div class="pimg" style="width:${sz}px;height:${sz}px">
  <svg viewBox="0 0 500 500" width="${sz}" height="${sz}">
    <defs>
      <radialGradient id="a1${id}" cx=".2" cy=".2" r=".7"><stop offset="0" stop-color="${C.vi}" stop-opacity=".9"/><stop offset="1" stop-color="${C.vi}" stop-opacity="0"/></radialGradient>
      <radialGradient id="a2${id}" cx=".85" cy=".35" r=".6"><stop offset="0" stop-color="${C.sky}" stop-opacity=".8"/><stop offset="1" stop-color="${C.sky}" stop-opacity="0"/></radialGradient>
      <radialGradient id="a3${id}" cx=".5" cy="1" r=".7"><stop offset="0" stop-color="${C.bl}" stop-opacity=".9"/><stop offset="1" stop-color="${C.bl}" stop-opacity="0"/></radialGradient>
      <filter id="bl${id}"><feGaussianBlur stdDeviation="14"/></filter>
    </defs>
    <rect width="500" height="500" fill="${C.bg}"/>
    <rect width="500" height="500" fill="url(#a1${id})"/><rect width="500" height="500" fill="url(#a2${id})"/><rect width="500" height="500" fill="url(#a3${id})"/>
    <circle cx="330" cy="140" r="60" fill="${C.sky}" opacity=".5" filter="url(#bl${id})"/>
    <g transform="translate(250 215) rotate(-10)">
      <rect x="-95" y="-95" width="190" height="190" rx="54" fill="#000" opacity=".25" transform="translate(16 22)" filter="url(#bl${id})"/>
      ${glassIcon(s.ic, 190, id)}
      <g transform="translate(-55 -55)" style="color:#fff">${iconFill(s.ic, 110)}</g>
    </g>
    <g transform="translate(100 120) rotate(14)" opacity=".85">${glassIcon(s.ic, 56, id + 'b')}<g transform="translate(-16 -16)" style="color:#fff">${iconFill('bolt', 32)}</g></g>
    <rect x="40" y="380" width="420" height="86" rx="24" fill="#ffffff22" stroke="#ffffff55"/>
    <text x="436" y="434" font-family="Noto Kufi Arabic" font-size="30" font-weight="700" fill="#fff" text-anchor="end">${s.name}</text>
    <text x="66" y="434" font-family="Noto Kufi Arabic" font-size="22" font-weight="700" fill="${C.sky}">+${k(s.q[2][0])}</text>
  </svg>
</div>`;
};

const hero = `
<div id="hero" class="hero">
  <div class="aur a1"></div><div class="aur a2"></div><div class="aur a3"></div>
  <div class="gl g1">${iconFill('heart', 46)}</div>
  <div class="gl g2">${iconFill('eye', 58)}</div>
  <div class="gl g3">${iconFill('share', 34)}</div>
  <div class="gl g4">${iconFill('save', 30)}</div>
  <div class="stat"><small>مثال</small><b>10,000 مشاهدة</b><span>${icon("bolt", 14)} 12.99 ر.س · فوري</span></div>
  <div class="hero-copy"><h1>تفاعل <em>صافٍ</em><br>لمقطعك</h1><p>مشاهدات، لايكات، شير وحفظ. تنفيذ فوري ودفع آمن عبر سلة.</p><div class="cta"><a class="b1">ابدأ الآن</a><a class="b2">الباقات</a></div></div>
</div>`;

const header = `<div class="hdwrap"><header class="hd"><div class="logo"><span>${iconFill('bolt', 16)}</span>فلاش ستور</div><div class="hd-r"><button>${icon('search', 19)}</button><button>${icon('menu', 19)}</button><button class="cartb">${icon('cart', 19)}<em>1</em></button></div></header></div>
<div class="pill-ad">${icon('bolt', 14)} خصم 10% بكود <b>F10</b></div>`;

const home = `
<section class="scr" id="home">${header}${hero}
  <div class="sec">
    <h2>الخدمات</h2>
    <div class="glass-grid">${singles.map(s => `<a class="gc"><div class="gc-img">${pimg(s, 164)}</div><div class="gc-b"><b>${s.short}</b><span>من <em>${sar(s.from)}</em> ر.س</span></div></a>`).join('')}</div>
  </div>
  <div class="sec ice">
    <h2>الباقات</h2><p class="sub">كل باقة فيها الأربع خدمات مع بعض</p>
    <div class="stack">${packs.map((p, i) => `<article class="pk ${i === 2 ? 'on' : ''}"><div class="pk-h"><h3>${p.name}</h3><b>${sar(p.price)} <small>ر.س</small></b></div>
      <div class="caps">${[['eye', p.v], ['heart', p.l], ['share', p.s], ['save', p.f]].map(([ic, val]) => `<span>${icon(ic, 13)} ${k(val)}</span>`).join('')}</div></article>`).join('')}</div>
  </div>
  <div class="sec"><div class="feats">${[['bolt', 'تنفيذ فوري', 'يبدأ بعد الدفع'], ['shield', 'تعويض', 'حسب السياسة'], ['lock', 'دفع آمن', 'عبر سلة'], ['chat', 'دعم', 'متواصل']].map(([i, t, s]) => `<div class="ft"><span>${icon(i, 20)}</span><b>${t}</b><small>${s}</small></div>`).join('')}</div></div>
</section>`;

const v = singles[0];
const product = `
<section class="scr" id="product">${header}
  <div class="pp-img">${pimg(v, 358)}</div>
  <div class="pcard">
    <div class="ph"><h1>${v.name}</h1><div class="pr"><b>12.99</b><small>ر.س</small></div></div>
    <div class="chips"><span>${icon('bolt', 13)} فوري</span><span>${icon('user', 13)} أجانب</span><span>${icon('shield', 13)} تعويض حسب السياسة</span></div>
    <h3>اختر عدد المشاهدات</h3>
    <div class="capsules">${v.q.map(([q, p], i) => `<label class="cp ${i === 2 ? 'on' : ''}">${i === 2 ? `<span class="tip">${sar(p)} ر.س</span>` : ''}<b>${k(q)}</b><small>${sar(p)}</small></label>`).join('')}</div>
    <h3>رابط المقطع</h3><div class="inp">${icon('link', 16)} https://www.tiktok.com/@…/video/…</div>
  </div>
  <div class="info"><p>${icon('shield', 16)} الحساب لازم يكون عام وليس خاصاً.</p><p>${icon('lock', 16)} نطلب الرابط فقط، ما نطلب كلمة المرور أبداً.</p></div>
  <div class="buybar"><div class="qty"><button>−</button><span>1</span><button>+</button></div><button class="buy">أضف للسلة <span>12.99 ر.س</span></button></div>
</section>`;

const cart = `
<section class="scr" id="cart">${header}
  <div class="aur a1 sm"></div><div class="aur a2 sm"></div>
  <div class="ph pad"><h1>السلة</h1><span class="cnt">1</span></div>
  <div class="toast">${icon('check', 18)}<div><b>تمت الإضافة</b><small>${v.name} · 10,000</small></div></div>
  <div class="gcart"><div class="ci">${pimg(v, 80)}<div class="ci-b"><b>${v.name}</b><small>10,000 مشاهدة</small><small class="lnk">tiktok.com/@…/video/…</small></div><b class="cp-p">12.99</b></div>
  <div class="code"><span>${icon('bolt', 14)} F10</span><button>تطبيق</button></div>
  <div class="rows"><div><span>المجموع</span><b>12.99 ر.س</b></div><div class="tt"><span>الإجمالي</span><b>12.99 ر.س</b></div></div></div>
  <button class="buy wide">إتمام الطلب</button><button class="apay"> Pay</button>
</section>`;

const css = `
:root{--bg:${C.bg};--ice:${C.bg2};--bl:${C.bl};--sky:${C.sky};--vi:${C.vi};--mut:${C.mut}}
body{font-family:'Noto Kufi Arabic',sans-serif;background:#222;margin:0}
.scr{width:390px;background:var(--bg);color:#fff;overflow:hidden;padding-bottom:24px;position:relative}
.scr>*{position:relative}
.hdwrap{padding:10px 12px 0;z-index:5}.hd{display:flex;justify-content:space-between;align-items:center;padding:8px 8px 8px 8px;border-radius:20px;background:#ffffff12;border:1px solid #ffffff22;backdrop-filter:blur(16px)}
.hd-r{display:flex;gap:6px}.hd button{width:38px;height:38px;border-radius:14px;border:1px solid #ffffff22;background:#ffffff10;color:#fff;display:grid;place-items:center;position:relative}
.cartb{background:var(--bl)!important;border-color:var(--bl)!important;box-shadow:0 0 20px #3D7BFF99}.cartb em{position:absolute;top:-6px;left:-6px;font-style:normal;font-size:10px;background:#fff;color:var(--bg);width:17px;height:17px;border-radius:50%;display:grid;place-items:center;font-weight:700}
.logo{display:flex;align-items:center;gap:8px;font-weight:700;font-size:16px;padding-inline-start:4px}.logo span{width:28px;height:28px;border-radius:10px;background:linear-gradient(135deg,var(--sky),var(--bl));display:grid;place-items:center}
.pill-ad{margin:10px auto 0;width:max-content;padding:6px 14px;border-radius:999px;background:#ffffff10;border:1px solid #ffffff22;font-size:12px;display:flex;gap:6px;align-items:center;color:var(--sky);z-index:5}.pill-ad b{color:#fff}
.hero{height:600px;margin-top:-90px;padding-top:90px;position:relative;overflow:hidden}
.aur{position:absolute;border-radius:50%;filter:blur(60px)}.a1{width:300px;height:220px;background:var(--vi);top:60px;left:-80px;opacity:.6}.a2{width:280px;height:260px;background:var(--sky);top:120px;right:-90px;opacity:.45}.a3{width:340px;height:200px;background:var(--bl);top:300px;left:30px;opacity:.55}
.aur.sm{position:absolute;opacity:.35}
.gl{position:absolute;display:grid;place-items:center;color:#fff;border-radius:30%;background:linear-gradient(135deg,#ffffff66,#ffffff10);border:1.5px solid #ffffff77;backdrop-filter:blur(10px);box-shadow:0 30px 50px -16px #00000099,inset 0 1px 0 #fff}
.g1{width:96px;height:96px;top:120px;right:36px;transform:rotate(12deg)}.g2{width:124px;height:124px;top:170px;left:50%;margin-left:-62px;transform:rotate(-6deg)}.g3{width:70px;height:70px;top:110px;left:38px;transform:rotate(-16deg)}.g4{width:62px;height:62px;top:280px;right:60px;transform:rotate(8deg)}
.stat{position:absolute;top:290px;left:14px;transform:scale(.92);transform-origin:left top;padding:10px 12px;border-radius:16px;background:#0A1626aa;border:1px solid #ffffff22;backdrop-filter:blur(12px);display:grid;gap:2px}.stat small{font-size:10px;color:var(--mut)}.stat b{font-size:14px}.stat span{font-size:11px;color:var(--sky);display:flex;gap:4px;align-items:center}
.hero-copy{position:absolute;bottom:22px;inset-inline:18px}.hero-copy h1{font-size:38px;line-height:1.3;margin:0 0 8px;font-weight:700}.hero-copy em{font-style:normal;background:linear-gradient(90deg,var(--sky),var(--vi));-webkit-background-clip:text;color:transparent}.hero-copy p{margin:0 0 14px;color:#C9D7EA;font-size:14px;line-height:1.8}
.cta{display:flex;gap:8px}.cta a{padding:12px 22px;border-radius:16px;font-weight:700;font-size:14px}.b1{background:var(--bl);box-shadow:0 10px 30px -8px var(--bl)}.b2{background:#ffffff14;border:1px solid #ffffff33}
.sec{padding:26px 16px}.sec h2{font-size:26px;margin:0 0 14px}.ice{background:var(--ice);color:var(--bg);border-radius:28px 28px 0 0}.sub{margin:-8px 0 14px;color:#4A6488;font-size:13px}
.glass-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.gc{border-radius:22px;overflow:hidden;background:#ffffff0d;border:1px solid #ffffff1f}.gc-img .pimg{margin:6px auto 0;border-radius:18px;overflow:hidden}
.gc-b{padding:10px 12px;display:flex;justify-content:space-between;align-items:baseline}.gc-b b{font-size:15px}.gc-b span{font-size:11px;color:var(--mut)}.gc-b em{font-style:normal;color:var(--sky);font-size:15px;font-weight:700}
.stack{display:grid;gap:10px}.pk{background:#ffffffaa;border:1px solid #fff;border-radius:20px;padding:14px;box-shadow:0 10px 30px -18px #0A162688}.pk.on{background:var(--bg);color:#fff;border-color:var(--bl);box-shadow:0 0 0 2px var(--bl),0 14px 30px -12px #3D7BFF}
.pk-h{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px}.pk-h h3{margin:0;font-size:16px}.pk-h b{font-size:20px;color:var(--bl)}.pk.on .pk-h b{color:var(--sky)}.pk-h small{font-size:11px;color:var(--mut)}
.caps{display:flex;gap:6px}.caps span{flex:1;display:flex;gap:4px;align-items:center;justify-content:center;font-size:11.5px;font-weight:700;padding:6px 4px;border-radius:999px;background:#0A162610}.pk.on .caps span{background:#ffffff14}
.feats{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}.ft{display:grid;justify-items:center;gap:4px;text-align:center;padding:12px 4px;border-radius:18px;background:#ffffff0a;border:1px solid #ffffff1a}.ft span{width:40px;height:40px;border-radius:14px;background:linear-gradient(135deg,#7DE2FF33,#3D7BFF33);color:var(--sky);display:grid;place-items:center}.ft b{font-size:12.5px}.ft small{font-size:10px;color:var(--mut)}
.pp-img{padding:12px 16px 0}.pp-img .pimg{border-radius:28px;overflow:hidden}
.pcard{margin:-40px 16px 12px;padding:16px;border-radius:26px;background:#122138e6;border:1px solid #ffffff22;backdrop-filter:blur(16px);box-shadow:0 -20px 40px -20px #000}
.ph{display:flex;justify-content:space-between;align-items:center}.ph h1{font-size:23px;margin:0}.pr b{font-size:26px;color:var(--sky)}.pr small{color:var(--mut);margin-inline-start:4px}.ph.pad{padding:14px 16px 6px}.cnt{width:30px;height:30px;border-radius:50%;background:var(--bl);display:grid;place-items:center;font-weight:700}
.chips{display:flex;gap:6px;margin:10px 0 14px;flex-wrap:wrap}.chips span{display:flex;gap:4px;align-items:center;font-size:11.5px;padding:5px 10px;border-radius:999px;background:#ffffff10;border:1px solid #ffffff1f}
.pcard h3{font-size:14px;margin:0 0 10px;color:#C9D7EA}
.capsules{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px;padding-top:6px}.cp{position:relative;display:flex;flex-direction:column;align-items:center;padding:10px 4px;border-radius:999px;background:#ffffff0c;border:1px solid #ffffff22}.cp b{font-size:16px}.cp small{font-size:10.5px;color:var(--mut)}
.cp.on{background:linear-gradient(135deg,#3D7BFF,#7DE2FF);border-color:#fff;box-shadow:0 8px 24px -6px #3D7BFF}.cp.on small{color:#0A1626}.tip{position:absolute;top:-24px;background:#fff;color:var(--bg);font-size:10.5px;font-weight:700;padding:2px 8px;border-radius:8px;white-space:nowrap}
.inp{display:flex;gap:8px;align-items:center;padding:14px;border-radius:16px;background:#0A1626;border:1px solid #ffffff22;color:var(--mut);direction:ltr;font-size:12px}
.info{margin:0 16px 14px;padding:12px 14px;border-radius:18px;background:var(--ice);color:var(--bg)}.info p{margin:4px 0;display:flex;gap:8px;align-items:center;font-size:13px}.info svg{color:var(--bl);flex:none}
.buybar{margin:0 16px;display:flex;gap:8px;padding:6px;border-radius:22px;background:#ffffff10;border:1px solid #ffffff22}.qty{display:flex;align-items:center}.qty button{width:34px;height:50px;border:0;background:none;color:#fff;font-size:18px}
.buy{flex:1;height:54px;border:0;border-radius:18px;background:linear-gradient(90deg,#3D7BFF,#5C9BFF);color:#fff;font:700 16px 'Noto Kufi Arabic';display:flex;align-items:center;justify-content:center;gap:10px;box-shadow:0 10px 30px -8px #3D7BFF,inset 0 1px 0 #ffffff66}.buy span{font-size:12px;opacity:.85;padding:3px 8px;border-radius:8px;background:#ffffff22}
.toast{margin:6px 16px 12px;display:flex;gap:10px;align-items:center;padding:12px 14px;border-radius:18px;background:#7DE2FF22;border:1px solid #7DE2FF66;color:var(--sky)}.toast div{display:grid}.toast b{color:#fff;font-size:14px}.toast small{font-size:11px;color:#C9D7EA}
.gcart{margin:0 16px 14px;padding:12px;border-radius:24px;background:#ffffff0d;border:1px solid #ffffff22}.ci{display:flex;gap:10px;align-items:center}.ci .pimg{border-radius:16px;overflow:hidden;flex:none}.ci-b{flex:1;display:grid;gap:2px}.ci-b small{font-size:11px;color:var(--mut)}.lnk{direction:ltr;text-align:right}.cp-p{font-size:20px;color:var(--sky)}
.code{display:flex;justify-content:space-between;align-items:center;margin:12px 0;padding:6px 6px 6px 12px;border-radius:14px;border:1px dashed #7DE2FF77}.code span{display:flex;gap:6px;align-items:center;font-weight:700}.code button{border:0;border-radius:10px;padding:8px 14px;background:#ffffff1a;color:#fff;font:700 12px 'Noto Kufi Arabic'}
.rows div{display:flex;justify-content:space-between;padding:8px 2px;font-size:14px}.rows .tt{border-top:1px solid #ffffff22;font-size:17px}
.buy.wide{width:calc(100% - 32px);margin:0 16px 8px}.apay{width:calc(100% - 32px);margin:0 16px;height:50px;border-radius:18px;background:#000;color:#fff;border:1px solid #333;font:700 18px -apple-system,sans-serif}
`;
module.exports = { id: 'd5-ice', title: 'جليد', font: 'Noto+Kufi+Arabic:wght@400;500;700', css, body: home + product + cart, asset: pimg(singles[0], 500) };
