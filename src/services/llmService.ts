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
import { RS3_ECONOMIC_RULES } from "./coreKnowledge";

/** Sensible defaults — Groq free tier with `llama3-8b-8192`. */
const DEFAULTS: LLMConfig = {
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
   * @param wikiText   - Concatenated plain-text wiki guide extracts
   *                     (may be empty if no guides were found).
   * @returns The assistant's generated advice text.
   * @throws {LLMRequestError} On HTTP-level failures (401, 429, 5xx, etc.).
   */
  async generateAdvice(
    query: string,
    marketData: string,
    wikiText: string
  ): Promise<string> {
    const userMsg = this.buildUserMessage(query, marketData, wikiText);
    this._messages.push({ role: "user", content: userMsg });

    console.log(
      `[LLMService] Sending ${this._messages.length} messages to ${this.model} at ${this.endpoint}…`
    );

    const body: ChatCompletionRequest = {
      model: this.model,
      messages: [...this._messages],
      temperature: this.temperature,
      max_tokens: this.maxTokens,
    };

    const headers: Record<string, string> = {
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
   *  - Defines the persona (RS3 Grand Exchange instructor).
   *  - Mandates exclusive use of the provided data and wiki text.
   *  - Forbids inventing prices, volumes, or game mechanics.
   *  - Instructs clear, concise formatting suitable for an Alt1 overlay.
   *
   * @returns The system prompt string.
   */
  private buildSystemMessage(): string {
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
      "9. Analyze the '30d Trend Slope' and 'Volatility' metrics provided for each item. A positive slope indicates an upward price trend; a negative slope signals decline. Volatility above 10% signals high risk.",
      "10. When recommending or discussing an item, explicitly mention whether its linear slope is positive or negative and whether its volatility is high (>10%) or low. Use these to justify your buy/sell/hold advice.",
      "",
      "The following RS3 economic laws are ABSOLUTE. They supersede any conflicting outside knowledge you may have. Apply them to every calculation.",
      "",
      RS3_ECONOMIC_RULES,
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
  private buildUserMessage(
    query: string,
    marketData: string,
    wikiText: string
  ): string {
    const wikiSection =
      wikiText.trim().length > 0
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
      case 429:
        hint = "Rate limited — you have exceeded the API quota. Wait and retry.";
        break;
      default:
        hint = status >= 500
          ? "Server error on the LLM provider side. Try again later."
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
