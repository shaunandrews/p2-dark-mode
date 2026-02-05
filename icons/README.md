# Extension Icons

This directory needs the following icon files:

- `icon-16.png` — 16×16 pixels (toolbar, favicon)
- `icon-48.png` — 48×48 pixels (extensions page)
- `icon-128.png` — 128×128 pixels (Chrome Web Store, install dialog)

## Design Guidelines

- Simple, recognizable at small sizes
- Suggested concepts:
  - Moon icon (classic dark mode symbol)
  - P2 logo variant with dark treatment
  - Half-circle light/dark split
- Use flat design, avoid gradients at 16px
- Transparent background works well

## Generating Icons

If using an SVG source:

```bash
# Example with ImageMagick
convert icon.svg -resize 16x16 icon-16.png
convert icon.svg -resize 48x48 icon-48.png
convert icon.svg -resize 128x128 icon-128.png
```

Or use a tool like https://realfavicongenerator.net/
