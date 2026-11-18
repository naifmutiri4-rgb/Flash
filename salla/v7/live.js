/* فلاش ستور — «بث مباشر»: تحسينات جافاسكربت لصفحة المنتج والسلة
   - زر الكمية: الكمية بخط كبير والسعر تحته بخط صغير
   - سطر «اخترت: 10,000 مشاهدة · 12.99 ر.س» فوق الكميات
   - السعر على زر «أضف للسلة» حسب الكمية × العدد
   ما يغيّر عناصر سلة نفسها: يضيف خصائص data- فقط، والعرض كله من CSS. لو تعطل الكود يبقى شكل الثيم كما هو. */
(function () {
  if (window.__lvLive) return; window.__lvLive = true;
  var PRICE = /\(([^()]*)\)\s*$/;
  var num = function (s) { var m = String(s).replace(/[٠-٩]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'.indexOf(d); }).replace(/,/g, '').match(/\d+(\.\d+)?/); return m ? parseFloat(m[0]) : NaN; };
  var cur = function (s) { return String(s).replace(/[\d.,\s+٠-٩]/g, '').trim(); };

  function splitLabels(root) {
    var spans = root.querySelectorAll('.s-product-options-grid-mode-span');
    for (var i = 0; i < spans.length; i++) {
      var sp = spans[i], t = sp.textContent.trim(), m = t.match(PRICE);
      if (!m) continue;
      var name = t.replace(PRICE, '').trim(), price = m[1].replace(/^\+\s*/, '').trim();
      if (sp.getAttribute('data-lv-q') === name && sp.getAttribute('data-lv-p') === price) continue;
      sp.setAttribute('data-lv-q', name); sp.setAttribute('data-lv-p', price);
    }
  }

  // السعر الأساسي للمنتج (للخدمات المفردة 0.01) من بيانات المنتج اللي ترسمها سلة بنفس عملة الزائر، يُضاف لسعر الكمية مثل ما تحسبه السلة
  var basePrice = null;
  function getBase() {
    if (basePrice !== null) return basePrice;
    basePrice = 0;
    var ld = document.querySelectorAll('script[type="application/ld+json"]');
    for (var i = 0; i < ld.length; i++) {
      try { var d = JSON.parse(ld[i].textContent), o = d && d.offers; if (o && !isNaN(parseFloat(o.price))) { basePrice = parseFloat(o.price); break; } } catch (e) { }
    }
    return basePrice;
  }

  function selectedOf(container) {
    var input = container.querySelector('.s-product-options-grid-mode input:checked');
    if (!input) return null;
    var sp = input.parentElement.querySelector('.s-product-options-grid-mode-span');
    return sp && sp.getAttribute('data-lv-q') ? { q: sp.getAttribute('data-lv-q'), p: sp.getAttribute('data-lv-p') } : null;
  }

  function update() {
    splitLabels(document);
    var conts = document.querySelectorAll('.s-product-options-option-container');
    for (var i = 0; i < conts.length; i++) {
      var s = selectedOf(conts[i]);
      var label = conts[i].querySelector('.s-product-options-option-label');
      if (!label) continue;
      if (s) label.setAttribute('data-lv-sel', s.q + ' · ' + s.p); else label.removeAttribute('data-lv-sel');
    }
    // السعر على زر «أضف للسلة» في صفحة المنتج
    var bar = document.querySelector('.product-single .sticky-product-bar');
    if (!bar) return;
    var btn = bar.querySelector('salla-add-product-button button.s-button-primary');
    if (!btn) return;
    var sel = null, c = document.querySelector('.product-single .s-product-options-option-container');
    if (c) sel = selectedOf(c);
    var qtyInput = bar.querySelector('.s-quantity-input-input');
    var qty = qtyInput ? Math.max(1, parseInt(qtyInput.value, 10) || 1) : 1;
    var unit = sel ? num(sel.p) : NaN, label2 = '';
    if (!isNaN(unit)) label2 = (Math.round((unit + getBase()) * qty * 100) / 100).toFixed(2) + ' ' + cur(sel.p);
    else if (!document.querySelector('.product-single .s-product-options-grid-mode')) {
      var tp = document.querySelector('.product-single .main-content > .price .total-price');
      // سلة تحدّث السعر العلوي للباقات حسب العدد، فنعرضه كما هو بدون ضرب
      if (tp && !isNaN(num(tp.textContent))) label2 = num(tp.textContent).toFixed(2) + ' ' + (cur(tp.textContent) || 'ر.س');
    }
    if (label2) btn.setAttribute('data-lv-total', label2); else btn.removeAttribute('data-lv-total');
  }

  // «اشتر الآن» (salla-mini-checkout-widget): الزر داخل Shadow DOM مفتوح، فنضيف له ستايل التصميم من داخله
  var BUY_CSS = '.s-fast-checkout-button{height:52px!important;min-height:52px;width:100%;border-radius:14px!important;border:1.5px solid #FF3D7F!important;background:#16142A!important;color:#fff!important;font-weight:800!important;font-size:15px!important;box-shadow:none!important;transition:background-color .15s ease,transform .1s ease}' +
    '.s-fast-checkout-button:hover{background:#1F1A3D!important}.s-fast-checkout-button:active{transform:scale(.98)}' +
    '.s-fast-checkout-button svg,.s-fast-checkout-button path{fill:#FF3D7F!important}';
  function styleBuyNow() {
    var ws = document.querySelectorAll('salla-mini-checkout-widget');
    for (var i = 0; i < ws.length; i++) {
      var r = ws[i].shadowRoot;
      if (!r || r.querySelector('style[data-lv]')) continue;
      var st = document.createElement('style'); st.setAttribute('data-lv', ''); st.textContent = BUY_CSS; r.appendChild(st);
    }
  }

  // آراء العملاء في الرئيسية: كل تقييم 5 ثواني بدل 2.5، وانتقال أنعم (0.8 ث). يوقف عند لمس/تمرير الماوس مثل ملاك
  function slowReviews() {
    var sw = document.querySelector('.s-block--testimonials .swiper');
    var s = sw && sw.swiper;
    if (!s || s.__lvSlow || !s.params) return false;
    s.__lvSlow = true;
    s.params.speed = 800;
    if (s.params.autoplay && typeof s.params.autoplay === 'object') s.params.autoplay.delay = 5000;
    if (s.autoplay && s.autoplay.running) { s.autoplay.stop(); s.autoplay.start(); }
    return true;
  }
  if (document.body && document.body.classList.contains('index') || /^\/?$/.test(location.pathname)) {
    var tries = 0, iv = setInterval(function () { try { if (slowReviews() || ++tries > 40) clearInterval(iv); } catch (e) { clearInterval(iv); } }, 250);
  }

  // صفحة التحميل: لما تكتمل الصفحة، كمّل الشريط من مكانه الحالي لـ 100% ثم اخفها
  (function () {
    var pl = document.getElementById('preloader');
    if (!pl) return;
    function finish() {
      if (!document.getElementById('preloader') || pl.classList.contains('lv-done')) return;
      var m = getComputedStyle(pl, '::after').transform, sx = 0.6;
      var mm = m && m.match(/matrix\(([^,]+)/); if (mm) sx = Math.min(1, Math.max(0, parseFloat(mm[1])));
      pl.style.setProperty('--lv-from', sx);
      pl.classList.add('lv-done');
      setTimeout(function () { pl.classList.add('lv-gone'); }, 450);
      setTimeout(function () { if (pl.parentNode) pl.parentNode.removeChild(pl); }, 900);
    }
    if (document.readyState === 'complete') setTimeout(finish, 150); else window.addEventListener('load', finish);
  })();

  var queued = false;
  function schedule() { if (queued) return; queued = true; requestAnimationFrame(function () { queued = false; try { update(); } catch (e) { } try { styleBuyNow(); } catch (e) { } }); }
  document.addEventListener('change', schedule, true);
  document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('.s-quantity-input-button, .s-product-options-grid-mode')) setTimeout(schedule, 30); }, true);
  document.addEventListener('input', schedule, true);
  function start() {
    schedule();
    var main = document.querySelector('.product-single .main-content, body.cart .main-content');
    if (main && window.MutationObserver) new MutationObserver(schedule).observe(main, { childList: true, subtree: true, characterData: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  window.addEventListener('load', schedule);
  setTimeout(schedule, 1500); setTimeout(schedule, 4000);
})();
