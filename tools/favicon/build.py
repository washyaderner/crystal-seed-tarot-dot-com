"""Regenerate the site icons in app/ from the Crystal Seed crystal mark.

The mark is the crystal from the Crystal Seed signup app (crystal-seed-signup/public/icon.svg),
scaled up with a heavier rim and brighter facets so it still reads as a gem at 16 and 32 px.

    pip install cairosvg pillow
    python3 tools/favicon/build.py

Writes app/favicon.ico (16/32/48), app/icon.png (512, rounded corners) and
app/apple-icon.png (180, full bleed, no alpha; iOS applies its own corner mask).
Next.js picks these up by file convention and adds the <link> tags itself.
"""
import io
from pathlib import Path

import cairosvg
from PIL import Image

HERE = Path(__file__).resolve().parent
APP = HERE.parents[1] / "app"
ROUNDED = (HERE / "crystal-seed-icon.svg").read_bytes()
SQUARE = (HERE / "crystal-seed-icon-square.svg").read_bytes()


def render(svg: bytes, size: int) -> Image.Image:
    # Render large, then downsample: cleaner edges at tab sizes than rendering small directly.
    big = Image.open(io.BytesIO(cairosvg.svg2png(bytestring=svg, output_width=1024, output_height=1024))).convert("RGBA")
    return big.resize((size, size), Image.Resampling.LANCZOS)


def main() -> None:
    frames = [render(ROUNDED, s) for s in (16, 32, 48)]
    frames[-1].save(APP / "favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)], append_images=frames[:-1])
    render(ROUNDED, 512).save(APP / "icon.png", optimize=True)
    render(SQUARE, 180).convert("RGB").save(APP / "apple-icon.png", optimize=True)
    for name in ("favicon.ico", "icon.png", "apple-icon.png"):
        print(f"wrote app/{name} ({(APP / name).stat().st_size} bytes)")


if __name__ == "__main__":
    main()
