/**
 * @module types
 * Shared type definitions for the GE Market Analyzer pipeline.
 */

// ─── Weird Gloop API Response Shapes ────────────────────────────────────────

/**
 * A single price record returned by the Weird Gloop `/exchange/history/rs/latest` endpoint.
 * The API returns an object keyed by item name, where each value has this shape.
 */
export interface WeirdGloopPriceRecord {
  /** Item ID in the RuneScape catalogue. */
  id: number;
  /** UTC timestamp (ISO-8601 or Unix seconds depending on endpoint version). */
  timestamp: string;
  /** Latest instantaneous price snapshot. */
  price: number;
  /** 24-hour trade volume (may be `0` for thinly-traded items). */
  volume: number;
  /** GE buy limit per 4-hour window (fetched from the RS Wiki Cargo API). */
  buyLimit?: number;
}

/**
 * The top-level response shape for a `/exchange/history/rs/latest` call.
 * Keys are canonical item names exactly as sent in the query string.
 */
export interface WeirdGloopLatestResponse {
  [itemName: string]: WeirdGloopPriceRecord;
}

// ─── IndexedDB Stored Record ────────────────────────────────────────────────

/**
 * A price record as persisted in IndexedDB.
 * Extends the API record with a local ingest timestamp used for cache TTL checks.
 */
export interface StoredPriceRecord extends WeirdGloopPriceRecord {
  /** Canonical item name (also serves as the primary key in the object store). */
  name: string;
  /** Unix-millisecond timestamp of when this record was written to IDB. */
  fetchedAt: number;
}

/**
 * A daily snapshot stored in the `price-history` object store.
 * The compound key `[name, day]` ensures one row per item per calendar day.
 */
export interface HistoricalPriceRecord extends StoredPriceRecord {
  /** ISO date string `"YYYY-MM-DD"` — forms a compound key with `name`. */
  day: string;
}

// ─── Service Configuration ──────────────────────────────────────────────────

/** Tuneable knobs for the Weird Gloop API service. */
export interface WeirdGloopServiceConfig {
  /**
   * Maximum number of item names to include in a single API request.
   * The endpoint accepts pipe-delimited names; 100 is a safe upper bound.
   * @default 100
   */
  batchSize: number;
}

// ─── Market Analyzer Types ──────────────────────────────────────────────────

/**
 * A cached price record enriched with a computed liquidity score.
 * Produced by the {@link MarketAnalyzerService} filtering pipeline.
 */
export interface RankedItem {
  /** Canonical RS3 item name. */
  name: string;
  /** Item catalogue ID (used for sprite URLs). */
  itemId: number;
  /** Latest GE price in gp. */
  price: number;
  /**
   * Suggested buy-offer price — 1 % below the current GE price.
   * Gives the flipper a realistic entry point that accounts for
   * typical instant-buy discounts.  Minimum 1 gp below `price`.
   */
  recBuyPrice: number;
  /** 24-hour trade volume reported by the API (global). */
  volume: number;
  /**
   * Estimated daily traded value in gp (`price × volume`).
   * Retained for reference; sorting uses player-constrained value instead.
   */
  tradedValue: number;
  /** GE buy limit per 4-hour window (undefined when the wiki has no data). */
  buyLimit?: number;
  /**
   * The lesser of global daily volume and the player’s daily limit
   * (`buyLimit × 6`).  Falls back to global volume when `buyLimit` is
   * unknown.
   */
  effectivePlayerVolume: number;
  /**
   * Maximum gp a single player can deploy per 4-hour window
   * (`price × buyLimit`).  `0` when `buyLimit` is unknown.
   */
  maxCapitalPer4H: number;
  /**
   * The minimum margin (in gp) the seller must clear above the buy price
   * to break even after the 2 % GE tax: `ceil(price / 0.98) − price`.
   */
  taxGap: number;
  /**
   * Minimum sell price needed to turn a profit after the 2 % GE tax
   * when buying at `recBuyPrice`.
   * Calculated as `ceil(recBuyPrice / 0.98) + 1` (one gp above break-even).
   */
  recSellPrice: number;
  /**
   * Estimated per-item flip profit when buying at `recBuyPrice` and
   * selling at `recSellPrice`: `recSellPrice - recBuyPrice - floor(recSellPrice * 0.02)`.
   */
  estFlipProfit: number;
  /**
   * `true` when the item is cheap enough that the absolute tax gap
   * makes flipping very difficult (price < 500 gp).  At these price
   * tiers a 2 % tax eats most realistic spreads.
   */
  isRisky: boolean;
  /**
   * Ratio of today’s volume to its 7-day simple moving average.
   * `0` when there is insufficient history or the spike is ≤ 1.5×.
   * A value of `2.3` means 230 % of the average — a significant hype spike.
   */
  volumeSpikeMultiplier: number;  /**
   * Qualitative trade-speed tier derived from the item's estimated hourly
   * volume relative to its 4-hour buy limit.  Helps set realistic
   * expectations for how quickly a flip can complete.
   */
  tradeVelocity: "Insta-Flip" | "Active" | "Slow" | "Very Slow";
  /**
   * Chronological daily prices over the last 7 days (oldest-first).
   * Empty when there is no historical data yet.
   */
  priceHistory: number[];}

/** Tuneable knobs for the {@link MarketAnalyzerService}. */
export interface MarketAnalyzerConfig {
  /**
   * Number of top items to return after sorting.
   * @default 20
   */
  topN: number;
  /**
   * Minimum daily volume an item must have to be included.
   * Items at or below this threshold are discarded as illiquid.
   * @default 0
   */
  minVolume: number;
  /**
   * Maximum daily volume. Items above this threshold are excluded.
   * `undefined` or `0` means no upper-bound.
   */
  maxVolume?: number;
  /**
   * Maximum item price in gp. Items more expensive than this are excluded.
   * `undefined` or `0` means no price cap.
   */
  maxPrice?: number;
}

/** Tuneable knobs for the IndexedDB caching layer. */
export interface CacheServiceConfig {
  /** IndexedDB database name. */
  dbName: string;
  /** IndexedDB object store name for price records. */
  storeName: string;
  /**
   * Time-to-live for cached records, in milliseconds.
   * Records older than this are considered stale and will be re-fetched.
   * @default 86_400_000 (24 hours)
   */
  ttlMs: number;
}

// ─── Wiki Service Types ─────────────────────────────────────────────────────

/**
 * Subset of the MediaWiki `action=query&prop=extracts` response we care about.
 * Each key under `pages` is a string page-ID (or `"-1"` for missing pages).
 */
export interface WikiQueryResponse {
  query: {
    pages: {
      [pageId: string]: WikiPage;
    };
  };
}

/** A single page record inside a MediaWiki query response. */
export interface WikiPage {
  /** Numeric page ID (`-1` when the page does not exist). */
  pageid: number;
  /** Namespace number (typically `0` for mainspace articles). */
  ns: number;
  /** Page title as stored in the wiki. */
  title: string;
  /**
   * Plain-text extract of the article body.
   * Only present when the page exists and `explaintext=1` was requested.
   */
  extract?: string;
  /** Present (and set to `""`) when the page does not exist. */
  missing?: string;
}

/**
 * Subset of the MediaWiki `action=query&list=search` response.
 * Used by the two-step guide search to resolve the real page title.
 */
export interface WikiSearchResponse {
  query: {
    search: Array<{
      /** Full page title as stored in the wiki. */
      title: string;
      /** Numeric page ID. */
      pageid: number;
    }>;
  };
}

/** Result returned by {@link WikiService.getMoneyMakingGuide}. */
export interface WikiGuideResult {
  /** The wiki page title that was queried. */
  title: string;
  /** `true` if the wiki page actually exists. */
  found: boolean;
  /** Plain-text extract, or a fallback message when the page is missing. */
  text: string;
}

// ─── LLM Provider Presets ───────────────────────────────────────────────────

/** A single model option within a provider's suggested model list. */
export interface ModelOption {
  /** Model identifier sent to the API (e.g. `"llama3-8b-8192"`). */
  id: string;
  /** Short human-readable label shown in the dropdown (e.g. `"Llama 3 8B"`). */
  label: string;
  /** Mark as the recommended pick for this plugin's RAG use-case. */
  recommended?: boolean;
}

/** Describes an LLM API provider the user can choose from the settings panel. */
export interface LLMProvider {
  /** Unique identifier (used as `<option>` value). */
  id: string;
  /** Human-readable label shown in the dropdown. */
  label: string;
  /** Chat-completion endpoint URL. */
  endpoint: string;
  /** Default model identifier for this provider. */
  defaultModel: string;
  /** Placeholder hint shown in the API key input. */
  keyPlaceholder: string;
  /**
   * Curated list of models available on this provider.
   * The first entry with `recommended: true` is pre-selected when the
   * provider is chosen. Users can still type any model name.
   */
  models: readonly ModelOption[];
}

/** Built-in provider presets. The last entry (`custom`) uses user-supplied values. */
export const LLM_PROVIDERS: readonly LLMProvider[] = [
  {
    id: "groq",
    label: "Groq",
    endpoint: "https://api.groq.com/openai/v1/chat/completions",
    defaultModel: "llama3-8b-8192",
    keyPlaceholder: "gsk_…",
    models: [
      { id: "llama3-8b-8192",      label: "Llama 3 8B",           recommended: true },
      { id: "llama3-70b-8192",     label: "Llama 3 70B" },
      { id: "llama-3.1-8b-instant", label: "Llama 3.1 8B Instant" },
      { id: "llama-3.1-70b-versatile", label: "Llama 3.1 70B Versatile" },
      { id: "gemma2-9b-it",        label: "Gemma 2 9B" },
      { id: "mixtral-8x7b-32768",  label: "Mixtral 8×7B" },
    ],
  },
  {
    id: "openai",
    label: "OpenAI",
    endpoint: "https://api.openai.com/v1/chat/completions",
    defaultModel: "gpt-4o-mini",
    keyPlaceholder: "sk-…",
    models: [
      { id: "gpt-4o-mini",   label: "GPT-4o Mini",   recommended: true },
      { id: "gpt-4o",        label: "GPT-4o" },
      { id: "gpt-4-turbo",   label: "GPT-4 Turbo" },
      { id: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
      { id: "o3-mini",       label: "o3-mini" },
    ],
  },
  {
    id: "openrouter",
    label: "OpenRouter",
    endpoint: "https://openrouter.ai/api/v1/chat/completions",
    defaultModel: "meta-llama/llama-3-8b-instruct",
    keyPlaceholder: "sk-or-…",
    models: [
      { id: "meta-llama/llama-3-8b-instruct",    label: "Llama 3 8B Instruct",    recommended: true },
      { id: "meta-llama/llama-3-70b-instruct",   label: "Llama 3 70B Instruct" },
      { id: "meta-llama/llama-3.1-8b-instruct",  label: "Llama 3.1 8B Instruct" },
      { id: "mistralai/mistral-7b-instruct",     label: "Mistral 7B Instruct" },
      { id: "google/gemma-2-9b-it",              label: "Gemma 2 9B" },
      { id: "openai/gpt-4o-mini",                label: "GPT-4o Mini (OpenAI)" },
    ],
  },
  {
    id: "together",
    label: "Together AI",
    endpoint: "https://api.together.xyz/v1/chat/completions",
    defaultModel: "meta-llama/Llama-3-8b-chat-hf",
    keyPlaceholder: "tok_…",
    models: [
      { id: "meta-llama/Llama-3-8b-chat-hf",    label: "Llama 3 8B Chat",    recommended: true },
      { id: "meta-llama/Llama-3-70b-chat-hf",   label: "Llama 3 70B Chat" },
      { id: "mistralai/Mixtral-8x7B-Instruct-v0.1", label: "Mixtral 8×7B" },
      { id: "togethercomputer/RedPajama-INCITE-7B-Chat", label: "RedPajama 7B" },
    ],
  },
  {
    id: "mistral",
    label: "Mistral AI",
    endpoint: "https://api.mistral.ai/v1/chat/completions",
    defaultModel: "mistral-small-latest",
    keyPlaceholder: "mis_…",
    models: [
      { id: "mistral-small-latest",  label: "Mistral Small",  recommended: true },
      { id: "mistral-medium-latest", label: "Mistral Medium" },
      { id: "mistral-large-latest",  label: "Mistral Large" },
      { id: "open-mistral-7b",       label: "Mistral 7B (Open)" },
      { id: "open-mixtral-8x7b",     label: "Mixtral 8×7B (Open)" },
    ],
  },
  {
    id: "custom",
    label: "Custom / Self-hosted",
    endpoint: "",
    defaultModel: "",
    keyPlaceholder: "(optional for local models)",
    models: [],
  },
] as const;

// ─── LLM Service Types ─────────────────────────────────────────────────────

/** Configuration for the LLM chat-completion endpoint. */
export interface LLMConfig {
  /** Bearer token sent in the `Authorization` header. */
  apiKey: string;
  /**
   * OpenAI-compatible chat-completion endpoint URL.
   * @default "https://api.groq.com/openai/v1/chat/completions"
   */
  endpoint: string;
  /**
   * Model identifier to request.
   * @default "llama3-8b-8192"
   */
  model: string;
  /**
   * Sampling temperature (0 = deterministic, higher = more creative).
   * @default 0.4
   */
  temperature: number;
  /**
   * Maximum tokens the model may generate in its response.
   * @default 1024
   */
  maxTokens: number;
}

/** A single message in the OpenAI chat-completion `messages` array. */
export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/** Shape of an OpenAI-compatible chat-completion request body. */
export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature: number;
  max_tokens: number;
}

/** Minimal subset of the chat-completion response we need to read. */
export interface ChatCompletionResponse {
  id: string;
  choices: ChatCompletionChoice[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/** A single choice inside a chat-completion response. */
export interface ChatCompletionChoice {
  index: number;
  message: ChatMessage;
  finish_reason: string;
}

// ─── Portfolio Types ────────────────────────────────────────────────────────

/**
 * An active flip being tracked in the user's portfolio.
 * Persisted to `localStorage` and rendered with a live buy-limit countdown.
 */
export interface ActiveFlip {
  /** Unique identifier (RFC-4122-ish v4 UUID). */
  id: string;
  /** Canonical RS3 item name. */
  itemName: string;
  /** Price at which the item was (or will be) bought, in gp. */
  buyPrice: number;
  /** Number of items in this flip. */
  quantity: number;
  /** Target sell price per item, in gp. */
  targetSellPrice: number;
  /**
   * Unix-millisecond timestamp of when the GE offer was placed.
   * Used to compute the 4-hour buy-limit reset countdown.
   */
  timestamp: number;
}

/**
 * A flip that has been sold and moved to the history ledger.
 * Extends {@link ActiveFlip} with realised sale data.
 */
export interface CompletedFlip extends ActiveFlip {
  /** The per-item price the flip was actually sold at (gp). */
  actualSellPrice: number;
  /** Unix-millisecond timestamp of when the flip was completed. */
  completedAt: number;
  /**
   * Net profit after the 2 % GE tax:
   * `(actualSellPrice × 0.98 × quantity) − (buyPrice × quantity)`.
   * Negative values represent a loss.
   */
  realizedProfit: number;
}

/**
 * Aggregate statistics across all completed flips in the portfolio history.
 */
export interface PortfolioStats {
  /** Sum of `realizedProfit` across all completed flips (may be negative). */
  totalProfit: number;
  /** Total number of completed flips. */
  totalFlips: number;
  /** Average realised profit per completed flip. */
  avgProfit: number;
  /** Average return on investment as a fraction (e.g. 0.12 = 12 %). */
  avgRoi: number;
}

// ─── Full GE Catalogue ────────────────────────────────────────────────────────────

/**
 * Lightweight entry from the RS Wiki’s `Module:GEIDs/data.json` catalogue.
 * Contains every GE-tradeable item name and its catalogue ID.
 */
export interface GECatalogueEntry {
  /** Canonical RS3 item name. */
  name: string;
  /** GE catalogue item ID. */
  id: number;
}
