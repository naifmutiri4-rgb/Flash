#!/usr/bin/env python3
"""معاينة محلية للرئيسية v5: نفس كلاسات ملاك + flash-malak.css + أقسام HTML. (للتجربة فقط)"""
import json, pathlib
R = pathlib.Path(__file__).parent
css = (R.parent / "v4" / "flash-malak.css").read_text(encoding="utf-8")
b = json.loads((R / "home-blocks.json").read_text(encoding="utf-8"))
img = "../v4/img"
cards = "".join(
    f'<div class="s-product-card-entry" style="display:block"><div class="s-product-card-image"><img src="{img}/{s}.png" alt=""></div>'
    f'<div style="padding:10px;text-align:center"><h3 class="s-product-card-content-title">{n}</h3><h4 class="s-product-card-price">{p} ر.س</h4></div></div>'
    for s, n, p in [("saver", "بكج التوفير", "9.99"), ("saver-plus", "بكج التوفير المطور", "17.99"), ("interact", "بكج التفاعل", "29.99"),
                    ("gold", "بكج الذهبي", "39.99"), ("explore", "بكج اكسبلور", "54.99")])
packs = f'''<section component-id="721318189" class="s-block s-block--angel-products"><div style="padding:0 16px">
<div class="s-block__title angel-products-title"><div class="title-wrapper flex flex-col"><div class="flex flex-col">
<h2>تفاعل أكثر لمقطعك على تيك توك</h2><p>باقات جاهزة فيها مشاهدات ولايكات وشير وحفظ لمقطع واحد. تختار، تلصق الرابط، ويبدأ التنفيذ آلياً بعد الدفع.</p>
<a href="#fx-services">أو اختر خدمة مفردة</a></div></div></div>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px">{cards}</div></div></section>'''
sec = lambda cid, h: f'<section component-id="{cid}" class="s-block s-block--bundle-html-content">{h}</section>'
html = (f'<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
        f'<style>body{{margin:0;font-family:system-ui,sans-serif;color:#fff}} *{{box-sizing:border-box}}</style><style>{css}</style>'
        f'<body id="app" class="index">{packs}{sec(1707757341, b["counter"])}{sec(1525887081, b["services"])}{sec(687110472, b["how_why"])}'
        f'<div style="height:400px"></div></body></html>')
(R / "preview.html").write_text(html, encoding="utf-8")
print("ok")
