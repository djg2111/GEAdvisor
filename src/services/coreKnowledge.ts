/**
 * @module coreKnowledge
 * Static knowledge base of RS3 economic mechanics injected into every LLM
 * system prompt.  These rules are non-negotiable and supersede any outside
 * knowledge the model may have been trained on.
 */

/** Foundational RS3 economic rules the LLM must internalise before answering. */
export const RS3_ECONOMIC_RULES = `\
=== RS3 ECONOMIC LAWS (STRICT ADHERENCE REQUIRED) ===

1. GE TAX: All items sold on the Grand Exchange are subject to a 2% tax (floor(price × 0.02)) subtracted from the seller's proceeds. Items traded for ≤50 gp are exempt. You MUST deduct 2% from gross revenue before calculating profit or ROI.

2. BUY LIMITS: Every item has a 4-hour buy limit — a hard cap on how many a player can purchase via the GE per 4-hour window. The limit resets exactly 4 hours after the first purchase of that window. A player has 6 buy-limit windows per 24 hours. Never recommend quantities exceeding an item's buy limit per window.

3. MARGIN CHECKING: To find the current spread, a player:
   a. Places an "insta-buy" at +5% above mid-price to discover the lowest active sell offer.
   b. Places an "insta-sell" at −5% below mid-price to discover the highest active buy offer.
   The margin = insta-buy price − insta-sell price − floor(insta-buy price × 0.02).
   This is the true per-item profit AFTER tax.

4. HIGH ALCHEMY: High Alchemy converts an item to gold: floor(item base value × 0.6). This value acts as a hard price floor — if GE price < alch value, players buy and alch for guaranteed profit, pushing the price back up. Always mention alch value when relevant.

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

8. COMMON PITFALLS TO WARN ABOUT:
   - Items with < 500 gp price are risky because the tax gap eats most of the margin.
   - A trend slope of ±0.0 with 0.0% volatility usually means insufficient price history data — do NOT call this "stable" or "risky"; instead note that historical data is limited.
   - Volume spikes can indicate merch clans manipulating the price — advise caution.
   - DXP weekend announcements cause skilling supply prices to spike days/weeks before the event.`;

/**
 * Legend explaining each data field in the formatted market summary.
 * Included in the system prompt so the LLM can correctly interpret the data.
 */
export const DATA_FIELD_LEGEND = `\
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
• ⚠ RISKY — flagged when item price is < 500 gp (tax gap erodes margins).
• 🔥 N.Nx Vol Spike — today's volume is N.N× the 7-day average. May indicate a surge or manipulation.`;
