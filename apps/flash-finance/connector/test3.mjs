import w from './worker.js';
const sent=[];const kv=new Map();
globalThis.fetch=async(u,o)=>{if(String(u).includes('/sendMessage')){sent.push(JSON.parse(o.body));return new Response('{}',{status:200})}
 if(String(u).includes('/getUpdates'))return new Response(JSON.stringify({result:[{message:{chat:{id:12345,first_name:"Owner"}}}]}));return new Response('{}')};
const env={CONNECTOR_TOKEN:'x'.repeat(20),HOOK_TOKEN:'h'.repeat(20),TELEGRAM_TOKEN:'t',TELEGRAM_CHAT_ID:'1',FLASH_KV:{get:async k=>kv.get(k)??null,put:async(k,v)=>kv.set(k,v)}};
const base='https://x.workers.dev/hook/'+'h'.repeat(20);
const order={event:'order.created',data:{id:99,reference_id:301418224,amounts:{total:{amount:54.99,currency:'SAR'}},items:[{name:'بكج اكسبلور <b>',quantity:1}],customer:{city:'الرياض'},payment_method:'mada',status:{name:'بإنتظار المراجعة'}}};
const r=await w.fetch(new Request(base,{method:'POST',body:JSON.stringify(order)}),env);
const r2=await w.fetch(new Request(base,{method:'POST',body:JSON.stringify(order)}),env);
const r3=await w.fetch(new Request(base,{method:'POST',body:JSON.stringify({event:'order.updated',data:{id:1}})}),env);
const c=await w.fetch(new Request(base+'/chatid'),env);
const t=await w.fetch(new Request(base+'/test'),env);
const bad=await w.fetch(new Request('https://x.workers.dev/hook/wrong',{method:'POST',body:'{}'}),env);
const sig=await w.fetch(new Request(base,{method:'POST',body:JSON.stringify(order)}),{...env,SALLA_WEBHOOK_SECRET:'s'});
console.log(r.status,await r.text(),'|dup',await r2.text(),'|upd',await r3.text(),'|chat',await c.text(),'|test',t.status,'|wrong',bad.status,'|sig',sig.status);
console.log(sent.length);console.log(sent[0].text);
const inv={event:'invoice.created',data:{id:5,order_id:777,total:{amount:29.99},items:[{name:'بكج التفاعل',quantity:1}]}};
const ri=await w.fetch(new Request(base,{method:'POST',body:JSON.stringify(inv)}),env);console.log('invoice',ri.status,await ri.text(),'|',sent[sent.length-1].text.split('\n')[0]);
