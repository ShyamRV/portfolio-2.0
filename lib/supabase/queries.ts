import { createPublicClient } from "./client";

/**
 * Read helpers for public data. These run against the anon client and rely on
 * RLS public-read policies (Part 4).
 *
 * NOTE: These return empty arrays gracefully when Supabase is not yet
 * configured (Milestone 0 placeholder state) so the static UI can render.
 */

export type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  tech_stack: string[] | null;
  status: "active" | "archived" | "wip";
  featured: boolean;
  sort_order: number;
};

export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("projects")
      .select("id, slug, title, summary, tech_stack, status, featured, sort_order")
      .eq("featured", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data as Project[]) ?? [];
  } catch {
    // Placeholder state: DB not configured yet (Milestone 0).
    return [];
  }
}

export async function getProfile() {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("profile")
      .select("full_name, tagline, bio, social_links")
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
}
