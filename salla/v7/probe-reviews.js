// يطبع بنية التقييمات: قسم «قالوا عنا» في الرئيسية، وتقييمات صفحة المنتج (salla-comments)
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  const clean = h => h.replace(/\s+/g, ' ').replace(/<svg.*?<\/svg>/g, '<svg/>').replace(/<!---->/g, '');
  await p.goto('https://flashstore-ksa.com/', { waitUntil: 'networkidle', timeout: 90000 });
  await p.evaluate(async () => { for (let y = 0; y < 9000; y += 600) { scrollTo(0, y); await new Promise(r => setTimeout(r, 100)); } });
  console.log('HOME:', await p.evaluate(c => { const s = document.querySelector('.s-block--testimonials'); return s ? s.outerHTML : 'none'; }).then(clean).then(h => h.slice(2900, 5600)));
  await p.goto('https://flashstore-ksa.com/بكج-التفاعل/p1246605374', { waitUntil: 'networkidle', timeout: 90000 });
  await p.evaluate(async () => { for (let y = 0; y < 9000; y += 600) { scrollTo(0, y); await new Promise(r => setTimeout(r, 100)); } });
  await p.waitForTimeout(1500);
  console.log('\nPRODUCT:', await p.evaluate(() => { const s = document.querySelector('#product-tabs-faqs, .product-reviews'); return s ? s.outerHTML : 'none'; }).then(clean).then(h => h.slice(0, 4500)));
  await b.close();
})();
