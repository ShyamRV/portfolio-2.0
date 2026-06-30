/**
 * Retrieval — implemented in MILESTONE 3 (Part 6.3).
 *
 * Embed the query, cosine-similarity search via the hnsw index, top-k (k=5 to
 * start), return only those chunks + their source_url for grounding.
 */

export type RetrievedChunk = {
  chunkText: string;
  sourceUrl: string;
  similarity: number;
};

export async function retrieve(
  _query: string,
  _k = 5,
): Promise<RetrievedChunk[]> {
  throw new Error("Not implemented (Milestone 3)");
}
