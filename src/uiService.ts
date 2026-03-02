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
  WeirdGloopService,
  WikiService,
} from "./services";
import type { ActiveFlip, CompletedFlip, GECatalogueEntry, LLMProvider, MarketAnalyzerConfig, RankedItem, StoredPriceRecord } from "./services";

// ─── Constants ──────────────────────────────────────────────────────────────

/** `localStorage` key for the persisted LLM API key. */
const LS_API_KEY = "ge-analyzer:llm-api-key";

/** `localStorage` key for the selected provider ID. */
const LS_PROVIDER = "ge-analyzer:llm-provider";

/** `localStorage` key for the user-specified model override. */
const LS_MODEL = "ge-analyzer:llm-model";

/** `localStorage` key for the custom endpoint URL. */
const LS_ENDPOINT = "ge-analyzer:llm-endpoint";

/** Number of top items whose wiki guides are fetched for the RAG context. */
const WIKI_GUIDE_COUNT = 5;

/** RS3 item sprite base URL (official Jagex endpoint). */
const SPRITE_BASE = "https://secure.runescape.com/m=itemdb_rs/obj_sprite.gif?id=";

/** Available market panel view modes. */
type ViewMode = "list" | "tile" | "hybrid";

/** `localStorage` key for persisted view mode preference. */
const LS_VIEW_MODE = "ge-analyzer:view-mode";

/** `localStorage` key for persisted interface layout preference. */
const LS_LAYOUT = "ge-analyzer:layout";

/** `localStorage` key for persisted theme preference. */
const LS_THEME = "ge-analyzer:theme";

/** `localStorage` key for serialised LLM chat history. */
const LS_CHAT_HISTORY = "ge-analyzer:chat-history";

/** `localStorage` key for the user's favourited item names (JSON array). */
const LS_FAVORITES = "ge-analyzer:favorites";

/** Maximum number of messages (user + assistant) persisted to localStorage. */
const MAX_SAVED_MESSAGES = 50;

/** GE buy-limit window duration in milliseconds (4 hours). */
const BUY_LIMIT_WINDOW_MS = 4 * 60 * 60 * 1000;

/** Portfolio countdown refresh interval in milliseconds (every 30 s). */
const PORTFOLIO_TICK_MS = 30_000;

/** Available interface layout modes. */
type LayoutMode = "tabbed" | "sidebar";

/** Available visual themes. */
type ThemeMode = "classic" | "osrs" | "rs3-modern";

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
};

// ─── Favorites helpers ──────────────────────────────────────────────────────

/** Return the Set of favourited item names from localStorage. */
function getFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(LS_FAVORITES);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

/** Toggle an item's favourite status and persist the result. Returns the new state. */
function toggleFavorite(name: string): boolean {
  const favs = getFavorites();
  const isFav = favs.has(name);
  if (isFav) favs.delete(name); else favs.add(name);
  localStorage.setItem(LS_FAVORITES, JSON.stringify([...favs]));
  // Re-render the favourites panel asynchronously.
  renderFavorites();
  return !isFav;
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
  customEndpointGroup: HTMLElement;
  customEndpointInput: HTMLInputElement;
  modelInput: HTMLInputElement;
  modelOptions: HTMLDataListElement;
  apiKeyInput: HTMLInputElement;
  saveKeyBtn: HTMLButtonElement;
  keyStatus: HTMLElement;
  filterVolume: HTMLSelectElement;
  filterPrice: HTMLSelectElement;
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
  refreshMarketBtn: HTMLButtonElement;
  marketLoading: HTMLElement;
  marketItems: HTMLElement;
  viewListBtn: HTMLButtonElement;
  viewTileBtn: HTMLButtonElement;
  viewHybridBtn: HTMLButtonElement;
  top20CollapseBtn: HTMLButtonElement;
  chatHistory: HTMLElement;
  chatInput: HTMLInputElement;
  chatSendBtn: HTMLButtonElement;
  clearChatBtn: HTMLButtonElement;
  forceReloadBtn: HTMLButtonElement;
  reloadStatus: HTMLElement;
  layoutTabbedBtn: HTMLButtonElement;
  layoutSidebarBtn: HTMLButtonElement;
  themeSelect: HTMLSelectElement;
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
};

// ─── Shared service instances (initialised once) ────────────────────────────

let cache: CacheService;
let analyzer: MarketAnalyzerService;
let wiki: WikiService;

/** Most recent formatted market summary — reused across chat messages. */
let latestMarketSummary = "";
/** Most recent wiki text block — reused across chat messages. */
let latestWikiText = "";
/** The top items array, cached for wiki lookups per chat message. */
let latestTopItems: RankedItem[] = [];

/** Currently active view mode for the market panel. */
let currentView: ViewMode = "list";

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
export async function initUI(): Promise<void> {
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

  // Initialise shared service singletons.
  cache = new CacheService();
  await cache.open();
  analyzer = new MarketAnalyzerService(cache);
  wiki = new WikiService();
  portfolio = new PortfolioService();

  // Run the initial market analysis and render.
  await refreshMarketPanel();

  // Render the favourites section (if any favourites exist).
  await renderFavorites();
  bindFavoritesCollapse();
  bindTop20Collapse();

  // Build the full item catalogue for portfolio autocomplete.
  await loadItemCatalogue();

  // Fetch the full GE catalogue (∼7 000 items) for market search.
  geCatalogue = await fetchGECatalogue();

  // Pre-fetch wiki text for the first batch of items so that the first
  // chat message doesn't have to wait for wiki I/O.
  await prefetchWikiText();

  // Restore any persisted LLM chat conversation.
  restoreChatHistory();

  // Render any persisted portfolio flips and start the countdown timer.
  renderFlips();
  renderCompletedFlips();
  startPortfolioTimer();
  bindPortfolioSubNav();
}

// ─── Settings (API Key) ─────────────────────────────────────────────────────

/**
 * Populate the provider `<select>` element from the {@link LLM_PROVIDERS}
 * preset array.
 */
function populateProviderDropdown(): void {
  els.providerSelect.innerHTML = "";
  for (const p of LLM_PROVIDERS) {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = p.label;
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
 * placeholder text, custom endpoint visibility, model datalist, model placeholder.
 */
function applyProviderUI(provider: LLMProvider): void {
  // Toggle custom endpoint field visibility.
  els.customEndpointGroup.classList.toggle("hidden", provider.id !== "custom");

  // Update placeholders.
  els.apiKeyInput.placeholder = provider.keyPlaceholder;
  els.modelInput.placeholder = provider.defaultModel || "(enter model name)";

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
      await prefetchWikiText();

      els.reloadStatus.textContent = "Data reloaded ✓";
    } catch (err) {
      console.error("[UIService] Force reload failed:", err);
      els.reloadStatus.textContent = "Reload failed — see console.";
      els.reloadStatus.classList.add("error");
    } finally {
      els.forceReloadBtn.disabled = false;
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

// ─── Theme ──────────────────────────────────────────────────────────────────

/**
 * Restore persisted theme preference and bind the theme dropdown.
 * Sets `document.body.dataset.theme` which activates the matching
 * CSS variable override block.
 */
function bindTheme(): void {
  const saved = (localStorage.getItem(LS_THEME) as ThemeMode | null) ?? "classic";
  applyTheme(saved);

  els.themeSelect.addEventListener("change", () => {
    applyTheme(els.themeSelect.value as ThemeMode);
  });
}

/** Apply a theme to the document and persist the choice. */
function applyTheme(theme: ThemeMode): void {
  document.body.dataset.theme = theme;
  localStorage.setItem(LS_THEME, theme);
  els.themeSelect.value = theme;
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

// ─── Market Panel ───────────────────────────────────────────────────────────

/** Whether the market panel is currently showing search results. */
let isSearchActive = false;

/**
 * Run the market analyzer and render the top-N list into the DOM.
 */
async function refreshMarketPanel(): Promise<void> {
  els.marketLoading.style.display = "";
  els.marketItems.innerHTML = "";

  try {
    const filters = readFilterConfig();
    latestTopItems = await analyzer.getTopItems(filters);
    latestMarketSummary = analyzer.formatForLLM(latestTopItems);
    renderMarketItems(latestTopItems);
  } catch (err) {
    console.error("[UIService] Failed to refresh market panel:", err);
    els.marketLoading.textContent = "Failed to load market data.";
    els.marketLoading.classList.add("error");
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
    config.maxVolume = 1_000;
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

  // ── Refresh button ────────────────────────────────────────────────────
  els.refreshMarketBtn.addEventListener("click", async () => {
    els.marketSearchInput.value = "";
    isSearchActive = false;
    await refreshMarketPanel();
    // Re-fetch wiki text for the new filtered set so the LLM context stays in sync.
    await prefetchWikiText();
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
          renderSearchResults(results);

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
  // Re-render favourites in new view mode.
  renderFavorites();
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
 * @param canvas - The target `<canvas>` DOM element.
 * @param data   - Array of numeric values (≥ 2) in chronological order.
 */
function drawSparkline(canvas: HTMLCanvasElement, data: number[]): void {
  const ctx = canvas.getContext("2d");
  if (!ctx || data.length < 2) return;

  // Use the element's laid-out size so the drawing matches CSS sizing.
  const w = canvas.offsetWidth || canvas.width;
  const h = canvas.offsetHeight || canvas.height;
  canvas.width = w;
  canvas.height = h;

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

  // Draw sparklines now that canvases are in the DOM.
  const canvases = els.marketItems.querySelectorAll<HTMLCanvasElement>("canvas.sparkline");
  canvases.forEach((canvas) => {
    const data: number[] | undefined = (canvas as any).__priceHistory;
    if (data && data.length >= 2) {
      drawSparkline(canvas, data);
    }
  });
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

  // Draw sparklines.
  const canvases = els.favoritesItems.querySelectorAll<HTMLCanvasElement>("canvas.sparkline");
  canvases.forEach((canvas) => {
    const data: number[] | undefined = (canvas as any).__priceHistory;
    if (data && data.length >= 2) {
      drawSparkline(canvas, data);
    }
  });
}

/** Bind the collapse/expand toggle for the favourites section header. */
function bindFavoritesCollapse(): void {
  els.favoritesCollapseBtn.addEventListener("click", () => {
    favoritesCollapsed = !favoritesCollapsed;
    els.favoritesCollapseBtn.textContent = favoritesCollapsed ? "▸" : "▾";
    els.favoritesItems.style.display = favoritesCollapsed ? "none" : "";
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
    // Hide filters, custom groups, loading indicator, and items list.
    document.getElementById("market-filters")!.style.display = hide;
    els.marketItems.style.display = hide;
    if (top20Collapsed) {
      // Always hide when collapsing.
      els.volumeCustomGroup.style.display = "none";
      els.budgetCustomGroup.style.display = "none";
      els.marketLoading.style.display = "none";
    } else {
      // Restore custom group visibility based on current dropdown selection.
      els.volumeCustomGroup.style.display = els.filterVolume.value === "custom" ? "" : "none";
      els.budgetCustomGroup.style.display = els.filterPrice.value === "custom" ? "" : "none";
    }
  });
}

/**
 * Render search results into the dedicated #search-results container.
 * Uses the same card builder + sparkline drawing as the Top 20.
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

  // Draw sparklines.
  const canvases = els.searchResults.querySelectorAll<HTMLCanvasElement>("canvas.sparkline");
  canvases.forEach((canvas) => {
    const data: number[] | undefined = (canvas as any).__priceHistory;
    if (data && data.length >= 2) {
      drawSparkline(canvas, data);
    }
  });
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

  header.appendChild(flipWrap);

  // Popout button — opens the floating detail modal.
  const popoutBtn = document.createElement("button");
  popoutBtn.className = "popout-btn";
  popoutBtn.textContent = "\u2197";
  popoutBtn.title = "View details";
  popoutBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showItemModal(item);
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

  // Group action buttons in a horizontal row.
  const actions = document.createElement("span");
  actions.className = "card-actions";
  actions.appendChild(popoutBtn);
  actions.appendChild(favBtn);
  actions.appendChild(addFlipCardBtn);
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

  // \u2500\u2500 Sparkline canvas (between header and detail) \u2500\u2500
  const sparkCanvas = document.createElement("canvas");
  sparkCanvas.className = "sparkline";
  sparkCanvas.width = 100;
  sparkCanvas.height = 30;
  // Attach price data for post-render drawing.
  (sparkCanvas as any).__priceHistory = item.priceHistory;

  card.appendChild(header);
  card.appendChild(sparkCanvas);
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
 *     .item-modal-body    (badges, sparkline, detail rows)
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
    `<canvas class="sparkline modal-sparkline" width="340" height="60"></canvas>` +
    `<div class="item-modal-details">${rows}</div>`;

  // Draw the sparkline.
  const canvas = mBody.querySelector<HTMLCanvasElement>("canvas.modal-sparkline");
  if (canvas && item.priceHistory.length >= 2) {
    drawSparkline(canvas, item.priceHistory);
  }

  backdrop.classList.add("visible");
}

/** Hide the floating item detail modal. */
function hideItemModal(): void {
  if (itemModal) itemModal.classList.remove("visible");
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
    // Ensure wiki text is available (may already be cached from prefetch).
    if (!latestWikiText) {
      await prefetchWikiText();
    }

    const service = ensureLLMService();
    const advice = await service.generateAdvice(query, latestMarketSummary, latestWikiText);
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
 * Render the completed-flips list and the stats dashboard header.
 */
function renderCompletedFlips(): void {
  renderPortfolioStats();

  const container = els.completedFlipsList;
  container.innerHTML = "";

  const flips = portfolio.getCompletedFlips();

  if (flips.length === 0) {
    const empty = document.createElement("div");
    empty.className = "portfolio-empty";
    empty.textContent = "No completed flips yet. Use the ✓ button on an active flip to log a sale.";
    container.appendChild(empty);
    return;
  }

  for (const flip of flips) {
    container.appendChild(buildCompletedFlipCard(flip));
  }
}

/**
 * Populate the stats dashboard header from portfolio stats.
 */
function renderPortfolioStats(): void {
  const stats = portfolio.getPortfolioStats();

  const profitEl = els.statTotalProfit;
  profitEl.textContent = `${formatGpShort(stats.totalProfit)} gp`;
  profitEl.className = `stat-value ${stats.totalProfit >= 0 ? "profit" : "loss"}`;

  els.statTotalFlips.textContent = String(stats.totalFlips);

  const avgProfitEl = els.statAvgProfit;
  avgProfitEl.textContent = `${formatGpShort(stats.avgProfit)} gp`;
  avgProfitEl.className = `stat-value ${stats.avgProfit >= 0 ? "profit" : "loss"}`;

  els.statAvgRoi.textContent = `${(stats.avgRoi * 100).toFixed(1)}%`;
  els.statAvgRoi.className = `stat-value ${stats.avgRoi >= 0 ? "profit" : "loss"}`;
}

/**
 * Build a single completed-flip card DOM element.
 */
function buildCompletedFlipCard(flip: CompletedFlip): HTMLElement {
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

// ─── Wiki pre-fetch ─────────────────────────────────────────────────────────

/**
 * Fetch wiki guide text for the top items and cache it in module scope.
 */
async function prefetchWikiText(): Promise<void> {
  if (latestTopItems.length === 0) return;

  try {
    const names = latestTopItems.slice(0, WIKI_GUIDE_COUNT).map((i) => i.name);
    const guides = await wiki.getGuidesForItems(names);
    latestWikiText = guides
      .filter((g) => g.found)
      .map((g) => `--- ${g.title} ---\n${g.text}`)
      .join("\n\n");
  } catch (err) {
    console.warn("[UIService] Wiki prefetch failed:", err);
    latestWikiText = "";
  }
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
    customEndpointGroup: q("custom-endpoint-group"),
    customEndpointInput: q<HTMLInputElement>("custom-endpoint-input"),
    modelInput: q<HTMLInputElement>("model-input"),
    modelOptions: q<HTMLDataListElement>("model-options"),
    apiKeyInput: q<HTMLInputElement>("api-key-input"),
    saveKeyBtn: q<HTMLButtonElement>("save-key-btn"),
    keyStatus: q("key-status"),
    filterVolume: q<HTMLSelectElement>("filter-volume"),
    filterPrice: q<HTMLSelectElement>("filter-price"),
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
    refreshMarketBtn: q<HTMLButtonElement>("refresh-market-btn"),
    marketLoading: q("market-loading"),
    marketItems: q("market-items"),
    viewListBtn: q<HTMLButtonElement>("view-list-btn"),
    viewTileBtn: q<HTMLButtonElement>("view-tile-btn"),
    viewHybridBtn: q<HTMLButtonElement>("view-hybrid-btn"),
    top20CollapseBtn: q<HTMLButtonElement>("top20-collapse-btn"),
    chatHistory: q("chat-history"),
    chatInput: q<HTMLInputElement>("chat-input"),
    chatSendBtn: q<HTMLButtonElement>("chat-send-btn"),
    clearChatBtn: q<HTMLButtonElement>("clear-chat-btn"),
    forceReloadBtn: q<HTMLButtonElement>("force-reload-btn"),
    reloadStatus: q("reload-status"),
    layoutTabbedBtn: q<HTMLButtonElement>("layout-tabbed-btn"),
    layoutSidebarBtn: q<HTMLButtonElement>("layout-sidebar-btn"),
    themeSelect: q<HTMLSelectElement>("theme-select"),
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
