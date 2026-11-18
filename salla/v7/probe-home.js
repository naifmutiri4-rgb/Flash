// يطبع أقسام الرئيسية الحالية في ملاك (component-id + كلاسات + أول نص) وكلاسات كرت المنتج
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  await p.goto('https://flashstore-ksa.com/', { waitUntil: 'networkidle', timeout: 90000 });
  await p.evaluate(async () => { for (let y = 0; y < 9000; y += 600) { scrollTo(0, y); await new Promise(r => setTimeout(r, 100)); } });
  console.log(await p.evaluate(() => {
    const secs = [...document.querySelectorAll('main section, #main-content > section, section[component-id]')].filter((s, i, a) => a.indexOf(s) === i);
    const o = secs.map(s => `${s.getAttribute('component-id') || '-'} | ${s.className.slice(0, 70)} | h=${Math.round(s.getBoundingClientRect().height)} | ${s.innerText.trim().replace(/\s+/g, ' ').slice(0, 70)}`);
    const card = document.querySelector('.s-product-card-entry');
    o.push('CARD: ' + (card ? card.outerHTML.replace(/\s+/g, ' ').replace(/<svg.*?<\/svg>/g, '<svg/>').slice(0, 1500) : 'none'));
    const fx = [...new Set([...document.querySelectorAll('[class*="fx-"]')].map(e => [...e.classList].filter(c => c.startsWith('fx-')).join('.')))].slice(0, 40);
    o.push('FX: ' + fx.join(' '));
    return o.join('\n');
  }));
  await b.close();
})();
