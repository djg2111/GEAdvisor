/**
 * @module MarketAnalyzerService
 * Deterministic filtering pipeline that transforms raw cached GE data into a
 * ranked, LLM-ready summary of the most profitable RS3 markets **from a
 * single player’s perspective**.
 *
 * Pipeline stages:
 *  1. **Retrieve** — pull every {@link StoredPriceRecord} from IndexedDB.
 *  2. **Score**    — compute player-constrained metrics:
 *                    • `effectivePlayerVolume = min(volume, buyLimit × 6)`
 *                    • `maxCapitalPer4H = price × buyLimit`
 *                    • `playerTradedValue = price × effectivePlayerVolume`
 *  3. **Filter**   — discard items outside the volume / price window.
 *  4. **Rank**     — sort descending by `playerTradedValue`.
 *  5. **Slice**    — keep only the top-N items.
 *  6. **Format**   — serialise the result into a compact string for LLM context.
 *
 * All calculations are pure math on local data — the only network call is a
 * fallback fetch to the Weird Gloop historical API when the local IndexedDB
 * price-history store has insufficient data for sparkline rendering.
 */

import { CacheService } from "./cacheService";
import { WeirdGloopService } from "./weirdGloopService";
import type {
  MarketAnalyzerConfig,
  RankedItem,
  StoredPriceRecord,
} from "./types";

// ─── Pure Time-Series Math ──────────────────────────────────────────────────

/**
 * Calculate the Exponential Moving Average of a price series.
 *
 * The EMA gives progressively more weight to recent observations.
 * With the default `alpha = 0.2`, the half-life is roughly 3 observations.
 *
 * @param prices - Chronological price array (oldest-first).  Must have ≥ 1 element.
 * @param alpha  - Smoothing factor in (0, 1].  Higher = more reactive.
 * @returns The final EMA value, or `0` if the array is empty.
 */
function calculateEMA(prices: number[], alpha: number = 0.2): number {
  if (prices.length === 0) return 0;
  let ema = prices[0];
  for (let i = 1; i < prices.length; i++) {
    ema = alpha * prices[i] + (1 - alpha) * ema;
  }
  return ema;
}

/**
 * Calculate the volatility of a price series as the standard deviation of
 * daily percentage returns.
 *
 * A return of `0.05` means the typical daily swing is ±5 %.
 *
 * @param prices - Chronological price array (oldest-first).  Needs ≥ 2 elements.
 * @returns Population standard deviation of daily % changes, or `0` if too few data points.
 */
function calculateVolatility(prices: number[]): number {
  if (prices.length < 2) return 0;
  const returns: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    if (prices[i - 1] === 0) continue;
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }
  if (returns.length === 0) return 0;
  const mean = returns.reduce((s, r) => s + r, 0) / returns.length;
  const variance = returns.reduce((s, r) => s + (r - mean) ** 2, 0) / returns.length;
  return Math.sqrt(variance);
}

/**
 * Fit an ordinary least-squares (OLS) linear regression to a price series and
 * return the slope plus a one-step-ahead prediction.
 *
 * The independent variable is a zero-based day index (0, 1, 2, …).
 *
 * @param prices - Chronological price array (oldest-first).  Needs ≥ 2 elements.
 * @returns `{ slope, predictedNext }` where `predictedNext` is the extrapolated
 *          price for day `N` (one beyond the last observation).
 *          Both are `0` when there is insufficient data.
 */
function calculateLinearTrend(prices: number[]): { slope: number; predictedNext: number } {
  const n = prices.length;
  if (n < 2) return { slope: 0, predictedNext: 0 };

  // Σx, Σy, Σxy, Σx²  where x = 0 … n-1
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += prices[i];
    sumXY += i * prices[i];
    sumX2 += i * i;
  }

  const denom = n * sumX2 - sumX * sumX;
  if (denom === 0) return { slope: 0, predictedNext: prices[n - 1] };

  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;
  const predictedNext = intercept + slope * n; // day = n (one step ahead)

  return { slope, predictedNext };
}

/** Default analyser settings. */
const DEFAULTS: MarketAnalyzerConfig = {
  topN: 20,
  minVolume: 0,
};

/**
 * Number of top items (by traded value, no filters) included in the LLM
 * chat context.  50 items in compact format ≈ 6–8 KB — comfortably fits
 * alongside the system prompt and truncated wiki text within a 50 KB
 * payload budget.
 */
const LLM_CONTEXT_TOP_N = 50;

/**
 * Stateless service that reads cached GE price data and produces a ranked,
 * LLM-consumable summary of the most actively-traded items.
 *
 * @example
 * ```ts
 * const cache = new CacheService();
 * await cache.open();
 *
 * const analyzer = new MarketAnalyzerService(cache);
 * const top = await analyzer.getTopItems();
 * const prompt = analyzer.formatForLLM(top);
 * console.log(prompt);
 * ```
 */
export class MarketAnalyzerService {
  private readonly cache: CacheService;
  private readonly topN: number;
  private readonly minVolume: number;
  private readonly maxVolume: number;
  private readonly maxPrice: number;

  // Cached intermediate maps with TTL – March 2026
  /** TTL for cached volume/price maps (10 minutes). */
  private static readonly MAP_CACHE_TTL_MS = 10 * 60 * 1000;
  private cachedAvgVolumeMap: Map<string, number> | null = null;
  private cachedPriceHistoryMap: Map<string, number[]> | null = null;
  private mapCacheTimestamp = 0;

  /**
   * Fill-rate factor for ROT estimation — a single player rarely captures
   * 100 % of hourly GE volume.  0.7 is a conservative middle-ground.
   */
  private static readonly ROT_FILL_FACTOR = 0.7;

  /**
   * @param cache  - An **already-opened** {@link CacheService} instance.
   * @param config - Optional overrides for ranking behaviour.
   */
  constructor(cache: CacheService, config?: Partial<MarketAnalyzerConfig>) {
    this.cache = cache;
    this.topN = config?.topN ?? DEFAULTS.topN;
    this.minVolume = config?.minVolume ?? DEFAULTS.minVolume;
    this.maxVolume = config?.maxVolume ?? 0;
    this.maxPrice = config?.maxPrice ?? 0;
  }

  /** Invalidate the cached volume/price maps so the next call rebuilds them. */
  invalidateMapCache(): void {
    this.cachedAvgVolumeMap = null;
    this.cachedPriceHistoryMap = null;
    this.mapCacheTimestamp = 0;
  }

  /** Check whether the cached maps are still within their TTL. */
  private isMapsStale(): boolean {
    return !this.cachedAvgVolumeMap
      || !this.cachedPriceHistoryMap
      || (Date.now() - this.mapCacheTimestamp > MarketAnalyzerService.MAP_CACHE_TTL_MS);
  }

  /**
   * Return (possibly cached) avgVolumeMap and priceHistoryMap.
   * Rebuilds both if the cache is stale or empty.
   */
  private async getOrBuildMaps(days: number = 30): Promise<{
    avgVolumeMap: Map<string, number>;
    priceHistoryMap: Map<string, number[]>;
  }> {
    if (!this.isMapsStale()) {
      console.log("[MarketAnalyzer] Using cached scoring maps (age: " +
        `${((Date.now() - this.mapCacheTimestamp) / 1000).toFixed(0)}s).`);
      return {
        avgVolumeMap: this.cachedAvgVolumeMap!,
        priceHistoryMap: this.cachedPriceHistoryMap!,
      };
    }

    const avgVolumeMap = await this.buildAvgVolumeMap(days);
    const priceHistoryMap = await this.buildPriceHistoryMap(days);

    this.cachedAvgVolumeMap = avgVolumeMap;
    this.cachedPriceHistoryMap = priceHistoryMap;
    this.mapCacheTimestamp = Date.now();

    return { avgVolumeMap, priceHistoryMap };
  }



  // ─── Public API ───────────────────────────────────────────────────────

  /**
   * Run the full filtering pipeline and return the top-N most liquid items.
   *
   * @param overrides - Optional runtime filter overrides that take precedence
   *                    over the constructor defaults for this single call.
   * @returns An array of {@link RankedItem} objects, length ≤ `topN`.
   */
  async getTopItems(overrides?: Partial<MarketAnalyzerConfig>): Promise<RankedItem[]> {
    const records = await this.cache.getAll();

    if (records.length === 0) {
      console.warn("[MarketAnalyzer] Cache returned 0 records — nothing to analyse.");
      return [];
    }

    // Build a volume-SMA map from the last 30 days of history.
    // Build a price-history map for sparklines / EMA / regression.
    // Uses TTL-cached maps to skip redundant IndexedDB reads + API calls.
    const { avgVolumeMap, priceHistoryMap } = await this.getOrBuildMaps(30);

    const effectiveMinVol = overrides?.minVolume ?? this.minVolume;
    const effectiveMaxVol = overrides?.maxVolume ?? this.maxVolume;
    const effectiveMaxPrice = overrides?.maxPrice ?? this.maxPrice;
    const effectiveTopN = overrides?.topN ?? this.topN;

    console.log(
      `[MarketAnalyzer] Scoring ${records.length} cached records` +
      ` (minVol=${effectiveMinVol}, maxVol=${effectiveMaxVol || "∞"}, maxPrice=${effectiveMaxPrice || "∞"})…`
    );

    const scored = this.scoreAndFilter(records, effectiveMinVol, effectiveMaxVol, effectiveMaxPrice, avgVolumeMap, priceHistoryMap);
    const sorted = this.sortDescending(scored);
    const top = sorted.slice(0, effectiveTopN);

    console.log(
      `[MarketAnalyzer] ${scored.length} liquid items found → returning top ${top.length}.`
    );
    return top;
  }

  /**
   * Search all cached items by name and return fully-scored {@link RankedItem}
   * objects — identical to the cards produced by {@link getTopItems}.
   *
   * The search is **entirely client-side** (IndexedDB only, no network calls).
   * Results are capped at 50 to keep DOM rendering lightweight.
   *
   * @param query - Case-insensitive substring to match against item names.
   * @returns Matching items ranked by `tradedValue`, length ≤ 50.
   */
  async searchItems(query: string): Promise<RankedItem[]> {
    const needle = query.toLowerCase().trim();
    if (needle.length === 0) return [];

    const allRecords = await this.cache.getAll();
    const matched = allRecords.filter(
      (r) => r.name.toLowerCase().includes(needle)
    );

    if (matched.length === 0) return [];

    const { avgVolumeMap, priceHistoryMap } = await this.getOrBuildMaps(30);

    // Score with no volume/price filters so *every* match is included.
    const scored = this.scoreAndFilter(matched, 0, 0, 0, avgVolumeMap, priceHistoryMap);
    const sorted = this.sortDescending(scored);
    return sorted.slice(0, 50);
  }

  /**
   * Return **all** cached items as fully-scored {@link RankedItem} objects.
   * Used for filter-only browsing when no search query is active.
   * Results are capped at {@link maxResults} to keep DOM rendering fast.
   *
   * @param maxResults - Maximum items to return (default 200).
   * @returns All cached items ranked by `tradedValue`.
   */
  async getAllScored(maxResults = 200): Promise<RankedItem[]> {
    const allRecords = await this.cache.getAll();
    if (allRecords.length === 0) return [];

    const { avgVolumeMap, priceHistoryMap } = await this.getOrBuildMaps(30);
    const scored = this.scoreAndFilter(allRecords, 0, 0, 0, avgVolumeMap, priceHistoryMap);
    const sorted = this.sortDescending(scored);
    return maxResults > 0 ? sorted.slice(0, maxResults) : sorted;
  }

  /**
   * Look up cached items by an exact set of names and return fully-scored
   * {@link RankedItem} objects.  Used to render the user's favourites list.
   *
   * @param names - Set of item names to retrieve (case-sensitive, must match cache keys).
   * @returns Matching items ranked by `tradedValue`.
   */
  async getItemsByNames(names: Set<string>): Promise<RankedItem[]> {
    if (names.size === 0) return [];

    const allRecords = await this.cache.getAll();
    const matched = allRecords.filter((r) => names.has(r.name));
    if (matched.length === 0) return [];

    const { avgVolumeMap, priceHistoryMap } = await this.getOrBuildMaps(30);

    const scored = this.scoreAndFilter(matched, 0, 0, 0, avgVolumeMap, priceHistoryMap);
    return this.sortDescending(scored);
  }

  /**
   * Convenience wrapper: run the pipeline **and** format the result in one call.
   *
   * @returns A formatted string ready for LLM context injection.
   */
  async getFormattedTop(): Promise<string> {
    const items = await this.getTopItems();
    return this.formatForLLM(items);
  }

  /**
   * Build a broader dataset specifically for LLM chat context.
   *
   * Returns the top {@link LLM_CONTEXT_TOP_N} items by traded value with
   * **no volume or price filters**, giving the LLM a much wider view of
   * the market than the UI's filtered top-20 panel.
   *
   * Uses a compact line format (no repeated field labels) to minimise
   * payload size while preserving all analytical data.
   *
   * @returns A formatted string with up to 100 items for LLM context injection.
   */
  async getFormattedForLLM(): Promise<string> {
    const items = await this.getTopItems({
      topN: LLM_CONTEXT_TOP_N,
      minVolume: 0,
      maxVolume: 0,
      maxPrice: 0,
    });
    return this.formatForLLMCompact(items);
  }

  /**
   * Compact LLM serialisation — same data as {@link formatForLLM} but with
   * abbreviated field labels to reduce payload size.
   *
   * Header line explains the field order so each data line stays short:
   * ```
   * # Fields: Name | Price | Buy | Sell | Profit | Limit | EffVol | 4HCap | TaxGap | Alch | Velocity | Slope | Vol% | Pred
   * 1. Blood rune | 618 | 612 | 637 | 12 | 25K | 150K | 15.45M | 13 | 480 | Insta-Flip | +0.5 | 2.3% | 620
   * ```
   *
   * @param items - Pre-ranked items.
   * @returns Multi-line string optimised for minimal payload size.
   */
  private formatForLLMCompact(items: RankedItem[]): string {
    if (items.length === 0) {
      return "[No liquid items available — cache may be empty.]";
    }

    const header = `=== RS3 Grand Exchange — Top ${items.length} by Traded Value (unfiltered) ===`;
    const legend = "# Fields: Name | Price | Buy | Sell | Profit | Limit | EffVol | 4HCap | TaxGap | Alch | Velocity | ROT(gp/hr) | Slope | Vol% | Pred | Flags";

    const lines = items.map((item, idx) => {
      const rank = String(idx + 1).padStart(2, " ");
      const price = this.formatGp(item.price);
      const buy = this.formatGp(item.recBuyPrice);
      const sell = this.formatGp(item.recSellPrice);
      const profit = this.formatGp(item.estFlipProfit);
      const limit = item.buyLimit != null
        ? this.formatGp(item.buyLimit)
        : "?";
      const effVol = this.formatGp(item.effectivePlayerVolume);
      const cap4h = item.maxCapitalPer4H > 0
        ? this.formatGp(item.maxCapitalPer4H)
        : "?";
      const taxGap = this.formatGp(item.taxGap);
      const alch = typeof item.highAlch === "number" && item.highAlch > 0
        ? this.formatGp(item.highAlch)
        : item.highAlch === false ? "N/A" : "?";
      const velocity = item.tradeVelocity;
      const rot = this.formatGp(item.returnOnTime);
      const slope = item.linearSlope >= 0
        ? `+${item.linearSlope.toFixed(1)}`
        : item.linearSlope.toFixed(1);
      const vol = `${(item.volatility * 100).toFixed(1)}%`;
      const pred = this.formatGp(Math.round(item.predictedNextPrice));
      const flags: string[] = [];
      if (item.isRisky) flags.push("⚠RISKY");
      if (item.priceHistory.length < 3) flags.push("LIMITED-DATA");
      if (item.volumeSpikeMultiplier > 0) flags.push(`🔥${item.volumeSpikeMultiplier}x`);
      const flagStr = flags.length > 0 ? " " + flags.join(" ") : "";
      return `${rank}. ${item.name} | ${price} | ${buy} | ${sell} | ${profit} | ${limit} | ${effVol} | ${cap4h} | ${taxGap} | ${alch} | ${velocity} | ${rot} | ${slope} | ${vol} | ${pred}${flagStr}`;
    });

    return [header, legend, ...lines].join("\n");
  }

  /**
   * Serialise a list of {@link RankedItem} objects into a compact,
   * human-readable (and LLM-friendly) string block.
   *
   * Output format per line:
   * ```
   * 1. Blood rune | Price: 618 gp | Limit: 25,000 | Eff. Vol: 150,000 | Max 4H Capital: 15.45M gp
   * ```
   *
   * @param items - Pre-ranked items (as returned by {@link getTopItems}).
   * @returns Multi-line string suitable for embedding in an LLM prompt.
   */
  formatForLLM(items: RankedItem[]): string {
    if (items.length === 0) {
      return "[No liquid items available — cache may be empty.]";
    }

    const header = `=== RS3 Grand Exchange — Top ${items.length} by Player Traded Value ===`;
    const divider = "=".repeat(header.length);

    const lines = items.map((item, idx) => {
      const rank = String(idx + 1).padStart(2, " ");
      const price = this.formatGp(item.price);
      const limit = item.buyLimit != null
        ? item.buyLimit.toLocaleString("en-US")
        : "Unknown";
      const effVol = item.effectivePlayerVolume.toLocaleString("en-US");
      const cap4h = item.maxCapitalPer4H > 0
        ? `${this.formatGp(item.maxCapitalPer4H)} gp`
        : "Unknown";
      const risk = item.isRisky ? " ⚠ RISKY" : "";
      const recBuy = this.formatGp(item.recBuyPrice);
      const recSell = this.formatGp(item.recSellPrice);
      const flipPft = this.formatGp(item.estFlipProfit);
      const hype = item.volumeSpikeMultiplier > 0
        ? ` | 🔥 ${item.volumeSpikeMultiplier}x Vol Spike`
        : "";
      const slope = item.linearSlope >= 0 ? `+${item.linearSlope.toFixed(1)}` : item.linearSlope.toFixed(1);
      const vol = (item.volatility * 100).toFixed(1);
      const predicted = this.formatGp(Math.round(item.predictedNextPrice));
      const alch = typeof item.highAlch === "number" && item.highAlch > 0
        ? `High Alch: ${this.formatGp(item.highAlch)} gp`
        : item.highAlch === false ? "High Alch: Not Alchable" : "High Alch: Unknown";
      const velocity = item.tradeVelocity;
      const rot = this.formatGp(item.returnOnTime);
      const histLen = item.priceHistory.length;
      const histNote = histLen < 3 ? " [LIMITED DATA]" : "";
      return `${rank}. ${item.name} | GE Price: ${price} gp | Buy ≤ ${recBuy} | Sell ≥ ${recSell} | Profit: ${flipPft} gp/ea | Limit: ${limit} | Eff. Vol: ${effVol} | Max 4H Capital: ${cap4h} | Tax Gap: ${this.formatGp(item.taxGap)} gp | ${alch} | Velocity: ${velocity} | ROT: ${rot} gp/hr | 30d Trend Slope: ${slope} | Volatility: ${vol}%${histNote} | Predicted 24h Price: ${predicted} gp${risk}${hype}`;
    });

    return [header, ...lines, divider].join("\n");
  }

  // ─── Private Helpers ──────────────────────────────────────────────────

  /**
   * Compute player-constrained liquidity scores and apply all filters.
   *
   * For each record:
   *  - `effectivePlayerVolume = min(globalVolume, buyLimit × 6)`
   *    (falls back to `globalVolume` when `buyLimit` is unknown)
   *  - `maxCapitalPer4H = price × buyLimit` (0 when unknown)
   *  - `tradedValue = price × effectivePlayerVolume` (player-constrained)
   *
   * Volume filters (`minVolume` / `maxVolume`) are applied against the
   * **global daily GE volume** so that preset filters (High / Low)
   * reflect actual market liquidity rather than a single player's
   * buy-limit-constrained throughput.
   *
   * @param records      - Raw records from the cache.
   * @param minVolume    - Minimum global daily volume (inclusive lower bound).
   * @param maxVolume    - Maximum global daily volume (0 = no cap).
   * @param maxPrice     - Maximum item price in gp (0 = no cap).
   * @returns Scored items that pass all filters.
   */
  private scoreAndFilter(
    records: StoredPriceRecord[],
    minVolume: number,
    maxVolume: number,
    maxPrice: number,
    avgVolumeMap: Map<string, number>,
    priceHistoryMap: Map<string, number[]>,
  ): RankedItem[] {
    const result: RankedItem[] = [];

    for (const record of records) {
      const globalVol = Number(record.volume) || 0;
      const limit = record.buyLimit != null && record.buyLimit > 0
        ? record.buyLimit
        : undefined;

      // Player-constrained daily volume: 6 × 4-hour windows per day.
      const dailyPlayerLimit = limit != null ? limit * 6 : globalVol;
      const effectivePlayerVolume = Math.min(globalVol, dailyPlayerLimit);

      // Apply filters against raw global daily volume so that High / Low
      // presets meaningfully distinguish market liquidity tiers.
      if (globalVol <= minVolume) continue;
      if (maxVolume > 0 && globalVol > maxVolume) continue;
      if (maxPrice > 0 && record.price > maxPrice) continue;

      const maxCapitalPer4H = limit != null ? record.price * limit : 0;

      // Tax gap: minimum spread (in gp) needed to break even after 2% GE tax.
      // Use floor-based tax to match the official RS3 engine rounding.
      const breakEvenSell = Math.ceil(record.price / 0.98);
      const breakEvenTax = record.price <= 50 ? 0 : Math.floor(breakEvenSell * 0.02);
      const taxGap = breakEvenTax + (breakEvenSell - record.price - breakEvenTax);

      // Recommended buy price: ~1% below current GE mid-price.
      const recBuyPrice = Math.max(
        1,
        Math.floor(record.price * 0.99)
      );
      // Recommended sell price: high enough above the buy price to cover
      // the 2% GE tax and still yield a meaningful margin.
      // Target: sell at ~3% above mid-price → ~2% spread after tax.
      let recSellPrice = Math.max(
        recBuyPrice + 1,
        Math.ceil(record.price * 1.03)
      );
      // High Alchemy floor: never recommend selling below the alch value.
      recSellPrice = Math.max(recSellPrice, typeof record.highAlch === "number" ? record.highAlch : 0);
      // Estimated per-item flip profit: sell − buy − 2% GE tax on the sale.
      // Official RS3 wiki formula: floor(price * 2%), exempt at ≤ 50 gp.
      let expectedTax = Math.floor(recSellPrice * 0.02);
      if (recSellPrice <= 50) expectedTax = 0;
      const estFlipProfit = recSellPrice - recBuyPrice - expectedTax;

      // Risk flag: only cheap items (< 500 gp) where the absolute tax
      // gap is large relative to realistic spreads.
      const isRisky = record.price < 500;

      // Volume spike: compare today’s volume to the 7-day SMA.
      const avgVol = avgVolumeMap.get(record.name);
      let volumeSpikeMultiplier = 0;
      if (avgVol != null && avgVol > 0 && globalVol > avgVol * 1.5) {
        volumeSpikeMultiplier = +((globalVol / avgVol).toFixed(1));
      }

      // Price history sparkline data: historical prices + today.
      const histPrices = priceHistoryMap.get(record.name) ?? [];
      const priceHistory = [...histPrices, record.price];

      // ── Time-series indicators (30-day window) ────────────────────────
      const ema30d = calculateEMA(priceHistory);
      const volatility = calculateVolatility(priceHistory);
      const { slope: linearSlope, predictedNext: predictedNextPrice } =
        calculateLinearTrend(priceHistory);

      // 7-day price momentum: classify trend based on overall % change.
      let priceTrend: "Uptrend" | "Downtrend" | "Stable" = "Stable";
      if (priceHistory.length >= 2 && priceHistory[0] > 0) {
        const percentChange = (record.price - priceHistory[0]) / priceHistory[0];
        if (percentChange < -0.05) priceTrend = "Downtrend";
        else if (percentChange > 0.05) priceTrend = "Uptrend";
      }

      // Trade velocity: qualitative speed tier based on hourly volume vs buy limit.
      const hourlyVolume = Math.floor(globalVol / 24);
      const safeBuyLimit = (limit != null && limit > 0) ? limit : 0;
      let tradeVelocity: "Insta-Flip" | "Active" | "Slow" | "Very Slow";
      if (hourlyVolume > 5000 || (safeBuyLimit > 0 && hourlyVolume > safeBuyLimit * 5)) {
        tradeVelocity = "Insta-Flip";
      } else if (hourlyVolume > 500 || (safeBuyLimit > 0 && hourlyVolume > safeBuyLimit)) {
        tradeVelocity = "Active";
      } else if (hourlyVolume > 50) {
        tradeVelocity = "Slow";
      } else {
        tradeVelocity = "Very Slow";
      }

      // ── Return on Time (ROT) — gp/hr estimate ────────────────────────
      // ROT = estFlipProfit × estHourlyFillRate × fillFactor.
      // Hourly fill rate is globalVol / 24 (best available estimate from
      // the Weird Gloop rolling-24h volume — RS3 has no sub-daily API).
      const estHourlyFillRate = globalVol / 24;
      const returnOnTime = safeBuyLimit > 0 && estHourlyFillRate > 0
        ? Math.round(estFlipProfit * estHourlyFillRate * MarketAnalyzerService.ROT_FILL_FACTOR)
        : 0;

      // ── Scoring adjustments based on predictive indicators ──────────
      let tradedValue = record.price * effectivePlayerVolume;
      // Reward upward-trending items (positive linear slope).
      if (linearSlope > 0) tradedValue *= 1.05;
      // Penalise highly volatile items (daily σ > 10 %).
      if (volatility > 0.10) tradedValue *= 0.90;

      result.push({
        name: record.name,
        itemId: record.id,
        price: record.price,
        recBuyPrice,
        volume: globalVol,
        tradedValue,
        buyLimit: record.buyLimit,
        effectivePlayerVolume,
        maxCapitalPer4H,
        taxGap,
        recSellPrice,
        estFlipProfit,
        isRisky,
        volumeSpikeMultiplier,
        tradeVelocity,
        priceHistory,
        priceTrend,
        ema30d,
        volatility,
        returnOnTime,
        linearSlope,
        predictedNextPrice,
        highAlch: record.highAlch,
      });
    }

    return result;
  }

  /**
   * Sort an array of ranked items **descending** by `tradedValue`.
   * Returns a new array; the input is not mutated.
   *
   * @param items - Unsorted scored items.
   * @returns A new array sorted from highest to lowest traded value.
   */
  private sortDescending(items: RankedItem[]): RankedItem[] {
    return [...items].sort((a, b) => b.tradedValue - a.tradedValue);
  }

  /**
   * Fetch recent history from IndexedDB and build a
   * `Map<itemName, averageVolume>` for volume-spike detection.
   *
   * With the v3 intraday schema, multiple records per day may exist.
   * We deduplicate by calendar day (taking the max volume per day) so
   * the SMA remains comparable to the legacy daily-keyed behaviour.
   *
   * @param days - Number of calendar days to average over.
   * @returns A map from item name to its simple moving average volume.
   */
  private async buildAvgVolumeMap(days: number): Promise<Map<string, number>> {
    const map = new Map<string, number>();
    try {
      const history = await this.cache.getRecentHistory(days);
      const today = new Date().toISOString().slice(0, 10);

      // Group volumes by (item, day), keeping the max volume per day to
      // collapse intraday duplicates into one daily figure.
      const grouped = new Map<string, Map<string, number>>();
      for (const rec of history) {
        const day = rec.day ?? new Date(rec.timestamp).toISOString().slice(0, 10);
        if (day === today) continue;
        const vol = Number(rec.volume) || 0;
        let dayMap = grouped.get(rec.name);
        if (!dayMap) {
          dayMap = new Map();
          grouped.set(rec.name, dayMap);
        }
        const existing = dayMap.get(day) ?? 0;
        if (vol > existing) dayMap.set(day, vol);
      }

      for (const [name, dayMap] of grouped) {
        const vols = [...dayMap.values()];
        const avg = vols.reduce((s, v) => s + v, 0) / vols.length;
        map.set(name, avg);
      }
      console.log(`[MarketAnalyzer] SMA map built from ${history.length} history rows (${map.size} items).`);
    } catch (err) {
      console.warn("[MarketAnalyzer] Could not build SMA map — spike detection disabled.", err);
    }
    return map;
  }

  /**
   * Build a `Map<itemName, number[]>` of chronological daily prices
   * for sparkline rendering.  Each array contains one price per past day
   * (does **not** include today — the caller appends the current price).
   *
   * With the v3 intraday schema, multiple records per day may exist.
   * We pick the *last* (most recent) price for each calendar day to
   * produce a clean daily close series.
   *
   * When the local IndexedDB history is sparse (most items have ≤ 1 day),
   * the method falls back to the Weird Gloop `last90d` API to fetch
   * real historical prices, extracting data for the last {@link days} days.
   *
   * @param days - Number of calendar days to look back.
   */
  private async buildPriceHistoryMap(days: number): Promise<Map<string, number[]>> {
    const map = new Map<string, number[]>();
    try {
      const history = await this.cache.getRecentHistory(days);
      const today = new Date().toISOString().slice(0, 10);

      // Collect (day, price, timestamp) per item, excluding today.
      // Use a Map<day, { price, ts }> to keep the latest price per day.
      const grouped = new Map<string, Map<string, { price: number; ts: string }> >();
      for (const rec of history) {
        const day = rec.day ?? new Date(rec.timestamp).toISOString().slice(0, 10);
        if (day === today) continue;
        let dayMap = grouped.get(rec.name);
        if (!dayMap) {
          dayMap = new Map();
          grouped.set(rec.name, dayMap);
        }
        const existing = dayMap.get(day);
        if (!existing || rec.timestamp > existing.ts) {
          dayMap.set(day, { price: rec.price, ts: rec.timestamp });
        }
      }

      // Sort by calendar day and extract prices.
      for (const [name, dayMap] of grouped) {
        const sorted = [...dayMap.entries()]
          .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
        map.set(name, sorted.map(([, v]) => v.price));
      }

      // ── Sparse-data fallback: fetch from Weird Gloop API ──────────────
      // If very few items have multi-day history, pull from the API so
      // sparklines can render immediately after install / cache clear.
      //
      // Why an absolute threshold (not a ratio): `bulkInsert` writes a
      // today-snapshot for every price record, so after a full market scan
      // *all* ~7 000 items have ≥1 history row — but only items with
      // dedicated history fetches (seeds + prior fallback runs) have ≥2.
      // A percentage-based check against 7 000 items would never be
      // satisfied and the fallback would re-fetch on every startup.
      //
      // Threshold of 400 means: after seeds (~230 items) + one fallback
      // round (200 items) the condition is met and subsequent startups
      // skip the ~40 s API call.
      // Capped at 200 items since the API only accepts 1 item per request.
      const itemsWithSufficient = [...grouped.values()]
        .filter((dayMap) => dayMap.size >= 2).length;
      const sparse = itemsWithSufficient < 400;

      if (!sparse) {
        console.log(
          `[MarketAnalyzer] History coverage OK: ${itemsWithSufficient} items have ≥ 2 days — skipping API fallback.`
        );
      }

      if (sparse) {
        // The /last90d API only supports 1 item per request, so cap the
        // fallback to keep UI responsive (~40 s at 200 ms/item).
        // Fetch items that are in the price cache but have no/sparse history.
        const allItems = await this.cache.getAll();
        const allNames = allItems.map((r) => r.name);
        // Prioritise items with 0–1 history rows.
        const needsHistory = allNames.filter((n) => (map.get(n)?.length ?? 0) < 2);
        const SPARSE_CAP = 200;
        const namesToFetch = needsHistory.length > SPARSE_CAP
          ? needsHistory.slice(0, SPARSE_CAP)
          : needsHistory;
        console.log(
          `[MarketAnalyzer] Local price history is sparse (only ${itemsWithSufficient} items have ≥ 2 days, need 400) ` +
          `— fetching ${namesToFetch.length} items from Weird Gloop API…`
        );
        const apiMap = await this.fetchAPIHistory(namesToFetch, days);
        // Merge: API data fills in gaps; local data takes precedence when present.
        for (const [name, prices] of apiMap) {
          if (!map.has(name) || (map.get(name)!.length < prices.length)) {
            map.set(name, prices);
          }
        }
      }
    } catch (err) {
      console.warn("[MarketAnalyzer] Could not build price history map.", err);
    }
    return map;
  }

  /**
   * Fetch historical prices from the Weird Gloop API and extract daily
   * closing prices for the last {@link days} days.
   *
   * Delegates to {@link WeirdGloopService.fetchHistoricalPrices} which sends
   * individual per-item requests (the `/last90d` endpoint only supports 1
   * item) with rate-limit-safe pauses.  Results are also persisted to
   * IndexedDB so subsequent calls hit the cache instead.
   *
   * @param itemNames - Canonical RS3 item names.
   * @param days      - Number of recent days to extract from the 90-day window.
   * @returns A `Map<itemName, number[]>` of chronological daily prices.
   */
  // Individual per-item history via WeirdGloopService — March 2026
  private async fetchAPIHistory(
    itemNames: string[],
    days: number,
  ): Promise<Map<string, number[]>> {
    const result = new Map<string, number[]>();
    const todayStr = new Date().toISOString().slice(0, 10);

    try {
      const api = new WeirdGloopService();
      const historyMap = await api.fetchHistoricalPrices(itemNames, days);

      // Persist fetched data to IndexedDB for future use.
      if (historyMap.size > 0) {
        try { await this.cache.bulkInsertHistory(historyMap); } catch { /* non-critical */ }
      }

      // Transform WeirdGloopHistoryEntry[] → number[] (daily prices).
      for (const [name, entries] of historyMap) {
        const dayMap = new Map<string, number>();
        for (const e of entries) {
          const day = new Date(e.timestamp).toISOString().slice(0, 10);
          if (day === todayStr) continue;
          dayMap.set(day, e.price);
        }
        const sorted = [...dayMap.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1));
        if (sorted.length > 0) {
          result.set(name, sorted.map((d) => d[1]));
        }
      }
    } catch (err) {
      console.warn("[MarketAnalyzer] fetchAPIHistory failed:", err);
    }

    console.log(`[MarketAnalyzer] API history fetched for ${result.size} items.`);
    return result;
  }

  /**
   * Format a large gp value into a human-readable abbreviated string.
   *
   * | Range          | Suffix | Example          |
   * |----------------|--------|------------------|
   * | ≥ 1 000 000 000 000 | T      | 2.65T            |
   * | ≥ 1 000 000 000     | B      | 1.42B            |
   * | ≥ 1 000 000         | M      | 312.5M           |
   * | ≥ 1 000             | K      | 4.2K             |
   * | < 1 000             | (raw)  | 750              |
   *
   * @param value - Raw gp amount.
   * @returns Abbreviated string with up to 2 decimal places.
   */
  private formatGp(value: number): string {
    const abs = Math.abs(value);
    const sign = value < 0 ? "-" : "";

    if (abs >= 1_000_000_000_000) return `${sign}${(abs / 1_000_000_000_000).toFixed(2)}T`;
    if (abs >= 1_000_000_000) return `${sign}${(abs / 1_000_000_000).toFixed(2)}B`;
    if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(2)}M`;
    if (abs >= 1_000) return `${sign}${(abs / 1_000).toFixed(2)}K`;
    return `${sign}${abs.toLocaleString("en-US")}`;
  }
}
