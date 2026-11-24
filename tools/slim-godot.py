"""Prepare the web export copies with fontTools before Godot import and export."""
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont

cache = Path(__file__).resolve().parents[1] / ".local"
source_font = cache / "fonts/NotoSansCJKsc-Regular.otf"
for slug in ("valley-chapel", "sunless-belfry"):
    game = cache / "godot" / slug
    chars = set(chr(i) for i in range(32, 127))
    for path in game.rglob("*"):
        if ".godot" not in path.parts and path.suffix in (".gd", ".tscn", ".tres", ".godot"):
            chars.update(path.read_text(encoding="utf-8-sig"))
    with TTFont(source_font) as font:
        needed = {ord(c) for c in chars} & set(font.getBestCmap())
        cut = subset.Subsetter()
        cut.populate(unicodes=needed)
        cut.subset(font)
        assert needed <= set(font.getBestCmap())
        font.save(game / "art" / source_font.name)
    if slug == "sunless-belfry":
        hdr = game / "art/belfast_sunset_puresky_4k.hdr.import"
        cfg = hdr.read_text(encoding="utf-8").replace("process/size_limit=0", "process/size_limit=2048")
        hdr.write_text(cfg, encoding="utf-8")
