/**
 * @module CacheService
 * IndexedDB-backed caching layer for Grand Exchange price records.
 *
 * Responsibilities:
 *  - Open (or auto-upgrade) an IndexedDB database on first use.
 *  - Bulk-insert price records returned by the {@link WeirdGloopService}.
 *  - Expose a TTL-based staleness check so callers know whether to re-fetch.
 *  - Provide read-back methods for the analysis pipeline.
 *
 * All public methods return Promises that wrap the low-level IDB request/
 * transaction callbacks, keeping consumers in a clean async/await world.
 */

import type {
  CacheServiceConfig,
  HistoricalPriceRecord,
  StoredPriceRecord,
  WeirdGloopHistoryEntry,
  WeirdGloopPriceRecord,
} from "./types";

/** Default configuration values. */
const DEFAULTS: CacheServiceConfig = {
  dbName: "ge-analyzer-cache",
  storeName: "prices",
  ttlMs: 24 * 60 * 60 * 1000, // 24 hours
};

/** Name of the object store that accumulates daily price snapshots. */
const HISTORY_STORE = "price-history";

/**
 * Thin abstraction over IndexedDB for persisting and retrieving GE price data.
 *
 * @example
 * ```ts
 * const cache = new CacheService();
 * await cache.open();
 *
 * if (await cache.isStale()) {
 *   const prices = await api.fetchLatestPrices(itemNames);
 *   await cache.bulkInsert(prices);
 * }
 *
 * const allRecords = await cache.getAll();
 * ```
 */
export class CacheService {
  private readonly dbName: string;
  private readonly storeName: string;
  private readonly ttlMs: number;

  /** Lazily initialised database handle. */
  private db: IDBDatabase | null = null;

  /**
   * Create a new cache service instance.
   * @param config - Optional overrides for DB name, store name, and TTL.
   */
  constructor(config?: Partial<CacheServiceConfig>) {
    this.dbName = config?.dbName ?? DEFAULTS.dbName;
    this.storeName = config?.storeName ?? DEFAULTS.storeName;
    this.ttlMs = config?.ttlMs ?? DEFAULTS.ttlMs;
  }

  // ─── Lifecycle ────────────────────────────────────────────────────────

  /**
   * Open the IndexedDB database, creating or upgrading the object store
   * if necessary.  Must be called before any read/write operation.
   *
   * @returns The underlying `IDBDatabase` handle, also cached internally.
   * @throws {DOMException} If the browser denies the IDB request.
   */
  async open(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 2);

      request.onupgradeneeded = () => {
        const db = request.result;
        // Version 1: main prices store.
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: "name" });
          // Index on fetchedAt so we can efficiently query staleness.
          store.createIndex("fetchedAt", "fetchedAt", { unique: false });
          console.log(`[CacheService] Created object store "${this.storeName}".`);
        }
        // Version 2: daily price-history store for SMA / hype tracking.
        if (!db.objectStoreNames.contains(HISTORY_STORE)) {
          const hs = db.createObjectStore(HISTORY_STORE, {
            keyPath: ["name", "day"],
          });
          hs.createIndex("name", "name", { unique: false });
          hs.createIndex("day", "day", { unique: false });
          console.log(`[CacheService] Created object store "${HISTORY_STORE}".`);
        }
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log(`[CacheService] Database "${this.dbName}" opened successfully.`);
        resolve(this.db);
      };

      request.onerror = () => {
        console.error("[CacheService] Failed to open database:", request.error);
        reject(request.error);
      };
    });
  }

  // ─── Write Operations ─────────────────────────────────────────────────

  /**
   * Bulk-insert (or update) price records into the cache.
   *
   * Each record is written via `put` so existing keys are overwritten.
   * A single read-write transaction is used for the entire batch, which keeps
   * the operation atomic and performant.
   *
   * @param prices - Map of item name → price record as returned by
   *                 {@link WeirdGloopService.fetchLatestPrices}.
   * @returns The number of records written.
   */
  async bulkInsert(
    prices: Map<string, WeirdGloopPriceRecord>
  ): Promise<number> {
    const db = this.ensureOpen();
    const now = Date.now();
    const today = new Date(now).toISOString().slice(0, 10);

    return new Promise<number>((resolve, reject) => {
      const tx = db.transaction([this.storeName, HISTORY_STORE], "readwrite");
      const store = tx.objectStore(this.storeName);
      const histStore = tx.objectStore(HISTORY_STORE);
      let count = 0;

      for (const [name, record] of prices) {
        const stored: StoredPriceRecord = {
          ...record,
          name,
          fetchedAt: now,
        };
        const req = store.put(stored);
        req.onsuccess = () => {
          count++;
        };

        // Also persist a daily snapshot (compound key [name, day] deduplicates).
        const historical: HistoricalPriceRecord = { ...stored, day: today };
        histStore.put(historical);
      }

      tx.oncomplete = () => {
        console.log(`[CacheService] Bulk-inserted ${count} records.`);
        resolve(count);
      };

      tx.onerror = () => {
        console.error("[CacheService] Bulk-insert transaction failed:", tx.error);
        reject(tx.error);
      };
    });
  }

  /**
   * Bulk-insert 30+ days of historical snapshots into the `price-history`
   * store.  Uses a single read-write transaction for atomicity and performance.
   *
   * Each entry is keyed by the compound `[name, day]` pair, so duplicate
   * days are silently overwritten (idempotent).
   *
   * @param historyMap - Map of item name → array of daily history entries as
   *                     returned by {@link WeirdGloopService.fetchHistoricalPrices}.
   * @returns The number of history rows written.
   */
  async bulkInsertHistory(
    historyMap: Map<string, WeirdGloopHistoryEntry[]>,
  ): Promise<number> {
    const db = this.ensureOpen();

    return new Promise<number>((resolve, reject) => {
      const tx = db.transaction(HISTORY_STORE, "readwrite");
      const store = tx.objectStore(HISTORY_STORE);
      let count = 0;

      for (const [name, entries] of historyMap) {
        for (const entry of entries) {
          const day = new Date(entry.timestamp).toISOString().slice(0, 10);
          const record: HistoricalPriceRecord = {
            id: 0,
            name,
            day,
            price: entry.price,
            volume: entry.volume ?? 0,
            timestamp: new Date(entry.timestamp).toISOString(),
            fetchedAt: Date.now(),
          };
          const req = store.put(record);
          req.onsuccess = () => { count++; };
        }
      }

      tx.oncomplete = () => {
        console.log(`[CacheService] Bulk-inserted ${count} historical rows.`);
        resolve(count);
      };
      tx.onerror = () => {
        console.error("[CacheService] Bulk history insert failed:", tx.error);
        reject(tx.error);
      };
    });
  }

  // ─── Read Operations ──────────────────────────────────────────────────

  /**
   * Retrieve every cached price record.
   *
   * @returns An array of all {@link StoredPriceRecord} objects currently in the store.
   */
  async getAll(): Promise<StoredPriceRecord[]> {
    const db = this.ensureOpen();

    return new Promise<StoredPriceRecord[]>((resolve, reject) => {
      const tx = db.transaction(this.storeName, "readonly");
      const store = tx.objectStore(this.storeName);
      const req = store.getAll();

      req.onsuccess = () => resolve(req.result as StoredPriceRecord[]);
      req.onerror = () => reject(req.error);
    });
  }

  /**
   * Retrieve a single cached record by item name.
   *
   * @param name - Canonical RS3 item name.
   * @returns The stored record, or `undefined` if not found.
   */
  async getByName(name: string): Promise<StoredPriceRecord | undefined> {
    const db = this.ensureOpen();

    return new Promise<StoredPriceRecord | undefined>((resolve, reject) => {
      const tx = db.transaction(this.storeName, "readonly");
      const store = tx.objectStore(this.storeName);
      const req = store.get(name);

      req.onsuccess = () => resolve(req.result as StoredPriceRecord | undefined);
      req.onerror = () => reject(req.error);
    });
  }

  /**
   * Retrieve historical daily snapshots for a single item.
   *
   * @param itemName - Canonical RS3 item name.
   * @param days     - Number of past calendar days to include.
   * @returns An array of {@link HistoricalPriceRecord} within the window,
   *          sorted oldest-first.
   */
  async getHistoricalRecords(
    itemName: string,
    days: number,
  ): Promise<HistoricalPriceRecord[]> {
    const db = this.ensureOpen();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffDay = cutoff.toISOString().slice(0, 10);

    return new Promise<HistoricalPriceRecord[]>((resolve, reject) => {
      const tx = db.transaction(HISTORY_STORE, "readonly");
      const store = tx.objectStore(HISTORY_STORE);
      const index = store.index("name");
      const req = index.getAll(IDBKeyRange.only(itemName));

      req.onsuccess = () => {
        const all = req.result as HistoricalPriceRecord[];
        const filtered = all
          .filter((r) => r.day >= cutoffDay)
          .sort((a, b) => (a.day < b.day ? -1 : a.day > b.day ? 1 : 0));
        resolve(filtered);
      };
      req.onerror = () => reject(req.error);
    });
  }

  /**
   * Retrieve **all** history rows from the last `days` calendar days in one
   * batch read.  Far cheaper than N per-item queries when building an SMA map.
   *
   * @param days - Number of past calendar days to include.
   * @returns Every {@link HistoricalPriceRecord} within the window.
   */
  async getRecentHistory(days: number): Promise<HistoricalPriceRecord[]> {
    const db = this.ensureOpen();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffDay = cutoff.toISOString().slice(0, 10);

    return new Promise<HistoricalPriceRecord[]>((resolve, reject) => {
      const tx = db.transaction(HISTORY_STORE, "readonly");
      const store = tx.objectStore(HISTORY_STORE);
      const index = store.index("day");
      const range = IDBKeyRange.lowerBound(cutoffDay);
      const req = index.getAll(range);

      req.onsuccess = () => resolve(req.result as HistoricalPriceRecord[]);
      req.onerror = () => reject(req.error);
    });
  }

  // ─── Cache Freshness ──────────────────────────────────────────────────

  /**
   * Determine whether the cache is stale and a fresh API fetch is required.
   *
   * The check works by opening a cursor on the `fetchedAt` index in
   * **descending** order and inspecting the single most-recent record.
   * If no records exist, or the newest record is older than {@link ttlMs},
   * the cache is considered stale.
   *
   * @returns `true` if data should be re-fetched; `false` if the cache is fresh.
   */
  async isStale(): Promise<boolean> {
    const db = this.ensureOpen();

    return new Promise<boolean>((resolve, reject) => {
      const tx = db.transaction(this.storeName, "readonly");
      const store = tx.objectStore(this.storeName);
      const index = store.index("fetchedAt");

      // Open a cursor that walks the index backwards (newest first).
      const cursorReq = index.openCursor(null, "prev");

      cursorReq.onsuccess = () => {
        const cursor = cursorReq.result;
        if (!cursor) {
          // Store is empty → definitely stale.
          console.log("[CacheService] Cache is empty — marked stale.");
          resolve(true);
          return;
        }

        const record = cursor.value as StoredPriceRecord;
        const age = Date.now() - record.fetchedAt;
        const stale = age > this.ttlMs;

        console.log(
          `[CacheService] Newest record age: ${(age / 1000 / 60).toFixed(1)} min — ` +
            `cache is ${stale ? "STALE" : "FRESH"}.`
        );
        resolve(stale);
      };

      cursorReq.onerror = () => {
        console.error("[CacheService] Staleness check failed:", cursorReq.error);
        reject(cursorReq.error);
      };
    });
  }

  /**
   * Delete all records and reset the cache entirely.
   * Useful during development or when the user wants to force-refresh.
   */
  async clear(): Promise<void> {
    const db = this.ensureOpen();

    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction([this.storeName, HISTORY_STORE], "readwrite");
      tx.objectStore(this.storeName).clear();
      tx.objectStore(HISTORY_STORE).clear();

      tx.oncomplete = () => {
        console.log("[CacheService] Cache and history cleared.");
        resolve();
      };
      tx.onerror = () => reject(tx.error);
    });
  }

  // ─── Internal Helpers ─────────────────────────────────────────────────

  /**
   * Guard that asserts the database has been opened.
   * @throws {Error} If {@link open} has not been called yet.
   */
  private ensureOpen(): IDBDatabase {
    if (!this.db) {
      throw new Error(
        "[CacheService] Database not open. Call `await cacheService.open()` first."
      );
    }
    return this.db;
  }
}
