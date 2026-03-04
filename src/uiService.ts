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

/** `localStorage` key for persisted colorway preference (classic/osrs/rs3-modern/solarized). */
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
type ColorwayMode = "classic" | "osrs" | "rs3-modern" | "solarized" | "rs-lobby" | "gruvbox";

/** Available appearance modes (dark / light). */
type AppMode = "dark" | "light";

/** Available contrast levels. */
type ContrastMode = "default" | "soft" | "hard";

/**
 * Legacy colorway values mapped to the new mode+colorway system.
 * Used for one-time migration of persisted settings.
 */
const LEGACY_COLORWAY_MAP: Record<string, { mode: AppMode; colorway: ColorwayMode }> = {
  classic:      { mode: "dark",  colorway: "classic" },
  osrs:         { mode: "dark",  colorway: "osrs" },
  "rs3-modern": { mode: "dark",  colorway: "rs3-modern" },
  light:        { mode: "light", colorway: "classic" },
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

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Bootstrap the entire UI.  Call once from the entry point after the DOM is
 * ready.  Returns only after the initial data pipeline has completed and the
 * market panel is rendered.
 */
export async function initUI(onStatus?: (msg: string, step: string) => void): Promise<void> {
  resolveElements();
  populateProviderDropdown();
  restoreSettings();
  bindSettingsEvents();
  bindChatEvents();
  bindViewToggle();
  bindMarketFilters();
  bindForceReload();
  bindLayoutToggle();
  bindTheme();
  bindTabNavigation();
  bindClearChat();
  bindPortfolio();
  bindErrorRetry();
  bindDataManagement();
  bindFullMarketScan();
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

  const savedMode = (localStorage.getItem(LS_MODE) as AppMode | null) ?? "dark";
  const savedStyle = (localStorage.getItem(LS_STYLE) as StyleMode | null) ?? "basic";
  const savedColorway = (localStorage.getItem(LS_COLORWAY) as ColorwayMode | null) ?? "classic";
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
      classic: "classic", osrs: "osrs", "rs3-modern": "rs3-modern",
      glass: "classic", neumorphism: "classic", minimalism: "light", skeuomorphism: "classic",
    };
    localStorage.setItem(LS_COLORWAY, COLORWAY_TMP[legacy] ?? "classic");
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

/** Apply an appearance mode (dark/light) and persist the choice. */
function applyMode(mode: AppMode): void {
  document.body.dataset.mode = mode;
  localStorage.setItem(LS_MODE, mode);
  els.modeDarkBtn.classList.toggle("active", mode === "dark");
  els.modeLightBtn.classList.toggle("active", mode === "light");
}

/** Apply a style to the document and persist the choice. */
function applyStyle(style: StyleMode): void {
  document.body.dataset.style = style;
  localStorage.setItem(LS_STYLE, style);
  els.styleSelect.value = style;
}

/** Apply a colorway to the document and persist the choice. */
function applyColorway(colorway: ColorwayMode): void {
  document.body.dataset.colorway = colorway;
  localStorage.setItem(LS_COLORWAY, colorway);
  els.colorwaySelect.value = colorway;
}

/** Apply a contrast level to the document and persist the choice. */
function applyContrast(contrast: ContrastMode): void {
  document.body.dataset.contrast = contrast;
  localStorage.setItem(LS_CONTRAST, contrast);
  els.contrastSelect.value = contrast;
}

/**
 * Apply all four theme axes in a single synchronous pass to minimise
 * style recalculations during initialisation and data-import restores.
 * Writes all four `dataset` properties before the browser can trigger
 * an intermediate layout, producing one composite style recalc.
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
}

/** Apply a layout mode to the document and persist the choice. */
function applyLayout(mode: LayoutMode): void {
  document.body.dataset.layout = mode;
  localStorage.setItem(LS_LAYOUT, mode);

  els.layoutTabbedBtn.classList.toggle("active", mode === "tabbed");
  els.layoutSidebarBtn.classList.toggle("active", mode === "sidebar");

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
    latestSearchResults = [];
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
          latestSearchResults = results;
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
        isSearchActive = false;
        latestSearchResults = [];
        els.searchResults.innerHTML = "";
        els.searchLoading.style.display = "none";
      }
    }, 300)
  );
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
    const fontSize = Math.max(9, Math.round(h * 0.35));
    ctx.font = `${fontSize}px "Segoe UI", sans-serif`;
    ctx.fillStyle = "#888";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("No price history", w / 2, h / 2);
    return;
  }

  // ── Single data point: draw a dot ──
  if (data.length === 1) {
    ctx.fillStyle = "#888";
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
function axisLabel(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_000_000_000) return `${sign}${(abs / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}${(abs / 1_000).toFixed(1)}K`;
  return `${sign}${abs}`;
}

/**
 * Draw a full-featured area chart on the graph modal canvas, including:
 * - Y-axis price labels (left)
 * - X-axis day labels (bottom: "Day 1", "Day 2", … or "d-6", "d-5", …, "today")
 * - Horizontal grid lines
 * - Gradient-filled area under the curve
 * - Trend-coloured line with data-point dots
 *
 * Handles edge cases (0 or 1 data points) the same as {@link drawSparkline}.
 *
 * @param canvas - The target `<canvas>` DOM element.
 * @param data   - Array of numeric price values in chronological order.
 */
function drawGraphChart(canvas: HTMLCanvasElement, data: number[]): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const cssW = canvas.offsetWidth || canvas.width;
  const cssH = canvas.offsetHeight || canvas.height;
  canvas.width = cssW * dpr;
  canvas.height = cssH * dpr;
  ctx.scale(dpr, dpr);

  // ── No data: placeholder ──
  if (data.length === 0) {
    ctx.font = '12px "Segoe UI", sans-serif';
    ctx.fillStyle = "#888";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("No price history available", cssW / 2, cssH / 2);
    return;
  }

  // ── Single data point ──
  if (data.length === 1) {
    ctx.font = '11px "Segoe UI", sans-serif';
    ctx.fillStyle = "#888";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${axisLabel(data[0])} gp (1 day)`, cssW / 2, cssH / 2);
    return;
  }

  // ── Chart margins ──
  const marginLeft = 52;
  const marginRight = 10;
  const marginTop = 10;
  const marginBottom = 22;
  const plotW = cssW - marginLeft - marginRight;
  const plotH = cssH - marginTop - marginBottom;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  // Compute nice Y-axis ticks (4 horizontal lines).
  const TICKS = 4;
  const tickValues: number[] = [];
  for (let i = 0; i <= TICKS; i++) {
    tickValues.push(min + (range * i) / TICKS);
  }

  // ── Draw grid lines + Y-axis labels ──
  ctx.font = '10px "Segoe UI", sans-serif';
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (const tv of tickValues) {
    const y = marginTop + plotH - ((tv - min) / range) * plotH;
    // Grid line
    ctx.strokeStyle = "rgba(255,255,255,0.07)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(marginLeft, y);
    ctx.lineTo(cssW - marginRight, y);
    ctx.stroke();
    // Label
    ctx.fillStyle = "#888";
    ctx.fillText(axisLabel(tv), marginLeft - 6, y);
  }

  // ── X-axis labels ──
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillStyle = "#888";
  const stepX = plotW / (data.length - 1);
  // Show labels at first, last, and ~3 evenly-spaced middle points.
  const labelCount = Math.min(data.length, 6);
  const labelStep = (data.length - 1) / (labelCount - 1);
  for (let li = 0; li < labelCount; li++) {
    const idx = Math.round(li * labelStep);
    const x = marginLeft + idx * stepX;
    // Label: days ago relative to today.
    const daysAgo = data.length - 1 - idx;
    const label = daysAgo === 0 ? "today" : `d\u2212${daysAgo}`;
    ctx.fillText(label, x, cssH - marginBottom + 6);
  }

  // ── Helper: data index → canvas coords ──
  const toXY = (i: number): { x: number; y: number } => ({
    x: marginLeft + i * stepX,
    y: marginTop + plotH - ((data[i] - min) / range) * plotH,
  });

  // Trend colour.
  const first = data[0];
  const last = data[data.length - 1];
  const lineColour = last > first ? "#4ec9b0" : last < first ? "#f44747" : "#888888";

  // ── Gradient fill under curve ──
  ctx.beginPath();
  ctx.moveTo(toXY(0).x, toXY(0).y);
  for (let i = 1; i < data.length; i++) {
    const p = toXY(i);
    ctx.lineTo(p.x, p.y);
  }
  ctx.lineTo(toXY(data.length - 1).x, marginTop + plotH);
  ctx.lineTo(toXY(0).x, marginTop + plotH);
  ctx.closePath();
  const grad = ctx.createLinearGradient(0, marginTop, 0, marginTop + plotH);
  grad.addColorStop(0, lineColour + "44");
  grad.addColorStop(1, lineColour + "08");
  ctx.fillStyle = grad;
  ctx.fill();

  // ── Line ──
  ctx.strokeStyle = lineColour;
  ctx.lineWidth = 2;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.beginPath();
  for (let i = 0; i < data.length; i++) {
    const p = toXY(i);
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();

  // ── Data-point dots ──
  for (let i = 0; i < data.length; i++) {
    const p = toXY(i);
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = lineColour;
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.5)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
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
  analyticsBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showAnalyticsModal(item);
  });
  // Favorite toggle button.
  const favBtn = document.createElement("button");
  favBtn.className = "fav-btn";
  favBtn.textContent = getFavorites().has(item.name) ? "\u2605" : "\u2606";
  favBtn.title = "Toggle favourite";
  favBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const nowFav = toggleFavorite(item.name);
    favBtn.textContent = nowFav ? "\u2605" : "\u2606";
    card.classList.toggle("favorited", nowFav);
  });

  // Quick-add-to-portfolio button.
  const addFlipCardBtn = document.createElement("button");
  addFlipCardBtn.className = "quick-add-btn";
  addFlipCardBtn.textContent = "+";
  addFlipCardBtn.title = "Add to portfolio";
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
      `<label>Buy \u2264</label>` +
      `<input class="card-alert-buy" type="number" min="0" placeholder="gp" />` +
    `</div>` +
    `<div class="card-alert-row">` +
      `<label>Sell \u2265</label>` +
      `<input class="card-alert-sell" type="number" min="0" placeholder="gp" />` +
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

  // Toggle inline expand on click (multiple cards can be expanded).
  header.addEventListener("click", () => {
    card.classList.toggle("expanded");
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

  const mHeader = document.createElement("div");
  mHeader.className = "item-modal-header";
  mHeader.id = "item-modal-header";

  const closeBtn = document.createElement("button");
  closeBtn.className = "item-modal-close";
  closeBtn.textContent = "\u2715";
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
    if (e.target === backdrop) hideGraphModal();
  });

  const modal = document.createElement("div");
  modal.className = "graph-modal";

  const mHeader = document.createElement("div");
  mHeader.className = "graph-modal-header";
  mHeader.id = "graph-modal-header";

  const closeBtn = document.createElement("button");
  closeBtn.className = "item-modal-close";
  closeBtn.textContent = "\u2715";
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
 * Refresh the graph modal chart with a new history range.
 * Called when the in-modal range dropdown changes.
 */
// Usability fix: on-demand history for graphs – March 2026
async function refreshItemGraph(item: RankedItem, range: number): Promise<void> {
  const backdrop = ensureGraphModal();
  const mBody = backdrop.querySelector("#graph-modal-body") as HTMLElement;

  // Show loading while fetching / checking cache.
  const canvas = mBody.querySelector<HTMLCanvasElement>(".graph-modal-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = "12px 'Segoe UI', sans-serif";
      ctx.fillStyle = "#888";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Fetching history\u2026", canvas.width / 2, canvas.height / 2);
    }
  }

  let fetched: number[];
  try {
    fetched = await fetchItemHistory(item.name, range);
  } catch {
    showToast("History unavailable \u2014 could not fetch price data.", "info");
    fetched = [];
  }
  const hist = fetched.length > 0 ? [...fetched, item.price] : [item.price];

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
      `<div class="graph-stat-row">` +
        `<span class="graph-stat-label">${range}-Day Trend</span>` +
        `<span class="graph-stat-value" style="color:${trendColour}">${trendIcon} ${trendLabel}</span>` +
      `</div>` +
      `<div class="graph-stat-row">` +
        `<span class="graph-stat-label">Change</span>` +
        `<span class="graph-stat-value" style="color:${trendColour}">${absChange >= 0 ? "+" : ""}${formatGpShort(absChange)} gp (${pctChange >= 0 ? "+" : ""}${pctChange.toFixed(1)}%)</span>` +
      `</div>` +
      `<div class="graph-stat-row">` +
        `<span class="graph-stat-label">Current Price</span>` +
        `<span class="graph-stat-value">${currentPrice.toLocaleString("en-US")} gp</span>` +
      `</div>` +
      `<div class="graph-stat-row">` +
        `<span class="graph-stat-label">${range}-Day High</span>` +
        `<span class="graph-stat-value">${highPrice.toLocaleString("en-US")} gp</span>` +
      `</div>` +
      `<div class="graph-stat-row">` +
        `<span class="graph-stat-label">${range}-Day Low</span>` +
        `<span class="graph-stat-value">${lowPrice.toLocaleString("en-US")} gp</span>` +
      `</div>` +
      `<div class="graph-stat-row">` +
        `<span class="graph-stat-label">Volatility</span>` +
        `<span class="graph-stat-value">${volatility.toFixed(1)}%</span>` +
      `</div>` +
      `<div class="graph-stat-row">` +
        `<span class="graph-stat-label">Data Points</span>` +
        `<span class="graph-stat-value">${hist.length} day${hist.length !== 1 ? "s" : ""}</span>` +
      `</div>`;
  }

  // Manual history refresh fallback – March 2026
  // Update history-status visibility after range refresh.
  const statusEl = mBody.querySelector<HTMLElement>(".graph-history-status");
  if (hist.length < 7) {
    statusEl?.classList.add("visible");
    if (canvas) canvas.style.display = "none";
  } else {
    statusEl?.classList.remove("visible");
    if (canvas) canvas.style.display = "";
  }

  requestAnimationFrame(() => {
    if (canvas && hist.length >= 2) drawGraphChart(canvas, hist);
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

  let fetched: number[];
  try {
    fetched = await fetchItemHistory(item.name, range);
  } catch {
    showToast("History unavailable \u2014 could not fetch price data.", "info");
    fetched = [];
  }
  const hist = fetched.length > 0 ? [...fetched, item.price] : (item.priceHistory.length >= 2 ? item.priceHistory : [item.price]);
  const hasData = hist.length >= 2;

  // Update item priceHistory if we got fresh data and range is 7d.
  if (fetched.length > 0 && range <= 7) {
    item.priceHistory = [...fetched, item.price];
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
      `<label>Range:</label>` +
      `<select class="graph-range-inline">${rangeOptions}</select>` +
    `</div>` +
    `<canvas class="graph-modal-canvas" width="480" height="180"${insufficientData ? ' style="display:none"' : ''}></canvas>` +
    `<div class="graph-history-status${insufficientData ? ' visible' : ''}">` +
      `Insufficient history \u2022 ` +
      `<button class="refresh-history-btn">Refresh</button>` +
    `</div>` +
    `<div class="graph-stats">` +
      `<div class="graph-stat-row">` +
        `<span class="graph-stat-label">${range}-Day Trend</span>` +
        `<span class="graph-stat-value" style="color:${trendColour}">${trendIcon} ${trendLabel}</span>` +
      `</div>` +
      `<div class="graph-stat-row">` +
        `<span class="graph-stat-label">Change</span>` +
        `<span class="graph-stat-value" style="color:${trendColour}">${absChange >= 0 ? "+" : ""}${formatGpShort(absChange)} gp (${pctChange >= 0 ? "+" : ""}${pctChange.toFixed(1)}%)</span>` +
      `</div>` +
      `<div class="graph-stat-row">` +
        `<span class="graph-stat-label">Current Price</span>` +
        `<span class="graph-stat-value">${currentPrice.toLocaleString("en-US")} gp</span>` +
      `</div>` +
      `<div class="graph-stat-row">` +
        `<span class="graph-stat-label">${range}-Day High</span>` +
        `<span class="graph-stat-value">${highPrice.toLocaleString("en-US")} gp</span>` +
      `</div>` +
      `<div class="graph-stat-row">` +
        `<span class="graph-stat-label">${range}-Day Low</span>` +
        `<span class="graph-stat-value">${lowPrice.toLocaleString("en-US")} gp</span>` +
      `</div>` +
      `<div class="graph-stat-row">` +
        `<span class="graph-stat-label">Volatility</span>` +
        `<span class="graph-stat-value">${volatility.toFixed(1)}%</span>` +
      `</div>` +
      `<div class="graph-stat-row">` +
        `<span class="graph-stat-label">Data Points</span>` +
        `<span class="graph-stat-value">${hist.length} day${hist.length !== 1 ? "s" : ""}</span>` +
      `</div>` +
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

  // Draw the chart after the modal is in the DOM.
  requestAnimationFrame(() => {
    const canvas = mBody.querySelector<HTMLCanvasElement>(".graph-modal-canvas");
    if (canvas && !insufficientData) drawGraphChart(canvas, hist);
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
      const prices = await ensureItemHistory(item.name, 90);
      const range = parseInt(
        (container.querySelector<HTMLSelectElement>(".graph-range-inline")?.value) || "7", 10
      );
      const sliced = (range < 90 && prices.length > range) ? prices.slice(-range) : prices;
      const hist = sliced.length > 0 ? [...sliced, item.price] : [item.price];

      // Update canvas visibility & status strip.
      const canvas = container.querySelector<HTMLCanvasElement>(".graph-modal-canvas");
      const statusEl = container.querySelector<HTMLElement>(".graph-history-status");

      if (hist.length >= 7) {
        if (canvas) { canvas.style.display = ""; drawGraphChart(canvas, hist); }
        statusEl?.classList.remove("visible");
      } else {
        // Still insufficient — draw what we have but keep the status.
        if (canvas) { canvas.style.display = ""; drawGraphChart(canvas, hist); }
        btn.textContent = "Refresh";
        btn.disabled = false;
      }

      // Refresh stats as well.
      refreshItemGraph(item, range);
    } catch {
      showToast("Failed to load history", "info");
      btn.textContent = "Refresh";
      btn.disabled = false;
    }
  });
}

/** Hide the graph modal. */
function hideGraphModal(): void {
  if (graphModal) graphModal.classList.remove("visible");
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
    if (e.target === backdrop) hideAnalyticsModal();
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

  // Global Escape key handler.
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && backdrop.classList.contains("visible")) {
      hideAnalyticsModal();
    }
  });

  analyticsModal = backdrop;
  return backdrop;
}

/** Hide the unified analytics modal. */
function hideAnalyticsModal(): void {
  if (analyticsModal) analyticsModal.classList.remove("visible");
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
      `<label>Range:</label>` +
      `<select class="graph-range-inline">` +
        [7, 30, 90].map((d) =>
          `<option value="${d}"${d === range ? " selected" : ""}>History: ${d} days</option>`
        ).join("") +
      `</select>` +
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

  let fetched: number[];
  try {
    fetched = await fetchItemHistory(item.name, range);
  } catch {
    showToast("History unavailable \u2014 could not fetch price data.", "info");
    fetched = [];
  }
  const hist = fetched.length > 0
    ? [...fetched, item.price]
    : (item.priceHistory.length >= 2 ? item.priceHistory : [item.price]);
  const hasData = hist.length >= 2;

  // Update item priceHistory if we got fresh data and range is 7d.
  if (fetched.length > 0 && range <= 7) {
    item.priceHistory = [...fetched, item.price];
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
      `<label>Range:</label>` +
      `<select class="graph-range-inline">` +
        [7, 30, 90].map((d) =>
          `<option value="${d}"${d === range ? " selected" : ""}>History: ${d} days</option>`
        ).join("") +
      `</select>` +
    `</div>` +
    `<canvas class="graph-modal-canvas" width="480" height="200"${insufficientData ? ' style="display:none"' : ''}></canvas>` +
    `<div class="graph-history-status${insufficientData ? ' visible' : ''}">` +
      `Insufficient history \u2022 ` +
      `<button class="refresh-history-btn">Refresh</button>` +
    `</div>` +
    `<div class="analytics-stats-grid">` +
      `<div class="analytics-stat-card">` +
        `<span class="analytics-stat-label">${range}-Day Trend</span>` +
        `<span class="analytics-stat-value" style="color:${trendColour}">${trendIcon} ${trendLabel}</span>` +
      `</div>` +
      `<div class="analytics-stat-card">` +
        `<span class="analytics-stat-label">Change</span>` +
        `<span class="analytics-stat-value" style="color:${trendColour}">${absChange >= 0 ? "+" : ""}${formatGpShort(absChange)} gp (${pctChange >= 0 ? "+" : ""}${pctChange.toFixed(1)}%)</span>` +
      `</div>` +
      `<div class="analytics-stat-card">` +
        `<span class="analytics-stat-label">Current Price</span>` +
        `<span class="analytics-stat-value">${currentPrice.toLocaleString("en-US")} gp</span>` +
      `</div>` +
      `<div class="analytics-stat-card">` +
        `<span class="analytics-stat-label">${range}-Day High</span>` +
        `<span class="analytics-stat-value">${highPrice.toLocaleString("en-US")} gp</span>` +
      `</div>` +
      `<div class="analytics-stat-card">` +
        `<span class="analytics-stat-label">${range}-Day Low</span>` +
        `<span class="analytics-stat-value">${lowPrice.toLocaleString("en-US")} gp</span>` +
      `</div>` +
      `<div class="analytics-stat-card">` +
        `<span class="analytics-stat-label">Volatility</span>` +
        `<span class="analytics-stat-value">${volatility.toFixed(1)}%</span>` +
      `</div>` +
      `<div class="analytics-stat-card">` +
        `<span class="analytics-stat-label">Data Points</span>` +
        `<span class="analytics-stat-value">${hist.length} day${hist.length !== 1 ? "s" : ""}</span>` +
      `</div>` +
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

  // Draw the chart.
  requestAnimationFrame(() => {
    const canvas = graphSection.querySelector<HTMLCanvasElement>(".graph-modal-canvas");
    if (canvas && !insufficientData) drawGraphChart(canvas, hist);
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
  const canvas = graphSection.querySelector<HTMLCanvasElement>(".graph-modal-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = "12px 'Segoe UI', sans-serif";
      ctx.fillStyle = "#888";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Fetching history\u2026", canvas.width / 2, canvas.height / 2);
    }
  }

  let fetched: number[];
  try {
    fetched = await fetchItemHistory(item.name, range);
  } catch {
    showToast("History unavailable \u2014 could not fetch price data.", "info");
    fetched = [];
  }
  const hist = fetched.length > 0 ? [...fetched, item.price] : [item.price];

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
      `<div class="analytics-stat-card">` +
        `<span class="analytics-stat-label">${range}-Day Trend</span>` +
        `<span class="analytics-stat-value" style="color:${trendColour}">${trendIcon} ${trendLabel}</span>` +
      `</div>` +
      `<div class="analytics-stat-card">` +
        `<span class="analytics-stat-label">Change</span>` +
        `<span class="analytics-stat-value" style="color:${trendColour}">${absChange >= 0 ? "+" : ""}${formatGpShort(absChange)} gp (${pctChange >= 0 ? "+" : ""}${pctChange.toFixed(1)}%)</span>` +
      `</div>` +
      `<div class="analytics-stat-card">` +
        `<span class="analytics-stat-label">Current Price</span>` +
        `<span class="analytics-stat-value">${currentPrice.toLocaleString("en-US")} gp</span>` +
      `</div>` +
      `<div class="analytics-stat-card">` +
        `<span class="analytics-stat-label">${range}-Day High</span>` +
        `<span class="analytics-stat-value">${highPrice.toLocaleString("en-US")} gp</span>` +
      `</div>` +
      `<div class="analytics-stat-card">` +
        `<span class="analytics-stat-label">${range}-Day Low</span>` +
        `<span class="analytics-stat-value">${lowPrice.toLocaleString("en-US")} gp</span>` +
      `</div>` +
      `<div class="analytics-stat-card">` +
        `<span class="analytics-stat-label">Volatility</span>` +
        `<span class="analytics-stat-value">${volatility.toFixed(1)}%</span>` +
      `</div>` +
      `<div class="analytics-stat-card">` +
        `<span class="analytics-stat-label">Data Points</span>` +
        `<span class="analytics-stat-value">${hist.length} day${hist.length !== 1 ? "s" : ""}</span>` +
      `</div>`;
  }

  // Update history-status visibility after range refresh.
  const statusEl = graphSection.querySelector<HTMLElement>(".graph-history-status");
  if (hist.length < 7) {
    statusEl?.classList.add("visible");
    if (canvas) canvas.style.display = "none";
  } else {
    statusEl?.classList.remove("visible");
    if (canvas) canvas.style.display = "";
  }

  requestAnimationFrame(() => {
    if (canvas && hist.length >= 2) drawGraphChart(canvas, hist);
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
      const prices = await ensureItemHistory(item.name, 90);
      const range = parseInt(
        (graphSection.querySelector<HTMLSelectElement>(".graph-range-inline")?.value) || "7", 10
      );
      const sliced = (range < 90 && prices.length > range) ? prices.slice(-range) : prices;
      const hist = sliced.length > 0 ? [...sliced, item.price] : [item.price];

      const canvas = graphSection.querySelector<HTMLCanvasElement>(".graph-modal-canvas");
      const statusEl = graphSection.querySelector<HTMLElement>(".graph-history-status");

      if (hist.length >= 7) {
        if (canvas) { canvas.style.display = ""; drawGraphChart(canvas, hist); }
        statusEl?.classList.remove("visible");
      } else {
        if (canvas) { canvas.style.display = ""; drawGraphChart(canvas, hist); }
        btn.textContent = "Refresh";
        btn.disabled = false;
      }

      refreshAnalyticsGraph(item, graphSection, range);
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
    els.portfolioActiveContainer.style.display = "";
    els.portfolioHistoryContainer.style.display = "none";
  });

  els.portfolioHistoryBtn.addEventListener("click", () => {
    els.portfolioHistoryBtn.classList.add("active");
    els.portfolioActiveBtn.classList.remove("active");
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

  if (!itemName) { els.flipItemName.focus(); return; }
  if (!buyPrice || buyPrice <= 0) { els.flipBuyPrice.focus(); return; }
  if (!quantity || quantity <= 0) { els.flipQuantity.focus(); return; }
  if (!sellPrice || sellPrice <= 0) { els.flipSellPrice.focus(); return; }

  portfolio.addFlip(itemName, buyPrice, quantity, sellPrice);

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
  removeBtn.addEventListener("click", () => {
    portfolio.removeFlip(flip.id);
    renderFlips();
  });

  const completeBtn = document.createElement("button");
  completeBtn.className = "flip-complete-btn";
  completeBtn.type = "button";
  completeBtn.textContent = "✓";
  completeBtn.title = "Mark as sold";
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
