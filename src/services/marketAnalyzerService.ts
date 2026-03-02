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
 * All calculations are pure math on local data — no network calls.
 */

import { CacheService } from "./cacheService";
import type {
  MarketAnalyzerConfig,
  RankedItem,
  StoredPriceRecord,
} from "./types";

/** Default analyser settings. */
const DEFAULTS: MarketAnalyzerConfig = {
  topN: 20,
  minVolume: 0,
};

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

    // Build a volume-SMA map from the last 7 days of history.
    const avgVolumeMap = await this.buildAvgVolumeMap(7);

    // Build a price-history map for sparklines.
    const priceHistoryMap = await this.buildPriceHistoryMap(7);

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

    const avgVolumeMap = await this.buildAvgVolumeMap(7);
    const priceHistoryMap = await this.buildPriceHistoryMap(7);

    // Score with no volume/price filters so *every* match is included.
    const scored = this.scoreAndFilter(matched, 0, 0, 0, avgVolumeMap, priceHistoryMap);
    const sorted = this.sortDescending(scored);
    return sorted.slice(0, 50);
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

    const avgVolumeMap = await this.buildAvgVolumeMap(7);
    const priceHistoryMap = await this.buildPriceHistoryMap(7);

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
      return `${rank}. ${item.name} | GE Price: ${price} gp | Buy ≤ ${recBuy} | Sell ≥ ${recSell} | Profit: ${flipPft} gp/ea | Limit: ${limit} | Eff. Vol: ${effVol} | Max 4H Capital: ${cap4h} | Tax Gap: ${this.formatGp(item.taxGap)} gp${risk}${hype}`;
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
   * Volume filters (`minVolume` / `maxVolume`) are applied against
   * `effectivePlayerVolume` so they reflect a single player’s throughput.
   *
   * @param records      - Raw records from the cache.
   * @param minVolume    - Minimum effective player volume (inclusive lower bound).
   * @param maxVolume    - Maximum effective player volume (0 = no cap).
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

      // Apply filters against the effective (player) volume.
      if (effectivePlayerVolume <= minVolume) continue;
      if (maxVolume > 0 && effectivePlayerVolume > maxVolume) continue;
      if (maxPrice > 0 && record.price > maxPrice) continue;

      const maxCapitalPer4H = limit != null ? record.price * limit : 0;

      // Tax gap: minimum spread (in gp) needed to break even after 2% GE tax.
      const breakEvenSell = Math.ceil(record.price / 0.98);
      const taxGap = breakEvenSell - record.price;

      // Recommended buy price: ~1% below current GE mid-price.
      const recBuyPrice = Math.max(
        1,
        Math.floor(record.price * 0.99)
      );
      // Recommended sell price: high enough above the buy price to cover
      // the 2% GE tax and still yield a meaningful margin.
      // Target: sell at ~3% above mid-price → ~2% spread after tax.
      const recSellPrice = Math.max(
        recBuyPrice + 1,
        Math.ceil(record.price * 1.03)
      );
      // Estimated per-item flip profit: sell − buy − 2% GE tax on the sale.
      const geTax = Math.floor(recSellPrice * 0.02);
      const estFlipProfit = recSellPrice - recBuyPrice - geTax;

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

      result.push({
        name: record.name,
        itemId: record.id,
        price: record.price,
        recBuyPrice,
        volume: globalVol,
        tradedValue: record.price * effectivePlayerVolume,
        buyLimit: record.buyLimit,
        effectivePlayerVolume,
        maxCapitalPer4H,
        taxGap,
        recSellPrice,
        estFlipProfit,
        isRisky,
        volumeSpikeMultiplier,
        priceHistory,
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
   * @param days - Number of calendar days to average over.
   * @returns A map from item name to its simple moving average volume.
   */
  private async buildAvgVolumeMap(days: number): Promise<Map<string, number>> {
    const map = new Map<string, number>();
    try {
      const history = await this.cache.getRecentHistory(days);
      // Group volumes by item name, excluding today so the SMA only
      // contains *past* data (avoids self-comparison on first fetch).
      const today = new Date().toISOString().slice(0, 10);
      const grouped = new Map<string, number[]>();
      for (const rec of history) {
        if (rec.day === today) continue;
        const arr = grouped.get(rec.name);
        const vol = Number(rec.volume) || 0;
        if (arr) {
          arr.push(vol);
        } else {
          grouped.set(rec.name, [vol]);
        }
      }
      for (const [name, vols] of grouped) {
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
   * (does **not** include today \u2014 the caller appends the current price).
   *
   * @param days - Number of calendar days to look back.
   */
  private async buildPriceHistoryMap(days: number): Promise<Map<string, number[]>> {
    const map = new Map<string, number[]>();
    try {
      const history = await this.cache.getRecentHistory(days);
      const today = new Date().toISOString().slice(0, 10);

      // Collect (day, price) pairs per item, excluding today.
      const grouped = new Map<string, { day: string; price: number }[]>();
      for (const rec of history) {
        if (rec.day === today) continue;
        const arr = grouped.get(rec.name);
        const entry = { day: rec.day, price: rec.price };
        if (arr) {
          arr.push(entry);
        } else {
          grouped.set(rec.name, [entry]);
        }
      }

      // Sort chronologically and extract prices.
      for (const [name, entries] of grouped) {
        entries.sort((a, b) => (a.day < b.day ? -1 : a.day > b.day ? 1 : 0));
        map.set(name, entries.map((e) => e.price));
      }
    } catch (err) {
      console.warn("[MarketAnalyzer] Could not build price history map.", err);
    }
    return map;
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
