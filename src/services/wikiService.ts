/**
 * @module WikiService
 * Client for the official RuneScape 3 Wiki MediaWiki API.
 *
 * Responsibilities:
 *  - Fetch plain-text article extracts via the `action=query&prop=extracts`
 *    endpoint with `explaintext=1` (no HTML).
 *  - Map item names to `Money_making_guide/…` page titles.
 *  - Gracefully handle missing pages (page ID `-1`).
 *
 * Uses only the native browser `fetch` API — no external dependencies.
 *
 * @see https://runescape.wiki/api.php (MediaWiki API sandbox)
 */

import type { WikiGuideResult, WikiQueryResponse, WikiSearchResponse } from "./types";

/**
 * Base URL for the RS3 Wiki `action=query` extracts endpoint.
 * `origin=*` enables CORS from any origin (required for Alt1 / browser context).
 */
const WIKI_EXTRACT_BASE =
  "https://runescape.wiki/api.php?action=query&prop=extracts&explaintext=1&format=json&origin=*&titles=";

/**
 * Base URL for the RS3 Wiki `action=query&list=search` endpoint.
 * Used to dynamically resolve guide page titles before fetching extracts.
 */
const WIKI_SEARCH_BASE =
  "https://runescape.wiki/api.php?action=query&list=search&utf8=&format=json&origin=*&srsearch=";

/**
 * Service that retrieves plain-text money-making guide content from the
 * official RuneScape 3 Wiki.
 *
 * @example
 * ```ts
 * const wiki = new WikiService();
 * const guide = await wiki.getMoneyMakingGuide("Elder logs");
 * if (guide.found) {
 *   console.log(guide.text);
 * }
 * ```
 */
export class WikiService {
  // ─── Public API ───────────────────────────────────────────────────────

  /** Keywords that indicate a search result is a relevant guide page. */
  private static readonly GUIDE_KEYWORDS = [
    "money making guide",
    "smithing",
    "crafting",
    "mining",
    "cooking",
    "herblore",
    "fletching",
    "runecrafting",
    "fishing",
    "woodcutting",
    "farming",
    "hunter",
    "divination",
    "archaeology",
  ];

  /**
   * Fetch the money-making guide article associated with {@link itemName}
   * using a **two-step** search → extract strategy.
   *
   * 1. **Search**: Query the MediaWiki search API for
   *    `"Money making guide {itemName}"`. If the top result's title
   *    contains a relevant guide keyword, accept it.
   * 2. **Extract**: Fetch the plain-text extract for that resolved title.
   * 3. **Fallback**: If no guide is found, fetch the base `{itemName}`
   *    article so the LLM at least gets item mechanics / creation info.
   *
   * All network errors are caught — the method never throws. On total
   * failure it returns `{ found: false, text: "" }`.
   *
   * @param itemName - Canonical RS3 item name.
   * @returns A {@link WikiGuideResult} indicating whether the page exists and
   *          containing the extracted text (or an empty string on failure).
   */
  async getMoneyMakingGuide(itemName: string): Promise<WikiGuideResult> {
    const naiveTitle = this.buildGuideTitle(itemName);

    try {
      // ── Step 1: Search for a guide page ──
      const resolvedTitle = await this.searchForGuideTitle(itemName);

      if (resolvedTitle) {
        // ── Step 2: Fetch extract using the resolved title ──
        console.debug(`[WikiService] Resolved guide title: "${resolvedTitle}"`);
        const result = await this.fetchExtract(resolvedTitle);
        if (result.found) return result;
      }

      // ── Fallback: fetch the base item page itself ──
      console.debug(
        `[WikiService] No guide found — falling back to base item page "${itemName}".`
      );
      const fallback = await this.fetchExtract(itemName);
      if (fallback.found) {
        return { ...fallback, title: itemName };
      }

      return { title: naiveTitle, found: false, text: "" };
    } catch (err) {
      console.warn(
        `[WikiService] getMoneyMakingGuide failed for "${itemName}":`,
        err
      );
      return { title: naiveTitle, found: false, text: "" };
    }
  }

  /**
   * Fetch guide text for **multiple** items concurrently.
   *
   * All requests are dispatched via `Promise.allSettled` so individual
   * failures do not abort the batch.
   *
   * @param itemNames - Array of canonical RS3 item names.
   * @returns An array of {@link WikiGuideResult} objects in the same order
   *          as the input.  Failed requests return `found: false` with the
   *          error message as `text`.
   */
  async getGuidesForItems(itemNames: string[]): Promise<WikiGuideResult[]> {
    if (itemNames.length === 0) return [];

    console.log(`[WikiService] Fetching guides for ${itemNames.length} items…`);

    const settled = await Promise.allSettled(
      itemNames.map((name) => this.getMoneyMakingGuide(name))
    );

    return settled.map((result, idx) => {
      if (result.status === "fulfilled") {
        return result.value;
      }
      console.warn(
        `[WikiService] Guide fetch failed for "${itemNames[idx]}":`,
        result.reason
      );
      return {
        title: this.buildGuideTitle(itemNames[idx]),
        found: false,
        text: `[Error fetching guide: ${result.reason}]`,
      };
    });
  }

  // ─── Private: Two-Step Search Helpers ────────────────────────────────

  /**
   * Query the MediaWiki search API for a money-making guide matching
   * {@link itemName}.  Returns the resolved title if a relevant guide page
   * is found, or `null` if no suitable result exists.
   */
  private async searchForGuideTitle(
    itemName: string
  ): Promise<string | null> {
    const searchTerm = `Money making guide ${itemName}`;
    const url = `${WIKI_SEARCH_BASE}${encodeURIComponent(searchTerm)}`;

    console.debug(`[WikiService] Searching wiki for "${searchTerm}"…`);

    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      console.warn(
        `[WikiService] Search HTTP ${response.status} for "${searchTerm}".`
      );
      return null;
    }

    const json: WikiSearchResponse = await response.json();
    const results = json?.query?.search;
    if (!results || results.length === 0) return null;

    const topTitle = results[0].title;
    const lower = topTitle.toLowerCase();

    // Validate the result contains a guide-related keyword.
    const isRelevant = WikiService.GUIDE_KEYWORDS.some((kw) =>
      lower.includes(kw)
    );

    if (!isRelevant) {
      console.debug(
        `[WikiService] Top search result "${topTitle}" is not a guide — skipping.`
      );
      return null;
    }

    return topTitle;
  }

  /**
   * Fetch the plain-text extract for a single wiki page title.
   * Returns a {@link WikiGuideResult} — `found: false` for missing pages.
   */
  private async fetchExtract(title: string): Promise<WikiGuideResult> {
    const url = `${WIKI_EXTRACT_BASE}${encodeURIComponent(title)}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      return {
        title,
        found: false,
        text: `[HTTP ${response.status} fetching "${title}".]`,
      };
    }

    const json: WikiQueryResponse = await response.json();
    return this.parseExtract(json, title);
  }

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
   * Fetch High Alchemy values in bulk by reading `Module:Exchange/<Item>` pages.
   * Each Lua module contains an `alchvalue` field with the item's alch price.
   *
   * @param itemNames - Canonical RS3 item names.
   * @returns A `Map<string, number>` keyed by item name → high alch value.
   */
  async getBulkHighAlchValues(itemNames: string[]): Promise<Map<string, number>> {
    if (itemNames.length === 0) return new Map();

    const batches = this.chunkArray(itemNames, WikiService.EXCHANGE_BATCH_SIZE);
    console.log(
      `[WikiService] Fetching alch values for ${itemNames.length} items in ${batches.length} batch(es)…`
    );

    const settled = await Promise.allSettled(
      batches.map((batch, idx) => this.fetchAlchValueBatch(batch, idx))
    );

    const combined = new Map<string, number>();
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
      `[WikiService] Resolved alch values for ${combined.size} / ${itemNames.length} items.`
    );
    return combined;
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
      const match = WikiService.ALCH_RE.exec(luaSrc);
      if (match) {
        const val = Number(match[1]);
        if (val > 0) map.set(itemName, val);
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

  // ─── Private Helpers ──────────────────────────────────────────────────

  /**
   * Convert a canonical item name into a `Money_making_guide/…` wiki title.
   *
   * @param itemName - e.g. `"Elder logs"`
   * @returns e.g. `"Money_making_guide/Elder_logs"`
   */
  private buildGuideTitle(itemName: string): string {
    return `Money_making_guide/${itemName.replace(/ /g, "_")}`;
  }

  /**
   * Extract the plain-text body from a MediaWiki query response.
   *
   * The `pages` object is keyed by the numeric page ID (as a string).
   * A page ID of `"-1"` (or presence of the `missing` key) signals that the
   * article does not exist.
   *
   * @param json      - Raw parsed API response.
   * @param wikiTitle - Title used for logging / result metadata.
   * @returns A normalised {@link WikiGuideResult}.
   */
  private parseExtract(
    json: WikiQueryResponse,
    wikiTitle: string
  ): WikiGuideResult {
    const pages = json?.query?.pages;

    if (!pages) {
      console.warn(`[WikiService] Unexpected response shape for "${wikiTitle}".`);
      return { title: wikiTitle, found: false, text: "[Unexpected API response shape.]" };
    }

    // There will be exactly one key since we queried a single title.
    const pageId = Object.keys(pages)[0];
    const page = pages[pageId];

    if (!page || pageId === "-1" || page.missing !== undefined) {
      console.debug(`[WikiService] No wiki page found for "${wikiTitle}".`);
      return {
        title: wikiTitle,
        found: false,
        text: `[No money-making guide found for "${wikiTitle}".]`,
      };
    }

    const extract = (page.extract ?? "").trim();

    if (extract.length === 0) {
      return {
        title: wikiTitle,
        found: true,
        text: `[Guide page exists but has no extractable text: "${wikiTitle}".]`,
      };
    }

    console.debug(
      `[WikiService] Retrieved ${extract.length} chars for "${wikiTitle}".`
    );
    return { title: wikiTitle, found: true, text: extract };
  }
}
