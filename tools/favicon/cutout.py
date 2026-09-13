"""Cut the Crystal Seed crystal out of its flat background for the header mark.

Source: public/images/brand/crystal-seed-mark.png (Russ's favicon art). The background is one flat
color (within 5 levels right up to the crystal edge), so a color key is exact here: alpha ramps with
the distance from that color, the silhouette is hole-filled so dark facets stay solid, and edge
colors are un-mixed from the background so no dark fringe shows on the header. The art itself is
not repainted.

    pip install pillow numpy scipy
    python3 tools/favicon/cutout.py

Writes public/images/brand/crystal-seed-mark-cutout.png (RGBA, cropped to the crystal plus a margin).
"""
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

REPO = Path(__file__).resolve().parents[2]
SOURCE = REPO / "public" / "images" / "brand" / "crystal-seed-mark.png"
OUT = REPO / "public" / "images" / "brand" / "crystal-seed-mark-cutout.png"

KEY_LOW, KEY_HIGH = 6.0, 34.0  # distance from the background color: fully clear below, fully solid above
MAX_HEIGHT = 480


def main() -> None:
    art = np.asarray(Image.open(SOURCE).convert("RGB")).astype(np.float32)
    bg = art[0, 0].copy()
    dist = np.abs(art - bg).max(axis=2)

    alpha = np.clip((dist - KEY_LOW) / (KEY_HIGH - KEY_LOW), 0.0, 1.0)
    solid = ndimage.binary_fill_holes(dist > 24)
    interior = ndimage.binary_erosion(solid, iterations=2)
    alpha = np.where(interior, 1.0, alpha)

    a = alpha[..., None]
    rgb = np.where(a > 0, (art - (1.0 - a) * bg) / np.maximum(a, 1e-6), 0.0)
    rgba = np.dstack([np.clip(rgb, 0, 255), alpha * 255.0]).round().astype(np.uint8)

    img = Image.fromarray(rgba, "RGBA")
    left, top, right, bottom = img.getchannel("A").point(lambda v: 255 if v > 2 else 0).getbbox()
    pad = round(0.03 * (bottom - top))
    box = (max(0, left - pad), max(0, top - pad), min(img.width, right + pad), min(img.height, bottom + pad))
    img = img.crop(box)
    if img.height > MAX_HEIGHT:  # the header shows it about 44px tall; 480px covers retina with room to spare
        img = img.resize((round(img.width * MAX_HEIGHT / img.height), MAX_HEIGHT), Image.Resampling.LANCZOS)
    img.save(OUT, optimize=True)
    print(f"wrote {OUT.relative_to(REPO)} {img.size} ({OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
