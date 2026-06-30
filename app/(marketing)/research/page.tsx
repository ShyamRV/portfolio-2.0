import type { Metadata } from "next";
import { ContentList } from "@/components/sections/content-list";
import { getContentByType } from "@/lib/supabase/queries";

export const metadata: Metadata = { title: "Research" };
export const dynamic = "force-dynamic";

export default async function ResearchPage() {
  const items = await getContentByType(["orcid", "scholar", "huggingface", "pypi", "npm"]);
  return (
    <div className="container max-w-3xl space-y-8 py-20">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Research & artifacts</h1>
        <p className="text-muted-foreground">
          Publications (ORCID + manually-added Scholar), models and packages
          (Hugging Face / PyPI / npm), synced weekly.
        </p>
      </header>
      <ContentList
        items={items}
        emptyLabel="Nothing synced yet. Configure the weekly external sources, or add Scholar entries manually (see docs/SCHOLAR_FALLBACK.md)."
      />
    </div>
  );
}
