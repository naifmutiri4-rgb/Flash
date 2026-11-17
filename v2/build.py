#!/usr/bin/env python3
"""يبني نسخة v2 (Bento فاتح). التشغيل: python3 v2/build.py  (الصور: node v2/_tools/images.js)"""
import json, pathlib

R = pathlib.Path(__file__).parent
D = json.loads((R.parent / "_src" / "data.json").read_text(encoding="utf-8"))
SPRITE = (R.parent / "_parts" / "sprite.html").read_text(encoding="utf-8").strip()
METRIC = {"i-eye": "views", "i-heart": "likes", "i-share": "shares", "i-save": "saves", "i-user": "followers"}
packs = sorted([p for p in D["packs"] if not p.get("out")], key=lambda p: p["price"])
best = max(packs, key=lambda p: p["sold"])


def money(x):
    return f"{x:.2f}"


def ico(i, cls="ic"):
    return f'<svg class="{cls}"><use href="#{i}"/></svg>'


HEAD = """<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#18181C">
<link rel="preload" href="fonts/readex-pro-arabic-700-normal.woff2" as="font" type="font/woff2" crossorigin>
{preload}<link rel="stylesheet" href="style.css">
</head>
<body>
""" + SPRITE + """
<a class="sr-only" href="#main">تخطَّ إلى المحتوى</a>
<div class="bar">خصم 10% على كل الخدمات بكود <b>F10</b></div>
<header class="hd"><div class="w">
<a class="logo" href="index.html"><i>""" + ico("i-bolt") + """</i>فلاش ستور</a>
<nav class="nav" aria-label="القائمة الرئيسية"><a href="index.html#packs">الباقات</a><a href="index.html#services">الخدمات</a><a href="index.html#how">كيف تطلب</a><a href="index.html#faq">الأسئلة</a></nav>
<div class="sp"></div>
<a class="ib" href="#" aria-label="السلة">""" + ico("i-cart") + """<em id="cc" hidden>0</em></a>
</div></header>
"""

FOOT = """<footer><div class="w">
<div><a class="logo" href="index.html"><i style="color:#111114">""" + ico("i-bolt") + """</i>فلاش ستور</a>
<p>خدمات تفاعل تيك توك بتنفيذ آلي فوري. ما نطلب كلمة مرورك أبداً.</p>
<div class="pay"><span>مدى</span><span>Apple Pay</span><span>Visa</span><span>Mastercard</span></div></div>
<div><h4>الخدمات</h4><ul><li><a href="index.html#packs">الباقات</a></li><li><a href="p-views.html">المشاهدات</a></li><li><a href="p-likes.html">اللايكات</a></li><li><a href="p-shares.html">الشير والحفظ</a></li></ul></div>
<div><h4>المتجر</h4><ul><li><a href="#">سياسة الاستبدال والاسترجاع</a></li><li><a href="#">الشروط والأحكام</a></li><li><a href="#">سياسة الخصوصية</a></li></ul></div>
<div><h4>تواصل معنا</h4><ul><li><a href="#">واتساب — 24 ساعة</a></li><li><a href="#">تيك توك</a></li><li><a href="#">إنستقرام</a></li></ul></div>
</div></footer>
<script src="app.js" defer></script>
</body>
</html>
"""


def strike(p):
    return f'<s>{money(p["regular"])}</s>' if p.get("regular") else ""


def bars(level):
    return "".join(f'<i class="{"on" if k < level else ""}"></i>' for k in range(len(packs)))


def pack_card(p, lvl, lazy=True):
    hot = p is best
    return (f'<a class="pk{" hot" if hot else ""}" href="p-{p["slug"]}.html">'
            f'<img src="img/{p["slug"]}.webp" width="600" height="600" alt="{p["name"]}: '
            + "، ".join(f"{n} {u}" for _, n, u in p["items"]) + f'"{" loading=lazy" if lazy else ""}>'
            f'<div class="bd">{"<span class=badge>الأكثر طلباً</span>" if hot else ""}<h3>{p["name"]}</h3>'
            f'<div class="lvl">المستوى <span>{bars(lvl)}</span></div>'
            f'<div class="row"><div class="num">{strike(p)}{money(p["price"])} <small>ر.س</small></div>'
            f'<span class="go" aria-hidden="true"><svg class="ic"><use href="#i-arrow"/></svg></span></div></div></a>')


def metric_tile(s):
    lo = min(t[1] for t in s["tiers"])
    return (f'<a class="mt m-{METRIC[s["icon"]]}" href="p-{s["slug"]}.html"><span class="gl">{ico(s["icon"])}</span>'
            f'<div><h3>{s["name"].replace(" تيك توك", "")}</h3><span>يبدأ من<b>{money(lo)} ر.س</b></span></div></a>')


total_sold = sum(p["sold"] for p in D["packs"]) + sum(s["sold"] for s in D["singles"]) + D.get("hidden_sold", 0)
home = HEAD.format(
    title="فلاش ستور — مشاهدات ولايكات تيك توك بتنفيذ آلي فوري",
    desc="باقات تفاعل تيك توك تبدأ من 9.99 ر.س: مشاهدات، لايكات، شير وحفظ. تنفيذ آلي فوري بدون كلمة مرور.",
    preload=f'<link rel="preload" href="img/{best["slug"]}.webp" as="image">\n') + f"""<main id="main" class="w">
<div class="bento">
  <div class="tile t-hero">
    <div><span class="kick"><i></i>التنفيذ شغّال الآن، آلياً</span>
    <h1>خلّ مقطعك<br>يوصل <span>للإكسبلور</span></h1>
    <p>مشاهدات ولايكات وشير وحفظ لتيك توك. تدفع، ويبدأ التنفيذ خلال دقائق.</p></div>
    <div class="acts"><a class="btn btn-y" href="#packs">اختر باقتك</a><a class="btn btn-o" href="#services">خدمة وحدة</a></div>
  </div>
  <a class="tile t-best" href="p-{best["slug"]}.html">
    <img src="img/{best["slug"]}.webp" width="600" height="600" alt="{best["name"]}" fetchpriority="high">
    <div><small>الأكثر طلباً</small><h2>{best["name"]}</h2><div class="num">{money(best["price"])} <small>ر.س</small></div><span class="btn btn-k">اطلبه الآن</span></div>
  </a>
  <div class="tile t-stat"><div class="num">+{(total_sold // 100) * 100:,}</div><span>خدمة منفّذة</span></div>
  <div class="tile t-stat"><div class="num">فوري</div><span>يبدأ بعد الدفع مباشرة</span></div>
  <div class="tile t-stat"><div class="num">0</div><span>كلمات مرور نطلبها</span></div>
</div>

<section class="blk" id="services">
  <div class="hg"><div><h2>اختر اللي تحتاجه</h2><p>اختر الخدمة، وحدد الكمية بالضبط.</p></div></div>
  <div class="metrics">{"".join(metric_tile(s) for s in D["singles"])}</div>
</section>

<section class="blk" id="packs">
  <div class="hg"><div><h2>باقات تيك توك</h2><p>مشاهدات ولايك وشير وحفظ لمقطع واحد، بطلب واحد.</p></div></div>
  <div class="packs">{"".join(pack_card(p, i + 1) for i, p in enumerate(packs))}</div>
</section>

<section class="blk" id="how">
  <div class="hg"><div><h2>كيف تطلب؟</h2><p>ثلاث خطوات، وأقل من دقيقة.</p></div></div>
  <div class="steps">
    <div class="st"><div><h3>اختر الخدمة والكمية</h3><p>باقة جاهزة أو خدمة وحدة.</p></div></div>
    <div class="st"><div><h3>الصق رابط المقطع</h3><p>الرابط فقط، بدون كلمة مرور.</p></div></div>
    <div class="st"><div><h3>ادفع ويبدأ التنفيذ</h3><p>آلياً مباشرة بعد الدفع.</p></div></div>
  </div>
</section>

<section class="blk">
  <div class="trust">
    <div class="tr"><svg style="color:var(--saves)"><use href="#i-bolt"/></svg><h3>تنفيذ آلي</h3><p>حتى في الليل.</p></div>
    <div class="tr"><svg style="color:var(--views)"><use href="#i-lock"/></svg><h3>بدون كلمة مرور</h3><p>حسابك يبقى بيدك.</p></div>
    <div class="tr"><svg style="color:var(--shares)"><use href="#i-check"/></svg><h3>ضمان ضد النقص</h3><p>تعويض لمرة واحدة.</p></div>
    <div class="tr"><svg style="color:var(--likes)"><use href="#i-chat"/></svg><h3>دعم واتساب</h3><p>أرسل رقم طلبك ونرد.</p></div>
  </div>
</section>

<section class="blk" id="faq">
  <div class="hg"><div><h2>الأسئلة الشائعة</h2></div></div>
  <div class="faq">
    <details><summary>متى يبدأ تنفيذ طلبي؟</summary><p>آلياً بعد إتمام الدفع مباشرة. أغلب الطلبات تبدأ خلال دقائق.</p></details>
    <details><summary>هل تحتاجون كلمة مرور حسابي؟</summary><p>لا، أبداً. نحتاج رابط المقطع أو الحساب فقط.</p></details>
    <details><summary>وش لازم أسوي قبل الطلب؟</summary><p>تأكد إن حسابك عام، ولا تغيّر اسم المستخدم أثناء التنفيذ لأن الطلب يُلغى.</p></details>
    <details><summary>هل يوجد ضمان على النقص؟</summary><p>نعم، يوجد ضمان ضد النقص حسب سياسة فلاش ستور. التعويض يكون لمرة واحدة فقط، بسبب كثرة التحديثات الأمنية في منصة تيك توك.</p></details>
    <details><summary>أقدر ألغي الطلب؟</summary><p>لا يمكن إلغاء الطلب بعد بدء التنفيذ أو بعد انتهائه.</p></details>
    <details><summary>وش وسائل الدفع؟</summary><p>مدى، Apple Pay، والبطاقات الائتمانية.</p></details>
  </div>
</section>
</main>
""" + FOOT
(R / "index.html").write_text(home, encoding="utf-8")
print("index.html", len(home.encode()))

RULES = """<h2>قبل ما تطلب</h2><ul><li>تأكد إن الحساب <b>عام</b> وليس خاصاً.</li><li>لا تغيّر اسم المستخدم أثناء التنفيذ، وإلا يُلغى الطلب بدون تعويض.</li><li>لا يمكن إلغاء الطلب بعد بدء التنفيذ.</li><li>ضمان ضد النقص: التعويض لمرة واحدة فقط حسب سياسة فلاش ستور.</li></ul>"""


def product(slug, name, price, unitline, unit, tiers_html, color, sold, extra, desc, rating="", acct=False):
    html = HEAD.format(title=f"{name} — فلاش ستور", desc=desc, preload=f'<link rel="preload" href="img/{slug}.webp" as="image">\n') + f"""<main id="main" class="w">
<div class="pp">
  <div class="vis"><img src="img/{slug}.webp" width="600" height="600" alt="{name}"></div>
  <form id="buy" novalidate data-unit="{unit}">
    <div class="bc"><a href="index.html">الرئيسية</a> / {name}</div>
    <h1>{name}</h1>{rating}
    <div class="bigp"><span id="price">{price}</span> <small>ر.س</small></div>
    <p class="unit" id="unitline">{unitline}</p>
    {tiers_html.replace('class="tiers"', f'class="tiers" style="--c:{color}"')}
    <label class="lbl" for="link">{"رابط الحساب" if acct else "رابط المقطع"} <small>(مطلوب)</small></label>
    <input class="inp" id="link" name="link" type="url" inputmode="url" autocomplete="off" placeholder="https://www.tiktok.com/@user{'' if acct else '/video/…'}" aria-describedby="lh" required>
    <p class="hint" id="lh">{"الصق رابط حسابك (وليس اسم المستخدم)." if acct else "انسخ الرابط من زر المشاركة في تيك توك."}</p>
    <div class="buy"><button class="btn btn-y" type="submit">أضف للسلة</button></div>
    <div class="facts"><div><b>فوري</b>مدة التنفيذ</div><div><b>أجانب</b>نوع الحسابات</div><div><b>{sold}</b>مرة طُلبت</div></div>
    <div class="desc">{extra}{RULES}</div>
  </form>
</div>
</main>
<div class="sticky" id="sticky"><div><b><span id="sprice">{price}</span> ر.س</b><small id="sunit">{unitline}</small></div><button class="btn btn-y" form="buy" type="submit">أضف للسلة</button></div>
<div class="toast" id="toast" role="status" aria-live="polite"></div>
""" + FOOT
    (R / f"p-{slug}.html").write_text(html, encoding="utf-8")
    print(f"p-{slug}.html", len(html.encode()))


for p in packs:
    summary = "، ".join(f"{n} {u}" for _, n, u in p["items"])
    product(p["slug"], p["name"], money(p["price"]), summary, "", "", "var(--ink)", p["sold"],
            "<h2>محتويات الباقة</h2><ul>" + "".join(f"<li><b>{n}</b> {u}</li>" for _, n, u in p["items"]) + "</ul>",
            f'{p["name"]}: {summary} لمقطع تيك توك واحد بـ {money(p["price"])} ر.س. تنفيذ آلي فوري.',
            f'<p class="rate">★ {p["rating"][0]} من {p["rating"][1]} تقييمات</p>' if p.get("rating") else "")

for s in D["singles"]:
    tiers = sorted(s["tiers"])
    d = next((t for t in tiers if t[0] == s.get("hot")), tiers[0])
    labels = "".join(
        f'<label>{"<span class=hotx>الأكثر طلباً</span>" if q == s.get("hot") else ""}<input type="radio" name="q" value="{q}" data-p="{money(pr)}"{" checked" if [q, pr] == list(d) else ""}><b>{q:,}</b><small>{money(pr)} ر.س</small></label>'
        for q, pr in tiers)
    product(s["slug"], s["name"], money(d[1]), f'{d[0]:,} {s["unit"]}', s["unit"],
            f'<span class="lbl" id="ql">اختر الكمية</span><div class="tiers" role="radiogroup" aria-labelledby="ql">{labels}</div>',
            f'var(--{METRIC[s["icon"]]})', s["sold"], "",
            f'{s["name"]} من فلاش ستور تبدأ من {money(min(t[1] for t in tiers))} ر.س. تنفيذ آلي فوري بدون كلمة مرور.',
            acct=s.get("link") == "account")
