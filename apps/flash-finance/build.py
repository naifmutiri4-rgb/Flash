"""Builds index.html from the three parts in src/ (styles, page markup, script)."""
from pathlib import Path
here = Path(__file__).parent
parts = [here / "src" / n for n in ("app.css", "body.html", "app.js")]
(here / "index.html").write_text("".join(p.read_text(encoding="utf-8") for p in parts), encoding="utf-8")
print("built index.html")
