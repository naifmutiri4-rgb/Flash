#!/usr/bin/env python3
"""يولّد وصف المنتجات بتصميم v2 (أنماط inline، بدون ألوان نص ثابتة على الخلفية)."""
import json, pathlib

R = pathlib.Path(__file__).parent
D = json.loads((R.parent / "_src" / "data.json").read_text(encoding="utf-8"))
IDS = {"saver": 1368006104, "saver-plus": 1949748553, "interact": 1246605374, "gold": 950743674,
       "explore": 651289082, "views": 1591098480, "likes": 767542597, "shares": 904807258, "saves": 2046465224}
A, INK, CARD, LINE, FG, MUT = "#FDD407", "#0D0D10", "#222228", "#303037", "#F3F3F1", "#A6A6AE"
ICON = {
    "i-eye": '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="12" cy="12" r="3.2" fill="currentColor"/>',
    "i-heart": '<path fill="currentColor" d="M12 21s-7.5-4.6-9.5-9.2C1 8.2 3.4 4.5 7 4.5c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.6 0 6 3.7 4.5 7.3C19.5 16.4 12 21 12 21z"/>',
    "i-share": '<path fill="currentColor" d="M14 3.5l7.5 7.5-7.5 7.5v-4.2c-6 0-9.3 2.1-11.5 6.2 0-7.3 3.3-12.3 11.5-13.3z"/>',
    "i-save": '<path fill="currentColor" d="M6 2.5h12a1 1 0 0 1 1 1V22l-7-4.6L5 22V3.5a1 1 0 0 1 1-1z"/>',
}
TILE = f"background:{CARD};border:1px solid {LINE};border-radius:16px;padding:14px;color:{FG}"
GRID = "display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:0 0 18px"
H = "font-size:18px;font-weight:800;margin:0 0 10px"


def icon(k):
    return (f'<span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;'
            f'border-radius:10px;background:{A};color:{INK}"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">{ICON[k]}</svg></span>')


def facts(sold):
    cells = [("فوري", "مدة التنفيذ"), ("أجانب", "نوع الحسابات"), ("مرة واحدة", "ضمان التعويض")]
    return (f'<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:0 0 18px">'
            + "".join(f'<div style="{TILE};text-align:center;padding:12px 6px"><b style="display:block;font-size:16px;font-weight:800;color:{FG}">{b}</b>'
                      f'<small style="color:{MUT};font-size:12px">{s}</small></div>' for b, s in cells) + "</div>")


RULES = (f'<h3 style="{H}">قبل ما تطلب</h3><ul style="margin:0 0 14px;padding-inline-start:20px;line-height:1.9">'
         '<li>تأكد إن الحساب <b>عام</b> وليس خاصاً (برايفت).</li>'
         '<li>الصق <b>الرابط</b> فقط، ما نطلب كلمة المرور أبداً.</li>'
         '<li>لا تغيّر اسم المستخدم أثناء التنفيذ، وإلا يُلغى الطلب بدون تعويض.</li>'
         '<li>لا يمكن إلغاء الطلب بعد بدء التنفيذ أو بعد انتهائه.</li></ul>'
         f'<div style="border:1.5px solid {A};border-radius:16px;padding:14px;margin:0 0 6px">'
         '<b>ضمان ضد النقص</b><br>يوجد ضمان حسب سياسة فلاش ستور، والتعويض يكون <b>لمرة واحدة فقط</b> بسبب كثرة التحديثات الأمنية في منصة تيك توك.</div>')


def pack_desc(p):
    tiles = "".join(f'<div style="{TILE}"><div style="display:flex;align-items:center;gap:8px;color:{MUT};font-size:13px">{icon(i)}{u}</div>'
                    f'<b style="display:block;font-size:26px;font-weight:900;margin-top:8px;direction:ltr;text-align:right;color:{FG}">{n}</b></div>'
                    for i, n, u in p["items"])
    return (f'<div dir="rtl" style="font-size:15px">{facts(p["sold"])}<h3 style="{H}">محتويات الباقة</h3>'
            f'<div style="{GRID}">{tiles}</div>{RULES}</div>')


def single_desc(s):
    tiers = sorted(s["tiers"])
    return (f'<div dir="rtl" style="font-size:15px">{facts(s["sold"])}<h3 style="{H}">الكميات المتاحة</h3>'
            f'<p style="margin:0 0 18px">من <b>{tiers[0][0]:,}</b> إلى <b>{tiers[-1][0]:,}</b> {s["unit"]}، اختر الكمية من الأزرار فوق.</p>{RULES}</div>')


out = {}
for p in D["packs"]:
    out[p["slug"]] = {"id": IDS[p["slug"]], "description": pack_desc(p)}
for s in D["singles"]:
    out[s["slug"]] = {"id": IDS[s["slug"]], "description": single_desc(s)}
(R / "descriptions.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
preview = "".join(f'<h2 style="color:#fff;font-family:system-ui">{k}</h2><div style="max-width:420px;color:{FG};font-family:system-ui">{v["description"]}</div>' for k, v in out.items() if k in ("interact", "likes"))
(R / "descriptions-preview.html").write_text(f'<!doctype html><html dir="rtl" lang="ar"><meta charset="utf-8"><body style="background:#18181C;padding:16px">{preview}</body></html>', encoding="utf-8")
print({k: len(v["description"]) for k, v in out.items()})
