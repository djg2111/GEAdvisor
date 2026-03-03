# GE Market Analyzer — Agent Handoff Document

> **Purpose**: Bring a new AI agent chat session fully up to speed on the architecture, codebase, constraints, and current status of this Alt1 Toolkit plugin.

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
  - [4.13 Stylesheet](#413-stylesheet-stylecss)
- [5. localStorage Keys](#5-localstorage-keys)
- [6. Key Types Reference](#6-key-types-reference)
- [7. Build & Serve](#7-build--serve)
  - [Build](#build)
  - [Serve locally](#serve-locally)
  - [TypeScript type-check](#typescript-type-check)
  - [Webpack config notes](#webpack-config-notes)
- [8. Current Status](#8-current-status)
- [9. Past Issues & Resolutions](#9-past-issues--resolutions)
- [10. Potential Next Steps](#10-potential-next-steps-not-started)

---

## 1. Project Overview

This is a **RuneScape 3 Alt1 Toolkit plugin** called the **GE Market Analyzer**. It is an intelligent Grand Exchange market analyzer and money-making instructor that uses a **RAG (Retrieval-Augmented Generation)** pipeline:

```
Data Ingestion → Local Caching → Deterministic Filtering → LLM Synthesis
```

The plugin runs as an overlay inside the RS3 game client via the Alt1 framework, and also works standalone in a browser for development.

**Tech stack**: TypeScript, Webpack 5, IndexedDB, native `fetch` API, multi-provider LLM support (OpenAI-compatible).

---

## 2. Standing Rules & Constraints

These rules were established across all prior prompts and **must be followed in all future work**:

1. **Act as an expert TypeScript developer specializing in RuneScape 3 Alt1 Toolkit plugins.**
2. **Prioritize clean architecture, strict modularity, and separation of concerns.**
3. **Do not provide basic explanations of the tech stack. Write production-ready code.**
4. **Do NOT use any external NPM packages for LLM/HTTP** (like `openai`); rely exclusively on the native browser `fetch` API to keep the Webpack bundle small.
5. **Do not modify the existing cache or API service files unless absolutely necessary.**
6. **Include descriptive JSDoc comments** on all public methods and interfaces.
7. **Ensure all methods are strongly typed using TypeScript interfaces.**
8. The LLM system prompt must **explicitly forbid hallucinating prices, volumes, or game mechanics** and **must only use the provided GE data and curated economic rules**.
9. ~~Wiki guide fetching uses a **two-step search → extract** strategy.~~ Removed (March 2026) — `coreKnowledge.ts` provides curated, flipping-focused context that outperforms raw wiki prose. WikiService now only fetches structured data (buy limits, alch values).
10. The LLM system prompt must include the **RS3 economic rules** from `coreKnowledge.ts` with a supremacy clause — these rules override any outside knowledge the model may have.
11. **Barrel imports**: Always import services/types from `./services` (the barrel), not from individual files like `./services/types`.
12. **All DOM manipulation lives in `uiService.ts`** — no other file should touch the DOM. Services remain UI-agnostic.

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
    ├── style.css              # Three themes (Classic Dark, OSRS Brown, RS3 Modern Blue), flexbox, cards, unified analytics modal, toasts, inline alert popovers, data-mgmt, compact-tiles toggle, responsive desktop breakpoint (~3060 lines)
    ├── uiService.ts           # All DOM logic: settings, market render, search, favourites, portfolio, chat RAG, error recovery, price alerts, data export/import, CSV export, sortable flips table, unified analytics modal (~4265 lines)
    └── services/
        ├── index.ts               # Barrel re-export of all services + types + constants
        ├── types.ts               # All shared TypeScript interfaces + LLM_PROVIDERS preset array
        ├── coreKnowledge.ts       # Static RS3 economic rules knowledge base (injected into LLM prompt)
        ├── weirdGloopService.ts   # Weird Gloop RS3 GE API client
        ├── cacheService.ts        # IndexedDB wrapper (v2: prices + price-history stores)
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
1. Opens IndexedDB (`ge-analyzer-cache` database, version 2).
2. Checks staleness via cursor on `fetchedAt` index descending — if newest record > 24h old, cache is stale.
3. If stale: fetches ~100 curated seed items from the Weird Gloop API → enriches with buy limits from the RS Wiki Cargo API → bulk-inserts into IndexedDB (both `prices` and `price-history` stores).
4. **Health check A** (runs on every startup): If >50% of cached records are missing `highAlch` or `buyLimit`, re-enriches them via `WikiService` and persists via `bulkInsert`.
5. **Health check B** (runs on every startup): If <30% of cached items have ≥2 days of price history, re-seeds history via `WeirdGloopService.fetchHistoricalPrices` and persists via `bulkInsertHistory`.
6. Re-reads all cached records after health checks, then returns `StoredPriceRecord[]`.

**Seed items** (~100): Curated list of heavily-traded RS3 items including rares, skilling supplies, potions, runes, PvM drops, summoning materials, and alchables. Defined as `SEED_ITEMS` array in `initDataPipeline.ts`.

**`runFullMarketScan(catalogue, onProgress?, signal?, deepHistory?)`**: Non-blocking background scan of all ~7,000 items in batches of 100 with **adaptive inter-batch delay** (1 500 ms baseline). Consecutive empty batches double the delay up to a 30 s ceiling; delay resets to 1 500 ms on a successful batch. Fetches latest prices + buy limits + high alch values + history (30-day by default, 90-day when `deepHistory=true`) per batch, bulk-inserts into IndexedDB immediately (resume-safe). Supports `AbortSignal` for user cancellation. Progress callback `(done, total)` drives the UI progress bar.

**`fetchGECatalogue()`**: Fetches the full RS Wiki `Module:GEIDs/data.json` (~7,000 GE-tradeable items, ~215KB). Returns a sorted `GECatalogueEntry[]` used for the market search bar.

**`runFullMarketScan(catalogue, onProgress?, signal?, deepHistory?)`** also exported from `initDataPipeline.ts` — see §4.1 above for full description.

- Endpoint: `https://api.weirdgloop.org/exchange/history/rs/latest?name=ITEM1|ITEM2`
- Items are pipe-delimited, batched in groups of 100.
- Batches are dispatched **sequentially** with 300 ms inter-batch pauses (was concurrent `Promise.allSettled` — changed to avoid API rate-limiting). Individual batch failures are logged but do not abort the scan.
- All HTTP calls go through `WeirdGloopService.fetchWithRetry()` — exponential backoff on 429 and network errors (MAX_RETRIES=4, BACKOFF_BASE_MS=2 000 ms).
- Returns `Map<string, WeirdGloopPriceRecord>`.

### 4.2 Weird Gloop Service (`weirdGloopService.ts`)

- **`fetchWithRetry(url, maxRetries?)`** — private static helper. On HTTP 429 or network `TypeError`, retries up to `MAX_RETRIES` (4) times with exponential backoff: delay = `BACKOFF_BASE_MS` (2 000 ms) × 2^attempt. Non-retryable HTTP errors return `null`.
- **`fetchLatestPrices(itemNames)`** — sequential batch dispatch (one request at a time, 300 ms pause between batches). Each batch uses `fetchWithRetry`. Returns `Map<string, WeirdGloopPriceRecord>`.
- **`fetchHistoricalPrices(itemNames, days)`** — pipe-delimited batched requests of up to 50 items each, dispatched **sequentially** with `HISTORY_GROUP_DELAY_MS` (1 000 ms) pauses between batches. Each batch uses `fetchWithRetry`. Previously used individual per-item requests in concurrent groups of 10, which caused 429 rate-limiting during full scans.
- **Static constants**: `MAX_RETRIES = 4`, `BACKOFF_BASE_MS = 2_000`, `HISTORY_GROUP_DELAY_MS = 1_000`.

### 4.3 Cache Service (`cacheService.ts`)

- IndexedDB wrapper. Database: `ge-analyzer-cache`, version 2.
- **Two object stores**:
  - `prices` — keyPath: `name`, index on `fetchedAt`. Current snapshot of each item.
  - `price-history` — compound keyPath: `[name, day]`. One row per item per calendar day for SMA / hype tracking.
- Key methods: `open()`, `bulkInsert(prices)`, `getAll()`, `getRecentHistory(days)`, `getHistoricalRecords()`, `isStale()`, `clear()`.
- `bulkInsert` writes to both stores in a single read-write transaction. History store uses daily dedup via the `[name, day]` compound key.
- `isStale()` opens a descending cursor on the `fetchedAt` index, checks if newest record > 24h TTL.

### 4.4 Market Analyzer Service (`marketAnalyzerService.ts`)

Pure math on local data with one network fallback — when the local IndexedDB price-history store is sparse (< 30% of items have ≥ 2 days), `buildPriceHistoryMap()` delegates to `WeirdGloopService.fetchHistoricalPrices` (pipe-delimited batched requests of 50, with 1 000 ms pauses) and persists results to IndexedDB. Capped at 500 items to avoid rate-limit avalanche after full scans.

**TTL-cached scoring maps**: `getOrBuildMaps(days)` maintains in-memory caches of `avgVolumeMap` and `priceHistoryMap` with a 10-minute TTL (`MAP_CACHE_TTL_MS`). All three public entry points (`getTopItems`, `searchItems`, `getItemsByNames`) call `getOrBuildMaps(30)` instead of rebuilding maps from IndexedDB each time. `invalidateMapCache()` clears both maps manually; in practice this is rarely needed since all major data-update paths (full scan, force reload, retry) construct a new `MarketAnalyzerService` instance.

Pipeline:
1. Reads all cached records from `CacheService.getAll()`.
2. Builds 7-day average volume map and price history map from the `price-history` store (or returns cached versions if within TTL).
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

All DOM manipulation isolated here — services remain UI-agnostic. ~2480 lines.

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
- Responsive: `90vw` width (max 920 px, min 320 px), two-column detail grid at ≥ 600 px, reduced padding/font on mobile.

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
1. Imports `alt1`, static assets (`appconfig.json`, `icon.png`), `style.css`.
2. Detects `window.alt1` — if present, calls `alt1.identifyAppUrl()`; if absent, shows "add app" link.
3. Shows `#startup-overlay` and calls `setStartupStatus(msg, step?)` to update status + step counter (e.g. "Step 1 of 4").
4. Calls `await initDataPipeline()` (Step 1/4: "Loading market data…").
5. Calls `await initUI(onStatus)` — `onStatus` callback drives Steps 2–4 (Ranking → Favourites → Catalogue).
6. `dismissOverlay()` fades and removes the overlay after boot completes.

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

### 4.13 Stylesheet (`style.css`)

- **Three themes** using CSS custom properties — switch via `body[data-theme]`:
  - **Classic Dark** (default `:root`) — `#1e1e1e` background, `#d4d4d4` text.
  - **OSRS Brown** (`body[data-theme="osrs"]`) — parchment tones, brown accents.
  - **RS3 Modern Blue** (`body[data-theme="rs3-modern"]`) — dark navy, blue accents.
- Font stack: Segoe UI / Consolas.
- `html` and `body` both `width: 100%; height: 100%`.
- **`#app` uses `height: 95%`** (manually set to fix Alt1 zoom-level scaling issues — do NOT change).
- **Market panel**: `flex: 0 1 auto`, `max-height: 30%` in non-tabbed layout.
- **Chat panel**: `flex: 1 1 0`, `min-height: 120px`.
- **Market cards**: `.market-card` base with `.market-card-header` (flex, wrap, gap), expandable `.market-card-detail` (max-height transition).
  - **List view**: Full-width stacked cards.
  - **Tile view**: CSS grid `repeat(auto-fill, minmax(130px, 1fr))`. Column flex-direction on header. Compact badge/sprite sizes. Predictive badges hidden when compact mode is enabled.
  - **Hybrid view**: CSS grid `repeat(auto-fill, minmax(200px, 1fr))`. Predictive badges hidden when compact mode is enabled.
- **Card action buttons** (`.card-actions`): Horizontal flex row containing analytics (`.analytics-btn`), favourite (`.fav-btn`), alert (`.alert-btn`), quick-add (`.quick-add-btn`). Always stays horizontal even in tile view's column layout.
- **Favourite styling**: `.fav-btn` gold on hover (`#f0c040`), `.market-card.favorited` gets gold left border. `.fav-btn` uses scale(1.15) on hover.
- **Quick-add button**: `.quick-add-btn` teal on hover (`#4ec9b0`).
- **Favourites section**: `.favorites-section` with border, rounded corners, dark header (`#252526`), gold ★ title.
- **Top 20 section**: `.top20-section` with matching border/rounded styling. `#market-header` gets dark header background when inside the section.
- **Unified analytics modal** (March 2026): `.analytics-modal-backdrop` with centred `.analytics-modal` (90vw, max 920px, min 320px). Header with sprite (48×42, title tooltip with item ID), name (h2), current price, close button (✕). Scrollable `.analytics-content` body contains: `.analytics-badges` (velocity, hype, trend), `.analytics-actions` (favourite, quick-add, Wiki, GE), `.analytics-details-grid` (1fr, becomes 2-col at ≥ 600px; detail rows reordered: flip/profit first, then volume/liquidity; includes High Alch, always-visible Volume Spike, and "Predictive Analytics" sub-section with 30d EMA, Daily Volatility σ%, LR Slope, Predicted Price), alert inputs section, `.analytics-graph-section` with `.analytics-range-row` (7/30/90 days select), large `<canvas>` (480×140) via `drawGraphChart()`, `.analytics-stats-grid` (auto-fit minmax 140px) of `.analytics-stat-card` elements (trend, change, high, low, volatility, data points), and `.graph-history-status` strip with manual refresh button for sparse data. Lazy singleton (`ensureAnalyticsModal()`). Closes on backdrop click, ✕, or Escape. Responsive: reduced padding/font at ≤ 600px.
- **Floating modal** _(deprecated)_: `.item-modal-backdrop` / `.item-modal` — retained in CSS for backwards compat but no longer created by any active code path.
- **Graph modal** _(deprecated)_: `.graph-modal-backdrop` / `.graph-modal` — retained in CSS for backwards compat but no longer created by any active code path.
- **Flip badges**: `.flip-badges` with flex-wrap. `.buy-badge`, `.sell-badge`, `.profit-badge`, `.hype-badge`. Responsive wrapping with `min-width: 60px` on `.item-name`.
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
- **Layout modes**: `body[data-layout="tabbed"]` hides non-active tabs, `body[data-layout="sidebar"]` shows all sections side-by-side.
- Chat bubbles: user (blue `#264f78`), assistant (dark `#333`), system (italic gray), error (red `#3b1a1a`), thinking (animated dots via CSS `@keyframes`).
- Thin dark webkit scrollbar styling.

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
| `ge-analyzer:theme` | CSS theme (`classic`, `osrs`, or `rs3-modern`) |
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
| `HistoricalPriceRecord` | Extends `StoredPriceRecord` with `day` (ISO date, compound key with `name`) |
| `RankedItem` | 23 fields: `name`, `itemId`, `price`, `recBuyPrice`, `volume`, `tradedValue`, `buyLimit?`, `effectivePlayerVolume`, `maxCapitalPer4H`, `taxGap`, `recSellPrice`, `estFlipProfit`, `isRisky`, `volumeSpikeMultiplier`, `tradeVelocity`, `priceHistory`, `priceTrend`, `ema30d`, `volatility`, `linearSlope`, `predictedNextPrice`, `highAlch?: number \| false` |
| `MarketAnalyzerConfig` | `topN` (20), `minVolume` (0), `maxVolume?`, `maxPrice?` |
| `CacheServiceConfig` | `dbName`, `storeName`, `ttlMs` (default 24h) |
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

### Build
```bash
npm run build        # runs webpack → outputs to dist/  (0 errors expected)
npm run watch        # webpack --watch
```

### Serve locally
```bash
npx serve dist --listen 8080       # serves at http://localhost:8080
```

### TypeScript type-check
```bash
npx tsc --noEmit
```

**Known pre-existing `tsc` warnings**: `tsc --noEmit` may show ~11 errors in `index.ts` related to the `alt1` module and `window.alt1`. These are expected because `tsc` runs without webpack's module resolution — the `alt1` package types are resolved by webpack at build time. These errors do **NOT** affect the Webpack build. **Only `npm run build` is the true validation.**

### Webpack config notes
- `HtmlWebpackPlugin` handles `index.html` emission — do NOT add HTML to `asset/resource` rules.
- `style-loader` + `css-loader` handle `.css` imports (injected into `<head>` at runtime).
- `ts-loader` compiles TypeScript.
- `asset/resource` rule for images and JSON (excluding `.data.png` and `.fontmeta.json` which use alt1 loaders).
- Library output: UMD as `window.TestApp`.
- Externals: `sharp`, `canvas`, `electron/common` (node-only alt1 deps).

---

## 8. Current Status

Everything below is **complete and verified** (builds with 0 errors):

- [x] Weird Gloop API service (batched sequential fetching with `fetchWithRetry` exponential backoff)
- [x] IndexedDB cache service v2 (TTL-based staleness, bulk insert, prices + price-history stores)
- [x] Data pipeline orchestrator (seed list of ~100 items, buy-limit enrichment from wiki)
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
- [x] Custom volume/budget slider controls with synced text inputs (themed per CSS theme)
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
- [x] Dark-themed CSS (~2900 lines — three themes, cards, tiles, grids, unified analytics modal, filters, chat, portfolio, velocity badges, external links, toast notifications, alert inputs, inline alert popovers, responsive desktop breakpoint)
- [x] Error recovery UI (dismissible error banner with retry button, try/catch wrappers across pipeline and UI)
- [x] Webpack build passes (`npm run build` — 0 errors, 0 warnings)
- [x] CSS scaling fix (`#app` height 95% for Alt1 zoom compatibility)

---

## 9. Past Issues & Resolutions

| Issue | Root Cause | Fix |
|-------|-----------|-----|
| ES5 lib errors (Promise, Map, Object.entries) | tsconfig defaulted to ES5 | Set `target: "ES2020"`, `lib: ["ES2020", "DOM", "DOM.Iterable"]` |
| `index.html` not emitted to `dist/` | Webpack `asset/resource` rule for HTML | Installed `html-webpack-plugin`, removed HTML from asset rule |
| Chat input cut off at different zoom levels | `100vh` on `#app` didn't adapt | Used `height: 95%`, flex layout with `max-height: 30%` market / `min-height: 120px` chat |
| `tsc --noEmit` shows alt1 errors | `tsc` lacks webpack's module resolution | Expected/benign — does NOT affect webpack build |
| Model datalist pre-filtered on provider switch | Auto-filling model text filtered `<datalist>` | Clear input on provider change; placeholder shows default model |
| DOM refs dropped during refactor | Refactoring replaced DOM ref block omitting some refs | Manually restored all refs in `resolveElements()` |
| Expanded cards pushing tile grid | Inline expand with z-index/grid-column broke layout | Replaced with floating modal overlay for detail view |
| Item names invisible in tile/hybrid views | Overflow hidden + no min-width | Added `min-width: 60px`, `flex-wrap: wrap`, `flex-shrink: 1` |
| Flip profit always 1-2 gp | Old formula used bare break-even for sell price | New formula: buy at 0.99×, sell at 1.03×, ~2% net after tax |
| Search replacing Top 20 items | Both rendered into same `#market-items` container | Added separate `#search-results` container above Top 20 |
| On-demand searched items missing buy limits | Buy limit fetch skipped for non-cached items | Added wiki `getBulkBuyLimits()` call in search flow before cache insert |
| Favourites/action buttons vertical in tile view | Tile `flex-direction: column` stacked all header children | Wrapped action buttons in `.card-actions` horizontal flex container |
| Portfolio dropdown opens on "Add Flip" click | `handleAddFlip()` called `flipItemName.focus()` after clearing form | Changed to `flipItemName.blur()` to prevent autocomplete trigger |
| Portfolio dropdown opens on quick-add from card | Tab switch + form fill triggered focus event on name input | Added `suppressAutocomplete` flag, guard in `updateSuggestions()`, reset via `requestAnimationFrame` |
| Search results rendering inline after view toggle move | Moving `#view-toggle` into `#search-section` (flex container) caused `#search-results` and `#search-loading` to flow beside the input | Added `width: 100%` to both elements to force them onto their own row in the flex-wrap container |
| Graph modal showing no data / stuck on "Loading price history…" | Full market scan fetches current prices but not deep history; `fetchItemHistory` always hit the API directly (no cache) | Implemented `ensureItemHistory()` cache-first flow: checks IndexedDB for ≥ 7 data points, fetches via `WeirdGloopService.fetchHistoricalPrices` on demand, persists via `bulkInsertHistory`, dynamic loading text + error toast (March 2026) |
| API 429 rate-limiting during full market scan | Concurrent `Promise.allSettled` dispatch in `fetchLatestPrices` overwhelmed the Weird Gloop API after ~2 batches | Switched to sequential batch dispatch with 300 ms pauses; added `fetchWithRetry()` with exponential backoff (MAX_RETRIES=4, base 2 s); increased `runFullMarketScan` inter-batch delay from 500 ms to 1 500 ms with adaptive doubling (ceiling 30 s) on consecutive empty batches (March 2026) |
| Graph modal showing no data for low-volume items with no fallback action | Users had no way to manually trigger history fetch when automatic cache had insufficient data | Added `.graph-history-status` strip with Refresh button: calls `ensureItemHistory()`, re-renders graph on success, toast on failure. Only visible when < 7 data points (March 2026) |
| Full market scan history fetches hitting 429 rate limits after first batch | `fetchHistoricalPrices` used individual per-item HTTP requests (100 requests per 100-item batch in concurrent groups of 10), exhausting the API rate limit | Rewrote to use **pipe-delimited batched requests** of 50 items each, dispatched sequentially with 1 000 ms pauses — reduces 100 requests to 2 per scan batch (March 2026) |
| Post-scan `refreshMarketPanel` triggering 30 K+ 429 errors | `marketAnalyzerService.fetchAPIHistory` had its own per-item fetch loop (no retry, no delay, CONCURRENCY=10); after a 7 059-item scan the sparse-data fallback tried to fetch history for all ~1 849 cached items individually | Replaced bespoke `fetchAPIHistory` with delegation to `WeirdGloopService.fetchHistoricalPrices` (batched pipe-delimited, sequential, 1 s pauses). Also capped sparse fallback at 500 items and persisted results to IndexedDB (March 2026) |
| CORS failures on Firefox but not Chrome | `fetchWithRetry()` in `weirdGloopService.ts` and `fetchBuyLimitBatch`/`fetchAlchValueBatch` in `wikiService.ts` set a custom `User-Agent` header. Firefox sends it (non-safelisted → triggers CORS preflight), but the APIs only allow `accept` in `Access-Control-Allow-Headers`. Chrome silently strips `User-Agent` so no preflight occurs | Removed the custom `User-Agent` header from all browser `fetch()` calls in both services — browser sends its own `User-Agent` automatically. Never set non-safelisted headers in browser `fetch()` (March 2026) |
| High Alch values showing "Unknown" for all items | `getBulkHighAlchValues` regex matched only `alchvalue = <number>`, but most `Module:Exchange/<Item>` Lua sources only have a `value` field (base item value); `alchvalue` is rarely present | Added fallback: if no explicit `alchvalue`, compute High Alch as `floor(value × 0.6)` from the base `value` field. Also skip items with `alchable = false`. Added `VALUE_RE` and `ALCHABLE_FALSE_RE` regexes (March 2026) |
| High Alch showing "Unknown" instead of "Not Alchable" for non-alchable items | `highAlch` was `number \| undefined` — no way to distinguish "not yet fetched" from "item cannot be alched" | Switched primary data source to `Module:GEHighAlchs/data.json?action=raw` bulk endpoint (single HTTP request for all alchable items). Changed `highAlch` type to `number \| false \| undefined`: `false` = explicitly not alchable, `undefined` = not yet determined. UI now shows "Not Alchable" for `false`, LLM format shows "Not Alchable" / "N/A" accordingly. Per-item `Module:Exchange` parsing retained as fallback (March 2026) |
| Two separate modals (item detail + graph) with duplicated data and disjointed UX | `showItemModal` and `showGraphModal` were independent singletons — users had to open two modals to see all item info, and features like alerts/actions were only in one | Consolidated into `showAnalyticsModal(item)` — a single scrollable overlay combining badges, action buttons, detail rows, alert inputs, interactive price chart with range selector, and stats grid. Old functions deprecated but retained. Single ↗ button per card (March 2026) |
| HTTP 413 Content Too Large on multi-turn chat | `buildUserMessage()` embedded full market data in every user message; `generateAdvice()` sent the entire `_messages` array to the API. By message 4 the payload exceeded Groq's request size limit | Added `buildTrimmedHistory()`: strips data blocks from all user messages except the most recent, caps history to `MAX_HISTORY_PAIRS` (8) exchanges. Added specific 413 error hint in `handleHttpError()` (March 2026) |
| HTTP 413 recurring even on first message | Wiki text from MediaWiki API was completely unbounded — no `exchars`/`exintro` limit. A single RS3 wiki article can be 10–30 KB; with 5 guides, wiki text alone could be 50–150 KB, blowing past any body size limit. `LLM_CONTEXT_TOP_N` was also 100 items (unnecessarily large) | **Resolved permanently**: wiki guide text removed entirely (March 2026) — `coreKnowledge.ts` provides better, curated context. `MAX_BODY_BYTES` set to 50 KB with progressive market-data trimming. `LLM_CONTEXT_TOP_N` reduced from 100 → 50. Payload now ~6–8 KB on first message |
| LLM giving contradictory/spotty advice (e.g. "high volatility (0.0%)", "negative slope (+0.0)") | Core knowledge was only 4 rules; system prompt had no data interpretation guidance; `formatForLLM` omitted trade velocity, high alch, and data-sufficiency markers | Expanded `RS3_ECONOMIC_RULES` to 8 laws (item categories, flipping strategy, gp/hr formulas, common pitfalls). Added `DATA_FIELD_LEGEND` explaining every metric. System prompt now has 12 analytical reasoning rules including the "slope ±0.0 + volatility 0% = insufficient data" case. `formatForLLM` now includes High Alch, Velocity tier, and `[LIMITED DATA]` tag when < 3 history points (March 2026) |

| Volume preset filter (Low / High) barely changing Top 20 results | `minVolume` / `maxVolume` filters applied against `effectivePlayerVolume` (clamped by buy limits), not raw GE volume. Most expensive items have small buy limits (2–10), giving effectivePlayerVolume of 12–60 — well below the "Low" cap of 1 000. So virtually the same items appeared in both "Any" and "Low" | Changed `scoreAndFilter` to filter `minVolume`/`maxVolume` against **global daily GE volume** (`globalVol`) instead of `effectivePlayerVolume`. Bumped "Low" threshold from 1 000 → 5 000. `effectivePlayerVolume` still used for **scoring** (`tradedValue`), just not for filtering (March 2026) |

---

These were discussed or implied but never started:

- ~~**Improved wiki title mapping**~~: ✅ Implemented then removed — two-step MediaWiki search → extract strategy was replaced by curated `coreKnowledge.ts` (March 2026). WikiService now only fetches structured data (buy limits, alch values).
- ~~**Error recovery UI**~~: ✅ Implemented — dismissible error banner with retry button, try/catch wrappers across pipeline and UI.
- ~~**Item detail links**~~: ✅ Implemented — Wiki and GE Database links on every card and in the detail modal.
- ~~**Responsive mobile layout**~~: ✅ Implemented — `@media (min-width: 800px)` desktop breakpoint with wider modals, expanded grids.
- ~~**Favourites sorting**~~: ✅ Implemented — per-section sort dropdowns on Favourites, Top 20, and Search Results.
- ~~**Portfolio profit tracking**~~: ✅ Implemented — completed flips with actual sell price, realised profit, stats dashboard (see §4.9).
- **Alt1 overlay integration**: Capture game state, integrate with Alt1's screen-reading capabilities.
- ~~**Price alerts**~~: ✅ Implemented — per-item buy/sell alert thresholds in the detail modal, native browser notifications + DOM toast, session dedup via `firedAlerts` Set (see §4.10).
- ~~**Export/import**~~: ✅ Implemented — JSON backup of favourites, portfolio, portfolio-history, and theme via Data Management buttons in settings (see §4.12).

---

## 11. Package Dependencies

**Runtime**: `alt1` (v0.0.1) — RS3 overlay framework.

**Dev**: `@types/node`, `ts-loader`, `typescript`, `webpack`, `webpack-cli`, `style-loader`, `css-loader`, `html-webpack-plugin`, `sharp` (alt1 peer dep).

**Explicitly NOT used**: No `openai`, `axios`, or other HTTP/LLM packages. All HTTP is native `fetch`.
