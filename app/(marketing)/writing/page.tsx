import type { Metadata } from "next";
import { ContentList } from "@/components/sections/content-list";
import { getContentByType } from "@/lib/supabase/queries";

export const metadata: Metadata = { title: "Writing" };
export const dynamic = "force-dynamic";

export default async function WritingPage() {
  const items = await getContentByType(["devto", "hashnode", "medium", "manual"]);
  return (
    <div className="container max-w-3xl space-y-8 py-20">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Writing</h1>
        <p className="text-muted-foreground">
          Posts synced from Dev.to / Hashnode / Medium feeds, rendered locally.
        </p>
      </header>
      <ContentList
        items={items}
        emptyLabel="No posts synced yet. Set RSS_FEEDS and the 12h sync will populate this."
      />
    </div>
  );
}
