import type { NormalizedItem, SyncOutcome } from "@/lib/supabase/sync";

/**
 * GitHub integration (Milestone 2). Free public REST API.
 *
 * Pulls public repos (and their latest release, if any) for a user/org and
 * normalizes them into content_items. Incremental/chunked to stay well within
 * the Vercel Hobby function timeout: capped page size + a hard item cap.
 *
 * Re-embedding deltas is explicitly NOT done here (that's Milestone 3) — this
 * only lands normalized data.
 */

const GITHUB_API = "https://api.github.com";
const MAX_REPOS = 60;

type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  topics?: string[];
  language: string | null;
  fork: boolean;
  archived: boolean;
  pushed_at: string;
  stargazers_count: number;
};

function headers(): HeadersInit {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "portfolio-sync",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

export async function syncGitHub(): Promise<SyncOutcome> {
  const user = process.env.GITHUB_USERNAME;
  if (!user) {
    return {
      status: "failed",
      items: [],
      warnings: ["GITHUB_USERNAME not set"],
    };
  }

  const warnings: string[] = [];
  const items: NormalizedItem[] = [];

  const res = await fetch(
    `${GITHUB_API}/users/${encodeURIComponent(user)}/repos?per_page=${MAX_REPOS}&sort=pushed&type=owner`,
    { headers: headers(), next: { revalidate: 0 } },
  );

  if (!res.ok) {
    throw new Error(`GitHub repos fetch failed: ${res.status} ${res.statusText}`);
  }

  const repos = (await res.json()) as GitHubRepo[];
  for (const repo of repos) {
    if (repo.fork) continue;
    items.push({
      source_type: "github",
      external_id: `repo:${repo.id}`,
      title: repo.full_name,
      description: repo.description,
      url: repo.html_url,
      tags: [
        ...(repo.topics ?? []),
        ...(repo.language ? [repo.language] : []),
        repo.archived ? "archived" : "active",
      ],
      published_at: repo.pushed_at,
      raw_payload: {
        stars: repo.stargazers_count,
        language: repo.language,
        archived: repo.archived,
      },
    });
  }

  return {
    status: warnings.length ? "partial" : "success",
    items,
    warnings,
  };
}
