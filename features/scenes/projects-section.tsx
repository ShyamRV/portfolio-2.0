"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Section } from "./section";
import { ProjectsConstellation } from "./projects-constellation";
import { REAL_PROJECTS } from "@/lib/content/resume-data";

export function ProjectsSection() {
  const projects = useMemo(
    () =>
      [...REAL_PROJECTS].sort(
        (a, b) =>
          Number(b.featured) - Number(a.featured) ||
          a.sort_order - b.sort_order,
      ),
    [],
  );
  const [selected, setSelected] = useState<string>(projects[0]?.slug ?? "");
  const active = projects.find((p) => p.slug === selected) ?? projects[0]!;

  return (
    <Section
      id="systems"
      index="04"
      eyebrow="Projects Universe"
      title="Systems I've shipped"
    >
      <div className="grid items-center gap-8 lg:grid-cols-2">
        {/* Interactive 3D constellation */}
        <div className="relative h-[44vh] min-h-[320px] w-full lg:h-[60vh]">
          <ProjectsConstellation
            projects={projects}
            selected={selected}
            onSelect={setSelected}
          />
          <p className="sys-label pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-center">
            tap a node to inspect
          </p>
        </div>

        {/* Detail panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.slug}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="holo-panel rounded-2xl p-6 md:p-8"
          >
            <div className="mb-3 flex items-center gap-2">
              {active.featured && (
                <span className="rounded-full border border-synapse-1/40 bg-synapse-1/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-synapse-1">
                  featured
                </span>
              )}
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {active.status}
              </span>
            </div>

            <h3 className="mb-3 font-display text-2xl font-bold leading-tight">
              {active.title}
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              {active.problem_statement ?? active.summary}
            </p>

            {active.impact_metrics && (
              <div className="mb-4 grid grid-cols-2 gap-3">
                {Object.entries(active.impact_metrics).map(([k, v]) => (
                  <div
                    key={k}
                    className="rounded-lg border border-white/10 bg-white/[0.03] p-3"
                  >
                    <p className="font-display text-base font-semibold text-synapse-1">
                      {v}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      {k}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="mb-5 flex flex-wrap gap-2">
              {(active.tech_stack ?? []).map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-[11px] text-foreground/75"
                >
                  {t}
                </span>
              ))}
            </div>

            {active.repo_url && (
              <a
                href={active.repo_url}
                target="_blank"
                rel="noreferrer"
                data-cursor="hover"
                className="inline-flex items-center gap-2 font-mono text-sm text-synapse-1 hover:text-hologram"
              >
                view repository <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </Section>
  );
}
