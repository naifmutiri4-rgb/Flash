#!/usr/bin/env python3
"""يخفّف صفحات المعاينة: يطلع الصور والخطوط و CSS من داخل HTML لملفات مستقلة في assets/
(تتحمّل مرة وحدة وتنحفظ في المتصفح لكل الصفحات)، ويحوّل الصور لـ WebP، ويخلي الصور البعيدة lazy.
التشغيل: python3 salla/preview/optimize.py <مجلد الصفحات> <مجلد الإخراج>"""
import base64, hashlib, io, pathlib, re, sys
from PIL import Image

src, dst = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
assets = dst / 'assets'
assets.mkdir(parents=True, exist_ok=True)
EXT = {'font/woff2': 'woff2', 'font/woff': 'woff', 'font/ttf': 'ttf', 'font/otf': 'otf', 'image/svg+xml': 'svg', 'image/gif': 'gif'}
saved = {}


def put(mime, b64):
    """يكتب ملف asset مرة وحدة حسب محتواه، ويرجع اسمه."""
    raw = base64.b64decode(b64)
    h = hashlib.sha1(raw).hexdigest()[:12]
    if h in saved:
        return saved[h]
    if mime in ('image/png', 'image/jpeg', 'image/webp'):
        im = Image.open(io.BytesIO(raw))
        im = im.convert('RGBA') if im.mode in ('P', 'LA') else im
        if max(im.size) > 800:
            im.thumbnail((800, 800))
        name = f'img-{h}.webp'
        im.save(assets / name, 'WEBP', quality=82, method=6)
    else:
        name = f'{"font" if mime.startswith("font") else "asset"}-{h}.{EXT.get(mime, "bin")}'
        (assets / name).write_bytes(raw)
    saved[h] = name
    return name


DATA = re.compile(r'data:([a-z]+/[a-z0-9.+-]+);base64,([A-Za-z0-9+/=]+)')

for page in sorted(src.glob('*.html')):
    html = page.read_text(encoding='utf-8')
    if 'claude:viewport-fit-sides' in html:          # صفحة الإطار (index/preview) تنسخ كما هي
        (dst / page.name).write_text(html, encoding='utf-8')
        continue
    # 1) CSS الكبير → ملف مشترك (نفس المحتوى = نفس الملف للكل)
    def css_out(m):
        # كل ستايل شيت في ملف مستقل حسب محتواه: المشترك بين الصفحات يتحمّل مرة وحدة وينحفظ
        links = []
        for part in m.group(1).split('/*@@sheet*/'):
            if not part.strip():
                continue
            css = DATA.sub(lambda d: put(d.group(1), d.group(2)), part)
            h = hashlib.sha1(css.encode()).hexdigest()[:12]
            name = f'css-{h}.css'
            (assets / name).write_text(css, encoding='utf-8')
            links.append(f'<link rel="stylesheet" href="assets/{name}">')
        return ''.join(links)
    html = re.sub(r'<style>(.{20000,}?)</style>', css_out, html, flags=re.S)
    # 2) صور داخل HTML → ملفات WebP
    count = [0]
    def img_out(m):
        name = put(m.group(1), m.group(2))
        return f'assets/{name}'
    html = DATA.sub(img_out, html)
    # 3) الصور بعد أول شاشة: lazy (أول 3 صور تتحمّل فوراً عشان LCP)
    def lazy(m):
        count[0] += 1
        tag = m.group(0)
        if count[0] > 3 and 'loading=' not in tag:
            tag = tag.replace('<img ', '<img loading="lazy" decoding="async" ', 1)
        return tag
    html = re.sub(r'<img [^>]*>', lazy, html)
    (dst / page.name).write_text(html, encoding='utf-8')
    print(page.name, round(len(html) / 1024), 'KB')

total = sum(f.stat().st_size for f in assets.iterdir())
print('assets:', len(list(assets.iterdir())), 'files,', round(total / 1024), 'KB')
