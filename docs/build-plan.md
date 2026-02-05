# P2 Dark Mode — Build Plan

## Overview

Build a Chrome extension (Manifest V3) that applies dark mode styling to P2 WordPress sites when the user's system is set to dark mode.

## Design Principles

1. **Semantic dark mode** — Not inversion, but designed dark palette
2. **System preference** — Respect `prefers-color-scheme: dark`
3. **Surgical targeting** — Only affect text/background colors, not images
4. **P2 specific** — Only activate on P2 sites, not all of WordPress.com

## Architecture

```
p2-dark-mode/
├── manifest.json        # Manifest V3 config
├── content.js           # Content script - detects P2, injects CSS
├── styles/
│   └── dark.css         # Dark mode overrides
├── icons/
│   ├── icon-16.png
│   ├── icon-48.png
│   └── icon-128.png
└── (popup/ - v2)
```

## Color Palette

Designed for comfortable night reading with sufficient contrast:

| Token | Light | Dark | Notes |
|-------|-------|------|-------|
| `--bg-primary` | `#ffffff` | `#1a1a1a` | Main content background |
| `--bg-secondary` | `#f5f5f5` | `#242424` | Sidebar, cards |
| `--bg-tertiary` | `#e9e9e9` | `#2e2e2e` | Hover states, inputs |
| `--text-primary` | `#1d1d1d` | `#e6e6e6` | Headings, titles |
| `--text-secondary` | `#1d1d1d` | `#c9c9c9` | Body text |
| `--text-tertiary` | `#646970` | `#8c8c8c` | Timestamps, meta |
| `--link` | `#0073aa` | `#56a7d7` | Links (lifted for contrast) |
| `--link-hover` | `#005177` | `#7abce6` | Link hover |
| `--border` | `#dcdcde` | `#3a3a3a` | Dividers, borders |
| `--blockquote-border` | `#3858e9` | `#5b7aed` | Quote accent |
| `--blockquote-bg` | `#f0f3ff` | `#1e2440` | Quote background |
| `--code-bg` | `#f0f0f0` | `#2d2d2d` | Code blocks |
| `--mention-bg` | `#e9f0f5` | `#2c3e4a` | @mention highlights |

## Work Breakdown

### Task 1: Extension Scaffold
**Owner:** Subagent A

Create the core extension structure:
- `manifest.json` with Manifest V3 format
- Proper permissions (`activeTab`, host permissions for `*.wordpress.com`)
- Content script registration
- Basic `content.js` that detects P2 and injects stylesheet

**Deliverables:**
- `manifest.json`
- `content.js`
- `styles/` directory

### Task 2: P2 CSS Selectors Research
**Owner:** Subagent B

Analyze the P2 theme DOM structure via browser to identify:
- All background color selectors
- All text color selectors
- Sidebar-specific selectors
- Comment thread selectors
- Modal/dropdown selectors
- Admin bar selectors (if we want to touch it)
- Elements to EXCLUDE (images, videos, avatars)

**Deliverables:**
- `docs/p2-selectors.md` — Documented selector map

### Task 3: Dark Mode Stylesheet
**Owner:** Subagent C (depends on Task 2)

Write the dark.css stylesheet:
- Use `@media (prefers-color-scheme: dark)` wrapper
- Apply color palette to identified selectors
- Ensure images have `filter: none !important`
- Test contrast ratios meet WCAG AA

**Deliverables:**
- `styles/dark.css`

### Task 4: Icons
**Owner:** Bond (quick task)

Generate simple extension icons:
- 16x16, 48x48, 128x128 PNG
- Simple design (moon icon or P2 logo variant)

## Execution Order

```
┌─────────────────┐     ┌─────────────────┐
│  Task 1         │     │  Task 2         │
│  Extension      │     │  CSS Selectors  │
│  Scaffold       │     │  Research       │
└────────┬────────┘     └────────┬────────┘
         │                       │
         │                       │
         └───────────┬───────────┘
                     │
                     ▼
              ┌──────────────┐
              │   Task 3     │
              │  Dark CSS    │
              │  Stylesheet  │
              └──────────────┘
                     │
                     ▼
              ┌──────────────┐
              │   Task 4     │
              │   Icons      │
              └──────────────┘
                     │
                     ▼
              ┌──────────────┐
              │  Integration │
              │  & Testing   │
              └──────────────┘
```

Tasks 1 and 2 can run in parallel.
Task 3 depends on Task 2 output.
Task 4 is independent.

## Success Criteria

1. Extension loads in Chrome without errors
2. P2 sites show dark mode when system is dark
3. All text is readable (contrast ratios)
4. Images remain unchanged
5. No visual regressions in light mode (CSS is scoped to dark preference)

## Testing Plan

1. Load extension in Chrome Developer mode
2. Set macOS to dark mode
3. Visit P2 site (e.g., Automattic internal P2)
4. Verify:
   - Background is dark
   - Text is light and readable
   - Links are visible
   - Images are unchanged
   - Comments render correctly
   - Sidebar is styled
5. Toggle system to light mode → verify no changes applied
