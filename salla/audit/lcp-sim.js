// محاكاة رئيسية v5 على صفحة المتجر الحقيقية لقياس LCP قبل النشر:
// - عنوان قسم الباقات المنشور يصير عنوان الصفحة الجديد (نفس اللي حفظناه في المسودة)
// - قسم البداية القديم (HTML) يتشال من أعلى الصفحة
// - CSS v4 ينحقن في <head> مع تحويل أرقام أقسام المسودة لأرقام المنشور
// جوال، شبكة 4G تقريبية، معالج أبطأ ×4.
const { chromium } = require('playwright');
const fs = require('fs');
const { execFileSync } = require('child_process');
(async () => {
  const url = 'https://flashstore-ksa.com/';
  const mode = process.argv[2] || 'after';
  let css = fs.readFileSync(__dirname + '/../v4/flash-malak.css', 'utf8').replace(/721318189/g, '1634550583');
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  if (mode === 'after') {
    await p.route(r => r.href === url, async route => {
      let html = fs.readFileSync(process.env.RAW, 'utf8'); // نسخة خام من الصفحة (curl)، لأن Cloudflare يحجب الطلبات المتكررة
      html = html.replace('<h2 class="w-full da-cp">باقات مميزة</h2>', '<h2 class="w-full da-cp">تفاعل أكثر لمقطعك على تيك توك</h2>')
                 .replace('جمعنا لك كل الخدمات ببكجات!', 'باقات جاهزة فيها مشاهدات ولايكات وشير وحفظ لمقطع واحد. تختار، تلصق الرابط، ويبدأ التنفيذ آلياً بعد الدفع.')
                 .replace('component-id="219185457"', 'component-id="219185457" style="display:none"')
                 .replace('</head>', `<style>${css}</style></head>`);
      await route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html });
    });
  }
  const cdp = await p.context().newCDPSession(p);
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6e6 / 8 * 4, uploadThroughput: 750e3 / 8 * 4 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await p.addInitScript(() => {
    window.__lcp = []; window.__cls = 0;
    new PerformanceObserver(l => { for (const e of l.getEntries()) { const n = e.element; window.__lcp.push(Math.round(e.startTime) + 'ms ' + (n ? n.tagName.toLowerCase() + ' "' + (n.textContent || '').trim().slice(0, 30) + '"' : '?') + ' size=' + e.size); } }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
  });
  await p.goto(url, { waitUntil: 'networkidle', timeout: 120000 });
  await p.waitForTimeout(2000);
  const r = await p.evaluate(() => ({ lcp: window.__lcp, cls: window.__cls.toFixed(3) }));
  console.log(mode, 'CLS', r.cls); console.log(r.lcp.join('\n'));
  await p.screenshot({ path: __dirname + `/shots/lcp-${mode}.png` });
  await b.close();
})();
