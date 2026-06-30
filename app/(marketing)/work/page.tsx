import type { Metadata } from "next";
import { PlaceholderNotice } from "@/components/sections/placeholder";

export const metadata: Metadata = { title: "Work" };

export default function WorkPage() {
  return (
    <div className="container space-y-6 py-20">
      <h1 className="text-3xl font-semibold tracking-tight">Work</h1>
      <PlaceholderNotice label="Project grid renders from the projects table (Part 4). Seeded with real, sourced projects in Milestone 1 — no invented entries." />
    </div>
  );
}
