/**
 * @module coreKnowledge
 * Static knowledge base of RS3 economic mechanics injected into every LLM
 * system prompt.  These rules are non-negotiable and supersede any outside
 * knowledge the model may have been trained on.
 */

/** Foundational RS3 economic rules the LLM must internalise before answering. */
export const RS3_ECONOMIC_RULES = `\
=== RS3 ECONOMIC LAWS (STRICT ADHERENCE REQUIRED) ===
1. GE TAX: All items sold on the Grand Exchange are subject to a 2% tax (0.02) subtracted from the final sale price. You MUST deduct 2% from the gross revenue before calculating profit or Return on Investment (ROI). Items traded for 50 gp or less are exempt.
2. BUY LIMITS: Every item has a 4-hour buy limit. A player cannot physically buy more than this number within a 4-hour window. Your volume recommendations must never exceed an item's realistic buy limit.
3. MARGIN CHECKING: To find a margin, a player "insta-buys" an item (+20% price) to find the current lowest sell offer, then "insta-sells" (-20% price) to find the current highest buy offer. The gap between these, MINUS the 2% tax on the higher number, is the true profit margin.
4. HIGH ALCHEMY: The High Alchemy value of an item often acts as its absolute price floor. GP enters the game primarily through High Alchemy and monster drops.`;
