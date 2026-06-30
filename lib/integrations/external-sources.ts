/**
 * External low-frequency sources — implemented in MILESTONE 2 (weekly).
 * HF / PyPI / npm / ORCID public JSON APIs, each wrapped in its own try/catch.
 * Google Scholar: best-effort scrape with a DOCUMENTED manual-fallback path;
 * never aggressive enough to risk an IP block. X/Twitter and LinkedIn are NOT
 * auto-synced (manual only) — see Part 3.
 */
export async function syncExternalSources(): Promise<{ itemsSynced: number }> {
  throw new Error("Not implemented (Milestone 2)");
}
