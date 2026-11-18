/* داتفاي — صفحات المتجر بهيكل ثيم ملاك (نفس الكلاسات والترتيب) */
const OPS=[['sawa','stc سوا','stc'],['mobily','موبايلي','موبايلي'],['zain','زين','زين'],['redbull','ريد بُل','ريد بُل'],['salam','سلام','سلام'],['lebara','ليبارا','ليبارا']];
const op=k=>OPS.find(o=>o[0]===k)||OPS[0];
const PAYS=['mada','Apple Pay','VISA','Mastercard','STC Pay','Tamara','Tabby'];
const qs=new URLSearchParams(location.search);
let cart=0;try{cart=+localStorage.getItem('df-cart')||0}catch(e){}

function layout(){
 const h=document.createElement('header');h.className='store-header dark fixed-sticky';
 h.innerHTML=`<div id="mainnav" class="main-nav-container shadow-default"><div class="header-inner inner bg-white da-bgm has-custom-bg">
  <div class="angel-ad overflow-hidden"><div class="mask-block"><div class="angel-ad__slider"><div class="angel-ad__item"><i class="sicon-sim-card-alert angel-ad__icon"></i><a class="angel-ad__content pointer-events-none">يوجد استبدال بشريحة إلكترونية eSIM · التفعيل عبر نفاذ · استلام وتوصيل من فرع شبكتك</a></div></div></div></div>
  <div class="header-container container"><div class="flex items-stretch justify-between relative">
   <div class="flex items-center justify-start w-1/3">
    <a class="mburger mburger--collapse flex items-start ltr:mr-1 rtl:ml-1" href="index.html#cats"><i class="sicon-menu text-primary text-2xl"></i><p class="da-tm hidden text-xl md:block ltr:ml-1 rtl:mr-1">الأقسام</p></a></div>
   <div class="flex items-center flex-col justify-center"><a class="navbar-brand p-1" href="index.html" aria-label="داتفاي">${dfLogo(44)}</a><h1 class="sr-only">داتفاي</h1></div>
   <div class="flex items-center justify-end w-1/3 gap-2">
    <button class="search-btn header-btn flex da-fm cursor-pointer" aria-label="بحث"><i class="sicon-search text-base da-tm"></i></button>
    <button class="header-btn !flex" aria-label="حسابي"><i class="sicon-user text-base da-tm"></i></button>
    <salla-cart-summary class="header-cart no-summary"><a class="s-cart-summary-wrapper header-btn" aria-label="السلة"><i class="sicon-shopping-bag text-base da-tm"></i><span class="s-cart-summary-count" id="cartCount">${cart}</span></a></salla-cart-summary>
   </div></div></div></div>
  <div class="inner nav-header"><div class="container !hidden lg:!flex justify-between"><div class="flex items-center justify-start relative w-max gap-6 py-3">
   <a href="index.html" class="da-tm">الرئيسية</a>${OPS.map(o=>`<a href="category.html?op=${o[0]}" class="da-tm">${o[1]}</a>`).join('')}</div></div></div></div>`;
 document.body.prepend(h);
 const f=document.createElement('footer');f.className='store-footer dark';
 f.innerHTML=`<div class="store-footer__inner da-bgm has-custom-bg"><div class="container flex flex-col">
  <div class="footer-middle footer-container flex align-center flex-col md:flex-row da-brdr md:gap-4 py-10 justify-between">
   <div class="flex flex-col md:max-w-xs footer-profile"><a class="flex items-center m-0 logo-footer" href="index.html">${dfLogo(50)}</a>
    <p class="footer-description da-ts mt-4">داتفاي متجر شرائح إنترنت لكل الشبكات السعودية. التفعيل عبر نفاذ، والاستلام أو التوصيل من فرع الشبكة نفسها، أو استبدال بشريحة إلكترونية eSIM.</p></div>
   <div class="flex flex-col shrink-0"><div class="menu-list"><p class="footer-title font-primary da-tm mb-4">الأقسام</p><div class="footer-list">${OPS.map(o=>`<a class="block mb-4 text-sm leading-none da-tm hover:text-primary" href="category.html?op=${o[0]}">${o[1]}</a>`).join('')}</div></div></div>
   <div class="flex flex-col shrink-0"><div class="menu-list"><p class="footer-title font-primary da-tm mb-4">روابط تهمك</p><div class="footer-list">${['طرق الاستلام والتوصيل','التفعيل عبر نفاذ','الشريحة الإلكترونية eSIM','سياسة الخصوصية'].map(x=>`<a class="block mb-4 text-sm leading-none da-tm">${x}</a>`).join('')}</div></div></div>
   <div class="flex flex-col shrink-0"><div class="menu-list"><p class="footer-title font-primary da-tm mb-4">تواصل معنا</p><div class="footer-list"><a class="block mb-4 text-sm da-tm"><i class="sicon-whatsapp"></i> واتساب</a><a class="block mb-4 text-sm da-tm"><i class="sicon-mail"></i> البريد الإلكتروني</a></div></div></div>
  </div>
  <div class="footer-bottom flex flex-col lg:flex-row items-center justify-between py-4 gap-4">
   <salla-payments class="s-payments-list-wrap"><ul class="s-payments-list flex flex-wrap gap-2">${PAYS.map(x=>`<li class="s-payments-list-item">${x}</li>`).join('')}</ul></salla-payments>
   <span class="copyrights text-sm opacity-75"><p class="text-gray-400">جميع الحقوق محفوظة · داتفاي 2026</p></span></div>
 </div></div>`;
 document.body.append(f);
}
const tags=p=>p.feats.filter(f=>f[0]!=='time').map(f=>`<span class="df-tag">${f[0]==='data'?'إنترنت ':f[0]==='social'?'سوشال ':''}${f[2]}</span>`).join('')+`<span class="df-tag">${p.days} يوم</span>`;
const card=p=>`<custom-salla-product-card class="s-product-card-entry angel-shine-hover dark rounded-2xl s-product-card-vertical s-product-card-fit-height">
 <div class="s-product-card-image grow-0"><a class="flex-center h-full w-full angel-shine-obj" href="product.html?id=${p.id}"><img class="s-product-card-image-cover" src="img/products/${p.id}.webp" alt="${p.title}" width="1080" height="1080" loading="lazy"></a></div>
 <div class="s-product-card-content"><div class="s-product-card-content-main"><div class="s-product-card-props"><i class="w-2 h-2 rounded-full inline-block" style="background:${OPC[p.op]}"></i>${op(p.op)[1]} · ${p.group}</div>
  <h3 class="s-product-card-content-title line-clamp-1 font-primary"><a href="product.html?id=${p.id}" dir="ltr">${p.name}</a></h3></div>
  <div class="s-product-card-content-sub flex flex-wrap gap-1 justify-between">${tags(p)}</div>
  <div class="s-product-card-content-footer rounded-2xl"><a class="s-button-element s-button-btn s-button-solid s-button-wide s-button-primary w-full flex-center h-11 rounded-xl" href="product.html?id=${p.id}">عرض الباقة</a></div></div></custom-salla-product-card>`;
const blockTitle=(h,p)=>`<div class="s-block__title"><div class="flex flex-col w-full"><div class="title-wrapper"><h2 class="w-full da-cp text-center">${h}</h2></div>${p?`<p class="w-full text-center !p-0 text-gray-400 da-ts">${p}</p>`:''}</div></div>`;
const banner=(f,alt)=>`<section class="s-block s-block--fixed-banner wide-placeholder"><div class="container"><a class="banner banner--fixed overflow-hidden block" href="#cats"><picture class="block"><img class="w-full h-auto" src="img/headers/${f}.webp" alt="${alt}" width="1920" height="640" loading="lazy"></picture></a></div></section>`;
function qr(){let q='<svg viewBox="0 0 29 29" shape-rendering="crispEdges"><rect width="29" height="29" fill="#fff"/>';let s=11;const r=()=>(s=(s*9301+49297)%233280)/233280;
 const fin=(x,y)=>`<rect x="${x}" y="${y}" width="7" height="7" fill="#0B0F2A"/><rect x="${x+1}" y="${y+1}" width="5" height="5" fill="#fff"/><rect x="${x+2}" y="${y+2}" width="3" height="3" fill="#0B0F2A"/>`;
 for(let y=2;y<27;y++)for(let x=2;x<27;x++){if((x<10&&y<10)||(x>18&&y<10)||(x<10&&y>18))continue;if(r()>.52)q+=`<rect x="${x}" y="${y}" width="1" height="1" fill="#0B0F2A"/>`}
 return q+fin(2,2)+fin(20,2)+fin(2,20)+'</svg>'}
function descHTML(p){const [head,...rest]=p.desc.split('\n\n');const [tg,body]=head.split('\n');
 return `<h3 style="margin-top:0">${tg}</h3><p>${body}</p>`+rest.map(b=>{const l=b.split('\n');return l.length>1?`<h3>${l[0].replace(':','')}</h3><ul>${l.slice(1).map(x=>`<li>${x.replace('• ','')}</li>`).join('')}</ul>`:`<p>${l[0]}</p>`}).join('')}
const crumbs=items=>`<nav class="breadcrumbs w-full py-3"><salla-breadcrumb><ol class="s-breadcrumb-wrapper flex flex-wrap gap-2">${items.map((it,i)=>(i?'<li class="s-breadcrumb-arrow">‹</li>':'')+`<li class="s-breadcrumb-item">${it[1]?`<a href="${it[1]}">${it[0]}</a>`:it[0]}</li>`).join('')}</ol></salla-breadcrumb></nav>`;

function home(){
 const R=[['أبو فهد','زين · شباب 179','وثّقت بنفاذ وخلال دقايق اشتغلت الشريحة. التوصيل جاني من فرع زين نفسه.'],['نورة','موبايلي · فليكس بلس','الصفحة واضحة وكل باقة مكتوب فيها كم جيجا وكم دقيقة. سهل أقارن.'],['سلطان','stc سوا · كويك نت','استلمت من الفرع بنفسي، والتفعيل بنفاذ ما أخذ وقت.'],['ريم','سلام · سولو','حوّلتها eSIM ووصلني رمز QR، فعّلتها من الجوال على طول.'],['خالد','ريد بُل · مزاجي','أسعار حلوة والدعم رد علي بسرعة.'],['منيرة','ليبارا · يلّا','طلبت لأمي شريحة ووصلتها لين البيت.']];
 document.getElementById('view').innerHTML=`
${banner('header-1-neon-chip','شريحة إنترنتك تفعّلها بنفاذ في دقائق')}
<section class="s-block s-block--square-links" id="cats"><div class="container">${blockTitle('أقسام الشرائح','اختر شبكتك وتصفّح باقاتها')}
 <div class="df-cats">${OPS.map(o=>`<a class="df-cat" href="category.html?op=${o[0]}" aria-label="شرائح ${o[1]}"><img src="img/categories/cat-${o[0]}.webp" alt="شرائح ${o[1]}" width="1080" height="1080" loading="lazy"></a>`).join('')}</div></div></section>
${banner('header-3-pickup-options','يوجد استبدال بشريحة إلكترونية eSIM')}
<section class="s-block s-block--bundle-html-content"><div class="container"><div class="df-esim">
 <div><span class="df-tag">جديد</span><h2 class="da-cp">يوجد استبدال بشريحة إلكترونية eSIM</h2>
 <p>تبي شريحتك إلكترونية بدل البلاستيك؟ اختر «استبدال بشريحة إلكترونية eSIM» من خيارات المنتج، ونرسل لك رمز QR تفعّلها فيه بجوالك.</p>
 <ol class="df-steps"><li><b>1</b><span>اختر الباقة وحدد «استبدال بشريحة eSIM»</span></li><li><b>2</b><span>وثّق هويتك عبر نفاذ</span></li><li><b>3</b><span>يوصلك رمز QR، امسحه من إعدادات الجوال وتشتغل</span></li></ol></div>
 <div class="df-qr" aria-hidden="true">${qr()}<small>الإعدادات ← الشبكة الخلوية ← إضافة eSIM ← امسح الرمز</small></div></div></div></section>
${banner('header-4-delivery','طرق الاستلام')}
<section class="s-block s-block--testimonials"><div class="container">${blockTitle('تقييمات المتجر')}
 <div class="df-sum"><b>4.9</b><span class="df-stars">★★★★★</span><span class="da-ts">من تقييمات العملاء</span><span class="df-demo">نماذج توضيحية — تُستبدل بتقييمات سلة الفعلية</span></div>
 <div class="df-reviews">${R.map(r=>`<div class="df-rv"><span class="df-stars">★★★★★</span><p>${r[2]}</p><div class="df-who"><b>${r[0][0]}</b><span class="da-tm">${r[0]}<small>${r[1]}</small></span></div></div>`).join('')}</div></div></section>
${banner('header-2-nafath','وثّق عبر نفاذ وانطلق')}`;
}

function category(){
 const k=op(qs.get('op'))[0],o=op(k);document.documentElement.style.setProperty('--ac',OPC[k]);document.body.classList.replace('index','product-index');
 const all=P.filter(p=>p.op===k),groups=[...new Set(all.map(p=>p.group))];let g='all';
 document.title=`شرائح ${o[1]} | داتفاي`;
 const v=document.getElementById('view');
 const draw=()=>{const ps=all.filter(p=>g==='all'||p.group===g);
 v.innerHTML=`<div class="nav-header py-6 px-4 flex flex-col bg-gray-100 da-bgg relative"><div class="nav-title container flex items-center gap-2 md:gap-4"><div class="category_title_wrapper">
  <h1 id="page-main-title" class="category_title text-xl flex gap-2 mb-1 da-tm">شرائح ${o[1]}</h1>${crumbs([['الرئيسية','index.html'],['شرائح '+o[1]]])}</div></div></div>
 <div class="container">
  <div class="df-ops">${OPS.map(x=>`<a href="category.html?op=${x[0]}" ${x[0]===k?'aria-current="page"':''}>${x[1]}</a>`).join('')}</div>
  <div class="df-hero"><img src="img/categories/cat-${k}.webp" alt="" width="150" height="150"><div><h2 class="da-tm text-2xl">باقات ${o[1]}</h2><p>${all.length} باقة · التفعيل عبر نفاذ · استلام وتوصيل من فرع ${o[2]} أو eSIM برمز QR</p></div></div>
 </div>
 <div class="container px-2.5 ms:px-5"><div class="main-content flex-1 w-full">
  <div class="prdoucts-list-filters my-4"><div class="df-filters" role="group" aria-label="نوع الباقة"><button aria-pressed="${g==='all'}" data-g="all">الكل (${all.length})</button>${groups.map(x=>`<button aria-pressed="${g===x}" data-g="${x}">${x} (${all.filter(p=>p.group===x).length})</button>`).join('')}</div></div>
  <salla-products-list class="flex-1 min-w-0 s-products-list"><div class="s-products-list-wrapper s-products-list-filters-results">${ps.map(card).join('')}</div></salla-products-list>
 </div></div>`;
 v.querySelector('.df-filters').onclick=e=>{const b=e.target.closest('button');if(b){g=b.dataset.g;draw()}}};
 draw();
}

function product(){
 const p=P.find(x=>x.id===qs.get('id'))||P[0],o=op(p.op),br=o[2];document.body.classList.replace('index','product-single');
 document.title=`${p.name} – ${o[1]} | داتفاي`;
 const opts=[['sicon-store','استلام من فرع '+br,'استلمها بنفسك من أقرب فرع '+br],['sicon-shipping-fast','توصيل من فرع '+br,'فرع '+br+' يوصلها لين بيتك'],['sicon-sim-card-alert','استبدال بشريحة إلكترونية eSIM','نرسل لك رمز QR وتفعّلها بجوالك']];
 let qty=1;
 document.getElementById('view').innerHTML=`<div class="flex flex-col bg-gray-100 da-bgg relative md:mb-6"><div class="container">${crumbs([['الرئيسية','index.html'],['شرائح '+o[1],'category.html?op='+p.op],[p.name]])}</div></div>
<div class="md:container"><div class="flex flex-col items-start md:flex-row">
 <div class="sidebar md:sticky top-16 w-full md:!w-2/5 md:rtl:ml-8 pb-4 md:pb-16 overflow-hidden shrink-0"><div class="relative mob:container"><a class="swiper-slide magnify-wrapper homeslider__slide block"><img class="h-full w-full rounded-3xl" src="img/products/${p.id}.webp" alt="${p.title}" width="1080" height="1080"></a></div></div>
 <div class="main-content mob:container w-full md:w-1/2 md:pb-16">
  <div class="flex flex-col"><span class="df-tag w-max mb-2"><i class="w-2 h-2 rounded-full inline-block" style="background:${OPC[p.op]}"></i>${o[1]} · ${p.group}</span>
  <h1 class="da-tm leading-normal text-lg md:text-xl">${p.title}</h1></div>
  <div class="price my-2"><span class="df-price-ph">السعر يظهر هنا من لوحة سلة</span></div>
  <div class="df-feats">${p.feats.map(f=>`<div><small>${f[1]}</small><b class="da-tm">${f[2]}</b></div>`).join('')}</div>
  <form class="form product-form" id="pf">
   <div id="product-tabs-options" class="product-options details"><salla-product-options class="s-product-options-wrapper"><div class="s-product-options-option-container"><div class="s-product-options-option">
    <label class="s-product-options-option-label block mb-3 da-tm">طريقة الاستلام</label>
    <div class="s-product-options-option-content df-opts" role="radiogroup" aria-label="طريقة الاستلام">${opts.map((x,i)=>`<input type="radio" name="dlv" id="dlv-${i}" ${i===0?'checked':''}><label for="dlv-${i}" class="df-opt"><span class="ic"><i class="${x[0]}"></i></span><span><b class="da-tm">${x[1]}</b><small>${x[2]}</small></span><span class="rd"></span></label>`).join('')}</div>
   </div></div></salla-product-options>
   <div class="df-nafath"><i class="sicon-fingerprint"></i><div><b class="da-tm">التفعيل عبر نفاذ</b><small>بعد الطلب يوصلك طلب توثيق في تطبيق نفاذ، وافق عليه وتشتغل شريحتك.</small></div></div>
   <section class="total details mb-5 mt-3"><div class="details__wrapper"><div class="details__container"><div class="details__title flex items-center gap-2"><i class="sicon-shield-check text-xs"></i><span class="text-sm font-primary">طرق الدفع</span></div>
    <div class="flex flex-wrap gap-2 mt-2">${PAYS.map(x=>`<span class="df-tag" dir="ltr">${x}</span>`).join('')}</div></div></div></section></div>
   <section class="sticky-product-bar bg-white da-bgg p-5 mt-4 rounded-md dark"><div class="flex justify-between items-center gap-3">
    <div class="sticky-product-bar__quantity center-between"><div class="df-qty"><button type="button" data-q="1" aria-label="زيادة">+</button><span id="qv">1</span><button type="button" data-q="-1" aria-label="نقص">−</button></div></div>
    <div class="s-add-product-button-main flex-1"><button type="submit" class="s-button-element s-button-btn s-button-solid s-button-wide s-button-primary w-full h-11 rounded-xl flex-center gap-2"><i class="sicon-shopping-bag"></i>أضف للسلة</button></div></div></section>
  </form>
  <article class="full-description details df-desc mt-5">${descHTML(p)}</article>
 </div></div></div>`;
 const pf=document.getElementById('pf');
 pf.addEventListener('click',e=>{const b=e.target.closest('[data-q]');if(b){qty=Math.max(1,qty+ +b.dataset.q);document.getElementById('qv').textContent=qty}});
 pf.addEventListener('submit',e=>{e.preventDefault();cart+=qty;try{localStorage.setItem('df-cart',cart)}catch(_){}document.getElementById('cartCount').textContent=cart;
  const m=document.createElement('div');m.className='df-toast';m.setAttribute('role','status');m.textContent='تمت الإضافة للسلة';document.body.appendChild(m);setTimeout(()=>m.remove(),1600)});
}
const hyd=()=>document.querySelectorAll('*').forEach(e=>{if(e.tagName.includes('-'))e.classList.add('hydrated')});
new MutationObserver(hyd).observe(document.body,{childList:true,subtree:true});
document.documentElement.classList.add('hydrated');
layout();({home,category,product})[document.body.dataset.page]();hyd();
