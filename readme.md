# GE Market Analyzer — Alt1 Toolkit Plugin

An intelligent **Grand Exchange market analyzer and money-making advisor** for RuneScape 3, built as an [Alt1 Toolkit](https://runeapps.org/alt1) overlay plugin.

Uses a **RAG (Retrieval-Augmented Generation) pipeline** to combine live GE market data, RS3 Wiki guides, and LLM-powered advice into a single interface.

![TypeScript](https://img.shields.io/badge/TypeScript-ES2020-blue)
![Webpack](https://img.shields.io/badge/Webpack-5-blue)
![License](https://img.shields.io/badge/License-ISC-green)

---

## Features

### Market Data
- **Top 20 Markets** — scored and ranked by traded value, flip profit, and volume
- **Flip recommendations** — buy/sell prices with profit-per-item after 2% GE tax
- **Hype detection** — volume spike badges when today's volume exceeds the 7-day average by 1.5×
- **Canvas sparklines** — 7-day price history on every card
- **Three view modes** — List, Tile, and Hybrid layouts
- **Dynamic filters** — volume and price filters with custom slider controls
- **Full GE search** — search all ~7,000 tradeable items with on-demand price fetching

### AI Advisor
- **Multi-turn RAG chat** — ask questions about items, flipping strategies, or money-making methods
- **6 LLM providers** — Groq (default/free), OpenAI, OpenRouter, Together AI, Mistral AI, or any custom OpenAI-compatible endpoint (Ollama, LM Studio, etc.)
- **Anti-hallucination guardrails** — the LLM can only reference data explicitly provided in context
- **RS3 economic rules** — GE tax, buy limits, margin checking, and high alch rules are injected into every prompt

### Portfolio Tracker
- **Active flip tracking** — log buy price, quantity, and target sell price with buy-limit countdown timers
- **Mark as sold** — record actual sell price to calculate realised profit (post-tax)
- **History & stats dashboard** — total profit, completed flips, average profit, and average ROI

### Extras
- **Favourites** — star any item for quick access in a dedicated collapsible panel
- **Quick-add** — one-click add from any market card to the portfolio form
- **Persistent state** — all settings, chat history, favourites, and portfolio data saved to localStorage
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
npm run watch    # auto-rebuild on file changes
```

---

## Architecture

```
Weird Gloop API → IndexedDB Cache → Deterministic Filtering → LLM Synthesis
```

| Layer | File(s) | Role |
|-------|---------|------|
| **Data ingestion** | `weirdGloopService.ts`, `wikiService.ts` | Fetch GE prices + Wiki guides |
| **Caching** | `cacheService.ts` | IndexedDB with 24h TTL, prices + price-history stores |
| **Pipeline** | `initDataPipeline.ts` | Startup orchestrator: cache check → fetch → enrich → insert |
| **Analysis** | `marketAnalyzerService.ts` | Score → filter → rank → format (pure math, no network) |
| **Knowledge** | `coreKnowledge.ts` | Static RS3 economic rules (GE tax, buy limits, etc.) |
| **LLM** | `llmService.ts` | OpenAI-compatible chat client with anti-hallucination prompt |
| **Portfolio** | `portfolioService.ts` | Active flips + completed history with P&L tracking |
| **UI** | `uiService.ts` | All DOM manipulation — services are UI-agnostic |
| **Entry** | `index.ts` | Thin orchestrator (~50 lines): Alt1 detect → pipeline → UI |

See [HANDOFF.md](HANDOFF.md) for exhaustive architecture documentation.

---

## LLM Providers

| Provider | Free Tier | Default Model |
|----------|-----------|---------------|
| **Groq** | ✅ Yes | `llama3-8b-8192` |
| **OpenAI** | ❌ | `gpt-4o-mini` |
| **OpenRouter** | Varies | `meta-llama/llama-3-8b-instruct` |
| **Together AI** | Trial credits | `meta-llama/Llama-3-8b-chat-hf` |
| **Mistral AI** | Trial credits | `mistral-small-latest` |
| **Custom** | N/A | User-supplied |

API keys are stored locally in your browser's localStorage — never sent anywhere except to the provider you select.

---

## Tech Stack

- **TypeScript** (ES2020) + **Webpack 5**
- **IndexedDB** for offline-capable caching
- **Native `fetch`** — zero external HTTP/LLM dependencies
- **Alt1 Toolkit** for RS3 overlay integration
- **Canvas API** for sparkline rendering

---

## License

ISC