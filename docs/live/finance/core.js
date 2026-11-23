/* بيانات تجريبية مشتركة — ليست أرقام المتجر الحقيقية */
(function(){
const P=[
 {id:"saver",name:"بكج التوفير",price:9.99,cost:0.9,color:"#00E5D4"},
 {id:"saverp",name:"بكج التوفير المطور",price:17.99,cost:1.7,color:"#7C5CFF"},
 {id:"inter",name:"بكج التفاعل",price:29.99,cost:2.6,color:"#FF7AA6"},
 {id:"gold",name:"بكج الذهبي",price:39.99,cost:3.5,color:"#FFC94D"},
 {id:"explore",name:"بكج اكسبلور",price:54.99,cost:5.1,color:"#3EA8FF"},
 {id:"top",name:"بكج فلاش للقمة",price:34.99,cost:14,color:"#FF3D7F"}
];
const AD=57.5, BUDGET=5000, FIXED=477;
const fee=s=>s.orders*1.15+s.sales*0.01*1.15;
let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
const weights={saver:.42,saverp:.22,inter:.14,gold:.09,explore:.06,top:.07};
const days=[];
for(let d=1;d<=31;d++){
  const trend=8+d*0.45, wk=new Date(2027,0,d).getDay(), boost=(wk===4||wk===5)?1.25:1;
  const total=Math.round((trend+rnd()*7)*boost);
  const counts={};let sales=0,cost=0;
  P.forEach(p=>{const c=Math.max(0,Math.round(total*weights[p.id]*(0.7+rnd()*0.6)));counts[p.id]=c;sales+=c*p.price;cost+=c*p.cost});
  const orders=Object.values(counts).reduce((a,b)=>a+b,0);
  const f=fee({orders,sales}); const net=sales-cost-f-AD;
  days.push({day:d,date:new Date(2027,0,d),counts,orders,sales,cost,fees:f,ad:AD,net});
}
const sum=k=>days.reduce((a,x)=>a+x[k],0);
const per=P.map(p=>{const q=days.reduce((a,x)=>a+x.counts[p.id],0);const s=q*p.price,c=q*p.cost,f=q*1.15+s*0.0115;
  return {...p,qty:q,sales:s,costT:c,feesT:f,net:s-c-f,margin:(p.price-p.cost-(1.15+p.price*0.0115))/p.price}}).sort((a,b)=>b.net-a.net);
const T={orders:sum("orders"),sales:sum("sales"),cost:sum("cost"),fees:sum("fees"),ad:sum("ad")};
T.net=T.sales-T.cost-T.fees-T.ad-FIXED; T.roas=T.sales/T.ad; T.margin=T.net/T.sales; T.budgetLeft=BUDGET-T.ad; T.budgetUsed=T.ad/BUDGET;
const fmt=(v,d=0)=>Number(v).toLocaleString("en-US",{minimumFractionDigits:d,maximumFractionDigits:d});
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
function countUp(el,to,d=0,dur=1.4,prefix="",suffix=""){
  if(reduce||!window.gsap){el.textContent=prefix+fmt(to,d)+suffix;return}
  const o={v:0};gsap.to(o,{v:to,duration:dur,ease:"power3.out",onUpdate:()=>el.textContent=prefix+fmt(o.v,d)+suffix});
}
function lock(root,onOpen){
  const dots=root.querySelectorAll(".dots i");let pin="";
  const set=()=>dots.forEach((d,i)=>d.classList.toggle("on",i<pin.length));
  root.querySelectorAll(".pad button").forEach(b=>b.addEventListener("click",()=>{
    const k=b.dataset.k; if(k==="del"){pin=pin.slice(0,-1);set();return}
    if(pin.length>=4)return; pin+=k; set();
    if(navigator.vibrate)navigator.vibrate(8);
    if(pin.length===4){setTimeout(()=>{
      if(reduce||!window.gsap){root.remove();onOpen();return}
      gsap.to(root,{opacity:0,scale:1.08,filter:"blur(12px)",duration:.6,ease:"power2.in",onComplete:()=>{root.remove();onOpen()}});
    },180)}
  }));
}
const padHTML=`<div class="dots"><i></i><i></i><i></i><i></i></div>
<div class="pad">${[1,2,3,4,5,6,7,8,9].map(n=>`<button data-k="${n}" aria-label="${n}">${n}</button>`).join("")}<span></span><button data-k="0" aria-label="0">0</button><button data-k="del" aria-label="حذف">⌫</button></div>
<div class="hint">للتجربة: اكتب أي 4 أرقام</div>`;
window.FIN={P,days,per,T,AD,BUDGET,FIXED,fmt,countUp,lock,padHTML,reduce,monthAr:"يناير 2027"};
})();
