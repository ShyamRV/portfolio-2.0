import { XMLParser } from "fast-xml-parser";
import type { NormalizedItem, SyncOutcome } from "@/lib/supabase/sync";

/**
 * RSS/Atom integration (Milestone 2). All feeds are free, no auth (Dev.to,
 * Hashnode, Medium). Each feed is fetched in its own try/catch so one broken
 * feed produces a `partial` outcome instead of failing the whole job. Post
 * metadata is stored and rendered locally — we never iframe the original.
 */

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});

function asArray<T>(v: T | T[] | undefined): T[] {
  if (v === undefined) return [];
  return Array.isArray(v) ? v : [v];
}

function text(node: unknown): string | null {
  if (node == null) return null;
  if (typeof node === "string") return node;
  if (typeof node === "object" && "#text" in (node as Record<string, unknown>)) {
    return String((node as Record<string, unknown>)["#text"]);
  }
  return null;
}

/** Parse an RSS 2.0 or Atom feed body into normalized items. */
export function parseFeed(xml: string, sourceType: string): NormalizedItem[] {
  const doc = parser.parse(xml) as Record<string, any>;
  const items: NormalizedItem[] = [];

  // RSS 2.0
  const rssItems = asArray(doc?.rss?.channel?.item);
  for (const it of rssItems) {
    const url = text(it.link);
    const title = text(it.title);
    if (!url || !title) continue;
    items.push({
      source_type: sourceType,
      title,
      description: text(it.description),
      url,
      tags: asArray(it.category).map((c) => text(c) ?? "").filter(Boolean),
      published_at: text(it.pubDate),
    });
  }

  // Atom
  const atomEntries = asArray(doc?.feed?.entry);
  for (const entry of atomEntries) {
    const linkNode = asArray(entry.link).find(
      (l: any) => !l["@_rel"] || l["@_rel"] === "alternate",
    );
    const url = linkNode?.["@_href"] ?? text(entry.link);
    const title = text(entry.title);
    if (!url || !title) continue;
    items.push({
      source_type: sourceType,
      external_id: text(entry.id),
      title,
      description: text(entry.summary) ?? text(entry.content),
      url,
      tags: asArray(entry.category)
        .map((c: any) => c?.["@_term"] ?? text(c) ?? "")
        .filter(Boolean),
      published_at: text(entry.published) ?? text(entry.updated),
    });
  }

  return items;
}

async function fetchFeed(url: string, sourceType: string): Promise<NormalizedItem[]> {
  const res = await fetch(url, {
    headers: { "User-Agent": "portfolio-sync" },
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const xml = await res.text();
  return parseFeed(xml, sourceType);
}

/** Guess a source_type label from a feed URL. */
function sourceFromUrl(url: string): string {
  if (url.includes("dev.to")) return "devto";
  if (url.includes("hashnode")) return "hashnode";
  if (url.includes("medium.com")) return "medium";
  return "manual";
}

export async function syncRss(): Promise<SyncOutcome> {
  const raw = process.env.RSS_FEEDS;
  if (!raw) {
    return { status: "failed", items: [], warnings: ["RSS_FEEDS not set"] };
  }
  const feeds = raw.split(",").map((s) => s.trim()).filter(Boolean);
  const items: NormalizedItem[] = [];
  const warnings: string[] = [];

  for (const url of feeds) {
    try {
      const parsed = await fetchFeed(url, sourceFromUrl(url));
      items.push(...parsed);
    } catch (err) {
      warnings.push(
        `${url}: ${err instanceof Error ? err.message : "failed"}`,
      );
    }
  }

  const status =
    warnings.length === 0
      ? "success"
      : items.length > 0
        ? "partial"
        : "failed";
  return { status, items, warnings };
}
