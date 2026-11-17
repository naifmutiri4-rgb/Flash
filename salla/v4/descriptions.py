#!/usr/bin/env python3
"""أوصاف المنتجات v4 — بصيغة يقبلها محرر سلة (Quill): h3, p, ul/li, strong, a فقط.
الترتيب حسب البريف: الاسم ← مقدمة ← التفاصيل والكمية ← مدة التنفيذ ← نوع الخدمة ← المتطلبات ← الضمان ← التنبيهات.
كل المعلومات من بيانات المتجر الحالية (data.json والأوصاف المعتمدة) — ما فيه معلومة جديدة مخترعة."""
import json, pathlib

R = pathlib.Path(__file__).parent
D = json.loads((R.parent.parent / "_src" / "data.json").read_text(encoding="utf-8"))
IDS = {"saver": 1368006104, "saver-plus": 1949748553, "interact": 1246605374, "gold": 950743674,
       "explore": 651289082, "views": 1591098480, "likes": 767542597, "shares": 904807258, "saves": 2046465224}
POLICY = "https://flashstore-ksa.com/سياسية-التعويض/page-874817686"
WORD = {"مشاهدة": "مشاهدات", "لايك": "لايكات", "شير": "شير", "حفظ": "حفظ"}

INFO = ("<h3>معلومات الخدمة</h3><ul>"
        "<li>مدة التنفيذ: <strong>فوري وآلي بعد الدفع</strong></li>"
        "<li>نوع الحسابات: <strong>أجانب</strong></li>"
        "<li>المطلوب منك: <strong>رابط المقطع فقط</strong></li>"
        "<li>ضمان النقص: <strong>حسب سياسة المتجر</strong></li></ul>")
RULES = ("<h3>قبل ما تطلب</h3><ul>"
         "<li>تأكد إن الحساب <strong>عام</strong> وليس خاصاً (برايفت).</li>"
         "<li>الصق <strong>رابط المقطع</strong> فقط، ما نطلب كلمة المرور أبداً.</li>"
         "<li>لا تغيّر اسم المستخدم أثناء التنفيذ، وإلا يُلغى الطلب بدون تعويض.</li>"
         "<li>لا يمكن إلغاء الطلب بعد بدء التنفيذ أو بعد انتهائه.</li></ul>"
         f'<p><strong>ضمان ضد النقص:</strong> التعويض حسب سياسة المتجر. <a href="{POLICY}">اقرأ سياسة التعويض</a></p>')


def pack_desc(p):
    parts = "، ".join(f"{n} {u}" for _, n, u in p["items"])
    items = "".join(f"<li><strong>{n}</strong> {u}</li>" for _, n, u in p["items"])
    intro = f"<p>{p['name']} يجمع لك {parts} لمقطع واحد، في طلب واحد.</p>"
    return f"<h3>محتويات الباقة</h3><ul>{items}</ul>{intro}{INFO}{RULES}"


def single_desc(s):
    t = sorted(s["tiers"])
    word = WORD.get(s["unit"], s["unit"])
    intro = (f"<p>زوّد {word} مقطعك على تيك توك بالكمية اللي تناسبك. "
             f"اختر الكمية من الأزرار فوق، والسعر مكتوب على كل زر.</p>")
    rng = (f"<h3>الكميات المتاحة</h3><p>من <strong>{t[0][0]:,}</strong> إلى <strong>{t[-1][0]:,}</strong> "
           f"{s['unit']}، {len(t)} {'كميات' if 3 <= len(t) <= 10 else 'كمية'} مرتبة من الأقل للأعلى.</p>")
    return f"{rng}{intro}{INFO}{RULES}"


out = {}
for p in D["packs"]:
    out[p["slug"]] = {"id": IDS[p["slug"]], "description": pack_desc(p)}
for s in D["singles"]:
    out[s["slug"]] = {"id": IDS[s["slug"]], "description": single_desc(s)}
(R / "descriptions.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
print({k: len(v["description"]) for k, v in out.items()})
