/**
 * @module coreKnowledge
 * Static knowledge base of RS3 economic mechanics injected into every LLM
 * system prompt. These rules are non-negotiable and supersede any outside
 * knowledge the model may have been trained on.
 */

/** Foundational RS3 economic rules the LLM must internalise before answering. */
export const RS3_ECONOMIC_RULES = `\
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
• ⚠ RISKY — flagged when item price is < 500-1,000 gp (tax gap erodes margins).
• 🔥 N.Nx Vol Spike — today's volume is N.N× the 7-day average. May indicate a surge or manipulation.
• Flags:
  - ⚠ LOW-PRICE: Price <500-1000 gp (tax eats margin).
  - 🔥 VOL SPIKE: Today's volume ≥1.5-2× 7-day avg (possible pump, dump, or event surge).
  - LIMITED-DATA or 0.0% vol + 0.0 slope: Insufficient history — treat trend as unreliable.`;