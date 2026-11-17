// فلاش ستور — سكربت واحد صغير بدون مكتبات
(() => {
  const q = (s, r = document) => r.querySelector(s);
  const qa = (s, r = document) => [...r.querySelectorAll(s)];

  // تصفية صفحة الخدمات (تقرأ ?f= من الرابط)
  const chips = qa('.chip');
  if (chips.length) {
    const apply = f => {
      chips.forEach(c => c.setAttribute('aria-pressed', c.dataset.f === f));
      qa('[data-k]').forEach(el => { el.hidden = !!f && el.dataset.k !== f; });
    };
    chips.forEach(c => c.addEventListener('click', () => {
      apply(c.dataset.f);
      history.replaceState(null, '', c.dataset.f ? '?f=' + c.dataset.f : location.pathname);
    }));
    apply(new URLSearchParams(location.search).get('f') || '');
  }

  // صفحة المنتج: تحديث السعر، التحقق من الرابط، الشريط الثابت
  const form = q('#buy');
  if (!form) return;
  const unit = form.dataset.unit;
  const fmt = n => Number(n).toLocaleString('en-US');
  form.addEventListener('change', e => {
    if (e.target.name !== 'q') return;
    const p = e.target.dataset.p, line = fmt(e.target.value) + ' ' + unit;
    q('#price').textContent = q('#sprice').textContent = p;
    q('#unitline').textContent = q('#sunit').textContent = line;
  });
  const link = q('#link'), hint = q('#lh'), hint0 = hint.textContent;
  const ok = v => /^https?:\/\/([\w-]+\.)?tiktok\.com\/.+/i.test(v.trim());
  link.addEventListener('input', () => {
    link.removeAttribute('aria-invalid'); hint.className = 'hint'; hint.textContent = hint0;
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!ok(link.value)) {
      link.setAttribute('aria-invalid', 'true'); hint.className = 'hint err';
      hint.textContent = 'الرابط لازم يكون من تيك توك ويبدأ بـ https://';
      link.focus(); return;
    }
    const cc = q('#cc'); cc.hidden = false; cc.textContent = +cc.textContent + 1;
    const t = q('#toast'); t.textContent = 'انضاف للسلة ✓ (نسخة تجريبية)'; t.classList.add('on');
    setTimeout(() => t.classList.remove('on'), 2200);
  });
  const btn = q('.buy .btn'), sticky = q('#sticky');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) =>
      sticky.classList.toggle('on', !e.isIntersecting && e.boundingClientRect.top < 0)).observe(btn);
  }
})();
