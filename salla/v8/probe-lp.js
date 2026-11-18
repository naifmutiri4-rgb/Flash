// يفحص صفحة الهبوط النشطة: وش السكربتات اللي تتحمّل، وكيف انرسم بلوك HTML (هل بقت class و style و svg)
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  const js = [];
  p.on('response', r => { const u = r.url(); if (/\.js(\?|$)/.test(u) && /html|bundle|twilight|component/i.test(u)) js.push(u); });
  await p.goto('https://flashstore-ksa.com/pages/lp1304367330/1377310171', { waitUntil: 'networkidle', timeout: 90000 });
  await p.waitForTimeout(1500);
  console.log('scripts:\n' + [...new Set(js)].join('\n'));
  console.log(await p.evaluate(() => {
    const h = document.querySelector('h1');
    const box = h && h.closest('[class*="html"], salla-custom-component, section, div');
    const root = h ? h.parentElement : document.body;
    return 'container: ' + (root ? root.outerHTML.replace(/\s+/g, ' ').slice(0, 1600) : 'none') +
      '\n\nbody classes sample: ' + [...new Set([...document.querySelectorAll('[class]')].slice(0, 60).map(e => e.className.toString().split(' ')[0]))].join(' ');
  }));
  await b.close();
})();
