// ثلاث اتجاهات لصفحة الهبوط، مبنية على عناصر صفحات الهبوط الجاهزة في سلة (رأس الصفحة، مقدمة الصفحة، مميزات المنتج،
// مقارنة، آراء العملاء، الأسئلة الشائعة، الشراء السريع + الشريط الثابت) بألوان «بث مباشر» وبيانات المتجر الحقيقية.
// يطلع صورة جوال طويلة لكل اتجاه في salla/v8/mock/
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, 'mock'); fs.mkdirSync(OUT, { recursive: true });
const img = n => 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, '..', 'v7', 'img', n + '.png')).toString('base64');
const logo = 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, '..', '..', 'docs', 'live', 'logo-420.png')).toString('base64');
const bannerM = 'data:image/webp;base64,' + fs.readFileSync(path.join(__dirname, '..', '..', 'docs', 'live', 'banner-mw-v1.webp')).toString('base64');
const C = { bg: '#0B0A12', bg2: '#EEEBFF', card: '#16142A', line: '#241F45', cy: '#00E5D4', pk: '#FF3D7F', mut: '#C2BEDD' };
const packs = [['بكج التوفير', 9.99, 17.99, '2K', '250', '50', '50', 'saver'], ['بكج التوفير المطور', 17.99, 24.99, '5K', '500', '100', '100', 'saver-plus'], ['بكج التفاعل', 29.99, 39.99, '10K', '750', '250', '250', 'interact'], ['بكج الذهبي', 39.99, 49.99, '15K', '1K', '500', '500', 'gold'], ['بكج اكسبلور', 54.99, 79.99, '20K', '1.5K', '750', '750', 'explore']];
const header = `<header class="hd"><img src="${logo}" alt=""></header>`;
const hero = (sub, title, desc, image, btn) => `<section class="hero"><div class="hero-img"><img src="${image}"></div><div class="hero-t"><span class="sub">${sub}</span><h1>${title}</h1><p>${desc}</p>${btn ? `<a class="btn">${btn}</a>` : ''}</div></section>`;
const feats = (title, sub, items, center) => `<section class="sec"><h2>${title}</h2><p class="lead">${sub}</p><div class="feats">${items.map(([n, d, ic]) => `<div class="ft"><i>${ic}</i><b>${n}</b><small>${d}</small></div>`).join('')}</div>${center ? `<img class="center" src="${center}">` : ''}</section>`;
const reviews = `<section class="sec alt"><h2>آراء العملاء</h2><div class="revs">${[['متجر جميل ومضمون واسعار معقوله', 'منيفه'], ['افضل متجر تعاملت معه', 'عمر'], ['اسطوري وثقه وسرعه في التنفيذ', 'Adnan']].map(([t, n]) => `<div class="rv"><span>★★★★★</span><p>${t}</p><small>${n}</small></div>`).join('')}</div></section>`;
const faq = `<section class="sec"><h2>الأسئلة الشائعة</h2>${['متى يبدأ تنفيذ طلبي؟', 'هل تحتاجون كلمة مرور حسابي؟', 'هل يوجد ضمان على النقص؟', 'وش لازم أسوي قبل الطلب؟'].map(q => `<div class="q">${q}<b>+</b></div>`).join('')}</section>`;
const quick = (name, pr, reg, im) => `<section class="sec"><h2>اطلبه الآن</h2><div class="qb"><div class="qb-h"><img src="${im}"><div><b>${name}</b><span><em>${pr} ر.س</em> <s>${reg} ر.س</s></span></div></div><div class="qb-f">رابط المقطع<span>https://www.tiktok.com/@…</span></div><div class="qb-pay"><span>Apple Pay</span><span>مدى</span><span>Visa</span><span>STC</span></div><a class="btn wide">إتمام الطلب · ${pr} ر.س</a></div></section>`;
const sticky = (badge, title, btn) => `<div class="sticky"><span class="badge">${badge}</span><b>${title}</b><a class="btn sm">${btn}</a></div>`;
const compare = `<section class="sec alt"><h2>قارن الباقات</h2><p class="lead">كل باقة فيها مشاهدات ولايكات وشير وحفظ لمقطع واحد</p><table><tr><th>الباقة</th><th>👁</th><th>♥</th><th>➦</th><th>▮</th><th>السعر</th></tr>${packs.map(p => `<tr><td>${p[0].replace('بكج ', '')}</td><td>${p[3]}</td><td>${p[4]}</td><td>${p[5]}</td><td>${p[6]}</td><td class="pr">${p[1]}</td></tr>`).join('')}</table><a class="btn wide">تصفّح الباقات في المتجر</a></section>`;
const trust = feats('ليش فلاش ستور؟', 'خدمات تيك توك بأسعار واضحة', [['تنفيذ فوري', 'يبدأ بعد الدفع مباشرة', '⚡'], ['تعويض', 'حسب سياسة فلاش ستور', '↺'], ['دفع آمن', 'عبر سلة و Apple Pay', '🔒'], ['دعم متواصل', 'نرد على استفساراتك', '💬']]);
const pages = {
  'A-product': ['صفحة منتج: بكج التوفير', [header,
    hero('الأكثر طلباً في فلاش ستور', 'بكج التوفير', 'مشاهدات ولايكات وشير وحفظ لمقطع واحد، بتنفيذ فوري بعد الدفع.', img('saver'), 'اطلب الآن · 9.99 ر.س'),
    feats('وش فيه البكج؟', 'محتويات بكج التوفير لمقطع واحد', [['2,000 مشاهدة', 'لمقطع واحد', '👁'], ['250 لايك', 'حسابات أجانب', '♥'], ['50 شير', 'تنفيذ فوري', '➦'], ['50 حفظ', 'تعويض حسب السياسة', '▮']], img('saver')),
    reviews, quick('بكج التوفير', '9.99', '17.99', img('saver')), faq, sticky('الأكثر طلباً', 'بكج التوفير · 9.99 ر.س', 'اطلبه الآن')]],
  'B-gateway': ['بوابة المتجر (رابط البايو)', [header,
    `<section class="banner"><img src="${bannerM}"></section>`,
    trust, compare, reviews, faq, sticky('خصم 10%', 'استخدم كود F10', 'ادخل المتجر')]],
  'C-explore': ['قصة «اكسبلور»', [header,
    hero('خدمات تيك توك', 'خلّ مقطعك يطلع اكسبلور', 'اختر الباقة، الصق الرابط، ويبدأ التنفيذ فوراً.', img('explore'), 'شوف الباقات'),
    `<section class="sec"><h2>3 خطوات</h2><ol class="steps"><li><b>1</b>اختر الباقة أو الخدمة</li><li><b>2</b>الصق رابط المقطع</li><li><b>3</b>ادفع، والتنفيذ يبدأ فوراً</li></ol></section>`,
    `<section class="sec alt"><h2>الباقات</h2><div class="gal">${packs.map(p => `<div><img src="${img(p[7])}"><b>${p[0]}</b><em>${p[1]} ر.س</em></div>`).join('')}</div></section>`,
    reviews, faq, sticky('من 9.99 ر.س', 'باقات تيك توك', 'اطلب الآن')]],
};
const css = `*{box-sizing:border-box}body{margin:0;background:#222;font-family:'IBM Plex Sans Arabic',sans-serif}
.pg{width:390px;background:${C.bg};color:#fff;padding-bottom:84px;position:relative}
.hd{background:${C.bg};padding:12px 16px;display:flex;justify-content:center;border-bottom:1px solid #221F3D}.hd img{height:36px}
.hero{padding:16px;display:grid;gap:14px}.hero-img img{width:100%;border-radius:22px;display:block}.sub{display:inline-block;font-size:12px;font-weight:700;color:${C.bg};background:${C.cy};padding:4px 10px;border-radius:999px}
.hero h1{font-size:32px;line-height:1.25;margin:10px 0 6px}.hero p{color:${C.mut};margin:0 0 14px;line-height:1.8}
.btn{display:inline-flex;justify-content:center;align-items:center;background:linear-gradient(90deg,${C.cy},${C.pk});color:${C.bg};font-weight:700;padding:14px 22px;border-radius:14px;text-decoration:none}.btn.wide{display:flex;width:100%}.btn.sm{padding:10px 14px;font-size:13px}
.banner img{width:100%;display:block}
.sec{padding:26px 16px}.sec.alt{background:${C.bg2};color:${C.bg}}.sec h2{font-size:24px;margin:0 0 6px;text-align:center}.lead{text-align:center;color:${C.mut};margin:0 0 16px;font-size:14px}.alt .lead{color:#4F4A70}
.feats{display:grid;grid-template-columns:1fr 1fr;gap:10px}.ft{background:${C.card};border:1px solid ${C.line};border-radius:16px;padding:14px;display:grid;gap:4px}.ft i{font-style:normal;width:36px;height:36px;border-radius:10px;background:rgba(0,229,212,.12);color:${C.cy};display:grid;place-items:center}.ft b{font-size:16px}.ft small{color:${C.mut};font-size:12.5px}
.center{width:60%;display:block;margin:16px auto 0;border-radius:18px}
.revs{display:grid;gap:10px}.rv{background:#2A1F52;color:#fff;border-radius:18px;padding:14px}.rv span{color:#FFC94D}.rv p{margin:6px 0;font-weight:600}.rv small{color:${C.mut}}
.q{display:flex;justify-content:space-between;background:${C.card};border:1px solid ${C.line};border-radius:14px;padding:14px;margin-bottom:8px;font-weight:600}.q b{color:${C.cy}}
.qb{background:${C.card};border:1px solid ${C.line};border-radius:20px;padding:14px;display:grid;gap:12px}.qb-h{display:flex;gap:12px;align-items:center}.qb-h img{width:64px;height:64px;border-radius:12px}.qb-h b{display:block}.qb-h em{font-style:normal;color:${C.cy};font-weight:700}.qb-h s{color:${C.mut};font-size:12px}
.qb-f{display:grid;gap:6px;font-size:13px;font-weight:700}.qb-f span{background:${C.bg};border:1px solid #2A2550;border-radius:12px;padding:12px;color:${C.mut};direction:ltr;font-weight:400}
.qb-pay{display:flex;gap:6px}.qb-pay span{flex:1;text-align:center;font-size:11px;padding:8px 4px;border-radius:8px;background:#fff;color:#111;font-weight:700}
table{width:100%;border-collapse:collapse;background:#fff;border-radius:16px;overflow:hidden;margin-bottom:14px;font-size:13px}th{background:${C.bg};color:#fff;padding:8px 4px}td{padding:10px 4px;text-align:center;border-top:1px solid #E4E0FA}td:first-child{text-align:right;font-weight:700;padding-right:10px}.pr{color:#A80F45;font-weight:700}
.steps{list-style:none;margin:0;padding:0;display:grid;gap:10px}.steps li{display:flex;gap:12px;align-items:center;background:${C.bg2};color:${C.bg};border-radius:14px;padding:12px;font-weight:700}.steps b{width:32px;height:32px;border-radius:50%;background:${C.bg};color:${C.cy};display:grid;place-items:center}
.gal{display:grid;grid-template-columns:1fr 1fr;gap:10px}.gal div{background:${C.bg};border-radius:16px;overflow:hidden;color:#fff;display:grid}.gal img{width:100%}.gal b{padding:8px 10px 0}.gal em{font-style:normal;color:${C.cy};padding:0 10px 10px;font-weight:700}
.sticky{position:absolute;bottom:0;inset-inline:0;background:rgba(11,10,18,.96);border-top:1px solid ${C.line};padding:10px 12px;display:flex;align-items:center;gap:8px}.sticky b{flex:1;font-size:14px}.badge{background:${C.pk};font-size:11px;font-weight:700;padding:4px 9px;border-radius:999px}`;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 640, height: 900 }, deviceScaleFactor: 2 });
  for (const [id, [label, parts]] of Object.entries(pages)) {
    await p.setContent(`<!doctype html><html dir="rtl"><head><link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;600;700&display=block" rel="stylesheet"><style>${css}</style></head><body><div class="pg" id="pg">${parts.join('')}</div></body></html>`, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.locator('#pg').screenshot({ path: path.join(OUT, id + '.png') });
    console.log(id, label);
  }
  await b.close();
})();
