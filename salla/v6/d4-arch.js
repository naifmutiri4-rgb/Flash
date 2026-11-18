// ④ «قوس» — فخامة سعودية دافية: إسبريسو + رملي، نحاسي، أقواس معمارية وميداليات مستويات
const { icon, iconFill, singles, packs, n, k, sar } = require('./data');
const C = { bg: '#1A120C', bg2: '#E8D3B0', cu: '#C8743A', gold: '#E9B872', ink: '#1A120C', mut: '#A8927A', card: '#241912', line: '#3A2A1E' };
const ARCH = (w, h) => `M0 ${h} V${w / 2} A${w / 2} ${w / 2} 0 0 1 ${w} ${w / 2} V${h} Z`;

const pimg = (s, sz = 500) => `
<div class="pimg" style="width:${sz}px;height:${sz}px">
  <svg viewBox="0 0 500 500" width="${sz}" height="${sz}">
    <defs>
      <linearGradient id="sk${s.key}${sz}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3B36B"/><stop offset=".55" stop-color="${C.cu}"/><stop offset="1" stop-color="#5A2E14"/></linearGradient>
      <linearGradient id="fr${s.key}${sz}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F1DDB8"/><stop offset="1" stop-color="#B98C55"/></linearGradient>
    </defs>
    <rect width="500" height="500" fill="${C.bg2}"/>
    <g transform="translate(110 40)">
      <path d="${ARCH(280, 380)}" fill="#00000022" transform="translate(14 14)"/>
      <path d="${ARCH(280, 380)}" fill="url(#fr${s.key}${sz})"/>
      <path d="${ARCH(240, 360)}" transform="translate(20 20)" fill="url(#sk${s.key}${sz})"/>
      <circle cx="140" cy="210" r="52" fill="#FFE2B0" opacity=".9"/>
      <path d="M20 300 Q140 250 260 300 V380 H20Z" fill="#3A1F10" opacity=".55"/>
      <g transform="translate(108 178)" style="color:${C.bg}">${iconFill(s.ic, 64)}</g>
    </g>
    <rect x="0" y="420" width="500" height="80" fill="${C.bg}"/>
    <text x="250" y="468" font-family="El Messiri" font-size="36" font-weight="700" fill="${C.bg2}" text-anchor="middle">${s.name}</text>
    <text x="250" y="492" font-family="IBM Plex Sans Arabic" font-size="13" fill="${C.gold}" text-anchor="middle" letter-spacing="3">فلاش ستور</text>
  </svg>
</div>`;

const hero = `
<div id="hero" class="hero">
  <svg class="arches" viewBox="0 0 390 420" width="390" height="420">
    <defs><linearGradient id="sun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6C27A"/><stop offset=".6" stop-color="#C8743A"/><stop offset="1" stop-color="#3B1D0C"/></linearGradient>
    <linearGradient id="stone" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8A5A34"/><stop offset=".5" stop-color="#E8D3B0"/><stop offset="1" stop-color="#9C6B40"/></linearGradient></defs>
    <g transform="translate(25 70)" opacity=".5"><path d="${ARCH(110, 300)}" fill="url(#stone)"/><path d="${ARCH(86, 288)}" transform="translate(12 12)" fill="#2A1A10"/></g>
    <g transform="translate(255 70)" opacity=".5"><path d="${ARCH(110, 300)}" fill="url(#stone)"/><path d="${ARCH(86, 288)}" transform="translate(12 12)" fill="#2A1A10"/></g>
    <g transform="translate(95 20)"><path d="${ARCH(200, 380)}" fill="#00000066" transform="translate(10 12)"/><path d="${ARCH(200, 380)}" fill="url(#stone)"/><path d="${ARCH(170, 362)}" transform="translate(15 16)" fill="url(#sun)"/>
      <circle cx="100" cy="170" r="40" fill="#FFE6B8"/>
      <path d="M15 300 Q100 250 185 300 V378 H15Z" fill="#2A140A" opacity=".8"/></g>
    <g fill="#E9B872">${[[60, 60], [330, 40], [300, 120], [40, 150]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2"/>`).join('')}</g>
  </svg>
  <div class="medal m1"><b>+10K</b><small>مشاهدة</small></div>
  <div class="medal m2"><b>+1K</b><small>لايك</small></div>
  <div class="hero-copy"><h1>حضورٌ يليق<br>بمقطعك</h1><p>خدمات تيك توك بتنفيذ فوري وأسعار واضحة</p><a class="btn">تصفّح الباقات</a></div>
</div>`;

const header = `<div class="ad">✦ خصم 10% على كل الخدمات بكود F10 ✦</div>
<header class="hd"><button>${icon('menu', 22)}</button><div class="logo"><svg width="26" height="30" viewBox="0 0 26 30"><path d="${ARCH(26, 30)}" fill="${C.cu}"/><g transform="translate(5 9)" style="color:${C.bg}">${iconFill('bolt', 16)}</g></svg><span>فلاش ستور</span></div><button class="cartb">${icon('cart', 20)}<em>1</em></button></header>`;

const tiers = ['برونزي', 'فضي', 'ذهبي'];
const home = `
<section class="scr" id="home">${header}${hero}
  <div class="sec sand">
    <div class="orn">✦</div><h2>الباقات</h2><p class="sub">خمس باقات، كل وحدة فيها مشاهدات ولايكات وشير وحفظ</p>
    <div class="arch-cards">${packs.map((p, i) => `<article class="ac ${i === 3 ? 'wide' : ''}"><div class="ac-top"><span>${i + 1}</span></div><h3>${p.name}</h3>
      <ul><li><b>${n(p.v)}</b> مشاهدة</li><li><b>${n(p.l)}</b> لايك</li><li><b>${n(p.s)}</b> شير</li><li><b>${n(p.f)}</b> حفظ</li></ul><div class="ac-p"><b>${sar(p.price)}</b> ر.س</div></article>`).join('')}</div>
  </div>
  <div class="sec">
    <div class="orn">✦</div><h2>الخدمات</h2>
    <div class="svc-list">${singles.map(s => `<a class="sv"><div class="sv-img">${pimg(s, 96)}</div><div class="sv-b"><b>${s.name}</b><small>من ${n(s.q[0][0])} إلى ${n(s.q.at(-1)[0])} ${s.unit}</small></div><div class="sv-p"><small>من</small><b>${sar(s.from)}</b></div></a>`).join('')}</div>
  </div>
  <div class="sec sand promise"><div><span>${icon('bolt', 22)}</span><b>تنفيذ فوري</b></div><div><span>${icon('shield', 22)}</span><b>تعويض حسب السياسة</b></div><div><span>${icon('lock', 22)}</span><b>دفع آمن عبر سلة</b></div><div><span>${icon('chat', 22)}</span><b>دعم متواصل</b></div></div>
</section>`;

const v = singles[0];
const product = `
<section class="scr" id="product">${header}
  <div class="pp-img">${pimg(v, 300)}</div>
  <div class="ph"><h1>${v.name}</h1><p>من 2,000 إلى 1,000,000 مشاهدة</p></div>
  <div class="tierbox">
    <h3>اختر عدد المشاهدات</h3>
    <div class="medals">${v.q.map(([q, p], i) => `<label class="md t${Math.min(2, Math.floor(i / 3))} ${i === 2 ? 'on' : ''}"><span class="disc"><b>${k(q)}</b></span><small>${sar(p)} ر.س</small></label>`).join('')}</div>
    <div class="legend">${tiers.map((t, i) => `<span class="t${i}"><i></i>${t}</span>`).join('')}</div>
  </div>
  <div class="field"><label>رابط المقطع</label><div class="inp">https://www.tiktok.com/@…/video/…</div></div>
  <div class="scroll"><div class="sc-h">✦ معلومات الخدمة ✦</div><div class="sc-r"><span>مدة التنفيذ</span><b>فوري</b></div><div class="sc-r"><span>نوع الحسابات</span><b>أجانب</b></div><div class="sc-r"><span>ضمان التعويض</span><b>حسب السياسة</b></div><p>تأكد إن الحساب عام. ما نطلب كلمة المرور أبداً.</p></div>
  <div class="buybar"><div class="bb-p"><small>المجموع</small><b>12.99 ر.س</b></div><button class="buy">أضف للسلة</button></div>
</section>`;

const cart = `
<section class="scr" id="cart">${header}
  <div class="ph c"><div class="orn">✦</div><h1>سلّتك</h1></div>
  <div class="added">${icon('check', 18)} أُضيفت الخدمة إلى سلّتك</div>
  <div class="ci"><div>${pimg(v, 80)}</div><div class="ci-b"><b>${v.name}</b><small>10,000 مشاهدة</small><small class="lnk">tiktok.com/@…/video/…</small></div><b class="ci-p">12.99</b></div>
  <div class="sumbox"><div><span>المجموع</span><b>12.99 ر.س</b></div><div><span>كود الخصم</span><b class="cu">F10 · تطبيق</b></div><div class="tt"><span>الإجمالي</span><b>12.99 ر.س</b></div></div>
  <button class="buy wide">إتمام الطلب</button><button class="apay"> Pay</button>
</section>`;

const css = `
:root{--bg:${C.bg};--sand:${C.bg2};--cu:${C.cu};--gold:${C.gold};--mut:${C.mut};--card:${C.card};--line:${C.line}}
body{font-family:'IBM Plex Sans Arabic',sans-serif;background:#222;margin:0}h1,h2,h3,.logo span{font-family:'El Messiri',serif}
.scr{width:390px;background:var(--bg);color:var(--sand);overflow:hidden;padding-bottom:24px}
.ad{text-align:center;font-size:12.5px;padding:8px;color:var(--gold);border-bottom:1px solid var(--line);letter-spacing:.3px}
.hd{display:flex;justify-content:space-between;align-items:center;padding:12px 16px}.hd button{width:42px;height:42px;border-radius:21px 21px 8px 8px;border:1px solid var(--line);background:var(--card);color:var(--sand);display:grid;place-items:center;position:relative}
.cartb{background:var(--cu)!important;border:0!important;color:var(--bg)!important}.cartb em{position:absolute;top:-6px;left:-4px;font-style:normal;font-size:11px;font-weight:700;background:var(--sand);color:var(--bg);width:18px;height:18px;border-radius:50%;display:grid;place-items:center}
.logo{display:flex;align-items:center;gap:8px}.logo span{font-size:22px;font-weight:700}
.hero{position:relative;height:600px;overflow:hidden;background:radial-gradient(300px 260px at 50% 40%,#5A2E1466,transparent)}
.arches{position:absolute;top:0;left:0}
.medal{position:absolute;width:84px;height:84px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#F7D9A0,#C8743A 60%,#7A3E18);color:var(--bg);display:grid;place-items:center;align-content:center;text-align:center;box-shadow:0 16px 30px -8px #000,inset 0 0 0 4px #F1DDB855}
.medal b{font-size:20px;line-height:1}.medal small{font-size:11px;font-weight:700}.m1{top:90px;left:18px;transform:rotate(-8deg)}.m2{top:200px;right:18px;width:70px;height:70px;transform:rotate(6deg)}
.hero-copy{position:absolute;bottom:26px;inset-inline:18px;text-align:center}.hero-copy h1{font-size:44px;line-height:1.2;margin:0 0 8px;color:#F6E7CB}.hero-copy p{margin:0 0 14px;color:var(--mut)}
.btn{display:inline-block;padding:13px 28px;border-radius:999px;background:var(--cu);color:var(--bg);font-weight:700}
.sec{padding:30px 16px;text-align:center}.sand{background:var(--sand);color:var(--bg)}.orn{color:var(--cu);font-size:14px}.sec h2{font-size:34px;margin:2px 0 6px}.sub{margin:0 0 18px;color:#7A6450;font-size:14px}
.arch-cards{display:grid;grid-template-columns:1fr 1fr;gap:10px;text-align:center}
.ac{background:var(--bg);color:var(--sand);border-radius:150px 150px 16px 16px;padding:30px 12px 14px;position:relative;border:1px solid #00000022}.ac.wide{grid-column:span 1}.ac:last-child{grid-column:1/-1;border-radius:200px 200px 16px 16px}
.ac-top span{display:inline-grid;place-items:center;width:30px;height:30px;border-radius:50%;border:1px solid var(--gold);color:var(--gold);font-size:13px}
.ac h3{font-size:20px;margin:8px 0 8px;color:#F6E7CB}.ac ul{list-style:none;margin:0 0 10px;padding:0;font-size:12px;color:var(--mut);display:grid;gap:2px}.ac li b{color:var(--sand)}
.ac-p{border-top:1px solid var(--line);padding-top:8px;font-size:12px;color:var(--mut)}.ac-p b{font-size:22px;color:var(--gold)}
.svc-list{display:grid;gap:10px;text-align:right}.sv{display:flex;align-items:center;gap:12px;background:var(--card);border:1px solid var(--line);border-radius:60px 16px 16px 60px;padding:8px}
.sv-img .pimg{border-radius:48px 48px 10px 10px;overflow:hidden}.sv-b{flex:1;display:grid;gap:2px}.sv-b b{font-size:17px}.sv-b small{color:var(--mut);font-size:12px}
.sv-p{text-align:center;padding-inline-end:10px}.sv-p small{display:block;font-size:11px;color:var(--mut)}.sv-p b{font-size:20px;color:var(--gold)}
.promise{display:grid;grid-template-columns:1fr 1fr;gap:10px}.promise div{display:grid;justify-items:center;gap:8px;padding:16px 8px;border:1px solid #1A120C22;border-radius:90px 90px 12px 12px}.promise span{width:46px;height:46px;border-radius:50%;background:var(--bg);color:var(--gold);display:grid;place-items:center}.promise b{font-size:14px}
.pp-img{display:flex;justify-content:center;padding:6px 16px}.pp-img .pimg{border-radius:150px 150px 20px 20px;overflow:hidden;box-shadow:0 30px 50px -20px #000}
.ph{padding:16px 16px 6px;text-align:center}.ph h1{font-size:32px;margin:0;color:#F6E7CB}.ph p{margin:2px 0 0;color:var(--mut);font-size:14px}.ph.c{padding-top:10px}
.tierbox{margin:12px 16px;padding:18px 14px;border-radius:20px;background:var(--sand);color:var(--bg);text-align:center}.tierbox h3{margin:0 0 14px;font-size:20px}
.medals{display:grid;grid-template-columns:repeat(3,1fr);gap:12px 6px}.md{display:grid;justify-items:center;gap:5px}.disc{width:76px;height:76px;border-radius:50%;display:grid;place-items:center;box-shadow:inset 0 0 0 3px #ffffff55,0 8px 14px -6px #0006}
.t0 .disc{background:radial-gradient(circle at 35% 30%,#E7B48A,#A0603A 70%)}.t1 .disc{background:radial-gradient(circle at 35% 30%,#F4F1EC,#A9A39A 70%)}.t2 .disc{background:radial-gradient(circle at 35% 30%,#FFE7A8,#C99A2E 70%)}
.disc b{font-size:19px;color:var(--bg)}.md small{font-size:12px;color:#5C4636;font-weight:600}
.md.on .disc{outline:3px solid var(--bg);outline-offset:3px;transform:scale(1.06)}.md.on small{color:var(--bg);font-weight:800}
.legend{display:flex;justify-content:center;gap:14px;margin-top:14px;font-size:12px}.legend span{display:flex;align-items:center;gap:5px}.legend i{width:10px;height:10px;border-radius:50%}.legend .t0 i{background:#A0603A}.legend .t1 i{background:#A9A39A}.legend .t2 i{background:#C99A2E}
.field{margin:0 16px 12px}.field label{display:block;font-weight:700;margin-bottom:6px}.inp{border:1px solid var(--line);background:var(--card);border-radius:14px;padding:15px;color:var(--mut);direction:ltr;font-size:12.5px}
.scroll{margin:0 16px 14px;border:1px solid var(--gold);border-radius:16px;padding:14px 16px;background:linear-gradient(#241912,#1A120C)}.sc-h{text-align:center;color:var(--gold);font-family:'El Messiri';font-size:17px;margin-bottom:8px}
.sc-r{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px dashed var(--line)}.sc-r span{color:var(--mut)}.scroll p{margin:10px 0 0;font-size:13.5px;color:#D9C4A2;line-height:1.7}
.buybar{margin:0 16px;display:flex;gap:10px;align-items:center;background:var(--card);border:1px solid var(--line);border-radius:999px;padding:6px 6px 6px 6px}.bb-p{padding-inline:14px;display:grid}.bb-p small{font-size:11px;color:var(--mut)}.bb-p b{font-size:18px;color:var(--gold)}
.buy{flex:1;height:54px;border:0;border-radius:999px;background:linear-gradient(180deg,#DC8A4C,#B5612A);color:#1A120C;font:700 18px 'IBM Plex Sans Arabic';box-shadow:inset 0 1px 0 #ffffff55}
.added{margin:6px 16px 14px;padding:12px;border-radius:14px;background:var(--sand);color:var(--bg);display:flex;gap:8px;align-items:center;justify-content:center;font-weight:700}
.ci{margin:0 16px 12px;display:flex;gap:12px;align-items:center;padding:10px;border:1px solid var(--line);border-radius:16px;background:var(--card)}.ci .pimg{border-radius:40px 40px 8px 8px;overflow:hidden}.ci-b{flex:1;display:grid;gap:2px}.ci-b small{color:var(--mut);font-size:12px}.lnk{direction:ltr;text-align:right}.ci-p{font-size:20px;color:var(--gold)}
.sumbox{margin:0 16px 14px;border-radius:16px;background:var(--sand);color:var(--bg);padding:6px 16px}.sumbox div{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #1A120C1A}.sumbox div:last-child{border:0}.cu{color:var(--cu)}.tt{font-size:19px}
.buy.wide{width:calc(100% - 32px);margin:0 16px 8px;display:block}.apay{width:calc(100% - 32px);margin:0 16px;height:50px;border-radius:999px;background:#000;color:#fff;border:1px solid #333;font:700 18px -apple-system,sans-serif}
`;
module.exports = { id: 'd4-arch', title: 'قوس', font: 'El+Messiri:wght@500;700&family=IBM+Plex+Sans+Arabic:wght@400;600;700', css, body: home + product + cart, asset: pimg(singles[0], 500) };
