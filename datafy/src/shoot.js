// usage: node shoot.js page.html outdir sel1:name1 sel2:name2 ...   (use "ALL" to shoot every [data-shot])
const {chromium}=require('playwright');const path=require('path');
(async()=>{const [,,page,out,...shots]=process.argv;
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:2000,height:1200},deviceScaleFactor:1});
 await p.goto('file://'+path.resolve(page));await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(600);
 let list=shots;
 if(shots[0]==='ALL') list=await p.$$eval('[data-shot]',els=>els.map(e=>'[data-shot="'+e.dataset.shot+'"]:'+e.dataset.shot));
 for(const s of list){const i=s.lastIndexOf(':');const sel=s.slice(0,i),name=s.slice(i+1);
   const el=await p.$(sel);await el.screenshot({path:path.join(out,name+'.png'),omitBackground:true});}
 console.log('shot',list.length);await b.close();})();
