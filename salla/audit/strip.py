"""يقص لقطة طويلة لأعمدة جنب بعض عشان تنقرأ مرة وحدة."""
import sys
from PIL import Image

for path in sys.argv[1:]:
    im = Image.open(path)
    w, h = im.size
    H = min(h, 3200)
    parts = [im.crop((0, y, w, min(y + 1600, H))) for y in range(0, H, 1600)]
    out = Image.new('RGB', (w * len(parts) + 10 * len(parts), 1600), 'white')
    for i, q in enumerate(parts):
        out.paste(q, (i * (w + 10), 0))
    out.save(path.replace('.png', '-s.png'))
    print(path, h)
