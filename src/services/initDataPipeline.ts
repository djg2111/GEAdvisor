/**
 * @module initDataPipeline
 * Orchestrator that wires the Weird Gloop API service and the IndexedDB cache
 * together into a single "ingest" step.
 *
 * Flow:
 *  1. Open the cache database.
 *  2. Check the TTL-based staleness flag.
 *  3. If stale → fetch latest prices from the API → bulk-insert into cache.
 *  4. Return the (now-fresh) cached records for downstream consumption.
 *
 * This module is deliberately side-effect-free at import time.
 * Consumers call {@link initDataPipeline} explicitly.
 */

import { CacheService } from "./cacheService";
import { WeirdGloopService } from "./weirdGloopService";
import { WikiService } from "./wikiService";
import type { StoredPriceRecord, GECatalogueEntry, WeirdGloopPriceRecord } from "./types";

/** URL for the RS Wiki’s full GE item-ID catalogue (JSON). */
const GE_CATALOGUE_URL =
  "https://runescape.wiki/w/Module:GEIDs/data.json?action=raw";

/**
 * A curated seed list of heavily-traded RS3 items used to bootstrap the
 * database on first run.  Extend this list as the analysis pipeline grows.
 *
 * These names must be **exact** canonical RS Wiki titles.
 */
const SEED_ITEMS: string[] = [
  // ── Rares & Discontinued ──────────────────────────────────────────────
  "Blue partyhat",
  "Red partyhat",
  "Green partyhat",
  "Yellow partyhat",
  "Purple partyhat",
  "White partyhat",
  "Christmas cracker",
  "Santa hat",
  "Green hallowe'en mask",
  "Red hallowe'en mask",
  "Blue hallowe'en mask",
  "Easter egg",
  "Pumpkin",
  "Disk of returning",
  "Black Santa hat",
  "Fish mask",


  // ── High-volume Skilling Supplies ─────────────────────────────────────
  "Raw shark",
  "Shark",
  "Raw rocktail",
  "Rocktail",
  "Raw sailfish",
  "Sailfish",
  "Raw lobster",
  "Lobster",
  "Raw swordfish",
  "Swordfish",
  "Grimy dwarf weed",
  "Clean dwarf weed",
  "Grimy lantadyme",
  "Clean lantadyme",
  "Grimy torstol",
  "Clean torstol",
  "Grimy snapdragon",
  "Clean snapdragon",
  "Grimy ranarr",
  "Clean ranarr",
  "Grimy kwuarm",
  "Clean kwuarm",
  "Grimy cadantine",
  "Clean cadantine",
  "Grimy avantoe",
  "Clean avantoe",
  "Grimy toadflax",
  "Clean toadflax",
  "Grimy irit",
  "Clean irit",
  "Grimy spirit weed",
  "Clean spirit weed",
  "Magic logs",
  "Elder logs",
  "Yew logs",
  "Maple logs",
  "Willow logs",
  "Coal",
  "Mithril ore",
  "Adamantite ore",
  "Luminite",
  "Runite ore",
  "Gold ore",
  "Iron ore",
  "Silver ore",
  "Copper ore",
  "Tin ore",
  "Banite ore",
  "Orichalcite ore",
  "Drakolith",
  "Phasmatite",
  "Necrite ore",
  "Light animica",
  "Dark animica",
  "Pure essence",
  "Rune essence",
  "Flax",
  "Bowstring",
  "Uncut diamond",
  "Uncut ruby",
  "Uncut emerald",
  "Uncut sapphire",
  "Diamond",
  "Ruby",
  "Emerald",
  "Sapphire",
  "Crystal flask",
  "Potion flask",
  "Vial of water",
  "Feather",

  // ── Potions & Consumables ─────────────────────────────────────────────

  "Super restore (4)",
  "Prayer potion (4)",
  "Saradomin brew (4)",
  "Weapon poison+++ (4)",
  "Aggression potion (4)",
  "Super antifire (4)",
  "Prayer renewal (4)",
  "Extreme attack (4)",
  "Extreme strength (4)",
  "Extreme defence (4)",
  "Extreme magic (4)",
  "Extreme ranging (4)",
  "Super prayer (4)",
  "Summoning potion (4)",
  "Antifire (4)",
  "Super attack (4)",
  "Super strength (4)",
  "Super defence (4)",
  "Super magic potion (4)",
  "Super ranging potion (4)",

  "Rocktail soup",
  "Sailfish soup",
  "Summer pie",

  // ── Runes ─────────────────────────────────────────────────────────────
  "Blood rune",
  "Death rune",
  "Soul rune",
  "Nature rune",
  "Astral rune",
  "Law rune",
  "Fire rune",
  "Water rune",
  "Air rune",
  "Earth rune",
  "Body rune",
  "Mind rune",
  "Chaos rune",
  "Cosmic rune",
  "Mud rune",
  "Dust rune",
  "Lava rune",
  "Steam rune",
  "Smoke rune",
  "Mist rune",
  "Armadyl rune",

  // ── PvM Drops & Salvage ───────────────────────────────────────────────
  "Dragonfire shield",
  "Abyssal whip",
  "Dark bow",
  "Dragon Rider lance",
  "Noxious scythe",
  "Noxious staff",
  "Noxious longbow",
  "Ascension crossbow",
  "Virtus mask",
  "Virtus robe top",
  "Virtus robe legs",
  "Torva full helm",
  "Torva platebody",
  "Torva platelegs",
  "Pernix cowl",
  "Pernix body",
  "Pernix chaps",
  "Malevolent helm",
  "Malevolent cuirass",
  "Malevolent greaves",
  "Seren godbow",
  "Staff of Sliske",
  "Zaros godsword",
  "Praesul codex",
  "Inquisitor staff",
  "Masterwork platebody",
  "Masterwork platelegs",
  "Masterwork helm",
  "Masterwork boots",
  "Masterwork gloves",
  "Trimmed masterwork platebody",
  "Trimmed masterwork platelegs",
  "Trimmed masterwork helm",
  "Trimmed masterwork boots",
  "Trimmed masterwork gloves",
  "Eldritch crossbow",
  "Blightbound crossbow",
  "Fractured Staff of Armadyl",
  "Scripture of Jas",
  "Scripture of Wen",
  "Scripture of Ful",
  "Cinderbane gloves",
  "Laceration boots",
  "Fleeting boots",
  "Blast diffusion boots",
  "Essence of Finality amulet",
  "Amulet of souls",
  "Reaper necklace",
  "Deathtouch bracelet",
  "Ring of death",
  "Luck of the Dwarves",

  // ── Summoning & Misc ──────────────────────────────────────────────────
  "Spirit shards",
  "Pouch",

  "Pack yak pouch",
  "Water talisman",
  "Fire talisman",
  "Yak-hide",
  "Unicorn horn",
  "Swamp tar",

  // ── Alchable / Margin Items ───────────────────────────────────────────
  "Battlestaff",
  "Onyx",
  "Uncut onyx",
  "Onyx bolts (e)",
  "Rune bar",
  "Adamant bar",
  "Mithril bar",
  "Steel bar",
  "Iron bar",
  "Bronze bar",
  "Gold bar",
  "Bane bar",
  "Elder rune bar",
  "Orikalkum bar",
  "Necronium bar",
  "Hydrix",
  "Uncut dragonstone",
  "Dragonstone",
  "Bond",
  "Cannonball",
  "Broad arrowheads",
  "Dragon bones",
  "Frost dragon bones",
  "Dinosaur bones",
  "Reinforced dragon bones",
  "Dagannoth bones",
  "Infernal ashes",
  "Dragon arrowheads",
  "Rune arrowheads",
  "Adamant arrowheads",
  "Black dragonhide",
  "Royal dragonhide",
  "Green dragonhide",
  "Blue dragonhide",
  "Red dragonhide",
  "Rune platebody",
  "Rune platelegs",
  "Dragon platelegs",
  "Dragon plateskirt",
  "Dragon helm",
];

/**
 * Run the full data-ingest pipeline.
 *
 * Designed to be called once during application startup.  It is safe to call
 * multiple times — the staleness check ensures the API is not hammered more
 * than once per TTL window.
 *
 * @returns All cached {@link StoredPriceRecord} objects (fresh or previously cached).
 * @throws Will **not** throw for partial API failures; only a complete IDB
 *         failure can cause rejection.
 */
export async function initDataPipeline(): Promise<StoredPriceRecord[]> {
  console.log("┌─────────────────────────────────────────────┐");
  console.log("│  GE Market Analyzer — Data Pipeline Start   │");
  console.log("└─────────────────────────────────────────────┘");

  const cache = new CacheService();
  const api = new WeirdGloopService();

  // Step 1 — Open the database (creates store on first run).
  try {
    await cache.open();
  } catch (err) {
    console.error("[initDataPipeline] Fatal: could not open IndexedDB.", err);
    throw err;
  }

  // Step 2 — Determine if we need fresh data.
  const stale = await cache.isStale();

  if (stale) {
    console.log("[initDataPipeline] Cache is stale — fetching fresh prices…");

    // Step 3a — Fetch from API (batched + concurrent).
    let prices: Map<string, import("./types").WeirdGloopPriceRecord>;
    try {
      prices = await api.fetchLatestPrices(SEED_ITEMS);
    } catch (fetchErr) {
      console.error("[initDataPipeline] Network error fetching prices:", fetchErr);
      throw new Error(
        "Could not reach the Weird Gloop API — check your internet connection and try again."
      );
    }

    if (prices.size === 0) {
      console.warn(
        "[initDataPipeline] API returned zero records. Cache will remain empty."
      );
    } else {
      // Step 3b — Enrich records with GE buy limits and high alch values from the wiki.
      const wiki = new WikiService();
      const itemNames = Array.from(prices.keys());
      let buyLimits: Map<string, number>;
      let alchValues: Map<string, number | false>;
      try {
        [buyLimits, alchValues] = await Promise.all([
          wiki.getBulkBuyLimits(itemNames),
          wiki.getBulkHighAlchValues(itemNames),
        ]);
      } catch (wikiErr) {
        console.warn("[initDataPipeline] Wiki enrichment fetch failed — continuing without limits/alch.", wikiErr);
        buyLimits = new Map();
        alchValues = new Map();
      }

      for (const [name, record] of prices) {
        const limit = buyLimits.get(name);
        if (limit !== undefined) {
          record.buyLimit = limit;
        }
        const alch = alchValues.get(name);
        if (alch !== undefined) {
          record.highAlch = alch;
        }
      }
      console.log(
        `[initDataPipeline] Enriched ${buyLimits.size} buy limits, ${alchValues.size} alch values for ${prices.size} records.`
      );

      // Step 3c — Persist enriched records into IndexedDB.
      const written = await cache.bulkInsert(prices);
      console.log(`[initDataPipeline] Wrote ${written} records to cache.`);

      // Step 3d — Seed 30 days of historical prices for EMA / regression.
      try {
        const itemNames = Array.from(prices.keys());
        const historyMap = await api.fetchHistoricalPrices(itemNames, 30);
        if (historyMap.size > 0) {
          const histWritten = await cache.bulkInsertHistory(historyMap);
          console.log(
            `[initDataPipeline] Seeded ${histWritten} historical rows for ${historyMap.size} items.`
          );
        }
      } catch (histErr) {
        console.warn(
          "[initDataPipeline] Historical price fetch failed — sparklines may be sparse.",
          histErr
        );
      }
    }
  } else {
    console.log("[initDataPipeline] Cache is fresh — skipping API fetch.");
  }

  // ── Health checks: repair missing enrichment / history even on a fresh cache ──

  const records = await cache.getAll();

  // Health check A — Re-enrich records missing highAlch or buyLimit.
  // This recovers from earlier wiki fetch failures (e.g. CORS, network).
  const missingAlch = records.filter((r) => r.highAlch == null);
  const missingLimit = records.filter((r) => r.buyLimit == null);
  if (missingAlch.length > records.length * 0.5 || missingLimit.length > records.length * 0.5) {
    console.log(
      `[initDataPipeline] Enrichment health check: ${missingAlch.length}/${records.length} missing highAlch, ` +
      `${missingLimit.length}/${records.length} missing buyLimit — re-enriching…`
    );
    const wiki = new WikiService();
    const namesToEnrich = records.map((r) => r.name);
    try {
      const [limits, alchs] = await Promise.all([
        missingLimit.length > records.length * 0.5
          ? wiki.getBulkBuyLimits(namesToEnrich)
          : Promise.resolve(new Map<string, number>()),
        missingAlch.length > records.length * 0.5
          ? wiki.getBulkHighAlchValues(namesToEnrich)
          : Promise.resolve(new Map<string, number | false>()),
      ]);

      // Build a map for quick update of enriched records.
      const priceMap = new Map<string, WeirdGloopPriceRecord>();
      for (const r of records) {
        const limit = limits.get(r.name);
        const alch = alchs.get(r.name);
        let updated = false;
        if (limit !== undefined && r.buyLimit == null) { r.buyLimit = limit; updated = true; }
        if (alch !== undefined && r.highAlch == null) { r.highAlch = alch; updated = true; }
        if (updated) {
          priceMap.set(r.name, {
            id: r.id,
            timestamp: r.timestamp,
            price: r.price,
            volume: r.volume,
            buyLimit: r.buyLimit,
            highAlch: r.highAlch,
          });
        }
      }

      if (priceMap.size > 0) {
        await cache.bulkInsert(priceMap);
        console.log(`[initDataPipeline] Re-enriched ${priceMap.size} records.`);
      }
    } catch (enrichErr) {
      console.warn("[initDataPipeline] Re-enrichment failed:", enrichErr);
    }
  }

  // Health check B — Re-seed history if the history store is sparse.
  // This recovers from earlier history fetch failures.
  try {
    const recentHistory = await cache.getRecentHistory(30);
    const today = new Date().toISOString().slice(0, 10);
    // Count items with ≥ 2 non-today data points.
    const grouped = new Map<string, number>();
    for (const h of recentHistory) {
      if (h.day === today) continue;
      grouped.set(h.name, (grouped.get(h.name) ?? 0) + 1);
    }
    const itemsWithSufficientHistory = [...grouped.values()].filter((c) => c >= 2).length;

    if (records.length > 0 && itemsWithSufficientHistory < records.length * 0.3) {
      // The /last90d API only supports 1 item per request, so re-seeding
      // all 7 000+ items would take too long.  Limit to SEED_ITEMS that
      // actually lack sufficient history — keeps startup under ~30 s.
      const namesToSeed = SEED_ITEMS.filter((name) => (grouped.get(name) ?? 0) < 2);
      console.log(
        `[initDataPipeline] History health check: only ${itemsWithSufficientHistory}/${records.length} items ` +
        `have ≥ 2 days of history — re-seeding ${namesToSeed.length} seed items…`
      );
      if (namesToSeed.length > 0) {
        const api = new WeirdGloopService();
        const historyMap = await api.fetchHistoricalPrices(namesToSeed, 30);
        if (historyMap.size > 0) {
          await cache.bulkInsertHistory(historyMap);
          console.log(
            `[initDataPipeline] Re-seeded ${historyMap.size} items with historical data.`
          );
        }
      }
    } else {
      console.log(
        `[initDataPipeline] History health check: ${itemsWithSufficientHistory}/${records.length} items OK.`
      );
    }
  } catch (histHealthErr) {
    console.warn("[initDataPipeline] History health check failed:", histHealthErr);
  }

  // Step 4 — Return all cached data for downstream consumers.
  // Re-read in case health checks updated records.
  const finalRecords = await cache.getAll();
  console.log(
    `[initDataPipeline] Pipeline complete. ${finalRecords.length} records available.`
  );
  return finalRecords;
}

/**
 * Fetch the full RS3 GE item catalogue from the RS Wiki.
 * Returns ~7 000 `{ name, id }` entries covering every tradeable item.
 *
 * The result is intended to be held in memory for the session — it’s
 * roughly 215 KB of JSON and parsed into a compact array.
 *
 * @returns An array of {@link GECatalogueEntry} sorted alphabetically.
 */
export async function fetchGECatalogue(): Promise<GECatalogueEntry[]> {
  console.log("[GECatalogue] Fetching full item catalogue from RS Wiki…");

  try {
    const response = await fetch(GE_CATALOGUE_URL, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }

    const json: Record<string, number> = await response.json();

    // Filter out the metadata keys that start with "%".
    const entries: GECatalogueEntry[] = [];
    for (const [name, id] of Object.entries(json)) {
      if (!name.startsWith("%") && typeof id === "number") {
        entries.push({ name, id });
      }
    }

    entries.sort((a, b) => a.name.localeCompare(b.name));
    console.log(`[GECatalogue] Loaded ${entries.length} tradeable items.`);
    return entries;
  } catch (err) {
    console.error("[GECatalogue] Failed to fetch catalogue:", err);
    return [];
  }
}

/**
 * Callback signature for reporting background scan progress.
 * @param done  - Number of items processed so far.
 * @param total - Total number of items to process.
 */
export type ScanProgressCallback = (done: number, total: number) => void;

/**
 * Run a **non-blocking** full-market background scan.
 *
 * Fetches latest prices for **every** item in the GE catalogue (~7 000
 * items) in batches of 100, with adaptive delays between batches to avoid
 * rate-limiting.  Each batch is bulk-inserted into IndexedDB immediately so
 * progress persists even if the user closes the app mid-scan.
 *
 * When `deepHistory` is `true`, 90-day price history is also fetched per
 * item (the `/last90d` endpoint only accepts 1 item per request, so this
 * is significantly slower).  When `false` (default), history is loaded on
 * demand when the user opens the analytics modal.
 *
 * **History-only optimisation**: If `deepHistory` is requested and the
 * cache already contains fresh prices for ≥ 90 % of the catalogue (fetched
 * within the last hour), the scan skips price/enrichment fetches entirely
 * and only fetches history — avoiding ~2–3 min of redundant API calls when
 * the user re-runs the scan just to add deep history.
 *
 * The UI remains fully interactive during the scan because the function
 * yields control back to the browser between batches via `setTimeout`.
 *
 * @param catalogue       - Pre-fetched GE catalogue entries.
 * @param onProgress      - Called after every batch with `(done, total)`.
 * @param signal          - Optional `AbortSignal` to cancel the scan early.
 * @param deepHistory     - When `true`, also fetches 90-day history per item.
 * @returns The total number of items successfully fetched and persisted.
 */
// Optional deep history during full scan – March 2026
export async function runFullMarketScan(
  catalogue: GECatalogueEntry[],
  onProgress?: ScanProgressCallback,
  signal?: AbortSignal,
  deepHistory: boolean = false,
): Promise<number> {
  if (catalogue.length === 0) {
    console.warn("[FullMarketScan] Empty catalogue — nothing to scan.");
    return 0;
  }

  const cache = new CacheService();
  const api = new WeirdGloopService();
  const wiki = new WikiService();

  await cache.open();

  // ── History-only optimisation ─────────────────────────────────────────
  // If the user wants deep history and prices are already fresh, skip the
  // price + enrichment fetches and only pull history.
  const FRESH_THRESHOLD_MS = 60 * 60 * 1000; // 1 hour
  let historyOnly = false;

  if (deepHistory) {
    const existing = await cache.getAll();
    if (existing.length > 0) {
      const now = Date.now();
      const freshCount = existing.filter(
        (r) => r.fetchedAt && (now - r.fetchedAt) < FRESH_THRESHOLD_MS
      ).length;
      const coverage = freshCount / catalogue.length;
      if (coverage >= 0.9) {
        historyOnly = true;
        console.log(
          `[FullMarketScan] Prices already fresh for ${freshCount}/${catalogue.length} items ` +
          `(${(coverage * 100).toFixed(0)}%) — switching to history-only mode.`
        );
      }
    }
  }

  const BATCH_SIZE = 100;
  const BASE_DELAY_MS = 1_500;         // default pause between batches
  const MAX_DELAY_MS  = 30_000;        // ceiling for adaptive backoff
  const allNames = catalogue.map((e) => e.name);
  const total = allNames.length;
  let done = 0;
  let currentDelay = BASE_DELAY_MS;    // adapts when batches return empty
  let consecutiveEmpty = 0;            // tracks back-to-back 0-result batches

  console.log(`[FullMarketScan] Starting scan of ${total} items in batches of ${BATCH_SIZE}…`);

  for (let i = 0; i < allNames.length; i += BATCH_SIZE) {
    if (signal?.aborted) {
      console.log("[FullMarketScan] Aborted by user.");
      break;
    }

    const batchNames = allNames.slice(i, i + BATCH_SIZE);

    try {
      if (historyOnly) {
        // ── History-only mode: skip prices/enrichment, just fetch history ──
        try {
          const historyMap = await api.fetchHistoricalPrices(batchNames, 90);
          if (historyMap.size > 0) {
            await cache.bulkInsertHistory(historyMap);
          }
        } catch {
          // Non-critical — skip history for this batch.
        }
      } else {
      // ── Normal mode: fetch prices + enrichment + optional history ──
      const prices: Map<string, WeirdGloopPriceRecord> = await api.fetchLatestPrices(batchNames);

      if (prices.size > 0) {
        // Successful fetch — reset adaptive delay.
        consecutiveEmpty = 0;
        currentDelay = BASE_DELAY_MS;

        // Enrich with buy limits + alch values (best-effort).
        const names = Array.from(prices.keys());
        try {
          const [limits, alchs] = await Promise.all([
            wiki.getBulkBuyLimits(names),
            wiki.getBulkHighAlchValues(names),
          ]);
          for (const [name, record] of prices) {
            const limit = limits.get(name);
            if (limit !== undefined) record.buyLimit = limit;
            const alch = alchs.get(name);
            if (alch !== undefined) record.highAlch = alch;
          }
        } catch {
          // Non-critical — continue without enrichment.
        }

        // Persist to IndexedDB immediately.
        await cache.bulkInsert(prices);

        // Fetch history only when the user explicitly opted in to deep
        // history.  The /last90d endpoint only accepts 1 item per request,
        // so fetching history for every item in a normal scan would add
        // ~24 minutes.  Without deep history, individual item histories are
        // fetched on demand when the user opens the analytics modal.
        if (deepHistory) {
          try {
            const historyMap = await api.fetchHistoricalPrices(names, 90);
            if (historyMap.size > 0) {
              await cache.bulkInsertHistory(historyMap);
            }
          } catch {
            // Non-critical — skip history for this batch.
          }
        }
      } else {
        // Batch returned 0 results — likely rate-limited.  Back off.
        consecutiveEmpty++;
        currentDelay = Math.min(
          BASE_DELAY_MS * Math.pow(2, consecutiveEmpty),
          MAX_DELAY_MS,
        );
        console.warn(
          `[FullMarketScan] Batch ${i / BATCH_SIZE + 1} returned 0 results ` +
          `(${consecutiveEmpty} consecutive). Next delay: ${(currentDelay / 1000).toFixed(1)}s`
        );
      }
      } // end normal mode
    } catch (err) {
      consecutiveEmpty++;
      currentDelay = Math.min(
        BASE_DELAY_MS * Math.pow(2, consecutiveEmpty),
        MAX_DELAY_MS,
      );
      console.warn(
        `[FullMarketScan] Batch ${i / BATCH_SIZE + 1} failed (delay → ${(currentDelay / 1000).toFixed(1)}s):`,
        err,
      );
    }

    done = Math.min(i + BATCH_SIZE, total);
    onProgress?.(done, total);

    // Yield to the browser event loop + adaptive rate-limit delay.
    if (i + BATCH_SIZE < allNames.length) {
      await new Promise((r) => setTimeout(r, currentDelay));
    }
  }

  console.log(`[FullMarketScan] Complete. ${done} / ${total} items processed.`);
  return done;
}