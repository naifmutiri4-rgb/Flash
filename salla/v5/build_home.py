#!/usr/bin/env python3
"""فلاش ستور v5 — أقسام HTML للرئيسية (ثيم ملاك، المسودة «ترتيب ذكاء»).

الفكرة: «الرف هو البطل». أول شاشة = عنوان الصفحة + الباقات مباشرة (عنوان قسم الباقات يرسمه سلة من السيرفر،
فيظهر خلال ثانية ويصير هو LCP بدل صور المنتجات اللي تتحمّل بالجافاسكربت).
العنصر المميز الوحيد: «العدّاد» — أرقام بكج التوفير تدور مثل عدّاد المشاهدات لما يوصل له العميل بالتمرير
(CSS فقط: scroll-driven animation، وبدونها تظهر الأرقام ثابتة). الباقي هادي: قائمة أسعار بخطوط فاصلة بدل كروت.

التنسيق كله في salla/v4/flash-malak.css (قسم 12)، وهنا HTML بكلاسات فقط عشان يكون خفيف."""
import json, pathlib

OUT = pathlib.Path(__file__).parent
BASE = "https://flashstore-ksa.com"
POLICY = f"{BASE}/سياسية-التعويض/page-874817686"

ICON = {
    "eye": '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="currentColor"/>',
    "heart": '<path fill="currentColor" d="M12 20.5s-7.5-4.6-9.5-9.2C1 7.7 3.4 4 7 4c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.6 0 6 3.7 4.5 7.3-2 4.6-9.5 9.2-9.5 9.2z"/>',
    "share": '<path fill="currentColor" d="M14 3.5l7.5 7.5-7.5 7.5v-4.2c-6 0-9.3 2.1-11.5 6.2 0-7.3 3.3-12.3 11.5-13.3z"/>',
    "save": '<path fill="currentColor" d="M6 2.5h12a1 1 0 0 1 1 1V22l-7-4.6L5 22V3.5a1 1 0 0 1 1-1z"/>',
    "bolt": '<path fill="currentColor" d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    "lock": '<rect x="4.5" y="10.5" width="15" height="10" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2"/>',
    "shield": '<path d="M12 2.5 4 5.5v6c0 5 3.4 8.8 8 10 4.6-1.2 8-5 8-10v-6z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="m8.5 12 2.5 2.5 4.5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    "card": '<rect x="2.5" y="5" width="19" height="14" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M2.5 10h19" stroke="currentColor" stroke-width="2"/>',
    "chev": '<path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
}


def svg(name, size=22):
    return f'<svg viewBox="0 0 24 24" width="{size}" height="{size}" aria-hidden="true">{ICON[name]}</svg>'


def odometer(num):
    """رقم بخانات تدور: كل خانة شريط 0-9 يتحرك لأعلى حتى رقمها. الفواصل ثابتة. --d = الرقم النهائي."""
    out = []
    for i, ch in enumerate(num):
        if ch.isdigit():
            strip = "".join(f"<i>{k}</i>" for k in range(10))
            out.append(f'<span class="fx-od__d" style="--d:{ch};--i:{i}">{strip}</span>')
        else:
            out.append(f'<span class="fx-od__s">{ch}</span>')
    # قارئ الشاشة يقرأ الرقم كامل، والخانات المتحركة مخفية عنه
    return f'<span class="fx-od" dir="ltr"><span class="fx-sr">{num}</span><span aria-hidden="true">{"".join(out)}</span></span>'


SAVER = [("eye", "2,000", "مشاهدة"), ("heart", "250", "لايك"), ("share", "50", "شير"), ("save", "50", "حفظ")]


def counter():
    rail = "".join(f'<li><span class="fx-rail__ic">{svg(i, 26)}</span>{odometer(n)}<small>{u}</small></li>' for i, n, u in SAVER)
    return f'''<section class="fx-counter" aria-labelledby="fx-counter-h">
<div class="fx-counter__text">
<p class="fx-kicker">الأكثر طلباً آخر 3 شهور</p>
<h2 id="fx-counter-h">بكج التوفير</h2>
<p class="fx-counter__lead">بداية مناسبة لأي مقطع: مشاهدات ولايكات وشير وحفظ، في طلب واحد.</p>
<p class="fx-counter__price"><b>9.99</b> ر.س</p>
<a class="fx-btn" href="{BASE}/بكج-التوفير/p1368006104">اطلب بكج التوفير</a>
</div>
<ol class="fx-rail">{rail}</ol>
</section>'''


SINGLES = [
    ("eye", "مشاهدات", "مشاهدات-تيك-توك/p1591098480", "4.99", "2,000 إلى 1,000,000"),
    ("heart", "لايكات", "لايكات-تيك-توك/p767542597", "5.99", "250 إلى 100,000"),
    ("share", "شير", "شير-تيك-توك/p904807258", "1.99", "50 إلى 10,000"),
    ("save", "حفظ", "حفظ-تيك-توك/p2046465224", "1.99", "50 إلى 10,000"),
]


def services():
    rows = "".join(
        f'<li><a href="{BASE}/{u}"><span class="fx-board__ic">{svg(i, 24)}</span>'
        f'<span class="fx-board__name"><b>{n}</b><small>{r}</small></span>'
        f'<span class="fx-board__price"><small>من</small><b>{p}</b><small>ر.س</small></span>'
        f'<span class="fx-board__go">{svg("chev", 18)}</span></a></li>'
        for i, n, u, p, r in SINGLES)
    return f'''<section id="fx-services" class="fx-board" aria-labelledby="fx-board-h">
<header><h2 id="fx-board-h">خدمة مفردة</h2><p>تبي نوع واحد بس؟ اختر الخدمة، وحدّد الكمية بالضبط داخل صفحتها.</p></header>
<ul>{rows}</ul>
</section>'''


STEPS = [("اختر الباقة أو الخدمة", "وحدّد الكمية اللي تناسبك."),
         ("الصق رابط المقطع", "الرابط فقط، ما نطلب كلمة المرور أبداً."),
         ("ادفع ويبدأ التنفيذ", "آلياً مباشرة بعد إتمام الدفع.")]
WHY = [("bolt", "تنفيذ آلي", "طلبك يدخل النظام مباشرة بعد الدفع، بدون انتظار موظف."),
       ("lock", "بدون كلمة مرور", "نحتاج رابط المقطع فقط، وحسابك يبقى معك."),
       ("shield", "ضمان ضد النقص", f'التعويض حسب <a href="{POLICY}">سياسة المتجر</a>.'),
       ("card", "دفع آمن", "مدى والبطاقات الائتمانية، وأبل باي و STC Pay.")]


def how_why():
    steps = "".join(f'<li><b>{k}</b><span><strong>{t}</strong><small>{d}</small></span></li>' for k, (t, d) in enumerate(STEPS, 1))
    why = "".join(f'<li><span class="fx-why__ic">{svg(i, 22)}</span><span><strong>{t}</strong><small>{d}</small></span></li>' for i, t, d in WHY)
    return f'''<section class="fx-how" aria-labelledby="fx-how-h"><h2 id="fx-how-h">كيف تطلب؟</h2><ol class="fx-steps">{steps}</ol></section>
<section class="fx-why" aria-labelledby="fx-why-h"><h2 id="fx-why-h">ليش فلاش ستور؟</h2><ul>{why}</ul></section>'''


blocks = {"counter": counter(), "services": services(), "how_why": how_why()}
(OUT / "home-blocks.json").write_text(json.dumps(blocks, ensure_ascii=False, indent=1), encoding="utf-8")
for k, v in blocks.items():
    (OUT / f"{k}.html").write_text(v, encoding="utf-8")
print({k: len(v) for k, v in blocks.items()})
