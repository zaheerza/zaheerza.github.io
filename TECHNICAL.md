# INSIGHTMENT — Technical Reference

## Stack

| Layer | Approach |
|---|---|
| HTML | Hand-authored static files, no templating engine |
| CSS | Vanilla CSS with custom properties, inlined per file |
| JavaScript | Vanilla JS, inlined per file, no build step |
| Fonts | Inter via Google Fonts CDN |
| Hosting | GitHub Pages (Linux, case-sensitive paths) |

No frameworks, preprocessors, bundlers, or package managers are used.

---

## Directory Structure

```
/
├── index.html              # Home page (post list + sidebar)
├── explore.html            # Interactive knowledge graph
├── posts/
│   └── *.html              # 27 individual post pages
└── TECHNICAL.md
```

---

## CSS Architecture

### Custom Properties

All colours and base values are defined in `:root` at the top of each file's `<style>` block:

```css
:root {
  --ink:        #111827;   /* body text */
  --muted:      #6b7280;   /* secondary text, meta */
  --border:     #e5e7eb;   /* dividers, card borders */
  --accent:     #0f62fe;   /* links, category labels, active states */
  --accent-bg:  #eff6ff;   /* light tinted backgrounds */
  --bg:         #ffffff;   /* page background */
  --surface:    #f9fafb;   /* card / widget background */
  --radius:     8px;       /* border-radius used throughout */
  --font:       'Inter', system-ui, -apple-system, sans-serif;
}
```

All component styles reference these tokens. Changing a token value updates the entire page.

### Dark Mode

Dark mode is implemented via a `data-theme="dark"` attribute on `<html>`:

```css
html[data-theme="dark"] {
  --ink: #e2e8f0; --muted: #94a3b8; --border: #1e293b;
  --accent: #60a5fa; --accent-bg: #1e3a5f;
  --bg: #0f172a; --surface: #1e293b;
}
```

Three additional overrides handle hardcoded colours that do not use custom properties:

```css
html[data-theme="dark"] .site-header        { background: rgba(15,23,42,.92); }
html[data-theme="dark"] footer              { background: #020617; }
html[data-theme="dark"] .widget[style*="background:#eff6ff"] { ... !important }
```

Preference is stored in `localStorage` under the key `theme` (`"light"` or `"dark"`).
An inline `<script>` in `<head>` reads this value and sets `data-theme` before first paint to prevent flash-of-unstyled-content:

```html
<script>(function(){
  var t = localStorage.getItem('theme') ||
          (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  if (t === 'dark') document.documentElement.setAttribute('data-theme','dark');
})();</script>
```

### CSS Duplication

There is no shared stylesheet. The full CSS block (~100 lines of common styles) is duplicated verbatim in every HTML file. This is the primary maintenance burden: **any structural style change must be applied to all 29 files**.

`index.html` and post files share the same common block. Post files additionally contain post-specific rules (`.post-header`, `.article-body`, `.post-cat`, etc.).

When making CSS changes, use a sed/Python bulk-replace across the files rather than editing each manually.

### Responsive Breakpoints

| Breakpoint | Behaviour |
|---|---|
| `≤ 900px` | Nav links and search input hidden; hamburger shown; page layout collapses to single column |
| `≤ 600px` | Footer grid collapses to single column |

The mobile nav uses an `.open` class toggled by the hamburger button:

```css
@media (max-width: 900px) {
  .nav-links.open {
    display: flex; flex-direction: column;
    position: fixed; top: 60px; left: 0; right: 0;
    background: var(--bg); z-index: 200;
  }
}
```

---

## JavaScript

All JS is inline, wrapped in IIFEs `(function(){ ... })();` to avoid polluting global scope.

### index.html Scripts

**Dark mode toggle** (shared across all pages):
```javascript
var btn = document.getElementById('dark-toggle');
btn.addEventListener('click', function() {
  var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});
```

**Hamburger menu** (shared across all pages):
```javascript
var hb = document.querySelector('.nav-hamburger');
var nl = document.querySelector('.nav-links');
hb.addEventListener('click', function(e) { e.stopPropagation(); nl.classList.toggle('open'); });
document.addEventListener('click', function() { nl.classList.remove('open'); });
```

**Category filter** (`index.html` only):

Reads `?cat=` from the URL query string, hides non-matching `.post-row` elements, shows an empty-state message if no posts match, and highlights the active category link in the sidebar:

```javascript
var cat = new URLSearchParams(window.location.search).get('cat');
if (cat) {
  // hide featured grid, rename section label
  document.querySelectorAll('.post-row').forEach(function(row) {
    var cats = (row.dataset.cats || '').replace(/&amp;/g, '&').split('|');
    if (cats.indexOf(cat) === -1) row.style.display = 'none';
  });
  // empty state if no matches
  // highlight active sidebar link
}
```

Category data is stored on each `.post-row` as a `data-cats` attribute containing pipe-separated category names sourced from the post's own category list:

```html
<div class="post-row" data-cats="Reports &amp; Dashboards|Sales Analytics|Salesforce|Salesforce-How To">
```

This allows multi-category posts to appear under every applicable sidebar filter.

### Post File Scripts

Post files contain only the dark mode and hamburger IIFEs — no filter logic.

### explore.html

A standalone canvas-based knowledge graph. Data is defined at the top of the script as two arrays:

```javascript
const NODES = [
  { id: 'home',    label: 'INSIGHTMENT', type: 'hub', url: './index.html' },
  { id: 'ai',      label: 'AI & Tech',   type: 'cat' },
  { id: 'p-ui',    label: 'Liberating the UI...', type: 'post', url: './posts/liberating-the-ui-from-the-database.html' },
  // ...
];
const EDGES = [
  ['home', 'ai'], ['ai', 'p-ui'], // ...
];
```

Node types and their visual treatment:

| type | Appearance | Clickable navigation |
|---|---|---|
| `hub` | Large filled circle | Double-click navigates to `url` |
| `cat` | Medium circle | Double-click navigates to `url` |
| `sub` | Small circle | Double-click navigates to `url` |
| `post` | Small circle, accent stroke | Double-click navigates to `url` |

Physics: nodes repel each other (inverse-square), edges act as springs pulling connected nodes together, velocity is damped each tick. The simulation runs on `requestAnimationFrame`.

---

## HTML Patterns

### Navigation

Shared across all pages. Dropdown menus are pure CSS (`:hover` trigger):

```html
<nav class="nav-inner">
  <a class="logo" href="./index.html">INSIGHT<span>MENT</span></a>
  <ul class="nav-links">
    <li class="dropdown">
      <a href="#">Salesforce ▾</a>
      <ul class="dropdown-menu">
        <li><a href="../index.html?cat=Salesforce-How+To">How-To Guides</a></li>
        <!-- ... -->
      </ul>
    </li>
  </ul>
  <div class="nav-search"><input type="search" placeholder="Search posts…" /></div>
  <button class="dark-toggle" id="dark-toggle" aria-label="Toggle dark mode"><!-- SVGs --></button>
  <div class="nav-hamburger">&#9776;</div>
</nav>
```

Note: `href="."` on dropdown parent links causes scroll-to-top on click. The search input has no JS handler and is currently decorative only.

### Post List (`index.html`)

Each post in the list is a `.post-row` div. The `data-cats` attribute drives the category filter:

```html
<div class="post-row" data-cats="AI|Technology">
  <div class="card-cat"><svg>...</svg>AI</div>
  <div class="card-title"><a href="posts/big-data-and-artificial-intelligence.html">Big Data and AI</a></div>
  <div class="card-meta"><span>Jan 10 2021</span>...</div>
</div>
```

The `.card-cat` display label shows only the primary category (first in WordPress order). The `data-cats` attribute lists all categories so filtering works for any of them.

### Post Pages

Key structural elements:

```html
<div class="post-header">
  <div class="post-cats">
    <span class="post-cat"><svg>...</svg>Salesforce-How To</span>
    <span class="post-cat">Reports &amp; Dashboards</span>
  </div>
  <h1>Post Title</h1>
  <div class="post-meta"><span>Date</span> · <span>X min read</span></div>
</div>
<div class="layout-body">
  <article class="article-body"><!-- post content --></article>
  <aside class="sidebar">
    <div class="widget"><!-- Related posts --></div>
    <div class="widget"><!-- Categories --></div>
    <div class="widget"><!-- About Insightment --></div>
  </aside>
</div>
```

The `.post-cat` spans are the authoritative source for a post's categories. The `data-cats` values on `index.html` post-rows are derived from these spans.

### Sidebar Category Links

- In `index.html`: `href="index.html?cat=Category+Name"`
- In post files: `href="../index.html?cat=Category+Name"`

Special characters in category names must be URL-encoded: `Reports+%26+Dashboards` for "Reports & Dashboards".

---

## Category System

### Current Categories and Post Counts

| Category | Count |
|---|---|
| Blog | 13 |
| Salesforce-How To | 5 |
| AI | 4 |
| CRM | 3 |
| General | 3 |
| Technology | 3 |
| Reports & Dashboards | 2 |
| Sales Analytics | 2 |
| Product Ownership | 2 |
| Strategy | 2 |
| Change Management | 1 |
| Implementation | 1 |
| Report Formulas | 1 |
| Salesforce | 1 |
| Vendors | 1 |

### Adding a New Category

1. Add `<span class="post-cat">New Category</span>` to the relevant post files
2. Add the new category to the `data-cats` attribute on the corresponding post-row in `index.html`
3. Add a sidebar `<li>` with the correct count to `index.html` and all 27 post files (bulk-replace is the practical approach)
4. Add a link to the tag cloud in `index.html`

---

## Adding a New Post

1. Copy an existing post file as a template
2. Update: `<title>`, `<h1>`, `.post-cats` spans, `.post-meta` date/read-time, `.article-body` content, `.widget` related posts list
3. Add a `.post-row` entry to `index.html` with the correct `data-cats` attribute
4. If the post introduces a new category, follow the category update steps above
5. Update sidebar category counts in `index.html` and all post files if counts change

---

## Known Technical Debt

| ID | Area | Issue |
|---|---|---|
| m6 | CSS | ~100 lines of CSS duplicated across all 29 files — no shared stylesheet |
| M2 | Search | Nav search input has no JS handler — currently decorative |
| M3 | Nav | Dropdown `<a href="#">` parent links scroll to top on click |
| m3 | explore.html | No keyboard navigation or ARIA roles on the canvas graph |
| M4 | Images | External WordPress CDN images in `identifying-sales-pipeline-leakages.html` |
| m11 | SEO | No `<meta name="description">` or Open Graph tags on any page |
| m9 | Repo | `insightment.WordPress.2026-04-28.xml` export file is publicly served at the repo root |
