# GE Market Analyzer — Agent Handoff Document

> **Purpose**: Single source of truth for architecture, constraints, and resolved issues. Optimised for AI coding-assistant context.

---

## Table of Contents

- [1. Project Overview](#1-project-overview)
- [2. Standing Rules & Constraints](#2-standing-rules--constraints)
- [3. File Structure](#3-file-structure)
- [4. Architecture Deep-Dive](#4-architecture-deep-dive)
  - [4.1 Data Pipeline](#41-data-pipeline-initdatapipelinets)
  - [4.2 Weird Gloop Service](#42-weird-gloop-service-weirdgloopservicets)
  - [4.3 Cache Service](#43-cache-service-cacheservicets)
  - [4.4 Market Analyzer Service](#44-market-analyzer-service-marketanalyzerservicets)
  - [4.5 Wiki Service](#45-wiki-service-wikiservicets)
  - [4.6 Core Knowledge Base](#46-core-knowledge-base-coreknowledgets)
  - [4.7 LLM Service](#47-llm-service-llmservicets)
  - [4.8 LLM Provider System](#48-llm-provider-system-typests)
  - [4.9 Portfolio Service](#49-portfolio-service-portfolioservicets)
  - [4.10 UI Service](#410-ui-service-uiservicets)
  - [4.11 Entry Point](#411-entry-point-indexts)
  - [4.12 HTML Structure](#412-html-structure-indexhtml)
  - [4.13 Stylesheet](#413-stylesheet-cssmain-css)
- [5. localStorage Keys](#5-localstorage-keys)
- [6. Key Types Reference](#6-key-types-reference)
- [7. Build & Serve](#7-build--serve)
- [8. Current Status](#8-current-status)
- [9. Past Issues & Resolutions](#9-past-issues--resolutions)
- [10. Known Issues (Open)](#10-known-issues-open)
- [11. Potential Next Steps](#11-potential-next-steps)
- [12. Package Dependencies](#12-package-dependencies)

---

## 1. Project Overview

**RuneScape 3 Alt1 Toolkit plugin** — intelligent Grand Exchange market analyzer and money-making instructor using a RAG pipeline:

```
Weird Gloop API → IndexedDB cache → Deterministic filtering → LLM synthesis
```

Runs as an Alt1 overlay inside RS3 or standalone in a browser for development.

**Tech stack**: TypeScript, Webpack 5, IndexedDB, native `fetch` API, multi-provider LLM support (OpenAI-compatible).

---

## 2. Standing Rules & Constraints

1. **Expert TypeScript developer** specializing in RS3 Alt1 Toolkit plugins.
2. **Clean architecture, strict modularity, separation of concerns.**
3. **Production-ready code only** — no basic tech-stack explanations.
4. **No external NPM packages for LLM/HTTP** (`openai`, `axios`, etc.) — native `fetch` only.
5. **Do not modify `cacheService.ts` or `weirdGloopService.ts`** unless absolutely necessary.
6. **JSDoc on all public methods and exported interfaces.**
7. **Strongly typed** — all methods use TypeScript interfaces.
8. **LLM prompt must forbid hallucinating** prices/volumes/game mechanics — only use provided GE data + curated economic rules.
9. **LLM prompt must include `RS3_ECONOMIC_RULES`** from `coreKnowledge.ts` with a supremacy clause overriding model training data.
10. **Barrel imports** — import from `./services` (the barrel), never from `./services/types` directly.
11. **All DOM manipulation lives in `uiService.ts`** — services remain UI-agnostic.

---

## 3. File Structure

```
alt1minimal/
├── package.json               # deps: alt1. devDeps: ts-loader, webpack, html-webpack-plugin, style-loader, css-loader
├── tsconfig.json              # target ES2020, lib [ES2020, DOM, DOM.Iterable], moduleResolution "bundler"
├── webpack.config.js          # context src/, entry main→./index.ts, output dist/, HtmlWebpackPlugin
├── HANDOFF.md                 # This document
└── src/
    ├── appconfig.json         # Alt1 app manifest (asset/resource in webpack)
    ├── icon.png               # App icon (asset/resource)
    ├── index.html             # Full UI: settings, tabbed layout (market / advisor / portfolio), search, favourites, filters
    ├── index.ts               # Lean entry point: alt1 detection → initDataPipeline() → initUI(), startup loading overlay
    ├── css/                   # Modular CSS directory (entry: main.css)
    │   ├── main.css           # @import cascade entry point (base → themes → contrast → styles → layout → components → responsive)
    │   ├── base/              # reset.css, alt1-status.css
    │   ├── themes/            # 16 colorway files, light-mode-overrides.css, contrast-modifiers.css
    │   ├── styles/            # style-glassmorphism.css, style-neumorphism.css, style-skeuomorphism.css, micro-component-protection.css
    │   ├── layout/            # app-shell.css, main-content.css, layout-modes.css, views.css, responsive.css
    │   └── components/        # 28 component files (settings, market-cards, modals, chat, portfolio, search-filters, back-to-top, etc.)
    ├── uiService.ts           # All DOM logic: settings, market render, search, favourites, portfolio, chat RAG, error recovery, price alerts, data export/import, CSV export, sortable flips table, unified analytics modal (~4 634 lines)
    └── services/
        ├── index.ts               # Barrel re-export of all services + types + constants
        ├── types.ts               # All shared TypeScript interfaces + LLM_PROVIDERS preset array
        ├── coreKnowledge.ts       # Static RS3 economic rules knowledge base (injected into LLM prompt)
        ├── weirdGloopService.ts   # Weird Gloop RS3 GE API client
        ├── cacheService.ts        # IndexedDB wrapper (v3: prices + intraday price-history stores)
        ├── marketAnalyzerService.ts # Deterministic filtering: score → filter → rank → format (with runtime overrides)
        ├── wikiService.ts         # RS3 Wiki MediaWiki API client + Cargo buy-limit API
        ├── llmService.ts          # OpenAI-compatible chat-completion client + anti-hallucination + economic rules prompt
        ├── portfolioService.ts    # Active flip tracker with localStorage persistence
        └── initDataPipeline.ts    # Orchestrator: open cache → check stale → fetch → insert → health checks → return. Also fetchGECatalogue()
```

---

## 4. Architecture Deep-Dive

### 4.1 Data Pipeline (`initDataPipeline.ts`)

Called once at startup from `index.ts`:
1. Opens IndexedDB (`ge-analyzer-cache` database, version 3).
2. Checks staleness via cursor on `fetchedAt` index descending — if newest record > 1h old, cache is stale.
3. If stale: fetches ~230 curated seed items from the Weird Gloop API → enriches with buy limits from the RS Wiki Cargo API → bulk-inserts into IndexedDB (both `prices` and `price-history` stores).
4. **Health check A** (runs on every startup): If >50% of cached records are missing `highAlch` or `buyLimit`, re-enriches them via `WikiService` and persists via `bulkInsert`.
5. **Health check B** (runs on every startup): If <30% of cached items have ≥2 days of price history, re-seeds history for **SEED_ITEMS only** (not all cached items) via `WeirdGloopService.fetchHistoricalPrices` and persists via `bulkInsertHistory`. Capped to ~230 seed items to keep startup under ~60 s since the `/last90d` endpoint only accepts 1 item per request.
6. Re-reads all cached records after health checks, then returns `StoredPriceRecord[]`.

**Seed items** (~230): Curated list of heavily-traded RS3 items including rares, skilling supplies, potions, runes, PvM drops, summoning materials, and alchables. Defined as `SEED_ITEMS` array in `initDataPipeline.ts`. Names must match the canonical RS Wiki titles exactly (the `/last90d` API is case-sensitive and returns `{"success":false}` for unknown items). Common pitfalls cleaned up in March 2026: untradeable items (Overload, Adrenaline potion, charms), mis-named items ("h'ween" → "hallowe'en", "Banite bar" → "Bane bar"), clean herbs require "Clean " prefix (not bare herb name), "Bow string" → "Bowstring", case-sensitive "Dragon Rider lance" (capital R).

**`runFullMarketScan(catalogue, onProgress?, signal?, deepHistory?)`**: Non-blocking background scan of all ~7,000 items in batches of 100 with **adaptive inter-batch delay** (1 500 ms baseline). Consecutive empty batches double the delay up to a 30 s ceiling; delay resets to 1 500 ms on a successful batch. Fetches latest prices + buy limits + high alch values per batch, bulk-inserts into IndexedDB immediately (resume-safe). History is **only** fetched when `deepHistory=true` (90-day per item via individual `/last90d` requests — significantly slower). When `deepHistory=false` (default), history is loaded on demand when the user opens the analytics modal. **History-only optimisation**: if `deepHistory` is requested and ≥ 90% of the catalogue already has prices fetched within the last hour, the scan skips price/enrichment entirely and only fetches history. Supports `AbortSignal` for user cancellation. Progress callback `(done, total)` drives the UI progress bar.

**`fetchGECatalogue()`**: Fetches the full RS Wiki `Module:GEIDs/data.json` (~7,000 GE-tradeable items, ~215KB). Returns a sorted `GECatalogueEntry[]` used for the market search bar.

### 4.2 Weird Gloop Service (`weirdGloopService.ts`)

- **`fetchWithRetry(url, maxRetries?)`** — private static helper. On HTTP 429 or network `TypeError`, retries up to `MAX_RETRIES` (4) times with exponential backoff: delay = `BACKOFF_BASE_MS` (2 000 ms) × 2^attempt. Non-retryable HTTP errors return `null`.
- **`fetchLatestPrices(itemNames)`** — sequential batch dispatch (one request at a time, 300 ms pause between batches). Each batch uses `fetchWithRetry`. Returns `Map<string, WeirdGloopPriceRecord>`.
- **`fetchHistoricalPrices(itemNames, days)`** — individual per-item requests dispatched **sequentially** with `HISTORY_ITEM_DELAY_MS` (200 ms) pauses. The `/last90d` endpoint only accepts 1 item per request (pipe-delimited batching returns an API error). Each request uses `fetchWithRetry`. Progress logged every 50 items.
- **Static constants**: `MAX_RETRIES = 4`, `BACKOFF_BASE_MS = 2_000`, `HISTORY_ITEM_DELAY_MS = 200`.

### 4.3 Cache Service (`cacheService.ts`)

- IndexedDB wrapper. Database: `ge-analyzer-cache`, version 3.
- **Two object stores**:
  - `prices` — keyPath: `name`, index on `fetchedAt`. Current snapshot of each item.
  - `price-history` — compound keyPath: `[name, timestamp]`. Multiple records per item per day for intraday OHLC tracking. Indexes: `name`, `timestamp`.
- **DB migration (v2→3)**: The `open()` method detects the old `[name, day]`-keyed history store, deletes it, and recreates it with the `[name, timestamp]` keyPath. Data is re-populated on next scan/fetch.
- Key methods: `open()`, `bulkInsert(prices)`, `getAll()`, `getRecentHistory(days)`, `getHistoricalRecords()`, `getIntradayRecords(itemName, windowMs)`, `isStale()`, `clear()`.
- `bulkInsert` writes to both stores in a single read-write transaction. Each call inserts a unique snapshot keyed by `Date.now()` epoch ms.
- `getIntradayRecords(itemName, windowMs)` — queries the `name` index and filters by timestamp within the window. Used for OHLC aggregation and 4-hour momentum.
- `isStale()` opens a descending cursor on the `fetchedAt` index, checks if newest record > 1h TTL (reduced from 24h to react to intraday volatility).

### 4.4 Market Analyzer Service (`marketAnalyzerService.ts`)

Pure math on local data with one network fallback — when the local IndexedDB price-history store is sparse (fewer than 400 items have ≥ 2 days of multi-day history), `buildPriceHistoryMap()` delegates to `WeirdGloopService.fetchHistoricalPrices` (individual per-item requests with 200 ms pauses) and persists results to IndexedDB. The threshold uses an absolute count (not a ratio) because `bulkInsert` writes a today-snapshot for every price record — after a full market scan all ~7,000 items have ≥ 1 history row, making percentage thresholds unreachable. After seeds (~230) + one fallback round (200) the count exceeds 400 and subsequent startups skip the ~40 s API call. Capped at 200 items since the `/last90d` API only accepts 1 item per request.

**TTL-cached scoring maps**: `getOrBuildMaps(days)` maintains in-memory caches of `avgVolumeMap` and `priceHistoryMap` with a 10-minute TTL (`MAP_CACHE_TTL_MS`). All three public entry points (`getTopItems`, `searchItems`, `getItemsByNames`) call `getOrBuildMaps(30)` instead of rebuilding maps from IndexedDB each time. `invalidateMapCache()` clears both maps manually; in practice this is rarely needed since all major data-update paths (full scan, force reload, retry) construct a new `MarketAnalyzerService` instance.

Pipeline:
1. Reads all cached records from `CacheService.getAll()`.
2. Builds 7-day average volume map and price history map from the `price-history` store (or returns cached versions if within TTL). With the v3 intraday schema, deduplicates by calendar day (max volume per day for SMA, latest price per day for sparklines).
3. Scores each item via `scoreAndFilter()`:
   - `tradedValue = price × volume`
   - `recBuyPrice = floor(price × 0.99)` — 1% below market (realistic instant-buy entry)
   - `recSellPrice = ceil(price × 1.03)` — 3% above market (target exit)
   - `estFlipProfit = recSellPrice - recBuyPrice - floor(recSellPrice × 0.02)` — ~2% net margin after 2% GE tax
   - `effectivePlayerVolume = min(volume, buyLimit × 6)` — caps at what one player can trade per day
   - `taxGap = ceil(price / 0.98) - price` — minimum spread to break even after tax
   - `volumeSpikeMultiplier` — ratio of today's volume to 7-day SMA (hype detection at >1.5×)
   - `tradeVelocity` — categorical speed label based on volume × buy-limit throughput: `"Insta-Flip"` (>50 K), `"Active"` (>5 K), `"Slow"` (>500), `"Very Slow"` (≤500)
   - `priceTrend` — 7-day price momentum: `"Downtrend"` (dropped >5 %), `"Uptrend"` (risen >5 %), `"Stable"` (within ±5 %). Empty/short history defaults to Stable.
   - `fourHourMomentum` — percentage change between the current price and the earliest price in the last 4-hour buy-limit window. Uses `getIntradayOHLC()` which queries `CacheService.getIntradayRecords()`.
   - `isRisky = price < 500` — low-price items where tax eats most spreads
4. Filters items by `minVolume`, `maxVolume` (against **global daily GE volume**), `maxPrice`.
5. Sorts descending by `tradedValue`.
6. Slices to top-N (default 20).

**Key methods**:
- `getTopItems(overrides?)` — full pipeline with optional `Partial<MarketAnalyzerConfig>` runtime filter overrides.
- `searchItems(query)` — filters cache by name substring, scores with no vol/price filters, returns top 50.
- `getItemsByNames(names: Set<string>)` — looks up specific items by exact name set, used by the favourites panel.
- `getOrBuildMaps(days)` — returns cached `avgVolumeMap` + `priceHistoryMap` if within 10-min TTL, otherwise rebuilds from IndexedDB.
- `invalidateMapCache()` — clears cached maps (auto-reset when a new instance is constructed).
- `formatForLLM(items)` — produces a numbered multi-line string with K/M/B/T abbreviations for LLM context injection. Now includes High Alch value, Trade Velocity tier, and `[LIMITED DATA]` tag when < 3 history points.
- `getFormattedForLLM()` — returns the top 50 items by traded value with **no volume or price filters** (`LLM_CONTEXT_TOP_N = 50`), using a compact label-free format (`formatForLLMCompact`) to minimise payload size. Used by the chat advisor to get a broader market view than the UI's filtered top-20 panel. ≈ 6–8 KB of text.

### 4.5 Wiki Service (`wikiService.ts`)

**Structured data APIs only** (guide/article text fetching removed March 2026 — `coreKnowledge.ts` replaces wiki prose for LLM context):

- **Buy limit fetching**: `getBulkBuyLimits(names)` reads `Module:Exchange/<Item>` Lua source via the revisions API, extracts `limit = <n>`. Batched ≤ 50 titles per request, concurrent via `Promise.allSettled`.
- **High Alch value fetching**: `getBulkHighAlchValues(names)` — **primary source**: single HTTP request to `Module:GEHighAlchs/data.json?action=raw` which returns all alchable items and their values as a flat `{ itemName: number }` JSON. Items present = alchable (value stored as `number`); items absent = not alchable (stored as `highAlch: false`). **Fallback**: per-item `Module:Exchange/<Item>` Lua source parsing (prefers `alchvalue`, falls back to `floor(value × 0.6)`, skips `alchable = false`).

### 4.6 Core Knowledge Base (`coreKnowledge.ts`)

Static RS3 economic rules and data interpretation guidance injected into every LLM system prompt. Exported as `RS3_ECONOMIC_RULES` and `DATA_FIELD_LEGEND` string constants.

**`RS3_ECONOMIC_RULES`** (8 rules):
1. **GE Tax**: 2% tax formula with floor rounding, exempt at ≤50 gp.
2. **Buy Limits**: 4-hour windows, 6 per day, hard cap on purchases.
3. **Margin Checking**: Insta-buy (+5%) / insta-sell (−5%) method with tax-adjusted margin formula.
4. **High Alchemy**: `floor(value × 0.6)` acts as price floor; explains economic anchor.
5. **Item Categories**: Consumables, skilling supplies, equipment, rares, alchables — typical behaviour and margins for each.
6. **What Makes a Good Flip**: Profit × buy limit, trade velocity, margin vs tax gap, trend safety, volume spike interpretation.
7. **GP/HR Calculation**: Formula and fill-time estimates by trade velocity tier (Insta-Flip, Active, Slow, Very Slow).
8. **Common Pitfalls**: Low-price tax erosion, insufficient-data misinterpretation (slope ±0.0 + volatility 0%), merch clan spikes, DXP timing.

**`DATA_FIELD_LEGEND`**: Explains every field in the `formatForLLM` output (GE Price, Buy/Sell targets, Profit, Limit, Eff. Vol, Max 4H Capital, Tax Gap, High Alch, Velocity, 30d Trend Slope, Volatility, Predicted 24h Price, RISKY flag, Vol Spike). Included in the system prompt so the LLM correctly interprets metrics — especially the "slope ±0.0 + volatility 0% = insufficient data" case that previously caused contradictory advice.

Both constants have a **supremacy clause** in the system prompt — they override any outside knowledge the model may have.

### 4.7 LLM Service (`llmService.ts`)

- Default endpoint: `https://api.groq.com/openai/v1/chat/completions`
- Default model: `llama-3.1-8b-instant`, temperature 0.4, max_tokens 1024.
- Constructor: `Partial<LLMConfig>` — all fields optional (defaults to Groq free tier). API key may be omitted for self-hosted models.
- Authorization header is **conditionally included** only when `apiKey` is non-empty (supports keyless self-hosted models like Ollama / LM Studio).
- **Multi-turn chat**: Maintains conversation history across sends. History is persisted to localStorage (`ge-analyzer:chat-history`, max 50 messages). Clear button resets history.
- `generateAdvice(query, marketData)` builds:
  - **System prompt**: RS3 GE flipping specialist persona + 10 numbered rules (anti-hallucination, analytical reasoning framework, data interpretation) + `RS3_ECONOMIC_RULES` (8 economic laws) + `DATA_FIELD_LEGEND` (field-by-field explanation of market data format) from `coreKnowledge.ts` with supremacy clause. Instructs the LLM to rank recommendations by gp/hr, include actionable buy/sell prices, and correctly handle insufficient-data cases (slope ±0.0 + volatility 0%).
  - **User message**: Two delimited sections: `=== GRAND EXCHANGE DATA ===`, `=== PLAYER QUESTION ===`.
- **Conversation trimming** (`buildTrimmedHistory()`): Before each API call, builds a size-efficient copy of the message history. Strips the bulky `=== GRAND EXCHANGE DATA ===` block from **all user messages except the most recent one**, retaining only the `=== PLAYER QUESTION ===` section. Also caps the conversation to `MAX_HISTORY_PAIRS` (8) user+assistant exchanges on top of the system prompt. This prevents HTTP 413 (Content Too Large) errors that previously occurred after 3–4 multi-turn exchanges with Groq.
- **Payload size guard**: After building the JSON body, `generateAdvice()` checks the byte length against `MAX_BODY_BYTES` (50 KB). Progressive trimming halves market-data lines in the most recent user message (up to 4 attempts). Always-on payload byte logging on every request. Groq's gateway returns 413 above ~100 KB.
- Error handling: `LLMRequestError` class with `status` and `responseBody`. Descriptive messages for 401/403/413/429/5xx.

### 4.8 LLM Provider System (`types.ts`)

The settings panel supports **6 LLM providers** via the `LLM_PROVIDERS` constant array:

| Provider | Endpoint | Default Model | Key Hint | Cost Tier |
|----------|----------|---------------|----------|-----------|
| **Groq** (default) | `api.groq.com/openai/v1/chat/completions` | `llama-3.1-8b-instant` | `gsk_…` | ✅ FREE |
| **OpenAI** | `api.openai.com/v1/chat/completions` | `gpt-4o-mini` | `sk-…` | 💳 Paid |
| **OpenRouter** | `openrouter.ai/api/v1/chat/completions` | `meta-llama/llama-3-8b-instruct` | `sk-or-…` | 🆓 Free Tier |
| **Together AI** | `api.together.xyz/v1/chat/completions` | `meta-llama/Llama-3-8b-chat-hf` | `tok_…` | 🆓 Free Tier |
| **Mistral AI** | `api.mistral.ai/v1/chat/completions` | `mistral-small-latest` | `mis_…` | 💲 Low Cost |
| **Custom / Self-hosted** | (user-supplied) | (user-supplied) | (optional) | 🖥️ Self-hosted |

Each provider includes:
- A curated `models` array of `ModelOption` objects with `id`, `label`, and optional `recommended` flag. The UI renders these as a searchable datalist. Users can also type any arbitrary model name.
- `costTier` (`ProviderCostTier` union: `"free"` | `"free-tier"` | `"low-cost"` | `"paid"` | `"self-hosted"`) — rendered as an emoji badge next to the provider name in the dropdown and as a colour-coded `#provider-cost-hint` span below it.
- `costNote` — short human-readable description of pricing (e.g. "Generous free tier — no credit card required").
- `signupUrl` (optional) — direct URL to the provider’s API-key page. When present, the `#setup-guide-btn` is visible.

**Setup guide modal** (`showSetupGuide()`): Opens a lazily-created singleton backdrop (`.setup-guide-backdrop`) with:
- Provider-specific step-by-step instructions from the `SETUP_GUIDES` map in `uiService.ts`.
- A coloured cost-tier banner.
- A direct “Open API Keys page” link.
- A comparison table of all non-custom providers with cost badges.
- Closes on backdrop click or Escape key.

### 4.9 Portfolio Service (`portfolioService.ts`)

Manages active flips **and** completed flip history:

**Active flips** — localStorage key `ge-analyzer:portfolio`:
- `addFlip(itemName, buyPrice, quantity, targetSellPrice)` — creates a new flip with a unique UUID and timestamp.
- `getFlips()` — returns all active flips sorted by timestamp.
- `removeFlip(id)` — deletes a flip by ID.
- Each flip tracks: `id`, `itemName`, `buyPrice`, `quantity`, `targetSellPrice`, `timestamp`.
- UI renders each flip as a card with buy/sell prices, quantity, projected profit (post-tax), a live buy-limit countdown timer (refreshed every 30s), and a `.flip-card-actions` group containing ✓ "Mark as sold" and ✕ "Remove" buttons side-by-side.

**Completed flips** — localStorage key `ge-analyzer:portfolio-history`:
- `completeFlip(id, actualSellPrice)` — moves an active flip to the completed array. Calculates `realizedProfit = Math.round(actualSellPrice × 0.98 × quantity) − (buyPrice × quantity)` (2% GE tax deducted from sell side). Saves both arrays.
- `getCompletedFlips()` — returns a shallow copy of completed flips, newest first.
- `getPortfolioStats()` — aggregates across all completed flips: `{ totalProfit, totalFlips, avgProfit, avgRoi }`. Avg ROI = total profit ÷ total capital invested.

**Completed flips UI** (March 2026 usability update):
- Rendered as a `<table class="completed-flips-table">` with sortable column headers (Date, Item, Profit, ROI). Click a header to toggle ascending/descending. Sort state tracked by module-scoped `completedFlipsSortCol` / `completedFlipsSortAsc`.
- `#completed-flips-filter` text input above the table filters by item name or profit value.
- `#export-csv-btn` generates a CSV download of all completed flips (Item, Buy Price, Qty, Sell Price, Realised Profit, Date) via data URL.

**Portfolio sub-navigation** (HTML + CSS):
- Two toggle buttons: "Active Flips" / "History & Stats". Switching to history calls `renderCompletedFlips()` + `renderPortfolioStats()`.
- **Stats dashboard**: 4 `.stat-card` elements — Total Profit, Completed Flips, Avg Profit, Avg ROI. Values colour-coded green (profit) / red (loss).
- **Completed flip cards**: `.completed-flips-table` (sortable `<table>`) replaced the original `.completed-flip-card` elements. Columns: Date, Item, Profit, ROI. Row classes `.win`/`.loss` drive left-border colour. Table headers are click-sortable with sort arrows.

### 4.10 UI Service (`uiService.ts`)

All DOM manipulation isolated here — services remain UI-agnostic. ~4 634 lines.

`initUI()` flow:
1. Resolves all DOM elements by ID (~50 refs, throws if missing).
2. Populates provider dropdown from `LLM_PROVIDERS`.
3. Restores all settings from `localStorage` (provider, model, endpoint, API key, view mode, compact-tiles, layout).
4. Binds all events: settings, chat, view toggle, market filters, force reload, layout toggle, tab navigation, clear chat, portfolio, favourites collapse, Top 20 collapse.
5. Creates `CacheService` + `MarketAnalyzerService` + `WikiService` + `PortfolioService` singletons.
6. Runs `refreshMarketPanel()` → renders market items in the current view mode.
7. Renders the favourites panel (if any favourites exist).
8. Builds the full item catalogue for portfolio autocomplete.
9. Fetches the full GE catalogue (~7,000 items) for market search.
10. Restores any persisted LLM chat conversation.
11. Renders any persisted portfolio flips and starts the countdown timer.

**Layout modes**: Tabbed (default) or Sidebar — toggled via buttons, persisted in localStorage (`ge-analyzer:layout`).
- **Tabbed**: Three tabs — Market Data, Ask Advisor, Portfolio. One visible at a time.
- **Sidebar**: All three sections visible side-by-side.

**Market panel rendering**:
- Three **view modes**: List (☰), Tile (▦), Hybrid (⊞) — toggled via buttons, persisted in localStorage (`ge-analyzer:view-mode`). An optional **Compact Tiles** checkbox (`ge-analyzer:compact-tiles`) hides predictive badges in tile/hybrid views for cleaner scanning.
- `setViewMode(mode)` — updates active button styling and CSS class on market-items, search-results, and favourites-items containers.
- `buildItemCard(item)` — creates a market card element with:
  - Jagex sprite, item name, price
  - Flip recommendation badges: Buy ≤, Sell ≥, profit/ea
  - Trade velocity badge (Insta-Flip / Active / Slow / Very Slow) with explanatory tooltip
  - Hype badge (🔥 Nx Vol) when volume spike > 1.5×
  - **Predictive analytics badges** (March 2026): EMA trend (↑/↓ % vs 30-day EMA), predicted 24h price change (linear regression), daily volatility %. Shown in a `.predictive-badges` wrapper after the momentum badges. Hidden via `.compact-hidden` in tile/hybrid view when compact mode is enabled; always visible in list view.
  - **Analytics button** (↗) — opens the unified analytics modal combining item details (badges, recommendations, alerts, actions) with an interactive price chart, trend stats, and an **inline range selector** (7/30/90 days) that syncs with the global `#history-range-select`. Uses **on-demand history** (`ensureItemHistory`): checks IndexedDB cache first, fetches from API if < 7 data points, persists via `bulkInsertHistory`, then renders.
  - External links: Wiki and GE Database
  - Expandable detail panel (13 rows with tooltips: GE price, rec buy/sell, flip profit, high alch, tax gap, margin, volumes, buy limit, capital, volume spike)
  - **Action button group** (`.card-actions`): Analytics (↗), Favourite (☆/★), Alert (🔔), Quick-add to portfolio (+), Wiki, GE
- Multiple cards can be expanded simultaneously.
- Sprites loaded from `https://secure.runescape.com/m=itemdb_rs/obj_sprite.gif?id={itemId}`. Each sprite `<img>` has a `title` tooltip showing the item ID.

**Unified analytics modal** (March 2026):
- `showAnalyticsModal(item)` — opens a single scrollable centred overlay combining item details and interactive price chart.
- Replaces the old separate `showItemModal` + `showGraphModal` pair (both deprecated but retained in code).
- Contains: sprite (48×42, title tooltip with item ID), name (h2), current price, close button (✕), badges (velocity, hype, trend), action buttons (favourite, quick-add, Wiki, GE links), detail rows reordered as flip/profit metrics first then volume/liquidity metrics (includes High Alch value, always-visible Volume Spike showing "Normal" when ≤1.5×, and a "Predictive Analytics" sub-section with 30d EMA, Daily Volatility σ%, LR Slope, Predicted Price), **price alert inputs** (buy/sell thresholds), interactive price chart with range selector (7/30/90 days), stats grid (trend, change, high, low, volatility, data points), and manual refresh button for sparse history.
- Lazy singleton — created once via `ensureAnalyticsModal()`, reused for all items.
- Closes on backdrop click, ✕ button, or Escape key.
- Keyboard accessible: `role="dialog"`, `aria-modal="true"`, focus trapped to close button on open.
- Responsive: `90vw` width (max 920 px, min 320 px), two-column detail grid at ≥ 480 px, reduced padding/font on mobile (≤ 600 px). Detail rows use `flex-wrap` + `overflow-wrap: anywhere` on narrow viewports so long values don’t break character-by-character.

**Price alert system**:
- **Inline card popover**: Each card has a 🔔 bell button in `.card-actions` that toggles a `.card-alert-popover` with compact Buy ≤ / Sell ≥ number inputs. Only one popover is open at a time per item list. Bell glows gold (`.alert-active`) when thresholds are set.
- **Modal inputs**: Two number inputs in the unified analytics modal ("Alert if drops below" / "Alert if rises above") — same data, just a larger editing surface.
- Values are saved to the `FavoriteItem.targetBuy` / `targetSell` fields (setting an alert auto-favourites the item).
- `checkPriceAlerts(items)` runs on every `refreshMarketPanel()` against all cached items.
- Alerts fire both a DOM toast (`#toast-container`, fixed top-right, auto-dismiss after 6 s) and a native browser `Notification` (if permission granted).
- **Dedup**: `firedAlerts` Set (module-scoped, session-lifetime) prevents the same item+direction from alerting more than once per session.
- Notification permission is requested once during `initUI()`.

**Favourites system**:
- Persisted as a JSON array of `FavoriteItem` objects in localStorage (`ge-analyzer:favorites`). Each entry has `name` and optional `targetBuy` / `targetSell` alert thresholds.
- **Legacy migration**: Old `string[]` format auto-converts to `FavoriteItem[]` on first load via `loadFavorites()`.
- `getFavorites()` returns a `Set<string>` of names for quick membership checks. `toggleFavorite(name)` / `setFavoriteAlerts(name, targetBuy?, targetSell?)` modify the underlying array.
- Star button (☆/★) on every card header and in the analytics modal header.
- Favourited cards get a `.favorited` class with a gold left border.
- **Favourites panel** (`#favorites-section`): appears between the search bar and Top 20, auto-hides when empty. Collapsible via ▾/▸ button in the header. Has its own sort dropdown (`#favorites-sort-select`) persisted to `ge-analyzer:fav-sort`.
- `renderFavorites()` — calls `analyzer.getItemsByNames(favNames)`, sorts by the favourites sort dropdown, renders cards into `#favorites-items` container. Re-renders on every favourite toggle.
- Respects the current view mode (list/tile/hybrid).

**Quick-add to portfolio**:
- `+` button on every card header and in the modal header.
- Switches to the portfolio tab, pre-fills the flip form (item name, recommended buy price, recommended sell price), focuses the quantity input.
- Uses `suppressAutocomplete` flag to prevent the portfolio search dropdown from opening during programmatic form fill. Resets via `requestAnimationFrame`.

**Full GE catalogue search** (`#search-section`):
- Search input at the top of the market view with a per-section sort dropdown (`#search-sort-select`), view toggle buttons (☰/▦/⊞), and compact-tiles checkbox. Debounced 300ms.
- Searches the full ~7,000 item GE catalogue (`Module:GEIDs/data.json`) client-side.
- Items not in cache: fetches prices from Weird Gloop API, buy limits from wiki Cargo API, enriches and inserts into IndexedDB — then scores and renders.
- Results render into `#search-results` (separate container above Top 20, never replaces it).
- Empty search clears results (`:empty` CSS hides the container).

**Portfolio autocomplete**:
- Item name input has full autocomplete dropdown.
- Focus/empty shows recommended items from `latestTopItems` first, then all cached items.
- Typing filters by case-insensitive substring with recommended matches pinned to top.
- Arrow keys navigate, Enter selects, Escape closes.
- `selectSuggestion(name, price)` fills item name + buy price, focuses quantity.

**Collapsible sections**:
- **Favourites**: ▾/▸ toggle in the section header hides/shows `#favorites-items`.
- **Top 20**: ▾/▸ toggle in the header hides/shows `#market-items`.

**Per-section sorting**:
- Each section (Top 20, Search Results, Favourites) has its own sort `<select>` with options: Default, A–Z, Price ↓, Profit ↓.
- Sort preference persisted to localStorage per section (`ge-analyzer:top20-sort`, `ge-analyzer:search-sort`, `ge-analyzer:fav-sort`).
- Shared `applySortOrder(items, sortKey)` helper sorts in place.

**Error recovery**:
- `showError(msg)` / `hideError()` control a fixed `#error-banner` at the top of the market view.
- Retry button re-runs `refreshMarketPanel()`.
- All pipeline and rendering paths wrapped in try/catch with user-facing error messages.

**Dynamic market filters**:
- `readFilterConfig()` — translates dropdown values into `{ minVolume, maxVolume, maxPrice }` overrides.
- Volume filter options: Any Volume, High Volume (>50K), Low Volume (<5K), Custom (slider controls). Volume presets filter on **global GE daily volume** (not effectivePlayerVolume) so Low/High meaningfully distinguish market liquidity tiers.
- Price filter options: Unlimited, Under 10M, Under 100M, Under 500M, Custom (slider control).
- Custom volume: Min/max sliders with synced text inputs.
- Custom budget: Max price slider with synced text input.

**Chat flow** (`handleSend`):
1. Validates input text + API key presence.
2. Appends user message bubble → clears input → locks input.
3. Shows "Thinking" animated indicator.
4. Creates `LLMService` via `resolvedLLMConfig()` which reads current provider/model/endpoint/key from localStorage.
5. Calls `generateAdvice(query, latestLLMContext || latestMarketSummary)`.
6. Removes thinking indicator → appends assistant response bubble.
7. Catches `LLMRequestError` with user-friendly messages per status code.
8. Unlocks input, scrolls chat to bottom.

**Force reload**: Button in settings that clears IndexedDB cache, re-runs the full data pipeline, and refreshes the market panel. Shows status indicator.

**Module-scoped state**: `latestMarketSummary`, `latestLLMContext`, `latestTopItems`, `latestSearchResults`, `allCachedItems`, `geCatalogue`, `currentView`, `llm`, `portfolio`, `favoritesCollapsed`, `top20Collapsed`, `isSearchActive`, `suppressAutocomplete`, `firedAlerts`, `toastContainer`.

### 4.11 Entry Point (`index.ts`)

Lean orchestrator (~80 lines) with startup overlay management:
1. Imports `alt1`, static assets (`appconfig.json`, `icon.png`), `css/main.css` (modular CSS entry point).
2. **Early theme restoration** — reads all four theme axes (`ge-analyzer:mode`, `ge-analyzer:style`, `ge-analyzer:colorway`, `ge-analyzer:contrast`) from localStorage, runs one-time colorway rename migration (gated by `ge-analyzer:colorway-v2`), and applies them to `document.body.dataset` immediately (single synchronous batch write via `applyThemeBatch()`), so the startup overlay renders with the user's chosen theme.
3. Detects `window.alt1` — if present, calls `alt1.identifyAppUrl()`; if absent, shows "add app" link.
4. Shows `#startup-overlay` and calls `setStartupStatus(msg, step?)` to update status + step counter (e.g. "Step 1 of 4").
5. Calls `await initDataPipeline()` (Step 1/4: "Loading market data…").
6. Calls `await initUI(onStatus)` — `onStatus` callback drives Steps 2–4 (Ranking → Favourites → Catalogue).
7. `dismissOverlay()` fades and removes the overlay after boot completes.

### 4.12 HTML Structure (`index.html`)

- `#alt1-status` — Alt1 detection banner (hidden when empty via CSS).
- `#app` — flex column shell:
  - `<details id="settings-panel">` — collapsible settings:
    - Layout toggle: Tabbed / Sidebar.
    - Provider `<select id="provider-select">`.
    - Custom endpoint `<div id="custom-endpoint-group">` (hidden unless provider is `custom`).
    - Model `<input id="model-input">` with `<datalist id="model-options">`.
    - API key `<input type="password">` + Save button + status hint.
    - Force Reload Data button + status hint.
    - **Data Management** section: Export Data / Import Data buttons + hidden `<input type="file" id="import-file-input" accept=".json">`.
  - `<nav id="view-tabs">` — tab buttons: Market Data, Ask Advisor, Portfolio.
  - `<main id="app-content">`:
    - `<section id="market-view">`:
      - `#background-sync-progress` — scan progress bar (hidden by default, relocated to top of market view).
      - `#error-banner` — dismissible error banner with retry button (hidden by default).
      - `#market-filters` — volume / price dropdowns + refresh button (above the search bar).
      - `#volume-custom-group` and `#budget-custom-group` — themed slider controls (hidden by default).
      - `#search-section` — search input + `#search-sort-select` + view toggle buttons (☰/▦/⊞) + compact-tiles checkbox + loading indicator + `#search-results`.
      - `#favorites-section` (`.favorites-section`) — header with ★ Favourites title + `#favorites-sort-select` + collapse button, `#favorites-items` container.
      - `.top20-section` wrapper:
        - `#market-header` — "Top 20 Markets" h2 + `.market-header-actions` (`#full-market-scan-btn` + `#deep-history-checkbox` + `#top20-sort-select` + collapse ▾ button).
        - `#market-loading` + `#market-items`.
    - `<section id="advisor-view">` — h2 "Ask the Advisor" + clear button + `#chat-history` + `#chat-input-row`.
    - `<section id="portfolio-view">` — h2 "Active Portfolio" + `#portfolio-sub-nav` (Active Flips / History & Stats toggle):
      - `#portfolio-active-container` — add-flip form (autocomplete name input, buy/qty/sell fields, add button) + `#active-flips-list`.
      - `#portfolio-history-container` (hidden by default) — `#portfolio-stats` dashboard (4 `.stat-card`: Total Profit, Completed Flips, Avg Profit, Avg ROI) + `#completed-flips-list`.
- `HtmlWebpackPlugin` injects the script tag automatically — no manual `<script>` tag in HTML.

### 4.13 Stylesheet (`css/main.css`)

The monolithic `style.css` has been refactored into a modular `src/css/` directory. The entry point `css/main.css` uses `@import` to compose 57 sub-modules in cascade order. Webpack's `css-loader` resolves all imports; `style-loader` injects the result into `<head>` at runtime. No PostCSS or additional tooling required.

```
css/
├── main.css                         # @import cascade entry point
├── base/                            # reset.css, alt1-status.css
├── themes/                          # 16 colorway-{name}-{dark|light}.css + light-mode-overrides.css + contrast-modifiers.css
├── styles/                          # style-glassmorphism/neumorphism/skeuomorphism.css + micro-component-protection.css
├── layout/                          # app-shell.css, main-content.css, layout-modes.css, views.css, responsive.css
└── components/                      # 28 files: settings, provider, inputs, tabs, market-panel, filters, startup, market-cards, highlights, search, search-filters, detail-panel, card-actions, favourites, modals, analytics-modal, analytics-dividers, chat, portfolio, predictive-badges, completed-flips, scrollbar, toasts, alerts, accessibility, settings-fieldsets, layout-toggle, back-to-top
```

- **Four-axis theme system** (Mode × Style × Colorway × Contrast) using CSS custom properties — 2 modes × 4 styles × 8 colorways × 3 contrast levels = 192 combinations:
  - **Modes** (`body[data-mode]`) set the fundamental light/dark tone:
    - **Dark** (default) — dark backgrounds, light text.
    - **Light** (`body[data-mode="light"]`) — light backgrounds, dark text.
  - **Styles** (`body[data-style]`) define structural effects:
    - **Basic** (default — no `data-style` attribute) — standard flat UI.
    - **Glassmorphism** (`body[data-style="glass"]`) — frosted glass panels via `backdrop-filter: blur(18px) saturate(1.2)`, highly translucent rgba backgrounds, crisp semi-transparent borders. Covers cards, sections, modals, flip cards, settings groups, tabs. Modal overlays use stronger 24 px blur.
    - **Neumorphism** (`body[data-style="neumorphism"]`) — elements share the canvas `--bg-main` background colour; shape conveyed entirely by paired `box-shadow` (one light, one dark) — outset = extruded, inset = indented. All visible borders set to `transparent`. Covers cards, sections, settings panel/groups, flip cards, inputs (inset wells), buttons (raised pillows), modals. Extra tile spacing for shadow breathing room.
    - **Skeuomorphism** (`body[data-style="skeuomorphism"]`) — tactile realism: `linear-gradient` backgrounds for material texture, inner `box-shadow` for beveled edges, drop shadows for physical depth. Top border = highlight (light edge), bottom border = shadow edge. Covers cards, sections, settings, flip cards, buttons (with `:active` pressed state), inputs (carved inset fields), modals (heavy realistic frame). Light modes use softer shadow intensities.
  - **Colorways** (`body[data-colorway]`) define colour palettes + style helper vars (`--glass-*`, `--neu-*`, `--skeu-*`):
    - **Default** (default `:root`) — dark: `#1e1e1e` background; light: `#f5f5f5` background.
    - **Classic** (`body[data-colorway="classic"]`) — dark: parchment tones, brown accents; light: warm cream, earthy tones. (Formerly "OSRS".)
    - **RS3 Modern** (`body[data-colorway="rs3-modern"]`) — dark: dark navy, blue accents; light: light slate, blue highlights.
    - **Solarized** (`body[data-colorway="solarized"]`) — dark: Ethan Schoonover’s dark palette (#002b36 base); light: warm cream (#fdf6e3 base).
    - **RS Lobby** (`body[data-colorway="rs-lobby"]`) — inspired by the RuneScape in-game lobby UI. Dark: deep parchment browns (#1a140f base), gold accents; light: warm cream parchment (#f2ece2 base), earthy gold tones. A blend of Classic and RS3 Modern aesthetics.
    - **Gruvbox** (`body[data-colorway="gruvbox"]`) — morhetz/gruvbox "retro groove" palette. Dark: warm earthy tone (#282828 base), pastel accents (yellow #fabd2f, aqua #8ec07c, orange #fe8019); light: warm cream (#fbf1c7 base), muted accent counterparts.
    - **Twilight Amethyst** (`body[data-colorway="twilight-amethyst"]`) — deep indigo-violet palette. Dark: rich purple (#12101e base), lavender text (#cdc5e0), amethyst primary (#7c4dff); light: soft lilac (#f0ecfa base), deep violet text (#3a2e5a), amethyst accents. Glass helpers use purple-tinted translucent panels.
    - **OSRS Design** (`body[data-colorway="osrs-design"]`) — based on the official OSRS Design System (osrs.design). Dark: earthy brown (#2e2c29 base), gold text (#ffcf3f), yellow heading (#e6a519), cyan accent (#00ffff); light: warm parchment, dark brown text, gold accents. Captures the authentic Old School RuneScape interface palette.
  - **Contrast** (`body[data-contrast]`) adjusts intensity via non-circular `color-mix(in srgb, ...)` — each property override references only sibling properties (strict DAG, no self-referencing to avoid `guaranteed-invalid` cycles). Financial accent adjustments in hard contrast reference `*-base` duplicate vars (e.g. `--accent-teal-base`) set by each colorway, so the `color-mix()` never self-references the property being set. Selectors use specificity 0,3,1 (`body[data-mode][data-contrast][data-colorway]`) to reliably override colorway selectors (0,2,1), preventing stale cached `color-mix()` values when switching themes:
    - **Normal** — no adjustment.
    - **Soft** — reduces contrast (muted backgrounds, softer text). Dark: lifts `--bg-main` toward `--bg-panel`/`--bg-elevated`; light: pushes bgs toward white.
    - **Hard** — increases contrast (deeper backgrounds, brighter text). Dark: pushes bgs toward black, `--text-bright: #fff`; light: `--bg-panel: #fff`, `--text-bright: #000`. Financial accent colours (`--accent-green`, `--accent-teal`, `--accent-red`, `--accent-blue-text`, `--accent-gold`) are adjusted via `color-mix()` referencing `*-base` vars to maintain WCAG AA ≥ 4.5:1 against shifted backgrounds.
  - CSS selectors use compound form: `body[data-mode="dark"][data-colorway="classic"]`.
  - Legacy `ge-analyzer:theme` auto-migrates to `ge-analyzer:style` + `ge-analyzer:colorway`.
  - Legacy colorway values (`light`, `sol-dark`, `sol-light`) auto-migrate via `migrateColorwayToMode()` to mode + colorway pairs.
  - Renamed colorway values (`classic`→`default`, `osrs`→`classic`) auto-migrate once via `migrateColorwayRename()`, gated by `ge-analyzer:colorway-v2` flag.
- Font stack: Segoe UI / Consolas.
- `html` and `body` both `width: 100%; height: 100%`.
- **CSS custom-property alias tokens**: `:root` defines `--border: var(--border-main)` and `--text: var(--text-main)` as convenience aliases for legacy references. **Do not use `var(--text)` for component text colours** — the alias resolves at `:root` (dark-mode) scope and does not re-resolve when light colorways override `--text-main` on `body`. Always use `var(--text-main)` or `var(--text-bright)` directly.
- **Semantic badge background tokens**: `:root` defines `--badge-velocity-*-bg` (insta/active/slow/muted), `--badge-trend-*-bg` (up/down), `--badge-tier-*-bg/border` (free/freetier/lowcost/neutral), `--table-active-row-bg`, `--detail-expanded-bg`, `--setup-note-bg`, `--table-hover-bg`, `--predictive-badge-bg`, `--close-hover-bg` (modal close button hover), `--win-glow` / `--loss-glow` (completed flip card background gradients, derived via `color-mix()` from `--accent-green-bright` / `--accent-red-dark`). All have `body[data-mode="light"]` overrides with boosted alpha values (0.18–0.22 for readability on white backgrounds). Badge classes consume these tokens via `var()` — do not hard-code `rgba()` values.
- **`--text-price` standardised to green family**: All 16 colorway×mode combinations use greens (dark: #4ade80–#a0b800; light: #1a8a2a–#5a8a0e). Previously inconsistent (gold in Classic, olive in Solarized) — March 2026 fix.
- **Consolidated light-mode selectors**: All 8 light-mode colorways share a single `body[data-mode="light"] { background: ... }` rule (plus `.view-btn.active { color: #fff }`) instead of 8 duplicate blocks. Similarly, skeuomorphism light-mode selectors are consolidated into `body[data-mode="light"][data-style="skeuomorphism"]` (not enumerated per-colorway).
- **No `!important` on colour overrides**: `.hype-text`, `.buy-highlight`, `.sell-highlight`, `.profit-highlight`, `.risky-text` use doubled-selector specificity (`.market-card .hype-text, .hype-text.hype-text`) instead. Do not reintroduce `!important`.
- **`#app` uses `height: 95%`** (manually set to fix Alt1 zoom-level scaling issues — do NOT change).
- **Market panel**: `flex: 0 1 auto`, `max-height: 30%` in non-tabbed layout.
- **Chat panel**: `flex: 1 1 0`, `min-height: 120px`.
- **Market cards**: `.market-card` base with `.market-card-header` (flex, wrap, gap), expandable `.market-card-detail` (max-height transition).
  - **List view**: Full-width stacked cards.
  - **Tile view**: CSS grid `repeat(auto-fill, minmax(130px, 1fr))`. Column flex-direction on header. Compact badge/sprite sizes. Predictive badges hidden when compact mode is enabled.
  - **Hybrid view**: CSS grid `repeat(auto-fill, minmax(200px, 1fr))`. Predictive badges hidden when compact mode is enabled.
- **Card action buttons** (`.card-actions`): Horizontal flex row containing analytics (`.popout-btn`), favourite (`.fav-btn`), alert (`.alert-btn`), quick-add (`.quick-add-btn`), Wiki link, GE link. Always stays horizontal even in tile view's column layout. **Micro-component protection**: per-style overrides prevent heavy shadows/blurs/gradients from swallowing icon-only buttons — glass suppresses `backdrop-filter`, neumorphism sets `box-shadow: none` (subtle hover only), skeuomorphism flattens to transparent bg (hover highlight).
- **Favourite styling**: `.fav-btn` gold on hover (`#f0c040`), `.market-card.favorited` gets gold left border. `.fav-btn` uses scale(1.15) on hover.
- **Quick-add button**: `.quick-add-btn` teal on hover (`#4ec9b0`).
- **Favourites section**: `.favorites-section` with border, rounded corners, dark header (`#252526`), gold ★ title.
- **Top 20 section**: `.top20-section` with matching border/rounded styling. `#market-header` gets dark header background when inside the section.
- **Unified analytics modal** (March 2026): `.analytics-modal-backdrop` with centred `.analytics-modal` (90vw, max 920px, min 320px). Header with sprite (48×42, title tooltip with item ID), name (h2, `id="analytics-modal-title"`, referenced by `aria-labelledby`), current price, close button (✕). Scrollable `.analytics-content` body contains: `.analytics-badges` (velocity, hype, trend), `.analytics-actions` (favourite, quick-add, Wiki, GE), `.analytics-details-grid` (1fr, becomes 2-col at ≥ 480px; detail rows reordered: flip/profit first, then volume/liquidity; includes High Alch, always-visible Volume Spike, and "Predictive Analytics" sub-section wrapped in `.predictive-section` with `.analytics-section-divider` header, containing 30d EMA, Daily Volatility σ%, LR Slope, Predicted Price), alert inputs section, `.analytics-graph-section` with `.analytics-range-row` (7/30/90 days select), large `<canvas>` (480×140) via `drawGraphChart()`, `.analytics-stats-grid` (auto-fit minmax 140px) of `.analytics-stat-card` elements (trend, change, high, low, volatility, data points), and `.graph-history-status` strip with manual refresh button for sparse data. Lazy singleton (`ensureAnalyticsModal()`). Closes on backdrop click, ✕, or Escape. Responsive: reduced padding/font at ≤ 600px.
- **Floating modal** _(deprecated)_: `.item-modal-backdrop` / `.item-modal` — retained in CSS for backwards compat but no longer created by any active code path.
- **Graph modal** _(deprecated)_: `.graph-modal-backdrop` / `.graph-modal` — retained in CSS for backwards compat but no longer created by any active code path.
- **Flip badges**: `.flip-badges` with flex-wrap. `.buy-badge`, `.sell-badge`, `.profit-badge`, `.hype-badge`. Shared badge base class sets sizing via CSS custom-property tokens (`--badge-font-sm`: 11px, `--badge-font-md`: 12px, `--badge-padding-sm`: 2px 6px, `--badge-padding-md`: 3px 7px, `--badge-radius`, `--badge-font-weight`). Sized for 110–125% Windows DPI scaling. Profit badge visually promoted with `font-weight: 700` and `letter-spacing: 0.02em`. Tile/hybrid views use `--badge-font-sm` / `--badge-padding-sm` instead of hard-coded 9 px. `--accent-hype` is the canonical hype/volume-spike colour token; `--accent-gold-hype` is defined per-colorway but `--accent-hype` is the consumption token used in `var()` references.
- **Portfolio**: `.portfolio-form`, `.autocomplete-wrap`, `.flip-card` with countdown timer styling, `.flip-card-actions` horizontal button group (✓ + ✕).
- **Portfolio sub-nav**: `.portfolio-sub-nav` / `.portfolio-sub-btn` tab-style toggle with blue active border.
- **Portfolio stats dashboard**: `.portfolio-stats` flex row of `.stat-card` elements. `.stat-value.profit` (green) / `.stat-value.loss` (red).
- **Completed flip cards**: `.completed-flip-card` with `.win` (green left border + gradient) and `.loss` (red left border + gradient) variants.
- **Hype indicators**: `.market-card.hype` border glow, `.hype-badge` pulse animation.
- **Trade velocity badges**: `.velocity-badge` with colour variants (`.velocity-insta`, `.velocity-active`, `.velocity-slow`, `.velocity-veryslow`) and explanatory `title` tooltips.
- **Price trend badges**: `.trend-badge` with `.trend-downtrend` (red, "⚠️ Crashing") and `.trend-uptrend` (green, "📈 Rising"). Only shown for non-Stable trends. Renders on both card and modal badges.
- **External links**: `.ext-link` / `.wiki-link` / `.ge-link` on cards and in the analytics modal — open RS Wiki and GE Database pages.
- **Per-section sort selects**: `.section-sort-select` compact dropdown (10 px) in search section, Top 20 header (`.market-header-actions`), and favourites header (`.favorites-header-actions`).
- **Slider theming**: WebKit (`::-webkit-slider-runnable-track`, `::-webkit-slider-thumb`) and Firefox (`::-moz-range-track`, `::-moz-range-thumb`) pseudo-elements styled via `--border-input` / `--accent-primary` custom properties. Hover and focus states included.
- **Error banner**: `#error-banner` — fixed top bar with dismiss and retry buttons (hidden by default, shown via JS).
- **Toast notifications**: `#toast-container` (fixed top-right, z-index 900). `.toast` with `.toast-buy` (teal border) and `.toast-sell` (gold border) variants. Slide-in/fade-out transitions.
- **Alert inputs**: `.alert-inputs` panel in the item modal — two number inputs for buy/sell thresholds, themed via CSS variables.
- **Responsive desktop breakpoint**: `@media (min-width: 800px)` — wider modal (480 px), wider grid columns for tile/hybrid, increased padding on main sections.
- **Mobile breakpoint**: `@media (max-width: 600px)` — analytics modal detail-row flex-wrap/overflow-wrap, smaller scan-btn/sort-select/deep-history text, Top 20 `.market-header-actions` wraps to new line.
- **Sidebar disable breakpoint**: `@media (max-width: 700px)` — sidebar layout reverts to tabbed (all `body[data-layout="sidebar"]` overrides neutralized), Sidebar button hidden.
- **Layout modes**: `body[data-layout="tabbed"]` hides non-active tabs, `body[data-layout="sidebar"]` shows all sections side-by-side (desktop-only, ≥ 701 px).
- Chat bubbles: user (blue `#264f78`), assistant (dark `#333`), system (italic gray), error (red `#3b1a1a`), thinking (animated dots via CSS `@keyframes`).
- Thin dark webkit scrollbar styling.
- **Accessibility enhancements** (March 2026):
  - `:focus-visible` global keyboard focus ring (`outline: 2px solid var(--accent-primary)`) on all interactive elements.
  - `--text-muted` raised to `#94a3b8` (Default Dark) / `#839496` (Sol-dark) for WCAG AA 4.5:1 contrast compliance.
  - Badge minimum font size raised to 10 px (`--badge-font-sm`).
  - Analytics modal has `aria-labelledby="analytics-modal-title"` pointing to the item name heading.
  - Profit/loss indicators use ▲/▼ shape prefixes in addition to colour for colour-blind accessibility.
  - Detail rows have scanline dividers (`border-bottom: 1px solid var(--border-main)`) and uppercase labels for rapid scan readability.
  - Expanded card detail panels have a visible top border and subtle inset background.
  - Predictive Analytics section wrapped in `.predictive-section` with accent left border + `.analytics-section-divider` header.
  - Settings panel organised into three `<fieldset class="settings-group">` groups (Appearance, AI Provider, Data).
  - Search input has `min-width: 140px` for graceful wrapping on narrow Alt1 windows.

---

## 5. localStorage Keys

| Key | Purpose |
|-----|---------|
| `ge-analyzer:llm-api-key` | Bearer token for the selected LLM provider |
| `ge-analyzer:llm-provider` | Selected provider ID (e.g. `groq`, `openai`, `custom`) |
| `ge-analyzer:llm-model` | Model identifier (e.g. `llama-3.1-8b-instant`) |
| `ge-analyzer:llm-endpoint` | Custom endpoint URL (only used when provider is `custom`) |
| `ge-analyzer:view-mode` | Market panel view mode (`list`, `tile`, or `hybrid`) |
| `ge-analyzer:layout` | Interface layout mode (`tabbed` or `sidebar`) |
| `ge-analyzer:style` | Visual style (`basic`, `glass`, `neumorphism`, or `skeuomorphism`) — migrated from legacy `ge-analyzer:theme` |
| `ge-analyzer:colorway` | Colour palette (`default`, `classic`, `rs3-modern`, `rs-lobby`, `gruvbox`, `solarized`, `twilight-amethyst`, or `osrs-design`) — mode-agnostic; combined with `ge-analyzer:mode` for full palette resolution. Legacy values (`light`, `sol-dark`, `sol-light`) auto-migrate via `migrateColorwayToMode()`; renamed values (`classic`→`default`, `osrs`→`classic`) auto-migrate once via `migrateColorwayRename()` (gated by `ge-analyzer:colorway-v2` one-time flag) |
| `ge-analyzer:colorway-v2` | One-time migration flag for colorway rename (`classic`→`default`, `osrs`→`classic`). Value `"1"` means migration has run |
| `ge-analyzer:mode` | Appearance mode (`dark` or `light`) — sets `data-mode` on `<body>` |
| `ge-analyzer:contrast` | Contrast level (`default`, `soft`, or `hard`) — sets `data-contrast` on `<body>`, layered via `color-mix()` |
| `ge-analyzer:top20-sort` | Top 20 section sort key (`default`, `alpha`, `price-desc`, `profit-desc`) |
| `ge-analyzer:search-sort` | Search results sort key |
| `ge-analyzer:fav-sort` | Favourites section sort key |
| `ge-analyzer:chat-history` | Serialised LLM chat conversation (max 50 messages) |
| `ge-analyzer:favorites` | JSON array of `FavoriteItem` objects (`{ name, targetBuy?, targetSell? }`) — auto-migrates from legacy `string[]` |
| `ge-analyzer:portfolio` | Serialised `ActiveFlip[]` portfolio data |
| `ge-analyzer:portfolio-history` | Serialised `CompletedFlip[]` completed flip history |
| `ge-analyzer:deep-history` | Deep-history checkbox state (`"true"` / `"false"`, default false) |
| `ge-analyzer:compact-tiles` | Compact-tiles checkbox state (`"true"` / `"false"`, default false) — hides predictive badges in tile/hybrid views |

---

## 6. Key Types Reference

All defined in `src/services/types.ts`:

| Type | Purpose |
|------|---------|
| `WeirdGloopPriceRecord` | API response shape: `id`, `timestamp`, `price`, `volume`, `buyLimit?`, `highAlch?: number \| false` |
| `WeirdGloopLatestResponse` | `{ [itemName: string]: WeirdGloopPriceRecord }` |
| `StoredPriceRecord` | Extends API record with `name` (keyPath) + `fetchedAt` (TTL) |
| `HistoricalPriceRecord` | Extends `StoredPriceRecord` with `day` (ISO date compat field) + `timestamp` (compound key with `name` since v3) |
| `OHLCData` | Intraday OHLC aggregation: `windowStart`, `open`, `high`, `low`, `close`, `volume`, `count` |
| `RankedItem` | 24 fields: `name`, `itemId`, `price`, `recBuyPrice`, `volume`, `tradedValue`, `buyLimit?`, `effectivePlayerVolume`, `maxCapitalPer4H`, `taxGap`, `recSellPrice`, `estFlipProfit`, `isRisky`, `volumeSpikeMultiplier`, `tradeVelocity`, `priceHistory`, `priceTrend`, `ema30d`, `volatility`, `fourHourMomentum`, `linearSlope`, `predictedNextPrice`, `highAlch?: number \| false` |
| `MarketAnalyzerConfig` | `topN` (20), `minVolume` (0), `maxVolume?`, `maxPrice?` |
| `CacheServiceConfig` | `dbName`, `storeName`, `ttlMs` (default 1h) |
| `WeirdGloopServiceConfig` | `batchSize` (default 100) |
| `GECatalogueEntry` | `name`, `id` — one entry per GE-tradeable item (~7,000 total) |
| `FavoriteItem` | `name`, `targetBuy?`, `targetSell?` — favourited item with optional price-alert thresholds |
| `ActiveFlip` | `id`, `itemName`, `buyPrice`, `quantity`, `targetSellPrice`, `timestamp` |
| `CompletedFlip` | Extends `ActiveFlip` + `actualSellPrice`, `completedAt`, `realizedProfit` |
| `PortfolioStats` | `totalProfit`, `totalFlips`, `avgProfit`, `avgRoi` |
| `WikiSearchResponse` | *Removed (March 2026)* — wiki guide text fetching removed |
| `WikiQueryResponse` | *Removed (March 2026)* |
| `WikiPage` | *Removed (March 2026)* |
| `WikiGuideResult` | *Removed (March 2026)* |
| `ModelOption` | `id`, `label`, `recommended?` — single model entry in a provider |
| `ProviderCostTier` | `"free"` \| `"free-tier"` \| `"low-cost"` \| `"paid"` \| `"self-hosted"` — pricing tier badge |
| `LLMProvider` | `id`, `label`, `endpoint`, `defaultModel`, `keyPlaceholder`, `models`, `costTier`, `costNote`, `signupUrl?` |
| `LLMConfig` | `apiKey`, `endpoint`, `model`, `temperature`, `maxTokens` |
| `ChatMessage` | `role: "system"\|"user"\|"assistant"`, `content` |
| `ChatCompletionRequest` | OpenAI-compatible request body |
| `ChatCompletionResponse` | `id`, `choices`, `usage?` |
| `ChatCompletionChoice` | `index`, `message`, `finish_reason` |

**Exported constants** (from `types.ts` and `coreKnowledge.ts`):
| Constant | Purpose |
|----------|---------|
| `LLM_PROVIDERS` | `readonly LLMProvider[]` — 6 built-in provider presets |
| `RS3_ECONOMIC_RULES` | String constant — RS3 economic laws injected into LLM system prompt |
| `MAX_BODY_BYTES` | `50_000` (in `llmService.ts`) — payload size ceiling for LLM API requests |
| `LLM_CONTEXT_TOP_N` | `50` (in `marketAnalyzerService.ts`) — number of unfiltered top items sent to the LLM advisor |

---

## 7. Build & Serve

```bash
npm run watch          # recommended — webpack --watch, auto-rebuilds on save
npm run build          # one-shot build → dist/ (0 errors expected) — use sparingly
npx serve dist --listen 8080   # local dev server (separate terminal)
npx tsc --noEmit       # type-check only (expect ~11 benign alt1 errors — webpack resolves them)
```

**Webpack config notes**:
- `HtmlWebpackPlugin` handles `index.html` — do NOT add HTML to `asset/resource` rules.
- `style-loader` + `css-loader` handle `.css` imports (injected into `<head>` at runtime). Entry point: `css/main.css` (51 `@import` sub-modules). No PostCSS.
- `ts-loader` compiles TypeScript.
- `asset/resource` for images + JSON (excluding `.data.png` and `.fontmeta.json` which use alt1 loaders).
- Library output: UMD as `window.TestApp`.
- Externals: `sharp`, `canvas`, `electron/common` (node-only alt1 deps).

---

## 8. Current Status

Everything below is **complete and verified** (builds with 0 errors):

- [x] Weird Gloop API service (batched sequential fetching with `fetchWithRetry` exponential backoff)
- [x] IndexedDB cache service v3 (1h TTL, intraday timestamp-keyed history, OHLC support, auto-migration from v2)
- [x] Data pipeline orchestrator (seed list of ~230 items, buy-limit enrichment from wiki)
- [x] Startup health checks — re-enriches missing `highAlch`/`buyLimit` (>50% threshold) and re-seeds sparse history (<30% coverage) on every launch (March 2026)
- [x] Full GE catalogue fetch (~7,000 items from `Module:GEIDs/data.json`)
- [x] Market analyzer service (scoring, filtering, ranking, LLM formatting, runtime overrides)
- [x] Player-centric scoring (effective player volume, max capital per 4h, buy-limit constraints)
- [x] Flip profit formula: buy at 0.99×, sell at 1.03×, ~2% net margin after 2% GE tax
- [x] Volume spike / hype detection (7-day SMA comparison, >1.5× threshold)
- [x] Trade velocity scoring (Insta-Flip / Active / Slow / Very Slow badges with tooltips)
- [x] Price momentum / trend classification (Uptrend / Downtrend / Stable based on 7-day % change, with falling-knife warning badges)
- [x] Unified analytics modal (↗ button on cards → combined item details + interactive price chart + momentum stats + alert inputs + action buttons) — replaces old separate detail & graph modals (March 2026)
- [x] Manual history refresh fallback — analytics modal shows "Insufficient history • Refresh" button when < 7 data points (March 2026)
- [x] Startup loading overlay — spinner + step counter ("Step 1 of 4") + status text covers `#app` until boot completes, fades out on success (March 2026)
- [x] TTL-cached scoring maps — `getOrBuildMaps()` caches `avgVolumeMap` and `priceHistoryMap` in memory with 10-minute TTL; avoids rebuilding from IndexedDB on UI refresh (March 2026)
- [x] Wiki service — structured data only: bulk buy-limit + high alch value fetching from `Module:Exchange/<Item>` Lua sources. Guide/article text fetching removed (March 2026) — `coreKnowledge.ts` provides better flipping-focused LLM context
- [x] LLM service (multi-provider, multi-turn chat, strict anti-hallucination + economic rules prompt)
- [x] Core knowledge base (RS3 economic rules: GE tax, buy limits, margin checking, high alch)
- [x] LLM provider selection UI (6 providers: Groq, OpenAI, OpenRouter, Together AI, Mistral AI, Custom)
- [x] Searchable model dropdown with per-provider curated model lists (★ recommended labels)
- [x] Custom endpoint support for self-hosted models (Ollama, LM Studio, etc.)
- [x] Conditional Authorization header (omitted for keyless self-hosted models)
- [x] Tabbed + Sidebar layout modes (persisted in localStorage)
- [x] Three market view modes: List, Tile, Hybrid (persisted in localStorage)
- [x] Compact tiles toggle — checkbox hides predictive badges in tile/hybrid views for cleaner scanning (persisted in localStorage)
- [x] Market item cards with Jagex sprites, flip badges, expandable detail panels
- [x] Unified analytics modal (centred overlay combining item details, chart, and actions)
- [x] Dynamic market filters: Trading Volume (Any/High/Low/Custom), Max Price (Unlimited/10M/100M/500M/Custom)
- [x] Custom volume/budget slider controls with synced text inputs (themed per style/colorway)
- [x] Market refresh button (re-runs filtering pipeline with current filter config)
- [x] Per-section sort controls (Top 20, Search Results, Favourites each have independent sort dropdowns persisted to localStorage)
- [x] Force Reload Data button (clears cache, re-fetches, re-enriches)
- [x] Full GE catalogue search bar (searches ~7,000 items, on-demand price/buy-limit fetch)
- [x] Full market background scan with progress bar, cancel support, and optional 90-day deep history checkbox (persisted in localStorage)
- [x] Rate-limit retry with exponential backoff (429 / network errors) in `WeirdGloopService`; adaptive inter-batch backoff (1.5 s → 30 s ceiling) in `runFullMarketScan`
- [x] Separate search results section (above Top 20, never replaces it)
- [x] External links on market cards and analytics modal (RS Wiki + GE Database)
- [x] Favourites system (star toggle on cards + modal, localStorage persistence, dedicated panel with collapse + per-section sort)
- [x] Price alert system (per-item buy/sell thresholds on favourites, native Notification API + DOM toast notifications, session dedup, auto-favourite on alert set)
- [x] Quick-add to portfolio (+ button on cards + modal, pre-fills flip form, switches to portfolio tab)
- [x] Collapsible sections (Favourites ▾/▸ and Top 20 ▾/▸ toggles)
- [x] Active flip portfolio with localStorage persistence
- [x] Portfolio autocomplete (recommended items pinned, full cached catalogue search)
- [x] Flip cards with buy/sell prices, profit projection, buy-limit countdown timer, ✓/✕ action buttons
- [x] Completed flips history system (mark as sold, actual sell price, P&L tracking)
- [x] Portfolio sub-navigation (Active Flips / History & Stats toggle)
- [x] Portfolio stats dashboard (Total Profit, Completed Flips, Avg Profit, Avg ROI)
- [x] Completed flip cards (green/red win/loss styling, realised profit display)
- [x] Chat history persistence (localStorage, max 50 messages, clear button)
- [x] Multi-turn LLM conversation with RAG context
- [x] Full HTML UI (settings panel, tabbed/sidebar layout, market/advisor/portfolio sections)
- [x] Four-axis theme system — 2 modes × 4 styles × 8 colorways × 3 contrast levels (192 combinations), cards, tiles, grids, unified analytics modal, filters, chat, portfolio, velocity badges, external links, toast notifications, alert inputs, inline alert popovers, responsive desktop breakpoint)
- [x] Accessibility — WCAG AA muted-text contrast, `:focus-visible` keyboard ring, `aria-labelledby` on analytics modal, ▲/▼ shape profit/loss indicators, 10 px badge font floor, settings fieldset groups
- [x] Error recovery UI (dismissible error banner with retry button, try/catch wrappers across pipeline and UI)
- [x] Webpack build passes (`npm run build` — 0 errors, 0 warnings)
- [x] CSS scaling fix (`#app` height 95% for Alt1 zoom compatibility)

---

## 9. Past Issues & Resolutions

Each row distilled to **Symptom → Fix/Rule**. Grouped by domain.

### Build & Config

| Symptom | Fix |
|---------|-----|
| ES5 lib errors (Promise, Map, Object.entries) | Set `target: "ES2020"`, `lib: ["ES2020", "DOM", "DOM.Iterable"]` in tsconfig |
| `index.html` not emitted to `dist/` | Use `HtmlWebpackPlugin`; removed HTML from `asset/resource` rule |
| `tsc --noEmit` shows ~11 alt1 errors | Expected — `tsc` lacks webpack's module resolution. Does NOT affect build |

### API & Data Pipeline

| Symptom | Fix |
|---------|-----|
| API 429 rate-limiting during full market scan | Switched from concurrent `Promise.allSettled` to **sequential** batch dispatch with 300 ms pauses + `fetchWithRetry()` exponential backoff. Adaptive inter-batch delay 1.5 s → 30 s ceiling |
| Post-scan `refreshMarketPanel` triggering 30 K+ 429 errors | Replaced bespoke `fetchAPIHistory` loop (no retry, no delay, CONCURRENCY=10) with delegation to `WeirdGloopService.fetchHistoricalPrices` (200 ms per-item pauses, capped at 200 items) |
| Full scan history fetches hitting 429 after first batch | `/last90d` only accepts 1 item — reverted to sequential per-item requests with 200 ms pauses. Health check re-seeding capped to SEED_ITEMS (~230) |
| Health check B returning 0 items despite valid API | 28 `SEED_ITEMS` had wrong/untradeable names. Fixed in two waves: removed untradeable items, corrected canonical RS Wiki titles (hallowe'en masks, "Clean " prefix for herbs, case-sensitive "Dragon Rider lance", etc.) |
| CORS failures on Firefox but not Chrome | Custom `User-Agent` header triggered CORS preflight. **Rule: never set non-safelisted headers in browser `fetch()`** |
| Graph modal showing no data / stuck "Loading…" | No cache-first flow for history. **Fix**: `ensureItemHistory()` — checks IndexedDB ≥ 7 points, fetches on demand, persists via `bulkInsertHistory` |
| No fallback for low-volume items with sparse data | Added `.graph-history-status` strip with manual Refresh button when < 7 data points |

### LLM & Chat

| Symptom | Fix |
|---------|-----|
| HTTP 413 on multi-turn chat | Full market data embedded in every user message. **Fix**: `buildTrimmedHistory()` strips data blocks from all but most recent message, caps at `MAX_HISTORY_PAIRS` (8) |
| HTTP 413 on first message | Unbounded wiki text (10–30 KB/article × 5) + `LLM_CONTEXT_TOP_N` was 100. **Fix**: removed wiki text entirely; `coreKnowledge.ts` provides curated context. `MAX_BODY_BYTES` = 50 KB with progressive trimming. `LLM_CONTEXT_TOP_N` reduced to 50 |
| LLM contradictory advice ("high volatility (0.0%)", "negative slope (+0.0)") | Sparse rules (4), no data legend. **Fix**: expanded `RS3_ECONOMIC_RULES` to 8 laws + added `DATA_FIELD_LEGEND`. System prompt now covers "slope ±0.0 + volatility 0% = insufficient data". `formatForLLM` includes `[LIMITED DATA]` tag |

### UI & Layout

| Symptom | Fix |
|---------|-----|
| Chat input cut off at different zoom levels | `100vh` on `#app` didn't adapt. **Fix**: `height: 95%` + flex layout with `max-height: 30%` market / `min-height: 120px` chat |
| Model datalist pre-filtered on provider switch | Auto-fill text filtered `<datalist>`. **Fix**: clear input on change; placeholder shows default model |
| DOM refs dropped during refactor | Refactoring omitted some refs. **Rule**: verify **all** existing refs survive in `resolveElements()` |
| Expanded cards pushing tile grid | Inline expand with z-index broke layout. **Fix**: floating modal overlay |
| Item names invisible in tile/hybrid | Overflow hidden + no min-width. **Fix**: `min-width: 60px`, `flex-wrap: wrap`, `flex-shrink: 1` |
| Flip profit always 1–2 gp | Old formula used bare break-even sell. **Fix**: buy at 0.99×, sell at 1.03×, ~2% net margin after tax |
| Search replacing Top 20 items | Both rendered into same `#market-items`. **Fix**: added separate `#search-results` container |
| Searched items missing buy limits | Buy-limit fetch skipped for non-cached items. **Fix**: added `getBulkBuyLimits()` call in search flow |
| Favourites/action buttons vertical in tile view | Tile `flex-direction: column` stacked all children. **Fix**: `.card-actions` horizontal flex container |
| Portfolio dropdown opens on "Add Flip" click | `focus()` after clearing form. **Fix**: `blur()` instead |
| Portfolio dropdown opens on quick-add | Tab switch triggered focus event. **Fix**: `suppressAutocomplete` flag + guard in `updateSuggestions()` |
| Search results inline after view toggle move | `#search-results`/`#search-loading` lacked width constraint. **Fix**: `width: 100%` on both |
| Two separate modals with duplicated data | `showItemModal` and `showGraphModal` were independent. **Fix**: unified `showAnalyticsModal(item)` — single scrollable overlay |
| Volume preset (Low/High) barely changing results | Filtered on `effectivePlayerVolume` (clamped by buy limits). **Fix**: filter on **global daily GE volume** instead |
| `EXPORT_KEYS` missing `mode` and `contrast` | Lost on settings restore. **Fix**: added both to `EXPORT_KEYS` array |

### Wiki & Enrichment

| Symptom | Fix |
|---------|-----|
| High Alch "Unknown" for all items | Regex only matched `alchvalue` (rare). **Fix**: fallback to `floor(value × 0.6)` from base `value` field; skip `alchable = false` |
| No distinction "Unknown" vs "Not Alchable" | `highAlch` was `number \| undefined`. **Fix**: switched to bulk `GEHighAlchs/data.json` endpoint. Type expanded to `number \| false \| undefined` |

### CSS & Theme System

| Symptom | Fix |
|---------|-----|
| Undefined `--border`/`--text` properties | `:root` only defined `--border-main`/`--text-main`. **Fix**: added `--border: var(--border-main)` and `--text: var(--text-main)` aliases. **Rule**: use `var(--text-main)` or `var(--text-bright)` directly in components — alias resolves at `:root` scope, fails to re-resolve under light-mode `body` overrides |
| Hard-coded `rgba()` on badges bypassing themes | 30+ badge/table backgrounds used raw `rgba()`. **Fix**: tokenised into `--badge-velocity-*-bg`, `--badge-tier-*-bg/border`, etc. with light-mode overrides |
| Duplicate light-mode colorway selectors | 6 identical blocks. **Fix**: consolidated into shared `body[data-mode="light"]` rules |
| `!important` on highlight colours | **Fix**: replaced with doubled-selector specificity (`.market-card .hype-text, .hype-text.hype-text`) |
| Contrast modifiers breaking all colorways | `color-mix()` self-referenced the property being set → `guaranteed-invalid`. **Rule**: strict DAG — each property only references siblings (e.g. `--bg-main` mixes from `--bg-panel`/`--bg-elevated`) |
| Hard contrast self-referencing accent vars | Same `color-mix()` cycle on `--accent-teal`, etc. **Fix**: added `*-base` duplicate vars in all 16 colorway files; contrast modifiers reference `*-base` |
| Light mode broken after refresh (contrast ≠ default) | Contrast selectors had same specificity (0,2,1) as colorway selectors → stale cached `color-mix()` values. **Fix**: boosted contrast selectors to 0,3,1 by appending `[data-colorway]` |
| Light mode colours broken after any page refresh | `style-loader` injects CSS at bundle exec time; early-restoration IIFE ran too late — Chrome cached dark `:root` defaults first. **Fix**: moved theme restoration to **inline `<script>` in `index.html`** before the webpack bundle. **Rule**: never move this script into the bundle |
| Four dataset writes = 4 style recalcs on init | Sequential `applyMode` + `applyStyle` + `applyColorway` + `applyContrast`. **Fix**: `applyThemeBatch()` writes all 4 `dataset` props in one pass. `forceStyleInvalidation()` flushes browser cache via temporary mode toggle |
| `migrateColorwayRename()` ran on every load | No one-time guard; mapped current-valid "classic" → "default". **Fix**: `ge-analyzer:colorway-v2` flag gates migration |
| Gruvbox Light `.view-btn.active` invisible | Cream text (#fbf1c7) on accent bg. **Fix**: consolidated rule uses `#fff` for all light-mode active buttons |
| Glassmorphism/Neumorphism/Skeuomorphism incomplete | Only covered a few elements. **Fix**: comprehensive refactor covering 20+ selectors per style + micro-component protection for icon buttons |
| Inconsistent `--text-price` across colorways | Gold in Classic, olive in Solarized, lime in Gruvbox. **Fix**: standardised to green family across all 16 combos. Boosted light-mode badge alphas to 0.18–0.22 |
| Analytics stat values unreadable in light mode | `var(--text)` alias resolved at dark `:root` scope. **Fix**: replaced with `var(--text-bright)` / `var(--text-main)` directly. Strengthened soft contrast light-mode text for WCAG AA |

---

## 10. Known Issues (Open)

No open issues at this time.

---

## 11. Potential Next Steps

- **Alt1 overlay integration**: Capture game state, integrate with Alt1's screen-reading capabilities.

### Analytical Metrics

- **Potential Profit per Limit (4H Profit)**: While we calculate profit per item, a "Potential Profit per Window" metric (`estFlipProfit * buyLimit`) would help users prioritize items that offer the highest total return per trading slot.

- **Return on Investment (ROI) Percentage**: Adding a simple `(estFlipProfit / recBuyPrice) * 100` to the market cards would allow users to compare the efficiency of low-cost, high-margin items (like runes) against high-cost, low-margin items (like armor).

- **Volatility-Adjusted Margins**: We currently penalize `tradedValue` by 10% if volatility is high. We could also use this volatility to suggest wider margins for "risky" items, as they require a larger "safety buffer" against price swings.

- **High Alchemy Safety Margin**: We already fetch `highAlch` values. Including a "Risk-to-Alch" ratio would show how much value an item could lose before hitting its absolute price floor, which is highly valuable for "zero-risk" flipping.

### Feature Enhancements

- **GP per Hour Estimates**: `coreKnowledge.ts` mentions a GP/HR formula. Implementing this in the UI based on `tradeVelocity` (estimating "time to fill" for each tier) would provide a more concrete expectation for the user.

- **Theme Contrast Auto-Correction**: Given the complexity of the 192-combination theme system, include a "Theme Debugger" or an automated check to ensure WCAG AA compliance is maintained when users create custom contrast/style combinations.

- **Buy Limit Reset Notifications**: Since we already track active flips in the `PortfolioService`, adding a native notification when an item's 4-hour buy limit is expected to reset would improve user retention.

- **Capital Allocation Advisor**: A feature that suggests how to distribute a user's total "cash stack" across their Favourites list to maximize total projected profit.

---

## 12. Package Dependencies

**Runtime**: `alt1` (v0.0.1) — RS3 overlay framework.

**Dev**: `@types/node`, `ts-loader`, `typescript`, `webpack`, `webpack-cli`, `style-loader`, `css-loader`, `html-webpack-plugin`, `sharp` (alt1 peer dep).

**Explicitly NOT used**: No `openai`, `axios`, or other HTTP/LLM packages. All HTTP is native `fetch`.
