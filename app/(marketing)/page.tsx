import { Hero } from "@/components/sections/hero";
import { Timeline } from "@/components/sections/timeline";
import { FeaturedWork } from "@/components/sections/featured-work";
import { AuroraBackground } from "@/components/motion/aurora-background";
import { getProfile, getFeaturedProjects } from "@/lib/supabase/queries";

export default async function HomePage() {
  const [{ data: profile, isPlaceholder: profilePh }, featured] =
    await Promise.all([getProfile(), getFeaturedProjects()]);

  return (
    <>
      <div className="relative">
        <AuroraBackground />
        <Hero profile={profile} isPlaceholder={profilePh} />
      </div>
      <FeaturedWork projects={featured.data} isPlaceholder={featured.isPlaceholder} />
      <Timeline resume={profile.resume_json} />
    </>
  );
}
