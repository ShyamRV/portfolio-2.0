import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Free-tier-aware rate limiting (Milestone 3, Part 6.6).
 *
 * Sized to the VERIFIED Gemini free tier (ai.google.dev, mid-2026):
 * Flash ≈ 15 RPM, 1,500 RPD, 1M TPM, no card, no expiration. Quotas are
 * project-level and shift over time — all numbers below are env-overridable so
 * we can retune without a code change. We keep deliberate headroom under the
 * real ceiling so one visitor can't burn the whole site's daily quota.
 *
 * Enforced at the edge BEFORE the model call. On exhaustion the caller returns
 * a graceful "at capacity" message, never an error page.
 *
 * NOTE: the per-minute buckets are in-memory (per serverless instance) and act
 * as a burst guard; the DAILY budget is checked against ai_query_logs in the DB
 * so it holds across instances. Documented limitation, acceptable on free tier.
 */

function envInt(name: string, fallback: number): number {
  const v = process.env[name];
  const n = v ? Number.parseInt(v, 10) : NaN;
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

// Global (whole-site) guards — kept under the real Flash ceiling.
const GLOBAL_RPM = envInt("GEMINI_GLOBAL_RPM", 12); // < 15 real
const GLOBAL_RPD_BUDGET = envInt("GEMINI_DAILY_BUDGET", 1200); // < 1500 real

// Per-session guards so a single visitor can't exhaust the global budget.
const SESSION_RPM = envInt("CHAT_SESSION_RPM", 4);
const SESSION_PER_DAY = envInt("CHAT_SESSION_RPD", 40);

type Stamps = number[];
const globalMinute: Stamps = [];
const sessionMinute = new Map<string, Stamps>();
const sessionDay = new Map<string, Stamps>();

function pruned(stamps: Stamps, windowMs: number, now: number): Stamps {
  return stamps.filter((t) => now - t < windowMs);
}

export type RateResult = { allowed: true } | { allowed: false; reason: string };

/**
 * Returns whether a chat request may proceed. Mutates in-memory buckets only
 * when allowed (so denied requests don't consume capacity).
 */
export async function checkRateLimit(
  sessionId: string,
  supabase: SupabaseClient,
): Promise<RateResult> {
  const now = Date.now();
  const MIN = 60_000;
  const DAY = 24 * 60 * 60_000;

  // Global per-minute burst guard.
  const g = pruned(globalMinute, MIN, now);
  if (g.length >= GLOBAL_RPM) {
    return { allowed: false, reason: "global_rpm" };
  }

  // Per-session per-minute.
  const sMin = pruned(sessionMinute.get(sessionId) ?? [], MIN, now);
  if (sMin.length >= SESSION_RPM) {
    return { allowed: false, reason: "session_rpm" };
  }

  // Per-session per-day.
  const sDay = pruned(sessionDay.get(sessionId) ?? [], DAY, now);
  if (sDay.length >= SESSION_PER_DAY) {
    return { allowed: false, reason: "session_daily" };
  }

  // Global daily budget — authoritative across instances via ai_query_logs.
  try {
    const since = new Date(now - DAY).toISOString();
    const { count, error } = await supabase
      .from("ai_query_logs")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since);
    if (!error && typeof count === "number" && count >= GLOBAL_RPD_BUDGET) {
      return { allowed: false, reason: "global_daily" };
    }
  } catch {
    // If the count fails we fall through (in-memory guards still apply).
  }

  // Commit usage.
  g.push(now);
  globalMinute.length = 0;
  globalMinute.push(...g);
  sMin.push(now);
  sessionMinute.set(sessionId, sMin);
  sDay.push(now);
  sessionDay.set(sessionId, sDay);

  return { allowed: true };
}

/** For tests: reset all in-memory buckets. */
export function __resetRateLimiter() {
  globalMinute.length = 0;
  sessionMinute.clear();
  sessionDay.clear();
}
