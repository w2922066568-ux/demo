"""Build lightweight display images, keeping the original art available on click."""
from pathlib import Path
from PIL import Image, ImageOps

site = Path(__file__).resolve().parents[1] / "site"
media = site / "media"
out = media / "previews"
out.mkdir(exist_ok=True)

def preview(source, name, width, quality=79):
    with Image.open(source) as src:
        image = ImageOps.exif_transpose(src).convert("RGB")
        image.thumbnail((width, width), Image.Resampling.LANCZOS)
        image.save(out / (name + ".webp"), quality=quality, method=6)

for file in ("atlas.jpg", "cape-meridian.webp", "abyssal.webp", "cinderline.webp",
             "forma.webp", "huazhao.webp", "chapel.jpg", "belfry.jpg", "tidebound.webp"):
    preview(media / file, Path(file).stem, 480)
for width in (720, 1440):
    preview(media / "atlas.jpg", "atlas-" + str(width), width, 83)
for source in sorted((site / "concepts").glob("*/*.png")):
    preview(source, source.stem, 680)
