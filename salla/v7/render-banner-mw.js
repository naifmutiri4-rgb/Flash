// بانر عرضي للجوال (نسبة 8:5): خط كبير وعناصر أقل عشان يكون واضح وقصير. يطلع 1000×625 WebP
const { chromium } = require('playwright');
const path = require('path');
const { execFileSync } = require('child_process');
const OUT = path.join(__dirname, '..', '..', 'docs', 'live');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 400, height: 250 }, deviceScaleFactor: 2.5 });
  await p.setContent(`<!doctype html><html dir="ltr"><head><link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@500;700&display=block" rel="stylesheet"><style>
  html,body{overflow:hidden}body{margin:0;width:400px;height:250px;background:#0B0A12;font-family:'IBM Plex Sans Arabic';color:#fff;position:relative}
  .g1,.g2{position:absolute;border-radius:50%;filter:blur(40px)}.g1{width:220px;height:200px;background:#FF3D7F;opacity:.5;left:-30px;top:-40px}.g2{width:200px;height:180px;background:#00E5D4;opacity:.35;left:90px;top:120px}
  .grid{position:absolute;inset:0;background-image:linear-gradient(#ffffff0e 1px,transparent 1px),linear-gradient(90deg,#ffffff0e 1px,transparent 1px);background-size:26px 26px;mask:radial-gradient(240px 200px at 25% 50%,#000,transparent)}
  .ph{position:absolute;left:44px;top:24px;width:104px;height:200px;border-radius:20px;background:#0E0C1E;border:3px solid #2C2850;transform:perspective(500px) rotateY(-20deg) rotate(-5deg);box-shadow:-16px 22px 34px rgba(0,0,0,.6);padding:5px}
  .scr{height:100%;border-radius:15px;background:linear-gradient(160deg,#2B1E5C,#11102A 60%);position:relative;overflow:hidden}
  .live{direction:ltr;position:absolute;top:8px;right:8px;background:#FF3D7F;font-size:8px;font-weight:700;padding:2px 7px;border-radius:999px;font-family:Arial}
  .side{position:absolute;left:7px;bottom:40px;display:flex;flex-direction:column;align-items:center;font-size:13px;gap:1px}.side b{font-size:6.5px;margin-bottom:5px}
  .chip{direction:rtl;position:absolute;padding:5px 11px;border-radius:999px;font-weight:700;font-size:11.5px;box-shadow:0 8px 18px -6px rgba(0,0,0,.6);white-space:nowrap}
  .c1{left:112px;top:72px;background:#00E5D4;color:#0B0A12;transform:rotate(4deg)}.c2{left:12px;top:168px;background:#FF3D7F;transform:rotate(-5deg)}
  .copy{direction:rtl;text-align:right;position:absolute;right:20px;top:50%;transform:translateY(-50%);width:200px}
  h1{font-size:33px;line-height:1.15;margin:0 0 8px;font-weight:700}h1 span{background:linear-gradient(90deg,#00E5D4,#FF3D7F);-webkit-background-clip:text;color:transparent}
  p{font-size:12.5px;line-height:1.6;color:#C2BEDD;margin:0}p b{color:#fff;font-size:14px}
  .cta{display:inline-block;margin-top:10px;background:linear-gradient(90deg,#00E5D4,#FF3D7F);color:#0B0A12;font-weight:700;font-size:12px;padding:6px 14px;border-radius:10px}
  </style></head><body><div class="grid"></div><div class="g1"></div><div class="g2"></div>
  <div class="ph"><div class="scr"><span class="live">● LIVE</span><div class="side">♥<b>12.4K</b>▮<b>890</b>➦<b>1.1K</b></div></div></div>
  <div class="chip c1">+10K مشاهدة</div><div class="chip c2">⚡ تنفيذ فوري</div>
  <div class="copy"><h1>خلّ مقطعك<br><span>يشتغل لايف</span></h1><p>مشاهدات ولايكات وشير وحفظ<br>تبدأ من <b>1.99 ر.س</b></p><span class="cta">تصفّح الباقات</span></div>
  </body></html>`, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
  const png = path.join(OUT, 'banner-mw.png');
  await p.screenshot({ path: png });
  execFileSync('python3', ['-c', `from PIL import Image;Image.open('${png}').convert('RGB').save('${path.join(OUT, 'banner-mw.webp')}','WEBP',quality=88,method=6)`]);
  await b.close();
  console.log(execFileSync('identify', [path.join(OUT, 'banner-mw.webp')]).toString());
})();
