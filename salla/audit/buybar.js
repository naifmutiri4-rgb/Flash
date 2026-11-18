// يفحص منطقة الشراء في صفحة المنتج (أضف للسلة، اشتر الآن، Apple Pay) بدون CSS ومع CSS v4:
// التركيب، الظهور، المقاس، وهل الزر قابل للضغط (مو مغطى بعنصر ثاني)، ويصوّر المنطقة.
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [url, css, out] = process.argv.slice(2);
  const b = await chromium.launch();
  for (const mode of ['before', 'after']) {
    const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
    if (mode === 'after') await p.addInitScript(t => { const put = () => { if (document.head && !document.getElementById('fx-qa')) { const s = document.createElement('style'); s.id = 'fx-qa'; s.textContent = t; document.head.appendChild(s); return true; } }; if (!put()) new MutationObserver((m, o) => { if (put()) o.disconnect(); }).observe(document, { childList: true, subtree: true }); }, fs.readFileSync(css, 'utf8'));
    await p.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
    await p.waitForTimeout(1500);
    const info = await p.evaluate(() => {
      const bar = document.querySelector('.sticky-product-bar');
      if (!bar) return { error: 'no sticky bar' };
      const list = [...bar.querySelectorAll('button, a, salla-apple-pay, [class*="apple"], [class*="mini-checkout"], salla-quick-buy, salla-add-product-button')];
      const items = list.map(e => {
        const r = e.getBoundingClientRect(); const c = getComputedStyle(e);
        let covered = '';
        if (r.width && r.height) {
          const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
          covered = hit && !e.contains(hit) && !hit.contains(e) ? 'COVERED by ' + hit.tagName.toLowerCase() + '.' + [...hit.classList].slice(0, 3).join('.') : '';
        }
        return `${e.tagName.toLowerCase()}.${[...e.classList].slice(0, 4).join('.')} "${(e.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 25)}" ${Math.round(r.width)}x${Math.round(r.height)} disp=${c.display} vis=${c.visibility} op=${c.opacity} bg=${c.backgroundColor} col=${c.color} ${covered}`;
      });
      bar.scrollIntoView({ block: 'center' });
      return { barHTML: bar.outerHTML.replace(/\s+/g, ' ').replace(/<svg.*?<\/svg>/g, '<svg/>').slice(0, 1800), items };
    });
    console.log('=====', mode);
    console.log(JSON.stringify(info, null, 1).slice(0, 5000));
    const bar = await p.$('.sticky-product-bar');
    if (bar) { await bar.scrollIntoViewIfNeeded(); await p.waitForTimeout(300); await bar.screenshot({ path: `${out}-${mode}.png` }); }
    await p.close();
  }
  await b.close();
})();
