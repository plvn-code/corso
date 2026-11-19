"""Build public/images from the raw Telegram / Instagram photos.

usage: python -I scripts/build_images.py <tg_dir> <ig_dir>
  tg_dir: Telegram photos named <post>_<n>.jpg (t.me/s/emotionbrand, 800 px tall)
  ig_dir: Instagram photos named gNN.jpg (@corso.edit.club, ~1300 px wide)

Product photos -> public/images/p/<slug>/<photo>.jpg, cropped to 2:3 (card ratio) around
FOCUS (x, y in 0..1). Editorial photos -> public/images/editorial/<name>.jpg, uncropped.
"""
import json, os, sys
from PIL import Image, ImageOps

TG, IG = sys.argv[1], sys.argv[2]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "images")
RATIO = 2 / 3
FOCUS = {  # photo id -> (x, y) focus for the 2:3 crop; default (0.5, 0.35)
}
EDITORIAL = {
    "hero-burgundy": "g00", "hero-coat": "g10", "hero-shirt": "g02", "hero-navy": "g06",
    "camel-shirt": "g08", "noir-shell": "g03", "navy-skirt": "g05", "grey-coat": "g04",
    "trench-sky": "1049_0", "trench-sky-2": "1156_3", "trench-beige": "1087_3", "trench-black": "1163_3",
    "leather-milk": "1234_2", "leather-burgundy": "1144_1", "burgundy-set": "1096_2",
    "denim-horse": "1121_4", "coffee": "1135_5", "cult-ecru": "1128_1", "puffer-burgundy": "1303_2", "puffers-duo": "1286_1", "navy-cuff": "1135_2", "navy-coat-bag": "1057_0", "navy-flatlay": "1135_3", "satin": "662_1", "tencel": "750_0", "linen": "699_0", "lilac": "628_5",
}

def src(pid):
    return os.path.join(IG if pid.startswith("g") else TG, pid + ".jpg")

def crop(im, fx, fy):
    w, h = im.size
    if w / h > RATIO:  # too wide -> cut width
        nw = round(h * RATIO); x = min(max(0, round(fx * w - nw / 2)), w - nw)
        return im.crop((x, 0, x + nw, h))
    nh = round(w / RATIO); y = min(max(0, round(fy * h - nh / 2)), h - nh)
    return im.crop((0, y, w, y + nh))

def save(im, path, maxh):
    if im.height > maxh:
        im = im.resize((round(im.width * maxh / im.height), maxh), Image.LANCZOS)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    im.save(path, "JPEG", quality=86, optimize=True, progressive=True)

products = json.load(open(os.path.join(ROOT, "src", "data", "products.json")))
n = 0
for p in products:
    for c in p["colors"]:
        for pid in c["photos"]:
            im = ImageOps.exif_transpose(Image.open(src(pid))).convert("RGB")
            fx, fy = FOCUS.get(pid, (0.5, 0.35))
            save(crop(im, fx, fy), os.path.join(OUT, "p", p["slug"], pid + ".jpg"), 1500)
            n += 1
for name, pid in EDITORIAL.items():
    im = ImageOps.exif_transpose(Image.open(src(pid))).convert("RGB")
    save(im, os.path.join(OUT, "editorial", name + ".jpg"), 1800)
print(n, "product photos,", len(EDITORIAL), "editorial")
