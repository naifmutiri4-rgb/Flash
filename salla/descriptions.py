#!/usr/bin/env python3
"""وصف المنتجات بصيغة يقبلها محرر سلة (Quill): عناوين، قوائم، خط عريض، رابط.
بدون أنماط inline، عشان ما ينشال شي لو انفتح المنتج من لوحة سلة وانحفظ.
الشكل (المربعات والألوان) يجي من salla/malak-product.css."""
import json, pathlib

R = pathlib.Path(__file__).parent
D = json.loads((R.parent / "_src" / "data.json").read_text(encoding="utf-8"))
IDS = {"saver": 1368006104, "saver-plus": 1949748553, "interact": 1246605374, "gold": 950743674,
       "explore": 651289082, "views": 1591098480, "likes": 767542597, "shares": 904807258, "saves": 2046465224}
POLICY = "https://flashstore-ksa.com/سياسية-التعويض/page-874817686"

INFO = ("<h3>معلومات الخدمة</h3><ul><li>مدة التنفيذ: <strong>فوري</strong></li>"
        "<li>نوع الحسابات: <strong>أجانب</strong></li><li>ضمان التعويض: <strong>حسب السياسة</strong></li></ul>")
RULES = ("<h3>قبل ما تطلب</h3><ul><li>تأكد إن الحساب <strong>عام</strong> وليس خاصاً (برايفت).</li>"
         "<li>الصق <strong>الرابط</strong> فقط، ما نطلب كلمة المرور أبداً.</li>"
         "<li>لا تغيّر اسم المستخدم أثناء التنفيذ، وإلا يُلغى الطلب بدون تعويض.</li>"
         "<li>لا يمكن إلغاء الطلب بعد بدء التنفيذ أو بعد انتهائه.</li></ul>"
         f'<p><strong>ضمان ضد النقص:</strong> التعويض حسب سياسة المتجر. <a href="{POLICY}">اقرأ سياسة التعويض</a></p>')


def pack_desc(p):
    items = "".join(f"<li><strong>{n}</strong> {u}</li>" for _, n, u in p["items"])
    return f"<h3>محتويات الباقة</h3><ul>{items}</ul>{INFO}{RULES}"


def single_desc(s):
    t = sorted(s["tiers"])
    return (f"<h3>الكميات المتاحة</h3><p>من <strong>{t[0][0]:,}</strong> إلى <strong>{t[-1][0]:,}</strong> "
            f"{s['unit']}، اختر الكمية من الأزرار فوق.</p>{INFO}{RULES}")


out = {}
for p in D["packs"]:
    out[p["slug"]] = {"id": IDS[p["slug"]], "description": pack_desc(p)}
for s in D["singles"]:
    out[s["slug"]] = {"id": IDS[s["slug"]], "description": single_desc(s)}
(R / "descriptions.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
print({k: len(v["description"]) for k, v in out.items()})
