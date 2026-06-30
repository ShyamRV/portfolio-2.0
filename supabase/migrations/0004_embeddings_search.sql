-- =============================================================================
-- Milestone 3 — embeddings incremental key + similarity search RPC
-- =============================================================================

-- Incremental re-embed key (Part 6.2): only embed chunks with a new hash.
alter table embeddings
  add column if not exists content_hash text;

create unique index if not exists embeddings_content_hash_key
  on embeddings (content_hash);

-- Cosine similarity search over the hnsw index. SECURITY DEFINER so the public
-- anon role can call it for retrieval WITHOUT direct select access to the
-- embeddings table (which stays server-only under RLS). Returns only the
-- fields needed to ground + cite an answer.
create or replace function match_embeddings(
  query_embedding vector(384),
  match_count int default 5
)
returns table (
  chunk_text text,
  source_url text,
  similarity float
)
language sql
stable
security definer
set search_path = public
as $$
  select
    e.chunk_text,
    e.source_url,
    1 - (e.embedding <=> query_embedding) as similarity
  from embeddings e
  where e.embedding is not null
  order by e.embedding <=> query_embedding
  limit greatest(1, least(match_count, 20));
$$;

-- Allow the public/anon + authenticated roles to call the function only.
grant execute on function match_embeddings(vector, int) to anon, authenticated;
