# GE Market Analyzer — Alt1 Toolkit Plugin

An intelligent **Grand Exchange market analyzer and money-making advisor** for RuneScape 3, built as an [Alt1 Toolkit](https://runeapps.org/alt1) overlay plugin.

Uses a **RAG (Retrieval-Augmented Generation) pipeline** to combine live GE market data, curated RS3 economic knowledge, and LLM-powered advice into a single interface.

![TypeScript](https://img.shields.io/badge/TypeScript-ES2020-blue)
![Webpack](https://img.shields.io/badge/Webpack-5-blue)
![License](https://img.shields.io/badge/License-ISC-green)

---

## Table of Contents

- [Features](#features)
  - [Market Data](#market-data)
  - [AI Advisor](#ai-advisor)
  - [Portfolio Tracker](#portfolio-tracker)
  - [Extras](#extras)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Install & Build](#install--build)
  - [Run Locally](#run-locally)
  - [Load in Alt1](#load-in-alt1)
  - [Development](#development)
- [Architecture](#architecture)
- [LLM Providers](#llm-providers)
- [Tech Stack](#tech-stack)
- [License](#license)

---

## Features

### Market Data
- **Top 20 Markets** — scored and ranked by traded value, flip profit, and volume
- **Flip recommendations** — buy/sell prices with profit-per-item after 2% GE tax
- **Trade velocity** — Insta-Flip / Active / Slow / Very Slow badges with explanatory tooltips
- **Hype detection** — volume spike badges when today's volume exceeds the 7-day average by 1.5×
- **Unified analytics modal** — ↗ button on every card opens a single scrollable overlay combining item details (badges, recommendations, price alerts, actions) with an interactive gradient area chart, trend stats, high/low, and volatility — with a **history-range selector** (7 / 30 / 90 days) inside the modal and in the market filter bar. Detail rows include High Alch value, always-visible Volume Spike indicator, and a dedicated "Predictive Analytics" section (30d EMA, Daily Volatility σ%, LR Slope, Predicted Price). Item sprite tooltip shows the item ID. Uses **on-demand cache-first history loading**: checks IndexedDB first, fetches from the Weird Gloop API only when data is sparse, and persists results for future use
- **Manual history refresh** — analytics modal shows a “Refresh” button when price history is insufficient (< 7 days), letting users manually fetch missing data\n- **Startup loading overlay** — spinner with step counter (Step 1 of 4) and status text keeps users informed during data pipeline and market analysis bootstrap; TTL-cached scoring maps avoid redundant IndexedDB reads on UI refresh
- **Predictive analytics badges** — EMA trend (↑/↓ vs 30-day EMA), predicted 24h price change (linear regression), and daily volatility % shown directly on every market card (hidden in tile/hybrid view when compact mode is enabled)
- **Price momentum badges** — "⚠️ Crashing" / "📈 Rising" warnings when 7-day trend exceeds ±5 %
- **Three view modes** — List, Tile, and Hybrid layouts with an optional **Compact Tiles** toggle that hides predictive badges for cleaner scanning
- **Per-section sorting** — independent sort controls (Default, A–Z, Price ↓, Profit ↓) on Top 20, Search Results, and Favourites
- **Dynamic filters** — volume and price filters with themed custom slider controls
- **Full GE search** — search all ~7,000 tradeable items with on-demand price fetching
- **Full market background scan** — scan all ~7,000 items with progress bar and cancel support; prices-only by default for speed (~2–3 min), with an optional **90-day deep history** checkbox that also fetches per-item history for complete sparklines (significantly slower)
- **Rate-limit resilience** — automatic retry with exponential backoff on API 429s and network errors; adaptive inter-batch delays during full scans
- **Startup data recovery** — automatic health checks on every launch re-enrich missing buy limits and high alch values, and re-seed sparse price history, recovering from prior failed fetches
- **External links** — quick Wiki and GE Database links on every card and in the analytics modal

### AI Advisor
- **Multi-turn RAG chat** — ask questions about items, flipping strategies, or money-making methods; the advisor sees the top 50 items by traded value (not just the filtered top 20) for broader recommendations; conversation history is automatically trimmed to stay within provider size limits
- **6 LLM providers** — Groq (default/free), OpenAI, OpenRouter, Together AI, Mistral AI, or any custom OpenAI-compatible endpoint (Ollama, LM Studio, etc.)
- **Cost tier indicators** — every provider in the dropdown shows a badge (✅ FREE, 🆓 Free Tier, 💲 Low Cost, 💳 Paid) so you can pick at a glance; Groq is starred as the recommended free option
- **Interactive setup guide** — "How to get an API key" button opens a step-by-step walkthrough for the selected provider, plus a full provider comparison table
- **Anti-hallucination guardrails** — the LLM can only reference data explicitly provided in context
- **Deep RS3 economic knowledge** — 8 economic laws (GE tax, buy limits, margin checking, high alch, item categories, flipping strategy, gp/hr formulas, common pitfalls) + a data field legend are injected into every prompt so the LLM reasons accurately about margins, trade velocity, and risk

### Portfolio Tracker
- **Active flip tracking** — log buy price, quantity, and target sell price with buy-limit countdown timers
- **Mark as sold** — record actual sell price to calculate realised profit (post-tax)
- **History & stats dashboard** — total profit, completed flips, average profit, and average ROI
- **Sortable flips table** — completed flips displayed in a table with clickable column headers (Date, Item, Profit, ROI) and a text filter
- **CSV export** — 📊 Export CSV button downloads all completed flips as a spreadsheet-ready CSV file

### Extras
- **Favourites** — star any item for quick access in a dedicated collapsible panel with its own sort control
- **Price alerts** — set buy/sell thresholds via the inline 🔔 bell on any card or in the analytics modal; triggers native browser notifications and in-app toasts when prices cross your targets
- **Export / Import** — back up favourites, portfolio, flip history, and all theme preferences (mode, style, colorway, contrast) to a JSON file; restore from any previous backup
- **Quick-add** — one-click add from any market card to the portfolio form
- **Four-axis theme system** — 2 Modes (Dark, Light) × 4 Styles (Basic, Glassmorphism, Neumorphism, Skeuomorphism) × 6 Colorways (Classic, OSRS, RS3 Modern, RS Lobby, Gruvbox, Solarized) × 3 Contrast levels (Normal, Soft, Hard) = 144 combinations, all via CSS custom properties with `color-mix()` contrast modifiers
- **Responsive desktop layout** — wider modals and expanded grids at ≥ 800 px
- **Mobile-friendly** — analytics modal detail rows wrap cleanly on small screens, Top 20 header actions flow to a new line, sidebar layout auto-disables below 700 px
- **Accessibility** — WCAG AA contrast-compliant muted text, `:focus-visible` keyboard focus ring on all interactive elements, `aria-labelledby` on analytics modal, ▲/▼ shape prefixes on profit/loss indicators for colour-blind users, 10 px minimum badge font size
- **Error recovery UI** — dismissible error banner with retry button for network/cache failures
- **Persistent state** — all settings, chat history, favourites, sort preferences, compact-tiles preference, and portfolio data saved to localStorage
- **Tabbed & sidebar layouts** — switch between compact tabbed view or full sidebar mode

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [Alt1 Toolkit](https://runeapps.org/alt1) *(optional — works standalone in any browser)*

### Install & Build
```sh
npm install
npm run build
```

### Run Locally
```sh
npx serve dist --listen 8080
```
Open [http://localhost:8080](http://localhost:8080) in your browser.

### Load in Alt1
1. Open Alt1's browser and navigate to `http://localhost:8080`
2. Click the **Add App** button that appears
3. The plugin will run as an overlay inside the RS3 game client

### Development
```sh
npm run watch    # recommended — auto-rebuild on every file save
npx serve dist --listen 8080   # run in a separate terminal
```

`npm run watch` is the preferred development workflow — it runs webpack in watch mode and rebuilds automatically on save. Use `npm run build` only when you need a clean one-shot build (e.g. final verification before a commit).

---

## Architecture

```
Weird Gloop API → IndexedDB Cache → Deterministic Filtering → LLM Synthesis
```

| Layer | File(s) | Role |
|-------|---------|------|
| **Data ingestion** | `weirdGloopService.ts`, `wikiService.ts` | Fetch GE prices + Wiki structured data (buy limits, alch values via bulk GEHighAlchs endpoint) with rate-limit retry |
| **Caching** | `cacheService.ts` | IndexedDB with 24h TTL, prices + price-history stores |
| **Pipeline** | `initDataPipeline.ts` | Startup orchestrator: cache check → fetch → enrich → insert → health checks (adaptive backoff on empty batches) |
| **Analysis** | `marketAnalyzerService.ts` | Score → filter → rank → format (pure math, no network) |
| **Knowledge** | `coreKnowledge.ts` | Static RS3 economic rules (GE tax, buy limits, etc.) |
| **LLM** | `llmService.ts` | OpenAI-compatible chat client with anti-hallucination prompt |
| **Portfolio** | `portfolioService.ts` | Active flips + completed history with P&L tracking |
| **UI** | `uiService.ts` | All DOM manipulation — services are UI-agnostic |
| **Entry** | `index.ts` | Thin orchestrator (~50 lines): Alt1 detect → pipeline → UI |

See [HANDOFF.md](HANDOFF.md) for exhaustive architecture documentation.

---

## LLM Providers

| Provider | Cost | Default Model | Notes |
|----------|------|---------------|-------|
| **Groq** ⭐ | ✅ FREE | `llama-3.1-8b-instant` | Generous free tier, no credit card required — **recommended** |
| **OpenRouter** | 🆓 Free Tier | `meta-llama/llama-3-8b-instruct` | Free tier for select models |
| **Together AI** | 🆓 Free Tier | `meta-llama/Llama-3-8b-chat-hf` | $5 free credit on signup |
| **Mistral AI** | 💲 Low Cost | `mistral-small-latest` | Competitive per-token pricing |
| **OpenAI** | 💳 Paid | `gpt-4o-mini` | Pay-as-you-go, requires billing |
| **Custom** | N/A | User-supplied | Self-hosted (Ollama, LM Studio, etc.) |

> **Getting started?** Select a provider in Settings and click the **"How to get an API key"** button for a step-by-step guide.

API keys are stored locally in your browser's localStorage — never sent anywhere except to the provider you select.

---

## Tech Stack

- **TypeScript** (ES2020) + **Webpack 5**
- **IndexedDB** for offline-capable caching
- **Native `fetch`** — zero external HTTP/LLM dependencies, with built-in rate-limit retry (exponential backoff)
- **Alt1 Toolkit** for RS3 overlay integration
- **Canvas API** for sparkline rendering

---

## License

ISC