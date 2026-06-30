import type { Metadata } from "next";
import { ContentList } from "@/components/sections/content-list";
import { getContentByType } from "@/lib/supabase/queries";

export const metadata: Metadata = { title: "Talks" };
export const dynamic = "force-dynamic";

export default async function TalksPage() {
  const items = await getContentByType(["youtube"]);
  return (
    <div className="container max-w-3xl space-y-8 py-20">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Talks & videos</h1>
        <p className="text-muted-foreground">
          Synced daily from the YouTube channel feed. Only real, sourced videos.
        </p>
      </header>
      <ContentList
        items={items}
        emptyLabel="No videos synced yet. Set YOUTUBE_CHANNEL_ID and the daily sync will populate this."
      />
    </div>
  );
}
