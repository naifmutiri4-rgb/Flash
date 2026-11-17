#!/usr/bin/env python3
"""يبني صفحات المتجر الثابتة من _src و _parts. التشغيل: python3 build.py"""
import json, pathlib, re

R = pathlib.Path(__file__).parent
S, P = R / "_src", R / "_parts"
D = json.loads((S / "data.json").read_text(encoding="utf-8"))
parts = {k: (P / f"{k}.html").read_text(encoding="utf-8").strip() for k in ("sprite", "header", "footer")}


def ar(n):
    return f"{n:,}"


def money(x):
    return f"{x:.2f}"


def ico(i):
    return f'<svg><use href="#{i}"/></svg>'


def pack_card(p):
    cls = "pk" + (" hot" if p.get("hot") else "") + (" off" if p.get("out") else "")
    badge = f'<span class="badge">{p["hot"]}</span>' if p.get("hot") else ""
    lis = "".join(f'<li>{ico(i)}<span><b>{n}</b> {u}</span></li>' for i, n, u in p["items"]) or "<li>نفدت الكمية مؤقتاً</li>"
    btn = '<span class="btn">نفدت الكمية</span>' if p.get("out") else '<span class="btn btn-p">اطلب الآن</span>'
    sold = f'<div class="sold">طُلبت {p["sold"]} مرة</div>' if p["sold"] else ""
    tag = "div" if p.get("out") else "a"
    href = "" if p.get("out") else f' href="p-{p["slug"]}.html"'
    return (f'    <{tag} class="{cls}"{href}>{badge}<h3>{p["name"]}</h3>'
            f'<div class="pr">{money(p["price"])}<small>ر.س</small></div><ul>{lis}</ul>{btn}{sold}</{tag}>')


def single_card(s):
    lo = min(s["tiers"], key=lambda t: t[1])
    return (f'    <a class="sv" href="p-{s["slug"]}.html"><span class="gl">{ico(s["icon"])}</span>'
            f'<h3>{s["name"]}</h3><span class="from">يبدأ من<b>{money(lo[1])} ر.س</b></span></a>')


packs_sorted = sorted(D["packs"], key=lambda p: (p.get("out", False), p["price"]))  # النافد آخر شيء
packs_html = "\n".join(pack_card(p) for p in packs_sorted)
singles_html = "\n".join(single_card(s) for s in D["singles"])


def fill(tpl, extra=None):
    out = tpl
    for k, v in {**parts, **(extra or {})}.items():
        out = out.replace("{{" + k + "}}", str(v))
    out = re.sub(r'product\.html\?p=([\w-]+)', r'p-\1.html', out)
    left = re.findall(r"{{\w+}}", out)
    assert not left, left
    return out


def page(name, html, nav=None):
    if nav:
        html = html.replace(f'data-nav="{nav}"', f'data-nav="{nav}" class="on" aria-current="page"')
    (R / name).write_text(html, encoding="utf-8")
    print(f"{name:24} {len(html.encode()):>6} bytes")


common = {"packs": packs_html, "singles": singles_html}
home_packs = "\n".join(pack_card(p) for p in packs_sorted if not p.get("out"))  # الرئيسية تعرض المتوفر فقط
page("index.html", fill((S / "index.html").read_text(encoding="utf-8"), {**common, "packs": home_packs}), "index")
page("category.html", fill((S / "category.html").read_text(encoding="utf-8"), common), "cat")

ptpl = (S / "product.html").read_text(encoding="utf-8")
star = '<p class="rate"><b>★ {0}</b> من {1} تقييمات</p>'
for p in D["packs"]:
    if p.get("out"):
        continue
    contents = "<h2>محتويات الباقة</h2><ul>" + "".join(f"<li><b>{n}</b> {u}</li>" for _, n, u in p["items"]) + "</ul>"
    summary = "، ".join(f"{n} {u}" for _, n, u in p["items"])
    page(f'p-{p["slug"]}.html', fill(ptpl, {
        "name": p["name"], "icon": "i-box", "unit": "", "price": money(p["price"]),
        "metadesc": f'{p["name"]} من فلاش ستور: {summary} لمقطع تيك توك واحد بـ {money(p["price"])} ر.س. تنفيذ آلي فوري.',
        "unitline": summary, "tiers": "", "rating": star.format(*p["rating"]) if p.get("rating") else "",
        "linklabel": "رابط المقطع", "linkhint": "انسخ الرابط من زر المشاركة في تيك توك.",
        "cta": "أضف للسلة", "disabled": "", "sold": p["sold"], "contents": contents}))

for s in D["singles"]:
    tiers = sorted(s["tiers"])
    default = next((t for t in tiers if t[0] == s.get("hot")), tiers[0])
    labels = []
    for qn, pr in tiers:
        chk = " checked" if [qn, pr] == list(default) else ""
        hot = '<span class="hotx">الأكثر طلباً</span>' if qn == s.get("hot") else ""
        labels.append(f'<label>{hot}<input type="radio" name="q" value="{qn}" data-p="{money(pr)}"{chk}>'
                      f'<b>{ar(qn)}</b><small>{money(pr)} ر.س</small></label>')
    tiers_html = (f'<span class="lbl" id="ql">اختر الكمية</span>'
                  f'<div class="tiers" role="radiogroup" aria-labelledby="ql">{"".join(labels)}</div>')
    acct = s.get("link") == "account"
    page(f'p-{s["slug"]}.html', fill(ptpl, {
        "name": s["name"], "icon": s["icon"], "unit": s["unit"], "price": money(default[1]),
        "metadesc": f'{s["name"]} من فلاش ستور تبدأ من {money(min(t[1] for t in tiers))} ر.س. تنفيذ آلي فوري بدون كلمة مرور.',
        "unitline": f'{ar(default[0])} {s["unit"]}', "tiers": tiers_html, "rating": "",
        "linklabel": "رابط الحساب" if acct else "رابط المقطع",
        "linkhint": "الصق رابط حسابك (وليس اسم المستخدم)." if acct else "انسخ الرابط من زر المشاركة في تيك توك.",
        "cta": "أضف للسلة", "disabled": "", "sold": s["sold"], "contents": ""}))

# product.html القديم يحوّل لصفحة الباقة الأكثر طلباً
(R / "product.html").write_text(
    '<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=p-interact.html">'
    '<link rel="canonical" href="p-interact.html"><a href="p-interact.html">بكج التفاعل</a>', encoding="utf-8")
