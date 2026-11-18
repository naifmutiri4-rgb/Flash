/* داتفاي — صفحات المتجر على هيكل ثيم ملاك */
IC.menu='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h10"/></svg>';
IC.search='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';
IC.user='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>';
IC.cart='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M3 4h2l2.4 11h11L21 7H6.2"/><circle cx="9" cy="20" r="1.4" fill="currentColor"/><circle cx="18" cy="20" r="1.4" fill="currentColor"/></svg>';
const OPS=[['sawa','stc سوا','stc'],['mobily','موبايلي','موبايلي'],['zain','زين','زين'],['redbull','ريد بُل','ريد بُل'],['salam','سلام','سلام'],['lebara','ليبارا','ليبارا']];
const op=k=>OPS.find(o=>o[0]===k)||OPS[0];
const PAYS=['mada','Apple Pay','VISA','Mastercard','STC Pay','Tamara','Tabby'];
const qs=new URLSearchParams(location.search);
let cart=0;try{cart=+localStorage.getItem('df-cart')||0}catch(e){}

function layout(){
 document.body.id='app';
 const h=document.createElement('header');h.className='store-header dark fixed-sticky';
 h.innerHTML=`<div id="mainnav" class="main-nav-container shadow-default"><div class="header-inner inner bg-white da-bgm has-custom-bg">
  <div class="angel-ad overflow-hidden"><i class="angel-ad__icon">${IC.nafath}</i><a class="angel-ad__content">يوجد استبدال بشريحة إلكترونية eSIM · التفعيل عبر نفاذ · استلام وتوصيل من فرع شبكتك</a></div>
  <div class="header-container container"><div>
   <div class="hdr-side"><a class="mburger mburger--collapse" href="index.html#cats"><i class="header-btn">${IC.menu}</i><p class="da-tm">الأقسام</p></a></div>
   <a class="navbar-brand" href="index.html" aria-label="داتفاي">${dfLogo(46)}</a>
   <div class="hdr-side end"><button class="search-btn header-btn" aria-label="بحث">${IC.search}</button><button class="header-btn" id="icUser" aria-label="حسابي">${IC.user}</button>
    <a class="s-cart-summary-wrapper header-btn" aria-label="السلة">${IC.cart}<span class="s-cart-summary-count" id="cartCount">${cart}</span></a></div>
  </div></div></div>
  <div class="inner nav-header"><div class="container"><a href="index.html">الرئيسية</a>${OPS.map(o=>`<a href="category.html?op=${o[0]}">${o[1]}</a>`).join('')}</div></div></div>`;
 document.body.prepend(h);
 const f=document.createElement('footer');f.className='store-footer dark';
 f.innerHTML=`<div class="store-footer__inner da-bgm has-custom-bg"><div class="container">
 <div class="footer-middle footer-container">
  <div class="footer-profile"><a class="logo-footer" href="index.html">${dfLogo(52)}</a><p class="footer-description">داتفاي متجر شرائح إنترنت لكل الشبكات السعودية. التفعيل عبر نفاذ، والاستلام أو التوصيل من فرع الشبكة نفسها، أو استبدال بشريحة eSIM.</p></div>
  <div class="menu-list"><p class="footer-title font-primary">الأقسام</p><div class="footer-list">${OPS.map(o=>`<a href="category.html?op=${o[0]}">${o[1]}</a>`).join('')}</div></div>
  <div class="menu-list"><p class="footer-title font-primary">روابط تهمك</p><div class="footer-list"><a>طرق الاستلام والتوصيل</a><a>التفعيل عبر نفاذ</a><a>سياسة الاستبدال</a><a>سياسة الخصوصية</a></div></div>
  <div class="menu-list"><p class="footer-title font-primary">تواصل معنا</p><div class="footer-list"><a>واتساب</a><a>البريد الإلكتروني</a><a>ساعات العمل: 9ص – 11م</a></div></div>
 </div>
 <div class="footer-bottom"><ul class="s-payments-list">${PAYS.map(x=>`<li class="s-payments-list-item">${x}</li>`).join('')}</ul><span class="copyrights">جميع الحقوق محفوظة · داتفاي 2026</span></div></div></div>`;
 document.body.append(f);
}
const tags=p=>p.feats.filter(f=>f[0]!=='time').map(f=>`<span class="tagx">${f[0]==='data'?'إنترنت ':f[0]==='social'?'سوشال ':''}${f[2]}</span>`).join('')+`<span class="tagx">${p.days} يوم</span>`;
const card=p=>`<a class="s-product-card-entry angel-shine-hover dark rounded-2xl s-product-card-vertical" href="product.html?id=${p.id}">
 <div class="s-product-card-image"><img class="s-product-card-image-cover" src="img/products/${p.id}.webp" alt="${p.title}" width="1080" height="1080" loading="lazy"></div>
 <div class="s-product-card-content"><div class="s-product-card-content-main"><div class="s-product-card-props"><i style="background:${OPC[p.op]}"></i>${op(p.op)[1]} · ${p.group}</div>
 <h3 class="s-product-card-content-title font-primary">${p.name}</h3></div>
 <div class="s-product-card-content-sub">${tags(p)}</div>
 <div class="s-product-card-content-footer"><span class="s-button-element s-button-btn s-button-solid s-button-wide s-button-primary">عرض الباقة</span></div></div></a>`;
const title=(h,p,center)=>`<div class="s-block__title${center?' centered-title':''}" ${center?'style="justify-content:center;text-align:center"':''}><div class="title-wrapper"><h2 class="da-cp">${h}</h2>${p?`<p class="da-ts">${p}</p>`:''}</div></div>`;

function slider(id,list){let i=0;const el=document.getElementById(id);if(!el)return;
 const img=el.querySelector('img'),dots=el.querySelector('.banner-dots');
 const set=n=>{i=n;img.src='img/headers/'+list[i]+'.webp';dots.querySelectorAll('button').forEach((b,k)=>b.setAttribute('aria-current',k===i))};
 dots.innerHTML=list.map((b,k)=>`<button aria-label="بنر ${k+1}" aria-current="${k===0}"></button>`).join('');
 dots.addEventListener('click',e=>{const b=e.target.closest('button');if(b)set([...dots.children].indexOf(b))});
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches)setInterval(()=>{if(!document.hidden)set((i+1)%list.length)},6000)}

function home(){
 const R=[['أبو فهد','زين · شباب 179','وثّقت بنفاذ وخلال دقايق اشتغلت الشريحة. التوصيل جاني من فرع زين نفسه.'],['نورة','موبايلي · فليكس بلس','الصفحة واضحة وكل باقة مكتوب فيها كم جيجا وكم دقيقة. سهل أقارن.'],['سلطان','stc سوا · كويك نت','استلمت من الفرع بنفسي، والتفعيل بنفاذ ما أخذ وقت.'],['ريم','سلام · سولو','حوّلتها eSIM بدل الشريحة العادية، خيار ممتاز.'],['خالد','ريد بُل · مزاجي','أسعار حلوة والدعم رد علي بسرعة.'],['منيرة','ليبارا · يلّا','طلبت لأمي شريحة ووصلتها لين البيت.']];
 document.getElementById('view').innerHTML=`
<section class="s-block s-block--fixed-banner"><div class="container"><a class="banner banner--fixed" href="#cats"><img src="img/headers/header-1-neon-chip.webp" alt="شريحة إنترنتك تفعّلها بنفاذ في دقائق" width="1920" height="640"></a></div></section>
<section class="s-block" id="cats"><div class="container">${title('أقسام الشرائح','اختر شبكتك وتصفّح باقاتها',1)}
 <div class="cats-grid">${OPS.map(o=>`<a class="cat-tile" href="category.html?op=${o[0]}" aria-label="شرائح ${o[1]}"><img src="img/categories/cat-${o[0]}.webp" alt="شرائح ${o[1]}" width="1080" height="1080" loading="lazy"></a>`).join('')}</div></div></section>
${banner('header-3-pickup-options','يوجد استبدال بشريحة إلكترونية eSIM')}
<section class="s-block" id="esim"><div class="container"><div class="esim">
 <div class="esim-txt"><span class="tagx">جديد</span><h2 class="da-cp">يوجد استبدال بشريحة إلكترونية eSIM</h2>
 <p>تبي شريحتك إلكترونية بدل البلاستيك؟ اختر «استبدال بشريحة eSIM» من خيارات المنتج، ونرسل لك رمز QR تفعّلها فيه بجوالك.</p>
 <ol class="esim-steps"><li><b>1</b><span>اختر الباقة وحدد «استبدال بشريحة eSIM»</span></li><li><b>2</b><span>وثّق هويتك عبر نفاذ</span></li><li><b>3</b><span>يوصلك رمز QR — امسحه من إعدادات الجوال وتشتغل</span></li></ol></div>
 <div class="esim-qr" aria-hidden="true">${qr()}<small>امسح الرمز من إعدادات الجوال ← الشبكة الخلوية ← إضافة eSIM</small></div>
</div></div></section>
${banner('header-4-delivery','طرق الاستلام')}
<section class="s-block s-block--testimonials"><div class="container">${title('تقييمات المتجر','',1)}
 <div class="rv-sum" style="justify-content:center"><b>4.9</b><span class="stars">★★★★★</span><small>من تقييمات العملاء</small><span class="demo-tag">نماذج توضيحية — تُستبدل بتقييمات سلة الفعلية</span></div>
 <div class="reviews">${R.map(r=>`<div class="rv"><span class="stars">★★★★★</span><p>${r[2]}</p><div class="who"><b>${r[0][0]}</b><span>${r[0]}<small>${r[1]}</small></span></div></div>`).join('')}</div></div></section>
${banner('header-2-nafath','وثّق عبر نفاذ وانطلق')}`;
}

function category(){
 const k=op(qs.get('op'))[0],o=op(k),ac=OPC[k];document.documentElement.style.setProperty('--ac',ac);
 const all=P.filter(p=>p.op===k),groups=[...new Set(all.map(p=>p.group))];let g='all';
 document.title=`شرائح ${o[1]} | داتفاي`;
 const v=document.getElementById('view');
 const draw=()=>{const ps=all.filter(p=>g==='all'||p.group===g);
 v.innerHTML=`<div class="bg-gray-100 da-bgg"><div class="container"><nav class="breadcrumbs"><ol class="s-breadcrumb-wrapper"><li class="s-breadcrumb-item"><a href="index.html">الرئيسية</a></li><li class="s-breadcrumb-arrow"></li><li class="s-breadcrumb-item">شرائح ${o[1]}</li></ol></nav></div></div>
 <div class="container">
 <div class="ops-tabs">${OPS.map(x=>`<a href="category.html?op=${x[0]}" ${x[0]===k?'aria-current="page"':''}>${x[1]}</a>`).join('')}</div>
 <div class="cat-hero"><img src="img/categories/cat-${k}.webp" alt="" width="170" height="170"><div><h1 class="da-tm">شرائح ${o[1]}</h1><p>${all.length} باقة · التفعيل عبر نفاذ · استلام وتوصيل من فرع ${o[2]} أو eSIM</p>
 <div class="chips"><span class="tagx">🏬 استلام من فرع ${o[2]}</span><span class="tagx">🚚 توصيل من فرع ${o[2]}</span><span class="tagx">📲 eSIM</span></div></div></div>
 <div class="s-filters" role="group" aria-label="نوع الباقة"><button aria-pressed="${g==='all'}" data-g="all">الكل (${all.length})</button>${groups.map(x=>`<button aria-pressed="${g===x}" data-g="${x}">${x} (${all.filter(p=>p.group===x).length})</button>`).join('')}</div>
 <div class="s-products-list-wrapper s-products-list-vertical-cards">${ps.map(card).join('')}</div></div>`;
 v.querySelector('.s-filters').onclick=e=>{const b=e.target.closest('button');if(b){g=b.dataset.g;draw()}}};
 draw();
}

function product(){
 const p=P.find(x=>x.id===qs.get('id'))||P[0],o=op(p.op),br=o[2];document.documentElement.style.setProperty('--ac',OPC[p.op]);
 document.title=`${p.name} – ${o[1]} | داتفاي`;
 const opts=[['store','استلام من فرع '+br,'استلمها بنفسك من أقرب فرع '+br],['truck','توصيل من فرع '+br,'فرع '+br+' يوصلها لين بيتك'],['esim','استبدال بشريحة إلكترونية eSIM','نرسل لك رمز QR وتفعّلها بجوالك']];
 let qty=1;
 document.getElementById('view').innerHTML=`<div class="bg-gray-100 da-bgg"><div class="container"><nav class="breadcrumbs"><ol class="s-breadcrumb-wrapper"><li class="s-breadcrumb-item"><a href="index.html">الرئيسية</a></li><li class="s-breadcrumb-arrow"></li><li class="s-breadcrumb-item"><a href="category.html?op=${p.op}">شرائح ${o[1]}</a></li><li class="s-breadcrumb-arrow"></li><li class="s-breadcrumb-item">${p.name}</li></ol></nav></div></div>
<div class="container product-single"><div class="prod-wrap">
<div class="sidebar"><div class="swiper"><a class="homeslider__slide"><img src="img/products/${p.id}.webp" alt="${p.title}" width="1080" height="1080"></a></div></div>
<div class="main-content">
 <a class="op-badge" href="category.html?op=${p.op}"><i style="background:${OPC[p.op]}"></i>${o[1]} · ${p.group}</a>
 <h1 class="da-tm">${p.title.replace('شريحة إنترنت سوا','شريحة إنترنت stc سوا')}</h1>
 <div class="price"><span class="ph">السعر يظهر هنا من لوحة سلة</span></div>
 <div class="feat-row">${p.feats.map(f=>`<div><small>${f[1]}</small><b>${f[2]}</b></div>`).join('')}</div>
 <form class="form product-form" id="pf">
 <div id="product-tabs-options" class="product-options details"><div class="s-product-options-option">
  <span class="s-product-options-option-label">طريقة الاستلام</span>
  <div class="s-product-options-option-content" role="radiogroup" aria-label="طريقة الاستلام">${opts.map((x,i)=>`<input type="radio" name="dlv" id="dlv-${i}" ${i===0?'checked':''}><label for="dlv-${i}"><span class="ic">${IC[x[0]]}</span><span><b>${x[1]}</b><small>${x[2]}</small></span><span class="rd"></span></label>`).join('')}</div></div></div>
 <section class="details nafath"><i>${IC.nafath}</i><div><b>التفعيل عبر نفاذ</b><small>بعد الطلب يوصلك طلب توثيق في تطبيق نفاذ، وافق عليه وتشتغل شريحتك.</small></div></section>
 <section class="details"><div class="details__wrapper"><div class="details__title">${IC.shield}<span>طرق الدفع</span></div></div><div class="pay-row">${PAYS.map(x=>`<span class="tagx" style="direction:ltr">${x}</span>`).join('')}</div></section>
 <section class="sticky-product-bar bg-white da-bgg"><div class="s-quantity-input-container"><button type="button" data-q="1" aria-label="زيادة">+</button><span id="qv">1</span><button type="button" data-q="-1" aria-label="نقص">−</button></div>
 <button type="submit" class="s-button-element s-button-btn s-button-solid s-button-wide s-button-primary">${IC.cart}أضف للسلة</button></section>
 </form>
 <article class="full-description details">${descHTML(p)}</article></div></div>
</div>`;
 const pf=document.getElementById('pf');
 pf.addEventListener('click',e=>{const b=e.target.closest('[data-q]');if(b){qty=Math.max(1,qty+ +b.dataset.q);document.getElementById('qv').textContent=qty}});
 pf.addEventListener('submit',e=>{e.preventDefault();cart+=qty;try{localStorage.setItem('df-cart',cart)}catch(_){}document.getElementById('cartCount').textContent=cart;
  const m=document.createElement('div');m.className='toast';m.setAttribute('role','status');m.textContent='تمت الإضافة للسلة';document.body.appendChild(m);setTimeout(()=>m.remove(),1600)});
}
function banner(f,alt){return `<section class="s-block s-block--fixed-banner"><div class="container"><a class="banner banner--fixed" href="#cats"><img src="img/headers/${f}.webp" alt="${alt}" width="1920" height="640" loading="lazy"></a></div></section>`}
function descHTML(p){const [head,...rest]=p.desc.split('\n\n');const [tg,body]=head.split('\n');
 return `<h3 style="margin-top:0">${tg}</h3><p>${body}</p>`+rest.map(b=>{const l=b.split('\n');return l.length>1?`<h3>${l[0].replace(':','')}</h3><ul>${l.slice(1).map(x=>`<li>${x.replace('• ','')}</li>`).join('')}</ul>`:`<p>${l[0]}</p>`}).join('')}
function qr(){let q='<svg viewBox="0 0 29 29" shape-rendering="crispEdges"><rect width="29" height="29" fill="#fff"/>';let s=11;const r=()=>(s=(s*9301+49297)%233280)/233280;
 const fin=(x,y)=>`<rect x="${x}" y="${y}" width="7" height="7" fill="#0B0F2A"/><rect x="${x+1}" y="${y+1}" width="5" height="5" fill="#fff"/><rect x="${x+2}" y="${y+2}" width="3" height="3" fill="#0B0F2A"/>`;
 for(let y=2;y<27;y++)for(let x=2;x<27;x++){if((x<10&&y<10)||(x>18&&y<10)||(x<10&&y>18))continue;if(r()>.52)q+=`<rect x="${x}" y="${y}" width="1" height="1" fill="#0B0F2A"/>`}
 return q+fin(2,2)+fin(20,2)+fin(2,20)+'</svg>'}
layout();({home,category,product})[document.body.dataset.page]();
