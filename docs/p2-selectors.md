# P2 CSS Selectors Reference

Documented from live P2 site analysis (Growth Organization P2).

## Page Structure

P2 uses a WordPress.com hosted structure with these key areas:
- **Admin bar** — Top WordPress.com toolbar (dark by default)
- **P2 header** — Site navigation bar below admin bar (also dark)
- **Sidebar** — Left sidebar with site info, recent activity, team list
- **Main content** — Posts, comments, article content
- **Footer** — Minimal footer

## Selectors by Area

### Global / Body

```css
/* Main page background */
body { }
html { }

/* Content wrapper */
main { }
#content { }
.site-content { }
```

### P2 Header Bar

```css
/* Already dark, may not need changes */
.flavor-flavor-flavor { }
[class*="flavor-"] header { }
```

### Sidebar (Left)

```css
/* Sidebar container */
aside { }
[role="complementary"] { }

/* Sidebar sections */
aside h2 { }
aside h3 { }
aside h4 { }

/* Team list */
.team-list { }

/* Recent activity */
.recent-activity { }
```

### Main Content Area

```css
/* Post feed / main area */
main { }
[role="main"] { }

/* Article wrapper */
article { }

/* Post header */
article header { }

/* Post title */
article h1 { }
article h2 { }
.entry-title { }

/* Post meta (author, date) */
.entry-meta { }
article time { }
article a[href*="/author/"] { }

/* Post content */
.entry-content { }
article p { }
article ul { }
article ol { }
article li { }
```

### Links

```css
/* Standard links */
a { }
a:hover { }
a:visited { }

/* Mention links (@username) */
a[href*="/mentions/"] { }

/* P2 cross-links (+p2name) */
a[href*="wordpress.com"] { }
```

### Comments

```css
/* Comment container */
.comment { }
.comment-body { }

/* Comment meta */
.comment-author { }
.comment-date { }

/* Nested comments (replies) */
.comment .comment { }

/* Reply link */
.comment-reply-link { }
```

### Blockquotes

```css
blockquote { }
blockquote p { }

/* P2 style - left border accent */
blockquote {
  border-left: 4px solid #3858e9; /* light mode */
  background: #f0f3ff;
}
```

### Code Blocks

```css
code { }
pre { }
pre code { }

/* Inline code */
p code { }
li code { }
```

### Forms & Inputs

```css
input { }
textarea { }
button { }
select { }

/* Search */
input[type="search"] { }
.search-field { }
```

### Tooltips & Mentions

```css
/* Tooltip popups */
[role="tooltip"] { }
.tooltip { }

/* Mention highlight background */
/* When hovering @mentions, P2 shows a tooltip */
```

### Admin Bar (Top)

```css
/* WordPress.com admin bar - already dark */
#wpadminbar { }

/* May want to leave alone or slightly adjust */
```

### Borders & Dividers

```css
/* Horizontal rules */
hr { }

/* Card/section borders */
article { border-color: ... }

/* Comment separators */
.comment { border-color: ... }
```

## Elements to EXCLUDE from color changes

These should NOT have color filters applied:

```css
/* Images */
img { filter: none !important; }

/* Avatars */
.avatar { filter: none !important; }
img.avatar { filter: none !important; }

/* Embedded media */
iframe { filter: none !important; }
video { filter: none !important; }
canvas { filter: none !important; }

/* Embedded content (tweets, etc) */
.wp-embedded-content { filter: none !important; }
```

## Observed Light Mode Colors

From visual analysis:

| Element | Observed Color | CSS Property |
|---------|---------------|--------------|
| Page background | `#ffffff` | `background-color` |
| Sidebar background | `#f5f5f5` approx | `background-color` |
| Post title | `#1d1d1d` (near black) | `color` |
| Body text | `#1d1d1d` | `color` |
| Timestamps | `#646970` (gray) | `color` |
| Links | `#0073aa` (WP blue) | `color` |
| Blockquote border | `#3858e9` (blue) | `border-left-color` |
| Blockquote bg | `#f0f3ff` (light blue) | `background-color` |
| Borders | `#dcdcde` | `border-color` |

## Notes

- P2 header and admin bar are already dark-themed, may not need changes
- Focus dark mode on: body, main, sidebar, article, comments
- The main pain point is the bright white `#ffffff` background
- Comments are nested, ensure styles cascade properly
