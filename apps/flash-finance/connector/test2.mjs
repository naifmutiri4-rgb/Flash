import worker from './worker.js';
let bal={drd3m:"5.00",smmcpan:"0.90"};let rate={"12033":"0.007","10816":"0.71"};
globalThis.fetch=async(url,opt)=>{const p=Object.fromEntries(new URLSearchParams(opt.body));const sup=url.includes('drd3m')?'drd3m':'smmcpan';
  if(p.action==='balance')return new Response(JSON.stringify({balance:bal[sup],currency:"USD"}));
  if(p.action==='services')return new Response(JSON.stringify([{service:12033,name:"views",category:"c",rate:rate["12033"],min:"100",max:"1"},{service:10816,name:"likes",category:"c",rate:rate["10816"],min:"10",max:"1"},{service:22304,name:"shares",category:"c",rate:"0.18",min:"10",max:"1"}]));
  return new Response(JSON.stringify({error:"Incorrect request"}))};
const kv=new Map();const KV={get:async k=>kv.has(k)?kv.get(k):null,put:async(k,v)=>{kv.set(k,v)}};
const env={DRD3M_KEY:"k1",SMMCPAN_KEY:"k2",CONNECTOR_TOKEN:"abcdefghijklmnop1234",FLASH_KV:KV};
const ctx={p:[],waitUntil(x){this.p.push(x)}};
const run=async()=>{ctx.p=[];await worker.scheduled({},env,ctx);await Promise.all(ctx.p)};
const call=async(name,args)=>{const r=await worker.fetch(new Request('https://x/mcp/'+env.CONNECTOR_TOKEN,{method:'POST',body:JSON.stringify({jsonrpc:"2.0",id:1,method:"tools/call",params:{name,arguments:args}})}),env);return (await r.json()).result};
const ok=(n,c,i='')=>console.log(c?'PASS':'FAIL',n,i);
await run();                       // baseline
bal.drd3m="4.60";await run();      // used 0.40 USD = 1.5 SAR
bal.drd3m="14.60";await run();     // top-up 10 USD = 37.5 SAR
rate["10816"]="0.75";kv.delete("px:checked");await run(); // price change (if hour>=3 Riyadh)
let t=await call("supplier_topups",{});ok('topup recorded',t.structuredContent.topups.length===1&&t.structuredContent.topups[0].amount_sar===37.5,JSON.stringify(t.structuredContent.topups));
const day=new Date(Date.now()+3*3600e3).toISOString().slice(0,10);
let d=await call("supplier_daily",{from:day,to:day,supplier:"drd3m"});ok('daily row',d.structuredContent.days[0].used===1.5&&d.structuredContent.days[0].topup===37.5,JSON.stringify(d.structuredContent.days));
let s=await call("supplier_log_status",{});ok('status',s.structuredContent.kv&&!!s.structuredContent.cron_last);
let px=await call("supplier_price_changes",{});console.log('price changes',JSON.stringify(px.structuredContent.changes));
const env2={...env,FLASH_KV:undefined};const r2=await worker.fetch(new Request('https://x/mcp/'+env.CONNECTOR_TOKEN,{method:'POST',body:JSON.stringify({jsonrpc:"2.0",id:1,method:"tools/call",params:{name:"supplier_topups",arguments:{}}})}),env2);const j2=await r2.json();ok('no KV = clear error',j2.result.isError&&/FLASH_KV/.test(j2.result.content[0].text));
console.log('kv writes',kv.size);
