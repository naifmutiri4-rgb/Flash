// ② «فاتورة» — تحريري سويسري: فحمي + ورقي كريمي، أحمر إشارة، أرقام مطبوعة، جداول بنمط الإيصال
const { icon, iconFill, singles, packs, n, k, sar } = require('./data');
const C = { bg: '#141414', bg2: '#EDE6D8', red: '#E5432D', ink: '#141414', mut: '#8A8378', line: '#2A2A2A' };
const MONO = "'JetBrains Mono',monospace";

const pimg = (s, sz = 500) => `
<div class="pimg" style="width:${sz}px;height:${sz}px">
  <svg viewBox="0 0 500 500" width="${sz}" height="${sz}">
    <rect width="500" height="500" fill="${C.bg2}"/>
    <g fill="${C.ink}" opacity=".06">${Array.from({ length: 26 }, (_, i) => `<rect x="0" y="${i * 20}" width="500" height="1"/>`).join('')}</g>
    <text x="470" y="74" font-family="Readex Pro" font-size="22" font-weight="700" fill="${C.ink}" text-anchor="end">فلاش ستور</text>
    <text x="30" y="74" font-family="JetBrains Mono" font-size="18" fill="${C.mut}">No.${String(singles.indexOf(s) + 1).padStart(2, '0')}</text>
    <rect x="30" y="92" width="440" height="3" fill="${C.ink}"/>
    <text x="250" y="300" font-family="JetBrains Mono" font-size="${s.q[2][0] >= 10000 ? 150 : 170}" font-weight="800" fill="${C.ink}" text-anchor="middle" letter-spacing="-8">+${k(s.q[2][0])}</text>
    <g transform="translate(410 118)" style="color:${C.red}">${iconFill(s.ic, 60)}</g>
    <rect x="30" y="350" width="440" height="1.5" fill="${C.ink}"/>
    <text x="470" y="410" font-family="Readex Pro" font-size="50" font-weight="700" fill="${C.ink}" text-anchor="end">${s.name.replace(' تيك توك', '')}</text>
    <text x="470" y="448" font-family="Readex Pro" font-size="20" fill="${C.mut}" text-anchor="end">تيك توك · تنفيذ فوري</text>
    <rect x="30" y="384" width="150" height="66" fill="${C.red}"/>
    <text x="105" y="414" font-family="Readex Pro" font-size="15" fill="#fff" text-anchor="middle">يبدأ من</text>
    <text x="105" y="440" font-family="JetBrains Mono" font-size="22" font-weight="800" fill="#fff" text-anchor="middle">${sar(s.from)}</text>
  </svg>
</div>`;

const hero = `
<div id="hero" class="hero">
  <div class="paper p3"></div><div class="paper p2"></div>
  <div class="paper p1">
    <div class="pp-top"><span>فلاش ستور</span><span class="m">REC · 0001</span></div>
    <div class="big">+10,000</div>
    <div class="pp-row"><span>مشاهدة تيك توك</span><span class="m">12.99</span></div>
    <div class="pp-row"><span>مدة التنفيذ</span><span>فوري</span></div>
    <div class="pp-row"><span>الدفع</span><span>عبر سلة</span></div>
    <div class="bar"></div>
  </div>
  <div class="stamp">مدفوع<br><small>✓</small></div>
  <div class="hero-copy"><h1>تفاعل<br>بالأرقام<span>.</span></h1><p>كل خدمة بسعرها، وكل كمية بسطرها. بدون مفاجآت.</p></div>
</div>`;

const header = `<div class="ad">خصم 10% على كل الخدمات — الكود <b>F10</b></div>
<header class="hd"><button>${icon('menu', 22)}</button><div class="logo">فلاش <b>ستور</b></div><button class="cartb">${icon('cart', 20)}<em>1</em></button></header>`;

const home = `
<section class="scr" id="home">${header}${hero}
  <div class="sec paper-bg">
    <div class="kick">قائمة الأسعار</div><h2>الخدمات</h2>
    <div class="rcpt">${singles.map(s => `<a class="r-line"><span class="r-ic">${icon(s.ic, 18)}</span><span class="r-n">${s.name}</span><span class="dots"></span><span class="r-p"><small>من</small> ${sar(s.from)}</span></a>`).join('')}</div>
    <div class="thumbs">${singles.map(s => pimg(s, 82)).join('')}</div>
  </div>
  <div class="sec">
    <div class="kick red">باقات مجمّعة</div><h2>الباقات</h2>
    <div class="tickets">${packs.map((p, i) => `<article class="tk"><div class="tk-l"><b>${sar(p.price)}</b><small>ر.س</small></div><div class="tk-r"><h3>${p.name}</h3><p class="m">${k(p.v)} مشاهدة · ${n(p.l)} لايك · ${n(p.s)} شير · ${n(p.f)} حفظ</p></div><span class="tk-no m">${String(i + 1).padStart(2, '0')}</span></article>`).join('')}</div>
  </div>
  <div class="sec paper-bg cols"><div><b class="m">01</b><strong>تنفيذ فوري</strong><small>يبدأ بعد الدفع مباشرة</small></div><div><b class="m">02</b><strong>تعويض</strong><small>حسب سياسة فلاش ستور</small></div><div><b class="m">03</b><strong>دفع آمن</strong><small>عبر سلة و Apple Pay</small></div><div><b class="m">04</b><strong>دعم متواصل</strong><small>نرد على استفساراتك</small></div></div>
</section>`;

const v = singles[0];
const product = `
<section class="scr" id="product">${header}
  <div class="crumb m">الرئيسية / الخدمات / مشاهدات</div>
  <div class="pp-img">${pimg(v, 358)}</div>
  <div class="ph"><h1>${v.name}</h1><p>الكميات من 2,000 إلى 1,000,000 مشاهدة</p></div>
  <div class="tbl">
    <div class="tbl-h"><span>الكمية</span><span>السعر</span><span>لكل 1,000</span></div>
    ${v.q.map(([q, p], i) => `<label class="tr ${i === 2 ? 'on' : ''}"><span class="rd"></span><span class="m q">${n(q)}</span><span class="m">${sar(p)}</span><span class="m per">${(p / q * 1000).toFixed(2)}</span></label>`).join('')}
  </div>
  <div class="field"><label>رابط المقطع</label><div class="inp m">https://www.tiktok.com/@…/video/…</div><small>الحساب لازم يكون عام. ما نطلب كلمة المرور.</small></div>
  <div class="spec"><div><span>مدة التنفيذ</span><b>فوري</b></div><div><span>نوع الحسابات</span><b>أجانب</b></div><div><span>ضمان التعويض</span><b>حسب السياسة</b></div></div>
  <div class="buybar"><div class="tot"><small>المجموع</small><b class="m">12.99</b></div><button class="buy">أضف للسلة</button></div>
</section>`;

const cart = `
<section class="scr" id="cart">${header}
  <div class="cart-wrap">
    <div class="note">${icon('check', 16)} أُضيف إلى السلة</div>
    <div class="receipt">
      <div class="rc-h"><b>فلاش ستور</b><span class="m">السلة · 18/11</span></div>
      <div class="rc-item"><div><b>${v.name}</b><small class="m">10,000 × 1</small><small class="m lnk">tiktok.com/@…/video/…</small></div><b class="m">12.99</b></div>
      <div class="rc-sep"></div>
      <div class="rc-row"><span>المجموع</span><span class="m">12.99</span></div>
      <div class="rc-row"><span>كود الخصم</span><span class="m code">F10 ← تطبيق</span></div>
      <div class="rc-sep"></div>
      <div class="rc-row tot"><span>الإجمالي</span><span class="m">12.99 ر.س</span></div>
      <div class="barcode"></div>
    </div>
    <button class="buy wide">إتمام الطلب</button>
    <button class="apay"> Pay</button>
  </div>
</section>`;

const css = `
:root{--bg:${C.bg};--p:${C.bg2};--red:${C.red};--mut:${C.mut}}
body{font-family:'Readex Pro',sans-serif;background:#222;margin:0}.m{font-family:${MONO}}
.scr{width:390px;background:var(--bg);color:var(--p);overflow:hidden;padding-bottom:24px}
.ad{background:var(--red);color:#fff;text-align:center;font-size:13px;padding:7px}.ad b{font-family:${MONO}}
.hd{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid #2A2A2A}
.hd button{width:42px;height:42px;border:1px solid #3A3A3A;background:none;color:var(--p);display:grid;place-items:center;position:relative}
.logo{font-size:22px;font-weight:300;letter-spacing:-.5px}.logo b{font-weight:700;margin-inline-start:4px}
.cartb{background:var(--p)!important;color:var(--bg)!important;border:0!important}.cartb em{position:absolute;top:-6px;left:-6px;font-style:normal;background:var(--red);color:#fff;font-size:11px;width:18px;height:18px;display:grid;place-items:center;font-family:${MONO}}
.hero{position:relative;height:540px;overflow:hidden;background:radial-gradient(400px 300px at 70% 30%,#2A2622,transparent)}
.paper{position:absolute;width:250px;height:330px;left:50%;top:40px;background:var(--p);color:var(--bg);margin-left:-110px}
.p3{transform:rotate(9deg) translate(30px,10px);background:#CFC7B6;box-shadow:0 30px 60px rgba(0,0,0,.6)}.p2{transform:rotate(4deg) translate(14px,4px);background:#DED6C5}
.p1{transform:rotate(-3deg);padding:18px;box-shadow:-20px 40px 50px -10px rgba(0,0,0,.7);background:linear-gradient(160deg,#F6F0E4,#E4DCCB)}
.pp-top{display:flex;justify-content:space-between;font-size:13px;font-weight:700;border-bottom:2px solid var(--bg);padding-bottom:8px}.pp-top .m{font-weight:400;color:var(--mut)}
.big{font-family:${MONO};font-weight:800;font-size:52px;letter-spacing:-3px;margin:22px 0 14px;direction:ltr;text-align:right}
.pp-row{display:flex;justify-content:space-between;font-size:13px;padding:6px 0;border-bottom:1px dashed #14141444}
.bar{height:34px;margin-top:16px;background:repeating-linear-gradient(90deg,#141414 0 2px,transparent 2px 4px,#141414 4px 7px,transparent 7px 9px)}
.stamp{position:absolute;top:250px;left:40px;width:96px;height:96px;border:3px solid var(--red);border-radius:50%;color:var(--red);display:grid;place-items:center;text-align:center;font-weight:800;font-size:20px;transform:rotate(-16deg);line-height:1;opacity:.9}
.hero-copy{position:absolute;bottom:24px;inset-inline:18px}.hero-copy h1{font-size:54px;line-height:.98;margin:0 0 12px;font-weight:700;letter-spacing:-1px}.hero-copy h1 span{color:var(--red)}.hero-copy p{margin:0;color:#B8B0A2;font-size:15px}
.sec{padding:28px 16px}.paper-bg{background:var(--p);color:var(--bg)}.kick{font-size:12px;font-weight:700;letter-spacing:.5px;color:var(--mut);border-top:2px solid currentColor;padding-top:8px;display:inline-block}.kick.red{color:var(--red)}
.sec h2{font-size:36px;margin:6px 0 16px;font-weight:700;letter-spacing:-.5px}
.r-line{display:flex;align-items:center;gap:10px;padding:14px 0;border-bottom:1px solid #14141426;font-size:17px;font-weight:600}.r-line:first-child{border-top:2px solid var(--bg)}
.r-ic{color:var(--red);display:flex}.dots{flex:1;border-bottom:2px dotted #14141455;transform:translateY(5px)}.r-p{font-family:${MONO};font-weight:800;font-size:18px}.r-p small{font-family:'Readex Pro';font-weight:400;font-size:12px;color:var(--mut)}
.thumbs{display:flex;gap:8px;margin-top:16px}.thumbs .pimg{border:1px solid #14141433}
.tickets{display:grid;gap:10px}.tk{display:flex;background:var(--p);color:var(--bg);position:relative;min-height:84px}
.tk-l{width:96px;flex:none;display:flex;flex-direction:column;justify-content:center;align-items:center;border-inline-end:2px dashed #14141455;position:relative}
.tk-l::before,.tk-l::after{content:"";position:absolute;inset-inline-end:-10px;width:18px;height:18px;border-radius:50%;background:var(--bg)}.tk-l::before{top:-9px}.tk-l::after{bottom:-9px}
.tk-l b{font-family:${MONO};font-size:22px}.tk-l small{font-size:11px;color:var(--mut)}
.tk-r{padding:12px 14px;flex:1}.tk-r h3{margin:0 0 4px;font-size:18px}.tk-r p{margin:0;font-size:11.5px;color:#5C564C;line-height:1.6}.tk-no{position:absolute;top:8px;left:10px;font-size:11px;color:var(--red)}
.cols{display:grid;grid-template-columns:1fr 1fr;gap:0}.cols div{padding:14px 10px;border-top:2px solid var(--bg);display:grid;gap:2px}.cols div:nth-child(odd){border-inline-end:1px solid #14141433}.cols b{color:var(--red);font-size:12px}.cols strong{font-size:17px}.cols small{color:var(--mut);font-size:12.5px}
.crumb{font-size:11px;color:#77706A;padding:12px 16px 6px}
.pp-img{padding:0 16px}.ph{padding:16px 16px 8px}.ph h1{font-size:30px;margin:0;font-weight:700;letter-spacing:-.5px}.ph p{margin:4px 0 0;color:#9E978B;font-size:14px}
.tbl{margin:10px 16px 16px;background:var(--p);color:var(--bg);padding:6px 12px}
.tbl-h,.tr{display:grid;grid-template-columns:22px 1fr 1fr 1fr;align-items:center;gap:6px}.tbl-h{grid-template-columns:22px 1fr 1fr 1fr;font-size:11px;color:var(--mut);padding:8px 0;border-bottom:2px solid var(--bg)}.tbl-h span:first-child{grid-column:2}
.tr{padding:11px 0;border-bottom:1px solid #14141420;font-size:15px}.tr .q{font-weight:800}.tr .per{color:var(--mut);font-size:12px}
.rd{width:16px;height:16px;border:2px solid var(--bg);border-radius:50%}.tr.on{background:var(--bg);color:var(--p);margin:0 -12px;padding:11px 12px}.tr.on .rd{border-color:var(--red);background:radial-gradient(circle,var(--red) 45%,transparent 50%)}.tr.on .per{color:#B8B0A2}
.field{margin:0 16px 16px}.field label{font-weight:700;font-size:15px;display:block;margin-bottom:8px}.inp{border:1.5px solid var(--p);padding:15px 12px;font-size:12.5px;direction:ltr;color:#9E978B}.field small{display:block;margin-top:6px;color:#9E978B;font-size:12px}
.spec{margin:0 16px 16px;display:grid;grid-template-columns:repeat(3,1fr);border-block:1px solid #3A3A3A}.spec div{padding:12px 8px;display:grid;gap:3px}.spec div+div{border-inline-start:1px solid #3A3A3A}.spec span{font-size:11px;color:#9E978B}.spec b{font-size:15px}
.buybar{display:flex;align-items:stretch;margin:0 16px;border:2px solid var(--p)}.tot{padding:8px 14px;display:grid;align-content:center}.tot small{font-size:11px;color:#9E978B}.tot b{font-size:24px}
.buy{flex:1;border:0;background:var(--red);color:#fff;font:700 18px 'Readex Pro';height:62px}
.cart-wrap{padding:18px 16px}.note{display:flex;gap:8px;align-items:center;color:var(--bg);background:var(--p);padding:10px 12px;font-weight:700;font-size:14px;border-inline-start:6px solid var(--red);margin-bottom:16px}
.receipt{background:var(--p);color:var(--bg);padding:18px 16px 14px;position:relative;margin-bottom:22px;-webkit-mask:conic-gradient(from -45deg at bottom,#0000,#000 1deg 89deg,#0000 90deg) 50%/14px 100%}
.rc-h{display:flex;justify-content:space-between;align-items:baseline;border-bottom:2px solid var(--bg);padding-bottom:10px;margin-bottom:12px}.rc-h b{font-size:20px}.rc-h span{font-size:11px;color:var(--mut)}
.rc-item{display:flex;justify-content:space-between;gap:10px}.rc-item div{display:grid;gap:2px}.rc-item small{font-size:12px;color:var(--mut)}.lnk{direction:ltr;text-align:right}.rc-item>b{font-size:20px}
.rc-sep{border-top:2px dashed #14141455;margin:14px 0}.rc-row{display:flex;justify-content:space-between;padding:4px 0;font-size:15px}.code{color:var(--red);font-size:13px}.rc-row.tot{font-size:20px;font-weight:800}
.barcode{height:44px;margin:16px 0 10px;background:repeating-linear-gradient(90deg,#141414 0 3px,transparent 3px 5px,#141414 5px 6px,transparent 6px 9px,#141414 9px 13px,transparent 13px 15px)}
.buy.wide{width:100%;height:58px;margin-bottom:8px}.apay{width:100%;height:52px;background:#000;color:#fff;border:1px solid #444;font:700 18px -apple-system,sans-serif}
`;
module.exports = { id: 'd2-receipt', title: 'فاتورة', font: 'Readex+Pro:wght@300;400;600;700&family=JetBrains+Mono:wght@400;800', css, body: home + product + cart, asset: pimg(singles[0], 500) };
