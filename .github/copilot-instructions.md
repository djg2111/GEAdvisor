# Copilot Instructions — GE Market Analyzer (Alt1 Plugin)

## Architecture

RS3 Alt1 Toolkit plugin using a RAG pipeline: `Weird Gloop API → IndexedDB cache → deterministic filtering → LLM synthesis`. All services live in `src/services/` with a barrel re-export via `src/services/index.ts`. The UI layer (`src/uiService.ts`) is the **only** file that touches the DOM — all services are UI-agnostic. Entry point `src/index.ts` is a thin orchestrator (~50 lines).

## Hard Constraints

- **No external HTTP/LLM packages** — use native `fetch` exclusively (no `openai`, `axios`, etc.)
- **Do not modify `cacheService.ts` or `weirdGloopService.ts`** unless absolutely necessary
- All shared interfaces and the `LLM_PROVIDERS` constant live in `src/services/types.ts` — add new types there, not in service files
- JSDoc on all public methods and exported interfaces
- LLM system prompt must include `RS3_ECONOMIC_RULES` from `coreKnowledge.ts` with supremacy clause — these rules override any model training data
- LLM prompts must forbid hallucinating prices/volumes/game mechanics; only use data passed in the user message
- **Keep docs in sync**: After completing any feature, bug fix, or refactor, update **all three** documentation files before considering the task done:
  1. `.github/copilot-instructions.md` — update File Roles, UI Layout, Key Patterns, or Gotchas if the change affects architecture, DOM structure, conventions, or known pitfalls.
  2. `readme.md` — update the Features list or any other section that the change touches (e.g. new UI capabilities, new service, removed feature).
  3. `HANDOFF.md` — update the relevant deep-dive section(s), localStorage keys table, types table, current-status checklist, and past-issues table as applicable.

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
- **localStorage keys** are prefixed `ge-analyzer:` (e.g. `ge-analyzer:llm-provider`, `ge-analyzer:view-mode`, `ge-analyzer:top20-sort`, `ge-analyzer:theme`)
- **Per-section sort controls**: Top 20, Search Results, and Favourites each have their own sort `<select>` and localStorage key (`ge-analyzer:top20-sort`, `ge-analyzer:search-sort`, `ge-analyzer:fav-sort`). Shared `applySortOrder()` helper sorts in place — do not add a global sort.
- **Three CSS themes**: Classic Dark (`:root`), OSRS Brown (`body[data-theme="osrs"]`), RS3 Modern Blue (`body[data-theme="rs3-modern"]`) — all via CSS custom properties. New UI elements must use `var(--*)` tokens, never hard-coded colours.
- **Provider presets** in `LLM_PROVIDERS` array (`types.ts`) — each has `endpoint`, `defaultModel`, `keyPlaceholder`, and curated `models[]` with `recommended` flags
- **Barrel imports**: Always import services/types from `./services` (the barrel), not from individual files like `./services/types`

## File Roles

| File | Responsibility |
|------|---------------|
| `uiService.ts` | **All** DOM manipulation, event binding, localStorage, rendering (~2 480 lines) |
| `services/types.ts` | Every shared interface + `LLM_PROVIDERS` constant |
| `services/coreKnowledge.ts` | Static RS3 economic rules (GE tax, buy limits, margin checking, high alch) |
| `services/llmService.ts` | OpenAI-compatible chat-completion client; builds system + user prompt |
| `services/marketAnalyzerService.ts` | Pure math: score → filter → rank → format (no network). Includes trade velocity scoring. |
| `services/initDataPipeline.ts` | Startup orchestrator + `SEED_ITEMS` list (~100 RS3 items) |
| `services/portfolioService.ts` | Active flip tracker + completed flip history with P&L stats (localStorage) |
| `services/wikiService.ts` | RS Wiki MediaWiki API client + Cargo buy-limit API (two-step search → extract) |
| `style.css` | Three themes, cards/tiles/grids, modals, sparklines, velocity badges, slider theming, responsive `@media (min-width: 800px)` breakpoint (~2 150 lines) |

## UI Layout (index.html, top → bottom)

1. `#error-banner` — dismissible error bar with retry (hidden by default)
2. `#market-filters` — volume / price dropdowns + refresh button
3. Custom slider groups (volume min/max, budget) — shown when "Custom" selected
4. `#search-section` — search input + `#search-sort-select` + view toggle (☰ ▦ ⊞) + `#search-results`
5. `#favorites-section` — ★ header + `#favorites-sort-select` + collapse button + `#favorites-items`
6. `.top20-section` → `#market-header` (h2 + `.market-header-actions`: `#top20-sort-select` + collapse ▾) + `#market-items`

## Gotchas

- `HtmlWebpackPlugin` emits `index.html` — never add HTML to webpack's `asset/resource` rules
- `#app` height is `95%` (not `100vh`) to fix Alt1 zoom scaling — do not change this
- Market panel `max-height: 30%`, chat panel `flex: 1 1 0` with `min-height: 120px` — this flex balance is intentional
- When editing DOM ref resolution in `uiService.ts`, verify **all** existing refs survive — past refactors accidentally dropped refs
- Model `<input>` uses `<datalist>` — do not auto-fill the value on provider change (it pre-filters the dropdown); set placeholder instead
- `#search-results` and `#search-loading` must have `width: 100%` to stay below the flex-row search bar — do not remove this
- Modal section in `uiService.ts` uses literal JS unicode escape sequences — use Node.js scripts for safe text replacement if needed
- Slider pseudo-element styles (`::-webkit-slider-*` / `::-moz-range-*`) must stay in **separate rule blocks** per browser spec

## Full Context

See `HANDOFF.md` at the repo root for exhaustive architecture docs, type reference tables, past issue resolutions, and potential next steps.
