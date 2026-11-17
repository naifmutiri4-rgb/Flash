// يختبر وش يقبل قسم «محتوى HTML» في سلة: نبدّل كود أول قسم HTML في الرئيسية الحقيقية بكود تجريبي
// ونشوف هل <style> و@keyframes وscript تشتغل بعد ما يرسمه مكوّن salla-custom-component.
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
(async () => {
  const url = 'https://flashstore-ksa.com/';
  const [codeFile, out, w] = process.argv.slice(2);
  const code = fs.readFileSync(codeFile, 'utf8');
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: +w || 390, height: 900 } });
  await p.route(r => r.href === url, async route => {
    let html = fs.readFileSync(process.env.RAW, 'utf8');
    let done = false;
    html = html.replace(/(?<=component-name="html-content"[^>]*?)config="([^"]*)"/, (m, c) => {
      if (done) return m; done = true;
      const dec = c.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
      const obj = JSON.parse(dec); obj.code = code;
      const enc = JSON.stringify(obj).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `config="${enc}"`;
    });
    await route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html });
  });
  await p.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
  await p.waitForTimeout(2000);
  const r = await p.evaluate(() => {
    const deep = (root) => { const f = root.querySelector('#fx-probe'); if (f) return f; for (const el of root.querySelectorAll('*')) if (el.shadowRoot) { const g = deep(el.shadowRoot); if (g) return g; } return null; };
    const t = deep(document);
    window.__html = [...document.querySelectorAll('salla-custom-component')].map(e => (e.shadowRoot ? 'SHADOW:' : '') + e.innerHTML.slice(0, 120)).join(' || ');
    if (!t) return { found: false, html: window.__html };
    const cs = getComputedStyle(t);
    return { found: true, color: cs.color, anim: cs.animationName, styleTags: t.closest('section')?.querySelectorAll('style').length, scriptRan: !!window.__fxScript, shadow: !!t.getRootNode().host };
  });
  console.log(JSON.stringify(r));
  if (out) await p.screenshot({ path: out });
  await b.close();
})();
