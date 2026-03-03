# Copilot Instructions — GE Market Analyzer (Alt1 Plugin)

## Architecture

RS3 Alt1 Toolkit plugin using a RAG pipeline: `Weird Gloop API → IndexedDB cache → deterministic filtering → LLM synthesis`. All services live in `src/services/` with a barrel re-export via `src/services/index.ts`. The UI layer (`src/uiService.ts`) is the **only** file that touches the DOM — all services are UI-agnostic. Entry point `src/index.ts` is a thin orchestrator (~80 lines) with startup overlay + step counter.

## Hard Constraints

- **No external HTTP/LLM packages** — use native `fetch` exclusively (no `openai`, `axios`, etc.)
- **Do not modify `cacheService.ts` or `weirdGloopService.ts`** unless absolutely necessary
- All shared interfaces and the `LLM_PROVIDERS` constant live in `src/services/types.ts` — add new types there, not in service files
- JSDoc on all public methods and exported interfaces
- LLM system prompt must include `RS3_ECONOMIC_RULES` and `DATA_FIELD_LEGEND` from `coreKnowledge.ts` with supremacy clause — these rules override any model training data
- LLM prompts must forbid hallucinating prices/volumes/game mechanics; only use data passed in the user message
- **Keep docs in sync**: After completing any feature, bug fix, or refactor, update **all three** documentation files before considering the task done:
  1. `.github/copilot-instructions.md` — update File Roles, UI Layout, Key Patterns, or Gotchas if the change affects architecture, DOM structure, conventions, or known pitfalls.
  2. `readme.md` — update the Features list or any other section that the change touches (e.g. new UI capabilities, new service, removed feature). **If you add or rename a `##`/`###` heading, update the Table of Contents at the top of the file to match.**
  3. `HANDOFF.md` — update the relevant deep-dive section(s), localStorage keys table, types table, current-status checklist, and past-issues table as applicable. **If you add or rename a `##`/`###` heading (including new `4.x` subsections), update the Table of Contents at the top of the file to match.**

## Build & Verify

```sh
npm run build          # webpack → dist/ (use this to verify changes — 0 errors expected)
npx serve dist --listen 8080   # local dev server
```

`npx tsc --noEmit` will show ~11 errors about the `alt1` module — these are **expected** (webpack resolves alt1 types at build time). Only `npm run build` is the true validation.

## Key Patterns

- **Services use constructor injection**: e.g. `new MarketAnalyzerService(cacheService)`, `new LLMService({ apiKey, endpoint, model })`
- **LLMService accepts `Partial<LLMConfig>`** — all fields optional (defaults to Groq). API key omitted = no Authorization header (for self-hosted models)
- **Runtime filter overrides**: `analyzer.getTopItems(overrides?)` merges `Partial<MarketAnalyzerConfig>` at call time — don't reconstruct the service for filter changes
- **localStorage keys** are prefixed `ge-analyzer:` (e.g. `ge-analyzer:llm-provider`, `ge-analyzer:view-mode`, `ge-analyzer:top20-sort`, `ge-analyzer:theme`, `ge-analyzer:deep-history`, `ge-analyzer:compact-tiles`)
- **Favourites use `FavoriteItem[]`** (not plain strings) — stored in `ge-analyzer:favorites` as `{ name, targetBuy?, targetSell? }`. Legacy `string[]` format auto-migrates on first load via `loadFavorites()`.
- **Price alert dedup**: `firedAlerts` Set (session-scoped) prevents the same alert from firing repeatedly. Alerts trigger both a DOM toast (`#toast-container`) and a native `Notification` (if permission granted).
- **Inline alert popover**: Each item card has a 🔔 button in `.card-actions` that toggles a `.card-alert-popover` with compact buy/sell inputs — only one popover open at a time per list. The unified analytics modal also retains its own alert inputs.
- **Per-section sort controls**: Top 20, Search Results, and Favourites each have their own sort `<select>` and localStorage key (`ge-analyzer:top20-sort`, `ge-analyzer:search-sort`, `ge-analyzer:fav-sort`). Shared `applySortOrder()` helper sorts in place — do not add a global sort.
- **Unified analytics modal**: `showAnalyticsModal(item)` opens a single scrollable overlay combining item details (badges, recommendations, alerts, actions) with the interactive price chart and trend stats. Detail rows are ordered: flip/profit metrics first (GE price, rec buy/sell, flip profit, High Alch, tax gap, margin), then volume/liquidity metrics, then a "Predictive Analytics" section (30d EMA, Daily Volatility σ%, LR Slope, Predicted Price). Volume Spike row is always visible (shows "Normal" when ≤1.5×). Item sprite has a `title` tooltip showing the item ID. Replaces the old separate `showItemModal` + `showGraphModal` pair. Lazily created singleton (`ensureAnalyticsModal()`). Closes on backdrop click or Escape key. Each item card has one ↗ button that opens it.
- **History-range selector**: `<select id="history-range-select">` in `#market-filters` (7/30/90 days). Also rendered inline inside the analytics modal — changing either syncs the other. `fetchItemHistory(name, range)` delegates to `ensureItemHistory` (cache-first, API fallback) then slices to the requested range.
- **On-demand graph history**: `ensureItemHistory(itemName, 90)` checks IndexedDB first; if < 7 data points are cached it fetches via `WeirdGloopService.fetchHistoricalPrices`, persists via `cache.bulkInsertHistory`, then returns prices. The analytics modal shows dynamic loading text ("Checking cached history…" → "Fetching price history…") and a toast on failure.
- **Manual history refresh fallback**: When the analytics modal has < 7 data points, a `.graph-history-status` strip appears ("Insufficient history • Refresh") below the canvas. Clicking the button calls `ensureItemHistory(itemName, 90)`, re-renders on success, shows toast on failure. Button only visible when data is insufficient.
- **Predictive badges**: `buildItemCard` appends `.predictive-badges` (EMA, predicted 24h, volatility) after the momentum badges. Values come from `RankedItem.ema30d`, `.predictedNextPrice`, `.volatility`. Hidden in tile/hybrid view when compact mode is enabled (`ge-analyzer:compact-tiles`); always visible in list view. The analytics modal also includes a dedicated "Predictive Analytics" detail section (30d EMA, Daily Volatility σ%, LR Slope, Predicted Price).
- **Compact tiles toggle**: Checkbox next to the view-mode buttons; persisted in `ge-analyzer:compact-tiles`. When checked, `.predictive-badges` receive `.compact-hidden` (hidden) in tile/hybrid views only — list view remains detailed. UI state tracked via module-scoped `compactMode` boolean; toggling re-renders all three market panels.
- **Completed flips table**: `renderCompletedFlips()` renders a `<table class="completed-flips-table">` with clickable sort headers. Module-scoped `completedFlipsSortCol`/`completedFlipsSortAsc` track state.
- **CSV export**: `#export-csv-btn` in the portfolio history toolbar triggers `exportCompletedFlipsCsv()` — generates a data-URL CSV download of all `CompletedFlip` entries.
- **Three CSS themes**: Classic Dark (`:root`), OSRS Brown (`body[data-theme="osrs"]`), RS3 Modern Blue (`body[data-theme="rs3-modern"]`) — all via CSS custom properties. New UI elements must use `var(--*)` tokens, never hard-coded colours.
- **Provider presets** in `LLM_PROVIDERS` array (`types.ts`) — each has `endpoint`, `defaultModel`, `keyPlaceholder`, curated `models[]` with `recommended` flags, `costTier` (free/free-tier/low-cost/paid/self-hosted), `costNote`, and optional `signupUrl`
- **Provider cost badges**: `populateProviderDropdown()` appends a cost-tier emoji badge to each `<option>` label (e.g. "Groq  \u2705 FREE \u2B50 Recommended"). `applyProviderUI()` shows a colour-coded `#provider-cost-hint` span and toggles the `#setup-guide-btn` visibility.
- **Setup guide modal**: `showSetupGuide()` opens a lazily-created singleton (`ensureSetupGuideModal()`) with provider-specific step-by-step instructions (from `SETUP_GUIDES` map), a cost-tier banner, a direct link to the provider\'s API-key page, and a comparison table of all providers. Closes on backdrop click or Escape.
- **Barrel imports**: Always import services/types from `./services` (the barrel), not from individual files like `./services/types`
- **Conversation trimming**: `buildTrimmedHistory()` in `LLMService` strips `=== GRAND EXCHANGE DATA ===` blocks from all user messages except the most recent before sending to the API. Also caps conversation to `MAX_HISTORY_PAIRS` (8) exchanges + system prompt. Prevents HTTP 413 errors on multi-turn chat.
- **Payload size guard**: `generateAdvice()` checks JSON body size against `MAX_BODY_BYTES` (50 KB). Progressive trimming: halves market-data lines (up to 4×). `LLM_CONTEXT_TOP_N` = 50 items (down from 100). Always-on payload byte logging on every request.
- **`HistoricalPriceRecord`** is re-exported from the barrel (`services/index.ts`) — use it in uiService for typed cache reads
- **Deep-history scan checkbox**: `#deep-history-checkbox` next to the scan button; persisted in `ge-analyzer:deep-history`. When checked, `runFullMarketScan(..., deepHistory=true)` fetches 90-day history instead of 30-day per batch (~3–5× slower). One-time warning toast on enable.
- **TTL-cached scoring maps**: `MarketAnalyzerService.getOrBuildMaps(days)` caches `avgVolumeMap` and `priceHistoryMap` in memory with a 10-minute TTL. All three public methods (`getTopItems`, `searchItems`, `getItemsByNames`) use this cache — maps are only rebuilt from IndexedDB when stale. `invalidateMapCache()` exists for manual reset, but is rarely needed since data-update paths (scan, reload, retry) construct a new service instance.
- **Startup step counter**: `index.ts` shows a 4-step counter in the startup overlay ("Step 1 of 4"). Steps: Loading market data → Ranking top items → Loading favourites → Fetching item catalogue. `initUI` receives an `onStatus` callback to drive steps 2–4.
- **Rate-limit retry & adaptive backoff**: `WeirdGloopService.fetchWithRetry()` retries 429s and network errors with exponential backoff (MAX_RETRIES=4, BACKOFF_BASE_MS=2 000 ms). `fetchLatestPrices` dispatches batches **sequentially** (not concurrently) with 300 ms inter-batch pauses. History fetches use **pipe-delimited batched requests** of 50 items each, dispatched sequentially with HISTORY_GROUP_DELAY_MS=1 000 ms between batches (previously individual per-item requests). `runFullMarketScan` uses 1 500 ms inter-batch delay with adaptive backoff: consecutive empty batches double the delay up to a 30 s ceiling; delay resets to baseline on a successful batch.

## File Roles

| File | Responsibility |
|------|---------------|
| `uiService.ts` | **All** DOM manipulation, event binding, localStorage, rendering (~4 400 lines) |
| `services/types.ts` | Every shared interface + `LLM_PROVIDERS` constant |
| `services/coreKnowledge.ts` | Static RS3 economic rules (GE tax, buy limits, margin checking, high alch, item categories, flipping strategy, gp/hr formulas, common pitfalls) + data field legend for LLM interpretation |
| `services/llmService.ts` | OpenAI-compatible chat-completion client; builds system + user prompt; payload size guard (`MAX_BODY_BYTES` = 50 KB); conversation trimming via `buildTrimmedHistory()` (strips data blocks from older messages, caps at 8 exchanges) |
| `services/marketAnalyzerService.ts` | Score → filter → rank → format. Includes trade velocity scoring, 7-day price momentum classification, and sparse-history fallback to Weird Gloop `last90d` API for chart data. Sparse fallback delegates to `WeirdGloopService.fetchHistoricalPrices` (batched, pipe-delimited) and is capped at 500 items. TTL-cached `avgVolumeMap`/`priceHistoryMap` (10-min) avoids redundant IndexedDB reads on UI refresh. `getFormattedForLLM()` builds a broader top-50 unfiltered dataset (`LLM_CONTEXT_TOP_N = 50`) for the chat advisor. |
| `services/initDataPipeline.ts` | Startup orchestrator + `SEED_ITEMS` list (~100 RS3 items). Runs two health checks on every startup: re-enriches missing `highAlch`/`buyLimit` (>50% threshold) and re-seeds sparse history (<30% coverage). `runFullMarketScan` uses adaptive inter-batch backoff (1.5 s baseline, 30 s ceiling) |
| `services/portfolioService.ts` | Active flip tracker + completed flip history with P&L stats (localStorage) |
| `services/weirdGloopService.ts` | Weird Gloop RS3 GE API client — batched sequential fetching with `fetchWithRetry()` exponential backoff (429 / network errors) |
| `services/wikiService.ts` | RS Wiki structured-data API client — bulk buy-limit + High Alch value fetching from `Module:Exchange/<Item>` Lua sources. High Alch: prefers explicit `alchvalue`, falls back to `floor(value × 0.6)`, skips `alchable = false`. Guide/article text fetching removed (March 2026) — `coreKnowledge.ts` provides better flipping-focused LLM context |
| `style.css` | Three themes, cards/tiles/grids, unified analytics modal (details + graph), velocity badges, slider theming, toast notifications, alert inputs, inline alert popovers, data-mgmt buttons, predictive badges, compact-tiles toggle, completed-flips table, CSV export button, provider cost hints, setup guide modal, provider comparison table, responsive `@media (min-width: 800px)` breakpoint (~3 300 lines) |

## UI Layout (index.html, top → bottom)

0. `#startup-overlay` — full-area spinner + step counter ("Step 1 of 4") + status text (auto-removed after boot completes)
1. `#background-sync-progress` — scan progress bar (hidden by default, shown during full market scan)
2. `#error-banner` — dismissible error bar with retry (hidden by default)
3. `#market-filters` — volume / price dropdowns + refresh button
3. Custom slider groups (volume min/max, budget) — shown when "Custom" selected
4. `#search-section` — search input + `#search-sort-select` + view toggle (☰ ▦ ⊞) + compact-tiles checkbox + `#search-results`
5. `#favorites-section` — ★ header + `#favorites-sort-select` + collapse button + `#favorites-items`
6. `.top20-section` → `#market-header` (h2 + `.market-header-actions`: `#full-market-scan-btn` + `#deep-history-checkbox` + `#top20-sort-select` + collapse ▾) + `#market-items`

## Gotchas

- `HtmlWebpackPlugin` emits `index.html` — never add HTML to webpack's `asset/resource` rules
- `#app` height is `95%` (not `100vh`) to fix Alt1 zoom scaling — do not change this
- Market panel `max-height: 30%`, chat panel `flex: 1 1 0` with `min-height: 120px` — this flex balance is intentional
- When editing DOM ref resolution in `uiService.ts`, verify **all** existing refs survive — past refactors accidentally dropped refs
- Model `<input>` uses `<datalist>` — do not auto-fill the value on provider change (it pre-filters the dropdown); set placeholder instead
- `#search-results` and `#search-loading` must have `width: 100%` to stay below the flex-row search bar — do not remove this
- Modal section in `uiService.ts` uses literal JS unicode escape sequences — use Node.js scripts for safe text replacement if needed
- Slider pseudo-element styles (`::-webkit-slider-*` / `::-moz-range-*`) must stay in **separate rule blocks** per browser spec
- `fetchLatestPrices` dispatches batches **sequentially** (not via `Promise.allSettled`) — do not revert to concurrent dispatch or the API will rate-limit aggressively
- **Do not set `User-Agent` (or other non-safelisted headers) in browser `fetch()` calls** — Firefox honours the header (triggering a CORS preflight the API doesn't support), while Chrome silently strips it. Caused cross-origin failures on Firefox but not Chrome in both `weirdGloopService.ts` and `wikiService.ts` (March 2026).

## Full Context

See `HANDOFF.md` at the repo root for exhaustive architecture docs, type reference tables, past issue resolutions, and potential next steps.
