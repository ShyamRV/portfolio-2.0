import { Experience } from "@/features/experience/experience";
import { JsonLd, personSchema } from "@/components/seo/json-ld";
import { REAL_PROFILE } from "@/lib/content/resume-data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

const IDENTITIES = [
  "Agentic AI Engineer",
  "Developer Advocate",
  "Computer Vision Researcher",
  "Graph ML Researcher",
  "Robotics Engineer",
  "Open Source Builder",
  "Public Speaker",
  "Community Builder",
  "AI Content Creator",
];

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={personSchema({
          name: REAL_PROFILE.full_name,
          url: siteUrl,
          description: REAL_PROFILE.bio,
          sameAs: (REAL_PROFILE.social_links ?? []).map((s) => s.url),
        })}
      />
      <Experience name={REAL_PROFILE.full_name} identities={IDENTITIES} />
    </>
  );
}
