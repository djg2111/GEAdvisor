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
import type { StoredPriceRecord, GECatalogueEntry } from "./types";

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
  "Green h'ween mask",
  "Red h'ween mask",
  "Blue h'ween mask",

  // ── High-volume Skilling Supplies ─────────────────────────────────────
  "Raw shark",
  "Shark",
  "Raw rocktail",
  "Rocktail",
  "Grimy dwarf weed",
  "Dwarf weed",
  "Grimy lantadyme",
  "Lantadyme",
  "Grimy torstol",
  "Torstol",
  "Magic logs",
  "Elder logs",
  "Yew logs",
  "Coal",
  "Mithril ore",
  "Adamantite ore",
  "Luminite",
  "Runite ore",
  "Gold ore",
  "Iron ore",

  // ── Potions & Consumables ─────────────────────────────────────────────
  "Overload (4)",
  "Super restore (4)",
  "Prayer potion (4)",
  "Saradomin brew (4)",
  "Weapon poison+++ (4)",
  "Aggression potion (4)",

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

  // ── PvM Drops & Salvage ───────────────────────────────────────────────
  "Dragonfire shield",
  "Abyssal whip",
  "Dark bow",
  "Dragon rider lance",
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

  // ── Summoning & Misc ──────────────────────────────────────────────────
  "Spirit shard",
  "Pouch",
  "Crimson charm",
  "Blue charm",
  "Pack yak pouch",
  "Water talisman",

  // ── Alchable / Margin Items ───────────────────────────────────────────
  "Battlestaff",
  "Onyx",
  "Uncut onyx",
  "Onyx bolts (e)",
  "Rune bar",
  "Adamant bar",
  "Hydrix",
  "Uncut dragonstone",
  "Dragonstone",
  "Bond",
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
    const prices = await api.fetchLatestPrices(SEED_ITEMS);

    if (prices.size === 0) {
      console.warn(
        "[initDataPipeline] API returned zero records. Cache will remain empty."
      );
    } else {
      // Step 3b — Enrich records with GE buy limits from the wiki.
      const wiki = new WikiService();
      const itemNames = Array.from(prices.keys());
      const buyLimits = await wiki.getBulkBuyLimits(itemNames);

      for (const [name, record] of prices) {
        const limit = buyLimits.get(name);
        if (limit !== undefined) {
          record.buyLimit = limit;
        }
      }
      console.log(
        `[initDataPipeline] Enriched ${buyLimits.size} / ${prices.size} records with buy limits.`
      );

      // Step 3c — Persist enriched records into IndexedDB.
      const written = await cache.bulkInsert(prices);
      console.log(`[initDataPipeline] Wrote ${written} records to cache.`);
    }
  } else {
    console.log("[initDataPipeline] Cache is fresh — skipping API fetch.");
  }

  // Step 4 — Return all cached data for downstream consumers.
  const records = await cache.getAll();
  console.log(
    `[initDataPipeline] Pipeline complete. ${records.length} records available.`
  );
  return records;
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
