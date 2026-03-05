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

/***/ "../node_modules/css-loader/dist/cjs.js!./css/base/alt1-status.css"
/*!*************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/base/alt1-status.css ***!
  \*************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ── Alt1 status banner ───────────────────────────────────────────────────── */

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
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/base/reset.css"
/*!*******************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/base/reset.css ***!
  \*******************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ── Reset & base ─────────────────────────────────────────────────────────── */

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
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/components/accessibility.css"
/*!*********************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/components/accessibility.css ***!
  \*********************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ══════════════════════════════════════════════════════════════════════════════
   Global keyboard focus ring (accessibility)
   ══════════════════════════════════════════════════════════════════════════════ */

:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}

:focus:not(:focus-visible) {
  outline: none;
}

.card-actions button:focus-visible,
.analytics-modal-close:focus-visible,
.tab-btn:focus-visible {
  outline-offset: 1px;
  border-radius: 3px;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/components/alerts.css"
/*!**************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/components/alerts.css ***!
  \**************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ══════════════════════════════════════════════════════════════════════════════
   Modal — Price Alert Inputs
   ══════════════════════════════════════════════════════════════════════════════ */

.alert-inputs {
  margin-top: 8px;
  padding: 8px 10px;
  background: var(--bg-muted);
  border-radius: 4px;
  border: 1px solid var(--border-section);
}

.alert-inputs-title {
  margin: 0 0 6px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-heading);
}

.alert-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
}

.alert-row:last-child {
  margin-bottom: 0;
}

.alert-row label {
  font-size: 10px;
  color: var(--text-muted);
  white-space: nowrap;
}

.alert-row input[type="number"] {
  width: 120px;
  padding: 2px 6px;
  font-size: 10px;
  background: var(--bg-input);
  border: 1px solid var(--border-input);
  color: var(--text-main);
  border-radius: 3px;
}

.alert-row input[type="number"]::placeholder {
  color: var(--text-muted);
  opacity: 0.6;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/components/analytics-dividers.css"
/*!**************************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/components/analytics-dividers.css ***!
  \**************************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ══════════════════════════════════════════════════════════════════════════════
   Analytics modal: section divider & predictive section accent
   ══════════════════════════════════════════════════════════════════════════════ */

.analytics-section-divider {
  grid-column: 1 / -1;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border-main);
}

.predictive-section {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  border-left: 3px solid var(--accent-primary);
  padding-left: 8px;
  margin-top: 4px;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/components/analytics-modal.css"
/*!***********************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/components/analytics-modal.css ***!
  \***********************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ══════════════════════════════════════════════════════════════════════════════
   Unified Analytics Modal – combines details + graph – March 2026
   ══════════════════════════════════════════════════════════════════════════════ */

.analytics-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
}
.analytics-modal-backdrop.visible {
  opacity: 1;
  pointer-events: auto;
}

.analytics-modal {
  position: relative;
  background: var(--bg-main);
  border: 1px solid var(--border);
  border-radius: 12px;
  width: 90vw;
  max-width: 920px;
  min-width: 320px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  padding: 1.25rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: analytics-modal-in 0.18s ease-out;
}

@keyframes analytics-modal-in {
  from { opacity: 0; transform: scale(0.96) translateY(10px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

/* ── Analytics modal: header ────────────────────────────────────────────────── */

.analytics-modal-header {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--border-main);
}

.analytics-modal-header .item-sprite {
  width: 48px;
  height: 42px;
  flex-shrink: 0;
}

.analytics-modal-name {
  font-size: 17px;
  font-weight: 700;
  color: var(--text-accent);
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.analytics-modal-price {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-main);
  white-space: nowrap;
}

.analytics-modal-close {
  all: unset;
  cursor: pointer;
  color: var(--text-muted);
  font-size: 20px;
  line-height: 1;
  padding: 4px 8px;
  border-radius: 4px;
  flex-shrink: 0;
  transition: color 0.15s, background 0.15s;
  margin-left: auto;
}
.analytics-modal-close:hover {
  color: var(--accent-red);
  background: var(--close-hover-bg);
}

/* ── Analytics modal: content sections ──────────────────────────────────────── */

.analytics-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Quick badges row */
.analytics-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

/* Action buttons row */
.analytics-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

/* Two-column detail grid on wider viewports */
.analytics-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2px 16px;
}

.analytics-details-grid .detail-row {
  padding: 4px 0;
  font-size: 12px;
  border-bottom: 1px solid var(--border-main);
}

.analytics-details-grid .detail-row:last-child {
  border-bottom: none;
}

/* Section dividers */
.analytics-section-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-heading);
  margin: 0;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--border);
}

/* Graph container */
.analytics-graph-section {
  min-height: 200px;
  position: relative;
}

.analytics-graph-section .graph-modal-canvas {
  height: 200px;
}

/* Range row */
.analytics-range-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}
.analytics-range-row label {
  font-size: 11px;
  color: var(--text-muted);
}
.analytics-range-row select {
  padding: 2px 6px;
  font-size: 11px;
  background: var(--bg-input);
  color: var(--text-main);
  border: 1px solid var(--border-input);
  border-radius: 3px;
}

/* Stats grid — auto-fit columns */
.analytics-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.5rem;
}

.analytics-stat-card {
  background: var(--bg-muted, var(--bg-elevated));
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.analytics-stat-label {
  font-size: 10px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.analytics-stat-value {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-bright);
}

/* ── Analytics modal: responsive adjustments ────────────────────────────────── */

@media (min-width: 480px) {
  .analytics-details-grid {
    grid-template-columns: 1fr 1fr;
    gap: 2px 1.5rem;
  }

  .analytics-modal-header .item-sprite {
    width: 48px;
    height: 42px;
  }

  .analytics-graph-section .graph-modal-canvas {
    height: 220px;
  }
}

@media (max-width: 600px) {
  .analytics-modal {
    padding: 0.75rem;
    gap: 0.75rem;
    border-radius: 8px;
    min-width: 280px;
    width: 96vw;
  }

  .analytics-modal-name {
    font-size: 14px;
  }

  .analytics-modal-price {
    font-size: 13px;
  }

  /* Detail rows: stack label above value on narrow screens */
  .analytics-details-grid .detail-row,
  .detail-row {
    flex-wrap: wrap;
    gap: 2px 8px;
  }

  .detail-label {
    flex: 1 1 auto;
    min-width: 0;
  }

  .detail-value {
    flex: 0 1 auto;
    min-width: 60px;
    word-break: break-word;
    overflow-wrap: anywhere;
  }

  .analytics-stat-card {
    padding: 6px 8px;
  }

  .analytics-stat-label {
    font-size: 9px;
  }

  .analytics-stat-value {
    font-size: 11px;
  }

  .analytics-graph-section .graph-modal-canvas {
    height: 160px;
  }

  /* Top 20 header: let actions wrap to next line */
  #market-header {
    gap: 2px 6px;
  }

  .market-header-actions {
    gap: 3px;
    flex: 1 1 100%;
    justify-content: flex-start;
  }

  .scan-btn {
    font-size: 9px;
    padding: 2px 6px;
  }

  .section-sort-select {
    font-size: 9px;
    padding: 3px 4px;
  }

  .deep-history-label {
    font-size: 9px;
  }
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
  align-items: baseline;
  padding: 4px 0;
  font-size: 11px;
  border-bottom: 1px solid var(--border-main);
  gap: 8px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  flex-shrink: 0;
  white-space: nowrap;
}

.detail-label[title] {
  cursor: help;
  border-bottom: 1px dotted var(--text-dimmed);
}

.detail-value {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-bright);
  text-align: right;
  word-break: break-word;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/components/card-actions.css"
/*!********************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/components/card-actions.css ***!
  \********************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* \\u2500\\u2500 Popout button \\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500\\u2500 */

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
  flex-wrap: wrap;
  justify-content: center;
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

/* ── Alert bell button (inline on card) ────────────────────────────────────── */

.alert-btn {
  all: unset;
  cursor: pointer;
  font-size: 13px;
  line-height: 1;
  color: var(--text-muted);
  padding: 2px 4px;
  border-radius: 3px;
  flex-shrink: 0;
  opacity: 0.55;
  transition: color 0.15s, opacity 0.15s, transform 0.15s;
}

.alert-btn:hover {
  opacity: 1;
  transform: scale(1.15);
}

.alert-btn.alert-active {
  opacity: 1;
  color: var(--accent-gold);
  filter: drop-shadow(0 0 2px rgba(240, 192, 64, 0.5));
}

/* ── Inline card alert popover ─────────────────────────────────────────────── */

.card-alert-popover {
  display: none;
  padding: 6px 10px;
  background: var(--bg-muted);
  border: 1px solid var(--border-section);
  border-top: none;
  border-radius: 0 0 4px 4px;
  gap: 4px;
}

.card-alert-popover.open {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.card-alert-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-alert-row label {
  font-size: 10px;
  color: var(--text-muted);
  white-space: nowrap;
  min-width: 34px;
}

.card-alert-row input[type="number"] {
  width: 80px;
  padding: 2px 5px;
  font-size: 10px;
  background: var(--bg-input);
  border: 1px solid var(--border-input);
  color: var(--text-main);
  border-radius: 3px;
}

.card-alert-row input[type="number"]::placeholder {
  color: var(--text-muted);
  opacity: 0.6;
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
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/components/chat.css"
/*!************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/components/chat.css ***!
  \************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ── Chat / Advisor panel ──────────────────────────────────────────────────── */

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
  border: 2px solid var(--border-main);
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
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/components/completed-flips.css"
/*!***********************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/components/completed-flips.css ***!
  \***********************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ── Completed flips table ─────────────────────────────────────────────────── */

.portfolio-history-toolbar {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
  align-items: center;
}

.portfolio-history-toolbar input[type="text"] {
  flex: 1;
  padding: 4px 8px;
  font-size: 11px;
  border: 1px solid var(--border-input);
  border-radius: 3px;
  background: var(--bg-input);
  color: var(--text-main);
}

.portfolio-history-toolbar input[type="text"]::placeholder {
  color: var(--text-muted);
  opacity: 0.6;
}

#export-csv-btn {
  padding: 4px 10px;
  font-size: 11px;
  white-space: nowrap;
  background: var(--bg-elevated);
  border: 1px solid var(--border-input);
  border-radius: 3px;
  color: var(--text-main);
  cursor: pointer;
  transition: background 0.15s;
}

#export-csv-btn:hover {
  background: var(--accent-primary);
  color: var(--text-bright);
}

.completed-flips-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
}

.completed-flips-table th {
  text-align: left;
  padding: 4px 8px;
  font-size: 10px;
  font-weight: 600;
  color: var(--text-heading);
  border-bottom: 2px solid var(--border-main);
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  background: var(--bg-elevated);
}

.completed-flips-table th:hover {
  color: var(--text-bright);
}

.completed-flips-table th .sort-arrow {
  margin-left: 2px;
  font-size: 9px;
  color: var(--text-muted);
}

.completed-flips-table td {
  padding: 4px 8px;
  border-bottom: 2px solid var(--border-main);
  color: var(--text-main);
  white-space: nowrap;
}

.completed-flips-table tr.win td:first-child {
  border-left: 3px solid var(--accent-green-bright);
}

.completed-flips-table tr.loss td:first-child {
  border-left: 3px solid var(--accent-red-dark);
}

.completed-flips-table .profit-cell {
  font-weight: 600;
}

.completed-flips-table .profit-cell.win {
  color: var(--accent-green);
}

.completed-flips-table .profit-cell.loss {
  color: var(--accent-red);
}

/* ── Graph modal history-range dropdown ──────────────────────────────────── */

.graph-modal-range-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.graph-modal-range-row label {
  font-size: 11px;
  color: var(--text-muted);
}

.graph-modal-range-row select {
  padding: 2px 6px;
  font-size: 11px;
  background: var(--bg-input);
  color: var(--text-main);
  border: 1px solid var(--border-input);
  border-radius: 3px;
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
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/components/detail-panel.css"
/*!********************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/components/detail-panel.css ***!
  \********************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ── Expandable detail panel ──────────────────────────────────────────────── */

.market-card-detail {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.2s ease, padding 0.2s ease;
  padding: 0 8px;
  background: var(--bg-main);
  border-top: 1px solid transparent;
}

.market-card.expanded .market-card-detail {
  max-height: 400px;
  padding: 6px 8px;
  border-top-color: var(--border-main);
  background: var(--detail-expanded-bg);
  overflow-y: auto;
}`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/components/favourites.css"
/*!******************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/components/favourites.css ***!
  \******************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ── Favourites section ────────────────────────────────────────────────────────────── */

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
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/components/filters.css"
/*!***************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/components/filters.css ***!
  \***************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ── Filter bar ───────────────────────────────────────────────────────────── */

.filter-bar {
  display: flex;
  gap: 6px;
  margin-bottom: 0;
  flex-wrap: wrap;
}

/* Contextual spacing when filter bar lives inside a bordered section */
.top20-section .filter-bar {
  padding: 6px 10px;
  border-bottom: 1px solid var(--border-section);
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

/* ── Full Market Scan button ──────────────────────────────────────────────── */

.scan-btn {
  flex-shrink: 0;
  font-size: 10px;
  padding: 2px 8px;
  background: var(--accent-primary);
  border: 1px solid var(--border-input);
  color: var(--text-bright);
  border-radius: 3px;
  cursor: pointer;
  transition: background 0.15s, opacity 0.15s;
}

.scan-btn:hover {
  background: var(--accent-hover, var(--accent-primary));
  filter: brightness(1.15);
}

.scan-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  filter: none;
}

/* ── Deep-history checkbox label ──────────────────────────────────────────── */

.deep-history-label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: var(--text-muted);
  cursor: pointer;
  white-space: nowrap;
}

.deep-history-label input[type="checkbox"] {
  margin: 0;
  accent-color: var(--accent-primary);
}

/* ── Background sync progress bar ─────────────────────────────────────────── */

.sync-progress {
  margin: 6px 0;
  padding: 4px 8px;
  background: var(--bg-muted);
  border: 1px solid var(--border-input);
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.sync-progress.hidden {
  display: none;
}

.sync-progress-track {
  flex: 1;
  height: 8px;
  background: var(--bg-card, #1e1e2e);
  border-radius: 4px;
  overflow: hidden;
}

.sync-progress-fill {
  height: 100%;
  width: 0%;
  background: var(--accent-primary);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.sync-progress-text {
  font-size: 10px;
  color: var(--text-muted);
  white-space: nowrap;
  min-width: 120px;
}

/* ── Custom filter precision controls ─────────────────────────────────────── */

.custom-filter-group {
  margin-bottom: 0;
  padding: 6px 10px;
  background: var(--bg-filter);
  border-bottom: 1px solid var(--border-section);
  border-radius: 0;
}

/* Standalone context (outside a bordered section) */
:not(.top20-section) > .custom-filter-group {
  margin-bottom: 6px;
  padding: 4px 6px;
  border: 2px solid var(--border-main);
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
}`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/components/highlights.css"
/*!******************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/components/highlights.css ***!
  \******************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ── Semantic text-colour highlight classes ──────────────────────────────────
   Applied by JS on inline text. Doubled selector for specificity over
   \`.market-card .item-name\`, \`.detail-value\` etc. — no !important needed. */

.market-card .hype-text,
.hype-text.hype-text {
  color: var(--accent-hype);
}

.market-card .buy-highlight,
.buy-highlight.buy-highlight {
  color: var(--accent-blue-text);
}

.market-card .sell-highlight,
.sell-highlight.sell-highlight {
  color: var(--accent-teal);
}

.market-card .profit-highlight,
.profit-highlight.profit-highlight {
  color: var(--accent-teal);
}

.market-card .risky-text,
.risky-text.risky-text {
  color: var(--accent-red);
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/components/inputs.css"
/*!**************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/components/inputs.css ***!
  \**************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ── Shared input / button styles ─────────────────────────────────────────── */

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
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/components/layout-toggle.css"
/*!*********************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/components/layout-toggle.css ***!
  \*********************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ── Layout toggle buttons ─────────────────────────────────────────────────── */

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
}`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/components/market-cards.css"
/*!********************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/components/market-cards.css ***!
  \********************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ── Market card (shared across all views) ────────────────────────────────── */

.market-card {
  background: var(--bg-panel);
  border: 1px solid var(--border-card);
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

/* Shared badge base — sizing tokens */
.buy-badge,
.sell-badge,
.profit-badge,
.velocity-badge,
.hype-badge,
.predicted-badge,
.ema-badge,
.vol-badge {
  display: inline-block;
  font-size: var(--badge-font-md);
  padding: var(--badge-padding-md);
  border-radius: var(--badge-radius);
  font-weight: var(--badge-font-weight);
  line-height: 1.3;
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
}

.profit-badge {
  background: var(--badge-sell-bg);
  color: var(--accent-teal);
  font-weight: 700;
  padding: 2px 7px;
  letter-spacing: 0.02em;
}

.profit-badge.negative {
  background: var(--accent-red-bg);
  color: var(--accent-red);
  font-weight: 700;
}

.hype-badge {
  background: var(--badge-hype-bg);
  color: var(--accent-hype);
  animation: hype-pulse 2s ease-in-out infinite;
}

/* ── Trade velocity badges ────────────────────────────────────────────── */

.velocity-badge {
  /* inherits sizing from shared badge base above */
}

.velocity-insta {
  background: var(--badge-velocity-insta-bg);
  color: var(--accent-green-bright);
}

.velocity-active {
  background: var(--badge-velocity-active-bg);
  color: var(--accent-blue-text);
}

.velocity-slow {
  background: var(--badge-velocity-slow-bg);
  color: var(--accent-gold);
}

.velocity-veryslow {
  background: var(--badge-velocity-muted-bg);
  color: var(--text-muted);
}

.trend-badge {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 3px;
  white-space: nowrap;
  font-weight: 600;
}

.trend-downtrend {
  background: var(--badge-trend-down-bg);
  color: var(--accent-red);
}

.trend-uptrend {
  background: var(--badge-trend-up-bg);
  color: var(--accent-green-bright);
}

@keyframes hype-pulse {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.6; }
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/components/market-panel.css"
/*!********************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/components/market-panel.css ***!
  \********************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ── Market data panel ────────────────────────────────────────────────────── */

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
  flex-wrap: wrap;
  gap: 4px;
}

#market-header h2 {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-heading);
  margin: 0;
  white-space: nowrap;
}

.market-header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}

/* ── Per-section sort selects ─────────────────────────────────────────────── */

.section-sort-select {
  font-size: 10px;
  padding: 4px 6px;
  background: var(--bg-input);
  border: 1px solid var(--border-input);
  color: var(--text-muted);
  border-radius: 3px;
  cursor: pointer;
  line-height: 1.2;
}

/* ── View toggle buttons ──────────────────────────────────────────────────── */

.view-toggle {
  display: flex;
  gap: 2px;
  align-items: center;
}

/* Compact tiles toggle – March 2026 */
.compact-toggle-label {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  color: var(--text-muted);
  cursor: pointer;
  margin-left: 4px;
  white-space: nowrap;
  user-select: none;
}
.compact-toggle-label input[type="checkbox"] {
  margin: 0;
  accent-color: var(--accent-primary);
  cursor: pointer;
}
.compact-toggle-label:hover {
  color: var(--text-main);
}

/* Hide predictive badges in compact tile/hybrid mode */
.predictive-badges.compact-hidden {
  display: none;
}

.view-btn {
  background: var(--bg-muted);
  border: 1px solid var(--border-input);
  border-radius: 3px;
  padding: 4px 7px;
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
}`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/components/modals.css"
/*!**************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/components/modals.css ***!
  \**************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ── Floating Item Detail Modal ────────────────────────────────────────────── */

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
  border-bottom: 2px solid var(--border-main);
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
  background: var(--close-hover-bg);
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

/* (modal-sparkline removed — chart now in dedicated graph modal) */

/* ── Graph Modal (deprecated — kept for backwards compat) ─────────────────── */

.graph-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
}
.graph-modal-backdrop.visible {
  opacity: 1;
  pointer-events: auto;
}

.graph-modal {
  background: var(--bg-main);
  border: 1px solid var(--border);
  border-radius: 8px;
  width: 92%;
  max-width: 520px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.5);
}

.graph-modal-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);
}
.graph-modal-title {
  flex: 1;
  font-weight: 600;
  font-size: 14px;
  color: var(--text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.graph-modal-body {
  padding: 12px;
}

.graph-modal-canvas {
  display: block;
  width: 100%;
  height: 180px;
  margin-bottom: 12px;
  border-radius: 4px;
  background: var(--bg-elevated);
}

.graph-history-status {
  display: none;
  text-align: center;
  padding: 8px 4px;
  font-size: 11px;
  color: var(--text-muted, #888);
}
.graph-history-status.visible {
  display: block;
}
.graph-history-status button {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--accent-blue, #569cd6);
  text-decoration: underline;
  font-size: 11px;
  padding: 0 2px;
}
.graph-history-status button:disabled {
  opacity: 0.5;
  cursor: default;
}

.graph-stats {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.graph-stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  border-bottom: 1px solid var(--border);
  font-size: 12px;
}
.graph-stat-row:last-child {
  border-bottom: none;
}
.graph-stat-label {
  color: var(--text-muted);
}
.graph-stat-value {
  font-weight: 600;
  color: var(--text-bright);
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/components/portfolio.css"
/*!*****************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/components/portfolio.css ***!
  \*****************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ── Portfolio view ─────────────────────────────────────────────────────────────────── */

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
  border: 2px solid var(--border-main);
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
  border-top: 2px solid var(--border-main);
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
  border: 2px solid var(--border-main);
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
  border-bottom: 2px solid var(--border-main);
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
  border: 2px solid var(--border-main);
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
  border: 2px solid var(--border-main);
  border-left: 3px solid var(--border-main);
  border-radius: 4px;
  font-size: 11px;
  margin-bottom: 4px;
}

.completed-flip-card.win {
  border-left-color: var(--accent-green-bright);
  background: linear-gradient(90deg, var(--win-glow) 0%, transparent 40%);
}

.completed-flip-card.loss {
  border-left-color: var(--accent-red-dark);
  background: linear-gradient(90deg, var(--loss-glow) 0%, transparent 40%);
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
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/components/predictive-badges.css"
/*!*************************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/components/predictive-badges.css ***!
  \*************************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ── Predictive analytics badges on market cards ────────────────────────────── */

.predictive-badges {
  display: flex;
  gap: 3px;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 2px;
}

.ema-badge,
.predicted-badge,
.vol-badge {
  /* inherits sizing from shared badge base — only color overrides here */
  cursor: help;
}

.ema-badge {
  background: var(--badge-velocity-active-bg);
  color: var(--accent-blue-text);
}

.ema-badge.up {
  color: var(--accent-green-bright);
  background: var(--badge-trend-up-bg);
}

.ema-badge.down {
  color: var(--accent-red);
  background: var(--badge-trend-down-bg);
}

.predicted-badge {
  font-weight: 600;
}

.predicted-badge.up {
  color: var(--accent-green-bright);
  background: var(--badge-trend-up-bg);
}

.predicted-badge.down {
  color: var(--accent-red);
  background: var(--badge-trend-down-bg);
}

.predicted-badge.neutral {
  color: var(--text-muted);
  background: var(--badge-neutral-bg);
}

.vol-badge {
  background: var(--badge-hype-vol-bg);
  color: var(--accent-hype, var(--accent-gold));
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/components/provider.css"
/*!****************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/components/provider.css ***!
  \****************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ── Provider cost hints & setup guide ────────────────────────────────────── */

.provider-cost-hint {
  display: block;
  margin: 2px 0 4px;
  font-size: 11px;
  line-height: 1.3;
  color: var(--text-muted);
}
.provider-cost-hint.tier-free {
  color: var(--accent-green);
}
.provider-cost-hint.tier-free-tier {
  color: var(--accent-teal);
}
.provider-cost-hint.tier-low-cost {
  color: var(--accent-blue-text);
}
.provider-cost-hint.tier-paid {
  color: var(--text-muted);
}
.provider-cost-hint.tier-self-hosted {
  color: var(--text-muted);
}

.setup-guide-btn {
  display: inline-block;
  margin-bottom: 6px;
  padding: 4px 10px;
  font-size: 11px;
  background: transparent;
  border: 1px dashed var(--accent-blue-text);
  border-radius: 3px;
  color: var(--accent-blue-text);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.setup-guide-btn:hover {
  background: var(--accent-blue-text);
  color: var(--bg-main);
}
.setup-guide-btn.hidden {
  display: none;
}

/* ── Setup guide modal ────────────────────────────────────────────────────── */

.setup-guide-backdrop {
  position: fixed;
  inset: 0;
  background: var(--modal-backdrop);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
}
.setup-guide-backdrop.visible {
  opacity: 1;
  pointer-events: auto;
}

.setup-guide-modal {
  position: relative;
  background: var(--bg-main);
  border: 1px solid var(--border);
  border-radius: 10px;
  width: 88vw;
  max-width: 560px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  padding: 1.25rem;
  box-sizing: border-box;
  animation: setup-guide-in 0.18s ease-out;
}
@keyframes setup-guide-in {
  from { opacity: 0; transform: scale(0.96) translateY(10px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

.setup-guide-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}
.setup-guide-header h3 {
  margin: 0;
  font-size: 16px;
  color: var(--text-bright);
}
.setup-guide-close {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 22px;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
}
.setup-guide-close:hover {
  color: var(--text-bright);
}

.setup-guide-tier {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  margin-bottom: 0.75rem;
  font-size: 12px;
  font-weight: 500;
}
.setup-guide-tier.tier-free {
  background: var(--badge-tier-free-bg);
  border: 1px solid var(--badge-tier-free-border);
  color: var(--accent-green);
}
.setup-guide-tier.tier-free-tier {
  background: var(--badge-tier-freetier-bg);
  border: 1px solid var(--badge-tier-freetier-border);
  color: var(--accent-teal);
}
.setup-guide-tier.tier-low-cost {
  background: var(--badge-tier-lowcost-bg);
  border: 1px solid var(--badge-tier-lowcost-border);
  color: var(--accent-blue-text);
}
.setup-guide-tier.tier-paid {
  background: var(--badge-tier-neutral-bg);
  border: 1px solid var(--badge-tier-neutral-border);
  color: var(--text-muted);
}
.setup-guide-tier.tier-self-hosted {
  background: var(--badge-tier-neutral-bg);
  border: 1px solid var(--badge-tier-neutral-border);
  color: var(--text-muted);
}

.tier-badge {
  font-weight: 600;
  white-space: nowrap;
}

.setup-guide-steps {
  margin: 0 0 0.75rem 0;
  padding-left: 1.4rem;
  font-size: 12px;
  line-height: 1.7;
  color: var(--text-main);
}
.setup-guide-steps li {
  margin-bottom: 6px;
}
.setup-guide-steps a {
  color: var(--accent-blue-text);
  text-decoration: underline;
}
.setup-guide-steps a:hover {
  color: var(--text-bright);
}

.setup-guide-note {
  padding: 8px 12px;
  border-radius: 6px;
  background: var(--setup-note-bg);
  border: 1px solid var(--setup-note-border);
  font-size: 11px;
  color: var(--accent-gold);
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.setup-guide-link {
  display: inline-block;
  margin-bottom: 1rem;
  font-size: 12px;
  color: var(--accent-blue-text);
  text-decoration: none;
  font-weight: 500;
}
.setup-guide-link:hover {
  text-decoration: underline;
  color: var(--text-bright);
}

/* ── Provider comparison table ────────────────────────────────────────────── */

.setup-guide-comparison {
  border-top: 1px solid var(--border);
  padding-top: 0.75rem;
}
.setup-guide-comparison h4 {
  margin: 0 0 8px;
  font-size: 13px;
  color: var(--text-bright);
}

.provider-comparison-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
}
.provider-comparison-table th {
  text-align: left;
  padding: 5px 8px;
  border-bottom: 1px solid var(--border);
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 10px;
}
.provider-comparison-table td {
  padding: 6px 8px;
  border-bottom: 1px solid var(--border-input);
  color: var(--text-main);
}
.provider-comparison-table tr.active-row td {
  background: var(--table-active-row-bg);
  color: var(--text-bright);
  font-weight: 500;
}
.provider-comparison-table tr:hover td {
  background: var(--table-hover-row-bg);
}

.tier-badge-sm {
  display: inline-block;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
}
.tier-badge-sm.tier-free {
  background: var(--badge-tier-free-bg);
  color: var(--accent-green);
}
.tier-badge-sm.tier-free-tier {
  background: var(--badge-tier-freetier-bg);
  color: var(--accent-teal);
}
.tier-badge-sm.tier-low-cost {
  background: var(--badge-tier-lowcost-bg);
  color: var(--accent-blue-text);
}
.tier-badge-sm.tier-paid {
  background: var(--badge-tier-neutral-bg);
  color: var(--text-muted);
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

select option {
  background: var(--dropdown-bg);
  color: var(--text-main);
}

select option:hover,
select option:checked {
  background: var(--dropdown-hover-bg);
  color: var(--text-bright);
}

select:focus {
  border-color: var(--accent-focus);
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/components/scrollbar.css"
/*!*****************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/components/scrollbar.css ***!
  \*****************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ── Webkit scrollbar styling ─────────────────────────────────────────────── */

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
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/components/search.css"
/*!**************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/components/search.css ***!
  \**************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ── Market search bar ────────────────────────────────────────────────────── */

#market-search-input {
  width: 100%;
  box-sizing: border-box;
  padding: 7px 10px;
  margin-bottom: 0;
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
  margin-bottom: 8px;
}

#search-section #market-search-input {
  flex: 1 1 140px;
  min-width: 140px;
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

.graph-btn {
  all: unset;
  cursor: pointer;
  font-size: 11px;
  line-height: 1;
  color: var(--text-muted);
  padding: 2px 3px;
  border-radius: 3px;
  flex-shrink: 0;
  letter-spacing: -1px;
  transition: color 0.15s;
}
.graph-btn:hover {
  color: var(--accent-green-bright, #4ec9b0);
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
}`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/components/settings-fieldsets.css"
/*!**************************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/components/settings-fieldsets.css ***!
  \**************************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ══════════════════════════════════════════════════════════════════════════════
   Settings group fieldsets
   ══════════════════════════════════════════════════════════════════════════════ */

.settings-group {
  border: 1px solid var(--border-main);
  border-radius: 6px;
  padding: 8px 10px 10px;
  margin-bottom: 8px;
}

.settings-group-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-accent);
  padding: 0 4px;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/components/settings.css"
/*!****************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/components/settings.css ***!
  \****************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ── Settings panel ───────────────────────────────────────────────────────── */

#settings-panel {
  background: var(--bg-panel);
  border-bottom: 2px solid var(--border-main);
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

/* ── Data management buttons ──────────────────────────────────────────────── */

.data-mgmt .settings-row {
  margin-top: 4px;
}

.data-mgmt button {
  flex: 1;
  font-size: 11px;
  padding: 5px 8px;
  background: var(--bg-input);
  border: 1px solid var(--border-input);
  color: var(--text-main);
  border-radius: 3px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}

.data-mgmt button:hover {
  background: var(--bg-muted);
  border-color: var(--accent-blue-text);
  color: var(--accent-blue-text);
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
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/components/startup.css"
/*!***************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/components/startup.css ***!
  \***************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ── Startup loading overlay ──────────────────────────────────────────────── */

.startup-overlay {
  position: absolute;
  inset: 0;
  z-index: 900;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  background: var(--bg-main, #1e1e1e);
  transition: opacity 0.4s ease;
}
.startup-overlay.fade-out {
  opacity: 0;
  pointer-events: none;
}

/* Glass style: overlay must stay opaque to hide content behind it */
body[data-style="glass"] .startup-overlay {
  background: var(--glass-body-from, var(--bg-main, #1e1e1e));
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

.startup-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--border-main, #333);
  border-top-color: var(--accent-primary, #569cd6);
  border-radius: 50%;
  animation: startup-spin 0.8s linear infinite;
}
@keyframes startup-spin {
  to { transform: rotate(360deg); }
}

.startup-status {
  color: var(--text-muted, #888);
  font-size: 12px;
  text-align: center;
  max-width: 260px;
  line-height: 1.4;
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
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/components/tabs.css"
/*!************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/components/tabs.css ***!
  \************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ── Tab navigation ───────────────────────────────────────────────────────── */

#view-tabs {
  display: flex;
  gap: 0;
  flex-shrink: 0;
  background: var(--bg-panel);
  border-bottom: 2px solid var(--border-main);
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
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/components/toasts.css"
/*!**************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/components/toasts.css ***!
  \**************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ══════════════════════════════════════════════════════════════════════════════
   Toast Notifications
   ══════════════════════════════════════════════════════════════════════════════ */

#toast-container {
  position: fixed;
  top: 8px;
  right: 8px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: none;
  max-width: 320px;
}

.toast {
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 11px;
  line-height: 1.4;
  color: var(--text-main);
  background: var(--bg-panel);
  border-left: 3px solid var(--accent-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  opacity: 0;
  transform: translateX(30px);
  transition: opacity 0.3s ease, transform 0.3s ease;
  pointer-events: auto;
}

.toast.show {
  opacity: 1;
  transform: translateX(0);
}

.toast-buy {
  border-left-color: var(--accent-teal);
}

.toast-sell {
  border-left-color: var(--accent-gold);
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/layout/app-shell.css"
/*!*************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/layout/app-shell.css ***!
  \*************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ── App shell ────────────────────────────────────────────────────────────── */

#app {
  position: relative;        /* contain startup overlay */
  display: flex;
  flex-direction: column;
  height: 95%;              /* fill parent, not viewport — respects zoom */
  min-height: 0;             /* allow flex children to shrink properly */
  overflow: hidden;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/layout/layout-modes.css"
/*!****************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/layout/layout-modes.css ***!
  \****************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ═════════════════════════════════════════════════════════════════════════════
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
/* Disable sidebar layout on small / mobile viewports — fall back to tabbed  */
@media (max-width: 700px) {
  body[data-layout="sidebar"] #view-tabs {
    display: flex !important;    /* restore tabs on small screens */
  }
  body[data-layout="sidebar"] #app-content {
    flex-direction: column !important;
  }
  body[data-layout="sidebar"] #market-view {
    width: auto !important;
    border-right: none !important;
  }
  body[data-layout="sidebar"] #advisor-view,
  body[data-layout="sidebar"] #portfolio-view {
    border-left: none !important;
  }
  /* Hide the sidebar button on mobile — it doesn't work well */
  .layout-toggle #layout-sidebar-btn {
    display: none;
  }
}

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
  border-right: 2px solid var(--border-main);
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
  border-left: 2px solid var(--border-main);
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/layout/main-content.css"
/*!****************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/layout/main-content.css ***!
  \****************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ── Main content wrapper ─────────────────────────────────────────────────── */

#app-content {
  flex: 1 1 0;
  min-height: 0;
  overflow: hidden;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/layout/responsive.css"
/*!**************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/layout/responsive.css ***!
  \**************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ══════════════════════════════════════════════════════════════════════════════
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

  .analytics-modal {
    width: 90vw;
    max-width: 920px;
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

  /* (responsive sparkline rule removed — chart now in dedicated graph modal) */

  /* Advisor chat gets more comfortable padding. */
  #advisor-view {
    padding: 10px 18px;
  }

  #portfolio-view {
    padding: 10px 18px;
  }
}`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/layout/views.css"
/*!*********************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/layout/views.css ***!
  \*********************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ── List view ────────────────────────────────────────────────────────────── */

.market-items.list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 6px 8px;
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
  gap: 8px;
  padding: 8px 10px;
}

.market-items.tile .market-card-header {
  flex-direction: column;
  text-align: center;
  padding: 8px 6px;
  gap: 4px;
  overflow: visible;
}

.market-items.tile .card-actions {
  gap: 3px;
  justify-content: center;
  flex-wrap: wrap;
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
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}

/* (tile sparkline rules removed — chart now in dedicated graph modal) */

/* ── Hybrid view (compact grid, list-style rows) ──────────────────────────── */

.market-items.hybrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 6px;
  padding: 6px 8px;
}

.market-items.hybrid .market-card-header {
  padding: 4px 6px;
  gap: 6px;
}

.market-items.hybrid .item-sprite {
  width: 28px;
  height: 24px;
}

/* (hybrid sparkline rule removed) */

.market-items.hybrid .flip-badges {
  gap: 2px;
}

.market-items.hybrid .buy-badge,
.market-items.hybrid .sell-badge,
.market-items.hybrid .profit-badge {
  font-size: var(--badge-font-sm);
  padding: var(--badge-padding-sm);
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/main.css"
/*!*************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/main.css ***!
  \*************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_base_reset_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./base/reset.css */ "../node_modules/css-loader/dist/cjs.js!./css/base/reset.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_base_alt1_status_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./base/alt1-status.css */ "../node_modules/css-loader/dist/cjs.js!./css/base/alt1-status.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_themes_colorway_default_dark_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./themes/colorway-default-dark.css */ "../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-default-dark.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_themes_colorway_classic_dark_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./themes/colorway-classic-dark.css */ "../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-classic-dark.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_themes_colorway_rs3_modern_dark_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./themes/colorway-rs3-modern-dark.css */ "../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-rs3-modern-dark.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_themes_colorway_rs_lobby_dark_css__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./themes/colorway-rs-lobby-dark.css */ "../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-rs-lobby-dark.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_themes_colorway_gruvbox_dark_css__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./themes/colorway-gruvbox-dark.css */ "../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-gruvbox-dark.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_themes_colorway_solarized_dark_css__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./themes/colorway-solarized-dark.css */ "../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-solarized-dark.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_themes_colorway_twilight_amethyst_dark_css__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./themes/colorway-twilight-amethyst-dark.css */ "../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-twilight-amethyst-dark.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_themes_colorway_osrs_design_dark_css__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./themes/colorway-osrs-design-dark.css */ "../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-osrs-design-dark.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_themes_colorway_default_light_css__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./themes/colorway-default-light.css */ "../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-default-light.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_themes_colorway_solarized_light_css__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./themes/colorway-solarized-light.css */ "../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-solarized-light.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_themes_colorway_classic_light_css__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./themes/colorway-classic-light.css */ "../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-classic-light.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_themes_colorway_rs3_modern_light_css__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./themes/colorway-rs3-modern-light.css */ "../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-rs3-modern-light.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_themes_colorway_rs_lobby_light_css__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./themes/colorway-rs-lobby-light.css */ "../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-rs-lobby-light.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_themes_colorway_gruvbox_light_css__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./themes/colorway-gruvbox-light.css */ "../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-gruvbox-light.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_themes_colorway_twilight_amethyst_light_css__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./themes/colorway-twilight-amethyst-light.css */ "../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-twilight-amethyst-light.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_themes_colorway_osrs_design_light_css__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./themes/colorway-osrs-design-light.css */ "../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-osrs-design-light.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_themes_light_mode_overrides_css__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./themes/light-mode-overrides.css */ "../node_modules/css-loader/dist/cjs.js!./css/themes/light-mode-overrides.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_themes_contrast_modifiers_css__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./themes/contrast-modifiers.css */ "../node_modules/css-loader/dist/cjs.js!./css/themes/contrast-modifiers.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_styles_style_glassmorphism_css__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./styles/style-glassmorphism.css */ "../node_modules/css-loader/dist/cjs.js!./css/styles/style-glassmorphism.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_styles_style_neumorphism_css__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./styles/style-neumorphism.css */ "../node_modules/css-loader/dist/cjs.js!./css/styles/style-neumorphism.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_styles_style_skeuomorphism_css__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./styles/style-skeuomorphism.css */ "../node_modules/css-loader/dist/cjs.js!./css/styles/style-skeuomorphism.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_styles_micro_component_protection_css__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./styles/micro-component-protection.css */ "../node_modules/css-loader/dist/cjs.js!./css/styles/micro-component-protection.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_layout_app_shell_css__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./layout/app-shell.css */ "../node_modules/css-loader/dist/cjs.js!./css/layout/app-shell.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_layout_main_content_css__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./layout/main-content.css */ "../node_modules/css-loader/dist/cjs.js!./css/layout/main-content.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_layout_layout_modes_css__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./layout/layout-modes.css */ "../node_modules/css-loader/dist/cjs.js!./css/layout/layout-modes.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_layout_views_css__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./layout/views.css */ "../node_modules/css-loader/dist/cjs.js!./css/layout/views.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_components_settings_css__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./components/settings.css */ "../node_modules/css-loader/dist/cjs.js!./css/components/settings.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_components_settings_fieldsets_css__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./components/settings-fieldsets.css */ "../node_modules/css-loader/dist/cjs.js!./css/components/settings-fieldsets.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_components_provider_css__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./components/provider.css */ "../node_modules/css-loader/dist/cjs.js!./css/components/provider.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_components_inputs_css__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./components/inputs.css */ "../node_modules/css-loader/dist/cjs.js!./css/components/inputs.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_components_layout_toggle_css__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./components/layout-toggle.css */ "../node_modules/css-loader/dist/cjs.js!./css/components/layout-toggle.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_components_tabs_css__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./components/tabs.css */ "../node_modules/css-loader/dist/cjs.js!./css/components/tabs.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_components_market_panel_css__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./components/market-panel.css */ "../node_modules/css-loader/dist/cjs.js!./css/components/market-panel.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_components_filters_css__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./components/filters.css */ "../node_modules/css-loader/dist/cjs.js!./css/components/filters.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_components_startup_css__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./components/startup.css */ "../node_modules/css-loader/dist/cjs.js!./css/components/startup.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_components_market_cards_css__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./components/market-cards.css */ "../node_modules/css-loader/dist/cjs.js!./css/components/market-cards.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_components_highlights_css__WEBPACK_IMPORTED_MODULE_40__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./components/highlights.css */ "../node_modules/css-loader/dist/cjs.js!./css/components/highlights.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_components_search_css__WEBPACK_IMPORTED_MODULE_41__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./components/search.css */ "../node_modules/css-loader/dist/cjs.js!./css/components/search.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_components_detail_panel_css__WEBPACK_IMPORTED_MODULE_42__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./components/detail-panel.css */ "../node_modules/css-loader/dist/cjs.js!./css/components/detail-panel.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_components_card_actions_css__WEBPACK_IMPORTED_MODULE_43__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./components/card-actions.css */ "../node_modules/css-loader/dist/cjs.js!./css/components/card-actions.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_components_favourites_css__WEBPACK_IMPORTED_MODULE_44__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./components/favourites.css */ "../node_modules/css-loader/dist/cjs.js!./css/components/favourites.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_components_modals_css__WEBPACK_IMPORTED_MODULE_45__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./components/modals.css */ "../node_modules/css-loader/dist/cjs.js!./css/components/modals.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_components_analytics_modal_css__WEBPACK_IMPORTED_MODULE_46__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./components/analytics-modal.css */ "../node_modules/css-loader/dist/cjs.js!./css/components/analytics-modal.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_components_analytics_dividers_css__WEBPACK_IMPORTED_MODULE_47__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./components/analytics-dividers.css */ "../node_modules/css-loader/dist/cjs.js!./css/components/analytics-dividers.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_components_chat_css__WEBPACK_IMPORTED_MODULE_48__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./components/chat.css */ "../node_modules/css-loader/dist/cjs.js!./css/components/chat.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_components_portfolio_css__WEBPACK_IMPORTED_MODULE_49__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./components/portfolio.css */ "../node_modules/css-loader/dist/cjs.js!./css/components/portfolio.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_components_predictive_badges_css__WEBPACK_IMPORTED_MODULE_50__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./components/predictive-badges.css */ "../node_modules/css-loader/dist/cjs.js!./css/components/predictive-badges.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_components_completed_flips_css__WEBPACK_IMPORTED_MODULE_51__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./components/completed-flips.css */ "../node_modules/css-loader/dist/cjs.js!./css/components/completed-flips.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_components_scrollbar_css__WEBPACK_IMPORTED_MODULE_52__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./components/scrollbar.css */ "../node_modules/css-loader/dist/cjs.js!./css/components/scrollbar.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_components_toasts_css__WEBPACK_IMPORTED_MODULE_53__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./components/toasts.css */ "../node_modules/css-loader/dist/cjs.js!./css/components/toasts.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_components_alerts_css__WEBPACK_IMPORTED_MODULE_54__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./components/alerts.css */ "../node_modules/css-loader/dist/cjs.js!./css/components/alerts.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_components_accessibility_css__WEBPACK_IMPORTED_MODULE_55__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./components/accessibility.css */ "../node_modules/css-loader/dist/cjs.js!./css/components/accessibility.css");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_layout_responsive_css__WEBPACK_IMPORTED_MODULE_56__ = __webpack_require__(/*! -!../../node_modules/css-loader/dist/cjs.js!./layout/responsive.css */ "../node_modules/css-loader/dist/cjs.js!./css/layout/responsive.css");
// Imports

























































var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_base_reset_css__WEBPACK_IMPORTED_MODULE_2__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_base_alt1_status_css__WEBPACK_IMPORTED_MODULE_3__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_themes_colorway_default_dark_css__WEBPACK_IMPORTED_MODULE_4__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_themes_colorway_classic_dark_css__WEBPACK_IMPORTED_MODULE_5__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_themes_colorway_rs3_modern_dark_css__WEBPACK_IMPORTED_MODULE_6__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_themes_colorway_rs_lobby_dark_css__WEBPACK_IMPORTED_MODULE_7__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_themes_colorway_gruvbox_dark_css__WEBPACK_IMPORTED_MODULE_8__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_themes_colorway_solarized_dark_css__WEBPACK_IMPORTED_MODULE_9__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_themes_colorway_twilight_amethyst_dark_css__WEBPACK_IMPORTED_MODULE_10__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_themes_colorway_osrs_design_dark_css__WEBPACK_IMPORTED_MODULE_11__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_themes_colorway_default_light_css__WEBPACK_IMPORTED_MODULE_12__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_themes_colorway_solarized_light_css__WEBPACK_IMPORTED_MODULE_13__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_themes_colorway_classic_light_css__WEBPACK_IMPORTED_MODULE_14__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_themes_colorway_rs3_modern_light_css__WEBPACK_IMPORTED_MODULE_15__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_themes_colorway_rs_lobby_light_css__WEBPACK_IMPORTED_MODULE_16__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_themes_colorway_gruvbox_light_css__WEBPACK_IMPORTED_MODULE_17__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_themes_colorway_twilight_amethyst_light_css__WEBPACK_IMPORTED_MODULE_18__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_themes_colorway_osrs_design_light_css__WEBPACK_IMPORTED_MODULE_19__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_themes_light_mode_overrides_css__WEBPACK_IMPORTED_MODULE_20__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_themes_contrast_modifiers_css__WEBPACK_IMPORTED_MODULE_21__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_styles_style_glassmorphism_css__WEBPACK_IMPORTED_MODULE_22__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_styles_style_neumorphism_css__WEBPACK_IMPORTED_MODULE_23__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_styles_style_skeuomorphism_css__WEBPACK_IMPORTED_MODULE_24__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_styles_micro_component_protection_css__WEBPACK_IMPORTED_MODULE_25__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_layout_app_shell_css__WEBPACK_IMPORTED_MODULE_26__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_layout_main_content_css__WEBPACK_IMPORTED_MODULE_27__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_layout_layout_modes_css__WEBPACK_IMPORTED_MODULE_28__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_layout_views_css__WEBPACK_IMPORTED_MODULE_29__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_components_settings_css__WEBPACK_IMPORTED_MODULE_30__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_components_settings_fieldsets_css__WEBPACK_IMPORTED_MODULE_31__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_components_provider_css__WEBPACK_IMPORTED_MODULE_32__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_components_inputs_css__WEBPACK_IMPORTED_MODULE_33__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_components_layout_toggle_css__WEBPACK_IMPORTED_MODULE_34__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_components_tabs_css__WEBPACK_IMPORTED_MODULE_35__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_components_market_panel_css__WEBPACK_IMPORTED_MODULE_36__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_components_filters_css__WEBPACK_IMPORTED_MODULE_37__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_components_startup_css__WEBPACK_IMPORTED_MODULE_38__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_components_market_cards_css__WEBPACK_IMPORTED_MODULE_39__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_components_highlights_css__WEBPACK_IMPORTED_MODULE_40__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_components_search_css__WEBPACK_IMPORTED_MODULE_41__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_components_detail_panel_css__WEBPACK_IMPORTED_MODULE_42__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_components_card_actions_css__WEBPACK_IMPORTED_MODULE_43__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_components_favourites_css__WEBPACK_IMPORTED_MODULE_44__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_components_modals_css__WEBPACK_IMPORTED_MODULE_45__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_components_analytics_modal_css__WEBPACK_IMPORTED_MODULE_46__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_components_analytics_dividers_css__WEBPACK_IMPORTED_MODULE_47__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_components_chat_css__WEBPACK_IMPORTED_MODULE_48__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_components_portfolio_css__WEBPACK_IMPORTED_MODULE_49__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_components_predictive_badges_css__WEBPACK_IMPORTED_MODULE_50__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_components_completed_flips_css__WEBPACK_IMPORTED_MODULE_51__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_components_scrollbar_css__WEBPACK_IMPORTED_MODULE_52__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_components_toasts_css__WEBPACK_IMPORTED_MODULE_53__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_components_alerts_css__WEBPACK_IMPORTED_MODULE_54__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_components_accessibility_css__WEBPACK_IMPORTED_MODULE_55__["default"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_layout_responsive_css__WEBPACK_IMPORTED_MODULE_56__["default"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ═══════════════════════════════════════════════════════════════════════════
 *  GE Market Analyzer — CSS Module Entry Point
 *
 *  Import order is CRITICAL to the cascade. Do not rearrange.
 *
 *  1st: Base styles (reset, body, Alt1 status)
 *  2nd: Theme colorways (dark palettes, then light palettes)
 *  3rd: Light-mode consolidated overrides  +  Contrast modifiers
 *  4th: Thematic styles (glass, neumorphism, skeuomorphism)
 *  5th: Micro-component protections
 *  6th: Layouts and Components
 * ═══════════════════════════════════════════════════════════════════════════ */

/* ── 1. Base ────────────────────────────────────────────────────────────────── */

/* ── 2. Theme Colorways ─────────────────────────────────────────────────────── */
/* Dark palettes first (Classic Dark defines :root defaults) */

/* Light palettes */

/* ── 3. Light-mode overrides  +  Contrast modifiers ────────────────────────── */

/* ── 4. Thematic Styles ─────────────────────────────────────────────────────── */

/* ── 5. Micro-component Protections ─────────────────────────────────────────── */

/* ── 6. Layout ──────────────────────────────────────────────────────────────── */

/* ── 7. Components ──────────────────────────────────────────────────────────── */

/* ── 8. Responsive overrides (must come last to win specificity) ────────────── */
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/styles/micro-component-protection.css"
/*!******************************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/styles/micro-component-protection.css ***!
  \******************************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ═══════════════════════════════════════════════════════════════════════════
 *  MICRO-COMPONENT PROTECTION
 *
 *  Small icon-only buttons (.card-actions, .flip-card-actions, .popout-btn,
 *  .fav-btn, .alert-btn, .quick-add-btn, .ext-link, .flip-remove-btn,
 *  .flip-complete-btn, #export-csv-btn, .data-mgmt button) must remain
 *  legible and clickable regardless of active style. Heavy shadows, blurs,
 *  and gradients are suppressed on these micro-targets.
 * ═══════════════════════════════════════════════════════════════════════════ */

/* ── Glass: don't inherit parent's blur on micro-buttons ─────────────────── */
body[data-style="glass"] .card-actions button,
body[data-style="glass"] .card-actions a,
body[data-style="glass"] .flip-card-actions button,
body[data-style="glass"] #export-csv-btn {
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

/* ── Neumorphism: minimal shadow for icon buttons ────────────────────────── */
body[data-style="neumorphism"] .popout-btn,
body[data-style="neumorphism"] .fav-btn,
body[data-style="neumorphism"] .alert-btn,
body[data-style="neumorphism"] .quick-add-btn,
body[data-style="neumorphism"] .flip-remove-btn,
body[data-style="neumorphism"] .flip-complete-btn,
body[data-style="neumorphism"] #export-csv-btn,
body[data-style="neumorphism"] .ext-link {
  box-shadow: none;
  border: none;
  background: transparent;
}
body[data-style="neumorphism"] .popout-btn:hover,
body[data-style="neumorphism"] .fav-btn:hover,
body[data-style="neumorphism"] .alert-btn:hover,
body[data-style="neumorphism"] .quick-add-btn:hover,
body[data-style="neumorphism"] .flip-remove-btn:hover,
body[data-style="neumorphism"] .flip-complete-btn:hover,
body[data-style="neumorphism"] #export-csv-btn:hover {
  box-shadow: 2px 2px 4px var(--neu-shadow-dark),
             -2px -2px 4px var(--neu-shadow-light);
  border-radius: 4px;
}

/* ── Skeuomorphism: flatten micro-buttons to avoid visual clutter ────────── */
body[data-style="skeuomorphism"] .popout-btn,
body[data-style="skeuomorphism"] .fav-btn,
body[data-style="skeuomorphism"] .alert-btn,
body[data-style="skeuomorphism"] .quick-add-btn,
body[data-style="skeuomorphism"] .ext-link {
  background: transparent;
  border: none;
  box-shadow: none;
}
body[data-style="skeuomorphism"] .popout-btn:hover,
body[data-style="skeuomorphism"] .fav-btn:hover,
body[data-style="skeuomorphism"] .alert-btn:hover,
body[data-style="skeuomorphism"] .quick-add-btn:hover {
  background: color-mix(in srgb, var(--skeu-card-highlight), transparent 60%);
  border-radius: 3px;
}
/* Flip action buttons keep a subtle bevel at small scale */
body[data-style="skeuomorphism"] .flip-remove-btn,
body[data-style="skeuomorphism"] .flip-complete-btn,
body[data-style="skeuomorphism"] #export-csv-btn {
  background: linear-gradient(180deg, var(--skeu-btn-from) 0%, var(--skeu-btn-to) 100%);
  border: 1px solid var(--skeu-card-shadow-edge);
  border-top: 1px solid color-mix(in srgb, var(--skeu-card-highlight), transparent 50%);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
}
body[data-style="skeuomorphism"] .flip-remove-btn:active,
body[data-style="skeuomorphism"] .flip-complete-btn:active,
body[data-style="skeuomorphism"] #export-csv-btn:active {
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.35);
  transform: translateY(1px);
}`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/styles/style-glassmorphism.css"
/*!***********************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/styles/style-glassmorphism.css ***!
  \***********************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ═══════════════════════════════════════════════════════════════════════════
 *  STYLE: Glassmorphism  (body[data-style="glass"])
 *
 *  Frosted-glass panels via backdrop-filter: blur(), highly translucent
 *  rgba backgrounds, and crisp semi-transparent borders. Body gets a
 *  gradient background that shows through the frosted panels.
 * ═══════════════════════════════════════════════════════════════════════════ */

body[data-style="glass"] {
  background: linear-gradient(135deg, var(--glass-body-from) 0%, var(--glass-body-via) 50%, var(--glass-body-to) 100%);
  --bg-main: var(--glass-panel);
  --bg-panel: var(--glass-panel);
  --bg-elevated: var(--glass-elevated);
  --bg-hover: var(--glass-hover);
  --bg-input: var(--glass-input);
  --bg-muted: var(--glass-muted);
  --bg-number-input: var(--glass-panel);
  --bg-filter: var(--glass-muted);
  --border-card: var(--glass-border-card);
  --border-main: var(--glass-border-main);
  --border-section: var(--glass-border-section);
  --border-input: var(--glass-border-input);
  --border-subtle: var(--glass-border-main);
  --scrollbar-thumb: var(--glass-scrollbar);
  --modal-backdrop: rgba(0, 0, 0, 0.45);
}
body[data-style="glass"] #app {
  background: transparent;
}

/* ── Frosted panel treatment — backdrop-filter + rounded corners ─────────── */
body[data-style="glass"] .market-card,
body[data-style="glass"] .top20-section,
body[data-style="glass"] .favorites-section,
body[data-style="glass"] #settings-panel,
body[data-style="glass"] #market-view,
body[data-style="glass"] #view-tabs,
body[data-style="glass"] .analytics-modal-content,
body[data-style="glass"] .analytics-modal,
body[data-style="glass"] .setup-guide-content,
body[data-style="glass"] .setup-guide-modal,
body[data-style="glass"] .item-modal,
body[data-style="glass"] .graph-modal,
body[data-style="glass"] .filter-bar,
body[data-style="glass"] .flip-card,
body[data-style="glass"] .completed-flip-card,
body[data-style="glass"] .settings-group,
body[data-style="glass"] #advisor-view,
body[data-style="glass"] #portfolio-view {
  backdrop-filter: blur(18px) saturate(1.2);
  -webkit-backdrop-filter: blur(18px) saturate(1.2);
}
/* Cards: crisp semi-transparent border + subtle radius */
body[data-style="glass"] .market-card {
  border: 1px solid var(--glass-border-card);
  border-radius: 8px;
}
/* Sections: frosted panels with luminous top edge */
body[data-style="glass"] .top20-section,
body[data-style="glass"] .favorites-section {
  border: 1px solid var(--glass-border-section);
  border-radius: 10px;
}
/* Settings fieldsets: subtle glass border */
body[data-style="glass"] .settings-group {
  border: 1px solid var(--glass-border-section);
  border-radius: 8px;
}
/* Flip cards: glass treatment */
body[data-style="glass"] .flip-card,
body[data-style="glass"] .completed-flip-card {
  border: 1px solid var(--glass-border-card);
  border-radius: 6px;
}
/* Tab buttons: glass pill shape */
body[data-style="glass"] .tab-btn {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 6px;
}
/* Modal content: stronger blur for overlays */
body[data-style="glass"] .analytics-modal-content,
body[data-style="glass"] .setup-guide-content {
  backdrop-filter: blur(24px) saturate(1.3);
  -webkit-backdrop-filter: blur(24px) saturate(1.3);
  border: 1px solid var(--glass-border-card);
  border-radius: 12px;
}
/* Input fields: inner glow border on focus */
body[data-style="glass"] input:focus,
body[data-style="glass"] select:focus {
  box-shadow: 0 0 0 1px var(--glass-border-input);
}`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/styles/style-neumorphism.css"
/*!*********************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/styles/style-neumorphism.css ***!
  \*********************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ═══════════════════════════════════════════════════════════════════════════
 *  STYLE: Neumorphism  (body[data-style="neumorphism"])
 *
 *  Elements share the canvas background colour. Shape is conveyed entirely
 *  through paired box-shadows (one light, one dark) — no visible borders.
 *  Outset shadows = extruded; inset shadows = indented.
 * ═══════════════════════════════════════════════════════════════════════════ */

body[data-style="neumorphism"] {
  /* Strip ALL visible borders — shape comes from shadows only */
  --border-main: transparent;
  --border-section: transparent;
  --border-card: transparent;
  --border-input: transparent;
  --border-subtle: transparent;
  --border-hype: transparent;
  --border-hype-hover: transparent;
  --border-red-border: transparent;
  --modal-shadow: none;
}

/* ── Cards: extruded from the canvas ─────────────────────────────────────── */
body[data-style="neumorphism"] .market-card {
  background: var(--bg-main);  /* must match canvas */
  border: none;
  border-radius: 12px;
  box-shadow: 6px 6px 12px var(--neu-shadow-dark),
             -6px -6px 12px var(--neu-shadow-light);
  margin: 2px;
}
body[data-style="neumorphism"] .market-card:hover {
  box-shadow: 4px 4px 8px var(--neu-shadow-dark),
             -4px -4px 8px var(--neu-shadow-light);
}
/* Expanded card detail: gentle inset well */
body[data-style="neumorphism"] .market-card.expanded .market-card-detail {
  box-shadow: inset 2px 2px 5px var(--neu-shadow-dark),
              inset -2px -2px 5px var(--neu-shadow-light);
  border-radius: 0 0 12px 12px;
}

/* ── Sections: raised panels ─────────────────────────────────────────────── */
body[data-style="neumorphism"] .top20-section {
  background: var(--bg-main);
  border: none;
  border-radius: 14px;
  box-shadow: 8px 8px 16px var(--neu-shadow-dark),
             -8px -8px 16px var(--neu-shadow-light);
}
body[data-style="neumorphism"] .favorites-section {
  background: var(--bg-main);
  border: none;
  border-radius: 14px;
  box-shadow: 6px 6px 14px var(--neu-shadow-dark),
             -6px -6px 14px var(--neu-shadow-light);
}
body[data-style="neumorphism"] #settings-panel {
  background: var(--bg-main);
  border: none;
  border-radius: 10px;
  box-shadow: 4px 4px 10px var(--neu-shadow-dark),
             -4px -4px 10px var(--neu-shadow-light);
}
body[data-style="neumorphism"] .settings-group {
  border: none;
  border-radius: 10px;
  box-shadow: inset 3px 3px 6px var(--neu-shadow-dark),
              inset -3px -3px 6px var(--neu-shadow-light);
}

/* ── Flip / portfolio cards ──────────────────────────────────────────────── */
body[data-style="neumorphism"] .flip-card,
body[data-style="neumorphism"] .completed-flip-card {
  background: var(--bg-main);
  border: none;
  border-radius: 10px;
  box-shadow: 4px 4px 8px var(--neu-shadow-dark),
             -4px -4px 8px var(--neu-shadow-light);
}

/* ── Inputs/selects: indented wells ──────────────────────────────────────── */
body[data-style="neumorphism"] .view-btn,
body[data-style="neumorphism"] .section-sort-select,
body[data-style="neumorphism"] #market-search-input,
body[data-style="neumorphism"] .filter-bar select,
body[data-style="neumorphism"] input[type="number"],
body[data-style="neumorphism"] input[type="text"],
body[data-style="neumorphism"] input[type="password"] {
  background: var(--bg-main);
  border: none;
  border-radius: 8px;
  box-shadow: inset 2px 2px 5px var(--neu-shadow-dark),
              inset -2px -2px 5px var(--neu-shadow-light);
}
body[data-style="neumorphism"] .view-btn.active {
  box-shadow: inset 3px 3px 6px var(--neu-shadow-dark),
              inset -3px -3px 6px var(--neu-accent-shadow);
}

/* ── Buttons: raised pillows ─────────────────────────────────────────────── */
body[data-style="neumorphism"] .scan-btn,
body[data-style="neumorphism"] .refresh-btn,
body[data-style="neumorphism"] .tab-btn,
body[data-style="neumorphism"] .danger-btn,
body[data-style="neumorphism"] .data-mgmt button {
  background: var(--bg-main);
  border: none;
  border-radius: 8px;
  box-shadow: 4px 4px 8px var(--neu-shadow-dark),
             -4px -4px 8px var(--neu-shadow-light);
}
body[data-style="neumorphism"] .scan-btn:hover,
body[data-style="neumorphism"] .refresh-btn:hover,
body[data-style="neumorphism"] .tab-btn:hover,
body[data-style="neumorphism"] .data-mgmt button:hover {
  box-shadow: 2px 2px 5px var(--neu-shadow-dark),
             -2px -2px 5px var(--neu-shadow-light);
}
body[data-style="neumorphism"] .tab-btn.active {
  box-shadow: inset 3px 3px 6px var(--neu-shadow-dark),
              inset -3px -3px 6px var(--neu-accent-shadow);
}

/* ── Modals: floating neumorphic panel ───────────────────────────────────── */
body[data-style="neumorphism"] .analytics-modal-content,
body[data-style="neumorphism"] .setup-guide-content {
  background: var(--bg-main);
  border: none;
  border-radius: 16px;
  box-shadow: 10px 10px 20px var(--neu-shadow-dark),
             -10px -10px 20px var(--neu-shadow-light);
}

/* Neumorphism spacing — shadows need breathing room */
body[data-style="neumorphism"] .market-items.tile {
  gap: 14px;
  padding: 12px 14px;
}
body[data-style="neumorphism"] .market-items.hybrid {
  gap: 12px;
  padding: 10px 12px;
}
body[data-style="neumorphism"] .market-items.list {
  gap: 10px;
  padding: 8px 10px;
}`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/styles/style-skeuomorphism.css"
/*!***********************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/styles/style-skeuomorphism.css ***!
  \***********************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ═══════════════════════════════════════════════════════════════════════════
 *  STYLE: Skeuomorphism  (body[data-style="skeuomorphism"])
 *
 *  Tactile realism: linear-gradient backgrounds for material texture,
 *  inner shadows for beveled edges, and drop shadows for physical depth.
 *  Top border = highlight (light edge), bottom border = shadow edge.
 * ═══════════════════════════════════════════════════════════════════════════ */

body[data-style="skeuomorphism"] {
  background: linear-gradient(180deg, var(--skeu-body-from) 0%, var(--skeu-body-to) 100%);
}

/* ── Cards: textured surface with bevel ──────────────────────────────────── */
body[data-style="skeuomorphism"] .market-card {
  background: linear-gradient(180deg, var(--skeu-card-from) 0%, var(--skeu-card-mid) 40%, var(--skeu-card-to) 100%);
  border: 1px solid var(--skeu-card-shadow-edge);
  border-top: 1px solid var(--skeu-card-highlight);
  border-radius: 5px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.45),
              inset 0 1px 0 rgba(255, 255, 255, 0.08),
              inset 0 -1px 0 rgba(0, 0, 0, 0.15);
}
body[data-style="skeuomorphism"] .market-card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.55),
              inset 0 1px 0 rgba(255, 255, 255, 0.10),
              inset 0 -1px 0 rgba(0, 0, 0, 0.18);
}

/* ── Sections: embossed panel frame ──────────────────────────────────────── */
body[data-style="skeuomorphism"] .top20-section {
  background: linear-gradient(180deg, var(--skeu-card-from) 0%, var(--skeu-body-to) 100%);
  border: 1px solid var(--skeu-card-shadow-edge);
  border-top: 1px solid var(--skeu-card-highlight);
  border-radius: 6px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.50),
              inset 0 1px 0 rgba(255, 255, 255, 0.06);
}
body[data-style="skeuomorphism"] .favorites-section {
  background: linear-gradient(180deg, var(--skeu-card-from) 0%, var(--skeu-body-to) 100%);
  border: 1px solid var(--skeu-card-shadow-edge);
  border-top: 1px solid var(--skeu-card-highlight);
  border-radius: 6px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.45),
              inset 0 1px 0 rgba(255, 255, 255, 0.05);
}
body[data-style="skeuomorphism"] .top20-section #market-header {
  background: linear-gradient(180deg, var(--skeu-header-from) 0%, var(--skeu-header-to) 100%);
  border-bottom: 1px solid var(--skeu-card-shadow-edge);
  border-radius: 5px 5px 0 0;
}
body[data-style="skeuomorphism"] #settings-panel {
  background: linear-gradient(180deg, var(--skeu-header-from) 0%, var(--skeu-header-to) 100%);
  border: 1px solid var(--skeu-card-shadow-edge);
  border-top: 1px solid var(--skeu-card-highlight);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.40),
              inset 0 1px 0 rgba(255, 255, 255, 0.05);
}
body[data-style="skeuomorphism"] .settings-group {
  background: linear-gradient(180deg, var(--skeu-card-mid) 0%, var(--skeu-card-to) 100%);
  border: 1px solid var(--skeu-card-shadow-edge);
  border-top: 1px solid color-mix(in srgb, var(--skeu-card-highlight), transparent 40%);
  border-radius: 5px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.15);
}

/* ── Buttons: beveled pushable surfaces ──────────────────────────────────── */
body[data-style="skeuomorphism"] .view-btn,
body[data-style="skeuomorphism"] .scan-btn,
body[data-style="skeuomorphism"] .refresh-btn,
body[data-style="skeuomorphism"] .tab-btn,
body[data-style="skeuomorphism"] .data-mgmt button,
body[data-style="skeuomorphism"] .danger-btn {
  background: linear-gradient(180deg, var(--skeu-btn-from) 0%, var(--skeu-btn-to) 100%);
  border: 1px solid var(--skeu-card-shadow-edge);
  border-top: 1px solid var(--skeu-card-highlight);
  border-radius: 4px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.35),
              inset 0 1px 0 rgba(255, 255, 255, 0.08);
}
body[data-style="skeuomorphism"] .view-btn:hover,
body[data-style="skeuomorphism"] .scan-btn:hover,
body[data-style="skeuomorphism"] .refresh-btn:hover,
body[data-style="skeuomorphism"] .tab-btn:hover,
body[data-style="skeuomorphism"] .data-mgmt button:hover {
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.40),
              inset 0 1px 0 rgba(255, 255, 255, 0.10);
}
body[data-style="skeuomorphism"] .view-btn.active,
body[data-style="skeuomorphism"] .tab-btn.active {
  background: linear-gradient(180deg, var(--skeu-btn-active-from) 0%, var(--skeu-btn-active-to) 100%);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.40),
              inset 0 -1px 0 rgba(255, 255, 255, 0.06);
  color: var(--text-bright);
}
body[data-style="skeuomorphism"] .view-btn:active,
body[data-style="skeuomorphism"] .scan-btn:active,
body[data-style="skeuomorphism"] .tab-btn:active {
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.35);
  transform: translateY(1px);
}

/* ── Flip / portfolio cards ──────────────────────────────────────────────── */
body[data-style="skeuomorphism"] .flip-card,
body[data-style="skeuomorphism"] .completed-flip-card {
  background: linear-gradient(180deg, var(--skeu-card-from) 0%, var(--skeu-card-mid) 50%, var(--skeu-card-to) 100%);
  border: 1px solid var(--skeu-card-shadow-edge);
  border-top: 1px solid var(--skeu-card-highlight);
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.35),
              inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

/* ── Inputs: carved inset fields ─────────────────────────────────────────── */
body[data-style="skeuomorphism"] input[type="text"],
body[data-style="skeuomorphism"] input[type="password"],
body[data-style="skeuomorphism"] input[type="number"],
body[data-style="skeuomorphism"] select,
body[data-style="skeuomorphism"] #market-search-input {
  background: linear-gradient(180deg,
    color-mix(in srgb, var(--skeu-card-to), black 8%) 0%,
    var(--skeu-card-to) 100%);
  border: 1px solid var(--skeu-card-shadow-edge);
  border-radius: 4px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.25),
              inset 0 -1px 0 rgba(255, 255, 255, 0.05);
}

/* ── Modals: heavy realistic frame ───────────────────────────────────────── */
body[data-style="skeuomorphism"] .analytics-modal-content,
body[data-style="skeuomorphism"] .setup-guide-content {
  background: linear-gradient(180deg, var(--skeu-card-from) 0%, var(--skeu-card-mid) 30%, var(--skeu-card-to) 100%);
  border: 1px solid var(--skeu-card-shadow-edge);
  border-top: 2px solid var(--skeu-card-highlight);
  border-radius: 8px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.60),
              0 2px 4px rgba(0, 0, 0, 0.30),
              inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

/* Skeuomorphism — softer shadows & stronger highlights on light modes */
body[data-mode="light"][data-style="skeuomorphism"] .market-card {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.14),
              inset 0 1px 0 rgba(255, 255, 255, 0.50),
              inset 0 -1px 0 rgba(0, 0, 0, 0.05);
}
body[data-mode="light"][data-style="skeuomorphism"] .market-card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.18),
              inset 0 1px 0 rgba(255, 255, 255, 0.60),
              inset 0 -1px 0 rgba(0, 0, 0, 0.06);
}
body[data-mode="light"][data-style="skeuomorphism"] .top20-section,
body[data-mode="light"][data-style="skeuomorphism"] .favorites-section {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.10),
              inset 0 1px 0 rgba(255, 255, 255, 0.40);
}
body[data-mode="light"][data-style="skeuomorphism"] .flip-card,
body[data-mode="light"][data-style="skeuomorphism"] .completed-flip-card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.10),
              inset 0 1px 0 rgba(255, 255, 255, 0.45);
}
body[data-mode="light"][data-style="skeuomorphism"] input[type="text"],
body[data-mode="light"][data-style="skeuomorphism"] input[type="password"],
body[data-mode="light"][data-style="skeuomorphism"] input[type="number"],
body[data-mode="light"][data-style="skeuomorphism"] select,
body[data-mode="light"][data-style="skeuomorphism"] #market-search-input {
  box-shadow: inset 0 2px 3px rgba(0, 0, 0, 0.10),
              inset 0 -1px 0 rgba(255, 255, 255, 0.30);
}
body[data-mode="light"][data-style="skeuomorphism"] .analytics-modal-content,
body[data-mode="light"][data-style="skeuomorphism"] .setup-guide-content {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18),
              0 2px 4px rgba(0, 0, 0, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.50);
}`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-classic-dark.css"
/*!*************************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-classic-dark.css ***!
  \*************************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ─────────────────────────────────────────────────────────────────────────────
 *  COLORWAY: Classic Dark (OSRS Brown)
 * ───────────────────────────────────────────────────────────────────────────── */

body[data-mode="dark"][data-colorway="classic"] {
  --bg-main: #382b1f;
  --bg-panel: #4a3a2a;
  --bg-elevated: #56452f;
  --bg-hover: #5c4b35;
  --dropdown-bg: #56452f;
  --dropdown-hover-bg: #5c4b35;
  --bg-input: #3e2e1e;
  --bg-muted: #4a3a2a;
  --bg-filter: #322418;
  --bg-number-input: #3a2c1e;

  --text-main: #ffdf8f;
  --text-bright: #fff5d0;
  --text-accent: #ffd666;
  --text-heading: #ff9900;
  --text-price: #6bba48;
  --text-muted: #b89860;
  --text-soft: #c8a060;
  --text-dimmed: #8a6d40;

  --border-main: #1f160e;
  --border-section: #2a1e12;
  --border-card: #5a4428;
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
  --accent-hype: #e89830;

  /* Contrast base (referenced by contrast-modifiers) */
  --accent-teal-base: #8fbc8f;
  --accent-red-base: #dc143c;
  --accent-blue-text-base: #cd853f;
  --accent-gold-base: #ffd700;

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

  /* Glass helpers */
  --glass-body-from: #1a1008;
  --glass-body-via: #2a1e10;
  --glass-body-to: #1a1508;
  --glass-panel: rgba(255, 220, 150, 0.06);
  --glass-elevated: rgba(255, 220, 150, 0.10);
  --glass-hover: rgba(255, 220, 150, 0.12);
  --glass-input: rgba(255, 220, 150, 0.08);
  --glass-muted: rgba(255, 220, 150, 0.05);
  --glass-border-card: rgba(255, 200, 100, 0.20);
  --glass-border-main: rgba(255, 200, 100, 0.10);
  --glass-border-section: rgba(255, 200, 100, 0.12);
  --glass-border-input: rgba(255, 200, 100, 0.22);
  --glass-scrollbar: rgba(255, 200, 100, 0.15);

  /* Neumorphism helpers */
  --neu-shadow-dark: #2a1e14;
  --neu-shadow-light: #5c4a38;
  --neu-accent-shadow: #6b3410;

  /* Skeuomorphism helpers */
  --skeu-body-from: #2a2018;
  --skeu-body-to: #382b1f;
  --skeu-card-from: #584838;
  --skeu-card-mid: #4a3a2a;
  --skeu-card-to: #403020;
  --skeu-card-highlight: #6a5840;
  --skeu-card-shadow-edge: #1f160e;
  --skeu-header-from: #584838;
  --skeu-header-to: #4a4038;
  --skeu-btn-from: #5a4830;
  --skeu-btn-to: #4a3820;
  --skeu-btn-active-from: #8b4513;
  --skeu-btn-active-to: #6b3410;
}`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-classic-light.css"
/*!**************************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-classic-light.css ***!
  \**************************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ─────────────────────────────────────────────────────────────────────────────
 *  COLORWAY: Classic — Light (OSRS)
 * ───────────────────────────────────────────────────────────────────────────── */

body[data-mode="light"][data-colorway="classic"] {
  --bg-main: #f5ead4;
  --bg-panel: #fff6e6;
  --bg-elevated: #fdf2dc;
  --bg-hover: #f0e2c8;
  --dropdown-bg: #fdf2dc;
  --dropdown-hover-bg: #f0e2c8;
  --bg-input: #f0e4cc;
  --bg-muted: #e8dcc0;
  --bg-filter: #f0e8d0;
  --bg-number-input: #f0e4cc;

  --text-main: #4a3520;
  --text-bright: #2c1a08;
  --text-accent: #8b4513;
  --text-heading: #a05a14;
  --text-price: #2a7a1a;
  --text-muted: #8a7560;
  --text-soft: #a08a70;
  --text-dimmed: #c0aa88;

  --border-main: #e0d0b0;
  --border-section: #d8c8a4;
  --border-card: #d0c098;
  --border-input: #c8b890;
  --border-subtle: #e0d4b8;
  --border-hype: #d4a520;
  --border-hype-hover: #b8920a;

  --accent-primary: #8b4513;
  --accent-primary-hover: #a0522d;
  --accent-primary-active: #6b3410;
  --accent-focus: #cd853f;
  --accent-blue-text: #8b5e3c;
  --accent-green: #5a8a1e;
  --accent-green-bright: #3a7a10;
  --accent-teal: #6b8e6b;
  --accent-gold: #c8960a;
  --accent-gold-hype: #b07808;
  --accent-red: #cc3333;
  --accent-red-dark: #8b0000;
  --accent-red-bg: #fff0e8;
  --accent-red-border: #e0a090;
  --accent-red-border-hover: #d08070;
  --accent-hype: #c87e10;

  /* Contrast base (referenced by contrast-modifiers) */
  --accent-teal-base: #6b8e6b;
  --accent-red-base: #cc3333;
  --accent-blue-text-base: #8b5e3c;
  --accent-gold-base: #c8960a;

  --chat-user-bg: #f5e8d0;
  --chat-error-bg: #fff0e8;
  --badge-buy-bg: #e8e0c8;
  --badge-sell-bg: #e0f0d0;
  --badge-hype-bg: #f8f0c8;

  --modal-backdrop: rgba(0, 0, 0, 0.25);
  --modal-shadow: rgba(0, 0, 0, 0.15);
  --scrollbar-thumb: #c8b890;
  --scrollbar-thumb-hover: #a89a78;
  --link-color: #8b4513;
  --add-flip-bg: #d8eac0;
  --limit-ready-bg: #e0f0d0;

  /* Glass helpers */
  --glass-body-from: #e8dcc0;
  --glass-body-via: #f0e4cc;
  --glass-body-to: #e0d4b0;
  --glass-panel: rgba(255, 240, 210, 0.55);
  --glass-elevated: rgba(255, 240, 210, 0.65);
  --glass-hover: rgba(255, 240, 210, 0.70);
  --glass-input: rgba(255, 240, 210, 0.50);
  --glass-muted: rgba(255, 240, 210, 0.40);
  --glass-border-card: rgba(139, 69, 19, 0.15);
  --glass-border-main: rgba(139, 69, 19, 0.08);
  --glass-border-section: rgba(139, 69, 19, 0.10);
  --glass-border-input: rgba(139, 69, 19, 0.18);
  --glass-scrollbar: rgba(139, 69, 19, 0.12);

  /* Neumorphism helpers */
  --neu-shadow-dark: #d0c098;
  --neu-shadow-light: #fff8ea;
  --neu-accent-shadow: #6b3410;

  /* Skeuomorphism helpers */
  --skeu-body-from: #e0d4b0;
  --skeu-body-to: #f5ead4;
  --skeu-card-from: #fff6e6;
  --skeu-card-mid: #faf0da;
  --skeu-card-to: #f0e4cc;
  --skeu-card-highlight: #fff8ea;
  --skeu-card-shadow-edge: #c8b890;
  --skeu-header-from: #faf0da;
  --skeu-header-to: #f0e8d0;
  --skeu-btn-from: #f5ead4;
  --skeu-btn-to: #e8dcc0;
  --skeu-btn-active-from: #8b4513;
  --skeu-btn-active-to: #6b3410;
}

/* (light-mode view-btn.active consolidated — see below contrast modifiers) */
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-default-dark.css"
/*!*************************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-default-dark.css ***!
  \*************************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
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
 *  THEME SYSTEM — Two-axis: Colorway × Style
 *
 *  Mode     (body[data-mode]):       dark | light
 *  Colorway (body[data-colorway]):   default | classic | rs3-modern | solarized | rs-lobby | gruvbox | twilight-amethyst | osrs-design
 *  Contrast (body[data-contrast]):   default | soft | hard
 *  Style    (body[data-style]):      basic | glass | neumorphism | skeuomorphism
 *
 *  Mode × Colorway sets ALL colour variables + per-style helper vars.
 *  Contrast applies brightness adjustments on top.
 *  Style applies structural overrides (shadows, filters, gradients)
 *  using the helper vars so every combination works automatically.
 * ═══════════════════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────────────────────
 *  COLORWAY: Default Dark
 * ───────────────────────────────────────────────────────────────────────────── */

:root {
  /* ── Backgrounds ─────────────────────── */
  --bg-main: #1e1e1e;
  --bg-panel: #252526;
  --bg-elevated: #2d2d30;
  --bg-hover: #2a2d2e;
  --dropdown-bg: #2d2d30;
  --dropdown-hover-bg: #2a2d2e;
  --bg-input: #3c3c3c;
  --bg-muted: #333;
  --bg-filter: #1e1e24;
  --bg-number-input: #2a2a2e;

  /* ── Text ────────────────────────────── */
  --text-main: #d4d4d4;
  --text-bright: #fff;
  --text-accent: #9cdcfe;
  --text-heading: #dcdcaa;
  --text-price: #4ade80;
  --text-muted: #94a3b8;
  --text-soft: #aaa;
  --text-dimmed: #666;

  /* ── Borders ─────────────────────────── */
  --border-main: #333;
  --border-section: #3a3d40;
  --border-card: #4a4d50;
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
  --accent-green: #5ece6b;
  --accent-green-bright: #27ae60;
  --accent-teal: #4ec9b0;
  --accent-gold: #f0c040;
  --accent-gold-hype: #f5c542;
  --accent-hype: #ffab40;
  --accent-red: #ff6b6b;
  --accent-red-dark: #c0392b;
  --accent-red-bg: #3a1d1d;
  --accent-red-border: #6b3030;
  --accent-red-border-hover: #a04040;

  /* ── Contrast base (referenced by contrast-modifiers — never self-referencing) */
  --accent-teal-base: #4ec9b0;
  --accent-red-base: #ff6b6b;
  --accent-blue-text-base: #569cd6;
  --accent-gold-base: #f0c040;

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

  /* ── Badge sizing tokens ──────────────── */
  --badge-font-sm: 11px;
  --badge-font-md: 12px;
  --badge-padding-sm: 2px 6px;
  --badge-padding-md: 3px 7px;
  --badge-radius: 3px;
  --badge-font-weight: 600;

  /* ── Alias tokens (consumed by components that use short names) ── */
  --border: var(--border-main);
  --text: var(--text-main);

  /* ── Semantic badge-bg tokens (theme-aware, replaces hard-coded rgba) ── */
  --badge-velocity-insta-bg: rgba(39, 174, 96, 0.18);
  --badge-velocity-active-bg: rgba(86, 156, 214, 0.18);
  --badge-velocity-slow-bg: rgba(240, 192, 64, 0.18);
  --badge-velocity-muted-bg: rgba(136, 136, 136, 0.18);
  --badge-trend-up-bg: rgba(39, 174, 96, 0.18);
  --badge-trend-down-bg: rgba(244, 71, 71, 0.18);
  --badge-neutral-bg: rgba(136, 136, 136, 0.15);
  --badge-hype-vol-bg: rgba(255, 171, 64, 0.15);
  --badge-tier-free-bg: rgba(76, 175, 80, 0.12);
  --badge-tier-free-border: rgba(76, 175, 80, 0.3);
  --badge-tier-freetier-bg: rgba(78, 205, 196, 0.12);
  --badge-tier-freetier-border: rgba(78, 205, 196, 0.3);
  --badge-tier-lowcost-bg: rgba(100, 149, 237, 0.12);
  --badge-tier-lowcost-border: rgba(100, 149, 237, 0.3);
  --badge-tier-neutral-bg: rgba(180, 180, 180, 0.08);
  --badge-tier-neutral-border: rgba(180, 180, 180, 0.2);
  --table-active-row-bg: rgba(100, 149, 237, 0.08);
  --table-hover-row-bg: rgba(255, 255, 255, 0.03);
  --setup-note-bg: rgba(255, 215, 0, 0.08);
  --setup-note-border: rgba(255, 215, 0, 0.2);
  --detail-expanded-bg: rgba(0, 0, 0, 0.08);

  /* ── Close / win-loss glow tokens ─────── */
  --close-hover-bg: rgba(244, 71, 71, 0.12);
  --win-glow: color-mix(in srgb, var(--accent-green-bright) 8%, transparent);
  --loss-glow: color-mix(in srgb, var(--accent-red-dark) 8%, transparent);

  /* ── Misc ─────────────────────────────── */
  --link-color: #6cb4ee;
  --add-flip-bg: #1b6b2a;
  --limit-ready-bg: #1a2e1a;

  /* ── Style helper vars (Glass) ───────── */
  --glass-body-from: #141414;
  --glass-body-via: #1e1e1e;
  --glass-body-to: #181818;
  --glass-panel: rgba(255, 255, 255, 0.06);
  --glass-elevated: rgba(255, 255, 255, 0.10);
  --glass-hover: rgba(255, 255, 255, 0.12);
  --glass-input: rgba(255, 255, 255, 0.08);
  --glass-muted: rgba(255, 255, 255, 0.05);
  --glass-border-card: rgba(255, 255, 255, 0.18);
  --glass-border-main: rgba(255, 255, 255, 0.10);
  --glass-border-section: rgba(255, 255, 255, 0.12);
  --glass-border-input: rgba(255, 255, 255, 0.20);
  --glass-scrollbar: rgba(255, 255, 255, 0.15);

  /* ── Style helper vars (Neumorphism) ─── */
  --neu-shadow-dark: #151518;
  --neu-shadow-light: #383840;
  --neu-accent-shadow: #094771;

  /* ── Style helper vars (Skeuomorphism) ── */
  --skeu-body-from: #151518;
  --skeu-body-to: #1e1e1e;
  --skeu-card-from: #353538;
  --skeu-card-mid: #252526;
  --skeu-card-to: #1e1e20;
  --skeu-card-highlight: #444;
  --skeu-card-shadow-edge: #151518;
  --skeu-header-from: #353538;
  --skeu-header-to: #2a2a2e;
  --skeu-btn-from: #3a3a3e;
  --skeu-btn-to: #2a2a2e;
  --skeu-btn-active-from: #0e639c;
  --skeu-btn-active-to: #094771;
}`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-default-light.css"
/*!**************************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-default-light.css ***!
  \**************************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ─────────────────────────────────────────────────────────────────────────────
 *  COLORWAY: Default — Light
 * ───────────────────────────────────────────────────────────────────────────── */

body[data-mode="light"][data-colorway="default"] {
  --bg-main: #f5f5f5;
  --bg-panel: #ffffff;
  --bg-elevated: #fafafa;
  --bg-hover: #f0f0f0;
  --dropdown-bg: #fafafa;
  --dropdown-hover-bg: #f0f0f0;
  --bg-input: #f0f0f0;
  --bg-muted: #e8e8e8;
  --bg-filter: #f0f0f0;
  --bg-number-input: #f5f5f5;

  --text-main: #333333;
  --text-bright: #111111;
  --text-accent: #0066cc;
  --text-heading: #1a1a1a;
  --text-price: #1a8a2a;
  --text-muted: #777777;
  --text-soft: #999999;
  --text-dimmed: #bbbbbb;

  --border-main: #e0e0e0;
  --border-section: #d8d8d8;
  --border-card: #d0d0d0;
  --border-input: #cccccc;
  --border-subtle: #e8e8e8;
  --border-hype: #d4a520;
  --border-hype-hover: #b8920a;

  --accent-primary: #0066cc;
  --accent-primary-hover: #0077dd;
  --accent-primary-active: #0055aa;
  --accent-focus: #0066cc;
  --accent-blue-text: #0066cc;
  --accent-green: #2a8a2a;
  --accent-green-bright: #22aa22;
  --accent-teal: #1a9a8a;
  --accent-gold: #d4a520;
  --accent-gold-hype: #c09010;
  --accent-red: #cc3333;
  --accent-red-dark: #aa2222;
  --accent-red-bg: #fff0f0;
  --accent-red-border: #e0a0a0;
  --accent-red-border-hover: #d08080;
  --accent-hype: #e68a00;

  /* Contrast base (referenced by contrast-modifiers) */
  --accent-teal-base: #1a9a8a;
  --accent-red-base: #cc3333;
  --accent-blue-text-base: #0066cc;
  --accent-gold-base: #d4a520;

  --chat-user-bg: #e6f0ff;
  --chat-error-bg: #fff0f0;
  --badge-buy-bg: #e0f0ff;
  --badge-sell-bg: #e0ffe0;
  --badge-hype-bg: #fff8e0;

  --modal-backdrop: rgba(0, 0, 0, 0.25);
  --modal-shadow: rgba(0, 0, 0, 0.15);
  --scrollbar-thumb: #cccccc;
  --scrollbar-thumb-hover: #aaaaaa;
  --link-color: #0066cc;
  --add-flip-bg: #d0f0d0;
  --limit-ready-bg: #e0f8e0;

  /* Glass helpers */
  --glass-body-from: #d8d8d8;
  --glass-body-via: #e4e4e4;
  --glass-body-to: #d0d0d0;
  --glass-panel: rgba(255, 255, 255, 0.50);
  --glass-elevated: rgba(255, 255, 255, 0.60);
  --glass-hover: rgba(255, 255, 255, 0.65);
  --glass-input: rgba(255, 255, 255, 0.45);
  --glass-muted: rgba(255, 255, 255, 0.35);
  --glass-border-card: rgba(0, 0, 0, 0.12);
  --glass-border-main: rgba(0, 0, 0, 0.08);
  --glass-border-section: rgba(0, 0, 0, 0.10);
  --glass-border-input: rgba(0, 0, 0, 0.15);
  --glass-scrollbar: rgba(0, 0, 0, 0.12);

  /* Neumorphism helpers */
  --neu-shadow-dark: #d0d0d0;
  --neu-shadow-light: #ffffff;
  --neu-accent-shadow: #0055aa;

  /* Skeuomorphism helpers */
  --skeu-body-from: #e8e8e8;
  --skeu-body-to: #f5f5f5;
  --skeu-card-from: #ffffff;
  --skeu-card-mid: #f8f8f8;
  --skeu-card-to: #f0f0f0;
  --skeu-card-highlight: #ffffff;
  --skeu-card-shadow-edge: #cccccc;
  --skeu-header-from: #fafafa;
  --skeu-header-to: #f0f0f0;
  --skeu-btn-from: #f5f5f5;
  --skeu-btn-to: #e8e8e8;
  --skeu-btn-active-from: #0066cc;
  --skeu-btn-active-to: #0055aa;
}`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-gruvbox-dark.css"
/*!*************************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-gruvbox-dark.css ***!
  \*************************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ─────────────────────────────────────────────────────────────────────────────
 *  COLORWAY: Gruvbox — Dark
 *  morhetz/gruvbox "retro groove" palette — warm earthy tones with pastel
 *  accents. bg0 #282828, fg1 #ebdbb2, yellow #d79921, aqua #689d6a.
 * ───────────────────────────────────────────────────────────────────────────── */

body[data-mode="dark"][data-colorway="gruvbox"] {
  --bg-main: #282828;
  --bg-panel: #3c3836;
  --bg-elevated: #504945;
  --bg-hover: #665c54;
  --dropdown-bg: #504945;
  --dropdown-hover-bg: #665c54;
  --bg-input: #32302f;
  --bg-muted: #3c3836;
  --bg-filter: #1d2021;
  --bg-number-input: #32302f;

  --text-main: #ebdbb2;
  --text-bright: #fbf1c7;
  --text-accent: #fabd2f;
  --text-heading: #fe8019;
  --text-price: #8ecc2a;
  --text-muted: #928374;
  --text-soft: #a89984;
  --text-dimmed: #7c6f64;

  --border-main: #504945;
  --border-section: #3c3836;
  --border-card: #665c54;
  --border-input: #665c54;
  --border-subtle: #504945;
  --border-hype: #d65d0e;
  --border-hype-hover: #fe8019;

  --accent-primary: #458588;
  --accent-primary-hover: #83a598;
  --accent-primary-active: #076678;
  --accent-focus: #83a598;
  --accent-blue-text: #83a598;
  --accent-green: #98971a;
  --accent-green-bright: #b8bb26;
  --accent-teal: #689d6a;
  --accent-gold: #d79921;
  --accent-gold-hype: #fabd2f;
  --accent-red: #fb4934;
  --accent-red-dark: #cc241d;
  --accent-red-bg: #3c1f1f;
  --accent-red-border: #cc241d;
  --accent-red-border-hover: #fb4934;
  --accent-hype: #fe8019;

  /* Contrast base (referenced by contrast-modifiers) */
  --accent-teal-base: #689d6a;
  --accent-red-base: #fb4934;
  --accent-blue-text-base: #83a598;
  --accent-gold-base: #d79921;

  --chat-user-bg: #3c3836;
  --chat-error-bg: #3c1f1f;
  --badge-buy-bg: #2a3428;
  --badge-sell-bg: #283428;
  --badge-hype-bg: #3c3020;

  --modal-backdrop: rgba(0, 0, 0, 0.75);
  --modal-shadow: rgba(0, 0, 0, 0.9);
  --scrollbar-thumb: #665c54;
  --scrollbar-thumb-hover: #7c6f64;
  --link-color: #83a598;
  --add-flip-bg: #3a4a28;
  --limit-ready-bg: #2a3a1e;

  /* Glass helpers */
  --glass-body-from: #1d2021;
  --glass-body-via: #282828;
  --glass-body-to: #1d2021;
  --glass-panel: rgba(235, 219, 178, 0.05);
  --glass-elevated: rgba(235, 219, 178, 0.08);
  --glass-hover: rgba(235, 219, 178, 0.10);
  --glass-input: rgba(235, 219, 178, 0.06);
  --glass-muted: rgba(235, 219, 178, 0.04);
  --glass-border-card: rgba(235, 219, 178, 0.15);
  --glass-border-main: rgba(235, 219, 178, 0.08);
  --glass-border-section: rgba(235, 219, 178, 0.10);
  --glass-border-input: rgba(235, 219, 178, 0.18);
  --glass-scrollbar: rgba(235, 219, 178, 0.12);

  /* Neumorphism helpers */
  --neu-shadow-dark: #1d2021;
  --neu-shadow-light: #504945;
  --neu-accent-shadow: #076678;

  /* Skeuomorphism helpers */
  --skeu-body-from: #1d2021;
  --skeu-body-to: #282828;
  --skeu-card-from: #504945;
  --skeu-card-mid: #3c3836;
  --skeu-card-to: #32302f;
  --skeu-card-highlight: #665c54;
  --skeu-card-shadow-edge: #1d2021;
  --skeu-header-from: #504945;
  --skeu-header-to: #3c3836;
  --skeu-btn-from: #504945;
  --skeu-btn-to: #3c3836;
  --skeu-btn-active-from: #458588;
  --skeu-btn-active-to: #076678;
}`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-gruvbox-light.css"
/*!**************************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-gruvbox-light.css ***!
  \**************************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ─────────────────────────────────────────────────────────────────────────────
 *  COLORWAY: Gruvbox — Light
 *  morhetz/gruvbox light palette — warm cream bg (#fbf1c7), dark fg (#3c3836),
 *  same pastel accent family as Gruvbox Dark.
 * ───────────────────────────────────────────────────────────────────────────── */

body[data-mode="light"][data-colorway="gruvbox"] {
  --bg-main: #fbf1c7;
  --bg-panel: #ebdbb2;
  --bg-elevated: #f2e5bc;
  --bg-hover: #d5c4a1;
  --dropdown-bg: #f2e5bc;
  --dropdown-hover-bg: #d5c4a1;
  --bg-input: #ebdbb2;
  --bg-muted: #d5c4a1;
  --bg-filter: #f9f0c0;
  --bg-number-input: #ebdbb2;

  --text-main: #3c3836;
  --text-bright: #282828;
  --text-accent: #b57614;
  --text-heading: #af3a03;
  --text-price: #5a8a0e;
  --text-muted: #7c6f64;
  --text-soft: #928374;
  --text-dimmed: #a89984;

  --border-main: #d5c4a1;
  --border-section: #bdae93;
  --border-card: #bdae93;
  --border-input: #a89984;
  --border-subtle: #d5c4a1;
  --border-hype: #af3a03;
  --border-hype-hover: #d65d0e;

  --accent-primary: #076678;
  --accent-primary-hover: #458588;
  --accent-primary-active: #054b5c;
  --accent-focus: #076678;
  --accent-blue-text: #076678;
  --accent-green: #79740e;
  --accent-green-bright: #98971a;
  --accent-teal: #427b58;
  --accent-gold: #b57614;
  --accent-gold-hype: #d79921;
  --accent-red: #cc241d;
  --accent-red-dark: #9d0006;
  --accent-red-bg: #f9e0de;
  --accent-red-border: #cc241d;
  --accent-red-border-hover: #9d0006;
  --accent-hype: #af3a03;

  /* Contrast base (referenced by contrast-modifiers) */
  --accent-teal-base: #427b58;
  --accent-red-base: #cc241d;
  --accent-blue-text-base: #076678;
  --accent-gold-base: #b57614;

  --chat-user-bg: #ebdbb2;
  --chat-error-bg: #f9e0de;
  --badge-buy-bg: #e0dba8;
  --badge-sell-bg: #dde0a0;
  --badge-hype-bg: #eddca0;

  --modal-backdrop: rgba(0, 0, 0, 0.25);
  --modal-shadow: rgba(0, 0, 0, 0.15);
  --scrollbar-thumb: #bdae93;
  --scrollbar-thumb-hover: #a89984;
  --link-color: #076678;
  --add-flip-bg: #d0dca0;
  --limit-ready-bg: #dae4b0;

  /* Glass helpers */
  --glass-body-from: #e8dcb0;
  --glass-body-via: #f0e4c0;
  --glass-body-to: #e0d4a8;
  --glass-panel: rgba(251, 241, 199, 0.55);
  --glass-elevated: rgba(251, 241, 199, 0.65);
  --glass-hover: rgba(251, 241, 199, 0.70);
  --glass-input: rgba(251, 241, 199, 0.50);
  --glass-muted: rgba(251, 241, 199, 0.40);
  --glass-border-card: rgba(60, 56, 54, 0.12);
  --glass-border-main: rgba(60, 56, 54, 0.08);
  --glass-border-section: rgba(60, 56, 54, 0.10);
  --glass-border-input: rgba(60, 56, 54, 0.15);
  --glass-scrollbar: rgba(60, 56, 54, 0.10);

  /* Neumorphism helpers */
  --neu-shadow-dark: #d5c4a1;
  --neu-shadow-light: #fbf1c7;
  --neu-accent-shadow: #054b5c;

  /* Skeuomorphism helpers */
  --skeu-body-from: #ebdbb2;
  --skeu-body-to: #fbf1c7;
  --skeu-card-from: #f2e5bc;
  --skeu-card-mid: #ebdbb2;
  --skeu-card-to: #e0d4a8;
  --skeu-card-highlight: #fbf1c7;
  --skeu-card-shadow-edge: #bdae93;
  --skeu-header-from: #f2e5bc;
  --skeu-header-to: #ebdbb2;
  --skeu-btn-from: #f2e5bc;
  --skeu-btn-to: #ebdbb2;
  --skeu-btn-active-from: #076678;
  --skeu-btn-active-to: #054b5c;
}

/* (light-mode view-btn.active consolidated — see rule below) */
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-osrs-design-dark.css"
/*!*****************************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-osrs-design-dark.css ***!
  \*****************************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ─────────────────────────────────────────────────────────────────────────────
 *  COLORWAY: OSRS Design — Dark
 *
 *  Based on the official OSRS Design System (osrs.design/foundations/colors).
 *  Primary: yellow #FFCF3F, gold #E6A519, brown #694D23, darkBrown #382D1A
 *  UI: background #2E2C29, border #474745, panel #46433A
 *  Status: green #00FF00, red #FF0000, blue #0088FF
 *  Text: yellow #FFCF3F, gold #E6A519, chat cyan #00FFFF
 * ───────────────────────────────────────────────────────────────────────────── */

body[data-mode="dark"][data-colorway="osrs-design"] {
  /* ── Backgrounds ─────────────────────── */
  --bg-main: #2e2c29;
  --bg-panel: #46433a;
  --bg-elevated: #524e44;
  --bg-hover: #5a5648;
  --dropdown-bg: #524e44;
  --dropdown-hover-bg: #5a5648;
  --bg-input: #382d1a;
  --bg-muted: #3e3a32;
  --bg-filter: #262420;
  --bg-number-input: #342e24;

  /* ── Text ────────────────────────────── */
  --text-main: #ffcf3f;
  --text-bright: #fff5d0;
  --text-accent: #00ffff;
  --text-heading: #e6a519;
  --text-price: #4ade80;
  --text-muted: #b8a882;
  --text-soft: #a89870;
  --text-dimmed: #7a7060;

  /* ── Borders ─────────────────────────── */
  --border-main: #474745;
  --border-section: #555350;
  --border-card: #5e5c58;
  --border-input: #6a6860;
  --border-subtle: #504e48;
  --border-hype: #806020;
  --border-hype-hover: #a08830;

  /* ── Primary action ──────────────────── */
  --accent-primary: #694d23;
  --accent-primary-hover: #7a5e30;
  --accent-primary-active: #503a18;
  --accent-focus: #e6a519;

  /* ── Semantic accents ────────────────── */
  --accent-blue-text: #0088ff;
  --accent-green: #40e040;
  --accent-green-bright: #00cc00;
  --accent-teal: #00ddcc;
  --accent-gold: #e6a519;
  --accent-gold-hype: #ffcf3f;
  --accent-hype: #ffab40;
  --accent-red: #ff4444;
  --accent-red-dark: #cc0000;
  --accent-red-bg: #3a1a0a;
  --accent-red-border: #8b3030;
  --accent-red-border-hover: #a04040;

  /* ── Contrast base (referenced by contrast-modifiers — never self-referencing) */
  --accent-teal-base: #00ddcc;
  --accent-red-base: #ff4444;
  --accent-blue-text-base: #0088ff;
  --accent-gold-base: #e6a519;

  /* ── Chat ─────────────────────────────── */
  --chat-user-bg: #4a3e28;
  --chat-error-bg: #3a1a0a;

  /* ── Badges ──────────────────────────── */
  --badge-buy-bg: #2a3040;
  --badge-sell-bg: #1e3a1e;
  --badge-hype-bg: #3a3010;

  /* ── Modal ───────────────────────────── */
  --modal-backdrop: rgba(0, 0, 0, 0.7);
  --modal-shadow: rgba(0, 0, 0, 0.9);

  /* ── Scrollbar ───────────────────────── */
  --scrollbar-thumb: #6a6860;
  --scrollbar-thumb-hover: #877a68;

  /* ── Misc ─────────────────────────────── */
  --link-color: #00ccff;
  --add-flip-bg: #1a4a1a;
  --limit-ready-bg: #1a3a1a;

  /* ── Style helper vars (Glass) ───────── */
  --glass-body-from: #1a1810;
  --glass-body-via: #282420;
  --glass-body-to: #1e1c18;
  --glass-panel: rgba(255, 207, 63, 0.06);
  --glass-elevated: rgba(255, 207, 63, 0.10);
  --glass-hover: rgba(255, 207, 63, 0.12);
  --glass-input: rgba(255, 207, 63, 0.08);
  --glass-muted: rgba(255, 207, 63, 0.05);
  --glass-border-card: rgba(230, 165, 25, 0.22);
  --glass-border-main: rgba(230, 165, 25, 0.12);
  --glass-border-section: rgba(230, 165, 25, 0.14);
  --glass-border-input: rgba(230, 165, 25, 0.24);
  --glass-scrollbar: rgba(230, 165, 25, 0.15);

  /* ── Style helper vars (Neumorphism) ─── */
  --neu-shadow-dark: #1a1810;
  --neu-shadow-light: #524e44;
  --neu-accent-shadow: #503a18;

  /* ── Style helper vars (Skeuomorphism) ── */
  --skeu-body-from: #201e18;
  --skeu-body-to: #2e2c29;
  --skeu-card-from: #564e40;
  --skeu-card-mid: #46433a;
  --skeu-card-to: #3e3a32;
  --skeu-card-highlight: #686050;
  --skeu-card-shadow-edge: #1a1810;
  --skeu-header-from: #564e40;
  --skeu-header-to: #4a4638;
  --skeu-btn-from: #5a5240;
  --skeu-btn-to: #4a4230;
  --skeu-btn-active-from: #694d23;
  --skeu-btn-active-to: #503a18;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-osrs-design-light.css"
/*!******************************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-osrs-design-light.css ***!
  \******************************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ─────────────────────────────────────────────────────────────────────────────
 *  COLORWAY: OSRS Design — Light
 *
 *  Light-mode adaptation of the OSRS Design System palette.
 *  Warm parchment backgrounds with deep brown/gold text and accents.
 * ───────────────────────────────────────────────────────────────────────────── */

body[data-mode="light"][data-colorway="osrs-design"] {
  /* ── Backgrounds ─────────────────────── */
  --bg-main: #f8f0dc;
  --bg-panel: #fff8e8;
  --bg-elevated: #fdf4e0;
  --bg-hover: #f0e6cc;
  --dropdown-bg: #fdf4e0;
  --dropdown-hover-bg: #f0e6cc;
  --bg-input: #f2e8d0;
  --bg-muted: #eadfc4;
  --bg-filter: #f4ecd4;
  --bg-number-input: #f2e8d0;

  /* ── Text ────────────────────────────── */
  --text-main: #382d1a;
  --text-bright: #0f0f0f;
  --text-accent: #694d23;
  --text-heading: #8a5e0a;
  --text-price: #1a7a1a;
  --text-muted: #7a6a4a;
  --text-soft: #9a8a68;
  --text-dimmed: #baa880;

  /* ── Borders ─────────────────────────── */
  --border-main: #d8c8a4;
  --border-section: #d0be96;
  --border-card: #c8b68a;
  --border-input: #c0ae80;
  --border-subtle: #e0d2b0;
  --border-hype: #d4a520;
  --border-hype-hover: #b8920a;

  /* ── Primary action ──────────────────── */
  --accent-primary: #694d23;
  --accent-primary-hover: #7a5e30;
  --accent-primary-active: #503a18;
  --accent-focus: #e6a519;

  /* ── Semantic accents ────────────────── */
  --accent-blue-text: #0066cc;
  --accent-green: #228b22;
  --accent-green-bright: #1a7a1a;
  --accent-teal: #1a8a7a;
  --accent-gold: #c89000;
  --accent-gold-hype: #b07808;
  --accent-red: #cc2222;
  --accent-red-dark: #990000;
  --accent-red-bg: #fff0e8;
  --accent-red-border: #e0a090;
  --accent-red-border-hover: #d08070;
  --accent-hype: #c87e10;

  /* ── Contrast base (referenced by contrast-modifiers — never self-referencing) */
  --accent-teal-base: #1a8a7a;
  --accent-red-base: #cc2222;
  --accent-blue-text-base: #0066cc;
  --accent-gold-base: #c89000;

  /* ── Chat ─────────────────────────────── */
  --chat-user-bg: #f8eed0;
  --chat-error-bg: #fff0e8;

  /* ── Badges ──────────────────────────── */
  --badge-buy-bg: #e0eaf0;
  --badge-sell-bg: #d8f0d0;
  --badge-hype-bg: #f8f0c8;

  /* ── Modal ───────────────────────────── */
  --modal-backdrop: rgba(0, 0, 0, 0.25);
  --modal-shadow: rgba(0, 0, 0, 0.15);

  /* ── Scrollbar ───────────────────────── */
  --scrollbar-thumb: #c0ae80;
  --scrollbar-thumb-hover: #a09068;

  /* ── Misc ─────────────────────────────── */
  --link-color: #694d23;
  --add-flip-bg: #d0ecc0;
  --limit-ready-bg: #d8f0d0;

  /* ── Style helper vars (Glass) ───────── */
  --glass-body-from: #e8dcc0;
  --glass-body-via: #f0e4cc;
  --glass-body-to: #e0d4b0;
  --glass-panel: rgba(255, 248, 232, 0.55);
  --glass-elevated: rgba(255, 248, 232, 0.65);
  --glass-hover: rgba(255, 248, 232, 0.70);
  --glass-input: rgba(255, 248, 232, 0.50);
  --glass-muted: rgba(255, 248, 232, 0.40);
  --glass-border-card: rgba(105, 77, 35, 0.15);
  --glass-border-main: rgba(105, 77, 35, 0.08);
  --glass-border-section: rgba(105, 77, 35, 0.10);
  --glass-border-input: rgba(105, 77, 35, 0.18);
  --glass-scrollbar: rgba(105, 77, 35, 0.12);

  /* ── Style helper vars (Neumorphism) ─── */
  --neu-shadow-dark: #c8b890;
  --neu-shadow-light: #fff8ea;
  --neu-accent-shadow: #503a18;

  /* ── Style helper vars (Skeuomorphism) ── */
  --skeu-body-from: #e4d8b8;
  --skeu-body-to: #f8f0dc;
  --skeu-card-from: #fff8e8;
  --skeu-card-mid: #fdf4e0;
  --skeu-card-to: #f4ecd4;
  --skeu-card-highlight: #fff8ea;
  --skeu-card-shadow-edge: #c0ae80;
  --skeu-header-from: #fdf4e0;
  --skeu-header-to: #f4ecd4;
  --skeu-btn-from: #f8f0dc;
  --skeu-btn-to: #eadfc4;
  --skeu-btn-active-from: #694d23;
  --skeu-btn-active-to: #503a18;
}

/* (light-mode view-btn.active consolidated — see light-mode-overrides.css) */
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-rs-lobby-dark.css"
/*!**************************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-rs-lobby-dark.css ***!
  \**************************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ─────────────────────────────────────────────────────────────────────────────
 *  COLORWAY: RS Lobby — Dark
 *  Inspired by the RuneScape in-game lobby UI — warm parchment browns,
 *  gold accents, ridge-border aesthetic. A blend of OSRS + RS3 Modern.
 * ───────────────────────────────────────────────────────────────────────────── */

body[data-mode="dark"][data-colorway="rs-lobby"] {
  --bg-main: #1a140f;
  --bg-panel: #2a221b;
  --bg-elevated: #3e3529;
  --bg-hover: #4a3e30;
  --dropdown-bg: #3e3529;
  --dropdown-hover-bg: #4a3e30;
  --bg-input: #1a1510;
  --bg-muted: #2a221b;
  --bg-filter: #15100c;
  --bg-number-input: #1a1510;

  --text-main: #bdae95;
  --text-bright: #e0e0e0;
  --text-accent: #c8b07a;
  --text-heading: #eddca8;
  --text-price: #6bba48;
  --text-muted: #8a7a68;
  --text-soft: #a39682;
  --text-dimmed: #5a4e3d;

  --border-main: #4a3e30;
  --border-section: #3a3228;
  --border-card: #5a4e3d;
  --border-input: #5a4a38;
  --border-subtle: #3e3224;
  --border-hype: #806830;
  --border-hype-hover: #a08840;

  --accent-primary: #7a654c;
  --accent-primary-hover: #96805c;
  --accent-primary-active: #5a4830;
  --accent-focus: #c8b07a;
  --accent-blue-text: #7192bc;
  --accent-green: #539e30;
  --accent-green-bright: #6bba48;
  --accent-teal: #7192bc;
  --accent-gold: #c8b07a;
  --accent-gold-hype: #d98d26;
  --accent-red: #a32222;
  --accent-red-dark: #7a1818;
  --accent-red-bg: #2a1510;
  --accent-red-border: #8a3030;
  --accent-red-border-hover: #a84040;
  --accent-hype: #d98d26;

  /* Contrast base (referenced by contrast-modifiers) */
  --accent-teal-base: #7192bc;
  --accent-red-base: #a32222;
  --accent-blue-text-base: #7192bc;
  --accent-gold-base: #c8b07a;

  --chat-user-bg: #3a3020;
  --chat-error-bg: #2a1510;
  --badge-buy-bg: #2a2818;
  --badge-sell-bg: #1e3010;
  --badge-hype-bg: #3a3010;

  --modal-backdrop: rgba(0, 0, 0, 0.75);
  --modal-shadow: rgba(0, 0, 0, 0.9);
  --scrollbar-thumb: #5a4a38;
  --scrollbar-thumb-hover: #7a654c;
  --link-color: #c8b07a;
  --add-flip-bg: #2a3a1a;
  --limit-ready-bg: #1e2a14;

  /* Glass helpers */
  --glass-body-from: #100c08;
  --glass-body-via: #1a140f;
  --glass-body-to: #150f0a;
  --glass-panel: rgba(200, 176, 122, 0.06);
  --glass-elevated: rgba(200, 176, 122, 0.10);
  --glass-hover: rgba(200, 176, 122, 0.12);
  --glass-input: rgba(200, 176, 122, 0.08);
  --glass-muted: rgba(200, 176, 122, 0.05);
  --glass-border-card: rgba(200, 176, 122, 0.18);
  --glass-border-main: rgba(200, 176, 122, 0.10);
  --glass-border-section: rgba(200, 176, 122, 0.12);
  --glass-border-input: rgba(200, 176, 122, 0.20);
  --glass-scrollbar: rgba(200, 176, 122, 0.14);

  /* Neumorphism helpers */
  --neu-shadow-dark: #100c08;
  --neu-shadow-light: #4a3e30;
  --neu-accent-shadow: #5a4830;

  /* Skeuomorphism helpers */
  --skeu-body-from: #15100c;
  --skeu-body-to: #2a221b;
  --skeu-card-from: #4a3e30;
  --skeu-card-mid: #3e3529;
  --skeu-card-to: #2a221b;
  --skeu-card-highlight: #5a4e3d;
  --skeu-card-shadow-edge: #100c08;
  --skeu-header-from: #4a3e30;
  --skeu-header-to: #3a3228;
  --skeu-btn-from: #506270;
  --skeu-btn-to: #34414a;
  --skeu-btn-active-from: #c8b07a;
  --skeu-btn-active-to: #96805c;
}`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-rs-lobby-light.css"
/*!***************************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-rs-lobby-light.css ***!
  \***************************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ─────────────────────────────────────────────────────────────────────────────
 *  COLORWAY: RS Lobby — Light
 *  Light-mode counterpart: warm cream/parchment base with gold highlights.
 * ───────────────────────────────────────────────────────────────────────────── */

body[data-mode="light"][data-colorway="rs-lobby"] {
  --bg-main: #f2ece2;
  --bg-panel: #faf6ee;
  --bg-elevated: #f6f0e6;
  --bg-hover: #ece4d6;
  --dropdown-bg: #f6f0e6;
  --dropdown-hover-bg: #ece4d6;
  --bg-input: #eae2d4;
  --bg-muted: #e0d8c8;
  --bg-filter: #f0e8da;
  --bg-number-input: #eae2d4;

  --text-main: #3e3529;
  --text-bright: #1a140f;
  --text-accent: #8b6914;
  --text-heading: #6b5010;
  --text-price: #2a7a1a;
  --text-muted: #7a6d5a;
  --text-soft: #8a7e6c;
  --text-dimmed: #b0a490;

  --border-main: #d4c8b4;
  --border-section: #c8bca8;
  --border-card: #c0b49e;
  --border-input: #b8ac96;
  --border-subtle: #dcd0bc;
  --border-hype: #c09020;
  --border-hype-hover: #a07a10;

  --accent-primary: #8b6914;
  --accent-primary-hover: #a07a20;
  --accent-primary-active: #6b5010;
  --accent-focus: #8b6914;
  --accent-blue-text: #506070;
  --accent-green: #3a8a28;
  --accent-green-bright: #2a7a1a;
  --accent-teal: #4a7a6a;
  --accent-gold: #c09020;
  --accent-gold-hype: #a07a10;
  --accent-red: #a32222;
  --accent-red-dark: #7a1818;
  --accent-red-bg: #fff0ec;
  --accent-red-border: #d8a0a0;
  --accent-red-border-hover: #c88080;
  --accent-hype: #c88020;

  /* Contrast base (referenced by contrast-modifiers) */
  --accent-teal-base: #4a7a6a;
  --accent-red-base: #a32222;
  --accent-blue-text-base: #506070;
  --accent-gold-base: #c09020;

  --chat-user-bg: #f0e8d4;
  --chat-error-bg: #fff0ec;
  --badge-buy-bg: #e8e0ce;
  --badge-sell-bg: #dcf0dc;
  --badge-hype-bg: #f8f0d0;

  --modal-backdrop: rgba(0, 0, 0, 0.25);
  --modal-shadow: rgba(0, 0, 0, 0.15);
  --scrollbar-thumb: #c0b49e;
  --scrollbar-thumb-hover: #a09480;
  --link-color: #8b6914;
  --add-flip-bg: #d0e8c0;
  --limit-ready-bg: #daf0d0;

  /* Glass helpers */
  --glass-body-from: #e0d8c8;
  --glass-body-via: #ece4d6;
  --glass-body-to: #d8ceb8;
  --glass-panel: rgba(250, 244, 230, 0.55);
  --glass-elevated: rgba(250, 244, 230, 0.65);
  --glass-hover: rgba(250, 244, 230, 0.70);
  --glass-input: rgba(250, 244, 230, 0.50);
  --glass-muted: rgba(250, 244, 230, 0.40);
  --glass-border-card: rgba(139, 105, 20, 0.14);
  --glass-border-main: rgba(139, 105, 20, 0.08);
  --glass-border-section: rgba(139, 105, 20, 0.10);
  --glass-border-input: rgba(139, 105, 20, 0.16);
  --glass-scrollbar: rgba(139, 105, 20, 0.12);

  /* Neumorphism helpers */
  --neu-shadow-dark: #c8bca8;
  --neu-shadow-light: #ffffff;
  --neu-accent-shadow: #6b5010;

  /* Skeuomorphism helpers */
  --skeu-body-from: #e0d8c8;
  --skeu-body-to: #f2ece2;
  --skeu-card-from: #faf6ee;
  --skeu-card-mid: #f6f0e6;
  --skeu-card-to: #ece4d6;
  --skeu-card-highlight: #ffffff;
  --skeu-card-shadow-edge: #b8ac96;
  --skeu-header-from: #f6f0e6;
  --skeu-header-to: #ece4d6;
  --skeu-btn-from: #f2ece2;
  --skeu-btn-to: #e0d8c8;
  --skeu-btn-active-from: #8b6914;
  --skeu-btn-active-to: #6b5010;
}

/* (light-mode view-btn.active consolidated — see below contrast modifiers) */
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-rs3-modern-dark.css"
/*!****************************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-rs3-modern-dark.css ***!
  \****************************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ─────────────────────────────────────────────────────────────────────────────
 *  COLORWAY: RS3 Modern — Dark
 * ───────────────────────────────────────────────────────────────────────────── */

body[data-mode="dark"][data-colorway="rs3-modern"] {
  --bg-main: #0f1722;
  --bg-panel: #1c2836;
  --bg-elevated: #1e2d3e;
  --bg-hover: #243548;
  --dropdown-bg: #1e2d3e;
  --dropdown-hover-bg: #243548;
  --bg-input: #1a2a3a;
  --bg-muted: #1c2836;
  --bg-filter: #141f2d;
  --bg-number-input: #162030;

  --text-main: #e6f0fa;
  --text-bright: #ffffff;
  --text-accent: #7dd3fc;
  --text-heading: #38bdf8;
  --text-price: #4ade80;
  --text-muted: #7494b0;
  --text-soft: #90adc4;
  --text-dimmed: #4a6580;

  --border-main: #2a3f54;
  --border-section: #1e3450;
  --border-card: #3a5068;
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
  --accent-hype: #ffab40;

  /* Contrast base (referenced by contrast-modifiers) */
  --accent-teal-base: #2dd4bf;
  --accent-red-base: #f87171;
  --accent-blue-text-base: #7dd3fc;
  --accent-gold-base: #fbbf24;

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

  /* Glass helpers */
  --glass-body-from: #060e18;
  --glass-body-via: #0a1828;
  --glass-body-to: #0a1020;
  --glass-panel: rgba(120, 180, 255, 0.06);
  --glass-elevated: rgba(120, 180, 255, 0.10);
  --glass-hover: rgba(120, 180, 255, 0.12);
  --glass-input: rgba(120, 180, 255, 0.08);
  --glass-muted: rgba(120, 180, 255, 0.05);
  --glass-border-card: rgba(100, 180, 255, 0.20);
  --glass-border-main: rgba(100, 180, 255, 0.10);
  --glass-border-section: rgba(100, 180, 255, 0.12);
  --glass-border-input: rgba(100, 180, 255, 0.22);
  --glass-scrollbar: rgba(100, 180, 255, 0.15);

  /* Neumorphism helpers */
  --neu-shadow-dark: #080e18;
  --neu-shadow-light: #2a3a4e;
  --neu-accent-shadow: #0080cc;

  /* Skeuomorphism helpers */
  --skeu-body-from: #080e18;
  --skeu-body-to: #0f1722;
  --skeu-card-from: #243040;
  --skeu-card-mid: #1c2836;
  --skeu-card-to: #141e2c;
  --skeu-card-highlight: #3a5068;
  --skeu-card-shadow-edge: #080e18;
  --skeu-header-from: #243040;
  --skeu-header-to: #1c2836;
  --skeu-btn-from: #243548;
  --skeu-btn-to: #1a2a3a;
  --skeu-btn-active-from: #00a8ff;
  --skeu-btn-active-to: #0080cc;
}`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-rs3-modern-light.css"
/*!*****************************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-rs3-modern-light.css ***!
  \*****************************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ─────────────────────────────────────────────────────────────────────────────
 *  COLORWAY: RS3 Modern — Light
 * ───────────────────────────────────────────────────────────────────────────── */

body[data-mode="light"][data-colorway="rs3-modern"] {
  --bg-main: #eef4fa;
  --bg-panel: #f8fbff;
  --bg-elevated: #f4f8fd;
  --bg-hover: #e6eef6;
  --dropdown-bg: #f4f8fd;
  --dropdown-hover-bg: #e6eef6;
  --bg-input: #e8f0f8;
  --bg-muted: #dce8f2;
  --bg-filter: #eaf2fa;
  --bg-number-input: #e8f0f8;

  --text-main: #1a2a3a;
  --text-bright: #0a1420;
  --text-accent: #0078d4;
  --text-heading: #0060b0;
  --text-price: #1a8a2a;
  --text-muted: #5a7a94;
  --text-soft: #7a94aa;
  --text-dimmed: #a0b4c4;

  --border-main: #d0dce8;
  --border-section: #c8d8e8;
  --border-card: #c0d0e0;
  --border-input: #b8cad8;
  --border-subtle: #dce8f2;
  --border-hype: #d4a520;
  --border-hype-hover: #b8920a;

  --accent-primary: #0078d4;
  --accent-primary-hover: #1888e0;
  --accent-primary-active: #0060b0;
  --accent-focus: #0078d4;
  --accent-blue-text: #0078d4;
  --accent-green: #248a3d;
  --accent-green-bright: #1a7a2e;
  --accent-teal: #1a8a7a;
  --accent-gold: #d4a520;
  --accent-gold-hype: #c09010;
  --accent-red: #d13438;
  --accent-red-dark: #a4262c;
  --accent-red-bg: #fff0f0;
  --accent-red-border: #e0a0a0;
  --accent-red-border-hover: #d08080;
  --accent-hype: #e08a00;

  /* Contrast base (referenced by contrast-modifiers) */
  --accent-teal-base: #1a8a7a;
  --accent-red-base: #d13438;
  --accent-blue-text-base: #0078d4;
  --accent-gold-base: #d4a520;

  --chat-user-bg: #dcecff;
  --chat-error-bg: #fff0f0;
  --badge-buy-bg: #dceaff;
  --badge-sell-bg: #dcf4dc;
  --badge-hype-bg: #fff8e0;

  --modal-backdrop: rgba(0, 0, 0, 0.25);
  --modal-shadow: rgba(0, 0, 0, 0.15);
  --scrollbar-thumb: #b8cad8;
  --scrollbar-thumb-hover: #98aec0;
  --link-color: #0078d4;
  --add-flip-bg: #d0f0d0;
  --limit-ready-bg: #daf4da;

  /* Glass helpers */
  --glass-body-from: #d8e4f0;
  --glass-body-via: #e4eef6;
  --glass-body-to: #d0dce8;
  --glass-panel: rgba(240, 248, 255, 0.55);
  --glass-elevated: rgba(240, 248, 255, 0.65);
  --glass-hover: rgba(240, 248, 255, 0.70);
  --glass-input: rgba(240, 248, 255, 0.50);
  --glass-muted: rgba(240, 248, 255, 0.40);
  --glass-border-card: rgba(0, 120, 212, 0.12);
  --glass-border-main: rgba(0, 120, 212, 0.08);
  --glass-border-section: rgba(0, 120, 212, 0.10);
  --glass-border-input: rgba(0, 120, 212, 0.15);
  --glass-scrollbar: rgba(0, 120, 212, 0.10);

  /* Neumorphism helpers */
  --neu-shadow-dark: #c0d0e0;
  --neu-shadow-light: #ffffff;
  --neu-accent-shadow: #0060b0;

  /* Skeuomorphism helpers */
  --skeu-body-from: #dce8f2;
  --skeu-body-to: #eef4fa;
  --skeu-card-from: #f8fbff;
  --skeu-card-mid: #f4f8fd;
  --skeu-card-to: #eaf2fa;
  --skeu-card-highlight: #ffffff;
  --skeu-card-shadow-edge: #b8cad8;
  --skeu-header-from: #f4f8fd;
  --skeu-header-to: #eaf2fa;
  --skeu-btn-from: #eef4fa;
  --skeu-btn-to: #dce8f2;
  --skeu-btn-active-from: #0078d4;
  --skeu-btn-active-to: #0060b0;
}

/* (light-mode view-btn.active consolidated — see below contrast modifiers) */
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-solarized-dark.css"
/*!***************************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-solarized-dark.css ***!
  \***************************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ─────────────────────────────────────────────────────────────────────────────
 *  COLORWAY: Solarized — Dark
 * ───────────────────────────────────────────────────────────────────────────── */

body[data-mode="dark"][data-colorway="solarized"] {
  --bg-main: #002b36;
  --bg-panel: #073642;
  --bg-elevated: #0a3f4c;
  --bg-hover: #0e4756;
  --dropdown-bg: #0a3f4c;
  --dropdown-hover-bg: #0e4756;
  --bg-input: #0a3f4c;
  --bg-muted: #06313b;
  --bg-filter: #002830;
  --bg-number-input: #0a3a48;

  --text-main: #93a1a1;
  --text-bright: #fdf6e3;
  --text-accent: #268bd2;
  --text-heading: #b58900;
  --text-price: #a0b800;
  --text-muted: #839496;
  --text-soft: #78909a;
  --text-dimmed: #586e75;

  --border-main: #0a4050;
  --border-section: #0d4a58;
  --border-card: #11546a;
  --border-input: #175468;
  --border-subtle: #0a4050;
  --border-hype: #6b5a1e;
  --border-hype-hover: #a08830;

  --accent-primary: #268bd2;
  --accent-primary-hover: #2e9ce6;
  --accent-primary-active: #1a6daa;
  --accent-focus: #268bd2;
  --accent-blue-text: #268bd2;
  --accent-green: #859900;
  --accent-green-bright: #a0b800;
  --accent-teal: #2aa198;
  --accent-gold: #b58900;
  --accent-gold-hype: #cb9a00;
  --accent-red: #dc322f;
  --accent-red-dark: #b02828;
  --accent-red-bg: #2a1516;
  --accent-red-border: #5a2020;
  --accent-red-border-hover: #8a3030;
  --accent-hype: #cb8b16;

  /* Contrast base (referenced by contrast-modifiers) */
  --accent-teal-base: #2aa198;
  --accent-red-base: #dc322f;
  --accent-blue-text-base: #268bd2;
  --accent-gold-base: #b58900;

  --chat-user-bg: #0a3a50;
  --chat-error-bg: #2a1012;
  --badge-buy-bg: #073a42;
  --badge-sell-bg: #0a3a18;
  --badge-hype-bg: #3a3010;

  --modal-backdrop: rgba(0, 0, 0, 0.6);
  --modal-shadow: rgba(0, 0, 0, 0.8);
  --scrollbar-thumb: #1a5868;
  --scrollbar-thumb-hover: #268090;
  --link-color: #268bd2;
  --add-flip-bg: #1a4a10;
  --limit-ready-bg: #0a2a10;

  /* Glass helpers */
  --glass-body-from: #001820;
  --glass-body-via: #002030;
  --glass-body-to: #00182a;
  --glass-panel: rgba(7, 54, 66, 0.60);
  --glass-elevated: rgba(7, 54, 66, 0.70);
  --glass-hover: rgba(14, 71, 86, 0.70);
  --glass-input: rgba(7, 54, 66, 0.50);
  --glass-muted: rgba(7, 54, 66, 0.40);
  --glass-border-card: rgba(38, 139, 210, 0.20);
  --glass-border-main: rgba(38, 139, 210, 0.10);
  --glass-border-section: rgba(38, 139, 210, 0.14);
  --glass-border-input: rgba(38, 139, 210, 0.22);
  --glass-scrollbar: rgba(38, 139, 210, 0.18);

  /* Neumorphism helpers */
  --neu-shadow-dark: #001a22;
  --neu-shadow-light: #0d4a58;
  --neu-accent-shadow: #1a6daa;

  /* Skeuomorphism helpers */
  --skeu-body-from: #001a22;
  --skeu-body-to: #002b36;
  --skeu-card-from: #0a4050;
  --skeu-card-mid: #073642;
  --skeu-card-to: #053038;
  --skeu-card-highlight: #0e4756;
  --skeu-card-shadow-edge: #001a22;
  --skeu-header-from: #0a4050;
  --skeu-header-to: #073642;
  --skeu-btn-from: #0d4a58;
  --skeu-btn-to: #073642;
  --skeu-btn-active-from: #268bd2;
  --skeu-btn-active-to: #1a6daa;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-solarized-light.css"
/*!****************************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-solarized-light.css ***!
  \****************************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ─────────────────────────────────────────────────────────────────────────────
 *  COLORWAY: Solarized — Light
 * ───────────────────────────────────────────────────────────────────────────── */

body[data-mode="light"][data-colorway="solarized"] {
  --bg-main: #e6dec8;
  --bg-panel: #f0e9d6;
  --bg-elevated: #f5efdc;
  --bg-hover: #e4dbc4;
  --dropdown-bg: #f5efdc;
  --dropdown-hover-bg: #e4dbc4;
  --bg-input: #e8e0cc;
  --bg-muted: #ddd4b8;
  --bg-filter: #e4dcc8;
  --bg-number-input: #e8e0cc;

  --text-main: #586e75;
  --text-bright: #073642;
  --text-accent: #268bd2;
  --text-heading: #946e00;
  --text-price: #4a7a0a;
  --text-muted: #6e8088;
  --text-soft: #78888c;
  --text-dimmed: #93a1a1;

  --border-main: #d6ccb0;
  --border-section: #cfc4a8;
  --border-card: #c8bc9e;
  --border-input: #c0b498;
  --border-subtle: #ddd4ba;
  --border-hype: #d4a520;
  --border-hype-hover: #b8920a;

  --accent-primary: #268bd2;
  --accent-primary-hover: #2e9ce6;
  --accent-primary-active: #1a6daa;
  --accent-focus: #268bd2;
  --accent-blue-text: #268bd2;
  --accent-green: #859900;
  --accent-green-bright: #6c8000;
  --accent-teal: #2aa198;
  --accent-gold: #b58900;
  --accent-gold-hype: #9a7400;
  --accent-red: #dc322f;
  --accent-red-dark: #b02828;
  --accent-red-bg: #fdf0ef;
  --accent-red-border: #e0a0a0;
  --accent-red-border-hover: #d08080;
  --accent-hype: #b58900;

  /* Contrast base (referenced by contrast-modifiers) */
  --accent-teal-base: #2aa198;
  --accent-red-base: #dc322f;
  --accent-blue-text-base: #268bd2;
  --accent-gold-base: #b58900;

  --chat-user-bg: #ddeef8;
  --chat-error-bg: #fdf0ef;
  --badge-buy-bg: #dde8f0;
  --badge-sell-bg: #e0f0d0;
  --badge-hype-bg: #f5ecc8;

  --modal-backdrop: rgba(0, 0, 0, 0.25);
  --modal-shadow: rgba(0, 0, 0, 0.15);
  --scrollbar-thumb: #c0b498;
  --scrollbar-thumb-hover: #a89a80;
  --link-color: #268bd2;
  --add-flip-bg: #d0e8c0;
  --limit-ready-bg: #daf0d0;

  /* Glass helpers */
  --glass-body-from: #e0d8c0;
  --glass-body-via: #eee4cc;
  --glass-body-to: #ddd4b8;
  --glass-panel: rgba(238, 232, 213, 0.55);
  --glass-elevated: rgba(238, 232, 213, 0.65);
  --glass-hover: rgba(238, 232, 213, 0.70);
  --glass-input: rgba(238, 232, 213, 0.50);
  --glass-muted: rgba(238, 232, 213, 0.40);
  --glass-border-card: rgba(0, 0, 0, 0.12);
  --glass-border-main: rgba(0, 0, 0, 0.08);
  --glass-border-section: rgba(0, 0, 0, 0.10);
  --glass-border-input: rgba(0, 0, 0, 0.15);
  --glass-scrollbar: rgba(0, 0, 0, 0.10);

  /* Neumorphism helpers */
  --neu-shadow-dark: #c8bc9e;
  --neu-shadow-light: #fdf6e3;
  --neu-accent-shadow: #1a6daa;

  /* Skeuomorphism helpers */
  --skeu-body-from: #c8bc9e;
  --skeu-body-to: #ddd4b8;
  --skeu-card-from: #f5efdc;
  --skeu-card-mid: #eee8d5;
  --skeu-card-to: #e6dfc8;
  --skeu-card-highlight: #fdf6e3;
  --skeu-card-shadow-edge: #b0a488;
  --skeu-header-from: #ede6d0;
  --skeu-header-to: #e4dcc6;
  --skeu-btn-from: #eee8d5;
  --skeu-btn-to: #ddd4b8;
  --skeu-btn-active-from: #268bd2;
  --skeu-btn-active-to: #1a6daa;
}

/* (light-mode view-btn.active consolidated — see below contrast modifiers) */
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-twilight-amethyst-dark.css"
/*!***********************************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-twilight-amethyst-dark.css ***!
  \***********************************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ─────────────────────────────────────────────────────────────────────────────
 *  COLORWAY: Twilight Amethyst — Dark
 *  Deep indigo-violet palette inspired by the Classic Glass aesthetic.
 *  Rich purple backgrounds, lavender text accents, amethyst highlights.
 * ───────────────────────────────────────────────────────────────────────────── */

body[data-mode="dark"][data-colorway="twilight-amethyst"] {
  /* ── Backgrounds ─────────────────────── */
  --bg-main: #12101e;
  --bg-panel: #1a1530;
  --bg-elevated: #221c3a;
  --bg-hover: #2a2244;
  --dropdown-bg: #221c3a;
  --dropdown-hover-bg: #2a2244;
  --bg-input: #2e264a;
  --bg-muted: #1e1832;
  --bg-filter: #0e0c18;
  --bg-number-input: #241e3e;

  /* ── Text ────────────────────────────── */
  --text-main: #cdc5e0;
  --text-bright: #f0ecff;
  --text-accent: #b8a4e8;
  --text-heading: #d4b8ff;
  --text-price: #4ade80;
  --text-muted: #9088aa;
  --text-soft: #a89cc4;
  --text-dimmed: #5e5478;

  /* ── Borders ─────────────────────────── */
  --border-main: #2e2648;
  --border-section: #38305a;
  --border-card: #443a68;
  --border-input: #504674;
  --border-subtle: #382e56;
  --border-hype: #7a5a2e;
  --border-hype-hover: #a08030;

  /* ── Primary action ──────────────────── */
  --accent-primary: #7c4dff;
  --accent-primary-hover: #9060ff;
  --accent-primary-active: #5c30cc;
  --accent-focus: #9070ff;

  /* ── Semantic accents ────────────────── */
  --accent-blue-text: #a088d8;
  --accent-green: #5ece6b;
  --accent-green-bright: #27ae60;
  --accent-teal: #4ec9b0;
  --accent-gold: #f0c040;
  --accent-gold-hype: #f5c542;
  --accent-hype: #ffab40;
  --accent-red: #ff6b6b;
  --accent-red-dark: #c0392b;
  --accent-red-bg: #2e1428;
  --accent-red-border: #6b3050;
  --accent-red-border-hover: #a04070;

  /* ── Contrast base (referenced by contrast-modifiers — never self-referencing) */
  --accent-teal-base: #4ec9b0;
  --accent-red-base: #ff6b6b;
  --accent-blue-text-base: #a088d8;
  --accent-gold-base: #f0c040;

  /* ── Chat ─────────────────────────────── */
  --chat-user-bg: #2e2258;
  --chat-error-bg: #2e1428;

  /* ── Badges ──────────────────────────── */
  --badge-buy-bg: #1e1838;
  --badge-sell-bg: #1e3a1e;
  --badge-hype-bg: #3a2e10;

  /* ── Modal ───────────────────────────── */
  --modal-backdrop: rgba(8, 6, 20, 0.75);
  --modal-shadow: rgba(0, 0, 0, 0.85);

  /* ── Scrollbar ───────────────────────── */
  --scrollbar-thumb: #443a68;
  --scrollbar-thumb-hover: #5e5288;

  /* ── Misc ─────────────────────────────── */
  --link-color: #b8a4e8;
  --add-flip-bg: #1b6b2a;
  --limit-ready-bg: #1a2e1a;

  /* ── Style helper vars (Glass) ───────── */
  --glass-body-from: #0a0a1e;
  --glass-body-via: #1a1040;
  --glass-body-to: #0a2040;
  --glass-panel: rgba(180, 160, 255, 0.06);
  --glass-elevated: rgba(180, 160, 255, 0.10);
  --glass-hover: rgba(180, 160, 255, 0.13);
  --glass-input: rgba(180, 160, 255, 0.08);
  --glass-muted: rgba(180, 160, 255, 0.05);
  --glass-border-card: rgba(180, 160, 255, 0.20);
  --glass-border-main: rgba(180, 160, 255, 0.10);
  --glass-border-section: rgba(180, 160, 255, 0.13);
  --glass-border-input: rgba(180, 160, 255, 0.22);
  --glass-scrollbar: rgba(180, 160, 255, 0.15);

  /* ── Style helper vars (Neumorphism) ─── */
  --neu-shadow-dark: #0a0818;
  --neu-shadow-light: #2e2648;
  --neu-accent-shadow: #5c30cc;

  /* ── Style helper vars (Skeuomorphism) ── */
  --skeu-body-from: #0e0c18;
  --skeu-body-to: #12101e;
  --skeu-card-from: #2e2648;
  --skeu-card-mid: #1a1530;
  --skeu-card-to: #141020;
  --skeu-card-highlight: #443a68;
  --skeu-card-shadow-edge: #0a0818;
  --skeu-header-from: #2e2648;
  --skeu-header-to: #1e1832;
  --skeu-btn-from: #38305a;
  --skeu-btn-to: #28204a;
  --skeu-btn-active-from: #7c4dff;
  --skeu-btn-active-to: #5c30cc;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-twilight-amethyst-light.css"
/*!************************************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/themes/colorway-twilight-amethyst-light.css ***!
  \************************************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ─────────────────────────────────────────────────────────────────────────────
 *  COLORWAY: Twilight Amethyst — Light
 *  Soft lavender-lilac palette — light counterpart to the dark indigo-violet.
 *  Pale purple backgrounds, deep violet text, amethyst accents.
 * ───────────────────────────────────────────────────────────────────────────── */

body[data-mode="light"][data-colorway="twilight-amethyst"] {
  /* ── Backgrounds ─────────────────────── */
  --bg-main: #f0ecfa;
  --bg-panel: #f8f5ff;
  --bg-elevated: #f4f0fc;
  --bg-hover: #eae4f6;
  --dropdown-bg: #f4f0fc;
  --dropdown-hover-bg: #eae4f6;
  --bg-input: #ebe4f8;
  --bg-muted: #e2daf2;
  --bg-filter: #f0eafa;
  --bg-number-input: #ebe4f8;

  /* ── Text ────────────────────────────── */
  --text-main: #3a2e5a;
  --text-bright: #1a1030;
  --text-accent: #6c4daa;
  --text-heading: #4a2e80;
  --text-price: #1a8a2a;
  --text-muted: #7a6e98;
  --text-soft: #9688b4;
  --text-dimmed: #b8aed0;

  /* ── Borders ─────────────────────────── */
  --border-main: #d8d0ea;
  --border-section: #cec4e2;
  --border-card: #c4b8da;
  --border-input: #b8aace;
  --border-subtle: #e0d8ef;
  --border-hype: #d4a520;
  --border-hype-hover: #b8920a;

  /* ── Primary action ──────────────────── */
  --accent-primary: #6c4daa;
  --accent-primary-hover: #7e5cc0;
  --accent-primary-active: #5a3d90;
  --accent-focus: #7c5cb8;

  /* ── Semantic accents ────────────────── */
  --accent-blue-text: #6c4daa;
  --accent-green: #2a8a2a;
  --accent-green-bright: #22aa22;
  --accent-teal: #1a9a8a;
  --accent-gold: #d4a520;
  --accent-gold-hype: #c09010;
  --accent-red: #cc3333;
  --accent-red-dark: #aa2222;
  --accent-red-bg: #faf0f4;
  --accent-red-border: #dca0b0;
  --accent-red-border-hover: #cc8898;
  --accent-hype: #e68a00;

  /* Contrast base (referenced by contrast-modifiers) */
  --accent-teal-base: #1a9a8a;
  --accent-red-base: #cc3333;
  --accent-blue-text-base: #6c4daa;
  --accent-gold-base: #d4a520;

  /* ── Chat ─────────────────────────────── */
  --chat-user-bg: #ece4ff;
  --chat-error-bg: #faf0f4;

  /* ── Badges ──────────────────────────── */
  --badge-buy-bg: #e4deff;
  --badge-sell-bg: #e0ffe0;
  --badge-hype-bg: #fff8e0;

  /* ── Modal ───────────────────────────── */
  --modal-backdrop: rgba(20, 14, 40, 0.25);
  --modal-shadow: rgba(20, 14, 40, 0.15);

  /* ── Scrollbar ───────────────────────── */
  --scrollbar-thumb: #c4b8da;
  --scrollbar-thumb-hover: #a89cc0;

  /* ── Misc ─────────────────────────────── */
  --link-color: #6c4daa;
  --add-flip-bg: #d0f0d0;
  --limit-ready-bg: #e0f8e0;

  /* ── Style helper vars (Glass) ───────── */
  --glass-body-from: #d8d0ea;
  --glass-body-via: #e4ddf2;
  --glass-body-to: #d0c8e4;
  --glass-panel: rgba(255, 255, 255, 0.50);
  --glass-elevated: rgba(255, 255, 255, 0.60);
  --glass-hover: rgba(255, 255, 255, 0.65);
  --glass-input: rgba(255, 255, 255, 0.45);
  --glass-muted: rgba(255, 255, 255, 0.35);
  --glass-border-card: rgba(80, 50, 140, 0.14);
  --glass-border-main: rgba(80, 50, 140, 0.08);
  --glass-border-section: rgba(80, 50, 140, 0.10);
  --glass-border-input: rgba(80, 50, 140, 0.18);
  --glass-scrollbar: rgba(80, 50, 140, 0.12);

  /* ── Style helper vars (Neumorphism) ─── */
  --neu-shadow-dark: #c8c0da;
  --neu-shadow-light: #ffffff;
  --neu-accent-shadow: #5a3d90;

  /* ── Style helper vars (Skeuomorphism) ── */
  --skeu-body-from: #e2daf2;
  --skeu-body-to: #f0ecfa;
  --skeu-card-from: #ffffff;
  --skeu-card-mid: #f8f5ff;
  --skeu-card-to: #f0ecfa;
  --skeu-card-highlight: #ffffff;
  --skeu-card-shadow-edge: #c4b8da;
  --skeu-header-from: #f4f0fc;
  --skeu-header-to: #ebe4f8;
  --skeu-btn-from: #f0ecfa;
  --skeu-btn-to: #e2daf2;
  --skeu-btn-active-from: #6c4daa;
  --skeu-btn-active-to: #5a3d90;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/themes/contrast-modifiers.css"
/*!**********************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/themes/contrast-modifiers.css ***!
  \**********************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ─────────────────────────────────────────────────────────────────────────────
 *  CONTRAST MODIFIERS (body[data-contrast])
 *
 *  Layered on top of any Mode × Colorway combination.
 *  "soft"  — reduced contrast (lighter darks, softer lights)
 *  "hard"  — maximum contrast (deeper darks, brighter lights)
 *
 *  IMPORTANT: Each override references ONLY sibling properties (never the
 *  property being set) to avoid CSS custom-property dependency cycles.
 *  The dependency graph is a strict DAG — no circular references.
 *
 *  Specificity is intentionally 0,3,1 (\`body[mode][contrast][colorway]\`)
 *  so contrast modifiers always beat colorway selectors (0,2,1),
 *  regardless of source order. [data-colorway] is always present on body.
 *
 *  Financial accent colours (--accent-green, --accent-teal, --accent-red,
 *  --accent-blue-text, --accent-gold) are adjusted in hard contrast to
 *  maintain WCAG AA ≥ 4.5:1 against shifted backgrounds.
 * ───────────────────────────────────────────────────────────────────────────── */

/* ── Soft contrast — dark modes ──────────────────────────────────────────── */
body[data-mode="dark"][data-contrast="soft"][data-colorway] {
  /* Lift base bg toward panel/elevated — compresses the dark range */
  --bg-main:      color-mix(in srgb, var(--bg-panel) 65%, var(--bg-elevated));
  --bg-filter:    var(--bg-muted);
  /* Soften borders — blend section border toward elevated bg */
  --border-main:  color-mix(in srgb, var(--border-section) 55%, var(--bg-elevated));
  /* Pull text extremes inward — narrower brightness span */
  --text-bright:  color-mix(in srgb, var(--text-main), white 15%);
  --text-dimmed:  var(--text-muted);
  /* Lighter modal scrim */
  --modal-backdrop: rgba(0, 0, 0, 0.35);
}

/* ── Hard contrast — dark modes ──────────────────────────────────────────── */
body[data-mode="dark"][data-contrast="hard"][data-colorway] {
  /* Push backgrounds toward black — deepest blacks, vivid separation */
  --bg-filter:   color-mix(in srgb, var(--bg-elevated) 55%, black);
  --bg-main:     color-mix(in srgb, var(--bg-filter) 70%, black);
  --bg-muted:    color-mix(in srgb, var(--bg-filter) 65%, black);
  --bg-panel:    color-mix(in srgb, var(--bg-muted) 72%, black);
  /* Full-white text ceiling */
  --text-bright: #ffffff;
  /* Harden borders */
  --border-main: color-mix(in srgb, var(--border-section) 60%, black);
  /* Stronger modal scrim */
  --modal-backdrop: rgba(0, 0, 0, 0.75);
  /* WCAG: vivify financial accent colours against deeper backgrounds.
     References *-base vars (set by each colorway) to avoid circular deps. */
  --accent-green:       color-mix(in srgb, var(--accent-green-bright), white 12%);
  --accent-teal:        color-mix(in srgb, var(--accent-teal-base), white 10%);
  --accent-red:         color-mix(in srgb, var(--accent-red-base), white 8%);
  --accent-blue-text:   color-mix(in srgb, var(--accent-blue-text-base), white 10%);
  --accent-gold:        color-mix(in srgb, var(--accent-gold-base), white 8%);
}

/* ── Soft contrast — light modes ─────────────────────────────────────────── */
body[data-mode="light"][data-contrast="soft"][data-colorway] {
  /* Push backgrounds toward white — flatter, airier feel */
  --bg-main:     color-mix(in srgb, var(--bg-panel) 55%, white);
  --bg-panel:    color-mix(in srgb, var(--bg-elevated) 60%, white);
  /* Lighten borders */
  --border-main: color-mix(in srgb, var(--border-section) 50%, white);
  /* Reduce text intensity — but keep --text-bright readable (WCAG AA ≥ 4.5:1) */
  --text-main:   color-mix(in srgb, var(--text-muted), black 15%);
  --text-bright: color-mix(in srgb, var(--text-muted), black 40%);
  /* Softer modal scrim */
  --modal-backdrop: rgba(0, 0, 0, 0.15);
}

/* ── Hard contrast — light modes ─────────────────────────────────────────── */
body[data-mode="light"][data-contrast="hard"][data-colorway] {
  /* Push backgrounds brighter — near-white panels */
  --bg-main:     color-mix(in srgb, var(--bg-panel) 50%, white);
  --bg-panel:    #ffffff;
  --bg-muted:    color-mix(in srgb, var(--bg-elevated) 60%, white);
  /* Maximum text darkness */
  --text-bright: #000000;
  /* Harden borders */
  --border-main: color-mix(in srgb, var(--border-section) 70%, var(--text-dimmed));
  /* Stronger modal scrim */
  --modal-backdrop: rgba(0, 0, 0, 0.40);
  /* WCAG: darken financial accent colours against bright bg (≥ 4.5:1).
     References *-base vars (set by each colorway) to avoid circular deps. */
  --accent-green:       color-mix(in srgb, var(--accent-green-bright), black 18%);
  --accent-teal:        color-mix(in srgb, var(--accent-teal-base), black 15%);
  --accent-blue-text:   color-mix(in srgb, var(--accent-blue-text-base), black 12%);
  --accent-gold:        color-mix(in srgb, var(--accent-gold-base), black 15%);
}`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "../node_modules/css-loader/dist/cjs.js!./css/themes/light-mode-overrides.css"
/*!************************************************************************************!*\
  !*** ../node_modules/css-loader/dist/cjs.js!./css/themes/light-mode-overrides.css ***!
  \************************************************************************************/
(module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "../node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* ─────────────────────────────────────────────────────────────────────────────
 *  LIGHT-MODE: consolidated overrides
 *  - .view-btn.active text forced white for all light colourways
 *  - Badge/table tokens adjusted for light backgrounds
 * ───────────────────────────────────────────────────────────────────────────── */

body[data-mode="light"] .view-btn.active {
  color: #ffffff;
}

body[data-mode="light"] {
  --badge-velocity-insta-bg: rgba(22, 163, 74, 0.22);
  --badge-velocity-active-bg: rgba(0, 80, 180, 0.18);
  --badge-velocity-slow-bg: rgba(200, 150, 0, 0.20);
  --badge-velocity-muted-bg: rgba(100, 100, 100, 0.16);
  --badge-trend-up-bg: rgba(22, 163, 74, 0.22);
  --badge-trend-down-bg: rgba(220, 38, 38, 0.20);
  --badge-neutral-bg: rgba(100, 100, 100, 0.14);
  --badge-hype-vol-bg: rgba(217, 119, 6, 0.18);
  --badge-tier-free-bg: rgba(22, 163, 74, 0.14);
  --badge-tier-free-border: rgba(22, 163, 74, 0.35);
  --badge-tier-freetier-bg: rgba(13, 148, 136, 0.14);
  --badge-tier-freetier-border: rgba(13, 148, 136, 0.35);
  --badge-tier-lowcost-bg: rgba(0, 80, 180, 0.14);
  --badge-tier-lowcost-border: rgba(0, 80, 180, 0.35);
  --badge-tier-neutral-bg: rgba(100, 100, 100, 0.10);
  --badge-tier-neutral-border: rgba(100, 100, 100, 0.22);
  --table-active-row-bg: rgba(0, 80, 180, 0.08);
  --table-hover-row-bg: rgba(0, 0, 0, 0.03);
  --setup-note-bg: rgba(180, 140, 0, 0.10);
  --setup-note-border: rgba(180, 140, 0, 0.25);
  --detail-expanded-bg: rgba(0, 0, 0, 0.05);
  --close-hover-bg: rgba(220, 38, 38, 0.10);
  --win-glow: color-mix(in srgb, var(--accent-green-bright) 10%, transparent);
  --loss-glow: color-mix(in srgb, var(--accent-red-dark) 10%, transparent);
}`, ""]);
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

/***/ "./css/main.css"
/*!**********************!*\
  !*** ./css/main.css ***!
  \**********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "../node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "../node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "../node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "../node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./main.css */ "../node_modules/css-loader/dist/cjs.js!./css/main.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());
options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_main_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


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
    async bulkInsertHistory(historyMap) {
        const db = this.ensureOpen();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(HISTORY_STORE, "readwrite");
            const store = tx.objectStore(HISTORY_STORE);
            let count = 0;
            for (const [name, entries] of historyMap) {
                for (const entry of entries) {
                    const day = new Date(entry.timestamp).toISOString().slice(0, 10);
                    const record = {
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
/* harmony export */   DATA_FIELD_LEGEND: () => (/* binding */ DATA_FIELD_LEGEND),
/* harmony export */   RS3_ECONOMIC_RULES: () => (/* binding */ RS3_ECONOMIC_RULES)
/* harmony export */ });
/**
 * @module coreKnowledge
 * Static knowledge base of RS3 economic mechanics injected into every LLM
 * system prompt. These rules are non-negotiable and supersede any outside
 * knowledge the model may have been trained on.
 */
/** Foundational RS3 economic rules the LLM must internalise before answering. */
const RS3_ECONOMIC_RULES = `\
=== RS3 ECONOMIC LAWS (STRICT ADHERENCE REQUIRED) ===

1. GE TAX: All items sold on the Grand Exchange (except items ≤50 gp each and bonds) are subject to a 2% tax (floor(sell price × 0.02)) subtracted from the seller's proceeds. The buyer always pays the full listed price. Tax is applied per item. You MUST deduct this 2% from gross revenue before calculating net profit, ROI, or margins. In the selling interface, the upper value is pre-tax and the lower value is after-tax proceeds.

2. BUY LIMITS: Every item has a 4-hour buy limit — a hard cap on how many a player can purchase via the GE per 4-hour window. The limit resets exactly 4 hours after the first purchase of that window. A player has 6 buy-limit windows per 24 hours. Buy limits are account-wide. A few items have connected limits (buying one reduces the limit for related items). Never recommend quantities exceeding an item's buy limit per window.

3. MARGIN CHECKING: To find the current real spread:
   a. Place an "insta-buy" offer at ~+5% (or +10-20% for low-volume items) above mid-price → this fills against the lowest active sell offer (your instant-sell price / highest sellable price).
   b. Place an "insta-sell" offer at ~-5% (or more) below mid-price → this fills against the highest active buy offer (your instant-buy price / lowest buyable price).
   Margin = insta-buy price − insta-sell price − floor(insta-buy price × 0.02).
   This is the true per-item net profit after tax if you buy at insta-sell price and sell at insta-buy price.

4. HIGH ALCHEMY & OTHER PRICE FLOORS: 
   - High Level Alchemy converts an item to coins at floor(item High Alch value × 0.6). This alch value serves as a strong price floor — if GE price drops significantly below alch value, players buy and alch for near-guaranteed profit (minus rune costs), usually pushing price back toward/above alch value.
   - Invention Disassembly Sink: Many low- or mid-tier items (weapons, armour, jewellery, pouches, etc.) act as bulk sources for Invention components. Demand for specific materials creates a secondary price floor — prices rarely stay far below profitable disassembly value for long, as players buy to disassemble. Always consider disassembly component value when GE price is low on such items.

5. ITEM CATEGORIES & TYPICAL BEHAVIOUR:
   - **Consumables** (food, potions, runes, divine charges): High volume, tight margins (1-5%), very fast trades. Best for high-capital, low-effort flipping.
   - **Skilling supplies** (logs, ores, herbs, hides): Moderate volume, moderate margins. Prices correlate with DXP (Double XP) events and new content.
   - **Equipment** (weapons, armour, components): Low volume, wide margins (5-20%+). Slower to trade but much higher per-item profit.
   - **Rare/discontinued items** (partyhats, dyes, etc.): Very low volume, massive margins, but extremely slow and can take hours or days to flip. High risk due to price manipulation.
   - **Salvage/alchables**: Prices tightly anchored to High Alchemy value. Very stable but nearly no margin.

6. WHAT MAKES A GOOD FLIP:
   - Profit per item × buy limit per 4 hours = maximum 4-hour profit potential.
   - Fast trade velocity means offers fill quickly — less capital tied up waiting.
   - A healthy margin must exceed the 2% tax gap comfortably (at least 2-3× the tax cost).
   - Stable/slight uptrend items are safer; high volatility means the margin can vanish while you wait.
   - Volume spike (>1.5× 7-day average) may indicate a temporary surge — good for quick flips but risky to hold.

7. GP/HR CALCULATION: When recommending items, estimate profit per hour:
   gp/hr = (profit per item after tax) × (buy limit ÷ estimated fill time in hours)
   Where fill time depends on trade velocity:
   - "Insta-Flip" = fills in minutes → assume 0.25 hours per cycle
   - "Active" = fills in 30-60 min → assume 1 hour per cycle
   - "Slow" = fills in 1-4 hours → assume 2-4 hours per cycle
   - "Very Slow" = may take a full 4-hour window or longer
   Trade velocity is highest during peak player hours (European/US evenings, roughly 16:00–00:00 UTC) and around daily game reset (00:00 game time). Adjust fill time estimates upward (slower) during off-peak if item volume is low.

8. OFFER PRIORITY: When multiple offers exist at the same price, the oldest offer fills first (time priority). Editing or aborting an offer resets its position to newest. This means newly placed offers may wait behind existing ones at the same price.

9. SAFE MARGIN GUIDELINES:
   - High-volume/insta-flips: Aim for ≥ 3-5% gross margin (covers tax + minor risk).
   - Mid-volume/active: ≥ 6-10% gross.
   - Low-volume/slow: ≥ 12-20%+ gross to justify wait time and risk.
   Net profit should be at least 2-3× the tax amount per item to be worthwhile.

10. COMMON PITFALLS TO WARN ABOUT:
   - Items with < 1,000 gp price are risky because the tax gap eats most of the margin.
   - A trend slope of ±0.0 with 0.0% volatility usually means insufficient price history data — do NOT call this "stable" or "risky"; instead note that historical data is limited.
   - Volume spikes can indicate merch clans manipulating the price — advise caution.
   - DXP weekend announcements cause skilling supply prices to spike days/weeks before the event. Golden rule: Buy months in advance during quiet periods, sell during pre-event hype/announcement spikes. NEVER hold inventory through the actual DXP weekend — prices usually crash as hoarders dump supplies.
   - Do NOT recommend flipping items priced under ~1,000 gp unless margin is exceptionally wide.
   - Avoid holding downward-trending items overnight unless volatility is very low.
   - Watch for "dead GE" items (0 volume for days) — margins may look good but fill time can be days/weeks.
   - Upcoming updates/DXP/Boss drops/PvM changes can crash or spike prices unpredictably — cross-reference recent game news when possible.

11. GE MID-PRICE LAG & STALENESS: The displayed GE mid-price updates daily based on recent trades, but for low-volume or suddenly volatile items (new releases, boss drops, nerfs), it can lag significantly (days or weeks). During these periods, the mid-price becomes unreliable or "fictional." Always rely on real-time margin checking (insta-buy/sell offers) rather than the listed mid-price for high-volatility events or low-trade items.

=== LLM OUTPUT CONSTRAINTS (MANDATORY) ===
- When recommending any flip or calculating profit/gp/hr, you MUST explicitly show the math: e.g., "Gross margin = Sell price - Buy price = X gp; Tax = floor(Sell price × 0.02) = Y gp; Net profit per item = X - Y = Z gp; gp/hr = Z × (Limit / fill hours) = W gp/hr."
- Never describe any flip as "guaranteed profit" or use the word "guaranteed" — all GE prices are player-driven and can change.
- If Buy Limit is "Unknown", assume conservative defaults for worst-case estimates: 10 for equipment/rares, 1,000 for consumables/skilling items. State this assumption clearly in the response.`;
/**
 * Legend explaining each data field in the formatted market summary.
 * Included in the system prompt so the LLM can correctly interpret the data.
 */
const DATA_FIELD_LEGEND = `\
=== DATA FIELD LEGEND (use this to interpret the market data) ===

Each item line in the market data contains these fields:

• GE Price — current Grand Exchange mid-price in gp.
• Buy ≤ — recommended maximum buy offer (~1% below mid-price).
• Sell ≥ — recommended minimum sell offer (~3% above mid-price, floored at High Alch value).
• Profit — estimated per-item flip profit AFTER 2% GE tax: Sell − Buy − floor(Sell × 0.02).
• Limit — 4-hour GE buy limit. "Unknown" = data unavailable (be cautious).
• Eff. Vol — effective daily player volume = min(global daily volume, buy limit × 6). Reflects what one player can realistically trade.
• Max 4H Capital — price × buy limit. How much gold you need to max out one 4-hour window.
• Tax Gap — minimum spread (in gp) required to break even after the 2% GE tax.
• 30d Trend Slope — linear regression slope over available price history:
  - Positive (+N.N) = prices trending upward → good for buying.
  - Negative (−N.N) = prices trending downward → good for selling / risky to hold.
  - Near zero (+0.0 / −0.0) with 0% volatility = likely insufficient data, NOT confirmation of stability.
• Volatility — daily price standard deviation as a percentage:
  - 0% = no variation in available data (or insufficient data).
  - <5% = low volatility, stable — safer.
  - 5-10% = moderate — normal for active items.
  - >10% = high volatility — risky, margins can shift rapidly.
• Predicted 24h Price — next-day price estimate from linear trend extrapolation. Less reliable with sparse history.
• ⚠ RISKY — flagged when item price is < 500-1,000 gp (tax gap erodes margins).
• 🔥 N.Nx Vol Spike — today's volume is N.N× the 7-day average. May indicate a surge or manipulation.
• Flags:
  - ⚠ LOW-PRICE: Price <500-1000 gp (tax eats margin).
  - 🔥 VOL SPIKE: Today's volume ≥1.5-2× 7-day avg (possible pump, dump, or event surge).
  - LIMITED-DATA or 0.0% vol + 0.0 slope: Insufficient history — treat trend as unreliable.`;


/***/ },

/***/ "./services/index.ts"
/*!***************************!*\
  !*** ./services/index.ts ***!
  \***************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CacheService: () => (/* reexport safe */ _cacheService__WEBPACK_IMPORTED_MODULE_1__.CacheService),
/* harmony export */   DATA_FIELD_LEGEND: () => (/* reexport safe */ _coreKnowledge__WEBPACK_IMPORTED_MODULE_6__.DATA_FIELD_LEGEND),
/* harmony export */   LLMRequestError: () => (/* reexport safe */ _llmService__WEBPACK_IMPORTED_MODULE_4__.LLMRequestError),
/* harmony export */   LLMService: () => (/* reexport safe */ _llmService__WEBPACK_IMPORTED_MODULE_4__.LLMService),
/* harmony export */   LLM_PROVIDERS: () => (/* reexport safe */ _types__WEBPACK_IMPORTED_MODULE_8__.LLM_PROVIDERS),
/* harmony export */   MarketAnalyzerService: () => (/* reexport safe */ _marketAnalyzerService__WEBPACK_IMPORTED_MODULE_2__.MarketAnalyzerService),
/* harmony export */   PortfolioService: () => (/* reexport safe */ _portfolioService__WEBPACK_IMPORTED_MODULE_5__.PortfolioService),
/* harmony export */   RS3_ECONOMIC_RULES: () => (/* reexport safe */ _coreKnowledge__WEBPACK_IMPORTED_MODULE_6__.RS3_ECONOMIC_RULES),
/* harmony export */   WeirdGloopService: () => (/* reexport safe */ _weirdGloopService__WEBPACK_IMPORTED_MODULE_0__.WeirdGloopService),
/* harmony export */   WikiService: () => (/* reexport safe */ _wikiService__WEBPACK_IMPORTED_MODULE_3__.WikiService),
/* harmony export */   fetchGECatalogue: () => (/* reexport safe */ _initDataPipeline__WEBPACK_IMPORTED_MODULE_7__.fetchGECatalogue),
/* harmony export */   initDataPipeline: () => (/* reexport safe */ _initDataPipeline__WEBPACK_IMPORTED_MODULE_7__.initDataPipeline),
/* harmony export */   runFullMarketScan: () => (/* reexport safe */ _initDataPipeline__WEBPACK_IMPORTED_MODULE_7__.runFullMarketScan)
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
/* harmony export */   initDataPipeline: () => (/* binding */ initDataPipeline),
/* harmony export */   runFullMarketScan: () => (/* binding */ runFullMarketScan)
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
            // Step 3b — Enrich records with GE buy limits and high alch values from the wiki.
            const wiki = new _wikiService__WEBPACK_IMPORTED_MODULE_2__.WikiService();
            const itemNames = Array.from(prices.keys());
            let buyLimits;
            let alchValues;
            try {
                [buyLimits, alchValues] = await Promise.all([
                    wiki.getBulkBuyLimits(itemNames),
                    wiki.getBulkHighAlchValues(itemNames),
                ]);
            }
            catch (wikiErr) {
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
            console.log(`[initDataPipeline] Enriched ${buyLimits.size} buy limits, ${alchValues.size} alch values for ${prices.size} records.`);
            // Step 3c — Persist enriched records into IndexedDB.
            const written = await cache.bulkInsert(prices);
            console.log(`[initDataPipeline] Wrote ${written} records to cache.`);
            // Step 3d — Seed 30 days of historical prices for EMA / regression.
            try {
                const itemNames = Array.from(prices.keys());
                const historyMap = await api.fetchHistoricalPrices(itemNames, 30);
                if (historyMap.size > 0) {
                    const histWritten = await cache.bulkInsertHistory(historyMap);
                    console.log(`[initDataPipeline] Seeded ${histWritten} historical rows for ${historyMap.size} items.`);
                }
            }
            catch (histErr) {
                console.warn("[initDataPipeline] Historical price fetch failed — sparklines may be sparse.", histErr);
            }
        }
    }
    else {
        console.log("[initDataPipeline] Cache is fresh — skipping API fetch.");
    }
    // ── Health checks: repair missing enrichment / history even on a fresh cache ──
    const records = await cache.getAll();
    // Health check A — Re-enrich records missing highAlch or buyLimit.
    // This recovers from earlier wiki fetch failures (e.g. CORS, network).
    const missingAlch = records.filter((r) => r.highAlch == null);
    const missingLimit = records.filter((r) => r.buyLimit == null);
    if (missingAlch.length > records.length * 0.5 || missingLimit.length > records.length * 0.5) {
        console.log(`[initDataPipeline] Enrichment health check: ${missingAlch.length}/${records.length} missing highAlch, ` +
            `${missingLimit.length}/${records.length} missing buyLimit — re-enriching…`);
        const wiki = new _wikiService__WEBPACK_IMPORTED_MODULE_2__.WikiService();
        const namesToEnrich = records.map((r) => r.name);
        try {
            const [limits, alchs] = await Promise.all([
                missingLimit.length > records.length * 0.5
                    ? wiki.getBulkBuyLimits(namesToEnrich)
                    : Promise.resolve(new Map()),
                missingAlch.length > records.length * 0.5
                    ? wiki.getBulkHighAlchValues(namesToEnrich)
                    : Promise.resolve(new Map()),
            ]);
            // Build a map for quick update of enriched records.
            const priceMap = new Map();
            for (const r of records) {
                const limit = limits.get(r.name);
                const alch = alchs.get(r.name);
                let updated = false;
                if (limit !== undefined && r.buyLimit == null) {
                    r.buyLimit = limit;
                    updated = true;
                }
                if (alch !== undefined && r.highAlch == null) {
                    r.highAlch = alch;
                    updated = true;
                }
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
        }
        catch (enrichErr) {
            console.warn("[initDataPipeline] Re-enrichment failed:", enrichErr);
        }
    }
    // Health check B — Re-seed history if the history store is sparse.
    // This recovers from earlier history fetch failures.
    try {
        const recentHistory = await cache.getRecentHistory(30);
        const today = new Date().toISOString().slice(0, 10);
        // Count items with ≥ 2 non-today data points.
        const grouped = new Map();
        for (const h of recentHistory) {
            if (h.day === today)
                continue;
            grouped.set(h.name, (grouped.get(h.name) ?? 0) + 1);
        }
        const itemsWithSufficientHistory = [...grouped.values()].filter((c) => c >= 2).length;
        if (records.length > 0 && itemsWithSufficientHistory < records.length * 0.3) {
            // The /last90d API only supports 1 item per request, so re-seeding
            // all 7 000+ items would take too long.  Limit to SEED_ITEMS that
            // actually lack sufficient history — keeps startup under ~30 s.
            const namesToSeed = SEED_ITEMS.filter((name) => (grouped.get(name) ?? 0) < 2);
            console.log(`[initDataPipeline] History health check: only ${itemsWithSufficientHistory}/${records.length} items ` +
                `have ≥ 2 days of history — re-seeding ${namesToSeed.length} seed items…`);
            if (namesToSeed.length > 0) {
                const api = new _weirdGloopService__WEBPACK_IMPORTED_MODULE_1__.WeirdGloopService();
                const historyMap = await api.fetchHistoricalPrices(namesToSeed, 30);
                if (historyMap.size > 0) {
                    await cache.bulkInsertHistory(historyMap);
                    console.log(`[initDataPipeline] Re-seeded ${historyMap.size} items with historical data.`);
                }
            }
        }
        else {
            console.log(`[initDataPipeline] History health check: ${itemsWithSufficientHistory}/${records.length} items OK.`);
        }
    }
    catch (histHealthErr) {
        console.warn("[initDataPipeline] History health check failed:", histHealthErr);
    }
    // Step 4 — Return all cached data for downstream consumers.
    // Re-read in case health checks updated records.
    const finalRecords = await cache.getAll();
    console.log(`[initDataPipeline] Pipeline complete. ${finalRecords.length} records available.`);
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
async function runFullMarketScan(catalogue, onProgress, signal, deepHistory = false) {
    if (catalogue.length === 0) {
        console.warn("[FullMarketScan] Empty catalogue — nothing to scan.");
        return 0;
    }
    const cache = new _cacheService__WEBPACK_IMPORTED_MODULE_0__.CacheService();
    const api = new _weirdGloopService__WEBPACK_IMPORTED_MODULE_1__.WeirdGloopService();
    const wiki = new _wikiService__WEBPACK_IMPORTED_MODULE_2__.WikiService();
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
            const freshCount = existing.filter((r) => r.fetchedAt && (now - r.fetchedAt) < FRESH_THRESHOLD_MS).length;
            const coverage = freshCount / catalogue.length;
            if (coverage >= 0.9) {
                historyOnly = true;
                console.log(`[FullMarketScan] Prices already fresh for ${freshCount}/${catalogue.length} items ` +
                    `(${(coverage * 100).toFixed(0)}%) — switching to history-only mode.`);
            }
        }
    }
    const BATCH_SIZE = 100;
    const BASE_DELAY_MS = 1500; // default pause between batches
    const MAX_DELAY_MS = 30000; // ceiling for adaptive backoff
    const allNames = catalogue.map((e) => e.name);
    const total = allNames.length;
    let done = 0;
    let currentDelay = BASE_DELAY_MS; // adapts when batches return empty
    let consecutiveEmpty = 0; // tracks back-to-back 0-result batches
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
                }
                catch {
                    // Non-critical — skip history for this batch.
                }
            }
            else {
                // ── Normal mode: fetch prices + enrichment + optional history ──
                const prices = await api.fetchLatestPrices(batchNames);
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
                            if (limit !== undefined)
                                record.buyLimit = limit;
                            const alch = alchs.get(name);
                            if (alch !== undefined)
                                record.highAlch = alch;
                        }
                    }
                    catch {
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
                        }
                        catch {
                            // Non-critical — skip history for this batch.
                        }
                    }
                }
                else {
                    // Batch returned 0 results — likely rate-limited.  Back off.
                    consecutiveEmpty++;
                    currentDelay = Math.min(BASE_DELAY_MS * Math.pow(2, consecutiveEmpty), MAX_DELAY_MS);
                    console.warn(`[FullMarketScan] Batch ${i / BATCH_SIZE + 1} returned 0 results ` +
                        `(${consecutiveEmpty} consecutive). Next delay: ${(currentDelay / 1000).toFixed(1)}s`);
                }
            } // end normal mode
        }
        catch (err) {
            consecutiveEmpty++;
            currentDelay = Math.min(BASE_DELAY_MS * Math.pow(2, consecutiveEmpty), MAX_DELAY_MS);
            console.warn(`[FullMarketScan] Batch ${i / BATCH_SIZE + 1} failed (delay → ${(currentDelay / 1000).toFixed(1)}s):`, err);
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

/** Sensible defaults — Groq free tier with `llama-3.1-8b-instant`. */
const DEFAULTS = {
    apiKey: "",
    endpoint: "https://api.groq.com/openai/v1/chat/completions",
    model: "llama-3.1-8b-instant",
    temperature: 0.4,
    maxTokens: 1024,
};
/**
 * Maximum number of user+assistant exchange pairs retained in the API
 * payload (on top of the system prompt). Older exchanges are dropped to
 * keep the request within provider size limits.
 */
const MAX_HISTORY_PAIRS = 8;
/**
 * Regex that matches the `=== GRAND EXCHANGE DATA ===` block inside a
 * user message, leaving only the `=== PLAYER QUESTION ===` section.
 */
const DATA_BLOCK_RE = /=== GRAND EXCHANGE DATA ===[\s\S]*?(?==== PLAYER QUESTION ===)/;
/**
 * Maximum JSON body size (in bytes) we allow before truncating context.
 * Groq's gateway returns HTTP 413 above ~100 KB, but free-tier limits
 * vary by model.  50 KB provides a safe margin for all models.
 */
const MAX_BODY_BYTES = 50000;
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
     * @returns The assistant's generated advice text.
     * @throws {LLMRequestError} On HTTP-level failures (401, 429, 5xx, etc.).
     */
    async generateAdvice(query, marketData) {
        const userMsg = this.buildUserMessage(query, marketData);
        this._messages.push({ role: "user", content: userMsg });
        // Build a trimmed copy of the history for the API payload.
        // - System prompt: kept as-is.
        // - Older user messages: data blocks stripped, only the player question retained.
        // - Most recent user message (the one we just pushed): full context kept.
        // - Assistant messages: kept as-is.
        // Additionally, cap conversation to the system prompt + last MAX_HISTORY_PAIRS
        // exchanges to bound payload size.
        const trimmed = this.buildTrimmedHistory();
        let body = {
            model: this.model,
            messages: trimmed,
            temperature: this.temperature,
            max_completion_tokens: this.maxTokens,
        };
        // Measure initial payload size.
        let jsonBody = JSON.stringify(body);
        const encoder = new TextEncoder();
        let byteLen = encoder.encode(jsonBody).length;
        console.log(`[LLMService] Sending ${trimmed.length} messages ` +
            `(${this._messages.length} in full history) — ` +
            `${(byteLen / 1024).toFixed(1)} KB payload — ` +
            `model: ${this.model}`);
        // Guard against oversized payloads.
        // Strategy: first halve market-data lines (up to 4×), then halve wiki
        // text (up to 4×).  This two-phase approach trims the two largest
        // variable-size sections progressively.
        if (byteLen > MAX_BODY_BYTES) {
            console.warn(`[LLMService] Payload too large (${(byteLen / 1024).toFixed(1)} KB > ` +
                `${(MAX_BODY_BYTES / 1024).toFixed(0)} KB limit). Truncating…`);
            const lastUserIdx = this.findLastUserIdx(trimmed);
            if (lastUserIdx >= 0) {
                let truncated = trimmed;
                // Phase 1: halve market data.
                for (let attempt = 0; attempt < 4 && byteLen > MAX_BODY_BYTES; attempt++) {
                    truncated = this.halveMarketData(truncated, lastUserIdx);
                    body = { ...body, messages: truncated };
                    jsonBody = JSON.stringify(body);
                    byteLen = encoder.encode(jsonBody).length;
                    console.log(`[LLMService]   Market-data trim ${attempt + 1}: ${(byteLen / 1024).toFixed(1)} KB`);
                }
            }
        }
        const headers = {
            "Content-Type": "application/json",
        };
        if (this.apiKey) {
            headers["Authorization"] = `Bearer ${this.apiKey}`;
        }
        const response = await fetch(this.endpoint, {
            method: "POST",
            headers,
            body: jsonBody,
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
     *  - Defines the persona (RS3 Grand Exchange flipping specialist).
     *  - Mandates exclusive use of the provided market data.
     *  - Forbids inventing prices, volumes, or game mechanics.
     *  - Instructs clear, concise formatting suitable for an Alt1 overlay.
     *
     * @returns The system prompt string.
     */
    buildSystemMessage() {
        return [
            "You are a RuneScape 3 Grand Exchange flipping specialist.",
            "",
            "STRICT RULES — you MUST follow all of these:",
            "1. ONLY use the Grand Exchange market data provided in the user message. Never reference outside pricing or game knowledge.",
            "2. NEVER invent, guess, or hallucinate prices, trade volumes, profit margins, or game mechanics.",
            "3. If the provided data is insufficient to answer a question, say so explicitly — do NOT fill gaps with assumptions.",
            "4. When recommending items, ALWAYS cite the exact numbers from the data (price, profit, buy limit, volume, trend slope, volatility).",
            "5. Keep responses concise and actionable. Use bullet points or numbered lists. No filler or generic advice.",
            "6. Format gold values with standard RS3 abbreviations: K (thousands), M (millions), B (billions).",
            "",
            "ANALYTICAL REASONING — follow this framework when recommending items:",
            "7. For EVERY item you recommend or discuss, state:",
            "   a. The per-item profit AFTER tax (use the 'Profit' field, or compute it).",
            "   b. The 4-hour profit potential: profit × buy limit.",
            "   c. The estimated gp/hr based on trade velocity (see economic rules for fill-time estimates).",
            "   d. The 30d trend: quote the slope value and explain what it means (rising, falling, or flat).",
            "   e. The volatility %: quote it and classify as low (<5%), moderate (5-10%), or high (>10%).",
            "",
            "8. CRITICAL: When trend slope is near zero (+0.0 or −0.0) AND volatility is 0.0%, this usually means INSUFFICIENT PRICE HISTORY DATA — do NOT interpret it as 'stable' or 'low risk'. Instead, say historical data is limited and recommend the player margin-check the item first.",
            "",
            "9. When the player asks 'what should I flip', rank your top 3-5 picks by estimated gp/hr and explain why each is good. Include at least one high-volume fast flip and one higher-margin slower flip if available.",
            "",
            "10. Always include actionable next steps: what price to set buy offers at, estimated wait time, and what to sell at.",
            "",
            "The following RS3 economic laws are ABSOLUTE. They supersede any conflicting outside knowledge. Apply them to every calculation.",
            "",
            _coreKnowledge__WEBPACK_IMPORTED_MODULE_0__.RS3_ECONOMIC_RULES,
            "",
            _coreKnowledge__WEBPACK_IMPORTED_MODULE_0__.DATA_FIELD_LEGEND,
            "",
            "Your audience is an experienced RS3 player viewing this inside the Alt1 Toolkit overlay who is focused on flipping items for profit. Be direct, specific, and data-driven. Never pad responses with generic advice like 'do your own research' — the data is right there.",
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
     * === PLAYER QUESTION ===
     * …free-form query…
     * ```
     *
     * @param query      - Player's question.
     * @param marketData - Formatted market data block.
     * @returns The composed user prompt string.
     */
    buildUserMessage(query, marketData) {
        return [
            "=== GRAND EXCHANGE DATA ===",
            marketData,
            "",
            "=== PLAYER QUESTION ===",
            query,
        ].join("\n");
    }
    /**
     * Build a size-efficient copy of `_messages` for the API payload.
     *
     * 1. Keeps the system prompt verbatim.
     * 2. Caps non-system messages to the last `MAX_HISTORY_PAIRS * 2` entries
     *    (each pair = one user + one assistant message).
     * 3. Strips the bulky `=== GRAND EXCHANGE DATA ===` and
     *    `=== WIKI GUIDE TEXT ===` blocks from **all user messages except the
     *    most recent one**, retaining only the `=== PLAYER QUESTION ===`
     *    section so the LLM still sees the conversational context.
     *
     * @returns A new `ChatMessage[]` safe to serialise and send.
     */
    buildTrimmedHistory() {
        const system = this._messages[0]; // always the system prompt
        let rest = this._messages.slice(1);
        // Cap to the most recent exchanges.
        const maxNonSystem = MAX_HISTORY_PAIRS * 2;
        if (rest.length > maxNonSystem) {
            rest = rest.slice(rest.length - maxNonSystem);
        }
        // Find the index of the last user message (relative to `rest`).
        let lastUserIdx = -1;
        for (let i = rest.length - 1; i >= 0; i--) {
            if (rest[i].role === "user") {
                lastUserIdx = i;
                break;
            }
        }
        const trimmed = [system];
        for (let i = 0; i < rest.length; i++) {
            const msg = rest[i];
            if (msg.role === "user" && i !== lastUserIdx) {
                // Strip data blocks, keep only the question portion.
                const stripped = msg.content.replace(DATA_BLOCK_RE, "").trim();
                trimmed.push({ role: "user", content: stripped });
            }
            else {
                trimmed.push(msg);
            }
        }
        return trimmed;
    }
    /**
     * Find the index of the last user message in a `ChatMessage[]`.
     * @returns Index, or -1 if none.
     */
    findLastUserIdx(messages) {
        for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].role === "user")
                return i;
        }
        return -1;
    }
    /**
     * Halve the market-data section of the user message at `idx`.
     *
     * Locates the `=== GRAND EXCHANGE DATA ===` block and keeps only the
     * first half of its lines (i.e. the top-ranked half of items).  Returns
     * a shallow copy of the array with the modified user message.
     */
    halveMarketData(messages, idx) {
        const msg = messages[idx];
        const dataStart = msg.content.indexOf("=== GRAND EXCHANGE DATA ===");
        const questionStart = msg.content.indexOf("\n=== PLAYER QUESTION ===");
        if (dataStart < 0 || questionStart < 0)
            return messages; // safety
        const dataBlock = msg.content.slice(dataStart + "=== GRAND EXCHANGE DATA ===".length + 1, questionStart);
        const lines = dataBlock.split("\n");
        const half = lines.slice(0, Math.max(Math.ceil(lines.length / 2), 5));
        const newContent = msg.content.slice(0, dataStart + "=== GRAND EXCHANGE DATA ===".length + 1) +
            half.join("\n") +
            `\n[Truncated to ${half.length} items to fit request limits]\n` +
            msg.content.slice(questionStart);
        const copy = [...messages];
        copy[idx] = { ...msg, content: newContent };
        return copy;
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
            case 413:
                hint = "Request too large — conversation history exceeded the provider's size limit. Try clearing the chat and starting a new conversation.";
                break;
            case 429:
                hint = "Rate limited — you have exceeded the API quota. Wait and retry.";
                break;
            default:
                hint = status >= 500
                    ? "Server error on the LLM provider side. Try again later."
                    : status === 400
                        ? "Bad request — the model may be deprecated or the request body is invalid. Try a different model."
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
/* harmony import */ var _weirdGloopService__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./weirdGloopService */ "./services/weirdGloopService.ts");
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
 * All calculations are pure math on local data — the only network call is a
 * fallback fetch to the Weird Gloop historical API when the local IndexedDB
 * price-history store has insufficient data for sparkline rendering.
 */

// ─── Pure Time-Series Math ──────────────────────────────────────────────────
/**
 * Calculate the Exponential Moving Average of a price series.
 *
 * The EMA gives progressively more weight to recent observations.
 * With the default `alpha = 0.2`, the half-life is roughly 3 observations.
 *
 * @param prices - Chronological price array (oldest-first).  Must have ≥ 1 element.
 * @param alpha  - Smoothing factor in (0, 1].  Higher = more reactive.
 * @returns The final EMA value, or `0` if the array is empty.
 */
function calculateEMA(prices, alpha = 0.2) {
    if (prices.length === 0)
        return 0;
    let ema = prices[0];
    for (let i = 1; i < prices.length; i++) {
        ema = alpha * prices[i] + (1 - alpha) * ema;
    }
    return ema;
}
/**
 * Calculate the volatility of a price series as the standard deviation of
 * daily percentage returns.
 *
 * A return of `0.05` means the typical daily swing is ±5 %.
 *
 * @param prices - Chronological price array (oldest-first).  Needs ≥ 2 elements.
 * @returns Population standard deviation of daily % changes, or `0` if too few data points.
 */
function calculateVolatility(prices) {
    if (prices.length < 2)
        return 0;
    const returns = [];
    for (let i = 1; i < prices.length; i++) {
        if (prices[i - 1] === 0)
            continue;
        returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
    }
    if (returns.length === 0)
        return 0;
    const mean = returns.reduce((s, r) => s + r, 0) / returns.length;
    const variance = returns.reduce((s, r) => s + (r - mean) ** 2, 0) / returns.length;
    return Math.sqrt(variance);
}
/**
 * Fit an ordinary least-squares (OLS) linear regression to a price series and
 * return the slope plus a one-step-ahead prediction.
 *
 * The independent variable is a zero-based day index (0, 1, 2, …).
 *
 * @param prices - Chronological price array (oldest-first).  Needs ≥ 2 elements.
 * @returns `{ slope, predictedNext }` where `predictedNext` is the extrapolated
 *          price for day `N` (one beyond the last observation).
 *          Both are `0` when there is insufficient data.
 */
function calculateLinearTrend(prices) {
    const n = prices.length;
    if (n < 2)
        return { slope: 0, predictedNext: 0 };
    // Σx, Σy, Σxy, Σx²  where x = 0 … n-1
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;
    for (let i = 0; i < n; i++) {
        sumX += i;
        sumY += prices[i];
        sumXY += i * prices[i];
        sumX2 += i * i;
    }
    const denom = n * sumX2 - sumX * sumX;
    if (denom === 0)
        return { slope: 0, predictedNext: prices[n - 1] };
    const slope = (n * sumXY - sumX * sumY) / denom;
    const intercept = (sumY - slope * sumX) / n;
    const predictedNext = intercept + slope * n; // day = n (one step ahead)
    return { slope, predictedNext };
}
/** Default analyser settings. */
const DEFAULTS = {
    topN: 20,
    minVolume: 0,
};
/**
 * Number of top items (by traded value, no filters) included in the LLM
 * chat context.  50 items in compact format ≈ 6–8 KB — comfortably fits
 * alongside the system prompt and truncated wiki text within a 50 KB
 * payload budget.
 */
const LLM_CONTEXT_TOP_N = 50;
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
        this.cachedAvgVolumeMap = null;
        this.cachedPriceHistoryMap = null;
        this.mapCacheTimestamp = 0;
        this.cache = cache;
        this.topN = config?.topN ?? DEFAULTS.topN;
        this.minVolume = config?.minVolume ?? DEFAULTS.minVolume;
        this.maxVolume = config?.maxVolume ?? 0;
        this.maxPrice = config?.maxPrice ?? 0;
    }
    /** Invalidate the cached volume/price maps so the next call rebuilds them. */
    invalidateMapCache() {
        this.cachedAvgVolumeMap = null;
        this.cachedPriceHistoryMap = null;
        this.mapCacheTimestamp = 0;
    }
    /** Check whether the cached maps are still within their TTL. */
    isMapsStale() {
        return !this.cachedAvgVolumeMap
            || !this.cachedPriceHistoryMap
            || (Date.now() - this.mapCacheTimestamp > MarketAnalyzerService.MAP_CACHE_TTL_MS);
    }
    /**
     * Return (possibly cached) avgVolumeMap and priceHistoryMap.
     * Rebuilds both if the cache is stale or empty.
     */
    async getOrBuildMaps(days = 30) {
        if (!this.isMapsStale()) {
            console.log("[MarketAnalyzer] Using cached scoring maps (age: " +
                `${((Date.now() - this.mapCacheTimestamp) / 1000).toFixed(0)}s).`);
            return {
                avgVolumeMap: this.cachedAvgVolumeMap,
                priceHistoryMap: this.cachedPriceHistoryMap,
            };
        }
        const avgVolumeMap = await this.buildAvgVolumeMap(days);
        const priceHistoryMap = await this.buildPriceHistoryMap(days);
        this.cachedAvgVolumeMap = avgVolumeMap;
        this.cachedPriceHistoryMap = priceHistoryMap;
        this.mapCacheTimestamp = Date.now();
        return { avgVolumeMap, priceHistoryMap };
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
        // Build a volume-SMA map from the last 30 days of history.
        // Build a price-history map for sparklines / EMA / regression.
        // Uses TTL-cached maps to skip redundant IndexedDB reads + API calls.
        const { avgVolumeMap, priceHistoryMap } = await this.getOrBuildMaps(30);
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
        const { avgVolumeMap, priceHistoryMap } = await this.getOrBuildMaps(30);
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
        const { avgVolumeMap, priceHistoryMap } = await this.getOrBuildMaps(30);
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
     * Build a broader dataset specifically for LLM chat context.
     *
     * Returns the top {@link LLM_CONTEXT_TOP_N} items by traded value with
     * **no volume or price filters**, giving the LLM a much wider view of
     * the market than the UI's filtered top-20 panel.
     *
     * Uses a compact line format (no repeated field labels) to minimise
     * payload size while preserving all analytical data.
     *
     * @returns A formatted string with up to 100 items for LLM context injection.
     */
    async getFormattedForLLM() {
        const items = await this.getTopItems({
            topN: LLM_CONTEXT_TOP_N,
            minVolume: 0,
            maxVolume: 0,
            maxPrice: 0,
        });
        return this.formatForLLMCompact(items);
    }
    /**
     * Compact LLM serialisation — same data as {@link formatForLLM} but with
     * abbreviated field labels to reduce payload size.
     *
     * Header line explains the field order so each data line stays short:
     * ```
     * # Fields: Name | Price | Buy | Sell | Profit | Limit | EffVol | 4HCap | TaxGap | Alch | Velocity | Slope | Vol% | Pred
     * 1. Blood rune | 618 | 612 | 637 | 12 | 25K | 150K | 15.45M | 13 | 480 | Insta-Flip | +0.5 | 2.3% | 620
     * ```
     *
     * @param items - Pre-ranked items.
     * @returns Multi-line string optimised for minimal payload size.
     */
    formatForLLMCompact(items) {
        if (items.length === 0) {
            return "[No liquid items available — cache may be empty.]";
        }
        const header = `=== RS3 Grand Exchange — Top ${items.length} by Traded Value (unfiltered) ===`;
        const legend = "# Fields: Name | Price | Buy | Sell | Profit | Limit | EffVol | 4HCap | TaxGap | Alch | Velocity | Slope | Vol% | Pred | Flags";
        const lines = items.map((item, idx) => {
            const rank = String(idx + 1).padStart(2, " ");
            const price = this.formatGp(item.price);
            const buy = this.formatGp(item.recBuyPrice);
            const sell = this.formatGp(item.recSellPrice);
            const profit = this.formatGp(item.estFlipProfit);
            const limit = item.buyLimit != null
                ? this.formatGp(item.buyLimit)
                : "?";
            const effVol = this.formatGp(item.effectivePlayerVolume);
            const cap4h = item.maxCapitalPer4H > 0
                ? this.formatGp(item.maxCapitalPer4H)
                : "?";
            const taxGap = this.formatGp(item.taxGap);
            const alch = typeof item.highAlch === "number" && item.highAlch > 0
                ? this.formatGp(item.highAlch)
                : item.highAlch === false ? "N/A" : "?";
            const velocity = item.tradeVelocity;
            const slope = item.linearSlope >= 0
                ? `+${item.linearSlope.toFixed(1)}`
                : item.linearSlope.toFixed(1);
            const vol = `${(item.volatility * 100).toFixed(1)}%`;
            const pred = this.formatGp(Math.round(item.predictedNextPrice));
            const flags = [];
            if (item.isRisky)
                flags.push("⚠RISKY");
            if (item.priceHistory.length < 3)
                flags.push("LIMITED-DATA");
            if (item.volumeSpikeMultiplier > 0)
                flags.push(`🔥${item.volumeSpikeMultiplier}x`);
            const flagStr = flags.length > 0 ? " " + flags.join(" ") : "";
            return `${rank}. ${item.name} | ${price} | ${buy} | ${sell} | ${profit} | ${limit} | ${effVol} | ${cap4h} | ${taxGap} | ${alch} | ${velocity} | ${slope} | ${vol} | ${pred}${flagStr}`;
        });
        return [header, legend, ...lines].join("\n");
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
            const slope = item.linearSlope >= 0 ? `+${item.linearSlope.toFixed(1)}` : item.linearSlope.toFixed(1);
            const vol = (item.volatility * 100).toFixed(1);
            const predicted = this.formatGp(Math.round(item.predictedNextPrice));
            const alch = typeof item.highAlch === "number" && item.highAlch > 0
                ? `High Alch: ${this.formatGp(item.highAlch)} gp`
                : item.highAlch === false ? "High Alch: Not Alchable" : "High Alch: Unknown";
            const velocity = item.tradeVelocity;
            const histLen = item.priceHistory.length;
            const histNote = histLen < 3 ? " [LIMITED DATA]" : "";
            return `${rank}. ${item.name} | GE Price: ${price} gp | Buy ≤ ${recBuy} | Sell ≥ ${recSell} | Profit: ${flipPft} gp/ea | Limit: ${limit} | Eff. Vol: ${effVol} | Max 4H Capital: ${cap4h} | Tax Gap: ${this.formatGp(item.taxGap)} gp | ${alch} | Velocity: ${velocity} | 30d Trend Slope: ${slope} | Volatility: ${vol}%${histNote} | Predicted 24h Price: ${predicted} gp${risk}${hype}`;
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
     * Volume filters (`minVolume` / `maxVolume`) are applied against the
     * **global daily GE volume** so that preset filters (High / Low)
     * reflect actual market liquidity rather than a single player's
     * buy-limit-constrained throughput.
     *
     * @param records      - Raw records from the cache.
     * @param minVolume    - Minimum global daily volume (inclusive lower bound).
     * @param maxVolume    - Maximum global daily volume (0 = no cap).
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
            // Apply filters against raw global daily volume so that High / Low
            // presets meaningfully distinguish market liquidity tiers.
            if (globalVol <= minVolume)
                continue;
            if (maxVolume > 0 && globalVol > maxVolume)
                continue;
            if (maxPrice > 0 && record.price > maxPrice)
                continue;
            const maxCapitalPer4H = limit != null ? record.price * limit : 0;
            // Tax gap: minimum spread (in gp) needed to break even after 2% GE tax.
            // Use floor-based tax to match the official RS3 engine rounding.
            const breakEvenSell = Math.ceil(record.price / 0.98);
            const breakEvenTax = record.price <= 50 ? 0 : Math.floor(breakEvenSell * 0.02);
            const taxGap = breakEvenTax + (breakEvenSell - record.price - breakEvenTax);
            // Recommended buy price: ~1% below current GE mid-price.
            const recBuyPrice = Math.max(1, Math.floor(record.price * 0.99));
            // Recommended sell price: high enough above the buy price to cover
            // the 2% GE tax and still yield a meaningful margin.
            // Target: sell at ~3% above mid-price → ~2% spread after tax.
            let recSellPrice = Math.max(recBuyPrice + 1, Math.ceil(record.price * 1.03));
            // High Alchemy floor: never recommend selling below the alch value.
            recSellPrice = Math.max(recSellPrice, typeof record.highAlch === "number" ? record.highAlch : 0);
            // Estimated per-item flip profit: sell − buy − 2% GE tax on the sale.
            // Official RS3 wiki formula: floor(price * 2%), exempt at ≤ 50 gp.
            let expectedTax = Math.floor(recSellPrice * 0.02);
            if (recSellPrice <= 50)
                expectedTax = 0;
            const estFlipProfit = recSellPrice - recBuyPrice - expectedTax;
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
            // ── Time-series indicators (30-day window) ────────────────────────
            const ema30d = calculateEMA(priceHistory);
            const volatility = calculateVolatility(priceHistory);
            const { slope: linearSlope, predictedNext: predictedNextPrice } = calculateLinearTrend(priceHistory);
            // 7-day price momentum: classify trend based on overall % change.
            let priceTrend = "Stable";
            if (priceHistory.length >= 2 && priceHistory[0] > 0) {
                const percentChange = (record.price - priceHistory[0]) / priceHistory[0];
                if (percentChange < -0.05)
                    priceTrend = "Downtrend";
                else if (percentChange > 0.05)
                    priceTrend = "Uptrend";
            }
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
            // ── Scoring adjustments based on predictive indicators ──────────
            let tradedValue = record.price * effectivePlayerVolume;
            // Reward upward-trending items (positive linear slope).
            if (linearSlope > 0)
                tradedValue *= 1.05;
            // Penalise highly volatile items (daily σ > 10 %).
            if (volatility > 0.10)
                tradedValue *= 0.90;
            result.push({
                name: record.name,
                itemId: record.id,
                price: record.price,
                recBuyPrice,
                volume: globalVol,
                tradedValue,
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
                priceTrend,
                ema30d,
                volatility,
                linearSlope,
                predictedNextPrice,
                highAlch: record.highAlch,
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
     * (does **not** include today — the caller appends the current price).
     *
     * When the local IndexedDB history is sparse (most items have ≤ 1 day),
     * the method falls back to the Weird Gloop `last90d` API to fetch
     * real historical prices, extracting data for the last {@link days} days.
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
            // ── Sparse-data fallback: fetch from Weird Gloop API ──────────────
            // If very few items have multi-day history, pull from the API so
            // sparklines can render immediately after install / cache clear.
            //
            // Why an absolute threshold (not a ratio): `bulkInsert` writes a
            // today-snapshot for every price record, so after a full market scan
            // *all* ~7 000 items have ≥1 history row — but only items with
            // dedicated history fetches (seeds + prior fallback runs) have ≥2.
            // A percentage-based check against 7 000 items would never be
            // satisfied and the fallback would re-fetch on every startup.
            //
            // Threshold of 400 means: after seeds (~230 items) + one fallback
            // round (200 items) the condition is met and subsequent startups
            // skip the ~40 s API call.
            // Capped at 200 items since the API only accepts 1 item per request.
            const itemsWithSufficient = [...grouped.values()] // items with ≥2 non-today rows
                .filter((entries) => entries.length >= 2).length;
            const sparse = itemsWithSufficient < 400;
            if (!sparse) {
                console.log(`[MarketAnalyzer] History coverage OK: ${itemsWithSufficient} items have ≥ 2 days — skipping API fallback.`);
            }
            if (sparse) {
                // The /last90d API only supports 1 item per request, so cap the
                // fallback to keep UI responsive (~40 s at 200 ms/item).
                // Fetch items that are in the price cache but have no/sparse history.
                const allItems = await this.cache.getAll();
                const allNames = allItems.map((r) => r.name);
                // Prioritise items with 0–1 history rows.
                const needsHistory = allNames.filter((n) => (map.get(n)?.length ?? 0) < 2);
                const SPARSE_CAP = 200;
                const namesToFetch = needsHistory.length > SPARSE_CAP
                    ? needsHistory.slice(0, SPARSE_CAP)
                    : needsHistory;
                console.log(`[MarketAnalyzer] Local price history is sparse (only ${itemsWithSufficient} items have ≥ 2 days, need 400) ` +
                    `— fetching ${namesToFetch.length} items from Weird Gloop API…`);
                const apiMap = await this.fetchAPIHistory(namesToFetch, days);
                // Merge: API data fills in gaps; local data takes precedence when present.
                for (const [name, prices] of apiMap) {
                    if (!map.has(name) || (map.get(name).length < prices.length)) {
                        map.set(name, prices);
                    }
                }
            }
        }
        catch (err) {
            console.warn("[MarketAnalyzer] Could not build price history map.", err);
        }
        return map;
    }
    /**
     * Fetch historical prices from the Weird Gloop API and extract daily
     * closing prices for the last {@link days} days.
     *
     * Delegates to {@link WeirdGloopService.fetchHistoricalPrices} which sends
     * individual per-item requests (the `/last90d` endpoint only supports 1
     * item) with rate-limit-safe pauses.  Results are also persisted to
     * IndexedDB so subsequent calls hit the cache instead.
     *
     * @param itemNames - Canonical RS3 item names.
     * @param days      - Number of recent days to extract from the 90-day window.
     * @returns A `Map<itemName, number[]>` of chronological daily prices.
     */
    // Individual per-item history via WeirdGloopService — March 2026
    async fetchAPIHistory(itemNames, days) {
        const result = new Map();
        const todayStr = new Date().toISOString().slice(0, 10);
        try {
            const api = new _weirdGloopService__WEBPACK_IMPORTED_MODULE_0__.WeirdGloopService();
            const historyMap = await api.fetchHistoricalPrices(itemNames, days);
            // Persist fetched data to IndexedDB for future use.
            if (historyMap.size > 0) {
                try {
                    await this.cache.bulkInsertHistory(historyMap);
                }
                catch { /* non-critical */ }
            }
            // Transform WeirdGloopHistoryEntry[] → number[] (daily prices).
            for (const [name, entries] of historyMap) {
                const dayMap = new Map();
                for (const e of entries) {
                    const day = new Date(e.timestamp).toISOString().slice(0, 10);
                    if (day === todayStr)
                        continue;
                    dayMap.set(day, e.price);
                }
                const sorted = [...dayMap.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1));
                if (sorted.length > 0) {
                    result.set(name, sorted.map((d) => d[1]));
                }
            }
        }
        catch (err) {
            console.warn("[MarketAnalyzer] fetchAPIHistory failed:", err);
        }
        console.log(`[MarketAnalyzer] API history fetched for ${result.size} items.`);
        return result;
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
// Cached intermediate maps with TTL – March 2026
/** TTL for cached volume/price maps (10 minutes). */
MarketAnalyzerService.MAP_CACHE_TTL_MS = 10 * 60 * 1000;


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
     * Tax is rounded DOWN per item per official wiki mechanics (exempt ≤50 gp).
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
        const taxPerItem = (actualSellPrice <= 50) ? 0 : Math.floor(actualSellPrice * 0.02);
        const netSellPerItem = actualSellPrice - taxPerItem;
        const realizedProfit = (netSellPerItem * active.quantity) - (active.buyPrice * active.quantity);
        // Temporary debug log for tax verification — remove after testing.
        console.log(`[PortfolioService] completeFlip: taxPerItem=${taxPerItem}, netSellPerItem=${netSellPerItem}`);
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
        defaultModel: "llama-3.1-8b-instant",
        keyPlaceholder: "gsk_…",
        models: [
            { id: "llama-3.1-8b-instant", label: "Llama 3.1 8B Instant", recommended: true },
            { id: "llama-3.3-70b-versatile", label: "Llama 3.3 70B Versatile" },
            { id: "openai/gpt-oss-20b", label: "GPT-OSS 20B" },
            { id: "openai/gpt-oss-120b", label: "GPT-OSS 120B" },
            { id: "meta-llama/llama-4-scout-17b-16e-instruct", label: "Llama 4 Scout 17B (Preview)" },
            { id: "qwen/qwen3-32b", label: "Qwen3 32B (Preview)" },
        ],
        costTier: "free",
        costNote: "Generous free tier — no credit card required",
        signupUrl: "https://console.groq.com/keys",
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
        costTier: "paid",
        costNote: "Pay-as-you-go — requires billing setup",
        signupUrl: "https://platform.openai.com/api-keys",
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
        costTier: "free-tier",
        costNote: "Free tier for select models — credit for paid models",
        signupUrl: "https://openrouter.ai/keys",
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
        costTier: "free-tier",
        costNote: "Free tier with $5 credit on signup",
        signupUrl: "https://api.together.xyz/settings/api-keys",
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
        costTier: "low-cost",
        costNote: "Pay-as-you-go — competitively priced",
        signupUrl: "https://console.mistral.ai/api-keys",
    },
    {
        id: "custom",
        label: "Custom / Self-hosted",
        endpoint: "",
        defaultModel: "",
        keyPlaceholder: "(optional for local models)",
        models: [],
        costTier: "self-hosted",
        costNote: "Run your own model locally — no API cost",
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
        // Execute batches sequentially to stay within API rate limits.
        const consolidated = new Map();
        for (let idx = 0; idx < batches.length; idx++) {
            try {
                const json = await this.fetchBatch(batches[idx], idx);
                for (const [name, record] of Object.entries(json)) {
                    consolidated.set(name, record);
                }
            }
            catch (err) {
                console.error("[WeirdGloopService] Batch failed:", err);
            }
            // Brief pause between batches to avoid rate-limiting.
            if (idx < batches.length - 1) {
                await WeirdGloopService.sleep(300);
            }
        }
        console.log(`[WeirdGloopService] Successfully fetched ${consolidated.size} / ${itemNames.length} price records.`);
        return consolidated;
    }
    /**
     * Fetch up to 90 days of historical daily prices for every item in
     * {@link itemNames}.  The `/last90d` endpoint only accepts **one item per
     * request**, so items are dispatched individually with
     * {@link HISTORY_ITEM_DELAY_MS} pauses between requests.
     *
     * Individual failures are logged but do **not** reject the returned
     * promise — successfully fetched histories are always returned.
     *
     * @param itemNames - Canonical RS3 item names.
     * @param days      - Number of recent days to extract from the 90-day
     *                    window (default 30).  Pass 90 to keep the full range.
     * @returns A `Map<itemName, WeirdGloopHistoryEntry[]>` of chronological
     *          daily snapshots, filtered to the requested window.
     */
    async fetchHistoricalPrices(itemNames, days = 30) {
        if (itemNames.length === 0)
            return new Map();
        // The /last90d endpoint only supports 1 item per request — individual
        // fetches with pacing to respect rate limits.
        const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
        const result = new Map();
        let skippedNotFound = 0; // API returned {success:false} or {error:…}
        let skippedNoData = 0; // Response OK but no matching array for name
        let skippedEmpty = 0; // Array present but all entries outside date range
        let skippedRetry = 0; // All retries exhausted (null response)
        console.log(`[WeirdGloopService] Fetching last90d history for ${itemNames.length} item(s) ` +
            `(keeping last ${days} days)…`);
        for (let idx = 0; idx < itemNames.length; idx++) {
            const name = itemNames[idx];
            const url = `https://api.weirdgloop.org/exchange/history/rs/last90d?name=${encodeURIComponent(name)}`;
            try {
                const resp = await WeirdGloopService.fetchWithRetry(url);
                if (!resp) {
                    skippedRetry++;
                    console.warn(`[WeirdGloopService] History for "${name}" — all retries exhausted.`);
                    continue;
                }
                const json = await resp.json();
                // Detect API-level error responses (e.g. "Item(s) not found",
                // stealth rate limits) that return 200 OK with an error body.
                if (json.success === false || json.error) {
                    skippedNotFound++;
                    continue;
                }
                // Exact key lookup; fall back to case-insensitive search in case
                // the API returns a slightly different casing than requested.
                let entries = json[name];
                if (!Array.isArray(entries)) {
                    const lc = name.toLowerCase();
                    for (const key of Object.keys(json)) {
                        if (key.toLowerCase() === lc && Array.isArray(json[key])) {
                            entries = json[key];
                            break;
                        }
                    }
                }
                if (!Array.isArray(entries)) {
                    skippedNoData++;
                    continue;
                }
                const filtered = entries
                    .filter((e) => e.timestamp >= cutoff)
                    .sort((a, b) => a.timestamp - b.timestamp);
                if (filtered.length > 0) {
                    result.set(name, filtered);
                }
                else {
                    skippedEmpty++;
                }
            }
            catch (err) {
                console.error(`[WeirdGloopService] History for "${name}" failed:`, err);
            }
            // Pause between requests to stay under rate limit.
            if (idx < itemNames.length - 1) {
                await WeirdGloopService.sleep(WeirdGloopService.HISTORY_ITEM_DELAY_MS);
            }
            // Log progress every 50 items.
            if ((idx + 1) % 50 === 0) {
                console.log(`[WeirdGloopService] History progress: ${idx + 1}/${itemNames.length} ` +
                    `(${result.size} fetched so far)…`);
            }
        }
        console.log(`[WeirdGloopService] Historical data fetched for ${result.size} / ${itemNames.length} items.`);
        if (skippedNotFound + skippedNoData + skippedEmpty + skippedRetry > 0) {
            console.log(`[WeirdGloopService] Skipped: ${skippedNotFound} not-found, ${skippedNoData} no-data, ` +
                `${skippedEmpty} empty-after-filter, ${skippedRetry} retry-exhausted.`);
        }
        return result;
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
        const response = await WeirdGloopService.fetchWithRetry(url);
        if (!response) {
            throw new Error(`[WeirdGloopService] Batch ${batchIdx}: all retries exhausted`);
        }
        const json = await response.json();
        console.debug(`[WeirdGloopService] Batch ${batchIdx}: received ${Object.keys(json).length} records.`);
        return json;
    }
    // ─── Rate-Limit Helpers ───────────────────────────────────────────────
    /**
     * Fetch a URL with automatic retry + exponential backoff on 429 and
     * transient network errors.  Returns `null` when all retries are
     * exhausted so callers can degrade gracefully.
     *
     * @param url        - Fully-qualified URL to request.
     * @param maxRetries - Override for {@link MAX_RETRIES}.
     * @returns The successful `Response`, or `null` after all attempts fail.
     */
    static async fetchWithRetry(url, maxRetries = WeirdGloopService.MAX_RETRIES) {
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                const resp = await fetch(url, {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                    },
                });
                if (resp.ok)
                    return resp;
                // Rate-limited — back off and retry.
                if (resp.status === 429) {
                    const delay = WeirdGloopService.BACKOFF_BASE_MS * Math.pow(2, attempt);
                    console.warn(`[WeirdGloopService] 429 rate-limited (attempt ${attempt + 1}/${maxRetries + 1}). ` +
                        `Waiting ${(delay / 1000).toFixed(1)}s before retry…`);
                    await WeirdGloopService.sleep(delay);
                    continue;
                }
                // Non-retryable HTTP error.
                console.error(`[WeirdGloopService] HTTP ${resp.status} for ${url.slice(0, 120)}`);
                return null;
            }
            catch (err) {
                // Network / CORS error — often accompanies a 429 that the browser
                // blocks before we even see the status.  Treat it as retryable.
                const delay = WeirdGloopService.BACKOFF_BASE_MS * Math.pow(2, attempt);
                console.warn(`[WeirdGloopService] Network error (attempt ${attempt + 1}/${maxRetries + 1}). ` +
                    `Waiting ${(delay / 1000).toFixed(1)}s… [${err.message}]`);
                await WeirdGloopService.sleep(delay);
            }
        }
        console.error(`[WeirdGloopService] All ${maxRetries + 1} attempts failed for ${url.slice(0, 120)}`);
        return null;
    }
    /** Promise-based sleep helper. */
    static sleep(ms) {
        return new Promise((r) => setTimeout(r, ms));
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
/** Maximum retry attempts on 429 / transient errors. */
WeirdGloopService.MAX_RETRIES = 4;
/** Base delay (ms) for exponential backoff — doubled on each retry. */
WeirdGloopService.BACKOFF_BASE_MS = 2000;
/** Pause (ms) between sequential individual history requests. */
WeirdGloopService.HISTORY_ITEM_DELAY_MS = 200;


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
 * Client for the official RuneScape 3 Wiki structured-data APIs.
 *
 * Responsibilities:
 *  - Fetch GE buy limits in bulk from `Module:Exchange/<Item>` Lua sources.
 *  - Fetch High Alchemy values in bulk from `Module:GEHighAlchs/data.json`
 *    (single request for all alchable items, with per-item fallback).
 *
 * Guide / article text fetching has been removed — the curated
 * `coreKnowledge.ts` rules provide better, flipping-focused context for
 * the LLM than raw wiki prose.
 *
 * Uses only the native browser `fetch` API — no external dependencies.
 *
 * @see https://runescape.wiki/api.php (MediaWiki API sandbox)
 * @see https://runescape.wiki/w/Module:GEHighAlchs/data.json?action=raw
 */
/**
 * Service that retrieves structured item data (buy limits, high alch values)
 * from the official RuneScape 3 Wiki.
 *
 * High Alch values are fetched from the `Module:GEHighAlchs/data.json` bulk
 * endpoint in a single HTTP request. Items present in the response are
 * alchable (value = number); items absent are explicitly not alchable
 * (value = `false`). Falls back to per-item `Module:Exchange/<Item>` Lua
 * source parsing when the bulk endpoint is unreachable.
 *
 * @example
 * ```ts
 * const wiki = new WikiService();
 * const limits = await wiki.getBulkBuyLimits(["Blood rune", "Elder logs"]);
 * const alchs = await wiki.getBulkHighAlchValues(["Blood rune", "Elder logs"]);
 * ```
 */
class WikiService {
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
            headers: { Accept: "application/json" },
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
     * Fetch High Alchemy values for the given items.
     *
     * **Primary source**: the `Module:GEHighAlchs/data.json` bulk endpoint
     * (single HTTP request for every alchable item in the game).  Items
     * present in the response are alchable (value = number); items absent
     * are explicitly not alchable (value = `false`).
     *
     * **Fallback**: per-item `Module:Exchange/<Item>` Lua source parsing,
     * used only when the bulk endpoint is unreachable.  In fallback mode,
     * items that cannot be resolved remain absent from the map (no `false`).
     *
     * @param itemNames - Canonical RS3 item names.
     * @returns A `Map<string, number | false>` keyed by item name.
     */
    async getBulkHighAlchValues(itemNames) {
        if (itemNames.length === 0)
            return new Map();
        // ── Try the single-request bulk endpoint first ─────────────────────
        try {
            const bulkData = await this.fetchAllHighAlchValues();
            const result = new Map();
            for (const name of itemNames) {
                const val = bulkData.get(name);
                if (val !== undefined) {
                    result.set(name, val); // alchable — has a value
                }
                else {
                    result.set(name, false); // not in the bulk list → not alchable
                }
            }
            console.log(`[WikiService] Bulk alch endpoint: ${result.size} items resolved ` +
                `(${[...result.values()].filter(v => typeof v === "number").length} alchable, ` +
                `${[...result.values()].filter(v => v === false).length} not alchable).`);
            return result;
        }
        catch (bulkErr) {
            console.warn("[WikiService] Bulk alch endpoint failed — falling back to per-item Module:Exchange.", bulkErr);
        }
        // ── Fallback: per-item Module:Exchange parsing ─────────────────────
        const batches = this.chunkArray(itemNames, WikiService.EXCHANGE_BATCH_SIZE);
        console.log(`[WikiService] Fetching alch values for ${itemNames.length} items in ${batches.length} batch(es) (fallback)…`);
        const settled = await Promise.allSettled(batches.map((batch, idx) => this.fetchAlchValueBatch(batch, idx)));
        const combined = new Map();
        for (const result of settled) {
            if (result.status === "fulfilled") {
                for (const [name, val] of result.value) {
                    combined.set(name, val);
                }
            }
            else {
                console.warn("[WikiService] Alch-value batch failed:", result.reason);
            }
        }
        console.log(`[WikiService] Resolved alch values for ${combined.size} / ${itemNames.length} items (fallback).`);
        return combined;
    }
    /**
     * Fetch the complete `Module:GEHighAlchs/data.json` bulk endpoint.
     * Returns a map of **every alchable item** in the game → its High Alch
     * value in gp.  Items not present in this map are not alchable.
     *
     * The endpoint returns a flat JSON object with two metadata keys
     * (`%LAST_UPDATE%`, `%LAST_UPDATE_F%`) that are stripped from the result.
     *
     * @returns Map of canonical item name → High Alch value (gp).
     * @throws If the network request fails or the response is not valid JSON.
     */
    async fetchAllHighAlchValues() {
        console.log("[WikiService] Fetching bulk High Alch data from GEHighAlchs module…");
        const response = await fetch(WikiService.HIGH_ALCH_BULK_URL, {
            method: "GET",
            headers: { Accept: "application/json" },
        });
        if (!response.ok) {
            throw new Error(`[WikiService] GEHighAlchs HTTP ${response.status} ${response.statusText}`);
        }
        const json = await response.json();
        const map = new Map();
        for (const [key, value] of Object.entries(json)) {
            // Skip metadata keys (prefixed with %)
            if (key.startsWith("%"))
                continue;
            if (typeof value === "number" && value > 0) {
                map.set(key, value);
            }
        }
        console.log(`[WikiService] Bulk alch data: ${map.size} alchable items loaded.`);
        return map;
    }
    /**
     * Fetch a single batch of high alchemy values from `Module:Exchange/<Item>` Lua sources.
     *
     * @param batch - Subset of item names.
     * @param idx   - Batch index for logging.
     * @returns Map of canonical item name → high alchemy value.
     */
    async fetchAlchValueBatch(batch, idx) {
        const titles = batch
            .map((n) => `Module:Exchange/${n.replace(/ /g, "_")}`)
            .join("|");
        const url = `https://runescape.wiki/api.php?action=query&prop=revisions` +
            `&rvprop=content&rvslots=main&format=json&origin=*` +
            `&titles=${encodeURIComponent(titles)}`;
        const response = await fetch(url, {
            method: "GET",
            headers: { Accept: "application/json" },
        });
        if (!response.ok) {
            throw new Error(`[WikiService] Exchange-module HTTP ${response.status} (alch batch ${idx + 1}).`);
        }
        const json = await response.json();
        const map = new Map();
        const pages = json?.query?.pages;
        if (!pages)
            return map;
        for (const page of Object.values(pages)) {
            if (!page.title || page.missing !== undefined)
                continue;
            const itemName = page.title.replace(/^Module:Exchange\//, "");
            const luaSrc = page.revisions?.[0]?.slots?.main?.["*"] ?? "";
            // Skip items explicitly marked as non-alchable
            if (WikiService.ALCHABLE_FALSE_RE.test(luaSrc))
                continue;
            // Prefer explicit alchvalue if present
            const alchMatch = WikiService.ALCH_RE.exec(luaSrc);
            if (alchMatch) {
                const val = Number(alchMatch[1]);
                if (val > 0)
                    map.set(itemName, val);
                continue;
            }
            // Fallback: compute High Alch from base value (High Alch = floor(value × 0.6))
            const valueMatch = WikiService.VALUE_RE.exec(luaSrc);
            if (valueMatch) {
                const highAlch = Math.floor(Number(valueMatch[1]) * 0.6);
                if (highAlch > 0)
                    map.set(itemName, highAlch);
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
}
/**
 * Bulk endpoint URL that returns all alchable items and their High Alch
 * values as a flat `{ itemName: number }` JSON object.
 */
WikiService.HIGH_ALCH_BULK_URL = "https://runescape.wiki/w/Module:GEHighAlchs/data.json?action=raw";
// ─── Bulk Buy Limits (Module:Exchange) ──────────────────────────────
/**
 * Maximum titles per MediaWiki `action=query` request.
 * The API allows up to 50 titles for anonymous (non-bot) callers.
 */
WikiService.EXCHANGE_BATCH_SIZE = 50;
/** Regex that extracts the `limit = <number>` value from a Lua module source. */
WikiService.LIMIT_RE = /limit\s*=\s*(\d+)/;
/** Regex that extracts the `alchvalue = <number>` value from a Lua module source. */
WikiService.ALCH_RE = /alchvalue\s*=\s*(\d+)/;
/** Regex that extracts the `value = <number>` (base item value) from a Lua module source. */
WikiService.VALUE_RE = /\bvalue\s*=\s*(\d+)/;
/** Regex that detects `alchable = false` — items that cannot be alched. */
WikiService.ALCHABLE_FALSE_RE = /alchable\s*=\s*false/i;


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
/** RS3 item sprite base URL (official Jagex endpoint). */
const SPRITE_BASE = "https://secure.runescape.com/m=itemdb_rs/obj_sprite.gif?id=";
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
/** Maximum number of messages (user + assistant) persisted to localStorage. */
const MAX_SAVED_MESSAGES = 50;
/** GE buy-limit window duration in milliseconds (4 hours). */
const BUY_LIMIT_WINDOW_MS = 4 * 60 * 60 * 1000;
/** Portfolio countdown refresh interval in milliseconds (every 30 s). */
const PORTFOLIO_TICK_MS = 30000;
/**
 * Legacy colorway values mapped to the new mode+colorway system.
 * Used for one-time migration of persisted settings.
 */
const LEGACY_COLORWAY_MAP = {
    classic: { mode: "dark", colorway: "default" },
    osrs: { mode: "dark", colorway: "classic" },
    "rs3-modern": { mode: "dark", colorway: "rs3-modern" },
    light: { mode: "light", colorway: "default" },
    "sol-dark": { mode: "dark", colorway: "solarized" },
    "sol-light": { mode: "light", colorway: "solarized" },
};
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
    "High Alch": "High Alch",
    "30d EMA": "30d EMA",
    "Daily Volatility": "Daily Volatility",
    "LR Slope": "LR Slope",
    "Predicted Price": "Predicted Price",
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
    "High Alch": "High Alchemy value in gp \u2014 used as the sell-price floor to prevent recommending sales below alch value.",
    "30d EMA": "30-day Exponential Moving Average. Price above EMA = bullish; below = bearish.",
    "Daily Volatility": "Standard deviation of daily percentage price changes. Higher \u2192 wider swings \u2192 more risk but potentially faster flips.",
    "LR Slope": "Linear-regression slope of the price series (gp per day). Positive = upward drift, negative = declining.",
    "Predicted Price": "Next-day price predicted by linear regression of the historical price series.",
};
// ─── Favorites helpers ──────────────────────────────────────────────────────
/**
 * Load the persisted favourites list, auto-migrating from the legacy
 * `string[]` format to `FavoriteItem[]` on first access.
 */
function loadFavorites() {
    try {
        const raw = localStorage.getItem(LS_FAVORITES);
        if (!raw)
            return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed))
            return [];
        // Legacy format: plain string array → migrate to FavoriteItem[].
        if (parsed.length > 0 && typeof parsed[0] === "string") {
            const migrated = parsed.map((name) => ({ name }));
            localStorage.setItem(LS_FAVORITES, JSON.stringify(migrated));
            return migrated;
        }
        return parsed;
    }
    catch {
        return [];
    }
}
/** Persist the favourites list. */
function saveFavorites(favs) {
    localStorage.setItem(LS_FAVORITES, JSON.stringify(favs));
}
/** Return the Set of favourited item names from localStorage. */
function getFavorites() {
    return new Set(loadFavorites().map((f) => f.name));
}
/** Toggle an item's favourite status and persist the result. Returns the new state. */
function toggleFavorite(name) {
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
function getFavoriteAlerts(name) {
    return loadFavorites().find((f) => f.name === name);
}
/**
 * Update the price-alert thresholds for a favourited item.
 * Creates the favourite entry if it doesn't already exist.
 */
function setFavoriteAlerts(name, targetBuy, targetSell) {
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
// ─── Completed-flips sort state ─────────────────────────────────────────────
let completedFlipsSortCol = "date";
let completedFlipsSortAsc = false; // default descending (newest first)
// ─── Shared service instances (initialised once) ────────────────────────────
let cache;
let analyzer;
let wiki;
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
let latestTopItems = [];
/** The latest search results, cached for re-sorting without re-fetching. */
let latestSearchResults = [];
/** Currently active view mode for the market panel. */
let currentView = "list";
/** Whether compact-tiles mode is enabled (hides predictive badges in tile/hybrid view). */
let compactMode = false;
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
async function initUI(onStatus) {
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
    cache = new _services__WEBPACK_IMPORTED_MODULE_0__.CacheService();
    await cache.open();
    analyzer = new _services__WEBPACK_IMPORTED_MODULE_0__.MarketAnalyzerService(cache);
    wiki = new _services__WEBPACK_IMPORTED_MODULE_0__.WikiService();
    portfolio = new _services__WEBPACK_IMPORTED_MODULE_0__.PortfolioService();
    // Run the initial market analysis and render.
    onStatus?.("Ranking top items\u2026", "Step 2 of 4");
    try {
        await refreshMarketPanel();
    }
    catch (err) {
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
        geCatalogue = await (0,_services__WEBPACK_IMPORTED_MODULE_0__.fetchGECatalogue)();
    }
    catch (err) {
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
function costTierBadge(tier) {
    switch (tier) {
        case "free": return "\u2705 FREE";
        case "free-tier": return "\u{1F193} Free Tier";
        case "low-cost": return "\uD83D\uDCB2 Low Cost";
        case "paid": return "\uD83D\uDCB3 Paid";
        case "self-hosted": return "\uD83D\uDDA5\uFE0F Self-hosted";
        default: return "";
    }
}
/**
 * Populate the provider `<select>` element from the {@link LLM_PROVIDERS}
 * preset array, annotating each option with its cost tier badge.
 */
function populateProviderDropdown() {
    els.providerSelect.innerHTML = "";
    for (const p of _services__WEBPACK_IMPORTED_MODULE_0__.LLM_PROVIDERS) {
        const opt = document.createElement("option");
        opt.value = p.id;
        const badge = costTierBadge(p.costTier);
        opt.textContent = badge ? `${p.label}  ${badge}` : p.label;
        if (p.id === "groq")
            opt.textContent += " \u2B50 Recommended";
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
 * placeholder text, custom endpoint visibility, model datalist, model placeholder,
 * cost tier hint, and setup guide button visibility.
 */
function applyProviderUI(provider) {
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
function populateModelDatalist(provider) {
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
let setupGuideModal = null;
/**
 * Provider-specific setup instructions.  Keyed by provider ID.
 * Each entry has numbered steps and an optional note.
 */
const SETUP_GUIDES = {
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
function ensureSetupGuideModal() {
    if (setupGuideModal)
        return setupGuideModal;
    const backdrop = document.createElement("div");
    backdrop.className = "setup-guide-backdrop";
    backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop)
            backdrop.classList.remove("visible");
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
function showSetupGuide() {
    const provider = getProviderById(els.providerSelect.value);
    const backdrop = ensureSetupGuideModal();
    const modal = backdrop.querySelector(".setup-guide-modal");
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
    }
    else {
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
    for (const p of _services__WEBPACK_IMPORTED_MODULE_0__.LLM_PROVIDERS) {
        if (p.id === "custom")
            continue;
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
    // Setup guide button.
    els.setupGuideBtn.addEventListener("click", showSetupGuide);
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
// ─── Full Market Background Scan ────────────────────────────────────────────
/** Abort controller for an in-progress background scan. */
let scanAbortController = null;
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
function bindFullMarketScan() {
    // ── Restore persisted deep-history preference ──
    const savedDeep = localStorage.getItem(LS_DEEP_HISTORY) === "true";
    els.deepHistoryCheckbox.checked = savedDeep;
    // ── Persist + warn on checkbox toggle ──
    els.deepHistoryCheckbox.addEventListener("change", () => {
        const checked = els.deepHistoryCheckbox.checked;
        localStorage.setItem(LS_DEEP_HISTORY, String(checked));
        if (checked && !deepHistoryWarned) {
            deepHistoryWarned = true;
            showToast("Deep history enabled \u2014 full scans may take 3\u201310 minutes depending on connection.", "info", 8000);
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
                geCatalogue = await (0,_services__WEBPACK_IMPORTED_MODULE_0__.fetchGECatalogue)();
            }
            catch {
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
            await (0,_services__WEBPACK_IMPORTED_MODULE_0__.runFullMarketScan)(geCatalogue, (done, total) => {
                const pct = Math.round((done / total) * 100);
                els.syncProgressFill.style.width = pct + "%";
                els.syncProgressText.textContent =
                    `Scanning ${done.toLocaleString("en-US")} / ${total.toLocaleString("en-US")}\u2026 (${pct}%)${deepLabel}`;
            }, scanAbortController.signal, deepHistory);
            // Scan complete — refresh the market panel with the full dataset.
            cache = new _services__WEBPACK_IMPORTED_MODULE_0__.CacheService();
            await cache.open();
            analyzer = new _services__WEBPACK_IMPORTED_MODULE_0__.MarketAnalyzerService(cache);
            await refreshMarketPanel();
            els.syncProgressFill.style.width = "100%";
            els.syncProgressText.textContent = "Full market scan complete \u2714";
            setTimeout(() => els.syncProgress.classList.add("hidden"), 4000);
        }
        catch (err) {
            console.error("[UIService] Full market scan error:", err);
            els.syncProgressText.textContent = "Scan failed \u2014 see console.";
            setTimeout(() => els.syncProgress.classList.add("hidden"), 5000);
        }
        finally {
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
function bindLayoutToggle() {
    const saved = localStorage.getItem(LS_LAYOUT) ?? "tabbed";
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
function bindTheme() {
    migrateThemeKey();
    migrateColorwayToMode();
    migrateColorwayRename();
    const savedMode = localStorage.getItem(LS_MODE) ?? "dark";
    const savedStyle = localStorage.getItem(LS_STYLE) ?? "basic";
    const savedColorway = localStorage.getItem(LS_COLORWAY) ?? "default";
    const savedContrast = localStorage.getItem(LS_CONTRAST) ?? "default";
    // Batch all four dataset writes — only one style recalc on init
    applyThemeBatch(savedMode, savedStyle, savedColorway, savedContrast);
    // Mode toggle buttons
    els.modeDarkBtn.addEventListener("click", () => applyMode("dark"));
    els.modeLightBtn.addEventListener("click", () => applyMode("light"));
    els.styleSelect.addEventListener("change", () => {
        applyStyle(els.styleSelect.value);
    });
    els.colorwaySelect.addEventListener("change", () => {
        applyColorway(els.colorwaySelect.value);
    });
    els.contrastSelect.addEventListener("change", () => {
        applyContrast(els.contrastSelect.value);
    });
}
/**
 * Migrate from the legacy single `ge-analyzer:theme` key to the new
 * multi-axis keys. Runs once — removes the old key after migration.
 */
function migrateThemeKey() {
    const legacy = localStorage.getItem(LS_THEME);
    if (!legacy)
        return;
    const STYLE_MAP = {
        classic: "basic", osrs: "basic", "rs3-modern": "basic",
        glass: "glass", neumorphism: "neumorphism", minimalism: "basic", skeuomorphism: "skeuomorphism",
    };
    if (!localStorage.getItem(LS_STYLE)) {
        localStorage.setItem(LS_STYLE, STYLE_MAP[legacy] ?? "basic");
    }
    // Map legacy theme → mode + colorway (handled by migrateColorwayToMode next)
    if (!localStorage.getItem(LS_COLORWAY)) {
        const COLORWAY_TMP = {
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
function migrateColorwayToMode() {
    if (localStorage.getItem(LS_MODE))
        return; // already migrated
    const oldColorway = localStorage.getItem(LS_COLORWAY);
    if (!oldColorway)
        return;
    const mapping = LEGACY_COLORWAY_MAP[oldColorway];
    if (mapping) {
        localStorage.setItem(LS_MODE, mapping.mode);
        localStorage.setItem(LS_COLORWAY, mapping.colorway);
    }
    else {
        localStorage.setItem(LS_MODE, "dark");
    }
}
/**
 * One-time migration: renamed colorway values "classic" → "default", "osrs" → "classic".
 * Uses a flag key (`ge-analyzer:colorway-v2`) to run exactly once.
 */
function migrateColorwayRename() {
    if (localStorage.getItem("ge-analyzer:colorway-v2"))
        return;
    const RENAME_MAP = {
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
function forceStyleInvalidation() {
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
/** Apply an appearance mode (dark/light) and persist the choice. */
function applyMode(mode) {
    document.body.dataset.mode = mode;
    localStorage.setItem(LS_MODE, mode);
    els.modeDarkBtn.classList.toggle("active", mode === "dark");
    els.modeLightBtn.classList.toggle("active", mode === "light");
    forceStyleInvalidation();
}
/** Apply a style to the document and persist the choice. */
function applyStyle(style) {
    document.body.dataset.style = style;
    localStorage.setItem(LS_STYLE, style);
    els.styleSelect.value = style;
}
/** Apply a colorway to the document and persist the choice. */
function applyColorway(colorway) {
    document.body.dataset.colorway = colorway;
    localStorage.setItem(LS_COLORWAY, colorway);
    els.colorwaySelect.value = colorway;
    forceStyleInvalidation();
}
/** Apply a contrast level to the document and persist the choice. */
function applyContrast(contrast) {
    document.body.dataset.contrast = contrast;
    localStorage.setItem(LS_CONTRAST, contrast);
    els.contrastSelect.value = contrast;
    forceStyleInvalidation();
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
function applyThemeBatch(mode, style, colorway, contrast) {
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
// ─── Toast Notifications ────────────────────────────────────────────────────
/** Lazily-created toast container (fixed to top-right of viewport). */
let toastContainer = null;
/** Ensure the toast container exists in the DOM. */
function ensureToastContainer() {
    if (toastContainer)
        return toastContainer;
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
function showToast(message, type = "info", durationMs = 6000) {
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
const firedAlerts = new Set();
/**
 * Request browser notification permission once (no-ops after the first call).
 * Safe to call on every refresh — the browser only shows the prompt once.
 */
function requestNotificationPermission() {
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
        Notification.requestPermission().catch(() => { });
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
function checkPriceAlerts(items) {
    const favs = loadFavorites();
    if (favs.length === 0)
        return;
    // Build a quick lookup by name.
    const priceMap = new Map();
    for (const it of items)
        priceMap.set(it.name, it.price);
    for (const fav of favs) {
        const currentPrice = priceMap.get(fav.name);
        if (currentPrice == null)
            continue;
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
];
/**
 * Wire click handlers for the Export Data / Import Data buttons and the
 * hidden file `<input>`.
 */
function bindDataManagement() {
    // ── Export ──────────────────────────────────────────────────────────────
    els.exportDataBtn.addEventListener("click", () => {
        const payload = {};
        for (const key of EXPORT_KEYS) {
            const raw = localStorage.getItem(key);
            if (raw !== null) {
                try {
                    payload[key] = JSON.parse(raw);
                }
                catch {
                    payload[key] = raw;
                }
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
        if (!file)
            return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const data = JSON.parse(reader.result);
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
            }
            catch (err) {
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
        // Build broader LLM context asynchronously (top 200, no filters).
        // Non-blocking — chat uses whatever is ready; falls back to the
        // narrow summary until this completes.
        analyzer.getFormattedForLLM().then(ctx => { latestLLMContext = ctx; }).catch(() => { });
        // Check price alerts against ALL cached items (not just filtered top 20).
        try {
            const allItems = await analyzer.getTopItems({ topN: 99999, minVolume: 0 });
            checkPriceAlerts(allItems);
        }
        catch { /* non-critical — skip alerts on failure */ }
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
        config.maxVolume = 5000;
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
        els.searchResults.innerHTML = "";
        els.searchLoading.style.display = "none";
        await refreshMarketPanel();
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
    // Compact tiles toggle – reduces predictive badge clutter in grid view – March 2026
    compactMode = localStorage.getItem(LS_COMPACT_TILES) === "true";
    els.compactTilesToggle.checked = compactMode;
    els.compactTilesToggle.addEventListener("change", () => {
        compactMode = els.compactTilesToggle.checked;
        localStorage.setItem(LS_COMPACT_TILES, compactMode ? "true" : "false");
        // Re-render all market panels with the new compact preference.
        if (latestTopItems.length > 0)
            renderMarketItems(latestTopItems);
        if (analyzer)
            renderFavorites();
        if (latestSearchResults.length > 0)
            renderSearchResults(latestSearchResults);
    });
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
    // Re-render favourites in new view mode (guard: analyzer may not exist yet).
    if (analyzer)
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
 * Handles edge cases gracefully:
 * - **0 data points**: Renders a centred "No price history" placeholder.
 * - **1 data point**: Renders a single dot at the vertical midpoint.
 * - **≥ 2 data points**: Full sparkline.
 *
 * @param canvas - The target `<canvas>` DOM element.
 * @param data   - Array of numeric values in chronological order.
 */
function drawSparkline(canvas, data) {
    const ctx = canvas.getContext("2d");
    if (!ctx)
        return;
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
// ─── Graph Modal Chart Renderer ─────────────────────────────────────────────
/**
 * Abbreviate a gp value for axis labels (e.g. 1200 → "1.2K", 3400000 → "3.4M").
 */
function axisLabel(value) {
    const abs = Math.abs(value);
    const sign = value < 0 ? "-" : "";
    if (abs >= 1000000000)
        return `${sign}${(abs / 1000000000).toFixed(1)}B`;
    if (abs >= 1000000)
        return `${sign}${(abs / 1000000).toFixed(1)}M`;
    if (abs >= 1000)
        return `${sign}${(abs / 1000).toFixed(1)}K`;
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
function drawGraphChart(canvas, data) {
    const ctx = canvas.getContext("2d");
    if (!ctx)
        return;
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
    const tickValues = [];
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
    const toXY = (i) => ({
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
        if (i === 0)
            ctx.moveTo(p.x, p.y);
        else
            ctx.lineTo(p.x, p.y);
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
 * Uses the same card builder as the Top 20.
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
    // Price trend badge (only for Uptrend / Downtrend — skip Stable).
    if (item.priceTrend === "Downtrend") {
        const trendBadge = document.createElement("span");
        trendBadge.className = "trend-badge trend-downtrend";
        trendBadge.textContent = "\u26A0\uFE0F Crashing";
        trendBadge.title = "Price has dropped more than 5% over the last 7 days \u2014 potential falling knife.";
        flipWrap.appendChild(trendBadge);
    }
    else if (item.priceTrend === "Uptrend") {
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
    const popBuyInput = alertPopover.querySelector(".card-alert-buy");
    const popSellInput = alertPopover.querySelector(".card-alert-sell");
    if (existingAlert?.targetBuy)
        popBuyInput.value = String(existingAlert.targetBuy);
    if (existingAlert?.targetSell)
        popSellInput.value = String(existingAlert.targetSell);
    /** Persist inline alert values. Auto-favourites the item if thresholds are set. */
    const saveInlineAlerts = () => {
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
                if (el !== alertPopover)
                    el.classList.remove("open");
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
let itemModal = null;
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
    const alertBuyInput = mBody.querySelector("#modal-alert-buy");
    const alertSellInput = mBody.querySelector("#modal-alert-sell");
    // Pre-fill with existing alert thresholds (if any).
    const existing = getFavoriteAlerts(item.name);
    if (existing?.targetBuy)
        alertBuyInput.value = String(existing.targetBuy);
    if (existing?.targetSell)
        alertSellInput.value = String(existing.targetSell);
    /** Persist alert values on change. Auto-favourites the item if thresholds are set. */
    const saveAlertValues = () => {
        const buyVal = alertBuyInput.value ? Number(alertBuyInput.value) : undefined;
        const sellVal = alertSellInput.value ? Number(alertSellInput.value) : undefined;
        // Setting an alert implicitly favourites the item.
        if ((buyVal || sellVal) && !getFavorites().has(item.name)) {
            toggleFavorite(item.name);
            // Update the modal's favourite button.
            const favBtn = itemModal?.querySelector(".modal-fav-btn");
            if (favBtn)
                favBtn.textContent = "\u2605";
        }
        setFavoriteAlerts(item.name, buyVal, sellVal);
    };
    alertBuyInput.addEventListener("change", saveAlertValues);
    alertSellInput.addEventListener("change", saveAlertValues);
    backdrop.classList.add("visible");
}
/** Hide the floating item detail modal. */
function hideItemModal() {
    if (itemModal)
        itemModal.classList.remove("visible");
}
// \u2500\u2500\u2500 Graph Modal \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
/** Lazily-created singleton graph modal container. */
let graphModal = null;
/** Create (once) and return the reusable graph modal element. */
function ensureGraphModal() {
    if (graphModal)
        return graphModal;
    const backdrop = document.createElement("div");
    backdrop.className = "graph-modal-backdrop";
    backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop)
            hideGraphModal();
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
async function ensureItemHistory(itemName, days = 90) {
    // 1. Check the cache first.
    const cached = await cache.getHistoricalRecords(itemName, days);
    if (cached.length >= 7) {
        // Sufficient data already cached — return prices oldest-first.
        return cached.map((r) => r.price);
    }
    // 2. Cache is sparse or empty — fetch from API and persist.
    try {
        const api = new _services__WEBPACK_IMPORTED_MODULE_0__.WeirdGloopService();
        const historyMap = await api.fetchHistoricalPrices([itemName], days);
        if (historyMap.size > 0) {
            await cache.bulkInsertHistory(historyMap);
        }
        // 3. Re-read from cache (now populated) to get normalised records.
        const fresh = await cache.getHistoricalRecords(itemName, days);
        return fresh.map((r) => r.price);
    }
    catch (err) {
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
async function fetchItemHistory(name, range = 7) {
    // ensureItemHistory always fetches 90 days; we slice to the requested range afterward.
    const allPrices = await ensureItemHistory(name, 90);
    if (allPrices.length === 0)
        return [];
    // Client-side trim to requested range.
    if (range >= 90 || allPrices.length <= range)
        return allPrices;
    return allPrices.slice(-range);
}
/**
 * Refresh the graph modal chart with a new history range.
 * Called when the in-modal range dropdown changes.
 */
// Usability fix: on-demand history for graphs – March 2026
async function refreshItemGraph(item, range) {
    const backdrop = ensureGraphModal();
    const mBody = backdrop.querySelector("#graph-modal-body");
    // Show loading while fetching / checking cache.
    const canvas = mBody.querySelector(".graph-modal-canvas");
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
    let fetched;
    try {
        fetched = await fetchItemHistory(item.name, range);
    }
    catch {
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
    const statsEl = mBody.querySelector(".graph-stats");
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
    const statusEl = mBody.querySelector(".graph-history-status");
    if (hist.length < 7) {
        statusEl?.classList.add("visible");
        if (canvas)
            canvas.style.display = "none";
    }
    else {
        statusEl?.classList.remove("visible");
        if (canvas)
            canvas.style.display = "";
    }
    requestAnimationFrame(() => {
        if (canvas && hist.length >= 2)
            drawGraphChart(canvas, hist);
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
async function showGraphModal(item) {
    const backdrop = ensureGraphModal();
    const mHeader = backdrop.querySelector("#graph-modal-header");
    const mBody = backdrop.querySelector("#graph-modal-body");
    // Read the current range from the market-filters dropdown.
    const range = parseInt(els.historyRangeSelect.value, 10) || 7;
    // \u2500\u2500 Header \u2500\u2500
    const closeBtn = mHeader.querySelector(".item-modal-close");
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
        if (loadingEl)
            loadingEl.textContent = "Fetching price history\u2026";
    }
    let fetched;
    try {
        fetched = await fetchItemHistory(item.name, range);
    }
    catch {
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
    const rangeOptions = [7, 30, 90].map((d) => `<option value="${d}"${d === range ? " selected" : ""}>History: ${d} days</option>`).join("");
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
    const inlineRange = mBody.querySelector(".graph-range-inline");
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
        const canvas = mBody.querySelector(".graph-modal-canvas");
        if (canvas && !insufficientData)
            drawGraphChart(canvas, hist);
    });
}
// Manual history refresh fallback – March 2026
/**
 * Bind the “Refresh” button inside `.graph-history-status` so users can
 * manually fetch missing history for low-volume / post-scan items.
 */
function bindRefreshHistoryBtn(container, item) {
    const btn = container.querySelector(".refresh-history-btn");
    if (!btn)
        return;
    btn.addEventListener("click", async () => {
        btn.disabled = true;
        btn.textContent = "Fetching\u2026";
        try {
            const prices = await ensureItemHistory(item.name, 90);
            const range = parseInt((container.querySelector(".graph-range-inline")?.value) || "7", 10);
            const sliced = (range < 90 && prices.length > range) ? prices.slice(-range) : prices;
            const hist = sliced.length > 0 ? [...sliced, item.price] : [item.price];
            // Update canvas visibility & status strip.
            const canvas = container.querySelector(".graph-modal-canvas");
            const statusEl = container.querySelector(".graph-history-status");
            if (hist.length >= 7) {
                if (canvas) {
                    canvas.style.display = "";
                    drawGraphChart(canvas, hist);
                }
                statusEl?.classList.remove("visible");
            }
            else {
                // Still insufficient — draw what we have but keep the status.
                if (canvas) {
                    canvas.style.display = "";
                    drawGraphChart(canvas, hist);
                }
                btn.textContent = "Refresh";
                btn.disabled = false;
            }
            // Refresh stats as well.
            refreshItemGraph(item, range);
        }
        catch {
            showToast("Failed to load history", "info");
            btn.textContent = "Refresh";
            btn.disabled = false;
        }
    });
}
/** Hide the graph modal. */
function hideGraphModal() {
    if (graphModal)
        graphModal.classList.remove("visible");
}
// ─── Unified Analytics Modal – combines details + graph – March 2026 ────────
/** Lazily-created singleton analytics modal container. */
let analyticsModal = null;
/** Create (once) and return the reusable analytics modal backdrop + shell. */
function ensureAnalyticsModal() {
    if (analyticsModal)
        return analyticsModal;
    const backdrop = document.createElement("div");
    backdrop.className = "analytics-modal-backdrop";
    backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop)
            hideAnalyticsModal();
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
function hideAnalyticsModal() {
    if (analyticsModal)
        analyticsModal.classList.remove("visible");
}
/**
 * Show the unified analytics modal for a given item.
 * Combines item details (badges, recommendations, alert setup, actions) with
 * the interactive price-history chart and trend stats — all in one scrollable
 * overlay.
 *
 * @param item - The ranked item to display.
 */
async function showAnalyticsModal(item) {
    const backdrop = ensureAnalyticsModal();
    const modal = backdrop.querySelector("#analytics-modal");
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
    const velocityClsMap = {
        "Insta-Flip": "velocity-insta",
        "Active": "velocity-active",
        "Slow": "velocity-slow",
        "Very Slow": "velocity-veryslow",
    };
    const velocityTipMap = {
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
            [7, 30, 90].map((d) => `<option value="${d}"${d === range ? " selected" : ""}>History: ${d} days</option>`).join("") +
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
    const alertBuyInput = alertSection.querySelector("#analytics-alert-buy");
    const alertSellInput = alertSection.querySelector("#analytics-alert-sell");
    const existing = getFavoriteAlerts(item.name);
    if (existing?.targetBuy)
        alertBuyInput.value = String(existing.targetBuy);
    if (existing?.targetSell)
        alertSellInput.value = String(existing.targetSell);
    const saveAlertValues = () => {
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
    const loadingEl = graphSection.querySelector(".graph-loading-msg");
    if (cachedCount < 7 && loadingEl) {
        loadingEl.textContent = "Fetching price history\u2026";
    }
    let fetched;
    try {
        fetched = await fetchItemHistory(item.name, range);
    }
    catch {
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
            [7, 30, 90].map((d) => `<option value="${d}"${d === range ? " selected" : ""}>History: ${d} days</option>`).join("") +
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
    const inlineRange = graphSection.querySelector(".graph-range-inline");
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
        const canvas = graphSection.querySelector(".graph-modal-canvas");
        if (canvas && !insufficientData)
            drawGraphChart(canvas, hist);
    });
}
/**
 * Refresh the analytics modal graph section with a new range.
 * Called when the in-modal range dropdown changes.
 */
async function refreshAnalyticsGraph(item, graphSection, range) {
    const canvas = graphSection.querySelector(".graph-modal-canvas");
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
    let fetched;
    try {
        fetched = await fetchItemHistory(item.name, range);
    }
    catch {
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
    const statusEl = graphSection.querySelector(".graph-history-status");
    if (hist.length < 7) {
        statusEl?.classList.add("visible");
        if (canvas)
            canvas.style.display = "none";
    }
    else {
        statusEl?.classList.remove("visible");
        if (canvas)
            canvas.style.display = "";
    }
    requestAnimationFrame(() => {
        if (canvas && hist.length >= 2)
            drawGraphChart(canvas, hist);
    });
}
/**
 * Bind the "Refresh" button in the analytics modal's graph section.
 */
function bindAnalyticsRefreshBtn(graphSection, item) {
    const btn = graphSection.querySelector(".refresh-history-btn");
    if (!btn)
        return;
    btn.addEventListener("click", async () => {
        btn.disabled = true;
        btn.textContent = "Fetching\u2026";
        try {
            const prices = await ensureItemHistory(item.name, 90);
            const range = parseInt((graphSection.querySelector(".graph-range-inline")?.value) || "7", 10);
            const sliced = (range < 90 && prices.length > range) ? prices.slice(-range) : prices;
            const hist = sliced.length > 0 ? [...sliced, item.price] : [item.price];
            const canvas = graphSection.querySelector(".graph-modal-canvas");
            const statusEl = graphSection.querySelector(".graph-history-status");
            if (hist.length >= 7) {
                if (canvas) {
                    canvas.style.display = "";
                    drawGraphChart(canvas, hist);
                }
                statusEl?.classList.remove("visible");
            }
            else {
                if (canvas) {
                    canvas.style.display = "";
                    drawGraphChart(canvas, hist);
                }
                btn.textContent = "Refresh";
                btn.disabled = false;
            }
            refreshAnalyticsGraph(item, graphSection, range);
        }
        catch {
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
        const service = ensureLLMService();
        const advice = await service.generateAdvice(query, latestLLMContext || latestMarketSummary);
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
 * Render the completed-flips list as a sortable <table> and the stats dashboard header.
 * Supports column sort (click headers) and text filtering.
 */
// Usability enhancement – March 2026
function renderCompletedFlips() {
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
    const columns = [
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
            }
            else {
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
function renderPortfolioStats() {
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
function bindCompletedFlipsFilter() {
    els.completedFlipsFilter.addEventListener("input", () => {
        renderCompletedFlips();
    });
}
/**
 * Generate a CSV string from all completed flips and trigger a download.
 */
// Usability enhancement – March 2026
function exportCompletedFlipsCsv() {
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
function bindCsvExport() {
    els.exportCsvBtn.addEventListener("click", exportCompletedFlipsCsv);
}
/**
 * Build a single completed-flip card DOM element.
 * @deprecated Replaced by table-based rendering in {@link renderCompletedFlips}.
 */
function _buildCompletedFlipCard(flip) {
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
        providerCostHint: q("provider-cost-hint"),
        setupGuideBtn: q("setup-guide-btn"),
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
        fullMarketScanBtn: q("full-market-scan-btn"),
        deepHistoryCheckbox: q("deep-history-checkbox"),
        syncProgress: q("background-sync-progress"),
        syncProgressFill: q("sync-progress-fill"),
        syncProgressText: q("sync-progress-text"),
        marketLoading: q("market-loading"),
        marketItems: q("market-items"),
        errorBanner: q("error-banner"),
        errorBannerMsg: q("error-banner-msg"),
        errorRetryBtn: q("error-retry-btn"),
        viewListBtn: q("view-list-btn"),
        viewTileBtn: q("view-tile-btn"),
        viewHybridBtn: q("view-hybrid-btn"),
        compactTilesToggle: q("compact-tiles-toggle"),
        top20CollapseBtn: q("top20-collapse-btn"),
        chatHistory: q("chat-history"),
        chatInput: q("chat-input"),
        chatSendBtn: q("chat-send-btn"),
        clearChatBtn: q("clear-chat-btn"),
        forceReloadBtn: q("force-reload-btn"),
        reloadStatus: q("reload-status"),
        layoutTabbedBtn: q("layout-tabbed-btn"),
        layoutSidebarBtn: q("layout-sidebar-btn"),
        styleSelect: q("style-select"),
        colorwaySelect: q("colorway-select"),
        modeDarkBtn: q("mode-dark-btn"),
        modeLightBtn: q("mode-light-btn"),
        contrastSelect: q("contrast-select"),
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
        exportDataBtn: q("export-data-btn"),
        importDataBtn: q("import-data-btn"),
        importFileInput: q("import-file-input"),
        historyRangeSelect: q("history-range-select"),
        completedFlipsFilter: q("completed-flips-filter"),
        exportCsvBtn: q("export-csv-btn"),
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
/* harmony import */ var _css_main_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./css/main.css */ "./css/main.css");
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


// ── Stylesheet (Webpack css-loader resolves @imports → style-loader injects) ─

// ── Early theme restoration ─────────────────────────────────────────────────
// Theme attributes (data-mode, data-style, data-colorway, data-contrast) are
// now set by an inline <script> in index.html that runs BEFORE the webpack
// bundle loads. This ensures body[data-mode="light"][data-colorway="..."]
// selectors match on the *first* style computation (when style-loader injects
// CSS), preventing Chrome from caching stale dark :root values.
//
// The IIFE that was here previously ran too late — style-loader had already
// injected CSS and Chrome had already computed/cached dark :root defaults.
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
// Startup loading overlay – March 2026
const startupOverlay = document.getElementById("startup-overlay");
const startupStatus = document.getElementById("startup-status");
/** Update the startup overlay status text. */
function setStartupStatus(msg, step) {
    if (startupStatus) {
        startupStatus.innerHTML = step
            ? `${msg}<br><span style="font-size:10px;opacity:0.6">${step}</span>`
            : msg;
    }
}
/** Fade out and remove the startup overlay. */
function dismissOverlay() {
    if (!startupOverlay)
        return;
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
        await (0,_services__WEBPACK_IMPORTED_MODULE_0__.initDataPipeline)();
        // Step 2 — Wire services → DOM and render the interface.
        await (0,_uiService__WEBPACK_IMPORTED_MODULE_1__.initUI)((msg, step) => setStartupStatus(msg, step));
        console.log("[GE Analyzer] Startup complete.");
        dismissOverlay();
    }
    catch (err) {
        console.error("[GE Analyzer] Startup failed:", err);
        setStartupStatus("Startup failed \u2014 see console for details.");
        alt1Status?.insertAdjacentHTML("beforeend", `<div style="color:#f44747;margin-top:4px">Startup error \u2014 see console.</div>`);
    }
})();

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});