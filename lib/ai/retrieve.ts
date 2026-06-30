import { createServiceClient } from "@/lib/supabase/client";
import { embedQuery } from "./embed";

/**
 * Retrieval (Milestone 3, Part 6.3): embed the query, cosine-similarity search
 * via the hnsw index (match_embeddings RPC), return top-k chunks + source_url.
 */

export type RetrievedChunk = {
  chunkText: string;
  sourceUrl: string;
  similarity: number;
};

/** Below this cosine similarity, a chunk is treated as irrelevant (ungrounded). */
export const MIN_SIMILARITY = 0.3;

export async function retrieve(
  query: string,
  k = 5,
): Promise<RetrievedChunk[]> {
  const supabase = createServiceClient();
  const embedding = await embedQuery(query);

  const { data, error } = await supabase.rpc("match_embeddings", {
    query_embedding: embedding,
    match_count: k,
  });
  if (error) throw error;

  return ((data as Array<{
    chunk_text: string;
    source_url: string;
    similarity: number;
  }>) ?? []).map((r) => ({
    chunkText: r.chunk_text,
    sourceUrl: r.source_url,
    similarity: r.similarity,
  }));
}

/** Keep only chunks above the relevance floor (Part 6.3 / grounding gate). */
export function filterRelevant(chunks: RetrievedChunk[]): RetrievedChunk[] {
  return chunks.filter((c) => c.similarity >= MIN_SIMILARITY);
}
