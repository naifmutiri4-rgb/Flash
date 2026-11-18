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
    if (!isNaN(unit)) label2 = (Math.round(unit * qty * 100) / 100).toFixed(2) + ' ' + cur(sel.p);
    else if (!document.querySelector('.product-single .s-product-options-grid-mode')) {
      var tp = document.querySelector('.product-single .main-content > .price .total-price');
      // سلة تحدّث السعر العلوي للباقات حسب العدد، فنعرضه كما هو بدون ضرب
      if (tp && !isNaN(num(tp.textContent))) label2 = num(tp.textContent).toFixed(2) + ' ' + (cur(tp.textContent) || 'ر.س');
    }
    if (label2) btn.setAttribute('data-lv-total', label2); else btn.removeAttribute('data-lv-total');
  }

  var queued = false;
  function schedule() { if (queued) return; queued = true; requestAnimationFrame(function () { queued = false; try { update(); } catch (e) { } }); }
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
})();
