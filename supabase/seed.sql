-- =============================================================================
-- SEED TEMPLATE — Milestone 1
--
-- This is a TEMPLATE with PLACEHOLDER values. Do NOT treat any value here as
-- real. Replace every [bracketed] field with real, owner-provided content
-- before running against a real database (Part 1, rule 1 — never fabricate).
--
-- Until this is run with real data, the site renders the labeled placeholders
-- from lib/content/placeholder-data.ts automatically. Running this seed is
-- OPTIONAL for local rendering; it's how real content goes live.
-- =============================================================================

-- Singleton profile -----------------------------------------------------------
insert into profile (full_name, tagline, bio, resume_json, social_links)
values (
  '[Your Name]',
  '[Your real tagline]',
  '[Your real bio]',
  jsonb_build_object(
    'roles', jsonb_build_array(
      jsonb_build_object(
        'company', '[Company]',
        'title', '[Title]',
        'start', '2024-01',
        'end', null,
        'highlights', jsonb_build_array('[Real, sourced highlight]')
      )
    ),
    'education', jsonb_build_array(
      jsonb_build_object('school', '[School]', 'credential', '[Degree]', 'year', '[Year]')
    ),
    'skills', jsonb_build_array('[Skill]', '[Skill]')
  ),
  jsonb_build_array(
    jsonb_build_object('label', 'GitHub', 'url', 'https://github.com/[handle]')
  )
);

-- Featured project ------------------------------------------------------------
insert into projects (
  slug, title, summary, problem_statement, architecture_notes,
  tech_stack, impact_metrics, demo_url, repo_url, status, featured, sort_order
) values (
  'example-project',
  '[Real Project Title]',
  '[Real one-line summary]',
  '[Real problem statement]',
  '[Real architecture notes]',
  array['TypeScript','Next.js'],
  -- impact_metrics: include ONLY real, sourced numbers; otherwise leave null.
  null,
  null,
  'https://github.com/[handle]/[repo]',
  'active',
  true,
  0
);
