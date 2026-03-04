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

// ── Early theme restoration ─────────────────────────────────────────────────
// Apply all four persisted theme axes before any content renders so the
// startup overlay matches the user's chosen appearance settings.
(() => {
  const mode     = localStorage.getItem("ge-analyzer:mode")     ?? "dark";
  const style    = localStorage.getItem("ge-analyzer:style")    ?? "basic";
  const colorway = localStorage.getItem("ge-analyzer:colorway") ?? "classic";
  const contrast = localStorage.getItem("ge-analyzer:contrast") ?? "default";
  document.body.dataset.mode     = mode;
  document.body.dataset.style    = style;
  document.body.dataset.colorway = colorway;
  document.body.dataset.contrast = contrast;
})();

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
// Startup loading overlay – March 2026
const startupOverlay = document.getElementById("startup-overlay");
const startupStatus  = document.getElementById("startup-status");

/** Update the startup overlay status text. */
function setStartupStatus(msg: string, step?: string): void {
  if (startupStatus) {
    startupStatus.innerHTML = step
      ? `${msg}<br><span style="font-size:10px;opacity:0.6">${step}</span>`
      : msg;
  }
}

/** Fade out and remove the startup overlay. */
function dismissOverlay(): void {
  if (!startupOverlay) return;
  startupOverlay.classList.add("fade-out");
  startupOverlay.addEventListener("transitionend", () => {
    startupOverlay.remove();
  }, { once: true });
  // Safety fallback in case transitionend doesn't fire.
  setTimeout(() => { startupOverlay.remove(); }, 600);
}

(async () => {
  try {
    // Step 1 — Populate the IndexedDB cache with fresh GE data.
    setStartupStatus("Loading market data\u2026", "Step 1 of 4");
    await initDataPipeline();

    // Step 2 — Wire services → DOM and render the interface.
    await initUI((msg, step) => setStartupStatus(msg, step));

    console.log("[GE Analyzer] Startup complete.");
    dismissOverlay();
  } catch (err) {
    console.error("[GE Analyzer] Startup failed:", err);
    setStartupStatus("Startup failed \u2014 see console for details.");
    alt1Status?.insertAdjacentHTML(
      "beforeend",
      `<div style="color:#f44747;margin-top:4px">Startup error \u2014 see console.</div>`
    );
  }
})();
