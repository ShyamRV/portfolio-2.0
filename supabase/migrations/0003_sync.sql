-- =============================================================================
-- Milestone 2 — content pipeline support
-- =============================================================================

-- Dedup key for upserts: a content item is uniquely identified by its URL.
create unique index if not exists content_items_url_key on content_items (url);

-- A stable external id helps idempotent upserts where the URL can change
-- (e.g. GitHub release retag). Optional; populated by integrations when known.
alter table content_items
  add column if not exists external_id text;

create unique index if not exists content_items_source_external_key
  on content_items (source_type, external_id)
  where external_id is not null;

-- /status must be honestly visible to visitors (Part 7, M2 step 7). sync_logs
-- holds no secrets — only observability — so allow public read. Writes remain
-- service-role only (no insert/update policy).
alter table sync_logs enable row level security;

drop policy if exists "public read sync_logs" on sync_logs;
create policy "public read sync_logs"
  on sync_logs for select to anon, authenticated using (true);
