import type { Metadata } from "next";
import { Timeline } from "@/components/sections/timeline";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PlaceholderNotice } from "@/components/sections/placeholder";
import { getProfile } from "@/lib/supabase/queries";

export const metadata: Metadata = { title: "Resume" };

export default async function ResumePage() {
  const { data: profile, isPlaceholder } = await getProfile();
  const resume = profile.resume_json;

  return (
    <div className="container max-w-3xl space-y-10 py-20">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          {profile.full_name}
        </h1>
        {profile.tagline ? (
          <p className="text-muted-foreground">{profile.tagline}</p>
        ) : null}
      </header>

      {isPlaceholder ? (
        <PlaceholderNotice label="Resume renders from profile.resume_json. This is placeholder structure — nothing here is real." />
      ) : null}

      <Timeline resume={resume} />

      {resume?.education?.length ? (
        <section className="container px-0">
          <h2 className="mb-4 text-2xl font-semibold tracking-tight">
            Education
          </h2>
          <ul className="space-y-2">
            {resume.education.map((e, i) => (
              <li key={i} className="flex justify-between">
                <span>
                  {e.credential} · {e.school}
                </span>
                {e.year ? (
                  <span className="text-muted-foreground">{e.year}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {resume?.skills?.length ? (
        <>
          <Separator />
          <section>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">
              Skills
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {resume.skills.map((s) => (
                <Badge key={s}>{s}</Badge>
              ))}
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
