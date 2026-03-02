/**
 * @module WeirdGloopService
 * HTTP client for the Weird Gloop RS3 Grand Exchange API.
 *
 * Responsibilities:
 *  - Accept an arbitrarily large list of item names.
 *  - Chunk them into batches of {@link WeirdGloopServiceConfig.batchSize} (default 100).
 *  - Fire all batches concurrently via `Promise.allSettled` so one failure
 *    does not abort the entire ingest.
 *  - Return a consolidated map of item → price record.
 *
 * @see https://api.weirdgloop.org/#/exchange
 */

import type {
  WeirdGloopLatestResponse,
  WeirdGloopHistoryEntry,
  WeirdGloopHistoryResponse,
  WeirdGloopPriceRecord,
  WeirdGloopServiceConfig,
} from "./types";

/** Base URL for the Weird Gloop RS3 latest-price endpoint. */
const BASE_URL = "https://api.weirdgloop.org/exchange/history/rs/latest";

/**
 * Service class that encapsulates all communication with the Weird Gloop
 * Grand Exchange REST API.
 *
 * @example
 * ```ts
 * const api = new WeirdGloopService();
 * const prices = await api.fetchLatestPrices([
 *   "Blue partyhat", "Christmas cracker", "Bread",
 * ]);
 * console.log(prices.get("Bread")?.price);
 * ```
 */
export class WeirdGloopService {
  /** Maximum items per HTTP request. */
  private readonly batchSize: number;

  /** Maximum retry attempts on 429 / transient errors. */
  private static readonly MAX_RETRIES = 4;
  /** Base delay (ms) for exponential backoff — doubled on each retry. */
  private static readonly BACKOFF_BASE_MS = 2_000;
  /** Small pause (ms) between sequential history batches. */
  private static readonly HISTORY_GROUP_DELAY_MS = 1_000;

  /**
   * Create a new service instance.
   * @param config - Optional overrides for batch size, etc.
   */
  constructor(config?: Partial<WeirdGloopServiceConfig>) {
    this.batchSize = config?.batchSize ?? 100;
  }

  // ─── Public API ───────────────────────────────────────────────────────

  /**
   * Fetch the latest GE snapshot for every item in {@link itemNames}.
   *
   * Items are batched into groups of {@link batchSize} and all batches are
   * dispatched concurrently.  Individual batch failures are logged to the
   * console but do **not** reject the returned promise — successfully
   * fetched records are always returned.
   *
   * @param itemNames - Canonical RS3 item names (case-sensitive as they
   *                    appear on the RS Wiki).
   * @returns A `Map<string, WeirdGloopPriceRecord>` keyed by item name.
   */
  async fetchLatestPrices(
    itemNames: string[]
  ): Promise<Map<string, WeirdGloopPriceRecord>> {
    if (itemNames.length === 0) {
      console.warn("[WeirdGloopService] fetchLatestPrices called with an empty item list.");
      return new Map();
    }

    const batches = this.chunkArray(itemNames, this.batchSize);
    console.log(
      `[WeirdGloopService] Fetching ${itemNames.length} items in ${batches.length} batch(es) of up to ${this.batchSize}…`
    );

    // Execute batches sequentially to stay within API rate limits.
    const consolidated = new Map<string, WeirdGloopPriceRecord>();

    for (let idx = 0; idx < batches.length; idx++) {
      try {
        const json = await this.fetchBatch(batches[idx], idx);
        for (const [name, record] of Object.entries(json)) {
          consolidated.set(name, record);
        }
      } catch (err) {
        console.error("[WeirdGloopService] Batch failed:", err);
      }
      // Brief pause between batches to avoid rate-limiting.
      if (idx < batches.length - 1) {
        await WeirdGloopService.sleep(300);
      }
    }

    console.log(
      `[WeirdGloopService] Successfully fetched ${consolidated.size} / ${itemNames.length} price records.`
    );
    return consolidated;
  }

  /**
   * Fetch up to 90 days of historical daily prices for every item in
   * {@link itemNames}.  Items are batched into pipe-delimited requests of
   * {@link HISTORY_BATCH_SIZE} (default 50) and dispatched **sequentially**
   * to avoid rate-limiting.
   *
   * Individual batch failures are logged but do **not** reject the returned
   * promise — successfully fetched histories are always returned.
   *
   * @param itemNames - Canonical RS3 item names.
   * @param days      - Number of recent days to extract from the 90-day
   *                    window (default 30).  Pass 90 to keep the full range.
   * @returns A `Map<itemName, WeirdGloopHistoryEntry[]>` of chronological
   *          daily snapshots, filtered to the requested window.
   */
  async fetchHistoricalPrices(
    itemNames: string[],
    days: number = 30,
  ): Promise<Map<string, WeirdGloopHistoryEntry[]>> {
    if (itemNames.length === 0) return new Map();

    // Batch history requests using pipe-delimited names — March 2026
    const HISTORY_BATCH_SIZE = 50;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const result = new Map<string, WeirdGloopHistoryEntry[]>();
    const batches = this.chunkArray(itemNames, HISTORY_BATCH_SIZE);

    console.log(
      `[WeirdGloopService] Fetching last90d history for ${itemNames.length} items in ` +
      `${batches.length} batch(es) of up to ${HISTORY_BATCH_SIZE} (keeping last ${days} days)…`
    );

    for (let idx = 0; idx < batches.length; idx++) {
      const batch = batches[idx];
      const nameParam = batch.map((n) => encodeURIComponent(n)).join("|");
      const url = `https://api.weirdgloop.org/exchange/history/rs/last90d?name=${nameParam}`;

      try {
        const resp = await WeirdGloopService.fetchWithRetry(url);
        if (!resp) {
          console.warn(`[WeirdGloopService] History batch ${idx + 1} — all retries exhausted.`);
          continue;
        }
        const json: WeirdGloopHistoryResponse = await resp.json();

        for (const name of batch) {
          const entries = json[name];
          if (!Array.isArray(entries)) continue;

          const filtered = entries
            .filter((e) => e.timestamp >= cutoff)
            .sort((a, b) => a.timestamp - b.timestamp);

          if (filtered.length > 0) result.set(name, filtered);
        }
      } catch (err) {
        console.error(`[WeirdGloopService] History batch ${idx + 1} failed:`, err);
      }

      // Pause between sequential batches to stay under rate limit.
      if (idx < batches.length - 1) {
        await WeirdGloopService.sleep(WeirdGloopService.HISTORY_GROUP_DELAY_MS);
      }
    }

    console.log(
      `[WeirdGloopService] Historical data fetched for ${result.size} / ${itemNames.length} items.`
    );
    return result;
  }

  // ─── Private Helpers ──────────────────────────────────────────────────

  /**
   * Fetch a single batch of items from the API.
   *
   * @param batch   - Subset of item names (≤ {@link batchSize}).
   * @param batchIdx - Zero-based index used only for logging.
   * @returns The raw JSON response body typed as {@link WeirdGloopLatestResponse}.
   * @throws {Error} If the HTTP response is not OK (status outside 200-299).
   */
  private async fetchBatch(
    batch: string[],
    batchIdx: number
  ): Promise<WeirdGloopLatestResponse> {
    // Pipe-delimit item names as required by the Weird Gloop query parameter.
    const nameParam = batch.map((n) => encodeURIComponent(n)).join("|");
    const url = `${BASE_URL}?name=${nameParam}`;

    console.debug(`[WeirdGloopService] Batch ${batchIdx}: requesting ${batch.length} items…`);

    const response = await WeirdGloopService.fetchWithRetry(url);
    if (!response) {
      throw new Error(
        `[WeirdGloopService] Batch ${batchIdx}: all retries exhausted`
      );
    }

    const json: WeirdGloopLatestResponse = await response.json();
    console.debug(
      `[WeirdGloopService] Batch ${batchIdx}: received ${Object.keys(json).length} records.`
    );
    return json;
  }

  // ─── Rate-Limit Helpers ───────────────────────────────────────────────

  /**
   * Fetch a URL with automatic retry + exponential backoff on 429 and
   * transient network errors.  Returns `null` when all retries are
   * exhausted so callers can degrade gracefully.
   *
   * @param url        - Fully-qualified URL to request.
   * @param maxRetries - Override for {@link MAX_RETRIES}.
   * @returns The successful `Response`, or `null` after all attempts fail.
   */
  private static async fetchWithRetry(
    url: string,
    maxRetries: number = WeirdGloopService.MAX_RETRIES,
  ): Promise<Response | null> {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const resp = await fetch(url, {
          method: "GET",
          headers: {
            "User-Agent":
              "RS3-GE-Analyzer-Alt1Plugin/1.0 (contact: github.com/skillbert/alt1minimal)",
            Accept: "application/json",
          },
        });

        if (resp.ok) return resp;

        // Rate-limited — back off and retry.
        if (resp.status === 429) {
          const delay = WeirdGloopService.BACKOFF_BASE_MS * Math.pow(2, attempt);
          console.warn(
            `[WeirdGloopService] 429 rate-limited (attempt ${attempt + 1}/${maxRetries + 1}). ` +
            `Waiting ${(delay / 1000).toFixed(1)}s before retry…`
          );
          await WeirdGloopService.sleep(delay);
          continue;
        }

        // Non-retryable HTTP error.
        console.error(`[WeirdGloopService] HTTP ${resp.status} for ${url.slice(0, 120)}`);
        return null;
      } catch (err) {
        // Network / CORS error — often accompanies a 429 that the browser
        // blocks before we even see the status.  Treat it as retryable.
        const delay = WeirdGloopService.BACKOFF_BASE_MS * Math.pow(2, attempt);
        console.warn(
          `[WeirdGloopService] Network error (attempt ${attempt + 1}/${maxRetries + 1}). ` +
          `Waiting ${(delay / 1000).toFixed(1)}s… [${(err as Error).message}]`
        );
        await WeirdGloopService.sleep(delay);
      }
    }
    console.error(`[WeirdGloopService] All ${maxRetries + 1} attempts failed for ${url.slice(0, 120)}`);
    return null;
  }

  /** Promise-based sleep helper. */
  private static sleep(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
  }

  /**
   * Split an array into sub-arrays of at most {@link size} elements.
   *
   * @param arr  - The source array.
   * @param size - Maximum chunk length.
   * @returns An array of chunks.
   */
  private chunkArray<T>(arr: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  }
}
