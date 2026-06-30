/**
 * Embedding pipeline — implemented in MILESTONE 3 (Part 6).
 *
 * Model: a single, consistent FREE embedding model for the entire corpus
 * (default plan: all-MiniLM-L6-v2, 384 dims). Never mix models — cosine
 * similarity across mixed embedding spaces is meaningless.
 *
 * Execution path (no per-token cost) is still pending the user's call:
 * Supabase Edge Function (recommended) vs Hugging Face free Inference API vs
 * precompute in a public-repo GitHub Action. Do NOT assume 1536 dims.
 */

export const EMBEDDING_DIM = 384;
export const EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2";

export type Chunk = {
  text: string;
  sourceUrl: string;
  contentItemId?: string;
  projectId?: string;
};

/** Chunk at paragraph boundaries, ~300–500 tokens (Part 6.1). */
export function chunkText(_input: string): string[] {
  throw new Error("Not implemented (Milestone 3)");
}

/** Embed only new/changed chunks, tracked by content hash (Part 6.2). */
export async function embedChunks(_chunks: Chunk[]): Promise<number[][]> {
  throw new Error("Not implemented (Milestone 3)");
}
