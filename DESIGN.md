# DESIGN.md — Dark Glass & Light Mode Design Tokens

Design system extracted from the NeuroBank dashboard UI.  
Works with **any** React + CSS admin dashboard. No components, no framework lock-in.

---

## 1. Fonts

Add this as the **first line** of your CSS file.

```css
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
```

| Role | Font | Use for |
|---|---|---|
| Display | `'Sora', sans-serif` | Page titles, card headings, hero numbers |
| Body | `'DM Sans', sans-serif` | Labels, nav items, paragraphs, buttons |
| Mono | `'JetBrains Mono', monospace` | Prices, percentages, IDs, stats |

---

## 2. CSS Variables — Dark Mode (default)

```css
:root {
  /* ── Backgrounds ─────────────────────────── */
  --bg-page:        #080c14;
  --bg-surface:     #0d1117;
  --bg-card:        #111827;
  --bg-card-hover:  #161f2e;
  --bg-sidebar:     #0a0f1a;
  --bg-input:       #1a2235;

  /* ── Borders ─────────────────────────────── */
  --border-subtle:  rgba(255, 255, 255, 0.06);
  --border-medium:  rgba(255, 255, 255, 0.10);
  --border-strong:  rgba(255, 255, 255, 0.18);

  /* ── Text ────────────────────────────────── */
  --text-primary:   #f0f4ff;
  --text-secondary: #8b9cbf;
  --text-muted:     #4a5568;
  --text-on-accent: #ffffff;

  /* ── Accent — Cyan (CTA, links, active) ─── */
  --accent:         #38bdf8;
  --accent-dim:     rgba(56, 189, 248, 0.12);
  --accent-border:  rgba(56, 189, 248, 0.25);
  --accent-glow:    rgba(56, 189, 248, 0.35);

  /* ── Accent — Purple (AI, premium, tags) ── */
  --accent-alt:         #a78bfa;
  --accent-alt-dim:     rgba(167, 139, 250, 0.12);
  --accent-alt-border:  rgba(167, 139, 250, 0.25);

  /* ── Semantic colours ────────────────────── */
  --color-success:      #34d399;
  --color-success-dim:  rgba(52, 211, 153, 0.12);
  --color-danger:       #f87171;
  --color-danger-dim:   rgba(248, 113, 113, 0.12);
  --color-warning:      #fbbf24;
  --color-warning-dim:  rgba(251, 191, 36, 0.12);
  --color-info:         #38bdf8;
  --color-info-dim:     rgba(56, 189, 248, 0.12);

  /* ── Gradients ───────────────────────────── */
  /* Page background — two soft radial blobs over dark base */
  --gradient-page:
    radial-gradient(ellipse 80% 50% at 50% -10%, rgba(56, 189, 248, 0.08) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 85% 85%,  rgba(167, 139, 250, 0.06) 0%, transparent 55%),
    var(--bg-page);

  /* Card inner top-left shine */
  --gradient-card-shine:
    linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 55%);

  /* Primary CTA button */
  --gradient-cta:
    linear-gradient(135deg, #38bdf8 0%, #6366f1 100%);

  /* Chart fill areas — use as SVG linearGradient stops */
  --chart-fill-primary:   rgba(56, 189, 248, 0.40);   /* top stop  */
  --chart-fill-fade:      rgba(56, 189, 248, 0.00);   /* bottom stop */
  --chart-fill-success:   rgba(52, 211, 153, 0.40);
  --chart-fill-danger:    rgba(248, 113, 113, 0.40);

  /* ── Shadows ─────────────────────────────── */
  --shadow-sm:     0 1px 3px rgba(0,0,0,0.40), 0 2px 8px rgba(0,0,0,0.25);
  --shadow-md:     0 2px 8px rgba(0,0,0,0.50), 0 8px 24px rgba(0,0,0,0.35);
  --shadow-lg:     0 4px 16px rgba(0,0,0,0.55), 0 16px 48px rgba(0,0,0,0.40);
  --shadow-accent: 0 4px 20px rgba(56, 189, 248, 0.30);
  --shadow-inset:  inset 0 1px 0 rgba(255,255,255,0.06);

  /* ── Border radius ───────────────────────── */
  --radius-xs:   6px;
  --radius-sm:   8px;
  --radius-md:   12px;
  --radius-lg:   16px;
  --radius-xl:   20px;
  --radius-full: 9999px;

  /* ── Spacing — 8pt grid ──────────────────── */
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* ── Typography ──────────────────────────── */
  --font-display: 'Sora', sans-serif;
  --font-body:    'DM Sans', sans-serif;
  --font-mono:    'JetBrains Mono', monospace;

  --text-xs:   11px;
  --text-sm:   13px;
  --text-base: 15px;
  --text-md:   17px;
  --text-lg:   20px;
  --text-xl:   24px;
  --text-2xl:  30px;
  --text-3xl:  38px;

  --weight-regular:  400;
  --weight-medium:   500;
  --weight-semibold: 600;
  --weight-bold:     700;

  --leading-tight:  1.2;
  --leading-normal: 1.5;
  --leading-loose:  1.75;

  /* ── Transitions ─────────────────────────── */
  --ease:        cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --duration-fast:   150ms;
  --duration-base:   250ms;
  --duration-slow:   400ms;
}
```

---

## 3. CSS Variables — Light Mode

Apply by toggling `data-theme="light"` on `<html>` or `<body>`.

```css
[data-theme="light"] {
  /* ── Backgrounds ─────────────────────────── */
  --bg-page:        #f0f4f8;
  --bg-surface:     #f8fafc;
  --bg-card:        #ffffff;
  --bg-card-hover:  #f4f7fb;
  --bg-sidebar:     #ffffff;
  --bg-input:       #eef2f7;

  /* ── Borders ─────────────────────────────── */
  --border-subtle:  rgba(0, 0, 0, 0.06);
  --border-medium:  rgba(0, 0, 0, 0.10);
  --border-strong:  rgba(0, 0, 0, 0.18);

  /* ── Text ────────────────────────────────── */
  --text-primary:   #0f172a;
  --text-secondary: #64748b;
  --text-muted:     #94a3b8;
  --text-on-accent: #ffffff;

  /* ── Accent — same hue, slightly richer ──── */
  --accent:         #0284c7;
  --accent-dim:     rgba(2, 132, 199, 0.08);
  --accent-border:  rgba(2, 132, 199, 0.20);
  --accent-glow:    rgba(2, 132, 199, 0.20);

  --accent-alt:        #7c3aed;
  --accent-alt-dim:    rgba(124, 58, 237, 0.08);
  --accent-alt-border: rgba(124, 58, 237, 0.20);

  /* ── Semantic colours ────────────────────── */
  --color-success:      #059669;
  --color-success-dim:  rgba(5, 150, 105, 0.08);
  --color-danger:       #dc2626;
  --color-danger-dim:   rgba(220, 38, 38, 0.08);
  --color-warning:      #d97706;
  --color-warning-dim:  rgba(217, 119, 6, 0.08);
  --color-info:         #0284c7;
  --color-info-dim:     rgba(2, 132, 199, 0.08);

  /* ── Gradients ───────────────────────────── */
  --gradient-page:
    radial-gradient(ellipse 70% 40% at 50% -5%, rgba(2, 132, 199, 0.06) 0%, transparent 55%),
    radial-gradient(ellipse 50% 30% at 90% 90%, rgba(124, 58, 237, 0.04) 0%, transparent 50%),
    var(--bg-page);

  --gradient-card-shine:
    linear-gradient(135deg, rgba(255,255,255,0.80) 0%, transparent 60%);

  --gradient-cta:
    linear-gradient(135deg, #0284c7 0%, #6366f1 100%);

  --chart-fill-primary: rgba(2, 132, 199, 0.30);
  --chart-fill-fade:    rgba(2, 132, 199, 0.00);
  --chart-fill-success: rgba(5, 150, 105, 0.30);
  --chart-fill-danger:  rgba(220, 38, 38, 0.30);

  /* ── Shadows ─────────────────────────────── */
  --shadow-sm:     0 1px 3px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.05);
  --shadow-md:     0 2px 8px rgba(0,0,0,0.10), 0 8px 24px rgba(0,0,0,0.07);
  --shadow-lg:     0 4px 16px rgba(0,0,0,0.12), 0 16px 48px rgba(0,0,0,0.08);
  --shadow-accent: 0 4px 20px rgba(2, 132, 199, 0.20);
  --shadow-inset:  inset 0 1px 0 rgba(255,255,255,0.80);

  /* Radius, spacing, fonts, transitions — unchanged from dark mode */
}
```

---

## 4. Global Base Styles

```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
}

body {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: var(--weight-regular);
  color: var(--text-primary);
  background: var(--gradient-page);
  background-attachment: fixed;
  line-height: var(--leading-normal);
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
}

/* Optional: subtle dot/grid texture on the page background */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(var(--border-subtle) 1px, transparent 1px),
    linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
  z-index: 0;
}

#root {
  position: relative;
  z-index: 1;
}
```

---

## 5. Typography Scale

```css
/* Headings */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
  font-weight: var(--weight-semibold);
  color: var(--text-primary);
  line-height: var(--leading-tight);
}

h1 { font-size: var(--text-3xl); }
h2 { font-size: var(--text-2xl); }
h3 { font-size: var(--text-xl);  }
h4 { font-size: var(--text-lg);  }
h5 { font-size: var(--text-md);  }
h6 { font-size: var(--text-base); }

/* Body text */
p {
  font-size: var(--text-base);
  color: var(--text-secondary);
  line-height: var(--leading-normal);
}

/* Labels & captions */
label, .label {
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--text-secondary);
}

.caption {
  font-size: var(--text-xs);
  color: var(--text-muted);
  letter-spacing: 0.04em;
}

/* Section title above a card or table */
.section-title {
  font-family: var(--font-display);
  font-size: var(--text-md);
  font-weight: var(--weight-semibold);
  color: var(--text-primary);
}

/* Big stat / KPI number */
.stat-number {
  font-family: var(--font-mono);
  font-size: var(--text-3xl);
  font-weight: var(--weight-bold);
  color: var(--text-primary);
  letter-spacing: -0.5px;
  line-height: 1;
}

/* Table header cells */
.th {
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
```

---

## 6. Spacing Reference

All spacing is on an **8pt grid**. Use multiples of `--space-*` tokens for all padding, margin, and gap values.

```
--space-1  →  4px    (tight: icon gaps, badge padding)
--space-2  →  8px    (small: inline gaps, tag padding)
--space-3  →  12px   (compact: nav item padding, row gaps)
--space-4  →  16px   (base: card inner padding top/bottom)
--space-5  →  20px   (medium: between list items)
--space-6  →  24px   (standard: card padding, section gaps)
--space-8  →  32px   (large: between cards in a grid)
--space-10 →  40px   (xlarge: page section separation)
--space-12 →  48px   (page top padding)
```

---

## 7. Card Styles

Every panel, widget, and table wrapper uses these rules.

```css
.card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;
  transition:
    border-color var(--duration-base) var(--ease),
    box-shadow   var(--duration-base) var(--ease);
}

/* Subtle inner shine — remove if you prefer flat cards */
.card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--gradient-card-shine);
  pointer-events: none;
  border-radius: inherit;
}

.card:hover {
  border-color: var(--border-medium);
  box-shadow: var(--shadow-md);
}

/* Compact card variant (e.g. stat tiles) */
.card-sm {
  padding: var(--space-4) var(--space-5);
  border-radius: var(--radius-lg);
}
```

---

## 8. Border Radius Usage Guide

```
--radius-xs   6px   →  badges, tags, small chips
--radius-sm   8px   →  buttons, inputs, table rows on hover
--radius-md   12px  →  dropdowns, tooltips, nav items
--radius-lg   16px  →  small cards, compact panels
--radius-xl   20px  →  main dashboard cards, modals
--radius-full 9999px→  pills, avatars, toggle switches
```

---

## 9. Buttons

```css
/* Primary */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-5);
  background: var(--gradient-cta);
  color: var(--text-on-accent);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition:
    opacity    var(--duration-fast) var(--ease),
    transform  var(--duration-fast) var(--ease-spring),
    box-shadow var(--duration-base) var(--ease);
}
.btn-primary:hover {
  opacity: 0.88;
  transform: translateY(-1px);
  box-shadow: var(--shadow-accent);
}
.btn-primary:active { transform: translateY(0); }

/* Secondary / Ghost */
.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background: transparent;
  color: var(--text-secondary);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease);
}
.btn-ghost:hover {
  color: var(--text-primary);
  border-color: var(--accent-border);
  background: var(--accent-dim);
}

/* Icon-only button */
.btn-icon {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-input);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease);
}
.btn-icon:hover {
  color: var(--text-primary);
  border-color: var(--border-medium);
}
```

---

## 10. Inputs & Form Controls

```css
.input {
  width: 100%;
  padding: var(--space-2) var(--space-4);
  background: var(--bg-input);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
  outline: none;
  transition: border-color var(--duration-fast) var(--ease),
              box-shadow   var(--duration-fast) var(--ease);
}
.input::placeholder { color: var(--text-muted); }
.input:focus {
  border-color: var(--accent-border);
  box-shadow: 0 0 0 3px var(--accent-dim);
}

select.input { cursor: pointer; }
```

---

## 11. Badges & Status Chips

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 2px var(--space-2);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  font-family: var(--font-mono);
  white-space: nowrap;
}

.badge-success { background: var(--color-success-dim); color: var(--color-success); }
.badge-danger  { background: var(--color-danger-dim);  color: var(--color-danger);  }
.badge-warning { background: var(--color-warning-dim); color: var(--color-warning); }
.badge-info    { background: var(--color-info-dim);    color: var(--color-info);    }
.badge-neutral { background: var(--border-subtle);     color: var(--text-secondary);}
.badge-accent  { background: var(--accent-dim);        color: var(--accent);        }
```

---

## 12. Tables

```css
.table-wrapper {
  width: 100%;
  overflow-x: auto;
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-subtle);
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-sm);
}

thead tr {
  border-bottom: 1px solid var(--border-subtle);
}

thead th {
  padding: var(--space-3) var(--space-5);
  text-align: left;
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  white-space: nowrap;
}

tbody tr {
  border-bottom: 1px solid var(--border-subtle);
  transition: background var(--duration-fast) var(--ease);
}

tbody tr:last-child { border-bottom: none; }

tbody tr:hover { background: var(--bg-card-hover); }

tbody td {
  padding: var(--space-4) var(--space-5);
  color: var(--text-primary);
  vertical-align: middle;
}

td.muted  { color: var(--text-secondary); }
td.mono   { font-family: var(--font-mono); }
```

---

## 13. Sidebar Nav

```css
.sidebar {
  width: 240px;
  min-height: 100vh;
  background: var(--bg-sidebar);
  border-right: 1px solid var(--border-subtle);
  padding: var(--space-6) var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--text-secondary);
  cursor: pointer;
  text-decoration: none;
  border: 1px solid transparent;
  transition: all var(--duration-fast) var(--ease);
}

.nav-item:hover {
  color: var(--text-primary);
  background: var(--bg-card);
  border-color: var(--border-subtle);
}

.nav-item.active {
  color: var(--text-primary);
  background: var(--bg-card);
  border-color: var(--border-medium);
}

/* Active item icon tinted with accent */
.nav-item.active svg { color: var(--accent); }
```

---

## 14. Dividers

```css
.divider {
  width: 100%;
  height: 1px;
  background: var(--border-subtle);
  margin: var(--space-4) 0;
}

.divider-vertical {
  width: 1px;
  height: 100%;
  background: var(--border-subtle);
  margin: 0 var(--space-4);
}
```

---

## 15. Theme Toggle (React)

Add `data-theme` to `<html>` and toggle it with a button.

```jsx
// In your App.jsx or a ThemeToggle component
const [dark, setDark] = React.useState(true);

React.useEffect(() => {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
}, [dark]);

// Button
<button onClick={() => setDark(d => !d)} className="btn-icon" aria-label="Toggle theme">
  {dark ? <SunIcon /> : <MoonIcon />}
</button>
```

> **Note:** The `:root` block defines dark mode by default.  
> The `[data-theme="light"]` block overrides only the values that change.  
> Everything else — spacing, radius, fonts, transitions — stays the same in both modes.

---

## 16. Micro-animations

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes shimmer {
  from { background-position: -200% center; }
  to   { background-position:  200% center; }
}

/* Apply to any card or section on mount */
.animate-in {
  animation: fadeIn var(--duration-slow) var(--ease) both;
}
.animate-in-1 { animation-delay: 60ms; }
.animate-in-2 { animation-delay: 120ms; }
.animate-in-3 { animation-delay: 180ms; }
.animate-in-4 { animation-delay: 240ms; }

/* Loading skeleton */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-card) 25%,
    var(--bg-card-hover) 50%,
    var(--bg-card) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite;
  border-radius: var(--radius-md);
}
```

---

## 17. Scrollbar

```css
* {
  scrollbar-width: thin;
  scrollbar-color: var(--border-medium) transparent;
}
::-webkit-scrollbar       { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background: var(--border-medium);
  border-radius: var(--radius-full);
}
```

---

*One CSS file. Two themes. Every token named so you always know what you're changing.*