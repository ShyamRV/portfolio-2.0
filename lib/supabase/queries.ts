import { createPublicClient } from "./client";
import { REAL_PROFILE, REAL_PROJECTS } from "@/lib/content/resume-data";
import type {
  ContentItem,
  Profile,
  Project,
  WithSource,
} from "@/lib/content/types";

/**
 * Read helpers for public data (anon client + RLS public-read, Part 4).
 *
 * When the DB is unconfigured/empty we fall back to the owner's REAL content
 * (lib/content/resume-data.ts) — sourced from the resume, not invented — so
 * `isPlaceholder` is false. Once Supabase is seeded, DB rows take over.
 */

const PROJECT_COLUMNS =
  "id, slug, title, summary, problem_statement, architecture_notes, tech_stack, impact_metrics, demo_url, repo_url, status, featured, sort_order";

export async function getProfile(): Promise<WithSource<Profile>> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("profile")
      .select("full_name, tagline, bio, resume_json, social_links")
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    if (!data) return { data: REAL_PROFILE, isPlaceholder: false };
    return { data: data as Profile, isPlaceholder: false };
  } catch {
    return { data: REAL_PROFILE, isPlaceholder: false };
  }
}

export async function getProjects(): Promise<WithSource<Project[]>> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("projects")
      .select(PROJECT_COLUMNS)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    if (!data || data.length === 0) {
      return { data: REAL_PROJECTS, isPlaceholder: false };
    }
    return { data: data as Project[], isPlaceholder: false };
  } catch {
    return { data: REAL_PROJECTS, isPlaceholder: false };
  }
}

export async function getFeaturedProjects(): Promise<WithSource<Project[]>> {
  const all = await getProjects();
  const featured = all.data.filter((p) => p.featured);
  return { data: featured.length ? featured : all.data, isPlaceholder: all.isPlaceholder };
}

export async function getProjectBySlug(
  slug: string,
): Promise<WithSource<Project> | null> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("projects")
      .select(PROJECT_COLUMNS)
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    if (data) return { data: data as Project, isPlaceholder: false };
  } catch {
    // fall through to local lookup
  }
  const local = REAL_PROJECTS.find((p) => p.slug === slug);
  return local ? { data: local, isPlaceholder: false } : null;
}

export async function getAllProjectSlugs(): Promise<string[]> {
  const { data } = await getProjects();
  return data.map((p) => p.slug);
}

export async function getContentItems(
  limit = 50,
): Promise<WithSource<ContentItem[]>> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("content_items")
      .select(
        "id, source_type, title, description, url, tags, published_at, last_synced_at, sync_status",
      )
      .order("published_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return { data: (data as ContentItem[]) ?? [], isPlaceholder: false };
  } catch {
    return { data: [], isPlaceholder: true };
  }
}

export async function getContentByType(
  sourceTypes: string[],
  limit = 50,
): Promise<ContentItem[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("content_items")
      .select(
        "id, source_type, title, description, url, tags, published_at, last_synced_at, sync_status",
      )
      .in("source_type", sourceTypes)
      .order("published_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data as ContentItem[]) ?? [];
  } catch {
    return [];
  }
}

export type SyncLogRow = {
  source_type: string;
  started_at: string;
  finished_at: string | null;
  status: "success" | "partial" | "failed" | null;
  items_synced: number | null;
  error_message: string | null;
};

export async function getRecentSyncLogs(limit = 25): Promise<SyncLogRow[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("sync_logs")
      .select(
        "source_type, started_at, finished_at, status, items_synced, error_message",
      )
      .order("started_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data as SyncLogRow[]) ?? [];
  } catch {
    return [];
  }
}
