import { Hero } from "@/components/sections/hero";
import { Timeline } from "@/components/sections/timeline";
import { FeaturedWork } from "@/components/sections/featured-work";
import { AuroraBackground } from "@/components/motion/aurora-background";
import { JsonLd, personSchema } from "@/components/seo/json-ld";
import { getProfile, getFeaturedProjects } from "@/lib/supabase/queries";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export default async function ClassicHomePage() {
  const [{ data: profile, isPlaceholder: profilePh }, featured] =
    await Promise.all([getProfile(), getFeaturedProjects()]);

  return (
    <>
      {!profilePh ? (
        <JsonLd
          data={personSchema({
            name: profile.full_name,
            url: siteUrl,
            description: profile.bio,
            sameAs: profile.social_links?.map((s) => s.url) ?? [],
          })}
        />
      ) : null}
      <div className="relative">
        <AuroraBackground />
        <Hero profile={profile} isPlaceholder={profilePh} />
      </div>
      <FeaturedWork projects={featured.data} isPlaceholder={featured.isPlaceholder} />
      <Timeline resume={profile.resume_json} />
    </>
  );
}
