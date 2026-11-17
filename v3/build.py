#!/usr/bin/env python3
"""ثلاث تصاميم لثيم ملاك (levels / brutal / power).
الصفحات مبنية بنفس كلاسات سلة (s-product-card-*, s-product-options-grid-mode, s-button-primary ...)
فملف theme.css لكل تصميم هو نفسه «CSS مخصص» لملاك. التشغيل: python3 v3/build.py"""
import json, pathlib

R = pathlib.Path(__file__).parent
D = json.loads((R.parent / "_src" / "data.json").read_text(encoding="utf-8"))
packs = sorted(D["packs"], key=lambda p: p["price"])
singles = D["singles"]
best = max(packs, key=lambda p: p["sold"])
total = sum(p["sold"] for p in D["packs"] + D["singles"]) + D.get("hidden_sold", 0)
money = lambda x: f"{x:.2f}"
ICON = {
    "i-eye": '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="12" cy="12" r="3.2" fill="currentColor"/>',
    "i-heart": '<path fill="currentColor" d="M12 21s-7.5-4.6-9.5-9.2C1 8.2 3.4 4.5 7 4.5c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.6 0 6 3.7 4.5 7.3C19.5 16.4 12 21 12 21z"/>',
    "i-share": '<path fill="currentColor" d="M14 3.5l7.5 7.5-7.5 7.5v-4.2c-6 0-9.3 2.1-11.5 6.2 0-7.3 3.3-12.3 11.5-13.3z"/>',
    "i-save": '<path fill="currentColor" d="M6 2.5h12a1 1 0 0 1 1 1V22l-7-4.6L5 22V3.5a1 1 0 0 1 1-1z"/>',
    "bolt": '<path fill="currentColor" d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    "cart": '<path d="M3 4h2l2.4 11h11l2-8H6.2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="20" r="1.4" fill="currentColor"/><circle cx="18" cy="20" r="1.4" fill="currentColor"/>',
    "lock": '<rect x="4" y="11" width="16" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4" fill="none" stroke="currentColor" stroke-width="2"/>',
    "check": '<path d="M5 12.5l4.5 4.5L19 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>',
    "chat": '<path d="M4 20l1.5-4A8 8 0 1 1 9 19.5z" fill="none" stroke="currentColor" stroke-width="2"/>',
    "star": '<path fill="currentColor" d="m12 2 3 6.6 7 .7-5.3 4.8 1.6 7L12 17.3 5.7 21l1.6-7L2 9.3l7-.7z"/>',
}
ic = lambda k, s=22: f'<svg viewBox="0 0 24 24" width="{s}" height="{s}" aria-hidden="true">{ICON[k]}</svg>'
IMG = "../../v2/img/"

THEMES = {
 "levels": {"name": "Levels — كل شي يودّي للشراء", "kicker": "التنفيذ شغّال الآن",
   "h1": 'خلّ مقطعك يوصل <em>للإكسبلور</em>', "sub": "اختر باقتك بضغطة، الصق الرابط، ويبدأ التنفيذ آلياً بعد الدفع.",
   "css": """
:root{--bg:#111114;--card:#1C1C21;--line:#2B2B32;--fg:#F4F4F2;--mut:#A3A3AC;--acc:#FDD407;--ink:#0D0D10;--r:18px;--rb:14px}
.fx-hero{text-align:center;padding:30px 16px 8px}
.fx-hero h1{font-size:clamp(30px,8vw,52px);line-height:1.15;margin:12px 0 10px;font-weight:900}
.fx-hero h1 em{font-style:normal;color:var(--acc)}
.fx-trust{display:flex;justify-content:center;gap:14px;flex-wrap:wrap;color:var(--mut);font-size:13px;margin:12px 0 0}
.fx-trust b{color:var(--fg)}
.fx-compare{display:grid;grid-template-columns:1fr 1.18fr 1fr;gap:8px;align-items:end;padding:22px 12px 6px}
.fx-cmp{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:12px 8px;text-align:center}
.fx-cmp.mid{border:2px solid var(--acc);padding:16px 8px;transform:translateY(-6px)}
.fx-cmp small{display:block;color:var(--mut);font-size:11px}
.fx-cmp b{display:block;font-size:15px;margin:4px 0}
.fx-cmp .p{font-size:20px;font-weight:900}
.fx-cmp.mid .p{font-size:26px;color:var(--acc)}
.fx-cmp .tag{display:inline-block;background:var(--acc);color:var(--ink);font-size:10px;font-weight:900;padding:2px 8px;border-radius:6px;margin-bottom:6px}
.fx-cmp a{display:block;margin-top:8px;background:var(--acc);color:var(--ink);border-radius:10px;padding:8px 0;font-weight:800;font-size:13px}
.fx-cmp:not(.mid) a{background:transparent;border:1.5px solid var(--line);color:var(--fg)}
.s-product-card-entry{border-radius:var(--r)!important}
.fx-sold{display:block;font-size:12px;color:var(--mut)}
.fx-home-bar{display:flex}
"""},
 "brutal": {"name": "Neobrutalism — جريء ومختلف", "kicker": "تيك توك · تنفيذ آلي",
   "h1": 'خلّ مقطعك<br><mark>ينفجر</mark> تفاعل', "sub": "مشاهدات ولايكات وشير وحفظ. بدون كلمة مرور، وبدون انتظار.",
   "css": """
:root{--bg:#141414;--card:#1D1D1D;--line:#FDD407;--fg:#FFFFFF;--mut:#C8C8C8;--acc:#FDD407;--ink:#0B0B0B;--r:6px;--rb:6px;--sh:5px 5px 0 #FDD407}
body{background-image:radial-gradient(#ffffff10 1px,transparent 1px);background-size:18px 18px}
.fx-hero{padding:26px 16px 10px}
.fx-hero h1{font-size:clamp(38px,11vw,72px);line-height:1.02;margin:14px 0 12px;font-weight:900;letter-spacing:-1px}
.fx-hero h1 mark{background:var(--acc);color:var(--ink);padding:0 10px;display:inline-block;transform:rotate(-2deg)}
.fx-hero .s-button-primary{box-shadow:4px 4px 0 #fff}
.fx-kick{border:2px solid var(--acc)!important;border-radius:0!important;color:var(--acc)!important;font-weight:900}
.s-product-card-entry,.fx-tile,.fx-step,.fx-faq details,.fx-desc .t{border:2.5px solid var(--acc)!important;box-shadow:var(--sh);border-radius:var(--r)!important}
.s-product-card-image{border-bottom:2.5px solid var(--acc)}
.s-product-options-grid-mode-span{border:2.5px solid #3a3a3a!important;border-radius:6px!important}
.s-product-options-grid-mode input:checked+div{box-shadow:4px 4px 0 #fff}
.s-button-primary{border:2.5px solid var(--ink)!important;box-shadow:4px 4px 0 #fff;border-radius:6px!important}
.fx-sec h2{display:inline-block;background:var(--acc);color:var(--ink);padding:2px 12px;transform:rotate(-1deg)}
.fx-band{background:var(--acc);color:var(--ink);font-weight:900;white-space:nowrap;overflow:hidden;padding:8px 0;border-block:2.5px solid var(--ink);font-size:15px}
.fx-band span{display:inline-block;padding-inline:14px}
"""},
 "power": {"name": "Power — فخامة داكنة", "kicker": "FLASH STORE",
   "h1": 'التفاعل اللي<br>يستاهله <em>محتواك</em>', "sub": "خدمات تيك توك بتنفيذ آلي فوري. واضحة، سريعة، وبدون كلمة مرور.",
   "css": """
:root{--bg:#070708;--card:#0F0F12;--line:#1F1F25;--fg:#F2F2EE;--mut:#8C8C96;--acc:#FDD407;--ink:#070708;--r:6px;--rb:4px}
.fx-hero{padding:46px 18px 26px}
.fx-kick{border:0!important;padding:0!important;letter-spacing:4px;font-size:11px!important;color:var(--acc)!important}
.fx-hero h1{font-size:clamp(34px,9vw,64px);line-height:1.12;margin:16px 0 14px;font-weight:300;letter-spacing:-.5px}
.fx-hero h1 em{font-style:normal;font-weight:800;border-bottom:3px solid var(--acc)}
.fx-hero p{max-width:420px}
.fx-stats{border-top:1px solid var(--line);margin-top:30px;padding-top:18px}
.fx-stats div{background:none!important;border:0!important;text-align:right!important;padding:0!important}
.fx-sec h2{font-weight:300!important;font-size:30px!important}
.fx-sec h2 b{font-weight:800}
.s-product-card-entry{border-radius:var(--r)!important;background:var(--card)!important}
.s-product-card-price-value{color:var(--acc)!important}
.s-button-primary{border-radius:4px!important;letter-spacing:.5px}
.fx-tile .gl{background:transparent!important;color:var(--acc)!important;border:1px solid var(--line)}
.fx-step::before{background:transparent!important;color:var(--acc)!important;border:1px solid var(--acc)}
"""},
}

BASE = """
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.65 system-ui,-apple-system,"Segoe UI","SF Arabic","Noto Sans Arabic",Tahoma,sans-serif;padding-bottom:84px}
a{color:inherit;text-decoration:none}img,svg{display:block;max-width:100%}img{height:auto}button,input{font:inherit;color:inherit}
.w{max-width:1100px;margin:auto}
.fx-ad{background:var(--acc);color:var(--ink);text-align:center;font-size:13px;font-weight:800;padding:6px}
.fx-hd{display:flex;align-items:center;gap:10px;padding:12px 16px;border-bottom:1px solid var(--line);position:sticky;top:0;background:var(--bg);z-index:9}
.fx-logo{display:flex;align-items:center;gap:8px;font-weight:900;font-size:19px}
.fx-logo i{width:30px;height:30px;border-radius:9px;background:var(--acc);color:var(--ink);display:grid;place-items:center}
.fx-hd .sp{flex:1}.fx-ib{width:40px;height:40px;border:1px solid var(--line);border-radius:12px;display:grid;place-items:center}
.fx-kick{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--line);border-radius:99px;padding:4px 12px;font-size:12px;color:var(--mut)}
.fx-hero p{color:var(--mut);margin:0 auto 18px;max-width:480px}
.fx-acts{display:flex;gap:8px;flex-wrap:wrap;justify-content:inherit}
.fx-hero{text-align:inherit}
.s-button-primary{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:50px;padding:0 22px;background:var(--acc);color:var(--ink);border:0;border-radius:var(--rb);font-weight:800;cursor:pointer}
.s-button-outline{display:inline-flex;align-items:center;justify-content:center;min-height:50px;padding:0 22px;border:1.5px solid var(--fg);border-radius:var(--rb);font-weight:800}
.fx-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:20px}
.fx-stats div{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:10px 6px;text-align:center}
.fx-stats b{display:block;font-size:20px;font-weight:900}.fx-stats small{color:var(--mut);font-size:12px}
.fx-sec{padding:26px 16px 6px}
.fx-sec h2{font-size:24px;font-weight:900;margin:0 0 4px}.fx-sec>p{color:var(--mut);margin:0 0 14px}
.fx-tiles{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
@media(min-width:760px){.fx-tiles{grid-template-columns:repeat(4,1fr)}}
.fx-tile{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:16px;display:flex;flex-direction:column;gap:12px}
.fx-tile .gl{width:46px;height:46px;border-radius:13px;background:var(--acc);color:var(--ink);display:grid;place-items:center}
.fx-tile b{display:block;font-size:16px}.fx-tile small{color:var(--mut);font-size:12px}.fx-tile .pr{font-size:19px;font-weight:900}
/* بطاقة منتج سلة */
.fx-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
@media(min-width:900px){.fx-grid{grid-template-columns:repeat(5,1fr)}}
.s-product-card-entry{background:var(--card);border:1px solid var(--line);overflow:hidden;display:flex;flex-direction:column}
.s-product-card-image img{width:100%;aspect-ratio:1;object-fit:cover;background:#000}
.s-product-card-content{padding:10px 10px 12px;display:flex;flex-direction:column;gap:6px;flex:1}
.s-product-card-content-title{font-weight:800;font-size:14px;line-height:1.35}
.s-product-card-rating{display:flex;align-items:center;gap:4px;font-size:12px;color:var(--mut)}.s-product-card-rating svg{color:var(--acc)}
.s-product-card-content-footer{margin-top:auto;display:flex;align-items:center;justify-content:space-between;gap:6px}
.s-product-card-price-value{font-weight:900;font-size:17px}
.s-product-card-sale-price{font-size:11px;color:var(--mut);text-decoration:line-through;display:block}
.s-product-card-entry .s-button-primary{min-height:38px;padding:0 12px;font-size:13px}
.fx-steps{display:grid;gap:10px;counter-reset:s}@media(min-width:760px){.fx-steps{grid-template-columns:repeat(3,1fr)}}
.fx-step{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:16px;display:flex;gap:12px;align-items:flex-start}
.fx-step::before{counter-increment:s;content:counter(s);flex:none;width:34px;height:34px;border-radius:10px;background:var(--acc);color:var(--ink);display:grid;place-items:center;font-weight:900}
.fx-step b{display:block}.fx-step small{color:var(--mut)}
.fx-faq{display:grid;gap:8px}.fx-faq details{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:0 14px}
.fx-faq summary{cursor:pointer;padding:13px 0;font-weight:700;list-style:none}.fx-faq summary::-webkit-details-marker{display:none}
.fx-faq p{margin:0 0 14px;color:var(--mut)}
.fx-ft{margin-top:30px;border-top:1px solid var(--line);padding:22px 16px;color:var(--mut);font-size:13px}
.fx-home-bar{display:none;position:fixed;bottom:0;inset-inline:0;background:var(--card);border-top:1px solid var(--line);padding:10px 16px;align-items:center;gap:10px;z-index:9}
.fx-home-bar div{flex:1;line-height:1.3}.fx-home-bar small{display:block;color:var(--mut);font-size:12px}
/* صفحة المنتج (بنية ملاك) */
.fx-pp{padding:14px 16px;display:grid;gap:16px}@media(min-width:900px){.fx-pp{grid-template-columns:1fr 1fr;gap:34px}}
.fx-pp .main img{width:100%;aspect-ratio:1;border-radius:var(--r)}
.fx-bc{font-size:13px;color:var(--mut)}
.fx-pp h1{font-size:28px;margin:4px 0 2px;font-weight:900}
.fx-price{font-size:34px;font-weight:900;margin:8px 0 0}.fx-price small{font-size:15px;color:var(--mut)}
.fx-price s{font-size:15px;color:var(--mut);font-weight:400;margin-inline-start:8px}
.s-product-options-option{margin-top:16px}
.s-product-options-option-label{display:block;font-weight:800;margin-bottom:8px}
.s-product-options-grid-mode{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
@media(min-width:900px){.s-product-options-grid-mode{grid-template-columns:repeat(3,minmax(0,1fr))}}
.s-product-options-grid-mode label{position:relative;display:block}
.s-product-options-grid-mode input{position:absolute;opacity:0}
.s-product-options-grid-mode-span{min-height:56px;display:flex;align-items:center;justify-content:center;border:1.5px solid var(--line);background:var(--card);border-radius:var(--rb);font-weight:800;font-size:15px;cursor:pointer;text-align:center;padding:6px}
.s-product-options-grid-mode input:checked+div{background:var(--acc);border-color:var(--acc);color:var(--ink)}
.s-form-control{width:100%;height:50px;border-radius:var(--rb);border:1.5px solid var(--line);background:var(--card);padding:0 14px;direction:ltr;text-align:left}
.fx-add{margin-top:16px;width:100%}
.fx-desc{border-top:1px solid var(--line);margin-top:20px;padding-top:16px}
.fx-desc h3{font-size:17px;margin:0 0 10px}
.fx-desc .facts{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px}
.fx-desc .t{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:12px}
.fx-desc .facts .t{text-align:center;padding:10px 4px}.fx-desc .facts b{display:block}.fx-desc .facts small{color:var(--mut);font-size:12px}
.fx-desc .contents{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:16px}
.fx-desc .contents .t div{display:flex;align-items:center;gap:8px;color:var(--mut);font-size:13px}
.fx-desc .contents .t span{width:30px;height:30px;border-radius:9px;background:var(--acc);color:var(--ink);display:grid;place-items:center}
.fx-desc .contents b{display:block;font-size:24px;font-weight:900;margin-top:6px;direction:ltr;text-align:right}
.fx-desc ul{margin:0 0 14px;padding-inline-start:20px;line-height:1.9}
.fx-desc .g{border:1.5px solid var(--acc);border-radius:var(--r);padding:12px 14px}
.fx-sticky{position:fixed;bottom:0;inset-inline:0;background:var(--card);border-top:1px solid var(--line);padding:10px 16px;display:flex;align-items:center;gap:10px;z-index:9}
.fx-sticky div{flex:1}.fx-sticky b{font-size:19px;font-weight:900}.fx-sticky small{display:block;color:var(--mut);font-size:12px}
@media(min-width:900px){.fx-sticky,.fx-home-bar{display:none!important}body{padding-bottom:0}}
"""

def head(t, theme, title):
    return (f'<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
            f'<title>{title}</title><link rel="stylesheet" href="theme.css"></head><body data-theme="{theme}">'
            f'<div class="fx-ad">خصم 10% على كل الخدمات بكود F10</div>'
            f'<header class="fx-hd"><a class="fx-logo" href="index.html"><i>{ic("bolt",18)}</i>فلاش ستور</a><span class="sp"></span><a class="fx-ib" href="#">{ic("cart",20)}</a></header>')

def card(p, compact=True):
    rating = f'<div class="s-product-card-rating">{ic("star",13)} {p["rating"][0]} ({p["rating"][1]})</div>' if p.get("rating") else ""
    price = money(p["price"]) if "price" in p else money(min(t[1] for t in p["tiers"]))
    pre = "" if "price" in p else '<small class="fx-sold">يبدأ من</small>'
    old = f'<span class="s-product-card-sale-price">{money(p["regular"])}</span>' if p.get("regular") else ""
    sold = f'<span class="fx-sold">طُلب {p["sold"]} مرة</span>' if p["sold"] else ""
    return (f'<div class="s-product-card-entry"><a class="s-product-card-image" href="p-{p["slug"]}.html"><img loading="lazy" src="{IMG}{p["slug"]}.webp" alt="{p["name"]}" width="600" height="600"></a>'
            f'<div class="s-product-card-content"><a class="s-product-card-content-title" href="p-{p["slug"]}.html">{p["name"]}</a>{rating}{sold}'
            f'<div class="s-product-card-content-footer"><div>{pre}{old}<span class="s-product-card-price-value">{price} ر.س</span></div>'
            f'<a class="s-button-primary" href="p-{p["slug"]}.html">{ic("cart",16)}</a></div></div></div>')

def facts():
    return ('<div class="facts">' + "".join(f'<div class="t"><b>{a}</b><small>{b}</small></div>' for a, b in
            [("فوري", "مدة التنفيذ"), ("أجانب", "نوع الحسابات"), ("مرة واحدة", "ضمان التعويض")]) + '</div>')

RULES = ('<h3>قبل ما تطلب</h3><ul><li>تأكد إن الحساب <b>عام</b> وليس خاصاً.</li><li>الصق <b>الرابط</b> فقط، ما نطلب كلمة المرور.</li>'
         '<li>لا تغيّر اسم المستخدم أثناء التنفيذ.</li><li>لا يمكن إلغاء الطلب بعد بدء التنفيذ.</li></ul>'
         '<div class="g"><b>ضمان ضد النقص</b><br>حسب سياسة فلاش ستور، والتعويض <b>لمرة واحدة فقط</b> بسبب كثرة التحديثات الأمنية في تيك توك.</div>')

def home(theme, T):
    hero_extra = ""
    if theme == "levels":
        trio = [packs[1], best, packs[3]]
        hero_extra = '<div class="fx-compare">' + "".join(
            f'<div class="fx-cmp{" mid" if p is best else ""}">{"<span class=tag>الأكثر طلباً</span>" if p is best else ""}<small>{p["items"][0][1]} مشاهدة</small><b>{p["name"].replace("بكج ","")}</b><div class="p">{money(p["price"])}</div><a href="p-{p["slug"]}.html">اطلب</a></div>' for p in trio) + '</div>'
    band = ""
    if theme == "brutal":
        band = '<div class="fx-band">' + "<span>⚡ تنفيذ آلي</span><span>★ 4.9 تقييم</span><span>🔒 بدون كلمة مرور</span><span>⚡ +1,400 خدمة</span>" * 2 + '</div>'
    align = "text-align:right" if theme != "levels" else ""
    acts = f'<div class="fx-acts" style="{"justify-content:center" if theme=="levels" else ""}"><a class="s-button-primary" href="#packs">اختر باقتك</a><a class="s-button-outline" href="#services">خدمة وحدة</a></div>'
    stats = f'<div class="fx-stats"><div><b>+{total//100*100:,}</b><small>خدمة منفّذة</small></div><div><b>فوري</b><small>يبدأ بعد الدفع</small></div><div><b>4.9★</b><small>تقييم العملاء</small></div></div>'
    h = head(T, theme, f"فلاش ستور · {T['name']}")
    h += f'<section class="fx-hero" style="{align}"><span class="fx-kick">{T["kicker"]}</span><h1>{T["h1"]}</h1><p>{T["sub"]}</p>{acts}{stats if theme!="levels" else ""}</section>'
    h += hero_extra
    if theme == "levels":
        h += f'<div class="fx-trust"><span><b>+{total//100*100:,}</b> خدمة منفّذة</span><span><b>4.9★</b> تقييم</span><span><b>0</b> كلمات مرور</span></div>'
    h += band
    h += ('<section class="fx-sec" id="services"><h2>اختر اللي <b>تحتاجه</b></h2><p>حدد الخدمة والكمية بالضبط.</p><div class="fx-tiles">'
          + "".join(f'<a class="fx-tile" href="p-{s["slug"]}.html"><span class="gl">{ic(s["icon"])}</span><span><b>{s["name"].replace(" تيك توك","")}</b><small>يبدأ من</small><div class="pr">{money(min(t[1] for t in s["tiers"]))} ر.س</div></span></a>' for s in singles)
          + '</div></section>')
    h += '<section class="fx-sec" id="packs"><h2>باقات <b>تيك توك</b></h2><p>مشاهدات ولايك وشير وحفظ لمقطع واحد.</p><div class="fx-grid">' + "".join(card(p) for p in packs) + '</div></section>'
    h += ('<section class="fx-sec"><h2>كيف <b>تطلب؟</b></h2><p>ثلاث خطوات.</p><div class="fx-steps">'
          '<div class="fx-step"><div><b>اختر الخدمة والكمية</b><small>باقة جاهزة أو خدمة وحدة.</small></div></div>'
          '<div class="fx-step"><div><b>الصق رابط المقطع</b><small>الرابط فقط، بدون كلمة مرور.</small></div></div>'
          '<div class="fx-step"><div><b>ادفع ويبدأ التنفيذ</b><small>آلياً مباشرة بعد الدفع.</small></div></div></div></section>')
    h += ('<section class="fx-sec"><h2>الأسئلة <b>الشائعة</b></h2><div class="fx-faq">'
          '<details><summary>متى يبدأ تنفيذ طلبي؟</summary><p>آلياً بعد الدفع مباشرة.</p></details>'
          '<details><summary>هل يوجد ضمان على النقص؟</summary><p>نعم، حسب سياسة فلاش ستور، والتعويض لمرة واحدة فقط بسبب كثرة التحديثات الأمنية في تيك توك.</p></details>'
          '<details><summary>هل تحتاجون كلمة المرور؟</summary><p>لا أبداً، الرابط فقط.</p></details></div></section>')
    h += f'<footer class="fx-ft">فلاش ستور · مدى · Apple Pay · Visa · Mastercard</footer>'
    h += f'<div class="fx-home-bar"><div><b>{best["name"]}</b><small>الأكثر طلباً · {money(best["price"])} ر.س</small></div><a class="s-button-primary" href="p-{best["slug"]}.html">اطلب الآن</a></div>'
    return h + "</body></html>"

JS = """<script>
document.querySelectorAll('.s-product-options-grid-mode input').forEach(i=>i.addEventListener('change',()=>{
 document.querySelectorAll('[data-price]').forEach(e=>e.textContent=i.dataset.p);
 document.querySelectorAll('[data-unit]').forEach(e=>e.textContent=i.dataset.q);}));
</script>"""

def product(theme, T, p):
    h = head(T, theme, f'{p["name"]} · فلاش ستور')
    is_pack = "price" in p
    if is_pack:
        price, unit = money(p["price"]), "، ".join(f"{n} {u}" for _, n, u in p["items"])
        opts = ""
        contents = '<h3>محتويات الباقة</h3><div class="contents">' + "".join(
            f'<div class="t"><div><span>{ic(i,16)}</span>{u}</div><b>{n}</b></div>' for i, n, u in p["items"]) + '</div>'
    else:
        tiers = sorted(p["tiers"]); d = next((t for t in tiers if t[0] == p.get("hot")), tiers[0])
        price, unit = money(d[1]), f'{d[0]:,} {p["unit"]}'
        # نفس نص سلة الحقيقي داخل الزر: «الكمية (السعر ر.س)»
        opts = ('<div class="s-product-options-option"><span class="s-product-options-option-label">اختر الكمية</span><div class="s-product-options-grid-mode">'
                + "".join(f'<label><input type="radio" name="q" data-p="{money(pr)}" data-q="{q:,} {p["unit"]}"{" checked" if [q,pr]==list(d) else ""}><div class="s-product-options-grid-mode-span">{q:,} ({money(pr)} ر.س)</div></label>' for q, pr in tiers)
                + '</div></div>')
        contents = f'<h3>الكميات المتاحة</h3><p>من <b>{tiers[0][0]:,}</b> إلى <b>{tiers[-1][0]:,}</b> {p["unit"]}.</p>'
    old = f'<s>{money(p["regular"])}</s>' if p.get("regular") else ""
    rating = f'<div class="s-product-card-rating">{ic("star",14)} {p["rating"][0]} من {p["rating"][1]} تقييمات</div>' if p.get("rating") else ""
    h += (f'<div class="fx-pp"><div class="main"><img src="{IMG}{p["slug"]}.webp" alt="{p["name"]}" width="600" height="600"></div><div>'
          f'<div class="fx-bc">الرئيسية / {p["name"]}</div><h1>{p["name"]}</h1>{rating}'
          f'<div class="fx-price"><span data-price>{price}</span> <small>ر.س</small>{old}</div><small style="color:var(--mut)" data-unit>{unit}</small>'
          f'{opts}<div class="s-product-options-option"><span class="s-product-options-option-label">رابط المقطع ( تذكير رابط المقطع )</span>'
          f'<input class="s-form-control" placeholder="https://www.tiktok.com/@user/video/…"></div>'
          f'<button class="s-button-primary fx-add">{ic("cart",18)} أضف للسلة</button>'
          f'<div class="fx-desc">{facts()}{contents}{RULES}</div></div></div>')
    h += f'<div class="fx-sticky"><div><b><span data-price>{price}</span> ر.س</b><small data-unit>{unit}</small></div><button class="s-button-primary">أضف للسلة</button></div>'
    return h + JS + "</body></html>"

for theme, T in THEMES.items():
    out = R / theme; out.mkdir(exist_ok=True)
    (out / "theme.css").write_text(f"/* فلاش ستور · {T['name']} — صالح كـ CSS مخصص لثيم ملاك */\n" + T["css"] + BASE, encoding="utf-8")
    (out / "index.html").write_text(home(theme, T), encoding="utf-8")
    for p in packs + singles:
        (out / f"p-{p['slug']}.html").write_text(product(theme, T, p), encoding="utf-8")
    print(theme, "ok")
(R / "index.html").write_text('<!doctype html><meta charset="utf-8"><title>فلاش ستور · 3 تصاميم</title><body style="background:#111;color:#fff;font-family:system-ui;padding:24px" dir="rtl"><h1>3 تصاميم لثيم ملاك</h1><ul style="line-height:2.2">'
    + "".join(f'<li><a style="color:#FDD407" href="{k}/index.html">{v["name"]}</a></li>' for k, v in THEMES.items()) + '</ul></body>', encoding="utf-8")
