// أيقونات مميزات صفحة الهبوط (96×96 PNG): مربع داكن وأيقونة سماوية، بنفس ستايل «بث مباشر»
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', '..', 'docs', 'live', 'landing'); fs.mkdirSync(OUT, { recursive: true });
const P = {
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" fill="#00E5D4" stroke="#00E5D4"/>',
  shield: '<path d="M12 2 4 5v6c0 5 3.4 9.3 8 11 4.6-1.7 8-6 8-11V5l-8-3Z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
  lock: '<rect x="4" y="10" width="16" height="11" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  chat: '<path d="M4 5h16v11H9l-5 4V5Z"/><path d="M8 9.5h8M8 12.5h5"/>',
};
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 96, height: 96 }, deviceScaleFactor: 1 });
  for (const [k, d] of Object.entries(P)) {
    await p.setContent(`<body style="margin:0;background:transparent"><div style="width:96px;height:96px;border-radius:26px;background:#16142A;border:2px solid #2A2550;box-sizing:border-box;display:grid;place-items:center"><svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#00E5D4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg></div></body>`);
    await p.locator('div').screenshot({ path: path.join(OUT, `ic-${k}.png`), omitBackground: true });
  }
  await b.close(); console.log('icons ok');
})();
