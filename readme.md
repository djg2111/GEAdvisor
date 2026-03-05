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

- **Top 20 Markets** — items scored and ranked by traded value, flip profit, and volume
- **Flip recommendations** — buy/sell prices with profit-per-item after 2 % GE tax
- **Smart badges** — trade velocity (Insta-Flip / Active / Slow), hype detection (volume spikes), and price momentum warnings at a glance
- **Analytics modal** — click ↗ on any card for an interactive price chart, trend stats, predictive analytics (EMA, volatility, predicted 24 h price), and history-range selector (7 / 30 / 90 days)
- **Predictive badges** — EMA trend, predicted 24 h change, and daily volatility shown directly on every card
- **Three view modes** — List, Tile, and Hybrid layouts with an optional Compact Tiles toggle
- **Per-section sorting** — independent sort controls (Default, A–Z, Price ↓, Profit ↓) on Top 20, Search Results, and Favourites
- **Dynamic filters** — volume and price sliders with custom range controls
- **Full GE search** — search all ~7,000 tradeable items with on-demand price fetching
- **Background market scan** — scan the full catalogue (~2–3 min) with progress bar and cancel support; optional 90-day deep history for complete sparklines
- **Resilient networking** — automatic retry with exponential backoff on API rate limits and network errors
- **External links** — quick Wiki and GE Database links on every card and in the analytics modal

### AI Advisor

- **Multi-turn RAG chat** — ask about items, flipping strategies, or money-making methods with full market context
- **6 LLM providers** — Groq (free, recommended), OpenAI, OpenRouter, Together AI, Mistral AI, or any custom OpenAI-compatible endpoint (Ollama, LM Studio, etc.)
- **Cost tier badges** — see at a glance which providers are free, low-cost, or paid
- **Interactive setup guide** — step-by-step API key walkthrough for every provider, plus a comparison table
- **Anti-hallucination guardrails** — the advisor only references data explicitly provided in context
- **Deep RS3 knowledge** — GE tax, buy limits, high alch values, margin checking, flipping strategy, and more are injected into every prompt

### Portfolio Tracker

- **Active flip tracking** — log buy price, quantity, and target sell price with buy-limit countdown timers
- **Mark as sold** — record actual sell price to calculate realised profit (post-tax)
- **Stats dashboard** — total profit, completed flips, average profit, and average ROI
- **Sortable flips table** — clickable column headers (Date, Item, Profit, ROI) with a text filter
- **CSV export** — download all completed flips as a spreadsheet-ready CSV

### Extras

- **Favourites** — star any item for quick access in a collapsible panel with its own sort control
- **Price alerts** — set buy/sell thresholds via the 🔔 bell; triggers native notifications and in-app toasts
- **Export / Import** — back up all settings, favourites, portfolio, and flip history to JSON; restore anytime
- **Quick-add** — one-click add from any market card to the portfolio form
- **192-combination theme system** — 2 Modes (Dark / Light) × 4 Styles (Basic, Glassmorphism, Neumorphism, Skeuomorphism) × 8 Colorways × 3 Contrast levels, all WCAG AA compliant
- **Responsive layout** — scales from the Alt1 overlay to a full desktop browser; mobile-friendly below 700 px
- **Accessibility** — WCAG AA contrast, keyboard focus rings, colour-blind-safe shape indicators (▲/▼), and readable badge sizing at high DPI
- **Persistent state** — all settings, chat history, favourites, and portfolio data saved to localStorage
- **Tabbed & sidebar layouts** — switch between a compact tabbed view or a full sidebar

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

Live GE prices flow from the **Weird Gloop API** into an **IndexedDB cache**, are scored and ranked by a deterministic **market analyzer**, and then surfaced to both the UI and an **LLM advisor** that augments its responses with curated RS3 economic knowledge. All services are UI-agnostic — the single UI service owns the DOM, while the entry point acts as a thin startup orchestrator.

> **Developers:** see [HANDOFF.md](HANDOFF.md) for the full architecture deep-dive, service-by-service file map, type reference tables, past issue resolutions, and contribution guidelines.

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
- **Native `fetch`** — zero external HTTP/LLM dependencies
- **Alt1 Toolkit** for RS3 overlay integration
- **Canvas API** for sparkline rendering

---

## License

ISC
