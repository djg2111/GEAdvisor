(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["TestApp"] = factory();
	else
		root["TestApp"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../node_modules/css-loader/dist/cjs.js!./style.css"
/*!**********************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./style.css ***!
  \**********************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ─────────────────────────────────────────────────────────────────────────────
 * GE Market Analyzer — Alt1 Overlay Stylesheet
 *
 * Dark palette optimised for readability on top of the RS3 game client.
 * All measurements use px/rem so the overlay renders consistently regardless
 * of the host page's base font-size.
 * ───────────────────────────────────────────────────────────────────────────── */

/* ═══════════════════════════════════════════════════════════════════════════
 *  THEME VARIABLES — CSS Custom Properties
 *  Default: "Classic Dark".  Switch via body[data-theme="osrs"|"rs3-modern"].
 * ═══════════════════════════════════════════════════════════════════════════ */

:root {
  /* ── Backgrounds ─────────────────────── */
  --bg-main: #1e1e1e;
  --bg-panel: #252526;
  --bg-elevated: #2d2d30;
  --bg-hover: #2a2d2e;
  --bg-input: #3c3c3c;
  --bg-muted: #333;
  --bg-filter: #1e1e24;
  --bg-number-input: #2a2a2e;

  /* ── Text ────────────────────────────── */
  --text-main: #d4d4d4;
  --text-bright: #fff;
  --text-accent: #9cdcfe;
  --text-heading: #dcdcaa;
  --text-price: #b5cea8;
  --text-muted: #888;
  --text-soft: #aaa;
  --text-dimmed: #666;

  /* ── Borders ─────────────────────────── */
  --border-main: #333;
  --border-section: #3a3d40;
  --border-input: #555;
  --border-subtle: #444;
  --border-hype: #6b5a1e;
  --border-hype-hover: #a08830;

  /* ── Primary action ──────────────────── */
  --accent-primary: #0e639c;
  --accent-primary-hover: #1177bb;
  --accent-primary-active: #094771;
  --accent-focus: #007acc;

  /* ── Semantic accents ────────────────── */
  --accent-blue-text: #569cd6;
  --accent-green: #6a9955;
  --accent-green-bright: #27ae60;
  --accent-teal: #4ec9b0;
  --accent-gold: #f0c040;
  --accent-gold-hype: #f5c542;
  --accent-red: #f44747;
  --accent-red-dark: #c0392b;
  --accent-red-bg: #3a1d1d;
  --accent-red-border: #6b3030;
  --accent-red-border-hover: #a04040;

  /* ── Chat ─────────────────────────────── */
  --chat-user-bg: #264f78;
  --chat-error-bg: #3b1a1a;

  /* ── Badges ──────────────────────────── */
  --badge-buy-bg: #1e2d3a;
  --badge-sell-bg: #1e3a1e;
  --badge-hype-bg: #3a2e10;

  /* ── Modal ───────────────────────────── */
  --modal-backdrop: rgba(0, 0, 0, 0.6);
  --modal-shadow: rgba(0, 0, 0, 0.8);

  /* ── Scrollbar ───────────────────────── */
  --scrollbar-thumb: #555;
  --scrollbar-thumb-hover: #777;

  /* ── Misc ─────────────────────────────── */
  --link-color: #6cb4ee;
  --add-flip-bg: #1b6b2a;
  --limit-ready-bg: #1a2e1a;
}

/* ── OSRS Brown Theme ─────────────────────────────────────────────────────── */

body[data-theme="osrs"] {
  --bg-main: #382b1f;
  --bg-panel: #4a3a2a;
  --bg-elevated: #56452f;
  --bg-hover: #5c4b35;
  --bg-input: #3e2e1e;
  --bg-muted: #4a3a2a;
  --bg-filter: #322418;
  --bg-number-input: #3a2c1e;

  --text-main: #ffdf8f;
  --text-bright: #fff5d0;
  --text-accent: #ffd666;
  --text-heading: #ff9900;
  --text-price: #d4a843;
  --text-muted: #b89860;
  --text-soft: #c8a060;
  --text-dimmed: #8a6d40;

  --border-main: #1f160e;
  --border-section: #2a1e12;
  --border-input: #6b5030;
  --border-subtle: #5a4020;
  --border-hype: #806020;
  --border-hype-hover: #a08030;

  --accent-primary: #8b4513;
  --accent-primary-hover: #a0522d;
  --accent-primary-active: #6b3410;
  --accent-focus: #cd853f;
  --accent-blue-text: #cd853f;
  --accent-green: #6b8e23;
  --accent-green-bright: #228b22;
  --accent-teal: #8fbc8f;
  --accent-gold: #ffd700;
  --accent-gold-hype: #ffa500;
  --accent-red: #dc143c;
  --accent-red-dark: #8b0000;
  --accent-red-bg: #3a1a0a;
  --accent-red-border: #8b3030;
  --accent-red-border-hover: #a04040;

  --chat-user-bg: #5a3a18;
  --chat-error-bg: #3a1a0a;
  --badge-buy-bg: #3a2810;
  --badge-sell-bg: #283a10;
  --badge-hype-bg: #3a3010;

  --modal-backdrop: rgba(0, 0, 0, 0.7);
  --modal-shadow: rgba(0, 0, 0, 0.9);
  --scrollbar-thumb: #6b5030;
  --scrollbar-thumb-hover: #8a6d40;
  --link-color: #cd853f;
  --add-flip-bg: #4a6b1a;
  --limit-ready-bg: #2a3a1a;
}

/* ── RS3 Modern Theme ─────────────────────────────────────────────────────── */

body[data-theme="rs3-modern"] {
  --bg-main: #0f1722;
  --bg-panel: #1c2836;
  --bg-elevated: #1e2d3e;
  --bg-hover: #243548;
  --bg-input: #1a2a3a;
  --bg-muted: #1c2836;
  --bg-filter: #141f2d;
  --bg-number-input: #162030;

  --text-main: #e6f0fa;
  --text-bright: #ffffff;
  --text-accent: #7dd3fc;
  --text-heading: #38bdf8;
  --text-price: #86efac;
  --text-muted: #7494b0;
  --text-soft: #90adc4;
  --text-dimmed: #4a6580;

  --border-main: #2a3f54;
  --border-section: #1e3450;
  --border-input: #3a5570;
  --border-subtle: #2a4060;
  --border-hype: #5a5a1e;
  --border-hype-hover: #808030;

  --accent-primary: #00a8ff;
  --accent-primary-hover: #33bbff;
  --accent-primary-active: #0080cc;
  --accent-focus: #00a8ff;
  --accent-blue-text: #7dd3fc;
  --accent-green: #4ade80;
  --accent-green-bright: #22c55e;
  --accent-teal: #2dd4bf;
  --accent-gold: #fbbf24;
  --accent-gold-hype: #f59e0b;
  --accent-red: #f87171;
  --accent-red-dark: #ef4444;
  --accent-red-bg: #2a1515;
  --accent-red-border: #7f1d1d;
  --accent-red-border-hover: #991b1b;

  --chat-user-bg: #0c3a6e;
  --chat-error-bg: #2a1515;
  --badge-buy-bg: #0c2d4a;
  --badge-sell-bg: #0c3a1e;
  --badge-hype-bg: #3a3010;

  --modal-backdrop: rgba(0, 0, 0, 0.75);
  --modal-shadow: rgba(0, 0, 0, 0.9);
  --scrollbar-thumb: #3a5570;
  --scrollbar-thumb-hover: #4a7090;
  --link-color: #7dd3fc;
  --add-flip-bg: #0d5a2a;
  --limit-ready-bg: #0d2a1a;
}

/* ── Reset & base ─────────────────────────────────────────────────────────── */

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  width: 100%;
  height: 100%;
}

body {
  width: 100%;
  height: 100%;
  overflow: hidden;          /* prevent body-level scrollbar; app shell handles its own scrolling */
  font-family: "Segoe UI", Consolas, "Liberation Mono", monospace;
  font-size: 13px;
  line-height: 1.45;
  color: var(--text-main);
  background: var(--bg-main);
}

/* ── Alt1 status banner ───────────────────────────────────────────────────── */

#alt1-status {
  padding: 4px 10px;
  font-size: 11px;
  text-align: center;
}

#alt1-status:empty {
  display: none;
}

#alt1-status a {
  color: var(--link-color);
}

/* ── App shell ────────────────────────────────────────────────────────────── */

#app {
  display: flex;
  flex-direction: column;
  height: 95%;              /* fill parent, not viewport — respects zoom */
  min-height: 0;             /* allow flex children to shrink properly */
  overflow: hidden;
}

/* ── Settings panel ───────────────────────────────────────────────────────── */

#settings-panel {
  background: var(--bg-panel);
  border-bottom: 1px solid var(--border-main);
  padding: 6px 10px;
  font-size: 12px;
  flex-shrink: 0;
}

#settings-panel summary {
  cursor: pointer;
  user-select: none;
  color: var(--text-accent);
  font-weight: 600;
  outline: none;
}

.settings-body {
  margin-top: 6px;
}

.settings-body label {
  display: block;
  margin-bottom: 3px;
  color: var(--text-muted);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.settings-row {
  display: flex;
  gap: 6px;
}

.settings-row input {
  flex: 1;
}

.status-hint {
  display: block;
  margin-top: 4px;
  font-size: 11px;
  color: var(--accent-green);
}

.status-hint.error {
  color: var(--accent-red);
}

/* ── Danger button ────────────────────────────────────────────────────────── */

.danger-btn {
  width: 100%;
  font-size: 11px;
  padding: 5px 10px;
  background: var(--accent-red-bg);
  border: 1px solid var(--accent-red-border);
  color: var(--text-main);
  border-radius: 3px;
  cursor: pointer;
  transition: background 0.15s;
}

.danger-btn:hover {
  background: var(--accent-red-border);
  color: var(--text-bright);
}

.danger-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ── Settings field helpers ───────────────────────────────────────────────── */

.settings-field {
  margin-top: 6px;
}

.settings-field.hidden {
  display: none;
}

.settings-body select,
.settings-body input[type="text"] {
  width: 100%;
  margin-bottom: 6px;
}

select {
  background: var(--bg-input);
  border: 1px solid var(--border-input);
  border-radius: 3px;
  padding: 5px 8px;
  color: var(--text-main);
  font-family: inherit;
  font-size: 12px;
  outline: none;
  transition: border-color 0.15s;
  appearance: auto;
}

select:focus {
  border-color: var(--accent-focus);
}

/* ── Shared input / button styles ─────────────────────────────────────────── */

input[type="text"],
input[type="password"] {
  background: var(--bg-input);
  border: 1px solid var(--border-input);
  border-radius: 3px;
  padding: 5px 8px;
  color: var(--text-main);
  font-family: inherit;
  font-size: 12px;
  outline: none;
  transition: border-color 0.15s;
}

input[type="text"]:focus,
input[type="password"]:focus {
  border-color: var(--accent-focus);
}

button {
  background: var(--accent-primary);
  border: none;
  border-radius: 3px;
  padding: 5px 14px;
  color: var(--text-bright);
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;
}

button:hover {
  background: var(--accent-primary-hover);
}

button:active {
  background: var(--accent-primary-active);
}

button:disabled {
  background: var(--bg-input);
  color: var(--text-dimmed);
  cursor: not-allowed;
}

/* ── Layout toggle buttons ─────────────────────────────────────────────────── */

.layout-toggle {
  display: flex;
  gap: 4px;
  margin-bottom: 6px;
}

.layout-btn {
  flex: 1;
  font-size: 11px;
  padding: 4px 8px;
  background: var(--bg-muted);
  border: 1px solid var(--border-input);
  color: var(--text-muted);
  border-radius: 3px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.layout-btn:hover {
  background: var(--bg-input);
  color: var(--text-main);
}

.layout-btn.active {
  background: var(--accent-primary);
  color: var(--text-bright);
  border-color: var(--accent-primary);
}

/* ── Tab navigation ───────────────────────────────────────────────────────── */

#view-tabs {
  display: flex;
  gap: 0;
  flex-shrink: 0;
  background: var(--bg-panel);
  border-bottom: 1px solid var(--border-main);
}

.tab-btn {
  flex: 1;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 600;
  background: var(--bg-panel);
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--text-muted);
  border-radius: 0;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s, background 0.15s;
}

.tab-btn:hover {
  color: var(--text-main);
  background: var(--bg-hover);
}

.tab-btn.active {
  color: var(--text-accent);
  border-bottom-color: var(--accent-primary);
  background: var(--bg-main);
}

/* ── Main content wrapper ─────────────────────────────────────────────────── */

#app-content {
  flex: 1 1 0;
  min-height: 0;
  overflow: hidden;
}

/* ── Market data panel ────────────────────────────────────────────────────── */

#market-view {
  overflow-y: auto;
  padding: 8px 10px;
}

#market-view h2 {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-heading);
  margin: 0;
}

/* ── Top 20 section container ──────────────────────────────────────────────────── */

.top20-section {
  margin-bottom: 8px;
  border: 1px solid var(--border-section);
  border-radius: 6px;
  background: var(--bg-main);
  overflow: hidden;
}

.top20-section #market-header {
  padding: 4px 10px;
  background: var(--bg-panel);
  border-bottom: 1px solid var(--border-section);
  margin-bottom: 0;
}

#market-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

#market-header h2 {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-heading);
  margin: 0;
}

.market-header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* ── Per-section sort selects ─────────────────────────────────────────────── */

.section-sort-select {
  font-size: 10px;
  padding: 1px 4px;
  background: var(--bg-input);
  border: 1px solid var(--border-input);
  color: var(--text-muted);
  border-radius: 3px;
  cursor: pointer;
}

/* ── View toggle buttons ──────────────────────────────────────────────────── */

.view-toggle {
  display: flex;
  gap: 2px;
}

.view-btn {
  background: var(--bg-muted);
  border: 1px solid var(--border-input);
  border-radius: 3px;
  padding: 2px 7px;
  color: var(--text-muted);
  font-size: 13px;
  cursor: pointer;
  line-height: 1;
  min-width: 24px;
  text-align: center;
  transition: background 0.15s, color 0.15s;
}

.view-btn:hover {
  background: var(--bg-input);
  color: var(--text-main);
}

.view-btn.active {
  background: var(--accent-primary);
  color: var(--text-bright);
  border-color: var(--accent-primary);
}

/* ── Filter bar ───────────────────────────────────────────────────────────── */

.filter-bar {
  display: flex;
  gap: 4px;
  margin-bottom: 6px;
  flex-wrap: wrap;
}

.filter-bar select {
  flex: 1 1 0;
  min-width: 0;
  font-size: 11px;
  padding: 3px 5px;
}

.refresh-btn {
  flex-shrink: 0;
  font-size: 11px;
  padding: 3px 10px;
  background: var(--bg-muted);
  border: 1px solid var(--border-input);
  color: var(--text-main);
  border-radius: 3px;
  cursor: pointer;
  transition: background 0.15s;
}

.refresh-btn:hover {
  background: var(--accent-primary);
  color: var(--text-bright);
}

/* ── Custom filter precision controls ─────────────────────────────────────── */

.custom-filter-group {
  margin-bottom: 6px;
  padding: 4px 6px;
  background: var(--bg-filter);
  border: 1px solid var(--border-main);
  border-radius: 3px;
}

.custom-filter-label {
  display: block;
  font-size: 10px;
  color: var(--text-soft);
  margin-bottom: 2px;
  margin-top: 4px;
}

.custom-filter-label:first-child {
  margin-top: 0;
}

.custom-filter-label .hint {
  color: var(--text-dimmed);
}

.slider-row {
  display: flex;
  gap: 6px;
  align-items: center;
}

.slider-row input[type="range"] {
  flex: 1 1 0;
  min-width: 0;
  height: 16px;
  cursor: pointer;
  accent-color: var(--accent-primary);
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
}

/* Track */
.slider-row input[type="range"]::-webkit-slider-runnable-track {
  height: 4px;
  border-radius: 2px;
  background: var(--border-input);
}

.slider-row input[type="range"]::-moz-range-track {
  height: 4px;
  border-radius: 2px;
  border: none;
  background: var(--border-input);
}

/* Thumb */
.slider-row input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--accent-primary);
  border: none;
  margin-top: -5px;
  transition: background 0.15s;
}

.slider-row input[type="range"]::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--accent-primary);
  border: none;
}

/* Hover / focus */
.slider-row input[type="range"]:hover::-webkit-slider-thumb {
  background: var(--accent-primary-hover);
}

.slider-row input[type="range"]:hover::-moz-range-thumb {
  background: var(--accent-primary-hover);
}

.slider-row input[type="range"]:focus {
  outline: none;
}

.slider-row input[type="range"]:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 2px var(--accent-focus);
}

.slider-row input[type="number"] {
  width: 80px;
  flex-shrink: 0;
  font-size: 11px;
  padding: 2px 4px;
  background: var(--bg-number-input);
  border: 1px solid var(--border-input);
  color: var(--text-main);
  border-radius: 3px;
  text-align: right;
}

.slider-row input[type="number"]:focus {
  outline: 1px solid var(--accent-primary);
  border-color: var(--accent-primary);
}

.loader {
  color: var(--text-muted);
  font-style: italic;
  font-size: 12px;
  padding: 4px 0;
}

/* ── Error recovery banner ────────────────────────────────────────────────── */

.error-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  margin: 4px 0 6px;
  background: var(--accent-red-bg);
  border: 1px solid var(--accent-red-border);
  border-radius: 4px;
  color: var(--accent-red);
  font-size: 12px;
  line-height: 1.4;
}

.error-banner.hidden {
  display: none;
}

.error-banner span {
  flex: 1;
}

.error-banner button {
  flex-shrink: 0;
  padding: 4px 12px;
  font-size: 11px;
  background: var(--accent-red-border);
  color: var(--text-bright);
  border: none;
  border-radius: 3px;
  cursor: pointer;
  white-space: nowrap;
}

.error-banner button:hover {
  background: var(--accent-red-border-hover);
}

.market-empty {
  color: var(--text-muted);
  font-size: 12px;
  padding: 8px 4px;
}

/* ── Market card (shared across all views) ────────────────────────────────── */

.market-card {
  background: var(--bg-panel);
  border: 1px solid var(--border-main);
  border-radius: 4px;
  overflow: hidden;
  transition: border-color 0.15s;
}

.market-card:hover {
  border-color: var(--border-input);
}

.market-card.risky {
  border-color: var(--accent-red-border);
}

.market-card.risky:hover {
  border-color: var(--accent-red-border-hover);
}

.market-card.hype {
  border-color: var(--border-hype);
}

.market-card.hype:hover {
  border-color: var(--border-hype-hover);
}

/* Flip recommendation badges in the card header */

.flip-badges {
  margin-left: auto;
  display: flex;
  gap: 3px;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  min-width: 0;
  flex-shrink: 1;
}

.buy-badge,
.sell-badge,
.profit-badge {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 3px;
  white-space: nowrap;
}

.buy-badge[title],
.sell-badge[title],
.profit-badge[title],
.velocity-badge[title] {
  cursor: help;
}

.buy-badge {
  background: var(--badge-buy-bg);
  color: var(--accent-blue-text);
}

.sell-badge {
  background: var(--badge-sell-bg);
  color: var(--accent-green);
}

.sell-badge.risky {
  background: var(--accent-red-bg);
  color: var(--accent-red);
  font-weight: 600;
}

.profit-badge {
  background: var(--badge-sell-bg);
  color: var(--accent-teal);
  font-weight: 600;
}

.profit-badge.negative {
  background: var(--accent-red-bg);
  color: var(--accent-red);
}

.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-gold-hype);
  font-weight: 600;
  animation: hype-pulse 2s ease-in-out infinite;
}

/* ── Trade velocity badges ────────────────────────────────────────────── */

.velocity-badge {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 3px;
  white-space: nowrap;
  font-weight: 600;
}

.velocity-insta {
  background: rgba(39, 174, 96, 0.18);
  color: var(--accent-green-bright);
}

.velocity-active {
  background: rgba(86, 156, 214, 0.18);
  color: var(--accent-blue-text);
}

.velocity-slow {
  background: rgba(240, 192, 64, 0.18);
  color: var(--accent-gold);
}

.velocity-veryslow {
  background: rgba(136, 136, 136, 0.18);
  color: var(--text-muted);
}

@keyframes hype-pulse {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.6; }
}

.hype-text {
  color: var(--accent-gold-hype) !important;
}

.buy-highlight {
  color: var(--accent-blue-text) !important;
}

.sell-highlight {
  color: var(--accent-teal) !important;
}

.profit-highlight {
  color: var(--accent-teal) !important;
}

.risky-text {
  color: var(--accent-red) !important;
}

/* ── Market search bar ────────────────────────────────────────────────────── */

#market-search-input {
  width: 100%;
  box-sizing: border-box;
  padding: 7px 10px;
  margin-bottom: 6px;
  background: var(--bg-panel);
  color: var(--text-main);
  border: 1px solid var(--bg-input);
  border-radius: 4px;
  font-size: 13px;
  outline: none;
  transition: border-color 0.15s;
}

#market-search-input::placeholder {
  color: var(--text-dimmed);
}

#market-search-input:focus {
  border-color: var(--accent-blue-text);
}

/* ── Search section ────────────────────────────────────────────────────── */

#search-section {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

#search-section #market-search-input {
  flex: 1 1 0;
  min-width: 0;
}

#search-section .view-toggle {
  flex-shrink: 0;
}

#search-results {
  width: 100%;
  margin-top: 6px;
}

#search-results:empty {
  display: none;
}

#search-loading {
  width: 100%;
  font-size: 12px;
  color: var(--text-muted);
  padding: 4px 0;
}

.market-card-header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px 8px;
  padding: 5px 8px;
  cursor: pointer;
  user-select: none;
  min-height: 36px;
}

.market-card-header:hover {
  background: var(--bg-hover);
}

/* \\u2500\\u2500 Sparkline canvas \\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500 */

.sparkline {
  display: block;
  width: 100%;
  height: 30px;
  padding: 0 8px;
  box-sizing: border-box;
  opacity: 0.85;
}

.item-sprite {
  flex-shrink: 0;
  image-rendering: pixelated;
  width: 36px;
  height: 32px;
  object-fit: contain;
}

.market-card .item-name {
  color: var(--text-accent);
  flex: 1 1 0;
  min-width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
}

.item-price {
  color: var(--text-price);
  white-space: nowrap;
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 600;
}

/* ── Expandable detail panel ──────────────────────────────────────────────── */

.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.2s ease, padding 0.2s ease;
  padding: 0 8px;
  background: var(--bg-main);
  border-top: 0px solid var(--border-main);
}

.market-card.expanded .market-card-detail {
  max-height: 400px;
  padding: 6px 8px;
  border-top-width: 1px;
  overflow-y: auto;
}

/* \\u2500\\u2500 Popout button \\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500 */

.popout-btn {
  all: unset;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  color: var(--text-muted);
  padding: 2px 4px;
  border-radius: 3px;
  flex-shrink: 0;
  transition: color 0.15s, background 0.15s;
}

.popout-btn:hover {
  color: var(--accent-blue-text);
  background: rgba(86, 156, 214, 0.12);
}

/* ── Card action button group ──────────────────────────────────────────────── */

.card-actions {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}

/* ── Favourite button ──────────────────────────────────────────────────────── */

.fav-btn {
  all: unset;
  cursor: pointer;
  font-size: 15px;
  line-height: 1;
  color: var(--text-muted);
  padding: 2px 4px;
  border-radius: 3px;
  flex-shrink: 0;
  transition: color 0.15s, transform 0.15s;
}

.fav-btn:hover {
  color: var(--accent-gold);
  transform: scale(1.15);
}

/* Filled star when item is favourited. */
.market-card.favorited .fav-btn,
.modal-fav-btn:has(+ .item-modal-close) {
  /* fallback — override via JS textContent ★ vs ☆ */
}

.market-card.favorited {
  border-left: 2px solid var(--accent-gold);
}

/* Quick-add to portfolio button */

.quick-add-btn {
  all: unset;
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
  color: var(--text-muted);
  padding: 1px 5px;
  border-radius: 3px;
  flex-shrink: 0;
  transition: color 0.15s, background 0.15s;
}

.quick-add-btn:hover {
  color: var(--accent-teal);
  background: rgba(78, 201, 176, 0.12);
}

/* ── External link buttons (Wiki / GE) ─────────────────────────────────────── */

.ext-link {
  all: unset;
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
  color: var(--text-muted);
  padding: 2px 5px;
  border-radius: 3px;
  flex-shrink: 0;
  text-decoration: none;
  transition: color 0.15s, background 0.15s;
}

.ext-link.wiki-link:hover {
  color: var(--accent-blue-text);
  background: rgba(86, 156, 214, 0.12);
}

.ext-link.ge-link:hover {
  color: var(--accent-gold);
  background: rgba(240, 192, 64, 0.12);
}

/* ── Favourites section ────────────────────────────────────────────────────────────── */

.favorites-section {
  margin-bottom: 8px;
  border: 1px solid var(--border-section);
  border-radius: 6px;
  background: var(--bg-main);
  overflow: hidden;
}

.favorites-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 10px;
  background: var(--bg-panel);
  border-bottom: 1px solid var(--border-section);
}

.favorites-header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

#favorites-sort-select {
  font-size: 10px;
  padding: 1px 4px;
  background: var(--bg-input);
  border: 1px solid var(--border-input);
  color: var(--text-muted);
  border-radius: 3px;
  cursor: pointer;
}

.favorites-header h3 {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--accent-gold);
}

.favorites-header .view-btn {
  font-size: 14px;
  padding: 0 4px;
}

/* ── Floating Item Detail Modal ────────────────────────────────────────────── */

.item-modal-backdrop {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 500;
  background: var(--modal-backdrop);
  justify-content: center;
  align-items: center;
}

.item-modal-backdrop.visible {
  display: flex;
}

.item-modal {
  background: var(--bg-main);
  border: 1px solid var(--accent-blue-text);
  border-radius: 6px;
  width: 380px;
  max-width: 92vw;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px var(--modal-shadow);
  animation: modal-in 0.15s ease-out;
}

@keyframes modal-in {
  from { opacity: 0; transform: scale(0.95) translateY(8px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

.item-modal-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--border-main);
}

.item-modal-name {
  flex: 1;
  color: var(--text-accent);
  font-size: 15px;
  font-weight: 600;
}

.item-modal-close {
  all: unset;
  cursor: pointer;
  color: var(--text-muted);
  font-size: 18px;
  line-height: 1;
  padding: 2px 6px;
  border-radius: 3px;
  flex-shrink: 0;
  transition: color 0.15s, background 0.15s;
}

.item-modal-close:hover {
  color: var(--accent-red);
  background: rgba(244, 71, 71, 0.12);
}

.item-modal-body {
  padding: 10px 12px;
}

.item-modal-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 8px;
}

.modal-sparkline {
  display: block;
  width: 100%;
  height: 60px;
  margin-bottom: 8px;
}

.item-modal-details {
  display: flex;
  flex-direction: column;
}

.item-modal-details .detail-row {
  padding: 3px 0;
  font-size: 12px;
}

.item-modal-details .detail-label {
  color: var(--text-muted);
}

.item-modal-details .detail-label[title] {
  cursor: help;
  border-bottom: 1px dotted var(--text-dimmed);
}

.item-modal-details .detail-value {
  color: var(--text-main);
  font-weight: 600;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 2px 0;
  font-size: 11px;
}

.detail-label {
  color: var(--text-muted);
}

.detail-label[title] {
  cursor: help;
  border-bottom: 1px dotted var(--text-dimmed);
}

.detail-value {
  color: var(--text-main);
  font-weight: 600;
}

/* ── List view ────────────────────────────────────────────────────────────── */

.market-items.list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.market-items.list .market-card {
  border-radius: 2px;
}

.market-items.list .item-sprite {
  width: 24px;
  height: 22px;
}

/* ── Tile view ────────────────────────────────────────────────────────────── */

.market-items.tile {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 4px;
}

.market-items.tile .market-card-header {
  flex-direction: column;
  text-align: center;
  padding: 8px 6px;
  gap: 4px;
}

.market-items.tile .item-sprite {
  width: 36px;
  height: 32px;
}

.market-items.tile .item-name {
  font-size: 11px;
  text-align: center;
  white-space: normal;
  overflow: visible;
}

.market-items.tile .item-price {
  font-size: 11px;
}

.market-items.tile .flip-badges {
  margin-left: 0;
  justify-content: center;
  width: 100%;
}

.market-items.tile .buy-badge,
.market-items.tile .sell-badge,
.market-items.tile .profit-badge {
  font-size: 9px;
  padding: 1px 4px;
}

.market-items.tile .sparkline {
  height: 20px;
  padding: 0 4px;
}

/* ─ Expanded card tweaks (tile view) ─ */

.market-items.tile .market-card.expanded .sparkline {
  height: 40px;
  padding: 0 10px;
}

/* ── Hybrid view (compact grid, list-style rows) ──────────────────────────── */

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 3px;
}

.market-items.hybrid .market-card-header {
  padding: 4px 6px;
  gap: 6px;
}

.market-items.hybrid .item-sprite {
  width: 28px;
  height: 24px;
}

.market-items.hybrid .sparkline {
  height: 22px;
  padding: 0 6px;
}

.market-items.hybrid .flip-badges {
  gap: 2px;
}

.market-items.hybrid .buy-badge,
.market-items.hybrid .sell-badge,
.market-items.hybrid .profit-badge {
  font-size: 9px;
  padding: 1px 4px;
}

/* ── Chat / Advisor panel ──────────────────────────────────────────────────── */

#advisor-view {
  display: flex;
  flex-direction: column;
  min-height: 120px;         /* never collapse so small that input disappears */
  overflow: hidden;          /* contain children; chat-history scrolls internally */
  padding: 8px 10px 10px;
}

#advisor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  margin-bottom: 6px;
}

#advisor-view h2 {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-heading);
  margin: 0;
  flex-shrink: 0;
}

#clear-chat-btn {
  font-size: 11px;
  padding: 2px 8px;
  border: 1px solid var(--border-input);
  border-radius: 4px;
  background: transparent;
  color: var(--text-main);
  cursor: pointer;
  transition: background .15s, color .15s;
}
#clear-chat-btn:hover { background: var(--accent-red-dark); color: var(--text-bright); border-color: var(--accent-red-dark); }

#chat-history {
  flex: 1;
  overflow-y: auto;
  border: 1px solid var(--border-main);
  border-radius: 4px;
  background: var(--bg-panel);
  padding: 8px;
  margin-bottom: 6px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* ── Chat bubbles ─────────────────────────────────────────────────────────── */

.chat-msg {
  max-width: 92%;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.chat-msg.user {
  align-self: flex-end;
  background: var(--chat-user-bg);
  color: var(--text-main);
  border-bottom-right-radius: 2px;
}

.chat-msg.assistant {
  align-self: flex-start;
  background: var(--bg-muted);
  color: var(--text-main);
  border-bottom-left-radius: 2px;
}

.chat-msg.system {
  align-self: center;
  background: transparent;
  color: var(--text-muted);
  font-style: italic;
  font-size: 11px;
  text-align: center;
}

.chat-msg.error {
  align-self: center;
  background: var(--chat-error-bg);
  color: var(--accent-red);
  font-size: 11px;
  text-align: center;
}

/* Thinking indicator */
.chat-msg.thinking {
  align-self: flex-start;
  background: transparent;
  color: var(--text-muted);
  font-style: italic;
  font-size: 12px;
}

.chat-msg.thinking::after {
  content: "";
  animation: dots 1.4s steps(4, end) infinite;
}

@keyframes dots {
  0%   { content: ""; }
  25%  { content: "."; }
  50%  { content: ".."; }
  75%  { content: "..."; }
  100% { content: ""; }
}

/* ── Chat input row ───────────────────────────────────────────────────────── */

#chat-input-row {
  display: flex;
  gap: 6px;
  flex-shrink: 0;            /* never collapse — always visible */
  padding-top: 2px;
}

#chat-input {
  flex: 1;
}

/* ── Portfolio view ─────────────────────────────────────────────────────────────────── */

#portfolio-view {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 8px 10px 10px;
}

#portfolio-view h2 {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-heading);
  margin: 0 0 6px;
  flex-shrink: 0;
}

/* Add-flip form */

.portfolio-form {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
  padding: 6px;
  background: var(--bg-panel);
  border: 1px solid var(--border-main);
  border-radius: 4px;
}

.portfolio-form input[type="text"],
.portfolio-form input[type="number"] {
  width: 100%;
  font-size: 11px;
  padding: 4px 6px;
  background: var(--bg-input);
  border: 1px solid var(--border-input);
  border-radius: 3px;
  color: var(--text-main);
}

.portfolio-form input[type="text"]:focus,
.portfolio-form input[type="number"]:focus {
  border-color: var(--accent-focus);
  outline: none;
}

/* Autocomplete dropdown */

.autocomplete-wrap {
  position: relative;
}

.autocomplete-list {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 50;
  max-height: 180px;
  overflow-y: auto;
  background: var(--bg-elevated);
  border: 1px solid var(--accent-focus);
  border-top: none;
  border-radius: 0 0 4px 4px;
}

.autocomplete-list.open {
  display: block;
}

.autocomplete-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  font-size: 11px;
  color: var(--text-main);
  cursor: pointer;
  transition: background .1s;
}

.autocomplete-item:hover,
.autocomplete-item.highlighted {
  background: var(--accent-primary-active);
}

.autocomplete-item-price {
  color: var(--accent-green);
  font-size: 10px;
  margin-left: 8px;
  flex-shrink: 0;
}

.autocomplete-empty {
  padding: 6px 8px;
  font-size: 11px;
  color: var(--text-dimmed);
  font-style: italic;
}

.autocomplete-section {
  padding: 3px 8px;
  font-size: 9px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: var(--bg-main);
  border-top: 1px solid var(--border-main);
  position: sticky;
  top: 0;
  z-index: 1;
}

.autocomplete-section:first-child {
  border-top: none;
}

.portfolio-form-row {
  display: flex;
  gap: 4px;
}

.portfolio-form-row input {
  flex: 1;
  min-width: 0;
}

#add-flip-btn {
  font-size: 11px;
  padding: 4px 10px;
  background: var(--add-flip-bg);
  border: none;
  border-radius: 3px;
  color: var(--text-bright);
  cursor: pointer;
  font-weight: 600;
  transition: background .15s;
}

#add-flip-btn:hover {
  background: var(--accent-green-bright);
}

/* Active flips list */

#active-flips-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.flip-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 6px 8px;
  background: var(--bg-panel);
  border: 1px solid var(--border-main);
  border-radius: 4px;
  font-size: 11px;
  transition: border-color .3s;
}

.flip-card.limit-ready {
  border-color: var(--accent-green-bright);
  background: var(--limit-ready-bg);
}

.flip-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flip-item-name {
  font-weight: 600;
  color: var(--text-accent);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.flip-remove-btn {
  background: transparent;
  border: 1px solid var(--border-input);
  border-radius: 3px;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 10px;
  padding: 1px 6px;
  transition: background .15s, color .15s;
}

.flip-remove-btn:hover {
  background: var(--accent-red-dark);
  color: var(--text-bright);
  border-color: var(--accent-red-dark);
}

.flip-details {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 12px;
  color: var(--text-soft);
}

.flip-details span {
  white-space: nowrap;
}

.flip-timer {
  font-weight: 600;
  color: var(--text-heading);
}

.flip-timer.ready {
  color: var(--accent-green-bright);
}

.flip-profit {
  color: var(--accent-green);
  font-weight: 600;
}

.flip-profit.loss {
  color: var(--accent-red);
}

.portfolio-empty {
  color: var(--text-dimmed);
  font-size: 11px;
  font-style: italic;
  padding: 8px 0;
}

/* ── Portfolio sub-navigation ───────────────────────────────────────────────── */

.portfolio-sub-nav {
  display: flex;
  gap: 2px;
  margin-bottom: 8px;
  border-bottom: 1px solid var(--border-main);
  padding-bottom: 4px;
}

.portfolio-sub-btn {
  flex: 1;
  padding: 5px 8px;
  background: transparent;
  border: 1px solid var(--border-subtle);
  border-radius: 4px 4px 0 0;
  color: var(--text-muted);
  font-size: 11px;
  cursor: pointer;
  transition: background .15s, color .15s, border-color .15s;
}

.portfolio-sub-btn:hover {
  color: var(--text-main);
  border-color: var(--text-dimmed);
}

.portfolio-sub-btn.active {
  background: var(--bg-elevated);
  color: var(--text-main);
  border-color: var(--accent-primary);
  border-bottom: 2px solid var(--accent-primary);
}

/* ── Portfolio stats dashboard ──────────────────────────────────────────────── */

.portfolio-stats {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.stat-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 6px;
  background: var(--bg-panel);
  border: 1px solid var(--border-main);
  border-radius: 4px;
}

.stat-label {
  font-size: 10px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
}

.stat-value.profit {
  color: var(--accent-green);
}

.stat-value.loss {
  color: var(--accent-red);
}

/* ── Completed flip cards ───────────────────────────────────────────────────── */

.completed-flip-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 6px 8px;
  background: var(--bg-panel);
  border: 1px solid var(--border-main);
  border-left: 3px solid var(--border-main);
  border-radius: 4px;
  font-size: 11px;
  margin-bottom: 4px;
}

.completed-flip-card.win {
  border-left-color: var(--accent-green-bright);
  background: linear-gradient(90deg, rgba(39,174,96,0.06) 0%, transparent 40%);
}

.completed-flip-card.loss {
  border-left-color: var(--accent-red-dark);
  background: linear-gradient(90deg, rgba(192,57,43,0.06) 0%, transparent 40%);
}

.completed-flip-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.completed-flip-top .flip-item-name {
  font-weight: 600;
  color: var(--text-accent);
}

.completed-flip-date {
  font-size: 10px;
  color: var(--text-dimmed);
}

.completed-flip-details {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 12px;
  color: var(--text-soft);
}

.completed-flip-details span {
  white-space: nowrap;
}

.completed-flip-profit {
  font-weight: 600;
}

.completed-flip-profit.win {
  color: var(--accent-green);
}

.completed-flip-profit.loss {
  color: var(--accent-red);
}

/* ── Complete flip button ───────────────────────────────────────────────────── */

.flip-card-actions {
  display: flex;
  gap: 4px;
  align-items: center;
  flex-shrink: 0;
}

.flip-complete-btn {
  background: transparent;
  border: 1px solid var(--border-input);
  border-radius: 3px;
  color: var(--accent-green);
  cursor: pointer;
  font-size: 11px;
  padding: 1px 6px;
  transition: background .15s, color .15s;
}

.flip-complete-btn:hover {
  background: var(--accent-green-bright);
  color: var(--text-bright);
  border-color: var(--accent-green-bright);
}

/* ── Webkit scrollbar styling ─────────────────────────────────────────────── */

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: var(--bg-main);
}

::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--scrollbar-thumb-hover);
}

/* ═════════════════════════════════════════════════════════════════════════════
 *  LAYOUT MODES — driven by body[data-layout]
 * ═════════════════════════════════════════════════════════════════════════════ */

/* ── Tabbed layout (default — compact, in-game overlay) ───────────────────── */

body[data-layout="tabbed"] #view-tabs {
  display: flex;
}

body[data-layout="tabbed"] #app-content {
  display: flex;
  flex-direction: column;
}

body[data-layout="tabbed"] #market-view {
  flex: 1 1 0;
  display: none;                 /* hidden by default; .active-tab shows it */
}

body[data-layout="tabbed"] #advisor-view {
  flex: 1 1 0;
  display: none;
}

body[data-layout="tabbed"] #portfolio-view {
  flex: 1 1 0;
  display: none;
}

body[data-layout="tabbed"] #market-view.active-tab,
body[data-layout="tabbed"] #advisor-view.active-tab,
body[data-layout="tabbed"] #portfolio-view.active-tab {
  display: flex;
  flex-direction: column;
}

/* Market view in tabbed layout renders as a column */
body[data-layout="tabbed"] #market-view.active-tab {
  display: block;
  overflow-y: auto;
}

/* Smooth tab transitions */
body[data-layout="tabbed"] #market-view,
body[data-layout="tabbed"] #advisor-view,
body[data-layout="tabbed"] #portfolio-view {
  opacity: 0;
  transition: opacity 0.15s ease;
}

body[data-layout="tabbed"] #market-view.active-tab,
body[data-layout="tabbed"] #advisor-view.active-tab,
body[data-layout="tabbed"] #portfolio-view.active-tab {
  opacity: 1;
}

/* ── Sidebar layout (side-by-side, second monitor) ────────────────────────── */

body[data-layout="sidebar"] #view-tabs {
  display: none;                 /* tabs not needed in sidebar mode */
}

body[data-layout="sidebar"] #app-content {
  display: flex;
  flex-direction: row;
  gap: 1px;
}

body[data-layout="sidebar"] #market-view {
  width: 360px;
  flex-shrink: 0;
  overflow-y: auto;
  border-right: 1px solid var(--border-main);
  display: block;
}

/* Force list-style column layout for market items in sidebar */
body[data-layout="sidebar"] #market-items.tile,
body[data-layout="sidebar"] #market-items.hybrid {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

body[data-layout="sidebar"] #market-items.tile .market-card-header,
body[data-layout="sidebar"] #market-items.hybrid .market-card-header {
  flex-direction: row;
  text-align: left;
}

body[data-layout="sidebar"] #advisor-view {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

body[data-layout="sidebar"] #portfolio-view {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  min-width: 0;
  border-left: 1px solid var(--border-main);
}

/* ══════════════════════════════════════════════════════════════════════════════
   Desktop / wide-viewport overrides
   ══════════════════════════════════════════════════════════════════════════════ */

@media (min-width: 800px) {
  /* More breathing room on the main content and settings. */
  #app-content {
    padding: 0 8px;
  }

  #market-view {
    padding: 10px 18px;
  }

  #settings-panel {
    padding: 8px 18px;
  }

  /* Wider modal with larger sparkline. */
  .item-modal {
    width: 560px;
    max-width: 600px;
  }

  .modal-sparkline {
    height: 80px;
  }

  .item-modal-header {
    padding: 12px 16px;
  }

  .item-modal-body {
    padding: 0 4px;
  }

  .item-modal-details .detail-row {
    padding: 3px 0;
  }

  /* Tile view — allow more cards per row on wider screens. */
  .market-items.tile {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 6px;
  }

  /* Hybrid view — wider minimum for richer card content. */
  .market-items.hybrid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 5px;
  }

  /* Slightly larger sparklines on cards. */
  .sparkline {
    height: 36px;
  }

  /* Advisor chat gets more comfortable padding. */
  #advisor-view {
    padding: 10px 18px;
  }

  #portfolio-view {
    padding: 10px 18px;
  }
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/runtime/api.js"
/*!******************************************************!*\
  !*** ../node_modules/css-loader/dist/runtime/api.js ***!
  \******************************************************/
(module) {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ },

/***/ "../node_modules/css-loader/dist/runtime/noSourceMaps.js"
/*!***************************************************************!*\
  !*** ../node_modules/css-loader/dist/runtime/noSourceMaps.js ***!
  \***************************************************************/
(module) {



module.exports = function (i) {
  return i[1];
};

/***/ },

/***/ "./style.css"
/*!*******************!*\
  !*** ./style.css ***!
  \*******************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "../node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "../node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "../node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "../node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./style.css */ "../node_modules/css-loader/dist/cjs.js!./style.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());
options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ },

/***/ "../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"
/*!*****************************************************************************!*\
  !*** ../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \*****************************************************************************/
(module) {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ },

/***/ "../node_modules/style-loader/dist/runtime/insertBySelector.js"
/*!*********************************************************************!*\
  !*** ../node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \*********************************************************************/
(module) {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ },

/***/ "../node_modules/style-loader/dist/runtime/insertStyleElement.js"
/*!***********************************************************************!*\
  !*** ../node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \***********************************************************************/
(module) {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ },

/***/ "../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"
/*!***********************************************************************************!*\
  !*** ../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \***********************************************************************************/
(module, __unused_webpack_exports, __webpack_require__) {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ },

/***/ "../node_modules/style-loader/dist/runtime/styleDomAPI.js"
/*!****************************************************************!*\
  !*** ../node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \****************************************************************/
(module) {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ },

/***/ "../node_modules/style-loader/dist/runtime/styleTagTransform.js"
/*!**********************************************************************!*\
  !*** ../node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \**********************************************************************/
(module) {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ },

/***/ "./services/cacheService.ts"
/*!**********************************!*\
  !*** ./services/cacheService.ts ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CacheService: () => (/* binding */ CacheService)
/* harmony export */ });
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
/** Default configuration values. */
const DEFAULTS = {
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
class CacheService {
    /**
     * Create a new cache service instance.
     * @param config - Optional overrides for DB name, store name, and TTL.
     */
    constructor(config) {
        /** Lazily initialised database handle. */
        this.db = null;
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
    async open() {
        if (this.db)
            return this.db;
        return new Promise((resolve, reject) => {
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
    async bulkInsert(prices) {
        const db = this.ensureOpen();
        const now = Date.now();
        const today = new Date(now).toISOString().slice(0, 10);
        return new Promise((resolve, reject) => {
            const tx = db.transaction([this.storeName, HISTORY_STORE], "readwrite");
            const store = tx.objectStore(this.storeName);
            const histStore = tx.objectStore(HISTORY_STORE);
            let count = 0;
            for (const [name, record] of prices) {
                const stored = {
                    ...record,
                    name,
                    fetchedAt: now,
                };
                const req = store.put(stored);
                req.onsuccess = () => {
                    count++;
                };
                // Also persist a daily snapshot (compound key [name, day] deduplicates).
                const historical = { ...stored, day: today };
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
    // ─── Read Operations ──────────────────────────────────────────────────
    /**
     * Retrieve every cached price record.
     *
     * @returns An array of all {@link StoredPriceRecord} objects currently in the store.
     */
    async getAll() {
        const db = this.ensureOpen();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(this.storeName, "readonly");
            const store = tx.objectStore(this.storeName);
            const req = store.getAll();
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }
    /**
     * Retrieve a single cached record by item name.
     *
     * @param name - Canonical RS3 item name.
     * @returns The stored record, or `undefined` if not found.
     */
    async getByName(name) {
        const db = this.ensureOpen();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(this.storeName, "readonly");
            const store = tx.objectStore(this.storeName);
            const req = store.get(name);
            req.onsuccess = () => resolve(req.result);
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
    async getHistoricalRecords(itemName, days) {
        const db = this.ensureOpen();
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        const cutoffDay = cutoff.toISOString().slice(0, 10);
        return new Promise((resolve, reject) => {
            const tx = db.transaction(HISTORY_STORE, "readonly");
            const store = tx.objectStore(HISTORY_STORE);
            const index = store.index("name");
            const req = index.getAll(IDBKeyRange.only(itemName));
            req.onsuccess = () => {
                const all = req.result;
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
    async getRecentHistory(days) {
        const db = this.ensureOpen();
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        const cutoffDay = cutoff.toISOString().slice(0, 10);
        return new Promise((resolve, reject) => {
            const tx = db.transaction(HISTORY_STORE, "readonly");
            const store = tx.objectStore(HISTORY_STORE);
            const index = store.index("day");
            const range = IDBKeyRange.lowerBound(cutoffDay);
            const req = index.getAll(range);
            req.onsuccess = () => resolve(req.result);
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
    async isStale() {
        const db = this.ensureOpen();
        return new Promise((resolve, reject) => {
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
                const record = cursor.value;
                const age = Date.now() - record.fetchedAt;
                const stale = age > this.ttlMs;
                console.log(`[CacheService] Newest record age: ${(age / 1000 / 60).toFixed(1)} min — ` +
                    `cache is ${stale ? "STALE" : "FRESH"}.`);
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
    async clear() {
        const db = this.ensureOpen();
        return new Promise((resolve, reject) => {
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
    ensureOpen() {
        if (!this.db) {
            throw new Error("[CacheService] Database not open. Call `await cacheService.open()` first.");
        }
        return this.db;
    }
}


/***/ },

/***/ "./services/coreKnowledge.ts"
/*!***********************************!*\
  !*** ./services/coreKnowledge.ts ***!
  \***********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RS3_ECONOMIC_RULES: () => (/* binding */ RS3_ECONOMIC_RULES)
/* harmony export */ });
/**
 * @module coreKnowledge
 * Static knowledge base of RS3 economic mechanics injected into every LLM
 * system prompt.  These rules are non-negotiable and supersede any outside
 * knowledge the model may have been trained on.
 */
/** Foundational RS3 economic rules the LLM must internalise before answering. */
const RS3_ECONOMIC_RULES = `\
=== RS3 ECONOMIC LAWS (STRICT ADHERENCE REQUIRED) ===
1. GE TAX: All items sold on the Grand Exchange are subject to a 2% tax (0.02) subtracted from the final sale price. You MUST deduct 2% from the gross revenue before calculating profit or Return on Investment (ROI). Items traded for 50 gp or less are exempt.
2. BUY LIMITS: Every item has a 4-hour buy limit. A player cannot physically buy more than this number within a 4-hour window. Your volume recommendations must never exceed an item's realistic buy limit.
3. MARGIN CHECKING: To find a margin, a player "insta-buys" an item (+20% price) to find the current lowest sell offer, then "insta-sells" (-20% price) to find the current highest buy offer. The gap between these, MINUS the 2% tax on the higher number, is the true profit margin.
4. HIGH ALCHEMY: The High Alchemy value of an item often acts as its absolute price floor. GP enters the game primarily through High Alchemy and monster drops.`;


/***/ },

/***/ "./services/index.ts"
/*!***************************!*\
  !*** ./services/index.ts ***!
  \***************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CacheService: () => (/* reexport safe */ _cacheService__WEBPACK_IMPORTED_MODULE_1__.CacheService),
/* harmony export */   LLMRequestError: () => (/* reexport safe */ _llmService__WEBPACK_IMPORTED_MODULE_4__.LLMRequestError),
/* harmony export */   LLMService: () => (/* reexport safe */ _llmService__WEBPACK_IMPORTED_MODULE_4__.LLMService),
/* harmony export */   LLM_PROVIDERS: () => (/* reexport safe */ _types__WEBPACK_IMPORTED_MODULE_8__.LLM_PROVIDERS),
/* harmony export */   MarketAnalyzerService: () => (/* reexport safe */ _marketAnalyzerService__WEBPACK_IMPORTED_MODULE_2__.MarketAnalyzerService),
/* harmony export */   PortfolioService: () => (/* reexport safe */ _portfolioService__WEBPACK_IMPORTED_MODULE_5__.PortfolioService),
/* harmony export */   RS3_ECONOMIC_RULES: () => (/* reexport safe */ _coreKnowledge__WEBPACK_IMPORTED_MODULE_6__.RS3_ECONOMIC_RULES),
/* harmony export */   WeirdGloopService: () => (/* reexport safe */ _weirdGloopService__WEBPACK_IMPORTED_MODULE_0__.WeirdGloopService),
/* harmony export */   WikiService: () => (/* reexport safe */ _wikiService__WEBPACK_IMPORTED_MODULE_3__.WikiService),
/* harmony export */   fetchGECatalogue: () => (/* reexport safe */ _initDataPipeline__WEBPACK_IMPORTED_MODULE_7__.fetchGECatalogue),
/* harmony export */   initDataPipeline: () => (/* reexport safe */ _initDataPipeline__WEBPACK_IMPORTED_MODULE_7__.initDataPipeline)
/* harmony export */ });
/* harmony import */ var _weirdGloopService__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./weirdGloopService */ "./services/weirdGloopService.ts");
/* harmony import */ var _cacheService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./cacheService */ "./services/cacheService.ts");
/* harmony import */ var _marketAnalyzerService__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./marketAnalyzerService */ "./services/marketAnalyzerService.ts");
/* harmony import */ var _wikiService__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./wikiService */ "./services/wikiService.ts");
/* harmony import */ var _llmService__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./llmService */ "./services/llmService.ts");
/* harmony import */ var _portfolioService__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./portfolioService */ "./services/portfolioService.ts");
/* harmony import */ var _coreKnowledge__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./coreKnowledge */ "./services/coreKnowledge.ts");
/* harmony import */ var _initDataPipeline__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./initDataPipeline */ "./services/initDataPipeline.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./types */ "./services/types.ts");
/**
 * @module services barrel
 * Re-exports for clean imports throughout the application.
 */











/***/ },

/***/ "./services/initDataPipeline.ts"
/*!**************************************!*\
  !*** ./services/initDataPipeline.ts ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fetchGECatalogue: () => (/* binding */ fetchGECatalogue),
/* harmony export */   initDataPipeline: () => (/* binding */ initDataPipeline)
/* harmony export */ });
/* harmony import */ var _cacheService__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cacheService */ "./services/cacheService.ts");
/* harmony import */ var _weirdGloopService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./weirdGloopService */ "./services/weirdGloopService.ts");
/* harmony import */ var _wikiService__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./wikiService */ "./services/wikiService.ts");
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



/** URL for the RS Wiki’s full GE item-ID catalogue (JSON). */
const GE_CATALOGUE_URL = "https://runescape.wiki/w/Module:GEIDs/data.json?action=raw";
/**
 * A curated seed list of heavily-traded RS3 items used to bootstrap the
 * database on first run.  Extend this list as the analysis pipeline grows.
 *
 * These names must be **exact** canonical RS Wiki titles.
 */
const SEED_ITEMS = [
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
async function initDataPipeline() {
    console.log("┌─────────────────────────────────────────────┐");
    console.log("│  GE Market Analyzer — Data Pipeline Start   │");
    console.log("└─────────────────────────────────────────────┘");
    const cache = new _cacheService__WEBPACK_IMPORTED_MODULE_0__.CacheService();
    const api = new _weirdGloopService__WEBPACK_IMPORTED_MODULE_1__.WeirdGloopService();
    // Step 1 — Open the database (creates store on first run).
    try {
        await cache.open();
    }
    catch (err) {
        console.error("[initDataPipeline] Fatal: could not open IndexedDB.", err);
        throw err;
    }
    // Step 2 — Determine if we need fresh data.
    const stale = await cache.isStale();
    if (stale) {
        console.log("[initDataPipeline] Cache is stale — fetching fresh prices…");
        // Step 3a — Fetch from API (batched + concurrent).
        let prices;
        try {
            prices = await api.fetchLatestPrices(SEED_ITEMS);
        }
        catch (fetchErr) {
            console.error("[initDataPipeline] Network error fetching prices:", fetchErr);
            throw new Error("Could not reach the Weird Gloop API — check your internet connection and try again.");
        }
        if (prices.size === 0) {
            console.warn("[initDataPipeline] API returned zero records. Cache will remain empty.");
        }
        else {
            // Step 3b — Enrich records with GE buy limits from the wiki.
            const wiki = new _wikiService__WEBPACK_IMPORTED_MODULE_2__.WikiService();
            const itemNames = Array.from(prices.keys());
            let buyLimits;
            try {
                buyLimits = await wiki.getBulkBuyLimits(itemNames);
            }
            catch (wikiErr) {
                console.warn("[initDataPipeline] Wiki buy-limit fetch failed — continuing without limits.", wikiErr);
                buyLimits = new Map();
            }
            for (const [name, record] of prices) {
                const limit = buyLimits.get(name);
                if (limit !== undefined) {
                    record.buyLimit = limit;
                }
            }
            console.log(`[initDataPipeline] Enriched ${buyLimits.size} / ${prices.size} records with buy limits.`);
            // Step 3c — Persist enriched records into IndexedDB.
            const written = await cache.bulkInsert(prices);
            console.log(`[initDataPipeline] Wrote ${written} records to cache.`);
        }
    }
    else {
        console.log("[initDataPipeline] Cache is fresh — skipping API fetch.");
    }
    // Step 4 — Return all cached data for downstream consumers.
    const records = await cache.getAll();
    console.log(`[initDataPipeline] Pipeline complete. ${records.length} records available.`);
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
async function fetchGECatalogue() {
    console.log("[GECatalogue] Fetching full item catalogue from RS Wiki…");
    try {
        const response = await fetch(GE_CATALOGUE_URL, {
            method: "GET",
            headers: { Accept: "application/json" },
        });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} ${response.statusText}`);
        }
        const json = await response.json();
        // Filter out the metadata keys that start with "%".
        const entries = [];
        for (const [name, id] of Object.entries(json)) {
            if (!name.startsWith("%") && typeof id === "number") {
                entries.push({ name, id });
            }
        }
        entries.sort((a, b) => a.name.localeCompare(b.name));
        console.log(`[GECatalogue] Loaded ${entries.length} tradeable items.`);
        return entries;
    }
    catch (err) {
        console.error("[GECatalogue] Failed to fetch catalogue:", err);
        return [];
    }
}


/***/ },

/***/ "./services/llmService.ts"
/*!********************************!*\
  !*** ./services/llmService.ts ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LLMRequestError: () => (/* binding */ LLMRequestError),
/* harmony export */   LLMService: () => (/* binding */ LLMService)
/* harmony export */ });
/* harmony import */ var _coreKnowledge__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./coreKnowledge */ "./services/coreKnowledge.ts");
/**
 * @module LLMService
 * OpenAI-compatible chat-completion client for RAG synthesis.
 *
 * Responsibilities:
 *  - Construct a strict system prompt that grounds the LLM in provided data.
 *  - Build a well-typed `ChatCompletionRequest` from market data + wiki text.
 *  - Execute the POST via native `fetch` — no external SDK dependencies.
 *  - Surface descriptive typed errors for common failure modes (401, 429, etc.).
 *
 * Designed for Groq (default) but works with any OpenAI-compatible endpoint
 * (OpenAI, Together, Ollama, LM Studio, etc.) by overriding {@link LLMConfig}.
 */

/** Sensible defaults — Groq free tier with `llama3-8b-8192`. */
const DEFAULTS = {
    apiKey: "",
    endpoint: "https://api.groq.com/openai/v1/chat/completions",
    model: "llama3-8b-8192",
    temperature: 0.4,
    maxTokens: 1024,
};
/**
 * Service that synthesises GE market data and RS3 Wiki text into
 * actionable money-making advice via an LLM chat-completion API.
 *
 * @example
 * ```ts
 * const llm = new LLMService({ apiKey: "gsk_…" });
 * const advice = await llm.generateAdvice(
 *   "What should I flip right now?",
 *   formattedMarketData,
 *   wikiGuideText,
 * );
 * console.log(advice);
 * ```
 */
class LLMService {
    /**
     * @param config - All fields have sensible defaults targeting Groq's free tier.
     *                 For hosted providers, `apiKey` is required. For self-hosted
     *                 models the key may be omitted.
     */
    constructor(config = {}) {
        /** Running conversation history sent with every request. */
        this._messages = [];
        this.apiKey = config.apiKey ?? "";
        this.endpoint = config.endpoint ?? DEFAULTS.endpoint;
        this.model = config.model ?? DEFAULTS.model;
        this.temperature = config.temperature ?? DEFAULTS.temperature;
        this.maxTokens = config.maxTokens ?? DEFAULTS.maxTokens;
        // Seed the conversation with the system prompt.
        this._messages = [{ role: "system", content: this.buildSystemMessage() }];
    }
    // ─── Public API ───────────────────────────────────────────────────────
    /**
     * Read-only snapshot of the current conversation history.
     * Includes the system prompt, all user queries, and all assistant replies.
     */
    get messages() {
        return this._messages;
    }
    /**
     * Overwrite the internal conversation history with previously-saved data.
     * Use this to restore a session from `localStorage`.
     *
     * @param saved - A serialised `ChatMessage[]` array. If the first entry is
     *                not a system message, the current system prompt is
     *                prepended automatically.
     */
    loadHistory(saved) {
        if (saved.length === 0 || saved[0].role !== "system") {
            this._messages = [
                { role: "system", content: this.buildSystemMessage() },
                ...saved,
            ];
        }
        else {
            // Replace the saved system prompt with the canonical one (in case
            // rules changed between sessions).
            this._messages = [
                { role: "system", content: this.buildSystemMessage() },
                ...saved.slice(1),
            ];
        }
    }
    /**
     * Reset conversation history back to just the base system prompt.
     */
    clearHistory() {
        this._messages = [{ role: "system", content: this.buildSystemMessage() }];
    }
    /**
     * Generate a money-making advice response from the LLM.
     *
     * The method appends the user message to the running conversation,
     * sends the full history to the model, and appends the assistant's reply.
     *
     * @param query      - The player's free-form question
     *                     (e.g. "What should I flip right now?").
     * @param marketData - Pre-formatted top-N market summary string produced
     *                     by {@link MarketAnalyzerService.formatForLLM}.
     * @param wikiText   - Concatenated plain-text wiki guide extracts
     *                     (may be empty if no guides were found).
     * @returns The assistant's generated advice text.
     * @throws {LLMRequestError} On HTTP-level failures (401, 429, 5xx, etc.).
     */
    async generateAdvice(query, marketData, wikiText) {
        const userMsg = this.buildUserMessage(query, marketData, wikiText);
        this._messages.push({ role: "user", content: userMsg });
        console.log(`[LLMService] Sending ${this._messages.length} messages to ${this.model} at ${this.endpoint}…`);
        const body = {
            model: this.model,
            messages: [...this._messages],
            temperature: this.temperature,
            max_tokens: this.maxTokens,
        };
        const headers = {
            "Content-Type": "application/json",
        };
        if (this.apiKey) {
            headers["Authorization"] = `Bearer ${this.apiKey}`;
        }
        const response = await fetch(this.endpoint, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            // Remove the user message we just pushed so the history stays clean.
            this._messages.pop();
            await this.handleHttpError(response);
        }
        const json = await response.json();
        const reply = json.choices?.[0]?.message?.content?.trim();
        if (!reply) {
            this._messages.pop();
            throw new LLMRequestError("LLM returned an empty or malformed response.", 0, JSON.stringify(json));
        }
        // Append the assistant's reply to the running history.
        this._messages.push({ role: "assistant", content: reply });
        if (json.usage) {
            console.debug(`[LLMService] Token usage — prompt: ${json.usage.prompt_tokens}, ` +
                `completion: ${json.usage.completion_tokens}, ` +
                `total: ${json.usage.total_tokens}.`);
        }
        return reply;
    }
    // ─── Private: Prompt Construction ─────────────────────────────────────
    /**
     * Build the system message that anchors the LLM to its role and
     * explicitly forbids hallucination.
     *
     * The prompt:
     *  - Defines the persona (RS3 Grand Exchange instructor).
     *  - Mandates exclusive use of the provided data and wiki text.
     *  - Forbids inventing prices, volumes, or game mechanics.
     *  - Instructs clear, concise formatting suitable for an Alt1 overlay.
     *
     * @returns The system prompt string.
     */
    buildSystemMessage() {
        return [
            "You are a RuneScape 3 Grand Exchange specialist and money-making instructor.",
            "",
            "STRICT RULES — you MUST follow all of these:",
            "1. ONLY use the Grand Exchange market data and RS Wiki text provided in the user message.",
            "2. NEVER invent, guess, or hallucinate prices, trade volumes, profit margins, or game mechanics.",
            "3. If the provided data is insufficient to answer a question, say so explicitly — do NOT fill gaps with assumptions.",
            "4. When recommending items to buy or sell, cite the exact price and volume numbers from the provided data.",
            "5. When referencing a money-making method, quote or paraphrase the wiki text — do not add steps that are not in the source.",
            "6. Keep responses concise and actionable. Use bullet points or numbered lists.",
            "7. Format gold values with standard RS3 abbreviations (K, M, B).",
            "8. If no wiki guide exists for an item, only discuss it from the market-data perspective.",
            "",
            "The following RS3 economic laws are ABSOLUTE. They supersede any conflicting outside knowledge you may have. Apply them to every calculation.",
            "",
            _coreKnowledge__WEBPACK_IMPORTED_MODULE_0__.RS3_ECONOMIC_RULES,
            "",
            "Your audience is an experienced RS3 player viewing this inside the Alt1 Toolkit overlay. Be direct and efficient.",
        ].join("\n");
    }
    /**
     * Assemble the user message that delivers the RAG context alongside the
     * player's actual query.
     *
     * Structure:
     * ```
     * === GRAND EXCHANGE DATA ===
     * …market summary…
     *
     * === WIKI GUIDE TEXT ===
     * …extracted guides (or "[none available]")…
     *
     * === PLAYER QUESTION ===
     * …free-form query…
     * ```
     *
     * @param query      - Player's question.
     * @param marketData - Formatted market data block.
     * @param wikiText   - Wiki guide text (may be empty).
     * @returns The composed user prompt string.
     */
    buildUserMessage(query, marketData, wikiText) {
        const wikiSection = wikiText.trim().length > 0
            ? wikiText.trim()
            : "[No wiki guide text available for the queried items.]";
        return [
            "=== GRAND EXCHANGE DATA ===",
            marketData,
            "",
            "=== WIKI GUIDE TEXT ===",
            wikiSection,
            "",
            "=== PLAYER QUESTION ===",
            query,
        ].join("\n");
    }
    // ─── Private: Error Handling ──────────────────────────────────────────
    /**
     * Inspect a non-OK HTTP response and throw a descriptive
     * {@link LLMRequestError}.
     *
     * Common cases:
     * | Status | Likely cause                        |
     * |--------|-------------------------------------|
     * | 401    | Missing or invalid API key           |
     * | 403    | Key lacks required permissions       |
     * | 429    | Rate limit / quota exceeded          |
     * | 500+   | Upstream model or infra failure      |
     *
     * @param response - The `fetch` Response object with `ok === false`.
     * @throws {LLMRequestError} Always.
     */
    async handleHttpError(response) {
        let bodyText;
        try {
            bodyText = await response.text();
        }
        catch {
            bodyText = "[unable to read response body]";
        }
        const status = response.status;
        let hint;
        switch (status) {
            case 401:
                hint = "Unauthorized — check that your API key is valid and correctly configured.";
                break;
            case 403:
                hint = "Forbidden — the API key may lack the required permissions.";
                break;
            case 429:
                hint = "Rate limited — you have exceeded the API quota. Wait and retry.";
                break;
            default:
                hint = status >= 500
                    ? "Server error on the LLM provider side. Try again later."
                    : `Unexpected HTTP ${status}.`;
        }
        throw new LLMRequestError(`[LLMService] ${hint} (HTTP ${status} ${response.statusText})`, status, bodyText);
    }
}
// ─── Custom Error Class ─────────────────────────────────────────────────────
/**
 * Typed error thrown by {@link LLMService} on HTTP or response-parsing failures.
 * Carries the HTTP status code and raw response body for upstream diagnostics.
 */
class LLMRequestError extends Error {
    constructor(message, status, responseBody) {
        super(message);
        this.name = "LLMRequestError";
        this.status = status;
        this.responseBody = responseBody;
    }
}


/***/ },

/***/ "./services/marketAnalyzerService.ts"
/*!*******************************************!*\
  !*** ./services/marketAnalyzerService.ts ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MarketAnalyzerService: () => (/* binding */ MarketAnalyzerService)
/* harmony export */ });
/**
 * @module MarketAnalyzerService
 * Deterministic filtering pipeline that transforms raw cached GE data into a
 * ranked, LLM-ready summary of the most profitable RS3 markets **from a
 * single player’s perspective**.
 *
 * Pipeline stages:
 *  1. **Retrieve** — pull every {@link StoredPriceRecord} from IndexedDB.
 *  2. **Score**    — compute player-constrained metrics:
 *                    • `effectivePlayerVolume = min(volume, buyLimit × 6)`
 *                    • `maxCapitalPer4H = price × buyLimit`
 *                    • `playerTradedValue = price × effectivePlayerVolume`
 *  3. **Filter**   — discard items outside the volume / price window.
 *  4. **Rank**     — sort descending by `playerTradedValue`.
 *  5. **Slice**    — keep only the top-N items.
 *  6. **Format**   — serialise the result into a compact string for LLM context.
 *
 * All calculations are pure math on local data — no network calls.
 */
/** Default analyser settings. */
const DEFAULTS = {
    topN: 20,
    minVolume: 0,
};
/**
 * Stateless service that reads cached GE price data and produces a ranked,
 * LLM-consumable summary of the most actively-traded items.
 *
 * @example
 * ```ts
 * const cache = new CacheService();
 * await cache.open();
 *
 * const analyzer = new MarketAnalyzerService(cache);
 * const top = await analyzer.getTopItems();
 * const prompt = analyzer.formatForLLM(top);
 * console.log(prompt);
 * ```
 */
class MarketAnalyzerService {
    /**
     * @param cache  - An **already-opened** {@link CacheService} instance.
     * @param config - Optional overrides for ranking behaviour.
     */
    constructor(cache, config) {
        this.cache = cache;
        this.topN = config?.topN ?? DEFAULTS.topN;
        this.minVolume = config?.minVolume ?? DEFAULTS.minVolume;
        this.maxVolume = config?.maxVolume ?? 0;
        this.maxPrice = config?.maxPrice ?? 0;
    }
    // ─── Public API ───────────────────────────────────────────────────────
    /**
     * Run the full filtering pipeline and return the top-N most liquid items.
     *
     * @param overrides - Optional runtime filter overrides that take precedence
     *                    over the constructor defaults for this single call.
     * @returns An array of {@link RankedItem} objects, length ≤ `topN`.
     */
    async getTopItems(overrides) {
        const records = await this.cache.getAll();
        if (records.length === 0) {
            console.warn("[MarketAnalyzer] Cache returned 0 records — nothing to analyse.");
            return [];
        }
        // Build a volume-SMA map from the last 7 days of history.
        const avgVolumeMap = await this.buildAvgVolumeMap(7);
        // Build a price-history map for sparklines.
        const priceHistoryMap = await this.buildPriceHistoryMap(7);
        const effectiveMinVol = overrides?.minVolume ?? this.minVolume;
        const effectiveMaxVol = overrides?.maxVolume ?? this.maxVolume;
        const effectiveMaxPrice = overrides?.maxPrice ?? this.maxPrice;
        const effectiveTopN = overrides?.topN ?? this.topN;
        console.log(`[MarketAnalyzer] Scoring ${records.length} cached records` +
            ` (minVol=${effectiveMinVol}, maxVol=${effectiveMaxVol || "∞"}, maxPrice=${effectiveMaxPrice || "∞"})…`);
        const scored = this.scoreAndFilter(records, effectiveMinVol, effectiveMaxVol, effectiveMaxPrice, avgVolumeMap, priceHistoryMap);
        const sorted = this.sortDescending(scored);
        const top = sorted.slice(0, effectiveTopN);
        console.log(`[MarketAnalyzer] ${scored.length} liquid items found → returning top ${top.length}.`);
        return top;
    }
    /**
     * Search all cached items by name and return fully-scored {@link RankedItem}
     * objects — identical to the cards produced by {@link getTopItems}.
     *
     * The search is **entirely client-side** (IndexedDB only, no network calls).
     * Results are capped at 50 to keep DOM rendering lightweight.
     *
     * @param query - Case-insensitive substring to match against item names.
     * @returns Matching items ranked by `tradedValue`, length ≤ 50.
     */
    async searchItems(query) {
        const needle = query.toLowerCase().trim();
        if (needle.length === 0)
            return [];
        const allRecords = await this.cache.getAll();
        const matched = allRecords.filter((r) => r.name.toLowerCase().includes(needle));
        if (matched.length === 0)
            return [];
        const avgVolumeMap = await this.buildAvgVolumeMap(7);
        const priceHistoryMap = await this.buildPriceHistoryMap(7);
        // Score with no volume/price filters so *every* match is included.
        const scored = this.scoreAndFilter(matched, 0, 0, 0, avgVolumeMap, priceHistoryMap);
        const sorted = this.sortDescending(scored);
        return sorted.slice(0, 50);
    }
    /**
     * Look up cached items by an exact set of names and return fully-scored
     * {@link RankedItem} objects.  Used to render the user's favourites list.
     *
     * @param names - Set of item names to retrieve (case-sensitive, must match cache keys).
     * @returns Matching items ranked by `tradedValue`.
     */
    async getItemsByNames(names) {
        if (names.size === 0)
            return [];
        const allRecords = await this.cache.getAll();
        const matched = allRecords.filter((r) => names.has(r.name));
        if (matched.length === 0)
            return [];
        const avgVolumeMap = await this.buildAvgVolumeMap(7);
        const priceHistoryMap = await this.buildPriceHistoryMap(7);
        const scored = this.scoreAndFilter(matched, 0, 0, 0, avgVolumeMap, priceHistoryMap);
        return this.sortDescending(scored);
    }
    /**
     * Convenience wrapper: run the pipeline **and** format the result in one call.
     *
     * @returns A formatted string ready for LLM context injection.
     */
    async getFormattedTop() {
        const items = await this.getTopItems();
        return this.formatForLLM(items);
    }
    /**
     * Serialise a list of {@link RankedItem} objects into a compact,
     * human-readable (and LLM-friendly) string block.
     *
     * Output format per line:
     * ```
     * 1. Blood rune | Price: 618 gp | Limit: 25,000 | Eff. Vol: 150,000 | Max 4H Capital: 15.45M gp
     * ```
     *
     * @param items - Pre-ranked items (as returned by {@link getTopItems}).
     * @returns Multi-line string suitable for embedding in an LLM prompt.
     */
    formatForLLM(items) {
        if (items.length === 0) {
            return "[No liquid items available — cache may be empty.]";
        }
        const header = `=== RS3 Grand Exchange — Top ${items.length} by Player Traded Value ===`;
        const divider = "=".repeat(header.length);
        const lines = items.map((item, idx) => {
            const rank = String(idx + 1).padStart(2, " ");
            const price = this.formatGp(item.price);
            const limit = item.buyLimit != null
                ? item.buyLimit.toLocaleString("en-US")
                : "Unknown";
            const effVol = item.effectivePlayerVolume.toLocaleString("en-US");
            const cap4h = item.maxCapitalPer4H > 0
                ? `${this.formatGp(item.maxCapitalPer4H)} gp`
                : "Unknown";
            const risk = item.isRisky ? " ⚠ RISKY" : "";
            const recBuy = this.formatGp(item.recBuyPrice);
            const recSell = this.formatGp(item.recSellPrice);
            const flipPft = this.formatGp(item.estFlipProfit);
            const hype = item.volumeSpikeMultiplier > 0
                ? ` | 🔥 ${item.volumeSpikeMultiplier}x Vol Spike`
                : "";
            return `${rank}. ${item.name} | GE Price: ${price} gp | Buy ≤ ${recBuy} | Sell ≥ ${recSell} | Profit: ${flipPft} gp/ea | Limit: ${limit} | Eff. Vol: ${effVol} | Max 4H Capital: ${cap4h} | Tax Gap: ${this.formatGp(item.taxGap)} gp${risk}${hype}`;
        });
        return [header, ...lines, divider].join("\n");
    }
    // ─── Private Helpers ──────────────────────────────────────────────────
    /**
     * Compute player-constrained liquidity scores and apply all filters.
     *
     * For each record:
     *  - `effectivePlayerVolume = min(globalVolume, buyLimit × 6)`
     *    (falls back to `globalVolume` when `buyLimit` is unknown)
     *  - `maxCapitalPer4H = price × buyLimit` (0 when unknown)
     *  - `tradedValue = price × effectivePlayerVolume` (player-constrained)
     *
     * Volume filters (`minVolume` / `maxVolume`) are applied against
     * `effectivePlayerVolume` so they reflect a single player’s throughput.
     *
     * @param records      - Raw records from the cache.
     * @param minVolume    - Minimum effective player volume (inclusive lower bound).
     * @param maxVolume    - Maximum effective player volume (0 = no cap).
     * @param maxPrice     - Maximum item price in gp (0 = no cap).
     * @returns Scored items that pass all filters.
     */
    scoreAndFilter(records, minVolume, maxVolume, maxPrice, avgVolumeMap, priceHistoryMap) {
        const result = [];
        for (const record of records) {
            const globalVol = Number(record.volume) || 0;
            const limit = record.buyLimit != null && record.buyLimit > 0
                ? record.buyLimit
                : undefined;
            // Player-constrained daily volume: 6 × 4-hour windows per day.
            const dailyPlayerLimit = limit != null ? limit * 6 : globalVol;
            const effectivePlayerVolume = Math.min(globalVol, dailyPlayerLimit);
            // Apply filters against the effective (player) volume.
            if (effectivePlayerVolume <= minVolume)
                continue;
            if (maxVolume > 0 && effectivePlayerVolume > maxVolume)
                continue;
            if (maxPrice > 0 && record.price > maxPrice)
                continue;
            const maxCapitalPer4H = limit != null ? record.price * limit : 0;
            // Tax gap: minimum spread (in gp) needed to break even after 2% GE tax.
            const breakEvenSell = Math.ceil(record.price / 0.98);
            const taxGap = breakEvenSell - record.price;
            // Recommended buy price: ~1% below current GE mid-price.
            const recBuyPrice = Math.max(1, Math.floor(record.price * 0.99));
            // Recommended sell price: high enough above the buy price to cover
            // the 2% GE tax and still yield a meaningful margin.
            // Target: sell at ~3% above mid-price → ~2% spread after tax.
            const recSellPrice = Math.max(recBuyPrice + 1, Math.ceil(record.price * 1.03));
            // Estimated per-item flip profit: sell − buy − 2% GE tax on the sale.
            const geTax = Math.floor(recSellPrice * 0.02);
            const estFlipProfit = recSellPrice - recBuyPrice - geTax;
            // Risk flag: only cheap items (< 500 gp) where the absolute tax
            // gap is large relative to realistic spreads.
            const isRisky = record.price < 500;
            // Volume spike: compare today’s volume to the 7-day SMA.
            const avgVol = avgVolumeMap.get(record.name);
            let volumeSpikeMultiplier = 0;
            if (avgVol != null && avgVol > 0 && globalVol > avgVol * 1.5) {
                volumeSpikeMultiplier = +((globalVol / avgVol).toFixed(1));
            }
            // Price history sparkline data: historical prices + today.
            const histPrices = priceHistoryMap.get(record.name) ?? [];
            const priceHistory = [...histPrices, record.price];
            // Trade velocity: qualitative speed tier based on hourly volume vs buy limit.
            const hourlyVolume = Math.floor(globalVol / 24);
            const safeBuyLimit = (limit != null && limit > 0) ? limit : 0;
            let tradeVelocity;
            if (hourlyVolume > 5000 || (safeBuyLimit > 0 && hourlyVolume > safeBuyLimit * 5)) {
                tradeVelocity = "Insta-Flip";
            }
            else if (hourlyVolume > 500 || (safeBuyLimit > 0 && hourlyVolume > safeBuyLimit)) {
                tradeVelocity = "Active";
            }
            else if (hourlyVolume > 50) {
                tradeVelocity = "Slow";
            }
            else {
                tradeVelocity = "Very Slow";
            }
            result.push({
                name: record.name,
                itemId: record.id,
                price: record.price,
                recBuyPrice,
                volume: globalVol,
                tradedValue: record.price * effectivePlayerVolume,
                buyLimit: record.buyLimit,
                effectivePlayerVolume,
                maxCapitalPer4H,
                taxGap,
                recSellPrice,
                estFlipProfit,
                isRisky,
                volumeSpikeMultiplier,
                tradeVelocity,
                priceHistory,
            });
        }
        return result;
    }
    /**
     * Sort an array of ranked items **descending** by `tradedValue`.
     * Returns a new array; the input is not mutated.
     *
     * @param items - Unsorted scored items.
     * @returns A new array sorted from highest to lowest traded value.
     */
    sortDescending(items) {
        return [...items].sort((a, b) => b.tradedValue - a.tradedValue);
    }
    /**
     * Fetch recent history from IndexedDB and build a
     * `Map<itemName, averageVolume>` for volume-spike detection.
     *
     * @param days - Number of calendar days to average over.
     * @returns A map from item name to its simple moving average volume.
     */
    async buildAvgVolumeMap(days) {
        const map = new Map();
        try {
            const history = await this.cache.getRecentHistory(days);
            // Group volumes by item name, excluding today so the SMA only
            // contains *past* data (avoids self-comparison on first fetch).
            const today = new Date().toISOString().slice(0, 10);
            const grouped = new Map();
            for (const rec of history) {
                if (rec.day === today)
                    continue;
                const arr = grouped.get(rec.name);
                const vol = Number(rec.volume) || 0;
                if (arr) {
                    arr.push(vol);
                }
                else {
                    grouped.set(rec.name, [vol]);
                }
            }
            for (const [name, vols] of grouped) {
                const avg = vols.reduce((s, v) => s + v, 0) / vols.length;
                map.set(name, avg);
            }
            console.log(`[MarketAnalyzer] SMA map built from ${history.length} history rows (${map.size} items).`);
        }
        catch (err) {
            console.warn("[MarketAnalyzer] Could not build SMA map — spike detection disabled.", err);
        }
        return map;
    }
    /**
     * Build a `Map<itemName, number[]>` of chronological daily prices
     * for sparkline rendering.  Each array contains one price per past day
     * (does **not** include today \u2014 the caller appends the current price).
     *
     * @param days - Number of calendar days to look back.
     */
    async buildPriceHistoryMap(days) {
        const map = new Map();
        try {
            const history = await this.cache.getRecentHistory(days);
            const today = new Date().toISOString().slice(0, 10);
            // Collect (day, price) pairs per item, excluding today.
            const grouped = new Map();
            for (const rec of history) {
                if (rec.day === today)
                    continue;
                const arr = grouped.get(rec.name);
                const entry = { day: rec.day, price: rec.price };
                if (arr) {
                    arr.push(entry);
                }
                else {
                    grouped.set(rec.name, [entry]);
                }
            }
            // Sort chronologically and extract prices.
            for (const [name, entries] of grouped) {
                entries.sort((a, b) => (a.day < b.day ? -1 : a.day > b.day ? 1 : 0));
                map.set(name, entries.map((e) => e.price));
            }
        }
        catch (err) {
            console.warn("[MarketAnalyzer] Could not build price history map.", err);
        }
        return map;
    }
    /**
     * Format a large gp value into a human-readable abbreviated string.
     *
     * | Range          | Suffix | Example          |
     * |----------------|--------|------------------|
     * | ≥ 1 000 000 000 000 | T      | 2.65T            |
     * | ≥ 1 000 000 000     | B      | 1.42B            |
     * | ≥ 1 000 000         | M      | 312.5M           |
     * | ≥ 1 000             | K      | 4.2K             |
     * | < 1 000             | (raw)  | 750              |
     *
     * @param value - Raw gp amount.
     * @returns Abbreviated string with up to 2 decimal places.
     */
    formatGp(value) {
        const abs = Math.abs(value);
        const sign = value < 0 ? "-" : "";
        if (abs >= 1000000000000)
            return `${sign}${(abs / 1000000000000).toFixed(2)}T`;
        if (abs >= 1000000000)
            return `${sign}${(abs / 1000000000).toFixed(2)}B`;
        if (abs >= 1000000)
            return `${sign}${(abs / 1000000).toFixed(2)}M`;
        if (abs >= 1000)
            return `${sign}${(abs / 1000).toFixed(2)}K`;
        return `${sign}${abs.toLocaleString("en-US")}`;
    }
}


/***/ },

/***/ "./services/portfolioService.ts"
/*!**************************************!*\
  !*** ./services/portfolioService.ts ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PortfolioService: () => (/* binding */ PortfolioService)
/* harmony export */ });
/**
 * @module PortfolioService
 * Manages the user's active flip portfolio with localStorage persistence.
 *
 * Responsibilities:
 *  - CRUD operations on {@link ActiveFlip} records.
 *  - Automatic persistence to `localStorage` on every mutation.
 *  - UUID generation without external dependencies.
 */
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
class PortfolioService {
    constructor() {
        /** In-memory flip store, kept in sync with localStorage. */
        this.flips = [];
        /** In-memory completed-flip ledger, kept in sync with localStorage. */
        this.completedFlips = [];
        this.load();
        this.loadHistory();
    }
    // ─── Public API ─────────────────────────────────────────────────────
    /**
     * Return a shallow copy of all tracked flips (newest first).
     */
    getFlips() {
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
    addFlip(itemName, buyPrice, quantity, targetSellPrice) {
        const flip = {
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
    removeFlip(id) {
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
     * @param id              - Unique ID of the active flip to complete.
     * @param actualSellPrice - The per-item price the flip was actually sold at.
     * @returns The completed flip record, or `undefined` if the ID was not found.
     */
    completeFlip(id, actualSellPrice) {
        const idx = this.flips.findIndex((f) => f.id === id);
        if (idx === -1)
            return undefined;
        const active = this.flips[idx];
        const realizedProfit = Math.round(actualSellPrice * 0.98 * active.quantity) -
            active.buyPrice * active.quantity;
        const completed = {
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
    getCompletedFlips() {
        return [...this.completedFlips];
    }
    /**
     * Aggregate statistics across the completed-flip history.
     */
    getPortfolioStats() {
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
    save() {
        try {
            localStorage.setItem(LS_KEY, JSON.stringify(this.flips));
        }
        catch (err) {
            console.warn("[PortfolioService] Failed to persist portfolio:", err);
        }
    }
    /** Hydrate from localStorage on construction. */
    load() {
        try {
            const raw = localStorage.getItem(LS_KEY);
            if (!raw)
                return;
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                this.flips = parsed;
            }
        }
        catch (err) {
            console.warn("[PortfolioService] Failed to load portfolio:", err);
        }
    }
    /** Serialise the completed-flip history to localStorage. */
    saveHistory() {
        try {
            localStorage.setItem(LS_HISTORY_KEY, JSON.stringify(this.completedFlips));
        }
        catch (err) {
            console.warn("[PortfolioService] Failed to persist history:", err);
        }
    }
    /** Hydrate completed-flip history from localStorage on construction. */
    loadHistory() {
        try {
            const raw = localStorage.getItem(LS_HISTORY_KEY);
            if (!raw)
                return;
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                this.completedFlips = parsed;
            }
        }
        catch (err) {
            console.warn("[PortfolioService] Failed to load history:", err);
        }
    }
}
// ─── Helpers ────────────────────────────────────────────────────────────────
/**
 * Generate a v4-style UUID using `crypto.getRandomValues`.
 * Falls back to `Math.random` in environments without the Web Crypto API.
 */
function uuid() {
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


/***/ },

/***/ "./services/types.ts"
/*!***************************!*\
  !*** ./services/types.ts ***!
  \***************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LLM_PROVIDERS: () => (/* binding */ LLM_PROVIDERS)
/* harmony export */ });
/**
 * @module types
 * Shared type definitions for the GE Market Analyzer pipeline.
 */
/** Built-in provider presets. The last entry (`custom`) uses user-supplied values. */
const LLM_PROVIDERS = [
    {
        id: "groq",
        label: "Groq",
        endpoint: "https://api.groq.com/openai/v1/chat/completions",
        defaultModel: "llama3-8b-8192",
        keyPlaceholder: "gsk_…",
        models: [
            { id: "llama3-8b-8192", label: "Llama 3 8B", recommended: true },
            { id: "llama3-70b-8192", label: "Llama 3 70B" },
            { id: "llama-3.1-8b-instant", label: "Llama 3.1 8B Instant" },
            { id: "llama-3.1-70b-versatile", label: "Llama 3.1 70B Versatile" },
            { id: "gemma2-9b-it", label: "Gemma 2 9B" },
            { id: "mixtral-8x7b-32768", label: "Mixtral 8×7B" },
        ],
    },
    {
        id: "openai",
        label: "OpenAI",
        endpoint: "https://api.openai.com/v1/chat/completions",
        defaultModel: "gpt-4o-mini",
        keyPlaceholder: "sk-…",
        models: [
            { id: "gpt-4o-mini", label: "GPT-4o Mini", recommended: true },
            { id: "gpt-4o", label: "GPT-4o" },
            { id: "gpt-4-turbo", label: "GPT-4 Turbo" },
            { id: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
            { id: "o3-mini", label: "o3-mini" },
        ],
    },
    {
        id: "openrouter",
        label: "OpenRouter",
        endpoint: "https://openrouter.ai/api/v1/chat/completions",
        defaultModel: "meta-llama/llama-3-8b-instruct",
        keyPlaceholder: "sk-or-…",
        models: [
            { id: "meta-llama/llama-3-8b-instruct", label: "Llama 3 8B Instruct", recommended: true },
            { id: "meta-llama/llama-3-70b-instruct", label: "Llama 3 70B Instruct" },
            { id: "meta-llama/llama-3.1-8b-instruct", label: "Llama 3.1 8B Instruct" },
            { id: "mistralai/mistral-7b-instruct", label: "Mistral 7B Instruct" },
            { id: "google/gemma-2-9b-it", label: "Gemma 2 9B" },
            { id: "openai/gpt-4o-mini", label: "GPT-4o Mini (OpenAI)" },
        ],
    },
    {
        id: "together",
        label: "Together AI",
        endpoint: "https://api.together.xyz/v1/chat/completions",
        defaultModel: "meta-llama/Llama-3-8b-chat-hf",
        keyPlaceholder: "tok_…",
        models: [
            { id: "meta-llama/Llama-3-8b-chat-hf", label: "Llama 3 8B Chat", recommended: true },
            { id: "meta-llama/Llama-3-70b-chat-hf", label: "Llama 3 70B Chat" },
            { id: "mistralai/Mixtral-8x7B-Instruct-v0.1", label: "Mixtral 8×7B" },
            { id: "togethercomputer/RedPajama-INCITE-7B-Chat", label: "RedPajama 7B" },
        ],
    },
    {
        id: "mistral",
        label: "Mistral AI",
        endpoint: "https://api.mistral.ai/v1/chat/completions",
        defaultModel: "mistral-small-latest",
        keyPlaceholder: "mis_…",
        models: [
            { id: "mistral-small-latest", label: "Mistral Small", recommended: true },
            { id: "mistral-medium-latest", label: "Mistral Medium" },
            { id: "mistral-large-latest", label: "Mistral Large" },
            { id: "open-mistral-7b", label: "Mistral 7B (Open)" },
            { id: "open-mixtral-8x7b", label: "Mixtral 8×7B (Open)" },
        ],
    },
    {
        id: "custom",
        label: "Custom / Self-hosted",
        endpoint: "",
        defaultModel: "",
        keyPlaceholder: "(optional for local models)",
        models: [],
    },
];


/***/ },

/***/ "./services/weirdGloopService.ts"
/*!***************************************!*\
  !*** ./services/weirdGloopService.ts ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WeirdGloopService: () => (/* binding */ WeirdGloopService)
/* harmony export */ });
/**
 * @module WeirdGloopService
 * HTTP client for the Weird Gloop RS3 Grand Exchange API.
 *
 * Responsibilities:
 *  - Accept an arbitrarily large list of item names.
 *  - Chunk them into batches of {@link WeirdGloopServiceConfig.batchSize} (default 100).
 *  - Fire all batches concurrently via `Promise.allSettled` so one failure
 *    does not abort the entire ingest.
 *  - Return a consolidated map of item → price record.
 *
 * @see https://api.weirdgloop.org/#/exchange
 */
/** Base URL for the Weird Gloop RS3 latest-price endpoint. */
const BASE_URL = "https://api.weirdgloop.org/exchange/history/rs/latest";
/**
 * Service class that encapsulates all communication with the Weird Gloop
 * Grand Exchange REST API.
 *
 * @example
 * ```ts
 * const api = new WeirdGloopService();
 * const prices = await api.fetchLatestPrices([
 *   "Blue partyhat", "Christmas cracker", "Bread",
 * ]);
 * console.log(prices.get("Bread")?.price);
 * ```
 */
class WeirdGloopService {
    /**
     * Create a new service instance.
     * @param config - Optional overrides for batch size, etc.
     */
    constructor(config) {
        this.batchSize = config?.batchSize ?? 100;
    }
    // ─── Public API ───────────────────────────────────────────────────────
    /**
     * Fetch the latest GE snapshot for every item in {@link itemNames}.
     *
     * Items are batched into groups of {@link batchSize} and all batches are
     * dispatched concurrently.  Individual batch failures are logged to the
     * console but do **not** reject the returned promise — successfully
     * fetched records are always returned.
     *
     * @param itemNames - Canonical RS3 item names (case-sensitive as they
     *                    appear on the RS Wiki).
     * @returns A `Map<string, WeirdGloopPriceRecord>` keyed by item name.
     */
    async fetchLatestPrices(itemNames) {
        if (itemNames.length === 0) {
            console.warn("[WeirdGloopService] fetchLatestPrices called with an empty item list.");
            return new Map();
        }
        const batches = this.chunkArray(itemNames, this.batchSize);
        console.log(`[WeirdGloopService] Fetching ${itemNames.length} items in ${batches.length} batch(es) of up to ${this.batchSize}…`);
        const settled = await Promise.allSettled(batches.map((batch, idx) => this.fetchBatch(batch, idx)));
        const consolidated = new Map();
        for (const result of settled) {
            if (result.status === "fulfilled") {
                for (const [name, record] of Object.entries(result.value)) {
                    consolidated.set(name, record);
                }
            }
            else {
                console.error("[WeirdGloopService] Batch failed:", result.reason);
            }
        }
        console.log(`[WeirdGloopService] Successfully fetched ${consolidated.size} / ${itemNames.length} price records.`);
        return consolidated;
    }
    // ─── Private Helpers ──────────────────────────────────────────────────
    /**
     * Fetch a single batch of items from the API.
     *
     * @param batch   - Subset of item names (≤ {@link batchSize}).
     * @param batchIdx - Zero-based index used only for logging.
     * @returns The raw JSON response body typed as {@link WeirdGloopLatestResponse}.
     * @throws {Error} If the HTTP response is not OK (status outside 200-299).
     */
    async fetchBatch(batch, batchIdx) {
        // Pipe-delimit item names as required by the Weird Gloop query parameter.
        const nameParam = batch.map((n) => encodeURIComponent(n)).join("|");
        const url = `${BASE_URL}?name=${nameParam}`;
        console.debug(`[WeirdGloopService] Batch ${batchIdx}: requesting ${batch.length} items…`);
        const response = await fetch(url, {
            method: "GET",
            headers: {
                // Weird Gloop asks consumers to set a descriptive User-Agent.
                "User-Agent": "RS3-GE-Analyzer-Alt1Plugin/1.0 (contact: github.com/skillbert/alt1minimal)",
                Accept: "application/json",
            },
        });
        if (!response.ok) {
            throw new Error(`[WeirdGloopService] Batch ${batchIdx} HTTP ${response.status}: ${response.statusText}`);
        }
        const json = await response.json();
        console.debug(`[WeirdGloopService] Batch ${batchIdx}: received ${Object.keys(json).length} records.`);
        return json;
    }
    /**
     * Split an array into sub-arrays of at most {@link size} elements.
     *
     * @param arr  - The source array.
     * @param size - Maximum chunk length.
     * @returns An array of chunks.
     */
    chunkArray(arr, size) {
        const chunks = [];
        for (let i = 0; i < arr.length; i += size) {
            chunks.push(arr.slice(i, i + size));
        }
        return chunks;
    }
}


/***/ },

/***/ "./services/wikiService.ts"
/*!*********************************!*\
  !*** ./services/wikiService.ts ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WikiService: () => (/* binding */ WikiService)
/* harmony export */ });
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
/**
 * Base URL for the RS3 Wiki `action=query` extracts endpoint.
 * `origin=*` enables CORS from any origin (required for Alt1 / browser context).
 */
const WIKI_EXTRACT_BASE = "https://runescape.wiki/api.php?action=query&prop=extracts&explaintext=1&format=json&origin=*&titles=";
/**
 * Base URL for the RS3 Wiki `action=query&list=search` endpoint.
 * Used to dynamically resolve guide page titles before fetching extracts.
 */
const WIKI_SEARCH_BASE = "https://runescape.wiki/api.php?action=query&list=search&utf8=&format=json&origin=*&srsearch=";
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
class WikiService {
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
    async getMoneyMakingGuide(itemName) {
        const naiveTitle = this.buildGuideTitle(itemName);
        try {
            // ── Step 1: Search for a guide page ──
            const resolvedTitle = await this.searchForGuideTitle(itemName);
            if (resolvedTitle) {
                // ── Step 2: Fetch extract using the resolved title ──
                console.debug(`[WikiService] Resolved guide title: "${resolvedTitle}"`);
                const result = await this.fetchExtract(resolvedTitle);
                if (result.found)
                    return result;
            }
            // ── Fallback: fetch the base item page itself ──
            console.debug(`[WikiService] No guide found — falling back to base item page "${itemName}".`);
            const fallback = await this.fetchExtract(itemName);
            if (fallback.found) {
                return { ...fallback, title: itemName };
            }
            return { title: naiveTitle, found: false, text: "" };
        }
        catch (err) {
            console.warn(`[WikiService] getMoneyMakingGuide failed for "${itemName}":`, err);
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
    async getGuidesForItems(itemNames) {
        if (itemNames.length === 0)
            return [];
        console.log(`[WikiService] Fetching guides for ${itemNames.length} items…`);
        const settled = await Promise.allSettled(itemNames.map((name) => this.getMoneyMakingGuide(name)));
        return settled.map((result, idx) => {
            if (result.status === "fulfilled") {
                return result.value;
            }
            console.warn(`[WikiService] Guide fetch failed for "${itemNames[idx]}":`, result.reason);
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
    async searchForGuideTitle(itemName) {
        const searchTerm = `Money making guide ${itemName}`;
        const url = `${WIKI_SEARCH_BASE}${encodeURIComponent(searchTerm)}`;
        console.debug(`[WikiService] Searching wiki for "${searchTerm}"…`);
        const response = await fetch(url, {
            method: "GET",
            headers: { Accept: "application/json" },
        });
        if (!response.ok) {
            console.warn(`[WikiService] Search HTTP ${response.status} for "${searchTerm}".`);
            return null;
        }
        const json = await response.json();
        const results = json?.query?.search;
        if (!results || results.length === 0)
            return null;
        const topTitle = results[0].title;
        const lower = topTitle.toLowerCase();
        // Validate the result contains a guide-related keyword.
        const isRelevant = WikiService.GUIDE_KEYWORDS.some((kw) => lower.includes(kw));
        if (!isRelevant) {
            console.debug(`[WikiService] Top search result "${topTitle}" is not a guide — skipping.`);
            return null;
        }
        return topTitle;
    }
    /**
     * Fetch the plain-text extract for a single wiki page title.
     * Returns a {@link WikiGuideResult} — `found: false` for missing pages.
     */
    async fetchExtract(title) {
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
        const json = await response.json();
        return this.parseExtract(json, title);
    }
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
    async getBulkBuyLimits(itemNames) {
        if (itemNames.length === 0)
            return new Map();
        const batches = this.chunkArray(itemNames, WikiService.EXCHANGE_BATCH_SIZE);
        console.log(`[WikiService] Fetching buy limits for ${itemNames.length} items in ${batches.length} batch(es)…`);
        const settled = await Promise.allSettled(batches.map((batch, idx) => this.fetchBuyLimitBatch(batch, idx)));
        const combined = new Map();
        for (const result of settled) {
            if (result.status === "fulfilled") {
                for (const [name, limit] of result.value) {
                    combined.set(name, limit);
                }
            }
            else {
                console.warn("[WikiService] Buy-limit batch failed:", result.reason);
            }
        }
        console.log(`[WikiService] Resolved buy limits for ${combined.size} / ${itemNames.length} items.`);
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
    async fetchBuyLimitBatch(batch, idx) {
        // Build pipe-delimited title list — spaces become underscores for the URL.
        const titles = batch
            .map((n) => `Module:Exchange/${n.replace(/ /g, "_")}`)
            .join("|");
        const url = `https://runescape.wiki/api.php?action=query&prop=revisions` +
            `&rvprop=content&rvslots=main&format=json&origin=*` +
            `&titles=${encodeURIComponent(titles)}`;
        console.debug(`[WikiService] Buy-limit batch ${idx + 1}: ${batch.length} items`);
        const response = await fetch(url, {
            method: "GET",
            headers: { Accept: "application/json", "User-Agent": "GE-Market-Analyzer/1.0" },
        });
        if (!response.ok) {
            throw new Error(`[WikiService] Exchange-module HTTP ${response.status} ${response.statusText} (batch ${idx + 1}).`);
        }
        const json = await response.json();
        const map = new Map();
        const pages = json?.query?.pages;
        if (!pages)
            return map;
        for (const page of Object.values(pages)) {
            if (!page.title || page.missing !== undefined)
                continue;
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
     * Split an array into chunks of at most {@link size} elements.
     */
    chunkArray(arr, size) {
        const chunks = [];
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
    buildGuideTitle(itemName) {
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
    parseExtract(json, wikiTitle) {
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
        console.debug(`[WikiService] Retrieved ${extract.length} chars for "${wikiTitle}".`);
        return { title: wikiTitle, found: true, text: extract };
    }
}
// ─── Public API ───────────────────────────────────────────────────────
/** Keywords that indicate a search result is a relevant guide page. */
WikiService.GUIDE_KEYWORDS = [
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
// ─── Bulk Buy Limits (Module:Exchange) ──────────────────────────────
/**
 * Maximum titles per MediaWiki `action=query` request.
 * The API allows up to 50 titles for anonymous (non-bot) callers.
 */
WikiService.EXCHANGE_BATCH_SIZE = 50;
/** Regex that extracts the `limit = <number>` value from a Lua module source. */
WikiService.LIMIT_RE = /limit\s*=\s*(\d+)/;


/***/ },

/***/ "./uiService.ts"
/*!**********************!*\
  !*** ./uiService.ts ***!
  \**********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initUI: () => (/* binding */ initUI)
/* harmony export */ });
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./services */ "./services/index.ts");
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
const PORTFOLIO_TICK_MS = 30000;
// ─── Detail-row label text & tooltip descriptions ───────────────────────────
/**
 * Canonical display text for each detail-row label.
 * Centralised so the card and modal stay in sync.
 */
const DETAIL_LABELS = {
    "GE Price": "GE Price",
    "Rec. Buy Price": "Rec. Buy Price",
    "Rec. Sell Price": "Rec. Sell Price",
    "Est. Flip Profit": "Est. Flip Profit",
    "24h Global Vol": "24h Global Vol",
    "Eff. Player Vol": "Eff. Player Vol",
    "Volume Spike": "Volume Spike",
    "Player Traded Val": "Player Traded Val",
    "Buy Limit (4h)": "Buy Limit (4h)",
    "Max Capital (4h)": "Max Capital (4h)",
    "Tax Gap": "Tax Gap",
    "Est. Margin (2% tax)": "Est. Margin (2% tax)",
};
/**
 * Hover tooltip explanations for each detail-row metric.
 * Displayed as the native `title` attribute so users can learn
 * what each number means without leaving the overlay.
 */
const DETAIL_TIPS = {
    "GE Price": "Latest mid-price reported by the Grand Exchange API.",
    "Rec. Buy Price": "Suggested buy-offer price — ~1% below the GE mid-price for a realistic instant-buy entry.",
    "Rec. Sell Price": "Suggested sell price — ~3% above mid-price to cover the 2% GE tax and still leave profit.",
    "Est. Flip Profit": "Estimated profit per item if you buy at the rec. buy price and sell at the rec. sell price, after the 2% GE tax.",
    "24h Global Vol": "Total number of this item traded across all players in the last 24 hours.",
    "Eff. Player Vol": "The lower of global daily volume and your personal daily limit (buy limit × 6 windows). Reflects how many you can realistically flip per day.",
    "Volume Spike": "Today's volume compared to its 7-day average. Values above 1.5× indicate unusual hype or demand.",
    "Player Traded Val": "Total gp throughput a single player can achieve per day — GE price × effective player volume.",
    "Buy Limit (4h)": "Maximum quantity you can buy from the GE every 4 hours. Set by Jagex per item.",
    "Max Capital (4h)": "Maximum gp you need to fill one full buy-limit window — GE price × buy limit.",
    "Tax Gap": "Minimum price difference needed between buy and sell to break even after the 2% GE tax.",
    "Est. Margin (2% tax)": "The flat gp amount the 2% GE tax takes from one sale at the current price.",
};
// ─── Favorites helpers ──────────────────────────────────────────────────────
/** Return the Set of favourited item names from localStorage. */
function getFavorites() {
    try {
        const raw = localStorage.getItem(LS_FAVORITES);
        return raw ? new Set(JSON.parse(raw)) : new Set();
    }
    catch {
        return new Set();
    }
}
/** Toggle an item's favourite status and persist the result. Returns the new state. */
function toggleFavorite(name) {
    const favs = getFavorites();
    const isFav = favs.has(name);
    if (isFav)
        favs.delete(name);
    else
        favs.add(name);
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
function quickAddToPortfolio(item) {
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
let els;
// ─── Shared service instances (initialised once) ────────────────────────────
let cache;
let analyzer;
let wiki;
/** Most recent formatted market summary — reused across chat messages. */
let latestMarketSummary = "";
/** Most recent wiki text block — reused across chat messages. */
let latestWikiText = "";
/** The top items array, cached for wiki lookups per chat message. */
let latestTopItems = [];
/** The latest search results, cached for re-sorting without re-fetching. */
let latestSearchResults = [];
/** Currently active view mode for the market panel. */
let currentView = "list";
/** Shared LLM service instance — persists conversation history across sends. */
let llm = null;
/** Portfolio service singleton. */
let portfolio;
/** Interval ID for the portfolio countdown timer. */
let portfolioTimerId = null;
/**
 * Lightweight name+price pairs for every item in IndexedDB.
 * Loaded once after cache opens; used by the portfolio autocomplete to let
 * the user search the full GE catalogue.
 */
let allCachedItems = [];
/**
 * Full GE item catalogue (∼7 000 entries) fetched from RS Wiki at startup.
 * Used by the market search to find items beyond the seeded cache.
 */
let geCatalogue = [];
// ─── Public API ─────────────────────────────────────────────────────────────
/**
 * Bootstrap the entire UI.  Call once from the entry point after the DOM is
 * ready.  Returns only after the initial data pipeline has completed and the
 * market panel is rendered.
 */
async function initUI() {
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
    // Initialise shared service singletons.
    cache = new _services__WEBPACK_IMPORTED_MODULE_0__.CacheService();
    await cache.open();
    analyzer = new _services__WEBPACK_IMPORTED_MODULE_0__.MarketAnalyzerService(cache);
    wiki = new _services__WEBPACK_IMPORTED_MODULE_0__.WikiService();
    portfolio = new _services__WEBPACK_IMPORTED_MODULE_0__.PortfolioService();
    // Run the initial market analysis and render.
    try {
        await refreshMarketPanel();
    }
    catch (err) {
        console.error("[UIService] Startup: market panel failed:", err);
        const msg = err instanceof Error ? err.message : "Could not load market data.";
        showError(msg);
    }
    // Render the favourites section (if any favourites exist).
    restoreFavSort();
    bindFavSort();
    await renderFavorites();
    bindFavoritesCollapse();
    bindTop20Collapse();
    // Build the full item catalogue for portfolio autocomplete.
    await loadItemCatalogue();
    // Fetch the full GE catalogue (~7 000 items) for market search.
    try {
        geCatalogue = await (0,_services__WEBPACK_IMPORTED_MODULE_0__.fetchGECatalogue)();
    }
    catch (err) {
        console.warn("[UIService] GE catalogue fetch failed:", err);
        geCatalogue = [];
    }
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
function populateProviderDropdown() {
    els.providerSelect.innerHTML = "";
    for (const p of _services__WEBPACK_IMPORTED_MODULE_0__.LLM_PROVIDERS) {
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
function getProviderById(id) {
    return _services__WEBPACK_IMPORTED_MODULE_0__.LLM_PROVIDERS.find((p) => p.id === id) ?? _services__WEBPACK_IMPORTED_MODULE_0__.LLM_PROVIDERS[0];
}
/**
 * Read previously-saved settings from `localStorage` and populate all inputs.
 */
function restoreSettings() {
    const savedProvider = localStorage.getItem(LS_PROVIDER) ?? _services__WEBPACK_IMPORTED_MODULE_0__.LLM_PROVIDERS[0].id;
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
function applyProviderUI(provider) {
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
function populateModelDatalist(provider) {
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
function saveSettings() {
    const providerId = els.providerSelect.value;
    const model = els.modelInput.value.trim();
    const endpoint = els.customEndpointInput.value.trim();
    const key = els.apiKeyInput.value.trim();
    localStorage.setItem(LS_PROVIDER, providerId);
    if (model) {
        localStorage.setItem(LS_MODEL, model);
    }
    else {
        localStorage.removeItem(LS_MODEL);
    }
    if (endpoint) {
        localStorage.setItem(LS_ENDPOINT, endpoint);
    }
    else {
        localStorage.removeItem(LS_ENDPOINT);
    }
    if (key.length === 0) {
        localStorage.removeItem(LS_API_KEY);
        setKeyStatus("Settings saved — key cleared.", false);
    }
    else {
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
function setKeyStatus(msg, isError) {
    els.keyStatus.textContent = msg;
    els.keyStatus.classList.toggle("error", isError);
}
function bindSettingsEvents() {
    els.saveKeyBtn.addEventListener("click", saveSettings);
    // Save on Enter inside any text input.
    els.apiKeyInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter")
            saveSettings();
    });
    els.modelInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter")
            saveSettings();
    });
    els.customEndpointInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter")
            saveSettings();
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
function bindForceReload() {
    els.forceReloadBtn.addEventListener("click", async () => {
        els.forceReloadBtn.disabled = true;
        els.reloadStatus.textContent = "Clearing cache…";
        els.reloadStatus.classList.remove("error");
        try {
            await cache.clear();
            els.reloadStatus.textContent = "Fetching fresh data…";
            await (0,_services__WEBPACK_IMPORTED_MODULE_0__.initDataPipeline)();
            // Re-open the cache (initDataPipeline uses its own instance).
            cache = new _services__WEBPACK_IMPORTED_MODULE_0__.CacheService();
            await cache.open();
            analyzer = new _services__WEBPACK_IMPORTED_MODULE_0__.MarketAnalyzerService(cache);
            await refreshMarketPanel();
            await prefetchWikiText();
            els.reloadStatus.textContent = "Data reloaded ✓";
        }
        catch (err) {
            console.error("[UIService] Force reload failed:", err);
            const msg = err instanceof Error ? err.message : "Reload failed — see console.";
            els.reloadStatus.textContent = msg;
            els.reloadStatus.classList.add("error");
            showError(msg);
        }
        finally {
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
function bindLayoutToggle() {
    const saved = localStorage.getItem(LS_LAYOUT) ?? "tabbed";
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
function bindTheme() {
    const saved = localStorage.getItem(LS_THEME) ?? "classic";
    applyTheme(saved);
    els.themeSelect.addEventListener("change", () => {
        applyTheme(els.themeSelect.value);
    });
}
/** Apply a theme to the document and persist the choice. */
function applyTheme(theme) {
    document.body.dataset.theme = theme;
    localStorage.setItem(LS_THEME, theme);
    els.themeSelect.value = theme;
}
/** Apply a layout mode to the document and persist the choice. */
function applyLayout(mode) {
    document.body.dataset.layout = mode;
    localStorage.setItem(LS_LAYOUT, mode);
    els.layoutTabbedBtn.classList.toggle("active", mode === "tabbed");
    els.layoutSidebarBtn.classList.toggle("active", mode === "sidebar");
    // In sidebar mode both sections are always visible — remove tab active state.
    if (mode === "sidebar") {
        els.marketView.classList.add("active-tab");
        els.advisorView.classList.add("active-tab");
        els.portfolioView.classList.add("active-tab");
    }
    else {
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
function bindTabNavigation() {
    els.tabMarketBtn.addEventListener("click", () => switchTab("market"));
    els.tabAdvisorBtn.addEventListener("click", () => switchTab("advisor"));
    els.tabPortfolioBtn.addEventListener("click", () => switchTab("portfolio"));
}
/** Activate the requested tab, updating button + section classes. */
function switchTab(tab) {
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
function debounce(fn, ms) {
    let timer = null;
    return ((...args) => {
        if (timer)
            clearTimeout(timer);
        timer = setTimeout(() => fn(...args), ms);
    });
}
// ─── Error Banner ───────────────────────────────────────────────────────────
/**
 * Show the global error banner with the given message.
 * Also hides the market-loading spinner so it doesn't compete visually.
 */
function showError(message) {
    els.errorBannerMsg.textContent = message;
    els.errorBanner.classList.remove("hidden");
    els.marketLoading.style.display = "none";
}
/** Hide the global error banner and clear its message. */
function hideError() {
    els.errorBanner.classList.add("hidden");
    els.errorBannerMsg.textContent = "";
}
/**
 * Wire the error-banner retry button.  Clears the cache, re-runs the full
 * data pipeline, and refreshes the market panel.
 */
function bindErrorRetry() {
    els.errorRetryBtn.addEventListener("click", async () => {
        hideError();
        els.marketLoading.style.display = "";
        els.marketLoading.textContent = "Retrying…";
        try {
            await cache.clear();
            await (0,_services__WEBPACK_IMPORTED_MODULE_0__.initDataPipeline)();
            cache = new _services__WEBPACK_IMPORTED_MODULE_0__.CacheService();
            await cache.open();
            analyzer = new _services__WEBPACK_IMPORTED_MODULE_0__.MarketAnalyzerService(cache);
            await refreshMarketPanel();
        }
        catch (err) {
            console.error("[UIService] Retry failed:", err);
            const msg = err instanceof Error ? err.message : "Retry failed — see console.";
            showError(msg);
        }
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
function applySortOrder(items, sortKey) {
    if (sortKey === "alpha") {
        items.sort((a, b) => a.name.localeCompare(b.name));
    }
    else if (sortKey === "price-desc") {
        items.sort((a, b) => b.price - a.price);
    }
    else if (sortKey === "profit-desc") {
        items.sort((a, b) => b.estFlipProfit - a.estFlipProfit);
    }
    return items;
}
/**
 * Run the market analyzer and render the top-N list into the DOM.
 */
async function refreshMarketPanel() {
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
    }
    catch (err) {
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
function readFilterConfig() {
    const config = {};
    const volPreset = els.filterVolume.value;
    if (volPreset === "high") {
        config.minVolume = 50000;
    }
    else if (volPreset === "low") {
        config.maxVolume = 1000;
    }
    else if (volPreset === "custom") {
        const minVol = Number(els.volumeMinInput.value) || 0;
        const maxVol = Number(els.volumeMaxInput.value) || 0;
        if (minVol > 0)
            config.minVolume = minVol;
        if (maxVol > 0)
            config.maxVolume = maxVol;
    }
    const pricePreset = els.filterPrice.value;
    if (pricePreset === "custom") {
        const maxPrice = Number(els.budgetInput.value) || 0;
        if (maxPrice > 0)
            config.maxPrice = maxPrice;
    }
    else {
        const maxPrice = Number(pricePreset);
        if (maxPrice > 0)
            config.maxPrice = maxPrice;
    }
    return config;
}
/**
 * Bind the market filter dropdowns and the refresh button.
 */
function bindMarketFilters() {
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
    if (savedTop20Sort)
        els.top20SortSelect.value = savedTop20Sort;
    els.top20SortSelect.addEventListener("change", () => {
        localStorage.setItem(TOP20_SORT_KEY, els.top20SortSelect.value);
        applySortOrder(latestTopItems, els.top20SortSelect.value);
        renderMarketItems(latestTopItems);
    });
    // ── Search sort dropdown ──────────────────────────────────────────────
    const savedSearchSort = localStorage.getItem(SEARCH_SORT_KEY);
    if (savedSearchSort)
        els.searchSortSelect.value = savedSearchSort;
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
        await refreshMarketPanel();
        // Re-fetch wiki text for the new filtered set so the LLM context stays in sync.
        await prefetchWikiText();
    });
    // ── Market search input (debounced) ───────────────────────────────────
    els.marketSearchInput.addEventListener("input", debounce(async () => {
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
                    const api = new _services__WEBPACK_IMPORTED_MODULE_0__.WeirdGloopService();
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
            }
            catch (err) {
                console.error("[UIService] Search failed:", err);
            }
            els.searchLoading.style.display = "none";
        }
        else if (query.length === 0) {
            isSearchActive = false;
            latestSearchResults = [];
            els.searchResults.innerHTML = "";
            els.searchLoading.style.display = "none";
        }
    }, 300));
}
/**
 * Wire bi-directional sync between a range slider and its companion number
 * input.  Typing a value larger than the slider's `max` auto-extends the
 * `max` attribute so the slider stays useful.
 */
function syncSliderAndInput(slider, input) {
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
function bindViewToggle() {
    const saved = localStorage.getItem(LS_VIEW_MODE) ?? "list";
    setViewMode(saved);
    els.viewListBtn.addEventListener("click", () => setViewMode("list"));
    els.viewTileBtn.addEventListener("click", () => setViewMode("tile"));
    els.viewHybridBtn.addEventListener("click", () => setViewMode("hybrid"));
}
/**
 * Switch the market panel to a new view mode and re-render.
 */
function setViewMode(mode) {
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
function spriteUrl(itemId) {
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
function drawSparkline(canvas, data) {
    const ctx = canvas.getContext("2d");
    if (!ctx || data.length < 2)
        return;
    // Use the element's laid-out size so the drawing matches CSS sizing.
    const w = canvas.offsetWidth || canvas.width;
    const h = canvas.offsetHeight || canvas.height;
    canvas.width = w;
    canvas.height = h;
    const padding = 2; // tiny top/bottom breathing room
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1; // avoid division-by-zero for flat lines
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
        }
        else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
}
/**
 * Render all market items in the current view mode.
 */
function renderMarketItems(items) {
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
    const canvases = els.marketItems.querySelectorAll("canvas.sparkline");
    canvases.forEach((canvas) => {
        const data = canvas.__priceHistory;
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
async function renderFavorites() {
    const favNames = getFavorites();
    // Hide the section entirely when there are no favourites.
    if (favNames.size === 0) {
        els.favoritesSection.style.display = "none";
        return;
    }
    els.favoritesSection.style.display = "";
    // If collapsed, leave existing content in place (just show the header).
    if (favoritesCollapsed)
        return;
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
    // Draw sparklines.
    const canvases = els.favoritesItems.querySelectorAll("canvas.sparkline");
    canvases.forEach((canvas) => {
        const data = canvas.__priceHistory;
        if (data && data.length >= 2) {
            drawSparkline(canvas, data);
        }
    });
}
/** Bind the collapse/expand toggle for the favourites section header. */
function bindFavoritesCollapse() {
    els.favoritesCollapseBtn.addEventListener("click", () => {
        favoritesCollapsed = !favoritesCollapsed;
        els.favoritesCollapseBtn.textContent = favoritesCollapsed ? "▸" : "▾";
        els.favoritesItems.style.display = favoritesCollapsed ? "none" : "";
    });
}
const FAV_SORT_KEY = "ge-analyzer:fav-sort";
/** Restore the persisted favourites sort preference. */
function restoreFavSort() {
    const saved = localStorage.getItem(FAV_SORT_KEY);
    if (saved)
        els.favoritesSortSelect.value = saved;
}
/** Bind the favourites sort dropdown change event. */
function bindFavSort() {
    els.favoritesSortSelect.addEventListener("change", () => {
        localStorage.setItem(FAV_SORT_KEY, els.favoritesSortSelect.value);
        renderFavorites();
    });
}
/** Whether the Top 20 body is collapsed. */
let top20Collapsed = false;
/** Bind the collapse/expand toggle for the Top 20 section. */
function bindTop20Collapse() {
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
 * Uses the same card builder + sparkline drawing as the Top 20.
 */
function renderSearchResults(items) {
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
    const canvases = els.searchResults.querySelectorAll("canvas.sparkline");
    canvases.forEach((canvas) => {
        const data = canvas.__priceHistory;
        if (data && data.length >= 2) {
            drawSparkline(canvas, data);
        }
    });
}
/**
 * Create a single market item card element.  Works for all three view modes —
 * CSS handles the layout differences.  Each card is expandable on click.
 */
function buildItemCard(item) {
    const card = document.createElement("div");
    card.className = "market-card";
    if (item.isRisky)
        card.classList.add("risky");
    if (item.volumeSpikeMultiplier > 1.5)
        card.classList.add("hype");
    if (getFavorites().has(item.name))
        card.classList.add("favorited");
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
    const velocityCls = {
        "Insta-Flip": "velocity-insta",
        "Active": "velocity-active",
        "Slow": "velocity-slow",
        "Very Slow": "velocity-veryslow",
    };
    const velocityTip = {
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
    // Group action buttons in a horizontal row.
    const actions = document.createElement("span");
    actions.className = "card-actions";
    actions.appendChild(popoutBtn);
    actions.appendChild(favBtn);
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
    // \u2500\u2500 Sparkline canvas (between header and detail) \u2500\u2500
    const sparkCanvas = document.createElement("canvas");
    sparkCanvas.className = "sparkline";
    sparkCanvas.width = 100;
    sparkCanvas.height = 30;
    // Attach price data for post-render drawing.
    sparkCanvas.__priceHistory = item.priceHistory;
    card.appendChild(header);
    card.appendChild(sparkCanvas);
    card.appendChild(detail);
    return card;
}
// \u2500\u2500\u2500 Item Detail Modal \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
/** Lazily-created singleton modal container. */
let itemModal = null;
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
function ensureModal() {
    if (itemModal)
        return itemModal;
    const backdrop = document.createElement("div");
    backdrop.className = "item-modal-backdrop";
    backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop)
            hideItemModal();
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
function showItemModal(item) {
    const backdrop = ensureModal();
    const mHeader = backdrop.querySelector("#item-modal-header");
    const mBody = backdrop.querySelector("#item-modal-body");
    // Build header contents.
    const closeBtn = mHeader.querySelector(".item-modal-close");
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
    const velocityClsMap = {
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
    const canvas = mBody.querySelector("canvas.modal-sparkline");
    if (canvas && item.priceHistory.length >= 2) {
        drawSparkline(canvas, item.priceHistory);
    }
    backdrop.classList.add("visible");
}
/** Hide the floating item detail modal. */
function hideItemModal() {
    if (itemModal)
        itemModal.classList.remove("visible");
}
/**
 * Render an array of {@link RankedItem} as `<li>` elements inside the
 * `#top-items-list` container.
 * @deprecated Use {@link renderMarketItems} instead.
 */
function renderItemList(items) {
    renderMarketItems(items);
}
// ─── Chat Interface ─────────────────────────────────────────────────────────
function bindChatEvents() {
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
function ensureLLMService() {
    const apiKey = (localStorage.getItem(LS_API_KEY) ?? "").trim();
    const config = { apiKey, ...resolvedLLMConfig() };
    if (!llm) {
        llm = new _services__WEBPACK_IMPORTED_MODULE_0__.LLMService(config);
    }
    return llm;
}
/**
 * Handle a "Send" action: validate inputs, orchestrate the RAG pipeline,
 * and render the result.
 */
async function handleSend() {
    const query = els.chatInput.value.trim();
    if (!query)
        return;
    const apiKey = (localStorage.getItem(LS_API_KEY) ?? "").trim();
    const providerId = localStorage.getItem(LS_PROVIDER) ?? _services__WEBPACK_IMPORTED_MODULE_0__.LLM_PROVIDERS[0].id;
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
    }
    catch (err) {
        removeMessage(thinkingEl);
        if (err instanceof _services__WEBPACK_IMPORTED_MODULE_0__.LLMRequestError) {
            console.error(`[UIService] LLM error (HTTP ${err.status}):`, err.message);
            appendMessage("error", formatLLMError(err));
        }
        else {
            console.error("[UIService] Chat pipeline error:", err);
            appendMessage("error", `Unexpected error — see browser console.`);
        }
    }
    finally {
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
function appendMessage(kind, text) {
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
function removeMessage(el) {
    el.remove();
}
/**
 * Scroll the chat history container to the very bottom.
 */
function scrollChatToBottom() {
    els.chatHistory.scrollTop = els.chatHistory.scrollHeight;
}
/**
 * Lock or unlock the chat input + send button to prevent duplicate submissions.
 */
function setInputLock(locked) {
    els.chatInput.disabled = locked;
    els.chatSendBtn.disabled = locked;
}
/**
 * Produce a user-friendly error string from an {@link LLMRequestError}.
 */
function formatLLMError(err) {
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
function bindPortfolio() {
    els.addFlipBtn.addEventListener("click", handleAddFlip);
    // Allow Enter to submit from any portfolio input.
    const inputs = [els.flipItemName, els.flipBuyPrice, els.flipQuantity, els.flipSellPrice];
    for (const inp of inputs) {
        inp.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                // If the autocomplete dropdown is open and an item is highlighted,
                // Enter selects it instead of submitting the form.
                if (inp === els.flipItemName && els.flipSuggestions.classList.contains("open")) {
                    const hl = els.flipSuggestions.querySelector(".highlighted");
                    if (hl) {
                        hl.click();
                        return;
                    }
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
function bindPortfolioSubNav() {
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
function bindItemAutocomplete() {
    const input = els.flipItemName;
    const list = els.flipSuggestions;
    // Populate on focus (shows full filtered list when input is empty).
    input.addEventListener("focus", () => updateSuggestions());
    // Filter as the user types.
    input.addEventListener("input", () => updateSuggestions());
    // Keyboard navigation inside the dropdown.
    input.addEventListener("keydown", (e) => {
        if (!list.classList.contains("open"))
            return;
        const items = list.querySelectorAll(".autocomplete-item");
        if (items.length === 0)
            return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            acHighlight = Math.min(acHighlight + 1, items.length - 1);
            highlightSuggestion(items);
        }
        else if (e.key === "ArrowUp") {
            e.preventDefault();
            acHighlight = Math.max(acHighlight - 1, 0);
            highlightSuggestion(items);
        }
        else if (e.key === "Escape") {
            closeItemSuggestions();
        }
    });
    // Close when clicking outside the autocomplete area.
    document.addEventListener("mousedown", (e) => {
        if (!list.contains(e.target) && e.target !== input) {
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
function updateSuggestions() {
    // Skip if a programmatic fill (e.g. quick-add) is in progress.
    if (suppressAutocomplete)
        return;
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
    }
    else {
        // Search mode — match across the full catalogue.
        const recMatches = [];
        const otherMatches = [];
        for (const item of allCachedItems) {
            if (item.name.toLowerCase().includes(query)) {
                if (recommendedNames.has(item.name)) {
                    recMatches.push(item);
                }
                else {
                    otherMatches.push(item);
                }
            }
        }
        if (recMatches.length === 0 && otherMatches.length === 0) {
            appendEmptyHint(list, "No matching items");
        }
        else {
            if (recMatches.length > 0) {
                appendSectionHeader(list, "Recommended");
                for (const item of recMatches) {
                    appendSuggestionRow(list, item.name, item.price);
                }
            }
            if (otherMatches.length > 0) {
                if (recMatches.length > 0)
                    appendSectionHeader(list, "All items");
                for (const item of otherMatches) {
                    appendSuggestionRow(list, item.name, item.price);
                }
            }
        }
    }
    list.classList.add("open");
}
/** Append a non-interactive section header row to the dropdown. */
function appendSectionHeader(container, label) {
    const hdr = document.createElement("div");
    hdr.className = "autocomplete-section";
    hdr.textContent = label;
    container.appendChild(hdr);
}
/** Append a clickable item row to the suggestion dropdown. */
function appendSuggestionRow(container, name, price) {
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
function appendEmptyHint(container, text) {
    const el = document.createElement("div");
    el.className = "autocomplete-empty";
    el.textContent = text;
    container.appendChild(el);
}
/** Apply the keyboard highlight to the nth suggestion row. */
function highlightSuggestion(items) {
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
function selectSuggestion(name, price) {
    els.flipItemName.value = name;
    els.flipBuyPrice.value = String(price);
    closeItemSuggestions();
    els.flipQuantity.focus();
}
/** Close the autocomplete dropdown and reset highlight state. */
function closeItemSuggestions() {
    els.flipSuggestions.classList.remove("open");
    els.flipSuggestions.innerHTML = "";
    acHighlight = -1;
}
/** Validate the add-flip form fields and create a new flip. */
function handleAddFlip() {
    closeItemSuggestions();
    const itemName = els.flipItemName.value.trim();
    const buyPrice = Number(els.flipBuyPrice.value);
    const quantity = Number(els.flipQuantity.value);
    const sellPrice = Number(els.flipSellPrice.value);
    if (!itemName) {
        els.flipItemName.focus();
        return;
    }
    if (!buyPrice || buyPrice <= 0) {
        els.flipBuyPrice.focus();
        return;
    }
    if (!quantity || quantity <= 0) {
        els.flipQuantity.focus();
        return;
    }
    if (!sellPrice || sellPrice <= 0) {
        els.flipSellPrice.focus();
        return;
    }
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
function renderFlips() {
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
function buildFlipCard(flip) {
    const card = document.createElement("div");
    card.className = "flip-card";
    card.dataset.flipId = flip.id;
    const msElapsed = Date.now() - flip.timestamp;
    const limitReady = msElapsed >= BUY_LIMIT_WINDOW_MS;
    if (limitReady)
        card.classList.add("limit-ready");
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
        const input = prompt(`Enter the actual sell price per item for "${flip.itemName}":`, String(flip.targetSellPrice));
        if (input === null)
            return; // cancelled
        const price = Number(input);
        if (!price || price <= 0)
            return;
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
function renderCompletedFlips() {
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
function renderPortfolioStats() {
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
function buildCompletedFlipCard(flip) {
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
function formatCountdown(timestamp) {
    const elapsed = Date.now() - timestamp;
    const remaining = BUY_LIMIT_WINDOW_MS - elapsed;
    if (remaining <= 0)
        return "Limit reset ✓";
    const totalMin = Math.ceil(remaining / 60000);
    const hours = Math.floor(totalMin / 60);
    const mins = totalMin % 60;
    if (hours > 0)
        return `Resets in ${hours}h ${mins}m`;
    return `Resets in ${mins}m`;
}
/**
 * Start a repeating interval that re-renders the portfolio flip list
 * so countdowns stay live.
 */
function startPortfolioTimer() {
    if (portfolioTimerId !== null)
        return;
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
function persistChatHistory() {
    if (!llm)
        return;
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
    }
    catch (err) {
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
function extractPlayerQuestion(content) {
    const marker = "=== PLAYER QUESTION ===";
    const idx = content.indexOf(marker);
    if (idx === -1)
        return content;
    return content.slice(idx + marker.length).trim();
}
/**
 * On startup, attempt to restore a previously-saved chat conversation from
 * `localStorage`.  Re-renders the bubbles and loads the history into the
 * shared {@link LLMService} instance.
 */
function restoreChatHistory() {
    const raw = localStorage.getItem(LS_CHAT_HISTORY);
    if (!raw)
        return;
    try {
        const saved = JSON.parse(raw);
        if (!Array.isArray(saved) || saved.length === 0)
            return;
        // Re-render each saved message as a chat bubble.
        for (const msg of saved) {
            if (msg.role === "user" || msg.role === "assistant") {
                appendMessage(msg.role, msg.content);
            }
        }
        // Feed the cleaned history into the LLM service so it has conversational
        // context for subsequent requests.
        const service = ensureLLMService();
        const chatMessages = saved
            .filter((m) => m.role === "user" || m.role === "assistant")
            .map((m) => ({ role: m.role, content: m.content }));
        service.loadHistory(chatMessages);
        scrollChatToBottom();
        console.log(`[UIService] Restored ${chatMessages.length} chat messages from localStorage.`);
    }
    catch (err) {
        console.warn("[UIService] Failed to parse saved chat history:", err);
        localStorage.removeItem(LS_CHAT_HISTORY);
    }
}
/**
 * Bind the "Clear Chat" button in the advisor header.
 * Clears the DOM, localStorage key, and LLM conversation memory.
 */
function bindClearChat() {
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
function resolvedLLMConfig() {
    const providerId = localStorage.getItem(LS_PROVIDER) ?? _services__WEBPACK_IMPORTED_MODULE_0__.LLM_PROVIDERS[0].id;
    const provider = getProviderById(providerId);
    const modelOverride = (localStorage.getItem(LS_MODEL) ?? "").trim();
    const customEndpoint = (localStorage.getItem(LS_ENDPOINT) ?? "").trim();
    const endpoint = provider.id === "custom"
        ? customEndpoint || "http://localhost:1234/v1/chat/completions"
        : provider.endpoint;
    const model = modelOverride || provider.defaultModel;
    return { endpoint, model };
}
// ─── Wiki pre-fetch ─────────────────────────────────────────────────────────
/**
 * Fetch wiki guide text for the top items and cache it in module scope.
 */
async function prefetchWikiText() {
    if (latestTopItems.length === 0)
        return;
    try {
        const names = latestTopItems.slice(0, WIKI_GUIDE_COUNT).map((i) => i.name);
        const guides = await wiki.getGuidesForItems(names);
        latestWikiText = guides
            .filter((g) => g.found)
            .map((g) => `--- ${g.title} ---\n${g.text}`)
            .join("\n\n");
    }
    catch (err) {
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
async function loadItemCatalogue() {
    try {
        const records = await cache.getAll();
        allCachedItems = records
            .map((r) => ({ name: r.name, price: r.price }))
            .sort((a, b) => a.name.localeCompare(b.name));
        console.log(`[UIService] Item catalogue loaded: ${allCachedItems.length} items.`);
    }
    catch (err) {
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
function resolveElements() {
    const q = (id) => {
        const el = document.getElementById(id);
        if (!el)
            throw new Error(`[UIService] Missing DOM element: #${id}`);
        return el;
    };
    els = {
        alt1Status: q("alt1-status"),
        providerSelect: q("provider-select"),
        customEndpointGroup: q("custom-endpoint-group"),
        customEndpointInput: q("custom-endpoint-input"),
        modelInput: q("model-input"),
        modelOptions: q("model-options"),
        apiKeyInput: q("api-key-input"),
        saveKeyBtn: q("save-key-btn"),
        keyStatus: q("key-status"),
        filterVolume: q("filter-volume"),
        filterPrice: q("filter-price"),
        top20SortSelect: q("top20-sort-select"),
        searchSortSelect: q("search-sort-select"),
        volumeCustomGroup: q("volume-custom-group"),
        volumeMinSlider: q("volume-min-slider"),
        volumeMinInput: q("volume-min-input"),
        volumeMaxSlider: q("volume-max-slider"),
        volumeMaxInput: q("volume-max-input"),
        budgetCustomGroup: q("budget-custom-group"),
        budgetSlider: q("budget-slider"),
        budgetInput: q("budget-input"),
        marketSearchInput: q("market-search-input"),
        searchLoading: q("search-loading"),
        searchResults: q("search-results"),
        favoritesSection: q("favorites-section"),
        favoritesItems: q("favorites-items"),
        favoritesCollapseBtn: q("favorites-collapse-btn"),
        favoritesSortSelect: q("favorites-sort-select"),
        refreshMarketBtn: q("refresh-market-btn"),
        marketLoading: q("market-loading"),
        marketItems: q("market-items"),
        errorBanner: q("error-banner"),
        errorBannerMsg: q("error-banner-msg"),
        errorRetryBtn: q("error-retry-btn"),
        viewListBtn: q("view-list-btn"),
        viewTileBtn: q("view-tile-btn"),
        viewHybridBtn: q("view-hybrid-btn"),
        top20CollapseBtn: q("top20-collapse-btn"),
        chatHistory: q("chat-history"),
        chatInput: q("chat-input"),
        chatSendBtn: q("chat-send-btn"),
        clearChatBtn: q("clear-chat-btn"),
        forceReloadBtn: q("force-reload-btn"),
        reloadStatus: q("reload-status"),
        layoutTabbedBtn: q("layout-tabbed-btn"),
        layoutSidebarBtn: q("layout-sidebar-btn"),
        themeSelect: q("theme-select"),
        tabMarketBtn: q("tab-market-btn"),
        tabAdvisorBtn: q("tab-advisor-btn"),
        viewTabs: q("view-tabs"),
        marketView: q("market-view"),
        advisorView: q("advisor-view"),
        tabPortfolioBtn: q("tab-portfolio-btn"),
        portfolioView: q("portfolio-view"),
        flipItemName: q("flip-item-name"),
        flipSuggestions: q("flip-suggestions"),
        flipBuyPrice: q("flip-buy-price"),
        flipQuantity: q("flip-quantity"),
        flipSellPrice: q("flip-sell-price"),
        addFlipBtn: q("add-flip-btn"),
        activeFlipsList: q("active-flips-list"),
        portfolioActiveBtn: q("portfolio-active-btn"),
        portfolioHistoryBtn: q("portfolio-history-btn"),
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
function formatGpShort(value) {
    const abs = Math.abs(value);
    const sign = value < 0 ? "-" : "";
    if (abs >= 1000000000)
        return `${sign}${(abs / 1000000000).toFixed(2)}B`;
    if (abs >= 1000000)
        return `${sign}${(abs / 1000000).toFixed(2)}M`;
    if (abs >= 1000)
        return `${sign}${(abs / 1000).toFixed(1)}K`;
    return `${sign}${abs.toLocaleString("en-US")}`;
}
/**
 * Format a trade volume with locale separators.
 */
function formatVolume(vol) {
    return vol.toLocaleString("en-US");
}


/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Check if module exists (development only)
/******/ 		if (__webpack_modules__[moduleId] === undefined) {
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!******************!*\
  !*** ./index.ts ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./services */ "./services/index.ts");
/* harmony import */ var _uiService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./uiService */ "./uiService.ts");
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style.css */ "./style.css");
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


// ── Static asset imports (Webpack asset/resource) ───────────────────────────


// ── Stylesheet (Webpack style-loader injects into <head>) ───────────────────

// ── Alt1 environment detection ──────────────────────────────────────────────
const alt1Status = document.getElementById("alt1-status");
if (window.alt1) {
    alt1.identifyAppUrl("./appconfig.json");
}
else if (alt1Status) {
    const addAppUrl = `alt1://addapp/${new URL("./appconfig.json", document.location.href).href}`;
    alt1Status.innerHTML =
        `Alt1 not detected — <a href="${addAppUrl}">click here</a> to add this app.`;
}
// ── Boot sequence ───────────────────────────────────────────────────────────
(async () => {
    try {
        // Step 1 — Populate the IndexedDB cache with fresh GE data.
        await (0,_services__WEBPACK_IMPORTED_MODULE_0__.initDataPipeline)();
        // Step 2 — Wire services → DOM and render the interface.
        await (0,_uiService__WEBPACK_IMPORTED_MODULE_1__.initUI)();
        console.log("[GE Analyzer] Startup complete.");
    }
    catch (err) {
        console.error("[GE Analyzer] Startup failed:", err);
        alt1Status?.insertAdjacentHTML("beforeend", `<div style="color:#f44747;margin-top:4px">Startup error — see console.</div>`);
    }
})();

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});