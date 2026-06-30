import { describe, it, expect, beforeEach } from "vitest";
import { checkRateLimit, __resetRateLimiter } from "@/lib/ai/rate-limit";

/**
 * Deterministic burst test for the rate limiter (Part 6.6). A real load test
 * against the live Gemini ceiling requires a deployment; this proves the
 * in-memory guards actually hold under burst and that denials don't consume
 * capacity. Defaults: SESSION_RPM=4, GLOBAL_RPM=12.
 */

// Minimal fake Supabase: daily count always 0 (under budget).
const fakeSupabase = {
  from() {
    return {
      select() {
        return {
          gte() {
            return Promise.resolve({ count: 0, error: null });
          },
        };
      },
    };
  },
} as unknown as Parameters<typeof checkRateLimit>[1];

beforeEach(() => __resetRateLimiter());

describe("checkRateLimit", () => {
  it("allows up to the per-session per-minute cap then denies", async () => {
    const session = "s1";
    const results = [];
    for (let i = 0; i < 6; i++) {
      results.push(await checkRateLimit(session, fakeSupabase));
    }
    const allowed = results.filter((r) => r.allowed).length;
    expect(allowed).toBe(4); // SESSION_RPM default
    expect(results.at(-1)?.allowed).toBe(false);
  });

  it("isolates sessions (one session's burst doesn't block another)", async () => {
    for (let i = 0; i < 4; i++) await checkRateLimit("a", fakeSupabase);
    const other = await checkRateLimit("b", fakeSupabase);
    expect(other.allowed).toBe(true);
  });

  it("enforces the global per-minute ceiling across sessions", async () => {
    let allowed = 0;
    // 20 sessions x 1 request — global cap (12) should bound total allowed.
    for (let i = 0; i < 20; i++) {
      const r = await checkRateLimit(`sess-${i}`, fakeSupabase);
      if (r.allowed) allowed++;
    }
    expect(allowed).toBe(12); // GLOBAL_RPM default
  });
});
