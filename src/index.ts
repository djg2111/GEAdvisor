/**
 * @module index
 * Application entry point.
 *
 * Responsibilities (in order):
 *  1. Import static assets so Webpack emits them.
 *  2. Import the stylesheet (processed by style-loader → injected at runtime).
 *  3. Detect the Alt1 environment and show the appropriate status banner.
 *  4. Run the data-ingest pipeline (fetch + cache).
 *  5. Bootstrap the UI (market panel, settings, chat).
 */

import * as a1lib from "alt1";
import { initDataPipeline } from "./services";
import { initUI } from "./uiService";

// ── Static asset imports (Webpack asset/resource) ───────────────────────────
import "./appconfig.json";
import "./icon.png";

// ── Stylesheet (Webpack style-loader injects into <head>) ───────────────────
import "./style.css";

// ── Alt1 environment detection ──────────────────────────────────────────────
const alt1Status = document.getElementById("alt1-status");

if (window.alt1) {
  alt1.identifyAppUrl("./appconfig.json");
} else if (alt1Status) {
  const addAppUrl = `alt1://addapp/${new URL("./appconfig.json", document.location.href).href}`;
  alt1Status.innerHTML =
    `Alt1 not detected — <a href="${addAppUrl}">click here</a> to add this app.`;
}

// ── Boot sequence ───────────────────────────────────────────────────────────
(async () => {
  try {
    // Step 1 — Populate the IndexedDB cache with fresh GE data.
    await initDataPipeline();

    // Step 2 — Wire services → DOM and render the interface.
    await initUI();

    console.log("[GE Analyzer] Startup complete.");
  } catch (err) {
    console.error("[GE Analyzer] Startup failed:", err);
    alt1Status?.insertAdjacentHTML(
      "beforeend",
      `<div style="color:#f44747;margin-top:4px">Startup error — see console.</div>`
    );
  }
})();
