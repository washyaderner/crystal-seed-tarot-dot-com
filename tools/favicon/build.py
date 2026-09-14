"""Regenerate the site icons in app/ from the Crystal Seed favicon art.

Source: public/images/brand/crystal-seed-mark.png (Russ's 1254x1254 pink favicon art, 2026-09-14,
which replaced the red-orange 2026-09-13 crystal; original in _biz/Crystal Seed Tarot/logo/
exec-45ba43e3-c840-4a7a-8237-f3085c3c1d5f.png, a 1024 copy in Brand/Pink 2026-09-14/).
The art is only resized, never repainted.

    pip install pillow
    python3 tools/favicon/build.py

Writes app/favicon.ico (16/32/48), app/icon.png (512) and app/apple-icon.png (180, no alpha).
Next.js picks these up by file convention and adds the <link> tags itself.
"""
from pathlib import Path

from PIL import Image

REPO = Path(__file__).resolve().parents[2]
APP = REPO / "app"
SOURCE = REPO / "public" / "images" / "brand" / "crystal-seed-mark.png"


def main() -> None:
    art = Image.open(SOURCE).convert("RGB")
    frames = [art.resize((s, s), Image.Resampling.LANCZOS) for s in (16, 32, 48)]
    frames[-1].save(APP / "favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)], append_images=frames[:-1])
    art.resize((512, 512), Image.Resampling.LANCZOS).save(APP / "icon.png", optimize=True)
    art.resize((180, 180), Image.Resampling.LANCZOS).save(APP / "apple-icon.png", optimize=True)
    for name in ("favicon.ico", "icon.png", "apple-icon.png"):
        print(f"wrote app/{name} ({(APP / name).stat().st_size} bytes)")


if __name__ == "__main__":
    main()
