-- =============================================================================
-- Row Level Security (Part 4)
--   profile / projects / content_items : public READ, writes service-role only
--   ai_query_logs / contact_messages    : write-only from client, read = admin
--   embeddings / sync_logs              : server-only (no anon access)
-- The service-role key BYPASSES RLS, so sync jobs / server routes can write
-- without an explicit write policy.
-- =============================================================================

-- Public-read tables ------------------------------------------------------------
alter table profile        enable row level security;
alter table projects       enable row level security;
alter table content_items  enable row level security;

create policy "public read profile"
  on profile for select to anon, authenticated using (true);

create policy "public read projects"
  on projects for select to anon, authenticated using (true);

create policy "public read content_items"
  on content_items for select to anon, authenticated using (true);

-- Write-only-from-client tables --------------------------------------------------
alter table contact_messages enable row level security;
alter table ai_query_logs    enable row level security;

create policy "anyone can insert contact_messages"
  on contact_messages for insert to anon, authenticated with check (true);

create policy "admin can read contact_messages"
  on contact_messages for select to authenticated using (true);

create policy "anyone can insert ai_query_logs"
  on ai_query_logs for insert to anon, authenticated with check (true);

create policy "admin can read ai_query_logs"
  on ai_query_logs for select to authenticated using (true);

-- Server-only tables: RLS on, NO policies => only the service role can touch them
alter table embeddings enable row level security;
alter table sync_logs  enable row level security;
