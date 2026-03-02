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
- **localStorage keys** are prefixed `ge-analyzer:` (e.g. `ge-analyzer:llm-provider`, `ge-analyzer:view-mode`)
- **Provider presets** in `LLM_PROVIDERS` array (`types.ts`) — each has `endpoint`, `defaultModel`, `keyPlaceholder`, and curated `models[]` with `recommended` flags
- **Barrel imports**: Always import services/types from `./services` (the barrel), not from individual files like `./services/types`

## File Roles

| File | Responsibility |
|------|---------------|
| `uiService.ts` | **All** DOM manipulation, event binding, localStorage, rendering |
| `services/types.ts` | Every shared interface + `LLM_PROVIDERS` constant |
| `services/coreKnowledge.ts` | Static RS3 economic rules (GE tax, buy limits, margin checking, high alch) |
| `services/llmService.ts` | OpenAI-compatible chat-completion client; builds system + user prompt |
| `services/marketAnalyzerService.ts` | Pure math: score → filter → rank → format (no network) |
| `services/initDataPipeline.ts` | Startup orchestrator + `SEED_ITEMS` list (~100 RS3 items) |

## Gotchas

- `HtmlWebpackPlugin` emits `index.html` — never add HTML to webpack's `asset/resource` rules
- `#app` height is `95%` (not `100vh`) to fix Alt1 zoom scaling — do not change this
- Market panel `max-height: 30%`, chat panel `flex: 1 1 0` with `min-height: 120px` — this flex balance is intentional
- When editing DOM ref resolution in `uiService.ts`, verify **all** existing refs survive — past refactors accidentally dropped refs
- Model `<input>` uses `<datalist>` — do not auto-fill the value on provider change (it pre-filters the dropdown); set placeholder instead

## Full Context

See `HANDOFF.md` at the repo root for exhaustive architecture docs, type reference tables, past issue resolutions, and potential next steps.
