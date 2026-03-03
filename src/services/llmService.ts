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

import type {
  ChatCompletionRequest,
  ChatCompletionResponse,
  ChatMessage,
  LLMConfig,
} from "./types";
import { RS3_ECONOMIC_RULES, DATA_FIELD_LEGEND } from "./coreKnowledge";

/** Sensible defaults — Groq free tier with `llama-3.1-8b-instant`. */
const DEFAULTS: LLMConfig = {
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
const DATA_BLOCK_RE =
  /=== GRAND EXCHANGE DATA ===[\s\S]*?(?==== PLAYER QUESTION ===)/;

/**
 * Maximum JSON body size (in bytes) we allow before truncating context.
 * Groq's gateway returns HTTP 413 above ~100 KB, but free-tier limits
 * vary by model.  50 KB provides a safe margin for all models.
 */
const MAX_BODY_BYTES = 50_000;

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
export class LLMService {
  private readonly endpoint: string;
  private readonly model: string;
  private readonly apiKey: string;
  private readonly temperature: number;
  private readonly maxTokens: number;

  /** Running conversation history sent with every request. */
  private _messages: ChatMessage[] = [];

  /**
   * @param config - All fields have sensible defaults targeting Groq's free tier.
   *                 For hosted providers, `apiKey` is required. For self-hosted
   *                 models the key may be omitted.
   */
  constructor(config: Partial<LLMConfig> = {}) {
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
  get messages(): readonly ChatMessage[] {
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
  loadHistory(saved: ChatMessage[]): void {
    if (saved.length === 0 || saved[0].role !== "system") {
      this._messages = [
        { role: "system", content: this.buildSystemMessage() },
        ...saved,
      ];
    } else {
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
  clearHistory(): void {
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
  async generateAdvice(
    query: string,
    marketData: string,
  ): Promise<string> {
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

    let body: ChatCompletionRequest = {
      model: this.model,
      messages: trimmed,
      temperature: this.temperature,
      max_completion_tokens: this.maxTokens,
    };

    // Measure initial payload size.
    let jsonBody = JSON.stringify(body);
    const encoder = new TextEncoder();
    let byteLen = encoder.encode(jsonBody).length;

    console.log(
      `[LLMService] Sending ${trimmed.length} messages ` +
        `(${this._messages.length} in full history) — ` +
        `${(byteLen / 1024).toFixed(1)} KB payload — ` +
        `model: ${this.model}`
    );

    // Guard against oversized payloads.
    // Strategy: first halve market-data lines (up to 4×), then halve wiki
    // text (up to 4×).  This two-phase approach trims the two largest
    // variable-size sections progressively.
    if (byteLen > MAX_BODY_BYTES) {
      console.warn(
        `[LLMService] Payload too large (${(byteLen / 1024).toFixed(1)} KB > ` +
          `${(MAX_BODY_BYTES / 1024).toFixed(0)} KB limit). Truncating…`
      );
      const lastUserIdx = this.findLastUserIdx(trimmed);
      if (lastUserIdx >= 0) {
        let truncated = trimmed;

        // Phase 1: halve market data.
        for (let attempt = 0; attempt < 4 && byteLen > MAX_BODY_BYTES; attempt++) {
          truncated = this.halveMarketData(truncated, lastUserIdx);
          body = { ...body, messages: truncated };
          jsonBody = JSON.stringify(body);
          byteLen = encoder.encode(jsonBody).length;
          console.log(
            `[LLMService]   Market-data trim ${attempt + 1}: ${(byteLen / 1024).toFixed(1)} KB`
          );
        }

      }
    }

    const headers: Record<string, string> = {
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

    const json: ChatCompletionResponse = await response.json();

    const reply = json.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      this._messages.pop();
      throw new LLMRequestError(
        "LLM returned an empty or malformed response.",
        0,
        JSON.stringify(json)
      );
    }

    // Append the assistant's reply to the running history.
    this._messages.push({ role: "assistant", content: reply });

    if (json.usage) {
      console.debug(
        `[LLMService] Token usage — prompt: ${json.usage.prompt_tokens}, ` +
          `completion: ${json.usage.completion_tokens}, ` +
          `total: ${json.usage.total_tokens}.`
      );
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
  private buildSystemMessage(): string {
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
      RS3_ECONOMIC_RULES,
      "",
      DATA_FIELD_LEGEND,
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
  private buildUserMessage(
    query: string,
    marketData: string,
  ): string {
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
  private buildTrimmedHistory(): ChatMessage[] {
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

    const trimmed: ChatMessage[] = [system];

    for (let i = 0; i < rest.length; i++) {
      const msg = rest[i];
      if (msg.role === "user" && i !== lastUserIdx) {
        // Strip data blocks, keep only the question portion.
        const stripped = msg.content.replace(DATA_BLOCK_RE, "").trim();
        trimmed.push({ role: "user", content: stripped });
      } else {
        trimmed.push(msg);
      }
    }

    return trimmed;
  }

  /**
   * Find the index of the last user message in a `ChatMessage[]`.
   * @returns Index, or -1 if none.
   */
  private findLastUserIdx(messages: ChatMessage[]): number {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "user") return i;
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
  private halveMarketData(
    messages: ChatMessage[],
    idx: number
  ): ChatMessage[] {
    const msg = messages[idx];
    const dataStart = msg.content.indexOf("=== GRAND EXCHANGE DATA ===");
    const questionStart = msg.content.indexOf("\n=== PLAYER QUESTION ===");

    if (dataStart < 0 || questionStart < 0) return messages; // safety

    const dataBlock = msg.content.slice(
      dataStart + "=== GRAND EXCHANGE DATA ===".length + 1,
      questionStart
    );
    const lines = dataBlock.split("\n");
    const half = lines.slice(0, Math.max(Math.ceil(lines.length / 2), 5));

    const newContent =
      msg.content.slice(0, dataStart + "=== GRAND EXCHANGE DATA ===".length + 1) +
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
  private async handleHttpError(response: Response): Promise<never> {
    let bodyText: string;
    try {
      bodyText = await response.text();
    } catch {
      bodyText = "[unable to read response body]";
    }

    const status = response.status;
    let hint: string;

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

    throw new LLMRequestError(
      `[LLMService] ${hint} (HTTP ${status} ${response.statusText})`,
      status,
      bodyText
    );
  }
}

// ─── Custom Error Class ─────────────────────────────────────────────────────

/**
 * Typed error thrown by {@link LLMService} on HTTP or response-parsing failures.
 * Carries the HTTP status code and raw response body for upstream diagnostics.
 */
export class LLMRequestError extends Error {
  /** HTTP status code (0 if the failure was not HTTP-related). */
  readonly status: number;
  /** Raw response body text for debugging. */
  readonly responseBody: string;

  constructor(message: string, status: number, responseBody: string) {
    super(message);
    this.name = "LLMRequestError";
    this.status = status;
    this.responseBody = responseBody;
  }
}
