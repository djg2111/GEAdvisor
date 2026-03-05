# Copilot Instructions  GE Market Analyzer (Alt1 Plugin)

---

## AI Persona & Design Philosophy

Act as an **Expert UI/UX Designer, Master of Color Theory, and Senior Frontend Developer**.

### Core Principles
- **Foundational Color Theory**: Excellent contrast, visual hierarchy, and harmonious balance. Maintain the structural integrity of the 192-theme matrix.
- **Universal UX & Information Architecture**: Prioritize intuitiveness and rapid readability of dense financial data. Group data points, margins, and tooltips logically with adequate negative space.
- **Accessibility**: Strictly enforce **WCAG 2.1 AA** (or AAA) contrast ratios. Never sacrifice accessibility for aesthetics.
- **Responsive & Fluid Architecture**: Prefer modern CSS Grid and Flexbox fluid techniques (`clamp()`, `minmax()`, `auto-fit`) over hard-coded magic numbers or excessive media query breakpoints. Scale flawlessly from Alt1 overlay to full desktop browser.
- **Maintainable Code**: Follow DRY principles. Use the established CSS custom property token system exclusively for colours and spacing.

### UI/UX Freedom
This is an **Alt1 overlay plugin for dense financial data**. The UI/UX approach is **open-ended**  prioritize universal readability, modern design patterns, and information density over strictly adhering to standard RS3 interface conventions. The goal is a professional financial dashboard that happens to display RuneScape data.

### RS3 Financial Accuracy
All calculations, recommendations, and LLM-injected context **must** account for RS3 economic rules:
- **2% GE tax** on the sell side (floor-rounded, exempt at <=50 gp)
- **Buy limits** per 4-hour window (6 windows/day)
- **Flip profit formula**: `recSellPrice - recBuyPrice - floor(recSellPrice * 0.02)`
- **Tax gap**: `ceil(price / 0.98) - price`  minimum spread to break even
- **High Alch floor**: `floor(value * 0.6)` anchors item prices
- The LLM system prompt **must** include `RS3_ECONOMIC_RULES` and `DATA_FIELD_LEGEND` from `coreKnowledge.ts` with a supremacy clause  these override any model training data

---

## Architecture

RS3 Alt1 Toolkit plugin using a RAG pipeline:

```
Weird Gloop API -> IndexedDB cache -> deterministic filtering -> LLM synthesis
```

All services live in `src/services/` with a barrel re-export via `src/services/index.ts`. The UI layer (`src/uiService.ts`) is the **only** file that touches the DOM  all services are UI-agnostic. Entry point `src/index.ts` is a thin orchestrator (~80 lines) with startup overlay + step counter.

---

## Hard Constraints

- **No external HTTP/LLM packages**  use native `fetch` exclusively (no `openai`, `axios`, etc.)
- **Do not modify `cacheService.ts` or `weirdGloopService.ts`** unless absolutely necessary
- All shared interfaces and the `LLM_PROVIDERS` constant live in `src/services/types.ts`  add new types there, not in service files
- JSDoc on all public methods and exported interfaces
- LLM prompts must forbid hallucinating prices/volumes/game mechanics; only use data passed in the user message
- **Barrel imports**: Always import services/types from `./services` (the barrel), not from individual files like `./services/types`
- **`HistoricalPriceRecord`** is re-exported from the barrel  use it in uiService for typed cache reads

---

## Build & Verify

The developer runs `npm run watch` in a dedicated terminal for continuous rebuilds. **Prefer `watch` output to validate changes**  only run `npm run build` for clean one-shot builds (e.g. final verification before commit).

```sh
npm run watch          # primary dev workflow  webpack --watch, rebuilds on save
npm run build          # one-shot build -> dist/ (0 errors expected)  use sparingly
npx serve dist --listen 8080   # local dev server (run in a separate terminal)
```

`npx tsc --noEmit` will show ~11 errors about the `alt1` module  these are **expected** (webpack resolves alt1 types at build time). Only webpack output (watch or build) is the true validation.

---

## Key Patterns

### Service Architecture

- **Constructor injection**: e.g. `new MarketAnalyzerService(cacheService)`, `new LLMService({ apiKey, endpoint, model })`
- **`LLMService` accepts `Partial<LLMConfig>`**  all fields optional (defaults to Groq). API key omitted = no Authorization header (for self-hosted models)
- **Runtime filter overrides**: `analyzer.getTopItems(overrides?)` merges `Partial<MarketAnalyzerConfig>` at call time  don't reconstruct the service for filter changes
- **Volume preset filters** (High / Low) apply against **global daily GE volume**, not `effectivePlayerVolume`
- **TTL-cached scoring maps**: `MarketAnalyzerService.getOrBuildMaps(days)` caches `avgVolumeMap` and `priceHistoryMap` with a 10-minute TTL. All public methods use this cache  maps rebuild from IndexedDB only when stale. `invalidateMapCache()` exists for manual reset

### State Management & localStorage

- **Key prefix**: `ge-analyzer:` (e.g. `ge-analyzer:llm-provider`, `ge-analyzer:view-mode`, `ge-analyzer:mode`, `ge-analyzer:style`, `ge-analyzer:colorway`, `ge-analyzer:contrast`, `ge-analyzer:compact-tiles`, `ge-analyzer:colorway-v2`)
- **Favourites**: `FavoriteItem[]` (not plain strings)  stored as `{ name, targetBuy?, targetSell? }`. Legacy `string[]` format auto-migrates via `loadFavorites()`
- **Price alert dedup**: `firedAlerts` Set (session-scoped) prevents repeat alerts. Triggers DOM toast + native `Notification`
- **Per-section sort controls**: Top 20, Search Results, and Favourites each have their own sort `<select>` and localStorage key. Shared `applySortOrder()` helper  do not add a global sort
- **EXPORT_KEYS completeness**: The `EXPORT_KEYS` array in `uiService.ts` must include all user-preference localStorage keys. Verify after adding new persisted settings

### CSS & Theme System

- **Four-axis system** (Mode x Style x Colorway x Contrast): 2 x 4 x 8 x 3 = 192 combinations via `<body>` data attributes (`data-mode`, `data-style`, `data-colorway`, `data-contrast`)
- **Modes**: Dark (default), Light
- **Styles**: Basic, Glassmorphism (`glass`), Neumorphism (`neumorphism`), Skeuomorphism (`skeuomorphism`)
- **Colorways**: Default, Classic, RS3 Modern, RS Lobby, Gruvbox, Solarized, Twilight Amethyst, OSRS Design
- **Contrast**: Normal, Soft, Hard  via non-circular `color-mix(in srgb, ...)` (strict DAG)
- **Selectors**: Compound form `body[data-mode="dark"][data-colorway="classic"]`
- **Colorway files** define both dark/light palettes plus `--glass-*`, `--neu-*`, `--skeu-*` helper vars and 4 `*-base` accent vars consumed by contrast modifiers
- **Contrast modifier specificity**: 0,3,1 (`body[data-mode][data-contrast][data-colorway]`) always beats colorway selectors (0,2,1)
- **`color-mix()` must NEVER self-reference**  creates CSS dependency cycles. Each override references ONLY sibling properties (strict DAG). Financial accents use `*-base` duplicates (e.g. `--accent-teal-base`)
- **`--text-price`**: Standardised to green family across all 16 colorway x mode combinations. Do not use gold/olive tones for prices
- **`--text` and `--border` aliases**: Do NOT use `var(--text)` for component text  resolves at `:root` scope and fails to re-resolve under `body` light-mode overrides. Always use `var(--text-main)` or `var(--text-bright)` directly
- **Semantic badge tokens**: Badge backgrounds/borders are CSS custom properties (`--badge-velocity-*-bg`, `--badge-tier-*-bg/border`, etc.)  do not hard-code `rgba()`
- **Badge sizing tokens**: `--badge-font-sm`: 11px, `--badge-font-md`: 12px, `--badge-padding-sm`: 2px 6px, `--badge-padding-md`: 3px 7px. Sized for 110-125% DPI. Override tokens, not individual classes
- **`--accent-hype`**: Single canonical hype/volume-spike colour token. Sell badges keep `--accent-gold`
- **No `!important` on badge/highlight colours**: Use doubled-selector specificity instead (`.market-card .hype-text, .hype-text.hype-text`)
- **New UI elements** must use `var(--*)` tokens, never hard-coded colours
- **Legacy migrations**: `migrateColorwayToMode()` handles old values (`light`, `sol-dark`, `sol-light`). `migrateColorwayRename()` handles renames (`classic` -> `default`, `osrs` -> `classic`), gated by `ge-analyzer:colorway-v2` flag

#### Theme Application
- **`applyThemeBatch(mode, style, colorway, contrast)`**: Writes all four `dataset` properties in a single synchronous pass
- **`forceStyleInvalidation()`**: Flushes browser `color-mix()` cache by toggling `data-mode` to its opposite, forcing `getComputedStyle`, then restoring. Called by `applyThemeBatch()` and interactive single-axis changes
- **Pre-bundle theme restoration**: An inline `<script>` in `index.html` reads localStorage and sets all four `data-*` attributes **before** the webpack bundle loads. **Do not move this logic into the webpack bundle**
- **Micro-component protection**: Icon-only buttons (`.popout-btn`, `.fav-btn`, `.alert-btn`, `.quick-add-btn`, `.flip-remove-btn`, `.flip-complete-btn`, `.ext-link`) have per-style overrides suppressing heavy shadows/blurs/gradients

### UI Components & Modals

- **Unified analytics modal**: `showAnalyticsModal(item)`  single scrollable overlay with item details, badges, alerts, actions, interactive price chart, trend stats. Lazy singleton via `ensureAnalyticsModal()`. Closes on backdrop/Escape. Detail row order: flip/profit -> volume/liquidity -> Predictive Analytics
- **History-range selector**: `<select id="history-range-select">` (7/30/90 days) in `#market-filters` and inline in modal  synced bidirectionally
- **On-demand graph history**: `ensureItemHistory(itemName, 90)`  cache-first, API fallback, persists results
- **Manual history refresh**: `.graph-history-status` strip with Refresh button when < 7 data points
- **Inline alert popover**: bell button toggles `.card-alert-popover`  only one open at a time per list
- **Predictive badges**: `.predictive-badges` (EMA, predicted 24h, volatility). Hidden in tile/hybrid when compact mode enabled; always visible in list view
- **Compact tiles toggle**: `ge-analyzer:compact-tiles` checkbox. Toggling re-renders all three market panels
- **Completed flips table**: `<table class="completed-flips-table">` with clickable sort headers
- **CSV export**: `#export-csv-btn` triggers data-URL CSV download
- **Startup step counter**: 4-step counter in overlay. `initUI` receives `onStatus` callback for steps 2-4

### LLM & Chat

- **Provider presets**: `LLM_PROVIDERS` array in `types.ts`  each has `endpoint`, `defaultModel`, `keyPlaceholder`, `models[]`, `costTier`, `costNote`, optional `signupUrl`
- **Provider cost badges**: Emoji badges on `<option>` labels. `#provider-cost-hint` colour-coded span
- **Setup guide modal**: `showSetupGuide()`  lazy singleton with per-provider instructions, cost banner, comparison table
- **Conversation trimming**: `buildTrimmedHistory()` strips `=== GRAND EXCHANGE DATA ===` blocks from all but the most recent user message. Caps at `MAX_HISTORY_PAIRS` (8) exchanges
- **Payload size guard**: `MAX_BODY_BYTES` (50 KB). Progressive trimming halves market-data lines (up to 4x). `LLM_CONTEXT_TOP_N` = 50 items. Always-on byte logging
- **LLM context**: `getFormattedForLLM()` builds an unfiltered top-50 dataset for the chat advisor (broader than the UI's filtered top-20)

### Data Pipeline & API

- **Deep-history scan**: `#deep-history-checkbox` (persisted `ge-analyzer:deep-history`). When checked, fetches 90-day history per item (significantly slower). When unchecked, history loads on demand via analytics modal. **History-only optimisation**: if >= 90% of catalogue has fresh prices, scan fetches only history
- **Rate-limit retry**: `fetchWithRetry()`  exponential backoff on 429s/network errors (MAX_RETRIES=4, BACKOFF_BASE_MS=2000ms)
- **Batch dispatch**: `fetchLatestPrices`  **sequential** with 300 ms pauses. Do not revert to concurrent dispatch
- **History fetches**: Individual per-item requests with 200 ms pauses (the `/last90d` endpoint only accepts 1 item)
- **Adaptive scan backoff**: `runFullMarketScan` uses 1500 ms baseline, doubles on empty batches (30 s ceiling), resets on success
- **SEED_ITEMS naming**: Must be **exact** canonical RS Wiki titles. Verify via `https://api.weirdgloop.org/exchange/history/rs/last90d?name=<encoded>` before adding. Common pitfalls: "hallowe'en" not "h'ween", "Bane bar" not "Banite bar", "Orikalkum bar" not "Orichalcite bar", "Spirit shards" (plural), clean herbs need "Clean " prefix, "Bowstring" (one word), "Dragon Rider lance" (capital R), untradeable items have no GE data
- **Do not set `User-Agent`** (or other non-safelisted headers) in browser `fetch()`  triggers CORS preflight on Firefox

---

## Gotchas

### Build & Webpack
- `HtmlWebpackPlugin` emits `index.html`  never add HTML to webpack's `asset/resource` rules
- The inline `<script>` in `index.html` (theme restoration) **MUST stay outside the webpack bundle**  do not move this logic into `index.ts` or any bundled file
- `#app` height is `95%` (not `100vh`) to fix Alt1 zoom scaling  do not change
- Modal section in `uiService.ts` uses literal JS unicode escape sequences  use Node.js scripts for safe text replacement if needed

### CSS & Theming
- Slider pseudo-element styles (`::-webkit-slider-*` / `::-moz-range-*`) must stay in **separate rule blocks** per browser spec
- `:focus-visible` is set globally with `outline: 2px solid var(--accent-primary)`. Do not remove without providing an alternative keyboard focus indicator
- Style-specific micro-component overrides: Glass suppresses `backdrop-filter`; Neumorphism sets `box-shadow: none` on `.card-actions` children; Skeuomorphism flattens to `background: transparent`. Do not add heavy style effects to icon buttons
- Settings panel uses `<fieldset class="settings-group">`  three groups: Appearance, AI Provider, Data
- Profit/loss indicators use shape prefixes (triangle up / triangle down) in addition to colour for colour-blind accessibility
- Mobile breakpoints: <=600px (modal detail wrapping, compact UI), <=700px (sidebar disables, restores tabbed), >=800px (wider modals, expanded grids)

### DOM & UI
- Market panel `max-height: 30%`, chat panel `flex: 1 1 0` with `min-height: 120px`  intentional flex balance
- When editing DOM ref resolution in `uiService.ts`, verify **all** existing refs survive
- Model `<input>` uses `<datalist>`  do not auto-fill on provider change (pre-filters dropdown); set placeholder instead
- `#search-results` and `#search-loading` must have `width: 100%`  do not remove

---

## File Roles

| File | Responsibility |
|------|---------------|
| `uiService.ts` | **All** DOM manipulation, event binding, localStorage, rendering (~4 600 lines) |
| `services/types.ts` | Every shared interface + `LLM_PROVIDERS` constant |
| `services/coreKnowledge.ts` | Static RS3 economic rules + data field legend for LLM interpretation |
| `services/llmService.ts` | OpenAI-compatible chat client; payload size guard; conversation trimming |
| `services/marketAnalyzerService.ts` | Score -> filter -> rank -> format. TTL-cached maps. Sparse-history fallback. LLM context builder |
| `services/initDataPipeline.ts` | Startup orchestrator + `SEED_ITEMS` (~230). Health checks + `runFullMarketScan` |
| `services/portfolioService.ts` | Active flip tracker + completed flip history with P&L stats (localStorage) |
| `services/weirdGloopService.ts` | Weird Gloop RS3 GE API client  sequential batching + `fetchWithRetry()` |
| `services/wikiService.ts` | RS Wiki structured-data API  bulk buy-limits + High Alch values |
| `css/main.css` | **Modular CSS entry point**  `@import` cascade: base -> themes -> contrast -> styles -> micro-component protection -> layout -> components -> responsive |
| `css/base/` | Reset, Alt1 status banner |
| `css/themes/` | 16 colorway files, light-mode overrides, contrast modifiers |
| `css/styles/` | Glassmorphism, Neumorphism, Skeuomorphism, micro-component protection |
| `css/layout/` | App shell, main content, layout modes, views, responsive breakpoints |
| `css/components/` | 26 component files (settings, cards, modals, chat, portfolio, etc.) |

---

## UI Layout (index.html, top -> bottom)

0. `#startup-overlay`  spinner + step counter + status text (auto-removed after boot)
1. `#background-sync-progress`  scan progress bar (hidden by default)
2. `#error-banner`  dismissible error bar with retry (hidden by default)
3. `#market-filters`  volume / price dropdowns + refresh button
4. Custom slider groups (volume min/max, budget)  shown when "Custom" selected
5. `#search-section`  search input + `#search-sort-select` + view toggle + compact-tiles checkbox + `#search-results`
6. `#favorites-section`  star header + `#favorites-sort-select` + collapse button + `#favorites-items`
7. `.top20-section` -> `#market-header` (h2 + `.market-header-actions`: scan btn + deep-history checkbox + sort select + collapse) + `#market-items`

---

## Documentation Synchronization Protocol

**Do not update documentation after every response.** Only synchronize docs at these milestones:

### When to Update
1. **Feature completed**  a discrete feature is fully implemented and verified
2. **Bug fully resolved**  root cause identified, fix applied, build passes
3. **Major refactor done**  file structure, architecture, or conventions changed
4. **User commands "Doc Sync"**  explicit request to synchronize all three files

### Separation of Concerns

| File | Update When | What to Update |
|------|-------------|----------------|
| `.github/copilot-instructions.md` | Architectural rules, hard constraints, or global UI patterns change | File Roles, UI Layout, Key Patterns, Gotchas. Add/remove directives only |
| `HANDOFF.md` | Bugs resolved, state management changes, new service logic, status shifts | Past Issues table, Current Status checklist, architecture deep-dive, localStorage keys, types table. **Update ToC if headers change** |
| `readme.md` | User-facing features or installation steps change | Features list, Architecture table, LLM Providers table, Getting Started. **Update ToC if headers change** |

### Rules
- **copilot-instructions.md** contains only **directives** (do / do not). Historical bug context and "why it was broken" lore belongs in HANDOFF.md Past Issues
- **HANDOFF.md** is the single source of truth for resolved bugs, migration history, and implementation details
- **readme.md** is user-facing only  no internal architecture decisions or past bug references

---

## Full Context

See `HANDOFF.md` at the repo root for exhaustive architecture docs, type reference tables, past issue resolutions, and potential next steps.