const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport:{width:390,height:844}});
 await p.goto(process.argv[2],{waitUntil:'networkidle',timeout:90000}); await p.waitForTimeout(1500);
 const r = await p.evaluate(()=>{
  const mc=document.querySelector('.product-single .main-content')||document.querySelector('.main-content');
  const kids=[...mc.children].map(e=>e.tagName.toLowerCase()+'.'+[...e.classList].join('.')+'#'+e.id);
  const form=mc.querySelector('form'); const fk=form?[...form.children].map(e=>e.tagName.toLowerCase()+'.'+[...e.classList].join('.')+'#'+e.id):[];
  const opt=document.querySelector('.s-product-options-option-container'); 
  const bar=document.querySelector('.sticky-product-bar');
  const side=document.querySelector('.product-single .sidebar, .sidebar');
  const links=[...document.querySelectorAll('link[rel=stylesheet]')].map(l=>l.href).filter(h=>/custom|theme/i.test(h));
  return {cls:document.body.className, kids, fk, opt: opt&&opt.outerHTML.replace(/\s+/g,' ').slice(0,1800), bar: bar&&bar.outerHTML.replace(/\s+/g,' ').replace(/<svg.*?<\/svg>/g,'<svg/>').slice(0,1600), side: side&&(side.className+' > '+[...side.children].map(e=>e.tagName+'.'+e.className).join(' | ')).slice(0,400), links, desc: (document.querySelector('article.full-description')||{}).className};
 });
 console.log(JSON.stringify(r,null,1)); await b.close(); })();
