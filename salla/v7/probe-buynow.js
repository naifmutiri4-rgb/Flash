// يفحص زر «اشتر الآن» (salla-mini-checkout-widget): هل له Shadow DOM مفتوح، وش العناصر والـ part والمتغيرات اللي يستخدمها
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  await p.goto('https://flashstore-ksa.com/بكج-التفاعل/p1246605374', { waitUntil: 'networkidle', timeout: 90000 });
  await p.waitForTimeout(1500);
  console.log(await p.evaluate(() => {
    const w = document.querySelector('salla-mini-checkout-widget');
    if (!w) return 'no widget';
    const o = ['host attrs: ' + [...w.attributes].map(a => a.name + '=' + a.value.slice(0, 40)).join(' '), 'host style: ' + (w.getAttribute('style') || ''), 'shadow: ' + (w.shadowRoot ? 'open' : 'none/closed'), 'light html: ' + w.innerHTML.replace(/\s+/g, ' ').slice(0, 600)];
    const walk = (root, depth) => {
      if (!root || depth > 3) return;
      o.push(`--- shadow depth ${depth}: ` + root.innerHTML.replace(/\s+/g, ' ').replace(/<svg.*?<\/svg>/g, '<svg/>').slice(0, 1400));
      const styles = [...root.querySelectorAll('style')].map(s => s.textContent).join('\n');
      const vars = [...new Set((styles.match(/var\(--[\w-]+/g) || []))].slice(0, 40);
      o.push('vars: ' + vars.join(' '));
      o.push('parts: ' + [...root.querySelectorAll('[part]')].map(e => e.getAttribute('part')).join(' '));
      root.querySelectorAll('*').forEach(e => { if (e.shadowRoot) walk(e.shadowRoot, depth + 1); });
    };
    walk(w.shadowRoot, 1);
    const btn = w.shadowRoot && w.shadowRoot.querySelector('button');
    if (btn) { const c = getComputedStyle(btn); o.push('btn: color=' + c.color + ' bg=' + c.backgroundColor + ' border=' + c.borderColor + ' radius=' + c.borderRadius + ' h=' + c.height); }
    return o.join('\n');
  }));
  await b.close();
})();
