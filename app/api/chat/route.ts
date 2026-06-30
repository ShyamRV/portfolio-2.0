import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/client";
import { retrieve, filterRelevant } from "@/lib/ai/retrieve";
import { buildPrompt, REFUSAL } from "@/lib/ai/prompt";
import { checkRateLimit } from "@/lib/ai/rate-limit";
import { generateGrounded, GeminiQuotaError } from "@/lib/ai/gemini";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const BodySchema = z.object({
  message: z.string().trim().min(1).max(1000),
  sessionId: z.string().trim().min(1).max(100),
});

const AT_CAPACITY =
  "The assistant is at capacity right now. Please try again shortly.";

type Citation = { sourceUrl: string; similarity: number };

async function logQuery(
  supabase: ReturnType<typeof createServiceClient>,
  fields: {
    sessionId: string;
    query: string;
    answer: string;
    citations: Citation[];
    grounded: boolean;
  },
) {
  try {
    await supabase.from("ai_query_logs").insert({
      session_id: fields.sessionId,
      query_text: fields.query,
      answer_text: fields.answer,
      cited_sources: fields.citations,
      was_grounded: fields.grounded,
    });
  } catch {
    // logging is best-effort; never block the response
  }
}

export async function POST(request: Request) {
  let parsed;
  try {
    parsed = BodySchema.parse(await request.json());
  } catch {
    return NextResponse.json(
      { error: "Provide { message, sessionId }." },
      { status: 422 },
    );
  }
  const { message, sessionId } = parsed;

  let supabase: ReturnType<typeof createServiceClient>;
  try {
    supabase = createServiceClient();
  } catch {
    return NextResponse.json(
      { answer: AT_CAPACITY, citations: [], grounded: false, atCapacity: true },
      { status: 200 },
    );
  }

  // 1) Rate limit BEFORE any model/embedding call (Part 6.6).
  const gate = await checkRateLimit(sessionId, supabase);
  if (!gate.allowed) {
    return NextResponse.json(
      { answer: AT_CAPACITY, citations: [], grounded: false, atCapacity: true },
      { status: 200 },
    );
  }

  // 2) Retrieve grounding context.
  let relevant: Awaited<ReturnType<typeof retrieve>> = [];
  try {
    relevant = filterRelevant(await retrieve(message, 5));
  } catch {
    // Retrieval/embeddings unavailable → degrade gracefully, do not error out.
    await logQuery(supabase, {
      sessionId,
      query: message,
      answer: REFUSAL,
      citations: [],
      grounded: false,
    });
    return NextResponse.json(
      { answer: REFUSAL, citations: [], grounded: false },
      { status: 200 },
    );
  }

  const citations: Citation[] = relevant.map((c) => ({
    sourceUrl: c.sourceUrl,
    similarity: Number(c.similarity.toFixed(3)),
  }));

  // 3) No relevant context → explicit refusal, WITHOUT spending model quota.
  const { systemInstruction, userContent, grounded } = buildPrompt(
    message,
    relevant,
  );
  if (!grounded) {
    await logQuery(supabase, {
      sessionId,
      query: message,
      answer: REFUSAL,
      citations: [],
      grounded: false,
    });
    return NextResponse.json(
      { answer: REFUSAL, citations: [], grounded: false },
      { status: 200 },
    );
  }

  // 4) Grounded generation.
  try {
    const answer = await generateGrounded(systemInstruction, userContent);
    await logQuery(supabase, {
      sessionId,
      query: message,
      answer,
      citations,
      grounded: true,
    });
    return NextResponse.json({ answer, citations, grounded: true });
  } catch (err) {
    const atCapacity = err instanceof GeminiQuotaError;
    const answer = atCapacity ? AT_CAPACITY : REFUSAL;
    await logQuery(supabase, {
      sessionId,
      query: message,
      answer,
      citations: atCapacity ? [] : citations,
      grounded: false,
    });
    return NextResponse.json(
      { answer, citations: [], grounded: false, atCapacity },
      { status: 200 },
    );
  }
}
