import type { Metadata } from "next";
import { ProjectCard } from "@/components/sections/project-card";
import { PlaceholderNotice } from "@/components/sections/placeholder";
import { Reveal } from "@/components/motion/reveal";
import { getProjects } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected projects and case studies.",
};

export default async function WorkPage() {
  const { data: projects, isPlaceholder } = await getProjects();

  return (
    <div className="container space-y-8 py-20">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Work</h1>
        <p className="text-muted-foreground">
          Projects, with real problem statements, architecture, and sourced
          metrics only.
        </p>
      </header>
      {isPlaceholder ? (
        <PlaceholderNotice label="Showing placeholder projects. Insert real rows into the projects table to replace them." />
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <Reveal key={p.id} delay={i * 60}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
