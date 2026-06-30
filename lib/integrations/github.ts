/**
 * GitHub integration — implemented in MILESTONE 2.
 * Free public REST/GraphQL + webhooks. Reads repos/releases into content_items.
 * Keep sync incremental/chunked to fit the Vercel Hobby function timeout.
 */
export async function syncGitHub(): Promise<{ itemsSynced: number }> {
  throw new Error("Not implemented (Milestone 2)");
}
