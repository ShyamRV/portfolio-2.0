import { Reveal } from "@/components/motion/reveal";
import type { ResumeJson } from "@/lib/content/types";

function formatRange(start: string, end: string | null): string {
  return `${start} — ${end ?? "Present"}`;
}

export function Timeline({ resume }: { resume: ResumeJson | null }) {
  const roles = resume?.roles ?? [];
  if (roles.length === 0) return null;

  return (
    <section className="container py-16">
      <h2 className="mb-8 text-2xl font-semibold tracking-tight">Experience</h2>
      <ol className="relative border-l border-border pl-6">
        {roles.map((role, i) => (
          <li key={`${role.company}-${role.start}`} className="mb-10 last:mb-0">
            <Reveal delay={i * 60}>
              <span
                aria-hidden
                className="absolute -left-[5px] mt-1.5 h-2.5 w-2.5 rounded-full bg-accent"
              />
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {formatRange(role.start, role.end)}
              </p>
              <h3 className="mt-1 text-lg font-medium">
                {role.title} ·{" "}
                <span className="text-muted-foreground">{role.company}</span>
              </h3>
              {role.location ? (
                <p className="text-sm text-muted-foreground">{role.location}</p>
              ) : null}
              {role.highlights.length ? (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {role.highlights.map((h, j) => (
                    <li key={j}>{h}</li>
                  ))}
                </ul>
              ) : null}
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
