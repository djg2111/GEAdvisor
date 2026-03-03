# Code Citations

## License: unknown
https://github.com/dubrowgn/impulse.js/blob/dbd17406ca68a537b93ca9eae310591ab5937b5f/src/net/sanitizer.ts

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "
```


## License: unknown
https://github.com/Vic-IDE/vic-ide/blob/a194439f06a57e55ce04b738327447b647f53a20/src-ext/PanelHtml.ts

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "
```


## License: unknown
https://github.com/dubrowgn/impulse.js/blob/dbd17406ca68a537b93ca9eae310591ab5937b5f/src/net/sanitizer.ts

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "
```


## License: unknown
https://github.com/Vic-IDE/vic-ide/blob/a194439f06a57e55ce04b738327447b647f53a20/src-ext/PanelHtml.ts

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "
```


## License: unknown
https://github.com/mnutt/limecast/blob/6a00b0c9d94c49689ba0d201e9629eb912092dcd/public/flash/soundmanagerv295a-20090717/demo/animation-2a/index.html

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

//
```


## License: unknown
https://github.com/tokuhirom/64p.org-orig-orig/blob/0119328d9e8af599726fbaf973ca30a9d04d4bc3/talks/assets/markdown.js

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

//
```


## License: unknown
https://github.com/dubrowgn/impulse.js/blob/dbd17406ca68a537b93ca9eae310591ab5937b5f/src/net/sanitizer.ts

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "
```


## License: unknown
https://github.com/Vic-IDE/vic-ide/blob/a194439f06a57e55ce04b738327447b647f53a20/src-ext/PanelHtml.ts

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "
```


## License: unknown
https://github.com/mnutt/limecast/blob/6a00b0c9d94c49689ba0d201e9629eb912092dcd/public/flash/soundmanagerv295a-20090717/demo/animation-2a/index.html

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

//
```


## License: unknown
https://github.com/tokuhirom/64p.org-orig-orig/blob/0119328d9e8af599726fbaf973ca30a9d04d4bc3/talks/assets/markdown.js

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

//
```


## License: unknown
https://github.com/dubrowgn/impulse.js/blob/dbd17406ca68a537b93ca9eae310591ab5937b5f/src/net/sanitizer.ts

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "
```


## License: unknown
https://github.com/Vic-IDE/vic-ide/blob/a194439f06a57e55ce04b738327447b647f53a20/src-ext/PanelHtml.ts

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "
```


## License: unknown
https://github.com/mnutt/limecast/blob/6a00b0c9d94c49689ba0d201e9629eb912092dcd/public/flash/soundmanagerv295a-20090717/demo/animation-2a/index.html

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

//
```


## License: unknown
https://github.com/tokuhirom/64p.org-orig-orig/blob/0119328d9e8af599726fbaf973ca30a9d04d4bc3/talks/assets/markdown.js

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

//
```


## License: unknown
https://github.com/macournoyer/rbv8/blob/cdd7cb3cd70f712be01b22528e649f00fa53159c/vm/v8/src/string.js

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ...
```


## License: unknown
https://github.com/dubrowgn/impulse.js/blob/dbd17406ca68a537b93ca9eae310591ab5937b5f/src/net/sanitizer.ts

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "
```


## License: unknown
https://github.com/Vic-IDE/vic-ide/blob/a194439f06a57e55ce04b738327447b647f53a20/src-ext/PanelHtml.ts

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "
```


## License: unknown
https://github.com/mnutt/limecast/blob/6a00b0c9d94c49689ba0d201e9629eb912092dcd/public/flash/soundmanagerv295a-20090717/demo/animation-2a/index.html

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

//
```


## License: unknown
https://github.com/tokuhirom/64p.org-orig-orig/blob/0119328d9e8af599726fbaf973ca30a9d04d4bc3/talks/assets/markdown.js

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

//
```


## License: unknown
https://github.com/macournoyer/rbv8/blob/cdd7cb3cd70f712be01b22528e649f00fa53159c/vm/v8/src/string.js

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ...
```


## License: unknown
https://github.com/dubrowgn/impulse.js/blob/dbd17406ca68a537b93ca9eae310591ab5937b5f/src/net/sanitizer.ts

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "
```


## License: unknown
https://github.com/Vic-IDE/vic-ide/blob/a194439f06a57e55ce04b738327447b647f53a20/src-ext/PanelHtml.ts

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "
```


## License: unknown
https://github.com/mnutt/limecast/blob/6a00b0c9d94c49689ba0d201e9629eb912092dcd/public/flash/soundmanagerv295a-20090717/demo/animation-2a/index.html

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

//
```


## License: unknown
https://github.com/tokuhirom/64p.org-orig-orig/blob/0119328d9e8af599726fbaf973ca30a9d04d4bc3/talks/assets/markdown.js

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

//
```


## License: unknown
https://github.com/macournoyer/rbv8/blob/cdd7cb3cd70f712be01b22528e649f00fa53159c/vm/v8/src/string.js

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ...
```


## License: unknown
https://github.com/dubrowgn/impulse.js/blob/dbd17406ca68a537b93ca9eae310591ab5937b5f/src/net/sanitizer.ts

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "
```


## License: unknown
https://github.com/Vic-IDE/vic-ide/blob/a194439f06a57e55ce04b738327447b647f53a20/src-ext/PanelHtml.ts

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "
```


## License: unknown
https://github.com/mnutt/limecast/blob/6a00b0c9d94c49689ba0d201e9629eb912092dcd/public/flash/soundmanagerv295a-20090717/demo/animation-2a/index.html

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

//
```


## License: unknown
https://github.com/tokuhirom/64p.org-orig-orig/blob/0119328d9e8af599726fbaf973ca30a9d04d4bc3/talks/assets/markdown.js

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

//
```


## License: unknown
https://github.com/macournoyer/rbv8/blob/cdd7cb3cd70f712be01b22528e649f00fa53159c/vm/v8/src/string.js

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ...
```


## License: unknown
https://github.com/dubrowgn/impulse.js/blob/dbd17406ca68a537b93ca9eae310591ab5937b5f/src/net/sanitizer.ts

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "
```


## License: unknown
https://github.com/Vic-IDE/vic-ide/blob/a194439f06a57e55ce04b738327447b647f53a20/src-ext/PanelHtml.ts

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "
```


## License: unknown
https://github.com/mnutt/limecast/blob/6a00b0c9d94c49689ba0d201e9629eb912092dcd/public/flash/soundmanagerv295a-20090717/demo/animation-2a/index.html

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

//
```


## License: unknown
https://github.com/tokuhirom/64p.org-orig-orig/blob/0119328d9e8af599726fbaf973ca30a9d04d4bc3/talks/assets/markdown.js

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

//
```


## License: unknown
https://github.com/macournoyer/rbv8/blob/cdd7cb3cd70f712be01b22528e649f00fa53159c/vm/v8/src/string.js

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ...
```


## License: unknown
https://github.com/mnutt/limecast/blob/6a00b0c9d94c49689ba0d201e9629eb912092dcd/public/flash/soundmanagerv295a-20090717/demo/animation-2a/index.html

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

//
```


## License: unknown
https://github.com/tokuhirom/64p.org-orig-orig/blob/0119328d9e8af599726fbaf973ca30a9d04d4bc3/talks/assets/markdown.js

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

//
```


## License: unknown
https://github.com/dubrowgn/impulse.js/blob/dbd17406ca68a537b93ca9eae310591ab5937b5f/src/net/sanitizer.ts

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

//
```


## License: unknown
https://github.com/Vic-IDE/vic-ide/blob/a194439f06a57e55ce04b738327447b647f53a20/src-ext/PanelHtml.ts

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

//
```


## License: unknown
https://github.com/macournoyer/rbv8/blob/cdd7cb3cd70f712be01b22528e649f00fa53159c/vm/v8/src/string.js

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ...
```


## License: unknown
https://github.com/mnutt/limecast/blob/6a00b0c9d94c49689ba0d201e9629eb912092dcd/public/flash/soundmanagerv295a-20090717/demo/animation-2a/index.html

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ...
```


## License: unknown
https://github.com/macournoyer/rbv8/blob/cdd7cb3cd70f712be01b22528e649f00fa53159c/vm/v8/src/string.js

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ...
```


## License: unknown
https://github.com/tokuhirom/64p.org-orig-orig/blob/0119328d9e8af599726fbaf973ca30a9d04d4bc3/talks/assets/markdown.js

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ...
```


## License: unknown
https://github.com/dubrowgn/impulse.js/blob/dbd17406ca68a537b93ca9eae310591ab5937b5f/src/net/sanitizer.ts

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ...
```


## License: unknown
https://github.com/Vic-IDE/vic-ide/blob/a194439f06a57e55ce04b738327447b647f53a20/src-ext/PanelHtml.ts

```


# GE Market Analyzer — Comprehensive UI/UX Review

I've thoroughly analyzed the HTML structure ([src/index.html](src/index.html)), stylesheet ([src/style.css](src/style.css)), and UI service ([src/uiService.ts](src/uiService.ts)). Below is my evaluation across all four criteria, with actionable refactored code for each issue.

---

## 1. Color Theory & Aesthetics

### 1.1 — Profit/Loss Color Contrast Is Too Subtle Against Dark Backgrounds

The current profit green (`#4caf50`) and loss red (`#f44747`) have acceptable hue separation, but on the dark Classic panel backgrounds (`#1a1a2e`) the green in particular lacks *luminance contrast*. The green reads as "dim" rather than "alerting." The gold accent (`#f0c040`) used for hype badges competes with the sell-badge gold, creating ambiguity — two semantically different elements share the same hue.

**Fix**: Brighten the profit green slightly and shift the hue to a cooler mint-green that pops better on dark backgrounds. Separate hype-gold from sell-gold by warming the hype badge toward amber.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Profit / Loss — improved luminance for dark backgrounds ── */
  --accent-green: #5ece6b;      /* was #4caf50 — +12% luminance, slightly cooler */
  --accent-red: #ff6b6b;        /* was #f44747 — softer, less aggressive, same alerting power */

  /* ── Hype vs Sell separation ── */
  --accent-gold: #f0c040;       /* keep for sell badges */
  --accent-hype: #ffab40;       /* NEW — amber for hype/volume spike badges */

  /* ...existing code... */
}
````

Then update hype badge references:

````css
// filepath: src/style.css
/* ...existing code... */
.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);    /* was var(--accent-gold) */
}

.vol-badge {
  background: rgba(255, 171, 64, 0.15);   /* was rgba(240, 192, 64, 0.15) */
  color: var(--accent-hype);               /* was var(--accent-gold) */
}
/* ...existing code... */
````

Add the new variable to each colorway block that overrides `--accent-gold`:

````css
// filepath: src/style.css
/* ...existing code... */
body[data-colorway="osrs"] {
  /* ...existing code... */
  --accent-hype: #e89830;
  /* ...existing code... */
}

body[data-colorway="rs3-modern"] {
  /* ...existing code... */
  --accent-hype: #ffab40;
  /* ...existing code... */
}

body[data-colorway="light"] {
  /* ...existing code... */
  --accent-hype: #e68a00;
  /* ...existing code... */
}

body[data-colorway="sol-dark"] {
  /* ...existing code... */
  --accent-hype: #cb8b16;
  /* ...existing code... */
}

body[data-colorway="sol-light"] {
  /* ...existing code... */
  --accent-hype: #b58900;
  /* ...existing code... */
}
/* ...existing code... */
````

### 1.2 — Badge Color Hierarchy Lacks Visual Weight Ordering

Currently Buy, Sell, and Profit badges are all similarly sized/weighted. The most *actionable* piece of data — estimated flip profit — should carry the strongest visual weight since it's the primary decision driver.

**Fix**: Give the profit badge slightly more padding and a bolder font-weight to visually "promote" it above the buy/sell context badges.

````css
// filepath: src/style.css
/* ...existing code... */
.profit-badge {
  font-size: 10px;
  padding: 2px 7px;            /* was 1px 5px — slightly larger hit area */
  font-weight: 700;            /* was 600 or inherited — bolder to pop */
  border-radius: 3px;
  background: rgba(76, 175, 80, 0.18);
  color: var(--accent-green);
  letter-spacing: 0.02em;      /* NEW — subtle tracking for emphasis */
}

.profit-badge.negative {
  background: rgba(244, 71, 71, 0.18);
  color: var(--accent-red);
  font-weight: 700;
}
/* ...existing code... */
````

---

## 2. User Experience & Information Architecture

### 2.1 — Detail Row Grid Is a Single Column — Dense Data Is Hard to Scan

The analytics modal detail grid uses `grid-template-columns: 1fr` by default, creating a tall vertical scroll with ~16 rows. At the modal's 920px max-width, this wastes horizontal space and forces excessive scrolling. The `@media (min-width: 600px)` two-column breakpoint activates *inside* the modal — but the modal itself is already wide enough at most screen sizes. The breakpoint should be based on the modal container width, not the viewport.

**Fix**: Default to two columns when the modal is ≥ 500px wide (which is nearly always, since the modal is `min-width: 320px` and `width: 90vw`). Use a container-aware approach — since container queries aren't universally supported in Alt1's Chromium, use the viewport breakpoint but lower the threshold to `480px` which is the practical minimum where two columns work.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;              /* was 2px — add column gap for 2-col readability */
  padding: 8px 0;
}

/* Two-column detail grid — lowered breakpoint from 600px */
@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* ...existing code... */
````

### 2.2 — Detail Row Labels and Values Lack Visual Separation

Each `.detail-row` uses a label span and a value span, but they're styled with similar font sizes and colors. Scanning 16 rows, the eye has to work to separate "what is this?" from "what's the number?" — especially for financial data where misreading is costly.

**Fix**: Style labels with a muted, smaller, uppercase treatment and values with a brighter, slightly larger weight. Add a subtle bottom border to each row for scanline guidance.

````css
// filepath: src/style.css
/* ...existing code... */
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;                          /* was 2px 0 */
  border-bottom: 1px solid var(--border);  /* NEW — scanline divider */
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;              /* NEW — visually demotes the label */
  letter-spacing: 0.04em;                 /* NEW — improves uppercase readability */
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  font-weight: 600;                       /* was 400/normal — bolder for quick scanning */
  color: var(--text-bright);              /* was var(--text-main) — brighter for contrast */
  text-align: right;
  word-break: break-word;
}
/* ...existing code... */
````

### 2.3 — Card Expanded Detail Panel Has No Visual Boundary

When a card is expanded, the `.market-card-detail` slides open via `max-height` transition but has no distinct background or border separating it from the card header. In tile/hybrid views this can make adjacent cards visually merge.

**Fix**: Add a subtle top border and a slightly different background to the detail panel.

````css
// filepath: src/style.css
/* ...existing code... */
.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
  border-top: 1px solid transparent;     /* invisible when collapsed */
  background: transparent;
}

.market-card.expanded .market-card-detail {
  border-top-color: var(--border);       /* visible divider when open */
  background: rgba(0, 0, 0, 0.08);      /* very subtle inset bg */
}
/* ...existing code... */
````

### 2.4 — Predictive Analytics Section Doesn't Stand Out From Regular Detail Rows

The "Predictive Analytics" sub-section within the analytics modal is semantically a *different category* of data (forward-looking estimates vs. observed facts), but it's rendered as continuation detail rows with no visual break.

**Fix**: Add a section sub-header style and a left accent border in the analytics modal. Update [`showAnalyticsModal`](src/uiService.ts) to wrap the predictive rows in a distinct container.

````css
// filepath: src/style.css
/* ...existing code... */
.analytics-section-divider {
  grid-column: 1 / -1;             /* span full width in 2-col grid */
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
/* ...existing code... */
````

Then in [`showAnalyticsModal`](src/uiService.ts), wrap the predictive detail rows:

````typescript
// filepath: src/uiService.ts
// ...existing code...
// Inside showAnalyticsModal, where predictive detail rows are built:

// Replace the flat predictive rows with a wrapped section:
const predictiveHeader = `<div class="analytics-section-divider">Predictive Analytics</div>`;
const predictiveRows = [
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d ? formatGpShort(Math.round(item.ema30d)) + " gp" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
  `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp" : "Insufficient data"}</span></div>`,
].join("");

// Combine into the details grid HTML:
// ... (after the volume/liquidity rows)
// Add: predictiveHeader + `<div class="predictive-section">${predictiveRows}</div>`
// ...existing code...
````

### 2.5 — Settings Panel Is Overloaded — No Visual Grouping

The settings `<details>` panel contains provider selection, model config, API key, force reload, data management, theme style, and colorway — all as a flat list. This creates a wall of controls that's hard to navigate.

**Fix**: Group related settings into visually distinct fieldsets with subtle borders.

````html
<!-- filepath: src/index.html -->
<!-- ...existing code... -->
<details id="settings-panel">
	<summary>⚙ Settings</summary>
	<div class="settings-body">

		<!-- Interface layout -->
		<fieldset class="settings-group">
			<legend class="settings-group-title">Appearance</legend>
			<label>Interface Layout</label>
			<!-- ...existing layout toggle code... -->
			<label>Visual Style</label>
			<!-- ...existing style select code... -->
			<label>Colorway</label>
			<!-- ...existing colorway select code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">AI Provider</legend>
			<!-- ...existing provider select, model input, API key code... -->
		</fieldset>

		<fieldset class="settings-group">
			<legend class="settings-group-title">Data</legend>
			<!-- ...existing force reload, export/import code... -->
		</fieldset>

	</div>
</details>
<!-- ...existing code... -->
````

````css
// filepath: src/style.css
/* ...existing code... */
.settings-group {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
/* ...existing code... */
````

---

## 3. UI Code Best Practices

### 3.1 — Magic Numbers in Card Badge Sizing

Badge font sizes (9px, 10px, 11px) and padding values (1px 4px, 1px 5px, 2px 5px) are scattered across dozens of rules for `.buy-badge`, `.sell-badge`, `.profit-badge`, `.velocity-badge`, `.hype-badge`, `.predicted-badge`. Any future resizing requires touching ~20 selectors.

**Fix**: Define badge sizing tokens as CSS custom properties and use a shared base class.

````css
// filepath: src/style.css
/* ...existing code... */
:root {
  /* ...existing code... */

  /* ── Badge sizing tokens ── */
  --badge-font-sm: 9px;
  --badge-font-md: 10px;
  --badge-padding-sm: 1px 4px;
  --badge-padding-md: 2px 6px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ...existing code... */
}

/* Shared badge base — apply to all badge types */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
  white-space: nowrap;
}

/* Then individual badge rules only set color/background: */
.buy-badge {
  background: rgba(78, 205, 196, 0.15);
  color: var(--accent-teal);
}

.sell-badge {
  background: rgba(240, 192, 64, 0.15);
  color: var(--accent-gold);
}

/* Tile view compacts use the sm token */
.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
/* ...existing code... */
````

### 3.2 — Inconsistent Grid Breakpoints Between Tile and Hybrid Views

Tile view uses `minmax(130px, 1fr)` while hybrid uses `minmax(200px, 1fr)` — this is correct semantically, but the responsive `@media (min-width: 800px)` block overrides these with different minimums (`minmax(150px, 1fr)` and `minmax(220px, 1fr)` respectively). The jump between mobile and desktop column widths (+20px) is so small it creates a barely-noticeable reflow that adds complexity without visual benefit.

**Fix**: Use consistent column widths and only change gap/padding at the breakpoint.

````css
// filepath: src/style.css
/* ...existing code... */
.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* unified */
  gap: 4px;
  padding: 6px 8px;
}

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));  /* unified */
  gap: 6px;
  padding: 6px 8px;
}

@media (min-width: 800px) {
  .market-items.tile,
  .market-items.hybrid {
    gap: 8px;          /* only increase gap at desktop, keep column widths */
    padding: 8px 12px;
  }
}
/* ...existing code... */
````

### 3.3 — Toast Container Lacks `pointer-events: none` on the Container

The `#toast-container` is `position: fixed` in the top-right. Individual `.toast` elements have pointer events for dismissal, but the parent container doesn't set `pointer-events: none` — meaning the invisible container area blocks clicks on any UI element underneath it.

**Fix**:

````css
// filepath: src/style.css
/* ...existing code... */
#toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;        /* NEW — container doesn't block clicks */
}

.toast {
  /* ...existing code... */
  pointer-events: auto;        /* NEW — individual toasts remain interactive */
}
/* ...existing code... */
````

### 3.4 — DOM String Building via `innerHTML` Concatenation Is Error-Prone

Several places in [`buildItemCard`](src/uiService.ts) and [`showAnalyticsModal`](src/uiService.ts) build HTML via template string concatenation with `innerHTML`. While functional, this mixes data into markup strings, making XSS possible if item names ever contain HTML characters, and making the code harder to maintain.

The item names come from the Weird Gloop API and could theoretically contain `<` or `&`. While not a critical vulnerability in an Alt1 overlay, it's a best-practice issue.

**Fix**: Add a text-escaping utility and use it for all user-data interpolation points.

````typescript
// filepath: src/uiService.ts
// ...existing code... (near the top, after imports)

/**
 * Escape HTML special characters to prevent accidental markup injection.
 * Used when interpolating API-sourced strings into innerHTML templates.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ...
```

