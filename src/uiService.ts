/**
 * @module UIService
 * DOM manipulation layer that connects the backend data pipeline to the HTML
 * interface.  All direct `document.*` access is encapsulated here so that
 * service modules remain UI-agnostic.
 *
 * Responsibilities:
 *  - Persist / restore the LLM API key via `localStorage`.
 *  - Render the ranked item list from {@link MarketAnalyzerService}.
 *  - Drive the chat interface: append messages, show/hide the thinking
 *    indicator, and orchestrate the RAG pipeline on each user query.
 */

import {
  CacheService,
  fetchGECatalogue,
  initDataPipeline,
  LLMRequestError,
  LLMService,
  LLM_PROVIDERS,
  MarketAnalyzerService,
  PortfolioService,
  runFullMarketScan,
  WeirdGloopService,
  WikiService,
} from "./services";
import type { ActiveFlip, CompletedFlip, FavoriteItem, GECatalogueEntry, HistoricalPriceRecord, LLMProvider, MarketAnalyzerConfig, RankedItem, StoredPriceRecord } from "./services";

// ─── Constants ──────────────────────────────────────────────────────────────

/** `localStorage` key for the persisted LLM API key. */
const LS_API_KEY = "ge-analyzer:llm-api-key";

/** `localStorage` key for the selected provider ID. */
const LS_PROVIDER = "ge-analyzer:llm-provider";

/** `localStorage` key for the user-specified model override. */
const LS_MODEL = "ge-analyzer:llm-model";

/** `localStorage` key for the custom endpoint URL. */
const LS_ENDPOINT = "ge-analyzer:llm-endpoint";

/** RS3 item sprite base URL (official Jagex endpoint). */
const SPRITE_BASE = "https://secure.runescape.com/m=itemdb_rs/obj_sprite.gif?id=";

/** Available market panel view modes. */
type ViewMode = "list" | "tile" | "hybrid";

/** `localStorage` key for persisted view mode preference. */
const LS_VIEW_MODE = "ge-analyzer:view-mode";

// Compact tiles toggle – reduces predictive badge clutter in grid view – March 2026
/** `localStorage` key for persisted compact-tiles preference. */
const LS_COMPACT_TILES = "ge-analyzer:compact-tiles";

/** `localStorage` key for persisted interface layout preference. */
const LS_LAYOUT = "ge-analyzer:layout";

/** `localStorage` key for persisted theme preference. */
const LS_THEME = "ge-analyzer:theme";

/** `localStorage` key for persisted style preference (basic/glass/neumorphism/skeuomorphism). */
const LS_STYLE = "ge-analyzer:style";

/** `localStorage` key for persisted colorway preference (default/classic/rs3-modern/solarized). */
const LS_COLORWAY = "ge-analyzer:colorway";

/** `localStorage` key for persisted mode preference (dark/light). */
const LS_MODE = "ge-analyzer:mode";

/** `localStorage` key for persisted contrast preference (default/soft/hard). */
const LS_CONTRAST = "ge-analyzer:contrast";

/** `localStorage` key for serialised LLM chat history. */
const LS_CHAT_HISTORY = "ge-analyzer:chat-history";

/** `localStorage` key for the user's favourited item names (JSON array). */
const LS_FAVORITES = "ge-analyzer:favorites";

/** `localStorage` key for “deep history” checkbox preference (boolean string). */
const LS_DEEP_HISTORY = "ge-analyzer:deep-history";

/** `localStorage` key for contrast auto-correction toggle (boolean string). */
const LS_CONTRAST_AUTO = "ge-analyzer:contrast-auto-correct";

/** Whether the user has acknowledged the site disclaimer. */
const LS_DISCLAIMER_ACK = "ge-analyzer:disclaimer-ack";

/** WCAG AA minimum contrast ratio for normal text. */
const WCAG_AA_RATIO = 4.5;

/** Maximum number of messages (user + assistant) persisted to localStorage. */
const MAX_SAVED_MESSAGES = 50;

/** GE buy-limit window duration in milliseconds (4 hours). */
const BUY_LIMIT_WINDOW_MS = 4 * 60 * 60 * 1000;

/** Portfolio countdown refresh interval in milliseconds (every 30 s). */
const PORTFOLIO_TICK_MS = 30_000;

/** Available interface layout modes. */
type LayoutMode = "tabbed" | "sidebar";

/** Available visual styles (structural effects). */
type StyleMode = "basic" | "glass" | "neumorphism" | "skeuomorphism";

/** Available colorways (colour palettes — mode-agnostic). */
type ColorwayMode = "default" | "classic" | "rs3-modern" | "solarized" | "rs-lobby" | "gruvbox" | "twilight-amethyst" | "osrs-design";

/** Available appearance modes (dark / light). */
type AppMode = "dark" | "light";

/** Available contrast levels. */
type ContrastMode = "default" | "soft" | "hard";

/**
 * Legacy colorway values mapped to the new mode+colorway system.
 * Used for one-time migration of persisted settings.
 */
const LEGACY_COLORWAY_MAP: Record<string, { mode: AppMode; colorway: ColorwayMode }> = {
  classic:      { mode: "dark",  colorway: "default" },
  osrs:         { mode: "dark",  colorway: "classic" },
  "rs3-modern": { mode: "dark",  colorway: "rs3-modern" },
  light:        { mode: "light", colorway: "default" },
  "sol-dark":   { mode: "dark",  colorway: "solarized" },
  "sol-light":  { mode: "light", colorway: "solarized" },
};

// ─── Detail-row label text & tooltip descriptions ───────────────────────────

/**
 * Canonical display text for each detail-row label.
 * Centralised so the card and modal stay in sync.
 */
const DETAIL_LABELS: Record<string, string> = {
  "GE Price":            "GE Price",
  "Rec. Buy Price":      "Rec. Buy Price",
  "Rec. Sell Price":     "Rec. Sell Price",
  "Est. Flip Profit":    "Est. Flip Profit",
  "24h Global Vol":      "24h Global Vol",
  "Eff. Player Vol":     "Eff. Player Vol",
  "Volume Spike":        "Volume Spike",
  "Player Traded Val":   "Player Traded Val",
  "Buy Limit (4h)":      "Buy Limit (4h)",
  "Max Capital (4h)":    "Max Capital (4h)",
  "Tax Gap":             "Tax Gap",
  "Est. Margin (2% tax)":"Est. Margin (2% tax)",
  "High Alch":           "High Alch",
  "30d EMA":             "30d EMA",
  "Daily Volatility":    "Daily Volatility",
  "LR Slope":            "LR Slope",
  "Predicted Price":     "Predicted Price",
};

/**
 * Hover tooltip explanations for each detail-row metric.
 * Displayed as the native `title` attribute so users can learn
 * what each number means without leaving the overlay.
 */
const DETAIL_TIPS: Record<string, string> = {
  "GE Price":            "Latest mid-price reported by the Grand Exchange API.",
  "Rec. Buy Price":      "Suggested buy-offer price — ~1% below the GE mid-price for a realistic instant-buy entry.",
  "Rec. Sell Price":     "Suggested sell price — ~3% above mid-price to cover the 2% GE tax and still leave profit.",
  "Est. Flip Profit":    "Estimated profit per item if you buy at the rec. buy price and sell at the rec. sell price, after the 2% GE tax.",
  "24h Global Vol":      "Total number of this item traded across all players in the last 24 hours.",
  "Eff. Player Vol":     "The lower of global daily volume and your personal daily limit (buy limit × 6 windows). Reflects how many you can realistically flip per day.",
  "Volume Spike":        "Today's volume compared to its 7-day average. Values above 1.5× indicate unusual hype or demand.",
  "Player Traded Val":   "Total gp throughput a single player can achieve per day — GE price × effective player volume.",
  "Buy Limit (4h)":      "Maximum quantity you can buy from the GE every 4 hours. Set by Jagex per item.",
  "Max Capital (4h)":    "Maximum gp you need to fill one full buy-limit window — GE price × buy limit.",
  "Tax Gap":             "Minimum price difference needed between buy and sell to break even after the 2% GE tax.",
  "Est. Margin (2% tax)":"The flat gp amount the 2% GE tax takes from one sale at the current price.",
  "High Alch":           "High Alchemy value in gp \u2014 used as the sell-price floor to prevent recommending sales below alch value.",
  "30d EMA":             "30-day Exponential Moving Average. Price above EMA = bullish; below = bearish.",
  "Daily Volatility":    "Standard deviation of daily percentage price changes. Higher \u2192 wider swings \u2192 more risk but potentially faster flips.",
  "LR Slope":            "Linear-regression slope of the price series (gp per day). Positive = upward drift, negative = declining.",
  "Predicted Price":     "Next-day price predicted by linear regression of the historical price series.",
};

/**
 * Tooltip descriptions for the chart stat cards shown below the price graph.
 * Each key matches a stat label (with `${range}` interpolated at call time).
 */
const STAT_TIPS: Record<string, string> = {
  "Trend":         "Overall price direction over the selected time window. Uptrend (>+5%), Downtrend (>\u22125%), or Stable.",
  "Change":        "Absolute gp change and percentage change between the oldest and most recent price in the range.",
  "Current Price": "The latest mid-price reported by the Grand Exchange API.",
  "High":          "Highest recorded daily price within the selected time window.",
  "Low":           "Lowest recorded daily price within the selected time window.",
  "Volatility":    "Price range as a percentage of the lowest price \u2014 higher values mean wider swings and more risk.",
  "Data Points":   "Number of daily price snapshots available in the selected window. More points = more reliable trend data.",
};

/**
 * Build a single stat-card HTML string with a tooltip `title` attribute.
 * Works for both `.graph-stat-row` (graph modal) and `.analytics-stat-card`
 * (analytics modal) — the caller picks the wrapper class.
 *
 * @param cls      - CSS class for the card div (e.g. `"graph-stat-row"` or `"analytics-stat-card"`).
 * @param label    - Display text for the label span.
 * @param value    - Display text for the value span.
 * @param tipKey   - Key into {@link STAT_TIPS} (without range prefix).
 * @param style    - Optional inline style for the value span.
 */
function statCardHtml(cls: string, label: string, value: string, tipKey: string, style?: string): string {
  const labelCls = cls === "analytics-stat-card" ? "analytics-stat-label" : "graph-stat-label";
  const valueCls = cls === "analytics-stat-card" ? "analytics-stat-value" : "graph-stat-value";
  const tip = STAT_TIPS[tipKey] ?? "";
  const styleAttr = style ? ` style="${style}"` : "";
  return (
    `<div class="${cls}" title="${tip}">` +
      `<span class="${labelCls}">${label}</span>` +
      `<span class="${valueCls}"${styleAttr}>${value}</span>` +
    `</div>`
  );
}

// ─── Favorites helpers ──────────────────────────────────────────────────────

/**
 * Load the persisted favourites list, auto-migrating from the legacy
 * `string[]` format to `FavoriteItem[]` on first access.
 */
function loadFavorites(): FavoriteItem[] {
  try {
    const raw = localStorage.getItem(LS_FAVORITES);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Legacy format: plain string array → migrate to FavoriteItem[].
    if (parsed.length > 0 && typeof parsed[0] === "string") {
      const migrated: FavoriteItem[] = (parsed as string[]).map((name) => ({ name }));
      localStorage.setItem(LS_FAVORITES, JSON.stringify(migrated));
      return migrated;
    }

    return parsed as FavoriteItem[];
  } catch {
    return [];
  }
}

/** Persist the favourites list. */
function saveFavorites(favs: FavoriteItem[]): void {
  localStorage.setItem(LS_FAVORITES, JSON.stringify(favs));
}

/** Return the Set of favourited item names from localStorage. */
function getFavorites(): Set<string> {
  return new Set(loadFavorites().map((f) => f.name));
}

/** Toggle an item's favourite status and persist the result. Returns the new state. */
function toggleFavorite(name: string): boolean {
  const favs = loadFavorites();
  const idx = favs.findIndex((f) => f.name === name);
  if (idx >= 0) {
    favs.splice(idx, 1);
    saveFavorites(favs);
    renderFavorites();
    return false;
  }
  favs.push({ name });
  saveFavorites(favs);
  renderFavorites();
  return true;
}

/**
 * Read the alert thresholds for a specific favourited item.
 * Returns `undefined` if the item is not favourited.
 */
function getFavoriteAlerts(name: string): FavoriteItem | undefined {
  return loadFavorites().find((f) => f.name === name);
}

/**
 * Update the price-alert thresholds for a favourited item.
 * Creates the favourite entry if it doesn't already exist.
 */
function setFavoriteAlerts(name: string, targetBuy?: number, targetSell?: number): void {
  const favs = loadFavorites();
  let entry = favs.find((f) => f.name === name);
  if (!entry) {
    entry = { name };
    favs.push(entry);
  }
  entry.targetBuy = targetBuy;
  entry.targetSell = targetSell;
  saveFavorites(favs);
}

/** When true, the next autocomplete open is suppressed. */
let suppressAutocomplete = false;

/**
 * Pre-fill the portfolio flip form with the given item data and switch to
 * the portfolio tab so the user only needs to enter a quantity.
 */
function quickAddToPortfolio(item: RankedItem): void {
  // Suppress the autocomplete dropdown that would normally open when the
  // name input receives focus as the portfolio tab becomes visible.
  suppressAutocomplete = true;

  // Switch to portfolio tab (in tabbed layout).
  switchTab("portfolio");

  // Pre-fill the form fields.
  els.flipItemName.value = item.name;
  els.flipBuyPrice.value = String(item.recBuyPrice);
  els.flipSellPrice.value = String(item.recSellPrice);
  els.flipQuantity.value = "";

  closeItemSuggestions();
  els.flipQuantity.focus();

  // Reset the flag after the current event cycle so future interactions
  // work normally.
  requestAnimationFrame(() => { suppressAutocomplete = false; });
}

// ─── Cached DOM references ──────────────────────────────────────────────────

/** Lazily resolved element cache — populated in {@link initUI}. */
let els: {
  alt1Status: HTMLElement;
  providerSelect: HTMLSelectElement;
  providerCostHint: HTMLElement;
  setupGuideBtn: HTMLButtonElement;
  customEndpointGroup: HTMLElement;
  customEndpointInput: HTMLInputElement;
  modelInput: HTMLInputElement;
  modelOptions: HTMLDataListElement;
  apiKeyInput: HTMLInputElement;
  saveKeyBtn: HTMLButtonElement;
  keyStatus: HTMLElement;
  filterVolume: HTMLSelectElement;
  filterPrice: HTMLSelectElement;
  top20SortSelect: HTMLSelectElement;
  searchSortSelect: HTMLSelectElement;
  volumeCustomGroup: HTMLElement;
  volumeMinSlider: HTMLInputElement;
  volumeMinInput: HTMLInputElement;
  volumeMaxSlider: HTMLInputElement;
  volumeMaxInput: HTMLInputElement;
  budgetCustomGroup: HTMLElement;
  budgetSlider: HTMLInputElement;
  budgetInput: HTMLInputElement;
  marketSearchInput: HTMLInputElement;
  searchLoading: HTMLElement;
  searchResults: HTMLElement;
  favoritesSection: HTMLElement;
  favoritesItems: HTMLElement;
  favoritesCollapseBtn: HTMLButtonElement;
  favoritesSortSelect: HTMLSelectElement;
  refreshMarketBtn: HTMLButtonElement;
  fullMarketScanBtn: HTMLButtonElement;
  deepHistoryCheckbox: HTMLInputElement;
  syncProgress: HTMLElement;
  syncProgressFill: HTMLElement;
  syncProgressText: HTMLElement;
  marketLoading: HTMLElement;
  marketItems: HTMLElement;
  errorBanner: HTMLElement;
  errorBannerMsg: HTMLElement;
  errorRetryBtn: HTMLButtonElement;
  viewListBtn: HTMLButtonElement;
  viewTileBtn: HTMLButtonElement;
  viewHybridBtn: HTMLButtonElement;
  compactTilesToggle: HTMLInputElement;
  top20CollapseBtn: HTMLButtonElement;
  chatHistory: HTMLElement;
  chatInput: HTMLInputElement;
  chatSendBtn: HTMLButtonElement;
  clearChatBtn: HTMLButtonElement;
  forceReloadBtn: HTMLButtonElement;
  reloadStatus: HTMLElement;
  layoutTabbedBtn: HTMLButtonElement;
  layoutSidebarBtn: HTMLButtonElement;
  styleSelect: HTMLSelectElement;
  colorwaySelect: HTMLSelectElement;
  modeDarkBtn: HTMLButtonElement;
  modeLightBtn: HTMLButtonElement;
  contrastSelect: HTMLSelectElement;
  contrastAutoToggle: HTMLInputElement;
  tabMarketBtn: HTMLButtonElement;
  tabAdvisorBtn: HTMLButtonElement;
  viewTabs: HTMLElement;
  marketView: HTMLElement;
  advisorView: HTMLElement;
  tabPortfolioBtn: HTMLButtonElement;
  portfolioView: HTMLElement;
  flipItemName: HTMLInputElement;
  flipSuggestions: HTMLElement;
  flipBuyPrice: HTMLInputElement;
  flipQuantity: HTMLInputElement;
  flipSellPrice: HTMLInputElement;
  addFlipBtn: HTMLButtonElement;
  activeFlipsList: HTMLElement;
  portfolioActiveBtn: HTMLButtonElement;
  portfolioHistoryBtn: HTMLButtonElement;
  portfolioActiveContainer: HTMLElement;
  portfolioHistoryContainer: HTMLElement;
  statTotalProfit: HTMLElement;
  statTotalFlips: HTMLElement;
  statAvgProfit: HTMLElement;
  statAvgRoi: HTMLElement;
  completedFlipsList: HTMLElement;
  exportDataBtn: HTMLButtonElement;
  importDataBtn: HTMLButtonElement;
  importFileInput: HTMLInputElement;
  historyRangeSelect: HTMLSelectElement;
  completedFlipsFilter: HTMLInputElement;
  exportCsvBtn: HTMLButtonElement;
  searchFilterBtn: HTMLButtonElement;
  searchFilterPopover: HTMLElement;
  browseAllBtn: HTMLButtonElement;
  backToTopBtn: HTMLButtonElement;
};

// ─── Completed-flips sort state ─────────────────────────────────────────────
let completedFlipsSortCol: "date" | "item" | "profit" | "roi" = "date";
let completedFlipsSortAsc = false; // default descending (newest first)

// ─── Shared service instances (initialised once) ────────────────────────────

let cache: CacheService;
let analyzer: MarketAnalyzerService;
let wiki: WikiService;

/** Most recent formatted market summary — reused across chat messages. */
let latestMarketSummary = "";
/**
 * Broader LLM context (top 200 items by traded value, no filters).
 * Built alongside the UI panel but with relaxed constraints so the chat
 * advisor has a much wider market view than the filtered top-20 panel.
 * Falls back to `latestMarketSummary` until the first build completes.
 */
let latestLLMContext = "";
/** The top items array, cached for re-sorting without re-fetching. */
let latestTopItems: RankedItem[] = [];
/** The latest search results, cached for re-sorting without re-fetching. */
let latestSearchResults: RankedItem[] = [];

/** Unfiltered search results before category filters are applied. */
let unfilteredSearchResults: RankedItem[] = [];

/** Currently active search filter tags (set of filter IDs). */
const activeSearchFilters = new Set<string>();

/** Cached Nature rune price for alch profit calculations. Updated on each market refresh. */
let cachedNatureRunePrice = 500;

/** Currently active view mode for the market panel. */
let currentView: ViewMode = "list";

/** Whether compact-tiles mode is enabled (hides predictive badges in tile/hybrid view). */
let compactMode = false;

/** Shared LLM service instance — persists conversation history across sends. */
let llm: LLMService | null = null;

/** Portfolio service singleton. */
let portfolio: PortfolioService;

/** Interval ID for the portfolio countdown timer. */
let portfolioTimerId: ReturnType<typeof setInterval> | null = null;

/**
 * Lightweight name+price pairs for every item in IndexedDB.
 * Loaded once after cache opens; used by the portfolio autocomplete to let
 * the user search the full GE catalogue.
 */
let allCachedItems: { name: string; price: number }[] = [];

/**
 * Full GE item catalogue (∼7 000 entries) fetched from RS Wiki at startup.
 * Used by the market search to find items beyond the seeded cache.
 */
let geCatalogue: GECatalogueEntry[] = [];

// ─── Search filter categories ───────────────────────────────────────────────

interface SearchFilterDef {
  id: string;
  label: string;
  match: (name: string, item?: RankedItem) => boolean;
}

interface SearchFilterGroup {
  title: string;
  filters: SearchFilterDef[];
}

/** Case-insensitive keyword helper. */
function nameHasAny(name: string, keywords: string[]): boolean {
  const lower = name.toLowerCase();
  return keywords.some((k) => lower.includes(k.toLowerCase()));
}

const SEARCH_FILTER_GROUPS: SearchFilterGroup[] = [
  /* ── Combat Equipment ──────────────────────────────────────────── */
  {
    title: "Combat Equipment",
    filters: [
      { id: "ce-melee-armour", label: "Melee Armour", match: (n) => nameHasAny(n, [
        "platebody", "platelegs", "plateskirt", "chainbody", "full helm", "med helm",
        "kiteshield", "sq shield", "gauntlets", "sabatons", "defender",
        "bandos", "torva", "malevolent", "masterwork", "rock-shell",
        "bane armour", "elder rune armour", "orikalkum armour", "necronium armour",
        "trimmed masterwork", "hauberk", "greaves", "cuirass", "linza"
      ]) },
      { id: "ce-melee-weapons", label: "Melee Weapons", match: (n) => nameHasAny(n, [
        "sword", "scimitar", "mace", "warhammer", "lance", "halberd", "whip",
        "godsword", "maul", "rapier", "spear", "claw", "dagger", "2h sword",
        "battleaxe", "longsword", "hasta", "noxious scythe", "drygore",
        "khopesh", "abyssal vine", "lava whip", "ripper claw", "korasi",
        "saradomin sword", "zamorakian spear", "flail", "cleaver"
      ]) },
      { id: "ce-ranged-armour", label: "Ranged Armour", match: (n) => nameHasAny(n, [
        "dragonhide body", "d'hide body", "d'hide chaps", "d'hide vamb",
        "armadyl", "pernix", "sirenic", "royal d'hide", "karil",
        "robin hood", "ranger boots", "snakeskin", "spined", "coif",
        "chaps", "vambraces", "anima core of zamorak", "elite ranger",
        "glaiven", "fleeting boots", "tracking gloves"
      ]) },
      { id: "ce-ranged-weapons", label: "Ranged Weapons", match: (n) => nameHasAny(n, [
        "crossbow", "shortbow", "longbow", "shieldbow", "chargebow",
        "noxious longbow", "seren godbow", "blowpipe", "decimation",
        "zaryte bow", "hexhunter bow", "wyvern crossbow", "ascension crossbow",
        "mechanised chinchompa", "sagittarian", "hand cannon"
      ]) },
      { id: "ce-magic-armour", label: "Magic Armour", match: (n) => nameHasAny(n, [
        "mystic robe", "ahrim", "virtus", "tectonic", "subjugation",
        "ganodermic", "seasinger", "anima core of seren", "skeletal",
        "splitbark", "infinity robe", "zuriel", "robes of", "batwing",
        "dagon'hai", "fungal visor", "fungal poncho", "fungal leggings",
        "battle-mage"
      ]) },
      { id: "ce-magic-weapons", label: "Magic Weapons", match: (n) => nameHasAny(n, [
        "staff of", " staff", "wand", "book of", "seismic", "noxious staff",
        "inquisitor staff", "fractured staff", "cywir", "obliteration",
        "abyssal wand", "seasinger kiba", "virtus wand", "orb of",
        "polypore staff", "camel staff", "staff of sliske"
      ]) },
      { id: "ce-ammunition", label: "Ammunition", match: (n) => nameHasAny(n, [
        "arrow", "bolt", "dart", "javelin", "throwing knife", "throwing axe",
        "chinchompa", "brutal", "cannonball", "skillchompa",
        "bakriminel", "ascension bolt", "dragonstone bolt", "ruby bolt",
        "diamond bolt", "onyx bolt", "hydrix bolt", "tar", "grapple",
        "fire arrows", "ogre arrow"
      ]) },
      { id: "ce-prayer-necro", label: "Prayer / Necro Gear", match: (n) => nameHasAny(n, [
        "proselyte", "initiate", "vestment", "monk robe", "stole",
        "mitre", "crozier", "deathwarden", "deathstorm",
        "skull lantern", "spectral shield", "prayer cape",
        "spirit shield", "deathguard", "omni guard",
        "first necromancer", "soulbound lantern"
      ]) },
    ],
  },
  /* ── Skills / Materials ────────────────────────────────────────── */
  {
    title: "Skills / Materials",
    filters: [
      { id: "sk-herblore", label: "Herblore", match: (n) => nameHasAny(n, [
        "grimy", "clean ", "unfinished potion", "vial of",
        "dwarf weed", "snapdragon", "torstol", "lantadyme", "cadantine",
        "kwuarm", "avantoe", "ranarr", "toadflax", "irit", "harralander",
        "tarromin", "guam", "marrentill", "spirit weed", "wergali", "fellstalk",
        "arbuck", "bloodweed",
        "eye of newt", "limpwurt root", "white berries", "red spiders' eggs",
        "wine of zamorak", "potato cactus", "mort myre fungus", "snape grass",
        "blue dragon scale", "crushed nest", "jangerberries", "ground mud rune",
        "bird nest", "unicorn horn dust", "kebbit teeth dust",
        "primal extract", "coconut milk", "desert goat horn", "goat horn dust",
        "cave nightshade", "grenwall spike", "crystal flask", "proboscis",
        "spark chitin", "ground miasma rune", "wimpy feather"
      ]) },
      { id: "sk-mining-smithing", label: "Mining & Smithing", match: (n) => nameHasAny(n, [
        " ore", " bar", "arrowhead", "dart tip", "unfinished bolt",
        "bane ", "elder rune", "orikalkum", "necronium", "phasmatite",
        "banite", "luminite", "drakolith", "light animica", "dark animica",
        "copper ore", "tin ore", "iron ore", "coal", "mithril ore",
        "adamantite ore", "runite ore", "gold ore", "silver ore",
        "bronze bar", "iron bar", "steel bar", "mithril bar", "adamant bar",
        "rune bar", "gold bar", "silver bar", "stone spirit",
        "corrupted ore", "concentrated gold", "seren stone"
      ]) },
      { id: "sk-crafting", label: "Crafting", match: (n) => nameHasAny(n, [
        "dragonhide", "d'hide", "leather", "uncut ", " gem",
        "emerald", "ruby", "sapphire", "diamond", "onyx", "hydrix",
        "dragonstone", "gold bar", "silver bar", "battlestaff",
        "molten glass", "ball of wool", "flax", "bowstring",
        "red topaz", "jade", "opal", "cut "
      ]) },
      { id: "sk-cooking", label: "Cooking", match: (n) => nameHasAny(n, [
        "raw ", "cooked ", "shark", "rocktail", "sailfish", "lobster",
        "swordfish", "monkfish", "tuna", "trout", "salmon", "pie",
        "cake", "bread", "soup", "manta ray", "cavefish", "catfish",
        "great white", "blue blubber", "green blubber",
        "baron shark", "bass", "herring", "karambwan",
        "ale yeast", "barley", "barley malt", "hops",
        "dough", "flour", "milk", "chocolate", "grapes",
        "biscuit", "pizza", "kebab", "stew",
        "shrimp", "sardine", "mackerel", "pike", "cod",
        "sea turtle", "roast ", "wrapped oomlie"
      ]) },
      { id: "sk-fletching", label: "Fletching", match: (n) => nameHasAny(n, [
        "arrow shaft", "bowstring", "headless arrow", "feather",
        "unstrung", "bow (u)", "crossbow (u)", "longbow (u)", "shortbow (u)",
        "shieldbow (u)", "javelin shaft", "flax", "bolt tips",
        "broad arrowhead", "ascension shard"
      ]) },
      { id: "sk-farming", label: "Farming & Seeds", match: (n) => nameHasAny(n, [
        "seed", "sapling", "compost", "plant cure", "herb seed",
        "allotment", "snapdragon seed", "torstol seed", "magic seed",
        "yew seed", "papaya", "coconut", "pineapple", "sweetcorn",
        "strawberry", "watermelon", "avocado", "mango", "dragonfruit",
        "cactus spine", "calquat", "spirit seed", "palm tree",
        "mushroom spore", "poison ivy"
      ]) },
      { id: "sk-runecrafting", label: "Runecrafting", match: (n) => nameHasAny(n, [
        "pure essence", "rune essence", "talisman", "tiara",
        "binding necklace", "runecrafting", "vis wax"
      ]) },
      { id: "sk-construction", label: "Construction", match: (n) => nameHasAny(n, [
        "plank", "limestone", "marble block", "white marble", "gold leaf",
        "mahogany plank", "teak plank", "oak plank",
        "bolt of cloth", "nails", "flatpack", "bagged ",
        "clockwork"
      ]) },
      { id: "sk-woodcutting", label: "Woodcutting", match: (n) => nameHasAny(n, [
        "logs", "wood spirit"
      ]) },
      { id: "sk-archaeology", label: "Archaeology", match: (n) => nameHasAny(n, [
        "soil", "chronotes", "artefact", "restored ", "mattock",
        "ancient vis", "tyrian purple", "whiteite", "cadmium red",
        "samite silk", "goldrune", "orthenglass", "star of saradomin",
        "hellfire metal", "quintessence", "imperial steel",
        "armadylean yellow", "stormguard steel", "wings of war",
        "warforged bronze", "zarosian insignia", "third age iron",
        "blood of orcus", "white oak", "soapstone", "vellum",
        "leather scraps", "animal furs", "malachite green",
        "cobalt blue", "chaotic brimstone", "demonhide", "keramos",
        "silvthril", "everlight silvthril", "orgone", "felt"
      ]) },
      { id: "sk-summoning", label: "Summoning", match: (n) => nameHasAny(n, [
        "pouch", "spirit shard", "charm", "spirit gem", "summoning",
        "water talisman", "tortoise shell", "honeycomb",
        "swamp lizard", "crimson charm", "blue charm", "gold charm", "green charm",
        "kyatt", "graahk", "larupia"
      ]) },
      { id: "sk-prayer", label: "Prayer Materials", match: (n) => nameHasAny(n, [
        "bone", "ashes", "ectoplasm", "dragon bone", "frost dragon bone",
        "big bone", "dagannoth bone", "airut bone", "dinosaur bone",
        "reinforced dragon bone", "hardened dragon bone", "baby dragon bone",
        "wyvern bone", "impious ashes", "accursed ashes", "infernal ashes",
        "searing ashes", "tortured ashes", "holy elixir"
      ]) },
      { id: "sk-divination", label: "Divination", match: (n) => nameHasAny(n, [
        "energy", "sign of", "divine ", "porter", "incandescent",
        "luminous", "brilliant", "vibrant", "radiant", "elder energy",
        "cursed energy", "pale energy", "flickering", "gleaming", "lustrous"
      ]) },
      { id: "sk-invention", label: "Invention", match: (n) => nameHasAny(n, [
        "augment", "divine charge", "simple parts", "component",
        "siphon", "equipment dissolver", "charge pack",
        "ancient invention", "gizmo"
      ]) },
      { id: "sk-firemaking", label: "Firemaking", match: (n) => nameHasAny(n, [
        "incense stick", "pyre log", "pyre logs"
      ]) },
      { id: "sk-hunting", label: "Hunting", match: (n) => nameHasAny(n, [
        "box trap", "bird snare", "butterfly net", "magic box",
        "noose wand", "teasing stick", "kebbit", "chinchompa",
        "imp-in-a-box", "rabbit", "jerboa", "larupia", "graahk",
        "kyatt", "polar kebbit", "sabre-tooth", "hunter kit"
      ]) },
    ],
  },
  /* ── Consumables ───────────────────────────────────────────────── */
  {
    title: "Consumables",
    filters: [
      { id: "co-food", label: "Food & Drink", match: (n) => nameHasAny(n, [
        "shark", "rocktail", "sailfish", "lobster", "swordfish", "monkfish",
        "tuna", "manta ray", "cavefish", "baron shark", "blue blubber",
        "great white", "green blubber", "catfish", "bass", "trout", "salmon",
        "pie", "cake", "bread", "soup", "stew", "pizza", "biscuit",
        "anchovies", "cooked ", "baguette", "kebab", "curry",
        "beer", "ale ", "wine", "cider", "grog",
        "jellyfish", "beltfish", "desert sole", "ghostly sole",
        "shrimp", "sardine", "herring", "mackerel", "pike",
        "karambwan", "sea turtle", "roast ", "wrapped oomlie"
      ]) },
      { id: "co-potions", label: "Potions", match: (n) => nameHasAny(n, [
        "potion", "flask", "overload", "brew", "prayer renewal",
        "super restore", "weapon poison", "antifire", "aggression",
        "adrenaline", "extreme", "supreme overload", "saradomin brew",
        "super antifire", "super prayer", "replenishment", "powerburst",
        "antipoison", "super antipoison", "combat mix", "prayer mix",
        "restore mix", "mixture", "juju"
      ]) },
      { id: "co-runes-teleports", label: "Runes & Teleports", match: (n) => nameHasAny(n, [
        "air rune", "water rune", "earth rune", "fire rune",
        "mind rune", "body rune", "cosmic rune", "chaos rune",
        "nature rune", "law rune", "death rune", "blood rune",
        "soul rune", "astral rune", "armadyl rune",
        "dust rune", "lava rune", "mist rune", "mud rune",
        "smoke rune", "steam rune",
        "teleport", "teletab", "tablet",
        "ring of duelling", "ring of wealth", "combat bracelet",
        "skills necklace", "games necklace", "amulet of glory",
        "ectophial", "house teleport"
      ]) },
      { id: "co-scrolls", label: "Summoning Scrolls", match: (n) => nameHasAny(n, [
        "scroll ("
      ]) },
      { id: "co-pocket", label: "Pocket Items", match: (n) => nameHasAny(n, [
        "scrimshaw", "god book", "book of", "illuminated ",
        "sign of the porter", "sign of life", "sign of death",
        "scripture", "grimoire", "god page",
        "ancient page", "armadyl page", "bandos page",
        "guthix page", "saradomin page", "zamorak page", "zaros page",
        "seren page"
      ]) },
    ],
  },
  /* ── Other ─────────────────────────────────────────────────────── */
  {
    title: "Other",
    filters: [
      { id: "ot-jewellery", label: "Jewellery", match: (n) => nameHasAny(n, [
        "amulet", "necklace", "bracelet", "ring of", "brooch",
        "pendant", "ring (", "onyx ring", "diamond ring",
        "ruby ring", "emerald ring", "sapphire ring", "dragonstone ring",
        "zenyte", "alchemical onyx",
        "luck of the dwarves", "hazelmere", "locket"
      ]) },
      { id: "ot-salvage", label: "Salvage", match: (n) => nameHasAny(n, ["salvage"]) },
      { id: "ot-stone-spirits", label: "Stone Spirits", match: (n) => nameHasAny(n, [
        "stone spirit"
      ]) },
      { id: "ot-costumes", label: "Costumes", match: (n) => nameHasAny(n, [
        "costume", "outfit", "mask", "wig", "robe set",
        "fancy dress", "mime", "lederhosen", "camo", "zombie"
      ]) },
      { id: "ot-tools", label: "Tools & Containers", match: (n) => nameHasAny(n, [
        "hatchet", "pickaxe", "chisel", "hammer", "knife",
        "tinderbox", "bucket", "jug", "vial", "pot ", "basket",
        "watering can", "secateurs", "spade", "rake"
      ]) },
      { id: "ot-familiars", label: "Familiars", match: (n) => nameHasAny(n, [
        "pouch", "familiar", "beast of burden", "titan ", "minotaur",
        "unicorn stallion", "war tortoise", "pack yak", "nihil",
        "ripper demon", "steel titan", "pack mammoth"
      ]) },
      { id: "ot-rares", label: "Rares / Discontinued", match: (n) => nameHasAny(n, [
        "partyhat", "cracker", "santa hat", "h'ween mask", "halloween mask",
        "disk of returning", "pumpkin", "easter egg", "black santa",
        "christmas scythe", "christmas cracker",
        "fish mask", "holly wreath", "candy cane", "yo-yo"
      ]) },
    ],
  },
  /* ── Metric-based signals (no GE category equivalent) ──────────── */
  {
    title: "Market Signals",
    filters: [
      { id: "ms-uptrend",    label: "\u25b2 Uptrend",     match: (_n, item) => item?.priceTrend === "Uptrend" },
      { id: "ms-downtrend",  label: "\u25bc Downtrend",    match: (_n, item) => item?.priceTrend === "Downtrend" },
      { id: "ms-instaflip",  label: "\u26a1 Insta-Flip",   match: (_n, item) => item?.tradeVelocity === "Insta-Flip" },
      { id: "ms-hype",       label: "\ud83d\udd25 Volume Spike",  match: (_n, item) => (item?.volumeSpikeMultiplier ?? 0) > 0 },
      { id: "ms-highalch",   label: "\ud83e\uddea Alch Profit",   match: (_n, item) => typeof item?.highAlch === "number" && item.highAlch > (item.price + cachedNatureRunePrice) },
      { id: "ms-risky",      label: "\u26a0 Risky",       match: (_n, item) => item?.isRisky === true },
    ],
  },
];

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Bootstrap the entire UI.  Call once from the entry point after the DOM is
 * ready.  Returns only after the initial data pipeline has completed and the
 * market panel is rendered.
 */
export async function initUI(onStatus?: (msg: string, step: string) => void): Promise<void> {
  resolveElements();
  bindDisclaimer();
  populateProviderDropdown();
  restoreSettings();
  bindSettingsEvents();
  bindChatEvents();
  bindViewToggle();
  bindMarketFilters();
  bindSearchFilters();
  bindForceReload();
  bindLayoutToggle();
  bindTheme();
  bindTabNavigation();
  bindClearChat();
  bindPortfolio();
  bindErrorRetry();
  bindDataManagement();
  bindFullMarketScan();
  bindBackToTop();
  requestNotificationPermission();

  // Initialise shared service singletons.
  cache = new CacheService();
  await cache.open();
  analyzer = new MarketAnalyzerService(cache);
  wiki = new WikiService();
  portfolio = new PortfolioService();

  // Run the initial market analysis and render.
  onStatus?.("Ranking top items\u2026", "Step 2 of 4");
  try {
    await refreshMarketPanel();
  } catch (err) {
    console.error("[UIService] Startup: market panel failed:", err);
    const msg = err instanceof Error ? err.message : "Could not load market data.";
    showError(msg);
  }

  // Render the favourites section (if any favourites exist).
  onStatus?.("Loading favourites\u2026", "Step 3 of 4");
  restoreFavSort();
  bindFavSort();
  await renderFavorites();
  bindFavoritesCollapse();
  bindTop20Collapse();

  // Build the full item catalogue for portfolio autocomplete.
  await loadItemCatalogue();

  // Fetch the full GE catalogue (~7 000 items) for market search.
  onStatus?.("Fetching item catalogue\u2026", "Step 4 of 4");
  try {
    geCatalogue = await fetchGECatalogue();
  } catch (err) {
    console.warn("[UIService] GE catalogue fetch failed:", err);
    geCatalogue = [];
  }

  // Restore any persisted LLM chat conversation.
  restoreChatHistory();

  // Render any persisted portfolio flips and start the countdown timer.
  renderFlips();
  renderCompletedFlips();
  startPortfolioTimer();
  bindPortfolioSubNav();
  bindCompletedFlipsFilter();
  bindCsvExport();
}

// ─── Settings (API Key) ─────────────────────────────────────────────────────

/**
 * Map a {@link ProviderCostTier} to a short human-readable badge label.
 */
function costTierBadge(tier: string): string {
  switch (tier) {
    case "free":        return "\u2705 FREE";
    case "free-tier":   return "\u{1F193} Free Tier";
    case "low-cost":    return "\uD83D\uDCB2 Low Cost";
    case "paid":        return "\uD83D\uDCB3 Paid";
    case "self-hosted": return "\uD83D\uDDA5\uFE0F Self-hosted";
    default:            return "";
  }
}

/**
 * Populate the provider `<select>` element from the {@link LLM_PROVIDERS}
 * preset array, annotating each option with its cost tier badge.
 */
function populateProviderDropdown(): void {
  els.providerSelect.innerHTML = "";
  for (const p of LLM_PROVIDERS) {
    const opt = document.createElement("option");
    opt.value = p.id;
    const badge = costTierBadge(p.costTier);
    opt.textContent = badge ? `${p.label}  ${badge}` : p.label;
    if (p.id === "groq") opt.textContent += " \u2B50 Recommended";
    els.providerSelect.appendChild(opt);
  }
}

/**
 * Return the {@link LLMProvider} preset for the given id, falling back to the
 * first provider (Groq) if the id is unrecognised.
 */
function getProviderById(id: string): LLMProvider {
  return LLM_PROVIDERS.find((p) => p.id === id) ?? LLM_PROVIDERS[0];
}

/**
 * Read previously-saved settings from `localStorage` and populate all inputs.
 */
function restoreSettings(): void {
  const savedProvider = localStorage.getItem(LS_PROVIDER) ?? LLM_PROVIDERS[0].id;
  const savedModel = localStorage.getItem(LS_MODEL) ?? "";
  const savedEndpoint = localStorage.getItem(LS_ENDPOINT) ?? "";
  const savedKey = localStorage.getItem(LS_API_KEY) ?? "";

  els.providerSelect.value = savedProvider;
  els.modelInput.value = savedModel;
  els.customEndpointInput.value = savedEndpoint;
  els.apiKeyInput.value = savedKey;

  applyProviderUI(getProviderById(savedProvider));

  if (savedKey) {
    setKeyStatus("Key loaded from storage.", false);
  }
}

/**
 * Update UI elements that depend on the active provider selection:
 * placeholder text, custom endpoint visibility, model datalist, model placeholder,
 * cost tier hint, and setup guide button visibility.
 */
function applyProviderUI(provider: LLMProvider): void {
  // Toggle custom endpoint field visibility.
  els.customEndpointGroup.classList.toggle("hidden", provider.id !== "custom");

  // Update placeholders.
  els.apiKeyInput.placeholder = provider.keyPlaceholder;
  els.modelInput.placeholder = provider.defaultModel || "(enter model name)";

  // Cost tier hint.
  const badge = costTierBadge(provider.costTier);
  els.providerCostHint.textContent = badge ? `${badge} \u2014 ${provider.costNote}` : provider.costNote;
  els.providerCostHint.className = `provider-cost-hint tier-${provider.costTier}`;

  // Show/hide setup guide button (only useful for cloud providers with a signup URL).
  els.setupGuideBtn.classList.toggle("hidden", !provider.signupUrl);

  // Rebuild datalist options for this provider's model catalogue.
  populateModelDatalist(provider);
}

/**
 * Rebuild the `<datalist>` options from the provider's curated model list.
 * The recommended model's label is annotated with a star.
 */
function populateModelDatalist(provider: LLMProvider): void {
  els.modelOptions.innerHTML = "";

  for (const m of provider.models) {
    const opt = document.createElement("option");
    opt.value = m.id;
    opt.label = m.recommended ? `★ ${m.label} (recommended)` : m.label;
    els.modelOptions.appendChild(opt);
  }
}

// ─── API Key Setup Guide Modal ──────────────────────────────────────────────

/** Lazily-created singleton setup guide modal. */
let setupGuideModal: HTMLElement | null = null;

/**
 * Provider-specific setup instructions.  Keyed by provider ID.
 * Each entry has numbered steps and an optional note.
 */
const SETUP_GUIDES: Record<string, { steps: string[]; note?: string }> = {
  groq: {
    steps: [
      'Go to <a href="https://console.groq.com" target="_blank" rel="noopener">console.groq.com</a> and click <strong>Sign Up</strong> (Google / GitHub / email).',
      "No credit card is required \u2014 the free tier is generous enough for this plugin.",
      'Once logged in, navigate to <strong>API Keys</strong> in the left sidebar (or visit <a href="https://console.groq.com/keys" target="_blank" rel="noopener">console.groq.com/keys</a>).',
      'Click <strong>Create API Key</strong>, give it a name (e.g. "GE Analyzer"), and copy the key.',
      "Paste the key into the <em>API Key</em> field above and click <strong>Save</strong>.",
      "Select a model (the default <strong>Llama 3.1 8B Instant</strong> works great) and you\u2019re ready to go!",
    ],
    note: "Groq\u2019s free tier allows thousands of requests per day with fast inference \u2014 perfect for this plugin. Rate limits reset daily.",
  },
  openai: {
    steps: [
      'Go to <a href="https://platform.openai.com/signup" target="_blank" rel="noopener">platform.openai.com</a> and create an account.',
      "Add a payment method under <strong>Settings \u2192 Billing</strong>.",
      'Navigate to <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener">API Keys</a> and click <strong>Create new secret key</strong>.',
      "Copy the key, paste it above, and click <strong>Save</strong>.",
    ],
    note: "OpenAI charges per token. GPT-4o Mini is very affordable for this use case.",
  },
  openrouter: {
    steps: [
      'Go to <a href="https://openrouter.ai" target="_blank" rel="noopener">openrouter.ai</a> and sign up.',
      "Some models (e.g. Llama 3 8B) are free to use \u2014 no payment needed.",
      'Navigate to <a href="https://openrouter.ai/keys" target="_blank" rel="noopener">Keys</a> and create a new API key.',
      "Paste the key above and click <strong>Save</strong>.",
    ],
    note: "OpenRouter aggregates many providers. Look for the \u26A1 icon on their site to find free models.",
  },
  together: {
    steps: [
      'Go to <a href="https://api.together.xyz" target="_blank" rel="noopener">api.together.xyz</a> and create an account.',
      "New accounts receive <strong>$5 in free credit</strong> \u2014 no card required.",
      'Navigate to <a href="https://api.together.xyz/settings/api-keys" target="_blank" rel="noopener">Settings \u2192 API Keys</a> and create a key.',
      "Paste the key above and click <strong>Save</strong>.",
    ],
  },
  mistral: {
    steps: [
      'Go to <a href="https://console.mistral.ai" target="_blank" rel="noopener">console.mistral.ai</a> and create an account.',
      'Navigate to <a href="https://console.mistral.ai/api-keys" target="_blank" rel="noopener">API Keys</a> and generate a key.',
      "Paste the key above and click <strong>Save</strong>.",
    ],
    note: "Mistral offers competitive per-token pricing, especially for their smaller models.",
  },
};

/** Create (once) and return the setup guide modal backdrop + shell. */
function ensureSetupGuideModal(): HTMLElement {
  if (setupGuideModal) return setupGuideModal;

  const backdrop = document.createElement("div");
  backdrop.className = "setup-guide-backdrop";
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) backdrop.classList.remove("visible");
  });

  const modal = document.createElement("div");
  modal.className = "setup-guide-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", "API key setup guide");

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && backdrop.classList.contains("visible")) {
      backdrop.classList.remove("visible");
    }
  });

  setupGuideModal = backdrop;
  return backdrop;
}

/**
 * Show the API-key setup guide modal for the currently selected provider.
 * Falls back to a generic message if no guide is available.
 */
function showSetupGuide(): void {
  const provider = getProviderById(els.providerSelect.value);
  const backdrop = ensureSetupGuideModal();
  const modal = backdrop.querySelector(".setup-guide-modal") as HTMLElement;

  const guide = SETUP_GUIDES[provider.id];
  const badge = costTierBadge(provider.costTier);

  let html = '<div class="setup-guide-header">';
  html += `<h3>Setup Guide: ${provider.label}</h3>`;
  html += '<button class="setup-guide-close" aria-label="Close">\u00D7</button>';
  html += "</div>";

  // Cost tier banner
  html += `<div class="setup-guide-tier tier-${provider.costTier}">`;
  html += `<span class="tier-badge">${badge}</span>`;
  html += `<span>${provider.costNote}</span>`;
  html += "</div>";

  if (guide) {
    html += '<ol class="setup-guide-steps">';
    for (const step of guide.steps) {
      html += `<li>${step}</li>`;
    }
    html += "</ol>";
    if (guide.note) {
      html += `<div class="setup-guide-note">\uD83D\uDCA1 ${guide.note}</div>`;
    }
  } else {
    html += "<p>Visit your provider\u2019s dashboard to create an API key, then paste it into the API Key field and click Save.</p>";
  }

  // Quick link
  if (provider.signupUrl) {
    html += `<a class="setup-guide-link" href="${provider.signupUrl}" target="_blank" rel="noopener">\u2192 Open ${provider.label} API Keys page</a>`;
  }

  // Provider comparison table (always shown)
  html += '<div class="setup-guide-comparison">';
  html += "<h4>Provider Comparison</h4>";
  html += '<table class="provider-comparison-table"><thead><tr>';
  html += "<th>Provider</th><th>Cost</th><th>Notes</th>";
  html += "</tr></thead><tbody>";
  for (const p of LLM_PROVIDERS) {
    if (p.id === "custom") continue;
    const isActive = p.id === provider.id;
    const rowBadge = costTierBadge(p.costTier);
    html += `<tr class="${isActive ? "active-row" : ""}">`;
    html += `<td>${p.label}${p.id === "groq" ? " \u2B50" : ""}</td>`;
    html += `<td><span class="tier-badge-sm tier-${p.costTier}">${rowBadge}</span></td>`;
    html += `<td>${p.costNote}</td>`;
    html += "</tr>";
  }
  html += "</tbody></table>";
  html += "</div>";

  modal.innerHTML = html;

  // Bind close button.
  const closeBtn = modal.querySelector(".setup-guide-close");
  closeBtn?.addEventListener("click", () => backdrop.classList.remove("visible"));

  backdrop.classList.add("visible");
}

/**
 * Persist all settings inputs to `localStorage`.
 */
function saveSettings(): void {
  const providerId = els.providerSelect.value;
  const model = els.modelInput.value.trim();
  const endpoint = els.customEndpointInput.value.trim();
  const key = els.apiKeyInput.value.trim();

  localStorage.setItem(LS_PROVIDER, providerId);

  if (model) {
    localStorage.setItem(LS_MODEL, model);
  } else {
    localStorage.removeItem(LS_MODEL);
  }

  if (endpoint) {
    localStorage.setItem(LS_ENDPOINT, endpoint);
  } else {
    localStorage.removeItem(LS_ENDPOINT);
  }

  if (key.length === 0) {
    localStorage.removeItem(LS_API_KEY);
    setKeyStatus("Settings saved — key cleared.", false);
  } else {
    localStorage.setItem(LS_API_KEY, key);
    const provider = getProviderById(providerId);
    setKeyStatus(`Settings saved ✓ (${provider.label})`, false);
  }

  // Invalidate the cached LLM instance so the next send picks up the
  // new endpoint / model / key configuration.
  llm = null;
}

/**
 * Display a short status hint below the API-key input.
 */
function setKeyStatus(msg: string, isError: boolean): void {
  els.keyStatus.textContent = msg;
  els.keyStatus.classList.toggle("error", isError);
}

function bindSettingsEvents(): void {
  els.saveKeyBtn.addEventListener("click", saveSettings);

  // Save on Enter inside any text input.
  els.apiKeyInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveSettings();
  });
  els.modelInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveSettings();
  });
  els.customEndpointInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveSettings();
  });

  // React to provider dropdown changes immediately.
  els.providerSelect.addEventListener("change", () => {
    const provider = getProviderById(els.providerSelect.value);
    applyProviderUI(provider);

    // Clear the model input so the full datalist is visible when the user
    // clicks into it.  The placeholder already shows the default model.
    els.modelInput.value = "";
  });

  // Setup guide button.
  els.setupGuideBtn.addEventListener("click", showSetupGuide);
}

/**
 * Bind the force-reload button.  Clears the IndexedDB cache, re-runs the
 * full data-ingest pipeline, and refreshes the market panel.
 */
function bindForceReload(): void {
  els.forceReloadBtn.addEventListener("click", async () => {
    els.forceReloadBtn.disabled = true;
    els.reloadStatus.textContent = "Clearing cache…";
    els.reloadStatus.classList.remove("error");

    try {
      await cache.clear();
      els.reloadStatus.textContent = "Fetching fresh data…";

      await initDataPipeline();

      // Re-open the cache (initDataPipeline uses its own instance).
      cache = new CacheService();
      await cache.open();
      analyzer = new MarketAnalyzerService(cache);

      await refreshMarketPanel();

      els.reloadStatus.textContent = "Data reloaded ✓";
    } catch (err) {
      console.error("[UIService] Force reload failed:", err);
      const msg = err instanceof Error ? err.message : "Reload failed — see console.";
      els.reloadStatus.textContent = msg;
      els.reloadStatus.classList.add("error");
      showError(msg);
    } finally {
      els.forceReloadBtn.disabled = false;
    }
  });
}

// ─── Full Market Background Scan ────────────────────────────────────────────

/** Abort controller for an in-progress background scan. */
let scanAbortController: AbortController | null = null;

/** Whether the deep-history warning toast has been shown this session. */
let deepHistoryWarned = false;

/**
 * Bind the "Scan Full Market" button and the deep-history checkbox.
 * When clicked, runs a non-blocking background scan of all ~7 000 GE items,
 * updating a progress bar in the UI.  The user can continue using the app
 * normally while the scan runs.
 *
 * The deep-history checkbox (persisted in localStorage) controls whether
 * 90-day history is fetched for every item (~3–5× slower).
 */
// Optional deep history during full scan – March 2026
function bindFullMarketScan(): void {
  // ── Restore persisted deep-history preference ──
  const savedDeep = localStorage.getItem(LS_DEEP_HISTORY) === "true";
  els.deepHistoryCheckbox.checked = savedDeep;

  // ── Persist + warn on checkbox toggle ──
  els.deepHistoryCheckbox.addEventListener("change", () => {
    const checked = els.deepHistoryCheckbox.checked;
    localStorage.setItem(LS_DEEP_HISTORY, String(checked));
    if (checked && !deepHistoryWarned) {
      deepHistoryWarned = true;
      showToast(
        "Deep history enabled \u2014 full scans may take 3\u201310 minutes depending on connection.",
        "info",
        8000,
      );
    }
  });

  els.fullMarketScanBtn.addEventListener("click", async () => {
    // If a scan is already running, abort it.
    if (scanAbortController) {
      scanAbortController.abort();
      scanAbortController = null;
      els.fullMarketScanBtn.textContent = "\uD83D\uDD0D Scan Full Market";
      els.syncProgress.classList.add("hidden");
      return;
    }

    if (geCatalogue.length === 0) {
      try {
        geCatalogue = await fetchGECatalogue();
      } catch {
        showError("Could not load item catalogue. Try again later.");
        return;
      }
    }

    if (geCatalogue.length === 0) {
      showError("Item catalogue is empty \u2014 cannot scan.");
      return;
    }

    const deepHistory = els.deepHistoryCheckbox.checked;
    const deepLabel = deepHistory ? " (deep history: ON)" : "";

    // Show progress bar and update button label.
    scanAbortController = new AbortController();
    els.fullMarketScanBtn.textContent = "\u23F9 Cancel Scan";
    els.syncProgress.classList.remove("hidden");
    els.syncProgressFill.style.width = "0%";
    els.syncProgressText.textContent =
      "Scanning 0 / " + geCatalogue.length.toLocaleString("en-US") + "\u2026" + deepLabel;

    try {
      await runFullMarketScan(
        geCatalogue,
        (done, total) => {
          const pct = Math.round((done / total) * 100);
          els.syncProgressFill.style.width = pct + "%";
          els.syncProgressText.textContent =
            `Scanning ${done.toLocaleString("en-US")} / ${total.toLocaleString("en-US")}\u2026 (${pct}%)${deepLabel}`;
        },
        scanAbortController.signal,
        deepHistory,
      );

      // Scan complete — refresh the market panel with the full dataset.
      cache = new CacheService();
      await cache.open();
      analyzer = new MarketAnalyzerService(cache);
      await refreshMarketPanel();

      els.syncProgressFill.style.width = "100%";
      els.syncProgressText.textContent = "Full market scan complete \u2714";
      setTimeout(() => els.syncProgress.classList.add("hidden"), 4000);
    } catch (err) {
      console.error("[UIService] Full market scan error:", err);
      els.syncProgressText.textContent = "Scan failed \u2014 see console.";
      setTimeout(() => els.syncProgress.classList.add("hidden"), 5000);
    } finally {
      scanAbortController = null;
      els.fullMarketScanBtn.textContent = "\uD83D\uDD0D Scan Full Market";
    }
  });
}

// ─── Layout / Tab Navigation ────────────────────────────────────────────────

/**
 * Restore persisted layout preference and bind the layout toggle buttons
 * in the settings panel. Switches between "tabbed" and "sidebar" layouts
 * by setting `document.body.dataset.layout`.
 */
function bindLayoutToggle(): void {
  const saved = (localStorage.getItem(LS_LAYOUT) as LayoutMode | null) ?? "tabbed";
  applyLayout(saved);

  els.layoutTabbedBtn.addEventListener("click", () => applyLayout("tabbed"));
  els.layoutSidebarBtn.addEventListener("click", () => applyLayout("sidebar"));
}

// ─── Theme (Mode × Style × Colorway × Contrast) ────────────────────────────

/**
 * Restore persisted theme preferences and bind all appearance controls.
 * Migrates from legacy keys if present.
 * Sets `document.body.dataset.mode`, `.style`, `.colorway`, `.contrast`
 * which activate the matching CSS override blocks.
 *
 * On init, all four axes are written in a single batch via `requestAnimationFrame`
 * to coalesce into one style recalc instead of four sequential reflows.
 */
function bindTheme(): void {
  migrateThemeKey();
  migrateColorwayToMode();
  migrateColorwayRename();

  const savedMode = (localStorage.getItem(LS_MODE) as AppMode | null) ?? "dark";
  const savedStyle = (localStorage.getItem(LS_STYLE) as StyleMode | null) ?? "basic";
  const savedColorway = (localStorage.getItem(LS_COLORWAY) as ColorwayMode | null) ?? "default";
  const savedContrast = (localStorage.getItem(LS_CONTRAST) as ContrastMode | null) ?? "default";

  // Batch all four dataset writes — only one style recalc on init
  applyThemeBatch(savedMode, savedStyle, savedColorway, savedContrast);

  // Mode toggle buttons
  els.modeDarkBtn.addEventListener("click", () => applyMode("dark"));
  els.modeLightBtn.addEventListener("click", () => applyMode("light"));

  els.styleSelect.addEventListener("change", () => {
    applyStyle(els.styleSelect.value as StyleMode);
  });
  els.colorwaySelect.addEventListener("change", () => {
    applyColorway(els.colorwaySelect.value as ColorwayMode);
  });
  els.contrastSelect.addEventListener("change", () => {
    applyContrast(els.contrastSelect.value as ContrastMode);
  });

  // ── Contrast auto-correction toggle ──────────────────────────────────
  els.contrastAutoToggle.checked = contrastAutoEnabled;
  els.contrastAutoToggle.addEventListener("change", () => {
    contrastAutoEnabled = els.contrastAutoToggle.checked;
    localStorage.setItem(LS_CONTRAST_AUTO, contrastAutoEnabled ? "true" : "false");
    ensureContrastCompliance();
  });
}

/**
 * Migrate from the legacy single `ge-analyzer:theme` key to the new
 * multi-axis keys. Runs once — removes the old key after migration.
 */
function migrateThemeKey(): void {
  const legacy = localStorage.getItem(LS_THEME);
  if (!legacy) return;

  const STYLE_MAP: Record<string, StyleMode> = {
    classic: "basic", osrs: "basic", "rs3-modern": "basic",
    glass: "glass", neumorphism: "neumorphism", minimalism: "basic", skeuomorphism: "skeuomorphism",
  };

  if (!localStorage.getItem(LS_STYLE)) {
    localStorage.setItem(LS_STYLE, STYLE_MAP[legacy] ?? "basic");
  }
  // Map legacy theme → mode + colorway (handled by migrateColorwayToMode next)
  if (!localStorage.getItem(LS_COLORWAY)) {
    const COLORWAY_TMP: Record<string, string> = {
      classic: "default", osrs: "classic", "rs3-modern": "rs3-modern",
      glass: "default", neumorphism: "default", minimalism: "light", skeuomorphism: "default",
    };
    localStorage.setItem(LS_COLORWAY, COLORWAY_TMP[legacy] ?? "default");
  }
  localStorage.removeItem(LS_THEME);
}

/**
 * Migrate old colorway values ("light", "sol-dark", "sol-light") to the
 * new mode + colorway system. E.g. "sol-light" → mode=light, colorway=solarized.
 * Runs once — only acts if no `LS_MODE` key is set yet.
 */
function migrateColorwayToMode(): void {
  if (localStorage.getItem(LS_MODE)) return; // already migrated
  const oldColorway = localStorage.getItem(LS_COLORWAY);
  if (!oldColorway) return;

  const mapping = LEGACY_COLORWAY_MAP[oldColorway];
  if (mapping) {
    localStorage.setItem(LS_MODE, mapping.mode);
    localStorage.setItem(LS_COLORWAY, mapping.colorway);
  } else {
    localStorage.setItem(LS_MODE, "dark");
  }
}

/**
 * One-time migration: renamed colorway values "classic" → "default", "osrs" → "classic".
 * Uses a flag key (`ge-analyzer:colorway-v2`) to run exactly once.
 */
function migrateColorwayRename(): void {
  if (localStorage.getItem("ge-analyzer:colorway-v2")) return;
  const RENAME_MAP: Record<string, ColorwayMode> = {
    classic: "default",
    osrs: "classic",
  };
  const current = localStorage.getItem(LS_COLORWAY);
  if (current && RENAME_MAP[current]) {
    localStorage.setItem(LS_COLORWAY, RENAME_MAP[current]);
  }
  localStorage.setItem("ge-analyzer:colorway-v2", "1");
}

/**
 * Force a full browser style recalculation.
 *
 * Some browsers (notably Chrome/Edge) cache `color-mix()` resolved values
 * across `data-*` attribute changes and fail to invalidate them when the
 * referenced custom properties change via a different cascade rule. This
 * manifests on page refresh with light mode — the `:root` (dark) defaults
 * are computed first (before the IIFE sets attributes), and Chrome keeps
 * stale dark `color-mix()` values even after light-mode selectors activate.
 *
 * Strategy: toggle `data-mode` to the **opposite** mode, force a
 * synchronous `getComputedStyle` read (which locks in that mode's cascade),
 * then restore the original mode and force another read. The browser sees
 * two genuine selector flips (e.g. light→dark→light), each activating
 * entirely different `body[data-mode]` rules. This bypasses the cache
 * because the resolved custom-property values are demonstrably different
 * at each step.
 *
 * This avoids the previous approach of removing ALL `data-*` attributes
 * (falling back to bare `:root`), which introduced a transient dark-default
 * intermediate state that *itself* poisoned Chrome's `color-mix()` cache
 * when the target mode was light.
 *
 * No visual flash occurs because all mutations + reads happen in one
 * synchronous JS turn; the browser only paints at the next animation
 * frame boundary, by which time the correct attributes are restored.
 */
function forceStyleInvalidation(): void {
  const ds = document.body.dataset;
  const currentMode = ds.mode ?? "dark";
  const oppositeMode = currentMode === "dark" ? "light" : "dark";

  // Flip to opposite mode — activates a different set of
  // body[data-mode] selectors, forcing fresh custom-property resolution.
  ds.mode = oppositeMode;
  void getComputedStyle(document.body).getPropertyValue("--bg-main");

  // Restore the correct mode — another genuine cascade change forces
  // Chrome to fully recompute the target mode's values from scratch.
  ds.mode = currentMode;
  void getComputedStyle(document.body).getPropertyValue("--bg-main");
}


// â”€â”€â”€ WCAG Contrast Auto-Correction â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/** Whether contrast auto-correction is currently enabled. */
let contrastAutoEnabled =
  localStorage.getItem(LS_CONTRAST_AUTO) !== "false";

/**
 * Parse a CSS color value (hex, rgb(), rgba(), or a resolved `color-mix()`)
 * into an `[r, g, b]` tuple. Falls back to `[0, 0, 0]` for unparseable values.
 *
 * `getComputedStyle` resolves `color-mix()` and named colors into
 * `rgb(â€¦)` or `rgba(â€¦)` in all modern browsers, so that is the primary
 * fast path here. Hex (3/4/6/8 digit) is handled as a secondary path.
 */
function parseCssColor(raw: string): [number, number, number] {
  const trimmed = raw.trim();

  // Fast path: rgb(r, g, b) / rgba(r, g, b, a)
  const rgbMatch = trimmed.match(
    /^rgba?\(\s*(\d+(?:\.\d+)?)[,\s]+(\d+(?:\.\d+)?)[,\s]+(\d+(?:\.\d+)?)/,
  );
  if (rgbMatch) {
    return [
      Math.round(Number(rgbMatch[1])),
      Math.round(Number(rgbMatch[2])),
      Math.round(Number(rgbMatch[3])),
    ];
  }

  // Secondary path: 3/4/6/8-digit hex
  const hexMatch = trimmed.match(/^#([0-9a-f]{3,8})$/i);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3 || hex.length === 4) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
    ];
  }

  return [0, 0, 0];
}

/**
 * Linearise an 8-bit sRGB channel value to its linear-light equivalent
 * per the IEC 61966-2-1 transfer function (used in WCAG relative luminance).
 */
function linearize(c8: number): number {
  const c = c8 / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * Calculate WCAG 2.x relative luminance.
 * Formula: L = 0.2126R + 0.7152G + 0.0722B with linearised sRGB values.
 */
function relativeLuminance([r, g, b]: [number, number, number]): number {
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

/**
 * Calculate the WCAG 2.x contrast ratio between two colours.
 * Returns a value between 1 (identical) and 21 (black on white).
 * Formula: (L1 + 0.05) / (L2 + 0.05) where L1 >= L2.
 */
function contrastRatio(
  a: [number, number, number],
  b: [number, number, number],
): number {
  const lA = relativeLuminance(a);
  const lB = relativeLuminance(b);
  const lighter = Math.max(lA, lB);
  const darker = Math.min(lA, lB);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Blend a colour toward a target by a normalised `amount` (0-1).
 * Returns a new `[r, g, b]` tuple.
 */
function blendToward(
  color: [number, number, number],
  target: [number, number, number],
  amount: number,
): [number, number, number] {
  const t = Math.max(0, Math.min(1, amount));
  return [
    Math.round(color[0] + (target[0] - color[0]) * t),
    Math.round(color[1] + (target[1] - color[1]) * t),
    Math.round(color[2] + (target[2] - color[2]) * t),
  ];
}

/**
 * Resolve the effective opaque background for the glass style.
 *
 * Glass uses translucent `--glass-panel` over the gradient body. Using
 * `--glass-body-via` (the middle gradient stop) composited with the panel
 * alpha gives a practical worst-case approximation.
 */
function resolveGlassBackground(): [number, number, number] {
  const cs = getComputedStyle(document.body);
  const bodyVia = parseCssColor(cs.getPropertyValue("--glass-body-via"));
  const panelRaw = cs.getPropertyValue("--glass-panel").trim();
  const alphaMatch = panelRaw.match(
    /rgba?\(\s*(\d+(?:\.\d+)?)[,\s]+(\d+(?:\.\d+)?)[,\s]+(\d+(?:\.\d+)?)[,\s/]+(\d*\.?\d+)/,
  );
  if (!alphaMatch) return bodyVia;
  const pr = Math.round(Number(alphaMatch[1]));
  const pg = Math.round(Number(alphaMatch[2]));
  const pb = Math.round(Number(alphaMatch[3]));
  const pa = Number(alphaMatch[4]);
  return [
    Math.round(pr * pa + bodyVia[0] * (1 - pa)),
    Math.round(pg * pa + bodyVia[1] * (1 - pa)),
    Math.round(pb * pa + bodyVia[2] * (1 - pa)),
  ];
}

/**
 * Ensure `--neu-shadow-dark` and `--neu-shadow-light` produce a visible
 * luminance delta against `--bg-main` so neumorphism shapes remain
 * perceptible. Minimum luminance delta: 0.03.
 */
function ensureNeuShadowVisibility(): void {
  const cs = getComputedStyle(document.body);
  const bgMain = parseCssColor(cs.getPropertyValue("--bg-main"));
  const neuDark = parseCssColor(cs.getPropertyValue("--neu-shadow-dark"));
  const neuLight = parseCssColor(cs.getPropertyValue("--neu-shadow-light"));

  const bgL = relativeLuminance(bgMain);
  const darkL = relativeLuminance(neuDark);
  const lightL = relativeLuminance(neuLight);
  const MIN_DELTA = 0.03;

  const bs = document.body.style;
  if (Math.abs(bgL - darkL) < MIN_DELTA) {
    const nudged = blendToward(neuDark, [0, 0, 0], 0.35);
    bs.setProperty("--neu-shadow-dark", `rgb(${nudged[0]},${nudged[1]},${nudged[2]})`);
  }
  if (Math.abs(lightL - bgL) < MIN_DELTA) {
    const nudged = blendToward(neuLight, [255, 255, 255], 0.25);
    bs.setProperty("--neu-shadow-light", `rgb(${nudged[0]},${nudged[1]},${nudged[2]})`);
  }
}

/**
 * Run the WCAG AA contrast compliance check and auto-correct if the
 * current `--text-main` / `--bg-main` combination falls below 4.5:1.
 *
 * For **glass**, the effective opaque background is computed by
 * alpha-compositing `--glass-panel` over `--glass-body-via`.
 *
 * For **neumorphism**, shadow visibility is also checked.
 *
 * Overrides are written to `document.body.style` so they take precedence
 * over CSS files while remaining removable on the next theme change.
 * Updates the live contrast ratio display in settings.
 */
function ensureContrastCompliance(): void {
  const bs = document.body.style;
  bs.removeProperty("--text-main");
  bs.removeProperty("--text-bright");
  bs.removeProperty("--neu-shadow-dark");
  bs.removeProperty("--neu-shadow-light");

  void getComputedStyle(document.body).getPropertyValue("--text-main");

  const cs = getComputedStyle(document.body);
  const style = (document.body.dataset.style ?? "basic") as StyleMode;
  const mode = (document.body.dataset.mode ?? "dark") as AppMode;

  let bgRgb: [number, number, number];
  if (style === "glass") {
    bgRgb = resolveGlassBackground();
  } else {
    bgRgb = parseCssColor(cs.getPropertyValue("--bg-main"));
  }

  const textMainRgb = parseCssColor(cs.getPropertyValue("--text-main"));
  const textBrightRgb = parseCssColor(cs.getPropertyValue("--text-bright"));

  const ratio = contrastRatio(textMainRgb, bgRgb);
  const ratioBright = contrastRatio(textBrightRgb, bgRgb);

  updateContrastDisplay(ratio);

  if (!contrastAutoEnabled) return;

  const target: [number, number, number] = mode === "dark" ? [255, 255, 255] : [0, 0, 0];

  if (ratio < WCAG_AA_RATIO) {
    let lo = 0;
    let hi = 1;
    let corrected = textMainRgb;
    for (let i = 0; i < 16; i++) {
      const mid = (lo + hi) / 2;
      const candidate = blendToward(textMainRgb, target, mid);
      if (contrastRatio(candidate, bgRgb) >= WCAG_AA_RATIO) {
        corrected = candidate;
        hi = mid;
      } else {
        lo = mid;
      }
    }
    bs.setProperty("--text-main", `rgb(${corrected[0]},${corrected[1]},${corrected[2]})`);
    updateContrastDisplay(contrastRatio(corrected, bgRgb));
  }

  if (ratioBright < WCAG_AA_RATIO) {
    let lo = 0;
    let hi = 1;
    let corrected = textBrightRgb;
    for (let i = 0; i < 16; i++) {
      const mid = (lo + hi) / 2;
      const candidate = blendToward(textBrightRgb, target, mid);
      if (contrastRatio(candidate, bgRgb) >= WCAG_AA_RATIO) {
        corrected = candidate;
        hi = mid;
      } else {
        lo = mid;
      }
    }
    bs.setProperty("--text-bright", `rgb(${corrected[0]},${corrected[1]},${corrected[2]})`);
  }

  if (style === "neumorphism") {
    ensureNeuShadowVisibility();
  }
}

/**
 * Update the live contrast ratio badge in the Appearance settings group.
 */
function updateContrastDisplay(ratio: number): void {
  const badge = document.getElementById("contrast-ratio-display");
  if (!badge) return;
  const rounded = ratio.toFixed(2);
  const passes = ratio >= WCAG_AA_RATIO;
  badge.textContent = `Contrast: ${rounded}:1 ${passes ? "\u2705 AA" : "\u26A0\uFE0F Fail"}`;
  badge.style.color = passes ? "var(--accent-green)" : "var(--accent-red)";
}
/** Apply an appearance mode (dark/light) and persist the choice. */
function applyMode(mode: AppMode): void {
  document.body.dataset.mode = mode;
  localStorage.setItem(LS_MODE, mode);
  els.modeDarkBtn.classList.toggle("active", mode === "dark");
  els.modeLightBtn.classList.toggle("active", mode === "light");
  forceStyleInvalidation();
  ensureContrastCompliance();
}

/** Apply a style to the document and persist the choice. */
function applyStyle(style: StyleMode): void {
  document.body.dataset.style = style;
  localStorage.setItem(LS_STYLE, style);
  els.styleSelect.value = style;
  ensureContrastCompliance();
}

/** Apply a colorway to the document and persist the choice. */
function applyColorway(colorway: ColorwayMode): void {
  document.body.dataset.colorway = colorway;
  localStorage.setItem(LS_COLORWAY, colorway);
  els.colorwaySelect.value = colorway;
  forceStyleInvalidation();
  ensureContrastCompliance();
}

/** Apply a contrast level to the document and persist the choice. */
function applyContrast(contrast: ContrastMode): void {
  document.body.dataset.contrast = contrast;
  localStorage.setItem(LS_CONTRAST, contrast);
  els.contrastSelect.value = contrast;
  forceStyleInvalidation();
  ensureContrastCompliance();
}

/**
 * Apply all four theme axes in a single synchronous pass to minimise
 * style recalculations during initialisation and data-import restores.
 * Writes all four `dataset` properties before the browser can trigger
 * an intermediate layout, producing one composite style recalc.
 *
 * Always calls `forceStyleInvalidation()` after writing the attributes.
 * On page refresh with a non-default mode (e.g. light), the CSS is
 * injected before the early-restoration IIFE runs, so Chrome computes
 * `:root` (dark) `color-mix()` values first. Even though the IIFE then
 * sets the correct attributes, Chrome's stale cached values persist.
 * The mode-toggle invalidation strategy (see `forceStyleInvalidation`)
 * forces fresh recomputation without the bare-`:root` intermediate that
 * previously broke light mode.
 */
function applyThemeBatch(
  mode: AppMode,
  style: StyleMode,
  colorway: ColorwayMode,
  contrast: ContrastMode,
): void {
  const ds = document.body.dataset;

  ds.mode = mode;
  ds.style = style;
  ds.colorway = colorway;
  ds.contrast = contrast;

  localStorage.setItem(LS_MODE, mode);
  localStorage.setItem(LS_STYLE, style);
  localStorage.setItem(LS_COLORWAY, colorway);
  localStorage.setItem(LS_CONTRAST, contrast);

  // Sync UI controls
  els.modeDarkBtn.classList.toggle("active", mode === "dark");
  els.modeLightBtn.classList.toggle("active", mode === "light");
  els.styleSelect.value = style;
  els.colorwaySelect.value = colorway;
  els.contrastSelect.value = contrast;

  // Always flush — the mode-toggle strategy is safe even when values
  // haven't changed, unlike the old strip-all-attributes approach.
  forceStyleInvalidation();
  ensureContrastCompliance();

  // Redraw any active canvas charts so they pick up the new theme colours.
  for (const chart of activeCharts.values()) chart.redraw();
}

/** Apply a layout mode to the document and persist the choice. */
function applyLayout(mode: LayoutMode): void {
  document.body.dataset.layout = mode;
  localStorage.setItem(LS_LAYOUT, mode);

  els.layoutTabbedBtn.classList.toggle("active", mode === "tabbed");
  els.layoutSidebarBtn.classList.toggle("active", mode === "sidebar");

  // Sync ARIA pressed states (WCAG 4.1.2).
  els.layoutTabbedBtn.setAttribute("aria-pressed", String(mode === "tabbed"));
  els.layoutSidebarBtn.setAttribute("aria-pressed", String(mode === "sidebar"));

  // In sidebar mode both sections are always visible — remove tab active state.
  if (mode === "sidebar") {
    els.marketView.classList.add("active-tab");
    els.advisorView.classList.add("active-tab");
    els.portfolioView.classList.add("active-tab");
  } else {
    // Restore tabbed state — keep whichever tab was last active,
    // defaulting to market.
    const advisorActive = els.tabAdvisorBtn.classList.contains("active");
    const portfolioActive = els.tabPortfolioBtn.classList.contains("active");
    els.marketView.classList.toggle("active-tab", !advisorActive && !portfolioActive);
    els.advisorView.classList.toggle("active-tab", advisorActive);
    els.portfolioView.classList.toggle("active-tab", portfolioActive);
  }
}

/**
 * Bind the tab-bar buttons so users can switch between Market and Advisor
 * views while in tabbed layout.
 */
function bindTabNavigation(): void {
  els.tabMarketBtn.addEventListener("click", () => switchTab("market"));
  els.tabAdvisorBtn.addEventListener("click", () => switchTab("advisor"));
  els.tabPortfolioBtn.addEventListener("click", () => switchTab("portfolio"));
}

/** Activate the requested tab, updating button + section classes. */
function switchTab(tab: "market" | "advisor" | "portfolio"): void {
  els.tabMarketBtn.classList.toggle("active", tab === "market");
  els.tabAdvisorBtn.classList.toggle("active", tab === "advisor");
  els.tabPortfolioBtn.classList.toggle("active", tab === "portfolio");

  // Sync ARIA selected states (WCAG 4.1.2 – Name, Role, Value).
  els.tabMarketBtn.setAttribute("aria-selected", String(tab === "market"));
  els.tabAdvisorBtn.setAttribute("aria-selected", String(tab === "advisor"));
  els.tabPortfolioBtn.setAttribute("aria-selected", String(tab === "portfolio"));

  els.marketView.classList.toggle("active-tab", tab === "market");
  els.advisorView.classList.toggle("active-tab", tab === "advisor");
  els.portfolioView.classList.toggle("active-tab", tab === "portfolio");
}

// ─── Debounce Utility ───────────────────────────────────────────────────────

/**
 * Classic trailing-edge debounce.  Returns a wrapper that delays invoking
 * `fn` until `ms` milliseconds after the last call.
 */
function debounce<T extends (...args: any[]) => void>(fn: T, ms: number): T {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return ((...args: any[]) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  }) as unknown as T;
}

// ─── Error Banner ───────────────────────────────────────────────────────────

/**
 * Show the global error banner with the given message.
 * Also hides the market-loading spinner so it doesn't compete visually.
 */
function showError(message: string): void {
  els.errorBannerMsg.textContent = message;
  els.errorBanner.classList.remove("hidden");
  els.marketLoading.style.display = "none";
}

/** Hide the global error banner and clear its message. */
function hideError(): void {
  els.errorBanner.classList.add("hidden");
  els.errorBannerMsg.textContent = "";
}

// ─── Toast Notifications ────────────────────────────────────────────────────

/** Lazily-created toast container (fixed to top-right of viewport). */
let toastContainer: HTMLElement | null = null;

/** Ensure the toast container exists in the DOM. */
function ensureToastContainer(): HTMLElement {
  if (toastContainer) return toastContainer;
  toastContainer = document.createElement("div");
  toastContainer.id = "toast-container";
  toastContainer.setAttribute("aria-live", "polite");
  toastContainer.setAttribute("aria-relevant", "additions");
  toastContainer.setAttribute("role", "status");
  document.body.appendChild(toastContainer);
  return toastContainer;
}

/**
 * Show a toast notification. Automatically removes itself after `durationMs`.
 * @param message - The text to display.
 * @param type - Visual variant (`"info"`, `"buy"`, or `"sell"`).
 * @param durationMs - How long the toast stays visible (default 6 000 ms).
 */
function showToast(message: string, type: "info" | "buy" | "sell" = "info", durationMs = 6000): void {
  const container = ensureToastContainer();
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  // Trigger the entrance animation on the next frame.
  requestAnimationFrame(() => toast.classList.add("show"));

  setTimeout(() => {
    toast.classList.remove("show");
    toast.addEventListener("transitionend", () => toast.remove());
    // Safety fallback in case transitionend doesn't fire.
    setTimeout(() => toast.remove(), 500);
  }, durationMs);
}

// ─── Price Alert Engine ─────────────────────────────────────────────────────

/** Set of "name|direction" keys that have already fired in this session to avoid spam. */
const firedAlerts = new Set<string>();

/**
 * Request browser notification permission once (no-ops after the first call).
 * Safe to call on every refresh — the browser only shows the prompt once.
 */
function requestNotificationPermission(): void {
  if (typeof Notification !== "undefined" && Notification.permission === "default") {
    Notification.requestPermission().catch(() => { /* swallow if blocked */ });
  }
}

/**
 * Check every favourited item's price against its alert thresholds.
 * Fires a native browser `Notification` (if granted) **and** a DOM toast for
 * each threshold breach.  Each alert fires at most once per session per
 * direction (`buy` / `sell`) to prevent spam.
 *
 * @param items - The latest scored items to check (typically all cached items).
 */
function checkPriceAlerts(items: RankedItem[]): void {
  const favs = loadFavorites();
  if (favs.length === 0) return;

  // Build a quick lookup by name.
  const priceMap = new Map<string, number>();
  for (const it of items) priceMap.set(it.name, it.price);

  for (const fav of favs) {
    const currentPrice = priceMap.get(fav.name);
    if (currentPrice == null) continue;

    // ── Buy alert: price dropped to or below target ────────────────────
    if (fav.targetBuy && currentPrice <= fav.targetBuy) {
      const key = `${fav.name}|buy`;
      if (!firedAlerts.has(key)) {
        firedAlerts.add(key);
        const msg = `\uD83D\uDCC9 ${fav.name} has dropped to ${formatGpShort(currentPrice)} gp (target: \u2264${formatGpShort(fav.targetBuy)} gp)`;
        showToast(msg, "buy");
        if (typeof Notification !== "undefined" && Notification.permission === "granted") {
          new Notification("GE Price Alert — Buy", { body: msg, icon: spriteUrl(0) });
        }
      }
    }

    // ── Sell alert: price rose to or above target ──────────────────────
    if (fav.targetSell && currentPrice >= fav.targetSell) {
      const key = `${fav.name}|sell`;
      if (!firedAlerts.has(key)) {
        firedAlerts.add(key);
        const msg = `\uD83D\uDCC8 ${fav.name} has risen to ${formatGpShort(currentPrice)} gp (target: \u2265${formatGpShort(fav.targetSell)} gp)`;
        showToast(msg, "sell");
        if (typeof Notification !== "undefined" && Notification.permission === "granted") {
          new Notification("GE Price Alert — Sell", { body: msg, icon: spriteUrl(0) });
        }
      }
    }
  }
}

/**
 * Wire the error-banner retry button.  Clears the cache, re-runs the full
 * data pipeline, and refreshes the market panel.
 */
function bindErrorRetry(): void {
  els.errorRetryBtn.addEventListener("click", async () => {
    hideError();
    els.marketLoading.style.display = "";
    els.marketLoading.textContent = "Retrying…";

    try {
      await cache.clear();
      await initDataPipeline();

      cache = new CacheService();
      await cache.open();
      analyzer = new MarketAnalyzerService(cache);

      await refreshMarketPanel();
    } catch (err) {
      console.error("[UIService] Retry failed:", err);
      const msg = err instanceof Error ? err.message : "Retry failed — see console.";
      showError(msg);
    }
  });
}

// ─── Back-to-Top Button ─────────────────────────────────────────────────────

/**
 * Show a floating back-to-top button when `#market-view` is scrolled past a
 * threshold.  Clicking it smooth-scrolls back to the top.
 */
function bindBackToTop(): void {
  const THRESHOLD = 300; // px of scroll before the button appears

  els.marketView.addEventListener("scroll", () => {
    els.backToTopBtn.classList.toggle("visible", els.marketView.scrollTop > THRESHOLD);
  }, { passive: true });

  els.backToTopBtn.addEventListener("click", () => {
    els.marketView.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ─── Disclaimer Overlay ─────────────────────────────────────────────────────

/**
 * Wire the disclaimer overlay's Acknowledge button and persist checkbox.
 * The overlay is shown/hidden by the inline <script> in index.html
 * (pre-bundle) based on the localStorage flag.
 */
function bindDisclaimer(): void {
  const overlay = document.getElementById("disclaimer-overlay");
  const ackBtn = document.getElementById("disclaimer-ack-btn");
  const persistCheck = document.getElementById("disclaimer-persist-check") as HTMLInputElement | null;
  if (!overlay || !ackBtn) return;

  ackBtn.addEventListener("click", () => {
    if (persistCheck?.checked) {
      localStorage.setItem(LS_DISCLAIMER_ACK, "1");
    }
    overlay.classList.add("hidden");
  });
}

// ─── Data Management (Export / Import) ──────────────────────────────────────

/** localStorage keys included in the JSON backup. */
const EXPORT_KEYS = [
  "ge-analyzer:favorites",
  "ge-analyzer:portfolio",
  "ge-analyzer:portfolio-history",
  "ge-analyzer:mode",
  "ge-analyzer:style",
  "ge-analyzer:colorway",
  "ge-analyzer:contrast",
  "ge-analyzer:contrast-auto-correct",
  "ge-analyzer:chart-layers",
  "ge-analyzer:disclaimer-ack",
] as const;

/**
 * Wire click handlers for the Export Data / Import Data buttons and the
 * hidden file `<input>`.
 */
function bindDataManagement(): void {
  // ── Export ──────────────────────────────────────────────────────────────
  els.exportDataBtn.addEventListener("click", () => {
    const payload: Record<string, unknown> = {};
    for (const key of EXPORT_KEYS) {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        try { payload[key] = JSON.parse(raw); } catch { payload[key] = raw; }
      }
    }

    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "ge-analyzer-backup.json";
    document.body.appendChild(a);
    a.click();

    // Clean up.
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // ── Import ─────────────────────────────────────────────────────────────
  els.importDataBtn.addEventListener("click", () => {
    // Reset so the same file can be re-imported if needed.
    els.importFileInput.value = "";
    els.importFileInput.click();
  });

  els.importFileInput.addEventListener("change", () => {
    const file = els.importFileInput.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (typeof data !== "object" || data === null) {
          throw new Error("Invalid backup format.");
        }

        let restoredCount = 0;
        for (const key of EXPORT_KEYS) {
          if (key in data) {
            localStorage.setItem(key, JSON.stringify(data[key]));
            restoredCount++;
          }
        }

        if (restoredCount === 0) {
          alert("No recognised data keys found in the file.");
          return;
        }

        // Clear the one-time migration flag so that imported legacy
        // colorway values ("classic" / "osrs") get re-migrated on reload.
        if ("ge-analyzer:colorway" in data) {
          localStorage.removeItem("ge-analyzer:colorway-v2");
        }

        alert("Data imported successfully!");
        window.location.reload();
      } catch (err) {
        console.error("[UIService] Import failed:", err);
        alert("Import failed — the file does not contain valid JSON.");
      }
    };
    reader.readAsText(file);
  });
}

// ─── Market Panel ───────────────────────────────────────────────────────────

/** Whether the market panel is currently showing search results. */
let isSearchActive = false;

/** Whether Browse All results are currently displayed. */
let isBrowseAllActive = false;

const TOP20_SORT_KEY = "ge-analyzer:top20-sort";
const SEARCH_SORT_KEY = "ge-analyzer:search-sort";

/**
 * Sort an array of {@link RankedItem} in place based on the given sort key.
 * Returns the same array reference for convenience.
 */
function applySortOrder(items: RankedItem[], sortKey: string): RankedItem[] {
  if (sortKey === "alpha") {
    items.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortKey === "price-desc") {
    items.sort((a, b) => b.price - a.price);
  } else if (sortKey === "profit-desc") {
    items.sort((a, b) => b.estFlipProfit - a.estFlipProfit);
  }
  return items;
}

/**
 * Run the market analyzer and render the top-N list into the DOM.
 */
async function refreshMarketPanel(): Promise<void> {
  hideError();
  els.marketLoading.style.display = "";
  els.marketLoading.textContent = "Loading market data…";
  els.marketLoading.classList.remove("error");
  els.marketItems.innerHTML = "";

  try {
    const filters = readFilterConfig();
    latestTopItems = await analyzer.getTopItems(filters);
    latestMarketSummary = analyzer.formatForLLM(latestTopItems);
    applySortOrder(latestTopItems, els.top20SortSelect.value);
    renderMarketItems(latestTopItems);

    // Refresh cached Nature rune price for alch-profit filter.
    cache.getByName("Nature rune").then((rec) => {
      if (rec?.price) cachedNatureRunePrice = rec.price;
    }).catch(() => {});

    // Build broader LLM context asynchronously (top 200, no filters).
    // Non-blocking — chat uses whatever is ready; falls back to the
    // narrow summary until this completes.
    analyzer.getFormattedForLLM().then(ctx => { latestLLMContext = ctx; }).catch(() => {});

    // Check price alerts against ALL cached items (not just filtered top 20).
    try {
      const allItems = await analyzer.getTopItems({ topN: 99999, minVolume: 0 });
      checkPriceAlerts(allItems);
    } catch { /* non-critical — skip alerts on failure */ }
  } catch (err) {
    console.error("[UIService] Failed to refresh market panel:", err);
    const msg = err instanceof Error ? err.message : "Failed to load market data.";
    showError(msg);
    return;
  }

  els.marketLoading.style.display = "none";
}

// ─── Market Filters ─────────────────────────────────────────────────────────

/**
 * Read the current filter dropdown values and translate them into a
 * {@link MarketAnalyzerConfig} override object.
 */
function readFilterConfig(): Partial<MarketAnalyzerConfig> {
  const config: Partial<MarketAnalyzerConfig> = {};

  const volPreset = els.filterVolume.value;
  if (volPreset === "high") {
    config.minVolume = 50_000;
  } else if (volPreset === "low") {
    config.maxVolume = 5_000;
  } else if (volPreset === "custom") {
    const minVol = Number(els.volumeMinInput.value) || 0;
    const maxVol = Number(els.volumeMaxInput.value) || 0;
    if (minVol > 0) config.minVolume = minVol;
    if (maxVol > 0) config.maxVolume = maxVol;
  }

  const pricePreset = els.filterPrice.value;
  if (pricePreset === "custom") {
    const maxPrice = Number(els.budgetInput.value) || 0;
    if (maxPrice > 0) config.maxPrice = maxPrice;
  } else {
    const maxPrice = Number(pricePreset);
    if (maxPrice > 0) config.maxPrice = maxPrice;
  }

  return config;
}

/**
 * Bind the market filter dropdowns and the refresh button.
 */
function bindMarketFilters(): void {
  // ── Dropdown → custom-group visibility ─────────────────────────────────
  els.filterVolume.addEventListener("change", () => {
    els.volumeCustomGroup.style.display =
      els.filterVolume.value === "custom" ? "" : "none";
  });

  els.filterPrice.addEventListener("change", () => {
    els.budgetCustomGroup.style.display =
      els.filterPrice.value === "custom" ? "" : "none";
  });

  // ── Sync slider ↔ text input for volume min ───────────────────────────
  syncSliderAndInput(els.volumeMinSlider, els.volumeMinInput);

  // ── Sync slider ↔ text input for volume max ───────────────────────────
  syncSliderAndInput(els.volumeMaxSlider, els.volumeMaxInput);

  // ── Sync slider ↔ text input for budget ───────────────────────────────
  syncSliderAndInput(els.budgetSlider, els.budgetInput);

  // ── Top 20 sort dropdown ───────────────────────────────────────────────
  const savedTop20Sort = localStorage.getItem(TOP20_SORT_KEY);
  if (savedTop20Sort) els.top20SortSelect.value = savedTop20Sort;

  els.top20SortSelect.addEventListener("change", () => {
    localStorage.setItem(TOP20_SORT_KEY, els.top20SortSelect.value);
    applySortOrder(latestTopItems, els.top20SortSelect.value);
    renderMarketItems(latestTopItems);
  });

  // ── Search sort dropdown ──────────────────────────────────────────────
  const savedSearchSort = localStorage.getItem(SEARCH_SORT_KEY);
  if (savedSearchSort) els.searchSortSelect.value = savedSearchSort;

  els.searchSortSelect.addEventListener("change", () => {
    localStorage.setItem(SEARCH_SORT_KEY, els.searchSortSelect.value);
    if (latestSearchResults.length > 0) {
      applySortOrder(latestSearchResults, els.searchSortSelect.value);
      renderSearchResults(latestSearchResults);
    }
  });

  // ── Refresh button ────────────────────────────────────────────────────
  els.refreshMarketBtn.addEventListener("click", async () => {
    els.marketSearchInput.value = "";
    isSearchActive = false;
    resetBrowseAllButton();
    latestSearchResults = [];
    unfilteredSearchResults = [];
    els.searchResults.innerHTML = "";
    els.searchLoading.style.display = "none";
    await refreshMarketPanel();
  });

  // ── Market search input (debounced) ───────────────────────────────────
  els.marketSearchInput.addEventListener(
    "input",
    debounce(async () => {
      const query = els.marketSearchInput.value.trim();
      if (query.length > 2) {
        isSearchActive = true;
        resetBrowseAllButton();
        els.searchLoading.textContent = "Searching…";
        els.searchLoading.style.display = "";
        els.searchResults.innerHTML = "";
        try {
          // 1. Filter the full catalogue by name.
          const needle = query.toLowerCase();
          const catalogueHits = geCatalogue
            .filter((e) => e.name.toLowerCase().includes(needle))
            .slice(0, 50);

          if (catalogueHits.length === 0) {
            els.searchLoading.textContent = `No items match "${query}".`;
            return;
          }

          // 2. Determine which matches are NOT yet in the IndexedDB cache.
          const cachedRecords = await cache.getAll();
          const cachedNames = new Set(cachedRecords.map((r) => r.name));
          const uncachedHits = catalogueHits.filter((e) => !cachedNames.has(e.name));

          // 3. Fetch prices for uncached items on-demand from the Weird Gloop API.
          if (uncachedHits.length > 0) {
            els.searchLoading.textContent = `Fetching ${uncachedHits.length} item(s)…`;
            const api = new WeirdGloopService();
            const prices = await api.fetchLatestPrices(uncachedHits.map((e) => e.name));

            if (prices.size > 0) {
              // 3b. Enrich with buy limits from the wiki (same as init pipeline).
              els.searchLoading.textContent = `Enriching ${prices.size} item(s) with buy limits…`;
              const itemNames = Array.from(prices.keys());
              const buyLimits = await wiki.getBulkBuyLimits(itemNames);
              for (const [name, record] of prices) {
                const limit = buyLimits.get(name);
                if (limit !== undefined) {
                  record.buyLimit = limit;
                }
              }

              // 3c. Persist enriched records into IndexedDB.
              await cache.bulkInsert(prices);
            }
          }

          // 4. Now all matched items should be in cache — score them.
          const results = await analyzer.searchItems(query);
          unfilteredSearchResults = results;
          latestSearchResults = applySearchCategoryFilters(results);
          applySortOrder(latestSearchResults, els.searchSortSelect.value);
          renderSearchResults(latestSearchResults);

          if (results.length === 0) {
            els.searchLoading.textContent = `No price data for "${query}".`;
            els.searchLoading.style.display = "";
            return;
          }
        } catch (err) {
          console.error("[UIService] Search failed:", err);
        }
        els.searchLoading.style.display = "none";
      } else if (query.length === 0) {
        // If filters are active, switch to browse-all mode instead of clearing.
        if (activeSearchFilters.size > 0) {
          loadBrowseAll();
        } else {
          isSearchActive = false;
          resetBrowseAllButton();
          latestSearchResults = [];
          unfilteredSearchResults = [];
          els.searchResults.innerHTML = "";
          els.searchLoading.style.display = "none";
        }
      }
    }, 300)
  );
}

// ─── Search category filter popover ─────────────────────────────────────────

/**
 * Apply the active search category filters to a result set.
 * When multiple filters within the SAME group are active, items matching ANY
 * of them pass (OR). Across groups the logic is AND.
 */
function applySearchCategoryFilters(items: RankedItem[]): RankedItem[] {
  if (activeSearchFilters.size === 0) return items;

  // Group active filter IDs by their parent group.
  const activeByGroup: Map<string, SearchFilterDef[]> = new Map();
  for (const group of SEARCH_FILTER_GROUPS) {
    const active = group.filters.filter((f) => activeSearchFilters.has(f.id));
    if (active.length > 0) activeByGroup.set(group.title, active);
  }
  if (activeByGroup.size === 0) return items;

  return items.filter((item) => {
    for (const [, filters] of activeByGroup) {
      // Within a group: OR (match any).
      const anyMatch = filters.some((f) => f.match(item.name, item));
      if (!anyMatch) return false; // Across groups: AND.
    }
    return true;
  });
}

/** Update the filter button badge to reflect active count. */
function updateFilterBadge(): void {
  const count = activeSearchFilters.size;
  const existing = els.searchFilterBtn.querySelector(".filter-count-badge");
  if (existing) existing.remove();

  if (count > 0) {
    els.searchFilterBtn.classList.add("has-active-filters");
    const badge = document.createElement("span");
    badge.className = "filter-count-badge";
    badge.textContent = String(count);
    els.searchFilterBtn.appendChild(badge);
  } else {
    els.searchFilterBtn.classList.remove("has-active-filters");
  }
}

/** Re-apply filters to current unfiltered results and re-render. */
function refilterSearchResults(): void {
  const query = els.marketSearchInput.value.trim();
  // When no search query is active and filters changed, reload from the full
  // cache so the category filter has access to ALL items, not just the
  // previous top-500 browse set.
  if (query.length === 0 && activeSearchFilters.size > 0) {
    loadBrowseAll();
    return;
  }
  // If filters were all cleared and there's no search query, clear results.
  if (query.length === 0 && activeSearchFilters.size === 0) {
    isSearchActive = false;
    latestSearchResults = [];
    unfilteredSearchResults = [];
    els.searchResults.innerHTML = "";
    els.searchLoading.style.display = "none";
    updateFilterBadge();
    return;
  }
  latestSearchResults = applySearchCategoryFilters(unfilteredSearchResults);
  applySortOrder(latestSearchResults, els.searchSortSelect.value);
  if (latestSearchResults.length > 0 || unfilteredSearchResults.length > 0) {
    renderSearchResults(latestSearchResults);
  }
  updateFilterBadge();
}

/**
 * Load all cached items into the search results for filter-only browsing.
 * Called when the user activates filters without a search query, or clicks
 * "Browse All".
 */
async function loadBrowseAll(): Promise<void> {
  isSearchActive = true;
  isBrowseAllActive = true;
  els.browseAllBtn.textContent = "\u2716 Hide All";
  els.browseAllBtn.title = "Hide browse-all results";
  els.searchLoading.textContent = "Loading all items…";
  els.searchLoading.style.display = "";
  els.searchResults.innerHTML = "";
  try {
    // When category filters are active, fetch ALL scored items so the filter
    // has the full cache pool to match against (not just the top 500).
    const limit = activeSearchFilters.size > 0 ? 0 : 500;
    const all = await analyzer.getAllScored(limit);
    unfilteredSearchResults = all;
    latestSearchResults = applySearchCategoryFilters(all);
    applySortOrder(latestSearchResults, els.searchSortSelect.value);
    renderSearchResults(latestSearchResults);
    els.searchLoading.style.display = "none";
  } catch (err) {
    console.error("[UIService] Browse all failed:", err);
    els.searchLoading.textContent = "Failed to load items.";
  }
  updateFilterBadge();
}

/**
 * Hide browse-all results and reset the button state.
 */
function hideBrowseAll(): void {
  isBrowseAllActive = false;
  isSearchActive = false;
  resetBrowseAllButton();
  els.searchResults.innerHTML = "";
  els.searchLoading.style.display = "none";
  latestSearchResults = [];
  unfilteredSearchResults = [];
  updateFilterBadge();
}

/**
 * Restore the Browse All button to its default label and title.
 */
function resetBrowseAllButton(): void {
  isBrowseAllActive = false;
  els.browseAllBtn.textContent = "\uD83D\uDCCB Browse All";
  els.browseAllBtn.title = "Browse all cached items (apply filters to narrow down)";
}

/**
 * Build the search filter popover DOM and bind toggle/clear/apply events.
 */
function bindSearchFilters(): void {
  const popover = els.searchFilterPopover;

  // Build popover content.
  for (const group of SEARCH_FILTER_GROUPS) {
    const section = document.createElement("div");
    section.className = "search-filter-group";

    const title = document.createElement("span");
    title.className = "search-filter-group-title";
    title.textContent = group.title;
    section.appendChild(title);

    const tags = document.createElement("div");
    tags.className = "search-filter-tags";

    for (const filter of group.filters) {
      const tag = document.createElement("label");
      tag.className = "search-filter-tag";
      tag.dataset.filterId = filter.id;

      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.name = `search-filter-${filter.id}`;

      const text = document.createTextNode(filter.label);
      tag.appendChild(cb);
      tag.appendChild(text);

      cb.addEventListener("change", () => {
        if (cb.checked) {
          activeSearchFilters.add(filter.id);
          tag.classList.add("checked");
        } else {
          activeSearchFilters.delete(filter.id);
          tag.classList.remove("checked");
        }
        refilterSearchResults();
      });

      tags.appendChild(tag);
    }

    section.appendChild(tags);
    popover.appendChild(section);
  }

  // Footer actions.
  const actions = document.createElement("div");
  actions.className = "search-filter-actions";

  const clearBtn = document.createElement("button");
  clearBtn.type = "button";
  clearBtn.className = "search-filter-clear-btn";
  clearBtn.textContent = "Clear All";
  clearBtn.addEventListener("click", () => {
    activeSearchFilters.clear();
    popover.querySelectorAll<HTMLElement>(".search-filter-tag.checked").forEach((t) => {
      t.classList.remove("checked");
      const cb = t.querySelector("input");
      if (cb) (cb as HTMLInputElement).checked = false;
    });
    refilterSearchResults();
  });

  actions.appendChild(clearBtn);
  popover.appendChild(actions);

  // Toggle popover on button click.
  els.searchFilterBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    popover.classList.toggle("open");
  });

  // Close popover when clicking outside.
  document.addEventListener("click", (e) => {
    if (!popover.contains(e.target as Node) && e.target !== els.searchFilterBtn) {
      popover.classList.remove("open");
    }
  });

  // Close on Escape.
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") popover.classList.remove("open");
  });

  // Browse All button — loads all cached items into search results,
  // or hides them if results are already showing.
  els.browseAllBtn.addEventListener("click", () => {
    if (isBrowseAllActive) {
      hideBrowseAll();
    } else {
      els.marketSearchInput.value = "";
      loadBrowseAll();
    }
  });
}

/**
 * Wire bi-directional sync between a range slider and its companion number
 * input.  Typing a value larger than the slider's `max` auto-extends the
 * `max` attribute so the slider stays useful.
 */
function syncSliderAndInput(
  slider: HTMLInputElement,
  input: HTMLInputElement,
): void {
  slider.addEventListener("input", () => {
    input.value = slider.value;
  });

  input.addEventListener("input", () => {
    const v = Number(input.value) || 0;
    // Extend slider range if the typed value exceeds current max.
    if (v > Number(slider.max)) {
      slider.max = String(v);
    }
    slider.value = String(v);
  });
}

// ─── View Toggle ────────────────────────────────────────────────────────────

/**
 * Bind view-mode toggle button click events and restore the saved preference.
 */
function bindViewToggle(): void {
  const saved = (localStorage.getItem(LS_VIEW_MODE) as ViewMode | null) ?? "list";
  setViewMode(saved);

  els.viewListBtn.addEventListener("click", () => setViewMode("list"));
  els.viewTileBtn.addEventListener("click", () => setViewMode("tile"));
  els.viewHybridBtn.addEventListener("click", () => setViewMode("hybrid"));

  // Compact tiles toggle – reduces predictive badge clutter in grid view – March 2026
  compactMode = localStorage.getItem(LS_COMPACT_TILES) === "true";
  els.compactTilesToggle.checked = compactMode;
  els.compactTilesToggle.addEventListener("change", () => {
    compactMode = els.compactTilesToggle.checked;
    localStorage.setItem(LS_COMPACT_TILES, compactMode ? "true" : "false");
    // Re-render all market panels with the new compact preference.
    if (latestTopItems.length > 0) renderMarketItems(latestTopItems);
    if (analyzer) renderFavorites();
    if (latestSearchResults.length > 0) renderSearchResults(latestSearchResults);
  });
}

/**
 * Switch the market panel to a new view mode and re-render.
 */
function setViewMode(mode: ViewMode): void {
  currentView = mode;
  localStorage.setItem(LS_VIEW_MODE, mode);

  // Update active button styling.
  els.viewListBtn.classList.toggle("active", mode === "list");
  els.viewTileBtn.classList.toggle("active", mode === "tile");
  els.viewHybridBtn.classList.toggle("active", mode === "hybrid");

  // Apply CSS class for layout mode.
  els.marketItems.className = `market-items ${mode}`;
  els.searchResults.className = `market-items ${mode}`;
  els.favoritesItems.className = `market-items ${mode}`;

  // Re-render if data is available.
  if (latestTopItems.length > 0) {
    renderMarketItems(latestTopItems);
  }
  // Re-render favourites in new view mode (guard: analyzer may not exist yet).
  if (analyzer) renderFavorites();
}

// ─── Market Item Rendering ──────────────────────────────────────────────────

/**
 * Build the sprite `<img>` URL from an item's catalogue ID.
 */
function spriteUrl(itemId: number): string {
  return `${SPRITE_BASE}${itemId}`;
}

// ─── Sparkline Renderer ─────────────────────────────────────────────────────

/**
 * Draw a tiny line chart on an HTML5 `<canvas>` element.
 *
 * The data is normalised to fill the canvas height (min→bottom, max→top)
 * and evenly spaced across its width.  The line is green when the trend
 * is upward (last > first) and red when downward.
 *
 * Handles edge cases gracefully:
 * - **0 data points**: Renders a centred "No price history" placeholder.
 * - **1 data point**: Renders a single dot at the vertical midpoint.
 * - **≥ 2 data points**: Full sparkline.
 *
 * @param canvas - The target `<canvas>` DOM element.
 * @param data   - Array of numeric values in chronological order.
 */
function drawSparkline(canvas: HTMLCanvasElement, data: number[]): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Use the element's laid-out size so the drawing matches CSS sizing.
  const w = canvas.offsetWidth || canvas.width;
  const h = canvas.offsetHeight || canvas.height;
  canvas.width = w;
  canvas.height = h;

  // ── No data: draw placeholder text ──
  if (data.length === 0) {
    const sparkTheme = getChartThemeColors();
    const fontSize = Math.max(9, Math.round(h * 0.35));
    ctx.font = `${fontSize}px "Segoe UI", sans-serif`;
    ctx.fillStyle = sparkTheme.emptyText;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("No price history", w / 2, h / 2);
    return;
  }

  // ── Single data point: draw a dot ──
  if (data.length === 1) {
    ctx.fillStyle = getChartThemeColors().emptyText;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, Math.max(2, Math.round(h * 0.12)), 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  // ── ≥ 2 data points: full sparkline ──
  const padding = 2;                        // tiny top/bottom breathing room
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;             // avoid division-by-zero for flat lines
  const stepX = (w - 1) / (data.length - 1);

  // Green = uptrend, red = downtrend, grey = flat.
  const first = data[0];
  const last = data[data.length - 1];
  ctx.strokeStyle = last > first ? "#4ec9b0" : last < first ? "#f44747" : "#888";
  ctx.lineWidth = 1.5;
  ctx.lineJoin = "round";

  ctx.beginPath();
  for (let i = 0; i < data.length; i++) {
    const x = i * stepX;
    const y = h - padding - ((data[i] - min) / range) * (h - padding * 2);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
}

// ─── Graph Modal Chart Renderer ─────────────────────────────────────────────

/**
 * Abbreviate a gp value for axis labels (e.g. 1200 → "1.2K", 3400000 → "3.4M").
 */
/**
 * Abbreviate a gp value for axis labels.
 * When `precision` > 1 the suffix uses more decimal places so tightly-spaced
 * ticks (e.g. 1.05M vs 1.09M) remain distinguishable instead of both
 * rounding to "1.1M".
 */
function axisLabel(value: number, precision = 1): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_000_000_000) return `${sign}${(abs / 1_000_000_000).toFixed(precision)}B`;
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(precision)}M`;
  if (abs >= 1_000) return `${sign}${(abs / 1_000).toFixed(precision)}K`;
  return `${sign}${abs}`;
}

/**
 * Choose the minimum decimal precision needed so that every Y-axis tick
 * label is visually distinct after abbreviation.
 */
function axisLabelPrecision(min: number, max: number, ticks: number): number {
  const step = (max - min) / ticks;
  if (step === 0) return 1;
  // Determine the magnitude of the divisor (K / M / B)
  const ref = Math.max(Math.abs(min), Math.abs(max));
  let divisor = 1;
  if (ref >= 1_000_000_000) divisor = 1_000_000_000;
  else if (ref >= 1_000_000) divisor = 1_000_000;
  else if (ref >= 1_000) divisor = 1_000;
  const stepInUnits = step / divisor;
  // Need enough decimals so stepInUnits doesn't round to 0
  if (stepInUnits >= 1) return 1;
  if (stepInUnits >= 0.1) return 1;
  if (stepInUnits >= 0.01) return 2;
  return 3;
}

/**
 * Compute the full EMA series for a price array.
 * Returns an array of the same length as `prices` where each element is the
 * running EMA up to that index.
 *
 * @param prices - Chronological price array (oldest-first).
 * @param alpha  - Smoothing factor (default 2/(30+1) ≈ 0.0645 for 30-day EMA).
 */
function computeEmaSeries(prices: number[], alpha: number = 2 / 31): number[] {
  if (prices.length === 0) return [];
  const ema: number[] = [prices[0]];
  for (let i = 1; i < prices.length; i++) {
    ema.push(alpha * prices[i] + (1 - alpha) * ema[i - 1]);
  }
  return ema;
}

/**
 * Read theme-aware colours for chart rendering from CSS custom properties.
 * Returns appropriate grid, text, and container colours for the active mode.
 */
function getChartThemeColors(): {
  gridLine: string;
  axisText: string;
  emptyText: string;
  dotStroke: string;
  legendText: string;
} {
  const isLight = document.body.dataset.mode === "light";
  const cs = getComputedStyle(document.body);
  const textMuted = cs.getPropertyValue("--text-muted").trim();
  const textSoft = cs.getPropertyValue("--text-soft").trim();
  return {
    gridLine: isLight ? "rgba(0,0,0,0.10)" : "rgba(255,255,255,0.07)",
    axisText: textMuted || (isLight ? "#777" : "#999"),
    emptyText: textSoft || (isLight ? "#999" : "#888"),
    dotStroke: isLight ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0.5)",
    legendText: textMuted || (isLight ? "#777" : "#bbb"),
  };
}

/** Shared chart margin constants. */
const CHART_MARGIN = { left: 58, right: 24, top: 18, bottom: 32 } as const;

/** Number of horizontal grid lines (Y-axis ticks). */
const CHART_Y_TICKS = 4;

/** Minimum zoom window in data points. */
const CHART_MIN_ZOOM = 5;

/** Maximum number of zoom-in steps from full data. */
const CHART_MAX_ZOOM_STEPS = 8;

/** Data the tooltip displays for one hovered point. */
interface ChartHoverData {
  /** Index into the *windowed* data array. */
  windowIndex: number;
  /** Index into the *full* data array. */
  dataIndex: number;
  /** CSS-space X coordinate of the data point. */
  x: number;
  /** CSS-space Y coordinate of the data point. */
  y: number;
  /** Price at this point. */
  price: number;
  /** 30-day EMA value at this point (0 when unavailable). */
  ema: number;
  /** Volume estimate at this point (0 when unavailable). */
  volume: number;
  /** Date string for the tooltip heading. */
  dateLabel: string;
}

/** Which chart data layers are visible — each key is independently togglable. */
interface ChartLayers {
  price: boolean;
  ema: boolean;
  volume: boolean;
  dots: boolean;
}

const CHART_LAYERS_KEY = "ge-analyzer:chart-layers";

/** Read persisted layer toggles, falling back to all-on defaults. */
function loadChartLayers(): ChartLayers {
  const defaults: ChartLayers = { price: true, ema: true, volume: true, dots: true };
  try {
    const raw = localStorage.getItem(CHART_LAYERS_KEY);
    if (raw) return { ...defaults, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return defaults;
}

/** Persist current layer toggles. */
function saveChartLayers(layers: ChartLayers): void {
  try { localStorage.setItem(CHART_LAYERS_KEY, JSON.stringify(layers)); } catch { /* ignore */ }
}

/**
 * Dual-canvas interactive chart with crosshair, tooltip, and scroll-zoom.
 *
 * **Overlay pattern** – two `<canvas>` elements are stacked via CSS:
 * - *Base canvas*: static grid, area gradient, price line, EMA line, data dots.
 *   Redrawn only when data or zoom window changes.
 * - *Interaction canvas*: crosshairs + highlight circle.
 *   Redrawn on every `mousemove` (cheap — ≤ 6 draw calls).
 *
 * A sibling `.chart-tooltip` `<div>` is positioned absolutely for rich HTML
 * tooltips without redrawing pixels.
 *
 * All coordinate maths accounts for `window.devicePixelRatio` to avoid
 * offset bugs on high-DPI displays.
 */
class InteractiveChart {
  // ── DOM elements ──
  private container: HTMLDivElement;
  private canvasWrap: HTMLDivElement;
  private baseCanvas: HTMLCanvasElement;
  private interCanvas: HTMLCanvasElement;
  private tooltip: HTMLDivElement;
  private zoomHint: HTMLDivElement;
  private toggleStrip: HTMLDivElement;

  // ── Data ──
  private fullData: number[] = [];
  private fullEma: number[] = [];
  private fullVolumes: number[] = [];

  // ── Layer visibility ──
  private layers: ChartLayers;

  // ── Zoom window (indices into fullData) ──
  private winStart = 0;
  private winEnd = 0;

  // ── Hover state ──
  private hoverData: ChartHoverData | null = null;

  // ── Drag-to-pan state ──
  private isDragging = false;
  private dragStartX = 0;
  private dragStartWinStart = 0;
  private dragStartWinEnd = 0;
  /** Timestamp (ms) when the last drag ended — used to suppress backdrop click. */
  private dragEndedAt = 0;

  // ── Cached layout values (CSS pixels, updated on every base draw) ──
  private cssW = 0;
  private cssH = 0;



  // ── Resize observer (responsive canvas sync) ──
  private resizeObs: ResizeObserver | null = null;

  // ── Bound listeners (for cleanup) ──
  private boundMouseMove: (e: MouseEvent) => void;
  private boundMouseLeave: () => void;
  private boundWheel: (e: WheelEvent) => void;
  private boundMouseDown: (e: MouseEvent) => void;
  private boundMouseUp: (e: MouseEvent) => void;
  private boundGlobalMouseMove: (e: MouseEvent) => void;

  /**
   * Build the interactive chart DOM and attach it to the given parent.
   * Does **not** draw anything yet — call {@link setData} to populate.
   *
   * @param parent - The DOM element that will contain both canvases + tooltip.
   * @param height - Desired CSS height for the chart (e.g. "200px").
   */
  constructor(parent: HTMLElement, height = "200px") {
    // ── Container ──
    this.container = document.createElement("div");
    this.container.className = "chart-container";

    // ── Base canvas ──
    this.baseCanvas = document.createElement("canvas");
    this.baseCanvas.className = "chart-base-canvas";
    this.baseCanvas.style.height = height;
    this.baseCanvas.setAttribute("role", "img");
    this.baseCanvas.setAttribute("aria-label", "Price chart: loading\u2026");

    // ── Interaction overlay canvas ──
    this.interCanvas = document.createElement("canvas");
    this.interCanvas.className = "chart-interaction-canvas";

    // ── Tooltip ──
    this.tooltip = document.createElement("div");
    this.tooltip.className = "chart-tooltip";

    // ── Zoom hint ──
    this.zoomHint = document.createElement("div");
    this.zoomHint.className = "chart-zoom-hint";
    this.zoomHint.textContent = "Scroll to zoom \u2022 Drag to pan";

    // ── Layer toggles ──
    this.layers = loadChartLayers();
    this.toggleStrip = document.createElement("div");
    this.toggleStrip.className = "chart-layer-toggles";
    const layerDefs: { key: keyof ChartLayers; label: string; color: string }[] = [
      { key: "price",  label: "Price",   color: "#4ec9b0" },
      { key: "ema",    label: "EMA",     color: "#569cd6" },
      { key: "volume", label: "Volume",  color: "#888" },
      { key: "dots",   label: "Dots",    color: "#bbb" },
    ];
    for (const def of layerDefs) {
      const pill = document.createElement("button");
      pill.type = "button";
      pill.className = "chart-layer-pill" + (this.layers[def.key] ? " active" : "");
      pill.dataset.layer = def.key;
      pill.style.setProperty("--pill-color", def.color);
      pill.textContent = def.label;
      pill.addEventListener("click", () => {
        this.layers[def.key] = !this.layers[def.key];
        pill.classList.toggle("active", this.layers[def.key]);
        saveChartLayers(this.layers);
        this.drawBase();
        // Re-draw interaction layer if hovering (so EMA highlight updates)
        if (this.hoverData) {
          this.drawInteraction(this.hoverData.x, this.hoverData.y);
        }
      });
      this.toggleStrip.appendChild(pill);
    }

    // ── Canvas wrapper (keeps interaction canvas aligned with base canvas) ──
    this.canvasWrap = document.createElement("div");
    this.canvasWrap.className = "chart-canvas-wrap";

    // Assemble
    this.container.appendChild(this.toggleStrip);
    this.canvasWrap.appendChild(this.baseCanvas);
    this.canvasWrap.appendChild(this.interCanvas);
    this.canvasWrap.appendChild(this.tooltip);
    this.container.appendChild(this.canvasWrap);
    this.container.appendChild(this.zoomHint);
    parent.appendChild(this.container);

    // ── Responsive: re-sync canvas dimensions on resize ──
    this.resizeObs = new ResizeObserver(() => {
      if (this.fullData.length >= 2) this.drawBase();
    });
    this.resizeObs.observe(this.baseCanvas);

    // ── Bind events ──
    this.boundMouseMove = this.onMouseMove.bind(this);
    this.boundMouseLeave = this.onMouseLeave.bind(this);
    this.boundWheel = this.onWheel.bind(this);
    this.boundMouseDown = this.onMouseDown.bind(this);
    this.boundMouseUp = this.onMouseUp.bind(this);
    this.boundGlobalMouseMove = this.onGlobalMouseMove.bind(this);
    this.container.addEventListener("mousemove", this.boundMouseMove);
    this.container.addEventListener("mouseleave", this.boundMouseLeave);
    this.container.addEventListener("wheel", this.boundWheel, { passive: false });
    this.container.addEventListener("mousedown", this.boundMouseDown);
    window.addEventListener("mouseup", this.boundMouseUp);
    window.addEventListener("mousemove", this.boundGlobalMouseMove);
  }

  /**
   * Update chart data and redraw. EMA is computed automatically; volumes are
   * optional (pass `[]` when unavailable).
   *
   * @param prices  - Chronological price array (oldest-first).
   * @param volumes - Matching volume array (same length) or empty.
   */
  setData(prices: number[], volumes: number[] = []): void {
    this.fullData = prices;
    this.fullEma = computeEmaSeries(prices);
    this.fullVolumes = volumes;
    this.winStart = 0;
    this.winEnd = prices.length - 1;
    this.hoverData = null;
    this.hideTooltip();
    this.drawBase();
  }

  /** Remove event listeners and detach from the DOM. */
  destroy(): void {
    if (this.resizeObs) { this.resizeObs.disconnect(); this.resizeObs = null; }
    this.container.removeEventListener("mousemove", this.boundMouseMove);
    this.container.removeEventListener("mouseleave", this.boundMouseLeave);
    this.container.removeEventListener("wheel", this.boundWheel);
    this.container.removeEventListener("mousedown", this.boundMouseDown);
    window.removeEventListener("mouseup", this.boundMouseUp);
    window.removeEventListener("mousemove", this.boundGlobalMouseMove);
    this.container.remove();
  }

  /** Return the root container element (for insertion into dynamically built DOM). */
  getElement(): HTMLDivElement {
    return this.container;
  }

  /** Return the base canvas (for backward-compat visibility toggling). */
  getBaseCanvas(): HTMLCanvasElement {
    return this.baseCanvas;
  }

  /** Force a full redraw (e.g. after theme change). */
  redraw(): void {
    if (this.fullData.length >= 2) this.drawBase();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  PRIVATE — Drawing
  // ═══════════════════════════════════════════════════════════════════════════

  /** Return the currently visible slice of data. */
  private windowedData(): number[] {
    return this.fullData.slice(this.winStart, this.winEnd + 1);
  }

  /** Return the currently visible slice of EMA. */
  private windowedEma(): number[] {
    return this.fullEma.slice(this.winStart, this.winEnd + 1);
  }

  /**
   * Size a canvas to match CSS layout × devicePixelRatio, then return
   * its 2D context scaled appropriately.
   */
  private prepCanvas(canvas: HTMLCanvasElement): CanvasRenderingContext2D | null {
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const dpr = window.devicePixelRatio || 1;
    const cssW = this.baseCanvas.offsetWidth || this.baseCanvas.clientWidth || 480;
    const cssH = this.baseCanvas.offsetHeight || this.baseCanvas.clientHeight || 200;
    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.cssW = cssW;
    this.cssH = cssH;
    return ctx;
  }

  /**
   * Compute CSS-space coordinates for a data point given the current window.
   */
  private toXY(
    index: number, value: number, stepX: number, min: number, range: number,
  ): { x: number; y: number } {
    const { left, top, bottom } = CHART_MARGIN;
    const plotH = this.cssH - top - bottom;
    return {
      x: left + index * stepX,
      y: top + plotH - ((value - min) / range) * plotH,
    };
  }

  // ── Base layer ────────────────────────────────────────────────────────────

  /** Redraw the static base layer (grid, area, price line, EMA line, dots). */
  private drawBase(): void {
    const data = this.windowedData();
    const ema = this.windowedEma();
    const ctx = this.prepCanvas(this.baseCanvas);
    if (!ctx) return;

    // Also resize the interaction canvas to match.
    this.prepCanvas(this.interCanvas);

    const cssW = this.cssW;
    const cssH = this.cssH;
    const { left: mL, right: mR, top: mT, bottom: mB } = CHART_MARGIN;
    const plotW = cssW - mL - mR;
    const plotH = cssH - mT - mB;

    // ── Accessibility: update aria-label ──
    if (data.length >= 2) {
      const first = data[0];
      const last = data[data.length - 1];
      const pctDelta = ((last - first) / first * 100).toFixed(1);
      const dir = last > first ? "up" : last < first ? "down" : "flat";
      this.baseCanvas.setAttribute("aria-label",
        `Price chart: ${data.length} data points. Trend ${dir} ${pctDelta}% from ${axisLabel(first)} to ${axisLabel(last)} gp.`);
    } else {
      this.baseCanvas.setAttribute("aria-label", "Price chart: insufficient data to display.");
    }

    // ── Resolve theme-aware colours once per draw ──
    const theme = getChartThemeColors();

    // ── Edge cases ──
    if (data.length === 0) {
      ctx.font = '12px "Segoe UI", sans-serif';
      ctx.fillStyle = theme.emptyText;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("No price history available", cssW / 2, cssH / 2);
      return;
    }
    if (data.length === 1) {
      ctx.font = '11px "Segoe UI", sans-serif';
      ctx.fillStyle = theme.emptyText;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${axisLabel(data[0])} gp (1 day)`, cssW / 2, cssH / 2);
      return;
    }

    // ── Axis ranges (use full dataset so Y-axis stays stable when panning) ──
    const isZoomed = this.winEnd - this.winStart + 1 < this.fullData.length;
    const ySource = isZoomed
      ? [...this.fullData, ...this.fullEma.filter(v => v > 0)]
      : [...data, ...ema.filter(v => v > 0)];
    const rawMin = Math.min(...ySource);
    const rawMax = Math.max(...ySource);
    const rawRange = rawMax - rawMin || 1;
    // Add 5% vertical padding so extreme values aren't clipped at the edges
    const pad = rawRange * 0.05;
    const min = rawMin - pad;
    const max = rawMax + pad;
    const range = max - min;
    const stepX = plotW / (data.length - 1);

    // ── Y-axis ticks + grid ──
    const tickValues: number[] = [];
    for (let i = 0; i <= CHART_Y_TICKS; i++) {
      tickValues.push(min + (range * i) / CHART_Y_TICKS);
    }
    const yPrec = axisLabelPrecision(min, max, CHART_Y_TICKS);
    ctx.font = '11px "Segoe UI", sans-serif';
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (const tv of tickValues) {
      const y = mT + plotH - ((tv - min) / range) * plotH;
      ctx.strokeStyle = theme.gridLine;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(mL, y);
      ctx.lineTo(cssW - mR, y);
      ctx.stroke();
      ctx.fillStyle = theme.axisText;
      ctx.fillText(axisLabel(tv, yPrec), mL - 6, y);
    }

    // ── X-axis labels (short dates, evenly spaced) ──
    ctx.textBaseline = "top";
    ctx.fillStyle = theme.axisText;
    const SHORT_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const maxLabels = 6;
    // Choose an even day-interval that fits within the visible window
    const totalDays = data.length - 1;
    let dayInterval = Math.max(1, Math.ceil(totalDays / (maxLabels - 1)));
    // Snap to "nice" intervals when range is large enough
    const niceIntervals = [1, 2, 5, 7, 10, 14, 15, 30, 45, 60, 90];
    for (const ni of niceIntervals) {
      if (ni >= dayInterval) { dayInterval = ni; break; }
    }
    // Build label indices from the END (most recent) backwards at even intervals
    const labelIndices: number[] = [];
    for (let idx = totalDays; idx >= 0; idx -= dayInterval) {
      labelIndices.unshift(idx);
    }
    // Always include the first point if not already there
    if (labelIndices[0] !== 0) labelIndices.unshift(0);

    const labelY = cssH - mB + 8;
    for (let li = 0; li < labelIndices.length; li++) {
      const idx = labelIndices[li];
      const x = mL + idx * stepX;
      const globalIdx = this.winStart + idx;
      const daysAgo = this.fullData.length - 1 - globalIdx;
      let label: string;
      if (daysAgo === 0) {
        label = "Today";
      } else {
        const d = new Date();
        d.setDate(d.getDate() - daysAgo);
        label = `${d.getDate()} ${SHORT_MONTHS[d.getMonth()]}`;
      }
      // Clamp alignment at edges so text doesn't overflow the plot area
      if (li === 0) {
        ctx.textAlign = "left";
      } else if (li === labelIndices.length - 1) {
        ctx.textAlign = "right";
      } else {
        ctx.textAlign = "center";
      }
      ctx.fillText(label, x, labelY);
    }

    // Trend colour (locked to full dataset when zoomed so panning doesn't flip it)
    const trendFirst = isZoomed ? this.fullData[0] : data[0];
    const trendLast = isZoomed ? this.fullData[this.fullData.length - 1] : data[data.length - 1];
    const lineColour = trendLast > trendFirst ? "#4ec9b0" : trendLast < trendFirst ? "#f44747" : "#888888";

    // ── Clip to plot area so nothing bleeds into margins ──
    ctx.save();
    ctx.beginPath();
    ctx.rect(mL, mT, plotW, plotH);
    ctx.clip();

    // ── Volume bars (drawn first so they sit behind price line) ──
    if (this.layers.volume) {
      const winVols = this.fullVolumes.slice(this.winStart, this.winEnd + 1);
      const maxVol = Math.max(...winVols, 1);
      const volMaxH = plotH * 0.25; // volume occupies bottom 25% of plot
      const barW = Math.max(1, stepX * 0.5);
      ctx.globalAlpha = 0.25;
      for (let i = 0; i < winVols.length; i++) {
        if (!winVols[i]) continue;
        const barH = (winVols[i] / maxVol) * volMaxH;
        const x = mL + i * stepX - barW / 2;
        const y = mT + plotH - barH;
        ctx.fillStyle = winVols[i] >= maxVol * 0.75 ? "#e2b93d" : "#888";
        ctx.fillRect(x, y, barW, barH);
      }
      ctx.globalAlpha = 1;
    }

    // ── Gradient fill under curve ──
    if (this.layers.price) {
      const p0 = this.toXY(0, data[0], stepX, min, range);
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      for (let i = 1; i < data.length; i++) {
        const p = this.toXY(i, data[i], stepX, min, range);
        ctx.lineTo(p.x, p.y);
      }
      const pLast = this.toXY(data.length - 1, data[data.length - 1], stepX, min, range);
      ctx.lineTo(pLast.x, mT + plotH);
      ctx.lineTo(p0.x, mT + plotH);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, mT, 0, mT + plotH);
      grad.addColorStop(0, lineColour + "44");
      grad.addColorStop(1, lineColour + "08");
      ctx.fillStyle = grad;
      ctx.fill();

      // ── Price line ──
      ctx.strokeStyle = lineColour;
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.beginPath();
      for (let i = 0; i < data.length; i++) {
        const p = this.toXY(i, data[i], stepX, min, range);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    }

    // ── EMA line (dashed, semi-transparent) ──
    if (this.layers.ema && ema.length >= 2 && ema[0] > 0) {
      ctx.save();
      ctx.strokeStyle = "rgba(86,156,214,0.7)"; // --accent-primary fallback
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      for (let i = 0; i < ema.length; i++) {
        const p = this.toXY(i, ema[i], stepX, min, range);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
      ctx.restore();
    }

    // ── Data-point dots ──
    if (this.layers.dots && this.layers.price) {
      for (let i = 0; i < data.length; i++) {
        const p = this.toXY(i, data[i], stepX, min, range);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = lineColour;
        ctx.fill();
        ctx.strokeStyle = theme.dotStroke;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // ── Restore from plot-area clip ──
    ctx.restore();

    // Update zoom hint visibility
    this.zoomHint.style.display = this.fullData.length > CHART_MIN_ZOOM ? "" : "none";

    // ── Update Price pill colour to match trend line ──
    const pricePill = this.toggleStrip.querySelector<HTMLElement>('[data-layer="price"]');
    if (pricePill) pricePill.style.setProperty("--pill-color", lineColour);
  }

  // ── Interaction layer ─────────────────────────────────────────────────────

  /** Redraw the interaction overlay (crosshairs + highlight). */
  private drawInteraction(cssX: number, cssY: number): void {
    const ctx = this.interCanvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, this.cssW, this.cssH);

    const { left: mL, right: mR, top: mT, bottom: mB } = CHART_MARGIN;
    const plotW = this.cssW - mL - mR;
    const plotH = this.cssH - mT - mB;

    // Clamp cursor to plot area
    const cx = Math.max(mL, Math.min(cssX, mL + plotW));
    const cy = Math.max(mT, Math.min(cssY, mT + plotH));

    // Read --accent-primary from the page (fallback blue)
    const accentColour = getComputedStyle(document.body)
      .getPropertyValue("--accent-primary").trim() || "#569cd6";

    // ── Clip to plot area so crosshairs/circles never bleed into axes ──
    ctx.save();
    ctx.beginPath();
    ctx.rect(mL, mT, plotW, plotH);
    ctx.clip();

    // ── Dashed vertical line (Time) ──
    ctx.strokeStyle = accentColour;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 3]);
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.moveTo(cx, mT);
    ctx.lineTo(cx, mT + plotH);
    ctx.stroke();

    // ── Dashed horizontal line (snaps to nearest data point) ──
    const snapY = this.hoverData ? this.hoverData.y : cy;
    ctx.beginPath();
    ctx.moveTo(mL, snapY);
    ctx.lineTo(mL + plotW, snapY);
    ctx.stroke();

    // Reset dash and alpha for circles
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;

    // ── Highlight circle on nearest data point ──
    if (this.hoverData && this.layers.price) {
      const { x, y } = this.hoverData;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = accentColour;
      ctx.globalAlpha = 0.35;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = accentColour;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // ── Highlight circle on EMA line at the same index ──
    if (this.hoverData && this.layers.ema) {
      const ema = this.windowedEma();
      const data = this.windowedData();
      const emaVal = ema[this.hoverData.windowIndex];
      if (emaVal && emaVal > 0 && data.length >= 2) {
        const isZoomed = this.winEnd - this.winStart + 1 < this.fullData.length;
        const ySource = isZoomed
          ? [...this.fullData, ...this.fullEma.filter(v => v > 0)]
          : [...data, ...ema.filter(v => v > 0)];
        const eRawMin = Math.min(...ySource);
        const eRawMax = Math.max(...ySource);
        const eRawRange = eRawMax - eRawMin || 1;
        const ePad = eRawRange * 0.05;
        const eMin = eRawMin - ePad;
        const eMax = eRawMax + ePad;
        const eRange = eMax - eMin;
        const stepXE = plotW / (data.length - 1);
        const ep = this.toXY(this.hoverData.windowIndex, emaVal, stepXE, eMin, eRange);
        ctx.beginPath();
        ctx.arc(ep.x, ep.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(86,156,214,0.35)";
        ctx.fill();
        ctx.strokeStyle = "rgba(86,156,214,0.9)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    // ── Restore from plot-area clip ──
    ctx.restore();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  PRIVATE — Coordinate mapping
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Convert a mouse event's clientX/Y to CSS-space coordinates relative to
   * the base canvas, accounting for DPR.
   */
  private clientToCSS(e: MouseEvent): { cssX: number; cssY: number } {
    const rect = this.baseCanvas.getBoundingClientRect();
    return {
      cssX: e.clientX - rect.left,
      cssY: e.clientY - rect.top,
    };
  }

  /**
   * Find the nearest data point (by X distance) to a CSS-space X coordinate.
   * Updates `this.hoverData` and returns it.
   */
  private resolveNearestPoint(cssX: number): ChartHoverData | null {
    const data = this.windowedData();
    const ema = this.windowedEma();
    if (data.length < 2) return null;

    const { left: mL, right: mR, top: mT, bottom: mB } = CHART_MARGIN;
    const plotW = this.cssW - mL - mR;
    const plotH = this.cssH - mT - mB;
    const stepX = plotW / (data.length - 1);

    const isZoomed = this.winEnd - this.winStart + 1 < this.fullData.length;
    const ySource = isZoomed
      ? [...this.fullData, ...this.fullEma.filter(v => v > 0)]
      : [...data, ...ema.filter(v => v > 0)];
    const rawMin = Math.min(...ySource);
    const rawMax = Math.max(...ySource);
    const rawRange = rawMax - rawMin || 1;
    const pad = rawRange * 0.05;
    const min = rawMin - pad;
    const max = rawMax + pad;
    const range = max - min;

    // Nearest index in window
    const rawIdx = (cssX - mL) / stepX;
    const idx = Math.max(0, Math.min(Math.round(rawIdx), data.length - 1));
    const globalIdx = this.winStart + idx;

    const pt = this.toXY(idx, data[idx], stepX, min, range);

    // Date label: days ago from today
    const daysAgo = this.fullData.length - 1 - globalIdx;
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    const dateLabel = d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

    const hd: ChartHoverData = {
      windowIndex: idx,
      dataIndex: globalIdx,
      x: pt.x,
      y: pt.y,
      price: data[idx],
      ema: ema[idx] || 0,
      volume: this.fullVolumes[globalIdx] || 0,
      dateLabel,
    };
    this.hoverData = hd;
    return hd;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  PRIVATE — Tooltip
  // ═══════════════════════════════════════════════════════════════════════════

  /** Position and populate the tooltip <div> near the hovered point. */
  private showTooltip(hd: ChartHoverData): void {
    const emaRow = this.layers.ema && hd.ema > 0
      ? `<div class="chart-tooltip-row"><span class="chart-tooltip-label">30d EMA</span><span class="chart-tooltip-value">${Math.round(hd.ema).toLocaleString("en-US")} gp</span></div>`
      : "";
    const volRow = this.layers.volume && hd.volume > 0
      ? `<div class="chart-tooltip-row"><span class="chart-tooltip-label">Volume</span><span class="chart-tooltip-value">${hd.volume.toLocaleString("en-US")}</span></div>`
      : "";
    const priceDir = this.fullData.length >= 2 && hd.dataIndex > 0
      ? (hd.price > this.fullData[hd.dataIndex - 1] ? "up" : hd.price < this.fullData[hd.dataIndex - 1] ? "down" : "")
      : "";

    this.tooltip.innerHTML =
      `<div class="chart-tooltip-row"><span class="chart-tooltip-label">Date</span><span class="chart-tooltip-value">${hd.dateLabel}</span></div>` +
      `<div class="chart-tooltip-row"><span class="chart-tooltip-label">Price</span><span class="chart-tooltip-value ${priceDir}">${hd.price.toLocaleString("en-US")} gp</span></div>` +
      emaRow + volRow;

    // Position: if cursor is in the right half of the plot, flip tooltip left
    // of the cursor (and vice-versa).  Bounds are relative to the canvas wrapper
    // (the tooltip's offset parent) so coordinates align with hd.x / hd.y.
    const tipW = 180; // approximate max width
    const tipH = 80;
    const { left: mL, right: mR } = CHART_MARGIN;
    const plotW = this.cssW - mL - mR;
    const plotMidX = mL + plotW / 2;
    const wrapW = this.cssW;
    const wrapH = this.cssH;

    let left: number;
    if (hd.x > plotMidX) {
      // Right half → tooltip to the LEFT of the cursor
      left = hd.x - tipW - 14;
    } else {
      // Left half → tooltip to the RIGHT of the cursor
      left = hd.x + 14;
    }
    let top = hd.y - tipH / 2;

    // Clamp within wrapper bounds
    if (left + tipW > wrapW - 4) left = wrapW - tipW - 4;
    if (left < 4) left = 4;
    if (top < 4) top = 4;
    if (top + tipH > wrapH - 4) top = wrapH - tipH - 4;

    this.tooltip.style.left = `${left}px`;
    this.tooltip.style.top = `${top}px`;
    this.tooltip.classList.add("visible");
  }

  /** Hide the tooltip. */
  private hideTooltip(): void {
    this.tooltip.classList.remove("visible");
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  PRIVATE — Event handlers
  // ═══════════════════════════════════════════════════════════════════════════

  /** Handle mousemove — resolve nearest point + crosshair + tooltip (drag handled globally). */
  private onMouseMove(e: MouseEvent): void {
    // During drag, global handler manages panning — skip local hover logic.
    if (this.isDragging) return;

    const { cssX, cssY } = this.clientToCSS(e);
    const hd = this.resolveNearestPoint(cssX);

    this.drawInteraction(cssX, cssY);

    if (hd) {
      this.showTooltip(hd);
      // Accessibility: update aria-label with hovered price
      this.baseCanvas.setAttribute("aria-label",
        `Price chart: hovering ${hd.dateLabel}, ${hd.price.toLocaleString("en-US")} gp.`);
    }
  }

  /** Handle mouseleave — clear crosshair and tooltip (drag continues globally). */
  private onMouseLeave(): void {
    // Don't cancel drag — window-level mousemove/mouseup handle it.
    if (!this.isDragging) {
      this.hoverData = null;
      // Clear the interaction canvas
      const ctx = this.interCanvas.getContext("2d");
      if (ctx) {
        const dpr = window.devicePixelRatio || 1;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, this.cssW, this.cssH);
      }
      this.hideTooltip();

      // Restore default aria-label
      const data = this.windowedData();
      if (data.length >= 2) {
        const first = data[0];
        const last = data[data.length - 1];
        const pctDelta = ((last - first) / first * 100).toFixed(1);
        const dir = last > first ? "up" : last < first ? "down" : "flat";
        this.baseCanvas.setAttribute("aria-label",
          `Price chart: ${data.length} data points. Trend ${dir} ${pctDelta}% from ${axisLabel(first)} to ${axisLabel(last)} gp.`);
      }
    }
  }

  /** Handle mousedown — start drag-to-pan when zoomed in. */
  private onMouseDown(e: MouseEvent): void {
    // Only left-click, only when zoomed in
    if (e.button !== 0) return;
    const winLen = this.winEnd - this.winStart + 1;
    if (winLen >= this.fullData.length) return;

    this.isDragging = true;
    this.dragStartX = this.clientToCSS(e).cssX;
    this.dragStartWinStart = this.winStart;
    this.dragStartWinEnd = this.winEnd;
    this.hideTooltip();
    this.updateCursor();
    e.preventDefault(); // prevent text selection
  }

  /** Handle mouseup — end drag-to-pan. */
  private onMouseUp(_e: MouseEvent): void {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.dragEndedAt = Date.now();
    this.updateCursor();
  }

  /**
   * Returns true if a drag ended very recently (within 300 ms).
   * Used by external code (backdrop click handlers) to avoid closing the modal.
   */
  wasDragging(): boolean {
    return Date.now() - this.dragEndedAt < 300;
  }

  /** Handle global mousemove — continue drag-pan even when cursor leaves the chart. */
  private onGlobalMouseMove(e: MouseEvent): void {
    if (!this.isDragging) return;
    const { cssX } = this.clientToCSS(e);
    const dx = cssX - this.dragStartX;
    const { left: mL, right: mR } = CHART_MARGIN;
    const plotW = this.cssW - mL - mR;
    const winLen = this.dragStartWinEnd - this.dragStartWinStart + 1;
    const stepX = plotW / (winLen - 1);
    const indexDelta = Math.round(-dx / stepX);

    let newStart = this.dragStartWinStart + indexDelta;
    newStart = Math.max(0, Math.min(newStart, this.fullData.length - winLen));
    const newEnd = newStart + winLen - 1;

    if (newStart !== this.winStart || newEnd !== this.winEnd) {
      this.winStart = newStart;
      this.winEnd = newEnd;
      this.hoverData = null;
      this.hideTooltip();
      this.drawBase();
    }
  }

  /** Update cursor style based on zoom/drag state. */
  private updateCursor(): void {
    const isZoomed = (this.winEnd - this.winStart + 1) < this.fullData.length;
    if (this.isDragging) {
      this.container.style.cursor = "grabbing";
    } else if (isZoomed) {
      this.container.style.cursor = "grab";
    } else {
      this.container.style.cursor = "crosshair";
    }
  }

  /** Handle wheel — zoom to cursor. */
  private onWheel(e: WheelEvent): void {
    if (this.fullData.length <= CHART_MIN_ZOOM) return;
    e.preventDefault();

    const { cssX } = this.clientToCSS(e);
    const data = this.windowedData();
    if (data.length < 2) return;

    const { left: mL, right: mR } = CHART_MARGIN;
    const plotW = this.cssW - mL - mR;
    const stepX = plotW / (data.length - 1);

    // Cursor position as a fraction of the current window
    const rawIdx = (cssX - mL) / stepX;
    const frac = Math.max(0, Math.min(rawIdx / (data.length - 1), 1));

    const currentLen = this.winEnd - this.winStart + 1;
    const zoomIn = e.deltaY < 0;
    let newLen: number;

    if (zoomIn) {
      newLen = Math.max(CHART_MIN_ZOOM, Math.floor(currentLen * 0.75));
    } else {
      newLen = Math.min(this.fullData.length, Math.ceil(currentLen / 0.75));
    }

    if (newLen === currentLen) return;

    // Anchor the zoom around the cursor position
    const pivotGlobal = this.winStart + frac * (currentLen - 1);
    let newStart = Math.round(pivotGlobal - frac * (newLen - 1));
    newStart = Math.max(0, Math.min(newStart, this.fullData.length - newLen));
    const newEnd = newStart + newLen - 1;

    this.winStart = newStart;
    this.winEnd = Math.min(newEnd, this.fullData.length - 1);

    this.hoverData = null;
    this.hideTooltip();
    this.drawBase();
    this.updateCursor();
  }
}

/** Active interactive chart instances keyed by modal type (for cleanup). */
const activeCharts = new Map<string, InteractiveChart>();

/**
 * Create (or replace) an InteractiveChart in the given parent.
 *
 * @param key     - Unique key for cleanup tracking (e.g. "graph-modal", "analytics").
 * @param parent  - DOM container to append the chart into.
 * @param data    - Chronological price array.
 * @param volumes - Optional matching volume array.
 * @param height  - CSS height string.
 * @returns The new InteractiveChart instance.
 */
function createInteractiveChart(
  key: string, parent: HTMLElement, data: number[],
  volumes: number[] = [], height = "200px",
): InteractiveChart {
  // Destroy any previous chart for this key
  const prev = activeCharts.get(key);
  if (prev) prev.destroy();

  const chart = new InteractiveChart(parent, height);
  chart.setData(data, volumes);
  activeCharts.set(key, chart);
  return chart;
}

/**
 * Destroy the interactive chart for a given key (called on modal hide).
 */
function destroyInteractiveChart(key: string): void {
  const chart = activeCharts.get(key);
  if (chart) {
    chart.destroy();
    activeCharts.delete(key);
  }
}

/**
 * Legacy wrapper — draw a chart on an existing single `<canvas>`.
 * Used by mini card sparkline-upgrade paths that still pass a bare canvas.
 * Creates a temporary non-interactive static render.
 *
 * @param canvas - The target `<canvas>` DOM element.
 * @param data   - Array of numeric price values in chronological order.
 */
function drawGraphChart(canvas: HTMLCanvasElement, data: number[]): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Accessible description for screen readers (WCAG 1.1.1).
  canvas.setAttribute("role", "img");
  if (data.length >= 2) {
    const first = data[0];
    const last = data[data.length - 1];
    const pctDelta = ((last - first) / first * 100).toFixed(1);
    const dir = last > first ? "up" : last < first ? "down" : "flat";
    canvas.setAttribute("aria-label",
      `Price chart: ${data.length} data points. Trend ${dir} ${pctDelta}% from ${axisLabel(first)} to ${axisLabel(last)} gp.`);
  } else {
    canvas.setAttribute("aria-label", "Price chart: insufficient data to display.");
  }

  const dpr = window.devicePixelRatio || 1;
  const cssW = canvas.offsetWidth || canvas.width;
  const cssH = canvas.offsetHeight || canvas.height;
  canvas.width = cssW * dpr;
  canvas.height = cssH * dpr;
  ctx.scale(dpr, dpr);

  // ── Resolve theme-aware colours once per draw ──
  const themeL = getChartThemeColors();

  if (data.length === 0) {
    ctx.font = '12px "Segoe UI", sans-serif';
    ctx.fillStyle = themeL.emptyText;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("No price history available", cssW / 2, cssH / 2);
    return;
  }
  if (data.length === 1) {
    ctx.font = '11px "Segoe UI", sans-serif';
    ctx.fillStyle = themeL.emptyText;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${axisLabel(data[0])} gp (1 day)`, cssW / 2, cssH / 2);
    return;
  }

  const { left: mL, right: mR, top: mT, bottom: mB } = CHART_MARGIN;
  const plotW = cssW - mL - mR;
  const plotH = cssH - mT - mB;

  const rawMin = Math.min(...data);
  const rawMax = Math.max(...data);
  const rawRange = rawMax - rawMin || 1;
  const pad = rawRange * 0.05;
  const min = rawMin - pad;
  const max = rawMax + pad;
  const range = max - min;
  const stepX = plotW / (data.length - 1);

  // Y-axis ticks + grid
  const tickValues: number[] = [];
  for (let i = 0; i <= CHART_Y_TICKS; i++) tickValues.push(min + (range * i) / CHART_Y_TICKS);
  const yPrec = axisLabelPrecision(rawMin, rawMax, CHART_Y_TICKS);
  ctx.font = '11px "Segoe UI", sans-serif';
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (const tv of tickValues) {
    const y = mT + plotH - ((tv - min) / range) * plotH;
    ctx.strokeStyle = themeL.gridLine;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(mL, y); ctx.lineTo(cssW - mR, y); ctx.stroke();
    ctx.fillStyle = themeL.axisText;
    ctx.fillText(axisLabel(tv, yPrec), mL - 6, y);
  }

  // X-axis labels (short dates, evenly spaced)
  ctx.textBaseline = "top";
  ctx.fillStyle = themeL.axisText;
  const SHORT_MONTHS_L = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const maxLabelsL = 6;
  const totalDaysL = data.length - 1;
  let dayIntervalL = Math.max(1, Math.ceil(totalDaysL / (maxLabelsL - 1)));
  const niceIntervalsL = [1, 2, 5, 7, 10, 14, 15, 30, 45, 60, 90];
  for (const ni of niceIntervalsL) {
    if (ni >= dayIntervalL) { dayIntervalL = ni; break; }
  }
  const labelIndicesL: number[] = [];
  for (let idx = totalDaysL; idx >= 0; idx -= dayIntervalL) {
    labelIndicesL.unshift(idx);
  }
  if (labelIndicesL[0] !== 0) labelIndicesL.unshift(0);

  const labelYL = cssH - mB + 8;
  for (let li = 0; li < labelIndicesL.length; li++) {
    const idx = labelIndicesL[li];
    const x = mL + idx * stepX;
    const daysAgo = data.length - 1 - idx;
    let label: string;
    if (daysAgo === 0) {
      label = "Today";
    } else {
      const d = new Date();
      d.setDate(d.getDate() - daysAgo);
      label = `${d.getDate()} ${SHORT_MONTHS_L[d.getMonth()]}`;
    }
    if (li === 0) {
      ctx.textAlign = "left";
    } else if (li === labelIndicesL.length - 1) {
      ctx.textAlign = "right";
    } else {
      ctx.textAlign = "center";
    }
    ctx.fillText(label, x, labelYL);
  }

  const toXY = (i: number): { x: number; y: number } => ({
    x: mL + i * stepX,
    y: mT + plotH - ((data[i] - min) / range) * plotH,
  });

  const first = data[0];
  const last = data[data.length - 1];
  const lineColour = last > first ? "#4ec9b0" : last < first ? "#f44747" : "#888888";

  // Gradient fill
  ctx.beginPath();
  ctx.moveTo(toXY(0).x, toXY(0).y);
  for (let i = 1; i < data.length; i++) { const p = toXY(i); ctx.lineTo(p.x, p.y); }
  ctx.lineTo(toXY(data.length - 1).x, mT + plotH);
  ctx.lineTo(toXY(0).x, mT + plotH);
  ctx.closePath();
  const grad = ctx.createLinearGradient(0, mT, 0, mT + plotH);
  grad.addColorStop(0, lineColour + "44");
  grad.addColorStop(1, lineColour + "08");
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.strokeStyle = lineColour;
  ctx.lineWidth = 2;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.beginPath();
  for (let i = 0; i < data.length; i++) {
    const p = toXY(i);
    if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();

  // Dots
  for (let i = 0; i < data.length; i++) {
    const p = toXY(i);
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = lineColour;
    ctx.fill();
    ctx.strokeStyle = themeL.dotStroke;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Legend (top-left, inside plot area)
  const legX = mL + 6;
  const legY = mT + 6;
  ctx.font = '10px "Segoe UI", sans-serif';
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.strokeStyle = lineColour;
  ctx.lineWidth = 2;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(legX, legY + 7);
  ctx.lineTo(legX + 16, legY + 7);
  ctx.stroke();
  ctx.fillStyle = themeL.legendText;
  ctx.fillText("Price", legX + 22, legY + 7);
}

/**
 * Render all market items in the current view mode.
 */
function renderMarketItems(items: RankedItem[]): void {
  els.marketItems.innerHTML = "";

  if (items.length === 0) {
    const empty = document.createElement("div");
    empty.className = "market-empty";
    empty.textContent = "No liquid items found.";
    els.marketItems.appendChild(empty);
    return;
  }

  for (const item of items) {
    els.marketItems.appendChild(buildItemCard(item));
  }
}

// ─── Favourites Panel ────────────────────────────────────────────────────────

/** Whether the favourites panel body is collapsed. */
let favoritesCollapsed = false;

/**
 * Fetch and render all favourited items into the #favorites-items container.
 * Hides the entire section when the set is empty.
 */
async function renderFavorites(): Promise<void> {
  const favNames = getFavorites();

  // Hide the section entirely when there are no favourites.
  if (favNames.size === 0) {
    els.favoritesSection.style.display = "none";
    return;
  }

  els.favoritesSection.style.display = "";

  // If collapsed, leave existing content in place (just show the header).
  if (favoritesCollapsed) return;

  const items = await analyzer.getItemsByNames(favNames);

  // Apply sort — use the favourites-specific dropdown.
  const favSort = els.favoritesSortSelect.value;
  applySortOrder(items, favSort);

  els.favoritesItems.innerHTML = "";
  els.favoritesItems.className = `market-items ${currentView}`;

  if (items.length === 0) {
    const empty = document.createElement("div");
    empty.className = "market-empty";
    empty.textContent = "Favourited items not yet in cache — try searching for them first.";
    els.favoritesItems.appendChild(empty);
    return;
  }

  for (const item of items) {
    els.favoritesItems.appendChild(buildItemCard(item));
  }
}

/** Bind the collapse/expand toggle for the favourites section header. */
function bindFavoritesCollapse(): void {
  els.favoritesCollapseBtn.addEventListener("click", () => {
    favoritesCollapsed = !favoritesCollapsed;
    els.favoritesCollapseBtn.textContent = favoritesCollapsed ? "▸" : "▾";
    els.favoritesItems.style.display = favoritesCollapsed ? "none" : "";
  });
}

const FAV_SORT_KEY = "ge-analyzer:fav-sort";

/** Restore the persisted favourites sort preference. */
function restoreFavSort(): void {
  const saved = localStorage.getItem(FAV_SORT_KEY);
  if (saved) els.favoritesSortSelect.value = saved;
}

/** Bind the favourites sort dropdown change event. */
function bindFavSort(): void {
  els.favoritesSortSelect.addEventListener("change", () => {
    localStorage.setItem(FAV_SORT_KEY, els.favoritesSortSelect.value);
    renderFavorites();
  });
}

/** Whether the Top 20 body is collapsed. */
let top20Collapsed = false;

/** Bind the collapse/expand toggle for the Top 20 section. */
function bindTop20Collapse(): void {
  els.top20CollapseBtn.addEventListener("click", () => {
    top20Collapsed = !top20Collapsed;
    els.top20CollapseBtn.textContent = top20Collapsed ? "▸" : "▾";
    const hide = top20Collapsed ? "none" : "";
    // Hide loading indicator and items list (filters are now global, above search).
    els.marketItems.style.display = hide;
    if (top20Collapsed) {
      els.marketLoading.style.display = "none";
    }
  });
}

/**
 * Render search results into the dedicated #search-results container.
 * Uses the same card builder as the Top 20.
 */
function renderSearchResults(items: RankedItem[]): void {
  els.searchResults.innerHTML = "";
  // Apply the same view-mode class so tile/hybrid layout works.
  els.searchResults.className = `market-items ${currentView}`;

  if (items.length === 0) {
    const empty = document.createElement("div");
    empty.className = "market-empty";
    empty.textContent = "No results found.";
    els.searchResults.appendChild(empty);
    return;
  }

  for (const item of items) {
    els.searchResults.appendChild(buildItemCard(item));
  }
}

/**
 * Create a single market item card element.  Works for all three view modes —
 * CSS handles the layout differences.  Each card is expandable on click.
 */
function buildItemCard(item: RankedItem): HTMLElement {
  const card = document.createElement("div");
  card.className = "market-card";
  if (item.isRisky) card.classList.add("risky");
  if (item.volumeSpikeMultiplier > 1.5) card.classList.add("hype");
  if (getFavorites().has(item.name)) card.classList.add("favorited");

  // ── Header (always visible) ──
  const header = document.createElement("div");
  header.className = "market-card-header";

  const img = document.createElement("img");
  img.className = "item-sprite";
  img.src = spriteUrl(item.itemId);
  img.alt = item.name;
  img.loading = "lazy";
  img.width = 36;
  img.height = 32;
  // Gracefully hide broken sprites.
  img.onerror = () => { img.style.display = "none"; };

  const nameEl = document.createElement("span");
  nameEl.className = "item-name";
  nameEl.textContent = item.name;

  const priceEl = document.createElement("span");
  priceEl.className = "item-price";
  priceEl.textContent = `${formatGpShort(item.price)} gp`;

  header.appendChild(img);
  header.appendChild(nameEl);
  header.appendChild(priceEl);

  // Flip recommendation badges.
  const flipWrap = document.createElement("span");
  flipWrap.className = "flip-badges";

  const buyBadge = document.createElement("span");
  buyBadge.className = "buy-badge";
  buyBadge.textContent = `Buy ≤ ${formatGpShort(item.recBuyPrice)}`;
  buyBadge.title = "Recommended buy offer — ~1% below the GE mid-price for a realistic instant-buy entry.";

  const sellBadge = document.createElement("span");
  sellBadge.className = `sell-badge${item.isRisky ? " risky" : ""}`;
  sellBadge.textContent = item.isRisky
    ? `⚠ Sell ≥ ${formatGpShort(item.recSellPrice)}`
    : `Sell ≥ ${formatGpShort(item.recSellPrice)}`;
  sellBadge.title = "Recommended sell price — ~3% above mid-price to cover the 2% GE tax and leave profit.";

  const profitBadge = document.createElement("span");
  profitBadge.className = `profit-badge${item.estFlipProfit <= 0 ? " negative" : ""}`;
  profitBadge.textContent = `${item.estFlipProfit > 0 ? "+" : ""}${formatGpShort(item.estFlipProfit)}/ea`;
  profitBadge.title = "Estimated profit per item after paying the 2% GE tax on the sale.";

  flipWrap.appendChild(buyBadge);
  flipWrap.appendChild(sellBadge);
  flipWrap.appendChild(profitBadge);

  // Trade velocity badge.
  const velocityBadge = document.createElement("span");
  const velocityCls: Record<string, string> = {
    "Insta-Flip": "velocity-insta",
    "Active": "velocity-active",
    "Slow": "velocity-slow",
    "Very Slow": "velocity-veryslow",
  };
  const velocityTip: Record<string, string> = {
    "Insta-Flip": "Very high hourly volume — offers typically fill within seconds to a few minutes.",
    "Active": "Solid hourly volume — expect fills within a few minutes to ~30 min.",
    "Slow": "Low hourly volume — may take 30 min to several hours to fill.",
    "Very Slow": "Very low hourly volume — fills can take many hours or may not complete in a 4 h window.",
  };
  velocityBadge.className = `velocity-badge ${velocityCls[item.tradeVelocity] ?? "velocity-slow"}`;
  velocityBadge.textContent = item.tradeVelocity;
  velocityBadge.title = velocityTip[item.tradeVelocity] ?? "";
  flipWrap.appendChild(velocityBadge);

  // Hype badge (only when volume spike detected).
  if (item.volumeSpikeMultiplier > 1.5) {
    const hypeBadge = document.createElement("span");
    hypeBadge.className = "hype-badge";
    hypeBadge.textContent = `\uD83D\uDD25 ${item.volumeSpikeMultiplier}x Vol`;
    flipWrap.appendChild(hypeBadge);
  }

  // Price trend badge (only for Uptrend / Downtrend — skip Stable).
  if (item.priceTrend === "Downtrend") {
    const trendBadge = document.createElement("span");
    trendBadge.className = "trend-badge trend-downtrend";
    trendBadge.textContent = "\u26A0\uFE0F Crashing";
    trendBadge.title = "Price has dropped more than 5% over the last 7 days \u2014 potential falling knife.";
    flipWrap.appendChild(trendBadge);
  } else if (item.priceTrend === "Uptrend") {
    const trendBadge = document.createElement("span");
    trendBadge.className = "trend-badge trend-uptrend";
    trendBadge.textContent = "\uD83D\uDCC8 Rising";
    trendBadge.title = "Price has risen more than 5% over the last 7 days \u2014 positive momentum.";
    flipWrap.appendChild(trendBadge);
  }

  // Usability enhancement – March 2026: predictive analytics badges.
  // Compact tiles toggle – hides these badges in tile/hybrid view – March 2026
  const showPredictiveBadges = !compactMode || currentView === "list";
  const predictiveWrap = document.createElement("span");
  predictiveWrap.className = "predictive-badges";
  if (compactMode && currentView !== "list") {
    predictiveWrap.classList.add("compact-hidden");
  }

  // EMA Trend badge.
  if (showPredictiveBadges && item.ema30d > 0 && item.price > 0) {
    const emaPct = ((item.price - item.ema30d) / item.ema30d) * 100;
    const emaDir = emaPct > 0 ? "up" : emaPct < 0 ? "down" : "";
    const emaBadge = document.createElement("span");
    emaBadge.className = `ema-badge ${emaDir}`;
    emaBadge.textContent = `EMA ${emaPct >= 0 ? "\u2191" : "\u2193"}${Math.abs(emaPct).toFixed(1)}%`;
    emaBadge.title = `30-day Exponential Moving Average: ${formatGpShort(Math.round(item.ema30d))} gp. Current price is ${Math.abs(emaPct).toFixed(1)}% ${emaPct >= 0 ? "above" : "below"} the EMA — ${emaPct > 2 ? "bullish signal" : emaPct < -2 ? "bearish signal" : "near average"}.`;
    predictiveWrap.appendChild(emaBadge);
  }

  // Predicted 24h badge.
  if (showPredictiveBadges && item.predictedNextPrice > 0 && item.price > 0) {
    const predPct = ((item.predictedNextPrice - item.price) / item.price) * 100;
    const predDir = predPct > 0.1 ? "up" : predPct < -0.1 ? "down" : "neutral";
    const predBadge = document.createElement("span");
    predBadge.className = `predicted-badge ${predDir}`;
    predBadge.textContent = `24h ${predPct >= 0 ? "+" : ""}${predPct.toFixed(1)}%`;
    predBadge.title = `Linear-regression predicted next-day price: ${formatGpShort(Math.round(item.predictedNextPrice))} gp. Based on the slope of recent price history (${item.linearSlope >= 0 ? "+" : ""}${formatGpShort(Math.round(item.linearSlope))} gp/day).`;
    predictiveWrap.appendChild(predBadge);
  }

  // Volatility badge.
  if (showPredictiveBadges && item.volatility > 0) {
    const volBadge = document.createElement("span");
    volBadge.className = "vol-badge";
    volBadge.textContent = `Vol ${(item.volatility * 100).toFixed(1)}%`;
    volBadge.title = `Daily price volatility: ${(item.volatility * 100).toFixed(1)}% std deviation of daily % changes. Higher values mean wider price swings — more risk but potentially faster flips.`;
    predictiveWrap.appendChild(volBadge);
  }

  if (predictiveWrap.childElementCount > 0) {
    flipWrap.appendChild(predictiveWrap);
  }

  header.appendChild(flipWrap);

  // Analytics button — opens the unified analytics modal.
  const analyticsBtn = document.createElement("button");
  analyticsBtn.className = "popout-btn";
  analyticsBtn.textContent = "\u2197";
  analyticsBtn.title = "View Analytics";
  analyticsBtn.setAttribute("aria-label", `View analytics for ${item.name}`);
  analyticsBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showAnalyticsModal(item);
  });
  // Favorite toggle button.
  const favBtn = document.createElement("button");
  favBtn.className = "fav-btn";
  favBtn.textContent = getFavorites().has(item.name) ? "\u2605" : "\u2606";
  favBtn.title = "Toggle favourite";
  favBtn.setAttribute("aria-label", `Toggle favourite for ${item.name}`);
  favBtn.setAttribute("aria-pressed", String(getFavorites().has(item.name)));
  favBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const nowFav = toggleFavorite(item.name);
    favBtn.textContent = nowFav ? "\u2605" : "\u2606";
    favBtn.setAttribute("aria-pressed", String(nowFav));
    card.classList.toggle("favorited", nowFav);
  });

  // Quick-add-to-portfolio button.
  const addFlipCardBtn = document.createElement("button");
  addFlipCardBtn.className = "quick-add-btn";
  addFlipCardBtn.textContent = "+";
  addFlipCardBtn.title = "Add to portfolio";
  addFlipCardBtn.setAttribute("aria-label", `Add ${item.name} to portfolio`);
  addFlipCardBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    quickAddToPortfolio(item);
  });

  // External link: RS3 Wiki.
  const wikiLink = document.createElement("a");
  wikiLink.className = "ext-link wiki-link";
  wikiLink.href = `https://runescape.wiki/w/${encodeURIComponent(item.name)}`;
  wikiLink.target = "_blank";
  wikiLink.rel = "noopener noreferrer";
  wikiLink.textContent = "Wiki";
  wikiLink.title = "Open on RS3 Wiki";
  wikiLink.addEventListener("click", (e) => e.stopPropagation());

  // External link: GE Database.
  const geLink = document.createElement("a");
  geLink.className = "ext-link ge-link";
  geLink.href = `https://secure.runescape.com/m=itemdb_rs/viewitem?obj=${item.itemId}`;
  geLink.target = "_blank";
  geLink.rel = "noopener noreferrer";
  geLink.textContent = "GE";
  geLink.title = "Open on GE Database";
  geLink.addEventListener("click", (e) => e.stopPropagation());

  // ── Inline alert popover (hidden until bell clicked) ──
  const alertPopover = document.createElement("div");
  alertPopover.className = "card-alert-popover";
  alertPopover.innerHTML =
    `<div class="card-alert-row">` +
      `<label>Buy \u2264 <input class="card-alert-buy" type="number" min="0" placeholder="gp" name="alert-buy" /></label>` +
    `</div>` +
    `<div class="card-alert-row">` +
      `<label>Sell \u2265 <input class="card-alert-sell" type="number" min="0" placeholder="gp" name="alert-sell" /></label>` +
    `</div>`;
  // Prevent card expand/collapse when interacting with the popover.
  alertPopover.addEventListener("click", (e) => e.stopPropagation());

  // Pre-fill existing alert thresholds.
  const existingAlert = getFavoriteAlerts(item.name);
  const popBuyInput = alertPopover.querySelector<HTMLInputElement>(".card-alert-buy")!;
  const popSellInput = alertPopover.querySelector<HTMLInputElement>(".card-alert-sell")!;
  if (existingAlert?.targetBuy) popBuyInput.value = String(existingAlert.targetBuy);
  if (existingAlert?.targetSell) popSellInput.value = String(existingAlert.targetSell);

  /** Persist inline alert values. Auto-favourites the item if thresholds are set. */
  const saveInlineAlerts = (): void => {
    const bv = popBuyInput.value ? Number(popBuyInput.value) : undefined;
    const sv = popSellInput.value ? Number(popSellInput.value) : undefined;
    if ((bv || sv) && !getFavorites().has(item.name)) {
      toggleFavorite(item.name);
      favBtn.textContent = "\u2605";
      card.classList.add("favorited");
    }
    setFavoriteAlerts(item.name, bv, sv);
    // Update bell active state.
    alertBtn.classList.toggle("alert-active", !!(bv || sv));
  };
  popBuyInput.addEventListener("change", saveInlineAlerts);
  popSellInput.addEventListener("change", saveInlineAlerts);

  // Bell button — toggles the inline alert popover.
  const alertBtn = document.createElement("button");
  alertBtn.className = "alert-btn";
  alertBtn.textContent = "\uD83D\uDD14";
  alertBtn.title = "Set price alerts";
  alertBtn.setAttribute("aria-label", `Set price alert for ${item.name}`);
  // Show active state if thresholds already exist.
  if (existingAlert?.targetBuy || existingAlert?.targetSell) {
    alertBtn.classList.add("alert-active");
  }
  alertBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = alertPopover.classList.toggle("open");
    // Close any other open popovers in the same list.
    if (isOpen) {
      card.parentElement?.querySelectorAll(".card-alert-popover.open").forEach((el) => {
        if (el !== alertPopover) el.classList.remove("open");
      });
    }
  });

  // Group action buttons in a horizontal row.
  const actions = document.createElement("span");
  actions.className = "card-actions";
  actions.appendChild(analyticsBtn);
  actions.appendChild(favBtn);
  actions.appendChild(alertBtn);
  actions.appendChild(addFlipCardBtn);
  actions.appendChild(wikiLink);
  actions.appendChild(geLink);
  header.appendChild(actions);

  // ── Detail panel (hidden until expanded) ──
  const detail = document.createElement("div");
  detail.className = "market-card-detail";
  detail.innerHTML = [
    `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["GE Price"]}">${DETAIL_LABELS["GE Price"]}</span><span class="detail-value">${item.price.toLocaleString("en-US")} gp</span></div>`,
    `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Rec. Buy Price"]}">${DETAIL_LABELS["Rec. Buy Price"]}</span><span class="detail-value buy-highlight">${item.recBuyPrice.toLocaleString("en-US")} gp</span></div>`,
    `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Rec. Sell Price"]}">${DETAIL_LABELS["Rec. Sell Price"]}</span><span class="detail-value sell-highlight">${item.recSellPrice.toLocaleString("en-US")} gp</span></div>`,
    `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Est. Flip Profit"]}">${DETAIL_LABELS["Est. Flip Profit"]}</span><span class="detail-value${item.estFlipProfit <= 0 ? " risky-text" : " profit-highlight"}">${item.estFlipProfit > 0 ? "+" : ""}${item.estFlipProfit.toLocaleString("en-US")} gp/ea</span></div>`,
    `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["24h Global Vol"]}">${DETAIL_LABELS["24h Global Vol"]}</span><span class="detail-value">${formatVolume(item.volume)}</span></div>`,
    `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Eff. Player Vol"]}">${DETAIL_LABELS["Eff. Player Vol"]}</span><span class="detail-value">${formatVolume(item.effectivePlayerVolume)}</span></div>`,
    item.volumeSpikeMultiplier > 1.5
      ? `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Volume Spike"]}">${DETAIL_LABELS["Volume Spike"]}</span><span class="detail-value hype-text">\uD83D\uDD25 ${item.volumeSpikeMultiplier}x above 7-day avg</span></div>`
      : "",
    `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Player Traded Val"]}">${DETAIL_LABELS["Player Traded Val"]}</span><span class="detail-value">${formatGpShort(item.tradedValue)} gp</span></div>`,
    `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Buy Limit (4h)"]}">${DETAIL_LABELS["Buy Limit (4h)"]}</span><span class="detail-value">${item.buyLimit != null ? item.buyLimit.toLocaleString("en-US") : "Unknown"}</span></div>`,
    `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Max Capital (4h)"]}">${DETAIL_LABELS["Max Capital (4h)"]}</span><span class="detail-value">${item.maxCapitalPer4H > 0 ? formatGpShort(item.maxCapitalPer4H) + " gp" : "Unknown"}</span></div>`,
    `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Tax Gap"]}">${DETAIL_LABELS["Tax Gap"]}</span><span class="detail-value${item.isRisky ? " risky-text" : ""}">${formatGpShort(item.taxGap)} gp${item.isRisky ? " ⚠ risky" : ""}</span></div>`,
    `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Est. Margin (2% tax)"]}">${DETAIL_LABELS["Est. Margin (2% tax)"]}</span><span class="detail-value">${formatGpShort(Math.round(item.price * 0.02))} gp</span></div>`,
  ].join("");

  // Make the card header keyboard-accessible (WCAG 2.1.1).
  header.tabIndex = 0;
  header.setAttribute("role", "button");
  header.setAttribute("aria-expanded", "false");

  // Toggle inline expand on click (multiple cards can be expanded).
  header.addEventListener("click", () => {
    const expanded = card.classList.toggle("expanded");
    header.setAttribute("aria-expanded", String(expanded));
  });

  header.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      header.click();
    }
  });

  card.appendChild(header);
  card.appendChild(alertPopover);
  card.appendChild(detail);
  return card;
}

// \u2500\u2500\u2500 Item Detail Modal \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

/** Lazily-created singleton modal container. */
let itemModal: HTMLElement | null = null;

/**
 * Create (once) and return the reusable floating modal element.
 * Structure:
 * ```
 * .item-modal-backdrop
 *   .item-modal
 *     .item-modal-header  (sprite + name + close btn)
 *     .item-modal-body    (badges, detail rows)
 * ```
 */
function ensureModal(): HTMLElement {
  if (itemModal) return itemModal;

  const backdrop = document.createElement("div");
  backdrop.className = "item-modal-backdrop";
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) hideItemModal();
  });

  const modal = document.createElement("div");
  modal.className = "item-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", "Item details");

  const mHeader = document.createElement("div");
  mHeader.className = "item-modal-header";
  mHeader.id = "item-modal-header";

  const closeBtn = document.createElement("button");
  closeBtn.className = "item-modal-close";
  closeBtn.textContent = "\u2715";
  closeBtn.setAttribute("aria-label", "Close item details");
  closeBtn.addEventListener("click", hideItemModal);

  const mBody = document.createElement("div");
  mBody.className = "item-modal-body";
  mBody.id = "item-modal-body";

  mHeader.appendChild(closeBtn);
  modal.appendChild(mHeader);
  modal.appendChild(mBody);
  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  itemModal = backdrop;
  return backdrop;
}

/**
 * Populate the floating modal with a specific item\u2019s data and show it.
 */
function showItemModal(item: RankedItem): void {
  const backdrop = ensureModal();
  const mHeader = backdrop.querySelector("#item-modal-header") as HTMLElement;
  const mBody = backdrop.querySelector("#item-modal-body") as HTMLElement;

  // Build header contents.
  const closeBtn = mHeader.querySelector(".item-modal-close") as HTMLElement;
  mHeader.innerHTML = "";

  const img = document.createElement("img");
  img.className = "item-sprite";
  img.src = spriteUrl(item.itemId);
  img.alt = item.name;
  img.width = 48;
  img.height = 42;
  img.onerror = () => { img.style.display = "none"; };

  const nameEl = document.createElement("span");
  nameEl.className = "item-modal-name";
  nameEl.textContent = item.name;

  const priceEl = document.createElement("span");
  priceEl.className = "item-price";
  priceEl.textContent = `${formatGpShort(item.price)} gp`;

  mHeader.appendChild(img);
  mHeader.appendChild(nameEl);
  mHeader.appendChild(priceEl);

  // Modal favourite toggle.
  const modalFavBtn = document.createElement("button");
  modalFavBtn.className = "fav-btn modal-fav-btn";
  modalFavBtn.textContent = getFavorites().has(item.name) ? "\u2605" : "\u2606";
  modalFavBtn.title = "Toggle favourite";
  modalFavBtn.addEventListener("click", () => {
    const nowFav = toggleFavorite(item.name);
    modalFavBtn.textContent = nowFav ? "\u2605" : "\u2606";
  });
  mHeader.appendChild(modalFavBtn);

  // Modal quick-add-to-portfolio.
  const modalAddBtn = document.createElement("button");
  modalAddBtn.className = "quick-add-btn modal-quick-add-btn";
  modalAddBtn.textContent = "+";
  modalAddBtn.title = "Add to portfolio";
  modalAddBtn.addEventListener("click", () => {
    hideItemModal();
    quickAddToPortfolio(item);
  });
  mHeader.appendChild(modalAddBtn);

  // External link: RS3 Wiki.
  const modalWikiLink = document.createElement("a");
  modalWikiLink.className = "ext-link wiki-link";
  modalWikiLink.href = `https://runescape.wiki/w/${encodeURIComponent(item.name)}`;
  modalWikiLink.target = "_blank";
  modalWikiLink.rel = "noopener noreferrer";
  modalWikiLink.textContent = "Wiki";
  modalWikiLink.title = "Open on RS3 Wiki";
  mHeader.appendChild(modalWikiLink);

  // External link: GE Database.
  const modalGeLink = document.createElement("a");
  modalGeLink.className = "ext-link ge-link";
  modalGeLink.href = `https://secure.runescape.com/m=itemdb_rs/viewitem?obj=${item.itemId}`;
  modalGeLink.target = "_blank";
  modalGeLink.rel = "noopener noreferrer";
  modalGeLink.textContent = "GE";
  modalGeLink.title = "Open on GE Database";
  mHeader.appendChild(modalGeLink);

  mHeader.appendChild(closeBtn);

  // Build body contents.
  const velocityClsMap: Record<string, string> = {
    "Insta-Flip": "velocity-insta",
    "Active": "velocity-active",
    "Slow": "velocity-slow",
    "Very Slow": "velocity-veryslow",
  };
  const badgesHtml = [
    `<span class="buy-badge" title="Suggested buy-offer price \u2014 ~1% below the GE mid-price for a realistic instant-buy entry.">Buy \u2264 ${formatGpShort(item.recBuyPrice)}</span>`,
    `<span class="sell-badge${item.isRisky ? " risky" : ""}" title="Suggested sell price \u2014 ~3% above mid-price to cover the 2% GE tax and leave profit.">Sell \u2265 ${formatGpShort(item.recSellPrice)}</span>`,
    `<span class="profit-badge${item.estFlipProfit <= 0 ? " negative" : ""}" title="Estimated profit per item after paying the 2% GE tax on the sale.">${item.estFlipProfit > 0 ? "+" : ""}${formatGpShort(item.estFlipProfit)}/ea</span>`,
    `<span class="velocity-badge ${velocityClsMap[item.tradeVelocity] ?? "velocity-slow"}" title="${{
      "Insta-Flip": "Very high hourly volume \u2014 offers typically fill within seconds to a few minutes.",
      "Active": "Solid hourly volume \u2014 expect fills within a few minutes to ~30 min.",
      "Slow": "Low hourly volume \u2014 may take 30 min to several hours to fill.",
      "Very Slow": "Very low hourly volume \u2014 fills can take many hours or may not complete in a 4 h window.",
    }[item.tradeVelocity] ?? ""}">${item.tradeVelocity}</span>`,
    item.volumeSpikeMultiplier > 1.5
      ? `<span class="hype-badge">\uD83D\uDD25 ${item.volumeSpikeMultiplier}x Vol</span>`
      : "",
    item.priceTrend === "Downtrend"
      ? `<span class="trend-badge trend-downtrend" title="Price has dropped more than 5% over the last 7 days \u2014 potential falling knife.">\u26A0\uFE0F Crashing</span>`
      : item.priceTrend === "Uptrend"
        ? `<span class="trend-badge trend-uptrend" title="Price has risen more than 5% over the last 7 days \u2014 positive momentum.">\uD83D\uDCC8 Rising</span>`
        : "",
  ].filter(Boolean).join("");

  const rows = [
    `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["GE Price"]}">${DETAIL_LABELS["GE Price"]}</span><span class="detail-value">${item.price.toLocaleString("en-US")} gp</span></div>`,
    `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Rec. Buy Price"]}">${DETAIL_LABELS["Rec. Buy Price"]}</span><span class="detail-value buy-highlight">${item.recBuyPrice.toLocaleString("en-US")} gp</span></div>`,
    `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Rec. Sell Price"]}">${DETAIL_LABELS["Rec. Sell Price"]}</span><span class="detail-value sell-highlight">${item.recSellPrice.toLocaleString("en-US")} gp</span></div>`,
    `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Est. Flip Profit"]}">${DETAIL_LABELS["Est. Flip Profit"]}</span><span class="detail-value${item.estFlipProfit <= 0 ? " risky-text" : " profit-highlight"}">${item.estFlipProfit > 0 ? "+" : ""}${item.estFlipProfit.toLocaleString("en-US")} gp/ea</span></div>`,
    `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["24h Global Vol"]}">${DETAIL_LABELS["24h Global Vol"]}</span><span class="detail-value">${formatVolume(item.volume)}</span></div>`,
    `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Eff. Player Vol"]}">${DETAIL_LABELS["Eff. Player Vol"]}</span><span class="detail-value">${formatVolume(item.effectivePlayerVolume)}</span></div>`,
    item.volumeSpikeMultiplier > 1.5
      ? `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Volume Spike"]}">${DETAIL_LABELS["Volume Spike"]}</span><span class="detail-value hype-text">\uD83D\uDD25 ${item.volumeSpikeMultiplier}x above 7-day avg</span></div>`
      : "",
    `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Player Traded Val"]}">${DETAIL_LABELS["Player Traded Val"]}</span><span class="detail-value">${formatGpShort(item.tradedValue)} gp</span></div>`,
    `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Buy Limit (4h)"]}">${DETAIL_LABELS["Buy Limit (4h)"]}</span><span class="detail-value">${item.buyLimit != null ? item.buyLimit.toLocaleString("en-US") : "Unknown"}</span></div>`,
    `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Max Capital (4h)"]}">${DETAIL_LABELS["Max Capital (4h)"]}</span><span class="detail-value">${item.maxCapitalPer4H > 0 ? formatGpShort(item.maxCapitalPer4H) + " gp" : "Unknown"}</span></div>`,
    `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Tax Gap"]}">${DETAIL_LABELS["Tax Gap"]}</span><span class="detail-value${item.isRisky ? " risky-text" : ""}">${formatGpShort(item.taxGap)} gp${item.isRisky ? " \u26a0 risky" : ""}</span></div>`,
    `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Est. Margin (2% tax)"]}">${DETAIL_LABELS["Est. Margin (2% tax)"]}</span><span class="detail-value">${formatGpShort(Math.round(item.price * 0.02))} gp</span></div>`,
  ].filter(Boolean).join("");

  mBody.innerHTML =
    `<div class="item-modal-badges">${badgesHtml}</div>` +
    `<div class="item-modal-details">${rows}</div>` +
    `<div class="alert-inputs">` +
      `<h4 class="alert-inputs-title">\uD83D\uDD14 Price Alerts</h4>` +
      `<div class="alert-row">` +
        `<label for="modal-alert-buy">Alert if drops below</label>` +
        `<input id="modal-alert-buy" type="number" min="0" placeholder="Buy target (gp)" />` +
      `</div>` +
      `<div class="alert-row">` +
        `<label for="modal-alert-sell">Alert if rises above</label>` +
        `<input id="modal-alert-sell" type="number" min="0" placeholder="Sell target (gp)" />` +
      `</div>` +
    `</div>`;

  // ── Price alert inputs ──────────────────────────────────────────────────
  const alertBuyInput = mBody.querySelector<HTMLInputElement>("#modal-alert-buy")!;
  const alertSellInput = mBody.querySelector<HTMLInputElement>("#modal-alert-sell")!;

  // Pre-fill with existing alert thresholds (if any).
  const existing = getFavoriteAlerts(item.name);
  if (existing?.targetBuy) alertBuyInput.value = String(existing.targetBuy);
  if (existing?.targetSell) alertSellInput.value = String(existing.targetSell);

  /** Persist alert values on change. Auto-favourites the item if thresholds are set. */
  const saveAlertValues = (): void => {
    const buyVal = alertBuyInput.value ? Number(alertBuyInput.value) : undefined;
    const sellVal = alertSellInput.value ? Number(alertSellInput.value) : undefined;

    // Setting an alert implicitly favourites the item.
    if ((buyVal || sellVal) && !getFavorites().has(item.name)) {
      toggleFavorite(item.name);
      // Update the modal's favourite button.
      const favBtn = itemModal?.querySelector(".modal-fav-btn");
      if (favBtn) favBtn.textContent = "\u2605";
    }

    setFavoriteAlerts(item.name, buyVal, sellVal);
  };

  alertBuyInput.addEventListener("change", saveAlertValues);
  alertSellInput.addEventListener("change", saveAlertValues);

  backdrop.classList.add("visible");
}

/** Hide the floating item detail modal. */
function hideItemModal(): void {
  if (itemModal) itemModal.classList.remove("visible");
}

// \u2500\u2500\u2500 Graph Modal \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

/** Lazily-created singleton graph modal container. */
let graphModal: HTMLElement | null = null;

/** Create (once) and return the reusable graph modal element. */
function ensureGraphModal(): HTMLElement {
  if (graphModal) return graphModal;

  const backdrop = document.createElement("div");
  backdrop.className = "graph-modal-backdrop";
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) {
      for (const chart of activeCharts.values()) {
        if (chart.wasDragging()) return;
      }
      hideGraphModal();
    }
  });

  const modal = document.createElement("div");
  modal.className = "graph-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", "Price chart");

  const mHeader = document.createElement("div");
  mHeader.className = "graph-modal-header";
  mHeader.id = "graph-modal-header";

  const closeBtn = document.createElement("button");
  closeBtn.className = "item-modal-close";
  closeBtn.textContent = "\u2715";
  closeBtn.setAttribute("aria-label", "Close price chart");
  closeBtn.addEventListener("click", hideGraphModal);
  mHeader.appendChild(closeBtn);

  const mBody = document.createElement("div");
  mBody.className = "graph-modal-body";
  mBody.id = "graph-modal-body";

  modal.appendChild(mHeader);
  modal.appendChild(mBody);
  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  graphModal = backdrop;
  return backdrop;
}

// Usability fix: on-demand history for graphs – March 2026

/**
 * Ensure the IndexedDB cache has sufficient history for an item, fetching
 * from the Weird Gloop API on demand if needed.
 *
 * @param itemName - Canonical RS3 item name.
 * @param days     - Desired history depth (default 90 — always fetch the
 *                   maximum so shorter ranges are covered too).
 * @returns Chronological daily prices (oldest-first, excluding today) within
 *          the requested window, or an empty array on failure.
 */
async function ensureItemHistory(itemName: string, days: number = 90): Promise<number[]> {
  // 1. Check the cache first.
  const cached = await cache.getHistoricalRecords(itemName, days);
  if (cached.length >= 7) {
    // Sufficient data already cached — return prices oldest-first.
    return cached.map((r) => r.price);
  }

  // 2. Cache is sparse or empty — fetch from API and persist.
  try {
    const api = new WeirdGloopService();
    const historyMap = await api.fetchHistoricalPrices([itemName], days);
    if (historyMap.size > 0) {
      await cache.bulkInsertHistory(historyMap);
    }

    // 3. Re-read from cache (now populated) to get normalised records.
    const fresh = await cache.getHistoricalRecords(itemName, days);
    return fresh.map((r) => r.price);
  } catch (err) {
    console.warn(`[ensureItemHistory] Failed for "${itemName}":`, err);
    // Return whatever partial cache data we had.
    return cached.map((r) => r.price);
  }
}

/**
 * Fetch price history for a single item, preferring the IndexedDB cache and
 * falling back to a direct API call.  The returned array is filtered to the
 * requested range (7 / 30 / 90 days).
 *
 * @param name  - Canonical RS3 item name.
 * @param range - Number of days: 7, 30, or 90.  Defaults to 7.
 * @returns Chronological daily prices (excluding today) or an empty array on failure.
 */
async function fetchItemHistory(name: string, range: number = 7): Promise<number[]> {
  // ensureItemHistory always fetches 90 days; we slice to the requested range afterward.
  const allPrices = await ensureItemHistory(name, 90);
  if (allPrices.length === 0) return [];

  // Client-side trim to requested range.
  if (range >= 90 || allPrices.length <= range) return allPrices;
  return allPrices.slice(-range);
}

/**
 * Like {@link fetchItemHistory} but returns both prices and volumes
 * so charts can render volume bars.
 */
async function fetchItemHistoryFull(
  name: string, range: number = 7,
): Promise<{ prices: number[]; volumes: number[] }> {
  // Ensure the cache is populated (reuse existing helper).
  await ensureItemHistory(name, 90);

  // Read full records from cache to get both price + volume.
  const records = await cache.getHistoricalRecords(name, 90);
  if (records.length === 0) return { prices: [], volumes: [] };

  // Records are oldest-first.  Trim to requested range.
  const sliced = (range < 90 && records.length > range)
    ? records.slice(-range) : records;

  return {
    prices: sliced.map(r => r.price),
    volumes: sliced.map(r => r.volume ?? 0),
  };
}

/**
 * Refresh the graph modal chart with a new history range.
 * Called when the in-modal range dropdown changes.
 */
// Usability fix: on-demand history for graphs – March 2026
async function refreshItemGraph(item: RankedItem, range: number): Promise<void> {
  const backdrop = ensureGraphModal();
  const mBody = backdrop.querySelector("#graph-modal-body") as HTMLElement;

  // Destroy previous chart while fetching.
  destroyInteractiveChart("graph-modal");

  let fetched: { prices: number[]; volumes: number[] };
  try {
    fetched = await fetchItemHistoryFull(item.name, range);
  } catch {
    showToast("History unavailable \u2014 could not fetch price data.", "info");
    fetched = { prices: [], volumes: [] };
  }
  const hist = fetched.prices.length > 0 ? [...fetched.prices, item.price] : [item.price];
  const histVols = fetched.volumes.length > 0 ? [...fetched.volumes, 0] : [];

  const hasData = hist.length >= 2;
  const currentPrice = item.price;
  const oldestPrice = hasData ? hist[0] : currentPrice;
  const highPrice = hasData ? Math.max(...hist) : currentPrice;
  const lowPrice = hasData ? Math.min(...hist) : currentPrice;
  const pctChange = oldestPrice > 0 ? ((currentPrice - oldestPrice) / oldestPrice) * 100 : 0;
  const absChange = currentPrice - oldestPrice;
  const volatility = hasData ? ((highPrice - lowPrice) / lowPrice) * 100 : 0;

  const trendLabel = pctChange < -5 ? "Downtrend" : pctChange > 5 ? "Uptrend" : "Stable";
  const trendColour = trendLabel === "Uptrend" ? "var(--accent-green-bright, #4ec9b0)"
    : trendLabel === "Downtrend" ? "var(--accent-red, #f44747)" : "var(--text-muted, #888)";
  const trendIcon = trendLabel === "Uptrend" ? "\uD83D\uDCC8" : trendLabel === "Downtrend" ? "\u26A0\uFE0F" : "\u27A1\uFE0F";

  // Preserve range dropdown and update stats.
  const statsEl = mBody.querySelector(".graph-stats") as HTMLElement;
  if (statsEl) {
    statsEl.innerHTML =
      statCardHtml("graph-stat-row", `${range}-Day Trend`, `${trendIcon} ${trendLabel}`, "Trend", `color:${trendColour}`) +
      statCardHtml("graph-stat-row", "Change", `${absChange >= 0 ? "+" : ""}${formatGpShort(absChange)} gp (${pctChange >= 0 ? "+" : ""}${pctChange.toFixed(1)}%)`, "Change", `color:${trendColour}`) +
      statCardHtml("graph-stat-row", "Current Price", `${currentPrice.toLocaleString("en-US")} gp`, "Current Price") +
      statCardHtml("graph-stat-row", `${range}-Day High`, `${highPrice.toLocaleString("en-US")} gp`, "High") +
      statCardHtml("graph-stat-row", `${range}-Day Low`, `${lowPrice.toLocaleString("en-US")} gp`, "Low") +
      statCardHtml("graph-stat-row", "Volatility", `${volatility.toFixed(1)}%`, "Volatility") +
      statCardHtml("graph-stat-row", "Data Points", `${hist.length} day${hist.length !== 1 ? "s" : ""}`, "Data Points");
  }

  // Manual history refresh fallback – March 2026
  // Update history-status visibility after range refresh.
  const statusEl = mBody.querySelector<HTMLElement>(".graph-history-status");
  const chartSlot = mBody.querySelector<HTMLElement>(".chart-slot");
  if (hist.length < 7) {
    statusEl?.classList.add("visible");
    if (chartSlot) chartSlot.style.display = "none";
  } else {
    statusEl?.classList.remove("visible");
    if (chartSlot) chartSlot.style.display = "";
  }

  requestAnimationFrame(() => {
    if (chartSlot && hist.length >= 2) {
      createInteractiveChart("graph-modal", chartSlot, hist, histVols, "180px");
    }
  });
}

/**
 * Populate the graph modal with a specific item\u2019s price chart and
 * momentum analytics, then show it.
 *
 * Uses the cache-first {@link ensureItemHistory} flow: checks IndexedDB for
 * existing history, fetches from the Weird Gloop API on demand if fewer than
 * 7 data points are cached, then persists the result for future use.
 */
// Usability fix: on-demand history for graphs – March 2026
async function showGraphModal(item: RankedItem): Promise<void> {
  const backdrop = ensureGraphModal();
  const mHeader = backdrop.querySelector("#graph-modal-header") as HTMLElement;
  const mBody = backdrop.querySelector("#graph-modal-body") as HTMLElement;

  // Read the current range from the market-filters dropdown.
  const range = parseInt(els.historyRangeSelect.value, 10) || 7;

  // \u2500\u2500 Header \u2500\u2500
  const closeBtn = mHeader.querySelector(".item-modal-close") as HTMLElement;
  mHeader.innerHTML = "";

  const img = document.createElement("img");
  img.className = "item-sprite";
  img.src = spriteUrl(item.itemId);
  img.alt = item.name;
  img.width = 36;
  img.height = 32;
  img.onerror = () => { img.style.display = "none"; };

  const title = document.createElement("span");
  title.className = "graph-modal-title";
  title.textContent = `${item.name} \u2014 Price Chart`;

  mHeader.appendChild(img);
  mHeader.appendChild(title);
  mHeader.appendChild(closeBtn);

  // ── On-demand history fetch (cache-first, API fallback) ──
  // Usability fix: on-demand history for graphs – March 2026
  mBody.innerHTML = `<div class="graph-loading-msg" style="text-align:center;padding:24px;color:#888;">Checking cached history\u2026</div>`;
  backdrop.classList.add("visible");

  // Quick cache probe to decide loading message.
  const cachedCount = (await cache.getHistoricalRecords(item.name, 90)).length;
  if (cachedCount < 7) {
    const loadingEl = mBody.querySelector(".graph-loading-msg");
    if (loadingEl) loadingEl.textContent = "Fetching price history\u2026";
  }

  let fetched: { prices: number[]; volumes: number[] };
  try {
    fetched = await fetchItemHistoryFull(item.name, range);
  } catch {
    showToast("History unavailable \u2014 could not fetch price data.", "info");
    fetched = { prices: [], volumes: [] };
  }
  const hist = fetched.prices.length > 0 ? [...fetched.prices, item.price] : (item.priceHistory.length >= 2 ? item.priceHistory : [item.price]);
  const histVols = fetched.volumes.length > 0 ? [...fetched.volumes, 0] : [];
  const hasData = hist.length >= 2;

  // Update item priceHistory if we got fresh data and range is 7d.
  if (fetched.prices.length > 0 && range <= 7) {
    item.priceHistory = [...fetched.prices, item.price];
    if (item.priceHistory.length >= 2 && item.priceHistory[0] > 0) {
      const pct = (item.price - item.priceHistory[0]) / item.priceHistory[0];
      item.priceTrend = pct < -0.05 ? "Downtrend" : pct > 0.05 ? "Uptrend" : "Stable";
    }
  }

  // Compute momentum stats.
  const currentPrice = item.price;
  const oldestPrice = hasData ? hist[0] : currentPrice;
  const highPrice = hasData ? Math.max(...hist) : currentPrice;
  const lowPrice = hasData ? Math.min(...hist) : currentPrice;
  const pctChange = oldestPrice > 0 ? ((currentPrice - oldestPrice) / oldestPrice) * 100 : 0;
  const absChange = currentPrice - oldestPrice;
  const volatility = hasData ? ((highPrice - lowPrice) / lowPrice) * 100 : 0;

  // Trend direction and colour.
  const trendLabel = pctChange < -5 ? "Downtrend" : pctChange > 5 ? "Uptrend" : "Stable";
  const trendColour = trendLabel === "Uptrend" ? "var(--accent-green-bright, #4ec9b0)"
    : trendLabel === "Downtrend" ? "var(--accent-red, #f44747)" : "var(--text-muted, #888)";
  const trendIcon = trendLabel === "Uptrend" ? "\uD83D\uDCC8" : trendLabel === "Downtrend" ? "\u26A0\uFE0F" : "\u27A1\uFE0F";

  // Build range selector row inside the modal.
  const rangeOptions = [7, 30, 90].map((d) =>
    `<option value="${d}"${d === range ? " selected" : ""}>History: ${d} days</option>`
  ).join("");

  // Manual history refresh fallback – March 2026
  const insufficientData = hist.length < 7;

  mBody.innerHTML =
    `<div class="graph-modal-range-row">` +
      `<label>Range: <select class="graph-range-inline" name="graph-range">${rangeOptions}</select></label>` +
    `</div>` +
    `<div class="chart-slot"${insufficientData ? ' style="display:none"' : ''}></div>` +
    `<div class="graph-history-status${insufficientData ? ' visible' : ''}">` +
      `Insufficient history \u2022 ` +
      `<button class="refresh-history-btn">Refresh</button>` +
    `</div>` +
    `<div class="graph-stats">` +
      statCardHtml("graph-stat-row", `${range}-Day Trend`, `${trendIcon} ${trendLabel}`, "Trend", `color:${trendColour}`) +
      statCardHtml("graph-stat-row", "Change", `${absChange >= 0 ? "+" : ""}${formatGpShort(absChange)} gp (${pctChange >= 0 ? "+" : ""}${pctChange.toFixed(1)}%)`, "Change", `color:${trendColour}`) +
      statCardHtml("graph-stat-row", "Current Price", `${currentPrice.toLocaleString("en-US")} gp`, "Current Price") +
      statCardHtml("graph-stat-row", `${range}-Day High`, `${highPrice.toLocaleString("en-US")} gp`, "High") +
      statCardHtml("graph-stat-row", `${range}-Day Low`, `${lowPrice.toLocaleString("en-US")} gp`, "Low") +
      statCardHtml("graph-stat-row", "Volatility", `${volatility.toFixed(1)}%`, "Volatility") +
      statCardHtml("graph-stat-row", "Data Points", `${hist.length} day${hist.length !== 1 ? "s" : ""}`, "Data Points") +
    `</div>`;

  // Bind inline range dropdown.
  const inlineRange = mBody.querySelector<HTMLSelectElement>(".graph-range-inline");
  if (inlineRange) {
    inlineRange.addEventListener("change", () => {
      const newRange = parseInt(inlineRange.value, 10) || 7;
      // Sync the global dropdown.
      els.historyRangeSelect.value = String(newRange);
      refreshItemGraph(item, newRange);
    });
  }

  // Manual history refresh fallback – March 2026
  bindRefreshHistoryBtn(mBody, item);

  // Create the interactive chart after the modal is in the DOM.
  requestAnimationFrame(() => {
    const slot = mBody.querySelector<HTMLElement>(".chart-slot");
    if (slot && !insufficientData) {
      createInteractiveChart("graph-modal", slot, hist, histVols, "180px");
    }
  });
}

// Manual history refresh fallback – March 2026
/**
 * Bind the “Refresh” button inside `.graph-history-status` so users can
 * manually fetch missing history for low-volume / post-scan items.
 */
function bindRefreshHistoryBtn(container: HTMLElement, item: RankedItem): void {
  const btn = container.querySelector<HTMLButtonElement>(".refresh-history-btn");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    btn.disabled = true;
    btn.textContent = "Fetching\u2026";

    try {
      await ensureItemHistory(item.name, 90);
      const range = parseInt(
        (container.querySelector<HTMLSelectElement>(".graph-range-inline")?.value) || "7", 10
      );

      // refreshItemGraph re-reads from cache with volumes and recreates the chart.
      await refreshItemGraph(item, range);
    } catch {
      showToast("Failed to load history", "info");
      btn.textContent = "Refresh";
      btn.disabled = false;
    }
  });
}

/** Hide the graph modal and clean up the interactive chart. */
function hideGraphModal(): void {
  if (graphModal) graphModal.classList.remove("visible");
  destroyInteractiveChart("graph-modal");
}

// ─── Unified Analytics Modal – combines details + graph – March 2026 ────────

/** Lazily-created singleton analytics modal container. */
let analyticsModal: HTMLElement | null = null;

/** Create (once) and return the reusable analytics modal backdrop + shell. */
function ensureAnalyticsModal(): HTMLElement {
  if (analyticsModal) return analyticsModal;

  const backdrop = document.createElement("div");
  backdrop.className = "analytics-modal-backdrop";
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) {
      // Don't close if user just finished dragging the chart and released outside
      for (const chart of activeCharts.values()) {
        if (chart.wasDragging()) return;
      }
      hideAnalyticsModal();
    }
  });

  const modal = document.createElement("div");
  modal.className = "analytics-modal";
  modal.id = "analytics-modal";
  // Trap focus inside modal for accessibility.
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "analytics-modal-title");

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  // Global keyboard handler: Escape to close + focus trap (WCAG 2.4.3).
  document.addEventListener("keydown", (e) => {
    if (!backdrop.classList.contains("visible")) return;
    if (e.key === "Escape") {
      hideAnalyticsModal();
      return;
    }
    // Focus trap: cycle Tab within the modal.
    if (e.key === "Tab") {
      const focusable = modal.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
  });

  analyticsModal = backdrop;
  return backdrop;
}

/** The element that had focus before the analytics modal opened. */
let analyticsModalTrigger: HTMLElement | null = null;

/** Hide the unified analytics modal and return focus to the trigger. */
function hideAnalyticsModal(): void {
  if (analyticsModal) analyticsModal.classList.remove("visible");
  destroyInteractiveChart("analytics");
  if (analyticsModalTrigger) {
    analyticsModalTrigger.focus();
    analyticsModalTrigger = null;
  }
}

/**
 * Show the unified analytics modal for a given item.
 * Combines item details (badges, recommendations, alert setup, actions) with
 * the interactive price-history chart and trend stats — all in one scrollable
 * overlay.
 *
 * @param item - The ranked item to display.
 */
async function showAnalyticsModal(item: RankedItem): Promise<void> {
  // Save trigger element for focus restoration (WCAG 2.4.3).
  analyticsModalTrigger = document.activeElement as HTMLElement | null;

  const backdrop = ensureAnalyticsModal();
  const modal = backdrop.querySelector("#analytics-modal") as HTMLElement;

  // Read the current range from the market-filters dropdown.
  const range = parseInt(els.historyRangeSelect.value, 10) || 7;

  // Show loading state immediately.
  modal.innerHTML = "";

  // ── Header ──────────────────────────────────────────────────────────────
  const header = document.createElement("div");
  header.className = "analytics-modal-header";

  const img = document.createElement("img");
  img.className = "item-sprite";
  img.src = spriteUrl(item.itemId);
  img.alt = item.name;
  img.width = 48;
  img.height = 42;
  img.loading = "lazy";
  img.title = `Item ID: ${item.itemId}`;
  img.onerror = () => { img.style.display = "none"; };

  const nameEl = document.createElement("span");
  nameEl.className = "analytics-modal-name";
  nameEl.id = "analytics-modal-title";
  nameEl.textContent = item.name;

  const priceEl = document.createElement("span");
  priceEl.className = "analytics-modal-price";
  priceEl.textContent = `${formatGpShort(item.price)} gp`;

  const closeBtn = document.createElement("button");
  closeBtn.className = "analytics-modal-close";
  closeBtn.textContent = "\u2715";
  closeBtn.title = "Close (Esc)";
  closeBtn.setAttribute("aria-label", "Close analytics modal");
  closeBtn.addEventListener("click", hideAnalyticsModal);

  header.appendChild(img);
  header.appendChild(nameEl);
  header.appendChild(priceEl);
  header.appendChild(closeBtn);

  // ── Content wrapper ────────────────────────────────────────────────────
  const content = document.createElement("div");
  content.className = "analytics-content";

  // ── Badges ──────────────────────────────────────────────────────────────
  const velocityClsMap: Record<string, string> = {
    "Insta-Flip": "velocity-insta",
    "Active": "velocity-active",
    "Slow": "velocity-slow",
    "Very Slow": "velocity-veryslow",
  };
  const velocityTipMap: Record<string, string> = {
    "Insta-Flip": "Very high hourly volume \u2014 offers typically fill within seconds to a few minutes.",
    "Active": "Solid hourly volume \u2014 expect fills within a few minutes to ~30 min.",
    "Slow": "Low hourly volume \u2014 may take 30 min to several hours to fill.",
    "Very Slow": "Very low hourly volume \u2014 fills can take many hours or may not complete in a 4 h window.",
  };

  const badgesHtml = [
    `<span class="buy-badge" title="Suggested buy-offer price \u2014 ~1% below the GE mid-price for a realistic instant-buy entry.">Buy \u2264 ${formatGpShort(item.recBuyPrice)}</span>`,
    `<span class="sell-badge${item.isRisky ? " risky" : ""}" title="Suggested sell price \u2014 ~3% above mid-price to cover the 2% GE tax and leave profit.">Sell \u2265 ${formatGpShort(item.recSellPrice)}</span>`,
    `<span class="profit-badge${item.estFlipProfit <= 0 ? " negative" : ""}" title="Estimated profit per item after paying the 2% GE tax on the sale.">${item.estFlipProfit > 0 ? "+" : ""}${formatGpShort(item.estFlipProfit)}/ea</span>`,
    `<span class="velocity-badge ${velocityClsMap[item.tradeVelocity] ?? "velocity-slow"}" title="${velocityTipMap[item.tradeVelocity] ?? ""}">${item.tradeVelocity}</span>`,
    item.volumeSpikeMultiplier > 1.5
      ? `<span class="hype-badge">\uD83D\uDD25 ${item.volumeSpikeMultiplier}x Vol</span>`
      : "",
    item.priceTrend === "Downtrend"
      ? `<span class="trend-badge trend-downtrend" title="Price has dropped more than 5% over the last 7 days.">\u26A0\uFE0F Crashing</span>`
      : item.priceTrend === "Uptrend"
        ? `<span class="trend-badge trend-uptrend" title="Price has risen more than 5% over the last 7 days.">\uD83D\uDCC8 Rising</span>`
        : "",
  ].filter(Boolean).join("");

  const badgesEl = document.createElement("div");
  badgesEl.className = "analytics-badges";
  badgesEl.innerHTML = badgesHtml;
  content.appendChild(badgesEl);

  // ── Action buttons ──────────────────────────────────────────────────────
  const actionsEl = document.createElement("div");
  actionsEl.className = "analytics-actions";

  // Favourite toggle.
  const modalFavBtn = document.createElement("button");
  modalFavBtn.className = "fav-btn modal-fav-btn";
  modalFavBtn.textContent = getFavorites().has(item.name) ? "\u2605" : "\u2606";
  modalFavBtn.title = "Toggle favourite";
  modalFavBtn.addEventListener("click", () => {
    const nowFav = toggleFavorite(item.name);
    modalFavBtn.textContent = nowFav ? "\u2605" : "\u2606";
  });
  actionsEl.appendChild(modalFavBtn);

  // Quick-add-to-portfolio.
  const modalAddBtn = document.createElement("button");
  modalAddBtn.className = "quick-add-btn modal-quick-add-btn";
  modalAddBtn.textContent = "+";
  modalAddBtn.title = "Add to portfolio";
  modalAddBtn.addEventListener("click", () => {
    hideAnalyticsModal();
    quickAddToPortfolio(item);
  });
  actionsEl.appendChild(modalAddBtn);

  // External link: RS3 Wiki.
  const modalWikiLink = document.createElement("a");
  modalWikiLink.className = "ext-link wiki-link";
  modalWikiLink.href = `https://runescape.wiki/w/${encodeURIComponent(item.name)}`;
  modalWikiLink.target = "_blank";
  modalWikiLink.rel = "noopener noreferrer";
  modalWikiLink.textContent = "Wiki";
  modalWikiLink.title = "Open on RS3 Wiki";
  actionsEl.appendChild(modalWikiLink);

  // External link: GE Database.
  const modalGeLink = document.createElement("a");
  modalGeLink.className = "ext-link ge-link";
  modalGeLink.href = `https://secure.runescape.com/m=itemdb_rs/viewitem?obj=${item.itemId}`;
  modalGeLink.target = "_blank";
  modalGeLink.rel = "noopener noreferrer";
  modalGeLink.textContent = "GE";
  modalGeLink.title = "Open on GE Database";
  actionsEl.appendChild(modalGeLink);

  content.appendChild(actionsEl);

  // ── Detail rows ─────────────────────────────────────────────────────────
  const detailsTitle = document.createElement("h3");
  detailsTitle.className = "analytics-section-title";
  detailsTitle.textContent = "Market Details";
  content.appendChild(detailsTitle);

  const detailRows = [
    `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["GE Price"]}">${DETAIL_LABELS["GE Price"]}</span><span class="detail-value">${item.price.toLocaleString("en-US")} gp</span></div>`,
    `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Rec. Buy Price"]}">${DETAIL_LABELS["Rec. Buy Price"]}</span><span class="detail-value buy-highlight">${item.recBuyPrice.toLocaleString("en-US")} gp</span></div>`,
    `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Rec. Sell Price"]}">${DETAIL_LABELS["Rec. Sell Price"]}</span><span class="detail-value sell-highlight">${item.recSellPrice.toLocaleString("en-US")} gp</span></div>`,
    `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Est. Flip Profit"]}">${DETAIL_LABELS["Est. Flip Profit"]}</span><span class="detail-value${item.estFlipProfit <= 0 ? " risky-text" : " profit-highlight"}">${item.estFlipProfit > 0 ? "+" : ""}${item.estFlipProfit.toLocaleString("en-US")} gp/ea</span></div>`,
    `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["High Alch"]}">${DETAIL_LABELS["High Alch"]}</span><span class="detail-value">${typeof item.highAlch === "number" ? item.highAlch.toLocaleString("en-US") + " gp" : item.highAlch === false ? "Not Alchable" : "Unknown"}</span></div>`,
    `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Tax Gap"]}">${DETAIL_LABELS["Tax Gap"]}</span><span class="detail-value${item.isRisky ? " risky-text" : ""}">${formatGpShort(item.taxGap)} gp${item.isRisky ? " \u26a0 risky" : ""}</span></div>`,
    `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Est. Margin (2% tax)"]}">${DETAIL_LABELS["Est. Margin (2% tax)"]}</span><span class="detail-value">${formatGpShort(Math.round(item.price * 0.02))} gp</span></div>`,
    `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["24h Global Vol"]}">${DETAIL_LABELS["24h Global Vol"]}</span><span class="detail-value">${formatVolume(item.volume)}</span></div>`,
    `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Eff. Player Vol"]}">${DETAIL_LABELS["Eff. Player Vol"]}</span><span class="detail-value">${formatVolume(item.effectivePlayerVolume)}</span></div>`,
    `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Volume Spike"]}">${DETAIL_LABELS["Volume Spike"]}</span><span class="detail-value${item.volumeSpikeMultiplier > 1.5 ? " hype-text" : ""}">${item.volumeSpikeMultiplier > 1.5 ? "\uD83D\uDD25 " + item.volumeSpikeMultiplier + "x above 7-day avg" : "Normal"}</span></div>`,
    `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Player Traded Val"]}">${DETAIL_LABELS["Player Traded Val"]}</span><span class="detail-value">${formatGpShort(item.tradedValue)} gp</span></div>`,
    `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Buy Limit (4h)"]}">${DETAIL_LABELS["Buy Limit (4h)"]}</span><span class="detail-value">${item.buyLimit != null ? item.buyLimit.toLocaleString("en-US") : "Unknown"}</span></div>`,
    `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Max Capital (4h)"]}">${DETAIL_LABELS["Max Capital (4h)"]}</span><span class="detail-value">${item.maxCapitalPer4H > 0 ? formatGpShort(item.maxCapitalPer4H) + " gp" : "Unknown"}</span></div>`,
  ].join("");

  const detailsGrid = document.createElement("div");
  detailsGrid.className = "analytics-details-grid";
  detailsGrid.innerHTML = detailRows;
  content.appendChild(detailsGrid);

  // ── Predictive Analytics ─────────────────────────────────────────────────
  const predTitle = document.createElement("h3");
  predTitle.className = "analytics-section-title";
  predTitle.textContent = "Predictive Analytics";
  content.appendChild(predTitle);

  const emaPct = item.ema30d > 0 && item.price > 0
    ? ((item.price - item.ema30d) / item.ema30d) * 100
    : 0;
  const emaSignal = emaPct > 2 ? "bullish" : emaPct < -2 ? "bearish" : "neutral";
  const predPct = item.predictedNextPrice > 0 && item.price > 0
    ? ((item.predictedNextPrice - item.price) / item.price) * 100
    : 0;

  const predRows = [
    `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["30d EMA"]}">${DETAIL_LABELS["30d EMA"]}</span><span class="detail-value">${item.ema30d > 0 ? formatGpShort(Math.round(item.ema30d)) + " gp (" + (emaPct >= 0 ? "+" : "") + emaPct.toFixed(1) + "% " + emaSignal + ")" : "Insufficient data"}</span></div>`,
    `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Daily Volatility"]}">${DETAIL_LABELS["Daily Volatility"]}</span><span class="detail-value">${item.volatility > 0 ? (item.volatility * 100).toFixed(1) + "%" : "Insufficient data"}</span></div>`,
    `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["LR Slope"]}">${DETAIL_LABELS["LR Slope"]}</span><span class="detail-value">${item.linearSlope !== 0 ? (item.linearSlope >= 0 ? "+" : "") + formatGpShort(Math.round(item.linearSlope)) + " gp/day" : "Insufficient data"}</span></div>`,
    `<div class="detail-row"><span class="detail-label" title="${DETAIL_TIPS["Predicted Price"]}">${DETAIL_LABELS["Predicted Price"]}</span><span class="detail-value">${item.predictedNextPrice > 0 ? formatGpShort(Math.round(item.predictedNextPrice)) + " gp (" + (predPct >= 0 ? "+" : "") + predPct.toFixed(1) + "%)" : "Insufficient data"}</span></div>`,
  ].join("");

  const predGrid = document.createElement("div");
  predGrid.className = "analytics-details-grid";
  predGrid.innerHTML =
    `<div class="analytics-section-divider">Predictive Analytics</div>` +
    `<div class="predictive-section">${predRows}</div>`;
  content.appendChild(predGrid);

  // ── Price alerts ────────────────────────────────────────────────────────
  const alertSection = document.createElement("div");
  alertSection.className = "alert-inputs";
  alertSection.innerHTML =
    `<h4 class="alert-inputs-title">\uD83D\uDD14 Price Alerts</h4>` +
    `<div class="alert-row">` +
      `<label for="analytics-alert-buy">Alert if drops below</label>` +
      `<input id="analytics-alert-buy" type="number" min="0" placeholder="Buy target (gp)" />` +
    `</div>` +
    `<div class="alert-row">` +
      `<label for="analytics-alert-sell">Alert if rises above</label>` +
      `<input id="analytics-alert-sell" type="number" min="0" placeholder="Sell target (gp)" />` +
    `</div>`;
  content.appendChild(alertSection);

  // ── Price History section ───────────────────────────────────────────────
  const graphTitle = document.createElement("h3");
  graphTitle.className = "analytics-section-title";
  graphTitle.textContent = "Price History";
  content.appendChild(graphTitle);

  const graphSection = document.createElement("div");
  graphSection.className = "analytics-graph-section";
  graphSection.innerHTML =
    `<div class="analytics-range-row">` +
      `<label>Range: <select class="graph-range-inline" name="graph-range">` +
        [7, 30, 90].map((d) =>
          `<option value="${d}"${d === range ? " selected" : ""}>History: ${d} days</option>`
        ).join("") +
      `</select></label>` +
    `</div>` +
    `<div class="graph-loading-msg" style="text-align:center;padding:24px;color:#888;">Checking cached history\u2026</div>`;
  content.appendChild(graphSection);

  // ── Assemble and show ──────────────────────────────────────────────────
  modal.appendChild(header);
  modal.appendChild(content);
  backdrop.classList.add("visible");

  // Focus the close button for keyboard accessibility.
  closeBtn.focus();

  // ── Wire alert inputs ──────────────────────────────────────────────────
  const alertBuyInput = alertSection.querySelector<HTMLInputElement>("#analytics-alert-buy")!;
  const alertSellInput = alertSection.querySelector<HTMLInputElement>("#analytics-alert-sell")!;

  const existing = getFavoriteAlerts(item.name);
  if (existing?.targetBuy) alertBuyInput.value = String(existing.targetBuy);
  if (existing?.targetSell) alertSellInput.value = String(existing.targetSell);

  const saveAlertValues = (): void => {
    const buyVal = alertBuyInput.value ? Number(alertBuyInput.value) : undefined;
    const sellVal = alertSellInput.value ? Number(alertSellInput.value) : undefined;
    if ((buyVal || sellVal) && !getFavorites().has(item.name)) {
      toggleFavorite(item.name);
      modalFavBtn.textContent = "\u2605";
    }
    setFavoriteAlerts(item.name, buyVal, sellVal);
  };
  alertBuyInput.addEventListener("change", saveAlertValues);
  alertSellInput.addEventListener("change", saveAlertValues);

  // ── Async: fetch history & render graph ─────────────────────────────────
  const cachedCount = (await cache.getHistoricalRecords(item.name, 90)).length;
  const loadingEl = graphSection.querySelector(".graph-loading-msg") as HTMLElement;
  if (cachedCount < 7 && loadingEl) {
    loadingEl.textContent = "Fetching price history\u2026";
  }

  let fetched: { prices: number[]; volumes: number[] };
  try {
    fetched = await fetchItemHistoryFull(item.name, range);
  } catch {
    showToast("History unavailable \u2014 could not fetch price data.", "info");
    fetched = { prices: [], volumes: [] };
  }
  const hist = fetched.prices.length > 0
    ? [...fetched.prices, item.price]
    : (item.priceHistory.length >= 2 ? item.priceHistory : [item.price]);
  const histVols = fetched.volumes.length > 0
    ? [...fetched.volumes, 0] : [];
  const hasData = hist.length >= 2;

  // Update item priceHistory if we got fresh data and range is 7d.
  if (fetched.prices.length > 0 && range <= 7) {
    item.priceHistory = [...fetched.prices, item.price];
    if (item.priceHistory.length >= 2 && item.priceHistory[0] > 0) {
      const pct = (item.price - item.priceHistory[0]) / item.priceHistory[0];
      item.priceTrend = pct < -0.05 ? "Downtrend" : pct > 0.05 ? "Uptrend" : "Stable";
    }
  }

  // Compute momentum stats.
  const currentPrice = item.price;
  const oldestPrice = hasData ? hist[0] : currentPrice;
  const highPrice = hasData ? Math.max(...hist) : currentPrice;
  const lowPrice = hasData ? Math.min(...hist) : currentPrice;
  const pctChange = oldestPrice > 0 ? ((currentPrice - oldestPrice) / oldestPrice) * 100 : 0;
  const absChange = currentPrice - oldestPrice;
  const volatility = hasData ? ((highPrice - lowPrice) / lowPrice) * 100 : 0;

  const trendLabel = pctChange < -5 ? "Downtrend" : pctChange > 5 ? "Uptrend" : "Stable";
  const trendColour = trendLabel === "Uptrend" ? "var(--accent-green-bright, #4ec9b0)"
    : trendLabel === "Downtrend" ? "var(--accent-red, #f44747)" : "var(--text-muted, #888)";
  const trendIcon = trendLabel === "Uptrend" ? "\uD83D\uDCC8" : trendLabel === "Downtrend" ? "\u26A0\uFE0F" : "\u27A1\uFE0F";

  const insufficientData = hist.length < 7;

  // Replace loading message with chart + stats.
  graphSection.innerHTML =
    `<div class="analytics-range-row">` +
      `<label>Range: <select class="graph-range-inline" name="graph-range">` +
        [7, 30, 90].map((d) =>
          `<option value="${d}"${d === range ? " selected" : ""}>History: ${d} days</option>`
        ).join("") +
      `</select></label>` +
    `</div>` +
    `<div class="chart-slot"${insufficientData ? ' style="display:none"' : ''}></div>` +
    `<div class="graph-history-status${insufficientData ? ' visible' : ''}">` +
      `Insufficient history \u2022 ` +
      `<button class="refresh-history-btn">Refresh</button>` +
    `</div>` +
    `<div class="analytics-stats-grid">` +
      statCardHtml("analytics-stat-card", `${range}-Day Trend`, `${trendIcon} ${trendLabel}`, "Trend", `color:${trendColour}`) +
      statCardHtml("analytics-stat-card", "Change", `${absChange >= 0 ? "+" : ""}${formatGpShort(absChange)} gp (${pctChange >= 0 ? "+" : ""}${pctChange.toFixed(1)}%)`, "Change", `color:${trendColour}`) +
      statCardHtml("analytics-stat-card", "Current Price", `${currentPrice.toLocaleString("en-US")} gp`, "Current Price") +
      statCardHtml("analytics-stat-card", `${range}-Day High`, `${highPrice.toLocaleString("en-US")} gp`, "High") +
      statCardHtml("analytics-stat-card", `${range}-Day Low`, `${lowPrice.toLocaleString("en-US")} gp`, "Low") +
      statCardHtml("analytics-stat-card", "Volatility", `${volatility.toFixed(1)}%`, "Volatility") +
      statCardHtml("analytics-stat-card", "Data Points", `${hist.length} day${hist.length !== 1 ? "s" : ""}`, "Data Points") +
    `</div>`;

  // Bind inline range dropdown.
  const inlineRange = graphSection.querySelector<HTMLSelectElement>(".graph-range-inline");
  if (inlineRange) {
    inlineRange.addEventListener("change", () => {
      const newRange = parseInt(inlineRange.value, 10) || 7;
      els.historyRangeSelect.value = String(newRange);
      refreshAnalyticsGraph(item, graphSection, newRange);
    });
  }

  // Bind manual refresh button.
  bindAnalyticsRefreshBtn(graphSection, item);

  // Create the interactive chart.
  requestAnimationFrame(() => {
    const slot = graphSection.querySelector<HTMLElement>(".chart-slot");
    if (slot && !insufficientData) {
      createInteractiveChart("analytics", slot, hist, histVols);
    }
  });
}

/**
 * Refresh the analytics modal graph section with a new range.
 * Called when the in-modal range dropdown changes.
 */
async function refreshAnalyticsGraph(
  item: RankedItem,
  graphSection: HTMLElement,
  range: number,
): Promise<void> {
  // Destroy previous chart while fetching.
  destroyInteractiveChart("analytics");

  let fetched: { prices: number[]; volumes: number[] };
  try {
    fetched = await fetchItemHistoryFull(item.name, range);
  } catch {
    showToast("History unavailable \u2014 could not fetch price data.", "info");
    fetched = { prices: [], volumes: [] };
  }
  const hist = fetched.prices.length > 0 ? [...fetched.prices, item.price] : [item.price];
  const histVols = fetched.volumes.length > 0 ? [...fetched.volumes, 0] : [];

  const hasData = hist.length >= 2;
  const currentPrice = item.price;
  const oldestPrice = hasData ? hist[0] : currentPrice;
  const highPrice = hasData ? Math.max(...hist) : currentPrice;
  const lowPrice = hasData ? Math.min(...hist) : currentPrice;
  const pctChange = oldestPrice > 0 ? ((currentPrice - oldestPrice) / oldestPrice) * 100 : 0;
  const absChange = currentPrice - oldestPrice;
  const volatility = hasData ? ((highPrice - lowPrice) / lowPrice) * 100 : 0;

  const trendLabel = pctChange < -5 ? "Downtrend" : pctChange > 5 ? "Uptrend" : "Stable";
  const trendColour = trendLabel === "Uptrend" ? "var(--accent-green-bright, #4ec9b0)"
    : trendLabel === "Downtrend" ? "var(--accent-red, #f44747)" : "var(--text-muted, #888)";
  const trendIcon = trendLabel === "Uptrend" ? "\uD83D\uDCC8" : trendLabel === "Downtrend" ? "\u26A0\uFE0F" : "\u27A1\uFE0F";

  // Update stats grid.
  const statsGrid = graphSection.querySelector(".analytics-stats-grid");
  if (statsGrid) {
    statsGrid.innerHTML =
      statCardHtml("analytics-stat-card", `${range}-Day Trend`, `${trendIcon} ${trendLabel}`, "Trend", `color:${trendColour}`) +
      statCardHtml("analytics-stat-card", "Change", `${absChange >= 0 ? "+" : ""}${formatGpShort(absChange)} gp (${pctChange >= 0 ? "+" : ""}${pctChange.toFixed(1)}%)`, "Change", `color:${trendColour}`) +
      statCardHtml("analytics-stat-card", "Current Price", `${currentPrice.toLocaleString("en-US")} gp`, "Current Price") +
      statCardHtml("analytics-stat-card", `${range}-Day High`, `${highPrice.toLocaleString("en-US")} gp`, "High") +
      statCardHtml("analytics-stat-card", `${range}-Day Low`, `${lowPrice.toLocaleString("en-US")} gp`, "Low") +
      statCardHtml("analytics-stat-card", "Volatility", `${volatility.toFixed(1)}%`, "Volatility") +
      statCardHtml("analytics-stat-card", "Data Points", `${hist.length} day${hist.length !== 1 ? "s" : ""}`, "Data Points");
  }

  // Update history-status visibility after range refresh.
  const statusEl = graphSection.querySelector<HTMLElement>(".graph-history-status");
  const chartSlot = graphSection.querySelector<HTMLElement>(".chart-slot");
  if (hist.length < 7) {
    statusEl?.classList.add("visible");
    if (chartSlot) chartSlot.style.display = "none";
  } else {
    statusEl?.classList.remove("visible");
    if (chartSlot) chartSlot.style.display = "";
  }

  requestAnimationFrame(() => {
    if (chartSlot && hist.length >= 2) {
      createInteractiveChart("analytics", chartSlot, hist, histVols);
    }
  });
}

/**
 * Bind the "Refresh" button in the analytics modal's graph section.
 */
function bindAnalyticsRefreshBtn(graphSection: HTMLElement, item: RankedItem): void {
  const btn = graphSection.querySelector<HTMLButtonElement>(".refresh-history-btn");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    btn.disabled = true;
    btn.textContent = "Fetching\u2026";

    try {
      await ensureItemHistory(item.name, 90);
      const range = parseInt(
        (graphSection.querySelector<HTMLSelectElement>(".graph-range-inline")?.value) || "7", 10
      );

      // refreshAnalyticsGraph re-reads from cache with volumes and recreates the chart.
      await refreshAnalyticsGraph(item, graphSection, range);
    } catch {
      showToast("Failed to load history", "info");
      btn.textContent = "Refresh";
      btn.disabled = false;
    }
  });
}

/**
 * Render an array of {@link RankedItem} as `<li>` elements inside the
 * `#top-items-list` container.
 * @deprecated Use {@link renderMarketItems} instead.
 */
function renderItemList(items: RankedItem[]): void {
  renderMarketItems(items);
}

// ─── Chat Interface ─────────────────────────────────────────────────────────

function bindChatEvents(): void {
  els.chatSendBtn.addEventListener("click", handleSend);
  els.chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });
}

/**
 * Build (or rebuild) the shared {@link LLMService} instance from the
 * current persisted settings.  Called lazily on first send and whenever
 * the settings change.
 */
function ensureLLMService(): LLMService {
  const apiKey = (localStorage.getItem(LS_API_KEY) ?? "").trim();
  const config = { apiKey, ...resolvedLLMConfig() };

  if (!llm) {
    llm = new LLMService(config);
  }
  return llm;
}

/**
 * Handle a "Send" action: validate inputs, orchestrate the RAG pipeline,
 * and render the result.
 */
async function handleSend(): Promise<void> {
  const query = els.chatInput.value.trim();
  if (!query) return;

  const apiKey = (localStorage.getItem(LS_API_KEY) ?? "").trim();
  const providerId = localStorage.getItem(LS_PROVIDER) ?? LLM_PROVIDERS[0].id;
  if (!apiKey && providerId !== "custom") {
    appendMessage("error", "No API key configured. Open ⚙ Settings and save a key first.");
    return;
  }

  // Show the user message and clear the input.
  appendMessage("user", query);
  els.chatInput.value = "";

  // Disable controls while waiting.
  setInputLock(true);
  const thinkingEl = appendMessage("thinking", "Thinking");

  try {
    const service = ensureLLMService();
    const advice = await service.generateAdvice(
      query,
      latestLLMContext || latestMarketSummary,
    );
    removeMessage(thinkingEl);
    appendMessage("assistant", advice);

    // Persist conversation after a successful exchange.
    persistChatHistory();
  } catch (err) {
    removeMessage(thinkingEl);
    if (err instanceof LLMRequestError) {
      console.error(`[UIService] LLM error (HTTP ${err.status}):`, err.message);
      appendMessage("error", formatLLMError(err));
    } else {
      console.error("[UIService] Chat pipeline error:", err);
      appendMessage("error", `Unexpected error — see browser console.`);
    }
  } finally {
    setInputLock(false);
    scrollChatToBottom();
  }
}

// ─── Chat helpers ───────────────────────────────────────────────────────────

/**
 * Append a styled message bubble to the chat history.
 *
 * @param kind - Visual style: `"user"` | `"assistant"` | `"system"` |
 *               `"error"` | `"thinking"`.
 * @param text - Message body.
 * @returns The created DOM element (useful for later removal of the thinking
 *          indicator).
 */
function appendMessage(
  kind: "user" | "assistant" | "system" | "error" | "thinking",
  text: string
): HTMLDivElement {
  const div = document.createElement("div");
  div.className = `chat-msg ${kind}`;
  div.textContent = text;
  els.chatHistory.appendChild(div);
  scrollChatToBottom();
  return div;
}

/**
 * Remove a message element from the chat history (e.g. the thinking indicator).
 */
function removeMessage(el: HTMLElement): void {
  el.remove();
}

/**
 * Scroll the chat history container to the very bottom.
 */
function scrollChatToBottom(): void {
  els.chatHistory.scrollTop = els.chatHistory.scrollHeight;
}

/**
 * Lock or unlock the chat input + send button to prevent duplicate submissions.
 */
function setInputLock(locked: boolean): void {
  els.chatInput.disabled = locked;
  els.chatSendBtn.disabled = locked;
}

/**
 * Produce a user-friendly error string from an {@link LLMRequestError}.
 */
function formatLLMError(err: LLMRequestError): string {
  switch (err.status) {
    case 401:
      return "Authentication failed — double-check your API key in ⚙ Settings.";
    case 403:
      return "Access denied — your API key may lack the required permissions.";
    case 429:
      return "Rate limited — the API quota has been exceeded. Wait a moment and try again.";
    default:
      return err.status >= 500
        ? "The LLM provider is experiencing issues. Try again later."
        : `LLM request failed (HTTP ${err.status}). Check the console for details.`;
  }
}

// ─── Portfolio ──────────────────────────────────────────────────────────────

/**
 * Bind the "Add Flip" form in the portfolio view.
 * Validates inputs, delegates to {@link PortfolioService.addFlip}, and
 * re-renders the flip list.
 */
function bindPortfolio(): void {
  els.addFlipBtn.addEventListener("click", handleAddFlip);

  // Allow Enter to submit from any portfolio input.
  const inputs = [els.flipItemName, els.flipBuyPrice, els.flipQuantity, els.flipSellPrice];
  for (const inp of inputs) {
    inp.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        // If the autocomplete dropdown is open and an item is highlighted,
        // Enter selects it instead of submitting the form.
        if (inp === els.flipItemName && els.flipSuggestions.classList.contains("open")) {
          const hl = els.flipSuggestions.querySelector(".highlighted") as HTMLElement | null;
          if (hl) { hl.click(); return; }
        }
        handleAddFlip();
      }
    });
  }

  // ── Item name autocomplete ────────────────────────────────────────────
  bindItemAutocomplete();
}

/**
 * Bind the portfolio sub-navigation toggle (Active Flips ↔ History & Stats).
 */
function bindPortfolioSubNav(): void {
  els.portfolioActiveBtn.addEventListener("click", () => {
    els.portfolioActiveBtn.classList.add("active");
    els.portfolioHistoryBtn.classList.remove("active");
    els.portfolioActiveBtn.setAttribute("aria-selected", "true");
    els.portfolioHistoryBtn.setAttribute("aria-selected", "false");
    els.portfolioActiveContainer.style.display = "";
    els.portfolioHistoryContainer.style.display = "none";
  });

  els.portfolioHistoryBtn.addEventListener("click", () => {
    els.portfolioHistoryBtn.classList.add("active");
    els.portfolioActiveBtn.classList.remove("active");
    els.portfolioHistoryBtn.setAttribute("aria-selected", "true");
    els.portfolioActiveBtn.setAttribute("aria-selected", "false");
    els.portfolioHistoryContainer.style.display = "";
    els.portfolioActiveContainer.style.display = "none";

    // Refresh stats and history list each time the tab is opened.
    renderCompletedFlips();
  });
}

/** Index of the currently keyboard-highlighted suggestion (−1 = none). */
let acHighlight = -1;

/**
 * Wire up the item-name input as an autocomplete search field.
 *
 * - **Focus / empty input** — shows all `latestTopItems` (already filtered by
 *   the user's volume & budget criteria).
 * - **Typing** — narrows the list with a case-insensitive substring match.
 * - **Arrow keys** — navigate highlighted items; **Enter** selects.
 * - **Click** a suggestion — fills item name + buy price, focuses Qty.
 * - **Click outside / Escape** — closes the dropdown.
 */
function bindItemAutocomplete(): void {
  const input = els.flipItemName;
  const list = els.flipSuggestions;

  // Populate on focus (shows full filtered list when input is empty).
  input.addEventListener("focus", () => updateSuggestions());

  // Filter as the user types.
  input.addEventListener("input", () => updateSuggestions());

  // Keyboard navigation inside the dropdown.
  input.addEventListener("keydown", (e) => {
    if (!list.classList.contains("open")) return;

    const items = list.querySelectorAll<HTMLElement>(".autocomplete-item");
    if (items.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      acHighlight = Math.min(acHighlight + 1, items.length - 1);
      highlightSuggestion(items);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      acHighlight = Math.max(acHighlight - 1, 0);
      highlightSuggestion(items);
    } else if (e.key === "Escape") {
      closeItemSuggestions();
    }
  });

  // Close when clicking outside the autocomplete area.
  document.addEventListener("mousedown", (e) => {
    if (!list.contains(e.target as Node) && e.target !== input) {
      closeItemSuggestions();
    }
  });
}

/**
 * Rebuild the suggestion dropdown.
 *
 * - **Empty input / focus**: shows the recommended items from
 *   {@link latestTopItems} (already filtered by the user's volume & budget
 *   criteria) first, then the rest of the cached catalogue.
 * - **Typing**: searches **all** cached items by case-insensitive
 *   substring match, with recommended matches pinned to the top.
 */
function updateSuggestions(): void {
  // Skip if a programmatic fill (e.g. quick-add) is in progress.
  if (suppressAutocomplete) return;

  const input = els.flipItemName;
  const list = els.flipSuggestions;
  const query = input.value.trim().toLowerCase();

  list.innerHTML = "";
  acHighlight = -1;

  // Names in the recommended set for quick lookup.
  const recommendedNames = new Set(latestTopItems.map((i) => i.name));

  if (query.length === 0) {
    // No search text — show recommended items, then remaining catalogue.
    if (latestTopItems.length > 0) {
      appendSectionHeader(list, "Recommended (filtered)");
      for (const item of latestTopItems) {
        appendSuggestionRow(list, item.name, item.price);
      }
    }

    const others = allCachedItems.filter((i) => !recommendedNames.has(i.name));
    if (others.length > 0) {
      appendSectionHeader(list, "All items");
      for (const item of others) {
        appendSuggestionRow(list, item.name, item.price);
      }
    }

    if (latestTopItems.length === 0 && allCachedItems.length === 0) {
      appendEmptyHint(list, "No market data loaded");
    }
  } else {
    // Search mode — match across the full catalogue.
    const recMatches: { name: string; price: number }[] = [];
    const otherMatches: { name: string; price: number }[] = [];

    for (const item of allCachedItems) {
      if (item.name.toLowerCase().includes(query)) {
        if (recommendedNames.has(item.name)) {
          recMatches.push(item);
        } else {
          otherMatches.push(item);
        }
      }
    }

    if (recMatches.length === 0 && otherMatches.length === 0) {
      appendEmptyHint(list, "No matching items");
    } else {
      if (recMatches.length > 0) {
        appendSectionHeader(list, "Recommended");
        for (const item of recMatches) {
          appendSuggestionRow(list, item.name, item.price);
        }
      }
      if (otherMatches.length > 0) {
        if (recMatches.length > 0) appendSectionHeader(list, "All items");
        for (const item of otherMatches) {
          appendSuggestionRow(list, item.name, item.price);
        }
      }
    }
  }

  list.classList.add("open");
}

/** Append a non-interactive section header row to the dropdown. */
function appendSectionHeader(container: HTMLElement, label: string): void {
  const hdr = document.createElement("div");
  hdr.className = "autocomplete-section";
  hdr.textContent = label;
  container.appendChild(hdr);
}

/** Append a clickable item row to the suggestion dropdown. */
function appendSuggestionRow(
  container: HTMLElement,
  name: string,
  price: number,
): void {
  const row = document.createElement("div");
  row.className = "autocomplete-item";

  const nameSpan = document.createElement("span");
  nameSpan.textContent = name;

  const priceSpan = document.createElement("span");
  priceSpan.className = "autocomplete-item-price";
  priceSpan.textContent = `${formatGpShort(price)} gp`;

  row.appendChild(nameSpan);
  row.appendChild(priceSpan);

  row.addEventListener("mousedown", (e) => {
    e.preventDefault();
    selectSuggestion(name, price);
  });

  container.appendChild(row);
}

/** Append an italicised empty-state hint to the dropdown. */
function appendEmptyHint(container: HTMLElement, text: string): void {
  const el = document.createElement("div");
  el.className = "autocomplete-empty";
  el.textContent = text;
  container.appendChild(el);
}

/** Apply the keyboard highlight to the nth suggestion row. */
function highlightSuggestion(items: NodeListOf<HTMLElement>): void {
  items.forEach((el, i) => el.classList.toggle("highlighted", i === acHighlight));

  // Scroll the highlighted item into view within the dropdown.
  if (acHighlight >= 0 && acHighlight < items.length) {
    items[acHighlight].scrollIntoView({ block: "nearest" });
  }
}

/**
 * Fill the form when a suggestion is selected (click or Enter).
 * Auto-populates the buy price from market data and focuses the Qty field.
 */
function selectSuggestion(name: string, price: number): void {
  els.flipItemName.value = name;
  els.flipBuyPrice.value = String(price);
  closeItemSuggestions();
  els.flipQuantity.focus();
}

/** Close the autocomplete dropdown and reset highlight state. */
function closeItemSuggestions(): void {
  els.flipSuggestions.classList.remove("open");
  els.flipSuggestions.innerHTML = "";
  acHighlight = -1;
}

/** Validate the add-flip form fields and create a new flip. */
function handleAddFlip(): void {
  closeItemSuggestions();
  const itemName = els.flipItemName.value.trim();
  const buyPrice = Number(els.flipBuyPrice.value);
  const quantity = Number(els.flipQuantity.value);
  const sellPrice = Number(els.flipSellPrice.value);

  if (!itemName) { showToast("Please enter an item name.", "info"); els.flipItemName.focus(); return; }
  if (!buyPrice || buyPrice <= 0) { showToast("Please enter a valid buy price.", "info"); els.flipBuyPrice.focus(); return; }
  if (!quantity || quantity <= 0) { showToast("Please enter a valid quantity.", "info"); els.flipQuantity.focus(); return; }
  if (!sellPrice || sellPrice <= 0) { showToast("Please enter a valid sell price.", "info"); els.flipSellPrice.focus(); return; }

  portfolio.addFlip(itemName, buyPrice, quantity, sellPrice);
  showToast(`Flip added: ${itemName}`, "buy");

  // Clear the form.
  els.flipItemName.value = "";
  els.flipBuyPrice.value = "";
  els.flipQuantity.value = "";
  els.flipSellPrice.value = "";

  // Blur the name input so the autocomplete dropdown doesn't reopen.
  els.flipItemName.blur();

  renderFlips();
}

/**
 * Render all active flips from the portfolio service into the DOM.
 * Each card shows: item name, buy/sell prices, quantity, projected profit
 * (post-tax), and a live buy-limit countdown timer.
 */
function renderFlips(): void {
  const container = els.activeFlipsList;
  container.innerHTML = "";

  const flips = portfolio.getFlips();

  if (flips.length === 0) {
    const empty = document.createElement("div");
    empty.className = "portfolio-empty";
    empty.textContent = "No active flips. Use the form above to track one.";
    container.appendChild(empty);
    return;
  }

  for (const flip of flips) {
    container.appendChild(buildFlipCard(flip));
  }
}

/**
 * Build a single flip card DOM element.
 */
function buildFlipCard(flip: ActiveFlip): HTMLElement {
  const card = document.createElement("div");
  card.className = "flip-card";
  card.dataset.flipId = flip.id;

  const msElapsed = Date.now() - flip.timestamp;
  const limitReady = msElapsed >= BUY_LIMIT_WINDOW_MS;
  if (limitReady) card.classList.add("limit-ready");

  // ── Top row: name + remove button ──
  const top = document.createElement("div");
  top.className = "flip-card-top";

  const nameEl = document.createElement("span");
  nameEl.className = "flip-item-name";
  nameEl.textContent = flip.itemName;

  const removeBtn = document.createElement("button");
  removeBtn.className = "flip-remove-btn";
  removeBtn.type = "button";
  removeBtn.textContent = "✕";
  removeBtn.title = "Remove flip";
  removeBtn.setAttribute("aria-label", `Remove ${flip.itemName} flip`);
  removeBtn.addEventListener("click", () => {
    portfolio.removeFlip(flip.id);
    renderFlips();
  });

  const completeBtn = document.createElement("button");
  completeBtn.className = "flip-complete-btn";
  completeBtn.type = "button";
  completeBtn.textContent = "✓";
  completeBtn.title = "Mark as sold";
  completeBtn.setAttribute("aria-label", `Mark ${flip.itemName} as sold`);
  completeBtn.addEventListener("click", () => {
    const input = prompt(
      `Enter the actual sell price per item for "${flip.itemName}":`,
      String(flip.targetSellPrice),
    );
    if (input === null) return; // cancelled
    const price = Number(input);
    if (!price || price <= 0) return;
    portfolio.completeFlip(flip.id, price);
    renderFlips();
    renderCompletedFlips();
  });

  const actions = document.createElement("div");
  actions.className = "flip-card-actions";
  actions.appendChild(completeBtn);
  actions.appendChild(removeBtn);

  top.appendChild(nameEl);
  top.appendChild(actions);

  // ── Detail row ──
  const details = document.createElement("div");
  details.className = "flip-details";

  const cost = flip.buyPrice * flip.quantity;
  const revenue = flip.targetSellPrice * 0.98 * flip.quantity; // 2% GE tax
  const profit = revenue - cost;

  details.innerHTML = [
    `<span>Buy: ${formatGpShort(flip.buyPrice)}</span>`,
    `<span>Sell: ${formatGpShort(flip.targetSellPrice)}</span>`,
    `<span>Qty: ${flip.quantity.toLocaleString("en-US")}</span>`,
    `<span class="flip-profit${profit < 0 ? " loss" : ""}">P/L: ${formatGpShort(Math.round(profit))} gp</span>`,
    `<span class="flip-timer${limitReady ? " ready" : ""}">${formatCountdown(flip.timestamp)}</span>`,
  ].join("");

  card.appendChild(top);
  card.appendChild(details);
  return card;
}

// ─── Completed Flips (History & Stats) ──────────────────────────────────────

/**
 * Render the completed-flips list as a sortable <table> and the stats dashboard header.
 * Supports column sort (click headers) and text filtering.
 */
// Usability enhancement – March 2026
function renderCompletedFlips(): void {
  renderPortfolioStats();

  const container = els.completedFlipsList;
  container.innerHTML = "";

  let flips = portfolio.getCompletedFlips();

  // Apply text filter.
  const filterText = els.completedFlipsFilter.value.trim().toLowerCase();
  if (filterText) {
    flips = flips.filter((f) => {
      const profitStr = String(f.realizedProfit);
      return f.itemName.toLowerCase().includes(filterText) || profitStr.includes(filterText);
    });
  }

  if (flips.length === 0) {
    const empty = document.createElement("div");
    empty.className = "portfolio-empty";
    empty.textContent = filterText
      ? "No flips match the current filter."
      : "No completed flips yet. Use the \u2713 button on an active flip to log a sale.";
    container.appendChild(empty);
    return;
  }

  // Sort flips.
  const dir = completedFlipsSortAsc ? 1 : -1;
  flips.sort((a, b) => {
    switch (completedFlipsSortCol) {
      case "date": return dir * (a.completedAt - b.completedAt);
      case "item": return dir * a.itemName.localeCompare(b.itemName);
      case "profit": return dir * (a.realizedProfit - b.realizedProfit);
      case "roi": {
        const roiA = a.buyPrice * a.quantity > 0 ? a.realizedProfit / (a.buyPrice * a.quantity) : 0;
        const roiB = b.buyPrice * b.quantity > 0 ? b.realizedProfit / (b.buyPrice * b.quantity) : 0;
        return dir * (roiA - roiB);
      }
      default: return 0;
    }
  });

  const table = document.createElement("table");
  table.className = "completed-flips-table";

  // Header row.
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const columns: { key: typeof completedFlipsSortCol; label: string }[] = [
    { key: "date", label: "Date" },
    { key: "item", label: "Item" },
    { key: "profit", label: "Profit" },
    { key: "roi", label: "ROI" },
  ];

  for (const col of columns) {
    const th = document.createElement("th");
    const arrow = completedFlipsSortCol === col.key
      ? (completedFlipsSortAsc ? " \u25B2" : " \u25BC")
      : "";
    th.innerHTML = `${col.label}<span class="sort-arrow">${arrow}</span>`;
    th.addEventListener("click", () => {
      if (completedFlipsSortCol === col.key) {
        completedFlipsSortAsc = !completedFlipsSortAsc;
      } else {
        completedFlipsSortCol = col.key;
        completedFlipsSortAsc = col.key === "item"; // alphabetical default asc
      }
      renderCompletedFlips();
    });
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Body rows.
  const tbody = document.createElement("tbody");
  for (const flip of flips) {
    const row = document.createElement("tr");
    row.className = flip.realizedProfit > 0 ? "win" : "loss";

    const dateCell = document.createElement("td");
    dateCell.textContent = new Date(flip.completedAt).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "2-digit",
    });

    const itemCell = document.createElement("td");
    itemCell.textContent = flip.itemName;

    const profitCell = document.createElement("td");
    profitCell.className = `profit-cell ${flip.realizedProfit > 0 ? "win" : "loss"}`;
    const profitPrefix = flip.realizedProfit > 0 ? "▲ " : "▼ ";
    profitCell.textContent = `${profitPrefix}${formatGpShort(flip.realizedProfit)} gp`;

    const roi = flip.buyPrice * flip.quantity > 0
      ? (flip.realizedProfit / (flip.buyPrice * flip.quantity)) * 100
      : 0;
    const roiCell = document.createElement("td");
    roiCell.className = `profit-cell ${roi >= 0 ? "win" : "loss"}`;
    roiCell.textContent = `${roi >= 0 ? "+" : ""}${roi.toFixed(1)}%`;

    row.appendChild(dateCell);
    row.appendChild(itemCell);
    row.appendChild(profitCell);
    row.appendChild(roiCell);
    tbody.appendChild(row);
  }
  table.appendChild(tbody);
  container.appendChild(table);
}

/**
 * Populate the stats dashboard header from portfolio stats.
 */
function renderPortfolioStats(): void {
  const stats = portfolio.getPortfolioStats();

  const profitEl = els.statTotalProfit;
  const profitPrefix = stats.totalProfit >= 0 ? "▲ " : "▼ ";
  profitEl.textContent = `${profitPrefix}${formatGpShort(stats.totalProfit)} gp`;
  profitEl.className = `stat-value ${stats.totalProfit >= 0 ? "profit" : "loss"}`;

  els.statTotalFlips.textContent = String(stats.totalFlips);

  const avgProfitEl = els.statAvgProfit;
  const avgPrefix = stats.avgProfit >= 0 ? "▲ " : "▼ ";
  avgProfitEl.textContent = `${avgPrefix}${formatGpShort(stats.avgProfit)} gp`;
  avgProfitEl.className = `stat-value ${stats.avgProfit >= 0 ? "profit" : "loss"}`;

  els.statAvgRoi.textContent = `${(stats.avgRoi * 100).toFixed(1)}%`;
  els.statAvgRoi.className = `stat-value ${stats.avgRoi >= 0 ? "profit" : "loss"}`;
}

/**
 * Bind the completed-flips filter input to re-render on typing.
 */
// Usability enhancement – March 2026
function bindCompletedFlipsFilter(): void {
  els.completedFlipsFilter.addEventListener("input", () => {
    renderCompletedFlips();
  });
}

/**
 * Generate a CSV string from all completed flips and trigger a download.
 */
// Usability enhancement – March 2026
function exportCompletedFlipsCsv(): void {
  const flips = portfolio.getCompletedFlips();
  if (flips.length === 0) {
    alert("No completed flips to export.");
    return;
  }

  const header = "Item,Buy Price,Qty,Sell Price,Realised Profit,Date";
  const rows = flips.map((f) => {
    const dateStr = new Date(f.completedAt).toISOString().slice(0, 10);
    // Escape item names that might contain commas.
    const safeName = f.itemName.includes(",") ? `"${f.itemName}"` : f.itemName;
    return `${safeName},${f.buyPrice},${f.quantity},${f.actualSellPrice},${f.realizedProfit},${dateStr}`;
  });

  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "ge-advisor-flips.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Bind the CSV export button click handler.
 */
function bindCsvExport(): void {
  els.exportCsvBtn.addEventListener("click", exportCompletedFlipsCsv);
}

/**
 * Build a single completed-flip card DOM element.
 * @deprecated Replaced by table-based rendering in {@link renderCompletedFlips}.
 */
function _buildCompletedFlipCard(flip: CompletedFlip): HTMLElement {
  const card = document.createElement("div");
  card.className = `completed-flip-card ${flip.realizedProfit > 0 ? "win" : "loss"}`;

  const top = document.createElement("div");
  top.className = "completed-flip-top";

  const nameEl = document.createElement("span");
  nameEl.className = "flip-item-name";
  nameEl.textContent = flip.itemName;

  const dateEl = document.createElement("span");
  dateEl.className = "completed-flip-date";
  dateEl.textContent = new Date(flip.completedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  top.appendChild(nameEl);
  top.appendChild(dateEl);

  const details = document.createElement("div");
  details.className = "completed-flip-details";

  const profitClass = flip.realizedProfit > 0 ? "win" : "loss";

  details.innerHTML = [
    `<span>Buy: ${formatGpShort(flip.buyPrice)}</span>`,
    `<span>Sold: ${formatGpShort(flip.actualSellPrice)}</span>`,
    `<span>Qty: ${flip.quantity.toLocaleString("en-US")}</span>`,
    `<span class="completed-flip-profit ${profitClass}">P/L: ${formatGpShort(flip.realizedProfit)} gp</span>`,
  ].join("");

  card.appendChild(top);
  card.appendChild(details);
  return card;
}

/**
 * Format the buy-limit countdown for a flip.
 *
 * @param timestamp - Unix-millisecond time the offer was placed.
 * @returns Human-readable countdown string, or "Limit reset ✓" when elapsed.
 */
function formatCountdown(timestamp: number): string {
  const elapsed = Date.now() - timestamp;
  const remaining = BUY_LIMIT_WINDOW_MS - elapsed;

  if (remaining <= 0) return "Limit reset ✓";

  const totalMin = Math.ceil(remaining / 60_000);
  const hours = Math.floor(totalMin / 60);
  const mins = totalMin % 60;

  if (hours > 0) return `Resets in ${hours}h ${mins}m`;
  return `Resets in ${mins}m`;
}

/**
 * Start a repeating interval that re-renders the portfolio flip list
 * so countdowns stay live.
 */
function startPortfolioTimer(): void {
  if (portfolioTimerId !== null) return;
  portfolioTimerId = setInterval(() => {
    // Only re-render if there are active flips.
    if (portfolio.getFlips().length > 0) {
      renderFlips();
    }
  }, PORTFOLIO_TICK_MS);
}

// ─── Chat History Persistence ───────────────────────────────────────────────

/**
 * Serialise the LLM conversation history to `localStorage`, capping at
 * {@link MAX_SAVED_MESSAGES} non-system messages to stay within quota.
 *
 * The system prompt is excluded from the saved payload — it is always
 * regenerated by {@link LLMService} on construction / `loadHistory()`.
 * User messages are stored with their clean query text only (the bulky
 * `=== GRAND EXCHANGE DATA ===` context block is stripped).
 */
function persistChatHistory(): void {
  if (!llm) return;

  const all = llm.messages;
  // Skip the system prompt (index 0); only save user + assistant turns.
  const nonSystem = all.filter((m) => m.role !== "system");

  // Cap to the most recent N messages.
  const trimmed = nonSystem.slice(-MAX_SAVED_MESSAGES);

  // Strip the bulky RAG context from user messages so we only persist
  // the clean player question.
  const cleaned = trimmed.map((m) => {
    if (m.role === "user") {
      return { role: m.role, content: extractPlayerQuestion(m.content) };
    }
    return { role: m.role, content: m.content };
  });

  try {
    localStorage.setItem(LS_CHAT_HISTORY, JSON.stringify(cleaned));
  } catch (err) {
    console.warn("[UIService] Failed to persist chat history:", err);
  }
}

/**
 * Extract just the player's question from a full RAG user message.
 * The user message is structured as:
 * ```
 * === GRAND EXCHANGE DATA ===
 * …
 * === PLAYER QUESTION ===
 * <actual question>
 * ```
 * If the marker is found, return everything after it; otherwise return
 * the whole string (it may already be a clean question from a previous save).
 */
function extractPlayerQuestion(content: string): string {
  const marker = "=== PLAYER QUESTION ===";
  const idx = content.indexOf(marker);
  if (idx === -1) return content;
  return content.slice(idx + marker.length).trim();
}

/**
 * On startup, attempt to restore a previously-saved chat conversation from
 * `localStorage`.  Re-renders the bubbles and loads the history into the
 * shared {@link LLMService} instance.
 */
function restoreChatHistory(): void {
  const raw = localStorage.getItem(LS_CHAT_HISTORY);
  if (!raw) return;

  try {
    const saved: { role: string; content: string }[] = JSON.parse(raw);
    if (!Array.isArray(saved) || saved.length === 0) return;

    // Re-render each saved message as a chat bubble.
    for (const msg of saved) {
      if (msg.role === "user" || msg.role === "assistant") {
        appendMessage(msg.role as "user" | "assistant", msg.content);
      }
    }

    // Feed the cleaned history into the LLM service so it has conversational
    // context for subsequent requests.
    const service = ensureLLMService();
    const chatMessages = saved
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));
    service.loadHistory(chatMessages);

    scrollChatToBottom();
    console.log(`[UIService] Restored ${chatMessages.length} chat messages from localStorage.`);
  } catch (err) {
    console.warn("[UIService] Failed to parse saved chat history:", err);
    localStorage.removeItem(LS_CHAT_HISTORY);
  }
}

/**
 * Bind the "Clear Chat" button in the advisor header.
 * Clears the DOM, localStorage key, and LLM conversation memory.
 */
function bindClearChat(): void {
  els.clearChatBtn.addEventListener("click", () => {
    // Clear DOM.
    els.chatHistory.innerHTML = "";

    // Clear persistence.
    localStorage.removeItem(LS_CHAT_HISTORY);

    // Reset LLM conversation memory.
    if (llm) {
      llm.clearHistory();
    }

    console.log("[UIService] Chat history cleared.");
  });
}

/**
 * Build the `endpoint` + `model` config object from the current persisted
 * settings.  Used when constructing {@link LLMService} for each chat request.
 */
function resolvedLLMConfig(): { endpoint: string; model: string } {
  const providerId = localStorage.getItem(LS_PROVIDER) ?? LLM_PROVIDERS[0].id;
  const provider = getProviderById(providerId);

  const modelOverride = (localStorage.getItem(LS_MODEL) ?? "").trim();
  const customEndpoint = (localStorage.getItem(LS_ENDPOINT) ?? "").trim();

  const endpoint =
    provider.id === "custom"
      ? customEndpoint || "http://localhost:1234/v1/chat/completions"
      : provider.endpoint;

  const model = modelOverride || provider.defaultModel;

  return { endpoint, model };
}

// ─── Item catalogue (for autocomplete) ──────────────────────────────────────

/**
 * Read every item from IndexedDB and store a lightweight name+price list
 * sorted alphabetically.  Called once during {@link initUI} after the cache
 * has been populated.
 */
async function loadItemCatalogue(): Promise<void> {
  try {
    const records = await cache.getAll();
    allCachedItems = records
      .map((r) => ({ name: r.name, price: r.price }))
      .sort((a, b) => a.name.localeCompare(b.name));
    console.log(`[UIService] Item catalogue loaded: ${allCachedItems.length} items.`);
  } catch (err) {
    console.warn("[UIService] Failed to load item catalogue:", err);
    allCachedItems = [];
  }
}

// ─── DOM bootstrapping ──────────────────────────────────────────────────────

/**
 * Resolve and cache all required DOM element references once.
 * Throws early with a clear message if any element is missing (development
 * safety net).
 */
function resolveElements(): void {
  const q = <T extends HTMLElement>(id: string): T => {
    const el = document.getElementById(id) as T | null;
    if (!el) throw new Error(`[UIService] Missing DOM element: #${id}`);
    return el;
  };

  els = {
    alt1Status: q("alt1-status"),
    providerSelect: q<HTMLSelectElement>("provider-select"),
    providerCostHint: q("provider-cost-hint"),
    setupGuideBtn: q<HTMLButtonElement>("setup-guide-btn"),
    customEndpointGroup: q("custom-endpoint-group"),
    customEndpointInput: q<HTMLInputElement>("custom-endpoint-input"),
    modelInput: q<HTMLInputElement>("model-input"),
    modelOptions: q<HTMLDataListElement>("model-options"),
    apiKeyInput: q<HTMLInputElement>("api-key-input"),
    saveKeyBtn: q<HTMLButtonElement>("save-key-btn"),
    keyStatus: q("key-status"),
    filterVolume: q<HTMLSelectElement>("filter-volume"),
    filterPrice: q<HTMLSelectElement>("filter-price"),
    top20SortSelect: q<HTMLSelectElement>("top20-sort-select"),
    searchSortSelect: q<HTMLSelectElement>("search-sort-select"),
    volumeCustomGroup: q("volume-custom-group"),
    volumeMinSlider: q<HTMLInputElement>("volume-min-slider"),
    volumeMinInput: q<HTMLInputElement>("volume-min-input"),
    volumeMaxSlider: q<HTMLInputElement>("volume-max-slider"),
    volumeMaxInput: q<HTMLInputElement>("volume-max-input"),
    budgetCustomGroup: q("budget-custom-group"),
    budgetSlider: q<HTMLInputElement>("budget-slider"),
    budgetInput: q<HTMLInputElement>("budget-input"),
    marketSearchInput: q<HTMLInputElement>("market-search-input"),
    searchLoading: q("search-loading"),
    searchResults: q("search-results"),
    favoritesSection: q("favorites-section"),
    favoritesItems: q("favorites-items"),
    favoritesCollapseBtn: q<HTMLButtonElement>("favorites-collapse-btn"),
    favoritesSortSelect: q<HTMLSelectElement>("favorites-sort-select"),
    refreshMarketBtn: q<HTMLButtonElement>("refresh-market-btn"),
    fullMarketScanBtn: q<HTMLButtonElement>("full-market-scan-btn"),
    deepHistoryCheckbox: q<HTMLInputElement>("deep-history-checkbox"),
    syncProgress: q("background-sync-progress"),
    syncProgressFill: q("sync-progress-fill"),
    syncProgressText: q("sync-progress-text"),
    marketLoading: q("market-loading"),
    marketItems: q("market-items"),
    errorBanner: q("error-banner"),
    errorBannerMsg: q("error-banner-msg"),
    errorRetryBtn: q<HTMLButtonElement>("error-retry-btn"),
    viewListBtn: q<HTMLButtonElement>("view-list-btn"),
    viewTileBtn: q<HTMLButtonElement>("view-tile-btn"),
    viewHybridBtn: q<HTMLButtonElement>("view-hybrid-btn"),
    compactTilesToggle: q<HTMLInputElement>("compact-tiles-toggle"),
    top20CollapseBtn: q<HTMLButtonElement>("top20-collapse-btn"),
    chatHistory: q("chat-history"),
    chatInput: q<HTMLInputElement>("chat-input"),
    chatSendBtn: q<HTMLButtonElement>("chat-send-btn"),
    clearChatBtn: q<HTMLButtonElement>("clear-chat-btn"),
    forceReloadBtn: q<HTMLButtonElement>("force-reload-btn"),
    reloadStatus: q("reload-status"),
    layoutTabbedBtn: q<HTMLButtonElement>("layout-tabbed-btn"),
    layoutSidebarBtn: q<HTMLButtonElement>("layout-sidebar-btn"),
    styleSelect: q<HTMLSelectElement>("style-select"),
    colorwaySelect: q<HTMLSelectElement>("colorway-select"),
    modeDarkBtn: q<HTMLButtonElement>("mode-dark-btn"),
    modeLightBtn: q<HTMLButtonElement>("mode-light-btn"),
    contrastSelect: q<HTMLSelectElement>("contrast-select"),
    contrastAutoToggle: q<HTMLInputElement>("contrast-auto-toggle"),
    tabMarketBtn: q<HTMLButtonElement>("tab-market-btn"),
    tabAdvisorBtn: q<HTMLButtonElement>("tab-advisor-btn"),
    viewTabs: q("view-tabs"),
    marketView: q("market-view"),
    advisorView: q("advisor-view"),
    tabPortfolioBtn: q<HTMLButtonElement>("tab-portfolio-btn"),
    portfolioView: q("portfolio-view"),
    flipItemName: q<HTMLInputElement>("flip-item-name"),
    flipSuggestions: q("flip-suggestions"),
    flipBuyPrice: q<HTMLInputElement>("flip-buy-price"),
    flipQuantity: q<HTMLInputElement>("flip-quantity"),
    flipSellPrice: q<HTMLInputElement>("flip-sell-price"),
    addFlipBtn: q<HTMLButtonElement>("add-flip-btn"),
    activeFlipsList: q("active-flips-list"),
    portfolioActiveBtn: q<HTMLButtonElement>("portfolio-active-btn"),
    portfolioHistoryBtn: q<HTMLButtonElement>("portfolio-history-btn"),
    portfolioActiveContainer: q("portfolio-active-container"),
    portfolioHistoryContainer: q("portfolio-history-container"),
    statTotalProfit: q("stat-total-profit"),
    statTotalFlips: q("stat-total-flips"),
    statAvgProfit: q("stat-avg-profit"),
    statAvgRoi: q("stat-avg-roi"),
    completedFlipsList: q("completed-flips-list"),
    exportDataBtn: q<HTMLButtonElement>("export-data-btn"),
    importDataBtn: q<HTMLButtonElement>("import-data-btn"),
    importFileInput: q<HTMLInputElement>("import-file-input"),
    historyRangeSelect: q<HTMLSelectElement>("history-range-select"),
    completedFlipsFilter: q<HTMLInputElement>("completed-flips-filter"),
    exportCsvBtn: q<HTMLButtonElement>("export-csv-btn"),
    searchFilterBtn: q<HTMLButtonElement>("search-filter-btn"),
    searchFilterPopover: q("search-filter-popover"),
    browseAllBtn: q<HTMLButtonElement>("browse-all-btn"),
    backToTopBtn: q<HTMLButtonElement>("back-to-top-btn"),
  };
}

// ─── Formatting utilities ───────────────────────────────────────────────────

/**
 * Abbreviate a gp value (e.g. `1_234_567` → `"1.23M"`).
 */
function formatGpShort(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_000_000_000) return `${sign}${(abs / 1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${sign}${(abs / 1_000).toFixed(1)}K`;
  return `${sign}${abs.toLocaleString("en-US")}`;
}

/**
 * Format a trade volume with locale separators.
 */
function formatVolume(vol: number): string {
  return vol.toLocaleString("en-US");
}
