import { parseFeed } from "./rss";
import type { SyncOutcome } from "@/lib/supabase/sync";

/**
 * YouTube integration (Milestone 2). Uses the free channel RSS feed
 * (no API key, no Data API quota) for the lightest footprint:
 *   https://www.youtube.com/feeds/videos.xml?channel_id=<id>
 *
 * Runs on a daily cron. We poll the feed (recent uploads) rather than
 * constantly hitting the Data API; live-stream-aware polling is unnecessary
 * for a once-daily upload digest.
 */
export async function syncYouTube(): Promise<SyncOutcome> {
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  if (!channelId) {
    return {
      status: "failed",
      items: [],
      warnings: ["YOUTUBE_CHANNEL_ID not set"],
    };
  }

  const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "portfolio-sync" },
    next: { revalidate: 0 },
  });
  if (!res.ok) {
    throw new Error(`YouTube feed fetch failed: ${res.status} ${res.statusText}`);
  }

  const xml = await res.text();
  const items = parseFeed(xml, "youtube");
  return { status: "success", items };
}
