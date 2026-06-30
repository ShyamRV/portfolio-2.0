export type SocialLink = { label: string; url: string };

export type ResumeRole = {
  company: string;
  title: string;
  start: string; // ISO-ish, e.g. "2023-01"
  end: string | null; // null = present
  location?: string;
  highlights: string[];
};

export type ResumePublication = { title: string; note: string };
export type ResumeTalk = { title: string; venue: string };
export type ResumeSkillGroup = { label: string; skills: string[] };

export type ResumeJson = {
  roles: ResumeRole[];
  education?: { school: string; credential: string; year?: string }[];
  skills?: string[];
  skillGroups?: ResumeSkillGroup[];
  publications?: ResumePublication[];
  talks?: ResumeTalk[];
};

export type Profile = {
  full_name: string;
  tagline: string | null;
  bio: string | null;
  resume_json: ResumeJson | null;
  social_links: SocialLink[] | null;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  problem_statement: string | null;
  architecture_notes: string | null;
  tech_stack: string[] | null;
  impact_metrics: Record<string, string> | null; // real, sourced metrics only
  tradeoffs?: string[] | null; // in the owner's own voice — never invented
  demo_url: string | null;
  repo_url: string | null;
  status: "active" | "archived" | "wip";
  featured: boolean;
  sort_order: number;
};

export type ContentItem = {
  id: string;
  source_type: string;
  title: string;
  description: string | null;
  url: string;
  tags: string[] | null;
  published_at: string | null;
  last_synced_at: string | null;
  sync_status: "success" | "partial" | "failed";
};

/**
 * True when the data shown is placeholder scaffolding, not real owner content.
 * The UI must surface this honestly (Part 1, rule 1).
 */
export type WithSource<T> = { data: T; isPlaceholder: boolean };
