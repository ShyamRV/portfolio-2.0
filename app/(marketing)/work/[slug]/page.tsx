import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlaceholderNotice } from "@/components/sections/placeholder";
import { getProjectBySlug, getAllProjectSlugs } from "@/lib/supabase/queries";

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getProjectBySlug(slug);
  if (!result) return { title: "Project not found" };
  return {
    title: result.data.title,
    description: result.data.summary ?? undefined,
  };
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
        {title}
      </h2>
      <div className="text-pretty leading-relaxed">{children}</div>
    </section>
  );
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getProjectBySlug(slug);
  if (!result) notFound();

  const { data: project, isPlaceholder } = result;
  const metrics = project.impact_metrics
    ? Object.entries(project.impact_metrics)
    : [];

  return (
    <article className="container max-w-3xl space-y-10 py-20">
      <header className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight">
          {project.title}
        </h1>
        {project.summary ? (
          <p className="text-lg text-muted-foreground">{project.summary}</p>
        ) : null}
        <div className="flex flex-wrap gap-1.5">
          {(project.tech_stack ?? []).map((t) => (
            <Badge key={t} variant="accent">
              {t}
            </Badge>
          ))}
        </div>
        <div className="flex gap-3">
          {project.demo_url ? (
            <Button asChild size="sm">
              <a href={project.demo_url} target="_blank" rel="noreferrer noopener">
                Live demo
              </a>
            </Button>
          ) : null}
          {project.repo_url ? (
            <Button asChild size="sm" variant="outline">
              <a href={project.repo_url} target="_blank" rel="noreferrer noopener">
                Source
              </a>
            </Button>
          ) : null}
        </div>
      </header>

      {isPlaceholder ? (
        <PlaceholderNotice label="This is a placeholder case study. Real problem/architecture/metrics/tradeoffs come from the projects table." />
      ) : null}

      <Separator />

      {project.problem_statement ? (
        <Section title="Problem">{project.problem_statement}</Section>
      ) : null}
      {project.architecture_notes ? (
        <Section title="Architecture">{project.architecture_notes}</Section>
      ) : null}

      {metrics.length ? (
        <Section title="Impact (real, sourced)">
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {metrics.map(([k, v]) => (
              <div key={k}>
                <dt className="text-sm text-muted-foreground">{k}</dt>
                <dd className="text-xl font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        </Section>
      ) : null}

      {project.tradeoffs?.length ? (
        <Section title="Engineering tradeoffs">
          <ul className="list-disc space-y-1 pl-5">
            {project.tradeoffs.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </Section>
      ) : null}
    </article>
  );
}
