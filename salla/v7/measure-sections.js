// يقيس الارتفاع النهائي لأقسام الرئيسية اللي تنرسم بالجافاسكربت (عشان نحجز مكانها ونمنع القفزات CLS)
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  for (const w of [390, 412, 1280]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    await p.goto('https://flashstore-ksa.com/?m=' + Date.now(), { waitUntil: 'networkidle', timeout: 90000 });
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise(r => setTimeout(r, 100)); } });
    await p.waitForTimeout(1500);
    console.log(w, JSON.stringify(await p.evaluate(() => Object.fromEntries([...document.querySelectorAll('main section[component-id], #main-content section[component-id], section[component-id]')].map(s => [s.getAttribute('component-id') + ':' + s.className.split(' ')[1], Math.round(s.getBoundingClientRect().height)])))));
    await p.close();
  }
  await b.close();
})();
