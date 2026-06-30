-- =============================================================================
-- Portfolio 2.0 — initial schema (Part 4 of the build spec)
-- Postgres + pgvector (Supabase free tier). Embedding dim = 384 to match the
-- chosen FREE model (all-MiniLM-L6-v2) — NOT 1536 (that was an OpenAI size).
-- =============================================================================

create extension if not exists vector;

-- Singleton profile/resume record ------------------------------------------------
create table if not exists profile (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  tagline text,
  bio text,
  resume_json jsonb,
  social_links jsonb,
  updated_at timestamptz default now()
);

-- Curated, hand-authored projects ------------------------------------------------
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  summary text,
  problem_statement text,
  architecture_notes text,
  tech_stack text[],
  impact_metrics jsonb,      -- only real, sourced metrics — omit rather than estimate
  demo_url text,
  repo_url text,
  status text check (status in ('active','archived','wip')) default 'active',
  featured boolean default false,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Normalized feed of everything auto-synced from external platforms --------------
create table if not exists content_items (
  id uuid primary key default gen_random_uuid(),
  source_type text not null check (source_type in
    ('github','youtube','devto','hashnode','medium','huggingface','pypi','npm','orcid','scholar','manual')),
  title text not null,
  description text,
  url text not null,
  tags text[],
  published_at timestamptz,
  raw_payload jsonb,
  last_synced_at timestamptz,
  sync_status text check (sync_status in ('success','partial','failed')) default 'success',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Vector store -------------------------------------------------------------------
-- NOTE: vector dimension MUST match the chosen free embedding model exactly.
create table if not exists embeddings (
  id uuid primary key default gen_random_uuid(),
  content_item_id uuid references content_items(id) on delete cascade,
  project_id uuid references projects(id) on delete cascade,
  chunk_text text not null,
  embedding vector(384),
  source_url text not null,
  created_at timestamptz default now()
);

create index if not exists embeddings_hnsw_idx
  on embeddings using hnsw (embedding vector_cosine_ops);

-- Sync observability (also records the Supabase keepalive — Part 3) ---------------
create table if not exists sync_logs (
  id uuid primary key default gen_random_uuid(),
  source_type text not null,
  started_at timestamptz not null,
  finished_at timestamptz,
  status text check (status in ('success','partial','failed')),
  items_synced int default 0,
  error_message text
);

create table if not exists ai_query_logs (
  id uuid primary key default gen_random_uuid(),
  session_id text,
  query_text text,
  answer_text text,
  cited_sources jsonb,
  was_grounded boolean,
  created_at timestamptz default now()
);

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz default now()
);
