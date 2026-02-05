# Extension Icons

**Required sizes:**
- `icon-16.png` — Toolbar icon (16×16)
- `icon-48.png` — Extensions page (48×48)
- `icon-128.png` — Chrome Web Store (128×128)

## Design

Simple moon icon or "P2" text on dark background.

**Colors:**
- Background: `#1a1a1a` (matches dark mode)
- Accent: `#56a7d7` (link blue from palette)

## Quick Generate (if you have ImageMagick)

```bash
cd ~/Developer/Projects/p2-dark-mode/icons

# Create a simple dark circle with blue accent
for size in 16 48 128; do
  convert -size ${size}x${size} xc:'#1a1a1a' \
    -fill '#56a7d7' -draw "circle $((size/2)),$((size/2)) $((size/2)),$((size/4))" \
    icon-${size}.png
done
```

## Or use an online tool

1. Go to https://favicon.io or similar
2. Create icon with "P2" text
3. Download and rename to icon-16.png, icon-48.png, icon-128.png

## Temporary workaround

The extension works without icons — Chrome will show a generic puzzle piece.
