import type { Metadata } from "next";
import { PlaceholderNotice } from "@/components/sections/placeholder";

export const metadata: Metadata = { title: "Writing" };

export default function WritingPage() {
  return (
    <div className="container space-y-6 py-20">
      <h1 className="text-3xl font-semibold tracking-tight">Writing</h1>
      <PlaceholderNotice label="Posts from MDX (content/posts) + synced Dev.to/Hashnode/Medium RSS feed (Milestone 2)." />
    </div>
  );
}
