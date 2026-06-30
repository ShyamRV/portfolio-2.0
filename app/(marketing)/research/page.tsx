import type { Metadata } from "next";
import { PlaceholderNotice } from "@/components/sections/placeholder";

export const metadata: Metadata = { title: "Research" };

export default function ResearchPage() {
  return (
    <div className="container space-y-6 py-20">
      <h1 className="text-3xl font-semibold tracking-tight">Research</h1>
      <PlaceholderNotice label="Publications/preprints. ORCID (weekly) + manual-fallback Google Scholar in Milestone 2. No fabricated citations." />
    </div>
  );
}
