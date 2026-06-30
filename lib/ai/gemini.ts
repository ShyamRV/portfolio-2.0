/**
 * LLM call wrapper for the grounded assistant.
 *
 * Provider is chosen automatically:
 *  - If an ASI:ONE key is set (ASI1_API_KEY / ASI_ONE_API_KEY) → ASI:ONE
 *    (Fetch.ai's agentic LLM, OpenAI-compatible Chat Completions API).
 *  - Otherwise → Google Gemini free-tier Flash via REST.
 *
 * Returns the generated text, or throws a typed error the route maps to a
 * graceful response. Quota/429s throw GeminiQuotaError (kept for the route's
 * existing `atCapacity` handling, regardless of provider).
 */

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const ASI_MODEL = process.env.ASI1_MODEL || "asi1-mini";
const ASI_BASE_URL = process.env.ASI1_BASE_URL || "https://api.asi1.ai/v1";

// Quota/at-capacity signal (name kept for backwards compatibility).
export class GeminiQuotaError extends Error {}
export class GeminiError extends Error {}

function asiKey(): string | undefined {
  return process.env.ASI1_API_KEY || process.env.ASI_ONE_API_KEY;
}

export async function generateGrounded(
  systemInstruction: string,
  userContent: string,
): Promise<string> {
  const asi = asiKey();
  if (asi) return generateWithAsi(asi, systemInstruction, userContent);
  return generateWithGemini(systemInstruction, userContent);
}

/** ASI:ONE (Fetch.ai) — OpenAI-compatible Chat Completions. */
async function generateWithAsi(
  key: string,
  systemInstruction: string,
  userContent: string,
): Promise<string> {
  const res = await fetch(`${ASI_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: ASI_MODEL,
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: userContent },
      ],
      temperature: 0.2,
      max_tokens: 1024,
      stream: false,
    }),
  });

  if (res.status === 429) {
    throw new GeminiQuotaError("ASI:ONE rate limit / quota reached");
  }
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new GeminiError(`ASI:ONE error ${res.status}: ${body.slice(0, 300)}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new GeminiError("Empty ASI:ONE response");
  return text;
}

/** Google Gemini free-tier Flash via REST. */
async function generateWithGemini(
  systemInstruction: string,
  userContent: string,
): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new GeminiError("No LLM key set (ASI1_API_KEY or GEMINI_API_KEY)");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": key,
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemInstruction }] },
      contents: [{ role: "user", parts: [{ text: userContent }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 1024 },
    }),
  });

  if (res.status === 429) {
    throw new GeminiQuotaError("Gemini free-tier quota exhausted");
  }
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new GeminiError(`Gemini error ${res.status}: ${body.slice(0, 300)}`);
  }

  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = data.candidates?.[0]?.content?.parts
    ?.map((p) => p.text ?? "")
    .join("")
    .trim();

  if (!text) throw new GeminiError("Empty Gemini response");
  return text;
}
