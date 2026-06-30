import { XMLParser } from "fast-xml-parser";

/**
 * Fetches the latest videos straight from a channel's public RSS feed:
 *   https://www.youtube.com/feeds/videos.xml?channel_id=<id>
 *
 * No API key, no quota, no Supabase dependency — so the Videos section renders
 * as long as YOUTUBE_CHANNEL_ID is set. Fails soft (returns []) on any error.
 */

export interface YouTubeVideo {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  published: string | null;
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});

function asArray<T>(v: T | T[] | undefined): T[] {
  if (v === undefined) return [];
  return Array.isArray(v) ? v : [v];
}

export async function getYouTubeVideos(limit = 6): Promise<YouTubeVideo[]> {
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  if (!channelId) return [];

  try {
    const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(
      channelId,
    )}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "portfolio-site" },
      // Cache for an hour so we don't refetch on every request.
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];

    const xml = await res.text();
    const doc = parser.parse(xml) as Record<string, any>;
    const entries = asArray(doc?.feed?.entry);

    const videos: YouTubeVideo[] = [];
    for (const entry of entries) {
      const id: string | undefined =
        entry?.["yt:videoId"] ?? entry?.["videoId"];
      const title: string | undefined =
        typeof entry?.title === "string"
          ? entry.title
          : entry?.title?.["#text"];
      if (!id || !title) continue;

      const linkNode = asArray(entry.link).find(
        (l: any) => !l?.["@_rel"] || l["@_rel"] === "alternate",
      );
      const watchUrl =
        linkNode?.["@_href"] ?? `https://www.youtube.com/watch?v=${id}`;

      videos.push({
        id,
        title,
        url: watchUrl,
        thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        published: entry?.published ?? entry?.updated ?? null,
      });
    }

    return videos.slice(0, limit);
  } catch {
    return [];
  }
}
