import type { Metadata } from "next";
import { PlaceholderNotice } from "@/components/sections/placeholder";

export const metadata: Metadata = { title: "Project" };

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div className="container space-y-6 py-20">
      <h1 className="text-3xl font-semibold tracking-tight">
        Project: <span className="font-mono text-accent">{slug}</span>
      </h1>
      <PlaceholderNotice label="Case study (problem, architecture notes, real impact_metrics only) loads by slug from the projects table in Milestone 1." />
    </div>
  );
}
