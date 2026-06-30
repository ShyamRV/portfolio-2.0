import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { ProjectCard } from "@/components/sections/project-card";
import { PlaceholderNotice } from "@/components/sections/placeholder";
import type { Project } from "@/lib/content/types";

export function FeaturedWork({
  projects,
  isPlaceholder,
}: {
  projects: Project[];
  isPlaceholder: boolean;
}) {
  return (
    <section className="container py-16">
      <div className="mb-8 flex items-end justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Featured work</h2>
        <Link
          href="/work"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          All work →
        </Link>
      </div>
      {isPlaceholder ? (
        <PlaceholderNotice
          className="mb-6"
          label="These are placeholder projects. Insert real rows into the projects table to replace them."
        />
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal key={p.id} delay={i * 70}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
