/**
 * @module WikiService
 * Client for the official RuneScape 3 Wiki structured-data APIs.
 *
 * Responsibilities:
 *  - Fetch GE buy limits in bulk from `Module:Exchange/<Item>` Lua sources.
 *  - Fetch High Alchemy values in bulk from `Module:GEHighAlchs/data.json`
 *    (single request for all alchable items, with per-item fallback).
 *
 * Guide / article text fetching has been removed — the curated
 * `coreKnowledge.ts` rules provide better, flipping-focused context for
 * the LLM than raw wiki prose.
 *
 * Uses only the native browser `fetch` API — no external dependencies.
 *
 * @see https://runescape.wiki/api.php (MediaWiki API sandbox)
 * @see https://runescape.wiki/w/Module:GEHighAlchs/data.json?action=raw
 */

/**
 * Service that retrieves structured item data (buy limits, high alch values)
 * from the official RuneScape 3 Wiki.
 *
 * High Alch values are fetched from the `Module:GEHighAlchs/data.json` bulk
 * endpoint in a single HTTP request. Items present in the response are
 * alchable (value = number); items absent are explicitly not alchable
 * (value = `false`). Falls back to per-item `Module:Exchange/<Item>` Lua
 * source parsing when the bulk endpoint is unreachable.
 *
 * @example
 * ```ts
 * const wiki = new WikiService();
 * const limits = await wiki.getBulkBuyLimits(["Blood rune", "Elder logs"]);
 * const alchs = await wiki.getBulkHighAlchValues(["Blood rune", "Elder logs"]);
 * ```
 */
export class WikiService {
  /**
   * Bulk endpoint URL that returns all alchable items and their High Alch
   * values as a flat `{ itemName: number }` JSON object.
   */
  private static readonly HIGH_ALCH_BULK_URL =
    "https://runescape.wiki/w/Module:GEHighAlchs/data.json?action=raw";
  // ─── Bulk Buy Limits (Module:Exchange) ──────────────────────────────

  /**
   * Maximum titles per MediaWiki `action=query` request.
   * The API allows up to 50 titles for anonymous (non-bot) callers.
   */
  private static readonly EXCHANGE_BATCH_SIZE = 50;

  /** Regex that extracts the `limit = <number>` value from a Lua module source. */
  private static readonly LIMIT_RE = /limit\s*=\s*(\d+)/;

  /** Regex that extracts the `alchvalue = <number>` value from a Lua module source. */
  private static readonly ALCH_RE = /alchvalue\s*=\s*(\d+)/;

  /** Regex that extracts the `value = <number>` (base item value) from a Lua module source. */
  private static readonly VALUE_RE = /\bvalue\s*=\s*(\d+)/;

  /** Regex that detects `alchable = false` — items that cannot be alched. */
  private static readonly ALCHABLE_FALSE_RE = /alchable\s*=\s*false/i;

  /**
   * Fetch GE buy limits in bulk by reading `Module:Exchange/<Item>` pages
   * from the RS3 Wiki.  Each module contains a Lua table with a `limit`
   * field representing the 4-hour buy limit.
   *
   * Item names are chunked into batches of ≤ 50 and all batches are
   * dispatched concurrently via `Promise.allSettled` — a single failing
   * batch does not prevent the rest from succeeding.
   *
   * @param itemNames - Canonical RS3 item names.
   * @returns A `Map<string, number>` keyed by item name → buy limit.
   *          Items missing from the wiki are omitted from the map.
   */
  async getBulkBuyLimits(itemNames: string[]): Promise<Map<string, number>> {
    if (itemNames.length === 0) return new Map();

    const batches = this.chunkArray(itemNames, WikiService.EXCHANGE_BATCH_SIZE);
    console.log(
      `[WikiService] Fetching buy limits for ${itemNames.length} items in ${batches.length} batch(es)…`
    );

    const settled = await Promise.allSettled(
      batches.map((batch, idx) => this.fetchBuyLimitBatch(batch, idx))
    );

    const combined = new Map<string, number>();
    for (const result of settled) {
      if (result.status === "fulfilled") {
        for (const [name, limit] of result.value) {
          combined.set(name, limit);
        }
      } else {
        console.warn("[WikiService] Buy-limit batch failed:", result.reason);
      }
    }

    console.log(
      `[WikiService] Resolved buy limits for ${combined.size} / ${itemNames.length} items.`
    );
    return combined;
  }

  /**
   * Fetch a single batch of buy limits by querying the Lua source of
   * `Module:Exchange/<Item>` pages via the MediaWiki revisions API.
   *
   * @param batch - Subset of item names (≤ {@link EXCHANGE_BATCH_SIZE}).
   * @param idx   - Batch index (used for logging).
   * @returns Map of canonical item name → buy limit for this batch.
   */
  private async fetchBuyLimitBatch(
    batch: string[],
    idx: number,
  ): Promise<Map<string, number>> {
    // Build pipe-delimited title list — spaces become underscores for the URL.
    const titles = batch
      .map((n) => `Module:Exchange/${n.replace(/ /g, "_")}`)
      .join("|");

    const url =
      `https://runescape.wiki/api.php?action=query&prop=revisions` +
      `&rvprop=content&rvslots=main&format=json&origin=*` +
      `&titles=${encodeURIComponent(titles)}`;

    console.debug(`[WikiService] Buy-limit batch ${idx + 1}: ${batch.length} items`);

    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(
        `[WikiService] Exchange-module HTTP ${response.status} ${response.statusText} (batch ${idx + 1}).`
      );
    }

    const json = await response.json() as {
      query?: {
        pages?: Record<string, {
          title?: string;
          missing?: string;
          revisions?: Array<{ slots?: { main?: { "*"?: string } } }>;
        }>;
      };
    };

    const map = new Map<string, number>();
    const pages = json?.query?.pages;
    if (!pages) return map;

    for (const page of Object.values(pages)) {
      if (!page.title || page.missing !== undefined) continue;

      // Derive the canonical item name from the module title.
      // "Module:Exchange/Blood rune" → "Blood rune"
      const itemName = page.title.replace(/^Module:Exchange\//, "");

      const luaSrc = page.revisions?.[0]?.slots?.main?.["*"] ?? "";
      const match = WikiService.LIMIT_RE.exec(luaSrc);
      if (match) {
        const limit = Number(match[1]);
        if (limit > 0) {
          map.set(itemName, limit);
        }
      }
    }

    return map;
  }

  /**
   * Fetch High Alchemy values for the given items.
   *
   * **Primary source**: the `Module:GEHighAlchs/data.json` bulk endpoint
   * (single HTTP request for every alchable item in the game).  Items
   * present in the response are alchable (value = number); items absent
   * are explicitly not alchable (value = `false`).
   *
   * **Fallback**: per-item `Module:Exchange/<Item>` Lua source parsing,
   * used only when the bulk endpoint is unreachable.  In fallback mode,
   * items that cannot be resolved remain absent from the map (no `false`).
   *
   * @param itemNames - Canonical RS3 item names.
   * @returns A `Map<string, number | false>` keyed by item name.
   */
  async getBulkHighAlchValues(itemNames: string[]): Promise<Map<string, number | false>> {
    if (itemNames.length === 0) return new Map();

    // ── Try the single-request bulk endpoint first ─────────────────────
    try {
      const bulkData = await this.fetchAllHighAlchValues();
      const result = new Map<string, number | false>();
      for (const name of itemNames) {
        const val = bulkData.get(name);
        if (val !== undefined) {
          result.set(name, val);      // alchable — has a value
        } else {
          result.set(name, false);    // not in the bulk list → not alchable
        }
      }
      console.log(
        `[WikiService] Bulk alch endpoint: ${result.size} items resolved ` +
        `(${[...result.values()].filter(v => typeof v === "number").length} alchable, ` +
        `${[...result.values()].filter(v => v === false).length} not alchable).`
      );
      return result;
    } catch (bulkErr) {
      console.warn(
        "[WikiService] Bulk alch endpoint failed — falling back to per-item Module:Exchange.",
        bulkErr
      );
    }

    // ── Fallback: per-item Module:Exchange parsing ─────────────────────
    const batches = this.chunkArray(itemNames, WikiService.EXCHANGE_BATCH_SIZE);
    console.log(
      `[WikiService] Fetching alch values for ${itemNames.length} items in ${batches.length} batch(es) (fallback)…`
    );

    const settled = await Promise.allSettled(
      batches.map((batch, idx) => this.fetchAlchValueBatch(batch, idx))
    );

    const combined = new Map<string, number | false>();
    for (const result of settled) {
      if (result.status === "fulfilled") {
        for (const [name, val] of result.value) {
          combined.set(name, val);
        }
      } else {
        console.warn("[WikiService] Alch-value batch failed:", result.reason);
      }
    }

    console.log(
      `[WikiService] Resolved alch values for ${combined.size} / ${itemNames.length} items (fallback).`
    );
    return combined;
  }

  /**
   * Fetch the complete `Module:GEHighAlchs/data.json` bulk endpoint.
   * Returns a map of **every alchable item** in the game → its High Alch
   * value in gp.  Items not present in this map are not alchable.
   *
   * The endpoint returns a flat JSON object with two metadata keys
   * (`%LAST_UPDATE%`, `%LAST_UPDATE_F%`) that are stripped from the result.
   *
   * @returns Map of canonical item name → High Alch value (gp).
   * @throws If the network request fails or the response is not valid JSON.
   */
  private async fetchAllHighAlchValues(): Promise<Map<string, number>> {
    console.log("[WikiService] Fetching bulk High Alch data from GEHighAlchs module…");

    const response = await fetch(WikiService.HIGH_ALCH_BULK_URL, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(
        `[WikiService] GEHighAlchs HTTP ${response.status} ${response.statusText}`
      );
    }

    const json = await response.json() as Record<string, unknown>;
    const map = new Map<string, number>();

    for (const [key, value] of Object.entries(json)) {
      // Skip metadata keys (prefixed with %)
      if (key.startsWith("%")) continue;
      if (typeof value === "number" && value > 0) {
        map.set(key, value);
      }
    }

    console.log(`[WikiService] Bulk alch data: ${map.size} alchable items loaded.`);
    return map;
  }

  /**
   * Fetch a single batch of high alchemy values from `Module:Exchange/<Item>` Lua sources.
   *
   * @param batch - Subset of item names.
   * @param idx   - Batch index for logging.
   * @returns Map of canonical item name → high alchemy value.
   */
  private async fetchAlchValueBatch(
    batch: string[],
    idx: number,
  ): Promise<Map<string, number>> {
    const titles = batch
      .map((n) => `Module:Exchange/${n.replace(/ /g, "_")}`)
      .join("|");

    const url =
      `https://runescape.wiki/api.php?action=query&prop=revisions` +
      `&rvprop=content&rvslots=main&format=json&origin=*` +
      `&titles=${encodeURIComponent(titles)}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(
        `[WikiService] Exchange-module HTTP ${response.status} (alch batch ${idx + 1}).`
      );
    }

    const json = await response.json() as {
      query?: {
        pages?: Record<string, {
          title?: string;
          missing?: string;
          revisions?: Array<{ slots?: { main?: { "*"?: string } } }>;
        }>;
      };
    };

    const map = new Map<string, number>();
    const pages = json?.query?.pages;
    if (!pages) return map;

    for (const page of Object.values(pages)) {
      if (!page.title || page.missing !== undefined) continue;
      const itemName = page.title.replace(/^Module:Exchange\//, "");
      const luaSrc = page.revisions?.[0]?.slots?.main?.["*"] ?? "";

      // Skip items explicitly marked as non-alchable
      if (WikiService.ALCHABLE_FALSE_RE.test(luaSrc)) continue;

      // Prefer explicit alchvalue if present
      const alchMatch = WikiService.ALCH_RE.exec(luaSrc);
      if (alchMatch) {
        const val = Number(alchMatch[1]);
        if (val > 0) map.set(itemName, val);
        continue;
      }

      // Fallback: compute High Alch from base value (High Alch = floor(value × 0.6))
      const valueMatch = WikiService.VALUE_RE.exec(luaSrc);
      if (valueMatch) {
        const highAlch = Math.floor(Number(valueMatch[1]) * 0.6);
        if (highAlch > 0) map.set(itemName, highAlch);
      }
    }

    return map;
  }

  /**
   * Split an array into chunks of at most {@link size} elements.
   */
  private chunkArray<T>(arr: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  }
}
