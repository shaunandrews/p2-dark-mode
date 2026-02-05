# P2 Dark Mode

A Chrome extension that adds dark mode support to WordPress P2 sites, activated automatically when your system is set to dark mode.

## Overview

The P2 theme doesn't have built-in light/dark mode support. This extension detects the system preference for dark mode and applies a carefully designed dark color palette — not a crude inversion, but actual thoughtful dark mode design tokens.

**Key features:**
- Respects `prefers-color-scheme: dark` system setting
- Designed color palette (not inverted colors)
- Images remain untouched
- Only activates on P2 sites

## Quick Start

### Development

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked" and select this project folder
4. Visit any P2 site (e.g., `*.wordpress.com` with P2 theme)

### Building for Distribution

```bash
cd ~/Developer/Projects/p2-dark-mode
zip -r p2-dark-mode.zip . -x "*.git*" -x "logs/*" -x "docs/*" -x ".DS_Store"
```

## Color Palette

| Element | Light | Dark |
|---------|-------|------|
| Background | `#ffffff` | `#1a1a1a` |
| Sidebar | `#f5f5f5` | `#242424` |
| Post title | `#1d1d1d` | `#e6e6e6` |
| Body text | `#1d1d1d` | `#c9c9c9` |
| Secondary text | `#646970` | `#8c8c8c` |
| Links | `#0073aa` | `#56a7d7` |
| Borders | `#dcdcde` | `#3a3a3a` |

## Documentation

| Doc | Description |
|-----|-------------|
| [docs/](docs/) | Project documentation |

## Structure

```
p2-dark-mode/
├── manifest.json     # Extension manifest (v3)
├── content.js        # Content script (injects CSS)
├── styles/
│   └── dark.css      # Dark mode stylesheet
├── popup/            # Extension popup UI (optional)
│   ├── popup.html
│   └── popup.js
├── icons/            # Extension icons
├── docs/             # Documentation
├── logs/             # Development logs (git-ignored)
└── README.md         # This file
```

## Browser Support

- Chrome (Manifest V3)
- Edge (Chromium-based)
- Other Chromium browsers

## Related

- [P2 Theme](https://wordpress.com/theme/developer-starter) — The theme this extension enhances
- [Automattic](https://automattic.com) — Company that uses P2 extensively
