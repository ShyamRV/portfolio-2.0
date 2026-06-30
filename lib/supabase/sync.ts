import type { SupabaseClient } from "@supabase/supabase-js";
import { createServiceClient } from "./client";

export type NormalizedItem = {
  source_type: string;
  external_id?: string | null;
  title: string;
  description?: string | null;
  url: string;
  tags?: string[] | null;
  published_at?: string | null;
  raw_payload?: unknown;
};

export type SyncOutcome = {
  status: "success" | "partial" | "failed";
  items: NormalizedItem[];
  /** Non-fatal per-source errors (partial). */
  warnings?: string[];
};

/**
 * Upsert normalized items into content_items, de-duplicated by URL.
 * Returns the number of rows written.
 */
export async function upsertContentItems(
  supabase: SupabaseClient,
  items: NormalizedItem[],
): Promise<number> {
  if (items.length === 0) return 0;
  const now = new Date().toISOString();
  const rows = items.map((it) => ({
    source_type: it.source_type,
    external_id: it.external_id ?? null,
    title: it.title,
    description: it.description ?? null,
    url: it.url,
    tags: it.tags ?? null,
    published_at: it.published_at ?? null,
    raw_payload: it.raw_payload ?? null,
    last_synced_at: now,
    sync_status: "success" as const,
    updated_at: now,
  }));

  const { error } = await supabase
    .from("content_items")
    .upsert(rows, { onConflict: "url" });
  if (error) throw error;
  return rows.length;
}

/**
 * Run a sync job and ALWAYS record a sync_logs row (Part 7, M2 step 5):
 * success, partial (job ran but some sources/items failed), or failed.
 * Never throws — returns a structured result so the route can respond cleanly.
 */
export async function runSync(
  sourceType: string,
  job: (supabase: SupabaseClient) => Promise<SyncOutcome>,
): Promise<{ ok: boolean; status: string; items: number; error?: string }> {
  const startedAt = new Date().toISOString();
  let supabase: SupabaseClient;
  try {
    supabase = createServiceClient();
  } catch (err) {
    return {
      ok: false,
      status: "failed",
      items: 0,
      error: err instanceof Error ? err.message : "supabase not configured",
    };
  }

  try {
    const outcome = await job(supabase);
    const written = await upsertContentItems(supabase, outcome.items);
    const finishedAt = new Date().toISOString();

    await supabase.from("sync_logs").insert({
      source_type: sourceType,
      started_at: startedAt,
      finished_at: finishedAt,
      status: outcome.status,
      items_synced: written,
      error_message: outcome.warnings?.length
        ? outcome.warnings.join("; ").slice(0, 2000)
        : null,
    });

    return { ok: true, status: outcome.status, items: written };
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    try {
      await supabase.from("sync_logs").insert({
        source_type: sourceType,
        started_at: startedAt,
        finished_at: new Date().toISOString(),
        status: "failed",
        items_synced: 0,
        error_message: message.slice(0, 2000),
      });
    } catch {
      // best effort
    }
    return { ok: false, status: "failed", items: 0, error: message };
  }
}
