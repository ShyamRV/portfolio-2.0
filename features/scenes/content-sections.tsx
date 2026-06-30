"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Section, sectionReveal } from "./section";
import { REAL_PROFILE } from "@/lib/content/resume-data";

const profile = REAL_PROFILE;
const resume = profile.resume_json;
const roles = resume?.roles ?? [];
const publications = resume?.publications ?? [];
const skillGroups = resume?.skillGroups ?? [];
const talks = resume?.talks ?? [];
const socialLinks = profile.social_links ?? [];

function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={sectionReveal}
      className={`holo-panel rounded-xl p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}

/* ── 01 · ESSENCE ─────────────────────────────────────────── */
export function AboutSection() {
  return (
    <Section
      id="essence"
      index="01"
      eyebrow="Essence"
      title={
        <>
          I build <span className="holo-text">autonomous systems</span> that act
          in the real world.
        </>
      }
    >
      <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
        {profile.bio}
      </p>
    </Section>
  );
}

/* ── 02 · JOURNEY (timeline) ──────────────────────────────── */
export function JourneySection() {
  return (
    <Section id="journey" index="02" eyebrow="Journey" title="Operational history">
      <div className="relative space-y-4 border-l border-white/10 pl-6">
        {roles.map((role, i) => (
          <Panel key={`${role.company}-${i}`}>
            <div className="absolute -left-[7px] mt-2 h-3 w-3 -translate-x-1/2 rounded-full bg-synapse-1 glow-cyan" />
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-lg font-semibold">{role.title}</h3>
              <span className="font-mono text-xs text-synapse-1">
                {role.start} — {role.end ?? "present"}
              </span>
            </div>
            <p className="mb-3 text-sm font-medium text-foreground/80">
              {role.company}
              {role.location ? ` · ${role.location}` : ""}
            </p>
            <ul className="space-y-1.5">
              {role.highlights.map((h, j) => (
                <li
                  key={j}
                  className="flex gap-2 text-sm leading-relaxed text-muted-foreground"
                >
                  <span className="mt-1 text-synapse-1">▹</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </Panel>
        ))}
      </div>
    </Section>
  );
}

/* ── 03 · RESEARCH LAB ────────────────────────────────────── */
export function ResearchSection() {
  return (
    <Section
      id="research"
      index="03"
      eyebrow="Research Lab"
      title="Vision & graph intelligence"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {publications.map((pub, i) => (
          <Panel key={i}>
            <p className="sys-label mb-2">Manuscript</p>
            <h3 className="mb-2 font-display text-lg font-semibold leading-snug">
              {pub.title}
            </h3>
            <p className="font-mono text-xs text-synapse-1">{pub.note}</p>
          </Panel>
        ))}
      </div>
    </Section>
  );
}

/* ── 05 · CAPABILITIES (skills + OSS) ─────────────────────── */
export function SkillsSection() {
  const github = socialLinks.find((l) => l.label === "GitHub");
  return (
    <Section
      id="capabilities"
      index="05"
      eyebrow="Capabilities"
      title="The full stack of an AI engineer"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group) => (
          <Panel key={group.label}>
            <p className="sys-label mb-3 text-synapse-1">{group.label}</p>
            <div className="flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-foreground/80"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Panel>
        ))}
      </div>
      {github && (
        <motion.a
          variants={sectionReveal}
          href={github.url}
          target="_blank"
          rel="noreferrer"
          data-cursor="hover"
          className="mt-8 inline-flex items-center gap-2 font-mono text-sm text-synapse-1 hover:text-hologram"
        >
          explore the source on GitHub <ArrowUpRight className="h-4 w-4" />
        </motion.a>
      )}
    </Section>
  );
}

/* ── 06 · SIGNAL (speaking & advocacy) ────────────────────── */
export function SpeakingSection() {
  return (
    <Section
      id="signal"
      index="06"
      eyebrow="Signal"
      title="On stage & in the community"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {talks.map((talk, i) => (
          <Panel key={i}>
            <p className="sys-label mb-2 text-synapse-1">Talk</p>
            <h3 className="mb-2 font-display text-lg font-semibold leading-snug">
              {talk.title}
            </h3>
            <p className="text-sm text-muted-foreground">{talk.venue}</p>
          </Panel>
        ))}
      </div>
    </Section>
  );
}

/* ── 08 · CONTACT PORTAL ──────────────────────────────────── */
export function ContactSection() {
  return (
    <Section
      id="contact"
      index="09"
      eyebrow="Contact Portal"
      title={
        <>
          Let&apos;s build something <span className="holo-text">autonomous</span>.
        </>
      }
      align="center"
    >
      <div className="mx-auto flex max-w-md flex-col items-center gap-4">
        {socialLinks.map((link) => (
          <motion.a
            key={link.label}
            variants={sectionReveal}
            href={link.url}
            target={link.url.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            data-cursor="hover"
            className="holo-panel group flex w-full items-center justify-between rounded-xl px-5 py-4 transition-colors hover:border-synapse-1/40"
          >
            <span className="font-display font-medium">{link.label}</span>
            <ArrowUpRight className="h-4 w-4 text-synapse-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </motion.a>
        ))}
      </div>
    </Section>
  );
}
