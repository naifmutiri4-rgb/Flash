(function(){
  var STORE='https://flashstore-ksa.com/';
  var ua=navigator.userAgent||'';
  if(!/musical_ly|BytedanceWebview|TikTok|Bytedance|trill/i.test(ua)) return;
  var isIOS=/iPhone|iPad|iPod/i.test(ua), isAndroid=/Android/i.test(ua);
  var url=STORE+(location.search||'');
  function copy(t,done){
    try{ navigator.clipboard.writeText(t).then(done,fallback);}catch(e){fallback();}
    function fallback(){var i=document.createElement('input');i.value=t;document.body.appendChild(i);i.select();try{document.execCommand('copy');}catch(e){}document.body.removeChild(i);done();}
  }
  function overlay(){
    if(document.getElementById('sf-ov')) return;
    var d=document.createElement('div'); d.id='sf-ov';
    d.style.cssText='position:fixed;inset:0;z-index:99999;background:rgba(11,10,18,.96);color:#fff;font-family:inherit;direction:rtl;display:flex;align-items:center;justify-content:center;padding:24px;text-align:center';
    var step=isIOS?'اضغط على <b>⋯</b> أو أيقونة المتصفح، ثم اختر <b>«فتح في Safari»</b>':'اضغط على <b>⋯</b> ثم اختر <b>«فتح في المتصفح»</b>';
    d.innerHTML='<div style="max-width:380px"><div style="font-size:22px;font-weight:700;margin-bottom:12px">افتح المتجر في المتصفح</div><div style="font-size:16px;line-height:1.8;color:#C2BEDD;margin-bottom:22px">لإتمام الدفع بسهولة: '+step+'. أو انسخ الرابط والصقه في Safari.</div><button id="sf-copy" style="width:100%;padding:16px;border:0;border-radius:14px;background:linear-gradient(90deg,#00E5D4,#FF3D7F);color:#0B0A12;font-weight:800;font-size:17px">نسخ رابط المتجر</button><a id="sf-here" href="'+url+'" style="display:block;margin-top:16px;color:#C2BEDD;font-size:14px">المتابعة هنا</a></div>';
    document.body.appendChild(d);
    document.getElementById('sf-copy').onclick=function(){var b=this;copy(url,function(){b.textContent='تم النسخ، الصقه في Safari';});};
    document.getElementById('sf-here').onclick=function(e){e.preventDefault();location.href=url;};
  }
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a,button'); if(!a) return;
    var txt=(a.textContent||'').trim(), href=(a.getAttribute('href')||'').replace(/\?.*$/,'');
    if(!(txt.indexOf('الذهاب للمتجر')>-1 || href===STORE || href===STORE.slice(0,-1))) return;
    e.preventDefault(); e.stopPropagation();
    if(isIOS){ location.href='x-safari-'+url; }
    else if(isAndroid){ location.href='intent://'+url.replace(/^https?:\/\//,'')+'#Intent;scheme=https;package=com.android.chrome;end'; }
    setTimeout(function(){ if(!document.hidden) overlay(); },1200);
  },true);
})();
