import { createHash } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Embedding pipeline (Milestone 3, Part 6).
 *
 * ONE free embedding model for the whole corpus: all-MiniLM-L6-v2 (384 dims),
 * via the Hugging Face free Inference API (no per-token cost, no card).
 * Never mix models — cosine similarity across mixed spaces is meaningless.
 *
 * Re-embedding is incremental: each chunk is keyed by a content hash, and we
 * only embed chunks whose hash is not already in the embeddings table.
 */

export const EMBEDDING_DIM = 384;
export const EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2";
const HF_URL = `https://router.huggingface.co/hf-inference/models/${EMBEDDING_MODEL}/pipeline/feature-extraction`;

export type Chunk = {
  text: string;
  sourceUrl: string;
  contentItemId?: string | null;
  projectId?: string | null;
};

/** sha256 of the chunk text — the incremental re-embed key (Part 6.2). */
export function hashChunk(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

/** Rough token estimate (words * 1.3) — good enough for chunk sizing. */
function approxTokens(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.ceil(words * 1.3);
}

/**
 * Chunk at paragraph boundaries (NOT fixed character counts), targeting
 * ~300–500 tokens per chunk (Part 6.1). Oversized single paragraphs are kept
 * whole rather than split mid-sentence.
 */
export function chunkText(input: string, maxTokens = 500, targetTokens = 400): string[] {
  const paragraphs = input
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  let current = "";

  for (const para of paragraphs) {
    const candidate = current ? `${current}\n\n${para}` : para;
    if (approxTokens(candidate) > maxTokens && current) {
      chunks.push(current);
      current = para;
    } else {
      current = candidate;
      if (approxTokens(current) >= targetTokens) {
        chunks.push(current);
        current = "";
      }
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

/** Embed a batch of texts via the free HF Inference API. Retries on cold start. */
export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];
  const token = process.env.HUGGINGFACE_API_KEY;
  if (!token) throw new Error("HUGGINGFACE_API_KEY not set (free embeddings)");

  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(HF_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: texts, options: { wait_for_model: true } }),
    });

    if (res.status === 503) {
      // Model loading (cold start) — back off and retry.
      await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
      continue;
    }
    if (!res.ok) {
      throw new Error(`HF embedding failed: ${res.status} ${res.statusText}`);
    }

    const data = (await res.json()) as number[][] | number[];
    const vectors = Array.isArray(data[0]) ? (data as number[][]) : [data as number[]];
    for (const v of vectors) {
      if (v.length !== EMBEDDING_DIM) {
        throw new Error(
          `Embedding dim ${v.length} != expected ${EMBEDDING_DIM}. Wrong model?`,
        );
      }
    }
    return vectors;
  }
  throw new Error("HF embedding failed after retries (model cold start)");
}

export async function embedQuery(text: string): Promise<number[]> {
  const [vec] = await embedTexts([text]);
  if (!vec) throw new Error("Empty embedding for query");
  return vec;
}

type SourceRow = {
  text: string;
  url: string;
  contentItemId?: string | null;
  projectId?: string | null;
};

/**
 * Incrementally (re)embed recent corpus content. Bounded per call so it fits
 * the Vercel Hobby function timeout (chunked, not a full re-embed every run).
 * Only chunks with a new content hash are embedded.
 */
export async function reembedRecent(
  supabase: SupabaseClient,
  maxChunks = 40,
): Promise<{ embedded: number; skipped: number }> {
  const sources: SourceRow[] = [];

  const { data: items } = await supabase
    .from("content_items")
    .select("id, title, description, url")
    .order("updated_at", { ascending: false })
    .limit(50);
  for (const it of items ?? []) {
    const body = [it.title, it.description].filter(Boolean).join("\n\n");
    if (body) sources.push({ text: body, url: it.url, contentItemId: it.id });
  }

  const { data: projects } = await supabase
    .from("projects")
    .select("id, slug, title, summary, problem_statement, architecture_notes");
  for (const p of projects ?? []) {
    const body = [p.title, p.summary, p.problem_statement, p.architecture_notes]
      .filter(Boolean)
      .join("\n\n");
    if (body) {
      sources.push({
        text: body,
        url: `/work/${p.slug}`,
        projectId: p.id,
      });
    }
  }

  let embedded = 0;
  let skipped = 0;
  const pending: { chunk: Chunk; hash: string }[] = [];

  for (const src of sources) {
    for (const text of chunkText(src.text)) {
      const hash = hashChunk(text);
      const { count } = await supabase
        .from("embeddings")
        .select("id", { head: true, count: "exact" })
        .eq("content_hash", hash);
      if (typeof count === "number" && count > 0) {
        skipped++;
        continue;
      }
      pending.push({
        chunk: {
          text,
          sourceUrl: src.url,
          contentItemId: src.contentItemId ?? null,
          projectId: src.projectId ?? null,
        },
        hash,
      });
      if (pending.length >= maxChunks) break;
    }
    if (pending.length >= maxChunks) break;
  }

  if (pending.length === 0) return { embedded, skipped };

  const vectors = await embedTexts(pending.map((p) => p.chunk.text));
  const rows = pending.map((p, i) => ({
    content_item_id: p.chunk.contentItemId,
    project_id: p.chunk.projectId,
    chunk_text: p.chunk.text,
    embedding: vectors[i],
    source_url: p.chunk.sourceUrl,
    content_hash: p.hash,
  }));

  const { error } = await supabase
    .from("embeddings")
    .upsert(rows, { onConflict: "content_hash" });
  if (error) throw error;
  embedded = rows.length;

  return { embedded, skipped };
}
