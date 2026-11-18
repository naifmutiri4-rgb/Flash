// صور البانر العريض (قسم ملاك الأصلي اللي ينرسم من السيرفر، عشان يكون LCP أسرع):
// جوال 800×1067 (نفس تصميم الهيدر) + كمبيوتر 1456×520 (تكوين عريض بنفس العناصر). WebP جودة 86
const { chromium } = require('playwright');
const path = require('path');
const { execFileSync } = require('child_process');
const OUT = path.join(__dirname, '..', '..', 'docs', 'live');
const webp = (src, dst, w) => execFileSync('python3', ['-c', `from PIL import Image;im=Image.open('${src}').convert('RGB');im=im.resize((${w},round(im.height*${w}/im.width)),Image.LANCZOS) if im.width!=${w} else im;im.save('${dst}','WEBP',quality=86,method=6)`]);
(async () => {
  const b = await chromium.launch();
  // الجوال: من صورة الهيدر عالية الدقة
  webp(path.join(OUT, 'hero.png'), path.join(OUT, 'banner-m.webp'), 800);
  // الكمبيوتر: تكوين عريض
  const p = await b.newPage({ viewport: { width: 1456, height: 520 }, deviceScaleFactor: 1 });
  const phone = `<div class="ph"><div class="scr"><span class="live">● اكسبلور</span><div class="side">♥<b>12.4K</b>▮<b>890</b>➦<b>1.1K</b></div><i></i><i></i><i></i></div></div>`;
  await p.setContent(`<!doctype html><html dir="rtl"><head><link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;700&display=block" rel="stylesheet"><style>
  body{margin:0;width:1456px;height:520px;overflow:hidden;background:#0B0A12;font-family:'IBM Plex Sans Arabic';color:#fff;position:relative}
  .g1,.g2{position:absolute;border-radius:50%;filter:blur(80px)}.g1{width:520px;height:420px;background:#FF3D7F;opacity:.45;left:120px;top:-80px}.g2{width:520px;height:420px;background:#00E5D4;opacity:.3;left:420px;top:200px}
  .grid{position:absolute;inset:0;background-image:linear-gradient(#ffffff10 1px,transparent 1px),linear-gradient(90deg,#ffffff10 1px,transparent 1px);background-size:52px 52px;mask:radial-gradient(600px 400px at 30% 50%,#000,transparent)}
  .ph{position:absolute;left:330px;top:40px;width:230px;height:440px;border-radius:40px;background:#0E0C1E;border:6px solid #2C2850;transform:perspective(900px) rotateY(-22deg) rotateX(8deg) rotate(-4deg);box-shadow:-40px 50px 70px rgba(0,0,0,.6);padding:10px}
  .scr{height:100%;border-radius:30px;background:linear-gradient(160deg,#2B1E5C,#11102A 60%);position:relative;overflow:hidden}
  .live{position:absolute;top:14px;right:14px;background:#FF3D7F;font-size:14px;font-weight:700;padding:4px 12px;border-radius:999px}
  .side{position:absolute;left:12px;bottom:90px;display:flex;flex-direction:column;align-items:center;font-size:24px;gap:2px}.side b{font-size:12px;margin-bottom:10px}
  .scr i{position:absolute;right:18px;height:10px;border-radius:5px;background:#ffffff1c}.scr i:nth-of-type(1){bottom:60px;width:60%}.scr i:nth-of-type(2){bottom:42px;width:40%}.scr i:nth-of-type(3){bottom:24px;width:50%}
  .chip{position:absolute;padding:12px 20px;border-radius:999px;font-weight:700;font-size:20px;box-shadow:0 14px 34px -10px rgba(0,0,0,.6)}
  .c1{left:520px;top:70px;background:#00E5D4;color:#0B0A12;transform:rotate(4deg)}.c2{left:170px;top:250px;background:#FF3D7F;transform:rotate(-6deg)}.c3{left:540px;top:350px;background:#fff;color:#0B0A12}
  .copy{position:absolute;right:110px;top:50%;transform:translateY(-50%);width:600px}
  h1{font-size:72px;line-height:1.12;margin:0 0 18px}h1 span{background:linear-gradient(90deg,#00E5D4,#FF3D7F);-webkit-background-clip:text;color:transparent}
  p{font-size:24px;line-height:1.7;color:#C2BEDD;margin:0}p b{color:#fff}
  </style></head><body><div class="grid"></div><div class="g1"></div><div class="g2"></div>${phone}
  <div class="chip c1">+10K مشاهدة 👁</div><div class="chip c2">+1K لايك ♥</div><div class="chip c3">⚡ تنفيذ فوري</div>
  <div class="copy"><h1>خلّ مقطعك<br><span>يطلع اكسبلور</span></h1><p>مشاهدات ولايكات وشير وحفظ لتيك توك.<br>أسعار واضحة تبدأ من <b>1.99 ر.س</b></p></div></body></html>`, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
  const png = path.join(OUT, 'banner-d.png'); await p.screenshot({ path: png });
  webp(png, path.join(OUT, 'banner-d.webp'), 1456);
  // شعار الهيدر بمقاسه الفعلي (عرض 420 = ضعف عرض العرض 210)
  execFileSync('convert', [path.join(OUT, 'logo.png'), '-resize', '420x', path.join(OUT, 'logo-420.png')]);
  await b.close();
  console.log(execFileSync('identify', [path.join(OUT, 'banner-m.webp'), path.join(OUT, 'banner-d.webp'), path.join(OUT, 'logo-420.png')]).toString());
})();
