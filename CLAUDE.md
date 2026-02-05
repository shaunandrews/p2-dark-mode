# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chrome extension that adds dark mode support to WordPress P2 sites, respecting system `prefers-color-scheme` preference.

## Development

```bash
# Load in Chrome
# 1. Go to chrome://extensions/
# 2. Enable Developer mode
# 3. Click "Load unpacked" → select this folder

# Package for distribution
zip -r p2-dark-mode.zip . -x "*.git*" -x "logs/*" -x "docs/*" -x ".DS_Store"
```

## Architecture

**Manifest V3 Chrome Extension**

- `manifest.json` — Extension configuration, permissions, content script registration
- `content.js` — Injected into P2 pages, handles CSS injection and theme detection
- `styles/dark.css` — The dark mode stylesheet with color overrides

**Key patterns:**
- Use `@media (prefers-color-scheme: dark)` for automatic switching
- Target P2-specific selectors, not generic elements
- Preserve images with `filter: none !important`
- Match URLs: `*://*.wordpress.com/*` with P2 theme detection

**Color philosophy:**
- Not inverted — designed dark palette
- Maintain WCAG contrast ratios
- Links get lifted (brighter) for visibility on dark backgrounds
- Images, videos, iframes remain untouched

## Documentation

The `/docs/` folder contains:
- Color palette decisions
- P2 selector reference
- Testing checklist

## Scope

- **In scope**: P2 theme on WordPress.com, automatic dark mode, color overrides for text elements
- **Out of scope**: Manual toggle UI (v2), per-site settings (v2), image filters, other WP themes

## Testing

Test on these P2 patterns:
- Main post feed
- Single post view
- Comment threads (nested)
- Sidebar widgets
- Modals and dropdowns
- Admin bar (top)
- P2 header bar

Verify images are NOT affected by color changes.
