import type { MetadataRoute } from "next";
import { getAllProjectSlugs } from "@/lib/supabase/queries";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/work",
    "/research",
    "/writing",
    "/talks",
    "/resume",
    "/contact",
    "/status",
  ];

  const now = new Date();
  const base: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
  }));

  const slugs = await getAllProjectSlugs();
  const projects: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${siteUrl}/work/${slug}`,
    lastModified: now,
  }));

  return [...base, ...projects];
}
