import type { Metadata } from "next";
import { PlaceholderNotice } from "@/components/sections/placeholder";

export const metadata: Metadata = { title: "Talks" };

export default function TalksPage() {
  return (
    <div className="container space-y-6 py-20">
      <h1 className="text-3xl font-semibold tracking-tight">Talks</h1>
      <PlaceholderNotice label="Talks + YouTube (Data API/RSS, Milestone 2). Only real, sourced talks." />
    </div>
  );
}
