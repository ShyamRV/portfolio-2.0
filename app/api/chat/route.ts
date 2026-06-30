import { NextResponse } from "next/server";

/**
 * AI assistant endpoint — implemented in MILESTONE 3.
 *
 * Will enforce (per Part 6 / Part 1 rule 9):
 *  - retrieval-grounded answers with real source_url citations, or an explicit
 *    "I don't have information on that"
 *  - prompt-injection defense (retrieved text treated as data, never instructions)
 *  - per-session token-bucket rate limiting sized to the live Gemini free-tier quota
 *  - graceful "at capacity" degradation when the free quota is exhausted
 *
 * Returns 501 until Milestone 3 to avoid shipping an ungrounded endpoint.
 */
export async function POST() {
  return NextResponse.json(
    { error: "AI assistant not implemented yet (Milestone 3)." },
    { status: 501 },
  );
}
