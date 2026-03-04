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
  /** Pause (ms) between sequential individual history requests. */
  private static readonly HISTORY_ITEM_DELAY_MS = 200;

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
   * {@link itemNames}.  The `/last90d` endpoint only accepts **one item per
   * request**, so items are dispatched individually with
   * {@link HISTORY_ITEM_DELAY_MS} pauses between requests.
   *
   * Individual failures are logged but do **not** reject the returned
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

    // The /last90d endpoint only supports 1 item per request — individual
    // fetches with pacing to respect rate limits.
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const result = new Map<string, WeirdGloopHistoryEntry[]>();
    let skippedNotFound = 0;   // API returned {success:false} or {error:…}
    let skippedNoData = 0;     // Response OK but no matching array for name
    let skippedEmpty = 0;      // Array present but all entries outside date range
    let skippedRetry = 0;      // All retries exhausted (null response)

    console.log(
      `[WeirdGloopService] Fetching last90d history for ${itemNames.length} item(s) ` +
      `(keeping last ${days} days)…`
    );

    for (let idx = 0; idx < itemNames.length; idx++) {
      const name = itemNames[idx];
      const url = `https://api.weirdgloop.org/exchange/history/rs/last90d?name=${encodeURIComponent(name)}`;

      try {
        const resp = await WeirdGloopService.fetchWithRetry(url);
        if (!resp) {
          skippedRetry++;
          console.warn(`[WeirdGloopService] History for "${name}" — all retries exhausted.`);
          continue;
        }
        const json: WeirdGloopHistoryResponse = await resp.json();

        // Detect API-level error responses (e.g. "Item(s) not found",
        // stealth rate limits) that return 200 OK with an error body.
        if ((json as any).success === false || (json as any).error) {
          skippedNotFound++;
          continue;
        }

        // Exact key lookup; fall back to case-insensitive search in case
        // the API returns a slightly different casing than requested.
        let entries = json[name];
        if (!Array.isArray(entries)) {
          const lc = name.toLowerCase();
          for (const key of Object.keys(json)) {
            if (key.toLowerCase() === lc && Array.isArray(json[key])) {
              entries = json[key];
              break;
            }
          }
        }
        if (!Array.isArray(entries)) {
          skippedNoData++;
          continue;
        }

        const filtered = entries
          .filter((e) => e.timestamp >= cutoff)
          .sort((a, b) => a.timestamp - b.timestamp);

        if (filtered.length > 0) {
          result.set(name, filtered);
        } else {
          skippedEmpty++;
        }
      } catch (err) {
        console.error(`[WeirdGloopService] History for "${name}" failed:`, err);
      }

      // Pause between requests to stay under rate limit.
      if (idx < itemNames.length - 1) {
        await WeirdGloopService.sleep(WeirdGloopService.HISTORY_ITEM_DELAY_MS);
      }

      // Log progress every 50 items.
      if ((idx + 1) % 50 === 0) {
        console.log(
          `[WeirdGloopService] History progress: ${idx + 1}/${itemNames.length} ` +
          `(${result.size} fetched so far)…`
        );
      }
    }

    console.log(
      `[WeirdGloopService] Historical data fetched for ${result.size} / ${itemNames.length} items.`
    );
    if (skippedNotFound + skippedNoData + skippedEmpty + skippedRetry > 0) {
      console.log(
        `[WeirdGloopService] Skipped: ${skippedNotFound} not-found, ${skippedNoData} no-data, ` +
        `${skippedEmpty} empty-after-filter, ${skippedRetry} retry-exhausted.`
      );
    }
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
