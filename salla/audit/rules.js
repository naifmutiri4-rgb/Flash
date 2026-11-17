// يطلع القواعد اللي تحدد خاصية معينة لعنصر (عشان نعرف ليش CSS ما انطبق)
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [url, css, sel, prop] = process.argv.slice(2);
  const txt = fs.readFileSync(css, 'utf8');
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  await p.addInitScript(t => { const put = () => { if (document.head && !document.getElementById('fx-qa')) { const s = document.createElement('style'); s.id = 'fx-qa'; s.textContent = t; document.head.appendChild(s); return true; } }; if (!put()) new MutationObserver((m, o) => { if (put()) o.disconnect(); }).observe(document, { childList: true, subtree: true }); }, txt);
  await p.goto(url, { waitUntil: 'networkidle', timeout: 90000 }); await p.waitForTimeout(1200);
  console.log('chain:', await p.evaluate(sel => { let e = document.querySelector(sel); const o = []; for (let i = 0; i < 5 && e; i++) { o.push(e.tagName.toLowerCase() + '.' + [...e.classList].join('.')); e = e.parentElement; } return o.join(' < '); }, sel));
  const c = await p.context().newCDPSession(p);
  await c.send('DOM.enable'); await c.send('CSS.enable');
  const { root } = await c.send('DOM.getDocument', { depth: -1, pierce: true });
  const { nodeId } = await c.send('DOM.querySelector', { nodeId: root.nodeId, selector: sel });
  const m = await c.send('CSS.getMatchedStylesForNode', { nodeId });
  for (const r of m.matchedCSSRules) { const ps = r.rule.style.cssProperties.filter(x => x.name === prop && x.value); if (ps.length) console.log(r.rule.origin, r.rule.selectorList.text.slice(0, 140), '|', ps.map(x => x.value + (x.important ? ' !' : '')).join(',')); }
  if (m.inlineStyle) console.log('inline:', m.inlineStyle.cssProperties.filter(x => x.name === prop).map(x => x.value).join(','));
  await b.close();
})();
