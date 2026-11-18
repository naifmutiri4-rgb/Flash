const { chromium } = require('playwright'); const fs=require('fs');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport:{width:390,height:844}});
 await p.route(u => /themes\/customization\/.*\.css/.test(u.href), r => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
 await p.goto(process.argv[2],{waitUntil:'networkidle',timeout:90000}); await p.addStyleTag({content:fs.readFileSync('live.css','utf8')}); await p.waitForTimeout(500);
 console.log(await p.evaluate(()=>{const g=document.querySelector('.s-product-options-grid-mode'); const c=getComputedStyle(g,'::before'); const li=document.querySelector('article.full-description li'); const cl=getComputedStyle(li);
 return ['content '+c.content,'h '+c.height,'bg '+c.backgroundImage.slice(0,140),'mask '+c.webkitMaskImage.slice(0,100),'disp '+c.display, 'li bg '+cl.backgroundColor+' pad '+cl.padding].join('\n');}));
 await b.close(); })();
