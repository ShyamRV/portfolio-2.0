/**
 * Gemini call wrapper (Milestone 3). Uses the free-tier Flash model via the
 * REST API (no SDK dependency). Returns the generated text, or throws a typed
 * error the route can map to a graceful response.
 */

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

export class GeminiQuotaError extends Error {}
export class GeminiError extends Error {}

export async function generateGrounded(
  systemInstruction: string,
  userContent: string,
): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new GeminiError("GEMINI_API_KEY not set");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

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

  // 429 = free-tier quota exhausted → caller degrades gracefully.
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
