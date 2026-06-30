import type { Profile, Project } from "./types";

/**
 * CLEARLY-LABELED PLACEHOLDER CONTENT (Part 1, rule 1).
 *
 * This is NOT real resume data. It exists so the static site renders a
 * realistic shape before the owner provides real content via the database.
 * Every string here is generic/obviously-placeholder on purpose — nothing is
 * a fabricated achievement, metric, or claim about a real person.
 *
 * Real content replaces this by inserting rows into `profile` / `projects`
 * (see supabase/seed.sql for the template). No code change required.
 */

export const PLACEHOLDER_PROFILE: Profile = {
  full_name: "[Your Name]",
  tagline: "[Placeholder tagline — replace with your real one]",
  bio: "[Placeholder bio. This text is scaffolding, not real content. Provide your real bio and it renders here from the profile table.]",
  resume_json: {
    roles: [
      {
        company: "[Company / Org]",
        title: "[Role title]",
        start: "2024-01",
        end: null,
        location: "[Location]",
        highlights: [
          "[Placeholder responsibility — replace with a real, sourced bullet]",
        ],
      },
      {
        company: "[Previous Company]",
        title: "[Previous Role]",
        start: "2022-01",
        end: "2023-12",
        highlights: ["[Placeholder bullet — not a real achievement]"],
      },
    ],
    education: [
      { school: "[School]", credential: "[Degree]", year: "[Year]" },
    ],
    skills: ["[Skill]", "[Skill]", "[Skill]"],
  },
  social_links: [
    { label: "GitHub", url: "https://github.com/" },
    { label: "Email", url: "mailto:hello@example.com" },
  ],
};

export const PLACEHOLDER_PROJECTS: Project[] = [
  {
    id: "placeholder-1",
    slug: "example-project",
    title: "[Example Project] (placeholder)",
    summary:
      "[Placeholder one-line summary. Replace with a real project description.]",
    problem_statement:
      "[Placeholder problem statement — what real problem did this solve?]",
    architecture_notes:
      "[Placeholder architecture notes — real system design goes here.]",
    tech_stack: ["TypeScript", "Next.js", "Postgres"],
    impact_metrics: null, // omit rather than estimate (Part 4)
    tradeoffs: [
      "[Placeholder tradeoff — provide 1–2 real engineering tradeoffs in your own voice.]",
    ],
    demo_url: null,
    repo_url: null,
    status: "active",
    featured: true,
    sort_order: 0,
  },
  {
    id: "placeholder-2",
    slug: "example-project-two",
    title: "[Second Example Project] (placeholder)",
    summary: "[Placeholder summary for a second project.]",
    problem_statement: "[Placeholder problem statement.]",
    architecture_notes: "[Placeholder architecture notes.]",
    tech_stack: ["Python", "pgvector"],
    impact_metrics: null,
    tradeoffs: null,
    demo_url: null,
    repo_url: null,
    status: "wip",
    featured: true,
    sort_order: 1,
  },
];
