<script>
(function(){
"use strict";
/* ===================== constants & defaults ===================== */
const SALLA="Salla MCP", TIKTOK="TikTok for Business", SYNC_V=2;
const EXCLUDED=new Set(["canceled","cancelled","restored","restoring","payment_pending","deleted","refunded"]);
const DEF_CONFIG={fees:{fixed:1,pct:0.01,vat:0.15},rates:{views:0.026,likes:2.66,shares:0.32,saves:0.054},
  adBudget:{total:5000,daily:57.5,start:"2027-01-01",end:"2027-03-31"},tiktokAdvertiser:"",unknownCostPct:0};
const DEF_GOALS={monthlySales:50000,deadline:"2027-12",margin:0.20,roasUp:3,roasHold:2,stepUp:0.2};
const CATS=[["ads","إعلانات أخرى"],["subs","اشتراكات وأدوات"],["content","تصميم ومحتوى"],["refund","تعويضات واسترجاع"],["bank","رسوم بنكية"],["other","أخرى"]];
const CATMAP=Object.fromEntries(CATS);
const DAYS_AR=["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
const MONTHS_AR=["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
const ROUTES=[
 ["home","الرئيسية","home","نظرة عامة"],["summary","الملخص المالي","pie",""],
 ["revenue","المبيعات","trend","البيع"],["orders","الطلبات","receipt",""],["products","المنتجات والموردين","box",""],
 ["ads","الإعلانات","mega","الصرف"],["expenses","المصاريف والاشتراكات","wallet",""],
 ["pnl","الأرباح والخسائر","scale","التحليل"],["reports","التحليلات والعملاء","bars",""],["goals","الأهداف","target",""],
 ["prefs","الإعدادات","gear","النظام"]];
const ICONS={
 receipt:'<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
 bars:'<path d="M4 20h16"/><rect x="5" y="11" width="3" height="7" rx="1"/><rect x="10.5" y="6" width="3" height="12" rx="1"/><rect x="16" y="9" width="3" height="9" rx="1"/>',
 home:'<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
 pie:'<path d="M12 3v9h9"/><circle cx="12" cy="12" r="9"/>',
 trend:'<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
 wallet:'<rect x="3" y="6" width="18" height="14" rx="3"/><path d="M16 13h2"/><path d="M3 10h18"/>',
 box:'<path d="M3 7l9-4 9 4-9 4z"/><path d="M3 7v10l9 4 9-4V7"/><path d="M12 11v10"/>',
 mega:'<path d="M3 11v2a2 2 0 002 2h2l6 4V5L7 9H5a2 2 0 00-2 2z"/><path d="M17 8a5 5 0 010 8"/>',
 cart:'<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M3 4h2l2.5 11h11L21 7H7"/>',
 scale:'<path d="M12 3v18"/><path d="M5 7h14"/><path d="M5 7l-3 7h6z"/><path d="M19 7l-3 7h6z"/>',
 doc:'<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h6"/>',
 target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
 gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/>',
 sync:'<path d="M21 12a9 9 0 01-15.5 6.3L3 16"/><path d="M3 12a9 9 0 0115.5-6.3L21 8"/><path d="M21 3v5h-5M3 21v-5h5"/>',
 plus:'<path d="M12 5v14M5 12h14"/>', edit:'<path d="M4 20h4l11-11-4-4L4 16z"/>', trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
 xls:'<path d="M6 3h9l4 4v14H6z"/><path d="M9 11l5 6M14 11l-5 6"/>', pdf:'<path d="M6 3h9l4 4v14H6z"/><path d="M9 15h6"/>', save:'<path d="M5 3h11l3 3v15H5z"/><path d="M8 3v6h8"/><path d="M8 21v-7h8v7"/>',
 up:'<path d="M12 19V5M6 11l6-6 6 6"/>',
 dollar:'<path d="M12 2v20"/><path d="M17 6H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>', bag:'<path d="M6 7h12l1 13H5z"/><path d="M9 7a3 3 0 016 0"/>',
 percent:'<path d="M19 5L5 19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>', eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
 click:'<path d="M9 9l11 4-5 2-2 5z"/><path d="M5 3v3M3 5h3M5.5 9.5L3.5 11.5"/>', arUp:'<path d="M7 17L17 7"/><path d="M8 7h9v9"/>', arDn:'<path d="M7 7l10 10"/><path d="M17 8v9H8"/>', cal:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/>', chev:'<path d="M15 6l-6 6 6 6"/>', menu:'<path d="M4 7h16M4 12h16M4 17h16"/>'
};
const ic=(n)=>`<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]||""}</svg>`;

/* ===================== state ===================== */
const S={dbState:"pending",db:null,mcp:null,dl:null,user:null,canWrite:true,
  config:null,products:null,expenses:[],supplier:[],feesDays:{},recurring:[],forecasts:[],goals:null,salla:{},ads:{},sync:{},
  loaded:new Set(),route:"home",period:"month",custom:{from:"",to:""},animate:true,ordersPage:1,ordersQ:"",
  syncing:{salla:false,tiktok:false},connErr:{salla:null,tiktok:null},editExp:null};

/* ===================== utils ===================== */
const $=(s,r=document)=>r.querySelector(s);
const esc=(v)=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt=(v,d=0)=>(isFinite(v)?Number(v):0).toLocaleString("en-US",{minimumFractionDigits:d,maximumFractionDigits:d});
const money=(v,d=0)=>`<span class="n">${fmt(v,d)}</span>`;
const pct=(v,d=0)=>isFinite(v)?`<span class="n">${fmt(v*100,d)}%</span>`:"—";
const riyadhToday=()=>new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Riyadh"}).format(new Date());
const toD=(s)=>{const [y,m,d]=s.split("-").map(Number);return new Date(Date.UTC(y,m-1,d))};
const fromD=(d)=>d.toISOString().slice(0,10);
const addDays=(s,n)=>{const d=toD(s);d.setUTCDate(d.getUTCDate()+n);return fromD(d)};
const diffDays=(a,b)=>Math.round((toD(b)-toD(a))/864e5);
const monthStart=(s)=>s.slice(0,8)+"01";
const monthEnd=(s)=>{const d=toD(monthStart(s));d.setUTCMonth(d.getUTCMonth()+1);d.setUTCDate(0);return fromD(d)};
const addMonths=(s,n)=>{const d=toD(monthStart(s));d.setUTCMonth(d.getUTCMonth()+n);return fromD(d)};
const dim=(s)=>Number(monthEnd(s).slice(8));
const eachDay=(a,b)=>{const out=[];for(let s=a;s<=b;s=addDays(s,1))out.push(s);return out};
const mLabel=(s)=>MONTHS_AR[Number(s.slice(5,7))-1]+" "+s.slice(0,4);
const dLabel=(s)=>`${Number(s.slice(8))} ${MONTHS_AR[Number(s.slice(5,7))-1]}`;
const ls={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,8);
const ago=(iso)=>{if(!iso)return "لم تتم";const m=Math.round((Date.now()-new Date(iso).getTime())/6e4);if(m<1)return "الآن";if(m<60)return `قبل ${m} د`;const h=Math.round(m/60);if(h<48)return `قبل ${h} س`;return `قبل ${Math.round(h/24)} يوم`};
let toastT;function toast(msg,kind="ok"){const t=$("#toast");t.textContent=msg;t.className="toast on "+kind;clearTimeout(toastT);toastT=setTimeout(()=>t.className="toast "+kind,3200)}
function cfg(){const c=S.config||{};return{...DEF_CONFIG,...c,fees:{...DEF_CONFIG.fees,...(c.fees||{})},rates:{...DEF_CONFIG.rates,...(c.rates||{})},adBudget:{...DEF_CONFIG.adBudget,...(c.adBudget||{})}}}
function goals(){const g={...DEF_GOALS,...(S.goals||{})};if(g.plan&&g.plan.useAsGoal){try{const e=planExpected();if(isFinite(e.rev)&&e.rev>0)g.monthlySales=Math.round(e.rev)}catch(x){}}return g}

/* ===================== periods ===================== */
function range(key=S.period){
  const t=riyadhToday();
  if(key==="today")return{from:t,to:t,label:"اليوم"};
  if(key==="7d")return{from:addDays(t,-6),to:t,label:"آخر 7 أيام"};
  if(key==="30d")return{from:addDays(t,-29),to:t,label:"آخر 30 يوم"};
  if(key==="prev"){const s=addMonths(t,-1);return{from:s,to:monthEnd(s),label:mLabel(s)}}
  if(key==="custom"&&S.custom.from&&S.custom.to&&S.custom.from<=S.custom.to)return{from:S.custom.from,to:S.custom.to,label:"فترة مخصصة"};
  return{from:monthStart(t),to:t,label:mLabel(t)};
}
function prevRange(r){
  if(S.period==="month"){const s=addMonths(r.from,-1);const len=diffDays(r.from,r.to);const e=addDays(s,Math.min(len,dim(s)-1));return{from:s,to:e}}
  if(S.period==="prev"){const s=addMonths(r.from,-1);return{from:s,to:monthEnd(s)}}
  const len=diffDays(r.from,r.to)+1;return{from:addDays(r.from,-len),to:addDays(r.from,-1)};
}

/* ===================== finance engine ===================== */
function productsList(){return S.products||[]}
function findProduct(name){const n=String(name||"").trim();return productsList().find(p=>p.name===n||(p.aliases||[]).includes(n))}
function riyadhNowStr(){const f=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Riyadh",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:false}).formatToParts(new Date());const g=(t)=>(f.find(x=>x.type===t)||{}).value;return`${g("year")}-${g("month")}-${g("day")} ${g("hour")==='24'?'00':g("hour")}:${g("minute")}`}
function ratesAt(ts){const h=((S.config&&S.config.rateHistory)||[]).slice().sort((a,b)=>String(a.from).localeCompare(String(b.from)));let r=null;for(const e of h){if(String(e.from)<=ts)r=e.rates}return{...cfg().rates,...(r||(h[0]&&h[0].rates)||{})}}
function unitCost(p,rates){const r=rates||cfg().rates,c=p.contents||{};return (+(c.views||0))/1000*r.views+(+(c.likes||0))/1000*r.likes+(+(c.shares||0))/1000*r.shares+(+(c.saves||0))/1000*r.saves+(+(p.extraCost||0))}
function feeOf(amount){const f=cfg().fees;return (f.fixed+amount*f.pct)*(1+f.vat)}
const DISC=[0,.05,.08,.1,.12,.15,.18,.2,.25,.3];
function tierCost(p,line,qty,rates){const tiers=p.tiers||[];if(!tiers.length||!p.service)return null;const unit=line/(qty||1);
  for(const dsc of DISC)for(const t of tiers){if(Math.abs(t.price*(1-dsc)-unit)<=0.011){const r=(rates||cfg().rates)[p.service]||0;return{cost:(+t.qty/1000)*r*(qty||1)+(+(p.extraCost||0))*(qty||1),qty:t.qty}}}return null}
const RULE_TYPES=[["views","مشاهدات"],["likes","لايكات"],["shares","شير"],["saves","حفظ"],["followers","متابعين"],["other","أخرى"]];
const RULE_NAME=Object.fromEntries(RULE_TYPES);
function rulesAt(p,ts){const h=(p.rulesHistory||[]).slice().sort((a,b)=>String(a.from).localeCompare(String(b.from)));let r=null;for(const e of h){if(String(e.from)<=ts)r=e.rules}return r||(h[0]&&h[0].rules)||(p.rules&&p.rules.length?p.rules:null)}
function rulesCost(rules,qtyOverride){return(rules||[]).reduce((a,r)=>a+(+(qtyOverride!=null?qtyOverride:r.qty)||0)/1000*(+r.rate_sar||0),0)}
function productUnitCost(p,ts){const rl=ts?rulesAt(p,ts):(p.rules&&p.rules.length?p.rules:null);if(rl&&rl.length)return rulesCost(rl)+(+(p.extraCost||0));return unitCost(p,ts?ratesAt(ts):null)}
function orderCost(o){const ck=o.id+"|"+o.day;if(COST_MEMO.has(ck))return COST_MEMO.get(ck);const v=orderCostRaw(o);COST_MEMO.set(ck,v);return v}
function orderCostRaw(o){
  const LK=S.links&&S.links[o.id];if(LK&&LK.charge_sar!=null&&isFinite(LK.charge_sar))return{cost:+LK.charge_sar,unknown:false,est:false,actual:true};
  const RT=ratesAt(o.day+" "+(o.t||"00:00"));const items=o.items&&o.items.length?o.items:[{name:"?",qty:1}];
  const ws=items.map(it=>{const p=findProduct(it.name);return ((p&&p.type==="pack"?p.price:(p&&p.refPrice))||10)*(it.qty||1)});
  const W=ws.reduce((a,b)=>a+b,0)||1;let cost=0,unknown=false,est=false;
  items.forEach((it,i)=>{const p=findProduct(it.name);const line=o.amount*ws[i]/W;
    const TS=o.day+" "+(o.t||"00:00");const RL=p?rulesAt(p,TS):null;
    if(p&&p.type==="pack")cost+=(RL&&RL.length?rulesCost(RL)+(+(p.extraCost||0)):unitCost(p,RT))*(it.qty||1);
    else if(p&&p.service&&S.oq[o.id]&&S.oq[o.id].items&&S.oq[o.id].items.find(x=>x.name===it.name&&+x.q>0)){const iq=S.oq[o.id].items.find(x=>x.name===it.name&&+x.q>0);cost+=(+iq.q/1000*(+RT[p.service]||0)+(+(p.extraCost||0)))*(it.qty||1)}
    else if(p){const tc=tierCost(p,line,it.qty||1,RT);if(tc&&RL&&RL.length)cost+=(rulesCost(RL,tc.qty)+(+(p.extraCost||0)))*(it.qty||1);else if(tc)cost+=tc.cost;else{const sc=singleCost(p,line/(it.qty||1),RT);if(sc)cost+=sc.cost*(it.qty||1);else cost+=line*(+p.costPct||0);est=true}}
    else{cost+=line*(cfg().unknownCostPct||0);unknown=true}});
  return{cost,unknown,est};
}
const isExcl=(id)=>((S.config&&S.config.excludedOrders)||[]).includes(String(id))||(S.om[id]&&S.om[id].cid&&((S.config&&S.config.excludedCustomers)||[]).includes(String(S.om[id].cid)));
function ordersIn(from,to){const out=[];for(const [day,doc] of Object.entries(S.salla)){if(day<from||day>to)continue;for(const o of Object.values(doc.orders||{})){if(!EXCLUDED.has(o.status)&&!o.unpaid&&!isExcl(o.id)){const m=S.om[o.id];out.push({...o,day,attr:m?{ch:m.ch||"unknown",camp:m.camp||"",cid:m.cid||""}:null})}}}return out.sort((a,b)=>(b.day+b.t).localeCompare(a.day+a.t))}
function recurringOn(day){let s=0;for(const r of S.recurring){if(r.active===false)continue;const m=day.slice(0,7);if(r.startMonth&&m<r.startMonth)continue;if(r.endMonth&&m>r.endMonth)continue;s+=(+r.amount||0)/dim(day)}return s}
let CALC_MEMO=new Map(),COST_MEMO=new Map();
function calc(from,to){const k=from+"|"+to;if(CALC_MEMO.has(k))return CALC_MEMO.get(k);const v=calcRaw(from,to);CALC_MEMO.set(k,v);return v}
function calcRaw(from,to){
  const days=eachDay(from,to),D={};days.forEach(d=>D[d]={rev:0,orders:0,cost:0,fees:0,ads:0,tt:0,exp:0,rec:0,net:0});
  const os=ordersIn(from,to);let unknownN=0,estN=0,ttRev=0,ttOrders=0,pendN=0;const byProd={},byCh={};
  for(const o of os){const d=D[o.day];if(!d)continue;const c=orderCost(o);d.rev+=o.amount;d.orders++;d.cost+=c.cost;d.fees+=feeOf(o.amount);if(c.unknown)unknownN++;if(c.est)estN++;const ch=o.attr?o.attr.ch:"pending";if(ch==="pending")pendN++;byCh[ch]=byCh[ch]||{orders:0,rev:0};byCh[ch].orders++;byCh[ch].rev+=o.amount;if(ch==="tiktok"){ttRev+=o.amount;ttOrders++}
    for(const it of (o.items||[])){const k=it.name;byProd[k]=byProd[k]||{name:k,qty:0,orders:0};byProd[k].qty+=it.qty||1;byProd[k].orders++}}
  for(const d0 of days){const fd=S.feesDays[d0];if(fd&&D[d0].orders&&+fd.orders===D[d0].orders){D[d0].fees=(+fd.fee||0)*(1+cfg().fees.vat);D[d0].feeActual=true}}
  let imp=0,clk=0,pur=0,pv=0;
  for(const [day,a] of Object.entries(S.ads)){if(D[day]){D[day].tt+=+a.spend||0;imp+=+a.impressions||0;clk+=+a.clicks||0;pur+=+a.purchases||0;pv+=+a.purchaseValue||0}}
  let adsManual=0,expOther=0;const byCat={};
  for(const e of S.expenses){if(!D[e.date])continue;const v=+e.amount||0;if(e.category==="ads"){D[e.date].ads+=v;adsManual+=v}else{D[e.date].exp+=v;expOther+=v}byCat[e.category]=(byCat[e.category]||0)+v}
  let rec=0;days.forEach(d=>{const r=recurringOn(d);D[d].rec=r;rec+=r});
  const T={rev:0,orders:0,cost:0,fees:0,tt:0,ads:0,exp:0,rec:0};
  days.forEach(d=>{const x=D[d];x.ads+=x.tt;x.net=x.rev-x.cost-x.fees-x.ads-x.exp-x.rec;for(const k in T)T[k]+=x[k]});
  T.adsAll=T.ads;T.other=T.exp+T.rec;T.expenses=T.cost+T.fees+T.adsAll+T.other;T.net=T.rev-T.expenses;T.margin=T.rev?T.net/T.rev:NaN;
  T.aov=T.orders?T.rev/T.orders:0;T.cpa=T.orders?T.adsAll/T.orders:NaN;T.roas=T.adsAll?T.rev/T.adsAll:NaN;
  const contrib=T.orders?(T.rev-T.cost-T.fees)/T.orders:0;const nd=days.length;
  T.breakEven=contrib>0?((T.adsAll+T.other)/nd)/contrib:NaN;T.perDayOrders=T.orders/nd;
  T.imp=imp;T.clk=clk;T.pur=pur;T.ctr=imp?clk/imp:NaN;T.cpm=imp?T.tt/imp*1000:NaN;T.adsManual=adsManual;T.expOther=expOther;T.recurring=rec;T.ttRev=ttRev;T.ttOrders=ttOrders;T.pendN=pendN;T.pv=pv;T.ttRoas=T.tt?ttRev/T.tt:NaN;T.pxRoas=T.tt?pv/T.tt:NaN;T.ttCpa=ttOrders?T.tt/ttOrders:NaN;
  return{from,to,days,D,T,orders:os,byProd,byCat,byCh,unknownN,estN};
}
const delta=(a,b,inverse=false)=>{if(!isFinite(a)||!isFinite(b)||b===0)return`<span class="delta eq">—</span>`;const c=(a-b)/Math.abs(b);const up=c>=0;const good=inverse?!up:up;return`<span class="delta ${Math.abs(c)<.005?"eq":good?"up":"dn"}">${ic(up?"arUp":"arDn")}<span class="n">${fmt(Math.abs(c)*100,0)}%</span></span>`};

/* ===================== charts ===================== */
function lineChart({series,labels,h=220,fmtY=(v)=>fmt(v)}){
  const W=640,P={l:44,r:12,t:14,b:26},w=W-P.l-P.r,hh=h-P.t-P.b;const all=series.flatMap(s=>s.vals.filter(v=>v!=null));
  let mn=Math.min(0,...all),mx=Math.max(1,...all);if(mx===mn)mx=mn+1;const pad=(mx-mn)*.08;mx+=pad;if(mn<0)mn-=pad;
  const n=labels.length,x=i=>P.l+(n<=1?w/2:i*w/(n-1)),y=v=>P.t+hh-(v-mn)/(mx-mn)*hh;
  let g="";for(let k=0;k<=4;k++){const v=mn+(mx-mn)*k/4,yy=y(v);g+=`<line class="gl" x1="${P.l}" x2="${W-P.r}" y1="${yy}" y2="${yy}"/><text x="${P.l-6}" y="${yy+3}" text-anchor="end">${esc(fmtY(v))}</text>`}
  if(mn<0)g+=`<line x1="${P.l}" x2="${W-P.r}" y1="${y(0)}" y2="${y(0)}" style="stroke:rgba(var(--hi-rgb),.25)" stroke-dasharray="3 3"/>`;
  const step=Math.max(1,Math.ceil(n/6));labels.forEach((l,i)=>{if((i%step===0&&i<=n-1-Math.ceil(step/2))||i===n-1)g+=`<text x="${x(i)}" y="${h-8}" text-anchor="${n>1&&i===0?"start":n>1&&i===n-1?"end":"middle"}">${esc(l)}</text>`});
  let body="";series.forEach((s,si)=>{const pts=s.vals.map((v,i)=>v==null?null:[x(i),y(v)]).filter(Boolean);if(!pts.length)return;
    let len=0;for(let i=1;i<pts.length;i++)len+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);len=Math.ceil(len)+2;
    const d=pts.map((p,i)=>(i?"L":"M")+p[0].toFixed(1)+","+p[1].toFixed(1)).join("");
    if(s.area&&pts.length>1){const id="ga"+si+Math.random().toString(36).slice(2,6);body+=`<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s.color}" stop-opacity=".32"/><stop offset="1" stop-color="${s.color}" stop-opacity="0"/></linearGradient></defs><path class="ar" d="${d}L${pts[pts.length-1][0]},${y(Math.max(mn,0))}L${pts[0][0]},${y(Math.max(mn,0))}Z" fill="url(#${id})"/>`}
    body+=s.dashed?`<path class="fc" d="${d}" stroke="${s.color}"/>`:`<path class="ln" style="--len:${len}" d="${d}" stroke="${s.color}"/>`;
    const lp=pts[pts.length-1];body+=`<circle cx="${lp[0]}" cy="${lp[1]}" r="3.5" fill="${s.color}"/>`});
  const tipData=esc(JSON.stringify({l:labels,W,pl:P.l,pr:P.r,s:series.map(s=>({n:s.name||"",c:s.color,v:s.vals.map(x=>x==null?null:Math.round(x*100)/100)}))}));
  return`<div class="chartbox" data-tip="${tipData}"><svg class="chart" viewBox="0 0 ${W} ${h}" style="direction:ltr" role="img">${g}${body}</svg><i class="guide"></i><div class="ctip" hidden></div></div>`;
}
function onChartMove(e){const box=e.target.closest&&e.target.closest(".chartbox");document.querySelectorAll(".chartbox.on").forEach(b=>{if(b!==box){b.classList.remove("on");b.querySelector(".ctip").hidden=true}});if(!box)return;
  let D;try{D=JSON.parse(box.dataset.tip)}catch(x){return}const svg=box.querySelector("svg"),r=svg.getBoundingClientRect();const n=D.l.length;if(n<1)return;
  const xv=(e.clientX-r.left)/r.width*D.W,w=D.W-D.pl-D.pr;let i=n<=1?0:Math.round((xv-D.pl)/w*(n-1));i=Math.max(0,Math.min(n-1,i));
  const px=(D.pl+(n<=1?w/2:i*w/(n-1)))/D.W*r.width;const tip=box.querySelector(".ctip"),gd=box.querySelector(".guide");
  tip.innerHTML=`<b>${esc(D.l[i])}</b>`+D.s.map(s=>s.v[i]==null?"":`<div><i style="background:${esc(s.c)}"></i>${esc(s.n)} <span class="n">${fmt(s.v[i],2)}</span></div>`).join("");
  tip.hidden=false;box.classList.add("on");gd.style.left=px+"px";const tw=tip.offsetWidth;let left=px+12;if(left+tw>r.width)left=px-tw-12;tip.style.left=Math.max(0,left)+"px"}
document.addEventListener("pointermove",onChartMove,{passive:true});document.addEventListener("pointerdown",onChartMove,{passive:true});
function barChart({vals,labels,h=200,colors,fmtY=(v)=>fmt(v)}){
  const W=640,P={l:44,r:10,t:12,b:26},w=W-P.l-P.r,hh=h-P.t-P.b;let mn=Math.min(0,...vals),mx=Math.max(1,...vals);if(mx===mn)mx=mn+1;
  const n=vals.length,bw=Math.max(3,w/n*.62),x=i=>P.l+(i+.5)*w/n,y=v=>P.t+hh-(v-mn)/(mx-mn)*hh;let g="";
  for(let k=0;k<=4;k++){const v=mn+(mx-mn)*k/4,yy=y(v);g+=`<line class="gl" x1="${P.l}" x2="${W-P.r}" y1="${yy}" y2="${yy}"/><text x="${P.l-6}" y="${yy+3}" text-anchor="end">${esc(fmtY(v))}</text>`}
  const step=Math.max(1,Math.ceil(n/8));labels.forEach((l,i)=>{if(i%step===0||i===n-1)g+=`<text x="${x(i)}" y="${h-8}" text-anchor="middle">${esc(l)}</text>`});
  let b="";vals.forEach((v,i)=>{const y0=y(Math.max(0,mn)),yv=y(v),top=Math.min(y0,yv),hgt=Math.max(1,Math.abs(y0-yv));const c=typeof colors==="function"?colors(v,i):(colors||"#00E5D4");
    b+=`<rect class="bx" style="animation-delay:${Math.min(i*18,500)}ms" x="${(x(i)-bw/2).toFixed(1)}" y="${top.toFixed(1)}" width="${bw.toFixed(1)}" height="${hgt.toFixed(1)}" rx="${Math.min(4,bw/3)}" fill="${c}"><title>${esc(labels[i])}: ${esc(fmt(v,2))}</title></rect>`});
  return`<svg class="chart" viewBox="0 0 ${W} ${h}" style="direction:ltr" role="img">${g}${b}</svg>`;
}
function ring(p,label,sub){const C=2*Math.PI*50,v=Math.max(0,Math.min(1,isFinite(p)?p:0));
  return`<svg class="ring" viewBox="0 0 120 120"><defs><linearGradient id="rg" x1="0" x2="1"><stop offset="0" stop-color="#00E5D4"/><stop offset="1" stop-color="#FF3D7F"/></linearGradient></defs><circle cx="60" cy="60" r="50" fill="none" style="stroke:rgba(var(--hi-rgb),.07)" stroke-width="11"/><circle class="rv" cx="60" cy="60" r="50" fill="none" stroke="url(#rg)" stroke-width="11" stroke-linecap="round" transform="rotate(-90 60 60)" stroke-dasharray="${C}" stroke-dashoffset="${S.animate?C:C*(1-v)}" data-off="${C*(1-v)}"/><text x="60" y="62" text-anchor="middle" style="fill:var(--light)" font-size="21" font-weight="800" font-family="FlashTajawal, Tajawal">${esc(label)}</text><text x="60" y="80" text-anchor="middle" style="fill:var(--mut-2)" font-size="9.5" font-family="FlashTajawal, Tajawal">${esc(sub||"")}</text></svg>`}

/* ===================== building blocks ===================== */
const KPI_IC=[[/ROAS|العائد/,"trend",["#00E5D4","#3EA8FF"]],[/CPA|تكلفة الطلب/,"receipt",["#FF3D7F","#FF7AA6"]],[/CPM|ظهور|الظهور/,"eye",["#00E5D4","#7C6BFF"]],[/الضغطات|CTR/,"click",["#3EA8FF","#00E5D4"]],
 [/صافي|الربح/,"scale",["#FF3D7F","#7C6BFF"]],[/هامش/,"percent",["#00E5D4","#FF3D7F"]],[/رسوم/,"percent",["#C2BEDD","#7C6BFF"]],[/صرف|الإنفاق|إعلان/,"mega",["#FF3D7F","#FF7AA6"]],
 [/قيمة السلة|قيمة الطلب/,"cart",["#7C6BFF","#00E5D4"]],[/متوسط|يومي|يوميًا/,"cal",["#7C6BFF","#00E5D4"]],[/إيراد|مبيعات|المبيعات/,"dollar",["#00E5D4","#3EA8FF"]],[/عدد الطلبات|الطلبات|المشتريات|طلب/,"receipt",["#7C6BFF","#FF3D7F"]],
 [/تكلفة|المنتجات|المورد/,"box",["#3EA8FF","#7C6BFF"]],[/مصروف|اشتراك/,"wallet",["#FF7AA6","#7C6BFF"]],[/هدف/,"target",["#00E5D4","#FF3D7F"]]];
const kpiIcon=(l)=>{const m=KPI_IC.find(x=>x[0].test(l))||[0,"pie",["#00E5D4","#FF3D7F"]];return`<span class="kic" style="--g1:${m[2][0]};--g2:${m[2][1]}">${ic(m[1])}</span>`};
const kpi=(l,v,{d="",cls="",unit="ر.س",dec=0,dot="",count=true,raw=false}={})=>`<div class="card kpi hov ${cls}">${kpiIcon(l)}<div class="l">${dot?`<i class="dot" style="background:${dot};box-shadow:0 0 8px ${dot}"></i>`:""}${esc(l)}</div><div class="v">${raw?v:`<span class="n" ${count&&isFinite(v)?`data-count="${v}" data-dec="${dec}"`:""}>${isFinite(v)?fmt(v,dec):"—"}</span>`}${unit?`<small>${esc(unit)}</small>`:""}</div>${d?`<div class="d">${d}</div>`:""}</div>`;
const srcTag=(salla,tt)=>`<span class="src"><i></i>${salla?"سلة":""}${salla&&tt?" + ":""}${tt?"تيك توك":""}</span>`;
function emptyState(title,body,btn=""){return`<div class="empty"><b>${esc(title)}</b><div class="small">${esc(body)}</div>${btn}</div>`}
function hasData(){return Object.keys(S.salla).length>0||Object.keys(S.ads).length>0}
function onboarding(){
  return`<div class="card hero" style="padding:22px"><div class="row" style="justify-content:space-between;align-items:flex-start;gap:16px">
  <div style="max-width:620px"><span class="tag pk">خطوة أولى</span><h2 style="font-family:var(--f-display);font-size:24px;margin:10px 0 6px">اربط سلة وتيك توك وابدأ البث المالي</h2>
  <div class="muted">النظام يسحب طلباتك من سلة وصرفك من تيك توك، ويحسب التكلفة والرسوم والصافي تلقائيًا. المزامنة تبدأ لحالها لما تفتح الصفحة، وأول مرة تطلب موافقتك على استخدام سلة وتيك توك. إذا ما طلعت لك الموافقة اضغط الزر.</div></div>
  <button class="btn pri" data-act="sync-all">${ic("sync")}ابدأ المزامنة</button></div></div>`;
}

/* ===================== pages ===================== */
function pageHome(){
  const r=range(),R=calc(r.from,r.to),P=calc(prevRange(r).from,prevRange(r).to),t=riyadhToday(),TD=calc(t,t).T,g=goals();
  const ms=calc(monthStart(t),t).T,mDays=dim(t),dayN=Number(t.slice(8)),proj=ms.rev/dayN*mDays;
  const alerts=[];
  if(TD.adsAll>0&&TD.orders===0)alerts.push(["pk",`إعلانات اليوم صرفت ${fmt(TD.adsAll,2)} ريال ولا فيه طلبات مسجلة لليوم إلى الحين.`]);
  losingCampaigns().forEach(c=>alerts.push(["pk",`حملة «${c.name}» تخسّر يومين ورا بعض: صرفت ${fmt(c.spend,2)} ريال وجابت ${fmt(c.orders)} طلب من سلة. راجعها في صفحة الإعلانات.`]));
  SUPPLIERS.forEach(([k,l])=>{const rw=runwayOf(k);if(rw&&isFinite(rw.days)&&rw.days<3)alerts.push(["pk",`رصيد ${k} يكفي ${rw.days<1?"أقل من يوم":fmt(rw.days,1)+" يوم"} بمعدل صرفك الحالي (${fmt(rw.daily,2)} ريال يوميًا). اشحن الحين.`])});
  {const sp=supplierState();if(sp.has&&sp.low)alerts.push(["pk",sp.real?`رصيد ${sp.lows.map(b=>b.label+" "+fmt(b.balance_sar,2)).join(" و ")} ريال، اشحن قبل ما تتوقف الطلبات.`:`رصيد المورد المتوقع ${fmt(sp.bal,2)} ريال، اشحن قبل ما تتوقف الطلبات.`])}
  {const bad=Object.values(S.links||{}).filter(L=>/Partial|Canceled|غير موجود/.test(L.status||""));if(bad.length)alerts.push(["pk",`${bad.length} طلب عند المورد حالته جزئي أو ملغي أو غير موجود. راجعها في صفحة الطلبات.`])}
  if(R.unknownN)alerts.push(["pk",`${R.unknownN} طلب فيه منتج ما له تكلفة في النظام. أضفه من صفحة المنتجات عشان يدخل بالحساب.`]);
  if(isFinite(R.T.margin)&&R.T.margin<g.margin)alerts.push(["mu",`هامش الربح في الفترة ${fmt(R.T.margin*100,0)}%، والمستهدف ${fmt(g.margin*100,0)}%.`]);
  if(isFinite(R.T.margin)&&R.T.margin>=g.margin)alerts.push(["cy",`هامش الربح ${fmt(R.T.margin*100,0)}% فوق المستهدف (${fmt(g.margin*100,0)}%).`]);
  if(R.estN)alerts.push(["mu",`تكلفة ${R.estN} طلب منفرد محسوبة كنسبة تقديرية، لأن مبلغه ما طابق أي كمية (غالبًا خصم).`]);
  {const now=riyadhNowStr();const hr=+now.slice(11,13);const tO=calc(t,t).orders;const lastT=tO.length?tO[0].t:null;
   if(TD.adsAll>0&&tO.length&&lastT&&(hr>=10||hr<2)){const [h,m]=lastT.split(":").map(Number);const mins=(hr*60+ +now.slice(14,16))-(h*60+m);if(mins>=360)alerts.push(["pk",`آخر طلب كان قبل ${Math.floor(mins/60)} ساعات والإعلان شغّال. تأكد إن الحملة والموقع والدفع شغالين.`])}
   const aov=R.T.aov;tO.filter(o=>isFinite(aov)&&aov>0&&o.amount>=Math.max(3*aov,40)).forEach(o=>alerts.push(["cy",`طلب كبير اليوم: #${o.ref} بقيمة ${fmt(o.amount,2)} ريال.`]));
   const BE=contribOf(R.T);if(TD.adsAll>0&&TD.orders>0&&isFinite(BE)&&TD.adsAll/TD.orders>BE)alerts.push(["pk",`تكلفة الطلب اليوم ${fmt(TD.adsAll/TD.orders,2)} ريال، أعلى من اللي يبقى لك من الطلب (${fmt(BE,2)}). كل طلب من الإعلان اليوم بخسارة.`]);
   if(isFinite(g.monthlySales)&&ms.rev>=g.monthlySales)alerts.push(["cy",`وصلت هدف الشهر (${fmt(g.monthlySales)} ريال).`]);
   const h=((S.config&&S.config.rateHistory)||[]).filter(e=>e.auto&&e.from>=addDays(t,-7));if(h.length)alerts.push(["mu",`أسعار خدمات المورد تغيّرت ${h.length} مرة آخر 7 أيام، والتكلفة تحدّثت تلقائي. شوف «سجل تغيير الخدمات» في صفحة المنتجات.`]);
   const rt=extData("rat:90");if(rt&&rt.totals&&+rt.totals.negative>0)alerts.push(["pk",`عندك ${fmt(+rt.totals.negative)} تقييم سلبي ومتوسط التقييم ${fmt(+rt.totals.average_rating,1)} من 5. رد عليها من سلة.`]);
   const cp=extData(`coup:${r.from}:${r.to}`);const full=((cp&&cp.rows)||[]).filter(x=>x.details&&x.details.coupon_type==="P"&&+x.details.coupon_amount>=100&&+x.orders>0);full.forEach(x=>alerts.push(["pk",`كوبون ${x.label} خصمه 100% وانستخدم ${fmt(+x.orders)} مرة في الفترة (طلبات مجانية). عطّله لو مو مقصود.`]))}
  if(S.mcp){sallaRep("reports_ratings_summary",{period:"last_90_days"},"rat:90");sallaRep("reports_sales_by",{dimension:"coupon",from_date:r.from,to_date:r.to,limit:50},`coup:${r.from}:${r.to}`)}
  const lastOrders=R.orders.slice(0,6);logAlerts(alerts);
  const repBanner=Number(t.slice(8))<=5?(()=>{const pm=addMonths(monthStart(t),-1);const P2=calc(pm,monthEnd(pm)).T;return`<div class="card" style="border-color:rgba(0,229,212,.35)"><div class="row" style="justify-content:space-between;gap:12px;flex-wrap:wrap"><div><h3 style="margin:0">تقرير ${esc(mLabel(pm))} جاهز</h3><div class="muted small">مبيعات <b class="n">${fmt(P2.rev,0)}</b> · إعلان <b class="n">${fmt(P2.adsAll,0)}</b> · صافي <b class="n ${P2.net<0?"neg":"pos"}">${fmt(P2.net,0)}</b> ر.س</div></div><div class="row" style="gap:8px"><button class="btn sm cy" data-act="rep-pdf">${ic("doc")}تنزيل PDF</button><button class="btn sm ghost" data-act="rep-xlsx">${ic("xls")}إكسل</button></div></div></div>`})():"";
  return`${repBanner}${hasData()?"":onboarding()}
  <div class="grid g21">
   <div class="card hero"><div class="row" style="justify-content:space-between"><span class="live ${liveOn()?"":"off"}"><i></i>${liveOn()?"مباشر":"غير متصل"}</span>${srcTag(1,1)}</div>
    <div class="grid g3" style="margin-top:14px;gap:12px">
     <div class="kpi big" style="grid-column:1/-1"><div class="l">صافي اليوم · ${esc(dLabel(t))}</div><div class="v ${TD.net<0?"neg":""}"><span class="n" data-count="${TD.net}" data-dec="2">${fmt(TD.net,2)}</span><small>ر.س</small></div></div>
     <div class="kpi"><div class="l">مبيعات اليوم</div><div class="v" style="font-size:22px">${money(TD.rev,2)}</div></div>
     <div class="kpi"><div class="l">طلبات اليوم</div><div class="v" style="font-size:22px">${money(TD.orders)}</div></div>
     <div class="kpi"><div class="l">إعلان اليوم</div><div class="v" style="font-size:22px">${money(TD.adsAll,2)}</div></div>
    </div></div>
   <div class="card"><h3>هدف الشهر <small>${esc(mLabel(t))}</small></h3>
    <div class="ring-wrap">${ring(ms.rev/g.monthlySales,fmt(ms.rev/g.monthlySales*100,1)+"%","من "+fmt(g.monthlySales))}
    <div class="list small" style="flex:1;min-width:0"><div>المبيعات: <b>${money(ms.rev)}</b> ر.س</div><div>التوقع بنهاية الشهر بنفس الوتيرة: <b>${money(proj)}</b> <span class="tag fc">توقع</span></div><div>المطلوب يوميًا للهدف: <b>${money(Math.max(0,(g.monthlySales-ms.rev)/Math.max(1,mDays-dayN+1)))}</b></div></div></div></div>
  </div>
  <div class="grid g4">
   ${kpi("الإيرادات",R.T.rev,{d:delta(R.T.rev,P.T.rev)+" عن الفترة السابقة",dot:"#00E5D4"})}
   ${kpi("صافي الأرباح",R.T.net,{d:delta(R.T.net,P.T.net)+" عن الفترة السابقة",dot:"#FF3D7F",cls:R.T.net<0?"neg":""})}
   ${kpi("الطلبات",R.T.orders,{unit:"",d:delta(R.T.orders,P.T.orders)})}
   ${kpi("العائد على الإعلان",R.T.roas,{unit:"x",dec:2,d:"مبيعات سلة ÷ الإعلان · "+delta(R.T.roas,P.T.roas)})}
  </div>
  <div class="grid g21">
   <div class="card"><h3>الإيرادات والصافي يوم بيوم <small>${esc(r.label)}</small></h3>
    ${R.T.rev||R.T.adsAll?lineChart({labels:R.days.map(d=>dLabel(d)),series:[{name:"الإيرادات",vals:R.days.map(d=>R.D[d].rev),color:"#00E5D4",area:true},{name:"الصافي",vals:R.days.map(d=>R.D[d].net),color:"#FF3D7F"}]}):emptyState("ما فيه حركة في هذي الفترة","بعد المزامنة تظهر المبيعات والصافي هنا.")}
    <div class="legend"><span><i style="background:#00E5D4"></i>الإيرادات</span><span><i style="background:#FF3D7F"></i>الصافي</span></div></div>
   <div class="card"><h3>تنبيهات <button type="button" class="btn sm ghost" data-act="alert-log">السجل</button></h3><div class="list">${alerts.length?alerts.map(a=>`<div class="alert ${a[0]}"><i class="ic"></i><div>${esc(a[1])}</div></div>`).join(""):`<div class="alert mu"><i class="ic"></i><div>ما فيه تنبيهات للفترة.</div></div>`}</div></div>
  </div>
  <div class="card"><h3>آخر الطلبات <small><a href="#orders">كل الطلبات</a></small></h3>${lastOrders.length?`<div class="list">${lastOrders.map(o=>{const c=orderCost(o);const net=o.amount-c.cost-feeOf(o.amount);return`<div class="li ${S.newIds.has(String(o.id))?"new":""}"><div style="min-width:0"><div class="t">${esc((o.items||[]).map(i=>i.name+(i.qty>1?" ×"+i.qty:"")).join("، ")||"طلب")}</div><div class="s"><span class="n">#${esc(o.ref)}</span> · ${esc(dLabel(o.day))} ${esc(o.t||"")}</div></div><div style="text-align:left"><div class="n" style="font-weight:800">${fmt(o.amount,2)}</div><div class="s pos n">+${fmt(net,2)}</div></div></div>`}).join("")}</div>`:emptyState("ما فيه طلبات بعد","تظهر طلبات سلة هنا بعد المزامنة.")}</div>`;
}

function forecastCard(){const t=riyadhToday(),ms=monthStart(t),me=monthEnd(t),dayN=Number(t.slice(8)),nd=dim(t);const M=calc(ms,t).T;
  const rest=nd-dayN;let recRest=0;for(let i=1;i<=rest;i++)recRest+=recurringOn(addDays(t,i));
  const per=(v)=>v/dayN;const pRev=M.rev+per(M.rev)*rest,pCost=M.cost+per(M.cost)*rest,pFees=M.fees+per(M.fees)*rest,pAds=M.adsAll+per(M.adsAll)*rest,pOther=M.exp+per(M.exp)*rest+M.rec+recRest;const pNet=pRev-pCost-pFees-pAds-pOther;
  const BE=contribOf(M);const fixedDay=(M.rec+recRest)/nd;const needDay=isFinite(BE)&&BE>0?(fixedDay+per(M.adsAll))/BE:NaN;
  return`<div class="card"><h3>توقع آخر الشهر <small>بنفس وتيرة ${dayN} يوم</small></h3><div class="pd-grid">
   <div class="pd-box"><small>المبيعات المتوقعة</small><b class="n">${fmt(pRev,0)}</b></div><div class="pd-box"><small>الإعلانات المتوقعة</small><b class="n">${fmt(pAds,0)}</b></div>
   <div class="pd-box"><small>الصافي المتوقع</small><b class="n ${pNet<0?"neg":"pos"}">${fmt(pNet,0)}</b></div><div class="pd-box"><small>طلبات تحتاجها يوميًا عشان ما تخسر</small><b class="n">${isFinite(needDay)?fmt(Math.ceil(needDay)):"—"}</b></div></div>
   <div class="pd-grid" style="margin-top:10px"><div class="pd-box"><small>تكلفة التعويضات هالشهر</small><b class="n">${fmt(S.expenses.filter(e=>e.category==="refund"&&e.date>=ms&&e.date<=t).reduce((a,e)=>a+(+e.amount||0),0),2)}</b></div><div class="pd-box"><small>المصاريف الثابتة الشهر</small><b class="n">${fmt(M.rec+recRest,0)}</b></div></div><div class="muted small" style="margin-top:8px">معدلك الحين ${fmt(M.orders/dayN,1)} طلب يوميًا. يبقى لك من كل طلب ${isFinite(BE)?fmt(BE,2):"—"} ريال قبل الإعلان والمصاريف الثابتة.</div></div>`}
function pageSummary(){
  const r=range(),pr=prevRange(r),R=calc(r.from,r.to).T,P=calc(pr.from,pr.to).T;
  const cards=[["إجمالي الإيرادات",R.rev,P.rev,0,"#00E5D4"],["صافي الأرباح",R.net,P.net,0,"#FF3D7F"],["إجمالي المصروفات",R.expenses,P.expenses,1,""],["تكلفة المنتجات",R.cost,P.cost,1,""],
    ["الإنفاق الإعلاني",R.adsAll,P.adsAll,1,""],["رسوم سلة",R.fees,P.fees,1,""],["عدد الطلبات",R.orders,P.orders,0,""],["متوسط قيمة السلة",R.aov,P.aov,0,""]];
  const parts=[["تكلفة المنتجات",R.cost,"#7C6BFF"],["رسوم سلة",R.fees,"#C2BEDD"],["الإعلانات",R.adsAll,"#FF3D7F"],["مصروفات أخرى",R.other,"#FF7AA6"],["صافي لك",Math.max(0,R.net),"#00E5D4"]];
  const tot=parts.reduce((a,b)=>a+b[1],0)||1;
  return`<div class="row"><span class="tag">${esc(r.label)}</span><span class="muted small">مقارنة مع: ${esc(dLabel(pr.from))} – ${esc(dLabel(pr.to))}</span></div>
  <div class="grid g4">${cards.map((c,i)=>kpi(c[0],c[1],{unit:i===6?"":"ر.س",dec:i===7?2:0,d:delta(c[1],c[2],!!c[3])+` <span>السابق ${fmt(c[2],i===7?2:0)}</span>`,dot:c[4]})).join("")}</div>
  <div class="grid g2 stack">
   <div class="card"><h3>وين راحت كل ريال</h3>${R.rev?`<div style="display:flex;height:22px;border-radius:12px;overflow:hidden;gap:2px;margin:6px 0 14px">${parts.map(p=>`<i title="${esc(p[0])}" style="flex:${Math.max(.001,p[1]/tot)};background:${p[2]}"></i>`).join("")}</div><div class="list">${parts.map(p=>`<div class="li"><div class="row"><i style="width:10px;height:10px;border-radius:3px;background:${p[2]}"></i><span>${esc(p[0])}</span></div><div><b class="n">${fmt(p[1])}</b> <span class="muted small n">${fmt(p[1]/R.rev*100,0)}%</span></div></div>`).join("")}</div>`:emptyState("ما فيه إيرادات في الفترة","")}</div>
   <div class="card"><h3>المؤشرات</h3><div class="grid g2" style="gap:10px">
    ${[["هامش الربح",pct(R.margin,1),pct(P.margin,1)],["العائد على الإعلان ROAS",isFinite(R.roas)?`<span class="n">${fmt(R.roas,2)}x</span>`:"—",isFinite(P.roas)?fmt(P.roas,2)+"x":"—"],["تكلفة اكتساب الطلب CPA",isFinite(R.cpa)?money(R.cpa,2):"—",isFinite(P.cpa)?fmt(P.cpa,2):"—"],["نقطة التعادل",isFinite(R.breakEven)?`<span class="n">${fmt(R.breakEven,1)}</span> طلب/يوم`:"—",`أنت الحين ${fmt(R.perDayOrders,1)} طلب/يوم`]].map(x=>`<div class="li" style="grid-template-columns:1fr"><div class="s">${x[0]}</div><div style="font-weight:800;font-size:20px">${x[1]}</div><div class="s">${typeof x[2]==="string"&&x[2].startsWith("أنت")?esc(x[2]):"السابق: "+x[2]}</div></div>`).join("")}
   </div></div></div>${aiCard()}${forecastCard()}${obligationsCard()}`;
}
function pageRevenue(){
  const r=range(),R=calc(r.from,r.to),t=riyadhToday();
  const months=[];for(let i=5;i>=0;i--){const s=addMonths(t,-i);const e=i===0?t:monthEnd(s);months.push({m:s,T:calc(s,e).T})}
  const prods=Object.values(R.byProd).sort((a,b)=>b.qty-a.qty);
  const bySrc={},byPay={};R.orders.forEach(o=>{const s=o.src||"—";bySrc[s]=(bySrc[s]||0)+o.amount;const p=o.pay||"—";byPay[p]=(byPay[p]||0)+o.amount});
  const srcName=(s)=>({store:"المتجر",buy_now:"اشترِ الآن"}[s]||(String(s).startsWith("mini-twilight")?"زر الشراء السريع":s));
  return`<div class="grid g4">${kpi("الإيرادات",R.T.rev,{dot:"#00E5D4"})}${kpi("الطلبات",R.T.orders,{unit:""})}${kpi("متوسط قيمة الطلب",R.T.aov,{dec:2})}${kpi("متوسط الإيراد اليومي",R.T.rev/R.days.length,{dec:2})}</div>
  <div class="card"><h3>الإيرادات اليومية <small>${esc(r.label)} · ${srcTag(1,0)}</small></h3>${R.T.rev?barChart({vals:R.days.map(d=>R.D[d].rev),labels:R.days.map(d=>d.slice(8)),colors:(v,i)=>{const w=toD(R.days[i]).getUTCDay();return w===4||w===5?"#FF3D7F":"#00E5D4"}}):emptyState("ما فيه مبيعات في الفترة","")}<div class="legend"><span><i style="background:#00E5D4"></i>أيام الأسبوع</span><span><i style="background:#FF3D7F"></i>الخميس والجمعة</span></div></div>
  <div class="grid g2 stack">
   <div class="card"><h3>الإيرادات الشهرية <small>آخر 6 أشهر</small></h3>${barChart({vals:months.map(m=>m.T.rev),labels:months.map(m=>MONTHS_AR[+m.m.slice(5,7)-1]),h:180,colors:"#7C6BFF"})}
    <div class="tbl-wrap"><table><thead><tr><th>الشهر</th><th class="n">الإيرادات</th><th class="n">الطلبات</th><th class="n">الصافي</th></tr></thead><tbody>${months.slice().reverse().map(m=>`<tr><td>${esc(mLabel(m.m))}</td><td class="n">${fmt(m.T.rev,2)}</td><td class="n">${fmt(m.T.orders)}</td><td class="n ${m.T.net<0?"neg":"pos"}">${fmt(m.T.net,2)}</td></tr>`).join("")}</tbody></table></div></div>
   <div class="card"><h3>المبيعات حسب المنتج</h3>${prods.length?`<div class="tbl-wrap"><table><thead><tr><th>المنتج</th><th class="n">الكمية</th><th class="n">الطلبات</th><th>التكلفة</th></tr></thead><tbody>${prods.map(p=>{const pp=findProduct(p.name);return`<tr><td>${esc(p.name)}</td><td class="n">${fmt(p.qty)}</td><td class="n">${fmt(p.orders)}</td><td>${pp?(pp.type==="pack"?'<span class="tag cy">ثابتة</span>':'<span class="tag">نسبة</span>'):'<span class="tag pk">غير محددة</span>'}</td></tr>`}).join("")}</tbody></table></div>`:emptyState("ما فيه مبيعات","")}
   <h3 style="margin-top:16px">حسب طريقة الطلب</h3><div class="list">${Object.entries(bySrc).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<div class="li"><span>${esc(srcName(k))}</span><b class="n">${fmt(v,2)}</b></div>`).join("")||'<div class="muted small">—</div>'}</div>
   <h3 style="margin-top:16px">حسب طريقة الدفع</h3><div class="list">${Object.entries(byPay).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<div class="li"><span>${esc({mada:"مدى",credit_card:"بطاقة ائتمانية",apple_pay:"Apple Pay",stc_pay:"STC Pay",bank:"تحويل بنكي"}[k]||k)}</span><b class="n">${fmt(v,2)}</b></div>`).join("")||'<div class="muted small">—</div>'}</div></div>
  </div>`;
}
function expForm(e){const t=riyadhToday();e=e||{};return`<form class="form" id="expForm" autocomplete="off">
  <div class="field"><label for="ex-date">التاريخ</label><input class="inp" id="ex-date" type="date" required value="${esc(e.date||t)}"></div>
  <div class="field"><label for="ex-cat">التصنيف</label><select class="inp" id="ex-cat">${CATS.map(c=>`<option value="${c[0]}" ${(e.category||"other")===c[0]?"selected":""}>${c[1]}</option>`).join("")}</select></div>
  <div class="field" style="grid-column:span 2"><label for="ex-title">البيان</label><input class="inp" id="ex-title" required maxlength="80" placeholder="مثال: تصميم بنر الجمعة البيضاء" value="${esc(e.title||"")}"></div>
  <div class="field"><label for="ex-amt">المبلغ (ر.س)</label><input class="inp" id="ex-amt" type="number" step="0.01" min="0.01" required value="${esc(e.amount??"")}"></div>
  <div class="field"><label for="ex-ref">رقم الطلب (للتعويض)</label><input class="inp n" id="ex-ref" inputmode="numeric" maxlength="20" placeholder="اختياري" value="${esc(e.orderRef||"")}"></div>
  <div class="field" style="grid-column:span 2"><label for="ex-note">ملاحظة (اختياري)</label><input class="inp" id="ex-note" maxlength="160" value="${esc(e.note||"")}"></div>
  <div class="row" style="grid-column:1/-1"><button class="btn pri" type="submit" id="exSubmit">${ic(e.id?"save":"plus")}${e.id?"حفظ التعديل":"إضافة المصروف"}</button>${e.id?'<button class="btn ghost" type="button" data-act="exp-cancel">إلغاء</button>':""}<span id="dupWarn"></span></div></form>`}

function ownerCard(){const L=S.owner||[];const t=riyadhToday();const allNet=calc(firstDataDay(),t).T.net;const w=L.filter(x=>x.kind==="withdraw").reduce((a,x)=>a+(+x.amount||0),0),d=L.filter(x=>x.kind==="deposit").reduce((a,x)=>a+(+x.amount||0),0);
  return`<div class="card"><h3>السحوبات الشخصية والكاش <small>ما تنحسب مصاريف، تبين وين راحت فلوس المتجر</small></h3>
   <div class="pd-grid"><div class="pd-box"><small>صافي الربح من البداية</small><b class="n ${allNet<0?"neg":"pos"}">${fmt(allNet,2)}</b></div><div class="pd-box"><small>حطيت من جيبك</small><b class="n">${fmt(d,2)}</b></div><div class="pd-box"><small>سحبت لنفسك</small><b class="n">${fmt(w,2)}</b></div><div class="pd-box"><small>المفروض باقي للمتجر</small><b class="n ${d+allNet-w<0?"neg":"pos"}">${fmt(d+allNet-w,2)}</b></div></div>
   <form class="form" id="ownForm" style="margin-top:12px"><div class="field"><label for="ow-k">النوع</label><select class="inp" id="ow-k"><option value="withdraw">سحب لنفسي</option><option value="deposit">حطيت من جيبي في المتجر</option></select></div>
   <div class="field"><label for="ow-a">المبلغ (ر.س)</label><input class="inp n" id="ow-a" type="number" step="0.01" min="0.01" required></div><div class="field"><label for="ow-d">التاريخ</label><input class="inp" id="ow-d" type="date" required value="${t}" max="${t}"></div>
   <div class="field"><label for="ow-n">ملاحظة</label><input class="inp" id="ow-n" maxlength="80" placeholder="اختياري"></div><div class="row"><button class="btn pri" type="submit">${ic("plus")}سجّل</button></div></form>
   ${L.length?`<div class="list" style="margin-top:12px">${L.slice(0,20).map(x=>`<div class="li" style="grid-template-columns:minmax(0,1fr) auto auto"><div><b>${x.kind==="withdraw"?"سحب":"إيداع"}</b> <span class="muted small">${esc(x.date)}${x.note?" · "+esc(x.note):""}</span></div><b class="n ${x.kind==="withdraw"?"neg":"pos"}">${x.kind==="withdraw"?"−":"+"}${fmt(+x.amount||0,2)}</b><button class="btn sm danger" data-act="own-del" data-id="${esc(x.id)}" aria-label="حذف">${ic("trash")}</button></div>`).join("")}</div>`:""}</div>`}
function firstDataDay(){const ds=Object.keys(S.salla).sort();return ds[0]||riyadhToday()}
function pageExpenses(){
  const r=range(),R=calc(r.from,r.to);const list=S.expenses.filter(e=>e.date>=r.from&&e.date<=r.to).sort((a,b)=>b.date.localeCompare(a.date)||(b.createdAt||"").localeCompare(a.createdAt||""));
  const cats=Object.entries(R.byCat).sort((a,b)=>b[1]-a[1]);const t=riyadhToday();
  const months=[];for(let i=5;i>=0;i--){const s=addMonths(t,-i),e=i===0?t:monthEnd(s),T=calc(s,e).T;months.push({m:s,v:T.adsAll+T.other+T.fees+T.cost})}
  return`<div class="grid g4">${kpi("كل المصروفات",R.T.expenses,{d:"منتجات + رسوم + إعلانات + أخرى"})}${kpi("مصروفات مسجلة",R.T.adsManual+R.T.expOther,{d:`${list.length} عملية`,dot:"#FF3D7F"})}${kpi("اشتراكات ثابتة",R.T.recurring,{d:"موزعة على أيام الفترة"})}${kpi("إعلانات تيك توك",R.T.tt,{d:srcTag(0,1)})}</div>
  <div class="card"><h3>${S.editExp?"تعديل مصروف":"تسجيل مصروف جديد"} <small>تكلفة المنتجات ورسوم سلة وصرف تيك توك تنحسب تلقائي، لا تسجلها هنا</small></h3>${expForm(S.editExp)}</div>
  <div class="grid g21">
   <div class="card"><h3>المصروفات المسجلة <small>${esc(r.label)}</small></h3>${list.length?`<div class="tbl-wrap"><table><thead><tr><th>التاريخ</th><th>البيان</th><th>التصنيف</th><th class="n">المبلغ</th><th></th></tr></thead><tbody>${list.map(e=>`<tr><td class="n">${esc(e.date)}</td><td style="white-space:normal;min-width:160px">${esc(e.title)}${e.orderRef?` <span class="tag pk n">#${esc(e.orderRef)}</span>`:""}${e.note?`<div class="muted small">${esc(e.note)}</div>`:""}</td><td><span class="tag">${esc(CATMAP[e.category]||e.category)}</span></td><td class="n">${fmt(e.amount,2)}</td><td><div class="row" style="flex-wrap:nowrap;gap:6px"><button class="btn sm ghost" data-act="exp-edit" data-id="${esc(e.id)}" aria-label="تعديل">${ic("edit")}</button><button class="btn sm danger" data-act="exp-del" data-id="${esc(e.id)}" aria-label="حذف">${ic("trash")}</button></div></td></tr>`).join("")}</tbody></table></div>`:emptyState("ما فيه مصروفات مسجلة في الفترة","سجّل أي مصروف من النموذج فوق: تصميم، اشتراك، تعويض عميل…")}</div>
   <div class="card"><h3>حسب التصنيف</h3>${cats.length?`<div class="list">${cats.map(([k,v])=>`<div><div class="row" style="justify-content:space-between"><span>${esc(CATMAP[k]||k)}</span><b class="n">${fmt(v,2)}</b></div><div class="bar"><i data-w="${v/cats[0][1]*100}"></i></div></div>`).join("")}</div>`:'<div class="muted small">—</div>'}
    <h3 style="margin-top:18px">المصروفات الشهرية <small>كل البنود</small></h3>${barChart({vals:months.map(m=>m.v),labels:months.map(m=>MONTHS_AR[+m.m.slice(5,7)-1]),h:170,colors:"#FF3D7F"})}</div>
  </div>
  <div class="card"><h3>الاشتراكات والمصاريف الثابتة الشهرية <button class="btn sm cy" data-act="rec-add">${ic("plus")}إضافة</button></h3>
   ${S.recurring.length?`<div class="tbl-wrap"><table><thead><tr><th>البند</th><th class="n">شهريًا</th><th>من شهر</th><th>إلى شهر</th><th>الحالة</th><th></th></tr></thead><tbody>${S.recurring.map(x=>`<tr><td>${esc(x.title)}</td><td class="n">${fmt(x.amount,2)}</td><td class="n">${esc(x.startMonth||"—")}</td><td class="n">${esc(x.endMonth||"مستمر")}</td><td>${x.active===false?'<span class="tag">موقوف</span>':'<span class="tag cy">فعّال</span>'}</td><td><div class="row" style="flex-wrap:nowrap;gap:6px"><button class="btn sm ghost" data-act="rec-edit" data-id="${esc(x.id)}" aria-label="تعديل">${ic("edit")}</button><button class="btn sm danger" data-act="rec-del" data-id="${esc(x.id)}" aria-label="حذف">${ic("trash")}</button></div></td></tr>`).join("")}</tbody><tfoot><tr><td>المجموع</td><td class="n">${fmt(S.recurring.filter(x=>x.active!==false).reduce((a,b)=>a+(+b.amount||0),0),2)}</td><td colspan="4"></td></tr></tfoot></table></div>`:emptyState("ما فيه اشتراكات","أضف اشتراك سلة والأدوات الشهرية.")}</div>${ownerCard()}`;
}

/* ---------- suppliers via the Flash Suppliers connector (live, read-only) ---------- */
const SUP="Flash Suppliers";
const SUPPLIERS=[["drd3m","دكتور دعم (drd3m)"],["smmcpan","smmcpan"]];
const SVC_TYPES=[["views","مشاهدات"],["likes","لايكات"],["shares","شير"],["saves","حفظ"]];
const DEF_SVC={views:{sup:"drd3m",id:"12033"},likes:{sup:"drd3m",id:"10816"},shares:{sup:"drd3m",id:"5633"},saves:{sup:"drd3m",id:"9350"}};
function svcMap(){const s=(S.config&&S.config.services)||{};const o={};SVC_TYPES.forEach(([k])=>o[k]={...DEF_SVC[k],...(s[k]||{})});return o}
S.oq={};S.om={};S.ext={};S.experiments=[];S.owner=[];S.ai={q:"",a:"",busy:false,hist:[]};S.alertLog={};S.svc=new Map();S.supErr=null;S.supBal=null;S.supBalAt=0;S.links={};
const fmtMins=(m)=>m==null?"—":m<60?`${m} دقيقة`:m<1440?`${Math.round(m/60*10)/10} ساعة`:`${Math.round(m/1440*10)/10} يوم`;
function supMsg(e){const c=e&&e.code;if(c==="server_not_connected")return"موصل Flash Suppliers مو مضاف في claude.ai";if(c==="needs_reauth")return"أعد ربط موصل Flash Suppliers";
  if(c==="not_in_manifest"||c==="approval_required"||c==="consent_required")return"وافق على استخدام موصل المزودين";if(c==="tool_error")return"المزود رفض الطلب: "+String(e.message||"").slice(0,100);return"تعذّر الاتصال بموصل المزودين"}
function ensureCatalog(){}
async function lookupSvc(sup,id){id=String(id||"").trim();if(!id||!S.mcp)return;const key=sup+":"+id;const cur=S.svc.get(key);if(cur==="loading"&&S.svcP&&S.svcP.get(key))return S.svcP.get(key);if(cur&&cur!=="error")return;S.svc.set(key,"loading");S.svcP=S.svcP||new Map();const pr=(async()=>{
  try{const r=await S.mcp.callTool(SUP,"supplier_services",{supplier:sup,ids:[id]},{cache:{staleTime:6e5,gcTime:36e5}});const it=((r.payload||{}).items||[])[0];S.svc.set(key,it||"missing");S.supErr=null}
  catch(e){S.svc.set(key,"error");S.supErr=supMsg(e)}refreshCatInfo()})();S.svcP.set(key,pr);return pr}
function catInfoHTML(sup,id,cur){if(!id)return`<span class="muted small">اكتب رقم الخدمة</span>`;if(!S.mcp)return`<span class="muted small">الربط بالمزودين غير متاح في هذا العرض</span>`;
  const r=S.svc.get(sup+":"+String(id).trim());
  if(!r||r==="loading")return`<span class="muted small"><i class="spin" style="width:12px;height:12px;vertical-align:middle"></i> أجيب سعر الخدمة من ${esc(sup)}…</span>`;
  if(r==="error")return`<span class="neg small">${esc(S.supErr||"تعذّر جلب الخدمة")}</span>`;
  if(r==="missing")return`<span class="neg small">الرقم ${esc(id)} غير موجود عند ${esc(sup)}</span>`;
  return svcDetailHTML({supplier:sup,serviceId:String(id).trim(),rate_sar:r.rate_sar})+`<div class="src small" style="margin-top:6px"><i></i>مباشر من ${esc(sup)}</div>`}
function refreshCatInfo(){SVC_TYPES.forEach(([k])=>{const el=document.getElementById("sv-info-"+k);if(!el)return;const sup=$("#sv-sup-"+k).value,id=$("#sv-id-"+k).value,cur=$("#rt-"+k).value;
    const r=S.svc.get(sup+":"+id);if(!r&&id)lookupSvc(sup,id);if(r&&typeof r==="object"&&r.rate_sar!=null)$("#rt-"+k).value=r.rate_sar;el.innerHTML=catInfoHTML(sup,id,cur)});
  const st=$("#catStamp");if(st)st.textContent=S.mcp?"الأسعار تجي مباشرة من المزودين":""}
const svcT={};
function onSvcInput(k){const sup=$("#sv-sup-"+k).value,id=$("#sv-id-"+k).value.replace(/[^0-9]/g,"");$("#sv-id-"+k).value=id;clearTimeout(svcT[k]);
  const apply=()=>{const r=S.svc.get(sup+":"+id);if(r&&typeof r==="object"&&r.rate_sar!=null)$("#rt-"+k).value=r.rate_sar;document.getElementById("sv-info-"+k).innerHTML=catInfoHTML(sup,id,$("#rt-"+k).value)};
  if(!id){apply();return}if(S.svc.has(sup+":"+id)&&S.svc.get(sup+":"+id)!=="error"){apply();return}
  document.getElementById("sv-info-"+k).innerHTML=catInfoHTML(sup,id,null);svcT[k]=setTimeout(()=>lookupSvc(sup,id).then(apply),450)}
let catT,catSeq=0;
function runCatSearch(){const box=$("#cat-res");if(!box)return;const q=($("#cat-q").value||"").trim(),sup=$("#cat-sup").value,sort=$("#cat-sort").value;
  if(q.length<2){box.innerHTML=`<div class="muted small">اكتب حرفين أو رقم على الأقل.</div>`;return}if(!S.mcp){box.innerHTML=`<div class="muted small">الربط بالمزودين غير متاح هنا.</div>`;return}
  clearTimeout(catT);const seq=++catSeq;box.innerHTML=`<div class="muted small"><i class="spin" style="width:12px;height:12px;vertical-align:middle"></i> أدور عند المزودين…</div>`;
  catT=setTimeout(async()=>{const sups=sup?[sup]:SUPPLIERS.map(s=>s[0]);let res=[],err=null;
    for(const s of sups){try{const r=await S.mcp.callTool(SUP,"supplier_services",/^\d+$/.test(q)?{supplier:s,query:q,limit:50}:{supplier:s,query:q,limit:50},{cache:{staleTime:6e5,gcTime:36e5}});((r.payload||{}).items||[]).forEach(it=>res.push({...it,sup:s}))}catch(e){err=supMsg(e)}}
    if(seq!==catSeq)return;const T=(r)=>{const s=speedOf(r,1000,r.sup);return s?s.min:1e12},P=(r)=>r.rate_sar??1e9;
    if(sort==="time")res.sort((a,b)=>T(a)-T(b)||P(a)-P(b));else if(sort==="best"){const pr=[...res].sort((a,b)=>P(a)-P(b)),tr=[...res].sort((a,b)=>T(a)-T(b));const rk=new Map();res.forEach(r=>rk.set(r,pr.indexOf(r)+tr.indexOf(r)));res.sort((a,b)=>rk.get(a)-rk.get(b)||P(a)-P(b))}else res.sort((a,b)=>P(a)-P(b)||T(a)-T(b));
    box.innerHTML=res.length?`<div class="tbl-wrap"><table class="cat-tbl"><thead><tr><th>اسم الخدمة</th><th class="n">السعر لكل 1,000</th><th>الوقت المتوقع</th><th>معلومات الخدمة</th></tr></thead><tbody>${res.slice(0,30).map(r=>{const u=svcURL(r.sup,r.id);const sp=speedOf(r,1000,r.sup);
      return`<tr><td data-label="اسم الخدمة"><div class="ct-name">${u?`<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(r.name)}</a>`:esc(r.name)}</div><div class="muted small"><span class="tag">${esc(r.sup)}</span> رقم <b class="n">${esc(r.id)}</b></div></td>
       <td data-label="السعر لكل 1,000"><div><b class="ct-price n">${r.rate_sar!=null?fmt(r.rate_sar,4):fmt(r.rate,4)}</b> <span class="muted small">${r.rate_sar!=null?"ر.س":esc(r.currency)}</span><div class="muted small n">$${fmt(r.rate,4)}</div></div></td>
       <td data-label="الوقت المتوقع"><div><span class="ct-time ${sp?"":"unk"}">${esc(sp?fmtDur(sp.min):(r.sup==="smmcpan"?"غير متاحة من smmcpan":"غير متاحة"))}</span>${sp&&sp.src==="manual"?'<div class="muted small">كتبتها أنت</div>':""}${!sp?`<div><button type="button" class="linkbtn" data-act="spd-set" data-sup="${esc(r.sup)}" data-id="${esc(r.id)}" data-name="${esc(r.name||"")}">اكتبها</button></div>`:""}${sp&&sp.src==="name"?'<div class="muted small">تقدير من الوصف</div>':""}</div></td>
       <td data-label="معلومات الخدمة"><div><div class="ct-info"><span>أقل <b class="n">${fmt(r.min)}</b></span><span>أعلى <b class="n">${r.max>=1e9?"مفتوح":fmt(r.max)}</b></span><span>${r.refill?"فيه تعويض":"بدون تعويض"}</span><span>${r.cancel?"إلغاء متاح":"بدون إلغاء"}</span></div><div class="muted small">${esc(r.category||"")}</div>${u?`<a class="btn sm cy ct-open" href="${esc(u)}" target="_blank" rel="noopener noreferrer">افتح الخدمة ↗</a>`:""}</div></td></tr>`}).join("")}</tbody></table></div>`:`<div class="muted small">${esc(err||"ما فيه نتائج.")}</div>`},450)}
/* live balances */
let balUnwatch=null;
function startSupplierWatch(){if(balUnwatch||!S.mcp)return;balUnwatch=S.mcp.watchTool(SUP,"supplier_balance",{supplier:"all"},(ev)=>{
  if(ev.type==="error"){S.supErr=supMsg(ev.error);if(["needs_reauth","server_not_connected","not_in_manifest","blocked_by_policy","approval_required","consent_required"].includes(ev.error&&ev.error.code))S.supBal=null;render();return}
  const p=(ev.result&&ev.result.payload)||{};const o={};(p.balances||[]).forEach(b=>o[b.supplier]=b);S.supBal=o;setTimeout(detectTopups,500);S.supBalAt=(ev.result.cache&&ev.result.cache.storedAt)||Date.now();S.supErr=null;render()},{refetchInterval:300000})}
/* supplier order links: Salla order -> supplier order IDs, with live charge/status */
const linkChecking=new Set();
async function refreshLinks(orders){if(!S.mcp||!S.db)return;const by={};const now=Date.now();
  for(const o of orders){const L=S.links[o.id];if(!L||!L.ids||!L.ids.length)continue;if(linkChecking.has(o.id))continue;const fresh=L.checkedAt&&now-new Date(L.checkedAt).getTime()<10*6e4;const done=["Completed","Canceled","Partial","Refunded"].includes(L.status);if(fresh||(done&&L.charge_sar!=null))continue;(by[L.supplier]=by[L.supplier]||[]).push(o.id)}
  for(const [sup,oids] of Object.entries(by)){const ids=[...new Set(oids.flatMap(id=>S.links[id].ids))].slice(0,100);oids.forEach(i=>linkChecking.add(i));
    try{const r=await S.mcp.callTool(SUP,"supplier_order_status",{supplier:sup,orders:ids},{cache:false});const st=(r.payload||{}).orders||{};
      for(const oid of oids){const L=S.links[oid];let charge=0,ok=true,status=[];for(const x of L.ids){const s=st[x];if(!s||s.error){ok=false;status.push("غير موجود");continue}if(s.charge_sar==null)ok=false;else charge+=s.charge_sar;status.push(s.status)}
        const doc={...L,charge_sar:ok?Math.round(charge*10000)/10000:null,status:status.length===1?status[0]:status.join("، "),checkedAt:new Date().toISOString()};
        if(doc.charge_sar!==L.charge_sar||doc.status!==L.status||!L.checkedAt)await S.db.doc("supplier_links/"+oid).set(doc)}}
    catch(e){S.supErr=supMsg(e)}finally{oids.forEach(i=>linkChecking.delete(i))}}}


/* singles: read the quantity the customer picked from the Salla invoice ("اختيار عدد اللايكات : 250 لايك").
   Only the number is saved, never the link or customer details. */
const AR2=(s)=>String(s||"").replace(/[٠-٩]/g,d=>"٠١٢٣٤٥٦٧٨٩".indexOf(d)).replace(/[٬,]/g,"");
function parseInvoiceQty(desc){const s=AR2(desc);
  let m=s.match(/اختيار\s*(?:عدد|كمية)?[^:：]{0,40}[:：]\s*(\d+(?:\.\d+)?)\s*(k|K|ألف|الف|آلاف|الاف|مليون)?/);
  if(!m)m=s.match(/(\d+(?:\.\d+)?)\s*(k|K|ألف|الف|آلاف|الاف|مليون)?\s*(?:لايك|مشاهد|متابع|شير|مشارك|حفظ|تعليق)/);
  if(!m)return null;let v=+m[1];const u=m[2]||"";if(/مليون/.test(u))v*=1e6;else if(u)v*=1e3;return v>0&&v<1e9?Math.round(v):null}
const invChecked=new Map();let invBusy=false;
async function readInvoiceQty(orders){if(!S.mcp||!S.db||invBusy)return;invBusy=true;let n=0;const now=Date.now();
  try{for(const o of orders){if(n>=12)break;if(S.oq[o.id])continue;
    const singles=(o.items||[]).filter(it=>{const p=findProduct(it.name);return p&&p.type!=="pack"&&p.service});if(!singles.length)continue;
    const last=invChecked.get(o.id);if(last&&now-last<30*6e4)continue;invChecked.set(o.id,now);n++;
    try{const l=await S.mcp.callTool(SALLA,"orders_invoices_list",{order_id:+o.id},{cache:false});const inv=((l.payload&&l.payload.data)||[])[0];if(!inv)continue;
      const g=await S.mcp.callTool(SALLA,"orders_invoices_get",{invoice_id:+inv.id},{cache:{staleTime:864e5,gcTime:864e5}});const its=((g.payload&&g.payload.data&&g.payload.data.items)||[]);
      const items=its.map(x=>({name:String(x.name||"").slice(0,80),q:parseInvoiceQty(x.description)})).filter(x=>x.q);
      await saveInfo(o.day,o.id,"q",{items,ref:String(o.ref||""),at:new Date().toISOString()})}
    catch(e){if(e&&["not_in_manifest","approval_required","consent_required","needs_reauth","server_not_connected"].includes(e.code))break}}}
  finally{invBusy=false}}


/* order details (channel, campaign, customer id, invoice quantity) live in one document per day: order_info/<day> */
S.oiDocs={};S._omOld={};S._oqOld={};S._omNew={};S._oqNew={};
function mergeInfo(){S.om={...S._omOld,...S._omNew};S.oq={...S._oqOld,...S._oqNew};setTimeout(migrateInfo,3000)}
const infoQ={};
function saveInfo(day,id,kind,val){const cur=S.oiDocs[day]||{day,m:{},q:{}};const next={...cur,day,[kind]:{...(cur[kind]||{}),[id]:val}};S.oiDocs[day]=next;(kind==="m"?S._omNew:S._oqNew)[id]=val;mergeInfo();
  infoQ[day]=(infoQ[day]||Promise.resolve()).then(()=>S.db.doc("order_info/"+day).set(S.oiDocs[day])).catch(e=>console.warn("info",e));return infoQ[day]}
let migrating=false;
async function migrateInfo(){if(migrating||!S.db||S.canWrite===false)return;const oldIds=[...Object.keys(S._omOld),...Object.keys(S._oqOld)];if(!oldIds.length)return;
  if(!S.loaded.has("salla"))return;migrating=true;
  try{const dayOf={};for(const [day,doc] of Object.entries(S.salla))for(const id of Object.keys(doc.orders||{}))dayOf[id]=day;
    const byDay={};for(const [id,v] of Object.entries(S._omOld)){const d=dayOf[id];if(d)(byDay[d]=byDay[d]||{m:{},q:{}}).m[id]=v}
    for(const [id,v] of Object.entries(S._oqOld)){const d=dayOf[id];if(d)(byDay[d]=byDay[d]||{m:{},q:{}}).q[id]=v}
    for(const [day,add] of Object.entries(byDay)){const cur=S.oiDocs[day]||{day,m:{},q:{}};const next={...cur,day,m:{...add.m,...(cur.m||{})},q:{...add.q,...(cur.q||{})}};S.oiDocs[day]=next;await S.db.doc("order_info/"+day).set(next)}
    for(const id of Object.keys(S._omOld))if(dayOf[id])await S.db.doc("order_meta/"+id).delete();
    for(const id of Object.keys(S._oqOld))if(dayOf[id])await S.db.doc("order_qty/"+id).delete()}
  catch(e){console.warn("migrate",e)}finally{migrating=false}}
/* order meta: channel, TikTok campaign and customer id from Salla (orders_get). Also picks up supplier tags.
   Saves no names, phones or links. */
const metaChecked=new Map();let metaBusy=false;
async function readOrderMeta(orders){if(!S.mcp||!S.db||metaBusy)return;metaBusy=true;let n=0;const now=Date.now();
  try{for(const o of orders){if(n>=15)break;const have=S.om[o.id];if(have&&have.v===2&&(have.final||diffDays(o.day,riyadhToday())>3))continue;
    const last=metaChecked.get(o.id);if(last&&now-last<20*6e4)continue;metaChecked.set(o.id,now);n++;
    try{const r=await S.mcp.callTool(SALLA,"orders_get",{order_id:o.id},{cache:false});const od=r.payload&&r.payload.order&&r.payload.order.data;if(!od)continue;
      const a=attrOf(od);const disc=((od.amounts&&od.amounts.discounts)||[]).map(d=>String(d.code||d.title||d.name||"").slice(0,30)).filter(Boolean);
      await saveInfo(o.day,o.id,"m",{ch:a.ch,camp:a.camp,utm:a.utm,dev:a.dev,cid:String((od.customer&&od.customer.id)||""),city:String((od.customer&&od.customer.city)||"").slice(0,40),cc:String((od.customer&&od.customer.country_code)||"").slice(0,4),v:2,disc,final:diffDays(o.day,riyadhToday())>3,at:new Date().toISOString()});
      if(!S.links[o.id]){const found=parseSupplierTags(od.tags);const sups=Object.keys(found);if(sups.length){const sup=sups[0];
        await S.db.doc("supplier_links/"+o.id).set({supplier:sup,ids:[...new Set(found[sup])].slice(0,20),ref:o.ref,charge_sar:null,status:null,checkedAt:null,auto:true});setTimeout(()=>refreshLinks([o]),500)}}}
    catch(e){if(e&&["not_in_manifest","approval_required","consent_required","needs_reauth","server_not_connected"].includes(e.code))break}}}
  finally{metaBusy=false}}
/* cached live extras (TikTok campaigns/ads, coupons, carts, ratings, returning customers) */
async function ext(key,fn,ttl=10*6e4){const c=S.ext[key];if(c&&(c.loading||Date.now()-c.at<ttl))return c;S.ext[key]={loading:true,at:Date.now(),data:c&&c.data};
  try{const d=await fn();S.ext[key]={at:Date.now(),data:d}}catch(e){S.ext[key]={at:Date.now(),data:c&&c.data,code:e&&e.code||"",err:e&&e.code?mcpMsg(e,"الموصل"):String(e&&e.message||e)}}render();return S.ext[key]}
const extData=(k)=>S.ext[k]&&S.ext[k].data;
function ttLevel(level,from,to){const key=`tt:${level}:${from}:${to}`;const idDim=level==="AUCTION_AD"?"ad_id":"campaign_id";
  return ext(key,async()=>{const res=await S.mcp.callTool(TIKTOK,"report_integrated_get",{advertiser_id:cfg().tiktokAdvertiser,report_type:"BASIC",data_level:level,dimensions:[idDim],
    metrics:level==="AUCTION_AD"?["ad_name","campaign_name","spend","impressions","clicks","ctr","complete_payment"]:["campaign_name","spend","impressions","reach","frequency","clicks","ctr","cpc","cpm","total_landing_page_view","video_play_actions","average_video_play","video_views_p100","likes","shares","profile_visits","complete_payment"],
    start_date:from,end_date:to,page_size:200,filtering:[{field_name:level==="AUCTION_AD"?"ad_status":"campaign_status",filter_type:"IN",filter_value:'["STATUS_ALL"]'}]},{cache:{staleTime:6e5,gcTime:36e5}});
    const p=res.payload||{};if(p.code&&p.code!==0)throw new Error(p.message||"TikTok");return((p.data&&p.data.list)||[]).map(r=>({id:(r.dimensions||{})[idDim],...r.metrics}))})}
function sallaRep(tool,args,key){return ext(key,async()=>{const r=await S.mcp.callTool(SALLA,tool,args,{cache:{staleTime:6e5,gcTime:36e5}});return r.payload})}
/* auto-link: read supplier order IDs from Salla order tags like "drd3m-123456" or "smmcpan-789" */
function parseSupplierTags(tags){const out={};(tags||[]).forEach(t=>{const s=String(typeof t==="string"?t:(t&&(t.name||t.tag||t.title||t.label))||"").trim();
  const m=s.match(/^(drd3m|smmcpan)\s*[-_:#]\s*(\d{3,14})$/i);if(m){const k=m[1].toLowerCase();(out[k]=out[k]||[]).push(m[2])}});return out}




/* the 4 shared services: prices come from the suppliers and are saved automatically, with history */
let grBusy=false,grAt=0;
async function refreshGlobalRates(force){if(grBusy||!S.mcp||!S.db||!S.config||(!force&&Date.now()-grAt<5*6e4))return;grBusy=true;grAt=Date.now();
  try{const SV=svcMap();await Promise.all(SVC_TYPES.map(([k])=>SV[k].id?lookupSvc(SV[k].sup,SV[k].id):null));
    const cur=cfg().rates;const nr={...cur};let changed=false;
    SVC_TYPES.forEach(([k])=>{const it=S.svc.get(SV[k].sup+":"+SV[k].id);if(it&&typeof it==="object"&&it.rate_sar!=null&&Math.abs(it.rate_sar-(+cur[k]||0))>0.00005){nr[k]=it.rate_sar;changed=true}});
    if(!changed)return;let hist=(S.config.rateHistory||[]).slice();if(!hist.length)hist.push({from:"2000-01-01 00:00",rates:cur,services:SV});
    hist.push({from:riyadhNowStr(),rates:nr,services:SV,auto:true});if(hist.length>60)hist=[hist[0],...hist.slice(-59)];
    S.config={...S.config,rates:nr,rateHistory:hist};await S.db.doc("meta/config").update({rates:nr,rateHistory:hist});toast("تحدّثت أسعار الخدمات من المورد")}
  catch(e){S.supErr=supMsg(e)}finally{grBusy=false}}
function linkModal(o){const L=S.links[o.id]||{supplier:"drd3m",ids:[]};const m=modal(`<h3>ربط طلب #${esc(o.ref)} بطلب المورد</h3><form class="form" id="lnkForm">
  <div class="field"><label for="ln-sup">المورد</label><select class="inp" id="ln-sup">${SUPPLIERS.map(s=>`<option value="${s[0]}" ${L.supplier===s[0]?"selected":""}>${s[1]}</option>`).join("")}</select></div>
  <div class="field" style="grid-column:1/-1"><label for="ln-ids">رقم الطلب عند المورد (لو أكثر من طلب افصل بفاصلة)</label><input class="inp n" id="ln-ids" inputmode="numeric" value="${esc((L.ids||[]).join(", "))}" placeholder="مثال: 1234567, 1234568"></div>
  <div class="row" style="grid-column:1/-1"><button class="btn pri" type="submit">${ic("save")}حفظ وجلب التكلفة</button>${L.ids&&L.ids.length?'<button class="btn danger" type="button" id="ln-del">فك الربط</button>':""}<button class="btn ghost" type="button" data-close>إلغاء</button></div></form>
  <div class="note" style="margin-top:10px">تكلفة الطلب تصير المبلغ اللي خصمه المورد فعليًا، بدل التكلفة المحسوبة.</div>`);
  m.querySelector("#lnkForm").onsubmit=async(e)=>{e.preventDefault();const b=e.submitter;if(b)b.disabled=true;const ids=[...new Set(m.querySelector("#ln-ids").value.split(/[^0-9]+/).filter(Boolean))].slice(0,20);
    if(!ids.length){toast("اكتب رقم طلب المورد","err");if(b)b.disabled=false;return}
    const dup=Object.entries(S.links).find(([k,v])=>k!==o.id&&v.supplier===m.querySelector("#ln-sup").value&&(v.ids||[]).some(x=>ids.includes(x)));
    if(dup&&!m._ok){m._ok=true;toast("هذا الرقم مربوط بطلب ثاني. اضغط حفظ مرة ثانية إذا متأكد","err");if(b)b.disabled=false;return}
    if(await write(()=>S.db.doc("supplier_links/"+o.id).set({supplier:m.querySelector("#ln-sup").value,ids,ref:o.ref,charge_sar:null,status:null,checkedAt:null}),"انربط الطلب")){m.remove();setTimeout(()=>refreshLinks([o]),300)}else if(b)b.disabled=false};
  const del=m.querySelector("#ln-del");if(del)del.onclick=async()=>{if(await write(()=>S.db.doc("supplier_links/"+o.id).delete(),"انفك الربط"))m.remove()}}
function nearestTier(p,price){const ts=(p.tiers||[]).filter(t=>+t.price>0&&+t.qty>0);if(!ts.length)return null;return ts.find(t=>Math.abs(t.price-price)<0.011)||ts.slice().sort((a,b)=>Math.abs(a.price-price)-Math.abs(b.price-price))[0]}
function singleCost(p,price,rates){const t=nearestTier(p,price);const r=(rates||cfg().rates)[p.service];if(!t||!p.service||r==null)return null;return{cost:+t.qty/1000*(+r||0)+(+(p.extraCost||0)),qty:+t.qty}}
function prodCostOf(p){const pr=+p.price||+p.refPrice||0;if(p.type==="pack")return productUnitCost(p);const sc=singleCost(p,pr);return sc?sc.cost:pr*(+p.costPct||0)}
const sallaIdOf=(p)=>String(p.sallaId||p.id||"").replace(/^p/,"");
/* approximate speed: the panel's average time when it sends one, else what the service name says */
const AR_D=(s)=>String(s).replace(/[٠-٩]/g,d=>"٠١٢٣٤٥٦٧٨٩".indexOf(d));
function fmtDur(m){if(m==null||!isFinite(m))return"—";m=Math.round(m);if(m<1)return"فوري";const d=Math.floor(m/1440),h=Math.floor(m%1440/60),mi=m%60;const p=[];if(d)p.push(d+" يوم");if(h)p.push(h+" ساعة");if(mi&&!d)p.push(mi+" دقيقة");return p.join(" ")}

S.speeds={};let speedsLoading=false;
async function loadSpeeds(){if(speedsLoading||!S.db)return;speedsLoading=true;try{for(const s of SUPPLIERS.map(x=>x[0])){const d=await S.db.doc("speeds/"+s).get();if(d.exists)S.speeds[s]=d.data()}}catch(e){}refreshCatInfo();if(typeof fillSvcDetails==="function")fillSvcDetails();const q=$("#cat-q");if(q&&q.value.trim().length>1)runCatSearch()}
const SUP_HOST={drd3m:"https://drd3m.me",smmcpan:"https://smmcpan.com"};
const svcURL=(sup,id)=>SUP_HOST[sup]&&/^\d+$/.test(String(id))?`${SUP_HOST[sup]}/?select_service_id=${id}`:null;
function speedOf(it,qty,sup){const sp=S.speeds[sup||(it&&it.sup)];const pm=sp&&sp.m&&it?sp.m[String(it.id)]:null;if(pm!=null)return{min:+pm,src:"panel",at:sp.at};
  if(it&&it.avg_minutes!=null&&isFinite(it.avg_minutes))return{min:+it.avg_minutes,src:"panel"};
  const ms=it&&S.config&&S.config.manualSpeeds&&S.config.manualSpeeds[(sup||it.sup)+":"+String(it.id)];if(ms&&isFinite(ms.m))return{min:+ms.m,src:"manual",at:ms.at};
  return null}
function speedText(it,qty,sup){const s=speedOf(it,qty,sup);if(!s)return(sup||(it&&it.sup))==="smmcpan"?"غير متاحة من smmcpan":"غير متاحة";return fmtDur(s.min)+(s.src==="name"?" ~":"")}
function svcDetailHTML(x){const r=S.svc.get(x.supplier+":"+x.serviceId);const it=(r&&typeof r==="object")?r:null;
  if(!it){if(r==="missing")return`<span class="neg small">رقم الخدمة غير موجود عند ${esc(x.supplier)} — غالبًا انحذفت أو تغيّر رقمها</span>`;
    if(r==="error")return`<span class="neg small">${esc(S.supErr||"تعذّر جلب تفاصيل الخدمة")}</span>${x.name?` <span class="small">${esc(x.name)}</span>`:""}`;
    return S.mcp?`<span class="muted small"><i class="spin" style="width:11px;height:11px;vertical-align:middle"></i> أجيب تفاصيل الخدمة…</span>`:`<span class="small">${esc(x.name||"")}</span>`}
  const changed=x.rate_sar&&Math.abs(it.rate_sar-x.rate_sar)/Math.max(it.rate_sar,1e-9)>0.01;
  const chip=(l,v,cls)=>`<span class="sd-chip ${cls||""}"><small>${l}</small><b class="n">${v}</b></span>`;
  return`<div class="sd-name">${svcURL(x.supplier,x.serviceId)?`<a class="svc-open" href="${esc(svcURL(x.supplier,x.serviceId))}" target="_blank" rel="noopener noreferrer">${esc(it.name)} <span>↗</span></a>`:esc(it.name)}</div><div class="sd-cat muted small">${esc(it.category||"")}</div>
   <div class="sd-chips">${chip("سعر الألف",`${fmt(it.rate_sar,4)} ر.س`,"cy")}${chip("بالدولار",`$${fmt(it.rate,4)}`)}${chip("أقل كمية",fmt(it.min))}${chip("أعلى كمية",it.max>=1e9?"مفتوح":fmt(it.max))}${chip("التعويض",it.refill?"فيه":"ما فيه",it.refill?"ok":"")}${chip("الإلغاء",it.cancel?"متاح":"غير متاح")}${chip("السرعة التقريبية",esc(speedText(it,x.qty,x.supplier)),"sp")}</div>${(()=>{const s=speedOf(it,x.qty,x.supplier);if(s&&s.src==="panel")return`<div class="muted small" style="margin-top:4px">متوسط وقت التنفيذ من موقع ${esc(x.supplier)}${s.at?` · تحديث ${esc(s.at)}`:""}</div>`;
    if(s&&s.src==="manual")return`<div class="muted small" style="margin-top:4px">كتبتها أنت من موقع ${esc(x.supplier)} · ${esc(s.at||"")} · <button type="button" class="linkbtn" data-act="spd-set" data-sup="${esc(x.supplier)}" data-id="${esc(x.serviceId)}" data-name="${esc(it.name||"")}">تحديث</button></div>`;
    if(!s)return`<div style="margin-top:6px"><button type="button" class="btn sm ghost" data-act="spd-set" data-sup="${esc(x.supplier)}" data-id="${esc(x.serviceId)}" data-name="${esc(it.name||"")}">${ic("plus")}اكتب السرعة من موقع ${esc(x.supplier)}</button></div>`;return s&&s.src==="name"?`<div class="muted small" style="margin-top:4px">السرعة تقديرية من وصف الخدمة${s.start!=null?` · البدء ${esc(fmtDur(s.start))}`:""}${s.perDay?` · ${fmt(s.perDay)} باليوم`:""}</div>`:""})()}
   ${changed?`<div class="small pk-t">تغيّر السعر عند المورد من ${fmt(x.rate_sar,4)} إلى ${fmt(it.rate_sar,4)} — يتحدّث تلقائيًا</div>`:""}
   ${x.qty&&(x.qty<it.min||x.qty>it.max)?`<div class="neg small">الكمية ${fmt(x.qty)} خارج حدود الخدمة</div>`:""}`}
function prodDetailHTML(p){if(!p)return emptyState("اختر منتج","اضغط على منتج من القائمة يطلع لك تفاصيله وقواعده.");
  const R=S._pR||{byProd:{}};const pr=+p.price||+p.refPrice||0,rules=p.rules||[],cost=prodCostOf(p),fee=feeOf(pr),net=pr-cost-fee,m=pr?net/pr:0,sold=(R.byProd[p.name]||{}).qty||0;
  const pack=p.type==="pack";const hist=(p.rulesHistory||[]);const last=hist.length?hist[hist.length-1].from:null;
  const tierQty=!pack&&p.tiers&&p.tiers.length?((p.tiers.find(t=>Math.abs(t.price-pr)<0.011)||p.tiers[0]).qty):null;
  const box=(l,v,cls)=>`<div class="pd-box"><small>${l}</small><b class="n ${cls||""}">${v}</b></div>`;
  return`<div class="pd-head"><div><h2>${esc(p.name)}</h2><div class="muted small n">${esc(sallaIdOf(p))}</div></div>
    <div class="row" style="gap:8px">${pack?'<span class="tag cy">بكج</span>':'<span class="tag">منفرد</span>'}
    <button class="btn sm ghost" data-act="prod-edit" data-id="${esc(p.id)}">${ic("edit")}تعديل</button><button class="btn sm danger" data-act="prod-del" data-id="${esc(p.id)}">${ic("trash")}حذف</button></div></div>
   <div class="pd-grid">${box("النوع",pack?"بكج":"منفرد")}${box("السعر",`${fmt(pr,2)} ر.س`)}${box("تكلفة المورد",`${fmt(cost,2)} ر.س`)}${box("رسوم سلة",`${fmt(fee,2)} ر.س`)}${box("صافي الوحدة",`${fmt(net,2)} ر.س`,net<0?"neg":"pos")}${box("الهامش",`${fmt(m*100,0)}%`)}${box("انباع بالفترة",fmt(sold))}${box("الكمية المطلوبة",fmt(prodComps(p).reduce((a,x)=>a+(+x.qty||0),0)))}</div>
   <div class="pd-rules"><div class="pd-rh"><div><h3 style="margin:0">مكونات المنتج والخدمات</h3><div class="muted small">الخدمات من «خدمات المورد» فوق. غيّرها هناك وتتحدث هنا لكل المنتجات.</div></div><button class="btn sm ghost" data-act="prod-edit" data-id="${esc(p.id)}">${ic("edit")}الكميات</button></div>
   ${(()=>{const comps=prodComps(p);if(!comps.length)return`<div class="note">ما حددت كميات لهذا المنتج. اضغط «الكميات» وحطها.</div>`;
     return`<div class="rule-cards">${comps.map((x,i)=>{const c=x.qty?x.qty/1000*(+x.rate_sar||0):null;
     return`<div class="rule-card"><div class="rc-top"><span class="rc-no n">${i+1}</span><div class="rc-svc"><b>${esc(RULE_NAME[x.type]||x.type)}</b><span class="muted small n">#${esc(x.serviceId)}</span></div>
      <div class="rc-kv"><small>المورد</small><b>${esc(x.supplier)}</b></div><div class="rc-kv"><small>الكمية</small><b class="n">${x.qty?fmt(x.qty):"—"}</b></div><div class="rc-kv"><small>التكلفة</small><b class="n">${c!=null?fmt(c,4):"—"}</b></div></div>
      <div class="rc-detail" data-i="${i}">${svcDetailHTML(x)}</div></div>`}).join("")}</div>
     <div class="rule-total">المجموع: <b class="n">${fmt(cost,4)}</b> ر.س${+p.extraCost?` (يشمل ${fmt(+p.extraCost,2)} تكلفة إضافية)`:""}</div>`})()}</div></div>`}
function prodComps(p){const SV=svcMap(),rt=cfg().rates;const mk=(t,q)=>({type:t,supplier:SV[t].sup,serviceId:SV[t].id,qty:q,rate_sar:+rt[t]||0});
  if(p.type==="pack"){const c=p.contents||{};return SVC_TYPES.map(([k])=>k).filter(k=>+c[k]).map(k=>mk(k,+c[k]))}
  if(p.service&&SV[p.service]){const pr=+p.price||+p.refPrice||0;const t=(p.tiers||[]).find(t=>Math.abs(t.price-pr)<0.011)||(p.tiers||[])[0];return[mk(p.service,t?+t.qty:0)]}return[]}
function fillSvcDetails(){const el=$("#pdDetail");if(!el)return;const p=productsList().find(x=>x.id===S.selProd);if(!p)return;
  prodComps(p).forEach((x,i)=>{const k=x.supplier+":"+x.serviceId;const paint=()=>{const d=el.querySelector(`.rc-detail[data-i="${i}"]`);if(d)d.innerHTML=svcDetailHTML(x)};
    if(!S.svc.has(k)||S.svc.get(k)==="error"){const pr=lookupSvc(x.supplier,x.serviceId);if(pr&&pr.then)pr.then(paint);else setTimeout(paint,50)}else paint()})}
document.addEventListener("submit",(e)=>{if(e.target&&e.target.id==="ownForm"){e.preventDefault();const amount=+$("#ow-a").value,date=$("#ow-d").value;if(!(amount>0)||!date)return;write(()=>S.db.collection("owner_moves").doc().set({kind:$("#ow-k").value,amount:Math.round(amount*100)/100,date,note:$("#ow-n").value.trim().slice(0,80),at:new Date().toISOString()}),"انسجّلت")}},true);
document.addEventListener("submit",(e)=>{if(e.target&&e.target.id==="xpForm"){e.preventDefault();const title=$("#ex-t2").value.trim(),kind=$("#ex-k").value,date=$("#ex-d").value;if(!title||!date)return;write(()=>S.db.collection("experiments").doc().set({title:title.slice(0,80),kind,date,at:new Date().toISOString()}),"انسجّلت التجربة")}},true);
document.addEventListener("change",(e)=>{if(e.target&&e.target.id==="sim-p"){S.simId=e.target.value;S.simPrice=null;const c=$("#simCard");if(c)c.outerHTML=simulatorCard()}});
let simT;document.addEventListener("input",(e)=>{if(e.target&&e.target.id==="sim-v"){S.simId=$("#sim-p").value;S.simPrice=e.target.value;clearTimeout(simT);simT=setTimeout(()=>{const c=$("#simCard");if(c){const pos=e.target.selectionStart;c.outerHTML=simulatorCard();const v=$("#sim-v");if(v){v.focus();try{v.setSelectionRange(pos,pos)}catch(x){}}}},350)}});
document.addEventListener("input",(e)=>{if(e.target&&e.target.id==="pl-q"){const q=e.target.value.trim();document.querySelectorAll(".pl-item").forEach(b=>b.hidden=q&&!b.textContent.includes(q))}});
function selectProd(id){S.selProd=id;const el=$("#pdDetail");if(!el)return;el.innerHTML=prodDetailHTML(productsList().find(x=>x.id===id));
  document.querySelectorAll(".pl-item").forEach(b=>b.classList.toggle("on",b.dataset.id===id));fillSvcDetails();
  if(innerWidth<=1100)el.scrollIntoView({behavior:"smooth",block:"start"})}

function simulatorCard(){const ps=productsList();if(!ps.length)return"";const sel=S.simId&&ps.find(p=>p.id===S.simId)||ps[0];const u=prodUnit(sel);
  const np=S.simPrice!=null&&S.simId===sel.id?+S.simPrice:u.pr;const nfee=feeOf(np),nnet=np-u.cost-nfee;const t=riyadhToday();const R30=calc(addDays(t,-29),t);const sold=(R30.byProd[sel.name]||{}).qty||0;
  return`<div class="card" id="simCard"><h3>محاكي الأسعار <small>جرّب سعر جديد وشوف الأثر، ما يغيّر شي في المتجر</small></h3>
   <div class="form"><div class="field"><label for="sim-p">المنتج</label><select class="inp" id="sim-p">${ps.map(p=>`<option value="${esc(p.id)}" ${p.id===sel.id?"selected":""}>${esc(p.name)}</option>`).join("")}</select></div>
   <div class="field"><label for="sim-v">السعر الجديد (ر.س)</label><input class="inp n" id="sim-v" type="number" step="0.01" min="0" value="${esc(np)}"></div></div>
   <div class="pd-grid" style="margin-top:12px"><div class="pd-box"><small>السعر الحالي</small><b class="n">${fmt(u.pr,2)}</b></div><div class="pd-box"><small>الصافي الحالي للطلب</small><b class="n">${fmt(u.net,2)}</b></div>
   <div class="pd-box"><small>الصافي الجديد للطلب</small><b class="n ${nnet>=u.net?"pos":"neg"}">${fmt(nnet,2)}</b></div><div class="pd-box"><small>الهامش الجديد</small><b class="n">${np?fmt(nnet/np*100,0):"—"}%</b></div>
   <div class="pd-box"><small>انباع آخر 30 يوم</small><b class="n">${fmt(sold)}</b></div><div class="pd-box"><small>فرق الربح الشهري بنفس الكمية</small><b class="n ${nnet-u.net>=0?"pos":"neg"}">${fmt((nnet-u.net)*sold,2)}</b></div>
   <div class="pd-box"><small>أقصى تكلفة إعلان للطلب</small><b class="n">${fmt(nnet,2)}</b></div><div class="pd-box"><small>طلبات تعوّض فرق السعر</small><b class="n">${nnet>0&&u.net>0&&nnet<u.net?fmt(Math.ceil(sold*u.net/nnet)-sold):"—"}</b></div></div>
   <div class="muted small" style="margin-top:8px">الحساب يفترض نفس عدد الطلبات. لو رفعت السعر ممكن تقل الطلبات، ولو نزلته ممكن تزيد.</div></div>`}
const tabOn=(route,key)=>S.route===route&&((S.tabs&&S.tabs[route])||(PAGE_TABS[route]||[[null]])[0][0])===key;
function couponsCard(r){const k=`coup:${r.from}:${r.to}`;if(S.mcp&&tabOn("products","offers"))sallaRep("reports_sales_by",{dimension:"coupon",from_date:r.from,to_date:r.to,limit:50},k);const rows=((extData(k)||{}).rows)||[];
  return`<div class="card"><h3>أداء الكوبونات <small>${esc(r.label)}</small></h3>${loadingRow(k,"أجيب الكوبونات…")}
   ${rows.length?`<div class="tbl-wrap"><table class="rsp"><thead><tr><th>الكوبون</th><th class="n">الطلبات</th><th class="n">المبيعات</th><th class="n">الخصم</th><th></th></tr></thead><tbody>${rows.map(x=>{const full=x.details&&x.details.coupon_type==="P"&&+x.details.coupon_amount>=100;return`<tr><td data-label="الكوبون"><b>${esc(x.label||"")}</b> <span class="muted small">${x.details?(x.details.coupon_type==="P"?fmt(+x.details.coupon_amount)+"%":fmt(+x.details.coupon_amount,2)+" ر.س"):""}</span></td><td class="n" data-label="الطلبات">${fmt(+x.orders||0)}</td><td class="n" data-label="المبيعات">${fmt(+x.sales||0,2)}</td><td class="n neg" data-label="الخصم">${fmt(+x.discount||0,2)}</td><td data-label="تنبيه">${full?'<span class="tag pk">خصم 100% · الطلب مجاني</span>':""}</td></tr>`}).join("")}</tbody></table></div>`:(extData(k)?`<div class="muted small">ما انستخدم أي كوبون في الفترة.</div>`:"")}</div>`}
function cartsCard(r){const k=`carts:${r.from}:${r.to}`;if(S.mcp&&tabOn("products","offers"))sallaRep("reports_carts_summary",{from_date:r.from,to_date:r.to},k);const t=((extData(k)||{}).totals)||null;
  return`<div class="card"><h3>السلات المتروكة <small>${esc(r.label)}</small></h3>${loadingRow(k,"أجيب السلات…")}${t?`<div class="pd-grid"><div class="pd-box"><small>سلات متروكة</small><b class="n">${fmt(+t.abandoned_carts||0)}</b></div><div class="pd-box"><small>قيمتها</small><b class="n">${fmt(+t.abandoned_value||0,2)}</b></div><div class="pd-box"><small>رجعوا اشتروا</small><b class="n">${fmt(+t.recovered_carts||0)} (${fmt(+t.recovered_rate||0,0)}%)</b></div><div class="pd-box"><small>متوسط السلة</small><b class="n">${fmt(+t.average_cart_value||0,2)}</b></div></div>
   <div class="muted small" style="margin-top:8px">من كل ${fmt(+t.carts||0)} سلة انفتحت، ${fmt(+t.abandoned_carts||0)} انتركت. فعّل رسائل السلات المتروكة في سلة عشان ترجع أكثر.</div>`:""}</div>`}
function supplierPerfCard(){const L=Object.values(S.links||{});if(!L.length)return`<div class="card"><h3>أداء المزود</h3><div class="muted small">يحتاج أرقام طلبات المورد على طلبات سلة (وسم مثل drd3m-123456) أو ربط يدوي من صفحة الطلبات. لما تتوفر تطلع هنا نسبة الاكتمال والجزئي والملغي لكل مزود.</div></div>`;
  const by={};L.forEach(x=>{const s=x.supplier||"?";by[s]=by[s]||{n:0,done:0,part:0,canc:0,charge:0};const b=by[s];b.n++;const st=x.status||"";if(/Completed/.test(st))b.done++;else if(/Partial/.test(st))b.part++;else if(/Cancel|Refund/.test(st))b.canc++;b.charge+=+x.charge_sar||0});
  return`<div class="card"><h3>أداء المزود <small>من الطلبات المربوطة</small></h3><div class="tbl-wrap"><table class="rsp"><thead><tr><th>المزود</th><th class="n">طلبات</th><th class="n">مكتمل</th><th class="n">جزئي</th><th class="n">ملغي</th><th class="n">خصم فعلي</th></tr></thead><tbody>${Object.entries(by).map(([s,b])=>`<tr><td data-label="المزود">${esc(s)}</td><td class="n" data-label="طلبات">${fmt(b.n)}</td><td class="n" data-label="مكتمل">${fmt(b.done)} (${fmt(b.n?b.done/b.n*100:0,0)}%)</td><td class="n" data-label="جزئي">${fmt(b.part)}</td><td class="n ${b.canc?"neg":""}" data-label="ملغي">${fmt(b.canc)}</td><td class="n" data-label="خصم فعلي">${fmt(b.charge,2)}</td></tr>`).join("")}</tbody></table></div></div>`}

const FIND_Q={views:"تيك مشاهدات",likes:"تيك لايكات",shares:"تيك شير",saves:"تيك حفظ"};
function cheaperCard(){const SV=svcMap(),rt=cfg().rates;if(!S.mcp)return"";const rows=[];const on=tabOn("products","suppliers");
  SVC_TYPES.forEach(([k,l])=>{const ck=SV[k].sup+":"+SV[k].id;if(on&&!S.svc.has(ck))lookupSvc(SV[k].sup,SV[k].id);const cur=S.svc.get(ck);const curObj=cur&&typeof cur==="object"?cur:null;
    const curRate=+rt[k]||0;const curRefill=curObj?!!curObj.refill:false;const curSp=curObj?speedOf(curObj,1000,SV[k].sup):null;const curT=curSp&&(curSp.src==="panel"||curSp.src==="manual")?curSp.min:null;
    const found=[];SUPPLIERS.forEach(([s])=>{const key=`find2:${s}:${k}`;if(on)sallaFreeExt(key,s,FIND_Q[k],k);const d=extData(key);((d&&d.items)||[]).forEach(it=>found.push({...it,sup:s}))});
    const cands=found.filter(it=>it.rate_sar!=null&&it.rate_sar>0&&it.rate_sar<curRate*0.98&&String(it.id)!==String(SV[k].id)&&(+it.min||0)<=100&&(!curRefill||it.refill))
      .map(it=>{const sp=speedOf(it,1000,it.sup);return{...it,t:sp&&(sp.src==="panel"||sp.src==="manual")?sp.min:null}}).filter(it=>it.t!=null);
    let better;
    if(curT!=null){better=cands.filter(it=>it.t<curT*0.9).map(it=>({...it,score:(1-it.rate_sar/curRate)+(1-it.t/curT)})).sort((a,b)=>b.score-a.score).slice(0,3)}
    else better=cands.sort((a,b)=>a.t-b.t||a.rate_sar-b.rate_sar).slice(0,3);
    rows.push({k,l,curRate,curRefill,curT,better})});
  const loading=SVC_TYPES.some(([k])=>SUPPLIERS.some(([s])=>{const e=S.ext[`find2:${s}:${k}`];return e&&e.loading}));
  return`<div class="card"><h3>صائد الخدمة الأرخص والأسرع <small>بدائل أرخص من خدمتك وسرعتها التقريبية أسرع · نفس الحد الأدنى والتعويض</small></h3>
   ${loading?`<div class="muted small"><i class="spin" style="width:12px;height:12px;vertical-align:middle"></i> أدور عند المزودين…</div>`:""}
   ${rows.map(x=>`<div class="cheap-row"><div class="cheap-h"><b>${esc(x.l)}</b><span class="muted small">خدمتك: <b class="n">${fmt(x.curRate,4)}</b> للألف · ⏱ <b>${x.curT!=null?esc(fmtDur(x.curT)):"غير معروفة"}</b>${x.curRefill?" · فيها تعويض":""}</span></div>
     ${x.curT==null&&x.better.length?`<div class="muted small" style="margin-bottom:6px">سرعة خدمتك الحالية غير معروفة، فهذي الأرخص اللي سرعتها معروفة، مرتبة من الأسرع.</div>`:""}
     ${x.better.length?x.better.map(it=>{const save=(1-it.rate_sar/x.curRate)*100;const faster=x.curT!=null?x.curT-it.t:null;
       return`<div class="li" style="grid-template-columns:minmax(0,1fr) auto"><div style="min-width:0"><a class="svc-open" href="${esc(svcURL(it.sup,it.id)||"#")}" target="_blank" rel="noopener noreferrer">${esc(String(it.name).slice(0,90))} ↗</a><div class="muted small"><span class="tag">${esc(it.sup)}</span> رقم <b class="n">${esc(it.id)}</b> · أقل ${fmt(it.min)}${it.refill?" · تعويض":""}</div>
        <div class="row" style="gap:6px;margin-top:6px"><span class="tag cy n">أرخص ${fmt(save,0)}%</span><span class="tag sp">⏱ ${esc(fmtDur(it.t))}${faster!=null&&faster>0?` · أسرع بـ ${esc(fmtDur(faster))}`:""}</span></div></div>
        <div style="text-align:left"><b class="n pos">${fmt(it.rate_sar,4)}</b><div class="muted small">للألف</div><button class="btn sm ghost" style="margin-top:6px" data-act="use-svc" data-k="${x.k}" data-sup="${esc(it.sup)}" data-id="${esc(it.id)}">جرّبها</button></div></div>`}).join("")
      :`<div class="muted small">${loading?"":x.curT!=null?"ما لقيت خدمة أرخص وأسرع بنفس الشروط. خدمتك الحالية أفضل خيار حاليًا.":"ما لقيت بديل أرخص سرعته معروفة."}</div>`}</div>`).join("")}
   <div class="note" style="margin-top:10px">السرعة التقريبية من موقع دكتور دعم وتتحدث كل يوم. خدمات smmcpan تظهر هنا بس إذا كتبت سرعتها بنفسك. جرّب أي خدمة على طلب صغير قبل تبدّل. زر «جرّبها» يحطها في «خدمات المورد»، وما تنحفظ إلا إذا ضغطت حفظ.</div></div>`}
const FIND_EX_ALL=["متوقف","صيانة","بث","لايف","Live","live","LIVE"];
const FIND_EX={views:["تليجرام","لايك","تنزيل","حفظ","شير"],likes:["تعليق","مشاهد","متابع"],shares:["مشاهد","لايك","متابع","بث"],saves:["مشاهد","لايك","متابع"]};
const findOk=(it,k)=>{const s=`${it.name} ${it.category||""}`;return![...FIND_EX_ALL,...(FIND_EX[k]||[])].some(w=>s.includes(w))};
function sallaFreeExt(key,sup,q,k){if(!S.mcp)return;ext(key,async()=>{const ex=[...FIND_EX_ALL,...(FIND_EX[k]||[])];let items=[];
  try{for(let off=0;off<100;off+=50){const r=await S.mcp.callTool(SUP,"supplier_services",{supplier:sup,query:q,exclude:ex,offset:off,limit:50},{cache:{staleTime:36e5,gcTime:864e5}});const p=r.payload||{};items=items.concat(p.items||[]);if(p.next_offset==null)break}}
  catch(e){const r=await S.mcp.callTool(SUP,"supplier_services",{supplier:sup,query:q,limit:50},{cache:{staleTime:36e5,gcTime:864e5}});items=(r.payload||{}).items||[]}
  return{items:items.filter(it=>findOk(it,k))}},6*36e5)}
function pageProducts(){
  const r=range(),R=calc(r.from,r.to),c=cfg(),ps=productsList();
  const seen=Object.keys(R.byProd).filter(n=>!findProduct(n));
  const SV=svcMap();setTimeout(ensureCatalog,0);
  const PP={};for(const o of R.orders){const c=orderCost(o),its=o.items||[];const prof=o.amount-c.cost-feeOf(o.amount);its.forEach(it=>{PP[it.name]=(PP[it.name]||0)+prof/(its.length||1)})}
  const profOf=(p)=>PP[p.name]!=null?PP[p.name]:0;
  const bestId=(ps.map(p=>({id:p.id,v:profOf(p)})).sort((a,b)=>b.v-a.v)[0]||{}).id;
  return`${supplierCard()}${topupCard()}${supUsageCard()}<div class="card"><h3>خدمات المورد وأسعارها <small>اكتب رقم الخدمة ويطلع سعرها لكل 1,000 تلقائي</small></h3>
   <form id="ratesForm" class="svc-list">${SVC_TYPES.map(([k,l])=>`<div class="svc-row">
     <div class="svc-t">${l}</div>
     <div class="field"><label for="sv-sup-${k}">المزود</label><select class="inp" id="sv-sup-${k}" data-svc="${k}">${SUPPLIERS.map(s=>`<option value="${s[0]}" ${SV[k].sup===s[0]?"selected":""}>${s[1]}</option>`).join("")}</select></div>
     <div class="field"><label for="sv-id-${k}">رقم الخدمة</label><input class="inp n" id="sv-id-${k}" data-svc="${k}" inputmode="numeric" maxlength="8" value="${esc(SV[k].id||"")}"></div>
     <div class="field"><label for="rt-${k}">سعر الألف (ر.س) <span class="muted small">يتعبّى تلقائي</span></label><input class="inp n" id="rt-${k}" type="number" step="0.0001" min="0" value="${esc(c.rates[k])}" ${S.mcp?"readonly":""}></div>
     <div class="svc-info" id="sv-info-${k}">${catInfoHTML(SV[k].sup,SV[k].id,c.rates[k])}</div></div>`).join("")}
   <div class="row"><button class="btn pri" type="submit">${ic("save")}حفظ الخدمات والأسعار</button><span class="muted small" id="catStamp"></span></div></form>
   <div class="note" style="margin-top:12px">لما تغير خدمة أو سعر، الطلبات القديمة تبقى بأسعارها وقتها، والجديدة بس تنحسب بالسعر الجديد. والطلب المربوط برقم طلب المورد ياخذ تكلفته الفعلية من المورد.</div>
   ${(()=>{const h=((S.config&&S.config.rateHistory)||[]).slice().reverse();if(h.length<2)return"";return`<h3 style="margin-top:16px">سجل تغيير الخدمات</h3><div class="tbl-wrap"><table><thead><tr><th>من تاريخ</th><th class="n">مشاهدات</th><th class="n">لايكات</th><th class="n">شير</th><th class="n">حفظ</th><th>الخدمات</th></tr></thead><tbody>${h.map((e,i)=>`<tr><td class="n">${e.from.startsWith("2000")?"البداية":esc(e.from)}${i===0?' <span class="tag cy">الحالي</span>':""}</td>${SVC_TYPES.map(([k])=>`<td class="n">${fmt(e.rates[k],4)}</td>`).join("")}<td class="small">${SVC_TYPES.map(([k,l])=>e.services&&e.services[k]?`${l}: ${esc(e.services[k].sup)} #${esc(e.services[k].id)}`:"").filter(Boolean).join(" · ")}</td></tr>`).join("")}</tbody></table></div>`})()}</div>
  <div class="card"><h3>ابحث في خدمات المزودين <small>برقم الخدمة أو بكلمة مثل «لايك» أو «مشاهدات»</small></h3>
   <div class="form"><div class="field"><label for="cat-q">بحث</label><input class="inp" id="cat-q" placeholder="مثال: 10816 أو لايكات تيك توك" autocomplete="off"></div>
   <div class="field"><label for="cat-sup">المزود</label><select class="inp" id="cat-sup"><option value="">الكل</option>${SUPPLIERS.map(s=>`<option value="${s[0]}">${s[1]}</option>`).join("")}</select></div>
   <div class="field"><label for="cat-sort">الترتيب</label><select class="inp" id="cat-sort"><option value="price">الأرخص أول</option><option value="time">الأسرع أول</option><option value="best">الأرخص والأسرع</option></select></div></div>
   <div id="cat-res" class="list" style="margin-top:12px"></div></div>
  ${seen.length?`<div class="alert pk"><i class="ic"></i><div>منتجات انباعت وما لها تكلفة: ${seen.map(n=>`<button class="btn sm ghost" data-act="prod-new" data-name="${esc(n)}">${esc(n)} ${ic("plus")}</button>`).join(" ")}</div></div>`:""}
  <div class="card"><h3>تكلفة المنتجات <small>تلقائي من الخدمات الأربع فوق، ما تحتاج تعدل شي</small></h3>
   ${ps.length?`<div class="tbl-wrap"><table class="wide"><thead><tr><th>المنتج</th><th>النوع</th><th class="n">السعر</th><th>المحتوى</th><th class="n">تكلفة المورد</th><th class="n">رسوم سلة</th><th class="n">صافي الوحدة</th><th>الهامش</th><th class="n">انباع (${esc(r.label)})</th><th class="n">أقصى تكلفة إعلان للطلب</th><th class="n">ربح الفترة</th></tr></thead><tbody>${ps.map(p=>{
     const pr=+p.price||+p.refPrice||0,hasR=p.rules&&p.rules.length,cost=prodCostOf(p),fee=feeOf(pr),net=pr-cost-fee,m=pr?net/pr:0,sold=(R.byProd[p.name]||{}).qty||0;const ct=p.contents||{};
     return`<tr><td>${esc(p.name)}</td><td>${p.type==="pack"?'<span class="tag cy">بكج</span>':'<span class="tag">منفرد</span>'}</td><td class="n">${fmt(pr,2)}${p.type!=="pack"?' <span class="muted small">مرجعي</span>':""}</td><td class="small">${hasR?`<div class="rules-mini">${p.rules.map(x=>`<div><b>${esc(RULE_NAME[x.type]||x.type)}</b> ${p.type==="pack"?`<span class="n">${fmt(x.qty)}</span> · `:""}${esc(x.supplier)} <span class="n">#${esc(x.serviceId)}</span> · <span class="n">${fmt(x.rate_sar,4)}</span></div>`).join("")}</div>${p.needsReview?'<span class="tag pk">راجع القواعد</span>':""}`:p.type==="pack"?[["views","مشاهدة"],["likes","لايك"],["shares","شير"],["saves","حفظ"]].filter(([k])=>+ct[k]).map(([k,l])=>`<span class="n">${fmt(ct[k])}</span> ${l}`).join(" · "):(p.tiers&&p.tiers.length?(()=>{const t=nearestTier(p,pr);const rt=cfg().rates[p.service];return`${t?`<span class="n">${fmt(t.qty)}</span> ${esc(({views:"مشاهدة",likes:"لايك",shares:"شير",saves:"حفظ"})[p.service]||"")} بـ <span class="n">${fmt(t.price,2)}</span> · `:""}سعر الألف <span class="n">${fmt(rt,4)}</span><div class="muted small">${p.tiers.length} كمية، وتكلفة كل طلب من كميته الفعلية في الفاتورة</div>`})():`تكلفة <span class="n">${fmt((+p.costPct||0)*100,1)}%</span> من السعر`)}</td><td class="n">${fmt(cost,2)}</td><td class="n">${fmt(fee,2)}</td><td class="n ${net<0?"neg":"pos"}">${fmt(net,2)}</td><td style="min-width:120px"><div class="row" style="flex-wrap:nowrap"><div class="bar" style="flex:1"><i data-w="${Math.max(0,m*100)}"></i></div><b class="n">${fmt(m*100,0)}%</b></div></td><td class="n">${fmt(sold)}</td><td class="n" data-label="أقصى تكلفة إعلان للطلب"><b>${fmt(net,2)}</b></td><td class="n ${profOf(p)>0?"pos":profOf(p)<0?"neg":""}" data-label="ربح الفترة">${fmt(profOf(p),2)}${p.id===bestId&&profOf(p)>0?' <span class="tag cy">الأربح</span>':""}</td></tr>`}).join("")}</tbody></table></div>`:emptyState("ما فيه منتجات","أضف منتجاتك وتكلفتها.")}
   <div class="note" style="margin-top:12px">غيّر رقم خدمة اللايكات أو الشير أو الحفظ أو المشاهدات فوق، وتتحدث تكلفة كل المنتجات لحالها. الطلبات القديمة تبقى على سعرها وقتها.</div></div>${simulatorCard()}${couponsCard(r)}${cartsCard(r)}${supplierPerfCard()}${cheaperCard()}${priceChangesCard()}`;
}
function supplierState(){if(S.supBal){const low=cfg().supplierLow||20;const vals=Object.values(S.supBal).filter(b=>b&&b.balance_sar!=null);if(vals.length){const bal=vals.reduce((a,b)=>a+b.balance_sar,0);return{has:true,real:true,bal,low:vals.some(b=>b.balance_sar<low),tx:S.supplier,lows:vals.filter(b=>b.balance_sar<low)}}}const tx=S.supplier.slice().sort((a,b)=>(a.date+(a.createdAt||"")).localeCompare(b.date+(b.createdAt||"")));
  const snaps=tx.filter(x=>x.type==="snapshot");const last=snaps[snaps.length-1];const t=riyadhToday();
  if(!last)return{has:false,tx};const after=tx.filter(x=>x.type==="topup"&&(x.date>last.date||(x.date===last.date&&(x.createdAt||"")>(last.createdAt||""))));
  const top=after.reduce((a,b)=>a+(+b.amount||0),0);const from=addDays(last.date,1);const used=from<=t?calc(from,t).T.cost:0;
  const bal=(+last.amount||0)+top-used;return{has:true,tx,last,top,used,bal,low:bal<=(cfg().supplierLow||20)}}

/* daily supplier spend from real orders (last 7 days) split by the supplier of each service */
function supplierDaily(){const t=riyadhToday(),from=addDays(t,-6),SV=svcMap(),out={};SUPPLIERS.forEach(([k])=>out[k]=0);
  for(const o of ordersIn(from,t)){const RT=ratesAt(o.day+" "+(o.t||"00:00"));for(const it of (o.items||[])){const p=findProduct(it.name);if(!p)continue;const n=it.qty||1;
    if(p.type==="pack"){const c=p.contents||{};SVC_TYPES.forEach(([k])=>{if(+c[k])out[SV[k].sup]=(out[SV[k].sup]||0)+(+c[k])/1000*(+RT[k]||0)*n})}
    else if(p.service&&SV[p.service]){const iq=S.oq[o.id]&&(S.oq[o.id].items||[]).find(x=>x.name===it.name);const q=iq?+iq.q:((nearestTier(p,o.amount/n)||{}).qty||0);out[SV[p.service].sup]=(out[SV[p.service].sup]||0)+q/1000*(+RT[p.service]||0)*n}}}
  for(const k in out)out[k]=out[k]/7;return out}
function runwayOf(k){const b=S.supBal&&S.supBal[k];if(!b||b.balance_sar==null)return null;const d=supplierDaily()[k]||0;return{daily:d,days:d>0?b.balance_sar/d:Infinity,bal:b.balance_sar}}

/* a balance that goes up means the account was topped up (or an order was refunded by the supplier) */
let topupBusy=false;
async function detectTopups(){const wd=extData("wk:topups");if(wd&&Array.isArray(wd.topups))return;if(topupBusy||!S.db||!S.supBal||S.canWrite===false||!S.supbal)return;topupBusy=true;
  try{const prev=S.supbal||{};const next={...prev};let changed=false;const t=riyadhToday();
    for(const [k,b] of Object.entries(S.supBal)){if(!b||b.balance_sar==null)continue;const now=Math.round(b.balance_sar*100)/100;const was=prev[k]&&prev[k].sar;
      if(was!=null&&now-was>=0.5){const amt=Math.round((now-was)*100)/100;await S.db.doc(`supplier/topup-${k}-${t}-${Math.round(now*100)}`).set({type:"topup",supplier:k,amount:amt,date:t,auto:true,note:"تلقائي: ارتفع الرصيد من "+was.toFixed(2)+" إلى "+now.toFixed(2),createdAt:new Date().toISOString()})}
      if(was==null||Math.abs(now-was)>=0.01){next[k]={sar:now,at:new Date().toISOString()};changed=true}}
    if(changed){S.supbal=next;await S.db.doc("meta/supbal").set(next)}}
  catch(e){console.warn("topup",e)}finally{topupBusy=false}}

/* the connector's own 15-minute log (version 2.0): top-ups, daily usage, price changes */
function wk(tool,args,key,ttl){if(!S.mcp)return;return ext(key,async()=>{const r=await S.mcp.callTool(SUP,tool,args,{cache:false});return r.payload},ttl||10*6e4)}
const wkOff=(k)=>{const e=S.ext[k];return!!(e&&e.err&&!e.data&&!["server_unavailable","rate_limited","timeout"].includes(e.code))};
const wkWhy=(k)=>{const e=S.ext[k]||{};if(/FLASH_KV/.test(e.err||""))return"السجل التلقائي مو مفعّل في Cloudflare: يحتاج ربط KV باسم FLASH_KV و Cron كل 15 دقيقة.";
  return`أدوات السجل الجديدة في موصل Flash Suppliers مو مسموحة في Claude للحين. افتح <a href="https://claude.ai/customize/connectors" target="_blank" rel="noopener noreferrer">إعدادات الموصلات</a> ← Flash Suppliers ← واسمح للأدوات: supplier_topups و supplier_daily و supplier_price_changes و supplier_log_status. لو ما ظهرت، افصل الموصل واربطه من جديد.`};
function supUsageCard(){const t=riyadhToday(),from=addDays(t,-29);const k=`wk:daily:${from}`;if(tabOn("products","services"))wk("supplier_daily",{from,to:t},k,15*6e4);
  const d=extData(k);const rows=(d&&d.days)||[];const off=wkOff(k);
  if(off)return`<div class="card"><h3>استهلاك المزودين يوميًا</h3><div class="alert pk"><i class="ic"></i><div>${wkWhy(k)}</div></div></div>`;
  if(!rows.length)return`<div class="card"><h3>استهلاك المزودين يوميًا</h3>${loadingRow(k,"أجيب السجل…")||`<div class="muted small">السجل بدأ للحين. أول يوم كامل يطلع بكرة.</div>`}</div>`;
  const sups=[...new Set(rows.map(r=>r.supplier))];const days=[];for(let i=29;i>=0;i--)days.push(addDays(t,-i));
  const mx=Math.max(0.01,...rows.map(r=>+r.used||0));
  return`<div class="card"><h3>استهلاك المزودين يوميًا <small>كم نزل الرصيد كل يوم · آخر 30 يوم · من سجل الموصل</small></h3>
   ${sups.map(s=>{const by={};rows.filter(r=>r.supplier===s).forEach(r=>by[r.date]=r);const tot=Object.values(by).reduce((a,r)=>a+(+r.used||0),0);const nd=Object.keys(by).length||1;
     return`<div style="margin-bottom:12px"><div class="row" style="justify-content:space-between"><b>${esc(s)}</b><span class="muted small">المجموع <b class="n">${fmt(tot,2)}</b> · المتوسط <b class="n">${fmt(tot/nd,2)}</b> باليوم</span></div>
      <div class="ubars">${days.map(dd=>{const r=by[dd];const u=r?+r.used||0:0;return`<i title="${esc(dd)}: ${fmt(u,2)} ر.س${r&&+r.topup?` · شحن ${fmt(+r.topup,2)}`:""}" style="height:${r?Math.max(3,u/mx*100):0}%" class="${r&&+r.topup?"tp":""}"></i>`}).join("")}</div></div>`}).join("")}
   <div class="row small" style="gap:14px"><span><i class="lg-d" style="background:var(--cy)"></i> استهلاك</span><span><i class="lg-d" style="background:var(--pk)"></i> يوم فيه شحن</span></div></div>`}
function priceChangesCard(){const k="wk:px";if(tabOn("products","suppliers"))wk("supplier_price_changes",{},k,30*6e4);const d=extData(k);if(wkOff(k))return`<div class="card"><h3>تغيّر أسعار خدماتك عند المورد</h3><div class="alert pk"><i class="ic"></i><div>${wkWhy(k)}</div></div></div>`;const L=(d&&d.changes)||[];
  return`<div class="card"><h3>تغيّر أسعار خدماتك عند المورد <small>يفحصها الموصل كل يوم</small></h3>${loadingRow(k,"أجيب السجل…")}
   ${L.length?`<div class="list">${L.slice(0,15).map(x=>`<div class="li" style="grid-template-columns:minmax(0,1fr) auto"><div><b>${esc(x.supplier)} #${esc(x.id)}</b> <span class="muted small">${esc(x.date)} · ${esc(String(x.name||"").slice(0,60))}</span></div><span class="n ${x.after_sar>x.before_sar?"neg":"pos"}">${fmt(x.before_sar,4)} ← <b>${fmt(x.after_sar,4)}</b> (${x.change_pct>0?"+":""}${fmt(x.change_pct,1)}%)</span></div>`).join("")}</div>`:(d?`<div class="muted small">ما تغيّر سعر أي خدمة من خدماتك من بداية السجل.</div>`:"")}</div>`}
function topupCard(){const t=riyadhToday(),ms=monthStart(t),pm=addMonths(ms,-1),pe=monthEnd(pm);const wkKey="wk:topups";if(tabOn("products","services"))wk("supplier_topups",{},wkKey,5*6e4);
  const wkData=extData(wkKey);const fromWk=!!(wkData&&Array.isArray(wkData.topups));
  const L=[...(S.supplier||[]).filter(x=>x.type==="topup"&&!(fromWk&&x.auto)),...(fromWk?wkData.topups.map(x=>({type:"topup",supplier:x.supplier,amount:x.amount_sar,date:x.date,createdAt:x.at,time:x.time||"",wk:true,note:`${fmt(x.before_sar,2)} ← ${fmt(x.after_sar,2)}`})):[])];
  const supOf=(x)=>x.supplier||x.sup;const sum=(k,a,b)=>L.filter(x=>supOf(x)===k&&x.date>=a&&x.date<=b).reduce((s,x)=>s+(+x.amount||0),0);
  const sups=[...new Set([...SUPPLIERS.map(s=>s[0]),...L.map(supOf).filter(Boolean)])];
  const recent=L.slice().sort((a,b)=>String(b.date).localeCompare(String(a.date))||String(b.createdAt||"").localeCompare(String(a.createdAt||""))).slice(0,8);
  const tot=(a,b)=>sups.reduce((s,k)=>s+sum(k,a,b),0);
  return`<div class="card"><h3>شحن المزودين <small>${esc(mLabel(ms))} و${esc(mLabel(pm))}</small><button class="btn sm cy" type="button" data-act="sup-add">${ic("plus")}سجّل شحن</button></h3>
   <div class="tbl-wrap"><table class="rsp"><thead><tr><th>المزود</th><th class="n">${esc(mLabel(ms))}</th><th class="n">${esc(mLabel(pm))}</th><th class="n">صرف الطلبات هالشهر</th></tr></thead><tbody>
   ${sups.map(k=>{const used=supplierUsed(k,ms,t);return`<tr><td data-label="المزود"><b>${esc(k)}</b></td><td class="n" data-label="${esc(mLabel(ms))}"><b>${fmt(sum(k,ms,t),2)}</b></td><td class="n" data-label="${esc(mLabel(pm))}">${fmt(sum(k,pm,pe),2)}</td><td class="n" data-label="صرف الطلبات هالشهر">${fmt(used,2)}</td></tr>`}).join("")}
   <tr><td data-label="المزود"><b>المجموع</b></td><td class="n" data-label="${esc(mLabel(ms))}"><b>${fmt(tot(ms,t),2)}</b></td><td class="n" data-label="${esc(mLabel(pm))}"><b>${fmt(tot(pm,pe),2)}</b></td><td class="n" data-label="صرف الطلبات هالشهر"><b>${fmt(sups.reduce((s,k)=>s+supplierUsed(k,ms,t),0),2)}</b></td></tr></tbody></table></div>
   ${recent.length?`<div class="list" style="margin-top:10px">${recent.map(x=>`<div class="li" style="grid-template-columns:minmax(0,1fr) auto auto"><div><b>${esc(supOf(x))}</b> <span class="muted small">${esc(x.date)}${x.wk?` · ${esc(x.time)} · سجّلها الموصل (${esc(x.note)})`:x.auto?" · سجّلها التطبيق لما ارتفع الرصيد":" · سجّلتها أنت"}</span></div><b class="n pos">+${fmt(+x.amount||0,2)}</b>${x.wk?"<span></span>":`<button class="btn sm danger" type="button" data-act="sup-del" data-id="${esc(x.id)}" aria-label="حذف">${ic("trash")}</button>`}</div>`).join("")}</div>`:""}
   <div class="note" style="margin-top:10px">${fromWk?"الموصل يفحص الرصيد كل 15 دقيقة ويسجّل أي ارتفاع كشحن (أو استرجاع من المورد)، حتى والتطبيق مقفل.":"المزود ما يعطي سجل الشحن، فالتطبيق يسجّل الشحن تلقائي لما يلاحظ إن الرصيد ارتفع، بالمبلغ اللي زاد."} الشحن اللي صار قبل اليوم أو والتطبيق مقفل لفترة طويلة، سجّله بزر «سجّل شحن». الشحن ما ينحسب مصروف، لأن تكلفة المورد محسوبة من الطلبات نفسها.</div></div>`}
/* what the orders cost at each supplier in a date range (same split as the runway) */
function supplierUsed(k,from,to){const SV=svcMap();let s=0;
  for(const o of ordersIn(from,to)){const RT=ratesAt(o.day+" "+(o.t||"00:00"));for(const it of (o.items||[])){const p=findProduct(it.name);if(!p)continue;const n=it.qty||1;
    if(p.type==="pack"){const c=p.contents||{};SVC_TYPES.forEach(([t])=>{if(+c[t]&&SV[t].sup===k)s+=(+c[t])/1000*(+RT[t]||0)*n})}
    else if(p.service&&SV[p.service]&&SV[p.service].sup===k){const iq=S.oq[o.id]&&(S.oq[o.id].items||[]).find(x=>x.name===it.name);const q=iq?+iq.q:((nearestTier(p,o.amount/n)||{}).qty||0);s+=q/1000*(+RT[p.service]||0)*n}}}
  return s}
function supplierCard(){if(S.supBal){const low=cfg().supplierLow||20;const items=SUPPLIERS.map(([k,l])=>({k,l,b:S.supBal[k]}));
    return`<div class="card"><h3>رصيد المورد <small><span class="src"><i></i>مباشر من المزودين · ${esc(ago(new Date(S.supBalAt).toISOString()))}</span></small></h3><div class="grid g2" style="gap:12px">${items.map(x=>x.b&&x.b.error?`<div class="li"><div><div class="t">${esc(x.l)}</div><div class="s neg">${esc(x.b.error)}</div></div></div>`:x.b?`<div class="kpi" style="position:relative;padding:14px;border-radius:16px;background:rgba(var(--ink-rgb),.45);border:1px solid var(--line)"><div class="l">${esc(x.l)}</div><div class="v ${x.b.balance_sar!=null&&x.b.balance_sar<low?"neg":""}">${money(x.b.balance_sar??x.b.balance,2)}<small>${x.b.balance_sar!=null?"ر.س":esc(x.b.currency)}</small></div><div class="d"><span class="n">${fmt(x.b.balance,2)} ${esc(x.b.currency)}</span> ${(()=>{const rw=runwayOf(x.k);return rw?`<div class="muted small" style="margin-top:6px">صرفك اليومي عنده تقريبًا <b class="n">${fmt(rw.daily,2)}</b> ر.س · ${isFinite(rw.days)?`يكفي <b class="n ${rw.days<3?"neg":""}">${rw.days<1?"أقل من يوم":fmt(rw.days,rw.days<10?1:0)+" يوم"}</b>`:"ما فيه صرف آخر 7 أيام"}</div>`:""})()}${x.b.balance_sar!=null&&x.b.balance_sar<low?'<span class="tag pk">قرب يخلص، اشحن</span>':'<span class="tag cy">كافي</span>'}</div></div>`:"").join("")}</div>
    <div class="row" style="margin-top:10px"><span class="muted small">التنبيه إذا الرصيد أقل من <b class="n">${fmt(low)}</b> ر.س</span><button class="btn sm ghost" data-act="sup-low">تغيير الحد</button></div></div>`}
  const s=supplierState();
  return`<div class="card"><h3>رصيد المورد <button class="btn sm cy" data-act="sup-add">${ic("plus")}حركة جديدة</button></h3>
  ${s.has?`<div class="grid g3" style="gap:10px"><div class="kpi"><div class="l">الرصيد المتوقع الحين</div><div class="v ${s.low?"neg":""}">${money(s.bal,2)}<small>ر.س</small></div><div class="d">${s.low?'<span class="tag pk">قرب يخلص</span>':'<span class="tag cy">كافي</span>'}</div></div>
   <div class="kpi"><div class="l">آخر رصيد سجلته</div><div class="v" style="font-size:20px">${money(s.last.amount,2)}</div><div class="d">${esc(s.last.date)}</div></div>
   <div class="kpi"><div class="l">من بعده: شحن − استهلاك الطلبات</div><div class="v" style="font-size:20px"><span class="n pos">+${fmt(s.top,2)}</span> <span class="n neg">−${fmt(s.used,2)}</span></div></div></div>`:emptyState("سجّل رصيدك الحالي عند المورد","بعدها النظام يخصم تكلفة كل طلب لحاله، وينبهك إذا قرب يخلص.")}
  ${s.tx.length?`<div class="tbl-wrap" style="margin-top:12px"><table><thead><tr><th>التاريخ</th><th>النوع</th><th>المورد</th><th class="n">المبلغ</th><th>ملاحظة</th><th></th></tr></thead><tbody>${s.tx.slice().reverse().slice(0,30).map(x=>`<tr><td class="n">${esc(x.date)}</td><td>${x.type==="topup"?'<span class="tag cy">شحن</span>':'<span class="tag">رصيد فعلي</span>'}</td><td>${esc(x.supplier||"")}</td><td class="n">${fmt(x.amount,2)}</td><td style="white-space:normal">${esc(x.note||"")}</td><td><button class="btn sm danger" data-act="sup-del" data-id="${esc(x.id)}" aria-label="حذف">${ic("trash")}</button></td></tr>`).join("")}</tbody></table></div>`:""}
  <div class="note" style="margin-top:10px">شحن الرصيد ما ينحسب مصروف، لأن تكلفة المورد محسوبة من الطلبات نفسها. سجّل «رصيد فعلي» من لوحة المورد كل فترة عشان يتصحح الحساب.</div></div>`}
function supModal(){const t=riyadhToday();const m=modal(`<h3>حركة رصيد المورد</h3><form class="form" id="supForm">
  <div class="field"><label for="sp-type">النوع</label><select class="inp" id="sp-type"><option value="snapshot">رصيد فعلي من لوحة المورد</option><option value="topup">شحن رصيد</option></select></div>
  <div class="field"><label for="sp-date">التاريخ</label><input class="inp" id="sp-date" type="date" required value="${t}"></div>
  <div class="field"><label for="sp-sup">المورد</label><select class="inp" id="sp-sup"><option>drd3m</option><option>smmcpan</option><option>آخر</option></select></div>
  <div class="field"><label for="sp-amt">المبلغ (ر.س)</label><input class="inp n" id="sp-amt" type="number" step="0.01" min="0" required></div>
  <div class="field" style="grid-column:1/-1"><label for="sp-note">ملاحظة</label><input class="inp" id="sp-note" maxlength="100"></div>
  <div class="field"><label for="sp-low">نبهني إذا الرصيد أقل من</label><input class="inp n" id="sp-low" type="number" min="0" value="${esc(cfg().supplierLow||20)}"></div>
  <div class="row" style="grid-column:1/-1"><button class="btn pri" type="submit">${ic("save")}حفظ</button><button class="btn ghost" type="button" data-close>إلغاء</button></div></form>`);
  m.querySelector("#supForm").onsubmit=async(e)=>{e.preventDefault();const b=e.submitter;if(b)b.disabled=true;const g=(i)=>m.querySelector("#"+i).value;
    const doc={type:g("sp-type"),date:g("sp-date"),supplier:g("sp-sup"),amount:Math.round((+g("sp-amt")||0)*100)/100,note:g("sp-note").trim(),createdAt:new Date().toISOString()};
    const dup=S.supplier.find(x=>x.type===doc.type&&x.date===doc.date&&+x.amount===doc.amount&&x.supplier===doc.supplier);
    if(dup&&!m._dupOk){m._dupOk=true;toast("فيه حركة مطابقة بنفس اليوم. اضغط حفظ مرة ثانية إذا هي جديدة","err");if(b)b.disabled=false;return}
    const low=+g("sp-low");const ok=await write(async()=>{await S.db.doc("supplier/"+uid()).set(doc);if(low!==(cfg().supplierLow||20))await setConfig({supplierLow:low})},"انحفظت الحركة");if(ok)m.remove();else if(b)b.disabled=false}}

/* money left from one order before ads (price - supplier - Salla fee) */
function contribOf(T){return T.orders?(T.rev-T.cost-T.fees)/T.orders:NaN}
function prodUnit(p){const pr=+p.price||+p.refPrice||0,cost=prodCostOf(p),fee=feeOf(pr);return{pr,cost,fee,net:pr-cost-fee}}
const hBar=(v,max,cls="")=>`<div class="bar ${cls}" style="min-width:60px"><i data-w="${max>0?Math.max(0,Math.min(100,v/max*100)):0}"></i></div>`;
function loadingRow(k,msg){const e=S.ext[k];if(!S.mcp)return`<div class="muted small">الربط غير متاح في هذا العرض.</div>`;if(!e||e.loading&&!e.data)return`<div class="muted small"><i class="spin" style="width:12px;height:12px;vertical-align:middle"></i> ${esc(msg||"أجيب البيانات…")}</div>`;if(e.err&&!e.data)return`<div class="neg small">${esc(e.err)}</div>`;return""}

function campaignCard(r,R){const k=`tt:AUCTION_CAMPAIGN:${r.from}:${r.to}`;if(S.mcp&&tabOn("ads","campaigns"))ttLevel("AUCTION_CAMPAIGN",r.from,r.to);const list=extData(k)||[];
  const BE=contribOf(R.T);const by={};
  for(const o of R.orders){const camp=o.attr&&o.attr.ch==="tiktok"?(o.attr.camp||"(حملة غير معروفة)"):null;if(!camp)continue;const c=orderCost(o);by[camp]=by[camp]||{n:0,rev:0,prof:0};by[camp].n++;by[camp].rev+=o.amount;by[camp].prof+=o.amount-c.cost-feeOf(o.amount)}
  const rows=list.map(x=>({name:x.campaign_name,spend:+x.spend||0,pur:+x.complete_payment||0,ctr:+x.ctr||0,clk:+x.clicks||0,imp:+x.impressions||0,reach:+x.reach||0,freq:+x.frequency||0,cpc:+x.cpc||0,cpm:+x.cpm||0,lpv:+x.total_landing_page_view||0,vplay:+x.video_play_actions||0,avgPlay:+x.average_video_play||0,full:+x.video_views_p100||0,likes:+x.likes||0,shares:+x.shares||0,visits:+x.profile_visits||0}));
  const names=new Set(rows.map(x=>x.name));Object.keys(by).forEach(n=>{if(!names.has(n))rows.push({name:n,spend:0,pur:0,ctr:0,clk:0,imp:0})});
  rows.forEach(x=>{const s=by[x.name]||{n:0,rev:0,prof:0};x.n=s.n;x.rev=s.rev;x.profit=s.prof-x.spend;x.cpa=s.n?x.spend/s.n:(x.spend>0?Infinity:NaN)});
  const shown=rows.filter(x=>x.spend>0||x.n>0).sort((a,b)=>b.spend-a.spend);const pend=R.orders.filter(o=>!o.attr).length;
  const flag=(x)=>{const f=[];if(x.ctr>15&&x.clk>50)f.push('<span class="tag pk">ضغطات مشبوهة</span>');if(x.spend>0&&!x.n)f.push('<span class="tag pk">ولا طلب</span>');else if(isFinite(BE)&&x.cpa>BE)f.push('<span class="tag pk">تخسّر</span>');else if(x.n&&x.profit>0)f.push('<span class="tag cy">تربّح</span>');return f.join(" ")};
  return`<div class="card"><h3>كل حملة: مبيعاتها الحقيقية من سلة <small>${esc(r.label)}</small></h3>
   <div class="note" style="margin-bottom:10px">كل الأرقام هنا من سلة: الطلبات والمبيعات حسب الحملة المسجّلة على كل طلب، والصرف بس من تيك توك. ROAS = مبيعات سلة ÷ الصرف. الحملة تربّح إذا تكلفة الطلب أقل من <b class="n">${isFinite(BE)?fmt(BE,2):"—"}</b> ر.س (اللي يبقى لك من الطلب قبل الإعلان).${pend?` · <span class="muted">${pend} طلب لسه ما انعرف مصدره، يتحدد خلال دقائق.</span>`:""}</div>
   ${loadingRow(k,"أجيب الحملات من تيك توك…")}
   ${shown.length?`<div class="camp-list">${shown.map(x=>{const conv=x.clk?x.n/x.clk*100:NaN;const kv=(l,v)=>`<div class="ck"><small>${l}</small><b class="n">${v}</b></div>`;
     return`<div class="camp"><div class="camp-h"><b>${esc(x.name)}</b><span>${flag(x)}</span></div>
      <div class="camp-g">${kv("الصرف",fmt(x.spend,2))}${kv("طلبات سلة",fmt(x.n))}${kv("مبيعات سلة",fmt(x.rev,2))}${kv("ROAS (سلة)",x.spend?fmt(x.rev/x.spend,2)+"x":"—")}${kv("تكلفة الطلب",isFinite(x.cpa)?fmt(x.cpa,2):x.cpa===Infinity?"∞":"—")}${kv("الربح بعد الإعلان",`<span class="${x.profit<0?"neg":"pos"}">${fmt(x.profit,2)}</span>`)}</div>
      ${x.imp?`<div class="camp-g sub">${kv("الظهور",fmt(x.imp))}${kv("الوصول",fmt(x.reach))}${kv("التكرار",fmt(x.freq,2))}${kv("الضغطات",fmt(x.clk))}${kv("CTR",fmt(x.ctr,2)+"%")}${kv("تكلفة الضغطة",fmt(x.cpc,2))}${kv("تكلفة 1,000 ظهور",fmt(x.cpm,2))}${kv("زيارات الصفحة",fmt(x.lpv))}${kv("تحويل الضغطة لطلب",isFinite(conv)?fmt(conv,1)+"%":"—")}${kv("مشاهدات الفيديو",fmt(x.vplay))}${kv("متوسط المشاهدة",fmt(x.avgPlay,1)+" ث")}${kv("كملوا الفيديو",fmt(x.full))}${kv("لايكات / شير",fmt(x.likes)+" / "+fmt(x.shares))}${kv("زيارات الحساب",fmt(x.visits))}${kv("تيك توك سجّل شراء",fmt(x.pur))}</div>`:""}</div>`}).join("")}</div>`:(S.ext[k]&&S.ext[k].data?emptyState("ما فيه حملات بصرف في الفترة","غيّر الفترة."):"")}</div>`}
function creativeCard(r){const k=`tt:AUCTION_AD:${r.from}:${r.to}`;if(S.mcp&&tabOn("ads","campaigns"))ttLevel("AUCTION_AD",r.from,r.to);const list=(extData(k)||[]).map(x=>({name:x.ad_name,camp:x.campaign_name,spend:+x.spend||0,pur:+x.complete_payment||0,ctr:+x.ctr||0})).filter(x=>x.spend>0);
  list.forEach(x=>x.cpa=x.pur?x.spend/x.pur:Infinity);list.sort((a,b)=>(a.cpa-b.cpa)||(b.pur-a.pur));
  return`<div class="card"><h3>أفضل الفيديوهات <small>من تيك توك · سلة تسجّل اسم الحملة بس، ما تسجّل الفيديو</small></h3>${loadingRow(k,"أجيب الإعلانات…")}
   ${list.length?`<div class="tbl-wrap"><table class="rsp"><thead><tr><th>الإعلان</th><th>الحملة</th><th class="n">الصرف</th><th class="n">مشتريات</th><th class="n">تكلفة الشراء</th><th class="n">CTR</th></tr></thead><tbody>${list.slice(0,10).map((x,i)=>`<tr><td data-label="الإعلان">${i===0&&x.pur?'<span class="tag cy">الأفضل</span> ':""}${esc(String(x.name||"").slice(0,60))}</td><td data-label="الحملة" class="small">${esc(String(x.camp||"").slice(0,40))}</td><td class="n" data-label="الصرف">${fmt(x.spend,2)}</td><td class="n" data-label="مشتريات">${fmt(x.pur)}</td><td class="n ${x.pur?"":"neg"}" data-label="تكلفة الشراء">${x.pur?fmt(x.cpa,2):"ولا شراء"}</td><td class="n" data-label="CTR">${fmt(x.ctr,2)}%${x.ctr>15?' <span class="tag pk">مشبوه</span>':""}</td></tr>`).join("")}</tbody></table></div>`:""}</div>`}

function losingCampaigns(){if(!S.mcp)return[];const t=riyadhToday(),y=addDays(t,-1),out=[];
  const days=[y,t].map(d=>{const k=`tt:AUCTION_CAMPAIGN:${d}:${d}`;ttLevel("AUCTION_CAMPAIGN",d,d);return{d,list:extData(k)}});if(days.some(x=>!x.list))return[];
  const R=calc(addDays(t,-29),t);const BE=contribOf(R.T);if(!isFinite(BE))return[];
  const names=new Set();days.forEach(x=>x.list.forEach(c=>{if(+c.spend>0)names.add(c.campaign_name)}));
  names.forEach(n=>{const per=days.map(x=>{const c=x.list.find(z=>z.campaign_name===n);const sp=c?+c.spend||0:0;const os=ordersIn(x.d,x.d).filter(o=>o.attr&&o.attr.ch==="tiktok"&&o.attr.camp===n).length;return{sp,os,cpa:os?sp/os:(sp>0?Infinity:0)}});
    if(per.every(p=>p.sp>3&&p.cpa>BE))out.push({name:n,spend:per[0].sp+per[1].sp,orders:per[0].os+per[1].os})});return out}

function ttHour(day){const key=`tth:${day}`;if(S.mcp&&tabOn("ads","hours"))ext(key,async()=>{const res=await S.mcp.callTool(TIKTOK,"report_integrated_get",{advertiser_id:cfg().tiktokAdvertiser,report_type:"BASIC",data_level:"AUCTION_ADVERTISER",dimensions:["advertiser_id","stat_time_hour"],metrics:["spend"],start_date:day,end_date:day,page_size:48},{cache:{staleTime:36e5,gcTime:864e5}});const p=res.payload||{};if(p.code&&p.code!==0)throw new Error(p.message||"TikTok");return((p.data&&p.data.list)||[]).map(x=>({h:+String((x.dimensions||{}).stat_time_hour||"").slice(11,13),sp:+((x.metrics||{}).spend)||0}))},day===riyadhToday()?15*6e4:864e5);return extData(key)}
function hoursCard(){const t=riyadhToday();const sp=Array(24).fill(0),od=Array(24).fill(0);let have=0;
  for(let i=1;i<=7;i++){const d=addDays(t,-i);const L=ttHour(d);if(L){have++;L.forEach(x=>{if(x.h>=0&&x.h<24)sp[x.h]+=x.sp})}}
  ordersIn(addDays(t,-29),t).forEach(o=>{const h=+String(o.t||"0").slice(0,2)||0;od[h]++});
  const totSp=sp.reduce((a,b)=>a+b,0),totO=od.reduce((a,b)=>a+b,0);const mxS=Math.max(1,...sp),mxO=Math.max(1,...od);
  const waste=[];for(let h=0;h<24;h++){if(totSp&&sp[h]/totSp>=0.03&&od[h]===0)waste.push(h)}
  const lbl=(h)=>h===0?"12ص":h<12?h+"ص":h===12?"12م":(h-12)+"م";
  return`<div class="card"><h3>ساعات الإعلان <small>الصرف آخر 7 أيام ضد الطلبات آخر 30 يوم · بتوقيت الرياض</small></h3>
   ${have<7&&S.mcp?`<div class="muted small"><i class="spin" style="width:12px;height:12px;vertical-align:middle"></i> أجيب الصرف بالساعة (${have} من 7 أيام)…</div>`:""}
   <div class="hours">${sp.map((v,h)=>`<div class="hcol" title="${lbl(h)}: صرف ${fmt(v,2)} · ${od[h]} طلب"><i class="hs" style="height:${(v/mxS*100).toFixed(0)}%"></i><i class="ho" style="height:${(od[h]/mxO*100).toFixed(0)}%"></i><span>${h%3===0?lbl(h):""}</span></div>`).join("")}</div>
   <div class="row small" style="gap:14px;margin-top:6px"><span><i class="lg-d" style="background:var(--pk)"></i> الصرف</span><span><i class="lg-d" style="background:var(--cy)"></i> الطلبات</span></div>
   ${waste.length?`<div class="alert pk" style="margin-top:10px"><i class="ic"></i><div>الساعات ${waste.map(lbl).join("، ")} فيها صرف ${fmt(waste.reduce((a,h)=>a+sp[h],0),2)} ريال (آخر 7 أيام) وما جات فيها ولا طلب آخر 30 يوم. جرّب توقف الإعلان فيها من «جدولة الإعلان» في إعدادات المجموعة الإعلانية بتيك توك.</div></div>`:(have?`<div class="muted small" style="margin-top:8px">ما فيه ساعات واضحة تصرف بدون طلبات.</div>`:"")}</div>`}
function pageAds(){
  const r=range(),R=calc(r.from,r.to),T=R.T,c=cfg(),b=c.adBudget,g=goals(),t=riyadhToday();
  const ttO=R.orders.filter(o=>o.attr&&o.attr.ch==="tiktok"),ttN=ttO.length,ttRev=ttO.reduce((a,o)=>a+o.amount,0),ttRoas=T.adsAll?ttRev/T.adsAll:NaN;
  const bIn=calc(b.start,b.end<t?b.end:t).T;const used=b.start<=t?bIn.adsAll:0;const plannedDays=diffDays(b.start,b.end)+1;
  const last14=calc(addDays(t,-13),t).T;let sug=b.daily,why="";
  if(!isFinite(last14.roas)){why="ما فيه صرف إعلاني في آخر 14 يوم للحكم.";}
  else if(last14.roas>=g.roasUp&&last14.margin>=g.margin){sug=b.daily*(1+g.stepUp);why=`العائد ${fmt(last14.roas,2)}x والهامش ${fmt(last14.margin*100,0)}% فوق الحد، فالقاعدة تقترح رفع ${fmt(g.stepUp*100,0)}%.`}
  else if(last14.roas>=g.roasHold){why=`العائد ${fmt(last14.roas,2)}x: القاعدة تقترح التثبيت حتى يوصل ${fmt(g.roasUp,1)}x مع هامش ${fmt(g.margin*100,0)}%.`}
  else{why=`العائد ${fmt(last14.roas,2)}x أقل من ${fmt(g.roasHold,1)}x: القاعدة تقترح عدم الرفع.`}
  return`<div class="grid g4">${kpi("صرف الإعلانات",T.adsAll,{dec:2,dot:"#FF3D7F",d:srcTag(0,1)+(T.adsManual?` · أخرى ${fmt(T.adsManual,2)}`:"")})}${kpi("العائد على الإعلان ROAS",T.roas,{unit:"x",dec:2,dot:"#00E5D4",d:"كل مبيعات سلة ÷ صرف الإعلان"})}${kpi("تكلفة الطلب CPA",T.cpa,{dec:2,d:"صرف الإعلان ÷ طلبات سلة"})}${kpi("ROAS طلبات تيك توك",ttRoas,{unit:"x",dec:2,d:`مبيعات سلة الجاية من تيك توك (${fmt(ttN)} طلب) ÷ الصرف`})}</div>
  <div class="grid g4">${kpi("الظهور",T.imp,{unit:""})}${kpi("الضغطات",T.clk,{unit:""})}${kpi("نسبة الضغط CTR",T.ctr*100,{unit:"%",dec:2})}${kpi("تكلفة 1,000 ظهور CPM",T.cpm,{dec:2})}</div>
  <div class="grid g21">
   <div class="card"><h3>الصرف مقابل المبيعات يوم بيوم <small>${esc(r.label)}</small></h3>${T.adsAll||T.rev?lineChart({labels:R.days.map(d=>dLabel(d)),series:[{name:"مبيعات سلة",vals:R.days.map(d=>R.D[d].rev),color:"#00E5D4",area:true},{name:"الإعلان",vals:R.days.map(d=>R.D[d].ads),color:"#FF3D7F"}]}):emptyState("ما فيه صرف إعلاني في الفترة","")}<div class="legend"><span><i style="background:#00E5D4"></i>مبيعات سلة</span><span><i style="background:#FF3D7F"></i>الإنفاق الإعلاني</span></div></div>
   <div class="card"><h3>خطة الميزانية <small>${esc(b.start)} → ${esc(b.end)}</small></h3><div class="ring-wrap">${ring(used/b.total,fmt(used/b.total*100,0)+"%","مصروف من "+fmt(b.total))}<div class="list small"><div>المتبقي: <b class="n">${fmt(b.total-used,2)}</b></div><div>بمعدل صرف آخر 7 أيام تكفي: <b class="n">${(()=>{const w=calc(addDays(t,-6),t).T.adsAll/7;return w>0?fmt(Math.max(0,(b.total-used)/w),0)+" يوم":"—"})()}</b></div><div>اليومي: <b class="n">${fmt(b.daily,2)}</b></div><div>الخطة تحتاج <b class="n">${fmt(b.daily*plannedDays)}</b> لـ ${plannedDays} يوم ${b.daily*plannedDays>b.total?'<span class="tag pk">أعلى من الميزانية</span>':'<span class="tag cy">ضمن الميزانية</span>'}</div></div></div>
    <div class="note" style="margin-top:12px"><b>الميزانية اليومية المقترحة: <span class="n">${fmt(sug,2)}</span> ر.س</b><br>${esc(why)}<br><span class="muted">قاعدة محسوبة من آخر 14 يوم، والقرار لك. النظام ما يغيّر إعلاناتك.</span></div></div>
  </div>
  ${campaignCard(r,R)}${creativeCard(r)}${hoursCard()}
  <div class="card"><h3>تفاصيل الأيام</h3>${R.days.some(d=>R.D[d].ads)?`<div class="tbl-wrap"><table><thead><tr><th>اليوم</th><th class="n">الصرف</th><th class="n">الظهور</th><th class="n">الضغطات</th><th class="n">طلبات سلة (مؤكدة)</th><th class="n">مبيعات سلة</th><th class="n">ROAS</th></tr></thead><tbody>${R.days.slice().reverse().filter(d=>R.D[d].ads||R.D[d].orders).map(d=>{const a=S.ads[d]||{},x=R.D[d];return`<tr><td>${esc(dLabel(d))}</td><td class="n">${fmt(x.ads,2)}</td><td class="n">${fmt(a.impressions||0)}</td><td class="n">${fmt(a.clicks||0)}</td><td class="n">${fmt(x.orders)}</td><td class="n">${fmt(x.rev,2)}</td><td class="n">${x.ads?fmt(x.rev/x.ads,2)+"x":"—"}</td></tr>`}).join("")}</tbody></table></div>`:emptyState("ما فيه أيام فيها صرف","بعد مزامنة تيك توك تظهر الأيام هنا.")}</div>`;
}
function excludedCard(){const ids=((S.config&&S.config.excludedOrders)||[]).map(String);if(!ids.length)return"";const rows=[];
  for(const [day,doc] of Object.entries(S.salla))for(const o of Object.values(doc.orders||{}))if(ids.includes(String(o.id)))rows.push({...o,day});
  return`<div class="card"><h3>طلبات مستبعدة <small>ما تنحسب في المبيعات ولا التكاليف</small></h3><div class="list">${rows.map(o=>`<div class="li" style="grid-template-columns:minmax(0,1fr) auto"><div><div class="t">#${esc(o.ref)} · ${esc((o.items||[]).map(i=>i.name).join("، "))}</div><div class="s n">${esc(o.day)} ${esc(o.t||"")} · ${fmt(o.amount,2)} ر.س</div></div><button class="btn sm ghost" data-act="unexcl" data-id="${esc(o.id)}">إرجاع</button></div>`).join("")}</div></div>`}
function pageOrders(){
  const r=range(),R=calc(r.from,r.to);const q=S.ordersQ.trim();let os=R.orders;
  if(q)os=os.filter(o=>String(o.ref).includes(q)||(o.items||[]).some(i=>i.name.includes(q)));
  const per=25,pages=Math.max(1,Math.ceil(os.length/per));S.ordersPage=Math.min(S.ordersPage,pages);const slice=os.slice((S.ordersPage-1)*per,S.ordersPage*per);
  const st={completed:["تم التنفيذ","cy"],in_progress:["جاري التنفيذ","pk"],under_review:["بإنتظار المراجعة",""]};const comp=compByRef();
  return`<div class="grid g4">${kpi("الطلبات",R.T.orders,{unit:""})}${kpi("الإيرادات",R.T.rev,{dec:2})}${kpi("صافي الطلبات قبل الإعلان",R.T.rev-R.T.cost-R.T.fees,{dec:2,d:"الإيرادات − المنتجات − رسوم سلة"})}${kpi("متوسط الطلبات يوميًا",R.T.perDayOrders,{unit:"",dec:1})}</div>
  <div class="card"><h3>طلبات سلة <small>${esc(r.label)} · ${srcTag(1,0)} · الملغية والمسترجعة مستبعدة</small></h3>
   <div class="row" style="margin-bottom:10px"><span class="small muted">الربط السريع: اكتب رقم طلب المورد جنب الطلب واضغط Enter. المورد:</span><select class="inp" id="qlSup" style="min-height:36px;width:auto">${SUPPLIERS.map(s=>`<option value="${s[0]}" ${(cfg().quickSupplier||"drd3m")===s[0]?"selected":""}>${s[1]}</option>`).join("")}</select>
   <span class="tag cy">مربوط ${fmt(R.orders.filter(o=>S.links[o.id]).length)} من ${fmt(R.orders.length)}</span></div>
   <div class="row" style="margin-bottom:12px"><div class="field" style="flex:1;min-width:200px"><label for="oq" class="small">بحث برقم الطلب أو المنتج</label><input class="inp" id="oq" value="${esc(S.ordersQ)}" placeholder="مثال: 301418224 أو بكج التوفير"></div></div>
   ${slice.length?`<div class="tbl-wrap"><table><thead><tr><th>الطلب</th><th>التاريخ</th><th>المنتجات</th><th class="n">المبلغ</th><th class="n">رسوم سلة</th><th class="n">تكلفة المورد</th><th class="n">تعويض</th><th class="n">الصافي</th><th>الحالة</th><th>عند المورد</th><th></th></tr></thead><tbody>${slice.map(o=>{const c=orderCost(o),f=feeOf(o.amount),cp=comp[o.ref]||0,net=o.amount-c.cost-f-cp,s=st[o.status]||[o.sname||o.status,""];return`<tr><td class="n">#${esc(o.ref)}</td><td>${esc(dLabel(o.day))} <span class="muted n">${esc(o.t||"")}</span></td><td style="white-space:normal;min-width:160px">${esc((o.items||[]).map(i=>i.name+(i.qty>1?" ×"+i.qty:"")).join("، "))}${c.actual?' <span class="tag cy">تكلفة فعلية</span>':c.unknown?' <span class="tag pk">بدون تكلفة</span>':c.est?' <span class="tag">تقدير</span>':""}</td><td class="n">${fmt(o.amount,2)}${o.cur&&o.cur!=="SAR"?`<div class="muted small">دُفع بـ ${esc(o.cur)}</div>`:""}${o.refunded?`<div class="small neg">مسترجع ${fmt(o.refunded,2)}</div>`:""}</td><td class="n">${fmt(f,2)}</td><td class="n">${fmt(c.cost,2)}</td><td class="n ${cp?"neg":""}">${cp?fmt(cp,2):"—"}</td><td class="n ${net<0?"neg":"pos"}">${fmt(net,2)}</td><td><span class="tag ${s[1]}">${esc(s[0])}</span></td><td>${(()=>{const L=S.links[o.id];if(!L)return`<input class="inp n qlink" data-oid="${esc(o.id)}" inputmode="numeric" placeholder="رقم طلب المورد" aria-label="رقم طلب المورد للطلب ${esc(o.ref)}" style="min-height:36px;max-width:170px">`;const stt=L.status||"جاري الفحص";const cls=/Completed/.test(stt)?"cy":/Partial|Canceled|Refunded|غير موجود/.test(stt)?"pk":"";return`<span class="tag ${cls}">${esc(stt)}</span><div class="muted small n">${esc(L.supplier)} #${esc((L.ids||[]).join(", #"))}${L.auto?" · تلقائي":""}</div>`})()}</td><td><div class="row" style="flex-wrap:nowrap;gap:6px"><button class="btn sm ghost" data-act="lnk" data-id="${esc(o.id)}">${S.links[o.id]?"تعديل الربط":"ربط بالمورد"}</button><button class="btn sm ghost" data-act="comp" data-ref="${esc(o.ref)}">تعويض</button><button class="btn sm ghost" data-act="excl" data-id="${esc(o.id)}" title="ما ينحسب في المبيعات (مثل طلب اشتريته أنت)">استبعاد</button></div>${(()=>{const q=S.oq[o.id]&&(S.oq[o.id].items||[]).filter(x=>(o.items||[]).some(i=>i.name===x.name));return q&&q.length?`<div class="muted small">الكمية من الفاتورة: ${q.map(x=>`<b class="n">${fmt(x.q)}</b>`).join("، ")}</div>`:""})()}</td></tr>`}).join("")}</tbody></table></div>
   <div class="pager"><button class="btn sm ghost" data-act="pg" data-p="${S.ordersPage-1}" ${S.ordersPage<=1?"disabled":""}>السابق</button><span><span class="n">${S.ordersPage}</span> من <span class="n">${pages}</span> · <span class="n">${os.length}</span> طلب</span><button class="btn sm ghost" data-act="pg" data-p="${S.ordersPage+1}" ${S.ordersPage>=pages?"disabled":""}>التالي</button></div>`:emptyState("ما فيه طلبات مطابقة","غيّر الفترة أو البحث، أو اعمل مزامنة.")}</div>${excludedCard()}`;
}
function compByRef(){const m={};for(const e of S.expenses){if(e.category==="refund"&&e.orderRef){m[e.orderRef]=(m[e.orderRef]||0)+(+e.amount||0)}}return m}
function plRows(T){return[["الإيرادات",T.rev,"b"],["تكلفة المنتجات",-T.cost],["مجمل الربح",T.rev-T.cost,"b"],["رسوم سلة",-T.fees],["الإعلانات",-T.adsAll],["اشتراكات ثابتة",-T.rec],["مصروفات أخرى",-T.exp],["صافي الربح",T.net,"b net"],["هامش الربح",T.margin,"pct"]]}
function pagePnl(){
  const t=riyadhToday(),r=range();const cols=[{l:r.label+" (الفترة)",T:calc(r.from,r.to).T}];
  for(let i=0;i<3;i++){const s=addMonths(t,-i),e=i===0?t:monthEnd(s);cols.push({l:mLabel(s)+(i===0?" حتى اليوم":""),T:calc(s,e).T})}
  const rows=plRows(cols[0].T).map((_,ri)=>ri);const fcs=S.forecasts.slice().sort((a,b)=>a.month.localeCompare(b.month));
  return`<div class="card"><h3>قائمة الأرباح والخسائر <small>بيانات فعلية فقط</small></h3><div class="tbl-wrap"><table><thead><tr><th>البند</th>${cols.map(c=>`<th class="n">${esc(c.l)}</th>`).join("")}</tr></thead><tbody>${rows.map(ri=>{const x=plRows(cols[0].T)[ri];return`<tr style="${x[2]&&x[2].includes("b")?"font-weight:800;":""}${x[2]&&x[2].includes("net")?"background:rgba(255,61,127,.07)":""}"><td>${esc(x[0])}</td>${cols.map(c=>{const v=plRows(c.T)[ri][1];return x[2]==="pct"?`<td class="n">${isFinite(v)?fmt(v*100,1)+"%":"—"}</td>`:`<td class="n ${v<0?"neg":""}">${fmt(v,2)}</td>`}).join("")}</tr>`}).join("")}</tbody></table></div></div>
  <div class="card"><h3>التوقعات <span class="tag fc">منفصلة عن الفعلي</span> <button class="btn sm cy" data-act="fc-add">${ic("plus")}إضافة توقع</button></h3>
   ${fcs.length?`<div class="tbl-wrap"><table><thead><tr><th>الشهر</th><th class="n">مبيعات متوقعة</th><th class="n">الفعلي</th><th class="n">الفرق</th><th class="n">إعلان متوقع</th><th>ملاحظة</th><th></th></tr></thead><tbody>${fcs.map(f=>{const s=f.month+"-01",e=f.month===t.slice(0,7)?t:monthEnd(s),A=calc(s,e).T,has=s<=t;return`<tr><td>${esc(mLabel(s))}</td><td class="n">${fmt(f.sales,0)}</td><td class="n">${has?fmt(A.rev,0):"—"}</td><td class="n ${has&&A.rev<f.sales?"neg":"pos"}">${has?fmt(A.rev-f.sales,0):"—"}</td><td class="n">${fmt(f.ads||0,0)}</td><td style="white-space:normal">${esc(f.note||"")}</td><td><div class="row" style="flex-wrap:nowrap;gap:6px"><button class="btn sm ghost" data-act="fc-edit" data-id="${esc(f.id)}" aria-label="تعديل">${ic("edit")}</button><button class="btn sm danger" data-act="fc-del" data-id="${esc(f.id)}" aria-label="حذف">${ic("trash")}</button></div></td></tr>`}).join("")}</tbody></table></div>`:emptyState("ما فيه توقعات","أضف توقعك لكل شهر، ويتقارن بالفعلي بدون ما يختلط فيه.")}</div>`;
}

function customersCard(r,R){const all=ordersIn("2000-01-01",riyadhToday());const cnt={},spend={};all.forEach(o=>{const c=o.attr&&o.attr.cid;if(!c)return;cnt[c]=(cnt[c]||0)+1;spend[c]=(spend[c]||0)+o.amount});
  const inR=new Set(R.orders.map(o=>o.attr&&o.attr.cid).filter(Boolean));const ids=Object.keys(cnt);const rep=ids.filter(c=>cnt[c]>1);
  const known=R.orders.filter(o=>o.attr&&o.attr.cid).length;
  const k="ret:90";if(S.mcp&&tabOn("reports","customers"))sallaRep("reports_customers_returning",{period:"last_90_days",limit:10},k);const top=((extData(k)||{}).rows)||[];const ex=(S.config&&S.config.excludedCustomers)||[];
  return`<div class="card"><h3>العملاء <small>${esc(r.label)}</small></h3>
   <div class="pd-grid"><div class="pd-box"><small>عملاء الفترة</small><b class="n">${fmt(inR.size)}</b></div><div class="pd-box"><small>نسبة العملاء العائدين (كل الوقت)</small><b class="n">${ids.length?fmt(rep.length/ids.length*100,0):"—"}%</b></div>
   <div class="pd-box"><small>متوسط طلبات العميل</small><b class="n">${ids.length?fmt(all.filter(o=>o.attr&&o.attr.cid).length/ids.length,2):"—"}</b></div><div class="pd-box"><small>متوسط صرف العميل (كل الوقت)</small><b class="n">${ids.length?fmt(Object.values(spend).reduce((a,b)=>a+b,0)/ids.length,2):"—"}</b></div></div>
   ${known<R.orders.length?`<div class="muted small" style="margin-top:6px">العملاء معروفين لـ ${fmt(known)} من ${fmt(R.orders.length)} طلب، والباقي يتحدد تلقائي خلال دقائق.</div>`:""}
   <h3 style="margin-top:14px">أكثر العملاء رجوعًا <small>آخر 90 يوم · من سلة</small></h3>${loadingRow(k,"أجيب العملاء…")}
   ${top.length?`<div class="tbl-wrap"><table class="rsp"><thead><tr><th>العميل</th><th class="n">طلبات</th><th class="n">صرف</th><th></th></tr></thead><tbody>${top.map(x=>{const isEx=ex.includes(String(x.customer_id));return`<tr><td data-label="العميل">${esc(x.customer_name||"عميل")}</td><td class="n" data-label="طلبات">${fmt(+x.orders||0)}</td><td class="n" data-label="صرف">${fmt(+x.spend||0,2)}</td><td><button class="btn sm ghost" data-act="${isEx?"cust-in":"cust-ex"}" data-id="${esc(String(x.customer_id))}" title="لو هذا أنت أو حساب تجربة">${isEx?"إرجاع طلباته":"استبعاد طلباته"}</button></td></tr>`}).join("")}</tbody></table></div>`:""}</div>`}
function ratingsCard(){const k="rat:90";if(S.mcp&&tabOn("reports","customers"))sallaRep("reports_ratings_summary",{period:"last_90_days"},k);const t=((extData(k)||{}).totals)||null;
  return`<div class="card"><h3>التقييمات <small>آخر 90 يوم</small></h3>${loadingRow(k,"أجيب التقييمات…")}${t?`<div class="pd-grid"><div class="pd-box"><small>متوسط التقييم</small><b class="n ${+t.average_rating<3?"neg":"pos"}">${t.average_rating!=null?fmt(+t.average_rating,1)+" / 5":"—"}</b></div><div class="pd-box"><small>عدد التقييمات</small><b class="n">${fmt(+t.ratings||0)}</b></div><div class="pd-box"><small>إيجابية</small><b class="n pos">${fmt(+t.positive||0)}</b></div><div class="pd-box"><small>سلبية</small><b class="n ${+t.negative?"neg":""}">${fmt(+t.negative||0)}</b></div></div>
   ${+t.negative>0?`<div class="alert pk" style="margin-top:10px"><i class="ic"></i><div>فيه ${fmt(+t.negative)} تقييم سلبي. اقرأها ورد عليها من سلة ← التقييمات، لأنها تبين للعملاء الجدد قبل الشراء.</div></div>`:""}`:""}</div>`}
function peakCard(R){const g=Array.from({length:7},()=>Array(8).fill(0));R.orders.forEach(o=>{const w=toD(o.day).getUTCDay();const h=+String(o.t||"0").slice(0,2)||0;g[w][Math.floor(h/3)]++});
  const mx=Math.max(1,...g.flat());const dn=["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];const hs=["12ص-3","3-6","6-9","9-12م","12-3","3-6م","6-9م","9-12ل"];
  let best=[0,0];g.forEach((r,w)=>r.forEach((v,b)=>{if(v>g[best[0]][best[1]])best=[w,b]}));
  return`<div class="card"><h3>أوقات البيع <small>عدد الطلبات لكل يوم وفترة · بتوقيت الرياض</small></h3>
   <div class="heat"><div></div>${hs.map(h=>`<div class="hh">${h}</div>`).join("")}${g.map((r,w)=>`<div class="hd">${dn[w]}</div>${r.map(v=>`<div class="hc" style="--a:${(v/mx).toFixed(2)}" title="${v} طلب">${v||""}</div>`).join("")}`).join("")}</div>
   ${R.orders.length?`<div class="muted small" style="margin-top:8px">أقوى وقت: <b>${dn[best[0]]} ${hs[best[1]]}</b>. ركّز ميزانية الإعلان قبله بساعة.</div>`:""}</div>`}

function geoCard(R){const by={},cc={};let known=0;R.orders.forEach(o=>{const m=S.om[o.id];if(!m||m.v!==2)return;known++;const c=m.city||"غير محدد";by[c]=by[c]||{n:0,rev:0};by[c].n++;by[c].rev+=o.amount;const k=m.cc||"؟";cc[k]=(cc[k]||0)+1});
  const rows=Object.entries(by).sort((a,b)=>b[1].n-a[1].n).slice(0,8);const mx=Math.max(1,...rows.map(x=>x[1].n));const CN={SA:"السعودية",KW:"الكويت",AE:"الإمارات",QA:"قطر",BH:"البحرين",OM:"عُمان"};
  return`<div class="card"><h3>المدن والدول <small>حسب عنوان العميل في سلة</small></h3>${known?`<div class="list">${rows.map(([c,x])=>`<div class="li" style="grid-template-columns:110px minmax(0,1fr) auto"><b>${esc(c)}</b>${hBar(x.n,mx)}<span class="n small">${fmt(x.n)} طلب · ${fmt(x.rev,0)} ر.س</span></div>`).join("")}</div>
   <div class="row" style="margin-top:10px;gap:6px">${Object.entries(cc).sort((a,b)=>b[1]-a[1]).map(([k,n])=>`<span class="tag">${esc(CN[k]||k)} <b class="n">${fmt(n)}</b></span>`).join("")}</div>`:`<div class="muted small">تتجمع خلال دقائق من فتح التطبيق.</div>`}
   ${known&&known<R.orders.length?`<div class="muted small" style="margin-top:6px">معروفة لـ ${fmt(known)} من ${fmt(R.orders.length)} طلب، والباقي يتحدد تلقائي.</div>`:""}</div>`}
function togetherCard(){const byC={};ordersIn("2000-01-01","2999-12-31").forEach(o=>{const c=o.attr&&o.attr.cid;if(!c)return;(byC[c]=byC[c]||new Set());(o.items||[]).forEach(i=>byC[c].add(i.name))});
  const pairs={};Object.values(byC).forEach(s=>{const a=[...s].sort();for(let i=0;i<a.length;i++)for(let j=i+1;j<a.length;j++){const k=a[i]+" + "+a[j];pairs[k]=(pairs[k]||0)+1}});
  const top=Object.entries(pairs).sort((a,b)=>b[1]-a[1]).slice(0,6);
  return`<div class="card"><h3>منتجات يشتريها نفس العميل <small>فكرة لبكج جديد</small></h3>${top.length?`<div class="list">${top.map(([k,n])=>`<div class="li" style="grid-template-columns:minmax(0,1fr) auto"><span>${esc(k)}</span><span class="tag cy n">${fmt(n)} عميل</span></div>`).join("")}</div><div class="muted small" style="margin-top:8px">لو منتجين يتكررون مع بعض، اعمل منهم بكج بسعر أقل من مجموعهم.</div>`:`<div class="muted small">لسه ما فيه عملاء اشتروا أكثر من منتج مختلف. تتحدث تلقائي مع الطلبات الجاية.</div>`}</div>`}

/* weekly automatic backup of settings, products, expenses, subscriptions and goals (kept 8 weeks) */
function isoWeek(d){const t=toD(d);const day=(t.getUTCDay()+6)%7;t.setUTCDate(t.getUTCDate()-day+3);const y=t.getUTCFullYear();const f=new Date(Date.UTC(y,0,4));return y+"-W"+String(1+Math.round(((t-f)/864e5-3+((f.getUTCDay()+6)%7))/7)).padStart(2,"0")}
let bkDone=false;
async function autoBackup(){if(bkDone||!S.db||!S.config||S.canWrite===false)return;bkDone=true;const wk=isoWeek(riyadhToday());
  try{const ex=await S.db.doc("backups/"+wk).get();if(ex.exists)return;
    const data={config:S.config,goals:S.goals||null,products:productsList(),expenses:S.expenses,recurring:S.recurring,excluded:{orders:(S.config.excludedOrders||[]),customers:(S.config.excludedCustomers||[])}};
    const txt=JSON.stringify(data);if(txt.length>900000)return;await S.db.doc("backups/"+wk).set({week:wk,at:new Date().toISOString(),json:txt});
    const all=await S.db.collection("backups").get();const ids=all.docs.map(d=>d.id).sort();for(const id of ids.slice(0,Math.max(0,ids.length-8)))await S.db.doc("backups/"+id).delete()}catch(e){console.warn("backup",e)}}
async function listBackups(){try{const all=await S.db.collection("backups").get();S.backups=all.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>b.id.localeCompare(a.id));render()}catch(e){}}

function backupsCard(){const L=S.backups||[];return`<div class="card"><h3>النسخ الاحتياطية التلقائية <small>كل أسبوع لحالها · آخر 8 أسابيع</small></h3>${L.length?`<div class="list">${L.map(b=>`<div class="li" style="grid-template-columns:minmax(0,1fr) auto"><div><b>أسبوع ${esc(b.id)}</b><div class="muted small n">${esc(String(b.at||"").slice(0,16).replace("T"," "))}</div></div><button class="btn sm ghost" data-act="bk-dl" data-id="${esc(b.id)}">تنزيل</button></div>`).join("")}</div><div class="muted small" style="margin-top:8px">تشمل الإعدادات والمنتجات والمصاريف والاشتراكات والأهداف. ترجّعها من «استرجاع نسخة» فوق.</div>`:`<div class="muted small">أول نسخة تنحفظ تلقائي خلال ثواني من فتح التطبيق.</div>`}</div>`}

const EXP_T=[["price","تغيير سعر"],["ad","إعلان أو حملة جديدة"],["coupon","كوبون أو عرض"],["product","منتج أو بكج جديد"],["other","أخرى"]];
function expStats(from,to){const T=calc(from,to).T;const n=diffDays(from,to)+1;return{od:T.orders/n,aov:T.aov,net:T.net/n,roas:T.roas}}
function experimentsCard(){const L=S.experiments||[];const t=riyadhToday();
  const cmp=(a,b,dec,pct)=>{if(!isFinite(a)||!isFinite(b))return"—";const d=b-a;const cls=d>0?"pos":d<0?"neg":"";return`<span class="n">${fmt(a,dec)}</span> ← <b class="n ${cls}">${fmt(b,dec)}</b>${a?` <span class="small ${cls}">(${d>=0?"+":""}${fmt(d/Math.abs(a)*100,0)}%)</span>`:""}`};
  return`<div class="card"><h3>سجل التجارب <small>سجّل أي تغيير وشوف أثره: 7 أيام قبله ضد 7 أيام بعده</small></h3>
   <form class="form" id="xpForm"><div class="field"><label for="ex-t2">وش غيّرت؟</label><input class="inp" id="ex-t2" required maxlength="80" placeholder="مثال: رفعت بكج التوفير لـ 11.99"></div>
   <div class="field"><label for="ex-k">النوع</label><select class="inp" id="ex-k">${EXP_T.map(([k,l])=>`<option value="${k}">${l}</option>`).join("")}</select></div>
   <div class="field"><label for="ex-d">التاريخ</label><input class="inp" id="ex-d" type="date" required value="${t}" max="${t}"></div>
   <div class="row"><button class="btn pri" type="submit">${ic("plus")}سجّل التجربة</button></div></form>
   ${L.length?`<div class="tbl-wrap" style="margin-top:12px"><table class="rsp"><thead><tr><th>التجربة</th><th>طلبات/يوم</th><th>متوسط السلة</th><th>الصافي/يوم</th><th>ROAS</th><th></th></tr></thead><tbody>${L.map(x=>{const before=expStats(addDays(x.date,-7),addDays(x.date,-1));const end=addDays(x.date,6)<t?addDays(x.date,6):t;const days=diffDays(x.date,end)+1;const after=expStats(x.date,end);
     return`<tr><td data-label="التجربة"><b>${esc(x.title)}</b><div class="muted small">${esc((EXP_T.find(e=>e[0]===x.kind)||[0,""])[1])} · ${esc(x.date)}${days<7?` · <span class="tag">لسه ${days} من 7 أيام</span>`:""}</div></td><td data-label="طلبات/يوم">${cmp(before.od,after.od,1)}</td><td data-label="متوسط السلة">${cmp(before.aov,after.aov,2)}</td><td data-label="الصافي/يوم">${cmp(before.net,after.net,1)}</td><td data-label="ROAS">${cmp(before.roas,after.roas,2)}</td><td><button class="btn sm danger" data-act="xp-del" data-id="${esc(x.id)}" aria-label="حذف">${ic("trash")}</button></td></tr>`}).join("")}</tbody></table></div>`:`<div class="muted small" style="margin-top:10px">ما سجّلت تجارب للحين. أول ما تغيّر سعر أو تشغّل حملة، سجّلها هنا.</div>`}</div>`}

function cacCard(r,R){const all=ordersIn("2000-01-01",riyadhToday());const first={};const val={};
  all.slice().sort((a,b)=>(a.day+a.t).localeCompare(b.day+b.t)).forEach(o=>{const c=o.attr&&o.attr.cid;if(!c)return;if(!first[c])first[c]=o;const k=orderCost(o);val[c]=(val[c]||0)+o.amount-k.cost-feeOf(o.amount)});
  const newTT=Object.values(first).filter(o=>o.day>=r.from&&o.day<=r.to&&o.attr.ch==="tiktok").length;const newAll=Object.values(first).filter(o=>o.day>=r.from&&o.day<=r.to).length;
  const cac=newTT?R.T.adsAll/newTT:NaN;const ids=Object.keys(val);const ltv=ids.length?ids.reduce((a,c)=>a+val[c],0)/ids.length:NaN;const ratio=isFinite(cac)&&cac>0?ltv/cac:NaN;
  const verdict=!isFinite(ratio)?"":ratio>=3?["cy","ممتاز: العميل يرجّع أكثر من 3 أضعاف تكلفته. يستاهل تزيد الإعلان."]:ratio>=1?["mu","مقبول: العميل يغطي تكلفته بس الهامش ضعيف."]:["pk","خسارة: العميل الجديد يكلفك أكثر من اللي يربحك منه طول الوقت. لازم ترفع السلة أو تخفض تكلفة الإعلان قبل ما تزيد الصرف."];
  return`<div class="card"><h3>تكلفة جلب العميل ضد قيمته <small>${esc(r.label)}</small></h3><div class="pd-grid">
   <div class="pd-box"><small>عملاء جدد من تيك توك</small><b class="n">${fmt(newTT)}</b></div><div class="pd-box"><small>تكلفة جلب العميل</small><b class="n">${isFinite(cac)?fmt(cac,2):"—"}</b></div>
   <div class="pd-box"><small>قيمة العميل (ربحه طول الوقت)</small><b class="n">${isFinite(ltv)?fmt(ltv,2):"—"}</b></div><div class="pd-box"><small>القيمة ÷ التكلفة</small><b class="n ${isFinite(ratio)&&ratio<1?"neg":"pos"}">${isFinite(ratio)?fmt(ratio,2)+"x":"—"}</b></div></div>
   ${verdict?`<div class="alert ${verdict[0]}" style="margin-top:10px"><i class="ic"></i><div>${verdict[1]}</div></div>`:""}
   <div class="muted small" style="margin-top:8px">قيمة العميل = ربحه من كل طلباته بعد المورد والرسوم. العملاء الجدد كلهم بالفترة: ${fmt(newAll)}.</div></div>`}
function pageReports(){
  const r=range(),pr=prevRange(r),A=calc(r.from,r.to),B=calc(pr.from,pr.to);
  const m=[["الإيرادات","rev",0,2],["الطلبات","orders",0,0],["متوسط قيمة الطلب","aov",0,2],["تكلفة المنتجات","cost",1,2],["رسوم سلة","fees",1,2],["الإعلانات","adsAll",1,2],["مصروفات أخرى","other",1,2],["صافي الربح","net",0,2],["هامش الربح","margin",0,"p"],["ROAS","roas",0,"x"],["CPA","cpa",1,2],["نقطة التعادل (طلب/يوم)","breakEven",1,1]];
  const wd=[0,0,0,0,0,0,0],wc=[0,0,0,0,0,0,0];A.days.forEach(d=>{const w=toD(d).getUTCDay();wd[w]+=A.D[d].rev;wc[w]++});
  const f=(v,k)=>k==="p"?(isFinite(v)?fmt(v*100,1)+"%":"—"):k==="x"?(isFinite(v)?fmt(v,2)+"x":"—"):(isFinite(v)?fmt(v,k):"—");
  return`<div class="card"><h3>مقارنة الفترات <small>${esc(r.label)} مقابل ${esc(dLabel(pr.from))} – ${esc(dLabel(pr.to))}</small></h3><div class="tbl-wrap"><table><thead><tr><th>المؤشر</th><th class="n">الحالية</th><th class="n">السابقة</th><th class="n">التغير</th></tr></thead><tbody>${m.map(x=>`<tr><td>${x[0]}</td><td class="n">${f(A.T[x[1]],x[3])}</td><td class="n">${f(B.T[x[1]],x[3])}</td><td class="n">${delta(A.T[x[1]],B.T[x[1]],!!x[2])}</td></tr>`).join("")}</tbody></table></div></div>
  <div class="grid g2 stack">
   <div class="card"><h3>متوسط الإيرادات حسب اليوم</h3>${barChart({vals:wd.map((v,i)=>wc[i]?v/wc[i]:0),labels:DAYS_AR,h:190,colors:(v,i)=>i===4||i===5?"#FF3D7F":"#00E5D4"})}</div>
   <div class="card"><h3>التصدير والنسخ الاحتياطي</h3><div class="list">
    <div class="li"><div><div class="t">ملف Excel</div><div class="s">الملخص، الطلبات، المصروفات، الإعلانات، المنتجات، الأرباح والخسائر</div></div><button class="btn sm cy" data-act="x-xlsx">${ic("xls")}تصدير</button></div>
    <div class="li"><div><div class="t">تقرير PDF</div><div class="s">ملخص الفترة وقائمة الأرباح والخسائر</div></div><button class="btn sm cy" data-act="x-pdf">${ic("pdf")}تصدير</button></div>
    <div class="li"><div><div class="t">نسخة احتياطية</div><div class="s">كل البيانات في ملف JSON</div></div><button class="btn sm" data-act="x-backup">${ic("save")}تنزيل</button></div>
    <div class="li"><div><div class="t">استرجاع نسخة</div><div class="s">يكتب فوق البيانات بنفس المعرّفات</div></div><label class="btn sm ghost" for="restoreFile">${ic("up")}اختيار ملف</label><input type="file" id="restoreFile" accept=".json,application/json" hidden></div>
   </div></div></div>${experimentsCard()}${peakCard(A)}${customersCard(r,A)}${cacCard(r,A)}${geoCard(A)}${togetherCard()}${ratingsCard()}${backupsCard()}`;
}


/* ================= monthly plan: you enter the drivers, the month calculates itself ================= */
function planDefaults(){const t=riyadhToday(),T=calc(addDays(t,-29),t).T,od=T.orders/30;const b=cfg().adBudget||{};
  return{ordMin:Math.max(1,Math.round(od*0.8)),ordMax:Math.max(Math.max(1,Math.round(od*0.8))+1,Math.round(od*1.5)),basket:+(isFinite(T.aov)?T.aov:10).toFixed(2),
    supCost:+(T.orders?T.cost/T.orders:1).toFixed(2),adsMonth:Math.round((+b.daily||T.adsAll/30)*30),other:Math.round(T.exp),refundPct:0,growthPct:0,useAsGoal:false}}
function planOf(){const d=planDefaults(),p=(S.goals&&S.goals.plan)||{};const o={...d};for(const k of Object.keys(d))if(p[k]!=null&&p[k]!=="")o[k]=p[k];return o}
function planCalc(p,ordersPerDay){const days=dim(riyadhToday());const n=ordersPerDay*days;const rev=n*p.basket;const refunds=rev*(+p.refundPct||0)/100;const sup=n*p.supCost;const fees=n*feeOf(p.basket);
  const fixed=(S.recurring||[]).filter(r=>r.active!==false).reduce((s,r)=>s+(+r.amount||0),0);const ads=+p.adsMonth||0,other=+p.other||0;
  const net=rev-refunds-sup-fees-ads-fixed-other;const perOrder=p.basket-p.supCost-feeOf(p.basket)-p.basket*(+p.refundPct||0)/100;
  return{opd:ordersPerDay,n,rev,refunds,sup,fees,ads,fixed,other,net,margin:rev?net/rev:NaN,roas:ads?rev/ads:NaN,cpa:n?ads/n:NaN,perOrder,beDay:perOrder>0?(ads+fixed+other)/perOrder/days:NaN}}
function planExpected(){const p=planOf();return planCalc(p,(+p.ordMin+ +p.ordMax)/2)}
function planTable(p){const lo=planCalc(p,+p.ordMin),hi=planCalc(p,+p.ordMax),mid=planCalc(p,(+p.ordMin+ +p.ordMax)/2);
  const t=riyadhToday(),ms=monthStart(t),dayN=+t.slice(8),M=calc(ms,t).T;const act=planCalc({...p,basket:isFinite(M.aov)?M.aov:p.basket,supCost:M.orders?M.cost/M.orders:p.supCost,adsMonth:M.adsAll/dayN*dim(t),other:M.exp/dayN*dim(t)},M.orders/dayN);
  const cols=[["أقل",lo],["المتوقع",mid],["أعلى",hi],["وتيرتك الحين",act]];
  const row=(l,f,dec=0,cls)=>`<tr><td>${l}</td>${cols.map(([,c],i)=>{const v=f(c);const k=typeof cls==="function"?cls(v):"";return`<td class="n ${k} ${i===1?"pl-mid":""}" data-label="${cols[i][0]}">${isFinite(v)?fmt(v,dec):"—"}</td>`}).join("")}</tr>`;
  const neg=(v)=>v<0?"neg":"pos";
  return`<div class="tbl-wrap"><table class="rsp plan-tbl"><thead><tr><th></th>${cols.map(([l],i)=>`<th class="n ${i===1?"pl-mid":""}">${l}</th>`).join("")}</tr></thead><tbody>
   ${row("طلبات باليوم",c=>c.opd,1)}${row("طلبات بالشهر",c=>c.n)}
   ${row("<b>الدخل الشهري</b>",c=>c.rev)}${row("تكلفة المزود",c=>-c.sup)}${row("رسوم سلة",c=>-c.fees)}${+p.refundPct?row("تعويضات واسترجاع",c=>-c.refunds):""}
   ${row("الإعلانات",c=>-c.ads)}${row("الاشتراكات الثابتة",c=>-c.fixed)}${+p.other||act.other?row("مصاريف ثانية",c=>-c.other):""}
   ${row("<b>الصافي</b>",c=>c.net,0,neg)}${row("هامش الربح %",c=>c.margin*100,0,neg)}${row("العائد على الإعلان ROAS",c=>c.roas,2)}${row("تكلفة الطلب من الإعلان",c=>c.cpa,2)}
   </tbody></table></div>
   <div class="pd-grid" style="margin-top:12px"><div class="pd-box"><small>يبقى لك من الطلب قبل الإعلان</small><b class="n ${mid.perOrder<0?"neg":""}">${fmt(mid.perOrder,2)}</b></div><div class="pd-box"><small>طلبات يوميًا عشان ما تخسر</small><b class="n">${isFinite(mid.beDay)?fmt(Math.ceil(mid.beDay)):"—"}</b></div>
   <div class="pd-box"><small>أقصى تكلفة إعلان للطلب</small><b class="n">${fmt(Math.max(0,mid.perOrder),2)}</b></div><div class="pd-box"><small>الشهر الجاي بنمو ${fmt(+p.growthPct||0,0)}%</small><b class="n">${fmt(mid.rev*(1+(+p.growthPct||0)/100),0)}</b></div></div>`}
function planCard(){const p=planOf();const f=(id,l,v,step,hint)=>`<div class="field"><label for="pl-${id}">${l}</label><input class="inp n" id="pl-${id}" data-pl="${id}" type="number" step="${step}" min="0" value="${esc(v)}">${hint?`<div class="muted small">${hint}</div>`:""}</div>`;
  const fixed=(S.recurring||[]).filter(r=>r.active!==false).reduce((s,r)=>s+(+r.amount||0),0);
  return`<div class="card" id="planCard"><h3>خطة الشهر <small>تكتب الأرقام، والدخل والصافي يتحسبون لحالهم</small></h3>
   <form class="form plan-form" id="planForm">
    ${f("ordMin","أقل عدد طلبات باليوم",p.ordMin,1)}${f("ordMax","أعلى عدد طلبات باليوم",p.ordMax,1)}
    ${f("basket","متوسط قيمة الطلب (ر.س)",p.basket,0.01,"فعلي آخر 30 يوم: "+fmt(planDefaults().basket,2))}${f("supCost","متوسط تكلفة المزود للطلب",p.supCost,0.01,"فعلي آخر 30 يوم: "+fmt(planDefaults().supCost,2))}
    ${f("adsMonth","الصرف الإعلاني بالشهر",p.adsMonth,1,"ميزانيتك اليومية × 30 = "+fmt(planDefaults().adsMonth))}${f("other","مصاريف ثانية بالشهر",p.other,1,"تصميم، أدوات… (الاشتراكات الثابتة تنحسب لحالها: "+fmt(fixed)+")")}
    ${f("refundPct","تعويضات واسترجاع % من المبيعات",p.refundPct,0.5)}${f("growthPct","النمو المتوقع للشهر الجاي %",p.growthPct,1)}
    <div class="field" style="grid-column:1/-1"><label class="row" style="gap:8px;cursor:pointer"><input type="checkbox" id="pl-goal" ${p.useAsGoal?"checked":""}> خلّ «الدخل الشهري المتوقع» هو هدف الشهر (بدل الرقم الثابت)</label></div>
    <div class="row" style="grid-column:1/-1;gap:8px"><button class="btn pri" type="submit">${ic("save")}حفظ الخطة</button><button class="btn ghost" type="button" data-act="plan-reset">رجّعها لأرقامي الفعلية</button></div>
   </form>
   <div id="planOut" style="margin-top:14px">${planTable(p)}</div>
   <div class="note" style="margin-top:10px">رسوم سلة تنحسب لحالها من متوسط الطلب، والاشتراكات من صفحة المصاريف. «وتيرتك الحين» تحسب الشهر كامل بنفس أرقامك من بداية الشهر لليوم، عشان تقارن خطتك بالواقع.</div></div>`}
function readPlanForm(){const p={...planOf()};document.querySelectorAll("[data-pl]").forEach(i=>{p[i.dataset.pl]=+i.value||0});const g=document.getElementById("pl-goal");if(g)p.useAsGoal=g.checked;return p}
document.addEventListener("input",(e)=>{if(e.target&&e.target.dataset&&e.target.dataset.pl!=null){const o=document.getElementById("planOut");if(o)o.innerHTML=planTable(readPlanForm())}});
document.addEventListener("submit",(e)=>{if(e.target&&e.target.id==="planForm"){e.preventDefault();const p=readPlanForm();if(p.ordMax<p.ordMin){toast("أعلى عدد طلبات لازم يكون أكبر من الأقل","err");return}
  const g={...(S.goals||{}),plan:p};S.goals=g;write(()=>S.db.doc("meta/goals").set(g),"انحفظت الخطة").then(()=>{S._lastSig=null;render()})}},true);
function goalPlanCard(){const g=goals(),t=riyadhToday(),G=+g.monthlySales||0;if(!G)return"";const R=calc(addDays(t,-29),t).T;const nd=30;
  const od=R.orders/nd,aov=R.aov,contrib=contribOf(R),cpa=R.orders?R.adsAll/R.orders:NaN;const fixed=R.rec+R.exp;
  const sc=(name,a,c,note)=>{const need=G/nd/a;const maxCpa=c-(+g.margin||0)*a;return{name,aov:a,need,mult:od>0?need/od:Infinity,maxCpa,note}};
  const cr=isFinite(aov)&&aov>0?aov:10;const ratio=isFinite(contrib)&&cr?contrib/cr:.75;
  const S1=sc("بنفس متوسط السلة الحالي",cr,cr*ratio,"تحتاج طلبات أكثر بكثير بنفس المنتجات"),S2=sc("متوسط سلة 25 ر.س (بكجات أكبر)",25,25*ratio,"تبيع بكج التفاعل والذهبي أكثر من التوفير"),S3=sc("متوسط سلة 40 ر.س",40,40*ratio,"بكجات كبيرة + عرض على الكمية");
  const rows=[S1,S2,S3];const prog=calc(monthStart(t),t).T.rev;
  return`<div class="card"><h3>خطة الوصول للهدف <small>هدفك ${fmt(G)} ر.س بالشهر · من أرقام آخر 30 يوم</small></h3>
   <div class="pd-grid"><div class="pd-box"><small>وضعك الحين</small><b class="n">${fmt(od,1)} طلب/يوم</b></div><div class="pd-box"><small>متوسط السلة</small><b class="n">${fmt(cr,2)}</b></div><div class="pd-box"><small>تكلفة الطلب من الإعلان الحين</small><b class="n">${isFinite(cpa)?fmt(cpa,2):"—"}</b></div><div class="pd-box"><small>هالشهر للحين</small><b class="n">${fmt(prog,0)} (${fmt(prog/G*100,1)}%)</b></div></div>
   <div class="tbl-wrap" style="margin-top:12px"><table class="rsp"><thead><tr><th>الطريق</th><th class="n">طلبات يوميًا</th><th class="n">كم ضعف وضعك الحين</th><th class="n">أقصى تكلفة إعلان للطلب</th></tr></thead><tbody>${rows.map(x=>`<tr><td data-label="الطريق"><b>${esc(x.name)}</b><div class="muted small">${esc(x.note)}</div></td><td class="n" data-label="طلبات يوميًا">${fmt(Math.ceil(x.need))}</td><td class="n" data-label="كم ضعف وضعك الحين">${isFinite(x.mult)?"×"+fmt(x.mult,0):"—"}</td><td class="n ${isFinite(cpa)&&cpa>x.maxCpa?"neg":"pos"}" data-label="أقصى تكلفة إعلان للطلب">${fmt(Math.max(0,x.maxCpa),2)}</td></tr>`).join("")}</tbody></table></div>
   <div class="note" style="margin-top:10px"><b>أقرب طريق:</b> رفع متوسط السلة. بمتوسط 25 ريال تحتاج <b class="n">${fmt(Math.ceil(S2.need))}</b> طلب يوميًا بدل <b class="n">${fmt(Math.ceil(S1.need))}</b>، ويصير مسموح لك تدفع للإعلان لين <b class="n">${fmt(Math.max(0,S2.maxCpa),2)}</b> ريال للطلب وتبقى على هامش ${fmt((+g.margin||0)*100,0)}%.${isFinite(cpa)&&cpa>S1.maxCpa?` تكلفة الطلب الحين (${fmt(cpa,2)}) أعلى من المسموح بالسلة الحالية، فأي توسّع بالإعلان بدون رفع السلة يزيد الخسارة.`:""}</div></div>`}
function pageGoals(){
  const g=goals(),t=riyadhToday(),ms=calc(monthStart(t),t).T,lm=calc(addMonths(t,-1),monthEnd(addMonths(t,-1))).T;
  const dl=g.deadline+"-01";const monthsLeft=Math.max(1,(Number(dl.slice(0,4))-Number(t.slice(0,4)))*12+(Number(dl.slice(5,7))-Number(t.slice(5,7))));
  const base=Math.max(1,lm.rev||ms.rev/Number(t.slice(8))*dim(t));const growth=Math.pow(g.monthlySales/base,1/monthsLeft)-1;
  const months=[],act=[],req=[];for(let i=-3;i<=monthsLeft;i++){const s=addMonths(t,i);months.push(MONTHS_AR[+s.slice(5,7)-1].slice(0,3)+" "+s.slice(2,4));if(i<=0){const e=i===0?t:monthEnd(s);act.push(calc(s,e).T.rev)}else act.push(null);req.push(i>=-1?base*Math.pow(1+growth,i+1):null)}
  return`${planCard()}${goalPlanCard()}<div class="grid g3">
   <div class="card hero"><h3>هدف المبيعات الشهرية</h3><div class="kpi big"><div class="v"><span class="n">${fmt(g.monthlySales)}</span><small>ر.س / شهر</small></div><div class="d">بنهاية ${esc(mLabel(dl))} · باقي ${monthsLeft} شهر</div></div>
    <div class="goal-meter" style="margin-top:14px"><i data-w="${Math.min(100,ms.rev/g.monthlySales*100)}"></i></div><div class="row small" style="justify-content:space-between;margin-top:6px"><span>هذا الشهر <b class="n">${fmt(ms.rev)}</b></span><b class="n">${fmt(ms.rev/g.monthlySales*100,1)}%</b></div></div>
   <div class="card"><h3>النمو المطلوب</h3><div class="kpi"><div class="v"><span class="n">${fmt(growth*100,1)}%</span><small>شهريًا</small></div><div class="d">من مبيعات أساس <span class="n">${fmt(base)}</span> ر.س إلى الهدف خلال ${monthsLeft} شهر</div></div></div>
   <div class="card"><h3>هامش الربح المستهدف</h3><div class="ring-wrap">${ring(isFinite(ms.margin)?ms.margin/g.margin:0,isFinite(ms.margin)?fmt(ms.margin*100,0)+"%":"—","المستهدف "+fmt(g.margin*100,0)+"%")}<div class="small muted">هامش هذا الشهر بعد كل المصاريف.</div></div></div>
  </div>
  <div class="card"><h3>مسار الهدف <small><span class="tag cy">فعلي</span> <span class="tag fc">المسار المطلوب</span></small></h3>${lineChart({labels:months,series:[{name:"فعلي",vals:act,color:"#00E5D4",area:true},{name:"المطلوب",vals:req,color:"#FF7AA6",dashed:true}],h:240})}</div>
  <div class="card"><h3>إعدادات الأهداف وقاعدة رفع الإعلان</h3><form class="form" id="goalsForm">
   <div class="field"><label for="gl-sales">هدف المبيعات الشهرية</label><input class="inp n" id="gl-sales" type="number" min="1" value="${esc(g.monthlySales)}"></div>
   <div class="field"><label for="gl-dl">بنهاية شهر</label><input class="inp" id="gl-dl" type="month" value="${esc(g.deadline)}"></div>
   <div class="field"><label for="gl-m">هامش الربح المستهدف %</label><input class="inp n" id="gl-m" type="number" step="0.5" min="0" max="100" value="${esc(g.margin*100)}"></div>
   <div class="field"><label for="gl-up">ارفع الإعلان إذا العائد ≥</label><input class="inp n" id="gl-up" type="number" step="0.1" min="0" value="${esc(g.roasUp)}"></div>
   <div class="field"><label for="gl-hold">ثبّت الإعلان إذا العائد ≥</label><input class="inp n" id="gl-hold" type="number" step="0.1" min="0" value="${esc(g.roasHold)}"></div>
   <div class="field"><label for="gl-step">نسبة الرفع %</label><input class="inp n" id="gl-step" type="number" step="1" min="0" max="100" value="${esc(g.stepUp*100)}"></div>
   <div class="row"><button class="btn pri" type="submit">${ic("save")}حفظ</button></div></form></div>`;
}
function pagePrefs(){
  const c=cfg(),f=c.fees,b=c.adBudget;
  return`<div class="grid g2 stack">
  <div class="card"><h3>المظهر</h3><div class="muted small" style="margin-bottom:10px">الداكن نفس شكل المتجر، والفاتح أوضح في الشمس.</div>
   <div class="seg theme-seg" role="radiogroup" aria-label="المظهر">${[["dark","داكن"],["light","فاتح"],["auto","تلقائي حسب الجهاز"]].map(([k,l])=>`<button type="button" role="radio" aria-checked="${themePref()===k}" class="${themePref()===k?"on":""}" data-theme-set="${k}">${l}</button>`).join("")}</div>
   <div class="muted small" style="margin-top:8px">تقدر تبدّل بسرعة من زر الشمس والقمر فوق. الاختيار ينحفظ في هذا الجهاز.</div></div>
  <div class="card"><h3>المزامنة والربط</h3><div class="list">
   <div class="li"><div><div class="t">سلة</div><div class="s">آخر مزامنة: ${esc(ago(S.sync.lastSalla))}${S.sync.sallaFrom?` · من ${esc(S.sync.sallaFrom)}`:""}</div>${S.connErr.salla?`<div class="s neg">${esc(S.connErr.salla)}</div>`:""}</div><button class="btn sm cy" data-act="sync-salla" ${S.syncing.salla?"disabled":""}>${S.syncing.salla?'<i class="spin"></i>':ic("sync")}مزامنة</button></div>
   <div class="li"><div><div class="t">تيك توك للأعمال</div><div class="s">آخر مزامنة: ${esc(ago(S.sync.lastTikTok))}</div>${S.connErr.tiktok?`<div class="s neg">${esc(S.connErr.tiktok)}</div>`:""}</div><button class="btn sm cy" data-act="sync-tiktok" ${S.syncing.tiktok?"disabled":""}>${S.syncing.tiktok?'<i class="spin"></i>':ic("sync")}مزامنة</button></div>
  </div>
  <form class="form" id="fullSync" style="margin-top:14px"><div class="field"><label for="fs-from">مزامنة كاملة من تاريخ</label><input class="inp" id="fs-from" type="date" required value="${esc(addMonths(riyadhToday(),-2))}"></div><div class="row"><button class="btn" type="submit">${ic("sync")}مزامنة كاملة</button></div></form>
  <div class="note" style="margin-top:12px">كل طلب ينحفظ برقمه من سلة، وكل يوم إعلان بتاريخه، فإعادة المزامنة ما تكرر أي عملية.</div></div>
  <div class="card"><h3>رسوم سلة</h3><form class="form" id="feesForm">
   <div class="field"><label for="fe-fixed">ثابت لكل طلب (ر.س)</label><input class="inp n" id="fe-fixed" type="number" step="0.01" min="0" value="${esc(f.fixed)}"></div>
   <div class="field"><label for="fe-pct">نسبة من قيمة الطلب %</label><input class="inp n" id="fe-pct" type="number" step="0.01" min="0" value="${esc(f.pct*100)}"></div>
   <div class="field"><label for="fe-vat">ضريبة على الرسوم %</label><input class="inp n" id="fe-vat" type="number" step="0.01" min="0" value="${esc(f.vat*100)}"></div>
   <div class="field"><label for="fe-unk">تكلفة منتج غير معرّف % من سعره</label><input class="inp n" id="fe-unk" type="number" step="0.1" min="0" max="100" value="${esc((c.unknownCostPct||0)*100)}"></div>
   <div class="row"><button class="btn pri" type="submit">${ic("save")}حفظ</button></div></form>
   <div class="note" style="margin-top:10px">مثال طلب 9.99: <span class="n">${fmt(feeOf(9.99),3)}</span> ر.س رسوم. النظام يستخدم رسوم الدفع الفعلية من تقرير سلة لكل يوم (قبل الضريبة) ويضيف عليها الضريبة، وهذي المعادلة احتياط لليوم اللي تقريره ما اكتمل.</div></div>
  <div class="card"><h3>خطة ميزانية الإعلان</h3><form class="form" id="budgetForm">
   <div class="field"><label for="bd-total">الميزانية الكلية</label><input class="inp n" id="bd-total" type="number" step="1" min="0" value="${esc(b.total)}"></div>
   <div class="field"><label for="bd-daily">اليومي</label><input class="inp n" id="bd-daily" type="number" step="0.5" min="0" value="${esc(b.daily)}"></div>
   <div class="field"><label for="bd-start">من</label><input class="inp" id="bd-start" type="date" value="${esc(b.start)}"></div>
   <div class="field"><label for="bd-end">إلى</label><input class="inp" id="bd-end" type="date" value="${esc(b.end)}"></div>
   <div class="field"><label for="bd-adv">حساب تيك توك الإعلاني</label><input class="inp n" id="bd-adv" inputmode="numeric" value="${esc(c.tiktokAdvertiser)}"></div>
   <div class="row"><button class="btn pri" type="submit">${ic("save")}حفظ</button></div></form></div>
  <div class="card"><h3>رمز الدخول</h3><form class="form" id="pinChange" autocomplete="off">
   <div class="field"><label for="pc-old">الرمز الحالي</label><input class="inp n" id="pc-old" type="password" inputmode="numeric" maxlength="8" required></div>
   <div class="field"><label for="pc-new">الرمز الجديد (4 أرقام)</label><input class="inp n" id="pc-new" type="password" inputmode="numeric" minlength="4" maxlength="4" required></div>
   <div class="field"><label for="pc-new2">أكّد الرمز الجديد</label><input class="inp n" id="pc-new2" type="password" inputmode="numeric" minlength="4" maxlength="4" required></div>
   <div class="row"><button class="btn pri" type="submit">${ic("save")}تغيير الرمز</button></div></form>
   <div class="note" style="margin-top:10px">الرمز ينحفظ مشفّر، ويُطلب كل ما تفتح التطبيق، وبعد 10 دقائق بدون استخدام، أو لما تضغط «قفل التطبيق».</div></div>
  <div class="card"><h3>قواعد الحساب</h3><div class="list small">
   <div class="li" style="grid-template-columns:1fr">صافي الربح = الإيرادات − تكلفة المنتجات − رسوم سلة − الإعلانات − المصروفات الأخرى.</div>
   <div class="li" style="grid-template-columns:1fr">الطلبات الملغية والمسترجعة وبانتظار الدفع مستبعدة من الإيرادات.</div>
   <div class="li" style="grid-template-columns:1fr">الطلبات بعملة ثانية (مثل الدينار) تتحول للريال بسعر الصرف المسجل في سلة.</div>
   <div class="li" style="grid-template-columns:1fr">الاشتراكات الشهرية تتوزع على أيام الشهر، فأي فترة تاخذ نصيبها بس.</div>
   <div class="li" style="grid-template-columns:1fr">التوقعات تنحفظ لحالها وما تدخل في أي رقم فعلي.</div></div></div>
  </div>${healthCard()}${customizeCard()}`;
}
const PAGES={home:pageHome,summary:pageSummary,revenue:pageRevenue,expenses:pageExpenses,products:pageProducts,ads:pageAds,orders:pageOrders,pnl:pagePnl,reports:pageReports,goals:pageGoals,prefs:pagePrefs};

/* ===================== render ===================== */
function liveOn(){if(S.lastLive&&Date.now()-S.lastLive<3*6e4)return true;const l=S.sync.lastSalla;return !!l&&(Date.now()-new Date(l).getTime())<10*6e4}
function moveInd(){const a=document.querySelector("#nav a.on"),ind=$("#navInd");if(!a||!ind)return;ind.style.transform=`translateY(${a.offsetTop}px)`;ind.style.height=a.offsetHeight+"px";ind.style.opacity=1}
addEventListener("resize",()=>requestAnimationFrame(moveInd));
document.addEventListener("pointermove",(e)=>{const c=e.target.closest&&e.target.closest(".content .card");if(!c)return;const r=c.getBoundingClientRect();c.style.setProperty("--mx",(e.clientX-r.left)+"px");c.style.setProperty("--my",(e.clientY-r.top)+"px")},{passive:true});
function renderNav(){
  let h="";ROUTES.forEach(([k,l,i,grp])=>{if(grp)h+=`<div class="grp">${esc(grp)}</div>`;h+=`<a href="#${k}" class="${S.route===k?"on":""}" ${S.route===k?'aria-current="page"':""} title="${esc(l)}">${ic(i)}<span class="lbl">${esc(l)}</span></a>`});
  $("#nav").innerHTML=h;
  requestAnimationFrame(moveInd);
  renderLive();
}

/* ---- theme (dark = store look, light for sunlight) ---- */
const SUN='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',MOON='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z"/></svg>';
function applyTheme(t){S._lastSig=null;setTimeout(()=>{try{applyUi()}catch(e){}},0);document.documentElement.setAttribute("data-theme",t);const b=document.getElementById("themeBtn");if(b){b.innerHTML=t==="light"?MOON:SUN;b.setAttribute("aria-label",t==="light"?"الوضع الداكن":"الوضع الفاتح")}}
function themePref(){try{return localStorage.getItem("ff-theme")||"dark"}catch(e){return"dark"}}
const mqLight=window.matchMedia?matchMedia("(prefers-color-scheme: light)"):null;
function resolveTheme(p){return p==="auto"?(mqLight&&mqLight.matches?"light":"dark"):p}
function setThemePref(p){try{localStorage.setItem("ff-theme",p)}catch(x){}applyTheme(resolveTheme(p));render()}
(function(){applyTheme(resolveTheme(themePref()));if(mqLight&&mqLight.addEventListener)mqLight.addEventListener("change",()=>{if(themePref()==="auto"){applyTheme(resolveTheme("auto"));render()}});
  document.addEventListener("click",(e)=>{if(e.target.closest&&e.target.closest("#themeBtn")){setThemePref(document.documentElement.getAttribute("data-theme")==="light"?"dark":"light");return}
    const t=e.target.closest&&e.target.closest("[data-theme-set]");if(t)setThemePref(t.dataset.themeSet)})})();
/* ---- global search: order number or product, from any page ---- */
(function(){const gs=()=>document.getElementById("gsearch");
  const run=(q)=>{const box=document.getElementById("gsRes");if(!box)return;q=String(q||"").trim();if(q.length<2){box.hidden=true;return}const out=[];
    const all=ordersIn("2000-01-01","2999-12-31");all.filter(o=>String(o.ref).includes(q)).slice(0,6).forEach(o=>out.push(`<a href="#orders" data-gs-order="${esc(o.ref)}">${ic("receipt")} طلب #${esc(o.ref)} · ${esc(o.day)} · ${fmt(o.amount,2)} ر.س</a>`));
    productsList().filter(p=>p.name.includes(q)).slice(0,5).forEach(p=>out.push(`<a href="#products" data-gs-prod="${esc(p.name)}">${ic("box")} ${esc(p.name)}</a>`));
    if(!/^\d+$/.test(q)&&all.some(o=>(o.items||[]).some(i=>i.name.includes(q))))out.push(`<a href="#orders" data-gs-order="${esc(q)}">${ic("receipt")} كل طلبات «${esc(q)}»</a>`);
    box.innerHTML=out.join("")||`<div class="muted small" style="padding:10px">ما فيه نتائج</div>`;box.hidden=false};
  document.addEventListener("input",(e)=>{if(e.target&&e.target.id==="gsIn")run(e.target.value)});
  document.addEventListener("keydown",(e)=>{if(e.target&&e.target.id==="gsIn"&&e.key==="Enter"){const a=document.querySelector("#gsRes a");if(a)a.click()}if(e.key==="Escape"){const b=document.getElementById("gsRes");if(b)b.hidden=true}});
  document.addEventListener("click",(e)=>{const a=e.target.closest&&e.target.closest("#gsRes a");if(a){if(a.dataset.gsOrder!=null){S.ordersQ=a.dataset.gsOrder;S.ordersPage=1}document.getElementById("gsRes").hidden=true;const i=document.getElementById("gsIn");if(i)i.value="";(gs()||{}).classList&&gs().classList.remove("open");if(location.hash===a.getAttribute("href"))render();return}
    if(e.target.closest&&e.target.closest("#gsBtn")){const g=gs();g.classList.toggle("open");const i=document.getElementById("gsIn");if(i)i.focus();return}
    if(!(e.target.closest&&e.target.closest("#gsearch"))){const b=document.getElementById("gsRes");if(b)b.hidden=true}})})();

/* instant open: keep the last numbers on this device and show them while the live data loads */
const CK="ff-cache-v1";let ckT;
function saveCache(){clearTimeout(ckT);ckT=setTimeout(()=>{try{if(!S.config)return;localStorage.setItem(CK,JSON.stringify({at:Date.now(),config:S.config,goals:S.goals,products:S.products,salla:S.salla,ads:S.ads,feesDays:S.feesDays,expenses:S.expenses,recurring:S.recurring,links:S.links,oq:S.oq,om:S.om}))}catch(e){}},1500)}
function loadCache(){try{const c=JSON.parse(localStorage.getItem(CK)||"null");if(!c||Date.now()-c.at>7*864e5)return false;
  Object.assign(S,{config:c.config,goals:c.goals,products:c.products||[],salla:c.salla||{},ads:c.ads||{},feesDays:c.feesDays||{},expenses:c.expenses||[],recurring:c.recurring||[],links:c.links||{},oq:c.oq||{},om:c.om||{}});
  S.fromCache=true;["config","products"].forEach(k=>S.loaded.add(k));return true}catch(e){return false}}

/* tabs inside long pages: blocks are grouped by their heading; anything unmatched stays on the first tab */
const PAGE_TABS={
 products:[["services","الخدمات",["رصيد المورد","شحن المزودين","استهلاك المزودين","خدمات المورد","ابحث في خدمات"]],["cost","التكلفة والأسعار",["تكلفة المنتجات","محاكي الأسعار"]],["offers","العروض والسلات",["أداء الكوبونات","السلات المتروكة"]],["suppliers","المزودين",["أداء المزود","صائد الخدمة","تغيّر أسعار"]]],
 reports:[["compare","المقارنة",["مقارنة الفترات","متوسط الإيرادات حسب اليوم"]],["customers","العملاء",["العملاء","تكلفة جلب العميل","المدن والدول","منتجات يشتريها","التقييمات"]],["times","الأوقات",["أوقات البيع"]],["tests","التجارب",["سجل التجارب"]],["files","الملفات",["التصدير","النسخ الاحتياطية"]]],
 ads:[["overview","نظرة عامة",["الصرف مقابل المبيعات","خطة الميزانية"]],["campaigns","الحملات",["كل حملة","أفضل الفيديوهات"]],["hours","الساعات",["ساعات الإعلان"]],["days","الأيام",["تفاصيل الأيام"]]],
 expenses:[["list","المصاريف",["تسجيل مصروف","المصروفات المسجلة","حسب التصنيف","الاشتراكات"]],["owner","السحوبات والكاش",["السحوبات"]]]};
S.tabs={};try{S.tabs=JSON.parse(localStorage.getItem("ff-tabs")||"{}")}catch(e){}
function applyTabs(root){const defs=PAGE_TABS[S.route];if(!defs||!root)return;const kids=[...root.children];if(kids.length<3)return;
  const tabOf=(el)=>{const hs=[...el.querySelectorAll("h3")].map(h=>h.textContent);for(const [k,,keys] of defs)if(hs.some(h=>keys.some(x=>h.includes(x))))return k;return null};
  let cur=defs[0][0];const groups=kids.map(el=>{const k=tabOf(el);if(k)cur=k;return k||(el.classList.contains("alert")?cur:defs[0][0])});
  const active=defs.some(d=>d[0]===S.tabs[S.route])?S.tabs[S.route]:defs[0][0];
  kids.forEach((el,i)=>{el.dataset.tab=groups[i];el.hidden=groups[i]!==active});
  const bar=document.createElement("div");bar.className="ptabs";bar.setAttribute("role","tablist");
  bar.innerHTML=defs.filter(d=>groups.includes(d[0])).map(([k,l])=>`<button type="button" role="tab" aria-selected="${k===active}" class="${k===active?"on":""}" data-ptab="${k}">${esc(l)}</button>`).join("");
  root.prepend(bar)}
document.addEventListener("click",(e)=>{const b=e.target.closest&&e.target.closest("[data-ptab]");if(!b)return;const k=b.dataset.ptab;S.tabs[S.route]=k;try{localStorage.setItem("ff-tabs",JSON.stringify(S.tabs))}catch(x){}
  const root=b.closest(".ptabs").parentElement;[...root.children].forEach(el=>{if(el.dataset&&el.dataset.tab)el.hidden=el.dataset.tab!==k});b.parentElement.querySelectorAll("button").forEach(x=>{x.classList.toggle("on",x===b);x.setAttribute("aria-selected",x===b)});
  S._lastSig=null;render();window.scrollTo({top:0,behavior:"smooth"})});

/* ================= 1. ask about your numbers ================= */
function aiContext(){const t=riyadhToday(),ms=monthStart(t),pm=addMonths(ms,-1);const pack=(T)=>({sales:+T.rev.toFixed(2),orders:T.orders,avg_basket:isFinite(T.aov)?+T.aov.toFixed(2):null,supplier_cost:+T.cost.toFixed(2),salla_fees:+T.fees.toFixed(2),ads:+T.adsAll.toFixed(2),fixed_and_other:+T.other.toFixed(2),net:+T.net.toFixed(2),roas:isFinite(T.roas)?+T.roas.toFixed(2):null,cost_per_order_from_ads:T.orders?+(T.adsAll/T.orders).toFixed(2):null});
  const per={today:pack(calc(t,t).T),last_7_days:pack(calc(addDays(t,-6),t).T),prev_7_days:pack(calc(addDays(t,-13),addDays(t,-7)).T),this_month_to_date:pack(calc(ms,t).T),last_month:pack(calc(pm,monthEnd(pm)).T)};
  const M=calc(ms,t);const prods={};for(const o of M.orders){const c=orderCost(o),its=o.items||[];const pf=o.amount-c.cost-feeOf(o.amount);its.forEach(it=>{const p=prods[it.name]=prods[it.name]||{sold:0,sales:0,profit_before_ads:0};p.sold+=it.qty||1;p.sales+=o.amount/its.length;p.profit_before_ads+=pf/its.length})}
  Object.values(prods).forEach(p=>{p.sales=+p.sales.toFixed(2);p.profit_before_ads=+p.profit_before_ads.toFixed(2)});
  const camps={};M.orders.forEach(o=>{if(o.attr&&o.attr.ch==="tiktok"){const k=o.attr.camp||"?";camps[k]=camps[k]||{orders:0,sales:0};camps[k].orders++;camps[k].sales+=o.amount}});
  const ttc=extData(`tt:AUCTION_CAMPAIGN:${ms}:${t}`)||[];ttc.forEach(c=>{if(+c.spend>0){camps[c.campaign_name]=camps[c.campaign_name]||{orders:0,sales:0};camps[c.campaign_name].spend=+(+c.spend).toFixed(2)}});
  const bal={};if(S.supBal)Object.values(S.supBal).forEach(b=>{if(b&&b.balance_sar!=null)bal[b.supplier]=+b.balance_sar.toFixed(2)});
  const g=goals();return{today:t,currency:"SAR",periods:per,products_this_month:prods,tiktok_campaigns_this_month:camps,supplier_balances:bal,
    service_rates_per_1000:cfg().rates,goal_monthly_sales:g.monthlySales,goal_margin:g.margin,fixed_monthly:(S.recurring||[]).filter(r=>r.active!==false).map(r=>({name:r.title,amount:+r.amount}))}}
async function askAI(q){q=String(q||"").trim().slice(0,300);if(!q||!S.sample||S.ai.busy)return;S.ai={...S.ai,q,a:"",busy:true,err:""};paintAI();
  const sys="أنت مستشار مالي لمتجر فلاش ستور (خدمات تيك توك: مشاهدات ولايكات وشير وحفظ) على منصة سلة. جاوب باللهجة السعودية، باختصار ووضوح، من الأرقام المرفقة فقط. لا تخترع أي رقم. إذا المعلومة مو موجودة قل كذا. اذكر الأرقام بالريال. اختم بخطوة أو خطوتين عمليتين. لا تقترح تغيير أسعار أو إعلانات كأنها تمت؛ اقترحها فقط.";
  const msgs=[];(S.ai.hist||[]).slice(-4).forEach(h=>{msgs.push({role:"user",content:h.q});msgs.push({role:"assistant",content:h.a})});
  msgs.push({role:"user",content:sys+"\n\nالأرقام (JSON):\n"+JSON.stringify(aiContext())+"\n\nالسؤال: "+q});
  try{const r=await S.sample(msgs,{modelTier:"default",cache:false,onText:({text})=>{S.ai.a=text;paintAI(true)}});S.ai.a=r.text;S.ai.hist=[...(S.ai.hist||[]),{q,a:r.text}].slice(-4)}
  catch(e){S.ai.err=e&&e.code==="rate_limited"?"كثرت الأسئلة، جرّب بعد دقيقة.":e&&e.code==="not_granted"?"ما انسمح للصفحة تسأل Claude. فعّلها من صلاحيات الصفحة.":"ما قدرت أجاوب الحين، جرّب مرة ثانية."}
  S.ai.busy=false;paintAI()}
function aiInner(){const A=S.ai;return`${A.q?`<div class="ai-q">${esc(A.q)}</div>`:""}${A.busy&&!A.a?`<div class="muted small"><i class="spin" style="width:12px;height:12px;vertical-align:middle"></i> أفكر في أرقامك…</div>`:""}${A.a?`<div class="ai-a">${esc(A.a)}</div>`:""}${A.err?`<div class="neg small">${esc(A.err)}</div>`:""}`}
function paintAI(){const el=document.getElementById("aiOut");if(el)el.innerHTML=aiInner();const b=document.getElementById("aiGo");if(b)b.disabled=!!S.ai.busy}
function aiCard(){if(!S.sample)return"";const chips=["ليش تغيّر الصافي هالأسبوع؟","وش أربح منتج هالشهر؟","كم طلب أحتاج يوميًا عشان أغطي الإعلان؟","وش أسوي عشان أرفع الربح؟","أي حملة تخسّرني؟"];
  return`<div class="card"><h3>اسأل عن أرقامك <small>يجاوب Claude من أرقام التطبيق نفسها</small></h3>
   <form class="ai-form" id="aiForm"><input class="inp" id="aiQ" maxlength="300" placeholder="مثال: ليش نزل الصافي هالأسبوع؟" autocomplete="off" aria-label="سؤالك"><button class="btn pri" id="aiGo" type="submit" ${S.ai.busy?"disabled":""}>اسأل</button></form>
   <div class="row" style="gap:6px;margin-top:8px">${chips.map(c=>`<button type="button" class="chipq" data-aiq="${esc(c)}">${esc(c)}</button>`).join("")}</div>
   <div id="aiOut" class="ai-out">${aiInner()}</div></div>`}
document.addEventListener("submit",(e)=>{if(e.target&&e.target.id==="aiForm"){e.preventDefault();const i=document.getElementById("aiQ");askAI(i.value);i.value=""}},true);
document.addEventListener("click",(e)=>{const c=e.target.closest&&e.target.closest("[data-aiq]");if(c)askAI(c.dataset.aiq)});

/* ================= 2. what is due in the next 30 days ================= */
function obligationsCard(){const t=riyadhToday(),end=addDays(t,30),items=[];
  for(const r of (S.recurring||[])){if(r.active===false)continue;const day=Math.min(28,Math.max(1,+r.chargeDay||1));for(let m=0;m<2;m++){const base=addMonths(monthStart(t),m);const d=base.slice(0,8)+String(day).padStart(2,"0");if(d>t&&d<=end&&(!r.startMonth||d.slice(0,7)>=r.startMonth)&&(!r.endMonth||d.slice(0,7)<=r.endMonth))items.push({date:d,label:r.title||"اشتراك",amount:+r.amount||0,kind:"sub",guess:!r.chargeDay})}}
  const b=cfg().adBudget;const w7=calc(addDays(t,-6),t).T.adsAll/7;const adDaily=w7>0?w7:(+b.daily||0);if(adDaily>0)items.push({date:end,label:`الإعلانات (${fmt(adDaily,2)} باليوم × 30)`,amount:adDaily*30,kind:"ads",spread:true});
  SUPPLIERS.forEach(([k])=>{const rw=runwayOf(k);if(rw&&rw.daily>0){const need=Math.max(0,rw.daily*30-rw.bal);if(need>0){const runOut=isFinite(rw.days)?addDays(t,Math.max(0,Math.floor(rw.days))):t;items.push({date:runOut<t?t:runOut,label:`شحن ${k} (يخلص الرصيد تقريبًا)`,amount:need,kind:"sup"})}}});
  items.sort((a,b)=>a.date.localeCompare(b.date));const total=items.reduce((s,x)=>s+x.amount,0);const fixed=items.filter(x=>!x.spread).reduce((s,x)=>s+x.amount,0);
  return`<div class="card"><h3>التزامات الـ 30 يوم الجاية <small>من ${esc(dLabel(t))} إلى ${esc(dLabel(end))}</small></h3>
   <div class="pd-grid"><div class="pd-box"><small>المجموع المتوقع</small><b class="n">${fmt(total,0)}</b></div><div class="pd-box"><small>منها مبالغ بتاريخ محدد</small><b class="n">${fmt(fixed,0)}</b></div><div class="pd-box"><small>الإعلانات (موزعة على الأيام)</small><b class="n">${fmt(adDaily*30,0)}</b></div><div class="pd-box"><small>مبيعاتك المتوقعة لنفس المدة</small><b class="n">${fmt(calc(addDays(t,-29),t).T.rev,0)}</b></div></div>
   ${items.length?`<div class="list" style="margin-top:12px">${items.map(x=>`<div class="li" style="grid-template-columns:86px minmax(0,1fr) auto"><span class="n small muted">${x.spread?"طول الشهر":esc(dLabel(x.date))}</span><div><b>${esc(x.label)}</b>${x.guess?' <span class="muted small">(يوم الخصم غير محدد، افترضت يوم 1)</span>':""}</div><b class="n neg">${fmt(x.amount,2)}</b></div>`).join("")}</div>`:`<div class="muted small" style="margin-top:10px">ما فيه التزامات معروفة.</div>`}
   <div class="muted small" style="margin-top:8px">حدّد يوم خصم كل اشتراك من المصاريف ← الاشتراكات ← تعديل، عشان تطلع التواريخ صح.</div></div>`}

/* ================= 3. data health ================= */
function healthCard(){const t=riyadhToday(),ms=monthStart(t);const R=calc(ms,t);const rows=[];
  const age=(iso)=>iso?Math.round((Date.now()-new Date(iso).getTime())/6e4):null;
  const sa=age(S.sync&&S.sync.lastSalla),ta=age(S.sync&&S.sync.lastTikTok);
  rows.push([sa!=null&&sa<=180?"ok":"warn","آخر مزامنة مع سلة",sa==null?"ما صارت":sa<1?"الحين":`قبل ${fmtMins(sa)}`,sa!=null&&sa<=180?"":`<button class="btn sm cy" data-act="sync-salla">مزامنة</button>`]);
  rows.push([ta!=null&&ta<=360?"ok":"warn","آخر مزامنة مع تيك توك",ta==null?"ما صارت":ta<1?"الحين":`قبل ${fmtMins(ta)}`,ta!=null&&ta<=360?"":`<button class="btn sm cy" data-act="sync-tiktok">مزامنة</button>`]);
  rows.push([R.unknownN?"bad":"ok","منتجات بدون تكلفة",R.unknownN?`${R.unknownN} طلب هالشهر`:"ولا واحد",R.unknownN?`<a class="btn sm ghost" href="#products">أضفها</a>`:""]);
  rows.push([R.estN?"warn":"ok","طلبات تكلفتها تقديرية",R.estN?`${R.estN} طلب (ما انقرت كميتها من الفاتورة للحين)`:"ولا واحد",R.estN?`<a class="btn sm ghost" href="#orders">افتح الطلبات</a>`:""]);
  const noSrc=R.orders.filter(o=>!o.attr).length;rows.push([noSrc?"warn":"ok","طلبات مصدرها غير معروف",noSrc?`${noSrc} طلب، يتحدد تلقائي وأنت فاتح الرئيسية أو الإعلانات`:"كلها معروفة",""]);
  const ex=((S.config&&S.config.excludedOrders)||[]).length,exc=((S.config&&S.config.excludedCustomers)||[]).length;rows.push(["info","طلبات مستبعدة من الحسابات",`${ex} طلب${exc?` + طلبات ${exc} عميل`:""}`,ex?`<a class="btn sm ghost" href="#orders">راجعها</a>`:""]);
  const wkd=extData("wk:topups");if(!wkd&&S.mcp)wk("supplier_topups",{},"wk:topups",5*6e4);rows.push([wkd&&Array.isArray(wkd.topups)?"ok":wkOff("wk:topups")?"warn":"info","السجل التلقائي للمزودين",wkd&&Array.isArray(wkd.topups)?"شغّال كل 15 دقيقة":wkOff("wk:topups")?wkWhy("wk:topups"):"أتحقق…",""]);
  const old=Object.entries((S.config&&S.config.manualSpeeds)||{}).filter(([,v])=>v&&v.at&&diffDays(v.at,t)>30);rows.push([old.length?"warn":"ok","سرعات كتبتها بنفسك",old.length?`${old.length} عمرها أكثر من 30 يوم`:"محدّثة",old.length?`<a class="btn sm ghost" href="#products">حدّثها</a>`:""]);
  const lb=(S.backups||[])[0];rows.push([lb?"ok":"info","آخر نسخة احتياطية",lb?esc(String(lb.at||lb.id).slice(0,10)):"تنحفظ تلقائي كل أسبوع",""]);
  if(!S.backups&&S.db)listBackups();
  const ic2={ok:"✓",warn:"!",bad:"×",info:"i"};
  return`<div class="card"><h3>فحص صحة البيانات <small>يتأكد إن الأرقام كاملة وصحيحة</small></h3><div class="list">${rows.map(r=>`<div class="li hl-row" style="grid-template-columns:auto minmax(0,1fr) auto"><span class="hl ${r[0]}" aria-hidden="true">${ic2[r[0]]}</span><div><b>${esc(r[1])}</b><div class="muted small">${r[2]}</div></div><div>${r[3]}</div></div>`).join("")}</div></div>`}

/* ================= 4. customise (this device only) ================= */
const HOME_SECS=[["today","اليوم وهدف الشهر"],["kpis","أرقام الفترة"],["chart","الرسم والتنبيهات"],["orders","آخر الطلبات"]];
function uiPrefs(){let u={};try{u=JSON.parse(localStorage.getItem("ff-ui")||"{}")}catch(e){}return{scale:u.scale||1,density:u.density||"comfy",accent:u.accent||"cy",order:Array.isArray(u.order)?u.order:HOME_SECS.map(x=>x[0]),hidden:Array.isArray(u.hidden)?u.hidden:[]}}
function saveUi(p){try{localStorage.setItem("ff-ui",JSON.stringify(p))}catch(e){}applyUi();S._lastSig=null;render()}
const ACCENTS={cy:["فيروزي",null,null],pk:["وردي","#FF3D7F","#D81B60"],pu:["بنفسجي","#9B8CFF","#5B47D6"],go:["ذهبي","#FFC857","#A86B00"]};
function applyUi(){const u=uiPrefs(),r=document.documentElement;r.style.setProperty("--ui-scale",u.scale);r.classList.toggle("compact",u.density==="compact");
  const a=ACCENTS[u.accent]||ACCENTS.cy;const light=r.getAttribute("data-theme")==="light";if(a[1]){r.style.setProperty("--cy",light?a[2]:a[1]);r.style.setProperty("--good",light?a[2]:a[1])}else{r.style.removeProperty("--cy");r.style.removeProperty("--good")}}
function applyHome(root){if(S.route!=="home"||!root)return;const u=uiPrefs();[...root.children].forEach(el=>{let k=null;if(el.querySelector(".card.hero"))k="today";else if(el.classList.contains("g4")&&el.querySelector(".kpi"))k="kpis";else if([...el.querySelectorAll("h3")].some(h=>h.textContent.includes("الإيرادات والصافي")))k="chart";else if([...el.querySelectorAll("h3")].some(h=>h.textContent.includes("آخر الطلبات")))k="orders";
  if(!k)return;el.style.order=String(u.order.indexOf(k)+1);if(u.hidden.includes(k))el.hidden=true})}
function customizeCard(){const u=uiPrefs();const seg=(name,opts,cur)=>`<div class="seg theme-seg" role="radiogroup">${opts.map(([v,l])=>`<button type="button" role="radio" aria-checked="${String(cur)===String(v)}" class="${String(cur)===String(v)?"on":""}" data-ui="${name}" data-v="${v}">${esc(l)}</button>`).join("")}</div>`;
  return`<div class="card"><h3>التخصيص <small>ينحفظ في هذا الجهاز بس</small></h3>
   <div class="field"><label>حجم الخط</label>${seg("scale",[["0.92","صغير"],["1","عادي"],["1.1","كبير"]],u.scale)}</div>
   <div class="field" style="margin-top:10px"><label>الكثافة</label>${seg("density",[["comfy","مريح"],["compact","مضغوط"]],u.density)}</div>
   <div class="field" style="margin-top:10px"><label>لون التمييز</label>${seg("accent",Object.entries(ACCENTS).map(([k,v])=>[k,v[0]]),u.accent)}</div>
   <div class="field" style="margin-top:10px"><label>أقسام الرئيسية</label><div class="list">${u.order.map((k,i)=>{const l=(HOME_SECS.find(x=>x[0]===k)||[k,k])[1];const hid=u.hidden.includes(k);return`<div class="li" style="grid-template-columns:minmax(0,1fr) auto"><label class="row" style="gap:8px;cursor:pointer"><input type="checkbox" data-ui-show="${k}" ${hid?"":"checked"}> ${esc(l)}</label><div class="row" style="gap:6px"><button type="button" class="btn sm ghost" data-ui-move="${k}" data-d="-1" ${i===0?"disabled":""} aria-label="لفوق">▲</button><button type="button" class="btn sm ghost" data-ui-move="${k}" data-d="1" ${i===u.order.length-1?"disabled":""} aria-label="لتحت">▼</button></div></div>`}).join("")}</div></div>
   <div class="row" style="margin-top:10px"><button type="button" class="btn sm ghost" data-ui-reset="1">رجّع الافتراضي</button></div></div>`}
document.addEventListener("click",(e)=>{const b=e.target.closest&&e.target.closest("[data-ui],[data-ui-move],[data-ui-reset]");if(!b)return;const u=uiPrefs();
  if(b.dataset.ui){u[b.dataset.ui]=b.dataset.ui==="scale"?+b.dataset.v:b.dataset.v}
  else if(b.dataset.uiMove){const i=u.order.indexOf(b.dataset.uiMove),j=i+(+b.dataset.d);if(j>=0&&j<u.order.length){[u.order[i],u.order[j]]=[u.order[j],u.order[i]]}}
  else{try{localStorage.removeItem("ff-ui")}catch(x){}applyUi();S._lastSig=null;render();return}
  saveUi(u)});
document.addEventListener("change",(e)=>{const c=e.target.closest&&e.target.closest("[data-ui-show]");if(!c)return;const u=uiPrefs();const k=c.dataset.uiShow;u.hidden=c.checked?u.hidden.filter(x=>x!==k):[...new Set([...u.hidden,k])];saveUi(u)});

/* ================= 5. alerts log ================= */
let alertT;
function logAlerts(list){if(!S.db||S.canWrite===false||!list.length)return;clearTimeout(alertT);alertT=setTimeout(async()=>{const t=riyadhToday();const cur=(S.alertLog[t]&&S.alertLog[t].items)||[];const have=new Set(cur.map(x=>x.text));
  const add=list.filter(a=>a[0]!=="mu"&&a[0]!=="cy"||/وصلت هدف|طلب كبير/.test(a[1])).filter(a=>!have.has(a[1])).map(a=>({kind:a[0],text:a[1],at:new Date().toISOString()}));if(!add.length)return;
  const items=[...cur,...add].slice(-60);S.alertLog[t]={day:t,items};try{await S.db.doc("alert_log/"+t).set({day:t,items})}catch(e){}},2500)}
function alertLogModal(){const days=Object.keys(S.alertLog).sort().reverse().slice(0,30);
  modal(`<h3>سجل التنبيهات <small class="muted">آخر 30 يوم</small></h3>${days.length?days.map(d=>`<div style="margin-top:10px"><b>${esc(dLabel(d))}</b>${S.alertLog[d].items.map(x=>`<div class="alert ${esc(x.kind)}" style="margin-top:6px"><i class="ic"></i><div>${esc(x.text)} <span class="muted small n">${esc(String(x.at||"").slice(11,16))}</span></div></div>`).join("")}</div>`).join(""):`<div class="muted">ما فيه تنبيهات محفوظة للحين.</div>`}<div class="row" style="margin-top:14px"><button class="btn ghost" type="button" data-close>إغلاق</button></div>`)}
let rq=0;function render(){cancelAnimationFrame(rq);rq=requestAnimationFrame(doRender)}
function doRender(){CALC_MEMO=new Map();COST_MEMO=new Map();
  const ready=S.loaded.has("config")&&S.loaded.has("products");
  renderNav();const route=ROUTES.find(r=>r[0]===S.route)||ROUTES[0];$("#ptitle").textContent=route[1];
  $("#periodSeg").querySelectorAll("button").forEach(b=>b.classList.toggle("on",b.dataset.p===S.period));
  $("#customBox").hidden=S.period!=="custom";
  const v=$("#view");const focusId=document.activeElement&&document.activeElement.id;const selS=document.activeElement&&document.activeElement.selectionStart;
  if(!S.db&&S.dbState!=="pending"){v.innerHTML=`<div class="card">${emptyState("قاعدة البيانات غير متاحة في هذا العرض","افتح الصفحة من claude.ai بحسابك عشان تشتغل المزامنة والحفظ.")}</div>`;return}
  if(!ready||!S.db){v.innerHTML=`<div class="grid g4">${'<div class="card"><div class="skel" style="height:14px;width:50%"></div><div class="skel" style="height:30px;margin-top:10px"></div></div>'.repeat(4)}</div><div class="card"><div class="skel" style="height:220px"></div></div>`;return}
  let html;try{html=PAGES[route[0]]()}catch(e){console.error(e);html=`<div class="card">${emptyState("صار خطأ في عرض الصفحة",String(e&&e.message||e))}</div>`}
  const keep={};if(!S.animate&&!S.noKeep)v.querySelectorAll("input[id],select[id],textarea[id]").forEach(el=>{if(el.type!=="file")keep[el.id]=el.value});
  const sig=S.route+"|"+S.period+"|"+(document.documentElement.dataset.theme||"")+"|"+html;
  if(!S.animate&&S._lastSig===sig&&v.firstElementChild){S.noKeep=false;return}
  S._lastSig=sig;
  v.innerHTML=`<div class="${S.animate?"page":""}">${html}</div>`;applyTabs(v.firstElementChild);applyHome(v.firstElementChild);
  for(const [id,val] of Object.entries(keep)){const el=document.getElementById(id);if(el&&v.contains(el)&&el.value!==val)el.value=val}
  S.noKeep=false;
  if(focusId){const el=document.getElementById(focusId);if(el&&el.tagName==="INPUT"&&el.type==="text"||el&&el.id==="oq"){el.focus();try{el.setSelectionRange(selS,selS)}catch(e){}}}
  afterRender();
}
function afterRender(){
  if(!S.splashDone&&S.loaded.has("config")){S.splashDone=true;setTimeout(()=>{const s=$("#splash");if(s)s.classList.add("out")},650)}
  if(S.animate)document.querySelectorAll("#view .page .card,#view .page>.row,#view .page>.alert").forEach((el,i)=>el.style.setProperty("--i",Math.min(i,14)));
  document.querySelectorAll("#view table").forEach(t=>{const hs=[...t.querySelectorAll("thead th")].map(th=>th.textContent.trim());t.classList.add("rsp");t.classList.toggle("wide",hs.length>=7);t.querySelectorAll("tbody tr,tfoot tr").forEach(tr=>[...tr.children].forEach((td,i)=>{if(hs[i]&&!td.hasAttribute("data-label"))td.setAttribute("data-label",hs[i])}))});
  const anim=S.animate&&!matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll("[data-count]").forEach(el=>{const to=+el.dataset.count,d=+el.dataset.dec||0;if(!anim){el.textContent=fmt(to,d);return}const t0=performance.now(),dur=1100;
    const step=(t)=>{const k=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-k,3);el.textContent=fmt(to*e,d);if(k<1)requestAnimationFrame(step)};requestAnimationFrame(step)});
  if(anim)requestAnimationFrame(()=>{document.querySelectorAll(".bar i[data-w],.goal-meter i[data-w]").forEach(b=>b.style.width=Math.max(0,Math.min(100,+b.dataset.w))+"%");document.querySelectorAll(".ring .rv").forEach(r=>r.style.strokeDashoffset=r.dataset.off)});
  else{document.querySelectorAll(".bar i[data-w],.goal-meter i[data-w]").forEach(b=>{b.style.transition="none";b.style.width=Math.max(0,Math.min(100,+b.dataset.w))+"%"});document.querySelectorAll(".ring .rv").forEach(r=>{r.style.transition="none";r.style.strokeDashoffset=r.dataset.off})}
  S.animate=false;
  if(S.route==="orders"&&S.mcp){const r=range();refreshLinks(ordersIn(r.from,r.to));readInvoiceQty(ordersIn(r.from,r.to))}
  if(S.mcp&&["ads","reports","home"].includes(S.route)){const r=range();readOrderMeta(ordersIn(r.from,r.to))}
  if(S.route==="products"&&S.mcp)refreshGlobalRates();
  if(S.db&&S.config&&!bkDone)setTimeout(autoBackup,4000);
  if(S.route==="reports"&&S.db&&!S.backups)listBackups();
  if(S.route==="products"&&!Object.keys(S.speeds).length)loadSpeeds();
  if(S.focusAmt){S.focusAmt=false;setTimeout(()=>{const f=$("#ex-amt");if(f){f.scrollIntoView({block:"center"});f.focus()}},120)}
}

/* ===================== data layer ===================== */
function subscribe(){
  const db=S.db;const mark=(k)=>{S.loaded.add(k);if(k==="config")S.fromCache=false;saveCache();render()};const err=(k)=>(e)=>{console.warn(k,e);S.loaded.add(k);render()};
  const coll=(path,key,fn)=>db.collection(path).onSnapshot(s=>{fn(s);mark(key)},err(key));
  db.doc("meta/config").onSnapshot(s=>{S.config=s.exists?s.data():null;mark("config")},err("config"));
  db.doc("meta/goals").onSnapshot(s=>{S.goals=s.exists?s.data():null;mark("goals")},err("goals"));
  db.doc("meta/lock").onSnapshot(s=>{S.lock=s.exists?s.data():null;S.loaded.add("lock")},()=>S.loaded.add("lock"));
  db.doc("meta/sync").onSnapshot(s=>{S.sync=s.exists?{...s.data()}:{};mark("sync");startLive()},err("sync"));
  coll("owner_moves","owner",s=>{S.owner=s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>String(b.date).localeCompare(String(a.date)))});
  coll("alert_log","alertlog",s=>{const o={};s.docs.forEach(d=>o[d.id]=d.data());S.alertLog=o});
  coll("experiments","experiments",s=>{S.experiments=s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>String(b.date).localeCompare(String(a.date)))});
  coll("order_info","oi",s=>{const o={};s.docs.forEach(d=>o[d.id]=d.data());S.oiDocs=o;S._omNew={};S._oqNew={};Object.values(o).forEach(d=>{Object.assign(S._omNew,d.m||{});Object.assign(S._oqNew,d.q||{})});mergeInfo()});
  coll("order_meta","om",s=>{const o={};s.docs.forEach(d=>o[d.id]=d.data());S._omOld=o;mergeInfo()});
  coll("order_qty","oq",s=>{const o={};s.docs.forEach(d=>o[d.id]=d.data());S._oqOld=o;mergeInfo()});
  coll("products","products",s=>{S.products=s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(a.order??99)-(b.order??99))});
  coll("expenses","expenses",s=>{S.expenses=s.docs.map(d=>({id:d.id,...d.data()}))});
  coll("recurring","recurring",s=>{S.recurring=s.docs.map(d=>({id:d.id,...d.data()}))});
  coll("forecasts","forecasts",s=>{S.forecasts=s.docs.map(d=>({id:d.id,...d.data()}))});
  coll("salla_days","salla",s=>{const o={};s.docs.forEach(d=>o[d.id]=d.data());S.salla=o;setTimeout(startLive,0)});
  coll("ads_days","ads",s=>{const o={};s.docs.forEach(d=>o[d.id]=d.data());S.ads=o});
  coll("fees_days","fees",s=>{const o={};s.docs.forEach(d=>o[d.id]=d.data());S.feesDays=o});
  db.doc("meta/supbal").onSnapshot(s=>{S.supbal=s.exists?s.data():{}},()=>{});
  coll("supplier","supplier",s=>{S.supplier=s.docs.map(d=>({id:d.id,...d.data()}))});
  coll("supplier_links","links",s=>{const o={};s.docs.forEach(d=>o[d.id]=d.data());S.links=o});
  setTimeout(()=>{if(!S.loaded.has("config")){S.loaded.add("config");S.loaded.add("products");toast("البيانات تتأخر في الوصول، أعرض اللي موجود","err");render()}},10000);
}
async function write(fn,okMsg){try{await fn();if(okMsg)toast(okMsg,"ok");return true}catch(e){console.error(e);toast(e&&e.code==="quota_exceeded"?"امتلأت سعة قاعدة البيانات":e&&e.code==="invalid_argument"?"ما عندك صلاحية تعديل هنا، أو البيانات غير صالحة":"ما انحفظ، جرّب مرة ثانية","err");return false}}
async function setConfig(patch){const c={...cfg(),...patch};await S.db.doc("meta/config").set(c)}

/* ===================== sync ===================== */
function mcpMsg(e,who){const c=e&&e.code;
  if(c==="server_not_connected")return `أضف ${who} من إعدادات claude.ai ← الموصلات`;
  if(c==="needs_reauth")return `أعد ربط ${who} من إعدادات claude.ai ← الموصلات`;
  if(c==="not_in_manifest"||c==="approval_required"||c==="consent_required")return `الصفحة تحتاج موافقتك على استخدام ${who}. اضغط مزامنة ووافق`;
  if(c==="selection_required")return `اختر حساب ${who} من النافذة اللي تطلع لك`;
  if(c==="server_unavailable")return `${who} ما يرد الحين، جرّب بعد شوي`;
  if(c==="tool_error")return `${who} رفض الطلب: ${String(e.message||"").slice(0,120)}`;
  return `تعذّر الاتصال بـ ${who}`;}
const CH_AR={tiktok:"تيك توك",direct:"مباشر",social:"تواصل اجتماعي",search:"محركات البحث",referral:"إحالة من موقع",email:"بريد",unknown:"غير معروف",pending:"جاري التحديد"};
const chName=(c)=>CH_AR[c]||c;
function attrOf(od){const sd=od.source_details||{},cp=od.campaign||{};const tt=(cp.platforms||[]).find(p=>p&&p.name==="tiktok");
  const txt=[sd.utm_source,sd.utm_medium,cp.source,cp.medium,sd.value].map(x=>String(x||"").toLowerCase()).join(" ");
  const isTT=!!(tt&&tt.touched_at)||/tiktok|tik-tok|tik_tok|ttclid/.test(txt)||String(sd.type||"").toLowerCase().includes("tiktok");
  return{ch:isTT?"tiktok":(String(sd.type||"").toLowerCase()||"unknown"),utm:String(sd.utm_source||cp.source||"").slice(0,60),camp:String(sd.utm_campaign||cp.campaign||"").slice(0,80),dev:String(sd.device||"").slice(0,20)}}
function paidSAR(o){const ra=o.payment_actions&&o.payment_actions.refund_action;if(!ra||!ra.paid_amount||ra.paid_amount.currency!=="SAR")return null;const paid=+ra.paid_amount.amount||0;const ref=ra.refund_amount&&ra.refund_amount.currency==="SAR"?(+ra.refund_amount.amount||0):0;return{paid,ref}}
function toSAR(o){const t=o.total||{};const a=+t.amount||0;if(!t.currency||t.currency==="SAR")return a;const r=+(o.exchange_rate&&o.exchange_rate.rate)||0;if(r)return Math.round(a*r*100)/100;const p=o.payment_actions&&o.payment_actions.refund_action&&o.payment_actions.refund_action.paid_amount;return p&&p.currency==="SAR"?+p.amount:a}
async function syncSalla(from,to,opt={}){
  if(!S.mcp||S.syncing.salla)return;S.syncing.salla=true;S.connErr.salla=null;render();
  try{const all=[];let page=1,total=1;
    do{const res=await S.mcp.callTool(SALLA,"orders_list",{from_date:from,to_date:to,page,sort_by:"created_at"},{cache:false});const p=res.payload||{};
      if(p.success===false)throw{code:"tool_error",message:p.message||"orders_list"};
      (p.data||[]).forEach(o=>all.push(o));total=(p.pagination&&p.pagination.totalPages)||1;page++}while(page<=total&&page<=120);
    const byDay={};for(const o of all){const ds=o.date&&o.date.date;if(!ds)continue;const day=String(ds).slice(0,10);if(day<from||day>to)continue;
      (byDay[day]=byDay[day]||{})[String(o.id)]={id:String(o.id),ref:String(o.reference_id||o.id),t:String(ds).slice(11,16),amount:toSAR(o),cur:(o.total&&o.total.currency)||"SAR",
        status:(o.status&&o.status.slug)||"",sname:(o.status&&(o.status.customized&&o.status.customized.name||o.status.name))||"",src:String(o.source||""),pay:String(o.payment_method||""),
        items:(o.items||[]).map(i=>({name:String(i.name||"").slice(0,120),qty:+i.quantity||1}))};
      const pd=paidSAR(o),rec=byDay[day][String(o.id)];if(pd){rec.total=rec.amount;rec.amount=Math.round((pd.paid-pd.ref)*100)/100;rec.refunded=pd.ref;rec.unpaid=pd.paid<=0&&rec.pay!=="free"}}
    const now=new Date().toISOString();
    for(const day of eachDay(from,to)){const orders=byDay[day]||{};if(!Object.keys(orders).length&&!S.salla[day])continue;await S.db.doc("salla_days/"+day).set({date:day,orders,syncedAt:now})}
    const st={...S.sync,lastSalla:now,v:SYNC_V};if(!S.sync.sallaFrom||from<S.sync.sallaFrom)st.sallaFrom=from;S.sync=st;await S.db.doc("meta/sync").set(st);
    try{const fr=await S.mcp.callTool(SALLA,"reports_sales_over_time",{grain:"day",from_date:from,to_date:to},{cache:false});const rows=(fr.payload&&fr.payload.rows)||[];
      for(const row of rows){const day=String(row.period||"").slice(0,10);if(!day)continue;const fee=+(row.details&&row.details.sales_epayment_fee)||0;const prev=S.feesDays[day];
        if(prev&&+prev.fee===fee&&+prev.orders===(+(row.details&&row.details.sales_count)||+row.orders||0))continue;await S.db.doc("fees_days/"+day).set({date:day,fee,orders:+(row.details&&row.details.sales_count)||+row.orders||0,sales:+row.sales||0,syncedAt:now})}}catch(e){console.warn("fees",e)}
    if(!opt.quiet)toast(`تمت مزامنة سلة: ${all.length} طلب`,"ok");
    setTimeout(()=>readOrderMeta(ordersIn(addDays(riyadhToday(),-60),riyadhToday())),800);
    setTimeout(()=>{const rr=range();readInvoiceQty(ordersIn(addDays(riyadhToday(),-60),riyadhToday()))},1500);
  }catch(e){console.warn(e);S.connErr.salla=mcpMsg(e,"سلة");if(!opt.quiet||e&&e.code!=="server_unavailable")toast(S.connErr.salla,"err")}
  finally{S.syncing.salla=false;render()}
}
async function syncTikTok(from,to,opt={}){
  if(!S.mcp||S.syncing.tiktok)return;const adv=cfg().tiktokAdvertiser;if(!adv){S.connErr.tiktok="اكتب رقم حساب تيك توك الإعلاني في الإعدادات ← خطة ميزانية الإعلان";render();return}S.syncing.tiktok=true;S.connErr.tiktok=null;render();
  try{let n=0;const now=new Date().toISOString();
    for(let s=from;s<=to;s=addDays(s,30)){const e=addDays(s,29)<to?addDays(s,29):to;
      const res=await S.mcp.callTool(TIKTOK,"report_integrated_get",{advertiser_id:adv,report_type:"BASIC",data_level:"AUCTION_ADVERTISER",dimensions:["advertiser_id","stat_time_day"],metrics:["spend","impressions","clicks","complete_payment","complete_payment_roas"],start_date:s,end_date:e,page_size:100},{cache:false});
      const p=res.payload||{};if(p.code&&p.code!==0)throw{code:"tool_error",message:p.message};const list=(p.data&&p.data.list)||p.list||[];
      for(const row of list){const day=String(row.dimensions&&row.dimensions.stat_time_day||"").slice(0,10);if(!day)continue;const m=row.metrics||{};
        await S.db.doc("ads_days/"+day).set({date:day,spend:+m.spend||0,impressions:+m.impressions||0,clicks:+m.clicks||0,purchases:+m.complete_payment||0,purchaseValue:Math.round((+m.complete_payment_roas||0)*(+m.spend||0)*100)/100,src:"tiktok",syncedAt:now});n++}}
    S.sync={...S.sync,lastTikTok:now};await S.db.doc("meta/sync").set(S.sync);if(!opt.quiet)toast(`تمت مزامنة تيك توك: ${n} يوم`,"ok");
  }catch(e){console.warn(e);S.connErr.tiktok=mcpMsg(e,"تيك توك");toast(S.connErr.tiktok,"err")}
  finally{S.syncing.tiktok=false;render()}
}
async function syncAll(from){const t=riyadhToday();from=from||addMonths(t,-1);await syncSalla(from,t);await syncTikTok(from,t)}
/* ---------- live: watch today's orders while the page is open ---------- */
let liveStarted=false,liveDay="",unwatch=null;S.lastLive=0;S.newIds=new Set();
function startLive(){
  if(liveStarted||!S.mcp||!S.db||!S.loaded.has("sync")||!S.loaded.has("salla"))return;liveStarted=true;
  const t=riyadhToday();const first=!S.sync.lastSalla;const stale=!first&&(+S.sync.v||1)<SYNC_V;
  const from=first?addMonths(t,-1):stale?(S.sync.sallaFrom||addMonths(t,-1)):addDays(String(S.sync.lastSalla).slice(0,10),-2);
  syncSalla(from<t?from:t,t,{quiet:!first})
    .then(()=>syncTikTok(S.sync.lastTikTok?addDays(t,-6):addMonths(t,-1),t,{quiet:!first}))
    .finally(watchToday);
  setInterval(()=>{if(riyadhToday()!==liveDay)watchToday();renderLive()},30000);
  setInterval(()=>{if(!document.hidden){const d=riyadhToday();syncTikTok(addDays(d,-1),d,{quiet:true})}},5*6e4);
}
function watchToday(){
  if(unwatch)try{unwatch()}catch(e){}
  liveDay=riyadhToday();const d=liveDay;
  unwatch=S.mcp.watchTool(SALLA,"orders_list",{from_date:d,to_date:d,sort_by:"created_at"},(ev)=>{
    if(ev.type==="error"){const c=ev.error&&ev.error.code;
      if(["needs_reauth","server_not_connected","not_in_manifest","approval_required","blocked_by_policy","consent_required","selection_required","not_granted"].includes(c)){S.connErr.salla=mcpMsg(ev.error,"سلة");S.lastLive=0;render()}
      return}
    S.lastLive=Date.now();S.connErr.salla=null;
    const p=(ev.result&&ev.result.payload)||{};const arr=p.data||[];const known=(S.salla[d]&&S.salla[d].orders)||{};
    const fresh=arr.filter(o=>!known[String(o.id)]&&String(o.date&&o.date.date||"").slice(0,10)===d);
    const changed=arr.some(o=>known[String(o.id)]&&known[String(o.id)].status!==((o.status&&o.status.slug)||""));
    const more=p.pagination&&+p.pagination.total>Object.keys(known).length;
    if(fresh.length||changed||more){syncSalla(d,d,{quiet:true}).then(()=>{fresh.forEach(announce)})}
    renderLive();
  },{refetchInterval:45000});
}
function announce(o){S.newIds.add(String(o.id));toast(`طلب جديد #${o.reference_id} · ${fmt(toSAR(o),2)} ر.س`,"ok");
  const h=document.querySelector(".hero");if(h){h.classList.remove("ping");void h.offsetWidth;h.classList.add("ping")}setTimeout(()=>S.newIds.delete(String(o.id)),60000)}
function renderLive(){const el=$("#liveChip");if(el)el.innerHTML=liveOn()?`<span class="live"><i></i>مباشر</span> <span class="livechip">آخر فحص لسلة ${esc(agoS(S.lastLive||S.sync.lastSalla))}</span>`:`<span class="live off"><i></i>غير متصل</span>`;
  const m=$("#syncMini");if(m)m.innerHTML=`<span class="live ${liveOn()?"":"off"}" style="padding:2px 8px"><i></i></span><span>${S.syncing.salla||S.syncing.tiktok?"جاري المزامنة…":"آخر تحديث "+esc(agoS(S.lastLive||S.sync.lastSalla))}</span>`}
function agoS(x){if(!x)return "لم يتم";const s=Math.round((Date.now()-new Date(x).getTime())/1000);if(s<60)return `قبل ${Math.max(1,s)} ث`;return ago(new Date(x).toISOString())}

/* ===================== modals ===================== */
function modal(html){const m=document.createElement("div");m.className="modal";m.innerHTML=`<div class="card" role="dialog" aria-modal="true">${html}</div>`;document.body.appendChild(m);
  m.addEventListener("click",e=>{if(e.target===m||e.target.closest("[data-close]"))m.remove()});const f=m.querySelector("input,select,button");if(f)f.focus();return m}
function confirmBox(text,onYes,yes="حذف"){const m=modal(`<h3>تأكيد</h3><p>${esc(text)}</p><div class="row"><button class="btn danger" id="cfYes">${esc(yes)}</button><button class="btn ghost" data-close>إلغاء</button></div>`);
  m.querySelector("#cfYes").onclick=async(e)=>{e.currentTarget.disabled=true;await onYes();m.remove()}}
function productModal(p,presetName){p=p||{type:presetName&&/تيك توك|انستقرام/.test(presetName)?"single":"pack",name:presetName||"",contents:{}};const c=p.contents||{};
  const m=modal(`<h3>${p.id?"تعديل منتج":"منتج جديد"}</h3><form class="form" id="prodForm">
   <div class="field" style="grid-column:1/-1"><label for="pd-name">الاسم كما في سلة</label><input class="inp" id="pd-name" required maxlength="120" value="${esc(p.name)}"></div>
   <div class="field"><label for="pd-type">النوع</label><select class="inp" id="pd-type"><option value="pack" ${p.type==="pack"?"selected":""}>بكج بكمية ثابتة</option><option value="single" ${p.type!=="pack"?"selected":""}>منفرد بكميات مختلفة</option></select></div>
   <div class="field"><label for="pd-price">${p.type==="pack"?"السعر":"سعر مرجعي"}</label><input class="inp n" id="pd-price" type="number" step="0.01" min="0" value="${esc(p.price??p.refPrice??"")}"></div>
   <div class="field pk-only"><label for="pd-v">مشاهدات</label><input class="inp n" id="pd-v" type="number" min="0" value="${esc(c.views||0)}"></div>
   <div class="field pk-only"><label for="pd-l">لايكات</label><input class="inp n" id="pd-l" type="number" min="0" value="${esc(c.likes||0)}"></div>
   <div class="field pk-only"><label for="pd-s">شير</label><input class="inp n" id="pd-s" type="number" min="0" value="${esc(c.shares||0)}"></div>
   <div class="field pk-only"><label for="pd-sv">حفظ</label><input class="inp n" id="pd-sv" type="number" min="0" value="${esc(c.saves||0)}"></div>
   <div class="field sg-only"><label for="pd-svc">الخدمة</label><select class="inp" id="pd-svc">${[["views","مشاهدات"],["likes","لايكات"],["shares","شير"],["saves","حفظ"]].map(([k,l])=>`<option value="${k}" ${p.service===k?"selected":""}>${l}</option>`).join("")}</select></div>
   <div class="field sg-only" style="grid-column:1/-1"><label for="pd-tiers">الكميات والأسعار (سطر لكل كمية: الكمية=السعر)</label><textarea class="inp n" id="pd-tiers" rows="5" style="direction:ltr;text-align:left">${esc((p.tiers||[]).map(t=>t.qty+"="+t.price).join("\n"))}</textarea></div>
   <div class="field sg-only"><label for="pd-pct">احتياط: تكلفة % من السعر إذا ما تطابق</label><input class="inp n" id="pd-pct" type="number" step="0.01" min="0" max="100" value="${esc(((+p.costPct||0)*100).toFixed(2))}"></div>
   <div class="rules-ed" hidden style="grid-column:1/-1"><div class="row" style="justify-content:space-between"><b>قواعد المزود</b><button class="btn sm cy" type="button" id="ruleAdd">${ic("plus")}إضافة خدمة</button></div>
    <div class="muted small" style="margin:4px 0 8px">مثل موقع التنفيذ: لكل خدمة المورد ورقمها والكمية. السعر يجي مباشرة من المورد.</div><div id="ruleRows"></div><div class="rule-total" id="ruleTotal"></div></div>
   <div class="field"><label for="pd-extra">تكلفة إضافية ثابتة للوحدة</label><input class="inp n" id="pd-extra" type="number" step="0.01" min="0" value="${esc(p.extraCost||0)}"></div>
   <div class="row" style="grid-column:1/-1"><button class="btn pri" type="submit">${ic("save")}حفظ</button><button class="btn ghost" type="button" data-close>إلغاء</button></div></form>`);
  const rowsEl=m.querySelector("#ruleRows");let rules=[];
  const isPack=()=>m.querySelector("#pd-type").value==="pack";
  const rowHTML=(x,i)=>`<div class="rule-row" data-i="${i}"><select class="inp" data-f="type" aria-label="الخدمة">${RULE_TYPES.map(t=>`<option value="${t[0]}" ${x.type===t[0]?"selected":""}>${t[1]}</option>`).join("")}</select>
    <select class="inp" data-f="supplier" aria-label="المورد">${SUPPLIERS.map(s=>`<option value="${s[0]}" ${x.supplier===s[0]?"selected":""}>${s[0]}</option>`).join("")}</select>
    <input class="inp n" data-f="serviceId" inputmode="numeric" placeholder="رقم الخدمة" value="${esc(x.serviceId||"")}" aria-label="رقم الخدمة">
    <input class="inp n qty-f" data-f="qty" type="number" min="0" placeholder="الكمية" value="${esc(x.qty??"")}" aria-label="الكمية" ${isPack()?"":"hidden"}>
    <button class="btn sm danger" type="button" data-rm="${i}" aria-label="حذف">${ic("trash")}</button><div class="rule-info" data-info="${i}"></div></div>`;
  const info=(x)=>{if(!x.serviceId)return`<span class="muted small">اكتب رقم الخدمة</span>`;const r=S.svc.get(x.supplier+":"+x.serviceId);
    if(r&&typeof r==="object"){if(r.rate_sar!=null)x.rate_sar=r.rate_sar;x.name=r.name}
    if(r==="loading"||(!r&&S.mcp))return`<span class="muted small"><i class="spin" style="width:11px;height:11px;vertical-align:middle"></i> أجيب السعر…</span>`;
    if(r==="missing")return`<span class="neg small">الرقم غير موجود عند ${esc(x.supplier)}</span>`;if(r==="error")return`<span class="neg small">${esc(S.supErr||"تعذّر جلب السعر")}</span>`;
    const c=isPack()?(+x.qty||0)/1000*(+x.rate_sar||0):null;return`<span class="small">${esc((x.name||"").slice(0,70))}</span> <span class="tag cy n">${fmt(x.rate_sar,4)} / 1,000</span>${c!=null?` <span class="tag n">= ${fmt(c,4)} ر.س</span>`:""}`};
  const total=()=>{const t=m.querySelector("#ruleTotal");if(!rules.length){t.innerHTML=`<span class="muted small">بدون قواعد: التكلفة من الكميات تحت وأسعار المورد العامة.</span>`;return}
    t.innerHTML=isPack()?`تكلفة البكج: <b class="n">${fmt(rulesCost(rules)+(+m.querySelector("#pd-extra").value||0),4)}</b> ر.س`:`المنفرد: التكلفة = الكمية المطلوبة ÷ 1,000 × سعر الخدمة`};
  const draw=()=>{rowsEl.innerHTML=rules.map(rowHTML).join("");rules.forEach((x,i)=>{const el=rowsEl.querySelector(`[data-info="${i}"]`);el.innerHTML=info(x);if(x.serviceId&&!S.svc.has(x.supplier+":"+x.serviceId))lookupSvc(x.supplier,x.serviceId).then(()=>{const e2=rowsEl.querySelector(`[data-info="${i}"]`);if(e2)e2.innerHTML=info(x);total()})});total()};
  const rT={};
  rowsEl.addEventListener("input",(e)=>{const row=e.target.closest(".rule-row");if(!row)return;const i=+row.dataset.i,f=e.target.dataset.f;if(!f)return;let val=e.target.value;if(f==="serviceId"){val=val.replace(/[^0-9]/g,"");e.target.value=val}rules[i][f]=f==="qty"?+val:val;
    const x=rules[i];const el=rowsEl.querySelector(`[data-info="${i}"]`);if(f==="qty"){el.innerHTML=info(x);total();return}clearTimeout(rT[i]);el.innerHTML=info(x);
    rT[i]=setTimeout(()=>{if(x.serviceId)lookupSvc(x.supplier,x.serviceId).then(()=>{el.innerHTML=info(x);total()})},450)});
  rowsEl.addEventListener("change",(e)=>{const row=e.target.closest(".rule-row");if(!row||e.target.tagName!=="SELECT")return;const i=+row.dataset.i;rules[i][e.target.dataset.f]=e.target.value;const x=rules[i];const el=rowsEl.querySelector(`[data-info="${i}"]`);el.innerHTML=info(x);if(x.serviceId)lookupSvc(x.supplier,x.serviceId).then(()=>{el.innerHTML=info(x);total()})});
  rowsEl.addEventListener("click",(e)=>{const b=e.target.closest("[data-rm]");if(!b)return;rules.splice(+b.dataset.rm,1);draw()});
  m.querySelector("#ruleAdd").onclick=()=>{const used=new Set(rules.map(r=>r.type));const t=(RULE_TYPES.find(t=>!used.has(t[0]))||RULE_TYPES[0])[0];const dsv=(svcMap()[t])||{sup:"drd3m",id:""};rules.push({type:t,supplier:dsv.sup,serviceId:dsv.id||"",qty:isPack()?+((p.contents||{})[t]||0):null});draw()};
  m.querySelector("#pd-extra").addEventListener("input",total);
  const sync=()=>{const pk=isPack();m.querySelectorAll(".pk-only").forEach(x=>x.hidden=!pk||rules.length>0);m.querySelectorAll(".sg-only").forEach(x=>x.hidden=pk);rowsEl.querySelectorAll(".qty-f").forEach(x=>x.hidden=!pk);total()};
  draw();sync();m.querySelector("#pd-type").onchange=sync;rowsEl.addEventListener("click",()=>setTimeout(sync,0));m.querySelector("#ruleAdd").addEventListener("click",()=>setTimeout(sync,0));
  m.querySelector("#prodForm").onsubmit=async(e)=>{e.preventDefault();const b=e.submitter;if(b)b.disabled=true;const pk=m.querySelector("#pd-type").value==="pack",price=+m.querySelector("#pd-price").value||0;
    const doc={name:m.querySelector("#pd-name").value.trim(),type:pk?"pack":"single",extraCost:+m.querySelector("#pd-extra").value||0,order:p.order??99,aliases:p.aliases||[]};
    if(pk){doc.price=price;doc.contents={views:+m.querySelector("#pd-v").value||0,likes:+m.querySelector("#pd-l").value||0,shares:+m.querySelector("#pd-s").value||0,saves:+m.querySelector("#pd-sv").value||0}}else{doc.refPrice=price;doc.costPct=(+m.querySelector("#pd-pct").value||0)/100;doc.service=m.querySelector("#pd-svc").value;doc.tiers=m.querySelector("#pd-tiers").value.split(/\n+/).map(l=>l.split(/[=:،,]/).map(x=>+String(x).replace(/[^0-9.]/g,""))).filter(([q,pr])=>q>0&&pr>0).map(([qty,price])=>({qty,price}))}
    if(!doc.name){toast("اكتب اسم المنتج","err");if(b)b.disabled=false;return}
    doc.rules=[];doc.rulesHistory=[];doc.needsReview=false;
    const dup=productsList().find(x=>x.name===doc.name&&x.id!==p.id);if(dup){toast("فيه منتج بنفس الاسم","err");if(b)b.disabled=false;return}
    if(await write(()=>S.db.doc("products/"+(p.id||uid())).set(doc),"انحفظ المنتج"))m.remove();else if(b)b.disabled=false}}
function recModal(x){x=x||{};const t=riyadhToday();const m=modal(`<h3>${x.id?"تعديل اشتراك":"اشتراك ثابت جديد"}</h3><form class="form" id="recForm">
  <div class="field" style="grid-column:1/-1"><label for="rc-t">البند</label><input class="inp" id="rc-t" required maxlength="60" value="${esc(x.title||"")}"></div>
  <div class="field"><label for="rc-a">المبلغ الشهري</label><input class="inp n" id="rc-a" type="number" step="0.01" min="0.01" required value="${esc(x.amount??"")}"></div>
  <div class="field"><label for="rc-s">يبدأ من شهر</label><input class="inp" id="rc-s" type="month" value="${esc(x.startMonth||t.slice(0,7))}"></div>
  <div class="field"><label for="rc-day">يوم الخصم من الشهر</label><input class="inp n" id="rc-day" type="number" min="1" max="28" placeholder="مثال: 15" value="${esc(x.chargeDay??"")}"></div>
  <div class="field"><label for="rc-e">ينتهي (اختياري)</label><input class="inp" id="rc-e" type="month" value="${esc(x.endMonth||"")}"></div>
  <div class="field"><label for="rc-on">الحالة</label><select class="inp" id="rc-on"><option value="1" ${x.active!==false?"selected":""}>فعّال</option><option value="0" ${x.active===false?"selected":""}>موقوف</option></select></div>
  <div class="row" style="grid-column:1/-1"><button class="btn pri" type="submit">${ic("save")}حفظ</button><button class="btn ghost" type="button" data-close>إلغاء</button></div></form>`);
  m.querySelector("#recForm").onsubmit=async(e)=>{e.preventDefault();const b=e.submitter;if(b)b.disabled=true;const doc={title:m.querySelector("#rc-t").value.trim(),amount:+m.querySelector("#rc-a").value,startMonth:m.querySelector("#rc-s").value||null,endMonth:m.querySelector("#rc-e").value||null,active:m.querySelector("#rc-on").value==="1",chargeDay:+m.querySelector("#rc-day").value||null};
    if(await write(()=>S.db.doc("recurring/"+(x.id||uid())).set(doc),"انحفظ"))m.remove();else if(b)b.disabled=false}}
function fcModal(x){x=x||{};const t=riyadhToday();const m=modal(`<h3>${x.id?"تعديل توقع":"توقع جديد"} <span class="tag fc">توقع</span></h3><form class="form" id="fcForm">
  <div class="field"><label for="fc-m">الشهر</label><input class="inp" id="fc-m" type="month" required value="${esc(x.month||addMonths(t,1).slice(0,7))}"></div>
  <div class="field"><label for="fc-s">مبيعات متوقعة</label><input class="inp n" id="fc-s" type="number" min="0" required value="${esc(x.sales??"")}"></div>
  <div class="field"><label for="fc-a">إعلان متوقع</label><input class="inp n" id="fc-a" type="number" min="0" value="${esc(x.ads??"")}"></div>
  <div class="field" style="grid-column:1/-1"><label for="fc-n">ملاحظة</label><input class="inp" id="fc-n" maxlength="120" value="${esc(x.note||"")}"></div>
  <div class="row" style="grid-column:1/-1"><button class="btn pri" type="submit">${ic("save")}حفظ</button><button class="btn ghost" type="button" data-close>إلغاء</button></div></form>`);
  m.querySelector("#fcForm").onsubmit=async(e)=>{e.preventDefault();const b=e.submitter;if(b)b.disabled=true;const month=m.querySelector("#fc-m").value;const ex=S.forecasts.find(f=>f.month===month&&f.id!==x.id);
    if(ex){toast("فيه توقع لنفس الشهر، عدّله بدل ما تضيف جديد","err");if(b)b.disabled=false;return}
    const doc={month,sales:+m.querySelector("#fc-s").value||0,ads:+m.querySelector("#fc-a").value||0,note:m.querySelector("#fc-n").value.trim(),kind:"forecast"};
    if(await write(()=>S.db.doc("forecasts/"+(x.id||month)).set(doc),"انحفظ التوقع"))m.remove();else if(b)b.disabled=false}}

/* ===================== export ===================== */
const libs={};function loadScript(src){if(libs[src])return libs[src];libs[src]=new Promise((ok,no)=>{const s=document.createElement("script");s.src=src;s.onload=ok;s.onerror=()=>{delete libs[src];no(new Error("load "+src))};document.head.appendChild(s)});return libs[src]}
async function saveFile(name,data){if(!S.dl){toast("التنزيل غير متاح في هذا العرض","err");return}try{await S.dl.save({filename:name,data});toast("جاهز","ok")}catch(e){if(e&&e.code!=="declined")toast(e&&e.code==="rate_limited"?"فيه تنزيل مفتوح، كمّله أول":"ما قدرت أجهز الملف","err")}}
function fileTag(){const r=range();return `${r.from}_${r.to}`}
async function exportXlsx(){toast("أجهز ملف Excel…","ok");try{await loadScript("https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js")}catch(e){toast("ما قدرت أحمّل أداة Excel","err");return}
  const r=range(),R=calc(r.from,r.to),T=R.T,X=window.XLSX,wb=X.utils.book_new();const add=(name,rows)=>{const ws=X.utils.aoa_to_sheet(rows);ws["!views"]=[{RTL:true}];X.utils.book_append_sheet(wb,ws,name)};
  add("الملخص",[["فلاش ستور — الملخص المالي"],["الفترة",r.from+" → "+r.to],[],["البند","القيمة"],["الإيرادات",+T.rev.toFixed(2)],["تكلفة المنتجات",+T.cost.toFixed(2)],["رسوم سلة",+T.fees.toFixed(2)],["الإعلانات",+T.adsAll.toFixed(2)],["مصروفات أخرى",+T.other.toFixed(2)],["صافي الربح",+T.net.toFixed(2)],["هامش الربح %",isFinite(T.margin)?+(T.margin*100).toFixed(2):""],["الطلبات",T.orders],["متوسط قيمة الطلب",+T.aov.toFixed(2)],["ROAS",isFinite(T.roas)?+T.roas.toFixed(2):""],["CPA",isFinite(T.cpa)?+T.cpa.toFixed(2):""]]);
  add("يومي",[["اليوم","الإيرادات","الطلبات","تكلفة المنتجات","رسوم سلة","الإعلانات","مصروفات","اشتراكات","الصافي"],...R.days.map(d=>{const x=R.D[d];return[d,+x.rev.toFixed(2),x.orders,+x.cost.toFixed(2),+x.fees.toFixed(2),+x.ads.toFixed(2),+x.exp.toFixed(2),+x.rec.toFixed(2),+x.net.toFixed(2)]})]);
  add("الطلبات",[["رقم الطلب","التاريخ","الوقت","المنتجات","المبلغ (ر.س)","رسوم سلة","تكلفة المورد","الصافي","الحالة"],...R.orders.map(o=>{const c=orderCost(o),f=feeOf(o.amount);return[o.ref,o.day,o.t,(o.items||[]).map(i=>i.name+" ×"+i.qty).join("، "),o.amount,+f.toFixed(2),+c.cost.toFixed(2),+(o.amount-c.cost-f).toFixed(2),o.sname||o.status]})]);
  add("المصروفات",[["التاريخ","البيان","التصنيف","المبلغ","ملاحظة"],...S.expenses.filter(e=>e.date>=r.from&&e.date<=r.to).map(e=>[e.date,e.title,CATMAP[e.category]||e.category,+e.amount,e.note||""])]);
  add("الإعلانات",[["اليوم","الصرف","الظهور","الضغطات","مشتريات تيك توك"],...R.days.filter(d=>S.ads[d]).map(d=>{const a=S.ads[d];return[d,+a.spend,+a.impressions,+a.clicks,+a.purchases]})]);
  add("المنتجات",[["المنتج","النوع","السعر","تكلفة الوحدة","رسوم سلة","الصافي","الهامش %"],...productsList().map(p=>{const pr=+p.price||+p.refPrice||0,c=prodCostOf(p),f=feeOf(pr);return[p.name,p.type==="pack"?"بكج":"منفرد",pr,+c.toFixed(3),+f.toFixed(3),+(pr-c-f).toFixed(2),pr?+((pr-c-f)/pr*100).toFixed(1):""]})]);
  add("التوقعات",[["الشهر","مبيعات متوقعة","إعلان متوقع","ملاحظة"],...S.forecasts.map(f=>[f.month,f.sales,f.ads,f.note||""])]);
  const out=X.write(wb,{bookType:"xlsx",type:"array"});await saveFile(`flash-finance_${fileTag()}.xlsx`,new Blob([out]))}
async function exportPdf(){toast("أجهز تقرير PDF…","ok");try{await loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js");await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js")}catch(e){toast("ما قدرت أحمّل أداة PDF","err");return}
  const r=range(),T=calc(r.from,r.to).T,root=$("#pdfRoot");root.hidden=false;
  root.innerHTML=`<div style="display:flex;align-items:center;gap:12px;margin-bottom:16px"><img src="${$("#logo").src}" style="width:44px;height:44px;border-radius:12px"><div><h1>فلاش ستور — التقرير المالي</h1><div style="color:#8E89B3">${esc(r.from)} → ${esc(r.to)} · أُنشئ ${esc(riyadhToday())}</div></div></div>
   <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:18px">${[["الإيرادات",T.rev],["صافي الربح",T.net],["الطلبات",T.orders],["هامش الربح %",T.margin*100]].map(x=>`<div style="background:#16142A;border:1px solid #241F45;border-radius:14px;padding:12px"><div style="color:#C2BEDD;font-size:12px">${x[0]}</div><div style="font-size:22px;font-weight:800">${isFinite(x[1])?fmt(x[1],x[0].includes("%")?1:0):"—"}</div></div>`).join("")}</div>
   <table><thead><tr><th>البند</th><th class="n">ر.س</th></tr></thead><tbody>${plRows(T).map(x=>`<tr><td>${x[0]}</td><td class="n">${x[2]==="pct"?(isFinite(x[1])?fmt(x[1]*100,1)+"%":"—"):fmt(x[1],2)}</td></tr>`).join("")}</tbody></table>
   <div style="margin-top:14px;color:#8E89B3;font-size:11px">المصدر: طلبات سلة وتقارير تيك توك للأعمال والمصروفات المسجلة. التوقعات غير مشمولة.</div>`;
  try{await document.fonts.ready;const cv=await window.html2canvas(root,{backgroundColor:"#0B0A12",scale:2});const {jsPDF}=window.jspdf;const pdf=new jsPDF({unit:"pt",format:"a4"});const pw=pdf.internal.pageSize.getWidth(),ph=pw*cv.height/cv.width;
    pdf.setFillColor(11,10,18);pdf.rect(0,0,pw,pdf.internal.pageSize.getHeight(),"F");pdf.addImage(cv.toDataURL("image/png"),"PNG",0,0,pw,ph);await saveFile(`flash-report_${fileTag()}.pdf`,pdf.output("arraybuffer"))}
  catch(e){console.error(e);toast("ما قدرت أجهز PDF","err")}finally{root.hidden=true;root.innerHTML=""}}
async function backup(){const data={app:"flash-finance",version:1,exportedAt:new Date().toISOString(),meta:{config:S.config,goals:S.goals,sync:S.sync},products:S.products,expenses:S.expenses,recurring:S.recurring,forecasts:S.forecasts,salla_days:S.salla,ads_days:S.ads};
  await saveFile(`flash-backup_${riyadhToday()}.json`,JSON.stringify(data))}
async function restore(file){let data;try{data=JSON.parse(await file.text())}catch(e){toast("الملف مو JSON صالح","err");return}
  if(!data||data.app!=="flash-finance"){toast("هذا مو ملف نسخة احتياطية من النظام","err");return}
  const n=(data.products||[]).length+(data.expenses||[]).length+Object.keys(data.salla_days||{}).length;
  confirmBox(`استرجاع ${n} سجل من نسخة ${String(data.exportedAt||"").slice(0,10)}. السجلات بنفس المعرّف تنكتب فوقها.`,async()=>{
    const put=async(path,obj)=>{if(obj)await S.db.doc(path).set(obj)};
    try{await put("meta/config",data.meta&&data.meta.config);await put("meta/goals",data.meta&&data.meta.goals);
      for(const k of ["products","expenses","recurring","forecasts"])for(const x of (data[k]||[])){const {id,...rest}=x;if(id)await put(k+"/"+id,rest)}
      for(const [d,v] of Object.entries(data.salla_days||{}))await put("salla_days/"+d,v);for(const [d,v] of Object.entries(data.ads_days||{}))await put("ads_days/"+d,v);toast("تم الاسترجاع","ok")}
    catch(e){console.error(e);toast("توقف الاسترجاع في النص، أعد المحاولة","err")}},"استرجاع")}

/* ===================== events ===================== */
let routeT;function onRoute(){const v=$("#view");if(v&&v.firstChild&&!matchMedia("(prefers-reduced-motion: reduce)").matches){v.classList.add("leaving");clearTimeout(routeT);routeT=setTimeout(()=>{v.classList.remove("leaving");doRoute()},220);return}doRoute()}
function doRoute(){const h=(location.hash||"").slice(1);S.route=ROUTES.some(r=>r[0]===h)?h:"home";S.animate=true;S.editExp=S.pendingExp||null;S.pendingExp=null;document.body.classList.remove("nav-open");window.scrollTo(0,0);render()}
addEventListener("hashchange",onRoute);
document.addEventListener("click",async(e)=>{const a=e.target.closest("[data-act]");if(!a)return;const act=a.dataset.act,id=a.dataset.id;
  if(act==="sync-all")return syncAll();
  if(act==="sync-salla"){const t=riyadhToday();return syncSalla(S.sync.lastSalla?addDays(t,-7):addMonths(t,-1),t)}
  if(act==="sync-tiktok"){const t=riyadhToday();return syncTikTok(S.sync.lastTikTok?addDays(t,-7):addMonths(t,-1),t)}
  if(act==="exp-edit"){S.editExp=S.expenses.find(x=>x.id===id)||null;S.noKeep=true;render();setTimeout(()=>{const f=$("#ex-title");if(f){f.scrollIntoView({behavior:"smooth",block:"center"});f.focus()}},60);return}
  if(act==="exp-cancel"){S.editExp=null;S.noKeep=true;return render()}
  if(act==="exp-del"){const x=S.expenses.find(y=>y.id===id);return confirmBox(`حذف «${x?x.title:""}» بمبلغ ${x?fmt(x.amount,2):""}؟`,()=>write(()=>S.db.doc("expenses/"+id).delete(),"انحذف"))}
  if(act==="rec-add")return recModal();if(act==="rec-edit")return recModal(S.recurring.find(x=>x.id===id));
  if(act==="rec-del")return confirmBox("حذف هذا الاشتراك؟ ينشال من حساب كل الفترات.",()=>write(()=>S.db.doc("recurring/"+id).delete(),"انحذف"));
  if(act==="prod-sel")return selectProd(id);
  if(act==="plan-reset"){const g={...(S.goals||{})};delete g.plan;S.goals=g;return write(()=>S.db.doc("meta/goals").set(g),"رجعت الخطة لأرقامك الفعلية").then(()=>{S._lastSig=null;render()})}
  if(act==="alert-log")return alertLogModal();
  if(act==="spd-set"){const key=a.dataset.sup+":"+a.dataset.id;const cur=(S.config&&S.config.manualSpeeds||{})[key];const h=cur?Math.floor(cur.m/60):"",mi=cur?cur.m%60:"";
    const m=modal(`<h3>السرعة التقريبية</h3><div class="muted small" style="margin-bottom:10px">${esc(a.dataset.sup)} · رقم <b class="n">${esc(a.dataset.id)}</b><br>${esc(String(a.dataset.name||"").slice(0,90))}</div>
      <div class="muted small" style="margin-bottom:10px">افتح الخدمة في موقع ${esc(a.dataset.sup)} وانسخ «السرعة التقريبية» اللي تحت الكمية.</div>
      <form class="form" id="spdForm"><div class="field"><label for="sp-h">ساعات</label><input class="inp n" id="sp-h" type="number" min="0" max="720" value="${h}" inputmode="numeric"></div><div class="field"><label for="sp-m">دقائق</label><input class="inp n" id="sp-m" type="number" min="0" max="59" value="${mi}" inputmode="numeric"></div>
      <div class="row"><button class="btn pri" type="submit">${ic("save")}حفظ</button>${cur?'<button class="btn ghost" type="button" id="spDel">مسح</button>':""}<button class="btn ghost" type="button" data-close>إلغاء</button></div></form>`);
    const save=(val)=>{const all={...((S.config&&S.config.manualSpeeds)||{})};if(val==null)delete all[key];else all[key]=val;S.config={...S.config,manualSpeeds:all};return write(()=>S.db.doc("meta/config").update({manualSpeeds:all}),val==null?"انمسحت السرعة":"انحفظت السرعة").then(()=>{m.remove();render()})};
    m.querySelector("#spdForm").addEventListener("submit",(e)=>{e.preventDefault();const tot=(+m.querySelector("#sp-h").value||0)*60+(+m.querySelector("#sp-m").value||0);if(!(tot>0)){toast("اكتب الساعات أو الدقائق","err");return}save({m:Math.round(tot),at:riyadhToday()})});
    const d=m.querySelector("#spDel");if(d)d.onclick=()=>save(null);return}
  if(act==="own-del")return confirmBox("حذف الحركة؟",()=>write(()=>S.db.doc("owner_moves/"+id).delete(),"انحذفت"));
  if(act==="use-svc"){S.tabs.products="services";const k=a.dataset.k;render();setTimeout(()=>{const s=$("#sv-sup-"+k),i=$("#sv-id-"+k);if(s&&i){s.value=a.dataset.sup;i.value=a.dataset.id;i.dispatchEvent(new Event("input",{bubbles:true}));s.dispatchEvent(new Event("change",{bubbles:true}));i.scrollIntoView({behavior:"smooth",block:"center"});toast("حطيت الخدمة في النموذج. راجعها واضغط حفظ لو تبيها","ok")}},120);return}
  if(act==="xp-del")return confirmBox("حذف التجربة؟",()=>write(()=>S.db.doc("experiments/"+id).delete(),"انحذفت"));
  if(act==="bk-dl"){const b=(S.backups||[]).find(x=>x.id===id);if(!b)return;if(!S.dl){toast("التنزيل غير متاح هنا","err");return}S.dl.save({filename:`flash-backup-${b.id}.json`,data:new Blob([b.json],{type:"application/json"})}).then(()=>toast("تنزّلت النسخة","ok")).catch(()=>{});return}
  if(act==="cust-ex"||act==="cust-in"){const cur=((S.config&&S.config.excludedCustomers)||[]).map(String);const nx=act==="cust-ex"?[...new Set([...cur,String(id)])]:cur.filter(x=>x!==String(id));
    const go=()=>write(()=>S.db.doc("meta/config").update({excludedCustomers:nx}),act==="cust-ex"?"استبعدت طلبات العميل":"رجعت طلبات العميل");
    return act==="cust-ex"?confirmBox("استبعاد كل طلبات هذا العميل من الحسابات؟ مفيد لو هو أنت أو حساب تجربة. تقدر ترجعها بأي وقت.",go,"استبعاد"):go()}
  if(act==="excl"||act==="unexcl"){const cur=((S.config&&S.config.excludedOrders)||[]).map(String);const nx=act==="excl"?[...new Set([...cur,String(id)])]:cur.filter(x=>x!==String(id));
    const go=()=>write(()=>S.db.doc("meta/config").update({excludedOrders:nx}),act==="excl"?"استبعدت الطلب من الحسابات":"رجع الطلب للحسابات");
    return act==="excl"?confirmBox("استبعاد هذا الطلب من المبيعات والتكاليف؟ (تقدر ترجعه بأي وقت)",go,"استبعاد"):go()}
  if(act==="prod-new")return productModal(null,a.dataset.name);if(act==="prod-edit")return productModal(productsList().find(x=>x.id===id));
  if(act==="prod-del")return confirmBox("حذف المنتج؟ طلباته تصير بدون تكلفة.",()=>write(()=>S.db.doc("products/"+id).delete(),"انحذف"));
  if(act==="fc-add")return fcModal();if(act==="fc-edit")return fcModal(S.forecasts.find(x=>x.id===id));
  if(act==="fc-del")return confirmBox("حذف التوقع؟",()=>write(()=>S.db.doc("forecasts/"+id).delete(),"انحذف"));
  if(act==="pg"){S.ordersPage=Math.max(1,+a.dataset.p);return render()}
  if(act==="lnk"){const r=range();const o=ordersIn(addDays(r.from,-400),riyadhToday()).find(x=>x.id===id)||ordersIn("2000-01-01","2999-12-31").find(x=>x.id===id);if(o)linkModal(o);return}
  if(act==="comp"){S.pendingExp={date:riyadhToday(),category:"refund",title:"تعويض طلب #"+a.dataset.ref,orderRef:a.dataset.ref};S.focusAmt=true;location.hash="expenses";return}
  if(act==="sup-add")return supModal();
  if(act==="sup-low"){const m=modal(`<h3>حد تنبيه الرصيد</h3><form class="form" id="lowForm"><div class="field"><label for="lw">نبهني إذا رصيد أي مورد أقل من (ر.س)</label><input class="inp n" id="lw" type="number" min="0" value="${esc(cfg().supplierLow||20)}"></div><div class="row"><button class="btn pri" type="submit">حفظ</button><button class="btn ghost" type="button" data-close>إلغاء</button></div></form>`);m.querySelector("#lowForm").onsubmit=async(e)=>{e.preventDefault();if(await write(()=>setConfig({supplierLow:+m.querySelector("#lw").value||0}),"انحفظ"))m.remove()};return}if(act==="sup-del")return confirmBox("حذف هذي الحركة؟",()=>write(()=>S.db.doc("supplier/"+id).delete(),"انحذف"));
  if(act==="x-xlsx")return exportXlsx();if(act==="x-pdf")return exportPdf();
  if(act==="rep-pdf"||act==="rep-xlsx"){S.period="prev";try{localStorage.setItem("ff-period","prev")}catch(e){}render();setTimeout(()=>act==="rep-pdf"?exportPdf():exportXlsx(),400);return}if(act==="x-backup")return backup();
});
let lastExpKey="",dupOk=false;
document.addEventListener("submit",async(e)=>{const f=e.target;e.preventDefault();const b=f.querySelector('[type="submit"]');const v=(id)=>{const el=f.querySelector("#"+id);return el?el.value:""};
  if(f.id==="expForm"){const doc={date:v("ex-date"),category:v("ex-cat"),title:v("ex-title").trim(),amount:Math.round((+v("ex-amt")||0)*100)/100,note:v("ex-note").trim(),orderRef:v("ex-ref").replace(/[^0-9]/g,"")||null};
    if(!doc.date||!doc.title||!(doc.amount>0)){toast("كمّل التاريخ والبيان والمبلغ","err");return}
    const key=[doc.date,doc.category,doc.amount,doc.title.replace(/\s+/g," ")].join("|");const editing=S.editExp&&S.editExp.id;
    const dup=S.expenses.find(x=>x.id!==editing&&[x.date,x.category,+x.amount,String(x.title).replace(/\s+/g," ")].join("|")===key);
    if(dup&&!(dupOk&&lastExpKey===key)){lastExpKey=key;dupOk=true;$("#dupWarn").innerHTML=`<span class="tag pk">فيه مصروف مطابق بنفس اليوم. اضغط مرة ثانية إذا هو فعلًا عملية جديدة</span>`;return}
    dupOk=false;lastExpKey="";b.disabled=true;const id=editing||uid();doc.key=key;doc.createdAt=(S.editExp&&S.editExp.createdAt)||new Date().toISOString();doc.updatedAt=new Date().toISOString();
    if(await write(()=>S.db.doc("expenses/"+id).set(doc),editing?"انحفظ التعديل":"انضاف المصروف")){S.editExp=null;S.noKeep=true;f.reset();render()}else b.disabled=false;return}
  if(f.id==="ratesForm"){b.disabled=true;const services={};SVC_TYPES.forEach(([k])=>services[k]={sup:v("sv-sup-"+k),id:v("sv-id-"+k).trim()});
    const rates={views:+v("rt-views")||0,likes:+v("rt-likes")||0,shares:+v("rt-shares")||0,saves:+v("rt-saves")||0};
    let hist=((S.config&&S.config.rateHistory)||[]).slice();if(!hist.length)hist.push({from:"2000-01-01 00:00",rates:{...cfg().rates},services:svcMap()});
    const last=hist[hist.length-1];const changed=JSON.stringify(last.rates)!==JSON.stringify(rates)||JSON.stringify(last.services)!==JSON.stringify(services);
    if(changed)hist.push({from:riyadhNowStr(),rates,services});if(hist.length>60)hist=[hist[0],...hist.slice(-59)];
    await write(()=>setConfig({rates,services,rateHistory:hist}),changed?"انحفظت. الطلبات الجديدة بس تنحسب بالأسعار الجديدة":"ما فيه تغيير");b.disabled=false;return}
  if(f.id==="feesForm"){b.disabled=true;await write(()=>setConfig({fees:{fixed:+v("fe-fixed")||0,pct:(+v("fe-pct")||0)/100,vat:(+v("fe-vat")||0)/100},unknownCostPct:(+v("fe-unk")||0)/100}),"انحفظت الرسوم");b.disabled=false;return}
  if(f.id==="budgetForm"){b.disabled=true;await write(()=>setConfig({adBudget:{total:+v("bd-total")||0,daily:+v("bd-daily")||0,start:v("bd-start"),end:v("bd-end")},tiktokAdvertiser:v("bd-adv").trim()}),"انحفظت الخطة");b.disabled=false;return}
  if(f.id==="goalsForm"){b.disabled=true;await write(()=>S.db.doc("meta/goals").set({monthlySales:+v("gl-sales")||50000,deadline:v("gl-dl")||"2027-12",margin:(+v("gl-m")||0)/100,roasUp:+v("gl-up")||0,roasHold:+v("gl-hold")||0,stepUp:(+v("gl-step")||0)/100}),"انحفظت الأهداف");b.disabled=false;return}
  if(f.id==="pinChange"){const o=v("pc-old"),n1=v("pc-new"),n2=v("pc-new2");if(!/^[0-9]{4}$/.test(n1)){toast("الرمز الجديد لازم 4 أرقام","err");return}if(n1!==n2){toast("الرمزين الجديدين مو متطابقين","err");return}
    const L=S.lock;if(L&&L.hash&&(await sha256Hex(L.salt+":"+o))!==L.hash){toast("الرمز الحالي غلط","err");return}
    b.disabled=true;const salt=[...crypto.getRandomValues(new Uint8Array(16))].map(x=>x.toString(16).padStart(2,"0")).join("");const hash=await sha256Hex(salt+":"+n1);
    if(await write(()=>S.db.doc("meta/lock").set({salt,hash,v:1,setAt:riyadhToday()}),"تغيّر الرمز"))f.reset();b.disabled=false;return}
  if(f.id==="fullSync"){const from=v("fs-from");if(from)syncAll(from);return}
});
document.addEventListener("input",(e)=>{if(e.target.id==="oq"){S.ordersQ=e.target.value;S.ordersPage=1;render()}
  if(e.target.id&&e.target.id.startsWith("sv-id-"))onSvcInput(e.target.dataset.svc);if(e.target.id==="cat-q")runCatSearch();
  if(e.target.id&&e.target.id.startsWith("rt-")){const k=e.target.id.slice(3);const el=document.getElementById("sv-info-"+k);if(el)el.innerHTML=catInfoHTML($("#sv-sup-"+k).value,$("#sv-id-"+k).value,e.target.value)}});
async function saveQuickLink(el){const oid=el.dataset.oid,ids=[...new Set(String(el.value).split(/[^0-9]+/).filter(Boolean))].slice(0,20);if(!ids.length)return;const sup=($("#qlSup")||{}).value||"drd3m";
  const dup=Object.entries(S.links).find(([k,v])=>k!==oid&&v.supplier===sup&&(v.ids||[]).some(x=>ids.includes(x)));if(dup&&el.dataset.ok!=="1"){el.dataset.ok="1";toast("هذا الرقم مربوط بطلب ثاني. اضغط Enter مرة ثانية إذا متأكد","err");return}
  el.disabled=true;const o=ordersIn("2000-01-01","2999-12-31").find(x=>x.id===oid);
  if(await write(()=>S.db.doc("supplier_links/"+oid).set({supplier:sup,ids,ref:o?o.ref:"",charge_sar:null,status:null,checkedAt:null}),"انربط، أجيب التكلفة من المورد")){if(o)setTimeout(()=>refreshLinks([o]),300)}else el.disabled=false}
document.addEventListener("keydown",(e)=>{if(e.key==="Enter"&&e.target.classList&&e.target.classList.contains("qlink")){e.preventDefault();saveQuickLink(e.target)}});
document.addEventListener("change",(e)=>{if(e.target.classList&&e.target.classList.contains("qlink")){saveQuickLink(e.target);return}if(e.target.id==="qlSup"){setConfig({quickSupplier:e.target.value}).catch(()=>{});return}if(e.target.id&&e.target.id.startsWith("sv-sup-"))onSvcInput(e.target.dataset.svc);if(e.target.id==="cat-sup"||e.target.id==="cat-sort")runCatSearch();if(e.target.id==="restoreFile"&&e.target.files[0]){restore(e.target.files[0]);e.target.value=""}
  if(e.target.id==="cFrom"||e.target.id==="cTo"){S.custom={from:$("#cFrom").value,to:$("#cTo").value};ls.set("ff-custom",JSON.stringify(S.custom));render()}});
$("#periodSeg").addEventListener("click",(e)=>{const b=e.target.closest("button");if(!b)return;S.period=b.dataset.p;ls.set("ff-period",S.period);S.animate=true;S.ordersPage=1;render()});
$("#burger").onclick=()=>document.body.classList.toggle("nav-open");$("#scrim").onclick=()=>document.body.classList.remove("nav-open");
$("#collapse").onclick=()=>{document.body.classList.toggle("col");setTimeout(moveInd,320);ls.set("ff-col",document.body.classList.contains("col")?"1":"0")};
addEventListener("keydown",(e)=>{if(e.key==="Escape"){document.body.classList.remove("nav-open");const m=document.querySelector(".modal");if(m)m.remove()}});

/* ===================== boot ===================== */
setTimeout(()=>{const s=$("#splash");if(s)s.classList.add("out")},2200);

/* ---------- SLATE-style PIN gate: guard watches, covers eyes, door opens ---------- */
async function sha256Hex(t){const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(t));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}
(function gate(){const g=$("#gate");if(!g)return;let seen=null;try{seen=sessionStorage.getItem("ff-in")}catch(e){}
  if(seen)g.hidden=true;
  const form=$("#pinForm"),inp=$("#pinIn"),boxes=[...$("#pinBoxes").children],guard=$("#guard"),eye=$("#pinEye"),msg=$("#pinMsg"),btn=$("#doorBtn");
  const pupils=guard.querySelectorAll(".pupil");const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;let show=false,fails=0,lockUntil=0;
  const wait=(ms)=>new Promise(r=>setTimeout(r,ms));
  function look(){const n=inp.value.length,f=document.activeElement===inp;const dx=f?(-4+Math.min(n,4)*2.2):0,dy=f?3:0;pupils.forEach(p=>p.style.transform=`translate(${dx}px,${dy}px)`);
    guard.classList.toggle("cover",f&&!show&&n>0);guard.classList.toggle("peek",f&&show&&n>0)}
  function paint(){const v=inp.value;boxes.forEach((b,i)=>{b.className="";b.textContent="";if(i<v.length){b.classList.add("fill");if(show)b.textContent=v[i];else b.classList.add("dot")}if(i===Math.min(v.length,3)&&document.activeElement===inp)b.classList.add("on")});look()}
  inp.addEventListener("input",()=>{inp.value=inp.value.replace(/[^0-9]/g,"").slice(0,8);msg.textContent="";paint();if(inp.value.length===4&&S.lock&&!S.lock.len8)form.requestSubmit()});
  inp.addEventListener("focus",paint);inp.addEventListener("blur",()=>setTimeout(paint,0));
  $("#pinBoxes").addEventListener("click",()=>inp.focus());
  eye.addEventListener("click",()=>{show=!show;eye.classList.toggle("showing",show);eye.setAttribute("aria-label",show?"إخفاء الرمز":"إظهار الرمز");inp.focus();paint()});
  $("#pinForgot").addEventListener("click",()=>{msg.style.color="var(--mut)";msg.textContent="اطلب من Claude يمسح الرمز من قاعدة بياناتك، وتختار رمز جديد أول ما تدخل."});
  setInterval(()=>{if(document.activeElement!==inp&&!reduce){guard.classList.add("blink");setTimeout(()=>guard.classList.remove("blink"),140)}},3800);
  setTimeout(()=>{try{inp.focus({preventScroll:true})}catch(e){}},500);
  async function lockDoc(){for(let i=0;i<50&&!S.loaded.has("lock");i++)await wait(200);return S.lock}
  form.addEventListener("submit",async(e)=>{e.preventDefault();if(btn.disabled)return;msg.style.color="";
    if(Date.now()<lockUntil){msg.textContent=`محاولات كثيرة، انتظر ${Math.ceil((lockUntil-Date.now())/1000)} ثانية`;return}
    const v=inp.value;if(v.length<4){msg.textContent="اكتب الرمز كامل";form.classList.remove("shake");void form.offsetWidth;form.classList.add("shake");return}
    btn.disabled=true;const L=await lockDoc();
    if(!L||!L.hash){btn.disabled=false;msg.textContent=S.db?"ما فيه رمز محفوظ. اطلب من Claude يضبطه.":"افتح التطبيق من claude.ai بحسابك";return}
    const ok=(await sha256Hex(L.salt+":"+v))===L.hash;
    if(!ok){btn.disabled=false;fails++;inp.value="";paint();guard.classList.remove("sad");void guard.offsetWidth;guard.classList.add("sad");form.classList.remove("shake");void form.offsetWidth;form.classList.add("shake");
      if(fails>=5){lockUntil=Date.now()+30000;fails=0;msg.textContent="محاولات كثيرة، انتظر 30 ثانية"}else msg.textContent=`الرمز غلط، باقي ${5-fails} محاولات`;inp.focus();return}
    show=false;eye.classList.remove("showing");inp.blur();guard.classList.remove("cover","peek");pupils.forEach(p=>p.style.transform="translate(0,-2px)");
    if(!reduce){btn.classList.add("dooropen");await wait(380);btn.classList.add("walking","out");await wait(760);btn.classList.remove("walking","dooropen");
      guard.classList.add("is-happy");$("#gateT").textContent="يا هلا!";$("#gateS").textContent="يالله نشوف أرقام اليوم";await wait(750)}
    try{sessionStorage.setItem("ff-in","1")}catch(x){}
    g.classList.add("gone");S.animate=true;render();lastAct=Date.now();setTimeout(()=>{g.hidden=true;inp.value="";paint()},1000)});
  paint();
  /* auto-lock after 10 minutes idle, or 10 minutes in background; manual lock button */
  const IDLE=10*6e4;let lastAct=Date.now(),hiddenAt=0;
  const act=()=>{lastAct=Date.now()};["pointerdown","keydown","wheel","touchstart"].forEach(t=>addEventListener(t,act,{passive:true,capture:true}));
  document.addEventListener("visibilitychange",()=>{if(document.hidden)hiddenAt=Date.now();else if(hiddenAt&&Date.now()-hiddenAt>IDLE)lockNow()});
  setInterval(()=>{if(Date.now()-lastAct>IDLE)lockNow()},20000);
  function lockNow(){if(!g.hidden||!(S.lock&&S.lock.hash))return;try{sessionStorage.removeItem("ff-in")}catch(e){}
    inp.value="";show=false;eye.classList.remove("showing");btn.disabled=false;btn.classList.remove("dooropen","walking","out");
    guard.classList.remove("is-happy","cover","peek","sad");$("#gateT").textContent="أهلًا فيك!";$("#gateS").textContent="انقفل التطبيق، ادخل رمزك عشان تكمل";msg.textContent="";
    document.body.classList.remove("nav-open");const m=document.querySelector(".modal");if(m)m.remove();
    g.classList.add("gone");g.hidden=false;void g.offsetWidth;g.classList.remove("gone");paint();setTimeout(()=>{try{inp.focus({preventScroll:true})}catch(e){}},700)}
  window.__lockNow=lockNow;
  const lb=$("#lockBtn");if(lb)lb.addEventListener("click",()=>{if(S.lock&&S.lock.hash)lockNow();else toast("ما فيه رمز محفوظ","err")});
})();
(function boot(){
  if(ls.get("ff-col")==="1")document.body.classList.add("col");const p=ls.get("ff-period");if(p)S.period=p;try{const c=JSON.parse(ls.get("ff-custom")||"null");if(c){S.custom=c;$("#cFrom").value=c.from;$("#cTo").value=c.to}}catch(e){}
  loadCache();onRoute();
  const cl=window.claude&&window.claude.use?window.claude:null;if(!cl){S.dbState="none";render();return}
  cl.use("db").then(db=>{S.db=db;S.dbState=db?"ok":"none";if(db)subscribe();else render()},()=>{S.dbState="none";render()});
  cl.use("mcp").then(m=>{S.mcp=m;startLive();startSupplierWatch();render()});
  cl.use("downloads").then(d=>S.dl=d);
  cl.use("sample").then(s=>{S.sample=s;S._lastSig=null;render()},()=>{});
  cl.use("user").then(async u=>{S.user=u;if(u){try{const w=await u.can("data.write");if(w===false){S.canWrite=false;toast("عندك صلاحية عرض فقط","err")}}catch(e){}}});
})();
})();
</script>
