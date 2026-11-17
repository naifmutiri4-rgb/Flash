#!/usr/bin/env python3
"""فلاش ستور v4 — أقسام الرئيسية لثيم ملاك (المسودة «ترتيب ذكاء»).
كل التنسيق inline عشان ما يعتمد على CSS خارجي، ومقاسات ثابتة عشان ما يتزحزح المحتوى (CLS).
الألوان من هوية Dark Luxury Tech المعتمدة."""
import json, pathlib

OUT = pathlib.Path(__file__).parent
T = dict(bg="#111111", s1="#1E1E1E", line="#343434", fg="#FFFFFF", mut="#B8B8B8",
         p="#FC9E01", pl="#FFC04D", pd="#C77A00", ok="#3DD68C")
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
}


def svg(name, size=22):
    return f'<svg viewBox="0 0 24 24" width="{size}" height="{size}" aria-hidden="true" style="display:block;flex:none">{ICON[name]}</svg>'


def btn(href, text, primary=True):
    if primary:
        st = f"background:{T['p']};color:{T['bg']};border:1.5px solid {T['p']}"
    else:
        st = f"background:transparent;color:{T['fg']};border:1.5px solid {T['line']}"
    return (f'<a href="{href}" style="display:inline-flex;align-items:center;justify-content:center;min-height:52px;'
            f'padding:0 22px;border-radius:14px;font-weight:800;font-size:16px;text-decoration:none;flex:1 1 150px;{st}">{text}</a>')


# ---------- البداية (Hero) + الأكثر طلباً ----------
SAVER = [("eye", "2,000", "مشاهدة"), ("heart", "250", "لايك"), ("share", "50", "شير"), ("save", "50", "حفظ")]


def hero():
    counters = "".join(
        f'<div style="background:{T["bg"]};border:1px solid {T["line"]};border-radius:14px;padding:12px 6px;text-align:center;min-width:0">'
        f'<span style="color:{T["p"]};display:flex;justify-content:center;margin-bottom:6px">{svg(i, 20)}</span>'
        f'<b style="display:block;font-size:18px;font-weight:900;color:{T["fg"]};line-height:1.2;direction:ltr">{n}</b>'
        f'<small style="display:block;font-size:12px;color:{T["mut"]}">{u}</small></div>' for i, n, u in SAVER)
    facts = "".join(
        f'<li style="display:flex;align-items:center;gap:8px;color:{T["mut"]};font-size:14px"><span style="color:{T["p"]}">{svg(i, 18)}</span>{t}</li>'
        for i, t in [("bolt", "تنفيذ آلي بعد الدفع"), ("lock", "الرابط فقط، بدون كلمة مرور"), ("shield", "تعويض النقص حسب السياسة")])
    return f'''<section id="fx-hero" style="margin:12px 16px 8px;padding:28px 20px;border-radius:24px;background:{T["bg"]};background-image:radial-gradient(120% 70% at 100% 0%,rgba(252,158,1,.16),transparent 60%);border:1px solid {T["line"]};color:{T["fg"]}">
<div style="display:flex;flex-wrap:wrap;gap:28px;align-items:center">
<div style="flex:1 1 340px;min-width:0">
<p style="display:inline-flex;align-items:center;gap:8px;margin:0 0 14px;font-size:13px;color:{T["mut"]}"><i style="width:8px;height:8px;border-radius:50%;background:{T["ok"]};display:inline-block"></i>متجر آلي لخدمات تيك توك</p>
<h1 style="font-size:clamp(30px,8.4vw,46px);line-height:1.18;margin:0 0 12px;font-weight:900;color:{T["fg"]}">تفاعل أكثر لمقطعك على تيك توك</h1>
<p style="color:{T["mut"]};font-size:16px;line-height:1.7;max-width:34em;margin:0 0 20px">مشاهدات ولايكات وشير وحفظ. تختار الكمية، تلصق رابط المقطع، ويبدأ التنفيذ آلياً بعد الدفع.</p>
<div style="display:flex;gap:10px;flex-wrap:wrap;max-width:440px">{btn("#fx-packs", "تصفّح الباقات")}{btn("#fx-services", "خدمة مفردة", False)}</div>
<ul style="list-style:none;padding:0;margin:20px 0 0;display:grid;gap:8px">{facts}</ul>
</div>
<div style="flex:1 1 300px;min-width:0;max-width:460px;background:{T["s1"]};border:1.5px solid {T["p"]};border-radius:20px;padding:18px">
<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:14px">
<div><small style="display:block;color:{T["p"]};font-size:13px;font-weight:800">الأكثر طلباً</small><b style="display:block;font-size:20px;font-weight:900;color:{T["fg"]}">بكج التوفير</b></div>
<b style="font-size:24px;font-weight:900;color:{T["fg"]};white-space:nowrap">9.99 <small style="font-size:14px;color:{T["mut"]}">ر.س</small></b></div>
<div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin-bottom:14px">{counters}</div>
<div style="display:flex">{btn(BASE + "/بكج-التوفير/p1368006104", "اطلب بكج التوفير")}</div>
</div></div></section><div id="fx-packs" style="scroll-margin-top:80px"></div>'''


# ---------- خدمة مفردة ----------
SINGLES = [
    ("eye", "مشاهدات", "مشاهدات-تيك-توك/p1591098480", "4.99", "2,000 إلى 1,000,000"),
    ("heart", "لايكات", "لايكات-تيك-توك/p767542597", "5.99", "250 إلى 100,000"),
    ("share", "شير", "شير-تيك-توك/p904807258", "1.99", "50 إلى 10,000"),
    ("save", "حفظ", "حفظ-تيك-توك/p2046465224", "1.99", "50 إلى 10,000"),
]


def services():
    tiles = "".join(
        f'<a href="{BASE}/{u}" style="display:flex;flex-direction:column;gap:12px;background:{T["s1"]};border:1px solid {T["line"]};border-radius:18px;padding:16px;text-decoration:none;color:{T["fg"]};min-height:160px;min-width:0">'
        f'<span style="width:46px;height:46px;border-radius:14px;background:rgba(252,158,1,.12);color:{T["p"]};display:flex;align-items:center;justify-content:center">{svg(i, 24)}</span>'
        f'<span style="display:block"><b style="display:block;font-size:18px;font-weight:900;color:{T["fg"]}">{n}</b>'
        f'<small style="display:block;color:{T["mut"]};font-size:12.5px;line-height:1.5">{r}</small></span>'
        f'<span style="margin-top:auto;display:flex;align-items:baseline;gap:4px;color:{T["fg"]}"><small style="color:{T["mut"]};font-size:13px">من</small><b style="font-size:20px;font-weight:900">{p}</b><small style="color:{T["mut"]};font-size:13px">ر.س</small></span></a>'
        for i, n, u, p, r in SINGLES)
    return f'''<section id="fx-services" style="padding:24px 16px 8px;scroll-margin-top:80px;color:{T["fg"]}">
<h2 style="font-size:clamp(24px,6vw,32px);font-weight:900;margin:0 0 6px;text-align:center;color:{T["fg"]}">خدمة مفردة</h2>
<p style="color:{T["mut"]};margin:0 auto 18px;text-align:center;max-width:32em">تبي نوع واحد بس؟ اختر الخدمة، وحدّد الكمية بالضبط داخل صفحتها.</p>
<div style="display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));max-width:1100px;margin:0 auto">{tiles}</div></section>'''


# ---------- كيف تطلب + ليش فلاش ----------
STEPS = [("اختر الباقة أو الخدمة", "وحدّد الكمية اللي تناسبك."),
         ("الصق رابط المقطع", "الرابط فقط، ما نطلب كلمة المرور أبداً."),
         ("ادفع ويبدأ التنفيذ", "آلياً مباشرة بعد إتمام الدفع.")]
WHY = [("bolt", "تنفيذ آلي", "طلبك يدخل النظام مباشرة بعد الدفع، بدون انتظار موظف."),
       ("lock", "بدون كلمة مرور", "نحتاج رابط المقطع فقط، وحسابك يبقى معك."),
       ("shield", "ضمان ضد النقص", f'التعويض حسب <a href="{POLICY}" style="color:{T["p"]};font-weight:800">سياسة المتجر</a>.'),
       ("card", "دفع آمن", "مدى والبطاقات الائتمانية، وأبل باي و STC Pay.")]


def how_why():
    steps = "".join(
        f'<li style="display:flex;gap:12px;align-items:flex-start;background:{T["s1"]};border:1px solid {T["line"]};border-radius:16px;padding:14px 16px">'
        f'<b style="flex:none;width:32px;height:32px;border-radius:50%;background:{T["p"]};color:{T["bg"]};display:flex;align-items:center;justify-content:center;font-weight:900">{k}</b>'
        f'<span><b style="display:block;font-size:16px;color:{T["fg"]}">{t}</b><small style="display:block;color:{T["mut"]};font-size:14px;line-height:1.6">{d}</small></span></li>'
        for k, (t, d) in enumerate(STEPS, 1))
    why = "".join(
        f'<div style="background:{T["s1"]};border:1px solid {T["line"]};border-radius:16px;padding:16px;min-width:0">'
        f'<span style="color:{T["p"]};display:block;margin-bottom:10px">{svg(i, 24)}</span>'
        f'<b style="display:block;font-size:16px;color:{T["fg"]};margin-bottom:4px">{t}</b><small style="display:block;color:{T["mut"]};font-size:14px;line-height:1.6">{d}</small></div>'
        for i, t, d in WHY)
    h2 = f'font-size:clamp(24px,6vw,32px);font-weight:900;margin:0 0 16px;text-align:center;color:{T["fg"]}'
    return f'''<section style="padding:28px 16px 8px;color:{T["fg"]}"><div style="max-width:1100px;margin:0 auto;display:flex;flex-wrap:wrap;gap:28px">
<div style="flex:1 1 320px;min-width:0"><h2 style="{h2}">كيف تطلب؟</h2><ol style="list-style:none;padding:0;margin:0;display:grid;gap:10px">{steps}</ol></div>
<div style="flex:1 1 320px;min-width:0"><h2 style="{h2}">ليش فلاش ستور؟</h2><div style="display:grid;gap:10px;grid-template-columns:repeat(2,minmax(0,1fr))">{why}</div></div>
</div></section>'''


blocks = {"hero": hero(), "services": services(), "how_why": how_why()}
(OUT / "home-blocks.json").write_text(json.dumps(blocks, ensure_ascii=False, indent=1), encoding="utf-8")
(OUT / "home-preview.html").write_text(
    '<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
    f'<body style="margin:0;background:{T["bg"]};font-family:system-ui,sans-serif">' + "".join(blocks.values()) + "</body></html>", encoding="utf-8")
print({k: len(v) for k, v in blocks.items()})
