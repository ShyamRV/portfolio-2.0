import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/client";
import { isCronAuthorized } from "@/lib/api-auth";

/**
 * Supabase anti-pause keepalive (Part 3).
 *
 * A free Supabase project auto-pauses after 7 consecutive days with zero DB
 * activity. This route touches the DB and records the touch in `sync_logs` so
 * the keepalive is OBSERVABLE, not silent magic. It is wired to a Vercel Cron
 * (see vercel.json) on a cadence comfortably inside the 7-day window.
 *
 * Auth: requires the CRON_SECRET. Vercel Cron sends it via the Authorization
 * header automatically; manual calls must pass `?secret=` or the header.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 30; // keep well under the Hobby function timeout

export async function GET(request: Request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startedAt = new Date().toISOString();

  try {
    const supabase = createServiceClient();

    // Lightweight read to register DB activity.
    const { error: pingError } = await supabase
      .from("sync_logs")
      .select("id", { count: "exact", head: true });
    if (pingError) throw pingError;

    // Record the keepalive so it is visible in sync_logs.
    const finishedAt = new Date().toISOString();
    const { error: logError } = await supabase.from("sync_logs").insert({
      source_type: "keepalive",
      started_at: startedAt,
      finished_at: finishedAt,
      status: "success",
      items_synced: 0,
    });
    if (logError) throw logError;

    return NextResponse.json({ ok: true, source: "keepalive", finishedAt });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";

    // Best-effort failure log; never throw past this point.
    try {
      const supabase = createServiceClient();
      await supabase.from("sync_logs").insert({
        source_type: "keepalive",
        started_at: startedAt,
        finished_at: new Date().toISOString(),
        status: "failed",
        items_synced: 0,
        error_message: message,
      });
    } catch {
      // Supabase not configured yet (Milestone 0) — report cleanly.
    }

    return NextResponse.json(
      { ok: false, source: "keepalive", error: message },
      { status: 503 },
    );
  }
}
