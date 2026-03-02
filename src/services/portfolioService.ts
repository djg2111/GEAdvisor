/**
 * @module PortfolioService
 * Manages the user's active flip portfolio with localStorage persistence.
 *
 * Responsibilities:
 *  - CRUD operations on {@link ActiveFlip} records.
 *  - Automatic persistence to `localStorage` on every mutation.
 *  - UUID generation without external dependencies.
 */

import type { ActiveFlip, CompletedFlip, PortfolioStats } from "./types";

/** `localStorage` key for the serialised active portfolio. */
const LS_KEY = "ge-analyzer:portfolio";

/** `localStorage` key for the serialised completed-flip history. */
const LS_HISTORY_KEY = "ge-analyzer:portfolio-history";

/**
 * Service that tracks active GE flips and persists them across sessions.
 *
 * @example
 * ```ts
 * const portfolio = new PortfolioService();
 * portfolio.addFlip("Blue partyhat", 2_140_000_000, 1, 2_200_000_000);
 * console.log(portfolio.getFlips());
 * ```
 */
export class PortfolioService {
  /** In-memory flip store, kept in sync with localStorage. */
  private flips: ActiveFlip[] = [];

  /** In-memory completed-flip ledger, kept in sync with localStorage. */
  private completedFlips: CompletedFlip[] = [];

  constructor() {
    this.load();
    this.loadHistory();
  }

  // ─── Public API ─────────────────────────────────────────────────────

  /**
   * Return a shallow copy of all tracked flips (newest first).
   */
  getFlips(): ActiveFlip[] {
    return [...this.flips];
  }

  /**
   * Record a new flip and persist the change.
   *
   * @param itemName        - Canonical RS3 item name.
   * @param buyPrice        - Per-item buy price in gp.
   * @param quantity        - Number of items in this offer.
   * @param targetSellPrice - Per-item target sell price in gp.
   * @returns The newly created {@link ActiveFlip}.
   */
  addFlip(
    itemName: string,
    buyPrice: number,
    quantity: number,
    targetSellPrice: number,
  ): ActiveFlip {
    const flip: ActiveFlip = {
      id: uuid(),
      itemName,
      buyPrice,
      quantity,
      targetSellPrice,
      timestamp: Date.now(),
    };
    this.flips.unshift(flip);
    this.save();
    return flip;
  }

  /**
   * Remove a flip by its unique ID and persist the change.
   *
   * @returns `true` if a flip was found and removed, `false` otherwise.
   */
  removeFlip(id: string): boolean {
    const before = this.flips.length;
    this.flips = this.flips.filter((f) => f.id !== id);
    if (this.flips.length !== before) {
      this.save();
      return true;
    }
    return false;
  }

  /**
   * Mark an active flip as completed, calculate realised profit, and move it
   * to the history ledger.
   *
   * Tax is rounded DOWN per item per official wiki mechanics (exempt ≤50 gp).
   *
   * @param id              - Unique ID of the active flip to complete.
   * @param actualSellPrice - The per-item price the flip was actually sold at.
   * @returns The completed flip record, or `undefined` if the ID was not found.
   */
  completeFlip(id: string, actualSellPrice: number): CompletedFlip | undefined {
    const idx = this.flips.findIndex((f) => f.id === id);
    if (idx === -1) return undefined;

    const active = this.flips[idx];
    const taxPerItem = (actualSellPrice <= 50) ? 0 : Math.floor(actualSellPrice * 0.02);
    const netSellPerItem = actualSellPrice - taxPerItem;
    const realizedProfit = (netSellPerItem * active.quantity) - (active.buyPrice * active.quantity);

    // Temporary debug log for tax verification — remove after testing.
    console.log(`[PortfolioService] completeFlip: taxPerItem=${taxPerItem}, netSellPerItem=${netSellPerItem}`);

    const completed: CompletedFlip = {
      ...active,
      actualSellPrice,
      completedAt: Date.now(),
      realizedProfit,
    };

    // Move from active → history.
    this.flips.splice(idx, 1);
    this.completedFlips.unshift(completed);

    this.save();
    this.saveHistory();
    return completed;
  }

  /**
   * Return a shallow copy of all completed flips (newest first).
   */
  getCompletedFlips(): CompletedFlip[] {
    return [...this.completedFlips];
  }

  /**
   * Aggregate statistics across the completed-flip history.
   */
  getPortfolioStats(): PortfolioStats {
    const total = this.completedFlips.length;
    if (total === 0) {
      return { totalProfit: 0, totalFlips: 0, avgProfit: 0, avgRoi: 0 };
    }
    let profit = 0;
    let totalCost = 0;
    for (const f of this.completedFlips) {
      profit += f.realizedProfit;
      totalCost += f.buyPrice * f.quantity;
    }
    return {
      totalProfit: profit,
      totalFlips: total,
      avgProfit: Math.round(profit / total),
      avgRoi: totalCost > 0 ? profit / totalCost : 0,
    };
  }

  // ─── Persistence ────────────────────────────────────────────────────

  /** Serialise the current flip array to localStorage. */
  private save(): void {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(this.flips));
    } catch (err) {
      console.warn("[PortfolioService] Failed to persist portfolio:", err);
    }
  }

  /** Hydrate from localStorage on construction. */
  private load(): void {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        this.flips = parsed;
      }
    } catch (err) {
      console.warn("[PortfolioService] Failed to load portfolio:", err);
    }
  }

  /** Serialise the completed-flip history to localStorage. */
  private saveHistory(): void {
    try {
      localStorage.setItem(LS_HISTORY_KEY, JSON.stringify(this.completedFlips));
    } catch (err) {
      console.warn("[PortfolioService] Failed to persist history:", err);
    }
  }

  /** Hydrate completed-flip history from localStorage on construction. */
  private loadHistory(): void {
    try {
      const raw = localStorage.getItem(LS_HISTORY_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        this.completedFlips = parsed;
      }
    } catch (err) {
      console.warn("[PortfolioService] Failed to load history:", err);
    }
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Generate a v4-style UUID using `crypto.getRandomValues`.
 * Falls back to `Math.random` in environments without the Web Crypto API.
 */
function uuid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback: "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
